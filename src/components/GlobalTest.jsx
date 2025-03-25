import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router';

const GlobalTest = () => {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const testRef = useRef(false);
  const rectRef = useRef(null);
  const rect2Ref = useRef(null);
  const circleRef = useRef(null);
  const circle2Ref = useRef(null);

  const animRef = useRef(null);

  useEffect(() => {
    // const fun = async () => {
    //   animRef.current = box1Ref.current.animate(
    //     [{ transform: 'translate(500px)' }],
    //     {
    //       duration: 2000,
    //     }
    //   );
    //   // animRef.current.startTime = 3500;
    //   animRef.current.pause();
    //   console.log(animRef.current.currentTime);
    // };
    // if (testRef.current) {
    //   console.log('funct');
    //   fun();
    // }
    // const key = new KeyframeEffect(
    //   box1Ref.current,
    //   [{ transform: 'rotate(3turn)' }],
    //   {
    //     duration: 2000,
    //     fill: 'forwards',
    //   }
    // );
    // animRef.current = new Animation(key);
    // animRef.current.play();
    // console.log(document.getAnimations());
  }, []);
  const animatebox1 = async (e) => {
    // console.log('1', animRef.current.effect.getComputedTiming());
    // // animRef.current.currentTime = -4000;
    // console.log('2', animRef.current.effect.getComputedTiming());
    // // animRef.current.effect.updateTiming({ delay: 3000 });
    // animRef.current.play();
    // console.log('3', animRef.current.effect.getComputedTiming());
    // animRef.current.currentTime = -4000;
    const hello = box1Ref.current.animate([{ transform: 'translate(500px)' }], {
      duration: 2000,
    });
    await hello.finished;
    console.log(hello.replaceState);
  };

  // when i hit the play() method the start time is currently null when i log so maybe it needs some time,
  // if i set the current time before i hit play when the play() is called it sets it to 0 so i get no delay
  // but if i change after play it adds a delay normaly and the startTime gets updated like
  // startTime = document.timeline.currentTime - currentTime
  // If i set the current time to a + value the startTime is set that +time before the documents currentTime
  // If i set it to - the start time is set after the documents current time

  // IN the svg if i dont set explicit units like px vh vw in the container the % values of the svg do not respect it and only the width gets applied
  // and the height follows to make it a square due to the viewbox;
  // IF!!!! i set a viewbox to the outermost svg it keeps things in check and the preserve aspect ratio does not work as intended
  //  for the inner elements
  // And when the inner svg dimensions althought it has an implicit width of 100% , the dimensions are in fact
  // the dimensions of its biggest element.
  // so the circle defines what the dimensions are for the entire svg
  // otherwise it would show its full size and the circle would just be positioned inside it
  // but it does not show any size other than the biggest element......
  // This is shown only the chromium dev tools firefox shows it as it should

  const clickRect = () => {
    console.log(rectRef.current.getBBox());
    console.log(rectRef.current.getCTM());
    const CTM = rectRef.current.getScreenCTM();
    console.log(rectRef.current.getScreenCTM());

    const bbox = rectRef.current.getBBox();
    rect2Ref.current.setAttribute('x', bbox.x);
    rect2Ref.current.setAttribute('y', bbox.y);
    rect2Ref.current.setAttribute('width', bbox.width);
    rect2Ref.current.setAttribute('height', bbox.height);
    rect2Ref.current.setAttribute('transform', 'matrix(' + s + ')');
  };
  const clickCircle = () => {
    console.log(circleRef.current.getBBox());
    console.log(circleRef.current.getBoundingClientRect());
  };
  const clickCircle2 = () => {
    console.log(circle2Ref.current.getBBox());
    console.log(circle2Ref.current.getBoundingClientRect());
  };

  const arcX = (angle) => 50 + 50 * Math.cos(angle * (Math.PI / 180));
  const arcY = (angle) => 50 + 50 * Math.sin(angle * (Math.PI / 180));

  const calcArcValues = (precision, minAngle, maxAngle) => {
    //Precision 1 gives a lot o weight on the file, but adds smooth transition
    // With value of 1 > 25kb with 5 > 4kb
    // 2 and more the arc jiggles so i will take the extra size.
    ///// IMPORTANT /////
    // With precision > 1 the point where the arc passes the 180deg mark and changes from big to small arc must
    // be handled smoothly in order for the browser to interpolate the values correctly.
    // That means adding one by one the degrees from that point until the next step in the loop
    // based on the precision provided and also creating custom keyTimes to maintain the linear animation
    // because the values would have added extra steps inside.
    let deg = minAngle;

    let str = `M 100 50 A 50 50 0 1 0 ${arcX(minAngle)} ${arcY(
      minAngle
    )}; L 50 50 Z`;
    while (deg <= maxAngle) {
      if (deg < 180) {
        str = `${str} M 100 50 A 50 50 0 1 0 ${arcX(deg)} ${arcY(
          deg
        )} L 50 50 Z;`;
      } else {
        str = `${str} M 100 50 A 50 50 0 0 0 ${arcX(deg)} ${arcY(
          deg
        )} L 50 50 Z;`;
      }
      deg = deg + precision;
    }
    return str;
  };

  return (
    <div className='test'>
      <h1 style={{ zIndex: '2', filter: 'url(#gaussianBlur3)' }}>
        Hello <button onClick={clickRect}>Rect</button>
        <button onClick={clickCircle}>Circle</button>
        <button onClick={clickCircle2}>Circle2</button>
      </h1>
      <div className='test__cow-wrapper'>
        <svg
          width='100vw'
          height='100vh'
          viewBox='0 0 100 100'
          className='test__svg-arc'>
          <path
            d='m 68.1,44.1
c 0,2.21 -1.79,4 -4,4 -1.52,0 -2.85,-0.85 -3.52,-2.1 -0.31,-0.56 -0.48,-1.21 -0.48,-1.9 0,-2.21 1.79,-4 4,-4 1.43,0 2.68,0.75 3.39,1.87 0.39,0.62 0.61,1.35 0.61,2.13
z'>
            {/* <animate
              id='eye_testt'
              attributeType='XML'
              attributeName='d'
              dur='3s'
              begin='click'
              fill='freeze'
              values='m 68.1,44.1
c 0,0.04 -1.77,0.13 -3.98,0.13 -2.21,0 -4.02,-0.09 -4.02,-0.13 0,-0.03 1.82,0.11 4.02,0.11 2.21,0 3.98,-0.15 3.98,-0.11
z;

m 68.1,44.1
c 0,2.21 -1.79,4 -4,4 -2.21,0 -4,-1.79 -4,-4 0,-2.21 1.84,-4 4.04,-4 2.21,0 3.96,1.79 3.96,4
z


'></animate>
            <animate
              attributeType='XML'
              attributeName='d'
              dur='3s'
              begin='eye_testt.end+2s'
              fill='freeze'
              values='m 68.1,44.1
c 0,2.21 -1.79,4 -4,4 -1.52,0 -2.85,-0.85 -3.52,-2.1 -0.31,-0.56 -0.48,-1.21 -0.48,-1.9 0,-2.21 1.79,-4 4,-4 1.43,0 2.68,0.75 3.39,1.87 0.39,0.62 0.61,1.35 0.61,2.13
z;

m 68.1,44.1
c 0,2.21 -1.79,4 -4,4 -1.52,0 -2.85,-0.85 -3.52,-2.1 -0.04,-0.5 0.01,-0.94 0.3,-1.4 0.34,-0.53 2.35,-2.02 3.41,-2.45 1.14,-0.47 2.62,-0.57 3.2,-0.18 0.39,0.62 0.61,1.35 0.61,2.13
z;

m 68.1,44.1
c 0,2.21 -1.79,4 -4,4 -1.52,0 -2.85,-0.85 -3.52,-2.1 0.34,-0.27 0.67,-0.47 1.02,-0.68 0.86,-0.52 1.84,-1.09 2.88,-1.69 1.17,-0.67 2.3,-1.28 3.01,-1.66 0.39,0.62 0.61,1.35 0.61,2.13
z
'></animate> */}
            <animate
              id='eye_testt'
              attributeType='XML'
              attributeName='d'
              dur='3s'
              begin='click'
              fill='freeze'
              values='
              m 48.1,44.04
c 0,0.04 -1.77,0.13 -3.98,0.13 -2.21,0 -4.02,-0.09 -4.02,-0.13 0,-0.03 1.82,0.11 4.02,0.11 2.21,0 3.98,-0.15 3.98,-0.11
z;
             m 48.1,44.1
c 0,2.21 -1.79,4 -4,4 -2.21,0 -4,-1.79 -4,-4 0,-2.21 1.84,-4 4.04,-4 2.21,0 3.96,1.79 3.96,4
z


'></animate>
            <animate
              attributeType='XML'
              attributeName='d'
              dur='1s'
              begin='eye_testt.end'
              calcMode='spline'
              keySplines='0.16, 1, 0.3, 1'
              keyTimes='0; 1'
              fill='freeze'
              values='
             m 40.1,44.1
c 0,2.21 1.79,4 4,4 1.52,0 2.85,-0.85 3.52,-2.1 0.31,-0.56 0.48,-1.21 0.48,-1.9 0,-2.21 -1.79,-4 -4,-4 -1.43,0 -2.68,0.75 -3.39,1.87 -0.39,0.62 -0.61,1.35 -0.61,2.13
z;
        
m 40.1,44.1
c 0,2.21 1.79,4 4,4 1.52,0 2.85,-0.85 3.52,-2.1 -0.34,-0.27 -0.67,-0.47 -1.02,-0.68 -0.86,-0.52 -1.84,-1.09 -2.88,-1.69 -1.17,-0.67 -2.3,-1.28 -3.01,-1.66 -0.39,0.62 -0.61,1.35 -0.61,2.13
z;


'></animate>
          </path>
        </svg>
      </div>
      <p>hello paragraph</p>
    </div>
  );
};

export default GlobalTest;
