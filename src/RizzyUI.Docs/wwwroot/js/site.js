document.addEventListener('alpine:init', () => {


    Alpine.data('demoTest', () => ({
        tabRef: null,
        init() {
            this.tabRef = document.getElementById("tabDemo");
        },
        handleButtonClick() {
            var data = Alpine.$data(this.tabRef); // This is how to get data for an element
            var data2 = Alpine.mergeProxies(this.tabRef._x_dataStack);
            var data3 = this.tabRef.$data;
            console.log(data.buttonRef);
        },
        destroy() {

        }
    }));

});