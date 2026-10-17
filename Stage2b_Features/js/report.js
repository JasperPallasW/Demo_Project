// report.js - the report form (report.html)
// Load order: auth.js, data.js, storage.js, report.js

const reportForm = document.getElementById("reportForm");
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
const dateInput = document.getElementById("date");

// The photo is kept here as Base64 text. "" means no photo.
let photoData = "";

// Today's date as text like "2026-10-16" (local time)
function getTodayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// Only logged-in people can report. Returns true if somebody is logged in.
function requireLogin() {
  if (getCurrentUser() === null) {
    showMessage("Please login first to report an item. Opening the login page...", "warning");
    reportForm.classList.add("d-none"); // hide the form
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1800);
    return false;
  }
  return true;
}

// Make a photo smaller (max 600 pixels) and turn it into Base64 text.
// We need this because localStorage is small (about 5 MB).
// callback(text) is called with the result, or with "" if something failed.
function shrinkImage(file, maxSize, callback) {
  if (!file.type.startsWith("image/")) {
    callback("");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();

    img.onload = function () {
      let width = img.width;
      let height = img.height;

      // keep the same shape, but make the longest side = maxSize
      if (width > maxSize || height > maxSize) {
        if (width >= height) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        } else {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }
      }

      // draw the photo on a canvas (Unit 3 topic), then read it as text
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff"; // white background (for transparent PNG)
      context.fillRect(0, 0, width, height);
      context.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.7));
    };

    img.onerror = function () {
      callback("");
    };
    img.src = event.target.result;
  };

  reader.onerror = function () {
    callback("");
  };
  reader.readAsDataURL(file);
}

// When the user chooses a photo: shrink it and show a preview
function previewPhoto() {
  const file = photoInput.files[0];

  if (!file) {
    photoData = "";
    photoPreview.classList.add("d-none");
    return;
  }

  shrinkImage(file, 600, function (result) {
    if (result === "") {
      photoData = "";
      photoPreview.classList.add("d-none");
      showMessage("This file could not be read as a photo. Please choose another one.", "danger");
      return;
    }
    photoData = result;
    photoPreview.src = result;
    photoPreview.classList.remove("d-none");
    document.getElementById("formMessage").innerHTML = ""; // clear old message
  });
}

// When the form is sent: build the item, save it, open its detail page
function handleReportSubmit(event) {
  event.preventDefault(); // stop the page from reloading

  const user = getCurrentUser();
  if (user === null) {
    requireLogin();
    return;
  }

  // which radio button is chosen: "lost" or "found"
  const status = document.querySelector('input[name="reportType"]:checked').value;

  const newItem = {
    name: document.getElementById("itemName").value.trim(),
    category: document.getElementById("category").value,
    status: status,
    description: document.getElementById("description").value.trim(),
    location: document.getElementById("location").value,
    date: dateInput.value,
    image: photoData !== "" ? photoData : "images/placeHolder.svg",
    reporter: user.fullName,
    reporterId: user.id,
    contact: user.phone,
    secret: document.getElementById("secret").value.trim()
  };

  const saved = addItem(newItem);

  if (saved === null) {
    showMessage("Could not save the report. The photo may be too big, please try a smaller photo.", "danger");
    return;
  }

  showMessage("Report saved! Opening your item...", "success");
  setTimeout(function () {
    window.location.href = "detail.html?id=" + saved.id;
  }, 1200);
}

// ----- Run when the page opens -----
dateInput.max = getTodayString();    // no future dates
dateInput.value = getTodayString();  // today is the default

photoInput.addEventListener("change", previewPhoto);
reportForm.addEventListener("submit", handleReportSubmit);
requireLogin();
