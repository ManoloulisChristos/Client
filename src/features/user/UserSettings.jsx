import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  useDeleteAccountMutation,
  useGetUserQuery,
  useUpdatePasswordMutation,
  useUpdateUsernameMutation,
} from './userApiSlice';

import '../../styles/UserSettings.scss';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';
import { useDispatch } from 'react-redux';
import { createToast } from '../toast/toastsSlice';
import Spinner from '../../components/Spinner';
import HelmetWrapper from '../../components/HelmetWrapper';

const UserSettings = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmNewPasswordValue, setConfirmNewPasswordValue] = useState('');
  const [deleteAccountPasswordValue, setDeleteAccountPasswordValue] =
    useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showDeleteAccountPassword, setShowDeleteAccountPassword] =
    useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [deleteAccountPasswordError, setDeleteAccountPasswordError] =
    useState('');

  // Refs
  const passwordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);
  const deleteAccountPasswordRef = useRef(null);
  const submitUpdatePasswordButtonRef = useRef(null);
  const submitDeleteAccountButtonRef = useRef(null);

  // Api Requests
  const { data: user, isLoading } = useGetUserQuery({ id });
  const [updateUsername] = useUpdateUsernameMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  // Event handlers
  const handleUsernameChange = (e) => setUsernameValue(e.target.value);
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);
  const handleNewPasswordChange = (e) => setNewPasswordValue(e.target.value);
  const handleConfirmNewPasswordChange = (e) =>
    setConfirmNewPasswordValue(e.target.value);
  const handleDeleteAccountPasswordChange = (e) =>
    setDeleteAccountPasswordValue(e.target.value);

  const handleUsernameValidation = (e) => {
    const username = e.target;
    if (username.validity.valueMissing) {
      setUsernameError('Username is required.');
    } else if (username.validity.tooShort || username.validity.tooLong) {
      setUsernameError('Username must be 4-15 characters long.');
    } else if (username.validity.patternMismatch) {
      setUsernameError(
        'Username must start with a letter and have no special characters or spaces.'
      );
    }
  };

  const handlePasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setPasswordError('Password is required.');
    }
  };

  const handleNewPasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setNewPasswordError('New password is required.');
    } else if (password.validity.patternMismatch) {
      setNewPasswordError(
        'Provide a password 8-24 characters long that includes a number, a special character (@!#%$), an uppercase and a lowercase letter.'
      );
    }
  };

  const handleConfirmNewPasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setConfirmNewPasswordError('Confirmation is required.');
    }
  };

  const handleDeleteAccountPasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setDeleteAccountPasswordError('Password is required.');
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    // Reset error message
    setUsernameError('');

    // Trigger validity check
    if (!e.target.checkValidity()) {
      return;
    } else {
      try {
        await updateUsername({ id, username: usernameValue }).unwrap();
        dispatch(createToast('success', 'Username updated successfully'));
      } catch (error) {
        if (error.status === 409) {
          setUsernameError('Username already exists.');
        } else {
          dispatch(createToast('error', error?.data?.message));
        }
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');
    if (!e.target.checkValidity()) {
      return;
    } else if (newPasswordValue !== confirmNewPasswordValue) {
      setConfirmNewPasswordError('Passwords do not match.');
    } else {
      // All inputs are valid > check the type for the password input before making the request
      const passwordType = passwordRef.current.getAttribute('type');
      const newPasswordType = newPasswordRef.current.getAttribute('type');
      const confirmNewPasswordType =
        confirmNewPasswordRef.current.getAttribute('type');
      if (
        passwordType === 'text' ||
        newPasswordType === 'text' ||
        confirmNewPasswordType === 'text'
      ) {
        setShowPassword(false);
        setShowNewPassword(false);
        setShowConfirmNewPassword(false);
        //After changing the type re-submit the form (cannot trigger it otherwise)
        setTimeout(() => {
          e.target.requestSubmit(submitUpdatePasswordButtonRef.current);
        }, 0);
      } else {
        try {
          await updatePassword({
            id,
            password: passwordValue,
            newPassword: newPasswordValue,
          }).unwrap();
          setPasswordValue('');
          setNewPasswordValue('');
          setConfirmNewPasswordValue('');
          dispatch(createToast('success', 'Password updated successfully'));
        } catch (error) {
          if (error.data.message.startsWith('Password is not correct')) {
            setPasswordError('Password is not correct.');
          } else {
            dispatch(createToast('error', error?.data?.message));
          }
        }
      }
    }
  };

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    setDeleteAccountPasswordError('');
    if (!e.target.checkValidity()) {
      return;
    } else {
      const passwordType =
        deleteAccountPasswordRef.current.getAttribute('type');
      if (passwordType === 'text') {
        setShowDeleteAccountPassword(false);
        setTimeout(() => {
          e.target.requestSubmit(submitUpdatePasswordButtonRef.current);
        }, 0);
      } else {
        try {
          await deleteAccount({
            id,
            password: deleteAccountPasswordValue,
          }).unwrap();
          navigate('/');
        } catch (error) {
          if (error?.data?.message.startsWith('Password is not')) {
            setDeleteAccountPasswordError('Password is not correct.');
          } else {
            createToast('error', error?.data?.message);
          }
        }
      }
    }
  };

  const formatDate = (date) => {
    const intl = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    const normDate = new Date(date);

    if (isNaN(normDate.getTime())) {
      return null;
    } else {
      return intl.format(normDate);
    }
  };

  return (
    <div className='user-settings'>
      <HelmetWrapper title='Settings' noIndex={true} />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h1 className='user-settings__heading'>Account Settings</h1>
          <div className='user-settings__paragraph-wrapper'>
            <p>
              Email: <span className='user-settings__test'>{user?.email}</span>
            </p>
            <p>
              Username:{' '}
              <span className='user-settings__test'>{user?.username}</span>
            </p>
            <p>
              Account created at:{' '}
              <span className='user-settings__test'>
                {formatDate(user?.createdAt)}
              </span>
            </p>
            <p>
              Latest update:{' '}
              <span className='user-settings__test'>
                {formatDate(user?.updatedAt)}
              </span>
            </p>
          </div>

          <form
            className='user-settings__form user-settings__form--username'
            onSubmit={handleUsernameSubmit}
            noValidate>
            <fieldset className='user-settings__fieldset'>
              <legend className='user-settings__legend'>Change Username</legend>
              <div className='user-settings__input-container'>
                <div className='user-settings__label-wrapper'>
                  <label
                    htmlFor='user-settings-username-input'
                    className='user-settings__label'>
                    New username
                  </label>
                  <Tooltip
                    text='4-15 characters long and it must start with a letter'
                    id='user-settings-username-info'
                    tip='top'
                    hasWrapper={true}>
                    <p className='user-settings__help-icon-wrapper has-tooltip-with-wrapper'>
                      <Icons name='help' width='20' height='20' />
                    </p>
                  </Tooltip>
                </div>
                <div className='user-settings__input-wrapper'>
                  <input
                    id='user-settings-username-input'
                    className='user-settings__input'
                    type='text'
                    required
                    minLength={4}
                    maxLength={20}
                    autoComplete='off'
                    pattern='^[a-zA-Z]+[0-9]*$'
                    aria-describedby='user-settings-username-error'
                    aria-details='user-settings-username-info'
                    aria-invalid={usernameError}
                    value={usernameValue}
                    onChange={handleUsernameChange}
                    onInvalid={handleUsernameValidation}
                  />
                  <p
                    className='user-settings__error'
                    aria-live='assertive'
                    id='user-settings-username-error'>
                    {usernameError}
                  </p>
                </div>
              </div>
              <button type='submit' className='user-settings__button'>
                Save
              </button>
            </fieldset>
          </form>
          <form
            className='user-settings__form user-settings__form--username'
            onSubmit={handlePasswordSubmit}
            noValidate>
            <fieldset className='user-settings__fieldset'>
              <legend className='user-settings__legend'>Change Password</legend>
              <div className='user-settings__input-container'>
                <div className='user-settings__label-wrapper'>
                  <label
                    htmlFor='user-settings-password-input'
                    className='user-settings__label'>
                    Password
                  </label>
                </div>
                <div className='user-settings__input-wrapper'>
                  <input
                    ref={passwordRef}
                    id='user-settings-password-input'
                    className='user-settings__input'
                    type={showPassword ? 'text' : 'password'}
                    required
                    maxLength='24'
                    autoComplete='off'
                    aria-describedby='user-settings-password-error'
                    aria-invalid={passwordError}
                    value={passwordValue}
                    onChange={handlePasswordChange}
                    onInvalid={handlePasswordValidation}
                  />
                  <button
                    className='user-settings__show-password has-tooltip'
                    type='button'
                    aria-pressed={showPassword}
                    aria-controls='user-settings-password-input'
                    onClick={() => setShowPassword((s) => !s)}>
                    <span className='visually-hidden'>Password Visibility</span>
                    <Icons
                      name={showPassword ? 'eye' : 'eyeOff'}
                      width='20'
                      height='20'
                    />
                    <span aria-hidden='true'>
                      <Tooltip
                        text={showPassword ? 'Hide' : 'Show'}
                        tip='bottom'
                        hasWrapper={false}
                      />
                    </span>
                  </button>
                  <p
                    className='user-settings__error'
                    aria-live='assertive'
                    id='user-settings-password-error'>
                    {passwordError}
                  </p>
                </div>
              </div>
              <div className='user-settings__input-container'>
                <div className='user-settings__label-wrapper'>
                  <label
                    htmlFor='user-settings-new-password-input'
                    className='user-settings__label'>
                    New password
                  </label>
                  <Tooltip
                    text='8-24 characters long, number, special character (@!#%$), uppercase and lowercase letters are all required'
                    id='user-settings-new-password-info'
                    tip='top'
                    hasWrapper={true}>
                    <p className='has-tooltip-with-wrapper'>
                      <Icons name='help' width='20' height='20' />
                    </p>
                  </Tooltip>
                </div>
                <div className='user-settings__input-wrapper'>
                  <input
                    ref={newPasswordRef}
                    id='user-settings-new-password-input'
                    className='user-settings__input'
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    pattern='^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,24}$' //at least one uppercase, lowercase letter, special char, number
                    maxLength='24'
                    autoComplete='off'
                    aria-describedby='user-settings-new-password-error'
                    aria-details='user-settings-new-password-info'
                    aria-invalid={newPasswordError}
                    value={newPasswordValue}
                    onChange={handleNewPasswordChange}
                    onInvalid={handleNewPasswordValidation}
                  />
                  <button
                    className='user-settings__show-password has-tooltip'
                    type='button'
                    aria-pressed={showNewPassword}
                    aria-controls='user-settings-new-password-input'
                    onClick={() => setShowNewPassword((s) => !s)}>
                    <span className='visually-hidden'>Password Visibility</span>
                    <Icons
                      name={showNewPassword ? 'eye' : 'eyeOff'}
                      width='20'
                      height='20'
                    />
                    <span aria-hidden='true'>
                      <Tooltip
                        text={showNewPassword ? 'Hide' : 'Show'}
                        tip='bottom'
                        hasWrapper={false}
                      />
                    </span>
                  </button>
                  <p
                    className='user-settings__error'
                    aria-live='assertive'
                    id='user-settings-new-password-error'>
                    {newPasswordError}
                  </p>
                </div>
              </div>
              <div className='user-settings__input-container'>
                <div className='user-settings__label-wrapper'>
                  <label
                    htmlFor='user-settings-confirm-new-password-input'
                    className='user-settings__label'>
                    Confirm new password
                  </label>
                </div>
                <div className='user-settings__input-wrapper'>
                  <input
                    ref={confirmNewPasswordRef}
                    id='user-settings-confirm-new-password-input'
                    className='user-settings__input'
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    required
                    maxLength='24'
                    autoComplete='off'
                    aria-describedby='user-settings-confirm-new-password-error'
                    aria-invalid={confirmNewPasswordError}
                    value={confirmNewPasswordValue}
                    onChange={handleConfirmNewPasswordChange}
                    onInvalid={handleConfirmNewPasswordValidation}
                  />
                  <button
                    className='user-settings__show-password has-tooltip'
                    type='button'
                    aria-pressed={showConfirmNewPassword}
                    aria-controls='user-settings-confirm-new-password-input'
                    onClick={() => setShowConfirmNewPassword((s) => !s)}>
                    <span className='visually-hidden'>Password Visibility</span>
                    <Icons
                      name={showConfirmNewPassword ? 'eye' : 'eyeOff'}
                      width='20'
                      height='20'
                    />
                    <span aria-hidden='true'>
                      <Tooltip
                        text={showConfirmNewPassword ? 'Hide' : 'Show'}
                        tip='bottom'
                        hasWrapper={false}
                      />
                    </span>
                  </button>
                  <p
                    className='user-settings__error'
                    aria-live='assertive'
                    id='user-settings-confirm-new-password-error'>
                    {confirmNewPasswordError}
                  </p>
                </div>
              </div>
              <button type='submit' className='user-settings__button'>
                Save
              </button>
            </fieldset>
          </form>
          <form
            className='user-settings__form user-settings__form--username'
            onSubmit={handleDeleteAccountSubmit}
            noValidate>
            <fieldset className='user-settings__fieldset'>
              <legend className='user-settings__legend'>
                Account Deletion
              </legend>
              <div className='user-settings__input-container'>
                <div className='user-settings__label-wrapper'>
                  <label
                    htmlFor='user-settings-delete-password-input'
                    className='user-settings__label'>
                    Password
                  </label>
                </div>
                <div className='user-settings__input-wrapper'>
                  <input
                    ref={deleteAccountPasswordRef}
                    id='user-settings-delete-password-input'
                    className='user-settings__input'
                    type={showDeleteAccountPassword ? 'text' : 'password'}
                    required
                    maxLength='24'
                    autoComplete='off'
                    aria-describedby='user-settings-delete-password-error'
                    aria-invalid={deleteAccountPasswordError}
                    value={deleteAccountPasswordValue}
                    onChange={handleDeleteAccountPasswordChange}
                    onInvalid={handleDeleteAccountPasswordValidation}
                  />
                  <button
                    className='user-settings__show-password has-tooltip'
                    type='button'
                    aria-pressed={showDeleteAccountPassword}
                    aria-controls='user-settings-delete-password-input'
                    onClick={() => setShowDeleteAccountPassword((s) => !s)}>
                    <span className='visually-hidden'>Password Visibility</span>
                    <Icons
                      name={showDeleteAccountPassword ? 'eye' : 'eyeOff'}
                      width='20'
                      height='20'
                    />
                    <span aria-hidden='true'>
                      <Tooltip
                        text={showPassword ? 'Hide' : 'Show'}
                        tip='bottom'
                        hasWrapper={false}
                      />
                    </span>
                  </button>
                  <p
                    className='user-settings__error'
                    aria-live='assertive'
                    id='user-settings-delete-password-error'>
                    {deleteAccountPasswordError}
                  </p>
                </div>
              </div>
              <button
                ref={submitDeleteAccountButtonRef}
                type='submit'
                className='user-settings__button user-settings__button--delete-account'>
                Delete Account
              </button>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
};

export default UserSettings;
