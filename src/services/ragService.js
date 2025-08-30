import { Ollama } from "@langchain/community/llms/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { ChromaClient } from "chromadb";

// set up Ollama embeddings once
const ollamaEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text", // fast embedding model for text
});

// Wrap embeddings so Chroma understands it
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

export async function askWithBooks(question) {
  const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
  });

  // create or get collection with embeddingFunction
  const collection = await client.getOrCreateCollection({
    name: "relationship_books",
    metadata: { description: "Chunks of relationship advice books" },
    embeddingFunction,
  });

  // ✅ add a test doc if empty
  const count = await collection.count();
  if (count === 0) {
    await collection.add({
      ids: ["1"],
      documents: [
        "Healthy relationships are built on trust, empathy, and open communication.",
      ],
      metadatas: [{ source: "init" }],
    });
    console.log("📚 Added a test document to collection.");
  }

  // query with embeddings
  const results = await collection.query({
    queryTexts: [question],
    nResults: 3,
  });

  const context = results.documents?.flat().join("\n") || "";

  // call Ollama LLM
  const llm = new Ollama({ model: "llama3.2:1b" });

  const prompt = `
You are my caring best friend. 
You always give supportive, empathetic, and practical relationship advice. 
Call me "baby" often.  give short answers,not more than 50 words

Here’s some knowledge from books to help you:
${context}

My Question: ${question}
Answer:`;

  const response = await llm.call(prompt);
  return response.trim();
}
