const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./advanced-input-runtime-BDyGSZ2H.js","./rizzyRequire-C5t2y41V.js","./calendar-runtime-Cm3N2jpl.js","./table-runtime-BcasLp2I.js","./flexrender-mXr0cMGi.js","./color-runtime-BQbdJmIl.js","./content-visual-runtime-D8_-8dNm.js","./menu-runtime-BuI5Xb2l.js","./floating-ui.dom-X8hpx-Bo.js","./popover-tooltip-runtime-DigvC58R.js","./docs-runtime-BRm2T1Og.js","./effects-runtime-EekiH7OU.js"])))=>i.map(i=>d[i]);
import { t as createFlexRenderPlugin } from "./flexrender-mXr0cMGi.js";
import { t as rizzyRequire } from "./rizzyRequire-C5t2y41V.js";
//#region node_modules/@alpinejs/collapse/dist/module.esm.js
function src_default$2(Alpine) {
	Alpine.directive("collapse", collapse);
	collapse.inline = (el, { modifiers }) => {
		if (!modifiers.includes("min")) return;
		el._x_doShow = () => {};
		el._x_doHide = () => {};
	};
	function collapse(el, { modifiers }) {
		let duration = modifierValue(modifiers, "duration", 250) / 1e3;
		let floor = modifierValue(modifiers, "min", 0);
		let fullyHide = !modifiers.includes("min");
		if (!el._x_isShown) el.style.height = `${floor}px`;
		if (!el._x_isShown && fullyHide) el.hidden = true;
		if (!el._x_isShown) el.style.overflow = "hidden";
		let setFunction = (el2, styles) => {
			let revertFunction = Alpine.setStyles(el2, styles);
			return styles.height ? () => {} : revertFunction;
		};
		let transitionStyles = {
			transitionProperty: "height",
			transitionDuration: `${duration}s`,
			transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
		};
		el._x_transition = {
			in(before = () => {}, after = () => {}) {
				if (fullyHide) el.hidden = false;
				if (fullyHide) el.style.display = null;
				let current = el.getBoundingClientRect().height;
				el.style.height = "auto";
				let full = el.getBoundingClientRect().height;
				if (current === full) current = floor;
				Alpine.transition(el, Alpine.setStyles, {
					during: transitionStyles,
					start: { height: current + "px" },
					end: { height: full + "px" }
				}, () => el._x_isShown = true, () => {
					if (Math.abs(el.getBoundingClientRect().height - full) < 1) el.style.overflow = null;
				});
			},
			out(before = () => {}, after = () => {}) {
				let full = el.getBoundingClientRect().height;
				Alpine.transition(el, setFunction, {
					during: transitionStyles,
					start: { height: full + "px" },
					end: { height: floor + "px" }
				}, () => el.style.overflow = "hidden", () => {
					el._x_isShown = false;
					if (el.style.height == `${floor}px` && fullyHide) {
						el.style.display = "none";
						el.hidden = true;
					}
				});
			}
		};
	}
}
function modifierValue(modifiers, key, fallback) {
	if (modifiers.indexOf(key) === -1) return fallback;
	const rawValue = modifiers[modifiers.indexOf(key) + 1];
	if (!rawValue) return fallback;
	if (key === "duration") {
		let match = rawValue.match(/([0-9]+)ms/);
		if (match) return match[1];
	}
	if (key === "min") {
		let match = rawValue.match(/([0-9]+)px/);
		if (match) return match[1];
	}
	return rawValue;
}
var module_default$2 = src_default$2;
//#endregion
//#region node_modules/@alpinejs/focus/dist/module.esm.js
var candidateSelectors = [
	"input",
	"select",
	"textarea",
	"a[href]",
	"button",
	"[tabindex]:not(slot)",
	"audio[controls]",
	"video[controls]",
	"[contenteditable]:not([contenteditable=\"false\"])",
	"details>summary:first-of-type",
	"details"
];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
	return element.getRootNode();
} : function(element) {
	return element.ownerDocument;
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
	var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
	if (includeContainer && matches.call(el, candidateSelector)) candidates.unshift(el);
	candidates = candidates.filter(filter);
	return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
	var candidates = [];
	var elementsToCheck = Array.from(elements);
	while (elementsToCheck.length) {
		var element = elementsToCheck.shift();
		if (element.tagName === "SLOT") {
			var assigned = element.assignedElements();
			var nestedCandidates = getCandidatesIteratively2(assigned.length ? assigned : element.children, true, options);
			if (options.flatten) candidates.push.apply(candidates, nestedCandidates);
			else candidates.push({
				scope: element,
				candidates: nestedCandidates
			});
		} else {
			if (matches.call(element, candidateSelector) && options.filter(element) && (includeContainer || !elements.includes(element))) candidates.push(element);
			var shadowRoot = element.shadowRoot || typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
			var validShadowRoot = !options.shadowRootFilter || options.shadowRootFilter(element);
			if (shadowRoot && validShadowRoot) {
				var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
				if (options.flatten) candidates.push.apply(candidates, _nestedCandidates);
				else candidates.push({
					scope: element,
					candidates: _nestedCandidates
				});
			} else elementsToCheck.unshift.apply(elementsToCheck, element.children);
		}
	}
	return candidates;
};
var getTabindex = function getTabindex2(node, isScope) {
	if (node.tabIndex < 0) {
		if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || node.isContentEditable) && isNaN(parseInt(node.getAttribute("tabindex"), 10))) return 0;
	}
	return node.tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
	return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
	return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
	return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
	return node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
		return child.tagName === "SUMMARY";
	});
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
	for (var i = 0; i < nodes.length; i++) if (nodes[i].checked && nodes[i].form === form) return nodes[i];
};
var isTabbableRadio = function isTabbableRadio2(node) {
	if (!node.name) return true;
	var radioScope = node.form || getRootNode(node);
	var queryRadios = function queryRadios2(name) {
		return radioScope.querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]");
	};
	var radioSet;
	if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") radioSet = queryRadios(window.CSS.escape(node.name));
	else try {
		radioSet = queryRadios(node.name);
	} catch (err) {
		console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
		return false;
	}
	var checked = getCheckedRadio(radioSet, node.form);
	return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
	return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
	return isRadio(node) && !isTabbableRadio(node);
};
var isZeroArea = function isZeroArea2(node) {
	var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
	return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
	var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
	if (getComputedStyle(node).visibility === "hidden") return true;
	var nodeUnderDetails = matches.call(node, "details>summary:first-of-type") ? node.parentElement : node;
	if (matches.call(nodeUnderDetails, "details:not([open]) *")) return true;
	var nodeRootHost = getRootNode(node).host;
	var nodeIsAttached = (nodeRootHost === null || nodeRootHost === void 0 ? void 0 : nodeRootHost.ownerDocument.contains(nodeRootHost)) || node.ownerDocument.contains(node);
	if (!displayCheck || displayCheck === "full") {
		if (typeof getShadowRoot === "function") {
			var originalNode = node;
			while (node) {
				var parentElement = node.parentElement;
				var rootNode = getRootNode(node);
				if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) return isZeroArea(node);
				else if (node.assignedSlot) node = node.assignedSlot;
				else if (!parentElement && rootNode !== node.ownerDocument) node = rootNode.host;
				else node = parentElement;
			}
			node = originalNode;
		}
		if (nodeIsAttached) return !node.getClientRects().length;
	} else if (displayCheck === "non-zero-area") return isZeroArea(node);
	return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
		var parentNode = node.parentElement;
		while (parentNode) {
			if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
				for (var i = 0; i < parentNode.children.length; i++) {
					var child = parentNode.children.item(i);
					if (child.tagName === "LEGEND") return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
				}
				return true;
			}
			parentNode = parentNode.parentElement;
		}
	}
	return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
	if (node.disabled || isHiddenInput(node) || isHidden(node, options) || isDetailsWithSummary(node) || isDisabledFromFieldset(node)) return false;
	return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
	if (isNonTabbableRadio(node) || getTabindex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) return false;
	return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
	var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
	if (isNaN(tabIndex) || tabIndex >= 0) return true;
	return false;
};
var sortByOrder = function sortByOrder2(candidates) {
	var regularTabbables = [];
	var orderedTabbables = [];
	candidates.forEach(function(item, i) {
		var isScope = !!item.scope;
		var element = isScope ? item.scope : item;
		var candidateTabindex = getTabindex(element, isScope);
		var elements = isScope ? sortByOrder2(item.candidates) : element;
		if (candidateTabindex === 0) isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
		else orderedTabbables.push({
			documentOrder: i,
			tabIndex: candidateTabindex,
			item,
			isScope,
			content: elements
		});
	});
	return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
		sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
		return acc;
	}, []).concat(regularTabbables);
};
var tabbable = function tabbable2(el, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = getCandidatesIteratively([el], options.includeContainer, {
		filter: isNodeMatchingSelectorTabbable.bind(null, options),
		flatten: false,
		getShadowRoot: options.getShadowRoot,
		shadowRootFilter: isValidShadowRootTabbable
	});
	else candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
	return sortByOrder(candidates);
};
var focusable = function focusable2(el, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = getCandidatesIteratively([el], options.includeContainer, {
		filter: isNodeMatchingSelectorFocusable.bind(null, options),
		flatten: true,
		getShadowRoot: options.getShadowRoot
	});
	else candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
	return candidates;
};
var isTabbable = function isTabbable2(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, candidateSelector) === false) return false;
	return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, focusableCandidateSelector) === false) return false;
	return isNodeMatchingSelectorFocusable(options, node);
};
function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		enumerableOnly && (symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		})), keys.push.apply(keys, symbols);
	}
	return keys;
}
function _objectSpread2(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = null != arguments[i] ? arguments[i] : {};
		i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
			_defineProperty(target, key, source[key]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
var activeFocusTraps = function() {
	var trapQueue = [];
	return {
		activateTrap: function activateTrap(trap) {
			if (trapQueue.length > 0) {
				var activeTrap = trapQueue[trapQueue.length - 1];
				if (activeTrap !== trap) activeTrap.pause();
			}
			var trapIndex = trapQueue.indexOf(trap);
			if (trapIndex === -1) trapQueue.push(trap);
			else {
				trapQueue.splice(trapIndex, 1);
				trapQueue.push(trap);
			}
		},
		deactivateTrap: function deactivateTrap(trap) {
			var trapIndex = trapQueue.indexOf(trap);
			if (trapIndex !== -1) trapQueue.splice(trapIndex, 1);
			if (trapQueue.length > 0) trapQueue[trapQueue.length - 1].unpause();
		}
	};
}();
var isSelectableInput = function isSelectableInput2(node) {
	return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent2(e) {
	return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
};
var isTabEvent = function isTabEvent2(e) {
	return e.key === "Tab" || e.keyCode === 9;
};
var delay = function delay2(fn) {
	return setTimeout(fn, 0);
};
var findIndex = function findIndex2(arr, fn) {
	var idx = -1;
	arr.every(function(value, i) {
		if (fn(value)) {
			idx = i;
			return false;
		}
		return true;
	});
	return idx;
};
var valueOrHandler = function valueOrHandler2(value) {
	for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) params[_key - 1] = arguments[_key];
	return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget2(event) {
	return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
};
var createFocusTrap = function createFocusTrap2(elements, userOptions) {
	var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
	var config = _objectSpread2({
		returnFocusOnDeactivate: true,
		escapeDeactivates: true,
		delayInitialFocus: true
	}, userOptions);
	var state = {
		containers: [],
		containerGroups: [],
		tabbableGroups: [],
		nodeFocusedBeforeActivation: null,
		mostRecentlyFocusedNode: null,
		active: false,
		paused: false,
		delayInitialFocusTimer: void 0
	};
	var trap;
	var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
		return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
	};
	var findContainerIndex = function findContainerIndex2(element) {
		return state.containerGroups.findIndex(function(_ref) {
			var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
			return container.contains(element) || tabbableNodes.find(function(node) {
				return node === element;
			});
		});
	};
	var getNodeForOption = function getNodeForOption2(optionName) {
		var optionValue = config[optionName];
		if (typeof optionValue === "function") {
			for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) params[_key2 - 1] = arguments[_key2];
			optionValue = optionValue.apply(void 0, params);
		}
		if (optionValue === true) optionValue = void 0;
		if (!optionValue) {
			if (optionValue === void 0 || optionValue === false) return optionValue;
			throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
		}
		var node = optionValue;
		if (typeof optionValue === "string") {
			node = doc.querySelector(optionValue);
			if (!node) throw new Error("`".concat(optionName, "` as selector refers to no known node"));
		}
		return node;
	};
	var getInitialFocusNode = function getInitialFocusNode2() {
		var node = getNodeForOption("initialFocus");
		if (node === false) return false;
		if (node === void 0) if (findContainerIndex(doc.activeElement) >= 0) node = doc.activeElement;
		else {
			var firstTabbableGroup = state.tabbableGroups[0];
			node = firstTabbableGroup && firstTabbableGroup.firstTabbableNode || getNodeForOption("fallbackFocus");
		}
		if (!node) throw new Error("Your focus-trap needs to have at least one focusable element");
		return node;
	};
	var updateTabbableNodes = function updateTabbableNodes2() {
		state.containerGroups = state.containers.map(function(container) {
			var tabbableNodes = tabbable(container, config.tabbableOptions);
			var focusableNodes = focusable(container, config.tabbableOptions);
			return {
				container,
				tabbableNodes,
				focusableNodes,
				firstTabbableNode: tabbableNodes.length > 0 ? tabbableNodes[0] : null,
				lastTabbableNode: tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : null,
				nextTabbableNode: function nextTabbableNode(node) {
					var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
					var nodeIdx = focusableNodes.findIndex(function(n) {
						return n === node;
					});
					if (nodeIdx < 0) return;
					if (forward) return focusableNodes.slice(nodeIdx + 1).find(function(n) {
						return isTabbable(n, config.tabbableOptions);
					});
					return focusableNodes.slice(0, nodeIdx).reverse().find(function(n) {
						return isTabbable(n, config.tabbableOptions);
					});
				}
			};
		});
		state.tabbableGroups = state.containerGroups.filter(function(group) {
			return group.tabbableNodes.length > 0;
		});
		if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
	};
	var tryFocus = function tryFocus2(node) {
		if (node === false) return;
		if (node === doc.activeElement) return;
		if (!node || !node.focus) {
			tryFocus2(getInitialFocusNode());
			return;
		}
		node.focus({ preventScroll: !!config.preventScroll });
		state.mostRecentlyFocusedNode = node;
		if (isSelectableInput(node)) node.select();
	};
	var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
		var node = getNodeForOption("setReturnFocus", previousActiveElement);
		return node ? node : node === false ? false : previousActiveElement;
	};
	var checkPointerDown = function checkPointerDown2(e) {
		var target = getActualTarget(e);
		if (findContainerIndex(target) >= 0) return;
		if (valueOrHandler(config.clickOutsideDeactivates, e)) {
			trap.deactivate({ returnFocus: config.returnFocusOnDeactivate && !isFocusable(target, config.tabbableOptions) });
			return;
		}
		if (valueOrHandler(config.allowOutsideClick, e)) return;
		e.preventDefault();
	};
	var checkFocusIn = function checkFocusIn2(e) {
		var target = getActualTarget(e);
		var targetContained = findContainerIndex(target) >= 0;
		if (targetContained || target instanceof Document) {
			if (targetContained) state.mostRecentlyFocusedNode = target;
		} else {
			e.stopImmediatePropagation();
			tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
		}
	};
	var checkTab = function checkTab2(e) {
		var target = getActualTarget(e);
		updateTabbableNodes();
		var destinationNode = null;
		if (state.tabbableGroups.length > 0) {
			var containerIndex = findContainerIndex(target);
			var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
			if (containerIndex < 0) if (e.shiftKey) destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
			else destinationNode = state.tabbableGroups[0].firstTabbableNode;
			else if (e.shiftKey) {
				var startOfGroupIndex = findIndex(state.tabbableGroups, function(_ref2) {
					return target === _ref2.firstTabbableNode;
				});
				if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) startOfGroupIndex = containerIndex;
				if (startOfGroupIndex >= 0) {
					var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
					destinationNode = state.tabbableGroups[destinationGroupIndex].lastTabbableNode;
				}
			} else {
				var lastOfGroupIndex = findIndex(state.tabbableGroups, function(_ref3) {
					return target === _ref3.lastTabbableNode;
				});
				if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) lastOfGroupIndex = containerIndex;
				if (lastOfGroupIndex >= 0) {
					var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
					destinationNode = state.tabbableGroups[_destinationGroupIndex].firstTabbableNode;
				}
			}
		} else destinationNode = getNodeForOption("fallbackFocus");
		if (destinationNode) {
			e.preventDefault();
			tryFocus(destinationNode);
		}
	};
	var checkKey = function checkKey2(e) {
		if (isEscapeEvent(e) && valueOrHandler(config.escapeDeactivates, e) !== false) {
			e.preventDefault();
			trap.deactivate();
			return;
		}
		if (isTabEvent(e)) {
			checkTab(e);
			return;
		}
	};
	var checkClick = function checkClick2(e) {
		if (findContainerIndex(getActualTarget(e)) >= 0) return;
		if (valueOrHandler(config.clickOutsideDeactivates, e)) return;
		if (valueOrHandler(config.allowOutsideClick, e)) return;
		e.preventDefault();
		e.stopImmediatePropagation();
	};
	var addListeners = function addListeners2() {
		if (!state.active) return;
		activeFocusTraps.activateTrap(trap);
		state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function() {
			tryFocus(getInitialFocusNode());
		}) : tryFocus(getInitialFocusNode());
		doc.addEventListener("focusin", checkFocusIn, true);
		doc.addEventListener("mousedown", checkPointerDown, {
			capture: true,
			passive: false
		});
		doc.addEventListener("touchstart", checkPointerDown, {
			capture: true,
			passive: false
		});
		doc.addEventListener("click", checkClick, {
			capture: true,
			passive: false
		});
		doc.addEventListener("keydown", checkKey, {
			capture: true,
			passive: false
		});
		return trap;
	};
	var removeListeners = function removeListeners2() {
		if (!state.active) return;
		doc.removeEventListener("focusin", checkFocusIn, true);
		doc.removeEventListener("mousedown", checkPointerDown, true);
		doc.removeEventListener("touchstart", checkPointerDown, true);
		doc.removeEventListener("click", checkClick, true);
		doc.removeEventListener("keydown", checkKey, true);
		return trap;
	};
	trap = {
		get active() {
			return state.active;
		},
		get paused() {
			return state.paused;
		},
		activate: function activate(activateOptions) {
			if (state.active) return this;
			var onActivate = getOption(activateOptions, "onActivate");
			var onPostActivate = getOption(activateOptions, "onPostActivate");
			var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
			if (!checkCanFocusTrap) updateTabbableNodes();
			state.active = true;
			state.paused = false;
			state.nodeFocusedBeforeActivation = doc.activeElement;
			if (onActivate) onActivate();
			var finishActivation = function finishActivation2() {
				if (checkCanFocusTrap) updateTabbableNodes();
				addListeners();
				if (onPostActivate) onPostActivate();
			};
			if (checkCanFocusTrap) {
				checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
				return this;
			}
			finishActivation();
			return this;
		},
		deactivate: function deactivate(deactivateOptions) {
			if (!state.active) return this;
			var options = _objectSpread2({
				onDeactivate: config.onDeactivate,
				onPostDeactivate: config.onPostDeactivate,
				checkCanReturnFocus: config.checkCanReturnFocus
			}, deactivateOptions);
			clearTimeout(state.delayInitialFocusTimer);
			state.delayInitialFocusTimer = void 0;
			removeListeners();
			state.active = false;
			state.paused = false;
			activeFocusTraps.deactivateTrap(trap);
			var onDeactivate = getOption(options, "onDeactivate");
			var onPostDeactivate = getOption(options, "onPostDeactivate");
			var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
			var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
			if (onDeactivate) onDeactivate();
			var finishDeactivation = function finishDeactivation2() {
				delay(function() {
					if (returnFocus) tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
					if (onPostDeactivate) onPostDeactivate();
				});
			};
			if (returnFocus && checkCanReturnFocus) {
				checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
				return this;
			}
			finishDeactivation();
			return this;
		},
		pause: function pause() {
			if (state.paused || !state.active) return this;
			state.paused = true;
			removeListeners();
			return this;
		},
		unpause: function unpause() {
			if (!state.paused || !state.active) return this;
			state.paused = false;
			updateTabbableNodes();
			addListeners();
			return this;
		},
		updateContainerElements: function updateContainerElements(containerElements) {
			state.containers = [].concat(containerElements).filter(Boolean).map(function(element) {
				return typeof element === "string" ? doc.querySelector(element) : element;
			});
			if (state.active) updateTabbableNodes();
			return this;
		}
	};
	trap.updateContainerElements(elements);
	return trap;
};
function src_default$1(Alpine) {
	let lastFocused;
	let currentFocused;
	window.addEventListener("focusin", () => {
		lastFocused = currentFocused;
		currentFocused = document.activeElement;
	});
	Alpine.magic("focus", (el) => {
		let within = el;
		return {
			__noscroll: false,
			__wrapAround: false,
			within(el2) {
				within = el2;
				return this;
			},
			withoutScrolling() {
				this.__noscroll = true;
				return this;
			},
			noscroll() {
				this.__noscroll = true;
				return this;
			},
			withWrapAround() {
				this.__wrapAround = true;
				return this;
			},
			wrap() {
				return this.withWrapAround();
			},
			focusable(el2) {
				return isFocusable(el2);
			},
			previouslyFocused() {
				return lastFocused;
			},
			lastFocused() {
				return lastFocused;
			},
			focused() {
				return currentFocused;
			},
			focusables() {
				if (Array.isArray(within)) return within;
				return focusable(within, { displayCheck: "none" });
			},
			all() {
				return this.focusables();
			},
			isFirst(el2) {
				let els = this.all();
				return els[0] && els[0].isSameNode(el2);
			},
			isLast(el2) {
				let els = this.all();
				return els.length && els.slice(-1)[0].isSameNode(el2);
			},
			getFirst() {
				return this.all()[0];
			},
			getLast() {
				return this.all().slice(-1)[0];
			},
			getNext() {
				let list = this.all();
				let current = document.activeElement;
				if (list.indexOf(current) === -1) return;
				if (this.__wrapAround && list.indexOf(current) === list.length - 1) return list[0];
				return list[list.indexOf(current) + 1];
			},
			getPrevious() {
				let list = this.all();
				let current = document.activeElement;
				if (list.indexOf(current) === -1) return;
				if (this.__wrapAround && list.indexOf(current) === 0) return list.slice(-1)[0];
				return list[list.indexOf(current) - 1];
			},
			first() {
				this.focus(this.getFirst());
			},
			last() {
				this.focus(this.getLast());
			},
			next() {
				this.focus(this.getNext());
			},
			previous() {
				this.focus(this.getPrevious());
			},
			prev() {
				return this.previous();
			},
			focus(el2) {
				if (!el2) return;
				setTimeout(() => {
					if (!el2.hasAttribute("tabindex")) el2.setAttribute("tabindex", "0");
					el2.focus({ preventScroll: this.__noscroll });
				});
			}
		};
	});
	Alpine.directive("trap", Alpine.skipDuringClone((el, { expression, modifiers }, { effect, evaluateLater, cleanup }) => {
		let evaluator = evaluateLater(expression);
		let oldValue = false;
		let options = {
			escapeDeactivates: false,
			allowOutsideClick: true,
			fallbackFocus: () => el
		};
		let undoInert = () => {};
		if (modifiers.includes("noautofocus")) options.initialFocus = false;
		else {
			let autofocusEl = el.querySelector("[autofocus]");
			if (autofocusEl) options.initialFocus = autofocusEl;
		}
		if (modifiers.includes("inert")) options.onPostActivate = () => {
			Alpine.nextTick(() => {
				undoInert = setInert(el);
			});
		};
		let trap = createFocusTrap(el, options);
		let undoDisableScrolling = () => {};
		const releaseFocus = () => {
			undoInert();
			undoInert = () => {};
			undoDisableScrolling();
			undoDisableScrolling = () => {};
			trap.deactivate({ returnFocus: !modifiers.includes("noreturn") });
		};
		effect(() => evaluator((value) => {
			if (oldValue === value) return;
			if (value && !oldValue) {
				if (modifiers.includes("noscroll")) undoDisableScrolling = disableScrolling();
				setTimeout(() => {
					trap.activate();
				}, 15);
			}
			if (!value && oldValue) releaseFocus();
			oldValue = !!value;
		}));
		cleanup(releaseFocus);
	}, (el, { expression, modifiers }, { evaluate }) => {
		if (modifiers.includes("inert") && evaluate(expression)) setInert(el);
	}));
}
function setInert(el) {
	let undos = [];
	crawlSiblingsUp(el, (sibling) => {
		let cache = sibling.hasAttribute("aria-hidden");
		sibling.setAttribute("aria-hidden", "true");
		undos.push(() => cache || sibling.removeAttribute("aria-hidden"));
	});
	return () => {
		while (undos.length) undos.pop()();
	};
}
function crawlSiblingsUp(el, callback) {
	if (el.isSameNode(document.body) || !el.parentNode) return;
	Array.from(el.parentNode.children).forEach((sibling) => {
		if (sibling.isSameNode(el)) crawlSiblingsUp(el.parentNode, callback);
		else callback(sibling);
	});
}
function disableScrolling() {
	let overflow = document.documentElement.style.overflow;
	let paddingRight = document.documentElement.style.paddingRight;
	let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
	document.documentElement.style.overflow = "hidden";
	document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
	return () => {
		document.documentElement.style.overflow = overflow;
		document.documentElement.style.paddingRight = paddingRight;
	};
}
var module_default$1 = src_default$1;
/*! Bundled license information:

tabbable/dist/index.esm.js:
(*!
* tabbable 5.3.3
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*)

focus-trap/dist/focus-trap.esm.js:
(*!
* focus-trap 6.9.4
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*)
*/
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (!!importerUrl) for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region node_modules/async-alpine/dist/async-alpine.esm.js
function eager() {
	return true;
}
function event({ component, argument }) {
	return new Promise((resolve) => {
		if (argument) window.addEventListener(argument, () => resolve(), { once: true });
		else {
			const cb = (e) => {
				if (e.detail.id !== component.id) return;
				window.removeEventListener("async-alpine:load", cb);
				resolve();
			};
			window.addEventListener("async-alpine:load", cb);
		}
	});
}
function idle() {
	return new Promise((resolve) => {
		if ("requestIdleCallback" in window) window.requestIdleCallback(resolve);
		else setTimeout(resolve, 200);
	});
}
function media({ argument }) {
	return new Promise((resolve) => {
		if (!argument) {
			console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'");
			return resolve();
		}
		const mediaQuery = window.matchMedia(`(${argument})`);
		if (mediaQuery.matches) resolve();
		else mediaQuery.addEventListener("change", resolve, { once: true });
	});
}
function visible({ component, argument }) {
	return new Promise((resolve) => {
		const rootMargin = argument || "0px 0px 0px 0px";
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				observer.disconnect();
				resolve();
			}
		}, { rootMargin });
		observer.observe(component.el);
	});
}
var strategies_default = {
	eager,
	event,
	idle,
	media,
	visible
};
async function awaitRequirements(component) {
	await generateRequirements(component, parseRequirements(component.strategy));
}
async function generateRequirements(component, requirements) {
	if (requirements.type === "expression") {
		if (requirements.operator === "&&") return Promise.all(requirements.parameters.map((param) => generateRequirements(component, param)));
		if (requirements.operator === "||") return Promise.any(requirements.parameters.map((param) => generateRequirements(component, param)));
	}
	if (!strategies_default[requirements.method]) return false;
	return strategies_default[requirements.method]({
		component,
		argument: requirements.argument
	});
}
function parseRequirements(expression) {
	let ast = parseExpression(tokenize(expression));
	if (ast.type === "method") return {
		type: "expression",
		operator: "&&",
		parameters: [ast]
	};
	return ast;
}
function tokenize(expression) {
	const regex = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g;
	const tokens = [];
	let match;
	while ((match = regex.exec(expression)) !== null) {
		const [_, parenthesis, operator, token] = match;
		if (parenthesis !== void 0) tokens.push({
			type: "parenthesis",
			value: parenthesis
		});
		else if (operator !== void 0) tokens.push({
			type: "operator",
			value: operator === "|" ? "&&" : operator
		});
		else {
			const tokenObj = {
				type: "method",
				method: token.trim()
			};
			if (token.includes("(")) {
				tokenObj.method = token.substring(0, token.indexOf("(")).trim();
				tokenObj.argument = token.substring(token.indexOf("(") + 1, token.indexOf(")"));
			}
			if (token.method === "immediate") token.method = "eager";
			tokens.push(tokenObj);
		}
	}
	return tokens;
}
function parseExpression(tokens) {
	let ast = parseTerm(tokens);
	while (tokens.length > 0 && (tokens[0].value === "&&" || tokens[0].value === "|" || tokens[0].value === "||")) {
		const operator = tokens.shift().value;
		const right = parseTerm(tokens);
		if (ast.type === "expression" && ast.operator === operator) ast.parameters.push(right);
		else ast = {
			type: "expression",
			operator,
			parameters: [ast, right]
		};
	}
	return ast;
}
function parseTerm(tokens) {
	if (tokens[0].value === "(") {
		tokens.shift();
		const ast = parseExpression(tokens);
		if (tokens[0].value === ")") tokens.shift();
		return ast;
	} else return tokens.shift();
}
function async_alpine_default(Alpine) {
	const directive = "load";
	const srcAttr = Alpine.prefixed("load-src");
	const ignoreAttr = Alpine.prefixed("ignore");
	let options = {
		defaultStrategy: "eager",
		keepRelativeURLs: false
	};
	let alias = false;
	let data = {};
	let realIndex = 0;
	function index() {
		return realIndex++;
	}
	Alpine.asyncOptions = (opts) => {
		options = {
			...options,
			...opts
		};
	};
	Alpine.asyncData = (name, download2 = false) => {
		data[name] = {
			loaded: false,
			download: download2
		};
	};
	Alpine.asyncUrl = (name, url) => {
		if (!name || !url || data[name]) return;
		data[name] = {
			loaded: false,
			download: () => __vitePreload(() => import(
				/* @vite-ignore */
				/* webpackIgnore: true */
				parseUrl(url)
), [], import.meta.url)
		};
	};
	Alpine.asyncAlias = (path) => {
		alias = path;
	};
	const syncHandler = (el) => {
		Alpine.skipDuringClone(() => {
			if (el._x_async) return;
			el._x_async = "init";
			el._x_ignore = true;
			el.setAttribute(ignoreAttr, "");
		})();
	};
	const handler = async (el) => {
		Alpine.skipDuringClone(async () => {
			if (el._x_async !== "init") return;
			el._x_async = "await";
			const { name, strategy } = elementPrep(el);
			await awaitRequirements({
				name,
				strategy,
				el,
				id: el.id || index()
			});
			if (!el.isConnected) return;
			await download(name);
			if (!el.isConnected) return;
			activate(el);
			el._x_async = "loaded";
		})();
	};
	handler.inline = syncHandler;
	Alpine.directive(directive, handler).before("ignore");
	function elementPrep(el) {
		const name = parseName(el.getAttribute(Alpine.prefixed("data")));
		const strategy = el.getAttribute(Alpine.prefixed(directive)) || options.defaultStrategy;
		const urlAttributeValue = el.getAttribute(srcAttr);
		if (urlAttributeValue) Alpine.asyncUrl(name, urlAttributeValue);
		return {
			name,
			strategy
		};
	}
	async function download(name) {
		if (name.startsWith("_x_async_")) return;
		handleAlias(name);
		if (!data[name] || data[name].loaded) return;
		const module = await getModule(name);
		Alpine.data(name, module);
		data[name].loaded = true;
	}
	async function getModule(name) {
		if (!data[name]) return;
		const module = await data[name].download(name);
		if (typeof module === "function") return module;
		return module[name] || module.default || Object.values(module)[0] || false;
	}
	function activate(el) {
		Alpine.destroyTree(el);
		el._x_ignore = false;
		el.removeAttribute(ignoreAttr);
		if (el.closest(`[${ignoreAttr}]`)) return;
		Alpine.initTree(el);
	}
	function handleAlias(name) {
		if (!alias || data[name]) return;
		if (typeof alias === "function") {
			Alpine.asyncData(name, alias);
			return;
		}
		Alpine.asyncUrl(name, alias.replaceAll("[name]", name));
	}
	function parseName(attribute) {
		return (attribute || "").trim().split(/[({]/g)[0] || `_x_async_${index()}`;
	}
	function parseUrl(url) {
		if (options.keepRelativeURLs) return url;
		if (!(/* @__PURE__ */ new RegExp("^(?:[a-z+]+:)?//", "i")).test(url)) return new URL(url, document.baseURI).href;
		return url;
	}
}
//#endregion
//#region node_modules/@alpinejs/intersect/dist/module.esm.js
function src_default(Alpine) {
	Alpine.directive("intersect", Alpine.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
		let evaluate = evaluateLater(expression);
		let options = {
			rootMargin: getRootMargin(modifiers),
			threshold: getThreshold(modifiers)
		};
		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting === (value === "leave")) return;
				evaluate();
				modifiers.includes("once") && observer.disconnect();
			});
		}, options);
		observer.observe(el);
		cleanup(() => {
			observer.disconnect();
		});
	}));
}
function getThreshold(modifiers) {
	if (modifiers.includes("full")) return .99;
	if (modifiers.includes("half")) return .5;
	if (!modifiers.includes("threshold")) return 0;
	let threshold = modifiers[modifiers.indexOf("threshold") + 1];
	if (threshold === "100") return 1;
	if (threshold === "0") return 0;
	return Number(`.${threshold}`);
}
function getLengthValue(rawValue) {
	let match = rawValue.match(/^(-?[0-9]+)(px|%)?$/);
	return match ? match[1] + (match[2] || "px") : void 0;
}
function getRootMargin(modifiers) {
	const key = "margin";
	const fallback = "0px 0px 0px 0px";
	const index = modifiers.indexOf(key);
	if (index === -1) return fallback;
	let values = [];
	for (let i = 1; i < 5; i++) values.push(getLengthValue(modifiers[index + i] || ""));
	values = values.filter((v) => v !== void 0);
	return values.length ? values.join(" ").trim() : fallback;
}
var module_default = src_default;
//#endregion
//#region node_modules/simple-notify/dist/simple-notify.mjs
function t(t, e) {
	if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function e(t, e) {
	for (var s = 0; s < e.length; s++) {
		var i = e[s];
		i.enumerable = i.enumerable || false;
		i.configurable = true;
		if ("value" in i) i.writable = true;
		Object.defineProperty(t, i.key, i);
	}
}
function s(t, s, i) {
	if (s) e(t.prototype, s);
	if (i) e(t, i);
	return t;
}
var i = Object.defineProperty;
var n = function(t, e) {
	return i(t, "name", {
		value: e,
		configurable: !0
	});
};
var o = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n  <path d=\"m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z\" fill=\"currentColor\"/>\r\n</svg>\r\n";
var a = "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n  <path d=\"M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z\" fill=\"currentColor\"/>\r\n</svg>\r\n";
var r = "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n  <path d=\"M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z\" fill=\"currentColor\"/>\r\n</svg>\r\n";
var c = "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n  <path d=\"m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z\" fill=\"currentColor\"/>\r\n</svg>\r\n";
var l = "<svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n  <path d=\"M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z\" fill=\"currentColor\"/>\r\n</svg>\r\n";
var h = n(function(t) {
	return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), d = n(function(t) {
	var e = new DOMParser().parseFromString(t, "application/xml");
	return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode");
var u = {
	CONTAINER: "sn-notifications-container",
	NOTIFY: "sn-notify",
	NOTIFY_CONTENT: "sn-notify-content",
	NOTIFY_ICON: "sn-notify-icon",
	NOTIFY_CLOSE: "sn-notify-close",
	NOTIFY_TITLE: "sn-notify-title",
	NOTIFY_TEXT: "sn-notify-text",
	IS_X_CENTER: "sn-is-x-center",
	IS_Y_CENTER: "sn-is-y-center",
	IS_CENTER: "sn-is-center",
	IS_LEFT: "sn-is-left",
	IS_RIGHT: "sn-is-right",
	IS_TOP: "sn-is-top",
	IS_BOTTOM: "sn-is-bottom",
	NOTIFY_OUTLINE: "sn-notify-outline",
	NOTIFY_FILLED: "sn-notify-filled",
	NOTIFY_ERROR: "sn-notify-error",
	NOTIFY_WARNING: "sn-notify-warning",
	NOTIFY_SUCCESS: "sn-notify-success",
	NOTIFY_INFO: "sn-notify-info",
	NOTIFY_FADE: "sn-notify-fade",
	NOTIFY_FADE_IN: "sn-notify-fade-in",
	NOTIFY_SLIDE: "sn-notify-slide",
	NOTIFY_SLIDE_IN: "sn-notify-slide-in",
	NOTIFY_AUTOCLOSE: "sn-notify-autoclose"
}, f = {
	ERROR: "error",
	WARNING: "warning",
	SUCCESS: "success",
	INFO: "info"
}, p = {
	OUTLINE: "outline",
	FILLED: "filled"
}, I = {
	FADE: "fade",
	SLIDE: "slide"
}, v = {
	CLOSE: d(o),
	SUCCESS: d(c),
	ERROR: d(a),
	WARNING: d(l),
	INFO: d(r)
};
var N = n(function(t) {
	t.wrapper.classList.add(u.NOTIFY_FADE), setTimeout(function() {
		t.wrapper.classList.add(u.NOTIFY_FADE_IN);
	}, 100);
}, "fadeIn"), O = n(function(t) {
	t.wrapper.classList.remove(u.NOTIFY_FADE_IN), setTimeout(function() {
		t.wrapper.remove();
	}, t.speed);
}, "fadeOut"), T = n(function(t) {
	t.wrapper.classList.add(u.NOTIFY_SLIDE), setTimeout(function() {
		t.wrapper.classList.add(u.NOTIFY_SLIDE_IN);
	}, 100);
}, "slideIn"), E = n(function(t) {
	t.wrapper.classList.remove(u.NOTIFY_SLIDE_IN), setTimeout(function() {
		t.wrapper.remove();
	}, t.speed);
}, "slideOut");
var m = function() {
	"use strict";
	function e(s) {
		var i = this;
		t(this, e);
		this.notifyOut = n(function(t) {
			t(i);
		}, "notifyOut");
		var o = s.notificationsGap, a = o === void 0 ? 20 : o, r = s.notificationsPadding, c = r === void 0 ? 20 : r, l = s.status, h = l === void 0 ? "success" : l, d = s.effect, u = d === void 0 ? I.FADE : d, f = s.type, p = f === void 0 ? "outline" : f, v = s.title, N = s.text, O = s.showIcon, T = O === void 0 ? !0 : O, E = s.customIcon, m = E === void 0 ? "" : E, w = s.customClass, y = w === void 0 ? "" : w, L = s.speed, C = L === void 0 ? 500 : L, F = s.showCloseButton, _ = F === void 0 ? !0 : F, S = s.autoclose, g = S === void 0 ? !0 : S, R = s.autotimeout, Y = R === void 0 ? 3e3 : R, x = s.position, A = x === void 0 ? "right top" : x, b = s.customWrapper;
		if (this.customWrapper = b === void 0 ? "" : b, this.status = h, this.title = v, this.text = N, this.showIcon = T, this.customIcon = m, this.customClass = y, this.speed = C, this.effect = u, this.showCloseButton = _, this.autoclose = g, this.autotimeout = Y, this.notificationsGap = a, this.notificationsPadding = c, this.type = p, this.position = A, !this.checkRequirements()) {
			console.error("You must specify 'title' or 'text' at least.");
			return;
		}
		this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
	}
	s(e, [
		{
			key: "checkRequirements",
			value: function t() {
				return !!(this.title || this.text);
			}
		},
		{
			key: "setContainer",
			value: function t() {
				var t = document.querySelector(".".concat(u.CONTAINER));
				t ? this.container = t : (this.container = document.createElement("div"), this.container.classList.add(u.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
			}
		},
		{
			key: "setPosition",
			value: function t() {
				this.container.classList[this.position === "center" ? "add" : "remove"](u.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](u.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](u.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](u.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](u.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](u.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](u.IS_Y_CENTER);
			}
		},
		{
			key: "setCloseButton",
			value: function t() {
				var t = this;
				var e = document.createElement("div");
				e.classList.add(u.NOTIFY_CLOSE), e.innerHTML = v.CLOSE, this.wrapper.appendChild(e), e.addEventListener("click", function() {
					t.close();
				});
			}
		},
		{
			key: "setWrapper",
			value: function t() {
				var t = this;
				switch (this.customWrapper ? this.wrapper = h(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(u.NOTIFY), this.type) {
					case p.OUTLINE:
						this.wrapper.classList.add(u.NOTIFY_OUTLINE);
						break;
					case p.FILLED:
						this.wrapper.classList.add(u.NOTIFY_FILLED);
						break;
					default: this.wrapper.classList.add(u.NOTIFY_OUTLINE);
				}
				switch (this.status) {
					case f.SUCCESS:
						this.wrapper.classList.add(u.NOTIFY_SUCCESS);
						break;
					case f.ERROR:
						this.wrapper.classList.add(u.NOTIFY_ERROR);
						break;
					case f.WARNING:
						this.wrapper.classList.add(u.NOTIFY_WARNING);
						break;
					case f.INFO:
						this.wrapper.classList.add(u.NOTIFY_INFO);
						break;
				}
				this.autoclose && (this.wrapper.classList.add(u.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(e) {
					t.wrapper.classList.add(e);
				});
			}
		},
		{
			key: "setContent",
			value: function t() {
				var t = document.createElement("div");
				t.classList.add(u.NOTIFY_CONTENT);
				var e, s;
				this.title && (e = document.createElement("div"), e.classList.add(u.NOTIFY_TITLE), e.textContent = this.title.trim(), this.showCloseButton || (e.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(u.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(t), this.title && t.appendChild(e), this.text && t.appendChild(s);
			}
		},
		{
			key: "setIcon",
			value: function t() {
				var t = n(function(t) {
					switch (t) {
						case f.SUCCESS: return v.SUCCESS;
						case f.ERROR: return v.ERROR;
						case f.WARNING: return v.WARNING;
						case f.INFO: return v.INFO;
					}
				}, "computedIcon"), e = document.createElement("div");
				e.classList.add(u.NOTIFY_ICON), e.innerHTML = this.customIcon || t(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(e);
			}
		},
		{
			key: "setObserver",
			value: function t() {
				var t = this;
				var e = new IntersectionObserver(function(e) {
					if (e[0].intersectionRatio <= 0) t.close();
					else return;
				}, { threshold: 0 });
				setTimeout(function() {
					e.observe(t.wrapper);
				}, this.speed);
			}
		},
		{
			key: "notifyIn",
			value: function t(t) {
				t(this);
			}
		},
		{
			key: "autoClose",
			value: function t() {
				var t = this;
				setTimeout(function() {
					t.close();
				}, this.autotimeout + this.speed);
			}
		},
		{
			key: "close",
			value: function t() {
				this.notifyOut(this.selectedNotifyOutEffect);
			}
		},
		{
			key: "setEffect",
			value: function t() {
				switch (this.effect) {
					case I.FADE:
						this.selectedNotifyInEffect = N, this.selectedNotifyOutEffect = O;
						break;
					case I.SLIDE:
						this.selectedNotifyInEffect = T, this.selectedNotifyOutEffect = E;
						break;
					default: this.selectedNotifyInEffect = N, this.selectedNotifyOutEffect = O;
				}
			}
		}
	]);
	return e;
}();
n(m, "Notify");
var w = m;
globalThis.Notify = w;
//#endregion
//#region src/js/lib/notify/toast.js
var allowedStatuses = [
	"success",
	"error",
	"warning",
	"info"
];
var allowedPositions = [
	"right top",
	"top right",
	"right bottom",
	"bottom right",
	"left top",
	"top left",
	"left bottom",
	"bottom left",
	"center top",
	"x-center top",
	"center bottom",
	"x-center bottom",
	"left center",
	"left y-center",
	"y-center left",
	"right center",
	"right y-center",
	"y-center right",
	"top center",
	"top x-center",
	"bottom center",
	"bottom x-center",
	"center"
];
var defaultConfig = {
	status: "info",
	title: "Notification",
	text: "",
	effect: "fade",
	speed: 300,
	autoclose: true,
	autotimeout: 4e3,
	position: "right top"
};
function renderToast(options = {}) {
	const config = {
		...defaultConfig,
		...options
	};
	if (!allowedStatuses.includes(config.status)) {
		console.warn(`Invalid status '${config.status}' passed to Toast. Defaulting to 'info'.`);
		config.status = "info";
	}
	if (!allowedPositions.includes(config.position)) {
		console.warn(`Invalid position '${config.position}' passed to Toast. Defaulting to 'right top'.`);
		config.position = "right top";
	}
	new w(config);
}
var Toast = {
	custom: renderToast,
	success(text, title = "Success", options = {}) {
		renderToast({
			status: "success",
			title,
			text,
			...options
		});
	},
	error(text, title = "Error", options = {}) {
		renderToast({
			status: "error",
			title,
			text,
			...options
		});
	},
	warning(text, title = "Warning", options = {}) {
		renderToast({
			status: "warning",
			title,
			text,
			...options
		});
	},
	info(text, title = "Info", options = {}) {
		renderToast({
			status: "info",
			title,
			text,
			...options
		});
	},
	setDefaults(newDefaults = {}) {
		Object.assign(defaultConfig, newDefaults);
	},
	get allowedStatuses() {
		return [...allowedStatuses];
	},
	get allowedPositions() {
		return [...allowedPositions];
	}
};
//#endregion
//#region src/js/lib/alpineData.js
/**
* Helper function to retrieve the Alpine.js x-data state object associated with a component.
*
* This version is teleport-safe and proxy-aware:
* - It accepts either a component **ID** (string) or a **DOM Element**.
* - If the element is an `<rz-proxy data-for="...">`, it resolves that proxy to the real
*   teleported Alpine root (`[data-alpine-root="<id>"]`) before calling `Alpine.$data`.
* - If a string ID is provided, it searches under the local wrapper (if present) and then
*   falls back to a **document-wide** lookup, which works even when the root was teleported.
*
* @prerequisites
*   - Alpine.js (v3+) loaded and initialized globally as `Alpine`.
*   - For string input:
*       The component wrapper SHOULD have `id="<Id>"`, and the Alpine root element SHOULD have
*       `data-alpine-root="<Id>"`. When teleport moves the root, the global fallback will still find it.
*   - For element input:
*       - If the element is an `<rz-proxy data-for="<Id>">`, `$data` will resolve `<Id>`
*         to the actual Alpine root before querying Alpine.
*       - If the element is any other node, `$data` will attempt to read the scope on that
*         element, then fall back to the closest `[x-data]` ancestor.
*
* @param {string | Element} idOrElement
*   - A **string** component ID (the wrapper/root id used by `data-alpine-root`), OR
*   - An **Element** (can be the Alpine root, a descendant, or an `<rz-proxy>`).
*
* @returns {object | undefined}
*   The Alpine x-data state object if found and initialized, otherwise `undefined`.
*   (Mirrors `Alpine.$data` semantics.)
*/
function $data(idOrElement) {
	if (typeof Alpine === "undefined" || typeof Alpine.$data !== "function") {
		console.error("Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data.");
		return;
	}
	if (idOrElement instanceof Element) {
		const target = resolveProxy(idOrElement) || idOrElement;
		let alpineData = Alpine.$data(target);
		if (alpineData === void 0) {
			const nearest = target.closest?.("[x-data]");
			if (nearest) alpineData = Alpine.$data(nearest);
		}
		if (alpineData === void 0) warnDataUndefined("element", target);
		return alpineData;
	}
	if (typeof idOrElement === "string") {
		const componentId = idOrElement.trim();
		if (!componentId) {
			console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
			return;
		}
		const selector = `[data-alpine-root="${cssEscapeSafe(componentId)}"]`;
		let root = null;
		const wrapper = document.getElementById(componentId);
		if (wrapper) root = wrapper.matches(selector) ? wrapper : wrapper.querySelector(selector);
		if (!root) root = findAlpineRootById(componentId);
		if (!root) {
			console.warn(`Rizzy.$data: Could not locate an Alpine root using ${selector} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${componentId}"' is present.`);
			return;
		}
		const alpineData = Alpine.$data(root);
		if (alpineData === void 0) warnDataUndefined(`data-alpine-root="${componentId}"`, root);
		return alpineData;
	}
	console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
/**
* Resolve an `<rz-proxy data-for="...">` element (or any element carrying `data-for`)
* to the *actual* Alpine root for that component id. Non-proxy elements are returned as-is.
*
* @param {Element} el
* @returns {Element|null} The resolved Alpine root element, the original element, or null if not found.
*/
function resolveProxy(el) {
	if (!(el instanceof Element)) return null;
	const isProxyTag = el.tagName?.toLowerCase?.() === "rz-proxy";
	const proxyFor = el.getAttribute?.("data-for");
	if (isProxyTag || proxyFor) {
		const id = proxyFor || "";
		if (!id) return el;
		const root = findAlpineRootById(id);
		if (!root) {
			console.warn(`Rizzy.$data: Proxy element could not resolve Alpine root for id "${id}". Ensure the teleported root rendered with data-alpine-root="${id}".`);
			return null;
		}
		return root;
	}
	return el;
}
/**
* Locate the Alpine root element for a given component id anywhere in document.
* Prefers nodes that actually carry `x-data`.
*
* @param {string} id
* @returns {Element|null}
*/
function findAlpineRootById(id) {
	const sel = `[data-alpine-root="${cssEscapeSafe(id)}"]`;
	const candidates = document.querySelectorAll(sel);
	for (const n of candidates) if (n.hasAttribute("x-data")) return n;
	if (candidates.length > 0) return candidates[0];
	return document.getElementById(id) || null;
}
/**
* Escape a string for safe use inside a CSS attribute selector.
* Falls back to a minimal escape when CSS.escape is unavailable.
*
* @param {string} s
* @returns {string}
*/
function cssEscapeSafe(s) {
	try {
		if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(s);
	} catch (_) {}
	return String(s).replace(/"/g, "\\\"");
}
/**
* Log a helpful warning when Alpine.$data returned undefined for a target.
*
* @param {string} origin - A description of how the target was selected (e.g., 'element' or 'data-alpine-root="id"').
* @param {Element} target
*/
function warnDataUndefined(origin, target) {
	const desc = `${target.tagName?.toLowerCase?.() || "node"}${target.id ? "#" + target.id : ""}${target.classList?.length ? "." + Array.from(target.classList).join(".") : ""}`;
	console.warn(`Rizzy.$data: Located target via ${origin} (${desc}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`);
}
//#endregion
//#region src/js/lib/alpineProps.js
/**
* @file RizzyUI Alpine Props Helper
* @module alpineProps
* @description Provides a utility function to safely read and parse props passed from a Blazor
* RzAlpineComponent to its co-located Alpine.js module.
*/
/**
* Retrieves and parses the JSON props for an Alpine component initialized by RzAlpineComponent.
* It reads the `data-props-id` attribute from the Alpine root element to find the
* corresponding `<script type="application/json">` tag and parses its content.
*
* @param {Element} alpineRootElement - The root DOM element of the Alpine component (typically `this.$el`).
* @returns {object} The parsed JavaScript object from the props JSON. Returns an empty object `{}`
* if the element is invalid, props are not defined, the script tag is not found, or parsing fails.
*/
function props(alpineRootElement) {
	if (!(alpineRootElement instanceof Element)) {
		console.warn("[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el).");
		return {};
	}
	const propsScriptId = alpineRootElement.dataset.propsId;
	if (!propsScriptId) return {};
	const propsScriptEl = document.getElementById(propsScriptId);
	if (!propsScriptEl) {
		console.warn(`[Rizzy.props] Could not find the props script tag with ID '${propsScriptId}'.`);
		return {};
	}
	try {
		return JSON.parse(propsScriptEl.textContent || "{}");
	} catch (e) {
		console.error(`[Rizzy.props] Failed to parse JSON from script tag #${propsScriptId}.`, e);
		return {};
	}
}
//#endregion
//#region src/js/lib/directives/mobile.js
function registerMobileDirective(Alpine) {
	Alpine.directive("mobile", (el, { modifiers, expression }, { cleanup }) => {
		const bpMod = modifiers.find((m) => m.startsWith("bp-"));
		const BREAKPOINT = bpMod ? parseInt(bpMod.slice(3), 10) : 768;
		const ASSIGN_PROP = !!(expression && expression.length > 0);
		if (typeof window === "undefined" || !window.matchMedia) {
			el.dataset.mobile = "false";
			el.dataset.screen = "desktop";
			return;
		}
		const isMobileNow = () => window.innerWidth < BREAKPOINT;
		const reflect = (val) => {
			el.dataset.mobile = val ? "true" : "false";
			el.dataset.screen = val ? "mobile" : "desktop";
		};
		const getComponentData = () => {
			if (typeof Alpine.$data === "function") return Alpine.$data(el);
			return el.__x ? el.__x.$data : null;
		};
		const setProp = (val) => {
			if (!ASSIGN_PROP) return;
			const data = getComponentData();
			if (data) data[expression] = val;
		};
		const dispatch = (val) => {
			el.dispatchEvent(new CustomEvent("screen:change", {
				bubbles: true,
				detail: {
					isMobile: val,
					width: window.innerWidth,
					breakpoint: BREAKPOINT
				}
			}));
		};
		const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
		const update = () => {
			const val = isMobileNow();
			reflect(val);
			setProp(val);
			dispatch(val);
		};
		update();
		const onChange = () => update();
		const onResize = () => update();
		mql.addEventListener("change", onChange);
		window.addEventListener("resize", onResize, { passive: true });
		cleanup(() => {
			mql.removeEventListener("change", onChange);
			window.removeEventListener("resize", onResize);
		});
	});
}
//#endregion
//#region src/js/lib/directives/sync-prop.js
function registerSyncDirective(Alpine) {
	const handler = (el, { expression, modifiers }, { cleanup, effect }) => {
		if (!expression || typeof expression !== "string") return;
		const setAtPath = (obj, path, value) => {
			const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
			const last = keys.pop();
			let cur = obj;
			for (const k of keys) {
				if (cur[k] == null || typeof cur[k] !== "object") cur[k] = isFinite(+k) ? [] : {};
				cur = cur[k];
			}
			cur[last] = value;
		};
		const stack = Alpine.closestDataStack(el) || [];
		const childData = stack[0] || null;
		const parentData = stack[1] || null;
		if (!childData || !parentData) return;
		const pairs = expression.split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
			const m = s.split("->").map((x) => x.trim());
			if (m.length !== 2) {
				console.warn("[x-syncprop] Invalid mapping (expected \"parent.path -> child.path\"): ", s);
				return null;
			}
			return {
				parentPath: m[0],
				childPath: m[1]
			};
		}).filter(Boolean);
		const initChildWins = modifiers.includes("init-child") || modifiers.includes("child") || modifiers.includes("childWins");
		const guard = pairs.map(() => ({
			fromParent: false,
			fromChild: false,
			skipChildOnce: initChildWins
		}));
		const stops = [];
		pairs.forEach((pair, idx) => {
			const g = guard[idx];
			if (initChildWins) {
				const childVal = Alpine.evaluate(el, pair.childPath, { scope: childData });
				g.fromChild = true;
				setAtPath(parentData, pair.parentPath, childVal);
				queueMicrotask(() => {
					g.fromChild = false;
				});
			} else {
				const parentVal = Alpine.evaluate(el, pair.parentPath, { scope: parentData });
				g.fromParent = true;
				setAtPath(childData, pair.childPath, parentVal);
				queueMicrotask(() => {
					g.fromParent = false;
				});
			}
			const stop1 = effect(() => {
				const parentVal = Alpine.evaluate(el, pair.parentPath, { scope: parentData });
				if (g.fromChild) return;
				g.fromParent = true;
				setAtPath(childData, pair.childPath, parentVal);
				queueMicrotask(() => {
					g.fromParent = false;
				});
			});
			const stop2 = effect(() => {
				const childVal = Alpine.evaluate(el, pair.childPath, { scope: childData });
				if (g.fromParent) return;
				if (g.skipChildOnce) {
					g.skipChildOnce = false;
					return;
				}
				g.fromChild = true;
				setAtPath(parentData, pair.parentPath, childVal);
				queueMicrotask(() => {
					g.fromChild = false;
				});
			});
			stops.push(stop1, stop2);
		});
		cleanup(() => {
			for (const stop of stops) try {
				stop && stop();
			} catch {}
		});
	};
	Alpine.directive("syncprop", handler);
}
//#endregion
//#region src/js/lib/directives/validate.js
var validationPromise;
function initializeValidation() {
	if (!validationPromise) validationPromise = __vitePreload(() => import("./validationRuntime-TWSFzr7m.js").then((module) => module.ensureValidationRuntime()), [], import.meta.url);
	return validationPromise;
}
function registerValidateDirective(Alpine, onReady) {
	Alpine.directive("validate", (el, _binding, { cleanup }) => {
		let active = true;
		initializeValidation().then((validation) => {
			if (!active) return;
			if (typeof onReady === "function") onReady(validation);
		}).catch((error) => {
			console.error("[RizzyUI] Failed to initialize validation runtime.", error);
		});
		cleanup(() => {
			active = false;
		});
	});
}
//#endregion
//#region src/js/lib/theme.js
var ThemeController = class {
	constructor() {
		this.storageKey = "darkMode";
		this.eventName = "rz:theme-change";
		this.darkClass = "dark";
		this._mode = "auto";
		this._mq = null;
		this._initialized = false;
		this._onMqChange = null;
		this._onStorage = null;
		this._lastSnapshot = {
			mode: null,
			effectiveDark: null,
			prefersDark: null
		};
	}
	init() {
		if (this._initialized) return;
		if (typeof window === "undefined") return;
		this._initialized = true;
		this._mq = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
		const raw = this._safeReadStorage(this.storageKey);
		this._mode = this._normalizeMode(raw ?? "auto");
		this._sync();
		this._onMqChange = () => {
			this._sync();
		};
		if (this._mq) {
			if (typeof this._mq.addEventListener === "function") this._mq.addEventListener("change", this._onMqChange);
			else if (typeof this._mq.addListener === "function") this._mq.addListener(this._onMqChange);
		}
		this._onStorage = (e) => {
			if (e.key !== this.storageKey) return;
			const next = this._normalizeMode(e.newValue ?? "auto");
			if (next !== this._mode) {
				this._mode = next;
				this._sync();
			}
		};
		window.addEventListener("storage", this._onStorage);
	}
	destroy() {
		if (!this._initialized) return;
		this._initialized = false;
		if (this._mq && this._onMqChange) {
			if (typeof this._mq.removeEventListener === "function") this._mq.removeEventListener("change", this._onMqChange);
			else if (typeof this._mq.removeListener === "function") this._mq.removeListener(this._onMqChange);
		}
		if (typeof window !== "undefined" && this._onStorage) window.removeEventListener("storage", this._onStorage);
		this._onMqChange = null;
		this._onStorage = null;
		this._mq = null;
		this._lastSnapshot = {
			mode: null,
			effectiveDark: null,
			prefersDark: null
		};
	}
	get mode() {
		return this._mode;
	}
	get prefersDark() {
		return !!this._mq?.matches;
	}
	get effectiveDark() {
		return this._mode === "dark" || this._mode === "auto" && this.prefersDark;
	}
	isDark() {
		return this.effectiveDark;
	}
	isLight() {
		return !this.effectiveDark;
	}
	setLight() {
		this._setMode("light");
	}
	setDark() {
		this._setMode("dark");
	}
	setAuto() {
		this._setMode("auto");
	}
	toggle() {
		const currentlyDark = this.effectiveDark;
		this._setMode(currentlyDark ? "light" : "dark");
	}
	_setMode(value) {
		this._mode = this._normalizeMode(value);
		this._persist();
		this._sync();
	}
	_normalizeMode(value) {
		return value === "light" || value === "dark" || value === "auto" ? value : "auto";
	}
	_safeReadStorage(key) {
		try {
			return window?.localStorage?.getItem(key);
		} catch (e) {
			return null;
		}
	}
	_persist() {
		try {
			window?.localStorage?.setItem(this.storageKey, this._mode);
		} catch (e) {}
	}
	_sync() {
		const effectiveDark = this.effectiveDark;
		const mode = this._mode;
		const prefersDark = this.prefersDark;
		const root = typeof document !== "undefined" ? document.documentElement : null;
		const domMatchesState = root ? root.classList.contains(this.darkClass) === effectiveDark && root.style.colorScheme === (effectiveDark ? "dark" : "light") : true;
		if (this._lastSnapshot.mode === mode && this._lastSnapshot.effectiveDark === effectiveDark && this._lastSnapshot.prefersDark === prefersDark && domMatchesState) return;
		this._lastSnapshot = {
			mode,
			effectiveDark,
			prefersDark
		};
		if (root) {
			root.classList.toggle(this.darkClass, effectiveDark);
			root.style.colorScheme = effectiveDark ? "dark" : "light";
		}
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(this.eventName, { detail: {
			mode,
			darkMode: effectiveDark,
			prefersDark,
			source: "RizzyUI"
		} }));
	}
};
var themeController = new ThemeController();
//#endregion
//#region src/js/lib/stores.js
function registerStores(Alpine) {
	themeController.init();
	Alpine.store("theme", {
		_mode: themeController.mode,
		_prefersDark: themeController.prefersDark,
		_effectiveDark: themeController.effectiveDark,
		_onThemeChange: null,
		init() {
			if (!this._onThemeChange) {
				this._onThemeChange = () => this._refresh();
				window.addEventListener(themeController.eventName, this._onThemeChange);
			}
			this._refresh();
		},
		_refresh() {
			this._mode = themeController.mode;
			this._prefersDark = themeController.prefersDark;
			this._effectiveDark = themeController.effectiveDark;
		},
		get mode() {
			return this._mode;
		},
		get effectiveDark() {
			return this._effectiveDark;
		},
		get prefersDark() {
			return this._prefersDark;
		},
		get isDark() {
			return this._effectiveDark;
		},
		get isLight() {
			return !this._effectiveDark;
		},
		setLight() {
			themeController.setLight();
		},
		setDark() {
			themeController.setDark();
		},
		setAuto() {
			themeController.setAuto();
		},
		toggle() {
			themeController.toggle();
		}
	});
}
//#endregion
//#region src/js/runtime/bundleLoaderRegistry.js
/**
* Bundle loader registry shared by both shell entrypoints.
*
* Keep both `rizzyui.js` and `rizzyui-csp.js` in one multi-entry build graph so
* these async chunks are emitted once and reused by both shells.
*/
var bundleLoaderRegistry = Object.freeze({
	"core-common": () => __vitePreload(() => import("./core-common-CMcLADc0.js"), [], import.meta.url),
	"command-runtime": () => __vitePreload(() => import("./command-runtime-DAov6mma.js"), [], import.meta.url),
	"advanced-input-runtime": () => __vitePreload(() => import("./advanced-input-runtime-BDyGSZ2H.js"), __vite__mapDeps([0,1]), import.meta.url),
	"calendar-runtime": () => __vitePreload(() => import("./calendar-runtime-Cm3N2jpl.js"), __vite__mapDeps([2,1]), import.meta.url),
	"table-runtime": () => __vitePreload(() => import("./table-runtime-BcasLp2I.js"), __vite__mapDeps([3,4]), import.meta.url),
	"color-runtime": () => __vitePreload(() => import("./color-runtime-BQbdJmIl.js"), __vite__mapDeps([5,1]), import.meta.url),
	"content-visual-runtime": () => __vitePreload(() => import("./content-visual-runtime-D8_-8dNm.js"), __vite__mapDeps([6,1]), import.meta.url),
	"dialogs-panels-runtime": () => __vitePreload(() => import("./dialogs-panels-runtime-Dq6uhPYF.js"), [], import.meta.url),
	"menu-runtime": () => __vitePreload(() => import("./menu-runtime-BuI5Xb2l.js"), __vite__mapDeps([7,8]), import.meta.url),
	"popover-tooltip-runtime": () => __vitePreload(() => import("./popover-tooltip-runtime-DigvC58R.js"), __vite__mapDeps([9,8]), import.meta.url),
	"docs-runtime": () => __vitePreload(() => import("./docs-runtime-BRm2T1Og.js"), __vite__mapDeps([10,1]), import.meta.url),
	"effects-runtime": () => __vitePreload(() => import("./effects-runtime-EekiH7OU.js"), __vite__mapDeps([11,1]), import.meta.url)
});
//#endregion
//#region src/js/runtime/componentBundleManifest.js
/**
* Canonical Alpine component->bundle ownership map.
*
* Rules:
* - Every JS-backed Alpine data name must map to exactly one bundle.
* - Shell entrypoints stay intentionally thin and should never eagerly register these.
* - RzEmpty intentionally has no runtime registration and is excluded from this map.
*/
var componentBundleManifest = Object.freeze({
	accordionItem: "core-common",
	rzAccordion: "core-common",
	rzAlert: "core-common",
	rzAspectRatio: "core-common",
	rzBackToTop: "core-common",
	rzClipboard: "core-common",
	rzCollapsible: "core-common",
	rzDarkModeToggle: "core-common",
	rzHeading: "core-common",
	rzIndicator: "core-common",
	rzInputGroupAddon: "core-common",
	rzPrependInput: "core-common",
	rzProgress: "core-common",
	rzTabs: "core-common",
	rzToggle: "core-common",
	rzCommand: "command-runtime",
	rzCommandGroup: "command-runtime",
	rzCommandItem: "command-runtime",
	rzCommandList: "command-runtime",
	rzCombobox: "advanced-input-runtime",
	rzFileInput: "advanced-input-runtime",
	rzInputOTP: "advanced-input-runtime",
	rzScrollArea: "advanced-input-runtime",
	rzSlider: "advanced-input-runtime",
	rzCalendar: "calendar-runtime",
	rzCalendarProvider: "calendar-runtime",
	rzDateEdit: "calendar-runtime",
	rzDataTable: "table-runtime",
	rzColorPicker: "color-runtime",
	rzColorPickerProvider: "color-runtime",
	rzColorSwatch: "color-runtime",
	rzCarousel: "content-visual-runtime",
	rzChart: "content-visual-runtime",
	rzHighlighter: "content-visual-runtime",
	rzNumberTicker: "content-visual-runtime",
	rzShineBorder: "content-visual-runtime",
	rzTypingAnimation: "content-visual-runtime",
	rzModal: "dialogs-panels-runtime",
	rzSheet: "dialogs-panels-runtime",
	rzSidebar: "dialogs-panels-runtime",
	rzDropdownMenu: "menu-runtime",
	rzDropdownSubmenu: "menu-runtime",
	rzMenubar: "menu-runtime",
	rzNavigationMenu: "menu-runtime",
	rzPopover: "popover-tooltip-runtime",
	rzTooltip: "popover-tooltip-runtime",
	rzBrowser: "docs-runtime",
	rzCodeViewer: "docs-runtime",
	rzEmbeddedPreview: "docs-runtime",
	rzEventViewer: "docs-runtime",
	rzMarkdown: "docs-runtime",
	rzQuickReferenceContainer: "docs-runtime",
	rzConfetti: "effects-runtime"
});
//#endregion
//#region src/js/runtime/asyncBundleRegistrar.js
var loadedBundles = /* @__PURE__ */ new Map();
async function loadComponentFactory(componentName) {
	const bundleName = componentBundleManifest[componentName];
	if (!bundleName) throw new Error(`[RizzyUI] No owning bundle was found for component '${componentName}'.`);
	if (!loadedBundles.has(bundleName)) {
		const loader = bundleLoaderRegistry[bundleName];
		if (!loader) throw new Error(`[RizzyUI] Bundle loader '${bundleName}' is missing.`);
		loadedBundles.set(bundleName, loader());
	}
	const factory = (await loadedBundles.get(bundleName))[componentName];
	if (!factory) throw new Error(`[RizzyUI] Component '${componentName}' is not exported by bundle '${bundleName}'.`);
	return factory;
}
function registerAsyncBundleComponents(Alpine) {
	for (const componentName of Object.keys(componentBundleManifest)) Alpine.asyncData(componentName, () => loadComponentFactory(componentName));
}
async function loadComponentDefinition(Alpine, componentName) {
	return await loadComponentFactory(componentName);
}
//#endregion
//#region src/js/runtime/asyncComponentRegistrar.js
var registered = /* @__PURE__ */ new Map();
var importCache = /* @__PURE__ */ new Map();
var onAlpineInitAttached = false;
function onceImport(path) {
	if (!importCache.has(path)) importCache.set(path, __vitePreload(() => import(path), [], import.meta.url).catch((error) => {
		importCache.delete(path);
		throw error;
	}));
	return importCache.get(path);
}
function setAsyncLoader(name, path) {
	const Alpine = globalThis.Alpine;
	if (!(Alpine && typeof Alpine.asyncData === "function")) {
		console.error(`[RizzyUI] Could not register async component '${name}'. AsyncAlpine not available.`);
		return false;
	}
	Alpine.asyncData(name, () => onceImport(path).catch((error) => {
		console.error(`[RizzyUI] Failed to load Alpine module '${name}' from '${path}'.`, error);
		return () => ({
			_error: true,
			_errorMessage: `Module '${name}' failed to load.`
		});
	}));
	return true;
}
function ensurePendingAsyncComponentsAreRegistered() {
	for (const [name, info] of registered) {
		if (info.loaderSet) continue;
		info.loaderSet = setAsyncLoader(name, info.path);
	}
}
function registerAsyncComponent(name, path) {
	if (!name || !path) {
		console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
		return;
	}
	const previous = registered.get(name);
	if (previous && previous.path !== path) console.warn(`[RizzyUI] Re-registering '${name}' with a different path.\nPrevious: ${previous.path}\nNew:      ${path}`);
	const Alpine = globalThis.Alpine;
	if (Alpine && Alpine.version) {
		const changedPath = !previous || previous.path !== path;
		if (!(previous && previous.loaderSet && !changedPath)) {
			const loaderSet = setAsyncLoader(name, path);
			registered.set(name, {
				path,
				loaderSet
			});
		}
		return;
	}
	registered.set(name, {
		path,
		loaderSet: false
	});
	if (!onAlpineInitAttached) {
		onAlpineInitAttached = true;
		document.addEventListener("alpine:init", () => {
			ensurePendingAsyncComponentsAreRegistered();
		}, { once: true });
	}
}
//#endregion
//#region src/js/lib/bootstrap.js
var cachedRizzyUI;
function bootstrapRizzyUI(Alpine) {
	if (cachedRizzyUI) return cachedRizzyUI;
	Alpine.plugin(module_default$2);
	Alpine.plugin(module_default);
	Alpine.plugin(module_default$1);
	Alpine.plugin(async_alpine_default);
	Alpine.plugin(createFlexRenderPlugin());
	if (typeof document !== "undefined") document.addEventListener("alpine:init", () => {
		registerStores(Alpine);
	}, { once: true });
	registerAsyncBundleComponents(Alpine);
	registerMobileDirective(Alpine);
	registerSyncDirective(Alpine);
	let validationInstance;
	registerValidateDirective(Alpine, (validation) => {
		validationInstance = validation;
	});
	let resolveReady;
	cachedRizzyUI = {
		Alpine,
		require: rizzyRequire,
		toast: Toast,
		$data,
		props,
		ready: new Promise((resolve) => {
			resolveReady = resolve;
		}),
		theme: themeController,
		loadComponent: (componentName) => loadComponentDefinition(Alpine, componentName),
		registerAsyncComponent,
		ensureValidation: async () => {
			validationInstance = await initializeValidation();
			return validationInstance;
		},
		get validation() {
			return validationInstance;
		}
	};
	if (typeof window !== "undefined") {
		themeController.init();
		window.Alpine = Alpine;
		window.Rizzy = {
			...window.Rizzy || {},
			...cachedRizzyUI
		};
		document.dispatchEvent(new CustomEvent("rz:init", { detail: { Rizzy: window.Rizzy } }));
	}
	resolveReady(cachedRizzyUI);
	return cachedRizzyUI;
}
//#endregion
export { bootstrapRizzyUI as t };

//# sourceMappingURL=bootstrap-C5eha7yf.js.map