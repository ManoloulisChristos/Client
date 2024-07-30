import { useSelector } from 'react-redux';
import { selectUserIdToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react';

const useAuth = () => {
  const token = useSelector(selectUserIdToken);

  return useMemo(() => {
    if (token) {
      const { sub: id, email, username, isVerified } = jwtDecode(token);

      return { id, username, email, isVerified };
    }

    return null;
  }, [token]);
};

export default useAuth;
