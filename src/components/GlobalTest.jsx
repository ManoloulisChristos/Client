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
  const svgRef = useRef(null);
  const testRef = useRef(null);

  useEffect(() => {
    let size = null;
    const observer = new ResizeObserver((entries) => {
      size = entries[0].contentBoxSize[0].inlineSize;
      console.log('bos', size);
    });
    const wrapperF = (e) => {
      const innerF = (size) => {
        return size;
      };
      console.log(innerF(size));
    };
    window.addEventListener('mousemove', wrapperF);
    observer.observe(testRef.current);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', wrapperF);
    };
  }, []);

  return (
    <div className='test'>
      <button onClick={() => svgRef.current.beginElement()}>begin right</button>

      <div className='test__svg-wrapper'>
        <h1 ref={testRef} style={{ fontSize: '4vw' }}>
          hello
        </h1>
      </div>
    </div>
  );
};

export default GlobalTest;
