import { forwardRef, useState, useRef, useEffect } from 'react';
import '../../styles/RatingModal.scss';
import Icons from '../../components/Icons';

const RatingModal = forwardRef(function RatingModal({ movie }, ref) {
  const [rangeValue, setRangeValue] = useState('1');

  const svgRef = useRef(null);
  const radialRef = useRef(null);
  const textRef = useRef({ node: null, animationIn: null, animationOut: null });
  const openingAnimationRef = useRef(null);
  const closingAnimationRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const canPlayRef = useRef(true);

  const handleRangeInputChange = (e) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setRangeValue(e.target.value);

    if (canPlayRef.current) {
      openingAnimationRef.current.beginElement();
      if (textRef.current.animationIn) textRef.current.animationIn.cancel();
      if (textRef.current.animationOut) textRef.current.animationOut.cancel();
      canPlayRef.current = false;
    }

    timeoutIdRef.current = setTimeout(() => {
      closingAnimationRef.current.beginElement();
      canPlayRef.current = true;
      console.log('TIMEOUT');
    }, 410);
  };

  // Write comments, remember the freeze and the beginElement(), maybe move the animationOut in the timeout with delay

  useEffect(() => {
    const closingAnimationStart = async () => {
      radialRef.current.setAttribute('spreadMethod', 'repeat');
      textRef.current.animationIn = textRef.current.node.animate(
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
          fill: 'forwards',
        }
      );

      // await textRef.current.animationIn.finished;
      // textRef.current.animationIn.commitStyles();
      // textRef.current.animationIn.cancel();
    };

    const closingAnimationEnd = async () => {
      radialRef.current.setAttribute('spreadMethod', 'pad');
      textRef.current.animationOut = textRef.current.node.animate(
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

      // await textRef.current.animationOut.finished;
      // textRef.current.animationOut.commitStyles();
      // textRef.current.animationOut.cancel();
    };

    closingAnimationRef.current.addEventListener(
      'beginEvent',
      closingAnimationStart
    );
    closingAnimationRef.current.addEventListener(
      'endEvent',
      closingAnimationEnd
    );

    let cleanup = closingAnimationRef.current;
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
      onClose={(e) => console.log(e)}>
      <form className='rating-modal__form'>
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
                  node.style.setProperty('--range', rangeValue);
                  svgRef.current = node;
                } else {
                  svgRef.current = null;
                }
              }}
              xmlns='http://www.w3.org/2000/svg'
              width='80'
              height='80'
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
                  ref={openingAnimationRef}
                  attributeName='r'
                  values='0%;50%'
                  begin='indefinite'
                  dur='0.25s'
                  fill='freeze'
                  restart='whenNotActive'
                />

                <animate
                  ref={closingAnimationRef}
                  attributeName='r'
                  values='50%;0%'
                  begin='indefinite'
                  dur='1s'
                  fill='freeze'
                />

                <stop offset='0%' stopColor='#654ea3' />
                <stop offset='50%' stopColor='#fdeff9' />
                <stop offset='100%' stopColor='#eaafc8' />
              </radialGradient>
              <polygon
                ref={(node) => {
                  if (node) node.style.setProperty('--range', rangeValue);
                }}
                fill='url(#rating-modal-gradient)'
                stroke='url(#rating-modal-gradient)'
                className='rating-modal__svg-polygon'
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
            <button className='rating-modal__button rating-modal__button--cancel'>
              Cancel
            </button>
            <button
              className='rating-modal__button rating-modal__button--submit'
              type='submit'>
              Rate
            </button>
          </footer>
        </section>
      </form>
    </dialog>
  );
});

export default RatingModal;
