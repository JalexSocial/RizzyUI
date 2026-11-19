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
