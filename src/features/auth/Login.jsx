import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} from './authApiSlice';
import { Link } from 'react-router-dom';
import { setCredentials } from './authSlice';
import usePersist from '../../hooks/usePersist';
import useAuth from '../../hooks/useAuth';
import '../../styles/Login.scss';

const Login = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const [refresh] = useRefreshMutation();
  const [persist, setPersist] = usePersist();
  const { id } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container'>
      <section className='login'>
        <header className='login__header'>
          <h1 className='login__title'>Sign in to Dreamland</h1>
        </header>
        <form onSubmit={handleSubmit} className='login__form'>
          <label htmlFor='email' className='login__label'>
            Email
          </label>
          <input
            type='text'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete='off'
            required
            id='email'
            className='login__input'
          />

          <label htmlFor='password' className='login__label'>
            Password
          </label>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            id='password'
            className='login__input'
          />
        </form>
        <footer className='login__footer'>
          <label
            htmlFor='checkbox'
            className='login__label login__label--checkbox'>
            Remember me
            <input
              type='checkbox'
              onChange={() => setPersist((prev) => !prev)}
              checked={persist}
              id='checkbox'
              className='login__checkbox'
            />
          </label>
          <button type='submit' className='login__button'>
            Sign in
          </button>
        </footer>
      </section>
    </div>
  );
};

export default Login;
