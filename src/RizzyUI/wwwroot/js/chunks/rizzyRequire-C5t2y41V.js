//#region src/js/lib/loadjs/loadjs.js
var devnull = function() {}, bundleIdCache = {}, bundleResultCache = {}, bundleCallbackQueue = {};
/**
* Subscribe to bundle load event.
* @param {string[]} bundleIds - Bundle ids
* @param {Function} callbackFn - The callback function
*/
function subscribe(bundleIds, callbackFn) {
	bundleIds = Array.isArray(bundleIds) ? bundleIds : [bundleIds];
	const depsNotFound = [];
	let i = bundleIds.length, numWaiting = i, fn, bundleId, r, q;
	fn = function(bundleId, pathsNotFound) {
		if (pathsNotFound.length) depsNotFound.push(bundleId);
		numWaiting--;
		if (!numWaiting) callbackFn(depsNotFound);
	};
	while (i--) {
		bundleId = bundleIds[i];
		r = bundleResultCache[bundleId];
		if (r) {
			fn(bundleId, r);
			continue;
		}
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
	bundleResultCache[bundleId] = pathsNotFound;
	if (!q) return;
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
	if (typeof args === "function") args = { success: args };
	if (depsNotFound.length) (args.error || devnull)(depsNotFound);
	else (args.success || devnull)(args);
}
/**
* Handle resource event (load/error).
*/
function handleResourceEvent(ev, path, e, callbackFn, args, numTries, maxTries, isLegacyIECss) {
	let result = ev.type[0];
	if (isLegacyIECss) try {
		if (!e.sheet.cssText.length) result = "e";
	} catch (x) {
		if (x.code !== 18) result = "e";
	}
	if (result === "e") {
		numTries += 1;
		if (numTries < maxTries) return loadFile(path, callbackFn, args, numTries);
	} else if (e.rel === "preload" && e.as === "style") {
		e.rel = "stylesheet";
		return;
	}
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
	const doc = document, async = args.async, maxTries = (args.numRetries || 0) + 1, beforeCallbackFn = args.before || devnull, pathname = path.replace(/[\?|#].*$/, ""), pathStripped = path.replace(/^(css|img|module|nomodule)!/, "");
	let isLegacyIECss, hasModuleSupport, e;
	numTries = numTries || 0;
	if (/(^css!|\.css$)/.test(pathname)) {
		e = doc.createElement("link");
		e.rel = "stylesheet";
		e.href = pathStripped;
		isLegacyIECss = "hideFocus" in e;
		if (isLegacyIECss && e.relList) {
			isLegacyIECss = 0;
			e.rel = "preload";
			e.as = "style";
		}
		if (args.inlineStyleNonce) e.setAttribute("nonce", args.inlineStyleNonce);
	} else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
		e = doc.createElement("img");
		e.src = pathStripped;
	} else {
		e = doc.createElement("script");
		e.src = pathStripped;
		e.async = async === void 0 ? true : async;
		if (args.inlineScriptNonce) e.setAttribute("nonce", args.inlineScriptNonce);
		hasModuleSupport = "noModule" in e;
		if (/^module!/.test(pathname)) {
			if (!hasModuleSupport) return callbackFn(path, "l");
			e.type = "module";
		} else if (/^nomodule!/.test(pathname) && hasModuleSupport) return callbackFn(path, "l");
	}
	const onEvent = function(ev) {
		handleResourceEvent(ev, path, e, callbackFn, args, numTries, maxTries, isLegacyIECss);
	};
	e.addEventListener("load", onEvent, { once: true });
	e.addEventListener("error", onEvent, { once: true });
	if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
}
/**
* Load multiple files.
* @param {string[]} paths - The file paths
* @param {Function} callbackFn - The callback function
* @param {Object} args - Arguments including inlineScriptNonce, inlineStyleNonce
*/
function loadFiles(paths, callbackFn, args) {
	paths = Array.isArray(paths) ? paths : [paths];
	let numWaiting = paths.length, pathsNotFound = [];
	function fn(path, result, defaultPrevented) {
		if (result === "e") pathsNotFound.push(path);
		if (result === "b") if (defaultPrevented) pathsNotFound.push(path);
		else return;
		numWaiting--;
		if (!numWaiting) callbackFn(pathsNotFound);
	}
	for (let i = 0; i < paths.length; i++) loadFile(paths[i], fn, args);
}
/**
* Initiate script load and register bundle.
* @param {(string|string[])} paths - The file paths
* @param {(string|Function|Object)} [arg1] - The (1) bundleId or (2) success callback
* @param {(Function|Object)} [arg2] - success callback or object literal
*/
function loadjs(paths, arg1, arg2) {
	let bundleId, args;
	if (arg1 && typeof arg1 === "string" && arg1.trim) bundleId = arg1.trim();
	args = (bundleId ? arg2 : arg1) || {};
	if (bundleId) if (bundleId in bundleIdCache) throw "LoadJS";
	else bundleIdCache[bundleId] = true;
	function loadFn(resolve, reject) {
		loadFiles(paths, function(pathsNotFound) {
			executeCallbacks(args, pathsNotFound);
			if (resolve) executeCallbacks({
				success: resolve,
				error: reject
			}, pathsNotFound);
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
	subscribe(deps, function(depsNotFound) {
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
	Object.keys(bundleIdCache).forEach((key) => delete bundleIdCache[key]);
	Object.keys(bundleResultCache).forEach((key) => delete bundleResultCache[key]);
	Object.keys(bundleCallbackQueue).forEach((key) => delete bundleCallbackQueue[key]);
};
/**
* Determine if bundle has already been defined
* @param {string} bundleId - The bundle id
*/
loadjs.isDefined = function isDefined(bundleId) {
	return bundleId in bundleIdCache;
};
//#endregion
//#region src/js/runtime/rizzyRequire.js
async function generateBundleId(paths) {
	const joinedPaths = [...paths].sort().join("|");
	const data = new TextEncoder().encode(joinedPaths);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function rizzyRequire(paths, callbackOrNonce, nonce) {
	let callbackObject;
	let csp;
	if (typeof callbackOrNonce === "function") callbackObject = { success: callbackOrNonce };
	else if (callbackOrNonce && typeof callbackOrNonce === "object") callbackObject = callbackOrNonce;
	else if (typeof callbackOrNonce === "string") csp = callbackOrNonce;
	if (!csp && typeof nonce === "string") csp = nonce;
	const files = Array.isArray(paths) ? paths : [paths];
	return generateBundleId(files).then((bundleId) => {
		if (!loadjs.isDefined(bundleId)) loadjs(files, bundleId, {
			async: false,
			inlineScriptNonce: csp,
			inlineStyleNonce: csp
		});
		return new Promise((resolve, reject) => {
			loadjs.ready(bundleId, {
				success: () => {
					try {
						if (callbackObject && typeof callbackObject.success === "function") callbackObject.success();
					} catch (error) {
						console.error("[rizzyRequire] success callback threw:", error);
					}
					resolve({ bundleId });
				},
				error: (depsNotFound) => {
					try {
						if (callbackObject && typeof callbackObject.error === "function") callbackObject.error(depsNotFound);
					} catch (error) {
						console.error("[rizzyRequire] error callback threw:", error);
					}
					reject(/* @__PURE__ */ new Error(`[rizzyRequire] Failed to load bundle ${bundleId} (missing: ${Array.isArray(depsNotFound) ? depsNotFound.join(", ") : String(depsNotFound)})`));
				}
			});
		});
	});
}
//#endregion
export { rizzyRequire as t };

//# sourceMappingURL=rizzyRequire-C5t2y41V.js.map