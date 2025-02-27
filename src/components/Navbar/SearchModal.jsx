import '../../styles/SearchModal.scss';

import Tooltip from '../Tooltip';
import Icons from '../Icons';

const SearchModal = ({
  children,
  ref,
  showSearchModal,
  inertSearchModal,
  setInertSearchModal,
}) => {
  return (
    <>
      {showSearchModal ? (
        <dialog
          className='search-modal'
          ref={ref}
          inert={inertSearchModal}
          onClose={() => setInertSearchModal(true)}>
          {children}
          <Tooltip
            text='Close search'
            tip='left'
            id='search-modal-minimize-tooltip'
            hasWrapper={true}>
            <button
              type='button'
              className='search-modal__minimize has-tooltip-with-wrapper'
              aria-labelledby='search-modal-minimize-tooltip'
              aria-controls='search-modal'
              aria-expanded='true'
              aria-haspopup='dialog'
              onClick={() => {
                ref.current.close();
              }}>
              <Icons
                name='minimize'
                svgClassName='search-modal__minimize-icon'
              />
            </button>
          </Tooltip>
        </dialog>
      ) : (
        children
      )}
    </>
  );
};

export default SearchModal;
