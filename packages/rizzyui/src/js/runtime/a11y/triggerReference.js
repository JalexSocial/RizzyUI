/**
 * Points an ARIA relationship on `element` (for example a popover's `aria-labelledby`) at the
 * trigger's actual id.
 *
 * The server renders the relationship with the generated trigger id (`<component-id>-trigger`).
 * With `AsChild`, a trigger child that has its own `id` keeps it, so that reference pointed at an
 * element that does not exist (RZUI-048). When the trigger has no id, it gets the referenced one.
 *
 * @param {HTMLElement | null | undefined} triggerEl
 * @param {HTMLElement | null | undefined} element
 * @param {string} [attribute='aria-labelledby']
 */
export function linkToTrigger(triggerEl, element, attribute = 'aria-labelledby') {
    if (!triggerEl || typeof element?.getAttribute !== 'function') return;

    const referenced = element.getAttribute(attribute);
    if (!referenced) return; // Named another way (for example aria-label); nothing to link.

    if (!triggerEl.id) {
        triggerEl.id = referenced;
        return;
    }

    if (triggerEl.id !== referenced) {
        element.setAttribute(attribute, triggerEl.id);
    }
}
