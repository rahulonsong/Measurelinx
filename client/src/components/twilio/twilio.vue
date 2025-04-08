<template>
  <div class="chat-container">
    <ul class="messages">
      <li v-for="message in messages" :key="message.sid">{{ message.body }}</li>
    </ul>
    <div class="message-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type your message here"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Client } from '@twilio/conversations';

export default {
  data() {
    return {
      client: null,
      messages: [],
      newMessage: '',
      // Replace with the endpoint of your backend server
      backendBaseUrl: 'http://localhost:4000',
    };
  },
  async created() {
    try {
      const response = await axios.post(`${this.backendBaseUrl}/token`, {
        identity: 'user1', // The user's identity, dynamically set based on logged-in user
      });
      const { token } = response.data;

      this.client = new Client(token);
      this.initializeChat();
    } catch (error) {
      console.error('Error initializing Twilio', error);
    }
  },
  methods: {
    initializeChat() {
      this.client.on('stateChanged', (state) => {
        if (state === 'initialized') {
          // Client is ready to create or join conversations
          this.joinConversation();
        }
      });
    },
    async joinConversation() {
      // You can create or join a conversation based on unique identifiers
      try {
        const conversation = await this.client.getConversationByUniqueName(
          'general'
        );
        this.setupConversationEvents(conversation);
      } catch {
        // If conversation doesn't exist, create it
        const conversation = await this.client.createConversation({
          uniqueName: 'general',
        });
        this.setupConversationEvents(conversation);
      }
    },
    setupConversationEvents(conversation) {
      conversation.on('messageAdded', (message) => {
        this.messages.push(message);
      });

      conversation.on('typingStarted', (participant) => {
        // Handle typing started
      });

      conversation.on('typingEnded', (participant) => {
        // Handle typing ended
      });

      // Add local user as participant
      conversation.join().then(() => {
        this.currentConversation = conversation;
      });
    },
    sendMessage() {
      if (this.currentConversation && this.newMessage.trim() !== '') {
        this.currentConversation.sendMessage(this.newMessage);
        this.newMessage = '';
      }
    },
  },
};
</script>
<style>
.chat-container {
  max-width: 400px;
  margin: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.messages {
  list-style-type: none;
  padding: 0;
  height: 300px;
  overflow-y: scroll;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.message-input {
  display: flex;
  justify-content: space-between;
}

.message-input input {
  flex: 1;
  margin-right: 10px;
  padding: 5px;
}

.message-input button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
