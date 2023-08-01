import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';

import './styles/App.scss';
import { useLayoutEffect } from 'react';

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

function App() {
  useLayoutEffect(() => {
    document.firstElementChild.setAttribute(
      'color-scheme',
      getThemePreference()
    );
  }, []);

  return (
    <div className='App'>
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
      <Navbar />
      <main id='main-content' className='main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
