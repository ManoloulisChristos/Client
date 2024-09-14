import {
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
  useEffect,
} from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from './Card';
import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';
import MoviesListToolbar from './MoviesListToolbar';
import MovieDetailsModal from './MovieDetailsModal';
import RatingModal from './RatingModal';
import { useGetMoviesWithTitleQuery } from './moviesApiSlice';
import '../../styles/MoviesList.scss';
import HelmetWrapper from '../../components/HelmetWrapper';

// The data are coming as an array with 2 objects
// 1. The movies that are nested inside as an Array of Objects
// 2. The total count of the documents that is also nested inside an Object

const MoviesList = () => {
  const params = useParams();
  const { title } = params;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // Checks the URLSearchParams and asign defaults
  let sortByQuery = 'Default';
  let sortQuery = '-1'; // -1 or 1 for descending/ascending order;
  let pageQuery = '1';
  const sortByAcceptedValues = ['Default', 'A-Z', 'Rating', 'Runtime', 'Year'];
  // Check to see if there are any search params and if there are, check if all values are correct.
  if (searchParams.toString()) {
    const sortBy = searchParams.get('sortBy');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    if (sortByAcceptedValues.includes(sortBy)) {
      sortByQuery = sortBy;
    }
    if (sort === '1' || sort === '-1') {
      sortQuery = sort;
    }
    if (Number(page) > 1 && Number(page) < 1000) {
      pageQuery = page;
    }
  }

  const [initial, setInitial] = useState(true);
  const [show, setShow] = useState(false); //Responsible for showing new results and replacing old during rendering when the images are finished loading,
  // the value is handled by the Render Images Component. In the case I get 0 movies back it is handled inside the Layout Effect,
  // the value resets during rendering when the title in the URL changes
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  const [trackMovies, setTrackMovies] = useState({
    previous: [],
    current: [],
    previousTitle: '',
    currentTitle: '',
  });

  const [modalData, setModalData] = useState(); // Sets the movie information for the modals based on the card that was clicked
  const [ratedMovieData, setRatedMovieData] = useState(null);

  const movieModalRef = useRef(null);
  const ratingModalRef = useRef(null);
  const counterRef = useRef(new Set());

  const [trackPage, setTrackPage] = useState({
    previous: parseInt(pageQuery),
    current: parseInt(pageQuery),
  }); //Keeps track of the pageQuery result based on the URL and to show the correct one between page transitions

  const [progressBarSize, setProgressBarSize] = useState(0);
  const [progressBarLoaded, setProgressBarLoaded] = useState(0);
  const [isProgressBarLoading, setIsProgressBarLoading] = useState(false);

  const endpointObject = useMemo(
    () => ({
      title,
      sortByQuery,
      sortQuery,
      pageQuery,
    }),
    [title, sortByQuery, sortQuery, pageQuery]
  );
  const { currentData } = useGetMoviesWithTitleQuery(endpointObject);

  // Display option
  const view = useSelector((state) => state.moviesToolbar.view);

  ///////// Page Load //////////
  if (initial && currentData && !trackMovies.current.length) {
    setTrackMovies((s) => ({
      ...s,
      previous: currentData,
      current: currentData,
      previousTitle: title,
      currentTitle: title,
    }));
    // setNavigationIndexes();
    setIsProgressBarLoading(true);
    setProgressBarSize(currentData[0].movies.length);
  }

  // Keeps in sync the URL (and coerces it to valid values) with what appears on the screen on page load
  useEffect(() => {
    // When a user changes the URL manually all query values are checked and coerced to valid ones (above).
    // If he then presses Enter this causes a full page load so I only need to check if the values are different from the expected ones
    // only one time and that is the first time the component runs (this is the reason for disabling the linter).
    // After that I coerce the URL to the valid one so it is in sync with what appears on screen.
    // The useEffect hook is used because setSearchParams cannot be used in conjunction with the setters of the component during rendering.
    // (throws Error of multiple components rendering together, RouterProvider + MoviesList)
    if (
      `sortBy=${sortByQuery}&sort=${sortQuery}&page=${pageQuery}` !==
      searchParams.toString()
    ) {
      setSearchParams(
        {
          sortBy: sortByQuery,
          sort: sortQuery,
          page: pageQuery,
        },
        { replace: true }
      );
    }
    //eslint-disable-next-line
  }, []);

  // When the location changes >> update the previous values to the current ones (current has values from the previous render at this moment)
  // but leave the current value intact and update it in the Layout Effect because the Set in the ref has to be updated first(cannot access refs during rendering) and
  // it ensures that currentData have been loaded.

  if (prevLocationKey !== location.key) {
    setPrevLocationKey(location.key);
    setShow(false);
    setTrackMovies((s) => ({
      ...s,
      previous: s.current,
      previousTitle: s.currentTitle,
      currentTitle: title,
    }));
    setTrackPage((s) => ({
      ...s,
      previous: s.current,
      current: parseInt(pageQuery),
    }));
    setProgressBarLoaded(0);
    setProgressBarSize(0);
  }

  // Here a check for duplicate movies is happening to populate the Set with already loaded images
  // eg: when a user searches for 'super' and then 'superman' some images are already in the browsers cache
  // and ProgressBar needs to know that
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

      // Check if there are 0 movies in the request result or if i have movies
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

  const calculateNavigationIndexes = (pageCount, currentPage) => {
    if (!pageCount) return;
    let arr = []; //max array length will always be less or equal to 6
    //[First, -1, 0, +1, +2, Last] this is the structure of the array where 0 is the current page,
    // except in edge cases covered bellow
    if (pageCount <= 6) {
      // return all
      arr = [...Array(pageCount).keys()].map((val) => val + 1);
    } else if (pageCount > 6 && currentPage <= 3) {
      // return 5 first and the last page (-1 because the map adds always +1 so the array keys match the pages and avoid having a 0 as the element in the array)
      arr = [...Array(5).keys(), pageCount - 1].map((val) => val + 1);
    } else if (pageCount > 6 && pageCount - currentPage <= 3) {
      //return the first and the 4 last pages when the current page is less than 3 indexes away from the last page
      arr = [1];
      let i = pageCount - 4;
      while (i <= pageCount) {
        arr.push(i);
        i++;
      }
    } else if (
      pageCount > 6 &&
      currentPage > 3 &&
      pageCount - currentPage > 3
    ) {
      arr = [1]; //add 1rst
      for (let i = -1; i < 3; i++) {
        // add middle
        arr.push(currentPage + i);
      }
      arr = [...arr, pageCount]; // add last
    }
    return arr.map((val, i) => (
      <li key={i} className='movies__navigation-item'>
        <Link
          className='movies__navigation-link'
          to={`${location.pathname}?sortBy=${sortByQuery}&sort=${sortQuery}&page=${val}`}
          aria-current={currentPage === val ? 'page' : 'false'}
          onClick={(e) => {
            if (currentPage === val) e.preventDefault();
          }}>
          {val}
        </Link>
      </li>
    ));
  };

  // Used only in Images Component(end of file) to decide when all the images have been loaded
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
  let currentPage;
  let totalResults;
  let movies;
  let pageCount;
  if (!initial) {
    content = show ? trackMovies.current : trackMovies.previous; // Manages what movies are shown based on the result of the loadedImages
    searchTitle = show ? trackMovies.currentTitle : trackMovies.previousTitle; // Same for the title
    currentPage = show ? trackPage.current : trackPage.previous; // Same for the page transitions
    totalResults = content?.[0]?.countResults?.count.lowerBound ?? 0;
    movies = content?.[0].movies;
    pageCount = Math.ceil(totalResults / 20);
  }

  const computedNavigationPages = (
    <>{calculateNavigationIndexes(pageCount, currentPage)}</>
  );
  return (
    <>
      <HelmetWrapper
        title='Search Results'
        description={`Movie results for searching the title ${title}`}
        keywords={`Search, Movies, Results, ${title}`}
      />
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
          aria-labelledby='movies-search-title'
          aria-describedby='progress-bar'
          aria-busy={!show}
          id='movies-list-section'
          className={`movies__wrapper`}>
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
            <>
              <div className='movies__merger'>
                <MoviesListToolbar
                  totalResults={totalResults}
                  newMoviesLoaded={show}
                  currentPage={currentPage}
                />
                <ul
                  className={view === 'list' ? 'movies__list' : 'movies__grid'}>
                  {movies?.map((movie) => (
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
              </div>
              <nav className='movies__navigation' aria-label='pagination'>
                <ul
                  className='movies__navigation-list'
                  data-display={view === 'grid' ? 'grid' : 'list'}>
                  <li className='movies__navigation-item movies__navigation-item--prev'>
                    <Link
                      className='movies__navigation-link'
                      to={`${
                        location.pathname
                      }?sortBy=${sortByQuery}&sort=${sortQuery}&page=${
                        currentPage - 1
                      }`}
                      aria-disabled={currentPage === 1 ? 'true' : 'false'}
                      onClick={(e) => {
                        if (currentPage === 1) {
                          e.preventDefault();
                        }
                      }}>
                      Prev
                    </Link>
                  </li>
                  {computedNavigationPages}
                  <li className='movies__navigation-item movies__navigation-item--next'>
                    <Link
                      className='movies__navigation-link'
                      to={`${
                        location.pathname
                      }?sortBy=${sortByQuery}&sort=${sortQuery}&page=${
                        currentPage + 1
                      }`}
                      aria-disabled={
                        currentPage === pageCount ? 'true' : 'false'
                      }
                      onClick={(e) => {
                        if (currentPage === pageCount) e.preventDefault();
                      }}>
                      Next
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <p>
              Sorry! No results were found for your specific search, try
              something else.
            </p>
          )}
        </section>
      )}
      {/* the key is important because in the case when only the sort order changes for example, the same images appear so
      the imagesReady function does not run and everything breaks. Workaround: in every new location based on the URL the images re-render
      and they get pulled from the cache so the function runs and everything that depends on it(everything...) get's updated. */}
      <div key={location.key}>
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
      </div>
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
