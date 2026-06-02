import { require } from '../../runtime/rizzyRequire.js';


export default function rzCombobox() {
    return {
        tomSelect: null,
        value: '',
        values: [],
        text: '',
        texts: [],

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

                if (Alpine && typeof window.Alpine.addScopeToNode === 'function') {
                    window.Alpine.addScopeToNode(div, scope);
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

            const alpine = this;

            this.tomSelect = new TomSelect(selectEl, {
                ...config,
                render: render,
                onInitialize: function() {
                    this.sync();
                    alpine.syncSelectedState(false);
                    const controlInput = this.control_input;
                    const control = this.control;
                    const dropdown = this.dropdown;

                    if (controlInput) {
                        const selectId = selectEl.id || this.inputId || this.$input?.id || '';
                        if (selectId) {
                            controlInput.id = `${selectId}-ts-input`;
                        }
                        const ariaLabel = selectEl.getAttribute('aria-label');
                        if (ariaLabel) {
                            controlInput.setAttribute('aria-label', ariaLabel);
                        }
                        const ariaLabelledBy = selectEl.getAttribute('aria-labelledby');
                        if (ariaLabelledBy) {
                            controlInput.setAttribute('aria-labelledby', ariaLabelledBy);
                        }
                        const ariaDescribedBy = selectEl.getAttribute('aria-describedby');
                        if (ariaDescribedBy) {
                            controlInput.setAttribute('aria-describedby', ariaDescribedBy);
                        }
                        const ariaInvalid = selectEl.getAttribute('aria-invalid');
                        if (ariaInvalid) {
                            controlInput.setAttribute('aria-invalid', ariaInvalid);
                        }
                        if (selectEl.disabled) {
                            controlInput.setAttribute('aria-disabled', 'true');
                        }
                    }

                    if (control) {
                        const describedBy = selectEl.getAttribute('aria-describedby');
                        if (describedBy) {
                            control.setAttribute('aria-describedby', describedBy);
                        }
                    }

                    if (dropdown && this.dropdown_content?.id) {
                        dropdown.setAttribute('aria-controls', this.dropdown_content.id);
                    }
                },
                onChange: function() {
                    this.sync();
                    alpine.syncSelectedState(true);
                }
            });
        },


        syncSelectedState(emit = true) {
            const selectEl = this.$refs.selectInput;
            if (!selectEl) return;

            const rawValue = this.tomSelect ? this.tomSelect.getValue() : Array.from(selectEl.selectedOptions || []).map((option) => option?.value ?? '');

            const normalizedValues = Array.isArray(rawValue)
                ? rawValue.filter((value) => value !== null && value !== undefined && value !== '').map((value) => String(value))
                : (rawValue === null || rawValue === undefined || rawValue === '' ? [] : [String(rawValue)]);

            const normalizedTexts = normalizedValues.map((value) => this.getOptionText(value));

            this.values = normalizedValues;
            this.value = selectEl.multiple ? normalizedValues : (normalizedValues[0] || '');
            this.texts = normalizedTexts;
            this.text = selectEl.multiple ? normalizedTexts.join(', ') : (normalizedTexts[0] || '');

            if (emit) {
                this.$dispatch('rz:combobox:change', {
                    id: this.$el.id || null,
                    selectId: selectEl.id || null,
                    name: selectEl.name || '',
                    multiple: selectEl.multiple,
                    value: this.value,
                    values: this.values,
                    text: this.text,
                    texts: this.texts
                });
            }
        },

        getOptionText(value) {
            const key = String(value);
            const tomSelectText = this.tomSelect?.options?.[key]?.text;
            if (typeof tomSelectText === 'string' && tomSelectText.length > 0) {
                return tomSelectText;
            }

            const selectEl = this.$refs.selectInput;
            if (selectEl) {
                const option = Array.from(selectEl.options || []).find((candidate) => String(candidate?.value ?? '') === key);
                if (option?.text) {
                    return option.text;
                }
            }

            return key;
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
    };
}
