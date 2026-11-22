// sync-prop.js
//
// Alpine directive: x-syncprop="parent.path -> child.path[, parent.other -> child.other]"
//
// Two-way synchronization between a DIRECT parent component property and any
// property in the current (child) component. Designed to cover the common need
// of binding nested components without wiring a bunch of x-model / $parent glue.
//
// ──────────────────────────────────────────────────────────────────────────────
// WHY
// ──────────────────────────────────────────────────────────────────────────────
// Alpine provides `x-model` and `x-modelable` for single-value bindings, but
// synchronizing multiple arbitrary keys (and nested paths) between parent and
// child in a declarative, maintainable way is non-trivial.
// `x-syncprop` solves this by letting you declare one or more parent↔child mappings.
//
// ──────────────────────────────────────────────────────────────────────────────
// USAGE
// ──────────────────────────────────────────────────────────────────────────────
//
// Single mapping:
// <div x-data="{ parent: { age: 30 } }">
//   <div x-data="{ fields: { ageCopy: 0 } }"
//        x-syncprop="parent.age -> fields.ageCopy">
//     <input type="number" x-model="fields.ageCopy">
//   </div>
// </div>
//
// Multiple mappings (comma-separated):
// <div x-data="{ form: { name: 'Alice', age: 30 } }">
//   <div x-data="{ fields: { nameCopy: '', ageCopy: 0 } }"
//        x-syncprop="form.name -> fields.nameCopy, form.age -> fields.ageCopy">
//     <input x-model="fields.nameCopy">
//     <input type="number" x-model="fields.ageCopy">
//   </div>
// </div>
//
// Initial sync strategy (default: parent wins):
// - Parent wins (default):   x-syncprop="..."            or x-syncprop.init-parent="..."
// - Child wins (override):   x-syncprop.init-child="..."
// Example:
// <div x-data="{ form: { age: 30 } }">
//   <div x-data="{ fields: { ageCopy: 99 } }"
//        x-syncprop.init-child="form.age -> fields.ageCopy"></div>
// <!-- After mount: form.age becomes 99 -->
//
// Notes:
// - Left side of "->" is evaluated against the DIRECT parent's x-data.
// - Right side is evaluated against the CURRENT element's x-data.
// - Sync is two-way: changing either side updates the other.
// - Nested paths supported (dot + bracket notation), e.g. a.b[0].c.
// - Designed for Alpine v3+. Works with Vite (ESM).
//
// ──────────────────────────────────────────────────────────────────────────────
// LIMITATIONS
// ──────────────────────────────────────────────────────────────────────────────
// - Binds to the DIRECT parent only (the closest ancestor x-data). If you need
//   higher ancestors, we can extend with an `.ancestor-N` modifier.
// - Effects run inside the child’s lifecycle; they’re stopped on teardown.
// - No deep-equality check by default; writes occur on reactive ticks even if
//   values are referentially equal. A `.deep-equal` modifier can be added if needed.
//
// ──────────────────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────────────
// ON RIZZYUI COMPONENTS (decision D-24, docs: "Parent property synchronization")
// ──────────────────────────────────────────────────────────────────────────────
// - On a component whose state lives on an inner element (RzChart, RzSlider, ...), the directive
//   moves to that element: <RzSlider x-syncprop="filters.price -> values" /> binds the slider's state.
// - "Parent" is the nearest ancestor state that is not a RizzyUI component, so a component inside a
//   dialog, sheet or popover syncs with the application's state, not the overlay's.
// - data-syncprop-parent="#selector" on the same element names the parent explicitly, and the
//   .direct modifier keeps the closest ancestor state even when it is a RizzyUI component's.

/** A RizzyUI component's own state element (data-alpine-root, or an rzXxx x-data name). */
function isRizzyComponentElement(element) {
    if (!element?.hasAttribute) return false;
    if (element.hasAttribute('data-alpine-root')) return true;
    return /^rz[A-Z]/.test(element.getAttribute('x-data') || '');
}

/**
 * The element whose state a component root's x-syncprop refers to: the element itself when it has
 * its own x-data, otherwise the component's state element inside it.
 */
function resolveStateElement(el) {
    if (el.hasAttribute('x-data')) return el;
    if (el.id) {
        const byId = el.querySelector(`[data-alpine-root="${CSS.escape(el.id)}"]`);
        if (byId) return byId;
    }
    return el.querySelector('[data-alpine-root]') || el;
}

/** The data objects of every RizzyUI component state on the page (to skip them as "parent"). */
function rizzyComponentData() {
    const set = new Set();
    document.querySelectorAll('[x-data]').forEach((element) => {
        if (isRizzyComponentElement(element) && element._x_dataStack?.[0]) set.add(element._x_dataStack[0]);
    });
    return set;
}

export default function registerSyncDirective(Alpine) {
    const handler = (el, directive, utilities) => {
        const { expression, modifiers } = directive;
        if (!expression || typeof expression !== 'string') return;

        // On a component root without its own x-data: move to the component's state element.
        const target = resolveStateElement(el);
        if (target !== el) {
            const name = directive.original || ('x-syncprop' + (modifiers.length ? '.' + modifiers.join('.') : ''));
            const parentSelector = el.getAttribute('data-syncprop-parent');
            if (!target._x_dataStack) {
                // Not initialized yet (x-load): Alpine runs the directive there when it does.
                Alpine.mutateDom(() => {
                    target.setAttribute(name, expression);
                    if (parentSelector && !target.hasAttribute('data-syncprop-parent')) target.setAttribute('data-syncprop-parent', parentSelector);
                });
                return;
            }
            sync(target, expression, modifiers, utilities, parentSelector);
            return;
        }

        sync(el, expression, modifiers, utilities, el.getAttribute('data-syncprop-parent'));
    };

    const sync = (el, expression, modifiers, { cleanup, effect }, parentSelector) => {

        // Minimal path setter (supports dot + bracket notation, e.g. a.b[0].c)
        const setAtPath = (obj, path, value) => {
            const norm = path.replace(/\[(\d+)\]/g, '.$1');
            const keys = norm.split('.');
            const last = keys.pop();
            let cur = obj;
            for (const k of keys) {
                if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = isFinite(+k) ? [] : {};
                cur = cur[k];
            }
            cur[last] = value;
        };

        // Resolve the child (this element's state) and the parent: an explicit data-syncprop-parent,
        // otherwise the nearest ancestor state that is not a RizzyUI component's.
        const stack = Alpine.closestDataStack(el) || [];
        const childData = stack[0] || null;
        let parentData = null;
        if (parentSelector) {
            const parentEl = document.querySelector(parentSelector);
            parentData = parentEl ? (Alpine.closestDataStack(parentEl) || [])[0] || null : null;
        } else if (modifiers.includes('direct')) {
            // .direct: the closest ancestor state, also a RizzyUI component's (the library's own wiring).
            parentData = stack[1] || null;
        } else {
            const rizzy = rizzyComponentData();
            // Skip RizzyUI components' state and scopes without state of their own (teleport and
            // proxy scopes in overlays).
            parentData = stack.slice(1).find((data) => !rizzy.has(data) && Object.keys(data).length > 0) || null;
        }

        if (!childData || !parentData) {
            if (import.meta?.env?.DEV) {
                console.warn('[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.');
            }
            return;
        }

        // Parse "a.b -> c.d, x -> y.z"
        const pairs = expression
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => {
                const m = s.split('->').map(x => x.trim());
                if (m.length !== 2) {
                    console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', s);
                    return null;
                }
                return { parentPath: m[0], childPath: m[1] };
            })
            .filter(Boolean);

        // Initial sync strategy: parent wins by default; allow .init-child override
        const initChildWins = modifiers.includes('init-child')
            || modifiers.includes('child')
            || modifiers.includes('childWins');

        // Per-pair guards to prevent feedback loops + one-shot skip on init-child
        const guard = pairs.map(() => ({
            fromParent: false,
            fromChild: false,
            skipChildOnce: initChildWins, // avoid redundant first child->parent write
        }));

        const stops = [];

        pairs.forEach((pair, idx) => {
            const g = guard[idx];

            // Initial sync
            if (initChildWins) {
                const childVal = Alpine.evaluate(el, pair.childPath, { scope: childData });
                g.fromChild = true;
                setAtPath(parentData, pair.parentPath, childVal);
                queueMicrotask(() => { g.fromChild = false; });
            } else {
                const parentVal = Alpine.evaluate(el, pair.parentPath, { scope: parentData });
                g.fromParent = true;
                setAtPath(childData, pair.childPath, parentVal);
                queueMicrotask(() => { g.fromParent = false; });
            }

            // Parent -> Child (single read per tick)
            const stop1 = effect(() => {
                const parentVal = Alpine.evaluate(el, pair.parentPath, { scope: parentData });
                if (g.fromChild) return;
                g.fromParent = true;
                setAtPath(childData, pair.childPath, parentVal);
                queueMicrotask(() => { g.fromParent = false; });
            });

            // Child -> Parent (single read per tick)
            const stop2 = effect(() => {
                const childVal = Alpine.evaluate(el, pair.childPath, { scope: childData });
                if (g.fromParent) return;

                // One-shot suppression to prevent a redundant write on init-child
                if (g.skipChildOnce) { g.skipChildOnce = false; return; }

                g.fromChild = true;
                setAtPath(parentData, pair.parentPath, childVal);
                queueMicrotask(() => { g.fromChild = false; });
            });

            stops.push(stop1, stop2);
        });

        // Explicit teardown for clarity/future-proofing
        cleanup(() => {
            for (const stop of stops) {
                try { stop && stop(); } catch {}
            }
        });
    };

    // Register the primary name…
    Alpine.directive('syncprop', handler);
}
