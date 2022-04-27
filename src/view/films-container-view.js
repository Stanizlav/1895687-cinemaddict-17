import { createElement } from '../render.js';

const createFilmsContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsContainerView {
  getTemplatee = () => createFilmsContainerTemplate();

  getElement = () => {
    if(!this.element){
      this.element = createElement(this.getTemplatee());
    }
    return this.element;
  };

  removeElement = () => {
    this.element = null;
  };
}
