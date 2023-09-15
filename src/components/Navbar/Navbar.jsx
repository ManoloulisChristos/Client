import { NavLink } from 'react-router-dom';
import AutocompleteForm from './AutocompleteForm';
import '../../styles/Navbar.scss';
import ThemeButton from './ThemeButton';

const Navbar = () => {
  return (
    <>
      <div className='header-container'>
        <header className='header'>
          <h2 className='header__logo'>LOGO</h2>
          <AutocompleteForm />
          <div className='header__divider'>
            <ThemeButton />
            <nav className='header__nav'>
              <ul className='header__list'>
                <li className='header__item'>
                  <NavLink className='header__link' to='test'>
                    Genres
                  </NavLink>
                </li>
                <li className='header__item'>
                  <NavLink className='header__link'>Trending</NavLink>
                </li>
                <li className='header__item'>
                  <NavLink className='header__link'>Top-100</NavLink>
                </li>
                <li className='header__item'>
                  <NavLink className='header__link'>Search+</NavLink>
                </li>
                <li className='header__item'>
                  <NavLink className='header__link'>Login</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
