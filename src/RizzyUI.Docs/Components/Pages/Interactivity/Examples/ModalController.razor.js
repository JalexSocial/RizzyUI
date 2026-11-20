export default () => ({
    modalInstance: null,

    // ready() runs once the dialog inside this component has started, so its data is there.
    ready() {
        this.modalInstance = Rizzy.$data(this.$refs.myModal);
    },

    openModal() {
        this.modalInstance.openModal();
    }
});
