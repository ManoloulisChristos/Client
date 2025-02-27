import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useRegisterMutation } from './authApiSlice';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';
import '../../styles/Register.scss';
import usePersist from '../../hooks/usePersist';
import { useNavigate } from 'react-router';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showGenericError, setShowGenericError] = useState(false);
  // toggle buttons
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [persist, setPersist] = usePersist();

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [register, { error }] = useRegisterMutation();

  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handleUsernameChange = (e) => setUsernameValue(e.target.value);
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);
  const handleConfirmPasswordChange = (e) =>
    setConfirmPasswordValue(e.target.value);

  const handleCheckboxChange = () => setPersist((s) => !s);

  ///// Validation process /////
  // Validation starts when the user presses the submit form button. Inside onSubmit is a checkValidity() call which triggers,
  // all onInvalid events on each input element, if there is an error then the error message paragraph gets populated with
  // the text and read out loud with aria-live assertive. Because the aria-errormessage attribute has no support at the moment
  // of creating this the aria-describedby is the only solution to associate the message with the invalid input field and
  // the aria-invalid property. Also because aria-describedby is used for the error-message, aria-details is used instead
  // about the information for each field.

  const handleEmailValidation = (e) => {
    const email = e.target;
    if (email.validity.valueMissing) {
      setEmailError('Email is required.');
    } else if (email.validity.typeMismatch) {
      setEmailError('Provide correct email syntax.');
    }
  };

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
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setShowGenericError(false);
    // Check validity and also trigger onInvalid events (form has noValidate attribute)
    if (!e.target.checkValidity()) {
      return;
    } else if (passwordValue !== confirmPasswordValue) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      // All inputs are valid > check the type for the password input before making the request
      const passwordType = passwordRef.current.getAttribute('type');
      const confirmPasswordType =
        confirmPasswordRef.current.getAttribute('type');
      if (passwordType === 'text' || confirmPasswordType === 'text') {
        setShowPassword(false);
        setShowConfirmPassword(false);
        //After changing the type re-submit the form (cannot trigger it otherwise)
        setTimeout(() => {
          e.target.requestSubmit(submitButtonRef.current);
        }, 0);
      } else {
        try {
          const { accessToken, userIdToken } = await register({
            email: emailValue,
            username: usernameValue,
            password: passwordValue,
            persist,
          }).unwrap();
          dispatch(setCredentials({ accessToken, userIdToken }));
          navigate('/auth/welcome');
        } catch (error) {
          if (error?.status === 409) {
            if (error.data.details[0].field === 'email') {
              setEmailError('Email already exists.');
            } else if (error.data.details[0].field === 'username') {
              setUsernameError('Username already exists.');
            }
          } else {
            setShowGenericError(true);
          }
        }
      }
    }
  };

  return (
    <div className='register'>
      <h1 className='register__heading'>Create a new account</h1>
      {showGenericError && (
        <p className='register__generic-error' aria-live='assertive'>
          Error: {error?.data?.message}
        </p>
      )}
      <form className='register__form' onSubmit={handleSubmit} noValidate>
        <div className='register__input-container'>
          <div className='register__label-wrapper'>
            <label
              htmlFor='register-email-input'
              className='register__label'
              aria-describedby='input-details-test'>
              Email
            </label>
          </div>
          <div className='register__input-wrapper'>
            <input
              id='register-email-input'
              className='register__input'
              type='email'
              required
              aria-describedby='register-email-error'
              aria-invalid={emailError ? 'true' : 'false'}
              value={emailValue}
              onChange={handleEmailChange}
              onInvalid={handleEmailValidation}
            />
            <p
              className='register__error'
              aria-live='assertive'
              id='register-email-error'>
              {emailError}
            </p>
          </div>
        </div>
        <div className='register__input-container'>
          <div className='register__label-wrapper'>
            <label
              htmlFor='register-username-input'
              className='register__label'>
              Username
            </label>
            <Tooltip
              text='4-15 characters long and it must start with a letter'
              id='register-username-info'
              tip='top'
              hasWrapper={true}>
              <p className='register__help-icon-wrapper has-tooltip-with-wrapper'>
                <Icons name='help' width='20' height='20' />
              </p>
            </Tooltip>
          </div>
          <div className='register__input-wrapper'>
            <input
              id='register-username-input'
              className='register__input'
              type='text'
              required
              minLength={4}
              maxLength={20}
              autoComplete='off'
              pattern='^[a-zA-Z]+[0-9]*$'
              aria-describedby='register-username-error'
              aria-details='register-username-info'
              aria-invalid={usernameError ? 'true' : 'false'}
              value={usernameValue}
              onChange={handleUsernameChange}
              onInvalid={handleUsernameValidation}
            />
            <p
              className='register__error'
              aria-live='assertive'
              id='register-username-error'>
              {usernameError}
            </p>
          </div>
        </div>
        <div className='register__input-container'>
          <div className='register__label-wrapper'>
            <label
              htmlFor='register-password-input'
              className='register__label'>
              Password
            </label>
            <Tooltip
              text='8-24 characters long, number, special character (@!#%$), uppercase and lowercase letters are all required'
              id='register-password-info'
              tip='top'
              hasWrapper={true}>
              <p className='has-tooltip-with-wrapper'>
                <Icons name='help' width='20' height='20' />
              </p>
            </Tooltip>
          </div>
          <div className='register__input-wrapper'>
            <input
              ref={passwordRef}
              id='register-password-input'
              className='register__input'
              type={showPassword ? 'text' : 'password'}
              required
              pattern='^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,24}$' //at least one uppercase, lowercase letter, special char, number
              maxLength='24'
              autoComplete='off'
              aria-describedby='register-password-error'
              aria-details='register-password-info'
              aria-invalid={passwordError ? 'true' : 'false'}
              value={passwordValue}
              onChange={handlePasswordChange}
              onInvalid={handlePasswordValidation}
            />
            <button
              className='register__show-password has-tooltip'
              type='button'
              aria-pressed={showPassword ? 'true' : 'false'}
              aria-controls='register-password-input'
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
              className='register__error'
              aria-live='assertive'
              id='register-password-error'>
              {passwordError}
            </p>
          </div>
        </div>
        <div className='register__input-container'>
          <div className='register__label-wrapper'>
            <label
              htmlFor='register-confirm-password-input'
              className='register__label'>
              Confirm password
            </label>
          </div>
          <div className='register__input-wrapper'>
            <input
              ref={confirmPasswordRef}
              id='register-confirm-password-input'
              className='register__input'
              type={showConfirmPassword ? 'text' : 'password'}
              required
              maxLength='24'
              autoComplete='off'
              aria-describedby='register-confirm-password-error'
              aria-invalid={confirmPasswordError ? 'true' : 'false'}
              value={confirmPasswordValue}
              onChange={handleConfirmPasswordChange}
              onInvalid={handleConfirmPasswordValidation}
            />
            <button
              className='register__show-password has-tooltip'
              type='button'
              aria-pressed={showConfirmPassword ? 'true' : 'false'}
              aria-controls='register-password-input'
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
              className='register__error'
              aria-live='assertive'
              id='register-confirm-password-error'>
              {confirmPasswordError}
            </p>
          </div>
        </div>

        <div className='register__checkbox-container'>
          <input
            id='register-persist-checkbox'
            className='register__checkbox'
            type='checkbox'
            onChange={handleCheckboxChange}
            checked={persist}
          />
          <label
            htmlFor='register-persist-checkbox'
            className='register__label'>
            Stay signed in
          </label>
        </div>

        <button
          ref={submitButtonRef}
          className='register__submit'
          type='submit'>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Register;
