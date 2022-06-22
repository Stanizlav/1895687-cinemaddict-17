import AbstractView from '../framework/view/abstract-view';

const createContentWrapperTemplate = () => '<section class="films"></section>';

export default class ContentWrapperView extends AbstractView{
  get template(){
    return createContentWrapperTemplate();
  }

  getEmpty = () => {
    this.element.innerHTML = '';
  };
}
