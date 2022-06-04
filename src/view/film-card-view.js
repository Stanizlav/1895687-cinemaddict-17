import AbstractView from '../framework/view/abstract-view.js';
import { convertDuration, getYear } from '../utils/date-utils.js';

const DESCRIPTION_LIMIT = 140;

const getActivityClass = (flag) => flag ? 'film-card__controls-item--active' : '';

const createFilmCardTemplate = (movie) => {
  const { comments, filmInfo, userDetails } = movie;
  const  { title, totalRating, poster, release, runtime, genre, description } = filmInfo;
  const { date } = release;
  const { watchlist, alreadyWatched, favorite } = userDetails;

  const releaseYear = getYear(date);
  const duration = convertDuration(runtime);
  const genres = genre.join(', ');
  const shortDescription = description.length <= DESCRIPTION_LIMIT ? description :
    `${ description.substring(0, DESCRIPTION_LIMIT-2) }...`;

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${ title }</h3>
        <p class="film-card__rating">${ totalRating }</p>
        <p class="film-card__info">
          <span class="film-card__year">${ releaseYear }</span>
          <span class="film-card__duration">${ duration }</span>
          <span class="film-card__genre">${ genres }</span>
        </p>
        <img src="${ poster }" alt="" class="film-card__poster">
        <p class="film-card__description">${ shortDescription }</p>
        <span class="film-card__comments"> ${ comments.length } comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${getActivityClass(watchlist)} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${getActivityClass(alreadyWatched)} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${getActivityClass(favorite)} film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`);
};

export default class FilmCardView extends AbstractView{
  #movie = null;

  constructor(movie){
    super();
    this.#movie = movie;
  }

  get template(){
    return createFilmCardTemplate(this.#movie);
  }

  get #link(){
    return this.element.querySelector('.film-card__link');
  }

  get addToWatchlistButton() {
    return this.element.querySelector('.film-card__controls-item--add-to-watchlist');
  }

  get alreadyWatchedButton() {
    return this.element.querySelector('.film-card__controls-item--mark-as-watched');
  }

  get addToFavoritesButton() {
    return this.element.querySelector('.film-card__controls-item--favorite');
  }

  setLinkClickHandler = (callback) =>{
    this._callback.clickLink = callback;
    this.#link.addEventListener('click', this.#linkClickHandler);
  };

  #linkClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickLink();
  };

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
