<script>
import { watch } from 'vue';
import { useAuth0 } from "@auth0/auth0-vue";
import router from '../router';

export default {
  setup() {
    const { loginWithRedirect, logout, isAuthenticated, isLoading } =
      useAuth0();

    watch(isAuthenticated, (currentValue) => {
      if (currentValue) {
        router.push('/portal');
      }
    });

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
      isAuthenticated,
      isLoading,
    };
  },
};
</script>
<template>
  <div class="container container-whole text-center">
    <div
      class="spinner-border text-danger loader"
      role="status"
      v-if="isLoading"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <span class="text-center h1-bg inline-block p-2">UNIVERSAL FOOTWEAR</span>
    <div class="row text-center links-container">
      <div class="offset-lg-2 col-12 col-lg-3">
        <div class="row">
          <div class="col-12">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vero
            cum enim quibusdam quaerat. Quos modi temporibus tempora suscipit
            qui. Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
          </div>
        </div>
        <RouterLink
          to="/investor"
          class="btn btn-lg btn-primary btn-purple mt-5"
        >
          Investor relations
        </RouterLink>
      </div>
      <div class="offset-lg-2 col-12 col-lg-3 mt-5 mt-lg-0">
        <div class="row">
          <div class="col-12">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vero
            cum enim quibusdam quaerat. Quos modi temporibus tempora suscipit
            qui. Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
          </div>
        </div>
        <a class="btn btn-lg btn-primary btn-purple mt-5" @click="login">
          Brand portal
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.container-whole {
  margin-top: 6rem;
}
body {
  font-family: "Gudea", sans-serif;
}

.loader {
  position: absolute;
  left: 48%;
  top: 30%;
}

h1,
h2,
h3,
h4 {
  font-family: "Bangers", cursive;
}

.links-container {
  margin-top: 6rem;
}

.h1-bg {
  font-family: "Bangers", cursive;
  font-size: 4.5rem;
  letter-spacing: 4px;
  color: white;
  background: rgb(71, 34, 195);
  background: linear-gradient(
    73deg,
    rgba(71, 34, 195, 1) 0%,
    rgba(119, 33, 159, 1) 100%
  );
}
</style>
