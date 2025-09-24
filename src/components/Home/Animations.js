export const letterAnimationArgs = {
  // Left & Right side animation iterations are getting updated programmatically when the animation method is called
  leftSide: {
    keyframes: [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.22 },
      { opacity: 1, offset: 0.23 },
      { opacity: 1, offset: 0.26 },
      { opacity: 0, offset: 0.27 },
      { opacity: 0, offset: 1 },
    ],
    options: { duration: 500, iterations: 5 },
  },

  rightSide: {
    keyframes: [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.72 },
      { opacity: 1, offset: 0.73 },
      { opacity: 1, offset: 0.76 },
      { opacity: 0, offset: 0.77 },
      { opacity: 0, offset: 1 },
    ],
    options: { duration: 500, iterations: 5 },
  },

  boxEntrance: {
    keyframesFn: (protrusionSize) => {
      // Box
      // the box has a default transform: translateZ(- some pxs) in order to place back the whole scene in its default
      // position and not be zoomed in also i read that it helps in letter anti-aliasing
      const zAxisOriginal = -((protrusionSize - 1) / 2);
      return [
        {
          transform: `translateZ(${zAxisOriginal}px) rotateY(0deg)`,
          offset: 0,
        },
        {
          transform: `translateZ(${zAxisOriginal}px) rotateY(180deg)`,
          offset: 0.5,
        },
        {
          transform: `translateZ(${zAxisOriginal}px) rotateY(360deg)`,
          offset: 1,
        },
      ];
    },
    options: { duration: 500, iterations: 5 },
  },
  boxEnding: {
    keyframesFn: (protrusionSize) => {
      // Box
      // the box has a default transform: translateZ(- some pxs) in order to place back the whole scene in its default
      // position and not be zoomed in also i read that it helps in letter anti-aliasing
      const zAxisOriginal = -((protrusionSize - 1) / 2);
      return [
        {
          transform: `translateZ(${zAxisOriginal}px) translateY(0px) rotateX(0deg)`,
          offset: 0,
        },
        {
          transform: `translateZ(${zAxisOriginal}px) translateY(-20px) rotateX(20deg)`,
          offset: 1,
        },
      ];
    },
    options: { duration: 1200, fill: 'forwards' },
  },
  container: {
    keyframes: [
      {
        transform: 'scale(1)',
        opacity: 1,
        offset: 0,
      },
      {
        transform: 'scale(1.5)',
        offset: 0.5,
      },
      {
        transform: 'scale(1)',
        opacity: 1,
        offset: 1,
      },
    ],

    options: { duration: 500, fill: 'forwards' },
  },
  // Make each letter rotate(Y) at a different number of iterations for visual effect
  differentiateIterationsFn: (i) => {
    // i[0 - 6] > M O O V I E S
    // The 3rd and 4rth letter are not animating really well, so i limit the iterations on those (perpendicular angle problem & letter shape)
    let iterations = 1;
    switch (i) {
      case 0:
      case 6:
        // M, S
        iterations = 5;
        break;
      case 1:
      case 4:
        // O(1), I
        iterations = 3;
        break;
      case 2:
      case 3:
        // O(2), V
        iterations = 2;
        break;
      case 5:
        // E
        iterations = 5;
        break;
      default:
        iterations = 1;
    }

    return iterations;
  },
};

export const svgAnimationArgs = {
  // Define X,Y and position based on the aspect ratio of the screen
  // X & Y must match the ellispe X & Y of the letters container(3d-scene) applied via CSS.
  // Used in combination with the letterEntrance Animation
  containerDesktop: {
    // Landscape
    keyframes: [
      {
        offsetPath: 'ellipse(55vmin 35vmin at center 49vmin)',
        transform: 'rotate(0turn) scale(0.4)',
        offsetDistance: '56%',
        offset: 0,
      },
      {
        offsetPath: 'ellipse(55vmin 35vmin at center 49vmin)',
        transform: 'rotate(3turn) scale(0.4)',
        offsetDistance: '94.5%',
        offset: 0.35,
      },

      {
        offsetPath: 'ray(75.5deg sides)',
        offsetDistance: '51.6vmin',
        offset: 0.35001,
      },
      {
        offsetDistance: '20vmin',
        offset: 0.5,
      },
      {
        offsetDistance: '0vmin',
        transform: 'rotate(7turn) scale(0.4)',
        offset: 0.8,
      },
      {
        offsetPath: 'ray(1080deg sides)',
        offsetDistance: '0vmin',
        transform: 'rotate(7turn) scale(1)',
        offset: 1,
      },
    ],
    options: {
      duration: 6500,
    },
  },
  containerPortraitTablet: {
    // Portrait
    // In portrait Mode both for phones & tablets the ray must start from the point where the ellipse stops,
    // and make the ray's offset distance smaller kinda linearly in short timings points to keep the animation smooth
    // and also keep the star in the boundaries of the screen.
    keyframes: [
      {
        offsetPath: `ellipse(41vmin 28vmin at center 40vmax)`,
        transform: 'rotate(0turn) scale(0.4)',
        offsetDistance: '54%',
        offset: 0,
      },
      {
        offsetPath: `ellipse(41vmin 28vmin at center 40vmax)`,
        transform: 'rotate(3turn) scale(0.4)',
        offsetDistance: '94.5%',
        offset: 0.35,
      },

      {
        offsetPath: `ray(62deg sides)`,
        offsetDistance: `42.5vmin`,
        offset: 0.35001,
      },
      {
        offsetDistance: `39vmin`,
        offset: 0.36,
      },
      {
        offsetDistance: `25vmin`,
        offset: 0.5,
      },
      {
        offsetDistance: '0vmin',
        transform: 'rotate(7turn) scale(0.4)',
        offset: 0.8,
      },
      {
        offsetPath: 'ray(1080deg sides)',
        offsetDistance: '0vmin',
        transform: 'rotate(7turn) scale(1)',
        offset: 1,
      },
    ],
    options: {
      duration: 6500,
    },
  },
  containerPhone: {
    keyframes: [
      {
        offsetPath: `ellipse(41vmin 33vmin at center 36.5vmax)`,
        transform: 'rotate(0turn) scale(0.4)',
        offsetDistance: '56%',
        offset: 0,
      },
      {
        offsetPath: `ellipse(41vmin 33vmin at center 36.5vmax)`,
        transform: 'rotate(3turn) scale(0.4)',
        offsetDistance: '94.5%',
        offset: 0.35,
      },

      {
        offsetPath: `ray(50deg sides)`,
        offsetDistance: `50vmin`,
        offset: 0.35001,
      },
      {
        offsetPath: `ray(65deg sides)`,
        offsetDistance: `45vmin`,
        offset: 0.36,
      },
      {
        offsetDistance: `38vmin`,
        offset: 0.375,
      },
      {
        offsetDistance: `25vmin`,
        offset: 0.5,
      },
      {
        offsetDistance: '0vmin',
        transform: 'rotate(7turn) scale(0.4)',
        offset: 0.8,
      },
      {
        offsetPath: 'ray(1080deg sides)',
        offsetDistance: '0vmin',
        transform: 'rotate(7turn) scale(1)',
        offset: 1,
      },
    ],
    options: {
      duration: 6500,
    },
  },
  // Used in combination with the break3dGlass animation
  shadowBreakGlass: {
    keyframes: [
      {
        transform: 'perspective(500px) translateZ(0px) rotateX(0deg)',
        filter: 'blur(6px)',
        offset: 0,
      },

      {
        transform: 'perspective(500px) translateZ(-650px) rotateX(0deg)',
        filter: 'blur(6px)',
        offset: 0.35,
      },
      {
        transform: 'perspective(500px) translateZ(-650px) rotateX(-35deg)',
        offset: 0.375,
        filter: 'blur(6px)',
        easing: 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      {
        transform: 'perspective(500px) translateZ(0px) rotateX(-35deg)',
        filter: 'blur(0px)',
        offset: 0.5,
      },
      {
        transform: 'perspective(500px) translateZ(200px) rotateX(-35deg)',
        filter: 'blur(0px)',
        offset: 1,
      },
    ],
    options: {
      duration: 5000,
    },
  },
  // Used with different playbackRate values animating one after the other
  shadowShake: {
    keyframes: [
      {
        transform:
          'perspective(500px) translateZ(200px) rotateX(-35deg) translateX(0px) translateY(0px)',
        filter: 'blur(0px)',
        offset: 0,
      },
      {
        transform:
          'perspective(500px) translateZ(200px) rotateX(-35deg) translateX(-10px) translateY(5px)',
        filter: 'blur(0px)',
        offset: 0.25,
      },
      {
        transform:
          'perspective(500px) translateZ(200px) rotateX(-35deg) translateX(0px) translateY(0px)',
        filter: 'blur(0px)',
        offset: 0.5,
      },
      {
        transform:
          'perspective(500px) translateZ(200px) rotateX(-35deg) translateX(10px) translateY(5px)',
        filter: 'blur(0px)',
        offset: 0.75,
      },
      {
        transform:
          'perspective(500px) translateZ(200px) rotateX(-35deg) translateX(0px) translateY(0px)',
        filter: 'blur(0px)',
        offset: 1,
      },
    ],
    options: {
      duration: 250,
      iterations: 5,
    },
  },

  cowEarFlap: {
    keyframes: [
      {
        transform: 'rotateY(0deg)',
      },
      {
        transform: 'rotateY(55deg)',
      },
    ],

    optionsFn: (num) => ({
      duration: 50,
      iterations: num,
      direction: 'alternate',
    }),
  },
  cowMouthCloseNeutral: {
    keyframes: [
      {
        transform: 'translateY(55px)',
      },
      {
        transform: 'translateY(0px)',
      },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
  cowLevitate: {
    keyframes: [
      { transform: 'translateY(0px)' },
      { transform: 'translateY(10px)' },
    ],
    options: {
      duration: 1000,
      easing: 'ease-in-out',
      iterations: ' Infinity',
      direction: 'alternate',
    },
  },
};

export const glass3dAnimationArgs = {
  // Used inside a loop for all glass paths
  // Parameters accept destructured values from homeGlassKeyframe3dValuesObj[index]
  keyframesFn: ({ translate3d, rotate3d }) => [
    {
      transformOrigin: 'center',
      transformBox: 'fill-box',
      transform:
        'perspective(500px) translate3d(0px, 0px, 0px) rotate3d(0, 0, 0, 0deg)',
    },
    {
      transformOrigin: 'center',
      transformBox: 'fill-box',
      transform: `perspective(500px) translate3d(${translate3d}) rotate3d(${rotate3d})`,
    },
  ],
  options: { duration: 2500, delay: 2500 },
  // Used for setToggleGlassClassName() state
  strokeState: {
    empty: 'home__svg-glass-empty home__svg-glass-empty--',
    full: 'home__svg-glass-full home__svg-glass-full--',
    halfTransition:
      'home__svg-glass-transition-half home__svg-glass-transition-half--',
    fullTransition:
      'home__svg-glass-transition-full home__svg-glass-transition-full--',
  },
};

export const backgroundAnimationArgs = {
  bubble: {
    keyframes: [
      {
        transform: 'scale(0)',
        offset: 0,
      },
      {
        transform: 'scale(2)',
        offset: 0.2,
      },
      {
        transform: 'scale(2)',
        offset: 0.7,
      },
      {
        transform: 'scale(0)',
        offset: 1,
      },
    ],
    options: { duration: 800 },
  },
  beam: {
    keyframes: [
      {
        transform: 'scale(1, 0)',
      },
      { transform: 'scale(1, 1)' },
    ],
    options: {
      duration: 500,
      delay: 500,
      easing: 'cubic-bezier(0.47, 0.35, 1, 0.8)',
    },
  },
  conicBackDarkRef: {
    keyframes: [
      {
        '--home-conic-color-lightness': '100%',
      },
      {
        '--home-conic-color-lightness': '5%',
      },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  conicMaskAngle: {
    keyframes: [
      {
        '--home-mask-gradient-angle': '90deg',
      },
      {
        '--home-mask-gradient-angle': '180deg',
      },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
};

export const svgButtonAnimationArgs = {
  elasticLetterMiddle: {
    keyframes: [],
    options: {},
  },
  elasticLetterLeft: {
    keyframes: [],
    optionsFn: (delay) => {},
  },
  elasticLetterRight: {
    keyframes: [],
    optionsFn: (delay) => {},
  },
  svgMoveBackwards: {
    keyframes: [],
    options: {},
  },
  rectBackFillOpacity: {
    keyframes: [],
    options: {},
  },
  rectBackStrokeDashOffset: {
    keyframes: [],
    options: {},
  },
};
