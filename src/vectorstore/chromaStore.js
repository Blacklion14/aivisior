// src/db/chromaStore.js
import { ChromaClient } from "chromadb";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

// ✅ Set up Ollama embeddings once
const ollamaEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
});

// ✅ Wrap embeddings so Chroma understands it
const embeddingFunction = {
  generate: async (documents) => {
    const vectors = [];
    for (const doc of documents) {
      const res = await ollamaEmbeddings.embedQuery(doc);
      vectors.push(res);
    }
    return vectors;
  },
};

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});

export async function getOrCreateCollection(name = "relationship_books") {
  // always provide embeddingFunction
  return await client.getOrCreateCollection({
    name,
    metadata: { description: "Chunks of relationship advice books" },
    embeddingFunction,
  });
}

export async function addToCollection(texts) {
  const collection = await getOrCreateCollection();

  const ids = texts.map(() => Math.random().toString()); // unique ids

  await collection.add({
    ids,
    documents: texts,
    metadatas: texts.map(() => ({ source: "book" })),
  });

  console.log(`✅ Added ${texts.length} texts to Chroma`);
}
