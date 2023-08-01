import { useDispatch } from 'react-redux';
import { deleteToast } from './toastsSlice';
import '../../styles/Toast.scss';

const Toast = ({ toast }) => {
  const dispatch = useDispatch();

  const handleAnimationEnd = (e) => {
    if (e.animationName === 'fade-out') {
      dispatch(deleteToast(toast.id));
    }
  };

  return (
    <>
      <output
        onAnimationEnd={handleAnimationEnd}
        className='toast__item'
        aria-live='polite'>
        {toast.text}
      </output>
    </>
  );
};

export default Toast;
