import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';

const GlobalTest = () => {
  const dispatch = useDispatch();
  const text = 'Logged in successfully';
  return (
    <div>
      <button onClick={() => dispatch(createToast(text))}>
        CLICK ME BITCH
      </button>
    </div>
  );
};

export default GlobalTest;
