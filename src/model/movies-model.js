import Observable from '../framework/observable';
import { UpdateType } from '../utils/constant-utils';

export default class MoviesModel extends Observable{
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService){
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies () { return this.#movies; }

  init = async () => {
    try{
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
      this._notify(UpdateType.INIT);
    }
    catch(error){
      this.#movies = [];
      this._notify(UpdateType.FAILURE, error);
    }
  };

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if(index === -1){
      throw new Error('There is no corresponding movie to update');
    }

    try{
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);

      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1)
      ];

      this._notify(updateType, updatedMovie);
    }
    catch(error){
      throw new Error('Can\'t update movie');
    }
  };

  #adaptToClient = (movie) => {
    const adaptedMovie = {
      ...movie,
      filmInfo : {
        ...movie['film_info'],
        ageRating : movie['film_info']['age_rating'],
        alternativeTitle : movie['film_info']['alternative_title'],
        totalRating : movie['film_info']['total_rating'],
        release:{
          date: new Date (movie['film_info'].release.date),
          releaseCountry : movie['film_info'].release['release_country']
        }
      },
      userDetails : {
        ...movie['user_details'],
        alreadyWatched : movie['user_details']['already_watched'],
        watchingDate : movie['user_details']['watching_date']
      }
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo['total_rating'];
    delete adaptedMovie.filmInfo.release['release_country'];
    delete adaptedMovie['user_details'];
    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie.userDetails['watching_date'];

    return adaptedMovie;
  };

}
