import X from "alpinejs";
function Rt(t) {
  t.directive("collapse", e), e.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function e(n, { modifiers: i }) {
    let s = We(i, "duration", 250) / 1e3, r = We(i, "min", 0), o = !i.includes("min");
    n._x_isShown || (n.style.height = `${r}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (c, f) => {
      let u = t.setStyles(c, f);
      return f.height ? () => {
      } : u;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${s}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(c = () => {
      }, f = () => {
      }) {
        o && (n.hidden = !1), o && (n.style.display = null);
        let u = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let p = n.getBoundingClientRect().height;
        u === p && (u = r), t.transition(n, t.setStyles, {
          during: l,
          start: { height: u + "px" },
          end: { height: p + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - p) < 1 && (n.style.overflow = null);
        });
      },
      out(c = () => {
      }, f = () => {
      }) {
        let u = n.getBoundingClientRect().height;
        t.transition(n, a, {
          during: l,
          start: { height: u + "px" },
          end: { height: r + "px" }
        }, () => n.style.overflow = "hidden", () => {
          n._x_isShown = !1, n.style.height == `${r}px` && o && (n.style.display = "none", n.hidden = !0);
        });
      }
    };
  }
}
function We(t, e, n) {
  if (t.indexOf(e) === -1)
    return n;
  const i = t[t.indexOf(e) + 1];
  if (!i)
    return n;
  if (e === "duration") {
    let s = i.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  if (e === "min") {
    let s = i.match(/([0-9]+)px/);
    if (s)
      return s[1];
  }
  return i;
}
var $t = Rt;
function Ft(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: n, expression: i, modifiers: s }, { evaluateLater: r, cleanup: o }) => {
    let a = r(i), l = {
      rootMargin: Pt(s),
      threshold: Dt(s)
    }, c = new IntersectionObserver((f) => {
      f.forEach((u) => {
        u.isIntersecting !== (n === "leave") && (a(), s.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(e), o(() => {
      c.disconnect();
    });
  }));
}
function Dt(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function _t(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Pt(t) {
  const e = "margin", n = "0px 0px 0px 0px", i = t.indexOf(e);
  if (i === -1)
    return n;
  let s = [];
  for (let r = 1; r < 5; r++)
    s.push(_t(t[i + r] || ""));
  return s = s.filter((r) => r !== void 0), s.length ? s.join(" ").trim() : n;
}
var zt = Ft, it = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], pe = /* @__PURE__ */ it.join(","), st = typeof Element > "u", Z = st ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Oe = !st && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, rt = function(e, n, i) {
  var s = Array.prototype.slice.apply(e.querySelectorAll(pe));
  return n && Z.call(e, pe) && s.unshift(e), s = s.filter(i), s;
}, ot = function t(e, n, i) {
  for (var s = [], r = Array.from(e); r.length; ) {
    var o = r.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, i);
      i.flatten ? s.push.apply(s, c) : s.push({
        scope: o,
        candidates: c
      });
    } else {
      var f = Z.call(o, pe);
      f && i.filter(o) && (n || !e.includes(o)) && s.push(o);
      var u = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), p = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (u && p) {
        var m = t(u === !0 ? o.children : u.children, !0, i);
        i.flatten ? s.push.apply(s, m) : s.push({
          scope: o,
          candidates: m
        });
      } else
        r.unshift.apply(r, o.children);
    }
  }
  return s;
}, at = function(e, n) {
  return e.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Mt = function(e, n) {
  return e.tabIndex === n.tabIndex ? e.documentOrder - n.documentOrder : e.tabIndex - n.tabIndex;
}, lt = function(e) {
  return e.tagName === "INPUT";
}, Bt = function(e) {
  return lt(e) && e.type === "hidden";
}, Wt = function(e) {
  var n = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, Vt = function(e, n) {
  for (var i = 0; i < e.length; i++)
    if (e[i].checked && e[i].form === n)
      return e[i];
}, Ht = function(e) {
  if (!e.name)
    return !0;
  var n = e.form || Oe(e), i = function(a) {
    return n.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, s;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    s = i(window.CSS.escape(e.name));
  else
    try {
      s = i(e.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var r = Vt(s, e.form);
  return !r || r === e;
}, Yt = function(e) {
  return lt(e) && e.type === "radio";
}, jt = function(e) {
  return Yt(e) && !Ht(e);
}, Ve = function(e) {
  var n = e.getBoundingClientRect(), i = n.width, s = n.height;
  return i === 0 && s === 0;
}, Ut = function(e, n) {
  var i = n.displayCheck, s = n.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var r = Z.call(e, "details>summary:first-of-type"), o = r ? e.parentElement : e;
  if (Z.call(o, "details:not([open]) *"))
    return !0;
  var a = Oe(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!i || i === "full") {
    if (typeof s == "function") {
      for (var c = e; e; ) {
        var f = e.parentElement, u = Oe(e);
        if (f && !f.shadowRoot && s(f) === !0)
          return Ve(e);
        e.assignedSlot ? e = e.assignedSlot : !f && u !== e.ownerDocument ? e = u.host : e = f;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (i === "non-zero-area")
    return Ve(e);
  return !1;
}, qt = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var n = e.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var s = n.children.item(i);
          if (s.tagName === "LEGEND")
            return Z.call(n, "fieldset[disabled] *") ? !0 : !s.contains(e);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, me = function(e, n) {
  return !(n.disabled || Bt(n) || Ut(n, e) || // For a details element with a summary, the summary element gets the focus
  Wt(n) || qt(n));
}, Ne = function(e, n) {
  return !(jt(n) || at(n) < 0 || !me(e, n));
}, Gt = function(e) {
  var n = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Zt = function t(e) {
  var n = [], i = [];
  return e.forEach(function(s, r) {
    var o = !!s.scope, a = o ? s.scope : s, l = at(a, o), c = o ? t(s.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: r,
      tabIndex: l,
      item: s,
      isScope: o,
      content: c
    });
  }), i.sort(Mt).reduce(function(s, r) {
    return r.isScope ? s.push.apply(s, r.content) : s.push(r.content), s;
  }, []).concat(n);
}, Kt = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = ot([e], n.includeContainer, {
    filter: Ne.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Gt
  }) : i = rt(e, n.includeContainer, Ne.bind(null, n)), Zt(i);
}, ct = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = ot([e], n.includeContainer, {
    filter: me.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = rt(e, n.includeContainer, me.bind(null, n)), i;
}, ue = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return Z.call(e, pe) === !1 ? !1 : Ne(n, e);
}, Xt = /* @__PURE__ */ it.concat("iframe").join(","), fe = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return Z.call(e, Xt) === !1 ? !1 : me(n, e);
};
function He(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(s) {
      return Object.getOwnPropertyDescriptor(t, s).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Ye(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? He(Object(n), !0).forEach(function(i) {
      Jt(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : He(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function Jt(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t;
}
var je = /* @__PURE__ */ function() {
  var t = [];
  return {
    activateTrap: function(n) {
      if (t.length > 0) {
        var i = t[t.length - 1];
        i !== n && i.pause();
      }
      var s = t.indexOf(n);
      s === -1 || t.splice(s, 1), t.push(n);
    },
    deactivateTrap: function(n) {
      var i = t.indexOf(n);
      i !== -1 && t.splice(i, 1), t.length > 0 && t[t.length - 1].unpause();
    }
  };
}(), Qt = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, en = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, tn = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, Ue = function(e) {
  return setTimeout(e, 0);
}, qe = function(e, n) {
  var i = -1;
  return e.every(function(s, r) {
    return n(s) ? (i = r, !1) : !0;
  }), i;
}, ne = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
    i[s - 1] = arguments[s];
  return typeof e == "function" ? e.apply(void 0, i) : e;
}, de = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, nn = function(e, n) {
  var i = n?.document || document, s = Ye({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, n), r = {
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
  }, o, a = function(d, h, g) {
    return d && d[h] !== void 0 ? d[h] : s[g || h];
  }, l = function(d) {
    return r.containerGroups.findIndex(function(h) {
      var g = h.container, I = h.tabbableNodes;
      return g.contains(d) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      I.find(function(x) {
        return x === d;
      });
    });
  }, c = function(d) {
    var h = s[d];
    if (typeof h == "function") {
      for (var g = arguments.length, I = new Array(g > 1 ? g - 1 : 0), x = 1; x < g; x++)
        I[x - 1] = arguments[x];
      h = h.apply(void 0, I);
    }
    if (h === !0 && (h = void 0), !h) {
      if (h === void 0 || h === !1)
        return h;
      throw new Error("`".concat(d, "` was specified but was not a node, or did not return a node"));
    }
    var C = h;
    if (typeof h == "string" && (C = i.querySelector(h), !C))
      throw new Error("`".concat(d, "` as selector refers to no known node"));
    return C;
  }, f = function() {
    var d = c("initialFocus");
    if (d === !1)
      return !1;
    if (d === void 0)
      if (l(i.activeElement) >= 0)
        d = i.activeElement;
      else {
        var h = r.tabbableGroups[0], g = h && h.firstTabbableNode;
        d = g || c("fallbackFocus");
      }
    if (!d)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return d;
  }, u = function() {
    if (r.containerGroups = r.containers.map(function(d) {
      var h = Kt(d, s.tabbableOptions), g = ct(d, s.tabbableOptions);
      return {
        container: d,
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
          var C = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = g.findIndex(function(A) {
            return A === x;
          });
          if (!(k < 0))
            return C ? g.slice(k + 1).find(function(A) {
              return ue(A, s.tabbableOptions);
            }) : g.slice(0, k).reverse().find(function(A) {
              return ue(A, s.tabbableOptions);
            });
        }
      };
    }), r.tabbableGroups = r.containerGroups.filter(function(d) {
      return d.tabbableNodes.length > 0;
    }), r.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, p = function v(d) {
    if (d !== !1 && d !== i.activeElement) {
      if (!d || !d.focus) {
        v(f());
        return;
      }
      d.focus({
        preventScroll: !!s.preventScroll
      }), r.mostRecentlyFocusedNode = d, Qt(d) && d.select();
    }
  }, m = function(d) {
    var h = c("setReturnFocus", d);
    return h || (h === !1 ? !1 : d);
  }, b = function(d) {
    var h = de(d);
    if (!(l(h) >= 0)) {
      if (ne(s.clickOutsideDeactivates, d)) {
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
          returnFocus: s.returnFocusOnDeactivate && !fe(h, s.tabbableOptions)
        });
        return;
      }
      ne(s.allowOutsideClick, d) || d.preventDefault();
    }
  }, y = function(d) {
    var h = de(d), g = l(h) >= 0;
    g || h instanceof Document ? g && (r.mostRecentlyFocusedNode = h) : (d.stopImmediatePropagation(), p(r.mostRecentlyFocusedNode || f()));
  }, w = function(d) {
    var h = de(d);
    u();
    var g = null;
    if (r.tabbableGroups.length > 0) {
      var I = l(h), x = I >= 0 ? r.containerGroups[I] : void 0;
      if (I < 0)
        d.shiftKey ? g = r.tabbableGroups[r.tabbableGroups.length - 1].lastTabbableNode : g = r.tabbableGroups[0].firstTabbableNode;
      else if (d.shiftKey) {
        var C = qe(r.tabbableGroups, function(F) {
          var $ = F.firstTabbableNode;
          return h === $;
        });
        if (C < 0 && (x.container === h || fe(h, s.tabbableOptions) && !ue(h, s.tabbableOptions) && !x.nextTabbableNode(h, !1)) && (C = I), C >= 0) {
          var k = C === 0 ? r.tabbableGroups.length - 1 : C - 1, A = r.tabbableGroups[k];
          g = A.lastTabbableNode;
        }
      } else {
        var P = qe(r.tabbableGroups, function(F) {
          var $ = F.lastTabbableNode;
          return h === $;
        });
        if (P < 0 && (x.container === h || fe(h, s.tabbableOptions) && !ue(h, s.tabbableOptions) && !x.nextTabbableNode(h)) && (P = I), P >= 0) {
          var R = P === r.tabbableGroups.length - 1 ? 0 : P + 1, q = r.tabbableGroups[R];
          g = q.firstTabbableNode;
        }
      }
    } else
      g = c("fallbackFocus");
    g && (d.preventDefault(), p(g));
  }, T = function(d) {
    if (en(d) && ne(s.escapeDeactivates, d) !== !1) {
      d.preventDefault(), o.deactivate();
      return;
    }
    if (tn(d)) {
      w(d);
      return;
    }
  }, S = function(d) {
    var h = de(d);
    l(h) >= 0 || ne(s.clickOutsideDeactivates, d) || ne(s.allowOutsideClick, d) || (d.preventDefault(), d.stopImmediatePropagation());
  }, O = function() {
    if (r.active)
      return je.activateTrap(o), r.delayInitialFocusTimer = s.delayInitialFocus ? Ue(function() {
        p(f());
      }) : p(f()), i.addEventListener("focusin", y, !0), i.addEventListener("mousedown", b, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", b, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", S, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", T, {
        capture: !0,
        passive: !1
      }), o;
  }, N = function() {
    if (r.active)
      return i.removeEventListener("focusin", y, !0), i.removeEventListener("mousedown", b, !0), i.removeEventListener("touchstart", b, !0), i.removeEventListener("click", S, !0), i.removeEventListener("keydown", T, !0), o;
  };
  return o = {
    get active() {
      return r.active;
    },
    get paused() {
      return r.paused;
    },
    activate: function(d) {
      if (r.active)
        return this;
      var h = a(d, "onActivate"), g = a(d, "onPostActivate"), I = a(d, "checkCanFocusTrap");
      I || u(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = i.activeElement, h && h();
      var x = function() {
        I && u(), O(), g && g();
      };
      return I ? (I(r.containers.concat()).then(x, x), this) : (x(), this);
    },
    deactivate: function(d) {
      if (!r.active)
        return this;
      var h = Ye({
        onDeactivate: s.onDeactivate,
        onPostDeactivate: s.onPostDeactivate,
        checkCanReturnFocus: s.checkCanReturnFocus
      }, d);
      clearTimeout(r.delayInitialFocusTimer), r.delayInitialFocusTimer = void 0, N(), r.active = !1, r.paused = !1, je.deactivateTrap(o);
      var g = a(h, "onDeactivate"), I = a(h, "onPostDeactivate"), x = a(h, "checkCanReturnFocus"), C = a(h, "returnFocus", "returnFocusOnDeactivate");
      g && g();
      var k = function() {
        Ue(function() {
          C && p(m(r.nodeFocusedBeforeActivation)), I && I();
        });
      };
      return C && x ? (x(m(r.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return r.paused || !r.active ? this : (r.paused = !0, N(), this);
    },
    unpause: function() {
      return !r.paused || !r.active ? this : (r.paused = !1, u(), O(), this);
    },
    updateContainerElements: function(d) {
      var h = [].concat(d).filter(Boolean);
      return r.containers = h.map(function(g) {
        return typeof g == "string" ? i.querySelector(g) : g;
      }), r.active && u(), this;
    }
  }, o.updateContainerElements(e), o;
};
function sn(t) {
  let e, n;
  window.addEventListener("focusin", () => {
    e = n, n = document.activeElement;
  }), t.magic("focus", (i) => {
    let s = i;
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
        return fe(r);
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
        return Array.isArray(s) ? s : ct(s, { displayCheck: "none" });
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
  }), t.directive("trap", t.skipDuringClone(
    (i, { expression: s, modifiers: r }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let c = a(s), f = !1, u = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => i
      };
      if (r.includes("noautofocus"))
        u.initialFocus = !1;
      else {
        let w = i.querySelector("[autofocus]");
        w && (u.initialFocus = w);
      }
      let p = nn(i, u), m = () => {
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
        f !== w && (w && !f && (r.includes("noscroll") && (b = rn()), r.includes("inert") && (m = Ge(i)), setTimeout(() => {
          p.activate();
        }, 15)), !w && f && y(), f = !!w);
      })), l(y);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: s, modifiers: r }, { evaluate: o }) => {
      r.includes("inert") && o(s) && Ge(i);
    }
  ));
}
function Ge(t) {
  let e = [];
  return ut(t, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), e.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function ut(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((n) => {
    n.isSameNode(t) ? ut(t.parentNode, e) : e(n);
  });
}
function rn() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var on = sn;
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
function an(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ln(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
  }
}
function cn(t, e, n) {
  return e && ln(t.prototype, e), t;
}
var un = Object.defineProperty, W = function(t, e) {
  return un(t, "name", { value: e, configurable: !0 });
}, dn = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, fn = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, hn = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, pn = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, mn = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, gn = W(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), ie = W(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), E = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, Y = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, Ze = { OUTLINE: "outline", FILLED: "filled" }, Se = { FADE: "fade", SLIDE: "slide" }, se = { CLOSE: ie(dn), SUCCESS: ie(pn), ERROR: ie(fn), WARNING: ie(mn), INFO: ie(hn) }, Ke = W(function(t) {
  t.wrapper.classList.add(E.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(E.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Xe = W(function(t) {
  t.wrapper.classList.remove(E.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), bn = W(function(t) {
  t.wrapper.classList.add(E.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(E.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), vn = W(function(t) {
  t.wrapper.classList.remove(E.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), dt = function() {
  function t(e) {
    var n = this;
    an(this, t), this.notifyOut = W(function(F) {
      F(n);
    }, "notifyOut");
    var i = e.notificationsGap, s = i === void 0 ? 20 : i, r = e.notificationsPadding, o = r === void 0 ? 20 : r, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, f = c === void 0 ? Se.FADE : c, u = e.type, p = u === void 0 ? "outline" : u, m = e.title, b = e.text, y = e.showIcon, w = y === void 0 ? !0 : y, T = e.customIcon, S = T === void 0 ? "" : T, O = e.customClass, N = O === void 0 ? "" : O, v = e.speed, d = v === void 0 ? 500 : v, h = e.showCloseButton, g = h === void 0 ? !0 : h, I = e.autoclose, x = I === void 0 ? !0 : I, C = e.autotimeout, k = C === void 0 ? 3e3 : C, A = e.position, P = A === void 0 ? "right top" : A, R = e.customWrapper, q = R === void 0 ? "" : R;
    if (this.customWrapper = q, this.status = l, this.title = m, this.text = b, this.showIcon = w, this.customIcon = S, this.customClass = N, this.speed = d, this.effect = f, this.showCloseButton = g, this.autoclose = x, this.autotimeout = k, this.notificationsGap = s, this.notificationsPadding = o, this.type = p, this.position = P, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return cn(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(E.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(E.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](E.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](E.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](E.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](E.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](E.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](E.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](E.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(E.NOTIFY_CLOSE), i.innerHTML = se.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = gn(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(E.NOTIFY), this.type) {
      case Ze.OUTLINE:
        this.wrapper.classList.add(E.NOTIFY_OUTLINE);
        break;
      case Ze.FILLED:
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
    var i, s;
    this.title && (i = document.createElement("div"), i.classList.add(E.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(E.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(s);
  } }, { key: "setIcon", value: function() {
    var n = W(function(s) {
      switch (s) {
        case Y.SUCCESS:
          return se.SUCCESS;
        case Y.ERROR:
          return se.ERROR;
        case Y.WARNING:
          return se.WARNING;
        case Y.INFO:
          return se.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(E.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
  } }, { key: "setObserver", value: function() {
    var n = this, i = new IntersectionObserver(function(s) {
      if (s[0].intersectionRatio <= 0) n.close();
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
        this.selectedNotifyInEffect = Ke, this.selectedNotifyOutEffect = Xe;
        break;
      case Se.SLIDE:
        this.selectedNotifyInEffect = bn, this.selectedNotifyOutEffect = vn;
        break;
      default:
        this.selectedNotifyInEffect = Ke, this.selectedNotifyOutEffect = Xe;
    }
  } }]), t;
}();
W(dt, "Notify");
var ft = dt;
globalThis.Notify = ft;
const ht = ["success", "error", "warning", "info"], pt = [
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
], mt = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function re(t = {}) {
  const e = {
    ...mt,
    ...t
  };
  ht.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), pt.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new ft(e);
}
const wn = {
  custom: re,
  success(t, e = "Success", n = {}) {
    re({
      status: "success",
      title: e,
      text: t,
      ...n
    });
  },
  error(t, e = "Error", n = {}) {
    re({
      status: "error",
      title: e,
      text: t,
      ...n
    });
  },
  warning(t, e = "Warning", n = {}) {
    re({
      status: "warning",
      title: e,
      text: t,
      ...n
    });
  },
  info(t, e = "Info", n = {}) {
    re({
      status: "info",
      title: e,
      text: t,
      ...n
    });
  },
  setDefaults(t = {}) {
    Object.assign(mt, t);
  },
  get allowedStatuses() {
    return [...ht];
  },
  get allowedPositions() {
    return [...pt];
  }
}, ke = function() {
}, oe = {}, ge = {}, ae = {};
function yn(t, e) {
  t = Array.isArray(t) ? t : [t];
  const n = [];
  let i = t.length, s = i, r, o, a, l;
  for (r = function(c, f) {
    f.length && n.push(c), s--, s || e(n);
  }; i--; ) {
    if (o = t[i], a = ge[o], a) {
      r(o, a);
      continue;
    }
    l = ae[o] = ae[o] || [], l.push(r);
  }
}
function gt(t, e) {
  if (!t) return;
  const n = ae[t];
  if (ge[t] = e, !!n)
    for (; n.length; )
      n[0](t, e), n.splice(0, 1);
}
function Ae(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || ke)(e) : (t.success || ke)(t);
}
function xn(t, e, n, i, s, r, o, a) {
  let l = t.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (r += 1, r < o)
      return bt(e, i, s, r);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(e, l, t.defaultPrevented);
}
function bt(t, e, n, i) {
  const s = document, r = n.async, o = (n.numRetries || 0) + 1, a = n.before || ke, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
  let f, u, p;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    p = s.createElement("link"), p.rel = "stylesheet", p.href = c, f = "hideFocus" in p, f && p.relList && (f = 0, p.rel = "preload", p.as = "style"), n.inlineStyleNonce && p.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    p = s.createElement("img"), p.src = c;
  else if (p = s.createElement("script"), p.src = c, p.async = r === void 0 ? !0 : r, n.inlineScriptNonce && p.setAttribute("nonce", n.inlineScriptNonce), u = "noModule" in p, /^module!/.test(l)) {
    if (!u) return e(t, "l");
    p.type = "module";
  } else if (/^nomodule!/.test(l) && u)
    return e(t, "l");
  const m = function(b) {
    xn(b, t, p, e, n, i, o, f);
  };
  p.addEventListener("load", m, { once: !0 }), p.addEventListener("error", m, { once: !0 }), a(t, p) !== !1 && s.head.appendChild(p);
}
function En(t, e, n) {
  t = Array.isArray(t) ? t : [t];
  let i = t.length, s = [];
  function r(o, a, l) {
    if (a === "e" && s.push(o), a === "b")
      if (l) s.push(o);
      else return;
    i--, i || e(s);
  }
  for (let o = 0; o < t.length; o++)
    bt(t[o], r, n);
}
function j(t, e, n) {
  let i, s;
  if (e && typeof e == "string" && e.trim && (i = e.trim()), s = (i ? n : e) || {}, i) {
    if (i in oe)
      throw "LoadJS";
    oe[i] = !0;
  }
  function r(o, a) {
    En(t, function(l) {
      Ae(s, l), o && Ae({ success: o, error: a }, l), gt(i, l);
    }, s);
  }
  if (s.returnPromise)
    return new Promise(r);
  r();
}
j.ready = function(e, n) {
  return yn(e, function(i) {
    Ae(n, i);
  }), j;
};
j.done = function(e) {
  gt(e, []);
};
j.reset = function() {
  Object.keys(oe).forEach((e) => delete oe[e]), Object.keys(ge).forEach((e) => delete ge[e]), Object.keys(ae).forEach((e) => delete ae[e]);
};
j.isDefined = function(e) {
  return e in oe;
};
function In(t) {
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
function Tn(t) {
  t.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const e = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== e.sectionId && !e.allowMultiple && (e.open = !1);
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
function Sn(t) {
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
function Cn(t) {
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
function On(t) {
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
function Nn(t, e) {
  t.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const n = JSON.parse(this.$el.dataset.assets), i = this.$el.dataset.codeid, s = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, e(n, {
        success: function() {
          const r = document.getElementById(i);
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
function kn(t, e) {
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
      const s = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.nonce;
      e(s, {
        success: function() {
          window.flatpickr && i && window.flatpickr(i, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, r);
    }
  }));
}
const Le = Math.min, J = Math.max, be = Math.round, M = (t) => ({
  x: t,
  y: t
}), An = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Ln = {
  start: "end",
  end: "start"
};
function Je(t, e, n) {
  return J(t, Le(e, n));
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
function vt(t) {
  return t === "x" ? "y" : "x";
}
function wt(t) {
  return t === "y" ? "height" : "width";
}
function G(t) {
  return ["top", "bottom"].includes(K(t)) ? "y" : "x";
}
function yt(t) {
  return vt(G(t));
}
function Rn(t, e, n) {
  n === void 0 && (n = !1);
  const i = xe(t), s = yt(t), r = wt(s);
  let o = s === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[r] > e.floating[r] && (o = ve(o)), [o, ve(o)];
}
function $n(t) {
  const e = ve(t);
  return [Re(t), e, Re(e)];
}
function Re(t) {
  return t.replace(/start|end/g, (e) => Ln[e]);
}
function Fn(t, e, n) {
  const i = ["left", "right"], s = ["right", "left"], r = ["top", "bottom"], o = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? s : i : e ? i : s;
    case "left":
    case "right":
      return e ? r : o;
    default:
      return [];
  }
}
function Dn(t, e, n, i) {
  const s = xe(t);
  let r = Fn(K(t), n === "start", i);
  return s && (r = r.map((o) => o + "-" + s), e && (r = r.concat(r.map(Re)))), r;
}
function ve(t) {
  return t.replace(/left|right|bottom|top/g, (e) => An[e]);
}
function _n(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Pn(t) {
  return typeof t != "number" ? _n(t) : {
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
    height: s
  } = t;
  return {
    width: i,
    height: s,
    top: n,
    left: e,
    right: e + i,
    bottom: n + s,
    x: e,
    y: n
  };
}
function Qe(t, e, n) {
  let {
    reference: i,
    floating: s
  } = t;
  const r = G(e), o = yt(e), a = wt(o), l = K(e), c = r === "y", f = i.x + i.width / 2 - s.width / 2, u = i.y + i.height / 2 - s.height / 2, p = i[a] / 2 - s[a] / 2;
  let m;
  switch (l) {
    case "top":
      m = {
        x: f,
        y: i.y - s.height
      };
      break;
    case "bottom":
      m = {
        x: f,
        y: i.y + i.height
      };
      break;
    case "right":
      m = {
        x: i.x + i.width,
        y: u
      };
      break;
    case "left":
      m = {
        x: i.x - s.width,
        y: u
      };
      break;
    default:
      m = {
        x: i.x,
        y: i.y
      };
  }
  switch (xe(e)) {
    case "start":
      m[o] -= p * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += p * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const zn = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: o
  } = n, a = r.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: s
  }), {
    x: f,
    y: u
  } = Qe(c, i, l), p = i, m = {}, b = 0;
  for (let y = 0; y < a.length; y++) {
    const {
      name: w,
      fn: T
    } = a[y], {
      x: S,
      y: O,
      data: N,
      reset: v
    } = await T({
      x: f,
      y: u,
      initialPlacement: i,
      placement: p,
      strategy: s,
      middlewareData: m,
      rects: c,
      platform: o,
      elements: {
        reference: t,
        floating: e
      }
    });
    f = S ?? f, u = O ?? u, m = {
      ...m,
      [w]: {
        ...m[w],
        ...N
      }
    }, v && b <= 50 && (b++, typeof v == "object" && (v.placement && (p = v.placement), v.rects && (c = v.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: s
    }) : v.rects), {
      x: f,
      y: u
    } = Qe(c, p, l)), y = -1);
  }
  return {
    x: f,
    y: u,
    placement: p,
    strategy: s,
    middlewareData: m
  };
};
async function xt(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: i,
    y: s,
    platform: r,
    rects: o,
    elements: a,
    strategy: l
  } = t, {
    boundary: c = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: u = "floating",
    altBoundary: p = !1,
    padding: m = 0
  } = ye(e, t), b = Pn(m), w = a[p ? u === "floating" ? "reference" : "floating" : u], T = we(await r.getClippingRect({
    element: (n = await (r.isElement == null ? void 0 : r.isElement(w))) == null || n ? w : w.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: f,
    strategy: l
  })), S = u === "floating" ? {
    x: i,
    y: s,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, O = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(a.floating)), N = await (r.isElement == null ? void 0 : r.isElement(O)) ? await (r.getScale == null ? void 0 : r.getScale(O)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, v = we(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: O,
    strategy: l
  }) : S);
  return {
    top: (T.top - v.top + b.top) / N.y,
    bottom: (v.bottom - T.bottom + b.bottom) / N.y,
    left: (T.left - v.left + b.left) / N.x,
    right: (v.right - T.right + b.right) / N.x
  };
}
const Mn = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, i;
      const {
        placement: s,
        middlewareData: r,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = e, {
        mainAxis: f = !0,
        crossAxis: u = !0,
        fallbackPlacements: p,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: b = "none",
        flipAlignment: y = !0,
        ...w
      } = ye(t, e);
      if ((n = r.arrow) != null && n.alignmentOffset)
        return {};
      const T = K(s), S = G(a), O = K(a) === a, N = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), v = p || (O || !y ? [ve(a)] : $n(a)), d = b !== "none";
      !p && d && v.push(...Dn(a, y, b, N));
      const h = [a, ...v], g = await xt(e, w), I = [];
      let x = ((i = r.flip) == null ? void 0 : i.overflows) || [];
      if (f && I.push(g[T]), u) {
        const R = Rn(s, o, N);
        I.push(g[R[0]], g[R[1]]);
      }
      if (x = [...x, {
        placement: s,
        overflows: I
      }], !I.every((R) => R <= 0)) {
        var C, k;
        const R = (((C = r.flip) == null ? void 0 : C.index) || 0) + 1, q = h[R];
        if (q) {
          var A;
          const $ = u === "alignment" ? S !== G(q) : !1, z = ((A = x[0]) == null ? void 0 : A.overflows[0]) > 0;
          if (!$ || z)
            return {
              data: {
                index: R,
                overflows: x
              },
              reset: {
                placement: q
              }
            };
        }
        let F = (k = x.filter(($) => $.overflows[0] <= 0).sort(($, z) => $.overflows[1] - z.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!F)
          switch (m) {
            case "bestFit": {
              var P;
              const $ = (P = x.filter((z) => {
                if (d) {
                  const H = G(z.placement);
                  return H === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  H === "y";
                }
                return !0;
              }).map((z) => [z.placement, z.overflows.filter((H) => H > 0).reduce((H, Lt) => H + Lt, 0)]).sort((z, H) => z[1] - H[1])[0]) == null ? void 0 : P[0];
              $ && (F = $);
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
async function Bn(t, e) {
  const {
    placement: n,
    platform: i,
    elements: s
  } = t, r = await (i.isRTL == null ? void 0 : i.isRTL(s.floating)), o = K(n), a = xe(n), l = G(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, f = r && l ? -1 : 1, u = ye(e, t);
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
    x: m * f,
    y: p * c
  } : {
    x: p * c,
    y: m * f
  };
}
const Wn = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, i;
      const {
        x: s,
        y: r,
        placement: o,
        middlewareData: a
      } = e, l = await Bn(e, t);
      return o === ((n = a.offset) == null ? void 0 : n.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: s + l.x,
        y: r + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, Vn = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: i,
        placement: s
      } = e, {
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
      } = ye(t, e), c = {
        x: n,
        y: i
      }, f = await xt(e, l), u = G(K(s)), p = vt(u);
      let m = c[p], b = c[u];
      if (r) {
        const w = p === "y" ? "top" : "left", T = p === "y" ? "bottom" : "right", S = m + f[w], O = m - f[T];
        m = Je(S, m, O);
      }
      if (o) {
        const w = u === "y" ? "top" : "left", T = u === "y" ? "bottom" : "right", S = b + f[w], O = b - f[T];
        b = Je(S, b, O);
      }
      const y = a.fn({
        ...e,
        [p]: m,
        [u]: b
      });
      return {
        ...y,
        data: {
          x: y.x - n,
          y: y.y - i,
          enabled: {
            [p]: r,
            [u]: o
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
  return Et(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function L(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function V(t) {
  var e;
  return (e = (Et(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Et(t) {
  return Ee() ? t instanceof Node || t instanceof L(t).Node : !1;
}
function D(t) {
  return Ee() ? t instanceof Element || t instanceof L(t).Element : !1;
}
function B(t) {
  return Ee() ? t instanceof HTMLElement || t instanceof L(t).HTMLElement : !1;
}
function et(t) {
  return !Ee() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof L(t).ShadowRoot;
}
function ce(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: s
  } = _(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(s);
}
function Hn(t) {
  return ["table", "td", "th"].includes(te(t));
}
function Ie(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function ze(t) {
  const e = Me(), n = D(t) ? _(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Yn(t) {
  let e = U(t);
  for (; B(e) && !ee(e); ) {
    if (ze(e))
      return e;
    if (Ie(e))
      return null;
    e = U(e);
  }
  return null;
}
function Me() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function ee(t) {
  return ["html", "body", "#document"].includes(te(t));
}
function _(t) {
  return L(t).getComputedStyle(t);
}
function Te(t) {
  return D(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function U(t) {
  if (te(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    et(t) && t.host || // Fallback.
    V(t)
  );
  return et(e) ? e.host : e;
}
function It(t) {
  const e = U(t);
  return ee(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : B(e) && ce(e) ? e : It(e);
}
function Tt(t, e, n) {
  var i;
  e === void 0 && (e = []);
  const s = It(t), r = s === ((i = t.ownerDocument) == null ? void 0 : i.body), o = L(s);
  return r ? ($e(o), e.concat(o, o.visualViewport || [], ce(s) ? s : [], [])) : e.concat(s, Tt(s, []));
}
function $e(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function St(t) {
  const e = _(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const s = B(t), r = s ? t.offsetWidth : n, o = s ? t.offsetHeight : i, a = be(n) !== r || be(i) !== o;
  return a && (n = r, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Ct(t) {
  return D(t) ? t : t.contextElement;
}
function Q(t) {
  const e = Ct(t);
  if (!B(e))
    return M(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: s,
    $: r
  } = St(e);
  let o = (r ? be(n.width) : n.width) / i, a = (r ? be(n.height) : n.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const jn = /* @__PURE__ */ M(0);
function Ot(t) {
  const e = L(t);
  return !Me() || !e.visualViewport ? jn : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Un(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== L(t) ? !1 : e;
}
function le(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const s = t.getBoundingClientRect(), r = Ct(t);
  let o = M(1);
  e && (i ? D(i) && (o = Q(i)) : o = Q(t));
  const a = Un(r, n, i) ? Ot(r) : M(0);
  let l = (s.left + a.x) / o.x, c = (s.top + a.y) / o.y, f = s.width / o.x, u = s.height / o.y;
  if (r) {
    const p = L(r), m = i && D(i) ? L(i) : i;
    let b = p, y = $e(b);
    for (; y && i && m !== b; ) {
      const w = Q(y), T = y.getBoundingClientRect(), S = _(y), O = T.left + (y.clientLeft + parseFloat(S.paddingLeft)) * w.x, N = T.top + (y.clientTop + parseFloat(S.paddingTop)) * w.y;
      l *= w.x, c *= w.y, f *= w.x, u *= w.y, l += O, c += N, b = L(y), y = $e(b);
    }
  }
  return we({
    width: f,
    height: u,
    x: l,
    y: c
  });
}
function Be(t, e) {
  const n = Te(t).scrollLeft;
  return e ? e.left + n : le(V(t)).left + n;
}
function Nt(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), s = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Be(t, i)
  )), r = i.top + e.scrollTop;
  return {
    x: s,
    y: r
  };
}
function qn(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: s
  } = t;
  const r = s === "fixed", o = V(i), a = e ? Ie(e.floating) : !1;
  if (i === o || a && r)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = M(1);
  const f = M(0), u = B(i);
  if ((u || !u && !r) && ((te(i) !== "body" || ce(o)) && (l = Te(i)), B(i))) {
    const m = le(i);
    c = Q(i), f.x = m.x + i.clientLeft, f.y = m.y + i.clientTop;
  }
  const p = o && !u && !r ? Nt(o, l, !0) : M(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + f.x + p.x,
    y: n.y * c.y - l.scrollTop * c.y + f.y + p.y
  };
}
function Gn(t) {
  return Array.from(t.getClientRects());
}
function Zn(t) {
  const e = V(t), n = Te(t), i = t.ownerDocument.body, s = J(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), r = J(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Be(t);
  const a = -n.scrollTop;
  return _(i).direction === "rtl" && (o += J(e.clientWidth, i.clientWidth) - s), {
    width: s,
    height: r,
    x: o,
    y: a
  };
}
function Kn(t, e) {
  const n = L(t), i = V(t), s = n.visualViewport;
  let r = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, o = s.height;
    const c = Me();
    (!c || c && e === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  return {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
function Xn(t, e) {
  const n = le(t, !0, e === "fixed"), i = n.top + t.clientTop, s = n.left + t.clientLeft, r = B(t) ? Q(t) : M(1), o = t.clientWidth * r.x, a = t.clientHeight * r.y, l = s * r.x, c = i * r.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function tt(t, e, n) {
  let i;
  if (e === "viewport")
    i = Kn(t, n);
  else if (e === "document")
    i = Zn(V(t));
  else if (D(e))
    i = Xn(e, n);
  else {
    const s = Ot(t);
    i = {
      x: e.x - s.x,
      y: e.y - s.y,
      width: e.width,
      height: e.height
    };
  }
  return we(i);
}
function kt(t, e) {
  const n = U(t);
  return n === e || !D(n) || ee(n) ? !1 : _(n).position === "fixed" || kt(n, e);
}
function Jn(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Tt(t, []).filter((a) => D(a) && te(a) !== "body"), s = null;
  const r = _(t).position === "fixed";
  let o = r ? U(t) : t;
  for (; D(o) && !ee(o); ) {
    const a = _(o), l = ze(o);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || ce(o) && !l && kt(t, o)) ? i = i.filter((f) => f !== o) : s = a, o = U(o);
  }
  return e.set(t, i), i;
}
function Qn(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: s
  } = t;
  const o = [...n === "clippingAncestors" ? Ie(e) ? [] : Jn(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, f) => {
    const u = tt(e, f, s);
    return c.top = J(u.top, c.top), c.right = Le(u.right, c.right), c.bottom = Le(u.bottom, c.bottom), c.left = J(u.left, c.left), c;
  }, tt(e, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function ei(t) {
  const {
    width: e,
    height: n
  } = St(t);
  return {
    width: e,
    height: n
  };
}
function ti(t, e, n) {
  const i = B(e), s = V(e), r = n === "fixed", o = le(t, !0, r, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = M(0);
  function c() {
    l.x = Be(s);
  }
  if (i || !i && !r)
    if ((te(e) !== "body" || ce(s)) && (a = Te(e)), i) {
      const m = le(e, !0, r, e);
      l.x = m.x + e.clientLeft, l.y = m.y + e.clientTop;
    } else s && c();
  r && !i && s && c();
  const f = s && !i && !r ? Nt(s, a) : M(0), u = o.left + a.scrollLeft - l.x - f.x, p = o.top + a.scrollTop - l.y - f.y;
  return {
    x: u,
    y: p,
    width: o.width,
    height: o.height
  };
}
function Ce(t) {
  return _(t).position === "static";
}
function nt(t, e) {
  if (!B(t) || _(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return V(t) === n && (n = n.ownerDocument.body), n;
}
function At(t, e) {
  const n = L(t);
  if (Ie(t))
    return n;
  if (!B(t)) {
    let s = U(t);
    for (; s && !ee(s); ) {
      if (D(s) && !Ce(s))
        return s;
      s = U(s);
    }
    return n;
  }
  let i = nt(t, e);
  for (; i && Hn(i) && Ce(i); )
    i = nt(i, e);
  return i && ee(i) && Ce(i) && !ze(i) ? n : i || Yn(t) || n;
}
const ni = async function(t) {
  const e = this.getOffsetParent || At, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: ti(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function ii(t) {
  return _(t).direction === "rtl";
}
const si = {
  convertOffsetParentRelativeRectToViewportRelativeRect: qn,
  getDocumentElement: V,
  getClippingRect: Qn,
  getOffsetParent: At,
  getElementRects: ni,
  getClientRects: Gn,
  getDimensions: ei,
  getScale: Q,
  isElement: D,
  isRTL: ii
}, Fe = Wn, De = Vn, _e = Mn, Pe = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), s = {
    platform: si,
    ...n
  }, r = {
    ...s.platform,
    _c: i
  };
  return zn(t, e, {
    ...s,
    platform: r
  });
};
function ri(t) {
  t.data("rzDropdownMenu", () => ({
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
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentEl = this.$el, this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.anchor = this.$el.dataset.anchor || "bottom", this.pixelOffset = parseInt(this.$el.dataset.offset) || 6, this.isModal = this.$el.dataset.modal !== "false", this.$watch("open", (e) => {
        e ? (this._lastNavAt = 0, this.$nextTick(() => {
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
      !this.triggerEl || !this.contentEl || Pe(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [Fe(this.pixelOffset), _e(), De({ padding: 8 })]
      }).then(({ x: e, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${e}px`, top: `${n}px` });
      });
    },
    toggle() {
      this.open ? (this.open = !1, this.$nextTick(() => this.triggerEl?.focus())) : (this.open = !0, this.focusedIndex = -1);
    },
    handleOutsideClick() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleTriggerKeydown(e) {
      ["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key) && (e.preventDefault(), this.open = !0, this.$nextTick(() => {
        e.key === "ArrowUp" ? this.focusLastItem() : this.focusFirstItem();
      }));
    },
    focusNextItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    focusPreviousItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
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
    focusSelectedItem(e) {
      if (!e || e.getAttribute("aria-disabled") === "true" || e.hasAttribute("disabled")) return;
      const n = this.menuItems.indexOf(e);
      n !== -1 && (this.focusedIndex = n, e.focus());
    },
    handleItemClick(e) {
      const n = e.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.open = !1, this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      this.focusSelectedItem(n), n.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
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
      this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]').forEach((n) => {
        t.$data(n)?.closeSubmenu();
      }), this.isSubmenuActive = !1;
    }
  })), t.data("rzDropdownSubmenu", () => ({
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
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentDropdown = t.$data(this.$el.closest('[x-data^="rzDropdownMenu"]')), this.triggerEl = this.$refs.subTrigger, this.siblingContainer = this.$el.parentElement, this.anchor = this.$el.dataset.subAnchor || this.anchor, this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset, this.$watch("open", (e) => {
        e ? (this._lastNavAt = 0, this.parentDropdown.isSubmenuActive = !0, this.$nextTick(() => {
          const n = this.$refs.subContent;
          this.updatePosition(n), this.menuItems = Array.from(n.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open") : (this.focusedIndex = null, this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.$nextTick(() => {
          this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]') || (this.parentDropdown.isSubmenuActive = !1);
        }));
      });
    },
    // --- METHODS ---
    updatePosition(e) {
      !this.triggerEl || !e || Pe(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [Fe(this.pixelOffset), _e(), De({ padding: 8 })]
      }).then(({ x: n, y: i }) => {
        Object.assign(e.style, { left: `${n}px`, top: `${i}px` });
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
      const e = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      e && Array.from(e).some((i) => t.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(e = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, e && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
        t.$data(n)?.closeSubmenu();
      }), this.open = !1;
    },
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (n) => n.hasAttribute("x-data") && n.getAttribute("x-data").startsWith("rzDropdownSubmenu") && n.id !== this.selfId
      ).forEach((n) => {
        t.$data(n)?.closeSubmenu();
      });
    },
    toggleSubmenu() {
      this.open ? this.closeSubmenu() : this.openSubmenu();
    },
    openSubmenuAndFocusFirst() {
      this.openSubmenu(!0);
    },
    handleTriggerKeydown(e) {
      ["ArrowRight", "Enter", " "].includes(e.key) && (e.preventDefault(), this.openSubmenuAndFocusFirst());
    },
    focusNextItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    focusPreviousItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
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
    handleItemClick(e) {
      const n = e.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.parentDropdown.open = !1, this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(n);
      i !== -1 && (this.focusedIndex = i, n.focus()), n.getAttribute("aria-haspopup") === "menu" ? t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
    },
    handleSubmenuEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleSubmenuArrowLeft() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function oi(t) {
  t.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const e = typeof window < "u" && "localStorage" in window, n = ["light", "dark", "auto"], i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let s = "auto";
      e && (s = localStorage.getItem("darkMode") ?? "auto", n.includes(s) || (s = "light")), e && localStorage.setItem("darkMode", s), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          s === "dark" || s === "auto" && i
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
      const s = new CustomEvent("darkModeToggle", {
        detail: { darkMode: i }
      });
      window.dispatchEvent(s);
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
        this.resizeIframe(this.iframe), new ResizeObserver((s) => {
          for (let r of s)
            e();
        }).observe(this.iframe);
        const i = this.iframe;
        this.onDarkModeToggle = (s) => {
          i.contentWindow.postMessage(s.detail, "*");
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
              const s = i.scrollHeight + 15;
              e.style.height = s + "px";
            }
          }
        } catch (n) {
          console.error("Error resizing iframe:", n);
        }
    },
    // Debounce helper to limit function calls
    debounce(e, n = 300) {
      let i;
      return (...s) => {
        clearTimeout(i), i = setTimeout(() => {
          e.apply(this, s);
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
        const n = (s, r) => {
          s.forEach((o) => {
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
function ui(t) {
  t.data("rzIndicator", () => ({
    visible: !1,
    init() {
      const e = this.$el.dataset.color;
      e ? this.$el.style.backgroundColor = e : this.$el.style.backgroundColor = "var(--color-success)", this.$el.dataset.visible === "true" && (this.visible = !0);
    },
    notVisible() {
      return !this.visible;
    },
    setVisible(e) {
      this.visible = e;
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
function fi(t) {
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
function hi(t) {
  t.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    init() {
      this.triggerEl = this.$refs.trigger.children[0] || this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (e) => {
        this.ariaExpanded = e.toString(), e && this.$nextTick(() => this.updatePosition());
      });
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const e = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, s = parseInt(this.$el.dataset.alignmentAxisOffset) || 0, r = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(Fe({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: s
      })), o && c.push(_e()), a && c.push(De({ padding: l })), Pe(this.triggerEl, this.contentEl, {
        placement: e,
        strategy: r,
        middleware: c
      }).then(({ x: f, y: u }) => {
        Object.assign(this.contentEl.style, {
          left: `${f}px`,
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
function pi(t) {
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
      const s = e.offsetWidth + 10;
      n.style.paddingLeft = s + "px", n.classList.remove("text-transparent");
    }
  }));
}
function mi(t) {
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
      return e && n && e.clientWidth > n.clientWidth ? "text-foreground dark:text-foreground" : "";
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
function gi(t) {
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
function bi(t) {
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
      const n = e.key, i = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), s = i.findIndex((o) => this.tabSelected === o.dataset.name);
      let r = s;
      n === "ArrowRight" ? (r = (s + 1) % i.length, e.preventDefault()) : n === "ArrowLeft" ? (r = (s - 1 + i.length) % i.length, e.preventDefault()) : n === "Home" ? (r = 0, e.preventDefault()) : n === "End" && (r = i.length - 1, e.preventDefault()), r !== s && this.tabButtonClicked(i[r]);
    }
  }));
}
function vi(t) {
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
function wi(t) {
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
async function yi(t) {
  t = [...t].sort();
  const e = t.join("|"), i = new TextEncoder().encode(e), s = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function he(t, e, n) {
  yi(t).then((i) => {
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
function xi(t) {
  In(t), Tn(t), Sn(t), Cn(t), On(t), Nn(t, he), kn(t, he), ri(t), oi(t), ai(t), li(t), ci(t), ui(t), di(t, he), fi(t), hi(t), pi(t), mi(t), gi(t), bi(t), vi(t), wi(t);
}
function Ei(t) {
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
  let s = null;
  if (e.matches(i) ? s = e : s = e.querySelector(i), !s) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${i}" on or inside the wrapper element (ID: #${n}). Verify the 'data-alpine-root' attribute placement.`
    );
    return;
  }
  const r = Alpine.$data(s);
  if (r === void 0) {
    const o = `${s.tagName.toLowerCase()}${s.id ? "#" + s.id : ""}${s.classList.length ? "." + Array.from(s.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${o}) via 'data-alpine-root="${n}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return r;
}
X.plugin($t);
X.plugin(zt);
X.plugin(on);
xi(X);
const Ii = {
  Alpine: X,
  require: he,
  toast: wn,
  $data: Ei
};
window.Alpine = X;
window.Rizzy = { ...window.Rizzy || {}, ...Ii };
X.start();
export {
  Ii as default
};
