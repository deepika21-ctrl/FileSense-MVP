// Grab elements (supports both id="search" and id="searchInput")
const searchInput =
  document.getElementById("search") || document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

function renderEmptyState() {
  resultDiv.innerHTML = `
    <div class="empty-state">
      <p class="empty-title">No matching file found</p>
      <p class="empty-text">
        Try searching a file or folder name like 
        <strong>System32</strong> or <strong>node_modules</strong>.
      </p>
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

// Search behavior (Top 3 matches)
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

    // If no match, show empty state
    if (matches.length === 0) {
      renderEmptyState();
      return;
    }

    // If matches exist, render up to 3 cards
    renderCards(matches);
  });
}

// Chip click behavior (autofill + trigger search)
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const value = chip.getAttribute("data-value") || "";
    if (!searchInput) return;

    searchInput.value = value;
    searchInput.dispatchEvent(new Event("input"));
    searchInput.focus();
  });
});
