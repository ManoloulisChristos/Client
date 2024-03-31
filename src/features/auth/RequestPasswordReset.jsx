const RequestPasswordReset = () => {
  return (
    <div className='password-reset'>
      <h1 className='password-reset__heading'>Reset your password</h1>
      <p></p>
      <form className='password-reset__form'>
        <label
          className='password-reset__form'
          htmlFor='password-reset-email-input'>
          Email
        </label>
        <input
          id='password-reset-email-input'
          className='password-reset__input'
          type='email'
        />
      </form>
    </div>
  );
};

export default RequestPasswordReset;
