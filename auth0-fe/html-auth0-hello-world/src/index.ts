import '@cumul.io/cumulio-dashboard';
import renderHome from './home';
const dashboardId = 'DASHBOARD_ID_HERE';
const appServer = 'APP_SERVER_HERE';
const apiHost = 'API_HOST_HERE';
import { globalRoot } from './global';

const renderApp = (root: HTMLElement, auth?: {
  status: string;
  key?: string;
  token?: string;
}) => {
  renderHome(root);
  // root.innerHTML = `
  //   <cumulio-dashboard appServer="${appServer}" apiHost="${apiHost}" dashboardId="${dashboardId}" authKey="${auth.key}" authToken="${auth.token}">
  //   </cumulio-dashboard>
  // `;
}

const fetchAuthKeyAndToken = async () => {
  return fetch('http://localhost:4001/').then(response => response.json());
}

async function fetchAndRender() {
  const auth = await fetchAuthKeyAndToken(); 
  renderApp(
    globalRoot,
    auth
  );
} 

// fetchAndRender();
renderApp(globalRoot);

// document.getElementById('root').innerHTML = '<cumulio-dashboard dashboardId="763177aa-9b93-4ae7-903e-3cb07dc593d8"></cumulio-dashboard>'