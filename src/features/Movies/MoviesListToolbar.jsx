import { useRef, useState } from 'react';
import '../../styles/MoviesListToolbar.scss';

function MovieListToolbar() {
  const [menuButtonValue, setMenuButtonValue] = useState('Default');
  const [rovingTabIndex, setRovingTabIndex] = useState(0);
  const [sortButtonPressed, setSortButtonPressed] = useState(false);
  const toolbarItemsRef = useRef(null);
  const menuItemsRef = useRef(null);
  const rovingTabIndexRef = useRef(0);

  // 2 maps are created in 2 different Ref hooks to track the focus between horizontal and vertical (inside the menu) navigation
  // for the options inside the toolbar
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

  const handleKeyDown = (e) => {
    const barMap = getToolbarMap();
    const menuMap = getMenuItemsMap();
    const index = rovingTabIndex;
    switch (e.key) {
      case 'ArrowLeft':
      case 'Left':
        break;
      case 'ArrowRight':
      case 'Right':
        if (index < barMap.size) {
          barMap.get(index.current).setAttribute('tabIndex', '-1');
          index.current++;
        }
        break;
      case 'ArrowDown':
      case 'Down':
        break;
      case 'ArrowUp':
      case 'Up':
        break;
      case 'Escape':
      case 'Esc':
        break;
      case 'Enter':
        break;
      case 'Home':
        break;
      case 'End':
        break;
      case ' ':
      case 'Spacebar':
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
      <span id='movies-list-menu-button-outer-span'>Sort by:</span>
      <div className='movies-list-toolbar__menu-wrapper'>
        <button
          type='button'
          className='movies-list-toolbar__menu-button'
          aria-haspopup='menu'
          aria-controls='movies-list-menu'
          aria-labelledby='movies-list-menu-button-outer-span movies-list-menu-button-inner-span'
          tabIndex='0'
          ref={(node) => insertNodesToMapRef(node, 0, getToolbarMap)}>
          <span id='movies-list-menu-button-inner-span'>
            {menuButtonValue}Menu
          </span>
        </button>
        <ul
          id='movies-list-menu'
          className='movies-list-toolbar__menu'
          role='menu'
          aria-label='sort options'>
          <li className='movies-list-toolbar__menu-item' role='none'>
            <button
              type='button'
              role='menuitemradio'
              tabIndex='-1'
              aria-checked='true'
              ref={(node) => insertNodesToMapRef(node, 0, getMenuItemsMap)}>
              Default
            </button>
          </li>
          <li className='movies-list-toolbar__menu-item' role='none'>
            <button
              type='button'
              role='menuitemradio'
              tabIndex='-1'
              aria-checked='true'
              ref={(node) => insertNodesToMapRef(node, 1, getMenuItemsMap)}>
              A-Z
            </button>
          </li>
          <li className='movies-list-toolbar__menu-item' role='none'>
            <button
              type='button'
              role='menuitemradio'
              tabIndex='-1'
              aria-checked='true'
              ref={(node) => insertNodesToMapRef(node, 2, getMenuItemsMap)}>
              Rating
            </button>
          </li>
          <li className='movies-list-toolbar__menu-item' role='none'>
            <button
              type='button'
              role='menuitemradio'
              tabIndex='-1'
              aria-checked='true'
              ref={(node) => insertNodesToMapRef(node, 3, getMenuItemsMap)}>
              Runtime
            </button>
          </li>
          <li className='movies-list-toolbar__menu-item' role='none'>
            <button
              type='button'
              role='menuitemradio'
              tabIndex='-1'
              aria-checked='true'
              ref={(node) => insertNodesToMapRef(node, 4, getMenuItemsMap)}>
              Release Date
            </button>
          </li>
        </ul>
      </div>
      <button
        type='button'
        className='movies-list-toolbar__sort-button'
        aria-pressed={`${sortButtonPressed}`}
        tabIndex='-1'
        ref={(node) => insertNodesToMapRef(node, 1, getToolbarMap)}
        onClick={() => setSortButtonPressed((n) => !n)}>
        Sort
      </button>
      <div role='radiogroup' aria-label='list display options'>
        <button
          type='button'
          className='movies-list-toolbar__radio-button'
          role='radio'
          aria-checked='true'
          tabIndex='-1'
          ref={(node) => insertNodesToMapRef(node, 2, getToolbarMap)}>
          List
        </button>
        <button
          type='button'
          className='movies-list-toolbar__radio-button'
          role='radio'
          aria-checked='false'
          tabIndex='-1'
          ref={(node) => insertNodesToMapRef(node, 3, getToolbarMap)}>
          Compact
        </button>
      </div>
    </div>
  );
}

export default MovieListToolbar;
