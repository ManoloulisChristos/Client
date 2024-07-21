import { useEffect, useRef, useState } from 'react';
import './GlobalTest.scss';
import useSession from '../hooks/useSession';
import { useDispatch } from 'react-redux';
import { createToast } from '../features/toast/toastsSlice';
import usePersist from '../hooks/usePersist';
import Carousel from './Carousel';
import { Link } from 'react-router-dom';

const GlobalTest = () => {
  const [visible, setVisible] = useState(0);
  const testRef = useRef(null);

  // const boxRef = useRef(null);
  // const contRef = useRef(null);

  // useEffect(() => {
  //   const options = {
  //     root: contRef.current,
  //     threshold: [0.6],
  //   };

  //   const callback = (entry) => {
  //     console.log(entry);
  //     console.log('intersecting', entry[0].isIntersecting);
  //     console.log('intersectionRation', entry[0].intersectionRatio);
  //     entry[0].target.classList.toggle('in-view', entry[0].isIntersecting);
  //     // if (entry[0].isIntersecting) {
  //     //   entry[0].target.classList.toggle('in-view', entry[0].isIntersecting);
  //     // } else {
  //     //   entry[0].target.classList.toggle('in-view', entry[0].isIntersecting);
  //     // }
  //   };
  //   const io = new IntersectionObserver(callback, options);
  //   io.observe(boxRef.current);
  // }, []);

  // const scrollTo = () => {
  //   const delta = Math.abs(
  //     boxRef.current.offsetLeft - contRef.current.offsetLeft
  //   );

  //   const pos =
  //     delta - contRef.current.clientWidth / 2 + boxRef.current.clientWidth / 2;
  //   contRef.current.scrollTo(pos, 0);
  // };

  return (
    <div className='test'>
      <dl>
        <dt>BeastofBodmin</dt>
        <dd>A large feline inhabiting Bodmin Moor.</dd>

        <dt>Morgawr</dt>
        <dd>A sea serpent.</dd>

        <dt>Owlman</dt>
        <dd>A giant owl-like creature.</dd>
      </dl>
    </div>
  );
};

export default GlobalTest;
