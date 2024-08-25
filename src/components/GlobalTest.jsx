import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const GlobalTest = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visible, setVisible] = useState(0);
  const testRef = useRef(null);
  const location = useLocation();
  // console.log('router', searchParams);
  console.log(location);
  // console.log('afa', new URLSearchParams(window.location.search).get('user'));
  useEffect(() => {
    window.addEventListener('popstate', (e) => {
      console.log(e);
      console.log(window.history);
    });
  }, []);
  return (
    <div className='test'>
      <div className='test__div'>
        <label htmlFor='test-checkbox' className='test__label'>
          Documentary
        </label>
        <input className='test__input' type='checkbox' id='test-checkbox' />
      </div>
    </div>
  );
};

export default GlobalTest;
