// home.js - the home page (index.html): working search box and latest items
// Load order: auth.js, utils.js, data.js, storage.js, home.js

const homeSearchInput = document.getElementById("homeSearchInput");
const homeSearchButton = document.getElementById("homeSearchButton");
const latestItems = document.getElementById("latestItems");

// Open the items page with the typed word (items.html?q=wallet)
function goToSearch() {
  const word = homeSearchInput.value.trim();
  window.location.href = "pages/items.html?q=" + encodeURIComponent(word);
}

// Show the 3 newest items (the biggest ids)
function showLatestItems() {
  const newestFirst = getItems().slice().sort(function (a, b) {
    return b.id - a.id;
  });

  latestItems.innerHTML = "";
  for (let i = 0; i < newestFirst.length && i < 3; i++) {
    latestItems.innerHTML += createItemCard(newestFirst[i], false); // false = we are in the root folder
  }
}

homeSearchButton.addEventListener("click", goToSearch);
homeSearchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    goToSearch();
  }
});
showLatestItems();
