// detail.js - the item detail page (detail.html?id=3)
// Load order: auth.js, utils.js, data.js, storage.js, matching.js, detail.js

// Read the number after "?id=" in the address. Returns NaN if there is none.
function getItemIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

// Short helper: put text in the element with this id
function setText(id, text) {
  document.getElementById(id).textContent = text;
}

// Split a text into lower-case words with 3 or more letters
function splitWords(text) {
  const parts = text.toLowerCase().split(/[^a-z0-9]+/);
  const words = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length >= 3) {
      words.push(parts[i]);
    }
  }
  return words;
}

// Claim check: the answer must contain ALL important words of the hidden detail.
// Example: hidden detail "folded receipt" -> the answer "a folded receipt inside" is OK,
// but "receipt" alone is not.
function checkClaim(secret, answer) {
  if (secret.trim() === "" || answer.trim() === "") {
    return false;
  }
  const secretWords = splitWords(secret);
  if (secretWords.length === 0) {
    return secret.trim().toLowerCase() === answer.trim().toLowerCase();
  }
  const answerWords = splitWords(answer);
  for (let i = 0; i < secretWords.length; i++) {
    if (answerWords.indexOf(secretWords[i]) === -1) {
      return false;
    }
  }
  return true;
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

// For a FOUND item with a hidden detail: ask the visitor to prove it is theirs
function showClaimForm(item, box) {
  box.innerHTML =
    '<div class="card card-body mb-3">' +
      '<h6>Is this your item?</h6>' +
      '<p class="small text-muted mb-2">The finder saved a hidden detail that only the real owner knows. ' +
      'Describe something about the item that is NOT in the description to unlock the contact button.</p>' +
      '<div class="input-group">' +
        '<input type="text" id="claimAnswer" class="form-control" placeholder="Your answer">' +
        '<button type="button" id="claimButton" class="btn btn-lf">Verify</button>' +
      '</div>' +
      '<div id="claimMessage" class="mt-2"></div>' +
    '</div>';

  document.getElementById("claimButton").addEventListener("click", function () {
    const answer = document.getElementById("claimAnswer").value;
    const message = document.getElementById("claimMessage");

    if (checkClaim(item.secret, answer)) {
      box.innerHTML = '<div class="alert alert-success">Correct! You can contact the finder now.</div>' +
                      contactButtonHtml(item);
    } else {
      message.innerHTML = '<div class="alert alert-danger mb-0">That does not match. Please try again.</div>';
    }
  });
}

// Decide what the visitor can do: contact, verify, login, or mark as returned
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

  // A found item with a hidden detail: the visitor must prove it first
  if (item.status === "found" && item.secret && item.secret.trim() !== "") {
    showClaimForm(item, box);
    return;
  }

  box.innerHTML = contactButtonHtml(item);
}

// Show the best matches (simple AI, see matching.js)
function showMatches(item) {
  const box = document.getElementById("matchBox");
  if (item.status === "returned") {
    return;
  }

  const matches = findMatches(item, getItems());

  let html = '<h5 class="page-title mt-4">Possible matches</h5>' +
             '<p class="small text-muted">We compare category, location, keywords, and date.</p>';

  if (matches.length === 0) {
    html += '<p class="text-muted">No similar items yet.</p>';
  } else {
    html += '<div class="list-group">';
    for (let i = 0; i < matches.length; i++) {
      const other = matches[i].item;
      html += '<a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" ' +
              'href="detail.html?id=' + other.id + '">' +
              '<span>' + escapeHtml(other.name) + ' <small class="text-muted">(' +
              capitalize(other.status) + ', ' + escapeHtml(other.location) + ')</small></span>' +
              '<span class="badge bg-primary match-score">' + matches[i].score + '% match</span></a>';
    }
    html += '</div>';
  }
  box.innerHTML = html;
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
  showMatches(item);
}

// ----- Run when the page opens -----
const currentItem = findItemById(getItemIdFromUrl());

if (currentItem === null) {
  document.getElementById("detailNotFound").classList.remove("d-none");
} else {
  showDetail(currentItem);
}
