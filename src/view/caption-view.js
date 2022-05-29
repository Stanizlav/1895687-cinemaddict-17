import AbstractView from '../framework/view/abstract-view.js';
import { StyleClass } from '../utils/constant-utils.js';

const createCaptionTemplate = (text, isHidden) =>
  `<h2 class="films-list__title ${ isHidden ? StyleClass.HIDDEN : '' }">${text}</h2>`;

export default class CaptionView extends AbstractView{
  #text = null;
  #hidden = false;

  constructor(text, isHidden){
    super();
    this.#text = text;
    this.#hidden = isHidden;
  }

  get template(){
    return createCaptionTemplate(this.#text, this.#hidden);
  }

  get text() { return this.#text; }
  set text(value) {
    this.#text = value;
    this.element.textContent = value;
  }

  hide = () => {
    this.#hidden = true;
    this.element.classList.add(StyleClass.HIDDEN);
  };

  reveal = () => {
    this.#hidden = false;
    this.element.classList.remove(StyleClass.HIDDEN);
  };
}
