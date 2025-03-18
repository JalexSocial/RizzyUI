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
                // Parse the raw HTML string into an HTMLDocument
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");

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
                    if (nonce === newScriptNonce) {
                        // Update the nonce attribute if it matches the existing one
                        elt.setAttribute("nonce", documentNonce);
                    } else {
                        // Remove the element if the nonce doesn't match (or is missing)
                        elt.remove();
                    }
                });

                // Serialize the document back into an HTML string and return it
                return doc.documentElement.outerHTML;
            }
        });

    document.__htmx_noncehandler = true;
}