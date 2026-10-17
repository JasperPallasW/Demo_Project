// detail.js - the item detail page (detail.html?id=3)
// Load order: auth.js, utils.js, data.js, storage.js, detail.js

// Read the number after "?id=" in the address. Returns NaN if there is none.
function getItemIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

// Short helper: put text in the element with this id
function setText(id, text) {
  document.getElementById(id).textContent = text;
}

// The WhatsApp button (wa.me opens a chat with a ready message)
function contactButtonHtml(item) {
  let text;
  if (item.status === "lost") {
    text = "Hi, I think I found your lost item: " + item.name + ".";
  } else {
    text = "Hi, I think the item you found (" + item.name + ") is mine.";
  }
  const link = "https://wa.me/" + encodeURIComponent(item.contact) +
               "?text=" + encodeURIComponent(text);
  return '<a class="btn btn-lf" href="' + link + '" target="_blank" rel="noopener">Contact on WhatsApp</a>';
}

// Decide what the visitor can do: contact, login, or mark as returned
function showActions(item) {
  const box = document.getElementById("actionBox");
  const user = getCurrentUser();

  if (item.status === "returned") {
    box.innerHTML = '<div class="alert alert-secondary mb-0">This item has been returned to its owner.</div>';
    return;
  }

  // Contact details are only for logged-in users (protects personal data)
  if (user === null) {
    box.innerHTML = '<div class="alert alert-warning mb-0">Please <a href="login.html">login</a> to contact the person who made this report.</div>';
    return;
  }

  // The person who made the report can mark the item as returned
  if (item.reporterId !== undefined && item.reporterId === user.id) {
    box.innerHTML = '<div class="alert alert-info">This is your report.</div>' +
                    '<button id="returnButton" type="button" class="btn btn-outline-success">Mark as returned</button>';
    document.getElementById("returnButton").addEventListener("click", function () {
      if (confirm("Mark this item as returned?")) {
        updateItemStatus(item.id, "returned");
        window.location.reload();
      }
    });
    return;
  }

  box.innerHTML = contactButtonHtml(item);
}

// Fill the page with the item
function showDetail(item) {
  document.title = item.name + " - Find Your Lost Items";

  const image = document.getElementById("detailImage");
  image.src = getImageSrc(item.image, "../");
  image.alt = item.name;

  const badge = document.getElementById("detailStatus");
  badge.textContent = capitalize(item.status);
  badge.className = "badge mb-2 " + getBadgeClass(item.status);

  setText("detailName", item.name);
  setText("detailDescription", item.description);
  setText("detailCategory", item.category);
  setText("detailLocation", item.location);
  setText("detailDate", item.date);
  setText("detailReporter", item.reporter);

  document.getElementById("detailContent").classList.remove("d-none");
  showActions(item);
}

// ----- Run when the page opens -----
const currentItem = findItemById(getItemIdFromUrl());

if (currentItem === null) {
  document.getElementById("detailNotFound").classList.remove("d-none");
} else {
  showDetail(currentItem);
}
