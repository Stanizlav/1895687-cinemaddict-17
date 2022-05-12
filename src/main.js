import ProfileView from './view/profile-view.js';
import { render } from './render.js';
import MoviesListPresenter from './presenter/movies-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

const siteHeaderElement = document.body.querySelector('header');
const siteMainElement = document.body.querySelector('main');
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filmsListPresenter = new MoviesListPresenter();

render(new ProfileView(), siteHeaderElement);
filmsListPresenter.init(siteMainElement, moviesModel, commentsModel);

