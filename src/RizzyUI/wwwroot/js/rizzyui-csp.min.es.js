var Vt = !1, Wt = !1, fe = [], qt = -1;
function us(e) {
  ds(e);
}
function ds(e) {
  fe.includes(e) || fe.push(e), hs();
}
function fs(e) {
  let t = fe.indexOf(e);
  t !== -1 && t > qt && fe.splice(t, 1);
}
function hs() {
  !Wt && !Vt && (Vt = !0, queueMicrotask(ps));
}
function ps() {
  Vt = !1, Wt = !0;
  for (let e = 0; e < fe.length; e++)
    fe[e](), qt = e;
  fe.length = 0, qt = -1, Wt = !1;
}
var Te, _e, Se, yn, Ht = !0;
function ms(e) {
  Ht = !1, e(), Ht = !0;
}
function gs(e) {
  Te = e.reactive, Se = e.release, _e = (t) => e.effect(t, { scheduler: (i) => {
    Ht ? us(i) : i();
  } }), yn = e.raw;
}
function Mi(e) {
  _e = e;
}
function vs(e) {
  let t = () => {
  };
  return [(n) => {
    let r = _e(n);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Se(r));
    }, r;
  }, () => {
    t();
  }];
}
function wn(e, t) {
  let i = !0, n, r = _e(() => {
    let s = e();
    JSON.stringify(s), i ? n = s : queueMicrotask(() => {
      t(s, n), n = s;
    }), i = !1;
  });
  return () => Se(r);
}
var _n = [], xn = [], En = [];
function bs(e) {
  En.push(e);
}
function hi(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, xn.push(t));
}
function In(e) {
  _n.push(e);
}
function Cn(e, t, i) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(i);
}
function Tn(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([i, n]) => {
    (t === void 0 || t.includes(i)) && (n.forEach((r) => r()), delete e._x_attributeCleanups[i]);
  });
}
function ys(e) {
  for (e._x_effects?.forEach(fs); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var pi = new MutationObserver(bi), mi = !1;
function gi() {
  pi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), mi = !0;
}
function Sn() {
  ws(), pi.disconnect(), mi = !1;
}
var Re = [];
function ws() {
  let e = pi.takeRecords();
  Re.push(() => e.length > 0 && bi(e));
  let t = Re.length;
  queueMicrotask(() => {
    if (Re.length === t)
      for (; Re.length > 0; )
        Re.shift()();
  });
}
function $(e) {
  if (!mi)
    return e();
  Sn();
  let t = e();
  return gi(), t;
}
var vi = !1, ct = [];
function _s() {
  vi = !0;
}
function xs() {
  vi = !1, bi(ct), ct = [];
}
function bi(e) {
  if (vi) {
    ct = ct.concat(e);
    return;
  }
  let t = [], i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (let s = 0; s < e.length; s++)
    if (!e[s].target._x_ignoreMutationObserver && (e[s].type === "childList" && (e[s].removedNodes.forEach((o) => {
      o.nodeType === 1 && o._x_marker && i.add(o);
    }), e[s].addedNodes.forEach((o) => {
      if (o.nodeType === 1) {
        if (i.has(o)) {
          i.delete(o);
          return;
        }
        o._x_marker || t.push(o);
      }
    })), e[s].type === "attributes")) {
      let o = e[s].target, a = e[s].attributeName, l = e[s].oldValue, c = () => {
        n.has(o) || n.set(o, []), n.get(o).push({ name: a, value: o.getAttribute(a) });
      }, u = () => {
        r.has(o) || r.set(o, []), r.get(o).push(a);
      };
      o.hasAttribute(a) && l === null ? c() : o.hasAttribute(a) ? (u(), c()) : u();
    }
  r.forEach((s, o) => {
    Tn(o, s);
  }), n.forEach((s, o) => {
    _n.forEach((a) => a(o, s));
  });
  for (let s of i)
    t.some((o) => o.contains(s)) || xn.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && En.forEach((o) => o(s));
  t = null, i = null, n = null, r = null;
}
function An(e) {
  return Ae(ve(e));
}
function Je(e, t, i) {
  return e._x_dataStack = [t, ...ve(i || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
  };
}
function ve(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? ve(e.host) : e.parentNode ? ve(e.parentNode) : [];
}
function Ae(e) {
  return new Proxy({ objects: e }, Es);
}
var Es = {
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
    return t == "toJSON" ? Is : Reflect.get(
      e.find(
        (n) => Reflect.has(n, t)
      ) || {},
      t,
      i
    );
  },
  set({ objects: e }, t, i, n) {
    const r = e.find(
      (o) => Object.prototype.hasOwnProperty.call(o, t)
    ) || e[e.length - 1], s = Object.getOwnPropertyDescriptor(r, t);
    return s?.set && s?.get ? s.set.call(n, i) || !0 : Reflect.set(r, t, i);
  }
};
function Is() {
  return Reflect.ownKeys(this).reduce((t, i) => (t[i] = Reflect.get(this, i), t), {});
}
function On(e) {
  let t = (n) => typeof n == "object" && !Array.isArray(n) && n !== null, i = (n, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = r === "" ? s : `${r}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? n[s] = o.initialize(e, l, s) : t(o) && o !== n && !(o instanceof Element) && i(o, l);
    });
  };
  return i(e);
}
function $n(e, t = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, r, s) {
      return e(this.initialValue, () => Cs(n, r), (o) => Kt(n, r, o), r, s);
    }
  };
  return t(i), (n) => {
    if (typeof n == "object" && n !== null && n._x_interceptor) {
      let r = i.initialize.bind(i);
      i.initialize = (s, o, a) => {
        let l = n.initialize(s, o, a);
        return i.initialValue = l, r(s, o, a);
      };
    } else
      i.initialValue = n;
    return i;
  };
}
function Cs(e, t) {
  return t.split(".").reduce((i, n) => i[n], e);
}
function Kt(e, t, i) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = i;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Kt(e[t[0]], t.slice(1), i);
  }
}
var Nn = {};
function q(e, t) {
  Nn[e] = t;
}
function ut(e, t) {
  let i = Ts(t);
  return Object.entries(Nn).forEach(([n, r]) => {
    Object.defineProperty(e, `$${n}`, {
      get() {
        return r(t, i);
      },
      enumerable: !1
    });
  }), e;
}
function Ts(e) {
  let [t, i] = zn(e), n = { interceptor: $n, ...t };
  return hi(e, i), n;
}
function kn(e, t, i, ...n) {
  try {
    return i(...n);
  } catch (r) {
    qe(r, e, t);
  }
}
function qe(e, t, i = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: i }
  ), console.warn(`Alpine Expression Error: ${e.message}

${i ? 'Expression: "' + i + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var je = !0;
function Rn(e) {
  let t = je;
  je = !1;
  let i = e();
  return je = t, i;
}
function he(e, t, i = {}) {
  let n;
  return R(e, t)((r) => n = r, i), n;
}
function R(...e) {
  return Ln(...e);
}
var Ln = As;
function Ss(e) {
  Ln = e;
}
function As(e, t) {
  let i = {};
  ut(i, e);
  let n = [i, ...ve(e)], r = typeof t == "function" ? Pn(n, t) : $s(n, t, e);
  return kn.bind(null, e, t, r);
}
function Pn(e, t) {
  return (i = () => {
  }, { scope: n = {}, params: r = [], context: s } = {}) => {
    let o = t.apply(Ae([n, ...e]), r);
    dt(i, o);
  };
}
var Dt = {};
function Os(e, t) {
  if (Dt[e])
    return Dt[e];
  let i = Object.getPrototypeOf(async function() {
  }).constructor, n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, s = (() => {
    try {
      let o = new i(
        ["__self", "scope"],
        `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(o, "name", {
        value: `[Alpine] ${e}`
      }), o;
    } catch (o) {
      return qe(o, t, e), Promise.resolve();
    }
  })();
  return Dt[e] = s, s;
}
function $s(e, t, i) {
  let n = Os(t, i);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = Ae([s, ...e]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => qe(u, i, t));
      n.finished ? (dt(r, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        dt(r, u, l, o, i);
      }).catch((u) => qe(u, i, t)).finally(() => n.result = void 0);
    }
  };
}
function dt(e, t, i, n, r) {
  if (je && typeof t == "function") {
    let s = t.apply(i, n);
    s instanceof Promise ? s.then((o) => dt(e, o, i, n)).catch((o) => qe(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var yi = "x-";
function Oe(e = "") {
  return yi + e;
}
function Ns(e) {
  yi = e;
}
var ft = {};
function N(e, t) {
  return ft[e] = t, {
    before(i) {
      if (!ft[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const n = de.indexOf(i);
      de.splice(n >= 0 ? n : de.indexOf("DEFAULT"), 0, e);
    }
  };
}
function ks(e) {
  return Object.keys(ft).includes(e);
}
function wi(e, t, i) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Dn(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let n = {};
  return t.map(Bn((s, o) => n[s] = o)).filter(Vn).map(Ps(n, i)).sort(Ds).map((s) => Ls(e, s));
}
function Dn(e) {
  return Array.from(e).map(Bn()).filter((t) => !Vn(t));
}
var Yt = !1, Be = /* @__PURE__ */ new Map(), Mn = Symbol();
function Rs(e) {
  Yt = !0;
  let t = Symbol();
  Mn = t, Be.set(t, []);
  let i = () => {
    for (; Be.get(t).length; )
      Be.get(t).shift()();
    Be.delete(t);
  }, n = () => {
    Yt = !1, i();
  };
  e(i), n();
}
function zn(e) {
  let t = [], i = (a) => t.push(a), [n, r] = vs(e);
  return t.push(r), [{
    Alpine: Ze,
    effect: n,
    cleanup: i,
    evaluateLater: R.bind(R, e),
    evaluate: he.bind(he, e)
  }, () => t.forEach((a) => a())];
}
function Ls(e, t) {
  let i = () => {
  }, n = ft[t.type] || i, [r, s] = zn(e);
  Cn(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, r), n = n.bind(n, e, t, r), Yt ? Be.get(Mn).push(n) : n());
  };
  return o.runCleanups = s, o;
}
var Fn = (e, t) => ({ name: i, value: n }) => (i.startsWith(e) && (i = i.replace(e, t)), { name: i, value: n }), Un = (e) => e;
function Bn(e = () => {
}) {
  return ({ name: t, value: i }) => {
    let { name: n, value: r } = jn.reduce((s, o) => o(s), { name: t, value: i });
    return n !== t && e(n, t), { name: n, value: r };
  };
}
var jn = [];
function _i(e) {
  jn.push(e);
}
function Vn({ name: e }) {
  return Wn().test(e);
}
var Wn = () => new RegExp(`^${yi}([^:^.]+)\\b`);
function Ps(e, t) {
  return ({ name: i, value: n }) => {
    let r = i.match(Wn()), s = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[i] || i;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: n,
      original: a
    };
  };
}
var Jt = "DEFAULT", de = [
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
  Jt,
  "teleport"
];
function Ds(e, t) {
  let i = de.indexOf(e.type) === -1 ? Jt : e.type, n = de.indexOf(t.type) === -1 ? Jt : t.type;
  return de.indexOf(i) - de.indexOf(n);
}
function Ve(e, t, i = {}) {
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
function be(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((r) => be(r, t));
    return;
  }
  let i = !1;
  if (t(e, () => i = !0), i)
    return;
  let n = e.firstElementChild;
  for (; n; )
    be(n, t), n = n.nextElementSibling;
}
function U(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var zi = !1;
function Ms() {
  zi && U("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), zi = !0, document.body || U("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Ve(document, "alpine:init"), Ve(document, "alpine:initializing"), gi(), bs((t) => G(t, be)), hi((t) => Ne(t)), In((t, i) => {
    wi(t, i).forEach((n) => n());
  });
  let e = (t) => !It(t.parentElement, !0);
  Array.from(document.querySelectorAll(Kn().join(","))).filter(e).forEach((t) => {
    G(t);
  }), Ve(document, "alpine:initialized"), setTimeout(() => {
    Bs();
  });
}
var xi = [], qn = [];
function Hn() {
  return xi.map((e) => e());
}
function Kn() {
  return xi.concat(qn).map((e) => e());
}
function Yn(e) {
  xi.push(e);
}
function Jn(e) {
  qn.push(e);
}
function It(e, t = !1) {
  return $e(e, (i) => {
    if ((t ? Kn() : Hn()).some((r) => i.matches(r)))
      return !0;
  });
}
function $e(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return $e(e.parentElement, t);
  }
}
function zs(e) {
  return Hn().some((t) => e.matches(t));
}
var Zn = [];
function Fs(e) {
  Zn.push(e);
}
var Us = 1;
function G(e, t = be, i = () => {
}) {
  $e(e, (n) => n._x_ignore) || Rs(() => {
    t(e, (n, r) => {
      n._x_marker || (i(n, r), Zn.forEach((s) => s(n, r)), wi(n, n.attributes).forEach((s) => s()), n._x_ignore || (n._x_marker = Us++), n._x_ignore && r());
    });
  });
}
function Ne(e, t = be) {
  t(e, (i) => {
    ys(i), Tn(i), delete i._x_marker;
  });
}
function Bs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, i, n]) => {
    ks(i) || n.some((r) => {
      if (document.querySelector(r))
        return U(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Zt = [], Ei = !1;
function Ii(e = () => {
}) {
  return queueMicrotask(() => {
    Ei || setTimeout(() => {
      Gt();
    });
  }), new Promise((t) => {
    Zt.push(() => {
      e(), t();
    });
  });
}
function Gt() {
  for (Ei = !1; Zt.length; )
    Zt.shift()();
}
function js() {
  Ei = !0;
}
function Ci(e, t) {
  return Array.isArray(t) ? Fi(e, t.join(" ")) : typeof t == "object" && t !== null ? Vs(e, t) : typeof t == "function" ? Ci(e, t()) : Fi(e, t);
}
function Fi(e, t) {
  let i = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), n = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", n(i(t));
}
function Vs(e, t) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(t).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function Ct(e, t) {
  return typeof t == "object" && t !== null ? Ws(e, t) : qs(e, t);
}
function Ws(e, t) {
  let i = {};
  return Object.entries(t).forEach(([n, r]) => {
    i[n] = e.style[n], n.startsWith("--") || (n = Hs(n)), e.style.setProperty(n, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Ct(e, i);
  };
}
function qs(e, t) {
  let i = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", i || "");
  };
}
function Hs(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Xt(e, t = () => {
}) {
  let i = !1;
  return function() {
    i ? t.apply(this, arguments) : (i = !0, e.apply(this, arguments));
  };
}
N("transition", (e, { value: t, modifiers: i, expression: n }, { evaluate: r }) => {
  typeof n == "function" && (n = r(n)), n !== !1 && (!n || typeof n == "boolean" ? Ys(e, i, t) : Ks(e, n, t));
});
function Ks(e, t, i) {
  Gn(e, Ci, ""), {
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
  }[i](t);
}
function Ys(e, t, i) {
  Gn(e, Ct);
  let n = !t.includes("in") && !t.includes("out") && !i, r = n || t.includes("in") || ["enter"].includes(i), s = n || t.includes("out") || ["leave"].includes(i);
  t.includes("in") && !n && (t = t.filter((b, h) => h < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((b, h) => h > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? Le(t, "scale", 95) / 100 : 1, d = Le(t, "delay", 0) / 1e3, f = Le(t, "origin", "center"), y = "opacity, transform", m = Le(t, "duration", 150) / 1e3, v = Le(t, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: y,
    transitionDuration: `${m}s`,
    transitionTimingFunction: p
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: y,
    transitionDuration: `${v}s`,
    transitionTimingFunction: p
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function Gn(e, t, i = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, r = () => {
    }) {
      Qt(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, r);
    },
    out(n = () => {
    }, r = () => {
    }) {
      Qt(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, n, r);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, i, n) {
  const r = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => r(i);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(i) : s() : e._x_transition ? e._x_transition.in(i) : s();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((o, a) => {
    e._x_transition.out(() => {
    }, () => o(n)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(n), queueMicrotask(() => {
    let o = Xn(e);
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
function Xn(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Xn(t);
}
function Qt(e, t, { during: i, start: n, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Js(e, {
    start() {
      a = t(e, n);
    },
    during() {
      l = t(e, i);
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
function Js(e, t) {
  let i, n, r, s = Xt(() => {
    $(() => {
      i = !0, n || t.before(), r || (t.end(), Gt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Xt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, $(() => {
    t.start(), t.during();
  }), js(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), $(() => {
      t.before();
    }), n = !0, requestAnimationFrame(() => {
      i || ($(() => {
        t.end();
      }), Gt(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Le(e, t, i) {
  if (e.indexOf(t) === -1)
    return i;
  const n = e[e.indexOf(t) + 1];
  if (!n || t === "scale" && isNaN(n))
    return i;
  if (t === "duration" || t === "delay") {
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [n, e[e.indexOf(t) + 2]].join(" ") : n;
}
var re = !1;
function ae(e, t = () => {
}) {
  return (...i) => re ? t(...i) : e(...i);
}
function Zs(e) {
  return (...t) => re && e(...t);
}
var Qn = [];
function Tt(e) {
  Qn.push(e);
}
function Gs(e, t) {
  Qn.forEach((i) => i(e, t)), re = !0, er(() => {
    G(t, (i, n) => {
      n(i, () => {
      });
    });
  }), re = !1;
}
var ei = !1;
function Xs(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), re = !0, ei = !0, er(() => {
    Qs(t);
  }), re = !1, ei = !1;
}
function Qs(e) {
  let t = !1;
  G(e, (n, r) => {
    be(n, (s, o) => {
      if (t && zs(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function er(e) {
  let t = _e;
  Mi((i, n) => {
    let r = t(i);
    return Se(r), () => {
    };
  }), e(), Mi(t);
}
function tr(e, t, i, n = []) {
  switch (e._x_bindings || (e._x_bindings = Te({})), e._x_bindings[t] = i, t = n.includes("camel") ? ao(t) : t, t) {
    case "value":
      eo(e, i);
      break;
    case "style":
      io(e, i);
      break;
    case "class":
      to(e, i);
      break;
    case "selected":
    case "checked":
      no(e, t, i);
      break;
    default:
      ir(e, t, i);
      break;
  }
}
function eo(e, t) {
  if (sr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = at(e.value) === t : e.checked = Ui(e.value, t));
  else if (Ti(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((i) => Ui(i, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    oo(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function to(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Ci(e, t);
}
function io(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Ct(e, t);
}
function no(e, t, i) {
  ir(e, t, i), so(e, t, i);
}
function ir(e, t, i) {
  [null, void 0, !1].includes(i) && co(t) ? e.removeAttribute(t) : (nr(t) && (i = t), ro(e, t, i));
}
function ro(e, t, i) {
  e.getAttribute(t) != i && e.setAttribute(t, i);
}
function so(e, t, i) {
  e[t] !== i && (e[t] = i);
}
function oo(e, t) {
  const i = [].concat(t).map((n) => n + "");
  Array.from(e.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function ao(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Ui(e, t) {
  return e == t;
}
function at(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var lo = /* @__PURE__ */ new Set([
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
function nr(e) {
  return lo.has(e);
}
function co(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function uo(e, t, i) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : rr(e, t, i);
}
function fo(e, t, i, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = n, Rn(() => he(e, r.expression));
  }
  return rr(e, t, i);
}
function rr(e, t, i) {
  let n = e.getAttribute(t);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : nr(t) ? !![t, "true"].includes(n) : n;
}
function Ti(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function sr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function or(e, t) {
  let i;
  return function() {
    const n = this, r = arguments, s = function() {
      i = null, e.apply(n, r);
    };
    clearTimeout(i), i = setTimeout(s, t);
  };
}
function ar(e, t) {
  let i;
  return function() {
    let n = this, r = arguments;
    i || (e.apply(n, r), i = !0, setTimeout(() => i = !1, t));
  };
}
function lr({ get: e, set: t }, { get: i, set: n }) {
  let r = !0, s, o = _e(() => {
    let a = e(), l = i();
    if (r)
      n(Mt(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? n(Mt(a)) : c !== u && t(Mt(l));
    }
    s = JSON.stringify(e()), JSON.stringify(i());
  });
  return () => {
    Se(o);
  };
}
function Mt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function ho(e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => i(Ze));
}
var ce = {}, Bi = !1;
function po(e, t) {
  if (Bi || (ce = Te(ce), Bi = !0), t === void 0)
    return ce[e];
  ce[e] = t, On(ce[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ce[e].init();
}
function mo() {
  return ce;
}
var cr = {};
function go(e, t) {
  let i = typeof t != "function" ? () => t : t;
  return e instanceof Element ? ur(e, i()) : (cr[e] = i, () => {
  });
}
function vo(e) {
  return Object.entries(cr).forEach(([t, i]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), e;
}
function ur(e, t, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Dn(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), wi(e, r, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var dr = {};
function bo(e, t) {
  dr[e] = t;
}
function yo(e, t) {
  return Object.entries(dr).forEach(([i, n]) => {
    Object.defineProperty(e, i, {
      get() {
        return (...r) => n.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var wo = {
  get reactive() {
    return Te;
  },
  get release() {
    return Se;
  },
  get effect() {
    return _e;
  },
  get raw() {
    return yn;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: xs,
  dontAutoEvaluateFunctions: Rn,
  disableEffectScheduling: ms,
  startObservingMutations: gi,
  stopObservingMutations: Sn,
  setReactivityEngine: gs,
  onAttributeRemoved: Cn,
  onAttributesAdded: In,
  closestDataStack: ve,
  skipDuringClone: ae,
  onlyDuringClone: Zs,
  addRootSelector: Yn,
  addInitSelector: Jn,
  interceptClone: Tt,
  addScopeToNode: Je,
  deferMutations: _s,
  mapAttributes: _i,
  evaluateLater: R,
  interceptInit: Fs,
  setEvaluator: Ss,
  mergeProxies: Ae,
  extractProp: fo,
  findClosest: $e,
  onElRemoved: hi,
  closestRoot: It,
  destroyTree: Ne,
  interceptor: $n,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Qt,
  // INTERNAL
  setStyles: Ct,
  // INTERNAL
  mutateDom: $,
  directive: N,
  entangle: lr,
  throttle: ar,
  debounce: or,
  evaluate: he,
  initTree: G,
  nextTick: Ii,
  prefixed: Oe,
  prefix: Ns,
  plugin: ho,
  magic: q,
  store: po,
  start: Ms,
  clone: Xs,
  // INTERNAL
  cloneNode: Gs,
  // INTERNAL
  bound: uo,
  $data: An,
  watch: wn,
  walk: be,
  data: bo,
  bind: go
}, Ze = wo, k = class {
  constructor(e, t, i, n) {
    this.type = e, this.value = t, this.start = i, this.end = n;
  }
}, _o = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new k("EOF", null, this.position, this.position)), this.tokens;
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
    this.tokens.push(new k("NUMBER", parseFloat(i), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new k("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new k("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new k("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new k("KEYWORD", t, e, this.position)) : this.tokens.push(new k("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let i = "", n = !1;
    for (; this.position < this.input.length; ) {
      const r = this.input[this.position];
      if (n) {
        switch (r) {
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
            i += r;
        }
        n = !1;
      } else if (r === "\\")
        n = !0;
      else if (r === t) {
        this.position++, this.tokens.push(new k("STRING", i, e, this.position));
        return;
      } else
        i += r;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], i = this.peek(), n = this.peek(2);
    if (t === "=" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new k("OPERATOR", "===", e, this.position));
    else if (t === "!" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new k("OPERATOR", "!==", e, this.position));
    else if (t === "=" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", "==", e, this.position));
    else if (t === "!" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", "!=", e, this.position));
    else if (t === "<" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", "<=", e, this.position));
    else if (t === ">" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", ">=", e, this.position));
    else if (t === "&" && i === "&")
      this.position += 2, this.tokens.push(new k("OPERATOR", "&&", e, this.position));
    else if (t === "|" && i === "|")
      this.position += 2, this.tokens.push(new k("OPERATOR", "||", e, this.position));
    else if (t === "+" && i === "+")
      this.position += 2, this.tokens.push(new k("OPERATOR", "++", e, this.position));
    else if (t === "-" && i === "-")
      this.position += 2, this.tokens.push(new k("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const r = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new k(r, t, e, this.position));
    }
  }
}, xo = class {
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
        for (let r = 1; r < e.length; r++)
          if (this.check(n, e[r]))
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
}, Eo = class {
  evaluate({ node: e, scope: t = {}, context: i = null, allowGlobal: n = !1, forceBindingRootScopeToFunctions: r = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const m = t[e.name];
          return typeof m == "function" ? m.bind(t) : m;
        }
        if (n && typeof globalThis[e.name] < "u") {
          const m = globalThis[e.name];
          return typeof m == "function" ? m.bind(globalThis) : m;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: e.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let o;
        if (e.computed) {
          const m = this.evaluate({ node: e.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          o = s[m];
        } else
          o = s[e.property.name];
        return typeof o == "function" ? r ? o.bind(t) : o.bind(s) : o;
      case "CallExpression":
        const a = e.arguments.map((m) => this.evaluate({ node: m, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }));
        if (e.callee.type === "MemberExpression") {
          const m = this.evaluate({ node: e.callee.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          let v;
          if (e.callee.computed) {
            const p = this.evaluate({ node: e.callee.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
            v = m[p];
          } else
            v = m[e.callee.property.name];
          if (typeof v != "function")
            throw new Error("Value is not a function");
          return v.apply(m, a);
        } else if (e.callee.type === "Identifier") {
          const m = e.callee.name;
          let v;
          if (m in t)
            v = t[m];
          else if (n && typeof globalThis[m] < "u")
            v = globalThis[m];
          else
            throw new Error(`Undefined variable: ${m}`);
          if (typeof v != "function")
            throw new Error("Value is not a function");
          const p = i !== null ? i : t;
          return v.apply(p, a);
        } else {
          const m = this.evaluate({ node: e.callee, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          if (typeof m != "function")
            throw new Error("Value is not a function");
          return m.apply(i, a);
        }
      case "UnaryExpression":
        const l = this.evaluate({ node: e.argument, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        switch (e.operator) {
          case "!":
            return !l;
          case "-":
            return -l;
          case "+":
            return +l;
          default:
            throw new Error(`Unknown unary operator: ${e.operator}`);
        }
      case "UpdateExpression":
        if (e.argument.type === "Identifier") {
          const m = e.argument.name;
          if (!(m in t))
            throw new Error(`Undefined variable: ${m}`);
          const v = t[m];
          return e.operator === "++" ? t[m] = v + 1 : e.operator === "--" && (t[m] = v - 1), e.prefix ? t[m] : v;
        } else if (e.argument.type === "MemberExpression") {
          const m = this.evaluate({ node: e.argument.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), v = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : e.argument.property.name, p = m[v];
          return e.operator === "++" ? m[v] = p + 1 : e.operator === "--" && (m[v] = p - 1), e.prefix ? m[v] : p;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const c = this.evaluate({ node: e.left, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), u = this.evaluate({ node: e.right, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        switch (e.operator) {
          case "+":
            return c + u;
          case "-":
            return c - u;
          case "*":
            return c * u;
          case "/":
            return c / u;
          case "%":
            return c % u;
          case "==":
            return c == u;
          case "!=":
            return c != u;
          case "===":
            return c === u;
          case "!==":
            return c !== u;
          case "<":
            return c < u;
          case ">":
            return c > u;
          case "<=":
            return c <= u;
          case ">=":
            return c >= u;
          case "&&":
            return c && u;
          case "||":
            return c || u;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) ? this.evaluate({ node: e.consequent, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : this.evaluate({ node: e.alternate, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
      case "AssignmentExpression":
        const f = this.evaluate({ node: e.right, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        if (e.left.type === "Identifier")
          return t[e.left.name] = f, f;
        if (e.left.type === "MemberExpression") {
          const m = this.evaluate({ node: e.left.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          if (e.left.computed) {
            const v = this.evaluate({ node: e.left.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
            m[v] = f;
          } else
            m[e.left.property.name] = f;
          return f;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((m) => this.evaluate({ node: m, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }));
      case "ObjectExpression":
        const y = {};
        for (const m of e.properties) {
          const v = m.computed ? this.evaluate({ node: m.key, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : m.key.type === "Identifier" ? m.key.name : this.evaluate({ node: m.key, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), p = this.evaluate({ node: m.value, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          y[v] = p;
        }
        return y;
      default:
        throw new Error(`Unknown node type: ${e.type}`);
    }
  }
};
function Io(e) {
  try {
    const i = new _o(e).tokenize(), r = new xo(i).parse(), s = new Eo();
    return function(o = {}) {
      const { scope: a = {}, context: l = null, allowGlobal: c = !1, forceBindingRootScopeToFunctions: u = !1 } = o;
      return s.evaluate({ node: r, scope: a, context: l, allowGlobal: c, forceBindingRootScopeToFunctions: u });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Co(e, t) {
  let i = To(e);
  if (typeof t == "function")
    return Pn(i, t);
  let n = So(e, t, i);
  return kn.bind(null, e, t, n);
}
function To(e) {
  let t = {};
  return ut(t, e), [t, ...ve(e)];
}
function So(e, t, i) {
  return (n = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Ae([r, ...i]), l = Io(t)({
      scope: o,
      allowGlobal: !0,
      forceBindingRootScopeToFunctions: !0
    });
    if (je && typeof l == "function") {
      let c = l.apply(l, s);
      c instanceof Promise ? c.then((u) => n(u)) : n(c);
    } else typeof l == "object" && l instanceof Promise ? l.then((c) => n(c)) : n(l);
  };
}
function Ao(e, t) {
  const i = /* @__PURE__ */ Object.create(null), n = e.split(",");
  for (let r = 0; r < n.length; r++)
    i[n[r]] = !0;
  return (r) => !!i[r];
}
var Oo = Object.freeze({}), $o = Object.prototype.hasOwnProperty, St = (e, t) => $o.call(e, t), pe = Array.isArray, We = (e) => fr(e) === "[object Map]", No = (e) => typeof e == "string", Si = (e) => typeof e == "symbol", At = (e) => e !== null && typeof e == "object", ko = Object.prototype.toString, fr = (e) => ko.call(e), hr = (e) => fr(e).slice(8, -1), Ai = (e) => No(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ro = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (i) => t[i] || (t[i] = e(i));
}, Lo = Ro((e) => e.charAt(0).toUpperCase() + e.slice(1)), pr = (e, t) => e !== t && (e === e || t === t), ti = /* @__PURE__ */ new WeakMap(), Pe = [], Y, me = Symbol("iterate"), ii = Symbol("Map key iterate");
function Po(e) {
  return e && e._isEffect === !0;
}
function Do(e, t = Oo) {
  Po(e) && (e = e.raw);
  const i = Fo(e, t);
  return t.lazy || i(), i;
}
function Mo(e) {
  e.active && (mr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var zo = 0;
function Fo(e, t) {
  const i = function() {
    if (!i.active)
      return e();
    if (!Pe.includes(i)) {
      mr(i);
      try {
        return Bo(), Pe.push(i), Y = i, e();
      } finally {
        Pe.pop(), gr(), Y = Pe[Pe.length - 1];
      }
    }
  };
  return i.id = zo++, i.allowRecurse = !!t.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = e, i.deps = [], i.options = t, i;
}
function mr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let i = 0; i < t.length; i++)
      t[i].delete(e);
    t.length = 0;
  }
}
var Ie = !0, Oi = [];
function Uo() {
  Oi.push(Ie), Ie = !1;
}
function Bo() {
  Oi.push(Ie), Ie = !0;
}
function gr() {
  const e = Oi.pop();
  Ie = e === void 0 ? !0 : e;
}
function j(e, t, i) {
  if (!Ie || Y === void 0)
    return;
  let n = ti.get(e);
  n || ti.set(e, n = /* @__PURE__ */ new Map());
  let r = n.get(i);
  r || n.set(i, r = /* @__PURE__ */ new Set()), r.has(Y) || (r.add(Y), Y.deps.push(r), Y.options.onTrack && Y.options.onTrack({
    effect: Y,
    target: e,
    type: t,
    key: i
  }));
}
function se(e, t, i, n, r, s) {
  const o = ti.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== Y || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (i === "length" && pe(e))
    o.forEach((u, d) => {
      (d === "length" || d >= n) && l(u);
    });
  else
    switch (i !== void 0 && l(o.get(i)), t) {
      case "add":
        pe(e) ? Ai(i) && l(o.get("length")) : (l(o.get(me)), We(e) && l(o.get(ii)));
        break;
      case "delete":
        pe(e) || (l(o.get(me)), We(e) && l(o.get(ii)));
        break;
      case "set":
        We(e) && l(o.get(me));
        break;
    }
  const c = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: e,
      key: i,
      type: t,
      newValue: n,
      oldValue: r,
      oldTarget: s
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(c);
}
var jo = /* @__PURE__ */ Ao("__proto__,__v_isRef,__isVue"), vr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Si)), Vo = /* @__PURE__ */ br(), Wo = /* @__PURE__ */ br(!0), ji = /* @__PURE__ */ qo();
function qo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...i) {
      const n = O(this);
      for (let s = 0, o = this.length; s < o; s++)
        j(n, "get", s + "");
      const r = n[t](...i);
      return r === -1 || r === !1 ? n[t](...i.map(O)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...i) {
      Uo();
      const n = O(this)[t].apply(this, i);
      return gr(), n;
    };
  }), e;
}
function br(e = !1, t = !1) {
  return function(n, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? sa : xr : t ? ra : _r).get(n))
      return n;
    const o = pe(n);
    if (!e && o && St(ji, r))
      return Reflect.get(ji, r, s);
    const a = Reflect.get(n, r, s);
    return (Si(r) ? vr.has(r) : jo(r)) || (e || j(n, "get", r), t) ? a : ni(a) ? !o || !Ai(r) ? a.value : a : At(a) ? e ? Er(a) : Ri(a) : a;
  };
}
var Ho = /* @__PURE__ */ Ko();
function Ko(e = !1) {
  return function(i, n, r, s) {
    let o = i[n];
    if (!e && (r = O(r), o = O(o), !pe(i) && ni(o) && !ni(r)))
      return o.value = r, !0;
    const a = pe(i) && Ai(n) ? Number(n) < i.length : St(i, n), l = Reflect.set(i, n, r, s);
    return i === O(s) && (a ? pr(r, o) && se(i, "set", n, r, o) : se(i, "add", n, r)), l;
  };
}
function Yo(e, t) {
  const i = St(e, t), n = e[t], r = Reflect.deleteProperty(e, t);
  return r && i && se(e, "delete", t, void 0, n), r;
}
function Jo(e, t) {
  const i = Reflect.has(e, t);
  return (!Si(t) || !vr.has(t)) && j(e, "has", t), i;
}
function Zo(e) {
  return j(e, "iterate", pe(e) ? "length" : me), Reflect.ownKeys(e);
}
var Go = {
  get: Vo,
  set: Ho,
  deleteProperty: Yo,
  has: Jo,
  ownKeys: Zo
}, Xo = {
  get: Wo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, $i = (e) => At(e) ? Ri(e) : e, Ni = (e) => At(e) ? Er(e) : e, ki = (e) => e, Ot = (e) => Reflect.getPrototypeOf(e);
function Xe(e, t, i = !1, n = !1) {
  e = e.__v_raw;
  const r = O(e), s = O(t);
  t !== s && !i && j(r, "get", t), !i && j(r, "get", s);
  const { has: o } = Ot(r), a = n ? ki : i ? Ni : $i;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function Qe(e, t = !1) {
  const i = this.__v_raw, n = O(i), r = O(e);
  return e !== r && !t && j(n, "has", e), !t && j(n, "has", r), e === r ? i.has(e) : i.has(e) || i.has(r);
}
function et(e, t = !1) {
  return e = e.__v_raw, !t && j(O(e), "iterate", me), Reflect.get(e, "size", e);
}
function Vi(e) {
  e = O(e);
  const t = O(this);
  return Ot(t).has.call(t, e) || (t.add(e), se(t, "add", e, e)), this;
}
function Wi(e, t) {
  t = O(t);
  const i = O(this), { has: n, get: r } = Ot(i);
  let s = n.call(i, e);
  s ? wr(i, n, e) : (e = O(e), s = n.call(i, e));
  const o = r.call(i, e);
  return i.set(e, t), s ? pr(t, o) && se(i, "set", e, t, o) : se(i, "add", e, t), this;
}
function qi(e) {
  const t = O(this), { has: i, get: n } = Ot(t);
  let r = i.call(t, e);
  r ? wr(t, i, e) : (e = O(e), r = i.call(t, e));
  const s = n ? n.call(t, e) : void 0, o = t.delete(e);
  return r && se(t, "delete", e, void 0, s), o;
}
function Hi() {
  const e = O(this), t = e.size !== 0, i = We(e) ? new Map(e) : new Set(e), n = e.clear();
  return t && se(e, "clear", void 0, void 0, i), n;
}
function tt(e, t) {
  return function(n, r) {
    const s = this, o = s.__v_raw, a = O(o), l = t ? ki : e ? Ni : $i;
    return !e && j(a, "iterate", me), o.forEach((c, u) => n.call(r, l(c), l(u), s));
  };
}
function it(e, t, i) {
  return function(...n) {
    const r = this.__v_raw, s = O(r), o = We(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...n), u = i ? ki : t ? Ni : $i;
    return !t && j(s, "iterate", l ? ii : me), {
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
function te(e) {
  return function(...t) {
    {
      const i = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${Lo(e)} operation ${i}failed: target is readonly.`, O(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Qo() {
  const e = {
    get(s) {
      return Xe(this, s);
    },
    get size() {
      return et(this);
    },
    has: Qe,
    add: Vi,
    set: Wi,
    delete: qi,
    clear: Hi,
    forEach: tt(!1, !1)
  }, t = {
    get(s) {
      return Xe(this, s, !1, !0);
    },
    get size() {
      return et(this);
    },
    has: Qe,
    add: Vi,
    set: Wi,
    delete: qi,
    clear: Hi,
    forEach: tt(!1, !0)
  }, i = {
    get(s) {
      return Xe(this, s, !0);
    },
    get size() {
      return et(this, !0);
    },
    has(s) {
      return Qe.call(this, s, !0);
    },
    add: te(
      "add"
      /* ADD */
    ),
    set: te(
      "set"
      /* SET */
    ),
    delete: te(
      "delete"
      /* DELETE */
    ),
    clear: te(
      "clear"
      /* CLEAR */
    ),
    forEach: tt(!0, !1)
  }, n = {
    get(s) {
      return Xe(this, s, !0, !0);
    },
    get size() {
      return et(this, !0);
    },
    has(s) {
      return Qe.call(this, s, !0);
    },
    add: te(
      "add"
      /* ADD */
    ),
    set: te(
      "set"
      /* SET */
    ),
    delete: te(
      "delete"
      /* DELETE */
    ),
    clear: te(
      "clear"
      /* CLEAR */
    ),
    forEach: tt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = it(s, !1, !1), i[s] = it(s, !0, !1), t[s] = it(s, !1, !0), n[s] = it(s, !0, !0);
  }), [
    e,
    i,
    t,
    n
  ];
}
var [ea, ta, Wc, qc] = /* @__PURE__ */ Qo();
function yr(e, t) {
  const i = e ? ta : ea;
  return (n, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? n : Reflect.get(St(i, r) && r in n ? i : n, r, s);
}
var ia = {
  get: /* @__PURE__ */ yr(!1)
}, na = {
  get: /* @__PURE__ */ yr(!0)
};
function wr(e, t, i) {
  const n = O(i);
  if (n !== i && t.call(e, n)) {
    const r = hr(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var _r = /* @__PURE__ */ new WeakMap(), ra = /* @__PURE__ */ new WeakMap(), xr = /* @__PURE__ */ new WeakMap(), sa = /* @__PURE__ */ new WeakMap();
function oa(e) {
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
function aa(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : oa(hr(e));
}
function Ri(e) {
  return e && e.__v_isReadonly ? e : Ir(e, !1, Go, ia, _r);
}
function Er(e) {
  return Ir(e, !0, Xo, na, xr);
}
function Ir(e, t, i, n, r) {
  if (!At(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = aa(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? n : i);
  return r.set(e, a), a;
}
function O(e) {
  return e && O(e.__v_raw) || e;
}
function ni(e) {
  return !!(e && e.__v_isRef === !0);
}
q("nextTick", () => Ii);
q("dispatch", (e) => Ve.bind(Ve, e));
q("watch", (e, { evaluateLater: t, cleanup: i }) => (n, r) => {
  let s = t(n), a = wn(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  i(a);
});
q("store", mo);
q("data", (e) => An(e));
q("root", (e) => It(e));
q("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ae(la(e))), e._x_refs_proxy));
function la(e) {
  let t = [];
  return $e(e, (i) => {
    i._x_refs && t.push(i._x_refs);
  }), t;
}
var zt = {};
function Cr(e) {
  return zt[e] || (zt[e] = 0), ++zt[e];
}
function ca(e, t) {
  return $e(e, (i) => {
    if (i._x_ids && i._x_ids[t])
      return !0;
  });
}
function ua(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Cr(t));
}
q("id", (e, { cleanup: t }) => (i, n = null) => {
  let r = `${i}${n ? `-${n}` : ""}`;
  return da(e, r, t, () => {
    let s = ca(e, i), o = s ? s._x_ids[i] : Cr(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
Tt((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function da(e, t, i, n) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = n();
  return e._x_id[t] = r, i(() => {
    delete e._x_id[t];
  }), r;
}
q("el", (e) => e);
Tr("Focus", "focus", "focus");
Tr("Persist", "persist", "persist");
function Tr(e, t, i) {
  q(t, (n) => U(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
N("modelable", (e, { expression: t }, { effect: i, evaluateLater: n, cleanup: r }) => {
  let s = n(t), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = n(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, f = lr(
      {
        get() {
          return u();
        },
        set(y) {
          d(y);
        }
      },
      {
        get() {
          return o();
        },
        set(y) {
          l(y);
        }
      }
    );
    r(f);
  });
});
N("teleport", (e, { modifiers: t, expression: i }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && U("x-teleport can only be used on a <template> tag", e);
  let r = Ki(i), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Je(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  $(() => {
    o(s, r, t), ae(() => {
      G(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Ki(i);
    $(() => {
      o(e._x_teleport, a, t);
    });
  }, n(
    () => $(() => {
      s.remove(), Ne(s);
    })
  );
});
var fa = document.createElement("div");
function Ki(e) {
  let t = ae(() => document.querySelector(e), () => fa)();
  return t || U(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Sr = () => {
};
Sr.inline = (e, { modifiers: t }, { cleanup: i }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, i(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
N("ignore", Sr);
N("effect", ae((e, { expression: t }, { effect: i }) => {
  i(R(e, t));
}));
function ri(e, t, i, n) {
  let r = e, s = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (t = ha(t)), i.includes("camel") && (t = pa(t)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (r = window), i.includes("document") && (r = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = ht(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = or(s, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = ht(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = ar(s, c);
  }
  return i.includes("prevent") && (s = a(s, (l, c) => {
    c.preventDefault(), l(c);
  })), i.includes("stop") && (s = a(s, (l, c) => {
    c.stopPropagation(), l(c);
  })), i.includes("once") && (s = a(s, (l, c) => {
    l(c), r.removeEventListener(t, s, o);
  })), (i.includes("away") || i.includes("outside")) && (r = document, s = a(s, (l, c) => {
    e.contains(c.target) || c.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(c));
  })), i.includes("self") && (s = a(s, (l, c) => {
    c.target === e && l(c);
  })), (ga(t) || Ar(t)) && (s = a(s, (l, c) => {
    va(c, i) || l(c);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function ha(e) {
  return e.replace(/-/g, ".");
}
function pa(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function ht(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ma(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function ga(e) {
  return ["keydown", "keyup"].includes(e);
}
function Ar(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function va(e, t) {
  let i = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, ht((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, ht((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && Yi(e.key).includes(i[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (Ar(e.type) || Yi(e.key).includes(i[0])));
}
function Yi(e) {
  if (!e)
    return [];
  e = ma(e);
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
N("model", (e, { modifiers: t, expression: i }, { effect: n, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = R(s, i), a;
  typeof i == "string" ? a = R(s, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = R(s, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((y) => f = y), Ji(f) ? f.get() : f;
  }, c = (f) => {
    let y;
    o((m) => y = m), Ji(y) ? y.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof i == "string" && e.type === "radio" && $(() => {
    e.hasAttribute("name") || e.setAttribute("name", i);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = re ? () => {
  } : ri(e, u, t, (f) => {
    c(Ft(e, t, f, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Ti(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Ft(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let f = ri(e.form, "reset", [], (y) => {
      Ii(() => e._x_model && e._x_model.set(Ft(e, t, { target: e }, l())));
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
    f === void 0 && typeof i == "string" && i.match(/\./) && (f = ""), window.fromModel = !0, $(() => tr(e, "value", f)), delete window.fromModel;
  }, n(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Ft(e, t, i, n) {
  return $(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Ti(e))
      if (Array.isArray(n)) {
        let r = null;
        return t.includes("number") ? r = Ut(i.target.value) : t.includes("boolean") ? r = at(i.target.value) : r = i.target.value, i.target.checked ? n.includes(r) ? n : n.concat([r]) : n.filter((s) => !ba(s, r));
      } else
        return i.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ut(s);
        }) : t.includes("boolean") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return at(s);
        }) : Array.from(i.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return sr(e) ? i.target.checked ? r = i.target.value : r = n : r = i.target.value, t.includes("number") ? Ut(r) : t.includes("boolean") ? at(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Ut(e) {
  let t = e ? parseFloat(e) : null;
  return ya(t) ? t : e;
}
function ba(e, t) {
  return e == t;
}
function ya(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ji(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
N("cloak", (e) => queueMicrotask(() => $(() => e.removeAttribute(Oe("cloak")))));
Jn(() => `[${Oe("init")}]`);
N("init", ae((e, { expression: t }, { evaluate: i }) => typeof t == "string" ? !!t.trim() && i(t, {}, !1) : i(t, {}, !1)));
N("text", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let r = n(t);
  i(() => {
    r((s) => {
      $(() => {
        e.textContent = s;
      });
    });
  });
});
N("html", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let r = n(t);
  i(() => {
    r((s) => {
      $(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, G(e), delete e._x_ignoreSelf;
      });
    });
  });
});
_i(Fn(":", Un(Oe("bind:"))));
var Or = (e, { value: t, modifiers: i, expression: n, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    vo(l), R(e, n)((u) => {
      ur(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return wa(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = R(e, n);
  s(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), $(() => tr(e, t, l, i));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Or.inline = (e, { value: t, modifiers: i, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: !1 });
};
N("bind", Or);
function wa(e, t) {
  e._x_keyExpression = t;
}
Yn(() => `[${Oe("data")}]`);
N("data", (e, { expression: t }, { cleanup: i }) => {
  if (_a(e))
    return;
  t = t === "" ? "{}" : t;
  let n = {};
  ut(n, e);
  let r = {};
  yo(r, n);
  let s = he(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), ut(s, e);
  let o = Te(s);
  On(o);
  let a = Je(e, o);
  o.init && he(e, o.init), i(() => {
    o.destroy && he(e, o.destroy), a();
  });
});
Tt((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function _a(e) {
  return re ? ei ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (e, { modifiers: t, expression: i }, { effect: n }) => {
  let r = R(e, i);
  e._x_doHide || (e._x_doHide = () => {
    $(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    $(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let s = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, o = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(o), l = Xt(
    (d) => d ? o() : s(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  n(() => r((d) => {
    !u && d === c || (t.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
N("for", (e, { expression: t }, { effect: i, cleanup: n }) => {
  let r = Ea(t), s = R(e, r.items), o = R(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, i(() => xa(e, r, s, o)), n(() => {
    Object.values(e._x_lookup).forEach((a) => $(
      () => {
        Ne(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function xa(e, t, i, n) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  i((o) => {
    Ia(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, b]) => {
        let h = Zi(t, b, p, o);
        n((_) => {
          u.includes(_) && U("Duplicate key on x-for", e), u.push(_);
        }, { scope: { index: p, ...h } }), c.push(h);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let b = Zi(t, o[p], p, o);
        n((h) => {
          u.includes(h) && U("Duplicate key on x-for", e), u.push(h);
        }, { scope: { index: p, ...b } }), c.push(b);
      }
    let d = [], f = [], y = [], m = [];
    for (let p = 0; p < l.length; p++) {
      let b = l[p];
      u.indexOf(b) === -1 && y.push(b);
    }
    l = l.filter((p) => !y.includes(p));
    let v = "template";
    for (let p = 0; p < u.length; p++) {
      let b = u[p], h = l.indexOf(b);
      if (h === -1)
        l.splice(p, 0, b), d.push([v, p]);
      else if (h !== p) {
        let _ = l.splice(p, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(p, 0, E), l.splice(h, 0, _), f.push([_, E]);
      } else
        m.push(b);
      v = b;
    }
    for (let p = 0; p < y.length; p++) {
      let b = y[p];
      b in a && ($(() => {
        Ne(a[b]), a[b].remove();
      }), delete a[b]);
    }
    for (let p = 0; p < f.length; p++) {
      let [b, h] = f[p], _ = a[b], E = a[h], x = document.createElement("div");
      $(() => {
        E || U('x-for ":key" is undefined or invalid', s, h, a), E.after(x), _.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), x.before(_), _._x_currentIfEl && _.after(_._x_currentIfEl), x.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let p = 0; p < d.length; p++) {
      let [b, h] = d[p], _ = b === "template" ? s : a[b];
      _._x_currentIfEl && (_ = _._x_currentIfEl);
      let E = c[h], x = u[h], g = document.importNode(s.content, !0).firstElementChild, w = Te(E);
      Je(g, w, s), g._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([C, T]) => {
          w[C] = T;
        });
      }, $(() => {
        _.after(g), ae(() => G(g))();
      }), typeof x == "object" && U("x-for key cannot be an object, it must be a string or an integer", s), a[x] = g;
    }
    for (let p = 0; p < m.length; p++)
      a[m[p]]._x_refreshXForScope(c[u.indexOf(m[p])]);
    s._x_prevKeys = u;
  });
}
function Ea(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(n);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(i, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Zi(e, t, i, n) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = i), e.collection && (r[e.collection] = n), r;
}
function Ia(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function $r() {
}
$r.inline = (e, { expression: t }, { cleanup: i }) => {
  let n = It(e);
  n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, i(() => delete n._x_refs[t]);
};
N("ref", $r);
N("if", (e, { expression: t }, { effect: i, cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && U("x-if can only be used on a <template> tag", e);
  let r = R(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Je(a, {}, e), $(() => {
      e.after(a), ae(() => G(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      $(() => {
        Ne(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  i(() => r((a) => {
    a ? s() : o();
  })), n(() => e._x_undoIf && e._x_undoIf());
});
N("id", (e, { expression: t }, { evaluate: i }) => {
  i(t).forEach((r) => ua(e, r));
});
Tt((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
_i(Fn("@", Un(Oe("on:"))));
N("on", ae((e, { value: t, modifiers: i, expression: n }, { cleanup: r }) => {
  let s = n ? R(e, n) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = ri(e, t, i, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
$t("Collapse", "collapse", "collapse");
$t("Intersect", "intersect", "intersect");
$t("Focus", "trap", "focus");
$t("Mask", "mask", "mask");
function $t(e, t, i) {
  N(t, (n) => U(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
Ze.setEvaluator(Co);
Ze.setReactivityEngine({ reactive: Ri, effect: Do, release: Mo, raw: O });
var Ca = Ze, Nr = Ca;
function Ta(e) {
  e.directive("collapse", t), t.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function t(i, { modifiers: n }) {
    let r = Gi(n, "duration", 250) / 1e3, s = Gi(n, "min", 0), o = !n.includes("min");
    i._x_isShown || (i.style.height = `${s}px`), !i._x_isShown && o && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let a = (c, u) => {
      let d = e.setStyles(c, u);
      return u.height ? () => {
      } : d;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    i._x_transition = {
      in(c = () => {
      }, u = () => {
      }) {
        o && (i.hidden = !1), o && (i.style.display = null);
        let d = i.getBoundingClientRect().height;
        i.style.height = "auto";
        let f = i.getBoundingClientRect().height;
        d === f && (d = s), e.transition(i, e.setStyles, {
          during: l,
          start: { height: d + "px" },
          end: { height: f + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - f) < 1 && (i.style.overflow = null);
        });
      },
      out(c = () => {
      }, u = () => {
      }) {
        let d = i.getBoundingClientRect().height;
        e.transition(i, a, {
          during: l,
          start: { height: d + "px" },
          end: { height: s + "px" }
        }, () => i.style.overflow = "hidden", () => {
          i._x_isShown = !1, i.style.height == `${s}px` && o && (i.style.display = "none", i.hidden = !0);
        });
      }
    };
  }
}
function Gi(e, t, i) {
  if (e.indexOf(t) === -1)
    return i;
  const n = e[e.indexOf(t) + 1];
  if (!n)
    return i;
  if (t === "duration") {
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  if (t === "min") {
    let r = n.match(/([0-9]+)px/);
    if (r)
      return r[1];
  }
  return n;
}
var Sa = Ta;
function Aa(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(n), l = {
      rootMargin: Na(r),
      threshold: Oa(r)
    }, c = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting !== (i === "leave") && (a(), r.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(t), o(() => {
      c.disconnect();
    });
  }));
}
function Oa(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function $a(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Na(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push($a(e[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : i;
}
var ka = Aa, kr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], pt = /* @__PURE__ */ kr.join(","), Rr = typeof Element > "u", ye = Rr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, si = !Rr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Lr = function(t, i, n) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(pt));
  return i && ye.call(t, pt) && r.unshift(t), r = r.filter(n), r;
}, Pr = function e(t, i, n) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, n);
      n.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = ye.call(o, pt);
      u && n.filter(o) && (i || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), f = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && f) {
        var y = e(d === !0 ? o.children : d.children, !0, n);
        n.flatten ? r.push.apply(r, y) : r.push({
          scope: o,
          candidates: y
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Dr = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Ra = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, Mr = function(t) {
  return t.tagName === "INPUT";
}, La = function(t) {
  return Mr(t) && t.type === "hidden";
}, Pa = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Da = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, Ma = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || si(t), n = function(a) {
    return i.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, r;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    r = n(window.CSS.escape(t.name));
  else
    try {
      r = n(t.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var s = Da(r, t.form);
  return !s || s === t;
}, za = function(t) {
  return Mr(t) && t.type === "radio";
}, Fa = function(t) {
  return za(t) && !Ma(t);
}, Xi = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, r = i.height;
  return n === 0 && r === 0;
}, Ua = function(t, i) {
  var n = i.displayCheck, r = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = ye.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (ye.call(o, "details:not([open]) *"))
    return !0;
  var a = si(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = si(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return Xi(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (n === "non-zero-area")
    return Xi(t);
  return !1;
}, Ba = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var r = i.children.item(n);
          if (r.tagName === "LEGEND")
            return ye.call(i, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, mt = function(t, i) {
  return !(i.disabled || La(i) || Ua(i, t) || // For a details element with a summary, the summary element gets the focus
  Pa(i) || Ba(i));
}, oi = function(t, i) {
  return !(Fa(i) || Dr(i) < 0 || !mt(t, i));
}, ja = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Va = function e(t) {
  var i = [], n = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Dr(a, o), c = o ? e(r.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), n.sort(Ra).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(i);
}, Wa = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Pr([t], i.includeContainer, {
    filter: oi.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: ja
  }) : n = Lr(t, i.includeContainer, oi.bind(null, i)), Va(n);
}, zr = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Pr([t], i.includeContainer, {
    filter: mt.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = Lr(t, i.includeContainer, mt.bind(null, i)), n;
}, nt = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return ye.call(t, pt) === !1 ? !1 : oi(i, t);
}, qa = /* @__PURE__ */ kr.concat("iframe").join(","), lt = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return ye.call(t, qa) === !1 ? !1 : mt(i, t);
};
function Qi(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function en(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qi(Object(i), !0).forEach(function(n) {
      Ha(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : Qi(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function Ha(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var tn = /* @__PURE__ */ function() {
  var e = [];
  return {
    activateTrap: function(i) {
      if (e.length > 0) {
        var n = e[e.length - 1];
        n !== i && n.pause();
      }
      var r = e.indexOf(i);
      r === -1 || e.splice(r, 1), e.push(i);
    },
    deactivateTrap: function(i) {
      var n = e.indexOf(i);
      n !== -1 && e.splice(n, 1), e.length > 0 && e[e.length - 1].unpause();
    }
  };
}(), Ka = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Ya = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, Ja = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, nn = function(t) {
  return setTimeout(t, 0);
}, rn = function(t, i) {
  var n = -1;
  return t.every(function(r, s) {
    return i(r) ? (n = s, !1) : !0;
  }), n;
}, De = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, rt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Za = function(t, i) {
  var n = i?.document || document, r = en({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, i), s = {
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
  }, o, a = function(g, w, I) {
    return g && g[w] !== void 0 ? g[w] : r[I || w];
  }, l = function(g) {
    return s.containerGroups.findIndex(function(w) {
      var I = w.container, C = w.tabbableNodes;
      return I.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      C.find(function(T) {
        return T === g;
      });
    });
  }, c = function(g) {
    var w = r[g];
    if (typeof w == "function") {
      for (var I = arguments.length, C = new Array(I > 1 ? I - 1 : 0), T = 1; T < I; T++)
        C[T - 1] = arguments[T];
      w = w.apply(void 0, C);
    }
    if (w === !0 && (w = void 0), !w) {
      if (w === void 0 || w === !1)
        return w;
      throw new Error("`".concat(g, "` was specified but was not a node, or did not return a node"));
    }
    var S = w;
    if (typeof w == "string" && (S = n.querySelector(w), !S))
      throw new Error("`".concat(g, "` as selector refers to no known node"));
    return S;
  }, u = function() {
    var g = c("initialFocus");
    if (g === !1)
      return !1;
    if (g === void 0)
      if (l(n.activeElement) >= 0)
        g = n.activeElement;
      else {
        var w = s.tabbableGroups[0], I = w && w.firstTabbableNode;
        g = I || c("fallbackFocus");
      }
    if (!g)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return g;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(g) {
      var w = Wa(g, r.tabbableOptions), I = zr(g, r.tabbableOptions);
      return {
        container: g,
        tabbableNodes: w,
        focusableNodes: I,
        firstTabbableNode: w.length > 0 ? w[0] : null,
        lastTabbableNode: w.length > 0 ? w[w.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(T) {
          var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, L = I.findIndex(function(P) {
            return P === T;
          });
          if (!(L < 0))
            return S ? I.slice(L + 1).find(function(P) {
              return nt(P, r.tabbableOptions);
            }) : I.slice(0, L).reverse().find(function(P) {
              return nt(P, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(g) {
      return g.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function x(g) {
    if (g !== !1 && g !== n.activeElement) {
      if (!g || !g.focus) {
        x(u());
        return;
      }
      g.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = g, Ka(g) && g.select();
    }
  }, y = function(g) {
    var w = c("setReturnFocus", g);
    return w || (w === !1 ? !1 : g);
  }, m = function(g) {
    var w = rt(g);
    if (!(l(w) >= 0)) {
      if (De(r.clickOutsideDeactivates, g)) {
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
          returnFocus: r.returnFocusOnDeactivate && !lt(w, r.tabbableOptions)
        });
        return;
      }
      De(r.allowOutsideClick, g) || g.preventDefault();
    }
  }, v = function(g) {
    var w = rt(g), I = l(w) >= 0;
    I || w instanceof Document ? I && (s.mostRecentlyFocusedNode = w) : (g.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, p = function(g) {
    var w = rt(g);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var C = l(w), T = C >= 0 ? s.containerGroups[C] : void 0;
      if (C < 0)
        g.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var S = rn(s.tabbableGroups, function(B) {
          var F = B.firstTabbableNode;
          return w === F;
        });
        if (S < 0 && (T.container === w || lt(w, r.tabbableOptions) && !nt(w, r.tabbableOptions) && !T.nextTabbableNode(w, !1)) && (S = C), S >= 0) {
          var L = S === 0 ? s.tabbableGroups.length - 1 : S - 1, P = s.tabbableGroups[L];
          I = P.lastTabbableNode;
        }
      } else {
        var H = rn(s.tabbableGroups, function(B) {
          var F = B.lastTabbableNode;
          return w === F;
        });
        if (H < 0 && (T.container === w || lt(w, r.tabbableOptions) && !nt(w, r.tabbableOptions) && !T.nextTabbableNode(w)) && (H = C), H >= 0) {
          var z = H === s.tabbableGroups.length - 1 ? 0 : H + 1, le = s.tabbableGroups[z];
          I = le.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (g.preventDefault(), f(I));
  }, b = function(g) {
    if (Ya(g) && De(r.escapeDeactivates, g) !== !1) {
      g.preventDefault(), o.deactivate();
      return;
    }
    if (Ja(g)) {
      p(g);
      return;
    }
  }, h = function(g) {
    var w = rt(g);
    l(w) >= 0 || De(r.clickOutsideDeactivates, g) || De(r.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, _ = function() {
    if (s.active)
      return tn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? nn(function() {
        f(u());
      }) : f(u()), n.addEventListener("focusin", v, !0), n.addEventListener("mousedown", m, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", m, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", h, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", b, {
        capture: !0,
        passive: !1
      }), o;
  }, E = function() {
    if (s.active)
      return n.removeEventListener("focusin", v, !0), n.removeEventListener("mousedown", m, !0), n.removeEventListener("touchstart", m, !0), n.removeEventListener("click", h, !0), n.removeEventListener("keydown", b, !0), o;
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
      var w = a(g, "onActivate"), I = a(g, "onPostActivate"), C = a(g, "checkCanFocusTrap");
      C || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, w && w();
      var T = function() {
        C && d(), _(), I && I();
      };
      return C ? (C(s.containers.concat()).then(T, T), this) : (T(), this);
    },
    deactivate: function(g) {
      if (!s.active)
        return this;
      var w = en({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, g);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, tn.deactivateTrap(o);
      var I = a(w, "onDeactivate"), C = a(w, "onPostDeactivate"), T = a(w, "checkCanReturnFocus"), S = a(w, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var L = function() {
        nn(function() {
          S && f(y(s.nodeFocusedBeforeActivation)), C && C();
        });
      };
      return S && T ? (T(y(s.nodeFocusedBeforeActivation)).then(L, L), this) : (L(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), _(), this);
    },
    updateContainerElements: function(g) {
      var w = [].concat(g).filter(Boolean);
      return s.containers = w.map(function(I) {
        return typeof I == "string" ? n.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function Ga(e) {
  let t, i;
  window.addEventListener("focusin", () => {
    t = i, i = document.activeElement;
  }), e.magic("focus", (n) => {
    let r = n;
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
        return lt(s);
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
        return Array.isArray(r) ? r : zr(r, { displayCheck: "none" });
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
    (n, { expression: r, modifiers: s }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let c = a(r), u = !1, d = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => n
      }, f = () => {
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let p = n.querySelector("[autofocus]");
        p && (d.initialFocus = p);
      }
      s.includes("inert") && (d.onPostActivate = () => {
        e.nextTick(() => {
          f = sn(n);
        });
      });
      let y = Za(n, d), m = () => {
      };
      const v = () => {
        f(), f = () => {
        }, m(), m = () => {
        }, y.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (m = Xa()), setTimeout(() => {
          y.activate();
        }, 15)), !p && u && v(), u = !!p);
      })), l(v);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && sn(n);
    }
  ));
}
function sn(e) {
  let t = [];
  return Fr(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Fr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? Fr(e.parentNode, t) : t(i);
  });
}
function Xa() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var Qa = Ga;
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
function el() {
  return !0;
}
function tl({ component: e, argument: t }) {
  return new Promise((i) => {
    if (t)
      window.addEventListener(
        t,
        () => i(),
        { once: !0 }
      );
    else {
      const n = (r) => {
        r.detail.id === e.id && (window.removeEventListener("async-alpine:load", n), i());
      };
      window.addEventListener("async-alpine:load", n);
    }
  });
}
function il() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function nl({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const i = window.matchMedia(`(${e})`);
    i.matches ? t() : i.addEventListener("change", t, { once: !0 });
  });
}
function rl({ component: e, argument: t }) {
  return new Promise((i) => {
    const n = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), i());
    }, { rootMargin: n });
    r.observe(e.el);
  });
}
var on = {
  eager: el,
  event: tl,
  idle: il,
  media: nl,
  visible: rl
};
async function sl(e) {
  const t = ol(e.strategy);
  await ai(e, t);
}
async function ai(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((i) => ai(e, i))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((i) => ai(e, i))
      );
  }
  return on[t.method] ? on[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function ol(e) {
  const t = al(e);
  let i = Ur(t);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function al(e) {
  const t = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, i = [];
  let n;
  for (; (n = t.exec(e)) !== null; ) {
    const [r, s, o, a] = n;
    if (s !== void 0)
      i.push({ type: "parenthesis", value: s });
    else if (o !== void 0)
      i.push({
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
      )), a.method === "immediate" && (a.method = "eager"), i.push(l);
    }
  }
  return i;
}
function Ur(e) {
  let t = an(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const i = e.shift().value, n = an(e);
    t.type === "expression" && t.operator === i ? t.parameters.push(n) : t = {
      type: "expression",
      operator: i,
      parameters: [t, n]
    };
  }
  return t;
}
function an(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = Ur(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function ll(e) {
  const t = "load", i = e.prefixed("load-src"), n = e.prefixed("ignore");
  let r = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, s = !1, o = {}, a = 0;
  function l() {
    return a++;
  }
  e.asyncOptions = (h) => {
    r = {
      ...r,
      ...h
    };
  }, e.asyncData = (h, _ = !1) => {
    o[h] = {
      loaded: !1,
      download: _
    };
  }, e.asyncUrl = (h, _) => {
    !h || !_ || o[h] || (o[h] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        b(_)
      )
    });
  }, e.asyncAlias = (h) => {
    s = h;
  };
  const c = (h) => {
    e.skipDuringClone(() => {
      h._x_async || (h._x_async = "init", h._x_ignore = !0, h.setAttribute(n, ""));
    })();
  }, u = async (h) => {
    e.skipDuringClone(async () => {
      if (h._x_async !== "init") return;
      h._x_async = "await";
      const { name: _, strategy: E } = d(h);
      await sl({
        name: _,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(_), h.isConnected && (m(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, e.directive(t, u).before("ignore");
  function d(h) {
    const _ = p(h.getAttribute(e.prefixed("data"))), E = h.getAttribute(e.prefixed(t)) || r.defaultStrategy, x = h.getAttribute(i);
    return x && e.asyncUrl(_, x), {
      name: _,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (v(h), !o[h] || o[h].loaded)) return;
    const _ = await y(h);
    e.data(h, _), o[h].loaded = !0;
  }
  async function y(h) {
    if (!o[h]) return;
    const _ = await o[h].download(h);
    return typeof _ == "function" ? _ : _[h] || _.default || Object.values(_)[0] || !1;
  }
  function m(h) {
    e.destroyTree(h), h._x_ignore = !1, h.removeAttribute(n), !h.closest(`[${n}]`) && e.initTree(h);
  }
  function v(h) {
    if (!(!s || o[h])) {
      if (typeof s == "function") {
        e.asyncData(h, s);
        return;
      }
      e.asyncUrl(h, s.replaceAll("[name]", h));
    }
  }
  function p(h) {
    return (h || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function b(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function cl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ul(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function dl(e, t, i) {
  return t && ul(e.prototype, t), e;
}
var fl = Object.defineProperty, X = function(e, t) {
  return fl(e, "name", { value: t, configurable: !0 });
}, hl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, pl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, ml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, gl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, vl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, bl = X(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Me = X(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), A = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, ie = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ln = { OUTLINE: "outline", FILLED: "filled" }, Bt = { FADE: "fade", SLIDE: "slide" }, ze = { CLOSE: Me(hl), SUCCESS: Me(gl), ERROR: Me(pl), WARNING: Me(vl), INFO: Me(ml) }, cn = X(function(e) {
  e.wrapper.classList.add(A.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(A.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), un = X(function(e) {
  e.wrapper.classList.remove(A.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), yl = X(function(e) {
  e.wrapper.classList.add(A.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(A.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), wl = X(function(e) {
  e.wrapper.classList.remove(A.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Br = function() {
  function e(t) {
    var i = this;
    cl(this, e), this.notifyOut = X(function(B) {
      B(i);
    }, "notifyOut");
    var n = t.notificationsGap, r = n === void 0 ? 20 : n, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? Bt.FADE : c, d = t.type, f = d === void 0 ? "outline" : d, y = t.title, m = t.text, v = t.showIcon, p = v === void 0 ? !0 : v, b = t.customIcon, h = b === void 0 ? "" : b, _ = t.customClass, E = _ === void 0 ? "" : _, x = t.speed, g = x === void 0 ? 500 : x, w = t.showCloseButton, I = w === void 0 ? !0 : w, C = t.autoclose, T = C === void 0 ? !0 : C, S = t.autotimeout, L = S === void 0 ? 3e3 : S, P = t.position, H = P === void 0 ? "right top" : P, z = t.customWrapper, le = z === void 0 ? "" : z;
    if (this.customWrapper = le, this.status = l, this.title = y, this.text = m, this.showIcon = p, this.customIcon = h, this.customClass = E, this.speed = g, this.effect = u, this.showCloseButton = I, this.autoclose = T, this.autotimeout = L, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = H, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return dl(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(A.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(A.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](A.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](A.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](A.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](A.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](A.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](A.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](A.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(A.NOTIFY_CLOSE), n.innerHTML = ze.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = bl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(A.NOTIFY), this.type) {
      case ln.OUTLINE:
        this.wrapper.classList.add(A.NOTIFY_OUTLINE);
        break;
      case ln.FILLED:
        this.wrapper.classList.add(A.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(A.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case ie.SUCCESS:
        this.wrapper.classList.add(A.NOTIFY_SUCCESS);
        break;
      case ie.ERROR:
        this.wrapper.classList.add(A.NOTIFY_ERROR);
        break;
      case ie.WARNING:
        this.wrapper.classList.add(A.NOTIFY_WARNING);
        break;
      case ie.INFO:
        this.wrapper.classList.add(A.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(A.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(A.NOTIFY_CONTENT);
    var n, r;
    this.title && (n = document.createElement("div"), n.classList.add(A.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(A.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var i = X(function(r) {
      switch (r) {
        case ie.SUCCESS:
          return ze.SUCCESS;
        case ie.ERROR:
          return ze.ERROR;
        case ie.WARNING:
          return ze.WARNING;
        case ie.INFO:
          return ze.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(A.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
  } }, { key: "setObserver", value: function() {
    var i = this, n = new IntersectionObserver(function(r) {
      if (r[0].intersectionRatio <= 0) i.close();
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
      case Bt.FADE:
        this.selectedNotifyInEffect = cn, this.selectedNotifyOutEffect = un;
        break;
      case Bt.SLIDE:
        this.selectedNotifyInEffect = yl, this.selectedNotifyOutEffect = wl;
        break;
      default:
        this.selectedNotifyInEffect = cn, this.selectedNotifyOutEffect = un;
    }
  } }]), e;
}();
X(Br, "Notify");
var jr = Br;
globalThis.Notify = jr;
const Vr = ["success", "error", "warning", "info"], Wr = [
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
], qr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Fe(e = {}) {
  const t = {
    ...qr,
    ...e
  };
  Vr.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Wr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new jr(t);
}
const _l = {
  custom: Fe,
  success(e, t = "Success", i = {}) {
    Fe({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    Fe({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    Fe({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    Fe({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(qr, e);
  },
  get allowedStatuses() {
    return [...Vr];
  },
  get allowedPositions() {
    return [...Wr];
  }
}, li = function() {
}, He = {}, gt = {}, Ke = {};
function xl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, r = n, s, o, a, l;
  for (s = function(c, u) {
    u.length && i.push(c), r--, r || t(i);
  }; n--; ) {
    if (o = e[n], a = gt[o], a) {
      s(o, a);
      continue;
    }
    l = Ke[o] = Ke[o] || [], l.push(s);
  }
}
function Hr(e, t) {
  if (!e) return;
  const i = Ke[e];
  if (gt[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function ci(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || li)(t) : (e.success || li)(e);
}
function El(e, t, i, n, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Kr(t, n, r, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function Kr(e, t, i, n) {
  const r = document, s = i.async, o = (i.numRetries || 0) + 1, a = i.before || li, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, f;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    f = r.createElement("link"), f.rel = "stylesheet", f.href = c, u = "hideFocus" in f, u && f.relList && (u = 0, f.rel = "preload", f.as = "style"), i.inlineStyleNonce && f.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    f = r.createElement("img"), f.src = c;
  else if (f = r.createElement("script"), f.src = c, f.async = s === void 0 ? !0 : s, i.inlineScriptNonce && f.setAttribute("nonce", i.inlineScriptNonce), d = "noModule" in f, /^module!/.test(l)) {
    if (!d) return t(e, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return t(e, "l");
  const y = function(m) {
    El(m, e, f, t, i, n, o, u);
  };
  f.addEventListener("load", y, { once: !0 }), f.addEventListener("error", y, { once: !0 }), a(e, f) !== !1 && r.head.appendChild(f);
}
function Il(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    n--, n || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Kr(e[o], s, i);
}
function ne(e, t, i) {
  let n, r;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), r = (n ? i : t) || {}, n) {
    if (n in He)
      throw "LoadJS";
    He[n] = !0;
  }
  function s(o, a) {
    Il(e, function(l) {
      ci(r, l), o && ci({ success: o, error: a }, l), Hr(n, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
ne.ready = function(t, i) {
  return xl(t, function(n) {
    ci(i, n);
  }), ne;
};
ne.done = function(t) {
  Hr(t, []);
};
ne.reset = function() {
  Object.keys(He).forEach((t) => delete He[t]), Object.keys(gt).forEach((t) => delete gt[t]), Object.keys(Ke).forEach((t) => delete Ke[t]);
};
ne.isDefined = function(t) {
  return t in He;
};
function Cl(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = Tl(e) || e;
    let i = Alpine.$data(t);
    if (i === void 0) {
      const n = t.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && dn("element", t), i;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${Jr(t)}"]`;
    let n = null;
    const r = document.getElementById(t);
    if (r && (n = r.matches(i) ? r : r.querySelector(i)), n || (n = Yr(t)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(n);
    return s === void 0 && dn(`data-alpine-root="${t}"`, n), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Tl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", i = e.getAttribute?.("data-for");
  if (t || i) {
    const n = i || "";
    if (!n) return e;
    const r = Yr(n);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return e;
}
function Yr(e) {
  const t = `[data-alpine-root="${Jr(e)}"]`, i = document.querySelectorAll(t);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(e) || null;
}
function Jr(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function dn(e, t) {
  const i = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function Sl(e) {
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
function Al(e) {
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
function Ol(e) {
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
function $l(e) {
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
function Nl(e) {
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
function kl(e, t) {
  e.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.configId, r = this.$el.dataset.nonce;
      if (i.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      t(i, {
        success: () => {
          this.initCalendar(n);
        },
        error: (s) => console.error("RzCalendar: Failed to load assets", s)
      }, r);
    },
    initCalendar(i) {
      const n = document.getElementById(i);
      if (!n) {
        console.error(`RzCalendar: Config element #${i} not found.`);
        return;
      }
      let r = {};
      try {
        r = JSON.parse(n.textContent);
      } catch (a) {
        console.error("RzCalendar: Failed to parse config JSON", a);
        return;
      }
      const s = {
        clickDay: (a, l) => this.dispatchCalendarEvent("clickDay", { event: a, dates: l.selectedDates }),
        clickWeekNumber: (a, l, c, u) => this.dispatchCalendarEvent("clickWeekNumber", { event: a, number: l, days: c, year: u }),
        clickMonth: (a, l) => this.dispatchCalendarEvent("clickMonth", { event: a, month: l }),
        clickYear: (a, l) => this.dispatchCalendarEvent("clickYear", { event: a, year: l }),
        clickArrow: (a, l, c) => this.dispatchCalendarEvent("clickArrow", { event: a, year: l, month: c }),
        changeTime: (a, l, c, u, d) => this.dispatchCalendarEvent("changeTime", { event: a, time: l, hours: c, minutes: u, keeping: d }),
        changeView: (a) => this.dispatchCalendarEvent("changeView", { view: a }),
        getDays: (a, l, c, u, d) => {
        }
      }, o = {
        ...r.options,
        styles: r.styles,
        // Correct property name for VCP
        actions: s
      };
      window.VanillaCalendarPro ? (this.calendar = new VanillaCalendarPro.Calendar(this.$refs.calendarEl, o), this.calendar.init(), this.initialized = !0, this.dispatchCalendarEvent("init", { instance: this.calendar })) : console.error("RzCalendar: VanillaCalendar global not found.");
    },
    dispatchCalendarEvent(i, n) {
      this.$dispatch(`rz:calendar:${i}`, n);
    },
    destroy() {
      this.calendar && (this.calendar.destroy(), this.dispatchCalendarEvent("destroy", {}));
    }
  }));
}
function Rl(e, t) {
  function i(n) {
    if (!n) return {};
    const r = document.getElementById(n);
    if (!r)
      return console.warn(`[rzCarousel] JSON script element #${n} not found.`), {};
    try {
      return JSON.parse(r.textContent || "{}");
    } catch (s) {
      return console.error(`[rzCarousel] Failed to parse JSON from #${n}:`, s), {};
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
      })(), r = this.$el.dataset.nonce || "", s = i(this.$el.dataset.config), o = s.Options || {}, a = s.Plugins || [], l = this;
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
        r
      ) : window.EmblaCarousel ? this.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    initializeEmbla(n, r) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(r);
      this.emblaApi = window.EmblaCarousel(s, n, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    instantiatePlugins(n) {
      return !Array.isArray(n) || n.length === 0 ? [] : n.map((r) => {
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
    scrollTo(n) {
      this.emblaApi?.scrollTo(n);
    }
  }));
}
function Ll(e, t) {
  e.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.codeid, r = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, t(i, {
        success: function() {
          const s = document.getElementById(n);
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
function Pl(e) {
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
function Dl(e, t) {
  e.data("rzCombobox", () => ({
    tomSelect: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      i.length > 0 && typeof t == "function" ? t(i, {
        success: () => this.initTomSelect(),
        error: (r) => console.error("RzCombobox: Failed to load assets.", r)
      }, n) : window.TomSelect && this.initTomSelect();
    },
    initTomSelect() {
      const i = this.$refs.selectInput;
      if (!i) return;
      const n = document.getElementById(this.$el.dataset.configId), r = n ? JSON.parse(n.textContent) : {}, s = {}, o = (a, l) => {
        if (!a) return null;
        const c = document.createElement("div");
        let u = l.item;
        if (typeof u == "string")
          try {
            u = JSON.parse(u);
          } catch {
          }
        const d = {
          ...l,
          item: u
        };
        return e && typeof e.addScopeToNode == "function" ? e.addScopeToNode(c, d) : c._x_dataStack = [d], c.innerHTML = a.innerHTML, c;
      };
      this.$refs.optionTemplate && (s.option = (a, l) => o(this.$refs.optionTemplate, a)), this.$refs.itemTemplate && (s.item = (a, l) => o(this.$refs.itemTemplate, a)), r.dataAttr = "data-item", this.tomSelect = new TomSelect(i, {
        ...r,
        render: s,
        onInitialize: function() {
          this.sync();
        }
      });
    },
    destroy() {
      this.tomSelect && (this.tomSelect.destroy(), this.tomSelect = null);
    }
  }));
}
function Ml(e, t) {
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
      const r = JSON.parse(this.$el.dataset.assets), s = this.$el.dataset.nonce;
      t(r, {
        success: function() {
          window.flatpickr && n && window.flatpickr(n, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, s);
    }
  }));
}
function zl(e) {
  e.data("rzDialog", () => ({
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
const ui = Math.min, xe = Math.max, vt = Math.round, J = (e) => ({
  x: e,
  y: e
}), Fl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Ul = {
  start: "end",
  end: "start"
};
function fn(e, t, i) {
  return xe(e, ui(t, i));
}
function Nt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function we(e) {
  return e.split("-")[0];
}
function kt(e) {
  return e.split("-")[1];
}
function Zr(e) {
  return e === "x" ? "y" : "x";
}
function Gr(e) {
  return e === "y" ? "height" : "width";
}
function ge(e) {
  return ["top", "bottom"].includes(we(e)) ? "y" : "x";
}
function Xr(e) {
  return Zr(ge(e));
}
function Bl(e, t, i) {
  i === void 0 && (i = !1);
  const n = kt(e), r = Xr(e), s = Gr(r);
  let o = r === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = bt(o)), [o, bt(o)];
}
function jl(e) {
  const t = bt(e);
  return [di(e), t, di(t)];
}
function di(e) {
  return e.replace(/start|end/g, (t) => Ul[t]);
}
function Vl(e, t, i) {
  const n = ["left", "right"], r = ["right", "left"], s = ["top", "bottom"], o = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return i ? t ? r : n : t ? n : r;
    case "left":
    case "right":
      return t ? s : o;
    default:
      return [];
  }
}
function Wl(e, t, i, n) {
  const r = kt(e);
  let s = Vl(we(e), i === "start", n);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(di)))), s;
}
function bt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Fl[t]);
}
function ql(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Hl(e) {
  return typeof e != "number" ? ql(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function yt(e) {
  const {
    x: t,
    y: i,
    width: n,
    height: r
  } = e;
  return {
    width: n,
    height: r,
    top: i,
    left: t,
    right: t + n,
    bottom: i + r,
    x: t,
    y: i
  };
}
function hn(e, t, i) {
  let {
    reference: n,
    floating: r
  } = e;
  const s = ge(t), o = Xr(t), a = Gr(o), l = we(t), c = s === "y", u = n.x + n.width / 2 - r.width / 2, d = n.y + n.height / 2 - r.height / 2, f = n[a] / 2 - r[a] / 2;
  let y;
  switch (l) {
    case "top":
      y = {
        x: u,
        y: n.y - r.height
      };
      break;
    case "bottom":
      y = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      y = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      y = {
        x: n.x - r.width,
        y: d
      };
      break;
    default:
      y = {
        x: n.x,
        y: n.y
      };
  }
  switch (kt(t)) {
    case "start":
      y[o] -= f * (i && c ? -1 : 1);
      break;
    case "end":
      y[o] += f * (i && c ? -1 : 1);
      break;
  }
  return y;
}
const Kl = async (e, t, i) => {
  const {
    placement: n = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = i, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let c = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: u,
    y: d
  } = hn(c, n, l), f = n, y = {}, m = 0;
  for (let v = 0; v < a.length; v++) {
    const {
      name: p,
      fn: b
    } = a[v], {
      x: h,
      y: _,
      data: E,
      reset: x
    } = await b({
      x: u,
      y: d,
      initialPlacement: n,
      placement: f,
      strategy: r,
      middlewareData: y,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = h ?? u, d = _ ?? d, y = {
      ...y,
      [p]: {
        ...y[p],
        ...E
      }
    }, x && m <= 50 && (m++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (c = x.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : x.rects), {
      x: u,
      y: d
    } = hn(c, f, l)), v = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: y
  };
};
async function Qr(e, t) {
  var i;
  t === void 0 && (t = {});
  const {
    x: n,
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
    padding: y = 0
  } = Nt(t, e), m = Hl(y), p = a[f ? d === "floating" ? "reference" : "floating" : d], b = yt(await s.getClippingRect({
    element: (i = await (s.isElement == null ? void 0 : s.isElement(p))) == null || i ? p : p.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), h = d === "floating" ? {
    x: n,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, _ = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), E = await (s.isElement == null ? void 0 : s.isElement(_)) ? await (s.getScale == null ? void 0 : s.getScale(_)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, x = yt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: _,
    strategy: l
  }) : h);
  return {
    top: (b.top - x.top + m.top) / E.y,
    bottom: (x.bottom - b.bottom + m.bottom) / E.y,
    left: (b.left - x.left + m.left) / E.x,
    right: (x.right - b.right + m.right) / E.x
  };
}
const Yl = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var i, n;
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
        fallbackStrategy: y = "bestFit",
        fallbackAxisSideDirection: m = "none",
        flipAlignment: v = !0,
        ...p
      } = Nt(e, t);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const b = we(r), h = ge(a), _ = we(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), x = f || (_ || !v ? [bt(a)] : jl(a)), g = m !== "none";
      !f && g && x.push(...Wl(a, v, m, E));
      const w = [a, ...x], I = await Qr(t, p), C = [];
      let T = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && C.push(I[b]), d) {
        const z = Bl(r, o, E);
        C.push(I[z[0]], I[z[1]]);
      }
      if (T = [...T, {
        placement: r,
        overflows: C
      }], !C.every((z) => z <= 0)) {
        var S, L;
        const z = (((S = s.flip) == null ? void 0 : S.index) || 0) + 1, le = w[z];
        if (le) {
          var P;
          const F = d === "alignment" ? h !== ge(le) : !1, K = ((P = T[0]) == null ? void 0 : P.overflows[0]) > 0;
          if (!F || K)
            return {
              data: {
                index: z,
                overflows: T
              },
              reset: {
                placement: le
              }
            };
        }
        let B = (L = T.filter((F) => F.overflows[0] <= 0).sort((F, K) => F.overflows[1] - K.overflows[1])[0]) == null ? void 0 : L.placement;
        if (!B)
          switch (y) {
            case "bestFit": {
              var H;
              const F = (H = T.filter((K) => {
                if (g) {
                  const ee = ge(K.placement);
                  return ee === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ee === "y";
                }
                return !0;
              }).map((K) => [K.placement, K.overflows.filter((ee) => ee > 0).reduce((ee, cs) => ee + cs, 0)]).sort((K, ee) => K[1] - ee[1])[0]) == null ? void 0 : H[0];
              F && (B = F);
              break;
            }
            case "initialPlacement":
              B = a;
              break;
          }
        if (r !== B)
          return {
            reset: {
              placement: B
            }
          };
      }
      return {};
    }
  };
};
async function Jl(e, t) {
  const {
    placement: i,
    platform: n,
    elements: r
  } = e, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), o = we(i), a = kt(i), l = ge(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Nt(t, e);
  let {
    mainAxis: f,
    crossAxis: y,
    alignmentAxis: m
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof m == "number" && (y = a === "end" ? m * -1 : m), l ? {
    x: y * u,
    y: f * c
  } : {
    x: f * c,
    y: y * u
  };
}
const Zl = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var i, n;
      const {
        x: r,
        y: s,
        placement: o,
        middlewareData: a
      } = t, l = await Jl(t, e);
      return o === ((i = a.offset) == null ? void 0 : i.placement) && (n = a.arrow) != null && n.alignmentOffset ? {} : {
        x: r + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, Gl = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: i,
        y: n,
        placement: r
      } = t, {
        mainAxis: s = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (p) => {
            let {
              x: b,
              y: h
            } = p;
            return {
              x: b,
              y: h
            };
          }
        },
        ...l
      } = Nt(e, t), c = {
        x: i,
        y: n
      }, u = await Qr(t, l), d = ge(we(r)), f = Zr(d);
      let y = c[f], m = c[d];
      if (s) {
        const p = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", h = y + u[p], _ = y - u[b];
        y = fn(h, y, _);
      }
      if (o) {
        const p = d === "y" ? "top" : "left", b = d === "y" ? "bottom" : "right", h = m + u[p], _ = m - u[b];
        m = fn(h, m, _);
      }
      const v = a.fn({
        ...t,
        [f]: y,
        [d]: m
      });
      return {
        ...v,
        data: {
          x: v.x - i,
          y: v.y - n,
          enabled: {
            [f]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Rt() {
  return typeof window < "u";
}
function ke(e) {
  return es(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function M(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Q(e) {
  var t;
  return (t = (es(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function es(e) {
  return Rt() ? e instanceof Node || e instanceof M(e).Node : !1;
}
function V(e) {
  return Rt() ? e instanceof Element || e instanceof M(e).Element : !1;
}
function Z(e) {
  return Rt() ? e instanceof HTMLElement || e instanceof M(e).HTMLElement : !1;
}
function pn(e) {
  return !Rt() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof M(e).ShadowRoot;
}
function Ge(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !["inline", "contents"].includes(r);
}
function Xl(e) {
  return ["table", "td", "th"].includes(ke(e));
}
function Lt(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Li(e) {
  const t = Pi(), i = V(e) ? W(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function Ql(e) {
  let t = oe(e);
  for (; Z(t) && !Ce(t); ) {
    if (Li(t))
      return t;
    if (Lt(t))
      return null;
    t = oe(t);
  }
  return null;
}
function Pi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ce(e) {
  return ["html", "body", "#document"].includes(ke(e));
}
function W(e) {
  return M(e).getComputedStyle(e);
}
function Pt(e) {
  return V(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function oe(e) {
  if (ke(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    pn(e) && e.host || // Fallback.
    Q(e)
  );
  return pn(t) ? t.host : t;
}
function ts(e) {
  const t = oe(e);
  return Ce(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Z(t) && Ge(t) ? t : ts(t);
}
function is(e, t, i) {
  var n;
  t === void 0 && (t = []);
  const r = ts(e), s = r === ((n = e.ownerDocument) == null ? void 0 : n.body), o = M(r);
  return s ? (fi(o), t.concat(o, o.visualViewport || [], Ge(r) ? r : [], [])) : t.concat(r, is(r, []));
}
function fi(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function ns(e) {
  const t = W(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const r = Z(e), s = r ? e.offsetWidth : i, o = r ? e.offsetHeight : n, a = vt(i) !== s || vt(n) !== o;
  return a && (i = s, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function rs(e) {
  return V(e) ? e : e.contextElement;
}
function Ee(e) {
  const t = rs(e);
  if (!Z(t))
    return J(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = ns(t);
  let o = (s ? vt(i.width) : i.width) / n, a = (s ? vt(i.height) : i.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const ec = /* @__PURE__ */ J(0);
function ss(e) {
  const t = M(e);
  return !Pi() || !t.visualViewport ? ec : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function tc(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== M(e) ? !1 : t;
}
function Ye(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const r = e.getBoundingClientRect(), s = rs(e);
  let o = J(1);
  t && (n ? V(n) && (o = Ee(n)) : o = Ee(e));
  const a = tc(s, i, n) ? ss(s) : J(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), y = n && V(n) ? M(n) : n;
    let m = f, v = fi(m);
    for (; v && n && y !== m; ) {
      const p = Ee(v), b = v.getBoundingClientRect(), h = W(v), _ = b.left + (v.clientLeft + parseFloat(h.paddingLeft)) * p.x, E = b.top + (v.clientTop + parseFloat(h.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += _, c += E, m = M(v), v = fi(m);
    }
  }
  return yt({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Di(e, t) {
  const i = Pt(e).scrollLeft;
  return t ? t.left + i : Ye(Q(e)).left + i;
}
function os(e, t, i) {
  i === void 0 && (i = !1);
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - (i ? 0 : (
    // RTL <body> scrollbar.
    Di(e, n)
  )), s = n.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function ic(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: r
  } = e;
  const s = r === "fixed", o = Q(n), a = t ? Lt(t.floating) : !1;
  if (n === o || a && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = J(1);
  const u = J(0), d = Z(n);
  if ((d || !d && !s) && ((ke(n) !== "body" || Ge(o)) && (l = Pt(n)), Z(n))) {
    const y = Ye(n);
    c = Ee(n), u.x = y.x + n.clientLeft, u.y = y.y + n.clientTop;
  }
  const f = o && !d && !s ? os(o, l, !0) : J(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function nc(e) {
  return Array.from(e.getClientRects());
}
function rc(e) {
  const t = Q(e), i = Pt(e), n = e.ownerDocument.body, r = xe(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = xe(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Di(e);
  const a = -i.scrollTop;
  return W(n).direction === "rtl" && (o += xe(t.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function sc(e, t) {
  const i = M(e), n = Q(e), r = i.visualViewport;
  let s = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Pi();
    (!c || c && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function oc(e, t) {
  const i = Ye(e, !0, t === "fixed"), n = i.top + e.clientTop, r = i.left + e.clientLeft, s = Z(e) ? Ee(e) : J(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = n * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function mn(e, t, i) {
  let n;
  if (t === "viewport")
    n = sc(e, i);
  else if (t === "document")
    n = rc(Q(e));
  else if (V(t))
    n = oc(t, i);
  else {
    const r = ss(e);
    n = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return yt(n);
}
function as(e, t) {
  const i = oe(e);
  return i === t || !V(i) || Ce(i) ? !1 : W(i).position === "fixed" || as(i, t);
}
function ac(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = is(e, []).filter((a) => V(a) && ke(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? oe(e) : e;
  for (; V(o) && !Ce(o); ) {
    const a = W(o), l = Li(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ge(o) && !l && as(e, o)) ? n = n.filter((u) => u !== o) : r = a, o = oe(o);
  }
  return t.set(e, n), n;
}
function lc(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: r
  } = e;
  const o = [...i === "clippingAncestors" ? Lt(t) ? [] : ac(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = mn(t, u, r);
    return c.top = xe(d.top, c.top), c.right = ui(d.right, c.right), c.bottom = ui(d.bottom, c.bottom), c.left = xe(d.left, c.left), c;
  }, mn(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function cc(e) {
  const {
    width: t,
    height: i
  } = ns(e);
  return {
    width: t,
    height: i
  };
}
function uc(e, t, i) {
  const n = Z(t), r = Q(t), s = i === "fixed", o = Ye(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = J(0);
  function c() {
    l.x = Di(r);
  }
  if (n || !n && !s)
    if ((ke(t) !== "body" || Ge(r)) && (a = Pt(t)), n) {
      const y = Ye(t, !0, s, t);
      l.x = y.x + t.clientLeft, l.y = y.y + t.clientTop;
    } else r && c();
  s && !n && r && c();
  const u = r && !n && !s ? os(r, a) : J(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function jt(e) {
  return W(e).position === "static";
}
function gn(e, t) {
  if (!Z(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return Q(e) === i && (i = i.ownerDocument.body), i;
}
function ls(e, t) {
  const i = M(e);
  if (Lt(e))
    return i;
  if (!Z(e)) {
    let r = oe(e);
    for (; r && !Ce(r); ) {
      if (V(r) && !jt(r))
        return r;
      r = oe(r);
    }
    return i;
  }
  let n = gn(e, t);
  for (; n && Xl(n) && jt(n); )
    n = gn(n, t);
  return n && Ce(n) && jt(n) && !Li(n) ? i : n || Ql(e) || i;
}
const dc = async function(e) {
  const t = this.getOffsetParent || ls, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: uc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function fc(e) {
  return W(e).direction === "rtl";
}
const hc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ic,
  getDocumentElement: Q,
  getClippingRect: lc,
  getOffsetParent: ls,
  getElementRects: dc,
  getClientRects: nc,
  getDimensions: cc,
  getScale: Ee,
  isElement: V,
  isRTL: fc
}, wt = Zl, _t = Gl, xt = Yl, Et = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: hc,
    ...i
  }, s = {
    ...r.platform,
    _c: n
  };
  return Kl(e, t, {
    ...r,
    platform: s
  });
};
function pc(e) {
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
        middleware: [wt(this.pixelOffset), xt(), _t({ padding: 8 })]
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
        middleware: [wt(this.pixelOffset), xt(), _t({ padding: 8 })]
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
function mc(e) {
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
function gc(e) {
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
        const n = this.iframe;
        this.onDarkModeToggle = (r) => {
          n.contentWindow.postMessage(r.detail, "*");
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
              const r = n.scrollHeight + 15;
              t.style.height = r + "px";
            }
          }
        } catch (i) {
          console.error("Error resizing iframe:", i);
        }
    },
    // Debounce helper to limit function calls
    debounce(t, i = 300) {
      let n;
      return (...r) => {
        clearTimeout(n), n = setTimeout(() => {
          t.apply(this, r);
        }, i);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function vc(e) {
  e.data("rzEmpty", () => {
  });
}
function bc(e) {
  e.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const t = this;
      if (typeof this.setCurrentHeading == "function") {
        const i = (r, s) => {
          r.forEach((o) => {
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
function yc(e) {
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
function wc(e) {
  e.data("rzInputGroupAddon", () => ({
    handleClick(t) {
      if (t.target.closest("button"))
        return;
      const i = this.$el.parentElement;
      i && i.querySelector("input, textarea")?.focus();
    }
  }));
}
function _c(e, t) {
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
function xc(e, t) {
  e.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: !1,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: !1,
    /* ---------- helpers ---------- */
    _triggerIndex(i) {
      return this.list ? Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]')).findIndex((r) => r.getAttribute("x-ref") === `trigger_${i}`) : -1;
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
      const r = n.querySelector('[x-ref^="trigger_"]');
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
    openMenu(i) {
      this.cancelClose(), this.isClosing = !1;
      const n = this._triggerIndex(i), r = n > (this.prevIndex ?? n) ? "end" : "start", s = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== i) {
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
      this.activeItemId = i, this.open = !0, this.prevIndex = n;
      const o = this.$refs[`trigger_${i}`], a = this._contentEl(i);
      !o || !a || (Et(o, a, {
        placement: "bottom-start",
        middleware: [wt(6), xt(), _t({ padding: 8 })]
      }).then(({ x: l, y: c }) => {
        Object.assign(a.style, { left: `${l}px`, top: `${c}px` });
      }), a.style.display = "block", s ? a.setAttribute("data-motion", "fade-in") : a.setAttribute("data-motion", `from-${r}`), this.$nextTick(() => {
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
      const r = this._contentEl(i);
      r && (r.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        r.style.display = "none";
      }, 150)), this.open = !1, this.activeItemId = null, this.prevIndex = null, setTimeout(() => {
        this.isClosing = !1;
      }, 150);
    }
  }));
}
function Ec(e) {
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
      const t = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(wt({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: r
      })), o && c.push(xt()), a && c.push(_t({ padding: l })), Et(this.triggerEl, this.contentEl, {
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
function Ic(e) {
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
      const r = t.offsetWidth + 10;
      i.style.paddingLeft = r + "px", i.classList.remove("text-transparent");
    }
  }));
}
function Cc(e) {
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
function Tc(e) {
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
function Sc(e) {
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
function Ac(e) {
  e.data("rzTabs", () => ({
    selectedTab: "",
    _triggers: [],
    _observer: null,
    init() {
      const t = this.$el.dataset.defaultValue;
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), t && this._triggers.some((i) => i.dataset.value === t) ? this.selectedTab = t : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
    },
    destroy() {
      this._observer && this._observer.disconnect();
    },
    refreshTriggers() {
      this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
    },
    onTriggerClick(t) {
      const i = t.currentTarget?.dataset?.value;
      !i || t.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = i, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
    },
    isSelected(t) {
      return this.selectedTab === t;
    },
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
    _attrDisabled() {
      return this.$el.getAttribute("aria-disabled") === "true" ? "true" : null;
    },
    _attrAriaSelected() {
      return String(this.$el.dataset.value === this.selectedTab);
    },
    _attrHidden() {
      return this.$el.dataset.value === this.selectedTab ? null : "true";
    },
    _attrAriaHidden() {
      return String(this.selectedTab !== this.$el.dataset.value);
    },
    _attrDataState() {
      return this.selectedTab === this.$el.dataset.value ? "active" : "inactive";
    },
    _attrTabIndex() {
      return this.selectedTab === this.$el.dataset.value ? "0" : "-1";
    },
    onListKeydown(t) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(t.key)) {
        t.preventDefault();
        const i = this._triggers.filter((l) => l.getAttribute("aria-disabled") !== "true");
        if (i.length === 0) return;
        const n = i.findIndex((l) => l.dataset.value === this.selectedTab);
        if (n === -1) return;
        const r = t.currentTarget?.getAttribute("aria-orientation") === "vertical", s = r ? "ArrowUp" : "ArrowLeft", o = r ? "ArrowDown" : "ArrowRight";
        let a = n;
        switch (t.key) {
          case s:
            a = n - 1 < 0 ? i.length - 1 : n - 1;
            break;
          case o:
            a = (n + 1) % i.length;
            break;
          case "Home":
            a = 0;
            break;
          case "End":
            a = i.length - 1;
            break;
        }
        if (a >= 0 && a < i.length) {
          const l = i[a];
          this.selectedTab = l.dataset.value, this.$nextTick(() => l.focus());
        }
      }
    }
  }));
}
function Oc(e) {
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
function $c(e) {
  e.data("rzCommand", () => ({
    // --- STATE ---
    search: "",
    selectedValue: null,
    selectedIndex: -1,
    items: [],
    filteredItems: [],
    groupTemplates: /* @__PURE__ */ new Map(),
    activeDescendantId: null,
    isOpen: !1,
    isEmpty: !0,
    firstRender: !0,
    isLoading: !1,
    error: null,
    // --- CONFIG ---
    loop: !1,
    shouldFilter: !0,
    itemsUrl: null,
    fetchTrigger: "immediate",
    serverFiltering: !1,
    dataItemTemplateId: null,
    _dataFetched: !1,
    _debounceTimer: null,
    // --- COMPUTED (CSP-Compliant Methods) ---
    showLoading() {
      return this.isLoading;
    },
    hasError() {
      return this.error !== null;
    },
    notHasError() {
      return this.error == null;
    },
    shouldShowEmpty() {
      return this.isEmpty && this.search && !this.isLoading && !this.error;
    },
    shouldShowEmptyOrError() {
      return this.isEmpty && this.search && !this.isLoading || this.error !== null;
    },
    // --- LIFECYCLE ---
    init() {
      this.loop = this.$el.dataset.loop === "true", this.shouldFilter = this.$el.dataset.shouldFilter !== "false", this.selectedValue = this.$el.dataset.selectedValue || null, this.itemsUrl = this.$el.dataset.itemsUrl || null, this.fetchTrigger = this.$el.dataset.fetchTrigger || "immediate", this.serverFiltering = this.$el.dataset.serverFiltering === "true", this.dataItemTemplateId = this.$el.dataset.templateId || null;
      const t = this.$el.dataset.itemsId;
      let i = [];
      if (t) {
        const n = document.getElementById(t);
        if (n)
          try {
            i = JSON.parse(n.textContent || "[]");
          } catch (r) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, r);
          }
      }
      i.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them."), i.forEach((n) => {
        n.id = n.id || `static-item-${crypto.randomUUID()}`, n.isDataItem = !0, this.registerItem(n);
      }), this.itemsUrl && this.fetchTrigger === "immediate" && this.fetchItems(), this.$watch("search", (n) => {
        this.firstRender = !1, this.serverFiltering ? (clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => {
          this.fetchItems(n);
        }, 300)) : this.filterAndSortItems();
      }), this.$watch("selectedIndex", (n, r) => {
        if (r > -1) {
          const s = this.filteredItems[r];
          if (s) {
            const o = this.$el.querySelector(`[data-command-item-id="${s.id}"]`);
            o && (o.removeAttribute("data-selected"), o.setAttribute("aria-selected", "false"));
          }
        }
        if (n > -1 && this.filteredItems[n]) {
          const s = this.filteredItems[n];
          this.activeDescendantId = s.id;
          const o = this.$el.querySelector(`[data-command-item-id="${s.id}"]`);
          o && (o.setAttribute("data-selected", "true"), o.setAttribute("aria-selected", "true"), o.scrollIntoView({ block: "nearest" }));
          const a = s.value;
          this.selectedValue !== a && (this.selectedValue = a, this.$dispatch("rz:command:select", { value: a }));
        } else
          this.activeDescendantId = null, this.selectedValue = null;
      }), this.$watch("selectedValue", (n) => {
        const r = this.filteredItems.findIndex((s) => s.value === n);
        this.selectedIndex !== r && (this.selectedIndex = r);
      }), this.$watch("filteredItems", (n) => {
        this.isOpen = n.length > 0 || this.isLoading, this.isEmpty = n.length === 0, this.firstRender || window.dispatchEvent(new CustomEvent("rz:command:list-changed", {
          detail: {
            items: this.filteredItems,
            groups: this.groupTemplates,
            commandId: this.$el.id
          }
        }));
      });
    },
    // --- METHODS ---
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
          const r = await n.json();
          this.serverFiltering && (this.items = this.items.filter((s) => !s.isDataItem)), r.forEach((s) => {
            s.id = s.id || `data-item-${crypto.randomUUID()}`, s.isDataItem = !0, this.registerItem(s);
          }), this._dataFetched = !0;
        } catch (i) {
          this.error = i.message || "Failed to fetch command items.", console.error("RzCommand:", this.error);
        } finally {
          this.isLoading = !1, this.filterAndSortItems();
        }
      }
    },
    handleInteraction() {
      this.itemsUrl && this.fetchTrigger === "on-open" && !this._dataFetched && this.fetchItems();
    },
    registerItem(t) {
      this.items.some((i) => i.id === t.id) || (t._order = this.items.length, this.items.push(t), this.selectedIndex === -1 && (this.selectedIndex = 0), this.serverFiltering || this.filterAndSortItems());
    },
    unregisterItem(t) {
      this.items = this.items.filter((i) => i.id !== t), this.filterAndSortItems();
    },
    registerGroupTemplate(t, i) {
      this.groupTemplates.has(t) || this.groupTemplates.set(t, i);
    },
    filterAndSortItems() {
      if (this.serverFiltering && this._dataFetched) {
        this.filteredItems = this.items, this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
        return;
      }
      let t;
      if (!this.shouldFilter || !this.search ? t = this.items.map((i) => ({ ...i, score: 1 })) : t = this.items.map((i) => ({
        ...i,
        score: i.forceMount ? 0 : this.commandScore(i.name, this.search, i.keywords)
      })).filter((i) => i.score > 0 || i.forceMount).sort((i, n) => i.forceMount && !n.forceMount ? 1 : !i.forceMount && n.forceMount ? -1 : n.score !== i.score ? n.score - i.score : (i._order || 0) - (n._order || 0)), this.filteredItems = t, this.selectedValue) {
        const i = this.filteredItems.findIndex((n) => n.value === this.selectedValue);
        this.selectedIndex = i > -1 ? i : this.filteredItems.length > 0 ? 0 : -1;
      } else
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
    },
    // --- EVENT HANDLERS ---
    handleItemClick(t) {
      const i = t.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === n);
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && (this.selectedIndex = r, this.$dispatch("rz:command:execute", { value: s.value }));
      }
    },
    handleItemHover(t) {
      const i = t.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === n);
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && this.selectedIndex !== r && (this.selectedIndex = r);
      }
    },
    // --- KEYBOARD NAVIGATION ---
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
        case "Enter":
          t.preventDefault();
          const i = this.filteredItems[this.selectedIndex];
          i && !i.disabled && this.$dispatch("rz:command:execute", { value: i.value });
          break;
      }
    },
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
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.findIndex((i) => !i.disabled);
        t > -1 && (this.selectedIndex = t);
      }
    },
    selectLast() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.map((i) => i.disabled).lastIndexOf(!1);
        t > -1 && (this.selectedIndex = t);
      }
    },
    // --- SCORING ALGORITHM (Adapted from cmdk) ---
    commandScore(t, i, n = []) {
      const d = /[\\/_+.#"@[\(\{&]/, f = /[\s-]/, y = `${t} ${n ? n.join(" ") : ""}`;
      function m(p) {
        return p.toLowerCase().replace(/[\s-]/g, " ");
      }
      function v(p, b, h, _, E, x, g) {
        if (x === b.length)
          return E === p.length ? 1 : 0.99;
        const w = `${E},${x}`;
        if (g[w] !== void 0) return g[w];
        const I = _.charAt(x);
        let C = h.indexOf(I, E), T = 0;
        for (; C >= 0; ) {
          let S = v(p, b, h, _, C + 1, x + 1, g);
          S > T && (C === E ? S *= 1 : d.test(p.charAt(C - 1)) ? S *= 0.8 : f.test(p.charAt(C - 1)) ? S *= 0.9 : (S *= 0.17, E > 0 && (S *= Math.pow(0.999, C - E))), p.charAt(C) !== b.charAt(x) && (S *= 0.9999)), S > T && (T = S), C = h.indexOf(I, C + 1);
        }
        return g[w] = T, T;
      }
      return v(y, i, m(y), m(i), 0, 0, {});
    }
  }));
}
function Nc(e) {
  e.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    init() {
      const t = this.$el.closest('[x-data="rzCommand"]');
      if (!t) {
        console.error("CommandItem must be a child of RzCommand.");
        return;
      }
      this.parent = e.$data(t), this.itemData = {
        id: this.$el.id,
        value: this.$el.dataset.value || this.$el.textContent.trim(),
        name: this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim(),
        keywords: JSON.parse(this.$el.dataset.keywords || "[]"),
        group: this.$el.dataset.group || null,
        templateId: this.$el.id + "-template",
        disabled: this.$el.dataset.disabled === "true",
        forceMount: this.$el.dataset.forceMount === "true"
      }, this.parent.registerItem(this.itemData);
    },
    destroy() {
      this.parent && this.parent.unregisterItem(this.itemData.id);
    }
  }));
}
function kc(e) {
  e.data("rzCommandList", () => ({
    parent: null,
    dataItemTemplate: null,
    init() {
      const t = this.$el.closest('[x-data="rzCommand"]');
      if (!t) {
        console.error("CommandList must be a child of RzCommand.");
        return;
      }
      this.parent = e.$data(t), this.parent.dataItemTemplateId && (this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId));
    },
    renderList(t) {
      if (t.detail.commandId !== this.parent.$el.id) return;
      const i = t.detail.items || [], n = t.detail.groups || /* @__PURE__ */ new Map(), r = this.$el;
      r.querySelectorAll("[data-dynamic-item]").forEach((o) => o.remove());
      const s = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      i.forEach((o) => {
        const a = o.group || "__ungrouped__";
        s.has(a) || s.set(a, []), s.get(a).push(o);
      }), s.forEach((o, a) => {
        if (o.length === 0) return;
        const l = document.createElement("div");
        if (l.setAttribute("role", "group"), l.setAttribute("data-dynamic-item", "true"), l.setAttribute("data-slot", "command-group"), a !== "__ungrouped__") {
          const c = n.get(a);
          if (c) {
            const u = document.getElementById(c);
            if (u && u.content) {
              const d = u.content.cloneNode(!0), f = d.firstElementChild;
              f && (l.setAttribute("aria-labelledby", f.id), l.appendChild(d));
            }
          }
        }
        o.forEach((c) => {
          const u = this.parent.filteredItems.indexOf(c);
          let d;
          if (c.isDataItem) {
            if (!this.dataItemTemplate)
              return;
            d = this.dataItemTemplate.content.cloneNode(!0).firstElementChild, e.addScopeToNode(d, { item: c });
          } else {
            const f = document.getElementById(c.templateId);
            f && f.content && (d = f.content.cloneNode(!0).querySelector(`[data-command-item-id="${c.id}"]`));
          }
          d && (d.setAttribute("data-command-item-id", c.id), d.setAttribute("data-value", c.value), c.keywords && d.setAttribute("data-keywords", JSON.stringify(c.keywords)), c.group && d.setAttribute("data-group", c.group), c.disabled && d.setAttribute("data-disabled", "true"), c.forceMount && d.setAttribute("data-force-mount", "true"), d.setAttribute("role", "option"), d.setAttribute("aria-selected", this.parent.selectedIndex === u), c.disabled && d.setAttribute("aria-disabled", "true"), this.parent.selectedIndex === u && d.setAttribute("data-selected", "true"), l.appendChild(d), e.initTree(d));
        }), r.appendChild(l);
      });
    }
  }));
}
function Rc(e) {
  e.data("rzCommandGroup", () => ({
    parent: null,
    heading: "",
    templateId: "",
    init() {
      const t = this.$el.closest('[x-data="rzCommand"]');
      if (!t) {
        console.error("CommandGroup must be a child of RzCommand.");
        return;
      }
      this.parent = e.$data(t), this.heading = this.$el.dataset.heading, this.templateId = this.$el.dataset.templateId, this.heading && this.templateId && this.parent.registerGroupTemplate(this.heading, this.templateId);
    }
  }));
}
async function Lc(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ue(e, t, i) {
  let n, r;
  typeof t == "function" ? n = { success: t } : t && typeof t == "object" ? n = t : typeof t == "string" && (r = t), !r && typeof i == "string" && (r = i);
  const s = Array.isArray(e) ? e : [e];
  return Lc(s).then((o) => (ne.isDefined(o) || ne(s, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: r,
    inlineStyleNonce: r
  }), new Promise((a, l) => {
    ne.ready(o, {
      success: () => {
        try {
          n && typeof n.success == "function" && n.success();
        } catch (c) {
          console.error("[rizzyRequire] success callback threw:", c);
        }
        a({ bundleId: o });
      },
      error: (c) => {
        try {
          n && typeof n.error == "function" && n.error(c);
        } catch (u) {
          console.error("[rizzyRequire] error callback threw:", u);
        }
        l(
          new Error(
            `[rizzyRequire] Failed to load bundle ${o} (missing: ${Array.isArray(c) ? c.join(", ") : String(c)})`
          )
        );
      }
    });
  })));
}
function Pc(e) {
  Sl(e), Al(e), Ol(e), $l(e), Nl(e), kl(e, ue), Rl(e, ue), Ll(e, ue), Pl(e), Dl(e, ue), Ml(e, ue), zl(e), pc(e), mc(e), gc(e), vc(e), bc(e), yc(e), wc(e), _c(e, ue), xc(e), Ec(e), Ic(e), Cc(e), Tc(e), Sc(e), Ac(e), Oc(e), $c(e), Nc(e), kc(e), Rc(e);
}
function Dc(e) {
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
const st = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map();
let vn = !1;
function Mc(e) {
  return ot.has(e) || ot.set(
    e,
    import(e).catch((t) => {
      throw ot.delete(e), t;
    })
  ), ot.get(e);
}
function bn(e, t) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    e,
    () => Mc(t).catch((n) => (console.error(
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
function zc(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = st.get(e);
  i && i.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${i.path}
  New:      ${t}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const r = !i || i.path !== t;
    if (!(i && i.loaderSet && !r)) {
      const o = bn(e, t);
      st.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  st.set(e, { path: t, loaderSet: !1 }), vn || (vn = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of st)
        if (!s.loaderSet) {
          const o = bn(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Fc(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: r }) => {
    const s = i.find((b) => b.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (b) => {
      t.dataset.mobile = b ? "true" : "false", t.dataset.screen = b ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (b) => {
      if (!a) return;
      const h = u();
      h && (h[n] = b);
    }, f = (b) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: b, width: window.innerWidth, breakpoint: o }
        })
      );
    }, y = window.matchMedia(`(max-width: ${o - 1}px)`), m = () => {
      const b = l();
      c(b), d(b), f(b);
    };
    m();
    const v = () => m(), p = () => m();
    y.addEventListener("change", v), window.addEventListener("resize", p, { passive: !0 }), r(() => {
      y.removeEventListener("change", v), window.removeEventListener("resize", p);
    });
  });
}
function Uc(e) {
  const t = (i, { expression: n, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (v, p, b) => {
      const _ = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = _.pop();
      let x = v;
      for (const g of _)
        (x[g] == null || typeof x[g] != "object") && (x[g] = isFinite(+g) ? [] : {}), x = x[g];
      x[E] = b;
    }, l = e.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = n.split(",").map((v) => v.trim()).filter(Boolean).map((v) => {
      const p = v.split("->").map((b) => b.trim());
      return p.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', v), null) : { parentPath: p[0], childPath: p[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), y = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), m = [];
    d.forEach((v, p) => {
      const b = y[p];
      if (f) {
        const E = e.evaluate(i, v.childPath, { scope: c });
        b.fromChild = !0, a(u, v.parentPath, E), queueMicrotask(() => {
          b.fromChild = !1;
        });
      } else {
        const E = e.evaluate(i, v.parentPath, { scope: u });
        b.fromParent = !0, a(c, v.childPath, E), queueMicrotask(() => {
          b.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = e.evaluate(i, v.parentPath, { scope: u });
        b.fromChild || (b.fromParent = !0, a(c, v.childPath, E), queueMicrotask(() => {
          b.fromParent = !1;
        }));
      }), _ = o(() => {
        const E = e.evaluate(i, v.childPath, { scope: c });
        if (!b.fromParent) {
          if (b.skipChildOnce) {
            b.skipChildOnce = !1;
            return;
          }
          b.fromChild = !0, a(u, v.parentPath, E), queueMicrotask(() => {
            b.fromChild = !1;
          });
        }
      });
      m.push(h, _);
    }), s(() => {
      for (const v of m)
        try {
          v && v();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class Bc {
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
    const t = this.effectiveDark, i = this._mode, n = this.prefersDark, r = typeof document < "u" ? document.documentElement : null, s = r ? r.classList.contains(this.darkClass) === t && r.style.colorScheme === (t ? "dark" : "light") : !0;
    this._lastSnapshot.mode === i && this._lastSnapshot.effectiveDark === t && this._lastSnapshot.prefersDark === n && s || (this._lastSnapshot = { mode: i, effectiveDark: t, prefersDark: n }, r && (r.classList.toggle(this.darkClass, t), r.style.colorScheme = t ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
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
const D = new Bc();
function jc(e) {
  D.init(), e.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: D.mode,
    _prefersDark: D.prefersDark,
    _effectiveDark: D.effectiveDark,
    // Listener reference to prevent duplicate registration
    _onThemeChange: null,
    init() {
      this._onThemeChange || (this._onThemeChange = () => this._refresh(), window.addEventListener(D.eventName, this._onThemeChange)), this._refresh();
    },
    _refresh() {
      this._mode = D.mode, this._prefersDark = D.prefersDark, this._effectiveDark = D.effectiveDark;
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
      D.setLight();
    },
    setDark() {
      D.setDark();
    },
    setAuto() {
      D.setAuto();
    },
    toggle() {
      D.toggle();
    }
  });
}
let Ue = null;
function Vc(e) {
  return Ue || (e.plugin(Sa), e.plugin(ka), e.plugin(Qa), e.plugin(ll), typeof document < "u" && document.addEventListener("alpine:init", () => {
    jc(e);
  }), Pc(e), Fc(e), Uc(e), Ue = {
    Alpine: e,
    require: ue,
    toast: _l,
    $data: Cl,
    props: Dc,
    registerAsyncComponent: zc,
    theme: D
  }, typeof window < "u" && (D.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...Ue }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Ue);
}
const Hc = Vc(Nr);
Nr.start();
export {
  Hc as default
};
