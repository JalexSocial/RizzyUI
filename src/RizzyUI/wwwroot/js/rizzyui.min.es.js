var We = !1, je = !1, dt = [], Ue = -1;
function ds(e) {
  fs(e);
}
function fs(e) {
  dt.includes(e) || dt.push(e), ps();
}
function hs(e) {
  let t = dt.indexOf(e);
  t !== -1 && t > Ue && dt.splice(t, 1);
}
function ps() {
  !je && !We && (We = !0, queueMicrotask(ms));
}
function ms() {
  We = !1, je = !0;
  for (let e = 0; e < dt.length; e++)
    dt[e](), Ue = e;
  dt.length = 0, Ue = -1, je = !1;
}
var Dt, Tt, kt, En, Ye = !0;
function gs(e) {
  Ye = !1, e(), Ye = !0;
}
function bs(e) {
  Dt = e.reactive, kt = e.release, Tt = (t) => e.effect(t, { scheduler: (i) => {
    Ye ? ds(i) : i();
  } }), En = e.raw;
}
function Hi(e) {
  Tt = e;
}
function vs(e) {
  let t = () => {
  };
  return [(n) => {
    let r = Tt(n);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), kt(r));
    }, r;
  }, () => {
    t();
  }];
}
function In(e, t) {
  let i = !0, n, r = Tt(() => {
    let s = e();
    JSON.stringify(s), i ? n = s : queueMicrotask(() => {
      t(s, n), n = s;
    }), i = !1;
  });
  return () => kt(r);
}
var Tn = [], Sn = [], Cn = [];
function ys(e) {
  Cn.push(e);
}
function mi(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Sn.push(t));
}
function $n(e) {
  Tn.push(e);
}
function An(e, t, i) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(i);
}
function On(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([i, n]) => {
    (t === void 0 || t.includes(i)) && (n.forEach((r) => r()), delete e._x_attributeCleanups[i]);
  });
}
function ws(e) {
  for (e._x_effects?.forEach(hs); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var gi = new MutationObserver(wi), bi = !1;
function vi() {
  gi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), bi = !0;
}
function Dn() {
  xs(), gi.disconnect(), bi = !1;
}
var Pt = [];
function xs() {
  let e = gi.takeRecords();
  Pt.push(() => e.length > 0 && wi(e));
  let t = Pt.length;
  queueMicrotask(() => {
    if (Pt.length === t)
      for (; Pt.length > 0; )
        Pt.shift()();
  });
}
function O(e) {
  if (!bi)
    return e();
  Dn();
  let t = e();
  return vi(), t;
}
var yi = !1, be = [];
function _s() {
  yi = !0;
}
function Es() {
  yi = !1, wi(be), be = [];
}
function wi(e) {
  if (yi) {
    be = be.concat(e);
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
    On(o, s);
  }), n.forEach((s, o) => {
    Tn.forEach((a) => a(o, s));
  });
  for (let s of i)
    t.some((o) => o.contains(s)) || Sn.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && Cn.forEach((o) => o(s));
  t = null, i = null, n = null, r = null;
}
function kn(e) {
  return Qt(Ct(e));
}
function Zt(e, t, i) {
  return e._x_dataStack = [t, ...Ct(i || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
  };
}
function Ct(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? Ct(e.host) : e.parentNode ? Ct(e.parentNode) : [];
}
function Qt(e) {
  return new Proxy({ objects: e }, Is);
}
var Is = {
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
    return t == "toJSON" ? Ts : Reflect.get(
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
function Ts() {
  return Reflect.ownKeys(this).reduce((t, i) => (t[i] = Reflect.get(this, i), t), {});
}
function Nn(e) {
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
function Ln(e, t = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, r, s) {
      return e(this.initialValue, () => Ss(n, r), (o) => Ke(n, r, o), r, s);
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
function Ss(e, t) {
  return t.split(".").reduce((i, n) => i[n], e);
}
function Ke(e, t, i) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = i;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Ke(e[t[0]], t.slice(1), i);
  }
}
var Rn = {};
function U(e, t) {
  Rn[e] = t;
}
function Je(e, t) {
  let i = Cs(t);
  return Object.entries(Rn).forEach(([n, r]) => {
    Object.defineProperty(e, `$${n}`, {
      get() {
        return r(t, i);
      },
      enumerable: !1
    });
  }), e;
}
function Cs(e) {
  let [t, i] = Vn(e), n = { interceptor: Ln, ...t };
  return mi(e, i), n;
}
function $s(e, t, i, ...n) {
  try {
    return i(...n);
  } catch (r) {
    Kt(r, e, t);
  }
}
function Kt(e, t, i = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: i }
  ), console.warn(`Alpine Expression Error: ${e.message}

${i ? 'Expression: "' + i + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var pe = !0;
function Mn(e) {
  let t = pe;
  pe = !1;
  let i = e();
  return pe = t, i;
}
function ft(e, t, i = {}) {
  let n;
  return P(e, t)((r) => n = r, i), n;
}
function P(...e) {
  return Pn(...e);
}
var Pn = zn;
function As(e) {
  Pn = e;
}
function zn(e, t) {
  let i = {};
  Je(i, e);
  let n = [i, ...Ct(e)], r = typeof t == "function" ? Os(n, t) : ks(n, t, e);
  return $s.bind(null, e, t, r);
}
function Os(e, t) {
  return (i = () => {
  }, { scope: n = {}, params: r = [], context: s } = {}) => {
    let o = t.apply(Qt([n, ...e]), r);
    ve(i, o);
  };
}
var Pe = {};
function Ds(e, t) {
  if (Pe[e])
    return Pe[e];
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
      return Kt(o, t, e), Promise.resolve();
    }
  })();
  return Pe[e] = s, s;
}
function ks(e, t, i) {
  let n = Ds(t, i);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = Qt([s, ...e]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => Kt(u, i, t));
      n.finished ? (ve(r, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        ve(r, u, l, o, i);
      }).catch((u) => Kt(u, i, t)).finally(() => n.result = void 0);
    }
  };
}
function ve(e, t, i, n, r) {
  if (pe && typeof t == "function") {
    let s = t.apply(i, n);
    s instanceof Promise ? s.then((o) => ve(e, o, i, n)).catch((o) => Kt(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var xi = "x-";
function Nt(e = "") {
  return xi + e;
}
function Ns(e) {
  xi = e;
}
var ye = {};
function D(e, t) {
  return ye[e] = t, {
    before(i) {
      if (!ye[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const n = ut.indexOf(i);
      ut.splice(n >= 0 ? n : ut.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Ls(e) {
  return Object.keys(ye).includes(e);
}
function _i(e, t, i) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Fn(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let n = {};
  return t.map(Wn((s, o) => n[s] = o)).filter(Un).map(Ps(n, i)).sort(zs).map((s) => Ms(e, s));
}
function Fn(e) {
  return Array.from(e).map(Wn()).filter((t) => !Un(t));
}
var Xe = !1, jt = /* @__PURE__ */ new Map(), Bn = Symbol();
function Rs(e) {
  Xe = !0;
  let t = Symbol();
  Bn = t, jt.set(t, []);
  let i = () => {
    for (; jt.get(t).length; )
      jt.get(t).shift()();
    jt.delete(t);
  }, n = () => {
    Xe = !1, i();
  };
  e(i), n();
}
function Vn(e) {
  let t = [], i = (a) => t.push(a), [n, r] = vs(e);
  return t.push(r), [{
    Alpine: te,
    effect: n,
    cleanup: i,
    evaluateLater: P.bind(P, e),
    evaluate: ft.bind(ft, e)
  }, () => t.forEach((a) => a())];
}
function Ms(e, t) {
  let i = () => {
  }, n = ye[t.type] || i, [r, s] = Vn(e);
  An(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, r), n = n.bind(n, e, t, r), Xe ? jt.get(Bn).push(n) : n());
  };
  return o.runCleanups = s, o;
}
var Hn = (e, t) => ({ name: i, value: n }) => (i.startsWith(e) && (i = i.replace(e, t)), { name: i, value: n }), qn = (e) => e;
function Wn(e = () => {
}) {
  return ({ name: t, value: i }) => {
    let { name: n, value: r } = jn.reduce((s, o) => o(s), { name: t, value: i });
    return n !== t && e(n, t), { name: n, value: r };
  };
}
var jn = [];
function Ei(e) {
  jn.push(e);
}
function Un({ name: e }) {
  return Yn().test(e);
}
var Yn = () => new RegExp(`^${xi}([^:^.]+)\\b`);
function Ps(e, t) {
  return ({ name: i, value: n }) => {
    let r = i.match(Yn()), s = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[i] || i;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: n,
      original: a
    };
  };
}
var Ge = "DEFAULT", ut = [
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
  Ge,
  "teleport"
];
function zs(e, t) {
  let i = ut.indexOf(e.type) === -1 ? Ge : e.type, n = ut.indexOf(t.type) === -1 ? Ge : t.type;
  return ut.indexOf(i) - ut.indexOf(n);
}
function Ut(e, t, i = {}) {
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
function bt(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((r) => bt(r, t));
    return;
  }
  let i = !1;
  if (t(e, () => i = !0), i)
    return;
  let n = e.firstElementChild;
  for (; n; )
    bt(n, t), n = n.nextElementSibling;
}
function V(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var qi = !1;
function Fs() {
  qi && V("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), qi = !0, document.body || V("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Ut(document, "alpine:init"), Ut(document, "alpine:initializing"), vi(), ys((t) => Z(t, bt)), mi((t) => Rt(t)), $n((t, i) => {
    _i(t, i).forEach((n) => n());
  });
  let e = (t) => !Ce(t.parentElement, !0);
  Array.from(document.querySelectorAll(Xn().join(","))).filter(e).forEach((t) => {
    Z(t);
  }), Ut(document, "alpine:initialized"), setTimeout(() => {
    qs();
  });
}
var Ii = [], Kn = [];
function Jn() {
  return Ii.map((e) => e());
}
function Xn() {
  return Ii.concat(Kn).map((e) => e());
}
function Gn(e) {
  Ii.push(e);
}
function Zn(e) {
  Kn.push(e);
}
function Ce(e, t = !1) {
  return Lt(e, (i) => {
    if ((t ? Xn() : Jn()).some((r) => i.matches(r)))
      return !0;
  });
}
function Lt(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return Lt(e.parentElement, t);
  }
}
function Bs(e) {
  return Jn().some((t) => e.matches(t));
}
var Qn = [];
function Vs(e) {
  Qn.push(e);
}
var Hs = 1;
function Z(e, t = bt, i = () => {
}) {
  Lt(e, (n) => n._x_ignore) || Rs(() => {
    t(e, (n, r) => {
      n._x_marker || (i(n, r), Qn.forEach((s) => s(n, r)), _i(n, n.attributes).forEach((s) => s()), n._x_ignore || (n._x_marker = Hs++), n._x_ignore && r());
    });
  });
}
function Rt(e, t = bt) {
  t(e, (i) => {
    ws(i), On(i), delete i._x_marker;
  });
}
function qs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, i, n]) => {
    Ls(i) || n.some((r) => {
      if (document.querySelector(r))
        return V(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Ze = [], Ti = !1;
function Si(e = () => {
}) {
  return queueMicrotask(() => {
    Ti || setTimeout(() => {
      Qe();
    });
  }), new Promise((t) => {
    Ze.push(() => {
      e(), t();
    });
  });
}
function Qe() {
  for (Ti = !1; Ze.length; )
    Ze.shift()();
}
function Ws() {
  Ti = !0;
}
function Ci(e, t) {
  return Array.isArray(t) ? Wi(e, t.join(" ")) : typeof t == "object" && t !== null ? js(e, t) : typeof t == "function" ? Ci(e, t()) : Wi(e, t);
}
function Wi(e, t) {
  let i = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), n = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", n(i(t));
}
function js(e, t) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(t).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function $e(e, t) {
  return typeof t == "object" && t !== null ? Us(e, t) : Ys(e, t);
}
function Us(e, t) {
  let i = {};
  return Object.entries(t).forEach(([n, r]) => {
    i[n] = e.style[n], n.startsWith("--") || (n = Ks(n)), e.style.setProperty(n, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    $e(e, i);
  };
}
function Ys(e, t) {
  let i = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", i || "");
  };
}
function Ks(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ti(e, t = () => {
}) {
  let i = !1;
  return function() {
    i ? t.apply(this, arguments) : (i = !0, e.apply(this, arguments));
  };
}
D("transition", (e, { value: t, modifiers: i, expression: n }, { evaluate: r }) => {
  typeof n == "function" && (n = r(n)), n !== !1 && (!n || typeof n == "boolean" ? Xs(e, i, t) : Js(e, n, t));
});
function Js(e, t, i) {
  tr(e, Ci, ""), {
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
function Xs(e, t, i) {
  tr(e, $e);
  let n = !t.includes("in") && !t.includes("out") && !i, r = n || t.includes("in") || ["enter"].includes(i), s = n || t.includes("out") || ["leave"].includes(i);
  t.includes("in") && !n && (t = t.filter((g, h) => h < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((g, h) => h > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? zt(t, "scale", 95) / 100 : 1, d = zt(t, "delay", 0) / 1e3, f = zt(t, "origin", "center"), p = "opacity, transform", y = zt(t, "duration", 150) / 1e3, w = zt(t, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: p,
    transitionDuration: `${y}s`,
    transitionTimingFunction: m
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: p,
    transitionDuration: `${w}s`,
    transitionTimingFunction: m
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function tr(e, t, i = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, r = () => {
    }) {
      ei(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, r);
    },
    out(n = () => {
    }, r = () => {
    }) {
      ei(e, t, {
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
    let o = er(e);
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
function er(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : er(t);
}
function ei(e, t, { during: i, start: n, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Gs(e, {
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
function Gs(e, t) {
  let i, n, r, s = ti(() => {
    O(() => {
      i = !0, n || t.before(), r || (t.end(), Qe()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: ti(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, O(() => {
    t.start(), t.during();
  }), Ws(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), O(() => {
      t.before();
    }), n = !0, requestAnimationFrame(() => {
      i || (O(() => {
        t.end();
      }), Qe(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function zt(e, t, i) {
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
var st = !1;
function lt(e, t = () => {
}) {
  return (...i) => st ? t(...i) : e(...i);
}
function Zs(e) {
  return (...t) => st && e(...t);
}
var ir = [];
function Ae(e) {
  ir.push(e);
}
function Qs(e, t) {
  ir.forEach((i) => i(e, t)), st = !0, nr(() => {
    Z(t, (i, n) => {
      n(i, () => {
      });
    });
  }), st = !1;
}
var ii = !1;
function to(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), st = !0, ii = !0, nr(() => {
    eo(t);
  }), st = !1, ii = !1;
}
function eo(e) {
  let t = !1;
  Z(e, (n, r) => {
    bt(n, (s, o) => {
      if (t && Bs(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function nr(e) {
  let t = Tt;
  Hi((i, n) => {
    let r = t(i);
    return kt(r), () => {
    };
  }), e(), Hi(t);
}
function rr(e, t, i, n = []) {
  switch (e._x_bindings || (e._x_bindings = Dt({})), e._x_bindings[t] = i, t = n.includes("camel") ? co(t) : t, t) {
    case "value":
      io(e, i);
      break;
    case "style":
      ro(e, i);
      break;
    case "class":
      no(e, i);
      break;
    case "selected":
    case "checked":
      so(e, t, i);
      break;
    default:
      sr(e, t, i);
      break;
  }
}
function io(e, t) {
  if (lr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = me(e.value) === t : e.checked = ji(e.value, t));
  else if ($i(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((i) => ji(i, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    lo(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function no(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Ci(e, t);
}
function ro(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = $e(e, t);
}
function so(e, t, i) {
  sr(e, t, i), ao(e, t, i);
}
function sr(e, t, i) {
  [null, void 0, !1].includes(i) && fo(t) ? e.removeAttribute(t) : (or(t) && (i = t), oo(e, t, i));
}
function oo(e, t, i) {
  e.getAttribute(t) != i && e.setAttribute(t, i);
}
function ao(e, t, i) {
  e[t] !== i && (e[t] = i);
}
function lo(e, t) {
  const i = [].concat(t).map((n) => n + "");
  Array.from(e.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function co(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function ji(e, t) {
  return e == t;
}
function me(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var uo = /* @__PURE__ */ new Set([
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
function or(e) {
  return uo.has(e);
}
function fo(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function ho(e, t, i) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ar(e, t, i);
}
function po(e, t, i, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = n, Mn(() => ft(e, r.expression));
  }
  return ar(e, t, i);
}
function ar(e, t, i) {
  let n = e.getAttribute(t);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : or(t) ? !![t, "true"].includes(n) : n;
}
function $i(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function lr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function cr(e, t) {
  let i;
  return function() {
    const n = this, r = arguments, s = function() {
      i = null, e.apply(n, r);
    };
    clearTimeout(i), i = setTimeout(s, t);
  };
}
function ur(e, t) {
  let i;
  return function() {
    let n = this, r = arguments;
    i || (e.apply(n, r), i = !0, setTimeout(() => i = !1, t));
  };
}
function dr({ get: e, set: t }, { get: i, set: n }) {
  let r = !0, s, o = Tt(() => {
    let a = e(), l = i();
    if (r)
      n(ze(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? n(ze(a)) : c !== u && t(ze(l));
    }
    s = JSON.stringify(e()), JSON.stringify(i());
  });
  return () => {
    kt(o);
  };
}
function ze(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function mo(e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => i(te));
}
var ct = {}, Ui = !1;
function go(e, t) {
  if (Ui || (ct = Dt(ct), Ui = !0), t === void 0)
    return ct[e];
  ct[e] = t, Nn(ct[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ct[e].init();
}
function bo() {
  return ct;
}
var fr = {};
function vo(e, t) {
  let i = typeof t != "function" ? () => t : t;
  return e instanceof Element ? hr(e, i()) : (fr[e] = i, () => {
  });
}
function yo(e) {
  return Object.entries(fr).forEach(([t, i]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), e;
}
function hr(e, t, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Fn(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), _i(e, r, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var pr = {};
function wo(e, t) {
  pr[e] = t;
}
function xo(e, t) {
  return Object.entries(pr).forEach(([i, n]) => {
    Object.defineProperty(e, i, {
      get() {
        return (...r) => n.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var _o = {
  get reactive() {
    return Dt;
  },
  get release() {
    return kt;
  },
  get effect() {
    return Tt;
  },
  get raw() {
    return En;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: Es,
  dontAutoEvaluateFunctions: Mn,
  disableEffectScheduling: gs,
  startObservingMutations: vi,
  stopObservingMutations: Dn,
  setReactivityEngine: bs,
  onAttributeRemoved: An,
  onAttributesAdded: $n,
  closestDataStack: Ct,
  skipDuringClone: lt,
  onlyDuringClone: Zs,
  addRootSelector: Gn,
  addInitSelector: Zn,
  interceptClone: Ae,
  addScopeToNode: Zt,
  deferMutations: _s,
  mapAttributes: Ei,
  evaluateLater: P,
  interceptInit: Vs,
  setEvaluator: As,
  mergeProxies: Qt,
  extractProp: po,
  findClosest: Lt,
  onElRemoved: mi,
  closestRoot: Ce,
  destroyTree: Rt,
  interceptor: Ln,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ei,
  // INTERNAL
  setStyles: $e,
  // INTERNAL
  mutateDom: O,
  directive: D,
  entangle: dr,
  throttle: ur,
  debounce: cr,
  evaluate: ft,
  initTree: Z,
  nextTick: Si,
  prefixed: Nt,
  prefix: Ns,
  plugin: mo,
  magic: U,
  store: go,
  start: Fs,
  clone: to,
  // INTERNAL
  cloneNode: Qs,
  // INTERNAL
  bound: ho,
  $data: kn,
  watch: In,
  walk: bt,
  data: wo,
  bind: vo
}, te = _o;
function Eo(e, t) {
  const i = /* @__PURE__ */ Object.create(null), n = e.split(",");
  for (let r = 0; r < n.length; r++)
    i[n[r]] = !0;
  return (r) => !!i[r];
}
var Io = Object.freeze({}), To = Object.prototype.hasOwnProperty, Oe = (e, t) => To.call(e, t), ht = Array.isArray, Yt = (e) => mr(e) === "[object Map]", So = (e) => typeof e == "string", Ai = (e) => typeof e == "symbol", De = (e) => e !== null && typeof e == "object", Co = Object.prototype.toString, mr = (e) => Co.call(e), gr = (e) => mr(e).slice(8, -1), Oi = (e) => So(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, $o = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (i) => t[i] || (t[i] = e(i));
}, Ao = $o((e) => e.charAt(0).toUpperCase() + e.slice(1)), br = (e, t) => e !== t && (e === e || t === t), ni = /* @__PURE__ */ new WeakMap(), Ft = [], K, pt = Symbol("iterate"), ri = Symbol("Map key iterate");
function Oo(e) {
  return e && e._isEffect === !0;
}
function Do(e, t = Io) {
  Oo(e) && (e = e.raw);
  const i = Lo(e, t);
  return t.lazy || i(), i;
}
function ko(e) {
  e.active && (vr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var No = 0;
function Lo(e, t) {
  const i = function() {
    if (!i.active)
      return e();
    if (!Ft.includes(i)) {
      vr(i);
      try {
        return Mo(), Ft.push(i), K = i, e();
      } finally {
        Ft.pop(), yr(), K = Ft[Ft.length - 1];
      }
    }
  };
  return i.id = No++, i.allowRecurse = !!t.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = e, i.deps = [], i.options = t, i;
}
function vr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let i = 0; i < t.length; i++)
      t[i].delete(e);
    t.length = 0;
  }
}
var $t = !0, Di = [];
function Ro() {
  Di.push($t), $t = !1;
}
function Mo() {
  Di.push($t), $t = !0;
}
function yr() {
  const e = Di.pop();
  $t = e === void 0 ? !0 : e;
}
function q(e, t, i) {
  if (!$t || K === void 0)
    return;
  let n = ni.get(e);
  n || ni.set(e, n = /* @__PURE__ */ new Map());
  let r = n.get(i);
  r || n.set(i, r = /* @__PURE__ */ new Set()), r.has(K) || (r.add(K), K.deps.push(r), K.options.onTrack && K.options.onTrack({
    effect: K,
    target: e,
    type: t,
    key: i
  }));
}
function ot(e, t, i, n, r, s) {
  const o = ni.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== K || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (i === "length" && ht(e))
    o.forEach((u, d) => {
      (d === "length" || d >= n) && l(u);
    });
  else
    switch (i !== void 0 && l(o.get(i)), t) {
      case "add":
        ht(e) ? Oi(i) && l(o.get("length")) : (l(o.get(pt)), Yt(e) && l(o.get(ri)));
        break;
      case "delete":
        ht(e) || (l(o.get(pt)), Yt(e) && l(o.get(ri)));
        break;
      case "set":
        Yt(e) && l(o.get(pt));
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
var Po = /* @__PURE__ */ Eo("__proto__,__v_isRef,__isVue"), wr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Ai)), zo = /* @__PURE__ */ xr(), Fo = /* @__PURE__ */ xr(!0), Yi = /* @__PURE__ */ Bo();
function Bo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...i) {
      const n = $(this);
      for (let s = 0, o = this.length; s < o; s++)
        q(n, "get", s + "");
      const r = n[t](...i);
      return r === -1 || r === !1 ? n[t](...i.map($)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...i) {
      Ro();
      const n = $(this)[t].apply(this, i);
      return yr(), n;
    };
  }), e;
}
function xr(e = !1, t = !1) {
  return function(n, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? ta : Tr : t ? Qo : Ir).get(n))
      return n;
    const o = ht(n);
    if (!e && o && Oe(Yi, r))
      return Reflect.get(Yi, r, s);
    const a = Reflect.get(n, r, s);
    return (Ai(r) ? wr.has(r) : Po(r)) || (e || q(n, "get", r), t) ? a : si(a) ? !o || !Oi(r) ? a.value : a : De(a) ? e ? Sr(a) : Ri(a) : a;
  };
}
var Vo = /* @__PURE__ */ Ho();
function Ho(e = !1) {
  return function(i, n, r, s) {
    let o = i[n];
    if (!e && (r = $(r), o = $(o), !ht(i) && si(o) && !si(r)))
      return o.value = r, !0;
    const a = ht(i) && Oi(n) ? Number(n) < i.length : Oe(i, n), l = Reflect.set(i, n, r, s);
    return i === $(s) && (a ? br(r, o) && ot(i, "set", n, r, o) : ot(i, "add", n, r)), l;
  };
}
function qo(e, t) {
  const i = Oe(e, t), n = e[t], r = Reflect.deleteProperty(e, t);
  return r && i && ot(e, "delete", t, void 0, n), r;
}
function Wo(e, t) {
  const i = Reflect.has(e, t);
  return (!Ai(t) || !wr.has(t)) && q(e, "has", t), i;
}
function jo(e) {
  return q(e, "iterate", ht(e) ? "length" : pt), Reflect.ownKeys(e);
}
var Uo = {
  get: zo,
  set: Vo,
  deleteProperty: qo,
  has: Wo,
  ownKeys: jo
}, Yo = {
  get: Fo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, ki = (e) => De(e) ? Ri(e) : e, Ni = (e) => De(e) ? Sr(e) : e, Li = (e) => e, ke = (e) => Reflect.getPrototypeOf(e);
function re(e, t, i = !1, n = !1) {
  e = e.__v_raw;
  const r = $(e), s = $(t);
  t !== s && !i && q(r, "get", t), !i && q(r, "get", s);
  const { has: o } = ke(r), a = n ? Li : i ? Ni : ki;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function se(e, t = !1) {
  const i = this.__v_raw, n = $(i), r = $(e);
  return e !== r && !t && q(n, "has", e), !t && q(n, "has", r), e === r ? i.has(e) : i.has(e) || i.has(r);
}
function oe(e, t = !1) {
  return e = e.__v_raw, !t && q($(e), "iterate", pt), Reflect.get(e, "size", e);
}
function Ki(e) {
  e = $(e);
  const t = $(this);
  return ke(t).has.call(t, e) || (t.add(e), ot(t, "add", e, e)), this;
}
function Ji(e, t) {
  t = $(t);
  const i = $(this), { has: n, get: r } = ke(i);
  let s = n.call(i, e);
  s ? Er(i, n, e) : (e = $(e), s = n.call(i, e));
  const o = r.call(i, e);
  return i.set(e, t), s ? br(t, o) && ot(i, "set", e, t, o) : ot(i, "add", e, t), this;
}
function Xi(e) {
  const t = $(this), { has: i, get: n } = ke(t);
  let r = i.call(t, e);
  r ? Er(t, i, e) : (e = $(e), r = i.call(t, e));
  const s = n ? n.call(t, e) : void 0, o = t.delete(e);
  return r && ot(t, "delete", e, void 0, s), o;
}
function Gi() {
  const e = $(this), t = e.size !== 0, i = Yt(e) ? new Map(e) : new Set(e), n = e.clear();
  return t && ot(e, "clear", void 0, void 0, i), n;
}
function ae(e, t) {
  return function(n, r) {
    const s = this, o = s.__v_raw, a = $(o), l = t ? Li : e ? Ni : ki;
    return !e && q(a, "iterate", pt), o.forEach((c, u) => n.call(r, l(c), l(u), s));
  };
}
function le(e, t, i) {
  return function(...n) {
    const r = this.__v_raw, s = $(r), o = Yt(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...n), u = i ? Li : t ? Ni : ki;
    return !t && q(s, "iterate", l ? ri : pt), {
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
function et(e) {
  return function(...t) {
    {
      const i = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${Ao(e)} operation ${i}failed: target is readonly.`, $(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Ko() {
  const e = {
    get(s) {
      return re(this, s);
    },
    get size() {
      return oe(this);
    },
    has: se,
    add: Ki,
    set: Ji,
    delete: Xi,
    clear: Gi,
    forEach: ae(!1, !1)
  }, t = {
    get(s) {
      return re(this, s, !1, !0);
    },
    get size() {
      return oe(this);
    },
    has: se,
    add: Ki,
    set: Ji,
    delete: Xi,
    clear: Gi,
    forEach: ae(!1, !0)
  }, i = {
    get(s) {
      return re(this, s, !0);
    },
    get size() {
      return oe(this, !0);
    },
    has(s) {
      return se.call(this, s, !0);
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
    forEach: ae(!0, !1)
  }, n = {
    get(s) {
      return re(this, s, !0, !0);
    },
    get size() {
      return oe(this, !0);
    },
    has(s) {
      return se.call(this, s, !0);
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
    forEach: ae(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = le(s, !1, !1), i[s] = le(s, !0, !1), t[s] = le(s, !1, !0), n[s] = le(s, !0, !0);
  }), [
    e,
    i,
    t,
    n
  ];
}
var [Jo, Xo, Jc, Xc] = /* @__PURE__ */ Ko();
function _r(e, t) {
  const i = e ? Xo : Jo;
  return (n, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? n : Reflect.get(Oe(i, r) && r in n ? i : n, r, s);
}
var Go = {
  get: /* @__PURE__ */ _r(!1)
}, Zo = {
  get: /* @__PURE__ */ _r(!0)
};
function Er(e, t, i) {
  const n = $(i);
  if (n !== i && t.call(e, n)) {
    const r = gr(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Ir = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new WeakMap(), Tr = /* @__PURE__ */ new WeakMap(), ta = /* @__PURE__ */ new WeakMap();
function ea(e) {
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
function ia(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ea(gr(e));
}
function Ri(e) {
  return e && e.__v_isReadonly ? e : Cr(e, !1, Uo, Go, Ir);
}
function Sr(e) {
  return Cr(e, !0, Yo, Zo, Tr);
}
function Cr(e, t, i, n, r) {
  if (!De(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = ia(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? n : i);
  return r.set(e, a), a;
}
function $(e) {
  return e && $(e.__v_raw) || e;
}
function si(e) {
  return !!(e && e.__v_isRef === !0);
}
U("nextTick", () => Si);
U("dispatch", (e) => Ut.bind(Ut, e));
U("watch", (e, { evaluateLater: t, cleanup: i }) => (n, r) => {
  let s = t(n), a = In(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  i(a);
});
U("store", bo);
U("data", (e) => kn(e));
U("root", (e) => Ce(e));
U("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Qt(na(e))), e._x_refs_proxy));
function na(e) {
  let t = [];
  return Lt(e, (i) => {
    i._x_refs && t.push(i._x_refs);
  }), t;
}
var Fe = {};
function $r(e) {
  return Fe[e] || (Fe[e] = 0), ++Fe[e];
}
function ra(e, t) {
  return Lt(e, (i) => {
    if (i._x_ids && i._x_ids[t])
      return !0;
  });
}
function sa(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = $r(t));
}
U("id", (e, { cleanup: t }) => (i, n = null) => {
  let r = `${i}${n ? `-${n}` : ""}`;
  return oa(e, r, t, () => {
    let s = ra(e, i), o = s ? s._x_ids[i] : $r(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
Ae((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function oa(e, t, i, n) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = n();
  return e._x_id[t] = r, i(() => {
    delete e._x_id[t];
  }), r;
}
U("el", (e) => e);
Ar("Focus", "focus", "focus");
Ar("Persist", "persist", "persist");
function Ar(e, t, i) {
  U(t, (n) => V(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
D("modelable", (e, { expression: t }, { effect: i, evaluateLater: n, cleanup: r }) => {
  let s = n(t), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = n(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, f = dr(
      {
        get() {
          return u();
        },
        set(p) {
          d(p);
        }
      },
      {
        get() {
          return o();
        },
        set(p) {
          l(p);
        }
      }
    );
    r(f);
  });
});
D("teleport", (e, { modifiers: t, expression: i }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && V("x-teleport can only be used on a <template> tag", e);
  let r = Zi(i), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Zt(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  O(() => {
    o(s, r, t), lt(() => {
      Z(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Zi(i);
    O(() => {
      o(e._x_teleport, a, t);
    });
  }, n(
    () => O(() => {
      s.remove(), Rt(s);
    })
  );
});
var aa = document.createElement("div");
function Zi(e) {
  let t = lt(() => document.querySelector(e), () => aa)();
  return t || V(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Or = () => {
};
Or.inline = (e, { modifiers: t }, { cleanup: i }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, i(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
D("ignore", Or);
D("effect", lt((e, { expression: t }, { effect: i }) => {
  i(P(e, t));
}));
function oi(e, t, i, n) {
  let r = e, s = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (t = la(t)), i.includes("camel") && (t = ca(t)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (r = window), i.includes("document") && (r = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = we(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = cr(s, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = we(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = ur(s, c);
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
  })), (da(t) || Dr(t)) && (s = a(s, (l, c) => {
    fa(c, i) || l(c);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function la(e) {
  return e.replace(/-/g, ".");
}
function ca(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function we(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ua(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function da(e) {
  return ["keydown", "keyup"].includes(e);
}
function Dr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function fa(e, t) {
  let i = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, we((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, we((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && Qi(e.key).includes(i[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (Dr(e.type) || Qi(e.key).includes(i[0])));
}
function Qi(e) {
  if (!e)
    return [];
  e = ua(e);
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
D("model", (e, { modifiers: t, expression: i }, { effect: n, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = P(s, i), a;
  typeof i == "string" ? a = P(s, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = P(s, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((p) => f = p), tn(f) ? f.get() : f;
  }, c = (f) => {
    let p;
    o((y) => p = y), tn(p) ? p.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof i == "string" && e.type === "radio" && O(() => {
    e.hasAttribute("name") || e.setAttribute("name", i);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = st ? () => {
  } : oi(e, u, t, (f) => {
    c(Be(e, t, f, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || $i(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Be(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let f = oi(e.form, "reset", [], (p) => {
      Si(() => e._x_model && e._x_model.set(Be(e, t, { target: e }, l())));
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
    f === void 0 && typeof i == "string" && i.match(/\./) && (f = ""), window.fromModel = !0, O(() => rr(e, "value", f)), delete window.fromModel;
  }, n(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Be(e, t, i, n) {
  return O(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if ($i(e))
      if (Array.isArray(n)) {
        let r = null;
        return t.includes("number") ? r = Ve(i.target.value) : t.includes("boolean") ? r = me(i.target.value) : r = i.target.value, i.target.checked ? n.includes(r) ? n : n.concat([r]) : n.filter((s) => !ha(s, r));
      } else
        return i.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ve(s);
        }) : t.includes("boolean") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return me(s);
        }) : Array.from(i.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return lr(e) ? i.target.checked ? r = i.target.value : r = n : r = i.target.value, t.includes("number") ? Ve(r) : t.includes("boolean") ? me(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Ve(e) {
  let t = e ? parseFloat(e) : null;
  return pa(t) ? t : e;
}
function ha(e, t) {
  return e == t;
}
function pa(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function tn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
D("cloak", (e) => queueMicrotask(() => O(() => e.removeAttribute(Nt("cloak")))));
Zn(() => `[${Nt("init")}]`);
D("init", lt((e, { expression: t }, { evaluate: i }) => typeof t == "string" ? !!t.trim() && i(t, {}, !1) : i(t, {}, !1)));
D("text", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let r = n(t);
  i(() => {
    r((s) => {
      O(() => {
        e.textContent = s;
      });
    });
  });
});
D("html", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let r = n(t);
  i(() => {
    r((s) => {
      O(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, Z(e), delete e._x_ignoreSelf;
      });
    });
  });
});
Ei(Hn(":", qn(Nt("bind:"))));
var kr = (e, { value: t, modifiers: i, expression: n, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    yo(l), P(e, n)((u) => {
      hr(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return ma(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = P(e, n);
  s(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), O(() => rr(e, t, l, i));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
kr.inline = (e, { value: t, modifiers: i, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: !1 });
};
D("bind", kr);
function ma(e, t) {
  e._x_keyExpression = t;
}
Gn(() => `[${Nt("data")}]`);
D("data", (e, { expression: t }, { cleanup: i }) => {
  if (ga(e))
    return;
  t = t === "" ? "{}" : t;
  let n = {};
  Je(n, e);
  let r = {};
  xo(r, n);
  let s = ft(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Je(s, e);
  let o = Dt(s);
  Nn(o);
  let a = Zt(e, o);
  o.init && ft(e, o.init), i(() => {
    o.destroy && ft(e, o.destroy), a();
  });
});
Ae((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ga(e) {
  return st ? ii ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
D("show", (e, { modifiers: t, expression: i }, { effect: n }) => {
  let r = P(e, i);
  e._x_doHide || (e._x_doHide = () => {
    O(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    O(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let s = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, o = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(o), l = ti(
    (d) => d ? o() : s(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  n(() => r((d) => {
    !u && d === c || (t.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
D("for", (e, { expression: t }, { effect: i, cleanup: n }) => {
  let r = va(t), s = P(e, r.items), o = P(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, i(() => ba(e, r, s, o)), n(() => {
    Object.values(e._x_lookup).forEach((a) => O(
      () => {
        Rt(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function ba(e, t, i, n) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  i((o) => {
    ya(o) && o >= 0 && (o = Array.from(Array(o).keys(), (m) => m + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([m, g]) => {
        let h = en(t, g, m, o);
        n((x) => {
          u.includes(x) && V("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: m, ...h } }), c.push(h);
      });
    else
      for (let m = 0; m < o.length; m++) {
        let g = en(t, o[m], m, o);
        n((h) => {
          u.includes(h) && V("Duplicate key on x-for", e), u.push(h);
        }, { scope: { index: m, ...g } }), c.push(g);
      }
    let d = [], f = [], p = [], y = [];
    for (let m = 0; m < l.length; m++) {
      let g = l[m];
      u.indexOf(g) === -1 && p.push(g);
    }
    l = l.filter((m) => !p.includes(m));
    let w = "template";
    for (let m = 0; m < u.length; m++) {
      let g = u[m], h = l.indexOf(g);
      if (h === -1)
        l.splice(m, 0, g), d.push([w, m]);
      else if (h !== m) {
        let x = l.splice(m, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(m, 0, E), l.splice(h, 0, x), f.push([x, E]);
      } else
        y.push(g);
      w = g;
    }
    for (let m = 0; m < p.length; m++) {
      let g = p[m];
      g in a && (O(() => {
        Rt(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let m = 0; m < f.length; m++) {
      let [g, h] = f[m], x = a[g], E = a[h], _ = document.createElement("div");
      O(() => {
        E || V('x-for ":key" is undefined or invalid', s, h, a), E.after(_), x.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), _.before(x), x._x_currentIfEl && x.after(x._x_currentIfEl), _.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let m = 0; m < d.length; m++) {
      let [g, h] = d[m], x = g === "template" ? s : a[g];
      x._x_currentIfEl && (x = x._x_currentIfEl);
      let E = c[h], _ = u[h], b = document.importNode(s.content, !0).firstElementChild, v = Dt(E);
      Zt(b, v, s), b._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([S, T]) => {
          v[S] = T;
        });
      }, O(() => {
        x.after(b), lt(() => Z(b))();
      }), typeof _ == "object" && V("x-for key cannot be an object, it must be a string or an integer", s), a[_] = b;
    }
    for (let m = 0; m < y.length; m++)
      a[y[m]]._x_refreshXForScope(c[u.indexOf(y[m])]);
    s._x_prevKeys = u;
  });
}
function va(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(n);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(i, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function en(e, t, i, n) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = i), e.collection && (r[e.collection] = n), r;
}
function ya(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Nr() {
}
Nr.inline = (e, { expression: t }, { cleanup: i }) => {
  let n = Ce(e);
  n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, i(() => delete n._x_refs[t]);
};
D("ref", Nr);
D("if", (e, { expression: t }, { effect: i, cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && V("x-if can only be used on a <template> tag", e);
  let r = P(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Zt(a, {}, e), O(() => {
      e.after(a), lt(() => Z(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      O(() => {
        Rt(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  i(() => r((a) => {
    a ? s() : o();
  })), n(() => e._x_undoIf && e._x_undoIf());
});
D("id", (e, { expression: t }, { evaluate: i }) => {
  i(t).forEach((r) => sa(e, r));
});
Ae((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ei(Hn("@", qn(Nt("on:"))));
D("on", lt((e, { value: t, modifiers: i, expression: n }, { cleanup: r }) => {
  let s = n ? P(e, n) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = oi(e, t, i, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Ne("Collapse", "collapse", "collapse");
Ne("Intersect", "intersect", "intersect");
Ne("Focus", "trap", "focus");
Ne("Mask", "mask", "mask");
function Ne(e, t, i) {
  D(t, (n) => V(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
te.setEvaluator(zn);
te.setReactivityEngine({ reactive: Ri, effect: Do, release: ko, raw: $ });
var wa = te, Lr = wa;
function xa(e) {
  e.directive("collapse", t), t.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function t(i, { modifiers: n }) {
    let r = nn(n, "duration", 250) / 1e3, s = nn(n, "min", 0), o = !n.includes("min");
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
function nn(e, t, i) {
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
var _a = xa;
function Ea(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(n), l = {
      rootMargin: Sa(r),
      threshold: Ia(r)
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
function Ia(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Ta(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Sa(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Ta(e[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : i;
}
var Ca = Ea, Rr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], xe = /* @__PURE__ */ Rr.join(","), Mr = typeof Element > "u", vt = Mr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ai = !Mr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Pr = function(t, i, n) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(xe));
  return i && vt.call(t, xe) && r.unshift(t), r = r.filter(n), r;
}, zr = function e(t, i, n) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, n);
      n.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = vt.call(o, xe);
      u && n.filter(o) && (i || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), f = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && f) {
        var p = e(d === !0 ? o.children : d.children, !0, n);
        n.flatten ? r.push.apply(r, p) : r.push({
          scope: o,
          candidates: p
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Fr = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, $a = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, Br = function(t) {
  return t.tagName === "INPUT";
}, Aa = function(t) {
  return Br(t) && t.type === "hidden";
}, Oa = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Da = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, ka = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || ai(t), n = function(a) {
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
}, Na = function(t) {
  return Br(t) && t.type === "radio";
}, La = function(t) {
  return Na(t) && !ka(t);
}, rn = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, r = i.height;
  return n === 0 && r === 0;
}, Ra = function(t, i) {
  var n = i.displayCheck, r = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = vt.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (vt.call(o, "details:not([open]) *"))
    return !0;
  var a = ai(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = ai(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return rn(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (n === "non-zero-area")
    return rn(t);
  return !1;
}, Ma = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var r = i.children.item(n);
          if (r.tagName === "LEGEND")
            return vt.call(i, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, _e = function(t, i) {
  return !(i.disabled || Aa(i) || Ra(i, t) || // For a details element with a summary, the summary element gets the focus
  Oa(i) || Ma(i));
}, li = function(t, i) {
  return !(La(i) || Fr(i) < 0 || !_e(t, i));
}, Pa = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, za = function e(t) {
  var i = [], n = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Fr(a, o), c = o ? e(r.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), n.sort($a).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(i);
}, Fa = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = zr([t], i.includeContainer, {
    filter: li.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: Pa
  }) : n = Pr(t, i.includeContainer, li.bind(null, i)), za(n);
}, Vr = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = zr([t], i.includeContainer, {
    filter: _e.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = Pr(t, i.includeContainer, _e.bind(null, i)), n;
}, ce = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return vt.call(t, xe) === !1 ? !1 : li(i, t);
}, Ba = /* @__PURE__ */ Rr.concat("iframe").join(","), ge = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return vt.call(t, Ba) === !1 ? !1 : _e(i, t);
};
function sn(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function on(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sn(Object(i), !0).forEach(function(n) {
      Va(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : sn(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function Va(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var an = /* @__PURE__ */ function() {
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
}(), Ha = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, qa = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, Wa = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, ln = function(t) {
  return setTimeout(t, 0);
}, cn = function(t, i) {
  var n = -1;
  return t.every(function(r, s) {
    return i(r) ? (n = s, !1) : !0;
  }), n;
}, Bt = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, ue = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, ja = function(t, i) {
  var n = i?.document || document, r = on({
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
  }, o, a = function(b, v, I) {
    return b && b[v] !== void 0 ? b[v] : r[I || v];
  }, l = function(b) {
    return s.containerGroups.findIndex(function(v) {
      var I = v.container, S = v.tabbableNodes;
      return I.contains(b) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      S.find(function(T) {
        return T === b;
      });
    });
  }, c = function(b) {
    var v = r[b];
    if (typeof v == "function") {
      for (var I = arguments.length, S = new Array(I > 1 ? I - 1 : 0), T = 1; T < I; T++)
        S[T - 1] = arguments[T];
      v = v.apply(void 0, S);
    }
    if (v === !0 && (v = void 0), !v) {
      if (v === void 0 || v === !1)
        return v;
      throw new Error("`".concat(b, "` was specified but was not a node, or did not return a node"));
    }
    var A = v;
    if (typeof v == "string" && (A = n.querySelector(v), !A))
      throw new Error("`".concat(b, "` as selector refers to no known node"));
    return A;
  }, u = function() {
    var b = c("initialFocus");
    if (b === !1)
      return !1;
    if (b === void 0)
      if (l(n.activeElement) >= 0)
        b = n.activeElement;
      else {
        var v = s.tabbableGroups[0], I = v && v.firstTabbableNode;
        b = I || c("fallbackFocus");
      }
    if (!b)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return b;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(b) {
      var v = Fa(b, r.tabbableOptions), I = Vr(b, r.tabbableOptions);
      return {
        container: b,
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
        nextTabbableNode: function(T) {
          var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = I.findIndex(function(L) {
            return L === T;
          });
          if (!(k < 0))
            return A ? I.slice(k + 1).find(function(L) {
              return ce(L, r.tabbableOptions);
            }) : I.slice(0, k).reverse().find(function(L) {
              return ce(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(b) {
      return b.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function _(b) {
    if (b !== !1 && b !== n.activeElement) {
      if (!b || !b.focus) {
        _(u());
        return;
      }
      b.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = b, Ha(b) && b.select();
    }
  }, p = function(b) {
    var v = c("setReturnFocus", b);
    return v || (v === !1 ? !1 : b);
  }, y = function(b) {
    var v = ue(b);
    if (!(l(v) >= 0)) {
      if (Bt(r.clickOutsideDeactivates, b)) {
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
          returnFocus: r.returnFocusOnDeactivate && !ge(v, r.tabbableOptions)
        });
        return;
      }
      Bt(r.allowOutsideClick, b) || b.preventDefault();
    }
  }, w = function(b) {
    var v = ue(b), I = l(v) >= 0;
    I || v instanceof Document ? I && (s.mostRecentlyFocusedNode = v) : (b.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, m = function(b) {
    var v = ue(b);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var S = l(v), T = S >= 0 ? s.containerGroups[S] : void 0;
      if (S < 0)
        b.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (b.shiftKey) {
        var A = cn(s.tabbableGroups, function(M) {
          var B = M.firstTabbableNode;
          return v === B;
        });
        if (A < 0 && (T.container === v || ge(v, r.tabbableOptions) && !ce(v, r.tabbableOptions) && !T.nextTabbableNode(v, !1)) && (A = S), A >= 0) {
          var k = A === 0 ? s.tabbableGroups.length - 1 : A - 1, L = s.tabbableGroups[k];
          I = L.lastTabbableNode;
        }
      } else {
        var N = cn(s.tabbableGroups, function(M) {
          var B = M.lastTabbableNode;
          return v === B;
        });
        if (N < 0 && (T.container === v || ge(v, r.tabbableOptions) && !ce(v, r.tabbableOptions) && !T.nextTabbableNode(v)) && (N = S), N >= 0) {
          var R = N === s.tabbableGroups.length - 1 ? 0 : N + 1, H = s.tabbableGroups[R];
          I = H.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (b.preventDefault(), f(I));
  }, g = function(b) {
    if (qa(b) && Bt(r.escapeDeactivates, b) !== !1) {
      b.preventDefault(), o.deactivate();
      return;
    }
    if (Wa(b)) {
      m(b);
      return;
    }
  }, h = function(b) {
    var v = ue(b);
    l(v) >= 0 || Bt(r.clickOutsideDeactivates, b) || Bt(r.allowOutsideClick, b) || (b.preventDefault(), b.stopImmediatePropagation());
  }, x = function() {
    if (s.active)
      return an.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? ln(function() {
        f(u());
      }) : f(u()), n.addEventListener("focusin", w, !0), n.addEventListener("mousedown", y, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", y, {
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
      return n.removeEventListener("focusin", w, !0), n.removeEventListener("mousedown", y, !0), n.removeEventListener("touchstart", y, !0), n.removeEventListener("click", h, !0), n.removeEventListener("keydown", g, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(b) {
      if (s.active)
        return this;
      var v = a(b, "onActivate"), I = a(b, "onPostActivate"), S = a(b, "checkCanFocusTrap");
      S || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, v && v();
      var T = function() {
        S && d(), x(), I && I();
      };
      return S ? (S(s.containers.concat()).then(T, T), this) : (T(), this);
    },
    deactivate: function(b) {
      if (!s.active)
        return this;
      var v = on({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, b);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, an.deactivateTrap(o);
      var I = a(v, "onDeactivate"), S = a(v, "onPostDeactivate"), T = a(v, "checkCanReturnFocus"), A = a(v, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var k = function() {
        ln(function() {
          A && f(p(s.nodeFocusedBeforeActivation)), S && S();
        });
      };
      return A && T ? (T(p(s.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), x(), this);
    },
    updateContainerElements: function(b) {
      var v = [].concat(b).filter(Boolean);
      return s.containers = v.map(function(I) {
        return typeof I == "string" ? n.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function Ua(e) {
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
        return ge(s);
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
        return Array.isArray(r) ? r : Vr(r, { displayCheck: "none" });
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
        let m = n.querySelector("[autofocus]");
        m && (d.initialFocus = m);
      }
      s.includes("inert") && (d.onPostActivate = () => {
        e.nextTick(() => {
          f = un(n);
        });
      });
      let p = ja(n, d), y = () => {
      };
      const w = () => {
        f(), f = () => {
        }, y(), y = () => {
        }, p.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((m) => {
        u !== m && (m && !u && (s.includes("noscroll") && (y = Ya()), setTimeout(() => {
          p.activate();
        }, 15)), !m && u && w(), u = !!m);
      })), l(w);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && un(n);
    }
  ));
}
function un(e) {
  let t = [];
  return Hr(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Hr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? Hr(e.parentNode, t) : t(i);
  });
}
function Ya() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var Ka = Ua;
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
function Ja() {
  return !0;
}
function Xa({ component: e, argument: t }) {
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
function Ga() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function Za({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const i = window.matchMedia(`(${e})`);
    i.matches ? t() : i.addEventListener("change", t, { once: !0 });
  });
}
function Qa({ component: e, argument: t }) {
  return new Promise((i) => {
    const n = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), i());
    }, { rootMargin: n });
    r.observe(e.el);
  });
}
var dn = {
  eager: Ja,
  event: Xa,
  idle: Ga,
  media: Za,
  visible: Qa
};
async function tl(e) {
  const t = el(e.strategy);
  await ci(e, t);
}
async function ci(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((i) => ci(e, i))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((i) => ci(e, i))
      );
  }
  return dn[t.method] ? dn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function el(e) {
  const t = il(e);
  let i = qr(t);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function il(e) {
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
function qr(e) {
  let t = fn(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const i = e.shift().value, n = fn(e);
    t.type === "expression" && t.operator === i ? t.parameters.push(n) : t = {
      type: "expression",
      operator: i,
      parameters: [t, n]
    };
  }
  return t;
}
function fn(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = qr(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function nl(e) {
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
  }, e.asyncData = (h, x = !1) => {
    o[h] = {
      loaded: !1,
      download: x
    };
  }, e.asyncUrl = (h, x) => {
    !h || !x || o[h] || (o[h] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        g(x)
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
      const { name: x, strategy: E } = d(h);
      await tl({
        name: x,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(x), h.isConnected && (y(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, e.directive(t, u).before("ignore");
  function d(h) {
    const x = m(h.getAttribute(e.prefixed("data"))), E = h.getAttribute(e.prefixed(t)) || r.defaultStrategy, _ = h.getAttribute(i);
    return _ && e.asyncUrl(x, _), {
      name: x,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (w(h), !o[h] || o[h].loaded)) return;
    const x = await p(h);
    e.data(h, x), o[h].loaded = !0;
  }
  async function p(h) {
    if (!o[h]) return;
    const x = await o[h].download(h);
    return typeof x == "function" ? x : x[h] || x.default || Object.values(x)[0] || !1;
  }
  function y(h) {
    e.destroyTree(h), h._x_ignore = !1, h.removeAttribute(n), !h.closest(`[${n}]`) && e.initTree(h);
  }
  function w(h) {
    if (!(!s || o[h])) {
      if (typeof s == "function") {
        e.asyncData(h, s);
        return;
      }
      e.asyncUrl(h, s.replaceAll("[name]", h));
    }
  }
  function m(h) {
    return (h || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function g(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function rl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function sl(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function ol(e, t, i) {
  return t && sl(e.prototype, t), e;
}
var al = Object.defineProperty, Q = function(e, t) {
  return al(e, "name", { value: t, configurable: !0 });
}, ll = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, cl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, ul = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, dl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, fl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, hl = Q(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Vt = Q(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), C = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, it = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, hn = { OUTLINE: "outline", FILLED: "filled" }, He = { FADE: "fade", SLIDE: "slide" }, Ht = { CLOSE: Vt(ll), SUCCESS: Vt(dl), ERROR: Vt(cl), WARNING: Vt(fl), INFO: Vt(ul) }, pn = Q(function(e) {
  e.wrapper.classList.add(C.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), mn = Q(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), pl = Q(function(e) {
  e.wrapper.classList.add(C.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), ml = Q(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Wr = function() {
  function e(t) {
    var i = this;
    rl(this, e), this.notifyOut = Q(function(M) {
      M(i);
    }, "notifyOut");
    var n = t.notificationsGap, r = n === void 0 ? 20 : n, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? He.FADE : c, d = t.type, f = d === void 0 ? "outline" : d, p = t.title, y = t.text, w = t.showIcon, m = w === void 0 ? !0 : w, g = t.customIcon, h = g === void 0 ? "" : g, x = t.customClass, E = x === void 0 ? "" : x, _ = t.speed, b = _ === void 0 ? 500 : _, v = t.showCloseButton, I = v === void 0 ? !0 : v, S = t.autoclose, T = S === void 0 ? !0 : S, A = t.autotimeout, k = A === void 0 ? 3e3 : A, L = t.position, N = L === void 0 ? "right top" : L, R = t.customWrapper, H = R === void 0 ? "" : R;
    if (this.customWrapper = H, this.status = l, this.title = p, this.text = y, this.showIcon = m, this.customIcon = h, this.customClass = E, this.speed = b, this.effect = u, this.showCloseButton = I, this.autoclose = T, this.autotimeout = k, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = N, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return ol(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(C.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(C.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](C.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](C.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](C.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](C.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](C.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](C.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](C.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(C.NOTIFY_CLOSE), n.innerHTML = Ht.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = hl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(C.NOTIFY), this.type) {
      case hn.OUTLINE:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
        break;
      case hn.FILLED:
        this.wrapper.classList.add(C.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case it.SUCCESS:
        this.wrapper.classList.add(C.NOTIFY_SUCCESS);
        break;
      case it.ERROR:
        this.wrapper.classList.add(C.NOTIFY_ERROR);
        break;
      case it.WARNING:
        this.wrapper.classList.add(C.NOTIFY_WARNING);
        break;
      case it.INFO:
        this.wrapper.classList.add(C.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(C.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(C.NOTIFY_CONTENT);
    var n, r;
    this.title && (n = document.createElement("div"), n.classList.add(C.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(C.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var i = Q(function(r) {
      switch (r) {
        case it.SUCCESS:
          return Ht.SUCCESS;
        case it.ERROR:
          return Ht.ERROR;
        case it.WARNING:
          return Ht.WARNING;
        case it.INFO:
          return Ht.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(C.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
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
      case He.FADE:
        this.selectedNotifyInEffect = pn, this.selectedNotifyOutEffect = mn;
        break;
      case He.SLIDE:
        this.selectedNotifyInEffect = pl, this.selectedNotifyOutEffect = ml;
        break;
      default:
        this.selectedNotifyInEffect = pn, this.selectedNotifyOutEffect = mn;
    }
  } }]), e;
}();
Q(Wr, "Notify");
var jr = Wr;
globalThis.Notify = jr;
const Ur = ["success", "error", "warning", "info"], Yr = [
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
], Kr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function qt(e = {}) {
  const t = {
    ...Kr,
    ...e
  };
  Ur.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Yr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new jr(t);
}
const gl = {
  custom: qt,
  success(e, t = "Success", i = {}) {
    qt({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    qt({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    qt({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    qt({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(Kr, e);
  },
  get allowedStatuses() {
    return [...Ur];
  },
  get allowedPositions() {
    return [...Yr];
  }
}, ui = function() {
}, Jt = {}, Ee = {}, Xt = {};
function bl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, r = n, s, o, a, l;
  for (s = function(c, u) {
    u.length && i.push(c), r--, r || t(i);
  }; n--; ) {
    if (o = e[n], a = Ee[o], a) {
      s(o, a);
      continue;
    }
    l = Xt[o] = Xt[o] || [], l.push(s);
  }
}
function Jr(e, t) {
  if (!e) return;
  const i = Xt[e];
  if (Ee[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function di(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || ui)(t) : (e.success || ui)(e);
}
function vl(e, t, i, n, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Xr(t, n, r, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function Xr(e, t, i, n) {
  const r = document, s = i.async, o = (i.numRetries || 0) + 1, a = i.before || ui, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
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
  const p = function(y) {
    vl(y, e, f, t, i, n, o, u);
  };
  f.addEventListener("load", p, { once: !0 }), f.addEventListener("error", p, { once: !0 }), a(e, f) !== !1 && r.head.appendChild(f);
}
function yl(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    n--, n || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Xr(e[o], s, i);
}
function rt(e, t, i) {
  let n, r;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), r = (n ? i : t) || {}, n) {
    if (n in Jt)
      throw "LoadJS";
    Jt[n] = !0;
  }
  function s(o, a) {
    yl(e, function(l) {
      di(r, l), o && di({ success: o, error: a }, l), Jr(n, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
rt.ready = function(t, i) {
  return bl(t, function(n) {
    di(i, n);
  }), rt;
};
rt.done = function(t) {
  Jr(t, []);
};
rt.reset = function() {
  Object.keys(Jt).forEach((t) => delete Jt[t]), Object.keys(Ee).forEach((t) => delete Ee[t]), Object.keys(Xt).forEach((t) => delete Xt[t]);
};
rt.isDefined = function(t) {
  return t in Jt;
};
function wl(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = xl(e) || e;
    let i = Alpine.$data(t);
    if (i === void 0) {
      const n = t.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && gn("element", t), i;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${Zr(t)}"]`;
    let n = null;
    const r = document.getElementById(t);
    if (r && (n = r.matches(i) ? r : r.querySelector(i)), n || (n = Gr(t)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(n);
    return s === void 0 && gn(`data-alpine-root="${t}"`, n), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function xl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", i = e.getAttribute?.("data-for");
  if (t || i) {
    const n = i || "";
    if (!n) return e;
    const r = Gr(n);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return e;
}
function Gr(e) {
  const t = `[data-alpine-root="${Zr(e)}"]`, i = document.querySelectorAll(t);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(e) || null;
}
function Zr(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function gn(e, t) {
  const i = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function _l(e) {
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
function El(e) {
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
function Il(e) {
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
function Tl(e) {
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
function Sl(e) {
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
function Cl(e, t) {
  e.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function $l(e) {
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
        const r = JSON.parse(this.$el.dataset.initialDates || "[]");
        this.dates = this._normalize(r);
      } catch {
        this.dates = [];
      }
      const t = (r) => {
        this.calendarApi = r.detail.instance, this.syncToCalendar();
      };
      this.$el.addEventListener("rz:calendar:init", t), this._handlers.push({ type: "rz:calendar:init", fn: t });
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
        const a = this.dates[0], l = this.dates[this.dates.length - 1];
        t = [`${a}:${l}`];
      }
      let i, n, r = !1;
      if (this.dates.length > 0) {
        const a = this.parseIsoLocal(this.dates[0]);
        isNaN(a.getTime()) || (i = a.getMonth(), n = a.getFullYear(), r = !0);
      }
      const s = JSON.stringify({ mode: this.mode, dates: t, m: i, y: n });
      if (this._lastAppliedState === s) return;
      this._lastAppliedState = s;
      const o = { selectedDates: t };
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
      const [i, n, r] = t.split("-").map(Number), s = new Date(Date.UTC(i, n - 1, r));
      return s.getUTCFullYear() === i && s.getUTCMonth() + 1 === n && s.getUTCDate() === r;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(t) {
      const n = (Array.isArray(t) ? t : []).flat(1 / 0).flatMap((r) => typeof r == "string" ? this._extractIsoDates(r) : []).filter((r) => this._isValidIsoDate(r));
      if (this.mode === "single")
        return [...new Set(n)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const r = n.sort();
        return r.length <= 1 ? r : [r[0], r[r.length - 1]];
      }
      return [...new Set(n)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(t) {
      const [i, n, r] = t.split("-").map(Number);
      return new Date(i, n - 1, r);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(t) {
      const i = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
      return `${i}-${n}-${r}`;
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
function Al(e, t) {
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
          /**
           * Executes the `success` operation.
           * @returns {any} Returns the result of `success` when applicable.
           */
          success() {
            window.EmblaCarousel ? l.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
          },
          /**
           * Executes the `error` operation.
           * @param {any} err Input value for this method.
           * @returns {any} Returns the result of `error` when applicable.
           */
          error(c) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", c);
          }
        },
        r
      ) : window.EmblaCarousel ? this.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    /**
     * Executes the `initializeEmbla` operation.
     * @param {any} options Input value for this method.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `initializeEmbla` when applicable.
     */
    initializeEmbla(n, r) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(r);
      this.emblaApi = window.EmblaCarousel(s, n, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
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
function Ol(e, t) {
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
function Dl(e) {
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
function kl(e, t) {
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
        error: (r) => console.error("RzCombobox: Failed to load assets.", r)
      }, n) : window.TomSelect && this.initTomSelect();
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.tomSelect && (this.tomSelect.destroy(), this.tomSelect = null);
    }
  }));
}
function Nl(e, t) {
  e.data("rzColorPicker", () => ({
    colorValue: "",
    swatchStyle: "background-color: transparent;",
    config: {},
    inputId: "",
    init() {
      this.inputId = this.$el.dataset.inputId, this.colorValue = this.$el.dataset.initialValue || "", this.config = this.readConfig(), this.refreshSwatch();
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      t(i, n).then(() => this.initializeColoris()).catch((r) => this.handleAssetError(r));
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
      !i || !window.Coloris || (window.Coloris({
        el: i,
        wrap: !1,
        themeMode: "auto",
        ...this.config
      }), this.colorValue = i.value || this.colorValue, this.refreshSwatch(), i.addEventListener("input", () => this.handleInput()));
    },
    handleInput() {
      const i = this.$refs.input;
      this.colorValue = i ? i.value : "", this.refreshSwatch();
    },
    refreshSwatch() {
      const i = this.colorValue && this.colorValue.trim().length > 0 ? this.colorValue : "transparent";
      this.swatchStyle = "background-color: " + i + ";";
    },
    handleAssetError(i) {
      console.error("Failed to load Coloris assets.", i);
    }
  }));
}
function Ll(e, t) {
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
function Rl(e) {
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
const At = Math.min, mt = Math.max, Ie = Math.round, de = Math.floor, J = (e) => ({
  x: e,
  y: e
}), Ml = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Pl = {
  start: "end",
  end: "start"
};
function fi(e, t, i) {
  return mt(e, At(t, i));
}
function ee(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function yt(e) {
  return e.split("-")[0];
}
function ie(e) {
  return e.split("-")[1];
}
function Qr(e) {
  return e === "x" ? "y" : "x";
}
function Mi(e) {
  return e === "y" ? "height" : "width";
}
function gt(e) {
  return ["top", "bottom"].includes(yt(e)) ? "y" : "x";
}
function Pi(e) {
  return Qr(gt(e));
}
function zl(e, t, i) {
  i === void 0 && (i = !1);
  const n = ie(e), r = Pi(e), s = Mi(r);
  let o = r === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = Te(o)), [o, Te(o)];
}
function Fl(e) {
  const t = Te(e);
  return [hi(e), t, hi(t)];
}
function hi(e) {
  return e.replace(/start|end/g, (t) => Pl[t]);
}
function Bl(e, t, i) {
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
function Vl(e, t, i, n) {
  const r = ie(e);
  let s = Bl(yt(e), i === "start", n);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(hi)))), s;
}
function Te(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Ml[t]);
}
function Hl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function ts(e) {
  return typeof e != "number" ? Hl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Se(e) {
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
function bn(e, t, i) {
  let {
    reference: n,
    floating: r
  } = e;
  const s = gt(t), o = Pi(t), a = Mi(o), l = yt(t), c = s === "y", u = n.x + n.width / 2 - r.width / 2, d = n.y + n.height / 2 - r.height / 2, f = n[a] / 2 - r[a] / 2;
  let p;
  switch (l) {
    case "top":
      p = {
        x: u,
        y: n.y - r.height
      };
      break;
    case "bottom":
      p = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      p = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      p = {
        x: n.x - r.width,
        y: d
      };
      break;
    default:
      p = {
        x: n.x,
        y: n.y
      };
  }
  switch (ie(t)) {
    case "start":
      p[o] -= f * (i && c ? -1 : 1);
      break;
    case "end":
      p[o] += f * (i && c ? -1 : 1);
      break;
  }
  return p;
}
const ql = async (e, t, i) => {
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
  } = bn(c, n, l), f = n, p = {}, y = 0;
  for (let w = 0; w < a.length; w++) {
    const {
      name: m,
      fn: g
    } = a[w], {
      x: h,
      y: x,
      data: E,
      reset: _
    } = await g({
      x: u,
      y: d,
      initialPlacement: n,
      placement: f,
      strategy: r,
      middlewareData: p,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = h ?? u, d = x ?? d, p = {
      ...p,
      [m]: {
        ...p[m],
        ...E
      }
    }, _ && y <= 50 && (y++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (c = _.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : _.rects), {
      x: u,
      y: d
    } = bn(c, f, l)), w = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: p
  };
};
async function es(e, t) {
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
    padding: p = 0
  } = ee(t, e), y = ts(p), m = a[f ? d === "floating" ? "reference" : "floating" : d], g = Se(await s.getClippingRect({
    element: (i = await (s.isElement == null ? void 0 : s.isElement(m))) == null || i ? m : m.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), h = d === "floating" ? {
    x: n,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), E = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = Se(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: x,
    strategy: l
  }) : h);
  return {
    top: (g.top - _.top + y.top) / E.y,
    bottom: (_.bottom - g.bottom + y.bottom) / E.y,
    left: (g.left - _.left + y.left) / E.x,
    right: (_.right - g.right + y.right) / E.x
  };
}
const Wl = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: i,
      y: n,
      placement: r,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = t, {
      element: c,
      padding: u = 0
    } = ee(e, t) || {};
    if (c == null)
      return {};
    const d = ts(u), f = {
      x: i,
      y: n
    }, p = Pi(r), y = Mi(p), w = await o.getDimensions(c), m = p === "y", g = m ? "top" : "left", h = m ? "bottom" : "right", x = m ? "clientHeight" : "clientWidth", E = s.reference[y] + s.reference[p] - f[p] - s.floating[y], _ = f[p] - s.reference[p], b = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let v = b ? b[x] : 0;
    (!v || !await (o.isElement == null ? void 0 : o.isElement(b))) && (v = a.floating[x] || s.floating[y]);
    const I = E / 2 - _ / 2, S = v / 2 - w[y] / 2 - 1, T = At(d[g], S), A = At(d[h], S), k = T, L = v - w[y] - A, N = v / 2 - w[y] / 2 + I, R = fi(k, N, L), H = !l.arrow && ie(r) != null && N !== R && s.reference[y] / 2 - (N < k ? T : A) - w[y] / 2 < 0, M = H ? N < k ? N - k : N - L : 0;
    return {
      [p]: f[p] + M,
      data: {
        [p]: R,
        centerOffset: N - R - M,
        ...H && {
          alignmentOffset: M
        }
      },
      reset: H
    };
  }
}), jl = function(e) {
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
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: y = "none",
        flipAlignment: w = !0,
        ...m
      } = ee(e, t);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const g = yt(r), h = gt(a), x = yt(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = f || (x || !w ? [Te(a)] : Fl(a)), b = y !== "none";
      !f && b && _.push(...Vl(a, w, y, E));
      const v = [a, ..._], I = await es(t, m), S = [];
      let T = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && S.push(I[g]), d) {
        const R = zl(r, o, E);
        S.push(I[R[0]], I[R[1]]);
      }
      if (T = [...T, {
        placement: r,
        overflows: S
      }], !S.every((R) => R <= 0)) {
        var A, k;
        const R = (((A = s.flip) == null ? void 0 : A.index) || 0) + 1, H = v[R];
        if (H) {
          var L;
          const B = d === "alignment" ? h !== gt(H) : !1, Y = ((L = T[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!B || Y)
            return {
              data: {
                index: R,
                overflows: T
              },
              reset: {
                placement: H
              }
            };
        }
        let M = (k = T.filter((B) => B.overflows[0] <= 0).sort((B, Y) => B.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!M)
          switch (p) {
            case "bestFit": {
              var N;
              const B = (N = T.filter((Y) => {
                if (b) {
                  const tt = gt(Y.placement);
                  return tt === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  tt === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((tt) => tt > 0).reduce((tt, us) => tt + us, 0)]).sort((Y, tt) => Y[1] - tt[1])[0]) == null ? void 0 : N[0];
              B && (M = B);
              break;
            }
            case "initialPlacement":
              M = a;
              break;
          }
        if (r !== M)
          return {
            reset: {
              placement: M
            }
          };
      }
      return {};
    }
  };
};
async function Ul(e, t) {
  const {
    placement: i,
    platform: n,
    elements: r
  } = e, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), o = yt(i), a = ie(i), l = gt(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = ee(t, e);
  let {
    mainAxis: f,
    crossAxis: p,
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
  return a && typeof y == "number" && (p = a === "end" ? y * -1 : y), l ? {
    x: p * u,
    y: f * c
  } : {
    x: f * c,
    y: p * u
  };
}
const Yl = function(e) {
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
      } = t, l = await Ul(t, e);
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
}, Kl = function(e) {
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
          fn: (m) => {
            let {
              x: g,
              y: h
            } = m;
            return {
              x: g,
              y: h
            };
          }
        },
        ...l
      } = ee(e, t), c = {
        x: i,
        y: n
      }, u = await es(t, l), d = gt(yt(r)), f = Qr(d);
      let p = c[f], y = c[d];
      if (s) {
        const m = f === "y" ? "top" : "left", g = f === "y" ? "bottom" : "right", h = p + u[m], x = p - u[g];
        p = fi(h, p, x);
      }
      if (o) {
        const m = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", h = y + u[m], x = y - u[g];
        y = fi(h, y, x);
      }
      const w = a.fn({
        ...t,
        [f]: p,
        [d]: y
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
function Le() {
  return typeof window < "u";
}
function Mt(e) {
  return is(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function F(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function G(e) {
  var t;
  return (t = (is(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function is(e) {
  return Le() ? e instanceof Node || e instanceof F(e).Node : !1;
}
function W(e) {
  return Le() ? e instanceof Element || e instanceof F(e).Element : !1;
}
function X(e) {
  return Le() ? e instanceof HTMLElement || e instanceof F(e).HTMLElement : !1;
}
function vn(e) {
  return !Le() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof F(e).ShadowRoot;
}
function ne(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: r
  } = j(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !["inline", "contents"].includes(r);
}
function Jl(e) {
  return ["table", "td", "th"].includes(Mt(e));
}
function Re(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function zi(e) {
  const t = Fi(), i = W(e) ? j(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function Xl(e) {
  let t = at(e);
  for (; X(t) && !Ot(t); ) {
    if (zi(t))
      return t;
    if (Re(t))
      return null;
    t = at(t);
  }
  return null;
}
function Fi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ot(e) {
  return ["html", "body", "#document"].includes(Mt(e));
}
function j(e) {
  return F(e).getComputedStyle(e);
}
function Me(e) {
  return W(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function at(e) {
  if (Mt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    vn(e) && e.host || // Fallback.
    G(e)
  );
  return vn(t) ? t.host : t;
}
function ns(e) {
  const t = at(e);
  return Ot(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : X(t) && ne(t) ? t : ns(t);
}
function Gt(e, t, i) {
  var n;
  t === void 0 && (t = []), i === void 0 && (i = !0);
  const r = ns(e), s = r === ((n = e.ownerDocument) == null ? void 0 : n.body), o = F(r);
  if (s) {
    const a = pi(o);
    return t.concat(o, o.visualViewport || [], ne(r) ? r : [], a && i ? Gt(a) : []);
  }
  return t.concat(r, Gt(r, [], i));
}
function pi(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function rs(e) {
  const t = j(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const r = X(e), s = r ? e.offsetWidth : i, o = r ? e.offsetHeight : n, a = Ie(i) !== s || Ie(n) !== o;
  return a && (i = s, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Bi(e) {
  return W(e) ? e : e.contextElement;
}
function St(e) {
  const t = Bi(e);
  if (!X(t))
    return J(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = rs(t);
  let o = (s ? Ie(i.width) : i.width) / n, a = (s ? Ie(i.height) : i.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Gl = /* @__PURE__ */ J(0);
function ss(e) {
  const t = F(e);
  return !Fi() || !t.visualViewport ? Gl : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Zl(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== F(e) ? !1 : t;
}
function wt(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const r = e.getBoundingClientRect(), s = Bi(e);
  let o = J(1);
  t && (n ? W(n) && (o = St(n)) : o = St(e));
  const a = Zl(s, i, n) ? ss(s) : J(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = F(s), p = n && W(n) ? F(n) : n;
    let y = f, w = pi(y);
    for (; w && n && p !== y; ) {
      const m = St(w), g = w.getBoundingClientRect(), h = j(w), x = g.left + (w.clientLeft + parseFloat(h.paddingLeft)) * m.x, E = g.top + (w.clientTop + parseFloat(h.paddingTop)) * m.y;
      l *= m.x, c *= m.y, u *= m.x, d *= m.y, l += x, c += E, y = F(w), w = pi(y);
    }
  }
  return Se({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Vi(e, t) {
  const i = Me(e).scrollLeft;
  return t ? t.left + i : wt(G(e)).left + i;
}
function os(e, t, i) {
  i === void 0 && (i = !1);
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - (i ? 0 : (
    // RTL <body> scrollbar.
    Vi(e, n)
  )), s = n.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Ql(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: r
  } = e;
  const s = r === "fixed", o = G(n), a = t ? Re(t.floating) : !1;
  if (n === o || a && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = J(1);
  const u = J(0), d = X(n);
  if ((d || !d && !s) && ((Mt(n) !== "body" || ne(o)) && (l = Me(n)), X(n))) {
    const p = wt(n);
    c = St(n), u.x = p.x + n.clientLeft, u.y = p.y + n.clientTop;
  }
  const f = o && !d && !s ? os(o, l, !0) : J(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function tc(e) {
  return Array.from(e.getClientRects());
}
function ec(e) {
  const t = G(e), i = Me(e), n = e.ownerDocument.body, r = mt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = mt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Vi(e);
  const a = -i.scrollTop;
  return j(n).direction === "rtl" && (o += mt(t.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function ic(e, t) {
  const i = F(e), n = G(e), r = i.visualViewport;
  let s = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Fi();
    (!c || c && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function nc(e, t) {
  const i = wt(e, !0, t === "fixed"), n = i.top + e.clientTop, r = i.left + e.clientLeft, s = X(e) ? St(e) : J(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = n * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function yn(e, t, i) {
  let n;
  if (t === "viewport")
    n = ic(e, i);
  else if (t === "document")
    n = ec(G(e));
  else if (W(t))
    n = nc(t, i);
  else {
    const r = ss(e);
    n = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return Se(n);
}
function as(e, t) {
  const i = at(e);
  return i === t || !W(i) || Ot(i) ? !1 : j(i).position === "fixed" || as(i, t);
}
function rc(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = Gt(e, [], !1).filter((a) => W(a) && Mt(a) !== "body"), r = null;
  const s = j(e).position === "fixed";
  let o = s ? at(e) : e;
  for (; W(o) && !Ot(o); ) {
    const a = j(o), l = zi(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || ne(o) && !l && as(e, o)) ? n = n.filter((u) => u !== o) : r = a, o = at(o);
  }
  return t.set(e, n), n;
}
function sc(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: r
  } = e;
  const o = [...i === "clippingAncestors" ? Re(t) ? [] : rc(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = yn(t, u, r);
    return c.top = mt(d.top, c.top), c.right = At(d.right, c.right), c.bottom = At(d.bottom, c.bottom), c.left = mt(d.left, c.left), c;
  }, yn(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function oc(e) {
  const {
    width: t,
    height: i
  } = rs(e);
  return {
    width: t,
    height: i
  };
}
function ac(e, t, i) {
  const n = X(t), r = G(t), s = i === "fixed", o = wt(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = J(0);
  function c() {
    l.x = Vi(r);
  }
  if (n || !n && !s)
    if ((Mt(t) !== "body" || ne(r)) && (a = Me(t)), n) {
      const p = wt(t, !0, s, t);
      l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
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
function qe(e) {
  return j(e).position === "static";
}
function wn(e, t) {
  if (!X(e) || j(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return G(e) === i && (i = i.ownerDocument.body), i;
}
function ls(e, t) {
  const i = F(e);
  if (Re(e))
    return i;
  if (!X(e)) {
    let r = at(e);
    for (; r && !Ot(r); ) {
      if (W(r) && !qe(r))
        return r;
      r = at(r);
    }
    return i;
  }
  let n = wn(e, t);
  for (; n && Jl(n) && qe(n); )
    n = wn(n, t);
  return n && Ot(n) && qe(n) && !zi(n) ? i : n || Xl(e) || i;
}
const lc = async function(e) {
  const t = this.getOffsetParent || ls, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: ac(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function cc(e) {
  return j(e).direction === "rtl";
}
const uc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ql,
  getDocumentElement: G,
  getClippingRect: sc,
  getOffsetParent: ls,
  getElementRects: lc,
  getClientRects: tc,
  getDimensions: oc,
  getScale: St,
  isElement: W,
  isRTL: cc
};
function cs(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function dc(e, t) {
  let i = null, n;
  const r = G(e);
  function s() {
    var a;
    clearTimeout(n), (a = i) == null || a.disconnect(), i = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = e.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: p
    } = c;
    if (a || t(), !f || !p)
      return;
    const y = de(d), w = de(r.clientWidth - (u + f)), m = de(r.clientHeight - (d + p)), g = de(u), x = {
      rootMargin: -y + "px " + -w + "px " + -m + "px " + -g + "px",
      threshold: mt(0, At(1, l)) || 1
    };
    let E = !0;
    function _(b) {
      const v = b[0].intersectionRatio;
      if (v !== l) {
        if (!E)
          return o();
        v ? o(!1, v) : n = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      v === 1 && !cs(c, e.getBoundingClientRect()) && o(), E = !1;
    }
    try {
      i = new IntersectionObserver(_, {
        ...x,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      i = new IntersectionObserver(_, x);
    }
    i.observe(e);
  }
  return o(!0), s;
}
function fc(e, t, i, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Bi(e), u = r || s ? [...c ? Gt(c) : [], ...Gt(t)] : [];
  u.forEach((g) => {
    r && g.addEventListener("scroll", i, {
      passive: !0
    }), s && g.addEventListener("resize", i);
  });
  const d = c && a ? dc(c, i) : null;
  let f = -1, p = null;
  o && (p = new ResizeObserver((g) => {
    let [h] = g;
    h && h.target === c && p && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = p) == null || x.observe(t);
    })), i();
  }), c && !l && p.observe(c), p.observe(t));
  let y, w = l ? wt(e) : null;
  l && m();
  function m() {
    const g = wt(e);
    w && !cs(w, g) && i(), w = g, y = requestAnimationFrame(m);
  }
  return i(), () => {
    var g;
    u.forEach((h) => {
      r && h.removeEventListener("scroll", i), s && h.removeEventListener("resize", i);
    }), d?.(), (g = p) == null || g.disconnect(), p = null, l && cancelAnimationFrame(y);
  };
}
const xt = Yl, _t = Kl, Et = jl, hc = Wl, It = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: uc,
    ...i
  }, s = {
    ...r.platform,
    _c: n
  };
  return ql(e, t, {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), It(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [xt(this.pixelOffset), Et(), _t({ padding: 8 })]
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
          Array.from(n).some((s) => e.$data(s)?.open) || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || It(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [xt(this.pixelOffset), Et(), _t({ padding: 8 })]
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function bc(e) {
  e.data("rzEventViewer", () => ({
    eventNames: [],
    entries: [],
    error: null,
    paused: !1,
    copied: !1,
    copyTitle: "Copy",
    copiedTitle: "Copied!",
    target: "window",
    targetEl: null,
    maxEntries: 200,
    autoScroll: !0,
    pretty: !0,
    showTimestamp: !0,
    showEventMeta: !1,
    level: "info",
    filterPath: "",
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
    init() {
      if (this.target = this.$el.dataset.target || "window", this.maxEntries = Number.parseInt(this.$el.dataset.maxEntries || "200", 10), this.autoScroll = this.parseBoolean(this.$el.dataset.autoScroll, !0), this.pretty = this.parseBoolean(this.$el.dataset.pretty, !0), this.showTimestamp = this.parseBoolean(this.$el.dataset.showTimestamp, !0), this.showEventMeta = this.parseBoolean(this.$el.dataset.showEventMeta, !1), this.level = this.$el.dataset.level || "info", this.filterPath = this.$el.dataset.filter || "", this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, this.eventNames = this.resolveEventNames(), this.eventNames.length === 0) {
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
        const o = n.trim();
        if (o.startsWith("["))
          try {
            const a = JSON.parse(o);
            if (Array.isArray(a))
              for (const l of a)
                typeof l == "string" ? t.push(l.trim()) : this.appendSystemEntry("Ignored non-string event name in JSON array.");
          } catch {
            this.appendSystemEntry("Failed to parse JSON event names; treating as CSV."), t.push(...o.split(",").map((a) => a.trim()));
          }
        else
          t.push(...o.split(",").map((a) => a.trim()));
      }
      const r = [], s = /* @__PURE__ */ new Set();
      for (const o of t)
        !o || s.has(o) || (s.add(o), r.push(o));
      return r;
    },
    resolveTargetElement(t) {
      return t === "window" ? window : t === "document" ? document : document.querySelector(t);
    },
    createHandler(t) {
      return (i) => {
        if (this.paused)
          return;
        const n = i?.type || t, r = i instanceof CustomEvent ? i.detail : i?.detail, s = this.applyFilter(r, this.filterPath);
        this.entries.push(this.buildEntry(n, s)), this.enforceMaxEntries(), this.scrollToBottom();
      };
    },
    buildEntry(t, i) {
      const n = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "", r = this.stringifyDetail(i), s = this.showEventMeta ? ` [level:${this.level}]` : "";
      return {
        id: `${t}-${this._entryId++}`,
        type: t,
        level: this.level,
        hasTimestamp: this.showTimestamp,
        timestamp: n,
        body: `${r}${s}`
      };
    },
    enforceMaxEntries() {
      this.entries.length > this.maxEntries && this.entries.splice(0, this.entries.length - this.maxEntries);
    },
    scrollToBottom() {
      this.autoScroll && this.$nextTick(() => {
        this.$refs.console && (this.$refs.console.scrollTop = this.$refs.console.scrollHeight);
      });
    },
    stringifyDetail(t) {
      if (t === void 0)
        return "undefined";
      if (t === null)
        return "null";
      if (typeof t == "string")
        return t;
      if (typeof t == "number" || typeof t == "boolean")
        return String(t);
      try {
        return this.pretty ? JSON.stringify(t, null, 2) : JSON.stringify(t);
      } catch {
        return "[unserializable detail]";
      }
    },
    applyFilter(t, i) {
      if (!i || i.trim().length === 0)
        return t;
      const n = i.split(".").map((s) => s.trim()).filter(Boolean);
      let r = t;
      for (const s of n) {
        if (r == null || typeof r != "object" || !(s in r))
          return;
        r = r[s];
      }
      return r;
    },
    appendSystemEntry(t) {
      this.entries.push({
        id: `system-${this._entryId++}`,
        type: "system",
        level: "info",
        hasTimestamp: !1,
        timestamp: "",
        body: t
      }), this.enforceMaxEntries(), this.scrollToBottom();
    },
    clearEntries() {
      this.entries = [];
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
      const t = this.entries.map((i) => `${i.hasTimestamp ? `${i.timestamp} ` : ""}${i.type} ${i.body}`).join(`
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
function vc(e) {
  e.data("rzEmpty", () => {
  });
}
function yc(e) {
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
        const i = (r, s) => {
          r.forEach((o) => {
            o.isIntersecting && t.setCurrentHeading(t.headingId);
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
function wc(e) {
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
function xc(e) {
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
function _c(e, t) {
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
function Ec(e) {
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
        !n || !i || It(i, n, {
          placement: "bottom-start",
          middleware: [xt(4), Et(), _t({ padding: 8 })]
        }).then(({ x: r, y: s }) => {
          Object.assign(n.style, { left: `${r}px`, top: `${s}px` });
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
        const r = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), s = r.indexOf(i);
        if (s < 0) return;
        const o = t.key === "ArrowRight" ? (s + 1) % r.length : (s - 1 + r.length) % r.length, a = r[o];
        if (!a) return;
        a.focus(), this.currentMenuValue && this.openMenu(this.getMenuValueFromTrigger(a), a), t.preventDefault();
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
      (this.$el.closest(`[role="group"][data-radio-group="${n}"]`)?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${n}"]`) ?? []).forEach((o) => {
        o.setAttribute("data-state", "unchecked"), o.setAttribute("aria-checked", "false");
      }), i.setAttribute("data-state", "checked"), i.setAttribute("aria-checked", "true");
    },
    buildPathToSubTrigger(t) {
      const i = [];
      let n = t.closest('[data-slot="menubar-sub"]');
      for (; n; ) {
        const r = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!r?.id) break;
        i.unshift(r.id), n = n.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
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
      const i = t.currentTarget, n = this.buildPathToSubTrigger(i), r = this.openPath.length === n.length && this.openPath.every((s, o) => s === n[o]);
      this.setOpenPath(r ? n.slice(0, -1) : n);
    },
    handleSubTriggerKeyRight(t) {
      this.handleSubTriggerPointerEnter(t), this.$nextTick(() => {
        t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), r = n < 0 || n >= i.length - 1 ? 0 : n + 1;
      i[r]?.focus();
    },
    focusPreviousItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), r = n <= 0 ? i.length - 1 : n - 1;
      i[r]?.focus();
    },
    handleSubContentLeftKey(t) {
      const n = t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!n) return;
      const r = this.buildPathToSubTrigger(n);
      this.setOpenPath(r.slice(0, -1)), n.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((n) => {
        const r = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), s = n.querySelector(':scope > [data-slot="menubar-sub-content"]'), o = r?.id, a = !!o && this.openPath.includes(o);
        this.setTriggerState(r, a), s && (s.hidden = !a, s.style.display = a ? "" : "none", s.dataset.state = a ? "open" : "closed", a && r && It(r, s, {
          placement: "right-start",
          middleware: [xt(4), Et(), _t({ padding: 8 })]
        }).then(({ x: l, y: c }) => {
          Object.assign(s.style, { left: `${l}px`, top: `${c}px` });
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
function Ic(e, t) {
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
      const r = n.querySelector('[x-ref^="trigger_"]');
      if (r) {
        const s = r.getAttribute("x-ref").replace("trigger_", "");
        this.activeItemId !== s && !this.isClosing && requestAnimationFrame(() => this.openMenu(s));
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
      !o || !a || (It(o, a, {
        placement: "bottom-start",
        middleware: [xt(6), Et(), _t({ padding: 8 })]
      }).then(({ x: l, y: c }) => {
        Object.assign(a.style, { left: `${l}px`, top: `${c}px` });
      }), a.style.display = "block", s ? a.setAttribute("data-motion", "fade-in") : a.setAttribute("data-motion", `from-${r}`), this.$nextTick(() => {
        o.setAttribute("aria-expanded", "true"), o.dataset.state = "open";
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
      const r = this._contentEl(i);
      r && (r.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        r.style.display = "none";
      }, 150)), this.open = !1, this.activeItemId = null, this.prevIndex = null, setTimeout(() => {
        this.isClosing = !1;
      }, 150);
    }
  }));
}
function Tc(e) {
  e.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (t) => {
        this.ariaExpanded = t.toString(), t && this.$nextTick(() => this.updatePosition());
      });
    },
    /**
     * Executes the `updatePosition` operation.
     * @returns {any} Returns the result of `updatePosition` when applicable.
     */
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const t = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(xt({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: r
      })), o && c.push(Et()), a && c.push(_t({ padding: l })), It(this.triggerEl, this.contentEl, {
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
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.open = !this.open;
    },
    /**
     * Executes the `handleOutsideClick` operation.
     * @returns {any} Returns the result of `handleOutsideClick` when applicable.
     */
    handleOutsideClick() {
      this.open && (this.open = !1);
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
    handleWindowEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function Sc(e) {
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
function $c(e) {
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
function Ac(e) {
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
          const i = t.scrollHeight - t.clientHeight, n = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, r = t.scrollTop / i * Math.max(n, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${r}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > t.clientWidth) {
          const i = t.scrollWidth - t.clientWidth, n = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, r = t.scrollLeft / i * Math.max(n, 0);
          this.$refs.thumbX.style.transform = `translate3d(${r}px, 0, 0)`;
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
      const r = this.$refs.viewport, s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!r || !s) return;
      const o = n.getBoundingClientRect();
      if (i === "vertical") {
        const a = t.clientY - o.top - s.offsetHeight / 2, l = n.clientHeight - s.offsetHeight, c = r.scrollHeight - r.clientHeight;
        r.scrollTop = a / Math.max(l, 1) * c;
      } else {
        const a = t.clientX - o.left - s.offsetWidth / 2, l = n.clientWidth - s.offsetWidth, c = r.scrollWidth - r.clientWidth;
        r.scrollLeft = a / Math.max(l, 1) * c;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(t) {
      const i = t.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`], r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || !r || r.hidden) return;
      const s = n.getBoundingClientRect();
      this._dragAxis = i, this._dragPointerOffset = i === "vertical" ? t.clientY - s.top : t.clientX - s.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(t) {
      const i = this._dragAxis, n = this.$refs.viewport, r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`], s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!i || !n || !r || !s || r.hidden) return;
      const o = r.getBoundingClientRect();
      if (i === "vertical") {
        const a = t.clientY - o.top, l = r.clientHeight - s.offsetHeight, c = n.scrollHeight - n.clientHeight;
        n.scrollTop = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
      } else {
        const a = t.clientX - o.left, l = r.clientWidth - s.offsetWidth, c = n.scrollWidth - n.clientWidth;
        n.scrollLeft = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
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
function Oc(e) {
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
function Dc(e) {
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
function kc(e) {
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
function Nc(e) {
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
      const r = Number(n);
      return Number.isFinite(r) ? r : i;
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
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = fc(this.triggerEl, this.contentEl, () => {
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
        xt({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && t.push(Et()), this.enableShift && t.push(_t({ padding: this.shiftPadding })), this.arrowEl && t.push(hc({ element: this.arrowEl })), It(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: t
      }).then(({ x: i, y: n, placement: r, middlewareData: s }) => {
        if (this.side = r.split("-")[0], this.contentEl.dataset.side = this.side, this.contentEl.style.position = this.strategy, this.contentEl.style.left = `${i}px`, this.contentEl.style.top = `${n}px`, !this.arrowEl || !s.arrow) return;
        const o = s.arrow.x, a = s.arrow.y, c = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        }[this.side] || "bottom";
        this.arrowEl.style.left = o != null ? `${o}px` : "", this.arrowEl.style.top = a != null ? `${a}px` : "", this.arrowEl.style.right = "", this.arrowEl.style.bottom = "", this.arrowEl.style[c] = "-5px";
      });
    }
  }));
}
function Lc(e) {
  e.data("rzSidebar", () => ({
    open: !1,
    openMobile: !1,
    isMobile: !1,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas", this.shortcut = this.$el.dataset.shortcut || "b", this.cookieName = this.$el.dataset.cookieName || "sidebar_state", this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const t = this.cookieName ? document.cookie.split("; ").find((n) => n.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, i = this.$el.dataset.defaultOpen === "true";
      this.open = t != null ? t === "true" : i, this.checkIfMobile(), window.addEventListener("keydown", (n) => {
        (n.ctrlKey || n.metaKey) && n.key.toLowerCase() === this.shortcut.toLowerCase() && (n.preventDefault(), this.toggle());
      }), this.$watch("open", (n) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${n}; path=/; max-age=31536000`);
      });
    },
    /**
     * Executes the `checkIfMobile` operation.
     * @returns {any} Returns the result of `checkIfMobile` when applicable.
     */
    checkIfMobile() {
      this.isMobile = window.innerWidth < this.mobileBreakpoint;
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.isMobile ? this.openMobile = !this.openMobile : this.open = !this.open;
    },
    /**
     * Executes the `close` operation.
     * @returns {any} Returns the result of `close` when applicable.
     */
    close() {
      this.isMobile && (this.openMobile = !1);
    },
    /**
     * Executes the `isMobileOpen` operation.
     * @returns {any} Returns the result of `isMobileOpen` when applicable.
     */
    isMobileOpen() {
      return this.openMobile;
    },
    /**
     * Executes the `desktopState` operation.
     * @returns {any} Returns the result of `desktopState` when applicable.
     */
    desktopState() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Executes the `mobileState` operation.
     * @returns {any} Returns the result of `mobileState` when applicable.
     */
    mobileState() {
      return this.openMobile ? "open" : "closed";
    },
    /**
     * Executes the `getCollapsibleAttribute` operation.
     * @returns {any} Returns the result of `getCollapsibleAttribute` when applicable.
     */
    getCollapsibleAttribute() {
      return this.desktopState() === "collapsed" ? this.collapsible : "";
    }
  }));
}
function Rc(e) {
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
        const r = document.getElementById(t);
        if (r)
          try {
            i = JSON.parse(r.textContent || "[]");
          } catch (s) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, s);
          }
      }
      i.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      const n = i.map((r) => ({
        ...r,
        id: this.resolveStableItemId(r),
        isDataItem: !0
      }));
      this.registerItems(n, { suppressFilter: !0 }), this.itemsUrl && this.fetchTrigger === "immediate" ? this.fetchItems() : this.filterAndSortItems(), this.$watch("search", (r) => {
        if (this.serverFiltering) {
          clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => {
            this.fetchItems(r);
          }, 300);
          return;
        }
        this.filterAndSortItems();
      }), this.$watch("selectedIndex", (r, s) => {
        if (s > -1) {
          const o = this.filteredItems[s];
          if (o) {
            const a = this.$el.querySelector(`[data-command-item-id="${o.id}"]`);
            a && (a.removeAttribute("data-selected"), a.setAttribute("aria-selected", "false"));
          }
        }
        if (r > -1 && this.filteredItems[r]) {
          const o = this.filteredItems[r];
          this.activeDescendantId = o.id;
          const a = this.$el.querySelector(`[data-command-item-id="${o.id}"]`);
          a && (a.setAttribute("data-selected", "true"), a.setAttribute("aria-selected", "true"), a.scrollIntoView({ block: "nearest" }));
          const l = o.value;
          this.selectedValue !== l && (this.selectedValue = l, this.$dispatch("rz:command:select", { value: l }));
        } else
          this.activeDescendantId = null, this.selectedValue = null;
      }), this.$watch("selectedValue", (r) => {
        const s = this.filteredItems.findIndex((o) => o.value === r);
        this.selectedIndex !== s && (this.selectedIndex = s);
      }), this.$watch("filteredItems", (r) => {
        this.isOpen = r.length > 0 || this.isLoading, this.isEmpty = r.length === 0, this._listInstance && this._listInstance.renderList();
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
      let r = 0;
      for (const s of t) {
        if (!s)
          continue;
        const o = this.resolveStableItemId(s);
        if (this.itemsById.has(o))
          continue;
        const a = this.normalizeItem(s);
        a._order = this.items.length, this.items.push(a), this.itemsById.set(a.id, a), r++;
      }
      r > 0 && this.selectedIndex === -1 && (this.selectedIndex = 0), !n && !this.serverFiltering && this.filterAndSortItems();
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
      let r = [];
      if (!this.shouldFilter || !t)
        r = this.items.slice();
      else {
        const a = [];
        for (const l of n) {
          if (l.forceMount)
            continue;
          const c = this.fastScore(l._searchText, t);
          c > 0 && a.push([l, c]);
        }
        a.sort((l, c) => c[1] !== l[1] ? c[1] - l[1] : (l[0]._order || 0) - (c[0]._order || 0)), r = a.map(([l]) => l);
      }
      const s = this.items.filter((a) => a.forceMount), o = [...r, ...s];
      if (this._lastSearch = t, this._lastMatchedItems = o, this.filteredItems = o.slice(0, this.maxRender), this.updateFilteredIndexes(), this.selectedValue) {
        const a = this.filteredItems.findIndex((l) => l.value === this.selectedValue);
        this.selectedIndex = a > -1 ? a : this.filteredItems.length > 0 ? 0 : -1;
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
          const r = await n.json();
          this.serverFiltering && (this.items = this.items.filter((o) => !o.isDataItem), this.itemsById = new Map(this.items.map((o) => [o.id, o])));
          const s = r.map((o) => ({
            ...o,
            id: this.resolveStableItemId(o),
            isDataItem: !0
          }));
          this.registerItems(s, { suppressFilter: !0 }), this._dataFetched = !0;
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
      const n = i.dataset.commandItemId, r = this.filteredIndexById.get(n) ?? -1;
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && (this.selectedIndex = r, this.$dispatch("rz:command:execute", { value: s.value }));
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
      const n = i.dataset.commandItemId, r = this.filteredIndexById.get(n) ?? -1;
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && this.selectedIndex !== r && (this.selectedIndex = r);
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
function Mc(e) {
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
      const i = this.$el.querySelector("template"), n = i?.content ? i.content.cloneNode(!0) : null, r = this.$el.dataset.value || this.$el.textContent.trim(), s = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
      this.itemData = {
        id: this.resolveItemId(r, s),
        value: r,
        name: s,
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
function Pc(e) {
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
      const t = this.parent.filteredItems || [], i = this.parent.groupTemplates || /* @__PURE__ */ new Map(), n = this.$el, r = document.createDocumentFragment(), s = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      for (const c of t) {
        const u = c.group || "__ungrouped__";
        s.has(u) || s.set(u, []), s.get(u).push(c);
      }
      const o = Array.from(s.entries()).filter(([, c]) => c.length > 0), a = o.filter(([c]) => c !== "__ungrouped__").length;
      let l = 0;
      o.forEach(([c, u]) => {
        const d = c !== "__ungrouped__";
        if (d && this.separatorTemplate && a > 1 && l > 0) {
          const p = this.separatorTemplate.cloneNode(!0);
          p.setAttribute("data-dynamic-item", "true"), r.appendChild(p);
        }
        const f = document.createElement("div");
        if (f.setAttribute("role", "group"), f.setAttribute("data-dynamic-item", "true"), f.setAttribute("data-slot", "command-group"), d) {
          const p = i.get(c);
          if (p?.templateContent) {
            const y = p.templateContent.cloneNode(!0);
            p.headingId && f.setAttribute("aria-labelledby", p.headingId), f.appendChild(y);
          }
        }
        u.forEach((p, y) => {
          const w = this.parent.filteredIndexById.get(p.id) ?? y, m = this.ensureRow(p);
          m && (this.applyItemAttributes(m, p, w), f.appendChild(m));
        }), r.appendChild(f), d && (l += 1);
      }), n.querySelectorAll("[data-dynamic-item]").forEach((c) => c.remove()), n.appendChild(r), window.htmx && window.htmx.process(n);
    }
  }));
}
function zc(e) {
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
      const i = this.$el.querySelector("template"), n = i?.dataset.headingId || "", r = i?.content ? i.content.cloneNode(!0) : null;
      this.heading && r && this.parent.registerGroupTemplate(this.heading, r, n);
    }
  }));
}
async function Fc(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function nt(e, t, i) {
  let n, r;
  typeof t == "function" ? n = { success: t } : t && typeof t == "object" ? n = t : typeof t == "string" && (r = t), !r && typeof i == "string" && (r = i);
  const s = Array.isArray(e) ? e : [e];
  return Fc(s).then((o) => (rt.isDefined(o) || rt(s, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: r,
    inlineStyleNonce: r
  }), new Promise((a, l) => {
    rt.ready(o, {
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
function Bc(e) {
  _l(e), El(e), Il(e), Tl(e), Sl(e), Cl(e, nt), $l(e), Al(e, nt), Ol(e, nt), Dl(e), kl(e, nt), Nl(e, nt), Ll(e, nt), Rl(e), pc(e), mc(e), gc(e), bc(e), vc(e), yc(e), wc(e), xc(e), _c(e, nt), Ec(e), Ic(e), Tc(e), Sc(e), Cc(e), $c(e), Ac(e), Oc(e), Dc(e), kc(e), Nc(e), Lc(e), Rc(e), Mc(e), Pc(e), zc(e);
}
function Vc(e) {
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
const fe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map();
let xn = !1;
function Hc(e) {
  return he.has(e) || he.set(
    e,
    import(e).catch((t) => {
      throw he.delete(e), t;
    })
  ), he.get(e);
}
function _n(e, t) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    e,
    () => Hc(t).catch((n) => (console.error(
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
function qc(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = fe.get(e);
  i && i.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${i.path}
  New:      ${t}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const r = !i || i.path !== t;
    if (!(i && i.loaderSet && !r)) {
      const o = _n(e, t);
      fe.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  fe.set(e, { path: t, loaderSet: !1 }), xn || (xn = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of fe)
        if (!s.loaderSet) {
          const o = _n(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Wc(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: r }) => {
    const s = i.find((g) => g.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (g) => {
      t.dataset.mobile = g ? "true" : "false", t.dataset.screen = g ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (g) => {
      if (!a) return;
      const h = u();
      h && (h[n] = g);
    }, f = (g) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: g, width: window.innerWidth, breakpoint: o }
        })
      );
    }, p = window.matchMedia(`(max-width: ${o - 1}px)`), y = () => {
      const g = l();
      c(g), d(g), f(g);
    };
    y();
    const w = () => y(), m = () => y();
    p.addEventListener("change", w), window.addEventListener("resize", m, { passive: !0 }), r(() => {
      p.removeEventListener("change", w), window.removeEventListener("resize", m);
    });
  });
}
function jc(e) {
  const t = (i, { expression: n, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (w, m, g) => {
      const x = m.replace(/\[(\d+)\]/g, ".$1").split("."), E = x.pop();
      let _ = w;
      for (const b of x)
        (_[b] == null || typeof _[b] != "object") && (_[b] = isFinite(+b) ? [] : {}), _ = _[b];
      _[E] = g;
    }, l = e.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = n.split(",").map((w) => w.trim()).filter(Boolean).map((w) => {
      const m = w.split("->").map((g) => g.trim());
      return m.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', w), null) : { parentPath: m[0], childPath: m[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), p = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), y = [];
    d.forEach((w, m) => {
      const g = p[m];
      if (f) {
        const E = e.evaluate(i, w.childPath, { scope: c });
        g.fromChild = !0, a(u, w.parentPath, E), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const E = e.evaluate(i, w.parentPath, { scope: u });
        g.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = e.evaluate(i, w.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), x = o(() => {
        const E = e.evaluate(i, w.childPath, { scope: c });
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
      y.push(h, x);
    }), s(() => {
      for (const w of y)
        try {
          w && w();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class Uc {
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
const z = new Uc();
function Yc(e) {
  z.init(), e.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: z.mode,
    _prefersDark: z.prefersDark,
    _effectiveDark: z.effectiveDark,
    // Listener reference to prevent duplicate registration
    _onThemeChange: null,
    init() {
      this._onThemeChange || (this._onThemeChange = () => this._refresh(), window.addEventListener(z.eventName, this._onThemeChange)), this._refresh();
    },
    _refresh() {
      this._mode = z.mode, this._prefersDark = z.prefersDark, this._effectiveDark = z.effectiveDark;
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
      z.setLight();
    },
    setDark() {
      z.setDark();
    },
    setAuto() {
      z.setAuto();
    },
    toggle() {
      z.toggle();
    }
  });
}
let Wt = null;
function Kc(e) {
  return Wt || (e.plugin(_a), e.plugin(Ca), e.plugin(Ka), e.plugin(nl), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Yc(e);
  }), Bc(e), Wc(e), jc(e), Wt = {
    Alpine: e,
    require: nt,
    toast: gl,
    $data: wl,
    props: Vc,
    registerAsyncComponent: qc,
    theme: z
  }, typeof window < "u" && (z.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...Wt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Wt);
}
const Gc = Kc(Lr);
Lr.start();
export {
  Gc as default
};
