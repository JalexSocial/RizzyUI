
import loadjs from "./loadjs/loadjs.js";

// Import component registration functions
import registerRzAccordion from './components/rzAccordion.js';
import registerAccordionItem from './components/accordionItem.js';
import registerRzAlert from './components/rzAlert.js';
import registerRzBrowser from './components/rzBrowser.js';
import registerRzCheckboxGroupItem from './components/rzCheckboxGroupItem.js';
import registerRzCodeViewer from './components/rzCodeViewer.js';
import registerRzDateEdit from './components/rzDateEdit.js';
import registerRzDropdown from './components/rzDropdown.js';
import registerRzDarkModeToggle from './components/rzDarkModeToggle.js';
import registerRzEmbeddedPreview from './components/rzEmbeddedPreview.js';
import registerRzEmpty from './components/rzEmpty.js';
import registerRzHeading from './components/rzHeading.js';
import registerRzIndicator from './components/rzIndicator.js';
import registerRzMarkdown from './components/rzMarkdown.js';
import registerRzModal from './components/rzModal.js';
import registerRzPrependInput from './components/rzPrependInput.js';
import registerRzProgress from './components/rzProgress.js';
import registerRzQuickReferenceContainer from './components/rzQuickReferenceContainer.js';
import registerRzTabs from './components/rzTabs.js';
import registerRzSidebar from './components/rzSidebar.js';
import registerRzSidebarLinkItem from './components/rzSidebarLinkItem.js';

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
    registerRzBrowser(Alpine);
    registerRzCheckboxGroupItem(Alpine);
    registerRzCodeViewer(Alpine, rizzyRequire);
    registerRzDateEdit(Alpine, rizzyRequire);
    registerRzDropdown(Alpine);
    registerRzDarkModeToggle(Alpine);
    registerRzEmbeddedPreview(Alpine);
    registerRzEmpty(Alpine);
    registerRzHeading(Alpine);
    registerRzIndicator(Alpine);
    registerRzMarkdown(Alpine, rizzyRequire);
    registerRzModal(Alpine);
    registerRzPrependInput(Alpine);
    registerRzProgress(Alpine);
    registerRzQuickReferenceContainer(Alpine);
    registerRzTabs(Alpine);
    registerRzSidebar(Alpine);
    registerRzSidebarLinkItem(Alpine);
}

export { registerComponents, rizzyRequire as require };