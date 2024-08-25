import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../../styles/Feed.scss';
import { useGetCommentsQuery } from './commentsApiSlice';
import useAuth from '../../hooks/useAuth';
import TextArea from './TextArea';
import { useRefreshMutation } from '../auth/authApiSlice';

const Feed = ({ movieId }) => {
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [trackId, setTrackId] = useState({ current: movieId, previous: null });
  const [skip, setSkip] = useState(true);
  const [resetCache, setResetCache] = useState(false);

  const articlesRef = useRef(null);
  const observedNodeRef = useRef(null);
  const waitForAuthRef = useRef(false);

  const getMap = () => {
    if (!articlesRef.current) {
      articlesRef.current = new Map();
    }
    return articlesRef.current;
  };

  const [refresh, { isUninitialized, isSuccess, isError }] = useRefreshMutation(
    {
      fixedCacheKey: 'RefreshOnAppStart',
    }
  );

  // Sync all setters together
  if (trackId.current !== movieId) {
    setPage(1);
    setTrackId((n) => ({ ...n, current: movieId, previous: n.current }));
    setSkip(true);
  }

  // Both the movieId and skip are comming though state to be in sync with each other,
  // so i avoid to get any fetching if the movieId comes through props and skip lacks behind!
  const {
    data: comments,
    isFetching,
    refetch,
  } = useGetCommentsQuery(
    { movieId: trackId.current, page, userId: auth?.id, resetCache },
    { skip }
  );
  const docsCount = comments?.count;
  const docs = comments?.docs;

  const normalizeDate = (date) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

    const intl = new Intl.DateTimeFormat('en-GB', options);

    // get milliseconds from date > returns NaN if date is invalid.
    if (isNaN(new Date(date).getTime())) {
      return null;
    } else {
      return intl.format(new Date(date));
    }
  };

  ///// Disabled because NVDA has its own keybindings for pageUp and pageDown /////

  // const handleFeedKeydown = (e) => {
  //   switch (e.key) {
  // case 'PageDown':
  //   e.preventDefault();
  //   if (e.target.nextElementSibling) {
  //     e.target.nextElementSibling.focus();
  //   }
  //   break;
  // case 'PageUp':
  //   e.preventDefault();
  //   if (e.target.previousElementSibling) {
  //     e.target.previousElementSibling.focus();
  //   }
  //   break;
  //     default:
  //       break;
  //   }
  // };

  // Moves scroll to top instatly (important!!) when the user clicks the back/forward buttons
  // and prevents the browser from scroll restoration.
  // Default example: when the user has navigated at the bottom of the page, navigates to another page
  // and then clicks the back button it smoothly scrolls to the previous location, this makes requests
  // from the interection observer and complicates and bugs out the page.
  useLayoutEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      setSkip(false);
    }
    return () => {
      if (history.scrollRestoration) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [movieId]);

  // If the whole app starts from this page then i have to wait and see if there is a user or not,
  // so i can provide a userId and get the users comment in order to have the textarea populated with it!
  useEffect(() => {
    // True only in app init
    if (isUninitialized) {
      waitForAuthRef.current = true;
    }

    // refetch and reset the cache with the users comment if any
    if (waitForAuthRef.current === true) {
      if (isError || isSuccess) {
        refetch();
        setResetCache(true);
        setPage(1);
        waitForAuthRef.current = true;
      }
    }
  }, [isUninitialized, isError, isSuccess, refetch]);

  // Interesection observer
  // and reset the resetCache state value if the comments or the resetCache state changes
  useEffect(() => {
    const docsCount = comments?.count;
    const docs = comments?.docs;

    const options = {
      root: null,
      threshold: 0,
    };
    const ioCallback = (entries) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          setPage((n) => n + 1);
        }
      }
    };
    const io = new IntersectionObserver(ioCallback, options);
    if (docs?.length && docs?.length !== docsCount) {
      io.observe(observedNodeRef.current);
    }

    // When a mutation happens reset the cache data by setting the page = 1
    // Combine with the observer so it disconnects when the cache resets
    if (resetCache) {
      setResetCache(false);
      setPage(1);
    }
    return () => io.disconnect();
  }, [comments, resetCache, setResetCache]);

  const content = docs?.map((doc, i) => (
    <article
      ref={(node) => {
        // Apply the ref only on 1 article at the bottom of the feed.
        node && i === docs.length - 3 ? (observedNodeRef.current = node) : null;
        const map = getMap();
        node ? map.set(i, node) : map.delete(i);
      }}
      key={doc?._id}
      className='feed__article'
      data-index={i}
      aria-labelledby={`feed-article-heading-${i + 1}`}
      aria-describedby={`feed-article-date-${i + 1}`}
      aria-posinset={i + 1}
      aria-setsize={docsCount}
      //eslint-disable-next-line
      tabIndex='0'>
      <header className='feed__header'>
        <h3 id={`feed-article-heading-${i + 1}`} className='feed__heading'>
          {doc?.name}
        </h3>
        <p id={`feed-article-date-${i + 1}`} className='feed__date'>
          {normalizeDate(doc?.date)}
        </p>
      </header>
      <p className='feed__text'>{doc?.text}</p>
    </article>
  ));

  return (
    <>
      <TextArea
        key={movieId}
        movieId={movieId}
        userComment={comments?.userComment?.[0]}
        setResetCache={setResetCache}
        setPage={setPage}
        trackCurrentMovieId={trackId.current}
      />
      <div role='feed' className='feed' aria-busy={isFetching}>
        {content}
      </div>
    </>
  );
};

export default Feed;
