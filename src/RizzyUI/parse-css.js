// parse-tailwind.js
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

// 1) Utility function to parse a single selector string and collect classes
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
    // 2) Read the Tailwind-generated CSS file
    const cssContent = fs.readFileSync(filePath, 'utf-8');

    // 3) Parse with PostCSS
    const root = postcss.parse(cssContent);

    // 4) Use a Set to avoid duplicates
    const classNames = new Set();

    // 5) Walk each CSS rule in the file
    root.walkRules(rule => {
        // A single "rule" might contain multiple comma-separated selectors
        // e.g., .sm\\:bg-red-500:hover, .focus\\:bg-red-500
        rule.selectors.forEach(selector => {
            collectClassesFromSelector(selector, classNames);
        });
    });

    // 6) Convert the set to an array if needed
    return [...classNames];
}

// Change the path below to match where your CSS file is located
const cssFilePath = path.join(__dirname, 'wwwroot', 'dist', 'rizzyui.css');

// 7) Run and log the results
const allClasses = getAllTailwindClassesFromFile(cssFilePath);
console.dir(allClasses, { maxArrayLength: null });