import { Link, NavLink } from 'react-router';
import AutocompleteForm from './AutocompleteForm';
import '../../styles/Navbar.scss';
import ThemeButton from './ThemeButton';
import { useEffect, useRef, useState } from 'react';
import SearchModal from './SearchModal';
import Tooltip from '../Tooltip';
import UserMenu from './UserMenu';

const getWindowSizeOnPageLoad800 = () => {
  if (typeof window !== 'undefined') {
    // 800 px
    if (window.matchMedia('(max-width: 50em').matches) {
      return true;
    }
    return false;
  }
};

const getWindowSizeOnPageLoad550 = () => {
  if (typeof window !== 'undefined') {
    // 550px
    if (window.matchMedia('(max-width: 34.375em').matches) {
      return true;
    }
    return false;
  }
};
const Navbar = ({ topLevelSentinelRef }) => {
  // When in smaller viewport sizes the burger button is displayed and the navigation is set to display: none,
  // that means it is out of reach in the tab sequence, display is controlled only through the burger button and when it is opened
  // focus is trapped inside until the user closes it again (links and burger button)
  const [navExpanded, setNavExpanded] = useState(false);

  const [showSearchModal, setShowSearchModal] = useState(
    getWindowSizeOnPageLoad800
  );
  const [widthBellow550, setWidthBellow550] = useState(
    getWindowSizeOnPageLoad550
  );

  const [inertSearchModal, setInertSearchModal] = useState(true);

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

  const closeMobileNav = () => {
    setNavExpanded(false);
  };

  useEffect(() => {
    const burgerButton = nodesMapRef.current.get(0);
    const burgerButtonDisplayState =
      window.getComputedStyle(burgerButton).display;

    const trapFocus = (e) => {
      // If not Tab key then do nothing
      if (e.key === 'Escape' || e.key === 'Esc') {
        setNavExpanded(false);
        return;
      }
      if (e.key !== 'Tab') {
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

    if (navExpanded && burgerButtonDisplayState === 'block') {
      document.addEventListener('keydown', trapFocus);

      return () => {
        document.removeEventListener('keydown', trapFocus);
      };
    } else {
      // reset index when navigation is closed
      trackFocusIndex.current = null;
    }
  }, [navExpanded]);

  // Intersection Observer on the Navigation bar with a sentinel at the top of the page (sentinel is in App component)
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

  useEffect(() => {
    const mqlMin1152px = window.matchMedia('(min-width: 72em)');
    const mqlMax800px = window.matchMedia('(max-width: 50em)');
    const mqlMax550px = window.matchMedia('(max-width: 34.375em)');

    const match1152px = (e) => {
      if (e.matches) {
        setNavExpanded(false);
      }
    };
    const match800px = (e) => {
      if (e.matches) {
        setShowSearchModal(true);
      } else {
        setShowSearchModal(false);
      }
    };
    const match550px = (e) => {
      if (e.matches) {
        setWidthBellow550(true);
      } else {
        setWidthBellow550(false);
      }
    };

    mqlMin1152px.addEventListener('change', match1152px);
    mqlMax800px.addEventListener('change', match800px);
    mqlMax550px.addEventListener('change', match550px);
    return () => {
      mqlMin1152px.removeEventListener('change', match1152px);
      mqlMax800px.removeEventListener('change', match800px);
      mqlMax550px.removeEventListener('change', match550px);
    };
  }, []);

  // Listener for the popstate event to close the navbar if the user presses the back button.
  useEffect(() => {
    const popstateCallback = (e) => {
      if (navExpanded) {
        setNavExpanded(false);
      }
    };
    window.addEventListener('popstate', popstateCallback);

    return () => window.removeEventListener('popstate', popstateCallback);
  }, [navExpanded]);

  return (
    <>
      <div className='header-container' ref={headerContainerRef}>
        <header className='header'>
          <Link className='header__logo' to='/'>
            LOGO
          </Link>

          <SearchModal
            ref={searchModalRef}
            showSearchModal={showSearchModal}
            inertSearchModal={inertSearchModal}
            setInertSearchModal={setInertSearchModal}>
            <AutocompleteForm searchModalRef={searchModalRef} />
          </SearchModal>
          <div className='header__divider'>
            <Tooltip
              text='Open search'
              tip='bottom'
              id='search-modal-open-tooltip'
              hasWrapper={true}
              hidden_50em={true}>
              <button
                type='button'
                className='header__search-button has-tooltip-with-wrapper'
                aria-labelledby='search-modal-open-tooltip'
                aria-haspopup='dialog'
                aria-expanded='false'
                aria-controls='search-dialog'
                onClick={() => {
                  searchModalRef.current.showModal();
                  setInertSearchModal(false);
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
            <ThemeButton widthBellow550={widthBellow550} />
            <Tooltip
              text={navExpanded ? 'Close main menu' : 'Open main menu'}
              id='burger-button-tooltip'
              tip={widthBellow550 ? 'left' : 'bottom'}
              hasWrapper={true}
              hidden_72em={true}>
              <button
                type='button'
                ref={(n) => insertNodesToMapRef(n, 0)}
                aria-labelledby='burger-button-tooltip'
                aria-expanded={navExpanded}
                aria-controls='main-navigation'
                onClick={() => setNavExpanded((s) => !s)}
                className='header__burger has-tooltip-with-wrapper'>
                <svg
                  aria-hidden='true'
                  className='header__svg'
                  viewBox='0 0 100 100'
                  width='30'>
                  <rect
                    className='header__rect header__rect--top'
                    y={navExpanded ? 45 : 25}
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
                    y={navExpanded ? 45 : 65}
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
              data-is-open={navExpanded}>
              <ul className='header__list'>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-0'
                    ref={(n) => insertNodesToMapRef(n, 1)}
                    className='header__link'
                    to='test'
                    onClick={closeMobileNav}>
                    Genres
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-1'
                    ref={(n) => insertNodesToMapRef(n, 2)}
                    className='header__link'
                    onClick={closeMobileNav}>
                    Trending
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-2'
                    ref={(n) => insertNodesToMapRef(n, 3)}
                    className='header__link'
                    to='/search/top100?genre=All'
                    onClick={closeMobileNav}>
                    Top100
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-3'
                    ref={(n) => insertNodesToMapRef(n, 4)}
                    className='header__link'
                    to='/search/advanced?sortBy=Default&sort=-1&page=1'
                    onClick={closeMobileNav}>
                    Search+
                  </NavLink>
                </li>
                <li className='header__item'>
                  <UserMenu
                    navBarInsertNodesToMapRef={insertNodesToMapRef}
                    navBarNodesMapRef={nodesMapRef}
                    closeMobileNav={closeMobileNav}
                  />
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
