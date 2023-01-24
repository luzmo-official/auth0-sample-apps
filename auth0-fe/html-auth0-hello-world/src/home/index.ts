import renderInvestor from '../investor';
import { globalRoot, webAuth } from '../global';
import './home.scss';
$(document).on("click", "#investor-relations", () => {
  console.log('investor relations');
  renderInvestor(globalRoot);
});

$(document).on("click", "#brand-portal", () => {
  webAuth.authorize({
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/'
  });
});


const render = (root: HTMLElement, auth?: {
  status: string;
  key?: string;
  token?: string;
}) => {
  root.innerHTML = `
  <div class="container container-whole text-center">
  <!-- <div class="spinner-border text-danger loader" role="status" id="home-loader">
    <span class="visually-hidden">Loading...</span>
  </div> -->
  <span class="text-center h1-bg inline-block p-2">UNIVERSAL FOOTWEAR</span>
  <div class="row text-center links-container">
    <div class="container col-12 col-lg-3 mt-5 mt-lg-0">
      <div class="row">
        <div class="col-12">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Aut vero cum enim quibusdam quaerat.
          Quos modi temporibus tempora suscipit qui.
          Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
        </div>
      </div>
      <a class="btn btn-lg btn-primary btn-purple mt-5" id="brand-portal">
        Brand portal
      </a>
    </div>
  </div>
</div>
  `;
};

export default render;