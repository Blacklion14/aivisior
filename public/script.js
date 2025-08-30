const form = document.getElementById("chat-form");
const input = document.getElementById("question");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  // Add user message
  addMessage(question, "user");
  input.value = "";

  // Call backend
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  if (data.answer) {
    addMessage(data.answer, "ai");
  } else {
    addMessage("❌ Error getting response", "ai");
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
}
