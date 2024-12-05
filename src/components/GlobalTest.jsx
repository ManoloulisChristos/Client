import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const GlobalTest = () => {
  const animRef = useRef();
  useLayoutEffect(() => {
    console.log('LayoutEffect', animRef.current.getBBox());
  }, []);
  useEffect(() => {
    console.log('Effect', animRef.current.getBBox());
  }, []);
  return (
    <div className='test'>
      <button onClick={() => console.log(animRef.current.getBBox())}>
        bbox
      </button>
      <button
        onClick={() => console.log(animRef.current.getBoundingClientRect())}>
        rect
      </button>

      {/* <svg version='1.1' viewBox='0 0 100 100' width={1000} height={1000}>
        <defs>
          <filter id='spotlight'>
            <feSpecularLighting
              surfaceScale='5'
              specularConstant='5'
              specularExponent='5'
              lightingColor='#fff'>
              <feSpotLight x='50' y='50' z='50'></feSpotLight>
            </feSpecularLighting>
          </filter>
        </defs>
        <rect width='100%' height='100%' filter='url(#spotlight)'></rect>
      </svg> */}
      <svg version='1.1' viewBox='0 0 100 100' width={1000} height={1000}>
        <g ref={animRef}>
          <rect
            id='test-rect'
            // transform='scale(.5) translate(20 20)'
            width='100%'
            height='100%'
            filter='url(#spotlight)'></rect>
        </g>
      </svg>
    </div>
  );
};

export default GlobalTest;
