import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetTopMoviesQuery } from './topMoviesApiSlice';
import TopMoviesList from './TopMoviesList';
import '../../styles/TopMovies.scss';
import { updateView } from '../movies/moviesToolbarSlice';
import Icons from '../../components/Icons';
import Tooltip from '../../components/Tooltip';
import HelmetWrapper from '../../components/HelmetWrapper';

const allGenresStatic = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Film-Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'News',
  'Romance',
  'Sci-Fi',
  'Short',
  'Sport',
  'Talk-Show',
  'Thriller',
  'War',
  'Western',
];

const TopMovies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const genreQuery = searchParams.get('genre');

  let queryFinal = 'All';
  if (allGenresStatic.includes(genreQuery)) {
    queryFinal = genreQuery;
  }

  const [selectedGenre, setSelectedGenre] = useState(queryFinal);
  const [checkedRadio, setCheckedRadio] = useState('grid');

  const { currentData } = useGetTopMoviesQuery({ genre: queryFinal });

  const handleRadioChange = (e) => {
    setCheckedRadio(e.target.value);
    dispatch(updateView(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedOption = formData.get('genre');
    setSearchParams({ genre: selectedOption });
  };

  // Run once on page load and coerce the genre query to the default if it not included in the accepted values
  useEffect(() => {
    if (!allGenresStatic.includes(genreQuery)) {
      setSearchParams({ genre: 'All' });
    }
    // eslint-disable-next-line
  }, []);

  const populatedOption = allGenresStatic.map((genre) => (
    <option key={genre} className='top-movies__option' value={genre}>
      {genre}
    </option>
  ));

  return (
    <>
      <HelmetWrapper
        title='Top-100 Movies'
        description='Top 100 movies based on IMDb ratings'
        keywords='Top 100, Movies, filter by genre, best movies, top movies'
      />
      <article className='top-movies'>
        <header className='top-movies__heading-group'>
          <h1 id='top-movies-heading' className='top-movies__heading'>
            Top 100 movies
          </h1>
          <p className='top-movies__paragraph'>Based on IMDb ratings</p>
        </header>
        <div className='top-movies__controls-container'>
          <form className='top-movies__form' onSubmit={handleSubmit}>
            <div className='top-movies__select-wrapper'>
              <label
                className='top-movies__label top-movies__label--select'
                htmlFor='top-movies-select'>
                Search by genre:
              </label>
              <select
                id='top-movies-select'
                className='top-movies__select'
                name='genre'
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}>
                {populatedOption}
              </select>
            </div>
            <Tooltip
              text='Apply selection'
              id='top-movies-submit-tooltip'
              tip='bottom'
              hasWrapper={true}>
              <button
                type='submit'
                className='top-movies__submit has-tooltip-with-wrapper'>
                <Icons
                  name='check'
                  width='22'
                  height='22'
                  svgClassName='top-movies__icon top-movies__icon--check'
                />
              </button>
            </Tooltip>
          </form>
          {/* <button onClick={() => dispatch(updateView('grid'))}>1</button>
      <button onClick={() => dispatch(updateView('list'))}>2</button> */}
          <div className='top-movies__radio-container'>
            <div className='top-movies__radio-wrapper'>
              <input
                id='top-movies-radio-grid'
                className='top-movies__radio'
                type='radio'
                name='view'
                value='grid'
                checked={checkedRadio === 'grid'}
                onChange={handleRadioChange}
              />
              <label
                htmlFor='top-movies-radio-grid'
                className='top-movies__label top-movies__label--radio'>
                <Tooltip text='Grid view' tip='bottom' hasWrapper={true}>
                  <Icons
                    name='grid'
                    width='22'
                    height='22'
                    svgClassName='top-movies__icon top-movies__icon--grid has-tooltip-with-wrapper'
                  />
                </Tooltip>
                <span className='visually-hidden'>Grid view</span>
              </label>
            </div>
            <div className='top-movies__radio-wrapper'>
              <input
                id='top-movies-radio-list'
                type='radio'
                name='view'
                className='top-movies__radio'
                value='list'
                checked={checkedRadio === 'list'}
                onChange={handleRadioChange}
              />
              <label
                htmlFor='top-movies-radio-list'
                className='top-movies__label top-movies__label--radio has-tooltip-with-wrapper'>
                <Tooltip text='Compact view' tip='bottom' hasWrapper={true}>
                  <Icons
                    name='list'
                    width='22'
                    height='22'
                    svgClassName='top-movies__icon top-movies__icon--list has-tooltip-with-wrapper'
                  />
                </Tooltip>
                <span className='visually-hidden'>Compact view</span>
              </label>
            </div>
          </div>
        </div>

        <TopMoviesList movies={currentData} />
      </article>
    </>
  );
};

export default TopMovies;
