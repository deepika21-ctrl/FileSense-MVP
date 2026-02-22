// Grab elements (supports both id="search" and id="searchInput")
const searchInput =
  document.getElementById("search") || document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

// ---------------------------
// Suggestions helpers
// ---------------------------
function getAllSearchTerms() {
  const terms = [];
  files.forEach((f) => {
    terms.push(String(f.originalName));
    terms.push(String(f.nickname));
    terms.push(String(f.app));
  });
  return [...new Set(terms.map((t) => t.trim()).filter(Boolean))];
}

function getSuggestions(query, limit = 3) {
  const q = String(query || "").toLowerCase();
  if (!q) return [];

  const terms = getAllSearchTerms();

  // Simple scoring:
  // 3 = startsWith, 2 = includes, 1 = shares first letter
  const scored = terms
    .map((term) => {
      const t = term.toLowerCase();
      let score = 0;
      if (t.startsWith(q)) score = 3;
      else if (t.includes(q)) score = 2;
      else if (q[0] && t[0] === q[0]) score = 1;
      return { term, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term));

  return scored.slice(0, limit).map((x) => x.term);
}

// ---------------------------
// Typo-tolerance helpers
// ---------------------------
function normalizeText(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[_\-]/g, " ") // node_modules -> node modules
    .replace(/[^a-z0-9\s]/g, "") // remove symbols
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

// Levenshtein distance with early exit (fast for small thresholds)
function levenshteinLimited(a, b, maxDist = 2) {
  a = normalizeText(a);
  b = normalizeText(b);

  if (!a || !b) return Infinity;
  if (Math.abs(a.length - b.length) > maxDist) return Infinity;
  if (a === b) return 0;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost // substitution
      );
      rowMin = Math.min(rowMin, curr[j]);
    }

    // Early exit if already worse than maxDist
    if (rowMin > maxDist) return Infinity;

    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}

// ---------------------------
// UI renderers
// ---------------------------
function renderEmptyState(query) {
  const suggestions = getSuggestions(query, 3);

  resultDiv.innerHTML = `
    <div class="empty-state">
      <p class="empty-title">No matching file found</p>
      <p class="empty-text">
        Try searching a file or folder name like 
        <strong>System32</strong> or <strong>node_modules</strong>.
      </p>

      ${
        suggestions.length > 0
          ? `
            <div class="suggestions">
              <p class="suggestions-title">Did you mean:</p>
              <div class="suggestion-list">
                ${suggestions
                  .map(
                    (s) =>
                      `<button class="suggestion-chip" data-value="${s}">${s}</button>`
                  )
                  .join("")}
              </div>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderCards(matches) {
  resultDiv.innerHTML = matches
    .map((file) => {
      const actionText = file.action ? file.action : "No action provided";
      const riskText = file.risk ? file.risk : "Unknown";

      return `
        <div class="card">
          <h2>${file.nickname}</h2>
          <p class="filename">${file.originalName}</p>

          <p><strong>App:</strong> ${file.app}</p>

          <p class="confidence ${String(file.confidence).toLowerCase()}">
            Confidence: ${file.confidence}
          </p>

          <p class="risk-badge risk-${String(riskText).toLowerCase()}">
            Risk: ${riskText}
          </p>

          <p class="why">
            <strong>Why this exists:</strong> ${file.why}
          </p>

          <p class="action">
            <span class="label">Recommended action:</span> ${actionText}
          </p>

          <p class="last-seen">
            You haven’t opened this in ${file.lastSeenMonths} month(s)
          </p>
        </div>
      `;
    })
    .join("");
}

// ---------------------------
// Search behavior (Top 3 + typo tolerance)
// ---------------------------
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // If input is empty, clear results
    if (query === "") {
      resultDiv.innerHTML = "";
      return;
    }

    // Normal matching
    const matches = files
      .filter((f) => {
        return (
          String(f.originalName).toLowerCase().includes(query) ||
          String(f.nickname).toLowerCase().includes(query) ||
          String(f.app).toLowerCase().includes(query)
        );
      })
      .slice(0, 3);

    let finalMatches = matches;

    // Typo-tolerant fallback only if no normal results and query is 2+ chars
    if (finalMatches.length === 0 && query.length >= 2) {
      const scored = files
        .map((f) => {
          const d1 = levenshteinLimited(query, f.originalName, 2);
          const d2 = levenshteinLimited(query, f.nickname, 2);
          const d3 = levenshteinLimited(query, f.app, 2);
          const best = Math.min(d1, d2, d3);
          return { file: f, dist: best };
        })
        .filter((x) => x.dist !== Infinity)
        .sort((a, b) => a.dist - b.dist);

      finalMatches = scored.slice(0, 3).map((x) => x.file);
    }

    // If still nothing, show empty state + suggestions
    if (finalMatches.length === 0) {
      renderEmptyState(query);
      return;
    }

    // Render up to 3 matches (normal or typo-corrected)
    renderCards(finalMatches);
  });
}

// ---------------------------
// Main "Try searching" chips behavior
// ---------------------------
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const value = chip.getAttribute("data-value") || "";
    if (!searchInput) return;

    searchInput.value = value;
    searchInput.dispatchEvent(new Event("input"));
    searchInput.focus();
  });
});

// ---------------------------
// "Did you mean?" suggestion chip clicks (event delegation)
// ---------------------------
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".suggestion-chip");
  if (!btn || !searchInput) return;

  const value = btn.getAttribute("data-value") || "";
  searchInput.value = value;
  searchInput.dispatchEvent(new Event("input"));
  searchInput.focus();
});
