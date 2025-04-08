<template>
  <div>
    <!--resource content info-->
    <v-row>
      <v-col>
        <v-dialog
          v-model="isAlphaResourceContentDialog"
          persistent
          max-width="1000"
          scrollable
        >
          <v-card
            light
            max-width="1000"
            max-height="95vh"
            style="overflow: hidden"
            class="py-0 my-0"
          >
            <!-- <v-btn @click="test">Test</v-btn> -->
            <!-- Import Header Image -->
            <v-card-title
              class="title font-weight-bold importBackground white--text"
            >
              Edit Resource Content
            </v-card-title>
            <!-- Import input Form -->
            <v-card-text
              class="text--primary ma-0 pa-0"
              style="overflow: auto; height: 600px"
            >
              <!-- <v-container class="my-0 py-0"> -->
              <!-- Intro-->
              <v-row wrap class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="ma-0 pa-0">
                  <div class="mt-1 pa-0">
                    <!-- CKEditor  -->
                    <div class="black--text">
                      <ck-editor
                        class="mb-1 py-0"
                        style="contain: content; overflow: auto"
                        ref="ckEditorAlphaResourceContent"
                        id="ckEditorAlphaResourceContent"
                        :editor="editorData"
                      ></ck-editor>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <!-- </v-container> -->
            </v-card-text>
            <!-- Action Buttons -->
            <v-card-actions>
              <v-container class="my-0 py-0">
                <v-row class="mx-auto my-0 py-0" justify="center">
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    class="text-center my-0 py-0"
                  >
                    <v-btn
                      @click="handleSaveAlphaResourceContent"
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
                      @click="handleAlphaResourceContentCancel"
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
        </v-dialog>
      </v-col>
    </v-row>
  </div>
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
      'isAlphaResourceContentDialog',
    ]),
    alphaResourceContent: {
      get() {
        return this.$store.getters.alphaResourceContent;
      },
      set(value) {
        this.$store.commit('setAlphaResourceContent', value);
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
    handleSaveAlphaResourceContent() {
      this.alphaResourceContent[this.activeContentIndex].contentDetail =
        this.editorData;
      this.handleAlphaResourceContentCancel();
    },
    handleAlphaResourceContentCancel() {
      this.$store.commit('setIsAlphaResourceContentDialog', false);
      this.editorData = '<p></p>';
    },
    test() {},
  },
  watch: {
    isAlphaResourceContentDialog(newValue, oldValue) {
      if (newValue) {
        // Setting focus
        setTimeout(() => {
          const ckEditor = document.getElementById(
            'ckEditorAlphaResourceContent'
          );
          let collection = ckEditor.childNodes;
          let editableElement = collection
            .item(1)
            .childNodes.item(2)
            .childNodes.item(1);
          //  Move focus to END of input field
          const selection = window.getSelection();
          const range = document.createRange();
          selection.removeAllRanges();
          range.selectNodeContents(editableElement);
          range.collapse(false);
          selection.addRange(range);
          editableElement.focus();
        }, 1);
      }
    },
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
