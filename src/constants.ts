export const POSTS_PER_PAGE = 5;
export const MAX_POSTS = 570;
export enum AppRoute {
  Root = '/',
  Articles = '/articles',
  Article = '/articles/:slug',
  Login = '/sign-in',
  Registration = '/sign-up',
  Profile = '/profile',
  NewArticle = '/new-article',
  EditArticle = '/articles/:slug/edit',
  NotFound = '*',
}

export const errorToastConfig = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  progress: undefined,
  draggable: false,
  theme: 'light',
  type: 'error',
} as const;

export const successToastConfig = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  progress: undefined,
  draggable: false,
  theme: 'light',
  type: 'success',
} as const;

export const warningToastConfig = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  progress: undefined,
  draggable: false,
  theme: 'light',
  type: 'warning',
} as const;

export const INPUT_INVALID_CLASS = 'modal__input--invalid';
