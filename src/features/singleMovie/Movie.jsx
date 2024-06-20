import { Link, useParams } from 'react-router-dom';
import { useGetMovieQuery } from './movieApiSlice';
import metacritic from '../../assets/SVG/metacritic_logo.svg';
import imdb from '../../assets/SVG/imdb_logo.svg';
import tomatoes from '../../assets/SVG/tomatoes_logo.svg';
import '../../styles/Movie.scss';
import Icons from '../../components/Icons';
import RatingModal from '../movies/RatingModal';
import { useRef, useState } from 'react';
import { useGetRatingsQuery } from '../ratings/ratingsApiSlice';
import {
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
  useGetWatchlistQuery,
} from '../watchlist/watchlistApiSlice';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { createToast } from '../toast/toastsSlice';

const Movie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const auth = useAuth();

  const { data: movie } = useGetMovieQuery({ id });
  console.log(movie);

  const { rating } = useGetRatingsQuery(
    { userId: auth?.id },
    {
      selectFromResult: ({ data }) => ({
        rating: data?.find(({ movieId }) => movieId === movie?._id) ?? null,
      }),
    }
  );

  const { watchlist } = useGetWatchlistQuery(
    { userId: auth?.id },
    {
      selectFromResult: ({ data }) => ({
        watchlist: data?.find(({ movieId }) => movieId === movie?._id) ?? null,
      }),
    }
  );

  const [addToWatchlist] = useAddToWatchlistMutation();
  const [deleteFromWatchlist] = useDeleteFromWatchlistMutation();

  const ratingModalRef = useRef(null);

  const normalizedDate = (data) => {
    //Set Intl API options
    const dateOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const normDate = new Intl.DateTimeFormat('en-GB', dateOptions);
    return data?.released ? (
      normDate.format(new Date(data.released))
    ) : (
      <span aria-hidden='true'>--</span>
    );
  };

  const normalizeTime = (data) => {
    if (data?.runtime) {
      const hour = Math.trunc(data.runtime / 60);
      const min = data.runtime % 60;
      return (
        <>
          <span>{hour}h </span>
          <span>{min}m</span>
        </>
      );
    }
    return <span aria-hidden='true'>--</span>;
  };

  // Change big numbers display 1000 > 1k
  const compactNumber = (data) => {
    const numOptions = {
      notation: 'compact',
    };

    const normNum = new Intl.NumberFormat('en', numOptions);
    if (data) {
      return normNum.format(data);
    }
    return null;
  };

  const handleWatchlistClick = async () => {
    if (watchlist) {
      await deleteFromWatchlist({ userId: auth.id, movieId: movie._id });

      dispatch(createToast('success', 'Removed from Watchlist'));
    } else {
      await addToWatchlist({ userId: auth.id, movieId: movie._id });
      dispatch(createToast('success', 'Added to Watchlist'));
    }
  };

  return (
    <>
      <RatingModal
        ref={ratingModalRef}
        movieId={movie?._id}
        movieRating={rating?.rating}
        movieTitle={movie?.title}
      />

      <article className='movie'>
        <div className='movie__header-container'>
          <img
            className='movie__poster'
            src={movie?.poster ?? '/no_image.png'}
            alt=''
          />
          <div className='movie__info-wrapper'>
            <header className='movie__article-header'>
              <h1 className='movie__heading'>{movie?.title}</h1>
              <ul className='movie__basic-info-list'>
                <li className='movie__basic-info-item'>
                  {movie?.rated ?? <span aria-hidden='true'>--</span>}
                </li>
                <li className='movie__basic-info-item'>
                  {normalizedDate(movie)}
                </li>
                <li className='movie__basic-info-item'>
                  {normalizeTime(movie)}
                </li>
              </ul>
            </header>

            <ul className='movie__ratings' aria-label='ratings'>
              <li className='movie__ratings-item '>
                <img src={imdb} alt='' width='40' height='40' />
                <span className='visually-hidden'>imdb, </span>
                {movie?.imdb?.rating ?? '--'}
                <span className='movie__ratings-total'>
                  ({compactNumber(movie?.imdb?.votes)})
                </span>
              </li>
              <li className='movie__ratings-item '>
                <img src={tomatoes} alt='' width='40' height='40' />
                <span className='visually-hidden'>rotten tomatoes, </span>
                {movie?.tomatoes?.critic?.rating ?? '--'}
              </li>
              <li className='movie__ratings-item '>
                <img src={metacritic} alt='' width='40' height='40' />
                <span className='visually-hidden'>metacritic, </span>
                {movie?.metacritic ?? '--'}
              </li>
              <li className='movie__ratings-item '>
                <Icons
                  name='star'
                  width='40'
                  height='40'
                  svgClassName='movie__icon movie__icon--star'
                />
                {rating?.rating ?? '--'}
              </li>
            </ul>

            <ul className='movie__genre-list'>
              {movie?.genres.map((genre) => (
                <li className='movie__genre-item' key={genre}>
                  <Link className='movie__genre-link'>{genre}</Link>
                </li>
              )) ?? null}
            </ul>

            <hgroup className='movie__overview-container'>
              <h2 className='movie__plot-heading'>Overview</h2>
              <p className='movie__fullplot'>
                {movie?.fullplot ??
                  movie?.plot ??
                  'No information found for this movie.'}
              </p>
            </hgroup>

            <div className='movie__button-group'>
              <button
                type='button'
                className='movie__button movie__button--rate'
                onClick={() => {
                  ratingModalRef.current.showModal();
                  ratingModalRef.current.removeAttribute('inert');
                }}>
                <Icons
                  name='star'
                  width='18'
                  height='18'
                  svgClassName='movie__icon movie__icon--star-empty'
                />
                Rate
              </button>
              <button
                type='button'
                className='movie__button movie__button--watchlist'
                onClick={handleWatchlistClick}>
                <Icons
                  name={watchlist ? 'check' : 'plus'}
                  width='20'
                  height='20'
                  svgClassName='movie__icon movie__icon--plus'
                />
                Watchlist
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default Movie;
