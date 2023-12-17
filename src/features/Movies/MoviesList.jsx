import { useState, useLayoutEffect, useRef, useCallback, memo } from 'react';
import { useGetMoviesWithTitleQuery } from './moviesApiSlice';
import { useParams, useSearchParams } from 'react-router-dom';
import Card from '../../components/Card';
import ProgressBar from './ProgressBar';
import Spinner from '../../components/Spinner';
import MoviesListToolbar from './MoviesListToolbar';
import MovieDetailsModal from './MovieDetailsModal';
import '../../styles/MoviesList.scss';

// The data are coming as an array with 2 objects
// 1. The movies that are nested inside as an Array of Objects
// 2. The total count of the documents that is also nested inside an Object

const MoviesList = () => {
  const params = useParams();
  const { title } = params;
  const [searchParams, setSearchParams] = useSearchParams();

  //WRONG!!
  // Pass all the query params into an object
  const queryObj = {};
  if (searchParams.toString) {
    for (const [key, value] of searchParams) {
      queryObj[key] = value;
    }
  }

  const [initial, setInitial] = useState(true);
  const [show, setShow] = useState(false); //Responsible for showing new results and replacing old during rendering when the images are finished loading,
  // the value is handled by the Render Images Component. In the case I get 0 movies back it is handled inside the Layout Effect,
  // the value resets during rendering when the title in the URL changes
  const [prevTitle, setPrevTitle] = useState(title); //Used to compare title values(prev-curr) during rendering
  const [trackMovies, setTrackMovies] = useState({
    previous: [],
    current: [],
    previousTitle: '',
    currentTitle: '',
  });
  const [dialogMovie, setDialogMovie] = useState();
  const counterRef = useRef(new Set());
  const dialogRef = useRef(null);

  const [progressBarSize, setProgressBarSize] = useState(0);
  const [progressBarLoaded, setProgressBarLoaded] = useState(0);
  const [isProgressBarLoading, setIsProgressBarLoading] = useState(false);

  const { currentData } = useGetMoviesWithTitleQuery(title, queryObj);

  if (initial && currentData && !trackMovies.current.length) {
    setTrackMovies((s) => ({
      ...s,
      previous: currentData,
      current: currentData,
      previousTitle: title,
      currentTitle: title,
    }));
    setIsProgressBarLoading(true);
    setProgressBarSize(currentData[0].movies.length);
  }

  // When the title changes >> update the previous values to the current ones (current has values from the previous render at this moment)
  // but leave the current value intact and update it in the Layout Effect because the Set in the ref has to be updated first(cannot access refs during rendering) and
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
    setProgressBarLoaded(0);
    setProgressBarSize(0);
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

      setTrackMovies((s) => ({
        ...s,
        current: currentData,
      }));

      if (currentData[0].movies.length) {
        setProgressBarSize(currMovies.length);
        setIsProgressBarLoading(true);
      } else {
        setShow(true);
        setIsProgressBarLoading(false);
        setInitial(false);
      }
    }
  }, [currentData]);

  // Used only in Images Component to decide when all the images have been loaded
  const imagesReady = useCallback(() => {
    const currMovies = currentData[0].movies;

    if (counterRef.current.size === currMovies.length) {
      setShow(true);
      setInitial(false);
      setIsProgressBarLoading(false);
    }
  }, [currentData]);

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
      <ProgressBar
        size={progressBarSize}
        loaded={progressBarLoaded}
        isLoading={isProgressBarLoading}
      />
      {/* Only one dialog element is rendered here for all Card components, because rendering one for each Card slows down the whole app,
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
              <span className='visually-hidden'>
                {isProgressBarLoading ? (
                  'Loading'
                ) : (
                  <>{totalResults} total results</>
                )}
              </span>
              <span aria-hidden='true'>{totalResults} total results</span>
            </output>
          </hgroup>
          {movies.length ? (
            <div className='movies__divider'>
              <MoviesListToolbar
                totalResults={totalResults}
                moviesLoaded={show}
              />
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
          ) : (
            <p>
              Sorry! No results were found for your specific search, try
              something else.
            </p>
          )}
        </section>
      )}
      {currentData?.[0].movies?.map((movie) => (
        <RenderImages
          key={movie?._id}
          src={movie?.poster ?? '/no_image.png'}
          counterRef={counterRef}
          imagesReady={imagesReady}
          id={movie?._id}
          setProgressBarLoaded={setProgressBarLoaded}
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
  setProgressBarLoaded,
}) {
  // If i get an error on an image the src value is set to the fallback image from the onError event
  // and the onLoad event triggers either way adding it to the Set
  const handleLoad = () => {
    counterRef.current.add(id);
    setProgressBarLoaded(counterRef.current.size);
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
