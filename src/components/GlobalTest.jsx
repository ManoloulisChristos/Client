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
  const bubbleRef = useRef(null);
  const animateRef = useRef(null);
  const [testState, setTestState] = useState(false);

  const btnClick = () => {
    bubbleRef.current.animate(
      [
        {
          transform: 'scale(0)',
          offset: 0,
        },
        {
          transform: 'scale(2)',
          offset: 0.2,
        },
        {
          transform: 'scale(2)',
          offset: 0.7,
        },
        {
          transform: 'scale(0)',
          offset: 1,
        },
      ],
      { duration: 800 }
    );
    console.log('hekko');
  };

  return (
    <div className='test'>
      <button
        id='test_btn_start'
        style={{ position: 'absolute', zIndex: '10' }}
        onClick={btnClick}>
        {' '}
        heelo
      </button>

      <div className='test__abs-container'>
        <div ref={bubbleRef} className='test__bubble-container'>
          <svg
            version='1.1'
            width='100%'
            height='100%'
            className='test__svg-circle-clip'>
            <defs>
              <clipPath id='test-bubble-clip' clipPathUnits='objectBoundingBox'>
                <path
                  className='test__path-animate'
                  stroke='purple'
                  fill='none'
                  strokeWidth='.01'>
                  <animate
                    attributeType='XML'
                    attributeName='d'
                    dur='.6s'
                    keyTimes='0; 0.2; 1'
                    fill='freeze'
                    begin='test_btn_start.click'
                    values='
                    m 0.47,0.784 -0.05,-0.169 0.014,0.173
c 0.002,0.019 0.003,0.053 -0.007,0.057 -0.012,0.005 -0.032,-0.003 -0.043,-0.016
l -0.085,-0.083 0.056,0.099
c 0.008,0.014 0.016,0.033 0.008,0.045 -0.008,0.014 -0.03,0.014 -0.044,0.008
l -0.148,-0.041 0.142,0.072
c 0.01,0.005 0.017,0.018 0.017,0.029 -0.001,0.013 -0.024,0.032 -0.024,0.032
L 0.709,0.994 0.831,0.935 0.708,0.959
c -0.006,0.001 -0.014,-0.005 -0.016,-0.011 -0.003,-0.008 0.002,-0.018 0.008,-0.024
l 0.052,-0.044 -0.072,0.019
c -0.012,0.003 -0.027,0.016 -0.036,0.007 -0.01,-0.01 0.002,-0.029 0.01,-0.041
L 0.718,0.739 0.599,0.841
c -0.012,0.011 -0.038,0.03 -0.054,0.026 -0.015,-0.003 -0.023,-0.02 -0.019,-0.035
l 0.033,-0.127 -0.059,0.1
c -0.003,0.006 -0.005,0.016 -0.012,0.017 -0.016,0.002 -0.016,-0.023 -0.019,-0.039
z;
                    M 0.47,0.784 0.378,0.181 0.434,0.788
c 0.002,0.019 0.003,0.053 -0.007,0.057 -0.012,0.005 -0.032,-0.003 -0.043,-0.016
l -0.085,-0.083 0.056,0.099
c 0.008,0.014 0.016,0.033 0.008,0.045 -0.008,0.014 -0.03,0.014 -0.044,0.008
L 0.002,0.782 0.313,0.931
c 0.01,0.005 0.017,0.018 0.017,0.029 -0.001,0.013 -0.024,0.032 -0.024,0.032
L 0.709,0.994 0.892,0.904 0.708,0.959
C 0.702,0.961 0.695,0.955 0.693,0.949 0.69,0.941 0.695,0.93 0.701,0.925
L 0.781,0.856 0.681,0.9
c -0.011,0.005 -0.027,0.016 -0.036,0.007 -0.01,-0.01 0.002,-0.029 0.01,-0.041
L 0.856,0.55 0.599,0.841
c -0.011,0.012 -0.038,0.03 -0.054,0.026 -0.015,-0.003 -0.023,-0.02 -0.019,-0.035
l 0.066,-0.224 -0.091,0.197
c -0.003,0.006 -0.005,0.016 -0.012,0.017 -0.016,0.002 -0.016,-0.023 -0.019,-0.039
z;
m 0.463,0.778 -0.023,-0.096 0.007,0.107
c 0.001,0.019 -0.011,0.052 -0.02,0.056 -0.012,0.005 -0.032,-0.003 -0.043,-0.016
L 0.115,0.489 0.317,0.813
c 0.01,0.015 0.014,0.022 0.02,0.036 0.012,0.027 0.006,0.06 -0.008,0.056
L 0.206,0.867 0.313,0.931
c 0.01,0.006 0.017,0.018 0.017,0.029 -0.001,0.013 -0.024,0.032 -0.024,0.032
L 0.709,0.994 0.806,0.939 0.733,0.954
C 0.72,0.957 0.713,0.945 0.714,0.931 0.714,0.915 0.738,0.9 0.756,0.886
L 0.984,0.704 0.707,0.867
c -0.011,0.006 -0.058,0.037 -0.073,0.027 -0.012,-0.008 -0.01,-0.023 -0.001,-0.034
l 0.073,-0.107 -0.1,0.082
c -0.015,0.012 -0.042,0.024 -0.055,0.004 -0.006,-0.009 0.003,-0.047 0.004,-0.052
L 0.67,0.44 0.518,0.746
c -0.003,0.006 -0.018,0.043 -0.029,0.053 -0.012,0.011 -0.022,-0.005 -0.026,-0.021
z'
                  />
                </path>
              </clipPath>
            </defs>
          </svg>
          <div className='test__bubble-blur-wrapper'>
            <div className='test__bubble-blur'></div>
          </div>
          <div className='test__bubble-blur-wrapper'>
            <div className='test__bubble-blur'></div>
          </div>
          <div className='test__bubble'></div>
        </div>

        <div className='test__beam-wrapper test__beam-wrapper--1'>
          <div className='test__beam test__beam--1'>
            <svg
              version='1.1'
              className='test__svg-clip'
              width='100%'
              height='100%'>
              <defs>
                <clipPath id='test-beam-clip' clipPathUnits='objectBoundingBox'>
                  <rect x='0' y='0' width='1' height='1' rx='.2'></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className='test__blur test__blur--1'>
            <svg
              version='1.1'
              className='test__svg-clip'
              width='100%'
              height='100%'>
              <defs>
                <clipPath id='test-blur-clip' clipPathUnits='objectBoundingBox'>
                  <rect x='-5' y='-5' width='10' height='10'></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTest;
