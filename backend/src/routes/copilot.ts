import express from 'express';
import type { UserProfile } from '../types.js';
import { createRagCopilotHandler } from '../rag/generator.js';

export const copilotRouter = express.Router();
const handleCopilot = createRagCopilotHandler();

copilotRouter.post('/chat', async (req, res) => {
  const question = String(req.body?.question || '').trim();
  const profile = req.body?.profile as UserProfile | undefined;

  if (!question) {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  const result = await handleCopilot(question, profile, req.body?.conversation_history || []);
  res.json(result);
});
