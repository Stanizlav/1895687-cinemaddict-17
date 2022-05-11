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
  mainContentGroup = new ContentGroupView(MAIN_GROUP_CAPTION, false, true);
  topContentGroup = new ContentGroupView(TOP_GROUP_CAPTION, true);
  popularContentGroup = new ContentGroupView(POPULAR_GROUP_CAPTION, true);
  contentWrapper = new ContentWrapperView();

  fillGroupUpAndWrap(count, contentGroup, maskArray){
    this.filmsContainerElement = new FilmsContainerView();
    for(let i = 0; i < count && i < this.moviesList.length; i++){
      const index = maskArray ? maskArray[i].index : i;
      render(new FilmCardView(this.moviesList[index]), this.filmsContainerElement.getElement());
    }
    render(this.filmsContainerElement, contentGroup.getElement());
    render(contentGroup, this.contentWrapper.getElement());
    this.filmsContainerElement = null;
  }

  init(containerElement, moviesModel, commentsModel) {
    this.containerElement = containerElement;
    this.moviesModel = moviesModel;
    this.commentsModel = commentsModel;
    this.moviesList = [...this.moviesModel.movies];
    this.commentsList = [...this.commentsModel.comments];

    this.listIdSortedByRate = this.moviesList.map(
      (element, index) => ({index, rating : element.filmInfo.totalRating})
    );
    this.listIdSortedByRate = this.listIdSortedByRate.sort((a, b) => b.rating - a.rating);

    this.listIdSortedByComments = this.moviesList.map(
      (element, index) => ({index, commentsCount: element.comments.length})
    );
    this.listIdSortedByComments = this.listIdSortedByComments.sort((a, b) => b.commentsCount - a.commentsCount);

    render(new MenuView(), this.containerElement);
    render(new SorterView(),this.containerElement);

    this.fillGroupUpAndWrap(MOVIES_COUNT, this.mainContentGroup);
    render(new ShowMoreButtonView(), this.mainContentGroup.getElement());

    this.fillGroupUpAndWrap(MOVIES_EXTRA_COUNT, this.topContentGroup, this.listIdSortedByRate);
    this.fillGroupUpAndWrap(MOVIES_EXTRA_COUNT, this.popularContentGroup, this.listIdSortedByComments);

    render(this.contentWrapper, this.containerElement);
    const movie = this.moviesList[0];
    const filteredCommentsList = this.commentsList
      .filter((element) => movie.comments.some((id) => id === element.id))
      .sort((a, b) => a.date - b.date);

    render(new FilmInfoView(movie, filteredCommentsList), this.containerElement);
  }
}
