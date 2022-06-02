export default class CommentsPresenter{
  #commentsModel = null;
  #moviesModel = null;
  constructor (commentsModel, moviesModel){
    this.#commentsModel = commentsModel;
    this.#moviesModel = moviesModel;
    this.#commentsModel.addObserver(this.#commentsModelEventHandler);

  }

  #commentsModelEventHandler = (updateType, update) => {
    this.#moviesModel.updateMovie(updateType, update);
  };
}
