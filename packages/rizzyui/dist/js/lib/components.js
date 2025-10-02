
import loadjs from "./loadjs/loadjs.js";
import $data from './alpineData.js';

// Import component registration functions
import registerRzAccordion from './components/rzAccordion.js';
import registerAccordionItem from './components/accordionItem.js';
import registerRzAlert from './components/rzAlert.js';
import registerRzAspectRatio from './components/rzAspectRatio.js';
import registerRzBrowser from './components/rzBrowser.js';
import registerRzCarousel from './components/rzCarousel.js';
import registerRzCheckboxGroupItem from './components/rzCheckboxGroupItem.js';
import registerRzCodeViewer from './components/rzCodeViewer.js';
import registerRzCollapsible from './components/rzCollapsible.js';
import registerRzDateEdit from './components/rzDateEdit.js';
import registerRzDropdownMenu from './components/rzDropdownMenu.js';
import registerRzDarkModeToggle from './components/rzDarkModeToggle.js';
import registerRzEmbeddedPreview from './components/rzEmbeddedPreview.js';
import registerRzEmpty from './components/rzEmpty.js';
import registerRzHeading from './components/rzHeading.js';
import registerRzIndicator from './components/rzIndicator.js';
import registerRzMarkdown from './components/rzMarkdown.js';
import registerRzModal from './components/rzModal.js';
import registerRzNavigationMenu from './components/rzNavigationMenu.js';
import registerRzPopover from './components/rzPopover.js';
import registerRzPrependInput from './components/rzPrependInput.js';
import registerRzProgress from './components/rzProgress.js';
import registerRzQuickReferenceContainer from './components/rzQuickReferenceContainer.js';
import registerRzSheet from './components/rzSheet.js';
import registerRzTabs from './components/rzTabs.js';
import registerRzSidebar from './components/rzSidebar.js';

/**
 * generateBundleId(paths)
 * - Sorts the given array of script paths so the same set produces a consistent ID.
 * - Joins the paths into a single string and computes a SHA-256 hash.
 * - Returns the hash as a lowercase hexadecimal string, which can be used as a bundle ID.
 *
 * @param {string[]} paths - Array of script or asset paths
 * @returns {Promise<string>} Promise that resolves to a unique, deterministic bundle ID
 */
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

/**
 * rizzyRequire(paths, [callbackOrNonce], [nonce])
 * - If a function is passed as 2nd arg, it behaves like your current callback API.
 * - If no callback is provided, it RETURNS A PROMISE that resolves when the bundle is ready.
 * - The CSP nonce can be provided as the 2nd arg (string) or 3rd arg when using a callback.
 *
 * @param {string|string[]} paths
 * @param {Function|string} [callbackOrNonce] - callback OR nonce (when using Promise style)
 * @param {string} [nonce] - CSP nonce (when using callback style)
 * @returns {Promise<{bundleId:string}>} Promise is always returned; you can ignore it in callback style.
 */
async function rizzyRequire(paths, callbackOrNonce, nonce) {
    // Support overload: (paths, nonce) => Promise
    let callbackFn = typeof callbackOrNonce === 'function' ? callbackOrNonce : undefined;
    const cspNonce = (typeof callbackOrNonce === 'string' && !nonce) ? callbackOrNonce : nonce;

    // Create a deterministic bundle id for this set of paths
    const bundleId = await generateBundleId(paths);

    // If not yet requested, kick off the load (publish happens inside loadjs)
    if (!loadjs.isDefined(bundleId)) {
        loadjs(paths, bundleId, {
            async: false,
            inlineScriptNonce: cspNonce,
            inlineStyleNonce:  cspNonce
            // Note: We DO NOT rely on loadjs's returnPromise here because
            // the bundle may already be in-flight. We unify everything through ready().
        });
    }

    // Wait for the bundle using loadjs.ready (works whether already loading or already done)
    const p = new Promise((resolve, reject) => {
        loadjs.ready([bundleId], {
            success: () => resolve({ bundleId }),
            error:   (depsNotFound) =>
                reject(new Error(`rizzyRequire: failed to load: ${depsNotFound.join(', ')}`))
        });
    });

    // If a callback was provided, also call it (and surface errors to console)
    if (callbackFn) {
        p.then(() => callbackFn()).catch(err => {
            // Don't swallow errors in callback mode; log them.
            console.error(err);
        });
    }

    // Always return the Promise (back-compat callers can ignore it)
    return p;
}

function registerComponents(Alpine) {
    registerRzAccordion(Alpine);
    registerAccordionItem(Alpine);
    registerRzAlert(Alpine);
    registerRzAspectRatio(Alpine);
    registerRzBrowser(Alpine);
    registerRzCarousel(Alpine, rizzyRequire);
    registerRzCheckboxGroupItem(Alpine);
    registerRzCodeViewer(Alpine, rizzyRequire);
    registerRzCollapsible(Alpine);
    registerRzDateEdit(Alpine, rizzyRequire);
    registerRzDropdownMenu(Alpine);
    registerRzDarkModeToggle(Alpine);
    registerRzEmbeddedPreview(Alpine);
    registerRzEmpty(Alpine);
    registerRzHeading(Alpine);
    registerRzIndicator(Alpine);
    registerRzMarkdown(Alpine, rizzyRequire);
    registerRzNavigationMenu(Alpine, $data);
    registerRzModal(Alpine);
    registerRzPopover(Alpine);
    registerRzPrependInput(Alpine);
    registerRzProgress(Alpine);
    registerRzQuickReferenceContainer(Alpine);
    registerRzSheet(Alpine);
    registerRzTabs(Alpine);
    registerRzSidebar(Alpine);
}

export { registerComponents, rizzyRequire as require };