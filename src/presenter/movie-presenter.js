import { remove, render, RenderPosition, replace } from '../framework/render';
import CommentsModel from '../model/comments-model';
import { FilterType, KeyCode, StyleClass, UpdateType, UserAction } from '../utils/constant-utils';
import FilmCardView from '../view/film-card-view';
import FilmInfoView from '../view/film-info-view';

export default class MoviePresenter{
  #containerElement = null;
  #changeData = null;
  #prepareOpeningExtensive = null;
  #toggleInterfaceActivity = null;

  #movie = null;
  #filmCardComponent = null;
  #filmInfoComponent = null;
  #filter = null;
  #commentsModel = null;
  #isExtensiveOpen = false;


  constructor(containerElement, changeData, prepareOpeningExtensive, toggleInterfaceActivity, filter){
    this.#containerElement = containerElement;
    this.#changeData = changeData;
    this.#prepareOpeningExtensive = prepareOpeningExtensive;
    this.#toggleInterfaceActivity = toggleInterfaceActivity;
    this.#filter = filter;
  }

  get isExtensiveOpen() { return  this.#isExtensiveOpen; }

  init = (movie, isHeader = false) => {
    this.#movie = movie;

    const previousFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#movie);
    this.#setCardHandlers();

    if(previousFilmCardComponent === null){
      this.#renderFilmCard(isHeader);
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

  #setDeleting = (commentId) => {
    this.#toggleInterfaceActivity(true);
    this.#updateFilmInfoSavingScroll( ()=>
      this.#filmInfoComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
        deletableCommentId: commentId
      })
    );
  };

  #setAdding = () => {
    this.#toggleInterfaceActivity(true);
    this.#updateFilmInfoSavingScroll( () =>
      this.#filmInfoComponent.updateElement({
        isDisabled: true,
        isUploading: true
      })
    );
  };

  setUpdating = () => {
    if(this.#filmInfoComponent){
      this.#updateFilmInfoSavingScroll( () =>
        this.#filmInfoComponent.updateElement({
          isDisabled: true
        })
      );
    }

  };

  setAborting = () => {
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      this.#filmInfoComponent.shakeControlButtons(this.#resetFilmInfoState);
    }
    this.#filmCardComponent.shake();
  };

  #initComments = () => {
    this.#commentsModel = new CommentsModel(this.#movie.id);
    this.#commentsModel.addObserver(this.#commentsModelEventHandler);
    this.#commentsModel.init();
  };

  #renderFilmInfo = () => {
    this.#prepareOpeningExtensive();
    this.#initComments();
    this.#filmInfoComponent = new FilmInfoView(this.#movie, this.#commentsModel.comments);
    this.#setExtensiveHandlers();
    document.body.append(this.#filmInfoComponent.element);
    document.body.classList.add(StyleClass.HIDING_SCROLL_CLASS);
    document.addEventListener('keydown', this.#keyDownHandler);
    this.#isExtensiveOpen = true;
  };

  #updateFilmInfoSavingScroll = (callback) => {
    const scrollOffset = this.#filmInfoComponent.isOpen ? this.#filmInfoComponent.scrollOffset : 0;
    callback();
    this.#filmInfoComponent.scrollOffset = scrollOffset;
  };

  #rerenderFilmInfo = () => {
    this.#updateFilmInfoSavingScroll( () =>
      this.#filmInfoComponent.resetComponent(this.#movie, this.#commentsModel.comments)
    );
  };

  #resetFilmInfoState = () => {
    this.#updateFilmInfoSavingScroll(() =>
      this.#filmInfoComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
        deletableCommentId : undefined,
        isUploading: false
      })
    );
  };

  collapseExtensive = () => {
    this.#isExtensiveOpen = false;
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      this.#filmInfoComponent.resetComponent(this.#movie, this.#commentsModel.comments);
      remove(this.#filmInfoComponent);
      document.body.classList.remove(StyleClass.HIDING_SCROLL_CLASS);
      document.removeEventListener('keydown', this.#keyDownHandler);
    }
  };

  #renderFilmCard = (isHeader) => {
    const position = isHeader ? RenderPosition.AFTERBEGIN : RenderPosition.BEFOREEND;
    render(this.#filmCardComponent, this.#containerElement, position);
  };

  #commentsModelEventHandler = (updateType, update) => {
    switch(updateType){
      case UpdateType.INIT :
        this.#rerenderFilmInfo();
        break;
      case UpdateType.EDIT_COMMENTS :
        this.#changeData(UserAction.EDIT_COMMENTS, UpdateType.PATCH, update);
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

  #commentDeletionHandler = async (commentData) => {
    this.#setDeleting(commentData.commentId);
    try{
      await this.#commentsModel.removeComment(UpdateType.EDIT_COMMENTS, commentData.commentId, commentData.movie);
    }
    catch(error){
      this.#filmInfoComponent.shakeComment(commentData.commentId, this.#resetFilmInfoState);
      this.#toggleInterfaceActivity(false);
    }
  };

  #commentAdditionHandler = async (commentData) => {
    this.#setAdding();
    try{
      await this.#commentsModel.addComment(UpdateType.EDIT_COMMENTS, commentData.comment, commentData.movie);
    }
    catch(error){
      this.#filmInfoComponent.shakeForm(this.#resetFilmInfoState);
      this.#toggleInterfaceActivity(false);
    }
  };
}
