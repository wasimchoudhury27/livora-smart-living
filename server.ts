import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'LIVORA',
    hasGeminiKey: Boolean(aiClient),
    timestamp: new Date().toISOString(),
  });
});

// AI Chat Endpoint for Property Assistant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (aiClient) {
      const systemInstruction = `You are LIVORA AI, an intelligent property management operational co-pilot for student hostels, PGs, and co-living facilities.
You have real-time visibility into the property: "${context?.propertyName || 'Hostel'}".
Key Metrics:
- Occupancy: ${context?.occupancy || 90.6}%
- Total Capacity: ${context?.totalBeds || 160} beds
- Pending Collections: ₹${context?.pendingFees?.toLocaleString?.('en-IN') || '56,000'}
- Open Maintenance Tickets: ${context?.openComplaints || 4}
- Average Food Rating: ${context?.foodRating || 4.1}/5.0

Provide crisp, highly professional, actionable operational advice. Format with bullet points and bold highlights. Keep it concise, startup-grade, and direct.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return res.json({ reply: response.text });
    }

    // If no API key configured, return null so client fallback activates seamlessly
    return res.json({ reply: null, reason: 'no_key' });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return res.json({ reply: null, error: 'ai_error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import of vite in dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StaySphere full-stack engine active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
