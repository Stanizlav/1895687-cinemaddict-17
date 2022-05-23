import { render } from '../framework/render.js';
import MoviePresenter from './movie-presenter.js';
import MenuView from '../view/menu-view.js';
import SorterView from '../view/sorter-view.js';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentGroupView from '../view/content-group-view.js';
import ContentWrapperView from '../view/content-wrapper-view.js';

const MOVIES_COUNT_PER_PORTION = 5;
const MOVIES_EXTRA_COUNT = 2;
const MAIN_GROUP_CAPTION = 'All movies. Upcoming';
const EMPTY_MAIN_GROUP_CAPTION = 'There are no movies in our database';
const TOP_GROUP_CAPTION = 'Top rated';
const POPULAR_GROUP_CAPTION = 'Most commented';

export default class MoviesListPresenter{
  #mainContentGroupComponent = new ContentGroupView(MAIN_GROUP_CAPTION, false, true);
  #topContentGroupComponent = new ContentGroupView(TOP_GROUP_CAPTION, true);
  #popularContentGroupComponent = new ContentGroupView(POPULAR_GROUP_CAPTION, true);
  #contentWrapperComponent = new ContentWrapperView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #moviesShownCount = 0;

  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;
  #moviesList = null;
  #commentsList = null;
  #moviesIdListSortedByRate = null;
  #moviesIdListSortedByComments = null;

  constructor(containerElement, moviesModel, commentsModel){
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#moviesList = [...this.#moviesModel.movies];
    this.#commentsList = [...this.#commentsModel.comments];
    this.#initSortedIdLists();
    this.#renderComponents();
  };

  #getRelatedCommentsList = (movie) => this.#commentsList
    .filter((element) => movie.comments.some((id) => id === element.id))
    .sort((a, b) => a.date - b.date);

  #renderMovie = (index, container) => {
    const movie = this.#moviesList[index];
    const relatedCommentsList = this.#getRelatedCommentsList(movie);
    const moviePresenter = new MoviePresenter(container);
    moviePresenter.init(movie, relatedCommentsList);
  };

  #fillGroup = (start, count, contentGroup, maskArray) => {
    const limit = start + count < this.#moviesList.length ?
      start + count :
      this.#moviesList.length;

    for(let i = start; i < limit; i++){
      const index = maskArray ? maskArray[i].index : i;
      this.#renderMovie(index, contentGroup.filmsContainer);
    }
    return limit - start;
  };

  #showMoreButtonClickHandler = () => {
    this.#moviesShownCount += this.#fillGroup(this.#moviesShownCount, MOVIES_COUNT_PER_PORTION, this.#mainContentGroupComponent);
    if(this.#moviesShownCount === this.#moviesList.length){
      this.#showMoreButtonComponent.hide();
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#mainContentGroupComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
  };

  #renderComponents = () => {
    render(new MenuView(), this.#containerElement);
    render(this.#mainContentGroupComponent, this.#contentWrapperComponent.element);
    if(this.#moviesList.length){
      render(new SorterView(),this.#containerElement);
      this.#moviesShownCount += this.#fillGroup(0, MOVIES_COUNT_PER_PORTION, this.#mainContentGroupComponent);
      this.#fillGroup(0, MOVIES_EXTRA_COUNT, this.#topContentGroupComponent, this.#moviesIdListSortedByRate);
      this.#fillGroup(0, MOVIES_EXTRA_COUNT, this.#popularContentGroupComponent, this.#moviesIdListSortedByComments);
      if(this.#moviesList.length > this.#moviesShownCount){
        this.#renderShowMoreButton();
      }
      render(this.#topContentGroupComponent, this.#contentWrapperComponent.element);
      render(this.#popularContentGroupComponent, this.#contentWrapperComponent.element);
    }
    else{
      this.#mainContentGroupComponent.caption = EMPTY_MAIN_GROUP_CAPTION;
      this.#mainContentGroupComponent.revealCaption();
    }
    render(this.#contentWrapperComponent, this.#containerElement);
  };

  #initSortedIdLists = () => {
    if(this.#moviesList.length){
      this.#moviesIdListSortedByRate = this.#moviesList.map(
        (element, index) => ({index, rating : element.filmInfo.totalRating})
      );
      this.#moviesIdListSortedByRate = this.#moviesIdListSortedByRate.sort((a, b) => b.rating - a.rating);

      this.#moviesIdListSortedByComments = this.#moviesList.map(
        (element, index) => ({index, commentsCount: element.comments.length})
      );
      this.#moviesIdListSortedByComments = this.#moviesIdListSortedByComments.sort((a, b) => b.commentsCount - a.commentsCount);
    }
  };
}
