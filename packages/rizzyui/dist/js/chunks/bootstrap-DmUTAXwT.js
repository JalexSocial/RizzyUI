const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./menu-runtime-lTXFcwok.js","./floating-ui.dom-YtTtsTrt.js","./popover-tooltip-runtime-CcG3WsIN.js"])))=>i.map(i=>d[i]);
function src_default$2(Alpine2) {
  Alpine2.directive("collapse", collapse);
  collapse.inline = (el, { modifiers }) => {
    if (!modifiers.includes("min"))
      return;
    el._x_doShow = () => {
    };
    el._x_doHide = () => {
    };
  };
  function collapse(el, { modifiers }) {
    let duration = modifierValue(modifiers, "duration", 250) / 1e3;
    let floor = modifierValue(modifiers, "min", 0);
    let fullyHide = !modifiers.includes("min");
    if (!el._x_isShown)
      el.style.height = `${floor}px`;
    if (!el._x_isShown && fullyHide)
      el.hidden = true;
    if (!el._x_isShown)
      el.style.overflow = "hidden";
    let setFunction = (el2, styles) => {
      let revertFunction = Alpine2.setStyles(el2, styles);
      return styles.height ? () => {
      } : revertFunction;
    };
    let transitionStyles = {
      transitionProperty: "height",
      transitionDuration: `${duration}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    el._x_transition = {
      in(before = () => {
      }, after = () => {
      }) {
        if (fullyHide)
          el.hidden = false;
        if (fullyHide)
          el.style.display = null;
        let current = el.getBoundingClientRect().height;
        el.style.height = "auto";
        let full = el.getBoundingClientRect().height;
        if (current === full) {
          current = floor;
        }
        Alpine2.transition(el, Alpine2.setStyles, {
          during: transitionStyles,
          start: { height: current + "px" },
          end: { height: full + "px" }
        }, () => el._x_isShown = true, () => {
          if (Math.abs(el.getBoundingClientRect().height - full) < 1) {
            el.style.overflow = null;
          }
        });
      },
      out(before = () => {
      }, after = () => {
      }) {
        let full = el.getBoundingClientRect().height;
        Alpine2.transition(el, setFunction, {
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
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "duration") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "min") {
    let match = rawValue.match(/([0-9]+)px/);
    if (match)
      return match[1];
  }
  return rawValue;
}
var module_default$2 = src_default$2;
var candidateSelectors = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  return element.getRootNode();
} : function(element) {
  return element.ownerDocument;
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
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
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scope: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !options.shadowRootFilter || options.shadowRootFilter(element);
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scope: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var getTabindex = function getTabindex2(node, isScope) {
  if (node.tabIndex < 0) {
    if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || node.isContentEditable) && isNaN(parseInt(node.getAttribute("tabindex"), 10))) {
      return 0;
    }
  }
  return node.tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a2, b) {
  return a2.tabIndex === b.tabIndex ? a2.documentOrder - b.documentOrder : a2.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r2 = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r2;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i2 = 0; i2 < nodes.length; i2++) {
    if (nodes[i2].checked && nodes[i2].form === form) {
      return nodes[i2];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
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
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  var nodeRootHost = getRootNode(node).host;
  var nodeIsAttached = (nodeRootHost === null || nodeRootHost === void 0 ? void 0 : nodeRootHost.ownerDocument.contains(nodeRootHost)) || node.ownerDocument.contains(node);
  if (!displayCheck || displayCheck === "full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (nodeIsAttached) {
      return !node.getClientRects().length;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i2 = 0; i2 < parentNode.children.length; i2++) {
          var child = parentNode.children.item(i2);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabindex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i2) {
    var isScope = !!item.scope;
    var element = isScope ? item.scope : item;
    var candidateTabindex = getTabindex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i2,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(el, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([el], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable2(el, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([el], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
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
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = null != arguments[i2] ? arguments[i2] : {};
    i2 % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var activeFocusTraps = /* @__PURE__ */ (function() {
  var trapQueue = [];
  return {
    activateTrap: function activateTrap(trap) {
      if (trapQueue.length > 0) {
        var activeTrap = trapQueue[trapQueue.length - 1];
        if (activeTrap !== trap) {
          activeTrap.pause();
        }
      }
      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex === -1) {
        trapQueue.push(trap);
      } else {
        trapQueue.splice(trapIndex, 1);
        trapQueue.push(trap);
      }
    },
    deactivateTrap: function deactivateTrap(trap) {
      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex !== -1) {
        trapQueue.splice(trapIndex, 1);
      }
      if (trapQueue.length > 0) {
        trapQueue[trapQueue.length - 1].unpause();
      }
    }
  };
})();
var isSelectableInput = function isSelectableInput2(node) {
  return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent2(e2) {
  return e2.key === "Escape" || e2.key === "Esc" || e2.keyCode === 27;
};
var isTabEvent = function isTabEvent2(e2) {
  return e2.key === "Tab" || e2.keyCode === 9;
};
var delay = function delay2(fn) {
  return setTimeout(fn, 0);
};
var findIndex = function findIndex2(arr, fn) {
  var idx = -1;
  arr.every(function(value, i2) {
    if (fn(value)) {
      idx = i2;
      return false;
    }
    return true;
  });
  return idx;
};
var valueOrHandler = function valueOrHandler2(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget2(event2) {
  return event2.target.shadowRoot && typeof event2.composedPath === "function" ? event2.composedPath()[0] : event2.target;
};
var createFocusTrap = function createFocusTrap2(elements, userOptions) {
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
  var config = _objectSpread2({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true
  }, userOptions);
  var state = {
    // containers given to createFocusTrap()
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{
    //   container: HTMLElement,
    //   tabbableNodes: Array<HTMLElement>, // empty if none
    //   focusableNodes: Array<HTMLElement>, // empty if none
    //   firstTabbableNode: HTMLElement|null,
    //   lastTabbableNode: HTMLElement|null,
    //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
    // }>}
    containerGroups: [],
    // same order/length as `containers` list
    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0
  };
  var trap;
  var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };
  var findContainerIndex = function findContainerIndex2(element) {
    return state.containerGroups.findIndex(function(_ref) {
      var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
      return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      tabbableNodes.find(function(node) {
        return node === element;
      });
    });
  };
  var getNodeForOption = function getNodeForOption2(optionName) {
    var optionValue = config[optionName];
    if (typeof optionValue === "function") {
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }
      optionValue = optionValue.apply(void 0, params);
    }
    if (optionValue === true) {
      optionValue = void 0;
    }
    if (!optionValue) {
      if (optionValue === void 0 || optionValue === false) {
        return optionValue;
      }
      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }
    var node = optionValue;
    if (typeof optionValue === "string") {
      node = doc.querySelector(optionValue);
      if (!node) {
        throw new Error("`".concat(optionName, "` as selector refers to no known node"));
      }
    }
    return node;
  };
  var getInitialFocusNode = function getInitialFocusNode2() {
    var node = getNodeForOption("initialFocus");
    if (node === false) {
      return false;
    }
    if (node === void 0) {
      if (findContainerIndex(doc.activeElement) >= 0) {
        node = doc.activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
        node = firstTabbableNode || getNodeForOption("fallbackFocus");
      }
    }
    if (!node) {
      throw new Error("Your focus-trap needs to have at least one focusable element");
    }
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
          var nodeIdx = focusableNodes.findIndex(function(n2) {
            return n2 === node;
          });
          if (nodeIdx < 0) {
            return void 0;
          }
          if (forward) {
            return focusableNodes.slice(nodeIdx + 1).find(function(n2) {
              return isTabbable(n2, config.tabbableOptions);
            });
          }
          return focusableNodes.slice(0, nodeIdx).reverse().find(function(n2) {
            return isTabbable(n2, config.tabbableOptions);
          });
        }
      };
    });
    state.tabbableGroups = state.containerGroups.filter(function(group) {
      return group.tabbableNodes.length > 0;
    });
    if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    }
  };
  var tryFocus = function tryFocus2(node) {
    if (node === false) {
      return;
    }
    if (node === doc.activeElement) {
      return;
    }
    if (!node || !node.focus) {
      tryFocus2(getInitialFocusNode());
      return;
    }
    node.focus({
      preventScroll: !!config.preventScroll
    });
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  };
  var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
    var node = getNodeForOption("setReturnFocus", previousActiveElement);
    return node ? node : node === false ? false : previousActiveElement;
  };
  var checkPointerDown = function checkPointerDown2(e2) {
    var target = getActualTarget(e2);
    if (findContainerIndex(target) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e2)) {
      trap.deactivate({
        // if, on deactivation, we should return focus to the node originally-focused
        //  when the trap was activated (or the configured `setReturnFocus` node),
        //  then assume it's also OK to return focus to the outside node that was
        //  just clicked, causing deactivation, as long as that node is focusable;
        //  if it isn't focusable, then return focus to the original node focused
        //  on activation (or the configured `setReturnFocus` node)
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked, whether it's focusable or not; by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node)
        returnFocus: config.returnFocusOnDeactivate && !isFocusable(target, config.tabbableOptions)
      });
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e2)) {
      return;
    }
    e2.preventDefault();
  };
  var checkFocusIn = function checkFocusIn2(e2) {
    var target = getActualTarget(e2);
    var targetContained = findContainerIndex(target) >= 0;
    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      e2.stopImmediatePropagation();
      tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
    }
  };
  var checkTab = function checkTab2(e2) {
    var target = getActualTarget(e2);
    updateTabbableNodes();
    var destinationNode = null;
    if (state.tabbableGroups.length > 0) {
      var containerIndex = findContainerIndex(target);
      var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
      if (containerIndex < 0) {
        if (e2.shiftKey) {
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (e2.shiftKey) {
        var startOfGroupIndex = findIndex(state.tabbableGroups, function(_ref2) {
          var firstTabbableNode = _ref2.firstTabbableNode;
          return target === firstTabbableNode;
        });
        if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
          startOfGroupIndex = containerIndex;
        }
        if (startOfGroupIndex >= 0) {
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = destinationGroup.lastTabbableNode;
        }
      } else {
        var lastOfGroupIndex = findIndex(state.tabbableGroups, function(_ref3) {
          var lastTabbableNode = _ref3.lastTabbableNode;
          return target === lastTabbableNode;
        });
        if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
          lastOfGroupIndex = containerIndex;
        }
        if (lastOfGroupIndex >= 0) {
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = _destinationGroup.firstTabbableNode;
        }
      }
    } else {
      destinationNode = getNodeForOption("fallbackFocus");
    }
    if (destinationNode) {
      e2.preventDefault();
      tryFocus(destinationNode);
    }
  };
  var checkKey = function checkKey2(e2) {
    if (isEscapeEvent(e2) && valueOrHandler(config.escapeDeactivates, e2) !== false) {
      e2.preventDefault();
      trap.deactivate();
      return;
    }
    if (isTabEvent(e2)) {
      checkTab(e2);
      return;
    }
  };
  var checkClick = function checkClick2(e2) {
    var target = getActualTarget(e2);
    if (findContainerIndex(target) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e2)) {
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e2)) {
      return;
    }
    e2.preventDefault();
    e2.stopImmediatePropagation();
  };
  var addListeners = function addListeners2() {
    if (!state.active) {
      return;
    }
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
    if (!state.active) {
      return;
    }
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
      if (state.active) {
        return this;
      }
      var onActivate = getOption(activateOptions, "onActivate");
      var onPostActivate = getOption(activateOptions, "onPostActivate");
      var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
      if (!checkCanFocusTrap) {
        updateTabbableNodes();
      }
      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = doc.activeElement;
      if (onActivate) {
        onActivate();
      }
      var finishActivation = function finishActivation2() {
        if (checkCanFocusTrap) {
          updateTabbableNodes();
        }
        addListeners();
        if (onPostActivate) {
          onPostActivate();
        }
      };
      if (checkCanFocusTrap) {
        checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
        return this;
      }
      finishActivation();
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }
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
      if (onDeactivate) {
        onDeactivate();
      }
      var finishDeactivation = function finishDeactivation2() {
        delay(function() {
          if (returnFocus) {
            tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
          }
          if (onPostDeactivate) {
            onPostDeactivate();
          }
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
      if (state.paused || !state.active) {
        return this;
      }
      state.paused = true;
      removeListeners();
      return this;
    },
    unpause: function unpause() {
      if (!state.paused || !state.active) {
        return this;
      }
      state.paused = false;
      updateTabbableNodes();
      addListeners();
      return this;
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function(element) {
        return typeof element === "string" ? doc.querySelector(element) : element;
      });
      if (state.active) {
        updateTabbableNodes();
      }
      return this;
    }
  };
  trap.updateContainerElements(elements);
  return trap;
};
function src_default$1(Alpine2) {
  let lastFocused;
  let currentFocused;
  window.addEventListener("focusin", () => {
    lastFocused = currentFocused;
    currentFocused = document.activeElement;
  });
  Alpine2.magic("focus", (el) => {
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
        if (Array.isArray(within))
          return within;
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
        if (list.indexOf(current) === -1)
          return;
        if (this.__wrapAround && list.indexOf(current) === list.length - 1) {
          return list[0];
        }
        return list[list.indexOf(current) + 1];
      },
      getPrevious() {
        let list = this.all();
        let current = document.activeElement;
        if (list.indexOf(current) === -1)
          return;
        if (this.__wrapAround && list.indexOf(current) === 0) {
          return list.slice(-1)[0];
        }
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
        if (!el2)
          return;
        setTimeout(() => {
          if (!el2.hasAttribute("tabindex"))
            el2.setAttribute("tabindex", "0");
          el2.focus({ preventScroll: this.__noscroll });
        });
      }
    };
  });
  Alpine2.directive("trap", Alpine2.skipDuringClone(
    (el, { expression, modifiers }, { effect, evaluateLater, cleanup }) => {
      let evaluator = evaluateLater(expression);
      let oldValue = false;
      let options = {
        escapeDeactivates: false,
        allowOutsideClick: true,
        fallbackFocus: () => el
      };
      let undoInert = () => {
      };
      if (modifiers.includes("noautofocus")) {
        options.initialFocus = false;
      } else {
        let autofocusEl = el.querySelector("[autofocus]");
        if (autofocusEl)
          options.initialFocus = autofocusEl;
      }
      if (modifiers.includes("inert")) {
        options.onPostActivate = () => {
          Alpine2.nextTick(() => {
            undoInert = setInert(el);
          });
        };
      }
      let trap = createFocusTrap(el, options);
      let undoDisableScrolling = () => {
      };
      const releaseFocus = () => {
        undoInert();
        undoInert = () => {
        };
        undoDisableScrolling();
        undoDisableScrolling = () => {
        };
        trap.deactivate({
          returnFocus: !modifiers.includes("noreturn")
        });
      };
      effect(() => evaluator((value) => {
        if (oldValue === value)
          return;
        if (value && !oldValue) {
          if (modifiers.includes("noscroll"))
            undoDisableScrolling = disableScrolling();
          setTimeout(() => {
            trap.activate();
          }, 15);
        }
        if (!value && oldValue) {
          releaseFocus();
        }
        oldValue = !!value;
      }));
      cleanup(releaseFocus);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (el, { expression, modifiers }, { evaluate }) => {
      if (modifiers.includes("inert") && evaluate(expression))
        setInert(el);
    }
  ));
}
function setInert(el) {
  let undos = [];
  crawlSiblingsUp(el, (sibling) => {
    let cache = sibling.hasAttribute("aria-hidden");
    sibling.setAttribute("aria-hidden", "true");
    undos.push(() => cache || sibling.removeAttribute("aria-hidden"));
  });
  return () => {
    while (undos.length)
      undos.pop()();
  };
}
function crawlSiblingsUp(el, callback) {
  if (el.isSameNode(document.body) || !el.parentNode)
    return;
  Array.from(el.parentNode.children).forEach((sibling) => {
    if (sibling.isSameNode(el)) {
      crawlSiblingsUp(el.parentNode, callback);
    } else {
      callback(sibling);
    }
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
function eager() {
  return true;
}
function event({ component, argument }) {
  return new Promise((resolve) => {
    if (argument) {
      window.addEventListener(
        argument,
        () => resolve(),
        { once: true }
      );
    } else {
      const cb = (e2) => {
        if (e2.detail.id !== component.id) return;
        window.removeEventListener("async-alpine:load", cb);
        resolve();
      };
      window.addEventListener("async-alpine:load", cb);
    }
  });
}
function idle() {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(resolve);
    } else {
      setTimeout(resolve, 200);
    }
  });
}
function media({ argument }) {
  return new Promise((resolve) => {
    if (!argument) {
      console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'");
      return resolve();
    }
    const mediaQuery = window.matchMedia(`(${argument})`);
    if (mediaQuery.matches) {
      resolve();
    } else {
      mediaQuery.addEventListener("change", resolve, { once: true });
    }
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
  const requirements = parseRequirements(component.strategy);
  await generateRequirements(component, requirements);
}
async function generateRequirements(component, requirements) {
  if (requirements.type === "expression") {
    if (requirements.operator === "&&") {
      return Promise.all(
        requirements.parameters.map((param) => generateRequirements(component, param))
      );
    }
    if (requirements.operator === "||") {
      return Promise.any(
        requirements.parameters.map((param) => generateRequirements(component, param))
      );
    }
  }
  if (!strategies_default[requirements.method]) return false;
  return strategies_default[requirements.method]({
    component,
    argument: requirements.argument
  });
}
function parseRequirements(expression) {
  const tokens = tokenize(expression);
  let ast = parseExpression(tokens);
  if (ast.type === "method") {
    return {
      type: "expression",
      operator: "&&",
      parameters: [ast]
    };
  }
  return ast;
}
function tokenize(expression) {
  const regex = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(expression)) !== null) {
    const [_, parenthesis, operator, token] = match;
    if (parenthesis !== void 0) {
      tokens.push({ type: "parenthesis", value: parenthesis });
    } else if (operator !== void 0) {
      tokens.push({
        type: "operator",
        // we do the below to make operators backwards-compatible with previous
        // versions of Async Alpine, where '|' is equivalent to &&
        value: operator === "|" ? "&&" : operator
      });
    } else {
      const tokenObj = {
        type: "method",
        method: token.trim()
      };
      if (token.includes("(")) {
        tokenObj.method = token.substring(0, token.indexOf("(")).trim();
        tokenObj.argument = token.substring(
          token.indexOf("(") + 1,
          token.indexOf(")")
        );
      }
      if (token.method === "immediate") {
        token.method = "eager";
      }
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
    if (ast.type === "expression" && ast.operator === operator) {
      ast.parameters.push(right);
    } else {
      ast = {
        type: "expression",
        operator,
        parameters: [ast, right]
      };
    }
  }
  return ast;
}
function parseTerm(tokens) {
  if (tokens[0].value === "(") {
    tokens.shift();
    const ast = parseExpression(tokens);
    if (tokens[0].value === ")") {
      tokens.shift();
    }
    return ast;
  } else {
    return tokens.shift();
  }
}
function async_alpine_default(Alpine2) {
  const directive = "load";
  const srcAttr = Alpine2.prefixed("load-src");
  const ignoreAttr = Alpine2.prefixed("ignore");
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
  Alpine2.asyncOptions = (opts) => {
    options = {
      ...options,
      ...opts
    };
  };
  Alpine2.asyncData = (name, download2 = false) => {
    data[name] = {
      loaded: false,
      download: download2
    };
  };
  Alpine2.asyncUrl = (name, url) => {
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
  Alpine2.asyncAlias = (path) => {
    alias = path;
  };
  const syncHandler = (el) => {
    Alpine2.skipDuringClone(() => {
      if (el._x_async) return;
      el._x_async = "init";
      el._x_ignore = true;
      el.setAttribute(ignoreAttr, "");
    })();
  };
  const handler = async (el) => {
    Alpine2.skipDuringClone(async () => {
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
  Alpine2.directive(directive, handler).before("ignore");
  function elementPrep(el) {
    const name = parseName(el.getAttribute(Alpine2.prefixed("data")));
    const strategy = el.getAttribute(Alpine2.prefixed(directive)) || options.defaultStrategy;
    const urlAttributeValue = el.getAttribute(srcAttr);
    if (urlAttributeValue) {
      Alpine2.asyncUrl(name, urlAttributeValue);
    }
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
    Alpine2.data(name, module);
    data[name].loaded = true;
  }
  async function getModule(name) {
    if (!data[name]) return;
    const module = await data[name].download(name);
    if (typeof module === "function") return module;
    let whichExport = module[name] || module.default || Object.values(module)[0] || false;
    return whichExport;
  }
  function activate(el) {
    Alpine2.destroyTree(el);
    el._x_ignore = false;
    el.removeAttribute(ignoreAttr);
    if (el.closest(`[${ignoreAttr}]`)) return;
    Alpine2.initTree(el);
  }
  function handleAlias(name) {
    if (!alias || data[name]) return;
    if (typeof alias === "function") {
      Alpine2.asyncData(name, alias);
      return;
    }
    Alpine2.asyncUrl(name, alias.replaceAll("[name]", name));
  }
  function parseName(attribute) {
    const parsedName = (attribute || "").trim().split(/[({]/g)[0];
    const ourName = parsedName || `_x_async_${index()}`;
    return ourName;
  }
  function parseUrl(url) {
    if (options.keepRelativeURLs) return url;
    const absoluteReg = new RegExp("^(?:[a-z+]+:)?//", "i");
    if (!absoluteReg.test(url)) {
      return new URL(url, document.baseURI).href;
    }
    return url;
  }
}
function src_default(Alpine2) {
  Alpine2.directive("intersect", Alpine2.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
    let evaluate = evaluateLater(expression);
    let options = {
      rootMargin: getRootMargin(modifiers),
      threshold: getThreshold(modifiers)
    };
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting === (value === "leave"))
          return;
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
  if (modifiers.includes("full"))
    return 0.99;
  if (modifiers.includes("half"))
    return 0.5;
  if (!modifiers.includes("threshold"))
    return 0;
  let threshold = modifiers[modifiers.indexOf("threshold") + 1];
  if (threshold === "100")
    return 1;
  if (threshold === "0")
    return 0;
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
  if (index === -1)
    return fallback;
  let values = [];
  for (let i2 = 1; i2 < 5; i2++) {
    values.push(getLengthValue(modifiers[index + i2] || ""));
  }
  values = values.filter((v2) => v2 !== void 0);
  return values.length ? values.join(" ").trim() : fallback;
}
var module_default = src_default;
function t(t2, e2) {
  if (!(t2 instanceof e2)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function e(t2, e2) {
  for (var s2 = 0; s2 < e2.length; s2++) {
    var i2 = e2[s2];
    i2.enumerable = i2.enumerable || false;
    i2.configurable = true;
    if ("value" in i2) i2.writable = true;
    Object.defineProperty(t2, i2.key, i2);
  }
}
function s(t2, s2, i2) {
  if (s2) e(t2.prototype, s2);
  return t2;
}
var i = Object.defineProperty;
var n = function(t2, e2) {
  return i(t2, "name", { value: e2, configurable: true });
};
var o = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r\n</svg>\r\n';
var a = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r\n</svg>\r\n';
var r = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r\n</svg>\r\n';
var c = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r\n</svg>\r\n';
var l = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r\n  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r\n</svg>\r\n';
var h = n(function(t2) {
  return new DOMParser().parseFromString(t2, "text/html").body.childNodes[0];
}, "stringToHTML"), d = n(function(t2) {
  var e2 = new DOMParser().parseFromString(t2, "application/xml");
  return document.importNode(e2.documentElement, true).outerHTML;
}, "getSvgNode");
var u = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, f = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, p = { OUTLINE: "outline", FILLED: "filled" }, I = { FADE: "fade", SLIDE: "slide" }, v = { CLOSE: d(o), SUCCESS: d(c), ERROR: d(a), WARNING: d(l), INFO: d(r) };
var N = n(function(t2) {
  t2.wrapper.classList.add(u.NOTIFY_FADE), setTimeout(function() {
    t2.wrapper.classList.add(u.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), O = n(function(t2) {
  t2.wrapper.classList.remove(u.NOTIFY_FADE_IN), setTimeout(function() {
    t2.wrapper.remove();
  }, t2.speed);
}, "fadeOut"), T = n(function(t2) {
  t2.wrapper.classList.add(u.NOTIFY_SLIDE), setTimeout(function() {
    t2.wrapper.classList.add(u.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), E = n(function(t2) {
  t2.wrapper.classList.remove(u.NOTIFY_SLIDE_IN), setTimeout(function() {
    t2.wrapper.remove();
  }, t2.speed);
}, "slideOut");
var m = (function() {
  function e2(s2) {
    var i2 = this;
    t(this, e2);
    this.notifyOut = n(function(t2) {
      t2(i2);
    }, "notifyOut");
    var o2 = s2.notificationsGap, a2 = o2 === void 0 ? 20 : o2, r2 = s2.notificationsPadding, c2 = r2 === void 0 ? 20 : r2, l2 = s2.status, h2 = l2 === void 0 ? "success" : l2, d2 = s2.effect, u2 = d2 === void 0 ? I.FADE : d2, f2 = s2.type, p2 = f2 === void 0 ? "outline" : f2, v2 = s2.title, N2 = s2.text, O2 = s2.showIcon, T2 = O2 === void 0 ? true : O2, E2 = s2.customIcon, m2 = E2 === void 0 ? "" : E2, w2 = s2.customClass, y = w2 === void 0 ? "" : w2, L = s2.speed, C = L === void 0 ? 500 : L, F = s2.showCloseButton, _ = F === void 0 ? true : F, S = s2.autoclose, g = S === void 0 ? true : S, R = s2.autotimeout, Y = R === void 0 ? 3e3 : R, x = s2.position, A = x === void 0 ? "right top" : x, b = s2.customWrapper, k = b === void 0 ? "" : b;
    if (this.customWrapper = k, this.status = h2, this.title = v2, this.text = N2, this.showIcon = T2, this.customIcon = m2, this.customClass = y, this.speed = C, this.effect = u2, this.showCloseButton = _, this.autoclose = g, this.autotimeout = Y, this.notificationsGap = a2, this.notificationsPadding = c2, this.type = p2, this.position = A, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  s(e2, [{ key: "checkRequirements", value: function t2() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function t2() {
    var t3 = document.querySelector(".".concat(u.CONTAINER));
    t3 ? this.container = t3 : (this.container = document.createElement("div"), this.container.classList.add(u.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function t2() {
    this.container.classList[this.position === "center" ? "add" : "remove"](u.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](u.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](u.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](u.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](u.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](u.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](u.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function t2() {
    var t3 = this;
    var e3 = document.createElement("div");
    e3.classList.add(u.NOTIFY_CLOSE), e3.innerHTML = v.CLOSE, this.wrapper.appendChild(e3), e3.addEventListener("click", function() {
      t3.close();
    });
  } }, { key: "setWrapper", value: function t2() {
    var t3 = this;
    switch (this.customWrapper ? this.wrapper = h(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(u.NOTIFY), this.type) {
      case p.OUTLINE:
        this.wrapper.classList.add(u.NOTIFY_OUTLINE);
        break;
      case p.FILLED:
        this.wrapper.classList.add(u.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(u.NOTIFY_OUTLINE);
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
    this.autoclose && (this.wrapper.classList.add(u.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(e3) {
      t3.wrapper.classList.add(e3);
    });
  } }, { key: "setContent", value: function t2() {
    var t3 = document.createElement("div");
    t3.classList.add(u.NOTIFY_CONTENT);
    var e3, s2;
    this.title && (e3 = document.createElement("div"), e3.classList.add(u.NOTIFY_TITLE), e3.textContent = this.title.trim(), this.showCloseButton || (e3.style.paddingRight = "0")), this.text && (s2 = document.createElement("div"), s2.classList.add(u.NOTIFY_TEXT), s2.innerHTML = this.text.trim(), this.title || (s2.style.marginTop = "0")), this.wrapper.appendChild(t3), this.title && t3.appendChild(e3), this.text && t3.appendChild(s2);
  } }, { key: "setIcon", value: function t2() {
    var t3 = n(function(t4) {
      switch (t4) {
        case f.SUCCESS:
          return v.SUCCESS;
        case f.ERROR:
          return v.ERROR;
        case f.WARNING:
          return v.WARNING;
        case f.INFO:
          return v.INFO;
      }
    }, "computedIcon"), e3 = document.createElement("div");
    e3.classList.add(u.NOTIFY_ICON), e3.innerHTML = this.customIcon || t3(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(e3);
  } }, { key: "setObserver", value: function t2() {
    var t3 = this;
    var e3 = new IntersectionObserver(function(e4) {
      if (e4[0].intersectionRatio <= 0) t3.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      e3.observe(t3.wrapper);
    }, this.speed);
  } }, { key: "notifyIn", value: function t2(t2) {
    t2(this);
  } }, { key: "autoClose", value: function t2() {
    var t3 = this;
    setTimeout(function() {
      t3.close();
    }, this.autotimeout + this.speed);
  } }, { key: "close", value: function t2() {
    this.notifyOut(this.selectedNotifyOutEffect);
  } }, { key: "setEffect", value: function t2() {
    switch (this.effect) {
      case I.FADE:
        this.selectedNotifyInEffect = N, this.selectedNotifyOutEffect = O;
        break;
      case I.SLIDE:
        this.selectedNotifyInEffect = T, this.selectedNotifyOutEffect = E;
        break;
      default:
        this.selectedNotifyInEffect = N, this.selectedNotifyOutEffect = O;
    }
  } }]);
  return e2;
})();
n(m, "Notify");
var w = m;
globalThis.Notify = w;
const allowedStatuses = ["success", "error", "warning", "info"];
const allowedPositions = [
  // Standard Corners
  "right top",
  "top right",
  "right bottom",
  "bottom right",
  "left top",
  "top left",
  "left bottom",
  "bottom left",
  // Centered Horizontally
  "center top",
  "x-center top",
  "center bottom",
  "x-center bottom",
  // Centered Vertically
  "left center",
  "left y-center",
  "y-center left",
  "right center",
  "right y-center",
  "y-center right",
  // Aliases for Centered Horizontally (already covered but good for robustness)
  "top center",
  "top x-center",
  "bottom center",
  "bottom x-center",
  // Absolute Center
  "center"
];
const defaultConfig = {
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
const Toast = {
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
function $data(idOrElement) {
  if (typeof Alpine === "undefined" || typeof Alpine.$data !== "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return void 0;
  }
  if (idOrElement instanceof Element) {
    const target = resolveProxy(idOrElement) || idOrElement;
    let alpineData = Alpine.$data(target);
    if (alpineData === void 0) {
      const nearest = target.closest?.("[x-data]");
      if (nearest) {
        alpineData = Alpine.$data(nearest);
      }
    }
    if (alpineData === void 0) {
      warnDataUndefined("element", target);
    }
    return alpineData;
  }
  if (typeof idOrElement === "string") {
    const componentId = idOrElement.trim();
    if (!componentId) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return void 0;
    }
    const selector = `[data-alpine-root="${cssEscapeSafe(componentId)}"]`;
    let root = null;
    const wrapper = document.getElementById(componentId);
    if (wrapper) {
      root = wrapper.matches(selector) ? wrapper : wrapper.querySelector(selector);
    }
    if (!root) {
      root = findAlpineRootById(componentId);
    }
    if (!root) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${selector} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${componentId}"' is present.`
      );
      return void 0;
    }
    const alpineData = Alpine.$data(root);
    if (alpineData === void 0) {
      warnDataUndefined(`data-alpine-root="${componentId}"`, root);
    }
    return alpineData;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
  return void 0;
}
function resolveProxy(el) {
  if (!(el instanceof Element)) return null;
  const isProxyTag = el.tagName?.toLowerCase?.() === "rz-proxy";
  const proxyFor = el.getAttribute?.("data-for");
  if (isProxyTag || proxyFor) {
    const id = proxyFor || "";
    if (!id) return el;
    const root = findAlpineRootById(id);
    if (!root) {
      console.warn(
        `Rizzy.$data: Proxy element could not resolve Alpine root for id "${id}". Ensure the teleported root rendered with data-alpine-root="${id}".`
      );
      return null;
    }
    return root;
  }
  return el;
}
function findAlpineRootById(id) {
  const sel = `[data-alpine-root="${cssEscapeSafe(id)}"]`;
  const candidates = document.querySelectorAll(sel);
  for (const n2 of candidates) {
    if (n2.hasAttribute("x-data")) return n2;
  }
  if (candidates.length > 0) return candidates[0];
  return document.getElementById(id) || null;
}
function cssEscapeSafe(s2) {
  try {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(s2);
    }
  } catch (_) {
  }
  return String(s2).replace(/"/g, '\\"');
}
function warnDataUndefined(origin, target) {
  const desc = `${target.tagName?.toLowerCase?.() || "node"}${target.id ? "#" + target.id : ""}${target.classList?.length ? "." + Array.from(target.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${origin} (${desc}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function props(alpineRootElement) {
  if (!(alpineRootElement instanceof Element)) {
    console.warn("[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el).");
    return {};
  }
  const propsScriptId = alpineRootElement.dataset.propsId;
  if (!propsScriptId) {
    return {};
  }
  const propsScriptEl = document.getElementById(propsScriptId);
  if (!propsScriptEl) {
    console.warn(`[Rizzy.props] Could not find the props script tag with ID '${propsScriptId}'.`);
    return {};
  }
  try {
    return JSON.parse(propsScriptEl.textContent || "{}");
  } catch (e2) {
    console.error(`[Rizzy.props] Failed to parse JSON from script tag #${propsScriptId}.`, e2);
    return {};
  }
}
function registerMobileDirective(Alpine2) {
  Alpine2.directive("mobile", (el, { modifiers, expression }, { cleanup }) => {
    const bpMod = modifiers.find((m2) => m2.startsWith("bp-"));
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
      if (typeof Alpine2.$data === "function") return Alpine2.$data(el);
      return el.__x ? el.__x.$data : null;
    };
    const setProp = (val) => {
      if (!ASSIGN_PROP) return;
      const data = getComponentData();
      if (data) data[expression] = val;
    };
    const dispatch = (val) => {
      el.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: true,
          detail: { isMobile: val, width: window.innerWidth, breakpoint: BREAKPOINT }
        })
      );
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
function registerSyncDirective(Alpine2) {
  const handler = (el, { expression, modifiers }, { cleanup, effect }) => {
    if (!expression || typeof expression !== "string") return;
    const setAtPath = (obj, path, value) => {
      const norm = path.replace(/\[(\d+)\]/g, ".$1");
      const keys = norm.split(".");
      const last = keys.pop();
      let cur = obj;
      for (const k of keys) {
        if (cur[k] == null || typeof cur[k] !== "object") cur[k] = isFinite(+k) ? [] : {};
        cur = cur[k];
      }
      cur[last] = value;
    };
    const stack = Alpine2.closestDataStack(el) || [];
    const childData = stack[0] || null;
    const parentData = stack[1] || null;
    if (!childData || !parentData) {
      if (import.meta?.env?.DEV) {
        console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      }
      return;
    }
    const pairs = expression.split(",").map((s2) => s2.trim()).filter(Boolean).map((s2) => {
      const m2 = s2.split("->").map((x) => x.trim());
      if (m2.length !== 2) {
        console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', s2);
        return null;
      }
      return { parentPath: m2[0], childPath: m2[1] };
    }).filter(Boolean);
    const initChildWins = modifiers.includes("init-child") || modifiers.includes("child") || modifiers.includes("childWins");
    const guard = pairs.map(() => ({
      fromParent: false,
      fromChild: false,
      skipChildOnce: initChildWins
      // avoid redundant first child->parent write
    }));
    const stops = [];
    pairs.forEach((pair, idx) => {
      const g = guard[idx];
      if (initChildWins) {
        const childVal = Alpine2.evaluate(el, pair.childPath, { scope: childData });
        g.fromChild = true;
        setAtPath(parentData, pair.parentPath, childVal);
        queueMicrotask(() => {
          g.fromChild = false;
        });
      } else {
        const parentVal = Alpine2.evaluate(el, pair.parentPath, { scope: parentData });
        g.fromParent = true;
        setAtPath(childData, pair.childPath, parentVal);
        queueMicrotask(() => {
          g.fromParent = false;
        });
      }
      const stop1 = effect(() => {
        const parentVal = Alpine2.evaluate(el, pair.parentPath, { scope: parentData });
        if (g.fromChild) return;
        g.fromParent = true;
        setAtPath(childData, pair.childPath, parentVal);
        queueMicrotask(() => {
          g.fromParent = false;
        });
      });
      const stop2 = effect(() => {
        const childVal = Alpine2.evaluate(el, pair.childPath, { scope: childData });
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
      for (const stop of stops) {
        try {
          stop && stop();
        } catch {
        }
      }
    });
  };
  Alpine2.directive("syncprop", handler);
}
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p2) => Promise.resolve(p2).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i2 = links.length - 1; i2 >= 0; i2--) {
            const link2 = links[i2];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e2 = new Event("vite:preloadError", {
      cancelable: true
    });
    e2.payload = err;
    window.dispatchEvent(e2);
    if (!e2.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
let validationPromise;
function initializeValidation() {
  if (!validationPromise) {
    validationPromise = __vitePreload(() => import("./validationRuntime-DP45vRpC.js"), true ? [] : void 0, import.meta.url).then((module) => module.ensureValidationRuntime());
  }
  return validationPromise;
}
function registerValidateDirective(Alpine2, onReady) {
  Alpine2.directive("validate", (el, _binding, { cleanup }) => {
    let active = true;
    initializeValidation().then((validation) => {
      if (!active) {
        return;
      }
      if (typeof onReady === "function") {
        onReady(validation);
      }
    }).catch((error) => {
      console.error("[RizzyUI] Failed to initialize validation runtime.", error);
    });
    cleanup(() => {
      active = false;
    });
  });
}
class ThemeController {
  constructor() {
    this.storageKey = "darkMode";
    this.eventName = "rz:theme-change";
    this.darkClass = "dark";
    this._mode = "auto";
    this._mq = null;
    this._initialized = false;
    this._onMqChange = null;
    this._onStorage = null;
    this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
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
      if (typeof this._mq.addEventListener === "function") {
        this._mq.addEventListener("change", this._onMqChange);
      } else if (typeof this._mq.addListener === "function") {
        this._mq.addListener(this._onMqChange);
      }
    }
    this._onStorage = (e2) => {
      if (e2.key !== this.storageKey) return;
      const next = this._normalizeMode(e2.newValue ?? "auto");
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
      if (typeof this._mq.removeEventListener === "function") {
        this._mq.removeEventListener("change", this._onMqChange);
      } else if (typeof this._mq.removeListener === "function") {
        this._mq.removeListener(this._onMqChange);
      }
    }
    if (typeof window !== "undefined" && this._onStorage) {
      window.removeEventListener("storage", this._onStorage);
    }
    this._onMqChange = null;
    this._onStorage = null;
    this._mq = null;
    this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
  }
  // ----- Public State Accessors -----
  get mode() {
    return this._mode;
  }
  get prefersDark() {
    return !!this._mq?.matches;
  }
  get effectiveDark() {
    return this._mode === "dark" || this._mode === "auto" && this.prefersDark;
  }
  // ----- Public API Surface -----
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
  // ----- Internals -----
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
    } catch (e2) {
      return null;
    }
  }
  _persist() {
    try {
      window?.localStorage?.setItem(this.storageKey, this._mode);
    } catch (e2) {
    }
  }
  _sync() {
    const effectiveDark = this.effectiveDark;
    const mode = this._mode;
    const prefersDark = this.prefersDark;
    const root = typeof document !== "undefined" ? document.documentElement : null;
    const domMatchesState = root ? root.classList.contains(this.darkClass) === effectiveDark && root.style.colorScheme === (effectiveDark ? "dark" : "light") : true;
    if (this._lastSnapshot.mode === mode && this._lastSnapshot.effectiveDark === effectiveDark && this._lastSnapshot.prefersDark === prefersDark && domMatchesState) {
      return;
    }
    this._lastSnapshot = { mode, effectiveDark, prefersDark };
    if (root) {
      root.classList.toggle(this.darkClass, effectiveDark);
      root.style.colorScheme = effectiveDark ? "dark" : "light";
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(this.eventName, {
          detail: {
            mode,
            darkMode: effectiveDark,
            // External API uses 'darkMode' convention
            prefersDark,
            source: "RizzyUI"
          }
        })
      );
    }
  }
}
const themeController = new ThemeController();
function registerStores(Alpine2) {
  themeController.init();
  Alpine2.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: themeController.mode,
    _prefersDark: themeController.prefersDark,
    _effectiveDark: themeController.effectiveDark,
    // Listener reference to prevent duplicate registration
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
    // ----- Reactive Getters -----
    // These return the reactive properties from the store, ensuring Alpine
    // properly tracks dependencies.
    get mode() {
      return this._mode;
    },
    get effectiveDark() {
      return this._effectiveDark;
    },
    get prefersDark() {
      return this._prefersDark;
    },
    // Expose as getters (not methods) for consistency
    get isDark() {
      return this._effectiveDark;
    },
    get isLight() {
      return !this._effectiveDark;
    },
    // ----- Proxy Methods -----
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
const bundleLoaderRegistry = Object.freeze({
  "core-common": () => __vitePreload(() => import("./core-common-gRrJeaaH.js"), true ? [] : void 0, import.meta.url),
  "command-runtime": () => __vitePreload(() => import("./command-runtime-DVIhlj7P.js"), true ? [] : void 0, import.meta.url),
  "advanced-input-runtime": () => __vitePreload(() => import("./advanced-input-runtime-Dkgw5Eva.js"), true ? [] : void 0, import.meta.url),
  "calendar-runtime": () => __vitePreload(() => import("./calendar-runtime-CVZM2Hgi.js"), true ? [] : void 0, import.meta.url),
  "color-runtime": () => __vitePreload(() => import("./color-runtime-DDFHq8XA.js"), true ? [] : void 0, import.meta.url),
  "content-visual-runtime": () => __vitePreload(() => import("./content-visual-runtime-BPn_T4Hh.js"), true ? [] : void 0, import.meta.url),
  "dialogs-panels-runtime": () => __vitePreload(() => import("./dialogs-panels-runtime-BPjnRdD7.js"), true ? [] : void 0, import.meta.url),
  "menu-runtime": () => __vitePreload(() => import("./menu-runtime-lTXFcwok.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url),
  "popover-tooltip-runtime": () => __vitePreload(() => import("./popover-tooltip-runtime-CcG3WsIN.js"), true ? __vite__mapDeps([2,1]) : void 0, import.meta.url),
  "docs-runtime": () => __vitePreload(() => import("./docs-runtime-CL-JjvEQ.js"), true ? [] : void 0, import.meta.url),
  "effects-runtime": () => __vitePreload(() => import("./effects-runtime-kfOk8O7v.js"), true ? [] : void 0, import.meta.url)
});
const componentBundleManifest = Object.freeze({
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
const loadedBundles = /* @__PURE__ */ new Map();
async function loadComponentFactory(componentName) {
  const bundleName = componentBundleManifest[componentName];
  if (!bundleName) {
    throw new Error(`[RizzyUI] No owning bundle was found for component '${componentName}'.`);
  }
  if (!loadedBundles.has(bundleName)) {
    const loader = bundleLoaderRegistry[bundleName];
    if (!loader) {
      throw new Error(`[RizzyUI] Bundle loader '${bundleName}' is missing.`);
    }
    loadedBundles.set(bundleName, loader());
  }
  const bundleModule = await loadedBundles.get(bundleName);
  const factory = bundleModule[componentName];
  if (!factory) {
    throw new Error(`[RizzyUI] Component '${componentName}' is not exported by bundle '${bundleName}'.`);
  }
  return factory;
}
function registerAsyncBundleComponents(Alpine2) {
  for (const componentName of Object.keys(componentBundleManifest)) {
    Alpine2.asyncData(componentName, () => loadComponentFactory(componentName));
  }
}
async function loadComponentDefinition(Alpine2, componentName) {
  return await loadComponentFactory(componentName);
}
const devnull = function() {
}, bundleIdCache = {}, bundleResultCache = {}, bundleCallbackQueue = {};
function subscribe(bundleIds, callbackFn) {
  bundleIds = Array.isArray(bundleIds) ? bundleIds : [bundleIds];
  const depsNotFound = [];
  let i2 = bundleIds.length, numWaiting = i2, fn, bundleId, r2, q;
  fn = function(bundleId2, pathsNotFound) {
    if (pathsNotFound.length) depsNotFound.push(bundleId2);
    numWaiting--;
    if (!numWaiting) callbackFn(depsNotFound);
  };
  while (i2--) {
    bundleId = bundleIds[i2];
    r2 = bundleResultCache[bundleId];
    if (r2) {
      fn(bundleId, r2);
      continue;
    }
    q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
    q.push(fn);
  }
}
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
function executeCallbacks(args, depsNotFound) {
  if (typeof args === "function") args = { success: args };
  if (depsNotFound.length) (args.error || devnull)(depsNotFound);
  else (args.success || devnull)(args);
}
function handleResourceEvent(ev, path, e2, callbackFn, args, numTries, maxTries, isLegacyIECss) {
  let result = ev.type[0];
  if (isLegacyIECss) {
    try {
      if (!e2.sheet.cssText.length) result = "e";
    } catch (x) {
      if (x.code !== 18) result = "e";
    }
  }
  if (result === "e") {
    numTries += 1;
    if (numTries < maxTries) {
      return loadFile(path, callbackFn, args, numTries);
    }
  } else if (e2.rel === "preload" && e2.as === "style") {
    e2.rel = "stylesheet";
    return;
  }
  callbackFn(path, result, ev.defaultPrevented);
}
function loadFile(path, callbackFn, args, numTries) {
  const doc = document, async = args.async, maxTries = (args.numRetries || 0) + 1, beforeCallbackFn = args.before || devnull, pathname = path.replace(/[\?|#].*$/, ""), pathStripped = path.replace(/^(css|img|module|nomodule)!/, "");
  let isLegacyIECss, hasModuleSupport, e2;
  numTries = numTries || 0;
  if (/(^css!|\.css$)/.test(pathname)) {
    e2 = doc.createElement("link");
    e2.rel = "stylesheet";
    e2.href = pathStripped;
    isLegacyIECss = "hideFocus" in e2;
    if (isLegacyIECss && e2.relList) {
      isLegacyIECss = 0;
      e2.rel = "preload";
      e2.as = "style";
    }
    if (args.inlineStyleNonce) {
      e2.setAttribute("nonce", args.inlineStyleNonce);
    }
  } else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
    e2 = doc.createElement("img");
    e2.src = pathStripped;
  } else {
    e2 = doc.createElement("script");
    e2.src = pathStripped;
    e2.async = async === void 0 ? true : async;
    if (args.inlineScriptNonce) {
      e2.setAttribute("nonce", args.inlineScriptNonce);
    }
    hasModuleSupport = "noModule" in e2;
    if (/^module!/.test(pathname)) {
      if (!hasModuleSupport) return callbackFn(path, "l");
      e2.type = "module";
    } else if (/^nomodule!/.test(pathname) && hasModuleSupport) {
      return callbackFn(path, "l");
    }
  }
  const onEvent = function(ev) {
    handleResourceEvent(ev, path, e2, callbackFn, args, numTries, maxTries, isLegacyIECss);
  };
  e2.addEventListener("load", onEvent, { once: true });
  e2.addEventListener("error", onEvent, { once: true });
  if (beforeCallbackFn(path, e2) !== false) doc.head.appendChild(e2);
}
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
  for (let i2 = 0; i2 < paths.length; i2++) {
    loadFile(paths[i2], fn, args);
  }
}
function loadjs(paths, arg1, arg2) {
  let bundleId, args;
  if (arg1 && typeof arg1 === "string" && arg1.trim) {
    bundleId = arg1.trim();
  }
  args = (bundleId ? arg2 : arg1) || {};
  if (bundleId) {
    if (bundleId in bundleIdCache) {
      throw "LoadJS";
    } else {
      bundleIdCache[bundleId] = true;
    }
  }
  function loadFn(resolve, reject) {
    loadFiles(paths, function(pathsNotFound) {
      executeCallbacks(args, pathsNotFound);
      if (resolve) {
        executeCallbacks({ success: resolve, error: reject }, pathsNotFound);
      }
      publish(bundleId, pathsNotFound);
    }, args);
  }
  if (args.returnPromise) {
    return new Promise(loadFn);
  } else {
    loadFn();
  }
}
loadjs.ready = function ready(deps, args) {
  subscribe(deps, function(depsNotFound) {
    executeCallbacks(args, depsNotFound);
  });
  return loadjs;
};
loadjs.done = function done(bundleId) {
  publish(bundleId, []);
};
loadjs.reset = function reset() {
  Object.keys(bundleIdCache).forEach((key) => delete bundleIdCache[key]);
  Object.keys(bundleResultCache).forEach((key) => delete bundleResultCache[key]);
  Object.keys(bundleCallbackQueue).forEach((key) => delete bundleCallbackQueue[key]);
};
loadjs.isDefined = function isDefined(bundleId) {
  return bundleId in bundleIdCache;
};
async function generateBundleId(paths) {
  const normalized = [...paths].sort();
  const joinedPaths = normalized.join("|");
  const encoder = new TextEncoder();
  const data = encoder.encode(joinedPaths);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function rizzyRequire(paths, callbackOrNonce, nonce) {
  let callbackObject;
  let csp;
  if (typeof callbackOrNonce === "function") {
    callbackObject = { success: callbackOrNonce };
  } else if (callbackOrNonce && typeof callbackOrNonce === "object") {
    callbackObject = callbackOrNonce;
  } else if (typeof callbackOrNonce === "string") {
    csp = callbackOrNonce;
  }
  if (!csp && typeof nonce === "string") {
    csp = nonce;
  }
  const files = Array.isArray(paths) ? paths : [paths];
  return generateBundleId(files).then((bundleId) => {
    if (!loadjs.isDefined(bundleId)) {
      loadjs(files, bundleId, {
        async: false,
        inlineScriptNonce: csp,
        inlineStyleNonce: csp
      });
    }
    return new Promise((resolve, reject) => {
      loadjs.ready(bundleId, {
        success: () => {
          try {
            if (callbackObject && typeof callbackObject.success === "function") {
              callbackObject.success();
            }
          } catch (error) {
            console.error("[rizzyRequire] success callback threw:", error);
          }
          resolve({ bundleId });
        },
        error: (depsNotFound) => {
          try {
            if (callbackObject && typeof callbackObject.error === "function") {
              callbackObject.error(depsNotFound);
            }
          } catch (error) {
            console.error("[rizzyRequire] error callback threw:", error);
          }
          reject(new Error(
            `[rizzyRequire] Failed to load bundle ${bundleId} (missing: ${Array.isArray(depsNotFound) ? depsNotFound.join(", ") : String(depsNotFound)})`
          ));
        }
      });
    });
  });
}
const registered = /* @__PURE__ */ new Map();
const importCache = /* @__PURE__ */ new Map();
let onAlpineInitAttached = false;
function onceImport(path) {
  if (!importCache.has(path)) {
    importCache.set(
      path,
      import(path).catch((error) => {
        importCache.delete(path);
        throw error;
      })
    );
  }
  return importCache.get(path);
}
function setAsyncLoader(name, path) {
  const Alpine2 = globalThis.Alpine;
  if (!(Alpine2 && typeof Alpine2.asyncData === "function")) {
    console.error(`[RizzyUI] Could not register async component '${name}'. AsyncAlpine not available.`);
    return false;
  }
  Alpine2.asyncData(
    name,
    () => onceImport(path).catch((error) => {
      console.error(`[RizzyUI] Failed to load Alpine module '${name}' from '${path}'.`, error);
      return () => ({
        _error: true,
        _errorMessage: `Module '${name}' failed to load.`
      });
    })
  );
  return true;
}
function ensurePendingAsyncComponentsAreRegistered() {
  for (const [name, info] of registered) {
    if (info.loaderSet) {
      continue;
    }
    info.loaderSet = setAsyncLoader(name, info.path);
  }
}
function registerAsyncComponent(name, path) {
  if (!name || !path) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const previous = registered.get(name);
  if (previous && previous.path !== path) {
    console.warn(`[RizzyUI] Re-registering '${name}' with a different path.
Previous: ${previous.path}
New:      ${path}`);
  }
  const Alpine2 = globalThis.Alpine;
  if (Alpine2 && Alpine2.version) {
    const changedPath = !previous || previous.path !== path;
    const alreadySet = previous && previous.loaderSet && !changedPath;
    if (!alreadySet) {
      const loaderSet = setAsyncLoader(name, path);
      registered.set(name, { path, loaderSet });
    }
    return;
  }
  registered.set(name, { path, loaderSet: false });
  if (!onAlpineInitAttached) {
    onAlpineInitAttached = true;
    document.addEventListener("alpine:init", () => {
      ensurePendingAsyncComponentsAreRegistered();
    }, { once: true });
  }
}
let cachedRizzyUI;
function bootstrapRizzyUI(Alpine2) {
  if (cachedRizzyUI) {
    return cachedRizzyUI;
  }
  Alpine2.plugin(module_default$2);
  Alpine2.plugin(module_default);
  Alpine2.plugin(module_default$1);
  Alpine2.plugin(async_alpine_default);
  if (typeof document !== "undefined") {
    document.addEventListener("alpine:init", () => {
      registerStores(Alpine2);
    }, { once: true });
  }
  registerAsyncBundleComponents(Alpine2);
  registerMobileDirective(Alpine2);
  registerSyncDirective(Alpine2);
  let validationInstance;
  registerValidateDirective(Alpine2, (validation) => {
    validationInstance = validation;
  });
  let resolveReady;
  const ready2 = new Promise((resolve) => {
    resolveReady = resolve;
  });
  cachedRizzyUI = {
    Alpine: Alpine2,
    require: rizzyRequire,
    toast: Toast,
    $data,
    props,
    ready: ready2,
    theme: themeController,
    loadComponent: (componentName) => loadComponentDefinition(Alpine2, componentName),
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
    window.Alpine = Alpine2;
    window.Rizzy = { ...window.Rizzy || {}, ...cachedRizzyUI };
    document.dispatchEvent(new CustomEvent("rz:init", {
      detail: { Rizzy: window.Rizzy }
    }));
  }
  resolveReady(cachedRizzyUI);
  return cachedRizzyUI;
}
export {
  bootstrapRizzyUI as b,
  rizzyRequire as r
};
//# sourceMappingURL=bootstrap-DmUTAXwT.js.map
