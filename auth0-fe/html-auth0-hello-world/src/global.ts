import auth0 from 'auth0-js';
import renderPortal from './portal';
import config from './config';
export const clientID = config.clientId;


export const webAuth = new auth0.WebAuth({
  domain:       config.domain,
  clientID:     clientID,
  audience:     config.audience
});


let globalRoot = document.getElementById('root');

$(document).ready(() => {
  globalRoot = document.getElementById('root');
});

export { globalRoot };

webAuth.parseHash({ hash: window.location.hash }, async function(err: any, authResult: any) {
  if (err) {
    return console.log(err);
  }
  if (authResult) {
    console.log(authResult);
    webAuth.client.userInfo(authResult.accessToken, function(err: any, user: any) {
      // Now you have the user's information
      user.accessToken = authResult.accessToken;
      renderPortal(globalRoot, null, user);
    });
  }
});