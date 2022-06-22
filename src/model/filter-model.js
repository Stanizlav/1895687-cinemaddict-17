import Observable from '../framework/observable';
import { FilterType, UpdateType } from '../utils/constant-utils';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter () { return this.#filter; }
  set filter (value){
    this.#filter = value;
    this._notify(UpdateType.MAJOR);
  }
}
