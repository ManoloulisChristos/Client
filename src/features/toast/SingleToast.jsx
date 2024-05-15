import { useDispatch } from 'react-redux';
import { deleteToast } from './toastsSlice';
import '../../styles/Toast.scss';

const Toast = ({ toast }) => {
  const dispatch = useDispatch();

  const handleAnimationEnd = (e) => {
    if (e.animationName === 'toast-fade-out') {
      dispatch(deleteToast(toast.id));
    }
  };

  return (
    <>
      <p
        className='toast__item'
        data-mode={toast.mode}
        onAnimationEnd={handleAnimationEnd}>
        {toast.text}
      </p>
    </>
  );
};

export default Toast;
