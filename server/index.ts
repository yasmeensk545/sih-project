import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOCK_SCHEMES } from '../src/data/schemes';
import { checkBenefitsCombination } from '../src/services/combinationEngine';
import { evaluateEligibility, rankSchemesForProfile } from '../src/services/eligibilityEngine';
import { analyzeRejectionText } from '../src/services/rejectionService';
import { CopilotSource, Scheme, UserProfile } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isBundledServer = path.basename(__filename) === 'server.js';
const rootDir = isBundledServer ? __dirname : path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production' || isBundledServer;
const port = Number(process.env.PORT || 3000);

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const findRelevantSchemes = (query: string, profile?: UserProfile, limit = 5): Scheme[] => {
  const terms = query.toLowerCase().split(/[^a-z0-9.]+/).filter(Boolean);

  const scored = MOCK_SCHEMES.map((scheme) => {
    const searchable = [
      scheme.id,
      scheme.name,
      scheme.category,
      scheme.ministry,
      scheme.short_description,
      scheme.description,
      scheme.tags.join(' '),
      scheme.content,
      scheme.application.portal_name,
      scheme.source.nodal_agency
    ].join(' ').toLowerCase();

    const keywordScore = terms.reduce((score, term) => score + (searchable.includes(term) ? 8 : 0), 0);
    const stateScore = profile && scheme.eligibility.states?.some((state) => state.toLowerCase() === profile.state.toLowerCase()) ? 20 : 0;
    const educationScore = profile && scheme.eligibility.education?.some((education) => profile.education.toLowerCase().includes(education.toLowerCase().split(' ')[0])) ? 8 : 0;
    const tagScore = profile?.is_farmer && scheme.eligibility.is_farmer ? 16 : 0;
    const disabilityScore = profile?.has_disability && scheme.eligibility.has_disability ? 16 : 0;

    return {
      scheme,
      score: keywordScore + stateScore + educationScore + tagScore + disabilityScore
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.scheme.benefit.max - a.scheme.benefit.max)
    .slice(0, limit)
    .map((item) => item.scheme);
};

const buildCopilotAnswer = (question: string, profile?: UserProfile) => {
  const lower = question.toLowerCase();
  const relevantSchemes = findRelevantSchemes(question, profile, 5);
  const primaryScheme = relevantSchemes[0];
  const sources: CopilotSource[] = relevantSchemes.slice(0, 3).map((scheme) => ({
    title: scheme.source.name,
    url: scheme.source.url,
    department: scheme.ministry,
    scheme_id: scheme.id
  }));

  if (lower.includes('document') || lower.includes('certificate') || lower.includes('docs')) {
    const documents = primaryScheme.documents
      .map((document) => `- ${document.name} (${document.mandatory ? 'Mandatory' : 'Optional'}): ${document.purpose}`)
      .join('\n');

    return {
      answer: `For ${primaryScheme.name}, prepare these documents:\n\n${documents}\n\nApply through ${primaryScheme.application.portal_name}: ${primaryScheme.application.official_url}`,
      sources
    };
  }

  if (lower.includes('combine') || lower.includes('stack') || lower.includes('together')) {
    const selected = relevantSchemes.slice(0, 2);
    const combination = checkBenefitsCombination(selected);
    return {
      answer: `Combination check for ${selected.map((scheme) => scheme.name).join(' + ')}:\n\n${combination.summary}\n\n${combination.details.map((detail) => `- ${detail}`).join('\n')}\n\nRecommendation: ${combination.recommendation}`,
      sources
    };
  }

  if (lower.includes('eligible') || lower.includes('qualification') || lower.includes('match')) {
    const ranked = profile ? rankSchemesForProfile(MOCK_SCHEMES, profile).slice(0, 5) : relevantSchemes.map((scheme) => evaluateEligibility(scheme, profile || defaultProfile));
    const rows = ranked.map((result) => `- ${result.scheme.name}: ${result.match_score}% match, ${result.status.replaceAll('_', ' ')}, benefit ${result.scheme.benefit.display_text}`).join('\n');

    return {
      answer: `Based on the active profile, the strongest matches are:\n\n${rows}\n\nOpen the eligibility results page for rule-by-rule reasons and failed conditions.`,
      sources: ranked.slice(0, 3).map((result) => ({
        title: result.scheme.source.name,
        url: result.scheme.source.url,
        department: result.scheme.ministry,
        scheme_id: result.scheme.id
      }))
    };
  }

  const ranked = profile ? rankSchemesForProfile(relevantSchemes, profile) : relevantSchemes.map((scheme) => evaluateEligibility(scheme, defaultProfile));
  const recommendations = ranked.map((result) => {
    const topReason = result.matched_rules[0] || result.scheme.short_description;
    return `- ${result.scheme.name}: ${result.match_score}% match, benefit ${result.scheme.benefit.display_text}. Reason: ${topReason}`;
  }).join('\n');

  return {
    answer: `Here are grounded scheme recommendations from the database:\n\n${recommendations}\n\nFor final submission, verify documents on the official portal and do not rely on AI text as approval proof.`,
    sources
  };
};

const defaultProfile: UserProfile = {
  age: 24,
  gender: 'female',
  state: 'Telangana',
  district: 'Hyderabad',
  annual_income: 350000,
  income_source: 'Family Business & Part-time',
  education: 'Graduate (B.Tech / B.E)',
  occupation: 'Student / Higher Education Aspirant',
  student_status: true,
  employment_status: 'Student',
  category: 'General',
  is_farmer: false,
  has_disability: false,
  is_woman_entrepreneur: false,
  is_minority: false,
  bpl_card_holder: false
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Bharat Benefits Navigator API',
    schemes: MOCK_SCHEMES.length,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/schemes', (req, res) => {
  const category = String(req.query.category || '').toLowerCase();
  const state = String(req.query.state || '').toLowerCase();
  const query = String(req.query.q || '').toLowerCase();

  const schemes = MOCK_SCHEMES.filter((scheme) => {
    const matchesCategory = !category || category === 'all' || scheme.category.toLowerCase() === category;
    const matchesState = !state || scheme.eligibility.states?.includes('All India') || scheme.eligibility.states?.some((item) => item.toLowerCase() === state);
    const matchesQuery = !query || [scheme.name, scheme.short_description, scheme.tags.join(' '), scheme.content].join(' ').toLowerCase().includes(query);
    return matchesCategory && matchesState && matchesQuery;
  });

  res.json({ schemes, count: schemes.length });
});

app.get('/api/schemes/:id', (req, res) => {
  const scheme = MOCK_SCHEMES.find((item) => item.id === req.params.id);
  if (!scheme) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }
  res.json({ scheme });
});

app.post('/api/eligibility/check', (req, res) => {
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

app.post('/api/combination/check', (req, res) => {
  const schemeIds = Array.isArray(req.body?.scheme_ids) ? req.body.scheme_ids : [];
  const selectedSchemes = MOCK_SCHEMES.filter((scheme) => schemeIds.includes(scheme.id));
  res.json(checkBenefitsCombination(selectedSchemes));
});

app.post('/api/rejection/analyze', (req, res) => {
  const rejectionText = String(req.body?.rejection_text || '').trim();
  if (!rejectionText) {
    res.status(400).json({ error: 'rejection_text is required' });
    return;
  }
  res.json(analyzeRejectionText(rejectionText));
});

app.post('/api/copilot/chat', async (req, res) => {
  const question = String(req.body?.question || '').trim();
  const profile = req.body?.profile as UserProfile | undefined;

  if (!question) {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  const response = buildCopilotAnswer(question, profile);
  res.json({
    answer: response.answer,
    sources: response.sources,
    suggested_followups: [
      'What documents are mandatory?',
      'Can I combine this with another scheme?',
      'Why am I eligible?'
    ]
  });
});

if (isProduction) {
  const distPath = path.join(rootDir, 'dist');
  app.use(express.static(distPath, { maxAge: '1y', index: false }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: rootDir
  });
  app.use(vite.middlewares);
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Bharat Benefits Navigator running on http://localhost:${port}`);
});
