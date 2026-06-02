// packages/rizzyui/src/js/lib/components/rzFileInput.js
export default function rzFileInput() {
    return {
        files: [],
        hasFiles: false,
        isDragging: false,
        draggingState: 'false',
        statusText: '',
        removeLabelTemplate: 'Remove {0}',
        previewAltTemplate: 'Preview of {0}',
        selectedCountTemplate: '{0} file(s) selected',
        removedTemplate: 'Removed {0}',
        clearedText: 'No files selected',

        init() {
            const dataset = this.$root?.dataset ?? {};
            this.removeLabelTemplate = dataset.removeLabelTemplate || this.removeLabelTemplate;
            this.previewAltTemplate = dataset.previewAltTemplate || this.previewAltTemplate;
            this.selectedCountTemplate = dataset.selectedCountTemplate || this.selectedCountTemplate;
            this.removedTemplate = dataset.removedTemplate || this.removedTemplate;
            this.clearedText = dataset.clearedText || this.clearedText;
            this.syncFromInput({ announce: false, source: 'init' });
        },

        trigger() {
            const input = this.$refs.input;
            if (!input || input.disabled || this.isDisabled()) {
                return;
            }

            input.click();
        },

        handleFileChange() {
            this.syncFromInput({ announce: true, source: 'change' });
        },

        handleDragOver() {
            if (this.isDisabled()) {
                return;
            }

            this.isDragging = true;
            this.draggingState = 'true';
        },

        handleDragLeave() {
            this.isDragging = false;
            this.draggingState = 'false';
        },

        handleDrop(event) {
            this.handleDragLeave();

            const input = this.$refs.input;
            const dropped = event?.dataTransfer?.files;

            if (!input || input.disabled || this.isDisabled() || !dropped || dropped.length === 0) {
                return;
            }

            this.applyDroppedFiles(input, dropped);
            this.syncFromInput({ announce: true, source: 'drop' });
        },

        removeFileByIndex(event) {
            const input = this.$refs.input;
            if (!input?.files || input.disabled || this.isDisabled()) {
                return;
            }

            const indexRaw = event?.currentTarget?.dataset?.index;
            const index = Number.parseInt(indexRaw ?? '-1', 10);
            if (Number.isNaN(index) || index < 0 || index >= input.files.length) {
                return;
            }

            const removedFile = input.files[index];
            const transfer = new DataTransfer();
            Array.from(input.files).forEach((file, fileIndex) => {
                if (fileIndex !== index) {
                    transfer.items.add(file);
                }
            });

            input.files = transfer.files;
            this.syncFromInput({ announce: true, source: 'remove', removedName: removedFile?.name });
        },

        applyDroppedFiles(input, droppedFiles) {
            const transfer = new DataTransfer();
            const canAppend = input.multiple;

            if (canAppend && input.files) {
                Array.from(input.files).forEach((file) => transfer.items.add(file));
                Array.from(droppedFiles).forEach((file) => transfer.items.add(file));
            } else if (droppedFiles.length > 0) {
                transfer.items.add(droppedFiles[0]);
            }

            input.files = transfer.files;
        },

        syncFromInput(options = {}) {
            const input = this.$refs.input;
            this.revokePreviews();

            if (!input?.files) {
                this.files = [];
                this.hasFiles = false;
                this.updateStatus(options);
                this.dispatchState(options.source || 'sync');
                return;
            }

            this.files = Array.from(input.files).map((file) => {
                const imageFile = file.type.startsWith('image/');
                const previewUrl = imageFile ? URL.createObjectURL(file) : null;

                return {
                    name: file.name,
                    size: file.size,
                    formattedSize: this.formatFileSize(file.size),
                    isImage: imageFile,
                    previewUrl,
                };
            });

            this.hasFiles = this.files.length > 0;
            this.updateStatus(options);
            this.dispatchState(options.source || 'sync');
        },

        updateStatus(options = {}) {
            if (!options.announce) {
                this.statusText = '';
                return;
            }

            if (options.source === 'remove' && options.removedName) {
                this.statusText = this.interpolate(this.removedTemplate, options.removedName);
                return;
            }

            if (this.files.length === 0) {
                this.statusText = this.clearedText;
                return;
            }

            this.statusText = this.interpolate(this.selectedCountTemplate, this.files.length);
        },

        dispatchState(source) {
            this.$dispatch('rz:file-input:state-change', {
                source,
                count: this.files.length,
                names: this.files.map((file) => file.name),
            });
        },

        getRemoveLabel(file) {
            return this.interpolate(this.removeLabelTemplate, file?.name || 'file');
        },

        getPreviewAlt(file) {
            return this.interpolate(this.previewAltTemplate, file?.name || 'file');
        },

        interpolate(template, value) {
            return String(template).replaceAll('{0}', String(value));
        },

        isDisabled() {
            return this.$root?.dataset?.disabled === 'true';
        },

        formatFileSize(size) {
            if (!Number.isFinite(size) || size <= 0) {
                return '0 B';
            }

            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            const power = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
            const formatted = size / 1024 ** power;
            const rounded = formatted >= 10 || power === 0 ? Math.round(formatted) : formatted.toFixed(1);

            return `${rounded} ${units[power]}`;
        },

        revokePreviews() {
            this.files.forEach((file) => {
                if (file.previewUrl) {
                    URL.revokeObjectURL(file.previewUrl);
                }
            });
        },

        destroy() {
            this.revokePreviews();
        },
    };
}
