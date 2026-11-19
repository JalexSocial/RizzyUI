export default () => ({
    itemToDelete: {},
    modal: null,

    // ready() runs once the confirmation dialog inside this component has started.
    ready() {
        this.modal = Rizzy.$data(this.$refs.confirmModal);
    },

    confirmDelete(item) {
        this.itemToDelete = item;
        this.modal.openModal();
    }
});
