<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">About</router-link>{{ " |" }}
      <router-link to="/twitter">Twitter</router-link>{{ " |" }}
      <router-link to="/reddit">Reddit</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import store from "@/store/index";
import constants from "@/store/constants";
import helpers from "@/util/helpers";
import schedule from "node-schedule";

helpers.updateTwitterScheduler();
helpers.updateRedditScheduler();

export default {
  name: "app"
};
</script>

<style lang="scss">
#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
