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
      saveToken(json.access_token);
      callback();
    });
};

/*
  fetch(OAUTH_ACCESTOKEN_URL, {
    method: 'POST',
    body: JSON.stringify({ 
      client_id: OAUTH_CLIENT_ID,
      client_secret: 'acb91c27b1776fc7d86a7cbcca7ec9f9eeb43277',
      code,
      redirect_uri: OAUTH_REDIRECTURL
    })
  })
    .then(console.log);

*/
