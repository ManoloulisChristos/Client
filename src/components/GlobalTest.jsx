import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const GlobalTest = () => {
  return (
    <div className='test'>
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

      {/* <svg viewBox='0 0 160 160' width='500' height='500'>
        <circle cx='80' cy='80' r='50' />
        <g transform='translate(80, 80) rotate(-30) skewX(30) scale(1, 0.5)'>
        <g transform='translate(80 90) rotate(30)  scale(1, .2)'>
          <path
            d='M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z'
            fill='#FFF'>
            <animateTransform
              id='testingg'
              attributeName='transform'
              type='rotate'
              from='360 0 0'
              to='0 0 0'
              dur='2s'
              repeatCount='indefinite'
            />
          </path>
        </g>
        <g transform='translate(80 50) scale(1, .2)'>
          <path
            d='M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z'
            fill='#FFF'>
            <animateTransform
              id='testingg'
              attributeName='transform'
              type='rotate'
              from='360 0 0'
              to='0 0 0'
              dur='2s'
              repeatCount='indefinite'
            />
          </path>
        </g>
      </svg> */}
      {/* <svg
        viewBox='0 0 100 100'
        width='30%'
        style={{ marginLeft: '25%', marginTop: '10%' }}>
        <defs>
          <linearGradient
            x1='0.35'
            x2='0.65'
            y1='0'
            y2='0'
            id='test-grd'
            spreadMethod='reflect'
            gradientTransform='rotate(0)'>
            <animate
              attributeName='x1'
              values='0.35;0.65'
              dur='200ms'
              repeatCount='indefinite'
            />
            <animate
              attributeName='x2'
              values='0.65;.95'
              dur='200ms'
              repeatCount='indefinite'
            />
            <animateTransform
              attributeName='gradientTransform'
              type='rotate'
              values='0; 360'
              dur='10ms'
              repeatCount='indefinite'
            />

            <stop offset='20%' stopColor='#070709'></stop>
            <stop
              offset='50%'
              stopColor='	hsl(0, 76%, 49%)'
              stopOpacity='1'></stop>

            <stop offset='80%' stopColor='#070709'></stop>
          </linearGradient>
        </defs>
        <circle
          cx='50%'
          cy='50%'
          r='50%'
          fill='url(#test-grd)'
          filter='url(#blurMe)'></circle>
      </svg> */}
      <svg
        height='600'
        width='600'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <filter id='filter'>
            <feSpecularLighting
              result='specOut'
              surfaceScale='1'
              specularConstant='.5'
              specularExponent='100'
              lightingColor='#fff'>
              <feSpotLight
                x='50'
                y='50'
                z='100'
                pointsAtX='50'
                pointsAtY='50'
                pointsAtZ='0'
                specularExponent='50'
                limitingConeAngle='45'
              />
            </feSpecularLighting>
            <feComposite
              in='SourceGraphic'
              in2='specOut'
              operator='arithmetic'
              k1='0'
              k2='1'
              k3='1'
              k4='0'
            />
          </filter>
        </defs>
        <circle cx='50' cy='50' r='50' filter='url(#filter)' />
      </svg>
    </div>
  );
};

export default GlobalTest;
