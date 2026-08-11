# Design Decision Ledger

**bookmarklets/quick-clicker.js**
- Abstracted hardcoded close button styles, text color overrides, danger background overrides into standard scoped classes (`.qc-close-btn`, `.qc-label`, `.qc-btn-danger`).
- Added interaction polish on `.qc-close-btn:hover` and `.qc-btn-danger:hover` to meet Palette+ target guidelines.
- Standardized checkbox flex wrappers to `.qc-checkbox-wrapper` to avoid inline text margins.

**bookmarklets/delayed-clicker.js**
- Abstracted center-alignment, negative margins, and hardcoded success colors (`#4ade80`) into tokenized CSS classes (`.dc-label-center`, `.dc-btn-cancel`, `.dc-success-text`).
- Prevented HTML component littering with inline `style="text-align:center"`.

**bookmarklets/property-clipper.js**
- Abstracted header layouts into `.pc-header-left`.
- Converted structural `.hero-section` inline padding and border configurations into `.pc-hero-section`.
- Abstracted spinner alignment logic out of raw HTML strings into `.pc-spinner-wrapper`.
- Added canonical border variable usage (`var(--pc-border)`).
## Palette+ Design Manifest: KidsLondon.html
* **Structural Fix:** Wrapped raw React JSX in valid HTML5 with React, ReactDOM, Babel, and Tailwind CSS CDNs to solve rendering failure.
* **Modal Animation:** Injected `@keyframes` (`fade-in`, `slide-up`) to choreograph a premium, fluid entrance for the ActivityModal.
* **Accessibility & Interactions:** Refactored `ActivityCard` from a rigid `div` to a semantic `button type="button"`. Enhanced all interactive elements (close buttons, filter buttons, links) with `focus-visible:ring-2`, fluid `ease-in-out` transitions, and `active:scale-95` scale transforms.
