import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router';
import { selectAccessToken, selectTokenError } from './authSlice';
import Icons from '../../components/Icons';
import '../../styles/RequireAuth.scss';

const RequireAuth = () => {
  const token = useSelector(selectAccessToken);
  const error = useSelector(selectTokenError);
  let content;
  if (token && !error) {
    content = <Outlet />;
  } else if (error) {
    content = (
      <>
        <div className='require-auth'>
          <Icons name='lock' width='150' height='150' />
          <h1 className='require-auth__heading'>Error</h1>
          <p className='require-auth__paragraph'>{error}</p>
        </div>
      </>
    );
  } else if (!token && !error) {
    content = (
      <>
        <div className='require-auth'>
          <Icons name='lock' width='150' height='150' />
          <h1 className='require-auth__heading'>Unauthorized</h1>
          <p className='require-auth__paragraph'>
            You do not have access to the specific location. Please{' '}
            <Link to='/auth/login' className='require-auth__link'>
              sign in
            </Link>
            !
          </p>
        </div>
      </>
    );
  }
  return content;
};

export default RequireAuth;
