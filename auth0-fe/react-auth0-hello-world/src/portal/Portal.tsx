import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { CumulioDashboardComponent, CumulioDashboard } from "@cumul.io/react-cumulio-dashboard";
import './portal.css';

const appServer = 'APP_SERVER_HERE';
const apiHost = 'API_HOST_HERE';

function Portal() {
  const [dashboardId, setDashboardId] = useState<string | undefined>('');
  const [key, setKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
  console.log(user);
  const ref = useRef<CumulioDashboard | null>(null);

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      if (user) {
        window.fetch(`http://localhost:4001`, {
          method: 'POST',
          body: JSON.stringify({
            name: user?.name,
            email: user?.email,
          }),
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then((data) => {
          setTimeout(() => {
            setKey(data.key);
            setToken(data.token);
            setTimeout(() => {
              ref.current?.getAccessibleDashboards().then(dashboards => {
                console.log(dashboards);
                if (dashboards) {
                  setDashboardId(dashboards[0].id);
                }
              });
            }, 100);
          }, 2000);
  
        });
      }
    });

  }, [user]);


  return isAuthenticated && user ? <div className="position-relative">
    <nav className="navbar navbar-dark" style={{
      'backgroundColor': user['https://cumulio/brand']?.[0] === 'Mars Boots' ? '#f06292' : '#d32f2f'
    }}>
      <div className="container">
        <Link className="navbar-brand" to="#">{ user['https://cumulio/brand']?.[0] === 'Mars Boots'  ? 'MARS BOOTS' : 'EARTHLY SHOES'}</Link>
        <span className="d-flex navbar-email position-relative">
          <strong>{user?.email}</strong>
          <div className="position-absolute btn btn-dark btn-logout" onClick={() => logout({ returnTo: window.location.origin })}>Logout</div>
        </span>
      </div>

    </nav>
    <div className="container mt-4 position-relative dashboard-loader">
    { key && token ? <CumulioDashboardComponent
      ref={ref}
      dashboardId={dashboardId}
      authKey={key}
      authToken={token}
      appServer={appServer}
      apiHost={apiHost}
      mainColor="pink"
      accentColor="black"
      loaderSpinnerColor="rgb(0, 81, 126)"
      loaderSpinnerBackground="rgb(236 248 255)"
      itemsRendered={(e) => console.log("itemsRendered", e)}
      exported={(e) => console.log("exported", e)}
      load={(e) => console.log("load", e)}
    ></CumulioDashboardComponent> : <div className="spinner-border text-danger loader" role="status">
    <span className="visually-hidden">Loading...</span>
  </div> }
    </div>
    </div> : <div className="spinner-border text-danger loader" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>;
}

export default Portal;