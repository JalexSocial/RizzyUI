var Ft = !1, zt = !1, ue = [], Bt = -1;
function Qr(e) {
  es(e);
}
function es(e) {
  ue.includes(e) || ue.push(e), ns();
}
function ts(e) {
  let t = ue.indexOf(e);
  t !== -1 && t > Bt && ue.splice(t, 1);
}
function ns() {
  !zt && !Ft && (Ft = !0, queueMicrotask(is));
}
function is() {
  Ft = !1, zt = !0;
  for (let e = 0; e < ue.length; e++)
    ue[e](), Bt = e;
  ue.length = 0, Bt = -1, zt = !1;
}
var Ie, ve, Se, fi, jt = !0;
function rs(e) {
  jt = !1, e(), jt = !0;
}
function ss(e) {
  Ie = e.reactive, Se = e.release, ve = (t) => e.effect(t, { scheduler: (n) => {
    jt ? Qr(n) : n();
  } }), fi = e.raw;
}
function Ln(e) {
  ve = e;
}
function os(e) {
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
function hi(e, t) {
  let n = !0, i, r = ve(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => Se(r);
}
var pi = [], gi = [], mi = [];
function as(e) {
  mi.push(e);
}
function un(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, gi.push(t));
}
function bi(e) {
  pi.push(e);
}
function vi(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function yi(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((r) => r()), delete e._x_attributeCleanups[n]);
  });
}
function ls(e) {
  for (e._x_effects?.forEach(ts); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var dn = new MutationObserver(gn), fn = !1;
function hn() {
  dn.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), fn = !0;
}
function wi() {
  cs(), dn.disconnect(), fn = !1;
}
var $e = [];
function cs() {
  let e = dn.takeRecords();
  $e.push(() => e.length > 0 && gn(e));
  let t = $e.length;
  queueMicrotask(() => {
    if ($e.length === t)
      for (; $e.length > 0; )
        $e.shift()();
  });
}
function A(e) {
  if (!fn)
    return e();
  wi();
  let t = e();
  return hn(), t;
}
var pn = !1, st = [];
function us() {
  pn = !0;
}
function ds() {
  pn = !1, gn(st), st = [];
}
function gn(e) {
  if (pn) {
    st = st.concat(e);
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
    yi(o, s);
  }), i.forEach((s, o) => {
    pi.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || gi.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && mi.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function xi(e) {
  return Ue(xe(e));
}
function qe(e, t, n) {
  return e._x_dataStack = [t, ...xe(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function xe(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? xe(e.host) : e.parentNode ? xe(e.parentNode) : [];
}
function Ue(e) {
  return new Proxy({ objects: e }, fs);
}
var fs = {
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
    return t == "toJSON" ? hs : Reflect.get(
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
function hs() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function _i(e) {
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
function Ei(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return e(this.initialValue, () => ps(i, r), (o) => Wt(i, r, o), r, s);
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
function ps(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Wt(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Wt(e[t[0]], t.slice(1), n);
  }
}
var Ii = {};
function H(e, t) {
  Ii[e] = t;
}
function Ht(e, t) {
  let n = gs(t);
  return Object.entries(Ii).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function gs(e) {
  let [t, n] = $i(e), i = { interceptor: Ei, ...t };
  return un(e, n), i;
}
function ms(e, t, n, ...i) {
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
function Si(e) {
  let t = nt;
  nt = !1;
  let n = e();
  return nt = t, n;
}
function de(e, t, n = {}) {
  let i;
  return k(e, t)((r) => i = r, n), i;
}
function k(...e) {
  return Ci(...e);
}
var Ci = Ti;
function bs(e) {
  Ci = e;
}
function Ti(e, t) {
  let n = {};
  Ht(n, e);
  let i = [n, ...xe(e)], r = typeof t == "function" ? vs(i, t) : ws(i, t, e);
  return ms.bind(null, e, t, r);
}
function vs(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [], context: s } = {}) => {
    let o = t.apply(Ue([i, ...e]), r);
    ot(n, o);
  };
}
var Nt = {};
function ys(e, t) {
  if (Nt[e])
    return Nt[e];
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
  return Nt[e] = s, s;
}
function ws(e, t, n) {
  let i = ys(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    i.result = void 0, i.finished = !1;
    let l = Ue([s, ...e]);
    if (typeof i == "function") {
      let c = i.call(a, i, l).catch((u) => je(u, n, t));
      i.finished ? (ot(r, i.result, l, o, n), i.result = void 0) : c.then((u) => {
        ot(r, u, l, o, n);
      }).catch((u) => je(u, n, t)).finally(() => i.result = void 0);
    }
  };
}
function ot(e, t, n, i, r) {
  if (nt && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => ot(e, o, n, i)).catch((o) => je(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var mn = "x-";
function Ce(e = "") {
  return mn + e;
}
function xs(e) {
  mn = e;
}
var at = {};
function N(e, t) {
  return at[e] = t, {
    before(n) {
      if (!at[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = ce.indexOf(n);
      ce.splice(i >= 0 ? i : ce.indexOf("DEFAULT"), 0, e);
    }
  };
}
function _s(e) {
  return Object.keys(at).includes(e);
}
function bn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Oi(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Ri((s, o) => i[s] = o)).filter(Mi).map(Ss(i, n)).sort(Cs).map((s) => Is(e, s));
}
function Oi(e) {
  return Array.from(e).map(Ri()).filter((t) => !Mi(t));
}
var Vt = !1, De = /* @__PURE__ */ new Map(), Ai = Symbol();
function Es(e) {
  Vt = !0;
  let t = Symbol();
  Ai = t, De.set(t, []);
  let n = () => {
    for (; De.get(t).length; )
      De.get(t).shift()();
    De.delete(t);
  }, i = () => {
    Vt = !1, n();
  };
  e(n), i();
}
function $i(e) {
  let t = [], n = (a) => t.push(a), [i, r] = os(e);
  return t.push(r), [{
    Alpine: Ye,
    effect: i,
    cleanup: n,
    evaluateLater: k.bind(k, e),
    evaluate: de.bind(de, e)
  }, () => t.forEach((a) => a())];
}
function Is(e, t) {
  let n = () => {
  }, i = at[t.type] || n, [r, s] = $i(e);
  vi(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Vt ? De.get(Ai).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Ni = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), ki = (e) => e;
function Ri(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: r } = Li.reduce((s, o) => o(s), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: r };
  };
}
var Li = [];
function vn(e) {
  Li.push(e);
}
function Mi({ name: e }) {
  return Pi().test(e);
}
var Pi = () => new RegExp(`^${mn}([^:^.]+)\\b`);
function Ss(e, t) {
  return ({ name: n, value: i }) => {
    let r = n.match(Pi()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
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
function Cs(e, t) {
  let n = ce.indexOf(e.type) === -1 ? qt : e.type, i = ce.indexOf(t.type) === -1 ? qt : t.type;
  return ce.indexOf(n) - ce.indexOf(i);
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
function F(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Mn = !1;
function Ts() {
  Mn && F("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Mn = !0, document.body || F("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ze(document, "alpine:init"), ze(document, "alpine:initializing"), hn(), as((t) => J(t, ge)), un((t) => Oe(t)), bi((t, n) => {
    bn(t, n).forEach((i) => i());
  });
  let e = (t) => !yt(t.parentElement, !0);
  Array.from(document.querySelectorAll(zi().join(","))).filter(e).forEach((t) => {
    J(t);
  }), ze(document, "alpine:initialized"), setTimeout(() => {
    Ns();
  });
}
var yn = [], Di = [];
function Fi() {
  return yn.map((e) => e());
}
function zi() {
  return yn.concat(Di).map((e) => e());
}
function Bi(e) {
  yn.push(e);
}
function ji(e) {
  Di.push(e);
}
function yt(e, t = !1) {
  return Te(e, (n) => {
    if ((t ? zi() : Fi()).some((r) => n.matches(r)))
      return !0;
  });
}
function Te(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return Te(e.parentElement, t);
  }
}
function Os(e) {
  return Fi().some((t) => e.matches(t));
}
var Wi = [];
function As(e) {
  Wi.push(e);
}
var $s = 1;
function J(e, t = ge, n = () => {
}) {
  Te(e, (i) => i._x_ignore) || Es(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Wi.forEach((s) => s(i, r)), bn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = $s++), i._x_ignore && r());
    });
  });
}
function Oe(e, t = ge) {
  t(e, (n) => {
    ls(n), yi(n), delete n._x_marker;
  });
}
function Ns() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    _s(n) || i.some((r) => {
      if (document.querySelector(r))
        return F(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Ut = [], wn = !1;
function xn(e = () => {
}) {
  return queueMicrotask(() => {
    wn || setTimeout(() => {
      Yt();
    });
  }), new Promise((t) => {
    Ut.push(() => {
      e(), t();
    });
  });
}
function Yt() {
  for (wn = !1; Ut.length; )
    Ut.shift()();
}
function ks() {
  wn = !0;
}
function _n(e, t) {
  return Array.isArray(t) ? Pn(e, t.join(" ")) : typeof t == "object" && t !== null ? Rs(e, t) : typeof t == "function" ? _n(e, t()) : Pn(e, t);
}
function Pn(e, t) {
  let n = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function Rs(e, t) {
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
  return typeof t == "object" && t !== null ? Ls(e, t) : Ms(e, t);
}
function Ls(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = Ps(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    wt(e, n);
  };
}
function Ms(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Ps(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Kt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
N("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Fs(e, n, t) : Ds(e, i, t));
});
function Ds(e, t, n) {
  Hi(e, _n, ""), {
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
function Fs(e, t, n) {
  Hi(e, wt);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((m, f) => f < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((m, f) => f > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? Ne(t, "scale", 95) / 100 : 1, d = Ne(t, "delay", 0) / 1e3, h = Ne(t, "origin", "center"), b = "opacity, transform", x = Ne(t, "duration", 150) / 1e3, w = Ne(t, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: h,
    transitionDelay: `${d}s`,
    transitionProperty: b,
    transitionDuration: `${x}s`,
    transitionTimingFunction: p
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: h,
    transitionDelay: `${d}s`,
    transitionProperty: b,
    transitionDuration: `${w}s`,
    transitionTimingFunction: p
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function Hi(e, t, n = {}) {
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
    let o = Vi(e);
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
function Vi(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Vi(t);
}
function Gt(e, t, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  zs(e, {
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
function zs(e, t) {
  let n, i, r, s = Kt(() => {
    A(() => {
      n = !0, i || t.before(), r || (t.end(), Yt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Kt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, A(() => {
    t.start(), t.during();
  }), ks(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), A(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (A(() => {
        t.end();
      }), Yt(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Ne(e, t, n) {
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
function Bs(e) {
  return (...t) => ie && e(...t);
}
var qi = [];
function xt(e) {
  qi.push(e);
}
function js(e, t) {
  qi.forEach((n) => n(e, t)), ie = !0, Ui(() => {
    J(t, (n, i) => {
      i(n, () => {
      });
    });
  }), ie = !1;
}
var Jt = !1;
function Ws(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ie = !0, Jt = !0, Ui(() => {
    Hs(t);
  }), ie = !1, Jt = !1;
}
function Hs(e) {
  let t = !1;
  J(e, (i, r) => {
    ge(i, (s, o) => {
      if (t && Os(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function Ui(e) {
  let t = ve;
  Ln((n, i) => {
    let r = t(n);
    return Se(r), () => {
    };
  }), e(), Ln(t);
}
function Yi(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Ie({})), e._x_bindings[t] = n, t = i.includes("camel") ? Zs(t) : t, t) {
    case "value":
      Vs(e, n);
      break;
    case "style":
      Us(e, n);
      break;
    case "class":
      qs(e, n);
      break;
    case "selected":
    case "checked":
      Ys(e, t, n);
      break;
    default:
      Ki(e, t, n);
      break;
  }
}
function Vs(e, t) {
  if (Zi(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = it(e.value) === t : e.checked = Dn(e.value, t));
  else if (En(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Dn(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Js(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function qs(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = _n(e, t);
}
function Us(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = wt(e, t);
}
function Ys(e, t, n) {
  Ki(e, t, n), Gs(e, t, n);
}
function Ki(e, t, n) {
  [null, void 0, !1].includes(n) && Qs(t) ? e.removeAttribute(t) : (Gi(t) && (n = t), Ks(e, t, n));
}
function Ks(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Gs(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Js(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Zs(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Dn(e, t) {
  return e == t;
}
function it(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Xs = /* @__PURE__ */ new Set([
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
function Gi(e) {
  return Xs.has(e);
}
function Qs(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function eo(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Ji(e, t, n);
}
function to(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, Si(() => de(e, r.expression));
  }
  return Ji(e, t, n);
}
function Ji(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Gi(t) ? !![t, "true"].includes(i) : i;
}
function En(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Zi(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Xi(e, t) {
  let n;
  return function() {
    const i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function Qi(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function er({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = ve(() => {
    let a = e(), l = n();
    if (r)
      i(kt(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(kt(a)) : c !== u && t(kt(l));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Se(o);
  };
}
function kt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function no(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Ye));
}
var le = {}, Fn = !1;
function io(e, t) {
  if (Fn || (le = Ie(le), Fn = !0), t === void 0)
    return le[e];
  le[e] = t, _i(le[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && le[e].init();
}
function ro() {
  return le;
}
var tr = {};
function so(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? nr(e, n()) : (tr[e] = n, () => {
  });
}
function oo(e) {
  return Object.entries(tr).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function nr(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Oi(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), bn(e, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var ir = {};
function ao(e, t) {
  ir[e] = t;
}
function lo(e, t) {
  return Object.entries(ir).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...r) => i.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var co = {
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
    return fi;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: ds,
  dontAutoEvaluateFunctions: Si,
  disableEffectScheduling: rs,
  startObservingMutations: hn,
  stopObservingMutations: wi,
  setReactivityEngine: ss,
  onAttributeRemoved: vi,
  onAttributesAdded: bi,
  closestDataStack: xe,
  skipDuringClone: oe,
  onlyDuringClone: Bs,
  addRootSelector: Bi,
  addInitSelector: ji,
  interceptClone: xt,
  addScopeToNode: qe,
  deferMutations: us,
  mapAttributes: vn,
  evaluateLater: k,
  interceptInit: As,
  setEvaluator: bs,
  mergeProxies: Ue,
  extractProp: to,
  findClosest: Te,
  onElRemoved: un,
  closestRoot: yt,
  destroyTree: Oe,
  interceptor: Ei,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Gt,
  // INTERNAL
  setStyles: wt,
  // INTERNAL
  mutateDom: A,
  directive: N,
  entangle: er,
  throttle: Qi,
  debounce: Xi,
  evaluate: de,
  initTree: J,
  nextTick: xn,
  prefixed: Ce,
  prefix: xs,
  plugin: no,
  magic: H,
  store: io,
  start: Ts,
  clone: Ws,
  // INTERNAL
  cloneNode: js,
  // INTERNAL
  bound: eo,
  $data: xi,
  watch: hi,
  walk: ge,
  data: ao,
  bind: so
}, Ye = co;
function uo(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = e.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var fo = Object.freeze({}), ho = Object.prototype.hasOwnProperty, _t = (e, t) => ho.call(e, t), fe = Array.isArray, Be = (e) => rr(e) === "[object Map]", po = (e) => typeof e == "string", In = (e) => typeof e == "symbol", Et = (e) => e !== null && typeof e == "object", go = Object.prototype.toString, rr = (e) => go.call(e), sr = (e) => rr(e).slice(8, -1), Sn = (e) => po(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, mo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, bo = mo((e) => e.charAt(0).toUpperCase() + e.slice(1)), or = (e, t) => e !== t && (e === e || t === t), Zt = /* @__PURE__ */ new WeakMap(), ke = [], U, he = Symbol("iterate"), Xt = Symbol("Map key iterate");
function vo(e) {
  return e && e._isEffect === !0;
}
function yo(e, t = fo) {
  vo(e) && (e = e.raw);
  const n = _o(e, t);
  return t.lazy || n(), n;
}
function wo(e) {
  e.active && (ar(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var xo = 0;
function _o(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!ke.includes(n)) {
      ar(n);
      try {
        return Io(), ke.push(n), U = n, e();
      } finally {
        ke.pop(), lr(), U = ke[ke.length - 1];
      }
    }
  };
  return n.id = xo++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function ar(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var _e = !0, Cn = [];
function Eo() {
  Cn.push(_e), _e = !1;
}
function Io() {
  Cn.push(_e), _e = !0;
}
function lr() {
  const e = Cn.pop();
  _e = e === void 0 ? !0 : e;
}
function B(e, t, n) {
  if (!_e || U === void 0)
    return;
  let i = Zt.get(e);
  i || Zt.set(e, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(U) || (r.add(U), U.deps.push(r), U.options.onTrack && U.options.onTrack({
    effect: U,
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
      (d !== U || d.allowRecurse) && a.add(d);
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
        fe(e) ? Sn(n) && l(o.get("length")) : (l(o.get(he)), Be(e) && l(o.get(Xt)));
        break;
      case "delete":
        fe(e) || (l(o.get(he)), Be(e) && l(o.get(Xt)));
        break;
      case "set":
        Be(e) && l(o.get(he));
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
var So = /* @__PURE__ */ uo("__proto__,__v_isRef,__isVue"), cr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(In)), Co = /* @__PURE__ */ ur(), To = /* @__PURE__ */ ur(!0), zn = /* @__PURE__ */ Oo();
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
      return lr(), i;
    };
  }), e;
}
function ur(e = !1, t = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? Wo : pr : t ? jo : hr).get(i))
      return i;
    const o = fe(i);
    if (!e && o && _t(zn, r))
      return Reflect.get(zn, r, s);
    const a = Reflect.get(i, r, s);
    return (In(r) ? cr.has(r) : So(r)) || (e || B(i, "get", r), t) ? a : Qt(a) ? !o || !Sn(r) ? a.value : a : Et(a) ? e ? gr(a) : $n(a) : a;
  };
}
var Ao = /* @__PURE__ */ $o();
function $o(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = O(r), o = O(o), !fe(n) && Qt(o) && !Qt(r)))
      return o.value = r, !0;
    const a = fe(n) && Sn(i) ? Number(i) < n.length : _t(n, i), l = Reflect.set(n, i, r, s);
    return n === O(s) && (a ? or(r, o) && re(n, "set", i, r, o) : re(n, "add", i, r)), l;
  };
}
function No(e, t) {
  const n = _t(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && re(e, "delete", t, void 0, i), r;
}
function ko(e, t) {
  const n = Reflect.has(e, t);
  return (!In(t) || !cr.has(t)) && B(e, "has", t), n;
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
}, Tn = (e) => Et(e) ? $n(e) : e, On = (e) => Et(e) ? gr(e) : e, An = (e) => e, It = (e) => Reflect.getPrototypeOf(e);
function Ge(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = O(e), s = O(t);
  t !== s && !n && B(r, "get", t), !n && B(r, "get", s);
  const { has: o } = It(r), a = i ? An : n ? On : Tn;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function Je(e, t = !1) {
  const n = this.__v_raw, i = O(n), r = O(e);
  return e !== r && !t && B(i, "has", e), !t && B(i, "has", r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Ze(e, t = !1) {
  return e = e.__v_raw, !t && B(O(e), "iterate", he), Reflect.get(e, "size", e);
}
function Bn(e) {
  e = O(e);
  const t = O(this);
  return It(t).has.call(t, e) || (t.add(e), re(t, "add", e, e)), this;
}
function jn(e, t) {
  t = O(t);
  const n = O(this), { has: i, get: r } = It(n);
  let s = i.call(n, e);
  s ? fr(n, i, e) : (e = O(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? or(t, o) && re(n, "set", e, t, o) : re(n, "add", e, t), this;
}
function Wn(e) {
  const t = O(this), { has: n, get: i } = It(t);
  let r = n.call(t, e);
  r ? fr(t, n, e) : (e = O(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && re(t, "delete", e, void 0, s), o;
}
function Hn() {
  const e = O(this), t = e.size !== 0, n = Be(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && re(e, "clear", void 0, void 0, n), i;
}
function Xe(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = O(o), l = t ? An : e ? On : Tn;
    return !e && B(a, "iterate", he), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function Qe(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = O(r), o = Be(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...i), u = n ? An : t ? On : Tn;
    return !t && B(s, "iterate", l ? Xt : he), {
      // iterator protocol
      next() {
        const { value: d, done: h } = c.next();
        return h ? { value: d, done: h } : {
          value: a ? [u(d[0]), u(d[1])] : u(d),
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
function ee(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${bo(e)} operation ${n}failed: target is readonly.`, O(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Po() {
  const e = {
    get(s) {
      return Ge(this, s);
    },
    get size() {
      return Ze(this);
    },
    has: Je,
    add: Bn,
    set: jn,
    delete: Wn,
    clear: Hn,
    forEach: Xe(!1, !1)
  }, t = {
    get(s) {
      return Ge(this, s, !1, !0);
    },
    get size() {
      return Ze(this);
    },
    has: Je,
    add: Bn,
    set: jn,
    delete: Wn,
    clear: Hn,
    forEach: Xe(!1, !0)
  }, n = {
    get(s) {
      return Ge(this, s, !0);
    },
    get size() {
      return Ze(this, !0);
    },
    has(s) {
      return Je.call(this, s, !0);
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
    forEach: Xe(!0, !1)
  }, i = {
    get(s) {
      return Ge(this, s, !0, !0);
    },
    get size() {
      return Ze(this, !0);
    },
    has(s) {
      return Je.call(this, s, !0);
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
var [Do, Fo, bc, vc] = /* @__PURE__ */ Po();
function dr(e, t) {
  const n = e ? Fo : Do;
  return (i, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(_t(n, r) && r in i ? n : i, r, s);
}
var zo = {
  get: /* @__PURE__ */ dr(!1)
}, Bo = {
  get: /* @__PURE__ */ dr(!0)
};
function fr(e, t, n) {
  const i = O(n);
  if (i !== n && t.call(e, i)) {
    const r = sr(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var hr = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ new WeakMap(), pr = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap();
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
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ho(sr(e));
}
function $n(e) {
  return e && e.__v_isReadonly ? e : mr(e, !1, Lo, zo, hr);
}
function gr(e) {
  return mr(e, !0, Mo, Bo, pr);
}
function mr(e, t, n, i, r) {
  if (!Et(e))
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
  let s = t(i), a = hi(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
H("store", ro);
H("data", (e) => xi(e));
H("root", (e) => yt(e));
H("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ue(qo(e))), e._x_refs_proxy));
function qo(e) {
  let t = [];
  return Te(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Rt = {};
function br(e) {
  return Rt[e] || (Rt[e] = 0), ++Rt[e];
}
function Uo(e, t) {
  return Te(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Yo(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = br(t));
}
H("id", (e, { cleanup: t }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return Ko(e, r, t, () => {
    let s = Uo(e, n), o = s ? s._x_ids[n] : br(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
xt((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Ko(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = i();
  return e._x_id[t] = r, n(() => {
    delete e._x_id[t];
  }), r;
}
H("el", (e) => e);
vr("Focus", "focus", "focus");
vr("Persist", "persist", "persist");
function vr(e, t, n) {
  H(t, (i) => F(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
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
    let u = e._x_model.get, d = e._x_model.set, h = er(
      {
        get() {
          return u();
        },
        set(b) {
          d(b);
        }
      },
      {
        get() {
          return o();
        },
        set(b) {
          l(b);
        }
      }
    );
    r(h);
  });
});
N("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && F("x-teleport can only be used on a <template> tag", e);
  let r = Vn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), qe(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  A(() => {
    o(s, r, t), oe(() => {
      J(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Vn(n);
    A(() => {
      o(e._x_teleport, a, t);
    });
  }, i(
    () => A(() => {
      s.remove(), Oe(s);
    })
  );
});
var Go = document.createElement("div");
function Vn(e) {
  let t = oe(() => document.querySelector(e), () => Go)();
  return t || F(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var yr = () => {
};
yr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
N("ignore", yr);
N("effect", oe((e, { expression: t }, { effect: n }) => {
  n(k(e, t));
}));
function en(e, t, n, i) {
  let r = e, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (t = Jo(t)), n.includes("camel") && (t = Zo(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = lt(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Xi(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = lt(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Qi(s, c);
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
  })), (Qo(t) || wr(t)) && (s = a(s, (l, c) => {
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
function lt(e) {
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
function wr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function ea(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, lt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, lt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && qn(e.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (wr(e.type) || qn(e.key).includes(n[0])));
}
function qn(e) {
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
    let h;
    return o((b) => h = b), Un(h) ? h.get() : h;
  }, c = (h) => {
    let b;
    o((x) => b = x), Un(b) ? b.set(h) : a(() => {
    }, {
      scope: { __placeholder: h }
    });
  };
  typeof n == "string" && e.type === "radio" && A(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = ie ? () => {
  } : en(e, u, t, (h) => {
    c(Lt(e, t, h, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || En(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Lt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let h = en(e.form, "reset", [], (b) => {
      xn(() => e._x_model && e._x_model.set(Lt(e, t, { target: e }, l())));
    });
    r(() => h());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(h) {
      c(h);
    }
  }, e._x_forceModelUpdate = (h) => {
    h === void 0 && typeof n == "string" && n.match(/\./) && (h = ""), window.fromModel = !0, A(() => Yi(e, "value", h)), delete window.fromModel;
  }, i(() => {
    let h = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(h);
  });
});
function Lt(e, t, n, i) {
  return A(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (En(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = Mt(n.target.value) : t.includes("boolean") ? r = it(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ta(s, r));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Mt(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return it(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return Zi(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? Mt(r) : t.includes("boolean") ? it(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Mt(e) {
  let t = e ? parseFloat(e) : null;
  return na(t) ? t : e;
}
function ta(e, t) {
  return e == t;
}
function na(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Un(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
N("cloak", (e) => queueMicrotask(() => A(() => e.removeAttribute(Ce("cloak")))));
ji(() => `[${Ce("init")}]`);
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
        e.innerHTML = s, e._x_ignoreSelf = !0, J(e), delete e._x_ignoreSelf;
      });
    });
  });
});
vn(Ni(":", ki(Ce("bind:"))));
var xr = (e, { value: t, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    oo(l), k(e, i)((u) => {
      nr(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return ia(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = k(e, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), A(() => Yi(e, t, l, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
xr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
N("bind", xr);
function ia(e, t) {
  e._x_keyExpression = t;
}
Bi(() => `[${Ce("data")}]`);
N("data", (e, { expression: t }, { cleanup: n }) => {
  if (ra(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  Ht(i, e);
  let r = {};
  lo(r, i);
  let s = de(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Ht(s, e);
  let o = Ie(s);
  _i(o);
  let a = qe(e, o);
  o.init && de(e, o.init), n(() => {
    o.destroy && de(e, o.destroy), a();
  });
});
xt((e, t) => {
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
  }, a = () => setTimeout(o), l = Kt(
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
        Oe(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function sa(e, t, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    aa(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, m]) => {
        let f = Yn(t, m, p, o);
        i((y) => {
          u.includes(y) && F("Duplicate key on x-for", e), u.push(y);
        }, { scope: { index: p, ...f } }), c.push(f);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let m = Yn(t, o[p], p, o);
        i((f) => {
          u.includes(f) && F("Duplicate key on x-for", e), u.push(f);
        }, { scope: { index: p, ...m } }), c.push(m);
      }
    let d = [], h = [], b = [], x = [];
    for (let p = 0; p < l.length; p++) {
      let m = l[p];
      u.indexOf(m) === -1 && b.push(m);
    }
    l = l.filter((p) => !b.includes(p));
    let w = "template";
    for (let p = 0; p < u.length; p++) {
      let m = u[p], f = l.indexOf(m);
      if (f === -1)
        l.splice(p, 0, m), d.push([w, p]);
      else if (f !== p) {
        let y = l.splice(p, 1)[0], E = l.splice(f - 1, 1)[0];
        l.splice(p, 0, E), l.splice(f, 0, y), h.push([y, E]);
      } else
        x.push(m);
      w = m;
    }
    for (let p = 0; p < b.length; p++) {
      let m = b[p];
      m in a && (A(() => {
        Oe(a[m]), a[m].remove();
      }), delete a[m]);
    }
    for (let p = 0; p < h.length; p++) {
      let [m, f] = h[p], y = a[m], E = a[f], _ = document.createElement("div");
      A(() => {
        E || F('x-for ":key" is undefined or invalid', s, f, a), E.after(_), y.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), _.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), _.remove();
      }), E._x_refreshXForScope(c[u.indexOf(f)]);
    }
    for (let p = 0; p < d.length; p++) {
      let [m, f] = d[p], y = m === "template" ? s : a[m];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let E = c[f], _ = u[f], g = document.importNode(s.content, !0).firstElementChild, v = Ie(E);
      qe(g, v, s), g._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([C, S]) => {
          v[C] = S;
        });
      }, A(() => {
        y.after(g), oe(() => J(g))();
      }), typeof _ == "object" && F("x-for key cannot be an object, it must be a string or an integer", s), a[_] = g;
    }
    for (let p = 0; p < x.length; p++)
      a[x[p]]._x_refreshXForScope(c[u.indexOf(x[p])]);
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
function _r() {
}
_r.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = yt(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
N("ref", _r);
N("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && F("x-if can only be used on a <template> tag", e);
  let r = k(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return qe(a, {}, e), A(() => {
      e.after(a), oe(() => J(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      A(() => {
        Oe(a), a.remove();
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
  n(t).forEach((r) => Yo(e, r));
});
xt((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
vn(Ni("@", ki(Ce("on:"))));
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
St("Collapse", "collapse", "collapse");
St("Intersect", "intersect", "intersect");
St("Focus", "trap", "focus");
St("Mask", "mask", "mask");
function St(e, t, n) {
  N(t, (i) => F(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Ye.setEvaluator(Ti);
Ye.setReactivityEngine({ reactive: $n, effect: yo, release: wo, raw: O });
var la = Ye, G = la;
function ca() {
  return !0;
}
function ua({ component: e, argument: t }) {
  return new Promise((n) => {
    if (t)
      window.addEventListener(
        t,
        () => n(),
        { once: !0 }
      );
    else {
      const i = (r) => {
        r.detail.id === e.id && (window.removeEventListener("async-alpine:load", i), n());
      };
      window.addEventListener("async-alpine:load", i);
    }
  });
}
function da() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function fa({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const n = window.matchMedia(`(${e})`);
    n.matches ? t() : n.addEventListener("change", t, { once: !0 });
  });
}
function ha({ component: e, argument: t }) {
  return new Promise((n) => {
    const i = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), n());
    }, { rootMargin: i });
    r.observe(e.el);
  });
}
var Kn = {
  eager: ca,
  event: ua,
  idle: da,
  media: fa,
  visible: ha
};
async function pa(e) {
  const t = ga(e.strategy);
  await tn(e, t);
}
async function tn(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((n) => tn(e, n))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((n) => tn(e, n))
      );
  }
  return Kn[t.method] ? Kn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function ga(e) {
  const t = ma(e);
  let n = Er(t);
  return n.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [n]
  } : n;
}
function ma(e) {
  const t = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, n = [];
  let i;
  for (; (i = t.exec(e)) !== null; ) {
    const [r, s, o, a] = i;
    if (s !== void 0)
      n.push({ type: "parenthesis", value: s });
    else if (o !== void 0)
      n.push({
        type: "operator",
        // we do the below to make operators backwards-compatible with previous
        // versions of Async Alpine, where '|' is equivalent to &&
        value: o === "|" ? "&&" : o
      });
    else {
      const l = {
        type: "method",
        method: a.trim()
      };
      a.includes("(") && (l.method = a.substring(0, a.indexOf("(")).trim(), l.argument = a.substring(
        a.indexOf("(") + 1,
        a.indexOf(")")
      )), a.method === "immediate" && (a.method = "eager"), n.push(l);
    }
  }
  return n;
}
function Er(e) {
  let t = Gn(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const n = e.shift().value, i = Gn(e);
    t.type === "expression" && t.operator === n ? t.parameters.push(i) : t = {
      type: "expression",
      operator: n,
      parameters: [t, i]
    };
  }
  return t;
}
function Gn(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = Er(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function ba(e) {
  const t = "load", n = e.prefixed("load-src"), i = e.prefixed("ignore");
  let r = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, s = !1, o = {}, a = 0;
  function l() {
    return a++;
  }
  e.asyncOptions = (f) => {
    r = {
      ...r,
      ...f
    };
  }, e.asyncData = (f, y = !1) => {
    o[f] = {
      loaded: !1,
      download: y
    };
  }, e.asyncUrl = (f, y) => {
    !f || !y || o[f] || (o[f] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        m(y)
      )
    });
  }, e.asyncAlias = (f) => {
    s = f;
  };
  const c = (f) => {
    e.skipDuringClone(() => {
      f._x_async || (f._x_async = "init", f._x_ignore = !0, f.setAttribute(i, ""));
    })();
  }, u = async (f) => {
    e.skipDuringClone(async () => {
      if (f._x_async !== "init") return;
      f._x_async = "await";
      const { name: y, strategy: E } = d(f);
      await pa({
        name: y,
        strategy: E,
        el: f,
        id: f.id || l()
      }), f.isConnected && (await h(y), f.isConnected && (x(f), f._x_async = "loaded"));
    })();
  };
  u.inline = c, e.directive(t, u).before("ignore");
  function d(f) {
    const y = p(f.getAttribute(e.prefixed("data"))), E = f.getAttribute(e.prefixed(t)) || r.defaultStrategy, _ = f.getAttribute(n);
    return _ && e.asyncUrl(y, _), {
      name: y,
      strategy: E
    };
  }
  async function h(f) {
    if (f.startsWith("_x_async_") || (w(f), !o[f] || o[f].loaded)) return;
    const y = await b(f);
    e.data(f, y), o[f].loaded = !0;
  }
  async function b(f) {
    if (!o[f]) return;
    const y = await o[f].download(f);
    return typeof y == "function" ? y : y[f] || y.default || Object.values(y)[0] || !1;
  }
  function x(f) {
    e.destroyTree(f), f._x_ignore = !1, f.removeAttribute(i), !f.closest(`[${i}]`) && e.initTree(f);
  }
  function w(f) {
    if (!(!s || o[f])) {
      if (typeof s == "function") {
        e.asyncData(f, s);
        return;
      }
      e.asyncUrl(f, s.replaceAll("[name]", f));
    }
  }
  function p(f) {
    return (f || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function m(f) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(f) ? f : new URL(f, document.baseURI).href;
  }
}
function va(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: i }) {
    let r = Jn(i, "duration", 250) / 1e3, s = Jn(i, "min", 0), o = !i.includes("min");
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
        let h = n.getBoundingClientRect().height;
        d === h && (d = s), e.transition(n, e.setStyles, {
          during: l,
          start: { height: d + "px" },
          end: { height: h + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - h) < 1 && (n.style.overflow = null);
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
function Jn(e, t, n) {
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
var ya = va;
function wa(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: Ea(r),
      threshold: xa(r)
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
function xa(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function _a(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Ea(e) {
  const t = "margin", n = "0px 0px 0px 0px", i = e.indexOf(t);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(_a(e[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var Ia = wa, Ir = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ct = /* @__PURE__ */ Ir.join(","), Sr = typeof Element > "u", me = Sr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, nn = !Sr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Cr = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(ct));
  return n && me.call(t, ct) && r.unshift(t), r = r.filter(i), r;
}, Tr = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = me.call(o, ct);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), h = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && h) {
        var b = e(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, b) : r.push({
          scope: o,
          candidates: b
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Or = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Sa = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, Ar = function(t) {
  return t.tagName === "INPUT";
}, Ca = function(t) {
  return Ar(t) && t.type === "hidden";
}, Ta = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, Oa = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, Aa = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || nn(t), i = function(a) {
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
  var s = Oa(r, t.form);
  return !s || s === t;
}, $a = function(t) {
  return Ar(t) && t.type === "radio";
}, Na = function(t) {
  return $a(t) && !Aa(t);
}, Zn = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, ka = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = me.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (me.call(o, "details:not([open]) *"))
    return !0;
  var a = nn(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = nn(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return Zn(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return Zn(t);
  return !1;
}, Ra = function(t) {
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
}, ut = function(t, n) {
  return !(n.disabled || Ca(n) || ka(n, t) || // For a details element with a summary, the summary element gets the focus
  Ta(n) || Ra(n));
}, rn = function(t, n) {
  return !(Na(n) || Or(n) < 0 || !ut(t, n));
}, La = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Ma = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Or(a, o), c = o ? e(r.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), i.sort(Sa).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, Pa = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Tr([t], n.includeContainer, {
    filter: rn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: La
  }) : i = Cr(t, n.includeContainer, rn.bind(null, n)), Ma(i);
}, $r = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Tr([t], n.includeContainer, {
    filter: ut.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Cr(t, n.includeContainer, ut.bind(null, n)), i;
}, et = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return me.call(t, ct) === !1 ? !1 : rn(n, t);
}, Da = /* @__PURE__ */ Ir.concat("iframe").join(","), rt = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return me.call(t, Da) === !1 ? !1 : ut(n, t);
};
function Xn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Qn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Xn(Object(n), !0).forEach(function(i) {
      Fa(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xn(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Fa(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var ei = /* @__PURE__ */ function() {
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
}(), za = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Ba = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, ja = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, ti = function(t) {
  return setTimeout(t, 0);
}, ni = function(t, n) {
  var i = -1;
  return t.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Re = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, i) : t;
}, tt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Wa = function(t, n) {
  var i = n?.document || document, r = Qn({
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
  }, o, a = function(g, v, I) {
    return g && g[v] !== void 0 ? g[v] : r[I || v];
  }, l = function(g) {
    return s.containerGroups.findIndex(function(v) {
      var I = v.container, C = v.tabbableNodes;
      return I.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      C.find(function(S) {
        return S === g;
      });
    });
  }, c = function(g) {
    var v = r[g];
    if (typeof v == "function") {
      for (var I = arguments.length, C = new Array(I > 1 ? I - 1 : 0), S = 1; S < I; S++)
        C[S - 1] = arguments[S];
      v = v.apply(void 0, C);
    }
    if (v === !0 && (v = void 0), !v) {
      if (v === void 0 || v === !1)
        return v;
      throw new Error("`".concat(g, "` was specified but was not a node, or did not return a node"));
    }
    var $ = v;
    if (typeof v == "string" && ($ = i.querySelector(v), !$))
      throw new Error("`".concat(g, "` as selector refers to no known node"));
    return $;
  }, u = function() {
    var g = c("initialFocus");
    if (g === !1)
      return !1;
    if (g === void 0)
      if (l(i.activeElement) >= 0)
        g = i.activeElement;
      else {
        var v = s.tabbableGroups[0], I = v && v.firstTabbableNode;
        g = I || c("fallbackFocus");
      }
    if (!g)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return g;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(g) {
      var v = Pa(g, r.tabbableOptions), I = $r(g, r.tabbableOptions);
      return {
        container: g,
        tabbableNodes: v,
        focusableNodes: I,
        firstTabbableNode: v.length > 0 ? v[0] : null,
        lastTabbableNode: v.length > 0 ? v[v.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(S) {
          var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, R = I.findIndex(function(L) {
            return L === S;
          });
          if (!(R < 0))
            return $ ? I.slice(R + 1).find(function(L) {
              return et(L, r.tabbableOptions);
            }) : I.slice(0, R).reverse().find(function(L) {
              return et(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(g) {
      return g.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, h = function _(g) {
    if (g !== !1 && g !== i.activeElement) {
      if (!g || !g.focus) {
        _(u());
        return;
      }
      g.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = g, za(g) && g.select();
    }
  }, b = function(g) {
    var v = c("setReturnFocus", g);
    return v || (v === !1 ? !1 : g);
  }, x = function(g) {
    var v = tt(g);
    if (!(l(v) >= 0)) {
      if (Re(r.clickOutsideDeactivates, g)) {
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
          returnFocus: r.returnFocusOnDeactivate && !rt(v, r.tabbableOptions)
        });
        return;
      }
      Re(r.allowOutsideClick, g) || g.preventDefault();
    }
  }, w = function(g) {
    var v = tt(g), I = l(v) >= 0;
    I || v instanceof Document ? I && (s.mostRecentlyFocusedNode = v) : (g.stopImmediatePropagation(), h(s.mostRecentlyFocusedNode || u()));
  }, p = function(g) {
    var v = tt(g);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var C = l(v), S = C >= 0 ? s.containerGroups[C] : void 0;
      if (C < 0)
        g.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var $ = ni(s.tabbableGroups, function(z) {
          var D = z.firstTabbableNode;
          return v === D;
        });
        if ($ < 0 && (S.container === v || rt(v, r.tabbableOptions) && !et(v, r.tabbableOptions) && !S.nextTabbableNode(v, !1)) && ($ = C), $ >= 0) {
          var R = $ === 0 ? s.tabbableGroups.length - 1 : $ - 1, L = s.tabbableGroups[R];
          I = L.lastTabbableNode;
        }
      } else {
        var V = ni(s.tabbableGroups, function(z) {
          var D = z.lastTabbableNode;
          return v === D;
        });
        if (V < 0 && (S.container === v || rt(v, r.tabbableOptions) && !et(v, r.tabbableOptions) && !S.nextTabbableNode(v)) && (V = C), V >= 0) {
          var P = V === s.tabbableGroups.length - 1 ? 0 : V + 1, ae = s.tabbableGroups[P];
          I = ae.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (g.preventDefault(), h(I));
  }, m = function(g) {
    if (Ba(g) && Re(r.escapeDeactivates, g) !== !1) {
      g.preventDefault(), o.deactivate();
      return;
    }
    if (ja(g)) {
      p(g);
      return;
    }
  }, f = function(g) {
    var v = tt(g);
    l(v) >= 0 || Re(r.clickOutsideDeactivates, g) || Re(r.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, y = function() {
    if (s.active)
      return ei.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? ti(function() {
        h(u());
      }) : h(u()), i.addEventListener("focusin", w, !0), i.addEventListener("mousedown", x, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", x, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", f, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", m, {
        capture: !0,
        passive: !1
      }), o;
  }, E = function() {
    if (s.active)
      return i.removeEventListener("focusin", w, !0), i.removeEventListener("mousedown", x, !0), i.removeEventListener("touchstart", x, !0), i.removeEventListener("click", f, !0), i.removeEventListener("keydown", m, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(g) {
      if (s.active)
        return this;
      var v = a(g, "onActivate"), I = a(g, "onPostActivate"), C = a(g, "checkCanFocusTrap");
      C || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, v && v();
      var S = function() {
        C && d(), y(), I && I();
      };
      return C ? (C(s.containers.concat()).then(S, S), this) : (S(), this);
    },
    deactivate: function(g) {
      if (!s.active)
        return this;
      var v = Qn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, g);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, ei.deactivateTrap(o);
      var I = a(v, "onDeactivate"), C = a(v, "onPostDeactivate"), S = a(v, "checkCanReturnFocus"), $ = a(v, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var R = function() {
        ti(function() {
          $ && h(b(s.nodeFocusedBeforeActivation)), C && C();
        });
      };
      return $ && S ? (S(b(s.nodeFocusedBeforeActivation)).then(R, R), this) : (R(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), y(), this);
    },
    updateContainerElements: function(g) {
      var v = [].concat(g).filter(Boolean);
      return s.containers = v.map(function(I) {
        return typeof I == "string" ? i.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function Ha(e) {
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
        return Array.isArray(r) ? r : $r(r, { displayCheck: "none" });
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
      }, h = () => {
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let p = i.querySelector("[autofocus]");
        p && (d.initialFocus = p);
      }
      s.includes("inert") && (d.onPostActivate = () => {
        e.nextTick(() => {
          h = ii(i);
        });
      });
      let b = Wa(i, d), x = () => {
      };
      const w = () => {
        h(), h = () => {
        }, x(), x = () => {
        }, b.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (x = Va()), setTimeout(() => {
          b.activate();
        }, 15)), !p && u && w(), u = !!p);
      })), l(w);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ii(i);
    }
  ));
}
function ii(e) {
  let t = [];
  return Nr(e, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Nr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? Nr(e.parentNode, t) : t(n);
  });
}
function Va() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var qa = Ha;
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
function Ua(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Ya(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function Ka(e, t, n) {
  return t && Ya(e.prototype, t), e;
}
var Ga = Object.defineProperty, Z = function(e, t) {
  return Ga(e, "name", { value: t, configurable: !0 });
}, Ja = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Za = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Xa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Qa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, el = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, tl = Z(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Le = Z(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), T = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, te = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ri = { OUTLINE: "outline", FILLED: "filled" }, Pt = { FADE: "fade", SLIDE: "slide" }, Me = { CLOSE: Le(Ja), SUCCESS: Le(Qa), ERROR: Le(Za), WARNING: Le(el), INFO: Le(Xa) }, si = Z(function(e) {
  e.wrapper.classList.add(T.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(T.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), oi = Z(function(e) {
  e.wrapper.classList.remove(T.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), nl = Z(function(e) {
  e.wrapper.classList.add(T.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(T.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), il = Z(function(e) {
  e.wrapper.classList.remove(T.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), kr = function() {
  function e(t) {
    var n = this;
    Ua(this, e), this.notifyOut = Z(function(z) {
      z(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? Pt.FADE : c, d = t.type, h = d === void 0 ? "outline" : d, b = t.title, x = t.text, w = t.showIcon, p = w === void 0 ? !0 : w, m = t.customIcon, f = m === void 0 ? "" : m, y = t.customClass, E = y === void 0 ? "" : y, _ = t.speed, g = _ === void 0 ? 500 : _, v = t.showCloseButton, I = v === void 0 ? !0 : v, C = t.autoclose, S = C === void 0 ? !0 : C, $ = t.autotimeout, R = $ === void 0 ? 3e3 : $, L = t.position, V = L === void 0 ? "right top" : L, P = t.customWrapper, ae = P === void 0 ? "" : P;
    if (this.customWrapper = ae, this.status = l, this.title = b, this.text = x, this.showIcon = p, this.customIcon = f, this.customClass = E, this.speed = g, this.effect = u, this.showCloseButton = I, this.autoclose = S, this.autotimeout = R, this.notificationsGap = r, this.notificationsPadding = o, this.type = h, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Ka(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(T.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(T.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](T.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](T.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](T.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](T.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](T.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](T.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](T.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(T.NOTIFY_CLOSE), i.innerHTML = Me.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = tl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(T.NOTIFY), this.type) {
      case ri.OUTLINE:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
        break;
      case ri.FILLED:
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
    var n = Z(function(r) {
      switch (r) {
        case te.SUCCESS:
          return Me.SUCCESS;
        case te.ERROR:
          return Me.ERROR;
        case te.WARNING:
          return Me.WARNING;
        case te.INFO:
          return Me.INFO;
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
      case Pt.FADE:
        this.selectedNotifyInEffect = si, this.selectedNotifyOutEffect = oi;
        break;
      case Pt.SLIDE:
        this.selectedNotifyInEffect = nl, this.selectedNotifyOutEffect = il;
        break;
      default:
        this.selectedNotifyInEffect = si, this.selectedNotifyOutEffect = oi;
    }
  } }]), e;
}();
Z(kr, "Notify");
var Rr = kr;
globalThis.Notify = Rr;
const Lr = ["success", "error", "warning", "info"], Mr = [
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
], Pr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Pe(e = {}) {
  const t = {
    ...Pr,
    ...e
  };
  Lr.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Mr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Rr(t);
}
const rl = {
  custom: Pe,
  success(e, t = "Success", n = {}) {
    Pe({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    Pe({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    Pe({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    Pe({
      status: "info",
      title: t,
      text: e,
      ...n
    });
  },
  setDefaults(e = {}) {
    Object.assign(Pr, e);
  },
  get allowedStatuses() {
    return [...Lr];
  },
  get allowedPositions() {
    return [...Mr];
  }
}, sn = function() {
}, We = {}, dt = {}, He = {};
function sl(e, t) {
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
    l = He[o] = He[o] || [], l.push(s);
  }
}
function Dr(e, t) {
  if (!e) return;
  const n = He[e];
  if (dt[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function on(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || sn)(t) : (e.success || sn)(e);
}
function ol(e, t, n, i, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Fr(t, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(t, l, e.defaultPrevented);
}
function Fr(e, t, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || sn, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, h;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    h = r.createElement("link"), h.rel = "stylesheet", h.href = c, u = "hideFocus" in h, u && h.relList && (u = 0, h.rel = "preload", h.as = "style"), n.inlineStyleNonce && h.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    h = r.createElement("img"), h.src = c;
  else if (h = r.createElement("script"), h.src = c, h.async = s === void 0 ? !0 : s, n.inlineScriptNonce && h.setAttribute("nonce", n.inlineScriptNonce), d = "noModule" in h, /^module!/.test(l)) {
    if (!d) return t(e, "l");
    h.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return t(e, "l");
  const b = function(x) {
    ol(x, e, h, t, n, i, o, u);
  };
  h.addEventListener("load", b, { once: !0 }), h.addEventListener("error", b, { once: !0 }), a(e, h) !== !1 && r.head.appendChild(h);
}
function al(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let i = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Fr(e[o], s, n);
}
function ne(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in We)
      throw "LoadJS";
    We[i] = !0;
  }
  function s(o, a) {
    al(e, function(l) {
      on(r, l), o && on({ success: o, error: a }, l), Dr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
ne.ready = function(t, n) {
  return sl(t, function(i) {
    on(n, i);
  }), ne;
};
ne.done = function(t) {
  Dr(t, []);
};
ne.reset = function() {
  Object.keys(We).forEach((t) => delete We[t]), Object.keys(dt).forEach((t) => delete dt[t]), Object.keys(He).forEach((t) => delete He[t]);
};
ne.isDefined = function(t) {
  return t in We;
};
function ll(e) {
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
function cl(e) {
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
function ul(e) {
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
function dl(e) {
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
function fl(e) {
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
function hl(e) {
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
function pl(e, t) {
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
  e.data("rzCarousel", () => ({
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
      i.length > 0 && typeof t == "function" ? t(
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
function gl(e) {
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
function ml(e, t) {
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
function bl(e) {
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
function vl(e, t) {
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
const an = Math.min, ye = Math.max, ft = Math.round, Y = (e) => ({
  x: e,
  y: e
}), yl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, wl = {
  start: "end",
  end: "start"
};
function ai(e, t, n) {
  return ye(e, an(t, n));
}
function Ct(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function be(e) {
  return e.split("-")[0];
}
function Tt(e) {
  return e.split("-")[1];
}
function zr(e) {
  return e === "x" ? "y" : "x";
}
function Br(e) {
  return e === "y" ? "height" : "width";
}
function pe(e) {
  return ["top", "bottom"].includes(be(e)) ? "y" : "x";
}
function jr(e) {
  return zr(pe(e));
}
function xl(e, t, n) {
  n === void 0 && (n = !1);
  const i = Tt(e), r = jr(e), s = Br(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = ht(o)), [o, ht(o)];
}
function _l(e) {
  const t = ht(e);
  return [ln(e), t, ln(t)];
}
function ln(e) {
  return e.replace(/start|end/g, (t) => wl[t]);
}
function El(e, t, n) {
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
function Il(e, t, n, i) {
  const r = Tt(e);
  let s = El(be(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(ln)))), s;
}
function ht(e) {
  return e.replace(/left|right|bottom|top/g, (t) => yl[t]);
}
function Sl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Cl(e) {
  return typeof e != "number" ? Sl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function pt(e) {
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
function li(e, t, n) {
  let {
    reference: i,
    floating: r
  } = e;
  const s = pe(t), o = jr(t), a = Br(o), l = be(t), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, h = i[a] / 2 - r[a] / 2;
  let b;
  switch (l) {
    case "top":
      b = {
        x: u,
        y: i.y - r.height
      };
      break;
    case "bottom":
      b = {
        x: u,
        y: i.y + i.height
      };
      break;
    case "right":
      b = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      b = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      b = {
        x: i.x,
        y: i.y
      };
  }
  switch (Tt(t)) {
    case "start":
      b[o] -= h * (n && c ? -1 : 1);
      break;
    case "end":
      b[o] += h * (n && c ? -1 : 1);
      break;
  }
  return b;
}
const Tl = async (e, t, n) => {
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
  } = li(c, i, l), h = i, b = {}, x = 0;
  for (let w = 0; w < a.length; w++) {
    const {
      name: p,
      fn: m
    } = a[w], {
      x: f,
      y,
      data: E,
      reset: _
    } = await m({
      x: u,
      y: d,
      initialPlacement: i,
      placement: h,
      strategy: r,
      middlewareData: b,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = f ?? u, d = y ?? d, b = {
      ...b,
      [p]: {
        ...b[p],
        ...E
      }
    }, _ && x <= 50 && (x++, typeof _ == "object" && (_.placement && (h = _.placement), _.rects && (c = _.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : _.rects), {
      x: u,
      y: d
    } = li(c, h, l)), w = -1);
  }
  return {
    x: u,
    y: d,
    placement: h,
    strategy: r,
    middlewareData: b
  };
};
async function Wr(e, t) {
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
    altBoundary: h = !1,
    padding: b = 0
  } = Ct(t, e), x = Cl(b), p = a[h ? d === "floating" ? "reference" : "floating" : d], m = pt(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(p))) == null || n ? p : p.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), f = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), E = await (s.isElement == null ? void 0 : s.isElement(y)) ? await (s.getScale == null ? void 0 : s.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = pt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: f,
    offsetParent: y,
    strategy: l
  }) : f);
  return {
    top: (m.top - _.top + x.top) / E.y,
    bottom: (_.bottom - m.bottom + x.bottom) / E.y,
    left: (m.left - _.left + x.left) / E.x,
    right: (_.right - m.right + x.right) / E.x
  };
}
const Ol = function(e) {
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
        fallbackPlacements: h,
        fallbackStrategy: b = "bestFit",
        fallbackAxisSideDirection: x = "none",
        flipAlignment: w = !0,
        ...p
      } = Ct(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const m = be(r), f = pe(a), y = be(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = h || (y || !w ? [ht(a)] : _l(a)), g = x !== "none";
      !h && g && _.push(...Il(a, w, x, E));
      const v = [a, ..._], I = await Wr(t, p), C = [];
      let S = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && C.push(I[m]), d) {
        const P = xl(r, o, E);
        C.push(I[P[0]], I[P[1]]);
      }
      if (S = [...S, {
        placement: r,
        overflows: C
      }], !C.every((P) => P <= 0)) {
        var $, R;
        const P = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, ae = v[P];
        if (ae) {
          var L;
          const D = d === "alignment" ? f !== pe(ae) : !1, q = ((L = S[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!D || q)
            return {
              data: {
                index: P,
                overflows: S
              },
              reset: {
                placement: ae
              }
            };
        }
        let z = (R = S.filter((D) => D.overflows[0] <= 0).sort((D, q) => D.overflows[1] - q.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!z)
          switch (b) {
            case "bestFit": {
              var V;
              const D = (V = S.filter((q) => {
                if (g) {
                  const Q = pe(q.placement);
                  return Q === f || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Q === "y";
                }
                return !0;
              }).map((q) => [q.placement, q.overflows.filter((Q) => Q > 0).reduce((Q, Xr) => Q + Xr, 0)]).sort((q, Q) => q[1] - Q[1])[0]) == null ? void 0 : V[0];
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
async function Al(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = be(n), a = Tt(n), l = pe(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Ct(t, e);
  let {
    mainAxis: h,
    crossAxis: b,
    alignmentAxis: x
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof x == "number" && (b = a === "end" ? x * -1 : x), l ? {
    x: b * u,
    y: h * c
  } : {
    x: h * c,
    y: b * u
  };
}
const $l = function(e) {
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
      } = t, l = await Al(t, e);
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
}, Nl = function(e) {
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
          fn: (p) => {
            let {
              x: m,
              y: f
            } = p;
            return {
              x: m,
              y: f
            };
          }
        },
        ...l
      } = Ct(e, t), c = {
        x: n,
        y: i
      }, u = await Wr(t, l), d = pe(be(r)), h = zr(d);
      let b = c[h], x = c[d];
      if (s) {
        const p = h === "y" ? "top" : "left", m = h === "y" ? "bottom" : "right", f = b + u[p], y = b - u[m];
        b = ai(f, b, y);
      }
      if (o) {
        const p = d === "y" ? "top" : "left", m = d === "y" ? "bottom" : "right", f = x + u[p], y = x - u[m];
        x = ai(f, x, y);
      }
      const w = a.fn({
        ...t,
        [h]: b,
        [d]: x
      });
      return {
        ...w,
        data: {
          x: w.x - n,
          y: w.y - i,
          enabled: {
            [h]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Ot() {
  return typeof window < "u";
}
function Ae(e) {
  return Hr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function M(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function X(e) {
  var t;
  return (t = (Hr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Hr(e) {
  return Ot() ? e instanceof Node || e instanceof M(e).Node : !1;
}
function j(e) {
  return Ot() ? e instanceof Element || e instanceof M(e).Element : !1;
}
function K(e) {
  return Ot() ? e instanceof HTMLElement || e instanceof M(e).HTMLElement : !1;
}
function ci(e) {
  return !Ot() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof M(e).ShadowRoot;
}
function Ke(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function kl(e) {
  return ["table", "td", "th"].includes(Ae(e));
}
function At(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Nn(e) {
  const t = kn(), n = j(e) ? W(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Rl(e) {
  let t = se(e);
  for (; K(t) && !Ee(t); ) {
    if (Nn(t))
      return t;
    if (At(t))
      return null;
    t = se(t);
  }
  return null;
}
function kn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ee(e) {
  return ["html", "body", "#document"].includes(Ae(e));
}
function W(e) {
  return M(e).getComputedStyle(e);
}
function $t(e) {
  return j(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function se(e) {
  if (Ae(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    ci(e) && e.host || // Fallback.
    X(e)
  );
  return ci(t) ? t.host : t;
}
function Vr(e) {
  const t = se(e);
  return Ee(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : K(t) && Ke(t) ? t : Vr(t);
}
function qr(e, t, n) {
  var i;
  t === void 0 && (t = []);
  const r = Vr(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = M(r);
  return s ? (cn(o), t.concat(o, o.visualViewport || [], Ke(r) ? r : [], [])) : t.concat(r, qr(r, []));
}
function cn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Ur(e) {
  const t = W(e);
  let n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const r = K(e), s = r ? e.offsetWidth : n, o = r ? e.offsetHeight : i, a = ft(n) !== s || ft(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Yr(e) {
  return j(e) ? e : e.contextElement;
}
function we(e) {
  const t = Yr(e);
  if (!K(t))
    return Y(1);
  const n = t.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Ur(t);
  let o = (s ? ft(n.width) : n.width) / i, a = (s ? ft(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Ll = /* @__PURE__ */ Y(0);
function Kr(e) {
  const t = M(e);
  return !kn() || !t.visualViewport ? Ll : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Ml(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== M(e) ? !1 : t;
}
function Ve(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = Yr(e);
  let o = Y(1);
  t && (i ? j(i) && (o = we(i)) : o = we(e));
  const a = Ml(s, n, i) ? Kr(s) : Y(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const h = M(s), b = i && j(i) ? M(i) : i;
    let x = h, w = cn(x);
    for (; w && i && b !== x; ) {
      const p = we(w), m = w.getBoundingClientRect(), f = W(w), y = m.left + (w.clientLeft + parseFloat(f.paddingLeft)) * p.x, E = m.top + (w.clientTop + parseFloat(f.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += y, c += E, x = M(w), w = cn(x);
    }
  }
  return pt({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Rn(e, t) {
  const n = $t(e).scrollLeft;
  return t ? t.left + n : Ve(X(e)).left + n;
}
function Gr(e, t, n) {
  n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), r = i.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Rn(e, i)
  )), s = i.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Pl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = X(i), a = t ? At(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Y(1);
  const u = Y(0), d = K(i);
  if ((d || !d && !s) && ((Ae(i) !== "body" || Ke(o)) && (l = $t(i)), K(i))) {
    const b = Ve(i);
    c = we(i), u.x = b.x + i.clientLeft, u.y = b.y + i.clientTop;
  }
  const h = o && !d && !s ? Gr(o, l, !0) : Y(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + h.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + h.y
  };
}
function Dl(e) {
  return Array.from(e.getClientRects());
}
function Fl(e) {
  const t = X(e), n = $t(e), i = e.ownerDocument.body, r = ye(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = ye(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Rn(e);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += ye(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function zl(e, t) {
  const n = M(e), i = X(e), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = kn();
    (!c || c && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Bl(e, t) {
  const n = Ve(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = K(e) ? we(e) : Y(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function ui(e, t, n) {
  let i;
  if (t === "viewport")
    i = zl(e, n);
  else if (t === "document")
    i = Fl(X(e));
  else if (j(t))
    i = Bl(t, n);
  else {
    const r = Kr(e);
    i = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return pt(i);
}
function Jr(e, t) {
  const n = se(e);
  return n === t || !j(n) || Ee(n) ? !1 : W(n).position === "fixed" || Jr(n, t);
}
function jl(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = qr(e, []).filter((a) => j(a) && Ae(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? se(e) : e;
  for (; j(o) && !Ee(o); ) {
    const a = W(o), l = Nn(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ke(o) && !l && Jr(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = se(o);
  }
  return t.set(e, i), i;
}
function Wl(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? At(t) ? [] : jl(t, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = ui(t, u, r);
    return c.top = ye(d.top, c.top), c.right = an(d.right, c.right), c.bottom = an(d.bottom, c.bottom), c.left = ye(d.left, c.left), c;
  }, ui(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Hl(e) {
  const {
    width: t,
    height: n
  } = Ur(e);
  return {
    width: t,
    height: n
  };
}
function Vl(e, t, n) {
  const i = K(t), r = X(t), s = n === "fixed", o = Ve(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Y(0);
  function c() {
    l.x = Rn(r);
  }
  if (i || !i && !s)
    if ((Ae(t) !== "body" || Ke(r)) && (a = $t(t)), i) {
      const b = Ve(t, !0, s, t);
      l.x = b.x + t.clientLeft, l.y = b.y + t.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Gr(r, a) : Y(0), d = o.left + a.scrollLeft - l.x - u.x, h = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: h,
    width: o.width,
    height: o.height
  };
}
function Dt(e) {
  return W(e).position === "static";
}
function di(e, t) {
  if (!K(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return X(e) === n && (n = n.ownerDocument.body), n;
}
function Zr(e, t) {
  const n = M(e);
  if (At(e))
    return n;
  if (!K(e)) {
    let r = se(e);
    for (; r && !Ee(r); ) {
      if (j(r) && !Dt(r))
        return r;
      r = se(r);
    }
    return n;
  }
  let i = di(e, t);
  for (; i && kl(i) && Dt(i); )
    i = di(i, t);
  return i && Ee(i) && Dt(i) && !Nn(i) ? n : i || Rl(e) || n;
}
const ql = async function(e) {
  const t = this.getOffsetParent || Zr, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: Vl(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Ul(e) {
  return W(e).direction === "rtl";
}
const Yl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Pl,
  getDocumentElement: X,
  getClippingRect: Wl,
  getOffsetParent: Zr,
  getElementRects: ql,
  getClientRects: Dl,
  getDimensions: Hl,
  getScale: we,
  isElement: j,
  isRTL: Ul
}, gt = $l, mt = Nl, bt = Ol, vt = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Yl,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Tl(e, t, {
    ...r,
    platform: s
  });
};
function Kl(e) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), vt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [gt(this.pixelOffset), bt(), mt({ padding: 8 })]
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
      !this.triggerEl || !t || vt(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [gt(this.pixelOffset), bt(), mt({ padding: 8 })]
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
function Gl(e) {
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
function Jl(e) {
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
function Zl(e) {
  e.data("rzEmpty", () => {
  });
}
function Xl(e) {
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
function Ql(e) {
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
function ec(e, t) {
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
function tc(e) {
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
function nc(e, t) {
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
      !o || !a || (vt(o, a, {
        placement: "bottom-start",
        middleware: [gt(6), bt(), mt({ padding: 8 })]
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
function ic(e) {
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
      c.push(gt({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(bt()), a && c.push(mt({ padding: l })), vt(this.triggerEl, this.contentEl, {
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
function rc(e) {
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
function sc(e) {
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
function oc(e) {
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
function ac(e) {
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
function lc(e) {
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
function cc(e) {
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
async function uc(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function Fe(e, t, n) {
  uc(e).then((i) => {
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
function dc(e) {
  cl(e), ul(e), dl(e), fl(e), hl(e), pl(e, Fe), gl(e), ml(e, Fe), bl(e), vl(e, Fe), Kl(e), Gl(e), Jl(e), Zl(e), Xl(e), Ql(e), ec(e, Fe), nc(e), tc(e), ic(e), rc(e), sc(e), oc(e), ac(e), lc(e), cc(e);
}
function fc(e) {
  if (!(e instanceof Element))
    return console.warn("[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el)."), {};
  const t = e.dataset.propsId;
  if (!t)
    return {};
  const n = document.getElementById(t);
  if (!n)
    return console.warn(`[Rizzy.props] Could not find the props script tag with ID '${t}'.`), {};
  try {
    return JSON.parse(n.textContent || "{}");
  } catch (i) {
    return console.error(`[Rizzy.props] Failed to parse JSON from script tag #${t}.`, i), {};
  }
}
function hc(e, t) {
  const n = () => {
    window.Alpine && typeof window.Alpine.asyncData == "function" ? window.Alpine.asyncData(
      e,
      () => import(t).catch((i) => (console.error(`[RizzyUI] Failed to load Alpine module '${e}' from '${t}'.`, i), () => ({
        _error: !0,
        _errorMessage: `Module '${e}' failed to load.`
      })))
    ) : console.error(`[RizzyUI] Could not register async component '${e}'. Alpine.js or the AsyncAlpine plugin was not available when 'alpine:init' fired.`);
  };
  window.Alpine && window.Alpine.version ? n() : document.addEventListener("alpine:init", n, { once: !0 });
}
function pc(e) {
  e.directive("mobile", (t, { modifiers: n, expression: i }, { cleanup: r }) => {
    const s = n.find((m) => m.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(i && i.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (m) => {
      t.dataset.mobile = m ? "true" : "false", t.dataset.screen = m ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (m) => {
      if (!a) return;
      const f = u();
      f && (f[i] = m);
    }, h = (m) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: m, width: window.innerWidth, breakpoint: o }
        })
      );
    }, b = window.matchMedia(`(max-width: ${o - 1}px)`), x = () => {
      const m = l();
      c(m), d(m), h(m);
    };
    x();
    const w = () => x(), p = () => x();
    b.addEventListener("change", w), window.addEventListener("resize", p, { passive: !0 }), r(() => {
      b.removeEventListener("change", w), window.removeEventListener("resize", p);
    });
  });
}
function gc(e) {
  const t = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (w, p, m) => {
      const y = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = y.pop();
      let _ = w;
      for (const g of y)
        (_[g] == null || typeof _[g] != "object") && (_[g] = isFinite(+g) ? [] : {}), _ = _[g];
      _[E] = m;
    }, l = e.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-sync] Could not find direct parent/child x-data. Ensure x-sync is used one level inside a parent component.");
      return;
    }
    const d = i.split(",").map((w) => w.trim()).filter(Boolean).map((w) => {
      const p = w.split("->").map((m) => m.trim());
      return p.length !== 2 ? (console.warn('[x-sync] Invalid mapping (expected "parent.path -> child.path"): ', w), null) : { parentPath: p[0], childPath: p[1] };
    }).filter(Boolean), h = r.includes("init-child") || r.includes("child") || r.includes("childWins"), b = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: h
      // avoid redundant first child->parent write
    })), x = [];
    d.forEach((w, p) => {
      const m = b[p];
      if (h) {
        const E = e.evaluate(n, w.childPath, { scope: c });
        m.fromChild = !0, a(u, w.parentPath, E), queueMicrotask(() => {
          m.fromChild = !1;
        });
      } else {
        const E = e.evaluate(n, w.parentPath, { scope: u });
        m.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          m.fromParent = !1;
        });
      }
      const f = o(() => {
        const E = e.evaluate(n, w.parentPath, { scope: u });
        m.fromChild || (m.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          m.fromParent = !1;
        }));
      }), y = o(() => {
        const E = e.evaluate(n, w.childPath, { scope: c });
        if (!m.fromParent) {
          if (m.skipChildOnce) {
            m.skipChildOnce = !1;
            return;
          }
          m.fromChild = !0, a(u, w.parentPath, E), queueMicrotask(() => {
            m.fromChild = !1;
          });
        }
      });
      x.push(f, y);
    }), s(() => {
      for (const w of x)
        try {
          w && w();
        } catch {
        }
    });
  };
  e.directive("sync", t);
}
G.plugin(ya);
G.plugin(Ia);
G.plugin(qa);
G.plugin(ba);
dc(G);
pc(G);
gc(G);
const mc = {
  Alpine: G,
  require: Fe,
  toast: rl,
  $data: ll,
  props: fc,
  registerAsyncComponent: hc
};
window.Alpine = G;
window.Rizzy = { ...window.Rizzy || {}, ...mc };
G.start();
export {
  mc as default
};
