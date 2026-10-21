// detail.js - the detail page of one item.
// The item is chosen by the address: detail.html?id=3

const params = new URLSearchParams(window.location.search);
const item = getItemById(params.get("id"));
const user = getCurrentUser();

if (item === null) {
  // Wrong or missing id
  document.getElementById("detailRoot").classList.add("d-none");
  document.getElementById("notFound").classList.remove("d-none");
} else {
  showItemDetails();
}

function showItemDetails() {
  document.title = item.name + " - Find Your Lost Items";

  const image = document.getElementById("detailImage");
  image.src = imageSrc(item.image);
  image.alt = item.name;

  setText("detailName", item.name);
  const status = document.getElementById("detailStatus");
  status.textContent = capitalize(item.status);
  status.className = "badge fs-6 " + statusBadgeClass(item.status);

  setText("detailDescription", item.description);
  setText("detailCategory", item.category);
  setText("detailLocation", item.location);
  setText("detailDate", formatDate(item.date));

  // Who reported it?
  const whoLabel = item.reportType === "found" ? "Found by " : "Reported by ";
  document.getElementById("detailReporter").innerHTML =
    '<i class="bi bi-person-fill"></i> ' + whoLabel + "<strong>" + escapeHtml(item.reporterName) + "</strong>" +
    ' <span class="text-muted">(' + escapeHtml(item.reporterOrigin) + ")</span>";

  showFinderBadge();
  showContactButton();
  showReturnedInfo();
  showReturnPanel();
}

// Honor badge of the finder (only for "found" items)
function showFinderBadge() {
  if (item.reportType !== "found") {
    return;
  }
  const board = getFinderBoard();
  for (let i = 0; i < board.length; i++) {
    if (board[i].id === item.reporterId) {
      document.getElementById("finderBox").innerHTML =
        badgeHtml(board[i].badge) + ' <span class="small text-muted">' + board[i].returns + " item(s) returned</span>";
    }
  }
}

// WhatsApp link (plain HTML link, no JavaScript needed to open it)
function showContactButton() {
  if (item.status === "returned") {
    return; // nothing to contact about anymore
  }
  if (user === null) {
    // Only logged in students can contact (more safety for personal data)
    document.getElementById("loginToContact").classList.remove("d-none");
    return;
  }
  if (String(user.id) === item.reporterId) {
    return; // this is your own post, no need to contact yourself
  }
  const message = "Hi, I saw your " + item.reportType + " post for '" + item.name +
                  "' on Find Your Lost Items.";
  const button = document.getElementById("whatsappBtn");
  button.href = "https://wa.me/" + item.contact + "?text=" + encodeURIComponent(message);
  button.classList.remove("d-none");
}

// If the item was returned: show when, to whom, and the thank-you note
function showReturnedInfo() {
  if (item.status !== "returned") {
    return;
  }
  document.getElementById("returnedBox").classList.remove("d-none");

  let text = "";
  if (item.reportType === "found") {
    text = "Returned to " + (item.returnedTo || "its owner") + " on " + formatDate(item.returnedDate) + ".";
  } else {
    text = "Recovered on " + formatDate(item.returnedDate) +
           (item.returnedTo ? " with help from " + item.returnedTo : "") + ".";
  }
  setText("returnedInfo", text);

  if (item.returnedNote) {
    document.getElementById("returnedNoteText").innerHTML =
      '<i class="bi bi-chat-heart-fill"></i> &ldquo;' + escapeHtml(item.returnedNote) + "&rdquo;";
  }

  // A certificate is only for finders who returned an item
  if (item.reportType === "found") {
    const link = document.getElementById("certificateLink");
    link.href = "certificate.html?id=" + item.id;
    link.classList.remove("d-none");
  }
}

// Only the person who reported the item can mark it as returned
function showReturnPanel() {
  const isOwnerOfReport = user !== null && String(user.id) === item.reporterId;
  if (!isOwnerOfReport || item.status === "returned") {
    return;
  }

  document.getElementById("returnPanel").classList.remove("d-none");
  if (item.reportType === "found") {
    setText("returnSummary", "I returned this item to its owner");
    setText("returnedToLabel", "Name of the owner (optional)");
    setText("returnedNoteLabel", "Thank-you note from the owner (optional)");
  } else {
    setText("returnSummary", "I got my item back");
    setText("returnedToLabel", "Who helped you? (optional)");
    setText("returnedNoteLabel", "Your thank-you note (optional)");
  }

  document.getElementById("returnForm").addEventListener("submit", function (event) {
    event.preventDefault();
    markItemReturned(
      item.id,
      document.getElementById("returnedTo").value.trim(),
      document.getElementById("returnedNote").value.trim()
    );
    window.location.reload(); // show the page again with the new status
  });
}
