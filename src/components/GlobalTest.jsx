import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router';

const GlobalTest = () => {
  const testRef = useRef(false);
  const [testState, setTestState] = useState(false);

  useLayoutEffect(() => {
    console.log('fist');
    console.log(testRef.current);
    return () => {
      if (testRef.current) {
        testRef.current = false;
      } else {
        testRef.current = true;
      }
    };
  }, [testState]);

  return (
    <div className='test'>
      <button onClick={() => console.log(testRef.current)}>RREFF</button>
      <button onClick={() => setTestState((n) => !n)}>State</button>
      <p>hello paragraph</p>
    </div>
  );
};

export default GlobalTest;
