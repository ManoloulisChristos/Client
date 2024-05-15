import { useRef, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { selectAllToasts, selectTotalToasts } from './toastsSlice';
import SingleToast from './SingleToast';

import '../../styles/Toast.scss';

const Toasts = () => {
  const toasts = useSelector((state) => selectAllToasts(state));
  const toastsTotal = useSelector((state) => selectTotalToasts(state));

  const keepTrackRef = useRef({ prevHeight: 0, prevToastsCount: 0 });
  const containerRef = useRef();

  useLayoutEffect(() => {
    const { matches: motionOK } = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    );

    if (motionOK) {
      // FLIP Animation
      const first = keepTrackRef.current.prevHeight;
      const last = containerRef.current.offsetHeight;
      const invert = last - first;

      keepTrackRef.current.prevHeight = last;

      // If total count increments then animate
      if (toastsTotal > keepTrackRef.current.prevToastsCount) {
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
        // Start in current frame
        animation.startTime = document.timeline.currentTime;
      }

      keepTrackRef.current.prevToastsCount = toastsTotal;
    }
  });

  let content;

  if (!toasts) {
    content = null;
  } else {
    content = toasts.map((item) => <SingleToast key={item.id} toast={item} />);
  }

  return createPortal(
    <>
      <section
        ref={containerRef}
        className='toast__container'
        role='status'
        aria-atomic='false'>
        {content}
      </section>
    </>,
    document.body
  );
};

export default Toasts;
