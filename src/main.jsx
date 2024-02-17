import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './main.scss';
import App from './App';
import ErrorPage from './error-page';
import MoviesList from './features/Movies/MoviesList';
import SingleMovie from './features/Movies/SingleMovie';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import EditUser from './features/user/EditUser';
import GlobalTest from './components/GlobalTest';

if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => axe.default(React, ReactDOM, 1000));
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/test',
        element: <GlobalTest />,
      },
      {
        path: '/search/title/:title',
        element: <MoviesList />,
      },
      {
        path: '/search/id/:id',
        element: <SingleMovie />,
      },
      {
        path: '/auth/login',
        element: <Login />,
      },
      {
        path: '/auth/register',
        element: <Register />,
      },
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              {
                path: '/user/:id/edit',
                element: <EditUser />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
