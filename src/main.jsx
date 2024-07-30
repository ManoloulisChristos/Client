import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './main.scss';
import App from './App';
import ErrorPage from './error-page';
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

if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => axe.default(React, ReactDOM, 1000));
}

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: '/test',
//         element: <GlobalTest />,
//       },
//       {
//         path: '/search/title/:title',
//         element: <MoviesList />,
//       },
//       {
//         path: '/search/id/:id',
//         element: <SingleMovie />,
//       },
//       {
//         path: '/auth/login',
//         element: <Login />,
//       },
//       {
//         path: '/auth/register',
//         element: <Register />,
//       },
//       {
//         element: <RequireAuth />,
//         children: [
//           {
//             path: '/user/:id/edit',
//             element: <EditUser />,
//           },
//         ],
//       },
//     ],
//   },
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<ErrorPage />}>
      <Route path='/test' element={<GlobalTest />} />

      <Route path='/search/title/:title' element={<MoviesList />} />
      <Route path='/search/id/:id' element={<Movie />} />

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
