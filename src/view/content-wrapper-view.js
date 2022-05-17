import { createElement } from '../render.js';

const createContentWrapperTemplate = () => '<section class="films"></section>';

export default class ContentWrapperView{
  #element = null;

  get template(){
    return createContentWrapperTemplate();
  }

  get element(){
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
