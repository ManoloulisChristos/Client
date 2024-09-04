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
import { useGetFilteredMoviesQuery } from './advSearchApiSlice';
import Card from '../movies/Card';
import ProgressBar from '../../components/ProgressBar';
import AdvMoviesListToolbar from './AdvMoviesListToolbar';
import MovieDetailsModal from '../movies/MovieDetailsModal';
import RatingModal from '../movies/RatingModal';
import Icons from '../../components/Icons';
import '../../styles/AdvMoviesList.scss';

const AdvMoviesList = () => {
  // The data are coming as an array with 2 objects
  // 1. The movies that are nested inside as an Array of Objects
  // 2. The total count of the documents that is also nested inside an Object

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // Checks the URLSearchParams and asign defaults
  let sortByQuery = 'Default';
  let sortQuery = '-1'; // -1 or 1 for descending/ascending order;
  let pageQuery = '1';
  let genreQuery = '';
  let dateFromQuery = '';
  let dateToQuery = '';
  let ratingFromQuery = '';
  let ratingToQuery = '';
  let titleQuery = searchParams.get('title') ?? '';
  let plotQuery = searchParams.get('plot') ?? '';
  let castQuery = searchParams.get('cast') ?? '';

  const sortByAcceptedValues = ['Default', 'A-Z', 'Rating', 'Runtime', 'Year'];

  const genreAcceptedValues = [
    'Drama',
    'Comedy',
    'Music',
    'Action',
    'Romance',
    'Musical',
    'Crime',
    'Adventure',
    'Animation',
    'Short',
    'Mystery',
    'Documentary',
    'Sci-Fi',
    'History',
    'Fantasy',
    'Family',
    'War',
    'Sport',
    'News',
    'Thriller',
    'Film-Noir',
    'Biography',
    'Horror',
    'Talk-Show',
    'Western',
  ];

  // Check to see if there are any search params and if there are, check if all values are correct.
  if (searchParams.toString()) {
    // Sorting
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

    // Filters
    const genre = searchParams.get('genre');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const ratingFrom = searchParams.get('ratingFrom');
    const ratingTo = searchParams.get('ratingTo');

    // Validate genre param by creating an array and checking it against the accepted values
    genre?.split(',').forEach((gen, i) => {
      if (genreAcceptedValues.includes(gen)) {
        if (i === 0) {
          genreQuery = `${gen}`;
        } else {
          genreQuery = `${genreQuery},${gen}`;
        }
      }
    });

    // Validate Date

    let testDateFrom = isNaN(new Date(dateFrom).getTime()) ? null : dateFrom;
    let testDateTo = isNaN(new Date(dateTo).getTime()) ? null : dateTo;

    if (testDateFrom && testDateTo) {
      if (new Date(testDateFrom) > new Date(testDateTo)) {
        testDateFrom = null;
      }
    }

    dateFromQuery = testDateFrom ? dateFrom : '';
    dateToQuery = testDateTo ? dateTo : '';

    // Validate Ratings by checking if they are between 1 and 10 and if the "from" is smaller from "to".

    const checkRatingRange = (rating) => {
      if (rating) {
        const numRating = Number(rating);
        if (numRating >= 1 && numRating <= 10) {
          return Number(numRating.toFixed(1));
        }
      }
      return null;
    };
    let testRatingFrom = checkRatingRange(ratingFrom);
    let testRatingTo = checkRatingRange(ratingTo);

    // Both ratings exist and passed the validation but if the "from" is bigger than the "to" rating,
    // then disregard it.
    if (testRatingFrom && testRatingTo) {
      if (testRatingFrom > testRatingTo) {
        testRatingFrom = null;
      }
    }

    // If the tests passed and i have a value then convert the rating back to String.

    ratingFromQuery = testRatingFrom ? String(testRatingFrom) : '';
    ratingToQuery = testRatingTo ? String(testRatingTo) : '';
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

  const title = 'the lord of the rings';

  const endpointObject = useMemo(() => {
    const queryObj = {};

    // These 3 must be first!!!
    queryObj.sortBy = sortByQuery;
    queryObj.sort = sortQuery;
    queryObj.page = pageQuery;

    if (titleQuery) {
      queryObj.title = titleQuery;
    }

    if (genreQuery) {
      queryObj.genre = genreQuery;
    }
    if (dateFromQuery) {
      queryObj.dateFrom = dateFromQuery;
    }

    if (dateToQuery) {
      queryObj.dateTo = dateToQuery;
    }

    if (ratingFromQuery) {
      queryObj.ratingFrom = ratingFromQuery;
    }

    if (ratingToQuery) {
      queryObj.ratingTo = ratingToQuery;
    }

    if (castQuery) {
      queryObj.cast = castQuery;
    }

    if (plotQuery) {
      queryObj.plot = plotQuery;
    }

    let endpointString = '';
    for (const [key, val] of Object.entries(queryObj)) {
      if (!endpointString) {
        endpointString = `${key}=${val}`;
      } else {
        endpointString = `${endpointString}&${key}=${val}`;
      }
    }

    return { endpointString };
  }, [
    titleQuery,
    sortByQuery,
    sortQuery,
    pageQuery,
    genreQuery,
    dateFromQuery,
    dateToQuery,
    ratingFromQuery,
    ratingToQuery,
    castQuery,
    plotQuery,
  ]);

  const { currentData } = useGetFilteredMoviesQuery(endpointObject);

  // Display option
  const view = useSelector((state) => state.moviesToolbar.view);

  ///////// Page Load //////////
  if (
    initial &&
    currentData?.docs?.length &&
    !trackMovies.current?.docs?.length
  ) {
    setTrackMovies((s) => ({
      ...s,
      previous: currentData,
      current: currentData,
      previousTitle: title,
      currentTitle: title,
    }));
    // setNavigationIndexes();
    setIsProgressBarLoading(true);
    setProgressBarSize(currentData?.docs.length);
  }

  // Keeps in sync the URL (and coerces it to valid values) with what appears on the screen on page load
  useEffect(() => {
    // When a user changes the URL manually all query values are checked and coerced to valid ones (above).
    // If he then presses Enter this causes a full page load so I only need to check if the values are different from the expected ones
    // only one time and that is the first time the component runs (this is the reason for disabling the linter).
    // After that I coerce the URL to the valid one so it is in sync with what appears on screen.
    // The useEffect hook is used because setSearchParams cannot be used in conjunction with the setters of the component during rendering.
    // (throws Error of multiple components rendering together, RouterProvider + MoviesList)

    // if there are + in the url convert to space
    const decodeQueryParams = (params) => {
      return decodeURIComponent(params.replace(/\+/g, ' '));
    };

    if (
      endpointObject.endpointString !==
      decodeQueryParams(searchParams.toString())
    ) {
      setSearchParams(endpointObject.endpointString, { replace: true });
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
    if (currentData?.docs) {
      // The Set has the values from the last render
      const set = counterRef.current;
      const currMovies = currentData?.docs;
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
      if (currentData?.docs.length) {
        setProgressBarSize(currMovies.length);
        setIsProgressBarLoading(true);
      } else {
        setShow(true);
        setIsProgressBarLoading(false);
        setInitial(false);
      }
    }
  }, [currentData]);

  const paramsWithNewPageValue = (pageVal) => {
    const paramsObj = {};
    searchParams.forEach((val, key) => (paramsObj[key] = val));
    paramsObj.page = pageVal;
    const url = new URLSearchParams(paramsObj);
    return url.toString();
  };

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
          to={`${location.pathname}?${paramsWithNewPageValue(val)}`}
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
    const currMovies = currentData?.docs;
    if (counterRef.current.size === currMovies.length) {
      setShow(true);
      setInitial(false);
      setIsProgressBarLoading(false);
    }
  }, [currentData]);

  let content;
  let currentPage;
  let totalResults;
  let movies;
  let pageCount;
  if (!initial) {
    content = show ? trackMovies.current : trackMovies.previous; // Manages what movies are shown based on the result of the loadedImages
    currentPage = show ? trackPage.current : trackPage.previous; // Same for the page transitions
    totalResults = content?.count ?? 0;
    movies = content?.docs;
    pageCount = Math.ceil(totalResults / 20);
  }

  const renderFilterButtons = () => {
    if (
      titleQuery ||
      genreQuery ||
      dateFromQuery ||
      dateToQuery ||
      ratingFromQuery ||
      ratingToQuery ||
      plotQuery ||
      castQuery
    ) {
      return true;
    } else {
      return false;
    }
  };

  const createSelectedFilterButtons = () => {
    const title = titleQuery;
    const genreArr = genreQuery ? genreQuery.split(',') : [];
    const dateFrom = dateFromQuery;
    const dateTo = dateToQuery;
    const ratingFrom = ratingFromQuery;
    const ratingTo = ratingToQuery;
    const plot = plotQuery;
    const cast = castQuery;

    const textArr = [];
    const valArr = [];
    const dataTypeArr = [];

    if (title) {
      textArr.push('Title name: ');
      valArr.push(`"${title}"`);
      dataTypeArr.push('title');
    }

    if (genreArr?.length) {
      genreArr.forEach((genre) => {
        textArr.push('');
        valArr.push(genre);
        dataTypeArr.push('genre');
      });
    }

    const intl = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    if (dateFrom || dateTo) {
      textArr.push('Release Date: ');
      dataTypeArr.push('date');
      if (dateFrom && dateTo) {
        valArr.push(
          `${intl.format(new Date(dateFrom))} to ${intl.format(
            new Date(dateTo)
          )}`
        );
      } else if (dateFrom) {
        valArr.push(`after ${intl.format(new Date(dateFrom))}`);
      } else if (dateTo) {
        valArr.push(`before ${intl.format(new Date(dateTo))}`);
      }
    }

    if (ratingFrom || ratingTo) {
      textArr.push('Rating: ');
      dataTypeArr.push('rating');
      if (ratingFrom && ratingTo) {
        valArr.push(`${ratingFrom} to ${ratingTo}`);
      } else if (ratingFrom) {
        valArr.push(`${ratingFrom} or above`);
      } else if (ratingTo) {
        valArr.push(` ${dateTo} or bellow`);
      }
    }

    if (plot) {
      textArr.push('Plot: ');
      valArr.push(plot);
      dataTypeArr.push('plot');
    }

    if (cast) {
      textArr.push('Cast: ');
      valArr.push(cast);
      dataTypeArr.push('cast');
    }

    return textArr.map((text, i) => (
      <li key={i} className='adv-movies__filter-list-item'>
        <button
          className='adv-movies__filter-list-button'
          data-type={dataTypeArr[i]}
          onClick={handleSelectedFilterButtonClick}>
          <span>
            <span>{text}</span>
            <span>{valArr[i]}</span>
          </span>
          <Icons
            name='close'
            width='22'
            height='22'
            svgClassName='adv-movies__filter-list-icon'
          />
        </button>
      </li>
    ));
  };

  const handleSelectedFilterButtonClick = (e) => {
    const paramObj = {};
    searchParams.forEach((val, key) => (paramObj[key] = val));

    switch (e.currentTarget.dataset.type) {
      case 'title':
        delete paramObj.title;
        break;
      case 'genre': {
        // Create an array from param genre (comma seperated string), then filter it based on the text of the button
        // and convert it back to string or remove it if empty.
        paramObj.genre = paramObj.genre
          .split(',')
          .filter((gen) => gen !== e.currentTarget.textContent)
          .join(',');
        if (!paramObj.genre) {
          delete paramObj.genre;
        }
        break;
      }
      case 'date':
        delete paramObj.dateFrom;
        delete paramObj.dateTo;
        break;
      case 'rating':
        delete paramObj.ratingFrom;
        delete paramObj.ratingTo;
        break;
      case 'plot':
        delete paramObj.plot;
        break;
      case 'cast':
        delete paramObj.cast;
        break;
      default:
    }
    setSearchParams(paramObj);
  };

  const computedNavigationPages = (
    <>{calculateNavigationIndexes(pageCount, currentPage)}</>
  );

  console.log(trackMovies);

  return (
    <section
      aria-labelledby='adv-movies-search-title'
      aria-describedby='progress-bar'
      aria-busy={!show}
      id='adv-movies-list-section'
      className={`adv-movies__section`}>
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

      <hgroup>
        <h2 className='adv-movies__heading' id='adv-movies-search-title'>
          Titles found
        </h2>

        <output
          form='adv-search-form'
          htmlFor='autocomplete-input'
          name='adv-movies-output'
          className='adv-movies__count'>
          <span className='visually-hidden'>
            {/* Changing between loading and the results, in every user action is important! Because if just the sort order changes
             the total number remains the same and if the contents are the same there is no announcing. */}
            {isProgressBarLoading ? (
              'Loading'
            ) : (
              <>{totalResults} total results</>
            )}
          </span>
          <span aria-hidden='true'>{totalResults} total results</span>
        </output>
      </hgroup>

      {renderFilterButtons() && (
        <>
          <p
            id='adv-movies-filter-list-description'
            className='visually-hidden'
            aria-hidden='true'>
            Click on any button in the list to remove the filter
          </p>

          <ul
            className='adv-movies__filter-list'
            aria-label='Applied filters'
            aria-describedby='adv-movies-filter-list-description'>
            {createSelectedFilterButtons()}
          </ul>
        </>
      )}

      {movies?.length ? (
        <>
          <div className='adv-movies__merger'>
            <AdvMoviesListToolbar
              totalResults={totalResults}
              newMoviesLoaded={show}
              currentPage={currentPage}
            />
            <ul
              className={
                view === 'list' ? 'adv-movies__list' : 'adv-movies__grid'
              }>
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
          <nav className='adv-movies__navigation' aria-label='pagination'>
            <ul
              className='adv-movies__navigation-list'
              data-display={view === 'grid' ? 'grid' : 'list'}>
              <li className='adv-movies__navigation-item adv-movies__navigation-item--prev'>
                <Link
                  className='adv-movies__navigation-link'
                  to={`${location.pathname}?${paramsWithNewPageValue(
                    currentPage - 1
                  )}`}
                  aria-disabled={currentPage === 1 ? 'true' : 'false'}
                  onClick={(e) => {
                    if (currentPage === 1) e.preventDefault();
                  }}>
                  Prev
                </Link>
              </li>
              {computedNavigationPages}
              <li className='adv-movies__navigation-item adv-movies__navigation-item--next'>
                <Link
                  className='adv-movies__navigation-link'
                  to={`${location.pathname}?${paramsWithNewPageValue(
                    currentPage + 1
                  )}`}
                  aria-disabled={currentPage === pageCount ? 'true' : 'false'}
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
          Sorry! No results were found for your specific search, try something
          else.
        </p>
      )}

      {/* the key is important because in the case when only the sort order changes for example, the same images appear so
      the imagesReady function does not run and everything breaks. Workaround: in every new location based on the URL the images re-render
      and they get pulled from the cache so the function runs and everything that depends on it(everything...) get's updated. */}
      <div key={location.key}>
        {currentData?.docs?.map((movie) => (
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
    </section>
  );
};

export default AdvMoviesList;

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
      className='adv-movies--hide'
      alt=''
      src={src}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});
