<template>
  <div class="menu-template">
    <!-- Desktop Menu -->
    <v-list dense nav class="my-n1 py-0 hidden-sm-and-down">
      <!-- Original menu content for desktop -->
      <template v-if="!isMobile">
        <!-- single Level Menu -->
        <v-list-item
          class="my-n1 py-0"
          v-if="menu.menuType === 'single'"
          link
          :to="`/pages/${menu.routeParam}`"
          min-height="20"
        >
          <v-list-item-title class="my-n1 py-0">{{
            menu.name
          }}</v-list-item-title>
        </v-list-item>
        <!-- Double Level menu -->
        <v-list-group
          v-if="menu.menuType === 'double'"
          ripple
          :value="false"
          class="my-0 py-0"
        >
          <template v-slot:activator>
            <v-list-item-content class="pa-0">
              <v-list-item-title class="py-1">
                {{ menu.name }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <!--SubMenus-->
          <v-list-item
            v-for="(subMenu, subMenuIndex) in menu.subMenus"
            :key="'subMenu' + subMenuIndex"
            link
            :to="`/pages/${subMenu.routeParam}`"
            class="my-n1 py-0"
            min-height="20"
            style="margin-left: 6px"
          >
            <v-list-item-title class="my-n1 py-0" style="margin-left: 6px">{{
              subMenu.name
            }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <!-- Triple Level Menu-->
        <v-list-group
          v-if="menu.menuType === 'triple'"
          ripple
          :value="false"
          class="my-0 py-0"
        >
          <template v-slot:activator>
            <v-list-item-content class="pa-0">
              <v-list-item-title class="py-1">
                {{ menu.name }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <!-- Submenus-->
          <v-list
            nav
            dense
            class="my-n1 py-0"
            v-for="(subMenu, subMenuIndex) in menu.subMenus"
            :key="'subMenu' + subMenuIndex"
          >
            <v-list-group
              :value="false"
              dense
              ripple
              no-action
              sub-group
              class="my-n1 py-0"
              style="margin-left: -16px"
            >
              <template v-slot:activator>
                <v-list-item-content
                  class="pa-0 my-n1"
                  style="margin-left: -16px"
                >
                  <v-list-item-title class="my-n1 py-0">{{
                    subMenu.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <!-- Subtitles -->
              <v-list-item
                v-for="(subTitle, subTitleIndex) in subMenu.subTitles"
                :key="'subTitle' + subTitleIndex"
                :to="`/pages/${subTitle.routeParam}`"
                link
                class="my-n1 py-0"
                min-height="20"
              >
                <v-list-item-title
                  class="my-n1 py-0"
                  style="margin-left: -32px"
                  >{{ subTitle.name }}</v-list-item-title
                >
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-list-group>
      </template>
    </v-list>

    <!-- Mobile Bottom Sheet -->
    <div class="hidden-md-and-up">
      <v-bottom-sheet v-model="showMobileMenu" scrollable persistent>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            class="mobile-filter-btn"
            fixed
            bottom
            right
            color="primary"
            fab
            small
            style="margin: 16px"
          >
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>

        <v-sheet class="mobile-menu-sheet" rounded="t">
          <v-list dense nav>
            <v-list-item class="mobile-menu-header">
              <v-list-item-title class="title">
                {{ menu.name }}
                <v-btn
                  icon
                  small
                  @click="showMobileMenu = false"
                  class="float-right"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item>

            <!-- Mobile Menu Content -->
            <!-- single Level Menu -->
            <v-list-item
              v-if="menu.menuType === 'single'"
              link
              :to="`/pages/${menu.routeParam}`"
              @click="showMobileMenu = false"
            >
              <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </v-list-item>

            <!-- Double Level menu -->
            <v-list-group v-if="menu.menuType === 'double'" ripple>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ menu.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="(subMenu, subMenuIndex) in menu.subMenus"
                :key="'mobileSubMenu' + subMenuIndex"
                link
                :to="`/pages/${subMenu.routeParam}`"
                @click="showMobileMenu = false"
                style="padding-left: 24px"
              >
                <v-list-item-title>{{ subMenu.name }}</v-list-item-title>
              </v-list-item>
            </v-list-group>

            <!-- Triple Level Menu-->
            <v-list-group v-if="menu.menuType === 'triple'" ripple>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ menu.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-group
                v-for="(subMenu, subMenuIndex) in menu.subMenus"
                :key="'mobileSubMenu' + subMenuIndex"
                sub-group
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ subMenu.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="(subTitle, subTitleIndex) in subMenu.subTitles"
                  :key="'mobileSubTitle' + subTitleIndex"
                  :to="`/pages/${subTitle.routeParam}`"
                  link
                  @click="showMobileMenu = false"
                  style="padding-left: 32px"
                >
                  <v-list-item-title>{{ subTitle.name }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
        </v-sheet>
      </v-bottom-sheet>
    </div>
  </div>
</template>

<script>
export default {
  name: 'menuTemplate',
  data() {
    return {
      showMobileMenu: false,
    };
  },
  props: {
    menu: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    closeMobileMenu() {
      this.showMobileMenu = false;
    },
  },
};
</script>

<style scoped>
.mobile-menu-sheet {
  max-height: 80vh;
  overflow-y: auto;
  padding: 8px 0;
}

.mobile-menu-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-bottom: 1px solid #e0e0e0;
}

.mobile-filter-btn {
  z-index: 100;
}

.title {
  font-size: 1.25rem;
  font-weight: 500;
  padding: 8px 0;
}

.float-right {
  float: right;
}
</style>
