/* RizzyUI JS */

document.addEventListener('alpine:init', () => {
    Alpine.data('rzAlert',
        () => {
            return {
                showAlert: true,

                dismiss() {
                    this.showAlert = false;
                },
            }
        });

    Alpine.data('rzBrowser', () => {
        return {
            screenSize: '',

            setDesktopScreenSize() {
                this.screenSize = '';
            },

            setTabletScreenSize() {
                this.screenSize = 'max-w-2xl';
            },

            setPhoneScreenSize() {
                this.screenSize = 'max-w-sm';
            },

        }
    })
})