export default function(Alpine, require) {
    Alpine.data('rzColorPicker', () => ({
        colorValue: '',
        swatchStyle: 'background-color: transparent;',
        config: {},
        inputId: '',

        init() {
            this.inputId = this.$el.dataset.inputId;
            this.colorValue = this.$el.dataset.initialValue || '';
            this.config = this.readConfig();
            this.refreshSwatch();

            const assets = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce;

            require(assets, nonce)
                .then(() => this.initializeColoris())
                .catch((e) => this.handleAssetError(e));
        },

        readConfig() {
            const raw = this.$el.dataset.config;
            if (!raw) {
                return {};
            }

            try {
                return JSON.parse(raw);
            } catch {
                return {};
            }
        },

        initializeColoris() {
            const input = this.$refs.input;
            if (!input || !window.Coloris) {
                return;
            }

            window.Coloris({
                el: input,
                wrap: false,
                themeMode: 'auto',
                ...this.config
            });

            this.colorValue = input.value || this.colorValue;
            this.refreshSwatch();
            input.addEventListener('input', () => this.handleInput());
        },

        handleInput() {
            const input = this.$refs.input;
            this.colorValue = input ? input.value : '';
            this.refreshSwatch();
        },

        refreshSwatch() {
            const normalized = this.colorValue && this.colorValue.trim().length > 0
                ? this.colorValue
                : 'transparent';

            this.swatchStyle = 'background-color: ' + normalized + ';';
        },

        handleAssetError(error) {
            console.error('Failed to load Coloris assets.', error);
        }
    }));
}
