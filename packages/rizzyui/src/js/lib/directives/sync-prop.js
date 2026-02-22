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
// - Child wins (override):   x-syncprop.init-child="..." or x-syncprop.child="..."
// Example:
// <div x-data="{ form: { age: 30 } }">
//   <div x-data="{ fields: { ageCopy: 99 } }"
//        x-syncprop.init-child="form.age -> fields.ageCopy"></div>
// </div>
// <!-- After mount: form.age becomes 99 -->
//
// Notes:
// - Left side of "->" is resolved against the DIRECT parent's x-data.
// - Right side is resolved against the CURRENT element's x-data.
// - Sync is two-way: changing either side updates the other.
// - Nested paths supported (dot + bracket notation), e.g. a.b[0].c or a["key"].
// - Designed for Alpine v3+. Works with Vite (ESM).
//
// ──────────────────────────────────────────────────────────────────────────────
// LIMITATIONS
// ──────────────────────────────────────────────────────────────────────────────
// - Binds to the DIRECT parent only (closest ancestor x-data). If you need
//   higher ancestors, extend this with an `.ancestor-N` modifier.
// - Mapping expressions must be PROPERTY PATHS (not arbitrary expressions).
//   ✅ form.age -> fields.ageCopy
//   ❌ form.age + 1 -> fields.ageCopy
// - No deep-equality checks are performed; object writes are reference-based.
//   (Primitive / same-reference writes are skipped via Object.is.)
// - Comma parsing is simple; avoid commas inside path syntax.
//
// ──────────────────────────────────────────────────────────────────────────────
// INSTALL (Vite / ESM)
// ──────────────────────────────────────────────────────────────────────────────
// import Alpine from 'alpinejs'
// import registerSyncDirective from './sync-prop'
//
// registerSyncDirective(Alpine)
// window.Alpine = Alpine
// Alpine.start()
//
// Or:
//
// document.addEventListener('alpine:init', () => {
//   registerSyncDirective(window.Alpine)
// })
//
// ──────────────────────────────────────────────────────────────────────────────

export default function registerSyncDirective(Alpine) {
    const isDev =
        typeof import.meta !== 'undefined' &&
        import.meta &&
        import.meta.env &&
        import.meta.env.DEV;

    const warn = (...args) => {
        // Keep warnings visible in development, quieter in production.
        if (isDev) console.warn('[x-syncprop]', ...args);
    };

    const defer = (fn) => {
        if (typeof queueMicrotask === 'function') queueMicrotask(fn);
        else Promise.resolve().then(fn);
    };

    // ────────────────────────────────────────────────────────────────────────────
    // PATH UTILITIES
    // ────────────────────────────────────────────────────────────────────────────
    // We intentionally treat mappings as "paths", not Alpine expressions.
    // Supported:
    //   a.b.c
    //   a[0].b
    //   a["some-key"]
    //   a['some-key']
    //
    // Returns an array of keys, e.g. "a.b[0].c" -> ["a","b","0","c"]
    const toPathTokens = (path) => {
        if (typeof path !== 'string') return [];

        const out = [];
        const re = /([^[.\]]+)|\[(?:(-?\d+)|"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)')\]/g;
        let match;

        while ((match = re.exec(path)) !== null) {
            const dotKey = match[1];
            const numeric = match[2];
            const dbl = match[3];
            const sgl = match[4];

            if (dotKey != null) out.push(dotKey);
            else if (numeric != null) out.push(numeric);
            else if (dbl != null) out.push(dbl.replace(/\\"/g, '"'));
            else if (sgl != null) out.push(sgl.replace(/\\'/g, "'"));
        }

        // Basic validation: ensure the regex consumed the whole string.
        // If not, path likely includes unsupported syntax.
        const reconstructed = path.replace(/\s+/g, '');
        const joined = out.length ? out.join('.') : '';
        // This isn't a strict parser validation, but catches obvious failures:
        if (!out.length && reconstructed.length) return null;

        return out;
    };

    const getAtPath = (obj, tokens) => {
        let cur = obj;
        for (const key of tokens) {
            if (cur == null) return undefined;
            cur = cur[key];
        }
        return cur;
    };

    const isNumericKey = (k) => typeof k === 'string' && /^-?\d+$/.test(k);

    // Sets a nested path, creating missing containers as needed.
    // Important: container type is chosen based on the NEXT token
    // (this fixes the common array-creation bug).
    const setAtPath = (obj, tokens, value) => {
        if (!obj || !tokens || !tokens.length) return;
        if (tokens.length === 1) {
            obj[tokens[0]] = value;
            return;
        }

        let cur = obj;
        for (let i = 0; i < tokens.length - 1; i++) {
            const key = tokens[i];
            const nextKey = tokens[i + 1];

            if (cur[key] == null || typeof cur[key] !== 'object') {
                cur[key] = isNumericKey(nextKey) ? [] : {};
            }

            cur = cur[key];
        }

        cur[tokens[tokens.length - 1]] = value;
    };

    // ────────────────────────────────────────────────────────────────────────────
    // MAPPING PARSER
    // ────────────────────────────────────────────────────────────────────────────
    // "form.name -> fields.nameCopy, form.age -> fields.ageCopy"
    // => [{ parentPath, childPath, parentTokens, childTokens }, ...]
    const parseMappings = (expression) => {
        return expression
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((segment) => {
                const parts = segment.split('->').map((x) => x.trim());

                if (parts.length !== 2) {
                    warn(
                        `Invalid mapping "${segment}". Expected "parent.path -> child.path".`
                    );
                    return null;
                }

                const [parentPath, childPath] = parts;
                const parentTokens = toPathTokens(parentPath);
                const childTokens = toPathTokens(childPath);

                if (!parentTokens || !parentTokens.length) {
                    warn(`Invalid parent path "${parentPath}" in mapping "${segment}".`);
                    return null;
                }

                if (!childTokens || !childTokens.length) {
                    warn(`Invalid child path "${childPath}" in mapping "${segment}".`);
                    return null;
                }

                return {
                    raw: segment,
                    parentPath,
                    childPath,
                    parentTokens,
                    childTokens,
                };
            })
            .filter(Boolean);
    };

    // ────────────────────────────────────────────────────────────────────────────
    // DIRECTIVE HANDLER
    // ────────────────────────────────────────────────────────────────────────────
    const handler = (el, { expression, modifiers }, { effect, cleanup }) => {
        if (!expression || typeof expression !== 'string') return;

        // Resolve direct child/parent x-data from Alpine's stack.
        // stack[0] => current element's x-data (child)
        // stack[1] => direct parent x-data
        const stack = Alpine.closestDataStack(el) || [];
        const childData = stack[0] || null;
        const parentData = stack[1] || null;

        if (!childData || !parentData) {
            warn(
                'Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.'
            );
            return;
        }

        const mappings = parseMappings(expression);
        if (!mappings.length) return;

        // Initial sync strategy:
        // - default parent -> child
        // - child -> parent when `.init-child` / `.child` / `.childwins`
        const initChildWins =
            modifiers.includes('init-child') ||
            modifiers.includes('child') ||
            modifiers.includes('childwins');

        // Per-mapping guards prevent infinite write loops.
        const guards = mappings.map(() => ({
            fromParent: false,
            fromChild: false,
            skipChildOnce: initChildWins, // suppress the first redundant child effect after init-child
        }));

        // Helper: write only if target value is not already identical by reference/value
        const writeIfChanged = (targetRoot, targetTokens, nextValue) => {
            const currentValue = getAtPath(targetRoot, targetTokens);
            if (Object.is(currentValue, nextValue)) return;
            setAtPath(targetRoot, targetTokens, nextValue);
        };

        // Set up sync for each mapping pair.
        mappings.forEach((map, i) => {
            const g = guards[i];

            // 1) INITIAL SYNC
            if (initChildWins) {
                const childValue = getAtPath(childData, map.childTokens);
                g.fromChild = true;
                writeIfChanged(parentData, map.parentTokens, childValue);
                defer(() => {
                    g.fromChild = false;
                });
            } else {
                const parentValue = getAtPath(parentData, map.parentTokens);
                g.fromParent = true;
                writeIfChanged(childData, map.childTokens, parentValue);
                defer(() => {
                    g.fromParent = false;
                });
            }

            // 2) PARENT -> CHILD REACTIVE EFFECT
            //
            // Reading parent path here establishes Alpine reactivity tracking.
            // When parent changes, this effect reruns and mirrors the new value into the child.
            effect(() => {
                const parentValue = getAtPath(parentData, map.parentTokens);

                // Ignore updates that were caused by the child write path.
                if (g.fromChild) return;

                g.fromParent = true;
                writeIfChanged(childData, map.childTokens, parentValue);
                defer(() => {
                    g.fromParent = false;
                });
            });

            // 3) CHILD -> PARENT REACTIVE EFFECT
            //
            // Reading child path here establishes Alpine reactivity tracking.
            // When child changes, this effect reruns and mirrors the new value into the parent.
            effect(() => {
                const childValue = getAtPath(childData, map.childTokens);

                // Ignore updates that were caused by the parent write path.
                if (g.fromParent) return;

                // After init-child, the first child effect run is usually redundant
                // (because we just wrote child -> parent during initialization).
                if (g.skipChildOnce) {
                    g.skipChildOnce = false;
                    return;
                }

                g.fromChild = true;
                writeIfChanged(parentData, map.parentTokens, childValue);
                defer(() => {
                    g.fromChild = false;
                });
            });
        });

        // Alpine's `effect` helper already auto-cleans on teardown.
        // We still provide a cleanup hook to make intent explicit and future-proof.
        cleanup(() => {
            // No explicit stop functions needed because directive-scoped `effect(...)`
            // is automatically torn down by Alpine when the element is removed.
        });
    };

    Alpine.directive('syncprop', handler);
}