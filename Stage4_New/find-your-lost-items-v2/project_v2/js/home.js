// home.js - the home page: numbers, latest items, and top finders.

const homeItems = getItems();
const counts = countByStatus(homeItems);
const board = buildFinderBoard(homeItems);

// 1) Numbers
setText("statLost", counts.lost);
setText("statFound", counts.found);
setText("statReturned", counts.returned);
setText("statHeroes", board.length);

// 2) Three newest items
const newest = homeItems.slice().sort(function (a, b) {
  if (a.date !== b.date) {
    return a.date < b.date ? 1 : -1;
  }
  return b.id - a.id;
});

const latestBox = document.getElementById("latestItems");
latestBox.innerHTML = "";
for (let i = 0; i < 3 && i < newest.length; i++) {
  latestBox.innerHTML += cardHtml(newest[i]);
}

// 3) Top three finders
const topBox = document.getElementById("topFinders");
topBox.innerHTML = "";
if (board.length === 0) {
  topBox.innerHTML = '<p class="text-center text-muted">No heroes yet. Be the first one!</p>';
}
for (let i = 0; i < 3 && i < board.length; i++) {
  const finder = board[i];
  topBox.innerHTML += `
    <div class="col-md-4 fade-up">
      <div class="card hero-mini h-100 text-center">
        <div class="card-body">
          <div class="rank-circle">${i + 1}</div>
          <h5 class="mt-3 mb-1">${escapeHtml(finder.name)}</h5>
          <p class="text-muted small mb-2"><i class="bi bi-geo-alt-fill"></i> ${escapeHtml(finder.origin)}</p>
          ${badgeHtml(finder.badge)}
          <p class="mt-3 mb-0"><strong>${finder.returns}</strong> item(s) returned &middot; <strong>${finder.points}</strong> points</p>
        </div>
      </div>
    </div>`;
}
