import F from "alpinejs";
function Re(i) {
  i.directive("collapse", e), e.inline = (t, { modifiers: n }) => {
    n.includes("min") && (t._x_doShow = () => {
    }, t._x_doHide = () => {
    });
  };
  function e(t, { modifiers: n }) {
    let r = se(n, "duration", 250) / 1e3, s = se(n, "min", 0), a = !n.includes("min");
    t._x_isShown || (t.style.height = `${s}px`), !t._x_isShown && a && (t.hidden = !0), t._x_isShown || (t.style.overflow = "hidden");
    let d = (u, p) => {
      let h = i.setStyles(u, p);
      return p.height ? () => {
      } : h;
    }, c = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    t._x_transition = {
      in(u = () => {
      }, p = () => {
      }) {
        a && (t.hidden = !1), a && (t.style.display = null);
        let h = t.getBoundingClientRect().height;
        t.style.height = "auto";
        let f = t.getBoundingClientRect().height;
        h === f && (h = s), i.transition(t, i.setStyles, {
          during: c,
          start: { height: h + "px" },
          end: { height: f + "px" }
        }, () => t._x_isShown = !0, () => {
          Math.abs(t.getBoundingClientRect().height - f) < 1 && (t.style.overflow = null);
        });
      },
      out(u = () => {
      }, p = () => {
      }) {
        let h = t.getBoundingClientRect().height;
        i.transition(t, d, {
          during: c,
          start: { height: h + "px" },
          end: { height: s + "px" }
        }, () => t.style.overflow = "hidden", () => {
          t._x_isShown = !1, t.style.height == `${s}px` && a && (t.style.display = "none", t.hidden = !0);
        });
      }
    };
  }
}
function se(i, e, t) {
  if (i.indexOf(e) === -1)
    return t;
  const n = i[i.indexOf(e) + 1];
  if (!n)
    return t;
  if (e === "duration") {
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  if (e === "min") {
    let r = n.match(/([0-9]+)px/);
    if (r)
      return r[1];
  }
  return n;
}
var Fe = Re;
function $e(i) {
  i.directive("intersect", i.skipDuringClone((e, { value: t, expression: n, modifiers: r }, { evaluateLater: s, cleanup: a }) => {
    let d = s(n), c = {
      rootMargin: ze(r),
      threshold: De(r)
    }, u = new IntersectionObserver((p) => {
      p.forEach((h) => {
        h.isIntersecting !== (t === "leave") && (d(), r.includes("once") && u.disconnect());
      });
    }, c);
    u.observe(e), a(() => {
      u.disconnect();
    });
  }));
}
function De(i) {
  if (i.includes("full"))
    return 0.99;
  if (i.includes("half"))
    return 0.5;
  if (!i.includes("threshold"))
    return 0;
  let e = i[i.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function Ae(i) {
  let e = i.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function ze(i) {
  const e = "margin", t = "0px 0px 0px 0px", n = i.indexOf(e);
  if (n === -1)
    return t;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Ae(i[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : t;
}
var _e = $e, be = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Z = /* @__PURE__ */ be.join(","), ge = typeof Element > "u", R = ge ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, te = !ge && Element.prototype.getRootNode ? function(i) {
  return i.getRootNode();
} : function(i) {
  return i.ownerDocument;
}, me = function(e, t, n) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(Z));
  return t && R.call(e, Z) && r.unshift(e), r = r.filter(n), r;
}, we = function i(e, t, n) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var a = s.shift();
    if (a.tagName === "SLOT") {
      var d = a.assignedElements(), c = d.length ? d : a.children, u = i(c, !0, n);
      n.flatten ? r.push.apply(r, u) : r.push({
        scope: a,
        candidates: u
      });
    } else {
      var p = R.call(a, Z);
      p && n.filter(a) && (t || !e.includes(a)) && r.push(a);
      var h = a.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(a), f = !n.shadowRootFilter || n.shadowRootFilter(a);
      if (h && f) {
        var E = i(h === !0 ? a.children : h.children, !0, n);
        n.flatten ? r.push.apply(r, E) : r.push({
          scope: a,
          candidates: E
        });
      } else
        s.unshift.apply(s, a.children);
    }
  }
  return r;
}, ye = function(e, t) {
  return e.tabIndex < 0 && (t || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Me = function(e, t) {
  return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, Ee = function(e) {
  return e.tagName === "INPUT";
}, Pe = function(e) {
  return Ee(e) && e.type === "hidden";
}, Be = function(e) {
  var t = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return t;
}, We = function(e, t) {
  for (var n = 0; n < e.length; n++)
    if (e[n].checked && e[n].form === t)
      return e[n];
}, Ye = function(e) {
  if (!e.name)
    return !0;
  var t = e.form || te(e), n = function(d) {
    return t.querySelectorAll('input[type="radio"][name="' + d + '"]');
  }, r;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    r = n(window.CSS.escape(e.name));
  else
    try {
      r = n(e.name);
    } catch (a) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", a.message), !1;
    }
  var s = We(r, e.form);
  return !s || s === e;
}, He = function(e) {
  return Ee(e) && e.type === "radio";
}, Ve = function(e) {
  return He(e) && !Ye(e);
}, ae = function(e) {
  var t = e.getBoundingClientRect(), n = t.width, r = t.height;
  return n === 0 && r === 0;
}, je = function(e, t) {
  var n = t.displayCheck, r = t.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = R.call(e, "details>summary:first-of-type"), a = s ? e.parentElement : e;
  if (R.call(a, "details:not([open]) *"))
    return !0;
  var d = te(e).host, c = d?.ownerDocument.contains(d) || e.ownerDocument.contains(e);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var u = e; e; ) {
        var p = e.parentElement, h = te(e);
        if (p && !p.shadowRoot && r(p) === !0)
          return ae(e);
        e.assignedSlot ? e = e.assignedSlot : !p && h !== e.ownerDocument ? e = h.host : e = p;
      }
      e = u;
    }
    if (c)
      return !e.getClientRects().length;
  } else if (n === "non-zero-area")
    return ae(e);
  return !1;
}, Ge = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var t = e.parentElement; t; ) {
      if (t.tagName === "FIELDSET" && t.disabled) {
        for (var n = 0; n < t.children.length; n++) {
          var r = t.children.item(n);
          if (r.tagName === "LEGEND")
            return R.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      t = t.parentElement;
    }
  return !1;
}, K = function(e, t) {
  return !(t.disabled || Pe(t) || je(t, e) || // For a details element with a summary, the summary element gets the focus
  Be(t) || Ge(t));
}, ie = function(e, t) {
  return !(Ve(t) || ye(t) < 0 || !K(e, t));
}, Ue = function(e) {
  var t = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(t) || t >= 0);
}, qe = function i(e) {
  var t = [], n = [];
  return e.forEach(function(r, s) {
    var a = !!r.scope, d = a ? r.scope : r, c = ye(d, a), u = a ? i(r.candidates) : d;
    c === 0 ? a ? t.push.apply(t, u) : t.push(d) : n.push({
      documentOrder: s,
      tabIndex: c,
      item: r,
      isScope: a,
      content: u
    });
  }), n.sort(Me).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(t);
}, Ze = function(e, t) {
  t = t || {};
  var n;
  return t.getShadowRoot ? n = we([e], t.includeContainer, {
    filter: ie.bind(null, t),
    flatten: !1,
    getShadowRoot: t.getShadowRoot,
    shadowRootFilter: Ue
  }) : n = me(e, t.includeContainer, ie.bind(null, t)), qe(n);
}, Ie = function(e, t) {
  t = t || {};
  var n;
  return t.getShadowRoot ? n = we([e], t.includeContainer, {
    filter: K.bind(null, t),
    flatten: !0,
    getShadowRoot: t.getShadowRoot
  }) : n = me(e, t.includeContainer, K.bind(null, t)), n;
}, j = function(e, t) {
  if (t = t || {}, !e)
    throw new Error("No node provided");
  return R.call(e, Z) === !1 ? !1 : ie(t, e);
}, Ke = /* @__PURE__ */ be.concat("iframe").join(","), U = function(e, t) {
  if (t = t || {}, !e)
    throw new Error("No node provided");
  return R.call(e, Ke) === !1 ? !1 : K(t, e);
};
function oe(i, e) {
  var t = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    e && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), t.push.apply(t, n);
  }
  return t;
}
function le(i) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? oe(Object(t), !0).forEach(function(n) {
      Je(i, n, t[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(t)) : oe(Object(t)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(t, n));
    });
  }
  return i;
}
function Je(i, e, t) {
  return e in i ? Object.defineProperty(i, e, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[e] = t, i;
}
var ce = /* @__PURE__ */ function() {
  var i = [];
  return {
    activateTrap: function(t) {
      if (i.length > 0) {
        var n = i[i.length - 1];
        n !== t && n.pause();
      }
      var r = i.indexOf(t);
      r === -1 || i.splice(r, 1), i.push(t);
    },
    deactivateTrap: function(t) {
      var n = i.indexOf(t);
      n !== -1 && i.splice(n, 1), i.length > 0 && i[i.length - 1].unpause();
    }
  };
}(), Xe = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Qe = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, et = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, de = function(e) {
  return setTimeout(e, 0);
}, ue = function(e, t) {
  var n = -1;
  return e.every(function(r, s) {
    return t(r) ? (n = s, !1) : !0;
  }), n;
}, z = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, n) : e;
}, G = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, tt = function(e, t) {
  var n = t?.document || document, r = le({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, t), s = {
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
  }, a, d = function(o, l, v) {
    return o && o[l] !== void 0 ? o[l] : r[v || l];
  }, c = function(o) {
    return s.containerGroups.findIndex(function(l) {
      var v = l.container, m = l.tabbableNodes;
      return v.contains(o) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      m.find(function(w) {
        return w === o;
      });
    });
  }, u = function(o) {
    var l = r[o];
    if (typeof l == "function") {
      for (var v = arguments.length, m = new Array(v > 1 ? v - 1 : 0), w = 1; w < v; w++)
        m[w - 1] = arguments[w];
      l = l.apply(void 0, m);
    }
    if (l === !0 && (l = void 0), !l) {
      if (l === void 0 || l === !1)
        return l;
      throw new Error("`".concat(o, "` was specified but was not a node, or did not return a node"));
    }
    var y = l;
    if (typeof l == "string" && (y = n.querySelector(l), !y))
      throw new Error("`".concat(o, "` as selector refers to no known node"));
    return y;
  }, p = function() {
    var o = u("initialFocus");
    if (o === !1)
      return !1;
    if (o === void 0)
      if (c(n.activeElement) >= 0)
        o = n.activeElement;
      else {
        var l = s.tabbableGroups[0], v = l && l.firstTabbableNode;
        o = v || u("fallbackFocus");
      }
    if (!o)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return o;
  }, h = function() {
    if (s.containerGroups = s.containers.map(function(o) {
      var l = Ze(o, r.tabbableOptions), v = Ie(o, r.tabbableOptions);
      return {
        container: o,
        tabbableNodes: l,
        focusableNodes: v,
        firstTabbableNode: l.length > 0 ? l[0] : null,
        lastTabbableNode: l.length > 0 ? l[l.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(w) {
          var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, C = v.findIndex(function(S) {
            return S === w;
          });
          if (!(C < 0))
            return y ? v.slice(C + 1).find(function(S) {
              return j(S, r.tabbableOptions);
            }) : v.slice(0, C).reverse().find(function(S) {
              return j(S, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(o) {
      return o.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !u("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function g(o) {
    if (o !== !1 && o !== n.activeElement) {
      if (!o || !o.focus) {
        g(p());
        return;
      }
      o.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = o, Xe(o) && o.select();
    }
  }, E = function(o) {
    var l = u("setReturnFocus", o);
    return l || (l === !1 ? !1 : o);
  }, I = function(o) {
    var l = G(o);
    if (!(c(l) >= 0)) {
      if (z(r.clickOutsideDeactivates, o)) {
        a.deactivate({
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
          returnFocus: r.returnFocusOnDeactivate && !U(l, r.tabbableOptions)
        });
        return;
      }
      z(r.allowOutsideClick, o) || o.preventDefault();
    }
  }, N = function(o) {
    var l = G(o), v = c(l) >= 0;
    v || l instanceof Document ? v && (s.mostRecentlyFocusedNode = l) : (o.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || p()));
  }, T = function(o) {
    var l = G(o);
    h();
    var v = null;
    if (s.tabbableGroups.length > 0) {
      var m = c(l), w = m >= 0 ? s.containerGroups[m] : void 0;
      if (m < 0)
        o.shiftKey ? v = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : v = s.tabbableGroups[0].firstTabbableNode;
      else if (o.shiftKey) {
        var y = ue(s.tabbableGroups, function(A) {
          var Q = A.firstTabbableNode;
          return l === Q;
        });
        if (y < 0 && (w.container === l || U(l, r.tabbableOptions) && !j(l, r.tabbableOptions) && !w.nextTabbableNode(l, !1)) && (y = m), y >= 0) {
          var C = y === 0 ? s.tabbableGroups.length - 1 : y - 1, S = s.tabbableGroups[C];
          v = S.lastTabbableNode;
        }
      } else {
        var L = ue(s.tabbableGroups, function(A) {
          var Q = A.lastTabbableNode;
          return l === Q;
        });
        if (L < 0 && (w.container === l || U(l, r.tabbableOptions) && !j(l, r.tabbableOptions) && !w.nextTabbableNode(l)) && (L = m), L >= 0) {
          var V = L === s.tabbableGroups.length - 1 ? 0 : L + 1, X = s.tabbableGroups[V];
          v = X.firstTabbableNode;
        }
      }
    } else
      v = u("fallbackFocus");
    v && (o.preventDefault(), f(v));
  }, $ = function(o) {
    if (Qe(o) && z(r.escapeDeactivates, o) !== !1) {
      o.preventDefault(), a.deactivate();
      return;
    }
    if (et(o)) {
      T(o);
      return;
    }
  }, Y = function(o) {
    var l = G(o);
    c(l) >= 0 || z(r.clickOutsideDeactivates, o) || z(r.allowOutsideClick, o) || (o.preventDefault(), o.stopImmediatePropagation());
  }, D = function() {
    if (s.active)
      return ce.activateTrap(a), s.delayInitialFocusTimer = r.delayInitialFocus ? de(function() {
        f(p());
      }) : f(p()), n.addEventListener("focusin", N, !0), n.addEventListener("mousedown", I, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", I, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", Y, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", $, {
        capture: !0,
        passive: !1
      }), a;
  }, H = function() {
    if (s.active)
      return n.removeEventListener("focusin", N, !0), n.removeEventListener("mousedown", I, !0), n.removeEventListener("touchstart", I, !0), n.removeEventListener("click", Y, !0), n.removeEventListener("keydown", $, !0), a;
  };
  return a = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(o) {
      if (s.active)
        return this;
      var l = d(o, "onActivate"), v = d(o, "onPostActivate"), m = d(o, "checkCanFocusTrap");
      m || h(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, l && l();
      var w = function() {
        m && h(), D(), v && v();
      };
      return m ? (m(s.containers.concat()).then(w, w), this) : (w(), this);
    },
    deactivate: function(o) {
      if (!s.active)
        return this;
      var l = le({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, o);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, H(), s.active = !1, s.paused = !1, ce.deactivateTrap(a);
      var v = d(l, "onDeactivate"), m = d(l, "onPostDeactivate"), w = d(l, "checkCanReturnFocus"), y = d(l, "returnFocus", "returnFocusOnDeactivate");
      v && v();
      var C = function() {
        de(function() {
          y && f(E(s.nodeFocusedBeforeActivation)), m && m();
        });
      };
      return y && w ? (w(E(s.nodeFocusedBeforeActivation)).then(C, C), this) : (C(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, H(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, h(), D(), this);
    },
    updateContainerElements: function(o) {
      var l = [].concat(o).filter(Boolean);
      return s.containers = l.map(function(v) {
        return typeof v == "string" ? n.querySelector(v) : v;
      }), s.active && h(), this;
    }
  }, a.updateContainerElements(e), a;
};
function it(i) {
  let e, t;
  window.addEventListener("focusin", () => {
    e = t, t = document.activeElement;
  }), i.magic("focus", (n) => {
    let r = n;
    return {
      __noscroll: !1,
      __wrapAround: !1,
      within(s) {
        return r = s, this;
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
      focusable(s) {
        return U(s);
      },
      previouslyFocused() {
        return e;
      },
      lastFocused() {
        return e;
      },
      focused() {
        return t;
      },
      focusables() {
        return Array.isArray(r) ? r : Ie(r, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(s) {
        let a = this.all();
        return a[0] && a[0].isSameNode(s);
      },
      isLast(s) {
        let a = this.all();
        return a.length && a.slice(-1)[0].isSameNode(s);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let s = this.all(), a = document.activeElement;
        if (s.indexOf(a) !== -1)
          return this.__wrapAround && s.indexOf(a) === s.length - 1 ? s[0] : s[s.indexOf(a) + 1];
      },
      getPrevious() {
        let s = this.all(), a = document.activeElement;
        if (s.indexOf(a) !== -1)
          return this.__wrapAround && s.indexOf(a) === 0 ? s.slice(-1)[0] : s[s.indexOf(a) - 1];
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
      focus(s) {
        s && setTimeout(() => {
          s.hasAttribute("tabindex") || s.setAttribute("tabindex", "0"), s.focus({ preventScroll: this.__noscroll });
        });
      }
    };
  }), i.directive("trap", i.skipDuringClone(
    (n, { expression: r, modifiers: s }, { effect: a, evaluateLater: d, cleanup: c }) => {
      let u = d(r), p = !1, h = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => n
      };
      if (s.includes("noautofocus"))
        h.initialFocus = !1;
      else {
        let T = n.querySelector("[autofocus]");
        T && (h.initialFocus = T);
      }
      let f = tt(n, h), E = () => {
      }, I = () => {
      };
      const N = () => {
        E(), E = () => {
        }, I(), I = () => {
        }, f.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      a(() => u((T) => {
        p !== T && (T && !p && (s.includes("noscroll") && (I = nt()), s.includes("inert") && (E = he(n)), setTimeout(() => {
          f.activate();
        }, 15)), !T && p && N(), p = !!T);
      })), c(N);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: r, modifiers: s }, { evaluate: a }) => {
      s.includes("inert") && a(r) && he(n);
    }
  ));
}
function he(i) {
  let e = [];
  return Te(i, (t) => {
    let n = t.hasAttribute("aria-hidden");
    t.setAttribute("aria-hidden", "true"), e.push(() => n || t.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Te(i, e) {
  i.isSameNode(document.body) || !i.parentNode || Array.from(i.parentNode.children).forEach((t) => {
    t.isSameNode(i) ? Te(i.parentNode, e) : e(t);
  });
}
function nt() {
  let i = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, t = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${t}px`, () => {
    document.documentElement.style.overflow = i, document.documentElement.style.paddingRight = e;
  };
}
var rt = it;
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
function st(i, e) {
  if (!(i instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function at(i, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(i, n.key, n);
  }
}
function ot(i, e, t) {
  return e && at(i.prototype, e), i;
}
var lt = Object.defineProperty, x = function(i, e) {
  return lt(i, "name", { value: e, configurable: !0 });
}, ct = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, dt = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, ut = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, ht = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, ft = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, pt = x(function(i) {
  return new DOMParser().parseFromString(i, "text/html").body.childNodes[0];
}, "stringToHTML"), _ = x(function(i) {
  var e = new DOMParser().parseFromString(i, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), b = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, O = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, fe = { OUTLINE: "outline", FILLED: "filled" }, ee = { FADE: "fade", SLIDE: "slide" }, M = { CLOSE: _(ct), SUCCESS: _(ht), ERROR: _(dt), WARNING: _(ft), INFO: _(ut) }, pe = x(function(i) {
  i.wrapper.classList.add(b.NOTIFY_FADE), setTimeout(function() {
    i.wrapper.classList.add(b.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ve = x(function(i) {
  i.wrapper.classList.remove(b.NOTIFY_FADE_IN), setTimeout(function() {
    i.wrapper.remove();
  }, i.speed);
}, "fadeOut"), vt = x(function(i) {
  i.wrapper.classList.add(b.NOTIFY_SLIDE), setTimeout(function() {
    i.wrapper.classList.add(b.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), bt = x(function(i) {
  i.wrapper.classList.remove(b.NOTIFY_SLIDE_IN), setTimeout(function() {
    i.wrapper.remove();
  }, i.speed);
}, "slideOut"), Ce = function() {
  function i(e) {
    var t = this;
    st(this, i), this.notifyOut = x(function(A) {
      A(t);
    }, "notifyOut");
    var n = e.notificationsGap, r = n === void 0 ? 20 : n, s = e.notificationsPadding, a = s === void 0 ? 20 : s, d = e.status, c = d === void 0 ? "success" : d, u = e.effect, p = u === void 0 ? ee.FADE : u, h = e.type, f = h === void 0 ? "outline" : h, E = e.title, I = e.text, N = e.showIcon, T = N === void 0 ? !0 : N, $ = e.customIcon, Y = $ === void 0 ? "" : $, D = e.customClass, H = D === void 0 ? "" : D, g = e.speed, o = g === void 0 ? 500 : g, l = e.showCloseButton, v = l === void 0 ? !0 : l, m = e.autoclose, w = m === void 0 ? !0 : m, y = e.autotimeout, C = y === void 0 ? 3e3 : y, S = e.position, L = S === void 0 ? "right top" : S, V = e.customWrapper, X = V === void 0 ? "" : V;
    if (this.customWrapper = X, this.status = c, this.title = E, this.text = I, this.showIcon = T, this.customIcon = Y, this.customClass = H, this.speed = o, this.effect = p, this.showCloseButton = v, this.autoclose = w, this.autotimeout = C, this.notificationsGap = r, this.notificationsPadding = a, this.type = f, this.position = L, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return ot(i, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var t = document.querySelector(".".concat(b.CONTAINER));
    t ? this.container = t : (this.container = document.createElement("div"), this.container.classList.add(b.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](b.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](b.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](b.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](b.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](b.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](b.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](b.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var t = this, n = document.createElement("div");
    n.classList.add(b.NOTIFY_CLOSE), n.innerHTML = M.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      t.close();
    });
  } }, { key: "setWrapper", value: function() {
    var t = this;
    switch (this.customWrapper ? this.wrapper = pt(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(b.NOTIFY), this.type) {
      case fe.OUTLINE:
        this.wrapper.classList.add(b.NOTIFY_OUTLINE);
        break;
      case fe.FILLED:
        this.wrapper.classList.add(b.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(b.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case O.SUCCESS:
        this.wrapper.classList.add(b.NOTIFY_SUCCESS);
        break;
      case O.ERROR:
        this.wrapper.classList.add(b.NOTIFY_ERROR);
        break;
      case O.WARNING:
        this.wrapper.classList.add(b.NOTIFY_WARNING);
        break;
      case O.INFO:
        this.wrapper.classList.add(b.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(b.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      t.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var t = document.createElement("div");
    t.classList.add(b.NOTIFY_CONTENT);
    var n, r;
    this.title && (n = document.createElement("div"), n.classList.add(b.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(b.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(t), this.title && t.appendChild(n), this.text && t.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var t = x(function(r) {
      switch (r) {
        case O.SUCCESS:
          return M.SUCCESS;
        case O.ERROR:
          return M.ERROR;
        case O.WARNING:
          return M.WARNING;
        case O.INFO:
          return M.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(b.NOTIFY_ICON), n.innerHTML = this.customIcon || t(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
  } }, { key: "setObserver", value: function() {
    var t = this, n = new IntersectionObserver(function(r) {
      if (r[0].intersectionRatio <= 0) t.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      n.observe(t.wrapper);
    }, this.speed);
  } }, { key: "notifyIn", value: function(e) {
    e(this);
  } }, { key: "autoClose", value: function() {
    var t = this;
    setTimeout(function() {
      t.close();
    }, this.autotimeout + this.speed);
  } }, { key: "close", value: function() {
    this.notifyOut(this.selectedNotifyOutEffect);
  } }, { key: "setEffect", value: function() {
    switch (this.effect) {
      case ee.FADE:
        this.selectedNotifyInEffect = pe, this.selectedNotifyOutEffect = ve;
        break;
      case ee.SLIDE:
        this.selectedNotifyInEffect = vt, this.selectedNotifyOutEffect = bt;
        break;
      default:
        this.selectedNotifyInEffect = pe, this.selectedNotifyOutEffect = ve;
    }
  } }]), i;
}();
x(Ce, "Notify");
var Se = Ce;
globalThis.Notify = Se;
const xe = ["success", "error", "warning", "info"], Ne = [
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
], Oe = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function P(i = {}) {
  const e = {
    ...Oe,
    ...i
  };
  xe.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), Ne.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new Se(e);
}
const gt = {
  custom: P,
  success(i, e = "Success", t = {}) {
    P({
      status: "success",
      title: e,
      text: i,
      ...t
    });
  },
  error(i, e = "Error", t = {}) {
    P({
      status: "error",
      title: e,
      text: i,
      ...t
    });
  },
  warning(i, e = "Warning", t = {}) {
    P({
      status: "warning",
      title: e,
      text: i,
      ...t
    });
  },
  info(i, e = "Info", t = {}) {
    P({
      status: "info",
      title: e,
      text: i,
      ...t
    });
  },
  setDefaults(i = {}) {
    Object.assign(Oe, i);
  },
  get allowedStatuses() {
    return [...xe];
  },
  get allowedPositions() {
    return [...Ne];
  }
}, ne = function() {
}, B = {}, J = {}, W = {};
function mt(i, e) {
  i = Array.isArray(i) ? i : [i];
  const t = [];
  let n = i.length, r = n, s, a, d, c;
  for (s = function(u, p) {
    p.length && t.push(u), r--, r || e(t);
  }; n--; ) {
    if (a = i[n], d = J[a], d) {
      s(a, d);
      continue;
    }
    c = W[a] = W[a] || [], c.push(s);
  }
}
function ke(i, e) {
  if (!i) return;
  const t = W[i];
  if (J[i] = e, !!t)
    for (; t.length; )
      t[0](i, e), t.splice(0, 1);
}
function re(i, e) {
  typeof i == "function" && (i = { success: i }), e.length ? (i.error || ne)(e) : (i.success || ne)(i);
}
function wt(i, e, t, n, r, s, a, d) {
  let c = i.type[0];
  if (d)
    try {
      t.sheet.cssText.length || (c = "e");
    } catch (u) {
      u.code !== 18 && (c = "e");
    }
  if (c === "e") {
    if (s += 1, s < a)
      return Le(e, n, r, s);
  } else if (t.rel === "preload" && t.as === "style") {
    t.rel = "stylesheet";
    return;
  }
  n(e, c, i.defaultPrevented);
}
function Le(i, e, t, n) {
  const r = document, s = t.async, a = (t.numRetries || 0) + 1, d = t.before || ne, c = i.replace(/[\?|#].*$/, ""), u = i.replace(/^(css|img|module|nomodule)!/, "");
  let p, h, f;
  if (n = n || 0, /(^css!|\.css$)/.test(c))
    f = r.createElement("link"), f.rel = "stylesheet", f.href = u, p = "hideFocus" in f, p && f.relList && (p = 0, f.rel = "preload", f.as = "style"), t.inlineStyleNonce && f.setAttribute("nonce", t.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(c))
    f = r.createElement("img"), f.src = u;
  else if (f = r.createElement("script"), f.src = u, f.async = s === void 0 ? !0 : s, t.inlineScriptNonce && f.setAttribute("nonce", t.inlineScriptNonce), h = "noModule" in f, /^module!/.test(c)) {
    if (!h) return e(i, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(c) && h)
    return e(i, "l");
  const E = function(I) {
    wt(I, i, f, e, t, n, a, p);
  };
  f.addEventListener("load", E, { once: !0 }), f.addEventListener("error", E, { once: !0 }), d(i, f) !== !1 && r.head.appendChild(f);
}
function yt(i, e, t) {
  i = Array.isArray(i) ? i : [i];
  let n = i.length, r = [];
  function s(a, d, c) {
    if (d === "e" && r.push(a), d === "b")
      if (c) r.push(a);
      else return;
    n--, n || e(r);
  }
  for (let a = 0; a < i.length; a++)
    Le(i[a], s, t);
}
function k(i, e, t) {
  let n, r;
  if (e && typeof e == "string" && e.trim && (n = e.trim()), r = (n ? t : e) || {}, n) {
    if (n in B)
      throw "LoadJS";
    B[n] = !0;
  }
  function s(a, d) {
    yt(i, function(c) {
      re(r, c), a && re({ success: a, error: d }, c), ke(n, c);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
k.ready = function(e, t) {
  return mt(e, function(n) {
    re(t, n);
  }), k;
};
k.done = function(e) {
  ke(e, []);
};
k.reset = function() {
  Object.keys(B).forEach((e) => delete B[e]), Object.keys(J).forEach((e) => delete J[e]), Object.keys(W).forEach((e) => delete W[e]);
};
k.isDefined = function(e) {
  return e in B;
};
function Et(i) {
  i.data("rzAccordion", () => ({
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
function It(i) {
  i.data("rzAccordionSection", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const e = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (t, n) => {
        t !== e.sectionId && !e.allowMultiple && (e.open = !1);
      }) : console.warn("rzAccordionSection: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
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
function Tt(i) {
  i.data("rzAlert", () => ({
    parentElement: null,
    showAlert: !0,
    init() {
      const e = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
      this.parentElement = document.getElementById(e);
    },
    dismiss() {
      this.showAlert = !1;
      const e = this;
      setTimeout(() => {
        e.parentElement.style.display = "none";
      }, 205);
    }
  }));
}
function Ct(i) {
  i.data("rzBrowser", () => ({
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
      return [this.screenSize === "" ? "text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong" : "opacity-60"];
    },
    // Get CSS classes for tablet screen button styling
    getTabletScreenCss() {
      return [this.screenSize === "max-w-2xl" ? "text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong" : "opacity-60"];
    },
    // Get CSS classes for phone screen button styling
    getPhoneScreenCss() {
      return [this.screenSize === "max-w-sm" ? "text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong" : "opacity-60"];
    }
  }));
}
function St(i) {
  i.data("rzCheckboxGroupItem", () => ({
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
function xt(i, e) {
  i.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const t = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.codeid, r = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, e(t, {
        success: function() {
          const s = document.getElementById(n);
          window.hljs && s && window.hljs.highlightElement(s);
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, r);
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
      return [this.copied ? "focus-visible:outline-success" : "focus-visible:outline-on-surface-dark"];
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
function Nt(i, e) {
  i.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    init() {
      const t = this.$el.dataset.config, n = document.getElementById(this.$el.dataset.uid + "-input");
      if (t) {
        const a = JSON.parse(t);
        a && (this.options = a.options || {}, this.placeholder = a.placeholder || "", this.prependText = a.prependText || "");
      }
      const r = JSON.parse(this.$el.dataset.assets), s = this.$el.dataset.nonce;
      e(r, {
        success: function() {
          window.flatpickr && n && window.flatpickr(n, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, s);
    }
  }));
}
function Ot(i) {
  i.data("rzDropdown", () => ({
    dropdownEl: null,
    anchorCss: "",
    dropdownOpen: !1,
    openedWithKeyboard: !1,
    init() {
      this.dropdownEl = this.$el, this.anchorCss = this.getAnchorCss();
    },
    toggleDropdown() {
      this.anchorCss = this.getAnchorCss(), this.dropdownOpen = !this.dropdownOpen;
    },
    openDropdown() {
      this.anchorCss = this.getAnchorCss(), this.dropdownOpen = !0, this.openedWithKeyboard = !1;
    },
    openWithKeyboard() {
      this.anchorCss = this.getAnchorCss(), this.dropdownOpen = !0, this.openedWithKeyboard = !0, this.focusWrapNext();
    },
    closeDropdown() {
      this.dropdownOpen = !1, this.openedWithKeyboard = !1;
    },
    focusWrapNext() {
      this.$focus.wrap().next();
    },
    focusWrapPrevious() {
      this.$focus.wrap().previous();
    },
    // Computes the Tailwind CSS classes for the dropdown's anchor based on its data attribute
    getAnchorCss() {
      let t = (this.dropdownEl.getAttribute("data-anchor") || "").replace(/-/g, "").toLowerCase();
      const n = {
        topstart: "bottom-full right-0 mb-2 origin-bottom-right",
        topcenter: "left-1/2 bottom-full transform -translate-x-1/2 mb-2 origin-bottom",
        topend: "bottom-full left-0 mb-2 origin-bottom-left",
        start: "right-full top-1/2 -translate-y-1/2 me-2 origin-right",
        end: "left-full top-1/2 -translate-y-1/2 ms-2 origin-left",
        bottomstart: "right-0 mt-2 origin-top-right",
        bottomcenter: "-translate-x-1/2 mt-2 origin-top",
        bottomend: "left-0 mt-2 origin-top-left"
      };
      let r = n[t] || "";
      const s = this.dropdownEl.getBoundingClientRect();
      let a = document.createElement("div");
      a.style.cssText = "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;", this.dropdownEl.appendChild(a);
      const d = this.dropdownEl.querySelector('[role="menu"]');
      if (!d)
        return r;
      let c = d.cloneNode(!0);
      c.style.transition = "none", c.style.transform = "none", c.style.opacity = "1", c.style.display = "block", a.appendChild(c);
      let u = c.getBoundingClientRect();
      a.parentNode.removeChild(a);
      const p = 8;
      let h = !1;
      if (t.startsWith("top") ? s.top < u.height + p && (h = !0) : t.startsWith("bottom") ? s.bottom + u.height + p > window.innerHeight && (h = !0) : t === "start" ? s.left < u.width + p && (h = !0) : t === "end" && s.right + u.width + p > window.innerWidth && (h = !0), h) {
        let E = {
          topstart: "bottomstart",
          topcenter: "bottomcenter",
          topend: "bottomend",
          bottomstart: "topstart",
          bottomcenter: "topcenter",
          bottomend: "topend",
          start: "end",
          end: "start"
        }[t] || t;
        r = n[E] || r;
      }
      return r;
    }
  }));
}
function kt(i) {
  i.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const e = typeof window < "u" && "localStorage" in window, t = ["light", "dark", "auto"], n = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let r = "auto";
      e && (r = localStorage.getItem("darkMode") ?? "auto", t.includes(r) || (r = "light")), e && localStorage.setItem("darkMode", r), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          r === "dark" || r === "auto" && n
        );
      }, this.applyTheme(), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.applyTheme);
    },
    // Returns true if dark mode should be active
    isDark() {
      const e = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return localStorage.getItem("darkMode"), this.mode === "dark" || this.mode === "auto" && e;
    },
    // Returns true if light mode should be active
    isLight() {
      return !this.isDark();
    },
    // Toggle the dark mode setting and dispatch a custom event
    toggle() {
      let e = localStorage.getItem("darkMode");
      const t = window.matchMedia("(prefers-color-scheme: dark)").matches;
      e === "light" ? e = "dark" : e === "dark" ? e = "light" : e === "auto" && (e = t ? "light" : "dark"), this.mode = e, localStorage.setItem("darkMode", e);
      const n = e === "dark" || e === "auto" && t;
      document.documentElement.classList.toggle("dark", n);
      const r = new CustomEvent("darkModeToggle", {
        detail: { darkMode: n }
      });
      window.dispatchEvent(r);
    },
    destroy() {
      this.applyTheme && window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.applyTheme);
    }
  }));
}
function Lt(i) {
  i.data("rzEmbeddedPreview", () => ({
    iframe: null,
    onDarkModeToggle: null,
    init() {
      try {
        this.iframe = this.$refs.iframe;
        const e = this.debounce(() => {
          this.resizeIframe(this.iframe);
        }, 50);
        this.resizeIframe(this.iframe), new ResizeObserver((r) => {
          for (let s of r)
            e();
        }).observe(this.iframe);
        const n = this.iframe;
        this.onDarkModeToggle = (r) => {
          n.contentWindow.postMessage(r.detail, "*");
        }, window.addEventListener("darkModeToggle", this.onDarkModeToggle);
      } catch {
        console.error("Cannot access iframe content");
      }
    },
    // Adjusts the iframe height based on its content
    resizeIframe(e) {
      if (e)
        try {
          const t = e.contentDocument || e.contentWindow?.document;
          if (t) {
            const n = t.body;
            if (!n)
              setInterval(() => {
                this.resizeIframe(e);
              }, 150);
            else {
              const r = n.scrollHeight + 15;
              e.style.height = r + "px";
            }
          }
        } catch (t) {
          console.error("Error resizing iframe:", t);
        }
    },
    // Debounce helper to limit function calls
    debounce(e, t = 300) {
      let n;
      return (...r) => {
        clearTimeout(n), n = setTimeout(() => {
          e.apply(this, r);
        }, t);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function Rt(i) {
  i.data("rzEmpty", () => {
  });
}
function Ft(i) {
  i.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const e = this;
      if (typeof this.setCurrentHeading == "function") {
        const t = (r, s) => {
          r.forEach((a) => {
            a.isIntersecting && e.setCurrentHeading(e.headingId);
          });
        }, n = { threshold: 0.5 };
        this.observer = new IntersectionObserver(t, n), this.observer.observe(this.$el);
      } else
        console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
    },
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function $t(i, e) {
  i.data("rzMarkdown", () => ({
    init() {
      const t = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.nonce;
      e(t, {
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
function Dt(i) {
  i.data("rzModal", () => ({
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
      })), this.eventTriggerName && (this._openListener = (e) => {
        this.openModal(e);
      }, window.addEventListener(this.eventTriggerName, this._openListener)), this._closeEventListener = (e) => {
        this.modalOpen && this.closeModalInternally("event");
      }, window.addEventListener(this.closeEventName, this._closeEventListener), this._escapeListener = (e) => {
        this.modalOpen && this.closeOnEscape && e.key === "Escape" && this.closeModalInternally("escape");
      }, window.addEventListener("keydown", this._escapeListener), this.$watch("modalOpen", (e) => {
        const t = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", e);
        const n = document.body.offsetWidth - t;
        document.body.style.setProperty("--page-scrollbar-width", `${n}px`), e ? this.$nextTick(() => {
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
    openModal(e = null) {
      const t = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: e },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(t), t.defaultPrevented || (this.modalOpen = !0);
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(e = "unknown") {
      const t = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason: e },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(t), t.defaultPrevented || (document.activeElement?.blur && document.activeElement.blur(), this.modalOpen = !1, document.body.classList.remove("overflow-hidden"), document.body.style.setProperty("--page-scrollbar-width", "0px"));
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
function At(i) {
  i.data("rzPrependInput", () => ({
    prependContainer: null,
    textInput: null,
    init() {
      this.prependContainer = this.$refs.prependContainer, this.textInput = this.$refs.textInput;
      let e = this;
      setTimeout(() => {
        e.updatePadding();
      }, 50), window.addEventListener("resize", this.updatePadding);
    },
    destroy() {
      window.removeEventListener("resize", this.updatePadding);
    },
    updatePadding() {
      const e = this.prependContainer, t = this.textInput;
      if (!e || !t) {
        t && t.classList.remove("text-transparent");
        return;
      }
      const r = e.offsetWidth + 10;
      t.style.paddingLeft = r + "px", t.classList.remove("text-transparent");
    }
  }));
}
function zt(i) {
  i.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const e = this.$el;
      this.currentVal = parseInt(e.getAttribute("data-current-val")) || 0, this.minVal = parseInt(e.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(e.getAttribute("data-max-val")) || 100, this.label = e.getAttribute("data-label"), this.calculatePercentage(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuemin", this.minVal), e.setAttribute("aria-valuemax", this.maxVal), e.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((n) => {
        this.updateProgressBar();
      }).observe(e), this.$watch("currentVal", () => {
        this.calculatePercentage(), this.updateProgressBar(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuetext", `${this.percentage}%`);
      });
    },
    calculatePercentage() {
      this.maxVal === this.minVal ? this.percentage = 0 : this.percentage = Math.min(Math.max((this.currentVal - this.minVal) / (this.maxVal - this.minVal) * 100, 0), 100);
    },
    buildLabel() {
      var e = this.label || "{percent}%";
      return this.calculatePercentage(), e.replace("{percent}", this.percentage);
    },
    buildInsideLabelPosition() {
      const e = this.$refs.progressBar, t = this.$refs.progressBarLabel, n = this.$refs.innerLabel;
      t && e && n && (n.innerText = this.buildLabel(), t.clientWidth > e.clientWidth ? t.style.left = e.clientWidth + 10 + "px" : t.style.left = e.clientWidth / 2 - t.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const e = this.$refs.progressBarLabel, t = this.$refs.progressBar;
      return e && t && e.clientWidth > t.clientWidth ? "text-on-surface dark:text-on-surface-dark" : "";
    },
    updateProgressBar() {
      const e = this.$refs.progressBar;
      e && (e.style.width = `${this.percentage}%`, this.buildInsideLabelPosition());
    },
    // Methods to set, increment, or decrement the progress value
    setProgress(e) {
      this.currentVal = e;
    },
    increment(e = 1) {
      this.currentVal = Math.min(this.currentVal + e, this.maxVal);
    },
    decrement(e = 1) {
      this.currentVal = Math.max(this.currentVal - e, this.minVal);
    }
  }));
}
function _t(i) {
  i.data("rzQuickReferenceContainer", () => ({
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
      const e = this.$el.dataset.headingid;
      window.requestAnimationFrame(() => {
        this.currentHeadingId = e;
      });
    },
    // Sets the current heading ID based on intersection observer events from rzHeading.
    setCurrentHeading(e) {
      this.headings.includes(e) && (this.currentHeadingId = e);
    },
    // Provides CSS classes for a link based on whether it's the current heading.
    // Returns an object suitable for :class binding.
    getSelectedCss() {
      const e = this.$el.dataset.headingid;
      return {
        "font-bold": this.currentHeadingId === e
        // Apply 'font-bold' if current
      };
    },
    // Determines the value for the aria-current attribute.
    getSelectedAriaCurrent() {
      const e = this.$el.dataset.headingid;
      return this.currentHeadingId === e ? "true" : null;
    }
  }));
}
function Mt(i) {
  i.data("rzTabs", () => ({
    buttonRef: null,
    tabSelected: "",
    tabButton: null,
    init() {
      this.buttonRef = document.getElementById(this.$el.dataset.buttonref), this.tabSelected = this.$el.dataset.tabselected, this.tabButton = this.buttonRef.querySelector("[data-name='" + this.tabSelected + "']"), this.tabRepositionMarker(this.tabButton);
    },
    tabButtonClicked(e) {
      e instanceof Event && (e = e.target), this.tabSelected = e.dataset.name, this.tabRepositionMarker(e), e.focus();
    },
    tabRepositionMarker(e) {
      this.tabButton = e, this.$refs.tabMarker.style.width = e.offsetWidth + "px", this.$refs.tabMarker.style.height = e.offsetHeight + "px", this.$refs.tabMarker.style.left = e.offsetLeft + "px", setTimeout(() => {
        this.$refs.tabMarker.style.opacity = 1;
      }, 150);
    },
    // Get the CSS classes for the tab content panel based on selection
    getTabContentCss() {
      return this.tabSelected === this.$el.dataset.name ? "" : "hidden";
    },
    tabContentActive(e) {
      return e = e ?? this.$el, this.tabSelected === e.dataset.name;
    },
    tabButtonActive(e) {
      return e = e ?? this.$el, this.tabSelected === e.dataset.name;
    },
    // Get the value for the aria-selected attribute
    getTabButtonAriaSelected() {
      return this.tabSelected === this.$el.dataset.name ? "true" : "false";
    },
    // Get the CSS classes for the tab button text color based on selection
    getSelectedTabTextColorCss() {
      const e = this.$el.dataset.selectedtextcolor ?? "";
      return this.tabSelected === this.$el.dataset.name ? e : "";
    },
    handleResize() {
      this.tabRepositionMarker(this.tabButton);
    },
    handleKeyDown(e) {
      const t = e.key, n = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), r = n.findIndex((a) => this.tabSelected === a.dataset.name);
      let s = r;
      t === "ArrowRight" ? (s = (r + 1) % n.length, e.preventDefault()) : t === "ArrowLeft" ? (s = (r - 1 + n.length) % n.length, e.preventDefault()) : t === "Home" ? (s = 0, e.preventDefault()) : t === "End" && (s = n.length - 1, e.preventDefault()), s !== r && this.tabButtonClicked(n[s]);
    }
  }));
}
function Pt(i) {
  i.data("rzSidebar", () => ({
    showSidebar: !1,
    isSidebarHidden() {
      return !this.showSidebar;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    hideSidebar() {
      this.showSidebar = !1;
    },
    // Return translation classes based on sidebar state for smooth slide-in/out
    getSidebarTranslation() {
      return this.showSidebar ? "translate-x-0" : "-translate-x-60";
    }
  }));
}
function Bt(i) {
  i.data("rzSidebarLinkItem", () => ({
    isExpanded: !1,
    chevronExpandedClass: "",
    chevronCollapsedClass: "",
    init() {
      this.isExpanded = this.$el.dataset.expanded === "true", this.chevronExpandedClass = this.$el.dataset.chevronExpandedClass, this.chevronCollapsedClass = this.$el.dataset.chevronCollapsedClass;
    },
    isCollapsed() {
      return !this.isExpanded;
    },
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
    hideSidebar() {
      const e = this.$el.closest('[x-data^="rzSidebar"]');
      if (e) {
        let t = i.$data(e);
        t.showSidebar = !1;
      } else
        console.warn("Parent sidebar context not found or 'showSidebar' is not defined.");
    },
    getExpandedClass() {
      return this.isExpanded ? this.chevronExpandedClass : this.chevronCollapsedClass;
    },
    // Get the value for the aria-expanded attribute
    getAriaExpanded() {
      return this.isExpanded ? "true" : "false";
    }
  }));
}
async function Wt(i) {
  i = [...i].sort();
  const e = i.join("|"), n = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((a) => a.toString(16).padStart(2, "0")).join("");
}
function q(i, e, t) {
  Wt(i).then((n) => {
    k.isDefined(n) || k(
      i,
      n,
      {
        async: !1,
        inlineScriptNonce: t,
        inlineStyleNonce: t
      }
    ), k.ready([n], e);
  });
}
function Yt(i) {
  Et(i), It(i), Tt(i), Ct(i), St(i), xt(i, q), Nt(i, q), Ot(i), kt(i), Lt(i), Rt(i), Ft(i), $t(i, q), Dt(i), At(i), zt(i), _t(i), Mt(i), Pt(i), Bt(i);
}
function Ht(i) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return;
  }
  let e = null, t = null;
  if (typeof i == "string") {
    if (!i) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    if (t = i, e = document.getElementById(t), !e) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${t}" not found in the DOM.`);
      return;
    }
  } else if (i instanceof Element) {
    if (e = i, !e.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return;
    }
    t = e.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return;
  }
  const n = `[data-alpine-root="${t}"]`;
  let r = null;
  if (e.matches(n) ? r = e : r = e.querySelector(n), !r) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${n}" on or inside the wrapper element (ID: #${t}). Verify the 'data-alpine-root' attribute placement.`
    );
    return;
  }
  const s = Alpine.$data(r);
  if (s === void 0) {
    const a = `${r.tagName.toLowerCase()}${r.id ? "#" + r.id : ""}${r.classList.length ? "." + Array.from(r.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${a}) via 'data-alpine-root="${t}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return s;
}
F.plugin(Fe);
F.plugin(_e);
F.plugin(rt);
Yt(F);
const Vt = {
  Alpine: F,
  require: q,
  toast: gt,
  $data: Ht
};
window.Alpine = F;
window.Rizzy = { ...window.Rizzy || {}, ...Vt };
F.start();
export {
  Vt as default
};
