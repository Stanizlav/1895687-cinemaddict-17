import ProfileView from './view/profile-view.js';
import FilmInfoView from './view/film-info-view.js';
import { render } from './render.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';

const siteHeaderElement = document.body.querySelector('header');
const siteMainElement = document.body.querySelector('main');
const filmsListPresenter = new FilmsListPresenter();

render(new ProfileView(), siteHeaderElement);
render(new FilmInfoView(), document.body);
filmsListPresenter.init(siteMainElement);
