import { useSelector } from 'react-redux';
import { selectAllToasts } from './toastsSlice';
import Toast from './Toast';
import '../../styles/Toast.scss';

const ToastsWithoutMotion = () => {
  const toasts = useSelector((state) => selectAllToasts(state));
  let content;
  console.log('No motion');
  if (!toasts) {
    content = null;
  } else {
    content = toasts.map((item) => <Toast key={item.id} toast={item} />);
  }

  return <section className='toast__container'>{content}</section>;
};

export default ToastsWithoutMotion;
