import { apiSlice } from '../api/apiSlice';

export const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMovieWithId: build.query({
      query: (id) => `search/id/${id}`,
    }),
    getMovieToBlob: build.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const movies = await fetchWithBQ(`/search/title/${_arg}`);
        if (movies.error) return { error: movies.error };

        // try {
        //   const postersToBlob = await fetch(movies.data?.[0].movies[0].poster);
        //   const blob = await postersToBlob.blob();
        //   const result = await new Promise((resolve) => {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(blob);
        //     reader.onloadend = () => resolve(reader.result);
        //   });
        //   movies.data.push(result);
        // } catch (error) {
        //   movies.data.push('error');
        // }

        const postersToBlob = movies.data?.[0].movies.map(async (movie) => {
          try {
            const getImages = await fetch(movie.poster);
            const blob = await getImages.blob();

            const result = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => resolve(reader.result);
            });
            return result;
          } catch (error) {
            return '/no_image.png';
          }
        });

        const final = await Promise.allSettled(postersToBlob);
        final.forEach((img, i) => {
          movies.data[0].movies[i].poster = img.value;
        });

        return movies.data ? { data: movies.data } : { error: movies.error };
      },
    }),

    getMoviesWithTitle: build.query({
      query: ({ title, sortByQuery, sortQuery, pageQuery }) =>
        `/search/title/${title}?sortBy=${sortByQuery}&sort=${sortQuery}&page=${pageQuery}`,
    }),
  }),
});

export const {
  useGetMovieWithIdQuery,
  useGetMovieToBlobQuery,
  useGetMoviesWithTitleQuery,
} = moviesApiSlice;
