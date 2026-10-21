// history.js - the History page: three numbers and a table of all items.

const historyItems = getItems();
const historyCounts = countByStatus(historyItems);

setText("histLost", historyCounts.lost);
setText("histFound", historyCounts.found);
setText("histReturned", historyCounts.returned);

// Newest first
historyItems.sort(function (a, b) {
  if (a.date !== b.date) {
    return a.date < b.date ? 1 : -1;
  }
  return b.id - a.id;
});

const historyBody = document.getElementById("historyBody");
historyBody.innerHTML = "";
for (let i = 0; i < historyItems.length; i++) {
  const item = historyItems[i];
  historyBody.innerHTML += `
    <tr>
      <td><a href="detail.html?id=${item.id}">${escapeHtml(item.name)}</a></td>
      <td>${escapeHtml(item.category)}</td>
      <td><span class="badge ${statusBadgeClass(item.status)}">${capitalize(item.status)}</span></td>
      <td>${escapeHtml(item.location)}</td>
      <td>${formatDate(item.date)}</td>
      <td>${escapeHtml(item.reporterName)}</td>
    </tr>`;
}
