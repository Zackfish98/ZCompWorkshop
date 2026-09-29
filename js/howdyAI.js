// The API key has been removed from this site. To run the analyzer
// locally, create js/anthropic-key.js from js/anthropic-key.example.js
// (it's gitignored) and add a <script> tag for it in howdyAI.html.
const DB_URL = "https://twostep-e85a2-default-rtdb.firebaseio.com";

async function logToFirebase(song, verdict, bpm) {
  try {
    await fetch(`${DB_URL}/lookups.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song,
        verdict,
        bpm,
        timestamp: Date.now()
      })
    });
  } catch (e) {
    console.warn("Firebase log failed:", e);
  }
}

function parseVerdict(responseText) {
  const verdictMatch = responseText.match(/VERDICT:\s*(.+)/);
  const bpmMatch = responseText.match(/BPM:\s*(.+)/);
  return {
    verdict: verdictMatch ? verdictMatch[1].trim() : "UNKNOWN",
    bpm: bpmMatch ? bpmMatch[1].trim() : "UNKNOWN"
  };
}

async function chatWithClaude(userMessage) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `You are a two-step dance analyzer. When given a song name, assess whether it can be two-stepped to.

Two-step requirements:
- Must be 4/4 time signature
- BPM ranges: slow (85-110), standard (110-160), fast (160-200)
- Needs a clear, driving, steady beat
- Strong boom-chick pattern helps (kick on 1&3, snare on 2&4)

Return your answer in this exact format:
VERDICT: YES / YES (fast) / YES (slow) / MAYBE / NO
BPM: [your estimate]
TIME SIGNATURE: [your estimate]
REASON: [one or two sentences max]

If you don't know the song, say so honestly.`,
      messages: [{ role: "user", content: userMessage }]
    })
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Could not parse response from Anthropic API.");
  }

  if (!response.ok) {
    const errMsg = data?.error?.message ?? `${response.status} ${response.statusText}`;
    throw new Error("Anthropic API error: " + errMsg);
  }

  if (!data.content || !data.content[0] || !data.content[0].text) {
    throw new Error("Unexpected API response structure: " + JSON.stringify(data));
  }

  return data.content[0].text;
}

const input  = document.getElementById("user-input");
const button = document.getElementById("send-btn");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  if (typeof ANTHROPIC_API_KEY === "undefined") {
    output.textContent = "The song analyzer is offline right now — check back soon!";
    return;
  }

  output.textContent = "Analyzing...";

  try {
    const aiResponse = await chatWithClaude(userMessage);
    output.textContent = aiResponse;

    // Log to Firebase
    const { verdict, bpm } = parseVerdict(aiResponse);
    logToFirebase(userMessage, verdict, bpm);

  } catch (err) {
    output.textContent = "Error: " + (err.message || err);
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});