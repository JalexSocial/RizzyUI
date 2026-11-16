/**
 * Adds the RizzyUI API to the shared `window.Rizzy` object instead of replacing it.
 *
 * Rizzy's own client (rizzy.js) keeps a reference to `window.Rizzy` and stores `diagnostics`,
 * `nonce` and `confirm` on it. Replacing the object with a copy would detach that reference, and
 * object spread would also turn accessor properties such as `validation` into stale values.
 * Property descriptors are copied so getters stay live.
 *
 * @param {object|undefined|null} existing The current `window.Rizzy` value, if any.
 * @param {object} api The RizzyUI API object.
 * @returns {object} The shared global object (the existing one when there is one).
 */
export function mergeIntoRizzyGlobal(existing, api) {
    const target = existing && typeof existing === 'object' ? existing : {};
    const descriptors = Object.getOwnPropertyDescriptors(api);

    for (const key of Object.keys(descriptors)) {
        descriptors[key] = { ...descriptors[key], configurable: true };
    }

    Object.defineProperties(target, descriptors);
    return target;
}
