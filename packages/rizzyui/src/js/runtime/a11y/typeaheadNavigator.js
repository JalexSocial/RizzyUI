import { createTypeahead } from './typeahead.js';

/**
 * Backwards-compatible alias for typeahead navigation helper.
 *
 * @deprecated Use createTypeahead from ./typeahead.js.
 * @param {Parameters<typeof createTypeahead>[0]} [options]
 * @returns {ReturnType<typeof createTypeahead>}
 */
export function createTypeaheadNavigator(options = {}) {
  return createTypeahead(options);
}
