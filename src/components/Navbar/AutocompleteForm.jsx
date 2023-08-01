import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAutocompleteQuery } from '../../features/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../Tooltip';
import '../../styles/Navbar.scss';

const AutocompleteForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [querySkip, setQuerySkip] = useState(true);
  const [isOpen, setIsOpen] = useState('false');
  const [visualFocus, setVisualFocus] = useState(null);

  const inputRef = useRef(null);
  const itemsRef = useRef(null);

  const navigate = useNavigate();

  const { data, currentData } = useAutocompleteQuery(inputValue, {
    skip: querySkip,
  });

  // map keys start at 1
  const getMap = () => {
    if (!itemsRef.current) {
      itemsRef.current = new Map();
    }

    return itemsRef.current;
  };

  const setVisualFocusZeroWithCondition = () => {
    if (visualFocus !== 0) setVisualFocus(0);
  };

  const setIsOpenWithCondition = () => {
    if (isOpen === 'false') setIsOpen('true');
  };

  const setIsNotOpenWithCondition = () => {
    if (isOpen === 'true') setIsOpen('false');
  };

  /////////////// Caution ///////////////
  // The keydown event fires before onChange, this causes extra re-renders because
  // React cant batch the state setters together

  // When the user types set visualFocus to 0 (input) + open the listbox
  // When the input is empty close the listbox
  // Manages when to skip automated fetching of useQuery hook
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setVisualFocusZeroWithCondition();
    if (value === '') {
      setIsNotOpenWithCondition();
      setQuerySkip(true);
    } else {
      setIsOpenWithCondition();
      setQuerySkip(false);
    }
  };

  const handleInputFocus = (e) => {
    if (e.currentTarget === e.target) {
      if (inputValue && isOpen === 'false') setIsOpen('true');
    }
  };

  const handleInputBlur = (e) => {
    if (e.relatedTarget?.nodeName !== 'A') {
      setVisualFocusZeroWithCondition();
      setIsNotOpenWithCondition();
    }
  };

  const handleInputKey = (e) => {
    const map = getMap();
    const size = map.size;

    switch (e.key) {
      case 'Down':
      case 'ArrowDown':
        e.preventDefault();
        if (inputValue) {
          if (visualFocus < size) {
            setVisualFocus((n) => n + 1);
          }
          if (visualFocus === size) {
            setVisualFocus(1);
          }
        }
        break;
      case 'Up':
      case 'ArrowUp':
        e.preventDefault();
        if (inputValue) {
          if (visualFocus > 1) {
            setVisualFocus((n) => n - 1);
          }
          if (visualFocus === 1 || visualFocus === 0) {
            setVisualFocus(size);
          }
        }
        break;
      case 'Left':
      case 'ArrowLeft':
      case 'Right':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        setVisualFocusZeroWithCondition();
        break;
      case 'Esc':
      case 'Escape':
        if (isOpen && inputValue && visualFocus !== 0) {
          e.preventDefault();
        }
        setVisualFocusZeroWithCondition();
        setIsNotOpenWithCondition();
        break;

      case 'Enter':
        if (inputValue && visualFocus === 0) {
          setIsNotOpenWithCondition();
          setQuerySkip(true);
          navigate(`/search/title/${inputValue}`);
          break;
        }
        // taking extra measures with conditions plus break statements because if it escapes, it cascades to the next
        // statement and two navigations happen
        if (inputValue && isOpen && visualFocus === size) {
          e.preventDefault();
          setIsNotOpenWithCondition();
          setVisualFocusZeroWithCondition();
          setQuerySkip(true);
          navigate(`/search/title/${inputValue}`);
          break;
        }
        if (inputValue && isOpen && visualFocus !== 0 && visualFocus !== size) {
          e.preventDefault();
          setVisualFocusZeroWithCondition();
          setIsNotOpenWithCondition();
          setInputValue('');
          setQuerySkip(true);
          navigate(`/search/id/${data[visualFocus - 1]?._id}`);
          break;
        }
        break;
      case 'Tab':
        setVisualFocusZeroWithCondition();
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setInputValue('');
    setIsNotOpenWithCondition();

    inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // results value switches between data & currentData when the inputValue's length is 1
  // This is done to prevent flashing of old data when the user deletes all letters
  // and starts typing from scratch. The data property is holding the previous value
  // until it fetches, while currentData does not.
  const content = (results, hasResults) => {
    const calcLast = hasResults ? results.length + 1 : 1;
    return (
      <ul
        id='autocomplete-listbox'
        className='autocomplete__list'
        role='listbox'
        aria-label='results'
        is-open={isOpen}
        onPointerLeave={() => setVisualFocusZeroWithCondition()}>
        {hasResults
          ? results.map((item, i) => {
              const n = i + 1;
              return (
                <li
                  id={`autocomplete-item-${n}`}
                  className='autocomplete__item'
                  role='option'
                  aria-selected={visualFocus === n ? true : false}
                  key={n}
                  onPointerEnter={() => setVisualFocus(n)}
                  ref={(node) => {
                    const map = getMap();
                    if (node) {
                      map.set(n, node);
                    } else {
                      map.delete(n);
                    }
                  }}>
                  <Link
                    className='autocomplete__link'
                    tabIndex='-1'
                    onClick={() => {
                      setQuerySkip(true);
                      setVisualFocusZeroWithCondition();
                      setIsNotOpenWithCondition();
                      setInputValue('');
                    }}
                    to={`/search/id/${item?._id}`}>
                    <div className='autocomplete__title'>
                      <span className='visually-hidden'>title: </span>
                      {item?.title ?? 'Missing title'}
                    </div>
                    <div className='autocomplete__year'>
                      <span className='visually-hidden'>, year: </span>
                      {item?.year ?? 'Uknown'}
                    </div>
                    <div className='autocomplete__cast'>
                      <span className='visually-hidden'>, cast: </span>
                      <span>
                        {`${item.cast?.[0]},` ?? 'No data for actors'}
                      </span>
                      <span>{item.cast?.[1]}</span>
                    </div>
                  </Link>
                </li>
              );
            })
          : null}

        <li
          id={`autocomplete-item-${calcLast}`}
          className='autocomplete__item'
          role='option'
          aria-selected={visualFocus === calcLast ? true : false}
          onPointerEnter={() => setVisualFocus(calcLast)}
          ref={(node) => {
            const map = getMap();
            if (node) {
              map.set(calcLast, node);
            } else {
              map.delete(calcLast);
            }
          }}>
          <Link
            className='autocomplete__link'
            tabIndex='-1'
            onClick={() => {
              setQuerySkip(true);
              setVisualFocusZeroWithCondition();
              setIsNotOpenWithCondition();
            }}
            to={`/search/title/${inputValue}`}>
            <div className='autocomplete__italic'>
              <div className='autocomplete__italic--1'>
                <i>
                  {hasResults && results?.length !== 0
                    ? "Not seeing what you're looking for?"
                    : 'No document titles found'}
                </i>
              </div>
              <div className='autocomplete__italic--2'>
                <i>
                  Site search for
                  <span className='autocomplete__inverse'>{inputValue}</span>
                </i>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    );
  };

  // Checks if i have an input value, if the length is 1, i use currentData, otherwise just data
  // Calls the content fuction and passes the results and a boolean if i have data or not.
  let listbox;

  if (!inputValue) {
    listbox = null;
  } else if (inputValue?.length === 1) {
    if (currentData) {
      listbox = content(currentData, true);
    } else {
      listbox = null;
    }
  } else if (inputValue?.length > 1) {
    if (data?.length) {
      listbox = content(data, true);
    } else {
      listbox = content(null, false);
    }
  }

  return (
    <form role='search' className='autocomplete' onSubmit={handleSubmit}>
      <label htmlFor='autocomplete-input' className='visually-hidden'>
        Search for movies and Tv-Shows
      </label>
      <input
        id='autocomplete-input'
        className='autocomplete__input'
        type='search'
        role='combobox'
        aria-autocomplete='list'
        aria-controls='autocomplete-listbox'
        aria-activedescendant={`${
          visualFocus ? `autocomplete-item-${visualFocus}` : ''
        }`}
        aria-expanded={isOpen}
        required
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='none'
        placeholder='Search'
        value={inputValue}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleInputKey}
      />

      <button
        type='button'
        onClick={handleClear}
        className='autocomplete__button autocomplete__button--clear has-tooltip'
        aria-labelledby='search-clear-tooltip'>
        <span className='autocomplete__icon-wrap autocomplete__icon-wrap--clear'>
          <svg
            className='autocomplete__icon autocomplete__icon--clear'
            aria-hidden='true'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'>
            <path d='M10.707 10.5l5.646-5.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-5.646 5.646-5.646-5.646c-0.195-0.195-0.512-0.195-0.707 0s-0.195 0.512 0 0.707l5.646 5.646-5.646 5.646c-0.195 0.195-0.195 0.512 0 0.707 0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146l5.646-5.646 5.646 5.646c0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146c0.195-0.195 0.195-0.512 0-0.707l-5.646-5.646z'></path>
          </svg>
        </span>
        <Tooltip
          text={'Clear search'}
          tip={'bottom'}
          id={'search-clear-tooltip'}
          hasWrapper={false}
        />
      </button>
      <button
        type='submit'
        className='autocomplete__button autocomplete__button--submit has-tooltip'
        aria-labelledby='search-submit-tooltip'>
        <span className='autocomplete__icon-wrap autocomplete__icon-wrap--submit'>
          <svg
            className='autocomplete__icon autocomplete__icon--submit'
            aria-hidden='true'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'>
            <path d='M18.869 19.162l-5.943-6.484c1.339-1.401 2.075-3.233 2.075-5.178 0-2.003-0.78-3.887-2.197-5.303s-3.3-2.197-5.303-2.197-3.887 0.78-5.303 2.197-2.197 3.3-2.197 5.303 0.78 3.887 2.197 5.303 3.3 2.197 5.303 2.197c1.726 0 3.362-0.579 4.688-1.645l5.943 6.483c0.099 0.108 0.233 0.162 0.369 0.162 0.121 0 0.242-0.043 0.338-0.131 0.204-0.187 0.217-0.503 0.031-0.706zM1 7.5c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5-6.5-2.916-6.5-6.5z'></path>
          </svg>
        </span>
        <Tooltip
          text={'Search'}
          tip={'bottom'}
          id={'search-submit-tooltip'}
          hasWrapper={false}
        />
      </button>
      {listbox}
    </form>
  );
};

export default AutocompleteForm;
