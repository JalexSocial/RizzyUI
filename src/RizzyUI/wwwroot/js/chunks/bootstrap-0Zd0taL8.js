const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dialogs-panels-runtime-IPyWbRfh.js","./focusable-BJl0SvsU.js","./triggerReference-Dm_VUwDk.js","./menu-runtime-BvwxY3Ut.js","./floating-ui.dom-Dgqg_9DN.js","./popover-tooltip-runtime-BvQMQnwo.js"])))=>i.map(i=>d[i]);
// node_modules/@alpinejs/collapse/dist/module.esm.js
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
// node_modules/@alpinejs/focus/dist/module.esm.js
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
		if (node === void 0) {
			if (findContainerIndex(doc.activeElement) >= 0) node = doc.activeElement;
			else {
				var firstTabbableGroup = state.tabbableGroups[0];
				node = firstTabbableGroup && firstTabbableGroup.firstTabbableNode || getNodeForOption("fallbackFocus");
			}
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
				/**
				* Finds the __tabbable__ node that follows the given node in the specified direction,
				*  in this container, if any.
				* @param {HTMLElement} node
				* @param {boolean} [forward] True if going in forward tab order; false if going
				*  in reverse.
				* @returns {HTMLElement|undefined} The next tabbable node, if any.
				*/
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
			if (containerIndex < 0) {
				if (e.shiftKey) destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
				else destinationNode = state.tabbableGroups[0].firstTabbableNode;
			} else if (e.shiftKey) {
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
// node_modules/async-alpine/dist/async-alpine.esm.js
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
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				observer.disconnect();
				resolve();
			}
		}, { rootMargin: argument || "0px 0px 0px 0px" });
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
			download: () => import(
				/* @vite-ignore */
				/* webpackIgnore: true */
				parseUrl(url)
)
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
// node_modules/@alpinejs/intersect/dist/module.esm.js
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
// src/js/lib/notify/rzToastDefaults.js
var toastInputEvents = [
	"rz:toast",
	"rz:toast:show",
	"rz:toast:update",
	"rz:toast:dismiss",
	"rz:toast:clear",
	"rz:toast:batch"
];
var fallbackStatuses = [
	"default",
	"info",
	"success",
	"warning",
	"error",
	"loading"
];
var fallbackPositions = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
	"center",
	"left-center",
	"right-center"
];
var fallbackAliases = {
	statuses: { destructive: "error" },
	positions: {
		"right top": "top-right",
		"top right": "top-right",
		"left top": "top-left",
		"top left": "top-left",
		"right bottom": "bottom-right",
		"bottom right": "bottom-right",
		"left bottom": "bottom-left",
		"bottom left": "bottom-left",
		"top center": "top-center",
		"center top": "top-center",
		"x-center top": "top-center",
		"top x-center": "top-center",
		"bottom center": "bottom-center",
		"center bottom": "bottom-center",
		"x-center bottom": "bottom-center",
		"bottom x-center": "bottom-center",
		center: "center",
		"left center": "left-center",
		"left y-center": "left-center",
		"y-center left": "left-center",
		"right center": "right-center",
		"right y-center": "right-center",
		"y-center right": "right-center"
	},
	types: {
		filled: "solid",
		outline: "outline"
	},
	effects: {
		fade: "fade",
		slide: "slide"
	}
};
function getAliasMap(config, name) {
	return {
		...fallbackAliases[name] || {},
		...config && config.aliases && config.aliases[name] || {}
	};
}
function getAllowedStatuses(config = {}) {
	const statuses = Object.keys(config.statuses || {});
	return statuses.length ? statuses : [...fallbackStatuses];
}
function getAllowedPositions(config = {}) {
	const aliases = Object.keys(getAliasMap(config, "positions"));
	return [.../* @__PURE__ */ new Set([...fallbackPositions, ...aliases])];
}
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
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
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					const handleSettle = (e) => {
						link.removeEventListener("load", handleSettle);
						link.removeEventListener("error", handleSettle);
						if (e.type === "error") rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`));
						else res(e);
					};
					link.addEventListener("load", handleSettle);
					link.addEventListener("error", handleSettle);
				});
			});
		}).filter((p) => p !== void 0));
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
// src/js/lib/notify/toast.js
var providerSelector = "[data-rz-toast-provider]";
var defaultConfig = {};
var pendingEvents = [];
var seenEvents = /* @__PURE__ */ new WeakSet();
var mergedIds = /* @__PURE__ */ new Map();
var manager = null;
var loading = null;
function createId() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `rz-toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function hasStatusValue(options) {
	return Object.prototype.hasOwnProperty.call(options, "status") && String(options.status ?? "").trim() !== "";
}
function resolveId(id) {
	if (id === void 0 || id === null) return id;
	const key = String(id);
	return mergedIds.get(key) ?? key;
}
function onInputEvent(event) {
	if (seenEvents.has(event)) return;
	seenEvents.add(event);
	pendingEvents.push(event);
	load().catch(() => {});
}
function setInputListeners(add) {
	if (typeof window === "undefined" || typeof document === "undefined") return;
	toastInputEvents.forEach((name) => {
		const method = add ? "addEventListener" : "removeEventListener";
		[window, document].forEach((target) => {
			if (typeof target[method] === "function") target[method](name, onInputEvent);
		});
	});
}
function load() {
	if (!loading) loading = __vitePreload(() => import("./rzToastManager-aqkdG6Tg.js").then((module) => {
		manager = module.toastManager;
		setInputListeners(false);
		pendingEvents.splice(0).forEach((event) => manager.handleInputEvent(event));
		return manager;
	}), [], import.meta.url).catch((error) => {
		loading = null;
		console.error("[RizzyUI] The toast runtime failed to load; toasts were not shown.", error);
		throw error;
	});
	return loading;
}
function whenLoaded(action) {
	load().then(action).catch(() => {});
}
function handleFor(id) {
	return {
		id,
		update: (options) => Toast.update(id, options),
		dismiss: () => Toast.dismiss(id)
	};
}
function show(options = {}) {
	const request = {
		...defaultConfig,
		...options
	};
	if (!hasStatusValue(options)) request.status = "default";
	if (manager) return manager.show(request);
	const id = String(request.id || createId());
	request.id = id;
	whenLoaded((loaded) => {
		const handle = loaded.show(request);
		if (handle && handle.id !== id) mergedIds.set(id, handle.id);
	});
	return handleFor(id);
}
function preloadWhenAProviderIsPresent() {
	if (typeof document === "undefined" || typeof window === "undefined") return;
	const check = () => {
		if (!manager && document.querySelector(providerSelector)) load().catch(() => {});
	};
	const schedule = () => typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(check, { timeout: 2e3 }) : window.setTimeout(check, 200);
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule, { once: true });
	else schedule();
}
var Toast = {
	show,
	custom(options = {}) {
		return show(options);
	},
	success(text, title = "Success", options = {}) {
		return show({
			status: "success",
			title,
			text,
			...options
		});
	},
	error(text, title = "Error", options = {}) {
		return show({
			status: "error",
			title,
			text,
			...options
		});
	},
	warning(text, title = "Warning", options = {}) {
		return show({
			status: "warning",
			title,
			text,
			...options
		});
	},
	info(text, title = "Info", options = {}) {
		return show({
			status: "info",
			title,
			text,
			...options
		});
	},
	loading(text, title = "Loading", options = {}) {
		return show({
			status: "loading",
			title,
			text,
			autoclose: false,
			progress: false,
			...options
		});
	},
	/** Returns the toast's handle; while the runtime is loading, the call is queued. */
	update(id, options = {}) {
		if (manager) return manager.update(resolveId(id), options);
		whenLoaded((loaded) => loaded.update(resolveId(id), options));
		return handleFor(id);
	},
	/** Returns whether a toast was dismissed; `undefined` while the runtime is loading (queued). */
	dismiss(id) {
		if (manager) return manager.dismiss(resolveId(id));
		whenLoaded((loaded) => loaded.dismiss(resolveId(id)));
	},
	clear() {
		if (manager) return manager.clear();
		whenLoaded((loaded) => loaded.clear());
	},
	/** Returns the toast manager once the runtime has loaded; this facade while it is loading. */
	configure(providerOrConfig) {
		if (manager) return manager.configure(providerOrConfig);
		whenLoaded((loaded) => loaded.configure(providerOrConfig));
		return Toast;
	},
	registerProvider(providerElement) {
		if (manager) return manager.registerProvider(providerElement);
		whenLoaded((loaded) => loaded.registerProvider(providerElement));
		return Toast;
	},
	setDefaults(newDefaults = {}) {
		Object.assign(defaultConfig, newDefaults);
	},
	/** Resolves with this facade once the toast runtime has loaded. */
	ready() {
		return load().then(() => Toast);
	},
	get allowedStatuses() {
		return getAllowedStatuses(manager?.config);
	},
	get allowedPositions() {
		return getAllowedPositions(manager?.config);
	}
};
setInputListeners(true);
preloadWhenAProviderIsPresent();
// src/js/lib/alpineData.js
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
		if (isUnstartedRoot(target)) {
			warnNotStarted(target);
			return;
		}
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
		if (isUnstartedRoot(root)) {
			warnNotStarted(root);
			return;
		}
		const alpineData = Alpine.$data(root);
		if (alpineData === void 0) warnDataUndefined(`data-alpine-root="${componentId}"`, root);
		return alpineData;
	}
	console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
/**
* Whether `el` is an Alpine component root (`x-data`) that Alpine has not started yet, for
* example a RizzyUI component whose code is still loading (async-alpine keeps it ignored).
* @param {Element} el
*/
function isUnstartedRoot(el) {
	return el instanceof Element && el.hasAttribute("x-data") && !el._x_dataStack;
}
function warnNotStarted(el) {
	console.warn("Rizzy.$data: the component has not started yet (its code may still be loading), so it has no data. In a code-behind module, read child components in ready() instead of init().", el);
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
// src/js/lib/alpineProps.js
/**
* @file RizzyUI Alpine props
* @module alpineProps
* @description Reads the props that `RzAlpineComponent` passes to an Alpine code-behind module.
*
* `RzAlpineComponent` serializes its `Props` parameter (camelCase) into `data-rz-props` on the
* component root. Modules read them with the `$props` magic (`this.$props.initialCount` in a
* method, `$props.title` in markup), or with `Rizzy.props(this.$el)`.
*/
var ROOT_SELECTOR = "[x-load-src], [data-rz-props], [data-props-id]";
var cache = /* @__PURE__ */ new WeakMap();
function parse(element, raw, source) {
	const cached = cache.get(element);
	if (cached && cached.raw === raw) return cached.value;
	let value = {};
	try {
		value = raw ? JSON.parse(raw) : {};
	} catch (error) {
		console.error(`[Rizzy.props] Failed to parse the props in ${source}.`, error);
	}
	cache.set(element, {
		raw,
		value
	});
	return value;
}
/**
* The code-behind root for `element`: the element itself or its nearest ancestor rendered by
* `RzAlpineComponent`.
* @param {Element} element
* @returns {Element | null}
*/
function findCodeBehindRoot(element) {
	return element instanceof Element ? element.closest(ROOT_SELECTOR) : null;
}
/**
* Returns the props of the code-behind component that contains `element` (usually `this.$el`).
* The object is parsed once per element and value and shared, so treat it as read-only.
* Returns `{}` when the component has no props.
*
* @param {Element} element An element inside (or the root of) the component.
* @returns {Record<string, any>}
*/
function props(element) {
	if (!(element instanceof Element)) {
		console.warn("[Rizzy.props] Invalid input. Expected an element, usually this.$el.");
		return {};
	}
	const root = findCodeBehindRoot(element);
	if (!root) return {};
	if (root.hasAttribute("data-rz-props")) return parse(root, root.getAttribute("data-rz-props"), "data-rz-props");
	const scriptId = root.getAttribute("data-props-id");
	if (!scriptId) return {};
	const script = document.getElementById(scriptId);
	if (!script) {
		console.warn(`[Rizzy.props] Could not find the props script with id '${scriptId}'.`);
		return {};
	}
	return parse(root, script.textContent || "{}", `#${scriptId}`);
}
/**
* Registers the `$props` magic: the props of the code-behind component the expression or data
* object belongs to. Works with the standard and the CSP build of Alpine.
* @param {any} Alpine
*/
function registerPropsMagic(Alpine) {
	Alpine.magic("props", (el) => props(el));
}
// src/js/lib/directives/mobile.js
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
// src/js/lib/directives/sync-prop.js
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
// src/js/lib/directives/indeterminate.js
/**
* Registers the `x-indeterminate` directive.
* @param {object} Alpine The Alpine instance.
*/
function registerIndeterminateDirective(Alpine) {
	Alpine.directive("indeterminate", (el, { expression }, { evaluateLater, effect }) => {
		if (!expression) return;
		const evaluate = evaluateLater(expression);
		effect(() => {
			evaluate((value) => {
				el.indeterminate = !!value;
			});
		});
	});
}
// src/js/lib/directives/validate.js
var validationPromise;
function initializeValidation() {
	if (!validationPromise) validationPromise = __vitePreload(() => import("./validationRuntime-yzAhmyuT.js").then((module) => module.ensureValidationRuntime()), [], import.meta.url);
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
// src/js/lib/directives/flexrender.js
function isObject(value) {
	return typeof value === "object" && value !== null;
}
function isNodeLike(value) {
	return typeof Node !== "undefined" && value instanceof Node;
}
function isFlexPayload(value) {
	return isObject(value) && Object.prototype.hasOwnProperty.call(value, "def");
}
function isFlexEnvelope(value) {
	return isObject(value) && typeof value.kind === "string";
}
function toText(value) {
	if (value === null || value === void 0) return "";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	return String(value);
}
async function resolveRenderable(payloadOrValue) {
	if (!isFlexPayload(payloadOrValue)) return {
		payload: null,
		renderable: payloadOrValue
	};
	const payload = payloadOrValue;
	const value = typeof payload.def === "function" ? await payload.def(payload.ctx) : payload.def;
	return {
		payload,
		renderable: value === null || value === void 0 ? payload.fallback : value
	};
}
function clearElement(el) {
	el.replaceChildren();
	el.textContent = "";
}
function applyText(el, value) {
	el.replaceChildren();
	el.textContent = toText(value);
}
function applyHtml(el, html, payload, options) {
	el.replaceChildren();
	el.innerHTML = typeof options.sanitizeHtml === "function" && payload ? options.sanitizeHtml(html, payload) : html;
}
function applyNode(el, node, options) {
	el.replaceChildren();
	const finalNode = options.cloneNodeResults === false ? node : node.cloneNode(true);
	el.appendChild(finalNode);
}
function applyRenderable(el, renderable, payload, mode, options) {
	if (renderable === null || renderable === void 0) {
		clearElement(el);
		return;
	}
	if (isNodeLike(renderable)) {
		if (mode === "text") {
			applyText(el, "");
			return;
		}
		applyNode(el, renderable, options);
		return;
	}
	if (isFlexEnvelope(renderable)) switch (renderable.kind) {
		case "empty":
			clearElement(el);
			return;
		case "text":
			applyText(el, renderable.value);
			return;
		case "html":
			if (mode === "text") {
				applyText(el, renderable.value);
				return;
			}
			applyHtml(el, renderable.value, payload, options);
			return;
		case "node":
			if (mode === "text") {
				applyText(el, "");
				return;
			}
			applyNode(el, renderable.value, options);
			return;
		default:
			clearElement(el);
			return;
	}
	if (mode === "html") {
		applyHtml(el, toText(renderable), payload, options);
		return;
	}
	applyText(el, renderable);
}
function parseMode(value) {
	if (value === "text" || value === "html" || value === "node") return value;
	return "auto";
}
function createFlexRenderPlugin(options = {}) {
	const mergedOptions = {
		cloneNodeResults: true,
		...options
	};
	return function flexRenderPlugin(Alpine) {
		Alpine.directive("flexrender", (el, { value, expression }, { evaluateLater, effect }) => {
			const evaluate = evaluateLater(expression);
			const mode = parseMode(value);
			let runId = 0;
			effect(() => {
				const currentRunId = ++runId;
				evaluate(async (payloadOrValue) => {
					try {
						const resolved = await resolveRenderable(payloadOrValue);
						if (currentRunId !== runId) return;
						applyRenderable(el, resolved.renderable, resolved.payload, mode, mergedOptions);
					} catch (error) {
						if (typeof mergedOptions.onError === "function") mergedOptions.onError(error, {
							element: el,
							payload: payloadOrValue
						});
						else {
							console.error("x-flexrender failed:", error);
							clearElement(el);
						}
					}
				});
			});
		});
	};
}
var flex = {
	payload(def, ctx, fallback) {
		return {
			def,
			ctx,
			fallback
		};
	},
	header(header) {
		return {
			def: header?.column?.columnDef?.header ?? null,
			ctx: header.getContext()
		};
	},
	cell(cell) {
		return {
			def: cell?.column?.columnDef?.cell ?? null,
			ctx: cell.getContext()
		};
	},
	footer(header) {
		return {
			def: header?.column?.columnDef?.footer ?? null,
			ctx: header.getContext()
		};
	},
	text(value) {
		return {
			kind: "text",
			value
		};
	},
	html(value) {
		return {
			kind: "html",
			value
		};
	},
	node(value) {
		return {
			kind: "node",
			value
		};
	},
	empty() {
		return { kind: "empty" };
	}
};
// src/js/lib/theme.js
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
// src/js/lib/stores.js
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
// src/js/runtime/bundleLoaderRegistry.js
/**
* Bundle loader registry shared by both shell entrypoints.
*
* Keep both `rizzyui.js` and `rizzyui-csp.js` in one multi-entry build graph so
* these async chunks are emitted once and reused by both shells.
*/
var bundleLoaderRegistry = Object.freeze({
	"core-common": () => __vitePreload(() => import("./core-common-CM-qibHG.js"), [], import.meta.url),
	"command-runtime": () => __vitePreload(() => import("./command-runtime-EYrda5rd.js"), [], import.meta.url),
	"advanced-input-runtime": () => __vitePreload(() => import("./advanced-input-runtime-aQSqujV1.js"), [], import.meta.url),
	"calendar-runtime": () => __vitePreload(() => import("./calendar-runtime-ChIQFo2q.js"), [], import.meta.url),
	"table-runtime": () => __vitePreload(() => import("./table-runtime-BqZWVm_O.js"), [], import.meta.url),
	"color-runtime": () => __vitePreload(() => import("./color-runtime-Cgz_w-ef.js"), [], import.meta.url),
	"content-visual-runtime": () => __vitePreload(() => import("./content-visual-runtime-BUJqEMXl.js"), [], import.meta.url),
	"dialogs-panels-runtime": () => __vitePreload(() => import("./dialogs-panels-runtime-IPyWbRfh.js"), __vite__mapDeps([0,1,2]), import.meta.url),
	"menu-runtime": () => __vitePreload(() => import("./menu-runtime-BvwxY3Ut.js"), __vite__mapDeps([3,2,4,1]), import.meta.url),
	"popover-tooltip-runtime": () => __vitePreload(() => import("./popover-tooltip-runtime-BvQMQnwo.js"), __vite__mapDeps([5,2,4]), import.meta.url),
	"docs-runtime": () => __vitePreload(() => import("./docs-runtime-DZhSFX2X.js"), [], import.meta.url),
	"effects-runtime": () => __vitePreload(() => import("./effects-runtime-Ce6C35PY.js"), [], import.meta.url)
});
// src/js/runtime/componentBundleManifest.js
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
// src/js/runtime/asyncBundleRegistrar.js
/**
* Creates a component-factory loader over a bundle registry. Each bundle is imported once and the
* promise is shared; a failed import is evicted so the next use of any of its components retries
* it instead of failing from the cache (RZUI-031).
* @param {Record<string, () => Promise<object>>} registry bundle name → dynamic import
* @param {Record<string, string>} manifest component name → bundle name
*/
function createComponentFactoryLoader(registry, manifest) {
	const loadedBundles = /* @__PURE__ */ new Map();
	function loadBundle(bundleName, componentName) {
		if (!loadedBundles.has(bundleName)) {
			const loader = registry[bundleName];
			if (!loader) throw new Error(`[RizzyUI] Bundle loader '${bundleName}' is missing.`);
			const pending = Promise.resolve().then(() => loader()).catch((error) => {
				if (loadedBundles.get(bundleName) === pending) loadedBundles.delete(bundleName);
				console.error(`[RizzyUI] Failed to load bundle '${bundleName}' for component '${componentName}'. It will be retried the next time it is needed.`, error);
				throw error;
			});
			loadedBundles.set(bundleName, pending);
		}
		return loadedBundles.get(bundleName);
	}
	return async function loadComponentFactory(componentName) {
		const bundleName = manifest[componentName];
		if (!bundleName) throw new Error(`[RizzyUI] No owning bundle was found for component '${componentName}'.`);
		const factory = (await loadBundle(bundleName, componentName))[componentName];
		if (!factory) throw new Error(`[RizzyUI] Component '${componentName}' is not exported by bundle '${bundleName}'.`);
		return factory;
	};
}
var loadComponentFactory = createComponentFactoryLoader(bundleLoaderRegistry, componentBundleManifest);
function registerAsyncBundleComponents(Alpine) {
	for (const componentName of Object.keys(componentBundleManifest)) Alpine.asyncData(componentName, () => loadComponentFactory(componentName));
}
async function loadComponentDefinition(Alpine, componentName) {
	return await loadComponentFactory(componentName);
}
// src/js/lib/loadjs/loadjs.js
var devnull = function() {};
var bundleIdCache = {};
var bundleResultCache = {};
var bundleCallbackQueue = {};
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
		if (result === "b") {
			if (defaultPrevented) pathsNotFound.push(path);
			else return;
		}
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
	if (bundleId) {
		if (bundleId in bundleIdCache) throw "LoadJS";
		else bundleIdCache[bundleId] = true;
	}
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
* Forget one bundle so that a later loadjs() call with the same id loads it again (RizzyUI:
* used after a failed load, RZUI-031).
* @param {string} bundleId - The bundle id
*/
loadjs.forget = function forget(bundleId) {
	delete bundleIdCache[bundleId];
	delete bundleResultCache[bundleId];
	delete bundleCallbackQueue[bundleId];
};
/**
* Determine if bundle has already been defined
* @param {string} bundleId - The bundle id
*/
loadjs.isDefined = function isDefined(bundleId) {
	return bundleId in bundleIdCache;
};
// src/js/runtime/rizzyRequire.js
/**
* A stable id for a set of asset URLs: the same set (in any order) shares one loadjs bundle.
* Uses the URLs themselves rather than a hash, so it needs no `crypto.subtle`, which browsers only
* provide in secure contexts (HTTPS or localhost). (RZUI-026)
* @param {string[]} paths
*/
function getBundleId(paths) {
	return `rz-bundle:${[...paths].sort().join("|")}`;
}
/**
* Accepts asset entries as URL strings or `{ src, integrity }` objects (as RizzyUI components
* render them) and returns the URLs plus a URL-to-integrity map.
* @param {Array<string | { src: string, integrity?: string }>} entries
*/
function normalizeAssets(entries) {
	const files = [];
	const integrity = /* @__PURE__ */ new Map();
	for (const entry of entries) if (typeof entry === "string") {
		if (entry) files.push(entry);
	} else if (entry && typeof entry.src === "string" && entry.src) {
		files.push(entry.src);
		if (typeof entry.integrity === "string" && entry.integrity) integrity.set(entry.src, entry.integrity);
	}
	return {
		files,
		integrity
	};
}
function rizzyRequire(paths, callbackOrNonce, nonce) {
	let callbackObject;
	let csp;
	if (typeof callbackOrNonce === "function") callbackObject = { success: callbackOrNonce };
	else if (callbackOrNonce && typeof callbackOrNonce === "object") callbackObject = callbackOrNonce;
	else if (typeof callbackOrNonce === "string") csp = callbackOrNonce;
	if (!csp && typeof nonce === "string") csp = nonce;
	const { files, integrity } = normalizeAssets(Array.isArray(paths) ? paths : [paths]);
	return Promise.resolve(getBundleId(files)).then((bundleId) => {
		if (!loadjs.isDefined(bundleId)) loadjs(files, bundleId, {
			async: false,
			inlineScriptNonce: csp,
			inlineStyleNonce: csp,
			before: (path, element) => {
				const hash = integrity.get(path);
				if (hash) {
					element.integrity = hash;
					element.crossOrigin = "anonymous";
				}
			}
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
					loadjs.forget(bundleId);
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
// src/js/lib/codeBehindLifecycle.js
/**
* @file The `ready()` hook of Alpine code-behind modules.
*
* Alpine runs a component's `init()` before its children start, and RizzyUI components inside it
* (a dialog, a dropdown) load their code on demand, so a child's data is not there yet during
* `init()`. A module can define `ready()` instead: it runs after `init()` (and its promise, if
* `init()` is async) and after every child that loads immediately (`x-load="eager"`, RizzyUI's
* default) has started, including components whose root was teleported elsewhere and is reached
* through an `<rz-proxy>` (dialogs, sheets, popovers). Children with a lazy strategy (`visible`, `idle`, `media`, `event`) are not
* waited for, because they may start much later or never.
*
* ```js
* export default () => ({
*   dialog: null,
*   ready() { this.dialog = Rizzy.$data(this.$refs.dialog); },
*   open() { this.dialog.openModal(); },
* });
* ```
*/
var READY_TIMEOUT_MS = 3e3;
var POLL_MS = 16;
function nextTick() {
	const Alpine = globalThis.Alpine;
	return Alpine && typeof Alpine.nextTick === "function" ? new Promise((resolve) => Alpine.nextTick(resolve)) : Promise.resolve();
}
function isLoadingNow(element) {
	if (!element || !element.hasAttribute("x-load")) return false;
	return (element.getAttribute("x-load") || "eager").trim() === "eager" && element._x_async !== "loaded";
}
function escapeAttribute(value) {
	return typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(value) : String(value).replace(/["\\]/g, "\\$&");
}
/**
* The child components `root` depends on: its descendants with `x-load`, plus the roots that
* `<rz-proxy data-for>` elements inside it stand for. Dialogs, sheets and popovers teleport their
* root out of the component (for example to `<body>`) and leave a proxy where `x-ref` points.
* @param {Element} root
*/
function childComponents(root) {
	const children = [...root.querySelectorAll("[x-load]")];
	for (const proxy of root.querySelectorAll("rz-proxy[data-for], [data-for]")) {
		const id = proxy.getAttribute("data-for");
		if (!id) continue;
		const target = document.querySelector(`[data-alpine-root="${escapeAttribute(id)}"][x-data]`) || document.getElementById(id);
		if (target && !root.contains(target)) children.push(target);
	}
	return children;
}
/**
* Resolves when the children of `root` that load immediately have started, or after
* {@link READY_TIMEOUT_MS} with a warning.
* @param {Element} root
* @param {string} name Data name, for the warning.
*/
async function childrenStarted(root, name) {
	await nextTick();
	if (!root || typeof root.querySelectorAll !== "function") return;
	const deadline = Date.now() + READY_TIMEOUT_MS;
	for (;;) {
		const pending = childComponents(root).filter(isLoadingNow);
		if (pending.length === 0) break;
		if (Date.now() > deadline) {
			console.warn(`[RizzyUI] '${name}': ready() is running before ${pending.length} child component(s) finished loading.`, pending);
			break;
		}
		await new Promise((resolve) => setTimeout(resolve, POLL_MS));
	}
	await nextTick();
}
/**
* Wraps a code-behind module's factory so that a `ready()` method on the data it returns runs
* once the component and its children have started. Factories without `ready()` are unchanged.
* The promise of the pending `ready()` call is on the root element as `_rz_ready` (used by the
* test helper).
* @template {(...args: any[]) => any} T
* @param {T} factory
* @param {string} [name]
* @returns {T}
*/
function withCodeBehindLifecycle(factory, name = "code-behind component") {
	if (typeof factory !== "function" || factory.__rzLifecycle) return factory;
	const wrapped = function(...args) {
		const data = factory.apply(this, args);
		if (!data || typeof data !== "object" || typeof data.ready !== "function") return data;
		const init = data.init;
		data.init = function(...initArgs) {
			const result = typeof init === "function" ? init.apply(this, initArgs) : void 0;
			const root = this.$el;
			const ready = Promise.resolve(result).then(() => childrenStarted(root, name)).then(() => this.ready());
			ready.catch((error) => console.error(`[RizzyUI] '${name}': ready() failed.`, error));
			if (root) root._rz_ready = ready;
			return result;
		};
		return data;
	};
	wrapped.__rzLifecycle = true;
	return wrapped;
}
// src/js/runtime/codeBehindLoader.js
/**
* @file Loader for Alpine code-behind modules (`Component.razor.js`).
*
* `RzAlpineComponent` renders `x-data="<name>" x-load="<strategy>" x-load-src="<module URL>"`.
* async-alpine reads `x-load-src` and calls `Alpine.asyncUrl(name, url)`; RizzyUI replaces that
* function so every code-behind module goes through one loader that:
*
* - loads each name once and warns when the same name is used for a different URL;
* - retries once with the plain URL (`data-rz-module-fallback`) when the fingerprinted URL fails,
*   which happens on a page left open across a deployment that removed the old file;
* - reports a failure once, names the module, dispatches `rz:module-error` on `document`, and
*   registers an inert data object so the rest of the page keeps working;
* - wraps the module's factory so a `ready()` method runs once the component's children have
*   started (see codeBehindLifecycle.js).
*/
var loaders = /* @__PURE__ */ new Map();
function absoluteUrl(url) {
	try {
		return new URL(url, document.baseURI).href;
	} catch {
		return url;
	}
}
function findFallbackUrl(url) {
	if (typeof document === "undefined") return null;
	for (const element of document.querySelectorAll("[data-rz-module-fallback]")) if (element.getAttribute("x-load-src") === url) return element.getAttribute("data-rz-module-fallback");
	return null;
}
/** The export async-alpine would use: one named like the component, the default, or the first. */
function pickExport(module, name) {
	if (typeof module === "function") return module;
	return module?.[name] || module?.default || Object.values(module ?? {})[0];
}
function withLifecycle(module, name) {
	const factory = pickExport(module, name);
	return typeof factory === "function" ? { default: withCodeBehindLifecycle(factory, name) } : module;
}
function failedModule(name) {
	return { default: () => ({
		_error: true,
		_errorMessage: `Module '${name}' failed to load.`
	}) };
}
/**
* Imports a code-behind module, with the fallback and error handling described above. Exported for
* `Rizzy.registerAsyncComponent`, which registers modules by name from script.
* @param {string} name Alpine data name.
* @param {string} url Module URL.
* @param {string | null} [fallbackUrl] URL to try when `url` fails.
*/
async function importCodeBehindModule(name, url, fallbackUrl = null) {
	try {
		return withLifecycle(await import(
			/* @vite-ignore */
			absoluteUrl(url)
), name);
	} catch (error) {
		const fallback = fallbackUrl ?? findFallbackUrl(url);
		if (fallback && fallback !== url) try {
			const module = withLifecycle(await import(
				/* @vite-ignore */
				absoluteUrl(fallback)
), name);
			console.warn(`[RizzyUI] Loaded '${name}' from ${fallback} because ${url} failed to load. The page is probably older than the current deployment; reload it to get matching markup and modules.`);
			return module;
		} catch {}
		console.error(`[RizzyUI] Could not load the code-behind module for '${name}' from ${url}` + (fallback && fallback !== url ? ` (or ${fallback})` : "") + ". Check that the .razor.js file exists next to the component and is published as a static web asset.", error);
		if (typeof document !== "undefined") document.dispatchEvent(new CustomEvent("rz:module-error", { detail: {
			name,
			url,
			fallbackUrl: fallback ?? null,
			error
		} }));
		return failedModule(name);
	}
}
/**
* Registers `name` to load from `url` through {@link importCodeBehindModule}. The first URL
* registered for a name wins, as in async-alpine; a different URL for the same name is reported.
* @param {import('alpinejs').Alpine & { asyncData: Function }} Alpine
* @param {string} name
* @param {string} url
* @param {string | null} [fallbackUrl]
* @returns {boolean} Whether the name is registered for this URL.
*/
function registerCodeBehindModule(Alpine, name, url, fallbackUrl = null) {
	if (!name || !url) return false;
	const previous = loaders.get(name);
	if (previous) {
		if (previous !== url) {
			console.warn(`[RizzyUI] Two code-behind modules use the Alpine name '${name}'. Keeping ${previous} and ignoring ${url}. Give the components different Name values, or leave Name unset so RizzyUI generates unique names.`);
			return false;
		}
		return true;
	}
	loaders.set(name, url);
	Alpine.asyncData(name, () => importCodeBehindModule(name, url, fallbackUrl));
	return true;
}
/**
* Routes async-alpine's `x-load-src` (and any `Alpine.asyncUrl` call) through
* {@link registerCodeBehindModule}. Call after `Alpine.plugin(AsyncAlpine)`.
* @param {any} Alpine
*/
function installCodeBehindLoader(Alpine) {
	if (typeof Alpine.asyncData !== "function") return;
	Alpine.asyncUrl = (name, url) => {
		registerCodeBehindModule(Alpine, name, url);
	};
}
// src/js/runtime/asyncComponentRegistrar.js
var pending = /* @__PURE__ */ new Map();
var onAlpineInitAttached = false;
function alpineWithAsyncData() {
	const Alpine = globalThis.Alpine;
	return Alpine && typeof Alpine.asyncData === "function" ? Alpine : null;
}
function flushPending() {
	const Alpine = alpineWithAsyncData();
	if (!Alpine) {
		console.error("[RizzyUI] Could not register async components: async-alpine is not available.");
		return;
	}
	for (const [name, path] of pending) registerCodeBehindModule(Alpine, name, path);
	pending.clear();
}
function registerAsyncComponent(name, path) {
	if (!name || !path) {
		console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
		return;
	}
	const Alpine = alpineWithAsyncData();
	if (Alpine && Alpine.version) {
		registerCodeBehindModule(Alpine, name, path);
		return;
	}
	pending.set(name, path);
	if (!onAlpineInitAttached && typeof document !== "undefined") {
		onAlpineInitAttached = true;
		document.addEventListener("alpine:init", flushPending, { once: true });
	}
}
// src/js/runtime/rizzyGlobal.js
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
function mergeIntoRizzyGlobal(existing, api) {
	const target = existing && typeof existing === "object" ? existing : {};
	const descriptors = Object.getOwnPropertyDescriptors(api);
	for (const key of Object.keys(descriptors)) descriptors[key] = {
		...descriptors[key],
		configurable: true
	};
	Object.defineProperties(target, descriptors);
	return target;
}
// src/js/runtime/htmxTeleportBridge.js
/**
* Lets htmx see hx-* markup that Alpine teleports into the document after htmx has initialized.
*
* Dialog, sheet, popover and dropdown content is rendered inside `<template x-teleport="body">`.
* Alpine clones that content into <body> when the owning component initializes. RizzyUI loads
* those components asynchronously (x-load), so this usually happens after htmx processed the
* page on DOMContentLoaded, and htmx (which has no DOM observer of its own) never wires the
* teleported hx-* elements: a form with hx-post would submit natively instead.
*
* The bridge watches only the direct children of <body> (where every RizzyUI teleport lands) and
* calls `htmx.process()` on each added element. `htmx.process` skips elements it has already
* initialized, so content that htmx swapped in itself is not processed twice.
*
* @param {Window} win The window to install into.
* @returns {() => void} Disconnects the observer.
*/
function installHtmxTeleportBridge(win = typeof window !== "undefined" ? window : void 0) {
	const doc = win?.document;
	const Observer = win?.MutationObserver;
	if (!doc?.body || typeof Observer !== "function") return () => {};
	if (doc.body.__rizzyUIHtmxBridge) return doc.body.__rizzyUIHtmxBridge;
	const observer = new Observer((records) => processAddedElements(win, records));
	observer.observe(doc.body, { childList: true });
	const disconnect = () => {
		observer.disconnect();
		delete doc.body.__rizzyUIHtmxBridge;
	};
	doc.body.__rizzyUIHtmxBridge = disconnect;
	return disconnect;
}
/**
* Calls htmx.process for every element node in the mutation records.
* Exported for tests.
*/
function processAddedElements(win, records) {
	const htmx = win?.htmx;
	if (typeof htmx?.process !== "function") return 0;
	let processed = 0;
	for (const record of records) for (const node of record.addedNodes ?? []) if (node?.nodeType === 1) {
		htmx.process(node);
		processed++;
	}
	return processed;
}
// src/js/lib/bootstrap.js
var cachedRizzyUI;
function bootstrapRizzyUI(Alpine) {
	if (cachedRizzyUI) return cachedRizzyUI;
	Alpine.plugin(module_default$2);
	Alpine.plugin(module_default);
	Alpine.plugin(module_default$1);
	Alpine.plugin(async_alpine_default);
	installCodeBehindLoader(Alpine);
	Alpine.plugin(createFlexRenderPlugin());
	if (typeof document !== "undefined") document.addEventListener("alpine:init", () => {
		registerStores(Alpine);
	}, { once: true });
	registerAsyncBundleComponents(Alpine);
	registerMobileDirective(Alpine);
	registerSyncDirective(Alpine);
	registerIndeterminateDirective(Alpine);
	registerPropsMagic(Alpine);
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
		if (window.Alpine && window.Alpine !== Alpine) console.warn("[RizzyUI] Another Alpine.js instance is already on the page. RizzyUI includes and starts Alpine; remove the separate Alpine script so components are not initialized twice.");
		window.Alpine = Alpine;
		window.Rizzy = mergeIntoRizzyGlobal(window.Rizzy, cachedRizzyUI);
		installHtmxTeleportBridge(window);
		document.dispatchEvent(new CustomEvent("rz:init", { detail: { Rizzy: window.Rizzy } }));
	}
	resolveReady(cachedRizzyUI);
	return cachedRizzyUI;
}
export { fallbackStatuses as a, fallbackPositions as i, rizzyRequire as n, getAliasMap as o, flex as r, toastInputEvents as s, bootstrapRizzyUI as t };

//# sourceMappingURL=bootstrap-0Zd0taL8.js.map