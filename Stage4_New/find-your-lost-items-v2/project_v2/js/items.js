// items.js - the Items page: show all item cards + keyword search.
// The status tabs and the category filter work with CSS only (see style.css),
// so this file only does the cards and the keyword search.

const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("searchInput");
const searchNote = document.getElementById("searchNote");

// Show a list of items as cards
function showItems(list) {
  itemList.innerHTML = "";

  if (list.length === 0) {
    itemList.innerHTML = '<p class="text-center text-muted py-5">No items found. Try another keyword.</p>';
    return;
  }
  for (let i = 0; i < list.length; i++) {
    itemList.innerHTML += cardHtml(list[i]);
  }
}

// Return only the items that match the keyword.
// "black wallet" matches an item only if BOTH words are found somewhere in the item.
function searchItems(list, keyword) {
  const words = keyword.toLowerCase().trim().split(" ");
  const result = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    // Put all searchable text of the item in one long text
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

// Newest items first
function sortNewestFirst(list) {
  return list.slice().sort(function (a, b) {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return b.id - a.id;
  });
}

const allItems = sortNewestFirst(getItems());

// Read the search box and show the matching items
function applySearch() {
  const keyword = searchInput.value;
  const found = searchItems(allItems, keyword);
  showItems(found);
  searchNote.textContent = keyword.trim() === "" ? "" : "Items matching your search: " + found.length;
}

searchInput.addEventListener("input", applySearch);

// The home page search box sends the word in the address: items.html?q=wallet
const params = new URLSearchParams(window.location.search);
if (params.get("q") !== null) {
  searchInput.value = params.get("q");
}
applySearch();
