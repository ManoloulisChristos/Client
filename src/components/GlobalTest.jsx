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
  const [state1, setState1] = useState('state-1__init');
  const [state2, setState2] = useState('state-2__init');
  const [state3, setState3] = useState('state-3__init');

  useLayoutEffect(() => {
    setState1('state1__phase-1');
  }, []);
  useLayoutEffect(() => {
    // setState2('state-2__phase-1');
    console.log('layout-2', state1);
    console.log('layout-2', state2);
    console.log('effect', state3);
  }, [state1, state2, state3]);
  useEffect(() => {
    console.log('effect', state1);
    console.log('effect', state2);
    console.log('effect', state3);
    setState3('state-3__phase-1');
  }, [state1, state2, state3]);

  console.log('first', state1);
  console.log('first', state2);
  console.log('first', state3);

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
    // rect2Ref.current.setAttribute('transform', 'matrix(' + s + ')');
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
      <p>hello paragraph</p>
    </div>
  );
};

export default GlobalTest;
