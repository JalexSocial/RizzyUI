// loadjs.js

const devnull = function () {},
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

    const depsNotFound = [];
    let i = bundleIds.length,
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

    const q = bundleCallbackQueue[bundleId];

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
    let result = ev.type[0]; // 'l' for load, 'e' for error

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
    const doc = document,
        async = args.async,
        maxTries = (args.numRetries || 0) + 1,
        beforeCallbackFn = args.before || devnull,
        pathname = path.replace(/[\?|#].*$/, ''),
        pathStripped = path.replace(/^(css|img|module|nomodule)!/, '');
    let isLegacyIECss,
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

        if (args.inlineStyleNonce) {
            e.setAttribute('nonce', args.inlineStyleNonce);
        }

    } else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
        // image
        e = doc.createElement('img');
        e.src = pathStripped;

    } else {
        // javascript
        e = doc.createElement('script');
        e.src = pathStripped;
        e.async = async === undefined ? true : async;

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
    const onEvent = function (ev) {
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

    let numWaiting = paths.length,
        pathsNotFound = [];

    function fn(path, result, defaultPrevented) {
        if (result === 'e') pathsNotFound.push(path);
        if (result === 'b') {
            if (defaultPrevented) pathsNotFound.push(path);
            else return;
        }

        numWaiting--;
        if (!numWaiting) callbackFn(pathsNotFound);
    }

    for (let i = 0; i < paths.length; i++) {
        loadFile(paths[i], fn, args);
    }
}

/**
 * Initiate script load and register bundle.
 * @param {(string|string[])} paths - The file paths
 * @param {(string|Function|Object)} [arg1] - The (1) bundleId or (2) success callback
 * @param {(Function|Object)} [arg2] - success callback or object literal
 */
function loadjs(paths, arg1, arg2) {
    let bundleId,
        args;

    if (arg1 && typeof arg1 === 'string' && arg1.trim) {
        bundleId = arg1.trim();
    }

    args = (bundleId ? arg2 : arg1) || {};

    if (bundleId) {
        if (bundleId in bundleIdCache) {
            throw "LoadJS";
        } else {
            bundleIdCache[bundleId] = true;
        }
    }

    function loadFn(resolve, reject) {
        loadFiles(paths, function (pathsNotFound) {
            executeCallbacks(args, pathsNotFound);
            if (resolve) {
                executeCallbacks({ success: resolve, error: reject }, pathsNotFound);
            }
            publish(bundleId, pathsNotFound);
        }, args);
    }

    if (args.returnPromise) {
        return new Promise(loadFn);
    } else {
        loadFn();
    }
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
    // Reset caches
    Object.keys(bundleIdCache).forEach(key => delete bundleIdCache[key]);
    Object.keys(bundleResultCache).forEach(key => delete bundleResultCache[key]);
    Object.keys(bundleCallbackQueue).forEach(key => delete bundleCallbackQueue[key]);
};

/**
 * Determine if bundle has already been defined
 * @param {string} bundleId - The bundle id
 */
loadjs.isDefined = function isDefined(bundleId) {
    return bundleId in bundleIdCache;
};

export default loadjs;
