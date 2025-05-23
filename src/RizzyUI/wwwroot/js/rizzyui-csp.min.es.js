var lt = !1, ut = !1, Z = [], dt = -1;
function Gr(e) {
  Zr(e);
}
function Zr(e) {
  Z.includes(e) || Z.push(e), Xr();
}
function Jr(e) {
  let t = Z.indexOf(e);
  t !== -1 && t > dt && Z.splice(t, 1);
}
function Xr() {
  !ut && !lt && (lt = !0, queueMicrotask(Qr));
}
function Qr() {
  lt = !1, ut = !0;
  for (let e = 0; e < Z.length; e++)
    Z[e](), dt = e;
  Z.length = 0, dt = -1, ut = !1;
}
var ae, re, oe, xn, ft = !0;
function ei(e) {
  ft = !1, e(), ft = !0;
}
function ti(e) {
  ae = e.reactive, oe = e.release, re = (t) => e.effect(t, { scheduler: (n) => {
    ft ? Gr(n) : n();
  } }), xn = e.raw;
}
function Zt(e) {
  re = e;
}
function ni(e) {
  let t = () => {
  };
  return [(r) => {
    let i = re(r);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(i), t = () => {
      i !== void 0 && (e._x_effects.delete(i), oe(i));
    }, i;
  }, () => {
    t();
  }];
}
function En(e, t) {
  let n = !0, r, i = re(() => {
    let s = e();
    JSON.stringify(s), n ? r = s : queueMicrotask(() => {
      t(s, r), r = s;
    }), n = !1;
  });
  return () => oe(i);
}
var Sn = [], Cn = [], In = [];
function ri(e) {
  In.push(e);
}
function At(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Cn.push(t));
}
function Tn(e) {
  Sn.push(e);
}
function On(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function An(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, r]) => {
    (t === void 0 || t.includes(n)) && (r.forEach((i) => i()), delete e._x_attributeCleanups[n]);
  });
}
function ii(e) {
  for (e._x_effects?.forEach(Jr); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var Nt = new MutationObserver($t), Rt = !1;
function kt() {
  Nt.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Rt = !0;
}
function Nn() {
  si(), Nt.disconnect(), Rt = !1;
}
var he = [];
function si() {
  let e = Nt.takeRecords();
  he.push(() => e.length > 0 && $t(e));
  let t = he.length;
  queueMicrotask(() => {
    if (he.length === t)
      for (; he.length > 0; )
        he.shift()();
  });
}
function C(e) {
  if (!Rt)
    return e();
  Nn();
  let t = e();
  return kt(), t;
}
var Lt = !1, je = [];
function ai() {
  Lt = !0;
}
function oi() {
  Lt = !1, $t(je), je = [];
}
function $t(e) {
  if (Lt) {
    je = je.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let s = 0; s < e.length; s++)
    if (!e[s].target._x_ignoreMutationObserver && (e[s].type === "childList" && (e[s].removedNodes.forEach((a) => {
      a.nodeType === 1 && a._x_marker && n.add(a);
    }), e[s].addedNodes.forEach((a) => {
      if (a.nodeType === 1) {
        if (n.has(a)) {
          n.delete(a);
          return;
        }
        a._x_marker || t.push(a);
      }
    })), e[s].type === "attributes")) {
      let a = e[s].target, o = e[s].attributeName, c = e[s].oldValue, l = () => {
        r.has(a) || r.set(a, []), r.get(a).push({ name: o, value: a.getAttribute(o) });
      }, u = () => {
        i.has(a) || i.set(a, []), i.get(a).push(o);
      };
      a.hasAttribute(o) && c === null ? l() : a.hasAttribute(o) ? (u(), l()) : u();
    }
  i.forEach((s, a) => {
    An(a, s);
  }), r.forEach((s, a) => {
    Sn.forEach((o) => o(a, s));
  });
  for (let s of n)
    t.some((a) => a.contains(s)) || Cn.forEach((a) => a(s));
  for (let s of t)
    s.isConnected && In.forEach((a) => a(s));
  t = null, n = null, r = null, i = null;
}
function Rn(e) {
  return ce(ee(e));
}
function Te(e, t, n) {
  return e._x_dataStack = [t, ...ee(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((r) => r !== t);
  };
}
function ee(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? ee(e.host) : e.parentNode ? ee(e.parentNode) : [];
}
function ce(e) {
  return new Proxy({ objects: e }, ci);
}
var ci = {
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
    return t == "toJSON" ? li : Reflect.get(
      e.find(
        (r) => Reflect.has(r, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, r) {
    const i = e.find(
      (a) => Object.prototype.hasOwnProperty.call(a, t)
    ) || e[e.length - 1], s = Object.getOwnPropertyDescriptor(i, t);
    return s?.set && s?.get ? s.set.call(r, n) || !0 : Reflect.set(i, t, n);
  }
};
function li() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function kn(e) {
  let t = (r) => typeof r == "object" && !Array.isArray(r) && r !== null, n = (r, i = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(r)).forEach(([s, { value: a, enumerable: o }]) => {
      if (o === !1 || a === void 0 || typeof a == "object" && a !== null && a.__v_skip)
        return;
      let c = i === "" ? s : `${i}.${s}`;
      typeof a == "object" && a !== null && a._x_interceptor ? r[s] = a.initialize(e, c, s) : t(a) && a !== r && !(a instanceof Element) && n(a, c);
    });
  };
  return n(e);
}
function Ln(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, s) {
      return e(this.initialValue, () => ui(r, i), (a) => ht(r, i, a), i, s);
    }
  };
  return t(n), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (s, a, o) => {
        let c = r.initialize(s, a, o);
        return n.initialValue = c, i(s, a, o);
      };
    } else
      n.initialValue = r;
    return n;
  };
}
function ui(e, t) {
  return t.split(".").reduce((n, r) => n[r], e);
}
function ht(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), ht(e[t[0]], t.slice(1), n);
  }
}
var $n = {};
function D(e, t) {
  $n[e] = t;
}
function We(e, t) {
  let n = di(t);
  return Object.entries($n).forEach(([r, i]) => {
    Object.defineProperty(e, `$${r}`, {
      get() {
        return i(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function di(e) {
  let [t, n] = jn(e), r = { interceptor: Ln, ...t };
  return At(e, n), r;
}
function Fn(e, t, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    Ee(i, e, t);
  }
}
function Ee(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var De = !0;
function Mn(e) {
  let t = De;
  De = !1;
  let n = e();
  return De = t, n;
}
function J(e, t, n = {}) {
  let r;
  return R(e, t)((i) => r = i, n), r;
}
function R(...e) {
  return Dn(...e);
}
var Dn = hi;
function fi(e) {
  Dn = e;
}
function hi(e, t) {
  let n = {};
  We(n, e);
  let r = [n, ...ee(e)], i = typeof t == "function" ? Pn(r, t) : gi(r, t, e);
  return Fn.bind(null, e, t, i);
}
function Pn(e, t) {
  return (n = () => {
  }, { scope: r = {}, params: i = [] } = {}) => {
    let s = t.apply(ce([r, ...e]), i);
    Se(n, s);
  };
}
var rt = {};
function pi(e, t) {
  if (rt[e])
    return rt[e];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, r = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, s = (() => {
    try {
      let a = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${e}`
      }), a;
    } catch (a) {
      return Ee(a, t, e), Promise.resolve();
    }
  })();
  return rt[e] = s, s;
}
function gi(e, t, n) {
  let r = pi(t, n);
  return (i = () => {
  }, { scope: s = {}, params: a = [] } = {}) => {
    r.result = void 0, r.finished = !1;
    let o = ce([s, ...e]);
    if (typeof r == "function") {
      let c = r(r, o).catch((l) => Ee(l, n, t));
      r.finished ? (Se(i, r.result, o, a, n), r.result = void 0) : c.then((l) => {
        Se(i, l, o, a, n);
      }).catch((l) => Ee(l, n, t)).finally(() => r.result = void 0);
    }
  };
}
function Se(e, t, n, r, i) {
  if (De && typeof t == "function") {
    let s = t.apply(n, r);
    s instanceof Promise ? s.then((a) => Se(e, a, n, r)).catch((a) => Ee(a, i, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var Ft = "x-";
function le(e = "") {
  return Ft + e;
}
function vi(e) {
  Ft = e;
}
var He = {};
function O(e, t) {
  return He[e] = t, {
    before(n) {
      if (!He[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const r = G.indexOf(n);
      G.splice(r >= 0 ? r : G.indexOf("DEFAULT"), 0, e);
    }
  };
}
function bi(e) {
  return Object.keys(He).includes(e);
}
function Mt(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), a = zn(s);
    s = s.map((o) => a.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(s);
  }
  let r = {};
  return t.map(Yn((s, a) => r[s] = a)).filter(Vn).map(yi(r, n)).sort(wi).map((s) => _i(e, s));
}
function zn(e) {
  return Array.from(e).map(Yn()).filter((t) => !Vn(t));
}
var pt = !1, ye = /* @__PURE__ */ new Map(), Bn = Symbol();
function mi(e) {
  pt = !0;
  let t = Symbol();
  Bn = t, ye.set(t, []);
  let n = () => {
    for (; ye.get(t).length; )
      ye.get(t).shift()();
    ye.delete(t);
  }, r = () => {
    pt = !1, n();
  };
  e(n), r();
}
function jn(e) {
  let t = [], n = (o) => t.push(o), [r, i] = ni(e);
  return t.push(i), [{
    Alpine: Oe,
    effect: r,
    cleanup: n,
    evaluateLater: R.bind(R, e),
    evaluate: J.bind(J, e)
  }, () => t.forEach((o) => o())];
}
function _i(e, t) {
  let n = () => {
  }, r = He[t.type] || n, [i, s] = jn(e);
  On(e, t.original, s);
  let a = () => {
    e._x_ignore || e._x_ignoreSelf || (r.inline && r.inline(e, t, i), r = r.bind(r, e, t, i), pt ? ye.get(Bn).push(r) : r());
  };
  return a.runCleanups = s, a;
}
var Wn = (e, t) => ({ name: n, value: r }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: r }), Hn = (e) => e;
function Yn(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: r, value: i } = Kn.reduce((s, a) => a(s), { name: t, value: n });
    return r !== t && e(r, t), { name: r, value: i };
  };
}
var Kn = [];
function Dt(e) {
  Kn.push(e);
}
function Vn({ name: e }) {
  return qn().test(e);
}
var qn = () => new RegExp(`^${Ft}([^:^.]+)\\b`);
function yi(e, t) {
  return ({ name: n, value: r }) => {
    let i = n.match(qn()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), a = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: i ? i[1] : null,
      value: s ? s[1] : null,
      modifiers: a.map((c) => c.replace(".", "")),
      expression: r,
      original: o
    };
  };
}
var gt = "DEFAULT", G = [
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
  gt,
  "teleport"
];
function wi(e, t) {
  let n = G.indexOf(e.type) === -1 ? gt : e.type, r = G.indexOf(t.type) === -1 ? gt : t.type;
  return G.indexOf(n) - G.indexOf(r);
}
function we(e, t, n = {}) {
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
function te(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((i) => te(i, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let r = e.firstElementChild;
  for (; r; )
    te(r, t), r = r.nextElementSibling;
}
function L(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Jt = !1;
function xi() {
  Jt && L("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Jt = !0, document.body || L("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), we(document, "alpine:init"), we(document, "alpine:initializing"), kt(), ri((t) => z(t, te)), At((t) => de(t)), Tn((t, n) => {
    Mt(t, n).forEach((r) => r());
  });
  let e = (t) => !Ue(t.parentElement, !0);
  Array.from(document.querySelectorAll(Zn().join(","))).filter(e).forEach((t) => {
    z(t);
  }), we(document, "alpine:initialized"), setTimeout(() => {
    Ii();
  });
}
var Pt = [], Un = [];
function Gn() {
  return Pt.map((e) => e());
}
function Zn() {
  return Pt.concat(Un).map((e) => e());
}
function Jn(e) {
  Pt.push(e);
}
function Xn(e) {
  Un.push(e);
}
function Ue(e, t = !1) {
  return ue(e, (n) => {
    if ((t ? Zn() : Gn()).some((i) => n.matches(i)))
      return !0;
  });
}
function ue(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return ue(e.parentElement, t);
  }
}
function Ei(e) {
  return Gn().some((t) => e.matches(t));
}
var Qn = [];
function Si(e) {
  Qn.push(e);
}
var Ci = 1;
function z(e, t = te, n = () => {
}) {
  ue(e, (r) => r._x_ignore) || mi(() => {
    t(e, (r, i) => {
      r._x_marker || (n(r, i), Qn.forEach((s) => s(r, i)), Mt(r, r.attributes).forEach((s) => s()), r._x_ignore || (r._x_marker = Ci++), r._x_ignore && i());
    });
  });
}
function de(e, t = te) {
  t(e, (n) => {
    ii(n), An(n), delete n._x_marker;
  });
}
function Ii() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, r]) => {
    bi(n) || r.some((i) => {
      if (document.querySelector(i))
        return L(`found "${i}", but missing ${t} plugin`), !0;
    });
  });
}
var vt = [], zt = !1;
function Bt(e = () => {
}) {
  return queueMicrotask(() => {
    zt || setTimeout(() => {
      bt();
    });
  }), new Promise((t) => {
    vt.push(() => {
      e(), t();
    });
  });
}
function bt() {
  for (zt = !1; vt.length; )
    vt.shift()();
}
function Ti() {
  zt = !0;
}
function jt(e, t) {
  return Array.isArray(t) ? Xt(e, t.join(" ")) : typeof t == "object" && t !== null ? Oi(e, t) : typeof t == "function" ? jt(e, t()) : Xt(e, t);
}
function Xt(e, t) {
  let n = (i) => i.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), r = (i) => (e.classList.add(...i), () => {
    e.classList.remove(...i);
  });
  return t = t === !0 ? t = "" : t || "", r(n(t));
}
function Oi(e, t) {
  let n = (o) => o.split(" ").filter(Boolean), r = Object.entries(t).flatMap(([o, c]) => c ? n(o) : !1).filter(Boolean), i = Object.entries(t).flatMap(([o, c]) => c ? !1 : n(o)).filter(Boolean), s = [], a = [];
  return i.forEach((o) => {
    e.classList.contains(o) && (e.classList.remove(o), a.push(o));
  }), r.forEach((o) => {
    e.classList.contains(o) || (e.classList.add(o), s.push(o));
  }), () => {
    a.forEach((o) => e.classList.add(o)), s.forEach((o) => e.classList.remove(o));
  };
}
function Ge(e, t) {
  return typeof t == "object" && t !== null ? Ai(e, t) : Ni(e, t);
}
function Ai(e, t) {
  let n = {};
  return Object.entries(t).forEach(([r, i]) => {
    n[r] = e.style[r], r.startsWith("--") || (r = Ri(r)), e.style.setProperty(r, i);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Ge(e, n);
  };
}
function Ni(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Ri(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function mt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
O("transition", (e, { value: t, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? Li(e, n, t) : ki(e, r, t));
});
function ki(e, t, n) {
  er(e, jt, ""), {
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
function Li(e, t, n) {
  er(e, Ge);
  let r = !t.includes("in") && !t.includes("out") && !n, i = r || t.includes("in") || ["enter"].includes(n), s = r || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !r && (t = t.filter((m, w) => w < t.indexOf("out"))), t.includes("out") && !r && (t = t.filter((m, w) => w > t.indexOf("out")));
  let a = !t.includes("opacity") && !t.includes("scale"), o = a || t.includes("opacity"), c = a || t.includes("scale"), l = o ? 0 : 1, u = c ? pe(t, "scale", 95) / 100 : 1, f = pe(t, "delay", 0) / 1e3, h = pe(t, "origin", "center"), b = "opacity, transform", T = pe(t, "duration", 150) / 1e3, k = pe(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (e._x_transition.enter.during = {
    transformOrigin: h,
    transitionDelay: `${f}s`,
    transitionProperty: b,
    transitionDuration: `${T}s`,
    transitionTimingFunction: g
  }, e._x_transition.enter.start = {
    opacity: l,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: h,
    transitionDelay: `${f}s`,
    transitionProperty: b,
    transitionDuration: `${k}s`,
    transitionTimingFunction: g
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: l,
    transform: `scale(${u})`
  });
}
function er(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(r = () => {
    }, i = () => {
    }) {
      _t(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, i);
    },
    out(r = () => {
    }, i = () => {
    }) {
      _t(e, t, {
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
  e._x_hidePromise = e._x_transition ? new Promise((a, o) => {
    e._x_transition.out(() => {
    }, () => a(r)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(r), queueMicrotask(() => {
    let a = tr(e);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(e)) : i(() => {
      let o = (c) => {
        let l = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(o)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, l;
      };
      o(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function tr(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : tr(t);
}
function _t(e, t, { during: n, start: r, end: i } = {}, s = () => {
}, a = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    s(), a();
    return;
  }
  let o, c, l;
  $i(e, {
    start() {
      o = t(e, r);
    },
    during() {
      c = t(e, n);
    },
    before: s,
    end() {
      o(), l = t(e, i);
    },
    after: a,
    cleanup() {
      c(), l();
    }
  });
}
function $i(e, t) {
  let n, r, i, s = mt(() => {
    C(() => {
      n = !0, r || t.before(), i || (t.end(), bt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: mt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, C(() => {
    t.start(), t.during();
  }), Ti(), requestAnimationFrame(() => {
    if (n)
      return;
    let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), C(() => {
      t.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (C(() => {
        t.end();
      }), bt(), setTimeout(e._x_transitioning.finish, a + o), i = !0);
    });
  });
}
function pe(e, t, n) {
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
var Y = !1;
function V(e, t = () => {
}) {
  return (...n) => Y ? t(...n) : e(...n);
}
function Fi(e) {
  return (...t) => Y && e(...t);
}
var nr = [];
function Ze(e) {
  nr.push(e);
}
function Mi(e, t) {
  nr.forEach((n) => n(e, t)), Y = !0, rr(() => {
    z(t, (n, r) => {
      r(n, () => {
      });
    });
  }), Y = !1;
}
var yt = !1;
function Di(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Y = !0, yt = !0, rr(() => {
    Pi(t);
  }), Y = !1, yt = !1;
}
function Pi(e) {
  let t = !1;
  z(e, (r, i) => {
    te(r, (s, a) => {
      if (t && Ei(s))
        return a();
      t = !0, i(s, a);
    });
  });
}
function rr(e) {
  let t = re;
  Zt((n, r) => {
    let i = t(n);
    return oe(i), () => {
    };
  }), e(), Zt(t);
}
function ir(e, t, n, r = []) {
  switch (e._x_bindings || (e._x_bindings = ae({})), e._x_bindings[t] = n, t = r.includes("camel") ? Vi(t) : t, t) {
    case "value":
      zi(e, n);
      break;
    case "style":
      ji(e, n);
      break;
    case "class":
      Bi(e, n);
      break;
    case "selected":
    case "checked":
      Wi(e, t, n);
      break;
    default:
      sr(e, t, n);
      break;
  }
}
function zi(e, t) {
  if (cr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = Pe(e.value) === t : e.checked = Qt(e.value, t));
  else if (Wt(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Qt(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Ki(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Bi(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = jt(e, t);
}
function ji(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Ge(e, t);
}
function Wi(e, t, n) {
  sr(e, t, n), Yi(e, t, n);
}
function sr(e, t, n) {
  [null, void 0, !1].includes(n) && Ui(t) ? e.removeAttribute(t) : (ar(t) && (n = t), Hi(e, t, n));
}
function Hi(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Yi(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Ki(e, t) {
  const n = [].concat(t).map((r) => r + "");
  Array.from(e.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function Vi(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Qt(e, t) {
  return e == t;
}
function Pe(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var qi = /* @__PURE__ */ new Set([
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
function ar(e) {
  return qi.has(e);
}
function Ui(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Gi(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : or(e, t, n);
}
function Zi(e, t, n, r = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let i = e._x_inlineBindings[t];
    return i.extract = r, Mn(() => J(e, i.expression));
  }
  return or(e, t, n);
}
function or(e, t, n) {
  let r = e.getAttribute(t);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : ar(t) ? !![t, "true"].includes(r) : r;
}
function Wt(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function cr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function lr(e, t) {
  var n;
  return function() {
    var r = this, i = arguments, s = function() {
      n = null, e.apply(r, i);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function ur(e, t) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (e.apply(r, i), n = !0, setTimeout(() => n = !1, t));
  };
}
function dr({ get: e, set: t }, { get: n, set: r }) {
  let i = !0, s, a = re(() => {
    let o = e(), c = n();
    if (i)
      r(it(o)), i = !1;
    else {
      let l = JSON.stringify(o), u = JSON.stringify(c);
      l !== s ? r(it(o)) : l !== u && t(it(c));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    oe(a);
  };
}
function it(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Ji(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Oe));
}
var U = {}, en = !1;
function Xi(e, t) {
  if (en || (U = ae(U), en = !0), t === void 0)
    return U[e];
  U[e] = t, kn(U[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && U[e].init();
}
function Qi() {
  return U;
}
var fr = {};
function es(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? hr(e, n()) : (fr[e] = n, () => {
  });
}
function ts(e) {
  return Object.entries(fr).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...r) => n(...r);
      }
    });
  }), e;
}
function hr(e, t, n) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let i = Object.entries(t).map(([a, o]) => ({ name: a, value: o })), s = zn(i);
  return i = i.map((a) => s.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), Mt(e, i, n).map((a) => {
    r.push(a.runCleanups), a();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var pr = {};
function ns(e, t) {
  pr[e] = t;
}
function rs(e, t) {
  return Object.entries(pr).forEach(([n, r]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...i) => r.bind(t)(...i);
      },
      enumerable: !1
    });
  }), e;
}
var is = {
  get reactive() {
    return ae;
  },
  get release() {
    return oe;
  },
  get effect() {
    return re;
  },
  get raw() {
    return xn;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: oi,
  dontAutoEvaluateFunctions: Mn,
  disableEffectScheduling: ei,
  startObservingMutations: kt,
  stopObservingMutations: Nn,
  setReactivityEngine: ti,
  onAttributeRemoved: On,
  onAttributesAdded: Tn,
  closestDataStack: ee,
  skipDuringClone: V,
  onlyDuringClone: Fi,
  addRootSelector: Jn,
  addInitSelector: Xn,
  interceptClone: Ze,
  addScopeToNode: Te,
  deferMutations: ai,
  mapAttributes: Dt,
  evaluateLater: R,
  interceptInit: Si,
  setEvaluator: fi,
  mergeProxies: ce,
  extractProp: Zi,
  findClosest: ue,
  onElRemoved: At,
  closestRoot: Ue,
  destroyTree: de,
  interceptor: Ln,
  // INTERNAL: not public API and is subject to change without major release.
  transition: _t,
  // INTERNAL
  setStyles: Ge,
  // INTERNAL
  mutateDom: C,
  directive: O,
  entangle: dr,
  throttle: ur,
  debounce: lr,
  evaluate: J,
  initTree: z,
  nextTick: Bt,
  prefixed: le,
  prefix: vi,
  plugin: Ji,
  magic: D,
  store: Xi,
  start: xi,
  clone: Di,
  // INTERNAL
  cloneNode: Mi,
  // INTERNAL
  bound: Gi,
  $data: Rn,
  watch: En,
  walk: te,
  data: ns,
  bind: es
}, Oe = is;
function ss(e, t) {
  let n = as(e);
  if (typeof t == "function")
    return Pn(n, t);
  let r = os(e, t, n);
  return Fn.bind(null, e, t, r);
}
function as(e) {
  let t = {};
  return We(t, e), [t, ...ee(e)];
}
function os(e, t, n) {
  return (r = () => {
  }, { scope: i = {}, params: s = [] } = {}) => {
    let a = ce([i, ...n]), o = t.split(".").reduce(
      (c, l) => (c[l] === void 0 && cs(e, t), c[l]),
      a
    );
    Se(r, o, a, s);
  };
}
function cs(e, t) {
  console.warn(
    `Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${t}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
    e
  );
}
function ls(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = e.split(",");
  for (let i = 0; i < r.length; i++)
    n[r[i]] = !0;
  return (i) => !!n[i];
}
var us = Object.freeze({}), ds = Object.prototype.hasOwnProperty, Je = (e, t) => ds.call(e, t), X = Array.isArray, xe = (e) => gr(e) === "[object Map]", fs = (e) => typeof e == "string", Ht = (e) => typeof e == "symbol", Xe = (e) => e !== null && typeof e == "object", hs = Object.prototype.toString, gr = (e) => hs.call(e), vr = (e) => gr(e).slice(8, -1), Yt = (e) => fs(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ps = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, gs = ps((e) => e.charAt(0).toUpperCase() + e.slice(1)), br = (e, t) => e !== t && (e === e || t === t), wt = /* @__PURE__ */ new WeakMap(), ge = [], P, Q = Symbol("iterate"), xt = Symbol("Map key iterate");
function vs(e) {
  return e && e._isEffect === !0;
}
function bs(e, t = us) {
  vs(e) && (e = e.raw);
  const n = ys(e, t);
  return t.lazy || n(), n;
}
function ms(e) {
  e.active && (mr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var _s = 0;
function ys(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!ge.includes(n)) {
      mr(n);
      try {
        return xs(), ge.push(n), P = n, e();
      } finally {
        ge.pop(), _r(), P = ge[ge.length - 1];
      }
    }
  };
  return n.id = _s++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function mr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var se = !0, Kt = [];
function ws() {
  Kt.push(se), se = !1;
}
function xs() {
  Kt.push(se), se = !0;
}
function _r() {
  const e = Kt.pop();
  se = e === void 0 ? !0 : e;
}
function M(e, t, n) {
  if (!se || P === void 0)
    return;
  let r = wt.get(e);
  r || wt.set(e, r = /* @__PURE__ */ new Map());
  let i = r.get(n);
  i || r.set(n, i = /* @__PURE__ */ new Set()), i.has(P) || (i.add(P), P.deps.push(i), P.options.onTrack && P.options.onTrack({
    effect: P,
    target: e,
    type: t,
    key: n
  }));
}
function K(e, t, n, r, i, s) {
  const a = wt.get(e);
  if (!a)
    return;
  const o = /* @__PURE__ */ new Set(), c = (u) => {
    u && u.forEach((f) => {
      (f !== P || f.allowRecurse) && o.add(f);
    });
  };
  if (t === "clear")
    a.forEach(c);
  else if (n === "length" && X(e))
    a.forEach((u, f) => {
      (f === "length" || f >= r) && c(u);
    });
  else
    switch (n !== void 0 && c(a.get(n)), t) {
      case "add":
        X(e) ? Yt(n) && c(a.get("length")) : (c(a.get(Q)), xe(e) && c(a.get(xt)));
        break;
      case "delete":
        X(e) || (c(a.get(Q)), xe(e) && c(a.get(xt)));
        break;
      case "set":
        xe(e) && c(a.get(Q));
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
  o.forEach(l);
}
var Es = /* @__PURE__ */ ls("__proto__,__v_isRef,__isVue"), yr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Ht)), Ss = /* @__PURE__ */ wr(), Cs = /* @__PURE__ */ wr(!0), tn = /* @__PURE__ */ Is();
function Is() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const r = x(this);
      for (let s = 0, a = this.length; s < a; s++)
        M(r, "get", s + "");
      const i = r[t](...n);
      return i === -1 || i === !1 ? r[t](...n.map(x)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      ws();
      const r = x(this)[t].apply(this, n);
      return _r(), r;
    };
  }), e;
}
function wr(e = !1, t = !1) {
  return function(r, i, s) {
    if (i === "__v_isReactive")
      return !e;
    if (i === "__v_isReadonly")
      return e;
    if (i === "__v_raw" && s === (e ? t ? Bs : Cr : t ? zs : Sr).get(r))
      return r;
    const a = X(r);
    if (!e && a && Je(tn, i))
      return Reflect.get(tn, i, s);
    const o = Reflect.get(r, i, s);
    return (Ht(i) ? yr.has(i) : Es(i)) || (e || M(r, "get", i), t) ? o : Et(o) ? !a || !Yt(i) ? o.value : o : Xe(o) ? e ? Ir(o) : Gt(o) : o;
  };
}
var Ts = /* @__PURE__ */ Os();
function Os(e = !1) {
  return function(n, r, i, s) {
    let a = n[r];
    if (!e && (i = x(i), a = x(a), !X(n) && Et(a) && !Et(i)))
      return a.value = i, !0;
    const o = X(n) && Yt(r) ? Number(r) < n.length : Je(n, r), c = Reflect.set(n, r, i, s);
    return n === x(s) && (o ? br(i, a) && K(n, "set", r, i, a) : K(n, "add", r, i)), c;
  };
}
function As(e, t) {
  const n = Je(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
  return i && n && K(e, "delete", t, void 0, r), i;
}
function Ns(e, t) {
  const n = Reflect.has(e, t);
  return (!Ht(t) || !yr.has(t)) && M(e, "has", t), n;
}
function Rs(e) {
  return M(e, "iterate", X(e) ? "length" : Q), Reflect.ownKeys(e);
}
var ks = {
  get: Ss,
  set: Ts,
  deleteProperty: As,
  has: Ns,
  ownKeys: Rs
}, Ls = {
  get: Cs,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Vt = (e) => Xe(e) ? Gt(e) : e, qt = (e) => Xe(e) ? Ir(e) : e, Ut = (e) => e, Qe = (e) => Reflect.getPrototypeOf(e);
function Ne(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const i = x(e), s = x(t);
  t !== s && !n && M(i, "get", t), !n && M(i, "get", s);
  const { has: a } = Qe(i), o = r ? Ut : n ? qt : Vt;
  if (a.call(i, t))
    return o(e.get(t));
  if (a.call(i, s))
    return o(e.get(s));
  e !== i && e.get(t);
}
function Re(e, t = !1) {
  const n = this.__v_raw, r = x(n), i = x(e);
  return e !== i && !t && M(r, "has", e), !t && M(r, "has", i), e === i ? n.has(e) : n.has(e) || n.has(i);
}
function ke(e, t = !1) {
  return e = e.__v_raw, !t && M(x(e), "iterate", Q), Reflect.get(e, "size", e);
}
function nn(e) {
  e = x(e);
  const t = x(this);
  return Qe(t).has.call(t, e) || (t.add(e), K(t, "add", e, e)), this;
}
function rn(e, t) {
  t = x(t);
  const n = x(this), { has: r, get: i } = Qe(n);
  let s = r.call(n, e);
  s ? Er(n, r, e) : (e = x(e), s = r.call(n, e));
  const a = i.call(n, e);
  return n.set(e, t), s ? br(t, a) && K(n, "set", e, t, a) : K(n, "add", e, t), this;
}
function sn(e) {
  const t = x(this), { has: n, get: r } = Qe(t);
  let i = n.call(t, e);
  i ? Er(t, n, e) : (e = x(e), i = n.call(t, e));
  const s = r ? r.call(t, e) : void 0, a = t.delete(e);
  return i && K(t, "delete", e, void 0, s), a;
}
function an() {
  const e = x(this), t = e.size !== 0, n = xe(e) ? new Map(e) : new Set(e), r = e.clear();
  return t && K(e, "clear", void 0, void 0, n), r;
}
function Le(e, t) {
  return function(r, i) {
    const s = this, a = s.__v_raw, o = x(a), c = t ? Ut : e ? qt : Vt;
    return !e && M(o, "iterate", Q), a.forEach((l, u) => r.call(i, c(l), c(u), s));
  };
}
function $e(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, s = x(i), a = xe(s), o = e === "entries" || e === Symbol.iterator && a, c = e === "keys" && a, l = i[e](...r), u = n ? Ut : t ? qt : Vt;
    return !t && M(s, "iterate", c ? xt : Q), {
      // iterator protocol
      next() {
        const { value: f, done: h } = l.next();
        return h ? { value: f, done: h } : {
          value: o ? [u(f[0]), u(f[1])] : u(f),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function j(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${gs(e)} operation ${n}failed: target is readonly.`, x(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function $s() {
  const e = {
    get(s) {
      return Ne(this, s);
    },
    get size() {
      return ke(this);
    },
    has: Re,
    add: nn,
    set: rn,
    delete: sn,
    clear: an,
    forEach: Le(!1, !1)
  }, t = {
    get(s) {
      return Ne(this, s, !1, !0);
    },
    get size() {
      return ke(this);
    },
    has: Re,
    add: nn,
    set: rn,
    delete: sn,
    clear: an,
    forEach: Le(!1, !0)
  }, n = {
    get(s) {
      return Ne(this, s, !0);
    },
    get size() {
      return ke(this, !0);
    },
    has(s) {
      return Re.call(this, s, !0);
    },
    add: j(
      "add"
      /* ADD */
    ),
    set: j(
      "set"
      /* SET */
    ),
    delete: j(
      "delete"
      /* DELETE */
    ),
    clear: j(
      "clear"
      /* CLEAR */
    ),
    forEach: Le(!0, !1)
  }, r = {
    get(s) {
      return Ne(this, s, !0, !0);
    },
    get size() {
      return ke(this, !0);
    },
    has(s) {
      return Re.call(this, s, !0);
    },
    add: j(
      "add"
      /* ADD */
    ),
    set: j(
      "set"
      /* SET */
    ),
    delete: j(
      "delete"
      /* DELETE */
    ),
    clear: j(
      "clear"
      /* CLEAR */
    ),
    forEach: Le(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = $e(s, !1, !1), n[s] = $e(s, !0, !1), t[s] = $e(s, !1, !0), r[s] = $e(s, !0, !0);
  }), [
    e,
    n,
    t,
    r
  ];
}
var [Fs, Ms, xo, Eo] = /* @__PURE__ */ $s();
function xr(e, t) {
  const n = e ? Ms : Fs;
  return (r, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(Je(n, i) && i in r ? n : r, i, s);
}
var Ds = {
  get: /* @__PURE__ */ xr(!1)
}, Ps = {
  get: /* @__PURE__ */ xr(!0)
};
function Er(e, t, n) {
  const r = x(n);
  if (r !== n && t.call(e, r)) {
    const i = vr(e);
    console.warn(`Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Sr = /* @__PURE__ */ new WeakMap(), zs = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), Bs = /* @__PURE__ */ new WeakMap();
function js(e) {
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
function Ws(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : js(vr(e));
}
function Gt(e) {
  return e && e.__v_isReadonly ? e : Tr(e, !1, ks, Ds, Sr);
}
function Ir(e) {
  return Tr(e, !0, Ls, Ps, Cr);
}
function Tr(e, t, n, r, i) {
  if (!Xe(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = i.get(e);
  if (s)
    return s;
  const a = Ws(e);
  if (a === 0)
    return e;
  const o = new Proxy(e, a === 2 ? r : n);
  return i.set(e, o), o;
}
function x(e) {
  return e && x(e.__v_raw) || e;
}
function Et(e) {
  return !!(e && e.__v_isRef === !0);
}
D("nextTick", () => Bt);
D("dispatch", (e) => we.bind(we, e));
D("watch", (e, { evaluateLater: t, cleanup: n }) => (r, i) => {
  let s = t(r), o = En(() => {
    let c;
    return s((l) => c = l), c;
  }, i);
  n(o);
});
D("store", Qi);
D("data", (e) => Rn(e));
D("root", (e) => Ue(e));
D("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = ce(Hs(e))), e._x_refs_proxy));
function Hs(e) {
  let t = [];
  return ue(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var st = {};
function Or(e) {
  return st[e] || (st[e] = 0), ++st[e];
}
function Ys(e, t) {
  return ue(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Ks(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Or(t));
}
D("id", (e, { cleanup: t }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return Vs(e, i, t, () => {
    let s = Ys(e, n), a = s ? s._x_ids[n] : Or(n);
    return r ? `${n}-${a}-${r}` : `${n}-${a}`;
  });
});
Ze((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Vs(e, t, n, r) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let i = r();
  return e._x_id[t] = i, n(() => {
    delete e._x_id[t];
  }), i;
}
D("el", (e) => e);
Ar("Focus", "focus", "focus");
Ar("Persist", "persist", "persist");
function Ar(e, t, n) {
  D(t, (r) => L(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
O("modelable", (e, { expression: t }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let s = r(t), a = () => {
    let u;
    return s((f) => u = f), u;
  }, o = r(`${t} = __placeholder`), c = (u) => o(() => {
  }, { scope: { __placeholder: u } }), l = a();
  c(l), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, f = e._x_model.set, h = dr(
      {
        get() {
          return u();
        },
        set(b) {
          f(b);
        }
      },
      {
        get() {
          return a();
        },
        set(b) {
          c(b);
        }
      }
    );
    i(h);
  });
});
O("teleport", (e, { modifiers: t, expression: n }, { cleanup: r }) => {
  e.tagName.toLowerCase() !== "template" && L("x-teleport can only be used on a <template> tag", e);
  let i = on(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    s.addEventListener(o, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), Te(s, {}, e);
  let a = (o, c, l) => {
    l.includes("prepend") ? c.parentNode.insertBefore(o, c) : l.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  C(() => {
    a(s, i, t), V(() => {
      z(s);
    })();
  }), e._x_teleportPutBack = () => {
    let o = on(n);
    C(() => {
      a(e._x_teleport, o, t);
    });
  }, r(
    () => C(() => {
      s.remove(), de(s);
    })
  );
});
var qs = document.createElement("div");
function on(e) {
  let t = V(() => document.querySelector(e), () => qs)();
  return t || L(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Nr = () => {
};
Nr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
O("ignore", Nr);
O("effect", V((e, { expression: t }, { effect: n }) => {
  n(R(e, t));
}));
function St(e, t, n, r) {
  let i = e, s = (c) => r(c), a = {}, o = (c, l) => (u) => l(c, u);
  if (n.includes("dot") && (t = Us(t)), n.includes("camel") && (t = Gs(t)), n.includes("passive") && (a.passive = !0), n.includes("capture") && (a.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("debounce")) {
    let c = n[n.indexOf("debounce") + 1] || "invalid-wait", l = Ye(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    s = lr(s, l);
  }
  if (n.includes("throttle")) {
    let c = n[n.indexOf("throttle") + 1] || "invalid-wait", l = Ye(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    s = ur(s, l);
  }
  return n.includes("prevent") && (s = o(s, (c, l) => {
    l.preventDefault(), c(l);
  })), n.includes("stop") && (s = o(s, (c, l) => {
    l.stopPropagation(), c(l);
  })), n.includes("once") && (s = o(s, (c, l) => {
    c(l), i.removeEventListener(t, s, a);
  })), (n.includes("away") || n.includes("outside")) && (i = document, s = o(s, (c, l) => {
    e.contains(l.target) || l.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(l));
  })), n.includes("self") && (s = o(s, (c, l) => {
    l.target === e && c(l);
  })), (Js(t) || Rr(t)) && (s = o(s, (c, l) => {
    Xs(l, n) || c(l);
  })), i.addEventListener(t, s, a), () => {
    i.removeEventListener(t, s, a);
  };
}
function Us(e) {
  return e.replace(/-/g, ".");
}
function Gs(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Ye(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Zs(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Js(e) {
  return ["keydown", "keyup"].includes(e);
}
function Rr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Xs(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, Ye((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, Ye((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && cn(e.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !i.includes(s)), !(i.length > 0 && i.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), e[`${a}Key`])).length === i.length && (Rr(e.type) || cn(e.key).includes(n[0])));
}
function cn(e) {
  if (!e)
    return [];
  e = Zs(e);
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
O("model", (e, { modifiers: t, expression: n }, { effect: r, cleanup: i }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let a = R(s, n), o;
  typeof n == "string" ? o = R(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = R(s, `${n()} = __placeholder`) : o = () => {
  };
  let c = () => {
    let h;
    return a((b) => h = b), ln(h) ? h.get() : h;
  }, l = (h) => {
    let b;
    a((T) => b = T), ln(b) ? b.set(h) : o(() => {
    }, {
      scope: { __placeholder: h }
    });
  };
  typeof n == "string" && e.type === "radio" && C(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  var u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input";
  let f = Y ? () => {
  } : St(e, u, t, (h) => {
    l(at(e, t, h, c()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || Wt(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && l(
    at(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = f, i(() => e._x_removeModelListeners.default()), e.form) {
    let h = St(e.form, "reset", [], (b) => {
      Bt(() => e._x_model && e._x_model.set(at(e, t, { target: e }, c())));
    });
    i(() => h());
  }
  e._x_model = {
    get() {
      return c();
    },
    set(h) {
      l(h);
    }
  }, e._x_forceModelUpdate = (h) => {
    h === void 0 && typeof n == "string" && n.match(/\./) && (h = ""), window.fromModel = !0, C(() => ir(e, "value", h)), delete window.fromModel;
  }, r(() => {
    let h = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(h);
  });
});
function at(e, t, n, r) {
  return C(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Wt(e))
      if (Array.isArray(r)) {
        let i = null;
        return t.includes("number") ? i = ot(n.target.value) : t.includes("boolean") ? i = Pe(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((s) => !Qs(s, i));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let s = i.value || i.text;
          return ot(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let s = i.value || i.text;
          return Pe(s);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return cr(e) ? n.target.checked ? i = n.target.value : i = r : i = n.target.value, t.includes("number") ? ot(i) : t.includes("boolean") ? Pe(i) : t.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function ot(e) {
  let t = e ? parseFloat(e) : null;
  return ea(t) ? t : e;
}
function Qs(e, t) {
  return e == t;
}
function ea(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ln(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
O("cloak", (e) => queueMicrotask(() => C(() => e.removeAttribute(le("cloak")))));
Xn(() => `[${le("init")}]`);
O("init", V((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
O("text", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
  let i = r(t);
  n(() => {
    i((s) => {
      C(() => {
        e.textContent = s;
      });
    });
  });
});
O("html", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
  let i = r(t);
  n(() => {
    i((s) => {
      C(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, z(e), delete e._x_ignoreSelf;
      });
    });
  });
});
Dt(Wn(":", Hn(le("bind:"))));
var kr = (e, { value: t, modifiers: n, expression: r, original: i }, { effect: s, cleanup: a }) => {
  if (!t) {
    let c = {};
    ts(c), R(e, r)((u) => {
      hr(e, u, i);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return ta(e, r);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = R(e, r);
  s(() => o((c) => {
    c === void 0 && typeof r == "string" && r.match(/\./) && (c = ""), C(() => ir(e, t, c, n));
  })), a(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
kr.inline = (e, { value: t, modifiers: n, expression: r }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: r, extract: !1 });
};
O("bind", kr);
function ta(e, t) {
  e._x_keyExpression = t;
}
Jn(() => `[${le("data")}]`);
O("data", (e, { expression: t }, { cleanup: n }) => {
  if (na(e))
    return;
  t = t === "" ? "{}" : t;
  let r = {};
  We(r, e);
  let i = {};
  rs(i, r);
  let s = J(e, t, { scope: i });
  (s === void 0 || s === !0) && (s = {}), We(s, e);
  let a = ae(s);
  kn(a);
  let o = Te(e, a);
  a.init && J(e, a.init), n(() => {
    a.destroy && J(e, a.destroy), o();
  });
});
Ze((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function na(e) {
  return Y ? yt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
O("show", (e, { modifiers: t, expression: n }, { effect: r }) => {
  let i = R(e, n);
  e._x_doHide || (e._x_doHide = () => {
    C(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    C(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let s = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, a = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(a), c = mt(
    (f) => f ? a() : s(),
    (f) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, f, a, s) : f ? o() : s();
    }
  ), l, u = !0;
  r(() => i((f) => {
    !u && f === l || (t.includes("immediate") && (f ? o() : s()), c(f), l = f, u = !1);
  }));
});
O("for", (e, { expression: t }, { effect: n, cleanup: r }) => {
  let i = ia(t), s = R(e, i.items), a = R(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => ra(e, i, s, a)), r(() => {
    Object.values(e._x_lookup).forEach((o) => C(
      () => {
        de(o), o.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function ra(e, t, n, r) {
  let i = (a) => typeof a == "object" && !Array.isArray(a), s = e;
  n((a) => {
    sa(a) && a >= 0 && (a = Array.from(Array(a).keys(), (g) => g + 1)), a === void 0 && (a = []);
    let o = e._x_lookup, c = e._x_prevKeys, l = [], u = [];
    if (i(a))
      a = Object.entries(a).map(([g, m]) => {
        let w = un(t, m, g, a);
        r((I) => {
          u.includes(I) && L("Duplicate key on x-for", e), u.push(I);
        }, { scope: { index: g, ...w } }), l.push(w);
      });
    else
      for (let g = 0; g < a.length; g++) {
        let m = un(t, a[g], g, a);
        r((w) => {
          u.includes(w) && L("Duplicate key on x-for", e), u.push(w);
        }, { scope: { index: g, ...m } }), l.push(m);
      }
    let f = [], h = [], b = [], T = [];
    for (let g = 0; g < c.length; g++) {
      let m = c[g];
      u.indexOf(m) === -1 && b.push(m);
    }
    c = c.filter((g) => !b.includes(g));
    let k = "template";
    for (let g = 0; g < u.length; g++) {
      let m = u[g], w = c.indexOf(m);
      if (w === -1)
        c.splice(g, 0, m), f.push([k, g]);
      else if (w !== g) {
        let I = c.splice(g, 1)[0], N = c.splice(w - 1, 1)[0];
        c.splice(g, 0, N), c.splice(w, 0, I), h.push([I, N]);
      } else
        T.push(m);
      k = m;
    }
    for (let g = 0; g < b.length; g++) {
      let m = b[g];
      m in o && (C(() => {
        de(o[m]), o[m].remove();
      }), delete o[m]);
    }
    for (let g = 0; g < h.length; g++) {
      let [m, w] = h[g], I = o[m], N = o[w], _ = document.createElement("div");
      C(() => {
        N || L('x-for ":key" is undefined or invalid', s, w, o), N.after(_), I.after(N), N._x_currentIfEl && N.after(N._x_currentIfEl), _.before(I), I._x_currentIfEl && I.after(I._x_currentIfEl), _.remove();
      }), N._x_refreshXForScope(l[u.indexOf(w)]);
    }
    for (let g = 0; g < f.length; g++) {
      let [m, w] = f[g], I = m === "template" ? s : o[m];
      I._x_currentIfEl && (I = I._x_currentIfEl);
      let N = l[w], _ = u[w], d = document.importNode(s.content, !0).firstElementChild, p = ae(N);
      Te(d, p, s), d._x_refreshXForScope = (v) => {
        Object.entries(v).forEach(([E, S]) => {
          p[E] = S;
        });
      }, C(() => {
        I.after(d), V(() => z(d))();
      }), typeof _ == "object" && L("x-for key cannot be an object, it must be a string or an integer", s), o[_] = d;
    }
    for (let g = 0; g < T.length; g++)
      o[T[g]]._x_refreshXForScope(l[u.indexOf(T[g])]);
    s._x_prevKeys = u;
  });
}
function ia(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = e.match(r);
  if (!i)
    return;
  let s = {};
  s.items = i[2].trim();
  let a = i[1].replace(n, "").trim(), o = a.match(t);
  return o ? (s.item = a.replace(t, "").trim(), s.index = o[1].trim(), o[2] && (s.collection = o[2].trim())) : s.item = a, s;
}
function un(e, t, n, r) {
  let i = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    i[a] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    i[a] = t[a];
  }) : i[e.item] = t, e.index && (i[e.index] = n), e.collection && (i[e.collection] = r), i;
}
function sa(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Lr() {
}
Lr.inline = (e, { expression: t }, { cleanup: n }) => {
  let r = Ue(e);
  r._x_refs || (r._x_refs = {}), r._x_refs[t] = e, n(() => delete r._x_refs[t]);
};
O("ref", Lr);
O("if", (e, { expression: t }, { effect: n, cleanup: r }) => {
  e.tagName.toLowerCase() !== "template" && L("x-if can only be used on a <template> tag", e);
  let i = R(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return Te(o, {}, e), C(() => {
      e.after(o), V(() => z(o))();
    }), e._x_currentIfEl = o, e._x_undoIf = () => {
      C(() => {
        de(o), o.remove();
      }), delete e._x_currentIfEl;
    }, o;
  }, a = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => i((o) => {
    o ? s() : a();
  })), r(() => e._x_undoIf && e._x_undoIf());
});
O("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((i) => Ks(e, i));
});
Ze((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Dt(Wn("@", Hn(le("on:"))));
O("on", V((e, { value: t, modifiers: n, expression: r }, { cleanup: i }) => {
  let s = r ? R(e, r) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let a = St(e, t, n, (o) => {
    s(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  i(() => a());
}));
et("Collapse", "collapse", "collapse");
et("Intersect", "intersect", "intersect");
et("Focus", "trap", "focus");
et("Mask", "mask", "mask");
function et(e, t, n) {
  O(t, (r) => L(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
Oe.setEvaluator(ss);
Oe.setReactivityEngine({ reactive: Gt, effect: bs, release: ms, raw: x });
var aa = Oe, ie = aa;
function oa(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: r }) => {
    r.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: r }) {
    let i = dn(r, "duration", 250) / 1e3, s = dn(r, "min", 0), a = !r.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && a && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let o = (l, u) => {
      let f = e.setStyles(l, u);
      return u.height ? () => {
      } : f;
    }, c = {
      transitionProperty: "height",
      transitionDuration: `${i}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(l = () => {
      }, u = () => {
      }) {
        a && (n.hidden = !1), a && (n.style.display = null);
        let f = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let h = n.getBoundingClientRect().height;
        f === h && (f = s), e.transition(n, e.setStyles, {
          during: c,
          start: { height: f + "px" },
          end: { height: h + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - h) < 1 && (n.style.overflow = null);
        });
      },
      out(l = () => {
      }, u = () => {
      }) {
        let f = n.getBoundingClientRect().height;
        e.transition(n, o, {
          during: c,
          start: { height: f + "px" },
          end: { height: s + "px" }
        }, () => n.style.overflow = "hidden", () => {
          n._x_isShown = !1, n.style.height == `${s}px` && a && (n.style.display = "none", n.hidden = !0);
        });
      }
    };
  }
}
function dn(e, t, n) {
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
var ca = oa;
function la(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: r, modifiers: i }, { evaluateLater: s, cleanup: a }) => {
    let o = s(r), c = {
      rootMargin: fa(i),
      threshold: ua(i)
    }, l = new IntersectionObserver((u) => {
      u.forEach((f) => {
        f.isIntersecting !== (n === "leave") && (o(), i.includes("once") && l.disconnect());
      });
    }, c);
    l.observe(t), a(() => {
      l.disconnect();
    });
  }));
}
function ua(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function da(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function fa(e) {
  const t = "margin", n = "0px 0px 0px 0px", r = e.indexOf(t);
  if (r === -1)
    return n;
  let i = [];
  for (let s = 1; s < 5; s++)
    i.push(da(e[r + s] || ""));
  return i = i.filter((s) => s !== void 0), i.length ? i.join(" ").trim() : n;
}
var ha = la, $r = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Ke = /* @__PURE__ */ $r.join(","), Fr = typeof Element > "u", ne = Fr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Ct = !Fr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Mr = function(t, n, r) {
  var i = Array.prototype.slice.apply(t.querySelectorAll(Ke));
  return n && ne.call(t, Ke) && i.unshift(t), i = i.filter(r), i;
}, Dr = function e(t, n, r) {
  for (var i = [], s = Array.from(t); s.length; ) {
    var a = s.shift();
    if (a.tagName === "SLOT") {
      var o = a.assignedElements(), c = o.length ? o : a.children, l = e(c, !0, r);
      r.flatten ? i.push.apply(i, l) : i.push({
        scope: a,
        candidates: l
      });
    } else {
      var u = ne.call(a, Ke);
      u && r.filter(a) && (n || !t.includes(a)) && i.push(a);
      var f = a.shadowRoot || // check for an undisclosed shadow
      typeof r.getShadowRoot == "function" && r.getShadowRoot(a), h = !r.shadowRootFilter || r.shadowRootFilter(a);
      if (f && h) {
        var b = e(f === !0 ? a.children : f.children, !0, r);
        r.flatten ? i.push.apply(i, b) : i.push({
          scope: a,
          candidates: b
        });
      } else
        s.unshift.apply(s, a.children);
    }
  }
  return i;
}, Pr = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, pa = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, zr = function(t) {
  return t.tagName === "INPUT";
}, ga = function(t) {
  return zr(t) && t.type === "hidden";
}, va = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(r) {
    return r.tagName === "SUMMARY";
  });
  return n;
}, ba = function(t, n) {
  for (var r = 0; r < t.length; r++)
    if (t[r].checked && t[r].form === n)
      return t[r];
}, ma = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || Ct(t), r = function(o) {
    return n.querySelectorAll('input[type="radio"][name="' + o + '"]');
  }, i;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    i = r(window.CSS.escape(t.name));
  else
    try {
      i = r(t.name);
    } catch (a) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", a.message), !1;
    }
  var s = ba(i, t.form);
  return !s || s === t;
}, _a = function(t) {
  return zr(t) && t.type === "radio";
}, ya = function(t) {
  return _a(t) && !ma(t);
}, fn = function(t) {
  var n = t.getBoundingClientRect(), r = n.width, i = n.height;
  return r === 0 && i === 0;
}, wa = function(t, n) {
  var r = n.displayCheck, i = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = ne.call(t, "details>summary:first-of-type"), a = s ? t.parentElement : t;
  if (ne.call(a, "details:not([open]) *"))
    return !0;
  var o = Ct(t).host, c = o?.ownerDocument.contains(o) || t.ownerDocument.contains(t);
  if (!r || r === "full") {
    if (typeof i == "function") {
      for (var l = t; t; ) {
        var u = t.parentElement, f = Ct(t);
        if (u && !u.shadowRoot && i(u) === !0)
          return fn(t);
        t.assignedSlot ? t = t.assignedSlot : !u && f !== t.ownerDocument ? t = f.host : t = u;
      }
      t = l;
    }
    if (c)
      return !t.getClientRects().length;
  } else if (r === "non-zero-area")
    return fn(t);
  return !1;
}, xa = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var r = 0; r < n.children.length; r++) {
          var i = n.children.item(r);
          if (i.tagName === "LEGEND")
            return ne.call(n, "fieldset[disabled] *") ? !0 : !i.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, Ve = function(t, n) {
  return !(n.disabled || ga(n) || wa(n, t) || // For a details element with a summary, the summary element gets the focus
  va(n) || xa(n));
}, It = function(t, n) {
  return !(ya(n) || Pr(n) < 0 || !Ve(t, n));
}, Ea = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Sa = function e(t) {
  var n = [], r = [];
  return t.forEach(function(i, s) {
    var a = !!i.scope, o = a ? i.scope : i, c = Pr(o, a), l = a ? e(i.candidates) : o;
    c === 0 ? a ? n.push.apply(n, l) : n.push(o) : r.push({
      documentOrder: s,
      tabIndex: c,
      item: i,
      isScope: a,
      content: l
    });
  }), r.sort(pa).reduce(function(i, s) {
    return s.isScope ? i.push.apply(i, s.content) : i.push(s.content), i;
  }, []).concat(n);
}, Ca = function(t, n) {
  n = n || {};
  var r;
  return n.getShadowRoot ? r = Dr([t], n.includeContainer, {
    filter: It.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Ea
  }) : r = Mr(t, n.includeContainer, It.bind(null, n)), Sa(r);
}, Br = function(t, n) {
  n = n || {};
  var r;
  return n.getShadowRoot ? r = Dr([t], n.includeContainer, {
    filter: Ve.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : r = Mr(t, n.includeContainer, Ve.bind(null, n)), r;
}, Fe = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return ne.call(t, Ke) === !1 ? !1 : It(n, t);
}, Ia = /* @__PURE__ */ $r.concat("iframe").join(","), ze = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return ne.call(t, Ia) === !1 ? !1 : Ve(n, t);
};
function hn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function pn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? hn(Object(n), !0).forEach(function(r) {
      Ta(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : hn(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Ta(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var gn = /* @__PURE__ */ function() {
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
}(), Oa = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Aa = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, Na = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, vn = function(t) {
  return setTimeout(t, 0);
}, bn = function(t, n) {
  var r = -1;
  return t.every(function(i, s) {
    return n(i) ? (r = s, !1) : !0;
  }), r;
}, ve = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
    r[i - 1] = arguments[i];
  return typeof t == "function" ? t.apply(void 0, r) : t;
}, Me = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Ra = function(t, n) {
  var r = n?.document || document, i = pn({
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
  }, a, o = function(d, p, v) {
    return d && d[p] !== void 0 ? d[p] : i[v || p];
  }, c = function(d) {
    return s.containerGroups.findIndex(function(p) {
      var v = p.container, E = p.tabbableNodes;
      return v.contains(d) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      E.find(function(S) {
        return S === d;
      });
    });
  }, l = function(d) {
    var p = i[d];
    if (typeof p == "function") {
      for (var v = arguments.length, E = new Array(v > 1 ? v - 1 : 0), S = 1; S < v; S++)
        E[S - 1] = arguments[S];
      p = p.apply(void 0, E);
    }
    if (p === !0 && (p = void 0), !p) {
      if (p === void 0 || p === !1)
        return p;
      throw new Error("`".concat(d, "` was specified but was not a node, or did not return a node"));
    }
    var A = p;
    if (typeof p == "string" && (A = r.querySelector(p), !A))
      throw new Error("`".concat(d, "` as selector refers to no known node"));
    return A;
  }, u = function() {
    var d = l("initialFocus");
    if (d === !1)
      return !1;
    if (d === void 0)
      if (c(r.activeElement) >= 0)
        d = r.activeElement;
      else {
        var p = s.tabbableGroups[0], v = p && p.firstTabbableNode;
        d = v || l("fallbackFocus");
      }
    if (!d)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return d;
  }, f = function() {
    if (s.containerGroups = s.containers.map(function(d) {
      var p = Ca(d, i.tabbableOptions), v = Br(d, i.tabbableOptions);
      return {
        container: d,
        tabbableNodes: p,
        focusableNodes: v,
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
        nextTabbableNode: function(S) {
          var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, $ = v.findIndex(function(F) {
            return F === S;
          });
          if (!($ < 0))
            return A ? v.slice($ + 1).find(function(F) {
              return Fe(F, i.tabbableOptions);
            }) : v.slice(0, $).reverse().find(function(F) {
              return Fe(F, i.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(d) {
      return d.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !l("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, h = function _(d) {
    if (d !== !1 && d !== r.activeElement) {
      if (!d || !d.focus) {
        _(u());
        return;
      }
      d.focus({
        preventScroll: !!i.preventScroll
      }), s.mostRecentlyFocusedNode = d, Oa(d) && d.select();
    }
  }, b = function(d) {
    var p = l("setReturnFocus", d);
    return p || (p === !1 ? !1 : d);
  }, T = function(d) {
    var p = Me(d);
    if (!(c(p) >= 0)) {
      if (ve(i.clickOutsideDeactivates, d)) {
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
          returnFocus: i.returnFocusOnDeactivate && !ze(p, i.tabbableOptions)
        });
        return;
      }
      ve(i.allowOutsideClick, d) || d.preventDefault();
    }
  }, k = function(d) {
    var p = Me(d), v = c(p) >= 0;
    v || p instanceof Document ? v && (s.mostRecentlyFocusedNode = p) : (d.stopImmediatePropagation(), h(s.mostRecentlyFocusedNode || u()));
  }, g = function(d) {
    var p = Me(d);
    f();
    var v = null;
    if (s.tabbableGroups.length > 0) {
      var E = c(p), S = E >= 0 ? s.containerGroups[E] : void 0;
      if (E < 0)
        d.shiftKey ? v = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : v = s.tabbableGroups[0].firstTabbableNode;
      else if (d.shiftKey) {
        var A = bn(s.tabbableGroups, function(fe) {
          var nt = fe.firstTabbableNode;
          return p === nt;
        });
        if (A < 0 && (S.container === p || ze(p, i.tabbableOptions) && !Fe(p, i.tabbableOptions) && !S.nextTabbableNode(p, !1)) && (A = E), A >= 0) {
          var $ = A === 0 ? s.tabbableGroups.length - 1 : A - 1, F = s.tabbableGroups[$];
          v = F.lastTabbableNode;
        }
      } else {
        var q = bn(s.tabbableGroups, function(fe) {
          var nt = fe.lastTabbableNode;
          return p === nt;
        });
        if (q < 0 && (S.container === p || ze(p, i.tabbableOptions) && !Fe(p, i.tabbableOptions) && !S.nextTabbableNode(p)) && (q = E), q >= 0) {
          var Ae = q === s.tabbableGroups.length - 1 ? 0 : q + 1, tt = s.tabbableGroups[Ae];
          v = tt.firstTabbableNode;
        }
      }
    } else
      v = l("fallbackFocus");
    v && (d.preventDefault(), h(v));
  }, m = function(d) {
    if (Aa(d) && ve(i.escapeDeactivates, d) !== !1) {
      d.preventDefault(), a.deactivate();
      return;
    }
    if (Na(d)) {
      g(d);
      return;
    }
  }, w = function(d) {
    var p = Me(d);
    c(p) >= 0 || ve(i.clickOutsideDeactivates, d) || ve(i.allowOutsideClick, d) || (d.preventDefault(), d.stopImmediatePropagation());
  }, I = function() {
    if (s.active)
      return gn.activateTrap(a), s.delayInitialFocusTimer = i.delayInitialFocus ? vn(function() {
        h(u());
      }) : h(u()), r.addEventListener("focusin", k, !0), r.addEventListener("mousedown", T, {
        capture: !0,
        passive: !1
      }), r.addEventListener("touchstart", T, {
        capture: !0,
        passive: !1
      }), r.addEventListener("click", w, {
        capture: !0,
        passive: !1
      }), r.addEventListener("keydown", m, {
        capture: !0,
        passive: !1
      }), a;
  }, N = function() {
    if (s.active)
      return r.removeEventListener("focusin", k, !0), r.removeEventListener("mousedown", T, !0), r.removeEventListener("touchstart", T, !0), r.removeEventListener("click", w, !0), r.removeEventListener("keydown", m, !0), a;
  };
  return a = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(d) {
      if (s.active)
        return this;
      var p = o(d, "onActivate"), v = o(d, "onPostActivate"), E = o(d, "checkCanFocusTrap");
      E || f(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = r.activeElement, p && p();
      var S = function() {
        E && f(), I(), v && v();
      };
      return E ? (E(s.containers.concat()).then(S, S), this) : (S(), this);
    },
    deactivate: function(d) {
      if (!s.active)
        return this;
      var p = pn({
        onDeactivate: i.onDeactivate,
        onPostDeactivate: i.onPostDeactivate,
        checkCanReturnFocus: i.checkCanReturnFocus
      }, d);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, N(), s.active = !1, s.paused = !1, gn.deactivateTrap(a);
      var v = o(p, "onDeactivate"), E = o(p, "onPostDeactivate"), S = o(p, "checkCanReturnFocus"), A = o(p, "returnFocus", "returnFocusOnDeactivate");
      v && v();
      var $ = function() {
        vn(function() {
          A && h(b(s.nodeFocusedBeforeActivation)), E && E();
        });
      };
      return A && S ? (S(b(s.nodeFocusedBeforeActivation)).then($, $), this) : ($(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, N(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, f(), I(), this);
    },
    updateContainerElements: function(d) {
      var p = [].concat(d).filter(Boolean);
      return s.containers = p.map(function(v) {
        return typeof v == "string" ? r.querySelector(v) : v;
      }), s.active && f(), this;
    }
  }, a.updateContainerElements(t), a;
};
function ka(e) {
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
        return ze(s);
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
        return Array.isArray(i) ? i : Br(i, { displayCheck: "none" });
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
  }), e.directive("trap", e.skipDuringClone(
    (r, { expression: i, modifiers: s }, { effect: a, evaluateLater: o, cleanup: c }) => {
      let l = o(i), u = !1, f = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => r
      };
      if (s.includes("noautofocus"))
        f.initialFocus = !1;
      else {
        let g = r.querySelector("[autofocus]");
        g && (f.initialFocus = g);
      }
      let h = Ra(r, f), b = () => {
      }, T = () => {
      };
      const k = () => {
        b(), b = () => {
        }, T(), T = () => {
        }, h.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      a(() => l((g) => {
        u !== g && (g && !u && (s.includes("noscroll") && (T = La()), s.includes("inert") && (b = mn(r)), setTimeout(() => {
          h.activate();
        }, 15)), !g && u && k(), u = !!g);
      })), c(k);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (r, { expression: i, modifiers: s }, { evaluate: a }) => {
      s.includes("inert") && a(i) && mn(r);
    }
  ));
}
function mn(e) {
  let t = [];
  return jr(e, (n) => {
    let r = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => r || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function jr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? jr(e.parentNode, t) : t(n);
  });
}
function La() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var $a = ka;
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
function Fa(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Ma(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
  }
}
function Da(e, t, n) {
  return t && Ma(e.prototype, t), e;
}
var Pa = Object.defineProperty, B = function(e, t) {
  return Pa(e, "name", { value: t, configurable: !0 });
}, za = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Ba = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, ja = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Wa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ha = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ya = B(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), be = B(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), y = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, W = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, _n = { OUTLINE: "outline", FILLED: "filled" }, ct = { FADE: "fade", SLIDE: "slide" }, me = { CLOSE: be(za), SUCCESS: be(Wa), ERROR: be(Ba), WARNING: be(Ha), INFO: be(ja) }, yn = B(function(e) {
  e.wrapper.classList.add(y.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(y.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), wn = B(function(e) {
  e.wrapper.classList.remove(y.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Ka = B(function(e) {
  e.wrapper.classList.add(y.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(y.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Va = B(function(e) {
  e.wrapper.classList.remove(y.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Wr = function() {
  function e(t) {
    var n = this;
    Fa(this, e), this.notifyOut = B(function(fe) {
      fe(n);
    }, "notifyOut");
    var r = t.notificationsGap, i = r === void 0 ? 20 : r, s = t.notificationsPadding, a = s === void 0 ? 20 : s, o = t.status, c = o === void 0 ? "success" : o, l = t.effect, u = l === void 0 ? ct.FADE : l, f = t.type, h = f === void 0 ? "outline" : f, b = t.title, T = t.text, k = t.showIcon, g = k === void 0 ? !0 : k, m = t.customIcon, w = m === void 0 ? "" : m, I = t.customClass, N = I === void 0 ? "" : I, _ = t.speed, d = _ === void 0 ? 500 : _, p = t.showCloseButton, v = p === void 0 ? !0 : p, E = t.autoclose, S = E === void 0 ? !0 : E, A = t.autotimeout, $ = A === void 0 ? 3e3 : A, F = t.position, q = F === void 0 ? "right top" : F, Ae = t.customWrapper, tt = Ae === void 0 ? "" : Ae;
    if (this.customWrapper = tt, this.status = c, this.title = b, this.text = T, this.showIcon = g, this.customIcon = w, this.customClass = N, this.speed = d, this.effect = u, this.showCloseButton = v, this.autoclose = S, this.autotimeout = $, this.notificationsGap = i, this.notificationsPadding = a, this.type = h, this.position = q, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Da(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(y.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(y.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](y.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](y.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](y.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](y.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](y.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](y.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](y.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, r = document.createElement("div");
    r.classList.add(y.NOTIFY_CLOSE), r.innerHTML = me.CLOSE, this.wrapper.appendChild(r), r.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Ya(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(y.NOTIFY), this.type) {
      case _n.OUTLINE:
        this.wrapper.classList.add(y.NOTIFY_OUTLINE);
        break;
      case _n.FILLED:
        this.wrapper.classList.add(y.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(y.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case W.SUCCESS:
        this.wrapper.classList.add(y.NOTIFY_SUCCESS);
        break;
      case W.ERROR:
        this.wrapper.classList.add(y.NOTIFY_ERROR);
        break;
      case W.WARNING:
        this.wrapper.classList.add(y.NOTIFY_WARNING);
        break;
      case W.INFO:
        this.wrapper.classList.add(y.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(y.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(r) {
      n.wrapper.classList.add(r);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(y.NOTIFY_CONTENT);
    var r, i;
    this.title && (r = document.createElement("div"), r.classList.add(y.NOTIFY_TITLE), r.textContent = this.title.trim(), this.showCloseButton || (r.style.paddingRight = "0")), this.text && (i = document.createElement("div"), i.classList.add(y.NOTIFY_TEXT), i.innerHTML = this.text.trim(), this.title || (i.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(r), this.text && n.appendChild(i);
  } }, { key: "setIcon", value: function() {
    var n = B(function(i) {
      switch (i) {
        case W.SUCCESS:
          return me.SUCCESS;
        case W.ERROR:
          return me.ERROR;
        case W.WARNING:
          return me.WARNING;
        case W.INFO:
          return me.INFO;
      }
    }, "computedIcon"), r = document.createElement("div");
    r.classList.add(y.NOTIFY_ICON), r.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(r);
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
      case ct.FADE:
        this.selectedNotifyInEffect = yn, this.selectedNotifyOutEffect = wn;
        break;
      case ct.SLIDE:
        this.selectedNotifyInEffect = Ka, this.selectedNotifyOutEffect = Va;
        break;
      default:
        this.selectedNotifyInEffect = yn, this.selectedNotifyOutEffect = wn;
    }
  } }]), e;
}();
B(Wr, "Notify");
var Hr = Wr;
globalThis.Notify = Hr;
const Yr = ["success", "error", "warning", "info"], Kr = [
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
], Vr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function _e(e = {}) {
  const t = {
    ...Vr,
    ...e
  };
  Yr.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Kr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Hr(t);
}
const qa = {
  custom: _e,
  success(e, t = "Success", n = {}) {
    _e({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    _e({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    _e({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    _e({
      status: "info",
      title: t,
      text: e,
      ...n
    });
  },
  setDefaults(e = {}) {
    Object.assign(Vr, e);
  },
  get allowedStatuses() {
    return [...Yr];
  },
  get allowedPositions() {
    return [...Kr];
  }
}, Tt = function() {
}, Ce = {}, qe = {}, Ie = {};
function Ua(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let r = e.length, i = r, s, a, o, c;
  for (s = function(l, u) {
    u.length && n.push(l), i--, i || t(n);
  }; r--; ) {
    if (a = e[r], o = qe[a], o) {
      s(a, o);
      continue;
    }
    c = Ie[a] = Ie[a] || [], c.push(s);
  }
}
function qr(e, t) {
  if (!e) return;
  const n = Ie[e];
  if (qe[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function Ot(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || Tt)(t) : (e.success || Tt)(e);
}
function Ga(e, t, n, r, i, s, a, o) {
  let c = e.type[0];
  if (o)
    try {
      n.sheet.cssText.length || (c = "e");
    } catch (l) {
      l.code !== 18 && (c = "e");
    }
  if (c === "e") {
    if (s += 1, s < a)
      return Ur(t, r, i, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  r(t, c, e.defaultPrevented);
}
function Ur(e, t, n, r) {
  const i = document, s = n.async, a = (n.numRetries || 0) + 1, o = n.before || Tt, c = e.replace(/[\?|#].*$/, ""), l = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, f, h;
  if (r = r || 0, /(^css!|\.css$)/.test(c))
    h = i.createElement("link"), h.rel = "stylesheet", h.href = l, u = "hideFocus" in h, u && h.relList && (u = 0, h.rel = "preload", h.as = "style"), n.inlineStyleNonce && h.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(c))
    h = i.createElement("img"), h.src = l;
  else if (h = i.createElement("script"), h.src = l, h.async = s === void 0 ? !0 : s, n.inlineScriptNonce && h.setAttribute("nonce", n.inlineScriptNonce), f = "noModule" in h, /^module!/.test(c)) {
    if (!f) return t(e, "l");
    h.type = "module";
  } else if (/^nomodule!/.test(c) && f)
    return t(e, "l");
  const b = function(T) {
    Ga(T, e, h, t, n, r, a, u);
  };
  h.addEventListener("load", b, { once: !0 }), h.addEventListener("error", b, { once: !0 }), o(e, h) !== !1 && i.head.appendChild(h);
}
function Za(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let r = e.length, i = [];
  function s(a, o, c) {
    if (o === "e" && i.push(a), o === "b")
      if (c) i.push(a);
      else return;
    r--, r || t(i);
  }
  for (let a = 0; a < e.length; a++)
    Ur(e[a], s, n);
}
function H(e, t, n) {
  let r, i;
  if (t && typeof t == "string" && t.trim && (r = t.trim()), i = (r ? n : t) || {}, r) {
    if (r in Ce)
      throw "LoadJS";
    Ce[r] = !0;
  }
  function s(a, o) {
    Za(e, function(c) {
      Ot(i, c), a && Ot({ success: a, error: o }, c), qr(r, c);
    }, i);
  }
  if (i.returnPromise)
    return new Promise(s);
  s();
}
H.ready = function(t, n) {
  return Ua(t, function(r) {
    Ot(n, r);
  }), H;
};
H.done = function(t) {
  qr(t, []);
};
H.reset = function() {
  Object.keys(Ce).forEach((t) => delete Ce[t]), Object.keys(qe).forEach((t) => delete qe[t]), Object.keys(Ie).forEach((t) => delete Ie[t]);
};
H.isDefined = function(t) {
  return t in Ce;
};
function Ja(e) {
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
function Xa(e) {
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
function Qa(e) {
  e.data("rzAlert", () => ({
    showAlert: !0,
    dismiss() {
      this.showAlert = !1;
    }
  }));
}
function eo(e) {
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
function to(e) {
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
function no(e, t) {
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
function ro(e, t) {
  e.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    init() {
      const n = this.$el.dataset.config, r = document.getElementById(this.$el.dataset.uid + "-input");
      if (n) {
        const a = JSON.parse(n);
        a && (this.options = a.options || {}, this.placeholder = a.placeholder || "", this.prependText = a.prependText || "");
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
function io(e) {
  e.data("rzDropdown", () => ({
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
      let n = (this.dropdownEl.getAttribute("data-anchor") || "").replace(/-/g, "").toLowerCase();
      const r = {
        topstart: "bottom-full right-0 mb-2 origin-bottom-right",
        topcenter: "left-1/2 bottom-full transform -translate-x-1/2 mb-2 origin-bottom",
        topend: "bottom-full left-0 mb-2 origin-bottom-left",
        start: "right-full top-1/2 -translate-y-1/2 me-2 origin-right",
        end: "left-full top-1/2 -translate-y-1/2 ms-2 origin-left",
        bottomstart: "right-0 mt-2 origin-top-right",
        bottomcenter: "-translate-x-1/2 mt-2 origin-top",
        bottomend: "left-0 mt-2 origin-top-left"
      };
      let i = r[n] || "";
      const s = this.dropdownEl.getBoundingClientRect();
      let a = document.createElement("div");
      a.style.cssText = "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;", this.dropdownEl.appendChild(a);
      const o = this.dropdownEl.querySelector('[role="menu"]');
      if (!o)
        return i;
      let c = o.cloneNode(!0);
      c.style.transition = "none", c.style.transform = "none", c.style.opacity = "1", c.style.display = "block", a.appendChild(c);
      let l = c.getBoundingClientRect();
      a.parentNode.removeChild(a);
      const u = 8;
      let f = !1;
      if (n.startsWith("top") ? s.top < l.height + u && (f = !0) : n.startsWith("bottom") ? s.bottom + l.height + u > window.innerHeight && (f = !0) : n === "start" ? s.left < l.width + u && (f = !0) : n === "end" && s.right + l.width + u > window.innerWidth && (f = !0), f) {
        let b = {
          topstart: "bottomstart",
          topcenter: "bottomcenter",
          topend: "bottomend",
          bottomstart: "topstart",
          bottomcenter: "topcenter",
          bottomend: "topend",
          start: "end",
          end: "start"
        }[n] || n;
        i = r[b] || i;
      }
      return i;
    }
  }));
}
function so(e) {
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
function ao(e) {
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
function oo(e) {
  e.data("rzEmpty", () => {
  });
}
function co(e) {
  e.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const t = this;
      if (typeof this.setCurrentHeading == "function") {
        const n = (i, s) => {
          i.forEach((a) => {
            a.isIntersecting && t.setCurrentHeading(t.headingId);
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
function lo(e, t) {
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
function uo(e) {
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
function fo(e) {
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
function ho(e) {
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
function po(e) {
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
function go(e) {
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
      const n = t.key, r = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), i = r.findIndex((a) => this.tabSelected === a.dataset.name);
      let s = i;
      n === "ArrowRight" ? (s = (i + 1) % r.length, t.preventDefault()) : n === "ArrowLeft" ? (s = (i - 1 + r.length) % r.length, t.preventDefault()) : n === "Home" ? (s = 0, t.preventDefault()) : n === "End" && (s = r.length - 1, t.preventDefault()), s !== i && this.tabButtonClicked(r[s]);
    }
  }));
}
function vo(e) {
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
function bo(e) {
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
async function mo(e) {
  e = [...e].sort();
  const t = e.join("|"), r = new TextEncoder().encode(t), i = await crypto.subtle.digest("SHA-256", r);
  return Array.from(new Uint8Array(i)).map((a) => a.toString(16).padStart(2, "0")).join("");
}
function Be(e, t, n) {
  mo(e).then((r) => {
    H.isDefined(r) || H(
      e,
      r,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), H.ready([r], t);
  });
}
function _o(e) {
  Ja(e), Xa(e), Qa(e), eo(e), to(e), no(e, Be), ro(e, Be), io(e), so(e), ao(e), oo(e), co(e), lo(e, Be), uo(e), fo(e), ho(e), po(e), go(e), vo(e), bo(e);
}
function yo(e) {
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
    const a = `${i.tagName.toLowerCase()}${i.id ? "#" + i.id : ""}${i.classList.length ? "." + Array.from(i.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${a}) via 'data-alpine-root="${n}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return s;
}
ie.plugin(ca);
ie.plugin(ha);
ie.plugin($a);
_o(ie);
const wo = {
  Alpine: ie,
  require: Be,
  toast: qa,
  $data: yo
};
window.Alpine = ie;
window.Rizzy = { ...window.Rizzy || {}, ...wo };
ie.start();
export {
  wo as default
};
