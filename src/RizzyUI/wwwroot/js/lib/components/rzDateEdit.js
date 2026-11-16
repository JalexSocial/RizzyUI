import { require } from '../../runtime/rizzyRequire.js';

function parseDataJson(value, fallback, name) {
    if (!value) {
        return fallback;
    }

    try {
        return JSON.parse(value) ?? fallback;
    } catch (error) {
        console.error(`[rzDateEdit] Invalid JSON in data-${name}.`, error);
        return fallback;
    }
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/;

// The server sends dates as ISO strings. Flatpickr parses strings with `dateFormat`, which misreads
// them when a custom format is set, so ISO dates are converted to local Date objects first.
function isoToDate(value) {
    const match = typeof value === 'string' ? ISO_DATE.exec(value) : null;
    if (!match) {
        return value;
    }
    const [, y, mo, d, h = '0', mi = '0', s = '0'] = match;
    return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
}

function isoToTime(value) {
    const match = typeof value === 'string' ? ISO_DATE.exec(value) : null;
    return match && match[4] !== undefined ? `${match[4]}:${match[5]}` : value;
}

function toDateList(value) {
    if (!Array.isArray(value)) {
        return value;
    }
    return value.map((entry) => entry && typeof entry === 'object' && !(entry instanceof Date)
        ? { ...entry, from: isoToDate(entry.from), to: isoToDate(entry.to) }
        : isoToDate(entry));
}

/**
 * Returns a copy of the server options with ISO dates converted for Flatpickr.
 * @param {Record<string, any>} options
 */
export function toFlatpickrOptions(options) {
    const result = { ...options };
    for (const key of ['minDate', 'maxDate']) {
        if (key in result) result[key] = isoToDate(result[key]);
    }
    if ('defaultDate' in result) {
        result.defaultDate = Array.isArray(result.defaultDate) ? toDateList(result.defaultDate) : isoToDate(result.defaultDate);
    }
    for (const key of ['enable', 'disable']) {
        if (key in result) result[key] = toDateList(result[key]);
    }
    for (const key of ['minTime', 'maxTime']) {
        if (key in result) result[key] = isoToTime(result[key]);
    }
    return result;
}

// --------------------------------------------------------------------------------
// window.Alpine.js component: rzDateEdit
// This component initializes a date picker (using Flatpickr) on an input element.
// It retrieves its configuration and assets from data attributes, and destroys the
// Flatpickr instance (calendar element and document listeners) when it is removed.
// --------------------------------------------------------------------------------
export default function rzDateEdit() {
    // Kept outside the reactive data object: Alpine must not proxy the Flatpickr instance.
    let picker = null;
    let destroyed = false;

    return {
        options: {},
        placeholder: '',
        prependText: '',
        /**
         * Reads the server configuration, loads the Flatpickr assets and creates the picker.
         */
        init() {
            const config = parseDataJson(this.$el.dataset.config, {}, 'config');
            const options = config.options && typeof config.options === 'object' ? config.options : {};
            this.options = options;
            this.placeholder = config.placeholder || '';
            this.prependText = config.prependText || '';

            // The input's id follows the form field mapping (data-input-id); older markup used "{uid}-input".
            const inputElem = document.getElementById(this.$el.dataset.inputId || this.$el.dataset.uid + '-input');
            const assets = parseDataJson(this.$el.dataset.assets, [], 'assets');
            const nonce = this.$el.dataset.nonce;

            const createPicker = () => {
                if (destroyed || picker || !inputElem || typeof window.flatpickr !== 'function') {
                    return;
                }
                // A copy: Flatpickr keeps and may change the object it is given.
                picker = window.flatpickr(inputElem, toFlatpickrOptions(options));
            };

            // No asset list: the application loads Flatpickr itself.
            if (!Array.isArray(assets) || assets.length === 0) {
                createPicker();
                return;
            }

            require(assets, {
                success: createPicker,
                error: () => console.error('Failed to load Flatpickr assets.'),
            }, nonce).catch(() => {
                // Already reported by the error callback.
            });
        },
        /**
         * Destroys the Flatpickr instance. Alpine calls this when the element is removed, for
         * example by an htmx swap.
         */
        destroy() {
            destroyed = true;
            if (picker) {
                picker.destroy();
                picker = null;
            }
        },
    };
}
