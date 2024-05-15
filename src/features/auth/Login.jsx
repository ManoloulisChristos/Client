import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from './authApiSlice';
import { setCredentials } from './authSlice';

import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';
import usePersist from '../../hooks/usePersist';
import '../../styles/Login.scss';
import { createToast } from '../toast/toastsSlice';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showGenericError, setShowGenericError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [persist, setPersist] = usePersist();

  const passwordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [login, { error }] = useLoginMutation();

  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);

  const handleCheckboxChange = () => setPersist((s) => !s);

  const handleEmailValidation = (e) => {
    const email = e.target;
    if (email.validity.valueMissing) {
      setEmailError('Email is required.');
    } else if (email.validity.typeMismatch) {
      setEmailError('Provide correct email syntax.');
    }
  };

  const handlePassowordValidation = (e) => {
    const password = e.target;
    if (password.validity.valueMissing) {
      setPasswordError('Password is required.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowGenericError(false);
    setEmailError('');
    setPasswordError('');
    if (!e.target.checkValidity()) {
      return;
    } else {
      if (passwordRef.current.getAttribute('type') === 'text') {
        setShowPassword(false);
        setTimeout(() => {
          e.target.requestSubmit(submitButtonRef.current);
        }, 0);
      } else {
        try {
          const { accessToken, userIdToken } = await login({
            email: emailValue,
            password: passwordValue,
            persist,
          }).unwrap();
          //works only this way (i cannot use the hook and i dont know why)
          sessionStorage.setItem('session', 'true');
          dispatch(setCredentials({ accessToken, userIdToken }));
          const toLocation = location?.state?.from ?? '..';
          dispatch(createToast('success', 'Signed in successfully'));
          navigate(toLocation);
        } catch (error) {
          setShowGenericError(true);
        }
      }
    }
  };

  return (
    <div className='login'>
      <h1 className='login__heading'>Sign in</h1>

      {showGenericError && (
        <p
          className='login__generic-error'
          id='login-generic-error'
          aria-live='assertive'>
          Error: {error?.data?.message}
        </p>
      )}

      <form className='login__form' noValidate onSubmit={handleSubmit}>
        <div className='login__input-container'>
          <label htmlFor='login-email-input' className='login__label'>
            Email
          </label>
          <input
            id='login-email-input'
            className='login__input'
            type='email'
            required
            aria-describedby='login-email-error login-generic-error'
            aria-invalid={emailError || showGenericError}
            onChange={handleEmailChange}
            value={emailValue}
            onInvalid={handleEmailValidation}
          />
          <p
            id='login-email-error'
            className='login__input-error'
            aria-live='assertive'>
            {emailError}
          </p>
        </div>
        <div className='login__input-container'>
          <label htmlFor='login-password-input' className='login__label'>
            Password
          </label>
          <div className='login__input-wrapper'>
            <input
              ref={passwordRef}
              id='login-password-input'
              className='login__input'
              type={showPassword ? 'text' : 'password'}
              required
              aria-describedby='login-password-error login-generic-error'
              aria-invalid={passwordError || showGenericError}
              onChange={handlePasswordChange}
              value={passwordValue}
              onInvalid={handlePassowordValidation}
            />
            <button
              className='login__show-password has-tooltip'
              type='button'
              aria-pressed={showPassword}
              onClick={() => setShowPassword((s) => !s)}>
              <span className='visually-hidden'>Password visibility</span>
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
          </div>
          <p
            id='login-password-error'
            className='login__input-error'
            aria-live='assertive'>
            {passwordError}
          </p>
        </div>
        <div className='login__checkbox-container'>
          <input
            id='login-persist-checkbox'
            className='login__checkbox'
            type='checkbox'
            onChange={handleCheckboxChange}
            checked={persist}
          />
          <label htmlFor='login-persist-checkbox' className='login__label'>
            Stay signed in
          </label>
        </div>
        <button ref={submitButtonRef} className='login__submit' type='submit'>
          Sign in
        </button>
      </form>
      <div className='login__links'>
        <p>
          <strong>Can&apos;t sign in? </strong> -{' '}
          <Link className='login__link' to='/auth/password'>
            Reset your password
          </Link>
        </p>
        <p>
          New to /////////? -{' '}
          <Link className='login__link' to='/auth/register'>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
