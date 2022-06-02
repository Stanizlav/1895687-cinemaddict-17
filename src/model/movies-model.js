import Observable from '../framework/observable.js';
import { generateMovie } from '../mock/movie.js';
import { UpdateType } from '../utils/constant-utils.js';

const MOVIES_COUNT = 23;

export default class MoviesModel extends Observable{
  #movies = Array.from({ length : MOVIES_COUNT }, generateMovie);

  get movies () { return this.#movies; }
  set movies (otherMovies) {
    this.#movies = [...otherMovies];
    this._notify(UpdateType.MINOR);
  }

  addMovie = (updateType, update) => {
    this.#movies.push(update);

    this._notify(updateType, update);
  };

  removeMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if(index === -1){
      throw new Error('There is no corresponding movie to remove');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      ...this.#movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  removeComment = (updateType, movieId, commentId) => {
    const index = this.#movies.findIndex((movie) => movie.id === movieId);
    const commentIndex = this.#movies[index].comments.findIndex((id) => id === commentId);
    this.#movies[index].comments.splice(commentIndex, 1);

    this._notify(updateType, this.#movies[index]);
  };

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if(index === -1){
      throw new Error('There is no corresponding movie to update');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

}
