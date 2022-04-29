import { createElement } from '../render.js';

const createContentWrapperTemplate = () => '<section class="films"></section>';

export default class ContentWrapperView{
  getTemplate = () => createContentWrapperTemplate();

  getElement = () => {
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  };

  removeElement = () => {
    this.element = null;
  };
}
