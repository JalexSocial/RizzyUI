// packages/rizzyui/src/js/lib/components/rzFileInput.js
export default function registerRzFileInput(Alpine) {
    Alpine.data('rzFileInput', () => ({
        files: [],
        hasFiles: false,
        isDragging: false,
        draggingState: 'false',

        init() {
            this.syncFromInput();
        },

        trigger() {
            if (this.$refs.input) {
                this.$refs.input.click();
            }
        },

        handleFileChange() {
            this.syncFromInput();
        },

        handleDragOver() {
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

            if (!input || !dropped || dropped.length === 0) {
                return;
            }

            this.applyDroppedFiles(input, dropped);
            this.syncFromInput();
        },

        removeFileByIndex(event) {
            const input = this.$refs.input;
            if (!input?.files) {
                return;
            }

            const indexRaw = event?.currentTarget?.dataset?.index;
            const index = Number.parseInt(indexRaw ?? '-1', 10);
            if (Number.isNaN(index) || index < 0) {
                return;
            }

            const transfer = new DataTransfer();
            Array.from(input.files).forEach((file, fileIndex) => {
                if (fileIndex !== index) {
                    transfer.items.add(file);
                }
            });

            input.files = transfer.files;
            this.syncFromInput();
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

        syncFromInput() {
            const input = this.$refs.input;
            this.revokePreviews();

            if (!input?.files) {
                this.files = [];
                this.hasFiles = false;
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
    }));
}
