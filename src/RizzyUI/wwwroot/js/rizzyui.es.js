var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1 && index > lastFlushedIndex)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i2 = 0; i2 < queue.length; i2++) {
    queue[i2]();
    lastFlushedIndex = i2;
  }
  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, { scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  } });
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = /* @__PURE__ */ new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i2) => i2());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}
function watch(getter, callback) {
  let firstTime = true;
  let oldValue;
  let effectReference = effect(() => {
    let value = getter();
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  });
  return () => release(effectReference);
}
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i2) => i2());
      delete el._x_attributeCleanups[name];
    }
  });
}
function cleanupElement(el) {
  el._x_effects?.forEach(dequeueJob);
  while (el._x_cleanups?.length)
    el._x_cleanups.pop()();
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var queuedMutations = [];
function flushObserver() {
  let records = observer.takeRecords();
  queuedMutations.push(() => records.length > 0 && onMutate(records));
  let queueLengthWhenTriggered = queuedMutations.length;
  queueMicrotask(() => {
    if (queuedMutations.length === queueLengthWhenTriggered) {
      while (queuedMutations.length > 0)
        queuedMutations.shift()();
    }
  });
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = /* @__PURE__ */ new Set();
  let addedAttributes = /* @__PURE__ */ new Map();
  let removedAttributes = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < mutations.length; i2++) {
    if (mutations[i2].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i2].type === "childList") {
      mutations[i2].removedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (!node._x_marker)
          return;
        removedNodes.add(node);
      });
      mutations[i2].addedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (removedNodes.has(node)) {
          removedNodes.delete(node);
          return;
        }
        if (node._x_marker)
          return;
        addedNodes.push(node);
      });
    }
    if (mutations[i2].type === "attributes") {
      let el = mutations[i2].target;
      let name = mutations[i2].attributeName;
      let oldValue = mutations[i2].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i2) => i2(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.some((i2) => i2.contains(node)))
      continue;
    onElRemoveds.forEach((i2) => i2(node));
  }
  for (let node of addedNodes) {
    if (!node.isConnected)
      continue;
    onElAddeds.forEach((i2) => i2(node));
  }
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i2) => i2 !== data2);
  };
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  return new Proxy({ objects }, mergeProxyTrap);
}
var mergeProxyTrap = {
  ownKeys({ objects }) {
    return Array.from(
      new Set(objects.flatMap((i2) => Object.keys(i2)))
    );
  },
  has({ objects }, name) {
    if (name == Symbol.unscopables)
      return false;
    return objects.some(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name)
    );
  },
  get({ objects }, name, thisProxy) {
    if (name == "toJSON")
      return collapseProxies;
    return Reflect.get(
      objects.find(
        (obj) => Reflect.has(obj, name)
      ) || {},
      name,
      thisProxy
    );
  },
  set({ objects }, name, value, thisProxy) {
    const target = objects.find(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name)
    ) || objects[objects.length - 1];
    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (descriptor?.set && descriptor?.get)
      return descriptor.set.call(thisProxy, value) || true;
    return Reflect.set(target, name, value);
  }
};
function collapseProxies() {
  let keys = Reflect.ownKeys(this);
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.get(this, key);
    return acc;
  }, {});
}
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
      if (enumerable === false || value === void 0)
        return;
      if (typeof value === "object" && value !== null && value.__v_skip)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  let memoizedUtilities = getUtilities(el);
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        return callback(el, memoizedUtilities);
      },
      enumerable: false
    });
  });
  return obj;
}
function getUtilities(el) {
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  let utils = { interceptor, ...utilities };
  onElRemoved(el, cleanup2);
  return utils;
}
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e2) {
    handleError(e2, el, expression);
  }
}
function handleError(error2, el, expression = void 0) {
  error2 = Object.assign(
    error2 ?? { message: "No error message given." },
    { el, expression }
  );
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  let result = callback();
  shouldAutoEvaluateFunctions = cache;
  return result;
}
function evaluate$1(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [], context } = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      let func2 = new AsyncFunction(
        ["__self", "scope"],
        `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`
      );
      Object.defineProperty(func2, "name", {
        value: `[Alpine] ${expression}`
      });
      return func2;
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [], context } = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func.call(context, func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i2) => runIfTypeOfFunction(receiver, i2, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i2) => receiver(i2));
  } else {
    receiver(value);
  }
}
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
  return {
    before(directive2) {
      if (!directiveHandlers[directive2]) {
        console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
        return;
      }
      const pos = directiveOrder.indexOf(directive2);
      directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
    }
  };
}
function directiveExists(name) {
  return Object.keys(directiveHandlers).includes(name);
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate$1.bind(evaluate$1, el)
  };
  let doCleanup = () => cleanups.forEach((i2) => i2());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler4 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler4.inline && handler4.inline(el, directive2, utilities);
    handler4 = handler4.bind(handler4, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return { name, value };
};
var into = (i2) => i2;
function toTransformedAttributes(callback = () => {
}) {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, { name, value });
    if (newName !== name)
      callback(newName, name);
    return { name: newName, value: newValue };
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({ name, value }) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i2) => i2.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a2, b) {
  let typeA = directiveOrder.indexOf(a2.type) === -1 ? DEFAULT : a2.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      // Allows events to pass the shadow DOM barrier.
      composed: true,
      cancelable: true
    })
  );
}
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback);
    node = node.nextElementSibling;
  }
}
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}
var started = false;
function start() {
  if (started)
    warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
  started = true;
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
  setTimeout(() => {
    warnAboutMissingPlugins();
  });
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
  initInterceptors2.push(callback);
}
var markerDispenser = 1;
function initTree(el, walker = walk, intercept = () => {
}) {
  if (findClosest(el, (i2) => i2._x_ignore))
    return;
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      if (el2._x_marker)
        return;
      intercept(el2, skip);
      initInterceptors2.forEach((i2) => i2(el2, skip));
      directives(el2, el2.attributes).forEach((handle) => handle());
      if (!el2._x_ignore)
        el2._x_marker = markerDispenser++;
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root, walker = walk) {
  walker(root, (el) => {
    cleanupElement(el);
    cleanupAttributes(el);
    delete el._x_marker;
  });
}
function warnAboutMissingPlugins() {
  let pluginDirectives = [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ];
  pluginDirectives.forEach(([plugin2, directive2, selectors]) => {
    if (directiveExists(directive2))
      return;
    selectors.some((selector) => {
      if (document.querySelector(selector)) {
        warn(`found "${selector}", but missing ${plugin2} plugin`);
        return true;
      }
    });
  });
}
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let missingClasses = (classString2) => classString2.split(" ").filter((i2) => !el.classList.contains(i2)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i2) => {
    if (el.classList.contains(i2)) {
      el.classList.remove(i2);
      removed.push(i2);
    }
  });
  forAdd.forEach((i2) => {
    if (!el.classList.contains(i2)) {
      el.classList.add(i2);
      added.push(i2);
    }
  });
  return () => {
    removed.forEach((i2) => el.classList.add(i2));
    added.forEach((i2) => el.classList.remove(i2));
  };
}
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (expression === false)
    return;
  if (!expression || typeof expression === "boolean") {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    "enter": (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    "leave": (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i2, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i2, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue$1(modifiers, "scale", 95) / 100 : 1;
  let delay3 = modifierValue$1(modifiers, "delay", 0) / 1e3;
  let origin = modifierValue$1(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue$1(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue$1(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: `${delay3}s`,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: `${delay3}s`,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: { during: defaultValue, start: defaultValue, end: defaultValue },
      leave: { during: defaultValue, start: defaultValue, end: defaultValue },
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i2]) => i2?.());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e2) => {
          if (!e2.isFromCancelledTransition)
            throw e2;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay3 = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay3);
      reachedEnd = true;
    });
  });
}
function modifierValue$1(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration" || key === "delay") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
  return (...args) => isCloning && callback(...args);
}
var interceptors = [];
function interceptClone(callback) {
  interceptors.push(callback);
}
function cloneNode(from, to) {
  interceptors.forEach((i2) => i2(from, to));
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    initTree(to, (el, callback) => {
      callback(el, () => {
      });
    });
  });
  isCloning = false;
}
var isCloningLegacy = false;
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  isCloningLegacy = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
  isCloningLegacy = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    case "selected":
    case "checked":
      bindAttributeAndProperty(el, name, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (isRadio$1(el)) {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      if (typeof value === "boolean") {
        el.checked = safeParseBoolean(el.value) === value;
      } else {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    }
  } else if (isCheckbox(el)) {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value === void 0 ? "" : value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
  bindAttribute(el, name, value);
  setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function setPropertyIfChanged(el, propName, value) {
  if (el[propName] !== value) {
    el[propName] = value;
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function safeParseBoolean(rawValue) {
  if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
    return true;
  }
  if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
    return false;
  }
  return rawValue ? Boolean(rawValue) : null;
}
var booleanAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function isBooleanAttr(attrName) {
  return booleanAttributes.has(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  return getAttributeBinding(el, name, fallback);
}
function extractProp(el, name, fallback, extract = true) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
    let binding = el._x_inlineBindings[name];
    binding.extract = extract;
    return dontAutoEvaluateFunctions(() => {
      return evaluate$1(el, binding.expression);
    });
  }
  return getAttributeBinding(el, name, fallback);
}
function getAttributeBinding(el, name, fallback) {
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}
function isCheckbox(el) {
  return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
}
function isRadio$1(el) {
  return el.type === "radio" || el.localName === "ui-radio";
}
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
  let firstRun = true;
  let outerHash;
  let reference = effect(() => {
    let outer = outerGet();
    let inner = innerGet();
    if (firstRun) {
      innerSet(cloneIfObject(outer));
      firstRun = false;
    } else {
      let outerHashLatest = JSON.stringify(outer);
      let innerHashLatest = JSON.stringify(inner);
      if (outerHashLatest !== outerHash) {
        innerSet(cloneIfObject(outer));
      } else if (outerHashLatest !== innerHashLatest) {
        outerSet(cloneIfObject(inner));
      } else ;
    }
    outerHash = JSON.stringify(outerGet());
    JSON.stringify(innerGet());
  });
  return () => {
    release(reference);
  };
}
function cloneIfObject(value) {
  return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}
function plugin(callback) {
  let callbacks = Array.isArray(callback) ? callback : [callback];
  callbacks.forEach((i2) => i2(alpine_default));
}
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  initInterceptors(stores[name]);
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
}
function getStores() {
  return stores;
}
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    return applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
  return () => {
  };
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
  return () => {
    while (cleanupRunners.length)
      cleanupRunners.pop()();
  };
}
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}
var Alpine$1 = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  startObservingMutations,
  stopObservingMutations,
  setReactivityEngine,
  onAttributeRemoved,
  onAttributesAdded,
  closestDataStack,
  skipDuringClone,
  onlyDuringClone,
  addRootSelector,
  addInitSelector,
  interceptClone,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  interceptInit,
  setEvaluator,
  mergeProxies,
  extractProp,
  findClosest,
  onElRemoved,
  closestRoot,
  destroyTree,
  interceptor,
  // INTERNAL: not public API and is subject to change without major release.
  transition,
  // INTERNAL
  setStyles,
  // INTERNAL
  mutateDom,
  directive,
  entangle,
  throttle,
  debounce,
  evaluate: evaluate$1,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  // INTERNAL
  cloneNode,
  // INTERNAL
  bound: getBinding,
  $data: scope,
  watch,
  walk,
  data,
  bind: bind2
};
var alpine_default = Alpine$1;
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i2 = 0; i2 < list.length; i2++) {
    map[list[i2]] = true;
  }
  return (val) => !!map[val];
}
var EMPTY_OBJ = Object.freeze({});
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
var targetMap = /* @__PURE__ */ new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol("iterate");
var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const { deps } = effect3;
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      });
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = /* @__PURE__ */ new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (effect3.options.onTrigger) {
      effect3.options.onTrigger({
        effect: effect3,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      });
    }
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var readonlyGet = /* @__PURE__ */ createGetter(true);
var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
        track(arr, "get", i2 + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys$1(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys: ownKeys$1
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v2) => Reflect.getPrototypeOf(v2);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      // iterator protocol
      next() {
        const { value, done: done2 } = innerIterator.next();
        return done2 ? { value, done: done2 } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done: done2
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false)
};
var readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value[
    "__v_skip"
    /* SKIP */
  ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target[
    "__v_isReadonly"
    /* IS_READONLY */
  ]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target[
    "__v_raw"
    /* RAW */
  ] && !(isReadonly && target[
    "__v_isReactive"
    /* IS_REACTIVE */
  ])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed[
    "__v_raw"
    /* RAW */
  ]) || observed;
}
function isRef(r2) {
  return Boolean(r2 && r2.__v_isRef === true);
}
magic("nextTick", () => nextTick);
magic("dispatch", (el) => dispatch.bind(dispatch, el));
magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let getter = () => {
    let value;
    evaluate2((i2) => value = i2);
    return value;
  };
  let unwatch = watch(getter, callback);
  cleanup2(unwatch);
});
magic("store", getStores);
magic("data", (el) => scope(el));
magic("root", (el) => closestRoot(el));
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  findClosest(el, (i2) => {
    if (i2._x_refs)
      refObjects.push(i2._x_refs);
  });
  return refObjects;
}
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}
magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
  let cacheKey = `${name}${key ? `-${key}` : ""}`;
  return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
    let root = closestIdRoot(el, name);
    let id = root ? root._x_ids[name] : findAndIncrementId(name);
    return key ? `${name}-${id}-${key}` : `${name}-${id}`;
  });
});
interceptClone((from, to) => {
  if (from._x_id) {
    to._x_id = from._x_id;
  }
});
function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
  if (!el._x_id)
    el._x_id = {};
  if (el._x_id[cacheKey])
    return el._x_id[cacheKey];
  let output = callback();
  el._x_id[cacheKey] = output;
  cleanup2(() => {
    delete el._x_id[cacheKey];
  });
  return output;
}
magic("el", (el) => el);
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i2) => result = i2);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, { scope: { "__placeholder": val } });
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    let releaseEntanglement = entangle(
      {
        get() {
          return outerGet();
        },
        set(value) {
          outerSet(value);
        }
      },
      {
        get() {
          return innerGet();
        },
        set(value) {
          innerSet(value);
        }
      }
    );
    cleanup2(releaseEntanglement);
  });
});
directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = getTarget(expression);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  el.setAttribute("data-teleport-template", true);
  clone2.setAttribute("data-teleport-target", true);
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e2) => {
        e2.stopPropagation();
        el.dispatchEvent(new e2.constructor(e2.type, e2));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  let placeInDom = (clone3, target2, modifiers2) => {
    if (modifiers2.includes("prepend")) {
      target2.parentNode.insertBefore(clone3, target2);
    } else if (modifiers2.includes("append")) {
      target2.parentNode.insertBefore(clone3, target2.nextSibling);
    } else {
      target2.appendChild(clone3);
    }
  };
  mutateDom(() => {
    placeInDom(clone2, target, modifiers);
    skipDuringClone(() => {
      initTree(clone2);
    })();
  });
  el._x_teleportPutBack = () => {
    let target2 = getTarget(expression);
    mutateDom(() => {
      placeInDom(el._x_teleport, target2, modifiers);
    });
  };
  cleanup2(
    () => mutateDom(() => {
      clone2.remove();
      destroyTree(clone2);
    })
  );
});
var teleportContainerDuringClone = document.createElement("div");
function getTarget(expression) {
  let target = skipDuringClone(() => {
    return document.querySelector(expression);
  }, () => {
    return teleportContainerDuringClone;
  })();
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  return target;
}
var handler = () => {
};
handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);
directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
  effect3(evaluateLater(el, expression));
}));
function on(el, event2, modifiers, callback) {
  let listenerTarget = el;
  let handler4 = (e2) => callback(e2);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e2) => wrapper(callback2, e2);
  if (modifiers.includes("dot"))
    event2 = dotSyntax(event2);
  if (modifiers.includes("camel"))
    event2 = camelCase2(event2);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = debounce(handler4, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = throttle(handler4, wait);
  }
  if (modifiers.includes("prevent"))
    handler4 = wrapHandler(handler4, (next, e2) => {
      e2.preventDefault();
      next(e2);
    });
  if (modifiers.includes("stop"))
    handler4 = wrapHandler(handler4, (next, e2) => {
      e2.stopPropagation();
      next(e2);
    });
  if (modifiers.includes("once")) {
    handler4 = wrapHandler(handler4, (next, e2) => {
      next(e2);
      listenerTarget.removeEventListener(event2, handler4, options);
    });
  }
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler4 = wrapHandler(handler4, (next, e2) => {
      if (el.contains(e2.target))
        return;
      if (e2.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e2);
    });
  }
  if (modifiers.includes("self"))
    handler4 = wrapHandler(handler4, (next, e2) => {
      e2.target === el && next(e2);
    });
  if (isKeyEvent(event2) || isClickEvent(event2)) {
    handler4 = wrapHandler(handler4, (next, e2) => {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e2, modifiers)) {
        return;
      }
      next(e2);
    });
  }
  listenerTarget.addEventListener(event2, handler4, options);
  return () => {
    listenerTarget.removeEventListener(event2, handler4, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  if ([" ", "_"].includes(
    subject
  ))
    return subject;
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event2) {
  return ["keydown", "keyup"].includes(event2);
}
function isClickEvent(event2) {
  return ["contextmenu", "click", "mouse"].some((i2) => event2.includes(i2));
}
function isListeningForASpecificKeyThatHasntBeenPressed(e2, modifiers) {
  let keyModifiers = modifiers.filter((i2) => {
    return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(i2);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.includes("throttle")) {
    let debounceIndex = keyModifiers.indexOf("throttle");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e2.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i2) => !selectedSystemKeyModifiers.includes(i2));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e2[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (isClickEvent(e2.type))
        return false;
      if (keyToModifiers(e2.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    "ctrl": "control",
    "slash": "/",
    "space": " ",
    "spacebar": " ",
    "cmd": "meta",
    "esc": "escape",
    "up": "arrow-up",
    "down": "arrow-down",
    "left": "arrow-left",
    "right": "arrow-right",
    "period": ".",
    "comma": ",",
    "equal": "=",
    "minus": "-",
    "underscore": "_"
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let scopeTarget = el;
  if (modifiers.includes("parent")) {
    scopeTarget = el.parentNode;
  }
  let evaluateGet = evaluateLater(scopeTarget, expression);
  let evaluateSet;
  if (typeof expression === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
  } else if (typeof expression === "function" && typeof expression() === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
  } else {
    evaluateSet = () => {
    };
  }
  let getValue = () => {
    let result;
    evaluateGet((value) => result = value);
    return isGetterSetter(result) ? result.get() : result;
  };
  let setValue = (value) => {
    let result;
    evaluateGet((value2) => result = value2);
    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {
      }, {
        scope: { "__placeholder": value }
      });
    }
  };
  if (typeof expression === "string" && el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  let event2 = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let removeListener = isCloning ? () => {
  } : on(el, event2, modifiers, (e2) => {
    setValue(getInputValue(el, modifiers, e2, getValue()));
  });
  if (modifiers.includes("fill")) {
    if ([void 0, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
      setValue(
        getInputValue(el, modifiers, { target: el }, getValue())
      );
    }
  }
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  if (el.form) {
    let removeResetListener = on(el.form, "reset", [], (e2) => {
      nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
    });
    cleanup2(() => removeResetListener());
  }
  el._x_model = {
    get() {
      return getValue();
    },
    set(value) {
      setValue(value);
    }
  };
  el._x_forceModelUpdate = (value) => {
    if (value === void 0 && typeof expression === "string" && expression.match(/\./))
      value = "";
    window.fromModel = true;
    mutateDom(() => bind(el, "value", value));
    delete window.fromModel;
  };
  effect3(() => {
    let value = getValue();
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate(value);
  });
});
function getInputValue(el, modifiers, event2, currentValue) {
  return mutateDom(() => {
    if (event2 instanceof CustomEvent && event2.detail !== void 0)
      return event2.detail !== null && event2.detail !== void 0 ? event2.detail : event2.target.value;
    else if (isCheckbox(el)) {
      if (Array.isArray(currentValue)) {
        let newValue = null;
        if (modifiers.includes("number")) {
          newValue = safeParseNumber(event2.target.value);
        } else if (modifiers.includes("boolean")) {
          newValue = safeParseBoolean(event2.target.value);
        } else {
          newValue = event2.target.value;
        }
        return event2.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
      } else {
        return event2.target.checked;
      }
    } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
      if (modifiers.includes("number")) {
        return Array.from(event2.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        });
      } else if (modifiers.includes("boolean")) {
        return Array.from(event2.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseBoolean(rawValue);
        });
      }
      return Array.from(event2.target.selectedOptions).map((option) => {
        return option.value || option.text;
      });
    } else {
      let newValue;
      if (isRadio$1(el)) {
        if (event2.target.checked) {
          newValue = event2.target.value;
        } else {
          newValue = currentValue;
        }
      } else {
        newValue = event2.target.value;
      }
      if (modifiers.includes("number")) {
        return safeParseNumber(newValue);
      } else if (modifiers.includes("boolean")) {
        return safeParseBoolean(newValue);
      } else if (modifiers.includes("trim")) {
        return newValue.trim();
      } else {
        return newValue;
      }
    }
  });
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
  return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});
mapAttributes(startingWith(":", into(prefix("bind:"))));
var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, { scope: bindingProviders });
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
    return;
  }
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
  cleanup2(() => {
    el._x_undoAddedClasses && el._x_undoAddedClasses();
    el._x_undoAddedStyles && el._x_undoAddedStyles();
  });
};
handler2.inline = (el, { value, modifiers, expression }) => {
  if (!value)
    return;
  if (!el._x_inlineBindings)
    el._x_inlineBindings = {};
  el._x_inlineBindings[value] = { expression, extract: false };
};
directive("bind", handler2);
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}
addRootSelector(() => `[${prefix("data")}]`);
directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
  if (shouldSkipRegisteringDataDuringClone(el))
    return;
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate$1(el, expression, { scope: dataProviderContext });
  if (data2 === void 0 || data2 === true)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate$1(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate$1(el, reactiveData["destroy"]);
    undo();
  });
});
interceptClone((from, to) => {
  if (from._x_dataStack) {
    to._x_dataStack = from._x_dataStack;
    to.setAttribute("data-has-alpine-state", true);
  }
});
function shouldSkipRegisteringDataDuringClone(el) {
  if (!isCloning)
    return false;
  if (isCloningLegacy)
    return true;
  return el.hasAttribute("data-has-alpine-state");
}
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once(
    (value) => value ? show() : hide(),
    (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    }
  );
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});
directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(
    el,
    // the x-bind:key expression is stored for our use instead of evaluated.
    el._x_keyExpression || "index"
  );
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => mutateDom(
      () => {
        destroyTree(el2);
        el2.remove();
      }
    ));
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i2) => typeof i2 === "object" && !Array.isArray(i2);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i2) => i2 + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => {
          if (keys.includes(value2))
            warn("Duplicate key on x-for", el);
          keys.push(value2);
        }, { scope: { index: key, ...scope2 } });
        scopes.push(scope2);
      });
    } else {
      for (let i2 = 0; i2 < items.length; i2++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i2], i2, items);
        evaluateKey((value) => {
          if (keys.includes(value))
            warn("Duplicate key on x-for", el);
          keys.push(value);
        }, { scope: { index: i2, ...scope2 } });
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i2 = 0; i2 < prevKeys.length; i2++) {
      let key = prevKeys[i2];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i2 = 0; i2 < keys.length; i2++) {
      let key = keys[i2];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i2, 0, key);
        adds.push([lastKey, i2]);
      } else if (prevIndex !== i2) {
        let keyInSpot = prevKeys.splice(i2, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i2, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i2 = 0; i2 < removes.length; i2++) {
      let key = removes[i2];
      if (!(key in lookup))
        continue;
      mutateDom(() => {
        destroyTree(lookup[key]);
        lookup[key].remove();
      });
      delete lookup[key];
    }
    for (let i2 = 0; i2 < moves.length; i2++) {
      let [keyInSpot, keyForSpot] = moves[i2];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        if (!elForSpot)
          warn(`x-for ":key" is undefined or invalid`, templateEl, keyForSpot, lookup);
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i2 = 0; i2 < adds.length; i2++) {
      let [lastKey2, index] = adds[i2];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      let reactiveScope = reactive(scope2);
      addScopeToNode(clone2, reactiveScope, templateEl);
      clone2._x_refreshXForScope = (newScope) => {
        Object.entries(newScope).forEach(([key2, value]) => {
          reactiveScope[key2] = value;
        });
      };
      mutateDom(() => {
        lastEl.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i2 = 0; i2 < sames.length; i2++) {
      lookup[sames[i2]]._x_refreshXForScope(scopes[keys.indexOf(sames[i2])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i2) => i2.trim());
    names.forEach((name, i2) => {
      scopeVariables[name] = item[i2];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i2) => i2.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function handler3() {
}
handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler3);
directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-if can only be used on a <template> tag", el);
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      skipDuringClone(() => initTree(clone2))();
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      mutateDom(() => {
        destroyTree(clone2);
        clone2.remove();
      });
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});
interceptClone((from, to) => {
  if (from._x_ids) {
    to._x_ids = from._x_ids;
  }
});
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e2) => {
    evaluate2(() => {
    }, { scope: { "$event": e2 }, params: [e2] });
  });
  cleanup2(() => removeListener());
}));
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName, slug) {
  directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
var src_default$3 = alpine_default;
var module_default$3 = src_default$3;
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
    let floor2 = modifierValue(modifiers, "min", 0);
    let fullyHide = !modifiers.includes("min");
    if (!el._x_isShown)
      el.style.height = `${floor2}px`;
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
          current = floor2;
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
          end: { height: floor2 + "px" }
        }, () => el.style.overflow = "hidden", () => {
          el._x_isShown = false;
          if (el.style.height == `${floor2}px` && fullyHide) {
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
  Alpine2.directive("intersect", Alpine2.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
    let evaluate2 = evaluateLater2(expression);
    let options = {
      rootMargin: getRootMargin(modifiers),
      threshold: getThreshold(modifiers)
    };
    let observer2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting === (value === "leave"))
          return;
        evaluate2();
        modifiers.includes("once") && observer2.disconnect();
      });
    }, options);
    observer2.observe(el);
    cleanup2(() => {
      observer2.disconnect();
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
    (el, { expression, modifiers }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
      let evaluator = evaluateLater2(expression);
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
      effect3(() => evaluator((value) => {
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
      cleanup2(releaseFocus);
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
    const observer2 = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer2.disconnect();
        resolve();
      }
    }, { rootMargin });
    observer2.observe(component.el);
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
  const directive2 = "load";
  const srcAttr = Alpine2.prefixed("load-src");
  const ignoreAttr = Alpine2.prefixed("ignore");
  let options = {
    defaultStrategy: "eager",
    keepRelativeURLs: false
  };
  let alias = false;
  let data2 = {};
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
    data2[name] = {
      loaded: false,
      download: download2
    };
  };
  Alpine2.asyncUrl = (name, url) => {
    if (!name || !url || data2[name]) return;
    data2[name] = {
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
  const handler4 = async (el) => {
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
  handler4.inline = syncHandler;
  Alpine2.directive(directive2, handler4).before("ignore");
  function elementPrep(el) {
    const name = parseName(el.getAttribute(Alpine2.prefixed("data")));
    const strategy = el.getAttribute(Alpine2.prefixed(directive2)) || options.defaultStrategy;
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
    if (!data2[name] || data2[name].loaded) return;
    const module = await getModule(name);
    Alpine2.data(name, module);
    data2[name].loaded = true;
  }
  async function getModule(name) {
    if (!data2[name]) return;
    const module = await data2[name].download(name);
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
    if (!alias || data2[name]) return;
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
function registerRzAccordion(Alpine2) {
  Alpine2.data("rzAccordion", () => ({
    selected: "",
    // ID of the currently selected/opened section (if not allowMultiple)
    allowMultiple: false,
    // Whether multiple sections can be open
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.allowMultiple = this.$el.dataset.multiple === "true";
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
    }
  }));
}
function registerAccordionItem(Alpine2) {
  Alpine2.data("accordionItem", () => ({
    open: false,
    sectionId: "",
    expandedClass: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
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
      /**
       * Executes the `init` operation.
       * @returns {any} Returns the result of `init` when applicable.
       */
      init() {
        const alpineRoot = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
        this.parentElement = document.getElementById(alpineRoot);
      },
      /**
       * Executes the `dismiss` operation.
       * @returns {any} Returns the result of `dismiss` when applicable.
       */
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
function registerRzAspectRatio(Alpine2) {
  Alpine2.data("rzAspectRatio", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const ratio = parseFloat(this.$el.dataset.ratio);
      if (!isNaN(ratio) && ratio > 0) {
        const paddingBottom = 100 / ratio + "%";
        this.$el.style.paddingBottom = paddingBottom;
      } else {
        this.$el.style.paddingBottom = "100%";
      }
    }
  }));
}
function registerRzBrowser(Alpine2) {
  Alpine2.data("rzBrowser", () => {
    return {
      screenSize: "",
      /**
       * Executes the `setDesktopScreenSize` operation.
       * @returns {any} Returns the result of `setDesktopScreenSize` when applicable.
       */
      setDesktopScreenSize() {
        this.screenSize = "";
      },
      /**
       * Executes the `setTabletScreenSize` operation.
       * @returns {any} Returns the result of `setTabletScreenSize` when applicable.
       */
      setTabletScreenSize() {
        this.screenSize = "max-w-2xl";
      },
      /**
       * Executes the `setPhoneScreenSize` operation.
       * @returns {any} Returns the result of `setPhoneScreenSize` when applicable.
       */
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
function registerRzCalendar(Alpine2, require2) {
  Alpine2.data("rzCalendar", () => ({
    calendar: null,
    initialized: false,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assets = JSON.parse(this.$el.dataset.assets || "[]");
      const configId = this.$el.dataset.configId;
      const nonce = this.$el.dataset.nonce;
      if (assets.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      require2(assets, {
        success: () => {
          this.initCalendar(configId);
        },
        error: (e2) => console.error("RzCalendar: Failed to load assets", e2)
      }, nonce);
    },
    /**
     * Executes the `initCalendar` operation.
     * @param {any} configId Input value for this method.
     * @returns {any} Returns the result of `initCalendar` when applicable.
     */
    initCalendar(configId) {
      const configElement = document.getElementById(configId);
      if (!configElement) {
        console.error(`RzCalendar: Config element #${configId} not found.`);
        return;
      }
      let rawConfig = {};
      try {
        rawConfig = JSON.parse(configElement.textContent);
      } catch (e2) {
        console.error("RzCalendar: Failed to parse config JSON", e2);
        return;
      }
      const eventHandlers = {
        onClickDate: (self, e2) => {
          this.dispatchCalendarEvent("click-day", {
            event: e2,
            dates: self.context.selectedDates
          });
        },
        onClickWeekNumber: (self, number, year, dateEls, e2) => {
          this.dispatchCalendarEvent("click-week-number", {
            event: e2,
            number,
            year,
            days: dateEls
          });
        },
        onClickMonth: (self, e2) => {
          this.dispatchCalendarEvent("click-month", {
            event: e2,
            month: self.context.selectedMonth
          });
        },
        onClickYear: (self, e2) => {
          this.dispatchCalendarEvent("click-year", {
            event: e2,
            year: self.context.selectedYear
          });
        },
        onClickArrow: (self, e2) => {
          this.dispatchCalendarEvent("click-arrow", {
            event: e2,
            year: self.context.selectedYear,
            month: self.context.selectedMonth
          });
        },
        onChangeTime: (self, e2, isError) => {
          this.dispatchCalendarEvent("change-time", {
            event: e2,
            time: self.context.selectedTime,
            hours: self.context.selectedHours,
            minutes: self.context.selectedMinutes,
            keeping: self.context.selectedKeeping,
            isError
          });
        }
      };
      const options = {
        ...rawConfig.options,
        styles: rawConfig.styles,
        ...eventHandlers
      };
      if (window.VanillaCalendarPro) {
        this.calendar = new VanillaCalendarPro.Calendar(this.$refs.calendarEl, options);
        this.calendar.init();
        this.initialized = true;
        this.dispatchCalendarEvent("init", { instance: this.calendar });
      } else {
        console.error("RzCalendar: VanillaCalendar global not found.");
      }
    },
    /**
     * Executes the `dispatchCalendarEvent` operation.
     * @param {any} eventName Input value for this method.
     * @param {any} detail Input value for this method.
     * @returns {any} Returns the result of `dispatchCalendarEvent` when applicable.
     */
    dispatchCalendarEvent(eventName, detail) {
      this.$dispatch(`rz:calendar:${eventName}`, detail);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this.calendar) {
        this.calendar.destroy();
        this.dispatchCalendarEvent("destroy", {});
      }
    }
  }));
}
function registerRzCalendarProvider(Alpine2) {
  Alpine2.data("rzCalendarProvider", () => ({
    // --- Public State ---
    mode: "single",
    dates: [],
    // Canonical state: Flat array of ISO strings ['YYYY-MM-DD', ...], always sorted/unique
    // --- Configuration ---
    locale: "en-US",
    formatOptions: {},
    // --- Public API ---
    /** 
     * The underlying VanillaCalendarPro instance.
     * Available after the 'rz:calendar:init' event fires.
     * Use this to call VCP methods directly (e.g. showMonth, showYear).
     */
    calendarApi: null,
    // --- Internal ---
    _isUpdatingFromCalendar: false,
    _lastAppliedState: null,
    _handlers: [],
    // --- Computed Helpers ---
    get date() {
      return this.dates[0] || "";
    },
    set date(val) {
      if (!val) {
        this.dates = [];
        return;
      }
      if (this._isValidIsoDate(val)) {
        this.dates = this._normalize([val]);
      }
    },
    get startDate() {
      return this.dates[0] || "";
    },
    get endDate() {
      return this.dates[this.dates.length - 1] || "";
    },
    get isRangeComplete() {
      return this.mode === "multiple-ranged" && this.dates.length >= 2;
    },
    // --- Formatting Helpers ---
    get formattedDate() {
      if (!this.date) return "";
      return this._format(this.date);
    },
    get formattedRange() {
      if (!this.startDate) return "";
      const start2 = this._format(this.startDate);
      if (!this.endDate) return start2;
      return `${start2} - ${this._format(this.endDate)}`;
    },
    // --- Lifecycle ---
    init() {
      this.mode = this.$el.dataset.mode || "single";
      this.locale = this.$el.dataset.locale || "en-US";
      try {
        this.formatOptions = JSON.parse(this.$el.dataset.formatOptions || "{}");
      } catch (e2) {
      }
      try {
        const rawDates = JSON.parse(this.$el.dataset.initialDates || "[]");
        this.dates = this._normalize(rawDates);
      } catch (e2) {
        this.dates = [];
      }
      const initHandler = (e2) => {
        this.calendarApi = e2.detail.instance;
        this.syncToCalendar();
      };
      this.$el.addEventListener("rz:calendar:init", initHandler);
      this._handlers.push({ type: "rz:calendar:init", fn: initHandler });
      const destroyHandler = () => {
        this.calendarApi = null;
        this._lastAppliedState = null;
      };
      this.$el.addEventListener("rz:calendar:destroy", destroyHandler);
      this._handlers.push({ type: "rz:calendar:destroy", fn: destroyHandler });
      const clickHandler = (e2) => {
        this._isUpdatingFromCalendar = true;
        const wasComplete = this.isRangeComplete;
        this.dates = this._normalize(e2.detail.dates || []);
        if (!wasComplete && this.isRangeComplete) {
          this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
            detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
            bubbles: true,
            composed: true
          }));
        }
        this.$nextTick(() => this._isUpdatingFromCalendar = false);
      };
      this.$el.addEventListener("rz:calendar:click-day", clickHandler);
      this._handlers.push({ type: "rz:calendar:click-day", fn: clickHandler });
      this.$watch("dates", () => {
        if (this._isUpdatingFromCalendar) return;
        const current = Array.isArray(this.dates) ? this.dates : [];
        const normalized = this._normalize(current);
        const isDirty = !Array.isArray(this.dates) || normalized.length !== this.dates.length || normalized.some((v2, i2) => v2 !== this.dates[i2]);
        if (isDirty) {
          this.dates = normalized;
          return;
        }
        this.syncToCalendar();
      });
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this._handlers.forEach((h2) => this.$el.removeEventListener(h2.type, h2.fn));
      this._handlers = [];
    },
    /**
     * Executes the `syncToCalendar` operation.
     * @returns {any} Returns the result of `syncToCalendar` when applicable.
     */
    syncToCalendar() {
      if (!this.calendarApi) return;
      let selectedDates = [...this.dates];
      if (this.mode === "multiple-ranged" && this.dates.length >= 2) {
        const start2 = this.dates[0];
        const end = this.dates[this.dates.length - 1];
        selectedDates = [`${start2}:${end}`];
      }
      let selectedMonth, selectedYear, canFocus = false;
      if (this.dates.length > 0) {
        const target = this.parseIsoLocal(this.dates[0]);
        if (!isNaN(target.getTime())) {
          selectedMonth = target.getMonth();
          selectedYear = target.getFullYear();
          canFocus = true;
        }
      }
      const stateKey = JSON.stringify({ mode: this.mode, dates: selectedDates, m: selectedMonth, y: selectedYear });
      if (this._lastAppliedState === stateKey) return;
      this._lastAppliedState = stateKey;
      const params = { selectedDates };
      if (canFocus) {
        params.selectedMonth = selectedMonth;
        params.selectedYear = selectedYear;
      }
      this.calendarApi.set(
        params,
        {
          dates: true,
          month: canFocus,
          year: canFocus,
          holidays: false,
          time: false
        }
      );
    },
    // --- Utilities ---
    _format(isoDateStr) {
      const date = this.parseIsoLocal(isoDateStr);
      if (isNaN(date.getTime())) return isoDateStr;
      return new Intl.DateTimeFormat(this.locale, this.formatOptions).format(date);
    },
    /**
     * Executes the `_extractIsoDates` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `_extractIsoDates` when applicable.
     */
    _extractIsoDates(value) {
      if (typeof value !== "string") return [];
      const matches2 = value.match(/\d{4}-\d{2}-\d{2}/g);
      return matches2 ?? [];
    },
    /**
     * Executes the `_isValidIsoDate` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `_isValidIsoDate` when applicable.
     */
    _isValidIsoDate(s2) {
      if (typeof s2 !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s2)) return false;
      const [y, m2, d2] = s2.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m2 - 1, d2));
      return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === m2 && dt.getUTCDate() === d2;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(input) {
      const arr = Array.isArray(input) ? input : [];
      const iso = arr.flat(Infinity).flatMap((v2) => {
        if (typeof v2 === "string") return this._extractIsoDates(v2);
        return [];
      }).filter((s2) => this._isValidIsoDate(s2));
      if (this.mode === "single") {
        const sorted = [...new Set(iso)].sort();
        return sorted.slice(0, 1);
      }
      if (this.mode === "multiple-ranged") {
        const sorted = iso.sort();
        if (sorted.length <= 1) return sorted;
        return [sorted[0], sorted[sorted.length - 1]];
      }
      return [...new Set(iso)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(s2) {
      const [y, m2, d2] = s2.split("-").map(Number);
      return new Date(y, m2 - 1, d2);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(dateObj) {
      const y = dateObj.getFullYear();
      const m2 = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d2 = String(dateObj.getDate()).padStart(2, "0");
      return `${y}-${m2}-${d2}`;
    },
    // --- Public API ---
    setToday() {
      this.dates = this._normalize([this.toLocalISO(/* @__PURE__ */ new Date())]);
    },
    /**
     * Executes the `addDays` operation.
     * @param {any} n Input value for this method.
     * @returns {any} Returns the result of `addDays` when applicable.
     */
    addDays(n2) {
      if (this.dates.length === 0) return;
      const current = this.parseIsoLocal(this.dates[0]);
      if (isNaN(current.getTime())) return;
      current.setDate(current.getDate() + n2);
      this.dates = this._normalize([this.toLocalISO(current)]);
    },
    /**
     * Executes the `setDate` operation.
     * @param {any} dateStr Input value for this method.
     * @returns {any} Returns the result of `setDate` when applicable.
     */
    setDate(dateStr) {
      this.dates = this._normalize(dateStr ? [dateStr] : []);
    },
    /**
     * Executes the `clear` operation.
     * @returns {any} Returns the result of `clear` when applicable.
     */
    clear() {
      this.dates = [];
    },
    /**
     * Executes the `toggleDate` operation.
     * @param {any} dateStr Input value for this method.
     * @returns {any} Returns the result of `toggleDate` when applicable.
     */
    toggleDate(dateStr) {
      let newDates;
      if (this.dates.includes(dateStr)) {
        newDates = this.dates.filter((d2) => d2 !== dateStr);
      } else {
        newDates = [...this.dates, dateStr];
      }
      this.dates = this._normalize(newDates);
    }
  }));
}
function registerRzCarousel(Alpine2, require2) {
  function parseJsonFromScriptId(id) {
    if (!id) return {};
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[rzCarousel] JSON script element #${id} not found.`);
      return {};
    }
    try {
      return JSON.parse(el.textContent || "{}");
    } catch (e2) {
      console.error(`[rzCarousel] Failed to parse JSON from #${id}:`, e2);
      return {};
    }
  }
  Alpine2.data("rzCarousel", () => ({
    emblaApi: null,
    canScrollPrev: false,
    canScrollNext: false,
    selectedIndex: 0,
    scrollSnaps: [],
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assetsToLoad = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (e2) {
          console.error("[rzCarousel] Bad assets JSON:", e2);
          return [];
        }
      })();
      const nonce = this.$el.dataset.nonce || "";
      const config = parseJsonFromScriptId(this.$el.dataset.config);
      const options = config.Options || {};
      const pluginsConfig = config.Plugins || [];
      const self = this;
      if (assetsToLoad.length > 0 && typeof require2 === "function") {
        require2(
          assetsToLoad,
          {
            /**
             * Executes the `success` operation.
             * @returns {any} Returns the result of `success` when applicable.
             */
            success() {
              if (window.EmblaCarousel) {
                self.initializeEmbla(options, pluginsConfig);
              } else {
                console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
              }
            },
            /**
             * Executes the `error` operation.
             * @param {any} err Input value for this method.
             * @returns {any} Returns the result of `error` when applicable.
             */
            error(err) {
              console.error("[rzCarousel] Failed to load EmblaCarousel assets.", err);
            }
          },
          nonce
        );
      } else {
        if (window.EmblaCarousel) {
          this.initializeEmbla(options, pluginsConfig);
        } else {
          console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
        }
      }
    },
    /**
     * Executes the `initializeEmbla` operation.
     * @param {any} options Input value for this method.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `initializeEmbla` when applicable.
     */
    initializeEmbla(options, pluginsConfig) {
      const viewport = this.$el.querySelector('[x-ref="viewport"]');
      if (!viewport) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const instantiatedPlugins = this.instantiatePlugins(pluginsConfig);
      this.emblaApi = window.EmblaCarousel(viewport, options, instantiatedPlugins);
      this.emblaApi.on("select", this.onSelect.bind(this));
      this.emblaApi.on("reInit", this.onSelect.bind(this));
      this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
    instantiatePlugins(pluginsConfig) {
      if (!Array.isArray(pluginsConfig) || pluginsConfig.length === 0) {
        return [];
      }
      return pluginsConfig.map((pluginInfo) => {
        const constructor = window[pluginInfo.Name];
        if (typeof constructor !== "function") {
          console.error(`[rzCarousel] Plugin constructor '${pluginInfo.Name}' not found on window object.`);
          return null;
        }
        try {
          return constructor(pluginInfo.Options || {});
        } catch (e2) {
          console.error(`[rzCarousel] Error instantiating plugin '${pluginInfo.Name}':`, e2);
          return null;
        }
      }).filter(Boolean);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this.emblaApi) this.emblaApi.destroy();
    },
    /**
     * Executes the `onSelect` operation.
     * @returns {any} Returns the result of `onSelect` when applicable.
     */
    onSelect() {
      if (!this.emblaApi) return;
      this.selectedIndex = this.emblaApi.selectedScrollSnap();
      this.canScrollPrev = this.emblaApi.canScrollPrev();
      this.canScrollNext = this.emblaApi.canScrollNext();
      this.scrollSnaps = this.emblaApi.scrollSnapList();
    },
    cannotScrollPrev() {
      return !this.canScrollPrev;
    },
    cannotScrollNext() {
      return !this.canScrollNext;
    },
    scrollPrev() {
      this.emblaApi?.scrollPrev();
    },
    scrollNext() {
      this.emblaApi?.scrollNext();
    },
    scrollTo(index) {
      this.emblaApi?.scrollTo(index);
    }
  }));
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
      /**
       * Executes the `init` operation.
       * @returns {any} Returns the result of `init` when applicable.
       */
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
function registerRzCollapsible(Alpine2) {
  Alpine2.data("rzCollapsible", () => ({
    isOpen: false,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.isOpen = this.$el.dataset.defaultOpen === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.isOpen = !this.isOpen;
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.isOpen ? "open" : "closed";
    }
  }));
}
function registerRzCombobox(Alpine2, require2) {
  Alpine2.data("rzCombobox", () => ({
    tomSelect: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assets = JSON.parse(this.$el.dataset.assets || "[]");
      const nonce = this.$el.dataset.nonce;
      if (assets.length > 0 && typeof require2 === "function") {
        require2(assets, {
          success: () => this.initTomSelect(),
          error: (err) => console.error("RzCombobox: Failed to load assets.", err)
        }, nonce);
      } else if (window.TomSelect) {
        this.initTomSelect();
      }
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const selectEl = this.$refs.selectInput;
      if (!selectEl) return;
      const configEl = document.getElementById(this.$el.dataset.configId);
      const config = configEl ? JSON.parse(configEl.textContent) : {};
      const render = {};
      const createAlpineRow = (templateRef, data2) => {
        if (!templateRef) return null;
        const div = document.createElement("div");
        let parsedItem = data2.item;
        if (typeof parsedItem === "string") {
          try {
            parsedItem = JSON.parse(parsedItem);
          } catch (e2) {
          }
        }
        const scope2 = {
          ...data2,
          item: parsedItem
        };
        if (Alpine2 && typeof Alpine2.addScopeToNode === "function") {
          Alpine2.addScopeToNode(div, scope2);
        } else {
          div._x_dataStack = [scope2];
        }
        div.innerHTML = templateRef.innerHTML;
        return div;
      };
      if (this.$refs.optionTemplate) {
        render.option = (data2, escape) => createAlpineRow(this.$refs.optionTemplate, data2);
      }
      if (this.$refs.itemTemplate) {
        render.item = (data2, escape) => createAlpineRow(this.$refs.itemTemplate, data2);
      }
      config.dataAttr = "data-item";
      this.tomSelect = new TomSelect(selectEl, {
        ...config,
        render,
        onInitialize: function() {
          this.sync();
        }
      });
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this.tomSelect) {
        this.tomSelect.destroy();
        this.tomSelect = null;
      }
    }
  }));
}
function registerRzDateEdit(Alpine2, require2) {
  Alpine2.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function registerRzDialog(Alpine2) {
  Alpine2.data("rzDialog", () => ({
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
      this._closeEventListener = (event2) => {
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
    /**
     * Executes the `notModalOpen` operation.
     * @returns {any} Returns the result of `notModalOpen` when applicable.
     */
    notModalOpen() {
      return !this.modalOpen;
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
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
    /**
     * Executes the `openModal` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `openModal` when applicable.
     */
    openModal(event2 = null) {
      const beforeOpenEvent = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: event2 },
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
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
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
function clamp(start2, value, end) {
  return max(start2, min(value, end));
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
      data: data2,
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
        ...data2
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
const arrow$1 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
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
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
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
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
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
const getElementRects = async function(data2) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data2.floating);
  return {
    reference: getRectRelativeToOffsetParent(data2.reference, await getOffsetParentFn(data2.floating), data2.strategy),
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
function rectsAreEqual(a2, b) {
  return a2.x === b.x && a2.y === b.y && a2.width === b.width && a2.height === b.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup2() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup2();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup2;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const arrow = arrow$1;
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
    // Will be populated when menu opens
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
      this.anchor = this.$el.dataset.anchor || "bottom";
      this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
      this.isModal = this.$el.dataset.modal !== "false";
      this.$watch("open", (value) => {
        if (value) {
          this._lastNavAt = 0;
          this.$nextTick(() => {
            this.contentEl = document.getElementById(`${this.selfId}-content`);
            if (!this.contentEl) return;
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
          this.contentEl = null;
        }
      });
    },
    // --- METHODS ---
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`);
      computePosition(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
      }).then(({ x, y }) => {
        Object.assign(this.contentEl.style, { left: `${x}px`, top: `${y}px` });
      });
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      if (this.open) {
        this.open = false;
        let self = this;
        this.$nextTick(() => self.triggerEl?.focus());
      } else {
        this.open = true;
        this.focusedIndex = -1;
      }
    },
    /**
     * Executes the `handleOutsideClick` operation.
     * @returns {any} Returns the result of `handleOutsideClick` when applicable.
     */
    handleOutsideClick() {
      if (!this.open) return;
      this.open = false;
      let self = this;
      this.$nextTick(() => self.triggerEl?.focus());
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(event2) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event2.key)) {
        event2.preventDefault();
        this.open = true;
        this.$nextTick(() => {
          if (event2.key === "ArrowUp") this.focusLastItem();
          else this.focusFirstItem();
        });
      }
    },
    /**
     * Executes the `focusNextItem` operation.
     * @returns {any} Returns the result of `focusNextItem` when applicable.
     */
    focusNextItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusPreviousItem` operation.
     * @returns {any} Returns the result of `focusPreviousItem` when applicable.
     */
    focusPreviousItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusFirstItem` operation.
     * @returns {any} Returns the result of `focusFirstItem` when applicable.
     */
    focusFirstItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = 0;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusLastItem` operation.
     * @returns {any} Returns the result of `focusLastItem` when applicable.
     */
    focusLastItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = this.menuItems.length - 1;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusCurrentItem` operation.
     * @returns {any} Returns the result of `focusCurrentItem` when applicable.
     */
    focusCurrentItem() {
      if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
        this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
      }
    },
    /**
     * Executes the `focusSelectedItem` operation.
     * @param {any} item Input value for this method.
     * @returns {any} Returns the result of `focusSelectedItem` when applicable.
     */
    focusSelectedItem(item) {
      if (!item || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      const index = this.menuItems.indexOf(item);
      if (index !== -1) {
        this.focusedIndex = index;
        item.focus();
      }
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
    handleItemClick(event2) {
      const item = event2.currentTarget;
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      if (item.getAttribute("aria-haspopup") === "menu") {
        Alpine2.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = false;
      let self = this;
      this.$nextTick(() => self.triggerEl?.focus());
    },
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(event2) {
      const item = event2.currentTarget;
      this.focusSelectedItem(item);
      if (item.getAttribute("aria-haspopup") !== "menu") {
        this.closeAllSubmenus();
      }
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
    handleWindowEscape() {
      if (this.open) {
        this.open = false;
        let self = this;
        this.$nextTick(() => self.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleContentTabKey` operation.
     * @returns {any} Returns the result of `handleContentTabKey` when applicable.
     */
    handleContentTabKey() {
      if (this.open) {
        this.open = false;
        let self = this;
        this.$nextTick(() => self.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleTriggerMouseover` operation.
     * @returns {any} Returns the result of `handleTriggerMouseover` when applicable.
     */
    handleTriggerMouseover() {
      let self = this;
      this.$nextTick(() => self.$el.firstElementChild?.focus());
    },
    /**
     * Executes the `closeAllSubmenus` operation.
     * @returns {any} Returns the result of `closeAllSubmenus` when applicable.
     */
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
    contentEl: null,
    // Will be populated when submenu opens
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
      const parentId = this.$el.dataset.parentId;
      if (parentId) {
        const parentEl = document.getElementById(parentId);
        if (parentEl) {
          this.parentDropdown = Alpine2.$data(parentEl);
        }
      }
      if (!this.parentDropdown) {
        console.error("RzDropdownSubmenu could not find its parent RzDropdownMenu controller.");
        return;
      }
      this.triggerEl = this.$refs.subTrigger;
      this.siblingContainer = this.$el.parentElement;
      this.anchor = this.$el.dataset.subAnchor || this.anchor;
      this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;
      this.$watch("open", (value) => {
        if (value) {
          this._lastNavAt = 0;
          this.parentDropdown.isSubmenuActive = true;
          this.$nextTick(() => {
            this.contentEl = document.getElementById(`${this.selfId}-subcontent`);
            if (!this.contentEl) return;
            this.updatePosition(this.contentEl);
            this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
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
          this.contentEl = null;
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
    /**
     * Executes the `handleTriggerMouseEnter` operation.
     * @returns {any} Returns the result of `handleTriggerMouseEnter` when applicable.
     */
    handleTriggerMouseEnter() {
      clearTimeout(this.closeTimeout);
      this.triggerEl.focus();
      this.openSubmenu();
    },
    /**
     * Executes the `handleTriggerMouseLeave` operation.
     * @returns {any} Returns the result of `handleTriggerMouseLeave` when applicable.
     */
    handleTriggerMouseLeave() {
      this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
    },
    /**
     * Executes the `handleContentMouseEnter` operation.
     * @returns {any} Returns the result of `handleContentMouseEnter` when applicable.
     */
    handleContentMouseEnter() {
      clearTimeout(this.closeTimeout);
    },
    /**
     * Executes the `handleContentMouseLeave` operation.
     * @returns {any} Returns the result of `handleContentMouseLeave` when applicable.
     */
    handleContentMouseLeave() {
      const childSubmenus = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      if (childSubmenus) {
        const isAnyChildOpen = Array.from(childSubmenus).some((el) => Alpine2.$data(el)?.open);
        if (isAnyChildOpen) {
          return;
        }
      }
      this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
    },
    /**
     * Executes the `openSubmenu` operation.
     * @param {any} focusFirst Input value for this method.
     * @returns {any} Returns the result of `openSubmenu` when applicable.
     */
    openSubmenu(focusFirst = false) {
      if (this.open) return;
      this.closeSiblingSubmenus();
      this.open = true;
      if (focusFirst) {
        this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem()));
      }
    },
    /**
     * Executes the `closeSubmenu` operation.
     * @returns {any} Returns the result of `closeSubmenu` when applicable.
     */
    closeSubmenu() {
      const childSubmenus = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      childSubmenus?.forEach((el) => {
        Alpine2.$data(el)?.closeSubmenu();
      });
      this.open = false;
    },
    /**
     * Executes the `closeSiblingSubmenus` operation.
     * @returns {any} Returns the result of `closeSiblingSubmenus` when applicable.
     */
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      const siblings = Array.from(this.siblingContainer.children).filter(
        (el) => el.hasAttribute("x-data") && el.getAttribute("x-data").startsWith("rzDropdownSubmenu") && el.id !== this.selfId
      );
      siblings.forEach((el) => {
        Alpine2.$data(el)?.closeSubmenu();
      });
    },
    /**
     * Executes the `toggleSubmenu` operation.
     * @returns {any} Returns the result of `toggleSubmenu` when applicable.
     */
    toggleSubmenu() {
      this.open ? this.closeSubmenu() : this.openSubmenu();
    },
    /**
     * Executes the `openSubmenuAndFocusFirst` operation.
     * @returns {any} Returns the result of `openSubmenuAndFocusFirst` when applicable.
     */
    openSubmenuAndFocusFirst() {
      this.openSubmenu(true);
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(e2) {
      if (["ArrowRight", "Enter", " "].includes(e2.key)) {
        e2.preventDefault();
        this.openSubmenuAndFocusFirst();
      }
    },
    /**
     * Executes the `focusNextItem` operation.
     * @returns {any} Returns the result of `focusNextItem` when applicable.
     */
    focusNextItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusPreviousItem` operation.
     * @returns {any} Returns the result of `focusPreviousItem` when applicable.
     */
    focusPreviousItem() {
      const now = Date.now();
      if (now - this._lastNavAt < this.navThrottle) return;
      this._lastNavAt = now;
      if (!this.menuItems.length) return;
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusFirstItem` operation.
     * @returns {any} Returns the result of `focusFirstItem` when applicable.
     */
    focusFirstItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = 0;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusLastItem` operation.
     * @returns {any} Returns the result of `focusLastItem` when applicable.
     */
    focusLastItem() {
      if (!this.menuItems.length) return;
      this.focusedIndex = this.menuItems.length - 1;
      this.focusCurrentItem();
    },
    /**
     * Executes the `focusCurrentItem` operation.
     * @returns {any} Returns the result of `focusCurrentItem` when applicable.
     */
    focusCurrentItem() {
      if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
        this.menuItems[this.focusedIndex].focus();
      }
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
    handleItemClick(event2) {
      const item = event2.currentTarget;
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      if (item.getAttribute("aria-haspopup") === "menu") {
        Alpine2.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.parentDropdown.open = false;
      this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
    },
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(event2) {
      const item = event2.currentTarget;
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
    /**
     * Executes the `handleSubmenuEscape` operation.
     * @returns {any} Returns the result of `handleSubmenuEscape` when applicable.
     */
    handleSubmenuEscape() {
      if (this.open) {
        this.open = false;
        this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleSubmenuArrowLeft` operation.
     * @returns {any} Returns the result of `handleSubmenuArrowLeft` when applicable.
     */
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
    // Proxy all properties to the reactive store
    get mode() {
      return this.$store.theme.mode;
    },
    get prefersDark() {
      return this.$store.theme.prefersDark;
    },
    get effectiveDark() {
      return this.$store.theme.effectiveDark;
    },
    // Proxy properties from the store (isDark/isLight are getters on the store)
    get isDark() {
      return this.$store.theme.isDark;
    },
    get isLight() {
      return this.$store.theme.isLight;
    },
    // Proxy methods
    setLight() {
      this.$store.theme.setLight();
    },
    setDark() {
      this.$store.theme.setDark();
    },
    setAuto() {
      this.$store.theme.setAuto();
    },
    toggle() {
      this.$store.theme.toggle();
    }
  }));
}
function registerRzEmbeddedPreview(Alpine2) {
  Alpine2.data("rzEmbeddedPreview", () => {
    return {
      iframe: null,
      onDarkModeToggle: null,
      /**
       * Executes the `init` operation.
       * @returns {any} Returns the result of `init` when applicable.
       */
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
          this.onDarkModeToggle = (event2) => {
            iframe.contentWindow.postMessage(event2.detail, "*");
          };
          window.addEventListener("darkModeToggle", this.onDarkModeToggle);
        } catch (error2) {
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
          } catch (error2) {
            console.error("Error resizing iframe:", error2);
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
      /**
       * Executes the `destroy` operation.
       * @returns {any} Returns the result of `destroy` when applicable.
       */
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
      /**
       * Executes the `init` operation.
       * @returns {any} Returns the result of `init` when applicable.
       */
      init() {
        this.headingId = this.$el.dataset.alpineRoot;
        const self = this;
        if (typeof this.setCurrentHeading === "function") {
          const callback = (entries, observer2) => {
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
      /**
       * Executes the `destroy` operation.
       * @returns {any} Returns the result of `destroy` when applicable.
       */
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `notVisible` operation.
     * @returns {any} Returns the result of `notVisible` when applicable.
     */
    notVisible() {
      return !this.visible;
    },
    /**
     * Executes the `setVisible` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `setVisible` when applicable.
     */
    setVisible(value) {
      this.visible = value;
    }
  }));
}
function registerRzInputGroupAddon(Alpine2) {
  Alpine2.data("rzInputGroupAddon", () => ({
    /**
     * Executes the `handleClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleClick` when applicable.
     */
    handleClick(event2) {
      if (event2.target.closest("button")) {
        return;
      }
      const parent = this.$el.parentElement;
      if (parent) {
        const input = parent.querySelector("input, textarea");
        input?.focus();
      }
    }
  }));
}
function registerRzMarkdown(Alpine2, require2) {
  Alpine2.data("rzMarkdown", () => {
    return {
      /**
       * Executes the `init` operation.
       * @returns {any} Returns the result of `init` when applicable.
       */
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
function registerRzMenubar(Alpine2) {
  Alpine2.data("rzMenubar", () => ({
    currentMenuValue: "",
    currentTrigger: null,
    openPath: [],
    closeTimer: null,
    closeDelayMs: 220,
    init() {
      this.onDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
      this.onWindowBlur = this.handleWindowBlur.bind(this);
      this.onDocumentFocusIn = this.handleDocumentFocusIn.bind(this);
      document.addEventListener("pointerdown", this.onDocumentPointerDown, true);
      document.addEventListener("focusin", this.onDocumentFocusIn, true);
      window.addEventListener("blur", this.onWindowBlur);
      this.$watch("currentMenuValue", () => {
        this.$nextTick(() => this.syncSubmenus());
      });
    },
    destroy() {
      document.removeEventListener("pointerdown", this.onDocumentPointerDown, true);
      document.removeEventListener("focusin", this.onDocumentFocusIn, true);
      window.removeEventListener("blur", this.onWindowBlur);
    },
    isMenuOpen() {
      const value = this.$el.dataset.menuContent;
      return this.currentMenuValue !== "" && value === this.currentMenuValue;
    },
    isSubmenuOpen() {
      const ownerId = this.$el.dataset.submenuOwner;
      return !!ownerId && this.openPath.includes(ownerId);
    },
    setTriggerState(trigger2, isOpen) {
      if (!trigger2) return;
      trigger2.dataset.state = isOpen ? "open" : "closed";
      trigger2.setAttribute("aria-expanded", isOpen ? "true" : "false");
    },
    commonPrefixLen(a2, b) {
      let i2 = 0;
      while (i2 < a2.length && i2 < b.length && a2[i2] === b[i2]) i2++;
      return i2;
    },
    setOpenPath(newPath) {
      const normalizedPath = Array.isArray(newPath) ? newPath.filter(Boolean) : [];
      const prefix2 = this.commonPrefixLen(this.openPath, normalizedPath);
      if (prefix2 !== this.openPath.length || prefix2 !== normalizedPath.length) {
        this.openPath = normalizedPath;
        this.$nextTick(() => this.syncSubmenus());
      }
    },
    openMenu(value, trigger2) {
      if (!value) return;
      this.cancelCloseAll();
      if (this.currentTrigger && this.currentTrigger !== trigger2) {
        this.setTriggerState(this.currentTrigger, false);
      }
      this.currentMenuValue = value;
      this.currentTrigger = trigger2;
      this.setTriggerState(trigger2, true);
      this.setOpenPath([]);
      this.$nextTick(() => {
        const menuContent = this.$el.querySelector(`[data-menu-content="${value}"]`) ?? document.querySelector(`[data-menu-content="${value}"]`);
        if (!menuContent || !trigger2) return;
        computePosition(trigger2, menuContent, {
          placement: "bottom-start",
          middleware: [offset(4), flip(), shift({ padding: 8 })]
        }).then(({ x, y }) => {
          Object.assign(menuContent.style, { left: `${x}px`, top: `${y}px` });
        });
      });
    },
    closeMenus() {
      this.cancelCloseAll();
      this.currentMenuValue = "";
      this.setTriggerState(this.currentTrigger, false);
      this.currentTrigger = null;
      this.setOpenPath([]);
    },
    getMenuValueFromTrigger(trigger2) {
      return trigger2?.dataset?.menuValue ?? trigger2?.closest("[data-menu-value]")?.dataset?.menuValue ?? "";
    },
    handleTriggerPointerDown(event2) {
      if (event2.button !== 0 || event2.ctrlKey) return;
      const trigger2 = event2.currentTarget;
      const value = this.getMenuValueFromTrigger(trigger2);
      if (this.currentMenuValue === value) {
        this.closeMenus();
      } else {
        this.openMenu(value, trigger2);
      }
      event2.preventDefault();
    },
    handleTriggerPointerEnter(event2) {
      if (!this.currentMenuValue) return;
      const trigger2 = event2.currentTarget;
      const value = this.getMenuValueFromTrigger(trigger2);
      if (value && value !== this.currentMenuValue) {
        this.openMenu(value, trigger2);
      }
    },
    handleTriggerKeydown(event2) {
      const trigger2 = event2.currentTarget;
      const value = this.getMenuValueFromTrigger(trigger2);
      if (["Enter", " ", "ArrowDown"].includes(event2.key)) {
        this.openMenu(value, trigger2);
        event2.preventDefault();
        return;
      }
      if (["ArrowRight", "ArrowLeft"].includes(event2.key)) {
        const triggers = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]'));
        const currentIndex = triggers.indexOf(trigger2);
        if (currentIndex < 0) return;
        const nextIndex = event2.key === "ArrowRight" ? (currentIndex + 1) % triggers.length : (currentIndex - 1 + triggers.length) % triggers.length;
        const nextTrigger = triggers[nextIndex];
        if (!nextTrigger) return;
        nextTrigger.focus();
        if (this.currentMenuValue) {
          this.openMenu(this.getMenuValueFromTrigger(nextTrigger), nextTrigger);
        }
        event2.preventDefault();
      }
    },
    handleContentKeydown(event2) {
      if (event2.key === "Escape") {
        this.closeMenus();
        this.currentTrigger?.focus();
      }
      if (event2.key === "Tab") {
        this.closeMenus();
      }
    },
    handleItemMouseEnter(event2) {
      const item = event2.currentTarget;
      if (!item || item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") return;
      item.dataset.highlighted = "";
      item.focus();
      const itemPath = this.buildPathToSubTrigger(item);
      this.setOpenPath(itemPath);
    },
    handleItemMouseLeave(event2) {
      const item = event2.currentTarget;
      if (!item) return;
      delete item.dataset.highlighted;
      if (document.activeElement === item) {
        item.blur();
      }
    },
    handleItemClick(event2) {
      const item = event2.currentTarget;
      if (item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") return;
      if (item.getAttribute("aria-haspopup") === "menu") return;
      this.closeMenus();
      this.currentTrigger?.focus();
    },
    toggleCheckboxItem(event2) {
      const item = event2.currentTarget;
      const checked = item.getAttribute("data-state") === "checked";
      item.setAttribute("data-state", checked ? "unchecked" : "checked");
      item.setAttribute("aria-checked", checked ? "false" : "true");
    },
    selectRadioItem(event2) {
      const item = event2.currentTarget;
      const group = item.getAttribute("data-radio-group");
      if (!group) return;
      const groupEl = this.$el.closest(`[role="group"][data-radio-group="${group}"]`);
      const allItems = groupEl?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${group}"]`) ?? [];
      allItems.forEach((candidate) => {
        candidate.setAttribute("data-state", "unchecked");
        candidate.setAttribute("aria-checked", "false");
      });
      item.setAttribute("data-state", "checked");
      item.setAttribute("aria-checked", "true");
    },
    buildPathToSubTrigger(element) {
      const path = [];
      let currentSub = element.closest('[data-slot="menubar-sub"]');
      while (currentSub) {
        const subTrigger = currentSub.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!subTrigger?.id) break;
        path.unshift(subTrigger.id);
        currentSub = currentSub.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
      }
      return path;
    },
    handleSubTriggerPointerEnter(event2) {
      if (!this.currentMenuValue) return;
      this.cancelCloseAll();
      const trigger2 = event2.currentTarget;
      const newPath = this.buildPathToSubTrigger(trigger2);
      this.setOpenPath(newPath);
    },
    handleSubTriggerClick(event2) {
      const trigger2 = event2.currentTarget;
      const newPath = this.buildPathToSubTrigger(trigger2);
      const isOpen = this.openPath.length === newPath.length && this.openPath.every((value, index) => value === newPath[index]);
      this.setOpenPath(isOpen ? newPath.slice(0, -1) : newPath);
    },
    handleSubTriggerKeyRight(event2) {
      this.handleSubTriggerPointerEnter(event2);
      this.$nextTick(() => {
        const subRoot = event2.currentTarget.closest('[data-slot="menubar-sub"]');
        const firstItem = subRoot?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]');
        firstItem?.focus();
      });
    },
    focusNextItem(event2) {
      const items = Array.from(event2.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement);
      const nextIndex = currentIndex < 0 || currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
      items[nextIndex]?.focus();
    },
    focusPreviousItem(event2) {
      const items = Array.from(event2.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement);
      const nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      items[nextIndex]?.focus();
    },
    handleSubContentLeftKey(event2) {
      const subRoot = event2.currentTarget.closest('[data-slot="menubar-sub"]');
      const trigger2 = subRoot?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!trigger2) return;
      const path = this.buildPathToSubTrigger(trigger2);
      this.setOpenPath(path.slice(0, -1));
      trigger2.focus();
    },
    syncSubmenus() {
      const openMenuContent = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      const subRoots = openMenuContent?.querySelectorAll('[data-slot="menubar-sub"]') ?? [];
      subRoots.forEach((subRoot) => {
        const trigger2 = subRoot.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        const content = subRoot.querySelector(':scope > [data-slot="menubar-sub-content"]');
        const triggerId = trigger2?.id;
        const isOpen = !!triggerId && this.openPath.includes(triggerId);
        this.setTriggerState(trigger2, isOpen);
        if (content) {
          content.style.display = isOpen ? "" : "none";
          content.dataset.state = isOpen ? "open" : "closed";
          if (isOpen && trigger2) {
            computePosition(trigger2, content, {
              placement: "right-start",
              middleware: [offset(4), flip(), shift({ padding: 8 })]
            }).then(({ x, y }) => {
              Object.assign(content.style, { left: `${x}px`, top: `${y}px` });
            });
          }
        }
      });
    },
    scheduleCloseAll() {
      this.cancelCloseAll();
      this.closeTimer = setTimeout(() => {
        this.closeMenus();
      }, this.closeDelayMs);
    },
    cancelCloseAll() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    handleDocumentPointerDown(event2) {
      const target = event2.target;
      if (target instanceof Node && this.$el.contains(target)) return;
      const openMenuContent = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      if (target instanceof Node && openMenuContent?.contains(target)) return;
      this.closeMenus();
    },
    handleDocumentFocusIn(event2) {
      const target = event2.target;
      if (!(target instanceof Node)) return;
      if (this.$el.contains(target)) return;
      const openMenuContent = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      if (openMenuContent?.contains(target)) return;
      this.closeMenus();
    },
    handleWindowBlur() {
      this.closeMenus();
    }
  }));
}
function registerRzNavigationMenu(Alpine2, $data2) {
  Alpine2.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: false,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: false,
    /* ---------- helpers ---------- */
    _triggerIndex(id) {
      if (!this.list) return -1;
      const triggers = Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]'));
      return triggers.findIndex((t2) => t2.getAttribute("x-ref") === `trigger_${id}`);
    },
    _contentEl(id) {
      return document.getElementById(`${id}-content`);
    },
    /* ---------- lifecycle ---------- */
    init() {
      const contentEls = this.$el.querySelectorAll("[data-popover]");
      contentEls.forEach((el) => {
        el.style.display = "none";
      });
      this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },
    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(e2) {
      const id = e2.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.activeItemId === id && this.open ? this.closeMenu() : this.openMenu(id);
    },
    /**
     * Executes the `handleTriggerEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerEnter` when applicable.
     */
    handleTriggerEnter(e2) {
      const id = e2.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose();
      if (this.activeItemId !== id && !this.isClosing) {
        requestAnimationFrame(() => this.openMenu(id));
      }
    },
    /**
     * Executes the `handleItemEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleItemEnter` when applicable.
     */
    handleItemEnter(e2) {
      const item = e2.currentTarget;
      if (!item) return;
      this.cancelClose();
      const trigger2 = item.querySelector('[x-ref^="trigger_"]');
      if (trigger2) {
        const id = trigger2.getAttribute("x-ref").replace("trigger_", "");
        if (this.activeItemId !== id && !this.isClosing) {
          requestAnimationFrame(() => this.openMenu(id));
        }
      } else {
        if (this.open && !this.isClosing) {
          this.closeMenu();
        }
      }
    },
    /**
     * Executes the `handleContentEnter` operation.
     * @returns {any} Returns the result of `handleContentEnter` when applicable.
     */
    handleContentEnter() {
      this.cancelClose();
    },
    /**
     * Executes the `scheduleClose` operation.
     * @returns {any} Returns the result of `scheduleClose` when applicable.
     */
    scheduleClose() {
      if (this.isClosing || this.closeTimeout) return;
      this.closeTimeout = setTimeout(() => this.closeMenu(), 150);
    },
    /**
     * Executes the `cancelClose` operation.
     * @returns {any} Returns the result of `cancelClose` when applicable.
     */
    cancelClose() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.isClosing = false;
    },
    /* ---------- open / close logic with direct DOM manipulation ---------- */
    openMenu(id) {
      this.cancelClose();
      this.isClosing = false;
      const newIdx = this._triggerIndex(id);
      const dir = newIdx > (this.prevIndex ?? newIdx) ? "end" : "start";
      const isFirstOpen = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== id) {
        const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (oldTrig) delete oldTrig.dataset.state;
        const oldEl = this._contentEl(this.activeItemId);
        if (oldEl) {
          const outgoingDirection = dir === "end" ? "start" : "end";
          oldEl.setAttribute("data-motion", `to-${outgoingDirection}`);
          setTimeout(() => {
            oldEl.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = id;
      this.open = true;
      this.prevIndex = newIdx;
      const newTrig = this.$refs[`trigger_${id}`];
      const newContentEl = this._contentEl(id);
      if (!newTrig || !newContentEl) return;
      computePosition(newTrig, newContentEl, {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({ padding: 8 })]
      }).then(({ x, y }) => {
        Object.assign(newContentEl.style, { left: `${x}px`, top: `${y}px` });
      });
      newContentEl.style.display = "block";
      if (isFirstOpen) {
        newContentEl.setAttribute("data-motion", "fade-in");
      } else {
        newContentEl.setAttribute("data-motion", `from-${dir}`);
      }
      this.$nextTick(() => {
        newTrig.setAttribute("aria-expanded", "true");
        newTrig.dataset.state = "open";
      });
    },
    /**
     * Executes the `closeMenu` operation.
     * @returns {any} Returns the result of `closeMenu` when applicable.
     */
    closeMenu() {
      if (!this.open || this.isClosing) return;
      this.isClosing = true;
      this.cancelClose();
      const activeId = this.activeItemId;
      if (!activeId) {
        this.isClosing = false;
        return;
      }
      const trig = this.$refs[`trigger_${activeId}`];
      if (trig) {
        trig.setAttribute("aria-expanded", "false");
        delete trig.dataset.state;
      }
      const contentEl = this._contentEl(activeId);
      if (contentEl) {
        contentEl.setAttribute("data-motion", "fade-out");
        setTimeout(() => {
          contentEl.style.display = "none";
        }, 150);
      }
      this.open = false;
      this.activeItemId = null;
      this.prevIndex = null;
      setTimeout(() => {
        this.isClosing = false;
      }, 150);
    }
  }));
}
function registerRzPopover(Alpine2) {
  Alpine2.data("rzPopover", () => ({
    open: false,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.triggerEl = this.$refs.trigger;
      this.contentEl = this.$refs.content;
      this.$watch("open", (value) => {
        this.ariaExpanded = value.toString();
        if (value) {
          this.$nextTick(() => this.updatePosition());
        }
      });
    },
    /**
     * Executes the `updatePosition` operation.
     * @returns {any} Returns the result of `updatePosition` when applicable.
     */
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const anchor = this.$el.dataset.anchor || "bottom";
      const mainOffset = parseInt(this.$el.dataset.offset) || 0;
      const crossAxisOffset = parseInt(this.$el.dataset.crossAxisOffset) || 0;
      const alignmentAxisOffset = parseInt(this.$el.dataset.alignmentAxisOffset) || null;
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
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.open = !this.open;
    },
    /**
     * Executes the `handleOutsideClick` operation.
     * @returns {any} Returns the result of `handleOutsideClick` when applicable.
     */
    handleOutsideClick() {
      if (!this.open) return;
      this.open = false;
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
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
      /**
       * Executes the `init` operation.
       * @returns {any} Returns the result of `init` when applicable.
       */
      init() {
        this.prependContainer = this.$refs.prependContainer;
        this.textInput = this.$refs.textInput;
        let self = this;
        setTimeout(() => {
          self.updatePadding();
        }, 50);
        window.addEventListener("resize", this.updatePadding);
      },
      /**
       * Executes the `destroy` operation.
       * @returns {any} Returns the result of `destroy` when applicable.
       */
      destroy() {
        window.removeEventListener("resize", this.updatePadding);
      },
      /**
       * Executes the `updatePadding` operation.
       * @returns {any} Returns the result of `updatePadding` when applicable.
       */
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `calculatePercentage` operation.
     * @returns {any} Returns the result of `calculatePercentage` when applicable.
     */
    calculatePercentage() {
      if (this.maxVal === this.minVal) {
        this.percentage = 0;
      } else {
        this.percentage = Math.min(Math.max((this.currentVal - this.minVal) / (this.maxVal - this.minVal) * 100, 0), 100);
      }
    },
    /**
     * Executes the `buildLabel` operation.
     * @returns {any} Returns the result of `buildLabel` when applicable.
     */
    buildLabel() {
      var label = this.label || "{percent}%";
      this.calculatePercentage();
      return label.replace("{percent}", this.percentage);
    },
    /**
     * Executes the `buildInsideLabelPosition` operation.
     * @returns {any} Returns the result of `buildInsideLabelPosition` when applicable.
     */
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
    /**
     * Executes the `getLabelCss` operation.
     * @returns {any} Returns the result of `getLabelCss` when applicable.
     */
    getLabelCss() {
      const barLabel = this.$refs.progressBarLabel;
      const progressBar = this.$refs.progressBar;
      if (barLabel && progressBar && barLabel.clientWidth > progressBar.clientWidth) {
        return "text-foreground dark:text-foreground";
      }
      return "";
    },
    /**
     * Executes the `updateProgressBar` operation.
     * @returns {any} Returns the result of `updateProgressBar` when applicable.
     */
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
    /**
     * Executes the `increment` operation.
     * @param {any} val Input value for this method.
     * @returns {any} Returns the result of `increment` when applicable.
     */
    increment(val = 1) {
      this.currentVal = Math.min(this.currentVal + val, this.maxVal);
    },
    /**
     * Executes the `decrement` operation.
     * @param {any} val Input value for this method.
     * @returns {any} Returns the result of `decrement` when applicable.
     */
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
function registerRzScrollArea(Alpine2) {
  Alpine2.data("rzScrollArea", () => ({
    hideTimer: null,
    type: "hover",
    orientation: "vertical",
    scrollHideDelay: 600,
    _roViewport: null,
    _roContent: null,
    _dragAxis: null,
    _dragPointerOffset: 0,
    _viewport: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.type = this.$el.dataset.type || "hover";
      this.orientation = this.$el.dataset.orientation || "vertical";
      this.scrollHideDelay = Number(this.$el.dataset.scrollHideDelay || 600);
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      this._viewport = viewport;
      this.onScroll = this.onScroll.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);
      viewport.addEventListener("scroll", this.onScroll, { passive: true });
      const update = () => this.update();
      this._roViewport = new ResizeObserver(update);
      this._roContent = new ResizeObserver(update);
      this._roViewport.observe(viewport);
      if (this.$refs.content) this._roContent.observe(this.$refs.content);
      this.setState(this.type === "always" ? "visible" : "hidden");
      this.update();
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this._viewport) this._viewport.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("pointermove", this.onPointerMove);
      window.removeEventListener("pointerup", this.onPointerUp);
      this._roViewport?.disconnect();
      this._roContent?.disconnect();
      if (this.hideTimer) window.clearTimeout(this.hideTimer);
    },
    /**
     * Executes the `setState` operation.
     * @param {any} state Input value for this method.
     * @returns {any} Returns the result of `setState` when applicable.
     */
    setState(state) {
      if (this.$refs.scrollbarX) this.$refs.scrollbarX.dataset.state = state;
      if (this.$refs.scrollbarY) this.$refs.scrollbarY.dataset.state = state;
    },
    /**
     * Executes the `setBarMounted` operation.
     * @param {any} axis Input value for this method.
     * @param {any} mounted Input value for this method.
     * @returns {any} Returns the result of `setBarMounted` when applicable.
     */
    setBarMounted(axis, mounted) {
      const bar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      if (!bar) return;
      bar.hidden = !mounted;
    },
    /**
     * Executes the `update` operation.
     * @returns {any} Returns the result of `update` when applicable.
     */
    update() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      this._viewport = viewport;
      const showX = viewport.scrollWidth > viewport.clientWidth;
      const showY = viewport.scrollHeight > viewport.clientHeight;
      this.setBarMounted("horizontal", showX);
      this.setBarMounted("vertical", showY);
      this.updateThumbSizes();
      this.updateThumbPositions();
      this.updateCorner();
      if (this.type === "always") this.setState("visible");
      if (this.type === "auto") this.setState(showX || showY ? "visible" : "hidden");
    },
    /**
     * Executes the `updateThumbSizes` operation.
     * @returns {any} Returns the result of `updateThumbSizes` when applicable.
     */
    updateThumbSizes() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      this._viewport = viewport;
      if (this.$refs.thumbY && this.$refs.scrollbarY && viewport.scrollHeight > 0) {
        const ratio = viewport.clientHeight / viewport.scrollHeight;
        const size2 = Math.max(this.$refs.scrollbarY.clientHeight * ratio, 18);
        this.$refs.thumbY.style.height = `${size2}px`;
      }
      if (this.$refs.thumbX && this.$refs.scrollbarX && viewport.scrollWidth > 0) {
        const ratio = viewport.clientWidth / viewport.scrollWidth;
        const size2 = Math.max(this.$refs.scrollbarX.clientWidth * ratio, 18);
        this.$refs.thumbX.style.width = `${size2}px`;
      }
    },
    /**
     * Executes the `updateThumbPositions` operation.
     * @returns {any} Returns the result of `updateThumbPositions` when applicable.
     */
    updateThumbPositions() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      this._viewport = viewport;
      if (this.$refs.thumbY && this.$refs.scrollbarY && viewport.scrollHeight > viewport.clientHeight) {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const track2 = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight;
        const pos = viewport.scrollTop / maxScroll * Math.max(track2, 0);
        this.$refs.thumbY.style.transform = `translate3d(0, ${pos}px, 0)`;
      }
      if (this.$refs.thumbX && this.$refs.scrollbarX && viewport.scrollWidth > viewport.clientWidth) {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const track2 = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth;
        const pos = viewport.scrollLeft / maxScroll * Math.max(track2, 0);
        this.$refs.thumbX.style.transform = `translate3d(${pos}px, 0, 0)`;
      }
    },
    /**
     * Executes the `updateCorner` operation.
     * @returns {any} Returns the result of `updateCorner` when applicable.
     */
    updateCorner() {
      if (!this.$refs.corner) return;
      const showCorner = !this.$refs.scrollbarX?.hidden && !this.$refs.scrollbarY?.hidden;
      if (showCorner) {
        this.$refs.corner.hidden = false;
        this.$refs.corner.style.width = `${this.$refs.scrollbarY?.offsetWidth || 0}px`;
        this.$refs.corner.style.height = `${this.$refs.scrollbarX?.offsetHeight || 0}px`;
      } else {
        this.$refs.corner.hidden = true;
      }
    },
    /**
     * Executes the `onScroll` operation.
     * @returns {any} Returns the result of `onScroll` when applicable.
     */
    onScroll() {
      this.updateThumbPositions();
      if (this.type === "scroll") {
        this.setState("visible");
        if (this.hideTimer) window.clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay);
      }
    },
    /**
     * Executes the `onPointerEnter` operation.
     * @returns {any} Returns the result of `onPointerEnter` when applicable.
     */
    onPointerEnter() {
      if (this.type === "hover") {
        if (this.hideTimer) window.clearTimeout(this.hideTimer);
        this.setState("visible");
      }
    },
    /**
     * Executes the `onPointerLeave` operation.
     * @returns {any} Returns the result of `onPointerLeave` when applicable.
     */
    onPointerLeave() {
      if (this.type === "hover") {
        if (this.hideTimer) window.clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay);
      }
    },
    /**
     * Executes the `onTrackPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onTrackPointerDown` when applicable.
     */
    onTrackPointerDown(event2) {
      const axis = event2.currentTarget?.dataset.orientation || "vertical";
      const scrollbar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      if (!scrollbar || scrollbar.hidden) return;
      if (event2.target === this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`]) return;
      const viewport = this.$refs.viewport;
      const thumb = this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`];
      if (!viewport || !thumb) return;
      const rect = scrollbar.getBoundingClientRect();
      if (axis === "vertical") {
        const clickPos = event2.clientY - rect.top - thumb.offsetHeight / 2;
        const track2 = scrollbar.clientHeight - thumb.offsetHeight;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        viewport.scrollTop = clickPos / Math.max(track2, 1) * maxScroll;
      } else {
        const clickPos = event2.clientX - rect.left - thumb.offsetWidth / 2;
        const track2 = scrollbar.clientWidth - thumb.offsetWidth;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollLeft = clickPos / Math.max(track2, 1) * maxScroll;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(event2) {
      const axis = event2.currentTarget?.dataset.orientation || "vertical";
      const thumb = this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`];
      const scrollbar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      if (!thumb || !scrollbar || scrollbar.hidden) return;
      const rect = thumb.getBoundingClientRect();
      this._dragAxis = axis;
      this._dragPointerOffset = axis === "vertical" ? event2.clientY - rect.top : event2.clientX - rect.left;
      window.addEventListener("pointermove", this.onPointerMove);
      window.addEventListener("pointerup", this.onPointerUp, { once: true });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(event2) {
      const axis = this._dragAxis;
      const viewport = this.$refs.viewport;
      const scrollbar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      const thumb = this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`];
      if (!axis || !viewport || !scrollbar || !thumb || scrollbar.hidden) return;
      const rect = scrollbar.getBoundingClientRect();
      if (axis === "vertical") {
        const pointer = event2.clientY - rect.top;
        const track2 = scrollbar.clientHeight - thumb.offsetHeight;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        viewport.scrollTop = (pointer - this._dragPointerOffset) / Math.max(track2, 1) * maxScroll;
      } else {
        const pointer = event2.clientX - rect.left;
        const track2 = scrollbar.clientWidth - thumb.offsetWidth;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollLeft = (pointer - this._dragPointerOffset) / Math.max(track2, 1) * maxScroll;
      }
    },
    /**
     * Executes the `onPointerUp` operation.
     * @returns {any} Returns the result of `onPointerUp` when applicable.
     */
    onPointerUp() {
      this._dragAxis = null;
      window.removeEventListener("pointermove", this.onPointerMove);
    }
  }));
}
function registerRzSheet(Alpine2) {
  Alpine2.data("rzSheet", () => ({
    open: false,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.open = this.$el.dataset.defaultOpen === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.open = !this.open;
    },
    /**
     * Executes the `close` operation.
     * @returns {any} Returns the result of `close` when applicable.
     */
    close() {
      this.open = false;
    },
    /**
     * Executes the `show` operation.
     * @returns {any} Returns the result of `show` when applicable.
     */
    show() {
      this.open = true;
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.open ? "open" : "closed";
    }
  }));
}
function registerRzTabs(Alpine2) {
  Alpine2.data("rzTabs", () => ({
    selectedTab: "",
    _triggers: [],
    _observer: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const defaultValue = this.$el.dataset.defaultValue;
      this._observer = new MutationObserver(() => this.refreshTriggers());
      this._observer.observe(this.$el, { childList: true, subtree: true });
      this.refreshTriggers();
      if (defaultValue && this._triggers.some((t2) => t2.dataset.value === defaultValue)) {
        this.selectedTab = defaultValue;
      } else if (this._triggers.length > 0) {
        this.selectedTab = this._triggers[0].dataset.value;
      }
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this._observer) {
        this._observer.disconnect();
      }
    },
    /**
     * Executes the `refreshTriggers` operation.
     * @returns {any} Returns the result of `refreshTriggers` when applicable.
     */
    refreshTriggers() {
      this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
    },
    /**
     * Executes the `onTriggerClick` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `onTriggerClick` when applicable.
     */
    onTriggerClick(e2) {
      const value = e2.currentTarget?.dataset?.value;
      if (!value || e2.currentTarget.getAttribute("aria-disabled") === "true") {
        return;
      }
      this.selectedTab = value;
      this.$dispatch("rz:tabs-change", { value: this.selectedTab });
    },
    /**
     * Executes the `isSelected` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `isSelected` when applicable.
     */
    isSelected(value) {
      return this.selectedTab === value;
    },
    /**
     * Executes the `bindTrigger` operation.
     * @returns {any} Returns the result of `bindTrigger` when applicable.
     */
    bindTrigger() {
      this.selectedTab;
      const value = this.$el.dataset.value;
      const active = this.isSelected(value);
      const disabled = this.$el.getAttribute("aria-disabled") === "true";
      return {
        "aria-selected": String(active),
        "tabindex": active ? "0" : "-1",
        "data-state": active ? "active" : "inactive",
        ...disabled && { "disabled": true }
      };
    },
    /**
     * Executes the `_attrDisabled` operation.
     * @returns {any} Returns the result of `_attrDisabled` when applicable.
     */
    _attrDisabled() {
      return this.$el.getAttribute("aria-disabled") === "true" ? "true" : null;
    },
    /**
     * Executes the `_attrAriaSelected` operation.
     * @returns {any} Returns the result of `_attrAriaSelected` when applicable.
     */
    _attrAriaSelected() {
      return String(this.$el.dataset.value === this.selectedTab);
    },
    /**
     * Executes the `_attrHidden` operation.
     * @returns {any} Returns the result of `_attrHidden` when applicable.
     */
    _attrHidden() {
      return this.$el.dataset.value === this.selectedTab ? null : "true";
    },
    /**
     * Executes the `_attrAriaHidden` operation.
     * @returns {any} Returns the result of `_attrAriaHidden` when applicable.
     */
    _attrAriaHidden() {
      return String(this.selectedTab !== this.$el.dataset.value);
    },
    /**
     * Executes the `_attrDataState` operation.
     * @returns {any} Returns the result of `_attrDataState` when applicable.
     */
    _attrDataState() {
      return this.selectedTab === this.$el.dataset.value ? "active" : "inactive";
    },
    /**
     * Executes the `_attrTabIndex` operation.
     * @returns {any} Returns the result of `_attrTabIndex` when applicable.
     */
    _attrTabIndex() {
      return this.selectedTab === this.$el.dataset.value ? "0" : "-1";
    },
    /**
     * Executes the `onListKeydown` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `onListKeydown` when applicable.
     */
    onListKeydown(e2) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e2.key)) {
        e2.preventDefault();
        const availableTriggers = this._triggers.filter((t2) => t2.getAttribute("aria-disabled") !== "true");
        if (availableTriggers.length === 0) return;
        const activeIndex = availableTriggers.findIndex((t2) => t2.dataset.value === this.selectedTab);
        if (activeIndex === -1) return;
        const isVertical = e2.currentTarget?.getAttribute("aria-orientation") === "vertical";
        const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
        const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
        let newIndex = activeIndex;
        switch (e2.key) {
          case prevKey:
            newIndex = activeIndex - 1 < 0 ? availableTriggers.length - 1 : activeIndex - 1;
            break;
          case nextKey:
            newIndex = (activeIndex + 1) % availableTriggers.length;
            break;
          case "Home":
            newIndex = 0;
            break;
          case "End":
            newIndex = availableTriggers.length - 1;
            break;
        }
        if (newIndex >= 0 && newIndex < availableTriggers.length) {
          const newTrigger = availableTriggers[newIndex];
          this.selectedTab = newTrigger.dataset.value;
          this.$nextTick(() => newTrigger.focus());
        }
      }
    }
  }));
}
function registerRzToggle(Alpine2) {
  Alpine2.data("rzToggle", () => ({
    pressed: false,
    disabled: false,
    controlled: false,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.disabled = this.$el.dataset.disabled === "true";
      const pressedValue = this.$el.dataset.pressed;
      this.controlled = pressedValue === "true" || pressedValue === "false";
      if (this.controlled) {
        this.pressed = pressedValue === "true";
        return;
      }
      this.pressed = this.$el.dataset.defaultPressed === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      if (this.disabled) return;
      if (this.controlled) return;
      this.pressed = !this.pressed;
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.pressed ? "on" : "off";
    },
    /**
     * Executes the `ariaPressed` operation.
     * @returns {any} Returns the result of `ariaPressed` when applicable.
     */
    ariaPressed() {
      return this.pressed.toString();
    },
    /**
     * Executes the `dataDisabled` operation.
     * @returns {any} Returns the result of `dataDisabled` when applicable.
     */
    dataDisabled() {
      return this.disabled ? "" : null;
    }
  }));
}
function registerRzTooltip(Alpine2) {
  Alpine2.data("rzTooltip", () => ({
    open: false,
    ariaExpanded: "false",
    state: "closed",
    side: "top",
    triggerEl: null,
    contentEl: null,
    arrowEl: null,
    openDelayTimer: null,
    closeDelayTimer: null,
    skipDelayTimer: null,
    openDelayDuration: 700,
    skipDelayDuration: 300,
    closeDelayDuration: 0,
    skipDelayActive: false,
    disableHoverableContent: false,
    anchor: "top",
    strategy: "absolute",
    mainOffset: 4,
    crossAxisOffset: 0,
    alignmentAxisOffset: null,
    shiftPadding: 8,
    enableFlip: true,
    enableShift: true,
    enableAutoUpdate: true,
    isControlledOpenState: false,
    cleanupAutoUpdate: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.readDatasetOptions();
      this.open = this.getBooleanDataset("open", this.getBooleanDataset("defaultOpen", false));
      this.ariaExpanded = this.open.toString();
      this.state = this.open ? "open" : "closed";
      this.triggerEl = this.$refs.trigger || this.$el.querySelector('[data-slot="tooltip-trigger"]');
      this.contentEl = this.$refs.content || this.$el.querySelector('[data-slot="tooltip-content"]');
      this.arrowEl = this.$el.querySelector('[data-slot="tooltip-arrow"]');
      this.bindInteractionEvents();
      this.$watch("open", (value) => {
        const controlledOpen = this.getBooleanDataset("open", value);
        const nextOpen = this.isControlledOpenState ? controlledOpen : value;
        this.open = nextOpen;
        this.ariaExpanded = nextOpen.toString();
        this.state = nextOpen ? "open" : "closed";
        if (this.triggerEl) {
          this.triggerEl.dataset.state = this.state;
        }
        if (this.contentEl) {
          this.contentEl.dataset.state = this.state;
        }
        if (nextOpen) {
          this.$nextTick(() => {
            this.updatePosition();
            this.startAutoUpdate();
          });
          return;
        }
        this.stopAutoUpdate();
        this.startSkipDelayWindow();
      });
      if (this.open) {
        this.$nextTick(() => {
          this.updatePosition();
          this.startAutoUpdate();
        });
      }
    },
    /**
     * Executes the `readDatasetOptions` operation.
     * @returns {any} Returns the result of `readDatasetOptions` when applicable.
     */
    readDatasetOptions() {
      this.anchor = this.$el.dataset.anchor || this.anchor;
      this.strategy = this.$el.dataset.strategy || this.strategy;
      this.mainOffset = this.getNumberDataset("offset", this.mainOffset);
      this.crossAxisOffset = this.getNumberDataset("crossAxisOffset", this.crossAxisOffset);
      this.alignmentAxisOffset = this.getNullableNumberDataset("alignmentAxisOffset", this.alignmentAxisOffset);
      this.shiftPadding = this.getNumberDataset("shiftPadding", this.shiftPadding);
      this.openDelayDuration = this.getNumberDataset("delayDuration", this.openDelayDuration);
      this.skipDelayDuration = this.getNumberDataset("skipDelayDuration", this.skipDelayDuration);
      this.closeDelayDuration = this.getNumberDataset("closeDelayDuration", this.closeDelayDuration);
      this.disableHoverableContent = this.getBooleanDataset("disableHoverableContent", this.disableHoverableContent);
      this.enableFlip = this.getBooleanDataset("enableFlip", this.enableFlip);
      this.enableShift = this.getBooleanDataset("enableShift", this.enableShift);
      this.enableAutoUpdate = this.getBooleanDataset("autoUpdate", this.enableAutoUpdate);
      this.isControlledOpenState = this.getBooleanDataset("openControlled", this.isControlledOpenState);
    },
    /**
     * Executes the `getBooleanDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getBooleanDataset` when applicable.
     */
    getBooleanDataset(name, fallbackValue) {
      const value = this.$el.dataset[name];
      if (typeof value === "undefined") return fallbackValue;
      return value === "true";
    },
    /**
     * Executes the `getNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNumberDataset` when applicable.
     */
    getNumberDataset(name, fallbackValue) {
      const value = Number(this.$el.dataset[name]);
      return Number.isFinite(value) ? value : fallbackValue;
    },
    /**
     * Executes the `getNullableNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
     */
    getNullableNumberDataset(name, fallbackValue) {
      const raw2 = this.$el.dataset[name];
      if (typeof raw2 === "undefined" || raw2 === null || raw2 === "") return fallbackValue;
      const value = Number(raw2);
      return Number.isFinite(value) ? value : fallbackValue;
    },
    /**
     * Executes the `bindInteractionEvents` operation.
     * @returns {any} Returns the result of `bindInteractionEvents` when applicable.
     */
    bindInteractionEvents() {
      if (!this.triggerEl) return;
      this.triggerEl.addEventListener("pointerenter", this.handleTriggerPointerEnter.bind(this));
      this.triggerEl.addEventListener("pointerleave", this.handleTriggerPointerLeave.bind(this));
      this.triggerEl.addEventListener("focus", this.handleTriggerFocus.bind(this));
      this.triggerEl.addEventListener("blur", this.handleTriggerBlur.bind(this));
      this.triggerEl.addEventListener("keydown", this.handleTriggerKeydown.bind(this));
      if (this.contentEl) {
        this.contentEl.addEventListener("pointerenter", this.handleContentPointerEnter.bind(this));
        this.contentEl.addEventListener("pointerleave", this.handleContentPointerLeave.bind(this));
      }
    },
    /**
     * Executes the `startAutoUpdate` operation.
     * @returns {any} Returns the result of `startAutoUpdate` when applicable.
     */
    startAutoUpdate() {
      if (!this.enableAutoUpdate || !this.triggerEl || !this.contentEl) return;
      this.stopAutoUpdate();
      this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
        this.updatePosition();
      });
    },
    /**
     * Executes the `stopAutoUpdate` operation.
     * @returns {any} Returns the result of `stopAutoUpdate` when applicable.
     */
    stopAutoUpdate() {
      if (typeof this.cleanupAutoUpdate === "function") {
        this.cleanupAutoUpdate();
        this.cleanupAutoUpdate = null;
      }
    },
    /**
     * Executes the `clearTimers` operation.
     * @returns {any} Returns the result of `clearTimers` when applicable.
     */
    clearTimers() {
      if (this.openDelayTimer) {
        window.clearTimeout(this.openDelayTimer);
        this.openDelayTimer = null;
      }
      if (this.closeDelayTimer) {
        window.clearTimeout(this.closeDelayTimer);
        this.closeDelayTimer = null;
      }
      if (this.skipDelayTimer) {
        window.clearTimeout(this.skipDelayTimer);
        this.skipDelayTimer = null;
      }
    },
    /**
     * Executes the `startSkipDelayWindow` operation.
     * @returns {any} Returns the result of `startSkipDelayWindow` when applicable.
     */
    startSkipDelayWindow() {
      if (this.skipDelayDuration <= 0) {
        this.skipDelayActive = false;
        return;
      }
      if (this.skipDelayTimer) {
        window.clearTimeout(this.skipDelayTimer);
      }
      this.skipDelayActive = true;
      this.skipDelayTimer = window.setTimeout(() => {
        this.skipDelayActive = false;
        this.skipDelayTimer = null;
      }, this.skipDelayDuration);
    },
    /**
     * Executes the `queueOpen` operation.
     * @returns {any} Returns the result of `queueOpen` when applicable.
     */
    queueOpen() {
      if (this.open) return;
      if (this.closeDelayTimer) {
        window.clearTimeout(this.closeDelayTimer);
        this.closeDelayTimer = null;
      }
      const delay3 = this.skipDelayActive ? 0 : this.openDelayDuration;
      if (delay3 <= 0) {
        this.open = true;
        return;
      }
      if (this.openDelayTimer) {
        window.clearTimeout(this.openDelayTimer);
      }
      this.openDelayTimer = window.setTimeout(() => {
        this.open = true;
        this.openDelayTimer = null;
      }, delay3);
    },
    /**
     * Executes the `queueClose` operation.
     * @returns {any} Returns the result of `queueClose` when applicable.
     */
    queueClose() {
      if (!this.open && !this.openDelayTimer) return;
      if (this.openDelayTimer) {
        window.clearTimeout(this.openDelayTimer);
        this.openDelayTimer = null;
      }
      if (this.closeDelayDuration <= 0) {
        this.open = false;
        return;
      }
      if (this.closeDelayTimer) {
        window.clearTimeout(this.closeDelayTimer);
      }
      this.closeDelayTimer = window.setTimeout(() => {
        this.open = false;
        this.closeDelayTimer = null;
      }, this.closeDelayDuration);
    },
    /**
     * Executes the `handleTriggerPointerEnter` operation.
     * @returns {any} Returns the result of `handleTriggerPointerEnter` when applicable.
     */
    handleTriggerPointerEnter() {
      this.queueOpen();
    },
    /**
     * Executes the `handleTriggerPointerLeave` operation.
     * @returns {any} Returns the result of `handleTriggerPointerLeave` when applicable.
     */
    handleTriggerPointerLeave() {
      this.queueClose();
    },
    /**
     * Executes the `handleTriggerFocus` operation.
     * @returns {any} Returns the result of `handleTriggerFocus` when applicable.
     */
    handleTriggerFocus() {
      this.queueOpen();
    },
    /**
     * Executes the `handleTriggerBlur` operation.
     * @returns {any} Returns the result of `handleTriggerBlur` when applicable.
     */
    handleTriggerBlur() {
      this.queueClose();
    },
    /**
     * Executes the `handleContentPointerEnter` operation.
     * @returns {any} Returns the result of `handleContentPointerEnter` when applicable.
     */
    handleContentPointerEnter() {
      if (this.disableHoverableContent) return;
      if (this.closeDelayTimer) {
        window.clearTimeout(this.closeDelayTimer);
        this.closeDelayTimer = null;
      }
    },
    /**
     * Executes the `handleContentPointerLeave` operation.
     * @returns {any} Returns the result of `handleContentPointerLeave` when applicable.
     */
    handleContentPointerLeave() {
      if (this.disableHoverableContent) return;
      this.queueClose();
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(event2) {
      if (event2.key === "Escape") {
        this.handleWindowEscape();
      }
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
    handleWindowEscape() {
      this.clearTimers();
      this.open = false;
      this.$nextTick(() => this.triggerEl?.focus());
    },
    /**
     * Executes the `updatePosition` operation.
     * @returns {any} Returns the result of `updatePosition` when applicable.
     */
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const middleware = [
        offset({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      if (this.enableFlip) {
        middleware.push(flip());
      }
      if (this.enableShift) {
        middleware.push(shift({ padding: this.shiftPadding }));
      }
      if (this.arrowEl) {
        middleware.push(arrow({ element: this.arrowEl }));
      }
      computePosition(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware
      }).then(({ x, y, placement, middlewareData }) => {
        this.side = placement.split("-")[0];
        this.contentEl.dataset.side = this.side;
        this.contentEl.style.position = this.strategy;
        this.contentEl.style.left = `${x}px`;
        this.contentEl.style.top = `${y}px`;
        if (!this.arrowEl || !middlewareData.arrow) return;
        const arrowX = middlewareData.arrow.x;
        const arrowY = middlewareData.arrow.y;
        const staticSideByPlacement = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        };
        const staticSide = staticSideByPlacement[this.side] || "bottom";
        this.arrowEl.style.left = arrowX != null ? `${arrowX}px` : "";
        this.arrowEl.style.top = arrowY != null ? `${arrowY}px` : "";
        this.arrowEl.style.right = "";
        this.arrowEl.style.bottom = "";
        this.arrowEl.style[staticSide] = "-5px";
      });
    }
  }));
}
function registerRzSidebar(Alpine2) {
  Alpine2.data("rzSidebar", () => ({
    open: false,
    openMobile: false,
    isMobile: false,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas";
      this.shortcut = this.$el.dataset.shortcut || "b";
      this.cookieName = this.$el.dataset.cookieName || "sidebar_state";
      this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const savedState = this.cookieName ? document.cookie.split("; ").find((row) => row.startsWith(`${this.cookieName}=`))?.split("=")[1] : null;
      const defaultOpen = this.$el.dataset.defaultOpen === "true";
      this.open = savedState !== null ? savedState === "true" : defaultOpen;
      this.checkIfMobile();
      window.addEventListener("keydown", (e2) => {
        if ((e2.ctrlKey || e2.metaKey) && e2.key.toLowerCase() === this.shortcut.toLowerCase()) {
          e2.preventDefault();
          this.toggle();
        }
      });
      this.$watch("open", (value) => {
        if (this.cookieName) {
          document.cookie = `${this.cookieName}=${value}; path=/; max-age=31536000`;
        }
      });
    },
    /**
     * Executes the `checkIfMobile` operation.
     * @returns {any} Returns the result of `checkIfMobile` when applicable.
     */
    checkIfMobile() {
      this.isMobile = window.innerWidth < this.mobileBreakpoint;
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      if (this.isMobile) {
        this.openMobile = !this.openMobile;
      } else {
        this.open = !this.open;
      }
    },
    /**
     * Executes the `close` operation.
     * @returns {any} Returns the result of `close` when applicable.
     */
    close() {
      if (this.isMobile) {
        this.openMobile = false;
      }
    },
    /**
     * Executes the `isMobileOpen` operation.
     * @returns {any} Returns the result of `isMobileOpen` when applicable.
     */
    isMobileOpen() {
      return this.openMobile;
    },
    /**
     * Executes the `desktopState` operation.
     * @returns {any} Returns the result of `desktopState` when applicable.
     */
    desktopState() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Executes the `mobileState` operation.
     * @returns {any} Returns the result of `mobileState` when applicable.
     */
    mobileState() {
      return this.openMobile ? "open" : "closed";
    },
    /**
     * Executes the `getCollapsibleAttribute` operation.
     * @returns {any} Returns the result of `getCollapsibleAttribute` when applicable.
     */
    getCollapsibleAttribute() {
      return this.desktopState() === "collapsed" ? this.collapsible : "";
    }
  }));
}
function registerRzCommand(Alpine2) {
  Alpine2.data("rzCommand", () => ({
    // --- STATE ---
    search: "",
    selectedValue: null,
    selectedIndex: -1,
    items: [],
    filteredItems: [],
    groupTemplates: /* @__PURE__ */ new Map(),
    activeDescendantId: null,
    isOpen: false,
    isEmpty: true,
    firstRender: true,
    isLoading: false,
    error: null,
    // --- CONFIG ---
    loop: false,
    shouldFilter: true,
    itemsUrl: null,
    fetchTrigger: "immediate",
    serverFiltering: false,
    dataItemTemplateId: null,
    _dataFetched: false,
    _debounceTimer: null,
    // --- COMPUTED (CSP-Compliant Methods) ---
    showLoading() {
      return this.isLoading;
    },
    hasError() {
      return this.error !== null;
    },
    notHasError() {
      return this.error == null;
    },
    shouldShowEmpty() {
      return this.isEmpty && this.search && !this.isLoading && !this.error;
    },
    shouldShowEmptyOrError() {
      return this.isEmpty && this.search && !this.isLoading || this.error !== null;
    },
    // --- LIFECYCLE ---
    init() {
      this.loop = this.$el.dataset.loop === "true";
      this.shouldFilter = this.$el.dataset.shouldFilter !== "false";
      this.selectedValue = this.$el.dataset.selectedValue || null;
      this.itemsUrl = this.$el.dataset.itemsUrl || null;
      this.fetchTrigger = this.$el.dataset.fetchTrigger || "immediate";
      this.serverFiltering = this.$el.dataset.serverFiltering === "true";
      this.dataItemTemplateId = this.$el.dataset.templateId || null;
      const itemsScriptId = this.$el.dataset.itemsId;
      let staticItems = [];
      if (itemsScriptId) {
        const itemsScript = document.getElementById(itemsScriptId);
        if (itemsScript) {
          try {
            staticItems = JSON.parse(itemsScript.textContent || "[]");
          } catch (e2) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${itemsScriptId}`, e2);
          }
        }
      }
      if (staticItems.length > 0 && !this.dataItemTemplateId) {
        console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      }
      staticItems.forEach((item) => {
        item.id = item.id || `static-item-${crypto.randomUUID()}`;
        item.isDataItem = true;
        this.registerItem(item);
      });
      if (this.itemsUrl && this.fetchTrigger === "immediate") {
        this.fetchItems();
      }
      this.$watch("search", (newValue) => {
        this.firstRender = false;
        if (this.serverFiltering) {
          clearTimeout(this._debounceTimer);
          this._debounceTimer = setTimeout(() => {
            this.fetchItems(newValue);
          }, 300);
        } else {
          this.filterAndSortItems();
        }
      });
      this.$watch("selectedIndex", (newIndex, oldIndex) => {
        if (oldIndex > -1) {
          const oldItem = this.filteredItems[oldIndex];
          if (oldItem) {
            const oldEl = this.$el.querySelector(`[data-command-item-id="${oldItem.id}"]`);
            if (oldEl) {
              oldEl.removeAttribute("data-selected");
              oldEl.setAttribute("aria-selected", "false");
            }
          }
        }
        if (newIndex > -1 && this.filteredItems[newIndex]) {
          const selectedItem = this.filteredItems[newIndex];
          this.activeDescendantId = selectedItem.id;
          const el = this.$el.querySelector(`[data-command-item-id="${selectedItem.id}"]`);
          if (el) {
            el.setAttribute("data-selected", "true");
            el.setAttribute("aria-selected", "true");
            el.scrollIntoView({ block: "nearest" });
          }
          const newValue = selectedItem.value;
          if (this.selectedValue !== newValue) {
            this.selectedValue = newValue;
            this.$dispatch("rz:command:select", { value: newValue });
          }
        } else {
          this.activeDescendantId = null;
          this.selectedValue = null;
        }
      });
      this.$watch("selectedValue", (newValue) => {
        const index = this.filteredItems.findIndex((item) => item.value === newValue);
        if (this.selectedIndex !== index) {
          this.selectedIndex = index;
        }
      });
      this.$watch("filteredItems", (items) => {
        this.isOpen = items.length > 0 || this.isLoading;
        this.isEmpty = items.length === 0;
        if (!this.firstRender) {
          window.dispatchEvent(new CustomEvent("rz:command:list-changed", {
            detail: {
              items: this.filteredItems,
              groups: this.groupTemplates,
              commandId: this.$el.id
            }
          }));
        }
      });
    },
    // --- METHODS ---
    async fetchItems(query = "") {
      if (!this.itemsUrl) return;
      if (!this.dataItemTemplateId) {
        console.error("RzCommand: `ItemsUrl` was provided, but no `<CommandItemTemplate>` was found to render the data.");
        this.error = "Configuration error: No data template found.";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const url = new URL(this.itemsUrl, window.location.origin);
        if (this.serverFiltering && query) {
          url.searchParams.append("q", query);
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data2 = await response.json();
        if (this.serverFiltering) {
          this.items = this.items.filter((i2) => !i2.isDataItem);
        }
        data2.forEach((item) => {
          item.id = item.id || `data-item-${crypto.randomUUID()}`;
          item.isDataItem = true;
          this.registerItem(item);
        });
        this._dataFetched = true;
      } catch (e2) {
        this.error = e2.message || "Failed to fetch command items.";
        console.error("RzCommand:", this.error);
      } finally {
        this.isLoading = false;
        this.filterAndSortItems();
      }
    },
    /**
     * Executes the `handleInteraction` operation.
     * @returns {any} Returns the result of `handleInteraction` when applicable.
     */
    handleInteraction() {
      if (this.itemsUrl && this.fetchTrigger === "on-open" && !this._dataFetched) {
        this.fetchItems();
      }
    },
    /**
     * Executes the `registerItem` operation.
     * @param {any} item Input value for this method.
     * @returns {any} Returns the result of `registerItem` when applicable.
     */
    registerItem(item) {
      if (this.items.some((i2) => i2.id === item.id)) return;
      item._order = this.items.length;
      this.items.push(item);
      if (this.selectedIndex === -1)
        this.selectedIndex = 0;
      if (!this.serverFiltering) {
        this.filterAndSortItems();
      }
    },
    /**
     * Executes the `unregisterItem` operation.
     * @param {any} itemId Input value for this method.
     * @returns {any} Returns the result of `unregisterItem` when applicable.
     */
    unregisterItem(itemId) {
      this.items = this.items.filter((i2) => i2.id !== itemId);
      this.filterAndSortItems();
    },
    /**
     * Executes the `registerGroupTemplate` operation.
     * @param {any} name Input value for this method.
     * @param {any} templateId Input value for this method.
     * @returns {any} Returns the result of `registerGroupTemplate` when applicable.
     */
    registerGroupTemplate(name, templateId) {
      if (!this.groupTemplates.has(name)) {
        this.groupTemplates.set(name, templateId);
      }
    },
    /**
     * Executes the `filterAndSortItems` operation.
     * @returns {any} Returns the result of `filterAndSortItems` when applicable.
     */
    filterAndSortItems() {
      if (this.serverFiltering && this._dataFetched) {
        this.filteredItems = this.items;
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
        return;
      }
      let items;
      if (!this.shouldFilter || !this.search) {
        items = this.items.map((item) => ({ ...item, score: 1 }));
      } else {
        items = this.items.map((item) => ({
          ...item,
          score: item.forceMount ? 0 : this.commandScore(item.name, this.search, item.keywords)
        })).filter((item) => item.score > 0 || item.forceMount).sort((a2, b) => {
          if (a2.forceMount && !b.forceMount) return 1;
          if (!a2.forceMount && b.forceMount) return -1;
          if (b.score !== a2.score) return b.score - a2.score;
          return (a2._order || 0) - (b._order || 0);
        });
      }
      this.filteredItems = items;
      if (this.selectedValue) {
        const newIndex = this.filteredItems.findIndex((item) => item.value === this.selectedValue);
        this.selectedIndex = newIndex > -1 ? newIndex : this.filteredItems.length > 0 ? 0 : -1;
      } else {
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
      }
    },
    // --- EVENT HANDLERS ---
    handleItemClick(event2) {
      const host = event2.target.closest("[data-command-item-id]");
      if (!host) return;
      const itemId = host.dataset.commandItemId;
      const index = this.filteredItems.findIndex((item) => item.id === itemId);
      if (index > -1) {
        const item = this.filteredItems[index];
        if (item && !item.disabled) {
          this.selectedIndex = index;
          this.$dispatch("rz:command:execute", { value: item.value });
        }
      }
    },
    /**
     * Executes the `handleItemHover` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemHover` when applicable.
     */
    handleItemHover(event2) {
      const host = event2.target.closest("[data-command-item-id]");
      if (!host) return;
      const itemId = host.dataset.commandItemId;
      const index = this.filteredItems.findIndex((item) => item.id === itemId);
      if (index > -1) {
        const item = this.filteredItems[index];
        if (item && !item.disabled) {
          if (this.selectedIndex !== index) {
            this.selectedIndex = index;
          }
        }
      }
    },
    // --- KEYBOARD NAVIGATION ---
    handleKeydown(e2) {
      switch (e2.key) {
        case "ArrowDown":
          e2.preventDefault();
          this.selectNext();
          break;
        case "ArrowUp":
          e2.preventDefault();
          this.selectPrev();
          break;
        case "Home":
          e2.preventDefault();
          this.selectFirst();
          break;
        case "End":
          e2.preventDefault();
          this.selectLast();
          break;
        case "Enter":
          e2.preventDefault();
          const item = this.filteredItems[this.selectedIndex];
          if (item && !item.disabled) {
            this.$dispatch("rz:command:execute", { value: item.value });
          }
          break;
      }
    },
    /**
     * Executes the `selectNext` operation.
     * @returns {any} Returns the result of `selectNext` when applicable.
     */
    selectNext() {
      if (this.filteredItems.length === 0) return;
      let i2 = this.selectedIndex, count = 0;
      do {
        i2 = i2 + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : i2 + 1;
        count++;
        if (!this.filteredItems[i2]?.disabled) {
          this.selectedIndex = i2;
          return;
        }
        if (!this.loop && i2 === this.filteredItems.length - 1) return;
      } while (count <= this.filteredItems.length);
    },
    /**
     * Executes the `selectPrev` operation.
     * @returns {any} Returns the result of `selectPrev` when applicable.
     */
    selectPrev() {
      if (this.filteredItems.length === 0) return;
      let i2 = this.selectedIndex, count = 0;
      do {
        i2 = i2 - 1 < 0 ? this.loop ? this.filteredItems.length - 1 : 0 : i2 - 1;
        count++;
        if (!this.filteredItems[i2]?.disabled) {
          this.selectedIndex = i2;
          return;
        }
        if (!this.loop && i2 === 0) return;
      } while (count <= this.filteredItems.length);
    },
    /**
     * Executes the `selectFirst` operation.
     * @returns {any} Returns the result of `selectFirst` when applicable.
     */
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const firstEnabledIndex = this.filteredItems.findIndex((item) => !item.disabled);
        if (firstEnabledIndex > -1) this.selectedIndex = firstEnabledIndex;
      }
    },
    /**
     * Executes the `selectLast` operation.
     * @returns {any} Returns the result of `selectLast` when applicable.
     */
    selectLast() {
      if (this.filteredItems.length > 0) {
        const lastEnabledIndex = this.filteredItems.map((item) => item.disabled).lastIndexOf(false);
        if (lastEnabledIndex > -1) this.selectedIndex = lastEnabledIndex;
      }
    },
    // --- SCORING ALGORITHM (Adapted from cmdk) ---
    commandScore(string, search, keywords = []) {
      const SCORE_CONTINUE_MATCH = 1;
      const SCORE_SPACE_WORD_JUMP = 0.9;
      const SCORE_NON_SPACE_WORD_JUMP = 0.8;
      const SCORE_CHARACTER_JUMP = 0.17;
      const PENALTY_SKIPPED = 0.999;
      const PENALTY_CASE_MISMATCH = 0.9999;
      const PENALTY_NOT_COMPLETE = 0.99;
      const IS_GAP_REGEXP = /[\\/_+.#"@[\(\{&]/;
      const IS_SPACE_REGEXP = /[\s-]/;
      const fullString = `${string} ${keywords ? keywords.join(" ") : ""}`;
      function formatInput(str) {
        return str.toLowerCase().replace(/[\s-]/g, " ");
      }
      function commandScoreInner(str, abbr, lowerStr, lowerAbbr, strIndex, abbrIndex, memo) {
        if (abbrIndex === abbr.length) {
          return strIndex === str.length ? SCORE_CONTINUE_MATCH : PENALTY_NOT_COMPLETE;
        }
        const memoKey = `${strIndex},${abbrIndex}`;
        if (memo[memoKey] !== void 0) return memo[memoKey];
        const abbrChar = lowerAbbr.charAt(abbrIndex);
        let index = lowerStr.indexOf(abbrChar, strIndex);
        let highScore = 0;
        while (index >= 0) {
          let score = commandScoreInner(str, abbr, lowerStr, lowerAbbr, index + 1, abbrIndex + 1, memo);
          if (score > highScore) {
            if (index === strIndex) {
              score *= SCORE_CONTINUE_MATCH;
            } else if (IS_GAP_REGEXP.test(str.charAt(index - 1))) {
              score *= SCORE_NON_SPACE_WORD_JUMP;
            } else if (IS_SPACE_REGEXP.test(str.charAt(index - 1))) {
              score *= SCORE_SPACE_WORD_JUMP;
            } else {
              score *= SCORE_CHARACTER_JUMP;
              if (strIndex > 0) {
                score *= Math.pow(PENALTY_SKIPPED, index - strIndex);
              }
            }
            if (str.charAt(index) !== abbr.charAt(abbrIndex)) {
              score *= PENALTY_CASE_MISMATCH;
            }
          }
          if (score > highScore) {
            highScore = score;
          }
          index = lowerStr.indexOf(abbrChar, index + 1);
        }
        memo[memoKey] = highScore;
        return highScore;
      }
      return commandScoreInner(fullString, search, formatInput(fullString), formatInput(search), 0, 0, {});
    }
  }));
}
function registerRzCommandItem(Alpine2) {
  Alpine2.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const parentEl = this.$el.closest('[x-data="rzCommand"]');
      if (!parentEl) {
        console.error("CommandItem must be a child of RzCommand.");
        return;
      }
      this.parent = Alpine2.$data(parentEl);
      this.itemData = {
        id: this.$el.id,
        value: this.$el.dataset.value || this.$el.textContent.trim(),
        name: this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim(),
        keywords: JSON.parse(this.$el.dataset.keywords || "[]"),
        group: this.$el.dataset.group || null,
        templateId: this.$el.id + "-template",
        disabled: this.$el.dataset.disabled === "true",
        forceMount: this.$el.dataset.forceMount === "true"
      };
      this.parent.registerItem(this.itemData);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this.parent) {
        this.parent.unregisterItem(this.itemData.id);
      }
    }
  }));
}
function registerRzCommandList(Alpine2) {
  Alpine2.data("rzCommandList", () => ({
    parent: null,
    dataItemTemplate: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const parentEl = this.$el.closest('[x-data="rzCommand"]');
      if (!parentEl) {
        console.error("CommandList must be a child of RzCommand.");
        return;
      }
      this.parent = Alpine2.$data(parentEl);
      if (this.parent.dataItemTemplateId) {
        this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId);
      }
    },
    /**
     * Executes the `renderList` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `renderList` when applicable.
     */
    renderList(event2) {
      if (event2.detail.commandId !== this.parent.$el.id) return;
      const items = event2.detail.items || [];
      const groups = event2.detail.groups || /* @__PURE__ */ new Map();
      const container = this.$el;
      container.querySelectorAll("[data-dynamic-item]").forEach((el) => el.remove());
      const groupedItems = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      items.forEach((item) => {
        const groupName = item.group || "__ungrouped__";
        if (!groupedItems.has(groupName)) {
          groupedItems.set(groupName, []);
        }
        groupedItems.get(groupName).push(item);
      });
      groupedItems.forEach((groupItems, groupName) => {
        if (groupItems.length === 0) return;
        const groupContainer = document.createElement("div");
        groupContainer.setAttribute("role", "group");
        groupContainer.setAttribute("data-dynamic-item", "true");
        groupContainer.setAttribute("data-slot", "command-group");
        if (groupName !== "__ungrouped__") {
          const headingTemplateId = groups.get(groupName);
          if (headingTemplateId) {
            const headingTemplate = document.getElementById(headingTemplateId);
            if (headingTemplate && headingTemplate.content) {
              const headingClone = headingTemplate.content.cloneNode(true);
              const headingEl = headingClone.firstElementChild;
              if (headingEl) {
                groupContainer.setAttribute("aria-labelledby", headingEl.id);
                groupContainer.appendChild(headingClone);
              }
            }
          }
        }
        groupItems.forEach((item) => {
          const itemIndex = this.parent.filteredItems.indexOf(item);
          let itemEl;
          if (item.isDataItem) {
            if (!this.dataItemTemplate) {
              return;
            }
            const clone2 = this.dataItemTemplate.content.cloneNode(true);
            itemEl = clone2.firstElementChild;
            Alpine2.addScopeToNode(itemEl, { item });
          } else {
            const template = document.getElementById(item.templateId);
            if (template && template.content) {
              const clone2 = template.content.cloneNode(true);
              itemEl = clone2.querySelector(`[data-command-item-id="${item.id}"]`);
            }
          }
          if (itemEl) {
            itemEl.setAttribute("data-command-item-id", item.id);
            itemEl.setAttribute("data-value", item.value);
            if (item.keywords) itemEl.setAttribute("data-keywords", JSON.stringify(item.keywords));
            if (item.group) itemEl.setAttribute("data-group", item.group);
            if (item.disabled) itemEl.setAttribute("data-disabled", "true");
            if (item.forceMount) itemEl.setAttribute("data-force-mount", "true");
            itemEl.setAttribute("role", "option");
            itemEl.setAttribute("aria-selected", this.parent.selectedIndex === itemIndex);
            if (item.disabled) {
              itemEl.setAttribute("aria-disabled", "true");
            }
            if (this.parent.selectedIndex === itemIndex) {
              itemEl.setAttribute("data-selected", "true");
            }
            groupContainer.appendChild(itemEl);
            Alpine2.initTree(itemEl);
          }
        });
        container.appendChild(groupContainer);
      });
    }
  }));
}
function registerRzCommandGroup(Alpine2) {
  Alpine2.data("rzCommandGroup", () => ({
    parent: null,
    heading: "",
    templateId: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const parentEl = this.$el.closest('[x-data="rzCommand"]');
      if (!parentEl) {
        console.error("CommandGroup must be a child of RzCommand.");
        return;
      }
      this.parent = Alpine2.$data(parentEl);
      this.heading = this.$el.dataset.heading;
      this.templateId = this.$el.dataset.templateId;
      if (this.heading && this.templateId) {
        this.parent.registerGroupTemplate(this.heading, this.templateId);
      }
    }
  }));
}
async function generateBundleId(paths) {
  paths = [...paths].sort();
  const joinedPaths = paths.join("|");
  const encoder = new TextEncoder();
  const data2 = encoder.encode(joinedPaths);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data2);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function rizzyRequire(paths, callbackOrNonce, nonce) {
  let cbObj = void 0;
  let csp = void 0;
  if (typeof callbackOrNonce === "function") {
    cbObj = { success: callbackOrNonce };
  } else if (callbackOrNonce && typeof callbackOrNonce === "object") {
    cbObj = callbackOrNonce;
  } else if (typeof callbackOrNonce === "string") {
    csp = callbackOrNonce;
  }
  if (!csp && typeof nonce === "string") csp = nonce;
  const files = Array.isArray(paths) ? paths : [paths];
  return generateBundleId(files).then((bundleId) => {
    if (!loadjs.isDefined(bundleId)) {
      loadjs(files, bundleId, {
        // keep scripts ordered unless you explicitly change this later
        async: false,
        // pass CSP nonce to both script and style tags as your loader expects
        inlineScriptNonce: csp,
        inlineStyleNonce: csp
      });
    }
    return new Promise((resolve, reject) => {
      loadjs.ready(bundleId, {
        success: () => {
          try {
            if (cbObj && typeof cbObj.success === "function") cbObj.success();
          } catch (e2) {
            console.error("[rizzyRequire] success callback threw:", e2);
          }
          resolve({ bundleId });
        },
        error: (depsNotFound) => {
          try {
            if (cbObj && typeof cbObj.error === "function") {
              cbObj.error(depsNotFound);
            }
          } catch (e2) {
            console.error("[rizzyRequire] error callback threw:", e2);
          }
          reject(
            new Error(
              `[rizzyRequire] Failed to load bundle ${bundleId} (missing: ${Array.isArray(depsNotFound) ? depsNotFound.join(", ") : String(depsNotFound)})`
            )
          );
        }
      });
    });
  });
}
function registerComponents(Alpine2) {
  registerRzAccordion(Alpine2);
  registerAccordionItem(Alpine2);
  registerRzAlert(Alpine2);
  registerRzAspectRatio(Alpine2);
  registerRzBrowser(Alpine2);
  registerRzCalendar(Alpine2, rizzyRequire);
  registerRzCalendarProvider(Alpine2);
  registerRzCarousel(Alpine2, rizzyRequire);
  registerRzCodeViewer(Alpine2, rizzyRequire);
  registerRzCollapsible(Alpine2);
  registerRzCombobox(Alpine2, rizzyRequire);
  registerRzDateEdit(Alpine2, rizzyRequire);
  registerRzDialog(Alpine2);
  registerRzDropdownMenu(Alpine2);
  registerRzDarkModeToggle(Alpine2);
  registerRzEmbeddedPreview(Alpine2);
  registerRzEmpty(Alpine2);
  registerRzHeading(Alpine2);
  registerRzIndicator(Alpine2);
  registerRzInputGroupAddon(Alpine2);
  registerRzMarkdown(Alpine2, rizzyRequire);
  registerRzMenubar(Alpine2);
  registerRzNavigationMenu(Alpine2);
  registerRzPopover(Alpine2);
  registerRzPrependInput(Alpine2);
  registerRzProgress(Alpine2);
  registerRzQuickReferenceContainer(Alpine2);
  registerRzScrollArea(Alpine2);
  registerRzSheet(Alpine2);
  registerRzTabs(Alpine2);
  registerRzToggle(Alpine2);
  registerRzTooltip(Alpine2);
  registerRzSidebar(Alpine2);
  registerRzCommand(Alpine2);
  registerRzCommandItem(Alpine2);
  registerRzCommandList(Alpine2);
  registerRzCommandGroup(Alpine2);
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
const _registered = /* @__PURE__ */ new Map();
const _importCache = /* @__PURE__ */ new Map();
let _onAlpineInitAttached = false;
function onceImport(path) {
  if (!_importCache.has(path)) {
    _importCache.set(
      path,
      import(path).catch((err) => {
        _importCache.delete(path);
        throw err;
      })
    );
  }
  return _importCache.get(path);
}
function setAsyncLoader(name, path) {
  const Alpine2 = globalThis.Alpine;
  if (!(Alpine2 && typeof Alpine2.asyncData === "function")) {
    console.error(
      `[RizzyUI] Could not register async component '${name}'. AsyncAlpine not available.`
    );
    return false;
  }
  Alpine2.asyncData(
    name,
    () => onceImport(path).catch((error2) => {
      console.error(
        `[RizzyUI] Failed to load Alpine module '${name}' from '${path}'.`,
        error2
      );
      return () => ({
        _error: true,
        _errorMessage: `Module '${name}' failed to load.`
      });
    })
  );
  return true;
}
function registerAsyncComponent(name, path) {
  if (!name || !path) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const prev = _registered.get(name);
  if (prev && prev.path !== path) {
    console.warn(
      `[RizzyUI] Re-registering '${name}' with a different path.
  Previous: ${prev.path}
  New:      ${path}`
    );
  }
  const Alpine2 = globalThis.Alpine;
  if (Alpine2 && Alpine2.version) {
    const changedPath = !prev || prev.path !== path;
    const alreadySet = prev && prev.loaderSet && !changedPath;
    if (!alreadySet) {
      const ok = setAsyncLoader(name, path);
      _registered.set(name, { path, loaderSet: ok });
    }
    return;
  }
  _registered.set(name, { path, loaderSet: false });
  if (!_onAlpineInitAttached) {
    _onAlpineInitAttached = true;
    document.addEventListener(
      "alpine:init",
      () => {
        for (const [n2, info] of _registered) {
          if (!info.loaderSet) {
            const ok = setAsyncLoader(n2, info.path);
            info.loaderSet = ok;
          }
        }
      },
      { once: true }
    );
  }
}
function registerMobileDirective(Alpine2) {
  Alpine2.directive("mobile", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
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
      const data2 = getComponentData();
      if (data2) data2[expression] = val;
    };
    const dispatch2 = (val) => {
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
      dispatch2(val);
    };
    update();
    const onChange = () => update();
    const onResize = () => update();
    mql.addEventListener("change", onChange);
    window.addEventListener("resize", onResize, { passive: true });
    cleanup2(() => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onResize);
    });
  });
}
function registerSyncDirective(Alpine2) {
  const handler4 = (el, { expression, modifiers }, { cleanup: cleanup2, effect: effect3 }) => {
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
      const stop1 = effect3(() => {
        const parentVal = Alpine2.evaluate(el, pair.parentPath, { scope: parentData });
        if (g.fromChild) return;
        g.fromParent = true;
        setAtPath(childData, pair.childPath, parentVal);
        queueMicrotask(() => {
          g.fromParent = false;
        });
      });
      const stop2 = effect3(() => {
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
    cleanup2(() => {
      for (const stop2 of stops) {
        try {
          stop2 && stop2();
        } catch {
        }
      }
    });
  };
  Alpine2.directive("syncprop", handler4);
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
    const raw2 = this._safeReadStorage(this.storageKey);
    this._mode = this._normalizeMode(raw2 ?? "auto");
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
let cachedRizzyUI = null;
function bootstrapRizzyUI(Alpine2) {
  if (cachedRizzyUI) return cachedRizzyUI;
  Alpine2.plugin(module_default$2);
  Alpine2.plugin(module_default$1);
  Alpine2.plugin(module_default);
  Alpine2.plugin(async_alpine_default);
  if (typeof document !== "undefined") {
    document.addEventListener("alpine:init", () => {
      registerStores(Alpine2);
    });
  }
  registerComponents(Alpine2);
  registerMobileDirective(Alpine2);
  registerSyncDirective(Alpine2);
  cachedRizzyUI = {
    Alpine: Alpine2,
    require: rizzyRequire,
    toast: Toast,
    $data,
    props,
    registerAsyncComponent,
    theme: themeController
  };
  if (typeof window !== "undefined") {
    themeController.init();
    window.Alpine = Alpine2;
    window.Rizzy = { ...window.Rizzy || {}, ...cachedRizzyUI };
    document.dispatchEvent(new CustomEvent("rz:init", {
      detail: { Rizzy: window.Rizzy }
    }));
  }
  return cachedRizzyUI;
}
const RizzyUI = bootstrapRizzyUI(module_default$3);
module_default$3.start();
export {
  RizzyUI as default
};
//# sourceMappingURL=rizzyui.es.js.map
