<template>
  <v-list dense nav class="my-0 py-0">
    <!-- single Level Category -->
    <v-list-item class="my-0 py-0" v-if="category.categoryType === 'single'">
      <v-list-item-title>{{ category.name }}</v-list-item-title>
    </v-list-item>
    <!-- Double Level category -->
    <v-list-group
      v-if="category.categoryType === 'double'"
      ripple
      :value="false"
      class="my-0 py-0"
    >
      <template v-slot:activator>
        <v-list-item-content class="pa-0">
          <v-list-item-title> {{ category.name }} </v-list-item-title>
        </v-list-item-content>
      </template>
      <!--SubCategories-->
      <v-list-item
        v-for="(subCategory, subCategoryIndex) in category.subCategories"
        :key="'subCategory' + subCategoryIndex"
        style="margin-left: 20px"
      >
        <v-list-item-title style="margin-left: 20px">{{
          subCategory.name
        }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
    <!-- Triple Level Category-->
    <v-list-group
      v-if="category.categoryType === 'triple'"
      ripple
      :value="false"
      class="my-0 py-0"
    >
      <template v-slot:activator>
        <v-list-item-content class="pa-0">
          <v-list-item-title> {{ category.name }} </v-list-item-title>
        </v-list-item-content>
      </template>
      <!-- Subcategories-->
      <v-list
        nav
        dense
        class="my-0 py-0"
        v-for="(subCategory, subCategoryIndex) in category.subCategories"
        :key="'subCategory' + subCategoryIndex"
      >
        <v-list-group :value="false" dense ripple no-action sub-group>
          <template v-slot:activator>
            <v-list-item-content class="pa-0" style="margin-left: -10px">
              <v-list-item-title>{{ subCategory.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <!-- Subtitles -->
          <v-list-item
            v-for="(subTitle, subTitleIndex) in subCategory.subTitles"
            :key="'subTitle' + subTitleIndex"
          >
            <v-list-item-title style="margin-left: -20px">{{
              subTitle.name
            }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-list-group>
  </v-list>
</template>
<script>
export default {
  name: 'categoryTemplate',
  data() {
    return {};
  },
  props: ['category'],
  methods: {},
};
</script>
