import V from "alpinejs";
function vt(t) {
  t.directive("collapse", e), e.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function e(n, { modifiers: i }) {
    let r = Oe(i, "duration", 250) / 1e3, s = Oe(i, "min", 0), o = !i.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (l, f) => {
      let h = t.setStyles(l, f);
      return f.height ? () => {
      } : h;
    }, c = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(l = () => {
      }, f = () => {
      }) {
        o && (n.hidden = !1), o && (n.style.display = null);
        let h = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let p = n.getBoundingClientRect().height;
        h === p && (h = s), t.transition(n, t.setStyles, {
          during: c,
          start: { height: h + "px" },
          end: { height: p + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - p) < 1 && (n.style.overflow = null);
        });
      },
      out(l = () => {
      }, f = () => {
      }) {
        let h = n.getBoundingClientRect().height;
        t.transition(n, a, {
          during: c,
          start: { height: h + "px" },
          end: { height: s + "px" }
        }, () => n.style.overflow = "hidden", () => {
          n._x_isShown = !1, n.style.height == `${s}px` && o && (n.style.display = "none", n.hidden = !0);
        });
      }
    };
  }
}
function Oe(t, e, n) {
  if (t.indexOf(e) === -1)
    return n;
  const i = t[t.indexOf(e) + 1];
  if (!i)
    return n;
  if (e === "duration") {
    let r = i.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  if (e === "min") {
    let r = i.match(/([0-9]+)px/);
    if (r)
      return r[1];
  }
  return i;
}
var mt = vt;
function bt(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), c = {
      rootMargin: Et(r),
      threshold: wt(r)
    }, l = new IntersectionObserver((f) => {
      f.forEach((h) => {
        h.isIntersecting !== (n === "leave") && (a(), r.includes("once") && l.disconnect());
      });
    }, c);
    l.observe(e), o(() => {
      l.disconnect();
    });
  }));
}
function wt(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function yt(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Et(t) {
  const e = "margin", n = "0px 0px 0px 0px", i = t.indexOf(e);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(yt(t[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var xt = bt, Ve = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ce = /* @__PURE__ */ Ve.join(","), Ye = typeof Element > "u", H = Ye ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, we = !Ye && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, je = function(e, n, i) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(ce));
  return n && H.call(e, ce) && r.unshift(e), r = r.filter(i), r;
}, qe = function t(e, n, i) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), c = a.length ? a : o.children, l = t(c, !0, i);
      i.flatten ? r.push.apply(r, l) : r.push({
        scope: o,
        candidates: l
      });
    } else {
      var f = H.call(o, ce);
      f && i.filter(o) && (n || !e.includes(o)) && r.push(o);
      var h = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), p = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (h && p) {
        var g = t(h === !0 ? o.children : h.children, !0, i);
        i.flatten ? r.push.apply(r, g) : r.push({
          scope: o,
          candidates: g
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Ge = function(e, n) {
  return e.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Tt = function(e, n) {
  return e.tabIndex === n.tabIndex ? e.documentOrder - n.documentOrder : e.tabIndex - n.tabIndex;
}, Ue = function(e) {
  return e.tagName === "INPUT";
}, It = function(e) {
  return Ue(e) && e.type === "hidden";
}, Ct = function(e) {
  var n = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, St = function(e, n) {
  for (var i = 0; i < e.length; i++)
    if (e[i].checked && e[i].form === n)
      return e[i];
}, Ot = function(e) {
  if (!e.name)
    return !0;
  var n = e.form || we(e), i = function(a) {
    return n.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, r;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    r = i(window.CSS.escape(e.name));
  else
    try {
      r = i(e.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var s = St(r, e.form);
  return !s || s === e;
}, Nt = function(e) {
  return Ue(e) && e.type === "radio";
}, Lt = function(e) {
  return Nt(e) && !Ot(e);
}, Ne = function(e) {
  var n = e.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, kt = function(e, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = H.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (H.call(o, "details:not([open]) *"))
    return !0;
  var a = we(e).host, c = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var l = e; e; ) {
        var f = e.parentElement, h = we(e);
        if (f && !f.shadowRoot && r(f) === !0)
          return Ne(e);
        e.assignedSlot ? e = e.assignedSlot : !f && h !== e.ownerDocument ? e = h.host : e = f;
      }
      e = l;
    }
    if (c)
      return !e.getClientRects().length;
  } else if (i === "non-zero-area")
    return Ne(e);
  return !1;
}, Rt = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var n = e.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return H.call(n, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, le = function(e, n) {
  return !(n.disabled || It(n) || kt(n, e) || // For a details element with a summary, the summary element gets the focus
  Ct(n) || Rt(n));
}, ye = function(e, n) {
  return !(Lt(n) || Ge(n) < 0 || !le(e, n));
}, Ft = function(e) {
  var n = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Dt = function t(e) {
  var n = [], i = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, c = Ge(a, o), l = o ? t(r.candidates) : a;
    c === 0 ? o ? n.push.apply(n, l) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: c,
      item: r,
      isScope: o,
      content: l
    });
  }), i.sort(Tt).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, $t = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = qe([e], n.includeContainer, {
    filter: ye.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Ft
  }) : i = je(e, n.includeContainer, ye.bind(null, n)), Dt(i);
}, Ze = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = qe([e], n.includeContainer, {
    filter: le.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = je(e, n.includeContainer, le.bind(null, n)), i;
}, re = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return H.call(e, ce) === !1 ? !1 : ye(n, e);
}, At = /* @__PURE__ */ Ve.concat("iframe").join(","), oe = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return H.call(e, At) === !1 ? !1 : le(n, e);
};
function Le(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function ke(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Le(Object(n), !0).forEach(function(i) {
      _t(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Le(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function _t(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t;
}
var Re = /* @__PURE__ */ function() {
  var t = [];
  return {
    activateTrap: function(n) {
      if (t.length > 0) {
        var i = t[t.length - 1];
        i !== n && i.pause();
      }
      var r = t.indexOf(n);
      r === -1 || t.splice(r, 1), t.push(n);
    },
    deactivateTrap: function(n) {
      var i = t.indexOf(n);
      i !== -1 && t.splice(i, 1), t.length > 0 && t[t.length - 1].unpause();
    }
  };
}(), zt = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Mt = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, Pt = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, Fe = function(e) {
  return setTimeout(e, 0);
}, De = function(e, n) {
  var i = -1;
  return e.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, U = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, i) : e;
}, se = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Bt = function(e, n) {
  var i = n?.document || document, r = ke({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, n), s = {
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
  }, o, a = function(d, u, v) {
    return d && d[u] !== void 0 ? d[u] : r[v || u];
  }, c = function(d) {
    return s.containerGroups.findIndex(function(u) {
      var v = u.container, y = u.tabbableNodes;
      return v.contains(d) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      y.find(function(E) {
        return E === d;
      });
    });
  }, l = function(d) {
    var u = r[d];
    if (typeof u == "function") {
      for (var v = arguments.length, y = new Array(v > 1 ? v - 1 : 0), E = 1; E < v; E++)
        y[E - 1] = arguments[E];
      u = u.apply(void 0, y);
    }
    if (u === !0 && (u = void 0), !u) {
      if (u === void 0 || u === !1)
        return u;
      throw new Error("`".concat(d, "` was specified but was not a node, or did not return a node"));
    }
    var I = u;
    if (typeof u == "string" && (I = i.querySelector(u), !I))
      throw new Error("`".concat(d, "` as selector refers to no known node"));
    return I;
  }, f = function() {
    var d = l("initialFocus");
    if (d === !1)
      return !1;
    if (d === void 0)
      if (c(i.activeElement) >= 0)
        d = i.activeElement;
      else {
        var u = s.tabbableGroups[0], v = u && u.firstTabbableNode;
        d = v || l("fallbackFocus");
      }
    if (!d)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return d;
  }, h = function() {
    if (s.containerGroups = s.containers.map(function(d) {
      var u = $t(d, r.tabbableOptions), v = Ze(d, r.tabbableOptions);
      return {
        container: d,
        tabbableNodes: u,
        focusableNodes: v,
        firstTabbableNode: u.length > 0 ? u[0] : null,
        lastTabbableNode: u.length > 0 ? u[u.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(E) {
          var I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, S = v.findIndex(function(O) {
            return O === E;
          });
          if (!(S < 0))
            return I ? v.slice(S + 1).find(function(O) {
              return re(O, r.tabbableOptions);
            }) : v.slice(0, S).reverse().find(function(O) {
              return re(O, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(d) {
      return d.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !l("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, p = function m(d) {
    if (d !== !1 && d !== i.activeElement) {
      if (!d || !d.focus) {
        m(f());
        return;
      }
      d.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = d, zt(d) && d.select();
    }
  }, g = function(d) {
    var u = l("setReturnFocus", d);
    return u || (u === !1 ? !1 : d);
  }, T = function(d) {
    var u = se(d);
    if (!(c(u) >= 0)) {
      if (U(r.clickOutsideDeactivates, d)) {
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
          returnFocus: r.returnFocusOnDeactivate && !oe(u, r.tabbableOptions)
        });
        return;
      }
      U(r.allowOutsideClick, d) || d.preventDefault();
    }
  }, w = function(d) {
    var u = se(d), v = c(u) >= 0;
    v || u instanceof Document ? v && (s.mostRecentlyFocusedNode = u) : (d.stopImmediatePropagation(), p(s.mostRecentlyFocusedNode || f()));
  }, x = function(d) {
    var u = se(d);
    h();
    var v = null;
    if (s.tabbableGroups.length > 0) {
      var y = c(u), E = y >= 0 ? s.containerGroups[y] : void 0;
      if (y < 0)
        d.shiftKey ? v = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : v = s.tabbableGroups[0].firstTabbableNode;
      else if (d.shiftKey) {
        var I = De(s.tabbableGroups, function(G) {
          var ve = G.firstTabbableNode;
          return u === ve;
        });
        if (I < 0 && (E.container === u || oe(u, r.tabbableOptions) && !re(u, r.tabbableOptions) && !E.nextTabbableNode(u, !1)) && (I = y), I >= 0) {
          var S = I === 0 ? s.tabbableGroups.length - 1 : I - 1, O = s.tabbableGroups[S];
          v = O.lastTabbableNode;
        }
      } else {
        var W = De(s.tabbableGroups, function(G) {
          var ve = G.lastTabbableNode;
          return u === ve;
        });
        if (W < 0 && (E.container === u || oe(u, r.tabbableOptions) && !re(u, r.tabbableOptions) && !E.nextTabbableNode(u)) && (W = y), W >= 0) {
          var ie = W === s.tabbableGroups.length - 1 ? 0 : W + 1, ge = s.tabbableGroups[ie];
          v = ge.firstTabbableNode;
        }
      }
    } else
      v = l("fallbackFocus");
    v && (d.preventDefault(), p(v));
  }, k = function(d) {
    if (Mt(d) && U(r.escapeDeactivates, d) !== !1) {
      d.preventDefault(), o.deactivate();
      return;
    }
    if (Pt(d)) {
      x(d);
      return;
    }
  }, R = function(d) {
    var u = se(d);
    c(u) >= 0 || U(r.clickOutsideDeactivates, d) || U(r.allowOutsideClick, d) || (d.preventDefault(), d.stopImmediatePropagation());
  }, F = function() {
    if (s.active)
      return Re.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? Fe(function() {
        p(f());
      }) : p(f()), i.addEventListener("focusin", w, !0), i.addEventListener("mousedown", T, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", T, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", R, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", k, {
        capture: !0,
        passive: !1
      }), o;
  }, z = function() {
    if (s.active)
      return i.removeEventListener("focusin", w, !0), i.removeEventListener("mousedown", T, !0), i.removeEventListener("touchstart", T, !0), i.removeEventListener("click", R, !0), i.removeEventListener("keydown", k, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(d) {
      if (s.active)
        return this;
      var u = a(d, "onActivate"), v = a(d, "onPostActivate"), y = a(d, "checkCanFocusTrap");
      y || h(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, u && u();
      var E = function() {
        y && h(), F(), v && v();
      };
      return y ? (y(s.containers.concat()).then(E, E), this) : (E(), this);
    },
    deactivate: function(d) {
      if (!s.active)
        return this;
      var u = ke({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, d);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, z(), s.active = !1, s.paused = !1, Re.deactivateTrap(o);
      var v = a(u, "onDeactivate"), y = a(u, "onPostDeactivate"), E = a(u, "checkCanReturnFocus"), I = a(u, "returnFocus", "returnFocusOnDeactivate");
      v && v();
      var S = function() {
        Fe(function() {
          I && p(g(s.nodeFocusedBeforeActivation)), y && y();
        });
      };
      return I && E ? (E(g(s.nodeFocusedBeforeActivation)).then(S, S), this) : (S(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, z(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, h(), F(), this);
    },
    updateContainerElements: function(d) {
      var u = [].concat(d).filter(Boolean);
      return s.containers = u.map(function(v) {
        return typeof v == "string" ? i.querySelector(v) : v;
      }), s.active && h(), this;
    }
  }, o.updateContainerElements(e), o;
};
function Wt(t) {
  let e, n;
  window.addEventListener("focusin", () => {
    e = n, n = document.activeElement;
  }), t.magic("focus", (i) => {
    let r = i;
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
        return oe(s);
      },
      previouslyFocused() {
        return e;
      },
      lastFocused() {
        return e;
      },
      focused() {
        return n;
      },
      focusables() {
        return Array.isArray(r) ? r : Ze(r, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(s) {
        let o = this.all();
        return o[0] && o[0].isSameNode(s);
      },
      isLast(s) {
        let o = this.all();
        return o.length && o.slice(-1)[0].isSameNode(s);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let s = this.all(), o = document.activeElement;
        if (s.indexOf(o) !== -1)
          return this.__wrapAround && s.indexOf(o) === s.length - 1 ? s[0] : s[s.indexOf(o) + 1];
      },
      getPrevious() {
        let s = this.all(), o = document.activeElement;
        if (s.indexOf(o) !== -1)
          return this.__wrapAround && s.indexOf(o) === 0 ? s.slice(-1)[0] : s[s.indexOf(o) - 1];
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
  }), t.directive("trap", t.skipDuringClone(
    (i, { expression: r, modifiers: s }, { effect: o, evaluateLater: a, cleanup: c }) => {
      let l = a(r), f = !1, h = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => i
      };
      if (s.includes("noautofocus"))
        h.initialFocus = !1;
      else {
        let x = i.querySelector("[autofocus]");
        x && (h.initialFocus = x);
      }
      let p = Bt(i, h), g = () => {
      }, T = () => {
      };
      const w = () => {
        g(), g = () => {
        }, T(), T = () => {
        }, p.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => l((x) => {
        f !== x && (x && !f && (s.includes("noscroll") && (T = Ht()), s.includes("inert") && (g = $e(i)), setTimeout(() => {
          p.activate();
        }, 15)), !x && f && w(), f = !!x);
      })), c(w);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && $e(i);
    }
  ));
}
function $e(t) {
  let e = [];
  return Ke(t, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), e.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Ke(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((n) => {
    n.isSameNode(t) ? Ke(t.parentNode, e) : e(n);
  });
}
function Ht() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var Vt = Wt;
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
function Yt(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function jt(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
  }
}
function qt(t, e, n) {
  return e && jt(t.prototype, e), t;
}
var Gt = Object.defineProperty, A = function(t, e) {
  return Gt(t, "name", { value: e, configurable: !0 });
}, Ut = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Zt = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Kt = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Xt = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Jt = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Qt = A(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Z = A(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), b = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, M = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, Ae = { OUTLINE: "outline", FILLED: "filled" }, me = { FADE: "fade", SLIDE: "slide" }, K = { CLOSE: Z(Ut), SUCCESS: Z(Xt), ERROR: Z(Zt), WARNING: Z(Jt), INFO: Z(Kt) }, _e = A(function(t) {
  t.wrapper.classList.add(b.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(b.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ze = A(function(t) {
  t.wrapper.classList.remove(b.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), en = A(function(t) {
  t.wrapper.classList.add(b.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(b.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), tn = A(function(t) {
  t.wrapper.classList.remove(b.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Xe = function() {
  function t(e) {
    var n = this;
    Yt(this, t), this.notifyOut = A(function(G) {
      G(n);
    }, "notifyOut");
    var i = e.notificationsGap, r = i === void 0 ? 20 : i, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, c = a === void 0 ? "success" : a, l = e.effect, f = l === void 0 ? me.FADE : l, h = e.type, p = h === void 0 ? "outline" : h, g = e.title, T = e.text, w = e.showIcon, x = w === void 0 ? !0 : w, k = e.customIcon, R = k === void 0 ? "" : k, F = e.customClass, z = F === void 0 ? "" : F, m = e.speed, d = m === void 0 ? 500 : m, u = e.showCloseButton, v = u === void 0 ? !0 : u, y = e.autoclose, E = y === void 0 ? !0 : y, I = e.autotimeout, S = I === void 0 ? 3e3 : I, O = e.position, W = O === void 0 ? "right top" : O, ie = e.customWrapper, ge = ie === void 0 ? "" : ie;
    if (this.customWrapper = ge, this.status = c, this.title = g, this.text = T, this.showIcon = x, this.customIcon = R, this.customClass = z, this.speed = d, this.effect = f, this.showCloseButton = v, this.autoclose = E, this.autotimeout = S, this.notificationsGap = r, this.notificationsPadding = o, this.type = p, this.position = W, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return qt(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(b.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(b.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](b.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](b.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](b.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](b.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](b.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](b.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](b.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(b.NOTIFY_CLOSE), i.innerHTML = K.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Qt(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(b.NOTIFY), this.type) {
      case Ae.OUTLINE:
        this.wrapper.classList.add(b.NOTIFY_OUTLINE);
        break;
      case Ae.FILLED:
        this.wrapper.classList.add(b.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(b.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case M.SUCCESS:
        this.wrapper.classList.add(b.NOTIFY_SUCCESS);
        break;
      case M.ERROR:
        this.wrapper.classList.add(b.NOTIFY_ERROR);
        break;
      case M.WARNING:
        this.wrapper.classList.add(b.NOTIFY_WARNING);
        break;
      case M.INFO:
        this.wrapper.classList.add(b.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(b.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(b.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(b.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(b.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = A(function(r) {
      switch (r) {
        case M.SUCCESS:
          return K.SUCCESS;
        case M.ERROR:
          return K.ERROR;
        case M.WARNING:
          return K.WARNING;
        case M.INFO:
          return K.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(b.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
  } }, { key: "setObserver", value: function() {
    var n = this, i = new IntersectionObserver(function(r) {
      if (r[0].intersectionRatio <= 0) n.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      i.observe(n.wrapper);
    }, this.speed);
  } }, { key: "notifyIn", value: function(e) {
    e(this);
  } }, { key: "autoClose", value: function() {
    var n = this;
    setTimeout(function() {
      n.close();
    }, this.autotimeout + this.speed);
  } }, { key: "close", value: function() {
    this.notifyOut(this.selectedNotifyOutEffect);
  } }, { key: "setEffect", value: function() {
    switch (this.effect) {
      case me.FADE:
        this.selectedNotifyInEffect = _e, this.selectedNotifyOutEffect = ze;
        break;
      case me.SLIDE:
        this.selectedNotifyInEffect = en, this.selectedNotifyOutEffect = tn;
        break;
      default:
        this.selectedNotifyInEffect = _e, this.selectedNotifyOutEffect = ze;
    }
  } }]), t;
}();
A(Xe, "Notify");
var Je = Xe;
globalThis.Notify = Je;
const Qe = ["success", "error", "warning", "info"], et = [
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
], tt = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function X(t = {}) {
  const e = {
    ...tt,
    ...t
  };
  Qe.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), et.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new Je(e);
}
const nn = {
  custom: X,
  success(t, e = "Success", n = {}) {
    X({
      status: "success",
      title: e,
      text: t,
      ...n
    });
  },
  error(t, e = "Error", n = {}) {
    X({
      status: "error",
      title: e,
      text: t,
      ...n
    });
  },
  warning(t, e = "Warning", n = {}) {
    X({
      status: "warning",
      title: e,
      text: t,
      ...n
    });
  },
  info(t, e = "Info", n = {}) {
    X({
      status: "info",
      title: e,
      text: t,
      ...n
    });
  },
  setDefaults(t = {}) {
    Object.assign(tt, t);
  },
  get allowedStatuses() {
    return [...Qe];
  },
  get allowedPositions() {
    return [...et];
  }
}, Ee = function() {
}, Q = {}, de = {}, ee = {};
function rn(t, e) {
  t = Array.isArray(t) ? t : [t];
  const n = [];
  let i = t.length, r = i, s, o, a, c;
  for (s = function(l, f) {
    f.length && n.push(l), r--, r || e(n);
  }; i--; ) {
    if (o = t[i], a = de[o], a) {
      s(o, a);
      continue;
    }
    c = ee[o] = ee[o] || [], c.push(s);
  }
}
function nt(t, e) {
  if (!t) return;
  const n = ee[t];
  if (de[t] = e, !!n)
    for (; n.length; )
      n[0](t, e), n.splice(0, 1);
}
function xe(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || Ee)(e) : (t.success || Ee)(t);
}
function sn(t, e, n, i, r, s, o, a) {
  let c = t.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (c = "e");
    } catch (l) {
      l.code !== 18 && (c = "e");
    }
  if (c === "e") {
    if (s += 1, s < o)
      return it(e, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(e, c, t.defaultPrevented);
}
function it(t, e, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || Ee, c = t.replace(/[\?|#].*$/, ""), l = t.replace(/^(css|img|module|nomodule)!/, "");
  let f, h, p;
  if (i = i || 0, /(^css!|\.css$)/.test(c))
    p = r.createElement("link"), p.rel = "stylesheet", p.href = l, f = "hideFocus" in p, f && p.relList && (f = 0, p.rel = "preload", p.as = "style"), n.inlineStyleNonce && p.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(c))
    p = r.createElement("img"), p.src = l;
  else if (p = r.createElement("script"), p.src = l, p.async = s === void 0 ? !0 : s, n.inlineScriptNonce && p.setAttribute("nonce", n.inlineScriptNonce), h = "noModule" in p, /^module!/.test(c)) {
    if (!h) return e(t, "l");
    p.type = "module";
  } else if (/^nomodule!/.test(c) && h)
    return e(t, "l");
  const g = function(T) {
    sn(T, t, p, e, n, i, o, f);
  };
  p.addEventListener("load", g, { once: !0 }), p.addEventListener("error", g, { once: !0 }), a(t, p) !== !1 && r.head.appendChild(p);
}
function on(t, e, n) {
  t = Array.isArray(t) ? t : [t];
  let i = t.length, r = [];
  function s(o, a, c) {
    if (a === "e" && r.push(o), a === "b")
      if (c) r.push(o);
      else return;
    i--, i || e(r);
  }
  for (let o = 0; o < t.length; o++)
    it(t[o], s, n);
}
function P(t, e, n) {
  let i, r;
  if (e && typeof e == "string" && e.trim && (i = e.trim()), r = (i ? n : e) || {}, i) {
    if (i in Q)
      throw "LoadJS";
    Q[i] = !0;
  }
  function s(o, a) {
    on(t, function(c) {
      xe(r, c), o && xe({ success: o, error: a }, c), nt(i, c);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
P.ready = function(e, n) {
  return rn(e, function(i) {
    xe(n, i);
  }), P;
};
P.done = function(e) {
  nt(e, []);
};
P.reset = function() {
  Object.keys(Q).forEach((e) => delete Q[e]), Object.keys(de).forEach((e) => delete de[e]), Object.keys(ee).forEach((e) => delete ee[e]);
};
P.isDefined = function(e) {
  return e in Q;
};
function an(t) {
  t.data("rzAccordion", () => ({
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
function cn(t) {
  t.data("rzAccordionSection", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const e = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== e.sectionId && !e.allowMultiple && (e.open = !1);
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
function ln(t) {
  t.data("rzAlert", () => ({
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
function dn(t) {
  t.data("rzBrowser", () => ({
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
function un(t) {
  t.data("rzCheckboxGroupItem", () => ({
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
function fn(t, e) {
  t.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const n = JSON.parse(this.$el.dataset.assets), i = this.$el.dataset.codeid, r = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, e(n, {
        success: function() {
          const s = document.getElementById(i);
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
function hn(t, e) {
  t.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    init() {
      const n = this.$el.dataset.config, i = document.getElementById(this.$el.dataset.uid + "-input");
      if (n) {
        const o = JSON.parse(n);
        o && (this.options = o.options || {}, this.placeholder = o.placeholder || "", this.prependText = o.prependText || "");
      }
      const r = JSON.parse(this.$el.dataset.assets), s = this.$el.dataset.nonce;
      e(r, {
        success: function() {
          window.flatpickr && i && window.flatpickr(i, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, s);
    }
  }));
}
const Me = Math.min, J = Math.max, ue = Math.round, D = (t) => ({
  x: t,
  y: t
});
function rt(t) {
  return t.split("-")[0];
}
function pn(t) {
  return t.split("-")[1];
}
function gn(t) {
  return t === "x" ? "y" : "x";
}
function vn(t) {
  return t === "y" ? "height" : "width";
}
function st(t) {
  return ["top", "bottom"].includes(rt(t)) ? "y" : "x";
}
function mn(t) {
  return gn(st(t));
}
function ot(t) {
  const {
    x: e,
    y: n,
    width: i,
    height: r
  } = t;
  return {
    width: i,
    height: r,
    top: n,
    left: e,
    right: e + i,
    bottom: n + r,
    x: e,
    y: n
  };
}
function Pe(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = st(e), o = mn(e), a = vn(o), c = rt(e), l = s === "y", f = i.x + i.width / 2 - r.width / 2, h = i.y + i.height / 2 - r.height / 2, p = i[a] / 2 - r[a] / 2;
  let g;
  switch (c) {
    case "top":
      g = {
        x: f,
        y: i.y - r.height
      };
      break;
    case "bottom":
      g = {
        x: f,
        y: i.y + i.height
      };
      break;
    case "right":
      g = {
        x: i.x + i.width,
        y: h
      };
      break;
    case "left":
      g = {
        x: i.x - r.width,
        y: h
      };
      break;
    default:
      g = {
        x: i.x,
        y: i.y
      };
  }
  switch (pn(e)) {
    case "start":
      g[o] -= p * (n && l ? -1 : 1);
      break;
    case "end":
      g[o] += p * (n && l ? -1 : 1);
      break;
  }
  return g;
}
const bn = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), c = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let l = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: r
  }), {
    x: f,
    y: h
  } = Pe(l, i, c), p = i, g = {}, T = 0;
  for (let w = 0; w < a.length; w++) {
    const {
      name: x,
      fn: k
    } = a[w], {
      x: R,
      y: F,
      data: z,
      reset: m
    } = await k({
      x: f,
      y: h,
      initialPlacement: i,
      placement: p,
      strategy: r,
      middlewareData: g,
      rects: l,
      platform: o,
      elements: {
        reference: t,
        floating: e
      }
    });
    f = R ?? f, h = F ?? h, g = {
      ...g,
      [x]: {
        ...g[x],
        ...z
      }
    }, m && T <= 50 && (T++, typeof m == "object" && (m.placement && (p = m.placement), m.rects && (l = m.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : m.rects), {
      x: f,
      y: h
    } = Pe(l, p, c)), w = -1);
  }
  return {
    x: f,
    y: h,
    placement: p,
    strategy: r,
    middlewareData: g
  };
};
function fe() {
  return typeof window < "u";
}
function q(t) {
  return at(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function C(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function _(t) {
  var e;
  return (e = (at(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function at(t) {
  return fe() ? t instanceof Node || t instanceof C(t).Node : !1;
}
function N(t) {
  return fe() ? t instanceof Element || t instanceof C(t).Element : !1;
}
function $(t) {
  return fe() ? t instanceof HTMLElement || t instanceof C(t).HTMLElement : !1;
}
function Be(t) {
  return !fe() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof C(t).ShadowRoot;
}
function ne(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = L(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(r);
}
function wn(t) {
  return ["table", "td", "th"].includes(q(t));
}
function he(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function Ie(t) {
  const e = Ce(), n = N(t) ? L(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function yn(t) {
  let e = B(t);
  for (; $(e) && !j(e); ) {
    if (Ie(e))
      return e;
    if (he(e))
      return null;
    e = B(e);
  }
  return null;
}
function Ce() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function j(t) {
  return ["html", "body", "#document"].includes(q(t));
}
function L(t) {
  return C(t).getComputedStyle(t);
}
function pe(t) {
  return N(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function B(t) {
  if (q(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Be(t) && t.host || // Fallback.
    _(t)
  );
  return Be(e) ? e.host : e;
}
function ct(t) {
  const e = B(t);
  return j(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : $(e) && ne(e) ? e : ct(e);
}
function lt(t, e, n) {
  var i;
  e === void 0 && (e = []);
  const r = ct(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = C(r);
  return s ? (Te(o), e.concat(o, o.visualViewport || [], ne(r) ? r : [], [])) : e.concat(r, lt(r, []));
}
function Te(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function dt(t) {
  const e = L(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = $(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = ue(n) !== s || ue(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function ut(t) {
  return N(t) ? t : t.contextElement;
}
function Y(t) {
  const e = ut(t);
  if (!$(e))
    return D(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = dt(e);
  let o = (s ? ue(n.width) : n.width) / i, a = (s ? ue(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const En = /* @__PURE__ */ D(0);
function ft(t) {
  const e = C(t);
  return !Ce() || !e.visualViewport ? En : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function xn(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== C(t) ? !1 : e;
}
function te(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = ut(t);
  let o = D(1);
  e && (i ? N(i) && (o = Y(i)) : o = Y(t));
  const a = xn(s, n, i) ? ft(s) : D(0);
  let c = (r.left + a.x) / o.x, l = (r.top + a.y) / o.y, f = r.width / o.x, h = r.height / o.y;
  if (s) {
    const p = C(s), g = i && N(i) ? C(i) : i;
    let T = p, w = Te(T);
    for (; w && i && g !== T; ) {
      const x = Y(w), k = w.getBoundingClientRect(), R = L(w), F = k.left + (w.clientLeft + parseFloat(R.paddingLeft)) * x.x, z = k.top + (w.clientTop + parseFloat(R.paddingTop)) * x.y;
      c *= x.x, l *= x.y, f *= x.x, h *= x.y, c += F, l += z, T = C(w), w = Te(T);
    }
  }
  return ot({
    width: f,
    height: h,
    x: c,
    y: l
  });
}
function Se(t, e) {
  const n = pe(t).scrollLeft;
  return e ? e.left + n : te(_(t)).left + n;
}
function ht(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), r = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Se(t, i)
  )), s = i.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Tn(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = _(i), a = e ? he(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = D(1);
  const f = D(0), h = $(i);
  if ((h || !h && !s) && ((q(i) !== "body" || ne(o)) && (c = pe(i)), $(i))) {
    const g = te(i);
    l = Y(i), f.x = g.x + i.clientLeft, f.y = g.y + i.clientTop;
  }
  const p = o && !h && !s ? ht(o, c, !0) : D(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - c.scrollLeft * l.x + f.x + p.x,
    y: n.y * l.y - c.scrollTop * l.y + f.y + p.y
  };
}
function In(t) {
  return Array.from(t.getClientRects());
}
function Cn(t) {
  const e = _(t), n = pe(t), i = t.ownerDocument.body, r = J(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = J(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Se(t);
  const a = -n.scrollTop;
  return L(i).direction === "rtl" && (o += J(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function Sn(t, e) {
  const n = C(t), i = _(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, c = 0;
  if (r) {
    s = r.width, o = r.height;
    const l = Ce();
    (!l || l && e === "fixed") && (a = r.offsetLeft, c = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: c
  };
}
function On(t, e) {
  const n = te(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = $(t) ? Y(t) : D(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, c = r * s.x, l = i * s.y;
  return {
    width: o,
    height: a,
    x: c,
    y: l
  };
}
function We(t, e, n) {
  let i;
  if (e === "viewport")
    i = Sn(t, n);
  else if (e === "document")
    i = Cn(_(t));
  else if (N(e))
    i = On(e, n);
  else {
    const r = ft(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return ot(i);
}
function pt(t, e) {
  const n = B(t);
  return n === e || !N(n) || j(n) ? !1 : L(n).position === "fixed" || pt(n, e);
}
function Nn(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = lt(t, []).filter((a) => N(a) && q(a) !== "body"), r = null;
  const s = L(t).position === "fixed";
  let o = s ? B(t) : t;
  for (; N(o) && !j(o); ) {
    const a = L(o), c = Ie(o);
    !c && a.position === "fixed" && (r = null), (s ? !c && !r : !c && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || ne(o) && !c && pt(t, o)) ? i = i.filter((f) => f !== o) : r = a, o = B(o);
  }
  return e.set(t, i), i;
}
function Ln(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? he(e) ? [] : Nn(e, this._c) : [].concat(n), i], a = o[0], c = o.reduce((l, f) => {
    const h = We(e, f, r);
    return l.top = J(h.top, l.top), l.right = Me(h.right, l.right), l.bottom = Me(h.bottom, l.bottom), l.left = J(h.left, l.left), l;
  }, We(e, a, r));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function kn(t) {
  const {
    width: e,
    height: n
  } = dt(t);
  return {
    width: e,
    height: n
  };
}
function Rn(t, e, n) {
  const i = $(e), r = _(e), s = n === "fixed", o = te(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = D(0);
  function l() {
    c.x = Se(r);
  }
  if (i || !i && !s)
    if ((q(e) !== "body" || ne(r)) && (a = pe(e)), i) {
      const g = te(e, !0, s, e);
      c.x = g.x + e.clientLeft, c.y = g.y + e.clientTop;
    } else r && l();
  s && !i && r && l();
  const f = r && !i && !s ? ht(r, a) : D(0), h = o.left + a.scrollLeft - c.x - f.x, p = o.top + a.scrollTop - c.y - f.y;
  return {
    x: h,
    y: p,
    width: o.width,
    height: o.height
  };
}
function be(t) {
  return L(t).position === "static";
}
function He(t, e) {
  if (!$(t) || L(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return _(t) === n && (n = n.ownerDocument.body), n;
}
function gt(t, e) {
  const n = C(t);
  if (he(t))
    return n;
  if (!$(t)) {
    let r = B(t);
    for (; r && !j(r); ) {
      if (N(r) && !be(r))
        return r;
      r = B(r);
    }
    return n;
  }
  let i = He(t, e);
  for (; i && wn(i) && be(i); )
    i = He(i, e);
  return i && j(i) && be(i) && !Ie(i) ? n : i || yn(t) || n;
}
const Fn = async function(t) {
  const e = this.getOffsetParent || gt, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Rn(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Dn(t) {
  return L(t).direction === "rtl";
}
const $n = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Tn,
  getDocumentElement: _,
  getClippingRect: Ln,
  getOffsetParent: gt,
  getElementRects: Fn,
  getClientRects: In,
  getDimensions: kn,
  getScale: Y,
  isElement: N,
  isRTL: Dn
}, An = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: $n,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return bn(t, e, {
    ...r,
    platform: s
  });
};
function _n(t) {
  t.data("rzDropdown", () => ({
    dropdownEl: null,
    triggerEl: null,
    floatingEl: null,
    anchorCss: "",
    dropdownOpen: !1,
    openedWithKeyboard: !1,
    init() {
      this.dropdownEl = this.$el, this.triggerEl = this.dropdownEl.querySelector("[data-trigger]"), this.floatingEl = this.dropdownEl.querySelector("[data-floating]"), this.anchorCss = this.getAnchorCss();
    },
    toggleDropdown() {
      this.anchorCss = this.getAnchorCss(), An(this.triggerEl, this.floatingEl).then(({ x: e, y: n }) => {
        Object.assign(this.floatingEl.style, {
          left: `${e}px`,
          top: `${n}px`
        }), this.dropdownOpen = !this.dropdownOpen;
      });
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
      return "";
    }
  }));
}
function zn(t) {
  t.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const e = typeof window < "u" && "localStorage" in window, n = ["light", "dark", "auto"], i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let r = "auto";
      e && (r = localStorage.getItem("darkMode") ?? "auto", n.includes(r) || (r = "light")), e && localStorage.setItem("darkMode", r), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          r === "dark" || r === "auto" && i
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
      const n = window.matchMedia("(prefers-color-scheme: dark)").matches;
      e === "light" ? e = "dark" : e === "dark" ? e = "light" : e === "auto" && (e = n ? "light" : "dark"), this.mode = e, localStorage.setItem("darkMode", e);
      const i = e === "dark" || e === "auto" && n;
      document.documentElement.classList.toggle("dark", i);
      const r = new CustomEvent("darkModeToggle", {
        detail: { darkMode: i }
      });
      window.dispatchEvent(r);
    },
    destroy() {
      this.applyTheme && window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.applyTheme);
    }
  }));
}
function Mn(t) {
  t.data("rzEmbeddedPreview", () => ({
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
        const i = this.iframe;
        this.onDarkModeToggle = (r) => {
          i.contentWindow.postMessage(r.detail, "*");
        }, window.addEventListener("darkModeToggle", this.onDarkModeToggle);
      } catch {
        console.error("Cannot access iframe content");
      }
    },
    // Adjusts the iframe height based on its content
    resizeIframe(e) {
      if (e)
        try {
          const n = e.contentDocument || e.contentWindow?.document;
          if (n) {
            const i = n.body;
            if (!i)
              setInterval(() => {
                this.resizeIframe(e);
              }, 150);
            else {
              const r = i.scrollHeight + 15;
              e.style.height = r + "px";
            }
          }
        } catch (n) {
          console.error("Error resizing iframe:", n);
        }
    },
    // Debounce helper to limit function calls
    debounce(e, n = 300) {
      let i;
      return (...r) => {
        clearTimeout(i), i = setTimeout(() => {
          e.apply(this, r);
        }, n);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function Pn(t) {
  t.data("rzEmpty", () => {
  });
}
function Bn(t) {
  t.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const e = this;
      if (typeof this.setCurrentHeading == "function") {
        const n = (r, s) => {
          r.forEach((o) => {
            o.isIntersecting && e.setCurrentHeading(e.headingId);
          });
        }, i = { threshold: 0.5 };
        this.observer = new IntersectionObserver(n, i), this.observer.observe(this.$el);
      } else
        console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
    },
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function Wn(t, e) {
  t.data("rzMarkdown", () => ({
    init() {
      const n = JSON.parse(this.$el.dataset.assets), i = this.$el.dataset.nonce;
      e(n, {
        success: function() {
          window.hljs.highlightAll();
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, i);
    }
  }));
}
function Hn(t) {
  t.data("rzModal", () => ({
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
        const n = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", e);
        const i = document.body.offsetWidth - n;
        document.body.style.setProperty("--page-scrollbar-width", `${i}px`), e ? this.$nextTick(() => {
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
      const n = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: e },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(n), n.defaultPrevented || (this.modalOpen = !0);
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(e = "unknown") {
      const n = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason: e },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(n), n.defaultPrevented || (document.activeElement?.blur && document.activeElement.blur(), this.modalOpen = !1, document.body.classList.remove("overflow-hidden"), document.body.style.setProperty("--page-scrollbar-width", "0px"));
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
function Vn(t) {
  t.data("rzPrependInput", () => ({
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
      const e = this.prependContainer, n = this.textInput;
      if (!e || !n) {
        n && n.classList.remove("text-transparent");
        return;
      }
      const r = e.offsetWidth + 10;
      n.style.paddingLeft = r + "px", n.classList.remove("text-transparent");
    }
  }));
}
function Yn(t) {
  t.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const e = this.$el;
      this.currentVal = parseInt(e.getAttribute("data-current-val")) || 0, this.minVal = parseInt(e.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(e.getAttribute("data-max-val")) || 100, this.label = e.getAttribute("data-label"), this.calculatePercentage(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuemin", this.minVal), e.setAttribute("aria-valuemax", this.maxVal), e.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((i) => {
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
      const e = this.$refs.progressBar, n = this.$refs.progressBarLabel, i = this.$refs.innerLabel;
      n && e && i && (i.innerText = this.buildLabel(), n.clientWidth > e.clientWidth ? n.style.left = e.clientWidth + 10 + "px" : n.style.left = e.clientWidth / 2 - n.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const e = this.$refs.progressBarLabel, n = this.$refs.progressBar;
      return e && n && e.clientWidth > n.clientWidth ? "text-on-surface dark:text-on-surface-dark" : "";
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
function jn(t) {
  t.data("rzQuickReferenceContainer", () => ({
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
function qn(t) {
  t.data("rzTabs", () => ({
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
      const n = e.key, i = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), r = i.findIndex((o) => this.tabSelected === o.dataset.name);
      let s = r;
      n === "ArrowRight" ? (s = (r + 1) % i.length, e.preventDefault()) : n === "ArrowLeft" ? (s = (r - 1 + i.length) % i.length, e.preventDefault()) : n === "Home" ? (s = 0, e.preventDefault()) : n === "End" && (s = i.length - 1, e.preventDefault()), s !== r && this.tabButtonClicked(i[s]);
    }
  }));
}
function Gn(t) {
  t.data("rzSidebar", () => ({
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
function Un(t) {
  t.data("rzSidebarLinkItem", () => ({
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
        let n = t.$data(e);
        n.showSidebar = !1;
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
async function Zn(t) {
  t = [...t].sort();
  const e = t.join("|"), i = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ae(t, e, n) {
  Zn(t).then((i) => {
    P.isDefined(i) || P(
      t,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), P.ready([i], e);
  });
}
function Kn(t) {
  an(t), cn(t), ln(t), dn(t), un(t), fn(t, ae), hn(t, ae), _n(t), zn(t), Mn(t), Pn(t), Bn(t), Wn(t, ae), Hn(t), Vn(t), Yn(t), jn(t), qn(t), Gn(t), Un(t);
}
function Xn(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return;
  }
  let e = null, n = null;
  if (typeof t == "string") {
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    if (n = t, e = document.getElementById(n), !e) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${n}" not found in the DOM.`);
      return;
    }
  } else if (t instanceof Element) {
    if (e = t, !e.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return;
    }
    n = e.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return;
  }
  const i = `[data-alpine-root="${n}"]`;
  let r = null;
  if (e.matches(i) ? r = e : r = e.querySelector(i), !r) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${i}" on or inside the wrapper element (ID: #${n}). Verify the 'data-alpine-root' attribute placement.`
    );
    return;
  }
  const s = Alpine.$data(r);
  if (s === void 0) {
    const o = `${r.tagName.toLowerCase()}${r.id ? "#" + r.id : ""}${r.classList.length ? "." + Array.from(r.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${o}) via 'data-alpine-root="${n}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return s;
}
V.plugin(mt);
V.plugin(xt);
V.plugin(Vt);
Kn(V);
const Jn = {
  Alpine: V,
  require: ae,
  toast: nn,
  $data: Xn
};
window.Alpine = V;
window.Rizzy = { ...window.Rizzy || {}, ...Jn };
V.start();
export {
  Jn as default
};
