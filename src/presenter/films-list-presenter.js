import { render } from '../render.js';
import MenuView from '../view/menu-view.js';
import SorterView from '../view/sorter-view.js';
import FilmsContainerView from '../view/films-container-view';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view';

const COUNT = 5;

export default class FilmsListPresenter{
  filmsContainerElement = new FilmsContainerView();

  init(containerElement){
    this.containerElement = containerElement;

    render(new MenuView(), this.containerElement);
    render(new SorterView(),this.containerElement);
    render(this.filmsContainerElement, this.containerElement);
    for(let i = 0; i < COUNT; i++){
      render(new FilmCardView(), this.filmsContainerElement.getElement());
    }
    render(new ShowMoreButtonView(), this.containerElement);
  }
}
