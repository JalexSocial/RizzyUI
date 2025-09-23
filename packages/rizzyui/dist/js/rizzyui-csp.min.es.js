var ze = !1, Be = !1, ut = [], je = -1;
function Jr(t) {
  Zr(t);
}
function Zr(t) {
  ut.includes(t) || ut.push(t), Qr();
}
function Xr(t) {
  let e = ut.indexOf(t);
  e !== -1 && e > je && ut.splice(e, 1);
}
function Qr() {
  !Be && !ze && (ze = !0, queueMicrotask(ts));
}
function ts() {
  ze = !1, Be = !0;
  for (let t = 0; t < ut.length; t++)
    ut[t](), je = t;
  ut.length = 0, je = -1, Be = !1;
}
var It, yt, St, ci, We = !0;
function es(t) {
  We = !1, t(), We = !0;
}
function ns(t) {
  It = t.reactive, St = t.release, yt = (e) => t.effect(e, { scheduler: (n) => {
    We ? Jr(n) : n();
  } }), ci = t.raw;
}
function Rn(t) {
  yt = t;
}
function is(t) {
  let e = () => {
  };
  return [(i) => {
    let r = yt(i);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(r), e = () => {
      r !== void 0 && (t._x_effects.delete(r), St(r));
    }, r;
  }, () => {
    e();
  }];
}
function ui(t, e) {
  let n = !0, i, r = yt(() => {
    let s = t();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      e(s, i), i = s;
    }), n = !1;
  });
  return () => St(r);
}
var di = [], fi = [], hi = [];
function rs(t) {
  hi.push(t);
}
function cn(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, fi.push(e));
}
function pi(t) {
  di.push(t);
}
function gi(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function mi(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, i]) => {
    (e === void 0 || e.includes(n)) && (i.forEach((r) => r()), delete t._x_attributeCleanups[n]);
  });
}
function ss(t) {
  for (t._x_effects?.forEach(Xr); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var un = new MutationObserver(pn), dn = !1;
function fn() {
  un.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), dn = !0;
}
function bi() {
  os(), un.disconnect(), dn = !1;
}
var Nt = [];
function os() {
  let t = un.takeRecords();
  Nt.push(() => t.length > 0 && pn(t));
  let e = Nt.length;
  queueMicrotask(() => {
    if (Nt.length === e)
      for (; Nt.length > 0; )
        Nt.shift()();
  });
}
function A(t) {
  if (!dn)
    return t();
  bi();
  let e = t();
  return fn(), e;
}
var hn = !1, oe = [];
function as() {
  hn = !0;
}
function ls() {
  hn = !1, pn(oe), oe = [];
}
function pn(t) {
  if (hn) {
    oe = oe.concat(t);
    return;
  }
  let e = [], n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (let s = 0; s < t.length; s++)
    if (!t[s].target._x_ignoreMutationObserver && (t[s].type === "childList" && (t[s].removedNodes.forEach((o) => {
      o.nodeType === 1 && o._x_marker && n.add(o);
    }), t[s].addedNodes.forEach((o) => {
      if (o.nodeType === 1) {
        if (n.has(o)) {
          n.delete(o);
          return;
        }
        o._x_marker || e.push(o);
      }
    })), t[s].type === "attributes")) {
      let o = t[s].target, a = t[s].attributeName, l = t[s].oldValue, c = () => {
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
    e.some((o) => o.contains(s)) || fi.forEach((o) => o(s));
  for (let s of e)
    s.isConnected && hi.forEach((o) => o(s));
  e = null, n = null, i = null, r = null;
}
function vi(t) {
  return Ct(gt(t));
}
function Yt(t, e, n) {
  return t._x_dataStack = [e, ...gt(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((i) => i !== e);
  };
}
function gt(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? gt(t.host) : t.parentNode ? gt(t.parentNode) : [];
}
function Ct(t) {
  return new Proxy({ objects: t }, cs);
}
var cs = {
  ownKeys({ objects: t }) {
    return Array.from(
      new Set(t.flatMap((e) => Object.keys(e)))
    );
  },
  has({ objects: t }, e) {
    return e == Symbol.unscopables ? !1 : t.some(
      (n) => Object.prototype.hasOwnProperty.call(n, e) || Reflect.has(n, e)
    );
  },
  get({ objects: t }, e, n) {
    return e == "toJSON" ? us : Reflect.get(
      t.find(
        (i) => Reflect.has(i, e)
      ) || {},
      e,
      n
    );
  },
  set({ objects: t }, e, n, i) {
    const r = t.find(
      (o) => Object.prototype.hasOwnProperty.call(o, e)
    ) || t[t.length - 1], s = Object.getOwnPropertyDescriptor(r, e);
    return s?.set && s?.get ? s.set.call(i, n) || !0 : Reflect.set(r, e, n);
  }
};
function us() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function yi(t) {
  let e = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, n = (i, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = r === "" ? s : `${r}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[s] = o.initialize(t, l, s) : e(o) && o !== i && !(o instanceof Element) && n(o, l);
    });
  };
  return n(t);
}
function wi(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return t(this.initialValue, () => ds(i, r), (o) => He(i, r, o), r, s);
    }
  };
  return e(n), (i) => {
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
function ds(t, e) {
  return e.split(".").reduce((n, i) => n[i], t);
}
function He(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), He(t[e[0]], e.slice(1), n);
  }
}
var xi = {};
function H(t, e) {
  xi[t] = e;
}
function ae(t, e) {
  let n = fs(e);
  return Object.entries(xi).forEach(([i, r]) => {
    Object.defineProperty(t, `$${i}`, {
      get() {
        return r(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function fs(t) {
  let [e, n] = Oi(t), i = { interceptor: wi, ...e };
  return cn(t, n), i;
}
function _i(t, e, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    Wt(r, t, e);
  }
}
function Wt(t, e, n = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: n }
  ), console.warn(`Alpine Expression Error: ${t.message}

${n ? 'Expression: "' + n + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var ie = !0;
function Ei(t) {
  let e = ie;
  ie = !1;
  let n = t();
  return ie = e, n;
}
function dt(t, e, n = {}) {
  let i;
  return k(t, e)((r) => i = r, n), i;
}
function k(...t) {
  return Ii(...t);
}
var Ii = ps;
function hs(t) {
  Ii = t;
}
function ps(t, e) {
  let n = {};
  ae(n, t);
  let i = [n, ...gt(t)], r = typeof e == "function" ? Si(i, e) : ms(i, e, t);
  return _i.bind(null, t, e, r);
}
function Si(t, e) {
  return (n = () => {
  }, { scope: i = {}, params: r = [] } = {}) => {
    let s = e.apply(Ct([i, ...t]), r);
    Ht(n, s);
  };
}
var ke = {};
function gs(t, e) {
  if (ke[t])
    return ke[t];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, i = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, s = (() => {
    try {
      let o = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${i} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(o, "name", {
        value: `[Alpine] ${t}`
      }), o;
    } catch (o) {
      return Wt(o, e, t), Promise.resolve();
    }
  })();
  return ke[t] = s, s;
}
function ms(t, e, n) {
  let i = gs(e, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [] } = {}) => {
    i.result = void 0, i.finished = !1;
    let a = Ct([s, ...t]);
    if (typeof i == "function") {
      let l = i(i, a).catch((c) => Wt(c, n, e));
      i.finished ? (Ht(r, i.result, a, o, n), i.result = void 0) : l.then((c) => {
        Ht(r, c, a, o, n);
      }).catch((c) => Wt(c, n, e)).finally(() => i.result = void 0);
    }
  };
}
function Ht(t, e, n, i, r) {
  if (ie && typeof e == "function") {
    let s = e.apply(n, i);
    s instanceof Promise ? s.then((o) => Ht(t, o, n, i)).catch((o) => Wt(o, r, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
var gn = "x-";
function Tt(t = "") {
  return gn + t;
}
function bs(t) {
  gn = t;
}
var le = {};
function N(t, e) {
  return le[t] = e, {
    before(n) {
      if (!le[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const i = ct.indexOf(n);
      ct.splice(i >= 0 ? i : ct.indexOf("DEFAULT"), 0, t);
    }
  };
}
function vs(t) {
  return Object.keys(le).includes(t);
}
function mn(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Ci(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), e = e.concat(s);
  }
  let i = {};
  return e.map(Ni((s, o) => i[s] = o)).filter(Ri).map(xs(i, n)).sort(_s).map((s) => ws(t, s));
}
function Ci(t) {
  return Array.from(t).map(Ni()).filter((e) => !Ri(e));
}
var Ve = !1, Pt = /* @__PURE__ */ new Map(), Ti = Symbol();
function ys(t) {
  Ve = !0;
  let e = Symbol();
  Ti = e, Pt.set(e, []);
  let n = () => {
    for (; Pt.get(e).length; )
      Pt.get(e).shift()();
    Pt.delete(e);
  }, i = () => {
    Ve = !1, n();
  };
  t(n), i();
}
function Oi(t) {
  let e = [], n = (a) => e.push(a), [i, r] = is(t);
  return e.push(r), [{
    Alpine: Kt,
    effect: i,
    cleanup: n,
    evaluateLater: k.bind(k, t),
    evaluate: dt.bind(dt, t)
  }, () => e.forEach((a) => a())];
}
function ws(t, e) {
  let n = () => {
  }, i = le[e.type] || n, [r, s] = Oi(t);
  gi(t, e.original, s);
  let o = () => {
    t._x_ignore || t._x_ignoreSelf || (i.inline && i.inline(t, e, r), i = i.bind(i, t, e, r), Ve ? Pt.get(Ti).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Ai = (t, e) => ({ name: n, value: i }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: i }), $i = (t) => t;
function Ni(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: i, value: r } = ki.reduce((s, o) => o(s), { name: e, value: n });
    return i !== e && t(i, e), { name: i, value: r };
  };
}
var ki = [];
function bn(t) {
  ki.push(t);
}
function Ri({ name: t }) {
  return Li().test(t);
}
var Li = () => new RegExp(`^${gn}([^:^.]+)\\b`);
function xs(t, e) {
  return ({ name: n, value: i }) => {
    let r = n.match(Li()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = e || t[n] || n;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: i,
      original: a
    };
  };
}
var qe = "DEFAULT", ct = [
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
  qe,
  "teleport"
];
function _s(t, e) {
  let n = ct.indexOf(t.type) === -1 ? qe : t.type, i = ct.indexOf(e.type) === -1 ? qe : e.type;
  return ct.indexOf(n) - ct.indexOf(i);
}
function Bt(t, e, n = {}) {
  t.dispatchEvent(
    new CustomEvent(e, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0
    })
  );
}
function mt(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((r) => mt(r, e));
    return;
  }
  let n = !1;
  if (e(t, () => n = !0), n)
    return;
  let i = t.firstElementChild;
  for (; i; )
    mt(i, e), i = i.nextElementSibling;
}
function P(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var Ln = !1;
function Es() {
  Ln && P("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Ln = !0, document.body || P("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Bt(document, "alpine:init"), Bt(document, "alpine:initializing"), fn(), rs((e) => J(e, mt)), cn((e) => At(e)), pi((e, n) => {
    mn(e, n).forEach((i) => i());
  });
  let t = (e) => !we(e.parentElement, !0);
  Array.from(document.querySelectorAll(Di().join(","))).filter(t).forEach((e) => {
    J(e);
  }), Bt(document, "alpine:initialized"), setTimeout(() => {
    Ts();
  });
}
var vn = [], Mi = [];
function Fi() {
  return vn.map((t) => t());
}
function Di() {
  return vn.concat(Mi).map((t) => t());
}
function Pi(t) {
  vn.push(t);
}
function zi(t) {
  Mi.push(t);
}
function we(t, e = !1) {
  return Ot(t, (n) => {
    if ((e ? Di() : Fi()).some((r) => n.matches(r)))
      return !0;
  });
}
function Ot(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack && (t = t._x_teleportBack), !!t.parentElement)
      return Ot(t.parentElement, e);
  }
}
function Is(t) {
  return Fi().some((e) => t.matches(e));
}
var Bi = [];
function Ss(t) {
  Bi.push(t);
}
var Cs = 1;
function J(t, e = mt, n = () => {
}) {
  Ot(t, (i) => i._x_ignore) || ys(() => {
    e(t, (i, r) => {
      i._x_marker || (n(i, r), Bi.forEach((s) => s(i, r)), mn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Cs++), i._x_ignore && r());
    });
  });
}
function At(t, e = mt) {
  e(t, (n) => {
    ss(n), mi(n), delete n._x_marker;
  });
}
function Ts() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, i]) => {
    vs(n) || i.some((r) => {
      if (document.querySelector(r))
        return P(`found "${r}", but missing ${e} plugin`), !0;
    });
  });
}
var Ue = [], yn = !1;
function wn(t = () => {
}) {
  return queueMicrotask(() => {
    yn || setTimeout(() => {
      Ye();
    });
  }), new Promise((e) => {
    Ue.push(() => {
      t(), e();
    });
  });
}
function Ye() {
  for (yn = !1; Ue.length; )
    Ue.shift()();
}
function Os() {
  yn = !0;
}
function xn(t, e) {
  return Array.isArray(e) ? Mn(t, e.join(" ")) : typeof e == "object" && e !== null ? As(t, e) : typeof e == "function" ? xn(t, e()) : Mn(t, e);
}
function Mn(t, e) {
  let n = (r) => r.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), i = (r) => (t.classList.add(...r), () => {
    t.classList.remove(...r);
  });
  return e = e === !0 ? e = "" : e || "", i(n(e));
}
function As(t, e) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(e).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function xe(t, e) {
  return typeof e == "object" && e !== null ? $s(t, e) : Ns(t, e);
}
function $s(t, e) {
  let n = {};
  return Object.entries(e).forEach(([i, r]) => {
    n[i] = t.style[i], i.startsWith("--") || (i = ks(i)), t.style.setProperty(i, r);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    xe(t, n);
  };
}
function Ns(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function ks(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ke(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
N("transition", (t, { value: e, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Ls(t, n, e) : Rs(t, i, e));
});
function Rs(t, e, n) {
  ji(t, xn, ""), {
    enter: (r) => {
      t._x_transition.enter.during = r;
    },
    "enter-start": (r) => {
      t._x_transition.enter.start = r;
    },
    "enter-end": (r) => {
      t._x_transition.enter.end = r;
    },
    leave: (r) => {
      t._x_transition.leave.during = r;
    },
    "leave-start": (r) => {
      t._x_transition.leave.start = r;
    },
    "leave-end": (r) => {
      t._x_transition.leave.end = r;
    }
  }[n](e);
}
function Ls(t, e, n) {
  ji(t, xe);
  let i = !e.includes("in") && !e.includes("out") && !n, r = i || e.includes("in") || ["enter"].includes(n), s = i || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !i && (e = e.filter((g, x) => x < e.indexOf("out"))), e.includes("out") && !i && (e = e.filter((g, x) => x > e.indexOf("out")));
  let o = !e.includes("opacity") && !e.includes("scale"), a = o || e.includes("opacity"), l = o || e.includes("scale"), c = a ? 0 : 1, u = l ? kt(e, "scale", 95) / 100 : 1, d = kt(e, "delay", 0) / 1e3, f = kt(e, "origin", "center"), m = "opacity, transform", y = kt(e, "duration", 150) / 1e3, v = kt(e, "duration", 75) / 1e3, h = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (t._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${y}s`,
    transitionTimingFunction: h
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (t._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${v}s`,
    transitionTimingFunction: h
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function ji(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      Ge(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      Ge(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, i, r);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, n, i) {
  const r = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => r(n);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(n) : s() : t._x_transition ? t._x_transition.in(n) : s();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((o, a) => {
    t._x_transition.out(() => {
    }, () => o(i)), t._x_transitioning && t._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(i), queueMicrotask(() => {
    let o = Wi(t);
    o ? (o._x_hideChildren || (o._x_hideChildren = []), o._x_hideChildren.push(t)) : r(() => {
      let a = (l) => {
        let c = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(a)
        ]).then(([u]) => u?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, c;
      };
      a(t).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function Wi(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Wi(e);
}
function Ge(t, e, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Ms(t, {
    start() {
      a = e(t, i);
    },
    during() {
      l = e(t, n);
    },
    before: s,
    end() {
      a(), c = e(t, r);
    },
    after: o,
    cleanup() {
      l(), c();
    }
  });
}
function Ms(t, e) {
  let n, i, r, s = Ke(() => {
    A(() => {
      n = !0, i || e.before(), r || (e.end(), Ye()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Ke(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, A(() => {
    e.start(), e.during();
  }), Os(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), A(() => {
      e.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (A(() => {
        e.end();
      }), Ye(), setTimeout(t._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function kt(t, e, n) {
  if (t.indexOf(e) === -1)
    return n;
  const i = t[t.indexOf(e) + 1];
  if (!i || e === "scale" && isNaN(i))
    return n;
  if (e === "duration" || e === "delay") {
    let r = i.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  return e === "origin" && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [i, t[t.indexOf(e) + 2]].join(" ") : i;
}
var it = !1;
function ot(t, e = () => {
}) {
  return (...n) => it ? e(...n) : t(...n);
}
function Fs(t) {
  return (...e) => it && t(...e);
}
var Hi = [];
function _e(t) {
  Hi.push(t);
}
function Ds(t, e) {
  Hi.forEach((n) => n(t, e)), it = !0, Vi(() => {
    J(e, (n, i) => {
      i(n, () => {
      });
    });
  }), it = !1;
}
var Je = !1;
function Ps(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), it = !0, Je = !0, Vi(() => {
    zs(e);
  }), it = !1, Je = !1;
}
function zs(t) {
  let e = !1;
  J(t, (i, r) => {
    mt(i, (s, o) => {
      if (e && Is(s))
        return o();
      e = !0, r(s, o);
    });
  });
}
function Vi(t) {
  let e = yt;
  Rn((n, i) => {
    let r = e(n);
    return St(r), () => {
    };
  }), t(), Rn(e);
}
function qi(t, e, n, i = []) {
  switch (t._x_bindings || (t._x_bindings = It({})), t._x_bindings[e] = n, e = i.includes("camel") ? Ys(e) : e, e) {
    case "value":
      Bs(t, n);
      break;
    case "style":
      Ws(t, n);
      break;
    case "class":
      js(t, n);
      break;
    case "selected":
    case "checked":
      Hs(t, e, n);
      break;
    default:
      Ui(t, e, n);
      break;
  }
}
function Bs(t, e) {
  if (Gi(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = re(t.value) === e : t.checked = Fn(t.value, e));
  else if (_n(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => Fn(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    Us(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function js(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = xn(t, e);
}
function Ws(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = xe(t, e);
}
function Hs(t, e, n) {
  Ui(t, e, n), qs(t, e, n);
}
function Ui(t, e, n) {
  [null, void 0, !1].includes(n) && Gs(e) ? t.removeAttribute(e) : (Yi(e) && (n = e), Vs(t, e, n));
}
function Vs(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function qs(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function Us(t, e) {
  const n = [].concat(e).map((i) => i + "");
  Array.from(t.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Ys(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function Fn(t, e) {
  return t == e;
}
function re(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var Ks = /* @__PURE__ */ new Set([
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
function Yi(t) {
  return Ks.has(t);
}
function Gs(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function Js(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Ki(t, e, n);
}
function Zs(t, e, n, i = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let r = t._x_inlineBindings[e];
    return r.extract = i, Ei(() => dt(t, r.expression));
  }
  return Ki(t, e, n);
}
function Ki(t, e, n) {
  let i = t.getAttribute(e);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Yi(e) ? !![e, "true"].includes(i) : i;
}
function _n(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function Gi(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function Ji(t, e) {
  var n;
  return function() {
    var i = this, r = arguments, s = function() {
      n = null, t.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, e);
  };
}
function Zi(t, e) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (t.apply(i, r), n = !0, setTimeout(() => n = !1, e));
  };
}
function Xi({ get: t, set: e }, { get: n, set: i }) {
  let r = !0, s, o = yt(() => {
    let a = t(), l = n();
    if (r)
      i(Re(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(Re(a)) : c !== u && e(Re(l));
    }
    s = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    St(o);
  };
}
function Re(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Xs(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(Kt));
}
var lt = {}, Dn = !1;
function Qs(t, e) {
  if (Dn || (lt = It(lt), Dn = !0), e === void 0)
    return lt[t];
  lt[t] = e, yi(lt[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && lt[t].init();
}
function to() {
  return lt;
}
var Qi = {};
function eo(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? tr(t, n()) : (Qi[t] = n, () => {
  });
}
function no(t) {
  return Object.entries(Qi).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), t;
}
function tr(t, e, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(e).map(([o, a]) => ({ name: o, value: a })), s = Ci(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), mn(t, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var er = {};
function io(t, e) {
  er[t] = e;
}
function ro(t, e) {
  return Object.entries(er).forEach(([n, i]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...r) => i.bind(e)(...r);
      },
      enumerable: !1
    });
  }), t;
}
var so = {
  get reactive() {
    return It;
  },
  get release() {
    return St;
  },
  get effect() {
    return yt;
  },
  get raw() {
    return ci;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: ls,
  dontAutoEvaluateFunctions: Ei,
  disableEffectScheduling: es,
  startObservingMutations: fn,
  stopObservingMutations: bi,
  setReactivityEngine: ns,
  onAttributeRemoved: gi,
  onAttributesAdded: pi,
  closestDataStack: gt,
  skipDuringClone: ot,
  onlyDuringClone: Fs,
  addRootSelector: Pi,
  addInitSelector: zi,
  interceptClone: _e,
  addScopeToNode: Yt,
  deferMutations: as,
  mapAttributes: bn,
  evaluateLater: k,
  interceptInit: Ss,
  setEvaluator: hs,
  mergeProxies: Ct,
  extractProp: Zs,
  findClosest: Ot,
  onElRemoved: cn,
  closestRoot: we,
  destroyTree: At,
  interceptor: wi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Ge,
  // INTERNAL
  setStyles: xe,
  // INTERNAL
  mutateDom: A,
  directive: N,
  entangle: Xi,
  throttle: Zi,
  debounce: Ji,
  evaluate: dt,
  initTree: J,
  nextTick: wn,
  prefixed: Tt,
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
  walk: mt,
  data: io,
  bind: eo
}, Kt = so;
function oo(t, e) {
  let n = ao(t);
  if (typeof e == "function")
    return Si(n, e);
  let i = lo(t, e, n);
  return _i.bind(null, t, e, i);
}
function ao(t) {
  let e = {};
  return ae(e, t), [e, ...gt(t)];
}
function lo(t, e, n) {
  return (i = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Ct([r, ...n]), a = e.split(".").reduce(
      (l, c) => (l[c] === void 0 && co(t, e), l[c]),
      o
    );
    Ht(i, a, o, s);
  };
}
function co(t, e) {
  console.warn(
    `Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${e}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
    t
  );
}
function uo(t, e) {
  const n = /* @__PURE__ */ Object.create(null), i = t.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var fo = Object.freeze({}), ho = Object.prototype.hasOwnProperty, Ee = (t, e) => ho.call(t, e), ft = Array.isArray, jt = (t) => nr(t) === "[object Map]", po = (t) => typeof t == "string", En = (t) => typeof t == "symbol", Ie = (t) => t !== null && typeof t == "object", go = Object.prototype.toString, nr = (t) => go.call(t), ir = (t) => nr(t).slice(8, -1), In = (t) => po(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, mo = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, bo = mo((t) => t.charAt(0).toUpperCase() + t.slice(1)), rr = (t, e) => t !== e && (t === t || e === e), Ze = /* @__PURE__ */ new WeakMap(), Rt = [], U, ht = Symbol("iterate"), Xe = Symbol("Map key iterate");
function vo(t) {
  return t && t._isEffect === !0;
}
function yo(t, e = fo) {
  vo(t) && (t = t.raw);
  const n = _o(t, e);
  return e.lazy || n(), n;
}
function wo(t) {
  t.active && (sr(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var xo = 0;
function _o(t, e) {
  const n = function() {
    if (!n.active)
      return t();
    if (!Rt.includes(n)) {
      sr(n);
      try {
        return Io(), Rt.push(n), U = n, t();
      } finally {
        Rt.pop(), or(), U = Rt[Rt.length - 1];
      }
    }
  };
  return n.id = xo++, n.allowRecurse = !!e.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = t, n.deps = [], n.options = e, n;
}
function sr(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let n = 0; n < e.length; n++)
      e[n].delete(t);
    e.length = 0;
  }
}
var _t = !0, Sn = [];
function Eo() {
  Sn.push(_t), _t = !1;
}
function Io() {
  Sn.push(_t), _t = !0;
}
function or() {
  const t = Sn.pop();
  _t = t === void 0 ? !0 : t;
}
function B(t, e, n) {
  if (!_t || U === void 0)
    return;
  let i = Ze.get(t);
  i || Ze.set(t, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(U) || (r.add(U), U.deps.push(r), U.options.onTrack && U.options.onTrack({
    effect: U,
    target: t,
    type: e,
    key: n
  }));
}
function rt(t, e, n, i, r, s) {
  const o = Ze.get(t);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== U || d.allowRecurse) && a.add(d);
    });
  };
  if (e === "clear")
    o.forEach(l);
  else if (n === "length" && ft(t))
    o.forEach((u, d) => {
      (d === "length" || d >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), e) {
      case "add":
        ft(t) ? In(n) && l(o.get("length")) : (l(o.get(ht)), jt(t) && l(o.get(Xe)));
        break;
      case "delete":
        ft(t) || (l(o.get(ht)), jt(t) && l(o.get(Xe)));
        break;
      case "set":
        jt(t) && l(o.get(ht));
        break;
    }
  const c = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: t,
      key: n,
      type: e,
      newValue: i,
      oldValue: r,
      oldTarget: s
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(c);
}
var So = /* @__PURE__ */ uo("__proto__,__v_isRef,__isVue"), ar = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter(En)), Co = /* @__PURE__ */ lr(), To = /* @__PURE__ */ lr(!0), Pn = /* @__PURE__ */ Oo();
function Oo() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const i = O(this);
      for (let s = 0, o = this.length; s < o; s++)
        B(i, "get", s + "");
      const r = i[e](...n);
      return r === -1 || r === !1 ? i[e](...n.map(O)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Eo();
      const i = O(this)[e].apply(this, n);
      return or(), i;
    };
  }), t;
}
function lr(t = !1, e = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !t;
    if (r === "__v_isReadonly")
      return t;
    if (r === "__v_raw" && s === (t ? e ? Wo : fr : e ? jo : dr).get(i))
      return i;
    const o = ft(i);
    if (!t && o && Ee(Pn, r))
      return Reflect.get(Pn, r, s);
    const a = Reflect.get(i, r, s);
    return (En(r) ? ar.has(r) : So(r)) || (t || B(i, "get", r), e) ? a : Qe(a) ? !o || !In(r) ? a.value : a : Ie(a) ? t ? hr(a) : An(a) : a;
  };
}
var Ao = /* @__PURE__ */ $o();
function $o(t = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!t && (r = O(r), o = O(o), !ft(n) && Qe(o) && !Qe(r)))
      return o.value = r, !0;
    const a = ft(n) && In(i) ? Number(i) < n.length : Ee(n, i), l = Reflect.set(n, i, r, s);
    return n === O(s) && (a ? rr(r, o) && rt(n, "set", i, r, o) : rt(n, "add", i, r)), l;
  };
}
function No(t, e) {
  const n = Ee(t, e), i = t[e], r = Reflect.deleteProperty(t, e);
  return r && n && rt(t, "delete", e, void 0, i), r;
}
function ko(t, e) {
  const n = Reflect.has(t, e);
  return (!En(e) || !ar.has(e)) && B(t, "has", e), n;
}
function Ro(t) {
  return B(t, "iterate", ft(t) ? "length" : ht), Reflect.ownKeys(t);
}
var Lo = {
  get: Co,
  set: Ao,
  deleteProperty: No,
  has: ko,
  ownKeys: Ro
}, Mo = {
  get: To,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, Cn = (t) => Ie(t) ? An(t) : t, Tn = (t) => Ie(t) ? hr(t) : t, On = (t) => t, Se = (t) => Reflect.getPrototypeOf(t);
function Jt(t, e, n = !1, i = !1) {
  t = t.__v_raw;
  const r = O(t), s = O(e);
  e !== s && !n && B(r, "get", e), !n && B(r, "get", s);
  const { has: o } = Se(r), a = i ? On : n ? Tn : Cn;
  if (o.call(r, e))
    return a(t.get(e));
  if (o.call(r, s))
    return a(t.get(s));
  t !== r && t.get(e);
}
function Zt(t, e = !1) {
  const n = this.__v_raw, i = O(n), r = O(t);
  return t !== r && !e && B(i, "has", t), !e && B(i, "has", r), t === r ? n.has(t) : n.has(t) || n.has(r);
}
function Xt(t, e = !1) {
  return t = t.__v_raw, !e && B(O(t), "iterate", ht), Reflect.get(t, "size", t);
}
function zn(t) {
  t = O(t);
  const e = O(this);
  return Se(e).has.call(e, t) || (e.add(t), rt(e, "add", t, t)), this;
}
function Bn(t, e) {
  e = O(e);
  const n = O(this), { has: i, get: r } = Se(n);
  let s = i.call(n, t);
  s ? ur(n, i, t) : (t = O(t), s = i.call(n, t));
  const o = r.call(n, t);
  return n.set(t, e), s ? rr(e, o) && rt(n, "set", t, e, o) : rt(n, "add", t, e), this;
}
function jn(t) {
  const e = O(this), { has: n, get: i } = Se(e);
  let r = n.call(e, t);
  r ? ur(e, n, t) : (t = O(t), r = n.call(e, t));
  const s = i ? i.call(e, t) : void 0, o = e.delete(t);
  return r && rt(e, "delete", t, void 0, s), o;
}
function Wn() {
  const t = O(this), e = t.size !== 0, n = jt(t) ? new Map(t) : new Set(t), i = t.clear();
  return e && rt(t, "clear", void 0, void 0, n), i;
}
function Qt(t, e) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = O(o), l = e ? On : t ? Tn : Cn;
    return !t && B(a, "iterate", ht), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function te(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = O(r), o = jt(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? On : e ? Tn : Cn;
    return !e && B(s, "iterate", l ? Xe : ht), {
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
function tt(t) {
  return function(...e) {
    {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${bo(t)} operation ${n}failed: target is readonly.`, O(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function Fo() {
  const t = {
    get(s) {
      return Jt(this, s);
    },
    get size() {
      return Xt(this);
    },
    has: Zt,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Qt(!1, !1)
  }, e = {
    get(s) {
      return Jt(this, s, !1, !0);
    },
    get size() {
      return Xt(this);
    },
    has: Zt,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Qt(!1, !0)
  }, n = {
    get(s) {
      return Jt(this, s, !0);
    },
    get size() {
      return Xt(this, !0);
    },
    has(s) {
      return Zt.call(this, s, !0);
    },
    add: tt(
      "add"
      /* ADD */
    ),
    set: tt(
      "set"
      /* SET */
    ),
    delete: tt(
      "delete"
      /* DELETE */
    ),
    clear: tt(
      "clear"
      /* CLEAR */
    ),
    forEach: Qt(!0, !1)
  }, i = {
    get(s) {
      return Jt(this, s, !0, !0);
    },
    get size() {
      return Xt(this, !0);
    },
    has(s) {
      return Zt.call(this, s, !0);
    },
    add: tt(
      "add"
      /* ADD */
    ),
    set: tt(
      "set"
      /* SET */
    ),
    delete: tt(
      "delete"
      /* DELETE */
    ),
    clear: tt(
      "clear"
      /* CLEAR */
    ),
    forEach: Qt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = te(s, !1, !1), n[s] = te(s, !0, !1), e[s] = te(s, !1, !0), i[s] = te(s, !0, !0);
  }), [
    t,
    n,
    e,
    i
  ];
}
var [Do, Po, ac, lc] = /* @__PURE__ */ Fo();
function cr(t, e) {
  const n = t ? Po : Do;
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(Ee(n, r) && r in i ? n : i, r, s);
}
var zo = {
  get: /* @__PURE__ */ cr(!1)
}, Bo = {
  get: /* @__PURE__ */ cr(!0)
};
function ur(t, e, n) {
  const i = O(n);
  if (i !== n && e.call(t, i)) {
    const r = ir(t);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var dr = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ new WeakMap(), fr = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap();
function Ho(t) {
  switch (t) {
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
function Vo(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Ho(ir(t));
}
function An(t) {
  return t && t.__v_isReadonly ? t : pr(t, !1, Lo, zo, dr);
}
function hr(t) {
  return pr(t, !0, Mo, Bo, fr);
}
function pr(t, e, n, i, r) {
  if (!Ie(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = r.get(t);
  if (s)
    return s;
  const o = Vo(t);
  if (o === 0)
    return t;
  const a = new Proxy(t, o === 2 ? i : n);
  return r.set(t, a), a;
}
function O(t) {
  return t && O(t.__v_raw) || t;
}
function Qe(t) {
  return !!(t && t.__v_isRef === !0);
}
H("nextTick", () => wn);
H("dispatch", (t) => Bt.bind(Bt, t));
H("watch", (t, { evaluateLater: e, cleanup: n }) => (i, r) => {
  let s = e(i), a = ui(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
H("store", to);
H("data", (t) => vi(t));
H("root", (t) => we(t));
H("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = Ct(qo(t))), t._x_refs_proxy));
function qo(t) {
  let e = [];
  return Ot(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var Le = {};
function gr(t) {
  return Le[t] || (Le[t] = 0), ++Le[t];
}
function Uo(t, e) {
  return Ot(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function Yo(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = gr(e));
}
H("id", (t, { cleanup: e }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return Ko(t, r, e, () => {
    let s = Uo(t, n), o = s ? s._x_ids[n] : gr(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
_e((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function Ko(t, e, n, i) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let r = i();
  return t._x_id[e] = r, n(() => {
    delete t._x_id[e];
  }), r;
}
H("el", (t) => t);
mr("Focus", "focus", "focus");
mr("Persist", "persist", "persist");
function mr(t, e, n) {
  H(e, (i) => P(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
N("modelable", (t, { expression: e }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(e), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = i(`${e} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let u = t._x_model.get, d = t._x_model.set, f = Xi(
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
N("teleport", (t, { modifiers: e, expression: n }, { cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && P("x-teleport can only be used on a <template> tag", t);
  let r = Hn(n), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Yt(s, {}, t);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  A(() => {
    o(s, r, e), ot(() => {
      J(s);
    })();
  }), t._x_teleportPutBack = () => {
    let a = Hn(n);
    A(() => {
      o(t._x_teleport, a, e);
    });
  }, i(
    () => A(() => {
      s.remove(), At(s);
    })
  );
});
var Go = document.createElement("div");
function Hn(t) {
  let e = ot(() => document.querySelector(t), () => Go)();
  return e || P(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var br = () => {
};
br.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
N("ignore", br);
N("effect", ot((t, { expression: e }, { effect: n }) => {
  n(k(t, e));
}));
function tn(t, e, n, i) {
  let r = t, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (e = Jo(e)), n.includes("camel") && (e = Zo(e)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = ce(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Ji(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = ce(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Zi(s, c);
  }
  return n.includes("prevent") && (s = a(s, (l, c) => {
    c.preventDefault(), l(c);
  })), n.includes("stop") && (s = a(s, (l, c) => {
    c.stopPropagation(), l(c);
  })), n.includes("once") && (s = a(s, (l, c) => {
    l(c), r.removeEventListener(e, s, o);
  })), (n.includes("away") || n.includes("outside")) && (r = document, s = a(s, (l, c) => {
    t.contains(c.target) || c.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && l(c));
  })), n.includes("self") && (s = a(s, (l, c) => {
    c.target === t && l(c);
  })), (Qo(e) || vr(e)) && (s = a(s, (l, c) => {
    ta(c, n) || l(c);
  })), r.addEventListener(e, s, o), () => {
    r.removeEventListener(e, s, o);
  };
}
function Jo(t) {
  return t.replace(/-/g, ".");
}
function Zo(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function ce(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Xo(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Qo(t) {
  return ["keydown", "keyup"].includes(t);
}
function vr(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function ta(t, e) {
  let n = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, ce((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, ce((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Vn(t.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), t[`${o}Key`])).length === r.length && (vr(t.type) || Vn(t.key).includes(n[0])));
}
function Vn(t) {
  if (!t)
    return [];
  t = Xo(t);
  let e = {
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
  return e[t] = t, Object.keys(e).map((n) => {
    if (e[n] === t)
      return n;
  }).filter((n) => n);
}
N("model", (t, { modifiers: e, expression: n }, { effect: i, cleanup: r }) => {
  let s = t;
  e.includes("parent") && (s = t.parentNode);
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
  typeof n == "string" && t.type === "radio" && A(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  var u = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input";
  let d = it ? () => {
  } : tn(t, u, e, (f) => {
    c(Me(t, e, f, l()));
  });
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || _n(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    Me(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = d, r(() => t._x_removeModelListeners.default()), t.form) {
    let f = tn(t.form, "reset", [], (m) => {
      wn(() => t._x_model && t._x_model.set(Me(t, e, { target: t }, l())));
    });
    r(() => f());
  }
  t._x_model = {
    get() {
      return l();
    },
    set(f) {
      c(f);
    }
  }, t._x_forceModelUpdate = (f) => {
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, A(() => qi(t, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Me(t, e, n, i) {
  return A(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (_n(t))
      if (Array.isArray(i)) {
        let r = null;
        return e.includes("number") ? r = Fe(n.target.value) : e.includes("boolean") ? r = re(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ea(s, r));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Fe(s);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return re(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return Gi(t) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, e.includes("number") ? Fe(r) : e.includes("boolean") ? re(r) : e.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Fe(t) {
  let e = t ? parseFloat(t) : null;
  return na(e) ? e : t;
}
function ea(t, e) {
  return t == e;
}
function na(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function qn(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
N("cloak", (t) => queueMicrotask(() => A(() => t.removeAttribute(Tt("cloak")))));
zi(() => `[${Tt("init")}]`);
N("init", ot((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
N("text", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let r = i(e);
  n(() => {
    r((s) => {
      A(() => {
        t.textContent = s;
      });
    });
  });
});
N("html", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let r = i(e);
  n(() => {
    r((s) => {
      A(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, J(t), delete t._x_ignoreSelf;
      });
    });
  });
});
bn(Ai(":", $i(Tt("bind:"))));
var yr = (t, { value: e, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!e) {
    let l = {};
    no(l), k(t, i)((u) => {
      tr(t, u, r);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return ia(t, i);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let a = k(t, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), A(() => qi(t, e, l, n));
  })), o(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
yr.inline = (t, { value: e, modifiers: n, expression: i }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: i, extract: !1 });
};
N("bind", yr);
function ia(t, e) {
  t._x_keyExpression = e;
}
Pi(() => `[${Tt("data")}]`);
N("data", (t, { expression: e }, { cleanup: n }) => {
  if (ra(t))
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  ae(i, t);
  let r = {};
  ro(r, i);
  let s = dt(t, e, { scope: r });
  (s === void 0 || s === !0) && (s = {}), ae(s, t);
  let o = It(s);
  yi(o);
  let a = Yt(t, o);
  o.init && dt(t, o.init), n(() => {
    o.destroy && dt(t, o.destroy), a();
  });
});
_e((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function ra(t) {
  return it ? Je ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (t, { modifiers: e, expression: n }, { effect: i }) => {
  let r = k(t, n);
  t._x_doHide || (t._x_doHide = () => {
    A(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    A(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let s = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, o = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, a = () => setTimeout(o), l = Ke(
    (d) => d ? o() : s(),
    (d) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  i(() => r((d) => {
    !u && d === c || (e.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
N("for", (t, { expression: e }, { effect: n, cleanup: i }) => {
  let r = oa(e), s = k(t, r.items), o = k(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, n(() => sa(t, r, s, o)), i(() => {
    Object.values(t._x_lookup).forEach((a) => A(
      () => {
        At(a), a.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function sa(t, e, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = t;
  n((o) => {
    aa(o) && o >= 0 && (o = Array.from(Array(o).keys(), (h) => h + 1)), o === void 0 && (o = []);
    let a = t._x_lookup, l = t._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([h, g]) => {
        let x = Un(e, g, h, o);
        i((E) => {
          u.includes(E) && P("Duplicate key on x-for", t), u.push(E);
        }, { scope: { index: h, ...x } }), c.push(x);
      });
    else
      for (let h = 0; h < o.length; h++) {
        let g = Un(e, o[h], h, o);
        i((x) => {
          u.includes(x) && P("Duplicate key on x-for", t), u.push(x);
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
        let E = l.splice(h, 1)[0], I = l.splice(x - 1, 1)[0];
        l.splice(h, 0, I), l.splice(x, 0, E), f.push([E, I]);
      } else
        y.push(g);
      v = g;
    }
    for (let h = 0; h < m.length; h++) {
      let g = m[h];
      g in a && (A(() => {
        At(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let h = 0; h < f.length; h++) {
      let [g, x] = f[h], E = a[g], I = a[x], w = document.createElement("div");
      A(() => {
        I || P('x-for ":key" is undefined or invalid', s, x, a), I.after(w), E.after(I), I._x_currentIfEl && I.after(I._x_currentIfEl), w.before(E), E._x_currentIfEl && E.after(E._x_currentIfEl), w.remove();
      }), I._x_refreshXForScope(c[u.indexOf(x)]);
    }
    for (let h = 0; h < d.length; h++) {
      let [g, x] = d[h], E = g === "template" ? s : a[g];
      E._x_currentIfEl && (E = E._x_currentIfEl);
      let I = c[x], w = u[x], p = document.importNode(s.content, !0).firstElementChild, b = It(I);
      Yt(p, b, s), p._x_refreshXForScope = (_) => {
        Object.entries(_).forEach(([C, S]) => {
          b[C] = S;
        });
      }, A(() => {
        E.after(p), ot(() => J(p))();
      }), typeof w == "object" && P("x-for key cannot be an object, it must be a string or an integer", s), a[w] = p;
    }
    for (let h = 0; h < y.length; h++)
      a[y[h]]._x_refreshXForScope(c[u.indexOf(y[h])]);
    s._x_prevKeys = u;
  });
}
function oa(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = t.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(e);
  return a ? (s.item = o.replace(e, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Un(t, e, n, i) {
  let r = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = e[a];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = e[o];
  }) : r[t.item] = e, t.index && (r[t.index] = n), t.collection && (r[t.collection] = i), r;
}
function aa(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function wr() {
}
wr.inline = (t, { expression: e }, { cleanup: n }) => {
  let i = we(t);
  i._x_refs || (i._x_refs = {}), i._x_refs[e] = t, n(() => delete i._x_refs[e]);
};
N("ref", wr);
N("if", (t, { expression: e }, { effect: n, cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && P("x-if can only be used on a <template> tag", t);
  let r = k(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let a = t.content.cloneNode(!0).firstElementChild;
    return Yt(a, {}, t), A(() => {
      t.after(a), ot(() => J(a))();
    }), t._x_currentIfEl = a, t._x_undoIf = () => {
      A(() => {
        At(a), a.remove();
      }), delete t._x_currentIfEl;
    }, a;
  }, o = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => t._x_undoIf && t._x_undoIf());
});
N("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((r) => Yo(t, r));
});
_e((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
bn(Ai("@", $i(Tt("on:"))));
N("on", ot((t, { value: e, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? k(t, i) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let o = tn(t, e, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Ce("Collapse", "collapse", "collapse");
Ce("Intersect", "intersect", "intersect");
Ce("Focus", "trap", "focus");
Ce("Mask", "mask", "mask");
function Ce(t, e, n) {
  N(e, (i) => P(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Kt.setEvaluator(oo);
Kt.setReactivityEngine({ reactive: An, effect: yo, release: wo, raw: O });
var la = Kt, G = la;
function ca(t) {
  t.directive("collapse", e), e.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function e(n, { modifiers: i }) {
    let r = Yn(i, "duration", 250) / 1e3, s = Yn(i, "min", 0), o = !i.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (c, u) => {
      let d = t.setStyles(c, u);
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
        d === f && (d = s), t.transition(n, t.setStyles, {
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
function Yn(t, e, n) {
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
var ua = ca;
function da(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: pa(r),
      threshold: fa(r)
    }, c = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting !== (n === "leave") && (a(), r.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(e), o(() => {
      c.disconnect();
    });
  }));
}
function fa(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function ha(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function pa(t) {
  const e = "margin", n = "0px 0px 0px 0px", i = t.indexOf(e);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(ha(t[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var ga = da, xr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ue = /* @__PURE__ */ xr.join(","), _r = typeof Element > "u", bt = _r ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, en = !_r && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, Er = function(e, n, i) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(ue));
  return n && bt.call(e, ue) && r.unshift(e), r = r.filter(i), r;
}, Ir = function t(e, n, i) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = bt.call(o, ue);
      u && i.filter(o) && (n || !e.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), f = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && f) {
        var m = t(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, m) : r.push({
          scope: o,
          candidates: m
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Sr = function(e, n) {
  return e.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, ma = function(e, n) {
  return e.tabIndex === n.tabIndex ? e.documentOrder - n.documentOrder : e.tabIndex - n.tabIndex;
}, Cr = function(e) {
  return e.tagName === "INPUT";
}, ba = function(e) {
  return Cr(e) && e.type === "hidden";
}, va = function(e) {
  var n = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, ya = function(e, n) {
  for (var i = 0; i < e.length; i++)
    if (e[i].checked && e[i].form === n)
      return e[i];
}, wa = function(e) {
  if (!e.name)
    return !0;
  var n = e.form || en(e), i = function(a) {
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
  var s = ya(r, e.form);
  return !s || s === e;
}, xa = function(e) {
  return Cr(e) && e.type === "radio";
}, _a = function(e) {
  return xa(e) && !wa(e);
}, Kn = function(e) {
  var n = e.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Ea = function(e, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = bt.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (bt.call(o, "details:not([open]) *"))
    return !0;
  var a = en(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var u = e.parentElement, d = en(e);
        if (u && !u.shadowRoot && r(u) === !0)
          return Kn(e);
        e.assignedSlot ? e = e.assignedSlot : !u && d !== e.ownerDocument ? e = d.host : e = u;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (i === "non-zero-area")
    return Kn(e);
  return !1;
}, Ia = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var n = e.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return bt.call(n, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, de = function(e, n) {
  return !(n.disabled || ba(n) || Ea(n, e) || // For a details element with a summary, the summary element gets the focus
  va(n) || Ia(n));
}, nn = function(e, n) {
  return !(_a(n) || Sr(n) < 0 || !de(e, n));
}, Sa = function(e) {
  var n = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Ca = function t(e) {
  var n = [], i = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Sr(a, o), c = o ? t(r.candidates) : a;
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
}, Ta = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Ir([e], n.includeContainer, {
    filter: nn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Sa
  }) : i = Er(e, n.includeContainer, nn.bind(null, n)), Ca(i);
}, Tr = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Ir([e], n.includeContainer, {
    filter: de.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Er(e, n.includeContainer, de.bind(null, n)), i;
}, ee = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return bt.call(e, ue) === !1 ? !1 : nn(n, e);
}, Oa = /* @__PURE__ */ xr.concat("iframe").join(","), se = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return bt.call(e, Oa) === !1 ? !1 : de(n, e);
};
function Gn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Jn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Gn(Object(n), !0).forEach(function(i) {
      Aa(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Gn(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function Aa(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t;
}
var Zn = /* @__PURE__ */ function() {
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
}(), $a = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Na = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, ka = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, Xn = function(e) {
  return setTimeout(e, 0);
}, Qn = function(e, n) {
  var i = -1;
  return e.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Lt = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, i) : e;
}, ne = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Ra = function(e, n) {
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
      C.find(function(S) {
        return S === p;
      });
    });
  }, c = function(p) {
    var b = r[p];
    if (typeof b == "function") {
      for (var _ = arguments.length, C = new Array(_ > 1 ? _ - 1 : 0), S = 1; S < _; S++)
        C[S - 1] = arguments[S];
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
        nextTabbableNode: function(S) {
          var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, R = _.findIndex(function(L) {
            return L === S;
          });
          if (!(R < 0))
            return $ ? _.slice(R + 1).find(function(L) {
              return ee(L, r.tabbableOptions);
            }) : _.slice(0, R).reverse().find(function(L) {
              return ee(L, r.tabbableOptions);
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
    var b = ne(p);
    if (!(l(b) >= 0)) {
      if (Lt(r.clickOutsideDeactivates, p)) {
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
          returnFocus: r.returnFocusOnDeactivate && !se(b, r.tabbableOptions)
        });
        return;
      }
      Lt(r.allowOutsideClick, p) || p.preventDefault();
    }
  }, v = function(p) {
    var b = ne(p), _ = l(b) >= 0;
    _ || b instanceof Document ? _ && (s.mostRecentlyFocusedNode = b) : (p.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, h = function(p) {
    var b = ne(p);
    d();
    var _ = null;
    if (s.tabbableGroups.length > 0) {
      var C = l(b), S = C >= 0 ? s.containerGroups[C] : void 0;
      if (C < 0)
        p.shiftKey ? _ = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : _ = s.tabbableGroups[0].firstTabbableNode;
      else if (p.shiftKey) {
        var $ = Qn(s.tabbableGroups, function(z) {
          var D = z.firstTabbableNode;
          return b === D;
        });
        if ($ < 0 && (S.container === b || se(b, r.tabbableOptions) && !ee(b, r.tabbableOptions) && !S.nextTabbableNode(b, !1)) && ($ = C), $ >= 0) {
          var R = $ === 0 ? s.tabbableGroups.length - 1 : $ - 1, L = s.tabbableGroups[R];
          _ = L.lastTabbableNode;
        }
      } else {
        var V = Qn(s.tabbableGroups, function(z) {
          var D = z.lastTabbableNode;
          return b === D;
        });
        if (V < 0 && (S.container === b || se(b, r.tabbableOptions) && !ee(b, r.tabbableOptions) && !S.nextTabbableNode(b)) && (V = C), V >= 0) {
          var F = V === s.tabbableGroups.length - 1 ? 0 : V + 1, at = s.tabbableGroups[F];
          _ = at.firstTabbableNode;
        }
      }
    } else
      _ = c("fallbackFocus");
    _ && (p.preventDefault(), f(_));
  }, g = function(p) {
    if (Na(p) && Lt(r.escapeDeactivates, p) !== !1) {
      p.preventDefault(), o.deactivate();
      return;
    }
    if (ka(p)) {
      h(p);
      return;
    }
  }, x = function(p) {
    var b = ne(p);
    l(b) >= 0 || Lt(r.clickOutsideDeactivates, p) || Lt(r.allowOutsideClick, p) || (p.preventDefault(), p.stopImmediatePropagation());
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
  }, I = function() {
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
      var S = function() {
        C && d(), E(), _ && _();
      };
      return C ? (C(s.containers.concat()).then(S, S), this) : (S(), this);
    },
    deactivate: function(p) {
      if (!s.active)
        return this;
      var b = Jn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, p);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, I(), s.active = !1, s.paused = !1, Zn.deactivateTrap(o);
      var _ = a(b, "onDeactivate"), C = a(b, "onPostDeactivate"), S = a(b, "checkCanReturnFocus"), $ = a(b, "returnFocus", "returnFocusOnDeactivate");
      _ && _();
      var R = function() {
        Xn(function() {
          $ && f(m(s.nodeFocusedBeforeActivation)), C && C();
        });
      };
      return $ && S ? (S(m(s.nodeFocusedBeforeActivation)).then(R, R), this) : (R(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, I(), this);
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
  }, o.updateContainerElements(e), o;
};
function La(t) {
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
        return se(s);
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
  }), t.directive("trap", t.skipDuringClone(
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
        u !== h && (h && !u && (s.includes("noscroll") && (y = Ma()), s.includes("inert") && (m = ti(i)), setTimeout(() => {
          f.activate();
        }, 15)), !h && u && v(), u = !!h);
      })), l(v);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ti(i);
    }
  ));
}
function ti(t) {
  let e = [];
  return Or(t, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), e.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Or(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((n) => {
    n.isSameNode(t) ? Or(t.parentNode, e) : e(n);
  });
}
function Ma() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
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
function Da(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Pa(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
  }
}
function za(t, e, n) {
  return e && Pa(t.prototype, e), t;
}
var Ba = Object.defineProperty, Z = function(t, e) {
  return Ba(t, "name", { value: e, configurable: !0 });
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
`, Ua = Z(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Mt = Z(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), T = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, et = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ei = { OUTLINE: "outline", FILLED: "filled" }, De = { FADE: "fade", SLIDE: "slide" }, Ft = { CLOSE: Mt(ja), SUCCESS: Mt(Va), ERROR: Mt(Wa), WARNING: Mt(qa), INFO: Mt(Ha) }, ni = Z(function(t) {
  t.wrapper.classList.add(T.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(T.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ii = Z(function(t) {
  t.wrapper.classList.remove(T.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), Ya = Z(function(t) {
  t.wrapper.classList.add(T.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(T.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Ka = Z(function(t) {
  t.wrapper.classList.remove(T.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Ar = function() {
  function t(e) {
    var n = this;
    Da(this, t), this.notifyOut = Z(function(z) {
      z(n);
    }, "notifyOut");
    var i = e.notificationsGap, r = i === void 0 ? 20 : i, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, u = c === void 0 ? De.FADE : c, d = e.type, f = d === void 0 ? "outline" : d, m = e.title, y = e.text, v = e.showIcon, h = v === void 0 ? !0 : v, g = e.customIcon, x = g === void 0 ? "" : g, E = e.customClass, I = E === void 0 ? "" : E, w = e.speed, p = w === void 0 ? 500 : w, b = e.showCloseButton, _ = b === void 0 ? !0 : b, C = e.autoclose, S = C === void 0 ? !0 : C, $ = e.autotimeout, R = $ === void 0 ? 3e3 : $, L = e.position, V = L === void 0 ? "right top" : L, F = e.customWrapper, at = F === void 0 ? "" : F;
    if (this.customWrapper = at, this.status = l, this.title = m, this.text = y, this.showIcon = h, this.customIcon = x, this.customClass = I, this.speed = p, this.effect = u, this.showCloseButton = _, this.autoclose = S, this.autotimeout = R, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return za(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(T.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(T.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](T.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](T.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](T.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](T.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](T.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](T.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](T.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(T.NOTIFY_CLOSE), i.innerHTML = Ft.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Ua(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(T.NOTIFY), this.type) {
      case ei.OUTLINE:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
        break;
      case ei.FILLED:
        this.wrapper.classList.add(T.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case et.SUCCESS:
        this.wrapper.classList.add(T.NOTIFY_SUCCESS);
        break;
      case et.ERROR:
        this.wrapper.classList.add(T.NOTIFY_ERROR);
        break;
      case et.WARNING:
        this.wrapper.classList.add(T.NOTIFY_WARNING);
        break;
      case et.INFO:
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
    var n = Z(function(r) {
      switch (r) {
        case et.SUCCESS:
          return Ft.SUCCESS;
        case et.ERROR:
          return Ft.ERROR;
        case et.WARNING:
          return Ft.WARNING;
        case et.INFO:
          return Ft.INFO;
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
      case De.FADE:
        this.selectedNotifyInEffect = ni, this.selectedNotifyOutEffect = ii;
        break;
      case De.SLIDE:
        this.selectedNotifyInEffect = Ya, this.selectedNotifyOutEffect = Ka;
        break;
      default:
        this.selectedNotifyInEffect = ni, this.selectedNotifyOutEffect = ii;
    }
  } }]), t;
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
function Dt(t = {}) {
  const e = {
    ...Rr,
    ...t
  };
  Nr.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), kr.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new $r(e);
}
const Ga = {
  custom: Dt,
  success(t, e = "Success", n = {}) {
    Dt({
      status: "success",
      title: e,
      text: t,
      ...n
    });
  },
  error(t, e = "Error", n = {}) {
    Dt({
      status: "error",
      title: e,
      text: t,
      ...n
    });
  },
  warning(t, e = "Warning", n = {}) {
    Dt({
      status: "warning",
      title: e,
      text: t,
      ...n
    });
  },
  info(t, e = "Info", n = {}) {
    Dt({
      status: "info",
      title: e,
      text: t,
      ...n
    });
  },
  setDefaults(t = {}) {
    Object.assign(Rr, t);
  },
  get allowedStatuses() {
    return [...Nr];
  },
  get allowedPositions() {
    return [...kr];
  }
}, rn = function() {
}, Vt = {}, fe = {}, qt = {};
function Ja(t, e) {
  t = Array.isArray(t) ? t : [t];
  const n = [];
  let i = t.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || e(n);
  }; i--; ) {
    if (o = t[i], a = fe[o], a) {
      s(o, a);
      continue;
    }
    l = qt[o] = qt[o] || [], l.push(s);
  }
}
function Lr(t, e) {
  if (!t) return;
  const n = qt[t];
  if (fe[t] = e, !!n)
    for (; n.length; )
      n[0](t, e), n.splice(0, 1);
}
function sn(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || rn)(e) : (t.success || rn)(t);
}
function Za(t, e, n, i, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Mr(e, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(e, l, t.defaultPrevented);
}
function Mr(t, e, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || rn, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, f;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    f = r.createElement("link"), f.rel = "stylesheet", f.href = c, u = "hideFocus" in f, u && f.relList && (u = 0, f.rel = "preload", f.as = "style"), n.inlineStyleNonce && f.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    f = r.createElement("img"), f.src = c;
  else if (f = r.createElement("script"), f.src = c, f.async = s === void 0 ? !0 : s, n.inlineScriptNonce && f.setAttribute("nonce", n.inlineScriptNonce), d = "noModule" in f, /^module!/.test(l)) {
    if (!d) return e(t, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return e(t, "l");
  const m = function(y) {
    Za(y, t, f, e, n, i, o, u);
  };
  f.addEventListener("load", m, { once: !0 }), f.addEventListener("error", m, { once: !0 }), a(t, f) !== !1 && r.head.appendChild(f);
}
function Xa(t, e, n) {
  t = Array.isArray(t) ? t : [t];
  let i = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || e(r);
  }
  for (let o = 0; o < t.length; o++)
    Mr(t[o], s, n);
}
function nt(t, e, n) {
  let i, r;
  if (e && typeof e == "string" && e.trim && (i = e.trim()), r = (i ? n : e) || {}, i) {
    if (i in Vt)
      throw "LoadJS";
    Vt[i] = !0;
  }
  function s(o, a) {
    Xa(t, function(l) {
      sn(r, l), o && sn({ success: o, error: a }, l), Lr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
nt.ready = function(e, n) {
  return Ja(e, function(i) {
    sn(n, i);
  }), nt;
};
nt.done = function(e) {
  Lr(e, []);
};
nt.reset = function() {
  Object.keys(Vt).forEach((e) => delete Vt[e]), Object.keys(fe).forEach((e) => delete fe[e]), Object.keys(qt).forEach((e) => delete qt[e]);
};
nt.isDefined = function(e) {
  return e in Vt;
};
function Qa(t) {
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
function tl(t) {
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
function el(t) {
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
function nl(t) {
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
function il(t) {
  t.data("rzAspectRatio", () => ({
    init() {
      const e = parseFloat(this.$el.dataset.ratio);
      if (!isNaN(e) && e > 0) {
        const n = 100 / e + "%";
        this.$el.style.paddingBottom = n;
      } else
        this.$el.style.paddingBottom = "100%";
    }
  }));
}
function rl(t) {
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
function sl(t, e) {
  function n(i) {
    if (!i) return {};
    const r = document.getElementById(i);
    if (!r)
      return console.warn(`[rzCarousel] JSON script element #${i} not found.`), {};
    try {
      return JSON.parse(r.textContent || "{}");
    } catch (s) {
      return console.error(`[rzCarousel] Failed to parse JSON from #${i}:`, s), {};
    }
  }
  t.data("rzCarousel", () => ({
    emblaApi: null,
    canScrollPrev: !1,
    canScrollNext: !1,
    selectedIndex: 0,
    scrollSnaps: [],
    init() {
      const i = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (c) {
          return console.error("[rzCarousel] Bad assets JSON:", c), [];
        }
      })(), r = this.$el.dataset.nonce || "", s = n(this.$el.dataset.config), o = s.Options || {}, a = s.Plugins || [], l = this;
      i.length > 0 && typeof e == "function" ? e(
        i,
        {
          success() {
            window.EmblaCarousel ? l.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
          },
          error(c) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", c);
          }
        },
        r
      ) : window.EmblaCarousel ? this.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    initializeEmbla(i, r) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(r);
      this.emblaApi = window.EmblaCarousel(s, i, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    instantiatePlugins(i) {
      return !Array.isArray(i) || i.length === 0 ? [] : i.map((r) => {
        const s = window[r.Name];
        if (typeof s != "function")
          return console.error(`[rzCarousel] Plugin constructor '${r.Name}' not found on window object.`), null;
        try {
          return s(r.Options || {});
        } catch (o) {
          return console.error(`[rzCarousel] Error instantiating plugin '${r.Name}':`, o), null;
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
    scrollTo(i) {
      this.emblaApi?.scrollTo(i);
    }
  }));
}
function ol(t) {
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
function al(t, e) {
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
function ll(t) {
  t.data("rzCollapsible", () => ({
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
function cl(t, e) {
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
const on = Math.min, wt = Math.max, he = Math.round, Y = (t) => ({
  x: t,
  y: t
}), ul = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, dl = {
  start: "end",
  end: "start"
};
function ri(t, e, n) {
  return wt(t, on(e, n));
}
function Te(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function vt(t) {
  return t.split("-")[0];
}
function Oe(t) {
  return t.split("-")[1];
}
function Fr(t) {
  return t === "x" ? "y" : "x";
}
function Dr(t) {
  return t === "y" ? "height" : "width";
}
function pt(t) {
  return ["top", "bottom"].includes(vt(t)) ? "y" : "x";
}
function Pr(t) {
  return Fr(pt(t));
}
function fl(t, e, n) {
  n === void 0 && (n = !1);
  const i = Oe(t), r = Pr(t), s = Dr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = pe(o)), [o, pe(o)];
}
function hl(t) {
  const e = pe(t);
  return [an(t), e, an(e)];
}
function an(t) {
  return t.replace(/start|end/g, (e) => dl[e]);
}
function pl(t, e, n) {
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
function gl(t, e, n, i) {
  const r = Oe(t);
  let s = pl(vt(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(an)))), s;
}
function pe(t) {
  return t.replace(/left|right|bottom|top/g, (e) => ul[e]);
}
function ml(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function bl(t) {
  return typeof t != "number" ? ml(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function ge(t) {
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
function si(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = pt(e), o = Pr(e), a = Dr(o), l = vt(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
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
  switch (Oe(e)) {
    case "start":
      m[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += f * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const vl = async (t, e, n) => {
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
      data: I,
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
        reference: t,
        floating: e
      }
    });
    u = x ?? u, d = E ?? d, m = {
      ...m,
      [h]: {
        ...m[h],
        ...I
      }
    }, w && y <= 50 && (y++, typeof w == "object" && (w.placement && (f = w.placement), w.rects && (c = w.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
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
async function zr(t, e) {
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
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: m = 0
  } = Te(e, t), y = bl(m), h = a[f ? d === "floating" ? "reference" : "floating" : d], g = ge(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(h))) == null || n ? h : h.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), x = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), I = await (s.isElement == null ? void 0 : s.isElement(E)) ? await (s.getScale == null ? void 0 : s.getScale(E)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, w = ge(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: x,
    offsetParent: E,
    strategy: l
  }) : x);
  return {
    top: (g.top - w.top + y.top) / I.y,
    bottom: (w.bottom - g.bottom + y.bottom) / I.y,
    left: (g.left - w.left + y.left) / I.x,
    right: (w.right - g.right + y.right) / I.x
  };
}
const yl = function(t) {
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
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: y = "none",
        flipAlignment: v = !0,
        ...h
      } = Te(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const g = vt(r), x = pt(a), E = vt(a) === a, I = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), w = f || (E || !v ? [pe(a)] : hl(a)), p = y !== "none";
      !f && p && w.push(...gl(a, v, y, I));
      const b = [a, ...w], _ = await zr(e, h), C = [];
      let S = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && C.push(_[g]), d) {
        const F = fl(r, o, I);
        C.push(_[F[0]], _[F[1]]);
      }
      if (S = [...S, {
        placement: r,
        overflows: C
      }], !C.every((F) => F <= 0)) {
        var $, R;
        const F = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, at = b[F];
        if (at) {
          var L;
          const D = d === "alignment" ? x !== pt(at) : !1, q = ((L = S[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!D || q)
            return {
              data: {
                index: F,
                overflows: S
              },
              reset: {
                placement: at
              }
            };
        }
        let z = (R = S.filter((D) => D.overflows[0] <= 0).sort((D, q) => D.overflows[1] - q.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!z)
          switch (m) {
            case "bestFit": {
              var V;
              const D = (V = S.filter((q) => {
                if (p) {
                  const Q = pt(q.placement);
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
async function wl(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = vt(n), a = Oe(n), l = pt(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Te(e, t);
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
const xl = function(t) {
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
      } = e, l = await wl(e, t);
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
}, _l = function(t) {
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
      } = Te(t, e), c = {
        x: n,
        y: i
      }, u = await zr(e, l), d = pt(vt(r)), f = Fr(d);
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
        ...e,
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
function Ae() {
  return typeof window < "u";
}
function $t(t) {
  return Br(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function M(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function X(t) {
  var e;
  return (e = (Br(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Br(t) {
  return Ae() ? t instanceof Node || t instanceof M(t).Node : !1;
}
function j(t) {
  return Ae() ? t instanceof Element || t instanceof M(t).Element : !1;
}
function K(t) {
  return Ae() ? t instanceof HTMLElement || t instanceof M(t).HTMLElement : !1;
}
function oi(t) {
  return !Ae() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof M(t).ShadowRoot;
}
function Gt(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(r);
}
function El(t) {
  return ["table", "td", "th"].includes($t(t));
}
function $e(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function $n(t) {
  const e = Nn(), n = j(t) ? W(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Il(t) {
  let e = st(t);
  for (; K(e) && !Et(e); ) {
    if ($n(e))
      return e;
    if ($e(e))
      return null;
    e = st(e);
  }
  return null;
}
function Nn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Et(t) {
  return ["html", "body", "#document"].includes($t(t));
}
function W(t) {
  return M(t).getComputedStyle(t);
}
function Ne(t) {
  return j(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function st(t) {
  if ($t(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    oi(t) && t.host || // Fallback.
    X(t)
  );
  return oi(e) ? e.host : e;
}
function jr(t) {
  const e = st(t);
  return Et(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : K(e) && Gt(e) ? e : jr(e);
}
function Wr(t, e, n) {
  var i;
  e === void 0 && (e = []);
  const r = jr(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = M(r);
  return s ? (ln(o), e.concat(o, o.visualViewport || [], Gt(r) ? r : [], [])) : e.concat(r, Wr(r, []));
}
function ln(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Hr(t) {
  const e = W(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = K(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = he(n) !== s || he(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Vr(t) {
  return j(t) ? t : t.contextElement;
}
function xt(t) {
  const e = Vr(t);
  if (!K(e))
    return Y(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Hr(e);
  let o = (s ? he(n.width) : n.width) / i, a = (s ? he(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Sl = /* @__PURE__ */ Y(0);
function qr(t) {
  const e = M(t);
  return !Nn() || !e.visualViewport ? Sl : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Cl(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== M(t) ? !1 : e;
}
function Ut(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = Vr(t);
  let o = Y(1);
  e && (i ? j(i) && (o = xt(i)) : o = xt(t));
  const a = Cl(s, n, i) ? qr(s) : Y(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), m = i && j(i) ? M(i) : i;
    let y = f, v = ln(y);
    for (; v && i && m !== y; ) {
      const h = xt(v), g = v.getBoundingClientRect(), x = W(v), E = g.left + (v.clientLeft + parseFloat(x.paddingLeft)) * h.x, I = g.top + (v.clientTop + parseFloat(x.paddingTop)) * h.y;
      l *= h.x, c *= h.y, u *= h.x, d *= h.y, l += E, c += I, y = M(v), v = ln(y);
    }
  }
  return ge({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function kn(t, e) {
  const n = Ne(t).scrollLeft;
  return e ? e.left + n : Ut(X(t)).left + n;
}
function Ur(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), r = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    kn(t, i)
  )), s = i.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Tl(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = X(i), a = e ? $e(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Y(1);
  const u = Y(0), d = K(i);
  if ((d || !d && !s) && (($t(i) !== "body" || Gt(o)) && (l = Ne(i)), K(i))) {
    const m = Ut(i);
    c = xt(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const f = o && !d && !s ? Ur(o, l, !0) : Y(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Ol(t) {
  return Array.from(t.getClientRects());
}
function Al(t) {
  const e = X(t), n = Ne(t), i = t.ownerDocument.body, r = wt(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = wt(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + kn(t);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += wt(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function $l(t, e) {
  const n = M(t), i = X(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Nn();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Nl(t, e) {
  const n = Ut(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = K(t) ? xt(t) : Y(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function ai(t, e, n) {
  let i;
  if (e === "viewport")
    i = $l(t, n);
  else if (e === "document")
    i = Al(X(t));
  else if (j(e))
    i = Nl(e, n);
  else {
    const r = qr(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return ge(i);
}
function Yr(t, e) {
  const n = st(t);
  return n === e || !j(n) || Et(n) ? !1 : W(n).position === "fixed" || Yr(n, e);
}
function kl(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Wr(t, []).filter((a) => j(a) && $t(a) !== "body"), r = null;
  const s = W(t).position === "fixed";
  let o = s ? st(t) : t;
  for (; j(o) && !Et(o); ) {
    const a = W(o), l = $n(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Gt(o) && !l && Yr(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = st(o);
  }
  return e.set(t, i), i;
}
function Rl(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? $e(e) ? [] : kl(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = ai(e, u, r);
    return c.top = wt(d.top, c.top), c.right = on(d.right, c.right), c.bottom = on(d.bottom, c.bottom), c.left = wt(d.left, c.left), c;
  }, ai(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Ll(t) {
  const {
    width: e,
    height: n
  } = Hr(t);
  return {
    width: e,
    height: n
  };
}
function Ml(t, e, n) {
  const i = K(e), r = X(e), s = n === "fixed", o = Ut(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Y(0);
  function c() {
    l.x = kn(r);
  }
  if (i || !i && !s)
    if (($t(e) !== "body" || Gt(r)) && (a = Ne(e)), i) {
      const m = Ut(e, !0, s, e);
      l.x = m.x + e.clientLeft, l.y = m.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Ur(r, a) : Y(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Pe(t) {
  return W(t).position === "static";
}
function li(t, e) {
  if (!K(t) || W(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return X(t) === n && (n = n.ownerDocument.body), n;
}
function Kr(t, e) {
  const n = M(t);
  if ($e(t))
    return n;
  if (!K(t)) {
    let r = st(t);
    for (; r && !Et(r); ) {
      if (j(r) && !Pe(r))
        return r;
      r = st(r);
    }
    return n;
  }
  let i = li(t, e);
  for (; i && El(i) && Pe(i); )
    i = li(i, e);
  return i && Et(i) && Pe(i) && !$n(i) ? n : i || Il(t) || n;
}
const Fl = async function(t) {
  const e = this.getOffsetParent || Kr, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Ml(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Dl(t) {
  return W(t).direction === "rtl";
}
const Pl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Tl,
  getDocumentElement: X,
  getClippingRect: Rl,
  getOffsetParent: Kr,
  getElementRects: Fl,
  getClientRects: Ol,
  getDimensions: Ll,
  getScale: xt,
  isElement: j,
  isRTL: Dl
}, me = xl, be = _l, ve = yl, ye = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Pl,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return vl(t, e, {
    ...r,
    platform: s
  });
};
function zl(t) {
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
    // Will be populated when menu opens
    anchor: "bottom",
    pixelOffset: 3,
    isSubmenuActive: !1,
    navThrottle: 100,
    _lastNavAt: 0,
    selfId: null,
    // --- INIT ---
    init() {
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentEl = this.$el, this.triggerEl = this.$refs.trigger, this.anchor = this.$el.dataset.anchor || "bottom", this.pixelOffset = parseInt(this.$el.dataset.offset) || 6, this.isModal = this.$el.dataset.modal !== "false", this.$watch("open", (e) => {
        e ? (this._lastNavAt = 0, this.$nextTick(() => {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), ye(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [me(this.pixelOffset), ve(), be({ padding: 8 })]
      }).then(({ x: e, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${e}px`, top: `${n}px` });
      }));
    },
    toggle() {
      if (this.open) {
        this.open = !1;
        let e = this;
        this.$nextTick(() => e.triggerEl?.focus());
      } else
        this.open = !0, this.focusedIndex = -1;
    },
    handleOutsideClick() {
      if (!this.open) return;
      this.open = !1;
      let e = this;
      this.$nextTick(() => e.triggerEl?.focus());
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
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      if (n.getAttribute("aria-haspopup") === "menu") {
        t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = !1;
      let i = this;
      this.$nextTick(() => i.triggerEl?.focus());
    },
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      this.focusSelectedItem(n), n.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
    },
    handleWindowEscape() {
      if (this.open) {
        this.open = !1;
        let e = this;
        this.$nextTick(() => e.triggerEl?.focus());
      }
    },
    handleContentTabKey() {
      if (this.open) {
        this.open = !1;
        let e = this;
        this.$nextTick(() => e.triggerEl?.focus());
      }
    },
    handleTriggerMouseover() {
      let e = this;
      this.$nextTick(() => e.$el.firstElementChild?.focus());
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
      const e = this.$el.dataset.parentId;
      if (e) {
        const n = document.getElementById(e);
        n && (this.parentDropdown = t.$data(n));
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
    updatePosition(e) {
      !this.triggerEl || !e || ye(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [me(this.pixelOffset), ve(), be({ padding: 8 })]
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
      const e = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      e && Array.from(e).some((i) => t.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(e = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, e && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
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
function Bl(t) {
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
function jl(t) {
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
function Wl(t) {
  t.data("rzEmpty", () => {
  });
}
function Hl(t) {
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
function Vl(t) {
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
function ql(t, e) {
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
function Ul(t) {
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
function Yl(t, e) {
  t.data("rzNavigationMenu", () => ({
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
      !o || !a || (ye(o, a, {
        placement: "bottom-start",
        middleware: [me(6), ve(), be({ padding: 8 })]
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
function Kl(t) {
  t.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    init() {
      this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (e) => {
        this.ariaExpanded = e.toString(), e && this.$nextTick(() => this.updatePosition());
      });
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const e = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(me({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(ve()), a && c.push(be({ padding: l })), ye(this.triggerEl, this.contentEl, {
        placement: e,
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
function Gl(t) {
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
function Jl(t) {
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
function Zl(t) {
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
function Xl(t) {
  t.data("rzSheet", () => ({
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
function Ql(t) {
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
function tc(t) {
  t.data("rzSidebar", () => ({
    open: !1,
    openMobile: !1,
    isMobile: !1,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas", this.shortcut = this.$el.dataset.shortcut || "b", this.cookieName = this.$el.dataset.cookieName || "sidebar_state", this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const e = this.cookieName ? document.cookie.split("; ").find((i) => i.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, n = this.$el.dataset.defaultOpen === "true";
      this.open = e !== null ? e === "true" : n, this.checkIfMobile(), window.addEventListener("keydown", (i) => {
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
async function ec(t) {
  t = [...t].sort();
  const e = t.join("|"), i = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function zt(t, e, n) {
  ec(t).then((i) => {
    nt.isDefined(i) || nt(
      t,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), nt.ready([i], e);
  });
}
function nc(t) {
  tl(t), el(t), nl(t), il(t), rl(t), sl(t, zt), ol(t), al(t, zt), ll(t), cl(t, zt), zl(t), Bl(t), jl(t), Wl(t), Hl(t), Vl(t), ql(t, zt), Yl(t), Ul(t), Kl(t), Gl(t), Jl(t), Zl(t), Xl(t), Ql(t), tc(t);
}
window.RizzyUI = window.RizzyUI || {};
window.RizzyUI.registeredModules = window.RizzyUI.registeredModules || /* @__PURE__ */ new Set();
function ic(t) {
  t.directive("rz-init", (e) => {
    queueMicrotask(() => {
      if (e.__rzInitRan) return;
      const n = e.__rzComponent;
      if (!n || typeof n.__initData != "function") return;
      let i = {};
      try {
        i = JSON.parse(e.getAttribute("x-rz-init") || "{}");
      } catch (r) {
        console.warn("[RizzyUI] x-rz-init JSON parse failed.", r, e);
      }
      n.__initData(i), e.__rzInitRan = !0;
    });
  });
}
window.RizzyUI.registerModuleOnce = async (t, e) => {
  if (!window.RizzyUI.registeredModules.has(t)) {
    window.RizzyUI.registeredModules.add(t);
    try {
      const i = await import(new URL(e, document.baseURI).toString()), r = i && i.default;
      if (typeof r != "function") {
        console.error(`[RizzyUI] '${e}' did not export a default function.`);
        return;
      }
      const s = (o) => o !== void 0 ? r(o) : {
        __inited: !1,
        __initData(a) {
          if (this.__inited) return;
          const l = r(a ?? {});
          Object.assign(this, l), typeof l.init == "function" && queueMicrotask(() => l.init.call(this)), this.__inited = !0;
        },
        init() {
          this.$el.__rzComponent = this;
        }
      };
      Alpine.data(t, s);
    } catch (n) {
      console.error(`[RizzyUI] Failed to load/register '${t}' from '${e}'.`, n);
    }
  }
};
function rc(t) {
  t.directive("mobile", (e, { modifiers: n, expression: i }, { cleanup: r }) => {
    const s = n.find((g) => g.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(i && i.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      e.dataset.mobile = "false", e.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (g) => {
      e.dataset.mobile = g ? "true" : "false", e.dataset.screen = g ? "mobile" : "desktop";
    }, u = () => typeof t.$data == "function" ? t.$data(e) : e.__x ? e.__x.$data : null, d = (g) => {
      if (!a) return;
      const x = u();
      x && (x[i] = g);
    }, f = (g) => {
      e.dispatchEvent(
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
function sc(t) {
  const e = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (v, h, g) => {
      const E = h.replace(/\[(\d+)\]/g, ".$1").split("."), I = E.pop();
      let w = v;
      for (const p of E)
        (w[p] == null || typeof w[p] != "object") && (w[p] = isFinite(+p) ? [] : {}), w = w[p];
      w[I] = g;
    }, l = t.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
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
        const I = t.evaluate(n, v.childPath, { scope: c });
        g.fromChild = !0, a(u, v.parentPath, I), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const I = t.evaluate(n, v.parentPath, { scope: u });
        g.fromParent = !0, a(c, v.childPath, I), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const x = o(() => {
        const I = t.evaluate(n, v.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, v.childPath, I), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), E = o(() => {
        const I = t.evaluate(n, v.childPath, { scope: c });
        if (!g.fromParent) {
          if (g.skipChildOnce) {
            g.skipChildOnce = !1;
            return;
          }
          g.fromChild = !0, a(u, v.parentPath, I), queueMicrotask(() => {
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
  t.directive("sync", e);
}
G.plugin(ua);
G.plugin(ga);
G.plugin(Fa);
nc(G);
ic(G);
rc(G);
sc(G);
const oc = {
  Alpine: G,
  require: zt,
  toast: Ga,
  $data: Qa
};
window.Alpine = G;
window.Rizzy = { ...window.Rizzy || {}, ...oc };
G.start();
export {
  oc as default
};
