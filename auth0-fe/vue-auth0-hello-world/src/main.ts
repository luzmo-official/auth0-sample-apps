import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import VueCumulioDashboard from "@cumul.io/vue-cumulio-dashboard";
import config from './config';

const app = createApp(App);

app.use(
  createAuth0({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: window.location.origin,
    audience: config.audience,
  })
);
app.use(VueCumulioDashboard);
app.use(router);

app.mount("#app");
