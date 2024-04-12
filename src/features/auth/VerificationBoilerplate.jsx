import '../../styles/VerificationBoilerplate.scss';

const VerificationBoilerplate = ({ title, onClick, error }) => {
  return (
    <div className='verification-boilerplate'>
      <h1 className='verification-boilerplate__heading'>{title}</h1>
      <p className='verification-boilerplate__paragraph'>
        To aquire full access to your account, you must first verify your
        account via the email we have sent you.
      </p>
      <p className='verification-boilerplate__paragraph'>
        Click the button bellow to receive a new verification email and please
        check your spam folder.
      </p>
      <button
        className='verification-boilerplate__button'
        aria-describedby='verification-boilerplate-error-message'
        onClick={onClick}>
        Resend email
      </button>
      <p className='verification-boilerplate__error' aria-live='assertive'>
        {error?.data.message}
      </p>
    </div>
  );
};

export default VerificationBoilerplate;
