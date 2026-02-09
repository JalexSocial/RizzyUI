var He = !1, We = !1, dt = [], je = -1;
function ls(t) {
  cs(t);
}
function cs(t) {
  dt.includes(t) || dt.push(t), ds();
}
function us(t) {
  let e = dt.indexOf(t);
  e !== -1 && e > je && dt.splice(e, 1);
}
function ds() {
  !We && !He && (He = !0, queueMicrotask(fs));
}
function fs() {
  He = !1, We = !0;
  for (let t = 0; t < dt.length; t++)
    dt[t](), je = t;
  dt.length = 0, je = -1, We = !1;
}
var St, yt, Ct, bn, Ue = !0;
function hs(t) {
  Ue = !1, t(), Ue = !0;
}
function ps(t) {
  St = t.reactive, Ct = t.release, yt = (e) => t.effect(e, { scheduler: (i) => {
    Ue ? ls(i) : i();
  } }), bn = t.raw;
}
function Mi(t) {
  yt = t;
}
function ms(t) {
  let e = () => {
  };
  return [(n) => {
    let r = yt(n);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(r), e = () => {
      r !== void 0 && (t._x_effects.delete(r), Ct(r));
    }, r;
  }, () => {
    e();
  }];
}
function yn(t, e) {
  let i = !0, n, r = yt(() => {
    let s = t();
    JSON.stringify(s), i ? n = s : queueMicrotask(() => {
      e(s, n), n = s;
    }), i = !1;
  });
  return () => Ct(r);
}
var wn = [], _n = [], xn = [];
function gs(t) {
  xn.push(t);
}
function fi(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, _n.push(e));
}
function En(t) {
  wn.push(t);
}
function In(t, e, i) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(i);
}
function Sn(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([i, n]) => {
    (e === void 0 || e.includes(i)) && (n.forEach((r) => r()), delete t._x_attributeCleanups[i]);
  });
}
function vs(t) {
  for (t._x_effects?.forEach(us); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var hi = new MutationObserver(vi), pi = !1;
function mi() {
  hi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), pi = !0;
}
function Cn() {
  bs(), hi.disconnect(), pi = !1;
}
var Nt = [];
function bs() {
  let t = hi.takeRecords();
  Nt.push(() => t.length > 0 && vi(t));
  let e = Nt.length;
  queueMicrotask(() => {
    if (Nt.length === e)
      for (; Nt.length > 0; )
        Nt.shift()();
  });
}
function O(t) {
  if (!pi)
    return t();
  Cn();
  let e = t();
  return mi(), e;
}
var gi = !1, le = [];
function ys() {
  gi = !0;
}
function ws() {
  gi = !1, vi(le), le = [];
}
function vi(t) {
  if (gi) {
    le = le.concat(t);
    return;
  }
  let e = [], i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (let s = 0; s < t.length; s++)
    if (!t[s].target._x_ignoreMutationObserver && (t[s].type === "childList" && (t[s].removedNodes.forEach((o) => {
      o.nodeType === 1 && o._x_marker && i.add(o);
    }), t[s].addedNodes.forEach((o) => {
      if (o.nodeType === 1) {
        if (i.has(o)) {
          i.delete(o);
          return;
        }
        o._x_marker || e.push(o);
      }
    })), t[s].type === "attributes")) {
      let o = t[s].target, a = t[s].attributeName, l = t[s].oldValue, c = () => {
        n.has(o) || n.set(o, []), n.get(o).push({ name: a, value: o.getAttribute(a) });
      }, u = () => {
        r.has(o) || r.set(o, []), r.get(o).push(a);
      };
      o.hasAttribute(a) && l === null ? c() : o.hasAttribute(a) ? (u(), c()) : u();
    }
  r.forEach((s, o) => {
    Sn(o, s);
  }), n.forEach((s, o) => {
    wn.forEach((a) => a(o, s));
  });
  for (let s of i)
    e.some((o) => o.contains(s)) || _n.forEach((o) => o(s));
  for (let s of e)
    s.isConnected && xn.forEach((o) => o(s));
  e = null, i = null, n = null, r = null;
}
function Tn(t) {
  return qt(xt(t));
}
function Yt(t, e, i) {
  return t._x_dataStack = [e, ...xt(i || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((n) => n !== e);
  };
}
function xt(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? xt(t.host) : t.parentNode ? xt(t.parentNode) : [];
}
function qt(t) {
  return new Proxy({ objects: t }, _s);
}
var _s = {
  ownKeys({ objects: t }) {
    return Array.from(
      new Set(t.flatMap((e) => Object.keys(e)))
    );
  },
  has({ objects: t }, e) {
    return e == Symbol.unscopables ? !1 : t.some(
      (i) => Object.prototype.hasOwnProperty.call(i, e) || Reflect.has(i, e)
    );
  },
  get({ objects: t }, e, i) {
    return e == "toJSON" ? xs : Reflect.get(
      t.find(
        (n) => Reflect.has(n, e)
      ) || {},
      e,
      i
    );
  },
  set({ objects: t }, e, i, n) {
    const r = t.find(
      (o) => Object.prototype.hasOwnProperty.call(o, e)
    ) || t[t.length - 1], s = Object.getOwnPropertyDescriptor(r, e);
    return s?.set && s?.get ? s.set.call(n, i) || !0 : Reflect.set(r, e, i);
  }
};
function xs() {
  return Reflect.ownKeys(this).reduce((e, i) => (e[i] = Reflect.get(this, i), e), {});
}
function $n(t) {
  let e = (n) => typeof n == "object" && !Array.isArray(n) && n !== null, i = (n, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = r === "" ? s : `${r}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? n[s] = o.initialize(t, l, s) : e(o) && o !== n && !(o instanceof Element) && i(o, l);
    });
  };
  return i(t);
}
function An(t, e = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, r, s) {
      return t(this.initialValue, () => Es(n, r), (o) => Ve(n, r, o), r, s);
    }
  };
  return e(i), (n) => {
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
function Es(t, e) {
  return e.split(".").reduce((i, n) => i[n], t);
}
function Ve(t, e, i) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = i;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Ve(t[e[0]], e.slice(1), i);
  }
}
var On = {};
function U(t, e) {
  On[t] = e;
}
function Ye(t, e) {
  let i = Is(e);
  return Object.entries(On).forEach(([n, r]) => {
    Object.defineProperty(t, `$${n}`, {
      get() {
        return r(e, i);
      },
      enumerable: !1
    });
  }), t;
}
function Is(t) {
  let [e, i] = Mn(t), n = { interceptor: An, ...e };
  return fi(t, i), n;
}
function Ss(t, e, i, ...n) {
  try {
    return i(...n);
  } catch (r) {
    Wt(r, t, e);
  }
}
function Wt(t, e, i = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: i }
  ), console.warn(`Alpine Expression Error: ${t.message}

${i ? 'Expression: "' + i + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var se = !0;
function Nn(t) {
  let e = se;
  se = !1;
  let i = t();
  return se = e, i;
}
function ft(t, e, i = {}) {
  let n;
  return k(t, e)((r) => n = r, i), n;
}
function k(...t) {
  return kn(...t);
}
var kn = Rn;
function Cs(t) {
  kn = t;
}
function Rn(t, e) {
  let i = {};
  Ye(i, t);
  let n = [i, ...xt(t)], r = typeof e == "function" ? Ts(n, e) : As(n, e, t);
  return Ss.bind(null, t, e, r);
}
function Ts(t, e) {
  return (i = () => {
  }, { scope: n = {}, params: r = [], context: s } = {}) => {
    let o = e.apply(qt([n, ...t]), r);
    ce(i, o);
  };
}
var Le = {};
function $s(t, e) {
  if (Le[t])
    return Le[t];
  let i = Object.getPrototypeOf(async function() {
  }).constructor, n = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, s = (() => {
    try {
      let o = new i(
        ["__self", "scope"],
        `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(o, "name", {
        value: `[Alpine] ${t}`
      }), o;
    } catch (o) {
      return Wt(o, e, t), Promise.resolve();
    }
  })();
  return Le[t] = s, s;
}
function As(t, e, i) {
  let n = $s(e, i);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = qt([s, ...t]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => Wt(u, i, e));
      n.finished ? (ce(r, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        ce(r, u, l, o, i);
      }).catch((u) => Wt(u, i, e)).finally(() => n.result = void 0);
    }
  };
}
function ce(t, e, i, n, r) {
  if (se && typeof e == "function") {
    let s = e.apply(i, n);
    s instanceof Promise ? s.then((o) => ce(t, o, i, n)).catch((o) => Wt(o, r, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
var bi = "x-";
function Tt(t = "") {
  return bi + t;
}
function Os(t) {
  bi = t;
}
var ue = {};
function N(t, e) {
  return ue[t] = e, {
    before(i) {
      if (!ue[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const n = ut.indexOf(i);
      ut.splice(n >= 0 ? n : ut.indexOf("DEFAULT"), 0, t);
    }
  };
}
function Ns(t) {
  return Object.keys(ue).includes(t);
}
function yi(t, e, i) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Ln(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), e = e.concat(s);
  }
  let n = {};
  return e.map(Fn((s, o) => n[s] = o)).filter(Hn).map(Ls(n, i)).sort(Ds).map((s) => Rs(t, s));
}
function Ln(t) {
  return Array.from(t).map(Fn()).filter((e) => !Hn(e));
}
var qe = !1, Ft = /* @__PURE__ */ new Map(), Dn = Symbol();
function ks(t) {
  qe = !0;
  let e = Symbol();
  Dn = e, Ft.set(e, []);
  let i = () => {
    for (; Ft.get(e).length; )
      Ft.get(e).shift()();
    Ft.delete(e);
  }, n = () => {
    qe = !1, i();
  };
  t(i), n();
}
function Mn(t) {
  let e = [], i = (a) => e.push(a), [n, r] = ms(t);
  return e.push(r), [{
    Alpine: Kt,
    effect: n,
    cleanup: i,
    evaluateLater: k.bind(k, t),
    evaluate: ft.bind(ft, t)
  }, () => e.forEach((a) => a())];
}
function Rs(t, e) {
  let i = () => {
  }, n = ue[e.type] || i, [r, s] = Mn(t);
  In(t, e.original, s);
  let o = () => {
    t._x_ignore || t._x_ignoreSelf || (n.inline && n.inline(t, e, r), n = n.bind(n, t, e, r), qe ? Ft.get(Dn).push(n) : n());
  };
  return o.runCleanups = s, o;
}
var Pn = (t, e) => ({ name: i, value: n }) => (i.startsWith(t) && (i = i.replace(t, e)), { name: i, value: n }), zn = (t) => t;
function Fn(t = () => {
}) {
  return ({ name: e, value: i }) => {
    let { name: n, value: r } = Bn.reduce((s, o) => o(s), { name: e, value: i });
    return n !== e && t(n, e), { name: n, value: r };
  };
}
var Bn = [];
function wi(t) {
  Bn.push(t);
}
function Hn({ name: t }) {
  return Wn().test(t);
}
var Wn = () => new RegExp(`^${bi}([^:^.]+)\\b`);
function Ls(t, e) {
  return ({ name: i, value: n }) => {
    let r = i.match(Wn()), s = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = e || t[i] || i;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: n,
      original: a
    };
  };
}
var Ke = "DEFAULT", ut = [
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
  Ke,
  "teleport"
];
function Ds(t, e) {
  let i = ut.indexOf(t.type) === -1 ? Ke : t.type, n = ut.indexOf(e.type) === -1 ? Ke : e.type;
  return ut.indexOf(i) - ut.indexOf(n);
}
function Bt(t, e, i = {}) {
  t.dispatchEvent(
    new CustomEvent(e, {
      detail: i,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0
    })
  );
}
function gt(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((r) => gt(r, e));
    return;
  }
  let i = !1;
  if (e(t, () => i = !0), i)
    return;
  let n = t.firstElementChild;
  for (; n; )
    gt(n, e), n = n.nextElementSibling;
}
function F(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var Pi = !1;
function Ms() {
  Pi && F("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Pi = !0, document.body || F("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Bt(document, "alpine:init"), Bt(document, "alpine:initializing"), mi(), gs((e) => X(e, gt)), fi((e) => At(e)), En((e, i) => {
    yi(e, i).forEach((n) => n());
  });
  let t = (e) => !xe(e.parentElement, !0);
  Array.from(document.querySelectorAll(Vn().join(","))).filter(t).forEach((e) => {
    X(e);
  }), Bt(document, "alpine:initialized"), setTimeout(() => {
    Bs();
  });
}
var _i = [], jn = [];
function Un() {
  return _i.map((t) => t());
}
function Vn() {
  return _i.concat(jn).map((t) => t());
}
function Yn(t) {
  _i.push(t);
}
function qn(t) {
  jn.push(t);
}
function xe(t, e = !1) {
  return $t(t, (i) => {
    if ((e ? Vn() : Un()).some((r) => i.matches(r)))
      return !0;
  });
}
function $t(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack && (t = t._x_teleportBack), !!t.parentElement)
      return $t(t.parentElement, e);
  }
}
function Ps(t) {
  return Un().some((e) => t.matches(e));
}
var Kn = [];
function zs(t) {
  Kn.push(t);
}
var Fs = 1;
function X(t, e = gt, i = () => {
}) {
  $t(t, (n) => n._x_ignore) || ks(() => {
    e(t, (n, r) => {
      n._x_marker || (i(n, r), Kn.forEach((s) => s(n, r)), yi(n, n.attributes).forEach((s) => s()), n._x_ignore || (n._x_marker = Fs++), n._x_ignore && r());
    });
  });
}
function At(t, e = gt) {
  e(t, (i) => {
    vs(i), Sn(i), delete i._x_marker;
  });
}
function Bs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, i, n]) => {
    Ns(i) || n.some((r) => {
      if (document.querySelector(r))
        return F(`found "${r}", but missing ${e} plugin`), !0;
    });
  });
}
var Je = [], xi = !1;
function Ei(t = () => {
}) {
  return queueMicrotask(() => {
    xi || setTimeout(() => {
      Xe();
    });
  }), new Promise((e) => {
    Je.push(() => {
      t(), e();
    });
  });
}
function Xe() {
  for (xi = !1; Je.length; )
    Je.shift()();
}
function Hs() {
  xi = !0;
}
function Ii(t, e) {
  return Array.isArray(e) ? zi(t, e.join(" ")) : typeof e == "object" && e !== null ? Ws(t, e) : typeof e == "function" ? Ii(t, e()) : zi(t, e);
}
function zi(t, e) {
  let i = (r) => r.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), n = (r) => (t.classList.add(...r), () => {
    t.classList.remove(...r);
  });
  return e = e === !0 ? e = "" : e || "", n(i(e));
}
function Ws(t, e) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(e).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function Ee(t, e) {
  return typeof e == "object" && e !== null ? js(t, e) : Us(t, e);
}
function js(t, e) {
  let i = {};
  return Object.entries(e).forEach(([n, r]) => {
    i[n] = t.style[n], n.startsWith("--") || (n = Vs(n)), t.style.setProperty(n, r);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    Ee(t, i);
  };
}
function Us(t, e) {
  let i = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", i || "");
  };
}
function Vs(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ge(t, e = () => {
}) {
  let i = !1;
  return function() {
    i ? e.apply(this, arguments) : (i = !0, t.apply(this, arguments));
  };
}
N("transition", (t, { value: e, modifiers: i, expression: n }, { evaluate: r }) => {
  typeof n == "function" && (n = r(n)), n !== !1 && (!n || typeof n == "boolean" ? qs(t, i, e) : Ys(t, n, e));
});
function Ys(t, e, i) {
  Jn(t, Ii, ""), {
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
  }[i](e);
}
function qs(t, e, i) {
  Jn(t, Ee);
  let n = !e.includes("in") && !e.includes("out") && !i, r = n || e.includes("in") || ["enter"].includes(i), s = n || e.includes("out") || ["leave"].includes(i);
  e.includes("in") && !n && (e = e.filter((g, h) => h < e.indexOf("out"))), e.includes("out") && !n && (e = e.filter((g, h) => h > e.indexOf("out")));
  let o = !e.includes("opacity") && !e.includes("scale"), a = o || e.includes("opacity"), l = o || e.includes("scale"), c = a ? 0 : 1, u = l ? kt(e, "scale", 95) / 100 : 1, d = kt(e, "delay", 0) / 1e3, f = kt(e, "origin", "center"), v = "opacity, transform", x = kt(e, "duration", 150) / 1e3, w = kt(e, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (t._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: v,
    transitionDuration: `${x}s`,
    transitionTimingFunction: p
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (t._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: v,
    transitionDuration: `${w}s`,
    transitionTimingFunction: p
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function Jn(t, e, i = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, r = () => {
    }) {
      Ze(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, r);
    },
    out(n = () => {
    }, r = () => {
    }) {
      Ze(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, n, r);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, i, n) {
  const r = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => r(i);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(i) : s() : t._x_transition ? t._x_transition.in(i) : s();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((o, a) => {
    t._x_transition.out(() => {
    }, () => o(n)), t._x_transitioning && t._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(n), queueMicrotask(() => {
    let o = Xn(t);
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
function Xn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Xn(e);
}
function Ze(t, e, { during: i, start: n, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Ks(t, {
    start() {
      a = e(t, n);
    },
    during() {
      l = e(t, i);
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
function Ks(t, e) {
  let i, n, r, s = Ge(() => {
    O(() => {
      i = !0, n || e.before(), r || (e.end(), Xe()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Ge(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, O(() => {
    e.start(), e.during();
  }), Hs(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), O(() => {
      e.before();
    }), n = !0, requestAnimationFrame(() => {
      i || (O(() => {
        e.end();
      }), Xe(), setTimeout(t._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function kt(t, e, i) {
  if (t.indexOf(e) === -1)
    return i;
  const n = t[t.indexOf(e) + 1];
  if (!n || e === "scale" && isNaN(n))
    return i;
  if (e === "duration" || e === "delay") {
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  return e === "origin" && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [n, t[t.indexOf(e) + 2]].join(" ") : n;
}
var nt = !1;
function ot(t, e = () => {
}) {
  return (...i) => nt ? e(...i) : t(...i);
}
function Js(t) {
  return (...e) => nt && t(...e);
}
var Gn = [];
function Ie(t) {
  Gn.push(t);
}
function Xs(t, e) {
  Gn.forEach((i) => i(t, e)), nt = !0, Zn(() => {
    X(e, (i, n) => {
      n(i, () => {
      });
    });
  }), nt = !1;
}
var Qe = !1;
function Gs(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), nt = !0, Qe = !0, Zn(() => {
    Zs(e);
  }), nt = !1, Qe = !1;
}
function Zs(t) {
  let e = !1;
  X(t, (n, r) => {
    gt(n, (s, o) => {
      if (e && Ps(s))
        return o();
      e = !0, r(s, o);
    });
  });
}
function Zn(t) {
  let e = yt;
  Mi((i, n) => {
    let r = e(i);
    return Ct(r), () => {
    };
  }), t(), Mi(e);
}
function Qn(t, e, i, n = []) {
  switch (t._x_bindings || (t._x_bindings = St({})), t._x_bindings[e] = i, e = n.includes("camel") ? oo(e) : e, e) {
    case "value":
      Qs(t, i);
      break;
    case "style":
      eo(t, i);
      break;
    case "class":
      to(t, i);
      break;
    case "selected":
    case "checked":
      io(t, e, i);
      break;
    default:
      tr(t, e, i);
      break;
  }
}
function Qs(t, e) {
  if (nr(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = oe(t.value) === e : t.checked = Fi(t.value, e));
  else if (Si(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((i) => Fi(i, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    so(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function to(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Ii(t, e);
}
function eo(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Ee(t, e);
}
function io(t, e, i) {
  tr(t, e, i), ro(t, e, i);
}
function tr(t, e, i) {
  [null, void 0, !1].includes(i) && lo(e) ? t.removeAttribute(e) : (er(e) && (i = e), no(t, e, i));
}
function no(t, e, i) {
  t.getAttribute(e) != i && t.setAttribute(e, i);
}
function ro(t, e, i) {
  t[e] !== i && (t[e] = i);
}
function so(t, e) {
  const i = [].concat(e).map((n) => n + "");
  Array.from(t.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function oo(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function Fi(t, e) {
  return t == e;
}
function oe(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var ao = /* @__PURE__ */ new Set([
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
function er(t) {
  return ao.has(t);
}
function lo(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function co(t, e, i) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : ir(t, e, i);
}
function uo(t, e, i, n = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let r = t._x_inlineBindings[e];
    return r.extract = n, Nn(() => ft(t, r.expression));
  }
  return ir(t, e, i);
}
function ir(t, e, i) {
  let n = t.getAttribute(e);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : er(e) ? !![e, "true"].includes(n) : n;
}
function Si(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function nr(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function rr(t, e) {
  let i;
  return function() {
    const n = this, r = arguments, s = function() {
      i = null, t.apply(n, r);
    };
    clearTimeout(i), i = setTimeout(s, e);
  };
}
function sr(t, e) {
  let i;
  return function() {
    let n = this, r = arguments;
    i || (t.apply(n, r), i = !0, setTimeout(() => i = !1, e));
  };
}
function or({ get: t, set: e }, { get: i, set: n }) {
  let r = !0, s, o = yt(() => {
    let a = t(), l = i();
    if (r)
      n(De(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? n(De(a)) : c !== u && e(De(l));
    }
    s = JSON.stringify(t()), JSON.stringify(i());
  });
  return () => {
    Ct(o);
  };
}
function De(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function fo(t) {
  (Array.isArray(t) ? t : [t]).forEach((i) => i(Kt));
}
var lt = {}, Bi = !1;
function ho(t, e) {
  if (Bi || (lt = St(lt), Bi = !0), e === void 0)
    return lt[t];
  lt[t] = e, $n(lt[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && lt[t].init();
}
function po() {
  return lt;
}
var ar = {};
function mo(t, e) {
  let i = typeof e != "function" ? () => e : e;
  return t instanceof Element ? lr(t, i()) : (ar[t] = i, () => {
  });
}
function go(t) {
  return Object.entries(ar).forEach(([e, i]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), t;
}
function lr(t, e, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let r = Object.entries(e).map(([o, a]) => ({ name: o, value: a })), s = Ln(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), yi(t, r, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var cr = {};
function vo(t, e) {
  cr[t] = e;
}
function bo(t, e) {
  return Object.entries(cr).forEach(([i, n]) => {
    Object.defineProperty(t, i, {
      get() {
        return (...r) => n.bind(e)(...r);
      },
      enumerable: !1
    });
  }), t;
}
var yo = {
  get reactive() {
    return St;
  },
  get release() {
    return Ct;
  },
  get effect() {
    return yt;
  },
  get raw() {
    return bn;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: ws,
  dontAutoEvaluateFunctions: Nn,
  disableEffectScheduling: hs,
  startObservingMutations: mi,
  stopObservingMutations: Cn,
  setReactivityEngine: ps,
  onAttributeRemoved: In,
  onAttributesAdded: En,
  closestDataStack: xt,
  skipDuringClone: ot,
  onlyDuringClone: Js,
  addRootSelector: Yn,
  addInitSelector: qn,
  interceptClone: Ie,
  addScopeToNode: Yt,
  deferMutations: ys,
  mapAttributes: wi,
  evaluateLater: k,
  interceptInit: zs,
  setEvaluator: Cs,
  mergeProxies: qt,
  extractProp: uo,
  findClosest: $t,
  onElRemoved: fi,
  closestRoot: xe,
  destroyTree: At,
  interceptor: An,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Ze,
  // INTERNAL
  setStyles: Ee,
  // INTERNAL
  mutateDom: O,
  directive: N,
  entangle: or,
  throttle: sr,
  debounce: rr,
  evaluate: ft,
  initTree: X,
  nextTick: Ei,
  prefixed: Tt,
  prefix: Os,
  plugin: fo,
  magic: U,
  store: ho,
  start: Ms,
  clone: Gs,
  // INTERNAL
  cloneNode: Xs,
  // INTERNAL
  bound: co,
  $data: Tn,
  watch: yn,
  walk: gt,
  data: vo,
  bind: mo
}, Kt = yo;
function wo(t, e) {
  const i = /* @__PURE__ */ Object.create(null), n = t.split(",");
  for (let r = 0; r < n.length; r++)
    i[n[r]] = !0;
  return (r) => !!i[r];
}
var _o = Object.freeze({}), xo = Object.prototype.hasOwnProperty, Se = (t, e) => xo.call(t, e), ht = Array.isArray, Ht = (t) => ur(t) === "[object Map]", Eo = (t) => typeof t == "string", Ci = (t) => typeof t == "symbol", Ce = (t) => t !== null && typeof t == "object", Io = Object.prototype.toString, ur = (t) => Io.call(t), dr = (t) => ur(t).slice(8, -1), Ti = (t) => Eo(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, So = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (i) => e[i] || (e[i] = t(i));
}, Co = So((t) => t.charAt(0).toUpperCase() + t.slice(1)), fr = (t, e) => t !== e && (t === t || e === e), ti = /* @__PURE__ */ new WeakMap(), Rt = [], q, pt = Symbol("iterate"), ei = Symbol("Map key iterate");
function To(t) {
  return t && t._isEffect === !0;
}
function $o(t, e = _o) {
  To(t) && (t = t.raw);
  const i = No(t, e);
  return e.lazy || i(), i;
}
function Ao(t) {
  t.active && (hr(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var Oo = 0;
function No(t, e) {
  const i = function() {
    if (!i.active)
      return t();
    if (!Rt.includes(i)) {
      hr(i);
      try {
        return Ro(), Rt.push(i), q = i, t();
      } finally {
        Rt.pop(), pr(), q = Rt[Rt.length - 1];
      }
    }
  };
  return i.id = Oo++, i.allowRecurse = !!e.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = t, i.deps = [], i.options = e, i;
}
function hr(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let i = 0; i < e.length; i++)
      e[i].delete(t);
    e.length = 0;
  }
}
var Et = !0, $i = [];
function ko() {
  $i.push(Et), Et = !1;
}
function Ro() {
  $i.push(Et), Et = !0;
}
function pr() {
  const t = $i.pop();
  Et = t === void 0 ? !0 : t;
}
function H(t, e, i) {
  if (!Et || q === void 0)
    return;
  let n = ti.get(t);
  n || ti.set(t, n = /* @__PURE__ */ new Map());
  let r = n.get(i);
  r || n.set(i, r = /* @__PURE__ */ new Set()), r.has(q) || (r.add(q), q.deps.push(r), q.options.onTrack && q.options.onTrack({
    effect: q,
    target: t,
    type: e,
    key: i
  }));
}
function rt(t, e, i, n, r, s) {
  const o = ti.get(t);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== q || d.allowRecurse) && a.add(d);
    });
  };
  if (e === "clear")
    o.forEach(l);
  else if (i === "length" && ht(t))
    o.forEach((u, d) => {
      (d === "length" || d >= n) && l(u);
    });
  else
    switch (i !== void 0 && l(o.get(i)), e) {
      case "add":
        ht(t) ? Ti(i) && l(o.get("length")) : (l(o.get(pt)), Ht(t) && l(o.get(ei)));
        break;
      case "delete":
        ht(t) || (l(o.get(pt)), Ht(t) && l(o.get(ei)));
        break;
      case "set":
        Ht(t) && l(o.get(pt));
        break;
    }
  const c = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: t,
      key: i,
      type: e,
      newValue: n,
      oldValue: r,
      oldTarget: s
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(c);
}
var Lo = /* @__PURE__ */ wo("__proto__,__v_isRef,__isVue"), mr = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter(Ci)), Do = /* @__PURE__ */ gr(), Mo = /* @__PURE__ */ gr(!0), Hi = /* @__PURE__ */ Po();
function Po() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...i) {
      const n = A(this);
      for (let s = 0, o = this.length; s < o; s++)
        H(n, "get", s + "");
      const r = n[e](...i);
      return r === -1 || r === !1 ? n[e](...i.map(A)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...i) {
      ko();
      const n = A(this)[e].apply(this, i);
      return pr(), n;
    };
  }), t;
}
function gr(t = !1, e = !1) {
  return function(n, r, s) {
    if (r === "__v_isReactive")
      return !t;
    if (r === "__v_isReadonly")
      return t;
    if (r === "__v_raw" && s === (t ? e ? Go : wr : e ? Xo : yr).get(n))
      return n;
    const o = ht(n);
    if (!t && o && Se(Hi, r))
      return Reflect.get(Hi, r, s);
    const a = Reflect.get(n, r, s);
    return (Ci(r) ? mr.has(r) : Lo(r)) || (t || H(n, "get", r), e) ? a : ii(a) ? !o || !Ti(r) ? a.value : a : Ce(a) ? t ? _r(a) : ki(a) : a;
  };
}
var zo = /* @__PURE__ */ Fo();
function Fo(t = !1) {
  return function(i, n, r, s) {
    let o = i[n];
    if (!t && (r = A(r), o = A(o), !ht(i) && ii(o) && !ii(r)))
      return o.value = r, !0;
    const a = ht(i) && Ti(n) ? Number(n) < i.length : Se(i, n), l = Reflect.set(i, n, r, s);
    return i === A(s) && (a ? fr(r, o) && rt(i, "set", n, r, o) : rt(i, "add", n, r)), l;
  };
}
function Bo(t, e) {
  const i = Se(t, e), n = t[e], r = Reflect.deleteProperty(t, e);
  return r && i && rt(t, "delete", e, void 0, n), r;
}
function Ho(t, e) {
  const i = Reflect.has(t, e);
  return (!Ci(e) || !mr.has(e)) && H(t, "has", e), i;
}
function Wo(t) {
  return H(t, "iterate", ht(t) ? "length" : pt), Reflect.ownKeys(t);
}
var jo = {
  get: Do,
  set: zo,
  deleteProperty: Bo,
  has: Ho,
  ownKeys: Wo
}, Uo = {
  get: Mo,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, Ai = (t) => Ce(t) ? ki(t) : t, Oi = (t) => Ce(t) ? _r(t) : t, Ni = (t) => t, Te = (t) => Reflect.getPrototypeOf(t);
function Xt(t, e, i = !1, n = !1) {
  t = t.__v_raw;
  const r = A(t), s = A(e);
  e !== s && !i && H(r, "get", e), !i && H(r, "get", s);
  const { has: o } = Te(r), a = n ? Ni : i ? Oi : Ai;
  if (o.call(r, e))
    return a(t.get(e));
  if (o.call(r, s))
    return a(t.get(s));
  t !== r && t.get(e);
}
function Gt(t, e = !1) {
  const i = this.__v_raw, n = A(i), r = A(t);
  return t !== r && !e && H(n, "has", t), !e && H(n, "has", r), t === r ? i.has(t) : i.has(t) || i.has(r);
}
function Zt(t, e = !1) {
  return t = t.__v_raw, !e && H(A(t), "iterate", pt), Reflect.get(t, "size", t);
}
function Wi(t) {
  t = A(t);
  const e = A(this);
  return Te(e).has.call(e, t) || (e.add(t), rt(e, "add", t, t)), this;
}
function ji(t, e) {
  e = A(e);
  const i = A(this), { has: n, get: r } = Te(i);
  let s = n.call(i, t);
  s ? br(i, n, t) : (t = A(t), s = n.call(i, t));
  const o = r.call(i, t);
  return i.set(t, e), s ? fr(e, o) && rt(i, "set", t, e, o) : rt(i, "add", t, e), this;
}
function Ui(t) {
  const e = A(this), { has: i, get: n } = Te(e);
  let r = i.call(e, t);
  r ? br(e, i, t) : (t = A(t), r = i.call(e, t));
  const s = n ? n.call(e, t) : void 0, o = e.delete(t);
  return r && rt(e, "delete", t, void 0, s), o;
}
function Vi() {
  const t = A(this), e = t.size !== 0, i = Ht(t) ? new Map(t) : new Set(t), n = t.clear();
  return e && rt(t, "clear", void 0, void 0, i), n;
}
function Qt(t, e) {
  return function(n, r) {
    const s = this, o = s.__v_raw, a = A(o), l = e ? Ni : t ? Oi : Ai;
    return !t && H(a, "iterate", pt), o.forEach((c, u) => n.call(r, l(c), l(u), s));
  };
}
function te(t, e, i) {
  return function(...n) {
    const r = this.__v_raw, s = A(r), o = Ht(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...n), u = i ? Ni : e ? Oi : Ai;
    return !e && H(s, "iterate", l ? ei : pt), {
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
      const i = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${Co(t)} operation ${i}failed: target is readonly.`, A(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function Vo() {
  const t = {
    get(s) {
      return Xt(this, s);
    },
    get size() {
      return Zt(this);
    },
    has: Gt,
    add: Wi,
    set: ji,
    delete: Ui,
    clear: Vi,
    forEach: Qt(!1, !1)
  }, e = {
    get(s) {
      return Xt(this, s, !1, !0);
    },
    get size() {
      return Zt(this);
    },
    has: Gt,
    add: Wi,
    set: ji,
    delete: Ui,
    clear: Vi,
    forEach: Qt(!1, !0)
  }, i = {
    get(s) {
      return Xt(this, s, !0);
    },
    get size() {
      return Zt(this, !0);
    },
    has(s) {
      return Gt.call(this, s, !0);
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
  }, n = {
    get(s) {
      return Xt(this, s, !0, !0);
    },
    get size() {
      return Zt(this, !0);
    },
    has(s) {
      return Gt.call(this, s, !0);
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
    t[s] = te(s, !1, !1), i[s] = te(s, !0, !1), e[s] = te(s, !1, !0), n[s] = te(s, !0, !0);
  }), [
    t,
    i,
    e,
    n
  ];
}
var [Yo, qo, zc, Fc] = /* @__PURE__ */ Vo();
function vr(t, e) {
  const i = t ? qo : Yo;
  return (n, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? n : Reflect.get(Se(i, r) && r in n ? i : n, r, s);
}
var Ko = {
  get: /* @__PURE__ */ vr(!1)
}, Jo = {
  get: /* @__PURE__ */ vr(!0)
};
function br(t, e, i) {
  const n = A(i);
  if (n !== i && e.call(t, n)) {
    const r = dr(t);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var yr = /* @__PURE__ */ new WeakMap(), Xo = /* @__PURE__ */ new WeakMap(), wr = /* @__PURE__ */ new WeakMap(), Go = /* @__PURE__ */ new WeakMap();
function Zo(t) {
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
function Qo(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Zo(dr(t));
}
function ki(t) {
  return t && t.__v_isReadonly ? t : xr(t, !1, jo, Ko, yr);
}
function _r(t) {
  return xr(t, !0, Uo, Jo, wr);
}
function xr(t, e, i, n, r) {
  if (!Ce(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = r.get(t);
  if (s)
    return s;
  const o = Qo(t);
  if (o === 0)
    return t;
  const a = new Proxy(t, o === 2 ? n : i);
  return r.set(t, a), a;
}
function A(t) {
  return t && A(t.__v_raw) || t;
}
function ii(t) {
  return !!(t && t.__v_isRef === !0);
}
U("nextTick", () => Ei);
U("dispatch", (t) => Bt.bind(Bt, t));
U("watch", (t, { evaluateLater: e, cleanup: i }) => (n, r) => {
  let s = e(n), a = yn(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  i(a);
});
U("store", po);
U("data", (t) => Tn(t));
U("root", (t) => xe(t));
U("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = qt(ta(t))), t._x_refs_proxy));
function ta(t) {
  let e = [];
  return $t(t, (i) => {
    i._x_refs && e.push(i._x_refs);
  }), e;
}
var Me = {};
function Er(t) {
  return Me[t] || (Me[t] = 0), ++Me[t];
}
function ea(t, e) {
  return $t(t, (i) => {
    if (i._x_ids && i._x_ids[e])
      return !0;
  });
}
function ia(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = Er(e));
}
U("id", (t, { cleanup: e }) => (i, n = null) => {
  let r = `${i}${n ? `-${n}` : ""}`;
  return na(t, r, e, () => {
    let s = ea(t, i), o = s ? s._x_ids[i] : Er(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
Ie((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function na(t, e, i, n) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let r = n();
  return t._x_id[e] = r, i(() => {
    delete t._x_id[e];
  }), r;
}
U("el", (t) => t);
Ir("Focus", "focus", "focus");
Ir("Persist", "persist", "persist");
function Ir(t, e, i) {
  U(e, (n) => F(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
N("modelable", (t, { expression: e }, { effect: i, evaluateLater: n, cleanup: r }) => {
  let s = n(e), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = n(`${e} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let u = t._x_model.get, d = t._x_model.set, f = or(
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
          l(v);
        }
      }
    );
    r(f);
  });
});
N("teleport", (t, { modifiers: e, expression: i }, { cleanup: n }) => {
  t.tagName.toLowerCase() !== "template" && F("x-teleport can only be used on a <template> tag", t);
  let r = Yi(i), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Yt(s, {}, t);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  O(() => {
    o(s, r, e), ot(() => {
      X(s);
    })();
  }), t._x_teleportPutBack = () => {
    let a = Yi(i);
    O(() => {
      o(t._x_teleport, a, e);
    });
  }, n(
    () => O(() => {
      s.remove(), At(s);
    })
  );
});
var ra = document.createElement("div");
function Yi(t) {
  let e = ot(() => document.querySelector(t), () => ra)();
  return e || F(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var Sr = () => {
};
Sr.inline = (t, { modifiers: e }, { cleanup: i }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, i(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
N("ignore", Sr);
N("effect", ot((t, { expression: e }, { effect: i }) => {
  i(k(t, e));
}));
function ni(t, e, i, n) {
  let r = t, s = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (e = sa(e)), i.includes("camel") && (e = oa(e)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (r = window), i.includes("document") && (r = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = de(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = rr(s, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = de(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = sr(s, c);
  }
  return i.includes("prevent") && (s = a(s, (l, c) => {
    c.preventDefault(), l(c);
  })), i.includes("stop") && (s = a(s, (l, c) => {
    c.stopPropagation(), l(c);
  })), i.includes("once") && (s = a(s, (l, c) => {
    l(c), r.removeEventListener(e, s, o);
  })), (i.includes("away") || i.includes("outside")) && (r = document, s = a(s, (l, c) => {
    t.contains(c.target) || c.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && l(c));
  })), i.includes("self") && (s = a(s, (l, c) => {
    c.target === t && l(c);
  })), (la(e) || Cr(e)) && (s = a(s, (l, c) => {
    ca(c, i) || l(c);
  })), r.addEventListener(e, s, o), () => {
    r.removeEventListener(e, s, o);
  };
}
function sa(t) {
  return t.replace(/-/g, ".");
}
function oa(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function de(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function aa(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function la(t) {
  return ["keydown", "keyup"].includes(t);
}
function Cr(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function ca(t, e) {
  let i = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, de((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, de((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && qi(t.key).includes(i[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), t[`${o}Key`])).length === r.length && (Cr(t.type) || qi(t.key).includes(i[0])));
}
function qi(t) {
  if (!t)
    return [];
  t = aa(t);
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
  return e[t] = t, Object.keys(e).map((i) => {
    if (e[i] === t)
      return i;
  }).filter((i) => i);
}
N("model", (t, { modifiers: e, expression: i }, { effect: n, cleanup: r }) => {
  let s = t;
  e.includes("parent") && (s = t.parentNode);
  let o = k(s, i), a;
  typeof i == "string" ? a = k(s, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = k(s, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((v) => f = v), Ki(f) ? f.get() : f;
  }, c = (f) => {
    let v;
    o((x) => v = x), Ki(v) ? v.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof i == "string" && t.type === "radio" && O(() => {
    t.hasAttribute("name") || t.setAttribute("name", i);
  });
  let u = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input", d = nt ? () => {
  } : ni(t, u, e, (f) => {
    c(Pe(t, e, f, l()));
  });
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || Si(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    Pe(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = d, r(() => t._x_removeModelListeners.default()), t.form) {
    let f = ni(t.form, "reset", [], (v) => {
      Ei(() => t._x_model && t._x_model.set(Pe(t, e, { target: t }, l())));
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
    f === void 0 && typeof i == "string" && i.match(/\./) && (f = ""), window.fromModel = !0, O(() => Qn(t, "value", f)), delete window.fromModel;
  }, n(() => {
    let f = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Pe(t, e, i, n) {
  return O(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Si(t))
      if (Array.isArray(n)) {
        let r = null;
        return e.includes("number") ? r = ze(i.target.value) : e.includes("boolean") ? r = oe(i.target.value) : r = i.target.value, i.target.checked ? n.includes(r) ? n : n.concat([r]) : n.filter((s) => !ua(s, r));
      } else
        return i.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return ze(s);
        }) : e.includes("boolean") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return oe(s);
        }) : Array.from(i.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return nr(t) ? i.target.checked ? r = i.target.value : r = n : r = i.target.value, e.includes("number") ? ze(r) : e.includes("boolean") ? oe(r) : e.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function ze(t) {
  let e = t ? parseFloat(t) : null;
  return da(e) ? e : t;
}
function ua(t, e) {
  return t == e;
}
function da(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Ki(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
N("cloak", (t) => queueMicrotask(() => O(() => t.removeAttribute(Tt("cloak")))));
qn(() => `[${Tt("init")}]`);
N("init", ot((t, { expression: e }, { evaluate: i }) => typeof e == "string" ? !!e.trim() && i(e, {}, !1) : i(e, {}, !1)));
N("text", (t, { expression: e }, { effect: i, evaluateLater: n }) => {
  let r = n(e);
  i(() => {
    r((s) => {
      O(() => {
        t.textContent = s;
      });
    });
  });
});
N("html", (t, { expression: e }, { effect: i, evaluateLater: n }) => {
  let r = n(e);
  i(() => {
    r((s) => {
      O(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, X(t), delete t._x_ignoreSelf;
      });
    });
  });
});
wi(Pn(":", zn(Tt("bind:"))));
var Tr = (t, { value: e, modifiers: i, expression: n, original: r }, { effect: s, cleanup: o }) => {
  if (!e) {
    let l = {};
    go(l), k(t, n)((u) => {
      lr(t, u, r);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return fa(t, n);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let a = k(t, n);
  s(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), O(() => Qn(t, e, l, i));
  })), o(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
Tr.inline = (t, { value: e, modifiers: i, expression: n }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: n, extract: !1 });
};
N("bind", Tr);
function fa(t, e) {
  t._x_keyExpression = e;
}
Yn(() => `[${Tt("data")}]`);
N("data", (t, { expression: e }, { cleanup: i }) => {
  if (ha(t))
    return;
  e = e === "" ? "{}" : e;
  let n = {};
  Ye(n, t);
  let r = {};
  bo(r, n);
  let s = ft(t, e, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Ye(s, t);
  let o = St(s);
  $n(o);
  let a = Yt(t, o);
  o.init && ft(t, o.init), i(() => {
    o.destroy && ft(t, o.destroy), a();
  });
});
Ie((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function ha(t) {
  return nt ? Qe ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (t, { modifiers: e, expression: i }, { effect: n }) => {
  let r = k(t, i);
  t._x_doHide || (t._x_doHide = () => {
    O(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    O(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let s = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, o = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, a = () => setTimeout(o), l = Ge(
    (d) => d ? o() : s(),
    (d) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  n(() => r((d) => {
    !u && d === c || (e.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
N("for", (t, { expression: e }, { effect: i, cleanup: n }) => {
  let r = ma(e), s = k(t, r.items), o = k(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, i(() => pa(t, r, s, o)), n(() => {
    Object.values(t._x_lookup).forEach((a) => O(
      () => {
        At(a), a.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function pa(t, e, i, n) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = t;
  i((o) => {
    ga(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = t._x_lookup, l = t._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, g]) => {
        let h = Ji(e, g, p, o);
        n((y) => {
          u.includes(y) && F("Duplicate key on x-for", t), u.push(y);
        }, { scope: { index: p, ...h } }), c.push(h);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let g = Ji(e, o[p], p, o);
        n((h) => {
          u.includes(h) && F("Duplicate key on x-for", t), u.push(h);
        }, { scope: { index: p, ...g } }), c.push(g);
      }
    let d = [], f = [], v = [], x = [];
    for (let p = 0; p < l.length; p++) {
      let g = l[p];
      u.indexOf(g) === -1 && v.push(g);
    }
    l = l.filter((p) => !v.includes(p));
    let w = "template";
    for (let p = 0; p < u.length; p++) {
      let g = u[p], h = l.indexOf(g);
      if (h === -1)
        l.splice(p, 0, g), d.push([w, p]);
      else if (h !== p) {
        let y = l.splice(p, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(p, 0, E), l.splice(h, 0, y), f.push([y, E]);
      } else
        x.push(g);
      w = g;
    }
    for (let p = 0; p < v.length; p++) {
      let g = v[p];
      g in a && (O(() => {
        At(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let p = 0; p < f.length; p++) {
      let [g, h] = f[p], y = a[g], E = a[h], _ = document.createElement("div");
      O(() => {
        E || F('x-for ":key" is undefined or invalid', s, h, a), E.after(_), y.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), _.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), _.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let p = 0; p < d.length; p++) {
      let [g, h] = d[p], y = g === "template" ? s : a[g];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let E = c[h], _ = u[h], m = document.importNode(s.content, !0).firstElementChild, b = St(E);
      Yt(m, b, s), m._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([S, C]) => {
          b[S] = C;
        });
      }, O(() => {
        y.after(m), ot(() => X(m))();
      }), typeof _ == "object" && F("x-for key cannot be an object, it must be a string or an integer", s), a[_] = m;
    }
    for (let p = 0; p < x.length; p++)
      a[x[p]]._x_refreshXForScope(c[u.indexOf(x[p])]);
    s._x_prevKeys = u;
  });
}
function ma(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = t.match(n);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(i, "").trim(), a = o.match(e);
  return a ? (s.item = o.replace(e, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Ji(t, e, i, n) {
  let r = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = e[a];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = e[o];
  }) : r[t.item] = e, t.index && (r[t.index] = i), t.collection && (r[t.collection] = n), r;
}
function ga(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function $r() {
}
$r.inline = (t, { expression: e }, { cleanup: i }) => {
  let n = xe(t);
  n._x_refs || (n._x_refs = {}), n._x_refs[e] = t, i(() => delete n._x_refs[e]);
};
N("ref", $r);
N("if", (t, { expression: e }, { effect: i, cleanup: n }) => {
  t.tagName.toLowerCase() !== "template" && F("x-if can only be used on a <template> tag", t);
  let r = k(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let a = t.content.cloneNode(!0).firstElementChild;
    return Yt(a, {}, t), O(() => {
      t.after(a), ot(() => X(a))();
    }), t._x_currentIfEl = a, t._x_undoIf = () => {
      O(() => {
        At(a), a.remove();
      }), delete t._x_currentIfEl;
    }, a;
  }, o = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  i(() => r((a) => {
    a ? s() : o();
  })), n(() => t._x_undoIf && t._x_undoIf());
});
N("id", (t, { expression: e }, { evaluate: i }) => {
  i(e).forEach((r) => ia(t, r));
});
Ie((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
wi(Pn("@", zn(Tt("on:"))));
N("on", ot((t, { value: e, modifiers: i, expression: n }, { cleanup: r }) => {
  let s = n ? k(t, n) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let o = ni(t, e, i, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
$e("Collapse", "collapse", "collapse");
$e("Intersect", "intersect", "intersect");
$e("Focus", "trap", "focus");
$e("Mask", "mask", "mask");
function $e(t, e, i) {
  N(e, (n) => F(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
Kt.setEvaluator(Rn);
Kt.setReactivityEngine({ reactive: ki, effect: $o, release: Ao, raw: A });
var va = Kt, Ar = va;
function ba(t) {
  t.directive("collapse", e), e.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function e(i, { modifiers: n }) {
    let r = Xi(n, "duration", 250) / 1e3, s = Xi(n, "min", 0), o = !n.includes("min");
    i._x_isShown || (i.style.height = `${s}px`), !i._x_isShown && o && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let a = (c, u) => {
      let d = t.setStyles(c, u);
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
        d === f && (d = s), t.transition(i, t.setStyles, {
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
        t.transition(i, a, {
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
function Xi(t, e, i) {
  if (t.indexOf(e) === -1)
    return i;
  const n = t[t.indexOf(e) + 1];
  if (!n)
    return i;
  if (e === "duration") {
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  if (e === "min") {
    let r = n.match(/([0-9]+)px/);
    if (r)
      return r[1];
  }
  return n;
}
var ya = ba;
function wa(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: i, expression: n, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(n), l = {
      rootMargin: Ea(r),
      threshold: _a(r)
    }, c = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting !== (i === "leave") && (a(), r.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(e), o(() => {
      c.disconnect();
    });
  }));
}
function _a(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function xa(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Ea(t) {
  const e = "margin", i = "0px 0px 0px 0px", n = t.indexOf(e);
  if (n === -1)
    return i;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(xa(t[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : i;
}
var Ia = wa, Or = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], fe = /* @__PURE__ */ Or.join(","), Nr = typeof Element > "u", vt = Nr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ri = !Nr && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, kr = function(e, i, n) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(fe));
  return i && vt.call(e, fe) && r.unshift(e), r = r.filter(n), r;
}, Rr = function t(e, i, n) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, n);
      n.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = vt.call(o, fe);
      u && n.filter(o) && (i || !e.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), f = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && f) {
        var v = t(d === !0 ? o.children : d.children, !0, n);
        n.flatten ? r.push.apply(r, v) : r.push({
          scope: o,
          candidates: v
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Lr = function(e, i) {
  return e.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Sa = function(e, i) {
  return e.tabIndex === i.tabIndex ? e.documentOrder - i.documentOrder : e.tabIndex - i.tabIndex;
}, Dr = function(e) {
  return e.tagName === "INPUT";
}, Ca = function(e) {
  return Dr(e) && e.type === "hidden";
}, Ta = function(e) {
  var i = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, $a = function(e, i) {
  for (var n = 0; n < e.length; n++)
    if (e[n].checked && e[n].form === i)
      return e[n];
}, Aa = function(e) {
  if (!e.name)
    return !0;
  var i = e.form || ri(e), n = function(a) {
    return i.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, r;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    r = n(window.CSS.escape(e.name));
  else
    try {
      r = n(e.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var s = $a(r, e.form);
  return !s || s === e;
}, Oa = function(e) {
  return Dr(e) && e.type === "radio";
}, Na = function(e) {
  return Oa(e) && !Aa(e);
}, Gi = function(e) {
  var i = e.getBoundingClientRect(), n = i.width, r = i.height;
  return n === 0 && r === 0;
}, ka = function(e, i) {
  var n = i.displayCheck, r = i.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = vt.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (vt.call(o, "details:not([open]) *"))
    return !0;
  var a = ri(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var u = e.parentElement, d = ri(e);
        if (u && !u.shadowRoot && r(u) === !0)
          return Gi(e);
        e.assignedSlot ? e = e.assignedSlot : !u && d !== e.ownerDocument ? e = d.host : e = u;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (n === "non-zero-area")
    return Gi(e);
  return !1;
}, Ra = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var i = e.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var r = i.children.item(n);
          if (r.tagName === "LEGEND")
            return vt.call(i, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, he = function(e, i) {
  return !(i.disabled || Ca(i) || ka(i, e) || // For a details element with a summary, the summary element gets the focus
  Ta(i) || Ra(i));
}, si = function(e, i) {
  return !(Na(i) || Lr(i) < 0 || !he(e, i));
}, La = function(e) {
  var i = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Da = function t(e) {
  var i = [], n = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Lr(a, o), c = o ? t(r.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), n.sort(Sa).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(i);
}, Ma = function(e, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Rr([e], i.includeContainer, {
    filter: si.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: La
  }) : n = kr(e, i.includeContainer, si.bind(null, i)), Da(n);
}, Mr = function(e, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Rr([e], i.includeContainer, {
    filter: he.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = kr(e, i.includeContainer, he.bind(null, i)), n;
}, ee = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return vt.call(e, fe) === !1 ? !1 : si(i, e);
}, Pa = /* @__PURE__ */ Or.concat("iframe").join(","), ae = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return vt.call(e, Pa) === !1 ? !1 : he(i, e);
};
function Zi(t, e) {
  var i = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function Qi(t) {
  for (var e = 1; e < arguments.length; e++) {
    var i = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Zi(Object(i), !0).forEach(function(n) {
      za(t, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : Zi(Object(i)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return t;
}
function za(t, e, i) {
  return e in t ? Object.defineProperty(t, e, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = i, t;
}
var tn = /* @__PURE__ */ function() {
  var t = [];
  return {
    activateTrap: function(i) {
      if (t.length > 0) {
        var n = t[t.length - 1];
        n !== i && n.pause();
      }
      var r = t.indexOf(i);
      r === -1 || t.splice(r, 1), t.push(i);
    },
    deactivateTrap: function(i) {
      var n = t.indexOf(i);
      n !== -1 && t.splice(n, 1), t.length > 0 && t[t.length - 1].unpause();
    }
  };
}(), Fa = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Ba = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, Ha = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, en = function(e) {
  return setTimeout(e, 0);
}, nn = function(e, i) {
  var n = -1;
  return e.every(function(r, s) {
    return i(r) ? (n = s, !1) : !0;
  }), n;
}, Lt = function(e) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, n) : e;
}, ie = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Wa = function(e, i) {
  var n = i?.document || document, r = Qi({
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
  }, o, a = function(m, b, I) {
    return m && m[b] !== void 0 ? m[b] : r[I || b];
  }, l = function(m) {
    return s.containerGroups.findIndex(function(b) {
      var I = b.container, S = b.tabbableNodes;
      return I.contains(m) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      S.find(function(C) {
        return C === m;
      });
    });
  }, c = function(m) {
    var b = r[m];
    if (typeof b == "function") {
      for (var I = arguments.length, S = new Array(I > 1 ? I - 1 : 0), C = 1; C < I; C++)
        S[C - 1] = arguments[C];
      b = b.apply(void 0, S);
    }
    if (b === !0 && (b = void 0), !b) {
      if (b === void 0 || b === !1)
        return b;
      throw new Error("`".concat(m, "` was specified but was not a node, or did not return a node"));
    }
    var T = b;
    if (typeof b == "string" && (T = n.querySelector(b), !T))
      throw new Error("`".concat(m, "` as selector refers to no known node"));
    return T;
  }, u = function() {
    var m = c("initialFocus");
    if (m === !1)
      return !1;
    if (m === void 0)
      if (l(n.activeElement) >= 0)
        m = n.activeElement;
      else {
        var b = s.tabbableGroups[0], I = b && b.firstTabbableNode;
        m = I || c("fallbackFocus");
      }
    if (!m)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return m;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(m) {
      var b = Ma(m, r.tabbableOptions), I = Mr(m, r.tabbableOptions);
      return {
        container: m,
        tabbableNodes: b,
        focusableNodes: I,
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
        nextTabbableNode: function(C) {
          var T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, R = I.findIndex(function(L) {
            return L === C;
          });
          if (!(R < 0))
            return T ? I.slice(R + 1).find(function(L) {
              return ee(L, r.tabbableOptions);
            }) : I.slice(0, R).reverse().find(function(L) {
              return ee(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(m) {
      return m.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function _(m) {
    if (m !== !1 && m !== n.activeElement) {
      if (!m || !m.focus) {
        _(u());
        return;
      }
      m.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = m, Fa(m) && m.select();
    }
  }, v = function(m) {
    var b = c("setReturnFocus", m);
    return b || (b === !1 ? !1 : m);
  }, x = function(m) {
    var b = ie(m);
    if (!(l(b) >= 0)) {
      if (Lt(r.clickOutsideDeactivates, m)) {
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
          returnFocus: r.returnFocusOnDeactivate && !ae(b, r.tabbableOptions)
        });
        return;
      }
      Lt(r.allowOutsideClick, m) || m.preventDefault();
    }
  }, w = function(m) {
    var b = ie(m), I = l(b) >= 0;
    I || b instanceof Document ? I && (s.mostRecentlyFocusedNode = b) : (m.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, p = function(m) {
    var b = ie(m);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var S = l(b), C = S >= 0 ? s.containerGroups[S] : void 0;
      if (S < 0)
        m.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (m.shiftKey) {
        var T = nn(s.tabbableGroups, function(B) {
          var z = B.firstTabbableNode;
          return b === z;
        });
        if (T < 0 && (C.container === b || ae(b, r.tabbableOptions) && !ee(b, r.tabbableOptions) && !C.nextTabbableNode(b, !1)) && (T = S), T >= 0) {
          var R = T === 0 ? s.tabbableGroups.length - 1 : T - 1, L = s.tabbableGroups[R];
          I = L.lastTabbableNode;
        }
      } else {
        var V = nn(s.tabbableGroups, function(B) {
          var z = B.lastTabbableNode;
          return b === z;
        });
        if (V < 0 && (C.container === b || ae(b, r.tabbableOptions) && !ee(b, r.tabbableOptions) && !C.nextTabbableNode(b)) && (V = S), V >= 0) {
          var P = V === s.tabbableGroups.length - 1 ? 0 : V + 1, at = s.tabbableGroups[P];
          I = at.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (m.preventDefault(), f(I));
  }, g = function(m) {
    if (Ba(m) && Lt(r.escapeDeactivates, m) !== !1) {
      m.preventDefault(), o.deactivate();
      return;
    }
    if (Ha(m)) {
      p(m);
      return;
    }
  }, h = function(m) {
    var b = ie(m);
    l(b) >= 0 || Lt(r.clickOutsideDeactivates, m) || Lt(r.allowOutsideClick, m) || (m.preventDefault(), m.stopImmediatePropagation());
  }, y = function() {
    if (s.active)
      return tn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? en(function() {
        f(u());
      }) : f(u()), n.addEventListener("focusin", w, !0), n.addEventListener("mousedown", x, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", x, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", h, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", g, {
        capture: !0,
        passive: !1
      }), o;
  }, E = function() {
    if (s.active)
      return n.removeEventListener("focusin", w, !0), n.removeEventListener("mousedown", x, !0), n.removeEventListener("touchstart", x, !0), n.removeEventListener("click", h, !0), n.removeEventListener("keydown", g, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(m) {
      if (s.active)
        return this;
      var b = a(m, "onActivate"), I = a(m, "onPostActivate"), S = a(m, "checkCanFocusTrap");
      S || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, b && b();
      var C = function() {
        S && d(), y(), I && I();
      };
      return S ? (S(s.containers.concat()).then(C, C), this) : (C(), this);
    },
    deactivate: function(m) {
      if (!s.active)
        return this;
      var b = Qi({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, m);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, tn.deactivateTrap(o);
      var I = a(b, "onDeactivate"), S = a(b, "onPostDeactivate"), C = a(b, "checkCanReturnFocus"), T = a(b, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var R = function() {
        en(function() {
          T && f(v(s.nodeFocusedBeforeActivation)), S && S();
        });
      };
      return T && C ? (C(v(s.nodeFocusedBeforeActivation)).then(R, R), this) : (R(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), y(), this);
    },
    updateContainerElements: function(m) {
      var b = [].concat(m).filter(Boolean);
      return s.containers = b.map(function(I) {
        return typeof I == "string" ? n.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(e), o;
};
function ja(t) {
  let e, i;
  window.addEventListener("focusin", () => {
    e = i, i = document.activeElement;
  }), t.magic("focus", (n) => {
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
        return ae(s);
      },
      previouslyFocused() {
        return e;
      },
      lastFocused() {
        return e;
      },
      focused() {
        return i;
      },
      focusables() {
        return Array.isArray(r) ? r : Mr(r, { displayCheck: "none" });
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
        t.nextTick(() => {
          f = rn(n);
        });
      });
      let v = Wa(n, d), x = () => {
      };
      const w = () => {
        f(), f = () => {
        }, x(), x = () => {
        }, v.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (x = Ua()), setTimeout(() => {
          v.activate();
        }, 15)), !p && u && w(), u = !!p);
      })), l(w);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && rn(n);
    }
  ));
}
function rn(t) {
  let e = [];
  return Pr(t, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), e.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Pr(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((i) => {
    i.isSameNode(t) ? Pr(t.parentNode, e) : e(i);
  });
}
function Ua() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var Va = ja;
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
function Ya() {
  return !0;
}
function qa({ component: t, argument: e }) {
  return new Promise((i) => {
    if (e)
      window.addEventListener(
        e,
        () => i(),
        { once: !0 }
      );
    else {
      const n = (r) => {
        r.detail.id === t.id && (window.removeEventListener("async-alpine:load", n), i());
      };
      window.addEventListener("async-alpine:load", n);
    }
  });
}
function Ka() {
  return new Promise((t) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(t) : setTimeout(t, 200);
  });
}
function Ja({ argument: t }) {
  return new Promise((e) => {
    if (!t)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), e();
    const i = window.matchMedia(`(${t})`);
    i.matches ? e() : i.addEventListener("change", e, { once: !0 });
  });
}
function Xa({ component: t, argument: e }) {
  return new Promise((i) => {
    const n = e || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), i());
    }, { rootMargin: n });
    r.observe(t.el);
  });
}
var sn = {
  eager: Ya,
  event: qa,
  idle: Ka,
  media: Ja,
  visible: Xa
};
async function Ga(t) {
  const e = Za(t.strategy);
  await oi(t, e);
}
async function oi(t, e) {
  if (e.type === "expression") {
    if (e.operator === "&&")
      return Promise.all(
        e.parameters.map((i) => oi(t, i))
      );
    if (e.operator === "||")
      return Promise.any(
        e.parameters.map((i) => oi(t, i))
      );
  }
  return sn[e.method] ? sn[e.method]({
    component: t,
    argument: e.argument
  }) : !1;
}
function Za(t) {
  const e = Qa(t);
  let i = zr(e);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function Qa(t) {
  const e = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, i = [];
  let n;
  for (; (n = e.exec(t)) !== null; ) {
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
function zr(t) {
  let e = on(t);
  for (; t.length > 0 && (t[0].value === "&&" || t[0].value === "|" || t[0].value === "||"); ) {
    const i = t.shift().value, n = on(t);
    e.type === "expression" && e.operator === i ? e.parameters.push(n) : e = {
      type: "expression",
      operator: i,
      parameters: [e, n]
    };
  }
  return e;
}
function on(t) {
  if (t[0].value === "(") {
    t.shift();
    const e = zr(t);
    return t[0].value === ")" && t.shift(), e;
  } else
    return t.shift();
}
function tl(t) {
  const e = "load", i = t.prefixed("load-src"), n = t.prefixed("ignore");
  let r = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, s = !1, o = {}, a = 0;
  function l() {
    return a++;
  }
  t.asyncOptions = (h) => {
    r = {
      ...r,
      ...h
    };
  }, t.asyncData = (h, y = !1) => {
    o[h] = {
      loaded: !1,
      download: y
    };
  }, t.asyncUrl = (h, y) => {
    !h || !y || o[h] || (o[h] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        g(y)
      )
    });
  }, t.asyncAlias = (h) => {
    s = h;
  };
  const c = (h) => {
    t.skipDuringClone(() => {
      h._x_async || (h._x_async = "init", h._x_ignore = !0, h.setAttribute(n, ""));
    })();
  }, u = async (h) => {
    t.skipDuringClone(async () => {
      if (h._x_async !== "init") return;
      h._x_async = "await";
      const { name: y, strategy: E } = d(h);
      await Ga({
        name: y,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(y), h.isConnected && (x(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, t.directive(e, u).before("ignore");
  function d(h) {
    const y = p(h.getAttribute(t.prefixed("data"))), E = h.getAttribute(t.prefixed(e)) || r.defaultStrategy, _ = h.getAttribute(i);
    return _ && t.asyncUrl(y, _), {
      name: y,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (w(h), !o[h] || o[h].loaded)) return;
    const y = await v(h);
    t.data(h, y), o[h].loaded = !0;
  }
  async function v(h) {
    if (!o[h]) return;
    const y = await o[h].download(h);
    return typeof y == "function" ? y : y[h] || y.default || Object.values(y)[0] || !1;
  }
  function x(h) {
    t.destroyTree(h), h._x_ignore = !1, h.removeAttribute(n), !h.closest(`[${n}]`) && t.initTree(h);
  }
  function w(h) {
    if (!(!s || o[h])) {
      if (typeof s == "function") {
        t.asyncData(h, s);
        return;
      }
      t.asyncUrl(h, s.replaceAll("[name]", h));
    }
  }
  function p(h) {
    return (h || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function g(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function el(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function il(t, e) {
  for (var i = 0; i < e.length; i++) {
    var n = e[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
  }
}
function nl(t, e, i) {
  return e && il(t.prototype, e), t;
}
var rl = Object.defineProperty, G = function(t, e) {
  return rl(t, "name", { value: e, configurable: !0 });
}, sl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, ol = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, al = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, ll = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, cl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, ul = G(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Dt = G(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), $ = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, et = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, an = { OUTLINE: "outline", FILLED: "filled" }, Fe = { FADE: "fade", SLIDE: "slide" }, Mt = { CLOSE: Dt(sl), SUCCESS: Dt(ll), ERROR: Dt(ol), WARNING: Dt(cl), INFO: Dt(al) }, ln = G(function(t) {
  t.wrapper.classList.add($.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add($.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), cn = G(function(t) {
  t.wrapper.classList.remove($.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), dl = G(function(t) {
  t.wrapper.classList.add($.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add($.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), fl = G(function(t) {
  t.wrapper.classList.remove($.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Fr = function() {
  function t(e) {
    var i = this;
    el(this, t), this.notifyOut = G(function(B) {
      B(i);
    }, "notifyOut");
    var n = e.notificationsGap, r = n === void 0 ? 20 : n, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, u = c === void 0 ? Fe.FADE : c, d = e.type, f = d === void 0 ? "outline" : d, v = e.title, x = e.text, w = e.showIcon, p = w === void 0 ? !0 : w, g = e.customIcon, h = g === void 0 ? "" : g, y = e.customClass, E = y === void 0 ? "" : y, _ = e.speed, m = _ === void 0 ? 500 : _, b = e.showCloseButton, I = b === void 0 ? !0 : b, S = e.autoclose, C = S === void 0 ? !0 : S, T = e.autotimeout, R = T === void 0 ? 3e3 : T, L = e.position, V = L === void 0 ? "right top" : L, P = e.customWrapper, at = P === void 0 ? "" : P;
    if (this.customWrapper = at, this.status = l, this.title = v, this.text = x, this.showIcon = p, this.customIcon = h, this.customClass = E, this.speed = m, this.effect = u, this.showCloseButton = I, this.autoclose = C, this.autotimeout = R, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return nl(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat($.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add($.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"]($.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"]($.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"]($.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"]($.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"]($.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"]($.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"]($.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add($.NOTIFY_CLOSE), n.innerHTML = Mt.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = ul(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add($.NOTIFY), this.type) {
      case an.OUTLINE:
        this.wrapper.classList.add($.NOTIFY_OUTLINE);
        break;
      case an.FILLED:
        this.wrapper.classList.add($.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add($.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case et.SUCCESS:
        this.wrapper.classList.add($.NOTIFY_SUCCESS);
        break;
      case et.ERROR:
        this.wrapper.classList.add($.NOTIFY_ERROR);
        break;
      case et.WARNING:
        this.wrapper.classList.add($.NOTIFY_WARNING);
        break;
      case et.INFO:
        this.wrapper.classList.add($.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add($.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add($.NOTIFY_CONTENT);
    var n, r;
    this.title && (n = document.createElement("div"), n.classList.add($.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add($.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var i = G(function(r) {
      switch (r) {
        case et.SUCCESS:
          return Mt.SUCCESS;
        case et.ERROR:
          return Mt.ERROR;
        case et.WARNING:
          return Mt.WARNING;
        case et.INFO:
          return Mt.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add($.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
  } }, { key: "setObserver", value: function() {
    var i = this, n = new IntersectionObserver(function(r) {
      if (r[0].intersectionRatio <= 0) i.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      n.observe(i.wrapper);
    }, this.speed);
  } }, { key: "notifyIn", value: function(e) {
    e(this);
  } }, { key: "autoClose", value: function() {
    var i = this;
    setTimeout(function() {
      i.close();
    }, this.autotimeout + this.speed);
  } }, { key: "close", value: function() {
    this.notifyOut(this.selectedNotifyOutEffect);
  } }, { key: "setEffect", value: function() {
    switch (this.effect) {
      case Fe.FADE:
        this.selectedNotifyInEffect = ln, this.selectedNotifyOutEffect = cn;
        break;
      case Fe.SLIDE:
        this.selectedNotifyInEffect = dl, this.selectedNotifyOutEffect = fl;
        break;
      default:
        this.selectedNotifyInEffect = ln, this.selectedNotifyOutEffect = cn;
    }
  } }]), t;
}();
G(Fr, "Notify");
var Br = Fr;
globalThis.Notify = Br;
const Hr = ["success", "error", "warning", "info"], Wr = [
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
], jr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Pt(t = {}) {
  const e = {
    ...jr,
    ...t
  };
  Hr.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), Wr.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new Br(e);
}
const hl = {
  custom: Pt,
  success(t, e = "Success", i = {}) {
    Pt({
      status: "success",
      title: e,
      text: t,
      ...i
    });
  },
  error(t, e = "Error", i = {}) {
    Pt({
      status: "error",
      title: e,
      text: t,
      ...i
    });
  },
  warning(t, e = "Warning", i = {}) {
    Pt({
      status: "warning",
      title: e,
      text: t,
      ...i
    });
  },
  info(t, e = "Info", i = {}) {
    Pt({
      status: "info",
      title: e,
      text: t,
      ...i
    });
  },
  setDefaults(t = {}) {
    Object.assign(jr, t);
  },
  get allowedStatuses() {
    return [...Hr];
  },
  get allowedPositions() {
    return [...Wr];
  }
}, ai = function() {
}, jt = {}, pe = {}, Ut = {};
function pl(t, e) {
  t = Array.isArray(t) ? t : [t];
  const i = [];
  let n = t.length, r = n, s, o, a, l;
  for (s = function(c, u) {
    u.length && i.push(c), r--, r || e(i);
  }; n--; ) {
    if (o = t[n], a = pe[o], a) {
      s(o, a);
      continue;
    }
    l = Ut[o] = Ut[o] || [], l.push(s);
  }
}
function Ur(t, e) {
  if (!t) return;
  const i = Ut[t];
  if (pe[t] = e, !!i)
    for (; i.length; )
      i[0](t, e), i.splice(0, 1);
}
function li(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || ai)(e) : (t.success || ai)(t);
}
function ml(t, e, i, n, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Vr(e, n, r, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(e, l, t.defaultPrevented);
}
function Vr(t, e, i, n) {
  const r = document, s = i.async, o = (i.numRetries || 0) + 1, a = i.before || ai, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, f;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    f = r.createElement("link"), f.rel = "stylesheet", f.href = c, u = "hideFocus" in f, u && f.relList && (u = 0, f.rel = "preload", f.as = "style"), i.inlineStyleNonce && f.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    f = r.createElement("img"), f.src = c;
  else if (f = r.createElement("script"), f.src = c, f.async = s === void 0 ? !0 : s, i.inlineScriptNonce && f.setAttribute("nonce", i.inlineScriptNonce), d = "noModule" in f, /^module!/.test(l)) {
    if (!d) return e(t, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return e(t, "l");
  const v = function(x) {
    ml(x, t, f, e, i, n, o, u);
  };
  f.addEventListener("load", v, { once: !0 }), f.addEventListener("error", v, { once: !0 }), a(t, f) !== !1 && r.head.appendChild(f);
}
function gl(t, e, i) {
  t = Array.isArray(t) ? t : [t];
  let n = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    n--, n || e(r);
  }
  for (let o = 0; o < t.length; o++)
    Vr(t[o], s, i);
}
function it(t, e, i) {
  let n, r;
  if (e && typeof e == "string" && e.trim && (n = e.trim()), r = (n ? i : e) || {}, n) {
    if (n in jt)
      throw "LoadJS";
    jt[n] = !0;
  }
  function s(o, a) {
    gl(t, function(l) {
      li(r, l), o && li({ success: o, error: a }, l), Ur(n, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
it.ready = function(e, i) {
  return pl(e, function(n) {
    li(i, n);
  }), it;
};
it.done = function(e) {
  Ur(e, []);
};
it.reset = function() {
  Object.keys(jt).forEach((e) => delete jt[e]), Object.keys(pe).forEach((e) => delete pe[e]), Object.keys(Ut).forEach((e) => delete Ut[e]);
};
it.isDefined = function(e) {
  return e in jt;
};
function vl(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (t instanceof Element) {
    const e = bl(t) || t;
    let i = Alpine.$data(e);
    if (i === void 0) {
      const n = e.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && un("element", e), i;
  }
  if (typeof t == "string") {
    const e = t.trim();
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${qr(e)}"]`;
    let n = null;
    const r = document.getElementById(e);
    if (r && (n = r.matches(i) ? r : r.querySelector(i)), n || (n = Yr(e)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${e}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(n);
    return s === void 0 && un(`data-alpine-root="${e}"`, n), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function bl(t) {
  if (!(t instanceof Element)) return null;
  const e = t.tagName?.toLowerCase?.() === "rz-proxy", i = t.getAttribute?.("data-for");
  if (e || i) {
    const n = i || "";
    if (!n) return t;
    const r = Yr(n);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return t;
}
function Yr(t) {
  const e = `[data-alpine-root="${qr(t)}"]`, i = document.querySelectorAll(e);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(t) || null;
}
function qr(t) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(t);
  } catch {
  }
  return String(t).replace(/"/g, '\\"');
}
function un(t, e) {
  const i = `${e.tagName?.toLowerCase?.() || "node"}${e.id ? "#" + e.id : ""}${e.classList?.length ? "." + Array.from(e.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${t} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function yl(t) {
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
function wl(t) {
  t.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const e = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (i, n) => {
        i !== e.sectionId && !e.allowMultiple && (e.open = !1);
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
function _l(t) {
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
function xl(t) {
  t.data("rzAspectRatio", () => ({
    init() {
      const e = parseFloat(this.$el.dataset.ratio);
      if (!isNaN(e) && e > 0) {
        const i = 100 / e + "%";
        this.$el.style.paddingBottom = i;
      } else
        this.$el.style.paddingBottom = "100%";
    }
  }));
}
function El(t) {
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
function Il(t, e) {
  t.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.configId, r = this.$el.dataset.nonce;
      if (i.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      e(i, {
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
        onClickDate: (a, l) => {
          this.dispatchCalendarEvent("click-day", {
            event: l,
            dates: a.context.selectedDates
          });
        },
        onClickWeekNumber: (a, l, c, u, d) => {
          this.dispatchCalendarEvent("click-week-number", {
            event: d,
            number: l,
            year: c,
            days: u
          });
        },
        onClickMonth: (a, l) => {
          this.dispatchCalendarEvent("click-month", {
            event: l,
            month: a.context.selectedMonth
          });
        },
        onClickYear: (a, l) => {
          this.dispatchCalendarEvent("click-year", {
            event: l,
            year: a.context.selectedYear
          });
        },
        onClickArrow: (a, l) => {
          this.dispatchCalendarEvent("click-arrow", {
            event: l,
            year: a.context.selectedYear,
            month: a.context.selectedMonth
          });
        },
        onChangeTime: (a, l, c) => {
          this.dispatchCalendarEvent("change-time", {
            event: l,
            time: a.context.selectedTime,
            hours: a.context.selectedHours,
            minutes: a.context.selectedMinutes,
            keeping: a.context.selectedKeeping,
            isError: c
          });
        }
      }, o = {
        ...r.options,
        styles: r.styles,
        ...s
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
function Sl(t) {
  t.data("rzCalendarProvider", () => ({
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
    set date(e) {
      if (!e) {
        this.dates = [];
        return;
      }
      this._isValidIsoDate(e) && (this.dates = this._normalize([e]));
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
      const e = this._format(this.startDate);
      return this.endDate ? `${e} - ${this._format(this.endDate)}` : e;
    },
    // --- Lifecycle ---
    init() {
      this.mode = this.$el.dataset.mode || "single", this.locale = this.$el.dataset.locale || "en-US";
      try {
        this.formatOptions = JSON.parse(this.$el.dataset.formatOptions || "{}");
      } catch {
      }
      try {
        const r = JSON.parse(this.$el.dataset.initialDates || "[]");
        this.dates = this._normalize(r);
      } catch {
        this.dates = [];
      }
      const e = (r) => {
        this.calendarApi = r.detail.instance, this.syncToCalendar();
      };
      this.$el.addEventListener("rz:calendar:init", e), this._handlers.push({ type: "rz:calendar:init", fn: e });
      const i = () => {
        this.calendarApi = null, this._lastAppliedState = null;
      };
      this.$el.addEventListener("rz:calendar:destroy", i), this._handlers.push({ type: "rz:calendar:destroy", fn: i });
      const n = (r) => {
        this._isUpdatingFromCalendar = !0;
        const s = this.isRangeComplete;
        this.dates = this._normalize(r.detail.dates || []), !s && this.isRangeComplete && this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
          detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
          bubbles: !0,
          composed: !0
        })), this.$nextTick(() => this._isUpdatingFromCalendar = !1);
      };
      this.$el.addEventListener("rz:calendar:click-day", n), this._handlers.push({ type: "rz:calendar:click-day", fn: n }), this.$watch("dates", () => {
        if (this._isUpdatingFromCalendar) return;
        const r = Array.isArray(this.dates) ? this.dates : [], s = this._normalize(r);
        if (!Array.isArray(this.dates) || s.length !== this.dates.length || s.some((a, l) => a !== this.dates[l])) {
          this.dates = s;
          return;
        }
        this.syncToCalendar();
      });
    },
    destroy() {
      this._handlers.forEach((e) => this.$el.removeEventListener(e.type, e.fn)), this._handlers = [];
    },
    syncToCalendar() {
      if (!this.calendarApi) return;
      let e = [...this.dates];
      if (this.mode === "multiple-ranged" && this.dates.length >= 2) {
        const a = this.dates[0], l = this.dates[this.dates.length - 1];
        e = [`${a}:${l}`];
      }
      let i, n, r = !1;
      if (this.dates.length > 0) {
        const a = this.parseIsoLocal(this.dates[0]);
        isNaN(a.getTime()) || (i = a.getMonth(), n = a.getFullYear(), r = !0);
      }
      const s = JSON.stringify({ mode: this.mode, dates: e, m: i, y: n });
      if (this._lastAppliedState === s) return;
      this._lastAppliedState = s;
      const o = { selectedDates: e };
      r && (o.selectedMonth = i, o.selectedYear = n), this.calendarApi.set(
        o,
        {
          dates: !0,
          month: r,
          year: r,
          holidays: !1,
          time: !1
        }
      );
    },
    // --- Utilities ---
    _format(e) {
      const i = this.parseIsoLocal(e);
      return isNaN(i.getTime()) ? e : new Intl.DateTimeFormat(this.locale, this.formatOptions).format(i);
    },
    _extractIsoDates(e) {
      return typeof e != "string" ? [] : e.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
    },
    _isValidIsoDate(e) {
      if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return !1;
      const [i, n, r] = e.split("-").map(Number), s = new Date(Date.UTC(i, n - 1, r));
      return s.getUTCFullYear() === i && s.getUTCMonth() + 1 === n && s.getUTCDate() === r;
    },
    _normalize(e) {
      const n = (Array.isArray(e) ? e : []).flat(1 / 0).flatMap((r) => typeof r == "string" ? this._extractIsoDates(r) : []).filter((r) => this._isValidIsoDate(r));
      if (this.mode === "single")
        return [...new Set(n)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const r = n.sort();
        return r.length <= 1 ? r : [r[0], r[r.length - 1]];
      }
      return [...new Set(n)].sort();
    },
    parseIsoLocal(e) {
      const [i, n, r] = e.split("-").map(Number);
      return new Date(i, n - 1, r);
    },
    toLocalISO(e) {
      const i = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
      return `${i}-${n}-${r}`;
    },
    // --- Public API ---
    setToday() {
      this.dates = this._normalize([this.toLocalISO(/* @__PURE__ */ new Date())]);
    },
    addDays(e) {
      if (this.dates.length === 0) return;
      const i = this.parseIsoLocal(this.dates[0]);
      isNaN(i.getTime()) || (i.setDate(i.getDate() + e), this.dates = this._normalize([this.toLocalISO(i)]));
    },
    setDate(e) {
      this.dates = this._normalize(e ? [e] : []);
    },
    clear() {
      this.dates = [];
    },
    toggleDate(e) {
      let i;
      this.dates.includes(e) ? i = this.dates.filter((n) => n !== e) : i = [...this.dates, e], this.dates = this._normalize(i);
    }
  }));
}
function Cl(t, e) {
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
  t.data("rzCarousel", () => ({
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
      n.length > 0 && typeof e == "function" ? e(
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
function Tl(t, e) {
  t.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    init() {
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.codeid, r = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, e(i, {
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
function $l(t) {
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
function Al(t, e) {
  t.data("rzCombobox", () => ({
    tomSelect: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      i.length > 0 && typeof e == "function" ? e(i, {
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
        return t && typeof t.addScopeToNode == "function" ? t.addScopeToNode(c, d) : c._x_dataStack = [d], c.innerHTML = a.innerHTML, c;
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
function Ol(t, e) {
  t.data("rzDateEdit", () => ({
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
      e(r, {
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
function Nl(t) {
  t.data("rzDialog", () => ({
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
        const i = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", e);
        const n = document.body.offsetWidth - i;
        document.body.style.setProperty("--page-scrollbar-width", `${n}px`), e ? this.$nextTick(() => {
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
      const i = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: e },
        bubbles: !0,
        cancelable: !0
      });
      this.$el.dispatchEvent(i), i.defaultPrevented || (this.modalOpen = !0);
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(e = "unknown") {
      const i = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason: e },
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
const ci = Math.min, wt = Math.max, me = Math.round, K = (t) => ({
  x: t,
  y: t
}), kl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Rl = {
  start: "end",
  end: "start"
};
function dn(t, e, i) {
  return wt(t, ci(e, i));
}
function Ae(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function bt(t) {
  return t.split("-")[0];
}
function Oe(t) {
  return t.split("-")[1];
}
function Kr(t) {
  return t === "x" ? "y" : "x";
}
function Jr(t) {
  return t === "y" ? "height" : "width";
}
function mt(t) {
  return ["top", "bottom"].includes(bt(t)) ? "y" : "x";
}
function Xr(t) {
  return Kr(mt(t));
}
function Ll(t, e, i) {
  i === void 0 && (i = !1);
  const n = Oe(t), r = Xr(t), s = Jr(r);
  let o = r === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = ge(o)), [o, ge(o)];
}
function Dl(t) {
  const e = ge(t);
  return [ui(t), e, ui(e)];
}
function ui(t) {
  return t.replace(/start|end/g, (e) => Rl[e]);
}
function Ml(t, e, i) {
  const n = ["left", "right"], r = ["right", "left"], s = ["top", "bottom"], o = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return i ? e ? r : n : e ? n : r;
    case "left":
    case "right":
      return e ? s : o;
    default:
      return [];
  }
}
function Pl(t, e, i, n) {
  const r = Oe(t);
  let s = Ml(bt(t), i === "start", n);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(ui)))), s;
}
function ge(t) {
  return t.replace(/left|right|bottom|top/g, (e) => kl[e]);
}
function zl(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Fl(t) {
  return typeof t != "number" ? zl(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function ve(t) {
  const {
    x: e,
    y: i,
    width: n,
    height: r
  } = t;
  return {
    width: n,
    height: r,
    top: i,
    left: e,
    right: e + n,
    bottom: i + r,
    x: e,
    y: i
  };
}
function fn(t, e, i) {
  let {
    reference: n,
    floating: r
  } = t;
  const s = mt(e), o = Xr(e), a = Jr(o), l = bt(e), c = s === "y", u = n.x + n.width / 2 - r.width / 2, d = n.y + n.height / 2 - r.height / 2, f = n[a] / 2 - r[a] / 2;
  let v;
  switch (l) {
    case "top":
      v = {
        x: u,
        y: n.y - r.height
      };
      break;
    case "bottom":
      v = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      v = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      v = {
        x: n.x - r.width,
        y: d
      };
      break;
    default:
      v = {
        x: n.x,
        y: n.y
      };
  }
  switch (Oe(e)) {
    case "start":
      v[o] -= f * (i && c ? -1 : 1);
      break;
    case "end":
      v[o] += f * (i && c ? -1 : 1);
      break;
  }
  return v;
}
const Bl = async (t, e, i) => {
  const {
    placement: n = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = i, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: r
  }), {
    x: u,
    y: d
  } = fn(c, n, l), f = n, v = {}, x = 0;
  for (let w = 0; w < a.length; w++) {
    const {
      name: p,
      fn: g
    } = a[w], {
      x: h,
      y,
      data: E,
      reset: _
    } = await g({
      x: u,
      y: d,
      initialPlacement: n,
      placement: f,
      strategy: r,
      middlewareData: v,
      rects: c,
      platform: o,
      elements: {
        reference: t,
        floating: e
      }
    });
    u = h ?? u, d = y ?? d, v = {
      ...v,
      [p]: {
        ...v[p],
        ...E
      }
    }, _ && x <= 50 && (x++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (c = _.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : _.rects), {
      x: u,
      y: d
    } = fn(c, f, l)), w = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: v
  };
};
async function Gr(t, e) {
  var i;
  e === void 0 && (e = {});
  const {
    x: n,
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
    padding: v = 0
  } = Ae(e, t), x = Fl(v), p = a[f ? d === "floating" ? "reference" : "floating" : d], g = ve(await s.getClippingRect({
    element: (i = await (s.isElement == null ? void 0 : s.isElement(p))) == null || i ? p : p.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), h = d === "floating" ? {
    x: n,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), E = await (s.isElement == null ? void 0 : s.isElement(y)) ? await (s.getScale == null ? void 0 : s.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = ve(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: y,
    strategy: l
  }) : h);
  return {
    top: (g.top - _.top + x.top) / E.y,
    bottom: (_.bottom - g.bottom + x.bottom) / E.y,
    left: (g.left - _.left + x.left) / E.x,
    right: (_.right - g.right + x.right) / E.x
  };
}
const Hl = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var i, n;
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
        fallbackStrategy: v = "bestFit",
        fallbackAxisSideDirection: x = "none",
        flipAlignment: w = !0,
        ...p
      } = Ae(t, e);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const g = bt(r), h = mt(a), y = bt(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = f || (y || !w ? [ge(a)] : Dl(a)), m = x !== "none";
      !f && m && _.push(...Pl(a, w, x, E));
      const b = [a, ..._], I = await Gr(e, p), S = [];
      let C = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && S.push(I[g]), d) {
        const P = Ll(r, o, E);
        S.push(I[P[0]], I[P[1]]);
      }
      if (C = [...C, {
        placement: r,
        overflows: S
      }], !S.every((P) => P <= 0)) {
        var T, R;
        const P = (((T = s.flip) == null ? void 0 : T.index) || 0) + 1, at = b[P];
        if (at) {
          var L;
          const z = d === "alignment" ? h !== mt(at) : !1, Y = ((L = C[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!z || Y)
            return {
              data: {
                index: P,
                overflows: C
              },
              reset: {
                placement: at
              }
            };
        }
        let B = (R = C.filter((z) => z.overflows[0] <= 0).sort((z, Y) => z.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!B)
          switch (v) {
            case "bestFit": {
              var V;
              const z = (V = C.filter((Y) => {
                if (m) {
                  const Q = mt(Y.placement);
                  return Q === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Q === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((Q) => Q > 0).reduce((Q, as) => Q + as, 0)]).sort((Y, Q) => Y[1] - Q[1])[0]) == null ? void 0 : V[0];
              z && (B = z);
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
async function Wl(t, e) {
  const {
    placement: i,
    platform: n,
    elements: r
  } = t, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), o = bt(i), a = Oe(i), l = mt(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Ae(e, t);
  let {
    mainAxis: f,
    crossAxis: v,
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
  return a && typeof x == "number" && (v = a === "end" ? x * -1 : x), l ? {
    x: v * u,
    y: f * c
  } : {
    x: f * c,
    y: v * u
  };
}
const jl = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var i, n;
      const {
        x: r,
        y: s,
        placement: o,
        middlewareData: a
      } = e, l = await Wl(e, t);
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
}, Ul = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: i,
        y: n,
        placement: r
      } = e, {
        mainAxis: s = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (p) => {
            let {
              x: g,
              y: h
            } = p;
            return {
              x: g,
              y: h
            };
          }
        },
        ...l
      } = Ae(t, e), c = {
        x: i,
        y: n
      }, u = await Gr(e, l), d = mt(bt(r)), f = Kr(d);
      let v = c[f], x = c[d];
      if (s) {
        const p = f === "y" ? "top" : "left", g = f === "y" ? "bottom" : "right", h = v + u[p], y = v - u[g];
        v = dn(h, v, y);
      }
      if (o) {
        const p = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", h = x + u[p], y = x - u[g];
        x = dn(h, x, y);
      }
      const w = a.fn({
        ...e,
        [f]: v,
        [d]: x
      });
      return {
        ...w,
        data: {
          x: w.x - i,
          y: w.y - n,
          enabled: {
            [f]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Ne() {
  return typeof window < "u";
}
function Ot(t) {
  return Zr(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function M(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Z(t) {
  var e;
  return (e = (Zr(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Zr(t) {
  return Ne() ? t instanceof Node || t instanceof M(t).Node : !1;
}
function W(t) {
  return Ne() ? t instanceof Element || t instanceof M(t).Element : !1;
}
function J(t) {
  return Ne() ? t instanceof HTMLElement || t instanceof M(t).HTMLElement : !1;
}
function hn(t) {
  return !Ne() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof M(t).ShadowRoot;
}
function Jt(t) {
  const {
    overflow: e,
    overflowX: i,
    overflowY: n,
    display: r
  } = j(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + n + i) && !["inline", "contents"].includes(r);
}
function Vl(t) {
  return ["table", "td", "th"].includes(Ot(t));
}
function ke(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function Ri(t) {
  const e = Li(), i = W(t) ? j(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !e && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !e && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function Yl(t) {
  let e = st(t);
  for (; J(e) && !It(e); ) {
    if (Ri(e))
      return e;
    if (ke(e))
      return null;
    e = st(e);
  }
  return null;
}
function Li() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function It(t) {
  return ["html", "body", "#document"].includes(Ot(t));
}
function j(t) {
  return M(t).getComputedStyle(t);
}
function Re(t) {
  return W(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function st(t) {
  if (Ot(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    hn(t) && t.host || // Fallback.
    Z(t)
  );
  return hn(e) ? e.host : e;
}
function Qr(t) {
  const e = st(t);
  return It(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : J(e) && Jt(e) ? e : Qr(e);
}
function ts(t, e, i) {
  var n;
  e === void 0 && (e = []);
  const r = Qr(t), s = r === ((n = t.ownerDocument) == null ? void 0 : n.body), o = M(r);
  return s ? (di(o), e.concat(o, o.visualViewport || [], Jt(r) ? r : [], [])) : e.concat(r, ts(r, []));
}
function di(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function es(t) {
  const e = j(t);
  let i = parseFloat(e.width) || 0, n = parseFloat(e.height) || 0;
  const r = J(t), s = r ? t.offsetWidth : i, o = r ? t.offsetHeight : n, a = me(i) !== s || me(n) !== o;
  return a && (i = s, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function is(t) {
  return W(t) ? t : t.contextElement;
}
function _t(t) {
  const e = is(t);
  if (!J(e))
    return K(1);
  const i = e.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = es(e);
  let o = (s ? me(i.width) : i.width) / n, a = (s ? me(i.height) : i.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const ql = /* @__PURE__ */ K(0);
function ns(t) {
  const e = M(t);
  return !Li() || !e.visualViewport ? ql : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Kl(t, e, i) {
  return e === void 0 && (e = !1), !i || e && i !== M(t) ? !1 : e;
}
function Vt(t, e, i, n) {
  e === void 0 && (e = !1), i === void 0 && (i = !1);
  const r = t.getBoundingClientRect(), s = is(t);
  let o = K(1);
  e && (n ? W(n) && (o = _t(n)) : o = _t(t));
  const a = Kl(s, i, n) ? ns(s) : K(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), v = n && W(n) ? M(n) : n;
    let x = f, w = di(x);
    for (; w && n && v !== x; ) {
      const p = _t(w), g = w.getBoundingClientRect(), h = j(w), y = g.left + (w.clientLeft + parseFloat(h.paddingLeft)) * p.x, E = g.top + (w.clientTop + parseFloat(h.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += y, c += E, x = M(w), w = di(x);
    }
  }
  return ve({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Di(t, e) {
  const i = Re(t).scrollLeft;
  return e ? e.left + i : Vt(Z(t)).left + i;
}
function rs(t, e, i) {
  i === void 0 && (i = !1);
  const n = t.getBoundingClientRect(), r = n.left + e.scrollLeft - (i ? 0 : (
    // RTL <body> scrollbar.
    Di(t, n)
  )), s = n.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Jl(t) {
  let {
    elements: e,
    rect: i,
    offsetParent: n,
    strategy: r
  } = t;
  const s = r === "fixed", o = Z(n), a = e ? ke(e.floating) : !1;
  if (n === o || a && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), d = J(n);
  if ((d || !d && !s) && ((Ot(n) !== "body" || Jt(o)) && (l = Re(n)), J(n))) {
    const v = Vt(n);
    c = _t(n), u.x = v.x + n.clientLeft, u.y = v.y + n.clientTop;
  }
  const f = o && !d && !s ? rs(o, l, !0) : K(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Xl(t) {
  return Array.from(t.getClientRects());
}
function Gl(t) {
  const e = Z(t), i = Re(t), n = t.ownerDocument.body, r = wt(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), s = wt(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Di(t);
  const a = -i.scrollTop;
  return j(n).direction === "rtl" && (o += wt(e.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function Zl(t, e) {
  const i = M(t), n = Z(t), r = i.visualViewport;
  let s = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Li();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Ql(t, e) {
  const i = Vt(t, !0, e === "fixed"), n = i.top + t.clientTop, r = i.left + t.clientLeft, s = J(t) ? _t(t) : K(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = n * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function pn(t, e, i) {
  let n;
  if (e === "viewport")
    n = Zl(t, i);
  else if (e === "document")
    n = Gl(Z(t));
  else if (W(e))
    n = Ql(e, i);
  else {
    const r = ns(t);
    n = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return ve(n);
}
function ss(t, e) {
  const i = st(t);
  return i === e || !W(i) || It(i) ? !1 : j(i).position === "fixed" || ss(i, e);
}
function tc(t, e) {
  const i = e.get(t);
  if (i)
    return i;
  let n = ts(t, []).filter((a) => W(a) && Ot(a) !== "body"), r = null;
  const s = j(t).position === "fixed";
  let o = s ? st(t) : t;
  for (; W(o) && !It(o); ) {
    const a = j(o), l = Ri(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Jt(o) && !l && ss(t, o)) ? n = n.filter((u) => u !== o) : r = a, o = st(o);
  }
  return e.set(t, n), n;
}
function ec(t) {
  let {
    element: e,
    boundary: i,
    rootBoundary: n,
    strategy: r
  } = t;
  const o = [...i === "clippingAncestors" ? ke(e) ? [] : tc(e, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = pn(e, u, r);
    return c.top = wt(d.top, c.top), c.right = ci(d.right, c.right), c.bottom = ci(d.bottom, c.bottom), c.left = wt(d.left, c.left), c;
  }, pn(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function ic(t) {
  const {
    width: e,
    height: i
  } = es(t);
  return {
    width: e,
    height: i
  };
}
function nc(t, e, i) {
  const n = J(e), r = Z(e), s = i === "fixed", o = Vt(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = Di(r);
  }
  if (n || !n && !s)
    if ((Ot(e) !== "body" || Jt(r)) && (a = Re(e)), n) {
      const v = Vt(e, !0, s, e);
      l.x = v.x + e.clientLeft, l.y = v.y + e.clientTop;
    } else r && c();
  s && !n && r && c();
  const u = r && !n && !s ? rs(r, a) : K(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Be(t) {
  return j(t).position === "static";
}
function mn(t, e) {
  if (!J(t) || j(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let i = t.offsetParent;
  return Z(t) === i && (i = i.ownerDocument.body), i;
}
function os(t, e) {
  const i = M(t);
  if (ke(t))
    return i;
  if (!J(t)) {
    let r = st(t);
    for (; r && !It(r); ) {
      if (W(r) && !Be(r))
        return r;
      r = st(r);
    }
    return i;
  }
  let n = mn(t, e);
  for (; n && Vl(n) && Be(n); )
    n = mn(n, e);
  return n && It(n) && Be(n) && !Ri(n) ? i : n || Yl(t) || i;
}
const rc = async function(t) {
  const e = this.getOffsetParent || os, i = this.getDimensions, n = await i(t.floating);
  return {
    reference: nc(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function sc(t) {
  return j(t).direction === "rtl";
}
const oc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Jl,
  getDocumentElement: Z,
  getClippingRect: ec,
  getOffsetParent: os,
  getElementRects: rc,
  getClientRects: Xl,
  getDimensions: ic,
  getScale: _t,
  isElement: W,
  isRTL: sc
}, be = jl, ye = Ul, we = Hl, _e = (t, e, i) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: oc,
    ...i
  }, s = {
    ...r.platform,
    _c: n
  };
  return Bl(t, e, {
    ...r,
    platform: s
  });
};
function ac(t) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), _e(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [be(this.pixelOffset), we(), ye({ padding: 8 })]
      }).then(({ x: e, y: i }) => {
        Object.assign(this.contentEl.style, { left: `${e}px`, top: `${i}px` });
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
      const i = this.menuItems.indexOf(e);
      i !== -1 && (this.focusedIndex = i, e.focus());
    },
    handleItemClick(e) {
      const i = e.currentTarget;
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      if (i.getAttribute("aria-haspopup") === "menu") {
        t.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = !1;
      let n = this;
      this.$nextTick(() => n.triggerEl?.focus());
    },
    handleItemMouseEnter(e) {
      const i = e.currentTarget;
      this.focusSelectedItem(i), i.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
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
      this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]').forEach((i) => {
        t.$data(i)?.closeSubmenu();
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
        const i = document.getElementById(e);
        i && (this.parentDropdown = t.$data(i));
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
    updatePosition(e) {
      !this.triggerEl || !e || _e(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [be(this.pixelOffset), we(), ye({ padding: 8 })]
      }).then(({ x: i, y: n }) => {
        Object.assign(e.style, { left: `${i}px`, top: `${n}px` });
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
      e && Array.from(e).some((n) => t.$data(n)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(e = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, e && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((i) => {
        t.$data(i)?.closeSubmenu();
      }), this.open = !1;
    },
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (i) => i.hasAttribute("x-data") && i.getAttribute("x-data").startsWith("rzDropdownSubmenu") && i.id !== this.selfId
      ).forEach((i) => {
        t.$data(i)?.closeSubmenu();
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
      const i = e.currentTarget;
      if (!(i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled"))) {
        if (i.getAttribute("aria-haspopup") === "menu") {
          t.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.parentDropdown.open = !1, this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(e) {
      const i = e.currentTarget;
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      const n = this.menuItems.indexOf(i);
      n !== -1 && (this.focusedIndex = n, i.focus()), i.getAttribute("aria-haspopup") === "menu" ? t.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
    },
    handleSubmenuEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleSubmenuArrowLeft() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function lc(t) {
  t.data("rzDarkModeToggle", () => ({
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
function cc(t) {
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
        const n = this.iframe;
        this.onDarkModeToggle = (r) => {
          n.contentWindow.postMessage(r.detail, "*");
        }, window.addEventListener("darkModeToggle", this.onDarkModeToggle);
      } catch {
        console.error("Cannot access iframe content");
      }
    },
    // Adjusts the iframe height based on its content
    resizeIframe(e) {
      if (e)
        try {
          const i = e.contentDocument || e.contentWindow?.document;
          if (i) {
            const n = i.body;
            if (!n)
              setInterval(() => {
                this.resizeIframe(e);
              }, 150);
            else {
              const r = n.scrollHeight + 15;
              e.style.height = r + "px";
            }
          }
        } catch (i) {
          console.error("Error resizing iframe:", i);
        }
    },
    // Debounce helper to limit function calls
    debounce(e, i = 300) {
      let n;
      return (...r) => {
        clearTimeout(n), n = setTimeout(() => {
          e.apply(this, r);
        }, i);
      };
    },
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function uc(t) {
  t.data("rzEmpty", () => {
  });
}
function dc(t) {
  t.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    init() {
      this.headingId = this.$el.dataset.alpineRoot;
      const e = this;
      if (typeof this.setCurrentHeading == "function") {
        const i = (r, s) => {
          r.forEach((o) => {
            o.isIntersecting && e.setCurrentHeading(e.headingId);
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
function fc(t) {
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
function hc(t) {
  t.data("rzInputGroupAddon", () => ({
    handleClick(e) {
      if (e.target.closest("button"))
        return;
      const i = this.$el.parentElement;
      i && i.querySelector("input, textarea")?.focus();
    }
  }));
}
function pc(t, e) {
  t.data("rzMarkdown", () => ({
    init() {
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.nonce;
      e(i, {
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
function mc(t, e) {
  t.data("rzNavigationMenu", () => ({
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
      !o || !a || (_e(o, a, {
        placement: "bottom-start",
        middleware: [be(6), we(), ye({ padding: 8 })]
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
function gc(t) {
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
      const e = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(be({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: r
      })), o && c.push(we()), a && c.push(ye({ padding: l })), _e(this.triggerEl, this.contentEl, {
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
function vc(t) {
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
      const e = this.prependContainer, i = this.textInput;
      if (!e || !i) {
        i && i.classList.remove("text-transparent");
        return;
      }
      const r = e.offsetWidth + 10;
      i.style.paddingLeft = r + "px", i.classList.remove("text-transparent");
    }
  }));
}
function bc(t) {
  t.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const e = this.$el;
      this.currentVal = parseInt(e.getAttribute("data-current-val")) || 0, this.minVal = parseInt(e.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(e.getAttribute("data-max-val")) || 100, this.label = e.getAttribute("data-label"), this.calculatePercentage(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuemin", this.minVal), e.setAttribute("aria-valuemax", this.maxVal), e.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((n) => {
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
      const e = this.$refs.progressBar, i = this.$refs.progressBarLabel, n = this.$refs.innerLabel;
      i && e && n && (n.innerText = this.buildLabel(), i.clientWidth > e.clientWidth ? i.style.left = e.clientWidth + 10 + "px" : i.style.left = e.clientWidth / 2 - i.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const e = this.$refs.progressBarLabel, i = this.$refs.progressBar;
      return e && i && e.clientWidth > i.clientWidth ? "text-foreground dark:text-foreground" : "";
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
function yc(t) {
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
function wc(t) {
  t.data("rzScrollArea", () => ({
    hideTimer: null,
    type: "hover",
    orientation: "vertical",
    scrollHideDelay: 600,
    _roViewport: null,
    _roContent: null,
    _dragAxis: null,
    _dragPointerOffset: 0,
    _viewport: null,
    init() {
      this.type = this.$el.dataset.type || "hover", this.orientation = this.$el.dataset.orientation || "vertical", this.scrollHideDelay = Number(this.$el.dataset.scrollHideDelay || 600);
      const e = this.$refs.viewport;
      if (!e) return;
      this._viewport = e, this.onScroll = this.onScroll.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), e.addEventListener("scroll", this.onScroll, { passive: !0 });
      const i = () => this.update();
      this._roViewport = new ResizeObserver(i), this._roContent = new ResizeObserver(i), this._roViewport.observe(e), this.$refs.content && this._roContent.observe(this.$refs.content), this.setState(this.type === "always" ? "visible" : "hidden"), this.update();
    },
    destroy() {
      this._viewport && this._viewport.removeEventListener("scroll", this.onScroll), window.removeEventListener("pointermove", this.onPointerMove), window.removeEventListener("pointerup", this.onPointerUp), this._roViewport?.disconnect(), this._roContent?.disconnect(), this.hideTimer && window.clearTimeout(this.hideTimer);
    },
    setState(e) {
      this.$refs.scrollbarX && (this.$refs.scrollbarX.dataset.state = e), this.$refs.scrollbarY && (this.$refs.scrollbarY.dataset.state = e);
    },
    setBarMounted(e, i) {
      const n = this.$refs[`scrollbar${e === "vertical" ? "Y" : "X"}`];
      n && (n.hidden = !i);
    },
    update() {
      const e = this.$refs.viewport;
      if (!e) return;
      this._viewport = e;
      const i = e.scrollWidth > e.clientWidth, n = e.scrollHeight > e.clientHeight;
      this.setBarMounted("horizontal", i), this.setBarMounted("vertical", n), this.updateThumbSizes(), this.updateThumbPositions(), this.updateCorner(), this.type === "always" && this.setState("visible"), this.type === "auto" && this.setState(i || n ? "visible" : "hidden");
    },
    updateThumbSizes() {
      const e = this.$refs.viewport;
      if (e) {
        if (this._viewport = e, this.$refs.thumbY && this.$refs.scrollbarY && e.scrollHeight > 0) {
          const i = e.clientHeight / e.scrollHeight, n = Math.max(this.$refs.scrollbarY.clientHeight * i, 18);
          this.$refs.thumbY.style.height = `${n}px`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && e.scrollWidth > 0) {
          const i = e.clientWidth / e.scrollWidth, n = Math.max(this.$refs.scrollbarX.clientWidth * i, 18);
          this.$refs.thumbX.style.width = `${n}px`;
        }
      }
    },
    updateThumbPositions() {
      const e = this.$refs.viewport;
      if (e) {
        if (this._viewport = e, this.$refs.thumbY && this.$refs.scrollbarY && e.scrollHeight > e.clientHeight) {
          const i = e.scrollHeight - e.clientHeight, n = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, r = e.scrollTop / i * Math.max(n, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${r}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && e.scrollWidth > e.clientWidth) {
          const i = e.scrollWidth - e.clientWidth, n = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, r = e.scrollLeft / i * Math.max(n, 0);
          this.$refs.thumbX.style.transform = `translate3d(${r}px, 0, 0)`;
        }
      }
    },
    updateCorner() {
      if (!this.$refs.corner) return;
      !this.$refs.scrollbarX?.hidden && !this.$refs.scrollbarY?.hidden ? (this.$refs.corner.hidden = !1, this.$refs.corner.style.width = `${this.$refs.scrollbarY?.offsetWidth || 0}px`, this.$refs.corner.style.height = `${this.$refs.scrollbarX?.offsetHeight || 0}px`) : this.$refs.corner.hidden = !0;
    },
    onScroll() {
      this.updateThumbPositions(), this.type === "scroll" && (this.setState("visible"), this.hideTimer && window.clearTimeout(this.hideTimer), this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay));
    },
    onPointerEnter() {
      this.type === "hover" && (this.hideTimer && window.clearTimeout(this.hideTimer), this.setState("visible"));
    },
    onPointerLeave() {
      this.type === "hover" && (this.hideTimer && window.clearTimeout(this.hideTimer), this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay));
    },
    onTrackPointerDown(e) {
      const i = e.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || n.hidden || e.target === this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`]) return;
      const r = this.$refs.viewport, s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!r || !s) return;
      const o = n.getBoundingClientRect();
      if (i === "vertical") {
        const a = e.clientY - o.top - s.offsetHeight / 2, l = n.clientHeight - s.offsetHeight, c = r.scrollHeight - r.clientHeight;
        r.scrollTop = a / Math.max(l, 1) * c;
      } else {
        const a = e.clientX - o.left - s.offsetWidth / 2, l = n.clientWidth - s.offsetWidth, c = r.scrollWidth - r.clientWidth;
        r.scrollLeft = a / Math.max(l, 1) * c;
      }
    },
    onThumbPointerDown(e) {
      const i = e.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`], r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || !r || r.hidden) return;
      const s = n.getBoundingClientRect();
      this._dragAxis = i, this._dragPointerOffset = i === "vertical" ? e.clientY - s.top : e.clientX - s.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    onPointerMove(e) {
      const i = this._dragAxis, n = this.$refs.viewport, r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`], s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!i || !n || !r || !s || r.hidden) return;
      const o = r.getBoundingClientRect();
      if (i === "vertical") {
        const a = e.clientY - o.top, l = r.clientHeight - s.offsetHeight, c = n.scrollHeight - n.clientHeight;
        n.scrollTop = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
      } else {
        const a = e.clientX - o.left, l = r.clientWidth - s.offsetWidth, c = n.scrollWidth - n.clientWidth;
        n.scrollLeft = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
      }
    },
    onPointerUp() {
      this._dragAxis = null, window.removeEventListener("pointermove", this.onPointerMove);
    }
  }));
}
function _c(t) {
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
function xc(t) {
  t.data("rzTabs", () => ({
    selectedTab: "",
    _triggers: [],
    _observer: null,
    init() {
      const e = this.$el.dataset.defaultValue;
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), e && this._triggers.some((i) => i.dataset.value === e) ? this.selectedTab = e : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
    },
    destroy() {
      this._observer && this._observer.disconnect();
    },
    refreshTriggers() {
      this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
    },
    onTriggerClick(e) {
      const i = e.currentTarget?.dataset?.value;
      !i || e.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = i, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
    },
    isSelected(e) {
      return this.selectedTab === e;
    },
    bindTrigger() {
      this.selectedTab;
      const e = this.$el.dataset.value, i = this.isSelected(e), n = this.$el.getAttribute("aria-disabled") === "true";
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
    onListKeydown(e) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        const i = this._triggers.filter((l) => l.getAttribute("aria-disabled") !== "true");
        if (i.length === 0) return;
        const n = i.findIndex((l) => l.dataset.value === this.selectedTab);
        if (n === -1) return;
        const r = e.currentTarget?.getAttribute("aria-orientation") === "vertical", s = r ? "ArrowUp" : "ArrowLeft", o = r ? "ArrowDown" : "ArrowRight";
        let a = n;
        switch (e.key) {
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
function Ec(t) {
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
      const e = this.cookieName ? document.cookie.split("; ").find((n) => n.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, i = this.$el.dataset.defaultOpen === "true";
      this.open = e !== null ? e === "true" : i, this.checkIfMobile(), window.addEventListener("keydown", (n) => {
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
function Ic(t) {
  t.data("rzCommand", () => ({
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
      const e = this.$el.dataset.itemsId;
      let i = [];
      if (e) {
        const n = document.getElementById(e);
        if (n)
          try {
            i = JSON.parse(n.textContent || "[]");
          } catch (r) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${e}`, r);
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
    async fetchItems(e = "") {
      if (this.itemsUrl) {
        if (!this.dataItemTemplateId) {
          console.error("RzCommand: `ItemsUrl` was provided, but no `<CommandItemTemplate>` was found to render the data."), this.error = "Configuration error: No data template found.";
          return;
        }
        this.isLoading = !0, this.error = null;
        try {
          const i = new URL(this.itemsUrl, window.location.origin);
          this.serverFiltering && e && i.searchParams.append("q", e);
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
    registerItem(e) {
      this.items.some((i) => i.id === e.id) || (e._order = this.items.length, this.items.push(e), this.selectedIndex === -1 && (this.selectedIndex = 0), this.serverFiltering || this.filterAndSortItems());
    },
    unregisterItem(e) {
      this.items = this.items.filter((i) => i.id !== e), this.filterAndSortItems();
    },
    registerGroupTemplate(e, i) {
      this.groupTemplates.has(e) || this.groupTemplates.set(e, i);
    },
    filterAndSortItems() {
      if (this.serverFiltering && this._dataFetched) {
        this.filteredItems = this.items, this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
        return;
      }
      let e;
      if (!this.shouldFilter || !this.search ? e = this.items.map((i) => ({ ...i, score: 1 })) : e = this.items.map((i) => ({
        ...i,
        score: i.forceMount ? 0 : this.commandScore(i.name, this.search, i.keywords)
      })).filter((i) => i.score > 0 || i.forceMount).sort((i, n) => i.forceMount && !n.forceMount ? 1 : !i.forceMount && n.forceMount ? -1 : n.score !== i.score ? n.score - i.score : (i._order || 0) - (n._order || 0)), this.filteredItems = e, this.selectedValue) {
        const i = this.filteredItems.findIndex((n) => n.value === this.selectedValue);
        this.selectedIndex = i > -1 ? i : this.filteredItems.length > 0 ? 0 : -1;
      } else
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
    },
    // --- EVENT HANDLERS ---
    handleItemClick(e) {
      const i = e.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === n);
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && (this.selectedIndex = r, this.$dispatch("rz:command:execute", { value: s.value }));
      }
    },
    handleItemHover(e) {
      const i = e.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === n);
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && this.selectedIndex !== r && (this.selectedIndex = r);
      }
    },
    // --- KEYBOARD NAVIGATION ---
    handleKeydown(e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault(), this.selectNext();
          break;
        case "ArrowUp":
          e.preventDefault(), this.selectPrev();
          break;
        case "Home":
          e.preventDefault(), this.selectFirst();
          break;
        case "End":
          e.preventDefault(), this.selectLast();
          break;
        case "Enter":
          e.preventDefault();
          const i = this.filteredItems[this.selectedIndex];
          i && !i.disabled && this.$dispatch("rz:command:execute", { value: i.value });
          break;
      }
    },
    selectNext() {
      if (this.filteredItems.length === 0) return;
      let e = this.selectedIndex, i = 0;
      do {
        if (e = e + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : e + 1, i++, !this.filteredItems[e]?.disabled) {
          this.selectedIndex = e;
          return;
        }
        if (!this.loop && e === this.filteredItems.length - 1) return;
      } while (i <= this.filteredItems.length);
    },
    selectPrev() {
      if (this.filteredItems.length === 0) return;
      let e = this.selectedIndex, i = 0;
      do {
        if (e = e - 1 < 0 ? this.loop ? this.filteredItems.length - 1 : 0 : e - 1, i++, !this.filteredItems[e]?.disabled) {
          this.selectedIndex = e;
          return;
        }
        if (!this.loop && e === 0) return;
      } while (i <= this.filteredItems.length);
    },
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const e = this.filteredItems.findIndex((i) => !i.disabled);
        e > -1 && (this.selectedIndex = e);
      }
    },
    selectLast() {
      if (this.filteredItems.length > 0) {
        const e = this.filteredItems.map((i) => i.disabled).lastIndexOf(!1);
        e > -1 && (this.selectedIndex = e);
      }
    },
    // --- SCORING ALGORITHM (Adapted from cmdk) ---
    commandScore(e, i, n = []) {
      const d = /[\\/_+.#"@[\(\{&]/, f = /[\s-]/, v = `${e} ${n ? n.join(" ") : ""}`;
      function x(p) {
        return p.toLowerCase().replace(/[\s-]/g, " ");
      }
      function w(p, g, h, y, E, _, m) {
        if (_ === g.length)
          return E === p.length ? 1 : 0.99;
        const b = `${E},${_}`;
        if (m[b] !== void 0) return m[b];
        const I = y.charAt(_);
        let S = h.indexOf(I, E), C = 0;
        for (; S >= 0; ) {
          let T = w(p, g, h, y, S + 1, _ + 1, m);
          T > C && (S === E ? T *= 1 : d.test(p.charAt(S - 1)) ? T *= 0.8 : f.test(p.charAt(S - 1)) ? T *= 0.9 : (T *= 0.17, E > 0 && (T *= Math.pow(0.999, S - E))), p.charAt(S) !== g.charAt(_) && (T *= 0.9999)), T > C && (C = T), S = h.indexOf(I, S + 1);
        }
        return m[b] = C, C;
      }
      return w(v, i, x(v), x(i), 0, 0, {});
    }
  }));
}
function Sc(t) {
  t.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    init() {
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandItem must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e), this.itemData = {
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
function Cc(t) {
  t.data("rzCommandList", () => ({
    parent: null,
    dataItemTemplate: null,
    init() {
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandList must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e), this.parent.dataItemTemplateId && (this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId));
    },
    renderList(e) {
      if (e.detail.commandId !== this.parent.$el.id) return;
      const i = e.detail.items || [], n = e.detail.groups || /* @__PURE__ */ new Map(), r = this.$el;
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
            d = this.dataItemTemplate.content.cloneNode(!0).firstElementChild, t.addScopeToNode(d, { item: c });
          } else {
            const f = document.getElementById(c.templateId);
            f && f.content && (d = f.content.cloneNode(!0).querySelector(`[data-command-item-id="${c.id}"]`));
          }
          d && (d.setAttribute("data-command-item-id", c.id), d.setAttribute("data-value", c.value), c.keywords && d.setAttribute("data-keywords", JSON.stringify(c.keywords)), c.group && d.setAttribute("data-group", c.group), c.disabled && d.setAttribute("data-disabled", "true"), c.forceMount && d.setAttribute("data-force-mount", "true"), d.setAttribute("role", "option"), d.setAttribute("aria-selected", this.parent.selectedIndex === u), c.disabled && d.setAttribute("aria-disabled", "true"), this.parent.selectedIndex === u && d.setAttribute("data-selected", "true"), l.appendChild(d), t.initTree(d));
        }), r.appendChild(l);
      });
    }
  }));
}
function Tc(t) {
  t.data("rzCommandGroup", () => ({
    parent: null,
    heading: "",
    templateId: "",
    init() {
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandGroup must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e), this.heading = this.$el.dataset.heading, this.templateId = this.$el.dataset.templateId, this.heading && this.templateId && this.parent.registerGroupTemplate(this.heading, this.templateId);
    }
  }));
}
async function $c(t) {
  t = [...t].sort();
  const e = t.join("|"), n = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ct(t, e, i) {
  let n, r;
  typeof e == "function" ? n = { success: e } : e && typeof e == "object" ? n = e : typeof e == "string" && (r = e), !r && typeof i == "string" && (r = i);
  const s = Array.isArray(t) ? t : [t];
  return $c(s).then((o) => (it.isDefined(o) || it(s, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: r,
    inlineStyleNonce: r
  }), new Promise((a, l) => {
    it.ready(o, {
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
function Ac(t) {
  yl(t), wl(t), _l(t), xl(t), El(t), Il(t, ct), Sl(t), Cl(t, ct), Tl(t, ct), $l(t), Al(t, ct), Ol(t, ct), Nl(t), ac(t), lc(t), cc(t), uc(t), dc(t), fc(t), hc(t), pc(t, ct), mc(t), gc(t), vc(t), bc(t), yc(t), wc(t), _c(t), xc(t), Ec(t), Ic(t), Sc(t), Cc(t), Tc(t);
}
function Oc(t) {
  if (!(t instanceof Element))
    return console.warn("[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el)."), {};
  const e = t.dataset.propsId;
  if (!e)
    return {};
  const i = document.getElementById(e);
  if (!i)
    return console.warn(`[Rizzy.props] Could not find the props script tag with ID '${e}'.`), {};
  try {
    return JSON.parse(i.textContent || "{}");
  } catch (n) {
    return console.error(`[Rizzy.props] Failed to parse JSON from script tag #${e}.`, n), {};
  }
}
const ne = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map();
let gn = !1;
function Nc(t) {
  return re.has(t) || re.set(
    t,
    import(t).catch((e) => {
      throw re.delete(t), e;
    })
  ), re.get(t);
}
function vn(t, e) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    t,
    () => Nc(e).catch((n) => (console.error(
      `[RizzyUI] Failed to load Alpine module '${t}' from '${e}'.`,
      n
    ), () => ({
      _error: !0,
      _errorMessage: `Module '${t}' failed to load.`
    })))
  ), !0) : (console.error(
    `[RizzyUI] Could not register async component '${t}'. AsyncAlpine not available.`
  ), !1);
}
function kc(t, e) {
  if (!t || !e) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = ne.get(t);
  i && i.path !== e && console.warn(
    `[RizzyUI] Re-registering '${t}' with a different path.
  Previous: ${i.path}
  New:      ${e}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const r = !i || i.path !== e;
    if (!(i && i.loaderSet && !r)) {
      const o = vn(t, e);
      ne.set(t, { path: e, loaderSet: o });
    }
    return;
  }
  ne.set(t, { path: e, loaderSet: !1 }), gn || (gn = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of ne)
        if (!s.loaderSet) {
          const o = vn(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Rc(t) {
  t.directive("mobile", (e, { modifiers: i, expression: n }, { cleanup: r }) => {
    const s = i.find((g) => g.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      e.dataset.mobile = "false", e.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (g) => {
      e.dataset.mobile = g ? "true" : "false", e.dataset.screen = g ? "mobile" : "desktop";
    }, u = () => typeof t.$data == "function" ? t.$data(e) : e.__x ? e.__x.$data : null, d = (g) => {
      if (!a) return;
      const h = u();
      h && (h[n] = g);
    }, f = (g) => {
      e.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: g, width: window.innerWidth, breakpoint: o }
        })
      );
    }, v = window.matchMedia(`(max-width: ${o - 1}px)`), x = () => {
      const g = l();
      c(g), d(g), f(g);
    };
    x();
    const w = () => x(), p = () => x();
    v.addEventListener("change", w), window.addEventListener("resize", p, { passive: !0 }), r(() => {
      v.removeEventListener("change", w), window.removeEventListener("resize", p);
    });
  });
}
function Lc(t) {
  const e = (i, { expression: n, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (w, p, g) => {
      const y = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = y.pop();
      let _ = w;
      for (const m of y)
        (_[m] == null || typeof _[m] != "object") && (_[m] = isFinite(+m) ? [] : {}), _ = _[m];
      _[E] = g;
    }, l = t.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = n.split(",").map((w) => w.trim()).filter(Boolean).map((w) => {
      const p = w.split("->").map((g) => g.trim());
      return p.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', w), null) : { parentPath: p[0], childPath: p[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), v = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), x = [];
    d.forEach((w, p) => {
      const g = v[p];
      if (f) {
        const E = t.evaluate(i, w.childPath, { scope: c });
        g.fromChild = !0, a(u, w.parentPath, E), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const E = t.evaluate(i, w.parentPath, { scope: u });
        g.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = t.evaluate(i, w.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), y = o(() => {
        const E = t.evaluate(i, w.childPath, { scope: c });
        if (!g.fromParent) {
          if (g.skipChildOnce) {
            g.skipChildOnce = !1;
            return;
          }
          g.fromChild = !0, a(u, w.parentPath, E), queueMicrotask(() => {
            g.fromChild = !1;
          });
        }
      });
      x.push(h, y);
    }), s(() => {
      for (const w of x)
        try {
          w && w();
        } catch {
        }
    });
  };
  t.directive("syncprop", e);
}
class Dc {
  constructor() {
    this.storageKey = "darkMode", this.eventName = "rz:theme-change", this.darkClass = "dark", this._mode = "auto", this._mq = null, this._initialized = !1, this._onMqChange = null, this._onStorage = null, this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
  }
  init() {
    if (this._initialized || typeof window > "u") return;
    this._initialized = !0, this._mq = typeof window.matchMedia == "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const e = this._safeReadStorage(this.storageKey);
    this._mode = this._normalizeMode(e ?? "auto"), this._sync(), this._onMqChange = () => {
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
    const e = this.effectiveDark;
    this._setMode(e ? "light" : "dark");
  }
  // ----- Internals -----
  _setMode(e) {
    this._mode = this._normalizeMode(e), this._persist(), this._sync();
  }
  _normalizeMode(e) {
    return e === "light" || e === "dark" || e === "auto" ? e : "auto";
  }
  _safeReadStorage(e) {
    try {
      return window?.localStorage?.getItem(e);
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
    const e = this.effectiveDark, i = this._mode, n = this.prefersDark, r = typeof document < "u" ? document.documentElement : null, s = r ? r.classList.contains(this.darkClass) === e && r.style.colorScheme === (e ? "dark" : "light") : !0;
    this._lastSnapshot.mode === i && this._lastSnapshot.effectiveDark === e && this._lastSnapshot.prefersDark === n && s || (this._lastSnapshot = { mode: i, effectiveDark: e, prefersDark: n }, r && (r.classList.toggle(this.darkClass, e), r.style.colorScheme = e ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(this.eventName, {
        detail: {
          mode: i,
          darkMode: e,
          // External API uses 'darkMode' convention
          prefersDark: n,
          source: "RizzyUI"
        }
      })
    ));
  }
}
const D = new Dc();
function Mc(t) {
  D.init(), t.store("theme", {
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
let zt = null;
function Pc(t) {
  return zt || (t.plugin(ya), t.plugin(Ia), t.plugin(Va), t.plugin(tl), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Mc(t);
  }), Ac(t), Rc(t), Lc(t), zt = {
    Alpine: t,
    require: ct,
    toast: hl,
    $data: vl,
    props: Oc,
    registerAsyncComponent: kc,
    theme: D
  }, typeof window < "u" && (D.init(), window.Alpine = t, window.Rizzy = { ...window.Rizzy || {}, ...zt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), zt);
}
const Bc = Pc(Ar);
Ar.start();
export {
  Bc as default
};
