import readline from "readline";
import { askWithBooks } from "../services/ragService.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function chatLoop() {
  rl.question("💌 You: ", async (q) => {
    const response = await askWithBooks(q);
    console.log("\n🤖 AI Friend:", response, "\n");
    chatLoop();
  });
}
