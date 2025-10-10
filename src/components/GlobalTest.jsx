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

  return (
    <div className='test'>
      <button onClick={() => svgRef.current.beginElement()}>begin right</button>

      <div className='test__svg-wrapper'>
        <svg width='100%' height='100%' viewBox='0 0 120 40'>
          <rect x='0' y='0' width='100%' height='100%' fill='orange'></rect>
          <circle cx='50' cy='30' r='5'>
            <animate
              ref={svgRef}
              attributeType='XML'
              attributeName='r'
              from='5'
              to='15'
              dur='2s'
              begin='test_test_test.click;'></animate>
          </circle>
          <text x='50' y='20' fontSize='40'>
            Hello
          </text>
          <rect
            id='test_test_test'
            x='0'
            y='0'
            width='100%'
            height='100%'
            fill='none'
            stroke='red'
            fillOpacity='0.4'></rect>
        </svg>
      </div>
    </div>
  );
};

export default GlobalTest;
