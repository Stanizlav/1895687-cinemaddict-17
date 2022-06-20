import ApiService from '../framework/api-service';
import { Method } from '../utils/constant-utils';

export default class MoviesApiService extends ApiService{
  get movies(){
    return this._load({url: 'movies'}).then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url : `movies/${movie.id}`,
      method : Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type' : 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  #adaptToServer = (movie) => {
    const adaptedMovie = {
      ...movie,
      'film_info' : {
        ...movie.filmInfo,
        'age_rating': movie.filmInfo.ageRating,
        'alternative_title' : movie.filmInfo.alternativeTitle,
        'total_rating' : movie.filmInfo.totalRating,
        release:{
          'date' : movie.filmInfo.release.date.toISOString(),
          'release_country' : movie.filmInfo.release.releaseCountry
        }
      },
      'user_details' : {
        ...movie.userDetails,
        'already_watched' : movie.userDetails.alreadyWatched,
        'watching_date' : movie.userDetails.watchingDate
      }
    };

    delete adaptedMovie.filmInfo;
    delete adaptedMovie['film_info'].ageRating;
    delete adaptedMovie['film_info'].alternativeTitle;
    delete adaptedMovie['film_info'].totalRating;
    delete adaptedMovie.userDetails;
    delete adaptedMovie['user_details'].alreadyWatched;
    delete adaptedMovie['user_details'].watchingDate;

    return adaptedMovie;
  };

}
