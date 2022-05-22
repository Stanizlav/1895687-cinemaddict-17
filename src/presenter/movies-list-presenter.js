import { render } from '../framework/render.js';
import MenuView from '../view/menu-view.js';
import SorterView from '../view/sorter-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentGroupView from '../view/content-group-view.js';
import ContentWrapperView from '../view/content-wrapper-view.js';
import FilmInfoView from '../view/film-info-view.js';

const MOVIES_COUNT = 5;
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

  #renderFilmCard(movie, container){
    const filmCardComponent = new FilmCardView(movie);
    const linkClickHandler = () => {
      this.#renderFilmInfo(movie, container);
    };
    filmCardComponent.setLinkClickHandler(linkClickHandler);
    render(filmCardComponent, container);
  }

  #renderFilmInfo(movie){
    const filteredCommentsList = this.#commentsList
      .filter((element) => movie.comments.some((id) => id === element.id))
      .sort((a, b) => a.date - b.date);

    const filmInfoComponent = new FilmInfoView(movie, filteredCommentsList);
    const ADDED_CLASS = 'hide-overflow';

    const keyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        collapse();
      }
    };

    function collapse(){
      filmInfoComponent.element.remove();
      document.body.classList.remove(ADDED_CLASS);
      document.removeEventListener('keydown', keyDownHandler);
    }

    const closeButtonClickHandler = () => collapse();

    filmInfoComponent.setCloseButtonClickHandler(closeButtonClickHandler);

    document.body.append(filmInfoComponent.element);
    document.body.classList.add(ADDED_CLASS);
    document.addEventListener('keydown', keyDownHandler);
  }

  #fillGroup(start, count, contentGroup, maskArray){
    const limit = start + count < this.#moviesList.length ?
      start + count :
      this.#moviesList.length;

    for(let i = start; i < limit; i++){
      const index = maskArray ? maskArray[i].index : i;
      const movie = this.#moviesList[index];
      this.#renderFilmCard(movie, contentGroup.filmsContainer);
    }
    return limit - start;
  }

  #renderShowMoreButton(){
    const showMoreButtonClickingHandler = () => {
      this.#moviesShownCount += this.#fillGroup(this.#moviesShownCount, MOVIES_COUNT, this.#mainContentGroupComponent);
      if(this.#moviesShownCount === this.#moviesList.length){
        this.#showMoreButtonComponent.hide();
      }
    };
    render(this.#showMoreButtonComponent, this.#mainContentGroupComponent.element);
    this.#showMoreButtonComponent.setClickHandler(showMoreButtonClickingHandler);
  }

  #renderComponents(){

    render(new MenuView(), this.#containerElement);
    render(this.#mainContentGroupComponent, this.#contentWrapperComponent.element);
    if(this.#moviesList.length){
      render(new SorterView(),this.#containerElement);
      this.#moviesShownCount += this.#fillGroup(0, MOVIES_COUNT, this.#mainContentGroupComponent);
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
  }

  init(containerElement, moviesModel, commentsModel) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#moviesList = [...this.#moviesModel.movies];
    this.#commentsList = [...this.#commentsModel.comments];
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
    this.#renderComponents();
  }
}
