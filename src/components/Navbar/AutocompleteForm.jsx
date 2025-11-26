import { useRef, useState } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router';
import { useAutocompleteQuery } from '../../features/api/apiSlice';
import Tooltip from '../Tooltip';
import '../../styles/AutocompleteForm.scss';
import Icons from '../Icons';

const AutocompleteForm = ({ searchModalRef }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [inputValue, setInputValue] = useState('');
  const [querySkip, setQuerySkip] = useState(true);
  const [isOpen, setIsOpen] = useState('false');
  const [visualFocus, setVisualFocus] = useState(null);

  const inputRef = useRef(null);
  const itemsRef = useRef(null);

  let queryString = 'sortBy=Default&sort=-1&page=1'; //Default query
  // Check to see if there are any search params and if there are and all values are correct change the queryString variable and use it
  // when a request is done to the movies-list component otherwise use the default
  // If the request is comming from the moviesList (/search/title... url) then keep the query options that are selected otherwise
  // use the default.
  if (
    searchParams.toString() &&
    location.pathname.startsWith('/search/title')
  ) {
    let sortByValue = 'Default';
    let sortValue = '-1'; //  -1 or 1 for descending ascending order

    const sortByAcceptedValues = [
      'Default',
      'A-Z',
      'Rating',
      'Runtime',
      'Year',
    ];
    const sortBy = searchParams.get('sortBy');
    const sort = searchParams.get('sort');

    if (sortByAcceptedValues.includes(sortBy)) {
      sortByValue = sortBy;
    }

    if (sort === '1' || sort === '-1') {
      sortValue = sort;
    }

    queryString = `sortBy=${sortByValue}&sort=${sortValue}&page=1`;
  }

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
    // This condition ensures that click events on the listbox link elements are registered because without it the onBlur runs first
    // making the onClick obselete
    // When the input loses focus the related target is the one that receives the input's focus if this target is a link ('A')
    // i dont want the listbox to close before the click happens
    // Caution!!!
    // link elements are before the input in the DOM as well so they when the user hits shift + tab the condintion goes to false,
    // leaving the listbox open. This is handled in the switch statement because the onKeydown runs before the onBlur.

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

      // Default event behavior happens in the 2 first statements >>> onSubmit is triggered
      case 'Enter':
        if (inputValue && visualFocus === 0) {
          break;
        }

        if (inputValue && isOpen && visualFocus === size) {
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
        if (e.shiftKey) setIsNotOpenWithCondition();
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
    if (inputValue) {
      e.preventDefault();
      setIsNotOpenWithCondition();
      setVisualFocusZeroWithCondition();
      setQuerySkip(true);
      navigate(`/search/title/${inputValue}?${queryString}`);
      closeSearchModal();
    }
  };

  const closeSearchModal = () => {
    if (!searchModalRef.current) return;
    searchModalRef.current.close();
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
                      closeSearchModal();
                    }}
                    to={`/search/id/${item?._id}`}
                    preventScrollReset={false}>
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
                        {item.cast?.[0]
                          ? `${item.cast?.[0]},`
                          : 'No data for actors'}
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
              closeSearchModal();
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

  // Checks if there is an input value, if the length is 1 use currentData, otherwise just data
  // Calls the content fuction and passes the results and a boolean if there are data or not.
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
    <form
      id='autocomplete-form'
      role='search'
      className='autocomplete'
      onSubmit={handleSubmit}>
      <label htmlFor='autocomplete-input' className='visually-hidden'>
        Search for movies and Tv-Shows
      </label>
      <input
        id='autocomplete-input'
        className='autocomplete__input'
        type='search'
        role='combobox'
        aria-autocomplete='list'
        aria-haspopup='listbox'
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
          <Icons
            name='close'
            svgClassName='autocomplete__icon autocomplete__icon--clear'
          />
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
          <Icons
            name='search'
            svgClassName='autocomplete__icon autocomplete__icon--submit'
          />
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
