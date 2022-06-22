import { FilterType } from './constant-utils';

const filterMovies = {
  [FilterType.ALL] : (movies) => movies,
  [FilterType.FAVORITES] : (movies) => movies.filter((movie) => movie.userDetails.favorite),
  [FilterType.HISTORY] : (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.WATCHLIST] : (movies) => movies.filter((movie) => movie.userDetails.watchlist)
};

export { filterMovies };
