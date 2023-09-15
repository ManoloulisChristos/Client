import { useState, useLayoutEffect, useRef, useCallback, memo } from 'react';
import { useGetMoviesWithTitleQuery } from './moviesApiSlice';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import '../../styles/MoviesList.scss';

import {
  sizeValue,
  loadValue,
  reset,
  notLoading,
} from '../ProgressBar/progressBarSlice';
import { useDispatch } from 'react-redux';
import ProgressBar from '../ProgressBar/ProgressBar';
import MovieDetailsModal from './MovieDetailsModal';
// The data are coming as an array with 2 objects
// 1. The movies that are requested nested inside as an Array
// 2. The total count of the documents nested inside an Object

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

  const [dialogData, setDialogData] = useState();

  const counterRef = useRef(new Set());
  const dialogRef = useRef(null);

  const {
    data: moviesArr,
    currentData,
    isLoading,
    isFetching,
  } = useGetMoviesWithTitleQuery(title);

  if (initial && currentData && !trackMovies.current.length) {
    setTrackMovies((s) => ({
      ...s,
      previous: currentData,
      current: currentData,
      previousTitle: title,
      currentTitle: title,
    }));
  }

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

  useLayoutEffect(() => {
    if (currentData) {
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
    totalResults = content?.[0].countResults?.count.lowerBound ?? 0;
    movies = content?.[0].movies;
  }

  console.log(currentData);

  return (
    <>
      <ProgressBar />

      <MovieDetailsModal movie={dialogData} ref={dialogRef} />
      {initial ? (
        <div style={{ fontSize: '6rem' }}>Skeleton</div>
      ) : (
        <section
          aria-labelledby='movies-search-title'
          aria-describedby='progress-bar'
          aria-busy={!show}
          className={`movies__wrapper }`}>
          <hgroup>
            <h1 className='movies__header' id='movies-search-title'>
              Search for:{' '}
              <span className='movies__result'>{`"${searchTitle}"`}</span>
            </h1>
            <p className='movies__count'>{totalResults} total results</p>
          </hgroup>
          <ul className='movies__section'>
            {movies?.map((movie) => (
              <Card
                movie={movie}
                key={`${movie?._id}`}
                dialogRef={dialogRef}
                setDialogData={setDialogData}
              />
            ))}
          </ul>
        </section>
      )}
      {currentData?.[0].movies.map((movie) => (
        <RenderImages
          key={movie._id}
          src={movie?.poster ?? '/no_image.png'}
          counterRef={counterRef}
          imagesReady={imagesReady}
          id={movie._id}
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
