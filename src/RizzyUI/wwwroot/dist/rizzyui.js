/******/ (() => { // webpackBootstrap
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!***************************************!*\
  !*** ./wwwroot/js/rizzy-streaming.js ***!
  \***************************************/
﻿/*
 * Blazor Stream Rendering HTMX Extension
 * Author: Michael Tanczos
 * Credits to SSE extension and Microsoft aspnetcore
 * at https://github.com/dotnet/aspnetcore/blob/main/src/Components/Web.JS/src/Rendering/StreamingRendering.ts
 */
(function () {

    var api;
    var enableDomPreservation = true;
    var componentLoaded = false;

    class blazorStreamingUpdate extends HTMLElement {
        connectedCallback() {
            const blazorSsrElement = this.parentNode;

            // Synchronously remove this from the DOM to minimize our chance of affecting anything else
            blazorSsrElement.parentNode?.removeChild(blazorSsrElement);

            // When this element receives content, if it's <template blazor-component-id="...">...</template>,
            // insert the template content into the DOM
            blazorSsrElement.childNodes.forEach(node => {
                if (node instanceof HTMLTemplateElement) {
                    const componentId = node.getAttribute("blazor-component-id");
                    if (componentId) {
                        insertStreamingContentIntoDocument(componentId, node.content);
                    }
                }
            });

            htmx?.process(document.body);
        }
    }

    htmx.defineExtension("rizzy-streaming",
        {
            /**
             * Init saves the provided reference to the internal HTMX API.
             *
             * @param {import("../htmx").HtmxInternalApi} api
             * @returns void
             */
            init: function (apiRef) {
                // store a reference to the internal API.
                api = apiRef;

                // set a function in the public API for creating new EventSource objects
                if (htmx.blazorSwapSsr == undefined) {
                    if (customElements.get('blazor-ssr-end') === undefined) {
                        customElements.define('blazor-ssr-end', blazorStreamingUpdate);
                    }
                    htmx.blazorSwapSsr = blazorSwapSsr;
                }
            },
            onEvent: function (name, evt) {
                if (name === "htmx:afterOnLoad") {
                    htmx?.process(document.body);
                }
                else if (name === "htmx:beforeRequest") {
                    var element = evt.detail.elt;
                    if (evt.detail.requestConfig.target) {
                        evt.detail.requestConfig.target.addEventListener("htmx:beforeSwap",
                            e => {
                                // Any html that was already streamed in could have been updated with
                                // blazor ssr content so the final xhr response can be thrown away
                                //e.detail.shouldSwap = false;
                            }, { once: true });
                    }

                    var last = 0;
                    var swapSpec = api.getSwapSpecification(element);
                    var xhr = evt.detail.xhr;

                    // Create a container id for a temporary div container. All streamed html will be placed 
                    // inside the container so that htmx swap methods work correctly
                    var cid = 'ctr' + crypto.randomUUID();

                    xhr.addEventListener("readystatechange", () => {

                        // If finished we can unwrap the container all html was stored into
                        if (xhr.readyState === 4) {
                            var container = document.getElementById(cid);

                            if (container != null)
                                unwrap(container);
                        }
                    });

                    xhr.addEventListener("progress", e => {

                        var container = document.getElementById(cid);

                        // If the container doesn't exist we need to create it and swap it into the element
                        // target space. From here on we can stream responses into the container directly.
                        if (container == null) {
                            container = document.createElement('div');
                            container.id = cid;

                            // Swap in a container div to hold the streaming html
                            swap(element, container.outerHTML, swapSpec, xhr);

                            // The very first swap into the container can be a replacement swap
                            swapSpec.swapStyle = "innerHTML";

                            // Ensure there is always a container even if not added to the dom
                            container = document.getElementById(cid) ?? container;
                        }

                        // Compute any new html in this chunk
                        diff = e.currentTarget.response.substring(last);
                        swap(container, diff, swapSpec, xhr);

                        swapSpec.settleDelay = 0;
                        swapSpec.swapStyle = "beforeend";
                        last = e.loaded;
                    });

                }

                return true;
            }
        });

    function isCommentNodeInHead(commentNode) {
        // Ensure that the provided node is indeed a comment node
        if (commentNode && commentNode.nodeType === Node.COMMENT_NODE) {
            let currentNode = commentNode.parentNode;
            // Traverse up the DOM tree
            while (currentNode !== null) {
                if (currentNode === document.head) {
                    // The comment node is within the <head>
                    return true;
                }
                currentNode = currentNode.parentNode;
            }
        } else {
            return false;
        }
        // The traversal reached the root without finding <head>, or <head> does not exist
        return false;
    }

    function blazorSwapSsr(start, end, docFrag, xhr) {
        var newDiv = wrap(start, end, 'ssr' + crypto.randomUUID());

        var container = document.createElement('div');
        container.appendChild(docFrag);

        swap(newDiv, container.innerHTML, xhr);

        unwrap(newDiv);
    }

    function wrap(start, end, id) {

        var newDiv = document.createElement('div');
        newDiv.id = id;

        // Iterate through nodes between start and end
        var currentNode = start.nextSibling;
        while (currentNode && currentNode !== end) {
            newDiv.appendChild(currentNode);
            currentNode = start.nextSibling;
        }

        start.parentNode.insertBefore(newDiv, end);

        return newDiv;
    }

    function unwrap(element) {
        // Ensure that the element has a parent
        if (element.parentNode) {
            // Move all child nodes out of the element
            while (element.firstChild) {
                element.parentNode.insertBefore(element.firstChild, element);
            }

            // Remove the empty element
            element.parentNode.removeChild(element);
        }
    }

    function handleOutOfBandSwaps(elt, fragment, settleInfo) {
        var oobSelects = api.getClosestAttributeValue(elt, "hx-select-oob");
        if (oobSelects) {
            var oobSelectValues = oobSelects.split(",");
            for (var i = 0; i < oobSelectValues.length; i++) {
                var oobSelectValue = oobSelectValues[i].split(":", 2);
                var id = oobSelectValue[0].trim();
                if (id.indexOf("#") === 0) {
                    id = id.substring(1);
                }
                var oobValue = oobSelectValue[1] || "true";
                var oobElement = fragment.querySelector("#" + id);
                if (oobElement) {
                    api.oobSwap(oobValue, oobElement, settleInfo);
                }
            }
        }
        forEach(findAll(fragment, '[hx-swap-oob], [data-hx-swap-oob]'), function (oobElement) {
            var oobValue = getAttributeValue(oobElement, "hx-swap-oob");
            if (oobValue != null) {
                api.oobSwap(oobValue, oobElement, settleInfo);
            }
        });
    }

    /**
     * @param {HTMLElement} elt
     * @param {string} content
     */
    function swap(elt, content, swapSpec, xhr) {

        api.withExtensions(elt, function (extension) {
            content = extension.transformResponse(content, xhr, elt);
        });

        swapSpec ??= api.getSwapSpecification(elt);
        var target = api.getTarget(elt);
        var settleInfo = api.makeSettleInfo(elt);

        // htmx 2.0
        api.swap(target, content, swapSpec);

        //api.selectAndSwap(swapSpec.swapStyle, target, elt, content, settleInfo);

        settleInfo.elts.forEach(function (elt) {
            if (elt.classList) {
                elt.classList.add(htmx.config.settlingClass);
            }
            api.triggerEvent(elt, 'htmx:beforeSettle');
        });

        // Handle settle tasks (with delay if requested)
        if (swapSpec.settleDelay > 0) {
            setTimeout(doSettle(settleInfo), swapSpec.settleDelay);
        } else {
            doSettle(settleInfo)();
        }
    }

    /**
     * doSettle mirrors much of the functionality in htmx that
     * settles elements after their content has been swapped.
     * TODO: this should be published by htmx, and not duplicated here
     * @param {import("../htmx").HtmxSettleInfo} settleInfo
     * @returns () => void
     */
    function doSettle(settleInfo) {

        return function () {
            settleInfo.tasks.forEach(function (task) {
                task.call();
            });

            settleInfo.elts.forEach(function (elt) {
                if (elt.classList) {
                    elt.classList.remove(htmx.config.settlingClass);
                }
                api.triggerEvent(elt, 'htmx:afterSettle');
            });
        }
    }

    function insertStreamingContentIntoDocument(componentIdAsString, docFrag) {
        const markers = findStreamingMarkers(componentIdAsString)
        if (markers) {
            const { startMarker, endMarker } = markers
            enableDomPreservation = !isCommentNodeInHead(startMarker);
            if (enableDomPreservation) {
                blazorSwapSsr(startMarker, endMarker, docFrag);
            } else {
                // In this mode we completely delete the old content before inserting the new content
                const destinationRoot = endMarker.parentNode
                const existingContent = new Range()
                existingContent.setStart(startMarker, startMarker.textContent.length)
                existingContent.setEnd(endMarker, 0)
                existingContent.deleteContents()

                while (docFrag.childNodes[0]) {
                    destinationRoot.insertBefore(docFrag.childNodes[0], endMarker)
                }
            }
        }
    }

    function findStreamingMarkers(componentIdAsString) {
        // Find start marker
        const expectedStartText = `bl:${componentIdAsString}`
        const iterator = document.createNodeIterator(
            document,
            NodeFilter.SHOW_COMMENT
        )
        let startMarker = null
        while ((startMarker = iterator.nextNode())) {
            if (startMarker.textContent === expectedStartText) {
                break
            }
        }

        if (!startMarker) {
            return null
        }

        // Find end marker
        const expectedEndText = `/bl:${componentIdAsString}`
        let endMarker = null
        while ((endMarker = iterator.nextNode())) {
            if (endMarker.textContent === expectedEndText) {
                break
            }
        }

        return endMarker ? { startMarker, endMarker } : null
    }
})();
})();

// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!***********************************!*\
  !*** ./wwwroot/js/rizzy-nonce.js ***!
  \***********************************/
if (!document.__htmx_noncehandler) {

    htmx.defineExtension('rizzy-nonce',
        {
            transformResponse: function(text, xhr, elt) {

                let documentNonce = htmx.config.documentNonce ?? htmx.config.inlineScriptNonce;

                if (!documentNonce) {
                    console.warn("rizzy-nonce extension loaded but no no nonce found for document. Inline scripts may be blocked.");
                    documentNonce = "";
                }

                // disable ajax fetching on history miss because it doesn't handle nonce replacment
                htmx.config.refreshOnHistoryMiss = true; 

                // CSP nonce determination based on safe-nonce by Michael West
                let nonce = xhr?.getResponseHeader('HX-Nonce');
                if (!nonce) {
                    const csp = xhr?.getResponseHeader('content-security-policy');
                    if (csp) {
                        const cspMatch = csp.match(/(style|script)-src[^;]*'nonce-([^']*)'/i);
                        if (cspMatch) {
                            nonce = cspMatch[2];
                        }
                    }
                }
                if (xhr && window.location.hostname) {
                    const responseURL = new URL(xhr.responseURL);
                    if (responseURL.hostname !== window.location.hostname) {
                        nonce = ''; // ignore nonce header if request is not some domain 
                    }
                }

                nonce ??= '';

                return this.processUnsafeHtml(text, documentNonce, nonce);
            },
            processUnsafeHtml: function(text, documentNonce, newScriptNonce) {
                //const noncePattern = new RegExp(`(['"])${newScriptNonce}\\1`, 'gi');

                // Replace any occurrences of the nonce provided by the server with
                // the existing document nonce. Note that at minimum the server text originates
                // from is same-origin and the newScriptNonce that is replaced is determined
                // from response headers which are only available when processing the xmlHttpRequest
                if (documentNonce)
                    text = text.replaceAll(newScriptNonce, documentNonce);

                const parser = new DOMParser();

                try {
                    // At this point any remaining elements that don't have the correct
                    // nonce will cause console errors to be emitted. We are going to strip
                    // out those elements and any attempts to block rizzy-nonce in the included markup.
                    let doc = parser.parseFromString(text, "text/html");

                    if (doc) {
                        // Remove any attempts to disable rizzy-nonce extension
                        Array.from(doc.querySelectorAll('[hx-ext*="ignore:rizzy-nonce"], [data-hx-ext*="ignore:rizzy-nonce"]'))
                            .forEach((elt) => {
                                elt.remove();
                            });

                        // Select all <script> and <style> tags
                        const elements = doc.querySelectorAll("script, style, link");

                        // Iterate through each element
                        elements.forEach(elt => {
                            const nonce = elt.getAttribute("nonce");
                            if (nonce !== documentNonce) {
                                // Remove the element if the nonce doesn't match (or is missing)
                                elt.remove();
                            }
                        });

                        // Serialize the document back into an HTML string and return it
                        return doc.documentElement.outerHTML;
                    }

                } catch (_) { }
                {

                }

                return '';

            }
        });

    document.__htmx_noncehandler = true;
}
})();

// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!*******************************!*\
  !*** ./wwwroot/js/rizzyui.js ***!
  \*******************************/
﻿/* RizzyUI JS */
document.addEventListener('alpine:init', () => {
    // Try to initialize ASP.NET Validation Service if available
    try {
        let v = new aspnetValidation.ValidationService();
        v.bootstrap({ watch: true });
        window.validation = v;
    } catch (error) {
        console.log("error: aspnetValidation is not available");
    }

    // --------------------------------------------------------------------------------
    // Utility: Generate a unique bundle ID based on an array of script paths.
    // It sorts the paths, joins them with a separator, and computes a SHA-256 hash.
    // The resulting hash (in hexadecimal) is used as the bundle ID.
    // --------------------------------------------------------------------------------
    async function generateBundleId(paths) {
        // Sort paths to allow generating the same bundle id if all assets are identical
        paths = [...paths].sort();
        const joinedPaths = paths.join('|');
        const encoder = new TextEncoder();
        const data = encoder.encode(joinedPaths);
        // Compute SHA-256 hash of the joined string
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // Convert the hash bytes to a hexadecimal string
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --------------------------------------------------------------------------------
    // Utility: Dynamically load scripts with loadjs by their paths.
    // It first generates a unique bundle ID, then loads the scripts if not already defined.
    // Finally, it executes the callback function when the scripts are ready.
    // --------------------------------------------------------------------------------
    function require(paths, callbackFn, nonce) {
        generateBundleId(paths).then(bundleId => {
            if (!loadjs.isDefined(bundleId)) {
                loadjs(paths, bundleId,
                    {
                        async: false,
                        inlineScriptNonce: nonce,
                        inlineStyleNonce: nonce
                    });
            }
            loadjs.ready([bundleId], callbackFn);
        });
    }

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzAccordion
    // This component manages the overall accordion container.
    // --------------------------------------------------------------------------------
    Alpine.data('rzAccordion', () => ({
        selected: '',
        allowMultiple: false,
        init() {
            // Set whether multiple sections can be open based on data attribute
            this.allowMultiple = this.$el.dataset.multiple === "true";
        },
        destroy() {
            // Cleanup if needed (currently empty)
        }
    }));

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzAccordionSection
    // This component controls each individual accordion section.
    // It listens for changes on the "selected" property to close the section if needed.
    // --------------------------------------------------------------------------------
    Alpine.data('rzAccordionSection', () => ({
        open: false,
        sectionId: "",
        init() {
            // Initialize open state and section identifier from element data attributes
            this.open = this.$el.dataset.isOpen === "true";
            this.sectionId = this.$el.dataset.sectionId;

            // Watch for changes in the parent "selected" value to close this section if it isn't selected
            var self = this;
            this.$watch('selected', (value, oldValue) => {
                if (value !== self.sectionId && !self.allowMultiple) {
                    self.open = false;
                }
            });
        },
        destroy() {
            // Cleanup if needed (currently empty)
        },
        // Toggle the section's open state and mark this section as selected
        toggle() {
            this.selected = this.sectionId;
            this.open = !this.open;
        },
        // Computed getter for the icon rotation class (rotates icon 180° when open)
        iconRotation() {
            return open ? "rotate-180" : "";
        }
    }));

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzDarkModeToggle
    // This component toggles between light and dark themes.
    // It reads the stored mode, applies the theme, and listens for OS-level changes.
    // --------------------------------------------------------------------------------
    Alpine.data('rzDarkModeToggle', () => ({
        mode: 'light',
        init() {
            const allowedModes = ['light', 'dark', 'auto'];
            let storedMode = localStorage.getItem('darkMode') ?? 'auto';
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Validate stored mode against allowed values
            if (!allowedModes.includes(storedMode)) {
                storedMode = 'light';
            }
            localStorage.setItem('darkMode', storedMode);

            // Function to apply the theme based on stored mode and OS preference
            const applyTheme = () => {
                document.documentElement.classList.toggle('dark',
                    storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
            };
            applyTheme();

            // Listen for OS-level color scheme changes to reapply the theme
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
        },
        // Returns true if dark mode should be active
        isDark() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var storedMode = localStorage.getItem('darkMode');
            return this.mode === 'dark' || (this.mode === 'auto' && prefersDark);
        },
        // Returns true if light mode should be active
        isLight() {
            return !this.isDark();
        },
        // Toggle the dark mode setting and dispatch a custom event
        toggle() {
            var storedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (storedMode === 'light')
                storedMode = 'dark';
            else if (storedMode === 'dark')
                storedMode = 'light';
            else if (storedMode === 'auto') {
                storedMode = prefersDark ? 'light' : 'dark';
            }

            localStorage.setItem('darkMode', storedMode);
            this.mode = storedMode;

            const isDark = storedMode === 'dark' || (storedMode === 'auto' && prefersDark);
            document.documentElement.classList.toggle('dark', isDark);

            const darkModeEvent = new CustomEvent('darkModeToggle', {
                detail: { darkMode: isDark }
            });
            window.dispatchEvent(darkModeEvent);
        }
    }));

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzAlert
    // This component manages an alert's visibility and provides a dismiss method.
    // --------------------------------------------------------------------------------
    Alpine.data('rzAlert', () => {
        return {
            showAlert: true,
            dismiss() {
                this.showAlert = false;
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzBrowser
    // This component simulates a browser preview with adjustable screen sizes.
    // --------------------------------------------------------------------------------
    Alpine.data('rzBrowser', () => {
        return {
            screenSize: '',
            setDesktopScreenSize() {
                this.screenSize = '';
            },
            setTabletScreenSize() {
                this.screenSize = 'max-w-2xl';
            },
            setPhoneScreenSize() {
                this.screenSize = 'max-w-sm';
            },
            // Return CSS classes for browser border based on screen size
            getBrowserBorderCss() {
                return [this.screenSize, this.screenSize === '' ? 'border-none' : 'border-x'];
            },
            // Return CSS classes for desktop text styling
            getDesktopScreenCss() {
                return [this.screenSize === '' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
            },
            // Return CSS classes for tablet text styling
            getTabletScreenCss() {
                return [this.screenSize === 'max-w-2xl' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
            },
            // Return CSS classes for phone text styling
            getPhoneScreenCss() {
                return [this.screenSize === 'max-w-sm' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzCheckboxGroupItem
    // Manages a checkbox's state and its associated icon visibility.
    // --------------------------------------------------------------------------------
    Alpine.data('rzCheckboxGroupItem', () => {
        return {
            checkbox: null,
            isChecked: false,
            init() {
                this.checkbox = this.$refs.chk;
                this.isChecked = this.checkbox.checked;
            },
            toggleCheckbox() {
                this.isChecked = this.checkbox.checked;
            },
            getIconCss() {
                return this.isChecked ? "" : "hidden";
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzCodeViewer
    // This component handles code display, syntax highlighting, copy-to-clipboard,
    // and expand/collapse functionality.
    // --------------------------------------------------------------------------------
    Alpine.data('rzCodeViewer', () => {
        return {
            expand: false,
            border: true,
            codeStyle: '',
            copied: false,
            init() {
                // Retrieve assets and configuration from data attributes
                const assets = JSON.parse(this.$el.dataset.assets);
                const codeId = this.$el.dataset.codeid;
                const nonce = this.$el.dataset.nonce;

                require(assets, {
                    success: function () {
                        // After assets load, highlight the code block using Highlight.js
                        const codeBlock = document.getElementById(codeId);
                        if (window.hljs && codeBlock) {
                            window.hljs.highlightElement(codeBlock);
                        }
                    },
                    error: function () {
                        console.error('Failed to load Highlight.js');
                    },
                    nonce
                });
            },
            notCopied() {
                return !this.copied;
            },
            disableCopied() {
                this.copied = false;
            },
            toggleExpand() {
                this.expand = !this.expand;
            },
            // Copy the inner text of the code block to the clipboard
            copyHTML() {
                navigator.clipboard.writeText(this.$refs.codeBlock.textContent);
                this.copied = !this.copied;
            },
            getCopiedTitle() {
                return this.copied ? 'copied' : 'copy';
            },
            getCopiedCss() {
                return [this.copied ? 'focus-visible:outline-success' : 'focus-visible:outline-on-surface-dark'];
            },
            getExpandCss() {
                return [this.expand ? '' : 'max-h-60'];
            },
            getExpandButtonCss() {
                return this.expand ? 'rotate-180' : 'rotate-0';
            },
            getExpandMaxHeightCss() {
                return [this.expand ? '' : 'max-h-[400px]', this.border ? 'border' : 'border-none', 'rounded-b'];
            },
            getBorderCss() {
                return [this.border ? 'border-b' : ''];
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzDateEdit
    // This component initializes a date picker (using Flatpickr) on an input element.
    // It retrieves its configuration and assets from data attributes.
    // --------------------------------------------------------------------------------
    Alpine.data('rzDateEdit', () => ({
        options: {},
        placeholder: '',
        prependText: '',
        init() {
            // Retrieve configuration (options, placeholder, prependText) from the element's dataset
            const cfgString = this.$el.dataset.config;
            const inputElem = document.getElementById(this.$el.dataset.uid + "-input");
            if (cfgString) {
                const parsed = JSON.parse(cfgString);
                if (parsed) {
                    this.options = parsed.options || {};
                    this.placeholder = parsed.placeholder || '';
                    this.prependText = parsed.prependText || '';
                }
            }
            // Load Flatpickr assets and initialize the date picker on the input element
            const assets = JSON.parse(this.$el.dataset.assets);
            const nonce = this.$el.dataset.nonce;

            require(assets, {
                success: function () {
                    if (window.flatpickr && inputElem) {
                        window.flatpickr(inputElem, this.options);
                    }
                },
                error: function () {
                    console.error('Failed to load Flatpickr assets.');
                },
                nonce
            });
        }
    }));

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzDropdown
    // Handles dropdown menus including open/close behavior, keyboard navigation,
    // and dynamically computing placement classes.
    // --------------------------------------------------------------------------------
    Alpine.data('rzDropdown', () => ({
        dropdownEl: null,
        anchorCss: "",
        dropdownOpen: false,
        openedWithKeyboard: false,
        init() {
            this.dropdownEl = this.$el;
            this.anchorCss = this.getAnchorCss();
        },
        toggleDropdown() {
            this.anchorCss = this.getAnchorCss();
            this.dropdownOpen = !this.dropdownOpen;
        },
        openDropdown() {
            this.anchorCss = this.getAnchorCss();
            this.dropdownOpen = true;
            this.openedWithKeyboard = false;
        },
        openWithKeyboard() {
            this.anchorCss = this.getAnchorCss();
            this.dropdownOpen = true;
            this.openedWithKeyboard = true;
            this.focusWrapNext();
        },
        closeDropdown() {
            this.dropdownOpen = false;
            this.openedWithKeyboard = false;
        },
        focusWrapNext() {
            this.$focus.wrap().next();
        },
        focusWrapPrevious() {
            this.$focus.wrap().previous();
        },
        // Computes the Tailwind CSS classes for the dropdown's anchor based on its data attribute
        getAnchorCss() {
            let defaultAnchorRaw = this.dropdownEl.getAttribute('data-anchor') || "";
            let defaultAnchor = defaultAnchorRaw.replace(/-/g, "").toLowerCase();
            // Map normalized anchor strings to Tailwind CSS class strings
            const anchorClasses = {
                "topstart": "bottom-full right-0 mb-2 origin-bottom-right",
                "topcenter": "left-1/2 bottom-full transform -translate-x-1/2 mb-2 origin-bottom",
                "topend": "bottom-full left-0 mb-2 origin-bottom-left",
                "start": "right-full top-1/2 -translate-y-1/2 me-2 origin-right",
                "end": "left-full top-1/2 -translate-y-1/2 ms-2 origin-left",
                "bottomstart": "right-0 mt-2 origin-top-right",
                "bottomcenter": "-translate-x-1/2 mt-2 origin-top",
                "bottomend": "left-0 mt-2 origin-top-left"
            };
            let cssClasses = anchorClasses[defaultAnchor] || "";
            // Measure the dropdown trigger element
            const triggerRect = this.dropdownEl.getBoundingClientRect();

            // Create a temporary container for off-screen measurement
            let tempContainer = document.createElement('div');
            tempContainer.style.cssText = "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;";
            this.dropdownEl.appendChild(tempContainer);

            // Clone the dropdown menu element (expected to have role="menu")
            const originalMenu = this.dropdownEl.querySelector('[role="menu"]');
            if (!originalMenu) {
                return cssClasses;
            }
            let clone = originalMenu.cloneNode(true);
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            clone.style.display = "block";
            tempContainer.appendChild(clone);

            // Force reflow to get dimensions
            let cloneRect = clone.getBoundingClientRect();
            tempContainer.parentNode.removeChild(tempContainer);

            const margin = 8;
            let wouldClip = false;
            if (defaultAnchor.startsWith("top")) {
                if (triggerRect.top < cloneRect.height + margin) {
                    wouldClip = true;
                }
            } else if (defaultAnchor.startsWith("bottom")) {
                if (triggerRect.bottom + cloneRect.height + margin > window.innerHeight) {
                    wouldClip = true;
                }
            } else if (defaultAnchor === "start") {
                if (triggerRect.left < cloneRect.width + margin) {
                    wouldClip = true;
                }
            } else if (defaultAnchor === "end") {
                if (triggerRect.right + cloneRect.width + margin > window.innerWidth) {
                    wouldClip = true;
                }
            }

            // If clipping is detected, use a fallback anchor mapping
            if (wouldClip) {
                const fallbackMapping = {
                    "topstart": "bottomstart",
                    "topcenter": "bottomcenter",
                    "topend": "bottomend",
                    "bottomstart": "topstart",
                    "bottomcenter": "topcenter",
                    "bottomend": "topend",
                    "start": "end",
                    "end": "start"
                };
                let fallbackAnchor = fallbackMapping[defaultAnchor] || defaultAnchor;
                cssClasses = anchorClasses[fallbackAnchor] || cssClasses;
            }
            return cssClasses;
        }
    }));

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzEmbeddedPreview
    // Manages an iframe preview and adjusts its height dynamically.
    // It also passes dark mode settings to the iframe via postMessage.
    // --------------------------------------------------------------------------------
    Alpine.data('rzEmbeddedPreview', () => {
        return {
            iframe: null,
            onDarkModeToggle: null,
            init() {
                try {
                    this.iframe = this.$refs.iframe;
                    const resize = this.debounce(() => { this.resizeIframe(this.iframe); }, 50);

                    // Resize iframe immediately and on any subsequent size changes
                    this.resizeIframe(this.iframe);

                    const resizeObserver = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            resize();
                        }
                    });
                    resizeObserver.observe(this.iframe);

                    const iframe = this.iframe;
                    this.onDarkModeToggle = (event) => {
                        iframe.contentWindow.postMessage(event.detail, '*');
                    };
                    window.addEventListener('darkModeToggle', this.onDarkModeToggle);
                } catch (error) {
                    console.error('Cannot access iframe content');
                }
            },
            // Adjusts the iframe height based on its content
            resizeIframe(iframe) {
                if (iframe) {
                    try {
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
                        if (iframeDocument) {
                            const iframeBody = iframeDocument.body;
                            if (!iframeBody) {
                                setInterval(() => { this.resizeIframe(iframe); }, 150);
                            } else {
                                const newHeight = iframeBody.scrollHeight + 15;
                                iframe.style.height = newHeight + 'px';
                            }
                        }
                    } catch (error) {
                        console.error('Error resizing iframe:', error);
                    }
                }
            },
            // Debounce helper to limit function calls
            debounce(func, timeout = 300) {
                let timer;
                return (...args) => {
                    clearTimeout(timer);
                    timer = setTimeout(() => { func.apply(this, args); }, timeout);
                };
            },
            destroy() {
                window.removeEventListener('darkModeToggle', this.onDarkModeToggle);
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzMarkdown
    // Initializes Markdown rendering with syntax highlighting.
    // --------------------------------------------------------------------------------
    Alpine.data('rzMarkdown', () => {
        return {
            init() {
                // Retrieve asset configuration from dataset attributes
                const assets = JSON.parse(this.$el.dataset.assets);
                const nonce = this.$el.dataset.nonce;

                require(assets, {
                    success: function () {
                        window.hljs.highlightAll();
                    },
                    error: function () {
                        console.error('Failed to load Highlight.js');
                    },
                    nonce
                });

            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzPrependInput
    // Adjusts the padding of an input element based on the width of a prepend element.
    // --------------------------------------------------------------------------------
    Alpine.data('rzPrependInput', () => {
        return {
            prependContainer: null,
            textInput: null,
            init() {
                // On init, measure the prepend container and adjust input padding
                this.prependContainer = this.$refs.prependContainer;
                this.textInput = this.$refs.textInput;
                let self = this;
                setTimeout(() => { self.updatePadding(); }, 50);
                // Update padding on window resize
                window.addEventListener('resize', this.updatePadding);
            },
            destroy() {
                window.removeEventListener('resize', this.updatePadding);
            },
            updatePadding() {
                // Get the width of the prepend container and apply it as left padding to the input
                const prependDiv = this.prependContainer;
                const inputElem = this.textInput;
                if (!prependDiv || !inputElem) {
                    if (inputElem) {
                        inputElem.classList.remove('text-transparent');
                    }
                    return;
                }
                const prependWidth = prependDiv.offsetWidth;
                const leftPadding = prependWidth + 10;
                inputElem.style.paddingLeft = leftPadding + 'px';
                inputElem.classList.remove('text-transparent');
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzProgress
    // Implements a progress bar with dynamic percentage calculation, ARIA attributes,
    // and methods to update, increment, or decrement progress.
    // --------------------------------------------------------------------------------
    Alpine.data('rzProgress', () => ({
        currentVal: 0,
        minVal: 0,
        maxVal: 100,
        percentage: 0,
        label: '',
        init() {
            const element = this.$el;
            // Retrieve progress values from data attributes
            this.currentVal = parseInt(element.getAttribute('data-current-val')) || 0;
            this.minVal = parseInt(element.getAttribute('data-min-val')) || 0;
            this.maxVal = parseInt(element.getAttribute('data-max-val')) || 100;
            this.label = element.getAttribute('data-label');
            // Calculate initial percentage and update ARIA attributes
            this.calculatePercentage();
            element.setAttribute('aria-valuenow', this.currentVal);
            element.setAttribute('aria-valuemin', this.minVal);
            element.setAttribute('aria-valuemax', this.maxVal);
            element.setAttribute('aria-valuetext', `${this.percentage}%`);
            this.updateProgressBar();

            const resizeObserver = new ResizeObserver(entries => {
                this.updateProgressBar();
            });
            resizeObserver.observe(element);

            // Watch for changes in currentVal to update progress dynamically
            this.$watch('currentVal', () => {
                this.calculatePercentage();
                this.updateProgressBar();
                element.setAttribute('aria-valuenow', this.currentVal);
                element.setAttribute('aria-valuetext', `${this.percentage}%`);
            });
        },
        calculatePercentage() {
            if (this.maxVal === this.minVal) {
                this.percentage = 0;
            } else {
                this.percentage = Math.min(Math.max(((this.currentVal - this.minVal) / (this.maxVal - this.minVal)) * 100, 0), 100);
            }
        },
        buildLabel() {
            var label = this.label || '{percent}%';
            this.calculatePercentage();
            return label.replace('{percent}', this.percentage);
        },
        buildInsideLabelPosition() {
            const progressBar = this.$refs.progressBar;
            const barLabel = this.$refs.progressBarLabel;
            const innerLabel = this.$refs.innerLabel;
            if (barLabel && progressBar && innerLabel) {
                innerLabel.innerText = this.buildLabel();
                if (barLabel.clientWidth > progressBar.clientWidth) {
                    barLabel.style.left = (progressBar.clientWidth + 10) + 'px';
                } else {
                    barLabel.style.left = (progressBar.clientWidth / 2 - barLabel.clientWidth / 2) + 'px';
                }
            }
        },
        getLabelCss() {
            const barLabel = this.$refs.progressBarLabel;
            const progressBar = this.$refs.progressBar;
            if (barLabel && progressBar && barLabel.clientWidth > progressBar.clientWidth) {
                return "text-on-surface dark:text-on-surface-dark";
            }
            return "";
        },
        updateProgressBar() {
            const progressBar = this.$refs.progressBar;
            if (progressBar) {
                progressBar.style.width = `${this.percentage}%`;
                this.buildInsideLabelPosition();
            }
        },
        // Methods to set, increment, or decrement the progress value
        setProgress(value) {
            this.currentVal = value;
        },
        increment(val = 1) {
            this.currentVal = Math.min(this.currentVal + val, this.maxVal);
        },
        decrement(val = 1) {
            this.currentVal = Math.max(this.currentVal - val, this.minVal);
        }
    }));

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzQuickReferenceContainer
    // Maintains a list of heading IDs for a quick-reference sidebar.
    // --------------------------------------------------------------------------------
    Alpine.data('rzQuickReferenceContainer', () => {
        return {
            headings: [],
            currentHeadingId: '',
            handleHeadingClick() {
                const id = this.$el.dataset.headingid;
                setTimeout(() => { this.currentHeadingId = id; }, 10);
            },
            setCurrentHeading(id) {
                if (this.headings.includes(id)) {
                    this.currentHeadingId = id;
                }
            },
            getSelectedCss() {
                const id = this.$el.dataset.headingid;
                return { 'font-bold': this.currentHeadingId === id };
            },
            init() {
                this.headings = JSON.parse(this.$el.dataset.headings);
                this.currentHeadingId = this.$el.dataset.currentheadingid;
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzTabs
    // Implements tabbed navigation with keyboard support and marker repositioning.
    // --------------------------------------------------------------------------------
    Alpine.data('rzTabs', () => {
        return {
            buttonRef: null,
            tabSelected: '',
            tabButton: null,
            init() {
                this.buttonRef = document.getElementById(this.$el.dataset.buttonref);
                this.tabSelected = this.$el.dataset.tabselected;
                this.tabButton = this.buttonRef.querySelector('[data-name=\'' + this.tabSelected + '\']');
                this.tabRepositionMarker(this.tabButton);
            },
            tabButtonClicked(tabButton) {
                if (tabButton instanceof Event)
                    tabButton = tabButton.target;
                this.tabSelected = tabButton.dataset.name;
                this.tabRepositionMarker(tabButton);
                tabButton.focus();
            },
            tabRepositionMarker(tabButton) {
                this.tabButton = tabButton;
                this.$refs.tabMarker.style.width = tabButton.offsetWidth + 'px';
                this.$refs.tabMarker.style.height = tabButton.offsetHeight + 'px';
                this.$refs.tabMarker.style.left = tabButton.offsetLeft + 'px';
                setTimeout(() => { this.$refs.tabMarker.style.opacity = 1; }, 150);
            },
            tabContentActive(tabContent) {
                tabContent = tabContent ?? this.$el;
                return this.tabSelected === tabContent.dataset.name;
            },
            tabButtonActive(tabButton) {
                tabButton = tabButton ?? this.$el;
                return this.tabSelected === tabButton.dataset.name;
            },
            selectedTabTextColor() {
                const color = this.$el.dataset.selectedtextcolor ?? '';
                if (this.tabButtonActive(this.$el)) {
                    return color;
                }
                return '';
            },
            handleResize() {
                this.tabRepositionMarker(this.tabButton);
            },
            handleKeyDown(event) {
                const key = event.key;
                const tabButtons = Array.from(this.buttonRef.querySelectorAll('[role=\'tab\']'));
                const currentIndex = tabButtons.findIndex(button => this.tabButtonActive(button));
                let newIndex = currentIndex;

                if (key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % tabButtons.length;
                    event.preventDefault();
                } else if (key === 'ArrowLeft') {
                    newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                    event.preventDefault();
                } else if (key === 'Home') {
                    newIndex = 0;
                    event.preventDefault();
                } else if (key === 'End') {
                    newIndex = tabButtons.length - 1;
                    event.preventDefault();
                }

                if (newIndex !== currentIndex) {
                    this.tabButtonClicked(tabButtons[newIndex]);
                }
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzSidebar
    // Controls the visibility and animation of a collapsible sidebar.
    // --------------------------------------------------------------------------------
    Alpine.data('rzSidebar', () => {
        return {
            showSidebar: false,
            isSidebarHidden() {
                return !this.showSidebar;
            },
            toggleSidebar() {
                this.showSidebar = !this.showSidebar;
            },
            hideSidebar() {
                this.showSidebar = false;
            },
            // Return translation classes based on sidebar state for smooth slide-in/out
            getSidebarTranslation() {
                return this.showSidebar ? 'translate-x-0' : '-translate-x-60';
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzSidebarLinkItem
    // Manages individual sidebar link items, including collapsible behavior.
    // --------------------------------------------------------------------------------
    Alpine.data('rzSidebarLinkItem', () => {
        return {
            isExpanded: false,
            init() {
                this.isExpanded = this.$el.dataset.expanded;
            },
            isCollapsed() {
                return !this.isExpanded;
            },
            toggleExpanded() {
                this.isExpanded = !this.isExpanded;
            },
            hideSidebar() {
                this.showSidebar = false;
            },
            // Return CSS class for icon rotation based on expansion state
            getExpandedClass() {
                return this.isExpanded ? 'rotate-180' : 'rotate-0';
            }
        };
    });

    // --------------------------------------------------------------------------------
    // Alpine.js component: rzHeading
    // Observes heading elements to automatically update the current heading in the quick-reference.
    // --------------------------------------------------------------------------------
    Alpine.data('rzHeading', () => {
        return {
            observer: null,
            init() {
                if (typeof this.setCurrentHeading === 'function') {
                    const callback = (entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                this.setCurrentHeading(this.$el.id);
                            }
                        });
                    };
                    const options = { threshold: 0.5 };
                    this.observer = new IntersectionObserver(callback, options);
                    // Begin observing the heading element
                    this.observer.observe(this.$el);
                }
            },
            destroy() {
                if (this.observer != null)
                    this.observer.disconnect();
            }
        };
    });
});

})();

// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!********************************************!*\
  !*** ./wwwroot/js/vendor/loadjs/loadjs.js ***!
  \********************************************/
(function () {
    var devnull = function () { },
        bundleIdCache = {},
        bundleResultCache = {},
        bundleCallbackQueue = {};

    /**
     * Subscribe to bundle load event.
     * @param {string[]} bundleIds - Bundle ids
     * @param {Function} callbackFn - The callback function
     */
    function subscribe(bundleIds, callbackFn) {
        // listify
        bundleIds = Array.isArray(bundleIds) ? bundleIds : [bundleIds];

        var depsNotFound = [],
            i = bundleIds.length,
            numWaiting = i,
            fn,
            bundleId,
            r,
            q;

        // define callback function
        fn = function (bundleId, pathsNotFound) {
            if (pathsNotFound.length) depsNotFound.push(bundleId);

            numWaiting--;
            if (!numWaiting) callbackFn(depsNotFound);
        };

        // register callback
        while (i--) {
            bundleId = bundleIds[i];

            // execute callback if in result cache
            r = bundleResultCache[bundleId];
            if (r) {
                fn(bundleId, r);
                continue;
            }

            // add to callback queue
            q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
            q.push(fn);
        }
    }


    /**
     * Publish bundle load event.
     * @param {string} bundleId - Bundle id
     * @param {string[]} pathsNotFound - List of files not found
     */
    function publish(bundleId, pathsNotFound) {
        if (!bundleId) return;

        var q = bundleCallbackQueue[bundleId];

        // cache result
        bundleResultCache[bundleId] = pathsNotFound;

        // exit if queue is empty
        if (!q) return;

        // empty callback queue
        while (q.length) {
            q[0](bundleId, pathsNotFound);
            q.splice(0, 1);
        }
    }


    /**
     * Execute callbacks.
     * @param {Object|Function} args - The callback args
     * @param {string[]} depsNotFound - List of dependencies not found
     */
    function executeCallbacks(args, depsNotFound) {
        // accept function as argument
        if (typeof args === 'function') args = { success: args };

        // success and error callbacks
        if (depsNotFound.length) (args.error || devnull)(depsNotFound);
        else (args.success || devnull)(args);
    }


    /**
     * Handle resource event (load/error).
     */
    function handleResourceEvent(ev, path, e, callbackFn, args, numTries, maxTries, isLegacyIECss) {
        var result = ev.type[0]; // 'l' for load, 'e' for error

        // treat empty stylesheets as failures to get around lack of onerror
        // support in IE9-11
        if (isLegacyIECss) {
            try {
                if (!e.sheet.cssText.length) result = 'e';
            } catch (x) {
                // For load errors, accessing cssText might throw
                if (x.code !== 18) result = 'e';
            }
        }

        // handle retries in case of load failure
        if (result === 'e') {
            // increment counter
            numTries += 1;

            // exit function and try again if we haven't reached maxTries
            if (numTries < maxTries) {
                return loadFile(path, callbackFn, args, numTries);
            }
        } else if (e.rel === 'preload' && e.as === 'style') {
            // activate preloaded stylesheets
            e.rel = 'stylesheet';
            return;
        }

        // execute callback
        callbackFn(path, result, ev.defaultPrevented);
    }


    /**
     * Load individual file.
     * @param {string} path - The file path
     * @param {Function} callbackFn - The callback function
     * @param {Object} args - Arguments including async, before, inlineScriptNonce, inlineStyleNonce
     * @param {number} numTries - Number of retry attempts so far
     */
    function loadFile(path, callbackFn, args, numTries) {
        var doc = document,
            async = args.async,
            maxTries = (args.numRetries || 0) + 1,
            beforeCallbackFn = args.before || devnull,
            pathname = path.replace(/[\?|#].*$/, ''),
            pathStripped = path.replace(/^(css|img|module|nomodule)!/, ''),
            isLegacyIECss,
            hasModuleSupport,
            e;

        numTries = numTries || 0;

        if (/(^css!|\.css$)/.test(pathname)) {
            // css
            e = doc.createElement('link');
            e.rel = 'stylesheet';
            e.href = pathStripped;

            // tag IE9+
            isLegacyIECss = 'hideFocus' in e;

            // use preload in IE Edge (to detect load errors)
            if (isLegacyIECss && e.relList) {
                isLegacyIECss = 0;
                e.rel = 'preload';
                e.as = 'style';
            }

            // If inlineStyleNonce provided, set it on the link tag
            if (args.inlineStyleNonce) {
                e.setAttribute('nonce', args.inlineStyleNonce);
            }

        } else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
            // image
            e = doc.createElement('img');
            e.src = pathStripped;

            // No nonce needed for images

        } else {
            // javascript
            e = doc.createElement('script');
            e.src = pathStripped;
            e.async = async === undefined ? true : async;

            // Set inlineScriptNonce if provided
            if (args.inlineScriptNonce) {
                e.setAttribute('nonce', args.inlineScriptNonce);
            }

            // handle es modules
            hasModuleSupport = 'noModule' in e;
            if (/^module!/.test(pathname)) {
                if (!hasModuleSupport) return callbackFn(path, 'l');
                e.type = "module";
            } else if (/^nomodule!/.test(pathname) && hasModuleSupport) {
                return callbackFn(path, 'l');
            }
        }

        // Event handlers
        var onEvent = function (ev) {
            handleResourceEvent(ev, path, e, callbackFn, args, numTries, maxTries, isLegacyIECss);
        };

        e.addEventListener('load', onEvent, { once: true });
        e.addEventListener('error', onEvent, { once: true });

        // add to document (unless callback returns `false`)
        if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
    }


    /**
     * Load multiple files.
     * @param {string[]} paths - The file paths
     * @param {Function} callbackFn - The callback function
     * @param {Object} args - Arguments including inlineScriptNonce, inlineStyleNonce
     */
    function loadFiles(paths, callbackFn, args) {
        // listify paths
        paths = Array.isArray(paths) ? paths : [paths];

        var numWaiting = paths.length,
            x = numWaiting,
            pathsNotFound = [];

        function fn(path, result, defaultPrevented) {
            // handle error
            if (result === 'e') pathsNotFound.push(path);

            // handle beforeload event. If defaultPrevented then that means the load
            // will be blocked (ex. Ghostery/ABP on Safari)
            if (result === 'b') {
                if (defaultPrevented) pathsNotFound.push(path);
                else return;
            }

            numWaiting--;
            if (!numWaiting) callbackFn(pathsNotFound);
        }

        for (var i = 0; i < x; i++) loadFile(paths[i], fn, args);
    }


    /**
     * Initiate script load and register bundle.
     * @param {(string|string[])} paths - The file paths
     * @param {(string|Function|Object)} [arg1] - The (1) bundleId or (2) success callback
     * @param {(Function|Object)} [arg2] - success callback or object literal
     */
    function loadjs(paths, arg1, arg2) {
        var bundleId,
            args;

        // If first argument is a string (other than an array), treat as bundleId
        if (arg1 && typeof arg1 === 'string' && arg1.trim) bundleId = arg1.trim();

        // Arguments object
        args = (bundleId ? arg2 : arg1) || {};

        // throw error if bundle is already defined
        if (bundleId) {
            if (bundleId in bundleIdCache) {
                throw "LoadJS";
            } else {
                bundleIdCache[bundleId] = true;
            }
        }

        function loadFn(resolve, reject) {
            loadFiles(paths, function (pathsNotFound) {
                // execute callbacks
                executeCallbacks(args, pathsNotFound);

                // resolve Promise if requested
                if (resolve) {
                    executeCallbacks({ success: resolve, error: reject }, pathsNotFound);
                }

                // publish bundle load event
                publish(bundleId, pathsNotFound);
            }, args);
        }

        if (args.returnPromise) return new Promise(loadFn);
        else loadFn();
    }


    /**
     * Execute callbacks when dependencies have been satisfied.
     * @param {(string|string[])} deps - List of bundle ids
     * @param {Object} args - success/error arguments
     */
    loadjs.ready = function ready(deps, args) {
        subscribe(deps, function (depsNotFound) {
            executeCallbacks(args, depsNotFound);
        });
        return loadjs;
    };


    /**
     * Manually satisfy bundle dependencies.
     * @param {string} bundleId - The bundle id
     */
    loadjs.done = function done(bundleId) {
        publish(bundleId, []);
    };


    /**
     * Reset loadjs dependencies statuses
     */
    loadjs.reset = function reset() {
        bundleIdCache = {};
        bundleResultCache = {};
        bundleCallbackQueue = {};
    };


    /**
     * Determine if bundle has already been defined
     * @param {String} bundleId - The bundle id
     */
    loadjs.isDefined = function isDefined(bundleId) {
        return bundleId in bundleIdCache;
    };

    // export
    window.loadjs = loadjs;
})();
})();

/******/ })()
;
//# sourceMappingURL=rizzyui.js.map