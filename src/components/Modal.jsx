import { forwardRef, useState } from 'react';
import { useLoginMutation } from '../features/user/userSlice';

import '../styles/Modal.scss';

const Modal = forwardRef(function Modal(props, ref) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useLoginMutation({ fixedCacheKey: 'user' });

  const lightDismiss = ({ target }) => {
    if (target.nodeName === 'DIALOG') {
      target.close('dismiss');
      target.setAttribute('inert', '');
    }
  };

  const closeDialog = (e) => {
    e.stopPropagation();
    ref.current.close('cancel');
    ref.current.setAttribute('inert', '');
  };

  const onDialogClose = async ({ target: dialog }) => {
    const form = dialog.firstChild;
    if (dialog.returnValue === 'confirm') {
      const dialogFormData = new FormData(form);
      try {
        const result = await login(
          Object.fromEntries(dialogFormData.entries())
        ).unwrap();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  };
  // Handle inert and showing modal
  // <NavLink
  //   className='navigation__link'
  //   onClick={() => {
  //     setNavToggle('false');
  //     dialogRef.current.showModal();
  //     dialogRef.current.removeAttribute('inert');
  //   }}>
  //   <svg className='navigation__icon'>
  //     <use href={sprite + '#icon-user'} />
  //   </svg>
  //   <span className='navigation__text'>Sign In</span>
  // </NavLink>;

  return (
    <dialog
      ref={ref}
      inert='true'
      onClick={lightDismiss}
      onClose={onDialogClose}
      className='dialog'>
      <form method='dialog__form'>
        <header className='dialog__header'>
          <h3 className='dialog__title'>Dialog title</h3>
          <button
            className='dialog__button-close'
            type='button'
            title='Close pop-up window'
            onClick={closeDialog}>
            <svg className='dialog__icon-close'></svg>
          </button>
        </header>
        <section className='dialog__section'>
          <label className='dialog__label'>
            Email
            <input
              className='dialog__input'
              type='email'
              aria-label='Email'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label className='dialog__label'>
            Password
            <input
              className='dialog__input'
              type='password'
              aria-label='Password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
        </section>
        <footer className='dialog__footer'>
          <menu className='dialog__menu'>
            <button
              className='dialog__button dialog__button--cancel'
              autoFocus
              type='button'
              title='Close pop-up window'
              onClick={closeDialog}>
              Cancel
            </button>
            <button
              className='dialog__button dialog__button--confirm'
              type='submit'
              formMethod='dialog'
              value='confirm'>
              Confirm
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
});

export default Modal;
