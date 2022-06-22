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

  addComment = async (updateType, comment, movie) => {
    try{
      const response = await this.#commentsApiService.addComment(comment);
      const updatedMovie = {
        ... movie,
        comments: [...response.movie.comments]
      };
      this.#comments = response.comments;
      this._notify(updateType, updatedMovie);
    }
    catch(error){
      throw new Error('Can\'t add the comment');
    }
  };

  removeComment = async (updateType, commentId, movie) => {
    try{
      await this.#commentsApiService.deleteComment(commentId);
      const index = this.#comments.findIndex((comment) => Number(comment.id) === commentId);
      if(index === -1){
        throw new Error('There is no corresponding comment to remove');
      }
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];
      const updatedMovie = this.#getTheCommentFreeMovie(movie, commentId);
      this._notify(updateType, updatedMovie);
    }
    catch(error){
      throw new Error('Can\'t delete the comment');
    }
  };

  #getTheCommentFreeMovie = (movie, commentId) => {
    const index = movie.comments.findIndex((id) => Number(id) === commentId);
    if(index === -1){
      throw new Error('There is no corresponding comment\'s id  to remove');
    }
    const comments = [
      ...movie.comments.slice(0, index),
      ...movie.comments.slice(index+1)
    ];
    return {...movie, comments};
  };
}


