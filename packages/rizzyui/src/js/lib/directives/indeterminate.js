// indeterminate.js
//
// `x-indeterminate="expression"` keeps a checkbox's `indeterminate` property in sync with an
// expression, for example a "select all" box when some but not all rows are selected:
//
//   <input type="checkbox"
//          x-bind:checked="selection.allPageRowsSelected()"
//          x-indeterminate="selection.somePageRowsSelected() && !selection.allPageRowsSelected()">
//
// `indeterminate` is a DOM property with no attribute, so `x-bind` cannot set it, and the usual
// workaround, `x-effect="$el.indeterminate = ..."`, is a property assignment that the Alpine CSP
// build (rizzyui-csp.js) rejects. This directive only reads the expression, so it works with both
// runtimes. Browsers expose an indeterminate checkbox to assistive technology as "mixed".

/**
 * Registers the `x-indeterminate` directive.
 * @param {object} Alpine The Alpine instance.
 */
export default function registerIndeterminateDirective(Alpine) {
    Alpine.directive('indeterminate', (el, { expression }, { evaluateLater, effect }) => {
        if (!expression) {
            return;
        }

        const evaluate = evaluateLater(expression);

        effect(() => {
            evaluate(value => {
                el.indeterminate = !!value;
            });
        });
    });
}
