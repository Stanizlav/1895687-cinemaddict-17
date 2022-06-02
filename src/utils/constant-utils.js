const UpdateType = {
  PATCH : 'PATCH',
  MINOR : 'MINOR',
  MAJOR : 'MAJOR'
};

const UserAction = {
  ADD_COMMENT : 'ADD_COMMENT',
  REMOVE_COMMENT : 'REMOVE_COMMENT',
  UPDATE_MOVIE : 'UPDATE_MOVIE'
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

export{
  UpdateType,
  UserAction,
  StyleClass,
  FilterType,
  NoMoviesCaption,
  SortType,
  EmotionType,
  KeyCode
};
