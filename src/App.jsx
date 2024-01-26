import { Outlet, ScrollRestoration } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';

import './styles/App.scss';
import { useLayoutEffect, useRef } from 'react';

function App() {
  const topLevelSentinelRef = useRef(null);
  // Set theme on app load based on preference or saved value
  const getThemePreference = () => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme-preference'))
        return localStorage.getItem('theme-preference');
      else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }
  };

  const getUserFontSize = () => {
    if (typeof window !== 'undefined') {
      const root = document.firstElementChild;
      const fontSize = getComputedStyle(root).fontSize.slice(0, -2);
      root.style.setProperty('--default-font-size', fontSize);
    }
  };

  useLayoutEffect(() => {
    document.firstElementChild.setAttribute(
      'color-scheme',
      getThemePreference()
    );
    getUserFontSize();
  }, []);

  return (
    <div className='App'>
      <ScrollRestoration />
      <nav aria-label='Skip to content'>
        <ul className='off-screen'>
          <li>
            <a href='#main-content' className='skip-link'>
              Skip to main content
            </a>
          </li>
          <li>
            <a href='#focus-me' className='skip-link'>
              Skip to search
            </a>
          </li>
        </ul>
      </nav>
      <div className='top-level-sentinel' ref={topLevelSentinelRef}></div>
      <Navbar topLevelSentinelRef={topLevelSentinelRef} />
      <main id='main-content' className='main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
