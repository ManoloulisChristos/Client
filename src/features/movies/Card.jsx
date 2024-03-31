import { Link } from 'react-router-dom';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';
import '../../styles/Card.scss';

const Card = memo(function Card({ movie, dialogRef, setDialogMovie }) {
  const view = useSelector((state) => state.moviesToolbar.view);

  let gridView = true;
  if (view && view === 'list') {
    gridView = false;
  }

  const handleError = (e) => {
    e.target.src = '/no_image.png';
  };

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
  return (
    <>
      {movie ? (
        gridView ? (
          <>
            {/* Grid display */}
            <li className='card'>
              <Link
                aria-hidden='true'
                to={`/search/id/${movie._id}`}
                tabIndex='-1'>
                <img
                  className='card__image'
                  height='309'
                  width='220'
                  src={movie.poster ?? '/no_image.png'}
                  onError={handleError}
                  alt={''}
                />
              </Link>

              <h2 className='card__title' title={movie.title}>
                <Link className='card__link'>
                  {movie.title ?? 'Title not found'}
                </Link>
              </h2>
              <div className='card__information'>
                <div className='card__rating'>
                  <Icons name={'star'} svgClassName={'card__star'} />
                  <span className='visually-hidden'>rating, </span>
                  <span className='card__number'>
                    {movie.imdb?.rating ?? noInfoSpan}
                  </span>
                </div>
                <Tooltip
                  tip='bottom'
                  text='Rate'
                  hasWrapper={true}
                  id='card-user-rating-tooltip'>
                  <button
                    className='card__button-rating has-tooltip-with-wrapper'
                    aria-labelledby='card-user-rating-tooltip card-user-rating-number'>
                    <Icons
                      name={'star'}
                      svgClassName={'card__star card__star--blue'}
                    />
                    <span id='card-user-rating-number' className='card__number'>
                      {null}
                    </span>
                  </button>
                </Tooltip>
                <div className='card__duration'>
                  <span className='card__time'>
                    <span className='visually-hidden'>duration, </span>
                    {movie?.runtime ?? noInfoSpan}
                    {movie?.runtime ? (
                      <>
                        m<span className='visually-hidden'>inutes</span>
                      </>
                    ) : null}
                  </span>
                </div>
                <Tooltip
                  tip={'bottom'}
                  text={'Details'}
                  id={`${movie._id}-info`}
                  hasWrapper={true}>
                  <button
                    type='button'
                    className='card__button card__button--info has-tooltip-with-wrapper'
                    aria-labelledby={`${movie._id}-info`}
                    aria-haspopup='dialog'
                    aria-controls='movie-details-modal'
                    aria-expanded='false'
                    onClick={() => {
                      setDialogMovie(movie);
                      dialogRef.current.showModal();
                      dialogRef.current.removeAttribute('inert');
                    }}>
                    <Icons name={'info'} svgClassName='card__i' />
                  </button>
                </Tooltip>
              </div>
              <button
                type='button'
                className='card__button card__button--watchlist'>
                <Icons name={'plus'} svgClassName={'card__plus'} />
                Watchlist
              </button>
            </li>
          </>
        ) : (
          <>
            {/*//// List Display ////*/}
            <li className='card-list'>
              <Link
                aria-hidden='true'
                to={`/search/id/${movie._id}`}
                tabIndex='-1'>
                <img
                  className='card-list__image'
                  height='104'
                  width='73'
                  src={movie.poster ?? '/no_image.png'}
                  onError={handleError}
                  alt={''}
                />
              </Link>

              <div className='card-list__outer-container'>
                <h2 className='card-list__title' title={movie.title}>
                  <Link className='card-list__link'>
                    {movie.title ?? 'Title not found'}
                  </Link>
                </h2>
                <div className='card-list__inner-container'>
                  <div className='card-list__rating'>
                    <Icons name={'star'} svgClassName={'card-list__star'} />
                    <span className='visually-hidden'>rating, </span>
                    <span className='card-list__number'>
                      {movie.imdb?.rating ?? noInfoSpan}
                    </span>
                  </div>
                  <div className='card-list__duration'>
                    <span className='visually-hidden'>duration, </span>
                    {calcDuration(movie?.runtime)}
                  </div>
                  <div className='card-list_rated'>
                    <span className='visually-hidden'>classification, </span>
                    {movie.rated ?? noInfoSpan}
                  </div>
                </div>
                <button
                  type='button'
                  className='card-list__button card-list__button--watchlist'>
                  <Icons name={'plus'} svgClassName={'card-list__plus'} />
                  Watchlist
                </button>
              </div>
              <div className='card-list__info-button-wrapper'>
                <Tooltip
                  tip={'bottom'}
                  text={'Details'}
                  id={`${movie._id}-info`}
                  hasWrapper={true}>
                  <button
                    type='button'
                    className='card-list__button card-list__button--info has-tooltip-with-wrapper'
                    aria-labelledby={`${movie._id}-info`}
                    aria-haspopup='dialog'
                    aria-controls='movie-details-modal'
                    aria-expanded='false'
                    onClick={() => {
                      setDialogMovie(movie);
                      dialogRef.current.showModal();
                      dialogRef.current.removeAttribute('inert');
                    }}>
                    <Icons name={'info'} svgClassName='card-list__i' />
                  </button>
                </Tooltip>
              </div>
            </li>
          </>
        )
      ) : null}
    </>
  );
});

export default Card;
