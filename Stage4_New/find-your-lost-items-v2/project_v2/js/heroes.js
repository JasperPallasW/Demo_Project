// heroes.js - the Finder Heroes page: podium, ranking table, and thank-you wall.

const allItems = getItems();
const board = buildFinderBoard(allItems);

// 1) Podium (top 3)
const podium = document.getElementById("podium");
podium.innerHTML = "";
for (let i = 0; i < 3 && i < board.length; i++) {
  const finder = board[i];
  podium.innerHTML += `
    <div class="col-md-4 podium-col podium-${i + 1} fade-up">
      <div class="card podium-card text-center h-100">
        <div class="card-body">
          <div class="rank-circle">${i + 1}</div>
          <h5 class="mt-3 mb-1">${escapeHtml(finder.name)}</h5>
          <p class="text-muted small mb-2"><i class="bi bi-geo-alt-fill"></i> ${escapeHtml(finder.origin)}</p>
          ${badgeHtml(finder.badge)}
          <p class="mt-3 mb-0"><strong>${finder.returns}</strong> returned &middot; <strong>${finder.points}</strong> points</p>
        </div>
      </div>
    </div>`;
}
if (board.length === 0) {
  podium.innerHTML = '<p class="text-center text-muted">No heroes yet. Return a found item to be the first!</p>';
}

// 2) Full ranking table
const heroesBody = document.getElementById("heroesBody");
heroesBody.innerHTML = "";
for (let i = 0; i < board.length; i++) {
  const finder = board[i];
  heroesBody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(finder.name)}</strong></td>
      <td>${escapeHtml(finder.origin)}</td>
      <td>${finder.returns}</td>
      <td>${finder.points}</td>
      <td>${badgeHtml(finder.badge)}</td>
    </tr>`;
}

// 3) Thank-you wall: returned "found" items that have a thank-you note (newest first)
const notes = [];
for (let i = 0; i < allItems.length; i++) {
  const item = allItems[i];
  if (item.reportType === "found" && item.status === "returned" && item.returnedNote) {
    notes.push(item);
  }
}
notes.sort(function (a, b) {
  return a.returnedDate < b.returnedDate ? 1 : -1;
});

const wall = document.getElementById("thanksWall");
wall.innerHTML = "";
for (let i = 0; i < notes.length && i < 6; i++) {
  const item = notes[i];
  wall.innerHTML += `
    <div class="col-md-6 col-lg-4 fade-up">
      <div class="card thanks-card h-100">
        <div class="card-body">
          <p class="thanks-quote">&ldquo;${escapeHtml(item.returnedNote)}&rdquo;</p>
          <p class="small mb-0">
            <strong>${escapeHtml(item.returnedTo || "The owner")}</strong> thanks
            <strong>${escapeHtml(item.reporterName)}</strong> for returning
            <a href="detail.html?id=${item.id}">${escapeHtml(item.name)}</a>
            <span class="text-muted">(${formatDate(item.returnedDate)})</span>
          </p>
        </div>
      </div>
    </div>`;
}
