import { Suspense } from 'react';
import './GlobalTest.scss';
import Tooltip from './Tooltip';

const GlobalTest = () => {
  return (
    <div>
      <div className='b-wrapper'>
        <button className='b1'> Button</button>
        <button className='b2'> Button</button>
      </div>
      {/* <Suspense fallback={<div>Loading</div>}>
        <div className='test'>
          <img src='https://m.media-amazon.com/images/M/MV5BMmM1OGIzM2UtNThhZS00ZGNlLWI4NzEtZjlhOTNhNmYxZGQ0XkEyXkFqcGdeQXVyNTkxMzEwMzU@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BNTJjMmVkZjctNjNjMS00ZmI2LTlmYWEtOWNiYmQxYjY0YWVhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BNGE5MzIyNTAtNWFlMC00NDA2LWJiMjItMjc4Yjg1OWM5NzhhXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BMTFiMTkyMGUtOTI1Ny00ZDZjLTlkYTItOTdmNDlmNjA3YzRmXkEyXkFqcGdeQXVyNjQ2MzU1NzQ@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BMTFiMTkyMGUtOTI1Ny00ZDZjLTlkYTItOTdmNDlmNjA3YzRmXkEyXkFqcGdeQXVyNjQ2MzU1NzQ@._V1_SY1000_SX677_AL_.jpg' />
          <img src='https://m.media-amazon.com/images/M/MV5BMjE5MzcyNjk1M15BMl5BanBnXkFtZTcwMjQ4MjcxOQ@@._V1_SY1000_SX677_AL_.jpg' />
        </div>
      </Suspense> */}
    </div>
  );
};

export default GlobalTest;
