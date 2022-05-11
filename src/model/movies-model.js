import { generateMovie } from '../mock/movie.js';

const MOVIES_COUNT = 7;

export default class MoviesModel{
  _movies = Array.from({ length : MOVIES_COUNT }, generateMovie);

  get movies () { return this._movies; }
}
