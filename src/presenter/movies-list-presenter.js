import { remove, render } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import MoviePresenter from './movie-presenter';
import SorterView from '../view/sorter-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentGroupView from '../view/content-group-view';
import ContentWrapperView from '../view/content-wrapper-view';
import { NoMoviesCaption, SortType, UpdateType, UserAction } from '../utils/constant-utils';
import { filterMovies } from '../utils/filter-utils';
import { sortMovies } from '../utils/sort-utils';
import LoadingView from '../view/loading-view';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const GroupCaption = {
  MAIN: 'All movies. Upcoming',
  TOP: 'Top rated',
  POPULAR: 'Most commented'
};

const MoviesCount = {
  PORTION: 5,
  EXTRA_GROUP: 2
};

export default class MoviesListPresenter{
  #sorterComponent = null;
  #mainContentGroupComponent = null;
  #topContentGroupComponent = null;
  #popularContentGroupComponent = null;
  #contentWrapperComponent = new ContentWrapperView();
  #showMoreButtonComponent = null;
  #loadingComponent = new LoadingView();
  #moviesPresenters = new Map();
  #topMoviesPresenters = new Map();
  #popularMoviesPresenters = new Map();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #moviesShownCount = 0;
  #containerElement = null;
  #moviesModel = null;
  #filterModel = null;
  #moviesIndexesSortedByRate = null;
  #moviesIndexesSortedByComments = null;
  #isLoading = true;
  #sortType = SortType.DEFAULT;

  constructor(containerElement, moviesModel, filterModel){
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#moviesModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#renderComponents();
  };

  get filter () { return this.#filterModel.filter; }

  get movies () {
    const filteredMovies = filterMovies[this.filter](this.#moviesModel.movies);
    return sortMovies[this.#sortType](filteredMovies);
  }

  #viewActionHandler = async (userAction, updateType, update) => {
    switch (userAction){
      case UserAction.UPDATE_MOVIE :
        this.#setMoviePresentersUpdating(update);
        this.#blockInterface();
        try{
          await this.#moviesModel.updateMovie(updateType, update);
        }
        catch(error){
          this.#setMoviePresentersAborting(update);
        }
        finally{
          this.#unblockInterface();
        }
        break;
      case UserAction.EDIT_COMMENTS :
        this.#setMoviePresentersUpdating(update);
        try{
          await this.#moviesModel.updateMovie(updateType, update);
        }
        finally{
          this.#unblockInterface();
        }
        break;
      default:
        throw new Error('Unknown user action!');
    }
  };

  #modelEventHandler = (updateType, update) => {
    switch (updateType){
      case UpdateType.PATCH :
        this.#rerenderMostCommentedSection();
        this.#reinitMoviePresenters(update);
        break;
      case UpdateType.MINOR :
        this.#rerenderComponents();
        break;
      case UpdateType.MAJOR :
        this.#clearComponents();
        this.#renderComponents();
        break;
      case UpdateType.INIT :
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
        break;
      default:
        throw new Error('Unknown update type!');
    }
  };

  #reinitMoviePresenters = (movie) => {
    if(this.#moviesPresenters.has(movie.id)){
      this.#moviesPresenters.get(movie.id).init(movie);
    }
    if(this.#topMoviesPresenters.has(movie.id)){
      this.#topMoviesPresenters.get(movie.id).init(movie);
    }
    if(this.#popularMoviesPresenters.has(movie.id)){
      this.#popularMoviesPresenters.get(movie.id).init(movie);
    }
  };

  #setMoviePresentersUpdating = (movie) => {
    if(this.#moviesPresenters.has(movie.id)){
      this.#moviesPresenters.get(movie.id).setUpdating();
    }
    if(this.#topMoviesPresenters.has(movie.id)){
      this.#topMoviesPresenters.get(movie.id).setUpdating();
    }
    if(this.#popularMoviesPresenters.has(movie.id)){
      this.#popularMoviesPresenters.get(movie.id).setUpdating();
    }
  };

  #setMoviePresentersAborting = (movie) => {
    if(this.#moviesPresenters.has(movie.id)){
      this.#moviesPresenters.get(movie.id).setAborting();
    }
    if(this.#topMoviesPresenters.has(movie.id)){
      this.#topMoviesPresenters.get(movie.id).setAborting();
    }
    if(this.#popularMoviesPresenters.has(movie.id)){
      this.#popularMoviesPresenters.get(movie.id).setAborting();
    }
  };

  #prepareOpeningExtensive = () => {
    this.#moviesPresenters.forEach((presenter) => presenter.collapseExtensive());
    this.#topMoviesPresenters.forEach((presenter) => presenter.collapseExtensive());
    this.#popularMoviesPresenters.forEach((presenter) => presenter.collapseExtensive());
  };

  #renderMovie = (index, container, presenters, isHeader = false) => {
    const movie = this.movies[index];
    const moviePresenter = new MoviePresenter(container, this.#viewActionHandler, this.#prepareOpeningExtensive, this.#toggleInterfaceActivity, this.filter);
    moviePresenter.init(movie, isHeader);
    presenters.set(movie.id, moviePresenter);
  };

  #blockInterface = () => {
    this.#uiBlocker.block();
  };

  #unblockInterface = () => {
    this.#uiBlocker.unblock();
  };

  #toggleInterfaceActivity = (isBlocking) => {
    if(isBlocking){
      this.#blockInterface();
      return;
    }
    this.#unblockInterface();
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
    this.#moviesShownCount += this.#fillGroup(this.#moviesShownCount, MoviesCount.PORTION, this.#mainContentGroupComponent, this.#moviesPresenters);
    if(this.#moviesShownCount === this.movies.length){
      this.#showMoreButtonComponent.hide();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#mainContentGroupComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
  };

  #sortTypeSelectionHandler = (sortType) => {
    if(this.#sortType === sortType){
      return;
    }
    this.#sortType = sortType;
    this.#rerenderComponents();
  };

  #renderSorter = (sortType) => {
    this.#sortType = sortType;
    this.#sorterComponent = new SorterView(this.#sortType);
    this.#sorterComponent.setSortTypeSelectionHandler(this.#sortTypeSelectionHandler);
    render(this.#sorterComponent, this.#containerElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent,this.#containerElement);
  };

  #renderTopRatedSection = () => {
    if(this.movies.length){
      this.#moviesIndexesSortedByRate = this.movies.map(
        (element, index) => ({index, rating : element.filmInfo.totalRating})
      );
      this.#moviesIndexesSortedByRate = this.#moviesIndexesSortedByRate.sort((a, b) => b.rating - a.rating);
      if(this.#moviesIndexesSortedByRate[0].rating === 0){
        this.#topContentGroupComponent.hideCaption();
        return;
      }
      this.#fillGroup(0, MoviesCount.EXTRA_GROUP, this.#topContentGroupComponent, this.#topMoviesPresenters, this.#moviesIndexesSortedByRate);
    }
  };

  #initSortedByCommentsIndexes = () => {
    this.#moviesIndexesSortedByComments = this.movies.map(
      (element, index) => ({index, commentsCount: element.comments.length})
    );
    this.#moviesIndexesSortedByComments = this.#moviesIndexesSortedByComments.sort((a, b) => b.commentsCount - a.commentsCount);
  };

  #renderMostCommentedSection = () => {
    if(this.movies.length){
      this.#initSortedByCommentsIndexes();
      if(this.#moviesIndexesSortedByComments[0].commentsCount === 0){
        this.#popularContentGroupComponent.hideCaption();
        return;
      }
      this.#fillGroup(0, MoviesCount.EXTRA_GROUP, this.#popularContentGroupComponent, this.#popularMoviesPresenters, this.#moviesIndexesSortedByComments);
    }
  };

  #deleteCardViaPresenter = (presenters, movieId) => {
    if(presenters.has(movieId)){
      presenters.get(movieId).destroyComponents();
      presenters.delete(movieId);
    }
  };

  #rerenderMostCommentedSectionMovies = (previousIndexes, currentIndexes) => {
    const LOW_MOVIES_LIMIT = 2;
    const HIGH_METHOD_LIMIT = 2;

    if(this.movies.length < LOW_MOVIES_LIMIT){
      return;
    }

    const currentRenderedIndexes = currentIndexes.slice(0, MoviesCount.EXTRA_GROUP);
    const prevRenderedIndexes = previousIndexes.slice(0, MoviesCount.EXTRA_GROUP);
    const restPreviousRenderedIndexes = prevRenderedIndexes.slice();

    for(const prevElement of prevRenderedIndexes){
      if (!currentRenderedIndexes.some((element) => prevElement.index === element.index )){
        this.#deleteCardViaPresenter(this.#popularMoviesPresenters, this.movies[prevElement.index].id);
        const index = restPreviousRenderedIndexes.indexOf(prevElement);
        restPreviousRenderedIndexes.splice(index, 1);
      }
    }

    if(currentRenderedIndexes.length > HIGH_METHOD_LIMIT){
      throw new Error('Improvements must be done');
    }

    if(restPreviousRenderedIndexes.length === MoviesCount.EXTRA_GROUP){
      if(!this.#popularMoviesPresenters.size){
        for(const currentElement of currentRenderedIndexes){
          this.#renderMovie(currentElement.index, this.#popularContentGroupComponent.filmsContainer, this.#popularMoviesPresenters);
        }
        return;
      }

      if(restPreviousRenderedIndexes[0].index === currentRenderedIndexes[0].index){
        return;
      }
      const firstMovieIndex = restPreviousRenderedIndexes[0].index;
      const secondMovieIndex = restPreviousRenderedIndexes[1].index;
      const isFirstExtansiveOpen = this.#popularMoviesPresenters.get(this.movies[firstMovieIndex].id).isExtensiveOpen;
      const indexToRerender = isFirstExtansiveOpen ? secondMovieIndex : firstMovieIndex;
      this.#deleteCardViaPresenter(this.#popularMoviesPresenters, this.movies[indexToRerender].id);
      this.#renderMovie(indexToRerender, this.#popularContentGroupComponent.filmsContainer, this.#popularMoviesPresenters, isFirstExtansiveOpen);
      return;
    }

    for(const currentElement of currentRenderedIndexes){
      if(!restPreviousRenderedIndexes.some((element) => currentElement.index === element.index)){
        const isHeader =
          restPreviousRenderedIndexes.length && currentElement.commentsCount > restPreviousRenderedIndexes[0].commentsCount;
        this.#renderMovie(currentElement.index, this.#popularContentGroupComponent.filmsContainer, this.#popularMoviesPresenters, isHeader);
      }
    }
  };

  #rerenderMostCommentedSection = () => {
    const previousIndexes = this.#moviesIndexesSortedByComments;
    if(this.movies.length){
      this.#initSortedByCommentsIndexes();
      if(this.#moviesIndexesSortedByComments[0].commentsCount === 0){
        this.#popularContentGroupComponent.hideCaption();
        this.#popularMoviesPresenters.forEach((presenter) => presenter.destroyComponents());
        this.#popularMoviesPresenters.clear();
        return;
      }
      this.#popularContentGroupComponent.revealCaption();
      this.#rerenderMostCommentedSectionMovies(previousIndexes, this.#moviesIndexesSortedByComments);
    }
  };

  #renderComponents = (commonMoviesCount = MoviesCount.PORTION, sortType = SortType.DEFAULT) => {
    if(this.#isLoading){
      this.#renderLoading();
      return;
    }
    this.#mainContentGroupComponent = new ContentGroupView(GroupCaption.MAIN, false, true);
    render(this.#mainContentGroupComponent, this.#contentWrapperComponent.element);
    if(this.movies.length){
      this.#renderSorter(sortType);
      this.#moviesShownCount += this.#fillGroup(0, commonMoviesCount, this.#mainContentGroupComponent, this.#moviesPresenters);
      this.#topContentGroupComponent = new ContentGroupView(GroupCaption.TOP, true);
      this.#popularContentGroupComponent = new ContentGroupView(GroupCaption.POPULAR, true);
      this.#renderTopRatedSection();
      this.#renderMostCommentedSection();
      if(this.movies.length > this.#moviesShownCount){
        this.#renderShowMoreButton();
      }
      render(this.#topContentGroupComponent, this.#contentWrapperComponent.element);
      render(this.#popularContentGroupComponent, this.#contentWrapperComponent.element);
    }
    else{
      const caption = NoMoviesCaption[this.filter];
      this.#mainContentGroupComponent.caption = caption;
      this.#mainContentGroupComponent.revealCaption();
    }
    render(this.#contentWrapperComponent, this.#containerElement);
  };

  #clearComponents = () => {
    this.#moviesPresenters.forEach((presenter) => presenter.destroyComponents());
    this.#moviesPresenters.clear();
    this.#topMoviesPresenters.forEach((presenter) => presenter.destroyComponents());
    this.#topMoviesPresenters.clear();
    this.#popularMoviesPresenters.forEach((presenter) => presenter.destroyComponents());
    this.#popularMoviesPresenters.clear();
    this.#contentWrapperComponent.getEmpty();
    remove(this.#sorterComponent);
    remove(this.#loadingComponent);
    this.#moviesShownCount = 0;
  };

  #rerenderComponents = () => {
    const commonMoviesShownCount = this.#moviesShownCount;
    const savedSortType = this.#sortType;
    this.#clearComponents();
    this.#renderComponents(commonMoviesShownCount, savedSortType);
  };
}
