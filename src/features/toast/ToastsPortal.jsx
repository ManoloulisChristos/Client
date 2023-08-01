import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

import { selectAllToasts } from './toastsSlice';

import ToastsWithMotion from './ToastsWithMotion';
import ToastsWithoutMotion from './ToastsWithoutMotion';

const { matches: motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
);

const ToastsPortal = () => {
  let content;

  content = motionOK ? <ToastsWithMotion /> : <ToastsWithoutMotion />;

  return createPortal(<>{content}</>, document.body);
};

export default ToastsPortal;
