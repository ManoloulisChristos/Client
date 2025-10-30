import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import '../../styles/Home.scss';
import {
  letterAnimationArgs,
  svgAnimationArgs,
  glass3dAnimationArgs,
  backgroundAnimationArgs,
  svgButtonAnimationArgs,
} from './Animations';

const homeSvgGlassPathsArray = [
  'm47.29 36.06-1.64 1.81-2.78-.84 1.1-1.94-3.53.66 1.99-2.38 1.76-1.2 2.3-1.15 3.1-.08-4.2 1.68-1.28 1.67z',
  'm49.36 36.02.27 1.19 1.19 1.02-2.43-.95-1.77.64 1.19-2.08-2.56-1.68 3.58-1.94-.66 2.39 2.47-3.09 2.74-.18-2.52 1.64.84 1.68-.62.84z',
  'M58.96 33.45 56.92 32l-2.12.92-.66-1.19-2.48 1.81 2 .84-3.72 2.26 3.45.8.8-3.06 2.29-.53z',
  'm49.67 47.07-1.32-2 2.12-.3-2.48-1.64 2.17-1.59-2.6-.04.92-3.63-3.18 1.02.84 1.5-3.1 1.82 3.32 1.28-.04-2.04.92 1.46-1.01 2.3z',
  'm54.1 37.52.97 1.15.17 1.55.58.3-1.24 2.3-3.36-.84.22 2.74-1.77-1.45L50.73 41l-2.07.05.3-3.23 2.08 1.86.05-1.9 1.77.57-.98 1.41 1.55 1.2.13-3z',
  'm51.75 42.56.35 2.12-2.43.84.4 1.02 1.28.8 1.46-1.73.84 1.28.75-1.68-1.54-.53z',
  'm61.39 34.7-1.73 1.36-.7 2.04-1.11.04-.57-1.15-1.73-.3.27 2.29-1.86-3.1 2.08-1.05 1.77 1.5.48-2.52z',
  'm60.59 39.9.57 1.95-1.45-.48-.67-1.1-1.68 1.23.18 1.68-1.77-1.42.84-2.16.05-2.08 1.59 1.5 2.03-.8-.57 1.6z',
  'm65.9 39.9-1.16-2.42-2.07-1.06-3.18 1.28 3.75.84-3.1.66 1.56.35 1.28 2.04 1.01-2.17z',
  'm65.05 45.39 1.37-.97 2.3.44-.93-2.52-1.45 1.06.08-2.83-2.74.35-.35 1.55-2.12-2.39.66 2.7.53 1.06 2.39-.4z',
  'm59.22 46.1.84-1.77-1.41-.45-.89-1.01 1.15-1.06 2.48.84.48 1.68 2.6-.05-.39 1.81.31 1.6-1.99-.84-.53-1.29-.13 1.2-.7-1.37z',
  'm53.96 47.2.58 1.15 1.14-.18 1.64.62.97 1.15 2.52-1.2.4-2.2-1.95 1.32-1.06-1.81.98-1.33-2.35-1.41.62 1.64-2.38-1.1 1.28-1.11-3.18.66 1.94 1.32z',
  'm64.97 46.05 3.44-.93-1.77 1.9 2.61 3.94-3.49-2.4-1.59 4.65-.8-4.07-3.13 3.4 1.68-5.47 2.52 1.28z',
  'm65.9 49.23-.5 2.48-1.23 1.85.75 1.37.22 3.36 2.87-2.56-.92-1.33 1.54-.88-.8-1.5.98-.89-1.9-.26z',
  'm63.15 49.94-2.6 2.74-.53.97.48 1.77 3.58-.75-1.1-1.5z',
  'm54.31 48.97.45 2.03 2.43.18 1.01.92 2.52-2.16-2.56.57-.8-.97z',
  'm53.87 50.65-.3 1.5-1.24.66 1.45.89h1.64l-.27 1.98.93.76 1.81-.71-.17-1.64 1.72-.26.44-2.12-3.27 1.37.4-1.46-2.08.26z',
  'm58.12 54.58.57 1.5-1.2.18 1.47.62-1.2 1.5.22.7-1.32-.35.48 2.3.98-1.28 2.2.7-.22-2.25 1.95-1.15-2.34-.8-.53-.92.66-1.02z',
  'm61.6 55.5-1.14.36 2.25 1.1-2.12 1.5.31 2.35-1.41.93 2.16 1.24.31-2.79 2.52.4 1.68-1.99-1.64.05.18-1.9-.88-.54.4-1.19z',
  'm59.26 62.14-1.01.75.8 1.01v1.29l.21 1.1 1.1-1.41 1.2.48-1.01-1.41h2.6l1.1-1.77 1.82-1.24-2.3-.08-.22 1.01-.93-1.06-.4 1.46.4.53-.97.62-1.81-.27z',
  'm54.14 56.21 1.77.93 2.03-.4-.66 2-1.29-.58.89 3.4 2.78-.93-1.68 2.04-2.34-.49-.04-2.03-1.5-1.55z',
  'm54.54 59.75-.58 1.33-1.72-1.24 1.15 2.92-3 .04 2.69 2.87 1.94-.66 1.55 2.34.88-2.3 1.42 1.6-.75-3.28-1.82.23-.62-.93-1.19-.58z',
  'm50.03 53.92-.27 1.28 1.86.26.48 1.37-2.2.62-1.46 1.5 1.72 1.42-2.2 1.81 4.68.13-1.42-3.4 2.65 1.2-.75-3.67 1.86-1.73-1.95-.57-1.19-.93z',
  'm47.29 62.8.62 1.77-1.5 1.06 3.4.13-1.86 1.55 3.14.8 1.5 1.01 1.46-1.55 2.12.62-1.2-2.34-2.47.93-.57-1.86-2.12-.66.09-1.46z',
  'M47.95 59.18 43.8 65.4l1.54 3.4 4.86-.3-3.18-1.25 1.86-1.06-3.32.14z',
  'm43.62 61.2-.57 1.33.08.93-1.23.36-1.37-1.42-.45.89.49.8-.66 1.14-1.37-1.2-.05 1.02 2.96 2.13-.8-1.64.76-.93L42.47 67l1.55 1.55-1.42-3.19 1.06-1.9 1.68-1.06-1.59.1z',
  'm43.93 57.54-.49 1.1 2.04-.92.26 2.38-1.24 2 2.04-1.29 1.54-3.14 3.36-1.76-2.25-.31.44-1.9-1.33-.89-.04 2.26-2.65-.23.53 2.17z',
  'm47.64 52.68.22 1.72-2.3-.48-.61 1.59.75 1.06-2.61 1.1.62-1.59-2.03-1.01 1.01-2.57 1.1 2.34 1.55-5.43z',
  'm39.9 55.9 2 .58-.89 1.81-.04 1.95-2.21-.45-1.33-1.37-.13 2.4-.97 2.38L38 65l-.22-3 1.72 2.82.26-3.36 2.52 1.73.84-2.7 1.86.22-2.39-2.2.27-1.95-1.28-.97z',
  'm40.57 56.83.04 1.82.18 1.14-1.85-.26.13-1.46-1.5-.26-1.46 1.72.66 1.15-.97 2.08-.67-2.57-1.72-1.68 1.55-2.07.26 2.12.67-3.4.57 2.3 1.99-.45 1.55 1.2z',
  'm37 53.87-1.51-.75-.66-1.1-1.11 1.41-.22 1.1-2.21-1.5.84 2.74.18 1.82 1.23-.76.84-1.06.89.58.4-1.95.97 1.02z',
  'm41.85 50.78 1.55-.22 1.15.17-1.06.8.4 1.81-1.38-1.72-1.1 2.56-.09.97-1.9.27.62 1.33-1.81-.36-1.5.18.84-1.86 1.98-1.54.98.75.22-1.5z',
  'm31.73 47.24-.44-1.28-.4 2.08.62 1.63-.4 1.95 1.81 2.2 1.64-2.6 3.18 2.56 3.23-2.12-3.05-1.01-.27 1.72-1.23-1.9 1.59-.44-1.5-.93-1.64.22-1.81 1.06 1.8-2.87-2.33 1.37z',
  'm45.03 43.53.14 1.5-1.5.22-.85.76-.97-1.86-.4 2.21-2.87.26-1.06-1.1-.57.57.22 1.1 1.23 1.2-1.06.8 2.88.8-.89-2.75 1.37.14-.44 1.15 1.33.61-.67 1.5 2.79-.7-1.86-2.3.09-1.5 1.81 1.94 1.42-1.15 1.99.36L44.8 46l1.6-2z',
  'M47.07 47.86v1.28L45.65 48l-2.3.36 1.02 1.81 1.06-1.46 1.5 2.17.62-1.06.05-2.79z',
  'm39.33 41.9.4 1.41-1.06.62-.84-1.6-1.06.14-.53 1.15-.84-.88-.13 2.47-2.21-2.16-1.02 1.06 1.46.92-1.72.36 2.03 2.65.04-2.17 1.6 1.6-1.07 1.32 2.74-.22-.66-2.52.84-1.68 1.33 1.81 2.74-.66-2.3-.62 1.59-2.43z',
  'm38.85 38.67-.89 1.41-1.28-.84-1.72.98-.13-1.9-1.95 2.87 2.21 2.65-.8-2.65 1.33-.18.31 1.86L37.08 41l2.12 2.12-.8-2.2 1.29-.85z',
  'm44.6 38.14-1.38-.7-.62 1.72-.66-.84-1.77 1.37-.13 2.12 1.28-.4-1.06 3.36 1.33-1.64L42.78 45l1.9-1.02-2.17-1.5v-2.16l1.37.44 1.07-.71z',
  'M41.63 33.06 38.8 34.3l.27 2.12-2.03.88.62-1.59-2.03 2.39 2.21 1.33 1.15-1.94.71 2.03 1.46-2.12 1.55.84-.4-1.9.88-.8-3.36 1.02z',
  'M48.06 47.88c.09-.06 4.31-.2 4.31-.2l-2.01 1.93z',
  'm50.28 49.84 2.9-2.84.76 3.25-1.85-.75z',
  'm50.38 49.94 1.43.06 1.75.94-1.87 1.87v-1.69Z',
  'm50.22 49.72-2.1 1.94.79.93 2.03.22z',
  'm50.28 49.72-2.31-1.88.16 3.66Z',
];

// Provide different rotate3d multipliers based on the glass path position
const glassRotateX = '-1, 0, .3';
const glassRotateXZ = '1, 0, .5';
const glassRotateXNegY = '.5, -1, .5';
const glassRotateXPosY = '.5, 1, .5';

// Provide a random degree of rotation
const getRandomDeg = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min); // Get a random number between a range
};

// Calculate all the glass paths animations once during the initial load of the component.
const homeGlassKeyframe3dValuesObj = {
  0: {
    translate3d: '-15px,-35px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  1: {
    translate3d: '-2px,-35px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  2: {
    translate3d: '8px,-35px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  3: {
    translate3d: '-15px,-20px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  4: {
    translate3d: '0px,-20px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  5: {
    translate3d: '0px,-8px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  6: {
    translate3d: '15px,-30px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  7: {
    translate3d: '10px,-20px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  8: {
    translate3d: '25px,-25px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  9: {
    translate3d: '40px,-20px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  10: {
    translate3d: '25px,-15px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  11: {
    translate3d: '15px,-10px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  12: {
    translate3d: '40px,-5px,500px',
    rotate3d: `${glassRotateXNegY}, ${getRandomDeg(360, 720)}deg`,
  },
  13: {
    translate3d: '40px, 10px,500px',
    rotate3d: `${glassRotateXNegY}, ${getRandomDeg(360, 720)}deg`,
  },
  14: {
    translate3d: '30px, 10px,500px',
    rotate3d: `${glassRotateXNegY}, ${getRandomDeg(360, 720)}deg`,
  },
  15: {
    translate3d: '15px, 5px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  16: {
    translate3d: '15px, 10px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  17: {
    translate3d: '20px, 20px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  18: {
    translate3d: '40px, 20px,500px',
    rotate3d: `${glassRotateXNegY}, ${getRandomDeg(360, 720)}deg`,
  },
  19: {
    translate3d: '35px, 30px,500px',
    rotate3d: `${glassRotateXNegY}, ${getRandomDeg(360, 720)}deg`,
  },
  20: {
    translate3d: '10px, 20px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  21: {
    translate3d: '15px, 30px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  22: {
    translate3d: '5px, 10px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  23: {
    translate3d: '-2px, 30px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  24: {
    translate3d: '-15px, 40px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  25: {
    translate3d: '-25px, 40px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  26: {
    translate3d: '-5px, 20px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  27: {
    translate3d: '-5px, 5px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  28: {
    translate3d: '-25px, 25px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  29: {
    translate3d: '-40px, 30px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  30: {
    translate3d: '-40px, 20px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  31: {
    translate3d: '-15px, 20px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  32: {
    translate3d: '-40px, 0px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  33: {
    translate3d: '-15px, -10px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  34: {
    translate3d: '-5px, -5px,500px',
    rotate3d: `${glassRotateXZ}, ${getRandomDeg(360, 720)}deg`,
  },
  35: {
    translate3d: '-35px, -20px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  36: {
    translate3d: '-35px, -40px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  37: {
    translate3d: '-25px, -25px,500px',
    rotate3d: `${glassRotateX}, ${getRandomDeg(360, 720)}deg`,
  },
  38: {
    translate3d: '-35px, -45px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
  39: {
    translate3d: '0px, -4px,500px',
    rotate3d: `${glassRotateX}, 381deg`,
  },
  40: {
    translate3d: '5px, -3px,500px',
    rotate3d: `${glassRotateXNegY}, 580deg`,
  },
  41: {
    translate3d: '3px, 5px,500px',
    rotate3d: `${glassRotateXNegY}, ${getRandomDeg(360, 720)}deg`,
  },
  42: {
    translate3d: '0px, 0px,500px',
    rotate3d: `${glassRotateX}, 700deg`,
  },
  43: {
    translate3d: '-5px, 0px,500px',
    rotate3d: `${glassRotateXPosY}, ${getRandomDeg(360, 720)}deg`,
  },
};

///////////// IMPORTANT //////////////
// SVG PROBLEMS > (Chromium browsers bug) (Firefox is ok)

// Applies a blur to the whole SVG when some tranform properties are applied or combined with tranform-origin via CSS.
// When they are applied with an animation with CSS or the Web Animations Api the blur is persistent
// throughout the duration of the animation for ALL tranform properties.

// Applying "will-change: tranform" on the group element makes the blur permanent
// backface-visibility does not solve it
// image-rendering on chrome only has one property that is available and that is "pixelated"... and maybe that is the problem.
// changing the values via javascript works with the properties that work in general because they are "static" and not animated.

// List of tranform properties that are applied on the element (not with animation):
// rotate and rotateZ work with everything
// rotateX does not work at all
// rotateY works but not with transform-origin
// skew skewX skewY all work
// translate works

//////// Workaround ///////
// Use the native animateTranform with the properties that are generally ok, with a combination of
// tranform-origin and tranform-box: fill-box via CSS so the element is animated or moved around itself.

let initialProtrusion = 21;
let initialAspectRatioOver = true;
let initialPortraitAndWidthOver600 = true;
let initialLetterTextStrokeWidth = 4;
let initialMotionOk = true;
let initialPointerFine = true;
if (typeof window !== 'undefined') {
  const vw600 = window.matchMedia('(max-width: 37.5em)').matches;
  const vw1200 = window.matchMedia('(max-width: 75em)').matches;
  const vw1920 = window.matchMedia('(max-width: 120em)').matches;
  const vw2560 = window.matchMedia('(max-width: 160em)').matches;
  const allElse = window.matchMedia('(min-width: 160.001em)').matches;
  const mqlAspectRatio = window.matchMedia('(min-aspect-ratio: 1 / 1)').matches;
  const phoneLandscape = window.matchMedia(
    '(orientation: landscape) and (max-height: 500px)'
  ).matches;

  // Set values directly.
  initialMotionOk = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  ).matches;
  initialPointerFine = window.matchMedia('(pointer: fine)').matches;

  if (vw600) {
    initialProtrusion = 9;
    initialLetterTextStrokeWidth = 2;
  } else if (vw1200) {
    initialProtrusion = 13;
    initialLetterTextStrokeWidth = 2;
  } else if (vw1920) {
    initialProtrusion = 17;
  } else if (vw2560) {
    initialProtrusion = 21;
  } else if (allElse) {
    initialProtrusion = 25;
  }

  if (phoneLandscape) {
    initialProtrusion = 9;
  }

  if (mqlAspectRatio) {
    // Landscape
    initialAspectRatioOver = true;
  } else {
    //Portrait
    initialAspectRatioOver = false;
    // Max 600px
    if (vw600) {
      initialPortraitAndWidthOver600 = false;
    } else {
      initialPortraitAndWidthOver600 = true;
    }
  }
}

// Check if the user has seen the animations already.
let initialAnimationsState = 'running';
// if (window !== undefined) {
//   const storage = localStorage.getItem('home_first_time_ever');
//   if (storage && storage === 'false') {
//     initialAnimationsState = 'running';
//   }
// }

const Home = () => {
  const btnRef = useRef(null);
  const testRef = useRef(null);
  const [animationsPlayState, setAnimationsPlayState] = useState(
    initialAnimationsState
  ); //  iddle / running / reverse
  // Letter relative states based on different viewports
  const [protrusionSize, setProtrusionSize] = useState(initialProtrusion); // Front + Back + Middle letters sum of pixels in depth
  const [letterTextStrokeWidth, setLetterTextStrokeWidth] = useState(
    initialLetterTextStrokeWidth
  );

  // Viewport flags for the Star animation offset-path
  const [aspectRatioOver, setAspectRatioOver] = useState(
    initialAspectRatioOver
  ); // Over 1 / 1 > 1.1, 1.2 etc

  const [portraitAndWidthOver600, setPortraitAndWidthOver600] = useState(
    initialPortraitAndWidthOver600
  );

  const [pointerFine, setPointerFine] = useState(initialPointerFine);
  const [motionOk, setMotionOk] = useState(initialMotionOk);

  // Glass3d offset-path class
  const [toggleGlassClassName, setToggleGlassClassName] = useState(
    'home__svg-glass-empty home__svg-glass-empty--'
  );

  const homeRef = useRef(null);
  const letterResizeObserverRef = useRef(null);
  const letterObserverRAF_ID = useRef(null);
  const homeResizeObserverRef = useRef(null);
  const homeObserverRAF_ID = useRef(null);
  // Letter elements
  const containersRef = useRef(null);
  const boxesRef = useRef(null);
  const frontNodesRef = useRef(null);
  const leftNodesRef = useRef(null);
  const rightNodesRef = useRef(null);

  // div wrapper around the main svg (contains cow + star)
  const mainSvgContainerRef = useRef(null);

  // SVG elements
  const svgStarRef = useRef(null);
  const svgCowRef = useRef(null);
  const svgShadowRef = useRef(null);
  const svgButtonRef = useRef(null);

  // Cow Parts
  const cowEarLeftRef = useRef(null);
  const cowEarRightRef = useRef(null);
  const cowMouthBottomRef = useRef(null);
  const cowDisplaceAnimateRef = useRef(null);
  const cowEyeLeftRef = useRef(null);
  const cowEyeRightRef = useRef(null);

  // Svg animate element for star
  // This starts a series of animate properties that are interconnected with each other
  const starMorphShapeAnimateRef = useRef(null);

  // Svg animate element for the turbulence eyes
  // One eye is connected with the other and the morphing later is happening with a delay based on the starting animation
  const shadowEyeAngryAnimateRef = useRef(null);
  const shadowTurblulenceDisplaceAnimRef = useRef(null);

  // All glass paths
  const glassContainerRef = useRef(null);
  const glassPathsRef = useRef(null);

  // Background & Intro
  const conicWrapperRef = useRef(null);
  const conicInsideRef = useRef(null);
  const conicBackDarkRef = useRef(null);
  const beamAndBubbleContainerRef = useRef(null);
  const svgBubbleRef = useRef(null);
  const beamRef = useRef(null);
  const svgBubbleClipAnimateRef = useRef(null);
  const arcAnimateReverseRef = useRef(null);

  // Svg button elements
  const svgButtonRectBackRef = useRef(null);
  const svgButtonRectFrontRef = useRef(null);
  const svgButtonRectPlaceholderRef = useRef(null);
  const svgButtonGroupedPathsRef = useRef(null);
  const svgButtonRectClipScaleUpAnimateRef = useRef(null);
  const svgButtonRectClipIddleStateAnimateRef = useRef(null);

  // Animate SVG Elements that control the state of all animated svg elements
  const globalEndAnimateRef = useRef(null);
  const animateGlobalResetRef = useRef(null);
  const animateGlobalReverseRef = useRef(null);
  const animateGlobalReverseResetRef = useRef(null);

  // Placeholders for filling animations
  const forwardsAnimRef = useRef([]);
  const reverseForwardsAnimRef = useRef([]);
  const animationsCanceledRef = useRef(false);
  const shouldBackgroundAnimateRef = useRef(true);

  // Map getter helper function
  const getMap = (ref) => {
    if (!ref.current) {
      ref.current = new Map();
    }

    return ref.current;
  };

  /////////////////////////// Curved letters with 3D animation /////////////////////////

  // Each letter container is set in an offset-path: ellipse() with vmin values for responsiveness
  // To achieve a "fat" (bold) letter in 3D of 20px depth, 20 identical letters are used each  one
  // translated 1px behind the other in the Z axis plus a text-stroke for the outline of each letter.

  // Inter font update from v12 to v18 broke the text stroke due to some glyph updates so i changed it to Inter-Tight.

  // All letters have a scene parent with an independent persepective and a box container which is the anchor point for absolute positioning
  // and also the rotation object for the group of letters.

  // The scene dimensions must be exactly the same as the rendered width and height of each letter in order for the rotation in the Y axis
  //  to be centered in the middle of each letter and have no offset.

  // When the letters are perpendicular to the screen the rendering of each letter is not smooth and gaps are showing, that is in the
  // 90 and 270 degrees of rotation in the Y axis. With an animation on top of that, rotating the box constantly is disturbing to
  // the eye.

  ///////// The solution //////////
  //  is to have an object rotated perpendicular to the screen (left-right side) so when the container (box) rotates
  // there is something to obscure the gap of the letters upon rotation. In order to achieve a result where the left and right side
  // are exactly the same width and height I must calculate the exact height of each different letter dynamically and count the resizing.
  /////  BUT////////
  // the height of the letters is not exactly the same as the contect-box because each letter has different dimensions and is always
  //  smaller than the rendered content-box, plus absolute positioning is making things even harder.
  // The width can be the boldness of the letters which is 20 px though.

  // Workaround is to have the letter "I" instead of a "crafted" element because it is exactly 20px wide and the height is in the center
  // of the content-box no matter which letter is being used when they are rotated at a perpendicular angle. So this "hack" achieves
  // great results with zero effort.

  // Caviat of using the "I":
  //  If the left and right side (letter "I) are shown constantly in the animation in letters like "O" or "V",
  //  which have a curve in their shape the "I" protrudes in an ungly shape which is not fluid or normal looking.
  // In order to achieve a result which is "OK" (not perfect) i found the range of the angles of rotation which the
  // "I" needs to be used to hide the not rendering part of letters when they are perpendicular to the screen.
  // They are +/- 5 degrees of 90 and 270. So 85-95 and 265-275 degrees.
  // If more range is added the "I" protrucion is seen during the animation so min-maxing it its the range previously mentioned.

  // I HAVE ONLY TESTED CAPITAL LETTERS atm.

  // The next step is to divide the range of 0-360 degrees to a range of 0-100 (%) for the animation keyframes and animate the opacity
  // of the left and right side only in that range and avoid all the above.

  ////////////// BUG //////////////
  // In firefox the 3D animation breaks when it gets offseted(offset-path), otherwise it is smooth.

  ////// Important //////
  // When an element is offseted using offset-path the dimensions change, so caution is needed upon measuring dimensions!

  // Measure dimensions of each "front" letter (biggest letter in dimensions)
  // upon first render and make the scene (container) the same size.

  /////// Adding Responsiveness //////
  // In order for the letters to have the correct depth ("fatness") in different dimensions and taking in consideration the dynamic change
  // of the font-size via CSS, a different number of middle letters must be added. The font-size of the letter "I"
  // (which is crucial for the rotating animation to work) is the dictaror of how many middle letters should be rendered in different viewport sizes.
  //  So having a correct depth (middle letters) in combination with "how big" (font-size) is the "I" brings a responsive solution to the animation.

  // Resize Observer //
  // Observe all front-letters and update the scene to the correct size & watch for breakpoints upon resizing and update the number of middle letters
  useLayoutEffect(() => {
    ///////////// BUG ///////////////////
    // When the window gets resized rapidly everything works well, but when the window is resized slowly the entry particularly on the
    // letter "I" is not getting reported, so i miss one entry, this introduces two problems.
    // 1. Based on the structure that I have: index numbers as keys from the order of rendering the letters, the itterations through the
    // observed letters, when one entry is missing i get a mismatch from the container to the actual letter sizing.
    // 2. I need to measure that letter

    // Solution is to add a direct reference between letters and the containers and ONLY when i am missing an entry then i will
    // measure the letter that is missing in a rAF to avoid a synchronous layout measurment.

    ///////// Another BUG on animations with fill:'forwards' option ///////////
    // For some reason all works well and i can cancel the animations via the docoment.getAnimations() as expected
    // when the component rerenders or in any other case normally.
    // BUT when i get a resize with the observer on some animations with fill:'forwards' have their end state
    // peristed vissually but their animation object is lost and i cant cancel them.
    // ALSO and this is important in the devTools i get computed styles of their ending animation state but their
    // normal styles are not crossed over with the classic line implementing that this style is overridden,
    // nor do i get another block of style showing me the styles that are comming from the animation itself.
    // It's like the animation never existed but its ending state persisted.
    // It's also like using the commitStyles() and then cancel() methods but instead of getting an inline style
    // showing the end state of the animation i have nothing. But the computed styles are the the actual
    // end state values of the animation!

    letterResizeObserverRef.current = new ResizeObserver((entries) => {
      // If there is a pending RAF cancel it.
      const rafID = letterObserverRAF_ID.current;
      if (rafID) {
        console.log('first');
        cancelAnimationFrame(rafID);
      }

      const updateContainerSize = (entries) => {
        // Populate Map with letter / container references
        const lettersAndContainersMap = new Map();
        const frontNodesSizesMap = new Map();
        const frontNodesPlaceholderSet = new Set();
        console.log('resize');

        // First create a Map with letter - container pairs and store all the unique letter elements
        // inside a placeholder Set.
        frontNodesRef.current.forEach((val, key) => {
          lettersAndContainersMap.set(val, containersRef.current.get(key));
          // frontNodesSizesMap.set(val, { width: null, height: null });
          frontNodesPlaceholderSet.add(val);
        });

        // Then do all the reads of the sizes comming out natively from the resizeObserver.
        for (const entry of entries) {
          frontNodesSizesMap.set(entry.target, {
            width: `${Math.ceil(entry.contentBoxSize[0].inlineSize)}px`,
            height: `${Math.ceil(entry.contentBoxSize[0].blockSize)}px`,
          });
          // Everything that was read is removed from the Set
          frontNodesPlaceholderSet.delete(entry.target);
        }

        // If any letter was missing from the resizeObserver measurements, catch it here and read its size.
        if (frontNodesPlaceholderSet.size) {
          frontNodesPlaceholderSet.forEach((key) =>
            frontNodesSizesMap.set(key, {
              width: key.clientWidth,
              height: key.clientHeight,
            })
          );
        }

        // Update the container based on the size of the letters!
        // All the writes are grouped and updated in one go!
        lettersAndContainersMap.forEach((container, letter) => {
          const sizeObj = frontNodesSizesMap.get(letter);
          container.style.width = sizeObj.width;
          container.style.height = sizeObj.height;
        });
      };

      // Use a RAF for better performance on reads/writes and cancel the RAF via the ID
      // at the top of the observer to mitigate very fast updates.
      letterObserverRAF_ID.current = requestAnimationFrame(() => {
        updateContainerSize(entries);
        letterObserverRAF_ID.current = null;
      });
    });

    // The observe method must be initialized inside the effect and NOT in the react 19 ref callbacks because
    // when the ref is attached the effect has not ran yet and i dont have an observer!
    frontNodesRef.current.forEach((node, key) => {
      letterResizeObserverRef.current.observe(node);
    });
    return () => {
      letterResizeObserverRef.current.disconnect();
      letterResizeObserverRef.current = null;
    };
  }, []);

  ////// Set the Media Query List //////
  // At the top of the component a check is done with all of the MQLs to set the initial values of each state.
  // The mqls are responsible for changing the depth (protrusion based on how many copies of the same letter are rendered)
  //  of the letters, the width text-stroke and the svg container offset-path animation.

  // There is also the option to just include the MQLs inside the resize observer and check upon each resize event
  // but i dont know which one is more performant (check all the MQLs on every resize VS attaching eventListeners).

  useEffect(() => {
    // [0 - 600]
    const vw600 = window.matchMedia('(max-width: 37.5em)');
    // [601 - 1200]
    const vw1200 = window.matchMedia(
      '(min-width: 37.5625em) and (max-width: 75em)'
    );
    // [1201 - 1920]
    const vw1920 = window.matchMedia(
      '(min-width: 75.0625em) and (max-width: 120em)'
    );
    // [1921 - 2560]
    const vw2560 = window.matchMedia(
      '(min-width: 120.0625em) and (max-width: 160em)'
    );
    // [> 2561]
    const allElse = window.matchMedia('(min-width: 160.0625em)');
    const mqlAspectRatioOver = window.matchMedia('(min-aspect-ratio: 1 / 1)');
    const phoneLandscapeAndHeight500 = window.matchMedia(
      '(pointer: coarse) and (orientation: landscape) and (max-height: 31.25em)'
    );

    const pointerFine = window.matchMedia('(pointer: fine)');
    const motionOk = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    );

    // One Callback for all the viewport MQLs
    const mqlViewportCallback = () => {
      if (vw600.matches) {
        setProtrusionSize(9);
        setLetterTextStrokeWidth(2);
      } else if (vw1200.matches) {
        setProtrusionSize(13);
        setLetterTextStrokeWidth(2);
      } else if (vw1920.matches) {
        setProtrusionSize(17);
        setLetterTextStrokeWidth(4);
      } else if (vw2560.matches) {
        setProtrusionSize(21);
        setLetterTextStrokeWidth(4);
      } else if (allElse.matches) {
        setProtrusionSize(25);
        setLetterTextStrokeWidth(4);
      }
    };

    // Aspect Ratio and small screen based on aspect ratio
    const mqlAspectRatioCallback = () => {
      if (mqlAspectRatioOver.matches) {
        // Landscape
        setAspectRatioOver(true);
      } else {
        //Portrait
        setAspectRatioOver(false);

        // Max 600px
        if (vw600.matches) {
          setPortraitAndWidthOver600(false);
        } else {
          setPortraitAndWidthOver600(true);
        }
      }
    };

    // Phone on Landscape and its height not exceeding 500px
    const phoneLandscapeAndHeight500Callback = (e) => {
      if (e.matches) {
        setProtrusionSize(9);
      }
    };

    const mqlPointerCallback = (e) => {
      if (e.matches) {
        setPointerFine(true);
      } else {
        setPointerFine(false);
      }
    };

    const mqlMotionCallback = (e) => {
      if (e.matches) {
        setMotionOk(true);
      } else {
        setMotionOk(false);
      }
    };

    // Attach the listeners
    vw600.addEventListener('change', mqlViewportCallback);
    vw1200.addEventListener('change', mqlViewportCallback);
    vw1920.addEventListener('change', mqlViewportCallback);
    vw2560.addEventListener('change', mqlViewportCallback);
    allElse.addEventListener('change', mqlViewportCallback);
    mqlAspectRatioOver.addEventListener('change', mqlAspectRatioCallback);
    phoneLandscapeAndHeight500.addEventListener(
      'change',
      phoneLandscapeAndHeight500Callback
    );
    pointerFine.addEventListener('change', mqlPointerCallback);
    motionOk.addEventListener('change', mqlMotionCallback);

    // Cleanup
    return () => {
      vw600.removeEventListener('change', mqlViewportCallback);
      vw1200.removeEventListener('change', mqlViewportCallback);
      vw1920.removeEventListener('change', mqlViewportCallback);
      vw2560.removeEventListener('change', mqlViewportCallback);
      allElse.removeEventListener('change', mqlViewportCallback);
      mqlAspectRatioOver.removeEventListener('change', mqlAspectRatioCallback);
      phoneLandscapeAndHeight500.removeEventListener(
        'change',
        phoneLandscapeAndHeight500Callback
      );
      pointerFine.removeEventListener('change', mqlPointerCallback);
      motionOk.removeEventListener('change', mqlMotionCallback);
    };
  }, []);

  //////////////////////////// Animations ////////////////////////////

  ////// BUG /////
  // For some reason the animations are not getting removed according to animation.replaceState
  // The remove event doesn't fire either...
  // I have tried using a different empty component and in codepen.
  // Tested on both Chrome and Firefox
  // I have tried with the animate method and with creating constructors
  // The getAnimations() method both on the animated element and the document logs no animation
  // so they are getting removed from that point of view.

  ////// CAREFULL //////
  // Strict mode creates 2 animations due to effects running twice!

  //////// How to control the animations ///////

  /// animation.startTime ///

  // First of all, the document.timeline.currentTime  is used for controlling every aspect of an animation

  // The start time of an animation is null when the animation has not started, and is calculated like this
  // startTime = document.timeline.currentTime - (animation.currentTime * playbackRate)
  // Changing the startTime is a bad idea (explained bellow).

  // So adding a delay or controlling the timing of an animation can only be achieved with animation.currentTime
  // or using the animation.effect.updateTiming() method.

  // The startTime: if a positive value is set on the currentTime can be less than the document.timeline.currentTime
  // that happens for the animation to start its playback from a different point in its duration period

  // example:
  // animation.currentTime = 200
  // duration = 3000

  // current time in the document when hiting play() or animate()
  // document.timeline.currentTime = 2000

  // resulting in :
  // startTime = 1800, which is less than the currentTime that the document is at

  // if currentTime is set as a negative value(delay) the oposite happens
  // animation.currentTime = -200 >>> startTime = 2200

  /// conclusion ////
  // startTime plays a crucial role in the animations timing and should not be changed.

  ////// Adding delay dynamically after defining the timing options and keyframeEffect on an animation and calling the animate(). //////

  /// 1. currentTime aproach and the play() method///

  // When the play() method is called it resets the currentTime if animation.currentTime was set before the play()
  // If the currentTime is set after the play() there are no problems, so the play() method resets the timing to its default values
  // that were set when instatiating the animation or continuing from where the animation was paused.
  // If the effect.getComputedTiming() is called the localTime property reflects the real value of the currentTime

  // In order to add delay i can add a negative value to currentTime
  // In order to run the animation in a momment inside its duration for instance in the middle i give a positive value.

  /// 2. animation.effect.updateTiming() ///

  // This method can be called before play() to add a delay or set any of the timing properties of an animation
  // so it is the preffered method overall.

  ////// Opacity & 3D animations //////

  // Opacity cannot be set on an element with transform-style: preserve-3d because it breaks the 3d effect.
  // So i cannot set the opacity on the letter-box element. It's either the scene or each letter independetly.
  // https://css-tricks.com/things-watch-working-css-3d/

  // Whatever creates a stacking context breaks the 3d, opacity less that 1 creates a stacking context.

  useEffect(() => {
    // REVERSE ANIMATION
    //Starting state
    //Ending state

    // const motionOk = window.matchMedia(
    //   '(prefers-reduced-motion: no-preference)'
    // ).matches;
    // localStorage.setItem('home-animation-ran', false);
    //Check if animations can be played
    // Normal animations start here.

    ////////////////// How to reset SMIL Animations /////////////////
    // Based on the Smill animations spec, all the animate timing functions e.g begin, whether they are defined
    // as a sync-based or event-based or time relative value with or without a time offset defines that:
    // IF the time value can be calculated (resolved) it will be written down in the container timeline and cannot be changed
    // An exception to this is the value indefinite which is not resolvable until the beginElement() gets triggered
    // Bottom line is that if a time value gets resolved it is written down and cannot be changed.
    // So if i want to restart the animations or set some global-reset animate element which triggers other animate elements
    //  that reset the state of all the elements i care about, there is a chance that some time values that have already been written
    //   from the previously resolved sync-base values are defined to be played later in the timeline and even if i reset all my elements
    // those previously defined animations will be played nonetheless replacing everything that got reseted to their own values.

    // I can proggramatically change the dur of each object so i end its play state
    // or end each animation seperatly with an endElement() but that would require to access each animate element seperatly.
    // There are also some other options but there are limitations and a complexity that does not worth the investment.
    // Closed-cycles, the animation-sandwitch-model and the timeline that cannot be re-written (except if i remove the SVG element
    //  from the DOM and re-create it) are reasons to avoid implementing something that ends the animations with the end attribute
    // or some other way.

    // The easiest solution is to set the current time (setCurrentTime())of the SVG element itself which controls the timeline
    //  that affects all the animate elements and set it some distance into the future where all of the animate elements would
    // have finished their animation duration. Afterwards it is safe to reset the state of all elements into a starting position
    //  in order to replace the frozen animation and be ready to replay them.

    if (animationsPlayState !== 'running' || !motionOk) {
      /////////// Edge Case ///////////
      // By handling the checks this way if the user changes his preference over motion midway of the animations
      // play they wont cancel because the svg reset timers are not triggered because of the early return!
      return;
    }

    // Reset SVG container timmers only if the animations have been canceled.
    if (animationsCanceledRef.current) {
      // Get svg timmers and add 60 seconds.
      const svgStar = svgStarRef.current;
      const svgShadow = svgShadowRef.current;
      const svgButton = svgButtonRef.current;
      const starCurrTime = svgStar.getCurrentTime();
      const turblulenceCurrTime = svgShadow.getCurrentTime();
      const svgButtonTime = svgButton.getCurrentTime();
      svgStar.setCurrentTime(starCurrTime + 60);
      svgShadow.setCurrentTime(turblulenceCurrTime + 60);
      svgButton.setCurrentTime(svgButtonTime + 60);

      // Trigger all relative SVG animations with fill="freeze" into their starting states.
      animateGlobalResetRef.current.beginElement();

      // Reset the flag.
      animationsCanceledRef.current = false;
    }
    // Reset all of the relative element's attached attributes/properties to their "running" state.
    // This triggers even if its the first time animating but it's ok.
    beamAndBubbleContainerRef.current.dataset.display = 'true';
    glassContainerRef.current.dataset.display = 'true';
    svgShadowRef.current.dataset.display = 'true';
    svgButtonRectPlaceholderRef.current.dataset.display = 'false';
    mainSvgContainerRef.current.style.opacity = '0';
    setToggleGlassClassName(glass3dAnimationArgs.strokeState.empty);

    // DONT remove the whole style attribute!!!
    getMap(boxesRef).forEach((val) => val.style.removeProperty('transform'));
    getMap(containersRef).forEach((val) => {
      val.style.removeProperty('transform');
      val.style.removeProperty('opacity');
    });
    svgCowRef.current.style.removeProperty('opacity');

    // It's ok to remove the whole style attribute.
    cowEyeLeftRef.current.removeAttribute('style');
    cowEyeRightRef.current.removeAttribute('style');
    cowMouthBottomRef.current.removeAttribute('style');
    svgButtonRef.current.removeAttribute('style');
    getMap(svgButtonGroupedPathsRef).forEach((val) =>
      val.removeAttribute('style')
    );
    svgButtonRectBackRef.current.removeAttribute('style');

    ////////////////////////////////////////////////////////////////////////////

    const backgroundAnimation = async () => {
      console.log('backgroundAnim-fucntion');
      // Animate the clip along with the animation
      svgBubbleClipAnimateRef.current.beginElement();
      // Scales up and down the bubble
      const bubble = svgBubbleRef.current.animate(
        backgroundAnimationArgs.bubble.keyframes,
        backgroundAnimationArgs.bubble.options
      );
      // Scales the beam only in the Y-axis
      const beam = beamRef.current.animate(
        backgroundAnimationArgs.beam.keyframes,
        backgroundAnimationArgs.beam.options
      );
      await beam.finished;

      beamAndBubbleContainerRef.current.dataset.display = 'false';

      // Animates a custom property to change the (hsl)lightness of the color
      conicBackDarkRef.current.animate(
        backgroundAnimationArgs.conicBackDarkRef.keyframes,
        backgroundAnimationArgs.conicBackDarkRef.options
      );
      // Animates a custom property to change the angle of the conic gradient used as a mask image to reveal
      // the gradient.
      // The custom property is also inherited by the sibling in order to make the effect from left and right angles.
      const conicWrapperAnimation = conicWrapperRef.current.animate(
        backgroundAnimationArgs.conicMaskAngle.keyframes,
        backgroundAnimationArgs.conicMaskAngle.options
      );

      return conicWrapperAnimation;
    };

    // Animates all letters and returns the letter "S" animation
    const letterEntranceAnimations = () => {
      // star is running through the letters from 0% to 35% in its animation and the total duration is 6500ms
      // 35% of 6500 = 2275ms
      // 2275 / 7 (letters) = 325ms
      // the letters are offsetted equally 5% from each other and the star begins its animation 5% away from
      // the first letter
      const delayConstant = 325;

      let letter_S_animation = null;

      // Iterate over all letters and add iterations based on the letter and delay based on the order of the letter.
      for (let i = 0; i <= 6; i++) {
        // Left
        // Change the opacity of the letter "I" on the left side on apropriate timings.
        const leftAnimation = getMap(leftNodesRef)
          .get(i)
          .animate(
            letterAnimationArgs.leftSide.keyframes,
            letterAnimationArgs.leftSide.options
          );

        leftAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
          iterations: letterAnimationArgs.differentiateIterationsFn(i),
        });

        // Right
        // Change the opacity of the letter "I" on the right side on apropriate timings.
        const rightAnimation = getMap(rightNodesRef)
          .get(i)
          .animate(
            letterAnimationArgs.rightSide.keyframes,
            letterAnimationArgs.rightSide.options
          );

        rightAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
          iterations: letterAnimationArgs.differentiateIterationsFn(i),
        });

        // Box
        // Rotate the box that wraps around the letters and set it on its original position on the Z-axis.
        const boxAnimation = getMap(boxesRef)
          .get(i)
          .animate(
            letterAnimationArgs.boxEntrance.keyframesFn(protrusionSize),
            letterAnimationArgs.boxEntrance.options
          );

        boxAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
          iterations: letterAnimationArgs.differentiateIterationsFn(i),
        });

        // Get the "S" animation
        if (i === 6) {
          letter_S_animation = boxAnimation;
        }

        // Container
        // Scale the whole container and change its opacity with a delay when the star passes by each letter
        // Opacity must be changed here to satisfy the 3d animation rules of CSS.
        const containerAnimation = getMap(containersRef)
          .get(i)
          .animate(
            letterAnimationArgs.container.keyframes,
            letterAnimationArgs.container.options
          );
        containerAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
        });
        forwardsAnimRef.current.push(containerAnimation);
      }

      return letter_S_animation;
    };

    ////////////// BUG //////////////
    // >>>>This<<<< bugs out the star animation when the ending animations are getting attached.
    // I am running at 170hz screen, in the performance tab because the star is animating the offset and offset-distance
    // properties which are going in the main-thread, every tick for animating them is about 2.17ms total.

    // When the letterEnding animation function starts it takes 4.77ms to complete, and then i have another
    // task at 2.17ms that is from the star(propably...), so the star is running again but then i get 6 concurent dropped frames,
    // and no tasks are running in those, so i dont know why those frames are getting dropped and why the star animation stutters
    // since everything that gets animated from the letters goes to the compositor.

    //  I tried the requestAnimtionFrame() with the for loop and it alleviates it somehow but does not fix it.
    // Recursive requestAnimtionFrame() does the trick thought(almost), but the animations are created in seperate frames and maybe if the
    // refresh rate is less than mine like 60 fps the effect will be visible because the requestAnimationFrame() will fire
    // in bigger timing intervals.
    // So i will add delay dynamicaly with animation.currentTime, based on the timing of each frame concurently to each letter.

    /// Results ///
    // Logging the computedTiming throughout the animation everything works well BUT letters 2 and 3
    // are lagging behind 6ms from all other letters, while all the others are giving the same localTime value.
    // Tested with performance.now() and all works as excepted.
    // I dont know the reason for that happening and its weird behaviour...
    let countIteretions = 0;
    let initialFrameTime = 0;
    const endingAnimationDelay = 500;
    // RAF
    const letterEndingAnimations = (time) => {
      // >>>>This bugs out the star <<<<

      //   for (let i = 0; i <= 6; i++) {
      //     const boxAnimation = boxesMap
      //       .get(i)
      //       .animate(lettersBoxEndingKeyframes, lettersBoxEndingOptions);
      //     boxEndingAnimMap.set(i, boxAnimation);
      //     commitStyles(boxAnimation);
      //   }

      if (countIteretions === 0) {
        initialFrameTime = time;
      }

      const frameTimeDiff = time - initialFrameTime;
      const computedDelay = Math.round(endingAnimationDelay - frameTimeDiff); // Must be added as a negative value to currentTime

      if (countIteretions < 6) {
        const boxAnimation = getMap(boxesRef)
          .get(countIteretions)
          .animate(
            letterAnimationArgs.boxEnding.keyframesFn(protrusionSize),
            letterAnimationArgs.boxEnding.options
          );
        boxAnimation.currentTime = -computedDelay;
        countIteretions++;
        //
        forwardsAnimRef.current.push(boxAnimation);
        requestAnimationFrame(letterEndingAnimations);
      } else {
        const boxAnimation = getMap(boxesRef)
          .get(6)
          .animate(
            letterAnimationArgs.boxEnding.keyframesFn(protrusionSize),
            letterAnimationArgs.boxEnding.options
          );

        boxAnimation.currentTime = -computedDelay;
        //
        forwardsAnimRef.current.push(boxAnimation);
      }
    };

    // Animate the mainSvgContainer (star) and return the animation
    const mainSvgAnimation = () => {
      // Landscape Desktop
      let keyframes = svgAnimationArgs.containerDesktop.keyframes;
      let options = svgAnimationArgs.containerDesktop.options;
      if (!aspectRatioOver) {
        //  Portrait & Tablet
        if (portraitAndWidthOver600) {
          keyframes = svgAnimationArgs.containerPortraitTablet.keyframes;
          options = svgAnimationArgs.containerPortraitTablet.options;
        } else {
          // Phone
          keyframes = svgAnimationArgs.containerPhone.keyframes;
          options = svgAnimationArgs.containerPhone.options;
        }
      }
      mainSvgContainerRef.current.style.opacity = '1';
      const animation = mainSvgContainerRef.current.animate(keyframes, options);
      return animation;
    };
    // Variables for holding the callbacks of the nested listeners
    // And also used as flags in the cleanup of the effect to remove the listener itself
    // if the variables holds a value.
    let path10TransitionEndCallback = null;
    let path4TransitionEndCallback = null;
    let shadowDissapearEndEventCallback = null;
    let cowAppearEndEventCallback = null;

    // All elements that listeners attach to
    const path10 = getMap(glassPathsRef).get(10);
    const path4 = getMap(glassPathsRef).get(4);
    const shadowEyeAngryAnimate = shadowEyeAngryAnimateRef.current;
    const shadowDissapear = shadowTurblulenceDisplaceAnimRef.current;
    const cowAppear = cowDisplaceAnimateRef.current;

    //// 3 eventListeners nested one after the other ///

    // wait for the eyes to "to get angry"
    // wait for last path(10) of the glass cracking to end
    // wait for middlepoint path(4) to end the cracking and begin animating the shadow backwards

    // The two nested listeners have the flag once:'true' because they cant distinguish the half point
    // and the full point of the transition so if they are normally attached they retrigger when both transitions end.
    const shadowAngryEyeListenerCallback = () => {
      // After the eyes get angry begin the strokedash-offset transition to half
      setToggleGlassClassName(
        'home__svg-glass-transition-half home__svg-glass-transition-half--'
      );
      //  Path 10 is the last one transitioning
      //  Wait for the transition to end (half-point)
      path10TransitionEndCallback = () => {
        // Begin the full strokedash-offset transition
        setToggleGlassClassName(
          'home__svg-glass-transition-full home__svg-glass-transition-full--'
        );
        // Wait for the transition of path 4 to end this is almost midway of all the paths
        // that are transitioning
        path4TransitionEndCallback = async () => {
          //  Move the turbulence backwards in the Z-axis, rotate in the Y-axis
          // then move fast towards the screen and remove the blur when the glass is broken
          const shadowBreakGlassAnim = svgShadowRef.current.animate(
            svgAnimationArgs.shadowBreakGlass.keyframes,
            svgAnimationArgs.shadowBreakGlass.options
          );
          // Glass 3d animation
          for (let i = 0; i <= 43; i++) {
            const path = getMap(glassPathsRef).get(i);
            // Move the different paths of the glass svg in the Z-axis and rotate them differently on the X & Y axes
            // based on their position around the center of the glass with 2500 delay (half of the turbulence breaking the glass)
            const animation = path.animate(
              glass3dAnimationArgs.keyframesFn(homeGlassKeyframe3dValuesObj[i]),
              glass3dAnimationArgs.options
            );
            // 42 is the one that hits the center of the screen
            // when it finishes the animation remove the glass display entirely
            if (i === 42) {
              animation.onfinish = () => {
                glassContainerRef.current.dataset.display = 'false';
              };
            }
          }
          // Wait for the glass animation and then start the shaking
          await shadowBreakGlassAnim.finished;
          // Move the svg turbulence on the X and the Y axis with multiple iterations
          const shadowShakeAnimation = svgShadowRef.current.animate(
            svgAnimationArgs.shadowShake.keyframes,
            svgAnimationArgs.shadowShake.options
          );
          // Shaking steps and increased playback rate with each step
          // await shadowShakeAnimation.finished;
          shadowShakeAnimation.playbackRate = 1.5;
          shadowShakeAnimation.currentTime = 0;
          shadowShakeAnimation.play();
          await shadowShakeAnimation.finished;
          shadowShakeAnimation.playbackRate = 2;
          shadowShakeAnimation.currentTime = 0;
          shadowShakeAnimation.play();
          await shadowShakeAnimation.finished;
          shadowShakeAnimation.playbackRate = 2.5;
          shadowShakeAnimation.currentTime = 0;
          shadowShakeAnimation.play();
          await shadowShakeAnimation.finished;
          ////////////
          shadowTurblulenceDisplaceAnimRef.current.beginElement();
          shadowDissapearEndEventCallback = async () => {
            svgShadowRef.current.dataset.display = 'false';
            const cowOpacity = svgCowRef.current.animate(
              [
                {
                  opacity: '0',
                },
                {
                  opacity: '1',
                },
              ],
              { duration: 500, fill: 'forwards' }
            );
            forwardsAnimRef.current.push(cowOpacity);
            cowDisplaceAnimateRef.current.beginElement();

            cowAppearEndEventCallback = async () => {
              // Brings the ear backwards by rotating in the Y-axis and back to neutral position.
              // Used with iterations and combining it with alternate direction.
              cowEarLeftRef.current.animate(
                svgAnimationArgs.cowEarFlap.keyframes,
                { ...svgAnimationArgs.cowEarFlap.optionsFn(4), delay: 500 }
              );
              const cowLeftEyeAnim = cowEyeLeftRef.current.animate(
                svgAnimationArgs.cowEyeToNeutral.keyframes,
                { ...svgAnimationArgs.cowEyeToNeutral.options, delay: 500 }
              );
              forwardsAnimRef.current.push(cowLeftEyeAnim);
              // Wait for the eye animation and do the same for the right side.
              await cowLeftEyeAnim.finished;
              cowEarRightRef.current.animate(
                svgAnimationArgs.cowEarFlap.keyframes,
                svgAnimationArgs.cowEarFlap.optionsFn(4)
              );
              const cowRightEyeAnim = cowEyeRightRef.current.animate(
                svgAnimationArgs.cowEyeToNeutral.keyframes,
                svgAnimationArgs.cowEyeToNeutral.options
              );
              forwardsAnimRef.current.push(cowRightEyeAnim);

              await cowRightEyeAnim.finished;
              // Close the mouth by translating the group element responsible in the Y-axis
              const cowMouthBottomAnim = cowMouthBottomRef.current.animate(
                svgAnimationArgs.cowMouthClose.keyframes,
                svgAnimationArgs.cowMouthClose.options
              );
              forwardsAnimRef.current.push(cowMouthBottomAnim);
              await cowMouthBottomAnim.finished;

              ///// BUTTON /////
              // Translate on the Z axis the whole SVG wait at the given max point and then move
              // backwards to the default position.
              const svgButtonAnim = svgButtonRef.current.animate(
                svgButtonAnimationArgs.svgMoveBackwards.keyframes,
                svgButtonAnimationArgs.svgMoveBackwards.options
              );
              forwardsAnimRef.current.push(svgButtonAnim);
              // Animate the stroke-dash with a delay
              const strokeDashOffsetAnim = svgButtonRectBackRef.current.animate(
                svgButtonAnimationArgs.rectBackStrokeDashOffsetAndFillOpacity
                  .keyframes,
                svgButtonAnimationArgs.rectBackStrokeDashOffsetAndFillOpacity
                  .options
              );
              forwardsAnimRef.current.push(strokeDashOffsetAnim);
              const map = getMap(svgButtonGroupedPathsRef);
              // Starting from the letter 'O' which is at the leftmost side I give the biggest delay,
              // when that reaches the 'r' which is the middle letter and the starting point of the animation
              // the delay has reached 0. At that point I give a delay of 50ms as a starting point for the right side
              // letters to create a small gap in the timming of the letters appearing for each side.
              let delay = 500; // ms

              map.forEach((val, key) => {
                let animation = null;
                // Left letters
                if (key <= 4) {
                  animation = val.animate(
                    svgButtonAnimationArgs.elasticLetterLeft.keyframes,
                    svgButtonAnimationArgs.elasticLetterLeft.optionsFn(delay)
                  );
                  delay = delay - 100; // Decrease by 100ms.
                }
                // Middle
                else if (key === 5) {
                  animation = val.animate(
                    svgButtonAnimationArgs.elasticLetterLeft.keyframes,
                    svgButtonAnimationArgs.elasticLetterLeft.optionsFn(delay)
                  );
                  delay = 50; // Start at 50ms to create gap between the two sides.
                }
                // Right letters
                else {
                  animation = val.animate(
                    svgButtonAnimationArgs.elasticLetterRight.keyframes,
                    svgButtonAnimationArgs.elasticLetterRight.optionsFn(delay)
                  );
                  delay = delay + 100; // Increase by 100.
                }
                if (animation) forwardsAnimRef.current.push(animation);
              });
              // Wait for the stroke to animate and then start the SMIL animation of the "glass closing" after 0.2s.
              await strokeDashOffsetAnim.finished;
              svgButtonRectClipScaleUpAnimateRef.current.beginElementAt(0.2);

              // Wait for the button to go to its default state and then finish up.
              await svgButtonAnim.finished;
              // Enable the placeholder rect in the svg that controls the mouse events for the "glass".
              svgButtonRectPlaceholderRef.current.dataset.display = 'true';
              ////
              console.log(document.getAnimations());
              // After all the animations have finished the ones that have the fill:'forwards' flag are persisting.
              // So the animations need to get canceled and the styles must be commited for better performance.
              document.getAnimations().forEach((animation) => {
                const animationFill = animation.effect.getTiming().fill;
                const localAnimation = homeRef.current.contains(
                  animation.effect.target
                );

                const hasConicClassName =
                  animation.effect.target.classList.contains('home__conic');
                // Check if the animation is inside the component and if it has forwards fill and is not conic gradient
                if (
                  localAnimation &&
                  animationFill === 'forwards' &&
                  !hasConicClassName
                ) {
                  console.log(animation);
                  animation.commitStyles();
                  animation.cancel();
                }
              });
              // All animations have finished + canceled and the styles have been commited.
              // Empty the array
              forwardsAnimRef.current = [];
              // Change the animations play state
              setAnimationsPlayState('iddle');

              console.log(document.getAnimations());
            };
            // 4th level of depth
            cowAppear.addEventListener('endEvent', cowAppearEndEventCallback);
          };

          // 3rd level of depth
          shadowDissapear.addEventListener(
            'endEvent',
            shadowDissapearEndEventCallback
          );
        };
        // 2nd level of depth
        path4.addEventListener('transitionend', path4TransitionEndCallback, {
          once: 'true',
        });
      };
      // 1rst level of depth
      path10.addEventListener('transitionend', path10TransitionEndCallback, {
        once: 'true',
      });
    };

    // Event listener for the end event of the animate element that "makes the eyes angry"
    shadowEyeAngryAnimate.addEventListener(
      'endEvent',
      shadowAngryEyeListenerCallback
    );

    const playAllAnimations = async () => {
      if (shouldBackgroundAnimateRef.current === true) {
        const conicWrapperAnim = await backgroundAnimation();
        await conicWrapperAnim.finished;
        // Commit the styles here instead of the ending of all animations to prevent the bug of forwards filling animations.
        // This portion of the code is different and should not animate again if it has finished playing.
        // So if the animations are canceled this should NOT play again and also prevent it for losing the animaton
        // reference between re-renders!
        conicWrapperAnim.commitStyles();
        conicWrapperAnim.cancel();
        shouldBackgroundAnimateRef.current = false;
      }

      const starAnimation = mainSvgAnimation();
      const letter_S_animation = letterEntranceAnimations();
      // Wait for the S to finish the spin and then animate() the ending
      await letter_S_animation.finished;
      requestAnimationFrame(letterEndingAnimations);

      await starAnimation.finished;
      // After this all the other animations are triggered sequentially based on what happened to the animation before it
      // via the listeners that are declared above.
      starMorphShapeAnimateRef.current.beginElement();
    };

    playAllAnimations();

    const homeArticle = homeRef.current;

    // Cleanup
    return () => {
      if (animationsPlayState === 'running') {
        // Activate the flag that the animations got canceled.
        animationsCanceledRef.current = true;

        shadowEyeAngryAnimate.removeEventListener(
          'endEvent',
          shadowAngryEyeListenerCallback
        );
        // Conditionally remove the listener callbacks, because based on the timing of the re-rendering they may have not been
        // registered yet.
        if (path10TransitionEndCallback) {
          path10.removeEventListener(
            'transitionend',
            path10TransitionEndCallback,
            {
              once: 'true',
            }
          );
        }
        if (path4TransitionEndCallback) {
          path4.removeEventListener(
            'transitionend',
            path4TransitionEndCallback,
            {
              once: 'true',
            }
          );
        }
        if (shadowDissapearEndEventCallback) {
          shadowDissapear.removeEventListener(
            'endEvent',
            shadowDissapearEndEventCallback
          );
        }
        if (cowAppearEndEventCallback) {
          cowAppear.removeEventListener('endEvent', cowAppearEndEventCallback);
        }
        // Cancel all fill='forwards' animations independetly based on reference of the animation object itself.
        // Otherwise their reference is lost and they dont show up in the getAnimations() array!
        forwardsAnimRef.current.forEach((anim) => anim.cancel());
        forwardsAnimRef.current = [];

        // Cancel Animations that are running and are inside the home component
        // whenever one of the dependancies changes.

        // Don't cancel all conic specific animations if the background animation has allready been played
        if (shouldBackgroundAnimateRef.current === false) {
          document.getAnimations().forEach((animation) => {
            const localAnimation = homeArticle.contains(
              animation.effect.target
            );
            const hasConicClassName =
              animation.effect.target.classList.contains('home__conic');
            const hasConicWrapperClassName =
              animation.effect.target.classList.contains('home__conic-wrapper');

            if (
              localAnimation &&
              !hasConicClassName &&
              !hasConicWrapperClassName
            ) {
              animation.cancel();
            }
          });
        } else {
          // If the intro to the background is canceled due to resizing, then cancel everything except the conic animations that are
          // declared in the CSS.
          document.getAnimations().forEach((animation) => {
            const localAnimation = homeArticle.contains(
              animation.effect.target
            );
            const hasConicClassName =
              animation.effect.target.classList.contains('home__conic');
            if (localAnimation && !hasConicClassName) {
              animation.cancel();
            }
          });
        }
      }
    };
  }, [
    aspectRatioOver,
    protrusionSize,
    portraitAndWidthOver600,
    animationsPlayState,
    motionOk,
  ]);

  //////// IDDLE ////////
  useEffect(() => {
    let cowLevitateAnim = null;
    let cowEarFlapLeftAnim = null;
    let cowEarFlapRightAnim = null;
    let timeoutID = null;
    if (animationsPlayState === 'iddle') {
      // Display
      glassContainerRef.current.dataset.display = 'false';
      svgShadowRef.current.dataset.display = 'false';
      beamAndBubbleContainerRef.current.dataset.display = 'false';
      setToggleGlassClassName(glass3dAnimationArgs.strokeState.empty);
      // Background
      conicWrapperRef.current.style.setProperty(
        '--home-mask-gradient-angle',
        '180deg'
      );
      conicBackDarkRef.current.style.setProperty(
        '--home-conic-color-lightness',
        '5%'
      );
      // Letters
      getMap(containersRef).forEach((val) => (val.style.opacity = '1'));
      const zAxisOriginal = -((protrusionSize - 1) / 2);
      getMap(boxesRef).forEach((val) => {
        val.style.opacity = '1';
        val.style.transform = `translateZ(${zAxisOriginal}px) translateY(-20px) rotateX(20deg)`;
      });
      // Main SVG styles
      mainSvgContainerRef.current.style.opacity = '1';
      svgCowRef.current.style.opacity = '1';
      svgStarRef.current.style.opacity = '0';
      // Cow parts
      cowMouthBottomRef.current.style.transform = 'translateY(-50px)';
      cowEyeLeftRef.current.style.transform = 'translateX(0px) translateY(0px)';
      cowEyeRightRef.current.style.transform =
        'translateX(0px) translateY(0px)';

      // SVG Button
      svgButtonRef.current.style.opacity = '1';
      svgButtonRectPlaceholderRef.current.dataset.display = 'true';
      getMap(svgButtonGroupedPathsRef).forEach(
        (val) => (val.style.opacity = '1')
      );
      svgButtonRectBackRef.current.style.strokeDashoffset = '0';
      svgButtonRectBackRef.current.style.fillOpacity = '.4';
      svgButtonRectClipIddleStateAnimateRef.current.beginElement();

      /////////// Cow levitate & ear flap animations (infinite) ///////////
      // check users preference
      if (motionOk) {
        // Translates the cow on the Y-axis in alternate directions for infinity
        cowLevitateAnim = svgCowRef.current.animate(
          svgAnimationArgs.cowLevitate.keyframes,
          svgAnimationArgs.cowLevitate.options
        );

        // Rotates the ear on the Y-axis in alternate direction use with even amounts of repetitions.
        cowEarFlapLeftAnim = cowEarLeftRef.current.animate(
          svgAnimationArgs.cowEarFlap.keyframes,
          svgAnimationArgs.cowEarFlap.optionsFn(4)
        );
        cowEarFlapLeftAnim.pause();

        cowEarFlapRightAnim = cowEarRightRef.current.animate(
          svgAnimationArgs.cowEarFlap.keyframes,
          svgAnimationArgs.cowEarFlap.optionsFn(4)
        );
        cowEarFlapRightAnim.pause();
        // Min - Max values for interval timing and iterations of earl flapping
        const MIN_INTERVAL = 2500;
        const MAX_INTERVAL = 7000;
        const MIN_ITERATIONS = 4;
        const MAX_ITERATIONS = 6;

        // Function that takes min-max range values and produces a random delay and interval ratio of replaying
        // the ear flap animation by calling itself inside a timeout function.
        const repetition = () => {
          const randomDelay =
            Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;
          const randomIterations =
            Math.random() * (MAX_ITERATIONS - MIN_ITERATIONS) + MIN_ITERATIONS;

          cowEarFlapRightAnim.effect.updateTiming({
            iterations: randomIterations,
          });
          cowEarFlapLeftAnim.effect.updateTiming({
            iterations: randomIterations,
          });
          cowEarFlapLeftAnim.play();
          cowEarFlapRightAnim.play();
          // Store the ID for clearing the timeout when the animation play state changes !
          timeoutID = setTimeout(repetition, [randomDelay]);
        };
        repetition();
      }
    }

    return () => {
      if (cowLevitateAnim) {
        cowLevitateAnim.cancel();
      }
      if (cowEarFlapLeftAnim) {
        cowEarFlapLeftAnim.cancel();
      }
      if (cowEarFlapRightAnim) {
        cowEarFlapRightAnim.cancel();
      }
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [protrusionSize, animationsPlayState, motionOk]);

  //////// REVERSE ////////
  // This should only trigger from the animationsPlayState changing from 'iddle' to 'reverse' and that happens only if you click the button.
  useEffect(() => {
    if (animationsPlayState === 'reverse' && motionOk) {
      shouldBackgroundAnimateRef.current = true;
      // Reset SVG container timmers only if the animations have been canceled.
      // Reset both SVG timmers in order to keep them in sync.
      if (animationsCanceledRef.current) {
        // Get SVG timmers and add 60 seconds.
        const svgStar = svgStarRef.current;
        const svgShadow = svgShadowRef.current;
        const svgButton = svgButtonRef.current;
        const starCurrTime = svgStar.getCurrentTime();
        const turblulenceCurrTime = svgShadow.getCurrentTime();
        const svgButtonTime = svgButton.getCurrentTime();
        svgStar.setCurrentTime(starCurrTime + 60);
        svgShadow.setCurrentTime(turblulenceCurrTime + 60);
        svgButton.setCurrentTime(svgButtonTime + 60);

        // Reset the flag
        animationsCanceledRef.current = false;
      }

      const svgButtonDissapear = () => {
        const animation = svgButtonRef.current.animate(
          svgButtonAnimationArgs.svgDissapear.keyframes,
          svgButtonAnimationArgs.svgDissapear.options
        );
        reverseForwardsAnimRef.current.push(animation);
        return animation;
      };

      const cowStarArcAnimations = () => {
        const animation = svgCowRef.current.animate(
          [
            {
              opacity: 1,
            },
            { opacity: 0 },
          ],
          { duration: 750, fill: 'forwards' }
        );
        reverseForwardsAnimRef.current.push(animation);
        svgStarRef.current.style.opacity = '1';
        arcAnimateReverseRef.current.beginElement();
      };
      const mainSvgContainerReverseAnimation = () => {
        // Landscape Desktop
        let keyframes = svgAnimationArgs.containerDesktop.keyframes;
        let options = svgAnimationArgs.containerDesktop.options;
        if (!aspectRatioOver) {
          //  Portrait & Tablet
          if (portraitAndWidthOver600) {
            keyframes = svgAnimationArgs.containerPortraitTablet.keyframes;
            options = svgAnimationArgs.containerPortraitTablet.options;
          } else {
            // Phone
            keyframes = svgAnimationArgs.containerPhone.keyframes;
            options = svgAnimationArgs.containerPhone.options;
          }
        }

        const animation = mainSvgContainerRef.current.animate(
          keyframes,
          options
        );
        // Change the current time into a bigger value that duration to add delay!
        animation.currentTime = 8000;
        animation.updatePlaybackRate(-1);
        return animation;
      };

      const letterBoxesToInitialPosition = () => {
        // Letter Box bring them down
        getMap(boxesRef).forEach((val, key) => {
          const zAxisOriginal = -((protrusionSize - 1) / 2);

          const animation = val.animate(
            [
              {
                transform: `translateZ(${zAxisOriginal}px) translateY(0px) rotateX(0deg)`,
                offset: 0,
              },
              {
                transform: `translateZ(${zAxisOriginal}px) translateY(-20px) rotateX(20deg)`,
                offset: 1,
              },
            ],
            { ...letterAnimationArgs.boxEnding.options, fill: 'backwards' }
          );
          // Change the current time into a bigger value that duration to add delay!
          animation.currentTime = 1600 + 1200;
          animation.updatePlaybackRate(-1);
          reverseForwardsAnimRef.current.push(animation);
        });
      };
      const letterContainerDissapear = () => {
        // Container opacity

        // star is running through the letters from 0% to 35% in its animation and the total duration is 6500ms
        // 35% of 6500 = 2275ms
        // 2275 / 7 (letters) = 325ms
        // the letters are offsetted equally 5% from each other and the star begins its animation 5% away from
        // the first letter

        // 6500 +1500
        // Total time of animation 6500 subtract 325ms because of the star starting position from the first letter
        // Then calculate the dealy in reverse cause the forEach starts from the first letter plus add the delay of the
        // arc-moprh-in.
        const delayAcc = 325;
        let delayTime = 6175 + 1500;
        getMap(containersRef).forEach((val) => {
          const animation = val.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 1,
            delay: delayTime,
            fill: 'forwards',
          });
          delayTime = delayTime - delayAcc;
          reverseForwardsAnimRef.current.push(animation);
        });
      };

      const conicWrapperClose = () => {
        // ConicWrapper
        const animation = conicWrapperRef.current.animate(
          [
            {
              '--home-mask-gradient-angle': '180deg',
            },
            {
              '--home-mask-gradient-angle': '88deg',
            },
          ],
          { duration: 1000, fill: 'forwards' }
        );
        reverseForwardsAnimRef.current.push(animation);
        return animation;
      };

      const playAllAnimations = async () => {
        const svgButtonAnim = svgButtonDissapear();
        // await svgButtonAnim.finished;
        cowStarArcAnimations();
        const mainSvgContainerAnimation = mainSvgContainerReverseAnimation();
        letterBoxesToInitialPosition();
        letterContainerDissapear();
        await mainSvgContainerAnimation.finished;
        mainSvgContainerRef.current.style.opacity = '0';
        const conicWrapperCloseAnimation = conicWrapperClose();
        await conicWrapperCloseAnimation.finished;
        // After all the animations have finished the ones that have the fill:'forwards' flag are persisting.
        // So the animations need to get canceled and the styles must be commited for better performance.
        document.getAnimations().forEach((animation) => {
          const animationFill = animation.effect.getTiming().fill;
          const localAnimation = homeRef.current.contains(
            animation.effect.target
          );

          const hasConicClassName =
            animation.effect.target.classList.contains('home__conic'); // does not include conic-wrapper
          // Check if the animation is inside the component and if it has forwards fill and is not conic gradient
          if (
            localAnimation &&
            !hasConicClassName &&
            (animationFill === 'backwards' || animationFill === 'forwards')
          ) {
            console.log(animation);
            animation.commitStyles();
            animation.cancel();
          }
        });
        // All animations have finished + canceled and the styles have been commited.
        // Empty the array
        reverseForwardsAnimRef.current = [];
        setAnimationsPlayState('running');
      };
      /////////
      playAllAnimations();
      const homeArticle = homeRef.current;
      return () => {
        if (animationsPlayState === 'reverse') {
          animationsCanceledRef.current = true;
          // Cancel animation with fill
          reverseForwardsAnimRef.current.forEach((anim) => anim.cancel());
          reverseForwardsAnimRef.current = [];
          // Cancle all other animations that are inside the component except the conic
          document.getAnimations().forEach((animation) => {
            const localAnimation = homeArticle.contains(
              animation.effect.target
            );
            const hasConicClassName =
              animation.effect.target.classList.contains('home__conic');

            if (localAnimation && !hasConicClassName) {
              animation.cancel();
            }
          });
        }
      };
    }
  }, [
    aspectRatioOver,
    protrusionSize,
    portraitAndWidthOver600,
    animationsPlayState,
    motionOk,
  ]);

  // Cow eyes that follow the mouse
  useLayoutEffect(() => {
    // Check animations play state, if i have a pointing device and if the user has reduced motion enabled.
    if (animationsPlayState !== 'iddle' || !motionOk || !pointerFine) {
      return;
    }

    // Global object used for storing data from the observer and being used by the event listener.
    const sizeObj = {
      cx: 0, // Center point X of cow in the viewport
      cy: 0, // Center point Y of cow in the viewport
      homeW: 0, // Viewport Width
      homeH: 0, // Viewport Height
    };
    // Initialize the observer
    homeResizeObserverRef.current = new ResizeObserver((entries) => {
      // If i have RAF pending cancel it.
      if (homeObserverRAF_ID.current) {
        cancelAnimationFrame(homeObserverRAF_ID.current);
      }

      // Observer info used inside a RAF
      const updateDimensions = (entries) => {
        sizeObj.homeW = entries[0].contentRect.width;
        sizeObj.homeH = entries[0].contentRect.height;
      };

      // RAF is used because on top of the dimensions of the cow, I also need it's distance from the viewport edge
      // and as an observer entry i dont get that information, so a manual measurment is needed!
      homeObserverRAF_ID.current = requestAnimationFrame(() => {
        updateDimensions(entries);
        const cowRect = svgCowRef.current.getBoundingClientRect();

        // Find center point of the cow.
        // Distance from one side plus half of the width gives the center point (cx) in the viewport.
        const cx = cowRect.x + cowRect.width / 2;
        // Same for (cy)
        const cy = cowRect.y + cowRect.height / 2 - 70; // -70 because of the navbar height
        console.log('cow center', cx, cy);

        sizeObj.cx = cx;
        sizeObj.cy = cy;
        homeObserverRAF_ID.current = null;
      });
      console.log(sizeObj);
    });

    // RAF initialization flag
    let pendingRAF = false;
    const mousemoveCallback = (e) => {
      // Create inner function to hold the state of outter object with closure!
      const calcAngle = (sizeObj) => {
        const { cx, cy, homeW, homeH } = sizeObj;
        // Mouse position
        const mx = e.clientX;
        const my = e.clientY - 70; // -70 because of the navbar height
        // Distance between mouse and cow
        const dx = mx - cx;
        const dy = my - cy;

        // Finding the minimum range of the big system (viewport).
        // min = - abs(Center of cow - viewport width)
        const minX = cx - homeW;
        const minY = cy - homeH;

        ///////////// Linear Interpolation explanation /////////////

        // In order to interpolate the values from the big system (the cow and the viewport) to the small system
        // (the eyeball and the circle of the eye), I have to define the ranges [min,max] of the two different systems.
        // Because I am using SVG the transform property that I want to use although it is defined in px for the
        // inline style or CSS to take effect, it is actualy in viewport units!!!
        // After some testing I found that the [min,max] values of the small system must be [-25,25] for the eye
        // to stay inside the circle!
        // To find the [min,max] values of the bigger system I have to take the center of the cow and find  its left,right,top,bottom
        // distances from the viewport edges. In pracice and for the Linear Interpolation equation I just have to find
        // the min value and the actual width and height of the viewport gives the denominator of the equation [max-min].

        /*
         * ValueNew = MinNew + (ValueOld - MinOld) * (MaxNew - MinNew)
         *            ------------------------------------------------
         *                          MaxOld - MinOld
         */
        /*
         * normalized = -25 + (dx - centerX) * (25 - (-25))
         *            ------------------------------------------------
         *                          Width
         */
        const normalizeX = -25 + ((dx - -Math.abs(minX)) * 50) / homeW;
        const normalizeY = -25 + ((dy - -Math.abs(minY)) * 50) / homeH;

        const optimizedX = normalizeX.toFixed(2);
        const optimizedY = normalizeY.toFixed(2);

        // Throttle the RAF in response to the listener firing continuously.
        // Only schedule a new RAF if the old has been completed!
        if (!pendingRAF) {
          requestAnimationFrame(() => {
            cowEyeLeftRef.current.style.transform = `translate(${optimizedX}px, ${optimizedY}px) `;
            cowEyeRightRef.current.style.transform = `translate(${optimizedX}px, ${optimizedY}px) `;
            // RAF complete!
            pendingRAF = false;
          });
          // RAF scheduled!
          pendingRAF = true;
        }
      };
      calcAngle(sizeObj);
    };

    homeResizeObserverRef.current.observe(homeRef.current);
    window.addEventListener('mousemove', mousemoveCallback);

    return () => {
      if (homeResizeObserverRef.current) {
        homeResizeObserverRef.current.disconnect();
        homeResizeObserverRef.current = null;
        homeObserverRAF_ID.current = null;
        // If i have an observer i also have a listener.
        window.removeEventListener('mousemove', mousemoveCallback);
        // If they hold the new value (by re-rendering) I prefer it so the new element's style attribute
        // gets updated.
        cowEyeLeftRef.current.style.transform =
          'translateX(0px) translateY(0px)';
        cowEyeRightRef.current.style.transform =
          'translateX(0px) translateY(0px)';
      }
    };
  }, [animationsPlayState, motionOk, pointerFine]);

  // useEffect(() => {
  //   // if(animationsPlayState !=='iddle' || [])
  //   // check pointer device
  //   // resizeObserver for home and update the callback with the new values
  //   // Add checks to remove the listener when the animations happen!!!
  //   // Maybe upon reset i have to delete the style attribute afterwards!
  //   // Maybe fix the point where the mouse leaves the viewport

  //   // Measure home dimensions.
  //   const homeW = homeRef.current.clientWidth;
  //   const homeH = homeRef.current.clientHeight;

  //   // Find center point of the cow.
  //   const cowRect = svgCowRef.current.getBoundingClientRect();

  //   // Distance from one side plus half of the width gives the center point (cx) in the viewport.
  //   const cx = cowRect.x + cowRect.width / 2;
  //   // Same for (cy)
  //   const cy = cowRect.y + cowRect.height / 2 - 70; // -70 because of the navbar height
  //   console.log('cow center', cx, cy);
  //   // In order to interpolate the values from the big system (the cow and the viewport) to the small system
  //   // (the eyeball and the circle of the eye), I have to define the ranges [min,max] of the two different systems.
  //   // Because I am using SVG the transform property that I want to use although it is defined in px for the
  //   // inline style or CSS to take effect, it is actualy in viewport units!!!
  //   // After some testing I found that the [min,max] values of the small system must be [-25,25] for the eye
  //   // to stay inside the circle!
  //   // To find the [min,max] values of the bigger system I have to take the center of the cow and find  its left,right,top,bottom
  //   // distances from the viewport edges. In pracice and for the Linear Interpolation equation I just have to find
  //   // the min value and the actual width and height of the viewport gives the denominator of the equation [max-min].

  //   // min = - abs(Center of cow - viewport width)
  //   const centerX = cx - homeW;
  //   const centerY = cy - homeH;
  //   let pendingRAF = false;

  //   const calcAngle = (e) => {
  //     // Mouse position
  //     const mx = e.clientX;
  //     const my = e.clientY - 70; // -70 because of the navbar height
  //     // Distance between mouse and cow
  //     const dx = mx - cx;
  //     const dy = my - cy;
  //     /*
  //                       Linear Interpolation explanation

  //      * ValueNew = MinNew + (ValueOld - MinOld) * (MaxNew - MinNew)
  //      *            ------------------------------------------------
  //      *                          MaxOld - MinOld
  //      */
  //     /*
  //      * normalized = -25 + (dx - centerX) * (25 - (-25))
  //      *            ------------------------------------------------
  //      *                          Width
  //      */
  //     const normalizeX = -25 + ((dx - -Math.abs(centerX)) * 50) / homeW;
  //     const normalizeY = -25 + ((dy - -Math.abs(centerY)) * 50) / homeH;

  //     const optimizedX = normalizeX.toFixed(2);
  //     const optimizedY = normalizeY.toFixed(2);

  //     // Only schedule a new RAF if the old has been completed!
  //     if (!pendingRAF) {
  //       requestAnimationFrame(() => {
  //         cowEyeLeftRef.current.style.transform = `translate(${optimizedX}px, ${optimizedY}px) `;
  //         cowEyeRightRef.current.style.transform = `translate(${optimizedX}px, ${optimizedY}px) `;
  //         pendingRAF = false;
  //       });
  //       pendingRAF = true;
  //     }
  //   };
  //   window.addEventListener('mousemove', calcAngle);

  //   return () => window.removeEventListener('mousemove', calcAngle);
  // }, []);

  // The placeholder rect is responsible for handling mouse events since its the element
  // placed on top of all others and it has stroke & fill set to transparent so click events still
  // trigger through it!
  const handleReverseAnimationsClick = () => {
    if (animationsPlayState === 'iddle' && motionOk) {
      setAnimationsPlayState('reverse');
    }
  };
  // The whole SVG Button element is set to receive keyboard focus via tabindex and it is expected
  // to behave as a <button>. In order for that to happen "enter" and " " (space) should trigger the
  // button's operation.

  const handleReverseAnimationsKeypress = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      // Becomes disabled when motion is disabled and play state is not iddle.
      if (motionOk && animationsPlayState === 'iddle') {
        setAnimationsPlayState('reverse');
      }
    }
  };

  // useLayoutEffect(() => {
  //   const groupBox = groupRef.current.getBBox();

  //  // console.log(groupBox);
  //   const box = groupRef.current.getBBox();
  //   const clint = groupRef.current.getBoundingClientRect();
  //   console.log(box);
  //   console.log(clint);
  // }, []);

  // useEffect(() => {
  //   const keyframes = [
  //     { fillOpacity: 0 },
  //     { fillOpacity: 1 },
  //     { fillOpacity: 0 },
  //   ];

  //   const timing = { duration: 550 };

  //   circlePatternRef.current.animation = circlePatternRef.current.node.animate(
  //     keyframes,
  //     timing
  //   );
  //   circlePatternRef2.current.animation =
  //     circlePatternRef2.current.node.animate(keyframes, timing);
  //   circlePatternRef3.current.animation =
  //     circlePatternRef3.current.node.animate(keyframes, timing);
  //   circlePatternRef.current.animation.pause();
  //   circlePatternRef2.current.animation.pause();
  //   circlePatternRef3.current.animation.pause();

  //   circlePatternRef.current.animation.play();
  //   circlePatternRef.current.animation.onfinish = (e) => {
  //     circlePatternRef2.current.animation.play();
  //   };

  //   circlePatternRef2.current.animation.onfinish = (e) => {
  //     circlePatternRef3.current.animation.play();
  //   };

  //   circlePatternRef3.current.animation.onfinish = (e) => {
  //     circlePatternRef.current.animation.play();
  //   };
  // }, []);
  const playAnimations = async () => {
    // DIORTHOSE TA DEKADIKA STA ANIMATION ME TA MATIA EINAI POLLA KAI SKEPSOU MHPWS TO VALEIS
    // ADI GIA TRANSFORM NA KANEI CX KAI CY APO TO CIRCLE TOY SVG
    svgCowRef.current.animate(
      svgAnimationArgs.cowLevitate.keyframes,
      svgAnimationArgs.cowLevitate.options
    );
  };

  const cancelAnimations = async () => {
    const leftEar = cowEarLeftRef.current.animate(
      svgAnimationArgs.cowEarFlap.keyframes,
      svgAnimationArgs.cowEarFlap.optionsFn(4)
    );
    leftEar.pause();
    const rightEar = cowEarRightRef.current.animate(
      svgAnimationArgs.cowEarFlap.keyframes,
      svgAnimationArgs.cowEarFlap.optionsFn(4)
    );
    rightEar.pause();
    const MIN_INTERVAL = 2500; // Minimum delay: 0.5 seconds
    const MAX_INTERVAL = 7000; // Maximum delay: 3.0 seconds
    const MIN_ITERATIONS = 4; // Minimum delay: 0.5 seconds
    const MAX_ITERATIONS = 8; // Maximum delay: 3.0 seconds
    const repetition = () => {
      const randomDelay =
        Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;
      const randomIterations =
        Math.random() * (MAX_ITERATIONS - MIN_ITERATIONS) + MIN_ITERATIONS;
      // leftEar.currentTime = 0;
      // rightEar.currentTime = 0;
      rightEar.effect.updateTiming({ iterations: randomIterations });
      leftEar.effect.updateTiming({ iterations: randomIterations });
      leftEar.play();
      rightEar.play();
      testRef.current = setTimeout(repetition, [randomDelay]);
    };
    repetition();
  };

  const reverseAnimations = async () => {
    setAnimationsPlayState('reverse');
  };

  const hello = async () => {
    clearTimeout(testRef.current);
  };

  ////// Arc //////
  // Calulate the vector points on the perimeter of the circle based on the angle
  // x = Ox + r * cos(θ)
  // y = Oy + r * sin(θ) (reversed Y axis & counter-clockwise angle direction)

  const arcX = (angle) =>
    (500 + 488 * Math.cos(angle * (Math.PI / 180))).toFixed(4); // Reduce some of the output size
  const arcY = (angle) =>
    (500 + 488 * Math.sin(angle * (Math.PI / 180))).toFixed(4);

  // Memoize the return value
  const memoArcValues = useMemo(() => {
    const calcArcValues = (precision, minAngle, maxAngle) => {
      //Precision of 1 adds a lot of size on the file, but also adds smooth transition
      // 2 and more the arc jiggles so i will take the extra size.
      ///// IMPORTANT /////
      // With precision > 1 the point where the arc passes the 180deg mark and changes from big to small arc must
      // be handled smoothly in order for the browser to interpolate the values correctly.
      // That means adding one by one the degrees from that point until the next step in the loop
      // based on the precision provided and also creating custom keyTimes to maintain the linear animation
      // because the values would have added extra steps inside the "values" attribute.
      let deg = minAngle;

      // Builds up as the loop progresses
      let str = `M 988 500 A 488 488 0 1 0 ${arcX(minAngle)} ${arcY(
        minAngle
      )} L 500 500 Z;`;
      while (deg <= maxAngle) {
        if (deg < 180) {
          str = `${str} M 988 500 A 488 488 0 1 0 ${arcX(deg)} ${arcY(
            deg
          )} L 500 500 Z;`;
        } else {
          str = `${str} M 988 500 A 488 488 0 0 0 ${arcX(deg)} ${arcY(
            deg
          )} L 500 500 Z;`;
        }
        // Increase the loop step
        deg = deg + precision;
      }
      return str;
    };
    return calcArcValues(1, 0.2, 360);
  }, []);

  const memoReversedArcValues = useMemo(() => {
    const calcReversedArcValues = memoArcValues
      .split(';')
      .slice(0, -1)
      .reverse()
      .map((item) => item + ';')
      .join('');
    return calcReversedArcValues;
  }, [memoArcValues]);

  // Create a stable memoized function for the ref callback
  // In React 19+ if you include the cleanup with the return keyword, then you always get a node reference
  // even in the cleanup (its the deleted node at this point from the previous render).
  // Also the ref does not give a null value for the node as it cycles between re-renders.

  const frontNodesStableRef = useCallback((node) => {
    const observer = letterResizeObserverRef.current;
    if (observer) {
      // On the first render the observer has not been initialized yet because
      // the effect runs after the nodes have been attached to the ref.
      // So the observe method is ran in the effect once upon mount for this case
      // Since the ref is stable i do not need this but its good to have for edge cases
      observer.observe(node);
    }
    const map = getMap(frontNodesRef);
    const index = Number(node.dataset.index);
    map.set(index, node);
    return () => {
      if (observer) {
        // Here the observer has been initialized but a check is done for edge cases
        // Also the observer disconnects when the component unmounts and the ref is stable so this portion
        // only runs once when the component unmounts and on strict mode once.
        observer.unobserve(node);
      }
      const index = Number(node.dataset.index);
      map.delete(index);
    };
  }, []);
  const letterContainerStableRef = useCallback((node) => {
    const map = getMap(containersRef);
    const index = Number(node.dataset.index);
    map.set(index, node);

    return () => {
      const index = Number(node.dataset.index);
      map.delete(index);
    };
  }, []);

  // Same logic with frontNodes
  const homeStableRef = useCallback((node) => {
    const observer = homeResizeObserverRef.current;
    if (observer) {
      observer.observe(node);
    }
    homeRef.current = node;
    return () => {
      if (observer) {
        observer.unobserve(node);
      }
      homeRef.current = null;
    };
  }, []);
  const svgCowStableRef = useCallback((node) => {
    const observer = homeResizeObserverRef.current;
    if (observer) {
      observer.observe(node);
    }
    svgCowRef.current = node;
    return () => {
      if (observer) {
        observer.unobserve(node);
      }
      svgCowRef.current = null;
    };
  }, []);

  const moovies = ['M', 'O', 'O', 'V', 'I', 'E', 'S'];

  return (
    <article ref={homeStableRef} className='home'>
      <button
        id='test_button_3'
        style={{ position: 'absolute', left: '200px', zIndex: '10' }}
        onClick={hello}>
        hello
      </button>
      <button
        style={{ position: 'absolute', left: '20px', zIndex: '10' }}
        onClick={playAnimations}>
        play
      </button>
      <button
        id='test_button_2'
        style={{ position: 'absolute', left: '80px', zIndex: '10' }}
        onClick={cancelAnimations}>
        cancel
      </button>
      <button
        ref={btnRef}
        id='test_button_4'
        style={{ position: 'absolute', left: '160px', zIndex: '10' }}
        onClick={reverseAnimations}>
        reverse
      </button>
      <button
        style={{
          position: 'absolute',
          left: '160px',
          top: '40%',
          zIndex: '10',
        }}
        onClick={() => {}}>
        true/false
      </button>
      <h1 className='home__title'>
        {moovies.map((letter, index) => (
          <span
            ref={letterContainerStableRef}
            key={index}
            data-index={index}
            className={`home__curved-3d home__curved-3d--${index + 1}`}>
            <span
              style={{
                '--_protrusionSize': `${protrusionSize}`,
                '--_letterTextStrokeWidth': `${letterTextStrokeWidth}`,
              }}
              ref={(node) =>
                node
                  ? getMap(boxesRef).set(index, node)
                  : getMap(boxesRef).delete(index)
              }
              className='home__letters-box'>
              {/* Render the middle letters which are the thickness (depth) of the animation.
                Take note in what viwport width i am at and render the appropriate number and always take account of the 0 px point
                which means if i want a depth of 20px total i will render 19 middle letters from -9px to +9px and position them on Z axis  */}
              <span
                aria-hidden='true'
                className='home__letter home__letter--back'>
                {letter}
              </span>

              {[...Array(protrusionSize - 2).keys()].map((n, i, arr) => {
                {
                  /* arr.length is an odd number so i first round it and then subtract it from the current array(n) value i am at in order to 
                  get correct translation values */
                }
                const zPosition = n - Math.floor(arr.length / 2);

                return (
                  <span
                    aria-hidden='true'
                    key={n}
                    className='home__letter home__letter--middle'
                    style={{ transform: `translateZ(${zPosition}px)` }}>
                    {letter}
                  </span>
                );
              })}
              <span
                ref={(node) =>
                  node
                    ? getMap(leftNodesRef).set(index, node)
                    : getMap(leftNodesRef).delete(index)
                }
                aria-hidden='true'
                className={`home__letter home__letter--left home__letter--left-${
                  index + 1
                }`}>
                I
              </span>
              <span
                ref={(node) =>
                  node
                    ? getMap(rightNodesRef).set(index, node)
                    : getMap(rightNodesRef).delete(index)
                }
                aria-hidden='true'
                className={`home__letter home__letter--right home__letter--right-${
                  index + 1
                }`}>
                I
              </span>
              <span
                ref={frontNodesStableRef}
                data-index={index}
                className='home__letter home__letter--front'>
                {letter}
              </span>
            </span>
          </span>
        ))}
      </h1>
      <div ref={mainSvgContainerRef} className='home__main-svg-container'>
        <svg
          ref={svgStarRef}
          className='home__svg-star'
          viewBox='0 0 1000 1000'
          xmlSpace='preserve'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid meet'>
          <defs>
            <radialGradient id='home_star_gradient_fill'>
              <stop offset='0%' stopColor='hsl(165, 90.30%, 48.40%)' />
              <stop offset='50%' stopColor='hsl(165, 77.70%, 50.80%)' />
              <stop offset='100%' stopColor='hsl(164, 100.00%, 58.00%)' />
            </radialGradient>
          </defs>
          <path
            opacity='1'
            fill='hsl(175, 82%, 65%)'
            stroke='none'
            strokeWidth='2'
            d='M617.1 821.38c45.02 19.53 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-15.07-89.13-21.59-133.86-6.43-44.13-19.16-116.61-17.27-132.69 1.87-15.83 65.5-72.27 99.03-107.68 30.06-31.75 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-95.72-14.94-143.52-22.79-44.13-7.24-101.2-11.63-132.25-22.43-5.13-1.78-42.19-87.16-64.5-130.13-21.5-41.37-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-44.73 78.4-66.2 118.1-22.88 42.33-29.7 53.17-66.69 128.02-1.86 3.75-88.5 15.13-132.81 22.38-47.8 7.83-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 66.1 65.13 97.67 99.1 32.31 34.77 89.76 82.01 93.85 107.11 3.09 18.98-10.12 86.76-16.32 129.98-6.4 44.74-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 90.76-44.92 136.37-66.9 39.52-19.04 99.23-57.03 118.95-56.3 18.94.71 82 36.82 118.96 56.3z'>
            <animate
              ref={animateGlobalResetRef}
              id='home_animate_global_reset'
              begin='indefinite'
              dur='0.001s'></animate>
            <animate
              ref={animateGlobalReverseRef}
              id='home_animate_global_reverse'
              begin='indefinite'
              dur='0.001s'></animate>
            <animate
              ref={animateGlobalReverseResetRef}
              id='home_animate_global_reverse_reset'
              begin='indefinite'
              dur='0.001s'></animate>
            <animate
              ref={starMorphShapeAnimateRef}
              id='home_svg_star_to_circle_anim'
              attributeType='XML'
              attributeName='d'
              dur='2.5s'
              begin='indefinite'
              calcMode='spline'
              restart='whenNotActive'
              fill='freeze'
              keySplines='0 0 1 1; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0;'
              keyTimes='0; .40; .46; .52; .58; .64; .70; .76; .82; .88; .94; 1'
              values='M617.1 821.38c45.02 19.53 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-15.07-89.13-21.59-133.86-6.43-44.13-19.16-116.61-17.27-132.69 1.87-15.83 65.5-72.27 99.03-107.68 30.06-31.75 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-95.72-14.94-143.52-22.79-44.13-7.24-101.2-11.63-132.25-22.43-5.13-1.78-42.19-87.16-64.5-130.13-21.5-41.37-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-44.73 78.4-66.2 118.1-22.88 42.33-29.7 53.17-66.69 128.02-1.86 3.75-88.5 15.13-132.81 22.38-47.8 7.83-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 66.1 65.13 97.67 99.1 32.31 34.77 89.76 82.01 93.85 107.11 3.09 18.98-10.12 86.76-16.32 129.98-6.4 44.74-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 90.76-44.92 136.37-66.9 39.52-19.04 99.23-57.03 118.95-56.3 18.94.71 82 36.82 118.96 56.3z;
M617.1 821.38c49.14-12.19 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-46.17-95.93-21.59-133.86 34.19-52.74 161.91-1.65 182.18-48.62 23.69-54.89-111.75-120.5-100.42-191.75 7.06-44.45 67.38-61.77 96.64-94.28 22.47-22.77 20.12-40.49-12.8-47.96-47.56-9.24-118.29 17.44-148.6-22.45-37.84-49.77 66.5-144.76 22.64-186.18-39.8-37.58-153.6 67.46-219.4 33.62-43.17-22.2-42.37-89.93-65.78-129.97-15.94-26.68-30.35-13.48-42.82 6.93-11.62 19.03-23.12 107.87-67.2 125.2-60.25 23.67-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.13-78.69 136.37-66.9 65.26 15.63 95.19 161.27 120.98 160.92 34.48-.47 52.57-144.95 116.93-160.92z;
M617.1 821.38c49.14-12.19 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-46.17-95.93-21.59-133.86 34.19-52.74 161.91-1.65 182.18-48.62 23.69-54.89-111.75-120.5-100.42-191.75 7.06-44.45 67.38-61.77 96.64-94.28 22.47-22.77 20.12-40.49-12.8-47.96-47.56-9.24-118.29 17.44-148.6-22.45-37.84-49.77 68.49-146.96 22.64-186.18-38.79-33.18-96.41-67.7-145.97-84.46-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.13-78.69 136.37-66.9 65.26 15.63 95.19 161.27 120.98 160.92 34.48-.47 52.57-144.95 116.93-160.92z;
M617.1 821.38c49.14-12.19 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-46.17-95.93-21.59-133.86 34.19-52.74 161.91-1.65 182.18-48.62 23.69-54.89-111.98-120.53-100.42-191.75 7.66-47.21 74.86-66.35 103.34-99.54 13.38-15.6 4.52-44.19-1.8-58.49-11.32-25.67-22.18-57.05-56.25-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.13-78.69 136.37-66.9 65.26 15.63 95.19 161.27 120.98 160.92 34.48-.47 52.57-144.95 116.93-160.92z;
M617.1 821.38c49.14-12.19 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-46.25-95.98-21.59-133.86 34.53-53.02 163.35-1.17 183.62-48.14 23.68-54.89 33.51-153.11 33.55-189.36.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.13-78.69 136.37-66.9 65.26 15.63 95.19 161.27 120.98 160.92 34.48-.47 52.57-144.95 116.93-160.92z;
M617.1 821.38c49.14-12.19 105 58.25 136.37 66.9 31.37 8.64 38.78-3.25 56.83-17.04 22.67-17.32 51.69-45.82 76.98-81.7 25.3-35.88 45.16-75.82 65.43-122.79 23.69-54.88 31.6-149.28 31.64-185.53.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.13-78.69 136.37-66.9 65.26 15.63 95.19 161.27 120.98 160.92 34.48-.47 52.57-144.95 116.93-160.92z;
M638.63 962.53c46.22-12.16 97.34-40.79 119.14-53.68 21.8-12.89 34.48-23.82 52.53-37.6 22.67-17.33 51.69-45.83 76.98-81.71 25.3-35.88 45.16-75.82 65.43-122.79 23.69-54.88 31.6-149.28 31.64-185.53.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.13-78.69 136.37-66.9C444.45 837.01 474.38 982 500.17 982.3c40.7.5 92.24-7.6 138.46-19.77z;
M638.63 962.53c46.22-12.16 97.34-40.79 119.14-53.68 21.8-12.89 34.48-23.82 52.53-37.6 22.67-17.33 51.69-45.83 76.98-81.71 25.3-35.88 45.16-75.82 65.43-122.79 23.69-54.88 31.6-149.28 31.64-185.53.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-117.4 162.13-96.64 201.17 20.36 38.29 150.56-3.7 182.3 50.81 20.56 35.33-23.73 74.55-29.71 118.97-5.45 33.25 11.67 40.64 24.77 51 13.1 10.38 70.99 40.94 128.24 59.43 57.25 18.5 113.85 18.98 139.64 19.3 40.7.48 92.24-7.61 138.46-19.78z;
M638.63 962.53c46.22-12.16 97.34-40.79 119.14-53.68 21.8-12.89 34.48-23.82 52.53-37.6 22.67-17.33 51.69-45.83 76.98-81.71 25.3-35.88 45.16-75.82 65.43-122.79 23.69-54.88 31.6-149.28 31.64-185.53.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-33.5 25.5-14.68 46.09 53.3 58.33 91.65 54.76 99.36 101.46 12.1 73.4-115.23 161.06-96.64 201.17 17.97 38.77 41.3 91.06 71.76 125.93 30.46 34.88 44.91 48.91 68.87 67.78 24.91 19.61 23.63 16.71 36.73 27.08 13.1 10.37 70.99 40.93 128.24 59.42 57.25 18.5 113.85 18.98 139.64 19.3 40.7.48 92.24-7.61 138.46-19.78z;
M638.63 962.53c46.22-12.16 97.34-40.79 119.14-53.68 21.8-12.89 34.48-23.82 52.53-37.6 22.67-17.33 51.69-45.83 76.98-81.71 25.3-35.88 45.16-75.82 65.43-122.79 23.69-54.88 31.6-149.28 31.64-185.53.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-150.2-89.91-183.76-62.8-35.62 28.76 32.95 161.18-15.75 213.2-33.4 35.7-97.66 11.03-145.22 20.42-32.22 5.93-20.96 6.5-33.34 35.08-10.07 23.26-16.77 73.47-18.35 132.09-1.57 58.62 22.58 146.22 39.73 183.46 17.88 38.81 41.3 89.15 71.76 124.02 30.46 34.88 44.91 48.91 68.87 67.78 24.91 19.61 23.63 16.71 36.73 27.08 13.1 10.37 70.99 40.93 128.24 59.42 57.25 18.5 113.85 18.98 139.64 19.3 40.7.48 92.24-7.61 138.46-19.78z;
M638.63 962.53c46.22-12.16 97.34-40.79 119.14-53.68 21.8-12.89 34.48-23.82 52.53-37.6 22.67-17.33 51.69-45.83 76.98-81.71 25.3-35.88 45.16-75.82 65.43-122.79 23.69-54.88 31.6-149.28 31.64-185.53.04-36.25-14.92-93.98-16.76-105.28-2.5-15.4-10.8-41.32-17.1-55.62-11.33-25.67-22.19-57.05-56.26-101.87-34.08-44.83-41.56-52.7-87.41-91.93-38.79-33.18-96.41-66.73-145.97-83.5-49.57-16.76-89.27-25.7-140.56-28.47-29.6-1.6-29.67.73-42.14 21.14-11.63 19.03-22 109.76-66.53 127.57-60.11 24.03-147.56-86.27-183.76-62.8-38.5 24.93-65.13 43.03-103.8 90.71-38.65 47.69-62.25 98.11-75.36 132.39-11.7 30.6-10.42 24.68-17.06 46.56-7.36 24.26-14.86 72.51-16.44 131.13-1.57 58.62 22.58 146.22 39.73 183.46 17.88 38.81 41.3 89.15 71.76 124.02 30.46 34.88 44.91 48.91 68.87 67.78 24.91 19.61 23.63 16.71 36.73 27.08 13.1 10.37 70.99 40.93 128.24 59.42 57.25 18.5 113.85 18.98 139.64 19.3 40.7.48 92.24-7.61 138.46-19.78z;
M656.34 958.07c50.07-18.57 89.9-41.07 108.63-52.88 18.73-11.8 35.9-26.41 43.42-30.95 20.84-12.6 71.3-70.62 88.04-95.3 16.73-24.66 57.7-103.97 67.96-139.6 8.07-27.99 18.87-117.46 20.9-148.21 2.02-30.75-10.98-91.11-14.56-107.62-5.67-26.17-9.66-34.69-17.99-59.92-8.7-26.36-24.93-55.55-45.4-87.07-20.48-31.52-57.74-75.93-98.45-110.77-15.3-13.09-80.89-56.86-128.64-76.61-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-110.28 38.57-150.94 69.97-17.26 13.34-78.18 55.48-112.83 107.02C77.32 258.29 59.8 287.5 47.6 323.59c-9.45 27.96-13.17 33.47-17.38 50.82-4.3 17.7-17.77 81.83-15.34 128.88 2.43 47.04 12.4 122.57 30.7 164.58 7.67 17.63 41.84 96.62 80.67 141.53 38.83 44.9 31.96 37.5 66.38 66.19 15.53 12.94 28.9 22.1 40.04 30.28 11.15 8.18 84.48 48.02 141.1 62.35 56.63 14.33 97.56 15.51 117.28 16.25 18.93.7 115.23-7.83 165.3-26.4z
                '></animate>
            <animate
              attributeType='CSS'
              attributeName='opacity'
              dur='.001s'
              begin='home_svg_star_to_circle_anim.end;home_svg_star_arc_morph_in.begin;'
              fill='freeze'
              from='0'
              to='0'></animate>
            {/* Global Reset Starting State */}
            <animate
              attributeType='CSS'
              attributeName='opacity'
              dur='.001s'
              begin='home_animate_global_reset.begin;home_svg_star_arc_morph_in.end;'
              fill='freeze'
              from='1'
              to='1'></animate>
            <animate
              attributeType='XML'
              attributeName='d'
              dur='0.001s'
              begin='home_animate_global_reset.begin'
              fill='freeze'
              values='M617.1 821.38c45.02 19.53 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-15.07-89.13-21.59-133.86-6.43-44.13-19.16-116.61-17.27-132.69 1.87-15.83 65.5-72.27 99.03-107.68 30.06-31.75 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-95.72-14.94-143.52-22.79-44.13-7.24-101.2-11.63-132.25-22.43-5.13-1.78-42.19-87.16-64.5-130.13-21.5-41.37-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-44.73 78.4-66.2 118.1-22.88 42.33-29.7 53.17-66.69 128.02-1.86 3.75-88.5 15.13-132.81 22.38-47.8 7.83-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 66.1 65.13 97.67 99.1 32.31 34.77 89.76 82.01 93.85 107.11 3.09 18.98-10.12 86.76-16.32 129.98-6.4 44.74-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 90.76-44.92 136.37-66.9 39.52-19.04 99.23-57.03 118.95-56.3 18.94.71 82 36.82 118.96 56.3z;'></animate>
            {/* Reverse Animation */}
            <animate
              id='home_svg_circle_to_star'
              attributeType='XML'
              attributeName='d'
              dur='.4s'
              begin='home_svg_star_arc_morph_in.end;'
              fill='freeze'
              calcMode='spline'
              keySplines='0.7 0.1 .84 0.1;'
              keyTimes='0; 1'
              values='M656.34 958.07c50.07-18.57 89.9-41.07 108.63-52.88 18.73-11.8 35.9-26.41 43.42-30.95 20.84-12.6 71.3-70.62 88.04-95.3 16.73-24.66 57.7-103.97 67.96-139.6 8.07-27.99 18.87-117.46 20.9-148.21 2.02-30.75-10.98-91.11-14.56-107.62-5.67-26.17-9.66-34.69-17.99-59.92-8.7-26.36-24.93-55.55-45.4-87.07-20.48-31.52-57.74-75.93-98.45-110.77-15.3-13.09-80.89-56.86-128.64-76.61-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-110.28 38.57-150.94 69.97-17.26 13.34-78.18 55.48-112.83 107.02C77.32 258.29 59.8 287.5 47.6 323.59c-9.45 27.96-13.17 33.47-17.38 50.82-4.3 17.7-17.77 81.83-15.34 128.88 2.43 47.04 12.4 122.57 30.7 164.58 7.67 17.63 41.84 96.62 80.67 141.53 38.83 44.9 31.96 37.5 66.38 66.19 15.53 12.94 28.9 22.1 40.04 30.28 11.15 8.18 84.48 48.02 141.1 62.35 56.63 14.33 97.56 15.51 117.28 16.25 18.93.7 115.23-7.83 165.3-26.4z;
M617.1 821.38c45.02 19.53 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-15.07-89.13-21.59-133.86-6.43-44.13-19.16-116.61-17.27-132.69 1.87-15.83 65.5-72.27 99.03-107.68 30.06-31.75 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-95.72-14.94-143.52-22.79-44.13-7.24-101.2-11.63-132.25-22.43-5.13-1.78-42.19-87.16-64.5-130.13-21.5-41.37-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-44.73 78.4-66.2 118.1-22.88 42.33-29.7 53.17-66.69 128.02-1.86 3.75-88.5 15.13-132.81 22.38-47.8 7.83-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 66.1 65.13 97.67 99.1 32.31 34.77 89.76 82.01 93.85 107.11 3.09 18.98-10.12 86.76-16.32 129.98-6.4 44.74-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 90.76-44.92 136.37-66.9 39.52-19.04 99.23-57.03 118.95-56.3 18.94.71 82 36.82 118.96 56.3z;
                '></animate>
          </path>
          {/* Arc */}
          <path
            stroke='none'
            fill='hsl(175, 82%, 65%)'
            strokeWidth='.5'
            strokeLinejoin='round'>
            <animate
              id='home_svg_star_arc_opacity'
              attributeType='CSS'
              attributeName='opacity'
              dur='.001s'
              begin='home_svg_star_to_circle_anim.end;home_svg_star_arc_morph_in.begin;'
              fill='freeze'
              from='1'
              to='1'></animate>
            {/* Line-through arc*/}
            <animate
              id='home_svg_star_arc_line_extend_anim'
              attributeType='XML'
              attributeName='d'
              dur='.5s'
              begin='home_svg_star_to_circle_anim.end;'
              values={`M 988 500 A 488 488 0 1 0 ${arcX(0.2)} ${arcY(
                0.2
              )} L ${arcX(0.2)} ${arcY(0.2)} Z;
              M 988 500 A 488 488 0 1 0 ${arcX(0.2)} ${arcY(
                0.2
              )} L 500 500 Z`}></animate>
            {/* Arc clockwise */}
            <animate
              id='home_svg_star_arc_moprh_out'
              attributeType='XML'
              attributeName='d'
              dur='2.5s'
              begin='home_svg_star_arc_line_extend_anim.end;'
              values={memoArcValues}></animate>
            {/* Counter Clockwise (Reverse) */}
            <animate
              ref={arcAnimateReverseRef}
              id='home_svg_star_arc_morph_in'
              attributeType='XML'
              attributeName='d'
              dur='1s'
              begin='indefinite'
              values={memoReversedArcValues}></animate>
            {/* Global Reset Starting State */}
            <animate
              attributeType='CSS'
              attributeName='opacity'
              dur='.001s'
              begin='home_animate_global_reset.begin'
              fill='freeze'
              from='0'
              to='0'></animate>
          </path>
        </svg>

        <svg
          ref={svgCowStableRef}
          preserveAspectRatio='xMidYMid meet'
          className='home__svg-cow'
          xmlns='http://www.w3.org/2000/svg'
          xmlSpace='preserve'
          viewBox='0 0 1600 900'>
          <defs>
            <filter
              id='home-svg-turblulence-cow-filter'
              width='160%'
              height='160%'>
              <feTurbulence
                type='turbulence'
                baseFrequency='0.03 0.02'
                numOctaves='5'
                result='f_turb'
                seed='2'>
                <animate
                  attributeType='XML'
                  attributeName='baseFrequency'
                  begin='home_svg_star_arc_moprh_out.begin'
                  dur='45s'
                  values='0.04 0.04;0.1 0.1; 0.04 0.04'
                  repeatCount='2'></animate>
              </feTurbulence>
              <feTurbulence
                type='turbulence'
                baseFrequency='0.01 0.03'
                numOctaves='5'
                result='f_turb2'
                seed='4'>
                <animate
                  attributeType='XML'
                  attributeName='baseFrequency'
                  begin='home_svg_star_arc_moprh_out.begin'
                  dur='45s'
                  values=' 0.1 0.1;0.04 0.04; 0.1 0.1'
                  repeatCount='2'></animate>
              </feTurbulence>
              <feBlend
                in='f_turb'
                in2='f_turb2'
                mode='multiply'
                result='BLEND'></feBlend>

              <feDisplacementMap
                in='SourceGraphic'
                in2='BLEND'
                scale='0'
                xChannelSelector='G'
                yChannelSelector='R'
                result='displace'>
                <animate
                  ref={cowDisplaceAnimateRef}
                  attributeType='XML'
                  attributeName='scale'
                  // begin='home_svg_turbulence_displace_anim.begin'
                  begin='indefinite'
                  dur='1s'
                  fill='freeze'
                  values='3000; 0'></animate>
              </feDisplacementMap>
            </filter>
          </defs>
          <g>
            <g inkscape:label='scalp'>
              <path
                fill='#fff'
                d='m707.45 145.25-24.74 62.8 256.5-2.11-17.34-62.38z'
              />
            </g>
            <g>
              <g inkscape:label='horn_left'>
                <path
                  fill='#a68854'
                  stroke='#83422f'
                  strokeWidth='4'
                  d='M706.81 146.3s-36.24-7.61-48.63-10.99c-13.96-3.8-28.34-9.1-49.48-20.93-9.83-5.5-18.51-13.2-26-21.61-8.6-9.66-15.03-21.14-21.16-32.53-3.82-7.1-8.5-17.05-16.7-18.82-5.74-1.23-13.25 2.05-16.08 7.2-7.97 14.53-7.91 32.1-7.4 48.42.26 8.08 2.6 16.04 5.18 23.72 3.13 9.33 6.86 18.66 12.37 26.81a165.11 165.11 0 0 0 36.37 38.49c13.34 10.18 28.9 17.3 44.41 23.68 15.51 6.38 42.3 13.54 48.21 14.38 5.93.85 23.48-29.6 38.91-77.81z'
                />
                <path
                  fill='#d0b990'
                  d='M536.75 43.9c-1.83.9-2.73 3.09-3.57 4.94-1 2.22-1.3 4.72-1.6 7.14-.31 2.6-.32 5.24-.17 7.86a187.4 187.4 0 0 0 4.54 32.67 112.38 112.38 0 0 0 7.4 21.57c4.6 9.76 9.93 19.38 16.92 27.6 7.75 9.09 16.64 17.72 27.17 23.36 22.2 11.9 48.56 27.4 72.75 20.4 5.5-1.59 10.26-6.49 13.2-11.54.77-1.33.72-3 .91-4.53.32-2.59.1-5.22.35-7.82.3-3.09.84-6.15 1.4-9.2.84-4.64.52-6.32 2.9-13.85-6.07-.55-27.4-6.87-40.76-11.42a106.75 106.75 0 0 1-11.52-4.65c-12.61-6.09-24.82-13.4-35.53-22.42-7.32-6.17-13.63-13.58-19.24-21.35-6.88-9.54-10.22-21.39-17.44-30.67-2.28-2.93-4.62-6.26-8.04-7.71-2.97-1.27-6.77-1.79-9.67-.37z'
                />
                <path
                  fill='#fcfcfc'
                  stroke='#fcfcfc'
                  strokeWidth='.5'
                  d='M547.1 55.58c.47 4.64 2.09 9.11 3.77 13.45 2.2 5.68 6.37 12.93 8.19 16.3 2.6 4.85 6.81 10.28 9.34 13.6 4.67 6.12 4.75 5.67 7.25 8.39a188.1 188.1 0 0 0 6.97 7.08 171.1 171.1 0 0 0 7.97 7.46 178.27 178.27 0 0 0 19.6 14.17c13.55 8.24 26.02 15.25 43.81 18.54 17.8 3.29 7.07-9.08 3.74-10.32-8.44-3.15-10.32-3.89-17.94-6.13-3.63-1.07-12.23-3.82-17.99-6.59-6.23-3-12.1-6.77-17.75-10.76-5.36-3.77-10.4-8-15.25-12.4A130.87 130.87 0 0 1 576.4 95.8c-5.15-6.13-9.65-12.8-13.9-19.58-3.03-4.82-8.23-14.96-8.23-14.96s-2.84-5.23-4.34-6.87c-.4-.44-1.85-1.65-2.67-1.14-.67.4-.25 1.56-.17 2.33z'
                />
              </g>
              <g inkscape:label='horn_right'>
                <path
                  fill='#a68854'
                  stroke='#83422f'
                  strokeWidth='4'
                  d='M919.99 145.25s36.25-7.62 48.63-11c13.96-3.8 28.34-9.09 49.49-20.93 9.82-5.5 18.5-13.19 26-21.6 8.59-9.67 15.02-21.14 21.15-32.54 3.82-7.09 8.5-17.05 16.7-18.82 5.74-1.23 13.26 2.05 16.08 7.2 7.97 14.53 7.91 32.1 7.4 48.42-.26 8.09-2.6 16.05-5.18 23.72-3.13 9.33-6.86 18.66-12.37 26.82a165.11 165.11 0 0 1-36.37 38.48c-13.34 10.18-28.9 17.31-44.41 23.69-15.51 6.37-42.3 13.53-48.21 14.38-5.92.84-23.47-29.6-38.91-77.82z'
                />
                <path
                  fill='#d0b990'
                  d='M1087.66 42.85c1.83.89 2.73 3.08 3.56 4.93 1 2.22 1.3 4.72 1.6 7.14.32 2.6.33 5.24.18 7.86a188.1 188.1 0 0 1-4.54 32.67c-1.77 7.4-4.17 14.7-7.4 21.57-4.6 9.76-9.93 19.38-16.92 27.6-7.75 9.09-16.65 17.72-27.18 23.36-22.2 11.9-48.55 27.41-72.74 20.4-5.5-1.59-10.26-6.48-13.2-11.54-.77-1.33-.72-3-.91-4.52-.32-2.6-.1-5.23-.35-7.83-.3-3.09-.84-6.15-1.4-9.2-.84-4.64-.52-6.32-2.9-13.85 6.07-.55 27.4-6.87 40.75-11.42 3.93-1.33 8.05-2.97 11.53-4.65 12.61-6.08 24.82-13.4 35.52-22.41 7.33-6.18 13.64-13.6 19.25-21.36 6.88-9.54 10.22-21.38 17.44-30.66 2.28-2.93 4.62-6.27 8.04-7.72 2.97-1.26 6.77-1.79 9.67-.37z'
                />
                <path
                  fill='#fcfcfc'
                  stroke='#fcfcfc'
                  strokeWidth='.5'
                  d='M1077.32 54.52c-.48 4.64-2.1 9.11-3.78 13.46-2.2 5.67-6.37 12.92-8.19 16.3-2.6 4.84-6.81 10.27-9.34 13.59-4.67 6.12-4.75 5.67-7.25 8.39a194.2 194.2 0 0 1-6.97 7.09c-2.6 2.54-5.73 5.57-7.97 7.46a178.28 178.28 0 0 1-19.6 14.16c-13.55 8.25-26.02 15.25-43.81 18.54-17.8 3.29-7.07-9.08-3.74-10.32 8.44-3.15 10.31-3.89 17.94-6.13 3.63-1.07 12.23-3.82 17.99-6.59 6.23-3 12.1-6.77 17.75-10.75 5.35-3.78 10.4-8 15.25-12.41 4.36-3.96 8.62-8.06 12.4-12.56 5.16-6.14 9.66-12.8 13.91-19.6 3.03-4.81 8.23-14.94 8.23-14.94s2.84-5.24 4.33-6.88c.4-.44 1.86-1.65 2.68-1.14.67.4.25 1.56.17 2.33z'
                />
              </g>
            </g>
            <g inkscape:label='face' strokeWidth='4'>
              <path
                fill='#faf9f5'
                stroke='#83422f'
                strokeWidth='2'
                d='M809.8 204.03c-12.09-.18-24.14-1.35-36.18-2.44-13.91-1.26-27.68-4.19-41.64-4.75-10.57-.42-21.53-1.76-31.72 1.06-15.39 4.26-29.54 13.13-41.87 23.26-5.57 4.57-9.75 10.65-13.96 16.5-5.4 7.5-8.92 16.23-14.38 23.68-3.98 5.44-8.14 10.9-13.32 15.22-5.3 4.41-11.15 8.63-17.76 10.58-6.8 2-10.39 3.31-21.24.8-4.95-1.16-9.7-8.9-13.98-6.14-26.42 17.14-28.98 80.77-.63 94.48 6.46 3.12 20.38-22.69 16.78-13.48-3.53 9.04-4.65 12.2-6.52 18.65-9.68 33.44-18.94 63.82-27.54 95.98-5.64 21.1-12.66 41.97-15.76 63.58-2.06 14.39-2.92 29.07-1.81 43.56 1.25 16.48 3.99 33.1 9.55 48.66 9.48 26.53 24.09 51.2 39.95 74.49 11.3 16.58 25.44 31.07 38.96 45.9 12.36 13.55 24.7 27.24 38.49 39.33 13.25 11.62 27.16 22.68 42.29 31.72a239.23 239.23 0 0 0 44.83 20.72c13.09 4.5 26.76 7.35 40.44 9.42 16.96 2.57 34.18 3.33 51.33 3.7 19.18.4 38.46.45 57.52-1.7 16.56-1.87 33.15-4.73 49.06-9.73 14.34-4.5 28.72-9.9 41.32-18.11 14.4-9.39 26.49-20.26 38.08-32.16 15.15-15.54 28.5-32.86 40.7-50.8a436.14 436.14 0 0 0 34.26-60.06c10.45-22.31 19.93-45.32 25.87-69.23 3.65-14.67 6.37-29.86 5.85-44.96-.59-17.24-4.71-34.37-10.15-50.75-6.93-20.88-18.27-40.06-28.33-59.63a866.11 866.11 0 0 0-25.98-46.82c-9-15.12-27.12-54.64-19.17-45.55 7.94 9.08 6.94 13.62 12.16 11.6 38.07-14.78 42.1-99.08 8.46-122.23-3.59-2.47-8.33 2.93-11.85 5.5-6.2 4.52-9.04 12.98-15.64 16.91-5.88 3.5-13.13 6.15-19.88 5.08-6.76-1.08-13.02-5.69-17.34-11-6.56-8.06-5.79-20.18-11-29.18-5.97-10.3-14.05-19.42-22.74-27.58a88.79 88.79 0 0 0-18.24-13.23c-5.87-3.2-12.32-5.24-18.69-7.25a95.21 95.21 0 0 0-14.65-3.59c-11.31-1.66-22.87-2.94-34.24-1.8-7.9.8-15.34 4.05-23.03 5.99-6.52 1.64-12.93 3.85-19.59 4.78-8.94 1.25-18.04 1.16-27.08 1.02z'
              />
              <path
                fill='#90421d'
                d='M556.08 442.84s4.25-17.45 10.65-37.13c3.87-11.9 7.08-25.36 8.88-26.8 0 0 3.65-5.16 8.8-11.27 5.72-6.8 13.53-14.36 21-17.31 0 0 7.35-1.06 11.15-3.52 0 0 6.04-6.08 7.24-14.76 0 0 .3-21.46 1.33-40.09.66-11.74.85-16.56 3.02-24.5.83-3.03 2.34-5.84 3.76-8.64 2.3-4.5 5.02-8.78 7.69-13.08a296.1 296.1 0 0 1 8.14-12.37c2.65-3.84 4.87-8.1 8.23-11.33 6.86-6.62 15.3-11.47 23.72-15.95a98.52 98.52 0 0 1 18.02-7.36 46.77 46.77 0 0 1 8.81-1.74c4.47-.44 8.98-.14 13.46-.02 7.66.2 15.33.47 22.95 1.24 9.22.95 23.61 3.53 27.5 4.15 0 0 7.86 12.04 11.45 27.68 1.06.64 3.6 22.42 4.02 24.96l1.55 19.97.53 17.16-.38 4.63-4.86-8.6s-17.27-7.77-22.72-8.6c0 0-12.41-3.13-21.83-.07 0 0-10.77-.82-21.05 7.1 0 0-12.52 5.84-17.53 14.81 0 0-11.81 16.22-15.03 28.33 0 0-6.2 31.93 12.04 61.83l11.66 10.47 2.34 3.2-19.35 18.2-8.56-4.34s-4.34-4.44-16.07-9.73c0 0-2.12-2.96-11.63-2.11-2.54-.21-15.23 8.46-17.34 11.42 0 0-17.77 12.05-23.69 15 0 0-16.28 7.2-22.62 7.41 0 0-14.17 4.02-16.7 2.75 0 0-9.68 2.22-18.58-1z'
              />
              <path
                fill='#b1673f'
                d='M667.43 409.4c-1.14.75-2.42-1.34-3.75-1.66-.98-.23-2.01-.15-3.01-.17-2.33-.03-4.73-.4-6.98.2-2.18.56-4.07 1.94-5.97 3.14-2.22 1.4-4.25 3.1-6.32 4.71-1.29 1-2.5 2.1-3.8 3.1a126.67 126.67 0 0 1-5.36 3.82c-4.6 3.15-9.1 6.5-14 9.16a91.64 91.64 0 0 1-12.6 5.52 136.8 136.8 0 0 1-17.23 4.92c-4.15.9-10.32 2.17-12.6 1.91 0 0 2.76-10.66 3.7-13.12 0 0 12.94-40.58 19.77-60.75 2.25-6.66 4.4-19 7-19.9 2.55-.89 6.8-1.5 9.68-3.33 1.12-.72 1.95-1.82 2.77-2.86a23.68 23.68 0 0 0 2.89-4.97c.3-.67.66-1.32.85-2.03 1.08-4.14.9-8.52 1.55-12.75.56-3.71.68-7.58 2.02-11.09 1.32-3.47 3.56-6.55 5.81-9.51a71.1 71.1 0 0 1 10.36-11.1 83.35 83.35 0 0 1 14.6-9.84 55.27 55.27 0 0 1 8.35-3.49 62.95 62.95 0 0 1 10.15-2.75c.93-.15 2.32-.47 2.84-.17.1.78-1.69 3.13-2.5 4.71-1.79 3.45-3.73 6.82-5.24 10.4a150.15 150.15 0 0 0-7.26 21.28 131.73 131.73 0 0 0-3.92 23.31c-.53 7.92-.17 15.9.74 23.79.8 6.86 2.83 13.52 4.13 20.3 1.13 5.9 2.6 11.78 3.17 17.76.36 3.8 3.34 9.35.16 11.46z'
              />
              <path
                fill='#90421d'
                d='M820.78 317.34s-.26-7.56.07-16.13c.24-6.02.97-12.6 1.37-17.15.6-6.91 1.46-13.8 2.7-20.63a266.52 266.52 0 0 1 5.96-25.66c2.9-10.15 5.94-20.33 10.2-30 .78-1.75 1.32-3.78 2.78-5.03 2.27-1.96 5.15-2.11 8.45-3.12 4.52-1.38 10.4-3.84 14.5-4.64 3.86-.75 8.3-1.64 11.78-2.14 3.76-.53 7.59-.61 11.38-.73 6.52-.2 13.99.85 20.91 1.88a128.2 128.2 0 0 1 16.88 3.53c6.34 1.84 12.75 3.82 18.56 6.97 6.61 3.58 12.5 8.41 18.17 13.34 4.43 3.84 8.53 8.09 12.3 12.57 3.36 3.98 6.66 8.15 9.15 12.64 1 1.8 2.27 3.7 3.17 5.56 2.02 4.13 2.41 8.72 3.93 13.06a67.88 67.88 0 0 1 2.33 9.28c2.35 12.33 1.78 25.44 4.93 37.34 2.43 9.15 6.29 20.4 10.66 28.14 1.3 2.32 2 4.43 3.55 5.95 0 0 11.78 14.36 14.8 18.1 0 0 8.74 11.17 9.69 17.88.32 2.26.3 5.24-1.47 6.7-2.73 2.27-7.08 1.32-10.65.35-5.2-1.42-10.33-3.9-15.75-4.14-4.6-.2-9.59-.4-13.63 2.3 0 0-6.77 7.26-7.52 10.25 0 0-5.98 14.5-7.92 16l-31.85-22.58-14.2-7.93s15.25-15.1 1.2-67.58c0 0-11.52-20.64-29.61-28.86 0 0-11.52-10.02-32.15-5.83 0 0-19.89-3.74-37.98 19.14l-11.96 13.45z'
              />
              <path
                fill='#b1673f'
                d='M988.56 395.38s-13.9-11.84-17.27-19.97c-3.9-9.41-1.25-20.35-2.24-30.5-.88-9.1-1.25-18.3-3.29-27.21-2.44-10.68-7.06-20.74-10.61-31.1-2.55-7.41-13.9-17.49-7.66-22.22 9.33-7.07 24.9 15.31 28.89 19.97 0 0 11.66 11.37 15.03 16.15 0 0 8.9 9.42 10.09 11.67 0 0 5.87 17.78 10.46 25.86 2.7 4.74 7.13 8.31 9.87 13.01 6.34 10.85 14.96 34.58 14.96 34.58s-2.88 1.11-4.38 1.12c-3.52 0-6.84-1.67-10.24-2.59-2.94-.8-5.84-1.73-8.79-2.53-.34-.1-.67-.21-1.02-.26-1.1-.14-2.2-.1-3.3-.06-2.45.1-5.01-.16-7.31.69a19.23 19.23 0 0 0-7.35 5.16c-2.59 2.83-5.56 8.77-5.72 9.98z'
              />
              <path
                fill='#dad7c8'
                d='M528.45 576.57s1.03 12.07 2.9 26.78c1.74 13.64 5.98 24.83 8.5 32.71 2.83 8.82 6.82 16.64 10.8 24.69 5.6 11.26 11.55 22.37 18.38 32.92a305.91 305.91 0 0 0 16.26 22.98c2.6 3.33 5.97 7.18 8.62 10.46 5.05 6.26 10.46 11.63 15.75 17.7a403.9 403.9 0 0 0 14.9 16.01c2.6 2.67 5.02 5.6 7.63 8.45 3.36 3.67 6.83 6.9 10.23 10.28 2.76 2.74 5.84 5.75 8.7 8.4 1.95 1.82 3.85 3.46 5.27 4.73 3.96 3.52 15.16 13.55 23.38 19.5 8.3 6 17.16 11.22 26.1 16.22a197.84 197.84 0 0 0 18.32 9.16c10.6 4.42 21.11 8.28 32.26 11.2 7.95 2.06 16.45 3.52 24.52 4.95 10.9 1.94 22.32 2.68 33.4 3.29 9.07.5 18.25.63 27.31.86 14.84.39 32.62-.14 48.8-1.86 11.45-1.2 24.13-3.2 35.9-5.95 14.17-3.32 27.81-8.26 41.06-14.13 9.63-4.26 18.26-10.2 26.54-16.55 11.41-8.75 21.72-18.94 31.54-29.44 9.19-9.82 17.47-20.48 25.5-31.26a369.04 369.04 0 0 0 19.5-28.77 518.25 518.25 0 0 0 23.78-44 463.38 463.38 0 0 0 14.46-33.94c3.1-8.04 5.7-16.32 8.53-24.42.49-1.4.84-4.58.84-4.58-1.48 4.91-4.25 11.64-6.8 17.28-4.35 9.58-9.36 18.87-14.47 28.07-8.08 14.58-15.9 29.4-25.61 42.95-10.15 14.18-21.27 27.82-33.9 39.85A282.7 282.7 0 0 1 990 787.59c-13.1 8.01-27.31 14.18-41.65 19.67-14.38 5.5-29.13 10.3-44.25 13.2-25 4.78-50.64 7.94-76.07 6.72-21.2-1.01-42.11-6.14-62.61-11.64a317.13 317.13 0 0 1-48.13-17.08 281.41 281.41 0 0 1-39.15-21.73c-15.4-10.17-32.88-24.67-43.74-33.96a341.05 341.05 0 0 1-20.02-19.32 220.43 220.43 0 0 1-16.67-19.54c-11.08-14.94-20.44-31.1-30.1-47-5.27-8.67-10.5-17.38-15.18-26.38-4.5-8.67-8.39-17.63-12.35-26.55-4.04-9.07-6.8-15.76-11.63-27.41z'
              />
            </g>
            <g>
              <path
                inkscape:label='eyebrow_left'
                d='M750 238.74s-8.19-6.14-13.05-7.06c-4.48-.84-9.21.38-13.58 1.69-4.47 1.34-8.66 3.63-12.55 6.2-4.46 2.96-8.32 6.76-12.16 10.49-1.56 1.51-2.5 3.23-4.4 4.8.11-2.33.5-3.41 1.08-5.03a64.66 64.66 0 0 1 8-15.44c3.17-4.48 6.77-8.85 11.28-11.98 4.21-2.93 9.06-5.63 14.18-6 4.4-.3 9.14.92 12.81 3.37 4.1 2.74 7.53 7.05 8.93 11.78.68 2.3 1.15 6.53-.54 7.18z'
              />
              <path
                inkscape:label='eyebrow_right'
                d='M881.71 236.86s8.2-6.14 13.05-7.06c4.49-.84 9.22.37 13.59 1.68 4.47 1.35 8.65 3.64 12.54 6.21 4.46 2.96 8.32 6.76 12.17 10.48 1.56 1.52 2.5 3.24 4.4 4.82-.11-2.34-.5-3.42-1.09-5.04a64.66 64.66 0 0 0-8-15.44c-3.17-4.48-6.77-8.85-11.27-11.98-4.22-2.93-9.07-5.63-14.19-6-4.4-.3-9.14.92-12.8 3.37-4.1 2.74-7.54 7.05-8.93 11.77-.68 2.3-1.15 6.54.53 7.19z'
              />
            </g>
            <g>
              <g inkscape:label='eye_background_left'>
                <ellipse
                  cx='738.8'
                  cy='347.42'
                  fill='#6a2710'
                  rx='66.21'
                  ry='73.11'
                />
                <ellipse
                  cx='747.21'
                  cy='347.4'
                  fill='#3f181d'
                  rx='66.07'
                  ry='70.22'
                />
                <ellipse
                  cx='747.33'
                  cy='347.73'
                  fill='#90421d'
                  rx='62.01'
                  ry='66.5'
                />
                <ellipse
                  cx='749.7'
                  cy='354.93'
                  fill='#e7e5e4'
                  rx='59.37'
                  ry='60.65'
                />
                <ellipse
                  cx='749.7'
                  cy='355.39'
                  fill='#fff'
                  rx='48.21'
                  ry='49.4'
                />
              </g>
              <g inkscape:label='eye_background_right' transform='scale(-1 1)'>
                <ellipse
                  cx='-884.2'
                  cy='336.03'
                  fill='#6a2710'
                  rx='67.12'
                  ry='67.44'
                />
                <ellipse
                  cx='-880.09'
                  cy='345.98'
                  fill='#3f181d'
                  rx='66.35'
                  ry='70.86'
                />
                <ellipse
                  cx='-880.16'
                  cy='345.85'
                  fill='#90421d'
                  rx='62.11'
                  ry='66.5'
                />
                <ellipse
                  cx='-876.59'
                  cy='355.24'
                  fill='#e7e5e4'
                  rx='59'
                  ry='60.47'
                />
                <ellipse
                  cx='-876.69'
                  cy='355.33'
                  fill='#fff'
                  rx='48.3'
                  ry='49.76'
                />
              </g>
            </g>
            <g inkscape:label='ears'>
              <g
                ref={cowEarLeftRef}
                className='home__cow-ear home__cow-ear--left'>
                <path
                  fill='#501202'
                  stroke='#83412f'
                  strokeWidth='2'
                  d='M125.81 282.36c21.18-5.67-9 7.72 84.53-33.64l101.54-48.15s61.93-24.3 94.63-27.21c16.3-1.46 33.74-1.25 50.15 2.06 12.78 2.57 25.04 7.74 36.66 13.65 14.93 7.6 31.96 15.72 41.91 27.72 5.12 6.16 7.8 10.42 11.1 16 6.05 10.25 11.12 21.07 15.86 31.98 2.74 6.3 3.86 10.5 7.25 19.29 0 0 8.18 34.72 6.95 61.57 0 0-1.3 13.59-4.02 19.71-2.68 6.05-7.38 11.04-11.78 15.98-5.22 5.86-10.94 10.82-17.2 16.08-8.76 7.36-18.74 14.31-27.63 20.38-12.94 8.82-30.99 18.04-48.96 22.78-22.12 5.83-43.81 6.15-51.83 6-14.54-.27-44.25-6.23-63.18-14.56-18.93-8.34-59.98-40.3-72.94-58.59-12.95-18.28-11.74-18.36-17.77-27.44 0 0-10.8-21.08-19.26-29.04-5.57-5.24-7.86-8.98-19.84-11.5-11.99-2.5-36.91 5.6-50.22 5.64-13.32.03-19.74-.59-29.18-3.12-13.48-3.61-25.19-23.33-16.77-25.59z'
                />
                <path
                  fill='#91411d'
                  d='M318.98 199.65c34.47-15.22 53.7-25.62 109.88-26.55 0 0 19.9-1.26 41.5 5.38 21.65 6.66 46.97 17.67 58.34 31.5 6.62 8.06 9.05 22.14 4.94 30.87-1.31 2.79-7.76 3-11.42 1.08-12.47-6.56-25.46-20.22-34.72-25.15-12.61-6.73-30.16-18.01-57.41-17.75-20.01.19-38.27-4.32-105.25 27.78 0 0-25 16.05-42.9 24.07 0 0-22.45 12.18-44.43 17.07-23.17 5.16-44.18 2.65-36.59-1.64 0 0 38.51-20.26 50.54-26.03 12.03-5.76 43.53-30.05 67.52-40.63z'
                />
                <path
                  fill='#aa6d50'
                  d='M343.98 194.7c12.57-8 31.23-16.2 42.28-17.9 14.42-2.23 20.74-4.71 49.08-1.85 51.85 5.25 81.17 28.7 83.02 33.34 1.85 4.63-3.05 10.7-6.79 9.57-8.06-2.47-13.49-6.66-21.97-11.95-13.22-8.26-29.53-14.46-37.9-16.76-17.73-4.87-30.25-6.48-44.76-5.25-7.56.65-7.32 1.02-24.7 3.34-9.77 1.3-21.61 3.99-38.57 10.86-5.84 2.37-2.44-.4.3-3.4z'
                />
                <path
                  fill='#fd8186'
                  stroke='#83422f'
                  strokeWidth='2'
                  d='M227.41 293.44s29.77-11.74 57.52-29.2c27.24-17.14 57.27-32.7 62.95-35.4 33.01-15.7 50.8-17.7 55.66-17.78 14.18-.27 35.78 1.17 46.27 4.8 18.4 6.36 24.59 10.9 36.22 18.55 17.14 11.27 29.44 21.13 47.15 39.53 11.73 12.2 26.01 27.36 39.06 51.37 0 0-.44 43.43-83.15 91 0 0-34.81 17.03-69.84 17.36 0 0-38.08-1.97-68.2-16.8 0 0-28.92-14.74-60.78-55.33 0 0-15.9-23.99-26.78-37.29-1.48-1.8-9.12-10.5-9.12-10.5s-12.99-14.63-26.96-20.3z'
                />
                <path
                  fill='#feb4b8'
                  d='M324.75 262.02s-18.33 12.87-18.55 41.25c-.22 28.37 43 61.32 71.15 70.49 28.15 9.16 48.45 11.35 81.18 8.07 18.63-1.86 31.94-11.03 43.63-23.42 9.05-9.6 16.59-22.57 20.76-29.4 9.6-15.7 21.82-33.82 24-36 1.23-1.23-13.92-17.09-28.66-30.73-11.53-10.66-21.47-18.62-28.3-22.3 0 0-4.56-5.18-27.11-16.3 0 0-4.95-4.44-23.52-8.37-2.73-.57-10.62-2.18-16.15-2.26-5.45-.08-10.08 1.57-13.88 2.7-18.74 5.6-41.61 15.3-56.18 24.44-20.51 12.88-28.37 21.83-28.37 21.83z'
                />
              </g>
              <g
                ref={cowEarRightRef}
                className='home__cow-ear home__cow-ear--right'>
                <path
                  fill='#501202'
                  stroke='#83422f'
                  strokeWidth='1.5'
                  d='M1044.92 272.89s11.64-18.5 16.94-28.07c4.63-8.36 6.8-10.15 16.66-20.74 18.47-19.86 44.32-41.08 79.35-50.36 75.55-20.02 157.4 22.22 198.15 50 40.74 27.78 54.78 41.97 58.95 43.36 4.17 1.4 8.8 5.71 23.15 11.12 14.35 5.4 29.17 10.33 35.5 12.96 6.32 2.62 3.39 7.87 3.39 7.87s-8.49 7.87-16.67 11.57c-8.18 3.7-18.2 5.25-18.2 5.25s-6.18 1.23-20.38-1.54c0 0-15.12-4.48-19.9-4.17-4.79.3-5.72-1.39-20.53 4.17-14.82 5.55-31.02 22.22-34.88 25.92-3.86 3.7-11.26 14.66-14.81 20.68-3.55 6.02-20.68 31.33-27.93 36.27 0 0-18.83 22.53-39.97 32.56-21.15 10.03-37.4 15.54-57.78 17.11-14.86 1.15-36.21.82-55.16-4.97-6.82-2.09-14.9-4.42-20.45-7.57-7.11-4.03-20.72-11.04-31.43-18.09-24.04-15.82-41.25-29.81-53.16-48.12-14.12-21.69-10.54-44.58-.84-95.21z'
                />
                <path
                  fill='none'
                  stroke='#000'
                  strokeOpacity='.22'
                  strokeWidth='1.5'
                  d='m1049.32 270.97-3.71 3.92s-8.51 43.87-8.3 58.71c0 0 11.36-10.91 12.66-18.11 0 0 3.5-7.86 4.59-20.52 0 0-2.62-18.77-5.24-24z'
                />
                <path
                  fill='#903c1e'
                  stroke='#903c1e'
                  strokeWidth='1.5'
                  d='M1091.82 228.35c1.63-5.83 3.45-11.23 6.06-16.46 2.15-4.3 4.12-9.04 7.83-12.09 20.2-16.62 47.08-24.64 72.84-29.17 17.88-3.14 36.46-.83 54.42 1.8 16.4 2.4 32.6 6.76 48.09 12.68 17.83 6.81 34.14 17.1 51 26.06 6.62 3.52 10.83 5.23 19.68 10.89 4.55 2.9 13.8 9.43 15.56 11.91 6.68 9.48 4.58 6 11.35 15.83 0 0 12.77 15.5 17.13 17.35 0 0 15.28 11.24 20.63 12.98l15.71 7.86s7.42 3.6 10.91 6.98c0 0 1.86 1.42.33 2.51-1.53 1.1-12.55 2.6-18.88 2.3-8.97-.45-17.9-2.7-26.3-5.9-10.93-4.18-20.97-10.56-30.66-17.13-12.45-8.45-23.45-18.86-35.03-28.48-11.93-9.91-22.92-21-35.46-30.12-11.42-8.3-23.03-16.73-36.01-22.26-7.4-3.15-15.42-4.75-23.36-6-10.04-1.58-20.3-2.68-30.44-1.86-11.49.93-22.74 4.13-33.72 7.64-12.02 3.85-23.56 9.12-34.92 14.62-10.06 4.88-19.46 11.05-29.35 16.26-4.6 2.43-11.57 6.55-13.97 6.99 0 0-4-3.2-3.44-5.2z'
                />
                <path
                  fill='#a86d52'
                  d='M1111.08 205.93c1.28-7.17 16.85-14.05 26.63-18.77 14.68-7.08 30.79-11.43 46.92-13.75 14.84-2.13 30.08-1.82 44.96 0 10.49 1.28 20.75 4.3 30.77 7.64 7.27 2.42 19.17 7.7 21.17 8.95 7.88 4.94 6.55 3.05 7.64 4.8 0 0 1.96 2.62-3.71.43a4635.5 4635.5 0 0 0-18.99-7.2s-18.77-4.8-24.66-5.24c-5.9-.43-15.28-3.92-42.34-.21-27.06 3.7-41.25 10.7-41.25 10.7s-17.59 8.62-26.19 13.3c-4.95 2.7-12.44 7.86-14.62 8.51-2.18.66-7.6-1.99-6.33-9.16z'
                />
                <path
                  fill='#fd8186'
                  d='M1057.61 295.63s28.88-19.86 42.6-30.74c11.24-8.9 20.63-20.12 32.48-28.19 15.06-10.26 30.95-20.24 48.45-25.32 18.65-5.4 38.97-8.39 58.05-4.8a133.2 133.2 0 0 1 34.88 11.64c9.37 4.71 17.28 11.9 25.8 18.04 12.64 9.13 25.4 18.14 37.53 27.94 12.19 9.85 29.25 23.57 35.36 30.99 0 0-18.45-1-27.06 1.75a35.82 35.82 0 0 0-14.85 9.16c-10.34 10.84-14.43 26.26-21.82 39.29-5.77 10.17-10.4 21.13-17.6 30.35-9.06 11.6-22.21 24.17-31.72 30.75-13.28 9.2-29.86 13.31-45.83 15.72a156.9 156.9 0 0 1-55.87-1.75c-18.63-4-36.02-12.84-52.82-21.82-12.4-6.63-24.03-14.74-35.05-23.47-4.26-3.37-8.14-7.23-11.94-11.12-3.7-3.77-7.3-7.67-10.56-11.82-3.67-4.68-8.42-12.09-10.1-14.7 0 0 20.07-24 20.07-41.9z'
                />
                <path
                  fill='#feb4b8'
                  d='M1144.37 230.48c9.56-3.28 20.05-3.43 30.17-3.31 14.44.16 29.37 2.68 42.94 5.71 20.72 4.63 41.45 12.55 58.49 25.2 10.1 7.52 21.53 16.64 24.33 28.93.36 1.57-1.2 4.69-1.2 4.69s-13.37 7.48-18.66 12.87c-8.16 8.32-12.77 19.5-19.31 29.14-9.17 13.49-14.83 30.47-27.94 40.16-14.1 10.42-32.69 13.9-50.09 16.04-13.1 1.6-26.8.94-39.5-2.62-15.4-4.31-29.99-12.26-42.56-22.15-8.26-6.5-14.82-15.09-20.73-23.8-5.04-7.4-9.82-15.7-12.33-23.89 0 0-8.64-17.42-9.18-23.31 0 0 22.68-14.77 33.26-23.17 10.24-8.12 18.68-18.4 29.14-26.22 7.26-5.44 14.59-11.32 23.17-14.27z'
                />
              </g>
            </g>

            <g
              ref={cowMouthBottomRef}
              className='test-mouth-bottom'
              transform='translate(0 -.03)'>
              <path
                inkscape:label='back_of_the_mouth'
                fill='#631108'
                d='m666.31 592.22 329.67-8.6s-7.83 148.93-33.85 166.7c-29.94 20.44-81.4 32.24-127.43 33.92-12.29.45-64.23-8.6-96.54-25.86-27.94-14.9-40.7-26.75-47.17-32.5C677 713.44 666.3 592.21 666.3 592.21Z'
              />
              <g inkscape:label='bottom_teeth'>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='m785.52 741.22.71-10.8-17.72-2.4s-3.02 7.47-1.68 8.47c1.55 1.17 18.65 5.45 18.7 4.73z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m784.94 740.5.58-7.37s-6.08 2.13-8.99 1.23c0 0-7.24-1.04-8.47-3.24l-1.17 4.99s4.7 1.37 9.36 2.55c3.87.98 7.72 1.81 8.69 1.84z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M802.53 743.93c.67-.25.72-13.26.72-13.26l-15.08.26s-1.05 10.52-.25 10.93c2.67 1.38 13.3 2.58 14.61 2.07z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m802.19 743.64.27-8.18s-4.07 1.04-6.13.97c-2.7-.1-7.19-.46-7.9-1.82l-.32 6.79 6.87 1.43z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M823.43 746.07s.84-12.16-1.55-15.4c0 0-.84-2.26-15.85.13 0 0-1.23 13.2-.78 13.4.45.18 18.05 2.7 18.18 1.87z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='M822.85 745.68v-6.66s-4.3.67-7.7.7c-3.21.04-4.34 0-8.93-2.32l-.45 6.34z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M845.3 746.55c1.1-.07-.15-8.62-.55-11.53-.28-1.98-2.13-4.17-4.12-4.39-2.59-.28-14.61-1.33-14.45-.09.3 2.4-.81 15.6.36 16.01z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m845.2 746.1-1-10.71c-3.57 1.74-6.22 4.2-9.97 4.48 0 0-6.59 0-7.6-1.1l.19 7.05z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M866.24 745.64c.33-.91-.27-10.26-1.92-13.27-1.33-2.44-5.6-1.8-8.5-1.83-2.18-.01-4.82-.21-6.4 1.28-1.59 1.5-1.65 2.66-1.65 6.31 0 0-.19 8.15.45 8.42 0 0 17.6.26 18.02-.91z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m865.92 745.82-.82-8.28s-5.27 2.16-8.74 2.52c-2.11.21-6.22 1.14-8.05-.6l.23 6.59z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M883.72 742.96s-.41-6.58-.72-9.7c-.16-1.67-.51-2.46-3.17-3.62-1.53-.68-7.9-.38-9.9 1.29-1.22 1.02-2.2 1.49-1.97 5.6 0 0 .27 8.93 1.33 9.21 1.65.45 14.47-2.2 14.43-2.78z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m883.04 742.6-.68-8.08s-2.98 2.23-5.57 1.97c0 0-6.25 1-8.12-.29 0 0 .33 9 .91 9.19 0 0 3.23-.57 6.44-1.18a67.1 67.1 0 0 0 7.02-1.6z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M886.28 730.82s-1.37 11.12.09 11.7c1.54.63 10.09-2.43 11.43-3.2 1.15-.64-1.42-11.75-2.56-12.25-1.38-.61-8.96 1.33-8.96 3.75z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='M897.53 739.05s-.07-2.21-.26-3.3c-.2-1.18-.93-3.47-.93-3.47s-2.2 1.83-4.85 2.56c0 0-3.84 1.1-5.03.64v6.59l5.03-1.18z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='1.5'
                    d='M899.18 730.8c.1 2.04.87 7.3 1.42 7.12 3.31-1.17 19.5-8.16 18.24-9.38-1.34-1.3-5.11-2.28-8.28-2.91 0 0-6.21-1.17-7.9.13-2.08 1.6-3.61 2.71-3.48 5.04z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m900.15 731.48.38 5.58s5.06-1.45 9.14-3.4c3.9-1.86 8.26-4.46 8.43-4.97 0 0-1.78-1.38-7.54-2.48 0 0-9 5.56-10.41 5.27z'
                  />
                </g>
              </g>
              <g inkscape:label='Lip'>
                <path
                  fill='none'
                  stroke='#83422f'
                  strokeWidth='4'
                  d='M666.4 597.8s-6.43 46.07-3.74 71.22c2.5 23.34 8.46 42.02 16.6 52.89 14.1 18.81 24.66 28.14 35.47 37.38 12.44 10.64 31.7 20.49 49.25 26.88 15.66 5.7 32.34 8.57 48.9 10.35 15.53 1.67 31.27 1.46 46.84.26 18.38-1.42 37.27-2.5 54.6-8.8 15.37-5.58 29.54-14.7 42.17-25.1 11-9.06 19.82-20.59 28.52-31.88 5.93-7.7 8.74-17.32 12.14-26.93 1.67-4.75 6.28-21.33 6.6-35.07.46-19.74-2.57-67.95-1.45-75.66'
                />
                <path
                  fill='#f8878c'
                  stroke='#f8878c'
                  strokeWidth='4'
                  d='M674.9 705.56c3.2 8.2 2.63 7.31 9.05 17.39 4.81 7.56 12.3 14.07 18.11 19.94 4.28 4.32 8.25 7.47 11.99 11.17 4.58 4.55 17.26 12.95 26.66 18.17 7.42 4.12 15.2 7.67 23.27 10.28a239.8 239.8 0 0 0 45.89 9.77 260.31 260.31 0 0 0 50.2 1.17c18.38-1.42 37.3-3.4 54.43-9.77 8.95-3.33 16.5-7.68 24.58-12.9 5.93-3.84 13.2-9.65 17.37-13.15 8.97-7.55 18.82-20.21 27.1-31.24 5.73-7.63 7.69-16 10.92-24.98 6.24-17.36 6.4-31.48 6.76-51.73.35-20-6.25-41.63-3.6-46.1 0 0-8.92 44.14-17 65.05-3.92 10.13-9.98 24.7-15.12 28.88-6.34 5.15-15.8 12.74-22.98 17.78-13.8 9.68-20.12 15.32-32.28 21.75-7.73 4.08-17.9 6.42-25.08 7.66-7.25 1.26-30.5 4.16-37 4.22-5.78.05-39.52-1.7-58.91-5.23-13.05-2.37-26.26-5.18-38.34-10.66-15.05-6.82-23.33-12.14-38.43-19.56-10.9-5.36-20.87-17.08-26.97-28.7-11.9-22.66-12.35-88.87-16.19-75.03-1.63 2.62-4.79 39.89-2.79 58.23 2.02 18.48 5.47 30.16 8.37 37.6z'
                />
                <path
                  fill='#fcb6ba'
                  d='M727.03 748.15c7.03 6.47 16.53 11.27 25.3 16.03 6.29 3.4 12.75 6.55 19.5 8.88a168.48 168.48 0 0 0 33.12 8.03c11.98 1.56 24.16 1.25 36.23.77a328.7 328.7 0 0 0 40.88-4.14c11.62-1.93 23.33-4.02 34.41-8.02 9.13-3.3 18.25-7.24 26.04-13.02 7.82-5.8 14.93-12.95 20.05-21.22 4.2-6.79 7.52-14.53 8.25-22.48.37-4.04.57-10.14-2.06-12-3.88-2.74-8.22-.57-13.13 4.15-5.88 5.64-11.33 9.74-14.28 11.98-5.6 4.26-11.63 9.15-17.97 12.91a123.92 123.92 0 0 1-19.4 9.32 162.57 162.57 0 0 1-28.47 8.02c-10.3 1.86-20.84 2.26-31.3 2.59-8.97.28-17.96.03-26.92-.52-7.44-.46-14.9-1.02-22.25-2.33-8.94-1.6-17.68-4.15-26.39-6.73-7.25-2.14-14.5-4.36-21.48-7.24-5.95-2.46-12.66-5.05-17.33-8.54-4.73-3.53-15.44-9.6-19.27-7.86-2.5 1.14-2.74 13.75 16.47 31.42z'
                />
                <path
                  fill='#fff'
                  d='M900.37 749.3c-4.36 1.45-10.1 4.22-10.62 8.78-.3 2.6 2.34 5.24 4.76 6.22 4.23 1.71 9.46.02 13.54-2.01 5.13-2.57 14.31-6.72 12.26-12.08-2.38-6.21-13.63-3.03-19.94-.91z'
                />
                <path
                  fill='#fff'
                  d='M932.02 739.23c2.45-.66 6.5-1.05 7.5 1.28.87 2.02-1.85 4.24-3.66 5.5a12.23 12.23 0 0 1-8.6 2c-1.27-.2-3.2-.73-3.3-2-.26-3.5 4.67-5.86 8.06-6.78z'
                />
              </g>
            </g>
            <g inkscape:label='upper_teeth'>
              <g inkscape:label='left_tooth'>
                <path
                  fill='#fff'
                  stroke='#a2a4a4'
                  strokeWidth='2'
                  d='M761.69 703.97s1.56 7.75 3.38 14.86c1.23 4.81 2.76 9.44 5.06 10.24 4.03 1.39 9.41 1.5 14.16 1.87 4.56.35 9.14.46 13.72.34 3.88-.1 8.94-.17 12.8-.59 6.74-.72 17-2.78 19.32-4.08 0 0 2.6-.54 4.41-7.53 0 0 1.15-13.88 1.06-15.62 0 0 .18-11.61-.1-13.26l-23.59 4.88-21.38 3.99z'
                />
                <path
                  fill='#cecece'
                  d='m762.85 704.77 71.89-13.4s.63 18.7-1.3 28.02c-.32 2.58-1.27 4.53-3.18 6.1-.3.25-1.3.62-1.97.86-2.12.75-4.9 1.26-9.09 2.04 0 0 2.26-8.57 1.67-12.85-.53-3.84-1.58-8.24-4.57-10.7-1.23-1.02-3.08-.97-4.67-1.01-16-.43-47.4 7.62-47.4 7.62z'
                />
              </g>
              <g inkscape:label='right_tooth'>
                <path
                  fill='#fff'
                  stroke='#a2a4a4'
                  strokeWidth='2'
                  d='M837.7 689.56s36.6-5.12 42.17-4.57c2.57-.55 42.54 3.2 45.93 4.3-.1 1.28-.92 9.33-1.47 10.6-1.45 3.4-5.3 10.88-7.31 13.09-3.1 3.42-6.47 6.67-10.52 8.78-3.82 1.99-8.2 2.7-12.45 3.38-6.93 1.14-14.01 1.08-21.04 1.24-5.45.12-10.95.42-16.37-.23-4.88-.59-12.21-1.6-14.36-3.3-3.06-2.38-3.85-4.47-4.21-7.04-.38-2.62-.73-14.18-.46-16.55 0 0-.36-8.88.1-9.7z'
                />
                <path
                  fill='#cecece'
                  d='M838.3 690.55s-.45 23.79 1.25 27.35c.44.9-.05 1.08 2.32 3.39.5.48.67.65 1.73 1.25.95.53 2.36.82 3.8 1.22a36 36 0 0 0 7.13 1.08s-.37-6.32-.45-9.4c-.15-5.56.12-7.94.27-9.5.4-4.1.37-6.46 2.38-8.7 1.45-1.6 2.83-2.61 6.86-2.47l60.24 2.65 1.13-7.38s-25.55-3.35-38.4-3.96c-4.65-.22-9.15-.26-13.95.12-5.16.4-13 1.64-19.4 2.25-7.58.72-12.49 1.7-14.92 2.1z'
                />
              </g>
            </g>
            <g inkscape:label='nose'>
              <path
                fill='#fe8185'
                stroke='#83422f'
                strokeWidth='3'
                d='M782.65 392.4c-16.3 1.51-32.97 2.97-48.4 8.46-13.36 4.74-25.7 12.36-37.12 20.76-11.1 8.17-19.53 19.48-30 28.44a275.11 275.11 0 0 1-18.38 14.17c-5.88 4.23-12.36 7.63-18.07 12.1-7.46 5.81-14.74 11.97-21.05 19.02-8.75 9.79-16.68 20.46-23 31.97-5.9 10.74-10.88 22.2-13.64 34.14-3.11 13.47-4.56 27.61-3.07 41.35 1.6 14.67 4.73 29.99 12.7 42.41 10.86 16.95 27.55 30.46 45.34 39.9 17.63 9.34 38.16 12.49 57.96 15 28.32 3.62 57.2 2.36 85.65 0 20.72-1.73 40.89-7.75 61.52-10.29 15.31-1.88 30.71-3.88 46.14-3.66 10.9.16 21.65 2.86 32.53 3.53 19.55 1.18 39.3 3.14 58.73.8 16.6-2.01 33.65-5.02 48.55-12.6 8.22-4.18 14.67-11.24 21.39-17.55 4.3-4.04 8.45-8.3 12.06-12.96 6.7-8.7 13.8-17.53 17.62-27.82 6.61-17.86 9.98-37.57 8.26-56.53-1.27-13.96-7.47-27.17-13.47-39.84-5.36-11.34-11.7-22.44-19.92-31.93-9.32-10.76-21.04-19.27-32.62-27.56-8.11-5.8-17.08-10.3-25.65-15.4-11.74-6.98-23.52-13.9-35.3-20.83-13.04-7.67-25.09-17.42-39.18-22.96-18.51-7.27-38.47-10.89-58.25-12.95-23.65-2.46-47.65-1.36-71.33.83z'
              />
              <path
                fill='#feb4b8'
                d='M772.43 551.59c-12.09-8.13-23.7-17.61-37.37-22.67-11.12-4.12-23.24-5.41-35.1-5.8-11.97-.4-24.16.53-35.77 3.5-11.07 2.81-20.94 9.15-31.55 13.4-10.42 4.17-20.37 10.59-31.53 11.85-6.63.76-15.57 2.48-19.83-2.66-3.13-3.76 1.67-11.06 3.94-16.08 6.24-13.79 16.52-26.5 25.98-37.21 2.76-3.12 6.69-7.29 9.81-10.06 3.6-3.19 6.8-5.48 10.57-8.44 4.63-3.63 9.77-6.56 14.57-9.97 4.46-3.16 8.9-6.36 13.2-9.74 3.2-2.5 6.31-5.09 9.33-7.79 3.5-3.12 6.74-6.5 10.15-9.72 5.27-4.99 10.65-10.43 15.93-14.85 4.97-4.16 9.92-8.11 15.17-11.65 5.9-3.98 11.87-6.7 18.48-9.34 18.06-7.22 38.92-9.17 58.76-11.03 23.2-2.18 46.77-2.81 69.92-.12 19.9 2.32 39.9 6.44 58.5 13.9 6.5 2.61 11.32 6.78 18.13 10.63 2.92 1.65 5.35 3.87 8.11 5.67 5.46 3.54 11.13 6.74 16.72 10.06 4.32 2.57 8.67 5.09 13.01 7.62 6.66 3.9 13.32 7.82 20 11.69 4.15 2.4 8.46 4.56 12.5 7.17 5.24 3.41 10.67 6.72 15.17 11.07 3.9 3.77 8.78 7.53 10.01 12.8.6 2.55.22 5.8-1.6 7.67-6.02 6.17-16.73 4.2-25.18 5.95-11.38 2.36-23.1 3.13-34.32 6.15-13 3.5-26.05 7.5-37.95 13.78-10.02 5.28-18.37 13.27-27.62 19.81-8.67 6.13-17.14 12.55-26.13 18.2-8.75 5.5-17.3 11.64-26.99 15.25-7.43 2.77-15.4 4.95-23.32 4.7-11.68-.36-23.35-3.95-33.88-9.02-7.4-3.58-12.99-10.13-19.82-14.72z'
              />
              <path
                fill='#fff'
                d='M789.97 410.87c-11.67 2.46-23.07 6.3-34.11 10.8a196.76 196.76 0 0 0-27.4 13.84c-7.22 4.36-14 9.42-20.59 14.68-5.6 4.47-10.79 9.42-16.03 14.3-3.83 3.54-7.75 7-11.24 10.88-4.84 5.38-9.05 11.89-13.4 17.07.39-3.61 3.28-15.7 7.07-22.64a123.26 123.26 0 0 1 30.15-36.02c8.93-7.28 19.71-12.19 30.44-16.4 9.42-3.7 19.36-6.22 29.38-7.62 8.17-1.14 16.5-1.1 24.73-.6 2.38.15 7.1 1.04 7.1 1.04s-4.1.24-6.1.67z'
              />
            </g>
            <g inkscape:label='nostrils'>
              <g inkscape:label='nostril_left'>
                <path
                  fill='#8e4039'
                  d='M733.22 576.08c-6.74-7.48-10.24-11.02-16.02-15.8-5.64-4.66-11.43-9.38-18.07-12.46-8.81-4.09-18.42-7.23-28.13-7.64-8.34-.35-16.84 1.48-24.63 4.48-9.34 3.6-17.74 9.55-25.52 15.85-3.78 3.07-10.12 10.56-10.12 10.56 1.09-2.96 7.9-11 12.96-15.43 6.73-5.88 14.2-11.42 22.64-14.34 10.6-3.66 22.35-5 33.45-3.41 9.93 1.43 19.37 6.04 27.87 11.37 8.47 5.31 15.57 12.66 22.28 20.07 4.67 5.15 12.38 16.78 12.38 16.78-5.45-6.05-4.45-4.88-9.09-10.03z'
                />
                <path
                  fill='#feb4bb'
                  d='M636.73 568.2c3.7-1.48 7.44-2.96 11.35-3.7 7.46-1.4 15.24-2.54 22.73-1.3 10 1.67 19.17 6.8 28.15 11.5 5.22 2.72 9.98 6.26 14.84 9.6 3.43 2.34 6.4 5.44 10.11 7.31 2.9 1.45 6.48 3.57 9.28 2.91 2.65-.62.84-4.98-2.02-9.8-2.3-3.88-5.26-8.07-7.12-10.86-3.52-5.27-8.25-9.7-13.11-13.77a72.16 72.16 0 0 0-14.83-9.79c-5.84-2.8-12.06-5.17-18.48-6.01-7.49-.98-15.4-1-22.6 1.25-7.05 2.2-13.36 6.67-18.88 11.55-2.84 2.52-6.13 6.64-7.08 8.92-1.48 3.5-1.04 5.15-1 6.6 2.22-.75 3.99-2.54 8.66-4.41z'
                />
                <path
                  fill='#f44d5b'
                  d='M646.04 569.74c-.01.68.48 8.27 1.5 16.21.6 4.57 1.57 7.65 2.82 10.91a40.59 40.59 0 0 0 8.72 13.7c4.94 5.07 11.23 8.8 17.62 11.86 4.35 2.08 9.13 3.15 13.83 4.27 5.46 1.31 10.98 2.68 16.6 2.86 6.02.2 17.02-1.53 17.97-1.89.66-.25.82 7.94-.18 11.7-.78 2.96-2.53 5.62-4.41 8.02-1.35 1.72-2.88 3.42-4.8 4.44-4.84 2.55-10.52 3.53-15.99 3.66-9.71.22-19.45-2.16-28.7-5.18-8.08-2.63-16.71-5.37-22.95-11.15-5.48-5.08-8.96-12.26-11.3-19.35-2.75-8.3-3.2-17.33-2.9-26.06.2-5.29-.01-11.17 2.87-15.6 3.33-5.13 9.35-11.12 9.3-8.98z'
                />
                <path
                  fill='#5b1106'
                  d='M646.16 568.99c.37-1.27 10.21-2.83 15.45-2.83 7.4 0 14.9 1.46 21.87 3.97 9.1 3.27 18.35 7.44 25.3 14.16 3.75 3.63 7 7.63 9.45 12.33a75.06 75.06 0 0 1 4.09 9.37c2.4 6.67 3.4 16.2 3.1 22.23 0 0-3.59 1.07-5.44 1.37-2.59.43-5.78.61-7.85.61-10.57 0-20.79-2.32-30.53-5.86-7.8-2.84-15.79-6.33-21.74-12.1-5.56-5.4-9.56-12.6-11.9-19.98-2.35-7.42-2.36-21.38-1.8-23.27z'
                />
              </g>
              <g inkscape:label='nostil_right'>
                <path
                  fill='#f44d5b'
                  d='M1024.18 552.9c0 .68-.77 8.25-2.08 16.15a43.85 43.85 0 0 1-3.21 10.8 40.59 40.59 0 0 1-9.21 13.38c-5.12 4.88-11.54 8.4-18.03 11.21-4.42 1.93-9.24 2.82-13.97 3.78-5.5 1.1-11.08 2.28-16.7 2.26-6.02-.02-16.95-2.14-17.89-2.54-.64-.27-1.1 7.9-.24 11.7.67 2.98 2.33 5.7 4.12 8.17 1.28 1.77 2.75 3.53 4.64 4.61 4.74 2.72 10.39 3.9 15.84 4.23 9.7.58 19.52-1.46 28.87-4.14 8.17-2.34 16.9-4.76 23.34-10.32 5.66-4.87 9.39-11.93 11.99-18.93 3.04-8.2 3.83-17.2 3.83-25.94 0-5.29.41-11.16-2.3-15.7-3.15-5.23-8.95-11.44-8.99-9.3z'
                />
                <path
                  fill='#5b1106'
                  d='M1024.1 552.14c-.34-1.27-10.11-3.19-15.35-3.38-7.4-.27-14.94.93-22 3.18-9.2 2.94-18.6 6.78-25.79 13.24a48.38 48.38 0 0 0-9.9 11.98 75.06 75.06 0 0 0-4.41 9.23c-2.64 6.57-3.98 16.06-3.9 22.1 0 0 3.55 1.2 5.39 1.57 2.57.51 5.75.82 7.82.9 10.57.37 20.86-1.59 30.72-4.78 7.9-2.55 16-5.75 22.16-11.3 5.75-5.2 10-12.25 12.61-19.55 2.62-7.32 3.13-21.27 2.64-23.19z'
                />
                <path
                  fill='#8e4039'
                  d='M922.49 584.18s5.69-13.34 8.91-19.83c2.06-4.16 4.15-8.32 6.66-12.22 2.37-3.7 5-7.24 7.9-10.55a68.42 68.42 0 0 1 9.03-8.9c4.81-3.78 10-7.23 15.6-9.7a69 69 0 0 1 17.28-4.8 83.94 83.94 0 0 1 20.15-.66c4.9.44 9.67 1.9 14.44 3.11 4.16 1.06 11.27 2.6 12.35 3.65l1.23.41c-.57-1.04-6.63-4-10.23-5.36a68.34 68.34 0 0 0-17.79-4.43c-9.72-.93-19.8-.9-29.26 1.56a66.87 66.87 0 0 0-22.68 11.12c-7.03 5.2-12.83 12.06-17.9 19.2-3.35 4.72-5.8 10.06-8.1 15.37-3.08 7.13-7.6 22.03-7.6 22.03z'
                />
                <path
                  fill='#feb4bb'
                  d='M936.96 573.63a64.16 64.16 0 0 1 10.52-27.76c4.14-6.06 10.06-10.95 16.31-14.78 6.22-3.81 13.23-6.79 20.45-7.78 9.23-1.27 18.9-.13 27.84 2.5 6.13 1.8 12.5 4.35 16.98 8.91 2.38 2.43 5.12 8.3 4.58 9.1-.58.87-6.35.03-8.4-.33-2.07-.36-12.45-1.67-18.68-1.33-7.57.43-15.1 2.03-22.4 4.13-5.12 1.48-10.26 3.25-14.87 5.94-4.71 2.74-8.92 6.36-12.76 10.23-3.07 3.1-6.06 7.5-8.1 10.28-.96 1.33-7.34 12.13-9.75 11.34-1.87-.6-2.34-5.55-1.72-10.45z'
                />
              </g>
            </g>
            <g inkscape:label='eyes'>
              <g
                ref={cowEyeRightRef}
                className='home__cow-eye home__cow-eye--right'
                inkscape:label='eye_right'
                transform='translate(.4 5.2)'>
                <circle cx='876.28' cy='350.13' r='15.31' fill='#803300' />
                <circle cx='876.28' cy='350.13' r='15.31' fill='url(#c)' />
                <circle cx='876.28' cy='350.13' r='15.31' fill='url(#d)' />
                <circle cx='876.28' cy='350.12' r='8.97' />
                <circle
                  cx='881.47'
                  cy='342.62'
                  r='2.63'
                  fill='#fff'
                  opacity='.9'
                />
              </g>
              <g
                ref={cowEyeLeftRef}
                className='home__cow-eye home__cow-eye--left'
                inkscape:label='eye_left'
                transform='translate(.98 1.86)'>
                <circle cx='748.72' cy='353.52' r='15.31' fill='#803300' />
                <circle cx='748.72' cy='353.52' r='15.31' fill='url(#e)' />
                <circle cx='748.72' cy='353.52' r='15.31' fill='url(#f)' />
                <circle cx='748.72' cy='353.51' r='8.97' />
                <circle
                  cx='753.91'
                  cy='346.01'
                  r='2.63'
                  fill='#fff'
                  opacity='.9'
                />
              </g>
            </g>
            <g inkscape:label='Hair'>
              <path
                fill='#803300'
                stroke='#520'
                strokeWidth='2'
                d='M849.43 185.97s31.2-11.3 42.5-9.7c0 0 21.52 8.62 26.36 14.54l12.38 11.3c2.69-10.22 4.44-32.96 1.61-39.7 0 0-13.45-20.04-20.44-24.35 0 0-6.46-2.15 1.61-7.53 0 0 23-14.91 26.42-20.02-1.46-.2-10.37-4.23-14.09-4.8-12.82-1.94-24.7-1.23-32.64 2.89-7.36 3.81-16.81 5.78-26.5 18.7 0 0-22.05 2.7-32.81 14.53-.54 3.77.53 28.53 15.6 44.14z'
              />
              <path
                fill='#803300'
                stroke='#520'
                strokeWidth='2'
                d='M865.03 226.33s9.15-16.15 2.15-30.14l-18.83-29.06s-15.06-9.15-10.76-22.6c0 0 15.6-16.7 25.83-18.3 0 0-2.16-11.3-10.76-17.23 0 0-16.14-10.76-44.12 4.85 0 0-31.2 12.91-46.27 12.37 0 0-33.66-3.49-42.5-7-5.58-2.2-23.5-11-22.67-22.8 0 0-7.89 11.74-.47 22.8 4.43 6.63 11.3 18.3 27.98 24.23 11.62 4.12 9.14.53 16.14 1.07-19.37 5.39-22.6 6.46-29.06 12.38 0 0-14.4 7.25-20.85 22.86-.86 3.67-7.66 18.58-2.28 25.58a386.46 386.46 0 0 1 28.35-20.36s10.98-4.1 17.07-4.21c-3.97 3.92-2.48 10.3-1.5 15.34.64 3.31 2.72 6.23 4.7 8.97 3.33 4.65 7 9.41 11.88 12.4 4.76 2.92 10.54 3.81 16.03 4.83 4.62.86 10.3 3.2 14.07 1.05-6.99-9.68-19.26-18.21-19.26-24.13 0 0 10.44 1.8 17.97-3.04 2.15 12.92 10.48 19.98 13.45 21.66 7.24 4.08 13.78 8.53 22.06 10.25l7 1.46c-10.23-9.69-10.77-23.14-8.61-30.14l1.61-10.76c5.38 9.68 5.38 9.15 15.06 16.14 0 0 20.85 9.19 24.75 12.38z'
              />
              <path
                fill='#a40'
                d='M764.1 145.95s-10.66 13.32-11.8 17.13c10.27-2.29 19.78-10.28 28.15-11.42l17.12-6.47c-.76 10.65-20.32 44.37-20.32 44.37 6.47-8 33.64-50.84 33.64-50.84 2.66 14.08 1.52 13.32 7.22 26.26 0 0 15.22 17.5 24.35 25.12 0 0 14.46 12.94 14.08 15.98 0 0 5.32 14.36 6.47 16.41-.2-3.33 1.9-17.17 1.14-23.64 0 0-4.94-20-10.65-25.71 0 0-2.02-3.86-3.58-5.5-1.93-2.03-3.27-3.08-6.43-5.94-4.23-3.81-5.04-13.6-4.17-16.37 0 0 11.88-13.88 18.73-15.78 0 0 2-.92 3.52-5.11 0 0-.81-13.49-18.79-18.77l-64.97 19.61 30.03-5.97s-38.8 21.31-44.13 27.78'
              />
              <path
                fill='#a40'
                d='M905.92 130.53s13.18-2.7 16.14-7c0 0 9.42-8.6 9.42-11.57-13.19-3.5-19.37-3.77-26.9-1.61 0 0-19.1 5.11-26.9 11.57 0 0-7 6.46-8.61 11.03 8.33-.8 23.4-7.26 28.24-6.19z'
              />
              <path
                fill='#a40'
                d='M932.55 193.23s1.08-23.95 0-28.52c0 0-8.6-15.07-14.26-19.65l-17.48-14s-10.22.82-15.33 4.58c0 0-7 4.85-2.96 8.34l24.2 16.69c-11.56-1.88-33.15.6-35.8-2.15 0 0 7.83 3.5 14.29 6.45 0 0 16.94-1.61 30.4 12.65z'
              />
            </g>
          </g>
        </svg>

        <svg
          ref={svgShadowRef}
          data-display='true'
          data-blur='true'
          className='home__svg-shadow'
          viewBox='0 0 100 100'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid meet'>
          <defs>
            <path
              id='home_text_path_values_vibecoding'
              d='M 35 60 Q 50 70 65 60'
              stroke='red'
              strokeWidth='.5'
              fill='none'></path>

            {/* Smooth turbulence for the eyes with fractalNoise */}
            <filter
              id='home-svg-turblulence-filter-eyes'
              x='-.3'
              y='-.3'
              width='160%'
              height='160%'>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0 0.05'
                numOctaves='5'
                seed='2'
                result='horizontal_turb'>
                <animate
                  attributeType='XML'
                  attributeName='baseFrequency'
                  begin='home_svg_star_arc_moprh_out.begin'
                  dur='30s'
                  values='0.01 0;0.03 0; 0.01 0;0.03 0;'
                  repeatCount='indefinite'></animate>
              </feTurbulence>
              <feDisplacementMap
                in='SourceGraphic'
                in2='horizontal_turb'
                scale='3'
                xChannelSelector='G'
                yChannelSelector='R'
                result='displace'></feDisplacementMap>
            </filter>
            {/* Turbulence for the mouth with fractalNoise and more frequency & scale */}
            <filter
              id='home-svg-turblulence-filter-mouth'
              x='-.3'
              y='-.3'
              width='160%'
              height='160%'>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0 0.05'
                numOctaves='5'
                seed='2'
                result='horizontal_turb'>
                <animate
                  attributeType='XML'
                  attributeName='baseFrequency'
                  begin='home_svg_star_arc_moprh_out.begin'
                  dur='30s'
                  values='0.015 0;0.035 0; 0.015 0;0.035 0;'
                  repeatCount='indefinite'></animate>
              </feTurbulence>
              <feDisplacementMap
                in='SourceGraphic'
                in2='horizontal_turb'
                scale='5'
                xChannelSelector='G'
                yChannelSelector='R'
                result='displace'></feDisplacementMap>
            </filter>
            {/* Blend of X and Y axes of turbulence for the circle (whole svg) */}
            <filter id='home-svg-turblulence-filter' width='160%' height='160%'>
              <feTurbulence
                type='turbulence'
                baseFrequency='0.03 0.02'
                numOctaves='5'
                result='f_turb'
                seed='2'>
                <animate
                  attributeType='XML'
                  attributeName='baseFrequency'
                  begin='home_svg_star_arc_moprh_out.begin'
                  dur='45s'
                  values='0.04 0.04;0.1 0.1; 0.04 0.04'
                  repeatCount='indefinite'></animate>
              </feTurbulence>
              <feTurbulence
                type='turbulence'
                baseFrequency='0.01 0.03'
                numOctaves='5'
                result='f_turb2'
                seed='4'>
                <animate
                  attributeType='XML'
                  attributeName='baseFrequency'
                  begin='home_svg_star_arc_moprh_out.begin'
                  dur='45s'
                  values=' 0.1 0.1;0.04 0.04; 0.1 0.1'
                  repeatCount='indefinite'></animate>
              </feTurbulence>
              <feBlend
                in='f_turb'
                in2='f_turb2'
                mode='multiply'
                result='BLEND'></feBlend>

              <feDisplacementMap
                in='SourceGraphic'
                in2='BLEND'
                scale='50'
                xChannelSelector='G'
                yChannelSelector='R'
                result='displace'>
                <animate
                  ref={shadowTurblulenceDisplaceAnimRef}
                  id='home_svg_turbulence_displace_anim'
                  attributeType='XML'
                  attributeName='scale'
                  begin='indefinite'
                  dur='1s'
                  fill='freeze'
                  values='50; 2000'></animate>
                {/* Global Reset Starting State */}
                <animate
                  attributeType='XML'
                  attributeName='scale'
                  begin='home_animate_global_reset.begin'
                  dur='0.001s'
                  fill='freeze'
                  values='50'></animate>
              </feDisplacementMap>
            </filter>
          </defs>

          <circle
            cx='40'
            cy='40'
            r='40'
            filter='url(#home-svg-turblulence-filter)'
            opacity='0'>
            <animate
              id='home_svg_turbulence_circle_opacity'
              attributeType='CSS'
              attributeName='opacity'
              dur='2s'
              from='0'
              to='1'
              fill='freeze'
              begin='home_svg_star_arc_moprh_out.begin'></animate>
            {/* Global Reset Starting State */}
            <animate
              attributeType='CSS'
              attributeName='opacity'
              dur='0.001s'
              from='0'
              to='0'
              fill='freeze'
              begin='home_animate_global_reset.begin'></animate>
          </circle>
          <g>
            {/* Group the eyes & mouth and keep the opacity at 0 for 2s
               when the animate on displace begins for the circle */}
            <animate
              attributeType='CSS'
              attributeName='opacity'
              dur='2s'
              values='0'
              begin='home_svg_turbulence_displace_anim.begin'></animate>
            <g filter='url(#home-svg-turblulence-filter-eyes)'>
              <path fill='red'>
                <animate
                  id='home_svg_turbulence_left_eye_open'
                  attributeType='XML'
                  attributeName='d'
                  dur='2.5s'
                  begin='home_svg_turbulence_circle_opacity.end+0.5s'
                  fill='freeze'
                  values='
              m 43,40
              c 0,0.04 -1.77,0.13 -3.98,0.13
              C 36.81,40.13 35,40.04 35,40
              c 0,-0.03 1.82,0.11 4.02,0.11
              C 41.23,40.11 43,39.96 43,40
              Z;
              m 43,40
              c 0,2.21 -1.79,4 -4,4 -2.21,0 -4,-1.79 -4,-4 0,-2.21 1.84,-4 4.04,-4 2.21,0 3.96,1.79 3.96,4
        z;'></animate>
                <animate
                  // Trigger for cracking the glass
                  ref={shadowEyeAngryAnimateRef}
                  attributeType='XML'
                  attributeName='d'
                  dur='.7s'
                  begin='home_svg_turbulence_left_eye_open.end+1.5s'
                  calcMode='spline'
                  keySplines='0.16, 1, 0.3, 1'
                  keyTimes='0; 1'
                  fill='freeze'
                  values='
                m 35,40
            c 0,2.21 1.79,4 4,4 1.52,0 2.85,-0.85 3.52,-2.1
            C 42.83,41.34 43,40.69 43,40 43,37.79 41.21,36 39,36 37.57,36 36.32,36.75 35.61,37.87 35.22,38.49 35,39.22 35,40
            Z;
                    
            m 35,40
            c 0,2.21 1.79,4 4,4 1.52,0 2.85,-0.85 3.52,-2.1 -0.34,-0.27 -0.67,-0.47 -1.02,-0.68 -0.86,-0.52 -1.84,-1.09 -2.88,-1.69
            C 37.45,38.86 36.32,38.25 35.61,37.87 35.22,38.49 35,39.22 35,40
            Z'></animate>
                {/* Global Reset Starting State */}
                <animate
                  attributeType='XML'
                  attributeName='d'
                  dur='0.001s'
                  begin='home_animate_global_reset.begin'
                  fill='freeze'
                  values='
              m 43,40
              c 0,0.04 -1.77,0.13 -3.98,0.13
              C 36.81,40.13 35,40.04 35,40
              c 0,-0.03 1.82,0.11 4.02,0.11
              C 41.23,40.11 43,39.96 43,40
              Z;
             '></animate>
              </path>
              <path fill='red'>
                <animate
                  id='home_svg_turbulence_right_eye_open'
                  attributeType='XML'
                  attributeName='d'
                  dur='2.5s'
                  begin='home_svg_turbulence_circle_opacity.end+0.5s'
                  fill='freeze'
                  values='m 64,40
            c 0,0.04 -1.77,0.13 -3.98,0.13
            C 57.81,40.13 56,40.04 56,40
            c 0,-0.03 1.82,0.11 4.02,0.11
            C 62.23,40.11 64,39.96 64,40
            Z;

            m 64,40
            c 0,2.21 -1.79,4 -4,4 -2.21,0 -4,-1.79 -4,-4 0,-2.21 1.84,-4 4.04,-4
            C 62.25,36 64,37.79 64,40
            Z;'></animate>
                <animate
                  attributeType='XML'
                  attributeName='d'
                  dur='.7s'
                  begin='home_svg_turbulence_right_eye_open.end+1.5s'
                  calcMode='spline'
                  keySplines='0.16, 1, 0.3, 1'
                  keyTimes='0; 1'
                  fill='freeze'
                  values='m 64,40
          c 0,2.21 -1.79,4 -4,4 -1.52,0 -2.85,-0.85 -3.52,-2.1
          C 56.17,41.33 56,40.69 56,40
          c 0,-2.21 1.79,-4 4,-4 1.43,0 2.68,0.75 3.39,1.87
          C 63.78,38.49 64,39.22 64,40
          Z;

          m 63.42,40.1
          c 0,2.21 -1.79,4 -4,4 -1.52,0 -2.85,-0.85 -3.52,-2.1 0.34,-0.27 0.67,-0.47 1.02,-0.68 0.86,-0.52 1.84,-1.09 2.88,-1.69 1.17,-0.67 2.3,-1.28 3.01,-1.66 0.39,0.62 0.61,1.35 0.61,2.13
          z'></animate>
                {/* Global Reset Starting State */}
                <animate
                  attributeType='XML'
                  attributeName='d'
                  dur='0.001s'
                  begin='home_animate_global_reset.begin'
                  fill='freeze'
                  values='
              m 64,40
            c 0,0.04 -1.77,0.13 -3.98,0.13
            C 57.81,40.13 56,40.04 56,40
            c 0,-0.03 1.82,0.11 4.02,0.11
            C 62.23,40.11 64,39.96 64,40
            Z;
             '></animate>
              </path>
            </g>
            <text filter='url(#home-svg-turblulence-filter-mouth)' opacity='0'>
              <textPath
                href='#home_text_path_values_vibecoding'
                stroke='red'
                fill='red'
                fontSize='5px'
                strokeWidth='.1'
                textLength='32px'
                fontFamily='Creepster'>
                VIBECODING
              </textPath>
              <animate
                attributeType='CSS'
                attributeName='opacity'
                dur='2s'
                begin='home_svg_turbulence_left_eye_open.begin'
                from='0'
                to='1'
                fill='freeze'></animate>
              {/* Global Reset Starting State */}
              <animate
                attributeType='CSS'
                attributeName='opacity'
                dur='0.001s'
                begin='home_animate_global_reset.begin'
                from='0'
                to='0'
                fill='freeze'></animate>
            </text>
          </g>
        </svg>
      </div>
      <div className='home__svg-button-container'>
        <p
          id='home-svg-button-description'
          className='visually-hidden'
          aria-hidden='true'>
          Restarts the animations and is enabled and visible only when the
          animations are not playing.
        </p>
        <svg
          role='button'
          tabIndex='0'
          aria-disabled={animationsPlayState === 'iddle' ? 'false' : 'true'}
          aria-label='One more time!'
          aria-describedby='home-svg-button-description'
          ref={svgButtonRef}
          className='home__svg-button'
          viewBox='0 0 120 40'
          version='1.1'
          width='100%'
          height='100%'
          onKeyDown={handleReverseAnimationsKeypress}>
          <defs>
            <filter id='home_button_filter_shadow'>
              <feDropShadow
                dx='1'
                dy='1'
                stdDeviation='1'
                floodColor='hsl(180, 30%, 25%)'
                floodOpacity='.8'
              />
            </filter>
            <linearGradient
              id='home_button_glassy_gradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'>
              <stop
                offset='0%'
                stopColor='hsl(180, 45%, 84%)'
                stopOpacity='0.6'
              />
              <stop
                offset='50%'
                stopColor='hsl(180, 100%, 21%)'
                stopOpacity='0.3'
              />
              <stop
                offset='100%'
                stopColor='hsl(180, 100%, 13%)'
                stopOpacity='0.5'
              />
            </linearGradient>
            {/* Animating a clip path instead of just directly scaling the "glass" rect,
               is providing better results. */}
            <clipPath
              id='home_button_clip_glass_rect'
              clipPathUnits='objectBoundingBox'>
              <rect
                className='home__svg-button-clip-rect'
                x='0'
                y='0'
                width='1'
                height='1'
                transform='scale(1 0)'>
                <animateTransform
                  attributeName='transform'
                  attributeType='XML'
                  type='scale'
                  calcMode='spline'
                  keyTimes='0;1'
                  keySplines='.27 .20 .7 1'
                  values='1 1; 1 0'
                  dur='.3s'
                  begin={
                    motionOk
                      ? 'home_svg_button_rect_placeholder.mouseenter;'
                      : ''
                  }
                  restart='whenNotActive'
                  fill='freeze'
                />
                <animateTransform
                  ref={svgButtonRectClipScaleUpAnimateRef}
                  attributeName='transform'
                  attributeType='XML'
                  type='scale'
                  calcMode='spline'
                  keyTimes='0;1'
                  keySplines='.37 1 1 1'
                  values='1 0; 1 1'
                  dur='.25s'
                  begin={
                    motionOk
                      ? 'home_svg_button_rect_placeholder.mouseleave; indefinite'
                      : ''
                  }
                  restart='whenNotActive'
                  fill='freeze'
                />
                {/* Iddle */}
                <animateTransform
                  ref={svgButtonRectClipIddleStateAnimateRef}
                  attributeName='transform'
                  attributeType='XML'
                  type='scale'
                  values='1 0; 1 1'
                  dur='.001s'
                  begin='indefinite'
                  fill='freeze'
                />
                {/* Global Reset */}
                <animateTransform
                  attributeName='transform'
                  attributeType='XML'
                  type='scale'
                  values='1 1; 1 0'
                  dur='.001s'
                  begin='home_animate_global_reset.begin;'
                  fill='freeze'
                />
              </rect>
            </clipPath>
          </defs>
          <rect
            ref={svgButtonRectBackRef}
            filter='url(#home_button_filter_shadow)'
            className='test__rect'
            x='5%'
            y='25%'
            rx='5'
            pathLength='20'
            strokeDasharray='20 0 20'
            strokeDashoffset='-21'
            width='90%'
            height='50%'
            strokeWidth='.5'
            stroke='hsl(180, 45%, 84%)'
            fillOpacity='0'
            fill='hsla(180, 25%, 44%, 1)'></rect>

          <g strokeWidth='.1'>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(0, node)
                  : getMap(svgButtonGroupedPathsRef).delete(0)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='m14.28 16.9-.98.7-.3.27c-.32.38-.48 1-.48 1.88 0 .87.16 1.5.48 1.87.32.38.76.57 1.32.57.41 0 .76-.1 1.04-.3l.98-.69c-.28.2-.63.3-1.04.3-.56 0-1-.2-1.32-.57-.32-.38-.48-1-.48-1.87 0-.87.16-1.5.49-1.88.09-.1.18-.2.3-.27z' />
                <path d='M15.28 14.6c-1.13 0-2.06.26-2.8.78l-.97.69c-.17.12-.33.25-.47.4l.98-.7a5.1 5.1 0 0 1 2.28-.47c1.43 0 2.53.38 3.3 1.15a4.33 4.33 0 0 1 1.17 3.22c0 1-.17 1.83-.51 2.47-.21.4-.48.75-.8 1.04l-.67.46c.12-.06.24-.14.35-.22l.97-.68.01-.01c.47-.33.84-.76 1.12-1.28.34-.64.5-1.47.5-2.47 0-1.38-.38-2.46-1.15-3.22a4.5 4.5 0 0 0-3.3-1.16z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M9.87 19.74q0-2.1 1.17-3.27t3.26-1.17q2.15 0 3.3 1.15 1.17 1.15 1.17 3.22 0 1.5-.51 2.47-.5.97-1.47 1.5-.95.54-2.38.54-1.46 0-2.41-.46-.95-.47-1.54-1.47-.6-1-.6-2.5zm2.65.01q0 1.3.48 1.87.49.57 1.32.57.85 0 1.32-.55.47-.56.47-2 0-1.22-.49-1.77-.49-.56-1.32-.56-.8 0-1.3.56-.48.57-.48 1.88z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(1, node)
                  : getMap(svgButtonGroupedPathsRef).delete(1)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M25.42 16.9c-.48 0-.9.08-1.24.26a2.5 2.5 0 0 0-.46.32l-.55.46v-.9h-2.22l-.91.77h2.22v1.01l.91-.77v-.06l.1-.05c.34-.18.75-.27 1.24-.27.66 0 1.17.2 1.55.59.37.4.56 1 .56 1.82v3.95l.91-.77V19.3c0-.82-.18-1.43-.56-1.82-.37-.4-.89-.59-1.55-.59z' />
                <path d='m23.6 19.09-.9.78c-.19.21-.28.6-.28 1.17v3l.92-.78v-3c0-.56.09-.95.27-1.17z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M20.04 17.8h2.22v1.02q.5-.62 1-.88.52-.27 1.25-.27.99 0 1.55.59t.56 1.82v3.95h-2.4v-3.42q0-.59-.22-.83-.21-.24-.6-.24-.44 0-.7.33-.28.32-.28 1.17v3h-2.38z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(2, node)
                  : getMap(svgButtonGroupedPathsRef).delete(2)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='m31.22 18.6-.77.93c-.14.19-.24.47-.28.84h2.35l.77-.92h-2.35c.04-.37.13-.65.28-.84z' />
                <path d='m30.93 20.59-.76.92c.04.38.15.67.3.86.24.27.54.4.91.4.24 0 .46-.06.67-.17.12-.07.24-.18.37-.34l.05-.06 2.35.22c-.14.23-.28.43-.43.61l.77-.92c.15-.18.29-.39.42-.61l-2.35-.22-.08.1c-.12.14-.23.23-.33.3-.22.11-.44.17-.67.17-.37 0-.67-.14-.9-.4a1.54 1.54 0 0 1-.32-.86z' />
                <path d='M32.02 16.74a3.57 3.57 0 0 0-2.8 1.15l-.77.93.22-.25c.63-.6 1.5-.9 2.59-.9.89 0 1.6.13 2.1.4.52.27.92.66 1.19 1.17.27.52.4 1.18.4 2v.27l.77-.92v-.27c0-.82-.14-1.49-.4-2a2.8 2.8 0 0 0-1.19-1.17 4.6 4.6 0 0 0-2.1-.4z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M34.95 21.51h-4.78q.06.58.3.86.35.4.91.4.35 0 .67-.17.2-.12.42-.4l2.34.22q-.53.94-1.3 1.35-.76.4-2.18.4-1.24 0-1.95-.34-.7-.36-1.17-1.11-.47-.76-.47-1.79 0-1.46.93-2.36.94-.9 2.59-.9 1.33 0 2.1.4.78.4 1.19 1.17.4.77.4 2zm-2.43-1.14q-.07-.7-.37-1-.3-.29-.8-.29-.56 0-.9.45-.22.28-.28.84z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(3, node)
                  : getMap(svgButtonGroupedPathsRef).delete(3)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M44.94 16.58c-.46 0-.85.08-1.18.24-.32.16-.65.43-.97.8v-.9h-2.22l-.5 1.09h2.22v.9c.32-.37.64-.64.97-.8.33-.16.72-.24 1.18-.24.5 0 .9.09 1.18.26.29.18.53.44.7.79a4 4 0 0 1 1.03-.83c.31-.15.7-.22 1.15-.22.66 0 1.19.2 1.56.6.38.4.56 1.01.56 1.85v3.91l.5-1.09v-3.9c0-.85-.18-1.47-.56-1.86-.37-.4-.9-.6-1.56-.6-.46 0-.84.07-1.14.22-.31.15-.65.42-1.03.83a2.01 2.01 0 0 0-.7-.79 2.26 2.26 0 0 0-1.19-.26z' />
                <path d='m47.17 18.95-.5 1.09c-.1.2-.14.46-.14.78v3.21l.5-1.09v-3.21c0-.33.05-.59.14-.78z' />
                <path d='m43.1 18.94-.5 1.1a2 2 0 0 0-.14.82v3.17l.5-1.09v-3.17a2 2 0 0 1 .14-.83z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M40.06 17.8h2.23v.92q.48-.57.97-.81.5-.24 1.18-.24.75 0 1.18.26.43.27.7.79.57-.61 1.03-.83.47-.22 1.15-.22 1 0 1.56.6.56.59.56 1.85v3.91h-2.39V20.5q0-.43-.16-.63-.24-.32-.6-.32-.42 0-.68.3-.26.3-.26.98v3.21h-2.39V20.6q0-.4-.04-.55-.08-.24-.27-.38-.18-.14-.44-.14-.4 0-.67.3-.26.32-.26 1.03v3.17h-2.4z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(4, node)
                  : getMap(svgButtonGroupedPathsRef).delete(4)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M55.4 16.47c-1.08 0-1.95.31-2.59.93a3.04 3.04 0 0 0-.94 2.02l-.1 1.19a4 4 0 0 0-.02.33l.06-.64c.11-.67.41-1.24.9-1.7a3.6 3.6 0 0 1 2.6-.93c1.25 0 2.19.36 2.83 1.08a3.14 3.14 0 0 1 .75 2.49l.1-1.2.01-.33a3.1 3.1 0 0 0-.77-2.15c-.63-.73-1.57-1.09-2.82-1.09z' />
                <path d='m54.24 19.74-.1 1.2c0 .55.12.96.34 1.22.23.27.5.4.85.4.34 0 .62-.13.84-.4.18-.2.29-.52.32-.94l.1-1.2a1.6 1.6 0 0 1-.32.95c-.22.26-.5.4-.84.4-.34 0-.63-.14-.85-.4-.23-.27-.34-.68-.34-1.23z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M51.75 20.94q0-1.43.97-2.35.96-.92 2.6-.92 1.86 0 2.82 1.08.76.88.76 2.15 0 1.44-.95 2.36-.95.91-2.63.91-1.5 0-2.43-.76-1.14-.94-1.14-2.47zm2.4 0q0 .82.33 1.22.34.4.85.4t.84-.4q.34-.38.34-1.25 0-.81-.34-1.2-.33-.4-.82-.4-.53 0-.87.4-.33.4-.33 1.22z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(5, node)
                  : getMap(svgButtonGroupedPathsRef).delete(5)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M63.71 16.47c-.33 0-.62.09-.85.26-.2.14-.4.4-.58.75l-.08-.87h-2.23v6.23l.1 1.2V17.8h2.15l.09 1.02c.21-.44.43-.75.66-.91.23-.17.51-.25.85-.25.35 0 .74.1 1.15.33l-.1-1.2a2.5 2.5 0 0 0-1.16-.33z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M60.07 17.8h2.24v1.03q.32-.66.66-.91t.85-.25q.53 0 1.15.33l-.74 1.7q-.42-.18-.66-.18-.47 0-.73.39-.37.54-.37 2.04v2.08h-2.4z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(6, node)
                  : getMap(svgButtonGroupedPathsRef).delete(6)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='m67.51 20.5.21 1.19c.06.3.15.52.29.68.23.27.53.4.9.4.24 0 .46-.06.67-.17.13-.08.27-.2.41-.4l2.35.22-.2-1.18-2.36-.22c-.14.19-.28.32-.41.4-.21.11-.44.17-.67.17-.37 0-.67-.13-.9-.4a1.38 1.38 0 0 1-.29-.68z' />
                <path d='M68.58 16.49c-1.1 0-1.96.3-2.59.9-.62.6-.93 1.39-.93 2.36a4 4 0 0 0 .06.7l.21 1.18a4 4 0 0 1-.06-.7c0-.97.31-1.76.93-2.36a3.6 3.6 0 0 1 2.59-.9c.89 0 1.6.13 2.1.4.52.27.92.66 1.18 1.17.15.29.26.61.33.99l-.21-1.18a3.5 3.5 0 0 0-.33-.99 2.8 2.8 0 0 0-1.17-1.17 4.6 4.6 0 0 0-2.11-.4z' />
                <path d='M67.7 20.37h2.35l-.2-1.18h-2.36z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M72.48 21.51H67.7q.06.58.3.86.35.4.91.4.35 0 .67-.17.2-.12.41-.4l2.35.22q-.53.94-1.3 1.35-.76.4-2.18.4-1.24 0-1.95-.34-.7-.36-1.18-1.11-.46-.76-.46-1.79 0-1.46.93-2.36.94-.9 2.59-.9 1.33 0 2.1.4.78.4 1.18 1.17.4.77.4 2zm-2.43-1.14q-.07-.7-.37-1-.3-.29-.8-.29-.56 0-.9.45-.22.28-.28.84z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(7, node)
                  : getMap(svgButtonGroupedPathsRef).delete(7)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='m80.04 14.31-2.39 1.23v1.14h-.88v1.74l.41 1.13V17.8h.88v-1.14l2.4-1.23zm0 2.37.41 1.13h1.32l-.41-1.13Zm-2.39 1.74v2.2c0 .64.06 1.12.17 1.44l.42 1.12a4.5 4.5 0 0 1-.18-1.44v-2.2z' />
                <path d='m80.12 21.16.41 1.13c.08.13.21.2.41.2.18 0 .42-.06.74-.16l-.41-1.13c-.32.1-.56.16-.74.16-.2 0-.33-.07-.41-.2z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M80.45 15.44v2.37h1.32v1.74h-1.32v2.2q0 .4.08.54.12.2.41.2.26 0 .74-.16l.17 1.65q-.88.2-1.65.2-.89 0-1.31-.24-.42-.22-.63-.69-.2-.47-.2-1.5v-2.2h-.88V17.8h.88v-1.14z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(8, node)
                  : getMap(svgButtonGroupedPathsRef).delete(8)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M82.48 14.35v1.63l.51 1.08v-1.62h2.39l-.51-1.09z' />
                <path d='M82.48 16.72v6.22l.51 1.1V17.8h2.39l-.51-1.09z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M83 15.44v1.62h2.38v-1.62zm0 2.37v6.22h2.38v-6.22z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(9, node)
                  : getMap(svgButtonGroupedPathsRef).delete(9)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M90.7 16.63c-.47 0-.86.08-1.19.24-.21.1-.43.26-.64.46l-.33-.56h-2.22v6.22l.6 1.04v-6.22h1.7l.52.9c.32-.37.65-.64.97-.8.33-.16.72-.24 1.18-.24.5 0 .9.09 1.18.26.24.15.45.36.62.62l.09.17c.38-.4.72-.68 1.03-.83.3-.15.69-.22 1.14-.22.67 0 1.19.2 1.56.6.09.09.16.19.23.3l-.6-1.04a1.63 1.63 0 0 0-.23-.3c-.37-.4-.9-.6-1.56-.6-.45 0-.84.07-1.14.22-.31.15-.65.42-1.03.83l-.04-.08c-.18-.31-.4-.55-.67-.7a2.26 2.26 0 0 0-1.18-.27z' />
                <path d='M94.37 18.9c.08.13.11.31.11.55v3.54l.6 1.04V20.5c0-.24-.03-.43-.11-.56z' />
                <path d='M90.35 19c.03.1.04.3.04.56V23l.6 1.04V20.6c0-.27-.01-.46-.04-.55z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M86.92 17.8h2.22v.92q.48-.57.97-.81.5-.24 1.18-.24.75 0 1.18.26.43.27.71.79.56-.61 1.03-.83.46-.22 1.14-.22 1 0 1.56.6.57.59.57 1.85v3.91h-2.4V20.5q0-.43-.16-.63-.24-.32-.6-.32-.42 0-.68.3-.25.3-.25.98v3.21h-2.4V20.6q0-.4-.04-.55-.08-.24-.27-.38-.18-.14-.44-.14-.4 0-.67.3-.26.32-.26 1.03v3.17h-2.4z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(10, node)
                  : getMap(svgButtonGroupedPathsRef).delete(10)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M102.34 18.52c.16.2.26.5.3.9h-2.35l.74.95h2.35a1.7 1.7 0 0 0-.3-.9z' />
                <path d='M102.58 21.26c-.14.19-.28.32-.41.39-.21.12-.44.18-.67.18-.37 0-.67-.14-.9-.4l.74.94c.23.27.53.4.9.4.23 0 .46-.06.67-.17.13-.08.26-.2.41-.4l2.35.22-.74-.95z' />
                <path d='M101.38 16.72c-1.1 0-1.96.3-2.59.9-.62.6-.93 1.4-.93 2.37a3.37 3.37 0 0 0 .68 2.1l.74.94-.22-.31c-.3-.5-.46-1.1-.46-1.79 0-.97.31-1.76.93-2.36a3.6 3.6 0 0 1 2.59-.9c.89 0 1.59.13 2.1.4.37.2.67.44.9.75l-.73-.95c-.24-.3-.54-.55-.9-.74a4.59 4.59 0 0 0-2.11-.4z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M105.8 21.51h-4.77q.06.58.3.86.35.4.9.4.36 0 .68-.17.19-.12.41-.4l2.35.22q-.54.94-1.3 1.35-.76.4-2.18.4-1.24 0-1.95-.34-.7-.36-1.18-1.11-.46-.76-.46-1.79 0-1.46.93-2.36.94-.9 2.59-.9 1.33 0 2.1.4.78.4 1.18 1.17.4.77.4 2zm-2.42-1.14q-.07-.7-.37-1-.3-.29-.8-.29-.56 0-.9.45-.22.28-.28.84z'
              />
            </g>
            <g
              ref={(node) =>
                node
                  ? getMap(svgButtonGroupedPathsRef).set(11, node)
                  : getMap(svgButtonGroupedPathsRef).delete(11)
              }
              className='home__svg-button-letter'>
              <g fill='hsl(180, 50%, 45%)' stroke='hsl(180, 50%, 45%)'>
                <path d='M106.06 14.6v1.95l.48 3.93.85.85-.48-3.93v-1.96h2.55l-.85-.85z' />
                <path d='M106.15 21.08v2.1l.85.85v-2.1h2.38l-.85-.85z' />
              </g>
              <path
                fill='hsl(180, 10%, 95%)'
                stroke='hsl(180, 10%, 95%)'
                d='M106.9 15.44v1.96l.49 3.93h1.58l.49-3.93v-1.96zm.1 6.49v2.1h2.38v-2.1z'
              />
            </g>
          </g>
          <rect
            ref={svgButtonRectFrontRef}
            clipPath='url(#home_button_clip_glass_rect)'
            x='5%'
            y='25%'
            rx='5'
            width='90%'
            height='50%'
            stroke='none'
            fill='url(#home_button_glassy_gradient)'></rect>
          {/* Used as a placeholder for mouse events, the rect above is clipped so events dont
          trigger when it shrinks down */}
          <rect
            ref={svgButtonRectPlaceholderRef}
            id='home_svg_button_rect_placeholder'
            className='home__svg-button-rect-placeholder'
            data-display='false'
            x='5%'
            y='25%'
            rx='5'
            width='90%'
            height='50%'
            fill='transparent'
            stroke='transparent'
            onClick={handleReverseAnimationsClick}></rect>
          <rect
            className='home__svg-button-rect-outline'
            x='3%'
            y='20%'
            rx='7'
            width='94%'
            height='60%'
            fill='none'
            strokeWidth='.8'
            stroke='transparent'></rect>
        </svg>
      </div>
      <div
        ref={glassContainerRef}
        className='home__svg-glass-container'
        data-display='true'>
        <svg
          className='home__svg-glass'
          width='100%'
          height='100%'
          viewBox='0 0 100 100'
          version='1.1'>
          <defs>
            <linearGradient id='glassGradient1' gradientTransform='rotate(45)'>
              <stop offset='0%' stopColor='hsla(175, 100.00%, 89%, 0.30)' />
              <stop offset='100%' stopColor='hsla(175, 100.00%, 19%, 0.20)' />
            </linearGradient>
          </defs>

          <g
            fill='none'
            stroke='white'
            strokeOpacity='.5'
            strokeLinejoin='bevel'
            strokeMiterlimit='0'
            strokeWidth='.2'>
            {homeSvgGlassPathsArray.map((d, index) => (
              <path
                className={`${toggleGlassClassName}${index}`}
                // className='home__svg-glass-full'
                key={index}
                ref={(node) =>
                  node
                    ? getMap(glassPathsRef).set(index, node)
                    : getMap(glassPathsRef).delete(index)
                }
                d={d}
                pathLength='20'
                strokeDasharray='0 20 20'
                strokeDashoffset='0'></path>
            ))}
          </g>
          {/* Glass Index Numbers 
          (used for development)*/}
          {/* <g stroke='darkorange' strokeWidth='.2' fontSize='1'>
            <text x='45.03' y='36.33'>
              0
            </text>
            <text x='48.79' y='35.62'>
              1
            </text>
            <text x='52.64' y='35.93'>
              2
            </text>
            <text x='46.89' y='41.06'>
              3
            </text>
            <text x='51.62' y='41.01'>
              4
            </text>
            <text x='51.49' y='45.74'>
              5
            </text>
            <text x='55.15' y='36.28'>
              6
            </text>
            <text x='57.36' y='39.69'>
              7
            </text>
            <text x='63.86' y='38.4'>
              8
            </text>
            <text x='64.66' y='42.34'>
              9
            </text>
            <text x='60.9' y='44.42'>
              10
            </text>
            <text x='56.48' y='46.18'>
              11
            </text>
            <text x='65.5' y='47.86'>
              12
            </text>
            <text x='66.07' y='52.24'>
              13
            </text>
            <text x='62.14' y='52.99'>
              14
            </text>
            <text x='56.92' y='50.25'>
              15
            </text>
            <text x='56.35' y='53.52'>
              16
            </text>
            <text x='59.31' y='57.28'>
              17
            </text>
            <text x='62.89' y='58.69'>
              18
            </text>
            <text x='63.11' y='62.53'>
              19
            </text>
            <text x='55.24' y='57.89'>
              20
            </text>
            <text x='54.89' y='63.99'>
              21
            </text>
            <text x='52.15' y='57.98'>
              22
            </text>
            <text x='50.87' y='66.51'>
              23
            </text>
            <text x='45.17' y='65.19'>
              24
            </text>
            <text x='42.16' y='64.39'>
              25
            </text>
            <text x='46.71' y='57.98'>
              26
            </text>
            <text x='45.43' y='52.9'>
              27
            </text>
            <text x='41.28' y='60.94'>
              28
            </text>
            <text x='35.71' y='58.69'>
              29
            </text>
            <text x='34.87' y='54.18'>
              30
            </text>
            <text x='39.02' y='54.54'>
              31
            </text>
            <text x='38.45' y='52.1'>
              32
            </text>
            <text x='41.72' y='49.54'>
              33
            </text>
            <text x='44.68' y='48.97'>
              34
            </text>
            <text x='35.71' y='46.14'>
              35
            </text>
            <text x='37.08' y='40.75'>
              36
            </text>
            <text x='41.63' y='41.28'>
              37
            </text>
            <text x='39.82' y='37.43'>
              38
            </text>
            <text x='49.5' y='49' fontSize='1'>
              39
            </text>
            <text x='52.5' y='49' fontSize='1'>
              40
            </text>
            <text x='51.5' y='51.5' fontSize='1'>
              41
            </text>
            <text x='49' y='52' fontSize='1'>
              42
            </text>
            <text x='48' y='50' fontSize='1'>
              43
            </text>
          </g> */}
        </svg>
      </div>
      <div ref={conicWrapperRef} className='home__conic-wrapper'>
        <div ref={conicInsideRef} className='home__conic-inside'>
          <div className='home__conic home__conic--1'></div>
          <div className='home__conic home__conic--2'></div>
          <div className='home__conic home__conic--3'></div>
          <div
            ref={conicBackDarkRef}
            className='home__conic home__conic--4'></div>
        </div>
      </div>

      <div
        ref={beamAndBubbleContainerRef}
        className='home__beam-bubble-container'
        data-display='true'>
        <div ref={svgBubbleRef} className='home__bubble-container'>
          <svg version='1.1' width='100%' height='100%'>
            <defs>
              <clipPath id='home-bubble-clip' clipPathUnits='objectBoundingBox'>
                <path
                  className='home__path-animate'
                  stroke='purple'
                  fill='none'
                  strokeWidth='.01'>
                  <animate
                    ref={svgBubbleClipAnimateRef}
                    attributeType='XML'
                    attributeName='d'
                    dur='.6s'
                    keyTimes='0; 0.2; 1'
                    fill='freeze'
                    begin='indefinite'
                    values='
                    m 0.47,0.784 -0.05,-0.169 0.014,0.173
c 0.002,0.019 0.003,0.053 -0.007,0.057 -0.012,0.005 -0.032,-0.003 -0.043,-0.016
l -0.085,-0.083 0.056,0.099
c 0.008,0.014 0.016,0.033 0.008,0.045 -0.008,0.014 -0.03,0.014 -0.044,0.008
l -0.148,-0.041 0.142,0.072
c 0.01,0.005 0.017,0.018 0.017,0.029 -0.001,0.013 -0.024,0.032 -0.024,0.032
L 0.709,0.994 0.831,0.935 0.708,0.959
c -0.006,0.001 -0.014,-0.005 -0.016,-0.011 -0.003,-0.008 0.002,-0.018 0.008,-0.024
l 0.052,-0.044 -0.072,0.019
c -0.012,0.003 -0.027,0.016 -0.036,0.007 -0.01,-0.01 0.002,-0.029 0.01,-0.041
L 0.718,0.739 0.599,0.841
c -0.012,0.011 -0.038,0.03 -0.054,0.026 -0.015,-0.003 -0.023,-0.02 -0.019,-0.035
l 0.033,-0.127 -0.059,0.1
c -0.003,0.006 -0.005,0.016 -0.012,0.017 -0.016,0.002 -0.016,-0.023 -0.019,-0.039
z;
                    M 0.47,0.784 0.378,0.181 0.434,0.788
c 0.002,0.019 0.003,0.053 -0.007,0.057 -0.012,0.005 -0.032,-0.003 -0.043,-0.016
l -0.085,-0.083 0.056,0.099
c 0.008,0.014 0.016,0.033 0.008,0.045 -0.008,0.014 -0.03,0.014 -0.044,0.008
L 0.002,0.782 0.313,0.931
c 0.01,0.005 0.017,0.018 0.017,0.029 -0.001,0.013 -0.024,0.032 -0.024,0.032
L 0.709,0.994 0.892,0.904 0.708,0.959
C 0.702,0.961 0.695,0.955 0.693,0.949 0.69,0.941 0.695,0.93 0.701,0.925
L 0.781,0.856 0.681,0.9
c -0.011,0.005 -0.027,0.016 -0.036,0.007 -0.01,-0.01 0.002,-0.029 0.01,-0.041
L 0.856,0.55 0.599,0.841
c -0.011,0.012 -0.038,0.03 -0.054,0.026 -0.015,-0.003 -0.023,-0.02 -0.019,-0.035
l 0.066,-0.224 -0.091,0.197
c -0.003,0.006 -0.005,0.016 -0.012,0.017 -0.016,0.002 -0.016,-0.023 -0.019,-0.039
z;
m 0.463,0.778 -0.023,-0.096 0.007,0.107
c 0.001,0.019 -0.011,0.052 -0.02,0.056 -0.012,0.005 -0.032,-0.003 -0.043,-0.016
L 0.115,0.489 0.317,0.813
c 0.01,0.015 0.014,0.022 0.02,0.036 0.012,0.027 0.006,0.06 -0.008,0.056
L 0.206,0.867 0.313,0.931
c 0.01,0.006 0.017,0.018 0.017,0.029 -0.001,0.013 -0.024,0.032 -0.024,0.032
L 0.709,0.994 0.806,0.939 0.733,0.954
C 0.72,0.957 0.713,0.945 0.714,0.931 0.714,0.915 0.738,0.9 0.756,0.886
L 0.984,0.704 0.707,0.867
c -0.011,0.006 -0.058,0.037 -0.073,0.027 -0.012,-0.008 -0.01,-0.023 -0.001,-0.034
l 0.073,-0.107 -0.1,0.082
c -0.015,0.012 -0.042,0.024 -0.055,0.004 -0.006,-0.009 0.003,-0.047 0.004,-0.052
L 0.67,0.44 0.518,0.746
c -0.003,0.006 -0.018,0.043 -0.029,0.053 -0.012,0.011 -0.022,-0.005 -0.026,-0.021
z'
                  />
                </path>
              </clipPath>
            </defs>
          </svg>
          {/* Two blurs are stacked to create a more vibrant effect */}
          <div className='home__bubble-blur-wrapper'>
            <div className='home__bubble-blur'></div>
          </div>
          <div className='home__bubble-blur-wrapper'>
            <div className='home__bubble-blur'></div>
          </div>
          <div className='home__bubble'></div>
        </div>

        <div ref={beamRef} className='home__beam-wrapper'>
          <div className='home__beam'>
            <svg version='1.1' width='100%' height='100%'>
              <defs>
                <clipPath id='home-beam-clip' clipPathUnits='objectBoundingBox'>
                  <rect x='0' y='0' width='1' height='1' rx='.25'></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className='home__beam-blur'>
            <svg version='1.1' width='100%' height='100%'>
              <defs>
                <clipPath id='home-blur-clip' clipPathUnits='objectBoundingBox'>
                  <rect x='-5' y='-5' width='10' height='10'></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* <svg
        version='1.1'
        width='500'
        height='500'
        viewBox='0 0 100 200'
        className='home__arrows'
        preserveAspectRatio='xMidYMid meet'>
        <defs>
          <radialGradient id='yellowGradient'>
            <stop offset='10%' stopColor='#f2d031' />
            <stop offset='90%' stopColor='#fff064' />
          </radialGradient>
          <pattern
            id='circles-pattern'
            x='0'
            y='0'
            width='2.5'
            height='2.5'
            viewBox='0 0 100 100'
            patternUnits='userSpaceOnUse'>
            <rect x='0' y='0' width='100' height='100' fill='black'></rect>
            <circle
              ref={(node) =>
                node
                  ? (circlePatternRef.current.node = node)
                  : (circlePatternRef.current.node = null)
              }
              cx='50'
              cy='50'
              r='40'
              fill='url(#yellowGradient)'
              fillOpacity='0'
              className='circ'
            />
          </pattern>
          <pattern
            id='circles-pattern2'
            x='0'
            y='0'
            width='2.5'
            height='2.5'
            viewBox='0 0 100 100'
            patternUnits='userSpaceOnUse'>
            <rect x='0' y='0' width='100' height='100' fill='black'></rect>
            <circle
              ref={(node) =>
                node
                  ? (circlePatternRef2.current.node = node)
                  : (circlePatternRef2.current.node = null)
              }
              cx='50'
              cy='50'
              r='40'
              fill='url(#yellowGradient)'
              fillOpacity='0'
              className='circ2'
            />
          </pattern>
          <pattern
            id='circles-pattern3'
            x='0'
            y='0'
            width='2.5'
            height='2.5'
            viewBox='0 0 100 100'
            patternUnits='userSpaceOnUse'>
            <rect x='0' y='0' width='100' height='100' fill='black'></rect>
            <circle
              ref={(node) =>
                node
                  ? (circlePatternRef3.current.node = node)
                  : (circlePatternRef3.current.node = null)
              }
              cx='50'
              cy='50'
              r='40'
              fill='url(#yellowGradient)'
              fillOpacity='0'
              className='circ3'
            />
          </pattern>
          <polyline
            id='arrow'
            points='10,20 10,40 50,90 90,40 90,20 50,70 10,20'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.2'
            strokeLinejoin='butt'></polyline>
          <polyline
            id='arrow2'
            points='5,5 5,25 50,75 95,25 95,5 50,55 5,5'
            stroke='black'
            strokeWidth='.5'
            strokeOpacity='.2'
            strokeLinejoin='butt'></polyline>
        </defs>

        <use href='#arrow' fill='url(#circles-pattern)'></use>
        <use href='#arrow' y='50' fill='url(#circles-pattern2)'></use>
        <use href='#arrow' y='100' fill='url(#circles-pattern3)'></use>
      </svg> */}
    </article>
  );
};

export default Home;
