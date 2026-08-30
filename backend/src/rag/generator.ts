import { MOCK_SCHEMES } from '../data/schemes.js';
import type { CopilotSource, UserProfile } from '../types.js';

export interface CopilotAnswerResult {
  answer: string;
  sources: CopilotSource[];
  suggested_followups: string[];
}

export function createRagCopilotHandler() {
  return async function handleCopilot(
    question: string,
    profile?: UserProfile,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<CopilotAnswerResult> {
    const normalizedQuestion = question.trim();
    const selectedSchemes = findRelevantSchemes(normalizedQuestion, profile);
    const schemeContext = buildSchemeContextText(selectedSchemes);

    const sources: CopilotSource[] = selectedSchemes.map((scheme) => ({
      title: scheme.source.name,
      url: scheme.source.url,
      department: scheme.ministry,
      scheme_id: scheme.id
    }));

    const prompt = [
      'You are a Government Benefits Advisor for India.',
      'Use ONLY the scheme data below to answer the user question.',
      'If the answer is not supported by these schemes, say: "I do not have verified information on this."',
      'Do not invent scheme rules, amounts, or deadlines.',
      'Cite exact scheme names and official portal URLs when available.',
      'Return a clear answer in plain English. Keep it concise but practical.',
      'Scheme data:',
      schemeContext,
      'User question:',
      normalizedQuestion,
      'User profile:',
      profile ? JSON.stringify(profile) : 'No profile provided',
      'Conversation history:',
      conversationHistory.slice(-4).map((item) => `${item.role}: ${item.content}`).join('\n') || 'No prior conversation.'
    ].join('\n');

    if (!process.env.GEMINI_API_KEY) {
      return {
        answer: buildFallbackAnswer(normalizedQuestion, profile, selectedSchemes),
        sources,
        suggested_followups: buildSuggestedFollowups(normalizedQuestion, profile)
      };
    }

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        throw new Error(`LLM generation failed: ${response.status}`);
      }

      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || buildFallbackAnswer(normalizedQuestion, profile, selectedSchemes);

      return {
        answer: text,
        sources,
        suggested_followups: buildSuggestedFollowups(normalizedQuestion, profile)
      };
    } catch {
      return {
        answer: buildFallbackAnswer(normalizedQuestion, profile, selectedSchemes),
        sources,
        suggested_followups: buildSuggestedFollowups(normalizedQuestion, profile)
      };
    }
  };
}

function findRelevantSchemes(question: string, profile?: UserProfile) {
  const q = question.toLowerCase();
  const queryTerms = q.split(/[^a-z0-9]+/).filter(Boolean);

  return MOCK_SCHEMES
    .map((scheme) => {
      const searchable = [
        scheme.name,
        scheme.short_description,
        scheme.description,
        scheme.category,
        scheme.ministry,
        scheme.tags.join(' '),
        scheme.content,
        scheme.documents.map((doc) => `${doc.name} ${doc.purpose}`).join(' '),
        scheme.application.portal_name
      ].join(' ').toLowerCase();

      let score = 0;
      for (const term of queryTerms) {
        if (term.length < 2) continue;
        if (searchable.includes(term)) score += 12;
      }

      if (profile?.state && (scheme.eligibility.states?.includes('All India') || scheme.eligibility.states?.some((state) => state.toLowerCase() === profile.state.toLowerCase()))) {
        score += 18;
      }

      if (profile?.student_status && (scheme.category === 'Education' || scheme.category === 'Scholarship')) {
        score += 12;
      }

      if (profile?.state && profile.state.toLowerCase() === 'telangana' && scheme.id === 'SCH003') {
        score += 32;
      }

      if (q.includes('document') || q.includes('certificate') || q.includes('docs')) {
        score += scheme.documents.length * 2;
      }

      if (q.includes('combine') || q.includes('stack') || q.includes('together')) {
        score += scheme.combination_rules.notes ? 10 : 0;
      }

      return { scheme, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.scheme);
}

function buildSchemeContextText(schemes: typeof MOCK_SCHEMES) {
  return schemes.map((scheme) => {
    const docs = scheme.documents.map(
      (doc) => `${doc.name} (${doc.mandatory ? 'mandatory' : 'optional'}): ${doc.purpose}`
    ).join('; ');

    const application = `Portal: ${scheme.application.portal_name} | URL: ${scheme.application.official_url} | Steps: ${scheme.application.steps.join(' -> ')}`;

    return [
      `Scheme: ${scheme.name}`,
      `Ministry: ${scheme.ministry}`,
      `Category: ${scheme.category}`,
      `Summary: ${scheme.short_description}`,
      `Benefit: ${scheme.benefit.display_text}`,
      `Eligibility: ${scheme.eligibility.states?.join(', ') || 'All India'} | ${scheme.eligibility.income ? `Income ceiling: ₹${scheme.eligibility.income.max?.toLocaleString('en-IN')}` : 'No income cap'} | Education: ${scheme.eligibility.education?.slice(0, 3).join(', ') || 'Open'} | Category: ${scheme.eligibility.categories?.join(', ') || 'All categories'}`,
      `Documents: ${docs}`,
      `Application: ${application}`,
      `Combination guidance: ${scheme.combination_rules.notes}`
    ].join('\n');
  }).join('\n\n');
}

function buildFallbackAnswer(question: string, profile: UserProfile | undefined, schemes: typeof MOCK_SCHEMES): string {
  const text = question.toLowerCase();
  const primary = schemes[0] || MOCK_SCHEMES[0];

  if (text.includes('document') || text.includes('certificate') || text.includes('docs')) {
    const docs = primary.documents.slice(0, 4).map((doc) => `- ${doc.name}: ${doc.purpose}`).join('\n');
    return `For ${primary.name}, the main supporting documents are:\n\n${docs}\n\nApply through ${primary.application.portal_name}: ${primary.application.official_url}`;
  }

  if (text.includes('combine') || text.includes('stack') || text.includes('together')) {
    return `For ${primary.name}, the combination guidance is: ${primary.combination_rules.notes}. Please confirm with the scheme nodal agency before applying for multiple benefits together.`;
  }

  if (profile && (text.includes('eligibility') || text.includes('eligible'))) {
    return `Based on your profile (${profile.state}, income ₹${profile.annual_income.toLocaleString('en-IN')}, ${profile.education}), the strongest fit from the scheme data is ${primary.name}. Its benefit is ${primary.benefit.display_text}. Please verify exact eligibility and deadlines on the official portal: ${primary.application.official_url}.`;
  }

  return `The most relevant scheme for your question is ${primary.name}. It is run by ${primary.ministry}, and the official portal is ${primary.application.official_url}. Key benefit: ${primary.benefit.display_text}. For final confirmation, check the official website before applying.`;
}

function buildSuggestedFollowups(question: string, profile?: UserProfile) {
  const lower = question.toLowerCase();
  const followups = [
    'What documents are required?',
    'Can I combine this with another scheme?',
    'Am I eligible based on my profile?'
  ];

  if (profile && profile.state) {
    followups.unshift(`What schemes are available in ${profile.state}?`);
  }

  if (lower.includes('epass') || lower.includes('student') || lower.includes('education') || lower.includes('scholarship')) {
    followups.unshift('Which scholarships fit a student profile?');
  }

  return followups.slice(0, 4);
}

