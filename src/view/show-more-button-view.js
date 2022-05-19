import { createElement } from '../render.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';
const CLASS_HIDDEN = 'visually-hidden';

export default class ShowMoreButtonView {
  #element = null;

  get template(){
    return createShowMoreButtonTemplate();
  }

  get element(){
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  hide(){
    this.#element.classList.add(CLASS_HIDDEN);
  }

  removeElement(){
    this.#element = null;
  }
}
