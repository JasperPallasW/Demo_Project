// search.js - search and filter the items on items.html
// Load order in items.html: auth.js, data.js, items.js, then this file.
// (items.js must come first because it creates the function showItems)

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

// Return only the items that match ALL three: keyword, category, and status.
// category and status are "all" when the user did not choose anything.
function filterItems(list, keyword, category, status) {
  const words = keyword.toLowerCase().trim().split(" ");
  const result = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    // 1) category filter
    if (category !== "all" && item.category !== category) {
      continue; // skip this item, go to the next one
    }

    // 2) status filter (data.js uses small letters: "lost", "found", "returned")
    if (status !== "all" && item.status !== status.toLowerCase()) {
      continue;
    }

    // 3) keyword: put all searchable text of the item in one long text
    const text = (item.name + " " + item.category + " " + item.status + " " +
                  item.location + " " + item.description).toLowerCase();

    let matchAll = true;
    for (let w = 0; w < words.length; w++) {
      if (words[w] !== "" && text.indexOf(words[w]) === -1) {
        matchAll = false;
        break; // one word is missing, no need to check the rest
      }
    }

    if (matchAll) {
      result.push(item);
    }
  }
  return result;
}

// Read the three controls, filter, and show the result
function applyFilters() {
  const filtered = filterItems(
    items,
    searchInput.value,
    categoryFilter.value,
    statusFilter.value
  );
  showItems(filtered);
}

// Run again every time the user types or changes a dropdown
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
