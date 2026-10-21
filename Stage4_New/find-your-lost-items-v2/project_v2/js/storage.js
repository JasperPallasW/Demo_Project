// storage.js - everything about saving and reading data.
// We use localStorage: a small storage inside the browser (instead of a database).
// localStorage can only keep TEXT, so we use:
//   JSON.stringify(list)  = list -> text (before saving)
//   JSON.parse(text)      = text -> list (after reading)

const USERS_KEY = "lf_users";                // all registered accounts
const CURRENT_USER_KEY = "lf_current_user";  // who is logged in now
const ITEMS_KEY = "lf_items";                // all items (seed items + new reports)
const SEED_VERSION_KEY = "lf_seed_version";  // which version of data.js was loaded

const POINTS_PER_RETURN = 10;

// Honor badges. The first one that matches (from top to bottom) is the badge.
const BADGES = [
  { min: 3, name: "Campus Hero",    level: "gold",   icon: "bi-trophy-fill" },
  { min: 2, name: "Campus Helper",  level: "silver", icon: "bi-award-fill" },
  { min: 1, name: "Good Samaritan", level: "bronze", icon: "bi-heart-fill" }
];

// ---------- Basic read / write ----------

// Read a list from localStorage. If nothing is saved (or the text is broken), return "fallback".
function readJson(key, fallback) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return fallback;
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Users ----------

function getUsers() {
  return readJson(USERS_KEY, []);
}

function saveUsers(users) {
  writeJson(USERS_KEY, users);
}

// Return the user with this email, or null if there is none
function findUserByEmail(email) {
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return users[i];
    }
  }
  return null;
}

function findUserByStudentId(studentId) {
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].studentId === studentId) {
      return users[i];
    }
  }
  return null;
}

// Who is logged in now? (user object, or null if nobody)
function getCurrentUser() {
  return readJson(CURRENT_USER_KEY, null);
}

function setCurrentUser(user) {
  writeJson(CURRENT_USER_KEY, user);
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ---------- Items ----------

// Get all items.
// The first time (or when SEED_VERSION in data.js changes), the demo items from
// data.js are copied into localStorage. Items added by users are always kept.
function getItems() {
  let list = readJson(ITEMS_KEY, null);
  const savedVersion = localStorage.getItem(SEED_VERSION_KEY);

  if (list === null || savedVersion !== String(SEED_VERSION)) {
    const userItems = [];
    if (list !== null) {
      for (let i = 0; i < list.length; i++) {
        if (!list[i].isSeed) {
          userItems.push(list[i]);
        }
      }
    }

    const freshSeeds = [];
    for (let i = 0; i < seedItems.length; i++) {
      freshSeeds.push(Object.assign({}, seedItems[i], { isSeed: true }));
    }

    list = freshSeeds.concat(userItems);
    writeJson(ITEMS_KEY, list);
    localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION));
  }
  return list;
}

function saveItems(list) {
  writeJson(ITEMS_KEY, list);
}

// Find one item by its id (the id from the web address is text, so we compare as text)
function getItemById(id) {
  const list = getItems();
  for (let i = 0; i < list.length; i++) {
    if (String(list[i].id) === String(id)) {
      return list[i];
    }
  }
  return null;
}

// Add a new item to the list and save it
function addItem(item) {
  const list = getItems();
  list.push(item);
  saveItems(list);
}

// Today as text, like "2026-10-15" (local time)
function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// Mark an item as returned. Returns the updated item, or null if it does not exist.
function markItemReturned(id, returnedTo, returnedNote) {
  const list = getItems();
  for (let i = 0; i < list.length; i++) {
    if (String(list[i].id) === String(id)) {
      list[i].status = "returned";
      list[i].returnedDate = todayString();
      list[i].returnedTo = returnedTo;
      list[i].returnedNote = returnedNote;
      saveItems(list);
      return list[i];
    }
  }
  return null;
}

// ---------- Statistics and Finder Heroes ----------

// Count items by status. Example result: { lost: 4, found: 3, returned: 6 }
function countByStatus(list) {
  const counts = { lost: 0, found: 0, returned: 0 };
  for (let i = 0; i < list.length; i++) {
    if (counts[list[i].status] !== undefined) {
      counts[list[i].status]++;
    }
  }
  return counts;
}

// Which badge belongs to this number of returned items? (null = no badge yet)
function getBadge(returns) {
  for (let i = 0; i < BADGES.length; i++) {
    if (returns >= BADGES[i].min) {
      return BADGES[i];
    }
  }
  return null;
}

// Build the ranking of finders from a list of items.
// A finder earns 1 return when a "found" item reported by him/her is marked as returned.
function buildFinderBoard(list) {
  const finders = {};

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.reportType === "found" && item.status === "returned") {
      if (finders[item.reporterId] === undefined) {
        finders[item.reporterId] = {
          id: item.reporterId,
          name: item.reporterName,
          origin: item.reporterOrigin,
          returns: 0
        };
      }
      finders[item.reporterId].returns++;
    }
  }

  const board = [];
  for (const key in finders) {
    const finder = finders[key];
    finder.points = finder.returns * POINTS_PER_RETURN;
    finder.badge = getBadge(finder.returns);
    board.push(finder);
  }

  // Most returns first. If equal, sort by name.
  board.sort(function (a, b) {
    if (b.returns !== a.returns) {
      return b.returns - a.returns;
    }
    return a.name.localeCompare(b.name);
  });
  return board;
}

function getFinderBoard() {
  return buildFinderBoard(getItems());
}
