# Upwork Highlighter

Upwork Highlighter is a small browser extension (Manifest V3) that helps filter out unwanted job posts on Upwork by hiding job cards that contain blacklisted words or phrases.

Key features
- Maintain a blacklist of words/phrases (options page).
- Hide job cards on the current page that match any blacklist entry (popup control or keyboard shortcut).
- Quickly add text selections from the page to the blacklist via the popup.

Quick install (for Chromium-based browsers)
1. Open chrome://extensions (or edge://extensions).
2. Enable "Developer mode".
3. Click "Load unpacked" and select this repository folder.

Usage
- Open the extension popup (click the toolbar icon):
  - F button: run the filter on the current tab to hide matching job cards.
  - - (minus) button: add the currently selected text on the page to the blacklist.
- Open Options (via extension details or the options page) to add, edit, or clear the blacklist. Each line in the textbox is treated as one blacklist entry.

Technical notes
- Manifest: manifest.json (MV3) requests activeTab, scripting and storage permissions.
- Popup script: popup.js — contains logic to run the page filtering and to add selections to the blacklist.
- Options script: options.js — read/write blacklist entries in chrome.storage.local.
- The filter currently targets elements with the class .job-title and hides their ancestor card elements; it performs simple tokenization and lowercasing to match blacklist entries.

Development
- Run and debug by loading unpacked extension as described above.
- Modify popup.js / options.js / HTML/CSS and reload the extension to test changes.

Limitations and notes
- Matching is done via simple tokenization so complex phrase matching or partial-word matching may not behave as expected.
- The selector .job-title is specific to a particular Upwork DOM structure and may need to be adjusted if Upwork changes its markup.

License
MIT license
