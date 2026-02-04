export default () => ({
    itemToDelete: {},
    modal: null,

    init() {
        // It's safer to get the reference inside a $nextTick to ensure the modal has been initialized by Alpine
        this.$nextTick(() => {
            this.modal = Rizzy.$data(this.$refs.confirmModal);
        });
    },

    confirmDelete(item) {
        this.itemToDelete = item;

        // Defensive check: re-acquire the reference in case of HTMX swaps
        const modal = Rizzy.$data(this.$refs.confirmModal);
        if (modal?.openModal) {
            modal.openModal();
        } else {
            // Fallback or error handling if the modal isn't ready yet
            console.warn("Modal instance not available yet. Retrying in a moment.");
            this.$nextTick(() => {
                const modalRetry = Rizzy.$data(this.$refs.confirmModal);
                modalRetry?.openModal();
            });
        }
    }
});