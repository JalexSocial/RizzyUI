
// --------------------------------------------------------------------------------
// Alpine.js component: rzProgress
// Implements a progress bar with dynamic percentage calculation, ARIA attributes,
// and methods to update, increment, or decrement progress.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzProgress', () => ({
        currentVal: 0,
        minVal: 0,
        maxVal: 100,
        percentage: 0,
        label: '',
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const element = this.$el;
            // Retrieve progress values from data attributes
            this.currentVal = parseInt(element.getAttribute('data-current-val')) || 0;
            this.minVal = parseInt(element.getAttribute('data-min-val')) || 0;
            this.maxVal = parseInt(element.getAttribute('data-max-val')) || 100;
            this.label = element.getAttribute('data-label');
            // Calculate initial percentage and update ARIA attributes
            this.calculatePercentage();
            element.setAttribute('aria-valuenow', this.currentVal);
            element.setAttribute('aria-valuemin', this.minVal);
            element.setAttribute('aria-valuemax', this.maxVal);
            element.setAttribute('aria-valuetext', `${this.percentage}%`);
            this.updateProgressBar();

            const resizeObserver = new ResizeObserver(entries => {
                this.updateProgressBar();
            });
            resizeObserver.observe(element);

            // Watch for changes in currentVal to update progress dynamically
            this.$watch('currentVal', () => {
                this.calculatePercentage();
                this.updateProgressBar();
                element.setAttribute('aria-valuenow', this.currentVal);
                element.setAttribute('aria-valuetext', `${this.percentage}%`);
            });
        },
        /**
         * Executes the `calculatePercentage` operation.
         * @returns {any} Returns the result of `calculatePercentage` when applicable.
         */
        calculatePercentage() {
            if (this.maxVal === this.minVal) {
                this.percentage = 0;
            } else {
                this.percentage = Math.min(Math.max(((this.currentVal - this.minVal) / (this.maxVal - this.minVal)) * 100, 0), 100);
            }
        },
        /**
         * Executes the `buildLabel` operation.
         * @returns {any} Returns the result of `buildLabel` when applicable.
         */
        buildLabel() {
            var label = this.label || '{percent}%';
            this.calculatePercentage();
            return label.replace('{percent}', this.percentage);
        },
        /**
         * Executes the `buildInsideLabelPosition` operation.
         * @returns {any} Returns the result of `buildInsideLabelPosition` when applicable.
         */
        buildInsideLabelPosition() {
            const progressBar = this.$refs.progressBar;
            const barLabel = this.$refs.progressBarLabel;
            const innerLabel = this.$refs.innerLabel;
            if (barLabel && progressBar && innerLabel) {
                innerLabel.innerText = this.buildLabel();
                if (barLabel.clientWidth > progressBar.clientWidth) {
                    barLabel.style.left = (progressBar.clientWidth + 10) + 'px';
                } else {
                    barLabel.style.left = (progressBar.clientWidth / 2 - barLabel.clientWidth / 2) + 'px';
                }
            }
        },
        /**
         * Executes the `getLabelCss` operation.
         * @returns {any} Returns the result of `getLabelCss` when applicable.
         */
        getLabelCss() {
            const barLabel = this.$refs.progressBarLabel;
            const progressBar = this.$refs.progressBar;
            if (barLabel && progressBar && barLabel.clientWidth > progressBar.clientWidth) {
                return "text-foreground dark:text-foreground";
            }
            return "";
        },
        /**
         * Executes the `updateProgressBar` operation.
         * @returns {any} Returns the result of `updateProgressBar` when applicable.
         */
        updateProgressBar() {
            const progressBar = this.$refs.progressBar;
            if (progressBar) {
                progressBar.style.width = `${this.percentage}%`;
                this.buildInsideLabelPosition();
            }
        },
        // Methods to set, increment, or decrement the progress value
        setProgress(value) {
            this.currentVal = value;
        },
        /**
         * Executes the `increment` operation.
         * @param {any} val Input value for this method.
         * @returns {any} Returns the result of `increment` when applicable.
         */
        increment(val = 1) {
            this.currentVal = Math.min(this.currentVal + val, this.maxVal);
        },
        /**
         * Executes the `decrement` operation.
         * @param {any} val Input value for this method.
         * @returns {any} Returns the result of `decrement` when applicable.
         */
        decrement(val = 1) {
            this.currentVal = Math.max(this.currentVal - val, this.minVal);
        }
    }));
}
