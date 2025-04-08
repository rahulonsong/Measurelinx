<template>
  <div class="ml-10">
    <div class="mt-10 text-left">
      <h1>404 Page Not Found</h1>
      <p class="mt-5">The page you are looking for might have been removed, had its name changed or is temporarily unavailable!</p>
      <h3 class="my-3">
        Click here to go to <router-link :to="{ name: 'home'}">Home Page</router-link>
      </h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// @ is an alias to /src
export default {
  name: "pageNotFound",
  data() {
    return {};
  },

  methods: {},
  computed: {
    ...mapGetters(["user"]),
    //
  },
  mounted() {
    // this.loadQuestions();
    setTimeout(() => {
      this.showLoginText = true;
    }, 3000);
  },
};
</script>


<style>
/* Container holding the image and the text */
/* .container {
  position: relative;
  text-align: center;
} */

/* Bottom left text */
.bottom-left {
  position: absolute;
  bottom: 30px;
  left: 30px;
}
.top-right {
  position: absolute;
  top: 30px;
  right: 30px;
}
/* Top left text */
.top-left {
  position: absolute;
  top: 30px;
  left: 30px;
}
</style>
