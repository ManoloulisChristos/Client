import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';

const GlobalTest = () => {
  const [visible, setVisible] = useState(0);

  const boxRef = useRef(null);
  const contRef = useRef(null);

  useEffect(() => {
    const options = {
      root: contRef.current,
      threshold: [0.6],
    };

    const callback = (entry) => {
      console.log(entry);
      console.log('intersecting', entry[0].isIntersecting);
      console.log('intersectionRation', entry[0].intersectionRatio);
      entry[0].target.classList.toggle('in-view', entry[0].isIntersecting);
      // if (entry[0].isIntersecting) {
      //   entry[0].target.classList.toggle('in-view', entry[0].isIntersecting);
      // } else {
      //   entry[0].target.classList.toggle('in-view', entry[0].isIntersecting);
      // }
    };
    const io = new IntersectionObserver(callback, options);
    io.observe(boxRef.current);
  }, []);

  const scrollTo = () => {
    const delta = Math.abs(
      boxRef.current.offsetLeft - contRef.current.offsetLeft
    );

    const pos =
      delta - contRef.current.clientWidth / 2 + boxRef.current.clientWidth / 2;
    contRef.current.scrollTo(pos, 0);
  };

  return (
    <div className='test'>
      <button
        onClick={() =>
          console.log(
            'port',
            contRef.current.offsetLeft,
            'box',
            boxRef.current.offsetLeft,
            'bounding Cont',
            contRef.current.getBoundingClientRect(),
            'scrollWidth',
            contRef.current.scrollWidth,
            'clientWidth',
            contRef.current.clientWidth,
            'offsetWidth',
            contRef.current.offsetWidth,
            'boxWidth',
            boxRef.current.offsetWidth
          )
        }>
        CLICK
      </button>
      <button onClick={scrollTo}>Scroll</button>

      <div ref={contRef} className='test__container' tabIndex='-1'>
        <div className='test__snap'>
          <div className='test__test' data-visible=''></div>
        </div>
        <div className='test__snap'>
          <div
            // ref={boxRef}
            style={{ backgroundColor: 'yellow' }}
            className='test__test'></div>
        </div>
        <div className='test__snap'>
          <div
            // ref={boxRef}
            style={{ backgroundColor: 'green' }}
            className='test__test'></div>
        </div>
        <div className='test__snap'>
          <div
            ref={boxRef}
            style={{ backgroundColor: 'blue' }}
            className='test__test'></div>
        </div>
        <div className='test__snap'>
          <div
            // ref={boxRef}
            style={{ backgroundColor: 'indigo' }}
            className='test__test2'></div>
        </div>
        <div className='test__snap'>
          <div
            // ref={boxRef}
            style={{ backgroundColor: 'orange' }}
            className='test__test'></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTest;
