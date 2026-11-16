import loadjs from '../lib/loadjs/loadjs.js';

async function generateBundleId(paths) {
    const normalized = [...paths].sort();
    const joinedPaths = normalized.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(joinedPaths);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Accepts asset entries as URL strings or `{ src, integrity }` objects (as RizzyUI components
 * render them) and returns the URLs plus a URL-to-integrity map.
 * @param {Array<string | { src: string, integrity?: string }>} entries
 */
function normalizeAssets(entries) {
    const files = [];
    const integrity = new Map();
    for (const entry of entries) {
        if (typeof entry === 'string') {
            if (entry) files.push(entry);
        } else if (entry && typeof entry.src === 'string' && entry.src) {
            files.push(entry.src);
            if (typeof entry.integrity === 'string' && entry.integrity) {
                integrity.set(entry.src, entry.integrity);
            }
        }
    }
    return { files, integrity };
}

function rizzyRequire(paths, callbackOrNonce, nonce) {
    let callbackObject;
    let csp;

    if (typeof callbackOrNonce === 'function') {
        callbackObject = { success: callbackOrNonce };
    } else if (callbackOrNonce && typeof callbackOrNonce === 'object') {
        callbackObject = callbackOrNonce;
    } else if (typeof callbackOrNonce === 'string') {
        csp = callbackOrNonce;
    }

    if (!csp && typeof nonce === 'string') {
        csp = nonce;
    }

    const { files, integrity } = normalizeAssets(Array.isArray(paths) ? paths : [paths]);

    return generateBundleId(files).then(bundleId => {
        if (!loadjs.isDefined(bundleId)) {
            loadjs(files, bundleId, {
                async: false,
                inlineScriptNonce: csp,
                inlineStyleNonce: csp,
                before: (path, element) => {
                    const hash = integrity.get(path);
                    if (hash) {
                        element.integrity = hash;
                        element.crossOrigin = 'anonymous';
                    }
                },
            });
        }

        return new Promise((resolve, reject) => {
            loadjs.ready(bundleId, {
                success: () => {
                    try {
                        if (callbackObject && typeof callbackObject.success === 'function') {
                            callbackObject.success();
                        }
                    } catch (error) {
                        console.error('[rizzyRequire] success callback threw:', error);
                    }
                    resolve({ bundleId });
                },
                error: depsNotFound => {
                    try {
                        if (callbackObject && typeof callbackObject.error === 'function') {
                            callbackObject.error(depsNotFound);
                        }
                    } catch (error) {
                        console.error('[rizzyRequire] error callback threw:', error);
                    }

                    reject(new Error(
                        `[rizzyRequire] Failed to load bundle ${bundleId} (missing: ${Array.isArray(depsNotFound) ? depsNotFound.join(', ') : String(depsNotFound)})`,
                    ));
                },
            });
        });
    });
}

export { rizzyRequire as require };
