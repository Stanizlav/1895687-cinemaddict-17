import { remove, render, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/film-info-view.js';

const HIDING_SCROLL_CLASS = 'hide-overflow';

export default class MoviePresenter{
  #containerElement = null;
  #changeData = null;
  #prepareOpenExtensive = null;

  #movie = null;
  #commentsList = null;
  #filmCardComponent = null;
  #filmInfoComponent = null;

  constructor(containerElement, changeData, prepareOpenExtensive, relatedCommentsList){
    this.#containerElement = containerElement;
    this.#changeData = changeData;
    this.#prepareOpenExtensive = prepareOpenExtensive;
    this.#commentsList = relatedCommentsList;
  }

  init = (movie) => {
    this.#movie = movie;
    const previousFilmCardComponent = this.#filmCardComponent;
    const previousFilmInfoComponent = this.#filmInfoComponent;

    this.#filmCardComponent = new FilmCardView(this.#movie);
    this.#filmInfoComponent = new FilmInfoView(this.#movie, this.#commentsList);
    this.#setHandlers();

    if(previousFilmCardComponent === null){
      this.#renderFilmCard();
      return;
    }

    if(this.#containerElement.contains(previousFilmCardComponent.element)){
      replace(this.#filmCardComponent, previousFilmCardComponent);
    }
    if(previousFilmInfoComponent.isOpen){
      const scrollOffset = previousFilmInfoComponent.scrollOffset;
      replace(this.#filmInfoComponent, previousFilmInfoComponent);
      this.#filmInfoComponent.scrollOffset = scrollOffset;
    }
    remove(previousFilmCardComponent);
    remove(previousFilmInfoComponent);


  };

  #setHandlers = () => {
    this.#filmCardComponent.setAddToWatchlistClickHandler(this.#addToWatchlistClickHandler);
    this.#filmInfoComponent.setAddToWatchlistClickHandler(this.#addToWatchlistClickHandler);

    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#alreadyWatchedClickHandler);
    this.#filmInfoComponent.setAlreadyWatchedClickHandler(this.#alreadyWatchedClickHandler);

    this.#filmCardComponent.setAddToFavoritesClickHandler(this.#addToFavoritesClickHandler);
    this.#filmInfoComponent.setAddToFavoritesClickHandler(this.#addToFavoritesClickHandler);

    this.#filmCardComponent.setLinkClickHandler(this.#filmCardLinkClickHandler);
    this.#filmInfoComponent.setCloseButtonClickHandler(this.#filmInfoCloseButtonClickHandler);
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
      this.collapseExtensive();
    }
  };

  collapseExtensive = () => {
    this.#filmInfoComponent.element.remove();
    document.body.classList.remove(HIDING_SCROLL_CLASS);
    document.removeEventListener('keydown', this.#keyDownHandler);
  };

  #filmInfoCloseButtonClickHandler = () => this.collapseExtensive();

  #renderFilmInfo = () => {
    this.#prepareOpenExtensive();
    document.body.append(this.#filmInfoComponent.element);
    document.body.classList.add(HIDING_SCROLL_CLASS);
    document.addEventListener('keydown', this.#keyDownHandler);
  };

  #addToWatchlistClickHandler = () =>{
    this.#changeData({
      ...this.#movie,
      userDetails:{
        ...this.#movie.userDetails,
        watchlist: !this.#movie.userDetails.watchlist
      }
    });
  };

  #alreadyWatchedClickHandler = () =>{
    this.#changeData({
      ...this.#movie,
      userDetails:{
        ...this.#movie.userDetails,
        alreadyWatched: !this.#movie.userDetails.alreadyWatched
      }
    });
  };

  #addToFavoritesClickHandler = () =>{
    this.#changeData({
      ...this.#movie,
      userDetails:{
        ...this.#movie.userDetails,
        favorite: !this.#movie.userDetails.favorite
      }
    });
  };

}
