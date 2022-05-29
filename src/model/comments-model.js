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

  addComment = (updateType, comment) => {
    const indexLast = this.#comments.length-1;
    const id = this.#comments[indexLast].id + 1;
    this.#comments.push({...comment, id});

    this._notify(updateType, comment);
  };

  removeComment = (updateType, update) => {
    const index = this.#comments.findIndex((movie) => movie.id === update.id);

    if(index === -1){
      throw new Error('There is no corresponding comment to remove');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}
