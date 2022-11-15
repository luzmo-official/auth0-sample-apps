import './home.css';
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <div className="container container-whole text-center">
      { isLoading ? <div className="spinner-border text-danger loader" role="status">
        <span className="visually-hidden">Loading...</span>
      </div> : <div></div>}
      <span className="text-center h1-bg inline-block p-2">UNIVERSAL FOOTWEAR</span>
      <div className="row text-center links-container mt-5">
        <div className="offset-lg-2 col-12 col-lg-3">
          <div className="row">
            <div className="col-12">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aut vero cum enim quibusdam quaerat.
              Quos modi temporibus tempora suscipit qui.
              Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
            </div>
          </div>
          <Link to='/investor' className="btn btn-lg btn-primary btn-purple mt-5" >
            Investor relations
          </Link>
      </div>
      <div className="offset-lg-2 col-12 col-lg-3 mt-5 mt-lg-0">
          <div className="row">
            <div className="col-12">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aut vero cum enim quibusdam quaerat.
              Quos modi temporibus tempora suscipit qui.
              Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
            </div>
          </div>
          <div className="btn btn-lg btn-primary btn-purple mt-5" onClick={() => loginWithRedirect()}>
            Brand portal
          </div>
      </div>
      </div>
    </div>;
}

export default Home;