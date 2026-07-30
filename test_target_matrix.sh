#!/bin/bash
# Scan for Empty Structural Shells
echo "--- Empty catch {} ---"
grep -rnE 'catch\s*\(\s*\w+\s*\)\s*\{\s*\}|catch\s*\{\s*\}' bookmarklets mailto-link-generator || true
echo "--- Empty try/catch {} ---"
grep -rnE 'try\s*\{\s*\}\s*catch' bookmarklets mailto-link-generator || true
echo "--- Empty function ---"
grep -rnE 'function\s*\w*\s*\([^\)]*\)\s*\{\s*\}|\([^\)]*\)\s*=>\s*\{\s*\}' bookmarklets mailto-link-generator || true
echo "--- Empty if/else {} ---"
grep -rnE 'if\s*\([^\)]*\)\s*\{\s*\}|else\s*\{\s*\}' bookmarklets mailto-link-generator || true
echo "--- Empty CSS {} (same line) ---"
grep -rnE '\{\s*\}' bookmarklets mailto-link-generator | grep -v 'function' | grep -v '=>' | grep '\.css' || true

# Orphaned Entities
echo "--- Unused package imports ---"
# Complex to grep accurately without AST, skip for now in bash

# Semantic Tautologies
echo "--- Semantic Tautologies (=== true/false) ---"
grep -rnE '===\s*true|===\s*false' bookmarklets mailto-link-generator || true

# Fossilized Debris
echo "--- Fossilized Debris (// code or TODO) ---"
grep -rnE '^\s*//\s*(TODO:|.*=.*|.*\(.*|.*\{.*)' bookmarklets mailto-link-generator || true

# Diagnostic Droppings
echo "--- Diagnostic Droppings ---"
grep -rnE 'console\.log\(|debugger;|alert\(|console\.warn\(' bookmarklets mailto-link-generator || true
