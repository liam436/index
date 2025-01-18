const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Required for sending data to Discord webhook
require('dotenv').config(); // To use environment variables securely

const app = express();

// Load the secret key and Discord webhook URL from environment variables
const SECRET_KEY = process.env.SECRET_KEY || '506486p5dkjgu485ogk467SG%#';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1272569229044092948/pOYMbeqEFhUVrot8uP7c27SjHGLzgiM0JG0qwKHVfKhv3TmQ-ctkfyGlKyieyu00inC1';

app.use(bodyParser.json());

// Endpoint to handle form submissions
app.post('/webhook', async (req, res) => {
  const authHeader = req.headers['authorization'];

  // Check the Authorization header
  if (authHeader !== `Bearer ${SECRET_KEY}`) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { discordID, answers } = req.body;

  if (!discordID || !answers) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  try {
    // Send the data to Discord webhook
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: `New Application Submitted:\n**Discord ID:** ${discordID}\n**Favorite Game:** ${answers.favoriteGame}\n**Reason to Join:** ${answers.joinReason}`
      })
    });

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
