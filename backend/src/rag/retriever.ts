import type { UserProfile } from '../types.js';
import { embedText } from './embeddings.js';
import { InMemoryVectorStore } from './vectorStore.js';

const profileBoost = (profile?: UserProfile, item?: { schemeId?: string; schemeName?: string; content?: string }) => {
  if (!profile || !item) return 0;
  let score = 0;
  const content = (item.content || '').toLowerCase();
  if (profile.state && content.includes(profile.state.toLowerCase())) score += 0.15;
  if (profile.education && content.includes(profile.education.toLowerCase())) score += 0.12;
  if (profile.category && content.includes(profile.category.toLowerCase())) score += 0.08;
  if (profile.student_status && content.includes('student')) score += 0.10;
  if (profile.is_farmer && content.includes('farmer')) score += 0.10;
  if (profile.has_disability && content.includes('disability')) score += 0.08;
  return score;
};

export async function retrieveRelevantChunks(query: string, profile?: UserProfile, store?: InMemoryVectorStore, limit = 5) {
  const vectorStore = store ?? new InMemoryVectorStore();
  const queryEmbedding = await embedText(query);
  const rawResults = vectorStore.search(queryEmbedding, 10);

  const reranked = rawResults
    .map((item) => ({
      ...item,
      boostedScore: item.score + profileBoost(profile, item)
    }))
    .sort((a, b) => b.boostedScore - a.boostedScore)
    .slice(0, limit);

  return reranked;
}
