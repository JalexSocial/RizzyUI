
/**
 * @file CoLocatedJSInfo.razor.js
 * @module CoLocatedJSInfo
 * @description This is a co-located JavaScript module for the CoLocatedJSInfo.razor component.
 * It is loaded dynamically via the RzAlpineComponent and AsyncAlpine.
 *
 * The module exports a factory function that creates an Alpine.js data object.
 */
export default () => ({
    // --- State ---

    /**
     * The message to be displayed in the component.
     * @type {string}
     */
    message: '',
    confirmModal: null,

    // --- Lifecycle Hooks ---

    /**
     * The `init` method is called by Alpine.js when the component is initialized on the page.
     * It is responsible for reading the initial data using the Rizzy.props() helper.
     * @this {import('alpinejs').AlpineComponent}
     */
    async init() {
        // Allow a tick for modal to transport to body (needed by RzDialog)
        await Alpine.nextTick();
        
        const props = Rizzy.props(this.$el);

        // Update the DOM with the initial message. `this.$refs` provides access to elements
        // marked with `x-ref` within this component's scope.
        this.message = props.initialMessage || 'Hello from the co-located module!';
        if (this.$refs.messageOutput) {
            this.$refs.messageOutput.innerText = this.message;
        }

        // Get the Alpine instance for the RzDialog component if it exists
        if (this.$refs.confirmModal) {
            this.confirmModal = Rizzy.$data(this.$refs.confirmModal);
        }
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
    },

    openConfirmationModal() {
        if (this.confirmModal) {
            this.confirmModal.openModal();
        }
    }
});