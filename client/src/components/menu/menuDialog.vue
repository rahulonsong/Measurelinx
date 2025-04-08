<!-- Ediatable Dialog -->
<template>
  <!-- Dialog for Add/Update Menus -->
  <v-row class="my-0 py-0" style="width: 100%">
    <v-col class="my-0 py-0">
      <v-dialog v-model="menuDialog" persistent scrollable max-width="800px">
        <v-card>
          <v-card-title
            class="font-weight-bold"
            :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
          >
            {{ menuContext === 'add' ? 'Add a new menu' : 'Update Menu' }}
          </v-card-title>
          <!-- Menu Data -->
          <v-card-text
            style="height: 800px"
            class="justify__text mx-0 py-0 px-0 my-0"
          >
            <!-- container -->
            <v-container class="mx-0 py-0 px-0 my-0">
              <v-form
                :style="appThemeFontColor"
                v-model="isMenuFormValid"
                lazy-validation
                ref="appMenuForm"
                class="py-0 my-0 mx-5"
              >
                <!-- Type of Menu-->
                <v-row class="my-0 py-0" justify="space-between">
                  <v-col class="my-0 py-0">
                    <v-radio-group
                      v-model="activeMenu.menuType"
                      row
                      @change="santizeMenuContent()"
                    >
                      <v-row class="my-0 py-0" justify="space-around">
                        <!-- Single -->
                        <v-col class="my-1 py-0" cols="4" md="4" sm="4">
                          <v-radio
                            label="Single Level"
                            value="single"
                          ></v-radio>
                        </v-col>
                        <!-- Double -->
                        <v-col class="my-1 py-0" cols="4" md="4" sm="4">
                          <v-radio
                            label="Double Level"
                            value="double"
                          ></v-radio>
                        </v-col>
                        <!-- Triple -->
                        <v-col class="my-1 py-0" cols="4" md="4" sm="4">
                          <v-radio
                            label="Triple Level"
                            value="triple"
                          ></v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <!-- Displaying Publish option -->
                <v-row class="my-0 py-0" justify="center">
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">Do you want to publish this menu?</p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeMenu.published"
                      dense
                      hide-details
                      :label="
                        activeMenu.published ? 'Published' : 'Unpublished'
                      "
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying disabled option -->
                <v-row
                  v-if="user.admin"
                  class="pt-2 pb-0 my-0 d-flex"
                  justify="center"
                >
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">Do you want to disable this Menu?</p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeMenu.disabled"
                      dense
                      hide-details
                      :label="activeMenu.disabled ? 'Disabled' : 'Not Disabled'"
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying side menu option -->
                <v-row
                  v-if="user.admin"
                  class="pt-2 pb-0 my-0 d-flex"
                  justify="center"
                >
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">
                      Do you want to enable this as side menu?
                    </p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeMenu.isSideMenu"
                      dense
                      hide-details
                      :label="
                        activeMenu.isSideMenu
                          ? 'Side Menu Enabled'
                          : 'No side menu'
                      "
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying side menu option -->
                <v-row
                  v-if="user.admin"
                  class="pt-2 pb-0 my-0 d-flex"
                  justify="center"
                >
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">
                      Do you want to enable this as top menu?
                    </p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeMenu.isTopMenu"
                      dense
                      hide-details
                      :label="
                        activeMenu.isTopMenu
                          ? 'Top Menu Enabled'
                          : 'No top menu'
                      "
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying bottom menu option -->
                <v-row
                  v-if="user.admin && activeMenu.menuType === 'single'"
                  class="pt-2 pb-0 my-0 d-flex"
                  justify="center"
                >
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">
                      Do you want to enable this as bottom menu?
                    </p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeMenu.isBottomMenu"
                      dense
                      hide-details
                      :label="
                        activeMenu.isBottomMenu
                          ? 'Bottom Menu Enabled'
                          : 'No bottom menu'
                      "
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying menu content -->
                <!-- single Level Menu -->
                <div v-if="activeMenu.menuType === 'single'">
                  <v-row class="ma-0 pa-0">
                    <!-- Menu name -->
                    <v-col class="ma-2 pa-0" md="5" sm="6" cols="5">
                      <v-text-field
                        v-model="activeMenu.name"
                        placeholder="Name of Menu"
                        label="Menu Name"
                        :rules="validationRules.required"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Assign Page -->
                    <v-col class="ma-2 pa-0" md="6" sm="6" cols="6">
                      <v-autocomplete
                        v-model="activeMenu.routeParam"
                        dense
                        hide-details
                        return-object
                        item-text="name"
                        :rules="validationRules.required"
                        item-value="routeParam"
                        outlined
                        placeholder="select a page for this menu"
                        :items="pages"
                        label="Page for the menu item"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
                <!-- Double Level menu -->
                <div v-if="activeMenu.menuType === 'double'">
                  <v-row class="my-0 py-0">
                    <v-col class="my-0 py-0">
                      <v-text-field
                        v-model="activeMenu.name"
                        placeholder="Name of Menu"
                        :rules="validationRules.required"
                        label="Menu Name"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Add submenu -->
                  <v-row justify="start" class="my-0 py-0">
                    <v-col align="center" class="text-left ma-0 pa-0">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 success--text text--darken-3 text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="addMenuItem(null)"
                          >
                            <v-icon>playlist_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add submenu</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Submenus -->
                  <v-row
                    class="my-0 ml-10 pa-0"
                    v-for="(subMenu, subMenuIndex) in activeMenu.subMenus"
                    :key="'subMenu' + subMenuIndex"
                  >
                    <!-- Menu name -->
                    <v-col class="ma-2 pa-0" md="5" sm="6" cols="5">
                      <v-text-field
                        v-model="subMenu.name"
                        placeholder="Name of Menu"
                        label="Menu Name"
                        :rules="validationRules.required"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Assign Page -->
                    <v-col class="ma-2 pa-0" md="5" sm="6" cols="5">
                      <v-autocomplete
                        v-model="subMenu.routeParam"
                        dense
                        hide-details
                        return-object
                        item-text="name"
                        :rules="validationRules.required"
                        item-value="routeParam"
                        outlined
                        placeholder="select a page for this menu"
                        :items="pages"
                        label="Page for the menu item"
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- Delete Menu item -->
                    <v-col cols="1" class="text-right ma-0 pa-0">
                      <!-- Delete menu item -->
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 error--text text--darken-3 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="deleteMenuItem(subMenuIndex, null)"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete this menu</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </div>
                <!-- Triple Level Menu-->
                <div v-if="activeMenu.menuType === 'triple'">
                  <v-row class="my-0 py-0">
                    <v-col class="my-0 py-0">
                      <v-text-field
                        v-model="activeMenu.name"
                        :rules="validationRules.required"
                        placeholder="Name of Menu"
                        label="Menu Name"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Add submenu -->
                  <v-row justify="start" class="my-0 py-0">
                    <v-col align="center" class="text-left ma-0 pa-0">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 success--text text--darken-3 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click.stop="addMenuItem(null)"
                          >
                            <v-icon>playlist_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add submenu</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Submenus -->
                  <v-row
                    class="my-0 ml-10 pa-0"
                    v-for="(subMenu, subMenuIndex) in activeMenu.subMenus"
                    :key="'subMenu' + subMenuIndex"
                  >
                    <v-col class="my-0 py-0">
                      <!-- submenu name -->
                      <v-row
                        ><v-col cols="11">
                          <v-text-field
                            v-model="subMenu.name"
                            placeholder="Name of Menu"
                            label="Menu Name"
                            :rules="validationRules.required"
                            type="text"
                            hide-details
                            dense
                            outlined
                            clearable
                          >
                          </v-text-field>
                        </v-col>
                        <!-- Delete Menu item -->
                        <v-col cols="1" class="text-right ma-0 pa-0">
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 error--text text--darken-3 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="deleteMenuItem(subMenuIndex, null)"
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Delete this submenu</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <!-- Add subtitle -->
                      <v-row justify="start" class="my-0 py-0">
                        <v-col align="center" class="text-left ma-0 pa-0">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 success--text text--darken-3 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="addMenuItem(subMenuIndex)"
                              >
                                <v-icon>playlist_add</v-icon>
                              </v-btn>
                            </template>
                            <span>Add Deep Submenu</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <!-- subTitles -->
                      <v-row
                        class="my-0 ml-10 pa-0"
                        v-for="(subTitle, subTitleIndex) in subMenu.subTitles"
                        :key="'subTitle' + subTitleIndex"
                      >
                        <!-- Menu name -->
                        <v-col class="ma-2 pa-0" md="5" sm="5" cols="5">
                          <v-text-field
                            v-model="subTitle.name"
                            placeholder="Name of Menu"
                            :rules="validationRules.required"
                            label="Menu Name"
                            type="text"
                            hide-details
                            dense
                            outlined
                            clearable
                          >
                          </v-text-field>
                        </v-col>
                        <!-- Assign Page -->
                        <v-col class="ma-2 pa-0" md="5" sm="6" cols="5">
                          <v-autocomplete
                            v-model="subTitle.routeParam"
                            dense
                            hide-details
                            return-object
                            item-text="name"
                            :rules="validationRules.required"
                            item-value="routeParam"
                            outlined
                            placeholder="select a page for this menu"
                            :items="pages"
                            label="Page for the menu item"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-spacer></v-spacer>
                        <!-- Delete Menu item -->
                        <v-col cols="1" class="text-right ma-0 pa-0">
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 error--text text--darken-3 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="
                                  deleteMenuItem(subMenuIndex, subTitleIndex)
                                "
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Delete this Deep Submenu</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </v-form>
            </v-container>
          </v-card-text>
          <!-- Close/cancel buttons -->
          <v-card-actions>
            <v-row justify="center" class="my-2">
              <!-- Save -->
              <v-col md="2" sm="3" class="text-center">
                <v-btn
                  rounded
                  small
                  class="primary darken-4 font-weight-bold"
                  :disabled="!isMenuFormValid"
                  raised
                  color="blue"
                  @click="saveMenuDialog()"
                >
                  Submit
                </v-btn>
              </v-col>
              <!-- Cancel -->
              <v-col md="2" sm="3" class="text-center">
                <v-btn
                  rounded
                  small
                  class="error darken-4 font-weight-bold"
                  raised
                  @click="clearMenuDialog()"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  props: [
    'isDialog',
    'dialogHeading',
    'dialogText',
    'dialogText2',
    'dialogBtn1',
    'dialogBtn2',
    'dialogResult',
    'dialogContext',
  ],

  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'appDark',
      'appThemeFontColor',
      'validationRules',
      'pages',
    ]),
    menuContext: {
      get() {
        return this.$store.getters.menuContext;
      },
      set(value) {
        this.$store.commit('setMenuContext', value);
      },
    },
    appMenus: {
      get() {
        return this.$store.getters.appMenus;
      },
      set(value) {
        this.$store.commit('setAppMenus', value);
      },
    },
    menuDialog: {
      get() {
        return this.$store.getters.menuDialog;
      },
      set(value) {
        this.$store.commit('setMenuDialog', value);
      },
    },
    isMenuFormValid: {
      get() {
        return this.$store.getters.isMenuFormValid;
      },
      set(value) {
        this.$store.commit('setIsMenuFormValid', value);
      },
    },
    activeMenu: {
      get() {
        return this.$store.getters.activeMenu;
      },
      set(value) {
        this.$store.commit('setActiveMenu', value);
      },
    },
  },
  methods: {
    clearMenuDialog() {
      this.menuDialog = false;
      this.activeMenu.menuType = 'single';
      this.activeMenu.position = null;
      this.activeMenu.isSideMenu = true;
      this.activeMenu.isTopMenu = false;
      this.activeMenu.isBottomMenu = false;
      this.activeMenu.name = '';
      this.activeMenu.description = '';
      this.activeMenu.disabled = false;
      this.activeMenu.published = false;
      this.activeMenu.routeParam = '';
      this.activeMenu.subMenus = [];
      // alert("This will handle menu dialog action");
    },
    handleDialog(content, context) {
      // Setting context
      switch (context) {
        // case "disableResource":
        //   this.dialogContext = "disableResource";
        //   break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        // case "disableResource":
        //   this.dialogHeading = "Confirm Disabling Resource";
        //   this.dialogText =
        //     "Are you sure you want to disable this resource? This can be enabled later from database. data will remain in the database.";
        //   this.dialogBtn1 = "Cancel";
        //   this.dialogBtn2 = "Yes";
        //   this.isDialog = true;
        //   break;

        default:
          break;
      }
    },
    santizeMenuContent() {
      if (this.activeMenu.menuType !== 'single') {
        this.activeMenu.isBottomMenu = false;
      }
      this.$forceUpdate();
    },
    async saveMenuDialog() {
      // console.log('this will add menu');
      // Adding Menu to database
      if (this.$refs.appMenuForm.validate()) {
        let menuInput = {
          ...this.activeMenu,
        };
        switch (this.activeMenu.menuType) {
          case 'single':
            menuInput = {
              ...menuInput,
              routeParam:
                this.activeMenu.routeParam.routeParam !== undefined
                  ? this.activeMenu.routeParam.routeParam
                  : this.activeMenu.routeParam,
            };
            break;
          case 'double':
            menuInput.subMenus.forEach((subMenu) => {
              subMenu.routeParam =
                subMenu.routeParam.routeParam !== undefined
                  ? subMenu.routeParam.routeParam
                  : subMenu.routeParam;
            });
            break;
          case 'triple':
            menuInput.subMenus.forEach((subMenu) => {
              subMenu.subTitles.forEach((subTitle) => {
                subTitle.routeParam =
                  subTitle.routeParam.routeParam !== undefined
                    ? subTitle.routeParam.routeParam
                    : subTitle.routeParam;
              });
            });
            break;

          default:
            break;
        }
        let payload;
        payload = {
          menuInput,
        };
        if (this.menuContext !== 'add') {
          payload.id = this.activeMenu._id;
        }
        delete payload.menuInput._id;
        // return;
        if (this.menuContext === 'add') {
          let menu = await this.$store.dispatch('addMenu', payload);
          if (menu) {
            this.appMenus.push(menu);
            console.log('appMenus:', this.appMenus);
          }
        } else {
          let menu = await this.$store.dispatch('updateMenu', payload);
          if (menu) {
            const existingMenu = this.appMenus.find(
              (menu) => menu._id === payload.id
            );
            const index = this.appMenus.indexOf(existingMenu);
            this.appMenus.splice(index, 1, menu);
          }
        }
        this.clearMenuDialog();
        // console.log('current user:', this.user);
        this.$forceUpdate();
        this.menuDialog = false;
      } else {
        this.$store.dispatch('handleDialog', {
          context: 'formNotValid',
          content: null,
        });
      }
    },
    deleteMenuItem(subMenuIndex, subTitleIndex) {
      if (this.activeMenu.menuType === 'double') {
        this.activeMenu.subMenus.splice(subMenuIndex, 1);
      } else if (this.activeMenu.menuType === 'triple') {
        // Check explicitly for undefined instead of falsy
        if (subTitleIndex === undefined || subTitleIndex == null) {
          // Correctly use splice to remove exactly one element
          this.activeMenu.subMenus.splice(subMenuIndex, 1);
        } else {
          this.activeMenu.subMenus[subMenuIndex].subTitles.splice(
            subTitleIndex,
            1
          );
        }
      }
      this.$forceUpdate();
    },
    addMenuItem(subMenuIndex) {
      // Ensure subMenus array is initialized
      if (!this.activeMenu.subMenus) {
        this.activeMenu.subMenus = [];
      }

      if (this.activeMenu.menuType === 'double') {
        this.activeMenu.subMenus.push({ name: '', routeParam: '' });
      } else {
        // Handle 'triple' menuType
        if (subMenuIndex !== null) {
          // Ensure the submenu and its subtitles are initialized
          if (!this.activeMenu.subMenus[subMenuIndex]) {
            this.activeMenu.subMenus[subMenuIndex] = {
              name: '',
              subTitles: [],
            };
          } else if (!this.activeMenu.subMenus[subMenuIndex].subTitles) {
            this.activeMenu.subMenus[subMenuIndex].subTitles = [];
          }
          this.activeMenu.subMenus[subMenuIndex].subTitles.push({
            name: '',
            routeParam: '',
          });
        } else {
          // Add a new submenu with one empty subtitle
          this.activeMenu.subMenus.push({
            name: '',
            subTitles: [{ name: '', routeParam: '' }],
          });
        }
      }

      this.$forceUpdate();
    },
  },
  watch: {
    menuDialog() {
      this.$nextTick(() => {
        this.$refs.appMenuForm.resetValidation();
      });
    },
  },
};
</script>
