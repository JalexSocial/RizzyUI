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

    const files = Array.isArray(paths) ? paths : [paths];

    return generateBundleId(files).then(bundleId => {
        if (!loadjs.isDefined(bundleId)) {
            loadjs(files, bundleId, {
                async: false,
                inlineScriptNonce: csp,
                inlineStyleNonce: csp,
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
