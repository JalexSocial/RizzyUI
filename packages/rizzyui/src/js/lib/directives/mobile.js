// mobile.js
//
// Alpine directive for responsive detection.
//
// ## Overview
// This directive (`x-mobile`) makes it easy to detect whether the viewport
// is below a specified breakpoint and reflect that state in three ways:
//
// 1. **Data attributes** (shadcn/ui style):
//    - `data-mobile="true|false"`
//    - `data-screen="mobile|desktop"`
//    These attributes are always applied to the element where `x-mobile` is declared.
//    You can target them directly in your Tailwind/CSS selectors.
//
// 2. **Reactive Alpine property** (optional):
//    - If you provide an expression (e.g. `x-mobile="isMobile"`), the directive
//      will keep that property in sync with the current viewport state (`true` if
//      window width < breakpoint).
//    - If the property doesn’t already exist in your component’s `x-data`,
//      it will be created for you.
//
// 3. **Custom event**:
//    - Whenever the screen state changes, a `screen:change` event is dispatched
//      on the element. The event detail looks like:
//        ```js
//        { isMobile: true|false, width: 1234, breakpoint: 768 }
//        ```
//    - You can listen with `@screen:change.window="..."` or `@screen:change="..."`.
//
// ## Syntax
// ```html
// <!-- Default breakpoint 768px -->
// <div x-data x-mobile></div>
//
// <!-- Custom breakpoint (e.g., 1024px) -->
// <div x-data x-mobile.bp-1024></div>
//
// <!-- Also mirror into a reactive property -->
// <div x-data="{ isMobile: false }" x-mobile="isMobile">
//   <p x-text="isMobile ? 'Mobile' : 'Desktop'"></p>
// </div>
//
// <!-- Listen for events -->
// <div x-data x-mobile @screen:change.window="console.log($event.detail)"></div>
// ```
//
// ## Styling Example
// ```css
// [data-screen="mobile"] .nav { @apply p-2; }
// [data-screen="desktop"] .nav { @apply p-6; }
//
// [data-mobile="true"] .sidebar { @apply hidden; }
// [data-mobile="false"] .sidebar { @apply block; }
// ```
//
// ## Notes
// - Breakpoint defaults to `768px` unless overridden with a `.bp-###` modifier.
// - The directive updates reactively on both `resize` and `matchMedia` change
//   events (to cover all browser/device scenarios).
// - Cleanup is automatic when the Alpine component is destroyed.
// - Designed for Alpine v3+. Compatible with Vite bundling: just import and
//   register in your `main.js`:
//
// ```js
// import Alpine from 'alpinejs'
// import registerMobileDirective from './mobile.js'
//
// registerMobileDirective(Alpine)
// window.Alpine = Alpine
// Alpine.start()
// ```
//

export default function registerMobileDirective(Alpine) {
    Alpine.directive('mobile', (el, { modifiers, expression }, { cleanup }) => {
        const bpMod = modifiers.find((m) => m.startsWith('bp-'));
        const BREAKPOINT = bpMod ? parseInt(bpMod.slice(3), 10) : 768;
        const ASSIGN_PROP = !!(expression && expression.length > 0);

        // SSR / non-browser guard
        if (typeof window === 'undefined' || !window.matchMedia) {
            el.dataset.mobile = 'false';
            el.dataset.screen = 'desktop';
            return;
        }

        const isMobileNow = () => window.innerWidth < BREAKPOINT;

        const reflect = (val) => {
            el.dataset.mobile = val ? 'true' : 'false';
            el.dataset.screen = val ? 'mobile' : 'desktop';
        };

        const getComponentData = () => {
            if (typeof Alpine.$data === 'function') return Alpine.$data(el);
            return el.__x ? el.__x.$data : null;
        };

        const setProp = (val) => {
            if (!ASSIGN_PROP) return;
            const data = getComponentData();
            if (data) data[expression] = val;
        };

        const dispatch = (val) => {
            el.dispatchEvent(
                new CustomEvent('screen:change', {
                    bubbles: true,
                    detail: { isMobile: val, width: window.innerWidth, breakpoint: BREAKPOINT },
                }),
            );
        };

        const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
        const update = () => {
            const val = isMobileNow();
            reflect(val);
            setProp(val);
            dispatch(val);
        };

        // Initial sync
        update();

        // Listeners
        const onChange = () => update();
        const onResize = () => update();

        mql.addEventListener('change', onChange);
        window.addEventListener('resize', onResize, { passive: true });

        // Cleanup on component destroy
        cleanup(() => {
            mql.removeEventListener('change', onChange);
            window.removeEventListener('resize', onResize);
        });
    });
}
