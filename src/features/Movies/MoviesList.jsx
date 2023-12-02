import { useState, useLayoutEffect, useRef, useCallback, memo } from 'react';
import { useGetMoviesWithTitleQuery } from './moviesApiSlice';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import {
  sizeValue,
  loadValue,
  reset,
  notLoading,
} from '../ProgressBar/progressBarSlice';
import { useDispatch } from 'react-redux';
import ProgressBar from '../ProgressBar/ProgressBar';
import Spinner from '../../components/Spinner';
import '../../styles/MoviesList.scss';
import MovieListToolbar from './MoviesListToolbar';
import MovieDetailsModal from './MovieDetailsModal';

// The data are coming as an array with 2 objects
// 1. The movies that are requested, are nested inside as an Array
// 2. The total count of the documents is nested inside an Object

const MoviesList = () => {
  const params = useParams();
  const { title } = params;

  const dispatch = useDispatch();

  const [initial, setInitial] = useState(true);
  const [show, setShow] = useState(false);
  const [prevTitle, setPrevTitle] = useState(title);
  const [trackMovies, setTrackMovies] = useState({
    previous: [],
    current: [],
    previousTitle: '',
    currentTitle: '',
  });
  const [dialogMovie, setDialogMovie] = useState();
  // Forces aria-live to announce the results even if it has the same number of results
  const [hasDot, setHasDot] = useState(false);
  const counterRef = useRef(new Set());
  const dialogRef = useRef(null);

  const { currentData } = useGetMoviesWithTitleQuery(title);

  if (initial && currentData && !trackMovies.current.length) {
    setTrackMovies((s) => ({
      ...s,
      previous: currentData,
      current: currentData,
      previousTitle: title,
      currentTitle: title,
    }));
  }

  // When the title changes >> update the previous values to the current ones (current has values from the previous render at this moment)
  // but leave the current value intact and update it in the layoutEffect because the Set in the ref has to be updated first and
  // it ensures that currentData exists.

  if (prevTitle !== title) {
    setPrevTitle(title);
    setShow(false);
    setTrackMovies((s) => ({
      ...s,
      previous: s.current,
      previousTitle: s.currentTitle,
      currentTitle: title,
    }));
    dispatch(reset());
  }

  // Here a check for duplicate movies is happening to populate the Set with already loaded images
  // eg: when a user searches for 'super' and then 'superman' some images are already in the browsers cache and ProgressBar needs to know that
  useLayoutEffect(() => {
    if (currentData) {
      // The Set has the values from the last render
      const set = counterRef.current;
      const currMovies = currentData?.[0].movies;
      const duplicates = new Set();
      currMovies.forEach((item) => {
        if (set.has(item._id)) {
          duplicates.add(item._id);
        }
      });

      set.clear();
      if (duplicates.size) {
        duplicates.forEach((item) => set.add(item));
      }

      if (
        trackMovies?.current[0]?.countResults?.count?.lowerBound ===
        currentData?.[0]?.countResults?.count?.lowerBound
      ) {
        setHasDot((n) => !n);
      }

      setTrackMovies((s) => ({
        ...s,
        current: currentData,
      }));

      dispatch(sizeValue(currMovies.length));
    }
  }, [currentData, dispatch]);

  const imagesReady = useCallback(() => {
    const currMovies = currentData?.[0].movies;
    if (counterRef.current.size === currMovies.length) {
      setShow(true);
      setInitial(false);
      dispatch(notLoading());
    }
  }, [currentData, dispatch]);

  let content;
  let searchTitle;
  let totalResults;
  let movies;
  if (!initial) {
    content = show ? trackMovies.current : trackMovies.previous;
    searchTitle = show ? trackMovies.currentTitle : trackMovies.previousTitle;
    totalResults = content?.[0]?.countResults?.count.lowerBound ?? 0;
    movies = content?.[0].movies;
  }

  return (
    <>
      <ProgressBar />
      {/* One dialog element is rendered here for all Card components, because rendering one for each Card slows down the whole app,
       eg: I get more than 130ms recalculation of styles when a user presses the theme toggle button which is obvious and annoying.
       So one global id is used for all the buttons that control the opening of the dialog in all Card components  */}
      <MovieDetailsModal movie={dialogMovie} ref={dialogRef} />
      {initial ? (
        <Spinner />
      ) : (
        <section
          aria-labelledby='movies-search-title'
          aria-describedby='progress-bar'
          aria-busy={!show}
          id='movies-list-section'
          className={`movies__wrapper }`}>
          <hgroup>
            <h1 className='movies__header' id='movies-search-title'>
              Search for:{' '}
              <span className='movies__result'>{`"${searchTitle}"`}</span>
            </h1>
            <output
              form='autocomplete-form'
              htmlFor='autocomplete-input'
              name='search-total-results'
              className='movies__count'>
              {totalResults} total results
              <span className='visually-hidden'>{hasDot ? <>.</> : null}</span>
            </output>
          </hgroup>
          <div className='movies__divider'>
            <MovieListToolbar />
            <ul className='movies__list'>
              {movies?.map((movie) => (
                <Card
                  movie={movie}
                  key={`${movie?._id}`}
                  dialogRef={dialogRef}
                  setDialogMovie={setDialogMovie}
                />
              ))}
            </ul>
          </div>
        </section>
      )}
      {currentData?.[0].movies?.map((movie) => (
        <RenderImages
          key={movie?._id}
          src={movie?.poster ?? '/no_image.png'}
          counterRef={counterRef}
          imagesReady={imagesReady}
          id={movie?._id}
        />
      ))}
    </>
  );
};

export default MoviesList;

const RenderImages = memo(function RenderImages({
  src,
  imagesReady,
  counterRef,
  id,
}) {
  const dispatch = useDispatch();

  // If i get an error on an image the src value is set to the fallback image from the onError event
  // and the onLoad event triggers either way adding it to the Set
  const handleLoad = () => {
    counterRef.current.add(id);
    dispatch(loadValue(counterRef.current.size));
    imagesReady();
  };

  const handleError = (e) => {
    e.target.src = '/no_image.png';
  };

  return (
    <img
      className='movies--hide'
      alt=''
      src={src}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});
