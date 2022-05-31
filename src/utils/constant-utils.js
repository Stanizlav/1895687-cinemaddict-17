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

const EmotionType = {
  SMILE : 'smile',
  SLEEPING : 'sleeping',
  PUKE : 'puke',
  ANGRY: 'angry'
};

export{
  UpdateType,
  UserAction,
  StyleClass,
  FilterType,
  EmotionType
};
