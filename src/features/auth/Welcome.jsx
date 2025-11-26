import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router';
import { useSendVerificationEmailMutation } from './authApiSlice';
import VerificationBoilerplate from './VerificationBoilerplate';
import { useDispatch } from 'react-redux';
import { createToast } from '../toast/toastsSlice';
import HelmetWrapper from '../../components/HelmetWrapper';

const Welcome = () => {
  const dispatch = useDispatch();
  const { id, isVerified } = useAuth() ?? { id: null, isVerified: null };
  const [sendEmail, { error }] = useSendVerificationEmailMutation();

  const handleResendEmail = async () => {
    try {
      await sendEmail({ id }).unwrap();
      dispatch(createToast('success', 'Email sent successfully'));
    } catch (error) {
      dispatch(createToast('error', 'Failed to sent email'));
    }
  };

  return (
    <>
      <HelmetWrapper title='Welcome' noIndex={true} />
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
