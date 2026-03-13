import fs from 'fs';
import path from 'path';

// Define the directory to start scanning from
const targetDir = 'c:/Users/Imedha Indeewari/ClothStreetSL/frontend/src';

// Regexes to find what we need to replace
const bgRegex = /bg-(white|black|gray-\d+|zinc-\d+|slate-\d+|purple-\d+|indigo-\d+|pink-\d+|red-\d+|blue-\d+)(\/\d+)?/g;
const textRegex = /text-(white|black|gray-\d+|zinc-\d+|slate-\d+|purple-\d+|indigo-\d+|pink-\d+|red-\d+|blue-\d+)(\/\d+)?/g;
const borderRegex = /border-(white|black|gray-\d+|zinc-\d+|slate-\d+|purple-\d+|indigo-\d+|pink-\d+|red-\d+|blue-\d+)(\/\d+)?/g;
const shadowRegex = /shadow-(sm|md|lg|xl|2xl|inner|none)/g; // Remove specific shadows since we handle it in theme
const fontRegex = /font-(sans|serif|mono)/g;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Check if the file contains JSX/TSX classNames or style attributes
    if (!content.includes('className=') && !content.includes('style=')) {
        return;
    }

    // In a comprehensive design system replacement, we want to map components to semantic classes 
    // instead of arbitrary tailwind classes.

    // 1. Remove explicit light/dark background colors to let --clr-bg, --clr-surface take over 
    //    We don't remove structural classes (flex, p-4, m-2, rounded, etc)
    content = content.replace(bgRegex, '');
    
    // 2. Remove explicit text colors to let --clr-text take over
    content = content.replace(textRegex, '');
    
    // 3. Remove explicit border colors
    content = content.replace(borderRegex, '');

    // 4. Clean up multiple spaces left by regex replacements inside classNames
    content = content.replace(/className=(["'{`])[ \t]+/g, 'className=$1');
    content = content.replace(/[ \t]+([\"'}`])/g, '$1');
    content = content.replace(/[ \t]{2,}/g, ' ');

    // 5. Inject theme semantic classes strategically
    // This part is heuristic based. If something was a "rounded-2xl border p-5", it was likely a card.
    // If it was a generic button, it needs the 'theme-btn' class.
    
    // A very basic heuristic: Add "theme-card" to divs that look like cards (have padding, rounded, shadow, border)
    // Actually, in the theme.css, we globally target .card or .theme-card
    
    // Instead of regex hacking the semantic classes into every div perfectly (which is error prone),
    // let's apply the most critical transformations: removing conflicting Tailwind colors so the 
    // global variables mapped to `body`, `button`, layout divs, etc., naturally apply.

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && /\.(jsx?|tsx?|css)$/.test(fullPath)) {
            // we process it
            processFile(fullPath);
        }
    }
}

console.log("Starting theme application...");
processDirectory(targetDir);
console.log("Done.");
