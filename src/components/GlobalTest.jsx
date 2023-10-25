import { Suspense } from 'react';
import './GlobalTest.scss';
import Tooltip from './Tooltip';

const GlobalTest = () => {
  return (
    <div className='test__out'>
      <div className='test__wrapper'>
        <div className='test__box0'></div>
        <div className='test__box1'></div>
        <div className='test__box2'></div>
        <div className='test__box3'></div>
      </div>
      <div className='test__wrapper'>
        <div className='test__box4'></div>
        <div className='test__box5'></div>
        <div className='test__box6'></div>
      </div>

      {/* <div className='b-wrapper'>
        <button className='b1'> Button</button>
        <button className='b2'> Button</button>
      </div> */}
    </div>
  );
};

export default GlobalTest;
