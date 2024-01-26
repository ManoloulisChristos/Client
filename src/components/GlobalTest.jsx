import { Suspense, useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import Tooltip from './Tooltip';

const GlobalTest = () => {
  const [value, setValue] = useState(0);

  return (
    <div className='test__container'>
      <fieldset className='test__fieldset'>
        <legend className='test__legend'> Hello</legend>
        <button>One</button>
        <button>O</button>
        <button>O</button>
      </fieldset>
    </div>
  );
};

export default GlobalTest;
