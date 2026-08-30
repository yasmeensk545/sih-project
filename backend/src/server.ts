import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { schemesRouter } from './routes/schemes.js';
import { eligibilityRouter } from './routes/eligibility.js';
import { combinationRouter } from './routes/combination.js';
import { rejectionRouter } from './routes/rejection.js';
import { copilotRouter } from './routes/copilot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Bharat Benefits Navigator API',
    schemes: 15,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/schemes', schemesRouter);
app.use('/api/eligibility', eligibilityRouter);
app.use('/api/combination', combinationRouter);
app.use('/api/rejection', rejectionRouter);
app.use('/api/copilot', copilotRouter);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist, { index: false }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Bharat Benefits Navigator backend running on http://localhost:${port}`);
});
