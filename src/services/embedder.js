import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

export const embedder = new OllamaEmbeddings({
  model: "llama3",
});
