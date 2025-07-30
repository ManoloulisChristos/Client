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
  const headerRef = useRef(null);
  const divRef = useRef(null);
  const react19Ref = useRef(null);
  const mapRef = useRef(null);
  const [testState, setTestState] = useState(true);
  const btnRef = useRef(null);
  const incrimentRef = useRef(false);
  const [incState, setIncState] = useState(0);
  const btnClick = () => {};
  const getMap = (ref) => {
    if (!ref.current) {
      ref.current = new Map();
    }
    return ref.current;
  };
  const stableRef = useCallback((node) => {
    const map = getMap(mapRef);

    if (node) {
      console.log('placement');
      map.set(node.dataset.index, node);
    } else {
      console.log('cleanup');
      map.delete(1);
    }
    return () => {
      console.log('cleanup-return');
      console.log(node.dataset.index);
      map.delete(node.dataset.index);
    };
  }, []);
  const moov = ['M', 'O', 'O', 'V'];
  console.log(incState);
  return (
    <div>
      {moov.map((n, index) =>
        testState ? (
          <p ref={stableRef} data-index={index} key={index}>
            <span>{n}</span>
          </p>
        ) : (
          <p key={index}>
            <span>{n} 2</span>
          </p>
        )
      )}
      {moov.map((n, index) =>
        testState ? (
          <p
            data-index={index}
            ref={(node) => {
              const map = getMap(headerRef);
              if (node) {
                console.log('set normal');
                map.set(index, node);
              } else {
                console.log('cleanup-normal');
                map.delete(index);
              }
              return () => {
                console.log('cleanup-normal-return');
                console.log(node.dataset.index);
                map.delete(index);
              };
            }}
            key={index}>
            <span>{n}</span>
          </p>
        ) : (
          <p key={index}>
            <span>{n} 2</span>
          </p>
        )
      )}
      <button onClick={() => setTestState((n) => !n)}>change state</button>
      <button onClick={() => setIncState((n) => n + 1)}>
        change inc-state
      </button>
      <button
        onClick={() =>
          console.log(
            mapRef.current.forEach((val, key) => console.log(key, val))
          )
        }>
        change inc-state
      </button>
    </div>
  );
};

export default GlobalTest;
