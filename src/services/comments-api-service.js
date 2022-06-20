import ApiService from '../framework/api-service';
import { Method } from '../utils/constant-utils';

export default class CommentsApiService extends ApiService{
  #movieId = null;

  constructor(endPoint, authorization, movieId){
    super(endPoint, authorization);
    this.#movieId = movieId;
  }

  get comments(){
    return this._load({url: `/comments/${this.#movieId}`}).then(ApiService.parseResponse);
  }

  addComment = async (localComment) => {
    const response = await this._load({
      url : `comments/${this.#movieId}`,
      method : Method.POST,
      body: JSON.stringify(localComment),
      headers: new Headers({'Content-Type' : 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  deleteComment = async (commentId) => {
    const response = await this._load({
      url : `comments/${commentId}`,
      method : Method.DELETE
    });

    return response;
  };

}
