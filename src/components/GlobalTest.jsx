import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';

const GlobalTest = () => {
  const [count, setCount] = useState(5);
  return (
    <div className='test__container'>
      <img
        width='40'
        height='40'
        src='https://api.dicebear.com/8.x/initials/svg?seed=fef&radius=50&backgroundColor=5d4038&chars=1&fontFamily=Helvetica'
        alt=''
      />
      <button onClick={() => setCount(1)}>1</button>
      <button onClick={() => setCount(2)}>2</button>
      <p>{count}</p>
    </div>
  );
};

export default GlobalTest;
