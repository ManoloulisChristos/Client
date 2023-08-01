import { useGetMoviesWithTitleQuery } from './moviesApiSlice';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import '../../styles/MoviesList.scss';

// The data are coming as an array with 2 objects
// 1. The documents that are requested nested inside as an Array
// 2. The total count of the documents nested inside an Object
// No need of memoization for the destructuring because the documents are coming in batches of 20 handled by the DB

const MoviesList = () => {
  const params = useParams();
  const { title } = params;
  const { data: moviesArr } = useGetMoviesWithTitleQuery(title);
  const movies = moviesArr?.[0].movies;
  const totalResults = moviesArr?.[0].countResults?.count.lowerBound ?? '0';

  return (
    <div className='movies__wrapper'>
      <hgroup>
        <h1 className='movies__header' id='movies-search-title'>
          Search for: <span className='movies__result'>{`"${title}"`}</span>
        </h1>
        <p className='movies__count'>{totalResults} total results</p>
      </hgroup>
      <section
        className='movies__section'
        aria-labelledby='movies-search-title'>
        {movies?.map((movie) => (
          <Card movie={movie} key={movie?._id} />
        ))}
      </section>
    </div>
  );
};

export default MoviesList;
