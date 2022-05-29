import AbstractView from '../framework/view/abstract-view.js';
import FilmsContainerView from './films-container-view.js';
import CaptionView from './caption-view.js';
import { StyleClass } from '../utils/constant-utils.js';

const createContentGroupTemplate = () => '<section class="films-list"></section>';

export default class ContentGroupView extends AbstractView{
  #captionComponent = null;
  #filmsContainerComponent = null;

  constructor(caption, isExtra, isCaptionHidden){
    super();
    if(isExtra){
      this.element.classList.add(StyleClass.FILMS_LIST_EXTRA);
    }
    this.#captionComponent = new CaptionView(caption, isCaptionHidden);
    this.element.prepend(this.#captionComponent.element);
    this.#filmsContainerComponent = new FilmsContainerView();
    this.element.append(this.#filmsContainerComponent.element);
  }

  get template(){
    return createContentGroupTemplate();
  }

  get filmsContainer(){
    return this.#filmsContainerComponent.element;
  }

  get caption() { return this.#captionComponent.text; }
  set caption(value) { this.#captionComponent.text = value; }

  hideCaption = () => {
    this.#captionComponent.hide();
  };

  revealCaption = () => {
    this.#captionComponent.reveal();
  };
}
