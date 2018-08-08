import { AUTH_TOKEN } from './constants';

export const isLogged = () => localStorage.getItem(AUTH_TOKEN) !== null;

export const saveToken = token => localStorage.setItem(AUTH_TOKEN, token);

export const cleanLoggedUser = () => localStorage.removeItem(AUTH_TOKEN);
