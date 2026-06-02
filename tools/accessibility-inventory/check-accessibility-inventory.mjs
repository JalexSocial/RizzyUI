#!/usr/bin/env node
import path from 'node:path';
import { promises as fs } from 'node:fs';

const DEFAULT_CONTRACT_DIRECTORIES = [
  'DataTable/RzDataTable',
  'Feedback/RzAlert',
  'Feedback/RzDialog',
  'Feedback/RzPopover',
  'Feedback/RzSheet',
  'Feedback/RzSpinner',
  'Feedback/RzTooltip',
  'Form/RzCombobox',
  'Form/RzFileInput',
  'Form/RzNativeSelect',
  'Layout/RzAccordion',
  'Navigation/RzCommand',
  'Navigation/RzDropdown',
  'Navigation/RzMenubar',
  'Navigation/RzNavigationMenu',
  'Navigation/RzSidebar',
  'Navigation/RzTabs',
  'Utility/RzBackToTop'
];

const DEFAULT_EXCLUDED_COMPONENTS = [
  'RzNativeSelectOptGroup',
  'RzNativeSelectOption'
];

function splitList(value) {
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

function parseArgs(argv) {
  const options = {
    componentsDir: 'Components',
    docsDir: '../RizzyUI.Docs/Components/Pages/Components',
    testsDirs: ['../RizzyUI.Tests/Components', '../RizzyUI.Docs/tests/accessibility'],
    interactivePrefixes: ['Rz'],
    ignoreDirs: ['_Internal', 'obj', 'bin', 'node_modules'],
    exts: ['.razor'],
    contractDirectories: DEFAULT_CONTRACT_DIRECTORIES,
    excludedComponents: DEFAULT_EXCLUDED_COMPONENTS
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;

    const [key, inlineValue] = arg.slice(2).split('=');
    const value = inlineValue ?? argv[i + 1];
    if (inlineValue === undefined) i += 1;

    switch (key) {
      case 'components-dir':
        options.componentsDir = value;
        break;
      case 'docs-dir':
        options.docsDir = value;
        break;
      case 'tests-dir':
        options.testsDirs = splitList(value);
        break;
      case 'tests-dirs':
        options.testsDirs = splitList(value);
        break;
      case 'interactive-prefixes':
        options.interactivePrefixes = splitList(value);
        break;
      case 'ignore-dirs':
        options.ignoreDirs = splitList(value);
        break;
      case 'contract-directories':
        options.contractDirectories = splitList(value);
        break;
      case 'exclude-components':
        options.excludedComponents = splitList(value);
        break;
      default:
        break;
    }
  }

  return options;
}

async function directoryExists(dir) {
  try {
    const stats = await fs.stat(dir);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function walk(dir, predicate, ignoreDirs) {
  if (!(await directoryExists(dir))) return [];

  const results = [];
  async function recurse(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (ignoreDirs.includes(entry.name)) continue;
        await recurse(fullPath);
        continue;
      }

      if (predicate(entry.name, fullPath)) {
        results.push(fullPath);
      }
    }
  }

  await recurse(dir);
  return results;
}

function normalizePath(value) {
  return value.split(path.sep).join('/');
}

function isRootLevelComponent(filePath, interactivePrefixes) {
  const baseName = path.basename(filePath, '.razor');
  if (!interactivePrefixes.some(prefix => baseName.startsWith(prefix))) return false;
  if (baseName.endsWith('.razor')) return false;
  return true;
}

function isInContractDirectory(filePath, componentsDir, contractDirectories) {
  const relativePath = normalizePath(path.relative(componentsDir, path.dirname(filePath)));
  return contractDirectories.some(dir => {
    const normalized = normalizePath(dir);
    return relativePath === normalized || relativePath.startsWith(`${normalized}/`);
  });
}

function toDocStem(componentName) {
  return componentName.replace(/^Rz/, '').replace(/Provider$/, '');
}

function parentDocStem(filePath, componentsDir) {
  const relativeDir = normalizePath(path.relative(componentsDir, path.dirname(filePath)));
  const segments = relativeDir.split('/').filter(Boolean);
  const parentFolder = segments.at(-1) ?? '';
  if (!parentFolder.startsWith('Rz')) return undefined;
  return toDocStem(parentFolder);
}

function docCandidates(componentName, filePath, componentsDir) {
  return [...new Set([
    `${toDocStem(componentName)}Info.razor`,
    `${componentName}Info.razor`,
    parentDocStem(filePath, componentsDir) ? `${parentDocStem(filePath, componentsDir)}Info.razor` : undefined
  ].filter(Boolean))];
}

function hasMatchingDoc(docsFiles, candidates) {
  const docsByName = new Set(docsFiles.map(file => path.basename(file)));
  return candidates.some(candidate => docsByName.has(candidate));
}

function testCandidates(componentName, filePath, componentsDir) {
  const stem = toDocStem(componentName);
  const parentStem = parentDocStem(filePath, componentsDir);
  return [...new Set([
    `${componentName}Tests.cs`,
    `${componentName}A11yTests.cs`,
    `${stem}A11yTests.cs`,
    `${stem.toLowerCase()}.a11y.spec.ts`,
    `${stem.toLowerCase()}.a11y.spec.js`,
    parentStem ? `${parentStem}Tests.cs` : undefined,
    parentStem ? `${parentStem}A11yTests.cs` : undefined,
    parentStem ? `${parentStem.toLowerCase()}.a11y.spec.ts` : undefined,
    parentStem ? `${parentStem.toLowerCase()}.a11y.spec.js` : undefined
  ].filter(Boolean))];
}

function hasMatchingTest(testFiles, componentName, candidates) {
  const stem = toDocStem(componentName).toLowerCase();
  const testsByName = new Set(testFiles.map(file => path.basename(file)));
  if (candidates.some(candidate => testsByName.has(candidate))) return true;

  return testFiles.some(file => {
    const fileName = path.basename(file).toLowerCase();
    return fileName.includes(`${stem}.a11y.`) || fileName.includes(`${stem}a11y`);
  });
}

function expectedPaths(baseDir, names) {
  return names.map(name => normalizePath(path.join(baseDir, name)));
}

export async function runInventoryCheck(options) {
  const normalizedOptions = {
    ...options,
    testsDirs: options.testsDirs ?? (options.testsDir ? [options.testsDir] : []),
    contractDirectories: options.contractDirectories ?? DEFAULT_CONTRACT_DIRECTORIES,
    excludedComponents: options.excludedComponents ?? DEFAULT_EXCLUDED_COMPONENTS
  };

  const components = await walk(
    normalizedOptions.componentsDir,
    name => normalizedOptions.exts.includes(path.extname(name)),
    normalizedOptions.ignoreDirs
  );

  const docsFiles = await walk(normalizedOptions.docsDir, name => name.endsWith('.razor'), normalizedOptions.ignoreDirs);
  const testFileGroups = await Promise.all(
    normalizedOptions.testsDirs.map(dir => walk(dir, name => /Tests\.cs$|\.a11y\.spec\.(ts|js)$/i.test(name), normalizedOptions.ignoreDirs))
  );
  const testFiles = testFileGroups.flat();

  const excluded = new Set(normalizedOptions.excludedComponents);
  const rootInteractiveComponents = components
    .filter(file => isRootLevelComponent(file, normalizedOptions.interactivePrefixes))
    .filter(file => isInContractDirectory(file, normalizedOptions.componentsDir, normalizedOptions.contractDirectories))
    .filter(file => !excluded.has(path.basename(file, '.razor')))
    .map(file => ({ component: path.basename(file, '.razor'), path: normalizePath(file), file }))
    .filter((value, index, self) => self.findIndex(x => x.component === value.component) === index)
    .sort((a, b) => a.component.localeCompare(b.component));

  return rootInteractiveComponents.map(({ component, path: componentPath, file }) => {
    const expectedDocNames = docCandidates(component, file, normalizedOptions.componentsDir);
    const expectedTestNames = testCandidates(component, file, normalizedOptions.componentsDir);
    const hasDoc = hasMatchingDoc(docsFiles, expectedDocNames);
    const hasTest = hasMatchingTest(testFiles, component, expectedTestNames);
    return {
      component,
      componentPath,
      hasDoc,
      hasTest,
      expectedDocs: expectedPaths(normalizedOptions.docsDir, expectedDocNames),
      expectedTests: normalizedOptions.testsDirs.flatMap(dir => expectedPaths(dir, expectedTestNames))
    };
  });
}

function printSummary(report) {
  console.log('Accessibility Inventory');
  console.log('-----------------------');

  for (const row of report) {
    const docStatus = row.hasDoc ? 'docs: ✅' : 'docs: ❌ missing';
    const testStatus = row.hasTest ? 'tests: ✅' : 'tests: ❌ missing';
    console.log(`- ${row.component} (${row.componentPath}): ${docStatus}, ${testStatus}`);
  }

  const missing = report.filter(x => !x.hasDoc || !x.hasTest);
  if (missing.length > 0) {
    console.error('\nMissing accessibility contract artifacts:');
    for (const row of missing) {
      console.error(`❌ ${row.component} (${row.componentPath})`);
      if (!row.hasDoc) {
        console.error('   Missing documentation. Expected one of:');
        for (const expectedDoc of row.expectedDocs) console.error(`   - ${expectedDoc}`);
      }
      if (!row.hasTest) {
        console.error('   Missing tests. Expected one of:');
        for (const expectedTest of row.expectedTests) console.error(`   - ${expectedTest}`);
      }
    }
    console.error('\nAdd the missing docs/tests or update the explicit inventory exclusions when a component is intentionally out of scope.');
  } else {
    console.log('\n✅ All detected accessibility-contract components have docs and tests.');
  }

  return missing.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));
  runInventoryCheck(options)
    .then(report => {
      const missingCount = printSummary(report);
      process.exit(missingCount > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Accessibility inventory check encountered an error:', error.message);
      process.exit(1);
    });
}
