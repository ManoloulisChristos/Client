import { forwardRef } from 'react';
import '../../styles/MovieDetailsModal.scss';
import { Link } from 'react-router-dom';
import Icons from '../../components/Icons';
import metacritic from '../../assets/SVG/metacritic_logo.svg';
import imdb from '../../assets/SVG/imdb_logo.svg';
import tomatoes from '../../assets/SVG/tomatoes_logo.svg';

const MovieDetailsModal = forwardRef(function MovieDetailsModal(
  { movie },
  ref
) {
  const noInfoSpan = (
    <span>
      <span aria-hidden='true'>--</span>
      <span className='visually-hidden'>uknown</span>
    </span>
  );

  const lightDismiss = (e) => {
    if (e.target.nodeName === 'DIALOG') {
      ref.current.close();
    }
  };

  const handleDialogClose = (e) => {
    e.currentTarget.setAttribute('inert', '');
  };

  return (
    <dialog
      className='movie-modal'
      ref={ref}
      onClick={lightDismiss}
      onClose={handleDialogClose}
      inert=''>
      <article className='movie-modal__article'>
        <header className='movie-modal__header'>
          <h3 className='movie-modal__title'>
            <Link className='movie-modal__link'>
              {movie?.title ?? 'Uknown Title'}
            </Link>
          </h3>
          <button
            className='movie-modal__close-icon'
            onClick={() => ref.current.close()}>
            <span className='visually-hidden'>Close Modal</span>
            <Icons name='close' />
          </button>
        </header>
        <div className='movie-modal__content'>
          <div className='movie-modal__outer-divider'>
            <Link aria-hidden='true' tabIndex='-1'>
              <img
                className='movie-modal__image'
                src={movie?.poster ?? '/no_image.png'}
                onError={(e) => (e.target.src = '/no_image.png')}
                alt=''
                width='70'
                height='100'
              />
            </Link>
            <div className='movie-modal__inner-divider'>
              <ul className='movie-modal__info' aria-label='information'>
                <li className='movie-modal__item movie-modal__item--information'>
                  <span className='visually-hidden'>year, </span>
                  {movie?.year ?? noInfoSpan}
                </li>
                <li className='movie-modal__item movie-modal__item--information'>
                  <span className='visually-hidden'>duration, </span>
                  {'2h 30m' ?? noInfoSpan}
                </li>
                <li className='movie-modal__item movie-modal__item--information'>
                  <span className='visually-hidden'>classification, </span>
                  {movie?.rated ?? noInfoSpan}
                </li>
              </ul>

              <ul className='movie-modal__genres'>
                {movie?.genres.map((data, i) => (
                  <li
                    key={`${data}-${i}`}
                    className='movie-modal__item movie-modal__item--genres'>
                    {data}
                  </li>
                ))}
              </ul>

              <ul className='movie-modal__ratings' aria-label='ratings'>
                <li className='movie-modal__item movie-modal__item--ratings'>
                  <img src={imdb} alt='' width='22' height='22' />
                  <span className='visually-hidden'>imdb, </span>
                  {movie?.imdb?.rating ?? noInfoSpan}
                </li>
                <li className='movie-modal__item movie-modal__item--ratings'>
                  <img src={tomatoes} alt='' width='22' height='22' />
                  <span className='visually-hidden'>rotten tomatoes, </span>
                  {movie?.tomatoes?.critic?.rating ?? noInfoSpan}
                </li>
                <li
                  className='movie-modal__item movie-modal__item--ratings'
                  aria-label='genres'>
                  <img src={metacritic} alt='' width='22' height='22' />
                  <span className='visually-hidden'>metacritic, </span>
                  {movie?.metacritic ?? noInfoSpan}
                </li>
              </ul>
            </div>
          </div>
          <p className='movie-modal__plot'>{movie?.plot}</p>
        </div>
        <footer className='movie-modal__footer'>
          <button className='movie-modal__button movie-modal__button--watchlist'>
            <Icons
              name='plus'
              svgClassName='movie-modal__icon movie-modal__icon--plus'
            />{' '}
            Watchlist
          </button>
          <button className='movie-modal__button movie-modal__button--more'>
            <Icons
              name='chevronRight'
              svgClassName='movie-modal__icon movie-modal__icon--right'
            />
            More
          </button>
        </footer>
      </article>
    </dialog>
  );
});

export default MovieDetailsModal;
