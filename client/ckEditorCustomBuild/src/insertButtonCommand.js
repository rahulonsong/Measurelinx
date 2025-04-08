import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertButtonCommand extends Command {
  execute({ text, url, color }) {
    const editor = this.editor;
    editor.model.change((writer) => {
      // Create the button element with provided styles and href.
      const buttonElement = writer.createElement('button', {
        href: url,
        style: `color: white; background-color: ${color}; padding: 5px 10px; border: none; border-radius: 5px;`,
      });

      // Append text to the button.
      const textNode = writer.createText(text);
      writer.append(textNode, buttonElement);

      // Find a valid insertion position based on current selection.
      const insertPosition = findValidPosition(editor, buttonElement);

      if (insertPosition) {
        // Insert the button at the calculated position.
        editor.model.insertContent(buttonElement, insertPosition);

        // After insertion, set the selection to the button.
        // 'on' parameter sets the selection on the inserted button.
        writer.setSelection(buttonElement, 'on');
      } else {
        console.error('No valid position found for button insertion');
      }
    });
  }
}

// Helper function to find a valid position for button insertion.
function findValidPosition(editor, buttonElement) {
  const selection = editor.model.document.selection;
  const allowedIn = editor.model.schema.findAllowedParent(
    selection.getFirstPosition(),
    buttonElement
  );

  // If the current position is allowed, use it; otherwise, find the nearest valid position.
  return allowedIn ? selection.getFirstPosition() : null;
}
