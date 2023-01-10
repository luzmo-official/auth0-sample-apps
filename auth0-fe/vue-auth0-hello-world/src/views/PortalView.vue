<script>
import { useAuth0 } from "@auth0/auth0-vue";
import router from "../router";
import { ref, watch } from "vue";
export default {
  setup() {
    const {
      idTokenClaims,
      loginWithRedirect,
      logout,
      isAuthenticated,
      isLoading,
      user,
    } = useAuth0();
    const authKey = ref("");
    const authToken = ref("");
    const dashboardId = ref("DASHBOARD_ID_HERE");
    const dashboardInstance = ref(null);

    if (isAuthenticated) {
      router.push("/portal");
    }

    watch(idTokenClaims, async () => {
      if (idTokenClaims.value) {
        window
          .fetch(`http://localhost:4001`, {
            headers: {
              Authorization: "Bearer " + idTokenClaims.value.__raw,
            },
          })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              authKey.value = data.key;
              authToken.value = data.token;
              setTimeout(async () => {
                const dashboards =
                  await dashboardInstance.value.getAccessibleDashboards();
                console.log(dashboards);
                dashboardId.value = dashboards[0]?.id;
              }, 300);
            }
          });
      }
    });

    return {
      dashboardId,
      appServer: "APP_SERVER_HERE",
      apiHost: "API_HOST_HERE",
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
      isAuthenticated,
      isLoading,
      user,
      authKey,
      authToken,
      dashboardInstance,
      idTokenClaims,
    };
  },
};
</script>
<template>
  <div>
    <div v-if="isAuthenticated" class="position-relative">
      <nav
        class="navbar navbar-dark"
        :style="{
          'background-color':
            user?.['https://cumulio/brand'] === 'Mars Boots'
              ? '#f06292'
              : '#d32f2f',
        }"
      >
        <div class="container">
          <a class="navbar-brand" href="#">{{
            user?.["https://cumulio/brand"] === "Mars Boots"
              ? "MARS BOOTS"
              : "EARTHLY SHOES"
          }}</a>
          <span class="d-flex navbar-email position-relative">
            <strong>{{ user.email }}</strong>
            <div
              v-if="isAuthenticated"
              class="position-absolute btn btn-dark btn-logout"
              @click="logout"
            >
              Logout
            </div>
          </span>
        </div>
      </nav>
      <div class="container mt-4">
        <cumulio-dashboard
          ref="dashboardInstance"
          :authKey="authKey"
          :authToken="authToken"
          :dashboardId="dashboardId"
          :appServer="appServer"
          :apiHost="apiHost"
        ></cumulio-dashboard>
      </div>
    </div>
    <div
      class="spinner-border text-danger loader"
      role="status"
      v-if="isLoading"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style>
h1,
h2,
h3,
h4 {
  font-family: "Bangers", cursive;
}

.navbar-brand {
  font-family: "Bangers", cursive;
  font-size: 2.5rem;
}

.navbar-email {
  font-family: "Gudea", sans-serif;
  color: white;
  font-size: 1.25rem;
}

.btn-logout {
  left: 2rem;
  top: 2.2rem;
  z-index: 2;
}

.loader {
  position: absolute;
  left: 48%;
  top: 30%;
}

template {
  display: block !important;
}
</style>
