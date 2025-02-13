import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../../styles/Home.scss';

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

const Home = () => {
  const [protrusionSize, setProtrusionSize] = useState(20); // Front + Back + Middle letters sum of pixels in depth

  const circlePatternRef = useRef({ node: null, animation: null });
  const circlePatternRef2 = useRef({ node: null, animation: null });
  const circlePatternRef3 = useRef({ node: null, animation: null });

  const textRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftEarRef = useRef(null);
  const cowRef = useRef(null);
  const homeRef = useRef(null);

  const svgContainerRef = useRef(null);
  const svgAnimRef = useRef(null);

  const containersRef = useRef(null);
  const boxesRef = useRef(null);
  const frontNodesRef = useRef(null);
  const leftNodesRef = useRef(null);
  const rightNodesRef = useRef(null);

  const containerAnimRef = useRef(null);
  const leftSideAnimRef = useRef(null);
  const rightSideAnimRef = useRef(null);
  const boxEnteranceAnimRef = useRef(null);
  const boxEndingAnimRef = useRef(null);

  const starAnimateRef = useRef(null);
  const starInAnimateRef = useRef(null);

  const circleRef = useRef(null);

  const effectRanRef = useRef(false); // check if useEffect has ran once in development

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
  //  which have curve in their shape the "I" protrudes in an ungly shape which is not fluid or normal looking.
  // In order to achieve a result which is "OK" (not perfect) i found the range of the angles of rotation which the
  // "I" needs to be used to hide the not rendering part of letters when they are perpendicular to the screen.
  // They are +/- 5 degrees of 90 and 270. So 85-95 and 265-275 degrees.

  // I HAVE ONLY TESTED CAPITAL LETTERS atm.

  // The next step is to divide the range of 0-360 degrees to a range of 0-100 (%) for the animation keyframes and change the opacity
  // of the left and right side only in that range and avoid all the above.

  ////////////// BUG //////////////
  // In firefox the 3D animation breaks when it gets offseted, otherwise it is smooth.

  ////// Important //////
  // When an element is offseted using offset-path the dimensions change, so caution is needed upon measuring dimensions!

  // Measure dimensions of each "front" letter (biggest letter in dimensions)
  // upon first render and make the scene (container) the same size.

  // First aproach was to use a resizeObserver in a useEffect in order to keep the scene (container) in check with the
  // letters when they change font-size based on the viewport resizing but when the observer gets initialized
  // it autmatically makes a pass through for all the observed elements giving all the info i need.
  // So no clientWidth / height needs to be used just the observer and that is the reason
  // the layoutEffect is used insted of useEffect.

  useLayoutEffect(() => {
    const matchViewport = () => {
      const vw600 = window.matchMedia('(max-width: 37.5em)').matches;
      const vw1200 = window.matchMedia('(max-width: 75em)').matches;
      const vw1920 = window.matchMedia('(max-width: 120em)').matches;
      const vw2560 = window.matchMedia('(max-width: 160em)').matches;
      const allElse = window.matchMedia('(min-width: 160.01em)').matches;

      if (vw600) {
        setProtrusionSize(8);
      } else if (vw1200) {
        setProtrusionSize(12);
      } else if (vw1920) {
        setProtrusionSize(16);
      } else if (vw2560) {
        setProtrusionSize(20);
      } else if (allElse) {
        setProtrusionSize(24);
      }
    };

    const observer = new ResizeObserver((entries) => {
      let accumulator = 0;
      for (const entry of entries) {
        const container = containersRef.current.get(accumulator);
        accumulator++;
        container.style.width = `${Math.ceil(
          entry.contentBoxSize[0].inlineSize
        )}px`;
        container.style.height = `${Math.ceil(
          entry.contentBoxSize[0].blockSize
        )}px`;
      }
      matchViewport();
    });

    frontNodesRef.current.forEach((val, index) => {
      observer.observe(val);
    });

    return () => observer.disconnect();
  }, []);

  //////////////////////////// Animations //////////////////////////////

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

  // The startTime, if a positive value is set on the currentTime can be less than the document.timeline.currentTime
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
  // If the currentTime is set after the play() there are no problems, so the play() resets the timing to its default values
  // that were set when instatiating the animation or continuing from where the animation was paused.
  // If the effect.getComputedTiming() is called the localTime property reflects the real value of the currentTime

  // In order to add delay i can add a negative value to currentTime
  // In order to run the animation in a momment inside its duration for instance in the middle i give a positive value.

  /// 2. animation.effect.updateTiming() ///

  // This method can be called before play() to add a delay or set any of the timing properties of an animation
  // so it is the preffered method overall.

  ////// Opacity //////

  // Opacity cannot be set on an element with transform-style: preserve-3d because it breaks the 3d effect.
  // So i cannot set the opacity on the letter-box element so its either the scene or each letter independetly.

  useEffect(() => {
    // Letter keyframeEffect + options
    const leftSideKeyframes = [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.22 },
      { opacity: 1, offset: 0.23 },
      { opacity: 1, offset: 0.26 },
      { opacity: 0, offset: 0.27 },
      { opacity: 0, offset: 1 },
    ];

    const rightSideKeyframes = [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.72 },
      { opacity: 1, offset: 0.73 },
      { opacity: 1, offset: 0.76 },
      { opacity: 0, offset: 0.77 },
      { opacity: 0, offset: 1 },
    ];

    const sidesOptions = { duration: 500, iterations: 5 };

    // Box
    // the box has a default transform: translateZ(-10px) in order to place back the whole scene in its default
    // position and not be zoomed in also i read that it helps in letter anti-aliasing
    const boxEntranceKeyframes = [
      {
        transform: 'translateZ(-10px) rotateY(0deg)',
        offset: 0,
      },
      { transform: 'translateZ(-10px) rotateY(180deg)', offset: 0.5 },
      { transform: 'translateZ(-10px) rotateY(360deg)', offset: 1 },
    ];

    const boxEntranceOptions = { duration: 500, iterations: 5 };

    const boxEndingKeyframes = [
      {
        transform: ' translateZ(-10px) translateY(0px) rotateX(0deg)',
        offset: 0,
      },
      {
        transform: ' translateZ(-10px) translateY(-20px) rotateX(20deg)',
        offset: 1,
      },
    ];

    const boxEndingOptions = { duration: 1200, fill: 'forwards' };

    // Container (scene)
    const containerKeyframes = [
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
    ];

    const containerOptions = { duration: 500, fill: 'forwards' };

    // Svg star + cow

    const svgContainerKeyframes = [
      {
        offsetPath: 'ellipse(55vmin 35vmin at center 49vmin)',
        transform: 'rotate(0turn) scale(0.4)',
        offsetDistance: '56%',
        opacity: 1,
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
        opacity: 1,
        offset: 1,
      },
    ];

    const svgContainerOptions = {
      duration: 6500,
    };

    // Make each letter rotate(Y) at a different number of iterations for visual effect
    const differentiateIterations = (i) => {
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
    };

    // Get Map of all letter relative animations
    // Nodes Ref
    const leftNodesMap = getMap(leftNodesRef);
    const rightNodesMap = getMap(rightNodesRef);
    const boxesMap = getMap(boxesRef);
    const containersMap = getMap(containersRef);

    // Animations Ref
    const leftSideAnimMap = getMap(leftSideAnimRef);
    const rightSideAnimMap = getMap(rightSideAnimRef);
    const boxEntranceAnimMap = getMap(boxEnteranceAnimRef);
    const boxEndingAnimMap = getMap(boxEndingAnimRef);
    const containerAnimMap = getMap(containerAnimRef);

    const letterEntranceAnimations = () => {
      // star is running through the letters from 0% to 35% in its animation and the total duration is 6500ms
      // 35% of 6500 = 2275ms
      // 2275 / 7 (letters) = 325ms
      // the letters are offsetted equally 5% from each other and the star begins its animation 5% away from
      // the first letter
      const delayConstant = 325;

      for (let i = 0; i <= 6; i++) {
        // left
        const leftAnimation = leftNodesMap
          .get(i)
          .animate(leftSideKeyframes, sidesOptions);
        leftAnimation.pause();
        leftAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
          iterations: differentiateIterations(i),
        });
        leftSideAnimMap.set(i, leftAnimation);

        // right
        const rightAnimation = rightNodesMap
          .get(i)
          .animate(rightSideKeyframes, sidesOptions);
        rightAnimation.pause();
        rightAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
          iterations: differentiateIterations(i),
        });
        rightSideAnimMap.set(i, rightAnimation);

        // box
        const boxAnimation = boxesMap
          .get(i)
          .animate(boxEntranceKeyframes, boxEntranceOptions);
        boxAnimation.pause();
        boxAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
          iterations: differentiateIterations(i),
        });
        boxEntranceAnimMap.set(i, boxAnimation);

        // container
        const containerAnimation = containersMap
          .get(i)
          .animate(containerKeyframes, containerOptions);
        containerAnimation.pause();
        containerAnimation.effect.updateTiming({
          delay: delayConstant * (i + 1),
        });
        containerAnimMap.set(i, containerAnimation);
      }
    };

    ////////////// BUG //////////////
    // >>>>This<<<< bugs out the star animation when the ending animations are getting attached.
    // I am running at 170hz screen, in the performance tab because the star is animating the offset and offset-distance
    // properties which are going to the main-thread, every tick for animating them is about 2.17ms total.

    // When the letterEnding animation function starts it takes 4.77ms to complete, and then i have another
    // task at 2.17ms that is from the star(propably...), so the star is running again but then i get 6 concurent dropped frames,
    // and no tasks are running in those, so i dont know why those frames are getting dropped and why the star animation stutters
    // since everything that gets animated from the letters goes to the compositor.

    //  I tried the requestAnimtionFrame() with the for loop and it alleviates it somehow but does not fix it.
    // Recursive requestAnimtionFrame() does the trick thought(almost), but the animations are created in seperate frames and maybe if the
    // refresh rate is less than mine like 60 fps the effect will be visible because the requestAnimationFrame() will fire
    // less frequently.
    // So i will add delay dynamicaly with animation.currentTime, based on the timing of each frame concurently to each letter.

    /// Results ///
    // Logging the computedTiming throughout the animation everything works well BUT letters 2 and 3
    // are lagging behind 6ms from all other letters, while all others are giving the same localTime value
    // Tested with performance.now() and all works as excepted.
    // I dont know the reason for that happening and its weird behaviour...
    let countIteretions = 0;
    let initialFrameTime = 0;
    const endingAnimationDelay = 500;
    const letterEndingAnimations = (time) => {
      // >>>>This bugs out the star <<<<

      //   for (let i = 0; i <= 6; i++) {
      //     const boxAnimation = boxesMap
      //       .get(i)
      //       .animate(boxEndingKeyframes, boxEndingOptions);
      //     boxEndingAnimMap.set(i, boxAnimation);
      //     commitStyles(boxAnimation);
      //   }

      const commitStyles = async (animation) => {
        await animation.finished;
        animation.commitStyles();
        animation.cancel();
      };

      if (countIteretions === 0) {
        initialFrameTime = time;
      }

      const frameTimeDiff = time - initialFrameTime;
      const computedDelay = Math.round(endingAnimationDelay - frameTimeDiff); // Must be added as a negative value to currentTime

      if (countIteretions < 6) {
        const boxAnimation = boxesMap
          .get(countIteretions)
          .animate(boxEndingKeyframes, boxEndingOptions);
        boxAnimation.currentTime = -computedDelay;
        boxEndingAnimMap.set(countIteretions, boxAnimation);
        commitStyles(boxAnimation);
        countIteretions++;
        requestAnimationFrame(letterEndingAnimations);
      } else {
        const boxAnimation = boxesMap
          .get(6)
          .animate(boxEndingKeyframes, boxEndingOptions);
        boxAnimation.currentTime = -computedDelay;
        boxEndingAnimMap.set(6, boxAnimation);
        commitStyles(boxAnimation);
      }
    };

    const svgAnimation = () => {
      svgAnimRef.current = svgContainerRef.current.animate(
        svgContainerKeyframes,
        svgContainerOptions
      );
      svgAnimRef.current.pause();
    };

    const playAllAnimations = async () => {
      svgAnimation();
      letterEntranceAnimations();
      // starAnimateRef.current.beginElement();
      // Wait for the S to finish the spin and then animate() the ending
      await boxEntranceAnimMap.get(6).finished;
      requestAnimationFrame(letterEndingAnimations);
    };

    const motionOk = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches;
    localStorage.setItem('home-animation-ran', false);

    // Check if i am not running in development
    // Otherwise wait for the component to run once and then create the animations
    // in order to avoid creating them twice.
    if (!import.meta.env.DEV) {
      effectRanRef.current = true;
    }

    if (effectRanRef.current) {
      // playAllAnimations();
    }

    starAnimateRef.current.onbegin = (e) => {
      console.log(e);
    };

    // return () => {
    //   // when i save the file the effect runs again stacking animations for no reason and bypassing the
    //   // check from the effectRanRef (because it is already true)
    //   if (import.meta.env.DEV && effectRanRef.current) {
    //     const leftSideAnimMap = getMap(leftSideAnimRef);
    //     const rightSideAnimMap = getMap(rightSideAnimRef);
    //     const boxEntranceAnimMap = getMap(boxEnteranceAnimRef);
    //     const containerAnimMap = getMap(containerAnimRef);

    //     for (let i = 0; i <= 6; i++) {
    //       leftSideAnimMap.get(i).cancel();
    //       rightSideAnimMap.get(i).cancel();
    //       boxEntranceAnimMap.get(i).cancel();
    //       containerAnimMap.get(i).cancel();
    //     }
    //     svgAnimRef.current.cancel();
    //     console.log(document.getAnimations());
    //   }
    //   // Flag in order to avoid creating multiple animations in development strict mode
    //   // checks the first render upon component mount
    //   effectRanRef.current = true;
    // };
  }, []);

  // If i have the star and the cow in the same <svg> either under the <g> tag or under the <svg>
  // (with viewports and width/height = 100% ) changing the opacity of the cow that is inside <g> or <svg>
  // blurs the star (anti-aliasing propably), changing the display of the cow to none is fixing the problem.
  // I propably have to have them in the same svg because i need the dimension to be the same of the end result
  // and i cant use px values because of different sizes so i prefer to have them under the same <svg>
  // and use a percentage of width (like 25%). Both have been drawn under the same viewbox so its ok to grp.

  // useLayoutEffect(() => {
  //   // const groupBox = groupRef.current.getBBox();

  //  // console.log(groupBox);
  //   const box = groupRef.current.getBBox();
  //   const clint = groupRef.current.getBoundingClientRect();
  //   console.log(box);
  //   console.log(clint);
  // }, []);

  // useLayoutEffect(() => {
  //   // measure viewport width
  //   const vpWidth = document.documentElement.clientWidth;
  //   const vpHeight = document.documentElement.clientHeight;
  //   console.log(vpWidth, vpHeight);
  //   // measure cow and find center point
  //   const clint = cowRef.current.getBoundingClientRect();
  //   const cx = clint.x + clint.width / 2;
  //   const cy = clint.y + clint.height / 2;
  //   console.log(cx, cy);

  //   // normalize the distances and make the center point of the cow the (0,0) point of the coordinate system
  //   // in order to calculate the eye movement and interpolate the distance
  //   // so i have to find min max values from the center point to the ends of the viewport
  //   const centerX = cx - vpWidth;
  //   const centerY = cy - vpHeight;
  //   console.log(centerX, centerY);

  //   // const normalize = 20 + ((mx - -Math.abs(centerX)) * 40) / vpWidth;
  // }, []);
  // useEffect(() => {
  //   // measure home dimensions
  //   const homeW = homeRef.current.clientWidth;
  //   const homeH = homeRef.current.clientHeight;
  //   console.log('home', homeW, homeH);

  //   // find center point of the cow
  //   const clint = cowRef.current.getBoundingClientRect();
  //   const cx = clint.x + clint.width / 2;
  //   const cy = clint.y + clint.height / 2 - 70;
  //   console.log('cow center', cx, cy);

  //   // center of cow - viewport width = distance from one side
  //   // make the center of the cow the (0,0) point of the coordinate system
  //   // and the distance from one side the min and the other side the max values of the system
  //   ////////// IMPORTANT!! //////////
  //   // cow is centered with CSS so there is kinda no need to do this but there are deviations in the measuring with clientWidth
  //   // and what centerX * 2 gives.

  //   const centerX = cx - homeW;
  //   const centerY = cy - homeH;
  //   console.log('center by vp', centerX, centerY);

  //   const calcAngle = (e) => {
  //     const mx = e.clientX;
  //     const my = e.clientY - 70;
  //     console.log('mouse', mx, my);
  //     const dx = mx - cx;
  //     const dy = my - cy;

  //     const normalizeX = -25 + ((dx - -Math.abs(centerX)) * 50) / homeW;
  //     const normalizeY = -25 + ((dy - -Math.abs(centerY)) * 50) / homeH;

  //     // console.log(normalizeX, normalizeY);
  //     leftEyeRef.current.style.transform = `translate(${normalizeX}px, ${normalizeY}px)`;
  //     rightEyeRef.current.style.transform = `translate(${normalizeX}px, ${normalizeY}px)`;
  //   };
  //   window.addEventListener('mousemove', calcAngle);

  //   return () => window.removeEventListener('mousemove', calcAngle);
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

  const playAnimations = () => {
    const leftSideAnimMap = getMap(leftSideAnimRef);
    const rightSideAnimMap = getMap(rightSideAnimRef);
    const boxEntranceAnimMap = getMap(boxEnteranceAnimRef);
    const containterAnimMap = getMap(containerAnimRef);

    // Function use for seperate Promise fullfilment to commit each style instead of Promise.all because
    // i need instant commitment of styles for each animation seperately
    const commitStyles = async (animation) => {
      await animation.finished;
      animation.commitStyles();
      animation.cancel();
    };
    for (let i = 0; i <= 6; i++) {
      leftSideAnimMap.get(i).play();
      rightSideAnimMap.get(i).play();
      boxEntranceAnimMap.get(i).play();
      containterAnimMap.get(i).play();
      commitStyles(containterAnimMap.get(i));
    }
    svgAnimRef.current.play();
    // starAnimateRef.current.beginElement();
    console.log(document.getAnimations());
  };

  const cancelAnimations = () => {
    const leftSideAnimMap = getMap(leftSideAnimRef);
    const rightSideAnimMap = getMap(rightSideAnimRef);
    const boxEntranceAnimMap = getMap(boxEnteranceAnimRef);
    const containterAnimMap = getMap(containerAnimRef);

    for (let i = 0; i <= 6; i++) {
      leftSideAnimMap.get(i).cancel();
      rightSideAnimMap.get(i).cancel();
      boxEntranceAnimMap.get(i).cancel();
      containterAnimMap.get(i).cancel();
    }
    svgAnimRef.current.cancel();
    console.log(document.getAnimations());
  };
  const reverseAnimations = () => {
    // const leftSideAnimMap = getMap(leftSideAnimRef);
    // const rightSideAnimMap = getMap(rightSideAnimRef);
    // const boxEntranceAnimMap = getMap(boxEnteranceAnimRef);
    // const containterAnimMap = getMap(containerAnimRef);

    // for (let i = 0; i <= 6; i++) {
    //   leftSideAnimMap.get(i).reverse();
    //   rightSideAnimMap.get(i).reverse();
    //   boxEntranceAnimMap.get(i).reverse();
    //   containterAnimMap.get(i).reverse();
    // }
    // svgAnimRef.current.reverse();
    // console.log(document.getAnimations());
    starAnimateRef.current.beginElement();
  };

  const moovies = ['M', 'O', 'O', 'V', 'I', 'E', 'S'];
  return (
    <article ref={homeRef} className='home'>
      <button
        style={{ position: 'absolute', left: '200px' }}
        onClick={() => {
          console.log(document.getAnimations());
        }}>
        hello
      </button>
      <button
        style={{ position: 'absolute', left: '20px' }}
        onClick={playAnimations}>
        play
      </button>
      <button
        style={{ position: 'absolute', left: '80px' }}
        onClick={cancelAnimations}>
        cancel
      </button>
      <button
        style={{ position: 'absolute', left: '160px' }}
        onClick={reverseAnimations}>
        reverse
      </button>
      <h1 className='home__title'>
        {moovies.map((letter, index) => (
          <span
            key={index}
            ref={(node) =>
              node
                ? getMap(containersRef).set(index, node)
                : getMap(containersRef).delete(index)
            }
            className={`home__curved-3d home__curved-3d--${index + 1}`}>
            <span
              ref={(node) =>
                node
                  ? getMap(boxesRef).set(index, node)
                  : getMap(boxesRef).delete(index)
              }
              className='home__letters-box'>
              {/* render 18 of the same letters which are the thickness of the animated letter and position them
                +/- 9 px from the 0 point in the Z axis  */}
              <span
                aria-hidden='true'
                className='home__letter home__letter--back'>
                {letter}
              </span>
              {[...Array(18).keys()].map((n, i, arr) => {
                const splitIndex = n - arr.length / 2;
                const translateZ =
                  splitIndex < 0
                    ? `translateZ(-${Math.abs(splitIndex)}px)`
                    : `translateZ(${splitIndex}px)`;
                return (
                  <span
                    aria-hidden='true'
                    key={n}
                    className='home__letter home__letter--middle'
                    style={{ transform: translateZ }}>
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
                ref={(node) =>
                  node
                    ? getMap(frontNodesRef).set(index, node)
                    : getMap(frontNodesRef).delete(index)
                }
                className='home__letter home__letter--front'>
                {letter}
              </span>
            </span>
          </span>
        ))}
      </h1>
      <div ref={svgContainerRef} className='home__star'>
        <svg
          className='home__cow'
          ref={cowRef}
          viewBox='0 0 1000 1000'
          xmlSpace='preserve'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid meet'>
          <defs>
            <radialGradient
              href='#a'
              id='d'
              cx='652.26'
              cy='-445.69'
              r='111.24'
              fx='652.26'
              fy='-445.69'
              gradientTransform='matrix(0.17348959,0,0,0.17348959,763.24936,409.42978)'
              gradientUnits='userSpaceOnUse'
            />
            <radialGradient
              href='#b'
              id='c'
              cx='651.33'
              cy='-202.69'
              r='111.24'
              fx='651.33'
              fy='-202.69'
              gradientTransform='matrix(0.18586063,0,0,0.18586063,755.22495,403.21939)'
              gradientUnits='userSpaceOnUse'
            />
            <radialGradient
              href='#a'
              id='f'
              cx='652.26'
              cy='-445.69'
              r='111.24'
              fx='652.26'
              fy='-445.69'
              gradientTransform='matrix(0.17348959,0,0,0.17348959,635.68532,412.81895)'
              gradientUnits='userSpaceOnUse'
            />
            <radialGradient
              href='#b'
              id='e'
              cx='651.33'
              cy='-202.69'
              r='111.24'
              fx='651.33'
              fy='-202.69'
              gradientTransform='matrix(0.18586063,0,0,0.18586063,627.66091,406.60856)'
              gradientUnits='userSpaceOnUse'
            />
            <linearGradient id='a'>
              <stop offset='0' stopColor='#cf5f02' />
              <stop offset='1' stopColor='#454545' stopOpacity='0' />
            </linearGradient>
            <linearGradient id='b'>
              <stop offset='0' stopColor='#ff8000' />
              <stop offset='1' stopColor='#b35700' stopOpacity='0' />
            </linearGradient>
          </defs>
          <g className='cow-wrapper'>
            <g
              strokeWidth='1.34'
              transform='matrix(0.74528833,0,0,0.74493884,-96.3681,165.64998)'>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path
                  fill='#fff'
                  d='m707.45 145.25-24.74 62.8 256.5-2.11-17.34-62.38z'
                />
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g>
                  <path
                    fill='#a68854'
                    stroke='#83422f'
                    strokeWidth='6.68'
                    d='M706.81 146.3s-36.24-7.61-48.63-10.99c-13.96-3.8-28.34-9.1-49.48-20.93-9.83-5.5-18.51-13.2-26-21.61-8.6-9.66-15.03-21.14-21.16-32.53-3.82-7.1-8.5-17.05-16.7-18.82-5.74-1.23-13.25 2.05-16.08 7.2-7.97 14.53-7.91 32.1-7.4 48.42.26 8.08 2.6 16.04 5.18 23.72 3.13 9.33 6.86 18.66 12.37 26.81a165.11 165.11 0 0 0 36.37 38.49c13.34 10.18 28.9 17.3 44.41 23.68 15.51 6.38 42.3 13.54 48.21 14.38 5.93.85 23.48-29.6 38.91-77.81z'
                  />
                  <path
                    fill='#d0b990'
                    d='M536.75 43.9c-1.83.9-2.73 3.09-3.57 4.94-1 2.22-1.3 4.72-1.6 7.14-.31 2.6-.32 5.24-.17 7.86a187.4 187.4 0 0 0 4.54 32.67 112.38 112.38 0 0 0 7.4 21.57c4.6 9.76 9.93 19.38 16.92 27.6 7.75 9.09 16.64 17.72 27.17 23.36 22.2 11.9 48.56 27.4 72.75 20.4 5.5-1.59 10.26-6.49 13.2-11.54.77-1.33.72-3 .91-4.53.32-2.59.1-5.22.35-7.82.3-3.09.84-6.15 1.4-9.2.84-4.64.52-6.32 2.9-13.85-6.07-.55-27.4-6.87-40.76-11.42a106.75 106.75 0 0 1-11.52-4.65c-12.61-6.09-24.82-13.4-35.53-22.42-7.32-6.17-13.63-13.58-19.24-21.35-6.88-9.54-10.22-21.39-17.44-30.67-2.28-2.93-4.62-6.26-8.04-7.71-2.97-1.27-6.77-1.79-9.67-.37z'
                  />
                  <path
                    fill='#fcfcfc'
                    stroke='#fcfcfc'
                    strokeWidth='.83'
                    d='M547.1 55.58c.47 4.64 2.09 9.11 3.77 13.45 2.2 5.68 6.37 12.93 8.19 16.3 2.6 4.85 6.81 10.28 9.34 13.6 4.67 6.12 4.75 5.67 7.25 8.39a188.1 188.1 0 0 0 6.97 7.08 171.1 171.1 0 0 0 7.97 7.46 178.27 178.27 0 0 0 19.6 14.17c13.55 8.24 26.02 15.25 43.81 18.54 17.8 3.29 7.07-9.08 3.74-10.32-8.44-3.15-10.32-3.89-17.94-6.13-3.63-1.07-12.23-3.82-17.99-6.59-6.23-3-12.1-6.77-17.75-10.76-5.36-3.77-10.4-8-15.25-12.4A130.87 130.87 0 0 1 576.4 95.8c-5.15-6.13-9.65-12.8-13.9-19.58-3.03-4.82-8.23-14.96-8.23-14.96s-2.84-5.23-4.34-6.87c-.4-.44-1.85-1.65-2.67-1.14-.67.4-.25 1.56-.17 2.33z'
                  />
                </g>
                <g>
                  <path
                    fill='#a68854'
                    stroke='#83422f'
                    strokeWidth='6.68'
                    d='M919.99 145.25s36.25-7.62 48.63-11c13.96-3.8 28.34-9.09 49.49-20.93 9.82-5.5 18.5-13.19 26-21.6 8.59-9.67 15.02-21.14 21.15-32.54 3.82-7.09 8.5-17.05 16.7-18.82 5.74-1.23 13.26 2.05 16.08 7.2 7.97 14.53 7.91 32.1 7.4 48.42-.26 8.09-2.6 16.05-5.18 23.72-3.13 9.33-6.86 18.66-12.37 26.82a165.11 165.11 0 0 1-36.37 38.48c-13.34 10.18-28.9 17.31-44.41 23.69-15.51 6.37-42.3 13.53-48.21 14.38-5.92.84-23.47-29.6-38.91-77.82z'
                  />
                  <path
                    fill='#d0b990'
                    d='M1087.66 42.85c1.83.89 2.73 3.08 3.56 4.93 1 2.22 1.3 4.72 1.6 7.14.32 2.6.33 5.24.18 7.86a188.1 188.1 0 0 1-4.54 32.67c-1.77 7.4-4.17 14.7-7.4 21.57-4.6 9.76-9.93 19.38-16.92 27.6-7.75 9.09-16.65 17.72-27.18 23.36-22.2 11.9-48.55 27.41-72.74 20.4-5.5-1.59-10.26-6.48-13.2-11.54-.77-1.33-.72-3-.91-4.52-.32-2.6-.1-5.23-.35-7.83-.3-3.09-.84-6.15-1.4-9.2-.84-4.64-.52-6.32-2.9-13.85 6.07-.55 27.4-6.87 40.75-11.42 3.93-1.33 8.05-2.97 11.53-4.65 12.61-6.08 24.82-13.4 35.52-22.41 7.33-6.18 13.64-13.6 19.25-21.36 6.88-9.54 10.22-21.38 17.44-30.66 2.28-2.93 4.62-6.27 8.04-7.72 2.97-1.26 6.77-1.79 9.67-.37z'
                  />
                  <path
                    fill='#fcfcfc'
                    stroke='#fcfcfc'
                    strokeWidth='.83'
                    d='M1077.32 54.52c-.48 4.64-2.1 9.11-3.78 13.46-2.2 5.67-6.37 12.92-8.19 16.3-2.6 4.84-6.81 10.27-9.34 13.59-4.67 6.12-4.75 5.67-7.25 8.39a194.2 194.2 0 0 1-6.97 7.09c-2.6 2.54-5.73 5.57-7.97 7.46a178.28 178.28 0 0 1-19.6 14.16c-13.55 8.25-26.02 15.25-43.81 18.54-17.8 3.29-7.07-9.08-3.74-10.32 8.44-3.15 10.31-3.89 17.94-6.13 3.63-1.07 12.23-3.82 17.99-6.59 6.23-3 12.1-6.77 17.75-10.75 5.35-3.78 10.4-8 15.25-12.41 4.36-3.96 8.62-8.06 12.4-12.56 5.16-6.14 9.66-12.8 13.91-19.6 3.03-4.81 8.23-14.94 8.23-14.94s2.84-5.24 4.33-6.88c.4-.44 1.86-1.65 2.68-1.14.67.4.25 1.56.17 2.33z'
                  />
                </g>
              </g>
              <g
                strokeWidth='6.68'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path
                  fill='#faf9f5'
                  stroke='#83422f'
                  strokeWidth='3.34'
                  d='M809.8 204.03c-12.09-.18-24.14-1.35-36.18-2.44-13.91-1.26-27.68-4.19-41.64-4.75-10.57-.42-21.53-1.76-31.72 1.06-15.39 4.26-29.54 13.13-41.87 23.26-5.57 4.57-9.75 10.65-13.96 16.5-5.4 7.5-8.92 16.23-14.38 23.68-3.98 5.44-8.14 10.9-13.32 15.22-5.3 4.41-11.15 8.63-17.76 10.58-6.8 2-10.39 3.31-21.24.8-4.95-1.16-9.7-8.9-13.98-6.14-26.42 17.14-28.98 80.77-.63 94.48 6.46 3.12 20.38-22.69 16.78-13.48-3.53 9.04-4.65 12.2-6.52 18.65-9.68 33.44-18.94 63.82-27.54 95.98-5.64 21.1-12.66 41.97-15.76 63.58-2.06 14.39-2.92 29.07-1.81 43.56 1.25 16.48 3.99 33.1 9.55 48.66 9.48 26.53 24.09 51.2 39.95 74.49 11.3 16.58 25.44 31.07 38.96 45.9 12.36 13.55 24.7 27.24 38.49 39.33 13.25 11.62 27.16 22.68 42.29 31.72a239.23 239.23 0 0 0 44.83 20.72c13.09 4.5 26.76 7.35 40.44 9.42 16.96 2.57 34.18 3.33 51.33 3.7 19.18.4 34.01.2 53.07-1.95 16.57-1.87 22.48-2.75 42.33-9.48 14.25-4.82 28.72-9.9 41.32-18.11 14.4-9.39 26.5-20.26 38.09-32.16 15.14-15.54 28.5-32.86 40.7-50.8a436.14 436.14 0 0 0 34.26-60.06c10.45-22.31 19.93-45.32 25.87-69.23 3.64-14.67 6.36-29.86 5.85-44.96-.6-17.24-4.72-34.37-10.15-50.75-6.94-20.88-18.27-40.06-28.34-59.63a866.11 866.11 0 0 0-25.97-46.82c-9-15.12-15.95-54.64-8-45.55 7.94 9.08 6.94 13.62 12.16 11.6 38.07-14.78 42.1-99.08 8.46-122.23-3.59-2.47-8.33 2.93-11.85 5.5-6.2 4.52-9.04 12.98-15.64 16.91-5.88 3.5-13.13 6.15-19.88 5.08-6.76-1.08-13.02-5.69-17.34-11-6.56-8.06-5.79-20.18-11-29.18-5.97-10.3-14.05-19.42-22.74-27.58a88.79 88.79 0 0 0-18.24-13.23c-5.87-3.2-12.32-5.24-18.69-7.25a95.21 95.21 0 0 0-14.65-3.59c-11.31-1.66-22.87-2.94-34.24-1.8-7.9.8-15.34 4.05-23.03 5.99-6.52 1.64-12.93 3.85-19.59 4.78-8.94 1.25-18.04 1.16-27.08 1.02z'
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
                  d='M542.02 616.3s.97 11.3 2.72 25.08c1.63 12.78 9.76 24.3 13.4 31.14 4.12 7.77 7.4 12.23 11.6 19.52 4.48 7.83.6 1.5 7 11.38 4.92 7.6 8.9 12.16 14.49 19.3 2.43 3.12 5.34 5.99 7.82 9.06 4.73 5.86 12.5 13.76 17.45 19.44 4.24 4.86 10.73 11.18 15.44 16 2.44 2.49 4.7 5.48 7.15 8.15 3.15 3.44 5.65 5 8.84 8.15 2.59 2.57 5.47 5.4 8.15 7.88 1.83 1.7 3.6 3.23 4.94 4.42 3.7 3.3 14.2 12.7 21.9 18.26 7.78 5.62 16.07 10.52 24.45 15.2a185.33 185.33 0 0 0 17.16 8.58c9.93 4.14 19.78 7.76 30.22 10.49 7.45 1.94 15.41 3.3 22.97 4.64 10.22 1.82 20.9 2.51 31.3 3.08 8.48.47 18.48.24 26.97.46 13.9.36 24.62.56 39.78-1.04 10.72-1.13 24.7-1.25 35.72-3.83 13.28-3.11 27.45-9.13 39.86-14.63 9.02-4 24.1-12.7 31.84-18.65 10.7-8.2 21.4-19.84 30.6-29.68 8.6-9.2 16.36-19.18 23.88-29.29 6.48-8.7 15.79-21.51 21.42-30.79a485.5 485.5 0 0 0 22.28-41.22c5-10.37 9.38-21.05 13.54-31.79 2.91-7.53 5.35-15.29 8-22.88.45-1.3.78-4.29.78-4.29-1.39 4.6-3.98 10.9-6.38 16.19-4.07 8.98-8.76 17.68-13.54 26.3-7.58 13.65-14.9 27.54-24 40.23-9.5 13.29-23.42 29.9-35.24 41.18a264.82 264.82 0 0 1-44.36 34.17c-12.27 7.5-32.22 17.83-45.66 22.97-13.46 5.15-27.28 9.65-41.44 12.36-23.43 4.48-47.45 7.44-71.27 6.3-19.86-.95-39.45-5.75-58.65-10.9a297.08 297.08 0 0 1-45.08-16 263.62 263.62 0 0 1-36.68-20.37c-14.43-9.52-28.3-17.96-43.2-31.55a598.58 598.58 0 0 1-20.45-19.24c-12.66-12.51-13.56-12.85-19.32-19.29-11.62-12.99-9.94-10.66-19.48-22.1-6.09-7.29-9.8-11.56-15.2-21.1a382.28 382.28 0 0 1-13.8-27.6c-3.77-8.49-3.4-12.78-7.92-23.7z'
                />
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path d='M750 238.74s-8.19-6.14-13.05-7.06c-4.48-.84-9.21.38-13.58 1.69-4.47 1.34-8.66 3.63-12.55 6.2-4.46 2.96-8.32 6.76-12.16 10.49-1.56 1.51-2.5 3.23-4.4 4.8.11-2.33.5-3.41 1.08-5.03a64.66 64.66 0 0 1 8-15.44c3.17-4.48 6.77-8.85 11.28-11.98 4.21-2.93 9.06-5.63 14.18-6 4.4-.3 9.14.92 12.81 3.37 4.1 2.74 7.53 7.05 8.93 11.78.68 2.3 1.15 6.53-.54 7.18z' />
                <path d='M881.71 236.86s8.2-6.14 13.05-7.06c4.49-.84 9.22.37 13.59 1.68 4.47 1.35 8.65 3.64 12.54 6.21 4.46 2.96 8.32 6.76 12.17 10.48 1.56 1.52 2.5 3.24 4.4 4.82-.11-2.34-.5-3.42-1.09-5.04a64.66 64.66 0 0 0-8-15.44c-3.17-4.48-6.77-8.85-11.27-11.98-4.22-2.93-9.07-5.63-14.19-6-4.4-.3-9.14.92-12.8 3.37-4.1 2.74-7.54 7.05-8.93 11.77-.68 2.3-1.15 6.54.53 7.19z' />
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g>
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
                <g>
                  <ellipse
                    cx='-884.2'
                    cy='336.03'
                    fill='#6a2710'
                    rx='67.12'
                    ry='67.44'
                    transform='scale(-1,1)'
                  />
                  <ellipse
                    cx='-880.09'
                    cy='345.98'
                    fill='#3f181d'
                    rx='66.35'
                    ry='70.86'
                    transform='scale(-1,1)'
                  />
                  <ellipse
                    cx='-880.16'
                    cy='345.85'
                    fill='#90421d'
                    rx='62.11'
                    ry='66.5'
                    transform='scale(-1,1)'
                  />
                  <ellipse
                    cx='-876.59'
                    cy='355.24'
                    fill='#e7e5e4'
                    rx='59'
                    ry='60.47'
                    transform='scale(-1,1)'
                  />
                  <ellipse
                    cx='-876.69'
                    cy='355.33'
                    fill='#fff'
                    rx='48.3'
                    ry='49.76'
                    transform='scale(-1,1)'
                  />
                </g>
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g>
                  <path
                    fill='#501202'
                    stroke='#83412f'
                    strokeWidth='3.34'
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
                    strokeWidth='3.34'
                    d='M227.41 293.44s29.77-11.74 57.52-29.2c27.24-17.14 57.27-32.7 62.95-35.4 33.01-15.7 50.8-17.7 55.66-17.78 14.18-.27 35.78 1.17 46.27 4.8 18.4 6.36 24.59 10.9 36.22 18.55 17.14 11.27 29.44 21.13 47.15 39.53 11.73 12.2 26.01 27.36 39.06 51.37 0 0-.44 43.43-83.15 91 0 0-34.81 17.03-69.84 17.36 0 0-38.08-1.97-68.2-16.8 0 0-28.92-14.74-60.78-55.33 0 0-15.9-23.99-26.78-37.29-1.48-1.8-9.12-10.5-9.12-10.5s-12.99-14.63-26.96-20.3z'
                  />
                  <path
                    fill='#feb4b8'
                    d='M324.75 262.02s-18.33 12.87-18.55 41.25c-.22 28.37 43 61.32 71.15 70.49 28.15 9.16 48.45 11.35 81.18 8.07 18.63-1.86 31.94-11.03 43.63-23.42 9.05-9.6 16.59-22.57 20.76-29.4 9.6-15.7 21.82-33.82 24-36 1.23-1.23-13.92-17.09-28.66-30.73-11.53-10.66-21.47-18.62-28.3-22.3 0 0-4.56-5.18-27.11-16.3 0 0-4.95-4.44-23.52-8.37-2.73-.57-10.62-2.18-16.15-2.26-5.45-.08-10.08 1.57-13.88 2.7-18.74 5.6-41.61 15.3-56.18 24.44-20.51 12.88-28.37 21.83-28.37 21.83z'
                  />
                </g>
                <g>
                  <path
                    fill='#501202'
                    stroke='#83422f'
                    strokeWidth='2.5'
                    d='M1044.92 272.89s11.64-18.5 16.94-28.07c4.63-8.36 6.8-10.15 16.66-20.74 18.47-19.86 44.32-41.08 79.35-50.36 75.55-20.02 157.4 22.22 198.15 50 40.74 27.78 54.78 41.97 58.95 43.36 4.17 1.4 8.8 5.71 23.15 11.12 14.35 5.4 29.17 10.33 35.5 12.96 6.32 2.62 3.39 7.87 3.39 7.87s-8.49 7.87-16.67 11.57c-8.18 3.7-18.2 5.25-18.2 5.25s-6.18 1.23-20.38-1.54c0 0-15.12-4.48-19.9-4.17-4.79.3-5.72-1.39-20.53 4.17-14.82 5.55-31.02 22.22-34.88 25.92-3.86 3.7-11.26 14.66-14.81 20.68-3.55 6.02-20.68 31.33-27.93 36.27 0 0-18.83 22.53-39.97 32.56-21.15 10.03-37.4 15.54-57.78 17.11-14.86 1.15-36.21.82-55.16-4.97-6.82-2.09-14.9-4.42-20.45-7.57-7.11-4.03-20.72-11.04-31.43-18.09-24.04-15.82-41.25-29.81-53.16-48.12-14.12-21.69-10.54-44.58-.84-95.21z'
                  />
                  <path
                    fill='none'
                    stroke='#000'
                    strokeOpacity='.22'
                    strokeWidth='2.5'
                    d='m1049.32 270.97-3.71 3.92s-8.51 43.87-8.3 58.71c0 0 11.36-10.91 12.66-18.11 0 0 3.5-7.86 4.59-20.52 0 0-2.62-18.77-5.24-24z'
                  />
                  <path
                    fill='#903c1e'
                    stroke='#903c1e'
                    strokeWidth='2.5'
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
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path
                  fill='#631108'
                  d='m684.55 689.92 315.66-21.22-69.86 63.65s-91.07 41.92-111.77 32.09c-20.7-9.83-111.78-40.88-125.75-53.3-13.97-12.42-8.28-21.22-8.28-21.22z'
                />
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
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
                    strokeWidth='2.5'
                    d='M899.18 730.8c.1 2.04.87 7.3 1.42 7.12 3.31-1.17 19.5-8.16 18.24-9.38-1.34-1.3-5.11-2.28-8.28-2.91 0 0-6.21-1.17-7.9.13-2.08 1.6-3.61 2.71-3.48 5.04z'
                  />
                  <path
                    fill='#cfcfcf'
                    d='m900.15 731.48.38 5.58s5.06-1.45 9.14-3.4c3.9-1.86 8.26-4.46 8.43-4.97 0 0-1.78-1.38-7.54-2.48 0 0-9 5.56-10.41 5.27z'
                  />
                </g>
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path
                  fill='none'
                  stroke='#83422f'
                  strokeWidth='6.68'
                  d='M659.2 695.61s33.3 46.52 55.36 64.17c14.59 11.67 31.88 20 49.42 26.4 15.66 5.7 32.34 8.56 48.9 10.34 15.53 1.67 31.27 1.46 46.84.26 18.38-1.42 37.27-2.5 54.6-8.8 15.37-5.58 29.54-14.7 42.17-25.1 11-9.06 19.82-20.59 28.52-31.88 5.93-7.7 11.02-16.01 16.04-24.32 5.99-9.9 12.49-21.05 16.78-30.38'
                />
                <path
                  fill='#f8878c'
                  stroke='#f8878c'
                  strokeWidth='6.68'
                  d='M667.18 700.65s6.12 10.6 16.77 22.3c6.03 6.63 12.3 14.07 18.11 19.94 4.28 4.32 8.25 7.47 11.99 11.17 4.58 4.55 17.26 12.95 26.66 18.17 7.42 4.12 15.2 7.67 23.27 10.28a239.8 239.8 0 0 0 45.89 9.77 260.31 260.31 0 0 0 50.2 1.17c18.38-1.42 37.3-3.4 54.43-9.77 8.95-3.33 16.5-7.68 24.58-12.9 5.93-3.84 13.2-9.65 17.37-13.15 8.97-7.55 18.82-20.21 27.1-31.24 5.73-7.63 10.46-15.97 15.52-24.06a960.28 960.28 0 0 0 12.55-20.72s-37.2 9.04-41.04 10.38c-5.07 1.78-21.76 12.84-28.13 19.26-8.88 8.96-20.04 19.36-32.2 25.79-7.73 4.08-17.9 6.42-25.08 7.66-7.25 1.26-30.5 4.16-37 4.22-5.78.05-39.52-1.7-58.91-5.23-13.05-2.37-25.85-6.18-38.34-10.66-13.9-4.98-27.06-11.81-40.5-17.95a106.23 106.23 0 0 1-9.42-4.9c-5-3.09-8.2-5.49-8.97-5.65-6.99-1.45-13.54-1.55-24.85-3.88z'
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
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='3.34'
                    d='M761.69 703.97s1.56 7.75 3.38 14.86c1.23 4.81 2.76 9.44 5.06 10.24 4.03 1.39 9.41 1.5 14.16 1.87 4.56.35 9.14.46 13.72.34 3.88-.1 8.94-.17 12.8-.59 6.74-.72 17-2.78 19.32-4.08 0 0 2.6-.54 4.41-7.53 0 0 1.15-13.88 1.06-15.62 0 0 .18-11.61-.1-13.26l-23.59 4.88-21.38 3.99z'
                  />
                  <path
                    fill='#cecece'
                    d='m762.85 704.77 71.89-13.4s.63 18.7-1.3 28.02c-.32 2.58-1.27 4.53-3.18 6.1-.3.25-1.3.62-1.97.86-2.12.75-4.9 1.26-9.09 2.04 0 0 2.26-8.57 1.67-12.85-.53-3.84-1.58-8.24-4.57-10.7-1.23-1.02-3.08-.97-4.67-1.01-16-.43-47.4 7.62-47.4 7.62z'
                  />
                </g>
                <g>
                  <path
                    fill='#fff'
                    stroke='#a2a4a4'
                    strokeWidth='3.34'
                    d='M837.7 689.56s36.6-5.12 42.17-4.57c2.57-.55 42.54 3.2 45.93 4.3-.1 1.28-.92 9.33-1.47 10.6-1.45 3.4-5.3 10.88-7.31 13.09-3.1 3.42-6.47 6.67-10.52 8.78-3.82 1.99-8.2 2.7-12.45 3.38-6.93 1.14-14.01 1.08-21.04 1.24-5.45.12-10.95.42-16.37-.23-4.88-.59-12.21-1.6-14.36-3.3-3.06-2.38-3.85-4.47-4.21-7.04-.38-2.62-.73-14.18-.46-16.55 0 0-.36-8.88.1-9.7z'
                  />
                  <path
                    fill='#cecece'
                    d='M838.3 690.55s-.45 23.79 1.25 27.35c.44.9-.05 1.08 2.32 3.39.5.48.67.65 1.73 1.25.95.53 2.36.82 3.8 1.22a36 36 0 0 0 7.13 1.08s-.37-6.32-.45-9.4c-.15-5.56.12-7.94.27-9.5.4-4.1.37-6.46 2.38-8.7 1.45-1.6 2.83-2.61 6.86-2.47l60.24 2.65 1.13-7.38s-25.55-3.35-38.4-3.96c-4.65-.22-9.15-.26-13.95.12-5.16.4-13 1.64-19.4 2.25-7.58.72-12.49 1.7-14.92 2.1z'
                  />
                </g>
              </g>
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path
                  fill='#fe8185'
                  stroke='#83422f'
                  strokeWidth='5.01'
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
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g>
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
                <g>
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
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <g transform='translate(0.4,2)'>
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
                <g transform='translate(0.98193359,1.8616028)'>
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
              <g
                strokeWidth='1.67'
                transform='matrix(0.80377838,0,0,0.8035618,157.01747,88.183209)'>
                <path
                  fill='#803300'
                  stroke='#520'
                  strokeWidth='3.34'
                  d='M849.43 185.97s31.2-11.3 42.5-9.7c0 0 21.52 8.62 26.36 14.54l12.38 11.3c2.69-10.22 4.44-32.96 1.61-39.7 0 0-13.45-20.04-20.44-24.35 0 0-6.46-2.15 1.61-7.53 0 0 23-14.91 26.42-20.02-1.46-.2-10.37-4.23-14.09-4.8-12.82-1.94-24.7-1.23-32.64 2.89-7.36 3.81-16.81 5.78-26.5 18.7 0 0-22.05 2.7-32.81 14.53-.54 3.77.53 28.53 15.6 44.14z'
                />
                <path
                  fill='#803300'
                  stroke='#520'
                  strokeWidth='3.34'
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
            <g>
              <circle
                cx='500'
                cy='500'
                r='490'
                fill='none'
                stroke='#2b0000'
                strokeWidth='2'
                opacity='0'
              />
            </g>
          </g>

          <g className='star-circle'>
            <path
              opacity='1'
              fill='lightsalmon'
              stroke='none'
              strokeWidth='2'
              d='M617.1 821.38c45.02 19.53 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-15.07-89.13-21.59-133.86-6.43-44.13-19.16-116.61-17.27-132.69 1.87-15.83 65.5-72.27 99.03-107.68 30.06-31.75 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-95.72-14.94-143.52-22.79-44.13-7.24-101.2-11.63-132.25-22.43-5.13-1.78-42.19-87.16-64.5-130.13-21.5-41.37-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-44.73 78.4-66.2 118.1-22.88 42.33-29.7 53.17-66.69 128.02-1.86 3.75-88.5 15.13-132.81 22.38-47.8 7.83-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 66.1 65.13 97.67 99.1 32.31 34.77 89.76 82.01 93.85 107.11 3.09 18.98-10.12 86.76-16.32 129.98-6.4 44.74-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 90.76-44.92 136.37-66.9 39.52-19.04 99.23-57.03 118.95-56.3 18.94.71 82 36.82 118.96 56.3z'>
              <animate
                ref={starAnimateRef}
                // proxy animation trigger in order to add delay in the animation that i want and start it programmatically
                // either add duration here or at the animate element begin = 'proxy.end + time'
                id='home_star_anim_trigger'
                begin='indefinite'
              />

              <animate
                attributeName='d'
                dur='2.5s'
                begin='indefinite'
                calcMode='spline'
                fill='freeze'
                keySplines='0 0 1 1; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0; .7 0 .84 0;'
                // keyTimes='0; .30; .37; .44; .51; .58; .65; .72; .79; .86; .93; 1'
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
            </path>
          </g>
          <g>
            <circle
              className='testt-circle'
              ref={circleRef}
              cx='500'
              cy='500'
              r='488'
              fill='none'
              stroke='red'
              strokeWidth='10'
              opacity='1'
              strokeDasharray='20 21'
              pathLength='20'
              strokeDashoffset='0'>
              {/* <animate
                id='home_circle_dash_offset'
                attributeName='stroke-dashoffset'
                attributeType='XML'
                dur='1s'
                begin='home_star_anim_trigger.begin'
                from='20.1'
                to='0'
                fill='freeze'
              /> */}
            </circle>
          </g>
        </svg>
        {/* <svg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'>
          <g>
            <path
              stroke='#280b0b'
              fill='#280b0b'
              strokeWidth='2'
              opacity='1'
              d='M617.1 821.38c45.02 19.53 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-15.07-89.13-21.59-133.86-6.43-44.13-19.16-116.61-17.27-132.69 1.87-15.83 65.5-72.27 99.03-107.68 30.06-31.75 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-95.72-14.94-143.52-22.79-44.13-7.24-101.2-11.63-132.25-22.43-5.13-1.78-42.19-87.16-64.5-130.13-21.5-41.37-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-44.73 78.4-66.2 118.1-22.88 42.33-29.7 53.17-66.69 128.02-1.86 3.75-88.5 15.13-132.81 22.38-47.8 7.83-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 66.1 65.13 97.67 99.1 32.31 34.77 89.76 82.01 93.85 107.11 3.09 18.98-10.12 86.76-16.32 129.98-6.4 44.74-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 90.76-44.92 136.37-66.9 39.52-19.04 99.23-57.03 118.95-56.3 18.94.71 82 36.82 118.96 56.3z'
            />
            <path
              fill='none'
              stroke='#280b0b'
              strokeWidth='2'
              opacity='0'
              d='M617.1 821.38c49.35-11.29 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-43.68-94.43-21.59-133.86 34.38-61.34 193.29-63.98 195.18-80.05 1.87-15.84-118.55-95.06-113.42-160.32 3.42-43.6 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-113.16 14.96-143.52-22.79-40.35-50.15 42.34-181.97 11.3-192.77-5.14-1.78-144.18 70.36-208.05 40.21-42.16-19.9-43.4-82.83-66.8-122.86-15.94-26.68-30.35-13.49-42.82 6.92-11.63 19.03-24.3 101.31-66.2 118.1-58.75 23.54-144.54-130.56-181.53-55.72-1.85 3.75 29.05 155.67-17.97 206.12-33.03 35.44-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 90.84 53.23 97.67 99.1C162.48 555 44.19 653.6 48.28 678.7c3.1 18.98 146.14-11.04 180.82 40.03 25.4 37.4-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.29-79.33 136.37-66.9 63.08 15.98 93.49 158.3 113.21 159.03 18.94.7 59.03-144 124.7-159.03z'
            />
            <path
              fill='none'
              stroke='#280b0b'
              strokeWidth='2'
              opacity='0'
              d='M617.1 821.38c49.35-11.29 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-43.68-94.43-21.59-133.86 34.38-61.34 193.29-63.98 195.18-80.05 1.87-15.84-118.55-95.06-113.42-160.32 3.42-43.6 62.3-61.43 91.56-93.94 22.48-22.78 20.12-40.5-12.8-47.96-47.55-9.24-113.34 15.1-143.52-22.79-40.54-50.86 35.65-170.66 13.2-194.68-13.74-14.7-69.38-50.09-117.13-69.84-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-115.59 35.17-147.56 75.39-5.76 7.24 31.2 157.28-16.06 208.51-32.85 35.61-95.97 13.4-143.53 22.8-32.22 5.92-33.5 25.48-14.68 46.07 53.3 58.34 90.84 53.23 97.67 99.1C162.48 555 44.19 653.6 48.28 678.7c3.1 18.98 146.14-11.04 180.82 40.03 25.4 37.4-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.29-79.33 136.37-66.9 63.08 15.98 93.49 158.3 113.21 159.03 18.94.7 59.03-144 124.7-159.03z'
            />
            <path
              fill='none'
              stroke='#280b0b'
              strokeWidth='2'
              opacity='0'
              d='M617.1 821.38c49.35-11.29 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-43.68-94.43-21.59-133.86 34.38-61.34 193.29-63.98 195.18-80.05 1.87-15.84-118.55-95.06-113.42-160.32 3.42-43.6 62.6-61.17 91.56-93.94 17.74-20.07 25.64-29.84 12.24-60.82-11.01-25.48-24.93-55.55-45.4-87.07-20.48-31.52-57.74-75.93-98.45-110.77-15.3-13.09-80.89-56.86-128.64-76.61-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-110.28 38.57-150.94 69.97-17.26 13.34-78.18 55.48-112.83 107.02C77.32 258.29 59.8 287.5 47.6 323.59c-9.45 27.96-17.25 47.15-3.85 58.94 59.32 52.22 99.45 51.01 107.82 99.1C164.29 554.7 44.19 653.6 48.28 678.7c3.1 18.98 146.14-11.04 180.82 40.03 25.4 37.4-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.29-79.33 136.37-66.9 63.08 15.98 93.49 158.3 113.21 159.03 18.94.7 59.03-144 124.7-159.03z'
            />
            <path
              fill='none'
              stroke='#280b0b'
              strokeWidth='2'
              opacity='0'
              d='M617.1 821.38c49.35-11.29 97.34 52.99 136.37 66.9 39.02 13.9 38.7-6.88 35.3-35.7-8.65-44.37-43.68-94.43-21.59-133.86 34.38-61.34 188.3-65.4 195.18-80.05 12.4-26.37 20.9-116.79 22.92-147.54 2.03-30.75-10.97-91.11-14.55-107.62-5.67-26.17-9.66-34.69-17.99-59.92-8.7-26.36-24.93-55.55-45.4-87.07-20.48-31.52-57.74-75.93-98.45-110.77-15.3-13.09-80.89-56.86-128.64-76.61-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-110.28 38.57-150.94 69.97-17.26 13.34-78.18 55.48-112.83 107.02C77.32 258.29 59.8 287.5 47.6 323.59c-9.45 27.96-13.17 33.47-17.38 50.82-4.3 17.7-18.44 78.45-16.02 125.5 2.43 47.04 4.28 104.97 34.08 178.78 7.2 17.83 146.14-11.04 180.82 40.03 25.4 37.4-15.6 89.44-21.58 133.86-5.45 33.25 1.15 47.82 35.3 35.7 34.15-12.12 87.29-79.33 136.37-66.9 63.08 15.98 93.49 158.3 113.21 159.03 18.94.7 59.03-144 124.7-159.03z'
            />
            <path
              fill='none'
              stroke='#280b0b'
              strokeWidth='2'
              opacity='0'
              d='M617.1 821.38c49.35-11.29 111.55 61.79 136.37 66.9 24.81 5.1 47.4-9.5 54.92-14.04 20.84-12.6 71.3-70.62 88.04-95.3 16.73-24.66 57.7-103.97 67.96-139.6 8.07-27.99 18.87-117.46 20.9-148.21 2.02-30.75-10.98-91.11-14.56-107.62-5.67-26.17-9.66-34.69-17.99-59.92-8.7-26.36-24.93-55.55-45.4-87.07-20.48-31.52-57.74-75.93-98.45-110.77-15.3-13.09-80.89-56.86-128.64-76.61-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-110.28 38.57-150.94 69.97-17.26 13.34-78.18 55.48-112.83 107.02C77.32 258.29 59.8 287.5 47.6 323.59c-9.45 27.96-13.17 33.47-17.38 50.82-4.3 17.7-17.77 81.83-15.34 128.88 2.43 47.04 12.4 122.57 30.7 164.58 7.67 17.63 41.84 96.62 80.67 141.53 38.83 44.9 31.96 37.5 66.38 66.19 15.53 12.94 20.77 18.72 50.19 12.69 29.42-6.03 87.29-79.33 136.37-66.9 63.08 15.98 93.49 158.3 113.21 159.03 18.94.7 59.03-144 124.7-159.03z'
            />
            <path
              fill='none'
              stroke='#280b0b'
              strokeWidth='2'
              opacity='0'
              d='M656.34 958.07c50.07-18.57 89.9-41.07 108.63-52.88 18.73-11.8 35.9-26.41 43.42-30.95 20.84-12.6 71.3-70.62 88.04-95.3 16.73-24.66 57.7-103.97 67.96-139.6 8.07-27.99 18.87-117.46 20.9-148.21 2.02-30.75-10.98-91.11-14.56-107.62-5.67-26.17-9.66-34.69-17.99-59.92-8.7-26.36-24.93-55.55-45.4-87.07-20.48-31.52-57.74-75.93-98.45-110.77-15.3-13.09-80.89-56.86-128.64-76.61-47.75-19.76-108.64-32.52-149.1-34.83-24.6-1.4-42.09-.65-64.82.23-13.18.51-58.94 7.02-90.6 15.22-31.66 8.2-110.28 38.57-150.94 69.97-17.26 13.34-78.18 55.48-112.83 107.02C77.32 258.29 59.8 287.5 47.6 323.59c-9.45 27.96-13.17 33.47-17.38 50.82-4.3 17.7-17.77 81.83-15.34 128.88 2.43 47.04 12.4 122.57 30.7 164.58 7.67 17.63 41.84 96.62 80.67 141.53 38.83 44.9 31.96 37.5 66.38 66.19 15.53 12.94 28.9 22.1 40.04 30.28 11.15 8.18 84.48 48.02 141.1 62.35 56.63 14.33 97.56 15.51 117.28 16.25 18.93.7 115.23-7.83 165.3-26.4z'
            />
          </g>
        </svg> */}
      </div>
      <p className='par-test'>search like you never did before</p>

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
      {/* <svg
        version='1.1'
        viewBox='0 0 100 100'
        className='curved'
        preserveAspectRatio='xMidYMid meet'>
        <defs>
          <pattern id='grid22' width='10%' height='10%' viewBox='0 0 1 1'>
            <line
              x1='0'
              x2='1'
              y1='0'
              y2='0'
              strokeWidth='0.1'
              stroke='black'
            />
            <line
              x1='0'
              x2='0'
              y1='0'
              y2='1'
              strokeWidth='0.1'
              stroke='black'
            />
          </pattern>
          <path
            id='textPath22'
            d='M 20 25 Q 50 5 80 25'
            fill='none'
            stroke='black'
          />
        </defs>
        <rect width='100%' height='100%' fill='teal' />
        <path
          id='textPath33'
          d='M 20 85 Q 50 105 80 85'
          fill='none'
          stroke='black'
        />
        <text stroke='black' fill='black' className='svgtext'>
          <textPath href='#textPath22'>Moovies</textPath>
        </text>
        <text stroke='black' fill='black' className='svgtext2'>
          <textPath href='#textPath33' strokeWidth='.2'>
            browse like you never did before
          </textPath>
        </text>
      </svg> */}
    </article>
  );
};

//  <svg
//  width='50%'
//  preserveAspectRatio='xMidYMid meet'
//  ref={cowRef}
//  className='cow'
//  xmlSpace='preserve'
//    viewBox='0 0 1600 900'>
//    <defs>
//      <radialGradient
//        xlinkHref='#a'
//        id='d'
//        cx='652.26'
//        cy='-445.69'
//        r='111.24'
//        fx='652.26'
//        fy='-445.69'
//        gradientTransform='matrix(.17349 0 0 .17349 763.25 409.43)'
//        gradientUnits='userSpaceOnUse'></radialGradient>
//      <radialGradient
//        xlinkHref='#b'
//        id='c'
//        cx='651.33'
//        cy='-202.69'
//        r='111.24'
//        fx='651.33'
//        fy='-202.69'
//        gradientTransform='translate(755.225 403.22)scale(.18586)'
//        gradientUnits='userSpaceOnUse'></radialGradient>
//      <radialGradient
//        xlinkHref='#a'
//        id='f'
//        cx='652.26'
//        cy='-445.69'
//        r='111.24'
//        fx='652.26'
//        fy='-445.69'
//        gradientTransform='matrix(.17349 0 0 .17349 635.685 412.819)'
//        gradientUnits='userSpaceOnUse'></radialGradient>
//      <radialGradient
//        xlinkHref='#b'
//        id='e'
//        cx='651.33'
//        cy='-202.69'
//        r='111.24'
//        fx='651.33'
//        fy='-202.69'
//        gradientTransform='translate(627.66 406.609)scale(.18586)'
//        gradientUnits='userSpaceOnUse'></radialGradient>
//      <linearGradient id='a'>
//        <stop offset='0' stopColor='#cf5f02'></stop>
//        <stop offset='1' stopColor='#454545' stopOpacity='0'></stop>
//      </linearGradient>
//      <linearGradient id='b'>
//        <stop offset='0' stopColor='#ff8000'></stop>
//        <stop offset='1' stopColor='#b35700' stopOpacity='0'></stop>
//      </linearGradient>
//    </defs>
//    <path
//      fill='#fff'
//      d='m707.45 145.25-24.74 62.8 256.5-2.11-17.34-62.38z'></path>
//    <path
//      fill='#a68854'
//      stroke='#83422f'
//      strokeWidth='4'
//      d='M706.81 146.3s-36.24-7.61-48.63-10.99c-13.96-3.8-28.34-9.1-49.48-20.93-9.83-5.5-18.51-13.2-26-21.61-8.6-9.66-15.03-21.14-21.16-32.53-3.82-7.1-8.5-17.05-16.7-18.82-5.74-1.23-13.25 2.05-16.08 7.2-7.97 14.53-7.91 32.1-7.4 48.42.26 8.08 2.6 16.04 5.18 23.72 3.13 9.33 6.86 18.66 12.37 26.81a165.1 165.1 0 0 0 36.37 38.49c13.34 10.18 28.9 17.3 44.41 23.68s42.3 13.54 48.21 14.38c5.93.85 23.48-29.6 38.91-77.81z'></path>
//    <path
//      fill='#d0b990'
//      d='M536.75 43.9c-1.83.9-2.73 3.09-3.57 4.94-1 2.22-1.3 4.72-1.6 7.14-.31 2.6-.32 5.24-.17 7.86a187.4 187.4 0 0 0 4.54 32.67 112.4 112.4 0 0 0 7.4 21.57c4.6 9.76 9.93 19.38 16.92 27.6 7.75 9.09 16.64 17.72 27.17 23.36 22.2 11.9 48.56 27.4 72.75 20.4 5.5-1.59 10.26-6.49 13.2-11.54.77-1.33.72-3 .91-4.53.32-2.59.1-5.22.35-7.82.3-3.09.84-6.15 1.4-9.2.84-4.64.52-6.32 2.9-13.85-6.07-.55-27.4-6.87-40.76-11.42a107 107 0 0 1-11.52-4.65c-12.61-6.09-24.82-13.4-35.53-22.42-7.32-6.17-13.63-13.58-19.24-21.35-6.88-9.54-10.22-21.39-17.44-30.67-2.28-2.93-4.62-6.26-8.04-7.71-2.97-1.27-6.77-1.79-9.67-.37z'></path>
//    <path
//      fill='#fcfcfc'
//      stroke='#fcfcfc'
//      strokeWidth='0.5'
//      d='M547.1 55.58c.47 4.64 2.09 9.11 3.77 13.45 2.2 5.68 6.37 12.93 8.19 16.3 2.6 4.85 6.81 10.28 9.34 13.6 4.67 6.12 4.75 5.67 7.25 8.39a188 188 0 0 0 6.97 7.08 171 171 0 0 0 7.97 7.46 178 178 0 0 0 19.6 14.17c13.55 8.24 26.02 15.25 43.81 18.54 17.8 3.29 7.07-9.08 3.74-10.32-8.44-3.15-10.32-3.89-17.94-6.13-3.63-1.07-12.23-3.82-17.99-6.59-6.23-3-12.1-6.77-17.75-10.76-5.36-3.77-10.4-8-15.25-12.4A131 131 0 0 1 576.4 95.8c-5.15-6.13-9.65-12.8-13.9-19.58-3.03-4.82-8.23-14.96-8.23-14.96s-2.84-5.23-4.34-6.87c-.4-.44-1.85-1.65-2.67-1.14-.67.4-.25 1.56-.17 2.33z'></path>
//    <path
//      fill='#a68854'
//      stroke='#83422f'
//      strokeWidth='4'
//      d='M919.99 145.25s36.25-7.62 48.63-11c13.96-3.8 28.34-9.09 49.49-20.93 9.82-5.5 18.5-13.19 26-21.6 8.59-9.67 15.02-21.14 21.15-32.54 3.82-7.09 8.5-17.05 16.7-18.82 5.74-1.23 13.26 2.05 16.08 7.2 7.97 14.53 7.91 32.1 7.4 48.42-.26 8.09-2.6 16.05-5.18 23.72-3.13 9.33-6.86 18.66-12.37 26.82a165.1 165.1 0 0 1-36.37 38.48c-13.34 10.18-28.9 17.31-44.41 23.69-15.51 6.37-42.3 13.53-48.21 14.38-5.92.84-23.47-29.6-38.91-77.82z'></path>
//    <path
//      fill='#d0b990'
//      d='M1087.66 42.85c1.83.89 2.73 3.08 3.56 4.93 1 2.22 1.3 4.72 1.6 7.14.32 2.6.33 5.24.18 7.86a188 188 0 0 1-4.54 32.67c-1.77 7.4-4.17 14.7-7.4 21.57-4.6 9.76-9.93 19.38-16.92 27.6-7.75 9.09-16.65 17.72-27.18 23.36-22.2 11.9-48.55 27.41-72.74 20.4-5.5-1.59-10.26-6.48-13.2-11.54-.77-1.33-.72-3-.91-4.52-.32-2.6-.1-5.23-.35-7.83-.3-3.09-.84-6.15-1.4-9.2-.84-4.64-.52-6.32-2.9-13.85 6.07-.55 27.4-6.87 40.75-11.42 3.93-1.33 8.05-2.97 11.53-4.65 12.61-6.08 24.82-13.4 35.52-22.41 7.33-6.18 13.64-13.6 19.25-21.36 6.88-9.54 10.22-21.38 17.44-30.66 2.28-2.93 4.62-6.27 8.04-7.72 2.97-1.26 6.77-1.79 9.67-.37'></path>
//    <path
//      fill='#fcfcfc'
//      stroke='#fcfcfc'
//      strokeWidth='0.5'
//      d='M1077.32 54.52c-.48 4.64-2.1 9.11-3.78 13.46-2.2 5.67-6.37 12.92-8.19 16.3-2.6 4.84-6.81 10.27-9.34 13.59-4.67 6.12-4.75 5.67-7.25 8.39a194 194 0 0 1-6.97 7.09c-2.6 2.54-5.73 5.57-7.97 7.46a178 178 0 0 1-19.6 14.16c-13.55 8.25-26.02 15.25-43.81 18.54-17.8 3.29-7.07-9.08-3.74-10.32 8.44-3.15 10.31-3.89 17.94-6.13 3.63-1.07 12.23-3.82 17.99-6.59 6.23-3 12.1-6.77 17.75-10.75 5.35-3.78 10.4-8 15.25-12.41 4.36-3.96 8.62-8.06 12.4-12.56 5.16-6.14 9.66-12.8 13.91-19.6 3.03-4.81 8.23-14.94 8.23-14.94s2.84-5.24 4.33-6.88c.4-.44 1.86-1.65 2.68-1.14.67.4.25 1.56.17 2.33z'></path>
//    <g strokeWidth='4'>
//      <path
//        fill='#faf9f5'
//        stroke='#83422f'
//        strokeWidth='2'
//        d='M809.8 204.03c-12.09-.18-24.14-1.35-36.18-2.44-13.91-1.26-27.68-4.19-41.64-4.75-10.57-.42-21.53-1.76-31.72 1.06-15.39 4.26-29.54 13.13-41.87 23.26-5.57 4.57-9.75 10.65-13.96 16.5-5.4 7.5-8.92 16.23-14.38 23.68-3.98 5.44-8.14 10.9-13.32 15.22-5.3 4.41-11.15 8.63-17.76 10.58-6.8 2-10.39 3.31-21.24.8-4.95-1.16-9.7-8.9-13.98-6.14-26.42 17.14-28.98 80.77-.63 94.48 6.46 3.12 20.38-22.69 16.78-13.48-3.53 9.04-4.65 12.2-6.52 18.65-9.68 33.44-18.94 63.82-27.54 95.98-5.64 21.1-12.66 41.97-15.76 63.58-2.06 14.39-2.92 29.07-1.81 43.56 1.25 16.48 3.99 33.1 9.55 48.66 9.48 26.53 24.09 51.2 39.95 74.49 11.3 16.58 25.44 31.07 38.96 45.9 12.36 13.55 24.7 27.24 38.49 39.33 13.25 11.62 27.16 22.68 42.29 31.72a239.2 239.2 0 0 0 44.83 20.72c13.09 4.5 26.76 7.35 40.44 9.42 16.96 2.57 34.18 3.33 51.33 3.7 19.18.4 38.46.45 57.52-1.7 16.56-1.87 33.15-4.73 49.06-9.73 14.34-4.5 28.72-9.9 41.32-18.11 14.4-9.39 26.49-20.26 38.08-32.16 15.15-15.54 28.5-32.86 40.7-50.8a436 436 0 0 0 34.26-60.06c10.45-22.31 19.93-45.32 25.87-69.23 3.65-14.67 6.37-29.86 5.85-44.96-.59-17.24-4.71-34.37-10.15-50.75-6.93-20.88-18.27-40.06-28.33-59.63a866 866 0 0 0-25.98-46.82c-9-15.12-27.12-54.64-19.17-45.55 7.94 9.08 6.94 13.62 12.16 11.6 38.07-14.78 42.1-99.08 8.46-122.23-3.59-2.47-8.33 2.93-11.85 5.5-6.2 4.52-9.04 12.98-15.64 16.91-5.88 3.5-13.13 6.15-19.88 5.08-6.76-1.08-13.02-5.69-17.34-11-6.56-8.06-5.79-20.18-11-29.18-5.97-10.3-14.05-19.42-22.74-27.58a88.8 88.8 0 0 0-18.24-13.23c-5.87-3.2-12.32-5.24-18.69-7.25a95 95 0 0 0-14.65-3.59c-11.31-1.66-22.87-2.94-34.24-1.8-7.9.8-15.34 4.05-23.03 5.99-6.52 1.64-12.93 3.85-19.59 4.78-8.94 1.25-18.04 1.16-27.08 1.02z'></path>
//      <path
//        fill='#90421d'
//        d='M556.08 442.84s4.25-17.45 10.65-37.13c3.87-11.9 7.08-25.36 8.88-26.8 0 0 3.65-5.16 8.8-11.27 5.72-6.8 13.53-14.36 21-17.31 0 0 7.35-1.06 11.15-3.52 0 0 6.04-6.08 7.24-14.76 0 0 .3-21.46 1.33-40.09.66-11.74.85-16.56 3.02-24.5.83-3.03 2.34-5.84 3.76-8.64 2.3-4.5 5.02-8.78 7.69-13.08a296 296 0 0 1 8.14-12.37c2.65-3.84 4.87-8.1 8.23-11.33 6.86-6.62 15.3-11.47 23.72-15.95a98.5 98.5 0 0 1 18.02-7.36 46.8 46.8 0 0 1 8.81-1.74c4.47-.44 8.98-.14 13.46-.02 7.66.2 15.33.47 22.95 1.24 9.22.95 23.61 3.53 27.5 4.15 0 0 7.86 12.04 11.45 27.68 1.06.64 3.6 22.42 4.02 24.96l1.55 19.97.53 17.16-.38 4.63-4.86-8.6s-17.27-7.77-22.72-8.6c0 0-12.41-3.13-21.83-.07 0 0-10.77-.82-21.05 7.1 0 0-12.52 5.84-17.53 14.81 0 0-11.81 16.22-15.03 28.33 0 0-6.2 31.93 12.04 61.83l11.66 10.47 2.34 3.2-19.35 18.2-8.56-4.34s-4.34-4.44-16.07-9.73c0 0-2.12-2.96-11.63-2.11-2.54-.21-15.23 8.46-17.34 11.42 0 0-17.77 12.05-23.69 15 0 0-16.28 7.2-22.62 7.41 0 0-14.17 4.02-16.7 2.75 0 0-9.68 2.22-18.58-1z'></path>
//      <path
//        fill='#b1673f'
//        d='M667.43 409.4c-1.14.75-2.42-1.34-3.75-1.66-.98-.23-2.01-.15-3.01-.17-2.33-.03-4.73-.4-6.98.2-2.18.56-4.07 1.94-5.97 3.14-2.22 1.4-4.25 3.1-6.32 4.71-1.29 1-2.5 2.1-3.8 3.1a127 127 0 0 1-5.36 3.82c-4.6 3.15-9.1 6.5-14 9.16a91.6 91.6 0 0 1-12.6 5.52 137 137 0 0 1-17.23 4.92c-4.15.9-10.32 2.17-12.6 1.91 0 0 2.76-10.66 3.7-13.12 0 0 12.94-40.58 19.77-60.75 2.25-6.66 4.4-19 7-19.9 2.55-.89 6.8-1.5 9.68-3.33 1.12-.72 1.95-1.82 2.77-2.86a23.7 23.7 0 0 0 2.89-4.97c.3-.67.66-1.32.85-2.03 1.08-4.14.9-8.52 1.55-12.75.56-3.71.68-7.58 2.02-11.09 1.32-3.47 3.56-6.55 5.81-9.51a71 71 0 0 1 10.36-11.1 83.4 83.4 0 0 1 14.6-9.84 55 55 0 0 1 8.35-3.49 63 63 0 0 1 10.15-2.75c.93-.15 2.32-.47 2.84-.17.1.78-1.69 3.13-2.5 4.71-1.79 3.45-3.73 6.82-5.24 10.4a150 150 0 0 0-7.26 21.28 131.7 131.7 0 0 0-3.92 23.31c-.53 7.92-.17 15.9.74 23.79.8 6.86 2.83 13.52 4.13 20.3 1.13 5.9 2.6 11.78 3.17 17.76.36 3.8 3.34 9.35.16 11.46'></path>
//      <path
//        fill='#90421d'
//        d='M820.78 317.34s-.26-7.56.07-16.13c.24-6.02.97-12.6 1.37-17.15.6-6.91 1.46-13.8 2.7-20.63a267 267 0 0 1 5.96-25.66c2.9-10.15 5.94-20.33 10.2-30 .78-1.75 1.32-3.78 2.78-5.03 2.27-1.96 5.15-2.11 8.45-3.12 4.52-1.38 10.4-3.84 14.5-4.64 3.86-.75 8.3-1.64 11.78-2.14 3.76-.53 7.59-.61 11.38-.73 6.52-.2 13.99.85 20.91 1.88a128 128 0 0 1 16.88 3.53c6.34 1.84 12.75 3.82 18.56 6.97 6.61 3.58 12.5 8.41 18.17 13.34 4.43 3.84 8.53 8.09 12.3 12.57 3.36 3.98 6.66 8.15 9.15 12.64 1 1.8 2.27 3.7 3.17 5.56 2.02 4.13 2.41 8.72 3.93 13.06a68 68 0 0 1 2.33 9.28c2.35 12.33 1.78 25.44 4.93 37.34 2.43 9.15 6.29 20.4 10.66 28.14 1.3 2.32 2 4.43 3.55 5.95 0 0 11.78 14.36 14.8 18.1 0 0 8.74 11.17 9.69 17.88.32 2.26.3 5.24-1.47 6.7-2.73 2.27-7.08 1.32-10.65.35-5.2-1.42-10.33-3.9-15.75-4.14-4.6-.2-9.59-.4-13.63 2.3 0 0-6.77 7.26-7.52 10.25 0 0-5.98 14.5-7.92 16l-31.85-22.58-14.2-7.93s15.25-15.1 1.2-67.58c0 0-11.52-20.64-29.61-28.86 0 0-11.52-10.02-32.15-5.83 0 0-19.89-3.74-37.98 19.14l-11.96 13.45z'></path>
//      <path
//        fill='#b1673f'
//        d='M988.56 395.38s-13.9-11.84-17.27-19.97c-3.9-9.41-1.25-20.35-2.24-30.5-.88-9.1-1.25-18.3-3.29-27.21-2.44-10.68-7.06-20.74-10.61-31.1-2.55-7.41-13.9-17.49-7.66-22.22 9.33-7.07 24.9 15.31 28.89 19.97 0 0 11.66 11.37 15.03 16.15 0 0 8.9 9.42 10.09 11.67 0 0 5.87 17.78 10.46 25.86 2.7 4.74 7.13 8.31 9.87 13.01 6.34 10.85 14.96 34.58 14.96 34.58s-2.88 1.11-4.38 1.12c-3.52 0-6.84-1.67-10.24-2.59-2.94-.8-5.84-1.73-8.79-2.53-.34-.1-.67-.21-1.02-.26-1.1-.14-2.2-.1-3.3-.06-2.45.1-5.01-.16-7.31.69a19.2 19.2 0 0 0-7.35 5.16c-2.59 2.83-5.56 8.77-5.72 9.98z'></path>
//      <path
//        fill='#dad7c8'
//        d='M528.45 576.57s1.03 12.07 2.9 26.78c1.74 13.64 5.98 24.83 8.5 32.71 2.83 8.82 6.82 16.64 10.8 24.69 5.6 11.26 11.55 22.37 18.38 32.92a306 306 0 0 0 16.26 22.98c2.6 3.33 5.97 7.18 8.62 10.46 5.05 6.26 10.46 11.63 15.75 17.7a404 404 0 0 0 14.9 16.01c2.6 2.67 5.02 5.6 7.63 8.45 3.36 3.67 6.83 6.9 10.23 10.28 2.76 2.74 5.84 5.75 8.7 8.4 1.95 1.82 3.85 3.46 5.27 4.73 3.96 3.52 15.16 13.55 23.38 19.5 8.3 6 17.16 11.22 26.1 16.22a198 198 0 0 0 18.32 9.16c10.6 4.42 21.11 8.28 32.26 11.2 7.95 2.06 16.45 3.52 24.52 4.95 10.9 1.94 22.32 2.68 33.4 3.29 9.07.5 18.25.63 27.31.86 14.84.39 32.62-.14 48.8-1.86 11.45-1.2 24.13-3.2 35.9-5.95 14.17-3.32 27.81-8.26 41.06-14.13 9.63-4.26 18.26-10.2 26.54-16.55 11.41-8.75 21.72-18.94 31.54-29.44 9.19-9.82 17.47-20.48 25.5-31.26a369 369 0 0 0 19.5-28.77 518 518 0 0 0 23.78-44 463 463 0 0 0 14.46-33.94c3.1-8.04 5.7-16.32 8.53-24.42.49-1.4.84-4.58.84-4.58-1.48 4.91-4.25 11.64-6.8 17.28-4.35 9.58-9.36 18.87-14.47 28.07-8.08 14.58-15.9 29.4-25.61 42.95-10.15 14.18-21.27 27.82-33.9 39.85A282.7 282.7 0 0 1 990 787.59c-13.1 8.01-27.31 14.18-41.65 19.67-14.38 5.5-29.13 10.3-44.25 13.2-25 4.78-50.64 7.94-76.07 6.72-21.2-1.01-42.11-6.14-62.61-11.64a317 317 0 0 1-48.13-17.08 281.4 281.4 0 0 1-39.15-21.73c-15.4-10.17-32.88-24.67-43.74-33.96a341 341 0 0 1-20.02-19.32 220 220 0 0 1-16.67-19.54c-11.08-14.94-20.44-31.1-30.1-47-5.27-8.67-10.5-17.38-15.18-26.38-4.5-8.67-8.39-17.63-12.35-26.55-4.04-9.07-6.8-15.76-11.63-27.41'></path>
//    </g>
//    <path
//      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
//      d='M750 238.74s-8.19-6.14-13.05-7.06c-4.48-.84-9.21.38-13.58 1.69-4.47 1.34-8.66 3.63-12.55 6.2-4.46 2.96-8.32 6.76-12.16 10.49-1.56 1.51-2.5 3.23-4.4 4.8.11-2.33.5-3.41 1.08-5.03a64.7 64.7 0 0 1 8-15.44c3.17-4.48 6.77-8.85 11.28-11.98 4.21-2.93 9.06-5.63 14.18-6 4.4-.3 9.14.92 12.81 3.37 4.1 2.74 7.53 7.05 8.93 11.78.68 2.3 1.15 6.53-.54 7.18M881.71 236.86s8.2-6.14 13.05-7.06c4.49-.84 9.22.37 13.59 1.68 4.47 1.35 8.65 3.64 12.54 6.21 4.46 2.96 8.32 6.76 12.17 10.48 1.56 1.52 2.5 3.24 4.4 4.82-.11-2.34-.5-3.42-1.09-5.04a64.7 64.7 0 0 0-8-15.44c-3.17-4.48-6.77-8.85-11.27-11.98-4.22-2.93-9.07-5.63-14.19-6-4.4-.3-9.14.92-12.8 3.37-4.1 2.74-7.54 7.05-8.93 11.77-.68 2.3-1.15 6.54.53 7.19'></path>
//    <ellipse
//      cx='738.8'
//      cy='347.42'
//      fill='#6a2710'
//      rx='66.21'
//      ry='73.11'></ellipse>
//    <ellipse
//      cx='747.21'
//      cy='347.4'
//      fill='#3f181d'
//      rx='66.07'
//      ry='70.22'></ellipse>
//    <ellipse
//      cx='747.33'
//      cy='347.73'
//      fill='#90421d'
//      rx='62.01'
//      ry='66.5'></ellipse>
//    <ellipse
//      cx='749.7'
//      cy='354.93'
//      fill='#e7e5e4'
//      rx='59.37'
//      ry='60.65'></ellipse>
//    <ellipse cx='749.7' cy='355.39' fill='#fff' rx='48.21' ry='49.4'></ellipse>
//    <g transform='scale(-1 1)'>
//      <ellipse
//        cx='-884.2'
//        cy='336.03'
//        fill='#6a2710'
//        rx='67.12'
//        ry='67.44'></ellipse>
//      <ellipse
//        cx='-880.09'
//        cy='345.98'
//        fill='#3f181d'
//        rx='66.35'
//        ry='70.86'></ellipse>
//      <ellipse
//        cx='-880.16'
//        cy='345.85'
//        fill='#90421d'
//        rx='62.11'
//        ry='66.5'></ellipse>
//      <ellipse
//        cx='-876.59'
//        cy='355.24'
//        fill='#e7e5e4'
//        rx='59'
//        ry='60.47'></ellipse>
//      <ellipse
//        cx='-876.69'
//        cy='355.33'
//        fill='#fff'
//        rx='48.3'
//        ry='49.76'></ellipse>
//    </g>

//    <g className='cow__ear cow__ear--left'>
//      <animateTransform
//        id='ear_flop_left'
//        attributeName='transform'
//        attributeType='XML'
//        type='skewX'
//        dur='200ms'
//        values='1;5;1'
//        begin='click'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='scale'
//        dur='200ms'
//        values='1;0.8;1'
//        begin='ear_flop_left.begin'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='skewY'
//        dur='200ms'
//        values='0;15;0'
//        begin='ear_flop_left.begin'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='rotate'
//        dur='200ms'
//        values='0;5;0'
//        begin='ear_flop_left.begin'
//        additive='sum'
//      />
//      <path
//        fill='#501202'
//        stroke='#83412f'
//        strokeWidth='2'
//        d='M125.81 282.36c21.18-5.67-9 7.72 84.53-33.64l101.54-48.15s61.93-24.3 94.63-27.21c16.3-1.46 33.74-1.25 50.15 2.06 12.78 2.57 25.04 7.74 36.66 13.65 14.93 7.6 31.96 15.72 41.91 27.72 5.12 6.16 7.8 10.42 11.1 16 6.05 10.25 11.12 21.07 15.86 31.98 2.74 6.3 3.86 10.5 7.25 19.29 0 0 8.18 34.72 6.95 61.57 0 0-1.3 13.59-4.02 19.71-2.68 6.05-7.38 11.04-11.78 15.98-5.22 5.86-10.94 10.82-17.2 16.08-8.76 7.36-18.74 14.31-27.63 20.38-12.94 8.82-30.99 18.04-48.96 22.78-22.12 5.83-43.81 6.15-51.83 6-14.54-.27-44.25-6.23-63.18-14.56-18.93-8.34-59.98-40.3-72.94-58.59-12.95-18.28-11.74-18.36-17.77-27.44 0 0-10.8-21.08-19.26-29.04-5.57-5.24-7.86-8.98-19.84-11.5-11.99-2.5-36.91 5.6-50.22 5.64-13.32.03-19.74-.59-29.18-3.12-13.48-3.61-25.19-23.33-16.77-25.59z'></path>
//      <path
//        fill='#91411d'
//        d='M318.98 199.65c34.47-15.22 53.7-25.62 109.88-26.55 0 0 19.9-1.26 41.5 5.38 21.65 6.66 46.97 17.67 58.34 31.5 6.62 8.06 9.05 22.14 4.94 30.87-1.31 2.79-7.76 3-11.42 1.08-12.47-6.56-25.46-20.22-34.72-25.15-12.61-6.73-30.16-18.01-57.41-17.75-20.01.19-38.27-4.32-105.25 27.78 0 0-25 16.05-42.9 24.07 0 0-22.45 12.18-44.43 17.07-23.17 5.16-44.18 2.65-36.59-1.64 0 0 38.51-20.26 50.54-26.03 12.03-5.76 43.53-30.05 67.52-40.63'></path>
//      <path
//        fill='#aa6d50'
//        d='M343.98 194.7c12.57-8 31.23-16.2 42.28-17.9 14.42-2.23 20.74-4.71 49.08-1.85 51.85 5.25 81.17 28.7 83.02 33.34 1.85 4.63-3.05 10.7-6.79 9.57-8.06-2.47-13.49-6.66-21.97-11.95-13.22-8.26-29.53-14.46-37.9-16.76-17.73-4.87-30.25-6.48-44.76-5.25-7.56.65-7.32 1.02-24.7 3.34-9.77 1.3-21.61 3.99-38.57 10.86-5.84 2.37-2.44-.4.3-3.4z'></path>
//      <path
//        fill='#fd8186'
//        stroke='#83422f'
//        strokeWidth='2'
//        d='M227.41 293.44s29.77-11.74 57.52-29.2c27.24-17.14 57.27-32.7 62.95-35.4 33.01-15.7 50.8-17.7 55.66-17.78 14.18-.27 35.78 1.17 46.27 4.8 18.4 6.36 24.59 10.9 36.22 18.55 17.14 11.27 29.44 21.13 47.15 39.53 11.73 12.2 26.01 27.36 39.06 51.37 0 0-.44 43.43-83.15 91 0 0-34.81 17.03-69.84 17.36 0 0-38.08-1.97-68.2-16.8 0 0-28.92-14.74-60.78-55.33 0 0-15.9-23.99-26.78-37.29-1.48-1.8-9.12-10.5-9.12-10.5s-12.99-14.63-26.96-20.3z'></path>
//      <path
//        fill='#feb4b8'
//        d='M324.75 262.02s-18.33 12.87-18.55 41.25c-.22 28.37 43 61.32 71.15 70.49 28.15 9.16 48.45 11.35 81.18 8.07 18.63-1.86 31.94-11.03 43.63-23.42 9.05-9.6 16.59-22.57 20.76-29.4 9.6-15.7 21.82-33.82 24-36 1.23-1.23-13.92-17.09-28.66-30.73-11.53-10.66-21.47-18.62-28.3-22.3 0 0-4.56-5.18-27.11-16.3 0 0-4.95-4.44-23.52-8.37-2.73-.57-10.62-2.18-16.15-2.26-5.45-.08-10.08 1.57-13.88 2.7-18.74 5.6-41.61 15.3-56.18 24.44-20.51 12.88-28.37 21.83-28.37 21.83'></path>
//    </g>
//    <g className='cow__ear cow__ear--right'>
//      <animateTransform
//        id='ear_flop_right'
//        attributeName='transform'
//        attributeType='XML'
//        type='skewX'
//        dur='200ms'
//        values='1;-5;1'
//        begin='click'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='scale'
//        dur='200ms'
//        values='1;0.8;1'
//        begin='ear_flop_right.begin'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='skewY'
//        dur='200ms'
//        values='0;-15;0'
//        begin='ear_flop_right.begin'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='rotate'
//        dur='200ms'
//        values='0;-5;0'
//        begin='ear_flop_right.begin'
//        additive='sum'
//      />
//      <path
//        fill='#501202'
//        stroke='#83422f'
//        strokeWidth='1.5'
//        d='M1044.92 272.89s11.64-18.5 16.94-28.07c4.63-8.36 6.8-10.15 16.66-20.74 18.47-19.86 44.32-41.08 79.35-50.36 75.55-20.02 157.4 22.22 198.15 50 40.74 27.78 54.78 41.97 58.95 43.36 4.17 1.4 8.8 5.71 23.15 11.12 14.35 5.4 29.17 10.33 35.5 12.96 6.32 2.62 3.39 7.87 3.39 7.87s-8.49 7.87-16.67 11.57-18.2 5.25-18.2 5.25-6.18 1.23-20.38-1.54c0 0-15.12-4.48-19.9-4.17-4.79.3-5.72-1.39-20.53 4.17-14.82 5.55-31.02 22.22-34.88 25.92s-11.26 14.66-14.81 20.68-20.68 31.33-27.93 36.27c0 0-18.83 22.53-39.97 32.56-21.15 10.03-37.4 15.54-57.78 17.11-14.86 1.15-36.21.82-55.16-4.97-6.82-2.09-14.9-4.42-20.45-7.57-7.11-4.03-20.72-11.04-31.43-18.09-24.04-15.82-41.25-29.81-53.16-48.12-14.12-21.69-10.54-44.58-.84-95.21z'></path>
//      <path
//        fill='none'
//        stroke='#000'
//        strokeOpacity='0.22'
//        strokeWidth='1.5'
//        d='m1049.32 270.97-3.71 3.92s-8.51 43.87-8.3 58.71c0 0 11.36-10.91 12.66-18.11 0 0 3.5-7.86 4.59-20.52 0 0-2.62-18.77-5.24-24z'></path>
//      <path
//        fill='#903c1e'
//        stroke='#903c1e'
//        strokeWidth='1.5'
//        d='M1091.82 228.35c1.63-5.83 3.45-11.23 6.06-16.46 2.15-4.3 4.12-9.04 7.83-12.09 20.2-16.62 47.08-24.64 72.84-29.17 17.88-3.14 36.46-.83 54.42 1.8 16.4 2.4 32.6 6.76 48.09 12.68 17.83 6.81 34.14 17.1 51 26.06 6.62 3.52 10.83 5.23 19.68 10.89 4.55 2.9 13.8 9.43 15.56 11.91 6.68 9.48 4.58 6 11.35 15.83 0 0 12.77 15.5 17.13 17.35 0 0 15.28 11.24 20.63 12.98l15.71 7.86s7.42 3.6 10.91 6.98c0 0 1.86 1.42.33 2.51-1.53 1.1-12.55 2.6-18.88 2.3-8.97-.45-17.9-2.7-26.3-5.9-10.93-4.18-20.97-10.56-30.66-17.13-12.45-8.45-23.45-18.86-35.03-28.48-11.93-9.91-22.92-21-35.46-30.12-11.42-8.3-23.03-16.73-36.01-22.26-7.4-3.15-15.42-4.75-23.36-6-10.04-1.58-20.3-2.68-30.44-1.86-11.49.93-22.74 4.13-33.72 7.64-12.02 3.85-23.56 9.12-34.92 14.62-10.06 4.88-19.46 11.05-29.35 16.26-4.6 2.43-11.57 6.55-13.97 6.99 0 0-4-3.2-3.44-5.2z'></path>
//      <path
//        fill='#a86d52'
//        d='M1111.08 205.93c1.28-7.17 16.85-14.05 26.63-18.77 14.68-7.08 30.79-11.43 46.92-13.75 14.84-2.13 30.08-1.82 44.96 0 10.49 1.28 20.75 4.3 30.77 7.64 7.27 2.42 19.17 7.7 21.17 8.95 7.88 4.94 6.55 3.05 7.64 4.8 0 0 1.96 2.62-3.71.43a4636 4636 0 0 0-18.99-7.2s-18.77-4.8-24.66-5.24c-5.9-.43-15.28-3.92-42.34-.21-27.06 3.7-41.25 10.7-41.25 10.7s-17.59 8.62-26.19 13.3c-4.95 2.7-12.44 7.86-14.62 8.51-2.18.66-7.6-1.99-6.33-9.16'></path>
//      <path
//        fill='#fd8186'
//        d='M1057.61 295.63s28.88-19.86 42.6-30.74c11.24-8.9 20.63-20.12 32.48-28.19 15.06-10.26 30.95-20.24 48.45-25.32 18.65-5.4 38.97-8.39 58.05-4.8a133.2 133.2 0 0 1 34.88 11.64c9.37 4.71 17.28 11.9 25.8 18.04 12.64 9.13 25.4 18.14 37.53 27.94 12.19 9.85 29.25 23.57 35.36 30.99 0 0-18.45-1-27.06 1.75a35.8 35.8 0 0 0-14.85 9.16c-10.34 10.84-14.43 26.26-21.82 39.29-5.77 10.17-10.4 21.13-17.6 30.35-9.06 11.6-22.21 24.17-31.72 30.75-13.28 9.2-29.86 13.31-45.83 15.72a156.9 156.9 0 0 1-55.87-1.75c-18.63-4-36.02-12.84-52.82-21.82-12.4-6.63-24.03-14.74-35.05-23.47-4.26-3.37-8.14-7.23-11.94-11.12-3.7-3.77-7.3-7.67-10.56-11.82-3.67-4.68-8.42-12.09-10.1-14.7 0 0 20.07-24 20.07-41.9'></path>
//      <path
//        fill='#feb4b8'
//        d='M1144.37 230.48c9.56-3.28 20.05-3.43 30.17-3.31 14.44.16 29.37 2.68 42.94 5.71 20.72 4.63 41.45 12.55 58.49 25.2 10.1 7.52 21.53 16.64 24.33 28.93.36 1.57-1.2 4.69-1.2 4.69s-13.37 7.48-18.66 12.87c-8.16 8.32-12.77 19.5-19.31 29.14-9.17 13.49-14.83 30.47-27.94 40.16-14.1 10.42-32.69 13.9-50.09 16.04-13.1 1.6-26.8.94-39.5-2.62-15.4-4.31-29.99-12.26-42.56-22.15-8.26-6.5-14.82-15.09-20.73-23.8-5.04-7.4-9.82-15.7-12.33-23.89 0 0-8.64-17.42-9.18-23.31 0 0 22.68-14.77 33.26-23.17 10.24-8.12 18.68-18.4 29.14-26.22 7.26-5.44 14.59-11.32 23.17-14.27'></path>
//    </g>
//    <path
//      fill='#631108'
//      d='m684.55 689.92 315.66-21.22-69.86 63.65s-91.07 41.92-111.77 32.09-111.78-40.88-125.75-53.3-8.28-21.22-8.28-21.22'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='m785.52 741.22.71-10.8-17.72-2.4s-3.02 7.47-1.68 8.47c1.55 1.17 18.65 5.45 18.7 4.73z'></path>
//    <path
//      fill='#cfcfcf'
//      d='m784.94 740.5.58-7.37s-6.08 2.13-8.99 1.23c0 0-7.24-1.04-8.47-3.24l-1.17 4.99s4.7 1.37 9.36 2.55c3.87.98 7.72 1.81 8.69 1.84'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M802.53 743.93c.67-.25.72-13.26.72-13.26l-15.08.26s-1.05 10.52-.25 10.93c2.67 1.38 13.3 2.58 14.61 2.07z'></path>
//    <path
//      fill='#cfcfcf'
//      d='m802.19 743.64.27-8.18s-4.07 1.04-6.13.97c-2.7-.1-7.19-.46-7.9-1.82l-.32 6.79 6.87 1.43z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M823.43 746.07s.84-12.16-1.55-15.4c0 0-.84-2.26-15.85.13 0 0-1.23 13.2-.78 13.4.45.18 18.05 2.7 18.18 1.87z'></path>
//    <path
//      fill='#cfcfcf'
//      d='M822.85 745.68v-6.66s-4.3.67-7.7.7c-3.21.04-4.34 0-8.93-2.32l-.45 6.34z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M845.3 746.55c1.1-.07-.15-8.62-.55-11.53-.28-1.98-2.13-4.17-4.12-4.39-2.59-.28-14.61-1.33-14.45-.09.3 2.4-.81 15.6.36 16.01z'></path>
//    <path
//      fill='#cfcfcf'
//      d='m845.2 746.1-1-10.71c-3.57 1.74-6.22 4.2-9.97 4.48 0 0-6.59 0-7.6-1.1l.19 7.05z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M866.24 745.64c.33-.91-.27-10.26-1.92-13.27-1.33-2.44-5.6-1.8-8.5-1.83-2.18-.01-4.82-.21-6.4 1.28-1.59 1.5-1.65 2.66-1.65 6.31 0 0-.19 8.15.45 8.42 0 0 17.6.26 18.02-.91z'></path>
//    <path
//      fill='#cfcfcf'
//      d='m865.92 745.82-.82-8.28s-5.27 2.16-8.74 2.52c-2.11.21-6.22 1.14-8.05-.6l.23 6.59z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M883.72 742.96s-.41-6.58-.72-9.7c-.16-1.67-.51-2.46-3.17-3.62-1.53-.68-7.9-.38-9.9 1.29-1.22 1.02-2.2 1.49-1.97 5.6 0 0 .27 8.93 1.33 9.21 1.65.45 14.47-2.2 14.43-2.78z'></path>
//    <path
//      fill='#cfcfcf'
//      d='m883.04 742.6-.68-8.08s-2.98 2.23-5.57 1.97c0 0-6.25 1-8.12-.29 0 0 .33 9 .91 9.19 0 0 3.23-.57 6.44-1.18a67 67 0 0 0 7.02-1.6z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M886.28 730.82s-1.37 11.12.09 11.7c1.54.63 10.09-2.43 11.43-3.2 1.15-.64-1.42-11.75-2.56-12.25-1.38-.61-8.96 1.33-8.96 3.75z'></path>
//    <path
//      fill='#cfcfcf'
//      d='M897.53 739.05s-.07-2.21-.26-3.3c-.2-1.18-.93-3.47-.93-3.47s-2.2 1.83-4.85 2.56c0 0-3.84 1.1-5.03.64v6.59l5.03-1.18z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='1.5'
//      d='M899.18 730.8c.1 2.04.87 7.3 1.42 7.12 3.31-1.17 19.5-8.16 18.24-9.38-1.34-1.3-5.11-2.28-8.28-2.91 0 0-6.21-1.17-7.9.13-2.08 1.6-3.61 2.71-3.48 5.04z'></path>
//    <path
//      fill='#cfcfcf'
//      d='m900.15 731.48.38 5.58s5.06-1.45 9.14-3.4c3.9-1.86 8.26-4.46 8.43-4.97 0 0-1.78-1.38-7.54-2.48 0 0-9 5.56-10.41 5.27'></path>
//    <g id='bottom-lip' transform='scale(0.95) translate(0 -23)'>
//      {/* additive animation: the values provided must be subtracted from the original transform */}
//      <animateTransform
//        id='cow_bottom_lip'
//        attributeName='transform'
//        attributeType='XML'
//        type='translate'
//        values='0 0; 0 23; 0 0'
//        dur='1s'
//        begin='click'
//        additive='sum'
//      />
//      <animateTransform
//        attributeName='transform'
//        attributeType='XML'
//        type='scale'
//        values='1; 1.05; 1'
//        dur='1s'
//        begin='cow_bottom_lip.begin'
//        additive='sum'
//      />
//      <path
//        fill='none'
//        stroke='#83422f'
//        strokeWidth='4'
//        d='M659.2 695.61s33.3 46.52 55.36 64.17c14.59 11.67 31.88 20 49.42 26.4 15.66 5.7 32.34 8.56 48.9 10.34 15.53 1.67 31.27 1.46 46.84.26 18.38-1.42 37.27-2.5 54.6-8.8 15.37-5.58 29.54-14.7 42.17-25.1 11-9.06 19.82-20.59 28.52-31.88 5.93-7.7 11.02-16.01 16.04-24.32 5.99-9.9 12.49-21.05 16.78-30.38'></path>
//      <path
//        fill='#f8878c'
//        stroke='#f8878c'
//        strokeWidth='4'
//        d='M667.18 700.65s6.12 10.6 16.77 22.3c6.03 6.63 12.3 14.07 18.11 19.94 4.28 4.32 8.25 7.47 11.99 11.17 4.58 4.55 17.26 12.95 26.66 18.17 7.42 4.12 15.2 7.67 23.27 10.28a240 240 0 0 0 45.89 9.77 260.3 260.3 0 0 0 50.2 1.17c18.38-1.42 37.3-3.4 54.43-9.77 8.95-3.33 16.5-7.68 24.58-12.9 5.93-3.84 13.2-9.65 17.37-13.15 8.97-7.55 18.82-20.21 27.1-31.24 5.73-7.63 10.46-15.97 15.52-24.06a960 960 0 0 0 12.55-20.72s-37.2 9.04-41.04 10.38c-5.07 1.78-21.76 12.84-28.13 19.26-8.88 8.96-20.04 19.36-32.2 25.79-7.73 4.08-17.9 6.42-25.08 7.66-7.25 1.26-30.5 4.16-37 4.22-5.78.05-39.52-1.7-58.91-5.23-13.05-2.37-25.85-6.18-38.34-10.66-13.9-4.98-27.06-11.81-40.5-17.95a106 106 0 0 1-9.42-4.9c-5-3.09-8.2-5.49-8.97-5.65-6.99-1.45-13.54-1.55-24.85-3.88z'></path>
//      <path
//        fill='#fcb6ba'
//        d='M727.03 748.15c7.03 6.47 16.53 11.27 25.3 16.03 6.29 3.4 12.75 6.55 19.5 8.88a168.5 168.5 0 0 0 33.12 8.03c11.98 1.56 24.16 1.25 36.23.77a329 329 0 0 0 40.88-4.14c11.62-1.93 23.33-4.02 34.41-8.02 9.13-3.3 18.25-7.24 26.04-13.02 7.82-5.8 14.93-12.95 20.05-21.22 4.2-6.79 7.52-14.53 8.25-22.48.37-4.04.57-10.14-2.06-12-3.88-2.74-8.22-.57-13.13 4.15-5.88 5.64-11.33 9.74-14.28 11.98-5.6 4.26-11.63 9.15-17.97 12.91a124 124 0 0 1-19.4 9.32 162.6 162.6 0 0 1-28.47 8.02c-10.3 1.86-20.84 2.26-31.3 2.59-8.97.28-17.96.03-26.92-.52-7.44-.46-14.9-1.02-22.25-2.33-8.94-1.6-17.68-4.15-26.39-6.73-7.25-2.14-14.5-4.36-21.48-7.24-5.95-2.46-12.66-5.05-17.33-8.54-4.73-3.53-15.44-9.6-19.27-7.86-2.5 1.14-2.74 13.75 16.47 31.42'></path>
//      <path
//        fill='#fff'
//        d='M900.37 749.3c-4.36 1.45-10.1 4.22-10.62 8.78-.3 2.6 2.34 5.24 4.76 6.22 4.23 1.71 9.46.02 13.54-2.01 5.13-2.57 14.31-6.72 12.26-12.08-2.38-6.21-13.63-3.03-19.94-.91M932.02 739.23c2.45-.66 6.5-1.05 7.5 1.28.87 2.02-1.85 4.24-3.66 5.5a12.23 12.23 0 0 1-8.6 2c-1.27-.2-3.2-.73-3.3-2-.26-3.5 4.67-5.86 8.06-6.78'></path>
//    </g>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='2'
//      d='M761.69 703.97s1.56 7.75 3.38 14.86c1.23 4.81 2.76 9.44 5.06 10.24 4.03 1.39 9.41 1.5 14.16 1.87 4.56.35 9.14.46 13.72.34 3.88-.1 8.94-.17 12.8-.59 6.74-.72 17-2.78 19.32-4.08 0 0 2.6-.54 4.41-7.53 0 0 1.15-13.88 1.06-15.62 0 0 .18-11.61-.1-13.26l-23.59 4.88-21.38 3.99z'></path>
//    <path
//      fill='#cecece'
//      d='m762.85 704.77 71.89-13.4s.63 18.7-1.3 28.02c-.32 2.58-1.27 4.53-3.18 6.1-.3.25-1.3.62-1.97.86-2.12.75-4.9 1.26-9.09 2.04 0 0 2.26-8.57 1.67-12.85-.53-3.84-1.58-8.24-4.57-10.7-1.23-1.02-3.08-.97-4.67-1.01-16-.43-47.4 7.62-47.4 7.62z'></path>
//    <path
//      fill='#fff'
//      stroke='#a2a4a4'
//      strokeWidth='2'
//      d='M837.7 689.56s36.6-5.12 42.17-4.57c2.57-.55 42.54 3.2 45.93 4.3-.1 1.28-.92 9.33-1.47 10.6-1.45 3.4-5.3 10.88-7.31 13.09-3.1 3.42-6.47 6.67-10.52 8.78-3.82 1.99-8.2 2.7-12.45 3.38-6.93 1.14-14.01 1.08-21.04 1.24-5.45.12-10.95.42-16.37-.23-4.88-.59-12.21-1.6-14.36-3.3-3.06-2.38-3.85-4.47-4.21-7.04-.38-2.62-.73-14.18-.46-16.55 0 0-.36-8.88.1-9.7z'></path>
//    <path
//      fill='#cecece'
//      d='M838.3 690.55s-.45 23.79 1.25 27.35c.44.9-.05 1.08 2.32 3.39.5.48.67.65 1.73 1.25.95.53 2.36.82 3.8 1.22a36 36 0 0 0 7.13 1.08s-.37-6.32-.45-9.4c-.15-5.56.12-7.94.27-9.5.4-4.1.37-6.46 2.38-8.7 1.45-1.6 2.83-2.61 6.86-2.47l60.24 2.65 1.13-7.38s-25.55-3.35-38.4-3.96c-4.65-.22-9.15-.26-13.95.12-5.16.4-13 1.64-19.4 2.25-7.58.72-12.49 1.7-14.92 2.1z'></path>
//    <path
//      fill='#fe8185'
//      stroke='#83422f'
//      strokeWidth='3'
//      d='M782.65 392.4c-16.3 1.51-32.97 2.97-48.4 8.46-13.36 4.74-25.7 12.36-37.12 20.76-11.1 8.17-19.53 19.48-30 28.44a275 275 0 0 1-18.38 14.17c-5.88 4.23-12.36 7.63-18.07 12.1-7.46 5.81-14.74 11.97-21.05 19.02-8.75 9.79-16.68 20.46-23 31.97-5.9 10.74-10.88 22.2-13.64 34.14-3.11 13.47-4.56 27.61-3.07 41.35 1.6 14.67 4.73 29.99 12.7 42.41 10.86 16.95 27.55 30.46 45.34 39.9 17.63 9.34 38.16 12.49 57.96 15 28.32 3.62 57.2 2.36 85.65 0 20.72-1.73 40.89-7.75 61.52-10.29 15.31-1.88 30.71-3.88 46.14-3.66 10.9.16 21.65 2.86 32.53 3.53 19.55 1.18 39.3 3.14 58.73.8 16.6-2.01 33.65-5.02 48.55-12.6 8.22-4.18 14.67-11.24 21.39-17.55 4.3-4.04 8.45-8.3 12.06-12.96 6.7-8.7 13.8-17.53 17.62-27.82 6.61-17.86 9.98-37.57 8.26-56.53-1.27-13.96-7.47-27.17-13.47-39.84-5.36-11.34-11.7-22.44-19.92-31.93-9.32-10.76-21.04-19.27-32.62-27.56-8.11-5.8-17.08-10.3-25.65-15.4-11.74-6.98-23.52-13.9-35.3-20.83-13.04-7.67-25.09-17.42-39.18-22.96-18.51-7.27-38.47-10.89-58.25-12.95-23.65-2.46-47.65-1.36-71.33.83z'></path>
//    <path
//      fill='#feb4b8'
//      d='M772.43 551.59c-12.09-8.13-23.7-17.61-37.37-22.67-11.12-4.12-23.24-5.41-35.1-5.8-11.97-.4-24.16.53-35.77 3.5-11.07 2.81-20.94 9.15-31.55 13.4-10.42 4.17-20.37 10.59-31.53 11.85-6.63.76-15.57 2.48-19.83-2.66-3.13-3.76 1.67-11.06 3.94-16.08 6.24-13.79 16.52-26.5 25.98-37.21 2.76-3.12 6.69-7.29 9.81-10.06 3.6-3.19 6.8-5.48 10.57-8.44 4.63-3.63 9.77-6.56 14.57-9.97 4.46-3.16 8.9-6.36 13.2-9.74 3.2-2.5 6.31-5.09 9.33-7.79 3.5-3.12 6.74-6.5 10.15-9.72 5.27-4.99 10.65-10.43 15.93-14.85 4.97-4.16 9.92-8.11 15.17-11.65 5.9-3.98 11.87-6.7 18.48-9.34 18.06-7.22 38.92-9.17 58.76-11.03 23.2-2.18 46.77-2.81 69.92-.12 19.9 2.32 39.9 6.44 58.5 13.9 6.5 2.61 11.32 6.78 18.13 10.63 2.92 1.65 5.35 3.87 8.11 5.67 5.46 3.54 11.13 6.74 16.72 10.06 4.32 2.57 8.67 5.09 13.01 7.62 6.66 3.9 13.32 7.82 20 11.69 4.15 2.4 8.46 4.56 12.5 7.17 5.24 3.41 10.67 6.72 15.17 11.07 3.9 3.77 8.78 7.53 10.01 12.8.6 2.55.22 5.8-1.6 7.67-6.02 6.17-16.73 4.2-25.18 5.95-11.38 2.36-23.1 3.13-34.32 6.15-13 3.5-26.05 7.5-37.95 13.78-10.02 5.28-18.37 13.27-27.62 19.81-8.67 6.13-17.14 12.55-26.13 18.2-8.75 5.5-17.3 11.64-26.99 15.25-7.43 2.77-15.4 4.95-23.32 4.7-11.68-.36-23.35-3.95-33.88-9.02-7.4-3.58-12.99-10.13-19.82-14.72'></path>
//    <path
//      fill='#fff'
//      d='M789.97 410.87c-11.67 2.46-23.07 6.3-34.11 10.8a197 197 0 0 0-27.4 13.84c-7.22 4.36-14 9.42-20.59 14.68-5.6 4.47-10.79 9.42-16.03 14.3-3.83 3.54-7.75 7-11.24 10.88-4.84 5.38-9.05 11.89-13.4 17.07.39-3.61 3.28-15.7 7.07-22.64a123.3 123.3 0 0 1 30.15-36.02c8.93-7.28 19.71-12.19 30.44-16.4 9.42-3.7 19.36-6.22 29.38-7.62 8.17-1.14 16.5-1.1 24.73-.6 2.38.15 7.1 1.04 7.1 1.04s-4.1.24-6.1.67'></path>
//    <path
//      fill='#8e4039'
//      d='M733.22 576.08c-6.74-7.48-10.24-11.02-16.02-15.8-5.64-4.66-11.43-9.38-18.07-12.46-8.81-4.09-18.42-7.23-28.13-7.64-8.34-.35-16.84 1.48-24.63 4.48-9.34 3.6-17.74 9.55-25.52 15.85-3.78 3.07-10.12 10.56-10.12 10.56 1.09-2.96 7.9-11 12.96-15.43 6.73-5.88 14.2-11.42 22.64-14.34 10.6-3.66 22.35-5 33.45-3.41 9.93 1.43 19.37 6.04 27.87 11.37 8.47 5.31 15.57 12.66 22.28 20.07 4.67 5.15 12.38 16.78 12.38 16.78-5.45-6.05-4.45-4.88-9.09-10.03'></path>
//    <path
//      fill='#feb4bb'
//      d='M636.73 568.2c3.7-1.48 7.44-2.96 11.35-3.7 7.46-1.4 15.24-2.54 22.73-1.3 10 1.67 19.17 6.8 28.15 11.5 5.22 2.72 9.98 6.26 14.84 9.6 3.43 2.34 6.4 5.44 10.11 7.31 2.9 1.45 6.48 3.57 9.28 2.91 2.65-.62.84-4.98-2.02-9.8-2.3-3.88-5.26-8.07-7.12-10.86-3.52-5.27-8.25-9.7-13.11-13.77a72.2 72.2 0 0 0-14.83-9.79c-5.84-2.8-12.06-5.17-18.48-6.01-7.49-.98-15.4-1-22.6 1.25-7.05 2.2-13.36 6.67-18.88 11.55-2.84 2.52-6.13 6.64-7.08 8.92-1.48 3.5-1.04 5.15-1 6.6 2.22-.75 3.99-2.54 8.66-4.41'></path>
//    <path
//      fill='#f44d5b'
//      d='M646.04 569.74c-.01.68.48 8.27 1.5 16.21.6 4.57 1.57 7.65 2.82 10.91a40.6 40.6 0 0 0 8.72 13.7c4.94 5.07 11.23 8.8 17.62 11.86 4.35 2.08 9.13 3.15 13.83 4.27 5.46 1.31 10.98 2.68 16.6 2.86 6.02.2 17.02-1.53 17.97-1.89.66-.25.82 7.94-.18 11.7-.78 2.96-2.53 5.62-4.41 8.02-1.35 1.72-2.88 3.42-4.8 4.44-4.84 2.55-10.52 3.53-15.99 3.66-9.71.22-19.45-2.16-28.7-5.18-8.08-2.63-16.71-5.37-22.95-11.15-5.48-5.08-8.96-12.26-11.3-19.35-2.75-8.3-3.2-17.33-2.9-26.06.2-5.29-.01-11.17 2.87-15.6 3.33-5.13 9.35-11.12 9.3-8.98z'></path>
//    <path
//      fill='#5b1106'
//      d='M646.16 568.99c.37-1.27 10.21-2.83 15.45-2.83 7.4 0 14.9 1.46 21.87 3.97 9.1 3.27 18.35 7.44 25.3 14.16 3.75 3.63 7 7.63 9.45 12.33a75 75 0 0 1 4.09 9.37c2.4 6.67 3.4 16.2 3.1 22.23 0 0-3.59 1.07-5.44 1.37-2.59.43-5.78.61-7.85.61-10.57 0-20.79-2.32-30.53-5.86-7.8-2.84-15.79-6.33-21.74-12.1-5.56-5.4-9.56-12.6-11.9-19.98-2.35-7.42-2.36-21.38-1.8-23.27'></path>
//    <path
//      fill='#f44d5b'
//      d='M1024.18 552.9c0 .68-.77 8.25-2.08 16.15a43.9 43.9 0 0 1-3.21 10.8 40.6 40.6 0 0 1-9.21 13.38c-5.12 4.88-11.54 8.4-18.03 11.21-4.42 1.93-9.24 2.82-13.97 3.78-5.5 1.1-11.08 2.28-16.7 2.26-6.02-.02-16.95-2.14-17.89-2.54-.64-.27-1.1 7.9-.24 11.7.67 2.98 2.33 5.7 4.12 8.17 1.28 1.77 2.75 3.53 4.64 4.61 4.74 2.72 10.39 3.9 15.84 4.23 9.7.58 19.52-1.46 28.87-4.14 8.17-2.34 16.9-4.76 23.34-10.32 5.66-4.87 9.39-11.93 11.99-18.93 3.04-8.2 3.83-17.2 3.83-25.94 0-5.29.41-11.16-2.3-15.7-3.15-5.23-8.95-11.44-8.99-9.3z'></path>
//    <path
//      fill='#5b1106'
//      d='M1024.1 552.14c-.34-1.27-10.11-3.19-15.35-3.38-7.4-.27-14.94.93-22 3.18-9.2 2.94-18.6 6.78-25.79 13.24a48.4 48.4 0 0 0-9.9 11.98 75 75 0 0 0-4.41 9.23c-2.64 6.57-3.98 16.06-3.9 22.1 0 0 3.55 1.2 5.39 1.57 2.57.51 5.75.82 7.82.9 10.57.37 20.86-1.59 30.72-4.78 7.9-2.55 16-5.75 22.16-11.3 5.75-5.2 10-12.25 12.61-19.55 2.62-7.32 3.13-21.27 2.64-23.19z'></path>
//    <path
//      fill='#8e4039'
//      d='M922.49 584.18s5.69-13.34 8.91-19.83c2.06-4.16 4.15-8.32 6.66-12.22 2.37-3.7 5-7.24 7.9-10.55a68.4 68.4 0 0 1 9.03-8.9c4.81-3.78 10-7.23 15.6-9.7a69 69 0 0 1 17.28-4.8 84 84 0 0 1 20.15-.66c4.9.44 9.67 1.9 14.44 3.11 4.16 1.06 11.27 2.6 12.35 3.65l1.23.41c-.57-1.04-6.63-4-10.23-5.36a68.3 68.3 0 0 0-17.79-4.43c-9.72-.93-19.8-.9-29.26 1.56a66.9 66.9 0 0 0-22.68 11.12c-7.03 5.2-12.83 12.06-17.9 19.2-3.35 4.72-5.8 10.06-8.1 15.37-3.08 7.13-7.6 22.03-7.6 22.03z'></path>
//    <path
//      fill='#feb4bb'
//      d='M936.96 573.63a64.16 64.16 0 0 1 10.52-27.76c4.14-6.06 10.06-10.95 16.31-14.78 6.22-3.81 13.23-6.79 20.45-7.78 9.23-1.27 18.9-.13 27.84 2.5 6.13 1.8 12.5 4.35 16.98 8.91 2.38 2.43 5.12 8.3 4.58 9.1-.58.87-6.35.03-8.4-.33-2.07-.36-12.45-1.67-18.68-1.33-7.57.43-15.1 2.03-22.4 4.13-5.12 1.48-10.26 3.25-14.87 5.94-4.71 2.74-8.92 6.36-12.76 10.23-3.07 3.1-6.06 7.5-8.1 10.28-.96 1.33-7.34 12.13-9.75 11.34-1.87-.6-2.34-5.55-1.72-10.45'></path>
//    <g ref={rightEyeRef} id='eye-right'>
//      <circle cx='876.28' cy='350.13' r='15.31' fill='#803300'></circle>
//      <circle cx='876.28' cy='350.13' r='15.31' fill='url(#c)'></circle>
//      <circle cx='876.28' cy='350.13' r='15.31' fill='url(#d)'></circle>
//      <circle cx='876.28' cy='350.12' r='8.97'></circle>
//      <circle
//        cx='881.47'
//        cy='342.62'
//        r='2.63'
//        fill='#fff'
//        opacity='0.9'></circle>
//    </g>
//    <g ref={leftEyeRef}>
//      <circle cx='748.72' cy='353.52' r='15.31' fill='#803300'></circle>
//      <circle cx='748.72' cy='353.52' r='15.31' fill='url(#e)'></circle>
//      <circle cx='748.72' cy='353.52' r='15.31' fill='url(#f)'></circle>
//      <circle cx='748.72' cy='353.51' r='8.97'></circle>
//      <circle
//        cx='753.91'
//        cy='346.01'
//        r='2.63'
//        fill='#fff'
//        opacity='0.9'></circle>
//    </g>
//    <path
//      fill='#803300'
//      stroke='#520'
//      strokeWidth='2'
//      d='M849.43 185.97s31.2-11.3 42.5-9.7c0 0 21.52 8.62 26.36 14.54l12.38 11.3c2.69-10.22 4.44-32.96 1.61-39.7 0 0-13.45-20.04-20.44-24.35 0 0-6.46-2.15 1.61-7.53 0 0 23-14.91 26.42-20.02-1.46-.2-10.37-4.23-14.09-4.8-12.82-1.94-24.7-1.23-32.64 2.89-7.36 3.81-16.81 5.78-26.5 18.7 0 0-22.05 2.7-32.81 14.53-.54 3.77.53 28.53 15.6 44.14z'></path>
//    <path
//      fill='#803300'
//      stroke='#520'
//      strokeWidth='2'
//      d='M865.03 226.33s9.15-16.15 2.15-30.14l-18.83-29.06s-15.06-9.15-10.76-22.6c0 0 15.6-16.7 25.83-18.3 0 0-2.16-11.3-10.76-17.23 0 0-16.14-10.76-44.12 4.85 0 0-31.2 12.91-46.27 12.37 0 0-33.66-3.49-42.5-7-5.58-2.2-23.5-11-22.67-22.8 0 0-7.89 11.74-.47 22.8 4.43 6.63 11.3 18.3 27.98 24.23 11.62 4.12 9.14.53 16.14 1.07-19.37 5.39-22.6 6.46-29.06 12.38 0 0-14.4 7.25-20.85 22.86-.86 3.67-7.66 18.58-2.28 25.58a387 387 0 0 1 28.35-20.36s10.98-4.1 17.07-4.21c-3.97 3.92-2.48 10.3-1.5 15.34.64 3.31 2.72 6.23 4.7 8.97 3.33 4.65 7 9.41 11.88 12.4 4.76 2.92 10.54 3.81 16.03 4.83 4.62.86 10.3 3.2 14.07 1.05-6.99-9.68-19.26-18.21-19.26-24.13 0 0 10.44 1.8 17.97-3.04 2.15 12.92 10.48 19.98 13.45 21.66 7.24 4.08 13.78 8.53 22.06 10.25l7 1.46c-10.23-9.69-10.77-23.14-8.61-30.14l1.61-10.76c5.38 9.68 5.38 9.15 15.06 16.14 0 0 20.85 9.19 24.75 12.38z'></path>
//    <path
//      fill='#a40'
//      d='M764.1 145.95s-10.66 13.32-11.8 17.13c10.27-2.29 19.78-10.28 28.15-11.42l17.12-6.47c-.76 10.65-20.32 44.37-20.32 44.37 6.47-8 33.64-50.84 33.64-50.84 2.66 14.08 1.52 13.32 7.22 26.26 0 0 15.22 17.5 24.35 25.12 0 0 14.46 12.94 14.08 15.98 0 0 5.32 14.36 6.47 16.41-.2-3.33 1.9-17.17 1.14-23.64 0 0-4.94-20-10.65-25.71 0 0-2.02-3.86-3.58-5.5-1.93-2.03-3.27-3.08-6.43-5.94-4.23-3.81-5.04-13.6-4.17-16.37 0 0 11.88-13.88 18.73-15.78 0 0 2-.92 3.52-5.11 0 0-.81-13.49-18.79-18.77l-64.97 19.61 30.03-5.97s-38.8 21.31-44.13 27.78M905.92 130.53s13.18-2.7 16.14-7c0 0 9.42-8.6 9.42-11.57-13.19-3.5-19.37-3.77-26.9-1.61 0 0-19.1 5.11-26.9 11.57 0 0-7 6.46-8.61 11.03 8.33-.8 23.4-7.26 28.24-6.19zM932.55 193.23s1.08-23.95 0-28.52c0 0-8.6-15.07-14.26-19.65l-17.48-14s-10.22.82-15.33 4.58c0 0-7 4.85-2.96 8.34l24.2 16.69c-11.56-1.88-33.15.6-35.8-2.15 0 0 7.83 3.5 14.29 6.45 0 0 16.94-1.61 30.4 12.65z'></path>

//  </svg>;
export default Home;
