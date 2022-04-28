import { render } from '../render.js';
import MenuView from '../view/menu-view.js';
import SorterView from '../view/sorter-view.js';
import FilmsContainerView from '../view/films-container-view';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentGroupView from '../view/content-group-view.js';
import ContentWrapperView from '../view/content-wrapper-view.js';

const FILMS_COUNT = 5;
const FILMS_EXTRA_COUNT = 2;
const MAIN_GROUP_CAPTION = 'All movies. Upcoming';
const TOP_GROUP_CAPTION = 'Top rated';
const POPULAR_GROUP_CAPTION = 'Most commented';

export default class FilmsListPresenter{
  mainContentGroup = new ContentGroupView(MAIN_GROUP_CAPTION, false, true);
  topContentGroup = new ContentGroupView(TOP_GROUP_CAPTION, true);
  popularContentGroup = new ContentGroupView(POPULAR_GROUP_CAPTION, true);
  contentWrapper = new ContentWrapperView();

  fillGroupUpAndWrap = (count, contentGroup) =>{
    this.filmsContainerElement = new FilmsContainerView();
    for(let i = 0; i < count; i++){
      render(new FilmCardView(), this.filmsContainerElement.getElement());
    }
    render(this.filmsContainerElement, contentGroup.getElement());
    render(contentGroup, this.contentWrapper.getElement());
    this.filmsContainerElement = null;
  };

  init = (containerElement) => {
    this.containerElement = containerElement;

    render(new MenuView(), this.containerElement);
    render(new SorterView(),this.containerElement);

    this.fillGroupUpAndWrap(FILMS_COUNT, this.mainContentGroup);
    render(new ShowMoreButtonView(), this.mainContentGroup.getElement());

    this.fillGroupUpAndWrap(FILMS_EXTRA_COUNT, this.topContentGroup);
    this.fillGroupUpAndWrap(FILMS_EXTRA_COUNT, this.popularContentGroup);

    render(this.contentWrapper, this.containerElement);
  };
}
