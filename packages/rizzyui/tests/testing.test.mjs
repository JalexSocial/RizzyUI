import test from 'node:test';
import assert from 'node:assert/strict';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// A DOM for Alpine, as a consumer's test setup would provide it.
GlobalRegistrator.register({ url: 'http://localhost/' });

const { mountCodeBehind } = await import('../testing/index.js');

// A module written the way code-behind modules are: props in init, methods for the markup.
const counter = () => ({
    count: 0,
    step: 1,
    init() {
        this.count = this.$props.initialCount;
        this.step = this.$props.step ?? 1;
    },
    increment() {
        this.count += this.step;
    },
});

test('mounts a module with props and renders its markup', async () => {
    const { data, root, nextTick, destroy } = await mountCodeBehind(counter, {
        props: { initialCount: 10, step: 5 },
        html: '<span x-text="count"></span><em x-text="$props.initialCount"></em>',
    });

    assert.equal(data.count, 10);
    assert.equal(root.querySelector('span').textContent, '10');
    assert.equal(root.querySelector('em').textContent, '10');

    data.increment();
    await nextTick();
    assert.equal(root.querySelector('span').textContent, '15');

    destroy();
    assert.equal(root.isConnected, false);
});

test('each mount gets its own data', async () => {
    const first = await mountCodeBehind(counter, { props: { initialCount: 1 } });
    const second = await mountCodeBehind(counter, { props: { initialCount: 100 } });
    first.data.increment();
    assert.equal(first.data.count, 2);
    assert.equal(second.data.count, 100);
});

test('rejects something that is not a module factory', async () => {
    await assert.rejects(() => mountCodeBehind({ count: 0 }), /default export/);
});

test('ready() runs after init() and after children that load immediately have started', async () => {
    const calls = [];
    const panel = () => ({
        dialogStarted: false,
        async init() {
            calls.push('init');
            await Promise.resolve();
            calls.push('init done');
        },
        ready() {
            calls.push('ready');
            this.dialogStarted = this.$refs.dialog._x_async === 'loaded';
        },
    });

    // A child that loads its code on demand, the way RizzyUI components do (async-alpine sets
    // _x_async to 'loaded' once it has started), and a lazy child that ready() must not wait for.
    const mounting = mountCodeBehind(panel, {
        html: '<div x-ref="dialog" x-load="eager"></div><div x-load="visible"></div>',
    });
    const dialog = await new Promise(resolve => setTimeout(() => resolve(document.querySelector('[x-ref="dialog"]')), 30));
    assert.deepEqual(calls, ['init', 'init done']);
    dialog._x_async = 'loaded';

    const { data } = await mounting;
    assert.deepEqual(calls, ['init', 'init done', 'ready']);
    assert.equal(data.dialogStarted, true);
});

test('modules without ready() are unchanged', async () => {
    const plain = () => ({ count: 1, init() { this.count = 2; } });
    const { data } = await mountCodeBehind(plain);
    assert.equal(data.count, 2);
});

test('ready() also waits for a teleported child reached through <rz-proxy>', async () => {
    // A dialog's root is teleported to <body>; inside the component, x-ref points to a proxy.
    const dialogRoot = document.createElement('div');
    dialogRoot.setAttribute('data-alpine-root', 'teleported-dialog');
    dialogRoot.setAttribute('x-data', 'teleportedDialog');
    dialogRoot.setAttribute('x-load', 'eager');
    dialogRoot.setAttribute('x-ignore', '');
    document.body.appendChild(dialogRoot);

    let readyAt = null;
    const mounting = mountCodeBehind(() => ({
        ready() { readyAt = Date.now(); },
    }), { html: '<rz-proxy x-ref="dialog" data-for="teleported-dialog"></rz-proxy>' });

    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(readyAt, null);
    const loadedAt = Date.now();
    dialogRoot._x_async = 'loaded';

    await mounting;
    assert.ok(readyAt >= loadedAt);
    dialogRoot.remove();
});

test('Rizzy.$data returns undefined for a component that has not started, not its parent\'s data', async () => {
    const { default: $data } = await import('../src/js/lib/alpineData.js');
    const { root } = await mountCodeBehind(() => ({ parentValue: 1 }), {
        html: '<div id="pending-child" data-alpine-root="pending-child" x-data="notLoadedYet" x-ignore></div>',
    });
    const warn = console.warn;
    console.warn = () => {};
    try {
        assert.equal($data(root.querySelector('#pending-child')), undefined);
        assert.equal($data('pending-child'), undefined);
    } finally {
        console.warn = warn;
    }
    assert.equal($data(root).parentValue, 1);
});
