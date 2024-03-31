import { useSelector } from 'react-redux';
import { selectUserIdToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const token = useSelector(selectUserIdToken);

  if (token) {
    const { sub: id, email, username, isVerified } = jwtDecode(token);

    return { id, username, email, isVerified };
  }

  return null;
};

export default useAuth;
