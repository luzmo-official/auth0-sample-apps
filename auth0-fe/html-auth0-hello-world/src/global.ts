import auth0 from 'auth0-js';
import renderPortal from './portal';

export const clientID = 'tR0pmh3WR5hGBCzaEZ9kHy2PqoG17jFz';


export const webAuth = new auth0.WebAuth({
  domain:       'dev-mxdu54vq.us.auth0.com',
  clientID:     clientID
});


let globalRoot = document.getElementById('root');

$(document).ready(() => {
  globalRoot = document.getElementById('root');
});

export { globalRoot };

webAuth.parseHash({ hash: window.location.hash }, function(err: any, authResult: any) {
  if (err) {
    return console.log(err);
  }
  if (authResult) {
    webAuth.client.userInfo(authResult.accessToken, function(err: any, user: any) {
      // Now you have the user's information
      console.log(user);
      renderPortal(globalRoot, null, user);
    });
  }
});