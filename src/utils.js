import queryString from 'query-string';
import {
  AUTH_TOKEN,
  OAUTH_CLIENT_ID,
  OAUTH_SCOPE,
  OAUTH_REDIRECTURL,
  OAUTH_AUTHORIZATION_URL,
  OAUTH_ACCESTOKEN_URL
} from './constants';

export const isLogged = () => localStorage.getItem(AUTH_TOKEN) !== null;

export const saveToken = token => localStorage.setItem(AUTH_TOKEN, token);

export const cleanLoggedUser = () => localStorage.removeItem(AUTH_TOKEN);

export const authorize = () => {
  const query = queryString.stringify({
    client_id: OAUTH_CLIENT_ID,
    scope: OAUTH_SCOPE,
    redirect_uri: OAUTH_REDIRECTURL
  });
  window.location = `${OAUTH_AUTHORIZATION_URL}?${query}`;
};

export const getAcessToken = (code, callback) => {
  fetch(`${OAUTH_ACCESTOKEN_URL}${code}`)
    .then(res => res.json())
    .then(json => {
      console.log(json);
      saveToken(json.access_token);
      callback();
    });
};

export const merge = (a, b, key = 'id') =>
  a.filter(elem => !b.find(subElem => subElem[key] === elem[key])).concat(b);
