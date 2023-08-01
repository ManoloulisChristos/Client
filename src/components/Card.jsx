import { useEffect, useState } from 'react';
import Icons from './Icons';
import '../styles/Card.scss';
import { Link } from 'react-router-dom';

const Card = ({ movie }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const a = count;
  });

  return (
    <article className='card__wrapper'>
      <Link>
        <img
          className='card__image'
          height='309'
          width='220'
          src={movie?.poster ?? '/no_image.png'}
          alt={`${movie.title} poster`}
          onError={(e) => {
            e.target.src = '/no_image.png';
          }}
        />
      </Link>

      <h2 className='card__title'>
        <Link className='card__link'>{movie?.title ?? 'Title not found'}</Link>
      </h2>
      <div className='card__controls'>
        <div className='card__rating'>
          <Icons name={'star'} svgClassName={'card__star'} />

          <span className='card__number'>{movie?.imdb.rating ?? '??'}</span>
        </div>

        <button className='card__button card__button--watchlist'>
          <Icons name={'plus'} />
          Watchlist
        </button>
        <button className='card__button card__button--info'>
          <Icons name={'info'} />
        </button>
      </div>
    </article>
  );
};

export default Card;
