<template>
  <!-- Home Screeen Data -->
  <div>
    <!-- <v-btn @click="test">Test</v-btn> -->
    <!-- Deal items -->
    <div>
      <v-toolbar
        elevation="1"
        class="mr-5 ml-3 pa-0 text-h6 text--darken-3 my-0 py-0"
        ><span class="appThemeFontColor">{{ currentSale }}</span></v-toolbar
      >
      <v-container fluid class="ma-0 pa-0">
        <vue-horizontal-list
          :items="dealItems"
          :options="options"
          class="mr-5 my-0 py-2 ml-3"
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
      v-for="(category, index) in homeScreenData.userItemCategoryData"
      :key="'userItemCategory' + index"
    >
      <v-toolbar
        v-if="category.items.length"
        elevation="1"
        class="mr-5 ml-3 pa-0 text-h6 text--darken-3 mt-2 py-0"
        ><span class="appThemeFontColor">{{ category.name }}</span></v-toolbar
      >
      <v-container v-if="category.items.length" fluid class="ma-0 pa-0">
        <vue-horizontal-list
          :items="category.items"
          :options="options"
          class="mr-5 my-3 py-2 ml-3"
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
export default {
  name: 'home',
  components: {
    home3,
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
    };
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
  },
  computed: {
    ...mapGetters([
      'user',
      'appThemeFontColor',
      'homeScreenData',
      'appDark',
      'dealItems',
      'currentSale',
    ]),
  },

  mounted() {
    this.$store.commit('setProgressing', false);
  },
};
</script>

<style lang="scss">
.vhl-item {
  margin: 0 !important;
  padding: 10px 6px !important;
}
</style>
