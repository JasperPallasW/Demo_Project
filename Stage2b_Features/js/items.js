// items.js - show the item cards on items.html
// Load order: auth.js, utils.js, data.js, storage.js, items.js, search.js

const itemList = document.getElementById("itemList");
const itemCount = document.getElementById("itemCount");

// Show a list of items as cards.
// We keep this as a function so search and filter can use it too.
function showItems(list) {
  itemList.innerHTML = "";

  if (list.length === 0) {
    itemList.innerHTML = '<p class="text-center text-muted">No items found.</p>';
    itemCount.textContent = "0 items";
    return;
  }

  for (let i = 0; i < list.length; i++) {
    itemList.innerHTML += createItemCard(list[i], true);
  }

  itemCount.textContent = list.length + (list.length === 1 ? " item" : " items");
}

// Show all items when the page opens
showItems(getItems());
