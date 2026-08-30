import express from 'express';
import { rankSchemesForProfile } from '../services/eligibilityEngine.js';
import { MOCK_SCHEMES } from '../data/schemes.js';
import type { UserProfile } from '../types.js';

export const eligibilityRouter = express.Router();

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

eligibilityRouter.post('/check', (req, res) => {
  const profile = req.body?.profile as UserProfile | undefined;
  if (!profile) {
    res.status(400).json({ error: 'profile is required' });
    return;
  }

  const results = rankSchemesForProfile(MOCK_SCHEMES, profile);
  const eligible = results.filter((result) => result.status === 'eligible' || result.status === 'potentially_eligible');

  res.json({
    results,
    summary: {
      total_schemes: results.length,
      eligible_count: eligible.length,
      high_match_count: results.filter((result) => result.match_score >= 80).length,
      estimated_max_benefit: money(eligible.slice(0, 5).reduce((total, result) => total + result.scheme.benefit.max, 0))
    }
  });
});
