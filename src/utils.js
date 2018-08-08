import { AUTH_TOKEN } from './constants';

export const isLogged = () => localStorage.getItem(AUTH_TOKEN) !== null;

export const saveToken = token => localStorage.setItem(AUTH_TOKEN, token);

export const cleanLoggedUser = () => localStorage.removeItem(AUTH_TOKEN);

export function toParams(query) {
  const q = query.replace(/^\??\//, '');

  return q.split('&').reduce((values, param) => {
    const [key, value] = param.split('=');

    values[key] = value;

    return values;
  }, {});
}

export function toQuery(params, delimiter = '&') {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, '');
}
