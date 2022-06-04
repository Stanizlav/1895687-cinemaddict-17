import ProfileView from './view/profile-view.js';
import { render } from './framework/render.js';
import MoviesListPresenter from './presenter/movies-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.body.querySelector('header');
const siteMainElement = document.body.querySelector('main');
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const filmsFilterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const filmsListPresenter = new MoviesListPresenter(siteMainElement, moviesModel, commentsModel, filterModel);

render(new ProfileView(), siteHeaderElement);
filmsFilterPresenter.init();
filmsListPresenter.init();

