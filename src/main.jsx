import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './main.scss';
import App from './App';
import NotFound from './NotFound';
import MoviesList from './features/movies/MoviesList';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import RequireAuth from './features/auth/RequireAuth';
import GlobalTest from './components/GlobalTest';
import PersistLogin from './features/auth/PersistLogin';
import Verification from './features/auth/Verification';
import RequireVerification from './features/auth/RequireVerification';
import Welcome from './features/auth/Welcome';
import RequestPasswordReset from './features/auth/RequestPasswordReset';
import PasswordResetValidation from './features/auth/PasswordResetValidation';
import UserSettings from './features/user/UserSettings';
import UserRatings from './features/ratings/UserRatings';
import Watchlist from './features/watchlist/Watchlist';
import Movie from './features/singleMovie/Movie';
import UserComments from './features/comments/UserComments';
import AdvancedSearch from './features/advancedSearch/AdvancedSearch';
import TopMovies from './features/topMovies/TopMovies';
import Home from './components/Home';

if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => axe.default(React, ReactDOM, 1000));
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<NotFound />}>
      <Route index element={<Home />} />
      <Route path='/test' element={<GlobalTest />} />

      <Route path='/search/title/:title' element={<MoviesList />} />
      <Route path='/search/id/:id' element={<Movie />} />
      <Route path='/search/advanced' element={<AdvancedSearch />} />
      <Route path='/search/top100' element={<TopMovies />} />

      <Route path='/auth/login' element={<Login />} />
      <Route path='/auth/register' element={<Register />} />
      <Route path='/auth/verification' element={<Verification />} />
      <Route path='/auth/welcome' element={<Welcome />} />
      <Route path='/auth/password' element={<RequestPasswordReset />} />
      <Route
        path='/auth/password/validation'
        element={<PasswordResetValidation />}
      />

      {/* Protected Routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route element={<RequireVerification />}>
            <Route
              path='/verification'
              element={<Navigate to='/' replace={true} />}
            />

            <Route
              path='/user/:id/rating/populated'
              element={<UserRatings />}
            />
            <Route
              path='/user/:id/watchlist/populated'
              element={<Watchlist />}
            />
            <Route path='/comment/user/:id' element={<UserComments />} />
            <Route path='/user/:id/settings' element={<UserSettings />} />
          </Route>
        </Route>
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
