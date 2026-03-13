import fs from 'fs';
import path from 'path';

const targetDir = 'c:/Users/Imedha Indeewari/ClothStreetSL/frontend/src/pages';
const outputFile = 'C:/Users/Imedha Indeewari/ClothStreetSL/frontend/unified_design_system_output.md';

let outputStr = '';

function appendFile(filePath, displayName) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        outputStr += `// ── ${displayName} ──\n`;
        outputStr += content;
        outputStr += '\n\n';
    }
}

appendFile('c:/Users/Imedha Indeewari/ClothStreetSL/frontend/src/styles/theme.css', 'theme.css');
appendFile('c:/Users/Imedha Indeewari/ClothStreetSL/frontend/index.html', 'index.html');
appendFile('c:/Users/Imedha Indeewari/ClothStreetSL/frontend/src/App.css', 'app.css');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(fullPath)) {
            appendFile(fullPath, path.basename(fullPath));
        }
    }
}

processDirectory(targetDir);
processDirectory('c:/Users/Imedha Indeewari/ClothStreetSL/frontend/src/components');

fs.writeFileSync(outputFile, outputStr, 'utf8');
console.log(`Generated output file at ${outputFile}`);
