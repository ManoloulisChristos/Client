import { useSelector } from 'react-redux';
import '../../styles/ProgressBar.scss';

const ProgressBar = () => {
  const size = useSelector((state) => state.progressBar.size);
  const loaded = useSelector((state) => state.progressBar.loaded);
  const isLoading = useSelector((state) => state.progressBar.isLoading);

  const normalized = loaded / size;

  // When testing with NVDA SR the progress if the min-max values are set between 0-1 are not announced correctly so 0-100 is a must
  return (
    <>
      <div className='progress-bar'>
        <div
          className='progress-bar__progress'
          id='progress-bar'
          role='progressbar'
          aria-label='Loading:'
          aria-valuemin='0'
          aria-valuemax='100'
          aria-valuenow={normalized * 100}
          data-progressbar-hide={`${!isLoading}`}
          ref={(node) => {
            if (node)
              node.style.setProperty('--_load', isLoading ? normalized : 0);
          }}></div>
      </div>
    </>
  );
};

export default ProgressBar;
