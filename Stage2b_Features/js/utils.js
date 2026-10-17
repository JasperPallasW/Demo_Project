// utils.js - small helper functions used by many pages
// Load it BEFORE the scripts that use these functions.

// "found" -> "Found"
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Make text safe before putting it inside HTML
// (important when users type their own text)
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Badge color from the status: found = green, lost = red, returned = grey
function getBadgeClass(status) {
  if (status === "found") {
    return "bg-success";
  } else if (status === "lost") {
    return "bg-danger";
  }
  return "bg-secondary";
}

// Give the right image address.
// - Photos uploaded by users are Base64 text starting with "data:" and must
//   NOT get a folder prefix.
// - Normal image files need the prefix ("../" when the page is in /pages).
function getImageSrc(image, prefix) {
  if (!image) {
    return prefix + "images/placeHolder.svg";
  }
  if (image.indexOf("data:") === 0) {
    return image;
  }
  return prefix + escapeHtml(image);
}

// Build the HTML of one item card.
// inPagesFolder = true  -> used on a page inside /pages (items.html)
// inPagesFolder = false -> used on index.html (root folder)
function createItemCard(item, inPagesFolder) {
  const imagePrefix = inPagesFolder ? "../" : "";
  const linkPrefix = inPagesFolder ? "" : "pages/";

  return `
      <div class="col-md-6 col-lg-4">
        <div class="card item-card h-100">
          <img src="${getImageSrc(item.image, imagePrefix)}" class="card-img-top" alt="${escapeHtml(item.name)}">
          <div class="card-body">
            <span class="badge ${getBadgeClass(item.status)} mb-2">${capitalize(item.status)}</span>
            <h5 class="card-title">${escapeHtml(item.name)}</h5>
            <p class="card-text">${escapeHtml(item.description)}</p>
            <p class="text-muted small mb-0">Location: ${escapeHtml(item.location)}<br>Date: ${escapeHtml(item.date)}</p>
          </div>
          <div class="card-footer bg-white border-0 pb-3">
            <a href="${linkPrefix}detail.html?id=${item.id}" class="btn btn-lf w-100">View Detail</a>
          </div>
        </div>
      </div>`;
}
