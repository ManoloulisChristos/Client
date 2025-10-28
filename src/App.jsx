import { Link, Outlet, ScrollRestoration } from 'react-router';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';

import './styles/App.scss';
import { useEffect, useLayoutEffect, useRef } from 'react';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const topLevelSentinelRef = useRef(null);
  const firstRenderRef = useRef(false); // development strict mode check

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

    // Check the users preference on font-size
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

  // Font loading API (loading full font files)
  useEffect(() => {
    // Declare font faces
    const inter300 = new FontFace(
      'Inter',
      'url(/fonts/original/inter-v18-latin-300.woff2',
      { weight: '300', style: 'normal', display: 'swap' }
    );
    const inter400 = new FontFace(
      'Inter',
      'url(/fonts/original/inter-v18-latin-regular.woff2',
      { weight: '400', style: 'normal', display: 'swap' }
    );
    const inter500 = new FontFace(
      'Inter',
      'url(/fonts/original/inter-v18-latin-500.woff2',
      { weight: '500', style: 'normal', display: 'swap' }
    );
    const inter600 = new FontFace(
      'Inter',
      'url(/fonts/original/inter-v18-latin-600.woff2',
      { weight: '600', style: 'normal', display: 'swap' }
    );
    //inter-tight
    const inter700 = new FontFace(
      'Inter',
      'url(/fonts/original/inter-tight-v7-latin-700.woff2',
      { weight: '700', style: 'normal', display: 'swap' }
    );

    // Check if i run in dev and disable the flag
    if (!import.meta.env.DEV) {
      firstRenderRef.current = true;
    }

    if (firstRenderRef.current) {
      let refetchCount = 0;
      const refetchLimit = 3;

      // Loading the full font file for 700 is changing the dimensions of the letters, i guess some glyph calculations are missing
      // from the subset so i will reffer from loading the full font.
      const loadFonts = () => {
        // Load the fonts
        Promise.all([
          inter300.load(),
          inter400.load(),
          inter500.load(),
          inter600.load(),
          // inter700.load(),
        ])
          .then((fonts) => {
            // Add the fonts
            fonts.forEach((font) => document.fonts.add(font));
          })
          .catch((err) => {
            // Retry 4 times max
            if (refetchCount <= refetchLimit) {
              console.error(err);
              refetchCount++;
              loadFonts();
            }
          });
      };

      loadFonts();
    }

    // Tests if fonts have been loaded for dev mode
    // document.fonts.ready.then((fontFaceSet) => {
    //   const fontFaces = [...fontFaceSet];
    //   console.log(fontFaces);
    //   console.log(fontFaces.map((f) => f.status));
    // });
    return () => (firstRenderRef.current = true);
  }, []);

  return (
    <div className='App'>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </div>
  );
}

export default App;
