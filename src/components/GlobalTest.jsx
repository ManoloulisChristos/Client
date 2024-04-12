import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';

const GlobalTest = () => {
  return (
    <div className='test'>
      <div className='test__container'>
        <ul className='test__list'>
          <li className='test__item'>option</li>
          <li className='test__item'>option</li>
          <li className='test__item'>option</li>
          <li className='test__item'>option</li>
        </ul>

        <ul className='test__list'>
          <li className='test__item'>option</li>
          <li className='test__item'>option</li>
          <li className='test__item'>option</li>
          <li className='test__item'>option</li>
        </ul>
      </div>
    </div>
  );
};

export default GlobalTest;
