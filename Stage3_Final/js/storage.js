// storage.js - save and read the items in localStorage
// data.js must be loaded BEFORE this file (it gives the starting list "items").
//
// Idea: data.js is only the STARTING data. The first time the website opens,
// we copy it to localStorage. After that, every page reads and writes
// the items in localStorage, so new reports are kept.

const ITEMS_KEY = "lf_items";

// Save the list of items. Returns true if it worked, false if the browser
// storage is full (for example when a photo is too big).
function saveItems(list) {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(list)); // list -> text
    return true;
  } catch (error) {
    return false;
  }
}

// Get all items. The first time, copy the starting items from data.js.
function getItems() {
  const saved = localStorage.getItem(ITEMS_KEY);
  if (saved === null) {
    saveItems(items); // "items" comes from data.js
    return items.slice(); // a copy of the list
  }
  try {
    return JSON.parse(saved); // text -> list
  } catch (error) {
    return [];
  }
}

// Add a new item. Returns the saved item, or null if it could not be saved.
function addItem(newItem) {
  const list = getItems();

  // new id = the biggest id + 1
  let biggestId = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].id > biggestId) {
      biggestId = list[i].id;
    }
  }
  newItem.id = biggestId + 1;

  list.push(newItem);
  if (saveItems(list) === false) {
    return null;
  }
  return newItem;
}

// Find one item by its id. Returns the item, or null if not found.
function findItemById(id) {
  const list = getItems();
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i];
    }
  }
  return null;
}

// Change the status of an item (for example to "returned").
// Returns true if the item was found and saved.
function updateItemStatus(id, newStatus) {
  const list = getItems();
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].status = newStatus;
      return saveItems(list);
    }
  }
  return false;
}

// For testing only: type resetItems() in the browser Console (F12) to go back
// to the starting data from data.js.
function resetItems() {
  localStorage.removeItem(ITEMS_KEY);
}
