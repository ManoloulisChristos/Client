import { useEffect, useState } from 'react';

const initSession = () => {
  if (
    sessionStorage.getItem('session') &&
    sessionStorage.getItem('session') === 'true'
  ) {
    return true;
  }
  return false;
};

// Tracks users that have not chekced the persist option in order to relog them
// when they hit the refresh button and not be kicked out.
const useSession = () => {
  const [session, setSession] = useState(initSession);

  useEffect(() => {
    sessionStorage.setItem('session', String(session));
  }, [session]);
  return [session, setSession];
};

export default useSession;
