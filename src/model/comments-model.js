import Observable from '../framework/observable.js';
import CommentsApiService from '../services/comments-api-service.js';
import { AUTHORIZATION, END_POINT, UpdateType } from '../utils/constant-utils.js';

export default class CommentsModel extends Observable{
  #comments = [];
  #commentsApiService = null;

  constructor(movieId){
    super();
    this.#commentsApiService = new CommentsApiService(END_POINT, AUTHORIZATION, movieId);
  }

  get comments () { return this.#comments; }
  set comments (newComments) {
    this.#comments = [...newComments];
    this._notify(UpdateType.MINOR);
  }

  init = async () => {
    try{
      const comments = await this.#commentsApiService.comments;
      this.#comments = comments.slice();
    }
    catch(error){
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  };

  addComment = (updateType, comment, movie) => {

    const updatedMovie = { ...movie, comments: [...movie.comments, ] };
    this._notify(updateType, updatedMovie);
  };

  removeComment = (updateType, id, movie) => {
    const index = this.#comments.findIndex((comment) => comment.id === id);

    if(index === -1){
      throw new Error('There is no corresponding comment to remove');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, this.#getTheCommentFreeMovie(movie, id));
  };

  #getTheCommentFreeMovie = (movie, commentId) => {
    const index = movie.comments.findIndex((id) => id === commentId);
    if(index === -1){
      throw new Error('There is no corresponding comment to remove');
    }
    const comments = [
      ...movie.comments.slice(0, index),
      ...movie.comments.slice(index+1)
    ];
    return {...movie, comments};
  };
}


