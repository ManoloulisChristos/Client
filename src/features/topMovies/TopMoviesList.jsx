import { useState, useLayoutEffect, useRef, useCallback, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../movies/Card';
import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';
import MoviesListToolbar from '../movies/MoviesListToolbar';
import MovieDetailsModal from '../movies/MovieDetailsModal';
import RatingModal from '../movies/RatingModal';
import '../../styles/TopMoviesList.scss';

const TopMoviesList = ({ movies }) => {
  const location = useLocation();

  const [initial, setInitial] = useState(true);
  const [show, setShow] = useState(false); //Responsible for showing new results and replacing old during rendering when the images are finished loading,
  // the value is handled by the Render Images Component. In the case I get 0 movies back it is handled inside the Layout Effect,
  // the value resets during rendering when the title in the URL changes
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  const [trackMovies, setTrackMovies] = useState({
    previous: [],
    current: [],
  });

  const [modalData, setModalData] = useState(); // Sets the movie information for the modals based on the card that was clicked
  const [ratedMovieData, setRatedMovieData] = useState(null);

  const movieModalRef = useRef(null);
  const ratingModalRef = useRef(null);
  const counterRef = useRef(new Set());

  const [progressBarSize, setProgressBarSize] = useState(0);
  const [progressBarLoaded, setProgressBarLoaded] = useState(0);
  const [isProgressBarLoading, setIsProgressBarLoading] = useState(false);

  // Display option
  const view = useSelector((state) => state.moviesToolbar.view);

  ///////// Page Load //////////
  if (initial && movies && !trackMovies.current.length) {
    setTrackMovies((s) => ({
      ...s,
      previous: movies,
      current: movies,
    }));
    setIsProgressBarLoading(true);
    setProgressBarSize(movies.length);
  }

  // When the location changes >> update the previous values to the current ones (current has values from the previous render at this moment)
  // but leave the current value intact and update it in the Layout Effect because the Set in the ref has to be updated first(cannot access refs during rendering) and
  // it ensures that currentData have been loaded.

  if (prevLocationKey !== location.key) {
    setPrevLocationKey(location.key);
    setShow(false);
    setTrackMovies((s) => ({
      ...s,
      previous: s.current,
    }));
    setProgressBarLoaded(0);
    setProgressBarSize(0);
  }

  // Here a check for duplicate movies is happening to populate the Set with already loaded images
  // eg: when a user searches for 'super' and then 'superman' some images are already in the browsers cache
  // and ProgressBar needs to know that
  useLayoutEffect(() => {
    if (movies) {
      // The Set has the values from the last render
      const set = counterRef.current;
      const currMovies = movies;
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
        current: movies,
      }));

      // Check if there are 0 movies in the request result or if i have movies
      if (movies.length) {
        setProgressBarSize(currMovies.length);
        setIsProgressBarLoading(true);
      } else {
        setShow(true);
        setIsProgressBarLoading(false);
        setInitial(false);
      }
    }
  }, [movies]);

  // Used only in Images Component(end of file) to decide when all the images have been loaded
  const imagesReady = useCallback(() => {
    const currMovies = movies;
    if (counterRef.current.size === currMovies.length) {
      setShow(true);
      setInitial(false);
      setIsProgressBarLoading(false);
    }
  }, [movies]);

  let content;
  if (!initial) {
    content = show ? trackMovies.current : trackMovies.previous; // Manages what movies are shown based on the result of the loadedImages
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
      <MovieDetailsModal movie={modalData} ref={movieModalRef} />
      <RatingModal
        movieId={modalData?._id}
        movieRating={ratedMovieData?.rating}
        movieTitle={modalData?.title}
        ref={ratingModalRef}
      />
      {initial ? (
        <Spinner />
      ) : (
        <section
          aria-labelledby='top-movies-heading'
          aria-describedby='progress-bar'
          aria-busy={!show}
          id='movies-list-section'
          className='top-movies-list'>
          <output
            form='autocomplete-form'
            htmlFor='autocomplete-input'
            name='search-total-results'
            className='top-movies-list__count'>
            <span className='visually-hidden'>
              {isProgressBarLoading ? 'Loading' : 'Ready'}
            </span>
          </output>

          <ul
            className={
              view === 'list'
                ? 'top-movies-list__list'
                : 'top-movies-list__grid'
            }>
            {content?.map((movie) => (
              <Card
                movie={movie}
                key={`${movie?._id}`}
                setModalData={setModalData}
                setRatedMovieData={setRatedMovieData}
                movieModalRef={movieModalRef}
                ratingModalRef={ratingModalRef}
              />
            ))}
          </ul>
        </section>
      )}

      {/* the key is important because in the case when only the sort order changes for example, the same images appear so
      the imagesReady function does not run and everything breaks. Workaround: in every new location based on the URL the images re-render
      and they get pulled from the cache so the function runs and everything that depends on it(everything...) get's updated. */}
      <div key={location.key}>
        {movies?.map((movie) => (
          <RenderImages
            key={movie?._id}
            src={movie?.poster ?? '/no_image.png'}
            counterRef={counterRef}
            imagesReady={imagesReady}
            id={movie?._id}
            setProgressBarLoaded={setProgressBarLoaded}
          />
        ))}
      </div>
    </>
  );
};

export default TopMoviesList;

const RenderImages = memo(function RenderImages({
  src,
  imagesReady,
  counterRef,
  id,
  setProgressBarLoaded,
}) {
  // If i get an error on an image the src value is set to the fallback image from the onError event
  // and the onLoad event triggers normally because of the fallback being loaded in its place and the Set is populated correctly.
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
