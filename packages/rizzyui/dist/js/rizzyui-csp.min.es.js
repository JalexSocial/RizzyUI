var Ke = !1, Je = !1, ft = [], Ge = -1, vi = !1;
function Sr(e) {
  $r(e);
}
function Cr() {
  vi = !0;
}
function Ar() {
  vi = !1, Dn();
}
function $r(e) {
  ft.includes(e) || ft.push(e), Dn();
}
function Or(e) {
  let t = ft.indexOf(e);
  t !== -1 && t > Ge && ft.splice(t, 1);
}
function Dn() {
  if (!Je && !Ke) {
    if (vi)
      return;
    Ke = !0, queueMicrotask(kr);
  }
}
function kr() {
  Ke = !1, Je = !0;
  for (let e = 0; e < ft.length; e++)
    ft[e](), Ge = e;
  ft.length = 0, Ge = -1, Je = !1;
}
var Mt, $t, Rt, Nn, Xe = !0;
function Dr(e) {
  Xe = !1, e(), Xe = !0;
}
function Nr(e) {
  Mt = e.reactive, Rt = e.release, $t = (t) => e.effect(t, { scheduler: (i) => {
    Xe ? Sr(i) : i();
  } }), Nn = e.raw;
}
function ji(e) {
  $t = e;
}
function Lr(e) {
  let t = () => {
  };
  return [(n) => {
    let s = $t(n);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((r) => r());
    }), e._x_effects.add(s), t = () => {
      s !== void 0 && (e._x_effects.delete(s), Rt(s));
    }, s;
  }, () => {
    t();
  }];
}
function Ln(e, t) {
  let i = !0, n, s = $t(() => {
    let r = e();
    if (JSON.stringify(r), !i && (typeof r == "object" || r !== n)) {
      let a = n;
      queueMicrotask(() => {
        t(r, a);
      });
    }
    n = r, i = !1;
  });
  return () => Rt(s);
}
async function Pr(e) {
  Cr();
  try {
    await e(), await Promise.resolve();
  } finally {
    Ar();
  }
}
var Pn = [], Mn = [], Rn = [];
function Mr(e) {
  Rn.push(e);
}
function yi(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Mn.push(t));
}
function Fn(e) {
  Pn.push(e);
}
function zn(e, t, i) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(i);
}
function Vn(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([i, n]) => {
    (t === void 0 || t.includes(i)) && (n.forEach((s) => s()), delete e._x_attributeCleanups[i]);
  });
}
function Rr(e) {
  for (e._x_effects?.forEach(Or); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var bi = new MutationObserver(Ei), wi = !1;
function xi() {
  bi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), wi = !0;
}
function Un() {
  Fr(), bi.disconnect(), wi = !1;
}
var Bt = [];
function Fr() {
  let e = bi.takeRecords();
  Bt.push(() => e.length > 0 && Ei(e));
  let t = Bt.length;
  queueMicrotask(() => {
    if (Bt.length === t)
      for (; Bt.length > 0; )
        Bt.shift()();
  });
}
function L(e) {
  if (!wi)
    return e();
  Un();
  let t = e();
  return xi(), t;
}
var Ii = !1, xe = [];
function zr() {
  Ii = !0;
}
function Vr() {
  Ii = !1, Ei(xe), xe = [];
}
function Ei(e) {
  if (Ii) {
    xe = xe.concat(e);
    return;
  }
  let t = [], i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let r = 0; r < e.length; r++)
    if (!e[r].target._x_ignoreMutationObserver && (e[r].type === "childList" && (e[r].removedNodes.forEach((a) => {
      a.nodeType === 1 && a._x_marker && i.add(a);
    }), e[r].addedNodes.forEach((a) => {
      if (a.nodeType === 1) {
        if (i.has(a)) {
          i.delete(a);
          return;
        }
        a._x_marker || t.push(a);
      }
    })), e[r].type === "attributes")) {
      let a = e[r].target, o = e[r].attributeName, l = e[r].oldValue, f = () => {
        n.has(a) || n.set(a, []), n.get(a).push({ name: o, value: a.getAttribute(o) });
      }, m = () => {
        s.has(a) || s.set(a, []), s.get(a).push(o);
      };
      a.hasAttribute(o) && l === null ? f() : a.hasAttribute(o) ? (m(), f()) : m();
    }
  s.forEach((r, a) => {
    Vn(a, r);
  }), n.forEach((r, a) => {
    Pn.forEach((o) => o(a, r));
  });
  for (let r of i)
    t.some((a) => a.contains(r)) || Mn.forEach((a) => a(r));
  for (let r of t)
    r.isConnected && Rn.forEach((a) => a(r));
  t = null, i = null, n = null, s = null;
}
function Bn(e) {
  return at(bt(e));
}
function se(e, t, i) {
  return e._x_dataStack = [t, ...bt(i || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
  };
}
function bt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? bt(e.host) : e.parentNode ? bt(e.parentNode) : [];
}
function at(e) {
  return new Proxy({ objects: e }, Ur);
}
var Ur = {
  ownKeys({ objects: e }) {
    return Array.from(
      new Set(e.flatMap((t) => Object.keys(t)))
    );
  },
  has({ objects: e }, t) {
    return t == Symbol.unscopables ? !1 : e.some(
      (i) => Object.prototype.hasOwnProperty.call(i, t) || Reflect.has(i, t)
    );
  },
  get({ objects: e }, t, i) {
    return t == "toJSON" ? Br : Reflect.get(
      e.find(
        (n) => Reflect.has(n, t)
      ) || {},
      t,
      i
    );
  },
  set({ objects: e }, t, i, n) {
    const s = e.find(
      (a) => Object.prototype.hasOwnProperty.call(a, t)
    ) || e[e.length - 1], r = Object.getOwnPropertyDescriptor(s, t);
    return r?.set && r?.get ? r.set.call(n, i) || !0 : Reflect.set(s, t, i);
  }
};
function Br() {
  return Reflect.ownKeys(this).reduce((t, i) => (t[i] = Reflect.get(this, i), t), {});
}
function _i(e) {
  let t = (n) => typeof n == "object" && !Array.isArray(n) && n !== null, i = (n, s = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([r, { value: a, enumerable: o }]) => {
      if (o === !1 || a === void 0 || typeof a == "object" && a !== null && a.__v_skip)
        return;
      let l = s === "" ? r : `${s}.${r}`;
      typeof a == "object" && a !== null && a._x_interceptor ? n[r] = a.initialize(e, l, r) : t(a) && a !== n && !(a instanceof Element) && i(a, l);
    });
  };
  return i(e);
}
function Hn(e, t = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, s, r) {
      return e(this.initialValue, () => Hr(n, s), (a) => Ze(n, s, a), s, r);
    }
  };
  return t(i), (n) => {
    if (typeof n == "object" && n !== null && n._x_interceptor) {
      let s = i.initialize.bind(i);
      i.initialize = (r, a, o) => {
        let l = n.initialize(r, a, o);
        return i.initialValue = l, s(r, a, o);
      };
    } else
      i.initialValue = n;
    return i;
  };
}
function Hr(e, t) {
  return t.split(".").reduce((i, n) => i[n], e);
}
function Ze(e, t, i) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = i;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Ze(e[t[0]], t.slice(1), i);
  }
}
var qn = {};
function Y(e, t) {
  qn[e] = t;
}
function Qt(e, t) {
  let i = qr(t);
  return Object.entries(qn).forEach(([n, s]) => {
    Object.defineProperty(e, `$${n}`, {
      get() {
        return s(t, i);
      },
      enumerable: !1
    });
  }), e;
}
function qr(e) {
  let [t, i] = Qn(e), n = { interceptor: Hn, ...t };
  return yi(e, i), n;
}
function jn(e, t, i, ...n) {
  try {
    return i(...n);
  } catch (s) {
    Dt(s, e, t);
  }
}
function Dt(...e) {
  return Wn(...e);
}
var Wn = Wr;
function jr(e) {
  Wn = e;
}
function Wr(e, t, i = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: i }
  ), console.warn(`Alpine Expression Error: ${e.message}

${i ? 'Expression: "' + i + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var pt = !0;
function Yn(e) {
  let t = pt;
  pt = !1;
  let i = e();
  return pt = t, i;
}
function mt(e, t, i = {}) {
  let n;
  return V(e, t)((s) => n = s, i), n;
}
function V(...e) {
  return Kn(...e);
}
var Kn = Jr;
function Yr(e) {
  Kn = e;
}
var Jn;
function Kr(e) {
  Jn = e;
}
function Jr(e, t) {
  let i = {};
  Qt(i, e);
  let n = [i, ...bt(e)], s = typeof t == "function" ? Gn(n, t) : Xr(n, t, e);
  return jn.bind(null, e, t, s);
}
function Gn(e, t) {
  return (i = () => {
  }, { scope: n = {}, params: s = [], context: r } = {}) => {
    if (!pt) {
      te(i, t, at([n, ...e]), s);
      return;
    }
    let a = t.apply(at([n, ...e]), s);
    te(i, a);
  };
}
var Ue = {};
function Gr(e, t) {
  if (Ue[e])
    return Ue[e];
  let i = Object.getPrototypeOf(async function() {
  }).constructor, n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, r = (() => {
    try {
      let a = new i(
        ["__self", "scope"],
        `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${e}`
      }), a;
    } catch (a) {
      return Dt(a, t, e), Promise.resolve();
    }
  })();
  return Ue[e] = r, r;
}
function Xr(e, t, i) {
  let n = Gr(t, i);
  return (s = () => {
  }, { scope: r = {}, params: a = [], context: o } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = at([r, ...e]);
    if (typeof n == "function") {
      let f = n.call(o, n, l).catch((m) => Dt(m, i, t));
      n.finished ? (te(s, n.result, l, a, i), n.result = void 0) : f.then((m) => {
        te(s, m, l, a, i);
      }).catch((m) => Dt(m, i, t)).finally(() => n.result = void 0);
    }
  };
}
function te(e, t, i, n, s) {
  if (pt && typeof t == "function") {
    let r = t.apply(i, n);
    r instanceof Promise ? r.then((a) => te(e, a, i, n)).catch((a) => Dt(a, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function Zr(...e) {
  return Jn(...e);
}
var Ti = "x-";
function Ft(e = "") {
  return Ti + e;
}
function Qr(e) {
  Ti = e;
}
var Ie = {};
function P(e, t) {
  return Ie[e] = t, {
    before(i) {
      if (!Ie[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const n = ht.indexOf(i);
      ht.splice(n >= 0 ? n : ht.indexOf("DEFAULT"), 0, e);
    }
  };
}
function ta(e) {
  return Object.keys(Ie).includes(e);
}
function Si(e, t, i) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), a = Xn(r);
    r = r.map((o) => a.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(r);
  }
  let n = {};
  return t.map(is((r, a) => n[r] = a)).filter(ss).map(na(n, i)).sort(sa).map((r) => ia(e, r));
}
function Xn(e) {
  return Array.from(e).map(is()).filter((t) => !ss(t));
}
var Qe = !1, Gt = /* @__PURE__ */ new Map(), Zn = Symbol();
function ea(e) {
  Qe = !0;
  let t = Symbol();
  Zn = t, Gt.set(t, []);
  let i = () => {
    for (; Gt.get(t).length; )
      Gt.get(t).shift()();
    Gt.delete(t);
  }, n = () => {
    Qe = !1, i();
  };
  e(i), n();
}
function Qn(e) {
  let t = [], i = (o) => t.push(o), [n, s] = Lr(e);
  return t.push(s), [{
    Alpine: Vt,
    effect: n,
    cleanup: i,
    evaluateLater: V.bind(V, e),
    evaluate: mt.bind(mt, e)
  }, () => t.forEach((o) => o())];
}
function ia(e, t) {
  let i = () => {
  }, n = Ie[t.type] || i, [s, r] = Qn(e);
  zn(e, t.original, r);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, s), n = n.bind(n, e, t, s), Qe ? Gt.get(Zn).push(n) : n());
  };
  return a.runCleanups = r, a;
}
var ts = (e, t) => ({ name: i, value: n }) => (i.startsWith(e) && (i = i.replace(e, t)), { name: i, value: n }), es = (e) => e;
function is(e = () => {
}) {
  return ({ name: t, value: i }) => {
    let { name: n, value: s } = ns.reduce((r, a) => a(r), { name: t, value: i });
    return n !== t && e(n, t), { name: n, value: s };
  };
}
var ns = [];
function Ci(e) {
  ns.push(e);
}
function ss({ name: e }) {
  return rs().test(e);
}
var rs = () => new RegExp(`^${Ti}([^:^.]+)\\b`);
function na(e, t) {
  return ({ name: i, value: n }) => {
    i === n && (n = "");
    let s = i.match(rs()), r = i.match(/:([a-zA-Z0-9\-_:]+)/), a = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[i] || i;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: a.map((l) => l.replace(".", "")),
      expression: n,
      original: o
    };
  };
}
var ti = "DEFAULT", ht = [
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
  ti,
  "teleport"
];
function sa(e, t) {
  let i = ht.indexOf(e.type) === -1 ? ti : e.type, n = ht.indexOf(t.type) === -1 ? ti : t.type;
  return ht.indexOf(i) - ht.indexOf(n);
}
function Xt(e, t, i = {}) {
  e.dispatchEvent(
    new CustomEvent(t, {
      detail: i,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0
    })
  );
}
function wt(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => wt(s, t));
    return;
  }
  let i = !1;
  if (t(e, () => i = !0), i)
    return;
  let n = e.firstElementChild;
  for (; n; )
    wt(n, t), n = n.nextElementSibling;
}
function H(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Wi = !1;
function ra() {
  Wi && H("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Wi = !0, document.body || H("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Xt(document, "alpine:init"), Xt(document, "alpine:initializing"), xi(), Mr((t) => tt(t, wt)), yi((t) => zt(t)), Fn((t, i) => {
    Si(t, i).forEach((n) => n());
  });
  let e = (t) => !Oe(t.parentElement, !0);
  Array.from(document.querySelectorAll(ls().join(","))).filter(e).forEach((t) => {
    tt(t);
  }), Xt(document, "alpine:initialized"), setTimeout(() => {
    ca();
  });
}
var Ai = [], as = [];
function os() {
  return Ai.map((e) => e());
}
function ls() {
  return Ai.concat(as).map((e) => e());
}
function cs(e) {
  Ai.push(e);
}
function us(e) {
  as.push(e);
}
function Oe(e, t = !1) {
  return xt(e, (i) => {
    if ((t ? ls() : os()).some((s) => i.matches(s)))
      return !0;
  });
}
function xt(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), e.parentNode instanceof ShadowRoot)
      return xt(e.parentNode.host, t);
    if (e.parentElement)
      return xt(e.parentElement, t);
  }
}
function aa(e) {
  return os().some((t) => e.matches(t));
}
var ds = [];
function oa(e) {
  ds.push(e);
}
var la = 1;
function tt(e, t = wt, i = () => {
}) {
  xt(e, (n) => n._x_ignore) || ea(() => {
    t(e, (n, s) => {
      n._x_marker || (i(n, s), ds.forEach((r) => r(n, s)), Si(n, n.attributes).forEach((r) => r()), n._x_ignore || (n._x_marker = la++), n._x_ignore && s());
    });
  });
}
function zt(e, t = wt) {
  t(e, (i) => {
    Rr(i), Vn(i), delete i._x_marker;
  });
}
function ca() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, i, n]) => {
    ta(i) || n.some((s) => {
      if (document.querySelector(s))
        return H(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var ei = [], $i = !1;
function Oi(e = () => {
}) {
  return queueMicrotask(() => {
    $i || setTimeout(() => {
      ii();
    });
  }), new Promise((t) => {
    ei.push(() => {
      e(), t();
    });
  });
}
function ii() {
  for ($i = !1; ei.length; )
    ei.shift()();
}
function ua() {
  $i = !0;
}
function ki(e, t) {
  return Array.isArray(t) ? Yi(e, t.join(" ")) : typeof t == "object" && t !== null ? da(e, t) : typeof t == "function" ? ki(e, t()) : Yi(e, t);
}
function Yi(e, t) {
  let i = (s) => s.split(" ").filter((r) => !e.classList.contains(r)).filter(Boolean), n = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", n(i(t));
}
function da(e, t) {
  let i = (o) => o.split(" ").filter(Boolean), n = Object.entries(t).flatMap(([o, l]) => l ? i(o) : !1).filter(Boolean), s = Object.entries(t).flatMap(([o, l]) => l ? !1 : i(o)).filter(Boolean), r = [], a = [];
  return s.forEach((o) => {
    e.classList.contains(o) && (e.classList.remove(o), a.push(o));
  }), n.forEach((o) => {
    e.classList.contains(o) || (e.classList.add(o), r.push(o));
  }), () => {
    a.forEach((o) => e.classList.add(o)), r.forEach((o) => e.classList.remove(o));
  };
}
function ke(e, t) {
  return typeof t == "object" && t !== null ? ha(e, t) : fa(e, t);
}
function ha(e, t) {
  let i = {};
  return Object.entries(t).forEach(([n, s]) => {
    i[n] = e.style[n], n.startsWith("--") || (n = pa(n)), e.style.setProperty(n, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    ke(e, i);
  };
}
function fa(e, t) {
  let i = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", i || "");
  };
}
function pa(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ni(e, t = () => {
}) {
  let i = !1;
  return function() {
    i ? t.apply(this, arguments) : (i = !0, e.apply(this, arguments));
  };
}
P("transition", (e, { value: t, modifiers: i, expression: n }, { evaluate: s }) => {
  typeof n == "function" && (n = s(n)), n !== !1 && (!n || typeof n == "boolean" ? ga(e, i, t) : ma(e, n, t));
});
function ma(e, t, i) {
  hs(e, ki, ""), {
    enter: (s) => {
      e._x_transition.enter.during = s;
    },
    "enter-start": (s) => {
      e._x_transition.enter.start = s;
    },
    "enter-end": (s) => {
      e._x_transition.enter.end = s;
    },
    leave: (s) => {
      e._x_transition.leave.during = s;
    },
    "leave-start": (s) => {
      e._x_transition.leave.start = s;
    },
    "leave-end": (s) => {
      e._x_transition.leave.end = s;
    }
  }[i](t);
}
function ga(e, t, i) {
  hs(e, ke);
  let n = !t.includes("in") && !t.includes("out") && !i, s = n || t.includes("in") || ["enter"].includes(i), r = n || t.includes("out") || ["leave"].includes(i);
  t.includes("in") && !n && (t = t.filter((h, p) => p < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((h, p) => p > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), l = a || t.includes("scale"), f = o ? 0 : 1, m = l ? Ht(t, "scale", 95) / 100 : 1, b = Ht(t, "delay", 0) / 1e3, I = Ht(t, "origin", "center"), y = "opacity, transform", u = Ht(t, "duration", 150) / 1e3, d = Ht(t, "duration", 75) / 1e3, c = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: I,
    transitionDelay: `${b}s`,
    transitionProperty: y,
    transitionDuration: `${u}s`,
    transitionTimingFunction: c
  }, e._x_transition.enter.start = {
    opacity: f,
    transform: `scale(${m})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: I,
    transitionDelay: `${b}s`,
    transitionProperty: y,
    transitionDuration: `${d}s`,
    transitionTimingFunction: c
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: f,
    transform: `scale(${m})`
  });
}
function hs(e, t, i = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, s = () => {
    }) {
      si(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, s);
    },
    out(n = () => {
    }, s = () => {
    }) {
      si(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, n, s);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, i, n) {
  const s = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let r = () => s(i);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(i) : r() : e._x_transition ? e._x_transition.in(i) : r();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((a, o) => {
    e._x_transition.out(() => {
    }, () => a(n)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(n), queueMicrotask(() => {
    let a = fs(e);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(e)) : s(() => {
      let o = (l) => {
        let f = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(o)
        ]).then(([m]) => m?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, f;
      };
      o(e).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function fs(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : fs(t);
}
function si(e, t, { during: i, start: n, end: s } = {}, r = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(s).length === 0) {
    r(), a();
    return;
  }
  let o, l, f;
  va(e, {
    start() {
      o = t(e, n);
    },
    during() {
      l = t(e, i);
    },
    before: r,
    end() {
      o(), f = t(e, s);
    },
    after: a,
    cleanup() {
      l(), f();
    }
  });
}
function va(e, t) {
  let i, n, s, r = ni(() => {
    L(() => {
      i = !0, n || t.before(), s || (t.end(), ii()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: ni(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, L(() => {
    t.start(), t.during();
  }), ua(), requestAnimationFrame(() => {
    if (i)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), L(() => {
      t.before();
    }), n = !0, requestAnimationFrame(() => {
      i || (L(() => {
        t.end();
      }), ii(), setTimeout(e._x_transitioning.finish, a + o), s = !0);
    });
  });
}
function Ht(e, t, i) {
  if (e.indexOf(t) === -1)
    return i;
  const n = e[e.indexOf(t) + 1];
  if (!n || t === "scale" && isNaN(n))
    return i;
  if (t === "duration" || t === "delay") {
    let s = n.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [n, e[e.indexOf(t) + 2]].join(" ") : n;
}
var ot = !1;
function ut(e, t = () => {
}) {
  return (...i) => ot ? t(...i) : e(...i);
}
function ya(e) {
  return (...t) => ot && e(...t);
}
var ps = [];
function De(e) {
  ps.push(e);
}
function ba(e, t) {
  ps.forEach((i) => i(e, t)), ot = !0, ms(() => {
    tt(t, (i, n) => {
      n(i, () => {
      });
    });
  }), ot = !1;
}
var ri = !1;
function wa(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ot = !0, ri = !0, ms(() => {
    xa(t);
  }), ot = !1, ri = !1;
}
function xa(e) {
  let t = !1;
  tt(e, (n, s) => {
    wt(n, (r, a) => {
      if (t && aa(r))
        return a();
      t = !0, s(r, a);
    });
  });
}
function ms(e) {
  let t = $t;
  ji((i, n) => {
    let s = t(i);
    return Rt(s), () => {
    };
  }), e(), ji(t);
}
function gs(e, t, i, n = []) {
  switch (e._x_bindings || (e._x_bindings = Mt({})), e._x_bindings[t] = i, t = n.includes("camel") ? $a(t) : t, t) {
    case "value":
      Ia(e, i);
      break;
    case "style":
      _a(e, i);
      break;
    case "class":
      Ea(e, i);
      break;
    case "selected":
    case "checked":
      Ta(e, t, i);
      break;
    default:
      vs(e, t, i);
      break;
  }
}
function Ia(e, t) {
  if (ws(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = be(e.value) === t : e.checked = Ki(e.value, t));
  else if (Di(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((i) => Ki(i, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Aa(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Ea(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = ki(e, t);
}
function _a(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = ke(e, t);
}
function Ta(e, t, i) {
  vs(e, t, i), Ca(e, t, i);
}
function vs(e, t, i) {
  [null, void 0, !1].includes(i) && ka(t) ? e.removeAttribute(t) : (ys(t) && (i = t), Sa(e, t, i));
}
function Sa(e, t, i) {
  e.getAttribute(t) != i && e.setAttribute(t, i);
}
function Ca(e, t, i) {
  e[t] !== i && (e[t] = i);
}
function Aa(e, t) {
  const i = [].concat(t).map((n) => n + "");
  Array.from(e.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function $a(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Ki(e, t) {
  return e == t;
}
function be(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Oa = /* @__PURE__ */ new Set([
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
function ys(e) {
  return Oa.has(e);
}
function ka(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Da(e, t, i) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : bs(e, t, i);
}
function Na(e, t, i, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = n, Yn(() => mt(e, s.expression));
  }
  return bs(e, t, i);
}
function bs(e, t, i) {
  let n = e.getAttribute(t);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : ys(t) ? !![t, "true"].includes(n) : n;
}
function Di(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function ws(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function xs(e, t) {
  let i;
  return function() {
    const n = this, s = arguments, r = function() {
      i = null, e.apply(n, s);
    };
    clearTimeout(i), i = setTimeout(r, t);
  };
}
function Is(e, t) {
  let i;
  return function() {
    let n = this, s = arguments;
    i || (e.apply(n, s), i = !0, setTimeout(() => i = !1, t));
  };
}
function Es({ get: e, set: t }, { get: i, set: n }) {
  let s = !0, r, a = $t(() => {
    let o = e(), l = i();
    if (s)
      n(Be(o)), s = !1;
    else {
      let f = JSON.stringify(o), m = JSON.stringify(l);
      f !== r ? n(Be(o)) : f !== m && t(Be(l));
    }
    r = JSON.stringify(e()), JSON.stringify(i());
  });
  return () => {
    Rt(a);
  };
}
function Be(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function La(e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => i(Vt));
}
var dt = {}, Ji = !1;
function Pa(e, t) {
  if (Ji || (dt = Mt(dt), Ji = !0), t === void 0)
    return dt[e];
  dt[e] = t, _i(dt[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && dt[e].init();
}
function Ma() {
  return dt;
}
var _s = {};
function Ra(e, t) {
  let i = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Ts(e, i()) : (_s[e] = i, () => {
  });
}
function Fa(e) {
  return Object.entries(_s).forEach(([t, i]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), e;
}
function Ts(e, t, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let s = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), r = Xn(s);
  return s = s.map((a) => r.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), Si(e, s, i).map((a) => {
    n.push(a.runCleanups), a();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var Ss = {};
function za(e, t) {
  Ss[e] = t;
}
function Va(e, t) {
  return Object.entries(Ss).forEach(([i, n]) => {
    Object.defineProperty(e, i, {
      get() {
        return (...s) => n.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var Ua = {
  get reactive() {
    return Mt;
  },
  get release() {
    return Rt;
  },
  get effect() {
    return $t;
  },
  get raw() {
    return Nn;
  },
  get transaction() {
    return Pr;
  },
  version: "3.15.8",
  flushAndStopDeferringMutations: Vr,
  dontAutoEvaluateFunctions: Yn,
  disableEffectScheduling: Dr,
  startObservingMutations: xi,
  stopObservingMutations: Un,
  setReactivityEngine: Nr,
  onAttributeRemoved: zn,
  onAttributesAdded: Fn,
  closestDataStack: bt,
  skipDuringClone: ut,
  onlyDuringClone: ya,
  addRootSelector: cs,
  addInitSelector: us,
  setErrorHandler: jr,
  interceptClone: De,
  addScopeToNode: se,
  deferMutations: zr,
  mapAttributes: Ci,
  evaluateLater: V,
  interceptInit: oa,
  initInterceptors: _i,
  injectMagics: Qt,
  setEvaluator: Yr,
  setRawEvaluator: Kr,
  mergeProxies: at,
  extractProp: Na,
  findClosest: xt,
  onElRemoved: yi,
  closestRoot: Oe,
  destroyTree: zt,
  interceptor: Hn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: si,
  // INTERNAL
  setStyles: ke,
  // INTERNAL
  mutateDom: L,
  directive: P,
  entangle: Es,
  throttle: Is,
  debounce: xs,
  evaluate: mt,
  evaluateRaw: Zr,
  initTree: tt,
  nextTick: Oi,
  prefixed: Ft,
  prefix: Qr,
  plugin: La,
  magic: Y,
  store: Pa,
  start: ra,
  clone: wa,
  // INTERNAL
  cloneNode: ba,
  // INTERNAL
  bound: Da,
  $data: Bn,
  watch: Ln,
  walk: wt,
  data: za,
  bind: Ra
}, Vt = Ua, Gi = /* @__PURE__ */ new WeakMap(), Cs = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e !== "styleMedia" && Cs.add(globalThis[e]);
});
var R = class {
  constructor(e, t, i, n) {
    this.type = e, this.value = t, this.start = i, this.end = n;
  }
}, Ba = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new R("EOF", null, this.position, this.position)), this.tokens;
  }
  skipWhitespace() {
    for (; this.position < this.input.length && /\s/.test(this.input[this.position]); )
      this.position++;
  }
  skipLineComment() {
    for (; this.position < this.input.length && this.input[this.position] !== `
`; )
      this.position++;
  }
  isDigit(e) {
    return /[0-9]/.test(e);
  }
  isAlpha(e) {
    return /[a-zA-Z]/.test(e);
  }
  isAlphaNumeric(e) {
    return /[a-zA-Z0-9_$]/.test(e);
  }
  peek(e = 1) {
    return this.input[this.position + e] || "";
  }
  readNumber() {
    const e = this.position;
    let t = !1;
    for (; this.position < this.input.length; ) {
      const n = this.input[this.position];
      if (this.isDigit(n))
        this.position++;
      else if (n === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const i = this.input.slice(e, this.position);
    this.tokens.push(new R("NUMBER", parseFloat(i), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new R("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new R("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new R("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new R("KEYWORD", t, e, this.position)) : this.tokens.push(new R("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let i = "", n = !1;
    for (; this.position < this.input.length; ) {
      const s = this.input[this.position];
      if (n) {
        switch (s) {
          case "n":
            i += `
`;
            break;
          case "t":
            i += "	";
            break;
          case "r":
            i += "\r";
            break;
          case "\\":
            i += "\\";
            break;
          case t:
            i += t;
            break;
          default:
            i += s;
        }
        n = !1;
      } else if (s === "\\")
        n = !0;
      else if (s === t) {
        this.position++, this.tokens.push(new R("STRING", i, e, this.position));
        return;
      } else
        i += s;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], i = this.peek(), n = this.peek(2);
    if (t === "=" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new R("OPERATOR", "===", e, this.position));
    else if (t === "!" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new R("OPERATOR", "!==", e, this.position));
    else if (t === "=" && i === "=")
      this.position += 2, this.tokens.push(new R("OPERATOR", "==", e, this.position));
    else if (t === "!" && i === "=")
      this.position += 2, this.tokens.push(new R("OPERATOR", "!=", e, this.position));
    else if (t === "<" && i === "=")
      this.position += 2, this.tokens.push(new R("OPERATOR", "<=", e, this.position));
    else if (t === ">" && i === "=")
      this.position += 2, this.tokens.push(new R("OPERATOR", ">=", e, this.position));
    else if (t === "&" && i === "&")
      this.position += 2, this.tokens.push(new R("OPERATOR", "&&", e, this.position));
    else if (t === "|" && i === "|")
      this.position += 2, this.tokens.push(new R("OPERATOR", "||", e, this.position));
    else if (t === "+" && i === "+")
      this.position += 2, this.tokens.push(new R("OPERATOR", "++", e, this.position));
    else if (t === "-" && i === "-")
      this.position += 2, this.tokens.push(new R("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const s = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new R(s, t, e, this.position));
    }
  }
}, Ha = class {
  constructor(e) {
    this.tokens = e, this.position = 0;
  }
  parse() {
    if (this.isAtEnd())
      throw new Error("Empty expression");
    const e = this.parseExpression();
    if (this.match("PUNCTUATION", ";"), !this.isAtEnd())
      throw new Error(`Unexpected token: ${this.current().value}`);
    return e;
  }
  parseExpression() {
    return this.parseAssignment();
  }
  parseAssignment() {
    const e = this.parseTernary();
    if (this.match("OPERATOR", "=")) {
      const t = this.parseAssignment();
      if (e.type === "Identifier" || e.type === "MemberExpression")
        return {
          type: "AssignmentExpression",
          left: e,
          operator: "=",
          right: t
        };
      throw new Error("Invalid assignment target");
    }
    return e;
  }
  parseTernary() {
    const e = this.parseLogicalOr();
    if (this.match("PUNCTUATION", "?")) {
      const t = this.parseExpression();
      this.consume("PUNCTUATION", ":");
      const i = this.parseExpression();
      return {
        type: "ConditionalExpression",
        test: e,
        consequent: t,
        alternate: i
      };
    }
    return e;
  }
  parseLogicalOr() {
    let e = this.parseLogicalAnd();
    for (; this.match("OPERATOR", "||"); ) {
      const t = this.previous().value, i = this.parseLogicalAnd();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: i
      };
    }
    return e;
  }
  parseLogicalAnd() {
    let e = this.parseEquality();
    for (; this.match("OPERATOR", "&&"); ) {
      const t = this.previous().value, i = this.parseEquality();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: i
      };
    }
    return e;
  }
  parseEquality() {
    let e = this.parseRelational();
    for (; this.match("OPERATOR", "==", "!=", "===", "!=="); ) {
      const t = this.previous().value, i = this.parseRelational();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: i
      };
    }
    return e;
  }
  parseRelational() {
    let e = this.parseAdditive();
    for (; this.match("OPERATOR", "<", ">", "<=", ">="); ) {
      const t = this.previous().value, i = this.parseAdditive();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: i
      };
    }
    return e;
  }
  parseAdditive() {
    let e = this.parseMultiplicative();
    for (; this.match("OPERATOR", "+", "-"); ) {
      const t = this.previous().value, i = this.parseMultiplicative();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: i
      };
    }
    return e;
  }
  parseMultiplicative() {
    let e = this.parseUnary();
    for (; this.match("OPERATOR", "*", "/", "%"); ) {
      const t = this.previous().value, i = this.parseUnary();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: i
      };
    }
    return e;
  }
  parseUnary() {
    if (this.match("OPERATOR", "++", "--")) {
      const e = this.previous().value, t = this.parseUnary();
      return {
        type: "UpdateExpression",
        operator: e,
        argument: t,
        prefix: !0
      };
    }
    if (this.match("OPERATOR", "!", "-", "+")) {
      const e = this.previous().value, t = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator: e,
        argument: t,
        prefix: !0
      };
    }
    return this.parsePostfix();
  }
  parsePostfix() {
    let e = this.parseMember();
    return this.match("OPERATOR", "++", "--") ? {
      type: "UpdateExpression",
      operator: this.previous().value,
      argument: e,
      prefix: !1
    } : e;
  }
  parseMember() {
    let e = this.parsePrimary();
    for (; ; )
      if (this.match("PUNCTUATION", ".")) {
        const t = this.consume("IDENTIFIER");
        e = {
          type: "MemberExpression",
          object: e,
          property: { type: "Identifier", name: t.value },
          computed: !1
        };
      } else if (this.match("PUNCTUATION", "[")) {
        const t = this.parseExpression();
        this.consume("PUNCTUATION", "]"), e = {
          type: "MemberExpression",
          object: e,
          property: t,
          computed: !0
        };
      } else if (this.match("PUNCTUATION", "(")) {
        const t = this.parseArguments();
        e = {
          type: "CallExpression",
          callee: e,
          arguments: t
        };
      } else
        break;
    return e;
  }
  parseArguments() {
    const e = [];
    if (!this.check("PUNCTUATION", ")"))
      do
        e.push(this.parseExpression());
      while (this.match("PUNCTUATION", ","));
    return this.consume("PUNCTUATION", ")"), e;
  }
  parsePrimary() {
    if (this.match("NUMBER"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("STRING"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("BOOLEAN"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("NULL"))
      return { type: "Literal", value: null };
    if (this.match("UNDEFINED"))
      return { type: "Literal", value: void 0 };
    if (this.match("IDENTIFIER"))
      return { type: "Identifier", name: this.previous().value };
    if (this.match("PUNCTUATION", "(")) {
      const e = this.parseExpression();
      return this.consume("PUNCTUATION", ")"), e;
    }
    if (this.match("PUNCTUATION", "["))
      return this.parseArrayLiteral();
    if (this.match("PUNCTUATION", "{"))
      return this.parseObjectLiteral();
    throw new Error(`Unexpected token: ${this.current().type} "${this.current().value}"`);
  }
  parseArrayLiteral() {
    const e = [];
    for (; !this.check("PUNCTUATION", "]") && !this.isAtEnd() && (e.push(this.parseExpression()), this.match("PUNCTUATION", ",")); )
      if (this.check("PUNCTUATION", "]"))
        break;
    return this.consume("PUNCTUATION", "]"), {
      type: "ArrayExpression",
      elements: e
    };
  }
  parseObjectLiteral() {
    const e = [];
    for (; !this.check("PUNCTUATION", "}") && !this.isAtEnd(); ) {
      let t, i = !1;
      if (this.match("STRING"))
        t = { type: "Literal", value: this.previous().value };
      else if (this.match("IDENTIFIER"))
        t = { type: "Identifier", name: this.previous().value };
      else if (this.match("PUNCTUATION", "["))
        t = this.parseExpression(), i = !0, this.consume("PUNCTUATION", "]");
      else
        throw new Error("Expected property key");
      this.consume("PUNCTUATION", ":");
      const n = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: n,
        computed: i,
        shorthand: !1
      }), this.match("PUNCTUATION", ",")) {
        if (this.check("PUNCTUATION", "}"))
          break;
      } else
        break;
    }
    return this.consume("PUNCTUATION", "}"), {
      type: "ObjectExpression",
      properties: e
    };
  }
  match(...e) {
    for (let t = 0; t < e.length; t++) {
      const i = e[t];
      if (t === 0 && e.length > 1) {
        const n = i;
        for (let s = 1; s < e.length; s++)
          if (this.check(n, e[s]))
            return this.advance(), !0;
        return !1;
      } else if (e.length === 1)
        return this.checkType(i) ? (this.advance(), !0) : !1;
    }
    return !1;
  }
  check(e, t) {
    return this.isAtEnd() ? !1 : t !== void 0 ? this.current().type === e && this.current().value === t : this.current().type === e;
  }
  checkType(e) {
    return this.isAtEnd() ? !1 : this.current().type === e;
  }
  advance() {
    return this.isAtEnd() || this.position++, this.previous();
  }
  isAtEnd() {
    return this.current().type === "EOF";
  }
  current() {
    return this.tokens[this.position];
  }
  previous() {
    return this.tokens[this.position - 1];
  }
  consume(e, t) {
    if (t !== void 0) {
      if (this.check(e, t))
        return this.advance();
      throw new Error(`Expected ${e} "${t}" but got ${this.current().type} "${this.current().value}"`);
    }
    if (this.check(e))
      return this.advance();
    throw new Error(`Expected ${e} but got ${this.current().type} "${this.current().value}"`);
  }
}, qa = class {
  evaluate({ node: e, scope: t = {}, context: i = null, forceBindingRootScopeToFunctions: n = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const d = t[e.name];
          return this.checkForDangerousValues(d), typeof d == "function" ? d.bind(t) : d;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: e.object, scope: t, context: i, forceBindingRootScopeToFunctions: n });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let r;
        e.computed ? r = this.evaluate({ node: e.property, scope: t, context: i, forceBindingRootScopeToFunctions: n }) : r = e.property.name, this.checkForDangerousKeywords(r);
        let a = s[r];
        return this.checkForDangerousValues(a), typeof a == "function" ? n ? a.bind(t) : a.bind(s) : a;
      case "CallExpression":
        const o = e.arguments.map((d) => this.evaluate({ node: d, scope: t, context: i, forceBindingRootScopeToFunctions: n }));
        let l;
        if (e.callee.type === "MemberExpression") {
          const d = this.evaluate({ node: e.callee.object, scope: t, context: i, forceBindingRootScopeToFunctions: n });
          let c;
          e.callee.computed ? c = this.evaluate({ node: e.callee.property, scope: t, context: i, forceBindingRootScopeToFunctions: n }) : c = e.callee.property.name, this.checkForDangerousKeywords(c);
          let h = d[c];
          if (typeof h != "function")
            throw new Error("Value is not a function");
          l = h.apply(d, o);
        } else if (e.callee.type === "Identifier") {
          const d = e.callee.name;
          let c;
          if (d in t)
            c = t[d];
          else
            throw new Error(`Undefined variable: ${d}`);
          if (typeof c != "function")
            throw new Error("Value is not a function");
          const h = i !== null ? i : t;
          l = c.apply(h, o);
        } else {
          const d = this.evaluate({ node: e.callee, scope: t, context: i, forceBindingRootScopeToFunctions: n });
          if (typeof d != "function")
            throw new Error("Value is not a function");
          l = d.apply(i, o);
        }
        return this.checkForDangerousValues(l), l;
      case "UnaryExpression":
        const f = this.evaluate({ node: e.argument, scope: t, context: i, forceBindingRootScopeToFunctions: n });
        switch (e.operator) {
          case "!":
            return !f;
          case "-":
            return -f;
          case "+":
            return +f;
          default:
            throw new Error(`Unknown unary operator: ${e.operator}`);
        }
      case "UpdateExpression":
        if (e.argument.type === "Identifier") {
          const d = e.argument.name;
          if (!(d in t))
            throw new Error(`Undefined variable: ${d}`);
          const c = t[d];
          return e.operator === "++" ? t[d] = c + 1 : e.operator === "--" && (t[d] = c - 1), e.prefix ? t[d] : c;
        } else if (e.argument.type === "MemberExpression") {
          const d = this.evaluate({ node: e.argument.object, scope: t, context: i, forceBindingRootScopeToFunctions: n }), c = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: i, forceBindingRootScopeToFunctions: n }) : e.argument.property.name, h = d[c];
          return e.operator === "++" ? d[c] = h + 1 : e.operator === "--" && (d[c] = h - 1), e.prefix ? d[c] : h;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const m = this.evaluate({ node: e.left, scope: t, context: i, forceBindingRootScopeToFunctions: n }), b = this.evaluate({ node: e.right, scope: t, context: i, forceBindingRootScopeToFunctions: n });
        switch (e.operator) {
          case "+":
            return m + b;
          case "-":
            return m - b;
          case "*":
            return m * b;
          case "/":
            return m / b;
          case "%":
            return m % b;
          case "==":
            return m == b;
          case "!=":
            return m != b;
          case "===":
            return m === b;
          case "!==":
            return m !== b;
          case "<":
            return m < b;
          case ">":
            return m > b;
          case "<=":
            return m <= b;
          case ">=":
            return m >= b;
          case "&&":
            return m && b;
          case "||":
            return m || b;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: i, forceBindingRootScopeToFunctions: n }) ? this.evaluate({ node: e.consequent, scope: t, context: i, forceBindingRootScopeToFunctions: n }) : this.evaluate({ node: e.alternate, scope: t, context: i, forceBindingRootScopeToFunctions: n });
      case "AssignmentExpression":
        const y = this.evaluate({ node: e.right, scope: t, context: i, forceBindingRootScopeToFunctions: n });
        if (e.left.type === "Identifier")
          return t[e.left.name] = y, y;
        throw e.left.type === "MemberExpression" ? new Error("Property assignments are prohibited in the CSP build") : new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((d) => this.evaluate({ node: d, scope: t, context: i, forceBindingRootScopeToFunctions: n }));
      case "ObjectExpression":
        const u = {};
        for (const d of e.properties) {
          const c = d.computed ? this.evaluate({ node: d.key, scope: t, context: i, forceBindingRootScopeToFunctions: n }) : d.key.type === "Identifier" ? d.key.name : this.evaluate({ node: d.key, scope: t, context: i, forceBindingRootScopeToFunctions: n }), h = this.evaluate({ node: d.value, scope: t, context: i, forceBindingRootScopeToFunctions: n });
          u[c] = h;
        }
        return u;
      default:
        throw new Error(`Unknown node type: ${e.type}`);
    }
  }
  checkForDangerousKeywords(e) {
    if ([
      "constructor",
      "prototype",
      "__proto__",
      "__defineGetter__",
      "__defineSetter__",
      "insertAdjacentHTML"
    ].includes(e))
      throw new Error(`Accessing "${e}" is prohibited in the CSP build`);
  }
  checkForDangerousValues(e) {
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !Gi.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (Cs.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return Gi.set(e, !0), !0;
    }
  }
};
function As(e) {
  try {
    const i = new Ba(e).tokenize(), s = new Ha(i).parse(), r = new qa();
    return function(a = {}) {
      const { scope: o = {}, context: l = null, forceBindingRootScopeToFunctions: f = !1 } = a;
      return r.evaluate({ node: s, scope: o, context: l, forceBindingRootScopeToFunctions: f });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function ja(e, t, i = {}) {
  let n = $s(e), s = at([i.scope ?? {}, ...n]), r = i.params ?? [], o = As(t)({
    scope: s,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && pt ? o.apply(s, r) : o;
}
function Wa(e, t) {
  let i = $s(e);
  if (typeof t == "function")
    return Gn(i, t);
  let n = Ya(e, t, i);
  return jn.bind(null, e, t, n);
}
function $s(e) {
  let t = {};
  return Qt(t, e), [t, ...bt(e)];
}
function Ya(e, t, i) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (n = () => {
  }, { scope: s = {}, params: r = [] } = {}) => {
    let a = at([s, ...i]), l = As(t)({
      scope: a,
      forceBindingRootScopeToFunctions: !0
    });
    if (pt && typeof l == "function") {
      let f = l.apply(l, r);
      f instanceof Promise ? f.then((m) => n(m)) : n(f);
    } else typeof l == "object" && l instanceof Promise ? l.then((f) => n(f)) : n(l);
  };
}
function Ka(e, t) {
  const i = /* @__PURE__ */ Object.create(null), n = e.split(",");
  for (let s = 0; s < n.length; s++)
    i[n[s]] = !0;
  return (s) => !!i[s];
}
var Ja = Object.freeze({}), Ga = Object.prototype.hasOwnProperty, Ne = (e, t) => Ga.call(e, t), gt = Array.isArray, Zt = (e) => Os(e) === "[object Map]", Xa = (e) => typeof e == "string", Ni = (e) => typeof e == "symbol", Le = (e) => e !== null && typeof e == "object", Za = Object.prototype.toString, Os = (e) => Za.call(e), ks = (e) => Os(e).slice(8, -1), Li = (e) => Xa(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Qa = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (i) => t[i] || (t[i] = e(i));
}, to = Qa((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ds = (e, t) => e !== t && (e === e || t === t), ai = /* @__PURE__ */ new WeakMap(), qt = [], G, vt = Symbol("iterate"), oi = Symbol("Map key iterate");
function eo(e) {
  return e && e._isEffect === !0;
}
function io(e, t = Ja) {
  eo(e) && (e = e.raw);
  const i = ro(e, t);
  return t.lazy || i(), i;
}
function no(e) {
  e.active && (Ns(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var so = 0;
function ro(e, t) {
  const i = function() {
    if (!i.active)
      return e();
    if (!qt.includes(i)) {
      Ns(i);
      try {
        return oo(), qt.push(i), G = i, e();
      } finally {
        qt.pop(), Ls(), G = qt[qt.length - 1];
      }
    }
  };
  return i.id = so++, i.allowRecurse = !!t.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = e, i.deps = [], i.options = t, i;
}
function Ns(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let i = 0; i < t.length; i++)
      t[i].delete(e);
    t.length = 0;
  }
}
var Nt = !0, Pi = [];
function ao() {
  Pi.push(Nt), Nt = !1;
}
function oo() {
  Pi.push(Nt), Nt = !0;
}
function Ls() {
  const e = Pi.pop();
  Nt = e === void 0 ? !0 : e;
}
function q(e, t, i) {
  if (!Nt || G === void 0)
    return;
  let n = ai.get(e);
  n || ai.set(e, n = /* @__PURE__ */ new Map());
  let s = n.get(i);
  s || n.set(i, s = /* @__PURE__ */ new Set()), s.has(G) || (s.add(G), G.deps.push(s), G.options.onTrack && G.options.onTrack({
    effect: G,
    target: e,
    type: t,
    key: i
  }));
}
function lt(e, t, i, n, s, r) {
  const a = ai.get(e);
  if (!a)
    return;
  const o = /* @__PURE__ */ new Set(), l = (m) => {
    m && m.forEach((b) => {
      (b !== G || b.allowRecurse) && o.add(b);
    });
  };
  if (t === "clear")
    a.forEach(l);
  else if (i === "length" && gt(e))
    a.forEach((m, b) => {
      (b === "length" || b >= n) && l(m);
    });
  else
    switch (i !== void 0 && l(a.get(i)), t) {
      case "add":
        gt(e) ? Li(i) && l(a.get("length")) : (l(a.get(vt)), Zt(e) && l(a.get(oi)));
        break;
      case "delete":
        gt(e) || (l(a.get(vt)), Zt(e) && l(a.get(oi)));
        break;
      case "set":
        Zt(e) && l(a.get(vt));
        break;
    }
  const f = (m) => {
    m.options.onTrigger && m.options.onTrigger({
      effect: m,
      target: e,
      key: i,
      type: t,
      newValue: n,
      oldValue: s,
      oldTarget: r
    }), m.options.scheduler ? m.options.scheduler(m) : m();
  };
  o.forEach(f);
}
var lo = /* @__PURE__ */ Ka("__proto__,__v_isRef,__isVue"), Ps = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Ni)), co = /* @__PURE__ */ Ms(), uo = /* @__PURE__ */ Ms(!0), Xi = /* @__PURE__ */ ho();
function ho() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...i) {
      const n = N(this);
      for (let r = 0, a = this.length; r < a; r++)
        q(n, "get", r + "");
      const s = n[t](...i);
      return s === -1 || s === !1 ? n[t](...i.map(N)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...i) {
      ao();
      const n = N(this)[t].apply(this, i);
      return Ls(), n;
    };
  }), e;
}
function Ms(e = !1, t = !1) {
  return function(n, s, r) {
    if (s === "__v_isReactive")
      return !e;
    if (s === "__v_isReadonly")
      return e;
    if (s === "__v_raw" && r === (e ? t ? So : Vs : t ? To : zs).get(n))
      return n;
    const a = gt(n);
    if (!e && a && Ne(Xi, s))
      return Reflect.get(Xi, s, r);
    const o = Reflect.get(n, s, r);
    return (Ni(s) ? Ps.has(s) : lo(s)) || (e || q(n, "get", s), t) ? o : li(o) ? !a || !Li(s) ? o.value : o : Le(o) ? e ? Us(o) : zi(o) : o;
  };
}
var fo = /* @__PURE__ */ po();
function po(e = !1) {
  return function(i, n, s, r) {
    let a = i[n];
    if (!e && (s = N(s), a = N(a), !gt(i) && li(a) && !li(s)))
      return a.value = s, !0;
    const o = gt(i) && Li(n) ? Number(n) < i.length : Ne(i, n), l = Reflect.set(i, n, s, r);
    return i === N(r) && (o ? Ds(s, a) && lt(i, "set", n, s, a) : lt(i, "add", n, s)), l;
  };
}
function mo(e, t) {
  const i = Ne(e, t), n = e[t], s = Reflect.deleteProperty(e, t);
  return s && i && lt(e, "delete", t, void 0, n), s;
}
function go(e, t) {
  const i = Reflect.has(e, t);
  return (!Ni(t) || !Ps.has(t)) && q(e, "has", t), i;
}
function vo(e) {
  return q(e, "iterate", gt(e) ? "length" : vt), Reflect.ownKeys(e);
}
var yo = {
  get: co,
  set: fo,
  deleteProperty: mo,
  has: go,
  ownKeys: vo
}, bo = {
  get: uo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Mi = (e) => Le(e) ? zi(e) : e, Ri = (e) => Le(e) ? Us(e) : e, Fi = (e) => e, Pe = (e) => Reflect.getPrototypeOf(e);
function le(e, t, i = !1, n = !1) {
  e = e.__v_raw;
  const s = N(e), r = N(t);
  t !== r && !i && q(s, "get", t), !i && q(s, "get", r);
  const { has: a } = Pe(s), o = n ? Fi : i ? Ri : Mi;
  if (a.call(s, t))
    return o(e.get(t));
  if (a.call(s, r))
    return o(e.get(r));
  e !== s && e.get(t);
}
function ce(e, t = !1) {
  const i = this.__v_raw, n = N(i), s = N(e);
  return e !== s && !t && q(n, "has", e), !t && q(n, "has", s), e === s ? i.has(e) : i.has(e) || i.has(s);
}
function ue(e, t = !1) {
  return e = e.__v_raw, !t && q(N(e), "iterate", vt), Reflect.get(e, "size", e);
}
function Zi(e) {
  e = N(e);
  const t = N(this);
  return Pe(t).has.call(t, e) || (t.add(e), lt(t, "add", e, e)), this;
}
function Qi(e, t) {
  t = N(t);
  const i = N(this), { has: n, get: s } = Pe(i);
  let r = n.call(i, e);
  r ? Fs(i, n, e) : (e = N(e), r = n.call(i, e));
  const a = s.call(i, e);
  return i.set(e, t), r ? Ds(t, a) && lt(i, "set", e, t, a) : lt(i, "add", e, t), this;
}
function tn(e) {
  const t = N(this), { has: i, get: n } = Pe(t);
  let s = i.call(t, e);
  s ? Fs(t, i, e) : (e = N(e), s = i.call(t, e));
  const r = n ? n.call(t, e) : void 0, a = t.delete(e);
  return s && lt(t, "delete", e, void 0, r), a;
}
function en() {
  const e = N(this), t = e.size !== 0, i = Zt(e) ? new Map(e) : new Set(e), n = e.clear();
  return t && lt(e, "clear", void 0, void 0, i), n;
}
function de(e, t) {
  return function(n, s) {
    const r = this, a = r.__v_raw, o = N(a), l = t ? Fi : e ? Ri : Mi;
    return !e && q(o, "iterate", vt), a.forEach((f, m) => n.call(s, l(f), l(m), r));
  };
}
function he(e, t, i) {
  return function(...n) {
    const s = this.__v_raw, r = N(s), a = Zt(r), o = e === "entries" || e === Symbol.iterator && a, l = e === "keys" && a, f = s[e](...n), m = i ? Fi : t ? Ri : Mi;
    return !t && q(r, "iterate", l ? oi : vt), {
      // iterator protocol
      next() {
        const { value: b, done: I } = f.next();
        return I ? { value: b, done: I } : {
          value: o ? [m(b[0]), m(b[1])] : m(b),
          done: I
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function it(e) {
  return function(...t) {
    {
      const i = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${to(e)} operation ${i}failed: target is readonly.`, N(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function wo() {
  const e = {
    get(r) {
      return le(this, r);
    },
    get size() {
      return ue(this);
    },
    has: ce,
    add: Zi,
    set: Qi,
    delete: tn,
    clear: en,
    forEach: de(!1, !1)
  }, t = {
    get(r) {
      return le(this, r, !1, !0);
    },
    get size() {
      return ue(this);
    },
    has: ce,
    add: Zi,
    set: Qi,
    delete: tn,
    clear: en,
    forEach: de(!1, !0)
  }, i = {
    get(r) {
      return le(this, r, !0);
    },
    get size() {
      return ue(this, !0);
    },
    has(r) {
      return ce.call(this, r, !0);
    },
    add: it(
      "add"
      /* ADD */
    ),
    set: it(
      "set"
      /* SET */
    ),
    delete: it(
      "delete"
      /* DELETE */
    ),
    clear: it(
      "clear"
      /* CLEAR */
    ),
    forEach: de(!0, !1)
  }, n = {
    get(r) {
      return le(this, r, !0, !0);
    },
    get size() {
      return ue(this, !0);
    },
    has(r) {
      return ce.call(this, r, !0);
    },
    add: it(
      "add"
      /* ADD */
    ),
    set: it(
      "set"
      /* SET */
    ),
    delete: it(
      "delete"
      /* DELETE */
    ),
    clear: it(
      "clear"
      /* CLEAR */
    ),
    forEach: de(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((r) => {
    e[r] = he(r, !1, !1), i[r] = he(r, !0, !1), t[r] = he(r, !1, !0), n[r] = he(r, !0, !0);
  }), [
    e,
    i,
    t,
    n
  ];
}
var [xo, Io] = /* @__PURE__ */ wo();
function Rs(e, t) {
  const i = e ? Io : xo;
  return (n, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? n : Reflect.get(Ne(i, s) && s in n ? i : n, s, r);
}
var Eo = {
  get: /* @__PURE__ */ Rs(!1)
}, _o = {
  get: /* @__PURE__ */ Rs(!0)
};
function Fs(e, t, i) {
  const n = N(i);
  if (n !== i && t.call(e, n)) {
    const s = ks(e);
    console.warn(`Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var zs = /* @__PURE__ */ new WeakMap(), To = /* @__PURE__ */ new WeakMap(), Vs = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap();
function Co(e) {
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
function Ao(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Co(ks(e));
}
function zi(e) {
  return e && e.__v_isReadonly ? e : Bs(e, !1, yo, Eo, zs);
}
function Us(e) {
  return Bs(e, !0, bo, _o, Vs);
}
function Bs(e, t, i, n, s) {
  if (!Le(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const a = Ao(e);
  if (a === 0)
    return e;
  const o = new Proxy(e, a === 2 ? n : i);
  return s.set(e, o), o;
}
function N(e) {
  return e && N(e.__v_raw) || e;
}
function li(e) {
  return !!(e && e.__v_isRef === !0);
}
Y("nextTick", () => Oi);
Y("dispatch", (e) => Xt.bind(Xt, e));
Y("watch", (e, { evaluateLater: t, cleanup: i }) => (n, s) => {
  let r = t(n), o = Ln(() => {
    let l;
    return r((f) => l = f), l;
  }, s);
  i(o);
});
Y("store", Ma);
Y("data", (e) => Bn(e));
Y("root", (e) => Oe(e));
Y("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = at($o(e))), e._x_refs_proxy));
function $o(e) {
  let t = [];
  return xt(e, (i) => {
    i._x_refs && t.push(i._x_refs);
  }), t;
}
var He = {};
function Hs(e) {
  return He[e] || (He[e] = 0), ++He[e];
}
function Oo(e, t) {
  return xt(e, (i) => {
    if (i._x_ids && i._x_ids[t])
      return !0;
  });
}
function ko(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Hs(t));
}
Y("id", (e, { cleanup: t }) => (i, n = null) => {
  let s = `${i}${n ? `-${n}` : ""}`;
  return Do(e, s, t, () => {
    let r = Oo(e, i), a = r ? r._x_ids[i] : Hs(i);
    return n ? `${i}-${a}-${n}` : `${i}-${a}`;
  });
});
De((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Do(e, t, i, n) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = n();
  return e._x_id[t] = s, i(() => {
    delete e._x_id[t];
  }), s;
}
Y("el", (e) => e);
qs("Focus", "focus", "focus");
qs("Persist", "persist", "persist");
function qs(e, t, i) {
  Y(t, (n) => H(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
P("modelable", (e, { expression: t }, { effect: i, evaluateLater: n, cleanup: s }) => {
  let r = n(t), a = () => {
    let m;
    return r((b) => m = b), m;
  }, o = n(`${t} = __placeholder`), l = (m) => o(() => {
  }, { scope: { __placeholder: m } }), f = a();
  l(f), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let m = e._x_model.get, b = e._x_model.set, I = Es(
      {
        get() {
          return m();
        },
        set(y) {
          b(y);
        }
      },
      {
        get() {
          return a();
        },
        set(y) {
          l(y);
        }
      }
    );
    s(I);
  });
});
P("teleport", (e, { modifiers: t, expression: i }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && H("x-teleport can only be used on a <template> tag", e);
  let s = nn(i), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    r.addEventListener(o, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), se(r, {}, e);
  let a = (o, l, f) => {
    f.includes("prepend") ? l.parentNode.insertBefore(o, l) : f.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  L(() => {
    a(r, s, t), ut(() => {
      tt(r);
    })();
  }), e._x_teleportPutBack = () => {
    let o = nn(i);
    L(() => {
      a(e._x_teleport, o, t);
    });
  }, n(
    () => L(() => {
      r.remove(), zt(r);
    })
  );
});
var No = document.createElement("div");
function nn(e) {
  let t = ut(() => document.querySelector(e), () => No)();
  return t || H(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var js = () => {
};
js.inline = (e, { modifiers: t }, { cleanup: i }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, i(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
P("ignore", js);
P("effect", ut((e, { expression: t }, { effect: i }) => {
  i(V(e, t));
}));
function Ot(e, t, i, n) {
  let s = e, r = (l) => n(l), a = {}, o = (l, f) => (m) => f(l, m);
  if (i.includes("dot") && (t = Lo(t)), i.includes("camel") && (t = Po(t)), i.includes("passive") && (a.passive = !0), i.includes("capture") && (a.capture = !0), i.includes("window") && (s = window), i.includes("document") && (s = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", f = Ee(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    r = xs(r, f);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", f = Ee(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    r = Is(r, f);
  }
  return i.includes("prevent") && (r = o(r, (l, f) => {
    f.preventDefault(), l(f);
  })), i.includes("stop") && (r = o(r, (l, f) => {
    f.stopPropagation(), l(f);
  })), i.includes("once") && (r = o(r, (l, f) => {
    l(f), s.removeEventListener(t, r, a);
  })), (i.includes("away") || i.includes("outside")) && (s = document, r = o(r, (l, f) => {
    e.contains(f.target) || f.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(f));
  })), i.includes("self") && (r = o(r, (l, f) => {
    f.target === e && l(f);
  })), t === "submit" && (r = o(r, (l, f) => {
    f.target._x_pendingModelUpdates && f.target._x_pendingModelUpdates.forEach((m) => m()), l(f);
  })), (Ro(t) || Ws(t)) && (r = o(r, (l, f) => {
    Fo(f, i) || l(f);
  })), s.addEventListener(t, r, a), () => {
    s.removeEventListener(t, r, a);
  };
}
function Lo(e) {
  return e.replace(/-/g, ".");
}
function Po(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Ee(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Mo(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Ro(e) {
  return ["keydown", "keyup"].includes(e);
}
function Ws(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Fo(e, t) {
  let i = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (i.includes("debounce")) {
    let r = i.indexOf("debounce");
    i.splice(r, Ee((i[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let r = i.indexOf("throttle");
    i.splice(r, Ee((i[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && sn(e.key).includes(i[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => i.includes(r));
  return i = i.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === s.length && (Ws(e.type) || sn(e.key).includes(i[0])));
}
function sn(e) {
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
  return t[e] = e, Object.keys(t).map((i) => {
    if (t[i] === e)
      return i;
  }).filter((i) => i);
}
P("model", (e, { modifiers: t, expression: i }, { effect: n, cleanup: s }) => {
  let r = e;
  t.includes("parent") && (r = e.parentNode);
  let a = V(r, i), o;
  typeof i == "string" ? o = V(r, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? o = V(r, `${i()} = __placeholder`) : o = () => {
  };
  let l = () => {
    let d;
    return a((c) => d = c), rn(d) ? d.get() : d;
  }, f = (d) => {
    let c;
    a((h) => c = h), rn(c) ? c.set(d) : o(() => {
    }, {
      scope: { __placeholder: d }
    });
  };
  typeof i == "string" && e.type === "radio" && L(() => {
    e.hasAttribute("name") || e.setAttribute("name", i);
  });
  let m = t.includes("change") || t.includes("lazy"), b = t.includes("blur"), I = t.includes("enter"), y = m || b || I, u;
  if (ot)
    u = () => {
    };
  else if (y) {
    let d = [], c = (h) => f(fe(e, t, h, l()));
    if (m && d.push(Ot(e, "change", t, c)), b && (d.push(Ot(e, "blur", t, c)), e.form)) {
      let h = () => c({ target: e });
      e.form._x_pendingModelUpdates || (e.form._x_pendingModelUpdates = []), e.form._x_pendingModelUpdates.push(h), s(() => e.form._x_pendingModelUpdates.splice(e.form._x_pendingModelUpdates.indexOf(h), 1));
    }
    I && d.push(Ot(e, "keydown", t, (h) => {
      h.key === "Enter" && c(h);
    })), u = () => d.forEach((h) => h());
  } else {
    let d = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    u = Ot(e, d, t, (c) => {
      f(fe(e, t, c, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Di(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && f(
    fe(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = u, s(() => e._x_removeModelListeners.default()), e.form) {
    let d = Ot(e.form, "reset", [], (c) => {
      Oi(() => e._x_model && e._x_model.set(fe(e, t, { target: e }, l())));
    });
    s(() => d());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(d) {
      f(d);
    }
  }, e._x_forceModelUpdate = (d) => {
    d === void 0 && typeof i == "string" && i.match(/\./) && (d = ""), window.fromModel = !0, L(() => gs(e, "value", d)), delete window.fromModel;
  }, n(() => {
    let d = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(d);
  });
});
function fe(e, t, i, n) {
  return L(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Di(e))
      if (Array.isArray(n)) {
        let s = null;
        return t.includes("number") ? s = qe(i.target.value) : t.includes("boolean") ? s = be(i.target.value) : s = i.target.value, i.target.checked ? n.includes(s) ? n : n.concat([s]) : n.filter((r) => !zo(r, s));
      } else
        return i.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(i.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return qe(r);
        }) : t.includes("boolean") ? Array.from(i.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return be(r);
        }) : Array.from(i.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return ws(e) ? i.target.checked ? s = i.target.value : s = n : s = i.target.value, t.includes("number") ? qe(s) : t.includes("boolean") ? be(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function qe(e) {
  let t = e ? parseFloat(e) : null;
  return Vo(t) ? t : e;
}
function zo(e, t) {
  return e == t;
}
function Vo(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function rn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
P("cloak", (e) => queueMicrotask(() => L(() => e.removeAttribute(Ft("cloak")))));
us(() => `[${Ft("init")}]`);
P("init", ut((e, { expression: t }, { evaluate: i }) => typeof t == "string" ? !!t.trim() && i(t, {}, !1) : i(t, {}, !1)));
P("text", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let s = n(t);
  i(() => {
    s((r) => {
      L(() => {
        e.textContent = r;
      });
    });
  });
});
P("html", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let s = n(t);
  i(() => {
    s((r) => {
      L(() => {
        e.innerHTML = r, e._x_ignoreSelf = !0, tt(e), delete e._x_ignoreSelf;
      });
    });
  });
});
Ci(ts(":", es(Ft("bind:"))));
var Ys = (e, { value: t, modifiers: i, expression: n, original: s }, { effect: r, cleanup: a }) => {
  if (!t) {
    let l = {};
    Fa(l), V(e, n)((m) => {
      Ts(e, m, s);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Uo(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = V(e, n);
  r(() => o((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), L(() => gs(e, t, l, i));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Ys.inline = (e, { value: t, modifiers: i, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: !1 });
};
P("bind", Ys);
function Uo(e, t) {
  e._x_keyExpression = t;
}
cs(() => `[${Ft("data")}]`);
P("data", (e, { expression: t }, { cleanup: i }) => {
  if (Bo(e))
    return;
  t = t === "" ? "{}" : t;
  let n = {};
  Qt(n, e);
  let s = {};
  Va(s, n);
  let r = mt(e, t, { scope: s });
  (r === void 0 || r === !0) && (r = {}), Qt(r, e);
  let a = Mt(r);
  _i(a);
  let o = se(e, a);
  a.init && mt(e, a.init), i(() => {
    a.destroy && mt(e, a.destroy), o();
  });
});
De((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Bo(e) {
  return ot ? ri ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
P("show", (e, { modifiers: t, expression: i }, { effect: n }) => {
  let s = V(e, i);
  e._x_doHide || (e._x_doHide = () => {
    L(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    L(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let r = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, a = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(a), l = ni(
    (b) => b ? a() : r(),
    (b) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, b, a, r) : b ? o() : r();
    }
  ), f, m = !0;
  n(() => s((b) => {
    !m && b === f || (t.includes("immediate") && (b ? o() : r()), l(b), f = b, m = !1);
  }));
});
P("for", (e, { expression: t }, { effect: i, cleanup: n }) => {
  let s = qo(t), r = V(e, s.items), a = V(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, i(() => Ho(e, s, r, a)), n(() => {
    Object.values(e._x_lookup).forEach((o) => L(
      () => {
        zt(o), o.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function Ho(e, t, i, n) {
  let s = (a) => typeof a == "object" && !Array.isArray(a), r = e;
  i((a) => {
    jo(a) && a >= 0 && (a = Array.from(Array(a).keys(), (c) => c + 1)), a === void 0 && (a = []);
    let o = e._x_lookup, l = e._x_prevKeys, f = [], m = [];
    if (s(a))
      a = Object.entries(a).map(([c, h]) => {
        let p = an(t, h, c, a);
        n((v) => {
          m.includes(v) && H("Duplicate key on x-for", e), m.push(v);
        }, { scope: { index: c, ...p } }), f.push(p);
      });
    else
      for (let c = 0; c < a.length; c++) {
        let h = an(t, a[c], c, a);
        n((p) => {
          m.includes(p) && H("Duplicate key on x-for", e), m.push(p);
        }, { scope: { index: c, ...h } }), f.push(h);
      }
    let b = [], I = [], y = [], u = [];
    for (let c = 0; c < l.length; c++) {
      let h = l[c];
      m.indexOf(h) === -1 && y.push(h);
    }
    l = l.filter((c) => !y.includes(c));
    let d = "template";
    for (let c = 0; c < m.length; c++) {
      let h = m[c], p = l.indexOf(h);
      if (p === -1)
        l.splice(c, 0, h), b.push([d, c]);
      else if (p !== c) {
        let v = l.splice(c, 1)[0], w = l.splice(p - 1, 1)[0];
        l.splice(c, 0, w), l.splice(p, 0, v), I.push([v, w]);
      } else
        u.push(h);
      d = h;
    }
    for (let c = 0; c < y.length; c++) {
      let h = y[c];
      h in o && (L(() => {
        zt(o[h]), o[h].remove();
      }), delete o[h]);
    }
    for (let c = 0; c < I.length; c++) {
      let [h, p] = I[c], v = o[h], w = o[p], E = document.createElement("div");
      L(() => {
        w || H('x-for ":key" is undefined or invalid', r, p, o), w.after(E), v.after(w), w._x_currentIfEl && w.after(w._x_currentIfEl), E.before(v), v._x_currentIfEl && v.after(v._x_currentIfEl), E.remove();
      }), w._x_refreshXForScope(f[m.indexOf(p)]);
    }
    for (let c = 0; c < b.length; c++) {
      let [h, p] = b[c], v = h === "template" ? r : o[h];
      v._x_currentIfEl && (v = v._x_currentIfEl);
      let w = f[p], E = m[p], g = document.importNode(r.content, !0).firstElementChild, x = Mt(w);
      se(g, x, r), g._x_refreshXForScope = (_) => {
        Object.entries(_).forEach(([S, T]) => {
          x[S] = T;
        });
      }, L(() => {
        v.after(g), ut(() => tt(g))();
      }), typeof E == "object" && H("x-for key cannot be an object, it must be a string or an integer", r), o[E] = g;
    }
    for (let c = 0; c < u.length; c++)
      o[u[c]]._x_refreshXForScope(f[m.indexOf(u[c])]);
    r._x_prevKeys = m;
  });
}
function qo(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(n);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let a = s[1].replace(i, "").trim(), o = a.match(t);
  return o ? (r.item = a.replace(t, "").trim(), r.index = o[1].trim(), o[2] && (r.collection = o[2].trim())) : r.item = a, r;
}
function an(e, t, i, n) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    s[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    s[a] = t[a];
  }) : s[e.item] = t, e.index && (s[e.index] = i), e.collection && (s[e.collection] = n), s;
}
function jo(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ks() {
}
Ks.inline = (e, { expression: t }, { cleanup: i }) => {
  let n = Oe(e);
  n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, i(() => delete n._x_refs[t]);
};
P("ref", Ks);
P("if", (e, { expression: t }, { effect: i, cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && H("x-if can only be used on a <template> tag", e);
  let s = V(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return se(o, {}, e), L(() => {
      e.after(o), ut(() => tt(o))();
    }), e._x_currentIfEl = o, e._x_undoIf = () => {
      L(() => {
        zt(o), o.remove();
      }), delete e._x_currentIfEl;
    }, o;
  }, a = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  i(() => s((o) => {
    o ? r() : a();
  })), n(() => e._x_undoIf && e._x_undoIf());
});
P("id", (e, { expression: t }, { evaluate: i }) => {
  i(t).forEach((s) => ko(e, s));
});
De((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ci(ts("@", es(Ft("on:"))));
P("on", ut((e, { value: t, modifiers: i, expression: n }, { cleanup: s }) => {
  let r = n ? V(e, n) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = Ot(e, t, i, (o) => {
    r(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => a());
}));
Me("Collapse", "collapse", "collapse");
Me("Intersect", "intersect", "intersect");
Me("Focus", "trap", "focus");
Me("Mask", "mask", "mask");
function Me(e, t, i) {
  P(t, (n) => H(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
P("html", (e, { expression: t }) => {
  Dt(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
Vt.setEvaluator(Wa);
Vt.setRawEvaluator(ja);
Vt.setReactivityEngine({ reactive: zi, effect: io, release: no, raw: N });
var Wo = Vt, Js = Wo;
function Yo(e) {
  e.directive("collapse", t), t.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function t(i, { modifiers: n }) {
    let s = on(n, "duration", 250) / 1e3, r = on(n, "min", 0), a = !n.includes("min");
    i._x_isShown || (i.style.height = `${r}px`), !i._x_isShown && a && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let o = (f, m) => {
      let b = e.setStyles(f, m);
      return m.height ? () => {
      } : b;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${s}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    i._x_transition = {
      in(f = () => {
      }, m = () => {
      }) {
        a && (i.hidden = !1), a && (i.style.display = null);
        let b = i.getBoundingClientRect().height;
        i.style.height = "auto";
        let I = i.getBoundingClientRect().height;
        b === I && (b = r), e.transition(i, e.setStyles, {
          during: l,
          start: { height: b + "px" },
          end: { height: I + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - I) < 1 && (i.style.overflow = null);
        });
      },
      out(f = () => {
      }, m = () => {
      }) {
        let b = i.getBoundingClientRect().height;
        e.transition(i, o, {
          during: l,
          start: { height: b + "px" },
          end: { height: r + "px" }
        }, () => i.style.overflow = "hidden", () => {
          i._x_isShown = !1, i.style.height == `${r}px` && a && (i.style.display = "none", i.hidden = !0);
        });
      }
    };
  }
}
function on(e, t, i) {
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
var Ko = Yo;
function Jo(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: s }, { evaluateLater: r, cleanup: a }) => {
    let o = r(n), l = {
      rootMargin: Zo(s),
      threshold: Go(s)
    }, f = new IntersectionObserver((m) => {
      m.forEach((b) => {
        b.isIntersecting !== (i === "leave") && (o(), s.includes("once") && f.disconnect());
      });
    }, l);
    f.observe(t), a(() => {
      f.disconnect();
    });
  }));
}
function Go(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Xo(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Zo(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let s = [];
  for (let r = 1; r < 5; r++)
    s.push(Xo(e[n + r] || ""));
  return s = s.filter((r) => r !== void 0), s.length ? s.join(" ").trim() : i;
}
var Qo = Jo, Gs = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], _e = /* @__PURE__ */ Gs.join(","), Xs = typeof Element > "u", It = Xs ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ci = !Xs && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Zs = function(t, i, n) {
  var s = Array.prototype.slice.apply(t.querySelectorAll(_e));
  return i && It.call(t, _e) && s.unshift(t), s = s.filter(n), s;
}, Qs = function e(t, i, n) {
  for (var s = [], r = Array.from(t); r.length; ) {
    var a = r.shift();
    if (a.tagName === "SLOT") {
      var o = a.assignedElements(), l = o.length ? o : a.children, f = e(l, !0, n);
      n.flatten ? s.push.apply(s, f) : s.push({
        scope: a,
        candidates: f
      });
    } else {
      var m = It.call(a, _e);
      m && n.filter(a) && (i || !t.includes(a)) && s.push(a);
      var b = a.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(a), I = !n.shadowRootFilter || n.shadowRootFilter(a);
      if (b && I) {
        var y = e(b === !0 ? a.children : b.children, !0, n);
        n.flatten ? s.push.apply(s, y) : s.push({
          scope: a,
          candidates: y
        });
      } else
        r.unshift.apply(r, a.children);
    }
  }
  return s;
}, tr = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, tl = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, er = function(t) {
  return t.tagName === "INPUT";
}, el = function(t) {
  return er(t) && t.type === "hidden";
}, il = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, nl = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, sl = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || ci(t), n = function(o) {
    return i.querySelectorAll('input[type="radio"][name="' + o + '"]');
  }, s;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    s = n(window.CSS.escape(t.name));
  else
    try {
      s = n(t.name);
    } catch (a) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", a.message), !1;
    }
  var r = nl(s, t.form);
  return !r || r === t;
}, rl = function(t) {
  return er(t) && t.type === "radio";
}, al = function(t) {
  return rl(t) && !sl(t);
}, ln = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, s = i.height;
  return n === 0 && s === 0;
}, ol = function(t, i) {
  var n = i.displayCheck, s = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var r = It.call(t, "details>summary:first-of-type"), a = r ? t.parentElement : t;
  if (It.call(a, "details:not([open]) *"))
    return !0;
  var o = ci(t).host, l = o?.ownerDocument.contains(o) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof s == "function") {
      for (var f = t; t; ) {
        var m = t.parentElement, b = ci(t);
        if (m && !m.shadowRoot && s(m) === !0)
          return ln(t);
        t.assignedSlot ? t = t.assignedSlot : !m && b !== t.ownerDocument ? t = b.host : t = m;
      }
      t = f;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (n === "non-zero-area")
    return ln(t);
  return !1;
}, ll = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var s = i.children.item(n);
          if (s.tagName === "LEGEND")
            return It.call(i, "fieldset[disabled] *") ? !0 : !s.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, Te = function(t, i) {
  return !(i.disabled || el(i) || ol(i, t) || // For a details element with a summary, the summary element gets the focus
  il(i) || ll(i));
}, ui = function(t, i) {
  return !(al(i) || tr(i) < 0 || !Te(t, i));
}, cl = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, ul = function e(t) {
  var i = [], n = [];
  return t.forEach(function(s, r) {
    var a = !!s.scope, o = a ? s.scope : s, l = tr(o, a), f = a ? e(s.candidates) : o;
    l === 0 ? a ? i.push.apply(i, f) : i.push(o) : n.push({
      documentOrder: r,
      tabIndex: l,
      item: s,
      isScope: a,
      content: f
    });
  }), n.sort(tl).reduce(function(s, r) {
    return r.isScope ? s.push.apply(s, r.content) : s.push(r.content), s;
  }, []).concat(i);
}, dl = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Qs([t], i.includeContainer, {
    filter: ui.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: cl
  }) : n = Zs(t, i.includeContainer, ui.bind(null, i)), ul(n);
}, ir = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Qs([t], i.includeContainer, {
    filter: Te.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = Zs(t, i.includeContainer, Te.bind(null, i)), n;
}, pe = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return It.call(t, _e) === !1 ? !1 : ui(i, t);
}, hl = /* @__PURE__ */ Gs.concat("iframe").join(","), we = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return It.call(t, hl) === !1 ? !1 : Te(i, t);
};
function cn(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(s) {
      return Object.getOwnPropertyDescriptor(e, s).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function un(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = arguments[t] != null ? arguments[t] : {};
    t % 2 ? cn(Object(i), !0).forEach(function(n) {
      fl(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : cn(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function fl(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var dn = /* @__PURE__ */ (function() {
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
})(), pl = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, ml = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, gl = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, hn = function(t) {
  return setTimeout(t, 0);
}, fn = function(t, i) {
  var n = -1;
  return t.every(function(s, r) {
    return i(s) ? (n = r, !1) : !0;
  }), n;
}, jt = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++)
    n[s - 1] = arguments[s];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, me = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, vl = function(t, i) {
  var n = i?.document || document, s = un({
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
  }, a, o = function(g, x, _) {
    return g && g[x] !== void 0 ? g[x] : s[_ || x];
  }, l = function(g) {
    return r.containerGroups.findIndex(function(x) {
      var _ = x.container, S = x.tabbableNodes;
      return _.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      S.find(function(T) {
        return T === g;
      });
    });
  }, f = function(g) {
    var x = s[g];
    if (typeof x == "function") {
      for (var _ = arguments.length, S = new Array(_ > 1 ? _ - 1 : 0), T = 1; T < _; T++)
        S[T - 1] = arguments[T];
      x = x.apply(void 0, S);
    }
    if (x === !0 && (x = void 0), !x) {
      if (x === void 0 || x === !1)
        return x;
      throw new Error("`".concat(g, "` was specified but was not a node, or did not return a node"));
    }
    var C = x;
    if (typeof x == "string" && (C = n.querySelector(x), !C))
      throw new Error("`".concat(g, "` as selector refers to no known node"));
    return C;
  }, m = function() {
    var g = f("initialFocus");
    if (g === !1)
      return !1;
    if (g === void 0)
      if (l(n.activeElement) >= 0)
        g = n.activeElement;
      else {
        var x = r.tabbableGroups[0], _ = x && x.firstTabbableNode;
        g = _ || f("fallbackFocus");
      }
    if (!g)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return g;
  }, b = function() {
    if (r.containerGroups = r.containers.map(function(g) {
      var x = dl(g, s.tabbableOptions), _ = ir(g, s.tabbableOptions);
      return {
        container: g,
        tabbableNodes: x,
        focusableNodes: _,
        firstTabbableNode: x.length > 0 ? x[0] : null,
        lastTabbableNode: x.length > 0 ? x[x.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(T) {
          var C = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, A = _.findIndex(function($) {
            return $ === T;
          });
          if (!(A < 0))
            return C ? _.slice(A + 1).find(function($) {
              return pe($, s.tabbableOptions);
            }) : _.slice(0, A).reverse().find(function($) {
              return pe($, s.tabbableOptions);
            });
        }
      };
    }), r.tabbableGroups = r.containerGroups.filter(function(g) {
      return g.tabbableNodes.length > 0;
    }), r.tabbableGroups.length <= 0 && !f("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, I = function E(g) {
    if (g !== !1 && g !== n.activeElement) {
      if (!g || !g.focus) {
        E(m());
        return;
      }
      g.focus({
        preventScroll: !!s.preventScroll
      }), r.mostRecentlyFocusedNode = g, pl(g) && g.select();
    }
  }, y = function(g) {
    var x = f("setReturnFocus", g);
    return x || (x === !1 ? !1 : g);
  }, u = function(g) {
    var x = me(g);
    if (!(l(x) >= 0)) {
      if (jt(s.clickOutsideDeactivates, g)) {
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
          returnFocus: s.returnFocusOnDeactivate && !we(x, s.tabbableOptions)
        });
        return;
      }
      jt(s.allowOutsideClick, g) || g.preventDefault();
    }
  }, d = function(g) {
    var x = me(g), _ = l(x) >= 0;
    _ || x instanceof Document ? _ && (r.mostRecentlyFocusedNode = x) : (g.stopImmediatePropagation(), I(r.mostRecentlyFocusedNode || m()));
  }, c = function(g) {
    var x = me(g);
    b();
    var _ = null;
    if (r.tabbableGroups.length > 0) {
      var S = l(x), T = S >= 0 ? r.containerGroups[S] : void 0;
      if (S < 0)
        g.shiftKey ? _ = r.tabbableGroups[r.tabbableGroups.length - 1].lastTabbableNode : _ = r.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var C = fn(r.tabbableGroups, function(M) {
          var F = M.firstTabbableNode;
          return x === F;
        });
        if (C < 0 && (T.container === x || we(x, s.tabbableOptions) && !pe(x, s.tabbableOptions) && !T.nextTabbableNode(x, !1)) && (C = S), C >= 0) {
          var A = C === 0 ? r.tabbableGroups.length - 1 : C - 1, $ = r.tabbableGroups[A];
          _ = $.lastTabbableNode;
        }
      } else {
        var D = fn(r.tabbableGroups, function(M) {
          var F = M.lastTabbableNode;
          return x === F;
        });
        if (D < 0 && (T.container === x || we(x, s.tabbableOptions) && !pe(x, s.tabbableOptions) && !T.nextTabbableNode(x)) && (D = S), D >= 0) {
          var O = D === r.tabbableGroups.length - 1 ? 0 : D + 1, z = r.tabbableGroups[O];
          _ = z.firstTabbableNode;
        }
      }
    } else
      _ = f("fallbackFocus");
    _ && (g.preventDefault(), I(_));
  }, h = function(g) {
    if (ml(g) && jt(s.escapeDeactivates, g) !== !1) {
      g.preventDefault(), a.deactivate();
      return;
    }
    if (gl(g)) {
      c(g);
      return;
    }
  }, p = function(g) {
    var x = me(g);
    l(x) >= 0 || jt(s.clickOutsideDeactivates, g) || jt(s.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, v = function() {
    if (r.active)
      return dn.activateTrap(a), r.delayInitialFocusTimer = s.delayInitialFocus ? hn(function() {
        I(m());
      }) : I(m()), n.addEventListener("focusin", d, !0), n.addEventListener("mousedown", u, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", u, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", p, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", h, {
        capture: !0,
        passive: !1
      }), a;
  }, w = function() {
    if (r.active)
      return n.removeEventListener("focusin", d, !0), n.removeEventListener("mousedown", u, !0), n.removeEventListener("touchstart", u, !0), n.removeEventListener("click", p, !0), n.removeEventListener("keydown", h, !0), a;
  };
  return a = {
    get active() {
      return r.active;
    },
    get paused() {
      return r.paused;
    },
    activate: function(g) {
      if (r.active)
        return this;
      var x = o(g, "onActivate"), _ = o(g, "onPostActivate"), S = o(g, "checkCanFocusTrap");
      S || b(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = n.activeElement, x && x();
      var T = function() {
        S && b(), v(), _ && _();
      };
      return S ? (S(r.containers.concat()).then(T, T), this) : (T(), this);
    },
    deactivate: function(g) {
      if (!r.active)
        return this;
      var x = un({
        onDeactivate: s.onDeactivate,
        onPostDeactivate: s.onPostDeactivate,
        checkCanReturnFocus: s.checkCanReturnFocus
      }, g);
      clearTimeout(r.delayInitialFocusTimer), r.delayInitialFocusTimer = void 0, w(), r.active = !1, r.paused = !1, dn.deactivateTrap(a);
      var _ = o(x, "onDeactivate"), S = o(x, "onPostDeactivate"), T = o(x, "checkCanReturnFocus"), C = o(x, "returnFocus", "returnFocusOnDeactivate");
      _ && _();
      var A = function() {
        hn(function() {
          C && I(y(r.nodeFocusedBeforeActivation)), S && S();
        });
      };
      return C && T ? (T(y(r.nodeFocusedBeforeActivation)).then(A, A), this) : (A(), this);
    },
    pause: function() {
      return r.paused || !r.active ? this : (r.paused = !0, w(), this);
    },
    unpause: function() {
      return !r.paused || !r.active ? this : (r.paused = !1, b(), v(), this);
    },
    updateContainerElements: function(g) {
      var x = [].concat(g).filter(Boolean);
      return r.containers = x.map(function(_) {
        return typeof _ == "string" ? n.querySelector(_) : _;
      }), r.active && b(), this;
    }
  }, a.updateContainerElements(t), a;
};
function yl(e) {
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
        return we(r);
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
        return Array.isArray(s) ? s : ir(s, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(r) {
        let a = this.all();
        return a[0] && a[0].isSameNode(r);
      },
      isLast(r) {
        let a = this.all();
        return a.length && a.slice(-1)[0].isSameNode(r);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let r = this.all(), a = document.activeElement;
        if (r.indexOf(a) !== -1)
          return this.__wrapAround && r.indexOf(a) === r.length - 1 ? r[0] : r[r.indexOf(a) + 1];
      },
      getPrevious() {
        let r = this.all(), a = document.activeElement;
        if (r.indexOf(a) !== -1)
          return this.__wrapAround && r.indexOf(a) === 0 ? r.slice(-1)[0] : r[r.indexOf(a) - 1];
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
    (n, { expression: s, modifiers: r }, { effect: a, evaluateLater: o, cleanup: l }) => {
      let f = o(s), m = !1, b = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => n
      }, I = () => {
      };
      if (r.includes("noautofocus"))
        b.initialFocus = !1;
      else {
        let c = n.querySelector("[autofocus]");
        c && (b.initialFocus = c);
      }
      r.includes("inert") && (b.onPostActivate = () => {
        e.nextTick(() => {
          I = pn(n);
        });
      });
      let y = vl(n, b), u = () => {
      };
      const d = () => {
        I(), I = () => {
        }, u(), u = () => {
        }, y.deactivate({
          returnFocus: !r.includes("noreturn")
        });
      };
      a(() => f((c) => {
        m !== c && (c && !m && (r.includes("noscroll") && (u = bl()), setTimeout(() => {
          y.activate();
        }, 15)), !c && m && d(), m = !!c);
      })), l(d);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: s, modifiers: r }, { evaluate: a }) => {
      r.includes("inert") && a(s) && pn(n);
    }
  ));
}
function pn(e) {
  let t = [];
  return nr(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function nr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? nr(e.parentNode, t) : t(i);
  });
}
function bl() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var wl = yl;
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
function xl() {
  return !0;
}
function Il({ component: e, argument: t }) {
  return new Promise((i) => {
    if (t)
      window.addEventListener(
        t,
        () => i(),
        { once: !0 }
      );
    else {
      const n = (s) => {
        s.detail.id === e.id && (window.removeEventListener("async-alpine:load", n), i());
      };
      window.addEventListener("async-alpine:load", n);
    }
  });
}
function El() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function _l({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const i = window.matchMedia(`(${e})`);
    i.matches ? t() : i.addEventListener("change", t, { once: !0 });
  });
}
function Tl({ component: e, argument: t }) {
  return new Promise((i) => {
    const n = t || "0px 0px 0px 0px", s = new IntersectionObserver((r) => {
      r[0].isIntersecting && (s.disconnect(), i());
    }, { rootMargin: n });
    s.observe(e.el);
  });
}
var mn = {
  eager: xl,
  event: Il,
  idle: El,
  media: _l,
  visible: Tl
};
async function Sl(e) {
  const t = Cl(e.strategy);
  await di(e, t);
}
async function di(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((i) => di(e, i))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((i) => di(e, i))
      );
  }
  return mn[t.method] ? mn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function Cl(e) {
  const t = Al(e);
  let i = sr(t);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function Al(e) {
  const t = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, i = [];
  let n;
  for (; (n = t.exec(e)) !== null; ) {
    const [s, r, a, o] = n;
    if (r !== void 0)
      i.push({ type: "parenthesis", value: r });
    else if (a !== void 0)
      i.push({
        type: "operator",
        // we do the below to make operators backwards-compatible with previous
        // versions of Async Alpine, where '|' is equivalent to &&
        value: a === "|" ? "&&" : a
      });
    else {
      const l = {
        type: "method",
        method: o.trim()
      };
      o.includes("(") && (l.method = o.substring(0, o.indexOf("(")).trim(), l.argument = o.substring(
        o.indexOf("(") + 1,
        o.indexOf(")")
      )), o.method === "immediate" && (o.method = "eager"), i.push(l);
    }
  }
  return i;
}
function sr(e) {
  let t = gn(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const i = e.shift().value, n = gn(e);
    t.type === "expression" && t.operator === i ? t.parameters.push(n) : t = {
      type: "expression",
      operator: i,
      parameters: [t, n]
    };
  }
  return t;
}
function gn(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = sr(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function $l(e) {
  const t = "load", i = e.prefixed("load-src"), n = e.prefixed("ignore");
  let s = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, r = !1, a = {}, o = 0;
  function l() {
    return o++;
  }
  e.asyncOptions = (p) => {
    s = {
      ...s,
      ...p
    };
  }, e.asyncData = (p, v = !1) => {
    a[p] = {
      loaded: !1,
      download: v
    };
  }, e.asyncUrl = (p, v) => {
    !p || !v || a[p] || (a[p] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        h(v)
      )
    });
  }, e.asyncAlias = (p) => {
    r = p;
  };
  const f = (p) => {
    e.skipDuringClone(() => {
      p._x_async || (p._x_async = "init", p._x_ignore = !0, p.setAttribute(n, ""));
    })();
  }, m = async (p) => {
    e.skipDuringClone(async () => {
      if (p._x_async !== "init") return;
      p._x_async = "await";
      const { name: v, strategy: w } = b(p);
      await Sl({
        name: v,
        strategy: w,
        el: p,
        id: p.id || l()
      }), p.isConnected && (await I(v), p.isConnected && (u(p), p._x_async = "loaded"));
    })();
  };
  m.inline = f, e.directive(t, m).before("ignore");
  function b(p) {
    const v = c(p.getAttribute(e.prefixed("data"))), w = p.getAttribute(e.prefixed(t)) || s.defaultStrategy, E = p.getAttribute(i);
    return E && e.asyncUrl(v, E), {
      name: v,
      strategy: w
    };
  }
  async function I(p) {
    if (p.startsWith("_x_async_") || (d(p), !a[p] || a[p].loaded)) return;
    const v = await y(p);
    e.data(p, v), a[p].loaded = !0;
  }
  async function y(p) {
    if (!a[p]) return;
    const v = await a[p].download(p);
    return typeof v == "function" ? v : v[p] || v.default || Object.values(v)[0] || !1;
  }
  function u(p) {
    e.destroyTree(p), p._x_ignore = !1, p.removeAttribute(n), !p.closest(`[${n}]`) && e.initTree(p);
  }
  function d(p) {
    if (!(!r || a[p])) {
      if (typeof r == "function") {
        e.asyncData(p, r);
        return;
      }
      e.asyncUrl(p, r.replaceAll("[name]", p));
    }
  }
  function c(p) {
    return (p || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function h(p) {
    return s.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(p) ? p : new URL(p, document.baseURI).href;
  }
}
var je = { exports: {} }, vn;
function Ol() {
  return vn || (vn = 1, (function(e, t) {
    (function(n, s) {
      e.exports = s();
    })(self, () => (
      /******/
      (() => {
        var i = {};
        i.d = (y, u) => {
          for (var d in u)
            i.o(u, d) && !i.o(y, d) && Object.defineProperty(y, d, { enumerable: !0, get: u[d] });
        }, i.o = (y, u) => Object.prototype.hasOwnProperty.call(y, u), i.r = (y) => {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(y, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(y, "__esModule", { value: !0 });
        };
        var n = {};
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        i.r(n), i.d(n, {
          /* harmony export */
          MvcValidationProviders: () => (
            /* binding */
            b
          ),
          /* harmony export */
          ValidationService: () => (
            /* binding */
            I
          ),
          /* harmony export */
          isValidatable: () => (
            /* binding */
            o
          )
          /* harmony export */
        });
        var s = function(y, u, d, c) {
          function h(p) {
            return p instanceof d ? p : new d(function(v) {
              v(p);
            });
          }
          return new (d || (d = Promise))(function(p, v) {
            function w(x) {
              try {
                g(c.next(x));
              } catch (_) {
                v(_);
              }
            }
            function E(x) {
              try {
                g(c.throw(x));
              } catch (_) {
                v(_);
              }
            }
            function g(x) {
              x.done ? p(x.value) : h(x.value).then(w, E);
            }
            g((c = c.apply(y, u || [])).next());
          });
        }, r = function(y, u) {
          var d = { label: 0, sent: function() {
            if (p[0] & 1) throw p[1];
            return p[1];
          }, trys: [], ops: [] }, c, h, p, v;
          return v = { next: w(0), throw: w(1), return: w(2) }, typeof Symbol == "function" && (v[Symbol.iterator] = function() {
            return this;
          }), v;
          function w(g) {
            return function(x) {
              return E([g, x]);
            };
          }
          function E(g) {
            if (c) throw new TypeError("Generator is already executing.");
            for (; v && (v = 0, g[0] && (d = 0)), d; ) try {
              if (c = 1, h && (p = g[0] & 2 ? h.return : g[0] ? h.throw || ((p = h.return) && p.call(h), 0) : h.next) && !(p = p.call(h, g[1])).done) return p;
              switch (h = 0, p && (g = [g[0] & 2, p.value]), g[0]) {
                case 0:
                case 1:
                  p = g;
                  break;
                case 4:
                  return d.label++, { value: g[1], done: !1 };
                case 5:
                  d.label++, h = g[1], g = [0];
                  continue;
                case 7:
                  g = d.ops.pop(), d.trys.pop();
                  continue;
                default:
                  if (p = d.trys, !(p = p.length > 0 && p[p.length - 1]) && (g[0] === 6 || g[0] === 2)) {
                    d = 0;
                    continue;
                  }
                  if (g[0] === 3 && (!p || g[1] > p[0] && g[1] < p[3])) {
                    d.label = g[1];
                    break;
                  }
                  if (g[0] === 6 && d.label < p[1]) {
                    d.label = p[1], p = g;
                    break;
                  }
                  if (p && d.label < p[2]) {
                    d.label = p[2], d.ops.push(g);
                    break;
                  }
                  p[2] && d.ops.pop(), d.trys.pop();
                  continue;
              }
              g = u.call(y, d);
            } catch (x) {
              g = [6, x], h = 0;
            } finally {
              c = p = 0;
            }
            if (g[0] & 5) throw g[1];
            return { value: g[0] ? g[1] : void 0, done: !0 };
          }
        }, a = new /** @class */
        ((function() {
          function y() {
            this.warn = globalThis.console.warn;
          }
          return y.prototype.log = function(u) {
          }, y;
        })())(), o = function(y) {
          return y instanceof HTMLInputElement || y instanceof HTMLSelectElement || y instanceof HTMLTextAreaElement;
        }, l = ["input", "select", "textarea"], f = function(y) {
          return l.map(function(u) {
            return "".concat(u).concat(y || "");
          }).join(",");
        };
        function m(y, u) {
          var d = y.name, c = u.substring(2), h = "", p = d.lastIndexOf(".");
          if (p > -1) {
            h = d.substring(0, p);
            var v = h + "." + c, w = document.getElementsByName(v)[0];
            if (o(w))
              return w;
          }
          return y.form.querySelector(f("[name=".concat(c, "]")));
        }
        var b = (
          /** @class */
          /* @__PURE__ */ (function() {
            function y() {
              this.required = function(u, d, c) {
                var h = d.type.toLowerCase();
                if (h === "checkbox" || h === "radio") {
                  for (var p = Array.from(d.form.querySelectorAll(f("[name='".concat(d.name, "'][type='").concat(h, "']")))), v = 0, w = p; v < w.length; v++) {
                    var E = w[v];
                    if (E instanceof HTMLInputElement && E.checked === !0)
                      return !0;
                  }
                  if (h === "checkbox") {
                    var g = d.form.querySelector("input[name='".concat(d.name, "'][type='hidden']"));
                    if (g instanceof HTMLInputElement && g.value === "false")
                      return !0;
                  }
                  return !1;
                }
                return !!u?.trim();
              }, this.stringLength = function(u, d, c) {
                if (!u)
                  return !0;
                if (c.min) {
                  var h = parseInt(c.min);
                  if (u.length < h)
                    return !1;
                }
                if (c.max) {
                  var p = parseInt(c.max);
                  if (u.length > p)
                    return !1;
                }
                return !0;
              }, this.compare = function(u, d, c) {
                if (!c.other)
                  return !0;
                var h = m(d, c.other);
                return h ? h.value === u : !0;
              }, this.range = function(u, d, c) {
                if (!u)
                  return !0;
                var h = parseFloat(u);
                if (isNaN(h))
                  return !1;
                if (c.min) {
                  var p = parseFloat(c.min);
                  if (h < p)
                    return !1;
                }
                if (c.max) {
                  var v = parseFloat(c.max);
                  if (h > v)
                    return !1;
                }
                return !0;
              }, this.regex = function(u, d, c) {
                if (!u || !c.pattern)
                  return !0;
                var h = new RegExp(c.pattern);
                return h.test(u);
              }, this.email = function(u, d, c) {
                if (!u)
                  return !0;
                var h = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/;
                return h.test(u);
              }, this.creditcard = function(u, d, c) {
                if (!u)
                  return !0;
                if (/[^0-9 \-]+/.test(u))
                  return !1;
                var h = 0, p = 0, v = !1, w, E;
                if (u = u.replace(/\D/g, ""), u.length < 13 || u.length > 19)
                  return !1;
                for (w = u.length - 1; w >= 0; w--)
                  E = u.charAt(w), p = parseInt(E, 10), v && (p *= 2) > 9 && (p -= 9), h += p, v = !v;
                return h % 10 === 0;
              }, this.url = function(u, d, c) {
                if (!u)
                  return !0;
                var h = u.toLowerCase();
                return h.indexOf("http://") > -1 || h.indexOf("https://") > -1 || h.indexOf("ftp://") > -1;
              }, this.phone = function(u, d, c) {
                if (!u)
                  return !0;
                var h = /[\+\-\s][\-\s]/g;
                if (h.test(u))
                  return !1;
                var p = /^\+?[0-9\-\s]+$/;
                return p.test(u);
              }, this.remote = function(u, d, c) {
                if (!u)
                  return !0;
                for (var h = c.additionalfields.split(","), p = {}, v = 0, w = h; v < w.length; v++) {
                  var E = w[v], g = E.substr(2), x = m(d, E), _ = !!(x && x.value);
                  _ && (x instanceof HTMLInputElement && (x.type === "checkbox" || x.type === "radio") ? p[g] = x.checked ? x.value : "" : p[g] = x.value);
                }
                var S = c.url, T = [];
                for (var g in p) {
                  var C = encodeURIComponent(g) + "=" + encodeURIComponent(p[g]);
                  T.push(C);
                }
                var A = T.join("&");
                return new Promise(function($, D) {
                  var O = new XMLHttpRequest();
                  if (c.type && c.type.toLowerCase() === "post") {
                    var z = new FormData();
                    for (var M in p)
                      z.append(M, p[M]);
                    O.open("post", S), O.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), O.send(A);
                  } else
                    O.open("get", S + "?" + A), O.send();
                  O.onload = function(F) {
                    if (O.status >= 200 && O.status < 300) {
                      var K = JSON.parse(O.responseText);
                      $(K);
                    } else
                      D({
                        status: O.status,
                        statusText: O.statusText,
                        data: O.responseText
                      });
                  }, O.onerror = function(F) {
                    D({
                      status: O.status,
                      statusText: O.statusText,
                      data: O.responseText
                    });
                  };
                });
              };
            }
            return y;
          })()
        ), I = (
          /** @class */
          (function() {
            function y(u) {
              var d = this;
              this.providers = {}, this.messageFor = {}, this.elementUIDs = [], this.elementByUID = {}, this.formInputs = {}, this.validators = {}, this.formEvents = {}, this.inputEvents = {}, this.summary = {}, this.debounce = 300, this.allowHiddenFields = !1, this.validateForm = function(c, h) {
                return s(d, void 0, void 0, function() {
                  var p, v, w;
                  return r(this, function(E) {
                    switch (E.label) {
                      case 0:
                        if (!(c instanceof HTMLFormElement))
                          throw new Error("validateForm() can only be called on <form> elements");
                        return p = this.getElementUID(c), v = this.formEvents[p], w = !v, w ? [3, 2] : [4, v(void 0, h)];
                      case 1:
                        w = E.sent(), E.label = 2;
                      case 2:
                        return [2, w];
                    }
                  });
                });
              }, this.validateField = function(c, h) {
                return s(d, void 0, void 0, function() {
                  var p, v, w;
                  return r(this, function(E) {
                    switch (E.label) {
                      case 0:
                        return p = this.getElementUID(c), v = this.inputEvents[p], w = !v, w ? [3, 2] : [4, v(void 0, h)];
                      case 1:
                        w = E.sent(), E.label = 2;
                      case 2:
                        return [2, w];
                    }
                  });
                });
              }, this.preValidate = function(c) {
                c.preventDefault(), c.stopImmediatePropagation();
              }, this.handleValidated = function(c, h, p) {
                if (!(c instanceof HTMLFormElement))
                  throw new Error("handleValidated() can only be called on <form> elements");
                h ? p && d.submitValidForm(c, p) : d.focusFirstInvalid(c);
              }, this.submitValidForm = function(c, h) {
                if (!(c instanceof HTMLFormElement))
                  throw new Error("submitValidForm() can only be called on <form> elements");
                var p = new SubmitEvent("submit", h);
                if (c.dispatchEvent(p)) {
                  var v = h.submitter, w = null, E = c.action;
                  if (v) {
                    var g = v.getAttribute("name");
                    g && (w = document.createElement("input"), w.type = "hidden", w.name = g, w.value = v.getAttribute("value"), c.appendChild(w));
                    var x = v.getAttribute("formaction");
                    x && (c.action = x);
                  }
                  try {
                    c.submit();
                  } finally {
                    w && c.removeChild(w), c.action = E;
                  }
                }
              }, this.focusFirstInvalid = function(c) {
                if (!(c instanceof HTMLFormElement))
                  throw new Error("focusFirstInvalid() can only be called on <form> elements");
                var h = d.getElementUID(c), p = d.formInputs[h], v = p?.find(function(E) {
                  return d.summary[E];
                });
                if (v) {
                  var w = d.elementByUID[v];
                  w instanceof HTMLElement && w.focus();
                }
              }, this.isValid = function(c, h, p) {
                if (h === void 0 && (h = !0), !(c instanceof HTMLFormElement))
                  throw new Error("isValid() can only be called on <form> elements");
                h && d.validateForm(c, p);
                var v = d.getElementUID(c), w = d.formInputs[v], E = w?.some(function(g) {
                  return d.summary[g];
                }) === !0;
                return !E;
              }, this.isFieldValid = function(c, h, p) {
                h === void 0 && (h = !0), h && d.validateField(c, p);
                var v = d.getElementUID(c);
                return d.summary[v] === void 0;
              }, this.options = {
                root: document.body,
                watch: !1,
                addNoValidate: !0
              }, this.ValidationInputCssClassName = "input-validation-error", this.ValidationInputValidCssClassName = "input-validation-valid", this.ValidationMessageCssClassName = "field-validation-error", this.ValidationMessageValidCssClassName = "field-validation-valid", this.ValidationSummaryCssClassName = "validation-summary-errors", this.ValidationSummaryValidCssClassName = "validation-summary-valid", this.logger = u || a;
            }
            return y.prototype.addProvider = function(u, d) {
              this.providers[u] || (this.logger.log("Registered provider: %s", u), this.providers[u] = d);
            }, y.prototype.addMvcProviders = function() {
              var u = new b();
              this.addProvider("required", u.required), this.addProvider("length", u.stringLength), this.addProvider("maxlength", u.stringLength), this.addProvider("minlength", u.stringLength), this.addProvider("equalto", u.compare), this.addProvider("range", u.range), this.addProvider("regex", u.regex), this.addProvider("creditcard", u.creditcard), this.addProvider("email", u.email), this.addProvider("url", u.url), this.addProvider("phone", u.phone), this.addProvider("remote", u.remote);
            }, y.prototype.scanMessages = function(u, d) {
              for (var c = Array.from(u.querySelectorAll("span[form]")), h = 0, p = c; h < p.length; h++) {
                var v = p[h], w = document.getElementById(v.getAttribute("form"));
                w instanceof HTMLFormElement && d.call(this, w, v);
              }
              var E = Array.from(u.querySelectorAll("form"));
              u instanceof HTMLFormElement && E.push(u);
              var g = u instanceof Element ? u.closest("form") : null;
              g && E.push(g);
              for (var x = 0, _ = E; x < _.length; x++)
                for (var w = _[x], S = Array.from(w.querySelectorAll("[data-valmsg-for]")), T = 0, C = S; T < C.length; T++) {
                  var v = C[T];
                  d.call(this, w, v);
                }
            }, y.prototype.pushValidationMessageSpan = function(u, d) {
              var c, h, p, v = this.getElementUID(u), w = (c = (p = this.messageFor)[v]) !== null && c !== void 0 ? c : p[v] = {}, E = d.getAttribute("data-valmsg-for");
              if (E) {
                var g = (h = w[E]) !== null && h !== void 0 ? h : w[E] = [];
                g.indexOf(d) < 0 ? g.push(d) : this.logger.log("Validation element for '%s' is already tracked", name, d);
              }
            }, y.prototype.removeValidationMessageSpan = function(u, d) {
              var c = this.getElementUID(u), h = this.messageFor[c];
              if (h) {
                var p = d.getAttribute("data-valmsg-for");
                if (p) {
                  var v = h[p];
                  if (v) {
                    var w = v.indexOf(d);
                    w >= 0 ? v.splice(w, 1) : this.logger.log("Validation element for '%s' was already removed", name, d);
                  }
                }
              }
            }, y.prototype.parseDirectives = function(u) {
              for (var d = {}, c = {}, h = 9, p = 0; p < u.length; p++) {
                var v = u[p];
                if (v.name.indexOf("data-val-") === 0) {
                  var w = v.name.substr(h);
                  c[w] = v.value;
                }
              }
              var E = function(g) {
                if (g.indexOf("-") === -1) {
                  for (var x = Object.keys(c).filter(function($) {
                    return $ !== g && $.indexOf(g) === 0;
                  }), _ = {
                    error: c[g],
                    params: {}
                  }, S = (g + "-").length, T = 0; T < x.length; T++) {
                    var C = c[x[T]], A = x[T].substr(S);
                    _.params[A] = C;
                  }
                  d[g] = _;
                }
              };
              for (var w in c)
                E(w);
              return d;
            }, y.prototype.guid4 = function() {
              return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(u) {
                var d = Math.random() * 16 | 0, c = u == "x" ? d : d & 3 | 8;
                return c.toString(16);
              });
            }, y.prototype.getElementUID = function(u) {
              var d = this.elementUIDs.filter(function(h) {
                return h.node === u;
              })[0];
              if (d)
                return d.uid;
              var c = this.guid4();
              return this.elementUIDs.push({
                node: u,
                uid: c
              }), this.elementByUID[c] = u, c;
            }, y.prototype.getFormValidationTask = function(u) {
              var d = this.formInputs[u];
              if (!d || d.length === 0)
                return Promise.resolve(!0);
              for (var c = [], h = 0, p = d; h < p.length; h++) {
                var v = p[h], w = this.validators[v];
                w && c.push(w);
              }
              var E = c.map(function(g) {
                return g();
              });
              return Promise.all(E).then(function(g) {
                return g.every(function(x) {
                  return x;
                });
              });
            }, y.prototype.getMessageFor = function(u) {
              var d;
              if (u.form) {
                var c = this.getElementUID(u.form);
                return (d = this.messageFor[c]) === null || d === void 0 ? void 0 : d[u.name];
              }
            }, y.prototype.shouldValidate = function(u) {
              return !(u && u.submitter && u.submitter.formNoValidate);
            }, y.prototype.trackFormInput = function(u, d) {
              var c = this, h, p, v = this.getElementUID(u), w = (h = (p = this.formInputs)[v]) !== null && h !== void 0 ? h : p[v] = [], E = w.indexOf(d) === -1;
              if (E ? (w.push(d), this.options.addNoValidate ? (this.logger.log("Setting novalidate on form", u), u.setAttribute("novalidate", "novalidate")) : this.logger.log("Not setting novalidate on form", u)) : this.logger.log("Form input for UID '%s' is already tracked", d), !this.formEvents[v]) {
                var g = null, x = function(S, T) {
                  return g || (c.shouldValidate(S) ? (g = c.getFormValidationTask(v), S && c.preValidate(S), c.logger.log("Validating", u), g.then(function(C) {
                    return s(c, void 0, void 0, function() {
                      var A;
                      return r(this, function($) {
                        switch ($.label) {
                          case 0:
                            return this.logger.log("Validated (success = %s)", C, u), T ? (T(C), [2, C]) : (A = new CustomEvent("validation", {
                              detail: { valid: C }
                            }), u.dispatchEvent(A), [4, new Promise(function(D) {
                              return setTimeout(D, 0);
                            })]);
                          case 1:
                            return $.sent(), this.handleValidated(u, C, S), [2, C];
                        }
                      });
                    });
                  }).catch(function(C) {
                    return c.logger.log("Validation error", C), !1;
                  }).finally(function() {
                    g = null;
                  })) : Promise.resolve(!0));
                };
                u.addEventListener("submit", x);
                var _ = function(S) {
                  for (var T = c.formInputs[v], C = 0, A = T; C < A.length; C++) {
                    var $ = A[C];
                    c.resetField($);
                  }
                  c.renderSummary();
                };
                u.addEventListener("reset", _), x.remove = function() {
                  u.removeEventListener("submit", x), u.removeEventListener("reset", _);
                }, this.formEvents[v] = x;
              }
            }, y.prototype.reset = function(u) {
              this.isDisabled(u) ? this.resetField(this.getElementUID(u)) : this.scan(u);
            }, y.prototype.resetField = function(u) {
              var d = this.elementByUID[u];
              this.swapClasses(d, "", this.ValidationInputCssClassName), this.swapClasses(d, "", this.ValidationInputValidCssClassName);
              var c = o(d) && this.getMessageFor(d);
              if (c)
                for (var h = 0; h < c.length; h++)
                  c[h].innerHTML = "", this.swapClasses(c[h], "", this.ValidationMessageCssClassName), this.swapClasses(c[h], "", this.ValidationMessageValidCssClassName);
              delete this.summary[u];
            }, y.prototype.untrackFormInput = function(u, d) {
              var c, h = this.getElementUID(u), p = this.formInputs[h];
              if (p) {
                var v = p.indexOf(d);
                v >= 0 ? (p.splice(v, 1), p.length || ((c = this.formEvents[h]) === null || c === void 0 || c.remove(), delete this.formEvents[h], delete this.formInputs[h], delete this.messageFor[h])) : this.logger.log("Form input for UID '%s' was already removed", d);
              }
            }, y.prototype.addInput = function(u) {
              var d = this, c, h = this.getElementUID(u), p = this.parseDirectives(u.attributes);
              if (this.validators[h] = this.createValidator(u, p), u.form && this.trackFormInput(u.form, h), !this.inputEvents[h]) {
                var v = function(_, S) {
                  return s(d, void 0, void 0, function() {
                    var T, C, A;
                    return r(this, function($) {
                      switch ($.label) {
                        case 0:
                          if (T = this.validators[h], !T)
                            return [2, !0];
                          if (!u.dataset.valEvent && _ && _.type === "input" && !u.classList.contains(this.ValidationInputCssClassName))
                            return [2, !0];
                          this.logger.log("Validating", { event: _ }), $.label = 1;
                        case 1:
                          return $.trys.push([1, 3, , 4]), [4, T()];
                        case 2:
                          return C = $.sent(), S(C), [2, C];
                        case 3:
                          return A = $.sent(), this.logger.log("Validation error", A), [2, !1];
                        case 4:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }, w = null;
                v.debounced = function(_, S) {
                  w !== null && clearTimeout(w), w = setTimeout(function() {
                    v(_, S);
                  }, d.debounce);
                };
                var E = u instanceof HTMLSelectElement ? "change" : "input change", g = (c = u.dataset.valEvent) !== null && c !== void 0 ? c : E, x = g.split(" ");
                x.forEach(function(_) {
                  u.addEventListener(_, v.debounced);
                }), v.remove = function() {
                  x.forEach(function(_) {
                    u.removeEventListener(_, v.debounced);
                  });
                }, this.inputEvents[h] = v;
              }
            }, y.prototype.removeInput = function(u) {
              var d = this.getElementUID(u), c = this.inputEvents[d];
              c?.remove && (c.remove(), delete c.remove), delete this.summary[d], delete this.inputEvents[d], delete this.validators[d], u.form && this.untrackFormInput(u.form, d);
            }, y.prototype.scanInputs = function(u, d) {
              var c = Array.from(u.querySelectorAll(f('[data-val="true"]')));
              o(u) && u.getAttribute("data-val") === "true" && c.push(u);
              for (var h = 0; h < c.length; h++) {
                var p = c[h];
                d.call(this, p);
              }
            }, y.prototype.createSummaryDOM = function() {
              if (!Object.keys(this.summary).length)
                return null;
              var u = [], d = document.createElement("ul");
              for (var c in this.summary) {
                var h = this.elementByUID[c];
                if (!(h instanceof HTMLInputElement && (h.type === "checkbox" || h.type === "radio") && h.className === this.ValidationInputValidCssClassName) && !(u.indexOf(this.summary[c]) > -1)) {
                  var p = document.createElement("li");
                  p.innerHTML = this.summary[c], d.appendChild(p), u.push(this.summary[c]);
                }
              }
              return d;
            }, y.prototype.renderSummary = function() {
              var u = document.querySelectorAll('[data-valmsg-summary="true"]');
              if (u.length) {
                var d = JSON.stringify(this.summary, Object.keys(this.summary).sort());
                if (d !== this.renderedSummaryJSON) {
                  this.renderedSummaryJSON = d;
                  for (var c = this.createSummaryDOM(), h = 0; h < u.length; h++) {
                    for (var p = u[h], v = p.querySelectorAll("ul"), w = 0; w < v.length; w++)
                      v[w].remove();
                    c && c.hasChildNodes() ? (this.swapClasses(p, this.ValidationSummaryCssClassName, this.ValidationSummaryValidCssClassName), p.appendChild(c.cloneNode(!0))) : this.swapClasses(p, this.ValidationSummaryValidCssClassName, this.ValidationSummaryCssClassName);
                  }
                }
              }
            }, y.prototype.addError = function(u, d) {
              var c = this.getMessageFor(u);
              if (c)
                for (var h = 0; h < c.length; h++)
                  c[h], c[h].innerHTML = d, this.swapClasses(c[h], this.ValidationMessageCssClassName, this.ValidationMessageValidCssClassName);
              if (this.highlight(u, this.ValidationInputCssClassName, this.ValidationInputValidCssClassName), u.form)
                for (var p = u.form.querySelectorAll(f('[name="'.concat(u.name, '"]'))), h = 0; h < p.length; h++) {
                  this.swapClasses(p[h], this.ValidationInputCssClassName, this.ValidationInputValidCssClassName);
                  var v = this.getElementUID(p[h]);
                  this.summary[v] = d;
                }
              this.renderSummary();
            }, y.prototype.removeError = function(u) {
              var d = this.getMessageFor(u);
              if (d)
                for (var c = 0; c < d.length; c++)
                  d[c].innerHTML = "", this.swapClasses(d[c], this.ValidationMessageValidCssClassName, this.ValidationMessageCssClassName);
              if (this.unhighlight(u, this.ValidationInputCssClassName, this.ValidationInputValidCssClassName), u.form)
                for (var h = u.form.querySelectorAll(f('[name="'.concat(u.name, '"]'))), c = 0; c < h.length; c++) {
                  this.swapClasses(h[c], this.ValidationInputValidCssClassName, this.ValidationInputCssClassName);
                  var p = this.getElementUID(h[c]);
                  delete this.summary[p];
                }
              this.renderSummary();
            }, y.prototype.createValidator = function(u, d) {
              var c = this;
              return function() {
                return s(c, void 0, void 0, function() {
                  var h, p, v, w, E, g, x, _, S, T, C;
                  return r(this, function(A) {
                    switch (A.label) {
                      case 0:
                        if (!(!this.isHidden(u) && !this.isDisabled(u))) return [3, 7];
                        h = d, p = [];
                        for (v in h)
                          p.push(v);
                        w = 0, A.label = 1;
                      case 1:
                        return w < p.length ? (v = p[w], v in h ? (E = v, g = d[E], x = this.providers[E], x ? (this.logger.log("Running %s validator on element", E, u), _ = x(u.value, u, g.params), S = !1, T = g.error, typeof _ != "boolean" ? [3, 2] : (S = _, [3, 5])) : (this.logger.log("aspnet-validation provider not implemented: %s", E), [3, 6])) : [3, 6]) : [3, 7];
                      case 2:
                        return typeof _ != "string" ? [3, 3] : (S = !1, T = _, [3, 5]);
                      case 3:
                        return [4, _];
                      case 4:
                        C = A.sent(), typeof C == "boolean" ? S = C : (S = !1, T = C), A.label = 5;
                      case 5:
                        if (!S)
                          return this.addError(u, T), [2, !1];
                        A.label = 6;
                      case 6:
                        return w++, [3, 1];
                      case 7:
                        return this.removeError(u), [2, !0];
                    }
                  });
                });
              };
            }, y.prototype.isHidden = function(u) {
              return !(this.allowHiddenFields || u.offsetWidth || u.offsetHeight || u.getClientRects().length);
            }, y.prototype.isDisabled = function(u) {
              return u.disabled;
            }, y.prototype.swapClasses = function(u, d, c) {
              d && !this.isDisabled(u) && !u.classList.contains(d) && u.classList.add(d), u.classList.contains(c) && u.classList.remove(c);
            }, y.prototype.bootstrap = function(u) {
              var d = this;
              Object.assign(this.options, u), this.addMvcProviders();
              var c = window.document, h = this.options.root, p = function() {
                d.scan(h), d.options.watch && d.watch(h);
              };
              c.readyState === "complete" || c.readyState === "interactive" ? p() : c.addEventListener("DOMContentLoaded", p);
            }, y.prototype.scan = function(u) {
              u ?? (u = this.options.root), this.logger.log("Scanning", u), this.scanMessages(u, this.pushValidationMessageSpan), this.scanInputs(u, this.addInput);
            }, y.prototype.remove = function(u) {
              u ?? (u = this.options.root), this.logger.log("Removing", u), this.scanMessages(u, this.removeValidationMessageSpan), this.scanInputs(u, this.removeInput);
            }, y.prototype.watch = function(u) {
              var d = this;
              u ?? (u = this.options.root), this.observer = new MutationObserver(function(c) {
                c.forEach(function(h) {
                  d.observed(h);
                });
              }), this.observer.observe(u, {
                attributes: !0,
                childList: !0,
                subtree: !0
              }), this.logger.log("Watching for mutations");
            }, y.prototype.observed = function(u) {
              var d, c, h;
              if (u.type === "childList") {
                for (var p = 0; p < u.addedNodes.length; p++) {
                  var v = u.addedNodes[p];
                  this.logger.log("Added node", v), v instanceof HTMLElement && this.scan(v);
                }
                for (var p = 0; p < u.removedNodes.length; p++) {
                  var v = u.removedNodes[p];
                  this.logger.log("Removed node", v), v instanceof HTMLElement && this.remove(v);
                }
              } else if (u.type === "attributes" && u.target instanceof HTMLElement) {
                var w = u.attributeName;
                if (w === "disabled") {
                  var E = u.target;
                  this.reset(E);
                } else {
                  var g = (d = u.oldValue) !== null && d !== void 0 ? d : "", x = (h = (c = u.target.attributes[u.attributeName]) === null || c === void 0 ? void 0 : c.value) !== null && h !== void 0 ? h : "";
                  this.logger.log("Attribute '%s' changed from '%s' to '%s'", u.attributeName, g, x, u.target), g !== x && this.scan(u.target);
                }
              }
            }, y.prototype.highlight = function(u, d, c) {
              this.swapClasses(u, d, c);
            }, y.prototype.unhighlight = function(u, d, c) {
              this.swapClasses(u, c, d);
            }, y;
          })()
        );
        return n;
      })()
    ));
  })(je)), je.exports;
}
var kl = Ol();
function Dl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Nl(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function Ll(e, t, i) {
  return t && Nl(e.prototype, t), e;
}
var Pl = Object.defineProperty, et = function(e, t) {
  return Pl(e, "name", { value: t, configurable: !0 });
}, Ml = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Rl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Fl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, zl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Vl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ul = et(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Wt = et(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), k = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, nt = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, yn = { OUTLINE: "outline", FILLED: "filled" }, We = { FADE: "fade", SLIDE: "slide" }, Yt = { CLOSE: Wt(Ml), SUCCESS: Wt(zl), ERROR: Wt(Rl), WARNING: Wt(Vl), INFO: Wt(Fl) }, bn = et(function(e) {
  e.wrapper.classList.add(k.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(k.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), wn = et(function(e) {
  e.wrapper.classList.remove(k.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Bl = et(function(e) {
  e.wrapper.classList.add(k.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(k.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Hl = et(function(e) {
  e.wrapper.classList.remove(k.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), rr = (function() {
  function e(t) {
    var i = this;
    Dl(this, e), this.notifyOut = et(function(M) {
      M(i);
    }, "notifyOut");
    var n = t.notificationsGap, s = n === void 0 ? 20 : n, r = t.notificationsPadding, a = r === void 0 ? 20 : r, o = t.status, l = o === void 0 ? "success" : o, f = t.effect, m = f === void 0 ? We.FADE : f, b = t.type, I = b === void 0 ? "outline" : b, y = t.title, u = t.text, d = t.showIcon, c = d === void 0 ? !0 : d, h = t.customIcon, p = h === void 0 ? "" : h, v = t.customClass, w = v === void 0 ? "" : v, E = t.speed, g = E === void 0 ? 500 : E, x = t.showCloseButton, _ = x === void 0 ? !0 : x, S = t.autoclose, T = S === void 0 ? !0 : S, C = t.autotimeout, A = C === void 0 ? 3e3 : C, $ = t.position, D = $ === void 0 ? "right top" : $, O = t.customWrapper, z = O === void 0 ? "" : O;
    if (this.customWrapper = z, this.status = l, this.title = y, this.text = u, this.showIcon = c, this.customIcon = p, this.customClass = w, this.speed = g, this.effect = m, this.showCloseButton = _, this.autoclose = T, this.autotimeout = A, this.notificationsGap = s, this.notificationsPadding = a, this.type = I, this.position = D, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Ll(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(k.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(k.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](k.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](k.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](k.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](k.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](k.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](k.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](k.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(k.NOTIFY_CLOSE), n.innerHTML = Yt.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = Ul(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(k.NOTIFY), this.type) {
      case yn.OUTLINE:
        this.wrapper.classList.add(k.NOTIFY_OUTLINE);
        break;
      case yn.FILLED:
        this.wrapper.classList.add(k.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(k.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case nt.SUCCESS:
        this.wrapper.classList.add(k.NOTIFY_SUCCESS);
        break;
      case nt.ERROR:
        this.wrapper.classList.add(k.NOTIFY_ERROR);
        break;
      case nt.WARNING:
        this.wrapper.classList.add(k.NOTIFY_WARNING);
        break;
      case nt.INFO:
        this.wrapper.classList.add(k.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(k.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(k.NOTIFY_CONTENT);
    var n, s;
    this.title && (n = document.createElement("div"), n.classList.add(k.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(k.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(s);
  } }, { key: "setIcon", value: function() {
    var i = et(function(s) {
      switch (s) {
        case nt.SUCCESS:
          return Yt.SUCCESS;
        case nt.ERROR:
          return Yt.ERROR;
        case nt.WARNING:
          return Yt.WARNING;
        case nt.INFO:
          return Yt.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(k.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
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
      case We.FADE:
        this.selectedNotifyInEffect = bn, this.selectedNotifyOutEffect = wn;
        break;
      case We.SLIDE:
        this.selectedNotifyInEffect = Bl, this.selectedNotifyOutEffect = Hl;
        break;
      default:
        this.selectedNotifyInEffect = bn, this.selectedNotifyOutEffect = wn;
    }
  } }]), e;
})();
et(rr, "Notify");
var ar = rr;
globalThis.Notify = ar;
const or = ["success", "error", "warning", "info"], lr = [
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
], cr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Kt(e = {}) {
  const t = {
    ...cr,
    ...e
  };
  or.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), lr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new ar(t);
}
const ql = {
  custom: Kt,
  success(e, t = "Success", i = {}) {
    Kt({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    Kt({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    Kt({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    Kt({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(cr, e);
  },
  get allowedStatuses() {
    return [...or];
  },
  get allowedPositions() {
    return [...lr];
  }
}, hi = function() {
}, ee = {}, Se = {}, ie = {};
function jl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, s = n, r, a, o, l;
  for (r = function(f, m) {
    m.length && i.push(f), s--, s || t(i);
  }; n--; ) {
    if (a = e[n], o = Se[a], o) {
      r(a, o);
      continue;
    }
    l = ie[a] = ie[a] || [], l.push(r);
  }
}
function ur(e, t) {
  if (!e) return;
  const i = ie[e];
  if (Se[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function fi(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || hi)(t) : (e.success || hi)(e);
}
function Wl(e, t, i, n, s, r, a, o) {
  let l = e.type[0];
  if (o)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (f) {
      f.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (r += 1, r < a)
      return dr(t, n, s, r);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function dr(e, t, i, n) {
  const s = document, r = i.async, a = (i.numRetries || 0) + 1, o = i.before || hi, l = e.replace(/[\?|#].*$/, ""), f = e.replace(/^(css|img|module|nomodule)!/, "");
  let m, b, I;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    I = s.createElement("link"), I.rel = "stylesheet", I.href = f, m = "hideFocus" in I, m && I.relList && (m = 0, I.rel = "preload", I.as = "style"), i.inlineStyleNonce && I.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    I = s.createElement("img"), I.src = f;
  else if (I = s.createElement("script"), I.src = f, I.async = r === void 0 ? !0 : r, i.inlineScriptNonce && I.setAttribute("nonce", i.inlineScriptNonce), b = "noModule" in I, /^module!/.test(l)) {
    if (!b) return t(e, "l");
    I.type = "module";
  } else if (/^nomodule!/.test(l) && b)
    return t(e, "l");
  const y = function(u) {
    Wl(u, e, I, t, i, n, a, m);
  };
  I.addEventListener("load", y, { once: !0 }), I.addEventListener("error", y, { once: !0 }), o(e, I) !== !1 && s.head.appendChild(I);
}
function Yl(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, s = [];
  function r(a, o, l) {
    if (o === "e" && s.push(a), o === "b")
      if (l) s.push(a);
      else return;
    n--, n || t(s);
  }
  for (let a = 0; a < e.length; a++)
    dr(e[a], r, i);
}
function rt(e, t, i) {
  let n, s;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), s = (n ? i : t) || {}, n) {
    if (n in ee)
      throw "LoadJS";
    ee[n] = !0;
  }
  function r(a, o) {
    Yl(e, function(l) {
      fi(s, l), a && fi({ success: a, error: o }, l), ur(n, l);
    }, s);
  }
  if (s.returnPromise)
    return new Promise(r);
  r();
}
rt.ready = function(t, i) {
  return jl(t, function(n) {
    fi(i, n);
  }), rt;
};
rt.done = function(t) {
  ur(t, []);
};
rt.reset = function() {
  Object.keys(ee).forEach((t) => delete ee[t]), Object.keys(Se).forEach((t) => delete Se[t]), Object.keys(ie).forEach((t) => delete ie[t]);
};
rt.isDefined = function(t) {
  return t in ee;
};
function Kl(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = Jl(e) || e;
    let i = Alpine.$data(t);
    if (i === void 0) {
      const n = t.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && xn("element", t), i;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${fr(t)}"]`;
    let n = null;
    const s = document.getElementById(t);
    if (s && (n = s.matches(i) ? s : s.querySelector(i)), n || (n = hr(t)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const r = Alpine.$data(n);
    return r === void 0 && xn(`data-alpine-root="${t}"`, n), r;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Jl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", i = e.getAttribute?.("data-for");
  if (t || i) {
    const n = i || "";
    if (!n) return e;
    const s = hr(n);
    return s || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return e;
}
function hr(e) {
  const t = `[data-alpine-root="${fr(e)}"]`, i = document.querySelectorAll(t);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(e) || null;
}
function fr(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function xn(e, t) {
  const i = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function Gl(e) {
  e.data("rzAccordion", () => ({
    selected: "",
    // ID of the currently selected/opened section (if not allowMultiple)
    allowMultiple: !1,
    // Whether multiple sections can be open
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.allowMultiple = this.$el.dataset.multiple === "true";
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
    }
  }));
}
function Xl(e) {
  e.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const t = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (i, n) => {
        i !== t.sectionId && !t.allowMultiple && (t.open = !1);
      }) : console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
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
function Zl(e) {
  e.data("rzAlert", () => ({
    parentElement: null,
    showAlert: !0,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const t = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
      this.parentElement = document.getElementById(t);
    },
    /**
     * Executes the `dismiss` operation.
     * @returns {any} Returns the result of `dismiss` when applicable.
     */
    dismiss() {
      this.showAlert = !1;
      const t = this;
      setTimeout(() => {
        t.parentElement.style.display = "none";
      }, 205);
    }
  }));
}
function Ql(e) {
  e.data("rzAspectRatio", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function tc(e) {
  e.data("rzBrowser", () => ({
    screenSize: "",
    /**
     * Executes the `setDesktopScreenSize` operation.
     * @returns {any} Returns the result of `setDesktopScreenSize` when applicable.
     */
    setDesktopScreenSize() {
      this.screenSize = "";
    },
    /**
     * Executes the `setTabletScreenSize` operation.
     * @returns {any} Returns the result of `setTabletScreenSize` when applicable.
     */
    setTabletScreenSize() {
      this.screenSize = "max-w-2xl";
    },
    /**
     * Executes the `setPhoneScreenSize` operation.
     * @returns {any} Returns the result of `setPhoneScreenSize` when applicable.
     */
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
function ec(e, t) {
  e.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.configId, s = this.$el.dataset.nonce;
      if (i.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      t(i, {
        success: () => {
          this.initCalendar(n);
        },
        error: (r) => console.error("RzCalendar: Failed to load assets", r)
      }, s);
    },
    /**
     * Executes the `initCalendar` operation.
     * @param {any} configId Input value for this method.
     * @returns {any} Returns the result of `initCalendar` when applicable.
     */
    initCalendar(i) {
      const n = document.getElementById(i);
      if (!n) {
        console.error(`RzCalendar: Config element #${i} not found.`);
        return;
      }
      let s = {};
      try {
        s = JSON.parse(n.textContent);
      } catch (o) {
        console.error("RzCalendar: Failed to parse config JSON", o);
        return;
      }
      const r = {
        onClickDate: (o, l) => {
          this.dispatchCalendarEvent("click-day", {
            event: l,
            dates: o.context.selectedDates
          });
        },
        onClickWeekNumber: (o, l, f, m, b) => {
          this.dispatchCalendarEvent("click-week-number", {
            event: b,
            number: l,
            year: f,
            days: m
          });
        },
        onClickMonth: (o, l) => {
          this.dispatchCalendarEvent("click-month", {
            event: l,
            month: o.context.selectedMonth
          });
        },
        onClickYear: (o, l) => {
          this.dispatchCalendarEvent("click-year", {
            event: l,
            year: o.context.selectedYear
          });
        },
        onClickArrow: (o, l) => {
          this.dispatchCalendarEvent("click-arrow", {
            event: l,
            year: o.context.selectedYear,
            month: o.context.selectedMonth
          });
        },
        onChangeTime: (o, l, f) => {
          this.dispatchCalendarEvent("change-time", {
            event: l,
            time: o.context.selectedTime,
            hours: o.context.selectedHours,
            minutes: o.context.selectedMinutes,
            keeping: o.context.selectedKeeping,
            isError: f
          });
        }
      }, a = {
        ...s.options,
        styles: s.styles,
        ...r
      };
      window.VanillaCalendarPro ? (this.calendar = new VanillaCalendarPro.Calendar(this.$refs.calendarEl, a), this.calendar.init(), this.initialized = !0, this.dispatchCalendarEvent("init", { instance: this.calendar })) : console.error("RzCalendar: VanillaCalendar global not found.");
    },
    /**
     * Executes the `dispatchCalendarEvent` operation.
     * @param {any} eventName Input value for this method.
     * @param {any} detail Input value for this method.
     * @returns {any} Returns the result of `dispatchCalendarEvent` when applicable.
     */
    dispatchCalendarEvent(i, n) {
      this.$dispatch(`rz:calendar:${i}`, n);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.calendar && (this.calendar.destroy(), this.dispatchCalendarEvent("destroy", {}));
    }
  }));
}
function ic(e) {
  e.data("rzCalendarProvider", () => ({
    // --- Public State ---
    mode: "single",
    dates: [],
    // Canonical state: Flat array of ISO strings ['YYYY-MM-DD', ...], always sorted/unique
    // --- Configuration ---
    locale: "en-US",
    formatOptions: {},
    // --- Public API ---
    /** 
     * The underlying VanillaCalendarPro instance.
     * Available after the 'rz:calendar:init' event fires.
     * Use this to call VCP methods directly (e.g. showMonth, showYear).
     */
    calendarApi: null,
    // --- Internal ---
    _isUpdatingFromCalendar: !1,
    _lastAppliedState: null,
    _handlers: [],
    // --- Computed Helpers ---
    get date() {
      return this.dates[0] || "";
    },
    set date(t) {
      if (!t) {
        this.dates = [];
        return;
      }
      this._isValidIsoDate(t) && (this.dates = this._normalize([t]));
    },
    get startDate() {
      return this.dates[0] || "";
    },
    get endDate() {
      return this.dates[this.dates.length - 1] || "";
    },
    get isRangeComplete() {
      return this.mode === "multiple-ranged" && this.dates.length >= 2;
    },
    // --- Formatting Helpers ---
    get formattedDate() {
      return this.date ? this._format(this.date) : "";
    },
    get formattedRange() {
      if (!this.startDate) return "";
      const t = this._format(this.startDate);
      return this.endDate ? `${t} - ${this._format(this.endDate)}` : t;
    },
    // --- Lifecycle ---
    init() {
      this.mode = this.$el.dataset.mode || "single", this.locale = this.$el.dataset.locale || "en-US";
      try {
        this.formatOptions = JSON.parse(this.$el.dataset.formatOptions || "{}");
      } catch {
      }
      try {
        const s = JSON.parse(this.$el.dataset.initialDates || "[]");
        this.dates = this._normalize(s);
      } catch {
        this.dates = [];
      }
      const t = (s) => {
        this.calendarApi = s.detail.instance, this.syncToCalendar();
      };
      this.$el.addEventListener("rz:calendar:init", t), this._handlers.push({ type: "rz:calendar:init", fn: t });
      const i = () => {
        this.calendarApi = null, this._lastAppliedState = null;
      };
      this.$el.addEventListener("rz:calendar:destroy", i), this._handlers.push({ type: "rz:calendar:destroy", fn: i });
      const n = (s) => {
        this._isUpdatingFromCalendar = !0;
        const r = this.isRangeComplete;
        this.dates = this._normalize(s.detail.dates || []), !r && this.isRangeComplete && this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
          detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
          bubbles: !0,
          composed: !0
        })), this.$nextTick(() => this._isUpdatingFromCalendar = !1);
      };
      this.$el.addEventListener("rz:calendar:click-day", n), this._handlers.push({ type: "rz:calendar:click-day", fn: n }), this.$watch("dates", () => {
        if (this._isUpdatingFromCalendar) return;
        const s = Array.isArray(this.dates) ? this.dates : [], r = this._normalize(s);
        if (!Array.isArray(this.dates) || r.length !== this.dates.length || r.some((o, l) => o !== this.dates[l])) {
          this.dates = r;
          return;
        }
        this.syncToCalendar();
      });
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this._handlers.forEach((t) => this.$el.removeEventListener(t.type, t.fn)), this._handlers = [];
    },
    /**
     * Executes the `syncToCalendar` operation.
     * @returns {any} Returns the result of `syncToCalendar` when applicable.
     */
    syncToCalendar() {
      if (!this.calendarApi) return;
      let t = [...this.dates];
      if (this.mode === "multiple-ranged" && this.dates.length >= 2) {
        const o = this.dates[0], l = this.dates[this.dates.length - 1];
        t = [`${o}:${l}`];
      }
      let i, n, s = !1;
      if (this.dates.length > 0) {
        const o = this.parseIsoLocal(this.dates[0]);
        isNaN(o.getTime()) || (i = o.getMonth(), n = o.getFullYear(), s = !0);
      }
      const r = JSON.stringify({ mode: this.mode, dates: t, m: i, y: n });
      if (this._lastAppliedState === r) return;
      this._lastAppliedState = r;
      const a = { selectedDates: t };
      s && (a.selectedMonth = i, a.selectedYear = n), this.calendarApi.set(
        a,
        {
          dates: !0,
          month: s,
          year: s,
          holidays: !1,
          time: !1
        }
      );
    },
    // --- Utilities ---
    _format(t) {
      const i = this.parseIsoLocal(t);
      return isNaN(i.getTime()) ? t : new Intl.DateTimeFormat(this.locale, this.formatOptions).format(i);
    },
    /**
     * Executes the `_extractIsoDates` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `_extractIsoDates` when applicable.
     */
    _extractIsoDates(t) {
      return typeof t != "string" ? [] : t.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
    },
    /**
     * Executes the `_isValidIsoDate` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `_isValidIsoDate` when applicable.
     */
    _isValidIsoDate(t) {
      if (typeof t != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return !1;
      const [i, n, s] = t.split("-").map(Number), r = new Date(Date.UTC(i, n - 1, s));
      return r.getUTCFullYear() === i && r.getUTCMonth() + 1 === n && r.getUTCDate() === s;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(t) {
      const n = (Array.isArray(t) ? t : []).flat(1 / 0).flatMap((s) => typeof s == "string" ? this._extractIsoDates(s) : []).filter((s) => this._isValidIsoDate(s));
      if (this.mode === "single")
        return [...new Set(n)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const s = n.sort();
        return s.length <= 1 ? s : [s[0], s[s.length - 1]];
      }
      return [...new Set(n)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(t) {
      const [i, n, s] = t.split("-").map(Number);
      return new Date(i, n - 1, s);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(t) {
      const i = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getDate()).padStart(2, "0");
      return `${i}-${n}-${s}`;
    },
    // --- Public API ---
    setToday() {
      this.dates = this._normalize([this.toLocalISO(/* @__PURE__ */ new Date())]);
    },
    /**
     * Executes the `addDays` operation.
     * @param {any} n Input value for this method.
     * @returns {any} Returns the result of `addDays` when applicable.
     */
    addDays(t) {
      if (this.dates.length === 0) return;
      const i = this.parseIsoLocal(this.dates[0]);
      isNaN(i.getTime()) || (i.setDate(i.getDate() + t), this.dates = this._normalize([this.toLocalISO(i)]));
    },
    /**
     * Executes the `setDate` operation.
     * @param {any} dateStr Input value for this method.
     * @returns {any} Returns the result of `setDate` when applicable.
     */
    setDate(t) {
      this.dates = this._normalize(t ? [t] : []);
    },
    /**
     * Executes the `clear` operation.
     * @returns {any} Returns the result of `clear` when applicable.
     */
    clear() {
      this.dates = [];
    },
    /**
     * Executes the `toggleDate` operation.
     * @param {any} dateStr Input value for this method.
     * @returns {any} Returns the result of `toggleDate` when applicable.
     */
    toggleDate(t) {
      let i;
      this.dates.includes(t) ? i = this.dates.filter((n) => n !== t) : i = [...this.dates, t], this.dates = this._normalize(i);
    }
  }));
}
function nc(e, t) {
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const n = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (f) {
          return console.error("[rzCarousel] Bad assets JSON:", f), [];
        }
      })(), s = this.$el.dataset.nonce || "", r = i(this.$el.dataset.config), a = r.Options || {}, o = r.Plugins || [], l = this;
      n.length > 0 && typeof t == "function" ? t(
        n,
        {
          /**
           * Executes the `success` operation.
           * @returns {any} Returns the result of `success` when applicable.
           */
          success() {
            window.EmblaCarousel ? l.initializeEmbla(a, o) : console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
          },
          /**
           * Executes the `error` operation.
           * @param {any} err Input value for this method.
           * @returns {any} Returns the result of `error` when applicable.
           */
          error(f) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", f);
          }
        },
        s
      ) : window.EmblaCarousel ? this.initializeEmbla(a, o) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    /**
     * Executes the `initializeEmbla` operation.
     * @param {any} options Input value for this method.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `initializeEmbla` when applicable.
     */
    initializeEmbla(n, s) {
      const r = this.$el.querySelector('[x-ref="viewport"]');
      if (!r) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const a = this.instantiatePlugins(s);
      this.emblaApi = window.EmblaCarousel(r, n, a), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
    instantiatePlugins(n) {
      return !Array.isArray(n) || n.length === 0 ? [] : n.map((s) => {
        const r = window[s.Name];
        if (typeof r != "function")
          return console.error(`[rzCarousel] Plugin constructor '${s.Name}' not found on window object.`), null;
        try {
          return r(s.Options || {});
        } catch (a) {
          return console.error(`[rzCarousel] Error instantiating plugin '${s.Name}':`, a), null;
        }
      }).filter(Boolean);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.emblaApi && this.emblaApi.destroy();
    },
    /**
     * Executes the `onSelect` operation.
     * @returns {any} Returns the result of `onSelect` when applicable.
     */
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
function sc(e, t) {
  e.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function rc(e) {
  e.data("rzCollapsible", () => ({
    isOpen: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.isOpen = this.$el.dataset.defaultOpen === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.isOpen = !this.isOpen;
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.isOpen ? "open" : "closed";
    }
  }));
}
function ac(e) {
  e.data("rzClipboard", () => ({
    value: null,
    targetSelector: null,
    preferValue: !1,
    feedbackDuration: 1200,
    useFallback: !0,
    disabled: !1,
    copied: !1,
    timeoutHandle: null,
    get notCopied() {
      return !this.copied;
    },
    init() {
      this.value = this.$el.dataset.copyValue || null, this.targetSelector = this.$el.dataset.targetSelector || null, this.preferValue = this.$el.dataset.preferValue === "true", this.feedbackDuration = parseInt(this.$el.dataset.feedbackDuration, 10) || 1200, this.useFallback = this.$el.dataset.useFallback === "true", this.disabled = this.$el.dataset.disabled === "true";
    },
    getTextToCopy() {
      if (this.preferValue && this.value) return this.value;
      if (this.targetSelector) {
        const t = document.querySelector(this.targetSelector);
        if (t)
          return t.value !== void 0 ? t.value : t.textContent;
      }
      return this.value;
    },
    async copy() {
      if (this.disabled) return;
      const t = this.getTextToCopy(), i = t ? t.trim() : "";
      if (!i) {
        this.dispatchFailed("empty-text");
        return;
      }
      try {
        navigator.clipboard && window.isSecureContext ? (await navigator.clipboard.writeText(i), this.onSuccess(i)) : this.useFallback ? this.fallbackCopy(i) ? this.onSuccess(i) : this.dispatchFailed("clipboard-unavailable") : this.dispatchFailed("clipboard-unavailable");
      } catch (n) {
        this.dispatchFailed("permission-denied", n);
      }
    },
    onSuccess(t) {
      this.copied = !0, this.$dispatch("rz:copy", { id: this.$el.dataset.alpineRoot, text: t }), this.timeoutHandle && clearTimeout(this.timeoutHandle), this.timeoutHandle = setTimeout(() => {
        this.copied = !1;
      }, this.feedbackDuration);
    },
    fallbackCopy(t) {
      const i = document.createElement("textarea");
      i.value = t, i.style.position = "fixed", i.style.left = "-999999px", i.style.top = "-999999px", document.body.appendChild(i), i.focus(), i.select();
      try {
        return document.execCommand("copy"), i.remove(), !0;
      } catch {
        return i.remove(), !1;
      }
    },
    dispatchFailed(t, i = null) {
      this.$dispatch("rz:copy-failed", {
        id: this.$el.dataset.alpineRoot,
        reason: t,
        error: i
      });
    }
  }));
}
function oc(e, t) {
  e.data("rzCombobox", () => ({
    tomSelect: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      i.length > 0 && typeof t == "function" ? t(i, {
        success: () => this.initTomSelect(),
        error: (s) => console.error("RzCombobox: Failed to load assets.", s)
      }, n) : window.TomSelect && this.initTomSelect();
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const i = this.$refs.selectInput;
      if (!i) return;
      const n = document.getElementById(this.$el.dataset.configId), s = n ? JSON.parse(n.textContent) : {}, r = {}, a = (o, l) => {
        if (!o) return null;
        const f = document.createElement("div");
        let m = l.item;
        if (typeof m == "string")
          try {
            m = JSON.parse(m);
          } catch {
          }
        const b = {
          ...l,
          item: m
        };
        return e && typeof e.addScopeToNode == "function" ? e.addScopeToNode(f, b) : f._x_dataStack = [b], f.innerHTML = o.innerHTML, f;
      };
      this.$refs.optionTemplate && (r.option = (o, l) => a(this.$refs.optionTemplate, o)), this.$refs.itemTemplate && (r.item = (o, l) => a(this.$refs.itemTemplate, o)), s.dataAttr = "data-item", this.tomSelect = new TomSelect(i, {
        ...s,
        render: r,
        onInitialize: function() {
          this.sync();
        }
      });
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.tomSelect && (this.tomSelect.destroy(), this.tomSelect = null);
    }
  }));
}
function lc(e, t) {
  e.data("rzColorPickerProvider", () => ({
    colorPicker: {
      value: "",
      open: null,
      setValue: null,
      getValue: null,
      updateConfiguration: null
    },
    config: {},
    _isSyncingFromInput: !1,
    _isSyncingToInput: !1,
    _inputListenerAttached: !1,
    init() {
      this.colorPicker.open = this.openPicker.bind(this), this.colorPicker.setValue = this.setValue.bind(this), this.colorPicker.getValue = () => this.colorPicker.value, this.colorPicker.updateConfiguration = this.updateConfiguration.bind(this), this.colorPicker.value = this.readValue(this.$el.dataset.initialValue || ""), this.config = this.readConfig(), this.$watch("colorPicker.value", (s) => {
        const r = this.readValue(s);
        if (r !== s) {
          this.colorPicker.value = r;
          return;
        }
        this.syncInputFromState();
      });
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      t(i, n).then(() => this.initializeColoris()).catch((s) => this.handleAssetError(s));
    },
    readValue(i) {
      return typeof i == "string" ? i.trim() : "";
    },
    readConfig() {
      const i = this.$el.dataset.config;
      if (!i)
        return {};
      try {
        return JSON.parse(i);
      } catch {
        return {};
      }
    },
    initializeColoris() {
      const i = this.$refs.input;
      !i || !window.Coloris || (this.config = {
        el: i,
        wrap: !1,
        themeMode: "auto",
        onChange: (n, s) => {
          s === this.$refs.input && (this.syncStateFromInput(s), s.dispatchEvent(new CustomEvent("rz:colorpicker:onchange", {
            bubbles: !0,
            composed: !0,
            detail: {
              colorPicker: this.colorPicker,
              updateConfiguration: this.updateConfiguration.bind(this),
              el: s,
              providerEl: this.$el
            }
          })));
        },
        ...this.config
      }, window.Coloris(this.config), this.syncStateFromInput(i), this._inputListenerAttached || (i.addEventListener("input", () => {
        this.syncStateFromInput(i);
      }), this._inputListenerAttached = !0), this.syncInputFromState());
    },
    openPicker(i) {
      const n = this.$refs.input;
      n && (this.positionAnchorInput(n, i), this.syncInputFromState(), n.focus(), n.dispatchEvent(new MouseEvent("click", { bubbles: !0 })));
    },
    positionAnchorInput(i, n) {
      const s = n?.currentTarget;
      if (!s || typeof s.getBoundingClientRect != "function")
        return;
      const r = s.getBoundingClientRect();
      i.style.left = `${Math.round(r.left)}px`, i.style.top = `${Math.round(r.bottom)}px`;
    },
    setValue(i) {
      this.colorPicker.value = i;
    },
    updateConfiguration(i) {
      this.config = {
        ...this.config,
        ...i
      };
      const n = this.$refs.input;
      !window.Coloris || !n || window.Coloris.setInstance(n, this.config);
    },
    syncStateFromInput(i) {
      !i || this._isSyncingToInput || (this._isSyncingFromInput = !0, this.colorPicker.value = this.readValue(i.value || ""), queueMicrotask(() => {
        this._isSyncingFromInput = !1;
      }));
    },
    syncInputFromState() {
      const i = this.$refs.input;
      if (!i || this._isSyncingFromInput)
        return;
      const n = this.readValue(this.colorPicker.value);
      i.value !== n && (this._isSyncingToInput = !0, i.value = n, i.dispatchEvent(new Event("input", { bubbles: !0 })), queueMicrotask(() => {
        this._isSyncingToInput = !1;
      }));
    },
    handleAssetError(i) {
      console.error("Failed to load Coloris assets.", i);
    }
  }));
}
function cc(e) {
  e.data("rzColorSwatch", () => ({
    // ──────────────────────────────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────────────────────────────
    value: "",
    withoutTransparency: !1,
    isDisabled: !1,
    // Derived inline style string used by the swatch element.
    swatchStyle: "",
    // ──────────────────────────────────────────────────────────────────────
    // LIFECYCLE
    // ──────────────────────────────────────────────────────────────────────
    init() {
      this.value = this.readValue(this.$el.dataset.value), this.withoutTransparency = this.readBool(this.$el.dataset.withoutTransparency), this.isDisabled = this.readBool(this.$el.dataset.disabled), this.$watch("value", (t) => {
        const i = this.readValue(t);
        if (i !== t) {
          this.value = i;
          return;
        }
        this.refreshSwatch();
      }), this.$watch("withoutTransparency", () => {
        this.refreshSwatch();
      }), this.refreshSwatch();
    },
    // ──────────────────────────────────────────────────────────────────────
    // PUBLIC API (imperative interop)
    // ──────────────────────────────────────────────────────────────────────
    getValue() {
      return this.value;
    },
    setValue(t) {
      this.value = t;
    },
    // Optional helper if parent code needs to toggle checkerboard behavior.
    setWithoutTransparency(t) {
      this.withoutTransparency = !!t;
    },
    // ──────────────────────────────────────────────────────────────────────
    // NORMALIZATION / PARSING
    // ──────────────────────────────────────────────────────────────────────
    readBool(t) {
      return t === "true";
    },
    readValue(t) {
      return typeof t != "string" ? "" : t.trim();
    },
    // ──────────────────────────────────────────────────────────────────────
    // COLOR INSPECTION
    // ──────────────────────────────────────────────────────────────────────
    isCssColor(t) {
      try {
        return typeof CSS < "u" && typeof CSS.supports == "function" ? CSS.supports("color", t) : !0;
      } catch {
        return !1;
      }
    },
    hasAlpha(t) {
      const i = t.trim().toLowerCase();
      return !!(i === "transparent" || /^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i.test(i) || /\b(?:rgba|hsla)\s*\(/i.test(i) || /\b(?:rgb|hsl|lab|lch|oklab|oklch|color)\s*\([^)]*\/\s*[\d.]+%?\s*\)/i.test(i));
    },
    // ──────────────────────────────────────────────────────────────────────
    // STYLE COMPUTATION
    // ──────────────────────────────────────────────────────────────────────
    getEmptyStyle() {
      return [
        "background:",
        "linear-gradient(",
        "to bottom right,",
        "transparent calc(50% - 1px),",
        "hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px),",
        "transparent calc(50% + 1px)",
        ") no-repeat;"
      ].join(" ");
    },
    getInvalidStyle() {
      return "background-color: transparent;";
    },
    getSolidColorStyle(t) {
      return `background-color: ${t};`;
    },
    getAlphaPreviewStyle(t) {
      return [
        `background: linear-gradient(${t}, ${t}),`,
        "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)",
        "0% 50% / 10px 10px;"
      ].join(" ");
    },
    refreshSwatch() {
      const t = this.value;
      if (!t) {
        this.swatchStyle = this.getEmptyStyle();
        return;
      }
      if (!this.isCssColor(t)) {
        this.swatchStyle = this.getInvalidStyle();
        return;
      }
      if (!this.withoutTransparency && this.hasAlpha(t)) {
        this.swatchStyle = this.getAlphaPreviewStyle(t);
        return;
      }
      this.swatchStyle = this.getSolidColorStyle(t);
    }
  }));
}
function uc(e, t) {
  e.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = this.$el.dataset.config, n = document.getElementById(this.$el.dataset.uid + "-input");
      if (i) {
        const a = JSON.parse(i);
        a && (this.options = a.options || {}, this.placeholder = a.placeholder || "", this.prependText = a.prependText || "");
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
function dc(e) {
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
          this.$el.querySelector('[role="dialog"], [role="alertdialog"], [data-modal-panel="true"]')?.querySelector(`button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex="-1"])`)?.focus(), this.$el.dispatchEvent(new CustomEvent("rz:modal-after-open", {
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
    /**
     * Executes the `notModalOpen` operation.
     * @returns {any} Returns the result of `notModalOpen` when applicable.
     */
    notModalOpen() {
      return !this.modalOpen;
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this._openListener && this.eventTriggerName && window.removeEventListener(this.eventTriggerName, this._openListener), this._closeEventListener && window.removeEventListener(this.closeEventName, this._closeEventListener), this._escapeListener && window.removeEventListener("keydown", this._escapeListener), document.body.classList.remove("overflow-hidden"), document.body.style.setProperty("--page-scrollbar-width", "0px");
    },
    /**
     * Executes the `openModal` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `openModal` when applicable.
     */
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
const Lt = Math.min, yt = Math.max, Ce = Math.round, ge = Math.floor, X = (e) => ({
  x: e,
  y: e
}), hc = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, fc = {
  start: "end",
  end: "start"
};
function pi(e, t, i) {
  return yt(e, Lt(t, i));
}
function re(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Et(e) {
  return e.split("-")[0];
}
function ae(e) {
  return e.split("-")[1];
}
function pr(e) {
  return e === "x" ? "y" : "x";
}
function Vi(e) {
  return e === "y" ? "height" : "width";
}
const pc = /* @__PURE__ */ new Set(["top", "bottom"]);
function st(e) {
  return pc.has(Et(e)) ? "y" : "x";
}
function Ui(e) {
  return pr(st(e));
}
function mc(e, t, i) {
  i === void 0 && (i = !1);
  const n = ae(e), s = Ui(e), r = Vi(s);
  let a = s === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[r] > t.floating[r] && (a = Ae(a)), [a, Ae(a)];
}
function gc(e) {
  const t = Ae(e);
  return [mi(e), t, mi(t)];
}
function mi(e) {
  return e.replace(/start|end/g, (t) => fc[t]);
}
const In = ["left", "right"], En = ["right", "left"], vc = ["top", "bottom"], yc = ["bottom", "top"];
function bc(e, t, i) {
  switch (e) {
    case "top":
    case "bottom":
      return i ? t ? En : In : t ? In : En;
    case "left":
    case "right":
      return t ? vc : yc;
    default:
      return [];
  }
}
function wc(e, t, i, n) {
  const s = ae(e);
  let r = bc(Et(e), i === "start", n);
  return s && (r = r.map((a) => a + "-" + s), t && (r = r.concat(r.map(mi)))), r;
}
function Ae(e) {
  return e.replace(/left|right|bottom|top/g, (t) => hc[t]);
}
function xc(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function mr(e) {
  return typeof e != "number" ? xc(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function $e(e) {
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
function _n(e, t, i) {
  let {
    reference: n,
    floating: s
  } = e;
  const r = st(t), a = Ui(t), o = Vi(a), l = Et(t), f = r === "y", m = n.x + n.width / 2 - s.width / 2, b = n.y + n.height / 2 - s.height / 2, I = n[o] / 2 - s[o] / 2;
  let y;
  switch (l) {
    case "top":
      y = {
        x: m,
        y: n.y - s.height
      };
      break;
    case "bottom":
      y = {
        x: m,
        y: n.y + n.height
      };
      break;
    case "right":
      y = {
        x: n.x + n.width,
        y: b
      };
      break;
    case "left":
      y = {
        x: n.x - s.width,
        y: b
      };
      break;
    default:
      y = {
        x: n.x,
        y: n.y
      };
  }
  switch (ae(t)) {
    case "start":
      y[a] -= I * (i && f ? -1 : 1);
      break;
    case "end":
      y[a] += I * (i && f ? -1 : 1);
      break;
  }
  return y;
}
async function Ic(e, t) {
  var i;
  t === void 0 && (t = {});
  const {
    x: n,
    y: s,
    platform: r,
    rects: a,
    elements: o,
    strategy: l
  } = e, {
    boundary: f = "clippingAncestors",
    rootBoundary: m = "viewport",
    elementContext: b = "floating",
    altBoundary: I = !1,
    padding: y = 0
  } = re(t, e), u = mr(y), c = o[I ? b === "floating" ? "reference" : "floating" : b], h = $e(await r.getClippingRect({
    element: (i = await (r.isElement == null ? void 0 : r.isElement(c))) == null || i ? c : c.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(o.floating)),
    boundary: f,
    rootBoundary: m,
    strategy: l
  })), p = b === "floating" ? {
    x: n,
    y: s,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, v = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(o.floating)), w = await (r.isElement == null ? void 0 : r.isElement(v)) ? await (r.getScale == null ? void 0 : r.getScale(v)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, E = $e(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: o,
    rect: p,
    offsetParent: v,
    strategy: l
  }) : p);
  return {
    top: (h.top - E.top + u.top) / w.y,
    bottom: (E.bottom - h.bottom + u.bottom) / w.y,
    left: (h.left - E.left + u.left) / w.x,
    right: (E.right - h.right + u.right) / w.x
  };
}
const Ec = async (e, t, i) => {
  const {
    placement: n = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: a
  } = i, o = r.filter(Boolean), l = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let f = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: s
  }), {
    x: m,
    y: b
  } = _n(f, n, l), I = n, y = {}, u = 0;
  for (let c = 0; c < o.length; c++) {
    var d;
    const {
      name: h,
      fn: p
    } = o[c], {
      x: v,
      y: w,
      data: E,
      reset: g
    } = await p({
      x: m,
      y: b,
      initialPlacement: n,
      placement: I,
      strategy: s,
      middlewareData: y,
      rects: f,
      platform: {
        ...a,
        detectOverflow: (d = a.detectOverflow) != null ? d : Ic
      },
      elements: {
        reference: e,
        floating: t
      }
    });
    m = v ?? m, b = w ?? b, y = {
      ...y,
      [h]: {
        ...y[h],
        ...E
      }
    }, g && u <= 50 && (u++, typeof g == "object" && (g.placement && (I = g.placement), g.rects && (f = g.rects === !0 ? await a.getElementRects({
      reference: e,
      floating: t,
      strategy: s
    }) : g.rects), {
      x: m,
      y: b
    } = _n(f, I, l)), c = -1);
  }
  return {
    x: m,
    y: b,
    placement: I,
    strategy: s,
    middlewareData: y
  };
}, _c = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: i,
      y: n,
      placement: s,
      rects: r,
      platform: a,
      elements: o,
      middlewareData: l
    } = t, {
      element: f,
      padding: m = 0
    } = re(e, t) || {};
    if (f == null)
      return {};
    const b = mr(m), I = {
      x: i,
      y: n
    }, y = Ui(s), u = Vi(y), d = await a.getDimensions(f), c = y === "y", h = c ? "top" : "left", p = c ? "bottom" : "right", v = c ? "clientHeight" : "clientWidth", w = r.reference[u] + r.reference[y] - I[y] - r.floating[u], E = I[y] - r.reference[y], g = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(f));
    let x = g ? g[v] : 0;
    (!x || !await (a.isElement == null ? void 0 : a.isElement(g))) && (x = o.floating[v] || r.floating[u]);
    const _ = w / 2 - E / 2, S = x / 2 - d[u] / 2 - 1, T = Lt(b[h], S), C = Lt(b[p], S), A = T, $ = x - d[u] - C, D = x / 2 - d[u] / 2 + _, O = pi(A, D, $), z = !l.arrow && ae(s) != null && D !== O && r.reference[u] / 2 - (D < A ? T : C) - d[u] / 2 < 0, M = z ? D < A ? D - A : D - $ : 0;
    return {
      [y]: I[y] + M,
      data: {
        [y]: O,
        centerOffset: D - O - M,
        ...z && {
          alignmentOffset: M
        }
      },
      reset: z
    };
  }
}), Tc = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var i, n;
      const {
        placement: s,
        middlewareData: r,
        rects: a,
        initialPlacement: o,
        platform: l,
        elements: f
      } = t, {
        mainAxis: m = !0,
        crossAxis: b = !0,
        fallbackPlacements: I,
        fallbackStrategy: y = "bestFit",
        fallbackAxisSideDirection: u = "none",
        flipAlignment: d = !0,
        ...c
      } = re(e, t);
      if ((i = r.arrow) != null && i.alignmentOffset)
        return {};
      const h = Et(s), p = st(o), v = Et(o) === o, w = await (l.isRTL == null ? void 0 : l.isRTL(f.floating)), E = I || (v || !d ? [Ae(o)] : gc(o)), g = u !== "none";
      !I && g && E.push(...wc(o, d, u, w));
      const x = [o, ...E], _ = await l.detectOverflow(t, c), S = [];
      let T = ((n = r.flip) == null ? void 0 : n.overflows) || [];
      if (m && S.push(_[h]), b) {
        const D = mc(s, a, w);
        S.push(_[D[0]], _[D[1]]);
      }
      if (T = [...T, {
        placement: s,
        overflows: S
      }], !S.every((D) => D <= 0)) {
        var C, A;
        const D = (((C = r.flip) == null ? void 0 : C.index) || 0) + 1, O = x[D];
        if (O && (!(b === "alignment" ? p !== st(O) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        T.every((F) => st(F.placement) === p ? F.overflows[0] > 0 : !0)))
          return {
            data: {
              index: D,
              overflows: T
            },
            reset: {
              placement: O
            }
          };
        let z = (A = T.filter((M) => M.overflows[0] <= 0).sort((M, F) => M.overflows[1] - F.overflows[1])[0]) == null ? void 0 : A.placement;
        if (!z)
          switch (y) {
            case "bestFit": {
              var $;
              const M = ($ = T.filter((F) => {
                if (g) {
                  const K = st(F.placement);
                  return K === p || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  K === "y";
                }
                return !0;
              }).map((F) => [F.placement, F.overflows.filter((K) => K > 0).reduce((K, Tr) => K + Tr, 0)]).sort((F, K) => F[1] - K[1])[0]) == null ? void 0 : $[0];
              M && (z = M);
              break;
            }
            case "initialPlacement":
              z = o;
              break;
          }
        if (s !== z)
          return {
            reset: {
              placement: z
            }
          };
      }
      return {};
    }
  };
}, Sc = /* @__PURE__ */ new Set(["left", "top"]);
async function Cc(e, t) {
  const {
    placement: i,
    platform: n,
    elements: s
  } = e, r = await (n.isRTL == null ? void 0 : n.isRTL(s.floating)), a = Et(i), o = ae(i), l = st(i) === "y", f = Sc.has(a) ? -1 : 1, m = r && l ? -1 : 1, b = re(t, e);
  let {
    mainAxis: I,
    crossAxis: y,
    alignmentAxis: u
  } = typeof b == "number" ? {
    mainAxis: b,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: b.mainAxis || 0,
    crossAxis: b.crossAxis || 0,
    alignmentAxis: b.alignmentAxis
  };
  return o && typeof u == "number" && (y = o === "end" ? u * -1 : u), l ? {
    x: y * m,
    y: I * f
  } : {
    x: I * f,
    y: y * m
  };
}
const Ac = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var i, n;
      const {
        x: s,
        y: r,
        placement: a,
        middlewareData: o
      } = t, l = await Cc(t, e);
      return a === ((i = o.offset) == null ? void 0 : i.placement) && (n = o.arrow) != null && n.alignmentOffset ? {} : {
        x: s + l.x,
        y: r + l.y,
        data: {
          ...l,
          placement: a
        }
      };
    }
  };
}, $c = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: i,
        y: n,
        placement: s,
        platform: r
      } = t, {
        mainAxis: a = !0,
        crossAxis: o = !1,
        limiter: l = {
          fn: (h) => {
            let {
              x: p,
              y: v
            } = h;
            return {
              x: p,
              y: v
            };
          }
        },
        ...f
      } = re(e, t), m = {
        x: i,
        y: n
      }, b = await r.detectOverflow(t, f), I = st(Et(s)), y = pr(I);
      let u = m[y], d = m[I];
      if (a) {
        const h = y === "y" ? "top" : "left", p = y === "y" ? "bottom" : "right", v = u + b[h], w = u - b[p];
        u = pi(v, u, w);
      }
      if (o) {
        const h = I === "y" ? "top" : "left", p = I === "y" ? "bottom" : "right", v = d + b[h], w = d - b[p];
        d = pi(v, d, w);
      }
      const c = l.fn({
        ...t,
        [y]: u,
        [I]: d
      });
      return {
        ...c,
        data: {
          x: c.x - i,
          y: c.y - n,
          enabled: {
            [y]: a,
            [I]: o
          }
        }
      };
    }
  };
};
function Re() {
  return typeof window < "u";
}
function Ut(e) {
  return gr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function B(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Q(e) {
  var t;
  return (t = (gr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function gr(e) {
  return Re() ? e instanceof Node || e instanceof B(e).Node : !1;
}
function j(e) {
  return Re() ? e instanceof Element || e instanceof B(e).Element : !1;
}
function Z(e) {
  return Re() ? e instanceof HTMLElement || e instanceof B(e).HTMLElement : !1;
}
function Tn(e) {
  return !Re() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof B(e).ShadowRoot;
}
const Oc = /* @__PURE__ */ new Set(["inline", "contents"]);
function oe(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: s
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !Oc.has(s);
}
const kc = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Dc(e) {
  return kc.has(Ut(e));
}
const Nc = [":popover-open", ":modal"];
function Fe(e) {
  return Nc.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const Lc = ["transform", "translate", "scale", "rotate", "perspective"], Pc = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Mc = ["paint", "layout", "strict", "content"];
function Bi(e) {
  const t = Hi(), i = j(e) ? W(e) : e;
  return Lc.some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || Pc.some((n) => (i.willChange || "").includes(n)) || Mc.some((n) => (i.contain || "").includes(n));
}
function Rc(e) {
  let t = ct(e);
  for (; Z(t) && !Pt(t); ) {
    if (Bi(t))
      return t;
    if (Fe(t))
      return null;
    t = ct(t);
  }
  return null;
}
function Hi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Fc = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Pt(e) {
  return Fc.has(Ut(e));
}
function W(e) {
  return B(e).getComputedStyle(e);
}
function ze(e) {
  return j(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function ct(e) {
  if (Ut(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Tn(e) && e.host || // Fallback.
    Q(e)
  );
  return Tn(t) ? t.host : t;
}
function vr(e) {
  const t = ct(e);
  return Pt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Z(t) && oe(t) ? t : vr(t);
}
function ne(e, t, i) {
  var n;
  t === void 0 && (t = []), i === void 0 && (i = !0);
  const s = vr(e), r = s === ((n = e.ownerDocument) == null ? void 0 : n.body), a = B(s);
  if (r) {
    const o = gi(a);
    return t.concat(a, a.visualViewport || [], oe(s) ? s : [], o && i ? ne(o) : []);
  }
  return t.concat(s, ne(s, [], i));
}
function gi(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function yr(e) {
  const t = W(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const s = Z(e), r = s ? e.offsetWidth : i, a = s ? e.offsetHeight : n, o = Ce(i) !== r || Ce(n) !== a;
  return o && (i = r, n = a), {
    width: i,
    height: n,
    $: o
  };
}
function qi(e) {
  return j(e) ? e : e.contextElement;
}
function kt(e) {
  const t = qi(e);
  if (!Z(t))
    return X(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: s,
    $: r
  } = yr(t);
  let a = (r ? Ce(i.width) : i.width) / n, o = (r ? Ce(i.height) : i.height) / s;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const zc = /* @__PURE__ */ X(0);
function br(e) {
  const t = B(e);
  return !Hi() || !t.visualViewport ? zc : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Vc(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== B(e) ? !1 : t;
}
function _t(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const s = e.getBoundingClientRect(), r = qi(e);
  let a = X(1);
  t && (n ? j(n) && (a = kt(n)) : a = kt(e));
  const o = Vc(r, i, n) ? br(r) : X(0);
  let l = (s.left + o.x) / a.x, f = (s.top + o.y) / a.y, m = s.width / a.x, b = s.height / a.y;
  if (r) {
    const I = B(r), y = n && j(n) ? B(n) : n;
    let u = I, d = gi(u);
    for (; d && n && y !== u; ) {
      const c = kt(d), h = d.getBoundingClientRect(), p = W(d), v = h.left + (d.clientLeft + parseFloat(p.paddingLeft)) * c.x, w = h.top + (d.clientTop + parseFloat(p.paddingTop)) * c.y;
      l *= c.x, f *= c.y, m *= c.x, b *= c.y, l += v, f += w, u = B(d), d = gi(u);
    }
  }
  return $e({
    width: m,
    height: b,
    x: l,
    y: f
  });
}
function Ve(e, t) {
  const i = ze(e).scrollLeft;
  return t ? t.left + i : _t(Q(e)).left + i;
}
function wr(e, t) {
  const i = e.getBoundingClientRect(), n = i.left + t.scrollLeft - Ve(e, i), s = i.top + t.scrollTop;
  return {
    x: n,
    y: s
  };
}
function Uc(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: s
  } = e;
  const r = s === "fixed", a = Q(n), o = t ? Fe(t.floating) : !1;
  if (n === a || o && r)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, f = X(1);
  const m = X(0), b = Z(n);
  if ((b || !b && !r) && ((Ut(n) !== "body" || oe(a)) && (l = ze(n)), Z(n))) {
    const y = _t(n);
    f = kt(n), m.x = y.x + n.clientLeft, m.y = y.y + n.clientTop;
  }
  const I = a && !b && !r ? wr(a, l) : X(0);
  return {
    width: i.width * f.x,
    height: i.height * f.y,
    x: i.x * f.x - l.scrollLeft * f.x + m.x + I.x,
    y: i.y * f.y - l.scrollTop * f.y + m.y + I.y
  };
}
function Bc(e) {
  return Array.from(e.getClientRects());
}
function Hc(e) {
  const t = Q(e), i = ze(e), n = e.ownerDocument.body, s = yt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), r = yt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -i.scrollLeft + Ve(e);
  const o = -i.scrollTop;
  return W(n).direction === "rtl" && (a += yt(t.clientWidth, n.clientWidth) - s), {
    width: s,
    height: r,
    x: a,
    y: o
  };
}
const Sn = 25;
function qc(e, t) {
  const i = B(e), n = Q(e), s = i.visualViewport;
  let r = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (s) {
    r = s.width, a = s.height;
    const m = Hi();
    (!m || m && t === "fixed") && (o = s.offsetLeft, l = s.offsetTop);
  }
  const f = Ve(n);
  if (f <= 0) {
    const m = n.ownerDocument, b = m.body, I = getComputedStyle(b), y = m.compatMode === "CSS1Compat" && parseFloat(I.marginLeft) + parseFloat(I.marginRight) || 0, u = Math.abs(n.clientWidth - b.clientWidth - y);
    u <= Sn && (r -= u);
  } else f <= Sn && (r += f);
  return {
    width: r,
    height: a,
    x: o,
    y: l
  };
}
const jc = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Wc(e, t) {
  const i = _t(e, !0, t === "fixed"), n = i.top + e.clientTop, s = i.left + e.clientLeft, r = Z(e) ? kt(e) : X(1), a = e.clientWidth * r.x, o = e.clientHeight * r.y, l = s * r.x, f = n * r.y;
  return {
    width: a,
    height: o,
    x: l,
    y: f
  };
}
function Cn(e, t, i) {
  let n;
  if (t === "viewport")
    n = qc(e, i);
  else if (t === "document")
    n = Hc(Q(e));
  else if (j(t))
    n = Wc(t, i);
  else {
    const s = br(e);
    n = {
      x: t.x - s.x,
      y: t.y - s.y,
      width: t.width,
      height: t.height
    };
  }
  return $e(n);
}
function xr(e, t) {
  const i = ct(e);
  return i === t || !j(i) || Pt(i) ? !1 : W(i).position === "fixed" || xr(i, t);
}
function Yc(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = ne(e, [], !1).filter((o) => j(o) && Ut(o) !== "body"), s = null;
  const r = W(e).position === "fixed";
  let a = r ? ct(e) : e;
  for (; j(a) && !Pt(a); ) {
    const o = W(a), l = Bi(a);
    !l && o.position === "fixed" && (s = null), (r ? !l && !s : !l && o.position === "static" && !!s && jc.has(s.position) || oe(a) && !l && xr(e, a)) ? n = n.filter((m) => m !== a) : s = o, a = ct(a);
  }
  return t.set(e, n), n;
}
function Kc(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: s
  } = e;
  const a = [...i === "clippingAncestors" ? Fe(t) ? [] : Yc(t, this._c) : [].concat(i), n], o = a[0], l = a.reduce((f, m) => {
    const b = Cn(t, m, s);
    return f.top = yt(b.top, f.top), f.right = Lt(b.right, f.right), f.bottom = Lt(b.bottom, f.bottom), f.left = yt(b.left, f.left), f;
  }, Cn(t, o, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Jc(e) {
  const {
    width: t,
    height: i
  } = yr(e);
  return {
    width: t,
    height: i
  };
}
function Gc(e, t, i) {
  const n = Z(t), s = Q(t), r = i === "fixed", a = _t(e, !0, r, t);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = X(0);
  function f() {
    l.x = Ve(s);
  }
  if (n || !n && !r)
    if ((Ut(t) !== "body" || oe(s)) && (o = ze(t)), n) {
      const y = _t(t, !0, r, t);
      l.x = y.x + t.clientLeft, l.y = y.y + t.clientTop;
    } else s && f();
  r && !n && s && f();
  const m = s && !n && !r ? wr(s, o) : X(0), b = a.left + o.scrollLeft - l.x - m.x, I = a.top + o.scrollTop - l.y - m.y;
  return {
    x: b,
    y: I,
    width: a.width,
    height: a.height
  };
}
function Ye(e) {
  return W(e).position === "static";
}
function An(e, t) {
  if (!Z(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return Q(e) === i && (i = i.ownerDocument.body), i;
}
function Ir(e, t) {
  const i = B(e);
  if (Fe(e))
    return i;
  if (!Z(e)) {
    let s = ct(e);
    for (; s && !Pt(s); ) {
      if (j(s) && !Ye(s))
        return s;
      s = ct(s);
    }
    return i;
  }
  let n = An(e, t);
  for (; n && Dc(n) && Ye(n); )
    n = An(n, t);
  return n && Pt(n) && Ye(n) && !Bi(n) ? i : n || Rc(e) || i;
}
const Xc = async function(e) {
  const t = this.getOffsetParent || Ir, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: Gc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function Zc(e) {
  return W(e).direction === "rtl";
}
const Qc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Uc,
  getDocumentElement: Q,
  getClippingRect: Kc,
  getOffsetParent: Ir,
  getElementRects: Xc,
  getClientRects: Bc,
  getDimensions: Jc,
  getScale: kt,
  isElement: j,
  isRTL: Zc
};
function Er(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function tu(e, t) {
  let i = null, n;
  const s = Q(e);
  function r() {
    var o;
    clearTimeout(n), (o = i) == null || o.disconnect(), i = null;
  }
  function a(o, l) {
    o === void 0 && (o = !1), l === void 0 && (l = 1), r();
    const f = e.getBoundingClientRect(), {
      left: m,
      top: b,
      width: I,
      height: y
    } = f;
    if (o || t(), !I || !y)
      return;
    const u = ge(b), d = ge(s.clientWidth - (m + I)), c = ge(s.clientHeight - (b + y)), h = ge(m), v = {
      rootMargin: -u + "px " + -d + "px " + -c + "px " + -h + "px",
      threshold: yt(0, Lt(1, l)) || 1
    };
    let w = !0;
    function E(g) {
      const x = g[0].intersectionRatio;
      if (x !== l) {
        if (!w)
          return a();
        x ? a(!1, x) : n = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !Er(f, e.getBoundingClientRect()) && a(), w = !1;
    }
    try {
      i = new IntersectionObserver(E, {
        ...v,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      i = new IntersectionObserver(E, v);
    }
    i.observe(e);
  }
  return a(!0), r;
}
function _r(e, t, i, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: r = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, f = qi(e), m = s || r ? [...f ? ne(f) : [], ...ne(t)] : [];
  m.forEach((h) => {
    s && h.addEventListener("scroll", i, {
      passive: !0
    }), r && h.addEventListener("resize", i);
  });
  const b = f && o ? tu(f, i) : null;
  let I = -1, y = null;
  a && (y = new ResizeObserver((h) => {
    let [p] = h;
    p && p.target === f && y && (y.unobserve(t), cancelAnimationFrame(I), I = requestAnimationFrame(() => {
      var v;
      (v = y) == null || v.observe(t);
    })), i();
  }), f && !l && y.observe(f), y.observe(t));
  let u, d = l ? _t(e) : null;
  l && c();
  function c() {
    const h = _t(e);
    d && !Er(d, h) && i(), d = h, u = requestAnimationFrame(c);
  }
  return i(), () => {
    var h;
    m.forEach((p) => {
      s && p.removeEventListener("scroll", i), r && p.removeEventListener("resize", i);
    }), b?.(), (h = y) == null || h.disconnect(), y = null, l && cancelAnimationFrame(u);
  };
}
const Tt = Ac, St = $c, Ct = Tc, eu = _c, At = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), s = {
    platform: Qc,
    ...i
  }, r = {
    ...s.platform,
    _c: n
  };
  return Ec(e, t, {
    ...s,
    platform: r
  });
};
function iu(e) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), At(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [Tt(this.pixelOffset), Ct(), St({ padding: 8 })]
      }).then(({ x: t, y: i }) => {
        Object.assign(this.contentEl.style, { left: `${t}px`, top: `${i}px` });
      }));
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      if (this.open) {
        this.open = !1;
        let t = this;
        this.$nextTick(() => t.triggerEl?.focus());
      } else
        this.open = !0, this.focusedIndex = -1;
    },
    /**
     * Executes the `handleOutsideClick` operation.
     * @returns {any} Returns the result of `handleOutsideClick` when applicable.
     */
    handleOutsideClick() {
      if (!this.open) return;
      this.open = !1;
      let t = this;
      this.$nextTick(() => t.triggerEl?.focus());
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(t) {
      ["Enter", " ", "ArrowDown", "ArrowUp"].includes(t.key) && (t.preventDefault(), this.open = !0, this.$nextTick(() => {
        t.key === "ArrowUp" ? this.focusLastItem() : this.focusFirstItem();
      }));
    },
    /**
     * Executes the `focusNextItem` operation.
     * @returns {any} Returns the result of `focusNextItem` when applicable.
     */
    focusNextItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    /**
     * Executes the `focusPreviousItem` operation.
     * @returns {any} Returns the result of `focusPreviousItem` when applicable.
     */
    focusPreviousItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
    },
    /**
     * Executes the `focusFirstItem` operation.
     * @returns {any} Returns the result of `focusFirstItem` when applicable.
     */
    focusFirstItem() {
      this.menuItems.length && (this.focusedIndex = 0, this.focusCurrentItem());
    },
    /**
     * Executes the `focusLastItem` operation.
     * @returns {any} Returns the result of `focusLastItem` when applicable.
     */
    focusLastItem() {
      this.menuItems.length && (this.focusedIndex = this.menuItems.length - 1, this.focusCurrentItem());
    },
    /**
     * Executes the `focusCurrentItem` operation.
     * @returns {any} Returns the result of `focusCurrentItem` when applicable.
     */
    focusCurrentItem() {
      this.focusedIndex !== null && this.menuItems[this.focusedIndex] && this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
    },
    /**
     * Executes the `focusSelectedItem` operation.
     * @param {any} item Input value for this method.
     * @returns {any} Returns the result of `focusSelectedItem` when applicable.
     */
    focusSelectedItem(t) {
      if (!t || t.getAttribute("aria-disabled") === "true" || t.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(t);
      i !== -1 && (this.focusedIndex = i, t.focus());
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
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
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(t) {
      const i = t.currentTarget;
      this.focusSelectedItem(i), i.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
    handleWindowEscape() {
      if (this.open) {
        this.open = !1;
        let t = this;
        this.$nextTick(() => t.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleContentTabKey` operation.
     * @returns {any} Returns the result of `handleContentTabKey` when applicable.
     */
    handleContentTabKey() {
      if (this.open) {
        this.open = !1;
        let t = this;
        this.$nextTick(() => t.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleTriggerMouseover` operation.
     * @returns {any} Returns the result of `handleTriggerMouseover` when applicable.
     */
    handleTriggerMouseover() {
      let t = this;
      this.$nextTick(() => t.$el.firstElementChild?.focus());
    },
    /**
     * Executes the `closeAllSubmenus` operation.
     * @returns {any} Returns the result of `closeAllSubmenus` when applicable.
     */
    closeAllSubmenus() {
      document.querySelectorAll(
        `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.selfId}"]`
      ).forEach((i) => e.$data(i)?.closeSubmenu?.()), this.isSubmenuActive = !1;
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
          const n = document.querySelectorAll(
            `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.parentDropdown.selfId}"]`
          );
          Array.from(n).some((r) => e.$data(r)?.open) || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || At(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [Tt(this.pixelOffset), Ct(), St({ padding: 8 })]
      }).then(({ x: i, y: n }) => {
        Object.assign(t.style, { left: `${i}px`, top: `${n}px` });
      });
    },
    /**
     * Executes the `handleTriggerMouseEnter` operation.
     * @returns {any} Returns the result of `handleTriggerMouseEnter` when applicable.
     */
    handleTriggerMouseEnter() {
      clearTimeout(this.closeTimeout), this.triggerEl.focus(), this.openSubmenu();
    },
    /**
     * Executes the `handleTriggerMouseLeave` operation.
     * @returns {any} Returns the result of `handleTriggerMouseLeave` when applicable.
     */
    handleTriggerMouseLeave() {
      this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
    },
    /**
     * Executes the `handleContentMouseEnter` operation.
     * @returns {any} Returns the result of `handleContentMouseEnter` when applicable.
     */
    handleContentMouseEnter() {
      clearTimeout(this.closeTimeout);
    },
    /**
     * Executes the `handleContentMouseLeave` operation.
     * @returns {any} Returns the result of `handleContentMouseLeave` when applicable.
     */
    handleContentMouseLeave() {
      const t = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      t && Array.from(t).some((n) => e.$data(n)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    /**
     * Executes the `openSubmenu` operation.
     * @param {any} focusFirst Input value for this method.
     * @returns {any} Returns the result of `openSubmenu` when applicable.
     */
    openSubmenu(t = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, t && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    /**
     * Executes the `closeSubmenu` operation.
     * @returns {any} Returns the result of `closeSubmenu` when applicable.
     */
    closeSubmenu() {
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((i) => {
        e.$data(i)?.closeSubmenu();
      }), this.open = !1;
    },
    /**
     * Executes the `closeSiblingSubmenus` operation.
     * @returns {any} Returns the result of `closeSiblingSubmenus` when applicable.
     */
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (i) => i.hasAttribute("x-data") && i.getAttribute("x-data").startsWith("rzDropdownSubmenu") && i.id !== this.selfId
      ).forEach((i) => {
        e.$data(i)?.closeSubmenu();
      });
    },
    /**
     * Executes the `toggleSubmenu` operation.
     * @returns {any} Returns the result of `toggleSubmenu` when applicable.
     */
    toggleSubmenu() {
      this.open ? this.closeSubmenu() : this.openSubmenu();
    },
    /**
     * Executes the `openSubmenuAndFocusFirst` operation.
     * @returns {any} Returns the result of `openSubmenuAndFocusFirst` when applicable.
     */
    openSubmenuAndFocusFirst() {
      this.openSubmenu(!0);
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(t) {
      ["ArrowRight", "Enter", " "].includes(t.key) && (t.preventDefault(), this.openSubmenuAndFocusFirst());
    },
    /**
     * Executes the `focusNextItem` operation.
     * @returns {any} Returns the result of `focusNextItem` when applicable.
     */
    focusNextItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    /**
     * Executes the `focusPreviousItem` operation.
     * @returns {any} Returns the result of `focusPreviousItem` when applicable.
     */
    focusPreviousItem() {
      const t = Date.now();
      t - this._lastNavAt < this.navThrottle || (this._lastNavAt = t, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
    },
    /**
     * Executes the `focusFirstItem` operation.
     * @returns {any} Returns the result of `focusFirstItem` when applicable.
     */
    focusFirstItem() {
      this.menuItems.length && (this.focusedIndex = 0, this.focusCurrentItem());
    },
    /**
     * Executes the `focusLastItem` operation.
     * @returns {any} Returns the result of `focusLastItem` when applicable.
     */
    focusLastItem() {
      this.menuItems.length && (this.focusedIndex = this.menuItems.length - 1, this.focusCurrentItem());
    },
    /**
     * Executes the `focusCurrentItem` operation.
     * @returns {any} Returns the result of `focusCurrentItem` when applicable.
     */
    focusCurrentItem() {
      this.focusedIndex !== null && this.menuItems[this.focusedIndex] && this.menuItems[this.focusedIndex].focus();
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
    handleItemClick(t) {
      const i = t.currentTarget;
      if (!(i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled"))) {
        if (i.getAttribute("aria-haspopup") === "menu") {
          e.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        clearTimeout(this.closeTimeout), this.closeSubmenu(), this.parentDropdown.open = !1, this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(t) {
      const i = t.currentTarget;
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      const n = this.menuItems.indexOf(i);
      n !== -1 && (this.focusedIndex = n, i.focus()), i.getAttribute("aria-haspopup") === "menu" ? e.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
    },
    /**
     * Executes the `handleSubmenuEscape` operation.
     * @returns {any} Returns the result of `handleSubmenuEscape` when applicable.
     */
    handleSubmenuEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    /**
     * Executes the `handleSubmenuArrowLeft` operation.
     * @returns {any} Returns the result of `handleSubmenuArrowLeft` when applicable.
     */
    handleSubmenuArrowLeft() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function nu(e) {
  e.data("rzDarkModeToggle", () => ({
    // Proxy all properties to the reactive store
    get mode() {
      return this.$store.theme.mode;
    },
    get prefersDark() {
      return this.$store.theme.prefersDark;
    },
    get effectiveDark() {
      return this.$store.theme.effectiveDark;
    },
    // Proxy properties from the store (isDark/isLight are getters on the store)
    get isDark() {
      return this.$store.theme.isDark;
    },
    get isLight() {
      return this.$store.theme.isLight;
    },
    // Proxy methods
    setLight() {
      this.$store.theme.setLight();
    },
    setDark() {
      this.$store.theme.setDark();
    },
    setAuto() {
      this.$store.theme.setAuto();
    },
    toggle() {
      this.$store.theme.toggle();
    }
  }));
}
function su(e) {
  e.data("rzEmbeddedPreview", () => ({
    iframe: null,
    onDarkModeToggle: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
const $n = 160;
function ru(e) {
  e.data("rzEventViewer", () => ({
    eventNames: [],
    entries: [],
    error: null,
    paused: !1,
    copied: !1,
    copyTitle: "Copy",
    copiedTitle: "Copied!",
    listeningStatusText: "Listening",
    pausedStatusText: "Paused",
    expandText: "Expand event details",
    collapseText: "Collapse event details",
    target: "window",
    targetEl: null,
    maxEntries: 200,
    autoScroll: !0,
    pretty: !0,
    showTimestamp: !0,
    showEventMeta: !1,
    level: "info",
    filterPath: "",
    stickToBottom: !0,
    expandedEntryId: null,
    _handlers: /* @__PURE__ */ new Map(),
    _boundEvents: /* @__PURE__ */ new Set(),
    _entryId: 0,
    hasError() {
      return this.error !== null;
    },
    isPaused() {
      return this.paused;
    },
    notPaused() {
      return !this.paused;
    },
    notCopied() {
      return !this.copied;
    },
    entryCount() {
      return this.entries.length;
    },
    getStatusText() {
      return this.paused ? this.pausedStatusText : this.listeningStatusText;
    },
    init() {
      if (this.target = this.$el.dataset.target || "window", this.maxEntries = Number.parseInt(this.$el.dataset.maxEntries || "200", 10), this.autoScroll = this.parseBoolean(this.$el.dataset.autoScroll, !0), this.pretty = this.parseBoolean(this.$el.dataset.pretty, !0), this.showTimestamp = this.parseBoolean(this.$el.dataset.showTimestamp, !0), this.showEventMeta = this.parseBoolean(this.$el.dataset.showEventMeta, !1), this.level = this.$el.dataset.level || "info", this.filterPath = this.$el.dataset.filter || "", this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, this.listeningStatusText = this.$el.dataset.listeningText || this.listeningStatusText, this.pausedStatusText = this.$el.dataset.pausedText || this.pausedStatusText, this.expandText = this.$el.dataset.expandText || this.expandText, this.collapseText = this.$el.dataset.collapseText || this.collapseText, this.eventNames = this.resolveEventNames(), this.eventNames.length === 0) {
        this.error = "At least one event name is required.";
        return;
      }
      if (this.targetEl = this.resolveTargetElement(this.target), !this.targetEl) {
        this.error = `Unable to resolve target: ${this.target}`;
        return;
      }
      for (const t of this.eventNames) {
        const i = this.createHandler(t);
        this._handlers.set(t, i), this.targetEl.addEventListener(t, i), this._boundEvents.add(t);
      }
      this.appendSystemEntry(`Listening for: ${this.eventNames.join(", ")}`);
    },
    destroy() {
      if (this.targetEl)
        for (const [t, i] of this._handlers.entries())
          this.targetEl.removeEventListener(t, i);
      this._handlers.clear(), this._boundEvents.clear();
    },
    parseBoolean(t, i) {
      return typeof t != "string" || t.length === 0 ? i : t === "true";
    },
    resolveEventNames() {
      const t = [], i = this.$el.dataset.eventName || "", n = this.$el.dataset.eventNames || "";
      if (i.trim().length > 0 && t.push(i.trim()), n.trim().length > 0) {
        const a = n.trim();
        if (a.startsWith("["))
          try {
            const o = JSON.parse(a);
            if (Array.isArray(o))
              for (const l of o)
                typeof l == "string" ? t.push(l.trim()) : this.appendSystemEntry("Ignored non-string event name in JSON array.");
          } catch {
            this.appendSystemEntry("Failed to parse JSON event names; treating as CSV."), t.push(...a.split(",").map((o) => o.trim()));
          }
        else
          t.push(...a.split(",").map((o) => o.trim()));
      }
      const s = [], r = /* @__PURE__ */ new Set();
      for (const a of t)
        !a || r.has(a) || (r.add(a), s.push(a));
      return s;
    },
    resolveTargetElement(t) {
      return t === "window" ? window : t === "document" ? document : document.querySelector(t);
    },
    createHandler(t) {
      return (i) => {
        if (this.paused)
          return;
        const n = i?.type || t, s = i instanceof CustomEvent ? i.detail : i?.detail, r = this.applyFilter(s, this.filterPath);
        this.entries.push(this.buildEntry(n, r)), this.enforceMaxEntries(), this.scrollToBottom();
      };
    },
    buildEntry(t, i) {
      const n = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "", s = this.stringifyDetail(i, this.pretty), r = this.buildBodyPreview(i), a = this.appendMetaSuffix(s), o = this.appendMetaSuffix(r);
      return {
        id: `${t}-${this._entryId++}`,
        type: t,
        level: this.level,
        hasTimestamp: this.showTimestamp,
        timestamp: n,
        bodyRaw: a,
        bodyPreview: o,
        body: a,
        expanded: !1,
        toggleLabel: this.expandText,
        toggleClass: ""
      };
    },
    buildBodyPreview(t) {
      if (t === void 0)
        return "undefined";
      if (t === null)
        return "null";
      if (typeof t == "string")
        return this.truncatePreview(this.toSingleLine(t.trim()));
      const i = this.stringifyDetail(t, !1);
      return this.truncatePreview(this.toSingleLine(i));
    },
    appendMetaSuffix(t) {
      return this.showEventMeta ? `${t} [level:${this.level}]` : t;
    },
    toSingleLine(t) {
      return t.replace(/\s+/g, " ").trim();
    },
    truncatePreview(t) {
      return t.length <= $n ? t : `${t.slice(0, $n - 1)}…`;
    },
    enforceMaxEntries() {
      this.entries.length > this.maxEntries && this.entries.splice(0, this.entries.length - this.maxEntries), this.expandedEntryId && !this.entries.some((t) => t.id === this.expandedEntryId) && (this.expandedEntryId = null);
    },
    handleConsoleScroll() {
      if (!this.$refs.console)
        return;
      const t = this.$refs.console.scrollHeight - (this.$refs.console.scrollTop + this.$refs.console.clientHeight);
      this.stickToBottom = t < 12;
    },
    scrollToBottom() {
      !this.autoScroll || !this.stickToBottom || this.$nextTick(() => {
        this.$refs.console && (this.$refs.console.scrollTop = this.$refs.console.scrollHeight);
      });
    },
    toggleEntryExpansion(t) {
      const i = t?.currentTarget?.dataset?.entryId || t?.target?.dataset?.entryId;
      if (!i)
        return;
      const n = this.expandedEntryId === i ? null : i;
      this.expandedEntryId = n;
      for (const s of this.entries) {
        const r = s.id === this.expandedEntryId;
        s.expanded = r, s.toggleClass = r ? "rotate-90" : "", s.toggleLabel = r ? this.collapseText : this.expandText;
      }
    },
    stringifyDetail(t, i) {
      if (t === void 0) return "undefined";
      if (t === null) return "null";
      if (typeof t == "string") return t;
      if (typeof t == "number" || typeof t == "boolean") return String(t);
      const n = /* @__PURE__ */ new WeakSet(), s = (a) => !a || typeof a != "object" ? !1 : typeof Node < "u" && a instanceof Node || typeof Window < "u" && a instanceof Window ? !0 : typeof a.nodeType == "number" && typeof a.nodeName == "string", r = (a, o) => {
        if (o === void 0) return "undefined";
        if (typeof o == "function") return "function (hidden)";
        if (typeof o == "bigint") return `${o}n`;
        if (typeof o == "symbol") return "symbol (hidden)";
        if (s(o)) return "element (hidden)";
        if (o && typeof o == "object") {
          if (n.has(o))
            return "[circular]";
          n.add(o);
        }
        return o;
      };
      try {
        return i ? JSON.stringify(t, r, 2) : JSON.stringify(t, r);
      } catch {
        return "[unserializable detail]";
      }
    },
    applyFilter(t, i) {
      if (!i || i.trim().length === 0)
        return t;
      const n = i.split(".").map((r) => r.trim()).filter(Boolean);
      let s = t;
      for (const r of n) {
        if (s == null || typeof s != "object" || !(r in s))
          return;
        s = s[r];
      }
      return s;
    },
    appendSystemEntry(t) {
      const i = this.truncatePreview(this.toSingleLine(t));
      this.entries.push({
        id: `system-${this._entryId++}`,
        type: "system",
        level: "info",
        hasTimestamp: !1,
        timestamp: "",
        bodyRaw: t,
        bodyPreview: i,
        body: t,
        expanded: !1,
        toggleLabel: this.expandText,
        toggleClass: ""
      }), this.enforceMaxEntries(), this.scrollToBottom();
    },
    clearEntries() {
      this.entries = [], this.expandedEntryId = null, this.stickToBottom = !0;
    },
    togglePaused() {
      this.paused = !this.paused;
    },
    disableCopied() {
      this.copied = !1;
    },
    getCopiedTitle() {
      return this.copied ? this.copiedTitle : this.copyTitle;
    },
    getCopiedCss() {
      return [this.copied ? "focus-visible:outline-success" : "focus-visible:outline-foreground"];
    },
    async copyEntries() {
      const t = this.entries.map((i) => `${i.hasTimestamp ? `${i.timestamp} ` : ""}${i.type} ${i.bodyRaw}`).join(`
`);
      if (navigator.clipboard && typeof navigator.clipboard.writeText == "function")
        try {
          await navigator.clipboard.writeText(t), this.copied = !0;
        } catch {
          this.copied = !1;
        }
    }
  }));
}
function au(e) {
  e.data("rzFileInput", () => ({
    files: [],
    hasFiles: !1,
    isDragging: !1,
    draggingState: "false",
    init() {
      this.syncFromInput();
    },
    trigger() {
      this.$refs.input && this.$refs.input.click();
    },
    handleFileChange() {
      this.syncFromInput();
    },
    handleDragOver() {
      this.isDragging = !0, this.draggingState = "true";
    },
    handleDragLeave() {
      this.isDragging = !1, this.draggingState = "false";
    },
    handleDrop(t) {
      this.handleDragLeave();
      const i = this.$refs.input, n = t?.dataTransfer?.files;
      !i || !n || n.length === 0 || (this.applyDroppedFiles(i, n), this.syncFromInput());
    },
    removeFileByIndex(t) {
      const i = this.$refs.input;
      if (!i?.files)
        return;
      const n = t?.currentTarget?.dataset?.index, s = Number.parseInt(n ?? "-1", 10);
      if (Number.isNaN(s) || s < 0)
        return;
      const r = new DataTransfer();
      Array.from(i.files).forEach((a, o) => {
        o !== s && r.items.add(a);
      }), i.files = r.files, this.syncFromInput();
    },
    applyDroppedFiles(t, i) {
      const n = new DataTransfer();
      t.multiple && t.files ? (Array.from(t.files).forEach((r) => n.items.add(r)), Array.from(i).forEach((r) => n.items.add(r))) : i.length > 0 && n.items.add(i[0]), t.files = n.files;
    },
    syncFromInput() {
      const t = this.$refs.input;
      if (this.revokePreviews(), !t?.files) {
        this.files = [], this.hasFiles = !1;
        return;
      }
      this.files = Array.from(t.files).map((i) => {
        const n = i.type.startsWith("image/"), s = n ? URL.createObjectURL(i) : null;
        return {
          name: i.name,
          size: i.size,
          formattedSize: this.formatFileSize(i.size),
          isImage: n,
          previewUrl: s
        };
      }), this.hasFiles = this.files.length > 0;
    },
    formatFileSize(t) {
      if (!Number.isFinite(t) || t <= 0)
        return "0 B";
      const i = ["B", "KB", "MB", "GB", "TB"], n = Math.min(Math.floor(Math.log(t) / Math.log(1024)), i.length - 1), s = t / 1024 ** n;
      return `${s >= 10 || n === 0 ? Math.round(s) : s.toFixed(1)} ${i[n]}`;
    },
    revokePreviews() {
      this.files.forEach((t) => {
        t.previewUrl && URL.revokeObjectURL(t.previewUrl);
      });
    },
    destroy() {
      this.revokePreviews();
    }
  }));
}
function ou(e) {
  e.data("rzEmpty", () => {
  });
}
function lu(e) {
  e.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const t = this;
      if (typeof this.setCurrentHeading == "function") {
        const i = (s, r) => {
          s.forEach((a) => {
            a.isIntersecting && t.setCurrentHeading(t.headingId);
          });
        }, n = { threshold: 0.5 };
        this.observer = new IntersectionObserver(i, n), this.observer.observe(this.$el);
      } else
        console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function cu(e) {
  e.data("rzIndicator", () => ({
    visible: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const t = this.$el.dataset.color;
      t ? this.$el.style.backgroundColor = t : this.$el.style.backgroundColor = "var(--color-success)", this.$el.dataset.visible === "true" && (this.visible = !0);
    },
    /**
     * Executes the `notVisible` operation.
     * @returns {any} Returns the result of `notVisible` when applicable.
     */
    notVisible() {
      return !this.visible;
    },
    /**
     * Executes the `setVisible` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `setVisible` when applicable.
     */
    setVisible(t) {
      this.visible = t;
    }
  }));
}
function uu(e) {
  e.data("rzInputGroupAddon", () => ({
    /**
     * Executes the `handleClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleClick` when applicable.
     */
    handleClick(t) {
      if (t.target.closest("button"))
        return;
      const i = this.$el.parentElement;
      i && i.querySelector("input, textarea")?.focus();
    }
  }));
}
function du(e) {
  e.data("rzInputOTP", () => ({
    value: "",
    length: 0,
    activeIndex: 0,
    isFocused: !1,
    isInvalid: !1,
    otpType: "numeric",
    textTransform: "none",
    slots: [],
    slotElements: [],
    selectedIndexes: [],
    /**
     * Initializes OTP behavior and hydrates visual slots.
     */
    init() {
      if (this.$el.dataset.rzOtpInitialized === "true") {
        this.syncFromInput();
        return;
      }
      this.$el.dataset.rzOtpInitialized = "true", this.slotElements = [], this.selectedIndexes = [], this.length = Number(this.$el.dataset.length || "0"), this.otpType = this.$el.dataset.otpType || "numeric", this.textTransform = this.$el.dataset.textTransform || "none", this.isInvalid = this.$el.dataset.invalid === "true", this.syncFromInput();
    },
    /**
     * Returns the current OTP value.
     * @returns {string}
     */
    getValue() {
      return this.value;
    },
    /**
     * Sets the current OTP value.
     * @param {string} newValue
     */
    setValue(t) {
      const i = this.sanitizeValue(t || ""), n = this.value;
      this.clearSelection(), this.value = i, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(n), this.dispatchChangeEvent(n);
    },
    /**
     * Handles input typing updates.
     * @param {InputEvent} event
     */
    onInput(t) {
      this.clearSelection(), this.syncFromInput(t?.target);
    },
    /**
     * Handles paste behavior for OTP values.
     * @param {ClipboardEvent} event
     */
    onPaste(t) {
      t.preventDefault();
      const i = t.clipboardData ? t.clipboardData.getData("text") : "", n = this.sanitizeValue(i), s = this.value;
      this.clearSelection(), this.value = n, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(s), this.dispatchChangeEvent(s);
    },
    /**
     * Handles keyboard navigation and deletion.
     * @param {KeyboardEvent} event
     */
    onKeyDown(t) {
      if (this.hasSelection() && (t.key === "Backspace" || t.key === "Delete")) {
        t.preventDefault(), this.clearAllSlots();
        return;
      }
      if (this.hasSelection() && this.selectedIndexes.length > 1 && this.isAcceptableInputChar(t.key)) {
        t.preventDefault(), this.replaceSelectionWithKey(t.key);
        return;
      }
      if (this.isAcceptableInputChar(t.key)) {
        t.preventDefault(), this.replaceActiveSlotWithKey(t.key);
        return;
      }
      if (t.key === "ArrowLeft") {
        t.preventDefault(), this.clearSelection(), this.moveLeft();
        return;
      }
      if (t.key === "ArrowRight") {
        t.preventDefault(), this.clearSelection(), this.moveRight();
        return;
      }
      if (t.key === "Home") {
        t.preventDefault(), this.clearSelection(), this.moveHome();
        return;
      }
      if (t.key === "End") {
        t.preventDefault(), this.clearSelection(), this.moveEnd();
        return;
      }
      t.key === "Backspace" && this.handleBackspace();
    },
    /**
     * Sets focus state to true.
     */
    onFocus() {
      this.isFocused = !0, this.setActiveFromCaret(), this.refreshSlots();
    },
    /**
     * Sets focus state to false.
     */
    onBlur() {
      this.isFocused = !1, this.clearSelection(), this.refreshSlots();
    },
    /**
     * Prevents slot mousedown default so input keeps control.
     * @param {MouseEvent} event
     */
    preventMouseDown(t) {
      t.preventDefault();
    },
    /**
     * Focuses the native input and updates active slot from clicked index.
     * @param {MouseEvent} event
     */
    focusSlot(t) {
      const i = t.currentTarget, n = Number(i.dataset.index || "0");
      this.canFocusIndex(n) && (this.clearSelection(), this.activeIndex = this.normalizeIndex(n), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots());
    },
    /**
     * Selects all currently filled slots from a double click gesture.
     */
    selectFilledSlots() {
      const t = this.slots.map((n, s) => ({ slot: n, index: s })).filter(({ slot: n }) => n.char !== "").map(({ index: n }) => n);
      if (t.length === 0) {
        this.clearSelection(), this.refreshSlots();
        return;
      }
      this.selectedIndexes = t, this.isFocused = !0, this.focusInput();
      const i = this.$refs.input;
      i && i.setSelectionRange(0, this.value.length), this.refreshSlots();
    },
    registerSlot() {
      !this.$el || this.$el.dataset.inputOtpSlot !== "true" || (this.slotElements.includes(this.$el) || (this.slotElements.push(this.$el), this.slotElements.sort((t, i) => Number(t.dataset.index || "0") - Number(i.dataset.index || "0"))), this.refreshSlots());
    },
    moveLeft() {
      this.activeIndex = this.normalizeIndex(this.activeIndex - 1), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    moveRight() {
      const t = this.normalizeIndex(this.activeIndex + 1);
      this.canFocusIndex(t) && (this.activeIndex = t, this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots());
    },
    moveHome() {
      this.activeIndex = 0, this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    moveEnd() {
      this.activeIndex = this.getMaxFocusableIndex(), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    handleBackspace() {
      const t = this.$refs.input;
      if (!t) return;
      const i = t.selectionStart || 0, n = t.selectionEnd || 0;
      i === n && (i <= 0 || (this.activeIndex = this.normalizeIndex(i - 1), this.refreshSlots()));
    },
    syncFromInput(t) {
      const i = t || this.$refs.input;
      if (!i) return;
      const n = this.value;
      this.value = this.sanitizeValue(i.value || ""), this.value !== i.value && (i.value = this.value), this.setActiveFromCaret(this.value.length), this.refreshSlots(), this.dispatchInputEvent(n), this.dispatchChangeEvent(n);
    },
    sanitizeValue(t) {
      if (!t) return "";
      const i = this.otpType === "alphanumeric" ? /[^a-zA-Z0-9]/g : /[^0-9]/g, n = t.replace(i, "").slice(0, this.length);
      return this.applyTextTransform(n);
    },
    applyTextTransform(t) {
      return t ? this.textTransform === "to-lower" ? t.toLowerCase() : this.textTransform === "to-upper" ? t.toUpperCase() : t : "";
    },
    applyValueToInput() {
      const t = this.$refs.input;
      t && (t.value = this.value, this.setCaretToActiveIndex());
    },
    setActiveFromCaret(t) {
      const i = this.$refs.input;
      if (!i) {
        this.activeIndex = this.getMaxFocusableIndex(t ?? 0);
        return;
      }
      const n = i.selectionStart, s = n == null ? Number.isFinite(t) ? Number(t) : 0 : Number(n), r = this.normalizeIndex(s);
      if (this.canFocusIndex(r)) {
        this.activeIndex = r;
        return;
      }
      this.activeIndex = this.getMaxFocusableIndex();
    },
    setCaretToActiveIndex() {
      const t = this.$refs.input;
      if (!t) return;
      const i = this.normalizeIndex(this.activeIndex);
      t.setSelectionRange(i, i);
    },
    focusInput() {
      const t = this.$refs.input;
      t && t.focus();
    },
    hasSelection() {
      return this.selectedIndexes.length > 0;
    },
    clearSelection() {
      this.selectedIndexes = [];
    },
    clearAllSlots() {
      const t = this.value;
      this.clearSelection(), this.value = "", this.activeIndex = 0, this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(t);
    },
    replaceSelectionWithKey(t) {
      const i = this.sanitizeValue(t).charAt(0);
      if (!i) return;
      const n = this.value;
      this.value = i, this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(n);
    },
    replaceActiveSlotWithKey(t) {
      const i = this.sanitizeValue(t).charAt(0);
      if (!i) return;
      const n = this.canFocusIndex(this.activeIndex) ? this.normalizeIndex(this.activeIndex) : this.getMaxFocusableIndex(), s = this.value.split("");
      for (; s.length < n; )
        s.push("");
      s[n] = i;
      const r = this.value;
      this.value = this.applyTextTransform(s.join("").slice(0, this.length)), this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(n + 1), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(r), this.dispatchChangeEvent(r);
    },
    isAcceptableInputChar(t) {
      return !t || t.length !== 1 ? !1 : this.otpType === "alphanumeric" ? /^[a-zA-Z0-9]$/.test(t) : /^[0-9]$/.test(t);
    },
    getNextFillIndex() {
      return this.length <= 0 ? 0 : Math.min(this.value.length, this.length - 1);
    },
    getMaxFocusableIndex(t) {
      const i = Number.isFinite(t) ? this.normalizeIndex(Number(t)) : this.getNextFillIndex();
      return this.canFocusIndex(i) ? i : this.getNextFillIndex();
    },
    canFocusIndex(t) {
      const i = this.normalizeIndex(t);
      return this.value.charAt(i) !== "" ? !0 : i === this.getNextFillIndex();
    },
    dispatchInputEvent(t) {
      this.value !== t && this.$dispatch("rz:inputotp:oninput", {
        value: this.value,
        previousValue: t,
        activeIndex: this.activeIndex,
        isComplete: this.value.length === this.length,
        length: this.length,
        otpType: this.otpType,
        textTransform: this.textTransform
      });
    },
    dispatchChangeEvent(t) {
      this.value !== t && this.value.length === this.length && this.$dispatch("rz:inputotp:onchange", {
        value: this.value,
        previousValue: t,
        activeIndex: this.activeIndex,
        length: this.length,
        otpType: this.otpType,
        textTransform: this.textTransform
      });
    },
    refreshSlots() {
      this.buildSlotsState(), this.updateSlotDom();
    },
    buildSlotsState() {
      const t = [];
      let i = 0;
      for (; i < this.length; ) {
        const n = this.value.charAt(i) || "", s = this.selectedIndexes.includes(i), r = this.isFocused && !this.hasSelection() && i === this.activeIndex, a = this.isFocused && !this.hasSelection() && r && n === "";
        t.push({ char: n, isActive: r, hasFakeCaret: a, isSelected: s }), i += 1;
      }
      this.slots = t;
    },
    updateSlotDom() {
      const t = this.$el?.closest("[data-alpine-root]") || this.$el;
      (this.slotElements.length > 0 ? this.slotElements : t.querySelectorAll('[data-input-otp-slot="true"]')).forEach((n) => {
        const s = Number(n.dataset.index || "0"), r = this.slots[s] || { char: "", isActive: !1, hasFakeCaret: !1, isSelected: !1 };
        n.dataset.active = r.isActive ? "true" : "false", n.dataset.focused = this.isFocused ? "true" : "false", n.dataset.selected = r.isSelected ? "true" : "false", n.dataset.focusable = this.canFocusIndex(s) ? "true" : "false", this.isInvalid ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid");
        const a = n.querySelector('[data-input-otp-char="true"]');
        a && (a.textContent = r.char);
        const o = n.querySelector('[data-input-otp-caret="true"]');
        o && (r.hasFakeCaret ? o.classList.remove("hidden") : o.classList.add("hidden"));
      });
    },
    normalizeIndex(t) {
      return this.length <= 0 || t < 0 ? 0 : t > this.length - 1 ? this.length - 1 : t;
    }
  }));
}
function hu(e, t) {
  e.data("rzMarkdown", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function fu(e) {
  e.data("rzMenubar", () => ({
    currentMenuValue: "",
    currentTrigger: null,
    openPath: [],
    closeTimer: null,
    closeDelayMs: 220,
    init() {
      this.onDocumentPointerDown = this.handleDocumentPointerDown.bind(this), this.onWindowBlur = this.handleWindowBlur.bind(this), this.onDocumentFocusIn = this.handleDocumentFocusIn.bind(this), document.addEventListener("pointerdown", this.onDocumentPointerDown, !0), document.addEventListener("focusin", this.onDocumentFocusIn, !0), window.addEventListener("blur", this.onWindowBlur), this.$watch("currentMenuValue", () => {
        this.$nextTick(() => this.syncSubmenus());
      });
    },
    destroy() {
      document.removeEventListener("pointerdown", this.onDocumentPointerDown, !0), document.removeEventListener("focusin", this.onDocumentFocusIn, !0), window.removeEventListener("blur", this.onWindowBlur);
    },
    isMenuOpen() {
      const t = this.$el.dataset.menuContent;
      return this.currentMenuValue !== "" && t === this.currentMenuValue;
    },
    isSubmenuOpen() {
      const t = this.$el.dataset.submenuOwner;
      return !!t && this.openPath.includes(t);
    },
    setTriggerState(t, i) {
      t && (t.dataset.state = i ? "open" : "closed", t.setAttribute("aria-expanded", i ? "true" : "false"));
    },
    commonPrefixLen(t, i) {
      let n = 0;
      for (; n < t.length && n < i.length && t[n] === i[n]; ) n++;
      return n;
    },
    setOpenPath(t) {
      const i = Array.isArray(t) ? t.filter(Boolean) : [], n = this.commonPrefixLen(this.openPath, i);
      (n !== this.openPath.length || n !== i.length) && (this.openPath = i, this.$nextTick(() => this.syncSubmenus()));
    },
    openMenu(t, i) {
      t && (this.cancelCloseAll(), this.currentTrigger && this.currentTrigger !== i && this.setTriggerState(this.currentTrigger, !1), this.currentMenuValue = t, this.currentTrigger = i, this.setTriggerState(i, !0), this.setOpenPath([]), this.$nextTick(() => {
        const n = this.$el.querySelector(`[data-menu-content="${t}"]`) ?? document.querySelector(`[data-menu-content="${t}"]`);
        !n || !i || At(i, n, {
          placement: "bottom-start",
          middleware: [Tt(4), Ct(), St({ padding: 8 })]
        }).then(({ x: s, y: r }) => {
          Object.assign(n.style, { left: `${s}px`, top: `${r}px` });
        });
      }));
    },
    closeMenus() {
      this.cancelCloseAll(), this.currentMenuValue = "", this.setTriggerState(this.currentTrigger, !1), this.currentTrigger = null, this.setOpenPath([]);
    },
    getMenuValueFromTrigger(t) {
      return t?.dataset?.menuValue ?? t?.closest("[data-menu-value]")?.dataset?.menuValue ?? "";
    },
    handleTriggerPointerDown(t) {
      if (t.button !== 0 || t.ctrlKey) return;
      const i = t.currentTarget, n = this.getMenuValueFromTrigger(i);
      this.currentMenuValue === n ? this.closeMenus() : this.openMenu(n, i), t.preventDefault();
    },
    handleTriggerPointerEnter(t) {
      if (!this.currentMenuValue) return;
      const i = t.currentTarget, n = this.getMenuValueFromTrigger(i);
      n && n !== this.currentMenuValue && this.openMenu(n, i);
    },
    handleTriggerKeydown(t) {
      const i = t.currentTarget, n = this.getMenuValueFromTrigger(i);
      if (["Enter", " ", "ArrowDown"].includes(t.key)) {
        this.openMenu(n, i), t.preventDefault();
        return;
      }
      if (["ArrowRight", "ArrowLeft"].includes(t.key)) {
        const s = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), r = s.indexOf(i);
        if (r < 0) return;
        const a = t.key === "ArrowRight" ? (r + 1) % s.length : (r - 1 + s.length) % s.length, o = s[a];
        if (!o) return;
        o.focus(), this.currentMenuValue && this.openMenu(this.getMenuValueFromTrigger(o), o), t.preventDefault();
      }
    },
    handleContentKeydown(t) {
      t.key === "Escape" && (this.closeMenus(), this.currentTrigger?.focus()), t.key === "Tab" && this.closeMenus();
    },
    handleItemMouseEnter(t) {
      const i = t.currentTarget;
      if (!i || i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true") return;
      i.dataset.highlighted = "", i.focus();
      const n = this.buildPathToSubTrigger(i);
      this.setOpenPath(n);
    },
    handleItemMouseLeave(t) {
      const i = t.currentTarget;
      i && (delete i.dataset.highlighted, document.activeElement === i && i.blur());
    },
    handleItemClick(t) {
      const i = t.currentTarget;
      i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true" || i.getAttribute("aria-haspopup") !== "menu" && (this.closeMenus(), this.currentTrigger?.focus());
    },
    toggleCheckboxItem(t) {
      const i = t.currentTarget, n = i.getAttribute("data-state") === "checked";
      i.setAttribute("data-state", n ? "unchecked" : "checked"), i.setAttribute("aria-checked", n ? "false" : "true");
    },
    selectRadioItem(t) {
      const i = t.currentTarget, n = i.getAttribute("data-radio-group");
      if (!n) return;
      (this.$el.closest(`[role="group"][data-radio-group="${n}"]`)?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${n}"]`) ?? []).forEach((a) => {
        a.setAttribute("data-state", "unchecked"), a.setAttribute("aria-checked", "false");
      }), i.setAttribute("data-state", "checked"), i.setAttribute("aria-checked", "true");
    },
    buildPathToSubTrigger(t) {
      const i = [];
      let n = t.closest('[data-slot="menubar-sub"]');
      for (; n; ) {
        const s = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!s?.id) break;
        i.unshift(s.id), n = n.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
      }
      return i;
    },
    handleSubTriggerPointerEnter(t) {
      if (!this.currentMenuValue) return;
      this.cancelCloseAll();
      const i = t.currentTarget, n = this.buildPathToSubTrigger(i);
      this.setOpenPath(n);
    },
    handleSubTriggerClick(t) {
      const i = t.currentTarget, n = this.buildPathToSubTrigger(i), s = this.openPath.length === n.length && this.openPath.every((r, a) => r === n[a]);
      this.setOpenPath(s ? n.slice(0, -1) : n);
    },
    handleSubTriggerKeyRight(t) {
      this.handleSubTriggerPointerEnter(t), this.$nextTick(() => {
        t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), s = n < 0 || n >= i.length - 1 ? 0 : n + 1;
      i[s]?.focus();
    },
    focusPreviousItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), s = n <= 0 ? i.length - 1 : n - 1;
      i[s]?.focus();
    },
    handleSubContentLeftKey(t) {
      const n = t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!n) return;
      const s = this.buildPathToSubTrigger(n);
      this.setOpenPath(s.slice(0, -1)), n.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((n) => {
        const s = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), r = n.querySelector(':scope > [data-slot="menubar-sub-content"]'), a = s?.id, o = !!a && this.openPath.includes(a);
        this.setTriggerState(s, o), r && (r.hidden = !o, r.style.display = o ? "" : "none", r.dataset.state = o ? "open" : "closed", o && s && At(s, r, {
          placement: "right-start",
          middleware: [Tt(4), Ct(), St({ padding: 8 })]
        }).then(({ x: l, y: f }) => {
          Object.assign(r.style, { left: `${l}px`, top: `${f}px` });
        }));
      });
    },
    scheduleCloseAll() {
      this.cancelCloseAll(), this.closeTimer = setTimeout(() => {
        this.closeMenus();
      }, this.closeDelayMs);
    },
    cancelCloseAll() {
      this.closeTimer && (clearTimeout(this.closeTimer), this.closeTimer = null);
    },
    handleDocumentPointerDown(t) {
      const i = t.target;
      if (i instanceof Node && this.$el.contains(i)) return;
      const n = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      i instanceof Node && n?.contains(i) || this.closeMenus();
    },
    handleDocumentFocusIn(t) {
      const i = t.target;
      !(i instanceof Node) || this.$el.contains(i) || (this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.contains(i) || this.closeMenus();
    },
    handleWindowBlur() {
      this.closeMenus();
    }
  }));
}
function pu(e, t) {
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
    /**
     * Executes the `handleTriggerEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerEnter` when applicable.
     */
    handleTriggerEnter(i) {
      const n = i.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose(), this.activeItemId !== n && !this.isClosing && requestAnimationFrame(() => this.openMenu(n));
    },
    /**
     * Executes the `handleItemEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleItemEnter` when applicable.
     */
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
    /**
     * Executes the `handleContentEnter` operation.
     * @returns {any} Returns the result of `handleContentEnter` when applicable.
     */
    handleContentEnter() {
      this.cancelClose();
    },
    /**
     * Executes the `scheduleClose` operation.
     * @returns {any} Returns the result of `scheduleClose` when applicable.
     */
    scheduleClose() {
      this.isClosing || this.closeTimeout || (this.closeTimeout = setTimeout(() => this.closeMenu(), 150));
    },
    /**
     * Executes the `cancelClose` operation.
     * @returns {any} Returns the result of `cancelClose` when applicable.
     */
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
        const f = this._contentEl(this.activeItemId);
        if (f) {
          const m = s === "end" ? "start" : "end";
          f.setAttribute("data-motion", `to-${m}`), setTimeout(() => {
            f.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = i, this.open = !0, this.prevIndex = n;
      const a = this.$refs[`trigger_${i}`], o = this._contentEl(i);
      !a || !o || (At(a, o, {
        placement: "bottom-start",
        middleware: [Tt(6), Ct(), St({ padding: 8 })]
      }).then(({ x: l, y: f }) => {
        Object.assign(o.style, { left: `${l}px`, top: `${f}px` });
      }), o.style.display = "block", r ? o.setAttribute("data-motion", "fade-in") : o.setAttribute("data-motion", `from-${s}`), this.$nextTick(() => {
        a.setAttribute("aria-expanded", "true"), a.dataset.state = "open";
      }));
    },
    /**
     * Executes the `closeMenu` operation.
     * @returns {any} Returns the result of `closeMenu` when applicable.
     */
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
function mu(e) {
  e.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    dataState: "closed",
    contentStyle: "",
    triggerEl: null,
    contentEl: null,
    _documentClickHandler: null,
    _windowKeydownHandler: null,
    _cleanupAutoUpdate: null,
    init() {
      this.triggerEl = this.resolveTriggerElement(), this.$watch("open", (t) => {
        if (this.ariaExpanded = t.toString(), this.dataState = t ? "open" : "closed", t) {
          this.openPopover();
          return;
        }
        this.closePopover();
      });
    },
    destroy() {
      this.teardownAutoUpdate(), this.detachGlobalListeners();
    },
    toggle() {
      this.open = !this.open;
    },
    async openPopover() {
      this.triggerEl = this.resolveTriggerElement(), this.attachGlobalListeners(), this.contentStyle = this.getInitialContentStyle(), await this.$nextTick(), this.contentEl = this.resolveContentElement(), !(!this.triggerEl || !this.contentEl) && (await this.updatePosition(), this.startAutoUpdate());
    },
    closePopover() {
      this.teardownAutoUpdate(), this.detachGlobalListeners(), this.contentStyle = "", this.contentEl = null;
    },
    resolveTriggerElement() {
      const t = Array.from(this.$el.children).find((i) => i?.hasAttribute?.("data-trigger"));
      return t || this.$el.querySelector("[data-trigger]");
    },
    resolveContentElement() {
      const t = this.$el.dataset.contentId;
      return t ? document.getElementById(t) : null;
    },
    attachGlobalListeners() {
      this._documentClickHandler || (this._documentClickHandler = (t) => this.handleDocumentClick(t), document.addEventListener("pointerdown", this._documentClickHandler)), this._windowKeydownHandler || (this._windowKeydownHandler = (t) => this.handleWindowKeydown(t), window.addEventListener("keydown", this._windowKeydownHandler));
    },
    detachGlobalListeners() {
      this._documentClickHandler && (document.removeEventListener("pointerdown", this._documentClickHandler), this._documentClickHandler = null), this._windowKeydownHandler && (window.removeEventListener("keydown", this._windowKeydownHandler), this._windowKeydownHandler = null);
    },
    startAutoUpdate() {
      this.teardownAutoUpdate(), !(!this.triggerEl || !this.contentEl) && (this._cleanupAutoUpdate = _r(this.triggerEl, this.contentEl, () => {
        this.updatePosition();
      }));
    },
    teardownAutoUpdate() {
      this._cleanupAutoUpdate && (this._cleanupAutoUpdate(), this._cleanupAutoUpdate = null);
    },
    parseNumber(t, i = null) {
      if (t == null || t === "")
        return i;
      const n = Number(t);
      return Number.isNaN(n) ? i : n;
    },
    getInitialContentStyle() {
      return `position: ${this.$el.dataset.strategy || "absolute"}; left: 0px; top: 0px; visibility: hidden;`;
    },
    async updatePosition() {
      if (!this.triggerEl || !this.contentEl || !this.open)
        return;
      const t = this.$el.dataset.anchor || "bottom", i = this.parseNumber(this.$el.dataset.offset, 0), n = this.parseNumber(this.$el.dataset.crossAxisOffset, 0), s = this.parseNumber(this.$el.dataset.alignmentAxisOffset, null), r = this.$el.dataset.strategy || "absolute", a = this.$el.dataset.enableFlip !== "false", o = this.$el.dataset.enableShift !== "false", l = this.parseNumber(this.$el.dataset.shiftPadding, 8), f = [
        Tt({
          mainAxis: i,
          crossAxis: n,
          alignmentAxis: s
        })
      ];
      a && f.push(Ct()), o && f.push(St({ padding: l }));
      const { x: m, y: b } = await At(this.triggerEl, this.contentEl, {
        placement: t,
        strategy: r,
        middleware: f
      });
      this.contentStyle = `position: ${r}; left: ${m}px; top: ${b}px; visibility: visible;`;
    },
    handleDocumentClick(t) {
      if (!this.open)
        return;
      const i = t.target, n = this.triggerEl?.contains?.(i) ?? !1, s = this.contentEl?.contains?.(i) ?? !1;
      n || s || (this.open = !1, this.$nextTick(() => this.restoreTriggerFocus()));
    },
    handleWindowKeydown(t) {
      t.key !== "Escape" || !this.open || (this.open = !1, this.$nextTick(() => this.restoreTriggerFocus()));
    },
    restoreTriggerFocus() {
      this.triggerEl?.isConnected && this.triggerEl.focus();
    }
  }));
}
function gu(e) {
  e.data("rzPrependInput", () => ({
    prependContainer: null,
    textInput: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.prependContainer = this.$refs.prependContainer, this.textInput = this.$refs.textInput;
      let t = this;
      setTimeout(() => {
        t.updatePadding();
      }, 50), window.addEventListener("resize", this.updatePadding);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      window.removeEventListener("resize", this.updatePadding);
    },
    /**
     * Executes the `updatePadding` operation.
     * @returns {any} Returns the result of `updatePadding` when applicable.
     */
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
function vu(e) {
  e.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const t = this.$el;
      this.currentVal = parseInt(t.getAttribute("data-current-val")) || 0, this.minVal = parseInt(t.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(t.getAttribute("data-max-val")) || 100, this.label = t.getAttribute("data-label"), this.calculatePercentage(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuemin", this.minVal), t.setAttribute("aria-valuemax", this.maxVal), t.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((n) => {
        this.updateProgressBar();
      }).observe(t), this.$watch("currentVal", () => {
        this.calculatePercentage(), this.updateProgressBar(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuetext", `${this.percentage}%`);
      });
    },
    /**
     * Executes the `calculatePercentage` operation.
     * @returns {any} Returns the result of `calculatePercentage` when applicable.
     */
    calculatePercentage() {
      this.maxVal === this.minVal ? this.percentage = 0 : this.percentage = Math.min(Math.max((this.currentVal - this.minVal) / (this.maxVal - this.minVal) * 100, 0), 100);
    },
    /**
     * Executes the `buildLabel` operation.
     * @returns {any} Returns the result of `buildLabel` when applicable.
     */
    buildLabel() {
      var t = this.label || "{percent}%";
      return this.calculatePercentage(), t.replace("{percent}", this.percentage);
    },
    /**
     * Executes the `buildInsideLabelPosition` operation.
     * @returns {any} Returns the result of `buildInsideLabelPosition` when applicable.
     */
    buildInsideLabelPosition() {
      const t = this.$refs.progressBar, i = this.$refs.progressBarLabel, n = this.$refs.innerLabel;
      i && t && n && (n.innerText = this.buildLabel(), i.clientWidth > t.clientWidth ? i.style.left = t.clientWidth + 10 + "px" : i.style.left = t.clientWidth / 2 - i.clientWidth / 2 + "px");
    },
    /**
     * Executes the `getLabelCss` operation.
     * @returns {any} Returns the result of `getLabelCss` when applicable.
     */
    getLabelCss() {
      const t = this.$refs.progressBarLabel, i = this.$refs.progressBar;
      return t && i && t.clientWidth > i.clientWidth ? "text-foreground dark:text-foreground" : "";
    },
    /**
     * Executes the `updateProgressBar` operation.
     * @returns {any} Returns the result of `updateProgressBar` when applicable.
     */
    updateProgressBar() {
      const t = this.$refs.progressBar;
      t && (t.style.width = `${this.percentage}%`, this.buildInsideLabelPosition());
    },
    // Methods to set, increment, or decrement the progress value
    setProgress(t) {
      this.currentVal = t;
    },
    /**
     * Executes the `increment` operation.
     * @param {any} val Input value for this method.
     * @returns {any} Returns the result of `increment` when applicable.
     */
    increment(t = 1) {
      this.currentVal = Math.min(this.currentVal + t, this.maxVal);
    },
    /**
     * Executes the `decrement` operation.
     * @param {any} val Input value for this method.
     * @returns {any} Returns the result of `decrement` when applicable.
     */
    decrement(t = 1) {
      this.currentVal = Math.max(this.currentVal - t, this.minVal);
    }
  }));
}
function yu(e) {
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
function bu(e) {
  e.data("rzScrollArea", () => ({
    hideTimer: null,
    type: "hover",
    orientation: "vertical",
    scrollHideDelay: 600,
    _roViewport: null,
    _roContent: null,
    _dragAxis: null,
    _dragPointerOffset: 0,
    _viewport: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.type = this.$el.dataset.type || "hover", this.orientation = this.$el.dataset.orientation || "vertical", this.scrollHideDelay = Number(this.$el.dataset.scrollHideDelay || 600);
      const t = this.$refs.viewport;
      if (!t) return;
      this._viewport = t, this.onScroll = this.onScroll.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), t.addEventListener("scroll", this.onScroll, { passive: !0 });
      const i = () => this.update();
      this._roViewport = new ResizeObserver(i), this._roContent = new ResizeObserver(i), this._roViewport.observe(t), this.$refs.content && this._roContent.observe(this.$refs.content), this.setState(this.type === "always" ? "visible" : "hidden"), this.update();
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this._viewport && this._viewport.removeEventListener("scroll", this.onScroll), window.removeEventListener("pointermove", this.onPointerMove), window.removeEventListener("pointerup", this.onPointerUp), this._roViewport?.disconnect(), this._roContent?.disconnect(), this.hideTimer && window.clearTimeout(this.hideTimer);
    },
    /**
     * Executes the `setState` operation.
     * @param {any} state Input value for this method.
     * @returns {any} Returns the result of `setState` when applicable.
     */
    setState(t) {
      this.$refs.scrollbarX && (this.$refs.scrollbarX.dataset.state = t), this.$refs.scrollbarY && (this.$refs.scrollbarY.dataset.state = t);
    },
    /**
     * Executes the `setBarMounted` operation.
     * @param {any} axis Input value for this method.
     * @param {any} mounted Input value for this method.
     * @returns {any} Returns the result of `setBarMounted` when applicable.
     */
    setBarMounted(t, i) {
      const n = this.$refs[`scrollbar${t === "vertical" ? "Y" : "X"}`];
      n && (n.hidden = !i);
    },
    /**
     * Executes the `update` operation.
     * @returns {any} Returns the result of `update` when applicable.
     */
    update() {
      const t = this.$refs.viewport;
      if (!t) return;
      this._viewport = t;
      const i = t.scrollWidth > t.clientWidth, n = t.scrollHeight > t.clientHeight;
      this.setBarMounted("horizontal", i), this.setBarMounted("vertical", n), this.updateThumbSizes(), this.updateThumbPositions(), this.updateCorner(), this.type === "always" && this.setState("visible"), this.type === "auto" && this.setState(i || n ? "visible" : "hidden");
    },
    /**
     * Executes the `updateThumbSizes` operation.
     * @returns {any} Returns the result of `updateThumbSizes` when applicable.
     */
    updateThumbSizes() {
      const t = this.$refs.viewport;
      if (t) {
        if (this._viewport = t, this.$refs.thumbY && this.$refs.scrollbarY && t.scrollHeight > 0) {
          const i = t.clientHeight / t.scrollHeight, n = Math.max(this.$refs.scrollbarY.clientHeight * i, 18);
          this.$refs.thumbY.style.height = `${n}px`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > 0) {
          const i = t.clientWidth / t.scrollWidth, n = Math.max(this.$refs.scrollbarX.clientWidth * i, 18);
          this.$refs.thumbX.style.width = `${n}px`;
        }
      }
    },
    /**
     * Executes the `updateThumbPositions` operation.
     * @returns {any} Returns the result of `updateThumbPositions` when applicable.
     */
    updateThumbPositions() {
      const t = this.$refs.viewport;
      if (t) {
        if (this._viewport = t, this.$refs.thumbY && this.$refs.scrollbarY && t.scrollHeight > t.clientHeight) {
          const i = t.scrollHeight - t.clientHeight, n = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, s = t.scrollTop / i * Math.max(n, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${s}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > t.clientWidth) {
          const i = t.scrollWidth - t.clientWidth, n = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, s = t.scrollLeft / i * Math.max(n, 0);
          this.$refs.thumbX.style.transform = `translate3d(${s}px, 0, 0)`;
        }
      }
    },
    /**
     * Executes the `updateCorner` operation.
     * @returns {any} Returns the result of `updateCorner` when applicable.
     */
    updateCorner() {
      if (!this.$refs.corner) return;
      !this.$refs.scrollbarX?.hidden && !this.$refs.scrollbarY?.hidden ? (this.$refs.corner.hidden = !1, this.$refs.corner.style.width = `${this.$refs.scrollbarY?.offsetWidth || 0}px`, this.$refs.corner.style.height = `${this.$refs.scrollbarX?.offsetHeight || 0}px`) : this.$refs.corner.hidden = !0;
    },
    /**
     * Executes the `onScroll` operation.
     * @returns {any} Returns the result of `onScroll` when applicable.
     */
    onScroll() {
      this.updateThumbPositions(), this.type === "scroll" && (this.setState("visible"), this.hideTimer && window.clearTimeout(this.hideTimer), this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay));
    },
    /**
     * Executes the `onPointerEnter` operation.
     * @returns {any} Returns the result of `onPointerEnter` when applicable.
     */
    onPointerEnter() {
      this.type === "hover" && (this.hideTimer && window.clearTimeout(this.hideTimer), this.setState("visible"));
    },
    /**
     * Executes the `onPointerLeave` operation.
     * @returns {any} Returns the result of `onPointerLeave` when applicable.
     */
    onPointerLeave() {
      this.type === "hover" && (this.hideTimer && window.clearTimeout(this.hideTimer), this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay));
    },
    /**
     * Executes the `onTrackPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onTrackPointerDown` when applicable.
     */
    onTrackPointerDown(t) {
      const i = t.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || n.hidden || t.target === this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`]) return;
      const s = this.$refs.viewport, r = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!s || !r) return;
      const a = n.getBoundingClientRect();
      if (i === "vertical") {
        const o = t.clientY - a.top - r.offsetHeight / 2, l = n.clientHeight - r.offsetHeight, f = s.scrollHeight - s.clientHeight;
        s.scrollTop = o / Math.max(l, 1) * f;
      } else {
        const o = t.clientX - a.left - r.offsetWidth / 2, l = n.clientWidth - r.offsetWidth, f = s.scrollWidth - s.clientWidth;
        s.scrollLeft = o / Math.max(l, 1) * f;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(t) {
      const i = t.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`], s = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || !s || s.hidden) return;
      const r = n.getBoundingClientRect();
      this._dragAxis = i, this._dragPointerOffset = i === "vertical" ? t.clientY - r.top : t.clientX - r.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(t) {
      const i = this._dragAxis, n = this.$refs.viewport, s = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`], r = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!i || !n || !s || !r || s.hidden) return;
      const a = s.getBoundingClientRect();
      if (i === "vertical") {
        const o = t.clientY - a.top, l = s.clientHeight - r.offsetHeight, f = n.scrollHeight - n.clientHeight;
        n.scrollTop = (o - this._dragPointerOffset) / Math.max(l, 1) * f;
      } else {
        const o = t.clientX - a.left, l = s.clientWidth - r.offsetWidth, f = n.scrollWidth - n.clientWidth;
        n.scrollLeft = (o - this._dragPointerOffset) / Math.max(l, 1) * f;
      }
    },
    /**
     * Executes the `onPointerUp` operation.
     * @returns {any} Returns the result of `onPointerUp` when applicable.
     */
    onPointerUp() {
      this._dragAxis = null, window.removeEventListener("pointermove", this.onPointerMove);
    }
  }));
}
function wu(e) {
  e.data("rzSlider", () => ({
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    disabled: !1,
    inverted: !1,
    minStepsBetweenThumbs: 0,
    values: [],
    activeThumbIndex: null,
    dragging: !1,
    trackEl: null,
    thumbEls: [],
    inputEls: [],
    init() {
      const t = this.$el.dataset, i = this.parseJson(t.assets, []), n = t.nonce;
      this.min = this.parseNumber(t.min, 0), this.max = this.parseNumber(t.max, 100), this.step = Math.max(this.parseNumber(t.step, 1), Number.EPSILON), this.orientation = t.orientation || "horizontal", this.disabled = this.parseBoolean(t.disabled, !1), this.inverted = this.parseBoolean(t.inverted, !1), this.minStepsBetweenThumbs = Math.max(this.parseNumber(t.minStepsBetweenThumbs, 0), 0), this.values = this.parseJson(t.values, []).map((s) => this.parseNumber(s, this.min)), this.trackEl = this.$refs.track, this.thumbEls = this.$el.querySelectorAll("[data-thumb-index]"), this.inputEls = this.$el.querySelectorAll("[data-slider-input]"), this.values = this.applyConstraints(this.values, -1, null), this.syncDom(), this.syncHiddenInputs(), i.length > 0 && J(i, n);
    },
    handlePointerDown(t) {
      if (this.disabled)
        return;
      const i = this.parseThumbIndex(t.currentTarget);
      i < 0 || (this.activeThumbIndex = i, this.dragging = !0, t.currentTarget.focus(), t.preventDefault());
    },
    handlePointerMove(t) {
      if (this.disabled || !this.dragging || this.activeThumbIndex === null)
        return;
      const i = this.getPointerValue(t);
      this.values[this.activeThumbIndex] = i, this.values = this.applyConstraints(this.values, this.activeThumbIndex, i), this.syncDom(), this.syncHiddenInputs();
    },
    handlePointerUp() {
      this.dragging = !1, this.activeThumbIndex = null;
    },
    handleTrackPointerDown(t) {
      if (this.disabled)
        return;
      const i = this.getPointerValue(t), n = this.getNearestThumbIndex(i);
      n < 0 || (this.activeThumbIndex = n, this.values[n] = i, this.values = this.applyConstraints(this.values, n, i), this.syncDom(), this.syncHiddenInputs(), this.focusThumb(n), t.preventDefault());
    },
    handleThumbKeyDown(t) {
      if (this.disabled)
        return;
      const i = this.parseThumbIndex(t.currentTarget);
      if (i < 0)
        return;
      const n = this.step * 10, s = this.values[i] ?? this.min;
      let r = s;
      if (t.key === "ArrowRight" || t.key === "ArrowUp")
        r = s + this.step;
      else if (t.key === "ArrowLeft" || t.key === "ArrowDown")
        r = s - this.step;
      else if (t.key === "PageUp")
        r = s + n;
      else if (t.key === "PageDown")
        r = s - n;
      else if (t.key === "Home")
        r = this.min;
      else if (t.key === "End")
        r = this.max;
      else
        return;
      this.values[i] = r, this.values = this.applyConstraints(this.values, i, r), this.syncDom(), this.syncHiddenInputs(), t.preventDefault();
    },
    syncDom() {
      const t = this.values.map((r) => this.valueToPercent(r)), i = Math.min(...t), n = Math.max(...t);
      this.trackEl && (this.trackEl.dataset.orientation = this.orientation);
      const s = this.$refs.range;
      s && (s.dataset.orientation = this.orientation, this.orientation === "vertical" ? (s.style.bottom = `${i}%`, s.style.height = `${Math.max(n - i, 0)}%`, s.style.left = "0", s.style.right = "0", s.style.width = "100%") : (s.style.left = `${i}%`, s.style.width = `${Math.max(n - i, 0)}%`, s.style.top = "0", s.style.bottom = "0", s.style.height = "100%")), this.thumbEls.forEach((r) => {
        const a = this.parseThumbIndex(r), o = this.values[a] ?? this.min, l = this.valueToPercent(o);
        r.dataset.orientation = this.orientation, r.setAttribute("aria-valuenow", `${o}`), r.style.position = "absolute", this.orientation === "vertical" ? (r.style.left = "50%", r.style.bottom = `${l}%`, r.style.transform = "translate(-50%, 50%)") : (r.style.top = "50%", r.style.left = `${l}%`, r.style.transform = "translate(-50%, -50%)");
      });
    },
    syncHiddenInputs() {
      this.inputEls.forEach((t) => {
        const i = this.parseNumber(t.dataset.inputIndex, 0), n = this.values[i] ?? this.min;
        t.value = `${n}`;
      });
    },
    applyConstraints(t, i, n) {
      const s = t.length;
      if (s === 0)
        return [this.min];
      let r = t.map((o) => this.snapValue(o));
      r = r.map((o) => this.clampValue(o)), i >= 0 && i < s ? (r[i] = this.snapValue(n ?? r[i]), r[i] = this.clampValue(r[i])) : r = [...r].sort((o, l) => o - l);
      const a = this.minStepsBetweenThumbs;
      for (let o = 1; o < s; o += 1) {
        const l = r[o - 1] + a;
        r[o] < l && (r[o] = this.clampValue(this.snapValue(l)));
      }
      for (let o = s - 2; o >= 0; o -= 1) {
        const l = r[o + 1] - a;
        r[o] > l && (r[o] = this.clampValue(this.snapValue(l)));
      }
      return r;
    },
    snapValue(t) {
      const i = this.min + Math.round((t - this.min) / this.step) * this.step;
      return Number(i.toFixed(6));
    },
    getNearestThumbIndex(t) {
      if (this.values.length === 0)
        return -1;
      let i = 0, n = Number.MAX_VALUE;
      return this.values.forEach((s, r) => {
        const a = Math.abs(s - t);
        a < n && (n = a, i = r);
      }), i;
    },
    getPointerValue(t) {
      if (!this.trackEl)
        return this.min;
      const i = this.trackEl.getBoundingClientRect(), n = this.orientation === "vertical" ? i.height : i.width;
      if (n <= 0)
        return this.min;
      let s;
      this.orientation === "vertical" ? s = (i.bottom - t.clientY) / n : s = (t.clientX - i.left) / n, s = Math.min(Math.max(s, 0), 1), this.inverted && (s = 1 - s);
      const r = this.min + s * (this.max - this.min);
      return this.snapValue(this.clampValue(r));
    },
    valueToPercent(t) {
      const i = this.max - this.min;
      if (i <= 0)
        return 0;
      const n = (t - this.min) / i, s = this.inverted ? 1 - n : n;
      return Math.min(Math.max(s * 100, 0), 100);
    },
    clampValue(t) {
      return Math.min(Math.max(t, this.min), this.max);
    },
    focusThumb(t) {
      const i = this.$el.querySelector(`[data-thumb-index="${t}"]`);
      i && i.focus();
    },
    parseThumbIndex(t) {
      return t ? this.parseNumber(t.dataset.thumbIndex, -1) : -1;
    },
    parseBoolean(t, i) {
      return t === "true" ? !0 : t === "false" ? !1 : i;
    },
    parseNumber(t, i) {
      const n = Number(t);
      return Number.isFinite(n) ? n : i;
    },
    parseJson(t, i) {
      try {
        return JSON.parse(t || "null") ?? i;
      } catch {
        return i;
      }
    }
  }));
}
function xu(e) {
  e.data("rzSheet", () => ({
    open: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.open = this.$el.dataset.defaultOpen === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.open = !this.open;
    },
    /**
     * Executes the `close` operation.
     * @returns {any} Returns the result of `close` when applicable.
     */
    close() {
      this.open = !1;
    },
    /**
     * Executes the `show` operation.
     * @returns {any} Returns the result of `show` when applicable.
     */
    show() {
      this.open = !0;
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.open ? "open" : "closed";
    }
  }));
}
function Iu(e) {
  e.data("rzTabs", () => ({
    selectedTab: "",
    _triggers: [],
    _observer: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const t = this.$el.dataset.defaultValue;
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), t && this._triggers.some((i) => i.dataset.value === t) ? this.selectedTab = t : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this._observer && this._observer.disconnect();
    },
    /**
     * Executes the `refreshTriggers` operation.
     * @returns {any} Returns the result of `refreshTriggers` when applicable.
     */
    refreshTriggers() {
      this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
    },
    /**
     * Executes the `onTriggerClick` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `onTriggerClick` when applicable.
     */
    onTriggerClick(t) {
      const i = t.currentTarget?.dataset?.value;
      !i || t.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = i, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
    },
    /**
     * Executes the `isSelected` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `isSelected` when applicable.
     */
    isSelected(t) {
      return this.selectedTab === t;
    },
    /**
     * Executes the `bindTrigger` operation.
     * @returns {any} Returns the result of `bindTrigger` when applicable.
     */
    bindTrigger() {
      this.selectedTab;
      const t = this.$el.dataset.value, i = this.isSelected(t), n = this.$el.getAttribute("aria-disabled") === "true";
      return {
        "aria-selected": String(i),
        tabindex: i ? "0" : "-1",
        "data-state": i ? "active" : "inactive",
        ...n && { disabled: !0 }
      };
    },
    /**
     * Executes the `_attrDisabled` operation.
     * @returns {any} Returns the result of `_attrDisabled` when applicable.
     */
    _attrDisabled() {
      return this.$el.getAttribute("aria-disabled") === "true" ? "true" : null;
    },
    /**
     * Executes the `_attrAriaSelected` operation.
     * @returns {any} Returns the result of `_attrAriaSelected` when applicable.
     */
    _attrAriaSelected() {
      return String(this.$el.dataset.value === this.selectedTab);
    },
    /**
     * Executes the `_attrHidden` operation.
     * @returns {any} Returns the result of `_attrHidden` when applicable.
     */
    _attrHidden() {
      return this.$el.dataset.value === this.selectedTab ? null : "true";
    },
    /**
     * Executes the `_attrAriaHidden` operation.
     * @returns {any} Returns the result of `_attrAriaHidden` when applicable.
     */
    _attrAriaHidden() {
      return String(this.selectedTab !== this.$el.dataset.value);
    },
    /**
     * Executes the `_attrDataState` operation.
     * @returns {any} Returns the result of `_attrDataState` when applicable.
     */
    _attrDataState() {
      return this.selectedTab === this.$el.dataset.value ? "active" : "inactive";
    },
    /**
     * Executes the `_attrTabIndex` operation.
     * @returns {any} Returns the result of `_attrTabIndex` when applicable.
     */
    _attrTabIndex() {
      return this.selectedTab === this.$el.dataset.value ? "0" : "-1";
    },
    /**
     * Executes the `onListKeydown` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `onListKeydown` when applicable.
     */
    onListKeydown(t) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(t.key)) {
        t.preventDefault();
        const i = this._triggers.filter((l) => l.getAttribute("aria-disabled") !== "true");
        if (i.length === 0) return;
        const n = i.findIndex((l) => l.dataset.value === this.selectedTab);
        if (n === -1) return;
        const s = t.currentTarget?.getAttribute("aria-orientation") === "vertical", r = s ? "ArrowUp" : "ArrowLeft", a = s ? "ArrowDown" : "ArrowRight";
        let o = n;
        switch (t.key) {
          case r:
            o = n - 1 < 0 ? i.length - 1 : n - 1;
            break;
          case a:
            o = (n + 1) % i.length;
            break;
          case "Home":
            o = 0;
            break;
          case "End":
            o = i.length - 1;
            break;
        }
        if (o >= 0 && o < i.length) {
          const l = i[o];
          this.selectedTab = l.dataset.value, this.$nextTick(() => l.focus());
        }
      }
    }
  }));
}
function Eu(e) {
  e.data("rzToggle", () => ({
    pressed: !1,
    disabled: !1,
    controlled: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.disabled = this.$el.dataset.disabled === "true";
      const t = this.$el.dataset.pressed;
      if (this.controlled = t === "true" || t === "false", this.controlled) {
        this.pressed = t === "true";
        return;
      }
      this.pressed = this.$el.dataset.defaultPressed === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.disabled || this.controlled || (this.pressed = !this.pressed);
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.pressed ? "on" : "off";
    },
    /**
     * Executes the `ariaPressed` operation.
     * @returns {any} Returns the result of `ariaPressed` when applicable.
     */
    ariaPressed() {
      return this.pressed.toString();
    },
    /**
     * Executes the `dataDisabled` operation.
     * @returns {any} Returns the result of `dataDisabled` when applicable.
     */
    dataDisabled() {
      return this.disabled ? "" : null;
    }
  }));
}
function _u(e) {
  e.data("rzTooltip", () => ({
    open: !1,
    ariaExpanded: "false",
    state: "closed",
    side: "top",
    triggerEl: null,
    contentEl: null,
    arrowEl: null,
    openDelayTimer: null,
    closeDelayTimer: null,
    skipDelayTimer: null,
    openDelayDuration: 700,
    skipDelayDuration: 300,
    closeDelayDuration: 0,
    skipDelayActive: !1,
    disableHoverableContent: !1,
    anchor: "top",
    strategy: "absolute",
    mainOffset: 4,
    crossAxisOffset: 0,
    alignmentAxisOffset: null,
    shiftPadding: 8,
    enableFlip: !0,
    enableShift: !0,
    enableAutoUpdate: !0,
    isControlledOpenState: !1,
    cleanupAutoUpdate: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.readDatasetOptions(), this.open = this.getBooleanDataset("open", this.getBooleanDataset("defaultOpen", !1)), this.ariaExpanded = this.open.toString(), this.state = this.open ? "open" : "closed", this.triggerEl = this.$refs.trigger || this.$el.querySelector('[data-slot="tooltip-trigger"]'), this.contentEl = this.$refs.content || this.$el.querySelector('[data-slot="tooltip-content"]'), this.arrowEl = this.$el.querySelector('[data-slot="tooltip-arrow"]'), this.bindInteractionEvents(), this.$watch("open", (t) => {
        const i = this.getBooleanDataset("open", t), n = this.isControlledOpenState ? i : t;
        if (this.open = n, this.ariaExpanded = n.toString(), this.state = n ? "open" : "closed", this.triggerEl && (this.triggerEl.dataset.state = this.state), this.contentEl && (this.contentEl.dataset.state = this.state), n) {
          this.$nextTick(() => {
            this.updatePosition(), this.startAutoUpdate();
          });
          return;
        }
        this.stopAutoUpdate(), this.startSkipDelayWindow();
      }), this.open && this.$nextTick(() => {
        this.updatePosition(), this.startAutoUpdate();
      });
    },
    /**
     * Executes the `readDatasetOptions` operation.
     * @returns {any} Returns the result of `readDatasetOptions` when applicable.
     */
    readDatasetOptions() {
      this.anchor = this.$el.dataset.anchor || this.anchor, this.strategy = this.$el.dataset.strategy || this.strategy, this.mainOffset = this.getNumberDataset("offset", this.mainOffset), this.crossAxisOffset = this.getNumberDataset("crossAxisOffset", this.crossAxisOffset), this.alignmentAxisOffset = this.getNullableNumberDataset("alignmentAxisOffset", this.alignmentAxisOffset), this.shiftPadding = this.getNumberDataset("shiftPadding", this.shiftPadding), this.openDelayDuration = this.getNumberDataset("delayDuration", this.openDelayDuration), this.skipDelayDuration = this.getNumberDataset("skipDelayDuration", this.skipDelayDuration), this.closeDelayDuration = this.getNumberDataset("closeDelayDuration", this.closeDelayDuration), this.disableHoverableContent = this.getBooleanDataset("disableHoverableContent", this.disableHoverableContent), this.enableFlip = this.getBooleanDataset("enableFlip", this.enableFlip), this.enableShift = this.getBooleanDataset("enableShift", this.enableShift), this.enableAutoUpdate = this.getBooleanDataset("autoUpdate", this.enableAutoUpdate), this.isControlledOpenState = this.getBooleanDataset("openControlled", this.isControlledOpenState);
    },
    /**
     * Executes the `getBooleanDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getBooleanDataset` when applicable.
     */
    getBooleanDataset(t, i) {
      const n = this.$el.dataset[t];
      return typeof n > "u" ? i : n === "true";
    },
    /**
     * Executes the `getNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNumberDataset` when applicable.
     */
    getNumberDataset(t, i) {
      const n = Number(this.$el.dataset[t]);
      return Number.isFinite(n) ? n : i;
    },
    /**
     * Executes the `getNullableNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
     */
    getNullableNumberDataset(t, i) {
      const n = this.$el.dataset[t];
      if (typeof n > "u" || n === null || n === "") return i;
      const s = Number(n);
      return Number.isFinite(s) ? s : i;
    },
    /**
     * Executes the `bindInteractionEvents` operation.
     * @returns {any} Returns the result of `bindInteractionEvents` when applicable.
     */
    bindInteractionEvents() {
      this.triggerEl && (this.triggerEl.addEventListener("pointerenter", this.handleTriggerPointerEnter.bind(this)), this.triggerEl.addEventListener("pointerleave", this.handleTriggerPointerLeave.bind(this)), this.triggerEl.addEventListener("focus", this.handleTriggerFocus.bind(this)), this.triggerEl.addEventListener("blur", this.handleTriggerBlur.bind(this)), this.triggerEl.addEventListener("keydown", this.handleTriggerKeydown.bind(this)), this.contentEl && (this.contentEl.addEventListener("pointerenter", this.handleContentPointerEnter.bind(this)), this.contentEl.addEventListener("pointerleave", this.handleContentPointerLeave.bind(this))));
    },
    /**
     * Executes the `startAutoUpdate` operation.
     * @returns {any} Returns the result of `startAutoUpdate` when applicable.
     */
    startAutoUpdate() {
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = _r(this.triggerEl, this.contentEl, () => {
        this.updatePosition();
      }));
    },
    /**
     * Executes the `stopAutoUpdate` operation.
     * @returns {any} Returns the result of `stopAutoUpdate` when applicable.
     */
    stopAutoUpdate() {
      typeof this.cleanupAutoUpdate == "function" && (this.cleanupAutoUpdate(), this.cleanupAutoUpdate = null);
    },
    /**
     * Executes the `clearTimers` operation.
     * @returns {any} Returns the result of `clearTimers` when applicable.
     */
    clearTimers() {
      this.openDelayTimer && (window.clearTimeout(this.openDelayTimer), this.openDelayTimer = null), this.closeDelayTimer && (window.clearTimeout(this.closeDelayTimer), this.closeDelayTimer = null), this.skipDelayTimer && (window.clearTimeout(this.skipDelayTimer), this.skipDelayTimer = null);
    },
    /**
     * Executes the `startSkipDelayWindow` operation.
     * @returns {any} Returns the result of `startSkipDelayWindow` when applicable.
     */
    startSkipDelayWindow() {
      if (this.skipDelayDuration <= 0) {
        this.skipDelayActive = !1;
        return;
      }
      this.skipDelayTimer && window.clearTimeout(this.skipDelayTimer), this.skipDelayActive = !0, this.skipDelayTimer = window.setTimeout(() => {
        this.skipDelayActive = !1, this.skipDelayTimer = null;
      }, this.skipDelayDuration);
    },
    /**
     * Executes the `queueOpen` operation.
     * @returns {any} Returns the result of `queueOpen` when applicable.
     */
    queueOpen() {
      if (this.open) return;
      this.closeDelayTimer && (window.clearTimeout(this.closeDelayTimer), this.closeDelayTimer = null);
      const t = this.skipDelayActive ? 0 : this.openDelayDuration;
      if (t <= 0) {
        this.open = !0;
        return;
      }
      this.openDelayTimer && window.clearTimeout(this.openDelayTimer), this.openDelayTimer = window.setTimeout(() => {
        this.open = !0, this.openDelayTimer = null;
      }, t);
    },
    /**
     * Executes the `queueClose` operation.
     * @returns {any} Returns the result of `queueClose` when applicable.
     */
    queueClose() {
      if (!(!this.open && !this.openDelayTimer)) {
        if (this.openDelayTimer && (window.clearTimeout(this.openDelayTimer), this.openDelayTimer = null), this.closeDelayDuration <= 0) {
          this.open = !1;
          return;
        }
        this.closeDelayTimer && window.clearTimeout(this.closeDelayTimer), this.closeDelayTimer = window.setTimeout(() => {
          this.open = !1, this.closeDelayTimer = null;
        }, this.closeDelayDuration);
      }
    },
    /**
     * Executes the `handleTriggerPointerEnter` operation.
     * @returns {any} Returns the result of `handleTriggerPointerEnter` when applicable.
     */
    handleTriggerPointerEnter() {
      this.queueOpen();
    },
    /**
     * Executes the `handleTriggerPointerLeave` operation.
     * @returns {any} Returns the result of `handleTriggerPointerLeave` when applicable.
     */
    handleTriggerPointerLeave() {
      this.queueClose();
    },
    /**
     * Executes the `handleTriggerFocus` operation.
     * @returns {any} Returns the result of `handleTriggerFocus` when applicable.
     */
    handleTriggerFocus() {
      this.queueOpen();
    },
    /**
     * Executes the `handleTriggerBlur` operation.
     * @returns {any} Returns the result of `handleTriggerBlur` when applicable.
     */
    handleTriggerBlur() {
      this.queueClose();
    },
    /**
     * Executes the `handleContentPointerEnter` operation.
     * @returns {any} Returns the result of `handleContentPointerEnter` when applicable.
     */
    handleContentPointerEnter() {
      this.disableHoverableContent || this.closeDelayTimer && (window.clearTimeout(this.closeDelayTimer), this.closeDelayTimer = null);
    },
    /**
     * Executes the `handleContentPointerLeave` operation.
     * @returns {any} Returns the result of `handleContentPointerLeave` when applicable.
     */
    handleContentPointerLeave() {
      this.disableHoverableContent || this.queueClose();
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(t) {
      t.key === "Escape" && this.handleWindowEscape();
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
    handleWindowEscape() {
      this.clearTimers(), this.open = !1, this.$nextTick(() => this.triggerEl?.focus());
    },
    /**
     * Executes the `updatePosition` operation.
     * @returns {any} Returns the result of `updatePosition` when applicable.
     */
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const t = [
        Tt({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && t.push(Ct()), this.enableShift && t.push(St({ padding: this.shiftPadding })), this.arrowEl && t.push(eu({ element: this.arrowEl })), At(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: t
      }).then(({ x: i, y: n, placement: s, middlewareData: r }) => {
        if (this.side = s.split("-")[0], this.contentEl.dataset.side = this.side, this.contentEl.style.position = this.strategy, this.contentEl.style.left = `${i}px`, this.contentEl.style.top = `${n}px`, !this.arrowEl || !r.arrow) return;
        const a = r.arrow.x, o = r.arrow.y, f = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        }[this.side] || "bottom";
        this.arrowEl.style.left = a != null ? `${a}px` : "", this.arrowEl.style.top = o != null ? `${o}px` : "", this.arrowEl.style.right = "", this.arrowEl.style.bottom = "", this.arrowEl.style[f] = "-5px";
      });
    }
  }));
}
function Tu(e) {
  e.data("rzSidebar", () => ({
    open: !0,
    openMobile: !1,
    isMobile: !1,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    /**
     * Initializes the component, loading configuration from data attributes,
     * restoring persisted state from cookies, and setting up event listeners.
     */
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas", this.shortcut = this.$el.dataset.shortcut || "b", this.cookieName = this.$el.dataset.cookieName || "sidebar_state", this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const t = this.$el.dataset.defaultOpen === "true", i = this.cookieName ? document.cookie.split("; ").find((n) => n.startsWith(`${this.cookieName}=`))?.split("=")[1] : null;
      this.open = i != null ? i === "true" : t, this.checkIfMobile(), window.addEventListener("keydown", (n) => {
        (n.ctrlKey || n.metaKey) && n.key.toLowerCase() === this.shortcut.toLowerCase() && (n.preventDefault(), this.toggle());
      }), this.$watch("open", (n) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${n}; path=/; max-age=604800`);
      }), this.$watch("isMobile", () => {
        this.openMobile = !1;
      });
    },
    /**
     * Checks if the current viewport width is below the configured mobile breakpoint.
     */
    checkIfMobile() {
      this.isMobile = window.innerWidth < this.mobileBreakpoint;
    },
    /**
     * Toggles the sidebar's visibility depending on the current viewport mode.
     */
    toggle() {
      this.isMobile ? this.openMobile = !this.openMobile : this.open = !this.open;
    },
    /**
     * Explicitly sets the open state for the desktop sidebar.
     * @param {boolean} value 
     */
    setOpen(t) {
      this.open = t;
    },
    /**
     * Explicitly sets the open state for the mobile sidebar.
     * @param {boolean} value 
     */
    setOpenMobile(t) {
      this.openMobile = t;
    },
    /**
     * Closes the sidebar for both mobile and desktop states.
     */
    close() {
      this.isMobile && (this.openMobile = !1);
    },
    /**
     * Returns whether the mobile sidebar is currently open.
     * @returns {boolean}
     */
    isMobileOpen() {
      return this.openMobile;
    },
    /**
     * Gets the desktop state string representation for Tailwind data attributes.
     * @returns {string} "expanded" or "collapsed"
     */
    get desktopState() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Gets the current overall state string representation.
     * @returns {string} "expanded" or "collapsed"
     */
    get state() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Gets the mobile state string representation for Tailwind data attributes.
     * @returns {string} "open" or "closed"
     */
    get mobileState() {
      return this.openMobile ? "open" : "closed";
    },
    /**
     * Retrieves the collapsible attribute value when the sidebar is collapsed.
     * Used to toggle the CSS width configurations dynamically.
     * @returns {string}
     */
    getCollapsibleAttribute() {
      return this.state === "collapsed" ? this.collapsible : "";
    }
  }));
}
function Su(e) {
  e.data("rzCommand", () => ({
    // --- STATE ---
    search: "",
    selectedValue: null,
    selectedIndex: -1,
    items: [],
    itemsById: /* @__PURE__ */ new Map(),
    filteredItems: [],
    filteredIndexById: /* @__PURE__ */ new Map(),
    groupTemplates: /* @__PURE__ */ new Map(),
    activeDescendantId: null,
    isOpen: !1,
    isEmpty: !0,
    isLoading: !1,
    error: null,
    // --- CONFIG ---
    loop: !1,
    shouldFilter: !0,
    itemsUrl: null,
    fetchTrigger: "immediate",
    serverFiltering: !1,
    dataItemTemplateId: null,
    maxRender: 100,
    _dataFetched: !1,
    _debounceTimer: null,
    _lastSearch: "",
    _lastMatchedItems: [],
    _listInstance: null,
    /**
     * Computes a deterministic 32-bit hash for a string.
     * @param {string} value The value to hash.
     * @returns {string} An unsigned integer hash represented as a string.
     */
    hashString(t) {
      let i = 0;
      for (let n = 0; n < t.length; n++)
        i = (i << 5) - i + t.charCodeAt(n), i |= 0;
      return String(i >>> 0);
    },
    /**
     * Resolves a stable item identifier when an item is missing an id.
     * @param {object} item The command item.
     * @returns {string} A stable identifier for the item.
     */
    resolveStableItemId(t) {
      if (t?.id)
        return String(t.id);
      if (t?.value)
        return String(t.value);
      const i = t?.name || t?.label || JSON.stringify(t ?? {});
      return `item-${this.hashString(String(i))}`;
    },
    // --- COMPUTED (CSP-Compliant Methods) ---
    /**
     * Indicates whether the loading state should be displayed.
     * @returns {boolean} True when loading.
     */
    showLoading() {
      return this.isLoading;
    },
    /**
     * Indicates whether an error is currently set.
     * @returns {boolean} True when an error exists.
     */
    hasError() {
      return this.error !== null;
    },
    /**
     * Indicates whether there is currently no error.
     * @returns {boolean} True when no error exists.
     */
    notHasError() {
      return this.error == null;
    },
    /**
     * Indicates whether the empty state should be shown.
     * @returns {boolean} True when the empty state should be shown.
     */
    shouldShowEmpty() {
      return this.isEmpty && this.search && !this.isLoading && !this.error;
    },
    /**
     * Indicates whether either empty or error state should be shown.
     * @returns {boolean} True when empty or error state applies.
     */
    shouldShowEmptyOrError() {
      return this.isEmpty && this.search && !this.isLoading || this.error !== null;
    },
    // --- LIFECYCLE ---
    /**
     * Initializes command state, registers watchers, and loads initial items.
     * @returns {void}
     */
    init() {
      this.loop = this.$el.dataset.loop === "true", this.shouldFilter = this.$el.dataset.shouldFilter !== "false", this.selectedValue = this.$el.dataset.selectedValue || null, this.itemsUrl = this.$el.dataset.itemsUrl || null, this.fetchTrigger = this.$el.dataset.fetchTrigger || "immediate", this.serverFiltering = this.$el.dataset.serverFiltering === "true", this.dataItemTemplateId = this.$el.dataset.templateId || null, this.maxRender = Number.parseInt(this.$el.dataset.maxRender || "100", 10);
      const t = this.$el.dataset.itemsId;
      let i = [];
      if (t) {
        const s = document.getElementById(t);
        if (s)
          try {
            i = JSON.parse(s.textContent || "[]");
          } catch (r) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, r);
          }
      }
      i.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      const n = i.map((s) => ({
        ...s,
        id: this.resolveStableItemId(s),
        isDataItem: !0
      }));
      this.registerItems(n, { suppressFilter: !0 }), this.itemsUrl && this.fetchTrigger === "immediate" ? this.fetchItems() : this.filterAndSortItems(), this.$watch("search", (s) => {
        if (this.serverFiltering) {
          clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => {
            this.fetchItems(s);
          }, 300);
          return;
        }
        this.filterAndSortItems();
      }), this.$watch("selectedIndex", (s, r) => {
        if (r > -1) {
          const a = this.filteredItems[r];
          if (a) {
            const o = this.$el.querySelector(`[data-command-item-id="${a.id}"]`);
            o && (o.removeAttribute("data-selected"), o.setAttribute("aria-selected", "false"));
          }
        }
        if (s > -1 && this.filteredItems[s]) {
          const a = this.filteredItems[s];
          this.activeDescendantId = a.id;
          const o = this.$el.querySelector(`[data-command-item-id="${a.id}"]`);
          o && (o.setAttribute("data-selected", "true"), o.setAttribute("aria-selected", "true"), o.scrollIntoView({ block: "nearest" }));
          const l = a.value;
          this.selectedValue !== l && (this.selectedValue = l, this.$dispatch("rz:command:select", { value: l }));
        } else
          this.activeDescendantId = null, this.selectedValue = null;
      }), this.$watch("selectedValue", (s) => {
        const r = this.filteredItems.findIndex((a) => a.value === s);
        this.selectedIndex !== r && (this.selectedIndex = r);
      }), this.$watch("filteredItems", (s) => {
        this.isOpen = s.length > 0 || this.isLoading, this.isEmpty = s.length === 0, this._listInstance && this._listInstance.renderList();
      });
    },
    // --- METHODS ---
    /**
     * Stores the list renderer instance for cache-aware rendering.
     * @param {object} listInstance The command list Alpine instance.
     * @returns {void}
     */
    setListInstance(t) {
      this._listInstance = t, this._listInstance.renderList();
    },
    /**
     * Normalizes an item and enriches search metadata.
     * @param {object} item The command item to normalize.
     * @returns {object} The normalized item.
     */
    normalizeItem(t) {
      const i = t.name || "", n = Array.isArray(t.keywords) ? t.keywords : [];
      return {
        ...t,
        id: this.resolveStableItemId(t),
        keywords: n,
        _searchText: `${i} ${n.join(" ")}`.trim().toLowerCase(),
        _order: t._order ?? this.items.length
      };
    },
    /**
     * Registers multiple items while avoiding duplicates.
     * @param {Array<object>} items Items to register.
     * @param {{ suppressFilter?: boolean }} options Registration options.
     * @returns {void}
     */
    registerItems(t, i = {}) {
      const n = i.suppressFilter === !0;
      let s = 0;
      for (const r of t) {
        if (!r)
          continue;
        const a = this.resolveStableItemId(r);
        if (this.itemsById.has(a))
          continue;
        const o = this.normalizeItem(r);
        o._order = this.items.length, this.items.push(o), this.itemsById.set(o.id, o), s++;
      }
      s > 0 && this.selectedIndex === -1 && (this.selectedIndex = 0), !n && !this.serverFiltering && this.filterAndSortItems();
    },
    registerItem(t) {
      this.registerItems([t]);
    },
    /**
     * Unregisters an item by id.
     * @param {string} itemId The item identifier.
     * @returns {void}
     */
    unregisterItem(t) {
      this.itemsById.has(t) && (this.itemsById.delete(t), this.items = this.items.filter((i) => i.id !== t), this.filterAndSortItems());
    },
    /**
     * Registers a group heading template.
     * @param {string} name The group name.
     * @param {DocumentFragment} templateContent The template content.
     * @param {string} headingId The heading identifier.
     * @returns {void}
     */
    registerGroupTemplate(t, i, n) {
      !t || !i || this.groupTemplates.has(t) || this.groupTemplates.set(t, {
        headingId: n,
        templateContent: i
      });
    },
    /**
     * Rebuilds the map of filtered indexes by item id.
     * @returns {void}
     */
    updateFilteredIndexes() {
      const t = /* @__PURE__ */ new Map();
      for (let i = 0; i < this.filteredItems.length; i++)
        t.set(this.filteredItems[i].id, i);
      this.filteredIndexById = t;
    },
    /**
     * Computes a simple ranking score for fast filtering.
     * @param {string} searchText Normalized searchable text.
     * @param {string} searchTerm Normalized search term.
     * @returns {number} Ranking score.
     */
    fastScore(t, i) {
      if (!i)
        return 1;
      const n = t.indexOf(i);
      return n === -1 ? 0 : n === 0 ? 4 : t.includes(` ${i}`) ? 3 : 2;
    },
    /**
     * Filters, sorts, and trims items based on current settings.
     * @returns {void}
     */
    filterAndSortItems() {
      if (this.serverFiltering && this._dataFetched) {
        this.filteredItems = this.items.slice(0, this.maxRender), this.updateFilteredIndexes(), this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
        return;
      }
      const t = (this.search || "").trim().toLowerCase(), n = t && this._lastSearch && t.startsWith(this._lastSearch) ? this._lastMatchedItems : this.items;
      let s = [];
      if (!this.shouldFilter || !t)
        s = this.items.slice();
      else {
        const o = [];
        for (const l of n) {
          if (l.forceMount)
            continue;
          const f = this.fastScore(l._searchText, t);
          f > 0 && o.push([l, f]);
        }
        o.sort((l, f) => f[1] !== l[1] ? f[1] - l[1] : (l[0]._order || 0) - (f[0]._order || 0)), s = o.map(([l]) => l);
      }
      const r = this.items.filter((o) => o.forceMount), a = [...s, ...r];
      if (this._lastSearch = t, this._lastMatchedItems = a, this.filteredItems = a.slice(0, this.maxRender), this.updateFilteredIndexes(), this.selectedValue) {
        const o = this.filteredItems.findIndex((l) => l.value === this.selectedValue);
        this.selectedIndex = o > -1 ? o : this.filteredItems.length > 0 ? 0 : -1;
      } else
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
    },
    /**
     * Fetches remote items and registers them.
     * @param {string} [query=''] Query string used for server filtering.
     * @returns {Promise<void>}
     */
    async fetchItems(t = "") {
      if (this.itemsUrl) {
        if (!this.dataItemTemplateId) {
          console.error("RzCommand: `ItemsUrl` was provided, but no `<CommandItemTemplate>` was found to render the data."), this.error = "Configuration error: No data template found.";
          return;
        }
        this.isLoading = !0, this.error = null;
        try {
          const i = new URL(this.itemsUrl, window.location.origin);
          this.serverFiltering && t && i.searchParams.append("q", t);
          const n = await fetch(i);
          if (!n.ok)
            throw new Error(`Network response was not ok: ${n.statusText}`);
          const s = await n.json();
          this.serverFiltering && (this.items = this.items.filter((a) => !a.isDataItem), this.itemsById = new Map(this.items.map((a) => [a.id, a])));
          const r = s.map((a) => ({
            ...a,
            id: this.resolveStableItemId(a),
            isDataItem: !0
          }));
          this.registerItems(r, { suppressFilter: !0 }), this._dataFetched = !0;
        } catch (i) {
          this.error = i.message || "Failed to fetch command items.", console.error("RzCommand:", this.error);
        } finally {
          this.isLoading = !1, this.filterAndSortItems();
        }
      }
    },
    /**
     * Handles an interaction that may trigger deferred data fetch.
     * @returns {void}
     */
    handleInteraction() {
      this.itemsUrl && this.fetchTrigger === "on-open" && !this._dataFetched && this.fetchItems();
    },
    // --- EVENT HANDLERS ---
    /**
     * Handles item click selection and execute dispatch.
     * @param {MouseEvent} event The click event.
     * @returns {void}
     */
    handleItemClick(t) {
      const i = t.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, s = this.filteredIndexById.get(n) ?? -1;
      if (s > -1) {
        const r = this.filteredItems[s];
        r && !r.disabled && (this.selectedIndex = s, this.$dispatch("rz:command:execute", { value: r.value }));
      }
    },
    /**
     * Handles hover-based selection changes.
     * @param {MouseEvent} event The mouse event.
     * @returns {void}
     */
    handleItemHover(t) {
      const i = t.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, s = this.filteredIndexById.get(n) ?? -1;
      if (s > -1) {
        const r = this.filteredItems[s];
        r && !r.disabled && this.selectedIndex !== s && (this.selectedIndex = s);
      }
    },
    // --- KEYBOARD NAVIGATION ---
    /**
     * Handles keyboard navigation and execute behavior.
     * @param {KeyboardEvent} e The keyboard event.
     * @returns {void}
     */
    handleKeydown(t) {
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), this.selectNext();
          break;
        case "ArrowUp":
          t.preventDefault(), this.selectPrev();
          break;
        case "Home":
          t.preventDefault(), this.selectFirst();
          break;
        case "End":
          t.preventDefault(), this.selectLast();
          break;
        case "Enter": {
          t.preventDefault();
          const i = this.filteredItems[this.selectedIndex];
          i && !i.disabled && this.$dispatch("rz:command:execute", { value: i.value });
          break;
        }
      }
    },
    /**
     * Selects the next enabled item.
     * @returns {void}
     */
    selectNext() {
      if (this.filteredItems.length === 0) return;
      let t = this.selectedIndex, i = 0;
      do {
        if (t = t + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : t + 1, i++, !this.filteredItems[t]?.disabled) {
          this.selectedIndex = t;
          return;
        }
        if (!this.loop && t === this.filteredItems.length - 1) return;
      } while (i <= this.filteredItems.length);
    },
    /**
     * Selects the previous enabled item.
     * @returns {void}
     */
    selectPrev() {
      if (this.filteredItems.length === 0) return;
      let t = this.selectedIndex, i = 0;
      do {
        if (t = t - 1 < 0 ? this.loop ? this.filteredItems.length - 1 : 0 : t - 1, i++, !this.filteredItems[t]?.disabled) {
          this.selectedIndex = t;
          return;
        }
        if (!this.loop && t === 0) return;
      } while (i <= this.filteredItems.length);
    },
    /**
     * Selects the first enabled item.
     * @returns {void}
     */
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.findIndex((i) => !i.disabled);
        t > -1 && (this.selectedIndex = t);
      }
    },
    /**
     * Selects the last enabled item.
     * @returns {void}
     */
    selectLast() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.map((i) => i.disabled).lastIndexOf(!1);
        t > -1 && (this.selectedIndex = t);
      }
    }
  }));
}
function Cu(e) {
  e.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    /**
     * Computes a deterministic hash for fallback item ids.
     * @param {string} value The value to hash.
     * @returns {string} A hash string.
     */
    hashString(t) {
      let i = 0;
      for (let n = 0; n < t.length; n++)
        i = (i << 5) - i + t.charCodeAt(n), i |= 0;
      return String(i >>> 0);
    },
    /**
     * Resolves a stable identifier for the item.
     * @param {string} value The item value.
     * @param {string} name The item display name.
     * @returns {string} The stable identifier.
     */
    resolveItemId(t, i) {
      return this.$el.id ? this.$el.id : t || `item-${this.hashString(i || this.$el.textContent.trim())}`;
    },
    /**
     * Initializes the item and registers it with the parent command instance.
     * @returns {void}
     */
    init() {
      const t = this.$el.closest('[x-data="rzCommand"]');
      if (!t) {
        console.error("CommandItem must be a child of RzCommand.");
        return;
      }
      this.parent = e.$data(t);
      const i = this.$el.querySelector("template"), n = i?.content ? i.content.cloneNode(!0) : null, s = this.$el.dataset.value || this.$el.textContent.trim(), r = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
      this.itemData = {
        id: this.resolveItemId(s, r),
        value: s,
        name: r,
        keywords: JSON.parse(this.$el.dataset.keywords || "[]"),
        group: this.$el.dataset.group || null,
        templateContent: n,
        disabled: this.$el.dataset.disabled === "true",
        forceMount: this.$el.dataset.forceMount === "true"
      }, this.parent.registerItem(this.itemData);
    },
    /**
     * Unregisters the item from the parent command instance.
     * @returns {void}
     */
    destroy() {
      this.parent && this.parent.unregisterItem(this.itemData.id);
    }
  }));
}
function Au(e) {
  e.data("rzCommandList", () => ({
    parent: null,
    dataItemTemplate: null,
    rowCache: /* @__PURE__ */ new Map(),
    separatorTemplate: null,
    showLoading: !1,
    /**
     * Initializes the command list and links it with the parent command instance.
     * @returns {void}
     */
    init() {
      const t = this.$el.closest('[x-data="rzCommand"]');
      if (!t) {
        console.error("CommandList must be a child of RzCommand.");
        return;
      }
      this.parent = e.$data(t), this.parent.dataItemTemplateId && (this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId));
      const i = this.$el.querySelector('[data-slot="command-separator"]');
      i && (this.separatorTemplate = i.cloneNode(!0), this.separatorTemplate.removeAttribute("id"), this.separatorTemplate.removeAttribute("x-data"), this.separatorTemplate.removeAttribute("data-alpine-root")), this.$el.querySelectorAll('[data-slot="command-separator"]').forEach((n) => {
        n.remove();
      }), this.showLoading = this.parent?.isLoading === !0, this.$watch("parent.isLoading", (n) => {
        this.showLoading = n === !0;
      }), this.parent.setListInstance(this);
    },
    /**
     * Returns a cached row for an item, creating one from a template when needed.
     * @param {object} item The command item.
     * @returns {Element|null} The row element or null when unavailable.
     */
    ensureRow(t) {
      if (this.rowCache.has(t.id))
        return this.rowCache.get(t.id);
      let i = null;
      if (t.isDataItem) {
        if (!this.dataItemTemplate || !this.dataItemTemplate.content)
          return null;
        i = this.dataItemTemplate.content.cloneNode(!0).firstElementChild, i && (e.addScopeToNode(i, { item: t }), e.initTree(i));
      } else t.templateContent && (i = t.templateContent.cloneNode(!0).firstElementChild);
      return i ? (this.rowCache.set(t.id, i), i) : null;
    },
    /**
     * Applies ARIA/data attributes to a rendered row.
     * @param {Element} itemEl The row element.
     * @param {object} item The command item.
     * @param {number} itemIndex The filtered index of the item.
     * @returns {void}
     */
    applyItemAttributes(t, i, n) {
      t.setAttribute("data-command-item-id", i.id), t.setAttribute("data-value", i.value || ""), i.keywords && t.setAttribute("data-keywords", JSON.stringify(i.keywords)), i.group && t.setAttribute("data-group", i.group), i.disabled ? (t.setAttribute("data-disabled", "true"), t.setAttribute("aria-disabled", "true")) : (t.removeAttribute("data-disabled"), t.removeAttribute("aria-disabled")), i.forceMount && t.setAttribute("data-force-mount", "true"), t.setAttribute("role", "option"), t.setAttribute("aria-selected", this.parent.selectedIndex === n ? "true" : "false"), this.parent.selectedIndex === n ? t.setAttribute("data-selected", "true") : t.removeAttribute("data-selected");
    },
    /**
     * Renders grouped command rows using cached row elements.
     * @returns {void}
     */
    renderList() {
      const t = this.parent.filteredItems || [], i = this.parent.groupTemplates || /* @__PURE__ */ new Map(), n = this.$el, s = document.createDocumentFragment(), r = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      for (const f of t) {
        const m = f.group || "__ungrouped__";
        r.has(m) || r.set(m, []), r.get(m).push(f);
      }
      const a = Array.from(r.entries()).filter(([, f]) => f.length > 0), o = a.filter(([f]) => f !== "__ungrouped__").length;
      let l = 0;
      a.forEach(([f, m]) => {
        const b = f !== "__ungrouped__";
        if (b && this.separatorTemplate && o > 1 && l > 0) {
          const y = this.separatorTemplate.cloneNode(!0);
          y.setAttribute("data-dynamic-item", "true"), s.appendChild(y);
        }
        const I = document.createElement("div");
        if (I.setAttribute("role", "group"), I.setAttribute("data-dynamic-item", "true"), I.setAttribute("data-slot", "command-group"), b) {
          const y = i.get(f);
          if (y?.templateContent) {
            const u = y.templateContent.cloneNode(!0);
            y.headingId && I.setAttribute("aria-labelledby", y.headingId), I.appendChild(u);
          }
        }
        m.forEach((y, u) => {
          const d = this.parent.filteredIndexById.get(y.id) ?? u, c = this.ensureRow(y);
          c && (this.applyItemAttributes(c, y, d), I.appendChild(c));
        }), s.appendChild(I), b && (l += 1);
      }), n.querySelectorAll("[data-dynamic-item]").forEach((f) => f.remove()), n.appendChild(s), window.htmx && window.htmx.process(n);
    }
  }));
}
function $u(e) {
  e.data("rzCommandGroup", () => ({
    parent: null,
    heading: "",
    headingId: "",
    /**
     * Initializes the group and registers its heading template with the parent command.
     * @returns {void}
     */
    init() {
      const t = this.$el.closest('[x-data="rzCommand"]');
      if (!t) {
        console.error("CommandGroup must be a child of RzCommand.");
        return;
      }
      this.parent = e.$data(t), this.heading = this.$el.dataset.heading;
      const i = this.$el.querySelector("template"), n = i?.dataset.headingId || "", s = i?.content ? i.content.cloneNode(!0) : null;
      this.heading && s && this.parent.registerGroupTemplate(this.heading, s, n);
    }
  }));
}
function Ou(e, t) {
  e.data("rzChart", () => ({
    chartInstance: null,
    themeChangeHandler: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce || "", s = this.$el.dataset.configId;
      if (i.length > 0 && typeof t == "function") {
        t(i, {
          success: () => this.tryInitializeChart(s),
          error: (r) => console.error("[rzChart] Failed to load Chart.js assets.", r)
        }, n);
        return;
      }
      this.tryInitializeChart(s);
    },
    tryInitializeChart(i) {
      if (!window.Chart) {
        console.error("[rzChart] Chart.js was not found on window.");
        return;
      }
      const n = document.getElementById(i);
      if (!n) {
        console.error(`[rzChart] Could not find configuration script with ID: ${i}`);
        return;
      }
      let s = {};
      try {
        s = JSON.parse(n.textContent || "{}");
      } catch (a) {
        console.error("[rzChart] Failed to parse JSON configuration.", a);
        return;
      }
      this.resolveColorValues(s), this.resolveCallbacks(s), s.options && (s.options.responsive = s.options.responsive ?? !0, s.options.maintainAspectRatio = s.options.maintainAspectRatio ?? !1);
      const r = this.$refs.canvas;
      if (!r) {
        console.error("[rzChart] Canvas reference was not found.");
        return;
      }
      this.chartInstance = new window.Chart(r, s), this.themeChangeHandler = () => {
        this.chartInstance && this.chartInstance.update();
      }, window.addEventListener("rz:theme-change", this.themeChangeHandler);
    },
    resolveColorValues(i) {
      const n = (s) => {
        if (Array.isArray(s))
          return s.map((r) => n(r));
        if (!s || typeof s != "object")
          return s;
        for (const r of Object.keys(s)) {
          const a = s[r];
          if (typeof r == "string" && r.toLowerCase().includes("color")) {
            if (Array.isArray(a)) {
              s[r] = a.map((o) => this._resolveColor(o));
              continue;
            }
            if (a && typeof a == "object") {
              n(a);
              continue;
            }
            s[r] = this._resolveColor(a);
            continue;
          }
          a && typeof a == "object" && n(a);
        }
        return s;
      };
      n(i);
    },
    _resolveColor(i, n = document.documentElement) {
      if (typeof i != "string")
        return i;
      const s = i.trim();
      if (!s.startsWith("var("))
        return s;
      const r = s.slice(4, -1).trim(), [a, o] = r.split(",").map((f) => f.trim());
      return a && (getComputedStyle(n).getPropertyValue(a).trim() || o) || s;
    },
    resolveCallbacks(i) {
      if (!i || !i.options)
        return;
      const n = (s) => {
        if (typeof s != "string")
          return s;
        const r = s.replace("window.", "").split(".");
        let a = window;
        for (const o of r) {
          if (a[o] === void 0)
            return s;
          a = a[o];
        }
        return typeof a == "function" ? a : s;
      };
      if (i.options.plugins?.tooltip?.callbacks) {
        const s = i.options.plugins.tooltip.callbacks;
        for (const r of Object.keys(s))
          s[r] = n(s[r]);
      }
      if (i.options.scales)
        for (const s of Object.keys(i.options.scales)) {
          const r = i.options.scales[s];
          r.ticks && r.ticks.callback && (r.ticks.callback = n(r.ticks.callback));
        }
    },
    destroy() {
      this.themeChangeHandler && (window.removeEventListener("rz:theme-change", this.themeChangeHandler), this.themeChangeHandler = null), this.chartInstance && (this.chartInstance.destroy(), this.chartInstance = null);
    }
  }));
}
async function ku(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(s)).map((a) => a.toString(16).padStart(2, "0")).join("");
}
function J(e, t, i) {
  let n, s;
  typeof t == "function" ? n = { success: t } : t && typeof t == "object" ? n = t : typeof t == "string" && (s = t), !s && typeof i == "string" && (s = i);
  const r = Array.isArray(e) ? e : [e];
  return ku(r).then((a) => (rt.isDefined(a) || rt(r, a, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: s,
    inlineStyleNonce: s
  }), new Promise((o, l) => {
    rt.ready(a, {
      success: () => {
        try {
          n && typeof n.success == "function" && n.success();
        } catch (f) {
          console.error("[rizzyRequire] success callback threw:", f);
        }
        o({ bundleId: a });
      },
      error: (f) => {
        try {
          n && typeof n.error == "function" && n.error(f);
        } catch (m) {
          console.error("[rizzyRequire] error callback threw:", m);
        }
        l(
          new Error(
            `[rizzyRequire] Failed to load bundle ${a} (missing: ${Array.isArray(f) ? f.join(", ") : String(f)})`
          )
        );
      }
    });
  })));
}
function Du(e) {
  Gl(e), Xl(e), Zl(e), Ql(e), tc(e), ec(e, J), ic(e), nc(e, J), sc(e, J), rc(e), ac(e), oc(e, J), lc(e, J), cc(e), uc(e, J), dc(e), iu(e), nu(e), su(e), ru(e), au(e), ou(e), lu(e), cu(e), uu(e), du(e), hu(e, J), fu(e), pu(e), mu(e), gu(e), vu(e), yu(e), bu(e), wu(e), xu(e), Iu(e), Eu(e), _u(e), Tu(e), Su(e), Cu(e), Au(e), $u(e), Ou(e, J);
}
function Nu(e) {
  if (!(e instanceof Element))
    return console.warn("[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el)."), {};
  const t = e.dataset.propsId;
  if (!t)
    return {};
  const i = document.getElementById(t);
  if (!i)
    return console.warn(`[Rizzy.props] Could not find the props script tag with ID '${t}'.`), {};
  try {
    return JSON.parse(i.textContent || "{}");
  } catch (n) {
    return console.error(`[Rizzy.props] Failed to parse JSON from script tag #${t}.`, n), {};
  }
}
const ve = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map();
let On = !1;
function Lu(e) {
  return ye.has(e) || ye.set(
    e,
    import(e).catch((t) => {
      throw ye.delete(e), t;
    })
  ), ye.get(e);
}
function kn(e, t) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    e,
    () => Lu(t).catch((n) => (console.error(
      `[RizzyUI] Failed to load Alpine module '${e}' from '${t}'.`,
      n
    ), () => ({
      _error: !0,
      _errorMessage: `Module '${e}' failed to load.`
    })))
  ), !0) : (console.error(
    `[RizzyUI] Could not register async component '${e}'. AsyncAlpine not available.`
  ), !1);
}
function Pu(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = ve.get(e);
  i && i.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${i.path}
  New:      ${t}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const s = !i || i.path !== t;
    if (!(i && i.loaderSet && !s)) {
      const a = kn(e, t);
      ve.set(e, { path: t, loaderSet: a });
    }
    return;
  }
  ve.set(e, { path: t, loaderSet: !1 }), On || (On = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [s, r] of ve)
        if (!r.loaderSet) {
          const a = kn(s, r.path);
          r.loaderSet = a;
        }
    },
    { once: !0 }
  ));
}
function Mu(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: s }) => {
    const r = i.find((h) => h.startsWith("bp-")), a = r ? parseInt(r.slice(3), 10) : 768, o = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < a, f = (h) => {
      t.dataset.mobile = h ? "true" : "false", t.dataset.screen = h ? "mobile" : "desktop";
    }, m = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, b = (h) => {
      if (!o) return;
      const p = m();
      p && (p[n] = h);
    }, I = (h) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: h, width: window.innerWidth, breakpoint: a }
        })
      );
    }, y = window.matchMedia(`(max-width: ${a - 1}px)`), u = () => {
      const h = l();
      f(h), b(h), I(h);
    };
    u();
    const d = () => u(), c = () => u();
    y.addEventListener("change", d), window.addEventListener("resize", c, { passive: !0 }), s(() => {
      y.removeEventListener("change", d), window.removeEventListener("resize", c);
    });
  });
}
function Ru(e) {
  const t = (i, { expression: n, modifiers: s }, { cleanup: r, effect: a }) => {
    if (!n || typeof n != "string") return;
    const o = (d, c, h) => {
      const v = c.replace(/\[(\d+)\]/g, ".$1").split("."), w = v.pop();
      let E = d;
      for (const g of v)
        (E[g] == null || typeof E[g] != "object") && (E[g] = isFinite(+g) ? [] : {}), E = E[g];
      E[w] = h;
    }, l = e.closestDataStack(i) || [], f = l[0] || null, m = l[1] || null;
    if (!f || !m) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const b = n.split(",").map((d) => d.trim()).filter(Boolean).map((d) => {
      const c = d.split("->").map((h) => h.trim());
      return c.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', d), null) : { parentPath: c[0], childPath: c[1] };
    }).filter(Boolean), I = s.includes("init-child") || s.includes("child") || s.includes("childWins"), y = b.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: I
      // avoid redundant first child->parent write
    })), u = [];
    b.forEach((d, c) => {
      const h = y[c];
      if (I) {
        const w = e.evaluate(i, d.childPath, { scope: f });
        h.fromChild = !0, o(m, d.parentPath, w), queueMicrotask(() => {
          h.fromChild = !1;
        });
      } else {
        const w = e.evaluate(i, d.parentPath, { scope: m });
        h.fromParent = !0, o(f, d.childPath, w), queueMicrotask(() => {
          h.fromParent = !1;
        });
      }
      const p = a(() => {
        const w = e.evaluate(i, d.parentPath, { scope: m });
        h.fromChild || (h.fromParent = !0, o(f, d.childPath, w), queueMicrotask(() => {
          h.fromParent = !1;
        }));
      }), v = a(() => {
        const w = e.evaluate(i, d.childPath, { scope: f });
        if (!h.fromParent) {
          if (h.skipChildOnce) {
            h.skipChildOnce = !1;
            return;
          }
          h.fromChild = !0, o(m, d.parentPath, w), queueMicrotask(() => {
            h.fromChild = !1;
          });
        }
      });
      u.push(p, v);
    }), r(() => {
      for (const d of u)
        try {
          d && d();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class Fu {
  constructor() {
    this.storageKey = "darkMode", this.eventName = "rz:theme-change", this.darkClass = "dark", this._mode = "auto", this._mq = null, this._initialized = !1, this._onMqChange = null, this._onStorage = null, this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
  }
  init() {
    if (this._initialized || typeof window > "u") return;
    this._initialized = !0, this._mq = typeof window.matchMedia == "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const t = this._safeReadStorage(this.storageKey);
    this._mode = this._normalizeMode(t ?? "auto"), this._sync(), this._onMqChange = () => {
      this._sync();
    }, this._mq && (typeof this._mq.addEventListener == "function" ? this._mq.addEventListener("change", this._onMqChange) : typeof this._mq.addListener == "function" && this._mq.addListener(this._onMqChange)), this._onStorage = (i) => {
      if (i.key !== this.storageKey) return;
      const n = this._normalizeMode(i.newValue ?? "auto");
      n !== this._mode && (this._mode = n, this._sync());
    }, window.addEventListener("storage", this._onStorage);
  }
  destroy() {
    this._initialized && (this._initialized = !1, this._mq && this._onMqChange && (typeof this._mq.removeEventListener == "function" ? this._mq.removeEventListener("change", this._onMqChange) : typeof this._mq.removeListener == "function" && this._mq.removeListener(this._onMqChange)), typeof window < "u" && this._onStorage && window.removeEventListener("storage", this._onStorage), this._onMqChange = null, this._onStorage = null, this._mq = null, this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null });
  }
  // ----- Public State Accessors -----
  get mode() {
    return this._mode;
  }
  get prefersDark() {
    return !!this._mq?.matches;
  }
  get effectiveDark() {
    return this._mode === "dark" || this._mode === "auto" && this.prefersDark;
  }
  // ----- Public API Surface -----
  isDark() {
    return this.effectiveDark;
  }
  isLight() {
    return !this.effectiveDark;
  }
  setLight() {
    this._setMode("light");
  }
  setDark() {
    this._setMode("dark");
  }
  setAuto() {
    this._setMode("auto");
  }
  toggle() {
    const t = this.effectiveDark;
    this._setMode(t ? "light" : "dark");
  }
  // ----- Internals -----
  _setMode(t) {
    this._mode = this._normalizeMode(t), this._persist(), this._sync();
  }
  _normalizeMode(t) {
    return t === "light" || t === "dark" || t === "auto" ? t : "auto";
  }
  _safeReadStorage(t) {
    try {
      return window?.localStorage?.getItem(t);
    } catch {
      return null;
    }
  }
  _persist() {
    try {
      window?.localStorage?.setItem(this.storageKey, this._mode);
    } catch {
    }
  }
  _sync() {
    const t = this.effectiveDark, i = this._mode, n = this.prefersDark, s = typeof document < "u" ? document.documentElement : null, r = s ? s.classList.contains(this.darkClass) === t && s.style.colorScheme === (t ? "dark" : "light") : !0;
    this._lastSnapshot.mode === i && this._lastSnapshot.effectiveDark === t && this._lastSnapshot.prefersDark === n && r || (this._lastSnapshot = { mode: i, effectiveDark: t, prefersDark: n }, s && (s.classList.toggle(this.darkClass, t), s.style.colorScheme = t ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(this.eventName, {
        detail: {
          mode: i,
          darkMode: t,
          // External API uses 'darkMode' convention
          prefersDark: n,
          source: "RizzyUI"
        }
      })
    ));
  }
}
const U = new Fu();
function zu(e) {
  U.init(), e.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: U.mode,
    _prefersDark: U.prefersDark,
    _effectiveDark: U.effectiveDark,
    // Listener reference to prevent duplicate registration
    _onThemeChange: null,
    init() {
      this._onThemeChange || (this._onThemeChange = () => this._refresh(), window.addEventListener(U.eventName, this._onThemeChange)), this._refresh();
    },
    _refresh() {
      this._mode = U.mode, this._prefersDark = U.prefersDark, this._effectiveDark = U.effectiveDark;
    },
    // ----- Reactive Getters -----
    // These return the reactive properties from the store, ensuring Alpine
    // properly tracks dependencies.
    get mode() {
      return this._mode;
    },
    get effectiveDark() {
      return this._effectiveDark;
    },
    get prefersDark() {
      return this._prefersDark;
    },
    // Expose as getters (not methods) for consistency
    get isDark() {
      return this._effectiveDark;
    },
    get isLight() {
      return !this._effectiveDark;
    },
    // ----- Proxy Methods -----
    setLight() {
      U.setLight();
    },
    setDark() {
      U.setDark();
    },
    setAuto() {
      U.setAuto();
    },
    toggle() {
      U.toggle();
    }
  });
}
let Jt = null;
function Vu(e) {
  if (Jt) return Jt;
  e.plugin(Ko), e.plugin(Qo), e.plugin(wl), e.plugin($l), typeof document < "u" && document.addEventListener("alpine:init", () => {
    zu(e);
  }), Du(e), Mu(e), Ru(e);
  const t = new kl.ValidationService();
  return t.bootstrap({ watch: !0 }), Jt = {
    Alpine: e,
    require: J,
    toast: ql,
    validation: t,
    $data: Kl,
    props: Nu,
    registerAsyncComponent: Pu,
    theme: U
  }, typeof window < "u" && (U.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...Jt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Jt;
}
const Uu = Vu(Js);
Js.start();
export {
  Uu as default
};
