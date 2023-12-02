import { Suspense, useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import Tooltip from './Tooltip';

const GlobalTest = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      {/* <label htmlFor='progress-test'>Loading:</label> */}
      {/* <progress id='progress-test' max='100' value={value}></progress> */}

      <div
        role='progressbar'
        aria-label='loading'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}></div>
      <button onClick={() => setValue((n) => n + 20)}>Go</button>
      <button onClick={() => setValue((n) => (n = 0))}>Go</button>
    </div>
  );
};

export default GlobalTest;
