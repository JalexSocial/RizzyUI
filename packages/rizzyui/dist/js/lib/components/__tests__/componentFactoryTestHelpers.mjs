import assert from 'node:assert/strict';
import { registerAsyncBundleComponents } from '../../../runtime/asyncBundleRegistrar.js';

export async function resolveRegisteredComponentFactoryForTest(componentName) {
  const registrations = new Map();
  const Alpine = {
    asyncData(name, loader) {
      registrations.set(name, loader);
    },
  };

  registerAsyncBundleComponents(Alpine);

  const loader = registrations.get(componentName);
  assert.equal(typeof loader, 'function', `${componentName} should be registered via Alpine.asyncData`);

  const factory = await loader();
  assert.equal(typeof factory, 'function', `${componentName} should resolve to a component factory`);

  return factory;
}
