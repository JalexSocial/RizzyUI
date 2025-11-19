
export default function(Alpine, require) {
    Alpine.data('rzCombobox', () => ({
        tomSelect: null,

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

        initTomSelect() {
            const selectEl = this.$refs.selectInput;
            if (!selectEl) return;

            const configEl = document.getElementById(this.$el.dataset.configId);
            const config = configEl ? JSON.parse(configEl.textContent) : {};

            const render = {};
            
            const createAlpineRow = (templateRef, data) => {
                if (!templateRef) return null;
                
                const div = document.createElement('div');
                div.innerHTML = templateRef.innerHTML;
                
                if (Alpine && Alpine.addScopeToNode) {
                    Alpine.addScopeToNode(div, data );
                } else {
                    console.warn('RzCombobox: Alpine.addScopeToNode is not available.');
                }
                
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

        destroy() {
            if (this.tomSelect) {
                this.tomSelect.destroy();
                this.tomSelect = null;
            }
        }
    }));
}