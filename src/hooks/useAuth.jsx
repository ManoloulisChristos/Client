import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const { user } = jwtDecode(token);

    return { id: user.id, name: user.name };
  }

  return { id: null, name: '' };
};

export default useAuth;
