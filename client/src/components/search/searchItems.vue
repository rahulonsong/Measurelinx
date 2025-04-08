<template>
  <div>
    <v-dialog
      v-model="searchItemsDialog"
      max-width="650"
      scrollable
      class="mx-0 px-0"
    >
      <v-card :height="searchDone ? 500 : 200" class="mx-0 px-0">
        <!-- <v-btn @click="test()">Test</v-btn> -->
        <v-card-title>Search Items <v-spacer></v-spacer> </v-card-title>
        <div>
          <v-text-field
            @keyup.enter="goToSearchResults()"
            class="mt-1 mx-2"
            ref="searchItemText"
            id="search__item-text"
            dense
            hide-details
            v-model="itemSearchText"
            label="Search"
            outlined
            @input="debouncedSearch"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </div>
        <!-- Search results -->
        <v-card-text style="max-height: 650px" class="pb-5 mx-0 mt-5 px-0">
          <div v-if="searchDone">
            <!-- No results image -->
            <div
              v-if="searchDone && !searchResults.length"
              class="justify-center text-center"
            >
              <img
                src="@/assets/images/noResultsFound.png"
                alt="No Results Found"
                height="300px"
              />
            </div>
            <div v-else>
              <v-list class="ma-0 pa-0">
                <v-list-item
                  class="my-1 mx-1 px-0"
                  v-for="(item, itemIndex) in searchResults"
                  :key="itemIndex"
                  @click="selectItem(item)"
                >
                  <v-avatar density="compact" rounded="0">
                    <v-img :src="item.defaultImage" alt="Item image"></v-img>
                  </v-avatar>
                  <v-list-item-content class="ml-2">
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item.description
                    }}</v-list-item-subtitle>
                    <!-- <div class="text-h5">{{ item.name }}</div> -->
                    <!-- <div class="text-body-1">{{ item.description }}</div> -->
                  </v-list-item-content>
                </v-list-item>
                <!-- Show more -->
                <v-list-item
                  v-if="
                    searchResults.length === 20 &&
                    itemSearchResultsData.items.length > 20
                  "
                  @click="goToSearchResults()"
                >
                  <v-list-item-content class="ml-2">
                    <v-list-item-title class="blue--text"
                      >Show All</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </div>
          <div v-else>
            <progress-linear v-if="itemSearchText"></progress-linear>
          </div>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            v-if="searchResults.length"
            class="text-center"
            :class="appDark ? 'green darken-4' : 'green lighten-4'"
            small
            text
            @click="(searchItemsDialog = false), goToSearchResults()"
            >Go to Results</v-btn
          >
          <v-btn
            class="text-center"
            :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
            small
            text
            @click="searchItemsDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import debounce from 'lodash/debounce';
export default {
  name: 'searchItems',
  data() {
    return {
      searchResults: [],
      items: [],
      searchDone: false,
    };
  },
  watch: {
    searchItemsDialog(newValue, oldValue) {
      if (!oldValue) {
        this.searchDone = false;
      }
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'appCurrency',
      'appDark',
      'loading',
      'progressing',
      // "cart",
      'appLightBackground',
      'cartSubTotal',
      'cartDiscount',
      'currentRoute',
      'itemSearchResultsData',
    ]),
    itemSearchText: {
      get() {
        return this.$store.getters.itemSearchText;
      },
      set(value) {
        this.$store.commit('setItemSearchText', value);
      },
    },
    loading: {
      get() {
        return this.$store.getters.loading;
      },
      set(value) {
        this.$store.commit('setLoading', value);
      },
    },
    searchItemsDialog: {
      get() {
        return this.$store.getters.searchItemsDialog;
      },
      set(value) {
        this.$store.commit('setSearchItemsDialog', value);
      },
    },
    debouncedSearch() {
      this.searchDone = false;
      return debounce(this.searchItems, 500);
    },
  },
  methods: {
    test() {
      // console.log('searchDone', this.searchDone);
      // console.log('searchResults', this.searchResults);
    },
    async searchItems() {
      if (this.itemSearchText.trim()) {
        // Call your API to search for items based on the searchText
        // and update the searchResults array with the matching items
        // console.log('searching...');
        const payload = {
          searchInput: {
            searchText: this.itemSearchText,
          },
        };
        // Setting min and max prices and order
        this.$store.commit(
          'setItemMinPrice',
          parseFloat(process.env.VUE_APP_ITEM_MIN_PRICE)
        );
        this.$store.commit(
          'setItemMaxPrice',
          parseFloat(process.env.VUE_APP_ITEM_MAX_PRICE)
        );
        this.$store.commit('setItemPriceSortOrder', 'asc');
        const searchResults = {
          ...(await this.$store.dispatch('getItemSearchResults', payload)),
        };
        // console.log('searchResults:', searchResults);
        this.searchDone = true;
        this.searchResults = searchResults.items
          ? [...searchResults.items.slice(0, 20)]
          : null;
      }
    },
    selectItem(item) {
      // killing the search dialog
      this.searchItemsDialog = false;
      //  directing to the item page
      this.$router.push({
        name: 'itemViewer',
        params: { itemName: item.routeParam },
      });
    },
    goToSearchResults() {
      if (this.itemSearchText) {
        // killing the search dialog
        this.searchItemsDialog = false;
        // console.log('this.currentRoute:', this.currentRoute);
        if (
          this.$router.currentRoute.name !== 'itemSearchResults' ||
          this.$route.params.searchText !== this.itemSearchText
        ) {
          this.$router.push({
            name: 'itemSearchResults',
            params: { searchText: this.itemSearchText },
          });
        }
      }
    },
  },
  mounted() {
    // Set focus on the search field when the component is mounted
    this.$refs.searchItemText.focus();
    // console.log('route:', this.$router.currentRoute.name);
  },
  watch: {
    searchKey() {
      this.searchItems();
    },
  },
};
</script>
