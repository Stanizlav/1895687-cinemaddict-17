import { remove, render, replace } from '../framework/render';
import { FilterType, ProfileStatus, ProfileStatusLimit } from '../utils/constant-utils';
import { filterMovies } from '../utils/filter-utils';
import ProfileView from '../view/profile-view';

export default class ProfilePresenter{
  #containerElement = null;
  #moviesModel = null;
  #profileComponent = null;
  #status = ProfileStatus.NOBODY;

  constructor (container, moviesModel){
    this.#containerElement = container;
    this.#moviesModel = moviesModel;
    this.#moviesModel.addObserver(this.#moviesModelEventHandler);

  }

  init = () => {
    const previousProfileComponent = this.#profileComponent;
    const movies = this.#moviesModel.movies;
    const filmsWatchedCount = filterMovies[FilterType.HISTORY](movies).length;
    this.#status = this.#getProfileStatus(filmsWatchedCount);

    this.#profileComponent = new ProfileView(this.#status);
    if(previousProfileComponent === null){
      render(this.#profileComponent, this.#containerElement);
      return;
    }
    replace(this.#profileComponent, previousProfileComponent);
    remove(previousProfileComponent);
  };

  #getProfileStatus = (filmsWatchedCount) => {
    if(filmsWatchedCount < ProfileStatusLimit.NOBODY){
      return ProfileStatus.NOBODY;
    }
    if(filmsWatchedCount < ProfileStatusLimit.NOVICE){
      return ProfileStatus.NOVICE;
    }
    if(filmsWatchedCount < ProfileStatusLimit.FAN){
      return ProfileStatus.FAN;
    }
    return ProfileStatus.MOVIE_BUFF;
  };

  #moviesModelEventHandler = () => {
    this.init();
  };
}
