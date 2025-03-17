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