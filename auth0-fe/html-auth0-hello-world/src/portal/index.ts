
import { clientID, webAuth } from '../global';
import './portal.scss';
import '@cumul.io/cumulio-dashboard';
import type { CumulioDashboard } from '@cumul.io/cumulio-dashboard';

const dashboardId = '';
const appServer = 'APP_SERVER_HERE';
const apiHost = 'API_HOST_HERE';

$(document).on('click', '#logout', () => {
  webAuth.logout({
    returnTo: 'http://localhost:4200/',
    clientID: clientID
  });
});

const render = (root: HTMLElement, auth?: {
  status: string;
  key?: string;
  token?: string;
}, user?: any) => {
  // show loader.
  root.innerHTML = `<div
    class="spinner-border text-danger loader"
    role="status"
  >
    <span class="visually-hidden">Loading...</span>
  </div>`;
  window.fetch(`http://localhost:4001`, {
    method: 'POST',
    body: JSON.stringify({
      username: user?.nickname,
      name: user?.name,
      email: user?.email,
      suborganization: user?.nickname
    }),
    headers: {
      'Authorization': 'Bearer ' + user.accessToken
    }
  })
  .then((response: any) => response.json())
  .then((data: any) => {
    setTimeout(() => {
      const dashboardInstance = document.getElementById('dashboardInstance');
      (dashboardInstance as CumulioDashboard).getAccessibleDashboards().then(dashboards => {
        console.log(dashboards);
        dashboardInstance.setAttribute('dashboardId', dashboards[0].id);
      });
    }, 100);
    root.innerHTML = `
    <div class="position-relative">
      <nav class="navbar navbar-dark" id="portal-navbar" style="
        background-color: ${user?.['https://cumulio/brand'] === 'Mars Boots' ? '#f06292' : '#d32f2f'}">
        <div class="container">
          <a class="navbar-brand" href="#">${user?.['https://cumulio/brand'] === 'Mars Boots'  ? 'MARS BOOTS' : 'EARTHLY SHOES'}</a>
          <span class="d-flex navbar-email position-relative">
            <strong>${user.email}</strong>
            <div class="position-absolute btn btn-dark btn-logout" id="logout">Logout</div>
          </span>
        </div>
      </nav>
      <div class="container">
        <cumulio-dashboard
          id="dashboardInstance"
          authKey="${data.key}"
          authToken="${data.token}"
          dashboardId="${dashboardId}"
          appServer="${appServer}"
          apiHost="${apiHost}"
          mainColor="pink"
          accentColor="black"
          loaderSpinnerColor="rgb(0, 81, 126)"
          loaderSpinnerBackground="rgb(236 248 255)"
          itemsRendered={(e) => console.log("itemsRendered", e)}
          exported={(e) => console.log("exported", e)}
          load={(e) => console.log("load", e)}>
        </cumulio-dashboard>
      </div>
    </div>
    `;
  });
};

export default render;