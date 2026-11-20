
export default () => ({
    user: {},

    init() {
        this.user = Rizzy.props(this.$el);
        console.log('UserCard initialized for:', this.user.Name);
    },

    showAlert() {
        alert(`You clicked on ${this.user.Name}'s card!`);
    }
});