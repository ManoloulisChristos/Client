import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const GlobalTest = () => {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const testRef = useRef(false);

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

    return () => {
      testRef.current = true;
    };
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
  return (
    <div className='test'>
      <button onClick={animatebox1}>Anim</button>
      <button
        onClick={() => {
          // console.log('current', animRef.current.currentTime);
          // console.log('timeline', document.timeline.currentTime);
          // console.log('start', animRef.current.startTime);
          console.log(animRef.current.effect.getTiming());
          console.log(animRef.current.effect.getComputedTiming());
        }}>
        Log
      </button>
      <button onClick={() => console.log(document.getAnimations())}>
        Log All
      </button>
      <button onClick={() => console.log(box1Ref.current.getAnimations())}>
        Log All
      </button>
      <button onClick={() => animRef.current.cancel()}>CANCEL</button>
      <div ref={box1Ref} className='test__box test__box--1'>
        5252525
      </div>
      <div ref={box2Ref} className='test__box test__box--2'></div>
      <div className='h1'>
        <div className='h2'>
          <h1 className='jjjj'>P</h1>
        </div>
      </div>
    </div>
  );
};

export default GlobalTest;
