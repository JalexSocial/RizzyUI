
    // The exported function is a factory for your Alpine.js data object.
    // It receives the data passed from the `x-rz-init` directive.
    export default (args) => ({
        message: '',
        confirmModal: null,

        // Alpine's `init()` is called after the component is ready.
        init() {
            // Example 1 Logic
            if (args && args.initialMessage) {
                this.message = args.initialMessage;
                if (this.$refs.messageOutput) {
                    this.$refs.messageOutput.innerText = this.message;
                }
            }

            // Example 3 Logic
            if (this.$refs.confirmModal) {
                this.confirmModal = Rizzy.$data(this.$refs.confirmModal);
            }
        },

        // Example 1 Method
        updateMessage() {
            this.message = 'The message was updated by our co-located Alpine module!';
            if (this.$refs.messageOutput) {
                this.$refs.messageOutput.innerText = this.message;
            }
        },

        // Example 3 Method
        openConfirmationModal() {
            if (this.confirmModal) {
                this.confirmModal.openModal();
            }
        }
    });