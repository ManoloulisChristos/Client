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
  const testRef = useRef(null);
  const [testState, setTestState] = useState(true);

  useEffect(() => {
    console.log('state inside', testState);
    if (testState) {
      return;
    }
    console.log('first');
    return () => {
      console.log('state cleanup', testState);
    };
  }, [testState]);

  console.log('state render', testState);
  return (
    <div>
      <p ref={testRef} id='ppp'>
        HELLOOOOO
      </p>
      <button
        style={{ marginInlineEnd: '50px', zIndex: '10' }}
        onClick={() => setTestState((n) => !n)}>
        start
      </button>
      <button style={{ marginInlineEnd: '50px' }}>back</button>
      <button
        style={{ marginInlineEnd: '50px' }}
        onClick={() => console.log(document.getAnimations())}>
        log
      </button>
    </div>
  );
};

export default GlobalTest;
