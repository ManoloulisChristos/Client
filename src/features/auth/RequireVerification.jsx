import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useSendVerificationEmailMutation } from './authApiSlice';
import VerificationBoilerplate from './VerificationBoilerplate';

const RequireVerification = () => {
  const { id, isVerified } = useAuth();

  const [sendEmail] = useSendVerificationEmailMutation();

  const handleResendEmail = async () => {
    await sendEmail({ id });
  };

  return (
    <>
      {!isVerified ? (
        <VerificationBoilerplate
          title={'Verification Required'}
          onClick={handleResendEmail}
        />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default RequireVerification;
