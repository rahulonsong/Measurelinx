<template>
  <!-- CKEditor  -->
  <div>
    <!-- <v-btn @click="test()">Test</v-btn> -->
    <ckeditor
      :key="ckEditorKey"
      :editor="editor"
      :config="ckEditorConfig"
      :disabled="ckEditorReadOnly"
      v-model="editorData"
      @ready="onReady"
    >
    </ckeditor>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as customBuild from '../../../ckEditorCustomBuild/build/ckeditor';

export default {
  data() {
    return {
      editor: customBuild,
    };
  },
  computed: {
    ...mapGetters(['ckEditorKey']),
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
  mounted() {},
  methods: {
    test() {
      // console.log('Editor Data:', this.editorData);
    },
    onReady(editor) {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
    },
  },
};
</script>
<style>
div.ck-editor__editable {
  min-height: 500px;
}
div .ck.ck-editor__editable_inline {
  border: 1px grey solid;
}
</style>
