import { useEffect, useState } from 'react';
import '../../styles/ThemeButton.scss';
import Tooltip from '../Tooltip';

const storageKey = 'theme-preference';

const getThemePreference = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem(storageKey))
      return localStorage.getItem(storageKey);
    else
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }
};
let initialRender = true;

const ThemeButton = () => {
  const [theme, setTheme] = useState(getThemePreference);

  // If i have dark mode on Initial Render stop transition on moon entering (does not work in development)
  let noTransition;

  if (initialRender) {
    initialRender = false;
    noTransition = theme === 'dark' ? true : false;
  } else {
    noTransition = false;
  }

  const saveTheme = (value) => {
    localStorage.setItem(storageKey, value);
    document.firstElementChild.setAttribute('color-scheme', value);
  };

  const onThemeChange = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    saveTheme(currentTheme);
    setTheme(currentTheme);
  };

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSchemeChange = (e) => {
      if (e.matches) {
        saveTheme('dark');
        setTheme('dark');
      } else {
        saveTheme('light');
        setTheme('light');
      }
    };

    mediaQueryList.addEventListener('change', handleSchemeChange);

    return () =>
      mediaQueryList.removeEventListener('change', handleSchemeChange);
  }, []);

  return (
    <Tooltip
      text={`Changes theme to ${theme === 'light' ? 'dark' : 'light'}`}
      tip={'bottom'}
      id={'theme-tooltip'}
      hasWrapper={true}>
      <button
        className='theme-button has-tooltip-with-wrapper'
        id='theme-toggle'
        aria-pressed={`${theme === 'light' ? 'false' : 'true'}`}
        aria-describedby='theme-tooltip'
        onClick={onThemeChange}>
        <svg
          className='theme'
          aria-hidden='true'
          width='24'
          height='24'
          viewBox='0 0 24 24'>
          <mask className='theme__mask' id='moon-mask'>
            <rect x='0' y='0' width='100%' height='100%' fill='white' />
            <circle
              cx='24'
              cy='10'
              r='6'
              fill='black'
              className={`theme__moon ${noTransition ? 'no-transition' : null}`}
            />
          </mask>
          <circle
            className={`theme__circle ${noTransition ? 'no-transition' : null}`}
            cx='12'
            cy='12'
            r='6'
            mask='url(#moon-mask)'
            fill='currentColor'
          />
          <g
            className={`theme__lines ${noTransition ? 'no-transition' : null}`}
            stroke='currentColor'>
            <line x1='12' y1='1' x2='12' y2='3' />
            <line x1='12' y1='21' x2='12' y2='23' />
            <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
            <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
            <line x1='1' y1='12' x2='3' y2='12' />
            <line x1='21' y1='12' x2='23' y2='12' />
            <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
            <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
          </g>
        </svg>
        <span className='visually-hidden'>dark theme</span>
      </button>
    </Tooltip>
  );
};

export default ThemeButton;
