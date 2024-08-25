import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import usePersist from '../../hooks/usePersist';
import useAuth from '../../hooks/useAuth';
import {
  useLogoutMutation,
  useRefreshMutation,
} from '../../features/auth/authApiSlice';
import Icons from '../Icons';
import Tooltip from '../Tooltip';
import useSession from '../../hooks/useSession';

const UserMenu = ({ navBarInsertNodesToMapRef, navBarNodesMapRef }) => {
  const [persist] = usePersist();
  const [session] = useSession();
  const auth = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);

  const menuButtonRef = useRef(null);
  const menuItemsRef = useRef(null);

  const [refresh, { isLoading }] = useRefreshMutation({
    fixedCacheKey: 'RefreshOnAppStart',
  });

  const [logout] = useLogoutMutation();

  const getMenuItemsMap = () => {
    if (!menuItemsRef.current) {
      menuItemsRef.current = new Map();
    }
    return menuItemsRef.current;
  };

  const insertNodesToMapRef = (node, id) => {
    const map = getMenuItemsMap();
    if (node) {
      map.set(id, node);
    } else {
      map.delete(id);
    }
  };

  const incrementIndex = () => {
    const map = getMenuItemsMap();
    const incrementValue = (menuIndex + 1) % map.size;
    setMenuIndex(incrementValue);
  };

  const decrementIndex = () => {
    const map = getMenuItemsMap();
    const decrementValue = (menuIndex - 1 + map.size) % map.size;
    setMenuIndex(decrementValue);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'Down':
        e.preventDefault();

        if (e.target.nodeName === 'BUTTON') {
          setMenuOpen(true);
          getMenuItemsMap().get(menuIndex).focus();
        } else {
          incrementIndex();
        }
        break;
      case 'ArrowUp':
      case 'Up':
        e.preventDefault();
        if (e.target.nodeName === 'BUTTON') {
          setMenuOpen(true);
          getMenuItemsMap().get(menuIndex).focus();
        } else {
          decrementIndex();
        }
        break;
      case 'Esc':
      case 'Escape':
        if (e.currentTarget.nodeName === 'UL') {
          e.preventDefault();
          setMenuOpen(false);
          menuButtonRef.current.focus();
        }
        break;
      case 'Home':
        if (e.currentTarget.nodeName === 'UL') {
          e.preventDefault();
          setMenuIndex(0);
        }
        break;
      case 'End':
        if (e.currentTarget.nodeName === 'UL') {
          e.preventDefault();
          const map = getMenuItemsMap();
          setMenuIndex(map.size - 1);
        }

        break;

      case 'Tab':
        setMenuOpen(false);
        if (e.shiftKey) {
          e.preventDefault();
          navBarNodesMapRef.current.get(4).focus();
        }
        break;
      default:
        break;
    }
  };

  const handleLogoutClick = async () => {
    await logout({ id: auth?.id });
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useLayoutEffect(() => {
    const verifyRefreshToken = async () => {
      if ((persist || session) && !auth) {
        await refresh();
      }
    };
    verifyRefreshToken();
  }, [persist, session, auth, refresh]);

  useEffect(() => {
    if (menuOpen) {
      getMenuItemsMap().get(menuIndex).focus();
    }
  }, [menuOpen, menuIndex]);

  // Close menu when clicking outside
  useEffect(() => {
    const click = (e) => {
      const isMenuButton = e.target.closest('#navigation-menu-button');
      const isMenu = e.target.closest('#navigation-menu-list');
      if (isMenu || isMenuButton) {
        return;
      } else {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('click', click, { capture: true });
    }
    return () =>
      document.removeEventListener('click', click, { capture: true });
  }, [menuOpen]);

  return (
    <>
      {!auth?.id && !isLoading ? (
        <NavLink
          ref={(node) => navBarInsertNodesToMapRef(node, 5)}
          to={'/auth/login'}
          id='nav-link-4'
          className='header__link header__link--login'>
          Sign in
        </NavLink>
      ) : (
        <div className='header__menu-container'>
          <Tooltip
            text='User menu'
            tip='bottom'
            hasWrapper={true}
            id='navigation-menu-button-tooltip'
            tooltipClassName={
              menuOpen
                ? 'header__menu-button-tooltip--transparent'
                : 'header__menu-button-tooltip'
            }>
            <button
              ref={(node) => {
                navBarInsertNodesToMapRef(node, 5);
                menuButtonRef.current = node;
              }}
              id='navigation-menu-button'
              className='header__menu-button has-tooltip-with-wrapper'
              type='button'
              aria-labelledby='navigation-menu-button-tooltip'
              aria-haspopup='menu'
              aria-controls='navigation-menu-list'
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((s) => !s)}
              onKeyDown={handleKeyDown}>
              <Icons name='user' svgClassName='header__menu-icon' />
            </button>
          </Tooltip>
          <ul
            role='menu'
            className='header__menu-list'
            id='navigation-menu-list'
            data-open={menuOpen}
            onKeyDown={handleKeyDown}>
            <li role='none' className='header__menu-item'>
              <Link
                ref={(node) => insertNodesToMapRef(node, 0)}
                className='header__menu-link'
                to={`/user/${auth?.id}/watchlist/populated?sortBy=A-Z&sort=1`}
                role='menuitem'
                tabIndex={menuIndex === 0 && menuOpen ? 0 : -1}
                onClick={handleLinkClick}>
                Watchlist
              </Link>
            </li>
            <li role='none' className='header__menu-item'>
              <Link
                ref={(node) => insertNodesToMapRef(node, 1)}
                className='header__menu-link'
                to={`/user/${auth?.id}/rating/populated?sortBy=A-Z&sort=1`}
                role='menuitem'
                tabIndex={menuIndex === 1 && menuOpen ? 0 : -1}
                onClick={handleLinkClick}>
                Ratings
              </Link>
            </li>
            <li role='none' className='header__menu-item'>
              <Link
                ref={(node) => insertNodesToMapRef(node, 2)}
                className='header__menu-link'
                to={`/comment/user/${auth?.id}?sortBy=A-Z&sort=1`}
                role='menuitem'
                tabIndex={menuIndex === 2 && menuOpen ? 0 : -1}
                onClick={handleLinkClick}>
                Comments
              </Link>
            </li>
            <li role='none' className='header__menu-item'>
              <Link
                ref={(node) => insertNodesToMapRef(node, 3)}
                className='header__menu-link'
                to={`/user/${auth?.id}/settings`}
                role='menuitem'
                tabIndex={menuIndex === 3 && menuOpen ? 0 : -1}
                onClick={handleLinkClick}>
                Settings
              </Link>
            </li>
            <li role='none' className='header__menu-item'>
              <Link
                ref={(node) => insertNodesToMapRef(node, 4)}
                role='menuitem'
                className='header__menu-link'
                onClick={() => {
                  handleLogoutClick();
                  handleLinkClick();
                }}
                tabIndex={menuIndex === 4 && menuOpen ? 0 : -1}>
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UserMenu;
