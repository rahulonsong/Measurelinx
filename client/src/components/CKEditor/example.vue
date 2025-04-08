<template>
  <div>
    <!-- Use simpler CSS and HTML structure if you do not want to integrate i.e. the Revision history feature. !-->
    <div id="presence-list-container"></div>

    <div id="editor-container">
      <div class="container">
        <div id="editor"></div>
        <div
          class="sidebar"
          id="sidebar"
        ></div>
      </div>
    </div>

    <div id="revision-viewer-container">
      <div class="container">
        <div id="revision-viewer-editor"></div>
        <div
          class="sidebar"
          id="revision-viewer-sidebar"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
// This sample still does not showcase all CKEditor 5 features (!)
// Visit https://ckeditor.com/docs/ckeditor5/latest/features/index.html to browse all the features.
CKEDITOR.ClassicEditor.create(document.querySelector("#editor"), {
  // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
  toolbar: {
    items: [
      "ckbox",
      "uploadImage",
      "|",
      "exportPDF",
      "exportWord",
      "|",
      "comment",
      "trackChanges",
      "revisionHistory",
      "|",
      "findAndReplace",
      "selectAll",
      "|",
      "bold",
      "italic",
      "strikethrough",
      "underline",
      "removeFormat",
      "|",
      "bulletedList",
      "numberedList",
      "todoList",
      "|",
      "outdent",
      "indent",
      "|",
      "undo",
      "redo",
      "-",
      "heading",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "highlight",
      "|",
      "alignment",
      "|",
      "link",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "codeBlock",
      "htmlEmbed",
      "|",
      "specialCharacters",
      "horizontalLine",
      "pageBreak",
      "|",
      // Intentionally skipped buttons to keep the toolbar smaller, feel free to enable them:
      // 'code', 'subscript', 'superscript', 'textPartLanguage', '|',
      // ** To use source editing remember to disable real-time collaboration plugins **
      // 'sourceEditing'
    ],
    shouldNotGroupWhenFull: true,
  },
  // Changing the language of the interface requires loading the language file using the <script> tag.
  // language: 'es',
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
  fontFamily: {
    options: [
      "default",
      "Arial, Helvetica, sans-serif",
      "Courier New, Courier, monospace",
      "Georgia, serif",
      "Lucida Sans Unicode, Lucida Grande, sans-serif",
      "Tahoma, Geneva, sans-serif",
      "Times New Roman, Times, serif",
      "Trebuchet MS, Helvetica, sans-serif",
      "Verdana, Geneva, sans-serif",
    ],
    supportAllValues: true,
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22],
    supportAllValues: true,
  },
  // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
  // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
  // htmlSupport: {
  // 	allow: [
  // 		{
  // 			name: /.*/,
  // 			attributes: true,
  // 			classes: true,
  // 			styles: true
  // 		}
  // 	]
  // },
  // Be careful with enabling previews
  // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
  htmlEmbed: {
    showPreviews: true,
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
  mention: {
    feeds: [
      {
        marker: "@",
        feed: [
          "@apple",
          "@bears",
          "@brownie",
          "@cake",
          "@cake",
          "@candy",
          "@canes",
          "@chocolate",
          "@cookie",
          "@cotton",
          "@cream",
          "@cupcake",
          "@danish",
          "@donut",
          "@dragée",
          "@fruitcake",
          "@gingerbread",
          "@gummi",
          "@ice",
          "@jelly-o",
          "@liquorice",
          "@macaroon",
          "@marzipan",
          "@oat",
          "@pie",
          "@plum",
          "@pudding",
          "@sesame",
          "@snaps",
          "@soufflé",
          "@sugar",
          "@sweet",
          "@topping",
          "@wafer",
        ],
        minimumCharacters: 1,
      },
    ],
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
  placeholder: "Welcome to CKEditor 5!",
  // Used by real-time collaboration
  cloudServices: {
    // Be careful - do not use the development token endpoint on production systems!
    tokenUrl:
      "https://92341.cke-cs.com/token/dev/ZqrBCQm15MjS9E4NdzjEYB5aynEtLukptclO?limit=10",
    webSocketUrl: "wss://92341.cke-cs.com/ws",
  },
  collaboration: {
    // Modify the channelId to simulate editing different documents
    // https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration-integration.html#the-channelid-configuration-property
    channelId: "document-id-2",
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/annotations/annotations-custom-configuration.html#sidebar-configuration
  sidebar: {
    container: document.querySelector("#sidebar"),
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list
  presenceList: {
    container: document.querySelector("#presence-list-container"),
  },
  // Add configuration for the comments editor if the Comments plugin is added.
  // https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/annotations/annotations-custom-configuration.html#comment-editor-configuration
  comments: {
    editorConfig: {
      extraPlugins: CKEDITOR.ClassicEditor.builtinPlugins.filter((plugin) => {
        // Use e.g. Ctrl+B in the comments editor to bold text.
        return [
          "Bold",
          "Italic",
          "Underline",
          "List",
          "Autoformat",
          "Mention",
        ].includes(plugin.pluginName);
      }),
      // Combine mentions + Webhooks to notify users about new comments
      // https://ckeditor.com/docs/cs/latest/guides/webhooks/events.html
      mention: {
        feeds: [
          {
            marker: "@",
            feed: [
              "@Baby Doe",
              "@Joe Doe",
              "@Jane Doe",
              "@Jane Roe",
              "@Richard Roe",
            ],
            minimumCharacters: 1,
          },
        ],
      },
    },
  },
  // Do not include revision history configuration if you do not want to integrate it.
  // Remember to remove the 'revisionHistory' button from the toolbar in such a case.
  revisionHistory: {
    editorContainer: document.querySelector("#editor-container"),
    viewerContainer: document.querySelector("#revision-viewer-container"),
    viewerEditorElement: document.querySelector("#revision-viewer-editor"),
    viewerSidebarContainer: document.querySelector("#revision-viewer-sidebar"),
  },
  // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/ckbox.html
  ckbox: {
    // Be careful - do not use the development token endpoint on production systems!
    tokenUrl:
      "https://92341.cke-cs.com/token/dev/ZqrBCQm15MjS9E4NdzjEYB5aynEtLukptclO?limit=10",
  },
  // License key is required only by the Pagination plugin and non-realtime Comments/Track changes.
  licenseKey: "iBWm5ZN/ec3bCOfJHUMy68Kz832EZNUzHkRyGqpv5r6o7xdZANiqLzE1Yw==",
  removePlugins: [
    // Before enabling Pagination plugin, make sure to provide proper configuration and add relevant buttons to the toolbar
    // https://ckeditor.com/docs/ckeditor5/latest/features/pagination/pagination.html
    "Pagination",
    // Intentionally disabled, file uploads are handled by CKBox
    "Base64UploadAdapter",
    // Intentionally disabled, file uploads are handled by CKBox
    "CKFinder",
    // Intentionally disabled, file uploads are handled by CKBox
    "EasyImage",
    // Requires additional license key
    "WProofreader",
    // Incompatible with real-time collaboration
    "SourceEditing",
    // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
    // from a local file system (file://) - load this site via HTTP server if you enable MathType
    "MathType",
    // If you would like to adjust enabled collaboration features:
    // 'RealTimeCollaborativeComments',
    // 'RealTimeCollaborativeTrackChanges',
    // 'RealTimeCollaborativeRevisionHistory',
    // 'PresenceList',
    // 'Comments',
    // 'TrackChanges',
    // 'TrackChangesData',
    // 'RevisionHistory',
  ],
})
  .then((editor) => {
    window.editor = editor;

    // Example implementation to switch between different types of annotations according to the window size.
    // https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/annotations/annotations-display-mode.html
    const annotationsUIs = editor.plugins.get("AnnotationsUIs");
    const sidebarElement = document.querySelector(".sidebar");
    let currentWidth;

    function refreshDisplayMode() {
      // Check the window width to avoid the UI switching when the mobile keyboard shows up.
      if (window.innerWidth === currentWidth) {
        return;
      }
      currentWidth = window.innerWidth;

      if (currentWidth < 1000) {
        sidebarElement.classList.remove("narrow");
        sidebarElement.classList.add("hidden");
        annotationsUIs.switchTo("inline");
      } else if (currentWidth < 1300) {
        sidebarElement.classList.remove("hidden");
        sidebarElement.classList.add("narrow");
        annotationsUIs.switchTo("narrowSidebar");
      } else {
        sidebarElement.classList.remove("hidden", "narrow");
        annotationsUIs.switchTo("wideSidebar");
      }
    }

    editor.ui.view.listenTo(window, "resize", refreshDisplayMode);
    refreshDisplayMode();

    return editor;
  })
  .catch((error) => {
    console.error("There was a problem initializing the editor.", error);
  });
</script>

<style>
/* body {
            max-width: 1200px;
            padding: 0 20px;
            margin: 20px auto;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            overflow-y: scroll;
        } */

/* Set the minimum height of Classic editor */
.ck.ck-editor__editable_inline:not(.ck-editor__nested-editable) {
  min-height: 400px;
}

/* Styles to render an editor with a sidebar for comments & suggestions */
.container {
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 320px;
}

#editor-container .ck.ck-editor {
  width: 860px;
}

#editor-container .sidebar {
  margin-left: 20px;
}

#editor-container .sidebar.narrow {
  width: 30px;
}

/* Keep the automatic height of the editor for adding comments */
.ck-annotation-wrapper .ck.ck-editor__editable_inline {
  min-height: auto;
}

/* Styles for viewing revision history */
#revision-viewer-container {
  display: none;
}

#revision-viewer-container .ck.ck-editor {
  width: 860px;
}

#revision-viewer-container .ck.ck-content {
  min-height: 400px;
}

#revision-viewer-container .sidebar {
  border: 1px #c4c4c4 solid;
  margin-left: -1px;
  width: 320px;
}

#revision-viewer-container .ck.ck-revision-history-sidebar__header {
  height: 39px;
  background: #fafafa;
}

.hidden {
  display: none !important;
}
</style>






