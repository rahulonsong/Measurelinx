<div
  v-if="
    itemSearchResultsData &&
    itemSearchResultsData.items &&
    itemSearchResultsData.items.length
  "
>
            <v-container fluid class="ma-0 pa-0">
              <!-- items list -->
              <v-row class="mx-auto pa-0" justify="start">
                <!-- xs and down screen -->
                <v-col
                  class="mx-0 px-2 hidden-sm-and-up"
                  cols="6"
                  v-for="(item, index) in itemSearchResultsData.items"
                  :key="'xs-item' + index"
                >
                  <item-image :item="item"></item-image>
                </v-col>
                <!-- sm screens -->
                <v-col
                  align-self="start"
                  class="mx-0 px-2 hidden-md-and-up hidden-xs-only"
                  cols="3"
                  v-for="(item, index) in itemSearchResultsData.items"
                  :key="'sm-item' + index"
                >
                  <item-image :item="item"></item-image>
                </v-col>
                <!-- md and up screns -->
                <v-col
                  align-self="start"
                  class="mx-0 px-2 hidden-sm-and-down"
                  cols="2"
                  v-for="(item, index) in itemSearchResultsData.items"
                  :key="'md-item' + index"
                >
                  <item-image :item="item"></item-image>
                </v-col>
              </v-row>
              <!-- Pagination -->
              <v-row>
                <v-col class="d-flex justify-end">
                  <v-pagination
                    v-model="itemSearchPage"
                    :length="itemSearchNumberOfPages"
                    :total-visible="7"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </div>

<div v-if="itemPageData && itemPageData.items && itemPageData.items.length">
                            <v-container fluid class="ma-0 pa-0">
                              <!-- items list -->
                              <v-row class="mx-auto pa-0" justify="start">
                                <!-- xs and down screen -->
                                <v-col
                                  class="mx-0 px-2 hidden-sm-and-up"
                                  cols="6"
                                  v-for="(item, index) in itemPageData.items"
                                  :key="'xs-item' + index"
                                >
                                  <item-image :item="item"></item-image>
                                </v-col>
                                <!-- sm screens -->
                                <v-col
                                  align-self="start"
                                  class="mx-0 px-2 hidden-md-and-up hidden-xs-only"
                                  cols="3"
                                  v-for="(item, index) in itemPageData.items"
                                  :key="'sm-item' + index"
                                >
                                  <item-image :item="item"></item-image>
                                </v-col>
                                <!-- md and up screns -->
                                <v-col
                                  align-self="start"
                                  class="mx-0 px-2 hidden-sm-and-down"
                                  cols="2"
                                  v-for="(item, index) in itemPageData.items"
                                  :key="'md-item' + index"
                                >
                                  <item-image :item="item"></item-image>
                                </v-col>
                              </v-row>
                              <!-- Pagination -->
                              <v-row>
                                <v-col class="d-flex justify-end">
                                  <v-pagination
                                    v-model="itemPageNumber"
                                    :length="itemPageNumberOfPages"
                                    :total-visible="7"
                                  ></v-pagination>
                                </v-col>
                              </v-row>
                            </v-container>
                          </div>
