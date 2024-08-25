import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import '../../styles/AdvancedSearch.scss';
import FilterSection from './FilterSection';
import AdvMoviesList from './AdvMoviesList';

const AdvancedSearch = () => {
  const [hideFilters, setHideFilters] = useState(false);

  const dialogRef = useRef(null);

  const handleOpenDialog = () => {
    dialogRef.current.showModal();
    dialogRef.current.removeAttribute('inert');
  };

  const handleOnDialogClose = (e) => {
    const dialog = e.target;
    dialog.setAttribute('inert', '');
  };

  useLayoutEffect(() => {
    if (window.innerWidth <= 1152) {
      setHideFilters(true);
    } else {
      setHideFilters(false);
    }
  }, [setHideFilters]);

  useEffect(() => {
    const watchViewportWidth = () => {
      if (window.innerWidth <= 1152) {
        setHideFilters(true);
      } else {
        setHideFilters(false);
      }
    };
    window.addEventListener('resize', watchViewportWidth);

    return () => {
      window.removeEventListener('resize', watchViewportWidth);
    };
  }, []);

  return (
    <div className='adv-search'>
      <hgroup className='adv-search__heading-group'>
        <h1 className='adv-search__heading'>Advanced Search</h1>
        <p className='adv-search__explainer'>
          Discover our robust title search. Mix and match info to refine your
          searches. All fields below are optional, but at least one is needed
          for a search. You can also press{' '}
          <code className='adv-search__code'>Enter</code> if you are focusing on
          a field.
        </p>
      </hgroup>
      <div className='adv-search__section-container'>
        {hideFilters ? (
          <>
            <button
              onClick={handleOpenDialog}
              aria-controls='adv-search-dialog'
              aria-haspopup='dialog'
              aria-expanded='false'>
              Open filter options
            </button>
            <dialog
              ref={dialogRef}
              id='adv-search-dialog'
              className='adv-search__dialog'
              inert=''
              onClose={handleOnDialogClose}>
              <FilterSection dialogRef={dialogRef} hideFilters={hideFilters} />
            </dialog>
          </>
        ) : (
          <FilterSection dialogRef={dialogRef} hideFilters={hideFilters} />
        )}

        <AdvMoviesList />
      </div>
      <div className='adv-search__test'></div>
    </div>
  );
};

export default AdvancedSearch;
