import { ChromaClient } from "chromadb";

const client = new ChromaClient({ host: "localhost", port: 8000, ssl: false });

async function check() {
  const collection = await client.getCollection({ name: "relationship_books" });
  const count = await collection.count();
  console.log("📊 Total docs in collection:", count);

  const sample = await collection.peek({ limit: 3 });
  console.log("🔍 Sample docs:", sample);
}

check();
