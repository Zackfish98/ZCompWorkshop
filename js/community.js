const DB_URL = "https://twostep-e85a2-default-rtdb.firebaseio.com";

function getVerdictClass(verdict) {
  if (!verdict) return "maybe";
  const v = verdict.toUpperCase();
  if (v.startsWith("YES")) return "yes";
  if (v === "NO") return "no";
  return "maybe";
}

async function loadSongs() {
  const list = document.getElementById("song-list");

  try {
    const res = await fetch(`${DB_URL}/lookups.json`);
    const data = await res.json();

    // Firebase's REST API returns a 200 with a {"error": "..."} body for
    // permission-denied reads rather than a non-2xx status, so check for
    // that shape explicitly instead of just checking res.ok
    if (!res.ok || (data && data.error)) {
      list.innerHTML = "<p>Couldn't load songs — check that /lookups is readable in the Firebase Rules tab.</p>";
      console.error("Firebase read error:", data && data.error);
      return;
    }

    if (!data) {
      list.innerHTML = "<p>No songs looked up yet.</p>";
      return;
    }

    // Aggregate by song name
    const songs = {};
    Object.values(data).forEach(entry => {
      const key = entry.song.toLowerCase().trim();
      if (!songs[key]) {
        songs[key] = {
          name: entry.song,
          verdict: entry.verdict,
          bpm: entry.bpm,
          count: 0
        };
      }
      songs[key].count++;
    });

    // Sort by most searched
    const sorted = Object.values(songs)
      .sort((a, b) => b.count - a.count);

    list.innerHTML = sorted.map(s => `
      <div class="song-row">
        <div>
          <span class="song-name">${s.name}</span>
          <span class="count">${s.count} lookup${s.count > 1 ? "s" : ""}</span>
        </div>
        <span class="verdict ${getVerdictClass(s.verdict)}">${s.verdict}</span>
      </div>
    `).join("");

  } catch (err) {
    list.innerHTML = "<p>Error loading data.</p>";
    console.error(err);
  }
}

loadSongs();