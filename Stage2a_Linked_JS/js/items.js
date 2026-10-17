// items.js - show the item cards on items.html using the data from data.js
// data.js must be loaded BEFORE this file (it creates the "items" list).

const itemList = document.getElementById("itemList");
const itemCount = document.getElementById("itemCount");

// Choose the badge color from the status
function getBadgeClass(status) {
  if (status === "found") {
    return "bg-success";
  } else if (status === "lost") {
    return "bg-danger";
  }
  return "bg-secondary"; // returned
}

// Make the first letter big: "found" -> "Found"
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Make text safe before putting it in HTML (important later, when users type their own text)
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Show a list of items as cards.
// We keep this as a function so search and filter can use it later.
function showItems(list) {
  itemList.innerHTML = "";

  if (list.length === 0) {
    itemList.innerHTML = '<p class="text-center text-muted">No items found.</p>';
    itemCount.textContent = "0 items";
    return;
  }

  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    // "../" is needed because this page is inside the pages folder
    itemList.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card item-card h-100">
          <img src="../${item.image}" class="card-img-top" alt="${escapeHtml(item.name)}">
          <div class="card-body">
            <span class="badge ${getBadgeClass(item.status)} mb-2">${capitalize(item.status)}</span>
            <h5 class="card-title">${escapeHtml(item.name)}</h5>
            <p class="card-text">${escapeHtml(item.description)}</p>
            <p class="text-muted small mb-0">Location: ${escapeHtml(item.location)}<br>Date: ${item.date}</p>
          </div>
          <div class="card-footer bg-white border-0 pb-3">
            <a href="detail.html?id=${item.id}" class="btn btn-lf w-100">View Detail</a>
          </div>
        </div>
      </div>`;
  }

  itemCount.textContent = list.length + " items";
}

// Show all items when the page opens
showItems(items);
