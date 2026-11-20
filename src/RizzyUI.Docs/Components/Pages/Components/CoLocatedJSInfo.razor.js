
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
     * `init` runs when the component starts: read the props and set the initial state.
     * @this {import('alpinejs').AlpineComponent}
     */
    init() {
        const props = Rizzy.props(this.$el);
        this.message = props.initialMessage || 'Hello from the co-located module!';
        if (this.$refs.messageOutput) {
            this.$refs.messageOutput.innerText = this.message;
        }
    },

    /**
     * `ready` runs once the components inside this one (here, the RzDialog) have started, so
     * their data can be read.
     */
    ready() {
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