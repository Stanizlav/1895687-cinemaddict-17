import AbstractView from '../framework/view/abstract-view.js';
import { StyleClass } from '../utils/constant-utils.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstractView{
  get template(){
    return createShowMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click',this.#clickHandler);
  };

  #clickHandler = () =>{
    this._callback.click();
  };

  hide = () => {
    this.element.classList.add(StyleClass.HIDDEN);
  };
}
