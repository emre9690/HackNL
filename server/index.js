import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/ai', aiRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`StadKompas server running on http://localhost:${PORT}`);
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('Claude API key detected — using live AI responses.');
  } else {
    console.log('No ANTHROPIC_API_KEY found — using mock responses.');
  }
});
