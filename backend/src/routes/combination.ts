import express from 'express';
import { checkBenefitsCombination } from '../services/combinationEngine.js';
import { MOCK_SCHEMES } from '../data/schemes.js';

export const combinationRouter = express.Router();

combinationRouter.post('/check', (req, res) => {
  const schemeIds = Array.isArray(req.body?.scheme_ids) ? req.body.scheme_ids : [];
  const selectedSchemes = MOCK_SCHEMES.filter((scheme) => schemeIds.includes(scheme.id));
  res.json(checkBenefitsCombination(selectedSchemes));
});
