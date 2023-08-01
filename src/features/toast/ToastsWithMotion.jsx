import { useRef, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllToasts, selectTotalToasts } from './toastsSlice';
import Toast from './Toast';

import '../../styles/Toast.scss';

const ToastsWithMotion = () => {
  const toasts = useSelector((state) => selectAllToasts(state));
  const toastsCount = useSelector((state) => selectTotalToasts(state));
  const [prevHeight, setPrevHeight] = useState(0);
  const [prevToastsCount, setPrevToastsCount] = useState(0);
  const containerRef = useRef();

  // The Effect runs on every render because i constantly need to know the previous height of the container
  // This is done because toasts come and go randomly and i need the height value at all times for the FLIP
  // The whole point of measuring the height constantly is in case of a multi line toast
  useLayoutEffect(() => {
    // FLIP Animation
    const first = prevHeight;
    const last = containerRef.current.offsetHeight;
    const invert = last - first;

    setPrevHeight(last);

    if (toastsCount > prevToastsCount) {
      const animation = containerRef.current.animate(
        [
          { transform: `translateY(${invert}px)` },
          { transform: 'translateY(0)' },
        ],
        {
          duration: 150,
          easing: 'ease-out',
        }
      );
      animation.startTime = document.timeline.currentTime;
    }

    setPrevToastsCount(toastsCount);
  });

  let content;

  if (!toasts) {
    content = null;
  } else {
    content = toasts.map((item) => <Toast key={item.id} toast={item} />);
  }

  return (
    <section ref={containerRef} className='toast__container'>
      {content}
    </section>
  );
};

export default ToastsWithMotion;
