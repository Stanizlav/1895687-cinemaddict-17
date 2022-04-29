import { createElement } from '../render.js';

const CLASS_HIDDEN = ' visually-hidden';
const CLASS_EXTRA = ' films-list--extra';

const createContentGroupTemplate = (isExtra) =>
  `<section class="films-list${ isExtra ? CLASS_EXTRA : '' }"></section>`;

const createCaption = (text, isHidden) =>
  `<h2 class="films-list__title${ isHidden ? CLASS_HIDDEN : '' }">${text}</h2>`;

export default class ContentGroupView {
  getTemplate = () => createContentGroupTemplate();

  constructor(caption, isExtra, isCaptionHidden){
    this.element = createElement(createContentGroupTemplate(isExtra));
    this.caption = createElement(createCaption(caption, isCaptionHidden));
    this.element.prepend(this.caption);
  }

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
