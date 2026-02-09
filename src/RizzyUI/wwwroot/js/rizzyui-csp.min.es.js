var He = !1, We = !1, ft = [], Ve = -1;
function us(t) {
  ds(t);
}
function ds(t) {
  ft.includes(t) || ft.push(t), hs();
}
function fs(t) {
  let e = ft.indexOf(t);
  e !== -1 && e > Ve && ft.splice(e, 1);
}
function hs() {
  !We && !He && (He = !0, queueMicrotask(ps));
}
function ps() {
  He = !1, We = !0;
  for (let t = 0; t < ft.length; t++)
    ft[t](), Ve = t;
  ft.length = 0, Ve = -1, We = !1;
}
var Ct, _t, St, yn, qe = !0;
function ms(t) {
  qe = !1, t(), qe = !0;
}
function gs(t) {
  Ct = t.reactive, St = t.release, _t = (e) => t.effect(e, { scheduler: (i) => {
    qe ? us(i) : i();
  } }), yn = t.raw;
}
function Mi(t) {
  _t = t;
}
function vs(t) {
  let e = () => {
  };
  return [(n) => {
    let r = _t(n);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(r), e = () => {
      r !== void 0 && (t._x_effects.delete(r), St(r));
    }, r;
  }, () => {
    e();
  }];
}
function wn(t, e) {
  let i = !0, n, r = _t(() => {
    let s = t();
    JSON.stringify(s), i ? n = s : queueMicrotask(() => {
      e(s, n), n = s;
    }), i = !1;
  });
  return () => St(r);
}
var _n = [], xn = [], En = [];
function bs(t) {
  En.push(t);
}
function hi(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, xn.push(e));
}
function In(t) {
  _n.push(t);
}
function Tn(t, e, i) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(i);
}
function Cn(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([i, n]) => {
    (e === void 0 || e.includes(i)) && (n.forEach((r) => r()), delete t._x_attributeCleanups[i]);
  });
}
function ys(t) {
  for (t._x_effects?.forEach(fs); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var pi = new MutationObserver(bi), mi = !1;
function gi() {
  pi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), mi = !0;
}
function Sn() {
  ws(), pi.disconnect(), mi = !1;
}
var Rt = [];
function ws() {
  let t = pi.takeRecords();
  Rt.push(() => t.length > 0 && bi(t));
  let e = Rt.length;
  queueMicrotask(() => {
    if (Rt.length === e)
      for (; Rt.length > 0; )
        Rt.shift()();
  });
}
function $(t) {
  if (!mi)
    return t();
  Sn();
  let e = t();
  return gi(), e;
}
var vi = !1, ce = [];
function _s() {
  vi = !0;
}
function xs() {
  vi = !1, bi(ce), ce = [];
}
function bi(t) {
  if (vi) {
    ce = ce.concat(t);
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
    Cn(o, s);
  }), n.forEach((s, o) => {
    _n.forEach((a) => a(o, s));
  });
  for (let s of i)
    e.some((o) => o.contains(s)) || xn.forEach((o) => o(s));
  for (let s of e)
    s.isConnected && En.forEach((o) => o(s));
  e = null, i = null, n = null, r = null;
}
function An(t) {
  return At(vt(t));
}
function Jt(t, e, i) {
  return t._x_dataStack = [e, ...vt(i || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((n) => n !== e);
  };
}
function vt(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? vt(t.host) : t.parentNode ? vt(t.parentNode) : [];
}
function At(t) {
  return new Proxy({ objects: t }, Es);
}
var Es = {
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
    return e == "toJSON" ? Is : Reflect.get(
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
function Is() {
  return Reflect.ownKeys(this).reduce((e, i) => (e[i] = Reflect.get(this, i), e), {});
}
function On(t) {
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
function $n(t, e = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, r, s) {
      return t(this.initialValue, () => Ts(n, r), (o) => Ye(n, r, o), r, s);
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
function Ts(t, e) {
  return e.split(".").reduce((i, n) => i[n], t);
}
function Ye(t, e, i) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = i;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Ye(t[e[0]], e.slice(1), i);
  }
}
var Nn = {};
function V(t, e) {
  Nn[t] = e;
}
function ue(t, e) {
  let i = Cs(e);
  return Object.entries(Nn).forEach(([n, r]) => {
    Object.defineProperty(t, `$${n}`, {
      get() {
        return r(e, i);
      },
      enumerable: !1
    });
  }), t;
}
function Cs(t) {
  let [e, i] = zn(t), n = { interceptor: $n, ...e };
  return hi(t, i), n;
}
function kn(t, e, i, ...n) {
  try {
    return i(...n);
  } catch (r) {
    Vt(r, t, e);
  }
}
function Vt(t, e, i = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: i }
  ), console.warn(`Alpine Expression Error: ${t.message}

${i ? 'Expression: "' + i + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var jt = !0;
function Rn(t) {
  let e = jt;
  jt = !1;
  let i = t();
  return jt = e, i;
}
function ht(t, e, i = {}) {
  let n;
  return R(t, e)((r) => n = r, i), n;
}
function R(...t) {
  return Ln(...t);
}
var Ln = As;
function Ss(t) {
  Ln = t;
}
function As(t, e) {
  let i = {};
  ue(i, t);
  let n = [i, ...vt(t)], r = typeof e == "function" ? Pn(n, e) : $s(n, e, t);
  return kn.bind(null, t, e, r);
}
function Pn(t, e) {
  return (i = () => {
  }, { scope: n = {}, params: r = [], context: s } = {}) => {
    let o = e.apply(At([n, ...t]), r);
    de(i, o);
  };
}
var De = {};
function Os(t, e) {
  if (De[t])
    return De[t];
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
      return Vt(o, e, t), Promise.resolve();
    }
  })();
  return De[t] = s, s;
}
function $s(t, e, i) {
  let n = Os(e, i);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = At([s, ...t]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => Vt(u, i, e));
      n.finished ? (de(r, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        de(r, u, l, o, i);
      }).catch((u) => Vt(u, i, e)).finally(() => n.result = void 0);
    }
  };
}
function de(t, e, i, n, r) {
  if (jt && typeof e == "function") {
    let s = e.apply(i, n);
    s instanceof Promise ? s.then((o) => de(t, o, i, n)).catch((o) => Vt(o, r, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
var yi = "x-";
function Ot(t = "") {
  return yi + t;
}
function Ns(t) {
  yi = t;
}
var fe = {};
function N(t, e) {
  return fe[t] = e, {
    before(i) {
      if (!fe[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const n = dt.indexOf(i);
      dt.splice(n >= 0 ? n : dt.indexOf("DEFAULT"), 0, t);
    }
  };
}
function ks(t) {
  return Object.keys(fe).includes(t);
}
function wi(t, e, i) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Dn(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), e = e.concat(s);
  }
  let n = {};
  return e.map(Bn((s, o) => n[s] = o)).filter(Hn).map(Ps(n, i)).sort(Ds).map((s) => Ls(t, s));
}
function Dn(t) {
  return Array.from(t).map(Bn()).filter((e) => !Hn(e));
}
var Ke = !1, Bt = /* @__PURE__ */ new Map(), Mn = Symbol();
function Rs(t) {
  Ke = !0;
  let e = Symbol();
  Mn = e, Bt.set(e, []);
  let i = () => {
    for (; Bt.get(e).length; )
      Bt.get(e).shift()();
    Bt.delete(e);
  }, n = () => {
    Ke = !1, i();
  };
  t(i), n();
}
function zn(t) {
  let e = [], i = (a) => e.push(a), [n, r] = vs(t);
  return e.push(r), [{
    Alpine: Xt,
    effect: n,
    cleanup: i,
    evaluateLater: R.bind(R, t),
    evaluate: ht.bind(ht, t)
  }, () => e.forEach((a) => a())];
}
function Ls(t, e) {
  let i = () => {
  }, n = fe[e.type] || i, [r, s] = zn(t);
  Tn(t, e.original, s);
  let o = () => {
    t._x_ignore || t._x_ignoreSelf || (n.inline && n.inline(t, e, r), n = n.bind(n, t, e, r), Ke ? Bt.get(Mn).push(n) : n());
  };
  return o.runCleanups = s, o;
}
var Fn = (t, e) => ({ name: i, value: n }) => (i.startsWith(t) && (i = i.replace(t, e)), { name: i, value: n }), Un = (t) => t;
function Bn(t = () => {
}) {
  return ({ name: e, value: i }) => {
    let { name: n, value: r } = jn.reduce((s, o) => o(s), { name: e, value: i });
    return n !== e && t(n, e), { name: n, value: r };
  };
}
var jn = [];
function _i(t) {
  jn.push(t);
}
function Hn({ name: t }) {
  return Wn().test(t);
}
var Wn = () => new RegExp(`^${yi}([^:^.]+)\\b`);
function Ps(t, e) {
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
var Je = "DEFAULT", dt = [
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
  Je,
  "teleport"
];
function Ds(t, e) {
  let i = dt.indexOf(t.type) === -1 ? Je : t.type, n = dt.indexOf(e.type) === -1 ? Je : e.type;
  return dt.indexOf(i) - dt.indexOf(n);
}
function Ht(t, e, i = {}) {
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
function bt(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((r) => bt(r, e));
    return;
  }
  let i = !1;
  if (e(t, () => i = !0), i)
    return;
  let n = t.firstElementChild;
  for (; n; )
    bt(n, e), n = n.nextElementSibling;
}
function U(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var zi = !1;
function Ms() {
  zi && U("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), zi = !0, document.body || U("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Ht(document, "alpine:init"), Ht(document, "alpine:initializing"), gi(), bs((e) => Z(e, bt)), hi((e) => Nt(e)), In((e, i) => {
    wi(e, i).forEach((n) => n());
  });
  let t = (e) => !Ie(e.parentElement, !0);
  Array.from(document.querySelectorAll(Yn().join(","))).filter(t).forEach((e) => {
    Z(e);
  }), Ht(document, "alpine:initialized"), setTimeout(() => {
    Bs();
  });
}
var xi = [], Vn = [];
function qn() {
  return xi.map((t) => t());
}
function Yn() {
  return xi.concat(Vn).map((t) => t());
}
function Kn(t) {
  xi.push(t);
}
function Jn(t) {
  Vn.push(t);
}
function Ie(t, e = !1) {
  return $t(t, (i) => {
    if ((e ? Yn() : qn()).some((r) => i.matches(r)))
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
function zs(t) {
  return qn().some((e) => t.matches(e));
}
var Xn = [];
function Fs(t) {
  Xn.push(t);
}
var Us = 1;
function Z(t, e = bt, i = () => {
}) {
  $t(t, (n) => n._x_ignore) || Rs(() => {
    e(t, (n, r) => {
      n._x_marker || (i(n, r), Xn.forEach((s) => s(n, r)), wi(n, n.attributes).forEach((s) => s()), n._x_ignore || (n._x_marker = Us++), n._x_ignore && r());
    });
  });
}
function Nt(t, e = bt) {
  e(t, (i) => {
    ys(i), Cn(i), delete i._x_marker;
  });
}
function Bs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, i, n]) => {
    ks(i) || n.some((r) => {
      if (document.querySelector(r))
        return U(`found "${r}", but missing ${e} plugin`), !0;
    });
  });
}
var Xe = [], Ei = !1;
function Ii(t = () => {
}) {
  return queueMicrotask(() => {
    Ei || setTimeout(() => {
      Ze();
    });
  }), new Promise((e) => {
    Xe.push(() => {
      t(), e();
    });
  });
}
function Ze() {
  for (Ei = !1; Xe.length; )
    Xe.shift()();
}
function js() {
  Ei = !0;
}
function Ti(t, e) {
  return Array.isArray(e) ? Fi(t, e.join(" ")) : typeof e == "object" && e !== null ? Hs(t, e) : typeof e == "function" ? Ti(t, e()) : Fi(t, e);
}
function Fi(t, e) {
  let i = (r) => r.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), n = (r) => (t.classList.add(...r), () => {
    t.classList.remove(...r);
  });
  return e = e === !0 ? e = "" : e || "", n(i(e));
}
function Hs(t, e) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(e).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function Te(t, e) {
  return typeof e == "object" && e !== null ? Ws(t, e) : Vs(t, e);
}
function Ws(t, e) {
  let i = {};
  return Object.entries(e).forEach(([n, r]) => {
    i[n] = t.style[n], n.startsWith("--") || (n = qs(n)), t.style.setProperty(n, r);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    Te(t, i);
  };
}
function Vs(t, e) {
  let i = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", i || "");
  };
}
function qs(t) {
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
  typeof n == "function" && (n = r(n)), n !== !1 && (!n || typeof n == "boolean" ? Ks(t, i, e) : Ys(t, n, e));
});
function Ys(t, e, i) {
  Zn(t, Ti, ""), {
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
function Ks(t, e, i) {
  Zn(t, Te);
  let n = !e.includes("in") && !e.includes("out") && !i, r = n || e.includes("in") || ["enter"].includes(i), s = n || e.includes("out") || ["leave"].includes(i);
  e.includes("in") && !n && (e = e.filter((b, h) => h < e.indexOf("out"))), e.includes("out") && !n && (e = e.filter((b, h) => h > e.indexOf("out")));
  let o = !e.includes("opacity") && !e.includes("scale"), a = o || e.includes("opacity"), l = o || e.includes("scale"), c = a ? 0 : 1, u = l ? Lt(e, "scale", 95) / 100 : 1, d = Lt(e, "delay", 0) / 1e3, f = Lt(e, "origin", "center"), y = "opacity, transform", m = Lt(e, "duration", 150) / 1e3, v = Lt(e, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (t._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: y,
    transitionDuration: `${m}s`,
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
    transitionProperty: y,
    transitionDuration: `${v}s`,
    transitionTimingFunction: p
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function Zn(t, e, i = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, r = () => {
    }) {
      Qe(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, r);
    },
    out(n = () => {
    }, r = () => {
    }) {
      Qe(t, e, {
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
    let o = Gn(t);
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
function Gn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Gn(e);
}
function Qe(t, e, { during: i, start: n, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Js(t, {
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
function Js(t, e) {
  let i, n, r, s = Ge(() => {
    $(() => {
      i = !0, n || e.before(), r || (e.end(), Ze()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
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
  }, $(() => {
    e.start(), e.during();
  }), js(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), $(() => {
      e.before();
    }), n = !0, requestAnimationFrame(() => {
      i || ($(() => {
        e.end();
      }), Ze(), setTimeout(t._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Lt(t, e, i) {
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
var rt = !1;
function at(t, e = () => {
}) {
  return (...i) => rt ? e(...i) : t(...i);
}
function Xs(t) {
  return (...e) => rt && t(...e);
}
var Qn = [];
function Ce(t) {
  Qn.push(t);
}
function Zs(t, e) {
  Qn.forEach((i) => i(t, e)), rt = !0, tr(() => {
    Z(e, (i, n) => {
      n(i, () => {
      });
    });
  }), rt = !1;
}
var ti = !1;
function Gs(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), rt = !0, ti = !0, tr(() => {
    Qs(e);
  }), rt = !1, ti = !1;
}
function Qs(t) {
  let e = !1;
  Z(t, (n, r) => {
    bt(n, (s, o) => {
      if (e && zs(s))
        return o();
      e = !0, r(s, o);
    });
  });
}
function tr(t) {
  let e = _t;
  Mi((i, n) => {
    let r = e(i);
    return St(r), () => {
    };
  }), t(), Mi(e);
}
function er(t, e, i, n = []) {
  switch (t._x_bindings || (t._x_bindings = Ct({})), t._x_bindings[e] = i, e = n.includes("camel") ? ao(e) : e, e) {
    case "value":
      to(t, i);
      break;
    case "style":
      io(t, i);
      break;
    case "class":
      eo(t, i);
      break;
    case "selected":
    case "checked":
      no(t, e, i);
      break;
    default:
      ir(t, e, i);
      break;
  }
}
function to(t, e) {
  if (sr(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = ae(t.value) === e : t.checked = Ui(t.value, e));
  else if (Ci(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((i) => Ui(i, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    oo(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function eo(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Ti(t, e);
}
function io(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Te(t, e);
}
function no(t, e, i) {
  ir(t, e, i), so(t, e, i);
}
function ir(t, e, i) {
  [null, void 0, !1].includes(i) && co(e) ? t.removeAttribute(e) : (nr(e) && (i = e), ro(t, e, i));
}
function ro(t, e, i) {
  t.getAttribute(e) != i && t.setAttribute(e, i);
}
function so(t, e, i) {
  t[e] !== i && (t[e] = i);
}
function oo(t, e) {
  const i = [].concat(e).map((n) => n + "");
  Array.from(t.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function ao(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function Ui(t, e) {
  return t == e;
}
function ae(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
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
function nr(t) {
  return lo.has(t);
}
function co(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function uo(t, e, i) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : rr(t, e, i);
}
function fo(t, e, i, n = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let r = t._x_inlineBindings[e];
    return r.extract = n, Rn(() => ht(t, r.expression));
  }
  return rr(t, e, i);
}
function rr(t, e, i) {
  let n = t.getAttribute(e);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : nr(e) ? !![e, "true"].includes(n) : n;
}
function Ci(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function sr(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function or(t, e) {
  let i;
  return function() {
    const n = this, r = arguments, s = function() {
      i = null, t.apply(n, r);
    };
    clearTimeout(i), i = setTimeout(s, e);
  };
}
function ar(t, e) {
  let i;
  return function() {
    let n = this, r = arguments;
    i || (t.apply(n, r), i = !0, setTimeout(() => i = !1, e));
  };
}
function lr({ get: t, set: e }, { get: i, set: n }) {
  let r = !0, s, o = _t(() => {
    let a = t(), l = i();
    if (r)
      n(Me(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? n(Me(a)) : c !== u && e(Me(l));
    }
    s = JSON.stringify(t()), JSON.stringify(i());
  });
  return () => {
    St(o);
  };
}
function Me(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function ho(t) {
  (Array.isArray(t) ? t : [t]).forEach((i) => i(Xt));
}
var ct = {}, Bi = !1;
function po(t, e) {
  if (Bi || (ct = Ct(ct), Bi = !0), e === void 0)
    return ct[t];
  ct[t] = e, On(ct[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && ct[t].init();
}
function mo() {
  return ct;
}
var cr = {};
function go(t, e) {
  let i = typeof e != "function" ? () => e : e;
  return t instanceof Element ? ur(t, i()) : (cr[t] = i, () => {
  });
}
function vo(t) {
  return Object.entries(cr).forEach(([e, i]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), t;
}
function ur(t, e, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let r = Object.entries(e).map(([o, a]) => ({ name: o, value: a })), s = Dn(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), wi(t, r, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var dr = {};
function bo(t, e) {
  dr[t] = e;
}
function yo(t, e) {
  return Object.entries(dr).forEach(([i, n]) => {
    Object.defineProperty(t, i, {
      get() {
        return (...r) => n.bind(e)(...r);
      },
      enumerable: !1
    });
  }), t;
}
var wo = {
  get reactive() {
    return Ct;
  },
  get release() {
    return St;
  },
  get effect() {
    return _t;
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
  onAttributeRemoved: Tn,
  onAttributesAdded: In,
  closestDataStack: vt,
  skipDuringClone: at,
  onlyDuringClone: Xs,
  addRootSelector: Kn,
  addInitSelector: Jn,
  interceptClone: Ce,
  addScopeToNode: Jt,
  deferMutations: _s,
  mapAttributes: _i,
  evaluateLater: R,
  interceptInit: Fs,
  setEvaluator: Ss,
  mergeProxies: At,
  extractProp: fo,
  findClosest: $t,
  onElRemoved: hi,
  closestRoot: Ie,
  destroyTree: Nt,
  interceptor: $n,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Qe,
  // INTERNAL
  setStyles: Te,
  // INTERNAL
  mutateDom: $,
  directive: N,
  entangle: lr,
  throttle: ar,
  debounce: or,
  evaluate: ht,
  initTree: Z,
  nextTick: Ii,
  prefixed: Ot,
  prefix: Ns,
  plugin: ho,
  magic: V,
  store: po,
  start: Ms,
  clone: Gs,
  // INTERNAL
  cloneNode: Zs,
  // INTERNAL
  bound: uo,
  $data: An,
  watch: wn,
  walk: bt,
  data: bo,
  bind: go
}, Xt = wo, k = class {
  constructor(t, e, i, n) {
    this.type = t, this.value = e, this.start = i, this.end = n;
  }
}, _o = class {
  constructor(t) {
    this.input = t, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const t = this.input[this.position];
      this.isDigit(t) ? this.readNumber() : this.isAlpha(t) || t === "_" || t === "$" ? this.readIdentifierOrKeyword() : t === '"' || t === "'" ? this.readString() : t === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
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
  isDigit(t) {
    return /[0-9]/.test(t);
  }
  isAlpha(t) {
    return /[a-zA-Z]/.test(t);
  }
  isAlphaNumeric(t) {
    return /[a-zA-Z0-9_$]/.test(t);
  }
  peek(t = 1) {
    return this.input[this.position + t] || "";
  }
  readNumber() {
    const t = this.position;
    let e = !1;
    for (; this.position < this.input.length; ) {
      const n = this.input[this.position];
      if (this.isDigit(n))
        this.position++;
      else if (n === "." && !e)
        e = !0, this.position++;
      else
        break;
    }
    const i = this.input.slice(t, this.position);
    this.tokens.push(new k("NUMBER", parseFloat(i), t, this.position));
  }
  readIdentifierOrKeyword() {
    const t = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const e = this.input.slice(t, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(e) ? e === "true" || e === "false" ? this.tokens.push(new k("BOOLEAN", e === "true", t, this.position)) : e === "null" ? this.tokens.push(new k("NULL", null, t, this.position)) : e === "undefined" ? this.tokens.push(new k("UNDEFINED", void 0, t, this.position)) : this.tokens.push(new k("KEYWORD", e, t, this.position)) : this.tokens.push(new k("IDENTIFIER", e, t, this.position));
  }
  readString() {
    const t = this.position, e = this.input[this.position];
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
          case e:
            i += e;
            break;
          default:
            i += r;
        }
        n = !1;
      } else if (r === "\\")
        n = !0;
      else if (r === e) {
        this.position++, this.tokens.push(new k("STRING", i, t, this.position));
        return;
      } else
        i += r;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${t}`);
  }
  readOperatorOrPunctuation() {
    const t = this.position, e = this.input[this.position], i = this.peek(), n = this.peek(2);
    if (e === "=" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new k("OPERATOR", "===", t, this.position));
    else if (e === "!" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new k("OPERATOR", "!==", t, this.position));
    else if (e === "=" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", "==", t, this.position));
    else if (e === "!" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", "!=", t, this.position));
    else if (e === "<" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", "<=", t, this.position));
    else if (e === ">" && i === "=")
      this.position += 2, this.tokens.push(new k("OPERATOR", ">=", t, this.position));
    else if (e === "&" && i === "&")
      this.position += 2, this.tokens.push(new k("OPERATOR", "&&", t, this.position));
    else if (e === "|" && i === "|")
      this.position += 2, this.tokens.push(new k("OPERATOR", "||", t, this.position));
    else if (e === "+" && i === "+")
      this.position += 2, this.tokens.push(new k("OPERATOR", "++", t, this.position));
    else if (e === "-" && i === "-")
      this.position += 2, this.tokens.push(new k("OPERATOR", "--", t, this.position));
    else {
      this.position++;
      const r = "()[]{},.;:?".includes(e) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new k(r, e, t, this.position));
    }
  }
}, xo = class {
  constructor(t) {
    this.tokens = t, this.position = 0;
  }
  parse() {
    if (this.isAtEnd())
      throw new Error("Empty expression");
    const t = this.parseExpression();
    if (this.match("PUNCTUATION", ";"), !this.isAtEnd())
      throw new Error(`Unexpected token: ${this.current().value}`);
    return t;
  }
  parseExpression() {
    return this.parseAssignment();
  }
  parseAssignment() {
    const t = this.parseTernary();
    if (this.match("OPERATOR", "=")) {
      const e = this.parseAssignment();
      if (t.type === "Identifier" || t.type === "MemberExpression")
        return {
          type: "AssignmentExpression",
          left: t,
          operator: "=",
          right: e
        };
      throw new Error("Invalid assignment target");
    }
    return t;
  }
  parseTernary() {
    const t = this.parseLogicalOr();
    if (this.match("PUNCTUATION", "?")) {
      const e = this.parseExpression();
      this.consume("PUNCTUATION", ":");
      const i = this.parseExpression();
      return {
        type: "ConditionalExpression",
        test: t,
        consequent: e,
        alternate: i
      };
    }
    return t;
  }
  parseLogicalOr() {
    let t = this.parseLogicalAnd();
    for (; this.match("OPERATOR", "||"); ) {
      const e = this.previous().value, i = this.parseLogicalAnd();
      t = {
        type: "BinaryExpression",
        operator: e,
        left: t,
        right: i
      };
    }
    return t;
  }
  parseLogicalAnd() {
    let t = this.parseEquality();
    for (; this.match("OPERATOR", "&&"); ) {
      const e = this.previous().value, i = this.parseEquality();
      t = {
        type: "BinaryExpression",
        operator: e,
        left: t,
        right: i
      };
    }
    return t;
  }
  parseEquality() {
    let t = this.parseRelational();
    for (; this.match("OPERATOR", "==", "!=", "===", "!=="); ) {
      const e = this.previous().value, i = this.parseRelational();
      t = {
        type: "BinaryExpression",
        operator: e,
        left: t,
        right: i
      };
    }
    return t;
  }
  parseRelational() {
    let t = this.parseAdditive();
    for (; this.match("OPERATOR", "<", ">", "<=", ">="); ) {
      const e = this.previous().value, i = this.parseAdditive();
      t = {
        type: "BinaryExpression",
        operator: e,
        left: t,
        right: i
      };
    }
    return t;
  }
  parseAdditive() {
    let t = this.parseMultiplicative();
    for (; this.match("OPERATOR", "+", "-"); ) {
      const e = this.previous().value, i = this.parseMultiplicative();
      t = {
        type: "BinaryExpression",
        operator: e,
        left: t,
        right: i
      };
    }
    return t;
  }
  parseMultiplicative() {
    let t = this.parseUnary();
    for (; this.match("OPERATOR", "*", "/", "%"); ) {
      const e = this.previous().value, i = this.parseUnary();
      t = {
        type: "BinaryExpression",
        operator: e,
        left: t,
        right: i
      };
    }
    return t;
  }
  parseUnary() {
    if (this.match("OPERATOR", "++", "--")) {
      const t = this.previous().value, e = this.parseUnary();
      return {
        type: "UpdateExpression",
        operator: t,
        argument: e,
        prefix: !0
      };
    }
    if (this.match("OPERATOR", "!", "-", "+")) {
      const t = this.previous().value, e = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator: t,
        argument: e,
        prefix: !0
      };
    }
    return this.parsePostfix();
  }
  parsePostfix() {
    let t = this.parseMember();
    return this.match("OPERATOR", "++", "--") ? {
      type: "UpdateExpression",
      operator: this.previous().value,
      argument: t,
      prefix: !1
    } : t;
  }
  parseMember() {
    let t = this.parsePrimary();
    for (; ; )
      if (this.match("PUNCTUATION", ".")) {
        const e = this.consume("IDENTIFIER");
        t = {
          type: "MemberExpression",
          object: t,
          property: { type: "Identifier", name: e.value },
          computed: !1
        };
      } else if (this.match("PUNCTUATION", "[")) {
        const e = this.parseExpression();
        this.consume("PUNCTUATION", "]"), t = {
          type: "MemberExpression",
          object: t,
          property: e,
          computed: !0
        };
      } else if (this.match("PUNCTUATION", "(")) {
        const e = this.parseArguments();
        t = {
          type: "CallExpression",
          callee: t,
          arguments: e
        };
      } else
        break;
    return t;
  }
  parseArguments() {
    const t = [];
    if (!this.check("PUNCTUATION", ")"))
      do
        t.push(this.parseExpression());
      while (this.match("PUNCTUATION", ","));
    return this.consume("PUNCTUATION", ")"), t;
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
      const t = this.parseExpression();
      return this.consume("PUNCTUATION", ")"), t;
    }
    if (this.match("PUNCTUATION", "["))
      return this.parseArrayLiteral();
    if (this.match("PUNCTUATION", "{"))
      return this.parseObjectLiteral();
    throw new Error(`Unexpected token: ${this.current().type} "${this.current().value}"`);
  }
  parseArrayLiteral() {
    const t = [];
    for (; !this.check("PUNCTUATION", "]") && !this.isAtEnd() && (t.push(this.parseExpression()), this.match("PUNCTUATION", ",")); )
      if (this.check("PUNCTUATION", "]"))
        break;
    return this.consume("PUNCTUATION", "]"), {
      type: "ArrayExpression",
      elements: t
    };
  }
  parseObjectLiteral() {
    const t = [];
    for (; !this.check("PUNCTUATION", "}") && !this.isAtEnd(); ) {
      let e, i = !1;
      if (this.match("STRING"))
        e = { type: "Literal", value: this.previous().value };
      else if (this.match("IDENTIFIER"))
        e = { type: "Identifier", name: this.previous().value };
      else if (this.match("PUNCTUATION", "["))
        e = this.parseExpression(), i = !0, this.consume("PUNCTUATION", "]");
      else
        throw new Error("Expected property key");
      this.consume("PUNCTUATION", ":");
      const n = this.parseExpression();
      if (t.push({
        type: "Property",
        key: e,
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
      properties: t
    };
  }
  match(...t) {
    for (let e = 0; e < t.length; e++) {
      const i = t[e];
      if (e === 0 && t.length > 1) {
        const n = i;
        for (let r = 1; r < t.length; r++)
          if (this.check(n, t[r]))
            return this.advance(), !0;
        return !1;
      } else if (t.length === 1)
        return this.checkType(i) ? (this.advance(), !0) : !1;
    }
    return !1;
  }
  check(t, e) {
    return this.isAtEnd() ? !1 : e !== void 0 ? this.current().type === t && this.current().value === e : this.current().type === t;
  }
  checkType(t) {
    return this.isAtEnd() ? !1 : this.current().type === t;
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
  consume(t, e) {
    if (e !== void 0) {
      if (this.check(t, e))
        return this.advance();
      throw new Error(`Expected ${t} "${e}" but got ${this.current().type} "${this.current().value}"`);
    }
    if (this.check(t))
      return this.advance();
    throw new Error(`Expected ${t} but got ${this.current().type} "${this.current().value}"`);
  }
}, Eo = class {
  evaluate({ node: t, scope: e = {}, context: i = null, allowGlobal: n = !1, forceBindingRootScopeToFunctions: r = !0 }) {
    switch (t.type) {
      case "Literal":
        return t.value;
      case "Identifier":
        if (t.name in e) {
          const m = e[t.name];
          return typeof m == "function" ? m.bind(e) : m;
        }
        if (n && typeof globalThis[t.name] < "u") {
          const m = globalThis[t.name];
          return typeof m == "function" ? m.bind(globalThis) : m;
        }
        throw new Error(`Undefined variable: ${t.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: t.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let o;
        if (t.computed) {
          const m = this.evaluate({ node: t.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          o = s[m];
        } else
          o = s[t.property.name];
        return typeof o == "function" ? r ? o.bind(e) : o.bind(s) : o;
      case "CallExpression":
        const a = t.arguments.map((m) => this.evaluate({ node: m, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }));
        if (t.callee.type === "MemberExpression") {
          const m = this.evaluate({ node: t.callee.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          let v;
          if (t.callee.computed) {
            const p = this.evaluate({ node: t.callee.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
            v = m[p];
          } else
            v = m[t.callee.property.name];
          if (typeof v != "function")
            throw new Error("Value is not a function");
          return v.apply(m, a);
        } else if (t.callee.type === "Identifier") {
          const m = t.callee.name;
          let v;
          if (m in e)
            v = e[m];
          else if (n && typeof globalThis[m] < "u")
            v = globalThis[m];
          else
            throw new Error(`Undefined variable: ${m}`);
          if (typeof v != "function")
            throw new Error("Value is not a function");
          const p = i !== null ? i : e;
          return v.apply(p, a);
        } else {
          const m = this.evaluate({ node: t.callee, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          if (typeof m != "function")
            throw new Error("Value is not a function");
          return m.apply(i, a);
        }
      case "UnaryExpression":
        const l = this.evaluate({ node: t.argument, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        switch (t.operator) {
          case "!":
            return !l;
          case "-":
            return -l;
          case "+":
            return +l;
          default:
            throw new Error(`Unknown unary operator: ${t.operator}`);
        }
      case "UpdateExpression":
        if (t.argument.type === "Identifier") {
          const m = t.argument.name;
          if (!(m in e))
            throw new Error(`Undefined variable: ${m}`);
          const v = e[m];
          return t.operator === "++" ? e[m] = v + 1 : t.operator === "--" && (e[m] = v - 1), t.prefix ? e[m] : v;
        } else if (t.argument.type === "MemberExpression") {
          const m = this.evaluate({ node: t.argument.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), v = t.argument.computed ? this.evaluate({ node: t.argument.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : t.argument.property.name, p = m[v];
          return t.operator === "++" ? m[v] = p + 1 : t.operator === "--" && (m[v] = p - 1), t.prefix ? m[v] : p;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const c = this.evaluate({ node: t.left, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), u = this.evaluate({ node: t.right, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        switch (t.operator) {
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
            throw new Error(`Unknown binary operator: ${t.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: t.test, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) ? this.evaluate({ node: t.consequent, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : this.evaluate({ node: t.alternate, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
      case "AssignmentExpression":
        const f = this.evaluate({ node: t.right, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        if (t.left.type === "Identifier")
          return e[t.left.name] = f, f;
        if (t.left.type === "MemberExpression") {
          const m = this.evaluate({ node: t.left.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          if (t.left.computed) {
            const v = this.evaluate({ node: t.left.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
            m[v] = f;
          } else
            m[t.left.property.name] = f;
          return f;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return t.elements.map((m) => this.evaluate({ node: m, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }));
      case "ObjectExpression":
        const y = {};
        for (const m of t.properties) {
          const v = m.computed ? this.evaluate({ node: m.key, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : m.key.type === "Identifier" ? m.key.name : this.evaluate({ node: m.key, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), p = this.evaluate({ node: m.value, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          y[v] = p;
        }
        return y;
      default:
        throw new Error(`Unknown node type: ${t.type}`);
    }
  }
};
function Io(t) {
  try {
    const i = new _o(t).tokenize(), r = new xo(i).parse(), s = new Eo();
    return function(o = {}) {
      const { scope: a = {}, context: l = null, allowGlobal: c = !1, forceBindingRootScopeToFunctions: u = !1 } = o;
      return s.evaluate({ node: r, scope: a, context: l, allowGlobal: c, forceBindingRootScopeToFunctions: u });
    };
  } catch (e) {
    throw new Error(`CSP Parser Error: ${e.message}`);
  }
}
function To(t, e) {
  let i = Co(t);
  if (typeof e == "function")
    return Pn(i, e);
  let n = So(t, e, i);
  return kn.bind(null, t, e, n);
}
function Co(t) {
  let e = {};
  return ue(e, t), [e, ...vt(t)];
}
function So(t, e, i) {
  return (n = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = At([r, ...i]), l = Io(e)({
      scope: o,
      allowGlobal: !0,
      forceBindingRootScopeToFunctions: !0
    });
    if (jt && typeof l == "function") {
      let c = l.apply(l, s);
      c instanceof Promise ? c.then((u) => n(u)) : n(c);
    } else typeof l == "object" && l instanceof Promise ? l.then((c) => n(c)) : n(l);
  };
}
function Ao(t, e) {
  const i = /* @__PURE__ */ Object.create(null), n = t.split(",");
  for (let r = 0; r < n.length; r++)
    i[n[r]] = !0;
  return (r) => !!i[r];
}
var Oo = Object.freeze({}), $o = Object.prototype.hasOwnProperty, Se = (t, e) => $o.call(t, e), pt = Array.isArray, Wt = (t) => fr(t) === "[object Map]", No = (t) => typeof t == "string", Si = (t) => typeof t == "symbol", Ae = (t) => t !== null && typeof t == "object", ko = Object.prototype.toString, fr = (t) => ko.call(t), hr = (t) => fr(t).slice(8, -1), Ai = (t) => No(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Ro = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (i) => e[i] || (e[i] = t(i));
}, Lo = Ro((t) => t.charAt(0).toUpperCase() + t.slice(1)), pr = (t, e) => t !== e && (t === t || e === e), ei = /* @__PURE__ */ new WeakMap(), Pt = [], K, mt = Symbol("iterate"), ii = Symbol("Map key iterate");
function Po(t) {
  return t && t._isEffect === !0;
}
function Do(t, e = Oo) {
  Po(t) && (t = t.raw);
  const i = Fo(t, e);
  return e.lazy || i(), i;
}
function Mo(t) {
  t.active && (mr(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var zo = 0;
function Fo(t, e) {
  const i = function() {
    if (!i.active)
      return t();
    if (!Pt.includes(i)) {
      mr(i);
      try {
        return Bo(), Pt.push(i), K = i, t();
      } finally {
        Pt.pop(), gr(), K = Pt[Pt.length - 1];
      }
    }
  };
  return i.id = zo++, i.allowRecurse = !!e.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = t, i.deps = [], i.options = e, i;
}
function mr(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let i = 0; i < e.length; i++)
      e[i].delete(t);
    e.length = 0;
  }
}
var It = !0, Oi = [];
function Uo() {
  Oi.push(It), It = !1;
}
function Bo() {
  Oi.push(It), It = !0;
}
function gr() {
  const t = Oi.pop();
  It = t === void 0 ? !0 : t;
}
function j(t, e, i) {
  if (!It || K === void 0)
    return;
  let n = ei.get(t);
  n || ei.set(t, n = /* @__PURE__ */ new Map());
  let r = n.get(i);
  r || n.set(i, r = /* @__PURE__ */ new Set()), r.has(K) || (r.add(K), K.deps.push(r), K.options.onTrack && K.options.onTrack({
    effect: K,
    target: t,
    type: e,
    key: i
  }));
}
function st(t, e, i, n, r, s) {
  const o = ei.get(t);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== K || d.allowRecurse) && a.add(d);
    });
  };
  if (e === "clear")
    o.forEach(l);
  else if (i === "length" && pt(t))
    o.forEach((u, d) => {
      (d === "length" || d >= n) && l(u);
    });
  else
    switch (i !== void 0 && l(o.get(i)), e) {
      case "add":
        pt(t) ? Ai(i) && l(o.get("length")) : (l(o.get(mt)), Wt(t) && l(o.get(ii)));
        break;
      case "delete":
        pt(t) || (l(o.get(mt)), Wt(t) && l(o.get(ii)));
        break;
      case "set":
        Wt(t) && l(o.get(mt));
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
var jo = /* @__PURE__ */ Ao("__proto__,__v_isRef,__isVue"), vr = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter(Si)), Ho = /* @__PURE__ */ br(), Wo = /* @__PURE__ */ br(!0), ji = /* @__PURE__ */ Vo();
function Vo() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...i) {
      const n = O(this);
      for (let s = 0, o = this.length; s < o; s++)
        j(n, "get", s + "");
      const r = n[e](...i);
      return r === -1 || r === !1 ? n[e](...i.map(O)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...i) {
      Uo();
      const n = O(this)[e].apply(this, i);
      return gr(), n;
    };
  }), t;
}
function br(t = !1, e = !1) {
  return function(n, r, s) {
    if (r === "__v_isReactive")
      return !t;
    if (r === "__v_isReadonly")
      return t;
    if (r === "__v_raw" && s === (t ? e ? sa : xr : e ? ra : _r).get(n))
      return n;
    const o = pt(n);
    if (!t && o && Se(ji, r))
      return Reflect.get(ji, r, s);
    const a = Reflect.get(n, r, s);
    return (Si(r) ? vr.has(r) : jo(r)) || (t || j(n, "get", r), e) ? a : ni(a) ? !o || !Ai(r) ? a.value : a : Ae(a) ? t ? Er(a) : Ri(a) : a;
  };
}
var qo = /* @__PURE__ */ Yo();
function Yo(t = !1) {
  return function(i, n, r, s) {
    let o = i[n];
    if (!t && (r = O(r), o = O(o), !pt(i) && ni(o) && !ni(r)))
      return o.value = r, !0;
    const a = pt(i) && Ai(n) ? Number(n) < i.length : Se(i, n), l = Reflect.set(i, n, r, s);
    return i === O(s) && (a ? pr(r, o) && st(i, "set", n, r, o) : st(i, "add", n, r)), l;
  };
}
function Ko(t, e) {
  const i = Se(t, e), n = t[e], r = Reflect.deleteProperty(t, e);
  return r && i && st(t, "delete", e, void 0, n), r;
}
function Jo(t, e) {
  const i = Reflect.has(t, e);
  return (!Si(e) || !vr.has(e)) && j(t, "has", e), i;
}
function Xo(t) {
  return j(t, "iterate", pt(t) ? "length" : mt), Reflect.ownKeys(t);
}
var Zo = {
  get: Ho,
  set: qo,
  deleteProperty: Ko,
  has: Jo,
  ownKeys: Xo
}, Go = {
  get: Wo,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, $i = (t) => Ae(t) ? Ri(t) : t, Ni = (t) => Ae(t) ? Er(t) : t, ki = (t) => t, Oe = (t) => Reflect.getPrototypeOf(t);
function Gt(t, e, i = !1, n = !1) {
  t = t.__v_raw;
  const r = O(t), s = O(e);
  e !== s && !i && j(r, "get", e), !i && j(r, "get", s);
  const { has: o } = Oe(r), a = n ? ki : i ? Ni : $i;
  if (o.call(r, e))
    return a(t.get(e));
  if (o.call(r, s))
    return a(t.get(s));
  t !== r && t.get(e);
}
function Qt(t, e = !1) {
  const i = this.__v_raw, n = O(i), r = O(t);
  return t !== r && !e && j(n, "has", t), !e && j(n, "has", r), t === r ? i.has(t) : i.has(t) || i.has(r);
}
function te(t, e = !1) {
  return t = t.__v_raw, !e && j(O(t), "iterate", mt), Reflect.get(t, "size", t);
}
function Hi(t) {
  t = O(t);
  const e = O(this);
  return Oe(e).has.call(e, t) || (e.add(t), st(e, "add", t, t)), this;
}
function Wi(t, e) {
  e = O(e);
  const i = O(this), { has: n, get: r } = Oe(i);
  let s = n.call(i, t);
  s ? wr(i, n, t) : (t = O(t), s = n.call(i, t));
  const o = r.call(i, t);
  return i.set(t, e), s ? pr(e, o) && st(i, "set", t, e, o) : st(i, "add", t, e), this;
}
function Vi(t) {
  const e = O(this), { has: i, get: n } = Oe(e);
  let r = i.call(e, t);
  r ? wr(e, i, t) : (t = O(t), r = i.call(e, t));
  const s = n ? n.call(e, t) : void 0, o = e.delete(t);
  return r && st(e, "delete", t, void 0, s), o;
}
function qi() {
  const t = O(this), e = t.size !== 0, i = Wt(t) ? new Map(t) : new Set(t), n = t.clear();
  return e && st(t, "clear", void 0, void 0, i), n;
}
function ee(t, e) {
  return function(n, r) {
    const s = this, o = s.__v_raw, a = O(o), l = e ? ki : t ? Ni : $i;
    return !t && j(a, "iterate", mt), o.forEach((c, u) => n.call(r, l(c), l(u), s));
  };
}
function ie(t, e, i) {
  return function(...n) {
    const r = this.__v_raw, s = O(r), o = Wt(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...n), u = i ? ki : e ? Ni : $i;
    return !e && j(s, "iterate", l ? ii : mt), {
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
function et(t) {
  return function(...e) {
    {
      const i = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${Lo(t)} operation ${i}failed: target is readonly.`, O(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function Qo() {
  const t = {
    get(s) {
      return Gt(this, s);
    },
    get size() {
      return te(this);
    },
    has: Qt,
    add: Hi,
    set: Wi,
    delete: Vi,
    clear: qi,
    forEach: ee(!1, !1)
  }, e = {
    get(s) {
      return Gt(this, s, !1, !0);
    },
    get size() {
      return te(this);
    },
    has: Qt,
    add: Hi,
    set: Wi,
    delete: Vi,
    clear: qi,
    forEach: ee(!1, !0)
  }, i = {
    get(s) {
      return Gt(this, s, !0);
    },
    get size() {
      return te(this, !0);
    },
    has(s) {
      return Qt.call(this, s, !0);
    },
    add: et(
      "add"
      /* ADD */
    ),
    set: et(
      "set"
      /* SET */
    ),
    delete: et(
      "delete"
      /* DELETE */
    ),
    clear: et(
      "clear"
      /* CLEAR */
    ),
    forEach: ee(!0, !1)
  }, n = {
    get(s) {
      return Gt(this, s, !0, !0);
    },
    get size() {
      return te(this, !0);
    },
    has(s) {
      return Qt.call(this, s, !0);
    },
    add: et(
      "add"
      /* ADD */
    ),
    set: et(
      "set"
      /* SET */
    ),
    delete: et(
      "delete"
      /* DELETE */
    ),
    clear: et(
      "clear"
      /* CLEAR */
    ),
    forEach: ee(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = ie(s, !1, !1), i[s] = ie(s, !0, !1), e[s] = ie(s, !1, !0), n[s] = ie(s, !0, !0);
  }), [
    t,
    i,
    e,
    n
  ];
}
var [ta, ea, qc, Yc] = /* @__PURE__ */ Qo();
function yr(t, e) {
  const i = t ? ea : ta;
  return (n, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? n : Reflect.get(Se(i, r) && r in n ? i : n, r, s);
}
var ia = {
  get: /* @__PURE__ */ yr(!1)
}, na = {
  get: /* @__PURE__ */ yr(!0)
};
function wr(t, e, i) {
  const n = O(i);
  if (n !== i && e.call(t, n)) {
    const r = hr(t);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var _r = /* @__PURE__ */ new WeakMap(), ra = /* @__PURE__ */ new WeakMap(), xr = /* @__PURE__ */ new WeakMap(), sa = /* @__PURE__ */ new WeakMap();
function oa(t) {
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
function aa(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : oa(hr(t));
}
function Ri(t) {
  return t && t.__v_isReadonly ? t : Ir(t, !1, Zo, ia, _r);
}
function Er(t) {
  return Ir(t, !0, Go, na, xr);
}
function Ir(t, e, i, n, r) {
  if (!Ae(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = r.get(t);
  if (s)
    return s;
  const o = aa(t);
  if (o === 0)
    return t;
  const a = new Proxy(t, o === 2 ? n : i);
  return r.set(t, a), a;
}
function O(t) {
  return t && O(t.__v_raw) || t;
}
function ni(t) {
  return !!(t && t.__v_isRef === !0);
}
V("nextTick", () => Ii);
V("dispatch", (t) => Ht.bind(Ht, t));
V("watch", (t, { evaluateLater: e, cleanup: i }) => (n, r) => {
  let s = e(n), a = wn(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  i(a);
});
V("store", mo);
V("data", (t) => An(t));
V("root", (t) => Ie(t));
V("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = At(la(t))), t._x_refs_proxy));
function la(t) {
  let e = [];
  return $t(t, (i) => {
    i._x_refs && e.push(i._x_refs);
  }), e;
}
var ze = {};
function Tr(t) {
  return ze[t] || (ze[t] = 0), ++ze[t];
}
function ca(t, e) {
  return $t(t, (i) => {
    if (i._x_ids && i._x_ids[e])
      return !0;
  });
}
function ua(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = Tr(e));
}
V("id", (t, { cleanup: e }) => (i, n = null) => {
  let r = `${i}${n ? `-${n}` : ""}`;
  return da(t, r, e, () => {
    let s = ca(t, i), o = s ? s._x_ids[i] : Tr(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
Ce((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function da(t, e, i, n) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let r = n();
  return t._x_id[e] = r, i(() => {
    delete t._x_id[e];
  }), r;
}
V("el", (t) => t);
Cr("Focus", "focus", "focus");
Cr("Persist", "persist", "persist");
function Cr(t, e, i) {
  V(e, (n) => U(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
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
    let u = t._x_model.get, d = t._x_model.set, f = lr(
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
N("teleport", (t, { modifiers: e, expression: i }, { cleanup: n }) => {
  t.tagName.toLowerCase() !== "template" && U("x-teleport can only be used on a <template> tag", t);
  let r = Yi(i), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Jt(s, {}, t);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  $(() => {
    o(s, r, e), at(() => {
      Z(s);
    })();
  }), t._x_teleportPutBack = () => {
    let a = Yi(i);
    $(() => {
      o(t._x_teleport, a, e);
    });
  }, n(
    () => $(() => {
      s.remove(), Nt(s);
    })
  );
});
var fa = document.createElement("div");
function Yi(t) {
  let e = at(() => document.querySelector(t), () => fa)();
  return e || U(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var Sr = () => {
};
Sr.inline = (t, { modifiers: e }, { cleanup: i }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, i(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
N("ignore", Sr);
N("effect", at((t, { expression: e }, { effect: i }) => {
  i(R(t, e));
}));
function ri(t, e, i, n) {
  let r = t, s = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (e = ha(e)), i.includes("camel") && (e = pa(e)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (r = window), i.includes("document") && (r = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = he(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = or(s, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = he(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = ar(s, c);
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
  })), (ga(e) || Ar(e)) && (s = a(s, (l, c) => {
    va(c, i) || l(c);
  })), r.addEventListener(e, s, o), () => {
    r.removeEventListener(e, s, o);
  };
}
function ha(t) {
  return t.replace(/-/g, ".");
}
function pa(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function he(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function ma(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function ga(t) {
  return ["keydown", "keyup"].includes(t);
}
function Ar(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function va(t, e) {
  let i = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, he((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, he((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && Ki(t.key).includes(i[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), t[`${o}Key`])).length === r.length && (Ar(t.type) || Ki(t.key).includes(i[0])));
}
function Ki(t) {
  if (!t)
    return [];
  t = ma(t);
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
  typeof i == "string" && t.type === "radio" && $(() => {
    t.hasAttribute("name") || t.setAttribute("name", i);
  });
  let u = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input", d = rt ? () => {
  } : ri(t, u, e, (f) => {
    c(Fe(t, e, f, l()));
  });
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || Ci(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    Fe(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = d, r(() => t._x_removeModelListeners.default()), t.form) {
    let f = ri(t.form, "reset", [], (y) => {
      Ii(() => t._x_model && t._x_model.set(Fe(t, e, { target: t }, l())));
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
    f === void 0 && typeof i == "string" && i.match(/\./) && (f = ""), window.fromModel = !0, $(() => er(t, "value", f)), delete window.fromModel;
  }, n(() => {
    let f = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Fe(t, e, i, n) {
  return $(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Ci(t))
      if (Array.isArray(n)) {
        let r = null;
        return e.includes("number") ? r = Ue(i.target.value) : e.includes("boolean") ? r = ae(i.target.value) : r = i.target.value, i.target.checked ? n.includes(r) ? n : n.concat([r]) : n.filter((s) => !ba(s, r));
      } else
        return i.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ue(s);
        }) : e.includes("boolean") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return ae(s);
        }) : Array.from(i.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return sr(t) ? i.target.checked ? r = i.target.value : r = n : r = i.target.value, e.includes("number") ? Ue(r) : e.includes("boolean") ? ae(r) : e.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Ue(t) {
  let e = t ? parseFloat(t) : null;
  return ya(e) ? e : t;
}
function ba(t, e) {
  return t == e;
}
function ya(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Ji(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
N("cloak", (t) => queueMicrotask(() => $(() => t.removeAttribute(Ot("cloak")))));
Jn(() => `[${Ot("init")}]`);
N("init", at((t, { expression: e }, { evaluate: i }) => typeof e == "string" ? !!e.trim() && i(e, {}, !1) : i(e, {}, !1)));
N("text", (t, { expression: e }, { effect: i, evaluateLater: n }) => {
  let r = n(e);
  i(() => {
    r((s) => {
      $(() => {
        t.textContent = s;
      });
    });
  });
});
N("html", (t, { expression: e }, { effect: i, evaluateLater: n }) => {
  let r = n(e);
  i(() => {
    r((s) => {
      $(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, Z(t), delete t._x_ignoreSelf;
      });
    });
  });
});
_i(Fn(":", Un(Ot("bind:"))));
var Or = (t, { value: e, modifiers: i, expression: n, original: r }, { effect: s, cleanup: o }) => {
  if (!e) {
    let l = {};
    vo(l), R(t, n)((u) => {
      ur(t, u, r);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return wa(t, n);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let a = R(t, n);
  s(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), $(() => er(t, e, l, i));
  })), o(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
Or.inline = (t, { value: e, modifiers: i, expression: n }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: n, extract: !1 });
};
N("bind", Or);
function wa(t, e) {
  t._x_keyExpression = e;
}
Kn(() => `[${Ot("data")}]`);
N("data", (t, { expression: e }, { cleanup: i }) => {
  if (_a(t))
    return;
  e = e === "" ? "{}" : e;
  let n = {};
  ue(n, t);
  let r = {};
  yo(r, n);
  let s = ht(t, e, { scope: r });
  (s === void 0 || s === !0) && (s = {}), ue(s, t);
  let o = Ct(s);
  On(o);
  let a = Jt(t, o);
  o.init && ht(t, o.init), i(() => {
    o.destroy && ht(t, o.destroy), a();
  });
});
Ce((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function _a(t) {
  return rt ? ti ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (t, { modifiers: e, expression: i }, { effect: n }) => {
  let r = R(t, i);
  t._x_doHide || (t._x_doHide = () => {
    $(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    $(() => {
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
  let r = Ea(e), s = R(t, r.items), o = R(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, i(() => xa(t, r, s, o)), n(() => {
    Object.values(t._x_lookup).forEach((a) => $(
      () => {
        Nt(a), a.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function xa(t, e, i, n) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = t;
  i((o) => {
    Ia(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = t._x_lookup, l = t._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, b]) => {
        let h = Xi(e, b, p, o);
        n((_) => {
          u.includes(_) && U("Duplicate key on x-for", t), u.push(_);
        }, { scope: { index: p, ...h } }), c.push(h);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let b = Xi(e, o[p], p, o);
        n((h) => {
          u.includes(h) && U("Duplicate key on x-for", t), u.push(h);
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
        Nt(a[b]), a[b].remove();
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
      let E = c[h], x = u[h], g = document.importNode(s.content, !0).firstElementChild, w = Ct(E);
      Jt(g, w, s), g._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([T, C]) => {
          w[T] = C;
        });
      }, $(() => {
        _.after(g), at(() => Z(g))();
      }), typeof x == "object" && U("x-for key cannot be an object, it must be a string or an integer", s), a[x] = g;
    }
    for (let p = 0; p < m.length; p++)
      a[m[p]]._x_refreshXForScope(c[u.indexOf(m[p])]);
    s._x_prevKeys = u;
  });
}
function Ea(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = t.match(n);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(i, "").trim(), a = o.match(e);
  return a ? (s.item = o.replace(e, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Xi(t, e, i, n) {
  let r = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = e[a];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = e[o];
  }) : r[t.item] = e, t.index && (r[t.index] = i), t.collection && (r[t.collection] = n), r;
}
function Ia(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function $r() {
}
$r.inline = (t, { expression: e }, { cleanup: i }) => {
  let n = Ie(t);
  n._x_refs || (n._x_refs = {}), n._x_refs[e] = t, i(() => delete n._x_refs[e]);
};
N("ref", $r);
N("if", (t, { expression: e }, { effect: i, cleanup: n }) => {
  t.tagName.toLowerCase() !== "template" && U("x-if can only be used on a <template> tag", t);
  let r = R(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let a = t.content.cloneNode(!0).firstElementChild;
    return Jt(a, {}, t), $(() => {
      t.after(a), at(() => Z(a))();
    }), t._x_currentIfEl = a, t._x_undoIf = () => {
      $(() => {
        Nt(a), a.remove();
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
  i(e).forEach((r) => ua(t, r));
});
Ce((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
_i(Fn("@", Un(Ot("on:"))));
N("on", at((t, { value: e, modifiers: i, expression: n }, { cleanup: r }) => {
  let s = n ? R(t, n) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let o = ri(t, e, i, (a) => {
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
  N(e, (n) => U(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
Xt.setEvaluator(To);
Xt.setReactivityEngine({ reactive: Ri, effect: Do, release: Mo, raw: O });
var Ta = Xt, Nr = Ta;
function Ca(t) {
  t.directive("collapse", e), e.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function e(i, { modifiers: n }) {
    let r = Zi(n, "duration", 250) / 1e3, s = Zi(n, "min", 0), o = !n.includes("min");
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
function Zi(t, e, i) {
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
var Sa = Ca;
function Aa(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: i, expression: n, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(n), l = {
      rootMargin: Na(r),
      threshold: Oa(r)
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
function Oa(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function $a(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Na(t) {
  const e = "margin", i = "0px 0px 0px 0px", n = t.indexOf(e);
  if (n === -1)
    return i;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push($a(t[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : i;
}
var ka = Aa, kr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], pe = /* @__PURE__ */ kr.join(","), Rr = typeof Element > "u", yt = Rr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, si = !Rr && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, Lr = function(e, i, n) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(pe));
  return i && yt.call(e, pe) && r.unshift(e), r = r.filter(n), r;
}, Pr = function t(e, i, n) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, n);
      n.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = yt.call(o, pe);
      u && n.filter(o) && (i || !e.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), f = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && f) {
        var y = t(d === !0 ? o.children : d.children, !0, n);
        n.flatten ? r.push.apply(r, y) : r.push({
          scope: o,
          candidates: y
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Dr = function(e, i) {
  return e.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Ra = function(e, i) {
  return e.tabIndex === i.tabIndex ? e.documentOrder - i.documentOrder : e.tabIndex - i.tabIndex;
}, Mr = function(e) {
  return e.tagName === "INPUT";
}, La = function(e) {
  return Mr(e) && e.type === "hidden";
}, Pa = function(e) {
  var i = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Da = function(e, i) {
  for (var n = 0; n < e.length; n++)
    if (e[n].checked && e[n].form === i)
      return e[n];
}, Ma = function(e) {
  if (!e.name)
    return !0;
  var i = e.form || si(e), n = function(a) {
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
  var s = Da(r, e.form);
  return !s || s === e;
}, za = function(e) {
  return Mr(e) && e.type === "radio";
}, Fa = function(e) {
  return za(e) && !Ma(e);
}, Gi = function(e) {
  var i = e.getBoundingClientRect(), n = i.width, r = i.height;
  return n === 0 && r === 0;
}, Ua = function(e, i) {
  var n = i.displayCheck, r = i.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = yt.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (yt.call(o, "details:not([open]) *"))
    return !0;
  var a = si(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var u = e.parentElement, d = si(e);
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
}, Ba = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var i = e.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var r = i.children.item(n);
          if (r.tagName === "LEGEND")
            return yt.call(i, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, me = function(e, i) {
  return !(i.disabled || La(i) || Ua(i, e) || // For a details element with a summary, the summary element gets the focus
  Pa(i) || Ba(i));
}, oi = function(e, i) {
  return !(Fa(i) || Dr(i) < 0 || !me(e, i));
}, ja = function(e) {
  var i = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Ha = function t(e) {
  var i = [], n = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Dr(a, o), c = o ? t(r.candidates) : a;
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
}, Wa = function(e, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Pr([e], i.includeContainer, {
    filter: oi.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: ja
  }) : n = Lr(e, i.includeContainer, oi.bind(null, i)), Ha(n);
}, zr = function(e, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Pr([e], i.includeContainer, {
    filter: me.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = Lr(e, i.includeContainer, me.bind(null, i)), n;
}, ne = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return yt.call(e, pe) === !1 ? !1 : oi(i, e);
}, Va = /* @__PURE__ */ kr.concat("iframe").join(","), le = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return yt.call(e, Va) === !1 ? !1 : me(i, e);
};
function Qi(t, e) {
  var i = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function tn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var i = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Qi(Object(i), !0).forEach(function(n) {
      qa(t, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : Qi(Object(i)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return t;
}
function qa(t, e, i) {
  return e in t ? Object.defineProperty(t, e, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = i, t;
}
var en = /* @__PURE__ */ function() {
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
}(), Ya = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Ka = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, Ja = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, nn = function(e) {
  return setTimeout(e, 0);
}, rn = function(e, i) {
  var n = -1;
  return e.every(function(r, s) {
    return i(r) ? (n = s, !1) : !0;
  }), n;
}, Dt = function(e) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, n) : e;
}, re = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Xa = function(e, i) {
  var n = i?.document || document, r = tn({
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
      var I = w.container, T = w.tabbableNodes;
      return I.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(C) {
        return C === g;
      });
    });
  }, c = function(g) {
    var w = r[g];
    if (typeof w == "function") {
      for (var I = arguments.length, T = new Array(I > 1 ? I - 1 : 0), C = 1; C < I; C++)
        T[C - 1] = arguments[C];
      w = w.apply(void 0, T);
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
        nextTabbableNode: function(C) {
          var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, L = I.findIndex(function(P) {
            return P === C;
          });
          if (!(L < 0))
            return S ? I.slice(L + 1).find(function(P) {
              return ne(P, r.tabbableOptions);
            }) : I.slice(0, L).reverse().find(function(P) {
              return ne(P, r.tabbableOptions);
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
      }), s.mostRecentlyFocusedNode = g, Ya(g) && g.select();
    }
  }, y = function(g) {
    var w = c("setReturnFocus", g);
    return w || (w === !1 ? !1 : g);
  }, m = function(g) {
    var w = re(g);
    if (!(l(w) >= 0)) {
      if (Dt(r.clickOutsideDeactivates, g)) {
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
          returnFocus: r.returnFocusOnDeactivate && !le(w, r.tabbableOptions)
        });
        return;
      }
      Dt(r.allowOutsideClick, g) || g.preventDefault();
    }
  }, v = function(g) {
    var w = re(g), I = l(w) >= 0;
    I || w instanceof Document ? I && (s.mostRecentlyFocusedNode = w) : (g.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, p = function(g) {
    var w = re(g);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(w), C = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        g.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var S = rn(s.tabbableGroups, function(B) {
          var F = B.firstTabbableNode;
          return w === F;
        });
        if (S < 0 && (C.container === w || le(w, r.tabbableOptions) && !ne(w, r.tabbableOptions) && !C.nextTabbableNode(w, !1)) && (S = T), S >= 0) {
          var L = S === 0 ? s.tabbableGroups.length - 1 : S - 1, P = s.tabbableGroups[L];
          I = P.lastTabbableNode;
        }
      } else {
        var q = rn(s.tabbableGroups, function(B) {
          var F = B.lastTabbableNode;
          return w === F;
        });
        if (q < 0 && (C.container === w || le(w, r.tabbableOptions) && !ne(w, r.tabbableOptions) && !C.nextTabbableNode(w)) && (q = T), q >= 0) {
          var z = q === s.tabbableGroups.length - 1 ? 0 : q + 1, lt = s.tabbableGroups[z];
          I = lt.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (g.preventDefault(), f(I));
  }, b = function(g) {
    if (Ka(g) && Dt(r.escapeDeactivates, g) !== !1) {
      g.preventDefault(), o.deactivate();
      return;
    }
    if (Ja(g)) {
      p(g);
      return;
    }
  }, h = function(g) {
    var w = re(g);
    l(w) >= 0 || Dt(r.clickOutsideDeactivates, g) || Dt(r.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, _ = function() {
    if (s.active)
      return en.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? nn(function() {
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
      var w = a(g, "onActivate"), I = a(g, "onPostActivate"), T = a(g, "checkCanFocusTrap");
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, w && w();
      var C = function() {
        T && d(), _(), I && I();
      };
      return T ? (T(s.containers.concat()).then(C, C), this) : (C(), this);
    },
    deactivate: function(g) {
      if (!s.active)
        return this;
      var w = tn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, g);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, en.deactivateTrap(o);
      var I = a(w, "onDeactivate"), T = a(w, "onPostDeactivate"), C = a(w, "checkCanReturnFocus"), S = a(w, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var L = function() {
        nn(function() {
          S && f(y(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return S && C ? (C(y(s.nodeFocusedBeforeActivation)).then(L, L), this) : (L(), this);
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
  }, o.updateContainerElements(e), o;
};
function Za(t) {
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
        return le(s);
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
          f = sn(n);
        });
      });
      let y = Xa(n, d), m = () => {
      };
      const v = () => {
        f(), f = () => {
        }, m(), m = () => {
        }, y.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (m = Ga()), setTimeout(() => {
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
function sn(t) {
  let e = [];
  return Fr(t, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), e.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Fr(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((i) => {
    i.isSameNode(t) ? Fr(t.parentNode, e) : e(i);
  });
}
function Ga() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var Qa = Za;
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
function tl() {
  return !0;
}
function el({ component: t, argument: e }) {
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
function il() {
  return new Promise((t) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(t) : setTimeout(t, 200);
  });
}
function nl({ argument: t }) {
  return new Promise((e) => {
    if (!t)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), e();
    const i = window.matchMedia(`(${t})`);
    i.matches ? e() : i.addEventListener("change", e, { once: !0 });
  });
}
function rl({ component: t, argument: e }) {
  return new Promise((i) => {
    const n = e || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), i());
    }, { rootMargin: n });
    r.observe(t.el);
  });
}
var on = {
  eager: tl,
  event: el,
  idle: il,
  media: nl,
  visible: rl
};
async function sl(t) {
  const e = ol(t.strategy);
  await ai(t, e);
}
async function ai(t, e) {
  if (e.type === "expression") {
    if (e.operator === "&&")
      return Promise.all(
        e.parameters.map((i) => ai(t, i))
      );
    if (e.operator === "||")
      return Promise.any(
        e.parameters.map((i) => ai(t, i))
      );
  }
  return on[e.method] ? on[e.method]({
    component: t,
    argument: e.argument
  }) : !1;
}
function ol(t) {
  const e = al(t);
  let i = Ur(e);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function al(t) {
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
function Ur(t) {
  let e = an(t);
  for (; t.length > 0 && (t[0].value === "&&" || t[0].value === "|" || t[0].value === "||"); ) {
    const i = t.shift().value, n = an(t);
    e.type === "expression" && e.operator === i ? e.parameters.push(n) : e = {
      type: "expression",
      operator: i,
      parameters: [e, n]
    };
  }
  return e;
}
function an(t) {
  if (t[0].value === "(") {
    t.shift();
    const e = Ur(t);
    return t[0].value === ")" && t.shift(), e;
  } else
    return t.shift();
}
function ll(t) {
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
  }, t.asyncData = (h, _ = !1) => {
    o[h] = {
      loaded: !1,
      download: _
    };
  }, t.asyncUrl = (h, _) => {
    !h || !_ || o[h] || (o[h] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        b(_)
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
      const { name: _, strategy: E } = d(h);
      await sl({
        name: _,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(_), h.isConnected && (m(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, t.directive(e, u).before("ignore");
  function d(h) {
    const _ = p(h.getAttribute(t.prefixed("data"))), E = h.getAttribute(t.prefixed(e)) || r.defaultStrategy, x = h.getAttribute(i);
    return x && t.asyncUrl(_, x), {
      name: _,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (v(h), !o[h] || o[h].loaded)) return;
    const _ = await y(h);
    t.data(h, _), o[h].loaded = !0;
  }
  async function y(h) {
    if (!o[h]) return;
    const _ = await o[h].download(h);
    return typeof _ == "function" ? _ : _[h] || _.default || Object.values(_)[0] || !1;
  }
  function m(h) {
    t.destroyTree(h), h._x_ignore = !1, h.removeAttribute(n), !h.closest(`[${n}]`) && t.initTree(h);
  }
  function v(h) {
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
  function b(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function cl(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ul(t, e) {
  for (var i = 0; i < e.length; i++) {
    var n = e[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
  }
}
function dl(t, e, i) {
  return e && ul(t.prototype, e), t;
}
var fl = Object.defineProperty, G = function(t, e) {
  return fl(t, "name", { value: e, configurable: !0 });
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
`, bl = G(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Mt = G(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), A = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, it = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ln = { OUTLINE: "outline", FILLED: "filled" }, Be = { FADE: "fade", SLIDE: "slide" }, zt = { CLOSE: Mt(hl), SUCCESS: Mt(gl), ERROR: Mt(pl), WARNING: Mt(vl), INFO: Mt(ml) }, cn = G(function(t) {
  t.wrapper.classList.add(A.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(A.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), un = G(function(t) {
  t.wrapper.classList.remove(A.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), yl = G(function(t) {
  t.wrapper.classList.add(A.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(A.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), wl = G(function(t) {
  t.wrapper.classList.remove(A.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Br = function() {
  function t(e) {
    var i = this;
    cl(this, t), this.notifyOut = G(function(B) {
      B(i);
    }, "notifyOut");
    var n = e.notificationsGap, r = n === void 0 ? 20 : n, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, u = c === void 0 ? Be.FADE : c, d = e.type, f = d === void 0 ? "outline" : d, y = e.title, m = e.text, v = e.showIcon, p = v === void 0 ? !0 : v, b = e.customIcon, h = b === void 0 ? "" : b, _ = e.customClass, E = _ === void 0 ? "" : _, x = e.speed, g = x === void 0 ? 500 : x, w = e.showCloseButton, I = w === void 0 ? !0 : w, T = e.autoclose, C = T === void 0 ? !0 : T, S = e.autotimeout, L = S === void 0 ? 3e3 : S, P = e.position, q = P === void 0 ? "right top" : P, z = e.customWrapper, lt = z === void 0 ? "" : z;
    if (this.customWrapper = lt, this.status = l, this.title = y, this.text = m, this.showIcon = p, this.customIcon = h, this.customClass = E, this.speed = g, this.effect = u, this.showCloseButton = I, this.autoclose = C, this.autotimeout = L, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = q, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return dl(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(A.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(A.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](A.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](A.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](A.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](A.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](A.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](A.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](A.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(A.NOTIFY_CLOSE), n.innerHTML = zt.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
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
      case it.SUCCESS:
        this.wrapper.classList.add(A.NOTIFY_SUCCESS);
        break;
      case it.ERROR:
        this.wrapper.classList.add(A.NOTIFY_ERROR);
        break;
      case it.WARNING:
        this.wrapper.classList.add(A.NOTIFY_WARNING);
        break;
      case it.INFO:
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
    var i = G(function(r) {
      switch (r) {
        case it.SUCCESS:
          return zt.SUCCESS;
        case it.ERROR:
          return zt.ERROR;
        case it.WARNING:
          return zt.WARNING;
        case it.INFO:
          return zt.INFO;
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
      case Be.FADE:
        this.selectedNotifyInEffect = cn, this.selectedNotifyOutEffect = un;
        break;
      case Be.SLIDE:
        this.selectedNotifyInEffect = yl, this.selectedNotifyOutEffect = wl;
        break;
      default:
        this.selectedNotifyInEffect = cn, this.selectedNotifyOutEffect = un;
    }
  } }]), t;
}();
G(Br, "Notify");
var jr = Br;
globalThis.Notify = jr;
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
function Ft(t = {}) {
  const e = {
    ...Vr,
    ...t
  };
  Hr.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), Wr.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new jr(e);
}
const _l = {
  custom: Ft,
  success(t, e = "Success", i = {}) {
    Ft({
      status: "success",
      title: e,
      text: t,
      ...i
    });
  },
  error(t, e = "Error", i = {}) {
    Ft({
      status: "error",
      title: e,
      text: t,
      ...i
    });
  },
  warning(t, e = "Warning", i = {}) {
    Ft({
      status: "warning",
      title: e,
      text: t,
      ...i
    });
  },
  info(t, e = "Info", i = {}) {
    Ft({
      status: "info",
      title: e,
      text: t,
      ...i
    });
  },
  setDefaults(t = {}) {
    Object.assign(Vr, t);
  },
  get allowedStatuses() {
    return [...Hr];
  },
  get allowedPositions() {
    return [...Wr];
  }
}, li = function() {
}, qt = {}, ge = {}, Yt = {};
function xl(t, e) {
  t = Array.isArray(t) ? t : [t];
  const i = [];
  let n = t.length, r = n, s, o, a, l;
  for (s = function(c, u) {
    u.length && i.push(c), r--, r || e(i);
  }; n--; ) {
    if (o = t[n], a = ge[o], a) {
      s(o, a);
      continue;
    }
    l = Yt[o] = Yt[o] || [], l.push(s);
  }
}
function qr(t, e) {
  if (!t) return;
  const i = Yt[t];
  if (ge[t] = e, !!i)
    for (; i.length; )
      i[0](t, e), i.splice(0, 1);
}
function ci(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || li)(e) : (t.success || li)(t);
}
function El(t, e, i, n, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Yr(e, n, r, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(e, l, t.defaultPrevented);
}
function Yr(t, e, i, n) {
  const r = document, s = i.async, o = (i.numRetries || 0) + 1, a = i.before || li, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
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
  const y = function(m) {
    El(m, t, f, e, i, n, o, u);
  };
  f.addEventListener("load", y, { once: !0 }), f.addEventListener("error", y, { once: !0 }), a(t, f) !== !1 && r.head.appendChild(f);
}
function Il(t, e, i) {
  t = Array.isArray(t) ? t : [t];
  let n = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    n--, n || e(r);
  }
  for (let o = 0; o < t.length; o++)
    Yr(t[o], s, i);
}
function nt(t, e, i) {
  let n, r;
  if (e && typeof e == "string" && e.trim && (n = e.trim()), r = (n ? i : e) || {}, n) {
    if (n in qt)
      throw "LoadJS";
    qt[n] = !0;
  }
  function s(o, a) {
    Il(t, function(l) {
      ci(r, l), o && ci({ success: o, error: a }, l), qr(n, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
nt.ready = function(e, i) {
  return xl(e, function(n) {
    ci(i, n);
  }), nt;
};
nt.done = function(e) {
  qr(e, []);
};
nt.reset = function() {
  Object.keys(qt).forEach((e) => delete qt[e]), Object.keys(ge).forEach((e) => delete ge[e]), Object.keys(Yt).forEach((e) => delete Yt[e]);
};
nt.isDefined = function(e) {
  return e in qt;
};
function Tl(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (t instanceof Element) {
    const e = Cl(t) || t;
    let i = Alpine.$data(e);
    if (i === void 0) {
      const n = e.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && dn("element", e), i;
  }
  if (typeof t == "string") {
    const e = t.trim();
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${Jr(e)}"]`;
    let n = null;
    const r = document.getElementById(e);
    if (r && (n = r.matches(i) ? r : r.querySelector(i)), n || (n = Kr(e)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${e}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(n);
    return s === void 0 && dn(`data-alpine-root="${e}"`, n), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Cl(t) {
  if (!(t instanceof Element)) return null;
  const e = t.tagName?.toLowerCase?.() === "rz-proxy", i = t.getAttribute?.("data-for");
  if (e || i) {
    const n = i || "";
    if (!n) return t;
    const r = Kr(n);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return t;
}
function Kr(t) {
  const e = `[data-alpine-root="${Jr(t)}"]`, i = document.querySelectorAll(e);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(t) || null;
}
function Jr(t) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(t);
  } catch {
  }
  return String(t).replace(/"/g, '\\"');
}
function dn(t, e) {
  const i = `${e.tagName?.toLowerCase?.() || "node"}${e.id ? "#" + e.id : ""}${e.classList?.length ? "." + Array.from(e.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${t} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function Sl(t) {
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
function Al(t) {
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
function Ol(t) {
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
function $l(t) {
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
function Nl(t) {
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
function kl(t, e) {
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
function Rl(t) {
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
function Ll(t, e) {
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
function Pl(t, e) {
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
function Dl(t) {
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
function Ml(t, e) {
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
function zl(t, e) {
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
function Fl(t) {
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
const ui = Math.min, xt = Math.max, ve = Math.round, J = (t) => ({
  x: t,
  y: t
}), Ul = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Bl = {
  start: "end",
  end: "start"
};
function fn(t, e, i) {
  return xt(t, ui(e, i));
}
function Ne(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function wt(t) {
  return t.split("-")[0];
}
function ke(t) {
  return t.split("-")[1];
}
function Xr(t) {
  return t === "x" ? "y" : "x";
}
function Zr(t) {
  return t === "y" ? "height" : "width";
}
function gt(t) {
  return ["top", "bottom"].includes(wt(t)) ? "y" : "x";
}
function Gr(t) {
  return Xr(gt(t));
}
function jl(t, e, i) {
  i === void 0 && (i = !1);
  const n = ke(t), r = Gr(t), s = Zr(r);
  let o = r === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = be(o)), [o, be(o)];
}
function Hl(t) {
  const e = be(t);
  return [di(t), e, di(e)];
}
function di(t) {
  return t.replace(/start|end/g, (e) => Bl[e]);
}
function Wl(t, e, i) {
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
function Vl(t, e, i, n) {
  const r = ke(t);
  let s = Wl(wt(t), i === "start", n);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(di)))), s;
}
function be(t) {
  return t.replace(/left|right|bottom|top/g, (e) => Ul[e]);
}
function ql(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Yl(t) {
  return typeof t != "number" ? ql(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function ye(t) {
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
function hn(t, e, i) {
  let {
    reference: n,
    floating: r
  } = t;
  const s = gt(e), o = Gr(e), a = Zr(o), l = wt(e), c = s === "y", u = n.x + n.width / 2 - r.width / 2, d = n.y + n.height / 2 - r.height / 2, f = n[a] / 2 - r[a] / 2;
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
  switch (ke(e)) {
    case "start":
      y[o] -= f * (i && c ? -1 : 1);
      break;
    case "end":
      y[o] += f * (i && c ? -1 : 1);
      break;
  }
  return y;
}
const Kl = async (t, e, i) => {
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
        reference: t,
        floating: e
      }
    });
    u = h ?? u, d = _ ?? d, y = {
      ...y,
      [p]: {
        ...y[p],
        ...E
      }
    }, x && m <= 50 && (m++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (c = x.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
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
async function Qr(t, e) {
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
    padding: y = 0
  } = Ne(e, t), m = Yl(y), p = a[f ? d === "floating" ? "reference" : "floating" : d], b = ye(await s.getClippingRect({
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
  }, x = ye(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
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
const Jl = function(t) {
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
        fallbackStrategy: y = "bestFit",
        fallbackAxisSideDirection: m = "none",
        flipAlignment: v = !0,
        ...p
      } = Ne(t, e);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const b = wt(r), h = gt(a), _ = wt(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), x = f || (_ || !v ? [be(a)] : Hl(a)), g = m !== "none";
      !f && g && x.push(...Vl(a, v, m, E));
      const w = [a, ...x], I = await Qr(e, p), T = [];
      let C = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && T.push(I[b]), d) {
        const z = jl(r, o, E);
        T.push(I[z[0]], I[z[1]]);
      }
      if (C = [...C, {
        placement: r,
        overflows: T
      }], !T.every((z) => z <= 0)) {
        var S, L;
        const z = (((S = s.flip) == null ? void 0 : S.index) || 0) + 1, lt = w[z];
        if (lt) {
          var P;
          const F = d === "alignment" ? h !== gt(lt) : !1, Y = ((P = C[0]) == null ? void 0 : P.overflows[0]) > 0;
          if (!F || Y)
            return {
              data: {
                index: z,
                overflows: C
              },
              reset: {
                placement: lt
              }
            };
        }
        let B = (L = C.filter((F) => F.overflows[0] <= 0).sort((F, Y) => F.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : L.placement;
        if (!B)
          switch (y) {
            case "bestFit": {
              var q;
              const F = (q = C.filter((Y) => {
                if (g) {
                  const tt = gt(Y.placement);
                  return tt === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  tt === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((tt) => tt > 0).reduce((tt, cs) => tt + cs, 0)]).sort((Y, tt) => Y[1] - tt[1])[0]) == null ? void 0 : q[0];
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
async function Xl(t, e) {
  const {
    placement: i,
    platform: n,
    elements: r
  } = t, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), o = wt(i), a = ke(i), l = gt(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Ne(e, t);
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
const Zl = function(t) {
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
      } = e, l = await Xl(e, t);
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
}, Gl = function(t) {
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
      } = Ne(t, e), c = {
        x: i,
        y: n
      }, u = await Qr(e, l), d = gt(wt(r)), f = Xr(d);
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
        ...e,
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
function Re() {
  return typeof window < "u";
}
function kt(t) {
  return ts(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function M(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Q(t) {
  var e;
  return (e = (ts(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function ts(t) {
  return Re() ? t instanceof Node || t instanceof M(t).Node : !1;
}
function H(t) {
  return Re() ? t instanceof Element || t instanceof M(t).Element : !1;
}
function X(t) {
  return Re() ? t instanceof HTMLElement || t instanceof M(t).HTMLElement : !1;
}
function pn(t) {
  return !Re() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof M(t).ShadowRoot;
}
function Zt(t) {
  const {
    overflow: e,
    overflowX: i,
    overflowY: n,
    display: r
  } = W(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + n + i) && !["inline", "contents"].includes(r);
}
function Ql(t) {
  return ["table", "td", "th"].includes(kt(t));
}
function Le(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function Li(t) {
  const e = Pi(), i = H(t) ? W(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !e && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !e && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function tc(t) {
  let e = ot(t);
  for (; X(e) && !Tt(e); ) {
    if (Li(e))
      return e;
    if (Le(e))
      return null;
    e = ot(e);
  }
  return null;
}
function Pi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Tt(t) {
  return ["html", "body", "#document"].includes(kt(t));
}
function W(t) {
  return M(t).getComputedStyle(t);
}
function Pe(t) {
  return H(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function ot(t) {
  if (kt(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    pn(t) && t.host || // Fallback.
    Q(t)
  );
  return pn(e) ? e.host : e;
}
function es(t) {
  const e = ot(t);
  return Tt(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : X(e) && Zt(e) ? e : es(e);
}
function is(t, e, i) {
  var n;
  e === void 0 && (e = []);
  const r = es(t), s = r === ((n = t.ownerDocument) == null ? void 0 : n.body), o = M(r);
  return s ? (fi(o), e.concat(o, o.visualViewport || [], Zt(r) ? r : [], [])) : e.concat(r, is(r, []));
}
function fi(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function ns(t) {
  const e = W(t);
  let i = parseFloat(e.width) || 0, n = parseFloat(e.height) || 0;
  const r = X(t), s = r ? t.offsetWidth : i, o = r ? t.offsetHeight : n, a = ve(i) !== s || ve(n) !== o;
  return a && (i = s, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function rs(t) {
  return H(t) ? t : t.contextElement;
}
function Et(t) {
  const e = rs(t);
  if (!X(e))
    return J(1);
  const i = e.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = ns(e);
  let o = (s ? ve(i.width) : i.width) / n, a = (s ? ve(i.height) : i.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const ec = /* @__PURE__ */ J(0);
function ss(t) {
  const e = M(t);
  return !Pi() || !e.visualViewport ? ec : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function ic(t, e, i) {
  return e === void 0 && (e = !1), !i || e && i !== M(t) ? !1 : e;
}
function Kt(t, e, i, n) {
  e === void 0 && (e = !1), i === void 0 && (i = !1);
  const r = t.getBoundingClientRect(), s = rs(t);
  let o = J(1);
  e && (n ? H(n) && (o = Et(n)) : o = Et(t));
  const a = ic(s, i, n) ? ss(s) : J(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), y = n && H(n) ? M(n) : n;
    let m = f, v = fi(m);
    for (; v && n && y !== m; ) {
      const p = Et(v), b = v.getBoundingClientRect(), h = W(v), _ = b.left + (v.clientLeft + parseFloat(h.paddingLeft)) * p.x, E = b.top + (v.clientTop + parseFloat(h.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += _, c += E, m = M(v), v = fi(m);
    }
  }
  return ye({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Di(t, e) {
  const i = Pe(t).scrollLeft;
  return e ? e.left + i : Kt(Q(t)).left + i;
}
function os(t, e, i) {
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
function nc(t) {
  let {
    elements: e,
    rect: i,
    offsetParent: n,
    strategy: r
  } = t;
  const s = r === "fixed", o = Q(n), a = e ? Le(e.floating) : !1;
  if (n === o || a && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = J(1);
  const u = J(0), d = X(n);
  if ((d || !d && !s) && ((kt(n) !== "body" || Zt(o)) && (l = Pe(n)), X(n))) {
    const y = Kt(n);
    c = Et(n), u.x = y.x + n.clientLeft, u.y = y.y + n.clientTop;
  }
  const f = o && !d && !s ? os(o, l, !0) : J(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function rc(t) {
  return Array.from(t.getClientRects());
}
function sc(t) {
  const e = Q(t), i = Pe(t), n = t.ownerDocument.body, r = xt(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), s = xt(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Di(t);
  const a = -i.scrollTop;
  return W(n).direction === "rtl" && (o += xt(e.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function oc(t, e) {
  const i = M(t), n = Q(t), r = i.visualViewport;
  let s = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Pi();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function ac(t, e) {
  const i = Kt(t, !0, e === "fixed"), n = i.top + t.clientTop, r = i.left + t.clientLeft, s = X(t) ? Et(t) : J(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = n * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function mn(t, e, i) {
  let n;
  if (e === "viewport")
    n = oc(t, i);
  else if (e === "document")
    n = sc(Q(t));
  else if (H(e))
    n = ac(e, i);
  else {
    const r = ss(t);
    n = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return ye(n);
}
function as(t, e) {
  const i = ot(t);
  return i === e || !H(i) || Tt(i) ? !1 : W(i).position === "fixed" || as(i, e);
}
function lc(t, e) {
  const i = e.get(t);
  if (i)
    return i;
  let n = is(t, []).filter((a) => H(a) && kt(a) !== "body"), r = null;
  const s = W(t).position === "fixed";
  let o = s ? ot(t) : t;
  for (; H(o) && !Tt(o); ) {
    const a = W(o), l = Li(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Zt(o) && !l && as(t, o)) ? n = n.filter((u) => u !== o) : r = a, o = ot(o);
  }
  return e.set(t, n), n;
}
function cc(t) {
  let {
    element: e,
    boundary: i,
    rootBoundary: n,
    strategy: r
  } = t;
  const o = [...i === "clippingAncestors" ? Le(e) ? [] : lc(e, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = mn(e, u, r);
    return c.top = xt(d.top, c.top), c.right = ui(d.right, c.right), c.bottom = ui(d.bottom, c.bottom), c.left = xt(d.left, c.left), c;
  }, mn(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function uc(t) {
  const {
    width: e,
    height: i
  } = ns(t);
  return {
    width: e,
    height: i
  };
}
function dc(t, e, i) {
  const n = X(e), r = Q(e), s = i === "fixed", o = Kt(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = J(0);
  function c() {
    l.x = Di(r);
  }
  if (n || !n && !s)
    if ((kt(e) !== "body" || Zt(r)) && (a = Pe(e)), n) {
      const y = Kt(e, !0, s, e);
      l.x = y.x + e.clientLeft, l.y = y.y + e.clientTop;
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
function je(t) {
  return W(t).position === "static";
}
function gn(t, e) {
  if (!X(t) || W(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let i = t.offsetParent;
  return Q(t) === i && (i = i.ownerDocument.body), i;
}
function ls(t, e) {
  const i = M(t);
  if (Le(t))
    return i;
  if (!X(t)) {
    let r = ot(t);
    for (; r && !Tt(r); ) {
      if (H(r) && !je(r))
        return r;
      r = ot(r);
    }
    return i;
  }
  let n = gn(t, e);
  for (; n && Ql(n) && je(n); )
    n = gn(n, e);
  return n && Tt(n) && je(n) && !Li(n) ? i : n || tc(t) || i;
}
const fc = async function(t) {
  const e = this.getOffsetParent || ls, i = this.getDimensions, n = await i(t.floating);
  return {
    reference: dc(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function hc(t) {
  return W(t).direction === "rtl";
}
const pc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: nc,
  getDocumentElement: Q,
  getClippingRect: cc,
  getOffsetParent: ls,
  getElementRects: fc,
  getClientRects: rc,
  getDimensions: uc,
  getScale: Et,
  isElement: H,
  isRTL: hc
}, we = Zl, _e = Gl, xe = Jl, Ee = (t, e, i) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: pc,
    ...i
  }, s = {
    ...r.platform,
    _c: n
  };
  return Kl(t, e, {
    ...r,
    platform: s
  });
};
function mc(t) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), Ee(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [we(this.pixelOffset), xe(), _e({ padding: 8 })]
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
      !this.triggerEl || !e || Ee(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [we(this.pixelOffset), xe(), _e({ padding: 8 })]
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
function gc(t) {
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
function vc(t) {
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
function bc(t) {
  t.data("rzEmpty", () => {
  });
}
function yc(t) {
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
function wc(t) {
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
function _c(t) {
  t.data("rzInputGroupAddon", () => ({
    handleClick(e) {
      if (e.target.closest("button"))
        return;
      const i = this.$el.parentElement;
      i && i.querySelector("input, textarea")?.focus();
    }
  }));
}
function xc(t, e) {
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
function Ec(t, e) {
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
      !o || !a || (Ee(o, a, {
        placement: "bottom-start",
        middleware: [we(6), xe(), _e({ padding: 8 })]
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
function Ic(t) {
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
      c.push(we({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: r
      })), o && c.push(xe()), a && c.push(_e({ padding: l })), Ee(this.triggerEl, this.contentEl, {
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
function Tc(t) {
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
function Cc(t) {
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
function Sc(t) {
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
function Ac(t) {
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
function Oc(t) {
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
function $c(t) {
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
function Nc(t) {
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
function kc(t) {
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
      const d = /[\\/_+.#"@[\(\{&]/, f = /[\s-]/, y = `${e} ${n ? n.join(" ") : ""}`;
      function m(p) {
        return p.toLowerCase().replace(/[\s-]/g, " ");
      }
      function v(p, b, h, _, E, x, g) {
        if (x === b.length)
          return E === p.length ? 1 : 0.99;
        const w = `${E},${x}`;
        if (g[w] !== void 0) return g[w];
        const I = _.charAt(x);
        let T = h.indexOf(I, E), C = 0;
        for (; T >= 0; ) {
          let S = v(p, b, h, _, T + 1, x + 1, g);
          S > C && (T === E ? S *= 1 : d.test(p.charAt(T - 1)) ? S *= 0.8 : f.test(p.charAt(T - 1)) ? S *= 0.9 : (S *= 0.17, E > 0 && (S *= Math.pow(0.999, T - E))), p.charAt(T) !== b.charAt(x) && (S *= 0.9999)), S > C && (C = S), T = h.indexOf(I, T + 1);
        }
        return g[w] = C, C;
      }
      return v(y, i, m(y), m(i), 0, 0, {});
    }
  }));
}
function Rc(t) {
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
function Lc(t) {
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
function Pc(t) {
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
async function Dc(t) {
  t = [...t].sort();
  const e = t.join("|"), n = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ut(t, e, i) {
  let n, r;
  typeof e == "function" ? n = { success: e } : e && typeof e == "object" ? n = e : typeof e == "string" && (r = e), !r && typeof i == "string" && (r = i);
  const s = Array.isArray(t) ? t : [t];
  return Dc(s).then((o) => (nt.isDefined(o) || nt(s, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: r,
    inlineStyleNonce: r
  }), new Promise((a, l) => {
    nt.ready(o, {
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
function Mc(t) {
  Sl(t), Al(t), Ol(t), $l(t), Nl(t), kl(t, ut), Rl(t), Ll(t, ut), Pl(t, ut), Dl(t), Ml(t, ut), zl(t, ut), Fl(t), mc(t), gc(t), vc(t), bc(t), yc(t), wc(t), _c(t), xc(t, ut), Ec(t), Ic(t), Tc(t), Cc(t), Sc(t), Ac(t), Oc(t), $c(t), Nc(t), kc(t), Rc(t), Lc(t), Pc(t);
}
function zc(t) {
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
const se = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map();
let vn = !1;
function Fc(t) {
  return oe.has(t) || oe.set(
    t,
    import(t).catch((e) => {
      throw oe.delete(t), e;
    })
  ), oe.get(t);
}
function bn(t, e) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    t,
    () => Fc(e).catch((n) => (console.error(
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
function Uc(t, e) {
  if (!t || !e) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = se.get(t);
  i && i.path !== e && console.warn(
    `[RizzyUI] Re-registering '${t}' with a different path.
  Previous: ${i.path}
  New:      ${e}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const r = !i || i.path !== e;
    if (!(i && i.loaderSet && !r)) {
      const o = bn(t, e);
      se.set(t, { path: e, loaderSet: o });
    }
    return;
  }
  se.set(t, { path: e, loaderSet: !1 }), vn || (vn = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of se)
        if (!s.loaderSet) {
          const o = bn(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Bc(t) {
  t.directive("mobile", (e, { modifiers: i, expression: n }, { cleanup: r }) => {
    const s = i.find((b) => b.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      e.dataset.mobile = "false", e.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (b) => {
      e.dataset.mobile = b ? "true" : "false", e.dataset.screen = b ? "mobile" : "desktop";
    }, u = () => typeof t.$data == "function" ? t.$data(e) : e.__x ? e.__x.$data : null, d = (b) => {
      if (!a) return;
      const h = u();
      h && (h[n] = b);
    }, f = (b) => {
      e.dispatchEvent(
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
function jc(t) {
  const e = (i, { expression: n, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (v, p, b) => {
      const _ = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = _.pop();
      let x = v;
      for (const g of _)
        (x[g] == null || typeof x[g] != "object") && (x[g] = isFinite(+g) ? [] : {}), x = x[g];
      x[E] = b;
    }, l = t.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
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
        const E = t.evaluate(i, v.childPath, { scope: c });
        b.fromChild = !0, a(u, v.parentPath, E), queueMicrotask(() => {
          b.fromChild = !1;
        });
      } else {
        const E = t.evaluate(i, v.parentPath, { scope: u });
        b.fromParent = !0, a(c, v.childPath, E), queueMicrotask(() => {
          b.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = t.evaluate(i, v.parentPath, { scope: u });
        b.fromChild || (b.fromParent = !0, a(c, v.childPath, E), queueMicrotask(() => {
          b.fromParent = !1;
        }));
      }), _ = o(() => {
        const E = t.evaluate(i, v.childPath, { scope: c });
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
  t.directive("syncprop", e);
}
class Hc {
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
const D = new Hc();
function Wc(t) {
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
let Ut = null;
function Vc(t) {
  return Ut || (t.plugin(Sa), t.plugin(ka), t.plugin(Qa), t.plugin(ll), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Wc(t);
  }), Mc(t), Bc(t), jc(t), Ut = {
    Alpine: t,
    require: ut,
    toast: _l,
    $data: Tl,
    props: zc,
    registerAsyncComponent: Uc,
    theme: D
  }, typeof window < "u" && (D.init(), window.Alpine = t, window.Rizzy = { ...window.Rizzy || {}, ...Ut }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Ut);
}
const Kc = Vc(Nr);
Nr.start();
export {
  Kc as default
};
