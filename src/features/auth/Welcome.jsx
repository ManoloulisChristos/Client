import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useSendVerificationEmailMutation } from './authApiSlice';
import VerificationBoilerplate from './VerificationBoilerplate';

const Welcome = () => {
  const { id, isVerified } = useAuth() ?? { id: null, isVerified: null };
  const [sendEmail] = useSendVerificationEmailMutation();

  const handleResendEmail = async () => {
    await sendEmail({ id });
  };

  return (
    <>
      {id && !isVerified ? (
        <VerificationBoilerplate
          title={'Welcome'}
          onClick={handleResendEmail}
        />
      ) : (
        <Navigate to='/nothing-to-see-here' replace={true} />
      )}
    </>
  );
};

export default Welcome;
