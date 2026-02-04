
/**
 * @file RizzyUI Alpine Props Helper
 * @module alpineProps
 * @description Provides a utility function to safely read and parse props passed from a Blazor
 * RzAlpineComponent to its co-located Alpine.js module.
 */

/**
 * Retrieves and parses the JSON props for an Alpine component initialized by RzAlpineComponent.
 * It reads the `data-props-id` attribute from the Alpine root element to find the
 * corresponding `<script type="application/json">` tag and parses its content.
 *
 * @param {Element} alpineRootElement - The root DOM element of the Alpine component (typically `this.$el`).
 * @returns {object} The parsed JavaScript object from the props JSON. Returns an empty object `{}`
 * if the element is invalid, props are not defined, the script tag is not found, or parsing fails.
 */
function props(alpineRootElement) {
    if (!(alpineRootElement instanceof Element)) {
        console.warn('[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el).');
        return {};
    }

    const propsScriptId = alpineRootElement.dataset.propsId;
    if (!propsScriptId) {
        // This is a valid scenario where no props are passed.
        return {};
    }

    const propsScriptEl = document.getElementById(propsScriptId);
    if (!propsScriptEl) {
        console.warn(`[Rizzy.props] Could not find the props script tag with ID '${propsScriptId}'.`);
        return {};
    }

    try {
        // Use textContent for reliability and provide a fallback for empty content.
        return JSON.parse(propsScriptEl.textContent || '{}');
    } catch (e) {
        console.error(`[Rizzy.props] Failed to parse JSON from script tag #${propsScriptId}.`, e);
        return {}; // Return an empty object to prevent downstream errors.
    }
}

export default props;