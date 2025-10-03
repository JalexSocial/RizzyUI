export default () => ({
    modalInstance: null,

    async init() {
        
        // Allow a tick for modal to transport to body (needed by RzModal)
        await Alpine.nextTick();

        // Get the Alpine instance of the RzModal component
        this.modalInstance = Rizzy.$data(this.$refs.myModal);
    },

    openModal() {
        if (this.modalInstance) {
            this.modalInstance.openModal();
        }
    }
});