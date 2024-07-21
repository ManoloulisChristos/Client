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
import Carousel from '../../components/Carousel';
import Feed from '../comments/Feed';

const Movie = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const auth = useAuth();

  const { data: movie } = useGetMovieQuery({ id });

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
    return data?.released
      ? normDate.format(new Date(data.released))
      : noInformation;
  };

  const normalizeTime = (data) => {
    if (data?.runtime) {
      const hour = Math.trunc(data.runtime / 60);
      const min = data.runtime % 60;
      return (
        <>
          <span>
            {hour}h<span className='visually-hidden'>ours</span>{' '}
          </span>
          <span>
            {min}m<span className='visually-hidden'>inutes</span>
          </span>
        </>
      );
    }
    return noInformation;
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
    return noInformation;
  };

  const noInformation = (
    <>
      <span className='visually-hidden'>Uknown</span>
      <span aria-hidden='true'>--</span>
    </>
  );
  const listCommaDecider = (array) => {
    return (
      array?.map((item, i) => (
        <span key={i}>{i >= 1 ? `, ${item}` : `${item}`}</span>
      )) ?? noInformation
    );
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
            width={265}
            height={395}
            onError={(e) => (e.target.src = '/no_image.png')}
          />
          <div className='movie__info-wrapper'>
            <header className='movie__article-header'>
              <h1 className='movie__heading'>
                {movie?.title ?? noInformation}
              </h1>
              <ul
                className='movie__basic-info-list'
                aria-label='general information'>
                <li className='movie__basic-info-item'>
                  <span className='visually-hidden'>Certificate:</span>
                  {movie?.rated ?? noInformation}
                </li>
                <li className='movie__basic-info-item'>
                  <span className='visually-hidden'>Date:</span>
                  {normalizedDate(movie)}
                </li>
                <li className='movie__basic-info-item'>
                  <span className='visually-hidden'>Runtime:</span>
                  {normalizeTime(movie)}
                </li>
              </ul>
            </header>

            <ul className='movie__ratings' aria-label='ratings'>
              <li className='movie__ratings-item '>
                <img src={imdb} alt='' width='40' height='40' />
                <span className='visually-hidden'>imdb, </span>
                {movie?.imdb?.rating ?? noInformation}
                <span className='movie__ratings-total'>
                  ({compactNumber(movie?.imdb?.votes)})
                  <span className='visually-hidden'>total reviews</span>
                </span>
              </li>
              <li className='movie__ratings-item '>
                <img src={tomatoes} alt='' width='40' height='40' />
                <span className='visually-hidden'>rotten tomatoes, </span>
                {movie?.tomatoes?.critic?.rating ?? noInformation}
              </li>
              <li className='movie__ratings-item '>
                <img src={metacritic} alt='' width='40' height='40' />
                <span className='visually-hidden'>metacritic, </span>
                {movie?.metacritic ?? noInformation}
              </li>
              <li className='movie__ratings-item '>
                <Icons
                  name='star'
                  width='40'
                  height='40'
                  svgClassName='movie__icon movie__icon--star'
                />
                {rating?.rating ?? noInformation}
              </li>
            </ul>

            <ul className='movie__genre-list' aria-label='genres'>
              {movie?.genres.map((genre) => (
                <li className='movie__genre-item' key={genre}>
                  <Link className='movie__genre-link'>{genre}</Link>
                </li>
              )) ?? null}
            </ul>

            <section
              aria-labelledby='movie-overview-heading'
              className='movie__overview-container'>
              <h2
                id='movie-overview-heading'
                className='movie__overview-heading'>
                Overview
              </h2>
              <p className='movie__fullplot'>
                {movie?.fullplot ??
                  movie?.plot ??
                  'No information about plot for this movie.'}
              </p>
            </section>

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
                  svgClassName={`movie__icon ${
                    rating ? 'movie__icon--star' : 'movie__icon--star-empty'
                  }`}
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
        <section
          aria-labelledby='movie-more-like-this-header'
          className='movie__suggested'>
          <h2
            id='movie-more-like-this-header'
            className='movie__suggested-heading'>
            More Like This
          </h2>

          <Carousel movieData={movie} />
        </section>
        <section aria-labelledby='movie-movie-information-heading'>
          <h2
            id='movie-movie-information-heading'
            className='movie__info-heading'>
            Movie Info
          </h2>

          <dl className='movie__info-list'>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Director</dt>
              <dd className='movie__dd'>
                {listCommaDecider(movie?.directors)}
              </dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Writers</dt>
              <dd>{listCommaDecider(movie?.writers)}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Cast</dt>
              <dd>{listCommaDecider(movie?.cast)}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Production Company</dt>
              <dd>{movie?.tomatoes?.production ?? noInformation}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Certificate</dt>
              <dd>{movie?.rated}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Genre</dt>
              <dd>{listCommaDecider(movie?.genres)}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Language</dt>
              <dd>{listCommaDecider(movie?.languages)}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Runtime</dt>
              <dd>{normalizeTime(movie)}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Duration</dt>
              <dd>{normalizedDate(movie)}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Awards</dt>
              <dd>{movie?.awards?.text ?? noInformation}</dd>
            </div>
            <div className='movie__list-divider'>
              <dt className='movie__term'>Box Office</dt>
              <dd>{movie?.tomatoes?.boxOffice ?? noInformation}</dd>
            </div>
          </dl>
        </section>
        <section className='movie__feed' aria-labelledby='movie-feed-heading'>
          <h2 id='movie-feed-heading' className='movie__feed-heading'>
            Comments
          </h2>
          <textarea>HELLO</textarea>
          <Feed movieId={id} />
        </section>
      </article>
    </>
  );
};

export default Movie;
