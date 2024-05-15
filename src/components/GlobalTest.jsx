import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';

const GlobalTest = () => {
  const [persist, setPersist] = usePersist();
  const [session, setSession] = useSession();
  console.log(persist, 'persits');
  console.log(session, 'session');
  return (
    <div>
      <button onClick={() => setSession((n) => !n)}>CLICK ME BITCH</button>
      <button onClick={() => setPersist((n) => !n)}> LLLL</button>
    </div>
  );
};

export default GlobalTest;
