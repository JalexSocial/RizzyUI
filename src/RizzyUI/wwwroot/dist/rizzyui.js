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
            const blazorSsrElement = this.parentNode

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
            })

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
                            swap(element, container.outerHTML, swapSpec);

                            // The very first swap into the container can be a replacement swap
                            swapSpec.swapStyle = "innerHTML";

                            // Ensure there is always a container even if not added to the dom
                            container = document.getElementById(cid) ?? container;
                        }

                        // Compute any new html in this chunk
                        diff = e.currentTarget.response.substring(last);
                        swap(container, diff, swapSpec);

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

    function blazorSwapSsr(start, end, docFrag) {
        var newDiv = wrap(start, end, 'ssr' + crypto.randomUUID());

        var container = document.createElement('div');
        container.appendChild(docFrag);

        swap(newDiv, container.innerHTML);

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
    function swap(elt, content, swapSpec) {

        api.withExtensions(elt, function (extension) {
            content = extension.transformResponse(content, null, elt);
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

    // Based on safe-nonce by Michael West
    htmx.defineExtension('rizzy-nonce', {
        transformResponse: function (text, xhr, elt) {

            text = text.replace(/ignore:rizzy-nonce/g, ''); // Remove attempts to ignore rizzy-nonce

            // If the document Nonce isn't available we can't inject it
            if (!htmx.config.documentNonce)
                return text;

            htmx.config.refreshOnHistoryMiss = true; // disable ajax fetching on history miss because it doesn't handle nonce replacment

            let nonce = xhr.getResponseHeader('HX-Nonce');
            if (!nonce) {
                const csp = xhr.getResponseHeader('content-security-policy')
                if (csp) {
                    const cspMatch = csp.match(/(style|script)-src[^;]*'nonce-([^']*)'/i)
                    if (cspMatch) {
                        nonce = cspMatch[2];
                    }
                }
            }
            if (window.location.hostname) {
                const responseURL = new URL(xhr.responseURL);
                if (responseURL.hostname !== window.location.hostname) {
                    nonce = ''; // ignore nonce header if request is not some domain 
                }
            }

            let replaceRegex = new RegExp(`<script(\\s[^>]*>|>).*?<\\/script(\\s[^>]*>|>)`, 'gis') // remove all script tags regex

            if (nonce) { // if nonce is valid then change regex to remove all scripts without this nonce
                replaceRegex = new RegExp(`<script(\\s(?!nonce="${nonce.replace(/[\\\[\]\/^*.+?$(){}'#:!=|]/g, '\\$&')}")[^>]*>|>).*?<\\/script(\\s[^>]*>|>)`, 'gis')
            }

            return text.replace(replaceRegex, ''); // remove script tags and strip ignore extension
        },
        onEvent: function (name, evt) {
            if (name === 'htmx:load') {
                Array.from(evt.detail.elt.querySelectorAll('script')).forEach((script) => {
                    if (script.nonce !== htmx.config.inlineScriptNonce) {
                        script.remove(); // remove all scripts with invalid nonce from page loaded content so it can't get saved in history where inlineScriptNonce can enable bad scripts
                    }
                });
                Array.from(evt.detail.elt.querySelectorAll(
                    '[hx-ext*="ignore:rizzy-nonce"], [data-hx-ext*="ignore:rizzy-nonce"]')).forEach((elt) => {
                    elt.remove(); // remove content that tries to disable rizzy-nonce extension
                });
            }
        }
    })

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

        try {

            let v = new aspnetValidation.ValidationService();
            v.bootstrap({ watch: true });

            window.validation = v;
        } catch (error) {
            console.log("error: aspnetValidation is not available");
        }

        Alpine.data('rzAccordion', () => ({
            selected: '',
            allowMultiple: false,
            init() {
                this.allowMultiple = this.$el.dataset.multiple === "true";
            },
            destroy() {

            }
        }));

        Alpine.data('rzAccordionSection', () => ({
            open: false,
            sectionId: "",
            init() {
                this.open = this.$el.dataset.isOpen === "true";
                this.sectionId = this.$el.dataset.sectionId;

                var self = this;
                this.$watch('selected', (value, oldValue) => {
                    if (value !== self.sectionId && !self.allowMultiple) {
                        self.open = false;
                    }
                })
            },
            destroy() {

            },
            toggle() {
                this.selected = this.sectionId;
                this.open = !this.open;
            },
            // Computed getter for the icon rotation class.
            iconRotation() {
                return open ? "rotate-180" : "";
            }

        }));

        Alpine.data('rzDarkModeToggle', () => ({

            mode: 'light',

            init() {
                const allowedModes = ['light', 'dark', 'auto'];

                let storedMode = localStorage.getItem('darkMode') ?? 'auto';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (!allowedModes.includes(storedMode)) {
                    storedMode = 'light';
                }

                localStorage.setItem('darkMode', storedMode);

                const applyTheme = () => {
                    document.documentElement.classList.toggle('dark',
                        storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
                };

                applyTheme();

                // Reapply theme on OS-level changes to the color scheme
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
            },

            // Getter properties used by the Razor markup
            isDark() {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var storedMode = localStorage.getItem('darkMode');

                return this.mode === 'dark' || (this.mode === 'auto' && prefersDark);
            },
            isLight() {
                return !this.isDark();
            },

            toggle() {
                var storedMode = localStorage.getItem('darkMode');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (storedMode === 'light')
                    storedMode = 'dark';
                else if (storedMode === 'dark')
                    storedMode = 'light';
                else if (storedMode === 'auto') {
                    if (prefersDark)
                        storedMode = 'light';
                    else
                        storedMode = 'dark';
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

        Alpine.data('rzAlert',
            () => {
                return {
                    showAlert: true,

                    dismiss() {
                        this.showAlert = false;
                    }
                }
            });

        Alpine.data('rzBrowser',
            () => {
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

                    getBrowserBorderCss() {
                        return [this.screenSize, this.screenSize === '' ? 'border-none' : 'border-x'];
                    },

                    getDesktopScreenCss() {
                        return [this.screenSize === '' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60' ];
                    },

                    getTabletScreenCss() {
                        return [ this.screenSize === 'max-w-2xl' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60' ];
                    },

                    getPhoneScreenCss() {
                        return [ this.screenSize === 'max-w-sm' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
                    }
                }
            });

        Alpine.data('rzCheckboxGroupItem',
            () => {
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
                }
            });

        Alpine.data('rzCodeViewer',
            () => {
                return {
                    expand: false,
                    border: true,
                    codeStyle: '',
                    copied: false,
                    init() {
                        // Retrieve the assets from the dataset
                        const assets = JSON.parse(this.$el.dataset.assets);
                        const codeId = this.$el.dataset.codeid;
                        const scriptNonce = this.$el.dataset.scriptnonce;
                        const styleNonce = this.$el.dataset.stylenonce;

                        loadjs(assets, {
                            success: () => {
                                // Ensure Highlight.js styles are applied after the script loads
                                const codeBlock = document.getElementById(codeId);

                                if (window.hljs && codeBlock) {
                                    window.hljs.highlightElement(codeBlock);
                                }
                            },
                            error: () => {
                                console.error('Failed to load Highlight.js');
                            },
                            async: false,
                            inlineScriptNonce: scriptNonce,
                            inlineStyleNonce: styleNonce
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
                }
            });

        Alpine.data('rzDateEdit', () => ({
            options: {},
            placeholder: '',
            prependText: '',
            init() {
                // Retrieve configuration from dataset
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

                // Load any needed assets
                const assets = JSON.parse(this.$el.dataset.assets);
                const scriptNonce = this.$el.dataset.scriptnonce;
                const styleNonce = this.$el.dataset.stylenonce;

                loadjs(assets, {
                    success: () => {
                        // Once loaded, initialize Flatpickr on the target input
                        if (window.flatpickr && inputElem) {
                            window.flatpickr(inputElem, this.options);
                        }
                    },
                    error: () => {
                        console.error('Failed to load Flatpickr assets.');
                    },
                    async: false,
                    inlineScriptNonce: scriptNonce,
                    inlineStyleNonce: styleNonce
                });
            }
        }));

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
        getAnchorCss() {
            let defaultAnchorRaw = this.dropdownEl.getAttribute('data-anchor') || "";
            let defaultAnchor = defaultAnchorRaw.replace(/-/g, "").toLowerCase();

            // Mapping from normalized anchor string to Tailwind CSS classes.
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

            // Get the trigger element’s bounding rectangle.
            const triggerRect = this.dropdownEl.getBoundingClientRect();

            // --- Off-screen measurement ---
            // Create a temporary container (preserving layout context) as a child of the dropdown.
            let tempContainer = document.createElement('div');
            tempContainer.style.cssText =
                "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;";
            this.dropdownEl.appendChild(tempContainer);

            // Clone the dropdown menu element (with role="menu")
            const originalMenu = this.dropdownEl.querySelector('[role="menu"]');
            if (!originalMenu) {
                // If no menu is found, simply return the default classes.
                return cssClasses;
            }
            let clone = originalMenu.cloneNode(true);
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            // Ensure the clone is rendered as block.
            clone.style.display = "block";
            // Append the clone to the temporary container.
            tempContainer.appendChild(clone);

            // Force a reflow by reading the bounding rect.
            let cloneRect = clone.getBoundingClientRect();
            tempContainer.parentNode.removeChild(tempContainer);

            // Use a small margin as spacing.
            const margin = 8;

            // Determine if the default placement would clip the dropdown.
            let wouldClip = false;
            if (defaultAnchor.startsWith("top")) {
                // Dropdown appears above trigger.
                if (triggerRect.top < cloneRect.height + margin) {
                    wouldClip = true;
                }
            } else if (defaultAnchor.startsWith("bottom")) {
                // Dropdown appears below trigger.
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

            // If clipping is detected, select a fallback anchor.
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

            // Store and return the final class string.
            return cssClasses;
        }

        }));

        Alpine.data('rzEmbeddedPreview', () => {
            return {
                iframe: null,
                onDarkModeToggle: null,
                init() {
                    try {
                        this.iframe = this.$refs.iframe;
                        const resize = this.debounce(() => { this.resizeIframe(this.iframe); }, 50);

                        // If init is called after the iframe loads, make sure we still resize the iframe
                        this.resizeIframe(this.iframe);

                        // observe any changes in size to the iframe
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
            }
        });

    Alpine.data('rzMarkdown',
        () => {
            return {
                init() {
                    // Retrieve the assets from the dataset
                    const assets = JSON.parse(this.$el.dataset.assets);
                    const scriptNonce = this.$el.dataset.scriptnonce;
                    const styleNonce = this.$el.dataset.stylenonce;

                    loadjs(assets, {
                        success: () => {
                            window.hljs.highlightAll();
                        },
                        error: () => {
                            console.error('Failed to load Highlight.js');
                        },
                        async: false,
                        inlineScriptNonce: scriptNonce,
                        inlineStyleNonce: styleNonce
                    });
                },
            }
        });

    Alpine.data('rzPrependInput', () => {

            return {
                prependContainer: null,
                textInput: null,
                init() {
                    // On component init, measure the prepend container's width
                    // and apply that as padding to the text input.
                    this.prependContainer = this.$refs.prependContainer;
                    this.textInput = this.$refs.textInput;

                    let self = this;

                    setTimeout(() => { self.updatePadding(); }, 50);

                    // If you'd like the padding to adapt if the user resizes the window:
                    window.addEventListener('resize', this.updatePadding);
                },

                destroy() {
                    // Clean up the event listener when this component is removed
                    window.removeEventListener('resize', this.updatePadding);
                },

                updatePadding() {
                    // Using x-ref to find the prepend container and the actual text input
                    const prependDiv = this.prependContainer;
                    const inputElem = this.textInput;

                    if (!prependDiv || !inputElem) {
                        if (inputElem) {
                            inputElem.classList.remove('text-transparent');
                        }
                        return;
                    }

                    // Get the rendered width of the prepend container (in px).
                    const prependWidth = prependDiv.offsetWidth;

                    // Optionally add a small buffer to keep text from hugging the border:
                    const leftPadding = prependWidth + 10;

                    // Apply inline style on the input to exactly match that width
                    inputElem.style.paddingLeft = leftPadding + 'px';
                    inputElem.classList.remove('text-transparent');
                }
            };
        });

        Alpine.data('rzProgress', () => ({
            currentVal: 0,
            minVal: 0,
            maxVal: 100,
            percentage: 0,
            label: '',

            init() {
                const element = this.$el;

                // Retrieve data attributes from the root element
                this.currentVal = parseInt(element.getAttribute('data-current-val')) || 0;
                this.minVal = parseInt(element.getAttribute('data-min-val')) || 0;
                this.maxVal = parseInt(element.getAttribute('data-max-val')) || 100;
                this.label = element.getAttribute('data-label');

                // Calculate initial percentage
                this.calculatePercentage();

                // Update ARIA attributes
                element.setAttribute('aria-valuenow', this.currentVal);
                element.setAttribute('aria-valuemin', this.minVal);
                element.setAttribute('aria-valuemax', this.maxVal);
                element.setAttribute('aria-valuetext', `${this.percentage}%`);

                // Set the width of the progress bar
                this.updateProgressBar();

                const resizeObserver = new ResizeObserver(entries => {
                    this.updateProgressBar();
                });

                resizeObserver.observe(element);

                // Listen for custom events to update progress
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

            // Method to update progress value
            setProgress(value) {
                this.currentVal = value;
            },

            // Method to increment progress value
            increment(val = 1) {
                this.currentVal = Math.min(this.currentVal + val, this.maxVal);
            },

            // Method to decrement progress value
            decrement(val = 1) {
                this.currentVal = Math.max(this.currentVal - val, this.minVal);
            }
        }));

        Alpine.data('rzQuickReferenceContainer',
            () => {
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
                }
            });

        Alpine.data('rzTabs',
            () => {
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
                    tabRepositionMarker(tabButton){
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
                    handleKeyDown(event){
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
            }
            });

        Alpine.data('rzSidebar',
            () => {
                return {
                    showSidebar: false,

                    isSidebarHidden() { return !this.showSidebar; },

                    toggleSidebar() { this.showSidebar = !this.showSidebar; },

                    hideSidebar() { this.showSidebar = false; },

                    getSidebarTranslation() {
                        return this.showSidebar ? 'translate-x-0' : '-translate-x-60';
                    }
                }
            });

        Alpine.data('rzSidebarLinkItem',
            () => {
                return {
                    isExpanded: false,

                    init() {
                        this.isExpanded = this.$el.dataset.expanded;
                    },

                    isCollapsed() { return !this.isExpanded; },

                    toggleExpanded() { this.isExpanded = !this.isExpanded; },

                    hideSidebar() { this.showSidebar = false; },

                    getExpandedClass() {
                        return this.isExpanded ? 'rotate-180' : 'rotate-0';
                    }
                }
            });

        Alpine.data('rzHeading',
            () => {
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

                            // Start observing the element
                            this.observer.observe(this.$el);
                        }
                    },

                    destroy() {
                        if (this.observer != null)
                            this.observer.disconnect();
                    }
                }
            });

})
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