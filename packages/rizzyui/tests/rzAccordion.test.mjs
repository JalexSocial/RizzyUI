import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function loadDefaultFactory(path, exportedName) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const executableSource = `${source.replace(`export default function ${exportedName}()`, `function ${exportedName}()`)}\nreturn ${exportedName};`;
  return new Function(executableSource)();
}

test('rzAccordion initializes allowMultiple from data-multiple', async () => {
  const rzAccordion = await loadDefaultFactory('../src/js/lib/components/rzAccordion.js', 'rzAccordion');
  const single = rzAccordion();
  single.$el = { dataset: { multiple: 'false' } };
  single.init();
  assert.equal(single.allowMultiple, false);

  const multiple = rzAccordion();
  multiple.$el = { dataset: { multiple: 'true' } };
  multiple.init();
  assert.equal(multiple.allowMultiple, true);
});

test('accordionItem preserves parent selected and single-item close behavior', async () => {
  const accordionItem = await loadDefaultFactory('../src/js/lib/components/accordionItem.js', 'accordionItem');
  let watchedProperty = '';
  let watcher;
  const item = accordionItem();
  item.$el = {
    dataset: {
      isOpen: 'true',
      sectionId: 'section-a',
      expandedClass: 'rotate-180'
    }
  };
  item.selected = '';
  item.allowMultiple = false;
  item.$watch = (property, callback) => {
    watchedProperty = property;
    watcher = callback;
  };

  item.init();
  assert.equal(item.open, true);
  assert.equal(item.sectionId, 'section-a');
  assert.equal(watchedProperty, 'selected');

  watcher('section-b');
  assert.equal(item.open, false);

  item.toggle();
  assert.equal(item.selected, 'section-a');
  assert.equal(item.open, true);
  assert.equal(item.getAriaExpanded(), 'true');
  assert.equal(item.getExpandedCss(), 'rotate-180');
});

test('accordionItem does not close when allowMultiple is enabled', async () => {
  const accordionItem = await loadDefaultFactory('../src/js/lib/components/accordionItem.js', 'accordionItem');
  let watcher;
  const item = accordionItem();
  item.$el = {
    dataset: {
      isOpen: 'true',
      sectionId: 'section-a',
      expandedClass: 'rotate-180'
    }
  };
  item.selected = '';
  item.allowMultiple = true;
  item.$watch = (_, callback) => {
    watcher = callback;
  };

  item.init();
  watcher('section-b');
  assert.equal(item.open, true);
});


test('accordionItem leaves Enter and Space to native button activation', async () => {
  const accordionItem = await loadDefaultFactory('../src/js/lib/components/accordionItem.js', 'accordionItem');
  const item = accordionItem();
  let prevented = 0;
  item.$el = {
    closest: () => {
      throw new Error('Enter and Space should not run arrow navigation lookup');
    }
  };

  item.handleKeydown({ key: 'Enter', preventDefault: () => prevented += 1 });
  item.handleKeydown({ key: ' ', preventDefault: () => prevented += 1 });

  assert.equal(prevented, 0);
});

test('accordionItem ArrowDown, ArrowUp, Home, and End move focus without toggling', async () => {
  const accordionItem = await loadDefaultFactory('../src/js/lib/components/accordionItem.js', 'accordionItem');
  const focused = [];
  const triggers = ['a', 'b', 'c'].map((id) => ({
    id,
    disabled: false,
    getAttribute: () => null,
    focus: () => focused.push(id)
  }));
  const accordion = {
    querySelectorAll: (selector) => selector === '[data-slot="accordion-trigger"]' ? triggers : []
  };
  const item = accordionItem();
  item.$el = {
    closest: (selector) => selector === '[data-slot="accordion"]' ? accordion : null
  };
  let prevented = 0;
  const eventFor = (key, currentTarget = triggers[1]) => ({
    key,
    currentTarget,
    preventDefault: () => prevented += 1
  });

  item.handleKeydown(eventFor('ArrowDown'));
  item.handleKeydown(eventFor('ArrowUp'));
  item.handleKeydown(eventFor('Home'));
  item.handleKeydown(eventFor('End'));
  item.handleKeydown(eventFor('Enter'));

  assert.deepEqual(focused, ['c', 'a', 'a', 'c']);
  assert.equal(prevented, 4);
});

test('accordion runtime names remain in the core-common bundle manifest', async () => {
  const bundleSource = await readFile(new URL('../src/js/bundles/core-common.js', import.meta.url), 'utf8');
  const manifestSource = await readFile(new URL('../src/js/runtime/componentBundleManifest.js', import.meta.url), 'utf8');

  assert.match(bundleSource, /export \{ default as accordionItem \} from '\.\.\/lib\/components\/accordionItem\.js';/);
  assert.match(bundleSource, /export \{ default as rzAccordion \} from '\.\.\/lib\/components\/rzAccordion\.js';/);
  assert.match(manifestSource, /accordionItem:\s*'core-common'/);
  assert.match(manifestSource, /rzAccordion:\s*'core-common'/);
});
