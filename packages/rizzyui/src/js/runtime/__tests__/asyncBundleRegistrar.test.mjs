import test from 'node:test';
import assert from 'node:assert/strict';

// createComponentFactoryLoader takes its own registry, so these tests never import real bundles.
const { createComponentFactoryLoader } = await import('../asyncBundleRegistrar.js');

function silenceErrors(fn) {
    const previous = console.error;
    const errors = [];
    console.error = (...args) => errors.push(args);
    return Promise.resolve()
        .then(fn)
        .finally(() => { console.error = previous; })
        .then(() => errors);
}

test('imports a bundle once and shares it between its components', async () => {
    let imports = 0;
    const load = createComponentFactoryLoader(
        { menus: async () => { imports += 1; return { rzMenu: () => 'menu', rzMenubar: () => 'bar' }; } },
        { rzMenu: 'menus', rzMenubar: 'menus' },
    );

    assert.equal((await load('rzMenu'))(), 'menu');
    assert.equal((await load('rzMenubar'))(), 'bar');
    assert.equal(imports, 1);
});

test('a failed bundle import is retried on the next use (RZUI-031)', async () => {
    let attempts = 0;
    const load = createComponentFactoryLoader(
        {
            menus: async () => {
                attempts += 1;
                if (attempts === 1) {
                    throw new Error('network error');
                }
                return { rzMenu: () => 'menu' };
            },
        },
        { rzMenu: 'menus' },
    );

    const errors = await silenceErrors(async () => {
        await assert.rejects(load('rzMenu'), /network error/);
    });
    assert.equal(errors.length, 1);
    assert.match(String(errors[0][0]), /bundle 'menus' for component 'rzMenu'/);

    assert.equal((await load('rzMenu'))(), 'menu');
    assert.equal(attempts, 2);
});

test('concurrent uses during a failed import share one attempt', async () => {
    let attempts = 0;
    const load = createComponentFactoryLoader(
        { menus: async () => { attempts += 1; throw new Error('offline'); } },
        { rzMenu: 'menus', rzMenubar: 'menus' },
    );

    await silenceErrors(async () => {
        const results = await Promise.allSettled([load('rzMenu'), load('rzMenubar')]);
        assert.deepEqual(results.map(result => result.status), ['rejected', 'rejected']);
    });
    assert.equal(attempts, 1);
});

test('unknown components and missing exports fail with names', async () => {
    const load = createComponentFactoryLoader({ menus: async () => ({}) }, { rzMenu: 'menus', rzOrphan: 'missing' });

    await assert.rejects(load('rzNothing'), /No owning bundle .*'rzNothing'/);
    await assert.rejects(load('rzMenu'), /'rzMenu' is not exported by bundle 'menus'/);
    await assert.rejects(load('rzOrphan'), /Bundle loader 'missing' is missing/);
});
