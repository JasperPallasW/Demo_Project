# Find Your Lost Items

A campus website where students can report, search, and return lost items, and where
**students who return found items are honored** as Finder Heroes.

## Problem
Students who lose items on campus have no central place to look for them. Messages in chat
groups get buried, and people who find an item often do not know who the owner is.
Many places already let people report *lost* items. Fewer places care about the **finder**.

## Our solution (what is special)
- **Found-item first idea:** reporting and returning found items is rewarded.
- **Finder Heroes:** 10 points per returned item, badges (Good Samaritan, Campus Helper,
  Campus Hero), a podium and ranking, a thank-you wall, and a printable certificate.
- **Student origin:** every account stores where the student is from (Indian state or
  international country) and shows it next to the name, to celebrate our diverse campus.
- **Campus map** with a pin for every item.
- **Low JavaScript:** menu, filters, tabs, FAQ, tooltips, and form switching use only HTML and CSS.

## Features
| Page | What it does |
|---|---|
| Home | Search box, live numbers, how it works, latest items, top finders, FAQ |
| Items | Keyword search (JavaScript), status tabs and category filter (CSS only) |
| Item detail | Photo, details, WhatsApp contact (logged in only), "mark as returned" for the reporter |
| Report | Lost / found form with photo upload (resized in the browser), login required |
| Map | Pins from item data, tooltip with CSS, click opens the item |
| History | Counts and table of all items |
| Finder Heroes | Podium, ranking, badges, thank-you wall |
| Certificate | Printable "Certificate of Appreciation" for a finder |
| Login / Register | localStorage accounts, with state or country of origin |

## Tech stack
HTML5, CSS3, Bootstrap 5.3 (CSS only, no Bootstrap JavaScript), Bootstrap Icons, JavaScript.
Data is saved in the browser (localStorage). There is no server or database.

## How it works (short)
1. `js/data.js` holds demo items. On first open they are copied to localStorage.
2. All pages read and write items through `js/storage.js`.
3. `js/ui.js` builds cards and formats text. `js/auth.js` handles accounts and the navbar.
4. Each page has one small script (`items.js`, `detail.js`, ...).
5. `css/style.css` styles everything and also does the filters, tabs, tooltips, and menu.

## Folder structure
```
index.html          Home page
pages/              items, detail, report, map, history, heroes, certificate, login, register
css/style.css       All our styles (loaded AFTER Bootstrap)
js/                 data, locations, storage, ui, auth + one script per page
images/             Photos and the campus map (file names are case sensitive)
docs/               Plans and guides
```

## How to run
Open `index.html` in a browser (internet is needed for Bootstrap and the icons).
To reset the data: browser DevTools (F12) > Application > Local Storage > clear.

## Demo data and limits
- Names, origins, and contact numbers of the starting items are made up.
- Data is saved per browser; another computer will not see it.
- Passwords are saved as plain text for the demo only. A real product needs a server,
  a database, and hashed passwords.

## Team
| Member | Responsibility |
|---|---|
| Student A (@JasperPallasW) | Pages, JavaScript logic, deployment |
| Student B (@your-partner-username) | Data and photos, map coordinates, documentation, presentation, CSS polish |

From 7 to 16 Oct, Student A worked alone because Student B was not available.
