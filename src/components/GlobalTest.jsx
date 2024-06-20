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
      <dl>
        <dt>Genres</dt>
        <dd>
          A free, open source, cross-platform, graphical web browser developed
          by the Mozilla Corporation and hundreds of volunteers.
        </dd>
      </dl>
    </div>
  );
};

export default GlobalTest;
