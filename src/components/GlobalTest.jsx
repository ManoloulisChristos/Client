import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const GlobalTest = () => {
  const circlePatternRef = useRef(null);
  const circlePatternRef2 = useRef(null);
  const circlePatternRef3 = useRef(null);

  useEffect(() => {
    const keyframes = [
      { fillOpacity: 1 },
      { fillOpacity: 0, offset: 0.5 },
      { fillOpacity: 1 },
    ];

    const timing = {
      duration: 2000,
      itterations: Infinity,
      easing: 'ease-out',
    };
  });

  return (
    <div className='test'>
      <img
        src='https://as1.ftcdn.net/v2/jpg/02/31/14/38/1000_F_231143814_xf78qFcHQeBdF6snfIdRA3Ug9YAiQs2D.jpg'
        alt=''
      />

      <svg
        version='1.1'
        width='500'
        height='500'
        viewBox='0 0 100 200'
        className='home__arrows'
        preserveAspectRatio='xMidYMid meet'>
        <defs>
          <pattern
            className='patt'
            id='circles-pattern'
            x='0'
            y='0'
            width='2.5'
            height='2.5'
            viewBox='0 0 100 100'
            patternUnits='userSpaceOnUse'>
            <rect x='0' y='0' width='100' height='100' fill='black'></rect>
            <circle
              ref={circlePatternRef}
              cx='50'
              cy='50'
              r='40'
              fill='skyblue'
              className='circ'
            />
          </pattern>
          <pattern
            className='patt'
            id='circles-pattern2'
            x='0'
            y='0'
            width='2.5'
            height='2.5'
            viewBox='0 0 100 100'
            patternUnits='userSpaceOnUse'>
            <rect x='0' y='0' width='100' height='100' fill='black'></rect>
            <circle
              ref={circlePatternRef2}
              cx='50'
              cy='50'
              r='40'
              fill='skyblue'
              className='circ2'
            />
          </pattern>
          <pattern
            className='patt'
            id='circles-pattern3'
            x='0'
            y='0'
            width='2.5'
            height='2.5'
            viewBox='0 0 100 100'
            patternUnits='userSpaceOnUse'>
            <rect x='0' y='0' width='100' height='100' fill='black'></rect>
            <circle
              ref={circlePatternRef3}
              cx='50'
              cy='50'
              r='40'
              fill='skyblue'
              className='circ3'
            />
          </pattern>
          <polyline
            id='arrow'
            points='10,20 10,40 50,90 90,40 90,20 50,70 10,20'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.2'
            strokeLinejoin='butt'
            fill='url(#circle)'></polyline>
          <polyline
            id='arrow2'
            points='5,5 5,25 50,75 95,25 95,5 50,55 5,5'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.2'
            strokeLinejoin='butt'></polyline>
        </defs>

        <use href='#arrow2' fill='url(#circles-pattern)'></use>
        <use href='#arrow2' y='50' fill='url(#circles-pattern2)'></use>
        <use href='#arrow2' y='100' fill='url(#circles-pattern3)'></use>
      </svg>
      {/* <svg
          version='1.1'
          width='500'
          height='500'
          viewBox='0 0 200 200'
          className='arrow'>
          <defs>
            <pattern
              className='patt'
              id='circle'
              x='0'
              y='0'
              width='2.5%'
              height='2.5%'
              viewBox='0 0 100 100'
              patternUnits='userSpaceOnUse'>
              <rect x='0' y='0' width='100' height='100' fill='black'></rect>
              <circle cx='50' cy='50' r='40' fill='skyblue' className='circ' />
            </pattern>
            <polyline
              id='arrow'
              points='10,20 10,40 50,90 90,40 90,20 50,70 10,20'
              stroke='black'
              strokeWidth='.5'
              strokeOpacity='.2'
              strokeLinejoin='butt'
              fill='transparent'></polyline>
          
          </defs>
          <line
            x1='0'
            x2='100'
            y1='0'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='0'
            x2='100'
            y1='20'
            y2='20'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='0'
            x2='100'
            y1='40'
            y2='40'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='0'
            x2='100'
            y1='60'
            y2='60'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='0'
            x2='100'
            y1='80'
            y2='80'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='0'
            x2='100'
            y1='100'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='0'
            x2='0'
            y1='0'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='20'
            x2='20'
            y1='0'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='40'
            x2='40'
            y1='0'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='60'
            x2='60'
            y1='0'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='80'
            x2='80'
            y1='0'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <line
            x1='100'
            x2='100'
            y1='0'
            y2='100'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.5'></line>
          <use href='#arrow'></use>
        </svg> */}

      {/* <svg width='600' height='200'>
          <filter id='money'>
            <feMorphology
              in='SourceGraphic'
              operator='dilate'
              radius='2'
              result='expand'
            />

            <feOffset in='expand' dx='1' dy='1' result='shadow_1' />
            <feOffset in='expand' dx='2' dy='2' result='shadow_2' />
            <feOffset in='expand' dx='3' dy='3' result='shadow_3' />
            <feOffset in='expand' dx='4' dy='4' result='shadow_4' />
            <feOffset in='expand' dx='5' dy='5' result='shadow_5' />
            <feOffset in='expand' dx='6' dy='6' result='shadow_6' />
            <feOffset in='expand' dx='7' dy='7' result='shadow_7' />

            <feMerge result='shadow'>
              <feMergeNode in='expand' />
              <feMergeNode in='shadow_1' />
              <feMergeNode in='shadow_2' />
              <feMergeNode in='shadow_3' />
              <feMergeNode in='shadow_4' />
              <feMergeNode in='shadow_5' />
              <feMergeNode in='shadow_6' />
              <feMergeNode in='shadow_7' />
            </feMerge>

            <feFlood floodColor='#ebe7e0' />
            <feComposite in2='shadow' operator='in' result='shadow' />

            <feMorphology
              in='shadow'
              operator='dilate'
              radius='1'
              result='border'
            />
            <feFlood floodColor='#35322a' result='border_color' />
            <feComposite in2='border' operator='in' result='border' />

            <feOffset in='border' dx='1' dy='1' result='secondShadow_1' />
            <feOffset in='border' dx='2' dy='2' result='secondShadow_2' />
            <feOffset in='border' dx='3' dy='3' result='secondShadow_3' />
            <feOffset in='border' dx='4' dy='4' result='secondShadow_4' />
            <feOffset in='border' dx='5' dy='5' result='secondShadow_5' />
            <feOffset in='border' dx='6' dy='6' result='secondShadow_6' />
            <feOffset in='border' dx='7' dy='7' result='secondShadow_7' />
            <feOffset in='border' dx='8' dy='8' result='secondShadow_8' />
            <feOffset in='border' dx='9' dy='9' result='secondShadow_9' />
            <feOffset in='border' dx='10' dy='10' result='secondShadow_10' />
            <feOffset in='border' dx='11' dy='11' result='secondShadow_11' />

            <feMerge result='secondShadow'>
              <feMergeNode in='border' />
              <feMergeNode in='secondShadow_1' />
              <feMergeNode in='secondShadow_2' />
              <feMergeNode in='secondShadow_3' />
              <feMergeNode in='secondShadow_4' />
              <feMergeNode in='secondShadow_5' />
              <feMergeNode in='secondShadow_6' />
              <feMergeNode in='secondShadow_7' />
              <feMergeNode in='secondShadow_8' />
              <feMergeNode in='secondShadow_9' />
              <feMergeNode in='secondShadow_10' />
              <feMergeNode in='secondShadow_11' />
            </feMerge>

            <feImage
              x='-100'
              y='0'
              width='900'
              height='200'
              xlinkHref='https://s3-us-west-2.amazonaws.com/s.cdpn.io/78779/stripes.svg'
              result='orig_image'
            />
            <feOffset dx='392' />
            <feComposite operator='over' in2='orig_image' />
            <feComposite
              in2='secondShadow'
              operator='in'
              result='secondShadow'
            />

            <feMerge>
              <feMergeNode in='secondShadow' />
              <feMergeNode in='border' />
              <feMergeNode in='shadow' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>

          <text
            className='states'
            dominantBaseline='middle'
            textAnchor='middle'
            x='50%'
            y='50%'
            style={{ filter: 'url(#money)' }}>
            STATES
          </text>
        </svg> */}
    </div>
  );
};

export default GlobalTest;
