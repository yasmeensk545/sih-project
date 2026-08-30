import type { Scheme } from '../types.js';

export interface ChunkRecord {
  id: string;
  schemeId: string;
  schemeName: string;
  type: 'overview' | 'eligibility' | 'documents' | 'application' | 'benefits' | 'combination';
  content: string;
  metadata: Record<string, string | number | boolean | null>;
}

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

export function chunkScheme(scheme: Scheme): ChunkRecord[] {
  const chunks: ChunkRecord[] = [];

  const overview = normalize(
    `${scheme.name} (${scheme.hindi_name || ''}) | ${scheme.ministry} | ${scheme.category} | ${scheme.short_description} | ${scheme.description} | Tags: ${scheme.tags.join(', ')}`
  );
  chunks.push({
    id: `${scheme.id}-overview`,
    schemeId: scheme.id,
    schemeName: scheme.name,
    type: 'overview',
    content: overview,
    metadata: { scheme_id: scheme.id, scheme_name: scheme.name, type: 'overview' }
  });

  const eligibilityText = [
    `Eligibility: ${scheme.eligibility.age ? `Age ${scheme.eligibility.age.min ?? 0}-${scheme.eligibility.age.max ?? 'No limit'}` : 'No age limit'}`,
    scheme.eligibility.income ? `Income ceiling: ₹${scheme.eligibility.income.max?.toLocaleString('en-IN') ?? 'N/A'}` : 'No income ceiling',
    scheme.eligibility.states?.length ? `Eligible states: ${scheme.eligibility.states.join(', ')}` : 'Open across all states',
    scheme.eligibility.education?.length ? `Education: ${scheme.eligibility.education.join(', ')}` : 'No specific education requirement',
    scheme.eligibility.categories?.length ? `Categories: ${scheme.eligibility.categories.join(', ')}` : 'Open to all categories',
    scheme.eligibility.additional_criteria?.length ? `Additional: ${scheme.eligibility.additional_criteria.join('; ')}` : ''
  ].filter(Boolean).join(' | ');
  chunks.push({
    id: `${scheme.id}-eligibility`,
    schemeId: scheme.id,
    schemeName: scheme.name,
    type: 'eligibility',
    content: normalize(eligibilityText),
    metadata: { scheme_id: scheme.id, scheme_name: scheme.name, type: 'eligibility' }
  });

  const documentText = scheme.documents.map((document) =>
    `${document.name} | Mandatory: ${document.mandatory} | Purpose: ${document.purpose}${document.issuing_authority ? ` | Issued by: ${document.issuing_authority}` : ''}`
  ).join(' | ');
  chunks.push({
    id: `${scheme.id}-documents`,
    schemeId: scheme.id,
    schemeName: scheme.name,
    type: 'documents',
    content: normalize(documentText),
    metadata: { scheme_id: scheme.id, scheme_name: scheme.name, type: 'documents' }
  });

  const applicationText = [
    `Application method: ${scheme.application.method}`,
    `Portal: ${scheme.application.portal_name}`,
    `Official URL: ${scheme.application.official_url}`,
    `Steps: ${scheme.application.steps.join(' > ')}`,
    scheme.application.fees ? `Fees: ${scheme.application.fees}` : '',
    `Deadline: ${scheme.deadline}`
  ].filter(Boolean).join(' | ');
  chunks.push({
    id: `${scheme.id}-application`,
    schemeId: scheme.id,
    schemeName: scheme.name,
    type: 'application',
    content: normalize(applicationText),
    metadata: { scheme_id: scheme.id, scheme_name: scheme.name, type: 'application' }
  });

  const benefitText = [
    `Benefit: ${scheme.benefit.display_text}`,
    `Benefit type: ${scheme.benefit.type}`,
    `Frequency: ${scheme.benefit.frequency || 'not specified'}`,
    `Range: ₹${scheme.benefit.min.toLocaleString('en-IN')} - ₹${scheme.benefit.max.toLocaleString('en-IN')}`
  ].join(' | ');
  chunks.push({
    id: `${scheme.id}-benefits`,
    schemeId: scheme.id,
    schemeName: scheme.name,
    type: 'benefits',
    content: normalize(benefitText),
    metadata: { scheme_id: scheme.id, scheme_name: scheme.name, type: 'benefits' }
  });

  const combinationText = [
    `Stackable: ${scheme.combination_rules.stackable}`,
    `Compatible with: ${scheme.combination_rules.compatible_with.join(', ') || 'none'}`,
    `Incompatible with: ${scheme.combination_rules.incompatible_with.join(', ') || 'none'}`,
    `Notes: ${scheme.combination_rules.notes}`
  ].join(' | ');
  chunks.push({
    id: `${scheme.id}-combination`,
    schemeId: scheme.id,
    schemeName: scheme.name,
    type: 'combination',
    content: normalize(combinationText),
    metadata: { scheme_id: scheme.id, scheme_name: scheme.name, type: 'combination' }
  });

  return chunks;
}
