// parse-tailwind.js
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

function collectClassesFromSelector(selector, classSet) {
    // Use postcss-selector-parser to walk the AST of the selector
    const transform = selectorParser(selectors => {
        selectors.walkClasses(classNode => {
            // classNode.value is the unescaped class name (no leading dot).
            // e.g., for .sm\\:bg-red-500, classNode.value = 'sm:bg-red-500'
            // If you want the raw, escaped text, see classNode.raws.value.
            classSet.add(classNode.value);
        });
    });

    // Parse the selector text (synchronously)
    transform.processSync(selector);
}

function getAllTailwindClassesFromFile(filePath) {
    const cssContent = fs.readFileSync(filePath, 'utf-8');

    const root = postcss.parse(cssContent);

    const classNames = new Set();

    // 5) Walk each CSS rule in the file
    root.walkRules(rule => {
        // A single "rule" might contain multiple comma-separated selectors
        // e.g., .sm\\:bg-red-500:hover, .focus\\:bg-red-500
        rule.selectors.forEach(selector => {
            collectClassesFromSelector(selector, classNames);
        });
    });

    return [...classNames];
}

const cssFilePath = path.join(__dirname, 'wwwroot', 'dist', 'rizzyui.css');

const allClasses = getAllTailwindClassesFromFile(cssFilePath);

const safelistJsContent = `module.exports = ${JSON.stringify(allClasses, null, null)};`;

const outputPath = path.join(__dirname, 'safelist.js');
fs.writeFileSync(outputPath, safelistJsContent, 'utf-8');

console.log(`Safelist written to ${outputPath}`);