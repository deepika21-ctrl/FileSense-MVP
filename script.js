const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const file = files.find(f =>
    f.originalName.toLowerCase().includes(query) ||
    f.nickname.toLowerCase().includes(query) ||
    f.app.toLowerCase().includes(query)
  );

  if (!file || query === "") {
    resultDiv.innerHTML = "";
    return;
  }

  resultDiv.innerHTML = `
    <div class="card">
      <h2>${file.nickname}</h2>
      <p class="filename">${file.originalName}</p>

      <p class="confidence ${file.confidence.toLowerCase()}">
        Confidence: ${file.confidence}
      </p>

      <p class="why">
        <strong>Why this exists:</strong> ${file.why}
      </p>

      <p class="last-seen">
        You haven’t opened this in ${file.lastSeenMonths} month(s)
      </p>
    </div>
  `;
});
