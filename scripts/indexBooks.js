import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { loadPDF } from "../src/loaders/pdfLoader.js";
import { splitText } from "../src/utils/textSplitter.js";
import { addToCollection } from "../src/vectorstore/chromaStore.js";

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we point to the right data folder
const dataDir = path.resolve(__dirname, "../data");

async function indexBooks() {
  console.log("🔍 Using data directory:", dataDir);

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Data directory not found: ${dataDir}`);
    return;
  }

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".pdf"));

  if (files.length === 0) {
    console.warn("⚠️ No PDF files found in /data. Please add some books.");
    return;
  }

  for (let file of files) {
    const fullPath = path.join(dataDir, file);
    console.log(`📕 Attempting to load file: ${fullPath}`);

    try {
      const text = await loadPDF(fullPath);

      console.log(`✂️ Splitting text for ${file}...`);
      const docs = await splitText(text);
      const texts = docs.map((d) => d.pageContent);

      console.log(
        `🧠 Adding ${texts.length} chunks from ${file} to collection...`
      );
      await addToCollection(texts);

      console.log(`✅ Indexed ${file}`);
    } catch (err) {
      console.error(`❌ Failed to index ${file}:`, err);
    }
  }

  console.log("🎉 All books indexed!");
}

indexBooks();
