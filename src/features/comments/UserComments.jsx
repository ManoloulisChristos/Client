import { memo, useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icons from '../../components/Icons';
import ProgressBar from '../../components/ProgressBar';
import { createToast } from '../toast/toastsSlice';
import Spinner from '../../components/Spinner';
import Tooltip from '../../components/Tooltip';
import {
  useDeleteCommentMutation,
  useGetUserCommentsQuery,
} from './commentsApiSlice';
import '../../styles/UserComments.scss';

const UserComments = () => {
  const { id: userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  let sortByQuery = 'A-Z';
  let sortQuery = '1';

  const sortByAcceptedValues = ['A-Z', 'Rating', 'Date']; // Order matters
  if (searchParams.toString()) {
    const sortBy = searchParams.get('sortBy');
    const sort = searchParams.get('sort');

    if (sortByAcceptedValues.includes(sortBy)) {
      sortByQuery = sortBy;
    }

    if (sort === '1' || sort === '-1') {
      sortQuery = sort;
    }
  }

  const { data, isLoading } = useGetUserCommentsQuery({
    userId,
    sortBy: sortByQuery,
    sort: sortQuery,
  });
  const [deleteComment] = useDeleteCommentMutation();
  const docsCount = data?.count;
  const docs = data?.docs;

  const [show, setShow] = useState(false);
  const [sortButtonPressed, setSortButtonPressed] = useState(
    sortQuery === '-1' ? true : false
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(
    sortByAcceptedValues.indexOf(sortByQuery)
  );
  const [menuButtonValue, setMenuButtonValue] = useState(sortByQuery);

  const [progressBarLoaded, setProgressBarLoaded] = useState(0);
  const [isProgressBarLoading, setIsProgressBarLoading] = useState(false);

  const menuButtonRef = useRef(null);
  const countImagesRef = useRef(new Set());
  const menuItemsRef = useRef(null);
  const initialRenderRef = useRef(true);

  const getMenuMap = () => {
    if (!menuItemsRef.current) {
      menuItemsRef.current = new Map();
    }
    return menuItemsRef.current;
  };

  const insertNodesToMapRef = (node, index) => {
    const map = getMenuMap();
    if (node) {
      map.set(index, node);
    } else {
      map.delete(index);
    }
  };

  const handleMenuKeydown = (e) => {
    const map = getMenuMap();
    let isTargetMenuBtn = false;
    if (e.currentTarget.id === 'user-comments-menu-button') {
      isTargetMenuBtn = true;
    }
    switch (e.key) {
      case 'ArrowDown':
      case 'Down':
        e.preventDefault();
        if (isTargetMenuBtn) {
          setMenuOpen(true);
        } else {
          setMenuIndex((s) => (s = (s + 1) % map.size));
        }
        break;
      case 'ArrowUp':
      case 'Up':
        e.preventDefault();
        if (isTargetMenuBtn) {
          setMenuOpen(true);
        } else {
          setMenuIndex((s) => (s = (s - 1 + map.size) % map.size));
        }
        break;
      case 'Home':
        if (!isTargetMenuBtn && menuOpen) {
          e.preventDefault();
          setMenuIndex(0);
        }
        break;
      case 'End':
        if (!isTargetMenuBtn && menuOpen) {
          e.preventDefault();
          setMenuIndex(map.size - 1);
        }
        break;
      case 'Enter':
      case 'Spacebar':
      case ' ':
        if (!isTargetMenuBtn && menuOpen) {
          e.preventDefault();
          setMenuOpen(false);
          setMenuButtonValue(map.get(menuIndex).textContent);
        }
        break;
      case 'Escape':
      case 'Esc':
        if (!isTargetMenuBtn && menuOpen) {
          e.preventDefault();
          setMenuOpen(false);
          menuButtonRef.current.focus();
        }
        break;
      case 'Tab':
        setMenuOpen(false);
        if (e.shiftKey) {
          e.preventDefault();
          document.getElementById('navigation-menu-button').focus();
        }
        break;
      default:
        return;
    }
  };

  const handleMenuItemClick = (e, index) => {
    const text = e.currentTarget.textContent;
    setMenuButtonValue(text);
    setMenuOpen(false);
    setMenuIndex(index);
    changeQueryString('sortBy', text);
  };

  const handleSortButtonClick = () => {
    // Current render value so i must set to the oposite value ahead of time
    if (sortButtonPressed) {
      changeQueryString('sort', '1');
    } else {
      changeQueryString('sort', '-1');
    }
    setSortButtonPressed((s) => !s);
  };

  const changeQueryString = (key, val) => {
    const obj = {
      sortBy: sortByQuery,
      sort: sortQuery,
    };
    if (key === 'sortBy' || key === 'sort') {
      obj[key] = val.toString();
    }
    const params = new URLSearchParams(obj);
    setSearchParams(params);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteComment({ id });
      dispatch(createToast('success', 'Comment deleted'));
    } catch (err) {
      dispatch(createToast('error', err.data.message));
    }
  };

  useEffect(() => {
    const map = getMenuMap();
    const handleClickOutsideMenu = (e) => {
      const isMenuButton = e.target.closest('#user-comments-menu-button');
      const isMenu = e.target.closest('#user-comments-menu');
      if (isMenu || isMenuButton) {
        return; // handled in the elements onClick handler
      } else {
        setMenuOpen(false);
      }
    };
    if (!initialRenderRef.current && menuOpen) {
      map.get(menuIndex).focus();
      document.addEventListener('click', handleClickOutsideMenu, {
        capture: true,
      });
    }
    initialRenderRef.current = false;

    return () =>
      document.removeEventListener('click', handleClickOutsideMenu, {
        capture: true,
      });
  }, [menuIndex, menuOpen]);

  // Keeps in sync the URL (and coerces it to valid values) with what appears on the screen on page load
  // (user hitting the enter key on the url)
  useEffect(() => {
    if (`sortBy=${sortByQuery}&sort=${sortQuery}` !== searchParams.toString()) {
      setSearchParams(
        {
          sortBy: sortByQuery,
          sort: sortQuery,
        },
        { replace: true }
      );
    }
    //eslint-disable-next-line
  }, []);

  // Used to determine when all images have loaded from the RenderImages component
  const imagesReady = useCallback(() => {
    setIsProgressBarLoading(true);
    setProgressBarLoaded(countImagesRef.current.size);
    if (countImagesRef.current.size === docsCount) {
      setShow(true);
      setIsProgressBarLoading(false);
    }
  }, [docsCount]);

  //Set Intl API options
  const dateOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const intConst = new Intl.DateTimeFormat('en-GB', dateOptions);

  return (
    <>
      <ProgressBar
        size={docsCount}
        loaded={progressBarLoaded}
        isLoading={isProgressBarLoading}
      />

      {isLoading && !show ? (
        <Spinner busy={!show} />
      ) : (
        <div className='user-comments'>
          <h1 className='user-comments__heading'>Comments</h1>

          <div className='user-comments__controls'>
            <p className='user-comments__count' aria-live='polite'>
              Total comments: <span>{docsCount ?? '0'}</span>
            </p>
            <section
              className='user-comments__sort-section'
              aria-label='Results sorting options'
              aria-controls='user-comments-results-list'>
              <div className='user-comments__sort-by-wrapper'>
                <span
                  id='user-comments-sort-by-outer-span'
                  className='user-comments__sort-by-outer-span'>
                  Sort by:
                </span>
                <div className='user-comments__menu-wrapper'>
                  <button
                    ref={menuButtonRef}
                    type='button'
                    id='user-comments-menu-button'
                    className='user-comments__sort-by-button'
                    aria-labelledby='user-comments-sort-by-outer-span user-comments-sort-by-inner-span'
                    aria-haspopup='menu'
                    aria-controls='user-comments-menu'
                    aria-expanded={menuOpen}
                    onKeyDown={handleMenuKeydown}
                    onClick={() => setMenuOpen((s) => !s)}>
                    <span
                      id='user-comments-sort-by-inner-span'
                      className='user-comments__sort-by-inner-span'>
                      {menuButtonValue}
                    </span>
                    <Icons
                      name={'triangle'}
                      width={'12'}
                      height={'12'}
                      svgClassName={
                        'user-comments__icon user-comments__icon--triangle'
                      }
                    />
                  </button>
                  <ul
                    id='user-comments-menu'
                    className='user-comments__sort-menu'
                    role='menu'
                    data-open={menuOpen}
                    onKeyDown={handleMenuKeydown}>
                    <li className='user-comments__sort-menu-item' role='none'>
                      <button
                        ref={(node) => insertNodesToMapRef(node, 0)}
                        className='user-comments__sort-menu-item-button'
                        type='button'
                        role='menuitemradio'
                        aria-checked={menuIndex === 0}
                        tabIndex={menuOpen && menuIndex === 0 ? 0 : -1}
                        onClick={(e) => handleMenuItemClick(e, 0)}>
                        A-Z
                      </button>
                    </li>
                    <li className='user-comments__sort-menu-item' role='none'>
                      <button
                        ref={(node) => insertNodesToMapRef(node, 1)}
                        className='user-comments__sort-menu-item-button'
                        type='button'
                        role='menuitemradio'
                        aria-checked={menuIndex === 1}
                        tabIndex={menuOpen && menuIndex === 1 ? 0 : -1}
                        onClick={(e) => handleMenuItemClick(e, 1)}>
                        Rating
                      </button>
                    </li>
                    <li className='user-comments__sort-menu-item' role='none'>
                      <button
                        ref={(node) => insertNodesToMapRef(node, 2)}
                        className='user-comments__sort-menu-item-button'
                        type='button'
                        role='menuitemradio'
                        aria-checked={menuIndex === 2}
                        tabIndex={menuOpen && menuIndex === 2 ? 0 : -1}
                        onClick={(e) => handleMenuItemClick(e, 2)}>
                        Date
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <Tooltip
                tip='bottom'
                text='Results order'
                id='user-comments-sort-button'
                hasWrapper={true}>
                <button
                  className='user-comments__sort-button has-tooltip-with-wrapper'
                  type='button'
                  aria-label='Descending'
                  aria-describedby='user-comments-sort-button'
                  aria-pressed={sortButtonPressed}
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
                    className='user-comments__sort-icon'
                    aria-hidden='true'
                    focusable='false'>
                    <g className='user-comments__sort-icon-arrow-up'>
                      <polygon points='5 6 8 2 11 6'></polygon>
                      <line x1='8' y1='6' x2='8' y2='16' strokeWidth='2'></line>
                    </g>
                    <g className='user-comments__sort-icon-arrow-down'>
                      <polygon points='19 19 16 23 13 19'></polygon>
                      <line
                        x1='16'
                        y1='9'
                        x2='16'
                        y2='19'
                        strokeWidth='2'></line>
                    </g>
                  </svg>
                </button>
              </Tooltip>
            </section>
          </div>

          <ul
            id='user-comments-results-list'
            className='user-comments__results-list'>
            {docs?.map((doc) => (
              <li key={doc?._id} className='user-comments__results-item'>
                <Link
                  aria-hidden='true'
                  tabIndex='-1'
                  to={`/search/id/${doc?.movieId}`}>
                  <img
                    className='user-comments__poster'
                    src={doc?.poster ?? '/no_image.png'}
                    onError={(e) => (e.target.src = '/no_image.png')}
                    alt=''
                    width={73}
                    height={104}
                  />
                </Link>
                <div className='user-comments__info-container'>
                  <Link
                    className='user-comments__info-heading-link'
                    title={doc?.title}
                    to={`/search/id/${doc?.movieId}`}>
                    <h2 className='user-comments__info-heading'>
                      {doc?.title}
                    </h2>
                  </Link>

                  <p className='user-comments__rated'>
                    Added on: {intConst.format(new Date(doc?.date))}
                  </p>
                  <p className='user-comments__rating'>
                    <span className='visually-hidden'>Imdb Rating:</span>{' '}
                    <Icons
                      name='star'
                      width='20'
                      height='20'
                      svgClassName='user-comments__icon user-comments__icon--star'
                    />
                    {doc?.imdb}
                  </p>
                  <details className='user-comments__details' name='comment'>
                    <summary className='user-comments__summary'>
                      Comment
                    </summary>
                    <p className='user-comments__details-text'>{doc?.text}</p>
                  </details>
                  <div className='user-comments__button-wrapper'>
                    <button
                      type='button'
                      className='user-comments__button user-comments__button--delete'
                      aria-labelledby='user-comments-delete-button'
                      onClick={() => handleDeleteClick(doc?._id)}>
                      <Icons
                        name='trash'
                        width='16'
                        height='16'
                        svgClassName='user-comments__icon user-comments__icon--trash'
                      />
                      <span className='user-comments__button-text'>Delete</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        {docs?.map((movie) => (
          <div key={movie?._id}>
            <RenderImage
              data={movie}
              countImagesRef={countImagesRef}
              imagesReady={imagesReady}
            />
          </div>
        ))}
      </div>
    </>
  );
};

const RenderImage = memo(function RenderImage({
  data,
  countImagesRef,
  imagesReady,
}) {
  const handleLoad = (id) => {
    countImagesRef.current.add(id);
    imagesReady();
  };
  const handleError = (e) => {
    e.target.src = '/no_image.png';
  };
  return (
    <img
      src={data.poster ?? '/no_image.png'}
      alt=''
      style={{ display: 'none' }}
      onLoad={() => handleLoad(data._id)}
      onError={handleError}
    />
  );
});

export default UserComments;
