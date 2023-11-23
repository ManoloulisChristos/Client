import Icons from './Icons';
import '../styles/Card.scss';
import { Link, useNavigate } from 'react-router-dom';
import { memo, useRef } from 'react';
import Tooltip from './Tooltip';
import MovieDetailsModal from '../features/Movies/MovieDetailsModal';

const Card = memo(function Card({ movie }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const handleError = (e) => {
    e.target.src = '/no_image.png';
  };

  return (
    <>
      {movie ? (
        <>
          <li className='card__wrapper'>
            {/* eslint-disable-next-line */}
            <div
              onClick={() => navigate(`/search/id/${movie._id}`)}
              className='card__img'>
              <Link aria-hidden='true' tabIndex='-1'>
                <img
                  className='card__image'
                  height='309'
                  width='220'
                  src={movie.poster ?? '/no_image.png'}
                  onError={handleError}
                  alt={''}
                />
              </Link>
            </div>
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
                  {movie.imdb?.rating ?? '??'}
                </span>
              </div>
              <div className='card__duration'>
                <Icons width='18' height='18' name='clock' />
                <span className='card__time'>
                  <span className='visually-hidden'>duration, </span>
                  {movie.runtime ?? '0'}m
                  <span className='visually-hidden'>inutes</span>
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
                  aria-controls={`movie-modal-${movie._id}`}
                  aria-expanded='false'
                  onClick={() => {
                    dialogRef.current.showModal();
                    dialogRef.current.removeAttribute('inert');
                  }}>
                  <Icons name={'info'} svgClassName='card__i' />
                </button>
              </Tooltip>
            </div>

            <div className='card__controls'>
              <button
                type='button'
                className='card__button card__button--watchlist'>
                <Icons name={'plus'} svgClassName={'card__plus'} />
                Watchlist
              </button>
            </div>
          </li>
          <MovieDetailsModal movie={movie} ref={dialogRef} />
        </>
      ) : null}
    </>
  );
});

export default Card;
