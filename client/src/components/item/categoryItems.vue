<template>
  <v-row class="my-0 py-0" v-if="shouldRender">
    <v-col class="my-0 py-0">
      <div
        v-for="(category, index) in validCategories"
        :key="'itemCategory' + index"
      >
        <v-toolbar
          elevation="0"
          class="mr-5 ml-0 pa-0 text-h6 text--darken-3 my-0 py-0"
          :style="appLightBackground1"
        >
          <span class="appThemeFontColor">{{ category.name }}</span>
        </v-toolbar>
        <v-container fluid class="ma-0 pa-0">
          <vue-horizontal-list
            :key="'list-' + index"
            :items="category.items"
            :options="options"
            class="mr-5 my-3 py-2 ml-5"
          >
            <template #default="{ item }">
              <div>
                <item-image :item="item" :eager="false"></item-image>
              </div>
            </template>
          </vue-horizontal-list>
        </v-container>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'categoryItems',
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
          start: 992,
          color: '#000',
        },
        list: {
          windowed: 800,
          padding: 24,
        },
        autoplay: false,
      },
      isDataReady: false,
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'appThemeFontColor',
      'appLightBackground1',
      'homeScreenData',
      'appDark',
      'dealItems',
      'currentSale',
      'initializeAppComplete',
    ]),
    shouldRender() {
      return (
        this.initializeAppComplete &&
        this.isDataReady &&
        this.homeScreenData?.itemCategoryData
      );
    },
    validCategories() {
      if (!this.homeScreenData?.itemCategoryData) return [];
      return this.homeScreenData.itemCategoryData.filter(
        (category) => category.items && category.items.length > 0
      );
    },
  },
  watch: {
    'homeScreenData.itemCategoryData': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.initializeComponent();
        }
      },
    },
  },
  methods: {
    test() {
      // testing GraphQL projects
      // this.$store.dispatch("getProjects");
      // console.log('homeScreendata:', this.homeScreenData);
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
      try {
        if (this.homeScreenData?.itemCategoryData) {
          this.isDataReady = true;
        }
      } catch (error) {
        console.error('Error initializing category items:', error);
        this.$store.dispatch('handleError', error);
      }
    },
  },
  mounted() {
    this.$store.commit('setProgressing', false);
    this.initializeComponent();
  },
};
</script>
