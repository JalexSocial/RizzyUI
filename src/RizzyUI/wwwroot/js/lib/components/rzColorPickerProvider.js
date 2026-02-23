export default function registerRzColorPickerProvider(Alpine, require) {
    Alpine.data('rzColorPickerProvider', () => ({
        colorPicker: {
            value: '',
            open: null,
            setValue: null,
            getValue: null,
            updateConfiguration: null,
        },
        config: {},
        _isSyncingFromInput: false,
        _isSyncingToInput: false,
        _inputListenerAttached: false,

        init() {
            this.colorPicker.open = this.openPicker.bind(this);
            this.colorPicker.setValue = this.setValue.bind(this);
            this.colorPicker.getValue = () => this.colorPicker.value;
            this.colorPicker.updateConfiguration = this.updateConfiguration.bind(this);

            this.colorPicker.value = this.readValue(this.$el.dataset.initialValue || '');
            this.config = this.readConfig();

            this.$watch('colorPicker.value', (next) => {
                const normalized = this.readValue(next);

                if (normalized !== next) {
                    this.colorPicker.value = normalized;
                    return;
                }

                this.syncInputFromState();
            });

            const assets = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce;

            require(assets, nonce)
                .then(() => this.initializeColoris())
                .catch((e) => this.handleAssetError(e));
        },

        readValue(value) {
            return typeof value === 'string' ? value.trim() : '';
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

            this.config = {
                el: input,
                wrap: false,
                themeMode: 'auto',
                onChange: (color, inputEl) => {
                    if (inputEl !== this.$refs.input) {
                        return;
                    }

                    this.syncStateFromInput(inputEl);
                    inputEl.dispatchEvent(new CustomEvent('rz:colorpicker:onchange', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            colorPicker: this.colorPicker,
                            updateConfiguration: this.updateConfiguration.bind(this),
                            el: inputEl,
                            providerEl: this.$el,
                        }
                    }));
                },
                ...this.config,
            };

            window.Coloris(this.config);
            this.syncStateFromInput(input);

            if (!this._inputListenerAttached) {
                input.addEventListener('input', () => {
                    this.syncStateFromInput(input);
                });

                this._inputListenerAttached = true;
            }

            this.syncInputFromState();
        },

        openPicker(event) {
            const input = this.$refs.input;
            if (!input) {
                return;
            }

            this.positionAnchorInput(input, event);
            this.syncInputFromState();

            input.focus();
            input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        },

        positionAnchorInput(input, event) {
            const trigger = event?.currentTarget;
            if (!trigger || typeof trigger.getBoundingClientRect !== 'function') {
                return;
            }

            const rect = trigger.getBoundingClientRect();
            input.style.left = `${Math.round(rect.left)}px`;
            input.style.top = `${Math.round(rect.bottom)}px`;
        },

        setValue(value) {
            this.colorPicker.value = value;
        },

        updateConfiguration(config) {
            this.config = {
                ...this.config,
                ...config,
            };

            const input = this.$refs.input;
            if (!window.Coloris || !input) {
                return;
            }

            window.Coloris.setInstance(input, this.config);
        },

        syncStateFromInput(inputEl) {
            if (!inputEl || this._isSyncingToInput) {
                return;
            }

            this._isSyncingFromInput = true;
            this.colorPicker.value = this.readValue(inputEl.value || '');
            queueMicrotask(() => {
                this._isSyncingFromInput = false;
            });
        },

        syncInputFromState() {
            const input = this.$refs.input;
            if (!input || this._isSyncingFromInput) {
                return;
            }

            const next = this.readValue(this.colorPicker.value);
            if (input.value === next) {
                return;
            }

            this._isSyncingToInput = true;
            input.value = next;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            queueMicrotask(() => {
                this._isSyncingToInput = false;
            });
        },

        handleAssetError(error) {
            console.error('Failed to load Coloris assets.', error);
        }
    }));
}
