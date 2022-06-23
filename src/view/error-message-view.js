import AbstractView from '../framework/view/abstract-view';

const createErrorMessageTemlate = (message) =>
  `<section class="films">
    <section class="films-list">
      <h1 class="films-list__title">${message}</h1>
    </section>
  </section>`;

export default class ErrorMessageView extends AbstractView{
  #message = '';

  constructor(message){
    super();
    this.#message = message;
  }

  get template() {
    return createErrorMessageTemlate(this.#message);
  }
}
