import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../utils/constant-utils.js';

const getActivityClass = (selectedType, examinedType) =>
  selectedType === examinedType ? 'sort__button--active' : '';

const getSortTypeFromLink = (link) => {
  if(link.includes(SortType.DEFAULT)){
    return SortType.DEFAULT;
  }
  if(link.includes(SortType.DATE)){
    return SortType.DATE;
  }
  if(link.includes(SortType.RATING)){
    return SortType.RATING;
  }
};

const createSorterTemplate = (sortType) =>
  `<ul class="sort">
    <li><a href="#${ SortType.DEFAULT }" class="sort__button ${ getActivityClass(sortType, SortType.DEFAULT) }">Sort by default</a></li>
    <li><a href="#${ SortType.DATE }" class="sort__button ${ getActivityClass(sortType, SortType.DATE) }">Sort by date</a></li>
    <li><a href="#${ SortType.RATING }" class="sort__button ${ getActivityClass(sortType, SortType.RATING) }">Sort by rating</a></li>
  </ul>`;

export default class SorterView extends AbstractView{
  #sortType = null;

  constructor(sortType = SortType.DEFAULT){
    super();
    this.#sortType = sortType;
  }

  get template(){
    return createSorterTemplate(this.#sortType);
  }

  setSortTypeSelectionHandler = (callback) => {
    this._callback.sortTypeSelect = callback;
    this.element.addEventListener('click', this.#sortTypeSelectionHandler);
  };

  #sortTypeSelectionHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.matches('a')){
      const chosenSortType = getSortTypeFromLink(evt.target.href);
      this._callback.sortTypeSelect(chosenSortType);
      evt.stopPropagation();
    }
  };
}
