// twilioConfig.js

const twilio = require("twilio");
const axios = require("axios");

// Replace these variables with your Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioChatServiceSid = process.env.TWILIO_PAPILOOM_CHAT_SERVICE_SID;

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function generateToken(identity) {
  const chatGrant = new ChatGrant({
    serviceSid: twilioChatServiceSid,
  });

  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    twilioChatServiceSid,
    { identity: identity }
  );
  token.addGrant(chatGrant);

  return token.toJwt();
}

async function sendMessage(req, res) {
  // const parsedBody = JSON.parse(req.rawBody.toString());
  const { Body, From } = req.body;
  // console.log(`Received message from ${From}: ${Body}`);

  try {
    const message = await client.messages.create({
      body: "Received your message!",
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
      to: From,
    });
    // console.log(message.sid);
    res.status(200).end();
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).end();
  }
}

async function sendNewMessage({ body, to }) {
  try {
    const message = await client.messages.create({
      body,
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
      to,
    });
    // console.log(message.sid);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function retrieveWhatsappTemplate(templateName) {
  const accountSid = TWILIO_ACCOUNT_SID; // Replace with your Account SID
  const authToken = TWILIO_AUTH_TOKEN; // Replace with your Auth Token
  const url = "https://messaging.twilio.com/v1/Channels/WhatsApp/Templates";

  try {
    const response = await axios.get(url, {
      auth: {
        username: accountSid,
        password: authToken,
      },
    });

    const templates = response.data.whatsapp_templates;
    const template = templates.find((t) => t.template_name === templateName);

    return template || "Template not found";
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    throw error;
  }
}

async function sendWhatsAppMessageTemplate(req, res) {
  const to = req.body.to || "+919895843177"; // Default number if not provided in req
  const templateName = req.body.templateName || "welcome_2"; // Default template if not provided

  try {
    // Retrieve the template content
    const template = await retrieveWhatsappTemplate(templateName);
    const body = template.languages[0].content; // Use the template content

    // Send the WhatsApp message
    const message = await client.messages.create({
      from: "whatsapp:+19014459271", // Replace with your Twilio WhatsApp number
      body: body,
      to: `whatsapp:${to}`,
    });
    // console.log("Message sent:", message.sid);

    // Send a successful response
    res.status(200).send({
      message: "WhatsApp message sent successfully",
      sid: message.sid,
    });
  } catch (error) {
    console.error("Failed to send message:", error);

    // Send an error response
    res.status(500).send({
      error: "Failed to send WhatsApp message",
      details: error.message,
    });
  }
}

module.exports = {
  sendMessage,
  sendNewMessage,
  sendWhatsAppMessageTemplate,
  generateToken,
};
