// history.js - numbers and table on history.html
// Load order: auth.js, utils.js, data.js, storage.js, history.js

// Count how many items are lost, found, and returned
function countByStatus(list) {
  const counts = { lost: 0, found: 0, returned: 0 };
  for (let i = 0; i < list.length; i++) {
    const status = list[i].status;
    if (counts[status] !== undefined) {
      counts[status] = counts[status] + 1;
    }
  }
  return counts;
}

// Write the 3 numbers in the number cards
function showCounts(list) {
  const counts = countByStatus(list);
  document.getElementById("countLost").textContent = counts.lost;
  document.getElementById("countFound").textContent = counts.found;
  document.getElementById("countReturned").textContent = counts.returned;
}

// Build the table rows, newest date first
function showTable(list) {
  const table = document.getElementById("historyTable");
  table.innerHTML = "";

  // sort a COPY of the list (newest date first, then newest id first)
  const sorted = list.slice().sort(function (a, b) {
    if (a.date === b.date) {
      return b.id - a.id;
    }
    return b.date.localeCompare(a.date);
  });

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    table.innerHTML += `
          <tr>
            <td><a href="detail.html?id=${item.id}">${escapeHtml(item.name)}</a></td>
            <td>${escapeHtml(item.category)}</td>
            <td><span class="badge ${getBadgeClass(item.status)}">${capitalize(item.status)}</span></td>
            <td>${escapeHtml(item.location)}</td>
            <td>${escapeHtml(item.date)}</td>
          </tr>`;
  }
}

const allItems = getItems();
showCounts(allItems);
showTable(allItems);
