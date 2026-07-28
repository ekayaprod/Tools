## Component Design Decision Manifest

**Components Swept:**
- `bookmarklets/job-clipper.js`
- `bookmarklets/macro-builder.js`

**The Hover State Interpolation (Signature) / Brushstrokes & UX Patterns Applied:**
1. **The Hardcoded Hex Extradition:**
   - In `job-clipper.js`: Extracted hardcoded `#fff` into `--jc-white: #ffffff` and unified all active states and background declarations with canonical design tokens across the host layout.

2. **The Rigid State / The Lifeless Transition:**
   - In `macro-builder.js`: Eliminated rigid `.style.cssText` JavaScript manipulation across layout nodes, decoupling presentation and structural DOM. Injected missing visual tokens to represent hidden DOM logic using explicit class orchestrations (`.mb-hidden`, `.hidden`) to prevent unrefined, jarring binary UI transitions and to support future orchestrated motion patterns. Fixed Shadow DOM containment scope issues with class `.mb-runtime-host` targeting (`:host(.mb-runtime-host)`). Addressed critical UX gaps on the `.mb-highlight-box` hover logic in the Light DOM.
