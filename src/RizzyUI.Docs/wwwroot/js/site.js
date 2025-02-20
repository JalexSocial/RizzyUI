document.addEventListener('alpine:init', () => {


    Alpine.data('demoTest', () => ({
        tabRef: null,
        init() {
            this.tabRef = document.getElementById("tabDemo");
        },
        handleButtonClick() {
            var data = Alpine.$data(this.tabRef); // This is how to get data for an element

            console.log(data.buttonRef);
        },
        destroy() {

        }
    }));

});