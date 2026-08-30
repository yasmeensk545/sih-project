import express from 'express';
import { analyzeRejectionText } from '../services/rejectionService.js';

export const rejectionRouter = express.Router();

rejectionRouter.post('/analyze', (req, res) => {
  const rejectionText = String(req.body?.rejection_text || '').trim();
  if (!rejectionText) {
    res.status(400).json({ error: 'rejection_text is required' });
    return;
  }
  res.json(analyzeRejectionText(rejectionText));
});
