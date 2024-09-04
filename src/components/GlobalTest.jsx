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
        <button
          onClick={() => setSearchParams({ genre: 'Hello,There,Big,boy' })}>
          CLIOCK
        </button>
      </div>
    </div>
  );
};

export default GlobalTest;
