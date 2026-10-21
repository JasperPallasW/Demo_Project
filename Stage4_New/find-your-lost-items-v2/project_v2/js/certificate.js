// certificate.js - a printable Certificate of Appreciation for a finder.
// Address: certificate.html?id=3 (only for "found" items that were returned)

const certParams = new URLSearchParams(window.location.search);
const certItem = getItemById(certParams.get("id"));

if (certItem === null || certItem.reportType !== "found" || certItem.status !== "returned") {
  document.getElementById("certRoot").classList.add("d-none");
  document.getElementById("certNotFound").classList.remove("d-none");
} else {
  setText("certName", certItem.reporterName);
  setText("certOrigin", certItem.reporterOrigin);
  setText("certItem", certItem.name);
  setText("certDate", formatDate(certItem.returnedDate));

  // Honor level of the finder
  const certBoard = getFinderBoard();
  for (let i = 0; i < certBoard.length; i++) {
    if (certBoard[i].id === certItem.reporterId) {
      document.getElementById("certBadge").innerHTML = badgeHtml(certBoard[i].badge);
    }
  }

  // The print button opens the print window (the user can also choose "Save as PDF")
  document.getElementById("certPrint").addEventListener("click", function () {
    window.print();
  });
}
