import X from "alpinejs";
function Le(e) {
  e.directive("collapse", t), t.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function t(i, { modifiers: n }) {
    let s = Wt(n, "duration", 250) / 1e3, r = Wt(n, "min", 0), o = !n.includes("min");
    i._x_isShown || (i.style.height = `${r}px`), !i._x_isShown && o && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let a = (c, d) => {
      let u = e.setStyles(c, d);
      return d.height ? () => {
      } : u;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${s}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    i._x_transition = {
      in(c = () => {
      }, d = () => {
      }) {
        o && (i.hidden = !1), o && (i.style.display = null);
        let u = i.getBoundingClientRect().height;
        i.style.height = "auto";
        let p = i.getBoundingClientRect().height;
        u === p && (u = r), e.transition(i, e.setStyles, {
          during: l,
          start: { height: u + "px" },
          end: { height: p + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - p) < 1 && (i.style.overflow = null);
        });
      },
      out(c = () => {
      }, d = () => {
      }) {
        let u = i.getBoundingClientRect().height;
        e.transition(i, a, {
          during: l,
          start: { height: u + "px" },
          end: { height: r + "px" }
        }, () => i.style.overflow = "hidden", () => {
          i._x_isShown = !1, i.style.height == `${r}px` && o && (i.style.display = "none", i.hidden = !0);
        });
      }
    };
  }
}
function Wt(e, t, i) {
  if (e.indexOf(t) === -1)
    return i;
  const n = e[e.indexOf(t) + 1];
  if (!n)
    return i;
  if (t === "duration") {
    let s = n.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  if (t === "min") {
    let s = n.match(/([0-9]+)px/);
    if (s)
      return s[1];
  }
  return n;
}
var Re = Le;
function Fe(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: s }, { evaluateLater: r, cleanup: o }) => {
    let a = r(n), l = {
      rootMargin: Me(s),
      threshold: De(s)
    }, c = new IntersectionObserver((d) => {
      d.forEach((u) => {
        u.isIntersecting !== (i === "leave") && (a(), s.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(t), o(() => {
      c.disconnect();
    });
  }));
}
function De(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function _e(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Me(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let s = [];
  for (let r = 1; r < 5; r++)
    s.push(_e(e[n + r] || ""));
  return s = s.filter((r) => r !== void 0), s.length ? s.join(" ").trim() : i;
}
var ze = Fe, ne = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], pt = /* @__PURE__ */ ne.join(","), se = typeof Element > "u", Z = se ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, $t = !se && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, re = function(t, i, n) {
  var s = Array.prototype.slice.apply(t.querySelectorAll(pt));
  return i && Z.call(t, pt) && s.unshift(t), s = s.filter(n), s;
}, oe = function e(t, i, n) {
  for (var s = [], r = Array.from(t); r.length; ) {
    var o = r.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, n);
      n.flatten ? s.push.apply(s, c) : s.push({
        scope: o,
        candidates: c
      });
    } else {
      var d = Z.call(o, pt);
      d && n.filter(o) && (i || !t.includes(o)) && s.push(o);
      var u = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), p = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (u && p) {
        var m = e(u === !0 ? o.children : u.children, !0, n);
        n.flatten ? s.push.apply(s, m) : s.push({
          scope: o,
          candidates: m
        });
      } else
        r.unshift.apply(r, o.children);
    }
  }
  return s;
}, ae = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Pe = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, le = function(t) {
  return t.tagName === "INPUT";
}, Be = function(t) {
  return le(t) && t.type === "hidden";
}, We = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Ve = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, He = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || $t(t), n = function(a) {
    return i.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, s;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    s = n(window.CSS.escape(t.name));
  else
    try {
      s = n(t.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var r = Ve(s, t.form);
  return !r || r === t;
}, Ye = function(t) {
  return le(t) && t.type === "radio";
}, je = function(t) {
  return Ye(t) && !He(t);
}, Vt = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, s = i.height;
  return n === 0 && s === 0;
}, qe = function(t, i) {
  var n = i.displayCheck, s = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var r = Z.call(t, "details>summary:first-of-type"), o = r ? t.parentElement : t;
  if (Z.call(o, "details:not([open]) *"))
    return !0;
  var a = $t(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof s == "function") {
      for (var c = t; t; ) {
        var d = t.parentElement, u = $t(t);
        if (d && !d.shadowRoot && s(d) === !0)
          return Vt(t);
        t.assignedSlot ? t = t.assignedSlot : !d && u !== t.ownerDocument ? t = u.host : t = d;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (n === "non-zero-area")
    return Vt(t);
  return !1;
}, Ue = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var s = i.children.item(n);
          if (s.tagName === "LEGEND")
            return Z.call(i, "fieldset[disabled] *") ? !0 : !s.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, mt = function(t, i) {
  return !(i.disabled || Be(i) || qe(i, t) || // For a details element with a summary, the summary element gets the focus
  We(i) || Ue(i));
}, Lt = function(t, i) {
  return !(je(i) || ae(i) < 0 || !mt(t, i));
}, Ge = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Ze = function e(t) {
  var i = [], n = [];
  return t.forEach(function(s, r) {
    var o = !!s.scope, a = o ? s.scope : s, l = ae(a, o), c = o ? e(s.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: r,
      tabIndex: l,
      item: s,
      isScope: o,
      content: c
    });
  }), n.sort(Pe).reduce(function(s, r) {
    return r.isScope ? s.push.apply(s, r.content) : s.push(r.content), s;
  }, []).concat(i);
}, Ke = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = oe([t], i.includeContainer, {
    filter: Lt.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: Ge
  }) : n = re(t, i.includeContainer, Lt.bind(null, i)), Ze(n);
}, ce = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = oe([t], i.includeContainer, {
    filter: mt.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = re(t, i.includeContainer, mt.bind(null, i)), n;
}, ut = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return Z.call(t, pt) === !1 ? !1 : Lt(i, t);
}, Xe = /* @__PURE__ */ ne.concat("iframe").join(","), ft = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return Z.call(t, Xe) === !1 ? !1 : mt(i, t);
};
function Ht(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(s) {
      return Object.getOwnPropertyDescriptor(e, s).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function Yt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ht(Object(i), !0).forEach(function(n) {
      Je(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : Ht(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function Je(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var jt = /* @__PURE__ */ function() {
  var e = [];
  return {
    activateTrap: function(i) {
      if (e.length > 0) {
        var n = e[e.length - 1];
        n !== i && n.pause();
      }
      var s = e.indexOf(i);
      s === -1 || e.splice(s, 1), e.push(i);
    },
    deactivateTrap: function(i) {
      var n = e.indexOf(i);
      n !== -1 && e.splice(n, 1), e.length > 0 && e[e.length - 1].unpause();
    }
  };
}(), Qe = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, ti = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, ei = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, qt = function(t) {
  return setTimeout(t, 0);
}, Ut = function(t, i) {
  var n = -1;
  return t.every(function(s, r) {
    return i(s) ? (n = r, !1) : !0;
  }), n;
}, it = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++)
    n[s - 1] = arguments[s];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, dt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, ii = function(t, i) {
  var n = i?.document || document, s = Yt({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, i), r = {
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
    active: !1,
    paused: !1,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0
  }, o, a = function(f, h, g) {
    return f && f[h] !== void 0 ? f[h] : s[g || h];
  }, l = function(f) {
    return r.containerGroups.findIndex(function(h) {
      var g = h.container, E = h.tabbableNodes;
      return g.contains(f) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      E.find(function(x) {
        return x === f;
      });
    });
  }, c = function(f) {
    var h = s[f];
    if (typeof h == "function") {
      for (var g = arguments.length, E = new Array(g > 1 ? g - 1 : 0), x = 1; x < g; x++)
        E[x - 1] = arguments[x];
      h = h.apply(void 0, E);
    }
    if (h === !0 && (h = void 0), !h) {
      if (h === void 0 || h === !1)
        return h;
      throw new Error("`".concat(f, "` was specified but was not a node, or did not return a node"));
    }
    var C = h;
    if (typeof h == "string" && (C = n.querySelector(h), !C))
      throw new Error("`".concat(f, "` as selector refers to no known node"));
    return C;
  }, d = function() {
    var f = c("initialFocus");
    if (f === !1)
      return !1;
    if (f === void 0)
      if (l(n.activeElement) >= 0)
        f = n.activeElement;
      else {
        var h = r.tabbableGroups[0], g = h && h.firstTabbableNode;
        f = g || c("fallbackFocus");
      }
    if (!f)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return f;
  }, u = function() {
    if (r.containerGroups = r.containers.map(function(f) {
      var h = Ke(f, s.tabbableOptions), g = ce(f, s.tabbableOptions);
      return {
        container: f,
        tabbableNodes: h,
        focusableNodes: g,
        firstTabbableNode: h.length > 0 ? h[0] : null,
        lastTabbableNode: h.length > 0 ? h[h.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(x) {
          var C = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = g.findIndex(function(A) {
            return A === x;
          });
          if (!(N < 0))
            return C ? g.slice(N + 1).find(function(A) {
              return ut(A, s.tabbableOptions);
            }) : g.slice(0, N).reverse().find(function(A) {
              return ut(A, s.tabbableOptions);
            });
        }
      };
    }), r.tabbableGroups = r.containerGroups.filter(function(f) {
      return f.tabbableNodes.length > 0;
    }), r.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, p = function v(f) {
    if (f !== !1 && f !== n.activeElement) {
      if (!f || !f.focus) {
        v(d());
        return;
      }
      f.focus({
        preventScroll: !!s.preventScroll
      }), r.mostRecentlyFocusedNode = f, Qe(f) && f.select();
    }
  }, m = function(f) {
    var h = c("setReturnFocus", f);
    return h || (h === !1 ? !1 : f);
  }, b = function(f) {
    var h = dt(f);
    if (!(l(h) >= 0)) {
      if (it(s.clickOutsideDeactivates, f)) {
        o.deactivate({
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
          returnFocus: s.returnFocusOnDeactivate && !ft(h, s.tabbableOptions)
        });
        return;
      }
      it(s.allowOutsideClick, f) || f.preventDefault();
    }
  }, y = function(f) {
    var h = dt(f), g = l(h) >= 0;
    g || h instanceof Document ? g && (r.mostRecentlyFocusedNode = h) : (f.stopImmediatePropagation(), p(r.mostRecentlyFocusedNode || d()));
  }, w = function(f) {
    var h = dt(f);
    u();
    var g = null;
    if (r.tabbableGroups.length > 0) {
      var E = l(h), x = E >= 0 ? r.containerGroups[E] : void 0;
      if (E < 0)
        f.shiftKey ? g = r.tabbableGroups[r.tabbableGroups.length - 1].lastTabbableNode : g = r.tabbableGroups[0].firstTabbableNode;
      else if (f.shiftKey) {
        var C = Ut(r.tabbableGroups, function(F) {
          var R = F.firstTabbableNode;
          return h === R;
        });
        if (C < 0 && (x.container === h || ft(h, s.tabbableOptions) && !ut(h, s.tabbableOptions) && !x.nextTabbableNode(h, !1)) && (C = E), C >= 0) {
          var N = C === 0 ? r.tabbableGroups.length - 1 : C - 1, A = r.tabbableGroups[N];
          g = A.lastTabbableNode;
        }
      } else {
        var M = Ut(r.tabbableGroups, function(F) {
          var R = F.lastTabbableNode;
          return h === R;
        });
        if (M < 0 && (x.container === h || ft(h, s.tabbableOptions) && !ut(h, s.tabbableOptions) && !x.nextTabbableNode(h)) && (M = E), M >= 0) {
          var L = M === r.tabbableGroups.length - 1 ? 0 : M + 1, U = r.tabbableGroups[L];
          g = U.firstTabbableNode;
        }
      }
    } else
      g = c("fallbackFocus");
    g && (f.preventDefault(), p(g));
  }, T = function(f) {
    if (ti(f) && it(s.escapeDeactivates, f) !== !1) {
      f.preventDefault(), o.deactivate();
      return;
    }
    if (ei(f)) {
      w(f);
      return;
    }
  }, S = function(f) {
    var h = dt(f);
    l(h) >= 0 || it(s.clickOutsideDeactivates, f) || it(s.allowOutsideClick, f) || (f.preventDefault(), f.stopImmediatePropagation());
  }, O = function() {
    if (r.active)
      return jt.activateTrap(o), r.delayInitialFocusTimer = s.delayInitialFocus ? qt(function() {
        p(d());
      }) : p(d()), n.addEventListener("focusin", y, !0), n.addEventListener("mousedown", b, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", b, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", S, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", T, {
        capture: !0,
        passive: !1
      }), o;
  }, k = function() {
    if (r.active)
      return n.removeEventListener("focusin", y, !0), n.removeEventListener("mousedown", b, !0), n.removeEventListener("touchstart", b, !0), n.removeEventListener("click", S, !0), n.removeEventListener("keydown", T, !0), o;
  };
  return o = {
    get active() {
      return r.active;
    },
    get paused() {
      return r.paused;
    },
    activate: function(f) {
      if (r.active)
        return this;
      var h = a(f, "onActivate"), g = a(f, "onPostActivate"), E = a(f, "checkCanFocusTrap");
      E || u(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = n.activeElement, h && h();
      var x = function() {
        E && u(), O(), g && g();
      };
      return E ? (E(r.containers.concat()).then(x, x), this) : (x(), this);
    },
    deactivate: function(f) {
      if (!r.active)
        return this;
      var h = Yt({
        onDeactivate: s.onDeactivate,
        onPostDeactivate: s.onPostDeactivate,
        checkCanReturnFocus: s.checkCanReturnFocus
      }, f);
      clearTimeout(r.delayInitialFocusTimer), r.delayInitialFocusTimer = void 0, k(), r.active = !1, r.paused = !1, jt.deactivateTrap(o);
      var g = a(h, "onDeactivate"), E = a(h, "onPostDeactivate"), x = a(h, "checkCanReturnFocus"), C = a(h, "returnFocus", "returnFocusOnDeactivate");
      g && g();
      var N = function() {
        qt(function() {
          C && p(m(r.nodeFocusedBeforeActivation)), E && E();
        });
      };
      return C && x ? (x(m(r.nodeFocusedBeforeActivation)).then(N, N), this) : (N(), this);
    },
    pause: function() {
      return r.paused || !r.active ? this : (r.paused = !0, k(), this);
    },
    unpause: function() {
      return !r.paused || !r.active ? this : (r.paused = !1, u(), O(), this);
    },
    updateContainerElements: function(f) {
      var h = [].concat(f).filter(Boolean);
      return r.containers = h.map(function(g) {
        return typeof g == "string" ? n.querySelector(g) : g;
      }), r.active && u(), this;
    }
  }, o.updateContainerElements(t), o;
};
function ni(e) {
  let t, i;
  window.addEventListener("focusin", () => {
    t = i, i = document.activeElement;
  }), e.magic("focus", (n) => {
    let s = n;
    return {
      __noscroll: !1,
      __wrapAround: !1,
      within(r) {
        return s = r, this;
      },
      withoutScrolling() {
        return this.__noscroll = !0, this;
      },
      noscroll() {
        return this.__noscroll = !0, this;
      },
      withWrapAround() {
        return this.__wrapAround = !0, this;
      },
      wrap() {
        return this.withWrapAround();
      },
      focusable(r) {
        return ft(r);
      },
      previouslyFocused() {
        return t;
      },
      lastFocused() {
        return t;
      },
      focused() {
        return i;
      },
      focusables() {
        return Array.isArray(s) ? s : ce(s, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(r) {
        let o = this.all();
        return o[0] && o[0].isSameNode(r);
      },
      isLast(r) {
        let o = this.all();
        return o.length && o.slice(-1)[0].isSameNode(r);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let r = this.all(), o = document.activeElement;
        if (r.indexOf(o) !== -1)
          return this.__wrapAround && r.indexOf(o) === r.length - 1 ? r[0] : r[r.indexOf(o) + 1];
      },
      getPrevious() {
        let r = this.all(), o = document.activeElement;
        if (r.indexOf(o) !== -1)
          return this.__wrapAround && r.indexOf(o) === 0 ? r.slice(-1)[0] : r[r.indexOf(o) - 1];
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
      focus(r) {
        r && setTimeout(() => {
          r.hasAttribute("tabindex") || r.setAttribute("tabindex", "0"), r.focus({ preventScroll: this.__noscroll });
        });
      }
    };
  }), e.directive("trap", e.skipDuringClone(
    (n, { expression: s, modifiers: r }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let c = a(s), d = !1, u = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => n
      };
      if (r.includes("noautofocus"))
        u.initialFocus = !1;
      else {
        let w = n.querySelector("[autofocus]");
        w && (u.initialFocus = w);
      }
      let p = ii(n, u), m = () => {
      }, b = () => {
      };
      const y = () => {
        m(), m = () => {
        }, b(), b = () => {
        }, p.deactivate({
          returnFocus: !r.includes("noreturn")
        });
      };
      o(() => c((w) => {
        d !== w && (w && !d && (r.includes("noscroll") && (b = si()), r.includes("inert") && (m = Gt(n)), setTimeout(() => {
          p.activate();
        }, 15)), !w && d && y(), d = !!w);
      })), l(y);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: s, modifiers: r }, { evaluate: o }) => {
      r.includes("inert") && o(s) && Gt(n);
    }
  ));
}
function Gt(e) {
  let t = [];
  return ue(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function ue(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? ue(e.parentNode, t) : t(i);
  });
}
function si() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var ri = ni;
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
function oi(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ai(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function li(e, t, i) {
  return t && ai(e.prototype, t), e;
}
var ci = Object.defineProperty, W = function(e, t) {
  return ci(e, "name", { value: t, configurable: !0 });
}, ui = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, di = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, fi = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, hi = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, pi = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, mi = W(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), nt = W(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), I = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, Y = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, Zt = { OUTLINE: "outline", FILLED: "filled" }, Nt = { FADE: "fade", SLIDE: "slide" }, st = { CLOSE: nt(ui), SUCCESS: nt(hi), ERROR: nt(di), WARNING: nt(pi), INFO: nt(fi) }, Kt = W(function(e) {
  e.wrapper.classList.add(I.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(I.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Xt = W(function(e) {
  e.wrapper.classList.remove(I.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), gi = W(function(e) {
  e.wrapper.classList.add(I.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(I.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), bi = W(function(e) {
  e.wrapper.classList.remove(I.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), de = function() {
  function e(t) {
    var i = this;
    oi(this, e), this.notifyOut = W(function(F) {
      F(i);
    }, "notifyOut");
    var n = t.notificationsGap, s = n === void 0 ? 20 : n, r = t.notificationsPadding, o = r === void 0 ? 20 : r, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, d = c === void 0 ? Nt.FADE : c, u = t.type, p = u === void 0 ? "outline" : u, m = t.title, b = t.text, y = t.showIcon, w = y === void 0 ? !0 : y, T = t.customIcon, S = T === void 0 ? "" : T, O = t.customClass, k = O === void 0 ? "" : O, v = t.speed, f = v === void 0 ? 500 : v, h = t.showCloseButton, g = h === void 0 ? !0 : h, E = t.autoclose, x = E === void 0 ? !0 : E, C = t.autotimeout, N = C === void 0 ? 3e3 : C, A = t.position, M = A === void 0 ? "right top" : A, L = t.customWrapper, U = L === void 0 ? "" : L;
    if (this.customWrapper = U, this.status = l, this.title = m, this.text = b, this.showIcon = w, this.customIcon = S, this.customClass = k, this.speed = f, this.effect = d, this.showCloseButton = g, this.autoclose = x, this.autotimeout = N, this.notificationsGap = s, this.notificationsPadding = o, this.type = p, this.position = M, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return li(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(I.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(I.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](I.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](I.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](I.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](I.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](I.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](I.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](I.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(I.NOTIFY_CLOSE), n.innerHTML = st.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = mi(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(I.NOTIFY), this.type) {
      case Zt.OUTLINE:
        this.wrapper.classList.add(I.NOTIFY_OUTLINE);
        break;
      case Zt.FILLED:
        this.wrapper.classList.add(I.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(I.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case Y.SUCCESS:
        this.wrapper.classList.add(I.NOTIFY_SUCCESS);
        break;
      case Y.ERROR:
        this.wrapper.classList.add(I.NOTIFY_ERROR);
        break;
      case Y.WARNING:
        this.wrapper.classList.add(I.NOTIFY_WARNING);
        break;
      case Y.INFO:
        this.wrapper.classList.add(I.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(I.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(I.NOTIFY_CONTENT);
    var n, s;
    this.title && (n = document.createElement("div"), n.classList.add(I.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(I.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(s);
  } }, { key: "setIcon", value: function() {
    var i = W(function(s) {
      switch (s) {
        case Y.SUCCESS:
          return st.SUCCESS;
        case Y.ERROR:
          return st.ERROR;
        case Y.WARNING:
          return st.WARNING;
        case Y.INFO:
          return st.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(I.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
  } }, { key: "setObserver", value: function() {
    var i = this, n = new IntersectionObserver(function(s) {
      if (s[0].intersectionRatio <= 0) i.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      n.observe(i.wrapper);
    }, this.speed);
  } }, { key: "notifyIn", value: function(t) {
    t(this);
  } }, { key: "autoClose", value: function() {
    var i = this;
    setTimeout(function() {
      i.close();
    }, this.autotimeout + this.speed);
  } }, { key: "close", value: function() {
    this.notifyOut(this.selectedNotifyOutEffect);
  } }, { key: "setEffect", value: function() {
    switch (this.effect) {
      case Nt.FADE:
        this.selectedNotifyInEffect = Kt, this.selectedNotifyOutEffect = Xt;
        break;
      case Nt.SLIDE:
        this.selectedNotifyInEffect = gi, this.selectedNotifyOutEffect = bi;
        break;
      default:
        this.selectedNotifyInEffect = Kt, this.selectedNotifyOutEffect = Xt;
    }
  } }]), e;
}();
W(de, "Notify");
var fe = de;
globalThis.Notify = fe;
const he = ["success", "error", "warning", "info"], pe = [
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
], me = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function rt(e = {}) {
  const t = {
    ...me,
    ...e
  };
  he.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), pe.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new fe(t);
}
const vi = {
  custom: rt,
  success(e, t = "Success", i = {}) {
    rt({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    rt({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    rt({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    rt({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(me, e);
  },
  get allowedStatuses() {
    return [...he];
  },
  get allowedPositions() {
    return [...pe];
  }
}, Rt = function() {
}, ot = {}, gt = {}, at = {};
function wi(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, s = n, r, o, a, l;
  for (r = function(c, d) {
    d.length && i.push(c), s--, s || t(i);
  }; n--; ) {
    if (o = e[n], a = gt[o], a) {
      r(o, a);
      continue;
    }
    l = at[o] = at[o] || [], l.push(r);
  }
}
function ge(e, t) {
  if (!e) return;
  const i = at[e];
  if (gt[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function Ft(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || Rt)(t) : (e.success || Rt)(e);
}
function yi(e, t, i, n, s, r, o, a) {
  let l = e.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (r += 1, r < o)
      return be(t, n, s, r);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function be(e, t, i, n) {
  const s = document, r = i.async, o = (i.numRetries || 0) + 1, a = i.before || Rt, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let d, u, p;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    p = s.createElement("link"), p.rel = "stylesheet", p.href = c, d = "hideFocus" in p, d && p.relList && (d = 0, p.rel = "preload", p.as = "style"), i.inlineStyleNonce && p.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    p = s.createElement("img"), p.src = c;
  else if (p = s.createElement("script"), p.src = c, p.async = r === void 0 ? !0 : r, i.inlineScriptNonce && p.setAttribute("nonce", i.inlineScriptNonce), u = "noModule" in p, /^module!/.test(l)) {
    if (!u) return t(e, "l");
    p.type = "module";
  } else if (/^nomodule!/.test(l) && u)
    return t(e, "l");
  const m = function(b) {
    yi(b, e, p, t, i, n, o, d);
  };
  p.addEventListener("load", m, { once: !0 }), p.addEventListener("error", m, { once: !0 }), a(e, p) !== !1 && s.head.appendChild(p);
}
function xi(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, s = [];
  function r(o, a, l) {
    if (a === "e" && s.push(o), a === "b")
      if (l) s.push(o);
      else return;
    n--, n || t(s);
  }
  for (let o = 0; o < e.length; o++)
    be(e[o], r, i);
}
function j(e, t, i) {
  let n, s;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), s = (n ? i : t) || {}, n) {
    if (n in ot)
      throw "LoadJS";
    ot[n] = !0;
  }
  function r(o, a) {
    xi(e, function(l) {
      Ft(s, l), o && Ft({ success: o, error: a }, l), ge(n, l);
    }, s);
  }
  if (s.returnPromise)
    return new Promise(r);
  r();
}
j.ready = function(t, i) {
  return wi(t, function(n) {
    Ft(i, n);
  }), j;
};
j.done = function(t) {
  ge(t, []);
};
j.reset = function() {
  Object.keys(ot).forEach((t) => delete ot[t]), Object.keys(gt).forEach((t) => delete gt[t]), Object.keys(at).forEach((t) => delete at[t]);
};
j.isDefined = function(t) {
  return t in ot;
};
function Ii(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return;
  }
  let t = null, i = null;
  if (typeof e == "string") {
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    if (i = e, t = document.getElementById(i), !t) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${i}" not found in the DOM.`);
      return;
    }
  } else if (e instanceof Element) {
    if (t = e, !t.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return;
    }
    i = t.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return;
  }
  const n = `[data-alpine-root="${i}"]`;
  let s = null;
  if (t.matches(n) ? s = t : s = t.querySelector(n), !s) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${n}" on or inside the wrapper element (ID: #${i}). Verify the 'data-alpine-root' attribute placement.`
    );
    return;
  }
  const r = Alpine.$data(s);
  if (r === void 0) {
    const o = `${s.tagName.toLowerCase()}${s.id ? "#" + s.id : ""}${s.classList.length ? "." + Array.from(s.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${o}) via 'data-alpine-root="${i}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return r;
}
function Ei(e) {
  e.data("rzAccordion", () => ({
    selected: "",
    // ID of the currently selected/opened section (if not allowMultiple)
    allowMultiple: !1,
    // Whether multiple sections can be open
    init() {
      this.allowMultiple = this.$el.dataset.multiple === "true";
    },
    destroy() {
    }
  }));
}
function Ti(e) {
  e.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const t = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (i, n) => {
        i !== t.sectionId && !t.allowMultiple && (t.open = !1);
      }) : console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
    },
    destroy() {
    },
    // Toggle the section's open state and update the parent's 'selected' state.
    toggle() {
      this.selected = this.sectionId, this.open = !this.open;
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
function Si(e) {
  e.data("rzAlert", () => ({
    parentElement: null,
    showAlert: !0,
    init() {
      const t = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
      this.parentElement = document.getElementById(t);
    },
    dismiss() {
      this.showAlert = !1;
      const t = this;
      setTimeout(() => {
        t.parentElement.style.display = "none";
      }, 205);
    }
  }));
}
function Ci(e) {
  e.data("rzBrowser", () => ({
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
  }));
}
function Oi(e) {
  e.data("rzCheckboxGroupItem", () => ({
    checkbox: null,
    isChecked: !1,
    init() {
      this.checkbox = this.$refs.chk, this.isChecked = this.checkbox.checked;
    },
    toggleCheckbox() {
      this.isChecked = this.checkbox.checked;
    },
    getIconCss() {
      return this.isChecked ? "" : "hidden";
    }
  }));
}
function ki(e, t) {
  e.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.codeid, s = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, t(i, {
        success: function() {
          const r = document.getElementById(n);
          window.hljs && r && window.hljs.highlightElement(r);
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, s);
    },
    // Function to check if code is NOT copied (for x-show)
    notCopied() {
      return !this.copied;
    },
    // Function to reset the copied state (e.g., on blur)
    disableCopied() {
      this.copied = !1;
    },
    // Function to toggle the expand state
    toggleExpand() {
      this.expand = !this.expand;
    },
    // Function to copy code to clipboard
    copyHTML() {
      navigator.clipboard.writeText(this.$refs.codeBlock.textContent), this.copied = !this.copied;
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
  }));
}
function Ni(e) {
  e.data("rzCollapsible", () => ({
    isOpen: !1,
    init() {
      this.isOpen = this.$el.dataset.defaultOpen === "true";
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    state() {
      return this.isOpen ? "open" : "closed";
    }
  }));
}
function Ai(e, t) {
  e.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    init() {
      const i = this.$el.dataset.config, n = document.getElementById(this.$el.dataset.uid + "-input");
      if (i) {
        const o = JSON.parse(i);
        o && (this.options = o.options || {}, this.placeholder = o.placeholder || "", this.prependText = o.prependText || "");
      }
      const s = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.nonce;
      t(s, {
        success: function() {
          window.flatpickr && n && window.flatpickr(n, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, r);
    }
  }));
}
const Dt = Math.min, J = Math.max, bt = Math.round, P = (e) => ({
  x: e,
  y: e
}), $i = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Li = {
  start: "end",
  end: "start"
};
function Jt(e, t, i) {
  return J(e, Dt(t, i));
}
function Tt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function K(e) {
  return e.split("-")[0];
}
function St(e) {
  return e.split("-")[1];
}
function ve(e) {
  return e === "x" ? "y" : "x";
}
function we(e) {
  return e === "y" ? "height" : "width";
}
function G(e) {
  return ["top", "bottom"].includes(K(e)) ? "y" : "x";
}
function ye(e) {
  return ve(G(e));
}
function Ri(e, t, i) {
  i === void 0 && (i = !1);
  const n = St(e), s = ye(e), r = we(s);
  let o = s === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[r] > t.floating[r] && (o = vt(o)), [o, vt(o)];
}
function Fi(e) {
  const t = vt(e);
  return [_t(e), t, _t(t)];
}
function _t(e) {
  return e.replace(/start|end/g, (t) => Li[t]);
}
function Di(e, t, i) {
  const n = ["left", "right"], s = ["right", "left"], r = ["top", "bottom"], o = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return i ? t ? s : n : t ? n : s;
    case "left":
    case "right":
      return t ? r : o;
    default:
      return [];
  }
}
function _i(e, t, i, n) {
  const s = St(e);
  let r = Di(K(e), i === "start", n);
  return s && (r = r.map((o) => o + "-" + s), t && (r = r.concat(r.map(_t)))), r;
}
function vt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => $i[t]);
}
function Mi(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function zi(e) {
  return typeof e != "number" ? Mi(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function wt(e) {
  const {
    x: t,
    y: i,
    width: n,
    height: s
  } = e;
  return {
    width: n,
    height: s,
    top: i,
    left: t,
    right: t + n,
    bottom: i + s,
    x: t,
    y: i
  };
}
function Qt(e, t, i) {
  let {
    reference: n,
    floating: s
  } = e;
  const r = G(t), o = ye(t), a = we(o), l = K(t), c = r === "y", d = n.x + n.width / 2 - s.width / 2, u = n.y + n.height / 2 - s.height / 2, p = n[a] / 2 - s[a] / 2;
  let m;
  switch (l) {
    case "top":
      m = {
        x: d,
        y: n.y - s.height
      };
      break;
    case "bottom":
      m = {
        x: d,
        y: n.y + n.height
      };
      break;
    case "right":
      m = {
        x: n.x + n.width,
        y: u
      };
      break;
    case "left":
      m = {
        x: n.x - s.width,
        y: u
      };
      break;
    default:
      m = {
        x: n.x,
        y: n.y
      };
  }
  switch (St(t)) {
    case "start":
      m[o] -= p * (i && c ? -1 : 1);
      break;
    case "end":
      m[o] += p * (i && c ? -1 : 1);
      break;
  }
  return m;
}
const Pi = async (e, t, i) => {
  const {
    placement: n = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: o
  } = i, a = r.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let c = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: s
  }), {
    x: d,
    y: u
  } = Qt(c, n, l), p = n, m = {}, b = 0;
  for (let y = 0; y < a.length; y++) {
    const {
      name: w,
      fn: T
    } = a[y], {
      x: S,
      y: O,
      data: k,
      reset: v
    } = await T({
      x: d,
      y: u,
      initialPlacement: n,
      placement: p,
      strategy: s,
      middlewareData: m,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = S ?? d, u = O ?? u, m = {
      ...m,
      [w]: {
        ...m[w],
        ...k
      }
    }, v && b <= 50 && (b++, typeof v == "object" && (v.placement && (p = v.placement), v.rects && (c = v.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: s
    }) : v.rects), {
      x: d,
      y: u
    } = Qt(c, p, l)), y = -1);
  }
  return {
    x: d,
    y: u,
    placement: p,
    strategy: s,
    middlewareData: m
  };
};
async function xe(e, t) {
  var i;
  t === void 0 && (t = {});
  const {
    x: n,
    y: s,
    platform: r,
    rects: o,
    elements: a,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: u = "floating",
    altBoundary: p = !1,
    padding: m = 0
  } = Tt(t, e), b = zi(m), w = a[p ? u === "floating" ? "reference" : "floating" : u], T = wt(await r.getClippingRect({
    element: (i = await (r.isElement == null ? void 0 : r.isElement(w))) == null || i ? w : w.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: d,
    strategy: l
  })), S = u === "floating" ? {
    x: n,
    y: s,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, O = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(a.floating)), k = await (r.isElement == null ? void 0 : r.isElement(O)) ? await (r.getScale == null ? void 0 : r.getScale(O)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, v = wt(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: O,
    strategy: l
  }) : S);
  return {
    top: (T.top - v.top + b.top) / k.y,
    bottom: (v.bottom - T.bottom + b.bottom) / k.y,
    left: (T.left - v.left + b.left) / k.x,
    right: (v.right - T.right + b.right) / k.x
  };
}
const Bi = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var i, n;
      const {
        placement: s,
        middlewareData: r,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = t, {
        mainAxis: d = !0,
        crossAxis: u = !0,
        fallbackPlacements: p,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: b = "none",
        flipAlignment: y = !0,
        ...w
      } = Tt(e, t);
      if ((i = r.arrow) != null && i.alignmentOffset)
        return {};
      const T = K(s), S = G(a), O = K(a) === a, k = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), v = p || (O || !y ? [vt(a)] : Fi(a)), f = b !== "none";
      !p && f && v.push(..._i(a, y, b, k));
      const h = [a, ...v], g = await xe(t, w), E = [];
      let x = ((n = r.flip) == null ? void 0 : n.overflows) || [];
      if (d && E.push(g[T]), u) {
        const L = Ri(s, o, k);
        E.push(g[L[0]], g[L[1]]);
      }
      if (x = [...x, {
        placement: s,
        overflows: E
      }], !E.every((L) => L <= 0)) {
        var C, N;
        const L = (((C = r.flip) == null ? void 0 : C.index) || 0) + 1, U = h[L];
        if (U) {
          var A;
          const R = u === "alignment" ? S !== G(U) : !1, z = ((A = x[0]) == null ? void 0 : A.overflows[0]) > 0;
          if (!R || z)
            return {
              data: {
                index: L,
                overflows: x
              },
              reset: {
                placement: U
              }
            };
        }
        let F = (N = x.filter((R) => R.overflows[0] <= 0).sort((R, z) => R.overflows[1] - z.overflows[1])[0]) == null ? void 0 : N.placement;
        if (!F)
          switch (m) {
            case "bestFit": {
              var M;
              const R = (M = x.filter((z) => {
                if (f) {
                  const H = G(z.placement);
                  return H === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  H === "y";
                }
                return !0;
              }).map((z) => [z.placement, z.overflows.filter((H) => H > 0).reduce((H, $e) => H + $e, 0)]).sort((z, H) => z[1] - H[1])[0]) == null ? void 0 : M[0];
              R && (F = R);
              break;
            }
            case "initialPlacement":
              F = a;
              break;
          }
        if (s !== F)
          return {
            reset: {
              placement: F
            }
          };
      }
      return {};
    }
  };
};
async function Wi(e, t) {
  const {
    placement: i,
    platform: n,
    elements: s
  } = e, r = await (n.isRTL == null ? void 0 : n.isRTL(s.floating)), o = K(i), a = St(i), l = G(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, d = r && l ? -1 : 1, u = Tt(t, e);
  let {
    mainAxis: p,
    crossAxis: m,
    alignmentAxis: b
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return a && typeof b == "number" && (m = a === "end" ? b * -1 : b), l ? {
    x: m * d,
    y: p * c
  } : {
    x: p * c,
    y: m * d
  };
}
const Vi = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var i, n;
      const {
        x: s,
        y: r,
        placement: o,
        middlewareData: a
      } = t, l = await Wi(t, e);
      return o === ((i = a.offset) == null ? void 0 : i.placement) && (n = a.arrow) != null && n.alignmentOffset ? {} : {
        x: s + l.x,
        y: r + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, Hi = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: i,
        y: n,
        placement: s
      } = t, {
        mainAxis: r = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (w) => {
            let {
              x: T,
              y: S
            } = w;
            return {
              x: T,
              y: S
            };
          }
        },
        ...l
      } = Tt(e, t), c = {
        x: i,
        y: n
      }, d = await xe(t, l), u = G(K(s)), p = ve(u);
      let m = c[p], b = c[u];
      if (r) {
        const w = p === "y" ? "top" : "left", T = p === "y" ? "bottom" : "right", S = m + d[w], O = m - d[T];
        m = Jt(S, m, O);
      }
      if (o) {
        const w = u === "y" ? "top" : "left", T = u === "y" ? "bottom" : "right", S = b + d[w], O = b - d[T];
        b = Jt(S, b, O);
      }
      const y = a.fn({
        ...t,
        [p]: m,
        [u]: b
      });
      return {
        ...y,
        data: {
          x: y.x - i,
          y: y.y - n,
          enabled: {
            [p]: r,
            [u]: o
          }
        }
      };
    }
  };
};
function Ct() {
  return typeof window < "u";
}
function et(e) {
  return Ie(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function $(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function V(e) {
  var t;
  return (t = (Ie(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Ie(e) {
  return Ct() ? e instanceof Node || e instanceof $(e).Node : !1;
}
function D(e) {
  return Ct() ? e instanceof Element || e instanceof $(e).Element : !1;
}
function B(e) {
  return Ct() ? e instanceof HTMLElement || e instanceof $(e).HTMLElement : !1;
}
function te(e) {
  return !Ct() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof $(e).ShadowRoot;
}
function ct(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: s
  } = _(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !["inline", "contents"].includes(s);
}
function Yi(e) {
  return ["table", "td", "th"].includes(et(e));
}
function Ot(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function zt(e) {
  const t = Pt(), i = D(e) ? _(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function ji(e) {
  let t = q(e);
  for (; B(t) && !tt(t); ) {
    if (zt(t))
      return t;
    if (Ot(t))
      return null;
    t = q(t);
  }
  return null;
}
function Pt() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function tt(e) {
  return ["html", "body", "#document"].includes(et(e));
}
function _(e) {
  return $(e).getComputedStyle(e);
}
function kt(e) {
  return D(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function q(e) {
  if (et(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    te(e) && e.host || // Fallback.
    V(e)
  );
  return te(t) ? t.host : t;
}
function Ee(e) {
  const t = q(e);
  return tt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : B(t) && ct(t) ? t : Ee(t);
}
function Te(e, t, i) {
  var n;
  t === void 0 && (t = []);
  const s = Ee(e), r = s === ((n = e.ownerDocument) == null ? void 0 : n.body), o = $(s);
  return r ? (Mt(o), t.concat(o, o.visualViewport || [], ct(s) ? s : [], [])) : t.concat(s, Te(s, []));
}
function Mt(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Se(e) {
  const t = _(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const s = B(e), r = s ? e.offsetWidth : i, o = s ? e.offsetHeight : n, a = bt(i) !== r || bt(n) !== o;
  return a && (i = r, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Ce(e) {
  return D(e) ? e : e.contextElement;
}
function Q(e) {
  const t = Ce(e);
  if (!B(t))
    return P(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: s,
    $: r
  } = Se(t);
  let o = (r ? bt(i.width) : i.width) / n, a = (r ? bt(i.height) : i.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const qi = /* @__PURE__ */ P(0);
function Oe(e) {
  const t = $(e);
  return !Pt() || !t.visualViewport ? qi : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Ui(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== $(e) ? !1 : t;
}
function lt(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const s = e.getBoundingClientRect(), r = Ce(e);
  let o = P(1);
  t && (n ? D(n) && (o = Q(n)) : o = Q(e));
  const a = Ui(r, i, n) ? Oe(r) : P(0);
  let l = (s.left + a.x) / o.x, c = (s.top + a.y) / o.y, d = s.width / o.x, u = s.height / o.y;
  if (r) {
    const p = $(r), m = n && D(n) ? $(n) : n;
    let b = p, y = Mt(b);
    for (; y && n && m !== b; ) {
      const w = Q(y), T = y.getBoundingClientRect(), S = _(y), O = T.left + (y.clientLeft + parseFloat(S.paddingLeft)) * w.x, k = T.top + (y.clientTop + parseFloat(S.paddingTop)) * w.y;
      l *= w.x, c *= w.y, d *= w.x, u *= w.y, l += O, c += k, b = $(y), y = Mt(b);
    }
  }
  return wt({
    width: d,
    height: u,
    x: l,
    y: c
  });
}
function Bt(e, t) {
  const i = kt(e).scrollLeft;
  return t ? t.left + i : lt(V(e)).left + i;
}
function ke(e, t, i) {
  i === void 0 && (i = !1);
  const n = e.getBoundingClientRect(), s = n.left + t.scrollLeft - (i ? 0 : (
    // RTL <body> scrollbar.
    Bt(e, n)
  )), r = n.top + t.scrollTop;
  return {
    x: s,
    y: r
  };
}
function Gi(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: s
  } = e;
  const r = s === "fixed", o = V(n), a = t ? Ot(t.floating) : !1;
  if (n === o || a && r)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = P(1);
  const d = P(0), u = B(n);
  if ((u || !u && !r) && ((et(n) !== "body" || ct(o)) && (l = kt(n)), B(n))) {
    const m = lt(n);
    c = Q(n), d.x = m.x + n.clientLeft, d.y = m.y + n.clientTop;
  }
  const p = o && !u && !r ? ke(o, l, !0) : P(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + d.x + p.x,
    y: i.y * c.y - l.scrollTop * c.y + d.y + p.y
  };
}
function Zi(e) {
  return Array.from(e.getClientRects());
}
function Ki(e) {
  const t = V(e), i = kt(e), n = e.ownerDocument.body, s = J(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), r = J(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Bt(e);
  const a = -i.scrollTop;
  return _(n).direction === "rtl" && (o += J(t.clientWidth, n.clientWidth) - s), {
    width: s,
    height: r,
    x: o,
    y: a
  };
}
function Xi(e, t) {
  const i = $(e), n = V(e), s = i.visualViewport;
  let r = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, o = s.height;
    const c = Pt();
    (!c || c && t === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  return {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
function Ji(e, t) {
  const i = lt(e, !0, t === "fixed"), n = i.top + e.clientTop, s = i.left + e.clientLeft, r = B(e) ? Q(e) : P(1), o = e.clientWidth * r.x, a = e.clientHeight * r.y, l = s * r.x, c = n * r.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function ee(e, t, i) {
  let n;
  if (t === "viewport")
    n = Xi(e, i);
  else if (t === "document")
    n = Ki(V(e));
  else if (D(t))
    n = Ji(t, i);
  else {
    const s = Oe(e);
    n = {
      x: t.x - s.x,
      y: t.y - s.y,
      width: t.width,
      height: t.height
    };
  }
  return wt(n);
}
function Ne(e, t) {
  const i = q(e);
  return i === t || !D(i) || tt(i) ? !1 : _(i).position === "fixed" || Ne(i, t);
}
function Qi(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = Te(e, []).filter((a) => D(a) && et(a) !== "body"), s = null;
  const r = _(e).position === "fixed";
  let o = r ? q(e) : e;
  for (; D(o) && !tt(o); ) {
    const a = _(o), l = zt(o);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || ct(o) && !l && Ne(e, o)) ? n = n.filter((d) => d !== o) : s = a, o = q(o);
  }
  return t.set(e, n), n;
}
function tn(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: s
  } = e;
  const o = [...i === "clippingAncestors" ? Ot(t) ? [] : Qi(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, d) => {
    const u = ee(t, d, s);
    return c.top = J(u.top, c.top), c.right = Dt(u.right, c.right), c.bottom = Dt(u.bottom, c.bottom), c.left = J(u.left, c.left), c;
  }, ee(t, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function en(e) {
  const {
    width: t,
    height: i
  } = Se(e);
  return {
    width: t,
    height: i
  };
}
function nn(e, t, i) {
  const n = B(t), s = V(t), r = i === "fixed", o = lt(e, !0, r, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = P(0);
  function c() {
    l.x = Bt(s);
  }
  if (n || !n && !r)
    if ((et(t) !== "body" || ct(s)) && (a = kt(t)), n) {
      const m = lt(t, !0, r, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
    } else s && c();
  r && !n && s && c();
  const d = s && !n && !r ? ke(s, a) : P(0), u = o.left + a.scrollLeft - l.x - d.x, p = o.top + a.scrollTop - l.y - d.y;
  return {
    x: u,
    y: p,
    width: o.width,
    height: o.height
  };
}
function At(e) {
  return _(e).position === "static";
}
function ie(e, t) {
  if (!B(e) || _(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return V(e) === i && (i = i.ownerDocument.body), i;
}
function Ae(e, t) {
  const i = $(e);
  if (Ot(e))
    return i;
  if (!B(e)) {
    let s = q(e);
    for (; s && !tt(s); ) {
      if (D(s) && !At(s))
        return s;
      s = q(s);
    }
    return i;
  }
  let n = ie(e, t);
  for (; n && Yi(n) && At(n); )
    n = ie(n, t);
  return n && tt(n) && At(n) && !zt(n) ? i : n || ji(e) || i;
}
const sn = async function(e) {
  const t = this.getOffsetParent || Ae, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: nn(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function rn(e) {
  return _(e).direction === "rtl";
}
const on = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Gi,
  getDocumentElement: V,
  getClippingRect: tn,
  getOffsetParent: Ae,
  getElementRects: sn,
  getClientRects: Zi,
  getDimensions: en,
  getScale: Q,
  isElement: D,
  isRTL: rn
}, yt = Vi, xt = Hi, It = Bi, Et = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), s = {
    platform: on,
    ...i
  }, r = {
    ...s.platform,
    _c: n
  };
  return Pi(e, t, {
    ...s,
    platform: r
  });
};
function an(e) {
  e.data("rzDropdownMenu", () => ({
    // --- STATE ---
    open: !1,
    isModal: !0,
    ariaExpanded: "false",
    trapActive: !1,
    focusedIndex: null,
    menuItems: [],
    parentEl: null,
    triggerEl: null,
    contentEl: null,
    anchor: "bottom",
    pixelOffset: 3,
    isSubmenuActive: !1,
    navThrottle: 100,
    _lastNavAt: 0,
    selfId: null,
    // --- INIT ---
    init() {
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentEl = this.$el, this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.anchor = this.$el.dataset.anchor || "bottom", this.pixelOffset = parseInt(this.$el.dataset.offset) || 6, this.isModal = this.$el.dataset.modal !== "false", this.$watch("open", (t) => {
        t ? (this._lastNavAt = 0, this.$nextTick(() => {
          this.updatePosition(), this.menuItems = Array.from(
            this.contentEl.querySelectorAll(
              '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
            )
          );
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open", this.trapActive = this.isModal) : (this.focusedIndex = null, this.closeAllSubmenus(), this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.trapActive = !1);
      });
    },
    // --- METHODS ---
    updatePosition() {
      !this.triggerEl || !this.contentEl || Et(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [yt(this.pixelOffset), It(), xt({ padding: 8 })]
      }).then(({ x: t, y: i }) => {
        Object.assign(this.contentEl.style, { left: `${t}px`, top: `${i}px` });
      });
    },
    toggle() {
      this.open ? (this.open = !1, this.$nextTick(() => this.triggerEl?.focus())) : (this.open = !0, this.focusedIndex = -1);
    },
    handleOutsideClick() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleTriggerKeydown(t) {
      ["Enter", " ", "ArrowDown", "ArrowUp"].includes(t.key) && (t.preventDefault(), this.open = !0, this.$nextTick(() => {
        t.key === "ArrowUp" ? this.focusLastItem() : this.focusFirstItem();
      }));
    },
    focusNextItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    focusPreviousItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
    },
    focusFirstItem() {
      this.menuItems.length && (this.focusedIndex = 0, this.focusCurrentItem());
    },
    focusLastItem() {
      this.menuItems.length && (this.focusedIndex = this.menuItems.length - 1, this.focusCurrentItem());
    },
    focusCurrentItem() {
      this.focusedIndex !== null && this.menuItems[this.focusedIndex] && this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
    },
    focusSelectedItem(t) {
      if (!t || t.getAttribute("aria-disabled") === "true" || t.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(t);
      i !== -1 && (this.focusedIndex = i, t.focus());
    },
    handleItemClick(t) {
      const i = t.currentTarget;
      if (!(i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled"))) {
        if (i.getAttribute("aria-haspopup") === "menu") {
          e.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.open = !1, this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(t) {
      const i = t.currentTarget;
      this.focusSelectedItem(i), i.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
    },
    handleWindowEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleContentTabKey() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleTriggerMouseover() {
      this.$nextTick(() => this.$el.firstChild?.focus());
    },
    closeAllSubmenus() {
      this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]').forEach((i) => {
        e.$data(i)?.closeSubmenu();
      }), this.isSubmenuActive = !1;
    }
  })), e.data("rzDropdownSubmenu", () => ({
    // --- STATE ---
    open: !1,
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
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentDropdown = e.$data(this.$el.closest('[x-data^="rzDropdownMenu"]')), this.triggerEl = this.$refs.subTrigger, this.siblingContainer = this.$el.parentElement, this.anchor = this.$el.dataset.subAnchor || this.anchor, this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset, this.$watch("open", (t) => {
        t ? (this._lastNavAt = 0, this.parentDropdown.isSubmenuActive = !0, this.$nextTick(() => {
          const i = this.$refs.subContent;
          this.updatePosition(i), this.menuItems = Array.from(i.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open") : (this.focusedIndex = null, this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.$nextTick(() => {
          this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]') || (this.parentDropdown.isSubmenuActive = !1);
        }));
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || Et(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [yt(this.pixelOffset), It(), xt({ padding: 8 })]
      }).then(({ x: i, y: n }) => {
        Object.assign(t.style, { left: `${i}px`, top: `${n}px` });
      });
    },
    handleTriggerMouseEnter() {
      clearTimeout(this.closeTimeout), this.triggerEl.focus(), this.openSubmenu();
    },
    handleTriggerMouseLeave() {
      this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
    },
    handleContentMouseEnter() {
      clearTimeout(this.closeTimeout);
    },
    handleContentMouseLeave() {
      const t = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      t && Array.from(t).some((n) => e.$data(n)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(t = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, t && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((i) => {
        e.$data(i)?.closeSubmenu();
      }), this.open = !1;
    },
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (i) => i.hasAttribute("x-data") && i.getAttribute("x-data").startsWith("rzDropdownSubmenu") && i.id !== this.selfId
      ).forEach((i) => {
        e.$data(i)?.closeSubmenu();
      });
    },
    toggleSubmenu() {
      this.open ? this.closeSubmenu() : this.openSubmenu();
    },
    openSubmenuAndFocusFirst() {
      this.openSubmenu(!0);
    },
    handleTriggerKeydown(t) {
      ["ArrowRight", "Enter", " "].includes(t.key) && (t.preventDefault(), this.openSubmenuAndFocusFirst());
    },
    focusNextItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    focusPreviousItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
    },
    focusFirstItem() {
      this.menuItems.length && (this.focusedIndex = 0, this.focusCurrentItem());
    },
    focusLastItem() {
      this.menuItems.length && (this.focusedIndex = this.menuItems.length - 1, this.focusCurrentItem());
    },
    focusCurrentItem() {
      this.focusedIndex !== null && this.menuItems[this.focusedIndex] && this.menuItems[this.focusedIndex].focus();
    },
    handleItemClick(t) {
      const i = t.currentTarget;
      if (!(i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled"))) {
        if (i.getAttribute("aria-haspopup") === "menu") {
          e.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.parentDropdown.open = !1, this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(t) {
      const i = t.currentTarget;
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      const n = this.menuItems.indexOf(i);
      n !== -1 && (this.focusedIndex = n, i.focus()), i.getAttribute("aria-haspopup") === "menu" ? e.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
    },
    handleSubmenuEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleSubmenuArrowLeft() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function ln(e) {
  e.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const t = typeof window < "u" && "localStorage" in window, i = ["light", "dark", "auto"], n = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let s = "auto";
      t && (s = localStorage.getItem("darkMode") ?? "auto", i.includes(s) || (s = "light")), t && localStorage.setItem("darkMode", s), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          s === "dark" || s === "auto" && n
        );
      }, this.applyTheme(), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.applyTheme);
    },
    // Returns true if dark mode should be active
    isDark() {
      const t = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return localStorage.getItem("darkMode"), this.mode === "dark" || this.mode === "auto" && t;
    },
    // Returns true if light mode should be active
    isLight() {
      return !this.isDark();
    },
    // Toggle the dark mode setting and dispatch a custom event
    toggle() {
      let t = localStorage.getItem("darkMode");
      const i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      t === "light" ? t = "dark" : t === "dark" ? t = "light" : t === "auto" && (t = i ? "light" : "dark"), this.mode = t, localStorage.setItem("darkMode", t);
      const n = t === "dark" || t === "auto" && i;
      document.documentElement.classList.toggle("dark", n);
      const s = new CustomEvent("darkModeToggle", {
        detail: { darkMode: n }
      });
      window.dispatchEvent(s);
    },
    destroy() {
      this.applyTheme && window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.applyTheme);
    }
  }));
}
function cn(e) {
  e.data("rzEmbeddedPreview", () => ({
    iframe: null,
    onDarkModeToggle: null,
    init() {
      try {
        this.iframe = this.$refs.iframe;
        const t = this.debounce(() => {
          this.resizeIframe(this.iframe);
        }, 50);
        this.resizeIframe(this.iframe), new ResizeObserver((s) => {
          for (let r of s)
            t();
        }).observe(this.iframe);
        const n = this.iframe;
        this.onDarkModeToggle = (s) => {
          n.contentWindow.postMessage(s.detail, "*");
        }, window.addEventListener("darkModeToggle", this.onDarkModeToggle);
      } catch {
        console.error("Cannot access iframe content");
      }
    },
    // Adjusts the iframe height based on its content
    resizeIframe(t) {
      if (t)
        try {
          const i = t.contentDocument || t.contentWindow?.document;
          if (i) {
            const n = i.body;
            if (!n)
              setInterval(() => {
                this.resizeIframe(t);
              }, 150);
            else {
              const s = n.scrollHeight + 15;
              t.style.height = s + "px";
            }
          }
        } catch (i) {
          console.error("Error resizing iframe:", i);
        }
    },
    // Debounce helper to limit function calls
    debounce(t, i = 300) {
      let n;
      return (...s) => {
        clearTimeout(n), n = setTimeout(() => {
          t.apply(this, s);
        }, i);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function un(e) {
  e.data("rzEmpty", () => {
  });
}
function dn(e) {
  e.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const t = this;
      if (typeof this.setCurrentHeading == "function") {
        const i = (s, r) => {
          s.forEach((o) => {
            o.isIntersecting && t.setCurrentHeading(t.headingId);
          });
        }, n = { threshold: 0.5 };
        this.observer = new IntersectionObserver(i, n), this.observer.observe(this.$el);
      } else
        console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
    },
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function fn(e) {
  e.data("rzIndicator", () => ({
    visible: !1,
    init() {
      const t = this.$el.dataset.color;
      t ? this.$el.style.backgroundColor = t : this.$el.style.backgroundColor = "var(--color-success)", this.$el.dataset.visible === "true" && (this.visible = !0);
    },
    notVisible() {
      return !this.visible;
    },
    setVisible(t) {
      this.visible = t;
    }
  }));
}
function hn(e, t) {
  e.data("rzMarkdown", () => ({
    init() {
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.nonce;
      t(i, {
        success: function() {
          window.hljs.highlightAll();
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, n);
    }
  }));
}
function pn(e) {
  e.data("rzModal", () => ({
    modalOpen: !1,
    // Main state variable
    eventTriggerName: "",
    closeEventName: "rz:modal-close",
    // Default value, corresponds to Constants.Events.ModalClose
    closeOnEscape: !0,
    closeOnClickOutside: !0,
    modalId: "",
    bodyId: "",
    footerId: "",
    nonce: "",
    _escapeListener: null,
    _openListener: null,
    _closeEventListener: null,
    init() {
      this.modalId = this.$el.dataset.modalId || "", this.bodyId = this.$el.dataset.bodyId || "", this.footerId = this.$el.dataset.footerId || "", this.nonce = this.$el.dataset.nonce || "", this.eventTriggerName = this.$el.dataset.eventTriggerName || "", this.closeEventName = this.$el.dataset.closeEventName || this.closeEventName, this.closeOnEscape = this.$el.dataset.closeOnEscape !== "false", this.closeOnClickOutside = this.$el.dataset.closeOnClickOutside !== "false", this.$el.dispatchEvent(new CustomEvent("rz:modal-initialized", {
        detail: { modalId: this.modalId, bodyId: this.bodyId, footerId: this.footerId },
        bubbles: !0
      })), this.eventTriggerName && (this._openListener = (t) => {
        this.openModal(t);
      }, window.addEventListener(this.eventTriggerName, this._openListener)), this._closeEventListener = (t) => {
        this.modalOpen && this.closeModalInternally("event");
      }, window.addEventListener(this.closeEventName, this._closeEventListener), this._escapeListener = (t) => {
        this.modalOpen && this.closeOnEscape && t.key === "Escape" && this.closeModalInternally("escape");
      }, window.addEventListener("keydown", this._escapeListener), this.$watch("modalOpen", (t) => {
        const i = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", t);
        const n = document.body.offsetWidth - i;
        document.body.style.setProperty("--page-scrollbar-width", `${n}px`), t ? this.$nextTick(() => {
          this.$el.querySelector('[role="document"]')?.querySelector(`button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex="-1"])`)?.focus(), this.$el.dispatchEvent(new CustomEvent("rz:modal-after-open", {
            detail: { modalId: this.modalId },
            bubbles: !0
          }));
        }) : this.$nextTick(() => {
          this.$el.dispatchEvent(new CustomEvent("rz:modal-after-close", {
            detail: { modalId: this.modalId },
            bubbles: !0
          }));
        });
      });
    },
    notModalOpen() {
      return !this.modalOpen;
    },
    destroy() {
      this._openListener && this.eventTriggerName && window.removeEventListener(this.eventTriggerName, this._openListener), this._closeEventListener && window.removeEventListener(this.closeEventName, this._closeEventListener), this._escapeListener && window.removeEventListener("keydown", this._escapeListener), document.body.classList.remove("overflow-hidden"), document.body.style.setProperty("--page-scrollbar-width", "0px");
    },
    openModal(t = null) {
      const i = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: t },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(i), i.defaultPrevented || (this.modalOpen = !0);
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(t = "unknown") {
      const i = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason: t },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(i), i.defaultPrevented || (document.activeElement?.blur && document.activeElement.blur(), this.modalOpen = !1, document.body.classList.remove("overflow-hidden"), document.body.style.setProperty("--page-scrollbar-width", "0px"));
    },
    // Called only by the explicit close button in the template
    closeModal() {
      this.closeModalInternally("button");
    },
    // Method called by x-on:click.outside on the dialog element
    handleClickOutside() {
      this.closeOnClickOutside && this.closeModalInternally("backdrop");
    }
  }));
}
function mn(e, t) {
  e.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: !1,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: !1,
    /* ---------- helpers ---------- */
    _triggerIndex(i) {
      return this.list ? Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]')).findIndex((s) => s.getAttribute("x-ref") === `trigger_${i}`) : -1;
    },
    _contentEl(i) {
      return document.getElementById(`${i}-content`);
    },
    /* ---------- lifecycle ---------- */
    init() {
      this.$el.querySelectorAll("[data-popover]").forEach((n) => {
        n.style.display = "none";
      }), this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },
    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(i) {
      const n = i.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.activeItemId === n && this.open ? this.closeMenu() : this.openMenu(n);
    },
    handleTriggerEnter(i) {
      const n = i.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose(), this.activeItemId !== n && !this.isClosing && requestAnimationFrame(() => this.openMenu(n));
    },
    handleItemEnter(i) {
      const n = i.currentTarget;
      if (!n) return;
      this.cancelClose();
      const s = n.querySelector('[x-ref^="trigger_"]');
      if (s) {
        const r = s.getAttribute("x-ref").replace("trigger_", "");
        this.activeItemId !== r && !this.isClosing && requestAnimationFrame(() => this.openMenu(r));
      } else
        this.open && !this.isClosing && this.closeMenu();
    },
    handleContentEnter() {
      this.cancelClose();
    },
    scheduleClose() {
      this.isClosing || this.closeTimeout || (this.closeTimeout = setTimeout(() => this.closeMenu(), 150));
    },
    cancelClose() {
      this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null), this.isClosing = !1;
    },
    /* ---------- open / close logic with direct DOM manipulation ---------- */
    openMenu(i) {
      this.cancelClose(), this.isClosing = !1;
      const n = this._triggerIndex(i), s = n > (this.prevIndex ?? n) ? "end" : "start", r = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== i) {
        const l = this.$refs[`trigger_${this.activeItemId}`];
        l && delete l.dataset.state;
        const c = this._contentEl(this.activeItemId);
        if (c) {
          const d = s === "end" ? "start" : "end";
          c.setAttribute("data-motion", `to-${d}`), setTimeout(() => {
            c.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = i, this.open = !0, this.prevIndex = n;
      const o = this.$refs[`trigger_${i}`], a = this._contentEl(i);
      !o || !a || (Et(o, a, {
        placement: "bottom-start",
        middleware: [yt(6), It(), xt({ padding: 8 })]
      }).then(({ x: l, y: c }) => {
        Object.assign(a.style, { left: `${l}px`, top: `${c}px` });
      }), a.style.display = "block", r ? a.setAttribute("data-motion", "fade-in") : a.setAttribute("data-motion", `from-${s}`), this.$nextTick(() => {
        o.setAttribute("aria-expanded", "true"), o.dataset.state = "open";
      }));
    },
    closeMenu() {
      if (!this.open || this.isClosing) return;
      this.isClosing = !0, this.cancelClose();
      const i = this.activeItemId;
      if (!i) {
        this.isClosing = !1;
        return;
      }
      const n = this.$refs[`trigger_${i}`];
      n && (n.setAttribute("aria-expanded", "false"), delete n.dataset.state);
      const s = this._contentEl(i);
      s && (s.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        s.style.display = "none";
      }, 150)), this.open = !1, this.activeItemId = null, this.prevIndex = null, setTimeout(() => {
        this.isClosing = !1;
      }, 150);
    }
  }));
}
function gn(e) {
  e.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    init() {
      this.triggerEl = this.$refs.trigger.children[0] || this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (t) => {
        this.ariaExpanded = t.toString(), t && this.$nextTick(() => this.updatePosition());
      });
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const t = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, s = parseInt(this.$el.dataset.alignmentAxisOffset) || 0, r = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(yt({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: s
      })), o && c.push(It()), a && c.push(xt({ padding: l })), Et(this.triggerEl, this.contentEl, {
        placement: t,
        strategy: r,
        middleware: c
      }).then(({ x: d, y: u }) => {
        Object.assign(this.contentEl.style, {
          left: `${d}px`,
          top: `${u}px`
        });
      });
    },
    toggle() {
      this.open = !this.open;
    },
    handleOutsideClick() {
      this.open && (this.open = !1);
    },
    handleWindowEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function bn(e) {
  e.data("rzPrependInput", () => ({
    prependContainer: null,
    textInput: null,
    init() {
      this.prependContainer = this.$refs.prependContainer, this.textInput = this.$refs.textInput;
      let t = this;
      setTimeout(() => {
        t.updatePadding();
      }, 50), window.addEventListener("resize", this.updatePadding);
    },
    destroy() {
      window.removeEventListener("resize", this.updatePadding);
    },
    updatePadding() {
      const t = this.prependContainer, i = this.textInput;
      if (!t || !i) {
        i && i.classList.remove("text-transparent");
        return;
      }
      const s = t.offsetWidth + 10;
      i.style.paddingLeft = s + "px", i.classList.remove("text-transparent");
    }
  }));
}
function vn(e) {
  e.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const t = this.$el;
      this.currentVal = parseInt(t.getAttribute("data-current-val")) || 0, this.minVal = parseInt(t.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(t.getAttribute("data-max-val")) || 100, this.label = t.getAttribute("data-label"), this.calculatePercentage(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuemin", this.minVal), t.setAttribute("aria-valuemax", this.maxVal), t.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((n) => {
        this.updateProgressBar();
      }).observe(t), this.$watch("currentVal", () => {
        this.calculatePercentage(), this.updateProgressBar(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuetext", `${this.percentage}%`);
      });
    },
    calculatePercentage() {
      this.maxVal === this.minVal ? this.percentage = 0 : this.percentage = Math.min(Math.max((this.currentVal - this.minVal) / (this.maxVal - this.minVal) * 100, 0), 100);
    },
    buildLabel() {
      var t = this.label || "{percent}%";
      return this.calculatePercentage(), t.replace("{percent}", this.percentage);
    },
    buildInsideLabelPosition() {
      const t = this.$refs.progressBar, i = this.$refs.progressBarLabel, n = this.$refs.innerLabel;
      i && t && n && (n.innerText = this.buildLabel(), i.clientWidth > t.clientWidth ? i.style.left = t.clientWidth + 10 + "px" : i.style.left = t.clientWidth / 2 - i.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const t = this.$refs.progressBarLabel, i = this.$refs.progressBar;
      return t && i && t.clientWidth > i.clientWidth ? "text-foreground dark:text-foreground" : "";
    },
    updateProgressBar() {
      const t = this.$refs.progressBar;
      t && (t.style.width = `${this.percentage}%`, this.buildInsideLabelPosition());
    },
    // Methods to set, increment, or decrement the progress value
    setProgress(t) {
      this.currentVal = t;
    },
    increment(t = 1) {
      this.currentVal = Math.min(this.currentVal + t, this.maxVal);
    },
    decrement(t = 1) {
      this.currentVal = Math.max(this.currentVal - t, this.minVal);
    }
  }));
}
function wn(e) {
  e.data("rzQuickReferenceContainer", () => ({
    headings: [],
    // Array of heading IDs
    currentHeadingId: "",
    // ID of the currently highlighted heading
    // Initializes the component with headings and the initial current heading from data attributes.
    init() {
      this.headings = JSON.parse(this.$el.dataset.headings || "[]"), this.currentHeadingId = this.$el.dataset.currentheadingid || "";
    },
    // Handles click events on quick reference links.
    handleHeadingClick() {
      const t = this.$el.dataset.headingid;
      window.requestAnimationFrame(() => {
        this.currentHeadingId = t;
      });
    },
    // Sets the current heading ID based on intersection observer events from rzHeading.
    setCurrentHeading(t) {
      this.headings.includes(t) && (this.currentHeadingId = t);
    },
    // Provides CSS classes for a link based on whether it's the current heading.
    // Returns an object suitable for :class binding.
    getSelectedCss() {
      const t = this.$el.dataset.headingid;
      return {
        "font-bold": this.currentHeadingId === t
        // Apply 'font-bold' if current
      };
    },
    // Determines the value for the aria-current attribute.
    getSelectedAriaCurrent() {
      const t = this.$el.dataset.headingid;
      return this.currentHeadingId === t ? "true" : null;
    }
  }));
}
function yn(e) {
  e.data("rzSheet", () => ({
    open: !1,
    init() {
      this.open = this.$el.dataset.defaultOpen === "true";
    },
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = !1;
    },
    show() {
      this.open = !0;
    },
    state() {
      return this.open ? "open" : "closed";
    }
  }));
}
function xn(e) {
  e.data("rzTabs", () => ({
    buttonRef: null,
    tabSelected: "",
    tabButton: null,
    init() {
      this.buttonRef = document.getElementById(this.$el.dataset.buttonref), this.tabSelected = this.$el.dataset.tabselected, this.tabButton = this.buttonRef.querySelector("[data-name='" + this.tabSelected + "']"), this.tabRepositionMarker(this.tabButton);
    },
    tabButtonClicked(t) {
      t instanceof Event && (t = t.target), this.tabSelected = t.dataset.name, this.tabRepositionMarker(t), t.focus();
    },
    tabRepositionMarker(t) {
      this.tabButton = t, this.$refs.tabMarker.style.width = t.offsetWidth + "px", this.$refs.tabMarker.style.height = t.offsetHeight + "px", this.$refs.tabMarker.style.left = t.offsetLeft + "px", setTimeout(() => {
        this.$refs.tabMarker.style.opacity = 1;
      }, 150);
    },
    // Get the CSS classes for the tab content panel based on selection
    getTabContentCss() {
      return this.tabSelected === this.$el.dataset.name ? "" : "hidden";
    },
    tabContentActive(t) {
      return t = t ?? this.$el, this.tabSelected === t.dataset.name;
    },
    tabButtonActive(t) {
      return t = t ?? this.$el, this.tabSelected === t.dataset.name;
    },
    // Get the value for the aria-selected attribute
    getTabButtonAriaSelected() {
      return this.tabSelected === this.$el.dataset.name ? "true" : "false";
    },
    // Get the CSS classes for the tab button text color based on selection
    getSelectedTabTextColorCss() {
      const t = this.$el.dataset.selectedtextcolor ?? "";
      return this.tabSelected === this.$el.dataset.name ? t : "";
    },
    handleResize() {
      this.tabRepositionMarker(this.tabButton);
    },
    handleKeyDown(t) {
      const i = t.key, n = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), s = n.findIndex((o) => this.tabSelected === o.dataset.name);
      let r = s;
      i === "ArrowRight" ? (r = (s + 1) % n.length, t.preventDefault()) : i === "ArrowLeft" ? (r = (s - 1 + n.length) % n.length, t.preventDefault()) : i === "Home" ? (r = 0, t.preventDefault()) : i === "End" && (r = n.length - 1, t.preventDefault()), r !== s && this.tabButtonClicked(n[r]);
    }
  }));
}
function In(e) {
  e.data("rzSidebar", () => ({
    open: !1,
    openMobile: !1,
    isMobile: !1,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas", this.shortcut = this.$el.dataset.shortcut || "b", this.cookieName = this.$el.dataset.cookieName || "sidebar_state", this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const t = this.cookieName ? document.cookie.split("; ").find((n) => n.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, i = this.$el.dataset.defaultOpen === "true";
      this.open = t !== null ? t === "true" : i, this.checkIfMobile(), window.addEventListener("resize", () => this.checkIfMobile()), window.addEventListener("keydown", (n) => {
        (n.ctrlKey || n.metaKey) && n.key.toLowerCase() === this.shortcut.toLowerCase() && (n.preventDefault(), this.toggle());
      }), this.$watch("open", (n) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${n}; path=/; max-age=31536000`);
      });
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < this.mobileBreakpoint;
    },
    toggle() {
      this.isMobile ? this.openMobile = !this.openMobile : this.open = !this.open;
    },
    close() {
      this.isMobile && (this.openMobile = !1);
    },
    isMobileOpen() {
      return this.openMobile;
    },
    desktopState() {
      return this.open ? "expanded" : "collapsed";
    },
    mobileState() {
      return this.openMobile ? "open" : "closed";
    },
    getCollapsibleAttribute() {
      return this.desktopState() === "collapsed" ? this.collapsible : "";
    }
  }));
}
async function En(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ht(e, t, i) {
  En(e).then((n) => {
    j.isDefined(n) || j(
      e,
      n,
      {
        async: !1,
        inlineScriptNonce: i,
        inlineStyleNonce: i
      }
    ), j.ready([n], t);
  });
}
function Tn(e) {
  Ei(e), Ti(e), Si(e), Ci(e), Oi(e), ki(e, ht), Ni(e), Ai(e, ht), an(e), ln(e), cn(e), un(e), dn(e), fn(e), hn(e, ht), mn(e), pn(e), gn(e), bn(e), vn(e), wn(e), yn(e), xn(e), In(e);
}
X.plugin(Re);
X.plugin(ze);
X.plugin(ri);
Tn(X);
const Sn = {
  Alpine: X,
  require: ht,
  toast: vi,
  $data: Ii
};
window.Alpine = X;
window.Rizzy = { ...window.Rizzy || {}, ...Sn };
X.start();
export {
  Sn as default
};
