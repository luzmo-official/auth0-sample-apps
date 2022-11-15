<template>
  <div class="position-relative">
    <nav
      class="navbar navbar-dark"
      :style="{
        'background-color': '#ab47bc',
      }"
    >
      <div class="container">
        <RouterLink class="navbar-brand" to="/">UNIVERSAL SHOES</RouterLink>
        <span class="d-flex navbar-investor position-relative">
          <strong>Investor portal</strong>
        </span>
      </div>
    </nav>
  </div>
</template>

<style>
.navbar-investor {
  font-family: "Gudea", sans-serif;
  color: white;
  font-size: 1.25rem;
}

.navbar-brand {
  font-family: "Bangers", cursive;
  font-size: 2.5rem;
}
</style>
