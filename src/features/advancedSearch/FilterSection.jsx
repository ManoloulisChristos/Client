import { useState } from 'react';
import '../../styles/FilterSection.scss';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';

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

const FilterSection = ({ dialogRef, hideFilters }) => {
  // Text inputs
  const [title, setTitle] = useState('');
  const [plot, setPlot] = useState('');
  const [cast, setCast] = useState('');
  // Number inputs
  const [ratingFrom, setRatingFrom] = useState('');
  const [ratingTo, setRatingTo] = useState('');
  // Date inputs
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  // Checkboxes
  const [checkedValues, setCheckedValues] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log([data.getAll('genre')]);
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
        {item}
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
        onSubmit={handleSubmit}>
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
              id='adv-filter-date-from-input'
              className='adv-filter__input adv-filter__input--date'
              type='date'
              name='dateFrom'
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className='adv-filter__input-wrapper adv-filter__input-wrapper--date'>
            <label
              htmlFor='adv-filter-date-to-input'
              className='adv-filter__label adv-filter__label--date'>
              To
            </label>
            <input
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
              name='ratingFrom'
              value={ratingFrom}
              onChange={(e) => setRatingFrom(e.target.value)}
            />
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
              name='ratingTo'
              value={ratingTo}
              onChange={(e) => setRatingTo(e.target.value)}
            />
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
            className='adv-filter__button adv-filter__button--reset'>
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
