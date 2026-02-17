document.addEventListener('alpine:init', () => {

    Alpine.data('docSearch', () => ({

        init() {
            docsearch({
                container: '#docsearch',
                appId: '4NNHPLPB1Z',
                indexName: 'RizzyUI Documentation',
                apiKey: '52ed9e7932048b8906b7babc7739551b',
                askAi: '', // TODO: Replace with your Algolia Assistant ID
            });
        }
    }));

    Alpine.data('demoTest', () => ({
        tabRef: null,
        init() {
            this.tabRef = document.getElementById("tabDemo");
        },
        handleButtonClick() {
            var data = Alpine.$data(this.tabRef); // This is how to get data for an element

            console.log(data.buttonRef);
        },
        destroy() {

        }
    }));

    Alpine.data('modalPageController', () => ({
        // Dispatch function for basic modal
        showBasicModal() {
            console.log("Dispatching show-basic-modal"); // Debug log
            window.dispatchEvent(new CustomEvent('show-basic-modal'));
        },

        // Dispatch function for small modal
        showSmallModal() {
            console.log("Dispatching show-small-modal"); // Debug log
            window.dispatchEvent(new CustomEvent('show-small-modal'));
        },

        // Dispatch function for custom title modal
        showCustomTitleModal() {
            console.log("Dispatching show-custom-title-modal"); // Debug log
            window.dispatchEvent(new CustomEvent('show-custom-title-modal'));
        },

        // Dispatch function for HTMX load example modal
        showHtmxLoadModal() {
            console.log("Dispatching show-htmx-load-modal"); // Debug log
            window.dispatchEvent(new CustomEvent('show-htmx-load-modal'));
            // Note: The HTMX request itself is still handled by hx-get on the button
        },

        // Dispatch function for HTMX close example modal
        showHtmxCloseModal() {
            console.log("Dispatching show-htmx-close-modal"); // Debug log
            window.dispatchEvent(new CustomEvent('show-htmx-close-modal'));
        }
    }));    
});