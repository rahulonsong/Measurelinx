<template>
  <div>
    <!-- RESOURCE CONTENT-->
    <v-row>
      <v-col>
        <v-dialog
          v-model="isCkEditorContainerDialog"
          persistent
          max-width="1000"
          scrollable
        >
          <v-card max-width="1000" max-height="95vh" class="py-0 my-0">
            <v-card-title
              class="title font-weight-bold importBackground white--text"
            >
              {{ dialogTitle }}
            </v-card-title>
            <!-- Text block content -->
            <v-card-text class="editor-container">
              <!-- <v-container fluid> -->
              <v-row no-gutters>
                <v-col cols="12">
                  <div class="ck-editor-wrapper">
                    <!-- CKEditor  -->
                    <ck-editor
                      ref="ckEditorCkEditorContainer"
                      id="ckEditorCkEditorContainer"
                      :editor="editorData"
                    ></ck-editor>
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
                      @click="handleSaveCkEditorContainer"
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
                      @click="handleCkEditorContainerCancel"
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
  props: ['dialogTitle', 'context'],

  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'progressing',
      'activeContentIndex',
      'alphaResourceContent',
      'isCkEditorContainerDialog',
    ]),
    ckEditorContainer: {
      get() {
        return this.$store.getters.ckEditorContainer;
      },
      set(value) {
        this.$store.commit('setCkEditorContainer', value);
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
    handleSaveCkEditorContainer() {
      switch (this.context) {
        // Alpha Resource Content
        case 'alphaResourceContent':
          let alphaResourceContent = this.alphaResourceContent;
          ckEditorContainer[this.activeContentIndex].contentDetail =
            this.editorData;
          this.$store.commit('setAlphaResourceContent', alphaResourceContent);
          break;
        default:
          break;
      }
      this.handleCkEditorContainerCancel();
    },
    handleCkEditorContainerCancel() {
      this.$store.commit('setIsCkEditorContainerDialog', false);
      this.editorData = '<p></p>';
    },
    test() {},
  },
  watch: {
    isCkEditorContainerDialog(newValue, oldValue) {
      if (newValue) {
        // Setting focus
        setTimeout(() => {
          const ckEditor = document.getElementById('ckEditorCkEditorContainer');
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
.editor-container {
  padding: 5px; /* Adjust as needed */
}

.ck-editor-wrapper {
  border: 1px solid #ddd; /* Your desired border style */
  max-height: 300px; /* Or whatever height suits your design */
  overflow-y: auto; /* Ensures scrolling within the container */
  padding: 5px; /* Gives some space between the text and the border */
}

.ck-editor__editable {
  min-height: 300px; /* Ensures there's enough initial height */
}
.ck-editor__top {
  position: sticky;
  top: 0;
  z-index: 2; /* Ensure it stays above the content */
}

.ck-content {
  max-height: 400px;
  overflow-y: auto;
}
.ck-content {
  --app-theme-font-color: black; /* Or any default color you want for CKEditor */
}
</style>
