import { generateComment } from '../mock/comment.js';

const COMMENTS_COUNT = 50;

export default class CommentsModel{
  _comments = Array.from({ length: COMMENTS_COUNT }, generateComment);

  get comments() { return this._comments; }
}
