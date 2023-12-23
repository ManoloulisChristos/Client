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

  return (
    <>
      {movie ? (
        <>
          <li className='card__wrapper'>
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
      ) : null}
    </>
  );
});

export default Card;
