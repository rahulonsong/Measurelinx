<template>
  <div v-if="itemData && itemData.items && itemData.items.length">
    <v-container fluid class="ma-0 pa-0">
      <!-- items list -->
      <v-row class="mx-auto pa-0" justify="start">
        <!-- xs and down screen -->
        <v-col
          class="mx-0 px-2 hidden-sm-and-up"
          cols="6"
          v-for="(item, index) in itemData.items"
          :key="'xs-item' + index"
        >
          <item-image :item="item"></item-image>
        </v-col>
        <!-- sm screens -->
        <v-col
          align-self="start"
          class="mx-0 px-2 hidden-md-and-up hidden-xs-only"
          cols="3"
          v-for="(item, index) in itemData.items"
          :key="'sm-item' + index"
        >
          <item-image :item="item"></item-image>
        </v-col>
        <!-- md and up screens -->
        <v-col
          align-self="start"
          class="mx-0 px-2 hidden-sm-and-down"
          cols="2"
          v-for="(item, index) in itemData.items"
          :key="'md-item' + index"
        >
          <item-image :item="item"></item-image>
        </v-col>
      </v-row>
      <!-- Pagination -->
      <v-row>
        <v-col class="d-flex justify-end">
          <v-pagination
            v-model="pageNumber"
            :length="numberOfPages"
            :total-visible="7"
            @input="onPageChange"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'itemPagination',
  props: ['itemData', 'itemPageNumber', 'numberOfPages'],
  data() {
    return {
      pageNumber: this.itemPageNumber,
    };
  },
  watch: {
    itemPageNumber(newValue) {
      this.pageNumber = newValue;
    },
  },
  methods: {
    onPageChange(newPage) {
      this.$emit('pageChanged', newPage);
    },
  },
};
</script>
