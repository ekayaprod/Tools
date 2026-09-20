// @ts-check
const fs = require('fs');
const path = require('path');

const bookmarkletsDir = path.join(__dirname, '../../bookmarklets');
const files = fs.readdirSync(bookmarkletsDir).filter(f => f.endsWith('.js') && f !== 'utils.js' && f !== 'html-to-markdown.js');

let violations = [];

for (const file of files) {
    const fullPath = path.join(bookmarkletsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check if it uses BookmarkletUtils but doesn't require utils.js
    if (content.includes('BookmarkletUtils') && !content.includes('@require utils.js')) {
        // find line number of first usage
        const lines = content.split('\n');
        let lineNo = 1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('BookmarkletUtils')) {
                lineNo = i + 1;
                break;
            }
        }
        violations.push({
            file: `bookmarklets/${file}`,
            line: lineNo,
            message: `[GL-001] Bookmarklet uses BookmarkletUtils but lacks /** @require utils.js */. Every other bookmarklet using it declares the dependency (e.g., bookmarklets/web-clipper.js:4). Fix: Add /** @require utils.js */ at the top of the IIFE. Re-run: node .greenlight/rules/bookmarklet-dependencies.js`
        });
    }
}

if (violations.length > 0) {
    fs.writeFileSync(path.join(__dirname, '../report.json'), JSON.stringify({ violations }, null, 2));

    // Check if we are passing baseline to not fail grandfathered
    const baselinePath = path.join(__dirname, '../baseline.json');
    let baseline = [];
    if (fs.existsSync(baselinePath)) {
        baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    }

    // Check for human waivers
    const waiversPath = path.join(__dirname, '../waivers.yml');
    let waivers = [];
    if (fs.existsSync(waiversPath)) {
        const waiversContent = fs.readFileSync(waiversPath, 'utf8');
        const lines = waiversContent.split('\n');
        let currentFile = null;
        let currentRule = null;
        for (const line of lines) {
            if (line.trim().startsWith('- rule:')) {
                currentRule = line.split(':')[1].trim();
            } else if (line.trim().startsWith('path:')) {
                currentFile = line.split(':')[1].trim();
                if (currentRule && currentFile) {
                    waivers.push({ rule: currentRule, file: currentFile });
                    currentRule = null;
                    currentFile = null;
                }
            }
        }
    }

    let isFailed = false;
    for (const v of violations) {
        // Is it grandfathered?
        const isGrandfathered = baseline.some(b => b.file === v.file && b.rule === 'GL-001');
        // Is it waived?
        const isWaived = waivers.some(w => w.file === v.file && w.rule === 'GL-001');

        if (!isGrandfathered && !isWaived) {
            console.error(`::error file=${v.file},line=${v.line}::${v.message}`);
            isFailed = true;
        }
    }
    if (isFailed) {
        process.exit(1);
    }
} else {
    fs.writeFileSync(path.join(__dirname, '../report.json'), JSON.stringify({ violations: [] }, null, 2));
}
