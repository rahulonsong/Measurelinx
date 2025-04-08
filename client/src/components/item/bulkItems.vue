<template>
  <!-- Bulk items Data -->
  <div>
    <!-- <v-btn @click="test">Test</v-btn> -->
    <div v-if="bulkItemsReceived">
      <!-- Items based on Category / deals items -->
      <v-toolbar
        elevation="1"
        class="mr-5 ml-3 pa-0 text-h6 text--darken-3 mt-2 py-0"
        :style="appLightBackground"
        ><span class="appThemeFontColor">{{ pageTitle }}</span></v-toolbar
      >
      <v-container fluid class="mt-5 mb-0 pa-0">
        <v-row justify="space-around">
          <v-col
            cols="3"
            v-for="(item, index) in bulkItems"
            :key="'bulk_item_' + index"
          >
            <div>
              <item-image :item="item"></item-image>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <progress-circular></progress-circular>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'bulkItems',
  data() {
    return {
      alternateDefaultImage: `${require('@/assets/images/alternateDefaultImage.webp')}`,
      cards: [
        {
          title: 'Pre-fab homes',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          flex: 12,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Favorite road trips',
          src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Best airlines',
          src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Pre-fab homes',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          flex: 12,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Favorite road trips',
          src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Best airlines',
          src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Pre-fab homes',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          flex: 12,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Favorite road trips',
          src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Best airlines',
          src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Pre-fab homes',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          flex: 12,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Favorite road trips',
          src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
        {
          title: 'Best airlines',
          src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
          flex: 6,
          discount: 40,
          tax: 13,
          price: {
            value: 100,
            currency: 'CAD',
          },
        },
      ],
      options: {
        responsive: [
          { end: 576, size: 1 },
          { start: 576, end: 768, size: 2 },
          { start: 768, end: 992, size: 3 },
          { size: 4 },
        ],
        list: {
          // 1200 because @media (min-width: 1200px) and therefore I want to switch to windowed mode
          windowed: 1200,

          // Because: #app {padding: 80px 24px;}
          padding: 24,
        },
        position: {
          start: 2,
        },
        autoplay: { play: false, repeat: false, speed: 6000 },
      },
    };
  },
  methods: {
    async getItemData() {
      if (this.initializeAppComplete) {
        if (this.$route.params.category === 'deals') {
          const dealItems = await this.$store.dispatch('getAllDealItems');
          this.$store.commit('setBulkItems', dealItems);
        } else {
          const bulkItems = await this.$store.dispatch('getAllCategoryItems', {
            itemCategoryName: this.itemCategories.find(
              (category) => category.key === this.$route.params.category
            ).stringValue,
          });
          this.$store.commit('setBulkItems', bulkItems);
        }
        this.$store.commit('setBulkItemsReceived', true);
        // console.log('active res:', this.activeItem);
      }
    },

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
  },
  computed: {
    ...mapGetters([
      'user',
      'appThemeFontColor',
      'appLightBackground',
      'homeScreenData',
      'appDark',
      'bulkItems',
      'bulkItemsTitle',
      'bulkItemsReceived',
      'itemCategories',
      'initializeAppComplete',
    ]),
    pageTitle() {
      let categoryTitle;
      if (this.$route.params.category !== 'deals') {
        categoryTitle = this.itemCategories.find(
          (category) => category.key === this.$route.params.category
        ).stringValue;
        return categoryTitle;
      } else {
        return this.bulkItemsTitle ? this.bulkItemsTitle : "Today's Deals";
      }
    },
  },
  watch: {
    async initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        await this.getItemData();
      }
    },
    $route(to, from) {
      if (this.bulkItemsDataReceived) {
        this.getItemData();
      }
    },
  },
  mounted() {
    this.$store.commit('setProgressing', false);
  },
  async created() {
    // console.log('Getting Bulk Items for deals');
    // setting BulkitemReceivedFlag to false
    this.$store.commit('setBulkItemsReceived', false);
    this.progressing = true;
    await this.getItemData();
  },
};
</script>

<style lang="scss">
.item__container .item__content {
  position: absolute; /* Position the background text */
  bottom: 0; /* At the bottom. Use top:0 to append it to the top */
  background: rgb(0, 0, 0); /* Fallback color */
  background: rgba(0, 0, 0, 0.5); /* Black background with 0.5 opacity */
  // color: #f1f1f1; /* Grey text */
  width: 100%; /* Full width */
  padding: 10px; /* Some padding */
}
.vhl-item {
  margin: 0 !important;
  padding: 10px 6px !important;
}
</style>
