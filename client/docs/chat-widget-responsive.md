# Chat Widget Configuration

The chat widget now supports dynamic width on mobile devices, HTML and Markdown formatting for messages, and improved footer positioning.

## Responsive Design

The chat window will:

- Take up the full width of the screen on phones (< 480px width)
- Use 90% of viewport width (max 500px) on tablets (481-768px width)
- Use the configured width on larger screens (default or VUE_APP_CHAT_WIDTH environment variable)

This ensures maximum space for typing on mobile devices while maintaining a reasonable size on desktop.

## Environment Configuration

To configure the chat widget width on desktop and larger screens, you can set the following environment variable in your `.env` file:

```
VUE_APP_CHAT_WIDTH=450px
```

The default width if not specified is 380px.

## Mobile-Friendly Enhancements

The mobile view includes several enhancements:

- Bottom-docked design with rounded top corners
- Larger text input for easier typing
- Font size adjustment to prevent auto-zooming on iOS
- Full-width design to maximize typing space
- Increased height (90% of viewport) for more message visibility

## HTML and Markdown Formatting in Chat Messages

The chat widget now supports both HTML formatting and Markdown syntax in bot responses from n8n workflows. This allows for rich text messages using either format.

### Supported Markdown Features

- Headers: `# Heading 1`, `## Heading 2`, `### Heading 3`
- Bold text: `**bold text**` or `__bold text__`
- Italic text: `*italic text*` or `_italic text_`
- Lists:
  - `- Item 1`
  - `1. Numbered item`
- Code: `` `inline code` `` or ` ```code block``` `
- Links: `[link text](https://example.com)`

### Example Usage in n8n Workflow

When configuring your n8n workflow responses, you can include either HTML tags or Markdown in the output:

```json
{
  "output": "### User Data Deletion Process\n\n**1. How to Request Data Deletion**\nYou can request the deletion of your account and associated personal information by:\n\n- **Manual Account Deletion** via Settings\n- Log in to your Papiloom account\n- Navigate to **Account Settings**\n- Click on **Delete My Account**"
}
```

This will be rendered with proper formatting in the chat widget.

## Improved Footer

The "Powered by Papiloom" footer has been repositioned to the bottom of the chat window for a cleaner, more professional appearance.
