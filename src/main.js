import ProfileView from './view/profile-view.js';
import { render } from './framework/render.js';
import MoviesListPresenter from './presenter/movies-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import MoviesApiService from './services/movies-api-service.js';
import { AUTHORIZATION, END_POINT } from './utils/constant-utils.js';


const siteHeaderElement = document.body.querySelector('header');
const siteMainElement = document.body.querySelector('main');
const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(moviesApiService);

const filterModel = new FilterModel();
const filmsFilterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const filmsListPresenter = new MoviesListPresenter(siteMainElement, moviesModel, filterModel);

render(new ProfileView(), siteHeaderElement);
filmsFilterPresenter.init();
filmsListPresenter.init();
moviesModel.init();

