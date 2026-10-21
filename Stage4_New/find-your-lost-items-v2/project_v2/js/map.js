// map.js - put one pin on the campus map for every item.
// Positions of the buildings are in locations.js (in percent).
// The tooltip text is shown by CSS (data-tip), not by JavaScript.

const mapItems = getItems();
const mapPins = document.getElementById("mapPins");
const pinsPerPlace = {}; // how many pins are already at each building

let pinCount = 0;
mapPins.innerHTML = "";

for (let i = 0; i < mapItems.length; i++) {
  const item = mapItems[i];
  const place = campusLocations[item.location];
  if (place === undefined) {
    continue; // location "Other" has no place on the map
  }

  // Several items in the same building: move each pin a little, so they do not cover each other
  const k = pinsPerPlace[item.location] || 0;
  pinsPerPlace[item.location] = k + 1;
  const left = place.x + ((k % 4) - 1.5) * 3;
  const top = place.y + Math.floor(k / 4) * 5;

  mapPins.innerHTML += `
    <a href="detail.html?id=${item.id}" class="map-pin pin-${item.status}"
       style="left: ${left}%; top: ${top}%;"
       data-tip="${escapeHtml(item.name)} (${capitalize(item.status)}) - ${escapeHtml(item.location)}"
       aria-label="${escapeHtml(item.name)}"></a>`;
  pinCount++;
}

setText("mapNote", pinCount + " item(s) shown on the map.");
