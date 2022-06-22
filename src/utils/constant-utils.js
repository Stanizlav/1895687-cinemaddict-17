const UpdateType = {
  INIT : 'INIT',
  PATCH : 'PATCH',
  MINOR : 'MINOR',
  MAJOR : 'MAJOR',
  EDIT_COMMENTS : 'EDIT_COMMENTS'
};

const UserAction = {
  UPDATE_MOVIE : 'UPDATE_MOVIE',
  EDIT_COMMENTS : 'EDIT_COMMENTS'
};

const StyleClass = {
  HIDDEN : 'visually-hidden',
  HIDING_SCROLL_CLASS : 'hide-overflow',
  FILMS_LIST_EXTRA : 'films-list--extra'
};

const FilterType = {
  ALL : 'all',
  WATCHLIST : 'watchlist',
  HISTORY : 'history',
  FAVORITES : 'favorites'
};

const NoMoviesCaption = {
  [FilterType.ALL] : 'There are no movies in our database',
  [FilterType.FAVORITES] : 'There are no favorite movies now',
  [FilterType.HISTORY] : 'There are no watched movies now',
  [FilterType.WATCHLIST] : 'There are no movies to watch now'
};

const SortType = {
  DEFAULT : 'default',
  DATE : 'date',
  RATING : 'rating'
};

const EmotionType = {
  SMILE : 'smile',
  SLEEPING : 'sleeping',
  PUKE : 'puke',
  ANGRY: 'angry'
};

const KeyCode = {
  ESC : 27,
  ENTER : 13
};

const Method = {
  PUT : 'PUT',
  GET : 'GET',
  POST : 'POST',
  DELETE : 'DELETE'
};

const ShownInfo = {
  DELETE : 'Delete',
  DELETING : 'Deleting...',
  SAVING : 'Saving...'
};

const ProfileStatus = {
  NOBODY: 'Nobody',
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff'
};

const ProfileStatusLimit = {
  NOBODY: 1,
  NOVICE: 11,
  FAN: 21,
  MOVIE_BUFF: Infinity
};

const AUTHORIZATION = 'Basic 1jflkawksjmdfl963';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

export{
  UpdateType,
  UserAction,
  StyleClass,
  FilterType,
  NoMoviesCaption,
  SortType,
  EmotionType,
  KeyCode,
  Method,
  ShownInfo,
  ProfileStatus,
  ProfileStatusLimit,
  AUTHORIZATION,
  END_POINT
};
