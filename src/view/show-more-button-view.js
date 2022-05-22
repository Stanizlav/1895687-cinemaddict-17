import AbstractView from '../framework/view/abstract-view.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';
const CLASS_HIDDEN = 'visually-hidden';

export default class ShowMoreButtonView extends AbstractView{
  get template(){
    return createShowMoreButtonTemplate();
  }

  hide(){
    this.element.classList.add(CLASS_HIDDEN);
  }
}
