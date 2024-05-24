require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/create-deal', async (req, res) => {
  const formData = req.body;

  try {
    const response = await axios.post(
      `https://api.pipedrive.com/v1/deals?api_token=${process.env.PIPEDRIVE_API_TOKEN}`,
      formData
    );

    if (response.data && response.data.data && response.data.data.id) {
      res.status(200).json({
        success: true,
        dealId: response.data.data.id,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create deal',
      });
    }
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the deal',
    });
  }
});

app.get('/pipedrive/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('No authorization code provided.');
  }

  try {
    const response = await axios.post('https://oauth.pipedrive.com/oauth/token', {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.BASE_URL}/pipedrive/callback`,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    const { access_token } = response.data;
    console.log('Access Token:', access_token);

    res.send('Authorization successful! You can close this tab.');
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    res.status(500).send('An error occurred during the authorization process.');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
