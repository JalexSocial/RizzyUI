
export default function(Alpine, require) {
    Alpine.data('rzCombobox', () => ({
        tomSelect: null,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const assets = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce;

            if (assets.length > 0 && typeof require === 'function') {
                require(assets, {
                    success: () => this.initTomSelect(),
                    error: (err) => console.error('RzCombobox: Failed to load assets.', err)
                }, nonce);
            } else if (window.TomSelect) {
                this.initTomSelect();
            }
        },

        /**
         * Executes the `initTomSelect` operation.
         * @returns {any} Returns the result of `initTomSelect` when applicable.
         */
        initTomSelect() {
            const selectEl = this.$refs.selectInput;
            if (!selectEl) return;

            const configEl = document.getElementById(this.$el.dataset.configId);
            const config = configEl ? JSON.parse(configEl.textContent) : {};

            const render = {};
            
            const createAlpineRow = (templateRef, data) => {
                if (!templateRef) return null;
                
                const div = document.createElement('div');

                let parsedItem = data.item;
                if (typeof parsedItem === 'string') {
                    try {
                        parsedItem = JSON.parse(parsedItem);
                    } catch (e) {
                        // If parsing fails, leave parsedItem as the original string
                    }
                }

                const scope = {
                    ...data,
                    item: parsedItem
                };

                if (Alpine && typeof Alpine.addScopeToNode === 'function') {
                    Alpine.addScopeToNode(div, scope);
                } else {
                    div._x_dataStack = [scope];
                }
                
                div.innerHTML = templateRef.innerHTML;
                
                return div;
            };

            if (this.$refs.optionTemplate) {
                render.option = (data, escape) => createAlpineRow(this.$refs.optionTemplate, data);
            }
            if (this.$refs.itemTemplate) {
                render.item = (data, escape) => createAlpineRow(this.$refs.itemTemplate, data);
            }

            config.dataAttr = "data-item";

            this.tomSelect = new TomSelect(selectEl, {
                ...config,
                render: render,
                onInitialize: function() {
                    this.sync();
                }
            });
        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            if (this.tomSelect) {
                this.tomSelect.destroy();
                this.tomSelect = null;
            }
        }
    }));
}
