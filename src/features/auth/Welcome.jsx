import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useSendVerificationEmailMutation } from './authApiSlice';
import VerificationBoilerplate from './VerificationBoilerplate';

const Welcome = () => {
  const { id, isVerified } = useAuth() ?? { id: null, isVerified: null };
  const [sendEmail, { error }] = useSendVerificationEmailMutation();

  const handleResendEmail = async () => {
    await sendEmail({ id });
  };

  return (
    <>
      {id && !isVerified ? (
        <VerificationBoilerplate
          title={'Welcome'}
          onClick={handleResendEmail}
          error={error}
        />
      ) : (
        <Navigate to='/' replace={true} />
      )}
    </>
  );
};

export default Welcome;
