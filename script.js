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
  // Unique + cleaned
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
// Search behavior (Top 3 matches)
// ---------------------------
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // If input is empty, clear results
    if (query === "") {
      resultDiv.innerHTML = "";
      return;
    }

    const matches = files
      .filter((f) => {
        return (
          String(f.originalName).toLowerCase().includes(query) ||
          String(f.nickname).toLowerCase().includes(query) ||
          String(f.app).toLowerCase().includes(query)
        );
      })
      .slice(0, 3);

    // If no match, show empty state + suggestions
    if (matches.length === 0) {
      renderEmptyState(query);
      return;
    }

    // If matches exist, render up to 3 cards
    renderCards(matches);
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
