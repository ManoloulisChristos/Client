import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link } from 'react-router-dom';

const GlobalTest = () => {
  const [visible, setVisible] = useState(0);
  const testRef = useRef(null);

  return (
    <div className='test'>
      <button onClick={() => testRef.current.setAttribute('readOnly', '')}>
        Add
      </button>
      <button onClick={() => testRef.current.removeAttribute('readOnly')}>
        Renive
      </button>
      <textarea ref={testRef}></textarea>
    </div>
  );
};

export default GlobalTest;
