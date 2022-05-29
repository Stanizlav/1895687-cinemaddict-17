import AbstractView from '../framework/view/abstract-view.js';
import { StyleClass } from '../utils/constant-utils.js';

const createSorterTemplate = () =>
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;

export default class SorterView extends AbstractView{
  get template(){
    return createSorterTemplate();
  }

  hide = () => {
    this.element.classList.add(StyleClass.HIDDEN);
  };

  reveal = () => {
    this.element.classList.remove(StyleClass.HIDDEN);
  };
}
