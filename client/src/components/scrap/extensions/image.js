import Image from "@tiptap/extension-image";

export const ImageDisplay = {
  FLOAT_LEFT: "left",
  FLOAT_NONE: "none",
  FLOAT_RIGHT: "right",
};
export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_DISPLAY = ImageDisplay.INLINE;

export const updateAttrs = (attrs, editor, node) => {
  const { view } = editor;
  if (!view.editable) return;
  const { state } = view;
  const newAttrs = { ...node.attrs, ...attrs };
  const { from } = state.selection;
  const transaction = state.tr.setNodeMarkup(from, null, newAttrs);
  view.dispatch(transaction);
};

export default Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: DEFAULT_IMAGE_WIDTH,
      },
      height: {
        default: null,
      },
      float: {
        default: "none",
        renderHTML: (attributes) => {
          if (!attributes.float) {
            return {};
          }

          return {
            style: `float: ${attributes.float}`,
          };
        },
        parseHTML: (element) => ({
          float: element.style.float.replace(/['"]+/g, ""),
        }),
      },
    };
  },
});
