<template>
  <div>
    <v-card
      class="mt-0 pa-0"
      style="margin-bottom: 100px"
      elevation="0"
      v-if="!searchInProgress"
    >
      <!-- <v-btn @click="test()">Test</v-btn> -->
      <!-- Filters for categories, specs, price -->
      <v-expansion-panels
        class="ma-0 pa-0"
        accordion
        hover
        multiple
        tile
        elevation="0"
      >
        <!-- Category filter -->
        <v-expansion-panel class="ma-0 pa-0">
          <v-expansion-panel-header
            class="ma-0 pl-0 py-0 text-left align-items-center"
          >
            <div class="ml-3 text-left d-flex">
              <v-icon>mdi-view-list</v-icon>
              <span class="ml-2 my-auto">Categories</span>
              <v-spacer></v-spacer>
              <span v-if="isCatFilterUsed()" class="mr-3">
                <v-btn
                  icon
                  fab
                  @click.prevent="clearCatFilter()"
                  small
                  class="error--text"
                  ><v-icon small>mdi-close-box</v-icon></v-btn
                >
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="ma-0 pa-0">
            <v-checkbox
              @change="search(1)"
              :class="index === 0 ? 'mt-3 py-0' : 'my-0 py-0'"
              v-for="(category, index) in itemSearchCategories"
              :key="'category' + index"
              v-model="itemSearchCategories[index][`option${index}`]"
              :label="itemSearchCategories[index][`option${index}Text`]"
            ></v-checkbox>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Color filter, shown only if itemSearchColors array is not empty -->
        <v-expansion-panel v-if="itemSearchColors.length > 0" class="ma-0 pa-0">
          <v-expansion-panel-header
            class="ma-0 pl-0 py-0 text-left align-items-center"
          >
            <div class="ml-3 text-left d-flex">
              <v-icon>mdi-palette</v-icon>
              <span class="ml-2 my-auto">Colors</span>
              <v-spacer></v-spacer>
              <span v-if="isColorFilterUsed()" class="mr-3">
                <v-btn
                  icon
                  fab
                  @click.prevent="clearColorFilter()"
                  small
                  class="error--text"
                >
                  <v-icon small>mdi-close-box</v-icon>
                </v-btn>
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="ma-0 pa-0">
            <v-checkbox
              @change="search(1)"
              :class="index === 0 ? 'mt-3 py-0' : 'my-0 py-0'"
              v-for="(color, index) in itemSearchColors"
              :key="'color' + index"
              v-model="itemSearchColors[index][`option${index}`]"
            >
              <template v-slot:label>
                <div class="d-flex align-center">
                  <v-avatar size="24" class="mr-2">
                    <v-sheet
                      class="d-flex justify-center align-center rounded-circle"
                      :class="[
                        `ma-1`,
                        `rounded-circle`,
                        `${itemSearchColors[index][`option${index}Text`]}`,
                      ]"
                      :style="{
                        width: '16px',
                        height: '16px',
                      }"
                    ></v-sheet>
                  </v-avatar>
                  <span>
                    {{
                      itemSearchColors[index][`option${index}Text`]
                        .charAt(0)
                        .toUpperCase() +
                      itemSearchColors[index][`option${index}Text`].slice(1)
                    }}
                  </span>
                </div>
              </template>
            </v-checkbox>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Size filter, shown only if itemSearchSizes array is not empty -->
        <v-expansion-panel v-if="itemSearchSizes.length > 0" class="ma-0 pa-0">
          <v-expansion-panel-header
            class="ma-0 pl-0 py-0 text-left align-items-center"
          >
            <div class="ml-3 text-left d-flex">
              <v-icon>mdi-ruler-square</v-icon>
              <span class="ml-2 my-auto">Sizes</span>
              <v-spacer></v-spacer>
              <span v-if="isSizeFilterUsed()" class="mr-3">
                <v-btn
                  icon
                  fab
                  @click.prevent="clearSizeFilter()"
                  small
                  class="error--text"
                >
                  <v-icon small>mdi-close-box</v-icon>
                </v-btn>
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="ma-0 pa-0">
            <v-checkbox
              @change="search(1)"
              :class="index === 0 ? 'mt-3 py-0' : 'my-0 py-0'"
              v-for="(size, index) in itemSearchSizes"
              :key="'size' + index"
              v-model="itemSearchSizes[index][`option${index}`]"
              :label="itemSearchSizes[index][`option${index}Text`]"
            ></v-checkbox>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Option spec filters -->
        <v-expansion-panel
          class="ma-0 pa-0"
          v-for="(spec, index) in optionSpecs"
          :key="'optionSpec' + index"
        >
          <v-expansion-panel-header
            class="ma-0 pl-0 py-0 text-left align-items-center"
          >
            <div class="text-left ml-3 d-flex">
              <v-icon>mdi-filter-plus</v-icon>
              <span class="ml-2 my-auto">{{ spec.specName }}</span>
              <v-spacer></v-spacer>
              <span v-if="isSpecFilterUsed(spec)" class="mr-3">
                <v-btn
                  icon
                  fab
                  @click.prevent="clearSpecFilter(spec)"
                  small
                  class="error--text"
                  ><v-icon small>mdi-close-box</v-icon></v-btn
                >
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="ma-0 pa-0">
            <v-checkbox
              @change="search(1)"
              :class="valueIndex === 0 ? 'mt-3 py-0' : 'my-0 py-0'"
              v-for="(value, valueIndex) in spec.specOptions"
              :key="valueIndex"
              :label="value"
              v-model="
                spec.userSelectedOptions[valueIndex][`option${valueIndex}`]
              "
            ></v-checkbox>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- minMax spec filter -->
        <v-expansion-panel
          class="ma-0 pa-0"
          v-for="(spec, index) in minMaxSpecs"
          :key="'minMaxSpec' + index"
        >
          <v-expansion-panel-header class="ma-0 pl-0 py-0">
            <div class="ml-3 text-left d-flex">
              <v-icon class="justify-left text-left">mdi-filter-plus</v-icon>
              <span class="ml-2 my-auto"
                >{{ spec.specName }}&nbsp;{{
                  spec.specValueType === 'value with unit' ||
                  spec.specValueType === 'options with unit'
                    ? `(${spec.specUnit})`
                    : ''
                }}</span
              >
              <v-spacer></v-spacer>
              <span v-if="isSpecFilterUsed(spec)" class="mr-3">
                <v-btn
                  icon
                  fab
                  @click.prevent="clearSpecFilter(spec)"
                  small
                  class="error--text"
                >
                  <v-icon small>mdi-close-box</v-icon></v-btn
                >
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card elevation="0">
              <v-card-text class="mb-0 mt-3 ml-2 pa-0" elevation="0">
                <!-- value Text box -->
                <v-row class="ma-0 pa-0">
                  <!-- Min value Textbox -->
                  <v-col cols="6" class="my-0 py-0">
                    <v-text-field
                      class="input-value__number"
                      @keyup="search(1)"
                      type="number"
                      hide-details
                      dense
                      outlined
                      v-model="spec.userMinValue"
                      label="Min"
                    ></v-text-field>
                  </v-col>
                  <!-- Max value Textbox -->
                  <v-col cols="6" class="my-0 py-0">
                    <v-text-field
                      class="input-value__number"
                      @keyup="search(1)"
                      type="number"
                      hide-details
                      dense
                      outlined
                      v-model="spec.userMaxValue"
                      label="Max"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Price & Sort filter -->
        <v-expansion-panel class="ma-0 pa-0">
          <v-expansion-panel-header class="ma-0 pl-0 py-0">
            <div class="ml-3 text-left d-flex">
              <v-icon>mdi-currency-usd</v-icon>
              <span class="ml-2 my-auto">Price & Sort</span>
              <v-spacer></v-spacer>
              <span v-if="isPriceFilterUsed()" class="mr-3">
                <v-btn
                  icon
                  fab
                  @click.prevent="clearPriceFilter()"
                  small
                  class="error--text"
                >
                  <v-icon small>mdi-close-box</v-icon></v-btn
                >
              </span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card elevation="0">
              <v-card-text class="my-0 ml-2 pa-0" elevation="0">
                <!-- Min Price -->
                <v-row class="ma-0 pa-0">
                  <v-col class="ma-0 pa-0">
                    <v-slider
                      @change="search(1)"
                      step="1"
                      v-model="itemMinPrice"
                      :min="fixedItemMinPrice"
                      :max="fixedItemMaxPrice"
                      label="Min"
                      thumb-color="primary"
                      thumb-label
                    ></v-slider>
                  </v-col>
                </v-row>
                <!-- Max Price -->
                <v-row class="ma-0 pa-0">
                  <v-col class="ma-0 pa-0">
                    <v-slider
                      @change="search(1)"
                      :min="fixedItemMinPrice"
                      :max="fixedItemMaxPrice"
                      step="1"
                      v-model="itemMaxPrice"
                      label="Max"
                      thumb-color="primary"
                      thumb-label
                    ></v-slider>
                  </v-col>
                </v-row>
                <!-- price Text box -->
                <v-row class="ma-0 pa-0">
                  <!-- Min Price Textbox -->
                  <v-col cols="6" class="ma-0 px-1 py-0">
                    <v-text-field
                      prepend-inner-icon="attach_money"
                      class="input-value__number"
                      @keyup="search(1)"
                      type="number"
                      hide-details
                      dense
                      outlined
                      v-model="itemMinPrice"
                      label="Min Price"
                    ></v-text-field>
                  </v-col>
                  <!-- Max Price Textbox -->
                  <v-col cols="6" class="ma-0 px-1 py-0">
                    <v-text-field
                      prepend-inner-icon="attach_money"
                      class="input-value__number"
                      @keyup="search(1)"
                      type="number"
                      hide-details
                      dense
                      outlined
                      v-model="itemMaxPrice"
                      label="Max Price"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card elevation="0" class="ma-0 pa-0">
              <v-card-title class="mt-2 my-0 py-0 subtitle-1"
                >Sort By</v-card-title
              >
              <v-card-text elevation="0" class="my-0 py-0">
                <v-radio-group
                  @change="onSortOrderChange"
                  v-model="itemPriceSortOrder"
                >
                  <v-radio
                    class="my-1"
                    label="Low to High"
                    value="asc"
                  ></v-radio>
                  <v-radio
                    class="my-1"
                    label="High to Low"
                    value="desc"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- Search and Clear Filters  button -->
      <v-card-actions class="justify-center">
        <v-btn
          text
          height="25"
          class="app__button mx-2 px-2"
          :class="appDark ? 'orange darken-4' : 'orange lighten-4'"
          @click="clearAllFilters()"
          >clear Filters</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          text
          height="25"
          class="app__button mx-2 px-2"
          :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
          @click="search(1)"
          >Search</v-btn
        >
      </v-card-actions>
    </v-card>
    <div v-else>
      <progress-linear></progress-linear>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
// Import lodash debounce function
import _debounce from 'lodash/debounce';

export default {
  name: 'advancedSearchFilters',
  data() {
    return {
      priceStep: 10,
    };
  },
  methods: {
    test() {
      // testing GraphQL projects
      // this.$store.dispatch("getProjects");
      // console.log('itemSearchResultsData:', this.itemSearchResultsData);
      // console.log('optionspecs:', this.optionSpecs);
      // console.log('minMaxspecs:', this.minMaxSpecs);
      // console.log('categoriesChecked:', this.categoriesChecked);
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
    // Use lodash debounce to create a debounced version of the search method
    debouncedSearch: _debounce(function (page) {
      if (this.itemMinPrice == '') {
        this.itemMinPrice = this.fixedItemMinPrice;
      }
      if (this.itemMaxPrice == '') {
        this.itemMaxPrice = this.fixedItemMaxPrice;
      }

      const payload = {
        page: page,
        searchText: this.$route.params.searchText,
      };

      // Make sure isAscendingOrder is correctly set based on the radio selection
      if (this.itemPriceSortOrder === 'asc') {
        this.$store.commit('setIsAscendingOrder', true);
      } else {
        this.$store.commit('setIsAscendingOrder', false);
      }

      this.$store.dispatch('getItemAdavncedSearchResults', payload);
    }, 200),
    // Original search method that will be debounced
    search(page) {
      // Call the debounced search method
      this.debouncedSearch(page);
    },
    // updateUserMinValue(spec, index) {
    //   if (parseFloat(spec.userMinValue) < parseFloat(spec.minValue)) {
    //     this.minMaxSpecs[index].userMinValue = spec.minValue;
    //   }
    // },
    // updateUserMaxValue(spec, index) {
    //   if (parseFloat(spec.userMaxValue) > parseFloat(spec.maxValue)) {
    //     this.minMaxSpecs[index].userMaxValue = spec.maxValue;
    //   }
    // },
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

    clearSpecFilter(spec) {
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
      this.search(1);
    },
    clearCatFilter() {
      for (let i = 0; i < this.itemSearchCategories.length; i++) {
        const option = this.itemSearchCategories[i];
        option[`option${i}`] = false;
      }
      // Performing Search
      this.search(1);
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
    clearAllFilters() {
      this.$nextTick(() => {
        // clearing option specs
        for (let i = 0; i < this.optionSpecs.length; i++) {
          const spec = this.optionSpecs[i];
          for (let j = 0; j < spec.userSelectedOptions.length; j++) {
            const option = spec.userSelectedOptions[j];
            option[`option${j}`] = false;
          }
        }
        // clearing min max specs
        for (let i = 0; i < this.minMaxSpecs.length; i++) {
          const spec = this.minMaxSpecs[i];
          spec.userMinValue = spec.minValue;
          spec.userMaxValue = spec.maxValue;
        }
        // clearing categories
        for (let i = 0; i < this.itemSearchCategories.length; i++) {
          const option = this.itemSearchCategories[i];
          option[`option${i}`] = false;
        }
        // clearing Colrs
        for (let i = 0; i < this.itemSearchColors.length; i++) {
          const option = this.itemSearchColors[i];
          option[`option${i}`] = false;
        }
        // clearing Sizes
        for (let i = 0; i < this.itemSearchSizes.length; i++) {
          const option = this.itemSearchSizes[i];
          option[`option${i}`] = false;
        }
        // Setting price filters to default
        this.itemPriceSortOrder = 'asc';
        this.itemMinPrice = this.fixedItemMinPrice;
        this.itemMaxPrice = this.fixedItemMaxPrice;
      });
      this.$forceUpdate();
      // console.log('new max price:', this.itemMaxPrice);
      // console.log('new min price:', this.itemMinPrice);

      // Performing Search
      this.search(1);
    },
    forceUpdateParent() {
      this.$forceUpdate();
    },
    onSortOrderChange(value) {
      // Set both the itemPriceSortOrder and isAscendingOrder states
      this.$store.commit('setItemPriceSortOrder', value);
      this.$store.commit('setIsAscendingOrder', value === 'asc');
      this.search(1);
    },
  },
  watch: {
    itemMinPrice(newValue, oldValue) {
      // console.log('new min price value:', this.itemMinPrice);
      if (newValue == '') {
        this.itemMinPrice = this.fixedItemMinPrice;
        this.$forceUpdate();
      }
    },
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
      'searchInProgress',
      'fixedItemMinPrice',
      'fixedItemMaxPrice',
    ]),
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
  created() {
    // Initialize the checked array with false values for each category
    // this.categoriesChecked = Array(this.categories.length).fill(false);
  },
  mounted() {
    this.$store.commit('setProgressing', false);
    // this.$forceUpdate();
    this.minMaxSpecs.forEach((spec, index) => {
      this.$watch(
        () => spec.userMinValue,
        (newValue, oldValue) => {
          // Handle specMin change here
          if (newValue < spec.minValue) {
            spec.userMinValue = spec.minValue;
          }
        }
      );
    });
  },
};
</script>

<style lang="scss">
.vhl-item {
  margin: 0 !important;
  padding: 10px 6px !important;
}

.my-expansion-panel-header .v-icon {
  margin-right: 0;
}
.my-expansion-panel-header span {
  margin-left: 0;
}
</style>
