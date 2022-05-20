import { generateMovie } from '../mock/movie.js';

const MOVIES_COUNT = 23;

export default class MoviesModel{
  #movies = Array.from({ length : MOVIES_COUNT }, generateMovie);

  get movies () { return this.#movies; }
}