import { useEffect, useRef, useState } from 'react';
import Icons from '../../components/Icons';
import '../../styles/MoviesListToolbar.scss';

function MovieListToolbar() {
  const [menuButtonValue, setMenuButtonValue] = useState('Default');

  const [sortButtonPressed, setSortButtonPressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolbarIndex, setToolbarIndex] = useState(0);
  const [menuIndex, setMenuIndex] = useState(0);
  const toolbarItemsRef = useRef(null);
  const menuItemsRef = useRef(null);
  const initialRenderRef = useRef(true);

  /////// How it works ////////
  // There are 2 state declarations one for the horizontal(toolbar) tabIndex and one for the vertical(menu)
  // <Left/Right> Arrow keys move the focus inside the toolbar
  // <Up/Down> Arrow keys move the focus in the menu that is a radio-group and also between the 2 last buttons of the toolbar
  //  that are also a radio group
  // <Enter/Space> keys open the menu and also select the current option or check/uncheck the toggle button
  // <Home/End> keys move focus to the first/last item either in the toolbar or the menu if it is open
  // <Esc> key closes the menu if it is open
  // <Tab/Shift-Tab> moves focus away from the toolbar entirely and the toolbar has always one active tab-stop
  //  that is the last visited item, except if it was a menu-item which in that case the active tab goes to the menu-button

  // Although that the focus could be set inside the event handler directly and no problems occurs, useEffect hook is used to keep
  // it in sync with the state of the index value

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

  const manageRovingTabIndex = (ascending, map, index) => {
    if (ascending) {
      index((n) => (n = (n + 1) % map.size));
    } else {
      index((n) => (n = (n - 1 + map.size) % map.size));
    }
  };

  const switchFocusBetweenTwoRadioButtons = (e, map) => {
    if (toolbarIndex === 2) {
      e.preventDefault();
      setToolbarIndex(3);
    } else if (toolbarIndex === 3) {
      e.preventDefault();
      setToolbarIndex(2);
    }
  };

  useEffect(() => {
    // Dont focus on Component Mount, disable condition on first keystroke
    if (!initialRenderRef.current) {
      if (menuOpen) {
        menuItemsRef.current.get(menuIndex).focus();
      } else {
        toolbarItemsRef.current.get(toolbarIndex).focus();
      }
    }
  }, [toolbarIndex, menuIndex, menuOpen]);

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
          } else {
            manageRovingTabIndex(true, menuMap, setMenuIndex);
          }
        }
        // index === 2 || 3
        switchFocusBetweenTwoRadioButtons(e, barMap);
        break;
      case 'ArrowUp':
      case 'Up':
        if (toolbarIndex === 0) {
          e.preventDefault();
          if (!menuOpen) {
            setMenuOpen(true);
          } else {
            manageRovingTabIndex(false, menuMap, setMenuIndex);
          }
        }
        // index === 2 || 3
        switchFocusBetweenTwoRadioButtons(e, barMap);
        break;
      case 'Escape':
      case 'Esc':
        if (menuOpen) {
          e.preventDefault();
          setMenuOpen(false);
        }
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        if (toolbarIndex === 0 && !menuOpen) {
          e.preventDefault();
          setMenuOpen(true);
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
        console.log('default');
    }
  };

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
            type='button'
            className='movies-list-toolbar__button movies-list-toolbar__button--menu'
            aria-haspopup='menu'
            aria-controls='movies-list-menu'
            aria-labelledby='movies-list-menu-button-outer-span movies-list-menu-button-inner-span'
            tabIndex={toolbarIndex === 0 && !menuOpen ? 0 : -1}
            ref={(node) => insertNodesToMapRef(node, 0, getToolbarMap)}
            onClick={() => setMenuOpen((n) => !n)}>
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
                className='movies-list-toolbar__button movies-list-toolbar__button--item'
                type='button'
                role='menuitemradio'
                tabIndex={menuIndex === 0 && menuOpen ? 0 : -1}
                aria-checked='true'
                ref={(node) => insertNodesToMapRef(node, 0, getMenuItemsMap)}>
                Default
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__button movies-list-toolbar__button--item'
                role='menuitemradio'
                tabIndex={menuIndex === 1 && menuOpen ? 0 : -1}
                aria-checked='true'
                ref={(node) => insertNodesToMapRef(node, 1, getMenuItemsMap)}>
                A-Z
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__button movies-list-toolbar__button--item'
                role='menuitemradio'
                tabIndex={menuIndex === 2 && menuOpen ? 0 : -1}
                aria-checked='true'
                ref={(node) => insertNodesToMapRef(node, 2, getMenuItemsMap)}>
                Rating
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__button movies-list-toolbar__button--item'
                role='menuitemradio'
                tabIndex={menuIndex === 3 && menuOpen ? 0 : -1}
                aria-checked='true'
                ref={(node) => insertNodesToMapRef(node, 3, getMenuItemsMap)}>
                Runtime
              </button>
            </li>
            <li className='movies-list-toolbar__menu-item' role='none'>
              <button
                type='button'
                className='movies-list-toolbar__button movies-list-toolbar__button--item'
                role='menuitemradio'
                tabIndex={menuIndex === 4 && menuOpen ? 0 : -1}
                aria-checked='true'
                ref={(node) => insertNodesToMapRef(node, 4, getMenuItemsMap)}>
                Release Date
              </button>
            </li>
          </ul>
        </div>
      </div>
      <button
        type='button'
        className='movies-list-toolbar__button movies-list-toolbar__button--sort'
        aria-pressed={`${sortButtonPressed}`}
        tabIndex={toolbarIndex === 1 ? 0 : -1}
        ref={(node) => insertNodesToMapRef(node, 1, getToolbarMap)}
        onClick={() => setSortButtonPressed((n) => !n)}>
        <Icons
          name='sort'
          svgClassName={
            'movies-list-toolbar__icon movies-list-toolbar__icon--repeat'
          }
        />
      </button>
      <div
        className='movies-list-toolbar__radiogroup'
        role='radiogroup'
        aria-label='list display options'>
        <button
          type='button'
          className='movies-list-toolbar__button movies-list-toolbar__button--radio'
          role='radio'
          aria-checked='true'
          tabIndex={toolbarIndex === 2 ? 0 : -1}
          ref={(node) => insertNodesToMapRef(node, 2, getToolbarMap)}>
          <Icons
            name='grid'
            svgClassName={
              'movies-list-toolbar__icon movies-list-toolbar__icon--grid'
            }
          />
        </button>
        <button
          type='button'
          className='movies-list-toolbar__button movies-list-toolbar__button--radio'
          role='radio'
          aria-checked='false'
          tabIndex={toolbarIndex === 3 ? 0 : -1}
          ref={(node) => insertNodesToMapRef(node, 3, getToolbarMap)}>
          <Icons name='list' />
        </button>
      </div>
      <button
        className='movies-list-toolbar__button movies-list-toolbar__button--spin'
        tabIndex={toolbarIndex === 4 ? 0 : -1}
        ref={(node) => insertNodesToMapRef(node, 4, getToolbarMap)}>
        Spin
      </button>
    </div>
  );
}

export default MovieListToolbar;
