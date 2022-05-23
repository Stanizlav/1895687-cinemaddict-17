import { render } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/film-info-view.js';

const HIDING_SCROLL_CLASS = 'hide-overflow';

export default class MoviePresenter{
  #containerElement = null;
  #movie = null;
  #commentsList = null;
  #filmCardComponent = null;
  #filmInfoComponent = null;

  constructor(containerElement){
    this.#containerElement = containerElement;
  }

  init = (movie, relatedCommentsList) => {
    this.#movie = movie;
    this.#commentsList = relatedCommentsList;

    this.#filmCardComponent = new FilmCardView(this.#movie);
    this.#filmInfoComponent = new FilmInfoView(this.#movie, this.#commentsList);

    this.#filmCardComponent.setLinkClickHandler(this.#filmCardLinkClickHandler);
    this.#filmInfoComponent.setCloseButtonClickHandler(this.#filmInfoCloseButtonClickHandler);
    this.#renderFilmCard();
  };

  #filmCardLinkClickHandler = () => {
    this.#renderFilmInfo();
  };

  #renderFilmCard = () => {

    render(this.#filmCardComponent, this.#containerElement);
  };

  #keyDownHandler = (evt) => {
    if(evt.key === 'Escape'){
      evt.preventDefault();
      this.#collapseFilmInfo();
    }
  };

  #collapseFilmInfo = () => {
    this.#filmInfoComponent.element.remove();
    document.body.classList.remove(HIDING_SCROLL_CLASS);
    document.removeEventListener('keydown', this.#keyDownHandler);
  };

  #filmInfoCloseButtonClickHandler = () => this.#collapseFilmInfo();

  #renderFilmInfo = () => {
    document.body.append(this.#filmInfoComponent.element);
    document.body.classList.add(HIDING_SCROLL_CLASS);
    document.addEventListener('keydown', this.#keyDownHandler);
  };

}
