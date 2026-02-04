
export default () => ({
    user: {},

    init() {
        this.user = Rizzy.props(this.$el);
        console.log('UserCard initialized for:', this.user.name);
    },

    showAlert() {
        alert(`You clicked on ${this.user.name}'s card!`);
    }
});