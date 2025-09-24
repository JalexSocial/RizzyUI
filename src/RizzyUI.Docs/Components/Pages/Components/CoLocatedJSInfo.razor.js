
/**
 * @file CoLocatedJSInfo.razor.js
 * @module CoLocatedJSInfo
 * @description This is a co-located JavaScript module for the CoLocatedJSInfo.razor component.
 * It is loaded dynamically via the RzAlpineModule and AsyncAlpine.
 *
 * The module exports a standard Alpine.js data object directly.
 */
export default {
    // --- State ---

    /**
     * The message to be displayed in the component.
     * @type {string}
     */
    message: '',

    // --- Lifecycle Hooks ---

    /**
     * The `init` method is called by Alpine.js when the component is initialized on the page.
     * It is responsible for reading the initial data from the `x-rz-init` attribute,
     * which is rendered by the Blazor component.
     * @this {import('alpinejs').AlpineComponent}
     */
    init() {
        // `this` refers to the Alpine component instance.
        // `this.$el` is the root DOM element of the component (the one with `x-data`).
        let payload = {};
        const initAttr = this.$el.getAttribute('x-rz-init');

        if (initAttr) {
            try {
                // Parse the JSON data passed from the server.
                payload = JSON.parse(initAttr);
            } catch (e) {
                console.warn('[RizzyUI] CoLocatedJSInfo: Failed to parse x-rz-init data. Using defaults.', { error: e, element: this.$el });
            }
        }

        // Set the initial state from the payload or provide a default.
        this.message = payload.initialMessage || 'Hello from the co-located module!';

        // Update the DOM with the initial message. `this.$refs` provides access to elements
        // marked with `x-ref` within this component's scope.
        this.$refs.messageOutput.innerText = this.message;
    },

    // --- Methods ---

    /**
     * Updates the message property and the corresponding DOM element.
     * This method is called by the `x-on:click` directive in the Razor component.
     * @this {import('alpinejs').AlpineComponent}
     */
    updateMessage() {
        this.message = 'The message was updated by our co-located Alpine module!';
        this.$refs.messageOutput.innerText = this.message;
    }
};