import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import '../../styles/AdvancedSearch.scss';
import FilterSection from './FilterSection';
import AdvMoviesList from './AdvMoviesList';
import Icons from '../../components/Icons';

const AdvancedSearch = () => {
  const [hideFilters, setHideFilters] = useState(false);
  const [filterBuckets, setFilterBuckets] = useState(null);
  const [inertDialog, setInertDialog] = useState(true);

  const dialogRef = useRef(null);

  const handleOpenDialog = () => {
    dialogRef.current.showModal();
    setInertDialog(false);
  };

  const handleOnDialogClose = () => {
    setInertDialog(true);
  };

  useLayoutEffect(() => {
    const mediaMatch = window.matchMedia('(max-width: 76em)').matches; // 1152px
    if (mediaMatch) {
      setHideFilters(true);
    } else {
      setHideFilters(false);
    }
  }, [setHideFilters]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 76em)'); // 1152px

    const mediaMatch = (e) => {
      if (e.matches) {
        setHideFilters(true);
      } else {
        setHideFilters(false);
      }
    };

    mql.addEventListener('change', mediaMatch);

    return () => mql.removeEventListener('change', mediaMatch);
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
              className='adv-search__filter-button'
              aria-controls='adv-search-dialog'
              aria-haspopup='dialog'
              aria-expanded='false'
              onClick={handleOpenDialog}>
              <Icons
                name='filter'
                width='20'
                height='20'
                svgClassName='adv-search__filter-icon'
              />
              Open filter options
            </button>
            <dialog
              ref={dialogRef}
              id='adv-search-dialog'
              className='adv-search__dialog'
              inert={inertDialog}
              onClose={handleOnDialogClose}>
              <FilterSection
                dialogRef={dialogRef}
                hideFilters={hideFilters}
                filterBuckets={filterBuckets}
              />
            </dialog>
          </>
        ) : (
          <FilterSection
            dialogRef={dialogRef}
            hideFilters={hideFilters}
            filterBuckets={filterBuckets}
          />
        )}

        <AdvMoviesList setFilterBuckets={setFilterBuckets} />
      </div>
      <div className='adv-search__test'></div>
    </div>
  );
};

export default AdvancedSearch;
