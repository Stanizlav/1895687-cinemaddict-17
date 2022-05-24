import AbstractView from '../framework/view/abstract-view.js';

export default class FilmAbstractView extends AbstractView{
  _movie = null;

  constructor(movie) {
    super();
    this._movie = movie;
    if (new.target === FilmAbstractView) {
      throw new Error('Can\'t instantiate FilmAbstractView, only concrete one.');
    }
  }

  get addToWatchlistButton() {
    throw new Error('Abstract method not implemented: get addToWatchlistButton');
  }

  get alreadyWatchedButton() {
    throw new Error('Abstract method not implemented: get alreadyWatchedButton');
  }

  get addToFavoritesButton() {
    throw new Error('Abstract method not implemented: get addToFavoritesButton');
  }

  setAddToWatchlistClickHandler = (callback) => {
    this._callback.clickAddToWatchlist = callback;
    this.addToWatchlistButton.addEventListener('click', this.#addToWatchlistClickHandler);
  };

  #addToWatchlistClickHandler = () => {
    this._callback.clickAddToWatchlist();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.clickAlreadyWatched = callback;
    this.alreadyWatchedButton.addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = () => {
    this._callback.clickAlreadyWatched();
  };

  setAddToFavoritesClickHandler = (callback) => {
    this._callback.clickAddToFavorites = callback;
    this.addToFavoritesButton.addEventListener('click', this.#addToFavoritesClickHandler);
  };

  #addToFavoritesClickHandler = () => {
    this._callback.clickAddToFavorites();
  };

}
