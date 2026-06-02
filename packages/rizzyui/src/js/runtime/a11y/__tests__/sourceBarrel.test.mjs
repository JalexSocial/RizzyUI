import test from 'node:test';
import assert from 'node:assert/strict';
import * as a11y from '../../../a11y/index.js';

const expectedExports = [
  'createFocusScope',
  'createDismissableLayer',
  'createRovingFocusGroup',
  'createTypeahead',
  'createActiveDescendantTypeahead',
  'createTypeaheadNavigator',
  'createActiveDescendant',
  'createAriaAnnouncer',
  'getFocusableElements',
  'isFocusable',
  'isTabbable',
  'focusFirst',
  'focusLast',
  'announce',
  'ensureLiveRegions',
  'clearLiveRegions',
  'getAnnouncementHistory',
  'clearAnnouncementHistory',
  'destroyLiveAnnouncer',
];

test('a11y source barrel re-exports runtime primitives', () => {
  for (const name of expectedExports) {
    assert.equal(typeof a11y[name], 'function', `${name} should be exported as a function`);
  }
});
