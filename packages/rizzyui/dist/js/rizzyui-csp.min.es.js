var zt = !1, Bt = !1, ue = [], jt = -1;
function Jr(e) {
  Zr(e);
}
function Zr(e) {
  ue.includes(e) || ue.push(e), Qr();
}
function Xr(e) {
  let t = ue.indexOf(e);
  t !== -1 && t > jt && ue.splice(t, 1);
}
function Qr() {
  !Bt && !zt && (zt = !0, queueMicrotask(es));
}
function es() {
  zt = !1, Bt = !0;
  for (let e = 0; e < ue.length; e++)
    ue[e](), jt = e;
  ue.length = 0, jt = -1, Bt = !1;
}
var Se, ye, Ie, ci, Wt = !0;
function ts(e) {
  Wt = !1, e(), Wt = !0;
}
function ns(e) {
  Se = e.reactive, Ie = e.release, ye = (t) => e.effect(t, { scheduler: (n) => {
    Wt ? Jr(n) : n();
  } }), ci = e.raw;
}
function Rn(e) {
  ye = e;
}
function is(e) {
  let t = () => {
  };
  return [(i) => {
    let r = ye(i);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Ie(r));
    }, r;
  }, () => {
    t();
  }];
}
function ui(e, t) {
  let n = !0, i, r = ye(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => Ie(r);
}
var di = [], fi = [], hi = [];
function rs(e) {
  hi.push(e);
}
function cn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, fi.push(t));
}
function pi(e) {
  di.push(e);
}
function gi(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function mi(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((r) => r()), delete e._x_attributeCleanups[n]);
  });
}
function ss(e) {
  for (e._x_effects?.forEach(Xr); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var un = new MutationObserver(pn), dn = !1;
function fn() {
  un.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), dn = !0;
}
function bi() {
  os(), un.disconnect(), dn = !1;
}
var Ne = [];
function os() {
  let e = un.takeRecords();
  Ne.push(() => e.length > 0 && pn(e));
  let t = Ne.length;
  queueMicrotask(() => {
    if (Ne.length === t)
      for (; Ne.length > 0; )
        Ne.shift()();
  });
}
function A(e) {
  if (!dn)
    return e();
  bi();
  let t = e();
  return fn(), t;
}
var hn = !1, ot = [];
function as() {
  hn = !0;
}
function ls() {
  hn = !1, pn(ot), ot = [];
}
function pn(e) {
  if (hn) {
    ot = ot.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
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
      let o = e[s].target, a = e[s].attributeName, l = e[s].oldValue, c = () => {
        i.has(o) || i.set(o, []), i.get(o).push({ name: a, value: o.getAttribute(a) });
      }, u = () => {
        r.has(o) || r.set(o, []), r.get(o).push(a);
      };
      o.hasAttribute(a) && l === null ? c() : o.hasAttribute(a) ? (u(), c()) : u();
    }
  r.forEach((s, o) => {
    mi(o, s);
  }), i.forEach((s, o) => {
    di.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || fi.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && hi.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function vi(e) {
  return Ce(ge(e));
}
function Ke(e, t, n) {
  return e._x_dataStack = [t, ...ge(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function ge(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? ge(e.host) : e.parentNode ? ge(e.parentNode) : [];
}
function Ce(e) {
  return new Proxy({ objects: e }, cs);
}
var cs = {
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
    return t == "toJSON" ? us : Reflect.get(
      e.find(
        (i) => Reflect.has(i, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, i) {
    const r = e.find(
      (o) => Object.prototype.hasOwnProperty.call(o, t)
    ) || e[e.length - 1], s = Object.getOwnPropertyDescriptor(r, t);
    return s?.set && s?.get ? s.set.call(i, n) || !0 : Reflect.set(r, t, n);
  }
};
function us() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function yi(e) {
  let t = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, n = (i, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = r === "" ? s : `${r}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[s] = o.initialize(e, l, s) : t(o) && o !== i && !(o instanceof Element) && n(o, l);
    });
  };
  return n(e);
}
function wi(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return e(this.initialValue, () => ds(i, r), (o) => Ht(i, r, o), r, s);
    }
  };
  return t(n), (i) => {
    if (typeof i == "object" && i !== null && i._x_interceptor) {
      let r = n.initialize.bind(n);
      n.initialize = (s, o, a) => {
        let l = i.initialize(s, o, a);
        return n.initialValue = l, r(s, o, a);
      };
    } else
      n.initialValue = i;
    return n;
  };
}
function ds(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Ht(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Ht(e[t[0]], t.slice(1), n);
  }
}
var xi = {};
function H(e, t) {
  xi[e] = t;
}
function at(e, t) {
  let n = fs(t);
  return Object.entries(xi).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function fs(e) {
  let [t, n] = Oi(e), i = { interceptor: wi, ...t };
  return cn(e, n), i;
}
function _i(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    We(r, e, t);
  }
}
function We(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var it = !0;
function Ei(e) {
  let t = it;
  it = !1;
  let n = e();
  return it = t, n;
}
function de(e, t, n = {}) {
  let i;
  return k(e, t)((r) => i = r, n), i;
}
function k(...e) {
  return Si(...e);
}
var Si = ps;
function hs(e) {
  Si = e;
}
function ps(e, t) {
  let n = {};
  at(n, e);
  let i = [n, ...ge(e)], r = typeof t == "function" ? Ii(i, t) : ms(i, t, e);
  return _i.bind(null, e, t, r);
}
function Ii(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [] } = {}) => {
    let s = t.apply(Ce([i, ...e]), r);
    He(n, s);
  };
}
var kt = {};
function gs(e, t) {
  if (kt[e])
    return kt[e];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, i = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, s = (() => {
    try {
      let o = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${i} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(o, "name", {
        value: `[Alpine] ${e}`
      }), o;
    } catch (o) {
      return We(o, t, e), Promise.resolve();
    }
  })();
  return kt[e] = s, s;
}
function ms(e, t, n) {
  let i = gs(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [] } = {}) => {
    i.result = void 0, i.finished = !1;
    let a = Ce([s, ...e]);
    if (typeof i == "function") {
      let l = i(i, a).catch((c) => We(c, n, t));
      i.finished ? (He(r, i.result, a, o, n), i.result = void 0) : l.then((c) => {
        He(r, c, a, o, n);
      }).catch((c) => We(c, n, t)).finally(() => i.result = void 0);
    }
  };
}
function He(e, t, n, i, r) {
  if (it && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => He(e, o, n, i)).catch((o) => We(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var gn = "x-";
function Te(e = "") {
  return gn + e;
}
function bs(e) {
  gn = e;
}
var lt = {};
function N(e, t) {
  return lt[e] = t, {
    before(n) {
      if (!lt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = ce.indexOf(n);
      ce.splice(i >= 0 ? i : ce.indexOf("DEFAULT"), 0, e);
    }
  };
}
function vs(e) {
  return Object.keys(lt).includes(e);
}
function mn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Ci(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Ni((s, o) => i[s] = o)).filter(Ri).map(xs(i, n)).sort(_s).map((s) => ws(e, s));
}
function Ci(e) {
  return Array.from(e).map(Ni()).filter((t) => !Ri(t));
}
var Vt = !1, Pe = /* @__PURE__ */ new Map(), Ti = Symbol();
function ys(e) {
  Vt = !0;
  let t = Symbol();
  Ti = t, Pe.set(t, []);
  let n = () => {
    for (; Pe.get(t).length; )
      Pe.get(t).shift()();
    Pe.delete(t);
  }, i = () => {
    Vt = !1, n();
  };
  e(n), i();
}
function Oi(e) {
  let t = [], n = (a) => t.push(a), [i, r] = is(e);
  return t.push(r), [{
    Alpine: Ue,
    effect: i,
    cleanup: n,
    evaluateLater: k.bind(k, e),
    evaluate: de.bind(de, e)
  }, () => t.forEach((a) => a())];
}
function ws(e, t) {
  let n = () => {
  }, i = lt[t.type] || n, [r, s] = Oi(e);
  gi(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Vt ? Pe.get(Ti).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Ai = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), $i = (e) => e;
function Ni(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: r } = ki.reduce((s, o) => o(s), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: r };
  };
}
var ki = [];
function bn(e) {
  ki.push(e);
}
function Ri({ name: e }) {
  return Li().test(e);
}
var Li = () => new RegExp(`^${gn}([^:^.]+)\\b`);
function xs(e, t) {
  return ({ name: n, value: i }) => {
    let r = n.match(Li()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: i,
      original: a
    };
  };
}
var qt = "DEFAULT", ce = [
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
  qt,
  "teleport"
];
function _s(e, t) {
  let n = ce.indexOf(e.type) === -1 ? qt : e.type, i = ce.indexOf(t.type) === -1 ? qt : t.type;
  return ce.indexOf(n) - ce.indexOf(i);
}
function Be(e, t, n = {}) {
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
function me(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((r) => me(r, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    me(i, t), i = i.nextElementSibling;
}
function P(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Ln = !1;
function Es() {
  Ln && P("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Ln = !0, document.body || P("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Be(document, "alpine:init"), Be(document, "alpine:initializing"), fn(), rs((t) => G(t, me)), cn((t) => Ae(t)), pi((t, n) => {
    mn(t, n).forEach((i) => i());
  });
  let e = (t) => !wt(t.parentElement, !0);
  Array.from(document.querySelectorAll(Di().join(","))).filter(e).forEach((t) => {
    G(t);
  }), Be(document, "alpine:initialized"), setTimeout(() => {
    Ts();
  });
}
var vn = [], Mi = [];
function Fi() {
  return vn.map((e) => e());
}
function Di() {
  return vn.concat(Mi).map((e) => e());
}
function Pi(e) {
  vn.push(e);
}
function zi(e) {
  Mi.push(e);
}
function wt(e, t = !1) {
  return Oe(e, (n) => {
    if ((t ? Di() : Fi()).some((r) => n.matches(r)))
      return !0;
  });
}
function Oe(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return Oe(e.parentElement, t);
  }
}
function Ss(e) {
  return Fi().some((t) => e.matches(t));
}
var Bi = [];
function Is(e) {
  Bi.push(e);
}
var Cs = 1;
function G(e, t = me, n = () => {
}) {
  Oe(e, (i) => i._x_ignore) || ys(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Bi.forEach((s) => s(i, r)), mn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Cs++), i._x_ignore && r());
    });
  });
}
function Ae(e, t = me) {
  t(e, (n) => {
    ss(n), mi(n), delete n._x_marker;
  });
}
function Ts() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    vs(n) || i.some((r) => {
      if (document.querySelector(r))
        return P(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Yt = [], yn = !1;
function wn(e = () => {
}) {
  return queueMicrotask(() => {
    yn || setTimeout(() => {
      Kt();
    });
  }), new Promise((t) => {
    Yt.push(() => {
      e(), t();
    });
  });
}
function Kt() {
  for (yn = !1; Yt.length; )
    Yt.shift()();
}
function Os() {
  yn = !0;
}
function xn(e, t) {
  return Array.isArray(t) ? Mn(e, t.join(" ")) : typeof t == "object" && t !== null ? As(e, t) : typeof t == "function" ? xn(e, t()) : Mn(e, t);
}
function Mn(e, t) {
  let n = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function As(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(t).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function xt(e, t) {
  return typeof t == "object" && t !== null ? $s(e, t) : Ns(e, t);
}
function $s(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = ks(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    xt(e, n);
  };
}
function Ns(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function ks(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ut(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
N("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Ls(e, n, t) : Rs(e, i, t));
});
function Rs(e, t, n) {
  ji(e, xn, ""), {
    enter: (r) => {
      e._x_transition.enter.during = r;
    },
    "enter-start": (r) => {
      e._x_transition.enter.start = r;
    },
    "enter-end": (r) => {
      e._x_transition.enter.end = r;
    },
    leave: (r) => {
      e._x_transition.leave.during = r;
    },
    "leave-start": (r) => {
      e._x_transition.leave.start = r;
    },
    "leave-end": (r) => {
      e._x_transition.leave.end = r;
    }
  }[n](t);
}
function Ls(e, t, n) {
  ji(e, xt);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((g, x) => x < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((g, x) => x > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? ke(t, "scale", 95) / 100 : 1, d = ke(t, "delay", 0) / 1e3, f = ke(t, "origin", "center"), m = "opacity, transform", y = ke(t, "duration", 150) / 1e3, v = ke(t, "duration", 75) / 1e3, h = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${y}s`,
    transitionTimingFunction: h
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${v}s`,
    transitionTimingFunction: h
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function ji(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      Gt(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      Gt(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, i, r);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, i) {
  const r = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => r(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : s() : e._x_transition ? e._x_transition.in(n) : s();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((o, a) => {
    e._x_transition.out(() => {
    }, () => o(i)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(i), queueMicrotask(() => {
    let o = Wi(e);
    o ? (o._x_hideChildren || (o._x_hideChildren = []), o._x_hideChildren.push(e)) : r(() => {
      let a = (l) => {
        let c = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(a)
        ]).then(([u]) => u?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, c;
      };
      a(e).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function Wi(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Wi(t);
}
function Gt(e, t, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Ms(e, {
    start() {
      a = t(e, i);
    },
    during() {
      l = t(e, n);
    },
    before: s,
    end() {
      a(), c = t(e, r);
    },
    after: o,
    cleanup() {
      l(), c();
    }
  });
}
function Ms(e, t) {
  let n, i, r, s = Ut(() => {
    A(() => {
      n = !0, i || t.before(), r || (t.end(), Kt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Ut(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, A(() => {
    t.start(), t.during();
  }), Os(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), A(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (A(() => {
        t.end();
      }), Kt(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function ke(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const i = e[e.indexOf(t) + 1];
  if (!i || t === "scale" && isNaN(i))
    return n;
  if (t === "duration" || t === "delay") {
    let r = i.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [i, e[e.indexOf(t) + 2]].join(" ") : i;
}
var ie = !1;
function oe(e, t = () => {
}) {
  return (...n) => ie ? t(...n) : e(...n);
}
function Fs(e) {
  return (...t) => ie && e(...t);
}
var Hi = [];
function _t(e) {
  Hi.push(e);
}
function Ds(e, t) {
  Hi.forEach((n) => n(e, t)), ie = !0, Vi(() => {
    G(t, (n, i) => {
      i(n, () => {
      });
    });
  }), ie = !1;
}
var Jt = !1;
function Ps(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ie = !0, Jt = !0, Vi(() => {
    zs(t);
  }), ie = !1, Jt = !1;
}
function zs(e) {
  let t = !1;
  G(e, (i, r) => {
    me(i, (s, o) => {
      if (t && Ss(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function Vi(e) {
  let t = ye;
  Rn((n, i) => {
    let r = t(n);
    return Ie(r), () => {
    };
  }), e(), Rn(t);
}
function qi(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Se({})), e._x_bindings[t] = n, t = i.includes("camel") ? Ks(t) : t, t) {
    case "value":
      Bs(e, n);
      break;
    case "style":
      Ws(e, n);
      break;
    case "class":
      js(e, n);
      break;
    case "selected":
    case "checked":
      Hs(e, t, n);
      break;
    default:
      Yi(e, t, n);
      break;
  }
}
function Bs(e, t) {
  if (Gi(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = rt(e.value) === t : e.checked = Fn(e.value, t));
  else if (_n(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Fn(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Ys(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function js(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = xn(e, t);
}
function Ws(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = xt(e, t);
}
function Hs(e, t, n) {
  Yi(e, t, n), qs(e, t, n);
}
function Yi(e, t, n) {
  [null, void 0, !1].includes(n) && Gs(t) ? e.removeAttribute(t) : (Ki(t) && (n = t), Vs(e, t, n));
}
function Vs(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function qs(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Ys(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Ks(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Fn(e, t) {
  return e == t;
}
function rt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Us = /* @__PURE__ */ new Set([
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
function Ki(e) {
  return Us.has(e);
}
function Gs(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Js(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Ui(e, t, n);
}
function Zs(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, Ei(() => de(e, r.expression));
  }
  return Ui(e, t, n);
}
function Ui(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Ki(t) ? !![t, "true"].includes(i) : i;
}
function _n(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Gi(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Ji(e, t) {
  var n;
  return function() {
    var i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function Zi(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function Xi({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = ye(() => {
    let a = e(), l = n();
    if (r)
      i(Rt(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(Rt(a)) : c !== u && t(Rt(l));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Ie(o);
  };
}
function Rt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Xs(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Ue));
}
var le = {}, Dn = !1;
function Qs(e, t) {
  if (Dn || (le = Se(le), Dn = !0), t === void 0)
    return le[e];
  le[e] = t, yi(le[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && le[e].init();
}
function eo() {
  return le;
}
var Qi = {};
function to(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? er(e, n()) : (Qi[e] = n, () => {
  });
}
function no(e) {
  return Object.entries(Qi).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function er(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Ci(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), mn(e, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var tr = {};
function io(e, t) {
  tr[e] = t;
}
function ro(e, t) {
  return Object.entries(tr).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...r) => i.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var so = {
  get reactive() {
    return Se;
  },
  get release() {
    return Ie;
  },
  get effect() {
    return ye;
  },
  get raw() {
    return ci;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: ls,
  dontAutoEvaluateFunctions: Ei,
  disableEffectScheduling: ts,
  startObservingMutations: fn,
  stopObservingMutations: bi,
  setReactivityEngine: ns,
  onAttributeRemoved: gi,
  onAttributesAdded: pi,
  closestDataStack: ge,
  skipDuringClone: oe,
  onlyDuringClone: Fs,
  addRootSelector: Pi,
  addInitSelector: zi,
  interceptClone: _t,
  addScopeToNode: Ke,
  deferMutations: as,
  mapAttributes: bn,
  evaluateLater: k,
  interceptInit: Is,
  setEvaluator: hs,
  mergeProxies: Ce,
  extractProp: Zs,
  findClosest: Oe,
  onElRemoved: cn,
  closestRoot: wt,
  destroyTree: Ae,
  interceptor: wi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Gt,
  // INTERNAL
  setStyles: xt,
  // INTERNAL
  mutateDom: A,
  directive: N,
  entangle: Xi,
  throttle: Zi,
  debounce: Ji,
  evaluate: de,
  initTree: G,
  nextTick: wn,
  prefixed: Te,
  prefix: bs,
  plugin: Xs,
  magic: H,
  store: Qs,
  start: Es,
  clone: Ps,
  // INTERNAL
  cloneNode: Ds,
  // INTERNAL
  bound: Js,
  $data: vi,
  watch: ui,
  walk: me,
  data: io,
  bind: to
}, Ue = so;
function oo(e, t) {
  let n = ao(e);
  if (typeof t == "function")
    return Ii(n, t);
  let i = lo(e, t, n);
  return _i.bind(null, e, t, i);
}
function ao(e) {
  let t = {};
  return at(t, e), [t, ...ge(e)];
}
function lo(e, t, n) {
  return (i = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Ce([r, ...n]), a = t.split(".").reduce(
      (l, c) => (l[c] === void 0 && co(e, t), l[c]),
      o
    );
    He(i, a, o, s);
  };
}
function co(e, t) {
  console.warn(
    `Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${t}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
    e
  );
}
function uo(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = e.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var fo = Object.freeze({}), ho = Object.prototype.hasOwnProperty, Et = (e, t) => ho.call(e, t), fe = Array.isArray, je = (e) => nr(e) === "[object Map]", po = (e) => typeof e == "string", En = (e) => typeof e == "symbol", St = (e) => e !== null && typeof e == "object", go = Object.prototype.toString, nr = (e) => go.call(e), ir = (e) => nr(e).slice(8, -1), Sn = (e) => po(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, mo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, bo = mo((e) => e.charAt(0).toUpperCase() + e.slice(1)), rr = (e, t) => e !== t && (e === e || t === t), Zt = /* @__PURE__ */ new WeakMap(), Re = [], Y, he = Symbol("iterate"), Xt = Symbol("Map key iterate");
function vo(e) {
  return e && e._isEffect === !0;
}
function yo(e, t = fo) {
  vo(e) && (e = e.raw);
  const n = _o(e, t);
  return t.lazy || n(), n;
}
function wo(e) {
  e.active && (sr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var xo = 0;
function _o(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Re.includes(n)) {
      sr(n);
      try {
        return So(), Re.push(n), Y = n, e();
      } finally {
        Re.pop(), or(), Y = Re[Re.length - 1];
      }
    }
  };
  return n.id = xo++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function sr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var _e = !0, In = [];
function Eo() {
  In.push(_e), _e = !1;
}
function So() {
  In.push(_e), _e = !0;
}
function or() {
  const e = In.pop();
  _e = e === void 0 ? !0 : e;
}
function B(e, t, n) {
  if (!_e || Y === void 0)
    return;
  let i = Zt.get(e);
  i || Zt.set(e, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(Y) || (r.add(Y), Y.deps.push(r), Y.options.onTrack && Y.options.onTrack({
    effect: Y,
    target: e,
    type: t,
    key: n
  }));
}
function re(e, t, n, i, r, s) {
  const o = Zt.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== Y || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (n === "length" && fe(e))
    o.forEach((u, d) => {
      (d === "length" || d >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), t) {
      case "add":
        fe(e) ? Sn(n) && l(o.get("length")) : (l(o.get(he)), je(e) && l(o.get(Xt)));
        break;
      case "delete":
        fe(e) || (l(o.get(he)), je(e) && l(o.get(Xt)));
        break;
      case "set":
        je(e) && l(o.get(he));
        break;
    }
  const c = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: e,
      key: n,
      type: t,
      newValue: i,
      oldValue: r,
      oldTarget: s
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(c);
}
var Io = /* @__PURE__ */ uo("__proto__,__v_isRef,__isVue"), ar = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(En)), Co = /* @__PURE__ */ lr(), To = /* @__PURE__ */ lr(!0), Pn = /* @__PURE__ */ Oo();
function Oo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const i = O(this);
      for (let s = 0, o = this.length; s < o; s++)
        B(i, "get", s + "");
      const r = i[t](...n);
      return r === -1 || r === !1 ? i[t](...n.map(O)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Eo();
      const i = O(this)[t].apply(this, n);
      return or(), i;
    };
  }), e;
}
function lr(e = !1, t = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? Wo : fr : t ? jo : dr).get(i))
      return i;
    const o = fe(i);
    if (!e && o && Et(Pn, r))
      return Reflect.get(Pn, r, s);
    const a = Reflect.get(i, r, s);
    return (En(r) ? ar.has(r) : Io(r)) || (e || B(i, "get", r), t) ? a : Qt(a) ? !o || !Sn(r) ? a.value : a : St(a) ? e ? hr(a) : An(a) : a;
  };
}
var Ao = /* @__PURE__ */ $o();
function $o(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = O(r), o = O(o), !fe(n) && Qt(o) && !Qt(r)))
      return o.value = r, !0;
    const a = fe(n) && Sn(i) ? Number(i) < n.length : Et(n, i), l = Reflect.set(n, i, r, s);
    return n === O(s) && (a ? rr(r, o) && re(n, "set", i, r, o) : re(n, "add", i, r)), l;
  };
}
function No(e, t) {
  const n = Et(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && re(e, "delete", t, void 0, i), r;
}
function ko(e, t) {
  const n = Reflect.has(e, t);
  return (!En(t) || !ar.has(t)) && B(e, "has", t), n;
}
function Ro(e) {
  return B(e, "iterate", fe(e) ? "length" : he), Reflect.ownKeys(e);
}
var Lo = {
  get: Co,
  set: Ao,
  deleteProperty: No,
  has: ko,
  ownKeys: Ro
}, Mo = {
  get: To,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Cn = (e) => St(e) ? An(e) : e, Tn = (e) => St(e) ? hr(e) : e, On = (e) => e, It = (e) => Reflect.getPrototypeOf(e);
function Je(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = O(e), s = O(t);
  t !== s && !n && B(r, "get", t), !n && B(r, "get", s);
  const { has: o } = It(r), a = i ? On : n ? Tn : Cn;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function Ze(e, t = !1) {
  const n = this.__v_raw, i = O(n), r = O(e);
  return e !== r && !t && B(i, "has", e), !t && B(i, "has", r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Xe(e, t = !1) {
  return e = e.__v_raw, !t && B(O(e), "iterate", he), Reflect.get(e, "size", e);
}
function zn(e) {
  e = O(e);
  const t = O(this);
  return It(t).has.call(t, e) || (t.add(e), re(t, "add", e, e)), this;
}
function Bn(e, t) {
  t = O(t);
  const n = O(this), { has: i, get: r } = It(n);
  let s = i.call(n, e);
  s ? ur(n, i, e) : (e = O(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? rr(t, o) && re(n, "set", e, t, o) : re(n, "add", e, t), this;
}
function jn(e) {
  const t = O(this), { has: n, get: i } = It(t);
  let r = n.call(t, e);
  r ? ur(t, n, e) : (e = O(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && re(t, "delete", e, void 0, s), o;
}
function Wn() {
  const e = O(this), t = e.size !== 0, n = je(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && re(e, "clear", void 0, void 0, n), i;
}
function Qe(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = O(o), l = t ? On : e ? Tn : Cn;
    return !e && B(a, "iterate", he), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function et(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = O(r), o = je(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...i), u = n ? On : t ? Tn : Cn;
    return !t && B(s, "iterate", l ? Xt : he), {
      // iterator protocol
      next() {
        const { value: d, done: f } = c.next();
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
function ee(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${bo(e)} operation ${n}failed: target is readonly.`, O(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Fo() {
  const e = {
    get(s) {
      return Je(this, s);
    },
    get size() {
      return Xe(this);
    },
    has: Ze,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Qe(!1, !1)
  }, t = {
    get(s) {
      return Je(this, s, !1, !0);
    },
    get size() {
      return Xe(this);
    },
    has: Ze,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Qe(!1, !0)
  }, n = {
    get(s) {
      return Je(this, s, !0);
    },
    get size() {
      return Xe(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
    },
    add: ee(
      "add"
      /* ADD */
    ),
    set: ee(
      "set"
      /* SET */
    ),
    delete: ee(
      "delete"
      /* DELETE */
    ),
    clear: ee(
      "clear"
      /* CLEAR */
    ),
    forEach: Qe(!0, !1)
  }, i = {
    get(s) {
      return Je(this, s, !0, !0);
    },
    get size() {
      return Xe(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
    },
    add: ee(
      "add"
      /* ADD */
    ),
    set: ee(
      "set"
      /* SET */
    ),
    delete: ee(
      "delete"
      /* DELETE */
    ),
    clear: ee(
      "clear"
      /* CLEAR */
    ),
    forEach: Qe(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = et(s, !1, !1), n[s] = et(s, !0, !1), t[s] = et(s, !1, !0), i[s] = et(s, !0, !0);
  }), [
    e,
    n,
    t,
    i
  ];
}
var [Do, Po, oc, ac] = /* @__PURE__ */ Fo();
function cr(e, t) {
  const n = e ? Po : Do;
  return (i, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(Et(n, r) && r in i ? n : i, r, s);
}
var zo = {
  get: /* @__PURE__ */ cr(!1)
}, Bo = {
  get: /* @__PURE__ */ cr(!0)
};
function ur(e, t, n) {
  const i = O(n);
  if (i !== n && t.call(e, i)) {
    const r = ir(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var dr = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ new WeakMap(), fr = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap();
function Ho(e) {
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
function Vo(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ho(ir(e));
}
function An(e) {
  return e && e.__v_isReadonly ? e : pr(e, !1, Lo, zo, dr);
}
function hr(e) {
  return pr(e, !0, Mo, Bo, fr);
}
function pr(e, t, n, i, r) {
  if (!St(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = Vo(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? i : n);
  return r.set(e, a), a;
}
function O(e) {
  return e && O(e.__v_raw) || e;
}
function Qt(e) {
  return !!(e && e.__v_isRef === !0);
}
H("nextTick", () => wn);
H("dispatch", (e) => Be.bind(Be, e));
H("watch", (e, { evaluateLater: t, cleanup: n }) => (i, r) => {
  let s = t(i), a = ui(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
H("store", eo);
H("data", (e) => vi(e));
H("root", (e) => wt(e));
H("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ce(qo(e))), e._x_refs_proxy));
function qo(e) {
  let t = [];
  return Oe(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Lt = {};
function gr(e) {
  return Lt[e] || (Lt[e] = 0), ++Lt[e];
}
function Yo(e, t) {
  return Oe(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Ko(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = gr(t));
}
H("id", (e, { cleanup: t }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return Uo(e, r, t, () => {
    let s = Yo(e, n), o = s ? s._x_ids[n] : gr(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
_t((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Uo(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = i();
  return e._x_id[t] = r, n(() => {
    delete e._x_id[t];
  }), r;
}
H("el", (e) => e);
mr("Focus", "focus", "focus");
mr("Persist", "persist", "persist");
function mr(e, t, n) {
  H(t, (i) => P(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
N("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(t), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = i(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, f = Xi(
      {
        get() {
          return u();
        },
        set(m) {
          d(m);
        }
      },
      {
        get() {
          return o();
        },
        set(m) {
          l(m);
        }
      }
    );
    r(f);
  });
});
N("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && P("x-teleport can only be used on a <template> tag", e);
  let r = Hn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Ke(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  A(() => {
    o(s, r, t), oe(() => {
      G(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Hn(n);
    A(() => {
      o(e._x_teleport, a, t);
    });
  }, i(
    () => A(() => {
      s.remove(), Ae(s);
    })
  );
});
var Go = document.createElement("div");
function Hn(e) {
  let t = oe(() => document.querySelector(e), () => Go)();
  return t || P(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var br = () => {
};
br.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
N("ignore", br);
N("effect", oe((e, { expression: t }, { effect: n }) => {
  n(k(e, t));
}));
function en(e, t, n, i) {
  let r = e, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (t = Jo(t)), n.includes("camel") && (t = Zo(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = ct(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Ji(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = ct(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Zi(s, c);
  }
  return n.includes("prevent") && (s = a(s, (l, c) => {
    c.preventDefault(), l(c);
  })), n.includes("stop") && (s = a(s, (l, c) => {
    c.stopPropagation(), l(c);
  })), n.includes("once") && (s = a(s, (l, c) => {
    l(c), r.removeEventListener(t, s, o);
  })), (n.includes("away") || n.includes("outside")) && (r = document, s = a(s, (l, c) => {
    e.contains(c.target) || c.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(c));
  })), n.includes("self") && (s = a(s, (l, c) => {
    c.target === e && l(c);
  })), (Qo(t) || vr(t)) && (s = a(s, (l, c) => {
    ea(c, n) || l(c);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function Jo(e) {
  return e.replace(/-/g, ".");
}
function Zo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function ct(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Xo(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Qo(e) {
  return ["keydown", "keyup"].includes(e);
}
function vr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function ea(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, ct((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, ct((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Vn(e.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (vr(e.type) || Vn(e.key).includes(n[0])));
}
function Vn(e) {
  if (!e)
    return [];
  e = Xo(e);
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
N("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = k(s, n), a;
  typeof n == "string" ? a = k(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = k(s, `${n()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((m) => f = m), qn(f) ? f.get() : f;
  }, c = (f) => {
    let m;
    o((y) => m = y), qn(m) ? m.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && e.type === "radio" && A(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  var u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input";
  let d = ie ? () => {
  } : en(e, u, t, (f) => {
    c(Mt(e, t, f, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || _n(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Mt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let f = en(e.form, "reset", [], (m) => {
      wn(() => e._x_model && e._x_model.set(Mt(e, t, { target: e }, l())));
    });
    r(() => f());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(f) {
      c(f);
    }
  }, e._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, A(() => qi(e, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Mt(e, t, n, i) {
  return A(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (_n(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = Ft(n.target.value) : t.includes("boolean") ? r = rt(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ta(s, r));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ft(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return rt(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return Gi(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? Ft(r) : t.includes("boolean") ? rt(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Ft(e) {
  let t = e ? parseFloat(e) : null;
  return na(t) ? t : e;
}
function ta(e, t) {
  return e == t;
}
function na(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function qn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
N("cloak", (e) => queueMicrotask(() => A(() => e.removeAttribute(Te("cloak")))));
zi(() => `[${Te("init")}]`);
N("init", oe((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
N("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      A(() => {
        e.textContent = s;
      });
    });
  });
});
N("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      A(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, G(e), delete e._x_ignoreSelf;
      });
    });
  });
});
bn(Ai(":", $i(Te("bind:"))));
var yr = (e, { value: t, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    no(l), k(e, i)((u) => {
      er(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return ia(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = k(e, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), A(() => qi(e, t, l, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
yr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
N("bind", yr);
function ia(e, t) {
  e._x_keyExpression = t;
}
Pi(() => `[${Te("data")}]`);
N("data", (e, { expression: t }, { cleanup: n }) => {
  if (ra(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  at(i, e);
  let r = {};
  ro(r, i);
  let s = de(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), at(s, e);
  let o = Se(s);
  yi(o);
  let a = Ke(e, o);
  o.init && de(e, o.init), n(() => {
    o.destroy && de(e, o.destroy), a();
  });
});
_t((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ra(e) {
  return ie ? Jt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let r = k(e, n);
  e._x_doHide || (e._x_doHide = () => {
    A(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    A(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let s = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, o = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(o), l = Ut(
    (d) => d ? o() : s(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  i(() => r((d) => {
    !u && d === c || (t.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
N("for", (e, { expression: t }, { effect: n, cleanup: i }) => {
  let r = oa(t), s = k(e, r.items), o = k(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => sa(e, r, s, o)), i(() => {
    Object.values(e._x_lookup).forEach((a) => A(
      () => {
        Ae(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function sa(e, t, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    aa(o) && o >= 0 && (o = Array.from(Array(o).keys(), (h) => h + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([h, g]) => {
        let x = Yn(t, g, h, o);
        i((E) => {
          u.includes(E) && P("Duplicate key on x-for", e), u.push(E);
        }, { scope: { index: h, ...x } }), c.push(x);
      });
    else
      for (let h = 0; h < o.length; h++) {
        let g = Yn(t, o[h], h, o);
        i((x) => {
          u.includes(x) && P("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: h, ...g } }), c.push(g);
      }
    let d = [], f = [], m = [], y = [];
    for (let h = 0; h < l.length; h++) {
      let g = l[h];
      u.indexOf(g) === -1 && m.push(g);
    }
    l = l.filter((h) => !m.includes(h));
    let v = "template";
    for (let h = 0; h < u.length; h++) {
      let g = u[h], x = l.indexOf(g);
      if (x === -1)
        l.splice(h, 0, g), d.push([v, h]);
      else if (x !== h) {
        let E = l.splice(h, 1)[0], S = l.splice(x - 1, 1)[0];
        l.splice(h, 0, S), l.splice(x, 0, E), f.push([E, S]);
      } else
        y.push(g);
      v = g;
    }
    for (let h = 0; h < m.length; h++) {
      let g = m[h];
      g in a && (A(() => {
        Ae(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let h = 0; h < f.length; h++) {
      let [g, x] = f[h], E = a[g], S = a[x], w = document.createElement("div");
      A(() => {
        S || P('x-for ":key" is undefined or invalid', s, x, a), S.after(w), E.after(S), S._x_currentIfEl && S.after(S._x_currentIfEl), w.before(E), E._x_currentIfEl && E.after(E._x_currentIfEl), w.remove();
      }), S._x_refreshXForScope(c[u.indexOf(x)]);
    }
    for (let h = 0; h < d.length; h++) {
      let [g, x] = d[h], E = g === "template" ? s : a[g];
      E._x_currentIfEl && (E = E._x_currentIfEl);
      let S = c[x], w = u[x], p = document.importNode(s.content, !0).firstElementChild, b = Se(S);
      Ke(p, b, s), p._x_refreshXForScope = (_) => {
        Object.entries(_).forEach(([C, I]) => {
          b[C] = I;
        });
      }, A(() => {
        E.after(p), oe(() => G(p))();
      }), typeof w == "object" && P("x-for key cannot be an object, it must be a string or an integer", s), a[w] = p;
    }
    for (let h = 0; h < y.length; h++)
      a[y[h]]._x_refreshXForScope(c[u.indexOf(y[h])]);
    s._x_prevKeys = u;
  });
}
function oa(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Yn(e, t, n, i) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = n), e.collection && (r[e.collection] = i), r;
}
function aa(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function wr() {
}
wr.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = wt(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
N("ref", wr);
N("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && P("x-if can only be used on a <template> tag", e);
  let r = k(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Ke(a, {}, e), A(() => {
      e.after(a), oe(() => G(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      A(() => {
        Ae(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => e._x_undoIf && e._x_undoIf());
});
N("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((r) => Ko(e, r));
});
_t((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
bn(Ai("@", $i(Te("on:"))));
N("on", oe((e, { value: t, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? k(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = en(e, t, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Ct("Collapse", "collapse", "collapse");
Ct("Intersect", "intersect", "intersect");
Ct("Focus", "trap", "focus");
Ct("Mask", "mask", "mask");
function Ct(e, t, n) {
  N(t, (i) => P(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Ue.setEvaluator(oo);
Ue.setReactivityEngine({ reactive: An, effect: yo, release: wo, raw: O });
var la = Ue, Z = la;
function ca(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: i }) {
    let r = Kn(i, "duration", 250) / 1e3, s = Kn(i, "min", 0), o = !i.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (c, u) => {
      let d = e.setStyles(c, u);
      return u.height ? () => {
      } : d;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(c = () => {
      }, u = () => {
      }) {
        o && (n.hidden = !1), o && (n.style.display = null);
        let d = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let f = n.getBoundingClientRect().height;
        d === f && (d = s), e.transition(n, e.setStyles, {
          during: l,
          start: { height: d + "px" },
          end: { height: f + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - f) < 1 && (n.style.overflow = null);
        });
      },
      out(c = () => {
      }, u = () => {
      }) {
        let d = n.getBoundingClientRect().height;
        e.transition(n, a, {
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
function Kn(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const i = e[e.indexOf(t) + 1];
  if (!i)
    return n;
  if (t === "duration") {
    let r = i.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  if (t === "min") {
    let r = i.match(/([0-9]+)px/);
    if (r)
      return r[1];
  }
  return i;
}
var ua = ca;
function da(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: pa(r),
      threshold: fa(r)
    }, c = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting !== (n === "leave") && (a(), r.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(t), o(() => {
      c.disconnect();
    });
  }));
}
function fa(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function ha(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function pa(e) {
  const t = "margin", n = "0px 0px 0px 0px", i = e.indexOf(t);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(ha(e[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var ga = da, xr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ut = /* @__PURE__ */ xr.join(","), _r = typeof Element > "u", be = _r ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, tn = !_r && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Er = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(ut));
  return n && be.call(t, ut) && r.unshift(t), r = r.filter(i), r;
}, Sr = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = be.call(o, ut);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), f = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && f) {
        var m = e(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, m) : r.push({
          scope: o,
          candidates: m
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Ir = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, ma = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, Cr = function(t) {
  return t.tagName === "INPUT";
}, ba = function(t) {
  return Cr(t) && t.type === "hidden";
}, va = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, ya = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, wa = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || tn(t), i = function(a) {
    return n.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, r;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    r = i(window.CSS.escape(t.name));
  else
    try {
      r = i(t.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var s = ya(r, t.form);
  return !s || s === t;
}, xa = function(t) {
  return Cr(t) && t.type === "radio";
}, _a = function(t) {
  return xa(t) && !wa(t);
}, Un = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Ea = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = be.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (be.call(o, "details:not([open]) *"))
    return !0;
  var a = tn(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = tn(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return Un(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return Un(t);
  return !1;
}, Sa = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return be.call(n, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, dt = function(t, n) {
  return !(n.disabled || ba(n) || Ea(n, t) || // For a details element with a summary, the summary element gets the focus
  va(n) || Sa(n));
}, nn = function(t, n) {
  return !(_a(n) || Ir(n) < 0 || !dt(t, n));
}, Ia = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Ca = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Ir(a, o), c = o ? e(r.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), i.sort(ma).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, Ta = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Sr([t], n.includeContainer, {
    filter: nn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Ia
  }) : i = Er(t, n.includeContainer, nn.bind(null, n)), Ca(i);
}, Tr = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Sr([t], n.includeContainer, {
    filter: dt.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Er(t, n.includeContainer, dt.bind(null, n)), i;
}, tt = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return be.call(t, ut) === !1 ? !1 : nn(n, t);
}, Oa = /* @__PURE__ */ xr.concat("iframe").join(","), st = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return be.call(t, Oa) === !1 ? !1 : dt(n, t);
};
function Gn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Jn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gn(Object(n), !0).forEach(function(i) {
      Aa(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Gn(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Aa(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var Zn = /* @__PURE__ */ function() {
  var e = [];
  return {
    activateTrap: function(n) {
      if (e.length > 0) {
        var i = e[e.length - 1];
        i !== n && i.pause();
      }
      var r = e.indexOf(n);
      r === -1 || e.splice(r, 1), e.push(n);
    },
    deactivateTrap: function(n) {
      var i = e.indexOf(n);
      i !== -1 && e.splice(i, 1), e.length > 0 && e[e.length - 1].unpause();
    }
  };
}(), $a = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Na = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, ka = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, Xn = function(t) {
  return setTimeout(t, 0);
}, Qn = function(t, n) {
  var i = -1;
  return t.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Le = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, i) : t;
}, nt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Ra = function(t, n) {
  var i = n?.document || document, r = Jn({
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
  }, o, a = function(p, b, _) {
    return p && p[b] !== void 0 ? p[b] : r[_ || b];
  }, l = function(p) {
    return s.containerGroups.findIndex(function(b) {
      var _ = b.container, C = b.tabbableNodes;
      return _.contains(p) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      C.find(function(I) {
        return I === p;
      });
    });
  }, c = function(p) {
    var b = r[p];
    if (typeof b == "function") {
      for (var _ = arguments.length, C = new Array(_ > 1 ? _ - 1 : 0), I = 1; I < _; I++)
        C[I - 1] = arguments[I];
      b = b.apply(void 0, C);
    }
    if (b === !0 && (b = void 0), !b) {
      if (b === void 0 || b === !1)
        return b;
      throw new Error("`".concat(p, "` was specified but was not a node, or did not return a node"));
    }
    var $ = b;
    if (typeof b == "string" && ($ = i.querySelector(b), !$))
      throw new Error("`".concat(p, "` as selector refers to no known node"));
    return $;
  }, u = function() {
    var p = c("initialFocus");
    if (p === !1)
      return !1;
    if (p === void 0)
      if (l(i.activeElement) >= 0)
        p = i.activeElement;
      else {
        var b = s.tabbableGroups[0], _ = b && b.firstTabbableNode;
        p = _ || c("fallbackFocus");
      }
    if (!p)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return p;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(p) {
      var b = Ta(p, r.tabbableOptions), _ = Tr(p, r.tabbableOptions);
      return {
        container: p,
        tabbableNodes: b,
        focusableNodes: _,
        firstTabbableNode: b.length > 0 ? b[0] : null,
        lastTabbableNode: b.length > 0 ? b[b.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(I) {
          var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, R = _.findIndex(function(L) {
            return L === I;
          });
          if (!(R < 0))
            return $ ? _.slice(R + 1).find(function(L) {
              return tt(L, r.tabbableOptions);
            }) : _.slice(0, R).reverse().find(function(L) {
              return tt(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(p) {
      return p.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function w(p) {
    if (p !== !1 && p !== i.activeElement) {
      if (!p || !p.focus) {
        w(u());
        return;
      }
      p.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = p, $a(p) && p.select();
    }
  }, m = function(p) {
    var b = c("setReturnFocus", p);
    return b || (b === !1 ? !1 : p);
  }, y = function(p) {
    var b = nt(p);
    if (!(l(b) >= 0)) {
      if (Le(r.clickOutsideDeactivates, p)) {
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
          returnFocus: r.returnFocusOnDeactivate && !st(b, r.tabbableOptions)
        });
        return;
      }
      Le(r.allowOutsideClick, p) || p.preventDefault();
    }
  }, v = function(p) {
    var b = nt(p), _ = l(b) >= 0;
    _ || b instanceof Document ? _ && (s.mostRecentlyFocusedNode = b) : (p.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, h = function(p) {
    var b = nt(p);
    d();
    var _ = null;
    if (s.tabbableGroups.length > 0) {
      var C = l(b), I = C >= 0 ? s.containerGroups[C] : void 0;
      if (C < 0)
        p.shiftKey ? _ = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : _ = s.tabbableGroups[0].firstTabbableNode;
      else if (p.shiftKey) {
        var $ = Qn(s.tabbableGroups, function(z) {
          var D = z.firstTabbableNode;
          return b === D;
        });
        if ($ < 0 && (I.container === b || st(b, r.tabbableOptions) && !tt(b, r.tabbableOptions) && !I.nextTabbableNode(b, !1)) && ($ = C), $ >= 0) {
          var R = $ === 0 ? s.tabbableGroups.length - 1 : $ - 1, L = s.tabbableGroups[R];
          _ = L.lastTabbableNode;
        }
      } else {
        var V = Qn(s.tabbableGroups, function(z) {
          var D = z.lastTabbableNode;
          return b === D;
        });
        if (V < 0 && (I.container === b || st(b, r.tabbableOptions) && !tt(b, r.tabbableOptions) && !I.nextTabbableNode(b)) && (V = C), V >= 0) {
          var F = V === s.tabbableGroups.length - 1 ? 0 : V + 1, ae = s.tabbableGroups[F];
          _ = ae.firstTabbableNode;
        }
      }
    } else
      _ = c("fallbackFocus");
    _ && (p.preventDefault(), f(_));
  }, g = function(p) {
    if (Na(p) && Le(r.escapeDeactivates, p) !== !1) {
      p.preventDefault(), o.deactivate();
      return;
    }
    if (ka(p)) {
      h(p);
      return;
    }
  }, x = function(p) {
    var b = nt(p);
    l(b) >= 0 || Le(r.clickOutsideDeactivates, p) || Le(r.allowOutsideClick, p) || (p.preventDefault(), p.stopImmediatePropagation());
  }, E = function() {
    if (s.active)
      return Zn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? Xn(function() {
        f(u());
      }) : f(u()), i.addEventListener("focusin", v, !0), i.addEventListener("mousedown", y, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", y, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", x, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", g, {
        capture: !0,
        passive: !1
      }), o;
  }, S = function() {
    if (s.active)
      return i.removeEventListener("focusin", v, !0), i.removeEventListener("mousedown", y, !0), i.removeEventListener("touchstart", y, !0), i.removeEventListener("click", x, !0), i.removeEventListener("keydown", g, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(p) {
      if (s.active)
        return this;
      var b = a(p, "onActivate"), _ = a(p, "onPostActivate"), C = a(p, "checkCanFocusTrap");
      C || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, b && b();
      var I = function() {
        C && d(), E(), _ && _();
      };
      return C ? (C(s.containers.concat()).then(I, I), this) : (I(), this);
    },
    deactivate: function(p) {
      if (!s.active)
        return this;
      var b = Jn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, p);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, S(), s.active = !1, s.paused = !1, Zn.deactivateTrap(o);
      var _ = a(b, "onDeactivate"), C = a(b, "onPostDeactivate"), I = a(b, "checkCanReturnFocus"), $ = a(b, "returnFocus", "returnFocusOnDeactivate");
      _ && _();
      var R = function() {
        Xn(function() {
          $ && f(m(s.nodeFocusedBeforeActivation)), C && C();
        });
      };
      return $ && I ? (I(m(s.nodeFocusedBeforeActivation)).then(R, R), this) : (R(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, S(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), E(), this);
    },
    updateContainerElements: function(p) {
      var b = [].concat(p).filter(Boolean);
      return s.containers = b.map(function(_) {
        return typeof _ == "string" ? i.querySelector(_) : _;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function La(e) {
  let t, n;
  window.addEventListener("focusin", () => {
    t = n, n = document.activeElement;
  }), e.magic("focus", (i) => {
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
        return st(s);
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
        return Array.isArray(r) ? r : Tr(r, { displayCheck: "none" });
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
    (i, { expression: r, modifiers: s }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let c = a(r), u = !1, d = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => i
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let h = i.querySelector("[autofocus]");
        h && (d.initialFocus = h);
      }
      let f = Ra(i, d), m = () => {
      }, y = () => {
      };
      const v = () => {
        m(), m = () => {
        }, y(), y = () => {
        }, f.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((h) => {
        u !== h && (h && !u && (s.includes("noscroll") && (y = Ma()), s.includes("inert") && (m = ei(i)), setTimeout(() => {
          f.activate();
        }, 15)), !h && u && v(), u = !!h);
      })), l(v);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ei(i);
    }
  ));
}
function ei(e) {
  let t = [];
  return Or(e, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Or(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? Or(e.parentNode, t) : t(n);
  });
}
function Ma() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var Fa = La;
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
function Da(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Pa(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function za(e, t, n) {
  return t && Pa(e.prototype, t), e;
}
var Ba = Object.defineProperty, J = function(e, t) {
  return Ba(e, "name", { value: t, configurable: !0 });
}, ja = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Wa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Ha = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Va = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, qa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ya = J(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Me = J(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), T = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, te = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ti = { OUTLINE: "outline", FILLED: "filled" }, Dt = { FADE: "fade", SLIDE: "slide" }, Fe = { CLOSE: Me(ja), SUCCESS: Me(Va), ERROR: Me(Wa), WARNING: Me(qa), INFO: Me(Ha) }, ni = J(function(e) {
  e.wrapper.classList.add(T.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(T.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ii = J(function(e) {
  e.wrapper.classList.remove(T.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Ka = J(function(e) {
  e.wrapper.classList.add(T.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(T.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Ua = J(function(e) {
  e.wrapper.classList.remove(T.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Ar = function() {
  function e(t) {
    var n = this;
    Da(this, e), this.notifyOut = J(function(z) {
      z(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? Dt.FADE : c, d = t.type, f = d === void 0 ? "outline" : d, m = t.title, y = t.text, v = t.showIcon, h = v === void 0 ? !0 : v, g = t.customIcon, x = g === void 0 ? "" : g, E = t.customClass, S = E === void 0 ? "" : E, w = t.speed, p = w === void 0 ? 500 : w, b = t.showCloseButton, _ = b === void 0 ? !0 : b, C = t.autoclose, I = C === void 0 ? !0 : C, $ = t.autotimeout, R = $ === void 0 ? 3e3 : $, L = t.position, V = L === void 0 ? "right top" : L, F = t.customWrapper, ae = F === void 0 ? "" : F;
    if (this.customWrapper = ae, this.status = l, this.title = m, this.text = y, this.showIcon = h, this.customIcon = x, this.customClass = S, this.speed = p, this.effect = u, this.showCloseButton = _, this.autoclose = I, this.autotimeout = R, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return za(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(T.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(T.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](T.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](T.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](T.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](T.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](T.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](T.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](T.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(T.NOTIFY_CLOSE), i.innerHTML = Fe.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Ya(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(T.NOTIFY), this.type) {
      case ti.OUTLINE:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
        break;
      case ti.FILLED:
        this.wrapper.classList.add(T.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case te.SUCCESS:
        this.wrapper.classList.add(T.NOTIFY_SUCCESS);
        break;
      case te.ERROR:
        this.wrapper.classList.add(T.NOTIFY_ERROR);
        break;
      case te.WARNING:
        this.wrapper.classList.add(T.NOTIFY_WARNING);
        break;
      case te.INFO:
        this.wrapper.classList.add(T.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(T.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(T.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(T.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(T.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = J(function(r) {
      switch (r) {
        case te.SUCCESS:
          return Fe.SUCCESS;
        case te.ERROR:
          return Fe.ERROR;
        case te.WARNING:
          return Fe.WARNING;
        case te.INFO:
          return Fe.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(T.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
  } }, { key: "setObserver", value: function() {
    var n = this, i = new IntersectionObserver(function(r) {
      if (r[0].intersectionRatio <= 0) n.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      i.observe(n.wrapper);
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
      case Dt.FADE:
        this.selectedNotifyInEffect = ni, this.selectedNotifyOutEffect = ii;
        break;
      case Dt.SLIDE:
        this.selectedNotifyInEffect = Ka, this.selectedNotifyOutEffect = Ua;
        break;
      default:
        this.selectedNotifyInEffect = ni, this.selectedNotifyOutEffect = ii;
    }
  } }]), e;
}();
J(Ar, "Notify");
var $r = Ar;
globalThis.Notify = $r;
const Nr = ["success", "error", "warning", "info"], kr = [
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
], Rr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function De(e = {}) {
  const t = {
    ...Rr,
    ...e
  };
  Nr.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), kr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new $r(t);
}
const Ga = {
  custom: De,
  success(e, t = "Success", n = {}) {
    De({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    De({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    De({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    De({
      status: "info",
      title: t,
      text: e,
      ...n
    });
  },
  setDefaults(e = {}) {
    Object.assign(Rr, e);
  },
  get allowedStatuses() {
    return [...Nr];
  },
  get allowedPositions() {
    return [...kr];
  }
}, rn = function() {
}, Ve = {}, ft = {}, qe = {};
function Ja(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let i = e.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || t(n);
  }; i--; ) {
    if (o = e[i], a = ft[o], a) {
      s(o, a);
      continue;
    }
    l = qe[o] = qe[o] || [], l.push(s);
  }
}
function Lr(e, t) {
  if (!e) return;
  const n = qe[e];
  if (ft[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function sn(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || rn)(t) : (e.success || rn)(e);
}
function Za(e, t, n, i, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Mr(t, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(t, l, e.defaultPrevented);
}
function Mr(e, t, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || rn, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, f;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    f = r.createElement("link"), f.rel = "stylesheet", f.href = c, u = "hideFocus" in f, u && f.relList && (u = 0, f.rel = "preload", f.as = "style"), n.inlineStyleNonce && f.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    f = r.createElement("img"), f.src = c;
  else if (f = r.createElement("script"), f.src = c, f.async = s === void 0 ? !0 : s, n.inlineScriptNonce && f.setAttribute("nonce", n.inlineScriptNonce), d = "noModule" in f, /^module!/.test(l)) {
    if (!d) return t(e, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return t(e, "l");
  const m = function(y) {
    Za(y, e, f, t, n, i, o, u);
  };
  f.addEventListener("load", m, { once: !0 }), f.addEventListener("error", m, { once: !0 }), a(e, f) !== !1 && r.head.appendChild(f);
}
function Xa(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let i = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Mr(e[o], s, n);
}
function ne(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in Ve)
      throw "LoadJS";
    Ve[i] = !0;
  }
  function s(o, a) {
    Xa(e, function(l) {
      sn(r, l), o && sn({ success: o, error: a }, l), Lr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
ne.ready = function(t, n) {
  return Ja(t, function(i) {
    sn(n, i);
  }), ne;
};
ne.done = function(t) {
  Lr(t, []);
};
ne.reset = function() {
  Object.keys(Ve).forEach((t) => delete Ve[t]), Object.keys(ft).forEach((t) => delete ft[t]), Object.keys(qe).forEach((t) => delete qe[t]);
};
ne.isDefined = function(t) {
  return t in Ve;
};
function Qa(e) {
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
  const i = `[data-alpine-root="${n}"]`;
  let r = null;
  if (t.matches(i) ? r = t : r = t.querySelector(i), !r) {
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
function el(e) {
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
function tl(e) {
  e.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const t = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== t.sectionId && !t.allowMultiple && (t.open = !1);
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
function nl(e) {
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
function il(e) {
  e.data("rzAspectRatio", () => ({
    init() {
      const t = parseFloat(this.$el.dataset.ratio);
      if (!isNaN(t) && t > 0) {
        const n = 100 / t + "%";
        this.$el.style.paddingBottom = n;
      } else
        this.$el.style.paddingBottom = "100%";
    }
  }));
}
function rl(e) {
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
function sl(e, t) {
  function n(r) {
    if (!r) return {};
    const s = document.getElementById(r);
    if (!s)
      return console.warn(`[rzCarousel] JSON script element #${r} not found.`), {};
    try {
      return JSON.parse(s.textContent || "{}");
    } catch (o) {
      return console.error(`[rzCarousel] Failed to parse JSON from #${r}:`, o), {};
    }
  }
  function i(r) {
    const s = r.options || "";
    if (!s) return {};
    const o = s.trim();
    if (o.startsWith("{") || o.startsWith("["))
      try {
        return JSON.parse(o);
      } catch (a) {
        return console.error("[rzCarousel] Failed to parse inline options JSON:", a), {};
      }
    return n(s);
  }
  e.data("rzCarousel", () => ({
    emblaApi: null,
    canScrollPrev: !1,
    canScrollNext: !1,
    selectedIndex: 0,
    scrollSnaps: [],
    init() {
      const r = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (l) {
          return console.error("[rzCarousel] Bad assets JSON:", l), [];
        }
      })(), s = this.$el.dataset.nonce || "", o = i(this.$el.dataset), a = this;
      r.length > 0 && typeof t == "function" ? t(
        r,
        {
          success() {
            window.EmblaCarousel ? a.initializeEmbla(o) : console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
          },
          error(l) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", l);
          }
        },
        s
      ) : window.EmblaCarousel ? this.initializeEmbla(o) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    initializeEmbla(r) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      this.emblaApi = window.EmblaCarousel(s, r), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
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
    scrollTo(r) {
      this.emblaApi?.scrollTo(r);
    }
  }));
}
function ol(e) {
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
function al(e, t) {
  e.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const n = JSON.parse(this.$el.dataset.assets), i = this.$el.dataset.codeid, r = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, t(n, {
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
function ll(e) {
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
function cl(e, t) {
  e.data("rzDateEdit", () => ({
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
      t(r, {
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
const on = Math.min, we = Math.max, ht = Math.round, K = (e) => ({
  x: e,
  y: e
}), ul = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, dl = {
  start: "end",
  end: "start"
};
function ri(e, t, n) {
  return we(e, on(t, n));
}
function Tt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ve(e) {
  return e.split("-")[0];
}
function Ot(e) {
  return e.split("-")[1];
}
function Fr(e) {
  return e === "x" ? "y" : "x";
}
function Dr(e) {
  return e === "y" ? "height" : "width";
}
function pe(e) {
  return ["top", "bottom"].includes(ve(e)) ? "y" : "x";
}
function Pr(e) {
  return Fr(pe(e));
}
function fl(e, t, n) {
  n === void 0 && (n = !1);
  const i = Ot(e), r = Pr(e), s = Dr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = pt(o)), [o, pt(o)];
}
function hl(e) {
  const t = pt(e);
  return [an(e), t, an(t)];
}
function an(e) {
  return e.replace(/start|end/g, (t) => dl[t]);
}
function pl(e, t, n) {
  const i = ["left", "right"], r = ["right", "left"], s = ["top", "bottom"], o = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? r : i : t ? i : r;
    case "left":
    case "right":
      return t ? s : o;
    default:
      return [];
  }
}
function gl(e, t, n, i) {
  const r = Ot(e);
  let s = pl(ve(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(an)))), s;
}
function pt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => ul[t]);
}
function ml(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function bl(e) {
  return typeof e != "number" ? ml(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function gt(e) {
  const {
    x: t,
    y: n,
    width: i,
    height: r
  } = e;
  return {
    width: i,
    height: r,
    top: n,
    left: t,
    right: t + i,
    bottom: n + r,
    x: t,
    y: n
  };
}
function si(e, t, n) {
  let {
    reference: i,
    floating: r
  } = e;
  const s = pe(t), o = Pr(t), a = Dr(o), l = ve(t), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
  let m;
  switch (l) {
    case "top":
      m = {
        x: u,
        y: i.y - r.height
      };
      break;
    case "bottom":
      m = {
        x: u,
        y: i.y + i.height
      };
      break;
    case "right":
      m = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      m = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      m = {
        x: i.x,
        y: i.y
      };
  }
  switch (Ot(t)) {
    case "start":
      m[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += f * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const vl = async (e, t, n) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let c = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: u,
    y: d
  } = si(c, i, l), f = i, m = {}, y = 0;
  for (let v = 0; v < a.length; v++) {
    const {
      name: h,
      fn: g
    } = a[v], {
      x,
      y: E,
      data: S,
      reset: w
    } = await g({
      x: u,
      y: d,
      initialPlacement: i,
      placement: f,
      strategy: r,
      middlewareData: m,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = x ?? u, d = E ?? d, m = {
      ...m,
      [h]: {
        ...m[h],
        ...S
      }
    }, w && y <= 50 && (y++, typeof w == "object" && (w.placement && (f = w.placement), w.rects && (c = w.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : w.rects), {
      x: u,
      y: d
    } = si(c, f, l)), v = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: m
  };
};
async function zr(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: i,
    y: r,
    platform: s,
    rects: o,
    elements: a,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: m = 0
  } = Tt(t, e), y = bl(m), h = a[f ? d === "floating" ? "reference" : "floating" : d], g = gt(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(h))) == null || n ? h : h.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), x = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), S = await (s.isElement == null ? void 0 : s.isElement(E)) ? await (s.getScale == null ? void 0 : s.getScale(E)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, w = gt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: x,
    offsetParent: E,
    strategy: l
  }) : x);
  return {
    top: (g.top - w.top + y.top) / S.y,
    bottom: (w.bottom - g.bottom + y.bottom) / S.y,
    left: (g.left - w.left + y.left) / S.x,
    right: (w.right - g.right + y.right) / S.x
  };
}
const yl = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, i;
      const {
        placement: r,
        middlewareData: s,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = t, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: y = "none",
        flipAlignment: v = !0,
        ...h
      } = Tt(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const g = ve(r), x = pe(a), E = ve(a) === a, S = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), w = f || (E || !v ? [pt(a)] : hl(a)), p = y !== "none";
      !f && p && w.push(...gl(a, v, y, S));
      const b = [a, ...w], _ = await zr(t, h), C = [];
      let I = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && C.push(_[g]), d) {
        const F = fl(r, o, S);
        C.push(_[F[0]], _[F[1]]);
      }
      if (I = [...I, {
        placement: r,
        overflows: C
      }], !C.every((F) => F <= 0)) {
        var $, R;
        const F = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, ae = b[F];
        if (ae) {
          var L;
          const D = d === "alignment" ? x !== pe(ae) : !1, q = ((L = I[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!D || q)
            return {
              data: {
                index: F,
                overflows: I
              },
              reset: {
                placement: ae
              }
            };
        }
        let z = (R = I.filter((D) => D.overflows[0] <= 0).sort((D, q) => D.overflows[1] - q.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!z)
          switch (m) {
            case "bestFit": {
              var V;
              const D = (V = I.filter((q) => {
                if (p) {
                  const Q = pe(q.placement);
                  return Q === x || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Q === "y";
                }
                return !0;
              }).map((q) => [q.placement, q.overflows.filter((Q) => Q > 0).reduce((Q, Gr) => Q + Gr, 0)]).sort((q, Q) => q[1] - Q[1])[0]) == null ? void 0 : V[0];
              D && (z = D);
              break;
            }
            case "initialPlacement":
              z = a;
              break;
          }
        if (r !== z)
          return {
            reset: {
              placement: z
            }
          };
      }
      return {};
    }
  };
};
async function wl(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = ve(n), a = Ot(n), l = pe(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Tt(t, e);
  let {
    mainAxis: f,
    crossAxis: m,
    alignmentAxis: y
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof y == "number" && (m = a === "end" ? y * -1 : y), l ? {
    x: m * u,
    y: f * c
  } : {
    x: f * c,
    y: m * u
  };
}
const xl = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, i;
      const {
        x: r,
        y: s,
        placement: o,
        middlewareData: a
      } = t, l = await wl(t, e);
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
}, _l = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: i,
        placement: r
      } = t, {
        mainAxis: s = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (h) => {
            let {
              x: g,
              y: x
            } = h;
            return {
              x: g,
              y: x
            };
          }
        },
        ...l
      } = Tt(e, t), c = {
        x: n,
        y: i
      }, u = await zr(t, l), d = pe(ve(r)), f = Fr(d);
      let m = c[f], y = c[d];
      if (s) {
        const h = f === "y" ? "top" : "left", g = f === "y" ? "bottom" : "right", x = m + u[h], E = m - u[g];
        m = ri(x, m, E);
      }
      if (o) {
        const h = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", x = y + u[h], E = y - u[g];
        y = ri(x, y, E);
      }
      const v = a.fn({
        ...t,
        [f]: m,
        [d]: y
      });
      return {
        ...v,
        data: {
          x: v.x - n,
          y: v.y - i,
          enabled: {
            [f]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function At() {
  return typeof window < "u";
}
function $e(e) {
  return Br(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function M(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function X(e) {
  var t;
  return (t = (Br(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Br(e) {
  return At() ? e instanceof Node || e instanceof M(e).Node : !1;
}
function j(e) {
  return At() ? e instanceof Element || e instanceof M(e).Element : !1;
}
function U(e) {
  return At() ? e instanceof HTMLElement || e instanceof M(e).HTMLElement : !1;
}
function oi(e) {
  return !At() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof M(e).ShadowRoot;
}
function Ge(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function El(e) {
  return ["table", "td", "th"].includes($e(e));
}
function $t(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function $n(e) {
  const t = Nn(), n = j(e) ? W(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Sl(e) {
  let t = se(e);
  for (; U(t) && !Ee(t); ) {
    if ($n(t))
      return t;
    if ($t(t))
      return null;
    t = se(t);
  }
  return null;
}
function Nn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ee(e) {
  return ["html", "body", "#document"].includes($e(e));
}
function W(e) {
  return M(e).getComputedStyle(e);
}
function Nt(e) {
  return j(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function se(e) {
  if ($e(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    oi(e) && e.host || // Fallback.
    X(e)
  );
  return oi(t) ? t.host : t;
}
function jr(e) {
  const t = se(e);
  return Ee(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : U(t) && Ge(t) ? t : jr(t);
}
function Wr(e, t, n) {
  var i;
  t === void 0 && (t = []);
  const r = jr(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = M(r);
  return s ? (ln(o), t.concat(o, o.visualViewport || [], Ge(r) ? r : [], [])) : t.concat(r, Wr(r, []));
}
function ln(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Hr(e) {
  const t = W(e);
  let n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const r = U(e), s = r ? e.offsetWidth : n, o = r ? e.offsetHeight : i, a = ht(n) !== s || ht(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Vr(e) {
  return j(e) ? e : e.contextElement;
}
function xe(e) {
  const t = Vr(e);
  if (!U(t))
    return K(1);
  const n = t.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Hr(t);
  let o = (s ? ht(n.width) : n.width) / i, a = (s ? ht(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Il = /* @__PURE__ */ K(0);
function qr(e) {
  const t = M(e);
  return !Nn() || !t.visualViewport ? Il : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Cl(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== M(e) ? !1 : t;
}
function Ye(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = Vr(e);
  let o = K(1);
  t && (i ? j(i) && (o = xe(i)) : o = xe(e));
  const a = Cl(s, n, i) ? qr(s) : K(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), m = i && j(i) ? M(i) : i;
    let y = f, v = ln(y);
    for (; v && i && m !== y; ) {
      const h = xe(v), g = v.getBoundingClientRect(), x = W(v), E = g.left + (v.clientLeft + parseFloat(x.paddingLeft)) * h.x, S = g.top + (v.clientTop + parseFloat(x.paddingTop)) * h.y;
      l *= h.x, c *= h.y, u *= h.x, d *= h.y, l += E, c += S, y = M(v), v = ln(y);
    }
  }
  return gt({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function kn(e, t) {
  const n = Nt(e).scrollLeft;
  return t ? t.left + n : Ye(X(e)).left + n;
}
function Yr(e, t, n) {
  n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), r = i.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    kn(e, i)
  )), s = i.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Tl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = X(i), a = t ? $t(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), d = U(i);
  if ((d || !d && !s) && (($e(i) !== "body" || Ge(o)) && (l = Nt(i)), U(i))) {
    const m = Ye(i);
    c = xe(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const f = o && !d && !s ? Yr(o, l, !0) : K(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Ol(e) {
  return Array.from(e.getClientRects());
}
function Al(e) {
  const t = X(e), n = Nt(e), i = e.ownerDocument.body, r = we(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = we(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + kn(e);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += we(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function $l(e, t) {
  const n = M(e), i = X(e), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Nn();
    (!c || c && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Nl(e, t) {
  const n = Ye(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = U(e) ? xe(e) : K(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function ai(e, t, n) {
  let i;
  if (t === "viewport")
    i = $l(e, n);
  else if (t === "document")
    i = Al(X(e));
  else if (j(t))
    i = Nl(t, n);
  else {
    const r = qr(e);
    i = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return gt(i);
}
function Kr(e, t) {
  const n = se(e);
  return n === t || !j(n) || Ee(n) ? !1 : W(n).position === "fixed" || Kr(n, t);
}
function kl(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = Wr(e, []).filter((a) => j(a) && $e(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? se(e) : e;
  for (; j(o) && !Ee(o); ) {
    const a = W(o), l = $n(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ge(o) && !l && Kr(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = se(o);
  }
  return t.set(e, i), i;
}
function Rl(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? $t(t) ? [] : kl(t, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = ai(t, u, r);
    return c.top = we(d.top, c.top), c.right = on(d.right, c.right), c.bottom = on(d.bottom, c.bottom), c.left = we(d.left, c.left), c;
  }, ai(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Ll(e) {
  const {
    width: t,
    height: n
  } = Hr(e);
  return {
    width: t,
    height: n
  };
}
function Ml(e, t, n) {
  const i = U(t), r = X(t), s = n === "fixed", o = Ye(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = kn(r);
  }
  if (i || !i && !s)
    if (($e(t) !== "body" || Ge(r)) && (a = Nt(t)), i) {
      const m = Ye(t, !0, s, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Yr(r, a) : K(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Pt(e) {
  return W(e).position === "static";
}
function li(e, t) {
  if (!U(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return X(e) === n && (n = n.ownerDocument.body), n;
}
function Ur(e, t) {
  const n = M(e);
  if ($t(e))
    return n;
  if (!U(e)) {
    let r = se(e);
    for (; r && !Ee(r); ) {
      if (j(r) && !Pt(r))
        return r;
      r = se(r);
    }
    return n;
  }
  let i = li(e, t);
  for (; i && El(i) && Pt(i); )
    i = li(i, t);
  return i && Ee(i) && Pt(i) && !$n(i) ? n : i || Sl(e) || n;
}
const Fl = async function(e) {
  const t = this.getOffsetParent || Ur, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: Ml(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Dl(e) {
  return W(e).direction === "rtl";
}
const Pl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Tl,
  getDocumentElement: X,
  getClippingRect: Rl,
  getOffsetParent: Ur,
  getElementRects: Fl,
  getClientRects: Ol,
  getDimensions: Ll,
  getScale: xe,
  isElement: j,
  isRTL: Dl
}, mt = xl, bt = _l, vt = yl, yt = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Pl,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return vl(e, t, {
    ...r,
    platform: s
  });
};
function zl(e) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), yt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [mt(this.pixelOffset), vt(), bt({ padding: 8 })]
      }).then(({ x: t, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${t}px`, top: `${n}px` });
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
      const n = this.menuItems.indexOf(t);
      n !== -1 && (this.focusedIndex = n, t.focus());
    },
    handleItemClick(t) {
      const n = t.currentTarget;
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      if (n.getAttribute("aria-haspopup") === "menu") {
        e.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = !1;
      let i = this;
      this.$nextTick(() => i.triggerEl?.focus());
    },
    handleItemMouseEnter(t) {
      const n = t.currentTarget;
      this.focusSelectedItem(n), n.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
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
      this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]').forEach((n) => {
        e.$data(n)?.closeSubmenu();
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
        const n = document.getElementById(t);
        n && (this.parentDropdown = e.$data(n));
      }
      if (!this.parentDropdown) {
        console.error("RzDropdownSubmenu could not find its parent RzDropdownMenu controller.");
        return;
      }
      this.triggerEl = this.$refs.subTrigger, this.siblingContainer = this.$el.parentElement, this.anchor = this.$el.dataset.subAnchor || this.anchor, this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset, this.$watch("open", (n) => {
        n ? (this._lastNavAt = 0, this.parentDropdown.isSubmenuActive = !0, this.$nextTick(() => {
          this.contentEl = document.getElementById(`${this.selfId}-subcontent`), this.contentEl && (this.updatePosition(this.contentEl), this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])')));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open") : (this.focusedIndex = null, this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.$nextTick(() => {
          this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]') || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || yt(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [mt(this.pixelOffset), vt(), bt({ padding: 8 })]
      }).then(({ x: n, y: i }) => {
        Object.assign(t.style, { left: `${n}px`, top: `${i}px` });
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
      t && Array.from(t).some((i) => e.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(t = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, t && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
        e.$data(n)?.closeSubmenu();
      }), this.open = !1;
    },
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (n) => n.hasAttribute("x-data") && n.getAttribute("x-data").startsWith("rzDropdownSubmenu") && n.id !== this.selfId
      ).forEach((n) => {
        e.$data(n)?.closeSubmenu();
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
      const n = t.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          e.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.parentDropdown.open = !1, this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(t) {
      const n = t.currentTarget;
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(n);
      i !== -1 && (this.focusedIndex = i, n.focus()), n.getAttribute("aria-haspopup") === "menu" ? e.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
    },
    handleSubmenuEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleSubmenuArrowLeft() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function Bl(e) {
  e.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const t = typeof window < "u" && "localStorage" in window, n = ["light", "dark", "auto"], i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let r = "auto";
      t && (r = localStorage.getItem("darkMode") ?? "auto", n.includes(r) || (r = "light")), t && localStorage.setItem("darkMode", r), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          r === "dark" || r === "auto" && i
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
      const i = t === "dark" || t === "auto" && n;
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
function jl(e) {
  e.data("rzEmbeddedPreview", () => ({
    iframe: null,
    onDarkModeToggle: null,
    init() {
      try {
        this.iframe = this.$refs.iframe;
        const t = this.debounce(() => {
          this.resizeIframe(this.iframe);
        }, 50);
        this.resizeIframe(this.iframe), new ResizeObserver((r) => {
          for (let s of r)
            t();
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
    resizeIframe(t) {
      if (t)
        try {
          const n = t.contentDocument || t.contentWindow?.document;
          if (n) {
            const i = n.body;
            if (!i)
              setInterval(() => {
                this.resizeIframe(t);
              }, 150);
            else {
              const r = i.scrollHeight + 15;
              t.style.height = r + "px";
            }
          }
        } catch (n) {
          console.error("Error resizing iframe:", n);
        }
    },
    // Debounce helper to limit function calls
    debounce(t, n = 300) {
      let i;
      return (...r) => {
        clearTimeout(i), i = setTimeout(() => {
          t.apply(this, r);
        }, n);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function Wl(e) {
  e.data("rzEmpty", () => {
  });
}
function Hl(e) {
  e.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const t = this;
      if (typeof this.setCurrentHeading == "function") {
        const n = (r, s) => {
          r.forEach((o) => {
            o.isIntersecting && t.setCurrentHeading(t.headingId);
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
function Vl(e) {
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
function ql(e, t) {
  e.data("rzMarkdown", () => ({
    init() {
      const n = JSON.parse(this.$el.dataset.assets), i = this.$el.dataset.nonce;
      t(n, {
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
function Yl(e) {
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
        const i = document.body.offsetWidth - n;
        document.body.style.setProperty("--page-scrollbar-width", `${i}px`), t ? this.$nextTick(() => {
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
function Kl(e, t) {
  e.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: !1,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: !1,
    /* ---------- helpers ---------- */
    _triggerIndex(n) {
      return this.list ? Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]')).findIndex((r) => r.getAttribute("x-ref") === `trigger_${n}`) : -1;
    },
    _contentEl(n) {
      return document.getElementById(`${n}-content`);
    },
    /* ---------- lifecycle ---------- */
    init() {
      this.$el.querySelectorAll("[data-popover]").forEach((i) => {
        i.style.display = "none";
      }), this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },
    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(n) {
      const i = n.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.activeItemId === i && this.open ? this.closeMenu() : this.openMenu(i);
    },
    handleTriggerEnter(n) {
      const i = n.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose(), this.activeItemId !== i && !this.isClosing && requestAnimationFrame(() => this.openMenu(i));
    },
    handleItemEnter(n) {
      const i = n.currentTarget;
      if (!i) return;
      this.cancelClose();
      const r = i.querySelector('[x-ref^="trigger_"]');
      if (r) {
        const s = r.getAttribute("x-ref").replace("trigger_", "");
        this.activeItemId !== s && !this.isClosing && requestAnimationFrame(() => this.openMenu(s));
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
    openMenu(n) {
      this.cancelClose(), this.isClosing = !1;
      const i = this._triggerIndex(n), r = i > (this.prevIndex ?? i) ? "end" : "start", s = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== n) {
        const l = this.$refs[`trigger_${this.activeItemId}`];
        l && delete l.dataset.state;
        const c = this._contentEl(this.activeItemId);
        if (c) {
          const u = r === "end" ? "start" : "end";
          c.setAttribute("data-motion", `to-${u}`), setTimeout(() => {
            c.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = n, this.open = !0, this.prevIndex = i;
      const o = this.$refs[`trigger_${n}`], a = this._contentEl(n);
      !o || !a || (yt(o, a, {
        placement: "bottom-start",
        middleware: [mt(6), vt(), bt({ padding: 8 })]
      }).then(({ x: l, y: c }) => {
        Object.assign(a.style, { left: `${l}px`, top: `${c}px` });
      }), a.style.display = "block", s ? a.setAttribute("data-motion", "fade-in") : a.setAttribute("data-motion", `from-${r}`), this.$nextTick(() => {
        o.setAttribute("aria-expanded", "true"), o.dataset.state = "open";
      }));
    },
    closeMenu() {
      if (!this.open || this.isClosing) return;
      this.isClosing = !0, this.cancelClose();
      const n = this.activeItemId;
      if (!n) {
        this.isClosing = !1;
        return;
      }
      const i = this.$refs[`trigger_${n}`];
      i && (i.setAttribute("aria-expanded", "false"), delete i.dataset.state);
      const r = this._contentEl(n);
      r && (r.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        r.style.display = "none";
      }, 150)), this.open = !1, this.activeItemId = null, this.prevIndex = null, setTimeout(() => {
        this.isClosing = !1;
      }, 150);
    }
  }));
}
function Ul(e) {
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
      const t = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(mt({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(vt()), a && c.push(bt({ padding: l })), yt(this.triggerEl, this.contentEl, {
        placement: t,
        strategy: s,
        middleware: c
      }).then(({ x: u, y: d }) => {
        Object.assign(this.contentEl.style, {
          left: `${u}px`,
          top: `${d}px`
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
function Gl(e) {
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
      const r = t.offsetWidth + 10;
      n.style.paddingLeft = r + "px", n.classList.remove("text-transparent");
    }
  }));
}
function Jl(e) {
  e.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const t = this.$el;
      this.currentVal = parseInt(t.getAttribute("data-current-val")) || 0, this.minVal = parseInt(t.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(t.getAttribute("data-max-val")) || 100, this.label = t.getAttribute("data-label"), this.calculatePercentage(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuemin", this.minVal), t.setAttribute("aria-valuemax", this.maxVal), t.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((i) => {
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
      const t = this.$refs.progressBar, n = this.$refs.progressBarLabel, i = this.$refs.innerLabel;
      n && t && i && (i.innerText = this.buildLabel(), n.clientWidth > t.clientWidth ? n.style.left = t.clientWidth + 10 + "px" : n.style.left = t.clientWidth / 2 - n.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const t = this.$refs.progressBarLabel, n = this.$refs.progressBar;
      return t && n && t.clientWidth > n.clientWidth ? "text-foreground dark:text-foreground" : "";
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
function Zl(e) {
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
function Xl(e) {
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
function Ql(e) {
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
      const n = t.key, i = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), r = i.findIndex((o) => this.tabSelected === o.dataset.name);
      let s = r;
      n === "ArrowRight" ? (s = (r + 1) % i.length, t.preventDefault()) : n === "ArrowLeft" ? (s = (r - 1 + i.length) % i.length, t.preventDefault()) : n === "Home" ? (s = 0, t.preventDefault()) : n === "End" && (s = i.length - 1, t.preventDefault()), s !== r && this.tabButtonClicked(i[s]);
    }
  }));
}
function ec(e) {
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
      const t = this.cookieName ? document.cookie.split("; ").find((i) => i.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, n = this.$el.dataset.defaultOpen === "true";
      this.open = t !== null ? t === "true" : n, this.checkIfMobile(), window.addEventListener("keydown", (i) => {
        (i.ctrlKey || i.metaKey) && i.key.toLowerCase() === this.shortcut.toLowerCase() && (i.preventDefault(), this.toggle());
      }), this.$watch("open", (i) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${i}; path=/; max-age=31536000`);
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
async function tc(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ze(e, t, n) {
  tc(e).then((i) => {
    ne.isDefined(i) || ne(
      e,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), ne.ready([i], t);
  });
}
function nc(e) {
  el(e), tl(e), nl(e), il(e), rl(e), sl(e, ze), ol(e), al(e, ze), ll(e), cl(e, ze), zl(e), Bl(e), jl(e), Wl(e), Hl(e), Vl(e), ql(e, ze), Kl(e), Yl(e), Ul(e), Gl(e), Jl(e), Zl(e), Xl(e), Ql(e), ec(e);
}
function ic(e) {
  e.directive("mobile", (t, { modifiers: n, expression: i }, { cleanup: r }) => {
    const s = n.find((g) => g.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(i && i.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (g) => {
      t.dataset.mobile = g ? "true" : "false", t.dataset.screen = g ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (g) => {
      if (!a) return;
      const x = u();
      x && (x[i] = g);
    }, f = (g) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: g, width: window.innerWidth, breakpoint: o }
        })
      );
    }, m = window.matchMedia(`(max-width: ${o - 1}px)`), y = () => {
      const g = l();
      c(g), d(g), f(g);
    };
    y();
    const v = () => y(), h = () => y();
    m.addEventListener("change", v), window.addEventListener("resize", h, { passive: !0 }), r(() => {
      m.removeEventListener("change", v), window.removeEventListener("resize", h);
    });
  });
}
function rc(e) {
  const t = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (v, h, g) => {
      const E = h.replace(/\[(\d+)\]/g, ".$1").split("."), S = E.pop();
      let w = v;
      for (const p of E)
        (w[p] == null || typeof w[p] != "object") && (w[p] = isFinite(+p) ? [] : {}), w = w[p];
      w[S] = g;
    }, l = e.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-sync] Could not find direct parent/child x-data. Ensure x-sync is used one level inside a parent component.");
      return;
    }
    const d = i.split(",").map((v) => v.trim()).filter(Boolean).map((v) => {
      const h = v.split("->").map((g) => g.trim());
      return h.length !== 2 ? (console.warn('[x-sync] Invalid mapping (expected "parent.path -> child.path"): ', v), null) : { parentPath: h[0], childPath: h[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), m = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), y = [];
    d.forEach((v, h) => {
      const g = m[h];
      if (f) {
        const S = e.evaluate(n, v.childPath, { scope: c });
        g.fromChild = !0, a(u, v.parentPath, S), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const S = e.evaluate(n, v.parentPath, { scope: u });
        g.fromParent = !0, a(c, v.childPath, S), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const x = o(() => {
        const S = e.evaluate(n, v.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, v.childPath, S), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), E = o(() => {
        const S = e.evaluate(n, v.childPath, { scope: c });
        if (!g.fromParent) {
          if (g.skipChildOnce) {
            g.skipChildOnce = !1;
            return;
          }
          g.fromChild = !0, a(u, v.parentPath, S), queueMicrotask(() => {
            g.fromChild = !1;
          });
        }
      });
      y.push(x, E);
    }), s(() => {
      for (const v of y)
        try {
          v && v();
        } catch {
        }
    });
  };
  e.directive("sync", t);
}
Z.plugin(ua);
Z.plugin(ga);
Z.plugin(Fa);
nc(Z);
ic(Z);
rc(Z);
const sc = {
  Alpine: Z,
  require: ze,
  toast: Ga,
  $data: Qa
};
window.Alpine = Z;
window.Rizzy = { ...window.Rizzy || {}, ...sc };
Z.start();
export {
  sc as default
};
