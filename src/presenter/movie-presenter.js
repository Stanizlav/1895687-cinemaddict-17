import { remove, render, RenderPosition, replace } from '../framework/render';
import CommentsModel from '../model/comments-model';
import { FilterType, KeyCode, StyleClass, UpdateType, UserAction } from '../utils/constant-utils';
import FilmCardView from '../view/film-card-view';
import FilmInfoView from '../view/film-info-view';

export default class MoviePresenter{
  #containerElement = null;
  #changeData = null;
  #prepareOpeningExtensive = null;
  #saveOpenedExtensivePresenter = null;
  #toggleInterfaceActivity = null;

  #movie = null;
  #filmCardComponent = null;
  #filmInfoComponent = null;
  #filter = null;
  #commentsModel = null;

  constructor(containerElement, changeData, prepareOpeningExtensive, saveOpenedExtensivePresenter, toggleInterfaceActivity, filter){
    this.#containerElement = containerElement;
    this.#changeData = changeData;
    this.#prepareOpeningExtensive = prepareOpeningExtensive;
    this.#saveOpenedExtensivePresenter = saveOpenedExtensivePresenter;
    this.#toggleInterfaceActivity = toggleInterfaceActivity;
    this.#filter = filter;
  }

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
    remove(previousFilmCardComponent);
  };

  reinitExtensive = (movie) => {
    if(this.#movie.id === movie.id){
      this.#movie = movie;
      this.#rerenderFilmInfo();
    }
  };

  #setCommentDeleting = (commentId) => {
    this.#toggleInterfaceActivity(true);
    this.#updateFilmInfoSavingScroll( ()=>
      this.#filmInfoComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
        deletableCommentId: commentId
      })
    );
  };

  #setCommentAdding = () => {
    this.#toggleInterfaceActivity(true);
    this.#updateFilmInfoSavingScroll( () =>
      this.#filmInfoComponent.updateElement({
        isDisabled: true,
        isUploading: true
      })
    );
  };

  #setCommentAdded = () => {
    this.#updateFilmInfoSavingScroll( () =>
      this.#filmInfoComponent.updateElement({
        setEmotion:'',
        typedComment:''
      })
    );
  };

  setUpdating = (movie = null) => {
    if(movie && movie.id !== this.#movie.id){
      return;
    }
    if(this.#filmInfoComponent){
      this.#updateFilmInfoSavingScroll( () =>
        this.#filmInfoComponent.updateElement({
          isDisabled: true
        })
      );
    }

  };

  setAborting = (movie = null) => {
    if(movie && movie.id !== this.#movie.id){
      return;
    }
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      this.#filmInfoComponent.shakeControlButtons(this.#resetFilmInfoState);
    }
    if(this.#filmCardComponent){
      this.#filmCardComponent.shake();
    }
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
    this.#saveOpenedExtensivePresenter(this);
  };

  #updateFilmInfoSavingScroll = (callback) => {
    const scrollOffset = this.#filmInfoComponent.isOpen ? this.#filmInfoComponent.scrollOffset : 0;
    callback();
    this.#filmInfoComponent.scrollOffset = scrollOffset;
  };

  #rerenderFilmInfo = () => {
    this.#updateFilmInfoSavingScroll( () =>
      this.#filmInfoComponent.updateElement({
        movie: this.#movie,
        commentsList: this.#commentsModel.comments,
        isDisabled: false,
        isDeleting: false,
        deletableCommentId : undefined,
        isUploading: false
      })
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
    if(this.#filmInfoComponent && this.#filmInfoComponent.isOpen){
      this.#filmInfoComponent.resetComponent(this.#movie, this.#commentsModel.comments);
      remove(this.#filmInfoComponent);
      document.body.classList.remove(StyleClass.HIDING_SCROLL_CLASS);
      document.removeEventListener('keydown', this.#keyDownHandler);
      this.#saveOpenedExtensivePresenter(null);
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
    if((evt.ctrlKey || evt.metaKey) && evt.keyCode === KeyCode.ENTER){
      this.#filmInfoComponent.submitForm();
    }
  };

  destroyComponents = (isDestroyingExtensive = true) => {
    if(isDestroyingExtensive){
      this.collapseExtensive();
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
    this.#setCommentDeleting(commentData.commentId);
    try{
      await this.#commentsModel.removeComment(UpdateType.EDIT_COMMENTS, commentData.commentId, commentData.movie);
    }
    catch(error){
      this.#filmInfoComponent.shakeComment(commentData.commentId, this.#resetFilmInfoState);
      this.#toggleInterfaceActivity(false);
    }
  };

  #commentAdditionHandler = async (commentData) => {
    this.#setCommentAdding();
    try{
      await this.#commentsModel.addComment(UpdateType.EDIT_COMMENTS, commentData.comment, commentData.movie);
      this.#setCommentAdded();
    }
    catch(error){
      this.#filmInfoComponent.shakeForm(this.#resetFilmInfoState);
      this.#toggleInterfaceActivity(false);
    }
  };
}
