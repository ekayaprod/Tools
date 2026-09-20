# Greenlight Rules Catalog

| Rule ID | Standard | Evidence | Fix Hint |
| :--- | :--- | :--- | :--- |
| GL-001 | Bookmarklets using `BookmarkletUtils` must declare `/** @require utils.js */` | Enforced in `bookmarklets/web-clipper.js`, `bookmarklets/property-clipper.js`, `bookmarklets/macro-builder.js`, etc. and required by `scripts/bookmarklet-builder.js`. | Add `/** @require utils.js */` at the top of the IIFE. |
