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
    <!-- 
    <v-dialog v-model="buttonDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>Insert Button</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="buttonData.text"
            label="Button Text"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="buttonData.url"
            label="Button URL"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="buttonData.color"
            label="Button Color"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="buttonDialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" text @click="insertButton">Insert</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as customBuild from '../../../ckEditorCustomBuild/build/ckeditor';
export default {
  data() {
    return {
      editor: customBuild,
      editorInstance: null,
      // buttonDialog: false,
      // buttonData: {
      //   text: '',
      //   url: '',
      //   color: '#FFFFFF',
      // },
      valid: true, // Controls the form validation state
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
      this.editorInstance = editor; // Correctly saving the editor instance to your component's data
      // console.log('Editor is now ready:', this.editorInstance);

      // Listen for custom events or perform actions specific to your editor instance
      // this.editorInstance.on('customButtonClicked', () => {
      //   this.buttonDialog = true; // Open dialog when the custom button is clicked
      // });

      // Position the toolbar appropriately
      this.editorInstance.ui
        .getEditableElement()
        .parentElement.insertBefore(
          this.editorInstance.ui.view.toolbar.element,
          this.editorInstance.ui.getEditableElement()
        );

      // // Extend the schema for custom attributes
      // editor.model.schema.extend('button', {
      //   allowAttributes: ['style', 'class', 'href'],
      // });
      // editor.conversion.attributeToAttribute({
      //   model: {
      //     name: '$text',
      //     key: 'style',
      //     values: ['color'],
      //   },
      //   view: {
      //     color: {
      //       name: 'span',
      //       styles: {
      //         color: /[\s\S]+/,
      //       },
      //     },
      //   },
      // });

      // // Set up attribute conversions
      // this.editorInstance.conversion.attributeToAttribute({
      //   model: 'style',
      //   view: 'style',
      // });
      // this.editorInstance.conversion.attributeToAttribute({
      //   model: 'href',
      //   view: 'href',
      // });
      // this.editorInstance.conversion.attributeToAttribute({
      //   model: 'class',
      //   view: 'class',
      // });
    },

    // Inside your methods in Vue component
    // insertButton(editor, buttonText, buttonUrl, buttonColor) {
    //   editor.model.change((writer) => {
    //     const buttonElement = writer.createElement('button', {
    //       href: buttonUrl,
    //       style: `color: white; background-color: ${buttonColor};
    //                 padding: 10px 15px; border: none; border-radius: 10px;
    //                 font-weight: bold; margin: 5px; display: inline-block;`,
    //     });

    //     const textNode = writer.createText(buttonText);
    //     writer.append(textNode, buttonElement);

    //     const insertPosition =
    //       editor.model.document.selection.getFirstPosition();
    //     editor.model.insertContent(buttonElement, insertPosition);
    //     writer.setSelection(buttonElement, 'on');
    //   });
    // },

    // resetForm() {
    //   this.buttonText = '';
    //   this.buttonUrl = '';
    //   this.buttonColor = '#333';
    // },
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
