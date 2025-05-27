var Ot = !1, It = !1, re = [], At = -1;
function $i(e) {
  Fi(e);
}
function Fi(e) {
  re.includes(e) || re.push(e), Di();
}
function Mi(e) {
  let t = re.indexOf(e);
  t !== -1 && t > At && re.splice(t, 1);
}
function Di() {
  !It && !Ot && (Ot = !0, queueMicrotask(Pi));
}
function Pi() {
  Ot = !1, It = !0;
  for (let e = 0; e < re.length; e++)
    re[e](), At = e;
  re.length = 0, At = -1, It = !1;
}
var ge, ue, ve, Gn, Nt = !0;
function zi(e) {
  Nt = !1, e(), Nt = !0;
}
function Bi(e) {
  ge = e.reactive, ve = e.release, ue = (t) => e.effect(t, { scheduler: (n) => {
    Nt ? $i(n) : n();
  } }), Gn = e.raw;
}
function yn(e) {
  ue = e;
}
function ji(e) {
  let t = () => {
  };
  return [(r) => {
    let i = ue(r);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(i), t = () => {
      i !== void 0 && (e._x_effects.delete(i), ve(i));
    }, i;
  }, () => {
    t();
  }];
}
function Zn(e, t) {
  let n = !0, r, i = ue(() => {
    let s = e();
    JSON.stringify(s), n ? r = s : queueMicrotask(() => {
      t(s, r), r = s;
    }), n = !1;
  });
  return () => ve(i);
}
var Jn = [], Xn = [], Qn = [];
function Wi(e) {
  Qn.push(e);
}
function Ut(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Xn.push(t));
}
function er(e) {
  Jn.push(e);
}
function tr(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function nr(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, r]) => {
    (t === void 0 || t.includes(n)) && (r.forEach((i) => i()), delete e._x_attributeCleanups[n]);
  });
}
function Hi(e) {
  for (e._x_effects?.forEach(Mi); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var Gt = new MutationObserver(Qt), Zt = !1;
function Jt() {
  Gt.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Zt = !0;
}
function rr() {
  Vi(), Gt.disconnect(), Zt = !1;
}
var Ee = [];
function Vi() {
  let e = Gt.takeRecords();
  Ee.push(() => e.length > 0 && Qt(e));
  let t = Ee.length;
  queueMicrotask(() => {
    if (Ee.length === t)
      for (; Ee.length > 0; )
        Ee.shift()();
  });
}
function I(e) {
  if (!Zt)
    return e();
  rr();
  let t = e();
  return Jt(), t;
}
var Xt = !1, et = [];
function Yi() {
  Xt = !0;
}
function Ki() {
  Xt = !1, Qt(et), et = [];
}
function Qt(e) {
  if (Xt) {
    et = et.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let s = 0; s < e.length; s++)
    if (!e[s].target._x_ignoreMutationObserver && (e[s].type === "childList" && (e[s].removedNodes.forEach((o) => {
      o.nodeType === 1 && o._x_marker && n.add(o);
    }), e[s].addedNodes.forEach((o) => {
      if (o.nodeType === 1) {
        if (n.has(o)) {
          n.delete(o);
          return;
        }
        o._x_marker || t.push(o);
      }
    })), e[s].type === "attributes")) {
      let o = e[s].target, a = e[s].attributeName, c = e[s].oldValue, l = () => {
        r.has(o) || r.set(o, []), r.get(o).push({ name: a, value: o.getAttribute(a) });
      }, u = () => {
        i.has(o) || i.set(o, []), i.get(o).push(a);
      };
      o.hasAttribute(a) && c === null ? l() : o.hasAttribute(a) ? (u(), l()) : u();
    }
  i.forEach((s, o) => {
    nr(o, s);
  }), r.forEach((s, o) => {
    Jn.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || Xn.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && Qn.forEach((o) => o(s));
  t = null, n = null, r = null, i = null;
}
function ir(e) {
  return be(ae(e));
}
function ze(e, t, n) {
  return e._x_dataStack = [t, ...ae(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((r) => r !== t);
  };
}
function ae(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? ae(e.host) : e.parentNode ? ae(e.parentNode) : [];
}
function be(e) {
  return new Proxy({ objects: e }, qi);
}
var qi = {
  ownKeys({ objects: e }) {
    return Array.from(
      new Set(e.flatMap((t) => Object.keys(t)))
    );
  },
  has({ objects: e }, t) {
    return t == Symbol.unscopables ? !1 : e.some(
      (n) => Object.prototype.hasOwnProperty.call(n, t) || Reflect.has(n, t)
    );
  },
  get({ objects: e }, t, n) {
    return t == "toJSON" ? Ui : Reflect.get(
      e.find(
        (r) => Reflect.has(r, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, r) {
    const i = e.find(
      (o) => Object.prototype.hasOwnProperty.call(o, t)
    ) || e[e.length - 1], s = Object.getOwnPropertyDescriptor(i, t);
    return s?.set && s?.get ? s.set.call(r, n) || !0 : Reflect.set(i, t, n);
  }
};
function Ui() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function sr(e) {
  let t = (r) => typeof r == "object" && !Array.isArray(r) && r !== null, n = (r, i = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(r)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let c = i === "" ? s : `${i}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? r[s] = o.initialize(e, c, s) : t(o) && o !== r && !(o instanceof Element) && n(o, c);
    });
  };
  return n(e);
}
function or(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, s) {
      return e(this.initialValue, () => Gi(r, i), (o) => Rt(r, i, o), i, s);
    }
  };
  return t(n), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (s, o, a) => {
        let c = r.initialize(s, o, a);
        return n.initialValue = c, i(s, o, a);
      };
    } else
      n.initialValue = r;
    return n;
  };
}
function Gi(e, t) {
  return t.split(".").reduce((n, r) => n[r], e);
}
function Rt(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Rt(e[t[0]], t.slice(1), n);
  }
}
var ar = {};
function B(e, t) {
  ar[e] = t;
}
function tt(e, t) {
  let n = Zi(t);
  return Object.entries(ar).forEach(([r, i]) => {
    Object.defineProperty(e, `$${r}`, {
      get() {
        return i(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Zi(e) {
  let [t, n] = pr(e), r = { interceptor: or, ...t };
  return Ut(e, n), r;
}
function cr(e, t, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    $e(i, e, t);
  }
}
function $e(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Ze = !0;
function lr(e) {
  let t = Ze;
  Ze = !1;
  let n = e();
  return Ze = t, n;
}
function ie(e, t, n = {}) {
  let r;
  return L(e, t)((i) => r = i, n), r;
}
function L(...e) {
  return ur(...e);
}
var ur = Xi;
function Ji(e) {
  ur = e;
}
function Xi(e, t) {
  let n = {};
  tt(n, e);
  let r = [n, ...ae(e)], i = typeof t == "function" ? dr(r, t) : es(r, t, e);
  return cr.bind(null, e, t, i);
}
function dr(e, t) {
  return (n = () => {
  }, { scope: r = {}, params: i = [] } = {}) => {
    let s = t.apply(be([r, ...e]), i);
    Fe(n, s);
  };
}
var _t = {};
function Qi(e, t) {
  if (_t[e])
    return _t[e];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, r = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, s = (() => {
    try {
      let o = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(o, "name", {
        value: `[Alpine] ${e}`
      }), o;
    } catch (o) {
      return $e(o, t, e), Promise.resolve();
    }
  })();
  return _t[e] = s, s;
}
function es(e, t, n) {
  let r = Qi(t, n);
  return (i = () => {
  }, { scope: s = {}, params: o = [] } = {}) => {
    r.result = void 0, r.finished = !1;
    let a = be([s, ...e]);
    if (typeof r == "function") {
      let c = r(r, a).catch((l) => $e(l, n, t));
      r.finished ? (Fe(i, r.result, a, o, n), r.result = void 0) : c.then((l) => {
        Fe(i, l, a, o, n);
      }).catch((l) => $e(l, n, t)).finally(() => r.result = void 0);
    }
  };
}
function Fe(e, t, n, r, i) {
  if (Ze && typeof t == "function") {
    let s = t.apply(n, r);
    s instanceof Promise ? s.then((o) => Fe(e, o, n, r)).catch((o) => $e(o, i, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var en = "x-";
function me(e = "") {
  return en + e;
}
function ts(e) {
  en = e;
}
var nt = {};
function N(e, t) {
  return nt[e] = t, {
    before(n) {
      if (!nt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const r = ne.indexOf(n);
      ne.splice(r >= 0 ? r : ne.indexOf("DEFAULT"), 0, e);
    }
  };
}
function ns(e) {
  return Object.keys(nt).includes(e);
}
function tn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({ name: a, value: c })), o = fr(s);
    s = s.map((a) => o.find((c) => c.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let r = {};
  return t.map(br((s, o) => r[s] = o)).filter(yr).map(ss(r, n)).sort(os).map((s) => is(e, s));
}
function fr(e) {
  return Array.from(e).map(br()).filter((t) => !yr(t));
}
var Lt = !1, Ne = /* @__PURE__ */ new Map(), hr = Symbol();
function rs(e) {
  Lt = !0;
  let t = Symbol();
  hr = t, Ne.set(t, []);
  let n = () => {
    for (; Ne.get(t).length; )
      Ne.get(t).shift()();
    Ne.delete(t);
  }, r = () => {
    Lt = !1, n();
  };
  e(n), r();
}
function pr(e) {
  let t = [], n = (a) => t.push(a), [r, i] = ji(e);
  return t.push(i), [{
    Alpine: Be,
    effect: r,
    cleanup: n,
    evaluateLater: L.bind(L, e),
    evaluate: ie.bind(ie, e)
  }, () => t.forEach((a) => a())];
}
function is(e, t) {
  let n = () => {
  }, r = nt[t.type] || n, [i, s] = pr(e);
  tr(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (r.inline && r.inline(e, t, i), r = r.bind(r, e, t, i), Lt ? Ne.get(hr).push(r) : r());
  };
  return o.runCleanups = s, o;
}
var gr = (e, t) => ({ name: n, value: r }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: r }), vr = (e) => e;
function br(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: r, value: i } = mr.reduce((s, o) => o(s), { name: t, value: n });
    return r !== t && e(r, t), { name: r, value: i };
  };
}
var mr = [];
function nn(e) {
  mr.push(e);
}
function yr({ name: e }) {
  return _r().test(e);
}
var _r = () => new RegExp(`^${en}([^:^.]+)\\b`);
function ss(e, t) {
  return ({ name: n, value: r }) => {
    let i = n.match(_r()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
    return {
      type: i ? i[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((c) => c.replace(".", "")),
      expression: r,
      original: a
    };
  };
}
var kt = "DEFAULT", ne = [
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
  kt,
  "teleport"
];
function os(e, t) {
  let n = ne.indexOf(e.type) === -1 ? kt : e.type, r = ne.indexOf(t.type) === -1 ? kt : t.type;
  return ne.indexOf(n) - ne.indexOf(r);
}
function Re(e, t, n = {}) {
  e.dispatchEvent(
    new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0
    })
  );
}
function ce(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((i) => ce(i, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let r = e.firstElementChild;
  for (; r; )
    ce(r, t), r = r.nextElementSibling;
}
function $(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var _n = !1;
function as() {
  _n && $("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), _n = !0, document.body || $("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Re(document, "alpine:init"), Re(document, "alpine:initializing"), Jt(), Wi((t) => V(t, ce)), Ut((t) => _e(t)), er((t, n) => {
    tn(t, n).forEach((r) => r());
  });
  let e = (t) => !ct(t.parentElement, !0);
  Array.from(document.querySelectorAll(Er().join(","))).filter(e).forEach((t) => {
    V(t);
  }), Re(document, "alpine:initialized"), setTimeout(() => {
    ds();
  });
}
var rn = [], wr = [];
function xr() {
  return rn.map((e) => e());
}
function Er() {
  return rn.concat(wr).map((e) => e());
}
function Sr(e) {
  rn.push(e);
}
function Cr(e) {
  wr.push(e);
}
function ct(e, t = !1) {
  return ye(e, (n) => {
    if ((t ? Er() : xr()).some((i) => n.matches(i)))
      return !0;
  });
}
function ye(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return ye(e.parentElement, t);
  }
}
function cs(e) {
  return xr().some((t) => e.matches(t));
}
var Tr = [];
function ls(e) {
  Tr.push(e);
}
var us = 1;
function V(e, t = ce, n = () => {
}) {
  ye(e, (r) => r._x_ignore) || rs(() => {
    t(e, (r, i) => {
      r._x_marker || (n(r, i), Tr.forEach((s) => s(r, i)), tn(r, r.attributes).forEach((s) => s()), r._x_ignore || (r._x_marker = us++), r._x_ignore && i());
    });
  });
}
function _e(e, t = ce) {
  t(e, (n) => {
    Hi(n), nr(n), delete n._x_marker;
  });
}
function ds() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, r]) => {
    ns(n) || r.some((i) => {
      if (document.querySelector(i))
        return $(`found "${i}", but missing ${t} plugin`), !0;
    });
  });
}
var $t = [], sn = !1;
function on(e = () => {
}) {
  return queueMicrotask(() => {
    sn || setTimeout(() => {
      Ft();
    });
  }), new Promise((t) => {
    $t.push(() => {
      e(), t();
    });
  });
}
function Ft() {
  for (sn = !1; $t.length; )
    $t.shift()();
}
function fs() {
  sn = !0;
}
function an(e, t) {
  return Array.isArray(t) ? wn(e, t.join(" ")) : typeof t == "object" && t !== null ? hs(e, t) : typeof t == "function" ? an(e, t()) : wn(e, t);
}
function wn(e, t) {
  let n = (i) => i.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), r = (i) => (e.classList.add(...i), () => {
    e.classList.remove(...i);
  });
  return t = t === !0 ? t = "" : t || "", r(n(t));
}
function hs(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), r = Object.entries(t).flatMap(([a, c]) => c ? n(a) : !1).filter(Boolean), i = Object.entries(t).flatMap(([a, c]) => c ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return i.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), r.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function lt(e, t) {
  return typeof t == "object" && t !== null ? ps(e, t) : gs(e, t);
}
function ps(e, t) {
  let n = {};
  return Object.entries(t).forEach(([r, i]) => {
    n[r] = e.style[r], r.startsWith("--") || (r = vs(r)), e.style.setProperty(r, i);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    lt(e, n);
  };
}
function gs(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function vs(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Mt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
N("transition", (e, { value: t, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? ms(e, n, t) : bs(e, r, t));
});
function bs(e, t, n) {
  Or(e, an, ""), {
    enter: (i) => {
      e._x_transition.enter.during = i;
    },
    "enter-start": (i) => {
      e._x_transition.enter.start = i;
    },
    "enter-end": (i) => {
      e._x_transition.enter.end = i;
    },
    leave: (i) => {
      e._x_transition.leave.during = i;
    },
    "leave-start": (i) => {
      e._x_transition.leave.start = i;
    },
    "leave-end": (i) => {
      e._x_transition.leave.end = i;
    }
  }[n](t);
}
function ms(e, t, n) {
  Or(e, lt);
  let r = !t.includes("in") && !t.includes("out") && !n, i = r || t.includes("in") || ["enter"].includes(n), s = r || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !r && (t = t.filter((y, _) => _ < t.indexOf("out"))), t.includes("out") && !r && (t = t.filter((y, _) => _ > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), c = o || t.includes("scale"), l = a ? 0 : 1, u = c ? Se(t, "scale", 95) / 100 : 1, d = Se(t, "delay", 0) / 1e3, f = Se(t, "origin", "center"), v = "opacity, transform", w = Se(t, "duration", 150) / 1e3, E = Se(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: v,
    transitionDuration: `${w}s`,
    transitionTimingFunction: g
  }, e._x_transition.enter.start = {
    opacity: l,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: v,
    transitionDuration: `${E}s`,
    transitionTimingFunction: g
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: l,
    transform: `scale(${u})`
  });
}
function Or(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(r = () => {
    }, i = () => {
    }) {
      Dt(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, i);
    },
    out(r = () => {
    }, i = () => {
    }) {
      Dt(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, r, i);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, r) {
  const i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => i(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : s() : e._x_transition ? e._x_transition.in(n) : s();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((o, a) => {
    e._x_transition.out(() => {
    }, () => o(r)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(r), queueMicrotask(() => {
    let o = Ir(e);
    o ? (o._x_hideChildren || (o._x_hideChildren = []), o._x_hideChildren.push(e)) : i(() => {
      let a = (c) => {
        let l = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(a)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, l;
      };
      a(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function Ir(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Ir(t);
}
function Dt(e, t, { during: n, start: r, end: i } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    s(), o();
    return;
  }
  let a, c, l;
  ys(e, {
    start() {
      a = t(e, r);
    },
    during() {
      c = t(e, n);
    },
    before: s,
    end() {
      a(), l = t(e, i);
    },
    after: o,
    cleanup() {
      c(), l();
    }
  });
}
function ys(e, t) {
  let n, r, i, s = Mt(() => {
    I(() => {
      n = !0, r || t.before(), i || (t.end(), Ft()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Mt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, I(() => {
    t.start(), t.during();
  }), fs(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), I(() => {
      t.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (I(() => {
        t.end();
      }), Ft(), setTimeout(e._x_transitioning.finish, o + a), i = !0);
    });
  });
}
function Se(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const r = e[e.indexOf(t) + 1];
  if (!r || t === "scale" && isNaN(r))
    return n;
  if (t === "duration" || t === "delay") {
    let i = r.match(/([0-9]+)ms/);
    if (i)
      return i[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [r, e[e.indexOf(t) + 2]].join(" ") : r;
}
var Z = !1;
function Q(e, t = () => {
}) {
  return (...n) => Z ? t(...n) : e(...n);
}
function _s(e) {
  return (...t) => Z && e(...t);
}
var Ar = [];
function ut(e) {
  Ar.push(e);
}
function ws(e, t) {
  Ar.forEach((n) => n(e, t)), Z = !0, Nr(() => {
    V(t, (n, r) => {
      r(n, () => {
      });
    });
  }), Z = !1;
}
var Pt = !1;
function xs(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Z = !0, Pt = !0, Nr(() => {
    Es(t);
  }), Z = !1, Pt = !1;
}
function Es(e) {
  let t = !1;
  V(e, (r, i) => {
    ce(r, (s, o) => {
      if (t && cs(s))
        return o();
      t = !0, i(s, o);
    });
  });
}
function Nr(e) {
  let t = ue;
  yn((n, r) => {
    let i = t(n);
    return ve(i), () => {
    };
  }), e(), yn(t);
}
function Rr(e, t, n, r = []) {
  switch (e._x_bindings || (e._x_bindings = ge({})), e._x_bindings[t] = n, t = r.includes("camel") ? Rs(t) : t, t) {
    case "value":
      Ss(e, n);
      break;
    case "style":
      Ts(e, n);
      break;
    case "class":
      Cs(e, n);
      break;
    case "selected":
    case "checked":
      Os(e, t, n);
      break;
    default:
      Lr(e, t, n);
      break;
  }
}
function Ss(e, t) {
  if (Fr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = Je(e.value) === t : e.checked = xn(e.value, t));
  else if (cn(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => xn(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Ns(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Cs(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = an(e, t);
}
function Ts(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = lt(e, t);
}
function Os(e, t, n) {
  Lr(e, t, n), As(e, t, n);
}
function Lr(e, t, n) {
  [null, void 0, !1].includes(n) && ks(t) ? e.removeAttribute(t) : (kr(t) && (n = t), Is(e, t, n));
}
function Is(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function As(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Ns(e, t) {
  const n = [].concat(t).map((r) => r + "");
  Array.from(e.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function Rs(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function xn(e, t) {
  return e == t;
}
function Je(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Ls = /* @__PURE__ */ new Set([
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
function kr(e) {
  return Ls.has(e);
}
function ks(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function $s(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : $r(e, t, n);
}
function Fs(e, t, n, r = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let i = e._x_inlineBindings[t];
    return i.extract = r, lr(() => ie(e, i.expression));
  }
  return $r(e, t, n);
}
function $r(e, t, n) {
  let r = e.getAttribute(t);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : kr(t) ? !![t, "true"].includes(r) : r;
}
function cn(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Fr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Mr(e, t) {
  var n;
  return function() {
    var r = this, i = arguments, s = function() {
      n = null, e.apply(r, i);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function Dr(e, t) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (e.apply(r, i), n = !0, setTimeout(() => n = !1, t));
  };
}
function Pr({ get: e, set: t }, { get: n, set: r }) {
  let i = !0, s, o = ue(() => {
    let a = e(), c = n();
    if (i)
      r(wt(a)), i = !1;
    else {
      let l = JSON.stringify(a), u = JSON.stringify(c);
      l !== s ? r(wt(a)) : l !== u && t(wt(c));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    ve(o);
  };
}
function wt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Ms(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Be));
}
var te = {}, En = !1;
function Ds(e, t) {
  if (En || (te = ge(te), En = !0), t === void 0)
    return te[e];
  te[e] = t, sr(te[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && te[e].init();
}
function Ps() {
  return te;
}
var zr = {};
function zs(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Br(e, n()) : (zr[e] = n, () => {
  });
}
function Bs(e) {
  return Object.entries(zr).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...r) => n(...r);
      }
    });
  }), e;
}
function Br(e, t, n) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let i = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = fr(i);
  return i = i.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), tn(e, i, n).map((o) => {
    r.push(o.runCleanups), o();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var jr = {};
function js(e, t) {
  jr[e] = t;
}
function Ws(e, t) {
  return Object.entries(jr).forEach(([n, r]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...i) => r.bind(t)(...i);
      },
      enumerable: !1
    });
  }), e;
}
var Hs = {
  get reactive() {
    return ge;
  },
  get release() {
    return ve;
  },
  get effect() {
    return ue;
  },
  get raw() {
    return Gn;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: Ki,
  dontAutoEvaluateFunctions: lr,
  disableEffectScheduling: zi,
  startObservingMutations: Jt,
  stopObservingMutations: rr,
  setReactivityEngine: Bi,
  onAttributeRemoved: tr,
  onAttributesAdded: er,
  closestDataStack: ae,
  skipDuringClone: Q,
  onlyDuringClone: _s,
  addRootSelector: Sr,
  addInitSelector: Cr,
  interceptClone: ut,
  addScopeToNode: ze,
  deferMutations: Yi,
  mapAttributes: nn,
  evaluateLater: L,
  interceptInit: ls,
  setEvaluator: Ji,
  mergeProxies: be,
  extractProp: Fs,
  findClosest: ye,
  onElRemoved: Ut,
  closestRoot: ct,
  destroyTree: _e,
  interceptor: or,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Dt,
  // INTERNAL
  setStyles: lt,
  // INTERNAL
  mutateDom: I,
  directive: N,
  entangle: Pr,
  throttle: Dr,
  debounce: Mr,
  evaluate: ie,
  initTree: V,
  nextTick: on,
  prefixed: me,
  prefix: ts,
  plugin: Ms,
  magic: B,
  store: Ds,
  start: as,
  clone: xs,
  // INTERNAL
  cloneNode: ws,
  // INTERNAL
  bound: $s,
  $data: ir,
  watch: Zn,
  walk: ce,
  data: js,
  bind: zs
}, Be = Hs;
function Vs(e, t) {
  let n = Ys(e);
  if (typeof t == "function")
    return dr(n, t);
  let r = Ks(e, t, n);
  return cr.bind(null, e, t, r);
}
function Ys(e) {
  let t = {};
  return tt(t, e), [t, ...ae(e)];
}
function Ks(e, t, n) {
  return (r = () => {
  }, { scope: i = {}, params: s = [] } = {}) => {
    let o = be([i, ...n]), a = t.split(".").reduce(
      (c, l) => (c[l] === void 0 && qs(e, t), c[l]),
      o
    );
    Fe(r, a, o, s);
  };
}
function qs(e, t) {
  console.warn(
    `Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${t}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
    e
  );
}
function Us(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = e.split(",");
  for (let i = 0; i < r.length; i++)
    n[r[i]] = !0;
  return (i) => !!n[i];
}
var Gs = Object.freeze({}), Zs = Object.prototype.hasOwnProperty, dt = (e, t) => Zs.call(e, t), se = Array.isArray, Le = (e) => Wr(e) === "[object Map]", Js = (e) => typeof e == "string", ln = (e) => typeof e == "symbol", ft = (e) => e !== null && typeof e == "object", Xs = Object.prototype.toString, Wr = (e) => Xs.call(e), Hr = (e) => Wr(e).slice(8, -1), un = (e) => Js(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Qs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, eo = Qs((e) => e.charAt(0).toUpperCase() + e.slice(1)), Vr = (e, t) => e !== t && (e === e || t === t), zt = /* @__PURE__ */ new WeakMap(), Ce = [], j, oe = Symbol("iterate"), Bt = Symbol("Map key iterate");
function to(e) {
  return e && e._isEffect === !0;
}
function no(e, t = Gs) {
  to(e) && (e = e.raw);
  const n = so(e, t);
  return t.lazy || n(), n;
}
function ro(e) {
  e.active && (Yr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var io = 0;
function so(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Ce.includes(n)) {
      Yr(n);
      try {
        return ao(), Ce.push(n), j = n, e();
      } finally {
        Ce.pop(), Kr(), j = Ce[Ce.length - 1];
      }
    }
  };
  return n.id = io++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function Yr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var he = !0, dn = [];
function oo() {
  dn.push(he), he = !1;
}
function ao() {
  dn.push(he), he = !0;
}
function Kr() {
  const e = dn.pop();
  he = e === void 0 ? !0 : e;
}
function D(e, t, n) {
  if (!he || j === void 0)
    return;
  let r = zt.get(e);
  r || zt.set(e, r = /* @__PURE__ */ new Map());
  let i = r.get(n);
  i || r.set(n, i = /* @__PURE__ */ new Set()), i.has(j) || (i.add(j), j.deps.push(i), j.options.onTrack && j.options.onTrack({
    effect: j,
    target: e,
    type: t,
    key: n
  }));
}
function J(e, t, n, r, i, s) {
  const o = zt.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), c = (u) => {
    u && u.forEach((d) => {
      (d !== j || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(c);
  else if (n === "length" && se(e))
    o.forEach((u, d) => {
      (d === "length" || d >= r) && c(u);
    });
  else
    switch (n !== void 0 && c(o.get(n)), t) {
      case "add":
        se(e) ? un(n) && c(o.get("length")) : (c(o.get(oe)), Le(e) && c(o.get(Bt)));
        break;
      case "delete":
        se(e) || (c(o.get(oe)), Le(e) && c(o.get(Bt)));
        break;
      case "set":
        Le(e) && c(o.get(oe));
        break;
    }
  const l = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: e,
      key: n,
      type: t,
      newValue: r,
      oldValue: i,
      oldTarget: s
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(l);
}
var co = /* @__PURE__ */ Us("__proto__,__v_isRef,__isVue"), qr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(ln)), lo = /* @__PURE__ */ Ur(), uo = /* @__PURE__ */ Ur(!0), Sn = /* @__PURE__ */ fo();
function fo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const r = C(this);
      for (let s = 0, o = this.length; s < o; s++)
        D(r, "get", s + "");
      const i = r[t](...n);
      return i === -1 || i === !1 ? r[t](...n.map(C)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      oo();
      const r = C(this)[t].apply(this, n);
      return Kr(), r;
    };
  }), e;
}
function Ur(e = !1, t = !1) {
  return function(r, i, s) {
    if (i === "__v_isReactive")
      return !e;
    if (i === "__v_isReadonly")
      return e;
    if (i === "__v_raw" && s === (e ? t ? To : Xr : t ? Co : Jr).get(r))
      return r;
    const o = se(r);
    if (!e && o && dt(Sn, i))
      return Reflect.get(Sn, i, s);
    const a = Reflect.get(r, i, s);
    return (ln(i) ? qr.has(i) : co(i)) || (e || D(r, "get", i), t) ? a : jt(a) ? !o || !un(i) ? a.value : a : ft(a) ? e ? Qr(a) : gn(a) : a;
  };
}
var ho = /* @__PURE__ */ po();
function po(e = !1) {
  return function(n, r, i, s) {
    let o = n[r];
    if (!e && (i = C(i), o = C(o), !se(n) && jt(o) && !jt(i)))
      return o.value = i, !0;
    const a = se(n) && un(r) ? Number(r) < n.length : dt(n, r), c = Reflect.set(n, r, i, s);
    return n === C(s) && (a ? Vr(i, o) && J(n, "set", r, i, o) : J(n, "add", r, i)), c;
  };
}
function go(e, t) {
  const n = dt(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
  return i && n && J(e, "delete", t, void 0, r), i;
}
function vo(e, t) {
  const n = Reflect.has(e, t);
  return (!ln(t) || !qr.has(t)) && D(e, "has", t), n;
}
function bo(e) {
  return D(e, "iterate", se(e) ? "length" : oe), Reflect.ownKeys(e);
}
var mo = {
  get: lo,
  set: ho,
  deleteProperty: go,
  has: vo,
  ownKeys: bo
}, yo = {
  get: uo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, fn = (e) => ft(e) ? gn(e) : e, hn = (e) => ft(e) ? Qr(e) : e, pn = (e) => e, ht = (e) => Reflect.getPrototypeOf(e);
function He(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const i = C(e), s = C(t);
  t !== s && !n && D(i, "get", t), !n && D(i, "get", s);
  const { has: o } = ht(i), a = r ? pn : n ? hn : fn;
  if (o.call(i, t))
    return a(e.get(t));
  if (o.call(i, s))
    return a(e.get(s));
  e !== i && e.get(t);
}
function Ve(e, t = !1) {
  const n = this.__v_raw, r = C(n), i = C(e);
  return e !== i && !t && D(r, "has", e), !t && D(r, "has", i), e === i ? n.has(e) : n.has(e) || n.has(i);
}
function Ye(e, t = !1) {
  return e = e.__v_raw, !t && D(C(e), "iterate", oe), Reflect.get(e, "size", e);
}
function Cn(e) {
  e = C(e);
  const t = C(this);
  return ht(t).has.call(t, e) || (t.add(e), J(t, "add", e, e)), this;
}
function Tn(e, t) {
  t = C(t);
  const n = C(this), { has: r, get: i } = ht(n);
  let s = r.call(n, e);
  s ? Zr(n, r, e) : (e = C(e), s = r.call(n, e));
  const o = i.call(n, e);
  return n.set(e, t), s ? Vr(t, o) && J(n, "set", e, t, o) : J(n, "add", e, t), this;
}
function On(e) {
  const t = C(this), { has: n, get: r } = ht(t);
  let i = n.call(t, e);
  i ? Zr(t, n, e) : (e = C(e), i = n.call(t, e));
  const s = r ? r.call(t, e) : void 0, o = t.delete(e);
  return i && J(t, "delete", e, void 0, s), o;
}
function In() {
  const e = C(this), t = e.size !== 0, n = Le(e) ? new Map(e) : new Set(e), r = e.clear();
  return t && J(e, "clear", void 0, void 0, n), r;
}
function Ke(e, t) {
  return function(r, i) {
    const s = this, o = s.__v_raw, a = C(o), c = t ? pn : e ? hn : fn;
    return !e && D(a, "iterate", oe), o.forEach((l, u) => r.call(i, c(l), c(u), s));
  };
}
function qe(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, s = C(i), o = Le(s), a = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? pn : t ? hn : fn;
    return !t && D(s, "iterate", c ? Bt : oe), {
      // iterator protocol
      next() {
        const { value: d, done: f } = l.next();
        return f ? { value: d, done: f } : {
          value: a ? [u(d[0]), u(d[1])] : u(d),
          done: f
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function q(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${eo(e)} operation ${n}failed: target is readonly.`, C(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function _o() {
  const e = {
    get(s) {
      return He(this, s);
    },
    get size() {
      return Ye(this);
    },
    has: Ve,
    add: Cn,
    set: Tn,
    delete: On,
    clear: In,
    forEach: Ke(!1, !1)
  }, t = {
    get(s) {
      return He(this, s, !1, !0);
    },
    get size() {
      return Ye(this);
    },
    has: Ve,
    add: Cn,
    set: Tn,
    delete: On,
    clear: In,
    forEach: Ke(!1, !0)
  }, n = {
    get(s) {
      return He(this, s, !0);
    },
    get size() {
      return Ye(this, !0);
    },
    has(s) {
      return Ve.call(this, s, !0);
    },
    add: q(
      "add"
      /* ADD */
    ),
    set: q(
      "set"
      /* SET */
    ),
    delete: q(
      "delete"
      /* DELETE */
    ),
    clear: q(
      "clear"
      /* CLEAR */
    ),
    forEach: Ke(!0, !1)
  }, r = {
    get(s) {
      return He(this, s, !0, !0);
    },
    get size() {
      return Ye(this, !0);
    },
    has(s) {
      return Ve.call(this, s, !0);
    },
    add: q(
      "add"
      /* ADD */
    ),
    set: q(
      "set"
      /* SET */
    ),
    delete: q(
      "delete"
      /* DELETE */
    ),
    clear: q(
      "clear"
      /* CLEAR */
    ),
    forEach: Ke(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = qe(s, !1, !1), n[s] = qe(s, !0, !1), t[s] = qe(s, !1, !0), r[s] = qe(s, !0, !0);
  }), [
    e,
    n,
    t,
    r
  ];
}
var [wo, xo, Ac, Nc] = /* @__PURE__ */ _o();
function Gr(e, t) {
  const n = e ? xo : wo;
  return (r, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(dt(n, i) && i in r ? n : r, i, s);
}
var Eo = {
  get: /* @__PURE__ */ Gr(!1)
}, So = {
  get: /* @__PURE__ */ Gr(!0)
};
function Zr(e, t, n) {
  const r = C(n);
  if (r !== n && t.call(e, r)) {
    const i = Hr(e);
    console.warn(`Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Jr = /* @__PURE__ */ new WeakMap(), Co = /* @__PURE__ */ new WeakMap(), Xr = /* @__PURE__ */ new WeakMap(), To = /* @__PURE__ */ new WeakMap();
function Oo(e) {
  switch (e) {
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
function Io(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Oo(Hr(e));
}
function gn(e) {
  return e && e.__v_isReadonly ? e : ei(e, !1, mo, Eo, Jr);
}
function Qr(e) {
  return ei(e, !0, yo, So, Xr);
}
function ei(e, t, n, r, i) {
  if (!ft(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = i.get(e);
  if (s)
    return s;
  const o = Io(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? r : n);
  return i.set(e, a), a;
}
function C(e) {
  return e && C(e.__v_raw) || e;
}
function jt(e) {
  return !!(e && e.__v_isRef === !0);
}
B("nextTick", () => on);
B("dispatch", (e) => Re.bind(Re, e));
B("watch", (e, { evaluateLater: t, cleanup: n }) => (r, i) => {
  let s = t(r), a = Zn(() => {
    let c;
    return s((l) => c = l), c;
  }, i);
  n(a);
});
B("store", Ps);
B("data", (e) => ir(e));
B("root", (e) => ct(e));
B("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = be(Ao(e))), e._x_refs_proxy));
function Ao(e) {
  let t = [];
  return ye(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var xt = {};
function ti(e) {
  return xt[e] || (xt[e] = 0), ++xt[e];
}
function No(e, t) {
  return ye(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Ro(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = ti(t));
}
B("id", (e, { cleanup: t }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return Lo(e, i, t, () => {
    let s = No(e, n), o = s ? s._x_ids[n] : ti(n);
    return r ? `${n}-${o}-${r}` : `${n}-${o}`;
  });
});
ut((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Lo(e, t, n, r) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let i = r();
  return e._x_id[t] = i, n(() => {
    delete e._x_id[t];
  }), i;
}
B("el", (e) => e);
ni("Focus", "focus", "focus");
ni("Persist", "persist", "persist");
function ni(e, t, n) {
  B(t, (r) => $(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
N("modelable", (e, { expression: t }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let s = r(t), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = r(`${t} = __placeholder`), c = (u) => a(() => {
  }, { scope: { __placeholder: u } }), l = o();
  c(l), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, f = Pr(
      {
        get() {
          return u();
        },
        set(v) {
          d(v);
        }
      },
      {
        get() {
          return o();
        },
        set(v) {
          c(v);
        }
      }
    );
    i(f);
  });
});
N("teleport", (e, { modifiers: t, expression: n }, { cleanup: r }) => {
  e.tagName.toLowerCase() !== "template" && $("x-teleport can only be used on a <template> tag", e);
  let i = An(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), ze(s, {}, e);
  let o = (a, c, l) => {
    l.includes("prepend") ? c.parentNode.insertBefore(a, c) : l.includes("append") ? c.parentNode.insertBefore(a, c.nextSibling) : c.appendChild(a);
  };
  I(() => {
    o(s, i, t), Q(() => {
      V(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = An(n);
    I(() => {
      o(e._x_teleport, a, t);
    });
  }, r(
    () => I(() => {
      s.remove(), _e(s);
    })
  );
});
var ko = document.createElement("div");
function An(e) {
  let t = Q(() => document.querySelector(e), () => ko)();
  return t || $(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var ri = () => {
};
ri.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
N("ignore", ri);
N("effect", Q((e, { expression: t }, { effect: n }) => {
  n(L(e, t));
}));
function Wt(e, t, n, r) {
  let i = e, s = (c) => r(c), o = {}, a = (c, l) => (u) => l(c, u);
  if (n.includes("dot") && (t = $o(t)), n.includes("camel") && (t = Fo(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("debounce")) {
    let c = n[n.indexOf("debounce") + 1] || "invalid-wait", l = rt(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    s = Mr(s, l);
  }
  if (n.includes("throttle")) {
    let c = n[n.indexOf("throttle") + 1] || "invalid-wait", l = rt(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    s = Dr(s, l);
  }
  return n.includes("prevent") && (s = a(s, (c, l) => {
    l.preventDefault(), c(l);
  })), n.includes("stop") && (s = a(s, (c, l) => {
    l.stopPropagation(), c(l);
  })), n.includes("once") && (s = a(s, (c, l) => {
    c(l), i.removeEventListener(t, s, o);
  })), (n.includes("away") || n.includes("outside")) && (i = document, s = a(s, (c, l) => {
    e.contains(l.target) || l.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(l));
  })), n.includes("self") && (s = a(s, (c, l) => {
    l.target === e && c(l);
  })), (Do(t) || ii(t)) && (s = a(s, (c, l) => {
    Po(l, n) || c(l);
  })), i.addEventListener(t, s, o), () => {
    i.removeEventListener(t, s, o);
  };
}
function $o(e) {
  return e.replace(/-/g, ".");
}
function Fo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function rt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Mo(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Do(e) {
  return ["keydown", "keyup"].includes(e);
}
function ii(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Po(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, rt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, rt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Nn(e.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !i.includes(s)), !(i.length > 0 && i.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === i.length && (ii(e.type) || Nn(e.key).includes(n[0])));
}
function Nn(e) {
  if (!e)
    return [];
  e = Mo(e);
  let t = {
    ctrl: "control",
    slash: "/",
    space: " ",
    spacebar: " ",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    comma: ",",
    equal: "=",
    minus: "-",
    underscore: "_"
  };
  return t[e] = e, Object.keys(t).map((n) => {
    if (t[n] === e)
      return n;
  }).filter((n) => n);
}
N("model", (e, { modifiers: t, expression: n }, { effect: r, cleanup: i }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = L(s, n), a;
  typeof n == "string" ? a = L(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = L(s, `${n()} = __placeholder`) : a = () => {
  };
  let c = () => {
    let f;
    return o((v) => f = v), Rn(f) ? f.get() : f;
  }, l = (f) => {
    let v;
    o((w) => v = w), Rn(v) ? v.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && e.type === "radio" && I(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  var u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input";
  let d = Z ? () => {
  } : Wt(e, u, t, (f) => {
    l(Et(e, t, f, c()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || cn(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && l(
    Et(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, i(() => e._x_removeModelListeners.default()), e.form) {
    let f = Wt(e.form, "reset", [], (v) => {
      on(() => e._x_model && e._x_model.set(Et(e, t, { target: e }, c())));
    });
    i(() => f());
  }
  e._x_model = {
    get() {
      return c();
    },
    set(f) {
      l(f);
    }
  }, e._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, I(() => Rr(e, "value", f)), delete window.fromModel;
  }, r(() => {
    let f = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Et(e, t, n, r) {
  return I(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (cn(e))
      if (Array.isArray(r)) {
        let i = null;
        return t.includes("number") ? i = St(n.target.value) : t.includes("boolean") ? i = Je(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((s) => !zo(s, i));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let s = i.value || i.text;
          return St(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let s = i.value || i.text;
          return Je(s);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return Fr(e) ? n.target.checked ? i = n.target.value : i = r : i = n.target.value, t.includes("number") ? St(i) : t.includes("boolean") ? Je(i) : t.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function St(e) {
  let t = e ? parseFloat(e) : null;
  return Bo(t) ? t : e;
}
function zo(e, t) {
  return e == t;
}
function Bo(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Rn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
N("cloak", (e) => queueMicrotask(() => I(() => e.removeAttribute(me("cloak")))));
Cr(() => `[${me("init")}]`);
N("init", Q((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
N("text", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
  let i = r(t);
  n(() => {
    i((s) => {
      I(() => {
        e.textContent = s;
      });
    });
  });
});
N("html", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
  let i = r(t);
  n(() => {
    i((s) => {
      I(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, V(e), delete e._x_ignoreSelf;
      });
    });
  });
});
nn(gr(":", vr(me("bind:"))));
var si = (e, { value: t, modifiers: n, expression: r, original: i }, { effect: s, cleanup: o }) => {
  if (!t) {
    let c = {};
    Bs(c), L(e, r)((u) => {
      Br(e, u, i);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return jo(e, r);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = L(e, r);
  s(() => a((c) => {
    c === void 0 && typeof r == "string" && r.match(/\./) && (c = ""), I(() => Rr(e, t, c, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
si.inline = (e, { value: t, modifiers: n, expression: r }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: r, extract: !1 });
};
N("bind", si);
function jo(e, t) {
  e._x_keyExpression = t;
}
Sr(() => `[${me("data")}]`);
N("data", (e, { expression: t }, { cleanup: n }) => {
  if (Wo(e))
    return;
  t = t === "" ? "{}" : t;
  let r = {};
  tt(r, e);
  let i = {};
  Ws(i, r);
  let s = ie(e, t, { scope: i });
  (s === void 0 || s === !0) && (s = {}), tt(s, e);
  let o = ge(s);
  sr(o);
  let a = ze(e, o);
  o.init && ie(e, o.init), n(() => {
    o.destroy && ie(e, o.destroy), a();
  });
});
ut((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Wo(e) {
  return Z ? Pt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (e, { modifiers: t, expression: n }, { effect: r }) => {
  let i = L(e, n);
  e._x_doHide || (e._x_doHide = () => {
    I(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    I(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let s = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, o = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(o), c = Mt(
    (d) => d ? o() : s(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, s) : d ? a() : s();
    }
  ), l, u = !0;
  r(() => i((d) => {
    !u && d === l || (t.includes("immediate") && (d ? a() : s()), c(d), l = d, u = !1);
  }));
});
N("for", (e, { expression: t }, { effect: n, cleanup: r }) => {
  let i = Vo(t), s = L(e, i.items), o = L(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => Ho(e, i, s, o)), r(() => {
    Object.values(e._x_lookup).forEach((a) => I(
      () => {
        _e(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function Ho(e, t, n, r) {
  let i = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    Yo(o) && o >= 0 && (o = Array.from(Array(o).keys(), (g) => g + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, c = e._x_prevKeys, l = [], u = [];
    if (i(o))
      o = Object.entries(o).map(([g, y]) => {
        let _ = Ln(t, y, g, o);
        r((S) => {
          u.includes(S) && $("Duplicate key on x-for", e), u.push(S);
        }, { scope: { index: g, ..._ } }), l.push(_);
      });
    else
      for (let g = 0; g < o.length; g++) {
        let y = Ln(t, o[g], g, o);
        r((_) => {
          u.includes(_) && $("Duplicate key on x-for", e), u.push(_);
        }, { scope: { index: g, ...y } }), l.push(y);
      }
    let d = [], f = [], v = [], w = [];
    for (let g = 0; g < c.length; g++) {
      let y = c[g];
      u.indexOf(y) === -1 && v.push(y);
    }
    c = c.filter((g) => !v.includes(g));
    let E = "template";
    for (let g = 0; g < u.length; g++) {
      let y = u[g], _ = c.indexOf(y);
      if (_ === -1)
        c.splice(g, 0, y), d.push([E, g]);
      else if (_ !== g) {
        let S = c.splice(g, 1)[0], A = c.splice(_ - 1, 1)[0];
        c.splice(g, 0, A), c.splice(_, 0, S), f.push([S, A]);
      } else
        w.push(y);
      E = y;
    }
    for (let g = 0; g < v.length; g++) {
      let y = v[g];
      y in a && (I(() => {
        _e(a[y]), a[y].remove();
      }), delete a[y]);
    }
    for (let g = 0; g < f.length; g++) {
      let [y, _] = f[g], S = a[y], A = a[_], m = document.createElement("div");
      I(() => {
        A || $('x-for ":key" is undefined or invalid', s, _, a), A.after(m), S.after(A), A._x_currentIfEl && A.after(A._x_currentIfEl), m.before(S), S._x_currentIfEl && S.after(S._x_currentIfEl), m.remove();
      }), A._x_refreshXForScope(l[u.indexOf(_)]);
    }
    for (let g = 0; g < d.length; g++) {
      let [y, _] = d[g], S = y === "template" ? s : a[y];
      S._x_currentIfEl && (S = S._x_currentIfEl);
      let A = l[_], m = u[_], h = document.importNode(s.content, !0).firstElementChild, p = ge(A);
      ze(h, p, s), h._x_refreshXForScope = (b) => {
        Object.entries(b).forEach(([T, O]) => {
          p[T] = O;
        });
      }, I(() => {
        S.after(h), Q(() => V(h))();
      }), typeof m == "object" && $("x-for key cannot be an object, it must be a string or an integer", s), a[m] = h;
    }
    for (let g = 0; g < w.length; g++)
      a[w[g]]._x_refreshXForScope(l[u.indexOf(w[g])]);
    s._x_prevKeys = u;
  });
}
function Vo(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = e.match(r);
  if (!i)
    return;
  let s = {};
  s.items = i[2].trim();
  let o = i[1].replace(n, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Ln(e, t, n, r) {
  let i = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    i[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    i[o] = t[o];
  }) : i[e.item] = t, e.index && (i[e.index] = n), e.collection && (i[e.collection] = r), i;
}
function Yo(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function oi() {
}
oi.inline = (e, { expression: t }, { cleanup: n }) => {
  let r = ct(e);
  r._x_refs || (r._x_refs = {}), r._x_refs[t] = e, n(() => delete r._x_refs[t]);
};
N("ref", oi);
N("if", (e, { expression: t }, { effect: n, cleanup: r }) => {
  e.tagName.toLowerCase() !== "template" && $("x-if can only be used on a <template> tag", e);
  let i = L(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return ze(a, {}, e), I(() => {
      e.after(a), Q(() => V(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      I(() => {
        _e(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => i((a) => {
    a ? s() : o();
  })), r(() => e._x_undoIf && e._x_undoIf());
});
N("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((i) => Ro(e, i));
});
ut((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
nn(gr("@", vr(me("on:"))));
N("on", Q((e, { value: t, modifiers: n, expression: r }, { cleanup: i }) => {
  let s = r ? L(e, r) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = Wt(e, t, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  i(() => o());
}));
pt("Collapse", "collapse", "collapse");
pt("Intersect", "intersect", "intersect");
pt("Focus", "trap", "focus");
pt("Mask", "mask", "mask");
function pt(e, t, n) {
  N(t, (r) => $(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
Be.setEvaluator(Vs);
Be.setReactivityEngine({ reactive: gn, effect: no, release: ro, raw: C });
var Ko = Be, de = Ko;
function qo(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: r }) => {
    r.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: r }) {
    let i = kn(r, "duration", 250) / 1e3, s = kn(r, "min", 0), o = !r.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (l, u) => {
      let d = e.setStyles(l, u);
      return u.height ? () => {
      } : d;
    }, c = {
      transitionProperty: "height",
      transitionDuration: `${i}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(l = () => {
      }, u = () => {
      }) {
        o && (n.hidden = !1), o && (n.style.display = null);
        let d = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let f = n.getBoundingClientRect().height;
        d === f && (d = s), e.transition(n, e.setStyles, {
          during: c,
          start: { height: d + "px" },
          end: { height: f + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - f) < 1 && (n.style.overflow = null);
        });
      },
      out(l = () => {
      }, u = () => {
      }) {
        let d = n.getBoundingClientRect().height;
        e.transition(n, a, {
          during: c,
          start: { height: d + "px" },
          end: { height: s + "px" }
        }, () => n.style.overflow = "hidden", () => {
          n._x_isShown = !1, n.style.height == `${s}px` && o && (n.style.display = "none", n.hidden = !0);
        });
      }
    };
  }
}
function kn(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const r = e[e.indexOf(t) + 1];
  if (!r)
    return n;
  if (t === "duration") {
    let i = r.match(/([0-9]+)ms/);
    if (i)
      return i[1];
  }
  if (t === "min") {
    let i = r.match(/([0-9]+)px/);
    if (i)
      return i[1];
  }
  return r;
}
var Uo = qo;
function Go(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: r, modifiers: i }, { evaluateLater: s, cleanup: o }) => {
    let a = s(r), c = {
      rootMargin: Xo(i),
      threshold: Zo(i)
    }, l = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting !== (n === "leave") && (a(), i.includes("once") && l.disconnect());
      });
    }, c);
    l.observe(t), o(() => {
      l.disconnect();
    });
  }));
}
function Zo(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Jo(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Xo(e) {
  const t = "margin", n = "0px 0px 0px 0px", r = e.indexOf(t);
  if (r === -1)
    return n;
  let i = [];
  for (let s = 1; s < 5; s++)
    i.push(Jo(e[r + s] || ""));
  return i = i.filter((s) => s !== void 0), i.length ? i.join(" ").trim() : n;
}
var Qo = Go, ai = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], it = /* @__PURE__ */ ai.join(","), ci = typeof Element > "u", le = ci ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Ht = !ci && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, li = function(t, n, r) {
  var i = Array.prototype.slice.apply(t.querySelectorAll(it));
  return n && le.call(t, it) && i.unshift(t), i = i.filter(r), i;
}, ui = function e(t, n, r) {
  for (var i = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), c = a.length ? a : o.children, l = e(c, !0, r);
      r.flatten ? i.push.apply(i, l) : i.push({
        scope: o,
        candidates: l
      });
    } else {
      var u = le.call(o, it);
      u && r.filter(o) && (n || !t.includes(o)) && i.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof r.getShadowRoot == "function" && r.getShadowRoot(o), f = !r.shadowRootFilter || r.shadowRootFilter(o);
      if (d && f) {
        var v = e(d === !0 ? o.children : d.children, !0, r);
        r.flatten ? i.push.apply(i, v) : i.push({
          scope: o,
          candidates: v
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return i;
}, di = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, ea = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, fi = function(t) {
  return t.tagName === "INPUT";
}, ta = function(t) {
  return fi(t) && t.type === "hidden";
}, na = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(r) {
    return r.tagName === "SUMMARY";
  });
  return n;
}, ra = function(t, n) {
  for (var r = 0; r < t.length; r++)
    if (t[r].checked && t[r].form === n)
      return t[r];
}, ia = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || Ht(t), r = function(a) {
    return n.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, i;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    i = r(window.CSS.escape(t.name));
  else
    try {
      i = r(t.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var s = ra(i, t.form);
  return !s || s === t;
}, sa = function(t) {
  return fi(t) && t.type === "radio";
}, oa = function(t) {
  return sa(t) && !ia(t);
}, $n = function(t) {
  var n = t.getBoundingClientRect(), r = n.width, i = n.height;
  return r === 0 && i === 0;
}, aa = function(t, n) {
  var r = n.displayCheck, i = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = le.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (le.call(o, "details:not([open]) *"))
    return !0;
  var a = Ht(t).host, c = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!r || r === "full") {
    if (typeof i == "function") {
      for (var l = t; t; ) {
        var u = t.parentElement, d = Ht(t);
        if (u && !u.shadowRoot && i(u) === !0)
          return $n(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = l;
    }
    if (c)
      return !t.getClientRects().length;
  } else if (r === "non-zero-area")
    return $n(t);
  return !1;
}, ca = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var r = 0; r < n.children.length; r++) {
          var i = n.children.item(r);
          if (i.tagName === "LEGEND")
            return le.call(n, "fieldset[disabled] *") ? !0 : !i.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, st = function(t, n) {
  return !(n.disabled || ta(n) || aa(n, t) || // For a details element with a summary, the summary element gets the focus
  na(n) || ca(n));
}, Vt = function(t, n) {
  return !(oa(n) || di(n) < 0 || !st(t, n));
}, la = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, ua = function e(t) {
  var n = [], r = [];
  return t.forEach(function(i, s) {
    var o = !!i.scope, a = o ? i.scope : i, c = di(a, o), l = o ? e(i.candidates) : a;
    c === 0 ? o ? n.push.apply(n, l) : n.push(a) : r.push({
      documentOrder: s,
      tabIndex: c,
      item: i,
      isScope: o,
      content: l
    });
  }), r.sort(ea).reduce(function(i, s) {
    return s.isScope ? i.push.apply(i, s.content) : i.push(s.content), i;
  }, []).concat(n);
}, da = function(t, n) {
  n = n || {};
  var r;
  return n.getShadowRoot ? r = ui([t], n.includeContainer, {
    filter: Vt.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: la
  }) : r = li(t, n.includeContainer, Vt.bind(null, n)), ua(r);
}, hi = function(t, n) {
  n = n || {};
  var r;
  return n.getShadowRoot ? r = ui([t], n.includeContainer, {
    filter: st.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : r = li(t, n.includeContainer, st.bind(null, n)), r;
}, Ue = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return le.call(t, it) === !1 ? !1 : Vt(n, t);
}, fa = /* @__PURE__ */ ai.concat("iframe").join(","), Xe = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return le.call(t, fa) === !1 ? !1 : st(n, t);
};
function Fn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Mn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fn(Object(n), !0).forEach(function(r) {
      ha(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Fn(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ha(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var Dn = /* @__PURE__ */ function() {
  var e = [];
  return {
    activateTrap: function(n) {
      if (e.length > 0) {
        var r = e[e.length - 1];
        r !== n && r.pause();
      }
      var i = e.indexOf(n);
      i === -1 || e.splice(i, 1), e.push(n);
    },
    deactivateTrap: function(n) {
      var r = e.indexOf(n);
      r !== -1 && e.splice(r, 1), e.length > 0 && e[e.length - 1].unpause();
    }
  };
}(), pa = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, ga = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, va = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, Pn = function(t) {
  return setTimeout(t, 0);
}, zn = function(t, n) {
  var r = -1;
  return t.every(function(i, s) {
    return n(i) ? (r = s, !1) : !0;
  }), r;
}, Te = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
    r[i - 1] = arguments[i];
  return typeof t == "function" ? t.apply(void 0, r) : t;
}, Ge = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, ba = function(t, n) {
  var r = n?.document || document, i = Mn({
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
  }, o, a = function(h, p, b) {
    return h && h[p] !== void 0 ? h[p] : i[b || p];
  }, c = function(h) {
    return s.containerGroups.findIndex(function(p) {
      var b = p.container, T = p.tabbableNodes;
      return b.contains(h) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(O) {
        return O === h;
      });
    });
  }, l = function(h) {
    var p = i[h];
    if (typeof p == "function") {
      for (var b = arguments.length, T = new Array(b > 1 ? b - 1 : 0), O = 1; O < b; O++)
        T[O - 1] = arguments[O];
      p = p.apply(void 0, T);
    }
    if (p === !0 && (p = void 0), !p) {
      if (p === void 0 || p === !1)
        return p;
      throw new Error("`".concat(h, "` was specified but was not a node, or did not return a node"));
    }
    var R = p;
    if (typeof p == "string" && (R = r.querySelector(p), !R))
      throw new Error("`".concat(h, "` as selector refers to no known node"));
    return R;
  }, u = function() {
    var h = l("initialFocus");
    if (h === !1)
      return !1;
    if (h === void 0)
      if (c(r.activeElement) >= 0)
        h = r.activeElement;
      else {
        var p = s.tabbableGroups[0], b = p && p.firstTabbableNode;
        h = b || l("fallbackFocus");
      }
    if (!h)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return h;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(h) {
      var p = da(h, i.tabbableOptions), b = hi(h, i.tabbableOptions);
      return {
        container: h,
        tabbableNodes: p,
        focusableNodes: b,
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
        nextTabbableNode: function(O) {
          var R = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, F = b.findIndex(function(M) {
            return M === O;
          });
          if (!(F < 0))
            return R ? b.slice(F + 1).find(function(M) {
              return Ue(M, i.tabbableOptions);
            }) : b.slice(0, F).reverse().find(function(M) {
              return Ue(M, i.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(h) {
      return h.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !l("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function m(h) {
    if (h !== !1 && h !== r.activeElement) {
      if (!h || !h.focus) {
        m(u());
        return;
      }
      h.focus({
        preventScroll: !!i.preventScroll
      }), s.mostRecentlyFocusedNode = h, pa(h) && h.select();
    }
  }, v = function(h) {
    var p = l("setReturnFocus", h);
    return p || (p === !1 ? !1 : h);
  }, w = function(h) {
    var p = Ge(h);
    if (!(c(p) >= 0)) {
      if (Te(i.clickOutsideDeactivates, h)) {
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
          returnFocus: i.returnFocusOnDeactivate && !Xe(p, i.tabbableOptions)
        });
        return;
      }
      Te(i.allowOutsideClick, h) || h.preventDefault();
    }
  }, E = function(h) {
    var p = Ge(h), b = c(p) >= 0;
    b || p instanceof Document ? b && (s.mostRecentlyFocusedNode = p) : (h.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, g = function(h) {
    var p = Ge(h);
    d();
    var b = null;
    if (s.tabbableGroups.length > 0) {
      var T = c(p), O = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        h.shiftKey ? b = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : b = s.tabbableGroups[0].firstTabbableNode;
      else if (h.shiftKey) {
        var R = zn(s.tabbableGroups, function(xe) {
          var yt = xe.firstTabbableNode;
          return p === yt;
        });
        if (R < 0 && (O.container === p || Xe(p, i.tabbableOptions) && !Ue(p, i.tabbableOptions) && !O.nextTabbableNode(p, !1)) && (R = T), R >= 0) {
          var F = R === 0 ? s.tabbableGroups.length - 1 : R - 1, M = s.tabbableGroups[F];
          b = M.lastTabbableNode;
        }
      } else {
        var ee = zn(s.tabbableGroups, function(xe) {
          var yt = xe.lastTabbableNode;
          return p === yt;
        });
        if (ee < 0 && (O.container === p || Xe(p, i.tabbableOptions) && !Ue(p, i.tabbableOptions) && !O.nextTabbableNode(p)) && (ee = T), ee >= 0) {
          var We = ee === s.tabbableGroups.length - 1 ? 0 : ee + 1, mt = s.tabbableGroups[We];
          b = mt.firstTabbableNode;
        }
      }
    } else
      b = l("fallbackFocus");
    b && (h.preventDefault(), f(b));
  }, y = function(h) {
    if (ga(h) && Te(i.escapeDeactivates, h) !== !1) {
      h.preventDefault(), o.deactivate();
      return;
    }
    if (va(h)) {
      g(h);
      return;
    }
  }, _ = function(h) {
    var p = Ge(h);
    c(p) >= 0 || Te(i.clickOutsideDeactivates, h) || Te(i.allowOutsideClick, h) || (h.preventDefault(), h.stopImmediatePropagation());
  }, S = function() {
    if (s.active)
      return Dn.activateTrap(o), s.delayInitialFocusTimer = i.delayInitialFocus ? Pn(function() {
        f(u());
      }) : f(u()), r.addEventListener("focusin", E, !0), r.addEventListener("mousedown", w, {
        capture: !0,
        passive: !1
      }), r.addEventListener("touchstart", w, {
        capture: !0,
        passive: !1
      }), r.addEventListener("click", _, {
        capture: !0,
        passive: !1
      }), r.addEventListener("keydown", y, {
        capture: !0,
        passive: !1
      }), o;
  }, A = function() {
    if (s.active)
      return r.removeEventListener("focusin", E, !0), r.removeEventListener("mousedown", w, !0), r.removeEventListener("touchstart", w, !0), r.removeEventListener("click", _, !0), r.removeEventListener("keydown", y, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(h) {
      if (s.active)
        return this;
      var p = a(h, "onActivate"), b = a(h, "onPostActivate"), T = a(h, "checkCanFocusTrap");
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = r.activeElement, p && p();
      var O = function() {
        T && d(), S(), b && b();
      };
      return T ? (T(s.containers.concat()).then(O, O), this) : (O(), this);
    },
    deactivate: function(h) {
      if (!s.active)
        return this;
      var p = Mn({
        onDeactivate: i.onDeactivate,
        onPostDeactivate: i.onPostDeactivate,
        checkCanReturnFocus: i.checkCanReturnFocus
      }, h);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, A(), s.active = !1, s.paused = !1, Dn.deactivateTrap(o);
      var b = a(p, "onDeactivate"), T = a(p, "onPostDeactivate"), O = a(p, "checkCanReturnFocus"), R = a(p, "returnFocus", "returnFocusOnDeactivate");
      b && b();
      var F = function() {
        Pn(function() {
          R && f(v(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return R && O ? (O(v(s.nodeFocusedBeforeActivation)).then(F, F), this) : (F(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, A(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), S(), this);
    },
    updateContainerElements: function(h) {
      var p = [].concat(h).filter(Boolean);
      return s.containers = p.map(function(b) {
        return typeof b == "string" ? r.querySelector(b) : b;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function ma(e) {
  let t, n;
  window.addEventListener("focusin", () => {
    t = n, n = document.activeElement;
  }), e.magic("focus", (r) => {
    let i = r;
    return {
      __noscroll: !1,
      __wrapAround: !1,
      within(s) {
        return i = s, this;
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
        return Xe(s);
      },
      previouslyFocused() {
        return t;
      },
      lastFocused() {
        return t;
      },
      focused() {
        return n;
      },
      focusables() {
        return Array.isArray(i) ? i : hi(i, { displayCheck: "none" });
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
  }), e.directive("trap", e.skipDuringClone(
    (r, { expression: i, modifiers: s }, { effect: o, evaluateLater: a, cleanup: c }) => {
      let l = a(i), u = !1, d = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => r
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let g = r.querySelector("[autofocus]");
        g && (d.initialFocus = g);
      }
      let f = ba(r, d), v = () => {
      }, w = () => {
      };
      const E = () => {
        v(), v = () => {
        }, w(), w = () => {
        }, f.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => l((g) => {
        u !== g && (g && !u && (s.includes("noscroll") && (w = ya()), s.includes("inert") && (v = Bn(r)), setTimeout(() => {
          f.activate();
        }, 15)), !g && u && E(), u = !!g);
      })), c(E);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (r, { expression: i, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(i) && Bn(r);
    }
  ));
}
function Bn(e) {
  let t = [];
  return pi(e, (n) => {
    let r = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => r || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function pi(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? pi(e.parentNode, t) : t(n);
  });
}
function ya() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var _a = ma;
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
function wa(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function xa(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
  }
}
function Ea(e, t, n) {
  return t && xa(e.prototype, t), e;
}
var Sa = Object.defineProperty, Y = function(e, t) {
  return Sa(e, "name", { value: t, configurable: !0 });
}, Ca = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Ta = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Oa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ia = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Aa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Na = Y(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Oe = Y(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), x = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, U = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, jn = { OUTLINE: "outline", FILLED: "filled" }, Ct = { FADE: "fade", SLIDE: "slide" }, Ie = { CLOSE: Oe(Ca), SUCCESS: Oe(Ia), ERROR: Oe(Ta), WARNING: Oe(Aa), INFO: Oe(Oa) }, Wn = Y(function(e) {
  e.wrapper.classList.add(x.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(x.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Hn = Y(function(e) {
  e.wrapper.classList.remove(x.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Ra = Y(function(e) {
  e.wrapper.classList.add(x.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(x.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), La = Y(function(e) {
  e.wrapper.classList.remove(x.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), gi = function() {
  function e(t) {
    var n = this;
    wa(this, e), this.notifyOut = Y(function(xe) {
      xe(n);
    }, "notifyOut");
    var r = t.notificationsGap, i = r === void 0 ? 20 : r, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, c = a === void 0 ? "success" : a, l = t.effect, u = l === void 0 ? Ct.FADE : l, d = t.type, f = d === void 0 ? "outline" : d, v = t.title, w = t.text, E = t.showIcon, g = E === void 0 ? !0 : E, y = t.customIcon, _ = y === void 0 ? "" : y, S = t.customClass, A = S === void 0 ? "" : S, m = t.speed, h = m === void 0 ? 500 : m, p = t.showCloseButton, b = p === void 0 ? !0 : p, T = t.autoclose, O = T === void 0 ? !0 : T, R = t.autotimeout, F = R === void 0 ? 3e3 : R, M = t.position, ee = M === void 0 ? "right top" : M, We = t.customWrapper, mt = We === void 0 ? "" : We;
    if (this.customWrapper = mt, this.status = c, this.title = v, this.text = w, this.showIcon = g, this.customIcon = _, this.customClass = A, this.speed = h, this.effect = u, this.showCloseButton = b, this.autoclose = O, this.autotimeout = F, this.notificationsGap = i, this.notificationsPadding = o, this.type = f, this.position = ee, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Ea(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(x.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(x.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](x.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](x.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](x.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](x.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](x.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](x.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](x.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, r = document.createElement("div");
    r.classList.add(x.NOTIFY_CLOSE), r.innerHTML = Ie.CLOSE, this.wrapper.appendChild(r), r.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Na(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(x.NOTIFY), this.type) {
      case jn.OUTLINE:
        this.wrapper.classList.add(x.NOTIFY_OUTLINE);
        break;
      case jn.FILLED:
        this.wrapper.classList.add(x.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(x.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case U.SUCCESS:
        this.wrapper.classList.add(x.NOTIFY_SUCCESS);
        break;
      case U.ERROR:
        this.wrapper.classList.add(x.NOTIFY_ERROR);
        break;
      case U.WARNING:
        this.wrapper.classList.add(x.NOTIFY_WARNING);
        break;
      case U.INFO:
        this.wrapper.classList.add(x.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(x.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(r) {
      n.wrapper.classList.add(r);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(x.NOTIFY_CONTENT);
    var r, i;
    this.title && (r = document.createElement("div"), r.classList.add(x.NOTIFY_TITLE), r.textContent = this.title.trim(), this.showCloseButton || (r.style.paddingRight = "0")), this.text && (i = document.createElement("div"), i.classList.add(x.NOTIFY_TEXT), i.innerHTML = this.text.trim(), this.title || (i.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(r), this.text && n.appendChild(i);
  } }, { key: "setIcon", value: function() {
    var n = Y(function(i) {
      switch (i) {
        case U.SUCCESS:
          return Ie.SUCCESS;
        case U.ERROR:
          return Ie.ERROR;
        case U.WARNING:
          return Ie.WARNING;
        case U.INFO:
          return Ie.INFO;
      }
    }, "computedIcon"), r = document.createElement("div");
    r.classList.add(x.NOTIFY_ICON), r.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(r);
  } }, { key: "setObserver", value: function() {
    var n = this, r = new IntersectionObserver(function(i) {
      if (i[0].intersectionRatio <= 0) n.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      r.observe(n.wrapper);
    }, this.speed);
  } }, { key: "notifyIn", value: function(t) {
    t(this);
  } }, { key: "autoClose", value: function() {
    var n = this;
    setTimeout(function() {
      n.close();
    }, this.autotimeout + this.speed);
  } }, { key: "close", value: function() {
    this.notifyOut(this.selectedNotifyOutEffect);
  } }, { key: "setEffect", value: function() {
    switch (this.effect) {
      case Ct.FADE:
        this.selectedNotifyInEffect = Wn, this.selectedNotifyOutEffect = Hn;
        break;
      case Ct.SLIDE:
        this.selectedNotifyInEffect = Ra, this.selectedNotifyOutEffect = La;
        break;
      default:
        this.selectedNotifyInEffect = Wn, this.selectedNotifyOutEffect = Hn;
    }
  } }]), e;
}();
Y(gi, "Notify");
var vi = gi;
globalThis.Notify = vi;
const bi = ["success", "error", "warning", "info"], mi = [
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
], yi = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Ae(e = {}) {
  const t = {
    ...yi,
    ...e
  };
  bi.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), mi.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new vi(t);
}
const ka = {
  custom: Ae,
  success(e, t = "Success", n = {}) {
    Ae({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    Ae({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    Ae({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    Ae({
      status: "info",
      title: t,
      text: e,
      ...n
    });
  },
  setDefaults(e = {}) {
    Object.assign(yi, e);
  },
  get allowedStatuses() {
    return [...bi];
  },
  get allowedPositions() {
    return [...mi];
  }
}, Yt = function() {
}, Me = {}, ot = {}, De = {};
function $a(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let r = e.length, i = r, s, o, a, c;
  for (s = function(l, u) {
    u.length && n.push(l), i--, i || t(n);
  }; r--; ) {
    if (o = e[r], a = ot[o], a) {
      s(o, a);
      continue;
    }
    c = De[o] = De[o] || [], c.push(s);
  }
}
function _i(e, t) {
  if (!e) return;
  const n = De[e];
  if (ot[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function Kt(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || Yt)(t) : (e.success || Yt)(e);
}
function Fa(e, t, n, r, i, s, o, a) {
  let c = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (c = "e");
    } catch (l) {
      l.code !== 18 && (c = "e");
    }
  if (c === "e") {
    if (s += 1, s < o)
      return wi(t, r, i, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  r(t, c, e.defaultPrevented);
}
function wi(e, t, n, r) {
  const i = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || Yt, c = e.replace(/[\?|#].*$/, ""), l = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, f;
  if (r = r || 0, /(^css!|\.css$)/.test(c))
    f = i.createElement("link"), f.rel = "stylesheet", f.href = l, u = "hideFocus" in f, u && f.relList && (u = 0, f.rel = "preload", f.as = "style"), n.inlineStyleNonce && f.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(c))
    f = i.createElement("img"), f.src = l;
  else if (f = i.createElement("script"), f.src = l, f.async = s === void 0 ? !0 : s, n.inlineScriptNonce && f.setAttribute("nonce", n.inlineScriptNonce), d = "noModule" in f, /^module!/.test(c)) {
    if (!d) return t(e, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(c) && d)
    return t(e, "l");
  const v = function(w) {
    Fa(w, e, f, t, n, r, o, u);
  };
  f.addEventListener("load", v, { once: !0 }), f.addEventListener("error", v, { once: !0 }), a(e, f) !== !1 && i.head.appendChild(f);
}
function Ma(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let r = e.length, i = [];
  function s(o, a, c) {
    if (a === "e" && i.push(o), a === "b")
      if (c) i.push(o);
      else return;
    r--, r || t(i);
  }
  for (let o = 0; o < e.length; o++)
    wi(e[o], s, n);
}
function G(e, t, n) {
  let r, i;
  if (t && typeof t == "string" && t.trim && (r = t.trim()), i = (r ? n : t) || {}, r) {
    if (r in Me)
      throw "LoadJS";
    Me[r] = !0;
  }
  function s(o, a) {
    Ma(e, function(c) {
      Kt(i, c), o && Kt({ success: o, error: a }, c), _i(r, c);
    }, i);
  }
  if (i.returnPromise)
    return new Promise(s);
  s();
}
G.ready = function(t, n) {
  return $a(t, function(r) {
    Kt(n, r);
  }), G;
};
G.done = function(t) {
  _i(t, []);
};
G.reset = function() {
  Object.keys(Me).forEach((t) => delete Me[t]), Object.keys(ot).forEach((t) => delete ot[t]), Object.keys(De).forEach((t) => delete De[t]);
};
G.isDefined = function(t) {
  return t in Me;
};
function Da(e) {
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
function Pa(e) {
  e.data("rzAccordionSection", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const t = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, r) => {
        n !== t.sectionId && !t.allowMultiple && (t.open = !1);
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
function za(e) {
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
function Ba(e) {
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
function ja(e) {
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
function Wa(e, t) {
  e.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const n = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.codeid, i = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, t(n, {
        success: function() {
          const s = document.getElementById(r);
          window.hljs && s && window.hljs.highlightElement(s);
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, i);
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
function Ha(e, t) {
  e.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    init() {
      const n = this.$el.dataset.config, r = document.getElementById(this.$el.dataset.uid + "-input");
      if (n) {
        const o = JSON.parse(n);
        o && (this.options = o.options || {}, this.placeholder = o.placeholder || "", this.prependText = o.prependText || "");
      }
      const i = JSON.parse(this.$el.dataset.assets), s = this.$el.dataset.nonce;
      t(i, {
        success: function() {
          window.flatpickr && r && window.flatpickr(r, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, s);
    }
  }));
}
const Vn = Math.min, ke = Math.max, at = Math.round, W = (e) => ({
  x: e,
  y: e
});
function xi(e) {
  return e.split("-")[0];
}
function Va(e) {
  return e.split("-")[1];
}
function Ya(e) {
  return e === "x" ? "y" : "x";
}
function Ka(e) {
  return e === "y" ? "height" : "width";
}
function Ei(e) {
  return ["top", "bottom"].includes(xi(e)) ? "y" : "x";
}
function qa(e) {
  return Ya(Ei(e));
}
function Si(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: i
  } = e;
  return {
    width: r,
    height: i,
    top: n,
    left: t,
    right: t + r,
    bottom: n + i,
    x: t,
    y: n
  };
}
function Yn(e, t, n) {
  let {
    reference: r,
    floating: i
  } = e;
  const s = Ei(t), o = qa(t), a = Ka(o), c = xi(t), l = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
  let v;
  switch (c) {
    case "top":
      v = {
        x: u,
        y: r.y - i.height
      };
      break;
    case "bottom":
      v = {
        x: u,
        y: r.y + r.height
      };
      break;
    case "right":
      v = {
        x: r.x + r.width,
        y: d
      };
      break;
    case "left":
      v = {
        x: r.x - i.width,
        y: d
      };
      break;
    default:
      v = {
        x: r.x,
        y: r.y
      };
  }
  switch (Va(t)) {
    case "start":
      v[o] -= f * (n && l ? -1 : 1);
      break;
    case "end":
      v[o] += f * (n && l ? -1 : 1);
      break;
  }
  return v;
}
const Ua = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), c = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let l = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: i
  }), {
    x: u,
    y: d
  } = Yn(l, r, c), f = r, v = {}, w = 0;
  for (let E = 0; E < a.length; E++) {
    const {
      name: g,
      fn: y
    } = a[E], {
      x: _,
      y: S,
      data: A,
      reset: m
    } = await y({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: v,
      rects: l,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = _ ?? u, d = S ?? d, v = {
      ...v,
      [g]: {
        ...v[g],
        ...A
      }
    }, m && w <= 50 && (w++, typeof m == "object" && (m.placement && (f = m.placement), m.rects && (l = m.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: i
    }) : m.rects), {
      x: u,
      y: d
    } = Yn(l, f, c)), E = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: v
  };
};
function gt() {
  return typeof window < "u";
}
function we(e) {
  return Ci(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function k(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function K(e) {
  var t;
  return (t = (Ci(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Ci(e) {
  return gt() ? e instanceof Node || e instanceof k(e).Node : !1;
}
function P(e) {
  return gt() ? e instanceof Element || e instanceof k(e).Element : !1;
}
function H(e) {
  return gt() ? e instanceof HTMLElement || e instanceof k(e).HTMLElement : !1;
}
function Kn(e) {
  return !gt() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof k(e).ShadowRoot;
}
function je(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: i
  } = z(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !["inline", "contents"].includes(i);
}
function Ga(e) {
  return ["table", "td", "th"].includes(we(e));
}
function vt(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function vn(e) {
  const t = bn(), n = P(e) ? z(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((r) => n[r] ? n[r] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((r) => (n.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some((r) => (n.contain || "").includes(r));
}
function Za(e) {
  let t = X(e);
  for (; H(t) && !pe(t); ) {
    if (vn(t))
      return t;
    if (vt(t))
      return null;
    t = X(t);
  }
  return null;
}
function bn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function pe(e) {
  return ["html", "body", "#document"].includes(we(e));
}
function z(e) {
  return k(e).getComputedStyle(e);
}
function bt(e) {
  return P(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function X(e) {
  if (we(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Kn(e) && e.host || // Fallback.
    K(e)
  );
  return Kn(t) ? t.host : t;
}
function Ti(e) {
  const t = X(e);
  return pe(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : H(t) && je(t) ? t : Ti(t);
}
function Oi(e, t, n) {
  var r;
  t === void 0 && (t = []);
  const i = Ti(e), s = i === ((r = e.ownerDocument) == null ? void 0 : r.body), o = k(i);
  return s ? (qt(o), t.concat(o, o.visualViewport || [], je(i) ? i : [], [])) : t.concat(i, Oi(i, []));
}
function qt(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Ii(e) {
  const t = z(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const i = H(e), s = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, a = at(n) !== s || at(r) !== o;
  return a && (n = s, r = o), {
    width: n,
    height: r,
    $: a
  };
}
function Ai(e) {
  return P(e) ? e : e.contextElement;
}
function fe(e) {
  const t = Ai(e);
  if (!H(t))
    return W(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Ii(t);
  let o = (s ? at(n.width) : n.width) / r, a = (s ? at(n.height) : n.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Ja = /* @__PURE__ */ W(0);
function Ni(e) {
  const t = k(e);
  return !bn() || !t.visualViewport ? Ja : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Xa(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== k(e) ? !1 : t;
}
function Pe(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), s = Ai(e);
  let o = W(1);
  t && (r ? P(r) && (o = fe(r)) : o = fe(e));
  const a = Xa(s, n, r) ? Ni(s) : W(0);
  let c = (i.left + a.x) / o.x, l = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = k(s), v = r && P(r) ? k(r) : r;
    let w = f, E = qt(w);
    for (; E && r && v !== w; ) {
      const g = fe(E), y = E.getBoundingClientRect(), _ = z(E), S = y.left + (E.clientLeft + parseFloat(_.paddingLeft)) * g.x, A = y.top + (E.clientTop + parseFloat(_.paddingTop)) * g.y;
      c *= g.x, l *= g.y, u *= g.x, d *= g.y, c += S, l += A, w = k(E), E = qt(w);
    }
  }
  return Si({
    width: u,
    height: d,
    x: c,
    y: l
  });
}
function mn(e, t) {
  const n = bt(e).scrollLeft;
  return t ? t.left + n : Pe(K(e)).left + n;
}
function Ri(e, t, n) {
  n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), i = r.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    mn(e, r)
  )), s = r.top + t.scrollTop;
  return {
    x: i,
    y: s
  };
}
function Qa(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: i
  } = e;
  const s = i === "fixed", o = K(r), a = t ? vt(t.floating) : !1;
  if (r === o || a && s)
    return n;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = W(1);
  const u = W(0), d = H(r);
  if ((d || !d && !s) && ((we(r) !== "body" || je(o)) && (c = bt(r)), H(r))) {
    const v = Pe(r);
    l = fe(r), u.x = v.x + r.clientLeft, u.y = v.y + r.clientTop;
  }
  const f = o && !d && !s ? Ri(o, c, !0) : W(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
    y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
  };
}
function ec(e) {
  return Array.from(e.getClientRects());
}
function tc(e) {
  const t = K(e), n = bt(e), r = e.ownerDocument.body, i = ke(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), s = ke(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -n.scrollLeft + mn(e);
  const a = -n.scrollTop;
  return z(r).direction === "rtl" && (o += ke(t.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
function nc(e, t) {
  const n = k(e), r = K(e), i = n.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, c = 0;
  if (i) {
    s = i.width, o = i.height;
    const l = bn();
    (!l || l && t === "fixed") && (a = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: c
  };
}
function rc(e, t) {
  const n = Pe(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, s = H(e) ? fe(e) : W(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, c = i * s.x, l = r * s.y;
  return {
    width: o,
    height: a,
    x: c,
    y: l
  };
}
function qn(e, t, n) {
  let r;
  if (t === "viewport")
    r = nc(e, n);
  else if (t === "document")
    r = tc(K(e));
  else if (P(t))
    r = rc(t, n);
  else {
    const i = Ni(e);
    r = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return Si(r);
}
function Li(e, t) {
  const n = X(e);
  return n === t || !P(n) || pe(n) ? !1 : z(n).position === "fixed" || Li(n, t);
}
function ic(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = Oi(e, []).filter((a) => P(a) && we(a) !== "body"), i = null;
  const s = z(e).position === "fixed";
  let o = s ? X(e) : e;
  for (; P(o) && !pe(o); ) {
    const a = z(o), c = vn(o);
    !c && a.position === "fixed" && (i = null), (s ? !c && !i : !c && a.position === "static" && !!i && ["absolute", "fixed"].includes(i.position) || je(o) && !c && Li(e, o)) ? r = r.filter((u) => u !== o) : i = a, o = X(o);
  }
  return t.set(e, r), r;
}
function sc(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = e;
  const o = [...n === "clippingAncestors" ? vt(t) ? [] : ic(t, this._c) : [].concat(n), r], a = o[0], c = o.reduce((l, u) => {
    const d = qn(t, u, i);
    return l.top = ke(d.top, l.top), l.right = Vn(d.right, l.right), l.bottom = Vn(d.bottom, l.bottom), l.left = ke(d.left, l.left), l;
  }, qn(t, a, i));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function oc(e) {
  const {
    width: t,
    height: n
  } = Ii(e);
  return {
    width: t,
    height: n
  };
}
function ac(e, t, n) {
  const r = H(t), i = K(t), s = n === "fixed", o = Pe(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = W(0);
  function l() {
    c.x = mn(i);
  }
  if (r || !r && !s)
    if ((we(t) !== "body" || je(i)) && (a = bt(t)), r) {
      const v = Pe(t, !0, s, t);
      c.x = v.x + t.clientLeft, c.y = v.y + t.clientTop;
    } else i && l();
  s && !r && i && l();
  const u = i && !r && !s ? Ri(i, a) : W(0), d = o.left + a.scrollLeft - c.x - u.x, f = o.top + a.scrollTop - c.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Tt(e) {
  return z(e).position === "static";
}
function Un(e, t) {
  if (!H(e) || z(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return K(e) === n && (n = n.ownerDocument.body), n;
}
function ki(e, t) {
  const n = k(e);
  if (vt(e))
    return n;
  if (!H(e)) {
    let i = X(e);
    for (; i && !pe(i); ) {
      if (P(i) && !Tt(i))
        return i;
      i = X(i);
    }
    return n;
  }
  let r = Un(e, t);
  for (; r && Ga(r) && Tt(r); )
    r = Un(r, t);
  return r && pe(r) && Tt(r) && !vn(r) ? n : r || Za(e) || n;
}
const cc = async function(e) {
  const t = this.getOffsetParent || ki, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: ac(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function lc(e) {
  return z(e).direction === "rtl";
}
const uc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Qa,
  getDocumentElement: K,
  getClippingRect: sc,
  getOffsetParent: ki,
  getElementRects: cc,
  getClientRects: ec,
  getDimensions: oc,
  getScale: fe,
  isElement: P,
  isRTL: lc
}, dc = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: uc,
    ...n
  }, s = {
    ...i.platform,
    _c: r
  };
  return Ua(e, t, {
    ...i,
    platform: s
  });
};
function fc(e) {
  e.data("rzDropdown", () => ({
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
      this.anchorCss = this.getAnchorCss(), dc(this.triggerEl, this.floatingEl).then(({ x: t, y: n }) => {
        Object.assign(this.floatingEl.style, {
          left: `${t}px`,
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
function hc(e) {
  e.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const t = typeof window < "u" && "localStorage" in window, n = ["light", "dark", "auto"], r = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let i = "auto";
      t && (i = localStorage.getItem("darkMode") ?? "auto", n.includes(i) || (i = "light")), t && localStorage.setItem("darkMode", i), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          i === "dark" || i === "auto" && r
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
      const n = window.matchMedia("(prefers-color-scheme: dark)").matches;
      t === "light" ? t = "dark" : t === "dark" ? t = "light" : t === "auto" && (t = n ? "light" : "dark"), this.mode = t, localStorage.setItem("darkMode", t);
      const r = t === "dark" || t === "auto" && n;
      document.documentElement.classList.toggle("dark", r);
      const i = new CustomEvent("darkModeToggle", {
        detail: { darkMode: r }
      });
      window.dispatchEvent(i);
    },
    destroy() {
      this.applyTheme && window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.applyTheme);
    }
  }));
}
function pc(e) {
  e.data("rzEmbeddedPreview", () => ({
    iframe: null,
    onDarkModeToggle: null,
    init() {
      try {
        this.iframe = this.$refs.iframe;
        const t = this.debounce(() => {
          this.resizeIframe(this.iframe);
        }, 50);
        this.resizeIframe(this.iframe), new ResizeObserver((i) => {
          for (let s of i)
            t();
        }).observe(this.iframe);
        const r = this.iframe;
        this.onDarkModeToggle = (i) => {
          r.contentWindow.postMessage(i.detail, "*");
        }, window.addEventListener("darkModeToggle", this.onDarkModeToggle);
      } catch {
        console.error("Cannot access iframe content");
      }
    },
    // Adjusts the iframe height based on its content
    resizeIframe(t) {
      if (t)
        try {
          const n = t.contentDocument || t.contentWindow?.document;
          if (n) {
            const r = n.body;
            if (!r)
              setInterval(() => {
                this.resizeIframe(t);
              }, 150);
            else {
              const i = r.scrollHeight + 15;
              t.style.height = i + "px";
            }
          }
        } catch (n) {
          console.error("Error resizing iframe:", n);
        }
    },
    // Debounce helper to limit function calls
    debounce(t, n = 300) {
      let r;
      return (...i) => {
        clearTimeout(r), r = setTimeout(() => {
          t.apply(this, i);
        }, n);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function gc(e) {
  e.data("rzEmpty", () => {
  });
}
function vc(e) {
  e.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const t = this;
      if (typeof this.setCurrentHeading == "function") {
        const n = (i, s) => {
          i.forEach((o) => {
            o.isIntersecting && t.setCurrentHeading(t.headingId);
          });
        }, r = { threshold: 0.5 };
        this.observer = new IntersectionObserver(n, r), this.observer.observe(this.$el);
      } else
        console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
    },
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function bc(e, t) {
  e.data("rzMarkdown", () => ({
    init() {
      const n = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.nonce;
      t(n, {
        success: function() {
          window.hljs.highlightAll();
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, r);
    }
  }));
}
function mc(e) {
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
        const n = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", t);
        const r = document.body.offsetWidth - n;
        document.body.style.setProperty("--page-scrollbar-width", `${r}px`), t ? this.$nextTick(() => {
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
      const n = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: t },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(n), n.defaultPrevented || (this.modalOpen = !0);
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(t = "unknown") {
      const n = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason: t },
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
function yc(e) {
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
      const t = this.prependContainer, n = this.textInput;
      if (!t || !n) {
        n && n.classList.remove("text-transparent");
        return;
      }
      const i = t.offsetWidth + 10;
      n.style.paddingLeft = i + "px", n.classList.remove("text-transparent");
    }
  }));
}
function _c(e) {
  e.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const t = this.$el;
      this.currentVal = parseInt(t.getAttribute("data-current-val")) || 0, this.minVal = parseInt(t.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(t.getAttribute("data-max-val")) || 100, this.label = t.getAttribute("data-label"), this.calculatePercentage(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuemin", this.minVal), t.setAttribute("aria-valuemax", this.maxVal), t.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((r) => {
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
      const t = this.$refs.progressBar, n = this.$refs.progressBarLabel, r = this.$refs.innerLabel;
      n && t && r && (r.innerText = this.buildLabel(), n.clientWidth > t.clientWidth ? n.style.left = t.clientWidth + 10 + "px" : n.style.left = t.clientWidth / 2 - n.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const t = this.$refs.progressBarLabel, n = this.$refs.progressBar;
      return t && n && t.clientWidth > n.clientWidth ? "text-on-surface dark:text-on-surface-dark" : "";
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
function wc(e) {
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
function xc(e) {
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
      const n = t.key, r = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), i = r.findIndex((o) => this.tabSelected === o.dataset.name);
      let s = i;
      n === "ArrowRight" ? (s = (i + 1) % r.length, t.preventDefault()) : n === "ArrowLeft" ? (s = (i - 1 + r.length) % r.length, t.preventDefault()) : n === "Home" ? (s = 0, t.preventDefault()) : n === "End" && (s = r.length - 1, t.preventDefault()), s !== i && this.tabButtonClicked(r[s]);
    }
  }));
}
function Ec(e) {
  e.data("rzSidebar", () => ({
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
function Sc(e) {
  e.data("rzSidebarLinkItem", () => ({
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
      const t = this.$el.closest('[x-data^="rzSidebar"]');
      if (t) {
        let n = e.$data(t);
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
async function Cc(e) {
  e = [...e].sort();
  const t = e.join("|"), r = new TextEncoder().encode(t), i = await crypto.subtle.digest("SHA-256", r);
  return Array.from(new Uint8Array(i)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function Qe(e, t, n) {
  Cc(e).then((r) => {
    G.isDefined(r) || G(
      e,
      r,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), G.ready([r], t);
  });
}
function Tc(e) {
  Da(e), Pa(e), za(e), Ba(e), ja(e), Wa(e, Qe), Ha(e, Qe), fc(e), hc(e), pc(e), gc(e), vc(e), bc(e, Qe), mc(e), yc(e), _c(e), wc(e), xc(e), Ec(e), Sc(e);
}
function Oc(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return;
  }
  let t = null, n = null;
  if (typeof e == "string") {
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    if (n = e, t = document.getElementById(n), !t) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${n}" not found in the DOM.`);
      return;
    }
  } else if (e instanceof Element) {
    if (t = e, !t.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return;
    }
    n = t.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return;
  }
  const r = `[data-alpine-root="${n}"]`;
  let i = null;
  if (t.matches(r) ? i = t : i = t.querySelector(r), !i) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${r}" on or inside the wrapper element (ID: #${n}). Verify the 'data-alpine-root' attribute placement.`
    );
    return;
  }
  const s = Alpine.$data(i);
  if (s === void 0) {
    const o = `${i.tagName.toLowerCase()}${i.id ? "#" + i.id : ""}${i.classList.length ? "." + Array.from(i.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${o}) via 'data-alpine-root="${n}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return s;
}
de.plugin(Uo);
de.plugin(Qo);
de.plugin(_a);
Tc(de);
const Ic = {
  Alpine: de,
  require: Qe,
  toast: ka,
  $data: Oc
};
window.Alpine = de;
window.Rizzy = { ...window.Rizzy || {}, ...Ic };
de.start();
export {
  Ic as default
};
