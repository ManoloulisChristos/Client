import '../../styles/MovieDetailsModal.scss';
import { Link } from 'react-router';
import Icons from '../../components/Icons';
import metacritic from '../../assets/SVG/metacritic_logo.svg';
import imdb from '../../assets/SVG/imdb_logo.svg';
import tomatoes from '../../assets/SVG/tomatoes_logo.svg';

const MovieDetailsModal = ({
  movie,
  ref,
  inertMovieModal,
  setInertMovieModal,
}) => {
  const noInfoSpan = (
    <span>
      <span aria-hidden='true'>--</span>
      <span className='visually-hidden'>uknown</span>
    </span>
  );

  const calcDuration = (time) => {
    if (time) {
      const hours = Math.floor(time / 60);
      const min = time % 60;

      return (
        <>
          {hours !== 0 ? (
            <>
              {hours}h
              <span className='visually-hidden'>
                our{hours > 1 ? 's' : null}
              </span>
            </>
          ) : null}
          {min}m<span className='visually-hidden'>inutes</span>
        </>
      );
    }
    return noInfoSpan;
  };

  const lightDismiss = (e) => {
    // this works because Dialog element expands to the whole screen
    if (e.target.nodeName === 'DIALOG') {
      ref.current.close();
    }
  };

  const handleDialogClose = (e) => {
    setInertMovieModal(true);
  };

  return (
    <dialog
      ref={ref}
      id='movie-details-modal'
      className='movie-modal'
      onClick={lightDismiss}
      onClose={handleDialogClose}
      inert={inertMovieModal}>
      <article className='movie-modal__article'>
        <header className='movie-modal__header'>
          <h3 className='movie-modal__title'>
            {movie?.title ?? 'Uknown Title'}
          </h3>
          <button
            type='button'
            aria-controls='movie-details-modal'
            aria-expanded='true'
            className='movie-modal__close-icon'
            onClick={() => ref.current.close()}>
            <span className='visually-hidden'>Close Dialog</span>
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
                  {calcDuration(movie?.runtime)}
                </li>
                <li className='movie-modal__item movie-modal__item--information'>
                  <span className='visually-hidden'>classification, </span>
                  {movie?.rated ?? noInfoSpan}
                </li>
              </ul>

              <ul className='movie-modal__genres' aria-label='genres'>
                {movie?.genres?.map((data, i) => (
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
          <p className='movie-modal__plot'>{movie?.plot ?? null}</p>
        </div>
        <footer className='movie-modal__footer'>
          <button
            type='button'
            className='movie-modal__button movie-modal__button--watchlist'
            onClick={() => ref.current.close()}>
            Close
          </button>
          <button
            type='button'
            className='movie-modal__button movie-modal__button--more'>
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
};

export default MovieDetailsModal;
