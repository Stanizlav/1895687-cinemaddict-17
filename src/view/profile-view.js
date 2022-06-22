import AbstractView from '../framework/view/abstract-view';
import { ProfileStatus, StyleClass } from '../utils/constant-utils';

const createProfileTemplate = (profileStatus) => {
  const invisibilityClass = profileStatus === ProfileStatus.NOBODY ? StyleClass.HIDDEN : '';

  return (
    `<section class="header__profile profile ${ invisibilityClass }">
      <p class="profile__rating">${profileStatus}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class ProfileView extends AbstractView{
  #profileStatus = ProfileStatus.NOBODY;

  get template(){
    return createProfileTemplate(this.#profileStatus);
  }

  constructor(profileStatus = ProfileStatus.NOBODY){
    super();
    this.#profileStatus = profileStatus;
  }
}
