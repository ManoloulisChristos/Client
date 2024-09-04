import { useEffect, useRef, useState } from 'react';
import Icons from '../../components/Icons';
import '../../styles/MoviesListToolbar.scss';
import Tooltip from '../../components/Tooltip';
import { updateView } from '../movies/moviesToolbarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

function AdvMovieListToolbar({ totalResults, newMoviesLoaded, currentPage }) {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.moviesToolbar.view); //state to persist the display view of the component between page transitions

  const [searchParams, setSearchParams] = useSearchParams();

  // Checks the URLSearchParams and provides values to the component based on the URL both on updates and initial load!
  let queryString = 'sortBy=Default&sort=-1&page=1'; //Default query
  let sortByQuery = 'Default';
  let sortQuery = '-1'; // -1 or 1 for descending/ascending order;
  let pageQuery = '1';
  const sortByAcceptedValues = ['Default', 'A-Z', 'Rating', 'Runtime', 'Year']; //The order of the items is important because it is the same as the menu-items
  // Check to see if there are any search params and if there are and all values are correct change the queryString variable and use it
  // when a request is done to the movies-list component otherwise use the default
  if (searchParams.toString()) {
    const sortBy = searchParams.get('sortBy');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    if (sortByAcceptedValues.includes(sortBy)) {
      sortByQuery = sortBy;
      if (sort === '1' || sort === '-1') {
        sortQuery = sort;
      }
    }
    if (parseInt(page) > 1 && parseInt(page) < 1000) {
      pageQuery = page;
    }

    queryString = `sortBy=${sortByQuery}&sort=${sortQuery}&page=${pageQuery}`;

    // Populate queryString with the filter params
    searchParams.forEach((val, key) => {
      if (key !== 'sortBy' && key !== 'sort' && key !== 'page') {
        queryString = `${queryString}&${key}=${val}`;
      }
    });
  }

  const [trackQueryString, setTrackQueryString] = useState(queryString); //Whenever the query changes via the toolbar
  // this must keep track of the new query so the component knows if a different URL is received and update the corresponding values.

  /////// All state values that are used for requesting data from the API are connected to the URL and vice versa ////////
  const [menuButtonValue, setMenuButtonValue] = useState(sortByQuery);
  const [sortButtonPressed, setSortButtonPressed] = useState(
    sortQuery === '-1' ? true : false
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolbarIndex, setToolbarIndex] = useState(0);
  const [menuIndex, setMenuIndex] = useState(0);
  const [menuOptionChecked, setMenuOptionChecked] = useState(
    sortByAcceptedValues.indexOf(sortByQuery)
  );
  const [radioButtonChecked, setRadioButtonChecked] = useState(
    view === 'grid' ? 0 : 1
  );
  const [spinButtonValue, setSpinButtonValue] = useState(parseInt(pageQuery));
  const toolbarItemsRef = useRef(null);
  const menuItemsRef = useRef(null);
  const initialRenderRef = useRef(true);

  // total results value is updated when all images are fetched and are ready until then, it contains the old value.
  // This is done to be in sync with the UI
  let pageCount = null;
  if (totalResults) {
    pageCount = Math.ceil(totalResults / 20);
  }

  // Handles the case when the URL changes from another source(back-forward button) plus wait until the movies have loaded to be in sync with the MoviesList component.
  if (queryString !== trackQueryString && newMoviesLoaded) {
    setTrackQueryString(queryString);
    setMenuButtonValue(sortByQuery);
    setMenuOptionChecked(sortByAcceptedValues.indexOf(sortByQuery));
    setSortButtonPressed(sortQuery === '-1' ? true : false);
    setSpinButtonValue(parseInt(pageQuery));
  }

  // Updates the query string and also changes the URL accordingly (this forces an update to the MoviesList and to request new data)
  // Must be used in conjunction with all state values of the component that handle query changes.
  const changeQueryString = (key, val) => {
    const paramsObj = {
      sortBy: sortByQuery,
      sort: sortQuery,
      page: pageQuery,
    };
    if (key === 'sortBy' || key === 'sort' || key === 'page') {
      paramsObj[key] = val.toString();
      // force page query to default(1) when the sortBy option changes
      if (key === 'sortBy') {
        paramsObj.page = '1';
        setSpinButtonValue(1);
      }
    }

    // Populate with filter params
    searchParams.forEach((val, key) => {
      if (key !== 'sortBy' && key !== 'sort' && key !== 'page') {
        paramsObj[key] = val;
      }
    });

    const params = new URLSearchParams(paramsObj);
    setSearchParams(params);
    setTrackQueryString(params.toString());
  };

  /////// How focus works ////////
  // There are 2 state declarations that are used to manage the tab-index, one is for the horizontal(toolbar) and the other for the vertical(menu)
  // <Left/Right> Arrow keys move the focus inside the toolbar
  // <Up/Down> Arrow keys move the focus in the menu (which is a menu-radio-group) and also between the 2 last buttons of the toolbar
  //  (that are also a radio group)
  // <Enter/Space> keys open the menu and also select the current option or check/uncheck the toggle button
  // <Home/End> keys move focus to the first/last item either in the toolbar or the menu if it is open
  // <Esc> key closes the menu if it is open and gives focus to the menu-button
  // <Tab/Shift-Tab> moves focus away from the toolbar entirely and the toolbar has always one active tab-stop
  //  that is the last visited item, except if it was a menu-item which in that case the active tab goes to the menu-button

  // Although that the focus could be set inside the event handler directly and no problems occur, useEffect hook is used to keep
  // it in sync with the state of the index value

  //////// Caviats (v2 of the component)////////
  // All the values of the indexes and the aria states are managed with Numbers based on insertion order and are hard-coded
  // An improvement will be to manage them based on their values and be more dynamic

  const getToolbarMap = () => {
    if (!toolbarItemsRef.current) {
      toolbarItemsRef.current = new Map();
    }
    return toolbarItemsRef.current;
  };

  const getMenuItemsMap = () => {
    if (!menuItemsRef.current) {
      menuItemsRef.current = new Map();
    }
    return menuItemsRef.current;
  };

  const insertNodesToMapRef = (node, id, mapf) => {
    const map = mapf();
    if (node) {
      map.set(id, node);
    } else {
      map.delete(id);
    }
  };

  const manageRovingTabIndex = (ascending, map, setIndex) => {
    if (ascending) {
      setIndex((n) => (n = (n + 1) % map.size));
    } else {
      setIndex((n) => (n = (n - 1 + map.size) % map.size));
    }
  };

  const switchFocusBetweenTwoRadioButtons = (e) => {
    if (toolbarIndex === 2) {
      e.preventDefault();
      setToolbarIndex(3);
    } else if (toolbarIndex === 3) {
      e.preventDefault();
      setToolbarIndex(2);
    }
  };

  const handleMenuItemButtonClick = (e, index) => {
    const menuMap = getMenuItemsMap();
    const textString = menuMap.get(index).textContent;
    setMenuOptionChecked(index);
    setMenuOpen(false);
    setMenuButtonValue(textString);
    changeQueryString('sortBy', textString);
  };

  const handleSortButtonClick = (e) => {
    const map = getToolbarMap();
    const menuButtonText = map.get(0).textContent;

    if (menuButtonText === 'Default') {
      e.preventDefault();
    } else {
      // In general when i want ascending order the button checked state should be >false< and the query === 1
      // sortButtonPressed State has the old value at this point!! So the opposite is the correct argument!!!
      // eg. if the current value is true i have descending order (query === -1), so when the click happens the value must go to false
      // and to have ascending order the query must go to 1
      let queryCoerceOpposite = '-1';
      if (sortButtonPressed) {
        queryCoerceOpposite = '1';
      }
      changeQueryString('sort', queryCoerceOpposite);
      setSortButtonPressed((n) => !n);
    }
  };

  const handleGoButtonClick = (e) => {
    if (currentPage === spinButtonValue) {
      e.preventDefault();
    } else {
      changeQueryString('page', spinButtonValue);
    }
  };

  const handleSpinIncrement = () => {
    if (spinButtonValue < pageCount && newMoviesLoaded) {
      setSpinButtonValue((n) => (n = n + 1));
    }
  };

  const handleSpinDecrement = () => {
    if (spinButtonValue > 1 && newMoviesLoaded) {
      setSpinButtonValue((n) => (n = n - 1));
    }
  };

  const handleKeyDown = (e) => {
    initialRenderRef.current = false;
    const barMap = getToolbarMap();
    const menuMap = getMenuItemsMap();
    switch (e.key) {
      case 'ArrowLeft':
      case 'Left':
        e.preventDefault();
        if (menuOpen) {
          setMenuOpen(false);
        }
        manageRovingTabIndex(false, barMap, setToolbarIndex);
        break;
      case 'ArrowRight':
      case 'Right':
        e.preventDefault();
        if (menuOpen) {
          setMenuOpen(false);
        }
        manageRovingTabIndex(true, barMap, setToolbarIndex);
        break;
      case 'ArrowDown':
      case 'Down':
        if (toolbarIndex === 0) {
          e.preventDefault();
          if (!menuOpen) {
            setMenuOpen(true);
            setMenuIndex(menuOptionChecked);
          } else {
            manageRovingTabIndex(true, menuMap, setMenuIndex);
          }
        }
        // index === 2 || 3
        switchFocusBetweenTwoRadioButtons(e);
        if (toolbarIndex === 4) {
          e.preventDefault();
          handleSpinDecrement();
        }
        break;
      case 'ArrowUp':
      case 'Up':
        if (toolbarIndex === 0) {
          e.preventDefault();
          if (!menuOpen) {
            setMenuOpen(true);
            setMenuIndex(menuOptionChecked);
          } else {
            manageRovingTabIndex(false, menuMap, setMenuIndex);
          }
        }
        // index === 2 || 3
        switchFocusBetweenTwoRadioButtons(e);
        if (toolbarIndex === 4) {
          e.preventDefault();
          handleSpinIncrement();
        }
        break;
      case 'Escape':
      case 'Esc':
        if (menuOpen) {
          e.preventDefault();
          setMenuOpen(false);
          barMap.get(0).focus(); //Manually add focus to the menu-button when the menu closes with Esc key
        }
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        if (menuOpen) {
          e.preventDefault();
          setMenuOptionChecked(menuIndex);
          setMenuOpen(false);
          const textString = menuMap.get(menuIndex).textContent;
          setMenuButtonValue(textString);
          changeQueryString('sortBy', textString);
          barMap.get(0).focus(); //Manually add focus to the menu-button when the user picks an option from the menu
        } else if (!menuOpen && toolbarIndex === 0) {
          e.preventDefault();
          setMenuOpen(true);
          setMenuIndex(menuOptionChecked);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (menuOpen && menuIndex !== 0) {
          setMenuIndex(0);
        } else if (!menuOpen && toolbarIndex !== 0) {
          setToolbarIndex(0);
        }
        break;
      case 'End':
        e.preventDefault();
        if (menuOpen && menuIndex !== menuMap.size - 1) {
          setMenuIndex(menuMap.size - 1);
        } else if (!menuOpen && toolbarIndex !== barMap.size - 1) {
          setToolbarIndex(barMap.size - 1);
        }
        break;
      case 'Tab':
        if (menuOpen) {
          setMenuOpen(false);
        }
        break;
      default:
        break;
    }
  };

  // The Effects are broken up to reduce complexity and to avoid bugs when the listener is added, each one handles its own state
  useEffect(() => {
    if (!initialRenderRef.current) {
      toolbarItemsRef.current.get(toolbarIndex).focus();
    }
  }, [toolbarIndex]);

  useEffect(() => {
    if (!initialRenderRef.current) {
      menuItemsRef.current.get(menuIndex).focus();
    }
  }, [menuIndex]);

  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      const isMenu = e.target.closest('#movies-list-menu');
      const isMenuButton = e.target.closest('#movies-list-toolbar-menu-button');

      if (isMenu || isMenuButton) {
        return; //handled in each elements event handlres
      } else {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      menuItemsRef.current.get(menuOptionChecked).focus();
      document.addEventListener('click', handleClickOutsideMenu, {
        capture: true,
      });
    }

    return () => {
      document.removeEventListener('click', handleClickOutsideMenu, {
        capture: true,
      });
    };
  }, [menuOpen, menuOptionChecked]);

  return (
    <div
      role='toolbar'
      className='movies-list-toolbar'
      aria-label='sort options'
      aria-controls='movies-list-section'
      onKeyDown={handleKeyDown}>
      <div className='movies-list-toolbar__menu-container'>
        <span
          id='movies-list-menu-button-outer-span'
          className='movies-list-toolbar__sort-span'>
          Sort by:
        </span>
        <div className='movies-list-toolbar__menu-wrapper'>
          <button
            id='movies-list-toolbar-menu-button'
            type='button'
            className='movies-list-toolbar__button movies-list-toolbar__button--menu'
            aria-labelledby='movies-list-menu-button-outer-span movies-list-menu-button-inner-span'
            aria-haspopup='menu'
            aria-controls='movies-list-menu'
            aria-expanded={menuOpen}
            tabIndex={toolbarIndex === 0 && !menuOpen ? 0 : -1}
            ref={(node) => insertNodesToMapRef(node, 0, getToolbarMap)}
            onClick={() => {
              setMenuOpen((n) => !n);
              setMenuIndex(menuOptionChecked);
              setToolbarIndex(0); //coerce the index to 0 when the button is pressed so the focus will stay on the menu-button when the menu closes
            }}>
            <span id='movies-list-menu-button-inner-span'>
              {menuButtonValue}
            </span>
            <Icons
              name={'triangle'}
              width={'12'}
              height={'12'}
              svgClassName={
                'movies-list-toolbar__icon movies-list-toolbar__icon--triangle'
              }
            />
          </button>
          <ul
            id='movies-list-menu'
            className='movies-list-toolbar__menu'
            role='menu'
            aria-label='sort options'
            data-open={menuOpen}>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                className='movies-list-toolbar__item-button'
                type='button'
                role='menuitemradio'
                tabIndex={menuIndex === 0 && menuOpen ? 0 : -1}
                aria-checked={menuOptionChecked === 0 ? 'true' : 'false'}
                ref={(node) => insertNodesToMapRef(node, 0, getMenuItemsMap)}
                onClick={(e) => handleMenuItemButtonClick(e, 0)}>
                Default
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__item-button'
                role='menuitemradio'
                aria-label='Alphabetical'
                aria-checked={menuOptionChecked === 1 ? 'true' : 'false'}
                tabIndex={menuIndex === 1 && menuOpen ? 0 : -1}
                ref={(node) => insertNodesToMapRef(node, 1, getMenuItemsMap)}
                onClick={(e) => handleMenuItemButtonClick(e, 1)}>
                A-Z
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__item-button'
                role='menuitemradio'
                aria-checked={menuOptionChecked === 2 ? 'true' : 'false'}
                tabIndex={menuIndex === 2 && menuOpen ? 0 : -1}
                ref={(node) => insertNodesToMapRef(node, 2, getMenuItemsMap)}
                onClick={(e) => handleMenuItemButtonClick(e, 2)}>
                Rating
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__item-button'
                role='menuitemradio'
                aria-checked={menuOptionChecked === 3 ? 'true' : 'false'}
                tabIndex={menuIndex === 3 && menuOpen ? 0 : -1}
                ref={(node) => insertNodesToMapRef(node, 3, getMenuItemsMap)}
                onClick={(e) => handleMenuItemButtonClick(e, 3)}>
                Runtime
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__item-button'
                role='menuitemradio'
                aria-checked={menuOptionChecked === 4 ? 'true' : 'false'}
                tabIndex={menuIndex === 4 && menuOpen ? 0 : -1}
                ref={(node) => insertNodesToMapRef(node, 4, getMenuItemsMap)}
                onClick={(e) => handleMenuItemButtonClick(e, 4)}>
                Year
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Tooltip
        tip='bottom'
        text={
          menuButtonValue === 'Default'
            ? 'Cannot sort results when the default option is selected'
            : 'Results order'
        }
        id='movies-list-toolbar-sort-button'
        hasWrapper={true}>
        <button
          type='button'
          className='movies-list-toolbar__button movies-list-toolbar__button--sort has-tooltip-with-wrapper'
          aria-label='Descending'
          aria-describedby='movies-list-toolbar-sort-button'
          aria-pressed={sortButtonPressed}
          aria-disabled={menuButtonValue === 'Default' ? 'true' : 'false'}
          tabIndex={toolbarIndex === 1 ? 0 : -1}
          ref={(node) => insertNodesToMapRef(node, 1, getToolbarMap)}
          onClick={handleSortButtonClick}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='movies-list-toolbar__icon movies-list-toolbar__icon--sort'
            aria-hidden='true'
            focusable='false'>
            <g className='movies-list-toolbar__icon--sort-arrow-up'>
              <polygon points='5 6 8 2 11 6'></polygon>
              <line x1='8' y1='6' x2='8' y2='16' strokeWidth='2'></line>
            </g>
            <g className='movies-list-toolbar__icon--sort-arrow-down'>
              <polygon points='19 19 16 23 13 19'></polygon>
              <line x1='16' y1='9' x2='16' y2='19' strokeWidth='2'></line>
            </g>
          </svg>
        </button>
      </Tooltip>
      <div
        className='movies-list-toolbar__radiogroup'
        role='radiogroup'
        aria-label='Results display options'>
        <Tooltip
          tip='bottom'
          text='Grid view'
          id='movies-list-toolbar-grid-button'
          hasWrapper={true}>
          <button
            type='button'
            className='movies-list-toolbar__button movies-list-toolbar__button--radio-one has-tooltip-with-wrapper'
            role='radio'
            aria-labelledby='movies-list-toolbar-grid-button'
            aria-checked={radioButtonChecked === 0 ? 'true' : 'false'}
            tabIndex={toolbarIndex === 2 ? 0 : -1}
            ref={(node) => insertNodesToMapRef(node, 2, getToolbarMap)}
            onClick={() => {
              setRadioButtonChecked(0);
              dispatch(updateView('grid'));
            }}>
            <Icons
              name='grid'
              width='22'
              height='22'
              svgClassName={
                'movies-list-toolbar__icon movies-list-toolbar__icon--grid'
              }
            />
          </button>
        </Tooltip>
        <Tooltip
          tip='bottom'
          text='Compact view'
          id='movies-list-toolbar-compact-button'
          hasWrapper={true}>
          <button
            type='button'
            className='movies-list-toolbar__button movies-list-toolbar__button--radio-two has-tooltip-with-wrapper'
            role='radio'
            aria-labelledby='movies-list-toolbar-compact-button'
            aria-checked={radioButtonChecked === 1 ? 'true' : 'false'}
            tabIndex={toolbarIndex === 3 ? 0 : -1}
            ref={(node) => insertNodesToMapRef(node, 3, getToolbarMap)}
            onClick={() => {
              setRadioButtonChecked(1);
              dispatch(updateView('list'));
            }}>
            <Icons
              name='list'
              width='24'
              height='24'
              svgClassName={
                'movies-list-toolbar__icon movies-list-toolbar__icon--list'
              }
            />
          </button>
        </Tooltip>
      </div>
      <div className='movies-list-toolbar__spin-wrapper'>
        {/* linter does not let me include the aria-description even though in the docs it says otherwise */}
        {/* eslint-disable-next-line */}
        <div
          className='movies-list-toolbar__spin-button'
          role='spinbutton'
          aria-label='Pages'
          aria-description='To make a page transition you must hit the Go button'
          aria-valuemin={1}
          aria-valuenow={spinButtonValue}
          aria-valuemax={pageCount}
          tabIndex={toolbarIndex === 4 ? 0 : -1}
          ref={(node) => insertNodesToMapRef(node, 4, getToolbarMap)}>
          <span className='movies-list-toolbar__spin-value'>
            {spinButtonValue}/{pageCount}
          </span>
          <div className='movies-list-toolbar__spin-divider'>
            <button
              type='button'
              className='movies-list-toolbar__spin-increase'
              aria-label='Next page'
              tabIndex='-1'
              onClick={handleSpinIncrement}>
              <Icons
                name='triangle'
                width='14'
                height='14'
                svgClassName='movies-list-toolbar__icon movies-list-toolbar__icon--increase'
              />
            </button>
            <button
              className='movies-list-toolbar__spin-decrease'
              aria-label='Previous page'
              tabIndex='-1'
              onClick={handleSpinDecrement}>
              <Icons
                name='triangle'
                width='14'
                height='14'
                svgClassName='movies-list-toolbar__icon movies-list-toolbar__icon--decrease'
              />
            </button>
          </div>
        </div>
        <Tooltip
          tip='bottom'
          id='movies-list-toolbar-go-button'
          text={
            spinButtonValue === currentPage
              ? 'You are currently on the selected page'
              : `To page ${spinButtonValue}`
          }
          hasWrapper={true}>
          <button
            type='button'
            className='movies-list-toolbar__button movies-list-toolbar__button--go has-tooltip-with-wrapper'
            aria-describedby='movies-list-toolbar-go-button'
            aria-details='Navigate to the selected page value of the spinbutton'
            aria-disabled={currentPage === spinButtonValue ? 'true' : 'false'}
            tabIndex={toolbarIndex === 5 ? 0 : -1}
            ref={(node) => insertNodesToMapRef(node, 5, getToolbarMap)}
            onClick={handleGoButtonClick}>
            Go
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default AdvMovieListToolbar;
