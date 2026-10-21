// locations.js - where each building is on the campus map image.
// x = distance from the LEFT edge in percent, y = distance from the TOP edge in percent.
// Example: x: 50, y: 50 is the exact middle of the map.
// When we replace the placeholder map with the real campus map,
// only the numbers in this file need to change.

const campusLocations = {
  "Main Building": { x: 25, y: 25 },
  "Library":       { x: 75, y: 25 },
  "Canteen":       { x: 16, y: 77 },
  "Computer Lab":  { x: 36, y: 77 },
  "Sports Ground": { x: 68, y: 77 },
  "Parking":       { x: 88, y: 77 },
  "Main Gate":     { x: 50, y: 96 }
};
