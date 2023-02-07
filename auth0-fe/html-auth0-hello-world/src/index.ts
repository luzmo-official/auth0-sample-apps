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
}

renderApp(globalRoot);
