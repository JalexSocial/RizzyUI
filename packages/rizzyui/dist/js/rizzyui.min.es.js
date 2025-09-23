import W from "alpinejs";
function Re(e) {
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
        let h = i.getBoundingClientRect().height;
        u === h && (u = r), e.transition(i, e.setStyles, {
          during: l,
          start: { height: u + "px" },
          end: { height: h + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - h) < 1 && (i.style.overflow = null);
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
var Le = Re;
function De(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: s }, { evaluateLater: r, cleanup: o }) => {
    let a = r(n), l = {
      rootMargin: _e(s),
      threshold: Fe(s)
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
function Fe(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function ze(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function _e(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let s = [];
  for (let r = 1; r < 5; r++)
    s.push(ze(e[n + r] || ""));
  return s = s.filter((r) => r !== void 0), s.length ? s.join(" ").trim() : i;
}
var Me = De, ne = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], pt = /* @__PURE__ */ ne.join(","), se = typeof Element > "u", J = se ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, At = !se && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, re = function(t, i, n) {
  var s = Array.prototype.slice.apply(t.querySelectorAll(pt));
  return i && J.call(t, pt) && s.unshift(t), s = s.filter(n), s;
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
      var d = J.call(o, pt);
      d && n.filter(o) && (i || !t.includes(o)) && s.push(o);
      var u = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), h = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (u && h) {
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
  var i = t.form || At(t), n = function(a) {
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
}, Ue = function(t, i) {
  var n = i.displayCheck, s = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var r = J.call(t, "details>summary:first-of-type"), o = r ? t.parentElement : t;
  if (J.call(o, "details:not([open]) *"))
    return !0;
  var a = At(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof s == "function") {
      for (var c = t; t; ) {
        var d = t.parentElement, u = At(t);
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
}, qe = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var s = i.children.item(n);
          if (s.tagName === "LEGEND")
            return J.call(i, "fieldset[disabled] *") ? !0 : !s.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, mt = function(t, i) {
  return !(i.disabled || Be(i) || Ue(i, t) || // For a details element with a summary, the summary element gets the focus
  We(i) || qe(i));
}, Rt = function(t, i) {
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
}, Je = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = oe([t], i.includeContainer, {
    filter: Rt.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: Ge
  }) : n = re(t, i.includeContainer, Rt.bind(null, i)), Ze(n);
}, ce = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = oe([t], i.includeContainer, {
    filter: mt.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = re(t, i.includeContainer, mt.bind(null, i)), n;
}, dt = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return J.call(t, pt) === !1 ? !1 : Rt(i, t);
}, Ke = /* @__PURE__ */ ne.concat("iframe").join(","), ht = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return J.call(t, Ke) === !1 ? !1 : mt(i, t);
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
      Xe(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : Ht(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function Xe(e, t, i) {
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
}, Ut = function(t) {
  return setTimeout(t, 0);
}, qt = function(t, i) {
  var n = -1;
  return t.every(function(s, r) {
    return i(s) ? (n = r, !1) : !0;
  }), n;
}, it = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++)
    n[s - 1] = arguments[s];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, ft = function(t) {
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
  }, o, a = function(f, p, x) {
    return f && f[p] !== void 0 ? f[p] : s[x || p];
  }, l = function(f) {
    return r.containerGroups.findIndex(function(p) {
      var x = p.container, T = p.tabbableNodes;
      return x.contains(f) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(I) {
        return I === f;
      });
    });
  }, c = function(f) {
    var p = s[f];
    if (typeof p == "function") {
      for (var x = arguments.length, T = new Array(x > 1 ? x - 1 : 0), I = 1; I < x; I++)
        T[I - 1] = arguments[I];
      p = p.apply(void 0, T);
    }
    if (p === !0 && (p = void 0), !p) {
      if (p === void 0 || p === !1)
        return p;
      throw new Error("`".concat(f, "` was specified but was not a node, or did not return a node"));
    }
    var N = p;
    if (typeof p == "string" && (N = n.querySelector(p), !N))
      throw new Error("`".concat(f, "` as selector refers to no known node"));
    return N;
  }, d = function() {
    var f = c("initialFocus");
    if (f === !1)
      return !1;
    if (f === void 0)
      if (l(n.activeElement) >= 0)
        f = n.activeElement;
      else {
        var p = r.tabbableGroups[0], x = p && p.firstTabbableNode;
        f = x || c("fallbackFocus");
      }
    if (!f)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return f;
  }, u = function() {
    if (r.containerGroups = r.containers.map(function(f) {
      var p = Je(f, s.tabbableOptions), x = ce(f, s.tabbableOptions);
      return {
        container: f,
        tabbableNodes: p,
        focusableNodes: x,
        firstTabbableNode: p.length > 0 ? p[0] : null,
        lastTabbableNode: p.length > 0 ? p[p.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(I) {
          var N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = x.findIndex(function($) {
            return $ === I;
          });
          if (!(k < 0))
            return N ? x.slice(k + 1).find(function($) {
              return dt($, s.tabbableOptions);
            }) : x.slice(0, k).reverse().find(function($) {
              return dt($, s.tabbableOptions);
            });
        }
      };
    }), r.tabbableGroups = r.containerGroups.filter(function(f) {
      return f.tabbableNodes.length > 0;
    }), r.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, h = function w(f) {
    if (f !== !1 && f !== n.activeElement) {
      if (!f || !f.focus) {
        w(d());
        return;
      }
      f.focus({
        preventScroll: !!s.preventScroll
      }), r.mostRecentlyFocusedNode = f, Qe(f) && f.select();
    }
  }, m = function(f) {
    var p = c("setReturnFocus", f);
    return p || (p === !1 ? !1 : f);
  }, v = function(f) {
    var p = ft(f);
    if (!(l(p) >= 0)) {
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
          returnFocus: s.returnFocusOnDeactivate && !ht(p, s.tabbableOptions)
        });
        return;
      }
      it(s.allowOutsideClick, f) || f.preventDefault();
    }
  }, b = function(f) {
    var p = ft(f), x = l(p) >= 0;
    x || p instanceof Document ? x && (r.mostRecentlyFocusedNode = p) : (f.stopImmediatePropagation(), h(r.mostRecentlyFocusedNode || d()));
  }, y = function(f) {
    var p = ft(f);
    u();
    var x = null;
    if (r.tabbableGroups.length > 0) {
      var T = l(p), I = T >= 0 ? r.containerGroups[T] : void 0;
      if (T < 0)
        f.shiftKey ? x = r.tabbableGroups[r.tabbableGroups.length - 1].lastTabbableNode : x = r.tabbableGroups[0].firstTabbableNode;
      else if (f.shiftKey) {
        var N = qt(r.tabbableGroups, function(D) {
          var L = D.firstTabbableNode;
          return p === L;
        });
        if (N < 0 && (I.container === p || ht(p, s.tabbableOptions) && !dt(p, s.tabbableOptions) && !I.nextTabbableNode(p, !1)) && (N = T), N >= 0) {
          var k = N === 0 ? r.tabbableGroups.length - 1 : N - 1, $ = r.tabbableGroups[k];
          x = $.lastTabbableNode;
        }
      } else {
        var _ = qt(r.tabbableGroups, function(D) {
          var L = D.lastTabbableNode;
          return p === L;
        });
        if (_ < 0 && (I.container === p || ht(p, s.tabbableOptions) && !dt(p, s.tabbableOptions) && !I.nextTabbableNode(p)) && (_ = T), _ >= 0) {
          var R = _ === r.tabbableGroups.length - 1 ? 0 : _ + 1, G = r.tabbableGroups[R];
          x = G.firstTabbableNode;
        }
      }
    } else
      x = c("fallbackFocus");
    x && (f.preventDefault(), h(x));
  }, g = function(f) {
    if (ti(f) && it(s.escapeDeactivates, f) !== !1) {
      f.preventDefault(), o.deactivate();
      return;
    }
    if (ei(f)) {
      y(f);
      return;
    }
  }, S = function(f) {
    var p = ft(f);
    l(p) >= 0 || it(s.clickOutsideDeactivates, f) || it(s.allowOutsideClick, f) || (f.preventDefault(), f.stopImmediatePropagation());
  }, O = function() {
    if (r.active)
      return jt.activateTrap(o), r.delayInitialFocusTimer = s.delayInitialFocus ? Ut(function() {
        h(d());
      }) : h(d()), n.addEventListener("focusin", b, !0), n.addEventListener("mousedown", v, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", v, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", S, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", g, {
        capture: !0,
        passive: !1
      }), o;
  }, C = function() {
    if (r.active)
      return n.removeEventListener("focusin", b, !0), n.removeEventListener("mousedown", v, !0), n.removeEventListener("touchstart", v, !0), n.removeEventListener("click", S, !0), n.removeEventListener("keydown", g, !0), o;
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
      var p = a(f, "onActivate"), x = a(f, "onPostActivate"), T = a(f, "checkCanFocusTrap");
      T || u(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = n.activeElement, p && p();
      var I = function() {
        T && u(), O(), x && x();
      };
      return T ? (T(r.containers.concat()).then(I, I), this) : (I(), this);
    },
    deactivate: function(f) {
      if (!r.active)
        return this;
      var p = Yt({
        onDeactivate: s.onDeactivate,
        onPostDeactivate: s.onPostDeactivate,
        checkCanReturnFocus: s.checkCanReturnFocus
      }, f);
      clearTimeout(r.delayInitialFocusTimer), r.delayInitialFocusTimer = void 0, C(), r.active = !1, r.paused = !1, jt.deactivateTrap(o);
      var x = a(p, "onDeactivate"), T = a(p, "onPostDeactivate"), I = a(p, "checkCanReturnFocus"), N = a(p, "returnFocus", "returnFocusOnDeactivate");
      x && x();
      var k = function() {
        Ut(function() {
          N && h(m(r.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return N && I ? (I(m(r.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return r.paused || !r.active ? this : (r.paused = !0, C(), this);
    },
    unpause: function() {
      return !r.paused || !r.active ? this : (r.paused = !1, u(), O(), this);
    },
    updateContainerElements: function(f) {
      var p = [].concat(f).filter(Boolean);
      return r.containers = p.map(function(x) {
        return typeof x == "string" ? n.querySelector(x) : x;
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
        return ht(r);
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
        let y = n.querySelector("[autofocus]");
        y && (u.initialFocus = y);
      }
      let h = ii(n, u), m = () => {
      }, v = () => {
      };
      const b = () => {
        m(), m = () => {
        }, v(), v = () => {
        }, h.deactivate({
          returnFocus: !r.includes("noreturn")
        });
      };
      o(() => c((y) => {
        d !== y && (y && !d && (r.includes("noscroll") && (v = si()), r.includes("inert") && (m = Gt(n)), setTimeout(() => {
          h.activate();
        }, 15)), !y && d && b(), d = !!y);
      })), l(b);
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
var ci = Object.defineProperty, V = function(e, t) {
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
`, mi = V(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), nt = V(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), E = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, j = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, Zt = { OUTLINE: "outline", FILLED: "filled" }, kt = { FADE: "fade", SLIDE: "slide" }, st = { CLOSE: nt(ui), SUCCESS: nt(hi), ERROR: nt(di), WARNING: nt(pi), INFO: nt(fi) }, Jt = V(function(e) {
  e.wrapper.classList.add(E.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(E.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Kt = V(function(e) {
  e.wrapper.classList.remove(E.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), gi = V(function(e) {
  e.wrapper.classList.add(E.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(E.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), bi = V(function(e) {
  e.wrapper.classList.remove(E.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), de = function() {
  function e(t) {
    var i = this;
    oi(this, e), this.notifyOut = V(function(D) {
      D(i);
    }, "notifyOut");
    var n = t.notificationsGap, s = n === void 0 ? 20 : n, r = t.notificationsPadding, o = r === void 0 ? 20 : r, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, d = c === void 0 ? kt.FADE : c, u = t.type, h = u === void 0 ? "outline" : u, m = t.title, v = t.text, b = t.showIcon, y = b === void 0 ? !0 : b, g = t.customIcon, S = g === void 0 ? "" : g, O = t.customClass, C = O === void 0 ? "" : O, w = t.speed, f = w === void 0 ? 500 : w, p = t.showCloseButton, x = p === void 0 ? !0 : p, T = t.autoclose, I = T === void 0 ? !0 : T, N = t.autotimeout, k = N === void 0 ? 3e3 : N, $ = t.position, _ = $ === void 0 ? "right top" : $, R = t.customWrapper, G = R === void 0 ? "" : R;
    if (this.customWrapper = G, this.status = l, this.title = m, this.text = v, this.showIcon = y, this.customIcon = S, this.customClass = C, this.speed = f, this.effect = d, this.showCloseButton = x, this.autoclose = I, this.autotimeout = k, this.notificationsGap = s, this.notificationsPadding = o, this.type = h, this.position = _, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return li(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(E.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(E.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](E.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](E.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](E.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](E.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](E.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](E.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](E.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(E.NOTIFY_CLOSE), n.innerHTML = st.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = mi(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(E.NOTIFY), this.type) {
      case Zt.OUTLINE:
        this.wrapper.classList.add(E.NOTIFY_OUTLINE);
        break;
      case Zt.FILLED:
        this.wrapper.classList.add(E.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(E.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case j.SUCCESS:
        this.wrapper.classList.add(E.NOTIFY_SUCCESS);
        break;
      case j.ERROR:
        this.wrapper.classList.add(E.NOTIFY_ERROR);
        break;
      case j.WARNING:
        this.wrapper.classList.add(E.NOTIFY_WARNING);
        break;
      case j.INFO:
        this.wrapper.classList.add(E.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(E.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(E.NOTIFY_CONTENT);
    var n, s;
    this.title && (n = document.createElement("div"), n.classList.add(E.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(E.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(s);
  } }, { key: "setIcon", value: function() {
    var i = V(function(s) {
      switch (s) {
        case j.SUCCESS:
          return st.SUCCESS;
        case j.ERROR:
          return st.ERROR;
        case j.WARNING:
          return st.WARNING;
        case j.INFO:
          return st.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(E.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
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
      case kt.FADE:
        this.selectedNotifyInEffect = Jt, this.selectedNotifyOutEffect = Kt;
        break;
      case kt.SLIDE:
        this.selectedNotifyInEffect = gi, this.selectedNotifyOutEffect = bi;
        break;
      default:
        this.selectedNotifyInEffect = Jt, this.selectedNotifyOutEffect = Kt;
    }
  } }]), e;
}();
V(de, "Notify");
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
}, Lt = function() {
}, at = {}, gt = {}, lt = {};
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
    l = lt[o] = lt[o] || [], l.push(r);
  }
}
function ge(e, t) {
  if (!e) return;
  const i = lt[e];
  if (gt[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function Dt(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || Lt)(t) : (e.success || Lt)(e);
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
  const s = document, r = i.async, o = (i.numRetries || 0) + 1, a = i.before || Lt, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let d, u, h;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    h = s.createElement("link"), h.rel = "stylesheet", h.href = c, d = "hideFocus" in h, d && h.relList && (d = 0, h.rel = "preload", h.as = "style"), i.inlineStyleNonce && h.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    h = s.createElement("img"), h.src = c;
  else if (h = s.createElement("script"), h.src = c, h.async = r === void 0 ? !0 : r, i.inlineScriptNonce && h.setAttribute("nonce", i.inlineScriptNonce), u = "noModule" in h, /^module!/.test(l)) {
    if (!u) return t(e, "l");
    h.type = "module";
  } else if (/^nomodule!/.test(l) && u)
    return t(e, "l");
  const m = function(v) {
    yi(v, e, h, t, i, n, o, d);
  };
  h.addEventListener("load", m, { once: !0 }), h.addEventListener("error", m, { once: !0 }), a(e, h) !== !1 && s.head.appendChild(h);
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
function U(e, t, i) {
  let n, s;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), s = (n ? i : t) || {}, n) {
    if (n in at)
      throw "LoadJS";
    at[n] = !0;
  }
  function r(o, a) {
    xi(e, function(l) {
      Dt(s, l), o && Dt({ success: o, error: a }, l), ge(n, l);
    }, s);
  }
  if (s.returnPromise)
    return new Promise(r);
  r();
}
U.ready = function(t, i) {
  return wi(t, function(n) {
    Dt(i, n);
  }), U;
};
U.done = function(t) {
  ge(t, []);
};
U.reset = function() {
  Object.keys(at).forEach((t) => delete at[t]), Object.keys(gt).forEach((t) => delete gt[t]), Object.keys(lt).forEach((t) => delete lt[t]);
};
U.isDefined = function(t) {
  return t in at;
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
function Si(e) {
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
function Ti(e) {
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
  e.data("rzAspectRatio", () => ({
    init() {
      const t = parseFloat(this.$el.dataset.ratio);
      if (!isNaN(t) && t > 0) {
        const i = 100 / t + "%";
        this.$el.style.paddingBottom = i;
      } else
        this.$el.style.paddingBottom = "100%";
    }
  }));
}
function Oi(e) {
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
function Ni(e, t) {
  function i(n) {
    if (!n) return {};
    const s = document.getElementById(n);
    if (!s)
      return console.warn(`[rzCarousel] JSON script element #${n} not found.`), {};
    try {
      return JSON.parse(s.textContent || "{}");
    } catch (r) {
      return console.error(`[rzCarousel] Failed to parse JSON from #${n}:`, r), {};
    }
  }
  e.data("rzCarousel", () => ({
    emblaApi: null,
    canScrollPrev: !1,
    canScrollNext: !1,
    selectedIndex: 0,
    scrollSnaps: [],
    init() {
      const n = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (c) {
          return console.error("[rzCarousel] Bad assets JSON:", c), [];
        }
      })(), s = this.$el.dataset.nonce || "", r = i(this.$el.dataset.config), o = r.Options || {}, a = r.Plugins || [], l = this;
      n.length > 0 && typeof t == "function" ? t(
        n,
        {
          success() {
            window.EmblaCarousel ? l.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
          },
          error(c) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", c);
          }
        },
        s
      ) : window.EmblaCarousel ? this.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    initializeEmbla(n, s) {
      const r = this.$el.querySelector('[x-ref="viewport"]');
      if (!r) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(s);
      this.emblaApi = window.EmblaCarousel(r, n, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    instantiatePlugins(n) {
      return !Array.isArray(n) || n.length === 0 ? [] : n.map((s) => {
        const r = window[s.Name];
        if (typeof r != "function")
          return console.error(`[rzCarousel] Plugin constructor '${s.Name}' not found on window object.`), null;
        try {
          return r(s.Options || {});
        } catch (o) {
          return console.error(`[rzCarousel] Error instantiating plugin '${s.Name}':`, o), null;
        }
      }).filter(Boolean);
    },
    destroy() {
      this.emblaApi && this.emblaApi.destroy();
    },
    onSelect() {
      this.emblaApi && (this.selectedIndex = this.emblaApi.selectedScrollSnap(), this.canScrollPrev = this.emblaApi.canScrollPrev(), this.canScrollNext = this.emblaApi.canScrollNext(), this.scrollSnaps = this.emblaApi.scrollSnapList());
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
    scrollTo(n) {
      this.emblaApi?.scrollTo(n);
    }
  }));
}
function ki(e) {
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
function $i(e, t) {
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
function Ai(e) {
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
function Ri(e, t) {
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
const Ft = Math.min, X = Math.max, bt = Math.round, P = (e) => ({
  x: e,
  y: e
}), Li = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Di = {
  start: "end",
  end: "start"
};
function Xt(e, t, i) {
  return X(e, Ft(t, i));
}
function St(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function K(e) {
  return e.split("-")[0];
}
function Tt(e) {
  return e.split("-")[1];
}
function ve(e) {
  return e === "x" ? "y" : "x";
}
function we(e) {
  return e === "y" ? "height" : "width";
}
function Z(e) {
  return ["top", "bottom"].includes(K(e)) ? "y" : "x";
}
function ye(e) {
  return ve(Z(e));
}
function Fi(e, t, i) {
  i === void 0 && (i = !1);
  const n = Tt(e), s = ye(e), r = we(s);
  let o = s === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[r] > t.floating[r] && (o = vt(o)), [o, vt(o)];
}
function zi(e) {
  const t = vt(e);
  return [zt(e), t, zt(t)];
}
function zt(e) {
  return e.replace(/start|end/g, (t) => Di[t]);
}
function _i(e, t, i) {
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
function Mi(e, t, i, n) {
  const s = Tt(e);
  let r = _i(K(e), i === "start", n);
  return s && (r = r.map((o) => o + "-" + s), t && (r = r.concat(r.map(zt)))), r;
}
function vt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Li[t]);
}
function Pi(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Bi(e) {
  return typeof e != "number" ? Pi(e) : {
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
  const r = Z(t), o = ye(t), a = we(o), l = K(t), c = r === "y", d = n.x + n.width / 2 - s.width / 2, u = n.y + n.height / 2 - s.height / 2, h = n[a] / 2 - s[a] / 2;
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
  switch (Tt(t)) {
    case "start":
      m[o] -= h * (i && c ? -1 : 1);
      break;
    case "end":
      m[o] += h * (i && c ? -1 : 1);
      break;
  }
  return m;
}
const Wi = async (e, t, i) => {
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
  } = Qt(c, n, l), h = n, m = {}, v = 0;
  for (let b = 0; b < a.length; b++) {
    const {
      name: y,
      fn: g
    } = a[b], {
      x: S,
      y: O,
      data: C,
      reset: w
    } = await g({
      x: d,
      y: u,
      initialPlacement: n,
      placement: h,
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
      [y]: {
        ...m[y],
        ...C
      }
    }, w && v <= 50 && (v++, typeof w == "object" && (w.placement && (h = w.placement), w.rects && (c = w.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: s
    }) : w.rects), {
      x: d,
      y: u
    } = Qt(c, h, l)), b = -1);
  }
  return {
    x: d,
    y: u,
    placement: h,
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
    altBoundary: h = !1,
    padding: m = 0
  } = St(t, e), v = Bi(m), y = a[h ? u === "floating" ? "reference" : "floating" : u], g = wt(await r.getClippingRect({
    element: (i = await (r.isElement == null ? void 0 : r.isElement(y))) == null || i ? y : y.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: d,
    strategy: l
  })), S = u === "floating" ? {
    x: n,
    y: s,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, O = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(a.floating)), C = await (r.isElement == null ? void 0 : r.isElement(O)) ? await (r.getScale == null ? void 0 : r.getScale(O)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, w = wt(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: O,
    strategy: l
  }) : S);
  return {
    top: (g.top - w.top + v.top) / C.y,
    bottom: (w.bottom - g.bottom + v.bottom) / C.y,
    left: (g.left - w.left + v.left) / C.x,
    right: (w.right - g.right + v.right) / C.x
  };
}
const Vi = function(e) {
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
        fallbackPlacements: h,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: b = !0,
        ...y
      } = St(e, t);
      if ((i = r.arrow) != null && i.alignmentOffset)
        return {};
      const g = K(s), S = Z(a), O = K(a) === a, C = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), w = h || (O || !b ? [vt(a)] : zi(a)), f = v !== "none";
      !h && f && w.push(...Mi(a, b, v, C));
      const p = [a, ...w], x = await xe(t, y), T = [];
      let I = ((n = r.flip) == null ? void 0 : n.overflows) || [];
      if (d && T.push(x[g]), u) {
        const R = Fi(s, o, C);
        T.push(x[R[0]], x[R[1]]);
      }
      if (I = [...I, {
        placement: s,
        overflows: T
      }], !T.every((R) => R <= 0)) {
        var N, k;
        const R = (((N = r.flip) == null ? void 0 : N.index) || 0) + 1, G = p[R];
        if (G) {
          var $;
          const L = u === "alignment" ? S !== Z(G) : !1, M = (($ = I[0]) == null ? void 0 : $.overflows[0]) > 0;
          if (!L || M)
            return {
              data: {
                index: R,
                overflows: I
              },
              reset: {
                placement: G
              }
            };
        }
        let D = (k = I.filter((L) => L.overflows[0] <= 0).sort((L, M) => L.overflows[1] - M.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!D)
          switch (m) {
            case "bestFit": {
              var _;
              const L = (_ = I.filter((M) => {
                if (f) {
                  const Y = Z(M.placement);
                  return Y === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Y === "y";
                }
                return !0;
              }).map((M) => [M.placement, M.overflows.filter((Y) => Y > 0).reduce((Y, Ae) => Y + Ae, 0)]).sort((M, Y) => M[1] - Y[1])[0]) == null ? void 0 : _[0];
              L && (D = L);
              break;
            }
            case "initialPlacement":
              D = a;
              break;
          }
        if (s !== D)
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
async function Hi(e, t) {
  const {
    placement: i,
    platform: n,
    elements: s
  } = e, r = await (n.isRTL == null ? void 0 : n.isRTL(s.floating)), o = K(i), a = Tt(i), l = Z(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, d = r && l ? -1 : 1, u = St(t, e);
  let {
    mainAxis: h,
    crossAxis: m,
    alignmentAxis: v
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return a && typeof v == "number" && (m = a === "end" ? v * -1 : v), l ? {
    x: m * d,
    y: h * c
  } : {
    x: h * c,
    y: m * d
  };
}
const Yi = function(e) {
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
      } = t, l = await Hi(t, e);
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
}, ji = function(e) {
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
          fn: (y) => {
            let {
              x: g,
              y: S
            } = y;
            return {
              x: g,
              y: S
            };
          }
        },
        ...l
      } = St(e, t), c = {
        x: i,
        y: n
      }, d = await xe(t, l), u = Z(K(s)), h = ve(u);
      let m = c[h], v = c[u];
      if (r) {
        const y = h === "y" ? "top" : "left", g = h === "y" ? "bottom" : "right", S = m + d[y], O = m - d[g];
        m = Xt(S, m, O);
      }
      if (o) {
        const y = u === "y" ? "top" : "left", g = u === "y" ? "bottom" : "right", S = v + d[y], O = v - d[g];
        v = Xt(S, v, O);
      }
      const b = a.fn({
        ...t,
        [h]: m,
        [u]: v
      });
      return {
        ...b,
        data: {
          x: b.x - i,
          y: b.y - n,
          enabled: {
            [h]: r,
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
function A(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function H(e) {
  var t;
  return (t = (Ie(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Ie(e) {
  return Ct() ? e instanceof Node || e instanceof A(e).Node : !1;
}
function F(e) {
  return Ct() ? e instanceof Element || e instanceof A(e).Element : !1;
}
function B(e) {
  return Ct() ? e instanceof HTMLElement || e instanceof A(e).HTMLElement : !1;
}
function te(e) {
  return !Ct() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof A(e).ShadowRoot;
}
function ut(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: s
  } = z(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !["inline", "contents"].includes(s);
}
function Ui(e) {
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
function Mt(e) {
  const t = Pt(), i = F(e) ? z(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function qi(e) {
  let t = q(e);
  for (; B(t) && !tt(t); ) {
    if (Mt(t))
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
function z(e) {
  return A(e).getComputedStyle(e);
}
function Nt(e) {
  return F(e) ? {
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
    H(e)
  );
  return te(t) ? t.host : t;
}
function Ee(e) {
  const t = q(e);
  return tt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : B(t) && ut(t) ? t : Ee(t);
}
function Se(e, t, i) {
  var n;
  t === void 0 && (t = []);
  const s = Ee(e), r = s === ((n = e.ownerDocument) == null ? void 0 : n.body), o = A(s);
  return r ? (_t(o), t.concat(o, o.visualViewport || [], ut(s) ? s : [], [])) : t.concat(s, Se(s, []));
}
function _t(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Te(e) {
  const t = z(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const s = B(e), r = s ? e.offsetWidth : i, o = s ? e.offsetHeight : n, a = bt(i) !== r || bt(n) !== o;
  return a && (i = r, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Ce(e) {
  return F(e) ? e : e.contextElement;
}
function Q(e) {
  const t = Ce(e);
  if (!B(t))
    return P(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: s,
    $: r
  } = Te(t);
  let o = (r ? bt(i.width) : i.width) / n, a = (r ? bt(i.height) : i.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Gi = /* @__PURE__ */ P(0);
function Oe(e) {
  const t = A(e);
  return !Pt() || !t.visualViewport ? Gi : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Zi(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== A(e) ? !1 : t;
}
function ct(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const s = e.getBoundingClientRect(), r = Ce(e);
  let o = P(1);
  t && (n ? F(n) && (o = Q(n)) : o = Q(e));
  const a = Zi(r, i, n) ? Oe(r) : P(0);
  let l = (s.left + a.x) / o.x, c = (s.top + a.y) / o.y, d = s.width / o.x, u = s.height / o.y;
  if (r) {
    const h = A(r), m = n && F(n) ? A(n) : n;
    let v = h, b = _t(v);
    for (; b && n && m !== v; ) {
      const y = Q(b), g = b.getBoundingClientRect(), S = z(b), O = g.left + (b.clientLeft + parseFloat(S.paddingLeft)) * y.x, C = g.top + (b.clientTop + parseFloat(S.paddingTop)) * y.y;
      l *= y.x, c *= y.y, d *= y.x, u *= y.y, l += O, c += C, v = A(b), b = _t(v);
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
  const i = Nt(e).scrollLeft;
  return t ? t.left + i : ct(H(e)).left + i;
}
function Ne(e, t, i) {
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
function Ji(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: s
  } = e;
  const r = s === "fixed", o = H(n), a = t ? Ot(t.floating) : !1;
  if (n === o || a && r)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = P(1);
  const d = P(0), u = B(n);
  if ((u || !u && !r) && ((et(n) !== "body" || ut(o)) && (l = Nt(n)), B(n))) {
    const m = ct(n);
    c = Q(n), d.x = m.x + n.clientLeft, d.y = m.y + n.clientTop;
  }
  const h = o && !u && !r ? Ne(o, l, !0) : P(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + d.x + h.x,
    y: i.y * c.y - l.scrollTop * c.y + d.y + h.y
  };
}
function Ki(e) {
  return Array.from(e.getClientRects());
}
function Xi(e) {
  const t = H(e), i = Nt(e), n = e.ownerDocument.body, s = X(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), r = X(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Bt(e);
  const a = -i.scrollTop;
  return z(n).direction === "rtl" && (o += X(t.clientWidth, n.clientWidth) - s), {
    width: s,
    height: r,
    x: o,
    y: a
  };
}
function Qi(e, t) {
  const i = A(e), n = H(e), s = i.visualViewport;
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
function tn(e, t) {
  const i = ct(e, !0, t === "fixed"), n = i.top + e.clientTop, s = i.left + e.clientLeft, r = B(e) ? Q(e) : P(1), o = e.clientWidth * r.x, a = e.clientHeight * r.y, l = s * r.x, c = n * r.y;
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
    n = Qi(e, i);
  else if (t === "document")
    n = Xi(H(e));
  else if (F(t))
    n = tn(t, i);
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
function ke(e, t) {
  const i = q(e);
  return i === t || !F(i) || tt(i) ? !1 : z(i).position === "fixed" || ke(i, t);
}
function en(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = Se(e, []).filter((a) => F(a) && et(a) !== "body"), s = null;
  const r = z(e).position === "fixed";
  let o = r ? q(e) : e;
  for (; F(o) && !tt(o); ) {
    const a = z(o), l = Mt(o);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || ut(o) && !l && ke(e, o)) ? n = n.filter((d) => d !== o) : s = a, o = q(o);
  }
  return t.set(e, n), n;
}
function nn(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: s
  } = e;
  const o = [...i === "clippingAncestors" ? Ot(t) ? [] : en(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, d) => {
    const u = ee(t, d, s);
    return c.top = X(u.top, c.top), c.right = Ft(u.right, c.right), c.bottom = Ft(u.bottom, c.bottom), c.left = X(u.left, c.left), c;
  }, ee(t, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function sn(e) {
  const {
    width: t,
    height: i
  } = Te(e);
  return {
    width: t,
    height: i
  };
}
function rn(e, t, i) {
  const n = B(t), s = H(t), r = i === "fixed", o = ct(e, !0, r, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = P(0);
  function c() {
    l.x = Bt(s);
  }
  if (n || !n && !r)
    if ((et(t) !== "body" || ut(s)) && (a = Nt(t)), n) {
      const m = ct(t, !0, r, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
    } else s && c();
  r && !n && s && c();
  const d = s && !n && !r ? Ne(s, a) : P(0), u = o.left + a.scrollLeft - l.x - d.x, h = o.top + a.scrollTop - l.y - d.y;
  return {
    x: u,
    y: h,
    width: o.width,
    height: o.height
  };
}
function $t(e) {
  return z(e).position === "static";
}
function ie(e, t) {
  if (!B(e) || z(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return H(e) === i && (i = i.ownerDocument.body), i;
}
function $e(e, t) {
  const i = A(e);
  if (Ot(e))
    return i;
  if (!B(e)) {
    let s = q(e);
    for (; s && !tt(s); ) {
      if (F(s) && !$t(s))
        return s;
      s = q(s);
    }
    return i;
  }
  let n = ie(e, t);
  for (; n && Ui(n) && $t(n); )
    n = ie(n, t);
  return n && tt(n) && $t(n) && !Mt(n) ? i : n || qi(e) || i;
}
const on = async function(e) {
  const t = this.getOffsetParent || $e, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: rn(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function an(e) {
  return z(e).direction === "rtl";
}
const ln = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ji,
  getDocumentElement: H,
  getClippingRect: nn,
  getOffsetParent: $e,
  getElementRects: on,
  getClientRects: Ki,
  getDimensions: sn,
  getScale: Q,
  isElement: F,
  isRTL: an
}, yt = Yi, xt = ji, It = Vi, Et = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), s = {
    platform: ln,
    ...i
  }, r = {
    ...s.platform,
    _c: n
  };
  return Wi(e, t, {
    ...s,
    platform: r
  });
};
function cn(e) {
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
    // Will be populated when menu opens
    anchor: "bottom",
    pixelOffset: 3,
    isSubmenuActive: !1,
    navThrottle: 100,
    _lastNavAt: 0,
    selfId: null,
    // --- INIT ---
    init() {
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentEl = this.$el, this.triggerEl = this.$refs.trigger, this.anchor = this.$el.dataset.anchor || "bottom", this.pixelOffset = parseInt(this.$el.dataset.offset) || 6, this.isModal = this.$el.dataset.modal !== "false", this.$watch("open", (t) => {
        t ? (this._lastNavAt = 0, this.$nextTick(() => {
          this.contentEl = document.getElementById(`${this.selfId}-content`), this.contentEl && (this.updatePosition(), this.menuItems = Array.from(
            this.contentEl.querySelectorAll(
              '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
            )
          ));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open", this.trapActive = this.isModal) : (this.focusedIndex = null, this.closeAllSubmenus(), this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.trapActive = !1, this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition() {
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), Et(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [yt(this.pixelOffset), It(), xt({ padding: 8 })]
      }).then(({ x: t, y: i }) => {
        Object.assign(this.contentEl.style, { left: `${t}px`, top: `${i}px` });
      }));
    },
    toggle() {
      if (this.open) {
        this.open = !1;
        let t = this;
        this.$nextTick(() => t.triggerEl?.focus());
      } else
        this.open = !0, this.focusedIndex = -1;
    },
    handleOutsideClick() {
      if (!this.open) return;
      this.open = !1;
      let t = this;
      this.$nextTick(() => t.triggerEl?.focus());
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
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      if (i.getAttribute("aria-haspopup") === "menu") {
        e.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = !1;
      let n = this;
      this.$nextTick(() => n.triggerEl?.focus());
    },
    handleItemMouseEnter(t) {
      const i = t.currentTarget;
      this.focusSelectedItem(i), i.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
    },
    handleWindowEscape() {
      if (this.open) {
        this.open = !1;
        let t = this;
        this.$nextTick(() => t.triggerEl?.focus());
      }
    },
    handleContentTabKey() {
      if (this.open) {
        this.open = !1;
        let t = this;
        this.$nextTick(() => t.triggerEl?.focus());
      }
    },
    handleTriggerMouseover() {
      let t = this;
      this.$nextTick(() => t.$el.firstElementChild?.focus());
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
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id;
      const t = this.$el.dataset.parentId;
      if (t) {
        const i = document.getElementById(t);
        i && (this.parentDropdown = e.$data(i));
      }
      if (!this.parentDropdown) {
        console.error("RzDropdownSubmenu could not find its parent RzDropdownMenu controller.");
        return;
      }
      this.triggerEl = this.$refs.subTrigger, this.siblingContainer = this.$el.parentElement, this.anchor = this.$el.dataset.subAnchor || this.anchor, this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset, this.$watch("open", (i) => {
        i ? (this._lastNavAt = 0, this.parentDropdown.isSubmenuActive = !0, this.$nextTick(() => {
          this.contentEl = document.getElementById(`${this.selfId}-subcontent`), this.contentEl && (this.updatePosition(this.contentEl), this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])')));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open") : (this.focusedIndex = null, this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.$nextTick(() => {
          this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]') || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
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
      const t = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      t && Array.from(t).some((n) => e.$data(n)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(t = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, t && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((i) => {
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
function un(e) {
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
function dn(e) {
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
function fn(e) {
  e.data("rzEmpty", () => {
  });
}
function hn(e) {
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
function pn(e) {
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
function mn(e, t) {
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
function gn(e) {
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
function bn(e, t) {
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
function vn(e) {
  e.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    init() {
      this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (t) => {
        this.ariaExpanded = t.toString(), t && this.$nextTick(() => this.updatePosition());
      });
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const t = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, s = parseInt(this.$el.dataset.alignmentAxisOffset) || null, r = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
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
function wn(e) {
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
function yn(e) {
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
function xn(e) {
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
function In(e) {
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
function En(e) {
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
function Sn(e) {
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
      this.open = t !== null ? t === "true" : i, this.checkIfMobile(), window.addEventListener("keydown", (n) => {
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
async function Tn(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ot(e, t, i) {
  Tn(e).then((n) => {
    U.isDefined(n) || U(
      e,
      n,
      {
        async: !1,
        inlineScriptNonce: i,
        inlineStyleNonce: i
      }
    ), U.ready([n], t);
  });
}
function Cn(e) {
  Ei(e), Si(e), Ti(e), Ci(e), Oi(e), Ni(e, ot), ki(e), $i(e, ot), Ai(e), Ri(e, ot), cn(e), un(e), dn(e), fn(e), hn(e), pn(e), mn(e, ot), bn(e), gn(e), vn(e), wn(e), yn(e), xn(e), In(e), En(e), Sn(e);
}
window.RizzyUI = window.RizzyUI || {};
window.RizzyUI.registeredModules = window.RizzyUI.registeredModules || /* @__PURE__ */ new Set();
function On(e) {
  e.directive("rz-init", (t) => {
    queueMicrotask(() => {
      if (t.__rzInitRan) return;
      const i = t.__rzComponent;
      if (!i || typeof i.__initData != "function") return;
      let n = {};
      try {
        n = JSON.parse(t.getAttribute("x-rz-init") || "{}");
      } catch (s) {
        console.warn("[RizzyUI] x-rz-init JSON parse failed.", s, t);
      }
      i.__initData(n), t.__rzInitRan = !0;
    });
  });
}
window.RizzyUI.registerModuleOnce = async (e, t) => {
  if (!window.RizzyUI.registeredModules.has(e)) {
    window.RizzyUI.registeredModules.add(e);
    try {
      const n = await import(new URL(t, document.baseURI).toString()), s = n && n.default;
      if (typeof s != "function") {
        console.error(`[RizzyUI] '${t}' did not export a default function.`);
        return;
      }
      const r = (o) => o !== void 0 ? s(o) : {
        __inited: !1,
        __initData(a) {
          if (this.__inited) return;
          const l = s(a ?? {});
          Object.assign(this, l), typeof l.init == "function" && queueMicrotask(() => l.init.call(this)), this.__inited = !0;
        },
        init() {
          this.$el.__rzComponent = this;
        }
      };
      Alpine.data(e, r);
    } catch (i) {
      console.error(`[RizzyUI] Failed to load/register '${e}' from '${t}'.`, i);
    }
  }
};
function Nn(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: s }) => {
    const r = i.find((g) => g.startsWith("bp-")), o = r ? parseInt(r.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (g) => {
      t.dataset.mobile = g ? "true" : "false", t.dataset.screen = g ? "mobile" : "desktop";
    }, d = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, u = (g) => {
      if (!a) return;
      const S = d();
      S && (S[n] = g);
    }, h = (g) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: g, width: window.innerWidth, breakpoint: o }
        })
      );
    }, m = window.matchMedia(`(max-width: ${o - 1}px)`), v = () => {
      const g = l();
      c(g), u(g), h(g);
    };
    v();
    const b = () => v(), y = () => v();
    m.addEventListener("change", b), window.addEventListener("resize", y, { passive: !0 }), s(() => {
      m.removeEventListener("change", b), window.removeEventListener("resize", y);
    });
  });
}
function kn(e) {
  const t = (i, { expression: n, modifiers: s }, { cleanup: r, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (b, y, g) => {
      const O = y.replace(/\[(\d+)\]/g, ".$1").split("."), C = O.pop();
      let w = b;
      for (const f of O)
        (w[f] == null || typeof w[f] != "object") && (w[f] = isFinite(+f) ? [] : {}), w = w[f];
      w[C] = g;
    }, l = e.closestDataStack(i) || [], c = l[0] || null, d = l[1] || null;
    if (!c || !d) {
      import.meta?.env?.DEV && console.warn("[x-sync] Could not find direct parent/child x-data. Ensure x-sync is used one level inside a parent component.");
      return;
    }
    const u = n.split(",").map((b) => b.trim()).filter(Boolean).map((b) => {
      const y = b.split("->").map((g) => g.trim());
      return y.length !== 2 ? (console.warn('[x-sync] Invalid mapping (expected "parent.path -> child.path"): ', b), null) : { parentPath: y[0], childPath: y[1] };
    }).filter(Boolean), h = s.includes("init-child") || s.includes("child") || s.includes("childWins"), m = u.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: h
      // avoid redundant first child->parent write
    })), v = [];
    u.forEach((b, y) => {
      const g = m[y];
      if (h) {
        const C = e.evaluate(i, b.childPath, { scope: c });
        g.fromChild = !0, a(d, b.parentPath, C), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const C = e.evaluate(i, b.parentPath, { scope: d });
        g.fromParent = !0, a(c, b.childPath, C), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const S = o(() => {
        const C = e.evaluate(i, b.parentPath, { scope: d });
        g.fromChild || (g.fromParent = !0, a(c, b.childPath, C), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), O = o(() => {
        const C = e.evaluate(i, b.childPath, { scope: c });
        if (!g.fromParent) {
          if (g.skipChildOnce) {
            g.skipChildOnce = !1;
            return;
          }
          g.fromChild = !0, a(d, b.parentPath, C), queueMicrotask(() => {
            g.fromChild = !1;
          });
        }
      });
      v.push(S, O);
    }), r(() => {
      for (const b of v)
        try {
          b && b();
        } catch {
        }
    });
  };
  e.directive("sync", t);
}
W.plugin(Le);
W.plugin(Me);
W.plugin(ri);
Cn(W);
On(W);
Nn(W);
kn(W);
const $n = {
  Alpine: W,
  require: ot,
  toast: vi,
  $data: Ii
};
window.Alpine = W;
window.Rizzy = { ...window.Rizzy || {}, ...$n };
W.start();
export {
  $n as default
};
