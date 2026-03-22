import fs from 'fs';
import path from 'path';

const targetDir = '/home/mario/Documents/GitHub/ClothStreetSL/frontend/src';

const replacements = [
    // Global Hex purples
    { regex: /#8b5cf6/gi, replace: 'var(--brand-primary)' }, // violet-500
    { regex: /#7c3aed/gi, replace: 'var(--brand-primary)' }, // violet-600
    { regex: /#a78bfa/gi, replace: 'var(--brand-primary)' }, // violet-400
    { regex: /#c4b5fd/gi, replace: 'var(--brand-primary)' }, // violet-300
    { regex: /#6366f1/gi, replace: 'var(--brand-primary)' }, // indigo-500
    { regex: /#d946ef/gi, replace: 'var(--brand-primary)' }, // fuchsia-500
    { regex: /#5b21b6/gi, replace: 'var(--brand-hover)' },   // violet-800
    { regex: /#1e1b4b/gi, replace: 'var(--brand-dark)' },    // indigo-950
    // RGBA Purples/Indigos
    { regex: /rgba\(\s*139\s*,\s*92\s*,\s*246\s*,/gi, replace: 'rgba(249, 168, 37,' }, // RGB of #F9A825
    { regex: /rgba\(\s*124\s*,\s*58\s*,\s*237\s*,/gi, replace: 'rgba(249, 168, 37,' },
    { regex: /rgba\(\s*233\s*,\s*213\s*,\s*255\s*,/gi, replace: 'rgba(248, 249, 250,' },
    
    // Toggle ON/OFF buttons
    // The previous pass might have substituted '#7c3aed' -> 'var(--brand-primary)'
    // So we match both original hex and the replaced 'var(--brand-primary)' specifically within toggle logic.
    { regex: /\? "var\(--brand-primary\)" : "#d1d5db"/gi, replace: '? "#10B981" : "#EF4444"' },
    { regex: /\? "#d946ef" : "#d1d5db"/gi, replace: '? "#10B981" : "#EF4444"' },
    { regex: /\? "#7c3aed" : "#d1d5db"/gi, replace: '? "#10B981" : "#EF4444"' }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const r of replacements) {
        content = content.replace(r.regex, r.replace);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Purged purple hex & fixed toggle in: ${filePath.replace(targetDir, '')}`);
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
            processFile(fullPath);
        }
    }
}

console.log("Starting hex purge...");
processDirectory(targetDir);
console.log("Purge complete!");
