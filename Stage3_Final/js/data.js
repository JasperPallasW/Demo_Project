// data.js - the starting (dummy) items. We use this list instead of a real database.
// status   : "lost", "found", or "returned"
// location : one of the names in locations.js
// secret   : a hidden detail only the owner knows (used for found items, can be "")
// IMPORTANT: image names must match the file names in the images folder EXACTLY
// (same capital letters), because Netlify (Linux) cares about capital letters.
// NOTE: this list is copied to localStorage only the FIRST time. If you change it,
// type resetItems() in the browser Console (F12) to load the new list.

const items = [
  { id: 1,  name: "Black Wallet",      category: "Wallet",      status: "found",    description: "Black leather wallet with a blue ATM card inside.",              location: "Library",       date: "2026-10-05", image: "images/blackWallet.jpeg",  reporter: "Student Demo 1",  contact: "919000000001", secret: "folded receipt" },
  { id: 2,  name: "Silver Keys",       category: "Keys",        status: "lost",     description: "Two silver keys with a keychain shaped like a star.",            location: "Canteen",       date: "2026-10-06", image: "images/silverKeys.jpeg",   reporter: "Student Demo 2",  contact: "919000000002", secret: "" },
  { id: 3,  name: "Blue Backpack",     category: "Bag",         status: "returned", description: "Blue backpack with a laptop sleeve and a small name tag.",       location: "Main Building", date: "2026-10-07", image: "images/blueBackpack.jpeg", reporter: "Student Demo 3",  contact: "919000000003", secret: "" },
  { id: 4,  name: "Black Phone",       category: "Phone",       status: "lost",     description: "Black smartphone with a transparent case and a cracked corner.", location: "Computer Lab",  date: "2026-10-01", image: "images/placeHolder.svg",   reporter: "Student Demo 4",  contact: "919000000004", secret: "" },
  { id: 5,  name: "Green Bottle",      category: "Other",       status: "found",    description: "Green stainless steel water bottle with a sticker of a cat.",    location: "Sports Ground", date: "2026-10-02", image: "images/placeHolder.svg",   reporter: "Student Demo 5",  contact: "919000000005", secret: "dent bottom" },
  { id: 6,  name: "Student ID Card",   category: "ID Card",     status: "found",    description: "Student ID card, the photo shows a student with glasses.",       location: "Main Gate",     date: "2026-10-03", image: "images/placeHolder.svg",   reporter: "Student Demo 6",  contact: "919000000006", secret: "" },
  { id: 7,  name: "White Earbuds",     category: "Electronics", status: "lost",     description: "White wireless earbuds in a small white charging case.",         location: "Library",       date: "2026-10-04", image: "images/placeHolder.svg",   reporter: "Student Demo 7",  contact: "919000000007", secret: "" },
  { id: 8,  name: "Black Umbrella",    category: "Other",       status: "found",    description: "Black folding umbrella with a wooden handle.",                   location: "Parking",       date: "2026-10-08", image: "images/placeHolder.svg",   reporter: "Student Demo 8",  contact: "919000000008", secret: "" },
  { id: 9,  name: "Calculator",        category: "Electronics", status: "returned", description: "Scientific calculator with the initials A.R. written on the back.", location: "Main Building", date: "2026-10-02", image: "images/placeHolder.svg", reporter: "Student Demo 9",  contact: "919000000009", secret: "" },
  { id: 10, name: "Glasses Case",      category: "Other",       status: "lost",     description: "Brown leather glasses case with prescription glasses inside.",   location: "Canteen",       date: "2026-10-09", image: "images/placeHolder.svg",   reporter: "Student Demo 10", contact: "919000000010", secret: "" },
  { id: 11, name: "Keys with Star Keychain", category: "Keys",  status: "found",    description: "Two keys with a star keychain, left on a canteen table.",        location: "Canteen",       date: "2026-10-07", image: "images/placeHolder.svg",   reporter: "Student Demo 11", contact: "919000000011", secret: "red thread" },
  { id: 12, name: "Black Smartphone",  category: "Phone",       status: "found",    description: "Black phone with a transparent case, found on a desk in the lab.", location: "Computer Lab", date: "2026-10-02", image: "images/placeHolder.svg",  reporter: "Student Demo 12", contact: "919000000012", secret: "lion wallpaper" }
];
