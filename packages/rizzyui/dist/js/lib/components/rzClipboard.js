export default function rzClipboard() {
    return {
        value: null,
        targetSelector: null,
        preferValue: false,
        feedbackDuration: 1200,
        useFallback: true,
        disabled: false,
        copied: false,
        timeoutHandle: null,

        get notCopied() {
            return !this.copied;
        },

        init() {
            this.value = this.$el.dataset.copyValue || null;
            this.targetSelector = this.$el.dataset.targetSelector || null;
            this.preferValue = this.$el.dataset.preferValue === 'true';
            this.feedbackDuration = parseInt(this.$el.dataset.feedbackDuration, 10) || 1200;
            this.useFallback = this.$el.dataset.useFallback === 'true';
            this.disabled = this.$el.dataset.disabled === 'true';
        },

        getTextToCopy() {
            if (this.preferValue && this.value) return this.value;

            if (this.targetSelector) {
                const target = document.querySelector(this.targetSelector);
                if (target) {
                    return target.value !== undefined ? target.value : target.textContent;
                }
            }

            return this.value;
        },

        async copy() {
            if (this.disabled) return;

            const text = this.getTextToCopy();
            const cleanText = text ? text.trim() : '';

            if (!cleanText) {
                this.dispatchFailed('empty-text');
                return;
            }

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(cleanText);
                    this.onSuccess(cleanText);
                } else if (this.useFallback) {
                    if (this.fallbackCopy(cleanText)) {
                        this.onSuccess(cleanText);
                    } else {
                        this.dispatchFailed('clipboard-unavailable');
                    }
                } else {
                    this.dispatchFailed('clipboard-unavailable');
                }
            } catch (err) {
                this.dispatchFailed('permission-denied', err);
            }
        },

        onSuccess(text) {
            this.copied = true;
            this.$dispatch('rz:copy', { id: this.$el.dataset.alpineRoot, text: text });

            if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
            this.timeoutHandle = setTimeout(() => {
                this.copied = false;
            }, this.feedbackDuration);
        },

        fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                textArea.remove();
                return true;
            } catch (err) {
                textArea.remove();
                return false;
            }
        },

        dispatchFailed(reason, error = null) {
            this.$dispatch('rz:copy-failed', {
                id: this.$el.dataset.alpineRoot,
                reason: reason,
                error: error,
            });
        },
    };
}
