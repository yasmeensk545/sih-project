import 'dotenv/config';
import { MOCK_SCHEMES } from '../src/data/schemes.js';
import { chunkScheme } from '../src/rag/chunker.js';
import { embedText } from '../src/rag/embeddings.js';
import { InMemoryVectorStore } from '../src/rag/vectorStore.js';
async function ingest() {
    const store = new InMemoryVectorStore(process.cwd() + '/data/embeddings.json');
    for (const scheme of MOCK_SCHEMES) {
        const chunks = chunkScheme(scheme);
        for (const chunk of chunks) {
            const embedding = await embedText(chunk.content);
            store.add(chunk, embedding);
        }
    }
    await store.save();
    console.log(`Indexed ${MOCK_SCHEMES.length} schemes and ${MOCK_SCHEMES.flatMap((scheme) => chunkScheme(scheme)).length} chunks.`);
}
ingest().catch((error) => {
    console.error('Ingestion failed:', error);
    process.exit(1);
});
