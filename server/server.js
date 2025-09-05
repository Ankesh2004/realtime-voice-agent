import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to generate the ephemeral client token
app.post('/api/get-token', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: 'gpt-4o-mini-realtime-preview',
        },
      }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API failed with status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    const ephemeralKey = data.value; 
    res.json({ token: ephemeralKey });

  } catch (error) {
    console.error('Error fetching ephemeral key:', error);
    res.status(500).json({ error: 'Failed to fetch ephemeral key from OpenAI.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});