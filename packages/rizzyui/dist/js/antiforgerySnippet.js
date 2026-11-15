// Deprecated: htmx 2 antiforgery snippet.
//
// RizzyUI now targets Rizzy 6 and htmx 4. This snippet listened for htmx 2's request
// configuration and after-load events, which htmx 4 renamed and reshaped, so it can no longer
// attach the antiforgery token. Rizzy 6 handles antiforgery itself through its
// `rizzy-antiforgery` extension: render `<RzHeadOutlet />` and `<RzScripts />` in the root
// layout and remove this script. The file is kept so existing script tags and package imports
// do not fail; it only logs a warning. It will be removed in a later release.
if (typeof window !== 'undefined' && !window.__rizzyUIAntiforgerySnippetWarned) {
    window.__rizzyUIAntiforgerySnippetWarned = true;
    console.warn(
        '[RizzyUI] antiforgerySnippet.js is deprecated and does nothing with htmx 4. ' +
        'Rizzy 6 attaches the antiforgery token itself (render <RzHeadOutlet /> and <RzScripts />); remove this script.'
    );
}
