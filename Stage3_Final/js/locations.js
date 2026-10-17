// locations.js - where each place is on the campus map image
// x = distance from the LEFT edge, y = distance from the TOP edge,
// both in percent (0 to 100) of the map image.
// The numbers below fit the temporary placeholder map.
// When we use the REAL campus map, measure the new positions and change them here.
// The names must be the same as the names in the report form and in data.js.

const locations = {
  "Main Building": { x: 25,   y: 25 },
  "Library":       { x: 75,   y: 25 },
  "Canteen":       { x: 16,   y: 77 },
  "Computer Lab":  { x: 36,   y: 77 },
  "Sports Ground": { x: 68,   y: 77 },
  "Parking":       { x: 88,   y: 77 },
  "Main Gate":     { x: 50,   y: 94 },
  "Other":         { x: 50,   y: 52 }
};
