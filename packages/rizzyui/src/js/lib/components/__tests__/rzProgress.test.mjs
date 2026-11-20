import assert from 'node:assert/strict';
import test from 'node:test';
import rzProgress from '../rzProgress.js';

// rzProgress holds state only; the markup binds aria-valuenow, aria-valuetext, data-state and the
// indicator's translate to it.

function start(dataset, valueText = null) {
  const component = rzProgress();
  component.$el = { dataset, getAttribute: name => (name === 'aria-valuetext' ? valueText : null) };
  component.init();
  return component;
}

test('reads value, range and value text from the server-rendered attributes', () => {
  const progress = start({ value: '30', min: '10', max: '60' }, '30 of 60 files');
  assert.equal(progress.value, 30);
  assert.equal(progress.percentage, 40);
  assert.equal(progress.valueNow, 30);
  assert.equal(progress.valueText, '30 of 60 files');
  assert.equal(progress.state, 'loading');
  assert.deepEqual(progress.indicatorStyle(), { translate: '-60% 0' });
});

test('decimal values and clamping', () => {
  const progress = start({ value: '0.25', min: '0', max: '1' });
  assert.equal(progress.percentage, 25);
  assert.equal(progress.percentLabel, '25%');
  progress.setProgress(5);
  assert.equal(progress.percentage, 100);
  assert.equal(progress.valueNow, 1);
  assert.equal(progress.state, 'complete');
  progress.setProgress(-3);
  assert.equal(progress.percentage, 0);
  assert.equal(progress.valueNow, 0);
});

test('no value is indeterminate: no aria-valuenow, no inline translate', () => {
  const progress = start({ min: '0', max: '100' });
  assert.equal(progress.indeterminate, true);
  assert.equal(progress.valueNow, null);
  assert.equal(progress.state, 'indeterminate');
  assert.deepEqual(progress.indicatorStyle(), { translate: '' });
});

test('setProgress replaces the value text, or clears it so the percentage is read', () => {
  const progress = start({ value: '1', min: '0', max: '10' }, '1 of 10 files');
  progress.setProgress(2, '2 of 10 files');
  assert.equal(progress.valueText, '2 of 10 files');
  progress.setProgress(3);
  assert.equal(progress.valueText, null);
});

test('increment and decrement stay in range; increment starts an indeterminate bar at the minimum', () => {
  const progress = start({ min: '0', max: '10' });
  progress.increment(4);
  assert.equal(progress.value, 4);
  progress.increment(20);
  assert.equal(progress.value, 10);
  progress.decrement(25);
  assert.equal(progress.value, 0);
  progress.setIndeterminate();
  assert.equal(progress.value, null);
});

test('an empty range shows an empty bar instead of dividing by zero', () => {
  const progress = start({ value: '5', min: '5', max: '5' });
  assert.equal(progress.percentage, 0);
});
