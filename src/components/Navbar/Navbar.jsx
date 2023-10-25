import { NavLink } from 'react-router-dom';
import AutocompleteForm from './AutocompleteForm';
import '../../styles/Navbar.scss';
import ThemeButton from './ThemeButton';
import { useEffect, useRef, useState } from 'react';
import SearchModal from './SearchModal';
import Tooltip from '../Tooltip';

const Navbar = ({ topLevelSentinelRef }) => {
  // When in smaller viewport sizes the burger button is displayed and the navigation is set to display: none,
  // that means it is out of reach in the tab sequence, display is controlled only through the burger button and when it is opened
  // focus is trapped inside until the user closes it again (links and burger button)
  const [navExpanded, setNavExpanded] = useState('false');

  // Nodes in the Map include all nav-links and the burger button
  const nodesMapRef = useRef(null);
  const trackFocusIndex = useRef(null);
  const searchModalRef = useRef(null);
  const headerContainerRef = useRef(null);

  const getMap = () => {
    if (!nodesMapRef.current) {
      nodesMapRef.current = new Map();
    }
    return nodesMapRef.current;
  };

  const insertNodesToMapRef = (node, id) => {
    const map = getMap();
    if (node) {
      map.set(id, node);
    } else {
      map.delete(id);
    }
  };

  useEffect(() => {
    const burgerButton = nodesMapRef.current.get(0);
    const burgerButtonDisplayState =
      window.getComputedStyle(burgerButton).display;

    const trapFocus = (e) => {
      // If not Tab key then do nothing
      if (e.key !== 'Tab' || e.code !== 'Tab') {
        return;
      }
      // Every time the navigation opens index === null, if true then set index to 0 so the first tab press focuses the first link
      if (trackFocusIndex.current === null) trackFocusIndex.current = 0;
      if (e.shiftKey) {
        trackFocusIndex.current =
          (trackFocusIndex.current - 1 + nodesMapRef.current.size) %
          nodesMapRef.current.size;
      } else {
        trackFocusIndex.current =
          (trackFocusIndex.current + 1) % nodesMapRef.current.size;
      }

      e.preventDefault();
      nodesMapRef.current.get(trackFocusIndex.current).focus();
    };

    if (navExpanded === 'true' && burgerButtonDisplayState === 'block') {
      document.addEventListener('keydown', trapFocus);

      return () => {
        document.removeEventListener('keydown', trapFocus);
      };
    } else {
      // reset index when navigation is closed
      trackFocusIndex.current = null;
    }
  }, [navExpanded]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0],
    };

    const handleIntersect = ([entry]) => {
      if (entry.isIntersecting) {
        headerContainerRef.current.style.setProperty(
          '--_header-before-opacity',
          '0'
        );
      } else {
        headerContainerRef.current.style.setProperty(
          '--_header-before-opacity',
          '1'
        );
      }
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(topLevelSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [topLevelSentinelRef]);

  return (
    <>
      <div className='header-container' ref={headerContainerRef}>
        <header className='header'>
          <h2 className='header__logo'>LOGO</h2>

          <Tooltip
            text='Open search'
            tip='bottom'
            id='search-modal-open-tooltip'
            hasWrapper={true}
            hidden_50em={true}>
            <button
              className='header__search-button has-tooltip-with-wrapper'
              aria-labelledby='search-modal-open-tooltip'
              aria-haspopup='dialog'
              aria-expanded='false'
              aria-controls='search-dialog'
              onClick={() => {
                searchModalRef.current.showModal();
                searchModalRef.current.removeAttribute('inert');
              }}>
              <svg
                className='header__search-icon'
                aria-hidden='true'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'>
                <path d='M18.869 19.162l-5.943-6.484c1.339-1.401 2.075-3.233 2.075-5.178 0-2.003-0.78-3.887-2.197-5.303s-3.3-2.197-5.303-2.197-3.887 0.78-5.303 2.197-2.197 3.3-2.197 5.303 0.78 3.887 2.197 5.303 3.3 2.197 5.303 2.197c1.726 0 3.362-0.579 4.688-1.645l5.943 6.483c0.099 0.108 0.233 0.162 0.369 0.162 0.121 0 0.242-0.043 0.338-0.131 0.204-0.187 0.217-0.503 0.031-0.706zM1 7.5c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5-6.5-2.916-6.5-6.5z'></path>
              </svg>
            </button>
          </Tooltip>
          <SearchModal ref={searchModalRef}>
            <AutocompleteForm searchModalRef={searchModalRef} />
          </SearchModal>
          <div className='header__divider'>
            <ThemeButton />
            <Tooltip
              text={navExpanded ? 'Close main menu' : 'Open main menu'}
              id='burger-button-tooltip'
              tip='bottom'
              hasWrapper={true}
              hidden_72em={true}>
              <button
                ref={(n) => insertNodesToMapRef(n, 0)}
                aria-labelledby='burger-button-tooltip'
                aria-expanded={navExpanded}
                aria-haspopup='menu'
                aria-controls='main-navigation'
                onClick={() => {
                  navExpanded === 'false'
                    ? setNavExpanded('true')
                    : setNavExpanded('false');
                }}
                className='header__burger has-tooltip-with-wrapper'>
                <svg
                  aria-hidden='true'
                  className='header__svg'
                  viewBox='0 0 100 100'
                  width='30'>
                  <rect
                    className='header__rect header__rect--top'
                    y={navExpanded === 'true' ? 45 : 25}
                    x='10'
                    width='80'
                    height='8'
                    rx='5'></rect>
                  <rect
                    className='header__rect header__rect--middle'
                    x='10'
                    y='45'
                    width='80'
                    height='8'
                    rx='5'></rect>
                  <rect
                    className='header__rect header__rect--bottom'
                    y={navExpanded === 'true' ? 45 : 65}
                    x='10'
                    width='80'
                    height='8'
                    rx='5'></rect>
                </svg>
              </button>
            </Tooltip>
            <nav
              id='main-navigation'
              className='header__nav'
              aria-label='Main menu'
              is-open={navExpanded}>
              <ul className='header__list'>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-0'
                    ref={(n) => insertNodesToMapRef(n, 1)}
                    className='header__link'
                    to='test'>
                    Genres
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-1'
                    ref={(n) => insertNodesToMapRef(n, 2)}
                    className='header__link'>
                    Trending
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-2'
                    ref={(n) => insertNodesToMapRef(n, 3)}
                    className='header__link'>
                    Top100
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-3'
                    ref={(n) => insertNodesToMapRef(n, 4)}
                    className='header__link'>
                    Search+
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-4'
                    ref={(n) => insertNodesToMapRef(n, 5)}
                    className='header__link'>
                    Login
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
