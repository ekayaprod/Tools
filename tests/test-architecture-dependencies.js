const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running Architecture Standard: Bookmarklet Dependencies...');

const bookmarkletsDir = path.join(__dirname, '../bookmarklets');
let targetFiles = [];

try {
    // Determine changed files robustly. Use git ls-files if no PR target branch is easily known
    // but the prompt strictly wants us to try Boy Scout Rule if possible.
    // Since we're in a CI test runner, if this is a PR, we might have origin/main.
    // We'll use a safer diff, and fallback to evaluating everything.
    const diffCmd = 'git diff --name-only origin/main...HEAD 2>/dev/null || git diff --name-only main...HEAD 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null';
    let output = '';
    try {
        output = execSync(diffCmd, { encoding: 'utf8' }).trim();
    } catch {
        // If all diff commands fail, we don't have a reliable diff (e.g. shallow clone, no main branch).
    }

    if (output) {
        targetFiles = output.split('\n')
            .filter(f => f.startsWith('bookmarklets/') && f.endsWith('.js'))
            .map(f => path.basename(f));
    }

    if (targetFiles.length === 0) {
        // Fallback: If no files changed, or shallow clone issue, evaluate all files
        targetFiles = fs.readdirSync(bookmarkletsDir).filter(f => f.endsWith('.js'));
    }
} catch {
    // Robust fallback: Evaluate all files in the directory
    targetFiles = fs.readdirSync(bookmarkletsDir).filter(f => f.endsWith('.js'));
}

let errors = [];

for (const file of targetFiles) {
    // Ignore files that are not supposed to have the require directive
    if (file === 'utils.js' || file === 'html-to-markdown.js') continue;

    const filePath = path.join(bookmarkletsDir, file);
    if (!fs.existsSync(filePath)) continue; // File might have been deleted

    const content = fs.readFileSync(filePath, 'utf8');

    // Abstract Syntax Tree parsing would be better, but regex/string matching is practical here
    // for catching the specific block comment pattern.
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
    process.exit(1);
} else {
    console.log('✅ Architecture Standard: Dependencies verified.');
}
