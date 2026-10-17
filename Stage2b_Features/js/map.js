// map.js - draw one pin for each item on the campus map (map.html)
// Load order: auth.js, utils.js, data.js, storage.js, locations.js, map.js

const mapContainer = document.getElementById("mapContainer");

// Items in the same place would hide each other, so we move them a little.
// position = 0 for the first item in a place, 1 for the second, and so on.
function getPinPosition(locationName, position) {
  let place = locations[locationName];
  if (place === undefined) {
    place = locations["Other"]; // unknown place -> use "Other"
  }
  return {
    x: place.x + (position % 4) * 3,
    y: place.y + Math.floor(position / 4) * 5
  };
}

// Make one pin (a link) and put it on the map
function createPin(item, x, y) {
  const pin = document.createElement("a");
  pin.className = "map-pin pin-" + item.status;
  pin.href = "detail.html?id=" + item.id;
  pin.style.left = x + "%";
  pin.style.top = y + "%";
  pin.title = item.name + " (" + capitalize(item.status) + ") - " + item.location;
  mapContainer.appendChild(pin);
}

// Remove old pins, then draw one pin per item
function showPins(list) {
  const oldPins = mapContainer.querySelectorAll(".map-pin");
  for (let i = 0; i < oldPins.length; i++) {
    oldPins[i].remove();
  }

  const used = {}; // how many pins are already in each place
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (used[item.location] === undefined) {
      used[item.location] = 0;
    }
    const spot = getPinPosition(item.location, used[item.location]);
    used[item.location] = used[item.location] + 1;
    createPin(item, spot.x, spot.y);
  }
}

showPins(getItems());
