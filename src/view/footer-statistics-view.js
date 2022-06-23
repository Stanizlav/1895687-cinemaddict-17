import AbstractView from '../framework/view/abstract-view';

const createFooterStatisticsTemlate = (moviesCount) =>
  `<section class="footer__statistics">${moviesCount} movies inside</section>`;

export default class FooterStatisticsView extends AbstractView{
  #moviesCount = 0;

  get template(){
    return createFooterStatisticsTemlate(this.#moviesCount);
  }

  constructor(moviesCount){
    super();
    this.#moviesCount = moviesCount;
  }
}
