import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/constant-utils.js';

const getActivityClass = (setFilter, examinedFilter) =>
  setFilter === examinedFilter ? 'main-navigation__item--active' : '';

const getFilterTypeFromLink = (link) => {
  if(link.includes(FilterType.ALL)){
    return FilterType.ALL;
  }
  if(link.includes(FilterType.FAVORITES)){
    return FilterType.FAVORITES;
  }
  if(link.includes(FilterType.HISTORY)){
    return FilterType.HISTORY;
  }
  if(link.includes(FilterType.WATCHLIST)){
    return FilterType.WATCHLIST;
  }
};

const createFilterItemTemplate =  (filter, currentFilterType) =>
  `<a href="#${filter.name.toLowerCase()}" class="main-navigation__item ${ getActivityClass(currentFilterType, filter.type) }">${ filter.name } <span class="main-navigation__item-count">${ filter.count }</span></a>`;

const createFilterTemplate = (filters, filterType) => {
  const filterItems = filters.map((filter) => createFilterItemTemplate(filter, filterType)).join('');
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${ getActivityClass(filterType, FilterType.ALL) }">All movies</a>
      ${filterItems}
    </nav>`);
};

export default class FilterView extends AbstractView{
  #filters = null;
  #currentFilterType = null;

  constructor(filters, filterType = FilterType.ALL){
    super();
    this.#filters = filters;
    this.#currentFilterType = filterType;
  }

  get template(){
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterSelectionHandler = (callback) => {
    this._callback.filterSelect = callback;
    this.element.addEventListener('click', this.#filterSelectionHandler);
  };

  #filterSelectionHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.matches('a')){
      const chosenFilterType = getFilterTypeFromLink(evt.target.href);
      this._callback.filterSelect(chosenFilterType);
      evt.stopPropagation();
    }
  };
}
