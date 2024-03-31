import { useEffect, useRef } from 'react';
import { useRefreshMutation } from './authApiSlice';
import { Outlet } from 'react-router-dom';
import usePersist from '../../hooks/usePersist';
import useAuth from '../../hooks/useAuth';

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useAuth();
  const effectRun = useRef(false);
  const [refresh, { isError, isLoading, isSuccess, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRun.current || import.meta.env.PROD) {
      const verifyRefreshToken = async () => {
        if (persist && !token) {
          await refresh();
        }
      };
      verifyRefreshToken();
    }

    return () => (effectRun.current = true);
  }, [persist, refresh, token]);

  let content;
  if (persist) {
    if (token) {
      content = <Outlet />;
    } else if (isLoading) {
      content = <h1>Loading...</h1>;
    } else if (isError) {
      content = <h1>{error.data.message}</h1>;
    } else if (isSuccess) {
      content = <Outlet />;
    }
  } else {
    content = <Outlet />;
  }
  return content;
};

export default PersistLogin;
