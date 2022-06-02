import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comment.js';
import { UpdateType } from '../utils/constant-utils.js';

const COMMENTS_COUNT = 50;

export default class CommentsModel extends Observable{
  #comments = Array.from({ length: COMMENTS_COUNT }, generateComment);

  get comments () { return this.#comments; }
  set comments (newComments) {
    this.#comments = [...newComments];
    this._notify(UpdateType.MINOR);
  }

  addComment = (updateType, comment, movie) => {
    const indexLast = this.#comments.length-1;
    const id = this.#comments[indexLast].id + 1;
    this.#comments.push({...comment, id});
    const updatedMovie = { ...movie, comments: [...movie.comments, id] };
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


