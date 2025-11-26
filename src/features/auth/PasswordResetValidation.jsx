import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  useGetPasswordValidationQuery,
  useSendNewPasswordMutation,
} from './authApiSlice';
import Tooltip from '../../components/Tooltip';
import Icons from '../../components/Icons';
import '../../styles/PasswordResetValidation.scss';
import HelmetWrapper from '../../components/HelmetWrapper';

const PasswordResetValidation = () => {
  const [searchParams] = useSearchParams();

  const user = searchParams.get('user');
  const token = searchParams.get('token');

  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [genericError, setGenericError] = useState('');

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const { data, isError, error } = useGetPasswordValidationQuery({
    user,
    token,
  });

  const [sendNewPassword] = useSendNewPasswordMutation();

  const handlePasswordChange = (e) => setPasswordValue(e.target.value);
  const handleConfirmPasswordChange = (e) =>
    setConfirmPasswordValue(e.target.value);

  const handlePasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setPasswordError('Password is required.');
    } else if (password.validity.patternMismatch) {
      setPasswordError(
        'Provide a password 8-24 characters long that includes a number, a special character (@!#%$), an uppercase and a lowercase letter.'
      );
    }
  };

  const handleConfirmPasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setConfirmPasswordError('Confirmation is required.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset all errors and then check for validity again
    setPasswordError('');
    setConfirmPasswordError('');
    setGenericError('');
    // Check validity and also trigger onInvalid events (form has noValidate attribute)
    if (!e.target.checkValidity()) {
      return;
    } else if (passwordValue !== confirmPasswordValue) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      // All inputs are valid >>> check the type for the password input before making the request
      const password = passwordRef.current.getAttribute('type');
      const confirmPassword = confirmPasswordRef.current.getAttribute('type');
      if (password === 'text' || confirmPassword === 'text') {
        setShowPassword(false);
        setShowConfirmPassword(false);
        //After changing the type re-submit the form (cannot trigger it otherwise)
        setTimeout(() => {
          e.target.requestSubmit(submitButtonRef.current);
        }, 0);
      } else {
        try {
          await sendNewPassword({
            password: passwordValue,
            user,
            token,
          }).unwrap();
        } catch (error) {
          console.log(error);
          setGenericError(error.data.message);
        }
      }
    }
  };

  return (
    <>
      <HelmetWrapper title='Password Reset Validation' noIndex={true} />
      <div className='password-validation'>
        {isError ? (
          <>
            <h1 className='password-validation__heading'>
              {error?.data?.error}
            </h1>
            <p className='password-validation__generic-error'>
              Error: {error?.data?.message}
            </p>
          </>
        ) : (
          <>
            <h1 className='password-validation__heading'>Reset Password</h1>

            {genericError && (
              <p className='register__generic-error' aria-live='assertive'>
                Error: {genericError}
              </p>
            )}
            <form
              className='password-validation__form'
              onSubmit={handleSubmit}
              noValidate>
              <div className='password-validation__input-container'>
                <div className='password-validation__label-wrapper'>
                  <label
                    htmlFor='password-validation-password-input'
                    className='password-validation__label'>
                    New password
                  </label>
                  <Tooltip
                    text='8-24 characters long, number, special character (@!#%$), uppercase and lowercase letters are all required'
                    id='password-validation-password-info'
                    tip='top'
                    hasWrapper={true}>
                    <p className='has-tooltip-with-wrapper'>
                      <Icons name='help' width='20' height='20' />
                    </p>
                  </Tooltip>
                </div>
                <div className='password-validation__input-wrapper'>
                  <input
                    ref={passwordRef}
                    id='password-validation-password-input'
                    className='password-validation__input'
                    type={showPassword ? 'text' : 'password'}
                    required
                    pattern='^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,24}$' //at least one uppercase, lowercase letter, special char, number
                    maxLength='24'
                    autoComplete='off'
                    aria-describedby='password-validation-password-error'
                    aria-details='password-validation-password-info'
                    aria-invalid={passwordError ? 'true' : 'false'}
                    value={passwordValue}
                    onChange={handlePasswordChange}
                    onInvalid={handlePasswordValidation}
                  />
                  <button
                    className='password-validation__show-password has-tooltip'
                    type='button'
                    aria-pressed={showPassword ? 'true' : 'false'}
                    aria-controls='password-validation-password-input'
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
                    className='password-validation__error'
                    aria-live='assertive'
                    id='password-validation-password-error'>
                    {passwordError}
                  </p>
                </div>
              </div>
              <div className='password-validation__input-container'>
                <div className='password-validation__label-wrapper'>
                  <label
                    htmlFor='password-validation-confirm-password-input'
                    className='password-validation__label'>
                    Confirm new password
                  </label>
                </div>
                <div className='password-validation__input-wrapper'>
                  <input
                    ref={confirmPasswordRef}
                    id='password-validation-confirm-password-input'
                    className='password-validation__input'
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    maxLength='24'
                    autoComplete='off'
                    aria-describedby='password-validation-confirm-password-error'
                    aria-invalid={confirmPasswordError ? 'true' : 'false'}
                    value={confirmPasswordValue}
                    onChange={handleConfirmPasswordChange}
                    onInvalid={handleConfirmPasswordValidation}
                  />
                  <button
                    className='password-validation__show-password has-tooltip'
                    type='button'
                    aria-pressed={showConfirmPassword ? 'true' : 'false'}
                    aria-controls='password-validation-password-input'
                    onClick={() => setShowConfirmPassword((s) => !s)}>
                    <span className='visually-hidden'>
                      Confirm password visibility
                    </span>
                    <Icons
                      name={showConfirmPassword ? 'eye' : 'eyeOff'}
                      width='20'
                      height='20'
                    />
                    <span aria-hidden='true'>
                      <Tooltip
                        text={showConfirmPassword ? 'Hide' : 'Show'}
                        tip='bottom'
                        hasWrapper={false}
                      />
                    </span>
                  </button>
                  <p
                    className='password-validation__error'
                    aria-live='assertive'
                    id='password-validation-confirm-password-error'>
                    {confirmPasswordError}
                  </p>
                </div>
              </div>
              <button
                ref={submitButtonRef}
                className='password-validation__submit'
                type='submit'>
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default PasswordResetValidation;
