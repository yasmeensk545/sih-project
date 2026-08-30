import fs from 'node:fs/promises';
import path from 'node:path';
import type { ChunkRecord } from './chunker.js';

export interface StoredVector {
  id: string;
  schemeId: string;
  schemeName: string;
  type: string;
  content: string;
  embedding: number[];
  metadata: Record<string, string | number | boolean | null>;
}

export class InMemoryVectorStore {
  private vectors: Map<string, StoredVector>;
  private filePath: string;

  constructor(filePath = path.resolve(process.cwd(), 'data', 'embeddings.json')) {
    this.vectors = new Map();
    this.filePath = filePath;
  }

  async load() {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(content) as StoredVector[];
      for (const item of parsed) {
        this.vectors.set(item.id, item);
      }
    } catch {
      this.vectors.clear();
    }
    return this;
  }

  async save() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify([...this.vectors.values()], null, 2), 'utf-8');
  }

  add(chunk: ChunkRecord, embedding: number[]) {
    this.vectors.set(chunk.id, {
      id: chunk.id,
      schemeId: chunk.schemeId,
      schemeName: chunk.schemeName,
      type: chunk.type,
      content: chunk.content,
      embedding,
      metadata: chunk.metadata
    });
  }

  getAll() {
    return [...this.vectors.values()];
  }

  search(queryEmbedding: number[], limit = 5) {
    const scored = [...this.vectors.values()].map((vector) => ({
      ...vector,
      score: cosineSimilarity(queryEmbedding, vector.embedding)
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
