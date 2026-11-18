import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { runInventoryCheck } from '../check-accessibility-inventory.mjs';

// Test files get an accessibility assertion by default: the checker only counts a matching test
// file that asserts ARIA, roles, focus or keyboard behavior.
async function mk(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const isTest = /Tests\.cs$|\.a11y\.spec\.(ts|js)$/.test(filePath);
  await fs.writeFile(filePath, content ?? (isTest ? 'Assert.Equal("dialog", el.GetAttribute("role"));' : ''));
}

function options(root, overrides = {}) {
  return {
    componentsDir: path.join(root, 'src/RizzyUI/Components'),
    docsDir: path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components'),
    testsDirs: [
      path.join(root, 'src/RizzyUI.Tests/Components'),
      path.join(root, 'src/RizzyUI.Docs/tests/accessibility')
    ],
    interactivePrefixes: ['Rz'],
    ignoreDirs: ['_Internal', 'obj', 'bin', 'node_modules'],
    exts: ['.razor'],
    contractDirectories: ['Form/RzGood', 'Form/RzMissingDoc', 'Form/RzMissingTest', 'Navigation/RzDropdown', 'Feedback/RzToast'],
    excludedComponents: [],
    ...overrides
  };
}

test('detects missing accessibility docs and tests for existing contract component files', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rz-a11y-'));

  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzGood/RzGood.razor'));
  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzMissingDoc/RzMissingDoc.razor'));
  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzMissingTest/RzMissingTest.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/GoodInfo.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/MissingTestInfo.razor'));
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Form/RzGoodTests.cs'));
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Form/RzMissingDocA11yTests.cs'));

  const report = await runInventoryCheck(options(root));
  const byComponent = Object.fromEntries(report.map(x => [x.component, x]));

  assert.equal(byComponent.RzGood.hasDoc, true);
  assert.equal(byComponent.RzGood.hasTest, true);
  assert.equal(byComponent.RzMissingDoc.hasDoc, false);
  assert.equal(byComponent.RzMissingDoc.hasTest, true);
  assert.equal(byComponent.RzMissingTest.hasDoc, true);
  assert.equal(byComponent.RzMissingTest.hasTest, false);
  assert.ok(byComponent.RzMissingDoc.expectedDocs.some(x => x.endsWith('MissingDocInfo.razor')));
  assert.ok(byComponent.RzMissingTest.expectedTests.some(x => x.endsWith('RzMissingTestTests.cs')));
});

test('does not require nonexistent dropped or newly invented component names', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rz-a11y-'));

  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzGood/RzGood.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/GoodInfo.razor'));
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Form/RzGoodTests.cs'));

  const report = await runInventoryCheck(options(root, {
    contractDirectories: ['Form/RzGood', 'Feedback/RzToast', 'Feedback/RzToggletip', 'Data/RzDataGrid', 'OverlaySearch/RzOverlaySearch']
  }));
  const components = report.map(x => x.component);

  assert.deepEqual(components, ['RzGood']);
  assert.equal(components.includes('RzToast'), false);
  assert.equal(components.includes('RzToggletip'), false);
  assert.equal(components.includes('RzDataGrid'), false);
  assert.equal(components.includes('RzOverlaySearch'), false);
});

test('supports explicit exclusions for existing child components that are intentionally out of scope', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rz-a11y-'));

  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzNativeSelect/RzNativeSelect.razor'));
  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzNativeSelect/RzNativeSelectOption.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/NativeSelectInfo.razor'));
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Form/RzNativeSelect/RzNativeSelectTests.cs'));

  const report = await runInventoryCheck(options(root, {
    contractDirectories: ['Form/RzNativeSelect'],
    excludedComponents: ['RzNativeSelectOption']
  }));

  assert.deepEqual(report.map(x => x.component), ['RzNativeSelect']);
});

test('matches family docs and tests for components with shared documentation pages', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rz-a11y-'));

  await mk(path.join(root, 'src/RizzyUI/Components/Navigation/RzDropdown/RzDropdownMenu.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/DropdownInfo.razor'));
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Navigation/RzDropdownMenuTests.cs'));

  const report = await runInventoryCheck(options(root, {
    contractDirectories: ['Navigation/RzDropdown']
  }));

  assert.equal(report.length, 1);
  assert.equal(report[0].component, 'RzDropdownMenu');
  assert.equal(report[0].hasDoc, true);
  assert.equal(report[0].hasTest, true);
});

test('a matching test file that asserts nothing about accessibility does not count (RZUI-043)', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rz-a11y-'));

  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzGood/RzGood.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/GoodInfo.razor'));
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Form/RzGoodTests.cs'), 'Assert.NotNull(cut.Find("div"));');

  const [row] = await runInventoryCheck(options(root, { contractDirectories: ['Form/RzGood'] }));

  assert.equal(row.hasTest, false);
});

test('a sub-component rendered on its family docs page counts as documented', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rz-a11y-'));

  await mk(path.join(root, 'src/RizzyUI/Components/Form/RzCheckboxGroup/RzInputCheckbox.razor'));
  await mk(path.join(root, 'src/RizzyUI.Docs/Components/Pages/Components/CheckboxInfo.razor'), '<RzInputCheckbox For="@(() => model.Accept)" />');
  await mk(path.join(root, 'src/RizzyUI.Tests/Components/Form/RzInputCheckboxTests.cs'));

  const [row] = await runInventoryCheck(options(root, { contractDirectories: ['Form/RzCheckboxGroup'] }));

  assert.equal(row.hasDoc, true);
  assert.equal(row.hasTest, true);
});
