
// --------------------------------------------------------------------------------
// Alpine.js component: rzBrowser
// This component simulates a browser preview with adjustable screen sizes.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzBrowser', () => {
        return {
            screenSize: '',
            /**
             * Executes the `setDesktopScreenSize` operation.
             * @returns {any} Returns the result of `setDesktopScreenSize` when applicable.
             */
            setDesktopScreenSize() {
                this.screenSize = '';
            },
            /**
             * Executes the `setTabletScreenSize` operation.
             * @returns {any} Returns the result of `setTabletScreenSize` when applicable.
             */
            setTabletScreenSize() {
                this.screenSize = 'max-w-2xl';
            },
            /**
             * Executes the `setPhoneScreenSize` operation.
             * @returns {any} Returns the result of `setPhoneScreenSize` when applicable.
             */
            setPhoneScreenSize() {
                this.screenSize = 'max-w-sm';
            },
            // Get CSS classes for browser border based on screen size
            getBrowserBorderCss() {
                return [this.screenSize, this.screenSize === '' ? 'border-none' : 'border-x'];
            },
            // Get CSS classes for desktop screen button styling
            getDesktopScreenCss() {
                return [this.screenSize === '' ? 'text-foreground forced-color-adjust-auto dark:text-foreground' : 'opacity-60'];
            },
            // Get CSS classes for tablet screen button styling
            getTabletScreenCss() {
                return [this.screenSize === 'max-w-2xl' ? 'text-foreground forced-color-adjust-auto dark:text-foreground' : 'opacity-60'];
            },
            // Get CSS classes for phone screen button styling
            getPhoneScreenCss() {
                return [this.screenSize === 'max-w-sm' ? 'text-foreground forced-color-adjust-auto dark:text-foreground' : 'opacity-60'];
            }
        };
    });
}
