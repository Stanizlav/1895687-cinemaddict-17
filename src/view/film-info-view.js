import { convertDuration, getCommentDate, getFormatedDate, getHumanisedDate } from '../utils/date-utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { EmotionType, ShownInfo } from '../utils/constant-utils';
import he from 'he';

const createGenreTemplate = (genre) => `<span class="film-details__genre">${ genre }</span>`;

const getActivityClass = (flag) => flag ? 'film-details__control-button--active' : '';

const getCheckedAttribute = (setEmotion, examinedEmotion) => setEmotion === examinedEmotion ? 'checked' : '';

const createEmojiTemplate = (emotion) => emotion ?
  `<img src="images/emoji/${ emotion }.png" alt="emoji-${ emotion }" width="55" height="55">` : '';

const createCommentTemplate = (commentObject, inabilityAttribute, isDeleting, deletableCommentId) => {

  const { id, author, comment, date, emotion } = commentObject;
  const formatedDate = getCommentDate(date);
  const humanisedDate = getHumanisedDate(date);
  const emoji = createEmojiTemplate(emotion);
  const buttonText = isDeleting && Number(id) === deletableCommentId ? ShownInfo.DELETING : ShownInfo.DELETE;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">${ emoji }</span>
      <div>
        <p class="film-details__comment-text">${ he.encode(comment) }</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${ author }</span>
          <span class="film-details__comment-day">${ formatedDate } ( ${ humanisedDate } )</span>
          <button id="${ id }" type="button" ${ inabilityAttribute } class="film-details__comment-delete">${ buttonText }</button>
        </p>
      </div>
    </li>`
  );
};

const createFilmInfoTemplate = (state) => {

  const {movie, commentsList, setEmotion, typedComment, isDisabled, isDeleting, deletableCommentId, isUploading} = state;
  const { comments, filmInfo, userDetails } = movie;
  const  {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description
  } = filmInfo;
  const { date, releaseCountry } = release;

  const newCommentText = isUploading ? ShownInfo.SAVING : typedComment;
  const writersList = writers.join(', ');
  const actorsList = actors.join(', ');
  const releaseDate = getFormatedDate(date);
  const duration = convertDuration(runtime);
  const genresTitle = genre.length > 1 ? 'Genres' : 'Genre';
  const genresContent = genre.map((element) => createGenreTemplate(element)).join('');
  const inabilityAttribute = isDisabled ? 'disabled': '';
  const commentsContent = commentsList.map((element) => createCommentTemplate(element, inabilityAttribute, isDeleting, deletableCommentId)).join('');
  const { watchlist, alreadyWatched, favorite } = userDetails;
  const emoji = createEmojiTemplate(setEmotion);


  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button" ${ inabilityAttribute }>close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${ poster }" alt="">

              <p class="film-details__age">${ ageRating }+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${ title }</h3>
                  <p class="film-details__title-original">Original: ${ alternativeTitle }</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${ totalRating }</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${ director }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${ writersList }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${ actorsList }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${ releaseDate }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${ duration }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${ releaseCountry }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${ genresTitle }</td>
                  <td class="film-details__cell">
                    ${ genresContent }
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${ description }
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${ getActivityClass(watchlist) } film-details__control-button--watchlist" id="watchlist" name="watchlist" ${inabilityAttribute}>Add to watchlist</button>
            <button type="button" class="film-details__control-button ${ getActivityClass(alreadyWatched) } film-details__control-button--watched" id="watched" name="watched" ${inabilityAttribute}>Already watched</button>
            <button type="button" class="film-details__control-button ${ getActivityClass(favorite) } film-details__control-button--favorite" id="favorite" name="favorite" ${inabilityAttribute}>Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ comments.length }</span></h3>

            <ul class="film-details__comments-list">
            ${ commentsContent }
            </ul>

            <div class="film-details__new-comment" ${ inabilityAttribute }>
              <div class="film-details__add-emoji-label">${ emoji }</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" ${ inabilityAttribute } placeholder="Select reaction below and write comment here" name="comment">${ newCommentText }</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" ${ inabilityAttribute } value="smile" ${ getCheckedAttribute(setEmotion, EmotionType.SMILE) }>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" ${ inabilityAttribute } value="sleeping" ${ getCheckedAttribute(setEmotion, EmotionType.SLEEPING) }>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" ${ inabilityAttribute } value="puke" ${ getCheckedAttribute(setEmotion, EmotionType.PUKE) }>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" ${ inabilityAttribute } value="angry" ${ getCheckedAttribute(setEmotion, EmotionType.ANGRY) }>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
        <button type="submit" class = "visually-hidden" ${ inabilityAttribute }></button>
      </form>
    </section>`
  );
};
export default class FilmInfoView extends AbstractStatefulView{

  static convertDataToState = (movie, commentsList) => ({
    movie,
    commentsList,
    setEmotion:'',
    typedComment:'',
    isDisabled: false,
    isDeleting: false,
    isUploading: false
  });

  static convertStateToData = (state) => ({
    movie: { ...state.movie },
    comment: {
      comment: state.typedComment,
      emotion: state.setEmotion
    }
  });


  constructor(movie, commentsList){
    super();
    this._state = FilmInfoView.convertDataToState(movie, commentsList);
    this.#setInnerHandlers();
  }

  //#region getters and setters

  get template(){
    return createFilmInfoTemplate(this._state);
  }

  get closeButton(){
    return this.element.querySelector('.film-details__close-btn');
  }

  get addToWatchlistButton() {
    return this.element.querySelector('.film-details__control-button--watchlist');
  }

  get alreadyWatchedButton() {
    return this.element.querySelector('.film-details__control-button--watched');
  }

  get addToFavoritesButton() {
    return this.element.querySelector('.film-details__control-button--favorite');
  }

  get emojiList() {
    return this.element.querySelector('.film-details__emoji-list');
  }

  get commentTextArea() {
    return this.element.querySelector('textarea.film-details__comment-input');
  }

  get form() { return this.element.querySelector('form'); }

  get scrollOffset() { return this.element.scrollTop; }
  set scrollOffset(value) { this.element.scrollTop = value; }

  get isOpen() { return this.element.parentElement !== null; }

  //#endregion

  resetComponent = (movie, commentsList) => this.updateElement(FilmInfoView.convertDataToState(movie, commentsList));

  shakeForm = (callback) => {
    this.shakeElement(this.form, callback);
  };

  shakeComment = (commentId, callback) => {
    const button = this.element.querySelector(`button[id="${commentId}"]`);
    const comment = button.closest('li');
    this.shakeElement(comment, callback);
  };

  shakeControlButtons = (callback) => {
    const buttonsBlock = this.element.querySelector('.film-details__controls');
    this.shakeElement(buttonsBlock, callback);
  };

  submitForm = () => {
    this.element.querySelector('button[type="submit"]').click();
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.form.addEventListener('submit', this.#submitHandler);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(FilmInfoView.convertStateToData(this._state));
  };

  setCommentsDeleteClickHandler = (callback) => {
    this._callback.commentDelete = callback;
    this.#setEachCommentDeleteClickHandler();
  };

  #setEachCommentDeleteClickHandler = () => {
    const deleteButtons = this.element.querySelectorAll('.film-details__comment-delete');
    deleteButtons.forEach((button)=>button.addEventListener('click', this.#commentDeleteClickHandler));
  };

  #commentDeleteClickHandler = (evt) => {
    const commentData = {
      commentId: Number(evt.target.id),
      movie: this._state.movie
    };
    this._callback.commentDelete(commentData);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.closeButton.addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = () => {
    this._callback.closeButtonClick();
  };

  setAddToWatchlistClickHandler = (callback) => {
    this._callback.clickAddToWatchlist = callback;
    this.addToWatchlistButton.addEventListener('click', this.#addToWatchlistClickHandler);
  };

  #addToWatchlistClickHandler = () => {
    this._callback.clickAddToWatchlist();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.clickAlreadyWatched = callback;
    this.alreadyWatchedButton.addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = () => {
    this._callback.clickAlreadyWatched();
  };

  setAddToFavoritesClickHandler = (callback) => {
    this._callback.clickAddToFavorites = callback;
    this.addToFavoritesButton.addEventListener('click', this.#addToFavoritesClickHandler);
  };

  #addToFavoritesClickHandler = () => {
    this._callback.clickAddToFavorites();
  };

  #getElementUpdated = (update) => {
    const scrollOffset = this.scrollOffset;
    this.updateElement(update);
    this.scrollOffset = scrollOffset;
  };

  #emojiClickHandler = (evt) => {
    if(evt.target.matches('input[type=radio]')){
      const setEmotion = evt.target.value;
      this.#getElementUpdated({ ...this._state, setEmotion});
      evt.stopPropagation();
    }
  };

  #setEmojiClickHandler = () => this.emojiList.addEventListener('click', this.#emojiClickHandler);

  #commentTextInputHandler = (evt) => {
    const typedComment = evt.target.value;
    this._setState({...this._state, typedComment});
  };

  #setCommentTextInputHandler = () => this.commentTextArea.addEventListener('input', this.#commentTextInputHandler);

  #setOuterHandlers = () => {
    this.closeButton.addEventListener('click', this.#closeButtonClickHandler);
    this.addToWatchlistButton.addEventListener('click', this.#addToWatchlistClickHandler);
    this.alreadyWatchedButton.addEventListener('click', this.#alreadyWatchedClickHandler);
    this.addToFavoritesButton.addEventListener('click', this.#addToFavoritesClickHandler);
    this.#setEachCommentDeleteClickHandler();
    this.form.addEventListener('submit', this.#submitHandler);
  };

  #setInnerHandlers = () => {
    this.#setEmojiClickHandler();
    this.#setCommentTextInputHandler();
  };

  _restoreHandlers = () => {
    this.#setOuterHandlers();
    this.#setInnerHandlers();
  };

}
