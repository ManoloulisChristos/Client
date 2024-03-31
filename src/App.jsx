import { Link, Outlet, ScrollRestoration } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';

import './styles/App.scss';
import { useLayoutEffect, useRef } from 'react';

function App() {
  const topLevelSentinelRef = useRef(null);

  useLayoutEffect(() => {
    // Set theme on app load based on preference or saved value
    const getThemePreference = () => {
      if (localStorage.getItem('theme-preference'))
        return localStorage.getItem('theme-preference');
      else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    };

    const getUserFontSize = () => {
      const root = document.firstElementChild;
      const fontSize = parseInt(getComputedStyle(root).fontSize);
      root.style.setProperty('--default-font-size', fontSize);
    };

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
        <Link to='/user/65d7050f1d520cbb6a0376c2/edit'>USER</Link>

        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
