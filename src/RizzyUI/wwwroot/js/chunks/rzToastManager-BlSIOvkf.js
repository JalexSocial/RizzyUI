import { a as fallbackStatuses, i as fallbackPositions, o as getAliasMap, s as toastInputEvents } from "./bootstrap-5SAGNPUK.js";
// src/js/lib/notify/rzToastNormalize.js
var fallbackTones = [
	"subtle",
	"solid",
	"outline",
	"ghost"
];
var fallbackAnimations = [
	"fade",
	"slide",
	"none"
];
var roleMap = {
	default: {
		role: "status",
		ariaLive: "polite"
	},
	info: {
		role: "status",
		ariaLive: "polite"
	},
	success: {
		role: "status",
		ariaLive: "polite"
	},
	warning: {
		role: "status",
		ariaLive: "polite"
	},
	error: {
		role: "alert",
		ariaLive: "assertive"
	},
	loading: {
		role: "status",
		ariaLive: "polite"
	}
};
function normalizeKey(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function canonicalize(value, allowed, aliases, fallback, kind) {
	const raw = normalizeKey(value);
	const canonical = aliases[raw] || raw;
	if (allowed.includes(canonical)) return canonical;
	if (raw) console.warn(`[RizzyUI] Invalid toast ${kind} '${value}'. Defaulting to '${fallback}'.`);
	return fallback;
}
function toBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function toPositiveNumber(value, fallback) {
	const number = Number(value);
	return Number.isFinite(number) && number >= 0 ? number : fallback;
}
function normalizeClassNames(options) {
	const classNames = { ...options.classNames || {} };
	const rootClass = options.customClass ?? options.className;
	if (rootClass) classNames.toast = rootClass;
	return classNames;
}
function isElement$1(value) {
	return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}
function normalizeToastOptions(options = {}, config = {}, defaultsOverride = {}) {
	const defaults = {
		status: "info",
		position: "top-right",
		tone: "subtle",
		animation: "fade",
		duration: 4e3,
		speed: 300,
		dismissible: true,
		showIcon: true,
		pauseOnHover: true,
		pauseOnFocus: true,
		pauseOnWindowBlur: false,
		closeOnEscape: true,
		preventDuplicates: false,
		progress: true,
		maxVisible: 5,
		newestOnTop: true,
		overflowStrategy: "dismiss-oldest",
		closeButtonAriaLabel: "Dismiss notification",
		...config.defaults || {},
		...defaultsOverride
	};
	const statusSource = options.status ?? options.variant ?? defaults.status;
	const toneSource = options.tone ?? options.type ?? defaults.tone;
	const animationSource = options.animation ?? options.effect ?? defaults.animation;
	const durationSource = options.duration ?? options.autotimeout ?? defaults.duration;
	const statusKeys = Object.keys(config.statuses || {});
	const positionKeys = Object.keys(config.positions || {});
	const toneKeys = Object.keys(config.tones || {});
	const animationKeys = Object.keys(config.animations || {});
	const allowedStatuses = statusKeys.length ? statusKeys : fallbackStatuses;
	const allowedPositions = positionKeys.length ? positionKeys : fallbackPositions;
	const allowedTones = toneKeys.length ? toneKeys : fallbackTones;
	const allowedAnimations = animationKeys.length ? animationKeys : fallbackAnimations;
	const status = canonicalize(statusSource, allowedStatuses, getAliasMap(config, "statuses"), defaults.status || "info", "status");
	const position = canonicalize(options.position ?? defaults.position, allowedPositions, getAliasMap(config, "positions"), defaults.position || "top-right", "position");
	const tone = canonicalize(toneSource, allowedTones, getAliasMap(config, "types"), defaults.tone || "subtle", "tone");
	const animation = canonicalize(animationSource, allowedAnimations, getAliasMap(config, "effects"), defaults.animation || "fade", "animation");
	const text = options.text ?? options.message ?? options.description ?? "";
	const autoclose = options.autoclose ?? (status === "loading" ? false : void 0);
	const normalizedAutoclose = typeof autoclose === "boolean" ? autoclose : toPositiveNumber(durationSource, defaults.duration) > 0;
	const progress = options.progress ?? (status === "loading" ? false : defaults.progress);
	const roleDefaults = roleMap[status] || roleMap.info;
	const duration = toPositiveNumber(durationSource, defaults.duration);
	return {
		id: options.id ? String(options.id) : void 0,
		status,
		tone,
		animation,
		title: options.title ?? "",
		text,
		html: isElement$1(options.html) ? options.html : void 0,
		showIcon: options.icon === false ? false : toBoolean(options.showIcon, defaults.showIcon),
		icon: options.icon,
		customIcon: isElement$1(options.customIcon) ? options.customIcon : void 0,
		dismissible: toBoolean(options.dismissible ?? options.showCloseButton, defaults.dismissible),
		classNames: normalizeClassNames(options),
		speed: toPositiveNumber(options.speed, defaults.speed),
		autoclose: normalizedAutoclose,
		duration,
		position,
		action: options.action && typeof options.action === "object" ? options.action : void 0,
		pauseOnHover: toBoolean(options.pauseOnHover, defaults.pauseOnHover),
		pauseOnFocus: toBoolean(options.pauseOnFocus, defaults.pauseOnFocus),
		pauseOnWindowBlur: toBoolean(options.pauseOnWindowBlur, defaults.pauseOnWindowBlur),
		progress: Boolean(progress) && normalizedAutoclose && duration > 0 && (status !== "loading" || options.progress === true),
		role: options.role || roleDefaults.role,
		ariaLive: options.ariaLive || roleDefaults.ariaLive,
		dedupeKey: options.dedupeKey ? String(options.dedupeKey) : void 0,
		incrementCount: Boolean(options.incrementCount),
		data: options.data,
		closeOnEscape: toBoolean(options.closeOnEscape, defaults.closeOnEscape),
		preventDuplicates: toBoolean(options.preventDuplicates, defaults.preventDuplicates),
		maxVisible: toPositiveNumber(options.maxVisible, defaults.maxVisible),
		newestOnTop: toBoolean(options.newestOnTop, defaults.newestOnTop),
		overflowStrategy: options.overflowStrategy || defaults.overflowStrategy || "dismiss-oldest",
		closeButtonAriaLabel: defaults.closeButtonAriaLabel || "Dismiss notification"
	};
}
// src/js/lib/notify/rzToastIcons.js
var svgNamespace = "http://www.w3.org/2000/svg";
function createSvg(viewBox = "0 0 24 24") {
	const svg = document.createElementNS(svgNamespace, "svg");
	svg.setAttribute("viewBox", viewBox);
	svg.setAttribute("fill", "none");
	svg.setAttribute("stroke", "currentColor");
	svg.setAttribute("stroke-width", "2");
	svg.setAttribute("stroke-linecap", "round");
	svg.setAttribute("stroke-linejoin", "round");
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("focusable", "false");
	return svg;
}
function appendPath(svg, d) {
	const path = document.createElementNS(svgNamespace, "path");
	path.setAttribute("d", d);
	svg.appendChild(path);
}
function appendCircle(svg, cx, cy, r) {
	const circle = document.createElementNS(svgNamespace, "circle");
	circle.setAttribute("cx", cx);
	circle.setAttribute("cy", cy);
	circle.setAttribute("r", r);
	svg.appendChild(circle);
}
function createCloseIcon() {
	const svg = createSvg();
	appendPath(svg, "M18 6 6 18");
	appendPath(svg, "m6 6 12 12");
	return svg;
}
function createStatusIcon(status) {
	if (status === "default") return null;
	if (status === "loading") return document.createElement("span");
	const svg = createSvg();
	if (status === "success") {
		appendCircle(svg, "12", "12", "10");
		appendPath(svg, "m9 12 2 2 4-4");
		return svg;
	}
	if (status === "warning") {
		appendPath(svg, "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z");
		appendPath(svg, "M12 9v4");
		appendPath(svg, "M12 17h.01");
		return svg;
	}
	if (status === "error") {
		appendCircle(svg, "12", "12", "10");
		appendPath(svg, "m15 9-6 6");
		appendPath(svg, "m9 9 6 6");
		return svg;
	}
	appendCircle(svg, "12", "12", "10");
	appendPath(svg, "M12 16v-4");
	appendPath(svg, "M12 8h.01");
	return svg;
}
function resolveToastIcon(toast) {
	if (toast.options.icon === false) return null;
	if (typeof HTMLElement !== "undefined" && toast.options.customIcon instanceof HTMLElement) return toast.options.customIcon.cloneNode(true);
	if (typeof HTMLElement !== "undefined" && toast.options.icon instanceof HTMLElement) return toast.options.icon.cloneNode(true);
	return createStatusIcon(toast.options.status);
}
// src/js/lib/notify/rzToastRenderer.js
var slotAttributes = {
	toast: "toast",
	innerContainer: "toast-inner-container",
	iconContainer: "toast-icon-container",
	iconPulse: "toast-icon-pulse",
	loadingIndicator: "toast-loading-indicator",
	contentContainer: "toast-content-container",
	title: "toast-title",
	description: "toast-description",
	actionContainer: "toast-action-container",
	actionButton: "toast-action-button",
	closeButton: "toast-close-button",
	closeButtonIcon: "toast-close-button-icon",
	progressTrack: "toast-progress-track",
	progressIndicator: "toast-progress-indicator"
};
function appendClass(list, value) {
	if (Array.isArray(value)) {
		value.forEach((item) => appendClass(list, item));
		return;
	}
	if (typeof value === "string" && value.trim()) list.push(value.trim());
}
function dedupeClasses(...values) {
	const rawClasses = [];
	const classes = [];
	const seen = /* @__PURE__ */ new Set();
	values.forEach((value) => appendClass(rawClasses, value));
	rawClasses.join(" ").split(/\s+/).forEach((token) => {
		if (!token || seen.has(token)) return;
		seen.add(token);
		classes.push(token);
	});
	return classes.join(" ");
}
function getSlotClass(map, slot) {
	return map && typeof map[slot] === "string" ? map[slot] : "";
}
function composeToastClass(classMap, toast, slot) {
	const options = toast.options;
	return dedupeClasses(getSlotClass(classMap.slots, slot), getSlotClass(classMap.positions?.[options.position], slot), getSlotClass(classMap.statuses?.[options.status], slot), getSlotClass(classMap.tones?.[options.tone], slot), getSlotClass(classMap.animations?.[options.animation], slot), getSlotClass(classMap.states?.[toast.state || "visible"], slot), options.classNames?.[slot]);
}
function setSlotClass(element, toast, classMap, slot) {
	const className = composeToastClass(classMap, toast, slot);
	if (className) element.className = className;
	else element.removeAttribute("class");
}
function createSlotElement(tagName, slot) {
	const element = document.createElement(tagName);
	element.dataset.slot = slotAttributes[slot];
	return element;
}
function renderTextSlot(parent, tagName, slot, text, toast, classMap) {
	if (text === null || text === void 0 || text === "") return null;
	const element = createSlotElement(tagName, slot);
	element.textContent = text;
	setSlotClass(element, toast, classMap, slot);
	parent.appendChild(element);
	return element;
}
function createIconContainer(toast, classMap) {
	if (!toast.options.showIcon || toast.options.icon === false) return null;
	const iconContainer = createSlotElement("div", "iconContainer");
	iconContainer.setAttribute("aria-hidden", "true");
	setSlotClass(iconContainer, toast, classMap, "iconContainer");
	if (toast.options.status === "loading") {
		const loading = createSlotElement("span", "loadingIndicator");
		setSlotClass(loading, toast, classMap, "loadingIndicator");
		iconContainer.appendChild(loading);
		return iconContainer;
	}
	const icon = resolveToastIcon(toast);
	if (!icon) return null;
	const pulse = createSlotElement("span", "iconPulse");
	setSlotClass(pulse, toast, classMap, "iconPulse");
	iconContainer.appendChild(pulse);
	iconContainer.appendChild(icon);
	return iconContainer;
}
function createAction(toast, classMap) {
	const action = toast.options.action;
	if (!action || !action.label) return null;
	const actionContainer = createSlotElement("div", "actionContainer");
	const actionButton = createSlotElement("button", "actionButton");
	actionButton.type = "button";
	actionButton.textContent = action.label;
	setSlotClass(actionContainer, toast, classMap, "actionContainer");
	setSlotClass(actionButton, toast, classMap, "actionButton");
	actionContainer.appendChild(actionButton);
	return actionContainer;
}
function createCloseButton(toast, classMap) {
	if (!toast.options.dismissible) return null;
	const button = createSlotElement("button", "closeButton");
	button.type = "button";
	button.setAttribute("aria-label", toast.options.closeButtonAriaLabel);
	setSlotClass(button, toast, classMap, "closeButton");
	const icon = createCloseIcon();
	icon.dataset.slot = slotAttributes.closeButtonIcon;
	const iconClass = composeToastClass(classMap, toast, "closeButtonIcon");
	if (iconClass) icon.setAttribute("class", iconClass);
	button.appendChild(icon);
	return button;
}
function createProgress(toast, classMap) {
	if (!toast.options.progress || !toast.options.autoclose || toast.options.duration <= 0) return null;
	const track = createSlotElement("div", "progressTrack");
	const indicator = createSlotElement("div", "progressIndicator");
	setSlotClass(track, toast, classMap, "progressTrack");
	setSlotClass(indicator, toast, classMap, "progressIndicator");
	indicator.style.transform = "scaleX(1)";
	indicator.style.transitionDuration = `${toast.remaining}ms`;
	track.appendChild(indicator);
	return track;
}
function createToastDom(toast, classMap) {
	const root = createSlotElement("div", "toast");
	root.dataset.rzToastItem = "";
	root.dataset.toastId = toast.id;
	root.dataset.toastStatus = toast.options.status;
	root.setAttribute("role", toast.options.role);
	root.setAttribute("aria-live", toast.options.ariaLive);
	root.setAttribute("aria-atomic", "true");
	setSlotClass(root, toast, classMap, "toast");
	const inner = createSlotElement("div", "innerContainer");
	setSlotClass(inner, toast, classMap, "innerContainer");
	root.appendChild(inner);
	const iconContainer = createIconContainer(toast, classMap);
	if (iconContainer) inner.appendChild(iconContainer);
	const content = createSlotElement("div", "contentContainer");
	setSlotClass(content, toast, classMap, "contentContainer");
	inner.appendChild(content);
	renderTextSlot(content, "div", "title", toast.options.title, toast, classMap);
	renderTextSlot(content, "div", "description", toast.options.text, toast, classMap);
	if (typeof HTMLElement !== "undefined" && toast.options.html instanceof HTMLElement) content.appendChild(toast.options.html.cloneNode(true));
	const action = createAction(toast, classMap);
	if (action) content.appendChild(action);
	const closeButton = createCloseButton(toast, classMap);
	if (closeButton) inner.appendChild(closeButton);
	const progress = createProgress(toast, classMap);
	if (progress) root.appendChild(progress);
	toast.elements = { root };
	return root;
}
function updateToastDom(toast, classMap) {
	if (!toast.elements?.root) return createToastDom(toast, classMap);
	const previousRoot = toast.elements.root;
	const parent = previousRoot.parentElement;
	const replacement = createToastDom(toast, classMap);
	if (parent) parent.replaceChild(replacement, previousRoot);
	return replacement;
}
function applyToastClasses(element, toast, classMap) {
	setSlotClass(element, toast, classMap, "toast");
	element.dataset.toastStatus = toast.options.status;
	element.setAttribute("role", toast.options.role);
	element.setAttribute("aria-live", toast.options.ariaLive);
}
// src/js/lib/notify/rzToastManager.js
var providerSelector = "[data-rz-toast-provider]";
var configSelector = "[data-rz-toast-config]";
var stackSelector = "[data-rz-toast-stack][data-toast-position]";
function createId() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `rz-toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function isDevelopment() {
	return typeof process === "undefined" || false;
}
function isElement(value) {
	return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}
function scheduleFrame(callback) {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(callback);
		return;
	}
	window.setTimeout(callback, 0);
}
function forceLayout(element) {
	if (!element) return;
	if (typeof element.getBoundingClientRect === "function") {
		element.getBoundingClientRect();
		return;
	}
	element.offsetHeight;
}
function getElementTop(element) {
	return typeof element.getBoundingClientRect === "function" ? element.getBoundingClientRect().top : 0;
}
function getStackItems(stack) {
	return Array.from(stack.children || []).filter((child) => child.hasAttribute?.("data-rz-toast-item"));
}
function getLifecycleDetail(toast, reason) {
	const detail = {
		id: toast.id,
		status: toast.options.status,
		reason
	};
	if (toast.count > 1) detail.count = toast.count;
	if (toast.options.data !== void 0) detail.data = toast.options.data;
	return detail;
}
var RzToastManager = class {
	constructor() {
		this.provider = null;
		this.config = {};
		this.defaults = {};
		this.stacks = /* @__PURE__ */ new Map();
		this.toasts = /* @__PURE__ */ new Map();
		this.dedupeIndex = /* @__PURE__ */ new Map();
		this.initialized = false;
		this.warnedNoProvider = false;
		this.warnedMultipleProviders = false;
		this.boundWindowBlur = this.pauseWindowTimers.bind(this);
		this.boundWindowFocus = this.resumeWindowTimers.bind(this);
		this.seenInputEvents = /* @__PURE__ */ new WeakSet();
		this.nextSequence = 0;
		this.installInputEventListeners();
	}
	configure(providerOrConfig) {
		if (providerOrConfig === void 0) return this;
		if (isElement(providerOrConfig)) return this.registerProvider(providerOrConfig);
		this.config = providerOrConfig || {};
		this.defaults = { ...this.config.defaults || {} };
		this.initialized = true;
		return this;
	}
	registerProvider(providerElement) {
		if (!isElement(providerElement)) return this;
		const configElement = providerElement.querySelector(configSelector);
		const config = this.parseConfig(configElement);
		this.provider = providerElement;
		this.config = config;
		this.defaults = { ...config.defaults || {} };
		this.stacks.clear();
		providerElement.querySelectorAll(stackSelector).forEach((stack) => {
			this.stacks.set(stack.dataset.toastPosition, stack);
		});
		window.removeEventListener("blur", this.boundWindowBlur);
		window.removeEventListener("focus", this.boundWindowFocus);
		window.addEventListener("blur", this.boundWindowBlur);
		window.addEventListener("focus", this.boundWindowFocus);
		this.initialized = true;
		return this;
	}
	show(options = {}) {
		if (!this.ensureProvider()) return null;
		const normalized = normalizeToastOptions(options, this.config, this.defaults);
		const existing = this.findExisting(normalized);
		if (existing) return this.update(existing.id, normalized);
		const stack = this.getStackForPosition(normalized.position);
		if (!stack) {
			console.warn(`[RizzyUI] Toast stack '${normalized.position}' was not found.`);
			return null;
		}
		if (!this.enforceMaxVisible(normalized.position, normalized)) {
			this.dispatchLifecycle("rz:toast:dismissed", {
				id: normalized.id || "",
				status: normalized.status,
				reason: "ignore-newest",
				data: normalized.data
			});
			return null;
		}
		const toast = this.createRecord(normalized);
		const element = createToastDom(toast, this.config);
		const previousStackPositions = this.captureStackPositions(stack);
		this.bindToastEvents(toast);
		this.insertToast(stack, element, normalized.newestOnTop);
		this.animateStackShift(stack, previousStackPositions, element, normalized.speed);
		forceLayout(element);
		this.toasts.set(toast.id, toast);
		if (toast.dedupeKey) this.dedupeIndex.set(toast.dedupeKey, toast.id);
		scheduleFrame(() => {
			toast.state = "visible";
			applyToastClasses(element, toast, this.config);
			this.startTimer(toast);
			this.startProgress(toast);
			this.dispatchLifecycle("rz:toast:shown", getLifecycleDetail(toast));
		});
		return this.createHandle(toast.id);
	}
	update(id, options = {}) {
		const toast = this.toasts.get(String(id));
		if (!toast) return null;
		this.clearTimer(toast);
		const previousDedupeKey = toast.dedupeKey;
		const normalized = normalizeToastOptions({
			...toast.options,
			...options,
			id: toast.id
		}, this.config, this.defaults);
		toast.options = normalized;
		toast.dedupeKey = normalized.dedupeKey || (normalized.preventDuplicates ? this.createDedupeKey(normalized) : void 0);
		toast.count = normalized.incrementCount ? toast.count + 1 : toast.count;
		toast.remaining = normalized.duration;
		toast.startedAt = 0;
		toast.paused = false;
		updateToastDom(toast, this.config);
		this.bindToastEvents(toast);
		this.moveToastIfNeeded(toast);
		if (previousDedupeKey && previousDedupeKey !== toast.dedupeKey) this.dedupeIndex.delete(previousDedupeKey);
		if (toast.dedupeKey) this.dedupeIndex.set(toast.dedupeKey, toast.id);
		this.startTimer(toast);
		this.startProgress(toast);
		this.dispatchLifecycle("rz:toast:updated", getLifecycleDetail(toast));
		return this.createHandle(toast.id);
	}
	dismiss(id, reason = "api") {
		const toast = id ? this.toasts.get(String(id)) : this.getMostRecent();
		if (!toast || toast.dismissed) return false;
		toast.dismissed = true;
		toast.state = "leaving";
		this.clearTimer(toast);
		if (toast.elements?.root) {
			if (toast.elements.root.contains(document.activeElement) && typeof document.activeElement.blur === "function") document.activeElement.blur();
			applyToastClasses(toast.elements.root, toast, this.config);
		}
		window.setTimeout(() => this.removeToast(toast, reason), toast.options.speed);
		return true;
	}
	clear() {
		const toasts = Array.from(this.toasts.values());
		toasts.forEach((toast) => {
			toast.dismissed = true;
			this.removeToast(toast, "clear");
		});
		this.dispatchLifecycle("rz:toast:cleared", {
			ids: toasts.map((toast) => toast.id),
			reason: "clear"
		});
	}
	get(id) {
		return this.toasts.get(String(id));
	}
	getAll() {
		return Array.from(this.toasts.values());
	}
	parseConfig(configElement) {
		if (!configElement) return {};
		try {
			return JSON.parse(configElement.textContent || "{}");
		} catch (error) {
			console.warn("[RizzyUI] Failed to parse toast provider configuration.", error);
			return {};
		}
	}
	ensureProvider() {
		if (this.provider && this.provider.isConnected === false) {
			this.provider = null;
			this.stacks.clear();
			this.warnedNoProvider = false;
		}
		if (this.initialized && this.provider) return true;
		if (typeof document === "undefined") return false;
		const providers = Array.from(document.querySelectorAll(providerSelector));
		if (!providers.length) {
			if (!this.warnedNoProvider) {
				console.warn("[RizzyUI] No RzToastProvider found. Add <RzToastProvider /> to the root layout before showing toasts.");
				this.warnedNoProvider = true;
			}
			return false;
		}
		if (providers.length > 1 && isDevelopment() && !this.warnedMultipleProviders) {
			console.warn("[RizzyUI] Multiple RzToastProvider elements found. The first provider will be used.");
			this.warnedMultipleProviders = true;
		}
		this.registerProvider(providers[0]);
		return true;
	}
	createRecord(options) {
		const id = options.id || createId();
		return {
			id,
			dedupeKey: options.dedupeKey || (options.preventDuplicates ? this.createDedupeKey({
				...options,
				id
			}) : void 0),
			options: {
				...options,
				id
			},
			state: "entering",
			createdAt: Date.now(),
			sequence: ++this.nextSequence,
			count: 1,
			remaining: options.duration,
			startedAt: 0,
			timerId: null,
			paused: false,
			dismissed: false,
			elements: null
		};
	}
	findExisting(options) {
		if (options.id && this.toasts.has(options.id)) return this.toasts.get(options.id);
		const dedupeKey = options.dedupeKey || (options.preventDuplicates ? this.createDedupeKey(options) : void 0);
		return dedupeKey && this.dedupeIndex.has(dedupeKey) ? this.toasts.get(this.dedupeIndex.get(dedupeKey)) : null;
	}
	createDedupeKey(options) {
		return [
			options.status,
			options.title,
			options.text,
			options.position
		].join("|");
	}
	enforceMaxVisible(position, options) {
		const visible = Array.from(this.toasts.values()).filter((toast) => toast.options.position === position && !toast.dismissed);
		if (!options.maxVisible || visible.length < options.maxVisible) return true;
		if (options.overflowStrategy === "ignore-newest") return false;
		const oldest = visible.sort((a, b) => a.createdAt - b.createdAt)[0];
		if (oldest) this.dismiss(oldest.id, "viewport-limit");
		return true;
	}
	insertToast(stack, element, newestOnTop) {
		if (newestOnTop && stack.firstChild) {
			stack.insertBefore(element, stack.firstChild);
			return;
		}
		stack.appendChild(element);
	}
	captureStackPositions(stack) {
		const positions = /* @__PURE__ */ new Map();
		getStackItems(stack).forEach((item) => positions.set(item, getElementTop(item)));
		return positions;
	}
	animateStackShift(stack, previousPositions, insertedElement, speed) {
		if (!previousPositions?.size) return;
		getStackItems(stack).forEach((item) => {
			if (item === insertedElement || !previousPositions.has(item)) return;
			const delta = previousPositions.get(item) - getElementTop(item);
			if (!delta) return;
			item.style.transition = "none";
			item.style.transform = `translate3d(0, ${delta}px, 0)`;
			forceLayout(item);
			scheduleFrame(() => {
				item.style.transition = `transform ${speed}ms cubic-bezier(0.22, 1, 0.36, 1)`;
				item.style.transform = "";
			});
			window.setTimeout(() => {
				if (item.style.transition?.includes("cubic-bezier(0.22, 1, 0.36, 1)")) item.style.transition = "";
				if (item.style.transform?.startsWith("translate3d(0,")) item.style.transform = "";
			}, speed);
		});
	}
	getStackForPosition(position) {
		const stack = this.stacks.get(position);
		if (stack) return stack;
		const fallback = this.stacks.get("top-right");
		if (fallback) {
			console.warn(`[RizzyUI] Toast stack '${position}' was not found. Falling back to 'top-right'.`);
			return fallback;
		}
		return null;
	}
	moveToastIfNeeded(toast) {
		const stack = this.getStackForPosition(toast.options.position);
		const element = toast.elements?.root;
		if (!stack || !element || element.parentElement === stack) return;
		const previousStackPositions = this.captureStackPositions(stack);
		this.insertToast(stack, element, toast.options.newestOnTop);
		this.animateStackShift(stack, previousStackPositions, element, toast.options.speed);
	}
	bindToastEvents(toast) {
		const element = toast.elements?.root;
		if (!element) return;
		const closeButton = element.querySelector("[data-slot=\"toast-close-button\"]");
		if (closeButton) closeButton.addEventListener("click", () => this.dismiss(toast.id, "close-button"));
		const actionButton = element.querySelector("[data-slot=\"toast-action-button\"]");
		if (actionButton) actionButton.addEventListener("click", () => this.invokeAction(toast));
		if (toast.options.pauseOnHover) {
			element.addEventListener("mouseenter", () => this.pauseTimer(toast));
			element.addEventListener("mouseleave", () => this.resumeTimer(toast));
		}
		if (toast.options.pauseOnFocus) {
			element.addEventListener("focusin", () => this.pauseTimer(toast));
			element.addEventListener("focusout", () => this.resumeTimer(toast));
		}
		element.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && toast.options.closeOnEscape && element.contains(document.activeElement)) {
				event.stopPropagation();
				this.dismiss(toast.id, "escape");
			}
		});
	}
	invokeAction(toast) {
		const action = toast.options.action;
		const dismissOnClick = action.dismissOnClick !== false;
		try {
			if (typeof action.onClick === "function") action.onClick(this.createHandle(toast.id));
			else if (typeof action.eventName === "string" && action.eventName.trim()) window.dispatchEvent(new CustomEvent(action.eventName, { detail: action.detail ?? {
				id: toast.id,
				status: toast.options.status,
				data: toast.options.data
			} }));
		} catch (error) {
			console.error("[RizzyUI] Toast action failed.", error);
		}
		if (dismissOnClick) this.dismiss(toast.id, "api");
	}
	startTimer(toast) {
		if (!toast.options.autoclose || toast.remaining <= 0 || toast.dismissed) return;
		toast.startedAt = Date.now();
		toast.timerId = window.setTimeout(() => this.dismiss(toast.id, "timeout"), toast.remaining);
	}
	clearTimer(toast) {
		if (toast.timerId) {
			window.clearTimeout(toast.timerId);
			toast.timerId = null;
		}
	}
	pauseTimer(toast) {
		if (!toast.timerId || toast.paused) return;
		const elapsed = Date.now() - toast.startedAt;
		toast.remaining = Math.max(0, toast.remaining - elapsed);
		toast.paused = true;
		this.clearTimer(toast);
		this.pauseProgress(toast);
	}
	resumeTimer(toast) {
		if (!toast.paused || toast.dismissed) return;
		toast.paused = false;
		this.startTimer(toast);
		this.startProgress(toast);
	}
	pauseWindowTimers() {
		this.toasts.forEach((toast) => {
			if (toast.options.pauseOnWindowBlur) this.pauseTimer(toast);
		});
	}
	resumeWindowTimers() {
		this.toasts.forEach((toast) => {
			if (toast.options.pauseOnWindowBlur) this.resumeTimer(toast);
		});
	}
	startProgress(toast) {
		const indicator = toast.elements?.root?.querySelector("[data-slot=\"toast-progress-indicator\"]");
		if (!indicator || !toast.options.progress || toast.paused) return;
		indicator.style.transitionDuration = `${toast.remaining}ms`;
		scheduleFrame(() => {
			indicator.style.transform = "scaleX(0)";
		});
	}
	pauseProgress(toast) {
		const indicator = toast.elements?.root?.querySelector("[data-slot=\"toast-progress-indicator\"]");
		if (!indicator) return;
		const computed = window.getComputedStyle(indicator).transform;
		indicator.style.transitionDuration = "0ms";
		indicator.style.transform = computed === "none" ? "scaleX(1)" : computed;
	}
	removeToast(toast, reason, animateRemoval = reason !== "clear") {
		this.clearTimer(toast);
		const root = toast.elements?.root;
		const stack = root?.parentElement;
		const previousStackPositions = animateRemoval && stack ? this.captureStackPositions(stack) : null;
		if (root && stack) {
			stack.removeChild(root);
			if (previousStackPositions) this.animateStackShift(stack, previousStackPositions, null, toast.options.speed);
		}
		this.toasts.delete(toast.id);
		if (toast.dedupeKey) this.dedupeIndex.delete(toast.dedupeKey);
		this.dispatchLifecycle("rz:toast:dismissed", getLifecycleDetail(toast, reason));
	}
	getMostRecent() {
		return Array.from(this.toasts.values()).sort((a, b) => b.createdAt - a.createdAt || b.sequence - a.sequence)[0];
	}
	createHandle(id) {
		return {
			id,
			update: (options) => this.update(id, options),
			dismiss: () => this.dismiss(id)
		};
	}
	dispatchLifecycle(name, detail) {
		window.dispatchEvent(new CustomEvent(name, { detail }));
	}
	processBatch(detail) {
		const commands = detail?.commands;
		if (!Array.isArray(commands)) return;
		commands.forEach((command) => {
			if (!command || typeof command !== "object") return;
			switch (command.type) {
				case "show":
					this.show(command.options || {});
					break;
				case "update":
					if (command.id) this.update(command.id, command.options || {});
					break;
				case "dismiss":
					this.dismiss(command.id, "api");
					break;
				case "clear":
					this.clear();
					break;
				default: console.warn(`[RizzyUI] Unsupported toast batch command '${command.type}'.`);
			}
		});
	}
	/**
	* Handles one toast input event (`rz:toast`, `rz:toast:batch`, ...). Each event is handled once,
	* although it is heard on both `document` and `window`; the eager toast facade also passes
	* events that arrived before this module loaded.
	* @param {Event} event
	*/
	handleInputEvent(event) {
		if (!event || this.seenInputEvents.has(event)) return;
		this.seenInputEvents.add(event);
		const detail = event.detail || {};
		if (event.type === "rz:toast" || event.type === "rz:toast:show") this.show(detail);
		else if (event.type === "rz:toast:update") this.update(detail.id, detail.options || detail);
		else if (event.type === "rz:toast:dismiss") this.dismiss(detail.id, "api");
		else if (event.type === "rz:toast:clear") this.clear();
		else if (event.type === "rz:toast:batch") this.processBatch(detail);
	}
	installInputEventListeners() {
		if (typeof window === "undefined" || typeof document === "undefined") return;
		const listener = (event) => this.handleInputEvent(event);
		toastInputEvents.forEach((name) => {
			window.addEventListener(name, listener);
			document.addEventListener(name, listener);
		});
	}
};
var toastManager = new RzToastManager();
export { toastManager };

//# sourceMappingURL=rzToastManager-BlSIOvkf.js.map