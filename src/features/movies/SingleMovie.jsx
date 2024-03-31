import { useParams } from 'react-router-dom';
import { useGetMovieWithIdQuery } from './moviesApiSlice';
import '../../styles/SingleMovie.scss';

const SingleMovie = () => {
  const { id } = useParams();

  const { data } = useGetMovieWithIdQuery(id);
  console.log(data?.poster);

  return (
    <article className='single'>
      <h1 className='single__title'>{data?.title}</h1>
      <img src={data?.poster} alt=''></img>
      <div id='uno' className='single__test'>
        a
      </div>
      <div className='single__test2'>a</div>
    </article>
  );
};

export default SingleMovie;
