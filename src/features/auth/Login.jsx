import { useRef, useState } from 'react';
import { useLoginMutation } from './authApiSlice';
import '../../styles/Login.scss';

const Login = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [answer, setAnswer] = useState('notho');
  const [login] = useLoginMutation();

  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await login({
        email: emailValue,
        password: passwordValue,
      }).unwrap();
      console.log(resp);
    } catch (error) {
      setAnswer(error.data.message);
    }
  };
  return (
    <div className='login'>
      <h1 className='login__heading'>Sign in to MyWebsite!!</h1>
      <form ref={formRef} className='login__form' onSubmit={handleSubmit}>
        <label className='login__label'>
          Email
          <input
            ref={emailRef}
            className='login__input'
            type='email'
            value={emailValue}
            onChange={handleEmailChange}
            required
          />
        </label>
        <label>
          Password
          <input
            ref={passwordRef}
            className='login__input'
            type='password'
            minLength={8}
            maxLength={30}
            required
            value={passwordValue}
            onChange={handlePasswordChange}
          />
        </label>
        <button className='login__button' type='submit'>
          Sign in
        </button>
      </form>
      <p>{answer}</p>
    </div>
  );
};

export default Login;
