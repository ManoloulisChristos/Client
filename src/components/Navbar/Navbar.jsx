import { Link, NavLink } from 'react-router';
import AutocompleteForm from './AutocompleteForm';
import '../../styles/Navbar.scss';
import ThemeButton from './ThemeButton';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
    getWindowSizeOnPageLoad800,
  );
  const [widthBellow550, setWidthBellow550] = useState(
    getWindowSizeOnPageLoad550,
  );

  const [inertSearchModal, setInertSearchModal] = useState(true);

  const [logoFillColor, setLogoFillColor] = useState('light');
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
          '0',
        );
      } else {
        headerContainerRef.current.style.setProperty(
          '--_header-before-opacity',
          '1',
        );
      }
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(topLevelSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [topLevelSentinelRef]);

  // Mutation observer watches attributes of html element

  useLayoutEffect(() => {
    const targetElement = document.firstElementChild;
    const config = { attributes: true, childList: false, subtree: false };
    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes') {
          const colorScheme = mutation.target.getAttribute('color-scheme');
          if (colorScheme === 'dark') {
            setLogoFillColor('dark');
          } else {
            setLogoFillColor('light');
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetElement, config);

    return () => {
      observer.disconnect();
    };
  }, []);
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
    const popstateCallback = () => {
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
            <svg
              xmlns='http://www.w3.org/2000/svg'
              xmlSpace='preserve'
              width='65'
              height='65'
              viewBox='100 100 70.707 70.707'>
              <path
                stroke='none'
                fill={logoFillColor === 'light' ? '#231f20' : 'white'}
                d='M1627.414 2004.105c-38.882 4.117-75.094-.97-75.094-.97a290.7 290.7 0 0 1-54.32-13.203 206 206 0 0 0-1.025 14.854c-.434 13.485.5 25.71 2.05 36.368-5.92-18.477-13.787-51.222-9.476-91.93 3.9-36.796 16.125-64.81 24.92-81.363a190.3 190.3 0 0 0-39.002 17.59 190.7 190.7 0 0 0-33.292 25.096c22.736-27.676 45.222-39.937 61.648-46.007 35.79-13.238 67.07-20.436 132.578-25.289 8.048-.596 20.804-4.925 22.66-10.458 9-26.826 15.023-54.652 22.956-85.456-22.124 11.092-39.394 9.464-56.888 1.603-6.372-2.863-15.752-7.125-19.966-4.545-4.623 2.827-4.864 12.81-6.998 19.61-21.08-10.688-21.238-14.595-.832-45.091-17.518-23.19-34.487-47.14-53.235-69.602-5.95-7.131-16.077-12.37-25.276-14.86-17.374-4.707-35.446-6.799-56.171-10.5.735-4.962 3.75-21.123 16.734-28.544 2.743-1.567 7.523-3.653 19.128-3.526 24.257.265 35.138 9.705 63.513 15.878l.15.036c11.67 2.526 21.057 11.17 24.463 22.612 5.407 18.157 14.883 34.614 15.848 36.253 14.257 24.324 28.893 40.841 30.213 39.95 1.302-.887-9.7-19.14-18.434-48.66-2.845-9.61-4.521-17.26-.512-23.046 3.948-5.709 11.634-7.03 18.434-8.193 15.824-2.712 21.448 2.96 28.682-1.537 8.56-5.323 9.115-18.488 9.223-21.002.392-9.338-3.388-12.701-11.785-31.75-6.287-14.27-9.995-23.77-10.754-36.369-.754-12.508 2.037-20.76 1.024-20.996-1.416-.332-9.464 15.203-10.241 34.313-.959 23.485 9.633 37.694 4.099 41.998-3.967 3.086-9.784-3.894-28.682-6.143-11.918-1.416-18.29.32-21.654 2.056-29.242 5.968-49.135 1.893-62.217-3.328-15.86-6.323-32.401-10.869-48.256-17.216-12.478-4.998-23.327-6.565-32.368 6.311-1.855 2.64-7.554 4.907-10.532 4.051-19.885-5.727-40.158-10.857-59.046-19.079-17.65-7.68-17.162-14.974-17.412-16.782-1.307-9.423 9.205-16.066 21.007-29.768 0 0 12.873-14.944 24.584-40.973 18.64-41.426.58-93.462-6.146-93.214-6.108.229 7.367 43.192-18.438 79.897-28.127 40.015-78.665 38.086-89.117 77.848-.478 1.821-2.75 10.875-1.274 22.45 3.458 27.102 23.378 45.88 37.208 54.88 12.32 8.018 25.392 14.878 38.118 22.268-33.527-3.394-65.007-2.019-93.935 17.392 7.034 20.098 21.27 31.557 38.266 38.93 11.583 5.021 23.672 8.885 35.915 12.792a434 434 0 0 1-11.617 5.769c-47.865 22.883-95.91 35.023-141.164 40.473-1.644 30.973-1.123 102.305 41.483 175.155 66.057 112.945 182.02 141.898 207.419 147.498 124.56 27.447 259.068-24.758 348.768-132.132-23.775 18.627-81.562 58.673-165.932 67.6'
                transform='translate(-4.473 -26.023)scale(.09357)'
              />
            </svg>
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
                    to='/'
                    onClick={closeMobileNav}>
                    Placeholder
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink
                    id='nav-link-1'
                    ref={(n) => insertNodesToMapRef(n, 2)}
                    className='header__link'
                    onClick={closeMobileNav}
                    to='/'>
                    Placeholder
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
