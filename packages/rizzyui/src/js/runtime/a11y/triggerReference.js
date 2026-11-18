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

/**
 * Removes ARIA ID references whose targets do not exist, so assistive technology never follows a
 * dangling reference. Components render aria-labelledby/aria-describedby for an optional title or
 * description before knowing whether the caller rendered one (RZUI-048).
 *
 * @param {HTMLElement | null | undefined} element
 * @param {string[]} [attributes]
 */
export function removeMissingReferences(element, attributes = ['aria-labelledby', 'aria-describedby']) {
    if (typeof element?.getAttribute !== 'function') return;

    for (const attribute of attributes) {
        const ids = (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean);
        if (ids.length === 0) continue;

        const present = ids.filter(id => document.getElementById(id));
        if (present.length === 0) element.removeAttribute(attribute);
        else if (present.length !== ids.length) element.setAttribute(attribute, present.join(' '));
    }
}
