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
  const svgRef = useRef(null);
  const testRef = useRef(null);

  const handleStartClick = (e) => {
    console.log(e);
  };

  return (
    <div className='test'>
      <button onClick={handleStartClick}>Start</button>
      <div className='test__box'></div>
    </div>
  );
};

export default GlobalTest;
