import { createElement } from '../render.js';
import { convertDuration, getYear } from '../utils.js';

const DESCRIPTION_LIMIT = 140;

const createFilmCardTemplate = (movie) => {
  const { comments, filmInfo } = movie;
  const  { title, totalRating, poster, release, runtime, genre, description } = filmInfo;
  const { date } = release;

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
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`);
};

export default class FilmCardView {
  #element = null;
  #movie = null;

  constructor(movie){
    this.#movie = movie;
  }

  get template(){
    return createFilmCardTemplate(this.#movie);
  }

  get element(){
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement(){
    this.#element = null;
  }
}
