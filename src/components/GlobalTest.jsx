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
      {/* <div className='test__bubble-container'>
        <div className='test__bubble'></div>
        <div className='test__bubble-blur'></div>
        <div className='test__beam-wrapper test__beam-wrapper--1'>
          <div className='test__beam test__beam--1'>
            <svg
              version='1.1'
              className='test__svg-clip'
              width='100%'
              height='100%'>
              <defs>
                <clipPath id='test-beam-clip' clipPathUnits='objectBoundingBox'>
                  <rect x='0' y='0' width='1' height='1' rx='1'></rect>
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
        <div className='test__beam-wrapper test__beam-wrapper--2'>
          <div className='test__beam test__beam--2'></div>
          <div className='test__blur test__blur--2'></div>
        </div>
        <div className='test__beam-wrapper test__beam-wrapper--3'>
          <div className='test__beam test__beam--3'></div>
          <div className='test__blur test__blur--3'></div>
        </div>
        <div className='test__beam-wrapper test__beam-wrapper--4'>
          <div className='test__beam test__beam--4'></div>
          <div className='test__blur test__blur--4'></div>
        </div>
        <div className='test__beam-wrapper test__beam-wrapper--5'>
          <div className='test__beam test__beam--5'></div>
          <div className='test__blur test__blur--5'></div>
        </div>
      </div> */}
      <button
        id='test_btn_start'
        style={{ position: 'absolute', zIndex: '10' }}>
        {' '}
        heelo
      </button>

      <div className='test__abs-container'>
        <div className='test__bubble-container'>
          <svg
            version='1.1'
            width='100%'
            height='100%'
            viewBox='0 0 1 1'
            style={{ position: 'relative', zIndex: '5' }}>
            <path
              d='M .52 .20 Q .57 .45 .7 .50 L .52 .6 Z'
              stroke='purple'
              fill='none'
              strokeWidth='.01'></path>
            <path
              style={{ transformOrigin: 'center', transformBox: 'view-box' }}
              transform='translate(0 -.35)'
              d='M .74 .25 L .62 .6 H .3 Q .65 .46 .74 .25'
              stroke='purple'
              fill='none'
              strokeWidth='.01'></path>
          </svg>
          <svg
            version='1.1'
            width='100%'
            height='100%'
            className='test__svg-circle-clip'>
            <defs>
              <clipPath id='test-bubble-clip' clipPathUnits='objectBoundingBox'>
                <circle
                  className='test__circle'
                  cx='.5'
                  cy='0.7'
                  r='.3'></circle>
                <path
                  d='M .52 .20 Q .57 .45 .7 .50 L .52 .6 Z'
                  stroke='purple'
                  fill='none'
                  strokeWidth='.01'></path>
                <path
                  transform='translate(0 -.12)'
                  d='M .74 .25 L .62 .6 H .3 Q .65 .46 .74 .25'
                  stroke='purple'
                  fill='none'
                  strokeWidth='.01'></path>
              </clipPath>
              <clipPath
                id='test-bubble-blur-clip'
                clipPathUnits='objectBoundingBox'>
                <circle
                  className='test__circle'
                  cx='.5'
                  cy='0.7'
                  r='.32'></circle>

                <ellipse
                  className='test__clip-ellipse'
                  cx='.5'
                  cy='.3'
                  rx='0'
                  ry='.25'
                  fill='lightblue'
                  opacity='1'></ellipse>
              </clipPath>
            </defs>
          </svg>
          <div className='test__bubble'></div>
          <div className='test__bubble-blur-wrapper'>
            <div className='test__bubble-blur'></div>
          </div>
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
                  <rect x='0' y='0' width='1' height='1' rx='1'></rect>
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
        <div className='test__beam-wrapper test__beam-wrapper--2'>
          <div className='test__beam test__beam--2'>
            <svg
              version='1.1'
              className='test__svg-clip'
              width='100%'
              height='100%'>
              <defs>
                <clipPath id='test-beam-clip' clipPathUnits='objectBoundingBox'>
                  <rect x='0' y='0' width='1' height='1' rx='1'></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className='test__blur test__blur--2'>
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
