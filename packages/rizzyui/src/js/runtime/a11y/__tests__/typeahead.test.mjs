import test from 'node:test';
import assert from 'node:assert/strict';
import { createTypeahead, createActiveDescendantTypeahead } from '../typeahead.js';

function createFakeTimers() {
  let now = 0;
  let nextId = 1;
  const timers = new Map();

  return {
    setTimer(fn, delay) {
      const id = nextId++;
      timers.set(id, { runAt: now + delay, fn });
      return id;
    },
    clearTimer(id) {
      timers.delete(id);
    },
    tick(ms) {
      now += ms;
      const due = [...timers.entries()].filter(([, timer]) => timer.runAt <= now);
      due.forEach(([id, timer]) => {
        timers.delete(id);
        timer.fn();
      });
    },
  };
}

const items = [
  { label: 'Apple' },
  { label: 'Apricot' },
  { label: 'Banana' },
  { label: 'Blueberry' },
];

test('typing characters returns the first matching index', () => {
  const timers = createFakeTimers();
  const typeahead = createTypeahead({ setTimer: timers.setTimer, clearTimer: timers.clearTimer, getText: (item) => item.label });

  assert.equal(typeahead.search('b', items), 2);
  assert.equal(typeahead.getBuffer(), 'b');
});

test('rapid typing builds a prefix and matches longer labels', () => {
  const timers = createFakeTimers();
  const typeahead = createTypeahead({ setTimer: timers.setTimer, clearTimer: timers.clearTimer, getText: (item) => item.label });

  assert.equal(typeahead.search('b', items), 2);
  assert.equal(typeahead.search('l', items), 3);
  assert.equal(typeahead.getBuffer(), 'bl');
});

test('repeated characters cycle across matching items', () => {
  const timers = createFakeTimers();
  let activeIndex = -1;
  const typeahead = createTypeahead({
    setTimer: timers.setTimer,
    clearTimer: timers.clearTimer,
    getText: (item) => item.label,
    getActiveIndex: () => activeIndex,
    onMatch: (index) => { activeIndex = index; },
  });

  assert.equal(typeahead.search('a', items), 0);
  assert.equal(typeahead.search('a', items), 1);
  assert.equal(typeahead.search('a', items), 0);
});

test('buffer resets when timeout expires', () => {
  const timers = createFakeTimers();
  const typeahead = createTypeahead({ setTimer: timers.setTimer, clearTimer: timers.clearTimer, getText: (item) => item.label, timeoutMs: 500 });

  assert.equal(typeahead.search('b', items), 2);
  timers.tick(600);

  assert.equal(typeahead.getBuffer(), '');
  assert.equal(typeahead.search('a', items), 0);
});

test('active descendant integration updates setActiveIndex', () => {
  const timers = createFakeTimers();
  let activeIndex = -1;
  const controller = {
    getActiveIndex: () => activeIndex,
    setActiveIndex: (index) => { activeIndex = index; },
  };

  const typeahead = createActiveDescendantTypeahead(controller, {
    setTimer: timers.setTimer,
    clearTimer: timers.clearTimer,
    getText: (item) => item.label,
  });

  assert.equal(typeahead.search('b', items), 2);
  assert.equal(activeIndex, 2);
});
