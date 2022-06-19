import { remove, render, replace } from '../framework/render.js';
import CommentsModel from '../model/comments-model.js';
import { FilterType, KeyCode, StyleClass, UpdateType, UserAction } from '../utils/constant-utils.js';
import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/film-info-view.js';

export default class MoviePresenter{
  #containerElement = null;
  #changeData = null;
  #prepareOpeningExtensive = null;

  #movie = null;
  #filmCardComponent = null;
  #filmInfoComponent = null;
  #filter = null;
  #commentsModel = null;

  constructor(containerElement, changeData, prepareOpeningExtensive, filter){
    this.#containerElement = containerElement;
    this.#changeData = changeData;
    this.#prepareOpeningExtensive = prepareOpeningExtensive;
    this.#filter = filter;
  }

  init = (movie) => {
    this.#movie = movie;

    const previousFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#movie);
    this.#setCardHandlers();

    if(previousFilmCardComponent === null){
      this.#renderFilmCard();
      return;
    }

    if(this.#containerElement.contains(previousFilmCardComponent.element)){
      replace(this.#filmCardComponent, previousFilmCardComponent);
    }
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      this.#rerenderFilmInfo();
    }
    remove(previousFilmCardComponent);
  };

  #renderFilmInfo = () => {
    this.#prepareOpeningExtensive();
    this.#commentsModel = new CommentsModel(this.#movie.id);
    this.#commentsModel.addObserver(this.#commentsModelEventHandler);
    this.#commentsModel.init();
    this.#filmInfoComponent = new FilmInfoView(this.#movie, this.#commentsModel.comments);
    this.#setExtensiveHandlers();
    document.body.append(this.#filmInfoComponent.element);
    document.body.classList.add(StyleClass.HIDING_SCROLL_CLASS);
    document.addEventListener('keydown', this.#keyDownHandler);
  };

  #rerenderFilmInfo = () => {
    const scrollOffset = this.#filmInfoComponent.isOpen ? this.#filmInfoComponent.scrollOffset : 0;
    this.#filmInfoComponent.resetComponent(this.#movie, this.#commentsModel.comments);
    this.#filmInfoComponent.scrollOffset = scrollOffset;
  };

  collapseExtensive = () => {
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      this.#filmInfoComponent.resetComponent(this.#movie, this.#commentsModel.comments);
      this.#filmInfoComponent.element.remove();
      document.body.classList.remove(StyleClass.HIDING_SCROLL_CLASS);
      document.removeEventListener('keydown', this.#keyDownHandler);
    }
  };

  #renderFilmCard = () => {
    render(this.#filmCardComponent, this.#containerElement);
  };

  #commentsModelEventHandler = (updateType) => {
    switch(updateType){
      case UpdateType.INIT :
        this.#rerenderFilmInfo();
        break;
      default:
        throw new Error('Unknown update type!');
    }
  };

  #setCardHandlers = () => {
    this.#filmCardComponent.setAddToWatchlistClickHandler(this.#addToWatchlistClickHandler);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#alreadyWatchedClickHandler);
    this.#filmCardComponent.setAddToFavoritesClickHandler(this.#addToFavoritesClickHandler);
    this.#filmCardComponent.setLinkClickHandler(this.#filmCardLinkClickHandler);
  };

  #setExtensiveHandlers = () => {
    this.#filmInfoComponent.setAddToWatchlistClickHandler(this.#addToWatchlistClickHandler);
    this.#filmInfoComponent.setAlreadyWatchedClickHandler(this.#alreadyWatchedClickHandler);
    this.#filmInfoComponent.setAddToFavoritesClickHandler(this.#addToFavoritesClickHandler);
    this.#filmInfoComponent.setCloseButtonClickHandler(this.#filmInfoCloseButtonClickHandler);
    this.#filmInfoComponent.setCommentsDeleteClickHandler(this.#commentDeletionHandler);
    this.#filmInfoComponent.setSubmitHandler(this.#commentAdditionHandler);
  };

  #filmCardLinkClickHandler = () => {
    this.#renderFilmInfo();
  };

  #keyDownHandler = (evt) => {
    if(evt.keyCode === KeyCode.ESC){
      evt.preventDefault();
      this.collapseExtensive();
    }
    if(evt.ctrlKey && evt.keyCode === KeyCode.ENTER){
      this.#filmInfoComponent.submitForm();
    }
  };

  destroyComponents = () => {
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      document.body.classList.remove(StyleClass.HIDING_SCROLL_CLASS);
      document.removeEventListener('keydown', this.#keyDownHandler);
      remove(this.#filmInfoComponent);
    }
    remove(this.#filmCardComponent);
  };

  #filmInfoCloseButtonClickHandler = () => this.collapseExtensive();

  #addToWatchlistClickHandler = () => {
    const updateType = this.#filter === FilterType.WATCHLIST ? UpdateType.MINOR : UpdateType.PATCH;
    this.#changeData(UserAction.UPDATE_MOVIE, updateType, {
      ...this.#movie,
      userDetails:{
        ...this.#movie.userDetails,
        watchlist: !this.#movie.userDetails.watchlist
      }
    });
  };

  #alreadyWatchedClickHandler = () => {
    const updateType = this.#filter === FilterType.HISTORY ? UpdateType.MINOR : UpdateType.PATCH;
    this.#changeData(UserAction.UPDATE_MOVIE, updateType, {
      ...this.#movie,
      userDetails:{
        ...this.#movie.userDetails,
        alreadyWatched: !this.#movie.userDetails.alreadyWatched
      }
    });
  };

  #addToFavoritesClickHandler = () => {
    const updateType = this.#filter === FilterType.FAVORITES ? UpdateType.MINOR : UpdateType.PATCH;
    this.#changeData(UserAction.UPDATE_MOVIE, updateType, {
      ...this.#movie,
      userDetails:{
        ...this.#movie.userDetails,
        favorite: !this.#movie.userDetails.favorite
      }
    });
  };

  #commentDeletionHandler = (commentData) => {
    this.#changeData(UserAction.REMOVE_COMMENT, UpdateType.PATCH, commentData);
  };

  #commentAdditionHandler = (commentData) => {
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, commentData);
  };

}
