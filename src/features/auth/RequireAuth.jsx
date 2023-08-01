import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = () => {
  const location = useLocation();
  const { id, name } = useAuth();
  const content =
    id !== null && name.length ? (
      <Outlet />
    ) : (
      <Navigate to='/auth/login' state={{ from: location }} replace />
    );

  return content;
};

export default RequireAuth;
