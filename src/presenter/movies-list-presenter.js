import { render } from '../framework/render.js';
import MoviePresenter from './movie-presenter.js';
import MenuView from '../view/menu-view.js';
import SorterView from '../view/sorter-view.js';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentGroupView from '../view/content-group-view.js';
import ContentWrapperView from '../view/content-wrapper-view.js';
import { UpdateType, UserAction } from '../utils/constant-utils.js';

const MOVIES_COUNT_PER_PORTION = 5;
const MOVIES_EXTRA_COUNT = 2;
const MAIN_GROUP_CAPTION = 'All movies. Upcoming';
const EMPTY_MAIN_GROUP_CAPTION = 'There are no movies in our database';
const TOP_GROUP_CAPTION = 'Top rated';
const POPULAR_GROUP_CAPTION = 'Most commented';

export default class MoviesListPresenter{
  #menuComponent = new MenuView();
  #sorterComponent = new SorterView();
  #mainContentGroupComponent = new ContentGroupView(MAIN_GROUP_CAPTION, false, true);
  #topContentGroupComponent = new ContentGroupView(TOP_GROUP_CAPTION, true);
  #popularContentGroupComponent = new ContentGroupView(POPULAR_GROUP_CAPTION, true);
  #contentWrapperComponent = new ContentWrapperView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #moviesPresenters = new Map();
  #topMoviesPresenters = new Map();
  #popularMoviesPresenters = new Map();

  #moviesShownCount = 0;
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;
  #moviesIdListSortedByRate = null;
  #moviesIdListSortedByComments = null;

  constructor(containerElement, moviesModel, commentsModel){
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#moviesModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#renderMenu();
    this.#renderSorter();
    this.#initSortedIdLists();
    this.#renderComponents();
  };

  get movies () { return this.#moviesModel.movies; }
  get comments () { return this.#commentsModel.comments; }

  #getRelatedCommentsList = (movie) => this.comments
    .filter((element) => movie.comments.some((id) => id === element.id))
    .sort((a, b) => a.date - b.date);

  #viewActionHandler = (userAction, updateType, update) => {
    switch (userAction){
      case UserAction.UPDATE_MOVIE :
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT :
        //
        break;
      case UserAction.REMOVE_COMMENT :
        //
        break;
      default:
        throw new Error('Unknown user action!');
    }
  };

  #modelEventHandler = (updateType, update) => {
    switch (updateType){
      case UpdateType.PATCH :
        this.#reinitMoviePresenters(update);
        break;
      case UpdateType.MINOR :
        this.#initSortedIdLists();
        this.#rerenderComponents();
        //
        break;
      case UpdateType.MAJOR :
        this.#initSortedIdLists();
        this.#clearComponents();
        this.#renderComponents();
        //
        break;
      default:
        throw new Error('Unknown update type!');
    }
  };

  #reinitMoviePresenters(movie){
    if(this.#moviesPresenters.has(movie.id)){
      this.#moviesPresenters.get(movie.id).init(movie);
    }
    if(this.#topMoviesPresenters.has(movie.id)){
      this.#topMoviesPresenters.get(movie.id).init(movie);
    }
    if(this.#popularMoviesPresenters.has(movie.id)){
      this.#popularMoviesPresenters.get(movie.id).init(movie);
    }
  }

  #prepareOpeningExtensive = () => {
    this.#moviesPresenters.forEach((presenter) => presenter.collapseExtensive());
    this.#topMoviesPresenters.forEach((presenter) => presenter.collapseExtensive());
    this.#popularMoviesPresenters.forEach((presenter) => presenter.collapseExtensive());
  };

  #renderMovie = (index, container, presenters) => {
    const movie = this.movies[index];
    const relatedCommentsList = this.#getRelatedCommentsList(movie);
    const moviePresenter = new MoviePresenter(container, this.#viewActionHandler, this.#prepareOpeningExtensive, relatedCommentsList);
    moviePresenter.init(movie);
    presenters.set(movie.id, moviePresenter);
  };

  #fillGroup = (start, count, contentGroup, presenters, maskArray) => {
    const limit = start + count < this.movies.length ?
      start + count :
      this.movies.length;

    for(let i = start; i < limit; i++){
      const index = maskArray ? maskArray[i].index : i;
      this.#renderMovie(index, contentGroup.filmsContainer, presenters);
    }
    return limit - start;
  };

  #showMoreButtonClickHandler = () => {
    this.#moviesShownCount += this.#fillGroup(this.#moviesShownCount, MOVIES_COUNT_PER_PORTION, this.#mainContentGroupComponent, this.#moviesPresenters);
    if(this.#moviesShownCount === this.movies.length){
      this.#showMoreButtonComponent.hide();
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#mainContentGroupComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
  };

  #renderMenu = () => {
    render(this.#menuComponent, this.#containerElement);
  };

  #renderSorter = () => {
    render(this.#sorterComponent, this.#containerElement);
  };

  #renderComponents = (commonMoviesCount = MOVIES_COUNT_PER_PORTION) => {
    render(this.#mainContentGroupComponent, this.#contentWrapperComponent.element);
    if(this.movies.length){
      this.#moviesShownCount += this.#fillGroup(0, commonMoviesCount, this.#mainContentGroupComponent, this.#moviesPresenters);
      this.#fillGroup(0, MOVIES_EXTRA_COUNT, this.#topContentGroupComponent, this.#topMoviesPresenters, this.#moviesIdListSortedByRate);
      this.#fillGroup(0, MOVIES_EXTRA_COUNT, this.#popularContentGroupComponent, this.#popularMoviesPresenters, this.#moviesIdListSortedByComments);
      if(this.movies.length > this.#moviesShownCount){
        this.#renderShowMoreButton();
      }
      render(this.#topContentGroupComponent, this.#contentWrapperComponent.element);
      render(this.#popularContentGroupComponent, this.#contentWrapperComponent.element);
    }
    else{
      this.#sorterComponent.hide();
      this.#mainContentGroupComponent.caption = EMPTY_MAIN_GROUP_CAPTION;
      this.#mainContentGroupComponent.revealCaption();
    }
    render(this.#contentWrapperComponent, this.#containerElement);
  };

  #clearComponents = () => {
    this.#contentWrapperComponent.getEmpty();// bad idea!!!!!!!!!!!! make another way! (presenters)
    this.#moviesShownCount = 0;
  };

  #rerenderComponents = () => {
    const commonMoviesShownCount = this.#moviesShownCount;
    this.#clearComponents();
    this.#renderComponents(commonMoviesShownCount);
  };

  #initSortedIdLists = () => {
    if(this.movies.length){
      this.#moviesIdListSortedByRate = this.movies.map(
        (element, index) => ({index, rating : element.filmInfo.totalRating})
      );
      this.#moviesIdListSortedByRate = this.#moviesIdListSortedByRate.sort((a, b) => b.rating - a.rating);

      this.#moviesIdListSortedByComments = this.movies.map(
        (element, index) => ({index, commentsCount: element.comments.length})
      );
      this.#moviesIdListSortedByComments = this.#moviesIdListSortedByComments.sort((a, b) => b.commentsCount - a.commentsCount);
    }
  };
}
