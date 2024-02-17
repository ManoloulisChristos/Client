import { useRef, useState } from 'react';
import '../../styles/Register.scss';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';

const Register = () => {
  const [emailValue, setEmailValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  // toggle buttons
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //aria-invalid
  const [isInvalid, setIsInvalid] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handleUsernameChange = (e) => setUsernameValue(e.target.value);
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);
  const handleConfirmPasswordChange = (e) =>
    setConfirmPasswordValue(e.target.value);

  ///// Validation process /////
  // Validation starts when the user presses the submit form button. Inside onSubmit is a checkValidity() call which triggers,
  // all onInvalid events on each input element, if there is an error then the error message paragraph gets populated with
  // the text and read out loud with aria-live assertive. Because the aria-errormessage attribute has no support at the moment
  // of creating this the aria-describedby is the only solution to associate the message with the invalid input field and
  // the aria-invalid property. Also because aria-describedby is used for the error-message, aria-details is used instead
  // about the information for each field.

  const emailValidation = (e) => {
    const email = e.target;
    if (email.validity.valueMissing) {
      setEmailError('Email is required.');
    } else if (email.validity.typeMismatch) {
      setEmailError('Provide correct email syntax.');
    }
    setIsInvalid((s) => ({
      ...s,
      email: true,
    }));
  };

  const usernameValidation = (e) => {
    const username = e.target;
    if (username.validity.valueMissing) {
      setUsernameError('Username is required.');
    } else if (username.validity.tooShort || username.validity.tooLong) {
      setUsernameError('Username must be 3-15 characters long.');
    } else if (username.validity.patternMismatch) {
      setUsernameError(
        'Username must start with a letter and have no special characters or spaces'
      );
    }
    setIsInvalid((s) => ({
      ...s,
      username: true,
    }));
  };

  const passwordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setPasswordError('Password is required.');
    } else if (password.validity.patternMismatch) {
      setPasswordError(
        'Provide a password 8-24 characters long that includes a number, a special character (@!#%$), an uppercase and a lowercase letter.'
      );
    }
    setIsInvalid((s) => ({
      ...s,
      password: true,
    }));
  };

  const confirmPasswordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setConfirmPasswordError('Confirmation is required.');
      setIsInvalid((s) => ({
        ...s,
        confirmPassword: true,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setIsInvalid((s) => ({
      ...s,
      email: false,
      username: false,
      password: false,
      confirmPassword: false,
    }));
    // check validity and also trigger onInvalid events
    if (!e.target.checkValidity()) {
      return;
    } else if (passwordValue !== confirmPasswordValue) {
      setConfirmPasswordError('Passwords do not match.');
      setIsInvalid((s) => ({
        ...s,
        confirmPassword: true,
      }));
    } else {
      console.log('ALL GOOD');
    }
  };

  return (
    <div className='register'>
      <h1 className='register__heading'>Create a new account</h1>

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
              aria-invalid={isInvalid.email}
              value={emailValue}
              onChange={handleEmailChange}
              onInvalid={emailValidation}
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
              text='3-15 characters long and it must start with a letter'
              id='register-username-info'
              tip='top'
              hasWrapper={true}>
              <p className='register__help-icon-wrapper has-tooltip-with-wrapper'>
                <Icons name='help' />
              </p>
            </Tooltip>
          </div>
          <div className='register__input-wrapper'>
            <input
              id='register-username-input'
              className='register__input'
              type='text'
              required
              minLength={3}
              maxLength={20}
              autoComplete='off'
              pattern='^[a-zA-Z]+[0-9]*$'
              aria-describedby='register-username-error'
              aria-details='register-username-info'
              aria-invalid={isInvalid.username}
              value={usernameValue}
              onChange={handleUsernameChange}
              onInvalid={usernameValidation}
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
                <Icons name='help' />
              </p>
            </Tooltip>
          </div>
          <div className='register__input-wrapper'>
            <input
              id='register-password-input'
              className='register__input'
              type='password'
              required
              pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$'
              autoComplete='off'
              aria-describedby='register-password-error'
              aria-details='register-password-info'
              aria-invalid={isInvalid.password}
              value={passwordValue}
              onChange={handlePasswordChange}
              onInvalid={passwordValidation}
            />
            <button
              type='button'
              aria-pressed='false'
              aria-controls='register-password-input'
              className='register__show-password has-tooltip'>
              <Icons name='eye' />
              <Tooltip
                text='Show password'
                tip='bottom'
                id='register-show-password-button'
                hasWrapper={false}
              />
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
              id='register-confirm-password-input'
              className='register__input'
              type='password'
              required
              autoComplete='off'
              aria-describedby='register-confirm-password-error'
              aria-invalid={isInvalid.confirmPassword}
              value={confirmPasswordValue}
              onChange={handleConfirmPasswordChange}
              onInvalid={confirmPasswordValidation}
            />
            <button
              type='button'
              aria-pressed='false'
              aria-controls='register-password-input'
              className='register__show-password has-tooltip'>
              <Icons name='eye' />
              <Tooltip
                text='Show password'
                tip='bottom'
                id='register-show-password-button'
                hasWrapper={false}
              />
            </button>
            <p
              className='register__error'
              aria-live='assertive'
              id='register-confirm-password-error'>
              {confirmPasswordError}
            </p>
          </div>
        </div>

        <button className='register__button' type='submit'>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Register;
