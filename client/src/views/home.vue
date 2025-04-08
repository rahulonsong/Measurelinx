<template>
  <div v-if="initializeAppComplete && isDataReady">
    <!-- <v-btn @click="test">Test</v-btn> -->
    <!-- home Page Carousel -->
    <v-carousel height="500" hide-delimiters progress cycle>
      <v-carousel-item
        v-for="(item, index) in homePageCarouselImages"
        :key="index"
        :src="item.src"
        cover
      >
        <div class="d-flex fill-height justify-center align-center">
          <p v-html="item.text"></p>
        </div>
      </v-carousel-item>
    </v-carousel>
    <!-- Home Page Data -->
    <page-template
      v-if="homePageDataReceived"
      :homePageDataReceived="homePageDataReceived"
      :homePageData="homePageData"
    ></page-template>
    <!-- Deal items -->
    <div v-if="dealItems && dealItems.length">
      <v-toolbar
        :style="appLightBackground"
        elevation="0"
        class="mr-5 ml-0 pa-0 text-h6 text--darken-3 my-0 py-0"
        ><span class="appThemeFontColor">{{ currentSale }}</span></v-toolbar
      >
      <v-container fluid class="ma-0 pa-0">
        <vue-horizontal-list
          :items="dealItems"
          :options="options"
          class="mr-5 my-3 py-2 ml-5"
        >
          <template v-slot:default="{ item }">
            <div>
              <item-image :item="item"></item-image>
            </div>
          </template>
        </vue-horizontal-list>
      </v-container>
    </div>
    <!-- Displaying Item Category Lists -->
    <category-items></category-items>
    <!-- Displaying User Item Category Lists -->
    <div
      v-if="user && token"
      v-for="(category, index) in homeScreenData.userItemCategoryData"
      :key="'userItemCategory' + index"
    >
      <v-toolbar
        v-if="category.items.length"
        elevation="0"
        class="mr-5 ml-0 pa-0 text-h6 text--darken-3 my-0 py-0"
        :style="appLightBackground"
        ><span class="appThemeFontColor">{{ category.name }}</span></v-toolbar
      >
      <v-container v-if="category.items.length" fluid class="ma-0 pa-0">
        <vue-horizontal-list
          :items="category.items"
          :options="options"
          class="mr-5 my-3 py-2 ml-5"
        >
          <template v-slot:default="{ item }">
            <div>
              <item-image
                :item="
                  category.name === 'Recently Viewed Items' ? item.item : item
                "
              ></item-image>
            </div>
          </template>
        </vue-horizontal-list>
      </v-container>
    </div>
    <home3 class="mt-10"></home3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import home3 from '@/views/home3';
import PageTemplate from '@/components/page/viewer.vue';

export default {
  name: 'home',
  components: {
    home3,
    PageTemplate,
  },
  data() {
    return {
      alternateDefaultImage: `${require('@/assets/images/alternateDefaultImage.webp')}`,
      cards: [],
      options: {
        responsive: [
          { end: 576, size: 2 },
          { start: 576, end: 768, size: 2 },
          { start: 768, end: 992, size: 3 },
          { size: 6 },
        ],
        navigation: {
          // when to show navigation
          start: 992,
          color: '#000',
        },
        list: {
          // 1200 because @media (min-width: 1200px) and therefore I want to switch to windowed mode
          windowed: 800,

          // Because: #app {padding: 80px 24px;}
          padding: 24,
        },
        position: {
          start: 2,
        },
        autoplay: { play: false, repeat: false, speed: 6000 },
      },
      isDataReady: false,
    };
  },

  watch: {
    homeScreenData: {
      handler(newVal) {
        if (newVal) {
          this.initializeComponent();
        }
      },
      immediate: true,
    },
    dealItems: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.initializeComponent();
        }
      },
      immediate: true,
    },
  },

  methods: {
    test() {
      // testing GraphQL projects
      // this.$store.dispatch("getProjects");
      // console.log('homeScreendata:', this.homeScreenData);
      this.$store.commit('setSubscriptionDialog', true);
    },
    showItem(routeParam) {
      // console.log('routepParam:', routeParam);
      // alert("This will show item details");
      // Directing to Item viewer
      this.$router.push({
        name: 'itemViewer',
        params: { itemName: routeParam },
      });
    },
    showBulkItems(category) {
      if (this.$route.name !== 'bulkitems') {
        this.$router.push({ name: 'bulkitems', params: { category } });
      }
    },
    initializeComponent() {
      // this.$nextTick(() => {
      //   setTimeout(() => {
      this.isDataReady = true;
      this.$store.dispatch('getHomePageData');
      this.$forceUpdate();
      // }, 50);
      // });
    },
  },

  computed: {
    ...mapGetters([
      'user',
      'token',
      'appThemeFontColor',
      'appLightBackground',
      'homeScreenData',
      'appDark',
      'dealItems',
      'currentSale',
      'homePageDataReceived',
      'homePageData',
      'homePageCarouselImages',
      'homePageCarouselReceived',
      'initializeAppComplete',
    ]),
  },

  mounted() {
    this.$store.commit('setProgressing', false);
    // this.$nextTick(() => {
    //   // setTimeout(() => {
    //   this.$forceUpdate();
    //   // }, 100);
    // });
    if (this.homeScreenData && this.dealItems) {
      this.initializeComponent();
    }
  },
};
</script>

<style lang="scss">
.vhl-item {
  margin: 0 !important;
  padding: 10px 6px !important;
}
</style>
