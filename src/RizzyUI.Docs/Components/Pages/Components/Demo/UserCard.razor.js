
export default function userCard (initialData) {
    return {
        user: initialData,
    
        init() {
            console.log('UserCard initialized for:', this.user.name);
        },
    
        showAlert() {
            alert(`You clicked on ${this.user.name}'s card!`);
        }
    }
};