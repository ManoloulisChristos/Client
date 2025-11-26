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

  return (
    <div className='test'>
      <svg
        stroke='white'
        aria-hidden='true'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 20 20'>
        <path d='M18.869 19.162l-5.943-6.484c1.339-1.401 2.075-3.233 2.075-5.178 0-2.003-0.78-3.887-2.197-5.303s-3.3-2.197-5.303-2.197-3.887 0.78-5.303 2.197-2.197 3.3-2.197 5.303 0.78 3.887 2.197 5.303 3.3 2.197 5.303 2.197c1.726 0 3.362-0.579 4.688-1.645l5.943 6.483c0.099 0.108 0.233 0.162 0.369 0.162 0.121 0 0.242-0.043 0.338-0.131 0.204-0.187 0.217-0.503 0.031-0.706zM1 7.5c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5-6.5-2.916-6.5-6.5z'></path>
      </svg>
      <svg
        stroke='white'
        fill='none'
        aria-hidden='true'
        strokeWidth='1.5'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'>
        <line
          x1='15'
          x2='22.5'
          y1='14.5'
          y2='23'
          rx='20'
          strokeLinecap='round'
          strokeWidth='1.5'></line>
        <circle cx='9' cy='9' r='8'></circle>
      </svg>
    </div>
  );
};

export default GlobalTest;
