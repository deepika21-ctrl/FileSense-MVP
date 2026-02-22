// Grab elements (supports both id="search" and id="searchInput")
const searchInput =
  document.getElementById("search") || document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

function renderEmptyState(query) {
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

function renderCard(file) {
  const actionText = file.action ? file.action : "No action provided";

  resultDiv.innerHTML = `
    <div class="card">
      <h2>${file.nickname}</h2>
      <p class="filename">${file.originalName}</p>

      <p><strong>App:</strong> ${file.app}</p>

      <p class="confidence ${String(file.confidence).toLowerCase()}">
        Confidence: ${file.confidence}
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
}

// Search behavior
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // If input is empty, clear results (no empty-state needed)
    if (query === "") {
      resultDiv.innerHTML = "";
      return;
    }

    const file = files.find((f) => {
      return (
        String(f.originalName).toLowerCase().includes(query) ||
        String(f.nickname).toLowerCase().includes(query) ||
        String(f.app).toLowerCase().includes(query)
      );
    });

    // If no match, show empty state
    if (!file) {
      renderEmptyState(query);
      return;
    }

    // If match, show card
    renderCard(file);
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
