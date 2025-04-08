// Chat Widget Configuration

// Separate markdown conversion function to avoid template literal escaping issues
function convertMarkdownToHtml(text) {
  if (!text) return '';

  // Process code blocks
  text = text.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

  // Process inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Process headers
  text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Process bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Process italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.*?)_/g, '<em>$1</em>');

  // Process lists - improved handling of hierarchical lists
  text = text.replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>');
  text = text.replace(/^\s*\-\s+(.*$)/gm, '<li>$1</li>');
  text = text.replace(/^\s*\*\s+(.*$)/gm, '<li>$1</li>');
  text = text.replace(/^\s*\+\s+(.*$)/gm, '<li>$1</li>');

  // Extract heading-like items from lists (e.g. "Manual Account Deletion via Settings:")
  text = text.replace(/<li>([^:]+:)<\/li>/g, '<p><strong>$1</strong></p>');

  // Extract sub-items with indent
  text = text.replace(
    /<li>([^:]+):<\/li>\s*<li>/g,
    '<p><strong>$1:</strong></p>\n<li>'
  );

  // Convert consecutive list items to proper list structure
  text = text.replace(/<\/li>\n<li>/g, '</li><li>');

  // Handle list wrapping
  text = text.replace(/(<li>.*?<\/li>)(?:\s*\n\s*)?(<li>)/g, '$1$2');

  // Identify numbered lists vs bullet lists
  let processedText = '';
  const segments = text.split(/<li>/);
  let inList = false;
  let isOrdered = false;

  for (let i = 0; i < segments.length; i++) {
    if (i === 0) {
      // First segment is text before any list
      processedText += segments[i];
      continue;
    }

    const segment = segments[i];
    const match = segment.match(/^(\d+)\.\s+/);

    // Check if this is the start of a new list
    if (!inList) {
      inList = true;
      isOrdered = match !== null;
      processedText += (isOrdered ? '<ol><li>' : '<ul><li>') + segment;
    } else {
      // We're already in a list
      const currentIsOrdered = match !== null;

      // If list type changes, close the previous list and start a new one
      if (currentIsOrdered !== isOrdered) {
        processedText += isOrdered ? '</ol>' : '</ul>';
        isOrdered = currentIsOrdered;
        processedText += (isOrdered ? '<ol><li>' : '<ul><li>') + segment;
      } else {
        processedText += '<li>' + segment;
      }
    }

    // Check if the list ends
    if (i === segments.length - 1 && inList) {
      processedText += isOrdered ? '</ol>' : '</ul>';
    }
  }

  text = processedText || text;

  // Clean up empty lists
  text = text.replace(/<(ul|ol)>\s*<\/(ul|ol)>/g, '');

  // Make sure we have proper list closing tags
  text = text.replace(/<(ul|ol)>(.*?)(?:<\/(ul|ol)>)?$/g, '<$1>$2</$1>');

  // Format list items with proper indentation in the HTML output
  text = text.replace(/<(ul|ol)>/g, '<$1>\n  ');
  text = text.replace(/<li>/g, '  <li>');
  text = text.replace(/<\/li>/g, '</li>\n');
  text = text.replace(/<\/(ul|ol)>/g, '\n</$1>');

  // Process nested lists - detect pattern of list items containing another list
  text = text.replace(/<li>(.*?)<(ul|ol)>/g, '<li>$1\n  <$2>');

  // Fix any line breaks that could break the HTML structure
  text = text.replace(/\n\n+/g, '\n');

  // Process links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Process paragraphs
  text = text.replace(/\n\s*\n/g, '</p><p>');
  text = '<p>' + text + '</p>';
  text = text.replace(/<p><h([123456])>/g, '<h$1>');
  text = text.replace(/<\/h([123456])><\/p>/g, '</h$1>');
  text = text.replace(/<p><ul>/g, '<ul>');
  text = text.replace(/<\/ul><\/p>/g, '</ul>');

  return text;
}

const initChatWidget = () => {
  // Determine which webhook URL to use based on environment
  const webhookUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.VUE_APP_CHAT_WEBHOOK_URL_PROD
      : process.env.VUE_APP_CHAT_WEBHOOK_URL_DEV;

  //   console.log('Chat webhook URL:', webhookUrl); // Debug log

  // Set up the configuration directly matching the example implementation
  window.ChatWidgetConfig = {
    webhook: {
      url: webhookUrl,
      route: process.env.VUE_APP_CHAT_ROUTE || 'general',
      fetchOptions: {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Origin: window.location.origin,
        },
      },
    },
    branding: {
      logo:
        process.env.VUE_APP_BRAND_LOGO || 'https://papiloom.com/favicon.ico',
      name: process.env.VUE_APP_BRAND_NAME || 'Papiloom Support',
      welcomeText: '',
      responseTimeText:
        process.env.VUE_APP_CHAT_RESPONSE_TIME_TEXT ||
        'We typically reply within a few minutes',
      poweredBy: {
        text: '',
        link: 'https://papiloom.com',
      },
    },
    style: {
      primaryColor: process.env.VUE_APP_CHAT_PRIMARY_COLOR || '#854fff',
      secondaryColor: process.env.VUE_APP_CHAT_SECONDARY_COLOR || '#6b3fd4',
      position: process.env.VUE_APP_CHAT_POSITION || 'right',
      backgroundColor: process.env.VUE_APP_CHAT_BACKGROUND_COLOR || '#ffffff',
      fontColor: process.env.VUE_APP_CHAT_FONT_COLOR || '#333333',
      height: 'auto', // Changed to auto for dynamic sizing
      width: process.env.VUE_APP_CHAT_WIDTH || '380px',
    },
  };

  // Create a local copy of the chat widget script
  const chatWidgetScript = createChatWidgetScript();

  // Create a script element and add the chat widget code
  const script = document.createElement('script');
  script.textContent = chatWidgetScript;

  // Pass the markdown conversion function to the global scope
  window.convertMarkdownToHtml = convertMarkdownToHtml;

  document.body.appendChild(script);
};

// Creates the chat widget script with proper escaping
function createChatWidgetScript() {
  return `
  // Chat Widget Script
  (function() {
    // Use the markdown converter from the parent scope
    // const convertMarkdownToHtml = window.convertMarkdownToHtml || function(text) { return text; };

    // Create and inject styles
    const styles = \`
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--color-font-rgb: var(--n8n-chat-font-color-rgb, 51, 51, 51);
            --chat--width: var(--n8n-chat-width, 380px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: var(--chat--width);
            max-width: 95vw;
            height: var(--n8n-chat-height, 75vh); /* Dynamic height based on viewport */
            max-height: 750px; /* Increased maximum height on large screens (was 650px) */
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 480px) {
            .n8n-chat-widget .chat-container {
                width: 100vw;
                max-width: 100vw;
                height: 100vh; /* Full screen on mobile */
                max-height: none; /* Remove any max-height constraint */
                min-height: 100vh; /* Ensure minimum height is full viewport */
                bottom: 0;
                right: 0;
                left: 0;
                margin: 0;
                padding: 0;
                border-radius: 0; /* Remove border radius completely on mobile */
                box-shadow: none; /* Remove shadow on mobile fullscreen */
                position: fixed;
                top: 0; /* Ensure it starts from the very top */
            }
            
            .n8n-chat-widget .chat-container.position-left {
                left: 0;
                right: 0;
            }
            
            .n8n-chat-widget .chat-interface {
                height: 100vh; /* Full height for the interface too */
            }
            
            .n8n-chat-widget .chat-input textarea {
                font-size: 16px; /* Prevents zoom on iOS devices */
                padding: 14px;
            }
            
            .n8n-chat-widget .chat-toggle {
                bottom: 10px;
            }
        }

        /* Tablet devices */
        @media (min-width: 481px) and (max-width: 768px) {
            .n8n-chat-widget .chat-container {
                width: 90vw;
                max-width: 500px;
                height: 80vh; /* Bit taller on tablets */
                max-height: 600px;
            }
        }
        
        /* Laptop and desktop */
        @media (min-width: 769px) {
            .n8n-chat-widget .chat-container {
                height: 85vh; /* Increased from 80vh */
                min-height: 600px; /* Increased from 550px */
            }
        }
        
        /* Large desktop screens */
        @media (min-width: 1200px) and (min-height: 900px) {
            .n8n-chat-widget .chat-container {
                height: 90vh; /* Increased from 85vh */
                min-height: 700px; /* Increased from 650px */
                max-height: 900px; /* Increased from 850px */
            }
        }

        .n8n-chat-widget .brand-header {
            padding: 10px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
            background-color: rgba(25, 25, 25, 0.8);
            backdrop-filter: blur(10px);
            height: 50px;
            color: white;
            z-index: 10;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
            object-fit: contain;
            margin: auto 0;
            display: inline-block;
            vertical-align: middle;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 16px;
            font-weight: 500;
            color: white;
            margin: auto 0;
            display: inline-block;
            vertical-align: middle;
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            padding-bottom: 40px; /* Make room for footer */
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: #333333;
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* HTML formatting within bot messages */
        .n8n-chat-widget .chat-message.bot p {
            margin: 0 0 8px 0;
            color: #333333;
        }
        
        .n8n-chat-widget .chat-message.bot p:last-child {
            margin-bottom: 0;
        }
        
        .n8n-chat-widget .chat-message.bot p strong {
            display: block;
            margin-top: 12px;
            margin-bottom: 4px;
            color: #333333;
        }
        
        .n8n-chat-widget .chat-message.bot a {
            color: var(--chat--color-primary);
            text-decoration: underline;
        }
        
        .n8n-chat-widget .chat-message.bot ul, 
        .n8n-chat-widget .chat-message.bot ol {
            margin: 4px 0 8px 0;
            padding-left: 20px;
        }
        
        .n8n-chat-widget .chat-message.bot li {
            margin-bottom: 4px;
            color: #333333; /* Ensure list items are visible */
            position: relative;
        }
        
        /* Ensure proper numbering for ordered lists */
        .n8n-chat-widget .chat-message.bot ol {
            list-style-type: decimal;
            counter-reset: item;
            padding-left: 0;
            margin-left: 16px;
        }
        
        .n8n-chat-widget .chat-message.bot ol > li {
            counter-increment: item;
            display: block;
            position: relative;
            margin-left: 16px;
        }
        
        .n8n-chat-widget .chat-message.bot ol > li:before {
            content: counter(item) ".";
            position: absolute;
            left: -24px;
            width: 20px;
            text-align: right;
            color: #333333;
        }
        
        /* Ensure bullet points for unordered lists */
        .n8n-chat-widget .chat-message.bot ul {
            list-style-type: disc;
            padding-left: 16px;
        }
        
        /* Style for nested lists */
        .n8n-chat-widget .chat-message.bot li > ul,
        .n8n-chat-widget .chat-message.bot li > ol {
            margin-top: 4px;
            margin-bottom: 0;
        }
        
        .n8n-chat-widget .chat-message.bot strong, 
        .n8n-chat-widget .chat-message.bot b {
            font-weight: 600;
        }
        
        .n8n-chat-widget .chat-message.bot em, 
        .n8n-chat-widget .chat-message.bot i {
            font-style: italic;
        }
        
        .n8n-chat-widget .chat-message.bot pre, 
        .n8n-chat-widget .chat-message.bot code {
            background: rgba(133, 79, 255, 0.1);
            padding: 2px 4px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 90%;
            white-space: pre-wrap;
        }
        
        .n8n-chat-widget .chat-message.bot img {
            max-width: 100%;
            height: auto;
            margin: 8px 0;
            border-radius: 4px;
        }
        
        .n8n-chat-widget .chat-message.bot blockquote {
            border-left: 3px solid var(--chat--color-primary);
            padding-left: 8px;
            margin-left: 0;
            color: rgba(var(--chat--color-font-rgb, 51, 51, 51), 0.8);
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            font-size: 12px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }
    \`;

    // Inject styles directly without loading external font
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: '',
                link: 'https://papiloom.com'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333',
            width: '380px'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
    
    // Add RGB version of font color for opacity support
    const fontColorRgb = hexToRgb(config.style.fontColor || '#333333');
    widgetContainer.style.setProperty('--n8n-chat-font-color-rgb', fontColorRgb);
    
    widgetContainer.style.setProperty('--n8n-chat-height', config.style.height || '500px');
    widgetContainer.style.setProperty('--n8n-chat-width', config.style.width || '380px');

    const chatContainer = document.createElement('div');
    chatContainer.className = \`chat-container\${config.style.position === 'left' ? ' position-left' : ''}\`;
    
    const newConversationHTML = \`
        <div class="brand-header">
            <img src="\${config.branding.logo}" alt="\${config.branding.name}">
            <span>\${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">\${config.branding.responseTimeText}</p>
        </div>
    \`;

    const chatInterfaceHTML = \`
        <div class="chat-interface">
            <div class="brand-header">
                <img src="\${config.branding.logo}" alt="\${config.branding.name}">
                <span>\${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages">
                <div class="chat-footer" style="display: \${config.branding.poweredBy.text ? 'block' : 'none'}">
                    <a href="\${config.branding.poweredBy.link}" target="_blank">\${config.branding.poweredBy.text}</a>
                </div>
            </div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
        </div>
    \`;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = \`chat-toggle\${config.style.position === 'left' ? ' position-left' : ''}\`;
    toggleButton.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>\`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    function generateUUID() {
        // Use crypto.randomUUID() if available, otherwise fallback to a simple implementation
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        
        // Simple fallback for browsers that don't support crypto.randomUUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(config.webhook.fetchOptions?.headers || {})
                },
                mode: 'cors',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(\`Server responded with status: \${response.status}\`);
            }

            const responseData = await response.json();
            
            // Display the welcome message from the server
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            // Convert markdown to HTML if present
            const messageContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            botMessageDiv.innerHTML = window.convertMarkdownToHtml(messageContent);
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Chat initialization error:', error);
            
            // If server fails, show a fallback message
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = "Welcome to Papiloom Chat! How can I help you today?";
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(config.webhook.fetchOptions?.headers || {})
                },
                mode: 'cors',
                body: JSON.stringify(messageData)
            });
            
            if (!response.ok) {
                throw new Error(\`Server responded with status: \${response.status}\`);
            }
            
            const data = await response.json();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            // Convert markdown to HTML if present
            const messageContent = Array.isArray(data) ? data[0].output : data.output;
            botMessageDiv.innerHTML = window.convertMarkdownToHtml(messageContent);
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message sending error:', error);
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = "Sorry, I couldn't process your message. Please try again.";
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
    
    // Expose chat widget controls globally
    window.ChatWidget = {
        show: () => chatContainer.classList.add('open'),
        hide: () => chatContainer.classList.remove('open'),
        toggle: () => chatContainer.classList.toggle('open')
    };
    
    // Helper function to convert hex color to RGB format
    function hexToRgb(hex) {
        // Default to a dark gray if invalid hex
        if (!hex || typeof hex !== 'string') hex = '#333333';
        
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Handle shorthand hex
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        
        return \`\${r}, \${g}, \${b}\`;
    }
  })();
  `;
}

// Helper functions to control the chat widget
const chatWidgetControls = {
  show: () => {
    if (window.ChatWidget) {
      window.ChatWidget.show();
    }
  },

  hide: () => {
    if (window.ChatWidget) {
      window.ChatWidget.hide();
    }
  },

  toggle: () => {
    if (window.ChatWidget) {
      window.ChatWidget.toggle();
    }
  },
};

export { initChatWidget, chatWidgetControls };
