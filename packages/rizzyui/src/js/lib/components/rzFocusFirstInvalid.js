/**
 * Focuses the first invalid control of the enclosing form when it initializes (Summit SF-045).
 * Controls that hide their native element (Tom Select, visually hidden checkboxes and switches) get
 * the first visible focusable element of the same field instead.
 */
export default function rzFocusFirstInvalid() {
    return {
        init() {
            const form = this.$el.closest('form');
            if (!form) return;
            // After the other components in the form have started (comboboxes build their own control).
            this.$nextTick(() => {
                const invalid = form.querySelector('[aria-invalid="true"]');
                if (!(invalid instanceof HTMLElement)) return;
                const target = isVisible(invalid) ? invalid : visibleControlOf(invalid);
                (target ?? invalid).focus();
            });
        },
    };
}

function isVisible(element) {
    return typeof element.checkVisibility === 'function'
        ? element.checkVisibility()
        : element.getClientRects().length > 0;
}

function visibleControlOf(element) {
    const field = element.closest('[data-slot="field"]') ?? element.parentElement;
    const candidates = field?.querySelectorAll('input:not([type=hidden]), select, textarea, button, [tabindex="0"]') ?? [];
    return [...candidates].find((candidate) => candidate instanceof HTMLElement && isVisible(candidate)) ?? null;
}
