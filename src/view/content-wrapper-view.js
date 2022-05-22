import AbstractView from '../framework/view/abstract-view.js';

const createContentWrapperTemplate = () => '<section class="films"></section>';

export default class ContentWrapperView extends AbstractView{
  get template(){
    return createContentWrapperTemplate();
  }
}
