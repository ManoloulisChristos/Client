import { forwardRef, useState, useRef, useEffect } from 'react';
import '../../styles/RatingModal.scss';
import Icons from '../../components/Icons';
import {
  useAddRatingMutation,
  useUpdateRatingMutation,
} from '../ratings/ratingsApiSlice';
import useAuth from '../../hooks/useAuth';

const RatingModal = forwardRef(function RatingModal(
  { movie, ratedMovieData },
  ref
) {
  const [rangeValue, setRangeValue] = useState('1');
  const [trackRatedMovieId, setTrackRatedMovieId] = useState(''); // Track previous movie.
  const [rotateStar, setRotateStar] = useState(false); // Polygon transition property.
  const auth = useAuth();
  const [addRating] = useAddRatingMutation();
  const [updateRating] = useUpdateRatingMutation();

  const svgRef = useRef(null);
  const radialRef = useRef(null);
  const textRef = useRef({ node: null, animationIn: null, animationOut: null });
  const radialOpenAnimRef = useRef(null);
  const radialCloseAnimRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const canPlayRef = useRef(true);

  // If the movie is different from previous check if it is rated
  if (movie?._id !== trackRatedMovieId) {
    if (ratedMovieData) {
      setRangeValue(String(ratedMovieData.rating));
    } else {
      setRangeValue('1');
    }
    setTrackRatedMovieId(movie?._id);
  }

  const handleRangeInputChange = (e) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setRangeValue(e.target.value);
    setRotateStar(true);

    // Do not animate based on users preference
    // beginElement() will not be called so the events in the useEffect won't trigger.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (canPlayRef.current) {
      // Play animation only when the radialClosing animation has started or nothing else is playing!
      // This ensures that when the user makes multiple interactions the animation does not
      // restart if it has finished playing and stays in the frozen state.
      // Combination of fill = freeze + restart = whenNotActive + beginElement();
      radialOpenAnimRef.current.beginElement();
      // Cancel text shrinking if it has started (text-shrink is connected with the radialCloseAnim)
      if (textRef.current.animationOut) textRef.current.animationOut.cancel();
      canPlayRef.current = false;
    }

    // Wait and see if the user makes another interaction, then start the radialCloseAnim and permit
    // the radialOpenAnim to play again if the user makes another interaction.
    // Timer must always be greater than the radialOpenAnim duration plus some ms
    timeoutIdRef.current = setTimeout(() => {
      radialCloseAnimRef.current.beginElement();
      canPlayRef.current = true;
    }, 410);
  };

  const handleSubmitClick = async () => {
    if (!ratedMovieData) {
      await addRating({
        userId: auth.id,
        movieId: movie._id,
        rating: rangeValue,
      });
    } else {
      await updateRating({
        userId: auth.id,
        movieId: movie._id,
        rating: rangeValue,
      });
    }
    ref.current.close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const closingAnimationStart = async () => {
      radialRef.current.setAttribute('spreadMethod', 'repeat');
      textRef.current.animationOut = textRef.current.node.animate(
        [
          {
            transform: 'scale(1)',
            transformOrigin: ' 50% 50%',
            offset: '0',
          },

          {
            transform: 'scale(0)',
            transformOrigin: ' 50% 50%',
            offset: '1',
          },
        ],
        {
          duration: 950,
          fill: 'forwards', //get's removed automatically because the other animation is filling after it
        }
      );
    };

    // This event triggers even if the radialCloseAnim restarts or gets canceled by calling
    // the radialOpenAnim begin method. If it starts the end event always fires.
    // In the spec it states that there is a timeline array where begin and end events are pushed into.
    // Maybe if it gets pushed in the array it does not pop out when the animation is cancelled.
    const closingAnimationEnd = async () => {
      radialRef.current.setAttribute('spreadMethod', 'pad');

      // Wait for the text shrink animation to finish before calling the animate method.
      // Caviat: the cancel() method does not work for the animationIn anywhere that i tried using it
      // this was the only work around and using pause() with play() or manipulating the currentTime
      // will add a lot more complexity.
      await textRef.current.animationOut.finished;
      textRef.current.animationIn = textRef.current.node.animate(
        [
          {
            transform: 'scale(0)',
            transformOrigin: ' 50% 50%',
            offset: '0',
          },

          {
            transform: 'scale(1.5)',
            transformOrigin: ' 50% 50%',
            offset: '.8',
          },
          {
            transform: 'scale(1)',
            transformOrigin: ' 50% 50%',
            offset: '1',
          },
        ],
        {
          duration: 300,
          fill: 'forwards',
          easing: 'cubic-bezier(.5,-.1,.1,1.5)',
        }
      );

      // Commit styles when the animation is finished so the browser clears the animation
      // instead of keeping it because of the fill: forwards property.
      await textRef.current.animationOut.finished;
      textRef.current.animationOut.commitStyles();
      textRef.current.animationOut.cancel();
    };

    radialCloseAnimRef.current.addEventListener(
      'beginEvent',
      closingAnimationStart
    );
    radialCloseAnimRef.current.addEventListener(
      'endEvent',
      closingAnimationEnd
    );

    let cleanup = radialCloseAnimRef.current;
    return () => {
      cleanup.removeEventListener('beginEvent', closingAnimationStart);
      cleanup.removeEventListener('endEvent', closingAnimationEnd);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      id='rating-modal'
      className='rating-modal'
      inert=''
      onClose={(e) => setRotateStar(false)}>
      <form className='rating-modal__form' onSubmit={handleSubmit}>
        <section
          className='rating-modal__section'
          aria-labelledby='rating-modal-title'>
          <header className='rating-modal__header'>
            <h3 id='rating-modal-title' className='rating-modal__title'>
              Rate: {movie?.title ?? 'No title info'}
            </h3>
            <button
              className='rating-modal__close'
              type='button'
              aria-controls='rating-modal'
              aria-expanded='true'
              onClick={() => {
                ref.current.close();
                ref.current.setAttribute('inert', '');
              }}>
              <Icons name='close' />
              <span className='visually-hidden'>Close</span>
            </button>
          </header>

          <div className='rating-modal__content'>
            <svg
              ref={(node) => {
                if (node) {
                  node.style.setProperty('--_range', rangeValue);
                  svgRef.current = node;
                } else {
                  svgRef.current = null;
                }
              }}
              xmlns='http://www.w3.org/2000/svg'
              width='100'
              height='100'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
              focusable='false'
              className='icons-default rating-modal__svg'>
              <radialGradient
                ref={radialRef}
                cx='50%'
                cy='50%'
                r='0%'
                gradientUnits='userSpaceOnUse'
                id='rating-modal-gradient'>
                <animate
                  id='animate-radial'
                  ref={radialOpenAnimRef}
                  attributeName='r'
                  values='0%;50%'
                  begin='indefinite'
                  dur='0.25s'
                  fill='freeze'
                  restart='whenNotActive'
                />

                <animate
                  ref={radialCloseAnimRef}
                  attributeName='r'
                  values='50%;0%'
                  begin='indefinite'
                  dur='1s'
                  fill='freeze'
                />

                <stop offset='40%' stopColor='#000000' />
                <stop offset='41%' stopColor='#fcb045' />
                <stop offset='100%' stopColor='#fcb045' />
              </radialGradient>
              <polygon
                fill='url(#rating-modal-gradient)'
                stroke='url(#rating-modal-gradient)'
                className={`rating-modal__svg-polygon ${
                  rotateStar ? 'rating-modal__svg-polygon--transition' : ''
                }`}
                points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon>
              <text
                ref={(node) => {
                  if (node) {
                    textRef.current.node = node;
                  } else {
                    textRef.current.node = null;
                  }
                }}
                className='rating-modal__svg-text'
                x='11.5'
                y='12'
                textLength='1.5ch'
                textAnchor='middle'
                dominantBaseline='central'>
                {rangeValue}
              </text>
            </svg>

            <input
              className='rating-modal__input'
              type='range'
              min='1'
              max='10'
              step='1'
              list='rating-modal-dataset'
              onChange={handleRangeInputChange}
              value={rangeValue}
            />
            <datalist
              id='rating-modal-dataset'
              className='rating-modal__datalist'>
              <option value='1' label='1'></option>
              <option value='2' label='2'></option>
              <option value='3' label='3'></option>
              <option value='4' label='4'></option>
              <option value='5' label='5'></option>
              <option value='6' label='6'></option>
              <option value='7' label='7'></option>
              <option value='8' label='8'></option>
              <option value='9' label='9'></option>
              <option value='10' label='10'></option>
            </datalist>
          </div>
          <footer className='rating-modal__footer'>
            <button
              type='button'
              className='rating-modal__button rating-modal__button--cancel'
              onClick={() => ref.current.close()}>
              Cancel
            </button>
            <button
              type='submit'
              className='rating-modal__button rating-modal__button--submit'
              onClick={handleSubmitClick}>
              Rate
            </button>
          </footer>
        </section>
      </form>
    </dialog>
  );
});

export default RatingModal;
