import { useEffect, useRef } from 'react';
import '../styles/Home.scss';

const Home = () => {
  const circlePatternRef = useRef({ node: null, animation: null });
  const circlePatternRef2 = useRef({ node: null, animation: null });
  const circlePatternRef3 = useRef({ node: null, animation: null });

  useEffect(() => {
    const keyframes = [
      { fillOpacity: 0 },
      { fillOpacity: 1 },
      { fillOpacity: 0 },
    ];

    const timing = { duration: 600 };

    circlePatternRef.current.animation = circlePatternRef.current.node.animate(
      keyframes,
      timing
    );
    circlePatternRef2.current.animation =
      circlePatternRef2.current.node.animate(keyframes, timing);
    circlePatternRef3.current.animation =
      circlePatternRef3.current.node.animate(keyframes, timing);
    circlePatternRef.current.animation.pause();
    circlePatternRef2.current.animation.pause();
    circlePatternRef3.current.animation.pause();

    circlePatternRef.current.animation.play();
    circlePatternRef.current.animation.onfinish = (e) => {
      circlePatternRef2.current.animation.play();
    };

    circlePatternRef2.current.animation.onfinish = (e) => {
      circlePatternRef3.current.animation.play();
    };

    circlePatternRef3.current.animation.onfinish = (e) => {
      circlePatternRef.current.animation.play();
    };
  }, []);

  return (
    <article className='home'>
      <h1>Home</h1>
      <button
        onClick={() => {
          circlePatternRef.current.animation.play();
        }}>
        BsFs
      </button>
      <button
        onClick={() => {
          circlePatternRef.current.animation.cancel();
        }}>
        Pause
      </button>
      <svg
        version='1.1'
        width='500'
        height='500'
        viewBox='0 0 100 200'
        className='home__arrows'
        preserveAspectRatio='xMidYMid meet'>
        <defs>
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
              fill='skyblue'
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
              fill='skyblue'
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
              fill='skyblue'
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
      </svg>
    </article>
  );
};

export default Home;
