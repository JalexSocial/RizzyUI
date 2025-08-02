var zt = !1, Bt = !1, ce = [], jt = -1;
function Zr(e) {
  Jr(e);
}
function Jr(e) {
  ce.includes(e) || ce.push(e), Qr();
}
function Xr(e) {
  let t = ce.indexOf(e);
  t !== -1 && t > jt && ce.splice(t, 1);
}
function Qr() {
  !Bt && !zt && (zt = !0, queueMicrotask(es));
}
function es() {
  zt = !1, Bt = !0;
  for (let e = 0; e < ce.length; e++)
    ce[e](), jt = e;
  ce.length = 0, jt = -1, Bt = !1;
}
var Ie, ve, Se, ci, Wt = !0;
function ts(e) {
  Wt = !1, e(), Wt = !0;
}
function ns(e) {
  Ie = e.reactive, Se = e.release, ve = (t) => e.effect(t, { scheduler: (n) => {
    Wt ? Zr(n) : n();
  } }), ci = e.raw;
}
function Rn(e) {
  ve = e;
}
function is(e) {
  let t = () => {
  };
  return [(i) => {
    let r = ve(i);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Se(r));
    }, r;
  }, () => {
    t();
  }];
}
function ui(e, t) {
  let n = !0, i, r = ve(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => Se(r);
}
var fi = [], di = [], hi = [];
function rs(e) {
  hi.push(e);
}
function cn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, di.push(t));
}
function pi(e) {
  fi.push(e);
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
var un = new MutationObserver(pn), fn = !1;
function dn() {
  un.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), fn = !0;
}
function bi() {
  os(), un.disconnect(), fn = !1;
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
  if (!fn)
    return e();
  bi();
  let t = e();
  return dn(), t;
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
    fi.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || di.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && hi.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function vi(e) {
  return Te(pe(e));
}
function Ye(e, t, n) {
  return e._x_dataStack = [t, ...pe(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function pe(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? pe(e.host) : e.parentNode ? pe(e.parentNode) : [];
}
function Te(e) {
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
function xi(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return e(this.initialValue, () => fs(i, r), (o) => Ht(i, r, o), r, s);
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
function fs(e, t) {
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
var wi = {};
function H(e, t) {
  wi[e] = t;
}
function at(e, t) {
  let n = ds(t);
  return Object.entries(wi).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function ds(e) {
  let [t, n] = Oi(e), i = { interceptor: xi, ...t };
  return cn(e, n), i;
}
function _i(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    je(r, e, t);
  }
}
function je(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var nt = !0;
function Ei(e) {
  let t = nt;
  nt = !1;
  let n = e();
  return nt = t, n;
}
function ue(e, t, n = {}) {
  let i;
  return k(e, t)((r) => i = r, n), i;
}
function k(...e) {
  return Ii(...e);
}
var Ii = ps;
function hs(e) {
  Ii = e;
}
function ps(e, t) {
  let n = {};
  at(n, e);
  let i = [n, ...pe(e)], r = typeof t == "function" ? Si(i, t) : ms(i, t, e);
  return _i.bind(null, e, t, r);
}
function Si(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [] } = {}) => {
    let s = t.apply(Te([i, ...e]), r);
    We(n, s);
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
      return je(o, t, e), Promise.resolve();
    }
  })();
  return kt[e] = s, s;
}
function ms(e, t, n) {
  let i = gs(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [] } = {}) => {
    i.result = void 0, i.finished = !1;
    let a = Te([s, ...e]);
    if (typeof i == "function") {
      let l = i(i, a).catch((c) => je(c, n, t));
      i.finished ? (We(r, i.result, a, o, n), i.result = void 0) : l.then((c) => {
        We(r, c, a, o, n);
      }).catch((c) => je(c, n, t)).finally(() => i.result = void 0);
    }
  };
}
function We(e, t, n, i, r) {
  if (nt && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => We(e, o, n, i)).catch((o) => je(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var gn = "x-";
function Ce(e = "") {
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
      const i = le.indexOf(n);
      le.splice(i >= 0 ? i : le.indexOf("DEFAULT"), 0, e);
    }
  };
}
function vs(e) {
  return Object.keys(lt).includes(e);
}
function mn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Ti(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Ni((s, o) => i[s] = o)).filter(Ri).map(ws(i, n)).sort(_s).map((s) => xs(e, s));
}
function Ti(e) {
  return Array.from(e).map(Ni()).filter((t) => !Ri(t));
}
var Vt = !1, Pe = /* @__PURE__ */ new Map(), Ci = Symbol();
function ys(e) {
  Vt = !0;
  let t = Symbol();
  Ci = t, Pe.set(t, []);
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
    Alpine: Ke,
    effect: i,
    cleanup: n,
    evaluateLater: k.bind(k, e),
    evaluate: ue.bind(ue, e)
  }, () => t.forEach((a) => a())];
}
function xs(e, t) {
  let n = () => {
  }, i = lt[t.type] || n, [r, s] = Oi(e);
  gi(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Vt ? Pe.get(Ci).push(i) : i());
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
function ws(e, t) {
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
var qt = "DEFAULT", le = [
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
  let n = le.indexOf(e.type) === -1 ? qt : e.type, i = le.indexOf(t.type) === -1 ? qt : t.type;
  return le.indexOf(n) - le.indexOf(i);
}
function ze(e, t, n = {}) {
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
function ge(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((r) => ge(r, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    ge(i, t), i = i.nextElementSibling;
}
function P(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Ln = !1;
function Es() {
  Ln && P("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Ln = !0, document.body || P("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ze(document, "alpine:init"), ze(document, "alpine:initializing"), dn(), rs((t) => G(t, ge)), cn((t) => Ae(t)), pi((t, n) => {
    mn(t, n).forEach((i) => i());
  });
  let e = (t) => !xt(t.parentElement, !0);
  Array.from(document.querySelectorAll(Di().join(","))).filter(e).forEach((t) => {
    G(t);
  }), ze(document, "alpine:initialized"), setTimeout(() => {
    Cs();
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
function xt(e, t = !1) {
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
function Is(e) {
  return Fi().some((t) => e.matches(t));
}
var Bi = [];
function Ss(e) {
  Bi.push(e);
}
var Ts = 1;
function G(e, t = ge, n = () => {
}) {
  Oe(e, (i) => i._x_ignore) || ys(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Bi.forEach((s) => s(i, r)), mn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Ts++), i._x_ignore && r());
    });
  });
}
function Ae(e, t = ge) {
  t(e, (n) => {
    ss(n), mi(n), delete n._x_marker;
  });
}
function Cs() {
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
function xn(e = () => {
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
function wn(e, t) {
  return Array.isArray(t) ? Mn(e, t.join(" ")) : typeof t == "object" && t !== null ? As(e, t) : typeof t == "function" ? wn(e, t()) : Mn(e, t);
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
function wt(e, t) {
  return typeof t == "object" && t !== null ? $s(e, t) : Ns(e, t);
}
function $s(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = ks(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    wt(e, n);
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
  ji(e, wn, ""), {
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
  ji(e, wt);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((b, x) => x < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((b, x) => x > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? ke(t, "scale", 95) / 100 : 1, f = ke(t, "delay", 0) / 1e3, d = ke(t, "origin", "center"), m = "opacity, transform", v = ke(t, "duration", 150) / 1e3, E = ke(t, "duration", 75) / 1e3, h = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: d,
    transitionDelay: `${f}s`,
    transitionProperty: m,
    transitionDuration: `${v}s`,
    transitionTimingFunction: h
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: d,
    transitionDelay: `${f}s`,
    transitionProperty: m,
    transitionDuration: `${E}s`,
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
var ne = !1;
function se(e, t = () => {
}) {
  return (...n) => ne ? t(...n) : e(...n);
}
function Fs(e) {
  return (...t) => ne && e(...t);
}
var Hi = [];
function _t(e) {
  Hi.push(e);
}
function Ds(e, t) {
  Hi.forEach((n) => n(e, t)), ne = !0, Vi(() => {
    G(t, (n, i) => {
      i(n, () => {
      });
    });
  }), ne = !1;
}
var Zt = !1;
function Ps(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ne = !0, Zt = !0, Vi(() => {
    zs(t);
  }), ne = !1, Zt = !1;
}
function zs(e) {
  let t = !1;
  G(e, (i, r) => {
    ge(i, (s, o) => {
      if (t && Is(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function Vi(e) {
  let t = ve;
  Rn((n, i) => {
    let r = t(n);
    return Se(r), () => {
    };
  }), e(), Rn(t);
}
function qi(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Ie({})), e._x_bindings[t] = n, t = i.includes("camel") ? Ks(t) : t, t) {
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
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = it(e.value) === t : e.checked = Fn(e.value, t));
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
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = wn(e, t);
}
function Ws(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = wt(e, t);
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
function it(e) {
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
function Zs(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Ui(e, t, n);
}
function Js(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, Ei(() => ue(e, r.expression));
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
function Zi(e, t) {
  var n;
  return function() {
    var i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function Ji(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function Xi({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = ve(() => {
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
    Se(o);
  };
}
function Rt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Xs(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Ke));
}
var ae = {}, Dn = !1;
function Qs(e, t) {
  if (Dn || (ae = Ie(ae), Dn = !0), t === void 0)
    return ae[e];
  ae[e] = t, yi(ae[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ae[e].init();
}
function eo() {
  return ae;
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
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Ti(r);
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
    return Ie;
  },
  get release() {
    return Se;
  },
  get effect() {
    return ve;
  },
  get raw() {
    return ci;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: ls,
  dontAutoEvaluateFunctions: Ei,
  disableEffectScheduling: ts,
  startObservingMutations: dn,
  stopObservingMutations: bi,
  setReactivityEngine: ns,
  onAttributeRemoved: gi,
  onAttributesAdded: pi,
  closestDataStack: pe,
  skipDuringClone: se,
  onlyDuringClone: Fs,
  addRootSelector: Pi,
  addInitSelector: zi,
  interceptClone: _t,
  addScopeToNode: Ye,
  deferMutations: as,
  mapAttributes: bn,
  evaluateLater: k,
  interceptInit: Ss,
  setEvaluator: hs,
  mergeProxies: Te,
  extractProp: Js,
  findClosest: Oe,
  onElRemoved: cn,
  closestRoot: xt,
  destroyTree: Ae,
  interceptor: xi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Gt,
  // INTERNAL
  setStyles: wt,
  // INTERNAL
  mutateDom: A,
  directive: N,
  entangle: Xi,
  throttle: Ji,
  debounce: Zi,
  evaluate: ue,
  initTree: G,
  nextTick: xn,
  prefixed: Ce,
  prefix: bs,
  plugin: Xs,
  magic: H,
  store: Qs,
  start: Es,
  clone: Ps,
  // INTERNAL
  cloneNode: Ds,
  // INTERNAL
  bound: Zs,
  $data: vi,
  watch: ui,
  walk: ge,
  data: io,
  bind: to
}, Ke = so;
function oo(e, t) {
  let n = ao(e);
  if (typeof t == "function")
    return Si(n, t);
  let i = lo(e, t, n);
  return _i.bind(null, e, t, i);
}
function ao(e) {
  let t = {};
  return at(t, e), [t, ...pe(e)];
}
function lo(e, t, n) {
  return (i = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Te([r, ...n]), a = t.split(".").reduce(
      (l, c) => (l[c] === void 0 && co(e, t), l[c]),
      o
    );
    We(i, a, o, s);
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
var fo = Object.freeze({}), ho = Object.prototype.hasOwnProperty, Et = (e, t) => ho.call(e, t), fe = Array.isArray, Be = (e) => nr(e) === "[object Map]", po = (e) => typeof e == "string", En = (e) => typeof e == "symbol", It = (e) => e !== null && typeof e == "object", go = Object.prototype.toString, nr = (e) => go.call(e), ir = (e) => nr(e).slice(8, -1), In = (e) => po(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, mo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, bo = mo((e) => e.charAt(0).toUpperCase() + e.slice(1)), rr = (e, t) => e !== t && (e === e || t === t), Jt = /* @__PURE__ */ new WeakMap(), Re = [], Y, de = Symbol("iterate"), Xt = Symbol("Map key iterate");
function vo(e) {
  return e && e._isEffect === !0;
}
function yo(e, t = fo) {
  vo(e) && (e = e.raw);
  const n = _o(e, t);
  return t.lazy || n(), n;
}
function xo(e) {
  e.active && (sr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var wo = 0;
function _o(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Re.includes(n)) {
      sr(n);
      try {
        return Io(), Re.push(n), Y = n, e();
      } finally {
        Re.pop(), or(), Y = Re[Re.length - 1];
      }
    }
  };
  return n.id = wo++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function sr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var _e = !0, Sn = [];
function Eo() {
  Sn.push(_e), _e = !1;
}
function Io() {
  Sn.push(_e), _e = !0;
}
function or() {
  const e = Sn.pop();
  _e = e === void 0 ? !0 : e;
}
function B(e, t, n) {
  if (!_e || Y === void 0)
    return;
  let i = Jt.get(e);
  i || Jt.set(e, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(Y) || (r.add(Y), Y.deps.push(r), Y.options.onTrack && Y.options.onTrack({
    effect: Y,
    target: e,
    type: t,
    key: n
  }));
}
function ie(e, t, n, i, r, s) {
  const o = Jt.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((f) => {
      (f !== Y || f.allowRecurse) && a.add(f);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (n === "length" && fe(e))
    o.forEach((u, f) => {
      (f === "length" || f >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), t) {
      case "add":
        fe(e) ? In(n) && l(o.get("length")) : (l(o.get(de)), Be(e) && l(o.get(Xt)));
        break;
      case "delete":
        fe(e) || (l(o.get(de)), Be(e) && l(o.get(Xt)));
        break;
      case "set":
        Be(e) && l(o.get(de));
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
var So = /* @__PURE__ */ uo("__proto__,__v_isRef,__isVue"), ar = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(En)), To = /* @__PURE__ */ lr(), Co = /* @__PURE__ */ lr(!0), Pn = /* @__PURE__ */ Oo();
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
    if (r === "__v_raw" && s === (e ? t ? Wo : dr : t ? jo : fr).get(i))
      return i;
    const o = fe(i);
    if (!e && o && Et(Pn, r))
      return Reflect.get(Pn, r, s);
    const a = Reflect.get(i, r, s);
    return (En(r) ? ar.has(r) : So(r)) || (e || B(i, "get", r), t) ? a : Qt(a) ? !o || !In(r) ? a.value : a : It(a) ? e ? hr(a) : An(a) : a;
  };
}
var Ao = /* @__PURE__ */ $o();
function $o(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = O(r), o = O(o), !fe(n) && Qt(o) && !Qt(r)))
      return o.value = r, !0;
    const a = fe(n) && In(i) ? Number(i) < n.length : Et(n, i), l = Reflect.set(n, i, r, s);
    return n === O(s) && (a ? rr(r, o) && ie(n, "set", i, r, o) : ie(n, "add", i, r)), l;
  };
}
function No(e, t) {
  const n = Et(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && ie(e, "delete", t, void 0, i), r;
}
function ko(e, t) {
  const n = Reflect.has(e, t);
  return (!En(t) || !ar.has(t)) && B(e, "has", t), n;
}
function Ro(e) {
  return B(e, "iterate", fe(e) ? "length" : de), Reflect.ownKeys(e);
}
var Lo = {
  get: To,
  set: Ao,
  deleteProperty: No,
  has: ko,
  ownKeys: Ro
}, Mo = {
  get: Co,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Tn = (e) => It(e) ? An(e) : e, Cn = (e) => It(e) ? hr(e) : e, On = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ge(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = O(e), s = O(t);
  t !== s && !n && B(r, "get", t), !n && B(r, "get", s);
  const { has: o } = St(r), a = i ? On : n ? Cn : Tn;
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
function Je(e, t = !1) {
  return e = e.__v_raw, !t && B(O(e), "iterate", de), Reflect.get(e, "size", e);
}
function zn(e) {
  e = O(e);
  const t = O(this);
  return St(t).has.call(t, e) || (t.add(e), ie(t, "add", e, e)), this;
}
function Bn(e, t) {
  t = O(t);
  const n = O(this), { has: i, get: r } = St(n);
  let s = i.call(n, e);
  s ? ur(n, i, e) : (e = O(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? rr(t, o) && ie(n, "set", e, t, o) : ie(n, "add", e, t), this;
}
function jn(e) {
  const t = O(this), { has: n, get: i } = St(t);
  let r = n.call(t, e);
  r ? ur(t, n, e) : (e = O(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && ie(t, "delete", e, void 0, s), o;
}
function Wn() {
  const e = O(this), t = e.size !== 0, n = Be(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && ie(e, "clear", void 0, void 0, n), i;
}
function Xe(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = O(o), l = t ? On : e ? Cn : Tn;
    return !e && B(a, "iterate", de), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function Qe(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = O(r), o = Be(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...i), u = n ? On : t ? Cn : Tn;
    return !t && B(s, "iterate", l ? Xt : de), {
      // iterator protocol
      next() {
        const { value: f, done: d } = c.next();
        return d ? { value: f, done: d } : {
          value: a ? [u(f[0]), u(f[1])] : u(f),
          done: d
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Q(e) {
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
      return Ge(this, s);
    },
    get size() {
      return Je(this);
    },
    has: Ze,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Xe(!1, !1)
  }, t = {
    get(s) {
      return Ge(this, s, !1, !0);
    },
    get size() {
      return Je(this);
    },
    has: Ze,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Xe(!1, !0)
  }, n = {
    get(s) {
      return Ge(this, s, !0);
    },
    get size() {
      return Je(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
    },
    add: Q(
      "add"
      /* ADD */
    ),
    set: Q(
      "set"
      /* SET */
    ),
    delete: Q(
      "delete"
      /* DELETE */
    ),
    clear: Q(
      "clear"
      /* CLEAR */
    ),
    forEach: Xe(!0, !1)
  }, i = {
    get(s) {
      return Ge(this, s, !0, !0);
    },
    get size() {
      return Je(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
    },
    add: Q(
      "add"
      /* ADD */
    ),
    set: Q(
      "set"
      /* SET */
    ),
    delete: Q(
      "delete"
      /* DELETE */
    ),
    clear: Q(
      "clear"
      /* CLEAR */
    ),
    forEach: Xe(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = Qe(s, !1, !1), n[s] = Qe(s, !0, !1), t[s] = Qe(s, !1, !0), i[s] = Qe(s, !0, !0);
  }), [
    e,
    n,
    t,
    i
  ];
}
var [Do, Po, tc, nc] = /* @__PURE__ */ Fo();
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
var fr = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ new WeakMap(), dr = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap();
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
  return e && e.__v_isReadonly ? e : pr(e, !1, Lo, zo, fr);
}
function hr(e) {
  return pr(e, !0, Mo, Bo, dr);
}
function pr(e, t, n, i, r) {
  if (!It(e))
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
H("nextTick", () => xn);
H("dispatch", (e) => ze.bind(ze, e));
H("watch", (e, { evaluateLater: t, cleanup: n }) => (i, r) => {
  let s = t(i), a = ui(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
H("store", eo);
H("data", (e) => vi(e));
H("root", (e) => xt(e));
H("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Te(qo(e))), e._x_refs_proxy));
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
    return s((f) => u = f), u;
  }, a = i(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, f = e._x_model.set, d = Xi(
      {
        get() {
          return u();
        },
        set(m) {
          f(m);
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
    r(d);
  });
});
N("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && P("x-teleport can only be used on a <template> tag", e);
  let r = Hn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Ye(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  A(() => {
    o(s, r, t), se(() => {
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
  let t = se(() => document.querySelector(e), () => Go)();
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
N("effect", se((e, { expression: t }, { effect: n }) => {
  n(k(e, t));
}));
function en(e, t, n, i) {
  let r = e, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (t = Zo(t)), n.includes("camel") && (t = Jo(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = ct(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Zi(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = ct(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Ji(s, c);
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
function Zo(e) {
  return e.replace(/-/g, ".");
}
function Jo(e) {
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
    let d;
    return o((m) => d = m), qn(d) ? d.get() : d;
  }, c = (d) => {
    let m;
    o((v) => m = v), qn(m) ? m.set(d) : a(() => {
    }, {
      scope: { __placeholder: d }
    });
  };
  typeof n == "string" && e.type === "radio" && A(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  var u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input";
  let f = ne ? () => {
  } : en(e, u, t, (d) => {
    c(Mt(e, t, d, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || _n(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Mt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = f, r(() => e._x_removeModelListeners.default()), e.form) {
    let d = en(e.form, "reset", [], (m) => {
      xn(() => e._x_model && e._x_model.set(Mt(e, t, { target: e }, l())));
    });
    r(() => d());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(d) {
      c(d);
    }
  }, e._x_forceModelUpdate = (d) => {
    d === void 0 && typeof n == "string" && n.match(/\./) && (d = ""), window.fromModel = !0, A(() => qi(e, "value", d)), delete window.fromModel;
  }, i(() => {
    let d = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(d);
  });
});
function Mt(e, t, n, i) {
  return A(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (_n(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = Ft(n.target.value) : t.includes("boolean") ? r = it(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ta(s, r));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ft(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return it(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return Gi(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? Ft(r) : t.includes("boolean") ? it(r) : t.includes("trim") ? r.trim() : r;
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
N("cloak", (e) => queueMicrotask(() => A(() => e.removeAttribute(Ce("cloak")))));
zi(() => `[${Ce("init")}]`);
N("init", se((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
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
bn(Ai(":", $i(Ce("bind:"))));
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
Pi(() => `[${Ce("data")}]`);
N("data", (e, { expression: t }, { cleanup: n }) => {
  if (ra(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  at(i, e);
  let r = {};
  ro(r, i);
  let s = ue(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), at(s, e);
  let o = Ie(s);
  yi(o);
  let a = Ye(e, o);
  o.init && ue(e, o.init), n(() => {
    o.destroy && ue(e, o.destroy), a();
  });
});
_t((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ra(e) {
  return ne ? Zt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
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
    (f) => f ? o() : s(),
    (f) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, f, o, s) : f ? a() : s();
    }
  ), c, u = !0;
  i(() => r((f) => {
    !u && f === c || (t.includes("immediate") && (f ? a() : s()), l(f), c = f, u = !1);
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
      o = Object.entries(o).map(([h, b]) => {
        let x = Yn(t, b, h, o);
        i((_) => {
          u.includes(_) && P("Duplicate key on x-for", e), u.push(_);
        }, { scope: { index: h, ...x } }), c.push(x);
      });
    else
      for (let h = 0; h < o.length; h++) {
        let b = Yn(t, o[h], h, o);
        i((x) => {
          u.includes(x) && P("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: h, ...b } }), c.push(b);
      }
    let f = [], d = [], m = [], v = [];
    for (let h = 0; h < l.length; h++) {
      let b = l[h];
      u.indexOf(b) === -1 && m.push(b);
    }
    l = l.filter((h) => !m.includes(h));
    let E = "template";
    for (let h = 0; h < u.length; h++) {
      let b = u[h], x = l.indexOf(b);
      if (x === -1)
        l.splice(h, 0, b), f.push([E, h]);
      else if (x !== h) {
        let _ = l.splice(h, 1)[0], S = l.splice(x - 1, 1)[0];
        l.splice(h, 0, S), l.splice(x, 0, _), d.push([_, S]);
      } else
        v.push(b);
      E = b;
    }
    for (let h = 0; h < m.length; h++) {
      let b = m[h];
      b in a && (A(() => {
        Ae(a[b]), a[b].remove();
      }), delete a[b]);
    }
    for (let h = 0; h < d.length; h++) {
      let [b, x] = d[h], _ = a[b], S = a[x], y = document.createElement("div");
      A(() => {
        S || P('x-for ":key" is undefined or invalid', s, x, a), S.after(y), _.after(S), S._x_currentIfEl && S.after(S._x_currentIfEl), y.before(_), _._x_currentIfEl && _.after(_._x_currentIfEl), y.remove();
      }), S._x_refreshXForScope(c[u.indexOf(x)]);
    }
    for (let h = 0; h < f.length; h++) {
      let [b, x] = f[h], _ = b === "template" ? s : a[b];
      _._x_currentIfEl && (_ = _._x_currentIfEl);
      let S = c[x], y = u[x], p = document.importNode(s.content, !0).firstElementChild, g = Ie(S);
      Ye(p, g, s), p._x_refreshXForScope = (w) => {
        Object.entries(w).forEach(([T, I]) => {
          g[T] = I;
        });
      }, A(() => {
        _.after(p), se(() => G(p))();
      }), typeof y == "object" && P("x-for key cannot be an object, it must be a string or an integer", s), a[y] = p;
    }
    for (let h = 0; h < v.length; h++)
      a[v[h]]._x_refreshXForScope(c[u.indexOf(v[h])]);
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
function xr() {
}
xr.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = xt(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
N("ref", xr);
N("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && P("x-if can only be used on a <template> tag", e);
  let r = k(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Ye(a, {}, e), A(() => {
      e.after(a), se(() => G(a))();
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
bn(Ai("@", $i(Ce("on:"))));
N("on", se((e, { value: t, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? k(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = en(e, t, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Tt("Collapse", "collapse", "collapse");
Tt("Intersect", "intersect", "intersect");
Tt("Focus", "trap", "focus");
Tt("Mask", "mask", "mask");
function Tt(e, t, n) {
  N(t, (i) => P(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Ke.setEvaluator(oo);
Ke.setReactivityEngine({ reactive: An, effect: yo, release: xo, raw: O });
var la = Ke, ye = la;
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
      let f = e.setStyles(c, u);
      return u.height ? () => {
      } : f;
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
        let f = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let d = n.getBoundingClientRect().height;
        f === d && (f = s), e.transition(n, e.setStyles, {
          during: l,
          start: { height: f + "px" },
          end: { height: d + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - d) < 1 && (n.style.overflow = null);
        });
      },
      out(c = () => {
      }, u = () => {
      }) {
        let f = n.getBoundingClientRect().height;
        e.transition(n, a, {
          during: l,
          start: { height: f + "px" },
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
function fa(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: pa(r),
      threshold: da(r)
    }, c = new IntersectionObserver((u) => {
      u.forEach((f) => {
        f.isIntersecting !== (n === "leave") && (a(), r.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(t), o(() => {
      c.disconnect();
    });
  }));
}
function da(e) {
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
var ga = fa, wr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ut = /* @__PURE__ */ wr.join(","), _r = typeof Element > "u", me = _r ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, tn = !_r && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Er = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(ut));
  return n && me.call(t, ut) && r.unshift(t), r = r.filter(i), r;
}, Ir = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = me.call(o, ut);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var f = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), d = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (f && d) {
        var m = e(f === !0 ? o.children : f.children, !0, i);
        i.flatten ? r.push.apply(r, m) : r.push({
          scope: o,
          candidates: m
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Sr = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, ma = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, Tr = function(t) {
  return t.tagName === "INPUT";
}, ba = function(t) {
  return Tr(t) && t.type === "hidden";
}, va = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, ya = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, xa = function(t) {
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
}, wa = function(t) {
  return Tr(t) && t.type === "radio";
}, _a = function(t) {
  return wa(t) && !xa(t);
}, Un = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Ea = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = me.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (me.call(o, "details:not([open]) *"))
    return !0;
  var a = tn(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, f = tn(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return Un(t);
        t.assignedSlot ? t = t.assignedSlot : !u && f !== t.ownerDocument ? t = f.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return Un(t);
  return !1;
}, Ia = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return me.call(n, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, ft = function(t, n) {
  return !(n.disabled || ba(n) || Ea(n, t) || // For a details element with a summary, the summary element gets the focus
  va(n) || Ia(n));
}, nn = function(t, n) {
  return !(_a(n) || Sr(n) < 0 || !ft(t, n));
}, Sa = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Ta = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Sr(a, o), c = o ? e(r.candidates) : a;
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
}, Ca = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Ir([t], n.includeContainer, {
    filter: nn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Sa
  }) : i = Er(t, n.includeContainer, nn.bind(null, n)), Ta(i);
}, Cr = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Ir([t], n.includeContainer, {
    filter: ft.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Er(t, n.includeContainer, ft.bind(null, n)), i;
}, et = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return me.call(t, ut) === !1 ? !1 : nn(n, t);
}, Oa = /* @__PURE__ */ wr.concat("iframe").join(","), rt = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return me.call(t, Oa) === !1 ? !1 : ft(n, t);
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
function Zn(e) {
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
var Jn = /* @__PURE__ */ function() {
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
}, tt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Ra = function(t, n) {
  var i = n?.document || document, r = Zn({
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
  }, o, a = function(p, g, w) {
    return p && p[g] !== void 0 ? p[g] : r[w || g];
  }, l = function(p) {
    return s.containerGroups.findIndex(function(g) {
      var w = g.container, T = g.tabbableNodes;
      return w.contains(p) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(I) {
        return I === p;
      });
    });
  }, c = function(p) {
    var g = r[p];
    if (typeof g == "function") {
      for (var w = arguments.length, T = new Array(w > 1 ? w - 1 : 0), I = 1; I < w; I++)
        T[I - 1] = arguments[I];
      g = g.apply(void 0, T);
    }
    if (g === !0 && (g = void 0), !g) {
      if (g === void 0 || g === !1)
        return g;
      throw new Error("`".concat(p, "` was specified but was not a node, or did not return a node"));
    }
    var $ = g;
    if (typeof g == "string" && ($ = i.querySelector(g), !$))
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
        var g = s.tabbableGroups[0], w = g && g.firstTabbableNode;
        p = w || c("fallbackFocus");
      }
    if (!p)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return p;
  }, f = function() {
    if (s.containerGroups = s.containers.map(function(p) {
      var g = Ca(p, r.tabbableOptions), w = Cr(p, r.tabbableOptions);
      return {
        container: p,
        tabbableNodes: g,
        focusableNodes: w,
        firstTabbableNode: g.length > 0 ? g[0] : null,
        lastTabbableNode: g.length > 0 ? g[g.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(I) {
          var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, R = w.findIndex(function(L) {
            return L === I;
          });
          if (!(R < 0))
            return $ ? w.slice(R + 1).find(function(L) {
              return et(L, r.tabbableOptions);
            }) : w.slice(0, R).reverse().find(function(L) {
              return et(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(p) {
      return p.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, d = function y(p) {
    if (p !== !1 && p !== i.activeElement) {
      if (!p || !p.focus) {
        y(u());
        return;
      }
      p.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = p, $a(p) && p.select();
    }
  }, m = function(p) {
    var g = c("setReturnFocus", p);
    return g || (g === !1 ? !1 : p);
  }, v = function(p) {
    var g = tt(p);
    if (!(l(g) >= 0)) {
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
          returnFocus: r.returnFocusOnDeactivate && !rt(g, r.tabbableOptions)
        });
        return;
      }
      Le(r.allowOutsideClick, p) || p.preventDefault();
    }
  }, E = function(p) {
    var g = tt(p), w = l(g) >= 0;
    w || g instanceof Document ? w && (s.mostRecentlyFocusedNode = g) : (p.stopImmediatePropagation(), d(s.mostRecentlyFocusedNode || u()));
  }, h = function(p) {
    var g = tt(p);
    f();
    var w = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(g), I = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        p.shiftKey ? w = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : w = s.tabbableGroups[0].firstTabbableNode;
      else if (p.shiftKey) {
        var $ = Qn(s.tabbableGroups, function(z) {
          var D = z.firstTabbableNode;
          return g === D;
        });
        if ($ < 0 && (I.container === g || rt(g, r.tabbableOptions) && !et(g, r.tabbableOptions) && !I.nextTabbableNode(g, !1)) && ($ = T), $ >= 0) {
          var R = $ === 0 ? s.tabbableGroups.length - 1 : $ - 1, L = s.tabbableGroups[R];
          w = L.lastTabbableNode;
        }
      } else {
        var V = Qn(s.tabbableGroups, function(z) {
          var D = z.lastTabbableNode;
          return g === D;
        });
        if (V < 0 && (I.container === g || rt(g, r.tabbableOptions) && !et(g, r.tabbableOptions) && !I.nextTabbableNode(g)) && (V = T), V >= 0) {
          var F = V === s.tabbableGroups.length - 1 ? 0 : V + 1, oe = s.tabbableGroups[F];
          w = oe.firstTabbableNode;
        }
      }
    } else
      w = c("fallbackFocus");
    w && (p.preventDefault(), d(w));
  }, b = function(p) {
    if (Na(p) && Le(r.escapeDeactivates, p) !== !1) {
      p.preventDefault(), o.deactivate();
      return;
    }
    if (ka(p)) {
      h(p);
      return;
    }
  }, x = function(p) {
    var g = tt(p);
    l(g) >= 0 || Le(r.clickOutsideDeactivates, p) || Le(r.allowOutsideClick, p) || (p.preventDefault(), p.stopImmediatePropagation());
  }, _ = function() {
    if (s.active)
      return Jn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? Xn(function() {
        d(u());
      }) : d(u()), i.addEventListener("focusin", E, !0), i.addEventListener("mousedown", v, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", v, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", x, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", b, {
        capture: !0,
        passive: !1
      }), o;
  }, S = function() {
    if (s.active)
      return i.removeEventListener("focusin", E, !0), i.removeEventListener("mousedown", v, !0), i.removeEventListener("touchstart", v, !0), i.removeEventListener("click", x, !0), i.removeEventListener("keydown", b, !0), o;
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
      var g = a(p, "onActivate"), w = a(p, "onPostActivate"), T = a(p, "checkCanFocusTrap");
      T || f(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, g && g();
      var I = function() {
        T && f(), _(), w && w();
      };
      return T ? (T(s.containers.concat()).then(I, I), this) : (I(), this);
    },
    deactivate: function(p) {
      if (!s.active)
        return this;
      var g = Zn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, p);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, S(), s.active = !1, s.paused = !1, Jn.deactivateTrap(o);
      var w = a(g, "onDeactivate"), T = a(g, "onPostDeactivate"), I = a(g, "checkCanReturnFocus"), $ = a(g, "returnFocus", "returnFocusOnDeactivate");
      w && w();
      var R = function() {
        Xn(function() {
          $ && d(m(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return $ && I ? (I(m(s.nodeFocusedBeforeActivation)).then(R, R), this) : (R(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, S(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, f(), _(), this);
    },
    updateContainerElements: function(p) {
      var g = [].concat(p).filter(Boolean);
      return s.containers = g.map(function(w) {
        return typeof w == "string" ? i.querySelector(w) : w;
      }), s.active && f(), this;
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
        return rt(s);
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
        return Array.isArray(r) ? r : Cr(r, { displayCheck: "none" });
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
      let c = a(r), u = !1, f = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => i
      };
      if (s.includes("noautofocus"))
        f.initialFocus = !1;
      else {
        let h = i.querySelector("[autofocus]");
        h && (f.initialFocus = h);
      }
      let d = Ra(i, f), m = () => {
      }, v = () => {
      };
      const E = () => {
        m(), m = () => {
        }, v(), v = () => {
        }, d.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((h) => {
        u !== h && (h && !u && (s.includes("noscroll") && (v = Ma()), s.includes("inert") && (m = ei(i)), setTimeout(() => {
          d.activate();
        }, 15)), !h && u && E(), u = !!h);
      })), l(E);
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
var Ba = Object.defineProperty, Z = function(e, t) {
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
`, Ya = Z(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Me = Z(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), C = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, ee = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ti = { OUTLINE: "outline", FILLED: "filled" }, Dt = { FADE: "fade", SLIDE: "slide" }, Fe = { CLOSE: Me(ja), SUCCESS: Me(Va), ERROR: Me(Wa), WARNING: Me(qa), INFO: Me(Ha) }, ni = Z(function(e) {
  e.wrapper.classList.add(C.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ii = Z(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Ka = Z(function(e) {
  e.wrapper.classList.add(C.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Ua = Z(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Ar = function() {
  function e(t) {
    var n = this;
    Da(this, e), this.notifyOut = Z(function(z) {
      z(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? Dt.FADE : c, f = t.type, d = f === void 0 ? "outline" : f, m = t.title, v = t.text, E = t.showIcon, h = E === void 0 ? !0 : E, b = t.customIcon, x = b === void 0 ? "" : b, _ = t.customClass, S = _ === void 0 ? "" : _, y = t.speed, p = y === void 0 ? 500 : y, g = t.showCloseButton, w = g === void 0 ? !0 : g, T = t.autoclose, I = T === void 0 ? !0 : T, $ = t.autotimeout, R = $ === void 0 ? 3e3 : $, L = t.position, V = L === void 0 ? "right top" : L, F = t.customWrapper, oe = F === void 0 ? "" : F;
    if (this.customWrapper = oe, this.status = l, this.title = m, this.text = v, this.showIcon = h, this.customIcon = x, this.customClass = S, this.speed = p, this.effect = u, this.showCloseButton = w, this.autoclose = I, this.autotimeout = R, this.notificationsGap = r, this.notificationsPadding = o, this.type = d, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return za(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(C.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(C.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](C.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](C.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](C.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](C.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](C.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](C.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](C.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(C.NOTIFY_CLOSE), i.innerHTML = Fe.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Ya(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(C.NOTIFY), this.type) {
      case ti.OUTLINE:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
        break;
      case ti.FILLED:
        this.wrapper.classList.add(C.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case ee.SUCCESS:
        this.wrapper.classList.add(C.NOTIFY_SUCCESS);
        break;
      case ee.ERROR:
        this.wrapper.classList.add(C.NOTIFY_ERROR);
        break;
      case ee.WARNING:
        this.wrapper.classList.add(C.NOTIFY_WARNING);
        break;
      case ee.INFO:
        this.wrapper.classList.add(C.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(C.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(C.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(C.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(C.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = Z(function(r) {
      switch (r) {
        case ee.SUCCESS:
          return Fe.SUCCESS;
        case ee.ERROR:
          return Fe.ERROR;
        case ee.WARNING:
          return Fe.WARNING;
        case ee.INFO:
          return Fe.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(C.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
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
Z(Ar, "Notify");
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
}, He = {}, dt = {}, Ve = {};
function Za(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let i = e.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || t(n);
  }; i--; ) {
    if (o = e[i], a = dt[o], a) {
      s(o, a);
      continue;
    }
    l = Ve[o] = Ve[o] || [], l.push(s);
  }
}
function Lr(e, t) {
  if (!e) return;
  const n = Ve[e];
  if (dt[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function sn(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || rn)(t) : (e.success || rn)(e);
}
function Ja(e, t, n, i, r, s, o, a) {
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
  let u, f, d;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    d = r.createElement("link"), d.rel = "stylesheet", d.href = c, u = "hideFocus" in d, u && d.relList && (u = 0, d.rel = "preload", d.as = "style"), n.inlineStyleNonce && d.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    d = r.createElement("img"), d.src = c;
  else if (d = r.createElement("script"), d.src = c, d.async = s === void 0 ? !0 : s, n.inlineScriptNonce && d.setAttribute("nonce", n.inlineScriptNonce), f = "noModule" in d, /^module!/.test(l)) {
    if (!f) return t(e, "l");
    d.type = "module";
  } else if (/^nomodule!/.test(l) && f)
    return t(e, "l");
  const m = function(v) {
    Ja(v, e, d, t, n, i, o, u);
  };
  d.addEventListener("load", m, { once: !0 }), d.addEventListener("error", m, { once: !0 }), a(e, d) !== !1 && r.head.appendChild(d);
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
function te(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in He)
      throw "LoadJS";
    He[i] = !0;
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
te.ready = function(t, n) {
  return Za(t, function(i) {
    sn(n, i);
  }), te;
};
te.done = function(t) {
  Lr(t, []);
};
te.reset = function() {
  Object.keys(He).forEach((t) => delete He[t]), Object.keys(dt).forEach((t) => delete dt[t]), Object.keys(Ve).forEach((t) => delete Ve[t]);
};
te.isDefined = function(t) {
  return t in He;
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
function rl(e) {
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
function sl(e, t) {
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
function ol(e) {
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
function al(e, t) {
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
const on = Math.min, xe = Math.max, ht = Math.round, K = (e) => ({
  x: e,
  y: e
}), ll = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, cl = {
  start: "end",
  end: "start"
};
function ri(e, t, n) {
  return xe(e, on(t, n));
}
function Ct(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function be(e) {
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
function he(e) {
  return ["top", "bottom"].includes(be(e)) ? "y" : "x";
}
function Pr(e) {
  return Fr(he(e));
}
function ul(e, t, n) {
  n === void 0 && (n = !1);
  const i = Ot(e), r = Pr(e), s = Dr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = pt(o)), [o, pt(o)];
}
function fl(e) {
  const t = pt(e);
  return [an(e), t, an(t)];
}
function an(e) {
  return e.replace(/start|end/g, (t) => cl[t]);
}
function dl(e, t, n) {
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
function hl(e, t, n, i) {
  const r = Ot(e);
  let s = dl(be(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(an)))), s;
}
function pt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => ll[t]);
}
function pl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function gl(e) {
  return typeof e != "number" ? pl(e) : {
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
  const s = he(t), o = Pr(t), a = Dr(o), l = be(t), c = s === "y", u = i.x + i.width / 2 - r.width / 2, f = i.y + i.height / 2 - r.height / 2, d = i[a] / 2 - r[a] / 2;
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
        y: f
      };
      break;
    case "left":
      m = {
        x: i.x - r.width,
        y: f
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
      m[o] -= d * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += d * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const ml = async (e, t, n) => {
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
    y: f
  } = si(c, i, l), d = i, m = {}, v = 0;
  for (let E = 0; E < a.length; E++) {
    const {
      name: h,
      fn: b
    } = a[E], {
      x,
      y: _,
      data: S,
      reset: y
    } = await b({
      x: u,
      y: f,
      initialPlacement: i,
      placement: d,
      strategy: r,
      middlewareData: m,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = x ?? u, f = _ ?? f, m = {
      ...m,
      [h]: {
        ...m[h],
        ...S
      }
    }, y && v <= 50 && (v++, typeof y == "object" && (y.placement && (d = y.placement), y.rects && (c = y.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : y.rects), {
      x: u,
      y: f
    } = si(c, d, l)), E = -1);
  }
  return {
    x: u,
    y: f,
    placement: d,
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
    elementContext: f = "floating",
    altBoundary: d = !1,
    padding: m = 0
  } = Ct(t, e), v = gl(m), h = a[d ? f === "floating" ? "reference" : "floating" : f], b = gt(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(h))) == null || n ? h : h.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), x = f === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, _ = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), S = await (s.isElement == null ? void 0 : s.isElement(_)) ? await (s.getScale == null ? void 0 : s.getScale(_)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, y = gt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: x,
    offsetParent: _,
    strategy: l
  }) : x);
  return {
    top: (b.top - y.top + v.top) / S.y,
    bottom: (y.bottom - b.bottom + v.bottom) / S.y,
    left: (b.left - y.left + v.left) / S.x,
    right: (y.right - b.right + v.right) / S.x
  };
}
const bl = function(e) {
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
        crossAxis: f = !0,
        fallbackPlacements: d,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: E = !0,
        ...h
      } = Ct(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const b = be(r), x = he(a), _ = be(a) === a, S = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), y = d || (_ || !E ? [pt(a)] : fl(a)), p = v !== "none";
      !d && p && y.push(...hl(a, E, v, S));
      const g = [a, ...y], w = await zr(t, h), T = [];
      let I = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && T.push(w[b]), f) {
        const F = ul(r, o, S);
        T.push(w[F[0]], w[F[1]]);
      }
      if (I = [...I, {
        placement: r,
        overflows: T
      }], !T.every((F) => F <= 0)) {
        var $, R;
        const F = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, oe = g[F];
        if (oe) {
          var L;
          const D = f === "alignment" ? x !== he(oe) : !1, q = ((L = I[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!D || q)
            return {
              data: {
                index: F,
                overflows: I
              },
              reset: {
                placement: oe
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
                  const X = he(q.placement);
                  return X === x || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  X === "y";
                }
                return !0;
              }).map((q) => [q.placement, q.overflows.filter((X) => X > 0).reduce((X, Gr) => X + Gr, 0)]).sort((q, X) => q[1] - X[1])[0]) == null ? void 0 : V[0];
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
async function vl(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = be(n), a = Ot(n), l = he(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, f = Ct(t, e);
  let {
    mainAxis: d,
    crossAxis: m,
    alignmentAxis: v
  } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: f.mainAxis || 0,
    crossAxis: f.crossAxis || 0,
    alignmentAxis: f.alignmentAxis
  };
  return a && typeof v == "number" && (m = a === "end" ? v * -1 : v), l ? {
    x: m * u,
    y: d * c
  } : {
    x: d * c,
    y: m * u
  };
}
const yl = function(e) {
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
      } = t, l = await vl(t, e);
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
}, xl = function(e) {
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
              x: b,
              y: x
            } = h;
            return {
              x: b,
              y: x
            };
          }
        },
        ...l
      } = Ct(e, t), c = {
        x: n,
        y: i
      }, u = await zr(t, l), f = he(be(r)), d = Fr(f);
      let m = c[d], v = c[f];
      if (s) {
        const h = d === "y" ? "top" : "left", b = d === "y" ? "bottom" : "right", x = m + u[h], _ = m - u[b];
        m = ri(x, m, _);
      }
      if (o) {
        const h = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", x = v + u[h], _ = v - u[b];
        v = ri(x, v, _);
      }
      const E = a.fn({
        ...t,
        [d]: m,
        [f]: v
      });
      return {
        ...E,
        data: {
          x: E.x - n,
          y: E.y - i,
          enabled: {
            [d]: s,
            [f]: o
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
function J(e) {
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
function Ue(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function wl(e) {
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
function _l(e) {
  let t = re(e);
  for (; U(t) && !Ee(t); ) {
    if ($n(t))
      return t;
    if ($t(t))
      return null;
    t = re(t);
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
function re(e) {
  if ($e(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    oi(e) && e.host || // Fallback.
    J(e)
  );
  return oi(t) ? t.host : t;
}
function jr(e) {
  const t = re(e);
  return Ee(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : U(t) && Ue(t) ? t : jr(t);
}
function Wr(e, t, n) {
  var i;
  t === void 0 && (t = []);
  const r = jr(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = M(r);
  return s ? (ln(o), t.concat(o, o.visualViewport || [], Ue(r) ? r : [], [])) : t.concat(r, Wr(r, []));
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
function we(e) {
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
const El = /* @__PURE__ */ K(0);
function qr(e) {
  const t = M(e);
  return !Nn() || !t.visualViewport ? El : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Il(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== M(e) ? !1 : t;
}
function qe(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = Vr(e);
  let o = K(1);
  t && (i ? j(i) && (o = we(i)) : o = we(e));
  const a = Il(s, n, i) ? qr(s) : K(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, f = r.height / o.y;
  if (s) {
    const d = M(s), m = i && j(i) ? M(i) : i;
    let v = d, E = ln(v);
    for (; E && i && m !== v; ) {
      const h = we(E), b = E.getBoundingClientRect(), x = W(E), _ = b.left + (E.clientLeft + parseFloat(x.paddingLeft)) * h.x, S = b.top + (E.clientTop + parseFloat(x.paddingTop)) * h.y;
      l *= h.x, c *= h.y, u *= h.x, f *= h.y, l += _, c += S, v = M(E), E = ln(v);
    }
  }
  return gt({
    width: u,
    height: f,
    x: l,
    y: c
  });
}
function kn(e, t) {
  const n = Nt(e).scrollLeft;
  return t ? t.left + n : qe(J(e)).left + n;
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
function Sl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = J(i), a = t ? $t(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), f = U(i);
  if ((f || !f && !s) && (($e(i) !== "body" || Ue(o)) && (l = Nt(i)), U(i))) {
    const m = qe(i);
    c = we(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const d = o && !f && !s ? Yr(o, l, !0) : K(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + d.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + d.y
  };
}
function Tl(e) {
  return Array.from(e.getClientRects());
}
function Cl(e) {
  const t = J(e), n = Nt(e), i = e.ownerDocument.body, r = xe(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = xe(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + kn(e);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += xe(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function Ol(e, t) {
  const n = M(e), i = J(e), r = n.visualViewport;
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
function Al(e, t) {
  const n = qe(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = U(e) ? we(e) : K(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = i * s.y;
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
    i = Ol(e, n);
  else if (t === "document")
    i = Cl(J(e));
  else if (j(t))
    i = Al(t, n);
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
  const n = re(e);
  return n === t || !j(n) || Ee(n) ? !1 : W(n).position === "fixed" || Kr(n, t);
}
function $l(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = Wr(e, []).filter((a) => j(a) && $e(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? re(e) : e;
  for (; j(o) && !Ee(o); ) {
    const a = W(o), l = $n(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ue(o) && !l && Kr(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = re(o);
  }
  return t.set(e, i), i;
}
function Nl(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? $t(t) ? [] : $l(t, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const f = ai(t, u, r);
    return c.top = xe(f.top, c.top), c.right = on(f.right, c.right), c.bottom = on(f.bottom, c.bottom), c.left = xe(f.left, c.left), c;
  }, ai(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function kl(e) {
  const {
    width: t,
    height: n
  } = Hr(e);
  return {
    width: t,
    height: n
  };
}
function Rl(e, t, n) {
  const i = U(t), r = J(t), s = n === "fixed", o = qe(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = kn(r);
  }
  if (i || !i && !s)
    if (($e(t) !== "body" || Ue(r)) && (a = Nt(t)), i) {
      const m = qe(t, !0, s, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Yr(r, a) : K(0), f = o.left + a.scrollLeft - l.x - u.x, d = o.top + a.scrollTop - l.y - u.y;
  return {
    x: f,
    y: d,
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
  return J(e) === n && (n = n.ownerDocument.body), n;
}
function Ur(e, t) {
  const n = M(e);
  if ($t(e))
    return n;
  if (!U(e)) {
    let r = re(e);
    for (; r && !Ee(r); ) {
      if (j(r) && !Pt(r))
        return r;
      r = re(r);
    }
    return n;
  }
  let i = li(e, t);
  for (; i && wl(i) && Pt(i); )
    i = li(i, t);
  return i && Ee(i) && Pt(i) && !$n(i) ? n : i || _l(e) || n;
}
const Ll = async function(e) {
  const t = this.getOffsetParent || Ur, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: Rl(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Ml(e) {
  return W(e).direction === "rtl";
}
const Fl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Sl,
  getDocumentElement: J,
  getClippingRect: Nl,
  getOffsetParent: Ur,
  getElementRects: Ll,
  getClientRects: Tl,
  getDimensions: kl,
  getScale: we,
  isElement: j,
  isRTL: Ml
}, mt = yl, bt = xl, vt = bl, yt = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Fl,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return ml(e, t, {
    ...r,
    platform: s
  });
};
function Dl(e) {
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
      !this.triggerEl || !this.contentEl || yt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [mt(this.pixelOffset), vt(), bt({ padding: 8 })]
      }).then(({ x: t, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${t}px`, top: `${n}px` });
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
      const n = this.menuItems.indexOf(t);
      n !== -1 && (this.focusedIndex = n, t.focus());
    },
    handleItemClick(t) {
      const n = t.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          e.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.open = !1, this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(t) {
      const n = t.currentTarget;
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
        e.$data(n)?.closeSubmenu();
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
          const n = this.$refs.subContent;
          this.updatePosition(n), this.menuItems = Array.from(n.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open") : (this.focusedIndex = null, this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.$nextTick(() => {
          this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]') || (this.parentDropdown.isSubmenuActive = !1);
        }));
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
      const t = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      t && Array.from(t).some((i) => e.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(t = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, t && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
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
function Pl(e) {
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
function zl(e) {
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
function Bl(e) {
  e.data("rzEmpty", () => {
  });
}
function jl(e) {
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
function Wl(e) {
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
function Hl(e, t) {
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
function Vl(e) {
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
function ql(e, t) {
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
function Yl(e) {
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
      const t = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || 0, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(mt({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(vt()), a && c.push(bt({ padding: l })), yt(this.triggerEl, this.contentEl, {
        placement: t,
        strategy: s,
        middleware: c
      }).then(({ x: u, y: f }) => {
        Object.assign(this.contentEl.style, {
          left: `${u}px`,
          top: `${f}px`
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
function Kl(e) {
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
function Ul(e) {
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
function Gl(e) {
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
function Zl(e) {
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
function Jl(e) {
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
      this.open = t !== null ? t === "true" : n, this.checkIfMobile(), window.addEventListener("resize", () => this.checkIfMobile()), window.addEventListener("keydown", (i) => {
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
async function Xl(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function st(e, t, n) {
  Xl(e).then((i) => {
    te.isDefined(i) || te(
      e,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), te.ready([i], t);
  });
}
function Ql(e) {
  el(e), tl(e), nl(e), il(e), rl(e), sl(e, st), ol(e), al(e, st), Dl(e), Pl(e), zl(e), Bl(e), jl(e), Wl(e), Hl(e, st), ql(e), Vl(e), Yl(e), Kl(e), Ul(e), Gl(e), Zl(e), Jl(e);
}
ye.plugin(ua);
ye.plugin(ga);
ye.plugin(Fa);
Ql(ye);
const ec = {
  Alpine: ye,
  require: st,
  toast: Ga,
  $data: Qa
};
window.Alpine = ye;
window.Rizzy = { ...window.Rizzy || {}, ...ec };
ye.start();
export {
  ec as default
};
