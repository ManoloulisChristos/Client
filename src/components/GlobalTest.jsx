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
  const [visible, setVisible] = useState(false);
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
        <button onClick={() => setVisible((n) => !n)}>CLIOCK</button>
        <button
          onClick={() =>
            console.log(testRef.current.style.setProperty('--_ba', '300'))
          }>
          CLIOCK
        </button>

        <h1
          ref={testRef}
          className={`test__h ${visible ? 'test__h--animate' : ''}`}>
          Hello there my firend
        </h1>
        <input
          type='range'
          min={1}
          max={360}
          step={1}
          onChange={(e) =>
            testRef.current.style.setProperty('--_ba', e.target.value)
          }
        />
      </div>
    </div>
  );
};

export default GlobalTest;
