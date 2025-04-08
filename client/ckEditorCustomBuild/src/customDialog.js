import View from '@ckeditor/ckeditor5-ui/build/packages/ui/view';
import { LabeledFieldView, InputTextView } from '@ckeditor/ckeditor5-ui';
import ButtonView from '@ckeditor/ckeditor5-ui/build/packages/ui/button/buttonview';

class CustomDialog extends View {
  constructor(locale) {
    super(locale);

    const labelText = new LabeledFieldView(
      locale,
      () => new InputTextView(locale)
    );
    labelText.label = 'Button Text';
    labelText.fieldView.placeholder = 'Enter button text';

    const labelURL = new LabeledFieldView(
      locale,
      () => new InputTextView(locale)
    );
    labelURL.label = 'Button URL';
    labelURL.fieldView.placeholder = 'http://example.com';

    const labelColor = new LabeledFieldView(
      locale,
      () => new InputTextView(locale)
    );
    labelColor.label = 'Button Color';
    labelColor.fieldView.placeholder = '#333';

    const submitButton = new ButtonView(locale);
    submitButton.set({
      type: 'submit',
      label: 'Insert Button',
      withText: true,
    });

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['custom-dialog'],
      },
      children: [labelText, labelURL, labelColor, submitButton],
      on: {
        submit: this._handleSubmit,
      },
    });

    // Store references to inputs
    this.labelText = labelText;
    this.labelURL = labelURL;
    this.labelColor = labelColor;
    this.submitButton = submitButton;

    // Ensure events are bound correctly
    this.delegate('submit').to(this.submitButton);
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.fire('submit', {
      buttonText: this.labelText.fieldView.value,
      buttonUrl: this.labelURL.fieldView.value,
      buttonColor: this.labelColor.fieldView.value,
    });
  }

  render() {
    super.render();
    document.body.appendChild(this.element); // Remove this line, rendering happens within CustomButtonView
  }

  destroy() {
    super.destroy();
    this.element.remove();
  }
}

export default CustomDialog;
