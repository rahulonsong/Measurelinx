<template>
  <!-- <v-container class="mx-auto pa-0"> -->
  <v-row justify="center" class="ma-0 pa-0">
    <v-col class="text-center ma-0 pa-0">
      <v-card class="ma-0 pa-0">
        <!-- <v-btn @click="test">Test</v-btn> -->
        <!-- Import Header Image -->
        <v-card-title
          class="title font-weight-bold importBackground white--text"
        >
          Edit Resource Reference
        </v-card-title>
        <!-- Import input Form -->
        <v-card-text
          class="text--primary ma-0 pa-0"
          style="overflow: auto; height: 600px"
        >
          <!-- <v-container> -->
          <v-row class="my-5" justify="center">
            <v-col align="center" class="text-left">
              <div class="mt-1 pa-0">
                <!-- CKEditor  -->
                <div class="black--text">
                  <ck-editor
                    class="mb-1 py-0"
                    style="contain: content; overflow: auto"
                    ref="ckEditorResourceReference"
                    id="ckEditorResourceReference"
                    :editor="editorData"
                  ></ck-editor>
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- </v-container> -->
        </v-card-text>
        <!-- Action Buttons -->
        <!-- Action Buttons -->
        <v-card-actions>
          <v-container class="my-0 py-0">
            <v-row class="mx-auto my-0 py-0" justify="center">
              <v-col cols="12" sm="12" md="12" class="text-center my-0 py-0">
                <v-btn
                  @click="handleSaveAlphaResourceReferences"
                  rounded
                  color="success"
                  elevation="12"
                  small
                  type="submit"
                  :disabled="loading"
                  class="bold px-4 font-weight-bold darken-4 white--text ml-2"
                >
                  Save
                </v-btn>
                <v-btn
                  @click="handleAlphaResourceReferencesCancel"
                  rounded
                  color="error darken-3"
                  elevation="12"
                  small
                  type="submit"
                  :disabled="loading"
                  class="bold px-4 font-weight-bold darken-4 white--text ml-2"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <!-- </v-container> -->
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'progressing',
      'activeContentIndex',
    ]),
    alphaResourceReferences: {
      get() {
        return this.$store.getters.alphaResourceReferences;
      },
      set(value) {
        this.$store.commit('setAlphaResourceReferences', value);
      },
    },
    activeReferenceIndex: {
      get() {
        return this.$store.getters.activeReferenceIndex;
      },
      set(value) {
        this.$store.commit('setActiveReferenceIndex', value);
      },
    },
    editorData: {
      get() {
        return this.$store.getters.editorData;
      },
      set(value) {
        this.$store.commit('setEditorData', value);
      },
    },
    ckEditorConfig: {
      get() {
        return this.$store.getters.ckEditorConfig;
      },
      set(value) {
        this.$store.commit('setCkEditorConfig', value);
      },
    },
    ckEditorReadOnly: {
      get() {
        return this.$store.getters.ckEditorReadOnly;
      },
      set(value) {
        this.$store.commit('setCkEditorReadOnly', value);
      },
    },
  },
  methods: {
    handleSaveAlphaResourceReferences() {
      this.alphaResourceReferences[this.activeReferenceIndex] = this.editorData;
      this.handleAlphaResourceReferencesCancel();
    },
    handleAlphaResourceReferencesCancel() {
      this.$store.commit('setAlphaResourceReferenceDialog', false);
      this.editorData = '<p></p>';
    },
    test() {},
  },
};
</script>
<style>
.myfont1 {
  font-size: 14px;
}
.inputValue input::-webkit-outer-spin-button,
.inputValue input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.importBackground {
  background: linear-gradient(90deg, #082832 0%, #c3c5d7 100%);
  color: rgb(19, 18, 18);
  background-color: black;
}
</style>
