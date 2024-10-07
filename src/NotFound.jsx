import { Link, useNavigate } from 'react-router-dom';
import './styles/NotFound.scss';
import notFoundPoster from '../src/assets/img/not-found-poster.webp';
import Icons from './components/Icons';
import HelmetWrapper from './components/HelmetWrapper';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section aria-labelledby='not-found-heading' className='not-found'>
      <HelmetWrapper noIndex={true} />
      <header className='not-found__header'>
        <h1 id='not-found-heading' className='not-found__heading'>
          404 Not Found
        </h1>
        <p className='not-found__paragraph'>
          We are sorry, but the page you are looking for does not exist!
        </p>
      </header>
      <img
        className='not-found__img'
        src={notFoundPoster}
        alt='A cute cow wearing 3D glasses, a sign that reads "404 not found", a camera and some film rolls.'
      />
      <footer className='not-found__footer'>
        <button
          type='button'
          className='not-found__button'
          onClick={() => navigate(-1, { replace: true })}>
          <Icons
            name='arrowLeft'
            width='22'
            height='22'
            svgClassName='not-found__icon not-found__icon--arrow-left'
          />
          Back
        </button>
        <Link to='/' replace={true} className='not-found__link'>
          <Icons
            name='home'
            width='20'
            height='20'
            svgClassName='not-found__icon not-found__icon--home'
          />
          Home
        </Link>
      </footer>
    </section>
  );
};

export default NotFound;
