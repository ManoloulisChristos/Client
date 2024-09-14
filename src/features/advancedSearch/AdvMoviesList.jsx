import {
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
  useEffect,
} from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetFilteredMoviesQuery } from './advSearchApiSlice';
import Card from '../movies/Card';
import ProgressBar from '../../components/ProgressBar';
import AdvMoviesListToolbar from './AdvMoviesListToolbar';
import MovieDetailsModal from '../movies/MovieDetailsModal';
import RatingModal from '../movies/RatingModal';
import Icons from '../../components/Icons';
import '../../styles/AdvMoviesList.scss';
import searchIconLight from '../../assets/SVG/empty-search-light.svg';
import searchIconDark from '../../assets/SVG/empty-search-dark.svg';
import searchNotFoundIcon from '../../assets/SVG/search-not-found.svg';
import HelmetWrapper from '../../components/HelmetWrapper';

const AdvMoviesList = ({ setFilterBuckets }) => {
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

  const [emptySearchIcon, setEmptySearchIcon] = useState('light');
  const initialSearchIconSetter = useRef(true);

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

      setFilterBuckets(currentData);

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
  }, [currentData, setFilterBuckets]);

  useLayoutEffect(() => {
    if (initialSearchIconSetter) {
      setEmptySearchIcon(
        document.firstElementChild.getAttribute('color-scheme')
      );

      initialSearchIconSetter.current = false;
    }

    const observerCallback = (mutationsList) => {
      const colorScheme = mutationsList[0].target.getAttribute('color-scheme');
      setEmptySearchIcon(colorScheme);
    };

    const observer = new MutationObserver(observerCallback);
    const observerTarget = document.firstElementChild;
    const config = {
      attributes: true,
      attributeFilter: ['color-scheme'],
    };
    observer.observe(observerTarget, config);

    return () => observer.disconnect();
  }, []);

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
  return (
    <section
      aria-labelledby='adv-movies-search-title'
      aria-describedby='progress-bar'
      aria-busy={!show}
      id='adv-movies-list-section'
      className={`adv-movies__section`}>
      <HelmetWrapper
        title='Advanced Search'
        description='Search for movies with an extensive list of filter options'
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

      {!renderFilterButtons() ? (
        <hgroup>
          <h2 className='adv-movies__heading' id='adv-movies-search-title'>
            Titles found
          </h2>
          <p className='adv-movies__initial-text'>Nothing searched yet</p>
          <svg
            className='adv-movies__search-icon'
            xmlns='http://www.w3.org/2000/svg'
            x='0'
            y='0'
            enableBackground='new 0 0 500 500'
            viewBox='0 0 500 500'>
            <g id='OBJECTS'>
              <path
                fill='#3F3A36'
                d='M120.06 113.298c-13.38 8.898-23.93 20.456-31.428 33.502 6.366-9.299 14.595-17.582 24.586-24.227 41.01-27.273 95.955-16.757 122.719 23.487 26.763 40.247 15.216 94.982-25.796 122.255-40.979 27.251-95.866 16.771-122.653-23.398a101.434 101.434 0 004.568 7.576c30.705 46.172 93.027 58.71 139.198 28.004 46.171-30.705 58.71-93.027 28.004-139.198-30.704-46.169-93.028-58.706-139.198-28.001z'></path>
              <path
                fill='#544C47'
                d='M188.287 97.295c64.732 16.068 103.401 76.586 78.236 134.668-14.393 33.065-31.852 47.076-69.654 63.095 11.938-2.575 23.602-7.388 34.385-14.56 46.171-30.705 58.71-93.027 28.004-139.198-16.799-25.261-43.065-40.454-70.971-44.005z'></path>
              <path
                fill='#68615D'
                d='M148.676 291.473c16.259-.001 33.116-2.853 49.699-6.87-34.153 6.887-70.323-6.547-90.493-36.875-26.766-40.245-15.214-94.981 25.795-122.254 17.528-11.656 37.597-16.395 56.925-14.869-8.042-4.943-16.094-9.946-24.511-14.093-18.452.361-37.02 5.8-53.527 16.777-46.17 30.705-58.709 93.028-28.004 139.198 13.872 20.861 34.198 34.853 56.574 41.096 2.15-1.326 4.656-2.11 7.542-2.11z'></path>
              <path
                fill='#B5DBEA'
                d='M233.467 147.704c25.875 38.909 14.709 91.823-24.938 118.191-39.646 26.366-92.762 16.198-118.637-22.708-25.875-38.908-14.709-91.823 24.937-118.189 39.647-26.368 92.764-16.201 118.638 22.706z'
                opacity='0.5'></path>
              <path
                fill='#68615D'
                d='M112.565 113.289c-46.17 30.705-58.709 93.028-28.004 139.198 13.872 20.861 34.198 34.853 56.574 41.096 2.149-1.326 4.656-2.11 7.542-2.11 16.259-.001 33.116-2.853 49.699-6.87-18.16 3.662-36.89 1.577-53.481-5.736-32.929-7.233-61.284-38.862-62.855-72.638-1.436-19.255 2.378-38.212 13.19-54.246 20.217-27.733 50.5-43.688 83.193-48.762-4.049-2.372-8.145-4.646-12.33-6.708-18.453.36-37.022 5.799-53.528 16.776z'
                opacity='0.3'></path>
              <radialGradient
                id='SVGID_1_'
                cx='202.947'
                cy='151.574'
                r='111.201'
                fx='203.135'
                fy='151.535'
                gradientTransform='matrix(-.8191 .5738 -.9579 -1.3675 474.46 279.638)'
                gradientUnits='userSpaceOnUse'>
                <stop offset='0.145' stopColor='#FFF'></stop>
                <stop offset='1' stopColor='#5982BD' stopOpacity='0'></stop>
              </radialGradient>
              <path
                fill='url(#SVGID_1_)'
                d='M137.857 114.106a87.676 87.676 0 00-23.028 10.891c-39.646 26.366-50.812 79.281-24.937 118.189 25.875 38.907 78.991 49.075 118.637 22.708a87.55 87.55 0 0020.663-19.187c-45.455-32.347-81.121-77.017-91.335-132.601z'
                opacity='0.5'></path>
              <path
                fill='#908F93'
                d='M211.597 270.505c-42.153 28.032-98.838 17.168-126.364-24.222-27.524-41.388-15.625-97.866 26.529-125.898 42.152-28.033 98.838-17.167 126.364 24.221 27.524 41.388 15.624 97.865-26.529 125.899zm-96.923-145.741c-39.737 26.426-50.98 79.633-25.061 118.608 25.918 38.972 79.334 49.181 119.072 22.753 39.738-26.426 50.981-79.633 25.062-118.606-25.919-38.975-79.336-49.183-119.073-22.755z'></path>
              <path
                fill='#AEADB3'
                d='M217.425 279.27c-46.221 30.741-108.833 18.146-139.573-28.075-30.739-46.225-18.142-108.838 28.079-139.576 46.224-30.74 108.836-18.144 139.576 28.079 30.738 46.221 18.142 108.834-28.082 139.572zM111.757 120.377c-41.392 27.527-52.673 83.599-25.146 124.991 27.528 41.392 83.599 52.673 124.992 25.146 41.393-27.529 52.673-83.599 25.145-124.991-27.528-41.395-83.598-52.673-124.991-25.146z'></path>
              <g fill='#F2F2F4' opacity='0.4'>
                <path d='M175.442 106.396c24.161 3.744 46.733 17.211 61.305 39.126 27.528 41.392 16.248 97.462-25.145 124.991-21.829 14.517-47.737 18.23-71.391 12.435 38.526 11.668 80.492-1.797 101.064-38.616 15.493-27.989 22.24-61.529 6.231-91.303-14.404-26.13-42.847-45.254-72.064-46.633z'></path>
                <path d='M65.118 207.375c-4.62-41.137 22.557-81.947 58.461-102.034a151.457 151.457 0 0118.237-8.581 100.181 100.181 0 00-35.885 14.859C59.71 142.357 47.113 204.97 77.852 251.194c18.533 27.865 48.651 43.502 79.776 44.797-45.479-8.061-88.054-41.552-92.51-88.616z'></path>
              </g>
              <path
                fill='#F2F2F4'
                d='M128.472 163.032c4.665 7.015 2.76 16.481-4.254 21.145-7.013 4.665-16.48 2.76-21.145-4.253-4.665-7.014-2.761-16.48 4.253-21.145 7.015-4.664 16.482-2.76 21.146 4.253z'
                opacity='0.5'></path>
              <path
                fill='#FFF'
                d='M188.707 174.414c4.061-2.185 8.012-4.548 11.89-7.032-5.757-10.251-12.743-19.666-21.242-27.6-3.907 2.906-7.866 5.779-11.88 8.544 3.709 3.545 7.141 7.528 10.036 11.047a189.665 189.665 0 0111.196 15.041zM194.139 183.109c6.719 11.526 11.585 23.19 14.529 34.908a260.95 260.95 0 013.964-1.752c1.004-.426 1.984-.852 2.936-1.282.915-.41 1.835-.826 2.753-1.241-3.181-12.709-7.421-25.484-13.105-37.433a199.17 199.17 0 01-11.077 6.8zM208.222 162.301c4.287-2.958 8.512-6.019 12.719-9.103a146.513 146.513 0 00-6.937-8.432l-2.222-2.526c-4.909-5.578-9.626-10.941-14.834-15.791-2.032 1.542-4.05 3.086-6.055 4.608-1.079.821-2.171 1.652-3.259 2.478 8.179 8.482 14.961 18.256 20.588 28.766zM212.662 171.249c5.749 12.51 10.055 25.795 13.275 39.022 2.043-.938 4.077-1.876 6.08-2.805 2.359-1.089 4.758-2.191 7.166-3.301-1.604-11.034-3.409-22.352-7.706-33.034-1.303-3.244-2.96-6.508-5.005-9.867-4.579 3.367-9.163 6.729-13.81 9.985z'
                opacity='0.3'></path>
              <g>
                <path
                  fill='#9C9CA0'
                  d='M410.818 284.003L414.406 291.301 427.046 292.578 436.509 266.918 437.395 254.959 432.173 249.076 423.034 249.981 415.601 266.507z'></path>
                <g id='XMLID_2_'>
                  <path
                    fill='#A6A5AA'
                    d='M439.013 287.147c9.627 1.177 13.137-8.737 10.811-16.032-1.987-8.553-10.655-12.649-18.669-13.659-.405 4.03-1.168 7.905-2.35 12 5.922 4.639 2.565 15.416 10.208 17.691z'></path>
                  <path
                    fill='#908F93'
                    d='M443.395 252.994c-1.719-.776-3.529-1.317-5.434-1.881-1.54-.456-3.129-.927-4.665-1.544a16.845 16.845 0 01-1.124-.493c-1.216-.556-2.592-1.182-3.686-1.06-.813.087-1.185.497-1.702 1.066-.166.189-.35.385-.557.587l4.84 1.316.409 1.508a71.244 71.244 0 01-.322 4.963c8.014 1.01 16.682 5.106 18.669 13.659 2.325 7.295-1.185 17.209-10.811 16.032-7.643-2.275-4.285-13.053-10.207-17.691-.164.563-.326 1.123-.503 1.698-2.146 6.846-4.826 12.329-8.194 18.471l-.155.166-1.544 1.116-.25-.072-4.398-1.408c.214 2.145 1.194 3.122 3.616 3.936 1.217.404 2.411.834 3.599 1.269 1.896.686 3.852 1.406 5.808 1.975 6.694 1.952 12.28 2.242 17.9-2.695 3.544-3.127 7.789-7.454 9.143-13.282 1.942-5.685 1.52-8.031.49-13.7l-.285-1.604c-.98-5.503-4.454-9.547-10.637-12.332z'></path>
                  <path
                    fill='#A6A5AA'
                    d='M428.642 265.971c-1.421-1.738-3.31-3.071-5.767-3.49-.48 2.441-1.107 4.832-1.781 7.153.917-.149 1.795-.145 2.477-.007 1.221.699 2.535 2.236 2.778 4.04a75.991 75.991 0 002.293-7.696z'></path>
                  <path
                    fill='#908F93'
                    d='M423.57 269.627c-.682-.139-1.56-.143-2.477.007a149.65 149.65 0 01-2.772 8.51c-.209.594-.459 1.174-.7 1.757.225.272.463.529.686.806-.224-.276-.462-.534-.686-.806a107.445 107.445 0 01-1.545 3.529c-.45.977-.906 1.963-1.321 2.949a6.07 6.07 0 00-.208.505c-.197.484-.401 1.011-.676 1.471l4.353 1.399 1.021-.741c2.833-5.17 5.174-9.884 7.104-15.346-.244-1.804-1.558-3.341-2.779-4.04zM424.33 250.237c-.055.58-.044 1.166-.032 1.791.013.686.022 1.384-.051 2.092-.225 2.088-.596 4.2-.978 6.269 1.368.551 2.737 1.088 4.103 1.658-1.366-.57-2.735-1.107-4.103-1.658l-.236 1.271-.059.344c-.033.158-.069.318-.1.478 2.457.419 4.346 1.752 5.767 3.49 1.07-4.444 1.637-8.741 1.787-13.423l-.201-.701-5.897-1.611z'></path>
                  <path
                    fill='#32353A'
                    d='M295.303 250.458l115.778 37.011a162.827 162.827 0 004.247-10.165c-28.565-31.564-76.049-34.109-115.731-46.103-1.668 6.359-3.163 12.817-4.294 19.257z'></path>
                  <path
                    fill='#4B4F56'
                    d='M301.355 224.746a400.45 400.45 0 00-1.759 6.456c39.683 11.993 87.166 14.539 115.731 46.103 2.23-5.919 4.017-11.869 5.298-17.959-38.979-15.393-79.349-23.882-119.27-34.6z'></path>
                  <path
                    fill='#32353A'
                    d='M422.208 249.663l-118.71-32.33a469.114 469.114 0 00-2.142 7.412c39.921 10.718 80.291 19.207 119.271 34.599a106.202 106.202 0 001.581-9.681z'></path>
                  <path
                    fill='#1E2123'
                    d='M422.208 249.663c-.378 3.28-.913 6.5-1.582 9.682-1.281 6.09-3.067 12.04-5.298 17.959a162.827 162.827 0 01-4.247 10.165l1.592.51c-.01-.034-.004-.061-.004-.1l.256.004c.254-.396.457-.909.644-1.387.077-.189.148-.364.213-.533a79.536 79.536 0 011.344-2.977 92.861 92.861 0 001.723-3.99c.159-.401.336-.8.481-1.203 1.675-4.699 3.533-10.279 4.603-15.983l.065-.344c.091-.489.184-.984.274-1.479.366-1.98.712-3.997.929-5.978.069-.64.056-1.287.047-1.964-.009-.676-.017-1.392.055-2.085l-1.095-.297zM298.476 223.976c.958.261 1.92.513 2.88.77a469.114 469.114 0 012.142-7.412l-5.034-1.371c-.002.091-.021.179-.038.265-.599 3.392-1.542 6.801-2.453 10.083-.529 1.92-1.078 3.888-1.551 5.818-.487 2.041-.934 4.16-1.363 6.212-.735 3.511-1.479 7.1-2.547 10.588l4.791 1.531c1.131-6.44 2.626-12.898 4.294-19.257-.57-.171-1.145-.339-1.712-.516.566.177 1.142.344 1.712.516a393.047 393.047 0 011.759-6.456c-.961-.258-1.922-.51-2.88-.771z'></path>
                  <path
                    fill='#908F93'
                    d='M413.713 288.308l-.878-.274c.032-.047.064-.094.09-.15M413.713 288.308l.158.047c-.052.099-.104.17-.15.251a1.928 1.928 0 01-.008-.298z'></path>
                  <path
                    fill='#908F93'
                    d='M412.669 287.879l.256.004c-.025.057-.058.103-.09.15l-.162-.055c-.01-.034-.004-.061-.004-.099zM412.661 288.249a1.812 1.812 0 01.012-.271M412.661 288.249c-.005.029-.001.052.005.061l-.033-.029c.009-.006.02-.025.028-.032zM264.638 235.679l16.655 4.934c.436-3.204.954-6.311 1.575-9.351-4.634-1.377-9.134-3.298-13.723-5.273-1.218 3.285-2.745 6.51-4.507 9.69zM286.274 218.705l-14.283-4.269a44.468 44.468 0 01-.639 3.932c4.557 1.528 8.984 3.282 13.446 4.977a88.93 88.93 0 011.476-4.64z'></path>
                  <path
                    fill='#6A696D'
                    d='M269.802 213.783c-.085 1.193-.276 2.502-.548 3.885-.465 2.354-1.165 4.924-2.001 7.505a108.952 108.952 0 01-3.86 10.134l1.245.372c1.763-3.179 3.289-6.405 4.508-9.69.928-2.503 1.682-5.037 2.207-7.621.266-1.3.489-2.609.639-3.932l-2.19-.653z'></path>
                  <path
                    fill='#A6A5AA'
                    d='M284.799 223.345c-4.462-1.696-8.89-3.449-13.446-4.977-.525 2.583-1.279 5.118-2.207 7.621 4.589 1.975 9.089 3.896 13.723 5.273a103.751 103.751 0 011.93-7.917z'></path>
                  <path
                    fill='#6A696D'
                    d='M286.274 218.705a89.268 89.268 0 00-1.476 4.641 104.229 104.229 0 00-1.931 7.917 142.982 142.982 0 00-1.575 9.351l1.056.314 2.91-9.007 2.42-7.486 1.564-4.843-2.968-.887z'></path>
                </g>
                <path
                  fill='#908F93'
                  d='M284.512 230.76c-4.721 15.77-1.688 18.261 5.863 19.656l4.556-17.892c-2.965-2.449-6.569-4.095-10.419-1.764z'></path>
                <path
                  fill='#A6A5AA'
                  d='M286.546 224.363a200.767 200.767 0 00-1.789 5.577c-.086.28-.162.548-.245.82 3.851-2.332 7.454-.685 10.419 1.764l1.608-6.315c-3.33-1.512-6.658-3.783-9.993-1.846z'></path>
                <path
                  fill='#908F93'
                  d='M286.546 224.363c3.335-1.937 6.663.334 9.993 1.846l2.87-11.274c-7.01-1.964-9.026-1.83-12.863 9.428z'></path>
                <path
                  fill='#211915'
                  d='M421.377 287.274c-.409.774-.833 1.559-1.269 2.351l-.155.166-1.544 1.116-.25-.072-4.398-1.408c.214 2.145 1.194 3.122 3.616 3.936 1.217.404 2.411.834 3.599 1.269 1.896.686 3.852 1.406 5.808 1.975 6.694 1.952 12.28 2.242 17.9-2.695 1.805-1.593 3.789-3.498 5.484-5.753-8.77 4.025-19.597 3.527-28.791-.885z'
                  opacity='0.2'></path>
                <path
                  fill='#211915'
                  d='M443.395 252.994c-1.719-.776-3.529-1.317-5.434-1.881-1.54-.456-3.129-.927-4.665-1.544a16.845 16.845 0 01-1.124-.493c-1.216-.556-2.592-1.182-3.686-1.06-.813.087-1.185.497-1.702 1.066-.166.189-.35.385-.557.587l4.84 1.316.409 1.508a67.593 67.593 0 01-.099 2.146c7.312 2.956 16.105 5.281 22.456 9.754-1.193-5.029-4.608-8.775-10.438-11.399z'
                  opacity='0.1'></path>
                <path
                  fill='#211915'
                  d='M416.076 283.43c-.45.977-.906 1.963-1.321 2.949a6.07 6.07 0 00-.208.505c-.197.484-.401 1.011-.676 1.471l4.353 1.399 1.021-.741a160.314 160.314 0 002.781-5.289c-1.8-.662-3.435-1.537-4.761-2.941-.386.895-.792 1.777-1.189 2.647z'
                  opacity='0.2'></path>
                <path
                  fill='#211915'
                  d='M430.227 251.847l-5.897-1.609c-.055.58-.044 1.166-.032 1.791.013.686.022 1.384-.051 2.092-.235 2.181-.631 4.391-1.03 6.548 2.009-.87 4.435-.051 6.255 1.311.54-3.075.853-6.16.957-9.432l-.202-.701z'
                  opacity='0.1'></path>
                <path
                  fill='#211915'
                  d='M291.213 249.112l121.167 38.586c-.009-.031 1.303-3.709 1.768-4.701.695-1.52 1.739-2.973 2.339-4.556-41.726-12.088-81.433-25.305-123.321-37.107-.56 2.601-1.167 5.217-1.953 7.778z'
                  opacity='0.3'></path>
                <path
                  fill='#211915'
                  d='M423.948 252.232c-.009-.679-.017-1.394.054-2.085l-124.836-33.999c-.004.091-.023.179-.041.265a46.745 46.745 0 01-.378 1.904c40.892 15.708 83.008 25.333 125.203 34.548.001-.209.001-.417-.002-.633zM274.009 215.038l-4.207-1.255a27.686 27.686 0 01-.285 2.39c-.76 4.839-2.734 10.87-4.853 16.112a111.6 111.6 0 01-1.272 3.022l3.877 1.15 15.079 4.469.883-2.726c-5.006-1.723-10.002-3.616-15.026-5.014 1.652-5.385 3.703-10.586 5.221-15.961 5.022 1.359 10.11 2.765 15.251 4.118l.565-1.753-15.233-4.552z'
                  opacity='0.1'></path>
                <path
                  fill='#211915'
                  d='M295.199 214.017c-1.865-.174-3.263.246-4.544 1.686-1.863 2.094-3.476 6.357-5.898 14.237-2.32 7.555-2.947 12.184-2.211 15.118.445 1.772 1.386 2.929 2.751 3.738 1.319.782 3.032 1.242 5.078 1.621l.735-2.89c-2.099-.03-4.143-.165-5.987-.888-.544-10.192 3.029-20.628 8.317-29.724 1.637.872 3.18 1.953 4.678 3.093l1.291-5.072c-1.653-.463-3.022-.806-4.21-.919z'
                  opacity='0.1'></path>
              </g>
              <g>
                <g opacity='0.3'>
                  <path
                    fill='#3F3A36'
                    d='M120.06 473.902c-13.38-8.353-23.93-19.201-31.428-31.446 6.366 8.729 14.595 16.504 24.586 22.739 41.01 25.599 95.955 15.728 122.719-22.046 26.763-37.777 15.216-89.153-25.796-114.751-40.979-25.58-95.866-15.742-122.653 21.961a94.37 94.37 0 014.568-7.111c30.705-43.339 93.027-55.106 139.198-26.286 46.171 28.82 58.71 87.319 28.004 130.655-30.704 43.338-93.028 55.105-139.198 26.285z'></path>
                  <path
                    fill='#544C47'
                    d='M188.287 488.924c64.732-15.083 103.401-71.886 78.236-126.404-14.393-31.035-31.852-44.185-69.654-59.223 11.938 2.417 23.602 6.935 34.385 13.665 46.171 28.82 58.71 87.319 28.004 130.655-16.799 23.713-43.065 37.974-70.971 41.307z'></path>
                  <path
                    fill='#68615D'
                    d='M148.676 306.663c16.259.001 33.116 2.677 49.699 6.447-34.153-6.464-70.323 6.145-90.493 34.613-26.766 37.774-15.214 89.151 25.795 114.751 17.528 10.939 37.597 15.388 56.925 13.957-8.042 4.639-16.094 9.334-24.511 13.227-18.452-.339-37.02-5.444-53.527-15.748-46.17-28.821-58.709-87.318-28.004-130.654 13.872-19.582 34.198-32.715 56.574-38.574 2.15 1.244 4.656 1.981 7.542 1.981z'></path>
                  <path
                    fill='#B5DBEA'
                    d='M114.829 462.922c-39.646-24.749-50.812-74.416-24.937-110.936 25.875-36.519 78.991-46.062 118.637-21.315 39.646 24.75 50.813 74.416 24.938 110.936-25.874 36.52-78.991 46.062-118.638 21.315z'
                    opacity='0.5'></path>
                  <path
                    fill='#68615D'
                    d='M112.565 473.91c-46.17-28.821-58.709-87.318-28.004-130.654 13.872-19.582 34.198-32.715 56.574-38.574 2.149 1.244 4.656 1.981 7.542 1.981 16.259.001 33.116 2.677 49.699 6.447-18.16-3.437-36.89-1.48-53.481 5.385-32.929 6.79-61.284 36.478-62.855 68.181-1.436 18.073 2.378 35.867 13.19 50.917 20.217 26.03 50.5 41.005 83.193 45.768-4.049 2.228-8.145 4.36-12.33 6.297-18.453-.339-37.022-5.444-53.528-15.748z'
                    opacity='0.3'></path>
                  <radialGradient
                    id='SVGID_00000088827042034036340760000012850366688132481716_'
                    cx='279.36'
                    cy='36.678'
                    r='111.201'
                    fx='279.548'
                    fy='36.64'
                    gradientTransform='matrix(-.8191 -.5385 -.9579 1.2836 426.986 506.398)'
                    gradientUnits='userSpaceOnUse'>
                    <stop offset='0.145' stopColor='#FFF'></stop>
                    <stop offset='1' stopColor='#5982BD' stopOpacity='0'></stop>
                  </radialGradient>
                  <path
                    fill='url(#SVGID_00000088827042034036340760000012850366688132481716_)'
                    d='M137.857 473.144a90.338 90.338 0 01-23.028-10.222c-39.646-24.749-50.812-74.416-24.937-110.936 25.875-36.519 78.991-46.062 118.637-21.315 8.112 5.065 15.009 11.185 20.663 18.009-45.455 30.362-81.121 72.291-91.335 124.464z'
                    opacity='0.5'></path>
                  <path
                    fill='#908F93'
                    d='M238.126 444.517c-27.525 38.848-84.211 49.047-126.364 22.733-42.154-26.313-54.054-79.324-26.529-118.171 27.525-38.85 84.211-49.048 126.364-22.735 42.153 26.312 54.053 79.324 26.529 118.173zm-4.379-2.735c25.919-36.581 14.676-86.523-25.062-111.328-39.738-24.806-93.154-15.224-119.072 21.357-25.919 36.583-14.676 86.523 25.061 111.327 39.737 24.807 93.154 15.227 119.073-21.356z'></path>
                  <path
                    fill='#AEADB3'
                    d='M245.507 449.124c-30.74 43.384-93.352 55.207-139.576 26.354-46.221-28.85-58.818-87.621-28.079-131.007 30.74-43.386 93.352-55.208 139.573-26.354 46.224 28.851 58.82 87.62 28.082 131.007zm-8.76-5.47c27.528-38.85 16.248-91.479-25.145-117.319-41.393-25.838-97.464-15.249-124.992 23.603-27.527 38.853-16.246 91.482 25.146 117.321 41.394 25.837 97.464 15.25 124.991-23.605z'></path>
                  <g fill='#F2F2F4' opacity='0.4'>
                    <path d='M175.442 480.38c24.161-3.515 46.733-16.155 61.305-36.726 27.528-38.85 16.248-91.479-25.145-117.319-21.829-13.625-47.737-17.111-71.391-11.672 38.526-10.953 80.492 1.686 101.064 36.246 15.493 26.27 22.24 57.753 6.231 85.699-14.404 24.529-42.847 42.478-72.064 43.772z'></path>
                    <path d='M65.118 385.6c-4.62 38.612 22.557 76.918 58.461 95.771a156.25 156.25 0 0018.237 8.054c-12.466-2.34-24.659-6.939-35.885-13.947-46.221-28.85-58.818-87.621-28.079-131.007 18.533-26.156 48.651-40.835 79.776-42.049-45.479 7.566-88.054 39.002-92.51 83.178z'></path>
                  </g>
                  <path
                    fill='#F2F2F4'
                    d='M128.472 427.22c4.665-6.584 2.76-15.469-4.254-19.848-7.013-4.378-16.48-2.59-21.145 3.994-4.665 6.583-2.761 15.469 4.253 19.846 7.015 4.379 16.482 2.591 21.146-3.992z'
                    opacity='0.5'></path>
                  <path
                    fill='#FFF'
                    d='M188.707 416.537c4.061 2.051 8.012 4.269 11.89 6.601-5.757 9.622-12.743 18.458-21.242 25.907-3.907-2.729-7.866-5.425-11.88-8.02 3.709-3.328 7.141-7.068 10.036-10.369a179.61 179.61 0 0011.196-14.119zM194.139 408.377c6.719-10.819 11.585-21.768 14.529-32.766 1.319.562 2.649 1.108 3.964 1.644 1.004.401 1.984.8 2.936 1.203.915.386 1.835.776 2.753 1.166-3.181 11.929-7.421 23.919-13.105 35.135a200.745 200.745 0 00-11.077-6.382zM208.222 427.906c4.287 2.776 8.512 5.648 12.719 8.545a139.462 139.462 0 01-6.937 7.913l-2.222 2.372c-4.909 5.234-9.626 10.27-14.834 14.821-2.032-1.447-4.05-2.896-6.055-4.326-1.079-.771-2.171-1.55-3.259-2.325 8.179-7.961 14.961-17.134 20.588-27zM212.662 419.508c5.749-11.742 10.055-24.212 13.275-36.627a2177.7 2177.7 0 016.08 2.633c2.359 1.022 4.758 2.057 7.166 3.1-1.604 10.355-3.409 20.978-7.706 31.004-1.303 3.045-2.96 6.109-5.005 9.262-4.579-3.159-9.163-6.315-13.81-9.372z'
                    opacity='0.3'></path>
                  <g>
                    <path
                      fill='#9C9CA0'
                      d='M410.818 313.675L414.406 306.824 427.046 305.625 436.509 329.71 437.395 340.935 432.173 346.457 423.034 345.607 415.601 330.097z'></path>
                    <g id='XMLID_1_'>
                      <path
                        fill='#A6A5AA'
                        d='M439.013 310.723c9.627-1.104 13.137 8.201 10.811 15.048-1.987 8.028-10.655 11.873-18.669 12.821-.405-3.784-1.168-7.421-2.35-11.265 5.922-4.353 2.565-14.469 10.208-16.604z'></path>
                      <path
                        fill='#908F93'
                        d='M443.395 342.779c-1.719.729-3.529 1.236-5.434 1.767-1.54.427-3.129.868-4.665 1.448-.353.126-.722.287-1.124.463-1.216.521-2.592 1.11-3.686.996-.813-.083-1.185-.467-1.702-1.002-.166-.177-.35-.36-.557-.55l4.84-1.235.409-1.416a62.71 62.71 0 00-.322-4.658c8.014-.948 16.682-4.793 18.669-12.821 2.325-6.847-1.185-16.152-10.811-15.048-7.643 2.136-4.285 12.251-10.207 16.604-.164-.527-.326-1.053-.503-1.593-2.146-6.427-4.826-11.572-8.194-17.338l-.155-.155-1.544-1.049-.25.068-4.398 1.322c.214-2.014 1.194-2.93 3.616-3.693 1.217-.38 2.411-.783 3.599-1.191 1.896-.644 3.852-1.32 5.808-1.854 6.694-1.832 12.28-2.104 17.9 2.529 3.544 2.936 7.789 6.998 9.143 12.468 1.942 5.337 1.52 7.539.49 12.859l-.285 1.506c-.98 5.164-4.454 8.959-10.637 11.573z'></path>
                      <path
                        fill='#A6A5AA'
                        d='M428.642 330.6c-1.421 1.631-3.31 2.883-5.767 3.276-.48-2.292-1.107-4.535-1.781-6.716.917.141 1.795.138 2.477.008 1.221-.657 2.535-2.1 2.778-3.793a67.892 67.892 0 012.293 7.225z'></path>
                      <path
                        fill='#908F93'
                        d='M423.57 327.168c-.682.13-1.56.133-2.477-.008a134.72 134.72 0 00-2.772-7.986c-.209-.558-.459-1.103-.7-1.649.225-.254.463-.496.686-.756-.224.26-.462.502-.686.756a98.99 98.99 0 00-1.545-3.313c-.45-.917-.906-1.843-1.321-2.768a5.45 5.45 0 01-.208-.475c-.197-.453-.401-.948-.676-1.379l4.353-1.314 1.021.696c2.833 4.852 5.174 9.277 7.104 14.403-.244 1.693-1.558 3.136-2.779 3.793zM424.33 345.367c-.055-.545-.044-1.094-.032-1.683.013-.643.022-1.297-.051-1.962-.225-1.96-.596-3.941-.978-5.884 1.368-.517 2.737-1.021 4.103-1.557-1.366.536-2.735 1.04-4.103 1.557l-.236-1.192-.059-.323c-.033-.148-.069-.298-.1-.447 2.457-.394 4.346-1.646 5.767-3.276 1.07 4.171 1.637 8.204 1.787 12.599l-.201.658-5.897 1.51z'></path>
                      <path
                        fill='#32353A'
                        d='M295.303 345.16l115.778-34.739a147.853 147.853 0 014.247 9.541c-28.565 29.626-76.049 32.016-115.731 43.273-1.668-5.969-3.163-12.03-4.294-18.075z'></path>
                      <path
                        fill='#4B4F56'
                        d='M301.355 369.295c-.6-2.008-1.19-4.026-1.759-6.059 39.683-11.258 87.166-13.648 115.731-43.273 2.23 5.557 4.017 11.141 5.298 16.856-38.979 14.447-79.349 22.414-119.27 32.476z'></path>
                      <path
                        fill='#32353A'
                        d='M422.208 345.906l-118.71 30.346a425.135 425.135 0 01-2.142-6.957c39.921-10.061 80.291-18.029 119.271-32.477a94.192 94.192 0 011.581 9.088z'></path>
                      <path
                        fill='#1E2123'
                        d='M422.208 345.906a93.834 93.834 0 00-1.582-9.088c-1.281-5.716-3.067-11.3-5.298-16.856a147.853 147.853 0 00-4.247-9.541l1.592-.478c-.01.031-.004.058-.004.094l.256-.004c.254.371.457.854.644 1.302.077.177.148.342.213.5.422.939.877 1.864 1.344 2.795a83.997 83.997 0 011.723 3.745c.159.377.336.752.481 1.13 1.675 4.411 3.533 9.647 4.603 15.002l.065.322c.091.46.184.925.274 1.39.366 1.858.712 3.752.929 5.61.069.601.056 1.208.047 1.844-.009.634-.017 1.306.055 1.957l-1.095.276zM298.476 370.016c.958-.244 1.92-.48 2.88-.721.699 2.34 1.414 4.664 2.142 6.957l-5.034 1.287c-.002-.086-.021-.169-.038-.249-.599-3.184-1.542-6.384-2.453-9.464-.529-1.802-1.078-3.648-1.551-5.461a204.11 204.11 0 01-1.363-5.829c-.735-3.296-1.479-6.664-2.547-9.939l4.791-1.437c1.131 6.045 2.626 12.105 4.294 18.075-.57.161-1.145.317-1.712.483.566-.166 1.142-.322 1.712-.483a349.361 349.361 0 001.759 6.059c-.961.241-1.922.478-2.88.722z'></path>
                      <path
                        fill='#908F93'
                        d='M413.713 309.633l-.878.258c.032.045.064.088.09.142M413.713 309.633l.158-.043c-.052-.093-.104-.159-.15-.235-.01.085-.013.178-.008.278z'></path>
                      <path
                        fill='#908F93'
                        d='M412.669 310.036l.256-.004c-.025-.054-.058-.097-.09-.142l-.162.052c-.01.032-.004.058-.004.094zM412.661 309.689c-.003.08.001.164.012.254M412.661 309.689c-.005-.027-.001-.049.005-.057l-.033.027c.009.005.02.023.028.03zM264.638 359.032l16.655-4.632a126.35 126.35 0 001.575 8.777c-4.634 1.293-9.134 3.096-13.723 4.95-1.218-3.083-2.745-6.11-4.507-9.095zM286.274 374.965l-14.283 4.006a39.407 39.407 0 00-.639-3.69c4.557-1.435 8.984-3.079 13.446-4.672a80.247 80.247 0 001.476 4.356z'></path>
                      <path
                        fill='#6A696D'
                        d='M269.802 379.585c-.085-1.121-.276-2.349-.548-3.646-.465-2.21-1.165-4.622-2.001-7.045a98.208 98.208 0 00-3.86-9.512l1.245-.35c1.763 2.984 3.289 6.012 4.508 9.096.928 2.35 1.682 4.728 2.207 7.152.266 1.221.489 2.45.639 3.69l-2.19.615z'></path>
                      <path
                        fill='#A6A5AA'
                        d='M284.799 370.608c-4.462 1.593-8.89 3.237-13.446 4.672-.525-2.425-1.279-4.803-2.207-7.152 4.589-1.854 9.089-3.657 13.723-4.95a92.349 92.349 0 001.93 7.43z'></path>
                      <path
                        fill='#6A696D'
                        d='M286.274 374.965a79.955 79.955 0 01-1.476-4.356 92.798 92.798 0 01-1.931-7.431 126.563 126.563 0 01-1.575-8.777l1.056-.294 2.91 8.454 2.42 7.027 1.564 4.546-2.968.831z'></path>
                    </g>
                    <path
                      fill='#908F93'
                      d='M284.512 363.648c-4.721-14.802-1.688-17.14 5.863-18.449l4.556 16.794c-2.965 2.299-6.569 3.845-10.419 1.655z'></path>
                    <path
                      fill='#A6A5AA'
                      d='M286.546 369.653a180.377 180.377 0 01-1.789-5.234c-.086-.264-.162-.515-.245-.771 3.851 2.189 7.454.644 10.419-1.655l1.608 5.928c-3.33 1.419-6.658 3.55-9.993 1.732z'></path>
                    <path
                      fill='#908F93'
                      d='M286.546 369.653c3.335 1.817 6.663-.313 9.993-1.732l2.87 10.581c-7.01 1.844-9.026 1.72-12.863-8.849z'></path>
                    <path
                      fill='#211915'
                      d='M421.377 310.603c-.409-.727-.833-1.463-1.269-2.207l-.155-.155-1.544-1.049-.25.068-4.398 1.322c.214-2.014 1.194-2.93 3.616-3.693 1.217-.38 2.411-.783 3.599-1.191 1.896-.644 3.852-1.32 5.808-1.854 6.694-1.832 12.28-2.104 17.9 2.529 1.805 1.495 3.789 3.283 5.484 5.401-8.77-3.778-19.597-3.312-28.791.829z'
                      opacity='0.2'></path>
                    <path
                      fill='#211915'
                      d='M443.395 342.779c-1.719.729-3.529 1.236-5.434 1.767-1.54.427-3.129.868-4.665 1.448-.353.126-.722.287-1.124.463-1.216.521-2.592 1.11-3.686.996-.813-.083-1.185-.467-1.702-1.002-.166-.177-.35-.36-.557-.55l4.84-1.235.409-1.416a59.554 59.554 0 00-.099-2.014c7.312-2.775 16.105-4.958 22.456-9.155-1.193 4.718-4.608 8.234-10.438 10.698z'
                      opacity='0.1'></path>
                    <path
                      fill='#211915'
                      d='M416.076 314.212c-.45-.917-.906-1.843-1.321-2.768a5.45 5.45 0 01-.208-.475c-.197-.453-.401-.948-.676-1.379l4.353-1.314 1.021.696a146.39 146.39 0 012.781 4.965c-1.8.621-3.435 1.441-4.761 2.761-.386-.842-.792-1.669-1.189-2.486z'
                      opacity='0.2'></path>
                    <path
                      fill='#211915'
                      d='M430.227 343.856l-5.897 1.511c-.055-.545-.044-1.094-.032-1.683.013-.643.022-1.297-.051-1.962-.235-2.047-.631-4.122-1.03-6.146 2.009.816 4.435.048 6.255-1.231a58.39 58.39 0 01.957 8.853l-.202.658z'
                      opacity='0.1'></path>
                    <path
                      fill='#211915'
                      d='M291.213 346.424l121.167-36.22c-.009.031 1.303 3.481 1.768 4.413.695 1.427 1.739 2.79 2.339 4.277-41.726 11.346-81.433 23.751-123.321 34.83-.56-2.441-1.167-4.896-1.953-7.3z'
                      opacity='0.3'></path>
                    <path
                      fill='#211915'
                      d='M423.948 343.494c-.009.637-.017 1.309.054 1.958l-124.836 31.911c-.004-.084-.023-.168-.041-.248a41.499 41.499 0 00-.378-1.788c40.892-14.744 83.008-23.777 125.203-32.428.001.198.001.393-.002.595zM274.009 378.406l-4.207 1.179a24.477 24.477 0 00-.285-2.244c-.76-4.542-2.734-10.202-4.853-15.123-.423-.979-.847-1.931-1.272-2.836l3.877-1.08 15.079-4.195.883 2.559c-5.006 1.618-10.002 3.395-15.026 4.707 1.652 5.054 3.703 9.935 5.221 14.981 5.022-1.276 10.11-2.596 15.251-3.866l.565 1.646-15.233 4.272z'
                      opacity='0.1'></path>
                    <path
                      fill='#211915'
                      d='M295.199 379.364c-1.865.164-3.263-.23-4.544-1.582-1.863-1.966-3.476-5.968-5.898-13.363-2.32-7.092-2.947-11.436-2.211-14.19.445-1.663 1.386-2.749 2.751-3.509 1.319-.732 3.032-1.164 5.078-1.521l.735 2.714c-2.099.027-4.143.154-5.987.832-.544 9.567 3.029 19.363 8.317 27.899 1.637-.817 3.18-1.832 4.678-2.902l1.291 4.76c-1.653.436-3.022.757-4.21.862z'
                      opacity='0.1'></path>
                  </g>
                </g>
                <linearGradient
                  id='SVGID_00000067236403090047658810000007182814583544130750_'
                  x1='256.332'
                  x2='256.332'
                  y1='324.509'
                  y2='494.317'
                  gradientUnits='userSpaceOnUse'>
                  <stop
                    offset='0.044'
                    stopColor={
                      emptySearchIcon === 'light' ? '#f5f5f5' : '#1a1a1a'
                    }
                    stopOpacity='0'></stop>
                  <stop
                    offset='0.143'
                    stopColor={
                      emptySearchIcon === 'light' ? '#f5f5f5' : '#1a1a1a'
                    }
                    stopOpacity='0.143'></stop>
                  <stop
                    offset='0.737'
                    stopColor={
                      emptySearchIcon === 'light' ? '#f5f5f5' : '#1a1a1a'
                    }></stop>
                </linearGradient>
                <path
                  fill='url(#SVGID_00000067236403090047658810000007182814583544130750_)'
                  d='M12.663 324.509H500V494.318H12.663z'></path>
              </g>
            </g>
          </svg>
        </hgroup>
      ) : (
        <>
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
            <>
              <p>
                Sorry! No results were found for your specific search, try
                something else.
              </p>
              <img
                src={searchNotFoundIcon}
                alt='A magnifying glass with the globe behind it.'
                className='adv-movies__search-icon'
              />
            </>
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
          </div>{' '}
        </>
      )}
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
