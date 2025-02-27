import { Outlet } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { useSendVerificationEmailMutation } from './authApiSlice';
import VerificationBoilerplate from './VerificationBoilerplate';
import { useDispatch } from 'react-redux';
import { createToast } from '../toast/toastsSlice';

const RequireVerification = () => {
  const dispatch = useDispatch();
  const { id, isVerified } = useAuth();

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
      {!isVerified ? (
        <VerificationBoilerplate
          title={'Verification Required'}
          onClick={handleResendEmail}
          error={error}
        />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default RequireVerification;
