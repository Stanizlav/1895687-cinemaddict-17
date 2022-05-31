import { remove, render, replace } from '../framework/render.js';
import { FilterType } from '../utils/constant-utils.js';
import { filter } from '../utils/filter-utils.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filterComponent = null;
  #containerElement = null;
  #filterModel = null;
  #moviesModel = null;

  constructor(container, filterModel, moviesModel){
    this.#containerElement = container;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#filterModel.addObserver(this.#filterModelEventHandler);
    this.#moviesModel.addObserver(this.#filterModelEventHandler);
  }

  init = () => {
    const previousFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(this.filters, this.#filterModel.filter);
    this.#filterComponent.setFilterChooseHandler(this.#viewActionHandler);
    if(previousFilterComponent === null){
      render(this.#filterComponent, this.#containerElement);
      return;
    }
    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  };

  get filters () {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length
      }
    ];
  }

  #viewActionHandler = (filterType) => {
    if(this.#filterModel.filter !== filterType){
      this.#filterModel.filter = filterType;
    }
  };

  #filterModelEventHandler = () => {
    this.init();
  };
}
