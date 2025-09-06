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
      {/* <button type='button' className='button'>
        <span className='letter letter--1'>O</span>
        <span className='letter letter--2'>n</span>
        <span className='letter letter--3'>e</span>
        <span className='letter letter--4'> </span>
        <span className='letter letter--5'>M</span>
        <span className='letter letter--6'>o</span>
        <span className='letter letter--7'>r</span>
        <span className='letter letter--8'>e</span>
      </button> */}
      <div className='blobs'>
        <div className='blob blob--1'>2</div>
        <div className='blob blob--2'>3</div>
      </div>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'
        width='500'
        height='500'
        viewBox='0 0 100 100'>
        <path
          fill='none'
          stroke='red'
          strokeWidth='1'
          d='m 48.63,0.17
c 0,0 0.17,32.76 0.17,48.97 0,17.12 -0.17,51.01 -0.17,51.01'>
          <animate
            ref={svgRef}
            attributeType='XML'
            attributeName='d'
            values='m 48.63,0.17
c 0,0 0.17,32.76 0.17,48.97 0,17.12 -0.17,51.01 -0.17,51.01;
            m 48.63,0.17
c 0,0 51.35,31.23 51.35,47.44 0,17.12 -51.35,52.54 -51.35,52.54;
            m 48.63,0.17
c 0,0 -9.35,32.25 -9.35,48.46 0,17.12 9.35,51.52 9.35,51.52;
m 48.63,0.17
c 0,0 4.59,31.91 4.59,48.12 0,17.12 -4.59,51.86 -4.59,51.86;
m 48.63,0.17
c 0,0 -3.4,32.08 -3.4,48.29 0,17.12 3.4,51.69 3.4,51.69;
m 48.63,0.17
c 0,0 0.17,32.76 0.17,48.97 0,17.12 -0.17,51.01 -0.17,51.01'
            dur='2s'
            // calcMode='spline'
            // keyTimes='0; 1'
            // // keySplines='.5 1.75 .75 1.25'
            // keySplines='.17 .84 .44 1'
            begin='indefinite'></animate>
        </path>
        {/* <path
          fill='none'
          stroke='red'
          strokeWidth='1'
          d='M 47.61,1.2 47.36,52.12
C 47.28,67.37 47.13,98.23 47.13,98.23'>
          <animate
            ref={svgRef}
            attributeType='XML'
            attributeName='d'
            values='M 47.61,1.2 47.36,52.12
C 47.28,67.37 47.13,98.23 47.13,98.23;
            M 47.61,1.2 92.57,45.15
C 103.47,55.81 47.13,98.23 47.13,98.23'
            dur='2s'
            begin='indefinite'></animate>
        </path> */}
        {/* <path
          fill='blue'
          stroke='blue'
          d='M300-10c0,0,295,164,295,410c0,232-295,410-295,410'></path>
        <path
          fill='none'
          stroke='green'
          d='M300-10C300-10,5,154,5,400c0,232,295,410,295,410'></path> */}
      </svg>
      <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
        <defs>
          <filter id='test0goo'>
            <feGaussianBlur
              in='SourceGraphic'
              stdDeviation='10'
              result='blur'
            />
            <feColorMatrix
              in='blur'
              mode='matrix'
              values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
              result='goo'
            />
            <feComposite in='SourceGraphic' in2='goo' operator='atop' />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GlobalTest;
