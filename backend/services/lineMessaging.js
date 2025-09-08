// services/lineMessaging.js
const axios = require('axios');
require('dotenv').config();

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function broadcastMessage(message) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/broadcast', 
      {
        messages: [{ type: 'text', text: message }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
    console.log('LINE Broadcast sent:', message);
  } catch (err) {
    console.error('Error sending LINE Broadcast:', err.response?.data || err.message);
  }
}

module.exports = { broadcastMessage };
