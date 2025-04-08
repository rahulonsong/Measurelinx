<template>
  <!-- item Search Results -->
  <div>
    <v-row no-gutters>
      <!-- Advanced Search Filters -->
      <v-navigation-drawer
        v-model="showFilters"
        :temporary="$vuetify.breakpoint.mdAndDown"
        :permanent="$vuetify.breakpoint.lgAndUp"
        :right="true"
        width="300"
        :style="[
          appLightBackground,
          {
            top: '64px',
            height: 'calc(100vh - 64px)',
            'z-index': 1,
          },
        ]"
        fixed
        class="advanced-filters-drawer"
      >
        <advanced-search-filters
          ref="advancedSearchFilters"
        ></advanced-search-filters>
      </v-navigation-drawer>

      <!-- items -->
      <v-col cols="12">
        <!-- Listing the filters Added -->
        <v-row class="mx-1">
          <v-col>
            <!-- category filter -->
            <span>
              <v-chip
                class="primary--text ma-1"
                small
                v-if="isCatFilterUsed()"
                closable
              >
                Category
                <v-icon small class="ml-2" @click="clearCatFilter()"
                  >mdi-close-box</v-icon
                >
              </v-chip>
            </span>
            <!-- Color filter chip, shown only if a color filter is used -->
            <span>
              <v-chip
                class="primary--text ma-1"
                small
                v-if="isColorFilterUsed()"
                closable
              >
                Color
                <v-icon small class="ml-2" @click="clearColorFilter()"
                  >mdi-close-box</v-icon
                >
              </v-chip>
            </span>
            <!-- Size filter chip, shown only if a size filter is used -->
            <span>
              <v-chip
                class="primary--text ma-1"
                small
                v-if="isSizeFilterUsed()"
                closable
              >
                Size
                <v-icon small class="ml-2" @click="clearSizeFilter()"
                  >mdi-close-box</v-icon
                >
              </v-chip>
            </span>

            <!-- option Specs -->
            <span v-for="(spec, index) in optionSpecs" :key="'option' + index">
              <v-chip
                class="primary--text ma-1"
                small
                v-if="isSpecFilterUsed(spec)"
                closable
              >
                {{ spec.specName }}
                <v-icon small class="ml-2" @click="clearSpecFilter(spec)"
                  >mdi-close-box</v-icon
                >
              </v-chip>
            </span>
            <!-- minMax Specs -->
            <span v-for="(spec, index) in minMaxSpecs" :key="'minMax' + index">
              <v-chip
                class="primary--text ma-1"
                small
                v-if="isSpecFilterUsed(spec)"
                closable
              >
                {{ spec.specName }}
                <v-icon small class="ml-2" @click="clearSpecFilter(spec)"
                  >mdi-close-box</v-icon
                >
              </v-chip>
            </span>
            <!-- Price filter -->
            <span>
              <v-chip
                class="primary--text ma-1"
                small
                v-if="isPriceFilterUsed()"
                closable
              >
                Price
                <v-icon small class="ml-2" @click="clearPriceFilter()"
                  >mdi-close-box</v-icon
                >
              </v-chip>
            </span>
          </v-col>
        </v-row>

        <div class="mt-5" v-if="!searchInProgress">
          <div
            v-if="
              itemSearchResultsData &&
              itemSearchResultsData.items &&
              itemSearchResultsData.items.length
            "
          >
            <item-pagination
              :itemData="itemSearchResultsData"
              :itemPageNumber="itemSearchPage"
              :numberOfPages="itemSearchNumberOfPages"
              @pageChanged="search"
            ></item-pagination>
          </div>
          <div v-else>
            <no-item-search-results></no-item-search-results>
          </div>
        </div>
        <div v-else>
          <progress-circular></progress-circular>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import isEqual from 'lodash/isEqual';
// Import lodash debounce function
import _debounce from 'lodash/debounce';

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      // Decode the URI component and parse as JSON
      var decodedValue = decodeURIComponent(pair[1]);
      try {
        return JSON.parse(decodedValue);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    }
  }
  // console.log('Query variable %s not found', variable);
  return null;
}

export default {
  name: 'itemSearchResults',
  data() {
    return {
      alternateDefaultImage: `${require('@/assets/images/alternateDefaultImage.webp')}`,
      dynamicFilters: {},
      areFiltersApplied: false,
      showFilters: true,
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'appThemeFontColor',
      'appLightBackground',
      'itemSearchResultsData',
      'appDark',
      'dealItems',
      'currentSale',
      'progressing',
      'loading',
      'searchInProgress',
      'initializeAppComplete',
      'fixedItemMinPrice',
      'fixedItemMaxPrice',
    ]),
    itemSearchPage: {
      get() {
        return this.$store.getters.itemSearchPage;
      },
      set(value) {
        this.$store.commit('setItemSearchPage', value);
      },
    },
    itemSearchNumberOfPages: {
      get() {
        return this.$store.getters.itemSearchNumberOfPages;
      },
      set(value) {
        this.$store.commit('setItemSearchNumberOfPages', value);
      },
    },
    optionSpecs: {
      get() {
        return this.$store.getters.optionSpecs;
      },
      set(value) {
        this.$store.commit('setOptionSpecs', value);
      },
    },
    minMaxSpecs: {
      get() {
        return this.$store.getters.minMaxSpecs;
      },
      set(value) {
        this.$store.commit('setMinMaxSpecs', value);
      },
    },
    itemSearchCategories: {
      get() {
        return this.$store.getters.itemSearchCategories;
      },
      set(value) {
        this.$store.commit('setItemSearchCategories', value);
      },
    },
    itemSearchColors: {
      get() {
        return this.$store.getters.itemSearchColors;
      },
      set(value) {
        this.$store.commit('setItemSearchColors', value);
      },
    },
    itemSearchSizes: {
      get() {
        return this.$store.getters.itemSearchSizes;
      },
      set(value) {
        this.$store.commit('setItemSearchSizes', value);
      },
    },
    itemMinPrice: {
      get() {
        return this.$store.getters.itemMinPrice;
      },
      set(value) {
        this.$store.commit('setItemMinPrice', value);
      },
    },
    itemMaxPrice: {
      get() {
        return this.$store.getters.itemMaxPrice;
      },
      set(value) {
        this.$store.commit('setItemMaxPrice', value);
      },
    },
    itemPriceSortOrder: {
      get() {
        return this.$store.getters.itemPriceSortOrder;
      },
      set(value) {
        this.$store.commit('setItemPriceSortOrder', value);
      },
    },
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.getItemSearchResults();
      }
    },
    // itemSearchPage(newValue, oldValue) {
    //   this.search(newValue);
    // },
    optionSpecs: {
      handler: 'updateRoute',
      deep: true, // Watch nested properties in dynamicFilters
    },
    minMaxSpecs: {
      handler: 'updateRoute',
      deep: true, // Watch nested properties in dynamicFilters
    },
    itemMaxPrice: {
      handler: '_debouncedUpdateRoute',
    },
    itemMinPrice: {
      handler: '_debouncedUpdateRoute',
    },
    itemPriceSortOrder: {
      handler: 'updateRoute',
    },
    itemSearchCategories: {
      handler: 'updateRoute',
      deep: true, // Watch nested properties in dynamicFilters
    },
  },
  mounted() {
    this.$store.commit('setProgressing', false);
    this.isInitiated = true;
  },
  async created() {
    await this.getItemSearchResults();
    // Apply filters when the component is created
    this.applyFiltersFromRoute();
    if (this.$route.query) {
      // Perform the search with the applied filters
      await this.search(1);
    }
    this.areFiltersApplied = true;
  },
  methods: {
    async getItemSearchResults() {
      if (JSON.stringify(this.itemSearchResultsData) === '{}') {
        // Call your API to search for items based on the searchText
        // and update the searchResults array with the matching items
        const payload = {
          searchInput: {
            searchText: this.$route.params.searchText,
          },
        };
        await this.$store.dispatch('getItemSearchResults', payload);
      }
    },
    applyFiltersFromRoute() {
      this.$nextTick(() => {
        const query = this.$route.query;

        if (
          query.optionSpecs &&
          query.minMaxSpecs &&
          query.categories &&
          query.colors &&
          query.sizes &&
          query.itemMinPrice &&
          query.itemMaxPrice &&
          query.itemPriceSortOrder
        ) {
          // Parse the URL parameters into objects
          this.optionSpecs = JSON.parse(query.optionSpecs);
          this.minMaxSpecs = JSON.parse(query.minMaxSpecs);
          this.itemSearchCategories = JSON.parse(query.categories);
          this.itemSearchColors = JSON.parse(query.colors);
          this.itemSearchSizes = JSON.parse(query.sizes);
          this.itemMinPrice = parseFloat(query.itemMinPrice);
          this.itemMaxPrice = parseFloat(query.itemMaxPrice);
          this.itemPriceSortOrder = query.itemPriceSortOrder;
        }
      });
    },
    // Debounced version of updateRoute
    _debouncedUpdateRoute: _debounce(function () {
      this.updateRoute();
    }, 200),

    updateRoute() {
      // checking if filters are appplied while loading the page
      if (this.areFiltersApplied) {
        // Construct a new route object with dynamic filters
        const dynamicFilters = {
          optionSpecs: JSON.stringify(this.optionSpecs),
          minMaxSpecs: JSON.stringify(this.minMaxSpecs),
          categories: JSON.stringify(this.itemSearchCategories),
          colors: JSON.stringify(this.itemSearchColors),
          sizes: JSON.stringify(this.itemSearchSizes),
          itemMinPrice: this.itemMinPrice,
          itemMaxPrice: this.itemMaxPrice,
          itemPriceSortOrder: this.itemPriceSortOrder,
        };

        const newRoute = {
          name: 'itemSearchResults',
          params: { searchText: this.$route.params.searchText },
          query: dynamicFilters,
        };

        // Compare current route parameters with the new ones
        const isSameRoute =
          this.$route.name === newRoute.name &&
          this.$route.params.searchText === newRoute.params.searchText &&
          JSON.stringify(this.$route.query) === JSON.stringify(newRoute.query);

        if (!isSameRoute) {
          // Replace the current route with the updated one
          this.$router.replace(newRoute);
        }
      }
    },
    test() {
      // testing GraphQL projects
      // this.$store.dispatch("getProjects");
      // console.log('itemSearchResultsData:', this.itemSearchResultsData);
    },
    async search(page) {
      const payload = {
        page: page,
        searchText: this.$route.params.searchText,
      };
      await this.$store.dispatch('getItemAdavncedSearchResults', payload);
    },
    isSpecFilterUsed(spec) {
      let specUsed = false;
      // OPtions Text
      if (spec.specValueType === 'options' && spec.userSelectedOptions) {
        for (let i = 0; i < spec.userSelectedOptions.length; i++) {
          const option = spec.userSelectedOptions[i];
          if (option[`option${i}`]) {
            specUsed = true;
            break;
          }
        }
      } else {
        if (
          parseFloat(spec.userMinValue) !== parseFloat(spec.minValue) ||
          parseFloat(spec.userMaxValue) !== parseFloat(spec.maxValue)
        ) {
          specUsed = true;
        }
      }
      return specUsed;
    },
    isCatFilterUsed() {
      let catFilterUsed = false;

      for (let i = 0; i < this.itemSearchCategories.length; i++) {
        const cat = this.itemSearchCategories[i];
        if (cat[`option${i}`]) {
          catFilterUsed = true;
          break;
        }
      }
      return catFilterUsed;
    },
    isColorFilterUsed() {
      let colorFilterUsed = false;
      for (let i = 0; i < this.itemSearchColors.length; i++) {
        const color = this.itemSearchColors[i];
        if (color[`option${i}`]) {
          colorFilterUsed = true;
          break;
        }
      }
      return colorFilterUsed;
    },
    isSizeFilterUsed() {
      let sizeFilterUsed = false;
      for (let i = 0; i < this.itemSearchSizes.length; i++) {
        const size = this.itemSearchSizes[i];
        if (size[`option${i}`]) {
          sizeFilterUsed = true;
          break;
        }
      }
      return sizeFilterUsed;
    },
    clearColorFilter() {
      for (let i = 0; i < this.itemSearchColors.length; i++) {
        const option = this.itemSearchColors[i];
        option[`option${i}`] = false;
      }
      // Optionally perform the search again
      this.search(1);
    },

    clearSizeFilter() {
      for (let i = 0; i < this.itemSearchSizes.length; i++) {
        const option = this.itemSearchSizes[i];
        option[`option${i}`] = false;
      }
      // Optionally perform the search again
      this.search(1);
    },
    async clearSpecFilter(spec) {
      if (spec.specValueType === 'options') {
        for (let i = 0; i < spec.userSelectedOptions.length; i++) {
          const option = spec.userSelectedOptions[i];
          option[`option${i}`] = false;
        }
      } else {
        spec.userMaxValue = spec.maxValue;
        spec.userMinValue = spec.minValue;
      }
      // Performing Search
      await this.search(1);
    },
    async clearCatFilter() {
      for (let i = 0; i < this.itemSearchCategories.length; i++) {
        const option = this.itemSearchCategories[i];
        option[`option${i}`] = false;
      }
      // Performing Search
      await this.search(1);
    },
    isPriceFilterUsed() {
      let priceFilterUsed = false;
      // if(parseFloat(this.itemMinPrice) )
      if (
        parseFloat(this.itemMinPrice) !== parseFloat(this.fixedItemMinPrice) ||
        parseFloat(this.itemMaxPrice) !== parseFloat(this.fixedItemMaxPrice) ||
        this.itemPriceSortOrder !== 'asc'
      ) {
        priceFilterUsed = true;
      }
      return priceFilterUsed;
    },
    clearPriceFilter() {
      this.itemPriceSortOrder = 'asc';
      this.itemMinPrice = this.fixedItemMinPrice;
      this.itemMaxPrice = this.fixedItemMaxPrice;
      this.$forceUpdate();
      // Performing Search
      this.search(1);
    },
  },
};
</script>

<style scoped>
.advanced-filters-drawer {
  z-index: 6;
}

/* Add padding to content when filters are shown on large screens */
@media (min-width: 1264px) {
  .v-content {
    padding-right: 300px !important;
  }
}
</style>
