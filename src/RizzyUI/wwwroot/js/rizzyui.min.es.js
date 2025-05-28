import X from "alpinejs";
function Nt(t) {
  t.directive("collapse", e), e.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function e(n, { modifiers: i }) {
    let r = Pe(i, "duration", 250) / 1e3, s = Pe(i, "min", 0), o = !i.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (c, f) => {
      let d = t.setStyles(c, f);
      return f.height ? () => {
      } : d;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(c = () => {
      }, f = () => {
      }) {
        o && (n.hidden = !1), o && (n.style.display = null);
        let d = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let p = n.getBoundingClientRect().height;
        d === p && (d = s), t.transition(n, t.setStyles, {
          during: l,
          start: { height: d + "px" },
          end: { height: p + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - p) < 1 && (n.style.overflow = null);
        });
      },
      out(c = () => {
      }, f = () => {
      }) {
        let d = n.getBoundingClientRect().height;
        t.transition(n, a, {
          during: l,
          start: { height: d + "px" },
          end: { height: s + "px" }
        }, () => n.style.overflow = "hidden", () => {
          n._x_isShown = !1, n.style.height == `${s}px` && o && (n.style.display = "none", n.hidden = !0);
        });
      }
    };
  }
}
function Pe(t, e, n) {
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
var Lt = Nt;
function Rt(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: At(r),
      threshold: kt(r)
    }, c = new IntersectionObserver((f) => {
      f.forEach((d) => {
        d.isIntersecting !== (n === "leave") && (a(), r.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(e), o(() => {
      c.disconnect();
    });
  }));
}
function kt(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function Ft(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function At(t) {
  const e = "margin", n = "0px 0px 0px 0px", i = t.indexOf(e);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Ft(t[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var Dt = Rt, Qe = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], pe = /* @__PURE__ */ Qe.join(","), et = typeof Element > "u", Z = et ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Oe = !et && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, tt = function(e, n, i) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(pe));
  return n && Z.call(e, pe) && r.unshift(e), r = r.filter(i), r;
}, nt = function t(e, n, i) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var f = Z.call(o, pe);
      f && i.filter(o) && (n || !e.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), p = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && p) {
        var g = t(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, g) : r.push({
          scope: o,
          candidates: g
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, it = function(e, n) {
  return e.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, $t = function(e, n) {
  return e.tabIndex === n.tabIndex ? e.documentOrder - n.documentOrder : e.tabIndex - n.tabIndex;
}, rt = function(e) {
  return e.tagName === "INPUT";
}, _t = function(e) {
  return rt(e) && e.type === "hidden";
}, Pt = function(e) {
  var n = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, zt = function(e, n) {
  for (var i = 0; i < e.length; i++)
    if (e[i].checked && e[i].form === n)
      return e[i];
}, Mt = function(e) {
  if (!e.name)
    return !0;
  var n = e.form || Oe(e), i = function(a) {
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
  var s = zt(r, e.form);
  return !s || s === e;
}, Bt = function(e) {
  return rt(e) && e.type === "radio";
}, Wt = function(e) {
  return Bt(e) && !Mt(e);
}, ze = function(e) {
  var n = e.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Vt = function(e, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = Z.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (Z.call(o, "details:not([open]) *"))
    return !0;
  var a = Oe(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var f = e.parentElement, d = Oe(e);
        if (f && !f.shadowRoot && r(f) === !0)
          return ze(e);
        e.assignedSlot ? e = e.assignedSlot : !f && d !== e.ownerDocument ? e = d.host : e = f;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (i === "non-zero-area")
    return ze(e);
  return !1;
}, Ht = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var n = e.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return Z.call(n, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, ge = function(e, n) {
  return !(n.disabled || _t(n) || Vt(n, e) || // For a details element with a summary, the summary element gets the focus
  Pt(n) || Ht(n));
}, Ne = function(e, n) {
  return !(Wt(n) || it(n) < 0 || !ge(e, n));
}, Yt = function(e) {
  var n = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, jt = function t(e) {
  var n = [], i = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = it(a, o), c = o ? t(r.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), i.sort($t).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, qt = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = nt([e], n.includeContainer, {
    filter: Ne.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Yt
  }) : i = tt(e, n.includeContainer, Ne.bind(null, n)), jt(i);
}, st = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = nt([e], n.includeContainer, {
    filter: ge.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = tt(e, n.includeContainer, ge.bind(null, n)), i;
}, de = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return Z.call(e, pe) === !1 ? !1 : Ne(n, e);
}, Gt = /* @__PURE__ */ Qe.concat("iframe").join(","), fe = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return Z.call(e, Gt) === !1 ? !1 : ge(n, e);
};
function Me(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Be(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Me(Object(n), !0).forEach(function(i) {
      Ut(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Me(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function Ut(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t;
}
var We = /* @__PURE__ */ function() {
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
}(), Zt = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Kt = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, Xt = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, Ve = function(e) {
  return setTimeout(e, 0);
}, He = function(e, n) {
  var i = -1;
  return e.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, ne = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, i) : e;
}, ue = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Jt = function(e, n) {
  var i = n?.document || document, r = Be({
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
  }, o, a = function(u, h, m) {
    return u && u[h] !== void 0 ? u[h] : r[m || h];
  }, l = function(u) {
    return s.containerGroups.findIndex(function(h) {
      var m = h.container, T = h.tabbableNodes;
      return m.contains(u) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(x) {
        return x === u;
      });
    });
  }, c = function(u) {
    var h = r[u];
    if (typeof h == "function") {
      for (var m = arguments.length, T = new Array(m > 1 ? m - 1 : 0), x = 1; x < m; x++)
        T[x - 1] = arguments[x];
      h = h.apply(void 0, T);
    }
    if (h === !0 && (h = void 0), !h) {
      if (h === void 0 || h === !1)
        return h;
      throw new Error("`".concat(u, "` was specified but was not a node, or did not return a node"));
    }
    var I = h;
    if (typeof h == "string" && (I = i.querySelector(h), !I))
      throw new Error("`".concat(u, "` as selector refers to no known node"));
    return I;
  }, f = function() {
    var u = c("initialFocus");
    if (u === !1)
      return !1;
    if (u === void 0)
      if (l(i.activeElement) >= 0)
        u = i.activeElement;
      else {
        var h = s.tabbableGroups[0], m = h && h.firstTabbableNode;
        u = m || c("fallbackFocus");
      }
    if (!u)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return u;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(u) {
      var h = qt(u, r.tabbableOptions), m = st(u, r.tabbableOptions);
      return {
        container: u,
        tabbableNodes: h,
        focusableNodes: m,
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
          var I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, L = m.findIndex(function(R) {
            return R === x;
          });
          if (!(L < 0))
            return I ? m.slice(L + 1).find(function(R) {
              return de(R, r.tabbableOptions);
            }) : m.slice(0, L).reverse().find(function(R) {
              return de(R, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(u) {
      return u.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, p = function b(u) {
    if (u !== !1 && u !== i.activeElement) {
      if (!u || !u.focus) {
        b(f());
        return;
      }
      u.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = u, Zt(u) && u.select();
    }
  }, g = function(u) {
    var h = c("setReturnFocus", u);
    return h || (h === !1 ? !1 : u);
  }, v = function(u) {
    var h = ue(u);
    if (!(l(h) >= 0)) {
      if (ne(r.clickOutsideDeactivates, u)) {
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
          returnFocus: r.returnFocusOnDeactivate && !fe(h, r.tabbableOptions)
        });
        return;
      }
      ne(r.allowOutsideClick, u) || u.preventDefault();
    }
  }, y = function(u) {
    var h = ue(u), m = l(h) >= 0;
    m || h instanceof Document ? m && (s.mostRecentlyFocusedNode = h) : (u.stopImmediatePropagation(), p(s.mostRecentlyFocusedNode || f()));
  }, w = function(u) {
    var h = ue(u);
    d();
    var m = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(h), x = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        u.shiftKey ? m = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : m = s.tabbableGroups[0].firstTabbableNode;
      else if (u.shiftKey) {
        var I = He(s.tabbableGroups, function(D) {
          var A = D.firstTabbableNode;
          return h === A;
        });
        if (I < 0 && (x.container === h || fe(h, r.tabbableOptions) && !de(h, r.tabbableOptions) && !x.nextTabbableNode(h, !1)) && (I = T), I >= 0) {
          var L = I === 0 ? s.tabbableGroups.length - 1 : I - 1, R = s.tabbableGroups[L];
          m = R.lastTabbableNode;
        }
      } else {
        var P = He(s.tabbableGroups, function(D) {
          var A = D.lastTabbableNode;
          return h === A;
        });
        if (P < 0 && (x.container === h || fe(h, r.tabbableOptions) && !de(h, r.tabbableOptions) && !x.nextTabbableNode(h)) && (P = T), P >= 0) {
          var F = P === s.tabbableGroups.length - 1 ? 0 : P + 1, G = s.tabbableGroups[F];
          m = G.firstTabbableNode;
        }
      }
    } else
      m = c("fallbackFocus");
    m && (u.preventDefault(), p(m));
  }, C = function(u) {
    if (Kt(u) && ne(r.escapeDeactivates, u) !== !1) {
      u.preventDefault(), o.deactivate();
      return;
    }
    if (Xt(u)) {
      w(u);
      return;
    }
  }, S = function(u) {
    var h = ue(u);
    l(h) >= 0 || ne(r.clickOutsideDeactivates, u) || ne(r.allowOutsideClick, u) || (u.preventDefault(), u.stopImmediatePropagation());
  }, O = function() {
    if (s.active)
      return We.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? Ve(function() {
        p(f());
      }) : p(f()), i.addEventListener("focusin", y, !0), i.addEventListener("mousedown", v, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", v, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", S, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", C, {
        capture: !0,
        passive: !1
      }), o;
  }, N = function() {
    if (s.active)
      return i.removeEventListener("focusin", y, !0), i.removeEventListener("mousedown", v, !0), i.removeEventListener("touchstart", v, !0), i.removeEventListener("click", S, !0), i.removeEventListener("keydown", C, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(u) {
      if (s.active)
        return this;
      var h = a(u, "onActivate"), m = a(u, "onPostActivate"), T = a(u, "checkCanFocusTrap");
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, h && h();
      var x = function() {
        T && d(), O(), m && m();
      };
      return T ? (T(s.containers.concat()).then(x, x), this) : (x(), this);
    },
    deactivate: function(u) {
      if (!s.active)
        return this;
      var h = Be({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, u);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, N(), s.active = !1, s.paused = !1, We.deactivateTrap(o);
      var m = a(h, "onDeactivate"), T = a(h, "onPostDeactivate"), x = a(h, "checkCanReturnFocus"), I = a(h, "returnFocus", "returnFocusOnDeactivate");
      m && m();
      var L = function() {
        Ve(function() {
          I && p(g(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return I && x ? (x(g(s.nodeFocusedBeforeActivation)).then(L, L), this) : (L(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, N(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), O(), this);
    },
    updateContainerElements: function(u) {
      var h = [].concat(u).filter(Boolean);
      return s.containers = h.map(function(m) {
        return typeof m == "string" ? i.querySelector(m) : m;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(e), o;
};
function Qt(t) {
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
        return fe(s);
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
        return Array.isArray(r) ? r : st(r, { displayCheck: "none" });
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
    (i, { expression: r, modifiers: s }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let c = a(r), f = !1, d = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => i
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let w = i.querySelector("[autofocus]");
        w && (d.initialFocus = w);
      }
      let p = Jt(i, d), g = () => {
      }, v = () => {
      };
      const y = () => {
        g(), g = () => {
        }, v(), v = () => {
        }, p.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((w) => {
        f !== w && (w && !f && (s.includes("noscroll") && (v = en()), s.includes("inert") && (g = Ye(i)), setTimeout(() => {
          p.activate();
        }, 15)), !w && f && y(), f = !!w);
      })), l(y);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && Ye(i);
    }
  ));
}
function Ye(t) {
  let e = [];
  return ot(t, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), e.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function ot(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((n) => {
    n.isSameNode(t) ? ot(t.parentNode, e) : e(n);
  });
}
function en() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var tn = Qt;
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
function nn(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function rn(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
  }
}
function sn(t, e, n) {
  return e && rn(t.prototype, e), t;
}
var on = Object.defineProperty, W = function(t, e) {
  return on(t, "name", { value: e, configurable: !0 });
}, an = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, ln = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, cn = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, dn = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, un = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, fn = W(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), ie = W(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), E = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, Y = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, je = { OUTLINE: "outline", FILLED: "filled" }, Se = { FADE: "fade", SLIDE: "slide" }, re = { CLOSE: ie(an), SUCCESS: ie(dn), ERROR: ie(ln), WARNING: ie(un), INFO: ie(cn) }, qe = W(function(t) {
  t.wrapper.classList.add(E.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(E.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Ge = W(function(t) {
  t.wrapper.classList.remove(E.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), hn = W(function(t) {
  t.wrapper.classList.add(E.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(E.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), pn = W(function(t) {
  t.wrapper.classList.remove(E.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), at = function() {
  function t(e) {
    var n = this;
    nn(this, t), this.notifyOut = W(function(D) {
      D(n);
    }, "notifyOut");
    var i = e.notificationsGap, r = i === void 0 ? 20 : i, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, f = c === void 0 ? Se.FADE : c, d = e.type, p = d === void 0 ? "outline" : d, g = e.title, v = e.text, y = e.showIcon, w = y === void 0 ? !0 : y, C = e.customIcon, S = C === void 0 ? "" : C, O = e.customClass, N = O === void 0 ? "" : O, b = e.speed, u = b === void 0 ? 500 : b, h = e.showCloseButton, m = h === void 0 ? !0 : h, T = e.autoclose, x = T === void 0 ? !0 : T, I = e.autotimeout, L = I === void 0 ? 3e3 : I, R = e.position, P = R === void 0 ? "right top" : R, F = e.customWrapper, G = F === void 0 ? "" : F;
    if (this.customWrapper = G, this.status = l, this.title = g, this.text = v, this.showIcon = w, this.customIcon = S, this.customClass = N, this.speed = u, this.effect = f, this.showCloseButton = m, this.autoclose = x, this.autotimeout = L, this.notificationsGap = r, this.notificationsPadding = o, this.type = p, this.position = P, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return sn(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(E.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(E.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](E.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](E.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](E.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](E.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](E.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](E.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](E.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(E.NOTIFY_CLOSE), i.innerHTML = re.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = fn(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(E.NOTIFY), this.type) {
      case je.OUTLINE:
        this.wrapper.classList.add(E.NOTIFY_OUTLINE);
        break;
      case je.FILLED:
        this.wrapper.classList.add(E.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(E.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case Y.SUCCESS:
        this.wrapper.classList.add(E.NOTIFY_SUCCESS);
        break;
      case Y.ERROR:
        this.wrapper.classList.add(E.NOTIFY_ERROR);
        break;
      case Y.WARNING:
        this.wrapper.classList.add(E.NOTIFY_WARNING);
        break;
      case Y.INFO:
        this.wrapper.classList.add(E.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(E.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(E.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(E.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(E.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = W(function(r) {
      switch (r) {
        case Y.SUCCESS:
          return re.SUCCESS;
        case Y.ERROR:
          return re.ERROR;
        case Y.WARNING:
          return re.WARNING;
        case Y.INFO:
          return re.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(E.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
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
      case Se.FADE:
        this.selectedNotifyInEffect = qe, this.selectedNotifyOutEffect = Ge;
        break;
      case Se.SLIDE:
        this.selectedNotifyInEffect = hn, this.selectedNotifyOutEffect = pn;
        break;
      default:
        this.selectedNotifyInEffect = qe, this.selectedNotifyOutEffect = Ge;
    }
  } }]), t;
}();
W(at, "Notify");
var lt = at;
globalThis.Notify = lt;
const ct = ["success", "error", "warning", "info"], dt = [
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
], ut = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function se(t = {}) {
  const e = {
    ...ut,
    ...t
  };
  ct.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), dt.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new lt(e);
}
const gn = {
  custom: se,
  success(t, e = "Success", n = {}) {
    se({
      status: "success",
      title: e,
      text: t,
      ...n
    });
  },
  error(t, e = "Error", n = {}) {
    se({
      status: "error",
      title: e,
      text: t,
      ...n
    });
  },
  warning(t, e = "Warning", n = {}) {
    se({
      status: "warning",
      title: e,
      text: t,
      ...n
    });
  },
  info(t, e = "Info", n = {}) {
    se({
      status: "info",
      title: e,
      text: t,
      ...n
    });
  },
  setDefaults(t = {}) {
    Object.assign(ut, t);
  },
  get allowedStatuses() {
    return [...ct];
  },
  get allowedPositions() {
    return [...dt];
  }
}, Le = function() {
}, oe = {}, me = {}, ae = {};
function mn(t, e) {
  t = Array.isArray(t) ? t : [t];
  const n = [];
  let i = t.length, r = i, s, o, a, l;
  for (s = function(c, f) {
    f.length && n.push(c), r--, r || e(n);
  }; i--; ) {
    if (o = t[i], a = me[o], a) {
      s(o, a);
      continue;
    }
    l = ae[o] = ae[o] || [], l.push(s);
  }
}
function ft(t, e) {
  if (!t) return;
  const n = ae[t];
  if (me[t] = e, !!n)
    for (; n.length; )
      n[0](t, e), n.splice(0, 1);
}
function Re(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || Le)(e) : (t.success || Le)(t);
}
function vn(t, e, n, i, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return ht(e, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(e, l, t.defaultPrevented);
}
function ht(t, e, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || Le, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
  let f, d, p;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    p = r.createElement("link"), p.rel = "stylesheet", p.href = c, f = "hideFocus" in p, f && p.relList && (f = 0, p.rel = "preload", p.as = "style"), n.inlineStyleNonce && p.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    p = r.createElement("img"), p.src = c;
  else if (p = r.createElement("script"), p.src = c, p.async = s === void 0 ? !0 : s, n.inlineScriptNonce && p.setAttribute("nonce", n.inlineScriptNonce), d = "noModule" in p, /^module!/.test(l)) {
    if (!d) return e(t, "l");
    p.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return e(t, "l");
  const g = function(v) {
    vn(v, t, p, e, n, i, o, f);
  };
  p.addEventListener("load", g, { once: !0 }), p.addEventListener("error", g, { once: !0 }), a(t, p) !== !1 && r.head.appendChild(p);
}
function bn(t, e, n) {
  t = Array.isArray(t) ? t : [t];
  let i = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || e(r);
  }
  for (let o = 0; o < t.length; o++)
    ht(t[o], s, n);
}
function j(t, e, n) {
  let i, r;
  if (e && typeof e == "string" && e.trim && (i = e.trim()), r = (i ? n : e) || {}, i) {
    if (i in oe)
      throw "LoadJS";
    oe[i] = !0;
  }
  function s(o, a) {
    bn(t, function(l) {
      Re(r, l), o && Re({ success: o, error: a }, l), ft(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
j.ready = function(e, n) {
  return mn(e, function(i) {
    Re(n, i);
  }), j;
};
j.done = function(e) {
  ft(e, []);
};
j.reset = function() {
  Object.keys(oe).forEach((e) => delete oe[e]), Object.keys(me).forEach((e) => delete me[e]), Object.keys(ae).forEach((e) => delete ae[e]);
};
j.isDefined = function(e) {
  return e in oe;
};
function wn(t) {
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
function yn(t) {
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
function xn(t) {
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
function En(t) {
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
function Tn(t) {
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
function Cn(t, e) {
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
function Sn(t, e) {
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
const ke = Math.min, J = Math.max, ve = Math.round, M = (t) => ({
  x: t,
  y: t
}), In = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, On = {
  start: "end",
  end: "start"
};
function Ue(t, e, n) {
  return J(t, ke(e, n));
}
function ye(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function K(t) {
  return t.split("-")[0];
}
function xe(t) {
  return t.split("-")[1];
}
function pt(t) {
  return t === "x" ? "y" : "x";
}
function gt(t) {
  return t === "y" ? "height" : "width";
}
function U(t) {
  return ["top", "bottom"].includes(K(t)) ? "y" : "x";
}
function mt(t) {
  return pt(U(t));
}
function Nn(t, e, n) {
  n === void 0 && (n = !1);
  const i = xe(t), r = mt(t), s = gt(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = be(o)), [o, be(o)];
}
function Ln(t) {
  const e = be(t);
  return [Fe(t), e, Fe(e)];
}
function Fe(t) {
  return t.replace(/start|end/g, (e) => On[e]);
}
function Rn(t, e, n) {
  const i = ["left", "right"], r = ["right", "left"], s = ["top", "bottom"], o = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? r : i : e ? i : r;
    case "left":
    case "right":
      return e ? s : o;
    default:
      return [];
  }
}
function kn(t, e, n, i) {
  const r = xe(t);
  let s = Rn(K(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(Fe)))), s;
}
function be(t) {
  return t.replace(/left|right|bottom|top/g, (e) => In[e]);
}
function Fn(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function An(t) {
  return typeof t != "number" ? Fn(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function we(t) {
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
function Ze(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = U(e), o = mt(e), a = gt(o), l = K(e), c = s === "y", f = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, p = i[a] / 2 - r[a] / 2;
  let g;
  switch (l) {
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
        y: d
      };
      break;
    case "left":
      g = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      g = {
        x: i.x,
        y: i.y
      };
  }
  switch (xe(e)) {
    case "start":
      g[o] -= p * (n && c ? -1 : 1);
      break;
    case "end":
      g[o] += p * (n && c ? -1 : 1);
      break;
  }
  return g;
}
const Dn = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: r
  }), {
    x: f,
    y: d
  } = Ze(c, i, l), p = i, g = {}, v = 0;
  for (let y = 0; y < a.length; y++) {
    const {
      name: w,
      fn: C
    } = a[y], {
      x: S,
      y: O,
      data: N,
      reset: b
    } = await C({
      x: f,
      y: d,
      initialPlacement: i,
      placement: p,
      strategy: r,
      middlewareData: g,
      rects: c,
      platform: o,
      elements: {
        reference: t,
        floating: e
      }
    });
    f = S ?? f, d = O ?? d, g = {
      ...g,
      [w]: {
        ...g[w],
        ...N
      }
    }, b && v <= 50 && (v++, typeof b == "object" && (b.placement && (p = b.placement), b.rects && (c = b.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : b.rects), {
      x: f,
      y: d
    } = Ze(c, p, l)), y = -1);
  }
  return {
    x: f,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: g
  };
};
async function vt(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: i,
    y: r,
    platform: s,
    rects: o,
    elements: a,
    strategy: l
  } = t, {
    boundary: c = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: d = "floating",
    altBoundary: p = !1,
    padding: g = 0
  } = ye(e, t), v = An(g), w = a[p ? d === "floating" ? "reference" : "floating" : d], C = we(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(w))) == null || n ? w : w.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: f,
    strategy: l
  })), S = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, O = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), N = await (s.isElement == null ? void 0 : s.isElement(O)) ? await (s.getScale == null ? void 0 : s.getScale(O)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, b = we(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: O,
    strategy: l
  }) : S);
  return {
    top: (C.top - b.top + v.top) / N.y,
    bottom: (b.bottom - C.bottom + v.bottom) / N.y,
    left: (C.left - b.left + v.left) / N.x,
    right: (b.right - C.right + v.right) / N.x
  };
}
const $n = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, i;
      const {
        placement: r,
        middlewareData: s,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = e, {
        mainAxis: f = !0,
        crossAxis: d = !0,
        fallbackPlacements: p,
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: y = !0,
        ...w
      } = ye(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const C = K(r), S = U(a), O = K(a) === a, N = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), b = p || (O || !y ? [be(a)] : Ln(a)), u = v !== "none";
      !p && u && b.push(...kn(a, y, v, N));
      const h = [a, ...b], m = await vt(e, w), T = [];
      let x = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (f && T.push(m[C]), d) {
        const F = Nn(r, o, N);
        T.push(m[F[0]], m[F[1]]);
      }
      if (x = [...x, {
        placement: r,
        overflows: T
      }], !T.every((F) => F <= 0)) {
        var I, L;
        const F = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, G = h[F];
        if (G) {
          var R;
          const A = d === "alignment" ? S !== U(G) : !1, z = ((R = x[0]) == null ? void 0 : R.overflows[0]) > 0;
          if (!A || z)
            return {
              data: {
                index: F,
                overflows: x
              },
              reset: {
                placement: G
              }
            };
        }
        let D = (L = x.filter((A) => A.overflows[0] <= 0).sort((A, z) => A.overflows[1] - z.overflows[1])[0]) == null ? void 0 : L.placement;
        if (!D)
          switch (g) {
            case "bestFit": {
              var P;
              const A = (P = x.filter((z) => {
                if (u) {
                  const H = U(z.placement);
                  return H === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  H === "y";
                }
                return !0;
              }).map((z) => [z.placement, z.overflows.filter((H) => H > 0).reduce((H, Ot) => H + Ot, 0)]).sort((z, H) => z[1] - H[1])[0]) == null ? void 0 : P[0];
              A && (D = A);
              break;
            }
            case "initialPlacement":
              D = a;
              break;
          }
        if (r !== D)
          return {
            reset: {
              placement: D
            }
          };
      }
      return {};
    }
  };
};
async function _n(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = K(n), a = xe(n), l = U(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, f = s && l ? -1 : 1, d = ye(e, t);
  let {
    mainAxis: p,
    crossAxis: g,
    alignmentAxis: v
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof v == "number" && (g = a === "end" ? v * -1 : v), l ? {
    x: g * f,
    y: p * c
  } : {
    x: p * c,
    y: g * f
  };
}
const Pn = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, i;
      const {
        x: r,
        y: s,
        placement: o,
        middlewareData: a
      } = e, l = await _n(e, t);
      return o === ((n = a.offset) == null ? void 0 : n.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: r + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, zn = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: i,
        placement: r
      } = e, {
        mainAxis: s = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (w) => {
            let {
              x: C,
              y: S
            } = w;
            return {
              x: C,
              y: S
            };
          }
        },
        ...l
      } = ye(t, e), c = {
        x: n,
        y: i
      }, f = await vt(e, l), d = U(K(r)), p = pt(d);
      let g = c[p], v = c[d];
      if (s) {
        const w = p === "y" ? "top" : "left", C = p === "y" ? "bottom" : "right", S = g + f[w], O = g - f[C];
        g = Ue(S, g, O);
      }
      if (o) {
        const w = d === "y" ? "top" : "left", C = d === "y" ? "bottom" : "right", S = v + f[w], O = v - f[C];
        v = Ue(S, v, O);
      }
      const y = a.fn({
        ...e,
        [p]: g,
        [d]: v
      });
      return {
        ...y,
        data: {
          x: y.x - n,
          y: y.y - i,
          enabled: {
            [p]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Ee() {
  return typeof window < "u";
}
function te(t) {
  return bt(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function k(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function V(t) {
  var e;
  return (e = (bt(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function bt(t) {
  return Ee() ? t instanceof Node || t instanceof k(t).Node : !1;
}
function $(t) {
  return Ee() ? t instanceof Element || t instanceof k(t).Element : !1;
}
function B(t) {
  return Ee() ? t instanceof HTMLElement || t instanceof k(t).HTMLElement : !1;
}
function Ke(t) {
  return !Ee() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof k(t).ShadowRoot;
}
function ce(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = _(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(r);
}
function Mn(t) {
  return ["table", "td", "th"].includes(te(t));
}
function Te(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function De(t) {
  const e = $e(), n = $(t) ? _(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Bn(t) {
  let e = q(t);
  for (; B(e) && !ee(e); ) {
    if (De(e))
      return e;
    if (Te(e))
      return null;
    e = q(e);
  }
  return null;
}
function $e() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function ee(t) {
  return ["html", "body", "#document"].includes(te(t));
}
function _(t) {
  return k(t).getComputedStyle(t);
}
function Ce(t) {
  return $(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function q(t) {
  if (te(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Ke(t) && t.host || // Fallback.
    V(t)
  );
  return Ke(e) ? e.host : e;
}
function wt(t) {
  const e = q(t);
  return ee(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : B(e) && ce(e) ? e : wt(e);
}
function yt(t, e, n) {
  var i;
  e === void 0 && (e = []);
  const r = wt(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = k(r);
  return s ? (Ae(o), e.concat(o, o.visualViewport || [], ce(r) ? r : [], [])) : e.concat(r, yt(r, []));
}
function Ae(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function xt(t) {
  const e = _(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = B(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = ve(n) !== s || ve(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Et(t) {
  return $(t) ? t : t.contextElement;
}
function Q(t) {
  const e = Et(t);
  if (!B(e))
    return M(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = xt(e);
  let o = (s ? ve(n.width) : n.width) / i, a = (s ? ve(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Wn = /* @__PURE__ */ M(0);
function Tt(t) {
  const e = k(t);
  return !$e() || !e.visualViewport ? Wn : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Vn(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== k(t) ? !1 : e;
}
function le(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = Et(t);
  let o = M(1);
  e && (i ? $(i) && (o = Q(i)) : o = Q(t));
  const a = Vn(s, n, i) ? Tt(s) : M(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, f = r.width / o.x, d = r.height / o.y;
  if (s) {
    const p = k(s), g = i && $(i) ? k(i) : i;
    let v = p, y = Ae(v);
    for (; y && i && g !== v; ) {
      const w = Q(y), C = y.getBoundingClientRect(), S = _(y), O = C.left + (y.clientLeft + parseFloat(S.paddingLeft)) * w.x, N = C.top + (y.clientTop + parseFloat(S.paddingTop)) * w.y;
      l *= w.x, c *= w.y, f *= w.x, d *= w.y, l += O, c += N, v = k(y), y = Ae(v);
    }
  }
  return we({
    width: f,
    height: d,
    x: l,
    y: c
  });
}
function _e(t, e) {
  const n = Ce(t).scrollLeft;
  return e ? e.left + n : le(V(t)).left + n;
}
function Ct(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), r = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    _e(t, i)
  )), s = i.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Hn(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = V(i), a = e ? Te(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = M(1);
  const f = M(0), d = B(i);
  if ((d || !d && !s) && ((te(i) !== "body" || ce(o)) && (l = Ce(i)), B(i))) {
    const g = le(i);
    c = Q(i), f.x = g.x + i.clientLeft, f.y = g.y + i.clientTop;
  }
  const p = o && !d && !s ? Ct(o, l, !0) : M(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + f.x + p.x,
    y: n.y * c.y - l.scrollTop * c.y + f.y + p.y
  };
}
function Yn(t) {
  return Array.from(t.getClientRects());
}
function jn(t) {
  const e = V(t), n = Ce(t), i = t.ownerDocument.body, r = J(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = J(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + _e(t);
  const a = -n.scrollTop;
  return _(i).direction === "rtl" && (o += J(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function qn(t, e) {
  const n = k(t), i = V(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = $e();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Gn(t, e) {
  const n = le(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = B(t) ? Q(t) : M(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Xe(t, e, n) {
  let i;
  if (e === "viewport")
    i = qn(t, n);
  else if (e === "document")
    i = jn(V(t));
  else if ($(e))
    i = Gn(e, n);
  else {
    const r = Tt(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return we(i);
}
function St(t, e) {
  const n = q(t);
  return n === e || !$(n) || ee(n) ? !1 : _(n).position === "fixed" || St(n, e);
}
function Un(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = yt(t, []).filter((a) => $(a) && te(a) !== "body"), r = null;
  const s = _(t).position === "fixed";
  let o = s ? q(t) : t;
  for (; $(o) && !ee(o); ) {
    const a = _(o), l = De(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || ce(o) && !l && St(t, o)) ? i = i.filter((f) => f !== o) : r = a, o = q(o);
  }
  return e.set(t, i), i;
}
function Zn(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? Te(e) ? [] : Un(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, f) => {
    const d = Xe(e, f, r);
    return c.top = J(d.top, c.top), c.right = ke(d.right, c.right), c.bottom = ke(d.bottom, c.bottom), c.left = J(d.left, c.left), c;
  }, Xe(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Kn(t) {
  const {
    width: e,
    height: n
  } = xt(t);
  return {
    width: e,
    height: n
  };
}
function Xn(t, e, n) {
  const i = B(e), r = V(e), s = n === "fixed", o = le(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = M(0);
  function c() {
    l.x = _e(r);
  }
  if (i || !i && !s)
    if ((te(e) !== "body" || ce(r)) && (a = Ce(e)), i) {
      const g = le(e, !0, s, e);
      l.x = g.x + e.clientLeft, l.y = g.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const f = r && !i && !s ? Ct(r, a) : M(0), d = o.left + a.scrollLeft - l.x - f.x, p = o.top + a.scrollTop - l.y - f.y;
  return {
    x: d,
    y: p,
    width: o.width,
    height: o.height
  };
}
function Ie(t) {
  return _(t).position === "static";
}
function Je(t, e) {
  if (!B(t) || _(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return V(t) === n && (n = n.ownerDocument.body), n;
}
function It(t, e) {
  const n = k(t);
  if (Te(t))
    return n;
  if (!B(t)) {
    let r = q(t);
    for (; r && !ee(r); ) {
      if ($(r) && !Ie(r))
        return r;
      r = q(r);
    }
    return n;
  }
  let i = Je(t, e);
  for (; i && Mn(i) && Ie(i); )
    i = Je(i, e);
  return i && ee(i) && Ie(i) && !De(i) ? n : i || Bn(t) || n;
}
const Jn = async function(t) {
  const e = this.getOffsetParent || It, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Xn(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Qn(t) {
  return _(t).direction === "rtl";
}
const ei = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Hn,
  getDocumentElement: V,
  getClippingRect: Zn,
  getOffsetParent: It,
  getElementRects: Jn,
  getClientRects: Yn,
  getDimensions: Kn,
  getScale: Q,
  isElement: $,
  isRTL: Qn
}, ti = Pn, ni = zn, ii = $n, ri = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: ei,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Dn(t, e, {
    ...r,
    platform: s
  });
};
function si(t) {
  t.data("rzDropdown", () => ({
    dropdownEl: null,
    triggerEl: null,
    floatingEl: null,
    anchor: "",
    offset: 6,
    dropdownOpen: !1,
    openedWithKeyboard: !1,
    init() {
      this.dropdownEl = this.$el, this.offset = parseInt(this.$el.dataset.offset || 6), this.anchor = (this.$el.dataset.anchor || "bottom").toLowerCase(), this.triggerEl = this.dropdownEl.querySelector("[data-trigger]"), this.floatingEl = this.dropdownEl.querySelector("[data-floating]");
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen, this.updateFloatingCss();
    },
    openDropdown() {
      this.dropdownOpen = !0, this.openedWithKeyboard = !1, this.updateFloatingCss();
    },
    openWithKeyboard() {
      this.dropdownOpen = !0, this.openedWithKeyboard = !0, this.updateFloatingCss(), this.focusWrapNext();
    },
    closeDropdown() {
      this.dropdownOpen = !1, this.openedWithKeyboard = !1, this.updateFloatingCss();
    },
    focusWrapNext() {
      this.$focus.wrap().next();
    },
    focusWrapPrevious() {
      this.$focus.wrap().previous();
    },
    // Computes the Tailwind CSS classes for the dropdown's anchor based on its data attribute
    updateFloatingCss() {
      this.floatingEl.style.display = this.dropdownOpen ? "block" : "none", this.dropdownOpen && ri(this.triggerEl, this.floatingEl, {
        placement: this.anchor,
        middleware: [ti(this.offset), ii(), ni()]
      }).then(({ x: e, y: n }) => {
        Object.assign(this.floatingEl.style, {
          left: `${e}px`,
          top: `${n}px`
        });
      });
    }
  }));
}
function oi(t) {
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
function ai(t) {
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
function li(t) {
  t.data("rzEmpty", () => {
  });
}
function ci(t) {
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
function di(t, e) {
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
function ui(t) {
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
function fi(t) {
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
function hi(t) {
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
function pi(t) {
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
function gi(t) {
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
function mi(t) {
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
function vi(t) {
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
async function bi(t) {
  t = [...t].sort();
  const e = t.join("|"), i = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function he(t, e, n) {
  bi(t).then((i) => {
    j.isDefined(i) || j(
      t,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), j.ready([i], e);
  });
}
function wi(t) {
  wn(t), yn(t), xn(t), En(t), Tn(t), Cn(t, he), Sn(t, he), si(t), oi(t), ai(t), li(t), ci(t), di(t, he), ui(t), fi(t), hi(t), pi(t), gi(t), mi(t), vi(t);
}
function yi(t) {
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
X.plugin(Lt);
X.plugin(Dt);
X.plugin(tn);
wi(X);
const xi = {
  Alpine: X,
  require: he,
  toast: gn,
  $data: yi
};
window.Alpine = X;
window.Rizzy = { ...window.Rizzy || {}, ...xi };
X.start();
export {
  xi as default
};
