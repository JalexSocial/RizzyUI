
import loadjs from "./loadjs/loadjs.js";
import $data from './alpineData.js';

// Import component registration functions
import registerRzAccordion from './components/rzAccordion.js';
import registerAccordionItem from './components/accordionItem.js';
import registerRzAlert from './components/rzAlert.js';
import registerRzAspectRatio from './components/rzAspectRatio.js';
import registerRzBrowser from './components/rzBrowser.js';
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
function rizzyRequire(paths, callbackFn, nonce) {
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

function registerComponents(Alpine) {
    registerRzAccordion(Alpine);
    registerAccordionItem(Alpine);
    registerRzAlert(Alpine);
    registerRzAspectRatio(Alpine);
    registerRzBrowser(Alpine);
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