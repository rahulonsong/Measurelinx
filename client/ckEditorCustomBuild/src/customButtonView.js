import ButtonView from '@ckeditor/ckeditor5-ui/build/packages/ui/button/buttonview';
import CustomDialog from './customDialog'; // Assuming CustomDialog is in a separate file

class CustomButtonView extends ButtonView {
  constructor(locale) {
    super(locale);

    this.set({
      label: 'Insert Button',
      icon: '...', // Add your custom icon class
      tooltip: true,
    });

    this.on('execute', () => {
      const dialog = new CustomDialog(editor.locale);
      dialog.render(); // Render the dialog within the editor UI

      dialog.on('submit', (data) => {
        this.editor.plugins
          .get('customButton')
          .insertButton(
            editor,
            data.buttonText,
            data.buttonUrl,
            data.buttonColor
          );
      });
    });
  }
}

export default CustomButtonView;
