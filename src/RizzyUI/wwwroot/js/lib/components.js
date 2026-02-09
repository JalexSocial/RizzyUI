
// packages/rizzyui/src/js/lib/components.js
import loadjs from "./loadjs/loadjs.js";
import $data from './alpineData.js';

// Import component registration functions
import registerRzAccordion from './components/rzAccordion.js';
import registerAccordionItem from './components/accordionItem.js';
import registerRzAlert from './components/rzAlert.js';
import registerRzAspectRatio from './components/rzAspectRatio.js';
import registerRzBrowser from './components/rzBrowser.js';
import registerRzCalendar from './components/rzCalendar.js';
import registerRzCalendarProvider from './components/rzCalendarProvider.js';
import registerRzCarousel from './components/rzCarousel.js';
import registerRzCodeViewer from './components/rzCodeViewer.js';
import registerRzCollapsible from './components/rzCollapsible.js';
import registerRzCombobox from './components/rzCombobox.js';
import registerRzDateEdit from './components/rzDateEdit.js';
import registerRzDialog from './components/rzDialog.js';
import registerRzDropdownMenu from './components/rzDropdownMenu.js';
import registerRzDarkModeToggle from './components/rzDarkModeToggle.js';
import registerRzEmbeddedPreview from './components/rzEmbeddedPreview.js';
import registerRzEmpty from './components/rzEmpty.js';
import registerRzHeading from './components/rzHeading.js';
import registerRzIndicator from './components/rzIndicator.js';
import registerRzInputGroupAddon from './components/rzInputGroupAddon.js';
import registerRzMarkdown from './components/rzMarkdown.js';
import registerRzNavigationMenu from './components/rzNavigationMenu.js';
import registerRzPopover from './components/rzPopover.js';
import registerRzPrependInput from './components/rzPrependInput.js';
import registerRzProgress from './components/rzProgress.js';
import registerRzQuickReferenceContainer from './components/rzQuickReferenceContainer.js';
import registerRzScrollArea from './components/rzScrollArea.js';
import registerRzSheet from './components/rzSheet.js';
import registerRzTabs from './components/rzTabs.js';
import registerRzSidebar from './components/rzSidebar.js';
import registerRzCommand from './components/rzCommand.js';
import registerRzCommandItem from './components/rzCommandItem.js';
import registerRzCommandList from './components/rzCommandList.js';
import registerRzCommandGroup from './components/rzCommandGroup.js';

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
 *
 * Supports both classic callback style and modern Promise style:
 *
 * - If a function is passed as 2nd arg, it's treated as a success callback.
 * - If an object is passed as 2nd arg, it may contain { success, error }.
 * - If a string is passed as 2nd arg, it's treated as the CSP nonce.
 * - The CSP nonce can also be passed as the 3rd arg.
 *
 * Always returns a Promise<{ bundleId: string }>.
 * In callback style the Promise is still returned (you can ignore it).
 *
 * The success/error lifecycles are powered by `loadjs.ready(bundleId, args)`,
 * so we *mirror* those into the Promise resolve/reject and also invoke any
 * provided callbacks exactly once.
 *
 * @param {string|string[]} paths
 * @param {Function|{success?:Function,error?:Function}|string} [callbackOrNonce]
 * @param {string} [nonce]
 * @returns {Promise<{bundleId: string}>}
 */
function rizzyRequire(paths, callbackOrNonce, nonce) {
    // Normalize inputs
    let cbObj = undefined; // { success?, error? } OR function (success-only)
    let csp = undefined;

    if (typeof callbackOrNonce === 'function') {
        cbObj = { success: callbackOrNonce };
    } else if (callbackOrNonce && typeof callbackOrNonce === 'object') {
        cbObj = callbackOrNonce; // may have success/error
    } else if (typeof callbackOrNonce === 'string') {
        csp = callbackOrNonce;
    }

    if (!csp && typeof nonce === 'string') csp = nonce;

    const files = Array.isArray(paths) ? paths : [paths];

    return generateBundleId(files).then((bundleId) => {
        // Only kick off a load the first time this bundleId is seen
        if (!loadjs.isDefined(bundleId)) {
            loadjs(files, bundleId, {
                // keep scripts ordered unless you explicitly change this later
                async: false,
                // pass CSP nonce to both script and style tags as your loader expects
                inlineScriptNonce: csp,
                inlineStyleNonce: csp,
            });
        }

        // Bridge loadjs.ready into both Promise and optional callbacks
        return new Promise((resolve, reject) => {
            loadjs.ready(bundleId, {
                success: () => {
                    // invoke user success callback if present
                    try {
                        if (cbObj && typeof cbObj.success === 'function') cbObj.success();
                    } catch (e) {
                        // don't swallow; surface dev-time issues but still resolve
                        console.error('[rizzyRequire] success callback threw:', e);
                    }
                    resolve({ bundleId });
                },
                error: (depsNotFound) => {
                    // depsNotFound is an array of bundleIds that failed (here, just this one)
                    try {
                        if (cbObj && typeof cbObj.error === 'function') {
                            cbObj.error(depsNotFound);
                        }
                    } catch (e) {
                        console.error('[rizzyRequire] error callback threw:', e);
                    }
                    reject(
                        new Error(
                            `[rizzyRequire] Failed to load bundle ${bundleId} (missing: ${Array.isArray(depsNotFound) ? depsNotFound.join(', ') : String(depsNotFound)})`
                        )
                    );
                },
            });
        });
    });
}

function registerComponents(Alpine) {
    registerRzAccordion(Alpine);
    registerAccordionItem(Alpine);
    registerRzAlert(Alpine);
    registerRzAspectRatio(Alpine);
    registerRzBrowser(Alpine);
    registerRzCalendar(Alpine, rizzyRequire);
    registerRzCalendarProvider(Alpine);
    registerRzCarousel(Alpine, rizzyRequire);
    registerRzCodeViewer(Alpine, rizzyRequire);
    registerRzCollapsible(Alpine);
    registerRzCombobox(Alpine, rizzyRequire);
    registerRzDateEdit(Alpine, rizzyRequire);
    registerRzDialog(Alpine);
    registerRzDropdownMenu(Alpine);
    registerRzDarkModeToggle(Alpine);
    registerRzEmbeddedPreview(Alpine);
    registerRzEmpty(Alpine);
    registerRzHeading(Alpine);
    registerRzIndicator(Alpine);
    registerRzInputGroupAddon(Alpine);
    registerRzMarkdown(Alpine, rizzyRequire);
    registerRzNavigationMenu(Alpine, $data);
    registerRzPopover(Alpine);
    registerRzPrependInput(Alpine);
    registerRzProgress(Alpine);
    registerRzQuickReferenceContainer(Alpine);
    registerRzScrollArea(Alpine);
    registerRzSheet(Alpine);
    registerRzTabs(Alpine);
    registerRzSidebar(Alpine);
    registerRzCommand(Alpine);
    registerRzCommandItem(Alpine);
    registerRzCommandList(Alpine);
    registerRzCommandGroup(Alpine);
}

export { registerComponents, rizzyRequire as require };