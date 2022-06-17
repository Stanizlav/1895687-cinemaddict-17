import ApiService from '../framework/api-service';

export default class CommentsApiService extends ApiService{
  #movieId = null;

  constructor(endPoint, authorization, movieId){
    super(endPoint, authorization);
    this.#movieId = movieId;
  }

  get comments(){
    return this._load({url: `/comments/${this.#movieId}`}).then(ApiService.parseResponse);
  }

}
