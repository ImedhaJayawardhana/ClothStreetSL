import fs from 'fs';
import path from 'path';

const targetDir = '/home/mario/Documents/GitHub/ClothStreetSL/frontend/src';

// Regex to capture tailwind structural classes + colors
// Examples: hover:bg-blue-600, text-purple-700, ring-indigo-500/50
const themeRegex = /([a-z0-9:-]+)-(blue|purple|violet|indigo)-(\d+)(\/[0-9]+)?/g;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    content = content.replace(themeRegex, (match, prefix, colorName, shade, alpha) => {
        // Change color to amber, preserving the prefix, shade, and alpha
        const replacement = alpha ? `${prefix}-amber-${shade}${alpha}` : `${prefix}-amber-${shade}`;
        return replacement;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath.replace(targetDir, '')}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(fullPath)) {
            processFile(fullPath);
        }
    }
}

console.log("Starting full-stack theme update...");
processDirectory(targetDir);
console.log("Theme perfectly transitioned to Amber/Orange!");
