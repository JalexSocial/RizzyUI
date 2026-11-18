// src/js/runtime/a11y/dismissableLayer.js
var layerStack = [];
var listenersAttached = false;
function getTopLayer() {
	return layerStack[layerStack.length - 1] ?? null;
}
function isNode(value) {
	return !!value && typeof value === "object" && value.nodeType === 1;
}
function getEventPath(event) {
	if (typeof event.composedPath === "function") return event.composedPath();
	const path = [];
	let current = event.target ?? null;
	while (current) {
		path.push(current);
		current = current.parentElement ?? null;
	}
	const doc = event.target?.ownerDocument ?? document;
	path.push(doc);
	path.push(doc.defaultView ?? window);
	return path;
}
function isEventOutsideLayer(event, layer) {
	const root = layer.root;
	if (!root || !isNode(root)) return true;
	if (getEventPath(event).includes(root)) return false;
	return !root.contains(event.target);
}
function emitDismissEvent(layer, reason, originalEvent) {
	const dismissEvent = new CustomEvent("rz:dismiss", {
		bubbles: true,
		cancelable: true,
		detail: {
			reason,
			layerId: layer.id,
			originalEvent
		}
	});
	layer.root.dispatchEvent(dismissEvent);
	return dismissEvent;
}
function runDismiss(layer, reason, originalEvent) {
	const dismissEvent = emitDismissEvent(layer, reason, originalEvent);
	if (dismissEvent.defaultPrevented || originalEvent.defaultPrevented) return;
	layer.onDismiss({
		reason,
		originalEvent,
		dismissEvent
	});
}
function onDocumentKeyDown(event) {
	if (event.key !== "Escape" || event.defaultPrevented) return;
	const layer = getTopLayer();
	if (!layer) return;
	if (typeof layer.onEscape === "function") layer.onEscape(event);
	if (event.defaultPrevented) return;
	runDismiss(layer, "escape", event);
}
function onDocumentPointerDown(event) {
	const layer = getTopLayer();
	if (!layer || event.defaultPrevented) return;
	if (!isEventOutsideLayer(event, layer)) return;
	if (typeof layer.onOutsidePointer === "function") layer.onOutsidePointer(event);
	if (event.defaultPrevented) return;
	runDismiss(layer, "outside-pointer", event);
}
function onDocumentFocusIn(event) {
	const layer = getTopLayer();
	if (!layer || !layer.dismissOnOutsideFocus || event.defaultPrevented) return;
	if (!isEventOutsideLayer(event, layer)) return;
	if (typeof layer.onOutsideFocus === "function") layer.onOutsideFocus(event);
	if (event.defaultPrevented) return;
	runDismiss(layer, "outside-focus", event);
}
function attachListeners() {
	if (listenersAttached || typeof document === "undefined") return;
	document.addEventListener("keydown", onDocumentKeyDown, true);
	document.addEventListener("pointerdown", onDocumentPointerDown, true);
	document.addEventListener("focusin", onDocumentFocusIn, true);
	listenersAttached = true;
}
function detachListeners() {
	if (!listenersAttached || typeof document === "undefined") return;
	document.removeEventListener("keydown", onDocumentKeyDown, true);
	document.removeEventListener("pointerdown", onDocumentPointerDown, true);
	document.removeEventListener("focusin", onDocumentFocusIn, true);
	listenersAttached = false;
}
/**
* Registers a dismissable overlay layer in a shared stack.
* Only the top-most layer receives escape/outside dismissal interactions.
*
* @param {object} options Registration options.
* @param {HTMLElement} options.root Root element for the layer.
* @param {(context: { reason: string, originalEvent: Event, dismissEvent: CustomEvent }) => void} options.onDismiss Called when dismissal is confirmed.
* @param {(event: KeyboardEvent) => void} [options.onEscape] Optional hook before escape dismissal.
* @param {(event: PointerEvent) => void} [options.onOutsidePointer] Optional hook before outside pointer dismissal.
* @param {(event: FocusEvent) => void} [options.onOutsideFocus] Optional hook before outside focus dismissal.
* @param {boolean} [options.dismissOnOutsideFocus=false] Whether outside focus should dismiss the top layer.
* @param {string} [options.id] Stable optional layer identifier emitted in rz:dismiss details.
* @returns {() => void} Unregister function.
*/
function registerDismissableLayer(options) {
	if (!options || !isNode(options.root)) throw new Error("registerDismissableLayer requires a valid root element.");
	if (typeof options.onDismiss !== "function") throw new Error("registerDismissableLayer requires an onDismiss callback.");
	const layer = {
		id: options.id ?? `layer-${Date.now()}-${Math.random().toString(36).slice(2)}`,
		root: options.root,
		onDismiss: options.onDismiss,
		onEscape: options.onEscape,
		onOutsidePointer: options.onOutsidePointer,
		onOutsideFocus: options.onOutsideFocus,
		dismissOnOutsideFocus: options.dismissOnOutsideFocus === true
	};
	layerStack.push(layer);
	attachListeners();
	let unregistered = false;
	return function unregisterDismissableLayer() {
		if (unregistered) return;
		unregistered = true;
		const index = layerStack.lastIndexOf(layer);
		if (index !== -1) layerStack.splice(index, 1);
		if (layerStack.length === 0) detachListeners();
	};
}
/**
* Creates a dismissable-layer manager API bound to the shared module stack.
*
* @returns {{ registerLayer: typeof registerDismissableLayer }}
*/
function createDismissableLayer() {
	return { registerLayer: registerDismissableLayer };
}
// src/js/runtime/a11y/triggerReference.js
/**
* Points an ARIA relationship on `element` (for example a popover's `aria-labelledby`) at the
* trigger's actual id.
*
* The server renders the relationship with the generated trigger id (`<component-id>-trigger`).
* With `AsChild`, a trigger child that has its own `id` keeps it, so that reference pointed at an
* element that does not exist (RZUI-048). When the trigger has no id, it gets the referenced one.
*
* @param {HTMLElement | null | undefined} triggerEl
* @param {HTMLElement | null | undefined} element
* @param {string} [attribute='aria-labelledby']
*/
function linkToTrigger(triggerEl, element, attribute = "aria-labelledby") {
	if (!triggerEl || typeof element?.getAttribute !== "function") return;
	const referenced = element.getAttribute(attribute);
	if (!referenced) return;
	if (!triggerEl.id) {
		triggerEl.id = referenced;
		return;
	}
	if (triggerEl.id !== referenced) element.setAttribute(attribute, triggerEl.id);
}
/**
* Removes ARIA ID references whose targets do not exist, so assistive technology never follows a
* dangling reference. Components render aria-labelledby/aria-describedby for an optional title or
* description before knowing whether the caller rendered one (RZUI-048).
*
* @param {HTMLElement | null | undefined} element
* @param {string[]} [attributes]
*/
function removeMissingReferences(element, attributes = ["aria-labelledby", "aria-describedby"]) {
	if (typeof element?.getAttribute !== "function") return;
	for (const attribute of attributes) {
		const ids = (element.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean);
		if (ids.length === 0) continue;
		const present = ids.filter((id) => document.getElementById(id));
		if (present.length === 0) element.removeAttribute(attribute);
		else if (present.length !== ids.length) element.setAttribute(attribute, present.join(" "));
	}
}
export { registerDismissableLayer as i, removeMissingReferences as n, createDismissableLayer as r, linkToTrigger as t };

//# sourceMappingURL=triggerReference-Dm_VUwDk.js.map