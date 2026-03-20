import fs from 'fs';
import path from 'path';

const navbarPath = '/home/mario/Documents/GitHub/ClothStreetSL/frontend/src/components/common/Navbar.jsx';
const footerPath = '/home/mario/Documents/GitHub/ClothStreetSL/frontend/src/components/common/Footer.jsx';
const cssPath = '/home/mario/Documents/GitHub/ClothStreetSL/frontend/src/index.css';

console.log("Applying Desert Street rules to specific components...");

if (fs.existsSync(navbarPath)) {
    let nav = fs.readFileSync(navbarPath, 'utf8');
    nav = nav.replace(/hover:text-slate-900/g, 'hover:text-amber-500');
    nav = nav.replace(/hover:bg-slate-100 font-medium/g, 'hover:bg-slate-100 hover:text-amber-500 font-medium');
    fs.writeFileSync(navbarPath, nav);
    console.log("Navbar links fixed.");
}

if (fs.existsSync(footerPath)) {
    let ft = fs.readFileSync(footerPath, 'utf8');
    ft = ft.replace(/bg-amber-100\/50 text-slate-800/g, 'bg-[#1C1E20] text-white');
    ft = ft.replace(/text-slate-900/g, 'text-white');
    ft = ft.replace(/text-slate-700/g, 'text-slate-300');
    ft = ft.replace(/text-slate-600/g, 'text-slate-400');
    ft = ft.replace(/hover:text-amber-700/g, 'hover:text-amber-500');
    ft = ft.replace(/border-amber-200/g, 'border-slate-800');
    fs.writeFileSync(footerPath, ft);
    console.log("Footer dark aesthetic applied.");
}

// Add utility class for secondary buttons globally if missing
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.btn-secondary-desert')) {
    css += `\n
@layer components {
  /* Secondary Desert Buttons */
  .btn-secondary,
  .btn-outline-dark {
    border: 1px solid var(--brand-dark);
    color: var(--brand-dark);
    background-color: transparent;
    transition: all 0.2s ease;
  }
  .btn-secondary:hover,
  .btn-outline-dark:hover {
    background-color: var(--brand-dark);
    color: #FFFFFF;
  }
  
  /* Desert Badges */
  .badge-desert {
    background-color: var(--text-muted);
    color: #FFFFFF;
    border: none;
  }
}
`;
    fs.writeFileSync(cssPath, css);
    console.log("Injected button/badge CSS utilities.");
}

// Scan to replace badge colors and secondary buttons
const targetDir = '/home/mario/Documents/GitHub/ClothStreetSL/frontend/src';

function processJSX(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Convert badges describing 'Available' or 'Expert' to muted accent.
    // Instead of regex hacking every word, we replace explicit green tags for Available
    content = content.replace(/bg-green-100 text-green-800/g, 'bg-[#A8A88E] text-white');
    content = content.replace(/bg-emerald-100 text-emerald-800/g, 'bg-[#A8A88E] text-white');
    content = content.replace(/bg-emerald-500\/90/g, 'bg-[#A8A88E]');
    content = content.replace(/'bg-emerald-500'/g, "'bg-[#A8A88E]'");
    
    // For portfolio / secondary buttons, we look for explicit outline bounds
    content = content.replace(/border-2 border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50/gi, 'btn-secondary rounded-xl py-2.5 px-4 font-semibold');
    content = content.replace(/border-slate-[2-3]00 text-slate-700 hover:bg-slate-50/gi, 'btn-secondary');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (/\.jsx?$/.test(fullPath)) {
            processJSX(fullPath);
        }
    });
}
walkDir(targetDir);
console.log("Components sweep completed!");
