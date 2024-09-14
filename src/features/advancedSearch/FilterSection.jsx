import { useMemo, useRef, useState } from 'react';
import '../../styles/FilterSection.scss';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';
import { useLocation, useSearchParams } from 'react-router-dom';

const allGenresStatic = [
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

const FilterSection = ({ dialogRef, hideFilters, filterBuckets }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Checks the URLSearchParams and asign defaults
  const sortBy = searchParams.get('sortBy');
  const sort = searchParams.get('sort');
  const page = searchParams.get('page');
  let genreQuery = '';
  let dateFromQuery = '';
  let dateToQuery = '';
  let ratingFromQuery = '';
  let ratingToQuery = '';
  let titleQuery = searchParams.get('title') ?? '';
  let plotQuery = searchParams.get('plot') ?? '';
  let castQuery = searchParams.get('cast') ?? '';

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

  // Check to see if there are any search params and if there are, check if all filter values are correct.
  if (searchParams.toString()) {
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

  // Text inputs
  const [title, setTitle] = useState(titleQuery);
  const [plot, setPlot] = useState(plotQuery);
  const [cast, setCast] = useState(castQuery);
  // Number inputs
  const [ratingFrom, setRatingFrom] = useState(ratingFromQuery);
  const [ratingTo, setRatingTo] = useState(ratingToQuery);
  // Date inputs
  const [dateFrom, setDateFrom] = useState(dateFromQuery);
  const [dateTo, setDateTo] = useState(dateToQuery);
  // Checkboxes
  const [checkedValues, setCheckedValues] = useState(genreQuery.split(','));

  const [trackLocation, setTrackLocation] = useState(location.key);

  // Errors

  const [ratingFromError, setRatingFromError] = useState('');
  const [ratingToError, setRatingToError] = useState('');
  const [dateFromError, setDateFromError] = useState('');

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);

  const memoGenre = useMemo(() => [...genreQuery.split(',')], [genreQuery]);

  if (location.key !== trackLocation) {
    setTitle(titleQuery);
    setCheckedValues(memoGenre);
    setDateFrom(dateFromQuery);
    setDateTo(dateToQuery);
    setRatingFrom(ratingFromQuery);
    setRatingTo(ratingToQuery);
    setPlot(plotQuery);
    setCast(castQuery);
    setTrackLocation(location.key);
  }

  // Takes the current time and formats it into yyyy-mm-dd, which is a viable option for the max attribute.
  const formatMaxDate = () => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const now = new Date();

    return new Intl.DateTimeFormat('en-CA', options).format(now);
  };

  const findAndFormatNumber = (item) => {
    let amount = null;
    filterBuckets?.buckets?.forEach((bucket) => {
      if (bucket._id === item) {
        amount = bucket.count;
      }
    });
    if (amount) {
      return (
        <span className='adv-filter__genre-count'>
          {' '}
          (
          {new Intl.NumberFormat('en-GB', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(amount)}
          ){' '}
        </span>
      );
    } else {
      return null;
    }
  };

  const handleCloseButtonClick = () => {
    dialogRef.current.close();
    dialogRef.current.setAttribute('inert', '');
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((item) => item !== value));
    }
  };

  const handleInvalidNumberInput = (e) => {
    const input = e.target;
    let setState;
    if (input.id.includes('from')) {
      setState = setRatingFromError;
    } else {
      setState = setRatingToError;
    }

    if (input.validity.rangeUnderflow) {
      setState('Value must be greater than or equal to 1.');
    } else if (input.validity.rangeOverflow) {
      setState('Value must be less than or equal to 10.');
    } else if (input.validity.stepMismatch) {
      setState('Only values with one decimal place are allowed (e.g. 0.1).');
    }
  };

  const handleResetClick = () => {
    setTitle('');
    setPlot('');
    setCast('');
    setCheckedValues([]);
    setDateFrom('');
    setDateTo('');
    setRatingFrom('');
    setRatingTo('');
    setDateFromError('');
    setRatingFromError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRatingFromError('');
    setRatingToError('');
    setDateFromError('');
    if (e.target.checkValidity()) {
      if (dateFrom && dateTo) {
        if (dateFromRef.current.valueAsDate > dateToRef.current.valueAsDate) {
          setDateFromError(
            'The "From" date must precede or match the "To" date.'
          );
          return;
        }
      }

      if (ratingFrom && ratingTo) {
        if (ratingFrom > ratingTo) {
          setRatingFromError(
            'The "From" rating should not be greater than the "To" rating.'
          );
          return;
        }
      }

      // Take the form data and pass them to the URL search params
      const formData = new FormData(e.target);

      const filtersToParams = {};

      // Create a comma seperated list for the genre param
      const genre = formData.getAll('genre');

      if (genre?.length) {
        filtersToParams.genre = genre.join();
      }

      // Populate the filter object with the rest of the values
      for (const [key, val] of formData.entries()) {
        if (key !== 'genre' && val) {
          filtersToParams[key] = val;
        }
      }

      const sortBy = searchParams.get('sortBy');
      const sort = searchParams.get('sort');
      const page = searchParams.get('page');
      setSearchParams({
        sortBy,
        sort,
        page,
        ...filtersToParams,
      });

      // Close modal when it is rendered if all checks pass.
      if (hideFilters) {
        dialogRef.current.close();
        dialogRef.current.setAttribute('inert', '');
      }
    }
  };

  const populatedGenreInput = allGenresStatic.map((item) => (
    <div
      className='adv-filter__input-wrapper adv-filter__input-wrapper--genre'
      key={item}>
      <input
        id={`adv-filter-${item}-input`}
        className='adv-filter__input adv-filter__input--genre'
        type='checkbox'
        name='genre'
        value={item}
        checked={checkedValues.includes(item)}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor={`adv-filter-${item}-input`}
        className='adv-filter__label adv-filter__label--genre'>
        <span>{item}</span>
        <span>{findAndFormatNumber(item)}</span>
      </label>
    </div>
  ));

  return (
    <section
      className='adv-filter'
      aria-labelledby='adv-filter-filters-heading'>
      <header className='adv-filter__header'>
        <h2 id='adv-filter-filters-heading' className='adv-filter__heading'>
          Filter options
        </h2>
        {hideFilters ? (
          <Tooltip
            text='Close'
            tip='bottom'
            hasWrapper={true}
            id='adv-filter-close-button-tooltip'>
            <button
              type='button'
              className='adv-filter__close-button has-tooltip-with-wrapper'
              aria-labelledby='adv-filter-close-button-tooltip'
              aria-controls='adv-search-dialog'
              aria-expanded='true'
              onClick={handleCloseButtonClick}>
              <Icons name='close'></Icons>
            </button>
          </Tooltip>
        ) : null}
      </header>
      <form
        className='adv-filter__form'
        id='adv-filter-form'
        onSubmit={handleSubmit}
        noValidate>
        <div className='adv-filter__input-wrapper adv-filter__input-wrapper--text'>
          <label
            htmlFor='adv-filter-title-input'
            className='adv-filter__label adv-filter__label--text'>
            Title name
          </label>
          <input
            id='adv-filter-title-input'
            className='adv-filter__input adv-filter__input--text'
            type='text'
            placeholder='e.g. Batman'
            autoCorrect='off'
            spellCheck='false'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <fieldset className='adv-filter__fieldset adv-filter__fieldset--genre'>
          <legend className='adv-filter__legend adv-filter__legend--genre'>
            Genres
          </legend>
          {populatedGenreInput}
        </fieldset>

        <fieldset className='adv-filter__fieldset adv-filter__fieldset--date'>
          <legend className='adv-filter__legend adv-filter__legend--date'>
            Release date
          </legend>
          <div className='adv-filter__input-wrapper adv-filter__input-wrapper--date'>
            <label
              htmlFor='adv-filter-date-from-input'
              className='adv-filter__label adv-filter__label--date'>
              From
            </label>
            <input
              ref={dateFromRef}
              id='adv-filter-date-from-input'
              className='adv-filter__input adv-filter__input--date'
              type='date'
              name='dateFrom'
              aria-invalid={dateFromError ? true : false}
              aria-describedby='adv-filter-date-from-error'
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <p
              id='adv-filter-date-from-error'
              className='adv-filter__error'
              aria-live='assertive'>
              {dateFromError}
            </p>
          </div>
          <div className='adv-filter__input-wrapper adv-filter__input-wrapper--date'>
            <label
              htmlFor='adv-filter-date-to-input'
              className='adv-filter__label adv-filter__label--date'>
              To
            </label>
            <input
              ref={dateToRef}
              id='adv-filter-date-to-input'
              className='adv-filter__input adv-filter__input--date'
              type='date'
              name='dateTo'
              max={formatMaxDate()}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </fieldset>
        <fieldset className='adv-filter__fieldset adv-filter__fieldset--rating'>
          <legend className='adv-filter__legend adv-filter__legend--rating'>
            Rating
          </legend>
          <div className='adv-filter__input-wrapper adv-filter__input-wrapper--rating'>
            <label
              htmlFor='adv-filter-rating-from-input'
              className='adv-filter__label adv-filter__label--rating'>
              From
            </label>
            <input
              id='adv-filter-rating-from-input'
              className='adv-filter__input adv-filter__input--rating'
              type='number'
              placeholder='1'
              min='1'
              max='10'
              step='0.1'
              name='ratingFrom'
              aria-invalid={ratingFromError ? true : false}
              aria-describedby='adv-filter-rating-from-error'
              value={ratingFrom}
              onChange={(e) => setRatingFrom(e.target.value)}
              onInvalid={handleInvalidNumberInput}
            />
            <p
              id='adv-filter-rating-from-error'
              className='adv-filter__error'
              aria-live='assertive'>
              {ratingFromError}
            </p>
          </div>
          <div className='adv-filter__input-wrapper adv-filter__input-wrapper--rating'>
            <label
              htmlFor='adv-filter-rating-to-input'
              className='adv-filter__label adv-filter__label--rating'>
              To
            </label>
            <input
              id='adv-filter-rating-to-input'
              className='adv-filter__input adv-filter__input--rating'
              type='number'
              placeholder='10'
              min='1'
              max='10'
              step='0.1'
              name='ratingTo'
              aria-invalid={ratingToError ? true : false}
              aria-describedby='adv-filter-rating-to-error'
              value={ratingTo}
              onChange={(e) => setRatingTo(e.target.value)}
              onInvalid={handleInvalidNumberInput}
            />
            <p
              id='adv-filter-rating-to-error'
              className='adv-filter__error'
              aria-live='assertive'>
              {ratingToError}
            </p>
          </div>
        </fieldset>
        <div className='adv-filter__input-wrapper adv-filter__input-wrapper--text'>
          <label
            htmlFor='adv-filter-title-input'
            className='adv-filter__label adv-filter__label--text'>
            Plot
          </label>
          <input
            id='adv-filter-title-input'
            className='adv-filter__input adv-filter__input--text'
            type='text'
            placeholder='e.g. Zombie apocalypse'
            autoCorrect='off'
            spellCheck='false'
            name='plot'
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
          />
        </div>
        <div className='adv-filter__input-wrapper adv-filter__input-wrapper--text'>
          <label
            htmlFor='adv-filter-title-input'
            className='adv-filter__label adv-filter__label--text'>
            Cast
          </label>
          <input
            id='adv-filter-title-input'
            className='adv-filter__input adv-filter__input--text'
            type='text'
            placeholder='e.g. Bruce Willis'
            autoCorrect='off'
            spellCheck='false'
            name='cast'
            value={cast}
            onChange={(e) => setCast(e.target.value)}
          />
        </div>
        <div className='adv-filter__button-wrapper'>
          <button
            type='reset'
            className='adv-filter__button adv-filter__button--reset'
            onClick={handleResetClick}>
            Reset
          </button>
          <button
            type='submit'
            className='adv-filter__button adv-filter__button--submit'>
            Search
          </button>
        </div>
      </form>
    </section>
  );
};

export default FilterSection;
