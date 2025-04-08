<template>
  <div class="dashboard-container">
    <!-- <v-btn @click="test">Test</v-btn> -->
    <!-- Item Initiator Dialog -->
    <item-initiator></item-initiator>
    <!-- side Nav Links -->
    <v-list
      dense
      nav
      v-if="initializeAppComplete"
      class="compact-list my-0 py-0"
    >
      <!-- Resources  -->
      <v-list-group
        v-if="user && (user.admin || user.resourceCreator)"
        ripple
        style="margin-left: -5px"
        :value="false"
        dense
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>library_books</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Resources</v-list-item-title>
          </v-list-item-content>
        </template>
        <!-- General-->
        <v-list nav dense class="my-0 py-0">
          <v-list-group :value="false" dense ripple no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>General</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- New Resource -->
            <v-list-item
              v-if="user && (user.resourceCreator || user.admin)"
              link
              @click="initializeNewResource('General')"
              to="/resources/alpharesource/manage"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>post_add</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>New Resource</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Search General resource -->
            <v-list-item
              class="mt-1 mb-n5 py-0 app-sidebar__search__navigation"
              style="min-width: 120px"
              v-if="generalResources.length"
            >
              <v-text-field
                style="margin-left: -30px"
                class="text-body-2"
                filled
                rounded
                single-line
                dense
                prepend-icon="search"
                v-model="searchShsResource"
                label="Search resource"
              ></v-text-field>
            </v-list-item>
            <!-- SHS ressources -->
            <v-list-item
              v-for="(resource, shsResourceIndex) in filteredGeneralResources"
              :key="shsResourceIndex"
              :to="`/resources/${resource.resourceRouteParam}`"
              link
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-content>
                <v-list-item-title>{{ resource.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <!-- Constructor -->
        <v-list
          v-if="user && (user.resourceCreator || user.admin)"
          nav
          dense
          class="my-0 py-0"
        >
          <v-list-group :value="false" ripple dense no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Page Constructors</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- New Resource -->
            <v-list-item
              v-if="user && (user.resourceCreator || user.admin)"
              link
              @click="initializeNewResource('Constructor')"
              to="/resources/alpharesource/manage"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>post_add</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>New Resource</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Search PC resource -->
            <v-list-item
              class="mt-1 mb-n5 py-0 app-sidebar__search__navigation"
              style="min-width: 120px"
              v-if="constructorResources.length"
            >
              <v-text-field
                style="margin-left: -30px"
                class="text-body-2"
                filled
                rounded
                single-line
                dense
                prepend-icon="search"
                v-model="searchConstructorResource"
                label="Search resource"
              ></v-text-field>
            </v-list-item>
            <!-- Constructor ressources -->
            <v-list-item
              v-for="(
                resource, constructorResourceIndex
              ) in filteredConstructorResources"
              :key="constructorResourceIndex"
              :to="`/resources/${resource.resourceRouteParam}`"
              link
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-content>
                <v-list-item-title>{{ resource.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-list-group>
      <!-- Pages  -->
      <v-list-group
        v-if="user && (user.resourceCreator || user.admin)"
        ripple
        style="margin-left: -5px"
        :value="false"
        dense
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>pages</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Pages</v-list-item-title>
          </v-list-item-content>
        </template>
        <!-- New Page -->
        <v-list-item
          v-if="user && (user.resourceCreator || user.admin)"
          link
          @click="initializePage()"
          dense
          class="py-0"
          style="margin-left: 12px"
        >
          <v-list-item-icon>
            <v-icon>post_add</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New Page</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!--Individual pages-->
        <v-list-item
          v-for="(page, index) in pages"
          :key="'page' + index"
          link
          :to="`/pages/${page.routeParam}`"
          dense
          class="py-0"
          style="margin-left: 12px"
        >
          <v-list-item-content>
            <v-list-item-title>{{ page.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <!-- Admin Tools  -->
      <v-list-group
        v-if="token && user && user.admin"
        ripple
        style="margin-left: -5px; margin-top: 5px"
        :value="false"
        dense
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>receipt</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Admin Tools</v-list-item-title>
          </v-list-item-content>
        </template>
        <!-- Item Models-->
        <v-list nav dense class="my-0 py-0">
          <v-list-group :value="false" dense ripple no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Item Models</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- New Item model -->
            <v-list-item
              link
              @click="setDefaultActiveItemModel"
              to="/items/itemModel/manage"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>category</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>New Model</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Search Item model -->
            <v-list-item
              class="mt-1 mb-n5 py-0 app-sidebar__search__navigation"
              style="min-width: 120px"
              v-if="itemModels.length"
            >
              <v-text-field
                style="margin-left: -30px"
                class="text-body-2"
                filled
                rounded
                single-line
                dense
                prepend-icon="search"
                v-model="searchItemModels"
                label="Search item model"
              ></v-text-field>
            </v-list-item>
            <!-- Item Models -->
            <v-list-item
              v-for="(itemModel, index) in filteredItemModels"
              :key="'itemModel' + index"
              :to="`/itemModels/${itemModel.routeParam}`"
              link
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-content>
                <v-list-item-title>{{ itemModel.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <!-- Items-->
        <v-list nav dense class="my-0 py-0">
          <v-list-group :value="false" ripple dense no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Items</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- New Item -->
            <v-list-item
              link
              @click="initiateItem"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>add</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>New Item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Search items -->
            <v-list-item
              class="mt-1 mb-n5 py-0 app-sidebar__search__navigation"
              style="min-width: 120px"
              v-if="items.length"
            >
              <v-text-field
                style="margin-left: -30px"
                class="text-body-2"
                filled
                rounded
                single-line
                dense
                prepend-icon="search"
                v-model="searchItems"
                label="Search item"
              ></v-text-field>
            </v-list-item>
            <!-- Gross Items -->
            <v-list-item
              v-if="filteredItems.length"
              v-for="(item, index) in filteredItems"
              :key="'item' + index"
              :to="`/items/${item.routeParam}`"
              link
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <!-- Menu-->
        <v-list nav dense class="my-0 py-0">
          <v-list-group :value="false" ripple dense no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Menus</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- Menu Editor -->
            <v-list-item
              link
              :to="`/menu/edit`"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>menu_book</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Menu Editor</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <!-- Category-->
        <v-list nav dense class="my-0 py-0">
          <v-list-group :value="false" ripple dense no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Categories</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- Category Editor -->
            <v-list-item
              link
              :to="`/category/edit`"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>category</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Category Editor</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <!-- Order Updates-->
        <v-list nav dense class="my-0 py-0">
          <v-list-group :value="false" ripple dense no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Order Management</v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- Order Updates-->
            <v-list-item
              link
              :to="`/user/orders/manage`"
              dense
              class="py-0"
              style="margin-left: 12px"
            >
              <v-list-item-icon>
                <v-icon>shop_two</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Manage Orders</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-list-group>
      <!-- Items for Non-users  -->
      <v-list-group
        v-if="user && user.admin"
        ripple
        style="margin-left: -5px"
        :value="false"
        dense
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon size="22">shop_2</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Items</v-list-item-title>
          </v-list-item-content>
        </template>
        <!-- Search items -->
        <v-list-item
          class="mt-1 mb-n5 py-0 app-sidebar__search__navigation"
          style="min-width: 120px"
          v-if="items.length"
        >
          <v-text-field
            style="margin-left: -30px"
            class="text-body-2"
            filled
            rounded
            single-line
            dense
            prepend-icon="search"
            v-model="searchItems"
            label="Search item"
          ></v-text-field>
        </v-list-item>
        <!-- Gross Items -->
        <v-list-item
          v-if="filteredItems.length"
          v-for="(item, index) in filteredItems"
          :key="'item' + index"
          :to="`/items/${item.routeParam}`"
          link
          dense
          class="py-0"
          style="margin-left: 12px"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <!-- App Menus side menus -->
    <menu-template
      class="mt-2"
      v-for="(menu, sideMenuIndex) in appSideMenus"
      :key="sideMenuIndex"
      :menu="menu"
    ></menu-template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { exit } from 'process';
// @ is an alias to /src
export default {
  name: 'dashboard',
  data() {
    return {
      searchShsResource: '',
      searchProcessAnalyzerResource: '',
      searchProcessCalculationResource: '',
      searchConstructorResource: '',
      filteredSystemBoms: [],
      searchItemModels: '',
      searchItems: '',
      systemBoms: [],
      searchSystemBom: '',
    };
  },
  watch: {},
  methods: {
    test() {},
    initializeNewResource(category) {
      this.alphaResourceCategory = category;
      this.resourceMode = 'create';
      this.alphaResourceTitle = 'Resource Title';
      this.alphaResourceContentIntro = '<p>Introduction for Resource</p>';
      this.alphaResourceContent = [];
      this.alphaResourceTags = [];
      this.alphaResourceReferences = [];
    },
    handleLogoutUser() {
      if (this.$route.name !== 'signin') {
        this.$router.push({ name: 'signin' });
      }
      this.$store.dispatch('signUserOut');
      // setTimeout(() => {
      //   }, 100);
    },
    setDefaultActiveItemModel() {
      this.$store.dispatch('setDefaultActiveItemModel');
    },
    initiateItem() {
      this.$store.commit('setIsItemInitiateDialog', true);
    },
    initializePage() {
      // alert('This will initialize a page');
      this.$router.push({
        name: 'pageCreator',
        params: { pageName: 'newPage' },
      });
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'loading',
      'validationRules',
      'error',
      'errorStatus',
      'progressing',
      'itemModels',
      'items',
      'pages',
      'appSideMenus',
      'initializeAppComplete',
    ]),
    sideNavItems() {
      let items = [
        {
          icon: 'login',
          title: 'Log In',
          link: '/login',
        },
      ];
      if (this.user) {
        items = [
          {
            icon: 'mdi-help-network',
            title: 'Test Item',
            link: '/test',
          },
        ];
      }
      return items;
    },
    sideNav: {
      get() {
        return this.$store.getters.sideNav;
      },
      set(value) {
        this.$store.commit('setSideNav', value);
      },
    },
    alphaResourceCategory: {
      get() {
        return this.$store.getters.alphaResourceCategory;
      },
      set(value) {
        this.$store.commit('setAlphaResourceCategory', value);
      },
    },
    generalResources: {
      get() {
        return this.$store.getters.generalResources;
      },
      set(value) {
        this.$store.commit('setGeneralResources', value);
      },
    },
    processAnalyzerResources: {
      get() {
        return this.$store.getters.processAnalyzerResources;
      },
      set(value) {
        this.$store.commit('setProcessAnalyzerResources', value);
      },
    },
    processCalculationResources: {
      get() {
        return this.$store.getters.processCalculationResources;
      },
      set(value) {
        this.$store.commit('setProcessCalculationResources', value);
      },
    },
    constructorResources: {
      get() {
        return this.$store.getters.constructorResources;
      },
      set(value) {
        this.$store.commit('setConstructorResources', value);
      },
    },
    resourceMode: {
      get() {
        return this.$store.getters.resourceMode;
      },
      set(value) {
        this.$store.commit('setResourceMode', value);
      },
    },
    alphaResourceTitle: {
      get() {
        return this.$store.getters.alphaResourceTitle;
      },
      set(value) {
        this.$store.commit('setAlphaResourceTitle', value);
      },
    },
    alphaResourceContentIntro: {
      get() {
        return this.$store.getters.alphaResourceContentIntro;
      },
      set(value) {
        this.$store.commit('setAlphaResourceContentIntro', value);
      },
    },
    alphaResourceContent: {
      get() {
        return this.$store.getters.alphaResourceContent;
      },
      set(value) {
        this.$store.commit('setAlphaResourceContent', value);
      },
    },
    alphaResourceTags: {
      get() {
        return this.$store.getters.alphaResourceTags;
      },
      set(value) {
        this.$store.commit('setAlphaResourceTags', value);
      },
    },
    alphaResourceReferences: {
      get() {
        return this.$store.getters.alphaResourceReferences;
      },
      set(value) {
        this.$store.commit('setAlphaResourceReferences', value);
      },
    },
    filteredGeneralResources() {
      if (!this.searchShsResource) {
        return this.generalResources;
      } else {
        return this.generalResources.filter(
          (resource) =>
            resource.title
              .toLowerCase()
              .indexOf(this.searchShsResource.toLowerCase()) !== -1
        );
      }
    },
    filteredProcessAnalyzerResources() {
      if (!this.searchProcessAnalyzerResource) {
        return this.processAnalyzerResources;
      } else {
        return this.processAnalyzerResources.filter(
          (resource) =>
            resource.title
              .toLowerCase()
              .indexOf(this.searchProcessAnalyzerResource.toLowerCase()) !== -1
        );
      }
    },
    filteredProcessCalculationResources() {
      if (!this.searchProcessCalculationResource) {
        return this.processCalculationResources;
      } else {
        return this.processCalculationResources.filter(
          (resource) =>
            resource.title
              .toLowerCase()
              .indexOf(this.searchProcessCalculationResource.toLowerCase()) !==
            -1
        );
      }
    },
    filteredConstructorResources() {
      if (!this.searchConstructorResource) {
        return this.constructorResources;
      } else {
        return this.constructorResources.filter(
          (resource) =>
            resource.title
              .toLowerCase()
              .indexOf(this.searchConstructorResource.toLowerCase()) !== -1
        );
      }
    },
    filteredItems() {
      if (!this.searchItems) {
        return this.items;
      } else {
        return this.items.filter(
          (item) =>
            item.name.toLowerCase().indexOf(this.searchItems.toLowerCase()) !==
            -1
        );
      }
    },
    filteredItemModels() {
      if (!this.searchItemModels) {
        return this.itemModels;
      } else {
        return this.itemModels.filter(
          (itemModel) =>
            itemModel.name
              .toLowerCase()
              .indexOf(this.searchItemModels.toLowerCase()) !== -1
        );
      }
    },
  },
  mounted() {},
  created() {},
};
</script>

<style>
/* Dashboard container with proper scroll behavior */
.dashboard-container {
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: -5px;
  height: 100%;
  max-height: calc(
    100vh - 64px
  ); /* Adjust this value based on your app's header height */
}

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
.cog-top__margin {
  margin-top: -5px;
}
.main--nav__margin {
  margin-top: 50px;
}
.app-sidebar__search__navigation
  .v-text-field
  .v-input__control
  .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  height: 28px;
  min-width: 150px;
  max-width: 300px;
}
.app-sidebar__search__navigation
  .v-text-field
  .v-input__control
  .v-input__slot
  .v-text-field__slot
  .v-label {
  margin-top: -6px;
  font-size: 0.9em;
}
.app-sidebar__search__navigation
  .v-text-field
  .v-input__prepend-outer
  .v-input__icon
  .v-icon {
  margin-bottom: 10px;
}

/* More compact vertical styling for list items */
.compact-list .v-list-item {
  min-height: 30px !important;
}

.compact-list .v-list-group__header {
  min-height: 36px !important;
}

.compact-list .v-list-item__icon {
  margin: 4px 0 !important;
  min-width: 36px !important;
}

.compact-list .v-list-item__title {
  line-height: 1.2 !important;
}

/* All sub-items in list groups should have the same indentation */
.compact-list > .v-list-group--active > .v-list-group__items > .v-list-item,
.compact-list .v-list-group--sub-group .v-list-item {
  padding-left: 12px !important;
}

/* Align all dropdown icons to the right */
.compact-list .v-list-group__header .v-list-group__header__append-icon {
  margin-left: auto !important;
  padding-left: 8px !important;
  min-width: 0 !important;
}

/* Fix alignment of inner sub-groups dropdown icons */
.compact-list
  .v-list-group--sub-group
  .v-list-group__header
  .v-list-group__header__append-icon {
  margin-right: 0 !important;
}

.compact-list .v-list--nav .v-list-item,
.compact-list .v-list-item--nav {
  padding: 0 8px !important;
}
</style>
