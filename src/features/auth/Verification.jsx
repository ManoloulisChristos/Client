import { useSearchParams } from 'react-router-dom';
import {
  useGetVerificationQuery,
  useSendVerificationEmailMutation,
} from './authApiSlice';
import '../../styles/Verification.scss';

// Verification logic when the user clicks the link from the email sent to him.
const Verification = () => {
  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const token = searchParams.get('token');

  const { data, isError, error } = useGetVerificationQuery({
    user,
    token,
  });

  const [sendEmail] = useSendVerificationEmailMutation();

  const handleResendEmail = async () => {
    await sendEmail({ id: user });
  };

  let heading;
  let paragraph;

  if (isError) {
    heading = 'Verification Error';
    paragraph = error.data.message;
  } else if (data) {
    heading = 'Verification Successful';
    paragraph = data.message;
  }

  return (
    <>
      <div className='verification'>
        <h1 className='verification__heading'>{heading}</h1>
        <p className='verification__paragraph'>{paragraph}</p>
        {/* 409 === user is already verified */}
        {isError &&
        error.status !== 409 &&
        !error.data.message.startsWith('Credentials are wrong') ? (
          <button
            className='verification__button'
            type='button'
            onClick={handleResendEmail}>
            Resend Email
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Verification;
