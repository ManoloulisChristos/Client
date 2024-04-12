import { useState } from 'react';
import { useSendPasswordResetEmailMutation } from './authApiSlice';
import '../../styles/RequestPasswordReset.scss';

const RequestPasswordReset = () => {
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sendEmail, { data, isError, error }] =
    useSendPasswordResetEmailMutation();

  const handleEmailValidation = (e) => {
    const email = e.target;
    if (email.validity.valueMissing) {
      setEmailError('Email is required.');
    } else if (email.validity.typeMismatch) {
      setEmailError('Provide correct email syntax.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    if (e.target.checkValidity()) {
      await sendEmail({ email: emailValue });
      //toast
    }
  };
  console.log(data, error);
  const handleEmailChange = (e) => setEmailValue(e.target.value);

  return (
    <div className='password-reset'>
      <h1 className='password-reset__heading'>Reset your password</h1>
      <p className='password-reset__paragraph'>
        Enter your user account&apos;s verified email address and we will send
        you a password reset link.
      </p>
      {isError && (
        <p className='password-reset__generic-error' aria-live='assertive'>
          {error?.data?.message}
        </p>
      )}
      <form className='password-reset__form' onSubmit={handleSubmit} noValidate>
        <label
          className='password-reset__label'
          htmlFor='password-reset-email-input'>
          Email
        </label>
        <input
          id='password-reset-email-input'
          className='password-reset__input'
          type='email'
          required
          aria-invalid={emailError ? 'true' : 'false'}
          aria-describedby='password-reset-email-error'
          onChange={handleEmailChange}
          onInvalid={handleEmailValidation}
        />
        <p
          className='password-reset__error'
          aria-live='assertive'
          id='password-reset-email-error'>
          {emailError}
        </p>
        <button type='submit' className='password-reset__submit'>
          Send
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
