// ui.js - small helper functions that many pages use (build HTML pieces, format text).
// Each page has <body data-root="..."> :
//   data-root=""    for index.html (in the main folder)
//   data-root="../" for the pages inside the pages folder
// ROOT is used to build correct links and image paths from JavaScript.

const ROOT = (document.body && document.body.getAttribute("data-root")) || "";
const PAGES = ROOT === "" ? "pages/" : "";   // folder of the other pages, seen from this page

// Make text safe before putting it into HTML (text typed by users can contain < or ">")
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// "found" -> "Found"
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Cut a long text: "Black leather wallet with..." 
function shortText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + "...";
}

// "2026-10-05" -> "5 Oct 2026"
function formatDate(dateText) {
  if (!dateText) {
    return "";
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateText.split("-");
  return Number(parts[2]) + " " + months[Number(parts[1]) - 1] + " " + parts[0];
}

// Bootstrap color class for each status
function statusBadgeClass(status) {
  if (status === "found") {
    return "bg-success";
  } else if (status === "lost") {
    return "bg-danger";
  }
  return "bg-secondary"; // returned
}

// Photos from data.js are file paths. Photos from the report form are long "data:" texts.
function imageSrc(image) {
  if (!image) {
    return ROOT + "images/placeHolder.svg";
  }
  if (image.indexOf("data:") === 0) {
    return image;
  }
  return ROOT + image;
}

// The small honor badge (Bronze / Silver / Gold) as HTML. No badge -> empty text.
function badgeHtml(badge) {
  if (badge === null || badge === undefined) {
    return "";
  }
  return '<span class="honor-badge honor-' + badge.level + '"><i class="bi ' + badge.icon + '"></i> ' +
         escapeHtml(badge.name) + "</span>";
}

// One item card (used on the Items page and on the home page)
// data-status and data-category are used by CSS to filter the cards (no JavaScript needed for that)
function cardHtml(item) {
  return `
    <div class="col-md-6 col-lg-4 item-col fade-up" data-status="${escapeHtml(item.status)}" data-category="${escapeHtml(item.category)}">
      <div class="card item-card h-100">
        <div class="item-photo">
          <img src="${imageSrc(item.image)}" class="card-img-top" alt="${escapeHtml(item.name)}">
          <span class="badge ${statusBadgeClass(item.status)} status-ribbon">${capitalize(item.status)}</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(item.name)}</h5>
          <p class="card-text text-muted">${escapeHtml(shortText(item.description, 80))}</p>
          <p class="small mb-0">
            <i class="bi bi-geo-alt-fill text-danger"></i> ${escapeHtml(item.location)}<br>
            <i class="bi bi-calendar-event"></i> ${formatDate(item.date)}
          </p>
        </div>
        <div class="card-footer bg-white border-0 pb-3">
          <a href="${PAGES}detail.html?id=${item.id}" class="btn btn-lf w-100">View Detail</a>
        </div>
      </div>
    </div>`;
}

// Put text into the element with this id (if the element exists)
function setText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

// Show a colored message in <div id="formMessage">. type: "success" or "danger"
function showMessage(text, type) {
  const box = document.getElementById("formMessage");
  box.innerHTML = "";
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-" + type;
  alertDiv.textContent = text;
  box.appendChild(alertDiv);
}
