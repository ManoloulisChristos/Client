import { useState, useEffect } from 'react';

const initPersist = () => {
  if (
    localStorage.getItem('persist') &&
    localStorage.getItem('persist') === 'true'
  ) {
    return true;
  }
  return false;
};
const usePersist = () => {
  const [persist, setPersist] = useState(initPersist);

  useEffect(() => {
    localStorage.setItem('persist', String(persist));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;
