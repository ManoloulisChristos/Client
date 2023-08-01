import { Outlet, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  // Gives extra time for RTK-Query to get the request settled
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.PROD) {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    console.log(error);
    content = (
      <p className='errmsg'>
        {`${error?.data?.msg} - `}
        <Link to='/auth/login'>Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
