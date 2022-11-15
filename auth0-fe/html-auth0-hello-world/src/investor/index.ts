import './investor.scss';
import renderHome from '../home';
import { globalRoot } from '../global';

$(document).on('click', '#go-to-home', () => {
  renderHome(globalRoot);
});

const render = (root: HTMLElement, auth?: {
  status: string;
  key?: string;
  token?: string;
}) => {
  root.innerHTML = `
  <div class="position-relative">
  <nav class="navbar navbar-dark" style="
    background-color: #ab47bc">
    <div class="container">
      <a class="navbar-brand" id="go-to-home" href="#">UNIVERSAL SHOES</a>
      <span class="d-flex navbar-investor position-relative">
        <strong>Investor portal</strong>
      </span>
    </div>

  </nav>
</div>
  `;
};

export default render;