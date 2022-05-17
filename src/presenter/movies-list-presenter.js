import { render } from '../render.js';
import MenuView from '../view/menu-view.js';
import SorterView from '../view/sorter-view.js';
import FilmsContainerView from '../view/films-container-view';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentGroupView from '../view/content-group-view.js';
import ContentWrapperView from '../view/content-wrapper-view.js';
import FilmInfoView from '../view/film-info-view.js';

const MOVIES_COUNT = 5;
const MOVIES_EXTRA_COUNT = 2;
const MAIN_GROUP_CAPTION = 'All movies. Upcoming';
const TOP_GROUP_CAPTION = 'Top rated';
const POPULAR_GROUP_CAPTION = 'Most commented';

export default class MoviesListPresenter{
  #mainContentGroup = new ContentGroupView(MAIN_GROUP_CAPTION, false, true);
  #topContentGroup = new ContentGroupView(TOP_GROUP_CAPTION, true);
  #popularContentGroup = new ContentGroupView(POPULAR_GROUP_CAPTION, true);
  #contentWrapper = new ContentWrapperView();

  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;
  #moviesList = null;
  #commentsList = null;
  #moviesIdListSortedByRate = null;
  #moviesIdListSortedByComments = null;
  #filmsContainerElement = null;

  #renderFilmCard(movie, container){
    const filmCardComponent = new FilmCardView(movie);
    const linkClickingHandler = () => {
      this.#renderFilmInfo(movie, container);
    };
    filmCardComponent.link.addEventListener('click', linkClickingHandler);
    render(filmCardComponent, container);
  }

  #renderFilmInfo(movie){
    const filteredCommentsList = this.#commentsList
      .filter((element) => movie.comments.some((id) => id === element.id))
      .sort((a, b) => a.date - b.date);

    const filmInfoComponent = new FilmInfoView(movie, filteredCommentsList);
    const addedClass = 'hide-overflow';

    const keyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        collapse();
      }
    };

    function collapse(){
      filmInfoComponent.removeElement();
      document.body.classList.remove(addedClass);
      document.removeEventListener('keydown', keyDownHandler);
    }

    const closeButtonClickingHandler = () => collapse();

    filmInfoComponent.closeButton.addEventListener('click', closeButtonClickingHandler);

    document.body.append(filmInfoComponent.element);
    document.body.classList.add(addedClass);
    document.addEventListener('keydown', keyDownHandler);
  }

  #fillGroupUpAndWrap(count, contentGroup, maskArray){
    this.#filmsContainerElement = new FilmsContainerView();
    const limit = count < this.#moviesList.length ? count : this.#moviesList.length;
    for(let i = 0; i < limit; i++){
      const index = maskArray ? maskArray[i].index : i;
      const movie = this.#moviesList[index];
      this.#renderFilmCard(movie, this.#filmsContainerElement.element);
    }
    render(this.#filmsContainerElement, contentGroup.element);
    render(contentGroup, this.#contentWrapper.element);
    this.#filmsContainerElement = null;
  }

  init(containerElement, moviesModel, commentsModel) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#moviesList = [...this.#moviesModel.movies];
    this.#commentsList = [...this.#commentsModel.comments];

    this.#moviesIdListSortedByRate = this.#moviesList.map(
      (element, index) => ({index, rating : element.filmInfo.totalRating})
    );
    this.#moviesIdListSortedByRate = this.#moviesIdListSortedByRate.sort((a, b) => b.rating - a.rating);

    this.#moviesIdListSortedByComments = this.#moviesList.map(
      (element, index) => ({index, commentsCount: element.comments.length})
    );
    this.#moviesIdListSortedByComments = this.#moviesIdListSortedByComments.sort((a, b) => b.commentsCount - a.commentsCount);

    render(new MenuView(), this.#containerElement);
    render(new SorterView(),this.#containerElement);

    this.#fillGroupUpAndWrap(MOVIES_COUNT, this.#mainContentGroup);
    render(new ShowMoreButtonView(), this.#mainContentGroup.element);

    this.#fillGroupUpAndWrap(MOVIES_EXTRA_COUNT, this.#topContentGroup, this.#moviesIdListSortedByRate);
    this.#fillGroupUpAndWrap(MOVIES_EXTRA_COUNT, this.#popularContentGroup, this.#moviesIdListSortedByComments);

    render(this.#contentWrapper, this.#containerElement);
  }
}
