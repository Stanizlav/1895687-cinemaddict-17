import { createElement } from '../render.js';
import FilmsContainerView from './films-container-view.js';

const CLASS_HIDDEN = 'visually-hidden';
const CLASS_EXTRA = 'films-list--extra';

const createContentGroupTemplate = (isExtra) =>
  `<section class="films-list ${ isExtra ? CLASS_EXTRA : '' }"></section>`;

const createCaption = (text, isHidden) =>
  `<h2 class="films-list__title ${ isHidden ? CLASS_HIDDEN : '' }">${text}</h2>`;

export default class ContentGroupView {
  #element = null;
  #captionElement = null;
  #filmsContainerComponent = null;

  get template(){
    return createContentGroupTemplate();
  }

  constructor(caption, isExtra, isCaptionHidden){
    this.#element = createElement(createContentGroupTemplate(isExtra));
    this.#captionElement = createElement(createCaption(caption, isCaptionHidden));
    this.#element.prepend(this.#captionElement);
    this.#filmsContainerComponent = new FilmsContainerView();
    this.#element.append(this.#filmsContainerComponent.element);
  }

  get element(){
    if(!this.#element){
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get collection(){
    return this.#filmsContainerComponent.element;
  }

  get caption() { return this.#captionElement.textContent; }
  set caption(value) { this.#captionElement.textContent = value; }

  hideCaption(){
    this.#captionElement.classList.add(CLASS_HIDDEN);
  }

  revealCaption(){
    this.#captionElement.classList.remove(CLASS_HIDDEN);
  }

  removeElement(){
    this.#element = null;
  }
}
