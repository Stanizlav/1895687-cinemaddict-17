import { SortType } from './constant-utils';

const sortByDate = (a, b) => b.filmInfo.release.date - a.filmInfo.release.date;

const sortByRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

const sortMovies = {
  [SortType.DEFAULT] : (movies) => movies,
  [SortType.DATE] : (movies) => movies.slice().sort(sortByDate),
  [SortType.RATING] : (movies) => movies.slice().sort(sortByRating)
};

export { sortMovies };
