// matching.js - a simple "AI": find lost and found items that are probably the same object
// It does not use any outside service. It gives each pair of items a SCORE
// from 0 to 100 using rules (rule-based recommendation).
// Load it BEFORE detail.js.

const MIN_SCORE = 50; // show only matches with this score or more

// Words that do not help to compare items
const IGNORE_WORDS = ["the", "and", "for", "with", "inside", "small", "that", "this",
                      "from", "have", "into", "near", "found", "lost", "item", "are",
                      "was", "has", "her", "his", "its", "one"];

// Make a list of useful words (no repeats) from a text
function getKeywords(text) {
  const parts = text.toLowerCase().split(/[^a-z0-9]+/);
  const words = [];
  for (let i = 0; i < parts.length; i++) {
    const word = parts[i];
    if (word.length >= 3 && IGNORE_WORDS.indexOf(word) === -1 && words.indexOf(word) === -1) {
      words.push(word);
    }
  }
  return words;
}

// Score of two items:
//   same category            +40
//   same location            +30
//   each shared keyword      +10 (at most +20)
//   dates are 3 days or less +10
// The result is never more than 100.
function calculateScore(a, b) {
  let score = 0;

  if (a.category === b.category) {
    score += 40;
  }
  if (a.location === b.location) {
    score += 30;
  }

  const wordsA = getKeywords(a.name + " " + a.description);
  const wordsB = getKeywords(b.name + " " + b.description);
  let shared = 0;
  for (let i = 0; i < wordsA.length; i++) {
    if (wordsB.indexOf(wordsA[i]) !== -1) {
      shared++;
    }
  }
  score += Math.min(shared * 10, 20);

  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const difference = Math.abs(new Date(a.date) - new Date(b.date)) / oneDay;
  if (difference <= 3) {
    score += 10;
  }

  return Math.min(score, 100);
}

// Find the best matches for one item.
// A LOST item is compared with FOUND items, and a FOUND item with LOST items.
// Returns a list like [ { item: ..., score: 90 }, ... ] with the best first (max 3).
function findMatches(item, list) {
  if (item.status === "returned") {
    return [];
  }
  const wanted = item.status === "lost" ? "found" : "lost";
  const matches = [];

  for (let i = 0; i < list.length; i++) {
    const other = list[i];
    if (other.id === item.id || other.status !== wanted) {
      continue;
    }
    const score = calculateScore(item, other);
    if (score >= MIN_SCORE) {
      matches.push({ item: other, score: score });
    }
  }

  matches.sort(function (a, b) {
    return b.score - a.score; // biggest score first
  });
  return matches.slice(0, 3);
}
