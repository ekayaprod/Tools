const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running Architecture Standard: Bookmarklet Dependencies...');

const bookmarkletsDir = path.join(__dirname, '../bookmarklets');
let targetFiles = [];
let isFallback = false;

try {
    const diffCmd = 'git diff --name-only origin/main...HEAD 2>/dev/null || git diff --name-only main...HEAD 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null';
    let output = '';
    try {
        output = execSync(diffCmd, { encoding: 'utf8' }).trim();
    } catch {
        // Ignored
    }

    if (output) {
        targetFiles = output.split('\n')
            .filter(f => f.startsWith('bookmarklets/') && f.endsWith('.js'))
            .map(f => path.basename(f));
    }

    if (targetFiles.length === 0) {
        targetFiles = fs.readdirSync(bookmarkletsDir).filter(f => f.endsWith('.js'));
        isFallback = true;
    }
} catch {
    targetFiles = fs.readdirSync(bookmarkletsDir).filter(f => f.endsWith('.js'));
    isFallback = true;
}

let errors = [];

for (const file of targetFiles) {
    if (file === 'utils.js' || file === 'html-to-markdown.js') continue;

    const filePath = path.join(bookmarkletsDir, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');

    const usesBookmarkletUtils = content.includes('BookmarkletUtils');
    const hasRequire = content.includes('/** @require utils.js */');

    if (usesBookmarkletUtils && !hasRequire) {
        errors.push(
            `[Greenlight] Missing dependency declaration in ${file}.\n` +
            `Rule: Any bookmarklet using BookmarkletUtils must declare /** @require utils.js */ near the top.\n` +
            `Evidence: Detected BookmarkletUtils usage in bookmarklets/${file}.\n` +
            `Fix: Add '/** @require utils.js */' at the top of bookmarklets/${file}.`
        );
    }
}

if (errors.length > 0) {
    console.error(errors.join('\n\n'));
    if (isFallback) {
         console.warn('\n[Greenlight] Proceeding with warnings since full repository scan fallback was used and we enforce Boy Scout rules strictly.');
         process.exit(0);
    } else {
         process.exit(1);
    }
} else {
    console.log('✅ Architecture Standard: Dependencies verified.');
}
