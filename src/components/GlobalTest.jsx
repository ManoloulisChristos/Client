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
      <div className='test__box'></div>
      <div className='test__small-box1'></div>
      <div className='test__small-box2'></div>
      <svg className='test__svg' width='100%' viewBox='0 0 100 100'>
        <defs>
          <radialGradient
            id='myRadialGradient'
            cx='55%'
            cy='50%'
            r='50%'
            fx='45%'
            fy='50%'
            gradientUnits='objectBoundingBox'>
            <stop offset='0%' stopColor='hsl(186 85.9% 100%)' />
            <stop offset='33.33%' stopColor='hsl(186 85.9% 95%)' />
            <stop offset='66.67%' stopColor='hsl(186 85.9% 85%)' />
            <stop offset='100%' stopColor='hsl(186 65.9% 65.1%)' />
          </radialGradient>
        </defs>
        <rect x='0' y='0' width='100%' height='100%'></rect>
        <path
          className='test__path'
          fill='url(#myRadialGradient)'
          // stroke='gray'
          d='M 50 80 L 40 0 L 60 0 L 50 80'></path>
      </svg>
      <button onClick={() => console.log(testRef.current)}>RREFF</button>
      <button onClick={() => setTestState((n) => !n)}>State</button>
      <p>hello paragraph</p>
    </div>
  );
};

export default GlobalTest;
