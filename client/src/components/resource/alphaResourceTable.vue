<template>
  <div>
    <!-- Insert Table button -->
    <v-row>
      <v-col>
        <v-card>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2 custom-transform-class text-none"
                medium
                icon
                v-bind="attrs"
                v-on="on"
                @click="handleAddResourceTableHeader"
              >
                <v-icon>add_box</v-icon>
              </v-btn>
            </template>
            <span>{{
              alphaResourceContent[activeContentIndex].contentTable.tableHeaders
                .length
                ? 'Add table header'
                : 'Insert Resource Table'
            }}</span>
          </v-tooltip>
        </v-card>
      </v-col>
    </v-row>
    <!-- main table Contentn -->
    <!-- item delete Dialog -->
    <v-dialog v-model="alphaResourceTableDialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- column delete Dialog -->
    <v-dialog v-model="confirmDeleteColumnDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this column?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteColumn"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteColumnConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit headers dialog -->
    <v-dialog v-model="headerAndColumnsDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Manage Headers and Columns</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row
              v-for="(header, tableHeaderIndex) in alphaResourceContent[
                activeContentIndex
              ].contentTable.tableHeaders"
              :key="tableHeaderIndex"
            >
              <v-col
                v-if="
                  tableHeaderIndex <
                  alphaResourceContent[activeContentIndex].contentTable
                    .tableHeaders.length -
                    1
                "
                cols="12"
                sm="10"
                md="10"
              >
                <v-text-field
                  v-model="header.text"
                  :label="header.value"
                ></v-text-field>
              </v-col>
              <v-col
                v-if="
                  tableHeaderIndex <
                  alphaResourceContent[activeContentIndex].contentTable
                    .tableHeaders.length -
                    1
                "
                cols="3"
                sm="1"
                md="1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      icon
                      @click="initiateColumnDelete(tableHeaderIndex)"
                    >
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete column</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="headerAndColumnsDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- New/Edit item dialog -->
    <v-dialog v-model="alphaResourceTableDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="(header, tableHeaderIndex) in alphaResourceContent[
                  activeContentIndex
                ].contentTable.tableHeaders"
                :key="tableHeaderIndex"
              >
                <v-text-field
                  v-if="
                    tableHeaderIndex <
                    alphaResourceContent[activeContentIndex].contentTable
                      .tableHeaders.length -
                      1
                  "
                  v-model="editedTableItem[header.value]"
                  :label="header.text"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Data Table -->
    <v-row>
      <v-col>
        <!-- Data table -->
        <v-data-table
          v-if="
            alphaResourceContent[activeContentIndex].contentTable.tableHeaders
              .length
          "
          :headers="
            alphaResourceContent[activeContentIndex].contentTable.tableHeaders
          "
          :items="
            alphaResourceContent[activeContentIndex].contentTable.tableItems
          "
          hide-default-footer
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-text-field
                  style="min-width: 400px; font-size: 1.1em"
                  v-model="
                    alphaResourceContent[activeContentIndex].contentTable
                      .tableDescription
                  "
                ></v-text-field>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <!-- manage headers and columns -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="handleManageHeadersAndColumns"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Manage Headers and columns</span>
              </v-tooltip>
              <!-- new item -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="alphaResourceTableDialog = true"
                  >
                    <v-icon>add_circle</v-icon>
                  </v-btn>
                </template>
                <span>Add new item</span>
              </v-tooltip>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <!-- Edit Item button -->
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ma-2"
                  icon
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  color="indigo"
                  @click="editItem(item)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Edit this item</span>
            </v-tooltip>
            <!-- Delete item button -->
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  color="indigo"
                  @click="deleteItem(item)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Delete this item</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data: () => ({
    alphaResourceTableDesc: 'Resource Table Description',
    alphaResourceTableDialog: false,
    alphaResourceTableDialogDelete: false,
    headerAndColumnsDialog: false,
    confirmDeleteColumnDialog: false,
    editedIndex: -1,
    activeColumnIndex: null,
  }),

  computed: {
    ...mapGetters([
      //   "activeContentIndex",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },
    editedTableItem: {
      get() {
        return this.$store.getters.editedTableItem;
      },
      set(value) {
        this.$store.commit('setEditedTableItem', value);
      },
    },
    defaultTableItem: {
      get() {
        return this.$store.getters.defaultTableItem;
      },
      set(value) {
        this.$store.commit('setDefaultTableItem', value);
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
  },

  props: ['activeContentIndex'],

  watch: {
    alphaResourceTableDialog(val) {
      val || this.close();
    },
    alphaResourceTableDialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // this.initialize();
  },

  methods: {
    handleAddResourceTableHeader() {
      if (
        this.alphaResourceContent[this.activeContentIndex].contentTable
          .tableHeaders.length >= 30
      ) {
        alert('The number of table columns cannot be more than 30!');
        return;
      }
      if (
        !this.alphaResourceContent[this.activeContentIndex].contentTable
          .tableHeaders.length
      ) {
        // adding the first header
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableHeaders.push({
          text: `specify header1 text`,
          align: 'start',
          sortable: false,
          value: `header1`,
        });
        // pushing the action buttons
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableHeaders.push({
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: `actions`,
        });

        let newItem = {};
        newItem[
          this.alphaResourceContent[
            this.activeContentIndex
          ].contentTable.tableHeaders[0].value
        ] = 'item name';
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableItems.push(newItem);
      } else {
        // inserting the header before Actions
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableHeaders.splice(
          this.alphaResourceContent[this.activeContentIndex].contentTable
            .tableHeaders.length - 1,
          0,
          {
            text: `specify header${
              this.alphaResourceContent[this.activeContentIndex].contentTable
                .tableHeaders.length
            } text`,
            align: 'center',
            sortable: false,
            value: `header${
              this.alphaResourceContent[this.activeContentIndex].contentTable
                .tableHeaders.length
            }`,
          }
        );
        // Adding blank column for the new header
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableItems.forEach((rowItem) => {
          rowItem[
            this.alphaResourceContent[
              this.activeContentIndex
            ].contentTable.tableHeaders[
              this.alphaResourceContent[this.activeContentIndex].contentTable
                .tableHeaders.length - 1
            ].value
          ] = '';
        });
      }
    },
    initialize() {
      this.alphaResourceContent[
        this.activeContentIndex
      ].contentTable.tableHeaders = [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
      this.alphaResourceContent[
        this.activeContentIndex
      ].contentTable.tableItems = [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        },
      ];
    },
    editItem(item) {
      // console.log('item:', item);
      if (item.actions === '') {
        delete item.actions;
      }
      this.editedIndex =
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableItems.indexOf(item);
      // console.log('Item :', item);
      this.editedTableItem = Object.assign({}, item);
      // console.log('editedTableItem :', this.editedTableItem);
      this.alphaResourceTableDialog = true;
    },
    deleteItem(item) {
      this.editedIndex =
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableItems.indexOf(item);
      this.editedTableItem = Object.assign({}, item);
      this.alphaResourceTableDialogDelete = true;
    },
    deleteItemConfirm() {
      this.alphaResourceContent[
        this.activeContentIndex
      ].contentTable.tableItems.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.alphaResourceTableDialog = false;
      this.$nextTick(() => {
        this.editedTableItem = Object.assign({}, this.defaultTableItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.alphaResourceTableDialogDelete = false;
      this.$nextTick(() => {
        this.editedTableItem = Object.assign({}, this.defaultTableItem);
        this.editedIndex = -1;
      });
    },
    deleteColumnConfirm() {
      // removing fields from each item of the table
      this.alphaResourceContent[
        this.activeContentIndex
      ].contentTable.tableItems.forEach((item) => {
        delete item[`header${this.activeColumnIndex + 1}`];
      });
      // Deleting header
      this.alphaResourceContent[
        this.activeContentIndex
      ].contentTable.tableHeaders.splice(this.activeColumnIndex, 1);

      this.confirmDeleteColumnDialog = false;
    },
    closeDeleteColumn() {
      this.confirmDeleteColumnDialog = false;
      this.activeColumnIndex = null;
    },
    save() {
      if (this.editedIndex > -1) {
        // console.log('editable Items', this.editedTableItem);
        if (this.editedTableItem.actions === '') {
          delete this.editedTableItem.actions;
        }
        Object.assign(
          this.alphaResourceContent[this.activeContentIndex].contentTable
            .tableItems[this.editedIndex],
          this.editedTableItem
        );
      } else {
        if (this.editedTableItem.actions === '') {
          delete this.editedTableItem.actions;
        }
        // console.log('editable Items', this.editedTableItem);
        this.alphaResourceContent[
          this.activeContentIndex
        ].contentTable.tableItems.push(this.editedTableItem);
      }
      this.close();
    },
    handleManageHeadersAndColumns() {
      this.headerAndColumnsDialog = true;
    },
    initiateColumnDelete(index) {
      this.confirmDeleteColumnDialog = true;
      this.activeColumnIndex = index;
    },
  },
};
</script>
