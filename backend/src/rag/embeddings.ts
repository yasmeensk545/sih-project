import type { Scheme } from '../types.js';
import { chunkScheme } from './chunker.js';

const fallbackEmbeddings = new Map<string, number[]>();

function hashVector(text: string, dims = 128): number[] {
  const vector = Array.from({ length: dims }, () => 0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    const idx = (code + i) % dims;
    vector[idx] += 1;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
}

export async function embedText(text: string): Promise<number[]> {
  const normalized = text.trim();
  if (!normalized) return Array(128).fill(0);

  if (!process.env.GEMINI_API_KEY) {
    return hashVector(normalized, 128);
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey || ''
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text: normalized }] }
      })
    });

    if (!response.ok) {
      throw new Error(`Embedding API failed: ${response.status}`);
    }

    const data = await response.json() as { embedding?: { values?: number[] } };
    const values = data?.embedding?.values ?? [];
    if (values.length > 0) return values;
    throw new Error('No embedding values returned');
  } catch {
    const fallback = fallbackEmbeddings.get(normalized) ?? hashVector(normalized, 128);
    fallbackEmbeddings.set(normalized, fallback);
    return fallback;
  }
}

export async function embedSchemeData(scheme: Scheme) {
  return chunkScheme(scheme).map(async (chunk) => ({
    chunk,
    embedding: await embedText(chunk.content)
  }));
}
