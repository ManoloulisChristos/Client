import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  useDeleteRatingMutation,
  useGetPopulatedRatingsQuery,
} from './ratingsApiSlice';
import '../../styles/UserRatings.scss';
import Tooltip from '../../components/Tooltip';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';
import Icons from '../../components/Icons';
import RatingModal from '../movies/RatingModal';

const UserRatings = () => {
  const { id: userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useGetPopulatedRatingsQuery({ userId });
  const [deleteRating] = useDeleteRatingMutation();
  const docsCount = data?.[0]?.count;
  const docs = data?.[0]?.documents;

  const [show, setShow] = useState(false);
  const [sortButtonPressed, setSortButtonPressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [menuButtonValue, setMenuButtonValue] = useState('A-Z');
  const [modalData, setModalData] = useState();

  const [progressBarLoaded, setProgressBarLoaded] = useState(0);
  const [isProgressBarLoading, setIsProgressBarLoading] = useState(false);

  const menuButtonRef = useRef(null);
  const ratingModalRef = useRef(null);
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
    if (e.currentTarget.id === 'user-ratings-menu-button') {
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
    setMenuButtonValue(e.currentTarget.textContent);
    setMenuOpen(false);
    setMenuIndex(index);
  };
  useEffect(() => {
    const map = getMenuMap();
    const handleClickOutsideMenu = (e) => {
      const isMenuButton = e.target.closest('#user-ratings-menu-button');
      const isMenu = e.target.closest('#user-ratings-menu');
      console.log('first');
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

  const handleDeleteClick = async (movieId) => {
    await deleteRating({ userId, movieId });
  };

  // Used to determine when all images have loaded from the RenderImages component
  const imagesReady = useCallback(() => {
    setIsProgressBarLoading(true);
    setProgressBarLoaded(countImagesRef.current.size);
    if (countImagesRef.current.size === docsCount) {
      setShow(true);
      setIsProgressBarLoading(false);
    }
  }, [docsCount]);

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
      <RatingModal
        ref={ratingModalRef}
        movieId={modalData?.movieId}
        movieRating={modalData?.rating}
        movieTitle={modalData?.title}
      />

      {isLoading && !show ? (
        <Spinner busy={!show} />
      ) : (
        <div className='user-ratings'>
          <h1 className='user-ratings__heading'>Your ratings</h1>

          <section
            className='user-ratings__sort-section'
            aria-label='Results sorting options'
            aria-controls='user-ratings-results-list'>
            <div className='user-ratings__sort-by-wrapper'>
              <span
                id='user-ratings-sort-by-outer-span'
                className='user-ratings__sort-by-outer-span'>
                Sort by:
              </span>
              <div className='user-ratings__menu-wrapper'>
                <button
                  ref={menuButtonRef}
                  type='button'
                  id='user-ratings-menu-button'
                  className='user-ratings__sort-by-button'
                  aria-labelledby='user-ratings-sort-by-outer-span user-ratings-sort-by-inner-span'
                  aria-haspopup='menu'
                  aria-controls='user-ratings-menu'
                  aria-expanded={menuOpen}
                  onKeyDown={handleMenuKeydown}
                  onClick={() => setMenuOpen((s) => !s)}>
                  <span
                    id='user-ratings-sort-by-inner-span'
                    className='user-ratings__sort-by-inner-span'>
                    {menuButtonValue}
                  </span>
                  <Icons
                    name={'triangle'}
                    width={'12'}
                    height={'12'}
                    svgClassName={
                      'user-ratings__icon user-ratings__icon--triangle'
                    }
                  />
                </button>
                <ul
                  id='user-ratings-menu'
                  className='user-ratings__sort-menu'
                  role='menu'
                  data-open={menuOpen}
                  onKeyDown={handleMenuKeydown}>
                  <li className='user-ratings__sort-menu-item' role='none'>
                    <button
                      ref={(node) => insertNodesToMapRef(node, 0)}
                      className='user-ratings__sort-menu-item-button'
                      type='button'
                      role='menuitemradio'
                      aria-checked={menuIndex === 0}
                      tabIndex={menuOpen && menuIndex === 0 ? 0 : -1}
                      onClick={(e) => handleMenuItemClick(e, 0)}>
                      Date
                    </button>
                  </li>
                  <li className='user-ratings__sort-menu-item' role='none'>
                    <button
                      ref={(node) => insertNodesToMapRef(node, 1)}
                      className='user-ratings__sort-menu-item-button'
                      type='button'
                      role='menuitemradio'
                      aria-checked={menuIndex === 1}
                      tabIndex={menuOpen && menuIndex === 1 ? 0 : -1}
                      onClick={(e) => handleMenuItemClick(e, 1)}>
                      A-Z
                    </button>
                  </li>
                  <li className='user-ratings__sort-menu-item' role='none'>
                    <button
                      ref={(node) => insertNodesToMapRef(node, 2)}
                      className='user-ratings__sort-menu-item-button'
                      type='button'
                      role='menuitemradio'
                      aria-checked={menuIndex === 2}
                      tabIndex={menuOpen && menuIndex === 2 ? 0 : -1}
                      onClick={(e) => handleMenuItemClick(e, 2)}>
                      Rating
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <Tooltip
              tip='bottom'
              text='Results order'
              id='user-ratings-sort-button'
              hasWrapper={true}>
              <button
                className='user-ratings__sort-button'
                type='button'
                aria-label='Descending'
                aria-describedby='user-ratings-sort-button'
                aria-pressed={sortButtonPressed}
                onClick={() => setSortButtonPressed((n) => !n)}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='22'
                  height='22'
                  viewBox='0 0 24 24'
                  fill='none'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='user-ratings__sort-icon'
                  aria-hidden='true'
                  focusable='false'>
                  <g className='user-ratings__sort-icon-arrow-up'>
                    <polygon points='5 6 8 2 11 6'></polygon>
                    <line x1='8' y1='6' x2='8' y2='16' strokeWidth='2'></line>
                  </g>
                  <g className='user-ratings__sort-icon-arrow-down'>
                    <polygon points='19 19 16 23 13 19'></polygon>
                    <line x1='16' y1='9' x2='16' y2='19' strokeWidth='2'></line>
                  </g>
                </svg>
              </button>
            </Tooltip>
          </section>
          <output className='user-ratings__count'>
            {docsCount ?? 0} title{docsCount > 1 || docsCount === 0 ? 's' : ''}
          </output>
          <ul
            id='user-ratings-results-list'
            className='user-ratings__results-list'>
            {docs?.map((doc) => (
              <li key={doc?._id} className='user-ratings__results-item'>
                <Link aria-hidden='true'>
                  <img
                    className='user-ratings__poster'
                    src={doc?.poster ?? '/no_image.png'}
                    onError={(e) => (e.target.src = '/no_image.png')}
                    alt=''
                    width={73}
                    height={104}
                  />
                </Link>
                <div className='user-ratings__info-container'>
                  <div className='user-ratings__info-wrapper'>
                    <Link
                      className='user-ratings__info-heading-link'
                      title={doc?.title}>
                      <h2 className='user-ratings__info-heading'>
                        {doc?.title}
                      </h2>
                    </Link>
                    <p className='user-ratings__rating'>
                      Rated on: {intConst.format(new Date(doc?.createdAt))}
                    </p>
                    <Tooltip
                      tip='bottom'
                      text='Rate'
                      hasWrapper={true}
                      id='user-ratings-rate-button'>
                      <button
                        className='user-ratings__button-rating has-tooltip-with-wrapper'
                        aria-labelledby='user-ratings-rate-button user-ratings-rating-number'
                        aria-haspopup='dialog'
                        aria-controls='rating-modal'
                        aria-expanded='false'
                        onClick={() => {
                          setModalData(doc);
                          ratingModalRef.current.showModal();
                          ratingModalRef.current.removeAttribute('inert');
                        }}>
                        <Icons
                          name={'star'}
                          svgClassName='user-ratings__icon user-ratings__icon--star'
                        />
                        <span
                          id='user-ratings-rating-number'
                          className='user-ratings__rating-number'>
                          {doc?.rating}
                        </span>
                      </button>
                    </Tooltip>
                  </div>
                  <Tooltip
                    id='user-ratings-delete-button'
                    text='Delete'
                    tip='bottom'
                    hasWrapper={true}>
                    <button
                      type='button'
                      className='user-ratings__delete-button has-tooltip-with-wrapper'
                      aria-labelledby='user-ratings-delete-button'
                      onClick={() => handleDeleteClick(doc?.movieId)}>
                      <Icons
                        name='trash'
                        width='24'
                        height='24'
                        svgClassname='user-ratings__icon user-ratings__icon--trash'
                      />
                    </button>
                  </Tooltip>
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

export default UserRatings;
