/**
 * Helper function to retrieve the Alpine.js x-data state object associated with
 * a specific component. It accepts either the component's wrapper ID (string)
 * or a direct reference to the wrapper element itself (Element).
 *
 * This function bridges the gap between a known component wrapper (identified
 * by ID or element reference) and the potentially nested element that actually
 * holds the Alpine `x-data` directive and is marked with a `data-alpine-root`
 * attribute matching the wrapper's ID.
 *
 * @prerequisites
 *   - Alpine.js (v3+) must be loaded and initialized globally as `Alpine`.
 *   - If `idOrElement` is a string, the DOM must contain an element with that ID.
 *   - The identified wrapper element (whether found by ID or passed directly)
 *     MUST have an `id` attribute.
 *   - EITHER the wrapper element OR one of its descendants MUST have the
 *     attribute `data-alpine-root` set to the wrapper element's `id`. This
 *     element with `data-alpine-root` is assumed to be the intended Alpine
 *     component root containing the `x-data`. Failure to meet this structure
 *     will result in `undefined` being returned and a warning logged.
 *
 * @param {string | Element} idOrElement - The unique ID attribute (string) of
 *   the component's outermost wrapper element, OR a direct reference (Element)
 *   to that wrapper element.
 * @returns {object | undefined} The Alpine x-data state object if the designated
 *   Alpine root element is found and successfully initialized by Alpine.
 *   Returns `undefined` if the input is invalid, prerequisites are not met,
 *   the designated Alpine root element cannot be located, or if Alpine.$data
 *   itself returns undefined for the located element. This mirrors the return
 *   behavior of the native `Alpine.$data`.
 */
function $data(idOrElement) {
    // --- Prerequisite Checks ---

    // Guard clause: Verify Alpine.js and its $data utility are available.
    if (typeof Alpine === 'undefined' || typeof Alpine.$data !== 'function') {
        console.error(
            '$data helper: Alpine.js context (Alpine.$data) is not available. ' +
            'Ensure Alpine is loaded and initialized globally before use.'
        );
        return undefined;
    }

    // --- Determine Outer Element and Component ID ---

    let outerElement = null;
    let componentId = null; // Store the string ID for selector construction

    if (typeof idOrElement === 'string') {
        // Input is a string ID
        if (!idOrElement) { // Check for empty string
            console.warn('Rizzy.$data: Invalid componentId provided (empty string).');
            return undefined;
        }
        componentId = idOrElement;
        outerElement = document.getElementById(componentId);

        // Check if element was found using the ID
        if (!outerElement) {
            console.warn(`Rizzy.$data: Rizzy component with ID "${componentId}" not found in the DOM.`);
            return undefined;
        }
    } else if (idOrElement instanceof Element) {
        // Input is an Element object
        outerElement = idOrElement;
        // Crucial: The wrapper element itself MUST have an ID for the
        // data-alpine-root lookup logic to work correctly.
        if (!outerElement.id) {
            console.warn('Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.');
            return undefined;
        }
        componentId = outerElement.id;
    } else {
        // Input is neither a valid string nor an Element
        console.warn('Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.');
        return undefined;
    }

    // --- DOM Element Location (using determined outerElement and componentId) ---

    // Prepare the CSS selector using the determined component ID.
    const alpineRootSelector = `[data-alpine-root="${componentId}"]`;
    let alpineRootElement = null;

    // Strategy: Check wrapper first, then descendants.
    if (outerElement.matches(alpineRootSelector)) {
        alpineRootElement = outerElement;
    } else {
        alpineRootElement = outerElement.querySelector(alpineRootSelector);
    }

    // Verify the designated Alpine root was located.
    if (!alpineRootElement) {
        console.warn(
            `Rizzy.$data: Could not locate the designated Alpine root element ` +
            `using selector "${alpineRootSelector}" on or inside the wrapper element ` +
            `(ID: #${componentId}). Verify the 'data-alpine-root' attribute placement.`
        );
        return undefined;
    }

    // --- Alpine Data Retrieval ---

    // Delegate to native Alpine.$data.
    const alpineData = Alpine.$data(alpineRootElement);

    // Check Alpine.$data's result.
    if (alpineData === undefined) {
        const targetDesc = `${alpineRootElement.tagName.toLowerCase()}` +
            `${alpineRootElement.id ? '#'+alpineRootElement.id : ''}` +
            `${alpineRootElement.classList.length ? '.'+Array.from(alpineRootElement.classList).join('.') : ''}`;
        console.warn(
            `Rizzy.$data: Located designated Alpine root (${targetDesc}) ` +
            `via 'data-alpine-root="${componentId}"', but Alpine.$data returned undefined. ` +
            `Ensure 'x-data' is correctly defined and initialized on this element.`
        );
        // Return undefined, consistent with Alpine.$data.
    }

    // Return the data or undefined.
    return alpineData;
}

// Default ES Module export
export default $data;