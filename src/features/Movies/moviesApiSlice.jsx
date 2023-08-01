import { apiSlice } from '../api/apiSlice';

const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMovieWithId: build.query({
      query: (id) => `search/id/${id}`,
    }),
    getMovieToBlob: build.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const response = await fetch(
          'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg'
        );
        const blob = await response.blob();

        const result = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
        });

        return { data: result };
      },
    }),
    getMoviesWithTitle: build.query({
      query: (title) => `/search/title/${title}`,
    }),
  }),
});

export const {
  useGetMovieWithIdQuery,
  useGetMovieToBlobQuery,
  useGetMoviesWithTitleQuery,
} = moviesApiSlice;
