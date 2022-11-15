import { Link } from 'react-router-dom';
import './investor.css';

function Investor() {
  return <div className="position-relative">
      <nav className="navbar navbar-dark" style={{
        'backgroundColor': '#ab47bc'
      }}>
        <div className="container">
          <Link className="navbar-brand" to="/">UNIVERSAL SHOES</Link>
          <span className="d-flex navbar-investor position-relative">
            <strong>Investor portal</strong>
          </span>
        </div>

      </nav>
    </div>;
}

export default Investor;