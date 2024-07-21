import Tooltip from './Tooltip';
import '../styles/Carousel.scss';
import Icons from './Icons';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetMoreLikeThisQuery } from '../features/singleMovie/movieApiSlice';

const Carousel = ({ movieData }) => {
  const [selected, setSelected] = useState(0);
  const [prevMovieId, setPrevMovieId] = useState(null);

  const { data: movies } = useGetMoreLikeThisQuery({
    id: movieData?._id,
    title: movieData?.title,
    plot: movieData?.plot,
    fullplot: movieData?.fullplot,
  });

  const userClick = useRef(false);
  const targetElement = useRef(true);
  const focusDotRef = useRef(false);
  const slidesRef = useRef(null);
  const paginationRef = useRef(null);
  const scrollerRef = useRef(null);
  const paginationContainerRef = useRef(null);

  if (!prevMovieId && movieData) {
    setPrevMovieId(movieData._id);
  }

  const slidesMap = () => {
    if (!slidesRef.current) {
      slidesRef.current = new Map();
    }
    return slidesRef.current;
  };

  const paginationMap = () => {
    if (!paginationRef.current) {
      paginationRef.current = new Map();
    }
    return paginationRef.current;
  };

  const addNodesToMap = (index, node, mapF) => {
    const map = mapF();
    map.set(index, node);
  };

  const delNodesFromMap = (index, mapF) => {
    const map = mapF();
    map.delete(index);
  };

  const handlePaginationKeydown = (e) => {
    const totalSize = movies?.length;
    let flag = false;
    switch (e.key) {
      case 'ArrowRight':
        flag = true;
        if (selected < totalSize - 1) {
          setSelected((n) => n + 1);
          goToSlide(selected + 1);
        } else if (selected === totalSize - 1) {
          setSelected(0);
          goToSlide(0);
        }
        break;
      case 'ArrowLeft':
        flag = true;
        if (selected > 0) {
          setSelected((n) => n - 1);
          goToSlide(selected - 1);
        } else if (selected === 0) {
          setSelected(totalSize - 1);
          goToSlide(totalSize - 1);
        }
        break;
      case 'Home':
        flag = true;
        setSelected(0);
        goToSlide(0);
        break;
      case 'End':
        flag = true;
        setSelected(totalSize - 1);
        goToSlide(totalSize - 1);
        break;
      default:
        break;
    }

    if (flag) {
      e.preventDefault();
      e.stopPropagation();
      focusDotRef.current = true;
    }
  };

  // Prevents scrolling on the container when focus is on the link.
  const handleLinkKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const goToSlide = (index) => {
    const map = slidesMap();
    const element = map.get(index);
    const scrollport = scrollerRef.current;

    // Find the center for each slide when scrolled (distance - padding)
    const padding = parseInt(getComputedStyle(scrollport)['padding-left']);
    const delta = Math.abs(scrollport.offsetLeft - element.offsetLeft);
    const pos = delta - padding;

    scrollport.scrollTo(pos, 0);

    const dot = paginationMap().get(index);
    dot.scrollIntoView({ block: 'nearest' });
    // Used inside the Intersection Observer to differenciate when he needs to take controll and set the index of the selected slide
    targetElement.current = element;
    userClick.current = true;
  };

  const handlePrevClick = () => {
    if (selected > 0) {
      const prevSlide = selected - 1;
      setSelected((n) => n - 1);
      goToSlide(prevSlide);
    }
  };

  const handleNextClick = () => {
    if (selected < movies?.length - 1) {
      const nextSlide = selected + 1;
      setSelected((n) => n + 1);
      goToSlide(nextSlide);
    }
  };

  const handleDotClick = (e, index) => {
    setSelected(index);
    goToSlide(index);
  };

  // Reset carousel when selected movie changes
  if (prevMovieId && prevMovieId !== movieData?._id) {
    setPrevMovieId(movieData?._id);
    setSelected(0);
    goToSlide(0);
  }

  // Move focus along the dots programmatically but only when the events are emmited from keyboard
  useEffect(() => {
    const map = paginationMap();
    if (focusDotRef.current) {
      map.get(selected).focus();
    }

    focusDotRef.current = false;
  }, [selected]);

  // Initialize Intersection Observer on the slides and change the dataset value on intersection
  useEffect(() => {
    const options = {
      root: scrollerRef.current,
      threshold: [0.6],
    };

    const ioCallback = (entries) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          entry.target.dataset.inView = 'true';
          // Check the value that comes from the goToSlide function and also check if the user clicked the dot.
          // When the target is not the same it means that the user scrolled or pressed the dot.
          // If it is the same he pressed one of the arrows.
          // This is done to let the observer to control the state only when the user scrolls the container!!
          if (!userClick.current) {
            setSelected(Number(entry.target.dataset.order));
            //reset target to avoid bugs
            targetElement.current = entry.target;
          }
          if (targetElement.current.id === entry.target.id) {
            // reset dot click detection when it reached the target
            userClick.current = false;
          }
        } else {
          entry.target.dataset.inView = 'false';
        }
      }
    };

    const observer = new IntersectionObserver(ioCallback, options);
    if (movies) {
      const slides = slidesMap();

      slides.forEach((slide) => {
        observer.observe(slide);
      });
    }
    return () => observer.disconnect();
  }, [movies]);

  const slides = movies?.map((item, i) => (
    <div
      ref={(node) =>
        node ? addNodesToMap(i, node, slidesMap) : delNodesFromMap(i, slidesMap)
      }
      key={i}
      id={`carousel-slide-${i + 1}`}
      className='carousel__snap'
      role='tabpanel'
      aria-label={`${String(i + 1)} of ${movies?.length}`}
      aria-roledescription='slide'
      inert={selected === i ? null : ''}
      data-in-view='false'
      data-order={i}>
      <figure className='carousel__figure'>
        <Link
          className='carousel__img-link'
          to={`/search/id/${item?._id}`}
          tabIndex='-1'>
          <img
            className='carousel__img'
            src={item?.poster ?? '/no_image.png'}
            alt=''
            loading='lazy'
            onError={(e) => (e.target.src = '/no_image.png')}
          />
        </Link>
        <figcaption className='carousel__figcaption'>
          <Link
            className='carousel__caption-link'
            onKeyDown={handleLinkKeyDown}
            to={`/search/id/${item?._id}`}>
            {item?.title}
          </Link>
        </figcaption>
      </figure>
    </div>
  ));

  return (
    //eslint-disable-next-line
    <div className='carousel'>
      <div className='carousel__controls'>
        <Tooltip
          text='Previous slide'
          tip='bottom'
          id='carousel-prev-btn-tooltip'
          wrapperClassName='carousel__control-tooltip carousel__control-tooltip--prev'
          hasWrapper={true}>
          <button
            type='button'
            className='carousel__control  has-tooltip-with-wrapper'
            aria-labelledby='carousel-prev-btn-tooltip'
            aria-controls='carousel-scroller'
            aria-disabled={selected === 0 ? true : false}
            onClick={handlePrevClick}>
            <Icons
              name='chevronLeft'
              width='35'
              height='35'
              svgClassName='carousel__icon carousel__icon--arrow-left'
            />
          </button>
        </Tooltip>
        <Tooltip
          text='Next slide'
          tip='bottom'
          id='carousel-next-btn-tooltip'
          wrapperClassName='carousel__control-tooltip carousel__control-tooltip--next'
          hasWrapper={true}>
          <button
            type='button'
            className='carousel__control has-tooltip-with-wrapper'
            aria-labelledby='carousel-next-btn-tooltip'
            aria-controls='carousel-scroller'
            aria-disabled={selected === movies?.length - 1 ? true : false}
            onClick={handleNextClick}>
            <Icons
              name='chevronRight'
              width='35'
              height='35'
              svgClassName='carousel__icon carousel__icon--arrow-right'
            />
          </button>
        </Tooltip>
      </div>
      <div
        ref={scrollerRef}
        id='carousel-scroller'
        className='carousel__scroller'
        aria-live='polite'
        aria-atomic='false'>
        {slides}
      </div>
      <div
        ref={paginationContainerRef}
        className='carousel__pagination'
        role='tablist'
        aria-label='Slides'
        tabIndex='-1'
        onKeyDown={handlePaginationKeydown}>
        {[...Array(movies?.length)].map((item, i) => (
          <button
            key={i}
            ref={(node) =>
              node
                ? addNodesToMap(i, node, paginationMap)
                : delNodesFromMap(i, paginationMap)
            }
            type='button'
            className='carousel__pagination-button'
            tabIndex={selected === i ? '0' : '-1'}
            role='tab'
            aria-posinset={i + 1}
            aria-setsize={movies?.length}
            aria-controls={`carousel-slide-${i + 1}`}
            aria-selected={selected === i ? true : false}
            onClick={(e) => handleDotClick(e, i)}>
            <span className='visually-hidden'>{`Slide ${i + 1}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
