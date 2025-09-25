
/**
 * @file CoLocatedJSInfo.razor.js
 * @module CoLocatedJSInfo
 * @description This is a co-located JavaScript module for the CoLocatedJSInfo.razor component.
 * It is loaded dynamically via the RzAlpineComponent and AsyncAlpine.
 *
 * The module exports a factory function that creates an Alpine.js data object.
 */
export default (initialData) => ({
    // --- State ---

    /**
     * The message to be displayed in the component.
     * @type {string}
     */
    message: '',

    // --- Lifecycle Hooks ---

    /**
     * The `init` method is called by Alpine.js when the component is initialized on the page.
     * It is responsible for reading the initial data from the `data-props-id` attribute,
     * which points to a script tag containing the JSON data.
     * @this {import('alpinejs').AlpineComponent}
     */
    init() {
        let payload = initialData;

        // Update the DOM with the initial message. `this.$refs` provides access to elements
        // marked with `x-ref` within this component's scope.
        this.message = payload.initialMessage || 'Hello from the co-located module!';
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
});