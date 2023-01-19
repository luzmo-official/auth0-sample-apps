import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import VueCumulioDashboard from "@cumul.io/vue-cumulio-dashboard";

const app = createApp(App);

app.use(
  createAuth0({
    domain: "dev-mxdu54vq.us.auth0.com",
    client_id: "tR0pmh3WR5hGBCzaEZ9kHy2PqoG17jFz",
    redirect_uri: window.location.origin,
    audience: "https://dev-mxdu54vq.us.auth0.com/api/v2/",
  })
);
app.use(VueCumulioDashboard);
app.use(router);

app.mount("#app");
