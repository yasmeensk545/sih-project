import express from 'express';
import { MOCK_SCHEMES } from '../data/schemes.js';

export const schemesRouter = express.Router();

schemesRouter.get('/', (req, res) => {
  const category = String(req.query.category || '').toLowerCase();
  const state = String(req.query.state || '').toLowerCase();
  const query = String(req.query.q || '').toLowerCase();

  const schemes = MOCK_SCHEMES.filter((scheme) => {
    const matchesCategory = !category || category === 'all' || scheme.category.toLowerCase() === category;
    const matchesState = !state || !scheme.eligibility.states?.length || scheme.eligibility.states.includes('All India') || scheme.eligibility.states.some((item: string) => item.toLowerCase() === state);
    const matchesQuery = !query || [scheme.name, scheme.short_description, scheme.tags.join(' '), scheme.content].join(' ').toLowerCase().includes(query);
    return matchesCategory && matchesState && matchesQuery;
  });

  res.json({ schemes, count: schemes.length });
});

schemesRouter.get('/:id', (req, res) => {
  const scheme = MOCK_SCHEMES.find((item) => item.id === req.params.id);
  if (!scheme) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }
  res.json({ scheme });
});
