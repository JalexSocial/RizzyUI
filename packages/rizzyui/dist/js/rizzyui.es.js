import Alpine$1 from "alpinejs";
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
function src_default$1(Alpine2) {
  Alpine2.directive("intersect", Alpine2.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
    let evaluate2 = evaluateLater(expression);
    let options = {
      rootMargin: getRootMargin(modifiers),
      threshold: getThreshold(modifiers)
    };
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting === (value === "leave"))
          return;
        evaluate2();
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
var module_default$1 = src_default$1;
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
var activeFocusTraps = /* @__PURE__ */ function() {
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
}();
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
function src_default(Alpine2) {
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
      if (modifiers.includes("noautofocus")) {
        options.initialFocus = false;
      } else {
        let autofocusEl = el.querySelector("[autofocus]");
        if (autofocusEl)
          options.initialFocus = autofocusEl;
      }
      let trap = createFocusTrap(el, options);
      let undoInert = () => {
      };
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
          if (modifiers.includes("inert"))
            undoInert = setInert(el);
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
    (el, { expression, modifiers }, { evaluate: evaluate2 }) => {
      if (modifiers.includes("inert") && evaluate2(expression))
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
var module_default = src_default;
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
var m = function() {
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
}();
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
function registerRzAccordion(Alpine2) {
  Alpine2.data("rzAccordion", () => ({
    selected: "",
    // ID of the currently selected/opened section (if not allowMultiple)
    allowMultiple: false,
    // Whether multiple sections can be open
    init() {
      this.allowMultiple = this.$el.dataset.multiple === "true";
    },
    destroy() {
    }
  }));
}
function registerAccordionItem(Alpine2) {
  Alpine2.data("accordionItem", () => ({
    open: false,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true";
      this.sectionId = this.$el.dataset.sectionId;
      this.expandedClass = this.$el.dataset.expandedClass;
      const self = this;
      if (typeof this.selected !== "undefined" && typeof this.allowMultiple !== "undefined") {
        this.$watch("selected", (value, oldValue) => {
          if (value !== self.sectionId && !self.allowMultiple) {
            self.open = false;
          }
        });
      } else {
        console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
      }
    },
    destroy() {
    },
    // Toggle the section's open state and update the parent's 'selected' state.
    toggle() {
      this.selected = this.sectionId;
      this.open = !this.open;
    },
    // Get the CSS classes for the expanded/collapsed chevron icon.
    getExpandedCss() {
      return this.open ? this.expandedClass : "";
    },
    // Get the value for aria-expanded attribute based on the 'open' state.
    getAriaExpanded() {
      return this.open ? "true" : "false";
    }
  }));
}
function registerRzAlert(Alpine2) {
  Alpine2.data("rzAlert", () => {
    return {
      parentElement: null,
      showAlert: true,
      init() {
        const alpineRoot = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
        this.parentElement = document.getElementById(alpineRoot);
      },
      dismiss() {
        this.showAlert = false;
        const self = this;
        setTimeout(() => {
          self.parentElement.style.display = "none";
        }, 205);
      }
    };
  });
}
function registerRzBrowser(Alpine2) {
  Alpine2.data("rzBrowser", () => {
    return {
      screenSize: "",
      setDesktopScreenSize() {
        this.screenSize = "";
      },
      setTabletScreenSize() {
        this.screenSize = "max-w-2xl";
      },
      setPhoneScreenSize() {
        this.screenSize = "max-w-sm";
      },
      // Get CSS classes for browser border based on screen size
      getBrowserBorderCss() {
        return [this.screenSize, this.screenSize === "" ? "border-none" : "border-x"];
      },
      // Get CSS classes for desktop screen button styling
      getDesktopScreenCss() {
        return [this.screenSize === "" ? "text-foreground forced-color-adjust-auto dark:text-foreground" : "opacity-60"];
      },
      // Get CSS classes for tablet screen button styling
      getTabletScreenCss() {
        return [this.screenSize === "max-w-2xl" ? "text-foreground forced-color-adjust-auto dark:text-foreground" : "opacity-60"];
      },
      // Get CSS classes for phone screen button styling
      getPhoneScreenCss() {
        return [this.screenSize === "max-w-sm" ? "text-foreground forced-color-adjust-auto dark:text-foreground" : "opacity-60"];
      }
    };
  });
}
function registerRzCheckboxGroupItem(Alpine2) {
  Alpine2.data("rzCheckboxGroupItem", () => {
    return {
      checkbox: null,
      isChecked: false,
      init() {
        this.checkbox = this.$refs.chk;
        this.isChecked = this.checkbox.checked;
      },
      toggleCheckbox() {
        this.isChecked = this.checkbox.checked;
      },
      getIconCss() {
        return this.isChecked ? "" : "hidden";
      }
    };
  });
}
function registerRzCodeViewer(Alpine2, require2) {
  Alpine2.data("rzCodeViewer", () => {
    return {
      expand: false,
      border: true,
      copied: false,
      copyTitle: "Copy",
      // Default title
      copiedTitle: "Copied!",
      // Default title
      init() {
        const assets = JSON.parse(this.$el.dataset.assets);
        const codeId = this.$el.dataset.codeid;
        const nonce = this.$el.dataset.nonce;
        this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle;
        this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle;
        require2(assets, {
          success: function() {
            const codeBlock = document.getElementById(codeId);
            if (window.hljs && codeBlock) {
              window.hljs.highlightElement(codeBlock);
            }
          },
          error: function() {
            console.error("Failed to load Highlight.js");
          }
        }, nonce);
      },
      // Function to check if code is NOT copied (for x-show)
      notCopied() {
        return !this.copied;
      },
      // Function to reset the copied state (e.g., on blur)
      disableCopied() {
        this.copied = false;
      },
      // Function to toggle the expand state
      toggleExpand() {
        this.expand = !this.expand;
      },
      // Function to copy code to clipboard
      copyHTML() {
        navigator.clipboard.writeText(this.$refs.codeBlock.textContent);
        this.copied = !this.copied;
      },
      // Get the title for the copy button (copy/copied)
      getCopiedTitle() {
        return this.copied ? this.copiedTitle : this.copyTitle;
      },
      // Get CSS classes for the copy button based on copied state
      getCopiedCss() {
        return [this.copied ? "focus-visible:outline-success" : "focus-visible:outline-foreground"];
      },
      // Get CSS classes for the code container based on expand state
      getExpandCss() {
        return [this.expand ? "" : "max-h-60"];
      },
      // Get CSS classes for the expand button icon based on expand state
      getExpandButtonCss() {
        return this.expand ? "rotate-180" : "rotate-0";
      }
    };
  });
}
function registerRzDateEdit(Alpine2, require2) {
  Alpine2.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    init() {
      const cfgString = this.$el.dataset.config;
      const inputElem = document.getElementById(this.$el.dataset.uid + "-input");
      if (cfgString) {
        const parsed = JSON.parse(cfgString);
        if (parsed) {
          this.options = parsed.options || {};
          this.placeholder = parsed.placeholder || "";
          this.prependText = parsed.prependText || "";
        }
      }
      const assets = JSON.parse(this.$el.dataset.assets);
      const nonce = this.$el.dataset.nonce;
      require2(assets, {
        success: function() {
          if (window.flatpickr && inputElem) {
            window.flatpickr(inputElem, this.options);
          }
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, nonce);
    }
  }));
}
const min = Math.min;
const max = Math.max;
const round = Math.round;
const createCoords = (v2) => ({
  x: v2,
  y: v2
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i2 = 0; i2 < validMiddleware.length; i2++) {
    const {
      name,
      fn
    } = validMiddleware[i2];
    const {
      x: nextX,
      y: nextY,
      data,
      reset: reset2
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset2 && resetCount <= 50) {
      resetCount++;
      if (typeof reset2 === "object") {
        if (reset2.placement) {
          statefulPlacement = reset2.placement;
        }
        if (reset2.rects) {
          rects = reset2.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset2.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i2 = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          var _overflowsData$;
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          const hasInitialMainAxisOverflow = ((_overflowsData$ = overflowsData[0]) == null ? void 0 : _overflowsData$.overflows[0]) > 0;
          if (!ignoreCrossAxisOverflow || hasInitialMainAxisOverflow) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d2) => d2.overflows[0] <= 0).sort((a2, b) => a2.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d2) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d2.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d2) => [d2.placement, d2.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b) => a2[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e2) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, []));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, []).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
function registerRzDropdownMenu(Alpine2) {
  Alpine2.data("rzDropdownMenu", () => ({
    // --- STATE ---
    open: false,
    isModal: true,
    ariaExpanded: "false",
    trapActive: false,
    focusedIndex: null,
    menuItems: [],
    parentEl: null,
    triggerEl: null,
    contentEl: null,
    anchor: "bottom",
    pixelOffset: 3,
    isSubmenuActive: false,
    navThrottle: 100,
    _lastNavAt: 0,
    selfId: null,
    // --- INIT ---
    init() {
      if (!this.$el.id) this.$el.id = crypto.randomUUID();
      this.selfId = this.$el.id;
      this.parentEl = this.$el;
      this.triggerEl = this.$refs.trigger;
      this.contentEl = this.$refs.content;
      this.anchor = this.$el.dataset.anchor || "bottom";
      this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
      this.isModal = this.$el.dataset.modal !== "false";
      this.$watch("open", (value) => {
        if (value) {
          this._lastNavAt = 0;
          this.$nextTick(() => {
            this.updatePosition();
            this.menuItems = Array.from(
              this.contentEl.querySelectorAll(
                '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
              )
            );
          });
          this.ariaExpanded = "true";
          this.triggerEl.dataset.state = "open";
          this.trapActive = this.isModal;
        } else {
          this.focusedIndex = null;
          this.closeAllSubmenus();
          this.ariaExpanded = "false";
          delete this.triggerEl.dataset.state;
          this.trapActive = false;
        }
      });
    },
    // --- METHODS ---
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      computePosition(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
      }).then(({ x, y }) => {
        Object.assign(this.contentEl.style, { left: `${x}px`, top: `${y}px` });
      });
    },
    toggle() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      } else {
        this.open = true;
        this.focusedIndex = -1;
      }
    },
    handleOutsideClick() {
      if (!this.open) return;
      this.open = false;
      this.$nextTick(() => this.triggerEl?.focus());
    },
    handleTriggerKeydown(event) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        this.open = true;
        this.$nextTick(() => {
          if (event.key === "ArrowUp") this.focusLastItem();
          else this.focusFirstItem();
        });
      }
    },
    focusNextItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
      this.focusCurrentItem();
    },
    focusPreviousItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
      this.focusCurrentItem();
    },
    focusFirstItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = 0;
      this.focusCurrentItem();
    },
    focusLastItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = this.menuItems.length - 1;
      this.focusCurrentItem();
    },
    focusCurrentItem() {
      if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
        this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
      }
    },
    focusSelectedItem(item) {
      if (!item || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      const index = this.menuItems.indexOf(item);
      if (index !== -1) {
        this.focusedIndex = index;
        item.focus();
      }
    },
    handleItemClick(event) {
      const item = event.currentTarget;
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      if (item.getAttribute("aria-haspopup") === "menu") {
        Alpine2.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = false;
      this.$nextTick(() => this.triggerEl?.focus());
    },
    handleItemMouseEnter(event) {
      const item = event.currentTarget;
      this.focusSelectedItem(item);
      if (item.getAttribute("aria-haspopup") !== "menu") {
        this.closeAllSubmenus();
      }
    },
    handleWindowEscape() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleContentTabKey() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleTriggerMouseover() {
      this.$nextTick(() => this.$el.firstChild?.focus());
    },
    closeAllSubmenus() {
      const submenus = this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      submenus.forEach((el) => {
        Alpine2.$data(el)?.closeSubmenu();
      });
      this.isSubmenuActive = false;
    }
  }));
  Alpine2.data("rzDropdownSubmenu", () => ({
    // --- STATE ---
    open: false,
    ariaExpanded: "false",
    parentDropdown: null,
    triggerEl: null,
    menuItems: [],
    focusedIndex: null,
    anchor: "right-start",
    pixelOffset: 0,
    navThrottle: 100,
    _lastNavAt: 0,
    selfId: null,
    siblingContainer: null,
    closeTimeout: null,
    closeDelay: 150,
    // --- INIT ---
    init() {
      if (!this.$el.id) this.$el.id = crypto.randomUUID();
      this.selfId = this.$el.id;
      this.parentDropdown = Alpine2.$data(this.$el.closest('[x-data^="rzDropdownMenu"]'));
      this.triggerEl = this.$refs.subTrigger;
      this.siblingContainer = this.$el.parentElement;
      this.anchor = this.$el.dataset.subAnchor || this.anchor;
      this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;
      this.$watch("open", (value) => {
        if (value) {
          this._lastNavAt = 0;
          this.parentDropdown.isSubmenuActive = true;
          this.$nextTick(() => {
            const contentEl = this.$refs.subContent;
            this.updatePosition(contentEl);
            this.menuItems = Array.from(contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
          });
          this.ariaExpanded = "true";
          this.triggerEl.dataset.state = "open";
        } else {
          this.focusedIndex = null;
          this.ariaExpanded = "false";
          delete this.triggerEl.dataset.state;
          this.$nextTick(() => {
            const anySubmenuIsOpen = this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]');
            if (!anySubmenuIsOpen) this.parentDropdown.isSubmenuActive = false;
          });
        }
      });
    },
    // --- METHODS ---
    updatePosition(contentEl) {
      if (!this.triggerEl || !contentEl) return;
      computePosition(this.triggerEl, contentEl, {
        placement: this.anchor,
        middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
      }).then(({ x, y }) => {
        Object.assign(contentEl.style, { left: `${x}px`, top: `${y}px` });
      });
    },
    handleTriggerMouseEnter() {
      clearTimeout(this.closeTimeout);
      this.triggerEl.focus();
      this.openSubmenu();
    },
    handleTriggerMouseLeave() {
      this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
    },
    handleContentMouseEnter() {
      clearTimeout(this.closeTimeout);
    },
    handleContentMouseLeave() {
      const childSubmenus = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      if (childSubmenus) {
        const isAnyChildOpen = Array.from(childSubmenus).some((el) => Alpine2.$data(el)?.open);
        if (isAnyChildOpen) {
          return;
        }
      }
      this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
    },
    openSubmenu(focusFirst = false) {
      if (this.open) return;
      this.closeSiblingSubmenus();
      this.open = true;
      if (focusFirst) {
        this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem()));
      }
    },
    closeSubmenu() {
      const childSubmenus = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      childSubmenus?.forEach((el) => {
        Alpine2.$data(el)?.closeSubmenu();
      });
      this.open = false;
    },
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      const siblings = Array.from(this.siblingContainer.children).filter(
        (el) => el.hasAttribute("x-data") && el.getAttribute("x-data").startsWith("rzDropdownSubmenu") && el.id !== this.selfId
      );
      siblings.forEach((el) => {
        Alpine2.$data(el)?.closeSubmenu();
      });
    },
    toggleSubmenu() {
      this.open ? this.closeSubmenu() : this.openSubmenu();
    },
    openSubmenuAndFocusFirst() {
      this.openSubmenu(true);
    },
    handleTriggerKeydown(e2) {
      if (["ArrowRight", "Enter", " "].includes(e2.key)) {
        e2.preventDefault();
        this.openSubmenuAndFocusFirst();
      }
    },
    focusNextItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
      this.focusCurrentItem();
    },
    focusPreviousItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
      this.focusCurrentItem();
    },
    focusFirstItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = 0;
      this.focusCurrentItem();
    },
    focusLastItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = this.menuItems.length - 1;
      this.focusCurrentItem();
    },
    focusCurrentItem() {
      if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
        this.menuItems[this.focusedIndex].focus();
      }
    },
    handleItemClick(event) {
      const item = event.currentTarget;
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      if (item.getAttribute("aria-haspopup") === "menu") {
        Alpine2.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.parentDropdown.open = false;
      this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
    },
    handleItemMouseEnter(event) {
      const item = event.currentTarget;
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      const index = this.menuItems.indexOf(item);
      if (index !== -1) {
        this.focusedIndex = index;
        item.focus();
      }
      if (item.getAttribute("aria-haspopup") === "menu") {
        Alpine2.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu();
      } else {
        this.closeSiblingSubmenus();
      }
    },
    handleSubmenuEscape() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleSubmenuArrowLeft() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      }
    }
  }));
}
function registerRzDarkModeToggle(Alpine2) {
  Alpine2.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const hasLocalStorage = typeof window !== "undefined" && "localStorage" in window;
      const allowedModes = ["light", "dark", "auto"];
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let storedMode = "auto";
      if (hasLocalStorage) {
        storedMode = localStorage.getItem("darkMode") ?? "auto";
        if (!allowedModes.includes(storedMode)) {
          storedMode = "light";
        }
      }
      if (hasLocalStorage) {
        localStorage.setItem("darkMode", storedMode);
      }
      this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          storedMode === "dark" || storedMode === "auto" && prefersDark
        );
      };
      this.applyTheme();
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.applyTheme);
    },
    // Returns true if dark mode should be active
    isDark() {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      localStorage.getItem("darkMode");
      return this.mode === "dark" || this.mode === "auto" && prefersDark;
    },
    // Returns true if light mode should be active
    isLight() {
      return !this.isDark();
    },
    // Toggle the dark mode setting and dispatch a custom event
    toggle() {
      let storedMode = localStorage.getItem("darkMode");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (storedMode === "light")
        storedMode = "dark";
      else if (storedMode === "dark")
        storedMode = "light";
      else if (storedMode === "auto") {
        storedMode = prefersDark ? "light" : "dark";
      }
      this.mode = storedMode;
      localStorage.setItem("darkMode", storedMode);
      const isDark = storedMode === "dark" || storedMode === "auto" && prefersDark;
      document.documentElement.classList.toggle("dark", isDark);
      const darkModeEvent = new CustomEvent("darkModeToggle", {
        detail: { darkMode: isDark }
      });
      window.dispatchEvent(darkModeEvent);
    },
    destroy() {
      if (this.applyTheme) {
        window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.applyTheme);
      }
    }
  }));
}
function registerRzEmbeddedPreview(Alpine2) {
  Alpine2.data("rzEmbeddedPreview", () => {
    return {
      iframe: null,
      onDarkModeToggle: null,
      init() {
        try {
          this.iframe = this.$refs.iframe;
          const resize = this.debounce(() => {
            this.resizeIframe(this.iframe);
          }, 50);
          this.resizeIframe(this.iframe);
          const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
              resize();
            }
          });
          resizeObserver.observe(this.iframe);
          const iframe = this.iframe;
          this.onDarkModeToggle = (event) => {
            iframe.contentWindow.postMessage(event.detail, "*");
          };
          window.addEventListener("darkModeToggle", this.onDarkModeToggle);
        } catch (error) {
          console.error("Cannot access iframe content");
        }
      },
      // Adjusts the iframe height based on its content
      resizeIframe(iframe) {
        if (iframe) {
          try {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDocument) {
              const iframeBody = iframeDocument.body;
              if (!iframeBody) {
                setInterval(() => {
                  this.resizeIframe(iframe);
                }, 150);
              } else {
                const newHeight = iframeBody.scrollHeight + 15;
                iframe.style.height = newHeight + "px";
              }
            }
          } catch (error) {
            console.error("Error resizing iframe:", error);
          }
        }
      },
      // Debounce helper to limit function calls
      debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, timeout);
        };
      },
      destroy() {
        window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
      }
    };
  });
}
function registerRzEmpty(Alpine2) {
  Alpine2.data("rzEmpty", () => {
  });
}
function registerRzHeading(Alpine2) {
  Alpine2.data("rzHeading", () => {
    return {
      observer: null,
      headingId: "",
      init() {
        this.headingId = this.$el.dataset.alpineRoot;
        const self = this;
        if (typeof this.setCurrentHeading === "function") {
          const callback = (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                self.setCurrentHeading(self.headingId);
              }
            });
          };
          const options = { threshold: 0.5 };
          this.observer = new IntersectionObserver(callback, options);
          this.observer.observe(this.$el);
        } else {
          console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
        }
      },
      destroy() {
        if (this.observer != null)
          this.observer.disconnect();
      }
    };
  });
}
function registerRzIndicator(Alpine2) {
  Alpine2.data("rzIndicator", () => ({
    visible: false,
    init() {
      const colorValue = this.$el.dataset.color;
      if (colorValue) {
        this.$el.style.backgroundColor = colorValue;
      } else {
        this.$el.style.backgroundColor = "var(--color-success)";
      }
      if (this.$el.dataset.visible === "true") {
        this.visible = true;
      }
    },
    notVisible() {
      return !this.visible;
    },
    setVisible(value) {
      this.visible = value;
    }
  }));
}
function registerRzMarkdown(Alpine2, require2) {
  Alpine2.data("rzMarkdown", () => {
    return {
      init() {
        const assets = JSON.parse(this.$el.dataset.assets);
        const nonce = this.$el.dataset.nonce;
        require2(assets, {
          success: function() {
            window.hljs.highlightAll();
          },
          error: function() {
            console.error("Failed to load Highlight.js");
          }
        }, nonce);
      }
    };
  });
}
function registerRzModal(Alpine2) {
  Alpine2.data("rzModal", () => ({
    modalOpen: false,
    // Main state variable
    eventTriggerName: "",
    closeEventName: "rz:modal-close",
    // Default value, corresponds to Constants.Events.ModalClose
    closeOnEscape: true,
    closeOnClickOutside: true,
    modalId: "",
    bodyId: "",
    footerId: "",
    nonce: "",
    _escapeListener: null,
    _openListener: null,
    _closeEventListener: null,
    init() {
      this.modalId = this.$el.dataset.modalId || "";
      this.bodyId = this.$el.dataset.bodyId || "";
      this.footerId = this.$el.dataset.footerId || "";
      this.nonce = this.$el.dataset.nonce || "";
      this.eventTriggerName = this.$el.dataset.eventTriggerName || "";
      this.closeEventName = this.$el.dataset.closeEventName || this.closeEventName;
      this.closeOnEscape = this.$el.dataset.closeOnEscape !== "false";
      this.closeOnClickOutside = this.$el.dataset.closeOnClickOutside !== "false";
      this.$el.dispatchEvent(new CustomEvent("rz:modal-initialized", {
        detail: { modalId: this.modalId, bodyId: this.bodyId, footerId: this.footerId },
        bubbles: true
      }));
      if (this.eventTriggerName) {
        this._openListener = (e2) => {
          this.openModal(e2);
        };
        window.addEventListener(this.eventTriggerName, this._openListener);
      }
      this._closeEventListener = (event) => {
        if (this.modalOpen) {
          this.closeModalInternally("event");
        }
      };
      window.addEventListener(this.closeEventName, this._closeEventListener);
      this._escapeListener = (e2) => {
        if (this.modalOpen && this.closeOnEscape && e2.key === "Escape") {
          this.closeModalInternally("escape");
        }
      };
      window.addEventListener("keydown", this._escapeListener);
      this.$watch("modalOpen", (value) => {
        const currentWidth = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", value);
        const scrollBarWidth = document.body.offsetWidth - currentWidth;
        document.body.style.setProperty("--page-scrollbar-width", `${scrollBarWidth}px`);
        if (value) {
          this.$nextTick(() => {
            const dialogElement = this.$el.querySelector('[role="document"]');
            const focusable3 = dialogElement?.querySelector(`button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex="-1"])`);
            focusable3?.focus();
            this.$el.dispatchEvent(new CustomEvent("rz:modal-after-open", {
              detail: { modalId: this.modalId },
              bubbles: true
            }));
          });
        } else {
          this.$nextTick(() => {
            this.$el.dispatchEvent(new CustomEvent("rz:modal-after-close", {
              detail: { modalId: this.modalId },
              bubbles: true
            }));
          });
        }
      });
    },
    notModalOpen() {
      return !this.modalOpen;
    },
    destroy() {
      if (this._openListener && this.eventTriggerName) {
        window.removeEventListener(this.eventTriggerName, this._openListener);
      }
      if (this._closeEventListener) {
        window.removeEventListener(this.closeEventName, this._closeEventListener);
      }
      if (this._escapeListener) {
        window.removeEventListener("keydown", this._escapeListener);
      }
      document.body.classList.remove("overflow-hidden");
      document.body.style.setProperty("--page-scrollbar-width", `0px`);
    },
    openModal(event = null) {
      const beforeOpenEvent = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: event },
        bubbles: true,
        cancelable: true
      });
      this.$el.dispatchEvent(beforeOpenEvent);
      if (!beforeOpenEvent.defaultPrevented) {
        this.modalOpen = true;
      }
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(reason = "unknown") {
      const beforeCloseEvent = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason },
        bubbles: true,
        cancelable: true
      });
      this.$el.dispatchEvent(beforeCloseEvent);
      if (!beforeCloseEvent.defaultPrevented) {
        document.activeElement?.blur && document.activeElement.blur();
        this.modalOpen = false;
        document.body.classList.remove("overflow-hidden");
        document.body.style.setProperty("--page-scrollbar-width", `0px`);
      }
    },
    // Called only by the explicit close button in the template
    closeModal() {
      this.closeModalInternally("button");
    },
    // Method called by x-on:click.outside on the dialog element
    handleClickOutside() {
      if (this.closeOnClickOutside) {
        this.closeModalInternally("backdrop");
      }
    }
  }));
}
function registerRzNavigationMenu(Alpine2) {
  Alpine2.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: false,
    closeTimeout: null,
    closeDelay: 150,
    init() {
      this.$nextTick(() => {
        this.viewport = this.$refs.viewport;
        this.indicator = this.$refs.indicator;
        if (this.indicator) {
          this.indicator.setAttribute("data-state", "hidden");
        }
      });
    },
    isContentVisible(itemId) {
      return this.activeItemId === itemId && this.open;
    },
    toggleMenu() {
      const triggerEl = this.$el.closest("[x-data]").querySelector(`[aria-controls='${this.activeItemId}-content']`);
      const itemId = triggerEl.id.replace("-trigger", "");
      if (this.activeItemId === itemId && this.open) {
        this.closeMenu();
      } else {
        this.openMenu(itemId);
      }
    },
    openMenu(itemId) {
      this.clearCloseTimeout();
      this.activeItemId = itemId;
      this.open = true;
      this.$nextTick(() => {
        const trigger = this.$refs[`trigger_${itemId}`];
        if (trigger) {
          this.updateIndicator(trigger);
          trigger.setAttribute("data-state", "open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    },
    closeMenu() {
      if (!this.open) return;
      const currentTrigger = this.$refs[`trigger_${this.activeItemId}`];
      if (currentTrigger) {
        currentTrigger.setAttribute("data-state", "closed");
        currentTrigger.setAttribute("aria-expanded", "false");
      }
      this.activeItemId = null;
      this.open = false;
      if (this.indicator) {
        this.indicator.setAttribute("data-state", "hidden");
      }
    },
    scheduleClose() {
      this.clearCloseTimeout();
      this.closeTimeout = setTimeout(() => this.closeMenu(), this.closeDelay);
    },
    cancelClose() {
      this.clearCloseTimeout();
    },
    clearCloseTimeout() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
    },
    handleTriggerEnter(event) {
      const triggerEl = event.currentTarget;
      const itemId = triggerEl.id.replace("-trigger", "");
      if (this.activeItemId !== itemId) {
        this.openMenu(itemId);
      } else {
        this.cancelClose();
      }
    },
    updateIndicator(triggerEl) {
      if (!this.indicator) return;
      this.indicator.style.width = `${triggerEl.offsetWidth}px`;
      this.indicator.style.left = `${triggerEl.offsetLeft}px`;
      this.indicator.setAttribute("data-state", "visible");
    }
  }));
}
function registerRzPopover(Alpine2) {
  Alpine2.data("rzPopover", () => ({
    open: false,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    init() {
      this.triggerEl = this.$refs.trigger.children[0] || this.$refs.trigger;
      this.contentEl = this.$refs.content;
      this.$watch("open", (value) => {
        this.ariaExpanded = value.toString();
        if (value) {
          this.$nextTick(() => this.updatePosition());
        }
      });
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const anchor = this.$el.dataset.anchor || "bottom";
      const mainOffset = parseInt(this.$el.dataset.offset) || 0;
      const crossAxisOffset = parseInt(this.$el.dataset.crossAxisOffset) || 0;
      const alignmentAxisOffset = parseInt(this.$el.dataset.alignmentAxisOffset) || 0;
      const strategy = this.$el.dataset.strategy || "absolute";
      const enableFlip = this.$el.dataset.enableFlip !== "false";
      const enableShift = this.$el.dataset.enableShift !== "false";
      const shiftPadding = parseInt(this.$el.dataset.shiftPadding) || 8;
      let middleware = [];
      middleware.push(offset({
        mainAxis: mainOffset,
        crossAxis: crossAxisOffset,
        alignmentAxis: alignmentAxisOffset
      }));
      if (enableFlip) {
        middleware.push(flip());
      }
      if (enableShift) {
        middleware.push(shift({ padding: shiftPadding }));
      }
      computePosition(this.triggerEl, this.contentEl, {
        placement: anchor,
        strategy,
        middleware
      }).then(({ x, y }) => {
        Object.assign(this.contentEl.style, {
          left: `${x}px`,
          top: `${y}px`
        });
      });
    },
    toggle() {
      this.open = !this.open;
    },
    handleOutsideClick() {
      if (!this.open) return;
      this.open = false;
    },
    handleWindowEscape() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      }
    }
  }));
}
function registerRzPrependInput(Alpine2) {
  Alpine2.data("rzPrependInput", () => {
    return {
      prependContainer: null,
      textInput: null,
      init() {
        this.prependContainer = this.$refs.prependContainer;
        this.textInput = this.$refs.textInput;
        let self = this;
        setTimeout(() => {
          self.updatePadding();
        }, 50);
        window.addEventListener("resize", this.updatePadding);
      },
      destroy() {
        window.removeEventListener("resize", this.updatePadding);
      },
      updatePadding() {
        const prependDiv = this.prependContainer;
        const inputElem = this.textInput;
        if (!prependDiv || !inputElem) {
          if (inputElem) {
            inputElem.classList.remove("text-transparent");
          }
          return;
        }
        const prependWidth = prependDiv.offsetWidth;
        const leftPadding = prependWidth + 10;
        inputElem.style.paddingLeft = leftPadding + "px";
        inputElem.classList.remove("text-transparent");
      }
    };
  });
}
function registerRzProgress(Alpine2) {
  Alpine2.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const element = this.$el;
      this.currentVal = parseInt(element.getAttribute("data-current-val")) || 0;
      this.minVal = parseInt(element.getAttribute("data-min-val")) || 0;
      this.maxVal = parseInt(element.getAttribute("data-max-val")) || 100;
      this.label = element.getAttribute("data-label");
      this.calculatePercentage();
      element.setAttribute("aria-valuenow", this.currentVal);
      element.setAttribute("aria-valuemin", this.minVal);
      element.setAttribute("aria-valuemax", this.maxVal);
      element.setAttribute("aria-valuetext", `${this.percentage}%`);
      this.updateProgressBar();
      const resizeObserver = new ResizeObserver((entries) => {
        this.updateProgressBar();
      });
      resizeObserver.observe(element);
      this.$watch("currentVal", () => {
        this.calculatePercentage();
        this.updateProgressBar();
        element.setAttribute("aria-valuenow", this.currentVal);
        element.setAttribute("aria-valuetext", `${this.percentage}%`);
      });
    },
    calculatePercentage() {
      if (this.maxVal === this.minVal) {
        this.percentage = 0;
      } else {
        this.percentage = Math.min(Math.max((this.currentVal - this.minVal) / (this.maxVal - this.minVal) * 100, 0), 100);
      }
    },
    buildLabel() {
      var label = this.label || "{percent}%";
      this.calculatePercentage();
      return label.replace("{percent}", this.percentage);
    },
    buildInsideLabelPosition() {
      const progressBar = this.$refs.progressBar;
      const barLabel = this.$refs.progressBarLabel;
      const innerLabel = this.$refs.innerLabel;
      if (barLabel && progressBar && innerLabel) {
        innerLabel.innerText = this.buildLabel();
        if (barLabel.clientWidth > progressBar.clientWidth) {
          barLabel.style.left = progressBar.clientWidth + 10 + "px";
        } else {
          barLabel.style.left = progressBar.clientWidth / 2 - barLabel.clientWidth / 2 + "px";
        }
      }
    },
    getLabelCss() {
      const barLabel = this.$refs.progressBarLabel;
      const progressBar = this.$refs.progressBar;
      if (barLabel && progressBar && barLabel.clientWidth > progressBar.clientWidth) {
        return "text-foreground dark:text-foreground";
      }
      return "";
    },
    updateProgressBar() {
      const progressBar = this.$refs.progressBar;
      if (progressBar) {
        progressBar.style.width = `${this.percentage}%`;
        this.buildInsideLabelPosition();
      }
    },
    // Methods to set, increment, or decrement the progress value
    setProgress(value) {
      this.currentVal = value;
    },
    increment(val = 1) {
      this.currentVal = Math.min(this.currentVal + val, this.maxVal);
    },
    decrement(val = 1) {
      this.currentVal = Math.max(this.currentVal - val, this.minVal);
    }
  }));
}
function registerRzQuickReferenceContainer(Alpine2) {
  Alpine2.data("rzQuickReferenceContainer", () => {
    return {
      headings: [],
      // Array of heading IDs
      currentHeadingId: "",
      // ID of the currently highlighted heading
      // Initializes the component with headings and the initial current heading from data attributes.
      init() {
        this.headings = JSON.parse(this.$el.dataset.headings || "[]");
        this.currentHeadingId = this.$el.dataset.currentheadingid || "";
      },
      // Handles click events on quick reference links.
      handleHeadingClick() {
        const id = this.$el.dataset.headingid;
        window.requestAnimationFrame(() => {
          this.currentHeadingId = id;
        });
      },
      // Sets the current heading ID based on intersection observer events from rzHeading.
      setCurrentHeading(id) {
        if (this.headings.includes(id)) {
          this.currentHeadingId = id;
        }
      },
      // Provides CSS classes for a link based on whether it's the current heading.
      // Returns an object suitable for :class binding.
      getSelectedCss() {
        const id = this.$el.dataset.headingid;
        return {
          "font-bold": this.currentHeadingId === id
          // Apply 'font-bold' if current
        };
      },
      // Determines the value for the aria-current attribute.
      getSelectedAriaCurrent() {
        const id = this.$el.dataset.headingid;
        return this.currentHeadingId === id ? "true" : null;
      }
    };
  });
}
function registerRzTabs(Alpine2) {
  Alpine2.data("rzTabs", () => {
    return {
      buttonRef: null,
      tabSelected: "",
      tabButton: null,
      init() {
        this.buttonRef = document.getElementById(this.$el.dataset.buttonref);
        this.tabSelected = this.$el.dataset.tabselected;
        this.tabButton = this.buttonRef.querySelector("[data-name='" + this.tabSelected + "']");
        this.tabRepositionMarker(this.tabButton);
      },
      tabButtonClicked(tabButton) {
        if (tabButton instanceof Event)
          tabButton = tabButton.target;
        this.tabSelected = tabButton.dataset.name;
        this.tabRepositionMarker(tabButton);
        tabButton.focus();
      },
      tabRepositionMarker(tabButton) {
        this.tabButton = tabButton;
        this.$refs.tabMarker.style.width = tabButton.offsetWidth + "px";
        this.$refs.tabMarker.style.height = tabButton.offsetHeight + "px";
        this.$refs.tabMarker.style.left = tabButton.offsetLeft + "px";
        setTimeout(() => {
          this.$refs.tabMarker.style.opacity = 1;
        }, 150);
      },
      // Get the CSS classes for the tab content panel based on selection
      getTabContentCss() {
        return this.tabSelected === this.$el.dataset.name ? "" : "hidden";
      },
      tabContentActive(tabContent) {
        tabContent = tabContent ?? this.$el;
        return this.tabSelected === tabContent.dataset.name;
      },
      tabButtonActive(tabButton) {
        tabButton = tabButton ?? this.$el;
        return this.tabSelected === tabButton.dataset.name;
      },
      // Get the value for the aria-selected attribute
      getTabButtonAriaSelected() {
        return this.tabSelected === this.$el.dataset.name ? "true" : "false";
      },
      // Get the CSS classes for the tab button text color based on selection
      getSelectedTabTextColorCss() {
        const color = this.$el.dataset.selectedtextcolor ?? "";
        return this.tabSelected === this.$el.dataset.name ? color : "";
      },
      handleResize() {
        this.tabRepositionMarker(this.tabButton);
      },
      handleKeyDown(event) {
        const key = event.key;
        const tabButtons = Array.from(this.buttonRef.querySelectorAll("[role='tab']"));
        const currentIndex = tabButtons.findIndex((button) => this.tabSelected === button.dataset.name);
        let newIndex = currentIndex;
        if (key === "ArrowRight") {
          newIndex = (currentIndex + 1) % tabButtons.length;
          event.preventDefault();
        } else if (key === "ArrowLeft") {
          newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
          event.preventDefault();
        } else if (key === "Home") {
          newIndex = 0;
          event.preventDefault();
        } else if (key === "End") {
          newIndex = tabButtons.length - 1;
          event.preventDefault();
        }
        if (newIndex !== currentIndex) {
          this.tabButtonClicked(tabButtons[newIndex]);
        }
      }
    };
  });
}
function registerRzSidebar(Alpine2) {
  Alpine2.data("rzSidebar", () => {
    return {
      showSidebar: false,
      isSidebarHidden() {
        return !this.showSidebar;
      },
      toggleSidebar() {
        this.showSidebar = !this.showSidebar;
      },
      hideSidebar() {
        this.showSidebar = false;
      },
      // Return translation classes based on sidebar state for smooth slide-in/out
      getSidebarTranslation() {
        return this.showSidebar ? "translate-x-0" : "-translate-x-60";
      }
    };
  });
}
function registerRzSidebarLinkItem(Alpine2) {
  Alpine2.data("rzSidebarLinkItem", () => {
    return {
      isExpanded: false,
      chevronExpandedClass: "",
      chevronCollapsedClass: "",
      init() {
        this.isExpanded = this.$el.dataset.expanded === "true";
        this.chevronExpandedClass = this.$el.dataset.chevronExpandedClass;
        this.chevronCollapsedClass = this.$el.dataset.chevronCollapsedClass;
      },
      isCollapsed() {
        return !this.isExpanded;
      },
      toggleExpanded() {
        this.isExpanded = !this.isExpanded;
      },
      hideSidebar() {
        const sidebarScope = this.$el.closest('[x-data^="rzSidebar"]');
        if (sidebarScope) {
          let data = Alpine2.$data(sidebarScope);
          data.showSidebar = false;
        } else {
          console.warn("Parent sidebar context not found or 'showSidebar' is not defined.");
        }
      },
      getExpandedClass() {
        return this.isExpanded ? this.chevronExpandedClass : this.chevronCollapsedClass;
      },
      // Get the value for the aria-expanded attribute
      getAriaExpanded() {
        return this.isExpanded ? "true" : "false";
      }
    };
  });
}
async function generateBundleId(paths) {
  paths = [...paths].sort();
  const joinedPaths = paths.join("|");
  const encoder = new TextEncoder();
  const data = encoder.encode(joinedPaths);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function rizzyRequire(paths, callbackFn, nonce) {
  generateBundleId(paths).then((bundleId) => {
    if (!loadjs.isDefined(bundleId)) {
      loadjs(
        paths,
        bundleId,
        {
          async: false,
          inlineScriptNonce: nonce,
          inlineStyleNonce: nonce
        }
      );
    }
    loadjs.ready([bundleId], callbackFn);
  });
}
function registerComponents(Alpine2) {
  registerRzAccordion(Alpine2);
  registerAccordionItem(Alpine2);
  registerRzAlert(Alpine2);
  registerRzBrowser(Alpine2);
  registerRzCheckboxGroupItem(Alpine2);
  registerRzCodeViewer(Alpine2, rizzyRequire);
  registerRzDateEdit(Alpine2, rizzyRequire);
  registerRzDropdownMenu(Alpine2);
  registerRzDarkModeToggle(Alpine2);
  registerRzEmbeddedPreview(Alpine2);
  registerRzEmpty(Alpine2);
  registerRzHeading(Alpine2);
  registerRzIndicator(Alpine2);
  registerRzMarkdown(Alpine2, rizzyRequire);
  registerRzNavigationMenu(Alpine2);
  registerRzModal(Alpine2);
  registerRzPopover(Alpine2);
  registerRzPrependInput(Alpine2);
  registerRzProgress(Alpine2);
  registerRzQuickReferenceContainer(Alpine2);
  registerRzTabs(Alpine2);
  registerRzSidebar(Alpine2);
  registerRzSidebarLinkItem(Alpine2);
}
function $data(idOrElement) {
  if (typeof Alpine === "undefined" || typeof Alpine.$data !== "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return void 0;
  }
  let outerElement = null;
  let componentId = null;
  if (typeof idOrElement === "string") {
    if (!idOrElement) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return void 0;
    }
    componentId = idOrElement;
    outerElement = document.getElementById(componentId);
    if (!outerElement) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${componentId}" not found in the DOM.`);
      return void 0;
    }
  } else if (idOrElement instanceof Element) {
    outerElement = idOrElement;
    if (!outerElement.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return void 0;
    }
    componentId = outerElement.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return void 0;
  }
  const alpineRootSelector = `[data-alpine-root="${componentId}"]`;
  let alpineRootElement = null;
  if (outerElement.matches(alpineRootSelector)) {
    alpineRootElement = outerElement;
  } else {
    alpineRootElement = outerElement.querySelector(alpineRootSelector);
  }
  if (!alpineRootElement) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${alpineRootSelector}" on or inside the wrapper element (ID: #${componentId}). Verify the 'data-alpine-root' attribute placement.`
    );
    return void 0;
  }
  const alpineData = Alpine.$data(alpineRootElement);
  if (alpineData === void 0) {
    const targetDesc = `${alpineRootElement.tagName.toLowerCase()}${alpineRootElement.id ? "#" + alpineRootElement.id : ""}${alpineRootElement.classList.length ? "." + Array.from(alpineRootElement.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${targetDesc}) via 'data-alpine-root="${componentId}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return alpineData;
}
Alpine$1.plugin(module_default$2);
Alpine$1.plugin(module_default$1);
Alpine$1.plugin(module_default);
registerComponents(Alpine$1);
const RizzyUI = {
  Alpine: Alpine$1,
  require: rizzyRequire,
  toast: Toast,
  $data
};
window.Alpine = Alpine$1;
window.Rizzy = { ...window.Rizzy || {}, ...RizzyUI };
Alpine$1.start();
export {
  RizzyUI as default
};
//# sourceMappingURL=rizzyui.es.js.map
