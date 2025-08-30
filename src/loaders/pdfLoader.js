// src/loaders/pdfLoader.js
import fs from "fs";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js"; // 👈 default import

export async function loadPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));

  // ✅ pdfjsLib.getDocument now works
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += pageText + "\n";
  }

  return text.trim();
}
