var qe = !1, Ue = !1, dt = [], je = -1;
function ds(t) {
  fs(t);
}
function fs(t) {
  dt.includes(t) || dt.push(t), ps();
}
function hs(t) {
  let e = dt.indexOf(t);
  e !== -1 && e > je && dt.splice(e, 1);
}
function ps() {
  !Ue && !qe && (qe = !0, queueMicrotask(ms));
}
function ms() {
  qe = !1, Ue = !0;
  for (let t = 0; t < dt.length; t++)
    dt[t](), je = t;
  dt.length = 0, je = -1, Ue = !1;
}
var Dt, It, kt, Ei, Ye = !0;
function gs(t) {
  Ye = !1, t(), Ye = !0;
}
function bs(t) {
  Dt = t.reactive, kt = t.release, It = (e) => t.effect(e, { scheduler: (n) => {
    Ye ? ds(n) : n();
  } }), Ei = t.raw;
}
function Wn(t) {
  It = t;
}
function vs(t) {
  let e = () => {
  };
  return [(i) => {
    let r = It(i);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(r), e = () => {
      r !== void 0 && (t._x_effects.delete(r), kt(r));
    }, r;
  }, () => {
    e();
  }];
}
function Ti(t, e) {
  let n = !0, i, r = It(() => {
    let s = t();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      e(s, i), i = s;
    }), n = !1;
  });
  return () => kt(r);
}
var Ii = [], Si = [], Ci = [];
function ys(t) {
  Ci.push(t);
}
function gn(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, Si.push(e));
}
function $i(t) {
  Ii.push(t);
}
function Ai(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function Oi(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, i]) => {
    (e === void 0 || e.includes(n)) && (i.forEach((r) => r()), delete t._x_attributeCleanups[n]);
  });
}
function ws(t) {
  for (t._x_effects?.forEach(hs); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var bn = new MutationObserver(_n), vn = !1;
function yn() {
  bn.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), vn = !0;
}
function Di() {
  _s(), bn.disconnect(), vn = !1;
}
var Mt = [];
function _s() {
  let t = bn.takeRecords();
  Mt.push(() => t.length > 0 && _n(t));
  let e = Mt.length;
  queueMicrotask(() => {
    if (Mt.length === e)
      for (; Mt.length > 0; )
        Mt.shift()();
  });
}
function O(t) {
  if (!vn)
    return t();
  Di();
  let e = t();
  return yn(), e;
}
var wn = !1, be = [];
function xs() {
  wn = !0;
}
function Es() {
  wn = !1, _n(be), be = [];
}
function _n(t) {
  if (wn) {
    be = be.concat(t);
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
    Oi(o, s);
  }), i.forEach((s, o) => {
    Ii.forEach((a) => a(o, s));
  });
  for (let s of n)
    e.some((o) => o.contains(s)) || Si.forEach((o) => o(s));
  for (let s of e)
    s.isConnected && Ci.forEach((o) => o(s));
  e = null, n = null, i = null, r = null;
}
function ki(t) {
  return Qt(Ct(t));
}
function Zt(t, e, n) {
  return t._x_dataStack = [e, ...Ct(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((i) => i !== e);
  };
}
function Ct(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? Ct(t.host) : t.parentNode ? Ct(t.parentNode) : [];
}
function Qt(t) {
  return new Proxy({ objects: t }, Ts);
}
var Ts = {
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
    return e == "toJSON" ? Is : Reflect.get(
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
function Is() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function Ni(t) {
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
function Ri(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return t(this.initialValue, () => Ss(i, r), (o) => Ke(i, r, o), r, s);
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
function Ss(t, e) {
  return e.split(".").reduce((n, i) => n[i], t);
}
function Ke(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Ke(t[e[0]], e.slice(1), n);
  }
}
var Li = {};
function j(t, e) {
  Li[t] = e;
}
function Je(t, e) {
  let n = Cs(e);
  return Object.entries(Li).forEach(([i, r]) => {
    Object.defineProperty(t, `$${i}`, {
      get() {
        return r(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function Cs(t) {
  let [e, n] = Hi(t), i = { interceptor: Ri, ...e };
  return gn(t, n), i;
}
function $s(t, e, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    Kt(r, t, e);
  }
}
function Kt(t, e, n = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: n }
  ), console.warn(`Alpine Expression Error: ${t.message}

${n ? 'Expression: "' + n + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var pe = !0;
function Pi(t) {
  let e = pe;
  pe = !1;
  let n = t();
  return pe = e, n;
}
function ft(t, e, n = {}) {
  let i;
  return M(t, e)((r) => i = r, n), i;
}
function M(...t) {
  return Mi(...t);
}
var Mi = zi;
function As(t) {
  Mi = t;
}
function zi(t, e) {
  let n = {};
  Je(n, t);
  let i = [n, ...Ct(t)], r = typeof e == "function" ? Os(i, e) : ks(i, e, t);
  return $s.bind(null, t, e, r);
}
function Os(t, e) {
  return (n = () => {
  }, { scope: i = {}, params: r = [], context: s } = {}) => {
    let o = e.apply(Qt([i, ...t]), r);
    ve(n, o);
  };
}
var Me = {};
function Ds(t, e) {
  if (Me[t])
    return Me[t];
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
      return Kt(o, e, t), Promise.resolve();
    }
  })();
  return Me[t] = s, s;
}
function ks(t, e, n) {
  let i = Ds(e, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    i.result = void 0, i.finished = !1;
    let l = Qt([s, ...t]);
    if (typeof i == "function") {
      let c = i.call(a, i, l).catch((u) => Kt(u, n, e));
      i.finished ? (ve(r, i.result, l, o, n), i.result = void 0) : c.then((u) => {
        ve(r, u, l, o, n);
      }).catch((u) => Kt(u, n, e)).finally(() => i.result = void 0);
    }
  };
}
function ve(t, e, n, i, r) {
  if (pe && typeof e == "function") {
    let s = e.apply(n, i);
    s instanceof Promise ? s.then((o) => ve(t, o, n, i)).catch((o) => Kt(o, r, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
var xn = "x-";
function Nt(t = "") {
  return xn + t;
}
function Ns(t) {
  xn = t;
}
var ye = {};
function D(t, e) {
  return ye[t] = e, {
    before(n) {
      if (!ye[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const i = ut.indexOf(n);
      ut.splice(i >= 0 ? i : ut.indexOf("DEFAULT"), 0, t);
    }
  };
}
function Rs(t) {
  return Object.keys(ye).includes(t);
}
function En(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Fi(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), e = e.concat(s);
  }
  let i = {};
  return e.map(qi((s, o) => i[s] = o)).filter(ji).map(Ms(i, n)).sort(zs).map((s) => Ps(t, s));
}
function Fi(t) {
  return Array.from(t).map(qi()).filter((e) => !ji(e));
}
var Xe = !1, Ut = /* @__PURE__ */ new Map(), Bi = Symbol();
function Ls(t) {
  Xe = !0;
  let e = Symbol();
  Bi = e, Ut.set(e, []);
  let n = () => {
    for (; Ut.get(e).length; )
      Ut.get(e).shift()();
    Ut.delete(e);
  }, i = () => {
    Xe = !1, n();
  };
  t(n), i();
}
function Hi(t) {
  let e = [], n = (a) => e.push(a), [i, r] = vs(t);
  return e.push(r), [{
    Alpine: te,
    effect: i,
    cleanup: n,
    evaluateLater: M.bind(M, t),
    evaluate: ft.bind(ft, t)
  }, () => e.forEach((a) => a())];
}
function Ps(t, e) {
  let n = () => {
  }, i = ye[e.type] || n, [r, s] = Hi(t);
  Ai(t, e.original, s);
  let o = () => {
    t._x_ignore || t._x_ignoreSelf || (i.inline && i.inline(t, e, r), i = i.bind(i, t, e, r), Xe ? Ut.get(Bi).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Vi = (t, e) => ({ name: n, value: i }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: i }), Wi = (t) => t;
function qi(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: i, value: r } = Ui.reduce((s, o) => o(s), { name: e, value: n });
    return i !== e && t(i, e), { name: i, value: r };
  };
}
var Ui = [];
function Tn(t) {
  Ui.push(t);
}
function ji({ name: t }) {
  return Yi().test(t);
}
var Yi = () => new RegExp(`^${xn}([^:^.]+)\\b`);
function Ms(t, e) {
  return ({ name: n, value: i }) => {
    let r = n.match(Yi()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = e || t[n] || n;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: i,
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
function zs(t, e) {
  let n = ut.indexOf(t.type) === -1 ? Ge : t.type, i = ut.indexOf(e.type) === -1 ? Ge : e.type;
  return ut.indexOf(n) - ut.indexOf(i);
}
function jt(t, e, n = {}) {
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
function bt(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((r) => bt(r, e));
    return;
  }
  let n = !1;
  if (e(t, () => n = !0), n)
    return;
  let i = t.firstElementChild;
  for (; i; )
    bt(i, e), i = i.nextElementSibling;
}
function H(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var qn = !1;
function Fs() {
  qn && H("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), qn = !0, document.body || H("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), jt(document, "alpine:init"), jt(document, "alpine:initializing"), yn(), ys((e) => Z(e, bt)), gn((e) => Lt(e)), $i((e, n) => {
    En(e, n).forEach((i) => i());
  });
  let t = (e) => !Ce(e.parentElement, !0);
  Array.from(document.querySelectorAll(Xi().join(","))).filter(t).forEach((e) => {
    Z(e);
  }), jt(document, "alpine:initialized"), setTimeout(() => {
    Ws();
  });
}
var In = [], Ki = [];
function Ji() {
  return In.map((t) => t());
}
function Xi() {
  return In.concat(Ki).map((t) => t());
}
function Gi(t) {
  In.push(t);
}
function Zi(t) {
  Ki.push(t);
}
function Ce(t, e = !1) {
  return Rt(t, (n) => {
    if ((e ? Xi() : Ji()).some((r) => n.matches(r)))
      return !0;
  });
}
function Rt(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack && (t = t._x_teleportBack), !!t.parentElement)
      return Rt(t.parentElement, e);
  }
}
function Bs(t) {
  return Ji().some((e) => t.matches(e));
}
var Qi = [];
function Hs(t) {
  Qi.push(t);
}
var Vs = 1;
function Z(t, e = bt, n = () => {
}) {
  Rt(t, (i) => i._x_ignore) || Ls(() => {
    e(t, (i, r) => {
      i._x_marker || (n(i, r), Qi.forEach((s) => s(i, r)), En(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Vs++), i._x_ignore && r());
    });
  });
}
function Lt(t, e = bt) {
  e(t, (n) => {
    ws(n), Oi(n), delete n._x_marker;
  });
}
function Ws() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, i]) => {
    Rs(n) || i.some((r) => {
      if (document.querySelector(r))
        return H(`found "${r}", but missing ${e} plugin`), !0;
    });
  });
}
var Ze = [], Sn = !1;
function Cn(t = () => {
}) {
  return queueMicrotask(() => {
    Sn || setTimeout(() => {
      Qe();
    });
  }), new Promise((e) => {
    Ze.push(() => {
      t(), e();
    });
  });
}
function Qe() {
  for (Sn = !1; Ze.length; )
    Ze.shift()();
}
function qs() {
  Sn = !0;
}
function $n(t, e) {
  return Array.isArray(e) ? Un(t, e.join(" ")) : typeof e == "object" && e !== null ? Us(t, e) : typeof e == "function" ? $n(t, e()) : Un(t, e);
}
function Un(t, e) {
  let n = (r) => r.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), i = (r) => (t.classList.add(...r), () => {
    t.classList.remove(...r);
  });
  return e = e === !0 ? e = "" : e || "", i(n(e));
}
function Us(t, e) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(e).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function $e(t, e) {
  return typeof e == "object" && e !== null ? js(t, e) : Ys(t, e);
}
function js(t, e) {
  let n = {};
  return Object.entries(e).forEach(([i, r]) => {
    n[i] = t.style[i], i.startsWith("--") || (i = Ks(i)), t.style.setProperty(i, r);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    $e(t, n);
  };
}
function Ys(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function Ks(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function tn(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
D("transition", (t, { value: e, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Xs(t, n, e) : Js(t, i, e));
});
function Js(t, e, n) {
  tr(t, $n, ""), {
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
function Xs(t, e, n) {
  tr(t, $e);
  let i = !e.includes("in") && !e.includes("out") && !n, r = i || e.includes("in") || ["enter"].includes(n), s = i || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !i && (e = e.filter((g, h) => h < e.indexOf("out"))), e.includes("out") && !i && (e = e.filter((g, h) => h > e.indexOf("out")));
  let o = !e.includes("opacity") && !e.includes("scale"), a = o || e.includes("opacity"), l = o || e.includes("scale"), c = a ? 0 : 1, u = l ? zt(e, "scale", 95) / 100 : 1, d = zt(e, "delay", 0) / 1e3, f = zt(e, "origin", "center"), m = "opacity, transform", w = zt(e, "duration", 150) / 1e3, _ = zt(e, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (t._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${w}s`,
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
    transitionProperty: m,
    transitionDuration: `${_}s`,
    transitionTimingFunction: p
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function tr(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      en(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      en(t, e, {
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
    let o = er(t);
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
function er(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : er(e);
}
function en(t, e, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Gs(t, {
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
function Gs(t, e) {
  let n, i, r, s = tn(() => {
    O(() => {
      n = !0, i || e.before(), r || (e.end(), Qe()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: tn(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, O(() => {
    e.start(), e.during();
  }), qs(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), O(() => {
      e.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (O(() => {
        e.end();
      }), Qe(), setTimeout(t._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function zt(t, e, n) {
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
var rt = !1;
function at(t, e = () => {
}) {
  return (...n) => rt ? e(...n) : t(...n);
}
function Zs(t) {
  return (...e) => rt && t(...e);
}
var nr = [];
function Ae(t) {
  nr.push(t);
}
function Qs(t, e) {
  nr.forEach((n) => n(t, e)), rt = !0, ir(() => {
    Z(e, (n, i) => {
      i(n, () => {
      });
    });
  }), rt = !1;
}
var nn = !1;
function to(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), rt = !0, nn = !0, ir(() => {
    eo(e);
  }), rt = !1, nn = !1;
}
function eo(t) {
  let e = !1;
  Z(t, (i, r) => {
    bt(i, (s, o) => {
      if (e && Bs(s))
        return o();
      e = !0, r(s, o);
    });
  });
}
function ir(t) {
  let e = It;
  Wn((n, i) => {
    let r = e(n);
    return kt(r), () => {
    };
  }), t(), Wn(e);
}
function rr(t, e, n, i = []) {
  switch (t._x_bindings || (t._x_bindings = Dt({})), t._x_bindings[e] = n, e = i.includes("camel") ? co(e) : e, e) {
    case "value":
      no(t, n);
      break;
    case "style":
      ro(t, n);
      break;
    case "class":
      io(t, n);
      break;
    case "selected":
    case "checked":
      so(t, e, n);
      break;
    default:
      sr(t, e, n);
      break;
  }
}
function no(t, e) {
  if (lr(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = me(t.value) === e : t.checked = jn(t.value, e));
  else if (An(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => jn(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    lo(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function io(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = $n(t, e);
}
function ro(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = $e(t, e);
}
function so(t, e, n) {
  sr(t, e, n), ao(t, e, n);
}
function sr(t, e, n) {
  [null, void 0, !1].includes(n) && fo(e) ? t.removeAttribute(e) : (or(e) && (n = e), oo(t, e, n));
}
function oo(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function ao(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function lo(t, e) {
  const n = [].concat(e).map((i) => i + "");
  Array.from(t.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function co(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function jn(t, e) {
  return t == e;
}
function me(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
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
function or(t) {
  return uo.has(t);
}
function fo(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function ho(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : ar(t, e, n);
}
function po(t, e, n, i = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let r = t._x_inlineBindings[e];
    return r.extract = i, Pi(() => ft(t, r.expression));
  }
  return ar(t, e, n);
}
function ar(t, e, n) {
  let i = t.getAttribute(e);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : or(e) ? !![e, "true"].includes(i) : i;
}
function An(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function lr(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function cr(t, e) {
  let n;
  return function() {
    const i = this, r = arguments, s = function() {
      n = null, t.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, e);
  };
}
function ur(t, e) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (t.apply(i, r), n = !0, setTimeout(() => n = !1, e));
  };
}
function dr({ get: t, set: e }, { get: n, set: i }) {
  let r = !0, s, o = It(() => {
    let a = t(), l = n();
    if (r)
      i(ze(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(ze(a)) : c !== u && e(ze(l));
    }
    s = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    kt(o);
  };
}
function ze(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function mo(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(te));
}
var lt = {}, Yn = !1;
function go(t, e) {
  if (Yn || (lt = Dt(lt), Yn = !0), e === void 0)
    return lt[t];
  lt[t] = e, Ni(lt[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && lt[t].init();
}
function bo() {
  return lt;
}
var fr = {};
function vo(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? hr(t, n()) : (fr[t] = n, () => {
  });
}
function yo(t) {
  return Object.entries(fr).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), t;
}
function hr(t, e, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(e).map(([o, a]) => ({ name: o, value: a })), s = Fi(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), En(t, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var pr = {};
function wo(t, e) {
  pr[t] = e;
}
function _o(t, e) {
  return Object.entries(pr).forEach(([n, i]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...r) => i.bind(e)(...r);
      },
      enumerable: !1
    });
  }), t;
}
var xo = {
  get reactive() {
    return Dt;
  },
  get release() {
    return kt;
  },
  get effect() {
    return It;
  },
  get raw() {
    return Ei;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: Es,
  dontAutoEvaluateFunctions: Pi,
  disableEffectScheduling: gs,
  startObservingMutations: yn,
  stopObservingMutations: Di,
  setReactivityEngine: bs,
  onAttributeRemoved: Ai,
  onAttributesAdded: $i,
  closestDataStack: Ct,
  skipDuringClone: at,
  onlyDuringClone: Zs,
  addRootSelector: Gi,
  addInitSelector: Zi,
  interceptClone: Ae,
  addScopeToNode: Zt,
  deferMutations: xs,
  mapAttributes: Tn,
  evaluateLater: M,
  interceptInit: Hs,
  setEvaluator: As,
  mergeProxies: Qt,
  extractProp: po,
  findClosest: Rt,
  onElRemoved: gn,
  closestRoot: Ce,
  destroyTree: Lt,
  interceptor: Ri,
  // INTERNAL: not public API and is subject to change without major release.
  transition: en,
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
  nextTick: Cn,
  prefixed: Nt,
  prefix: Ns,
  plugin: mo,
  magic: j,
  store: go,
  start: Fs,
  clone: to,
  // INTERNAL
  cloneNode: Qs,
  // INTERNAL
  bound: ho,
  $data: ki,
  watch: Ti,
  walk: bt,
  data: wo,
  bind: vo
}, te = xo;
function Eo(t, e) {
  const n = /* @__PURE__ */ Object.create(null), i = t.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var To = Object.freeze({}), Io = Object.prototype.hasOwnProperty, Oe = (t, e) => Io.call(t, e), ht = Array.isArray, Yt = (t) => mr(t) === "[object Map]", So = (t) => typeof t == "string", On = (t) => typeof t == "symbol", De = (t) => t !== null && typeof t == "object", Co = Object.prototype.toString, mr = (t) => Co.call(t), gr = (t) => mr(t).slice(8, -1), Dn = (t) => So(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, $o = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Ao = $o((t) => t.charAt(0).toUpperCase() + t.slice(1)), br = (t, e) => t !== e && (t === t || e === e), rn = /* @__PURE__ */ new WeakMap(), Ft = [], K, pt = Symbol("iterate"), sn = Symbol("Map key iterate");
function Oo(t) {
  return t && t._isEffect === !0;
}
function Do(t, e = To) {
  Oo(t) && (t = t.raw);
  const n = Ro(t, e);
  return e.lazy || n(), n;
}
function ko(t) {
  t.active && (vr(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var No = 0;
function Ro(t, e) {
  const n = function() {
    if (!n.active)
      return t();
    if (!Ft.includes(n)) {
      vr(n);
      try {
        return Po(), Ft.push(n), K = n, t();
      } finally {
        Ft.pop(), yr(), K = Ft[Ft.length - 1];
      }
    }
  };
  return n.id = No++, n.allowRecurse = !!e.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = t, n.deps = [], n.options = e, n;
}
function vr(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let n = 0; n < e.length; n++)
      e[n].delete(t);
    e.length = 0;
  }
}
var $t = !0, kn = [];
function Lo() {
  kn.push($t), $t = !1;
}
function Po() {
  kn.push($t), $t = !0;
}
function yr() {
  const t = kn.pop();
  $t = t === void 0 ? !0 : t;
}
function W(t, e, n) {
  if (!$t || K === void 0)
    return;
  let i = rn.get(t);
  i || rn.set(t, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(K) || (r.add(K), K.deps.push(r), K.options.onTrack && K.options.onTrack({
    effect: K,
    target: t,
    type: e,
    key: n
  }));
}
function st(t, e, n, i, r, s) {
  const o = rn.get(t);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== K || d.allowRecurse) && a.add(d);
    });
  };
  if (e === "clear")
    o.forEach(l);
  else if (n === "length" && ht(t))
    o.forEach((u, d) => {
      (d === "length" || d >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), e) {
      case "add":
        ht(t) ? Dn(n) && l(o.get("length")) : (l(o.get(pt)), Yt(t) && l(o.get(sn)));
        break;
      case "delete":
        ht(t) || (l(o.get(pt)), Yt(t) && l(o.get(sn)));
        break;
      case "set":
        Yt(t) && l(o.get(pt));
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
var Mo = /* @__PURE__ */ Eo("__proto__,__v_isRef,__isVue"), wr = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter(On)), zo = /* @__PURE__ */ _r(), Fo = /* @__PURE__ */ _r(!0), Kn = /* @__PURE__ */ Bo();
function Bo() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const i = A(this);
      for (let s = 0, o = this.length; s < o; s++)
        W(i, "get", s + "");
      const r = i[e](...n);
      return r === -1 || r === !1 ? i[e](...n.map(A)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Lo();
      const i = A(this)[e].apply(this, n);
      return yr(), i;
    };
  }), t;
}
function _r(t = !1, e = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !t;
    if (r === "__v_isReadonly")
      return t;
    if (r === "__v_raw" && s === (t ? e ? ta : Ir : e ? Qo : Tr).get(i))
      return i;
    const o = ht(i);
    if (!t && o && Oe(Kn, r))
      return Reflect.get(Kn, r, s);
    const a = Reflect.get(i, r, s);
    return (On(r) ? wr.has(r) : Mo(r)) || (t || W(i, "get", r), e) ? a : on(a) ? !o || !Dn(r) ? a.value : a : De(a) ? t ? Sr(a) : Pn(a) : a;
  };
}
var Ho = /* @__PURE__ */ Vo();
function Vo(t = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!t && (r = A(r), o = A(o), !ht(n) && on(o) && !on(r)))
      return o.value = r, !0;
    const a = ht(n) && Dn(i) ? Number(i) < n.length : Oe(n, i), l = Reflect.set(n, i, r, s);
    return n === A(s) && (a ? br(r, o) && st(n, "set", i, r, o) : st(n, "add", i, r)), l;
  };
}
function Wo(t, e) {
  const n = Oe(t, e), i = t[e], r = Reflect.deleteProperty(t, e);
  return r && n && st(t, "delete", e, void 0, i), r;
}
function qo(t, e) {
  const n = Reflect.has(t, e);
  return (!On(e) || !wr.has(e)) && W(t, "has", e), n;
}
function Uo(t) {
  return W(t, "iterate", ht(t) ? "length" : pt), Reflect.ownKeys(t);
}
var jo = {
  get: zo,
  set: Ho,
  deleteProperty: Wo,
  has: qo,
  ownKeys: Uo
}, Yo = {
  get: Fo,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, Nn = (t) => De(t) ? Pn(t) : t, Rn = (t) => De(t) ? Sr(t) : t, Ln = (t) => t, ke = (t) => Reflect.getPrototypeOf(t);
function re(t, e, n = !1, i = !1) {
  t = t.__v_raw;
  const r = A(t), s = A(e);
  e !== s && !n && W(r, "get", e), !n && W(r, "get", s);
  const { has: o } = ke(r), a = i ? Ln : n ? Rn : Nn;
  if (o.call(r, e))
    return a(t.get(e));
  if (o.call(r, s))
    return a(t.get(s));
  t !== r && t.get(e);
}
function se(t, e = !1) {
  const n = this.__v_raw, i = A(n), r = A(t);
  return t !== r && !e && W(i, "has", t), !e && W(i, "has", r), t === r ? n.has(t) : n.has(t) || n.has(r);
}
function oe(t, e = !1) {
  return t = t.__v_raw, !e && W(A(t), "iterate", pt), Reflect.get(t, "size", t);
}
function Jn(t) {
  t = A(t);
  const e = A(this);
  return ke(e).has.call(e, t) || (e.add(t), st(e, "add", t, t)), this;
}
function Xn(t, e) {
  e = A(e);
  const n = A(this), { has: i, get: r } = ke(n);
  let s = i.call(n, t);
  s ? Er(n, i, t) : (t = A(t), s = i.call(n, t));
  const o = r.call(n, t);
  return n.set(t, e), s ? br(e, o) && st(n, "set", t, e, o) : st(n, "add", t, e), this;
}
function Gn(t) {
  const e = A(this), { has: n, get: i } = ke(e);
  let r = n.call(e, t);
  r ? Er(e, n, t) : (t = A(t), r = n.call(e, t));
  const s = i ? i.call(e, t) : void 0, o = e.delete(t);
  return r && st(e, "delete", t, void 0, s), o;
}
function Zn() {
  const t = A(this), e = t.size !== 0, n = Yt(t) ? new Map(t) : new Set(t), i = t.clear();
  return e && st(t, "clear", void 0, void 0, n), i;
}
function ae(t, e) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = A(o), l = e ? Ln : t ? Rn : Nn;
    return !t && W(a, "iterate", pt), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function le(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = A(r), o = Yt(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? Ln : e ? Rn : Nn;
    return !e && W(s, "iterate", l ? sn : pt), {
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
      const n = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${Ao(t)} operation ${n}failed: target is readonly.`, A(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function Ko() {
  const t = {
    get(s) {
      return re(this, s);
    },
    get size() {
      return oe(this);
    },
    has: se,
    add: Jn,
    set: Xn,
    delete: Gn,
    clear: Zn,
    forEach: ae(!1, !1)
  }, e = {
    get(s) {
      return re(this, s, !1, !0);
    },
    get size() {
      return oe(this);
    },
    has: se,
    add: Jn,
    set: Xn,
    delete: Gn,
    clear: Zn,
    forEach: ae(!1, !0)
  }, n = {
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
  }, i = {
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
    t[s] = le(s, !1, !1), n[s] = le(s, !0, !1), e[s] = le(s, !1, !0), i[s] = le(s, !0, !0);
  }), [
    t,
    n,
    e,
    i
  ];
}
var [Jo, Xo, Yc, Kc] = /* @__PURE__ */ Ko();
function xr(t, e) {
  const n = t ? Xo : Jo;
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(Oe(n, r) && r in i ? n : i, r, s);
}
var Go = {
  get: /* @__PURE__ */ xr(!1)
}, Zo = {
  get: /* @__PURE__ */ xr(!0)
};
function Er(t, e, n) {
  const i = A(n);
  if (i !== n && e.call(t, i)) {
    const r = gr(t);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Tr = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), ta = /* @__PURE__ */ new WeakMap();
function ea(t) {
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
function na(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : ea(gr(t));
}
function Pn(t) {
  return t && t.__v_isReadonly ? t : Cr(t, !1, jo, Go, Tr);
}
function Sr(t) {
  return Cr(t, !0, Yo, Zo, Ir);
}
function Cr(t, e, n, i, r) {
  if (!De(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = r.get(t);
  if (s)
    return s;
  const o = na(t);
  if (o === 0)
    return t;
  const a = new Proxy(t, o === 2 ? i : n);
  return r.set(t, a), a;
}
function A(t) {
  return t && A(t.__v_raw) || t;
}
function on(t) {
  return !!(t && t.__v_isRef === !0);
}
j("nextTick", () => Cn);
j("dispatch", (t) => jt.bind(jt, t));
j("watch", (t, { evaluateLater: e, cleanup: n }) => (i, r) => {
  let s = e(i), a = Ti(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
j("store", bo);
j("data", (t) => ki(t));
j("root", (t) => Ce(t));
j("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = Qt(ia(t))), t._x_refs_proxy));
function ia(t) {
  let e = [];
  return Rt(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var Fe = {};
function $r(t) {
  return Fe[t] || (Fe[t] = 0), ++Fe[t];
}
function ra(t, e) {
  return Rt(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function sa(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = $r(e));
}
j("id", (t, { cleanup: e }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return oa(t, r, e, () => {
    let s = ra(t, n), o = s ? s._x_ids[n] : $r(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
Ae((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function oa(t, e, n, i) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let r = i();
  return t._x_id[e] = r, n(() => {
    delete t._x_id[e];
  }), r;
}
j("el", (t) => t);
Ar("Focus", "focus", "focus");
Ar("Persist", "persist", "persist");
function Ar(t, e, n) {
  j(e, (i) => H(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
D("modelable", (t, { expression: e }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(e), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = i(`${e} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let u = t._x_model.get, d = t._x_model.set, f = dr(
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
D("teleport", (t, { modifiers: e, expression: n }, { cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && H("x-teleport can only be used on a <template> tag", t);
  let r = Qn(n), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Zt(s, {}, t);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  O(() => {
    o(s, r, e), at(() => {
      Z(s);
    })();
  }), t._x_teleportPutBack = () => {
    let a = Qn(n);
    O(() => {
      o(t._x_teleport, a, e);
    });
  }, i(
    () => O(() => {
      s.remove(), Lt(s);
    })
  );
});
var aa = document.createElement("div");
function Qn(t) {
  let e = at(() => document.querySelector(t), () => aa)();
  return e || H(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var Or = () => {
};
Or.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
D("ignore", Or);
D("effect", at((t, { expression: e }, { effect: n }) => {
  n(M(t, e));
}));
function an(t, e, n, i) {
  let r = t, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (e = la(e)), n.includes("camel") && (e = ca(e)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = we(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = cr(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = we(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = ur(s, c);
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
  })), (da(e) || Dr(e)) && (s = a(s, (l, c) => {
    fa(c, n) || l(c);
  })), r.addEventListener(e, s, o), () => {
    r.removeEventListener(e, s, o);
  };
}
function la(t) {
  return t.replace(/-/g, ".");
}
function ca(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function we(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function ua(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function da(t) {
  return ["keydown", "keyup"].includes(t);
}
function Dr(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function fa(t, e) {
  let n = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, we((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, we((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ti(t.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), t[`${o}Key`])).length === r.length && (Dr(t.type) || ti(t.key).includes(n[0])));
}
function ti(t) {
  if (!t)
    return [];
  t = ua(t);
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
D("model", (t, { modifiers: e, expression: n }, { effect: i, cleanup: r }) => {
  let s = t;
  e.includes("parent") && (s = t.parentNode);
  let o = M(s, n), a;
  typeof n == "string" ? a = M(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = M(s, `${n()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((m) => f = m), ei(f) ? f.get() : f;
  }, c = (f) => {
    let m;
    o((w) => m = w), ei(m) ? m.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && O(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  let u = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input", d = rt ? () => {
  } : an(t, u, e, (f) => {
    c(Be(t, e, f, l()));
  });
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || An(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    Be(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = d, r(() => t._x_removeModelListeners.default()), t.form) {
    let f = an(t.form, "reset", [], (m) => {
      Cn(() => t._x_model && t._x_model.set(Be(t, e, { target: t }, l())));
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
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, O(() => rr(t, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Be(t, e, n, i) {
  return O(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (An(t))
      if (Array.isArray(i)) {
        let r = null;
        return e.includes("number") ? r = He(n.target.value) : e.includes("boolean") ? r = me(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ha(s, r));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return He(s);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return me(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return lr(t) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, e.includes("number") ? He(r) : e.includes("boolean") ? me(r) : e.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function He(t) {
  let e = t ? parseFloat(t) : null;
  return pa(e) ? e : t;
}
function ha(t, e) {
  return t == e;
}
function pa(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function ei(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
D("cloak", (t) => queueMicrotask(() => O(() => t.removeAttribute(Nt("cloak")))));
Zi(() => `[${Nt("init")}]`);
D("init", at((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
D("text", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let r = i(e);
  n(() => {
    r((s) => {
      O(() => {
        t.textContent = s;
      });
    });
  });
});
D("html", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let r = i(e);
  n(() => {
    r((s) => {
      O(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, Z(t), delete t._x_ignoreSelf;
      });
    });
  });
});
Tn(Vi(":", Wi(Nt("bind:"))));
var kr = (t, { value: e, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!e) {
    let l = {};
    yo(l), M(t, i)((u) => {
      hr(t, u, r);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return ma(t, i);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let a = M(t, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), O(() => rr(t, e, l, n));
  })), o(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
kr.inline = (t, { value: e, modifiers: n, expression: i }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: i, extract: !1 });
};
D("bind", kr);
function ma(t, e) {
  t._x_keyExpression = e;
}
Gi(() => `[${Nt("data")}]`);
D("data", (t, { expression: e }, { cleanup: n }) => {
  if (ga(t))
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  Je(i, t);
  let r = {};
  _o(r, i);
  let s = ft(t, e, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Je(s, t);
  let o = Dt(s);
  Ni(o);
  let a = Zt(t, o);
  o.init && ft(t, o.init), n(() => {
    o.destroy && ft(t, o.destroy), a();
  });
});
Ae((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function ga(t) {
  return rt ? nn ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
D("show", (t, { modifiers: e, expression: n }, { effect: i }) => {
  let r = M(t, n);
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
  }, a = () => setTimeout(o), l = tn(
    (d) => d ? o() : s(),
    (d) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  i(() => r((d) => {
    !u && d === c || (e.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
D("for", (t, { expression: e }, { effect: n, cleanup: i }) => {
  let r = va(e), s = M(t, r.items), o = M(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, n(() => ba(t, r, s, o)), i(() => {
    Object.values(t._x_lookup).forEach((a) => O(
      () => {
        Lt(a), a.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function ba(t, e, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = t;
  n((o) => {
    ya(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = t._x_lookup, l = t._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, g]) => {
        let h = ni(e, g, p, o);
        i((y) => {
          u.includes(y) && H("Duplicate key on x-for", t), u.push(y);
        }, { scope: { index: p, ...h } }), c.push(h);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let g = ni(e, o[p], p, o);
        i((h) => {
          u.includes(h) && H("Duplicate key on x-for", t), u.push(h);
        }, { scope: { index: p, ...g } }), c.push(g);
      }
    let d = [], f = [], m = [], w = [];
    for (let p = 0; p < l.length; p++) {
      let g = l[p];
      u.indexOf(g) === -1 && m.push(g);
    }
    l = l.filter((p) => !m.includes(p));
    let _ = "template";
    for (let p = 0; p < u.length; p++) {
      let g = u[p], h = l.indexOf(g);
      if (h === -1)
        l.splice(p, 0, g), d.push([_, p]);
      else if (h !== p) {
        let y = l.splice(p, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(p, 0, E), l.splice(h, 0, y), f.push([y, E]);
      } else
        w.push(g);
      _ = g;
    }
    for (let p = 0; p < m.length; p++) {
      let g = m[p];
      g in a && (O(() => {
        Lt(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let p = 0; p < f.length; p++) {
      let [g, h] = f[p], y = a[g], E = a[h], x = document.createElement("div");
      O(() => {
        E || H('x-for ":key" is undefined or invalid', s, h, a), E.after(x), y.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), x.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), x.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let p = 0; p < d.length; p++) {
      let [g, h] = d[p], y = g === "template" ? s : a[g];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let E = c[h], x = u[h], b = document.importNode(s.content, !0).firstElementChild, v = Dt(E);
      Zt(b, v, s), b._x_refreshXForScope = (T) => {
        Object.entries(T).forEach(([I, S]) => {
          v[I] = S;
        });
      }, O(() => {
        y.after(b), at(() => Z(b))();
      }), typeof x == "object" && H("x-for key cannot be an object, it must be a string or an integer", s), a[x] = b;
    }
    for (let p = 0; p < w.length; p++)
      a[w[p]]._x_refreshXForScope(c[u.indexOf(w[p])]);
    s._x_prevKeys = u;
  });
}
function va(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = t.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(e);
  return a ? (s.item = o.replace(e, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function ni(t, e, n, i) {
  let r = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = e[a];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = e[o];
  }) : r[t.item] = e, t.index && (r[t.index] = n), t.collection && (r[t.collection] = i), r;
}
function ya(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Nr() {
}
Nr.inline = (t, { expression: e }, { cleanup: n }) => {
  let i = Ce(t);
  i._x_refs || (i._x_refs = {}), i._x_refs[e] = t, n(() => delete i._x_refs[e]);
};
D("ref", Nr);
D("if", (t, { expression: e }, { effect: n, cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && H("x-if can only be used on a <template> tag", t);
  let r = M(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let a = t.content.cloneNode(!0).firstElementChild;
    return Zt(a, {}, t), O(() => {
      t.after(a), at(() => Z(a))();
    }), t._x_currentIfEl = a, t._x_undoIf = () => {
      O(() => {
        Lt(a), a.remove();
      }), delete t._x_currentIfEl;
    }, a;
  }, o = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => t._x_undoIf && t._x_undoIf());
});
D("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((r) => sa(t, r));
});
Ae((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Tn(Vi("@", Wi(Nt("on:"))));
D("on", at((t, { value: e, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? M(t, i) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let o = an(t, e, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Ne("Collapse", "collapse", "collapse");
Ne("Intersect", "intersect", "intersect");
Ne("Focus", "trap", "focus");
Ne("Mask", "mask", "mask");
function Ne(t, e, n) {
  D(e, (i) => H(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
te.setEvaluator(zi);
te.setReactivityEngine({ reactive: Pn, effect: Do, release: ko, raw: A });
var wa = te, Rr = wa;
function _a(t) {
  t.directive("collapse", e), e.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function e(n, { modifiers: i }) {
    let r = ii(i, "duration", 250) / 1e3, s = ii(i, "min", 0), o = !i.includes("min");
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
function ii(t, e, n) {
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
var xa = _a;
function Ea(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: Sa(r),
      threshold: Ta(r)
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
function Ta(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function Ia(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Sa(t) {
  const e = "margin", n = "0px 0px 0px 0px", i = t.indexOf(e);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Ia(t[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var Ca = Ea, Lr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], _e = /* @__PURE__ */ Lr.join(","), Pr = typeof Element > "u", vt = Pr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ln = !Pr && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, Mr = function(e, n, i) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(_e));
  return n && vt.call(e, _e) && r.unshift(e), r = r.filter(i), r;
}, zr = function t(e, n, i) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = vt.call(o, _e);
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
}, Fr = function(e, n) {
  return e.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, $a = function(e, n) {
  return e.tabIndex === n.tabIndex ? e.documentOrder - n.documentOrder : e.tabIndex - n.tabIndex;
}, Br = function(e) {
  return e.tagName === "INPUT";
}, Aa = function(e) {
  return Br(e) && e.type === "hidden";
}, Oa = function(e) {
  var n = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, Da = function(e, n) {
  for (var i = 0; i < e.length; i++)
    if (e[i].checked && e[i].form === n)
      return e[i];
}, ka = function(e) {
  if (!e.name)
    return !0;
  var n = e.form || ln(e), i = function(a) {
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
  var s = Da(r, e.form);
  return !s || s === e;
}, Na = function(e) {
  return Br(e) && e.type === "radio";
}, Ra = function(e) {
  return Na(e) && !ka(e);
}, ri = function(e) {
  var n = e.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, La = function(e, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = vt.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (vt.call(o, "details:not([open]) *"))
    return !0;
  var a = ln(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var u = e.parentElement, d = ln(e);
        if (u && !u.shadowRoot && r(u) === !0)
          return ri(e);
        e.assignedSlot ? e = e.assignedSlot : !u && d !== e.ownerDocument ? e = d.host : e = u;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (i === "non-zero-area")
    return ri(e);
  return !1;
}, Pa = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var n = e.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return vt.call(n, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, xe = function(e, n) {
  return !(n.disabled || Aa(n) || La(n, e) || // For a details element with a summary, the summary element gets the focus
  Oa(n) || Pa(n));
}, cn = function(e, n) {
  return !(Ra(n) || Fr(n) < 0 || !xe(e, n));
}, Ma = function(e) {
  var n = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, za = function t(e) {
  var n = [], i = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Fr(a, o), c = o ? t(r.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), i.sort($a).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, Fa = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = zr([e], n.includeContainer, {
    filter: cn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Ma
  }) : i = Mr(e, n.includeContainer, cn.bind(null, n)), za(i);
}, Hr = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = zr([e], n.includeContainer, {
    filter: xe.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Mr(e, n.includeContainer, xe.bind(null, n)), i;
}, ce = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return vt.call(e, _e) === !1 ? !1 : cn(n, e);
}, Ba = /* @__PURE__ */ Lr.concat("iframe").join(","), ge = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return vt.call(e, Ba) === !1 ? !1 : xe(n, e);
};
function si(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function oi(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? si(Object(n), !0).forEach(function(i) {
      Ha(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : si(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function Ha(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t;
}
var ai = /* @__PURE__ */ function() {
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
}(), Va = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Wa = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, qa = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, li = function(e) {
  return setTimeout(e, 0);
}, ci = function(e, n) {
  var i = -1;
  return e.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Bt = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, i) : e;
}, ue = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Ua = function(e, n) {
  var i = n?.document || document, r = oi({
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
  }, o, a = function(b, v, T) {
    return b && b[v] !== void 0 ? b[v] : r[T || v];
  }, l = function(b) {
    return s.containerGroups.findIndex(function(v) {
      var T = v.container, I = v.tabbableNodes;
      return T.contains(b) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      I.find(function(S) {
        return S === b;
      });
    });
  }, c = function(b) {
    var v = r[b];
    if (typeof v == "function") {
      for (var T = arguments.length, I = new Array(T > 1 ? T - 1 : 0), S = 1; S < T; S++)
        I[S - 1] = arguments[S];
      v = v.apply(void 0, I);
    }
    if (v === !0 && (v = void 0), !v) {
      if (v === void 0 || v === !1)
        return v;
      throw new Error("`".concat(b, "` was specified but was not a node, or did not return a node"));
    }
    var C = v;
    if (typeof v == "string" && (C = i.querySelector(v), !C))
      throw new Error("`".concat(b, "` as selector refers to no known node"));
    return C;
  }, u = function() {
    var b = c("initialFocus");
    if (b === !1)
      return !1;
    if (b === void 0)
      if (l(i.activeElement) >= 0)
        b = i.activeElement;
      else {
        var v = s.tabbableGroups[0], T = v && v.firstTabbableNode;
        b = T || c("fallbackFocus");
      }
    if (!b)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return b;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(b) {
      var v = Fa(b, r.tabbableOptions), T = Hr(b, r.tabbableOptions);
      return {
        container: b,
        tabbableNodes: v,
        focusableNodes: T,
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
          var C = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = T.findIndex(function(R) {
            return R === S;
          });
          if (!(k < 0))
            return C ? T.slice(k + 1).find(function(R) {
              return ce(R, r.tabbableOptions);
            }) : T.slice(0, k).reverse().find(function(R) {
              return ce(R, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(b) {
      return b.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function x(b) {
    if (b !== !1 && b !== i.activeElement) {
      if (!b || !b.focus) {
        x(u());
        return;
      }
      b.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = b, Va(b) && b.select();
    }
  }, m = function(b) {
    var v = c("setReturnFocus", b);
    return v || (v === !1 ? !1 : b);
  }, w = function(b) {
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
  }, _ = function(b) {
    var v = ue(b), T = l(v) >= 0;
    T || v instanceof Document ? T && (s.mostRecentlyFocusedNode = v) : (b.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, p = function(b) {
    var v = ue(b);
    d();
    var T = null;
    if (s.tabbableGroups.length > 0) {
      var I = l(v), S = I >= 0 ? s.containerGroups[I] : void 0;
      if (I < 0)
        b.shiftKey ? T = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : T = s.tabbableGroups[0].firstTabbableNode;
      else if (b.shiftKey) {
        var C = ci(s.tabbableGroups, function(P) {
          var B = P.firstTabbableNode;
          return v === B;
        });
        if (C < 0 && (S.container === v || ge(v, r.tabbableOptions) && !ce(v, r.tabbableOptions) && !S.nextTabbableNode(v, !1)) && (C = I), C >= 0) {
          var k = C === 0 ? s.tabbableGroups.length - 1 : C - 1, R = s.tabbableGroups[k];
          T = R.lastTabbableNode;
        }
      } else {
        var N = ci(s.tabbableGroups, function(P) {
          var B = P.lastTabbableNode;
          return v === B;
        });
        if (N < 0 && (S.container === v || ge(v, r.tabbableOptions) && !ce(v, r.tabbableOptions) && !S.nextTabbableNode(v)) && (N = I), N >= 0) {
          var L = N === s.tabbableGroups.length - 1 ? 0 : N + 1, V = s.tabbableGroups[L];
          T = V.firstTabbableNode;
        }
      }
    } else
      T = c("fallbackFocus");
    T && (b.preventDefault(), f(T));
  }, g = function(b) {
    if (Wa(b) && Bt(r.escapeDeactivates, b) !== !1) {
      b.preventDefault(), o.deactivate();
      return;
    }
    if (qa(b)) {
      p(b);
      return;
    }
  }, h = function(b) {
    var v = ue(b);
    l(v) >= 0 || Bt(r.clickOutsideDeactivates, b) || Bt(r.allowOutsideClick, b) || (b.preventDefault(), b.stopImmediatePropagation());
  }, y = function() {
    if (s.active)
      return ai.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? li(function() {
        f(u());
      }) : f(u()), i.addEventListener("focusin", _, !0), i.addEventListener("mousedown", w, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", w, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", h, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", g, {
        capture: !0,
        passive: !1
      }), o;
  }, E = function() {
    if (s.active)
      return i.removeEventListener("focusin", _, !0), i.removeEventListener("mousedown", w, !0), i.removeEventListener("touchstart", w, !0), i.removeEventListener("click", h, !0), i.removeEventListener("keydown", g, !0), o;
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
      var v = a(b, "onActivate"), T = a(b, "onPostActivate"), I = a(b, "checkCanFocusTrap");
      I || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, v && v();
      var S = function() {
        I && d(), y(), T && T();
      };
      return I ? (I(s.containers.concat()).then(S, S), this) : (S(), this);
    },
    deactivate: function(b) {
      if (!s.active)
        return this;
      var v = oi({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, b);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, ai.deactivateTrap(o);
      var T = a(v, "onDeactivate"), I = a(v, "onPostDeactivate"), S = a(v, "checkCanReturnFocus"), C = a(v, "returnFocus", "returnFocusOnDeactivate");
      T && T();
      var k = function() {
        li(function() {
          C && f(m(s.nodeFocusedBeforeActivation)), I && I();
        });
      };
      return C && S ? (S(m(s.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), y(), this);
    },
    updateContainerElements: function(b) {
      var v = [].concat(b).filter(Boolean);
      return s.containers = v.map(function(T) {
        return typeof T == "string" ? i.querySelector(T) : T;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(e), o;
};
function ja(t) {
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
        return ge(s);
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
        return Array.isArray(r) ? r : Hr(r, { displayCheck: "none" });
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
      }, f = () => {
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let p = i.querySelector("[autofocus]");
        p && (d.initialFocus = p);
      }
      s.includes("inert") && (d.onPostActivate = () => {
        t.nextTick(() => {
          f = ui(i);
        });
      });
      let m = Ua(i, d), w = () => {
      };
      const _ = () => {
        f(), f = () => {
        }, w(), w = () => {
        }, m.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (w = Ya()), setTimeout(() => {
          m.activate();
        }, 15)), !p && u && _(), u = !!p);
      })), l(_);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ui(i);
    }
  ));
}
function ui(t) {
  let e = [];
  return Vr(t, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), e.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Vr(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((n) => {
    n.isSameNode(t) ? Vr(t.parentNode, e) : e(n);
  });
}
function Ya() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var Ka = ja;
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
function Xa({ component: t, argument: e }) {
  return new Promise((n) => {
    if (e)
      window.addEventListener(
        e,
        () => n(),
        { once: !0 }
      );
    else {
      const i = (r) => {
        r.detail.id === t.id && (window.removeEventListener("async-alpine:load", i), n());
      };
      window.addEventListener("async-alpine:load", i);
    }
  });
}
function Ga() {
  return new Promise((t) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(t) : setTimeout(t, 200);
  });
}
function Za({ argument: t }) {
  return new Promise((e) => {
    if (!t)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), e();
    const n = window.matchMedia(`(${t})`);
    n.matches ? e() : n.addEventListener("change", e, { once: !0 });
  });
}
function Qa({ component: t, argument: e }) {
  return new Promise((n) => {
    const i = e || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), n());
    }, { rootMargin: i });
    r.observe(t.el);
  });
}
var di = {
  eager: Ja,
  event: Xa,
  idle: Ga,
  media: Za,
  visible: Qa
};
async function tl(t) {
  const e = el(t.strategy);
  await un(t, e);
}
async function un(t, e) {
  if (e.type === "expression") {
    if (e.operator === "&&")
      return Promise.all(
        e.parameters.map((n) => un(t, n))
      );
    if (e.operator === "||")
      return Promise.any(
        e.parameters.map((n) => un(t, n))
      );
  }
  return di[e.method] ? di[e.method]({
    component: t,
    argument: e.argument
  }) : !1;
}
function el(t) {
  const e = nl(t);
  let n = Wr(e);
  return n.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [n]
  } : n;
}
function nl(t) {
  const e = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, n = [];
  let i;
  for (; (i = e.exec(t)) !== null; ) {
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
function Wr(t) {
  let e = fi(t);
  for (; t.length > 0 && (t[0].value === "&&" || t[0].value === "|" || t[0].value === "||"); ) {
    const n = t.shift().value, i = fi(t);
    e.type === "expression" && e.operator === n ? e.parameters.push(i) : e = {
      type: "expression",
      operator: n,
      parameters: [e, i]
    };
  }
  return e;
}
function fi(t) {
  if (t[0].value === "(") {
    t.shift();
    const e = Wr(t);
    return t[0].value === ")" && t.shift(), e;
  } else
    return t.shift();
}
function il(t) {
  const e = "load", n = t.prefixed("load-src"), i = t.prefixed("ignore");
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
      h._x_async || (h._x_async = "init", h._x_ignore = !0, h.setAttribute(i, ""));
    })();
  }, u = async (h) => {
    t.skipDuringClone(async () => {
      if (h._x_async !== "init") return;
      h._x_async = "await";
      const { name: y, strategy: E } = d(h);
      await tl({
        name: y,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(y), h.isConnected && (w(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, t.directive(e, u).before("ignore");
  function d(h) {
    const y = p(h.getAttribute(t.prefixed("data"))), E = h.getAttribute(t.prefixed(e)) || r.defaultStrategy, x = h.getAttribute(n);
    return x && t.asyncUrl(y, x), {
      name: y,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (_(h), !o[h] || o[h].loaded)) return;
    const y = await m(h);
    t.data(h, y), o[h].loaded = !0;
  }
  async function m(h) {
    if (!o[h]) return;
    const y = await o[h].download(h);
    return typeof y == "function" ? y : y[h] || y.default || Object.values(y)[0] || !1;
  }
  function w(h) {
    t.destroyTree(h), h._x_ignore = !1, h.removeAttribute(i), !h.closest(`[${i}]`) && t.initTree(h);
  }
  function _(h) {
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
function rl(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function sl(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
  }
}
function ol(t, e, n) {
  return e && sl(t.prototype, e), t;
}
var al = Object.defineProperty, Q = function(t, e) {
  return al(t, "name", { value: e, configurable: !0 });
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
`, hl = Q(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Ht = Q(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), $ = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, nt = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, hi = { OUTLINE: "outline", FILLED: "filled" }, Ve = { FADE: "fade", SLIDE: "slide" }, Vt = { CLOSE: Ht(ll), SUCCESS: Ht(dl), ERROR: Ht(cl), WARNING: Ht(fl), INFO: Ht(ul) }, pi = Q(function(t) {
  t.wrapper.classList.add($.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add($.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), mi = Q(function(t) {
  t.wrapper.classList.remove($.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), pl = Q(function(t) {
  t.wrapper.classList.add($.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add($.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), ml = Q(function(t) {
  t.wrapper.classList.remove($.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), qr = function() {
  function t(e) {
    var n = this;
    rl(this, t), this.notifyOut = Q(function(P) {
      P(n);
    }, "notifyOut");
    var i = e.notificationsGap, r = i === void 0 ? 20 : i, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, u = c === void 0 ? Ve.FADE : c, d = e.type, f = d === void 0 ? "outline" : d, m = e.title, w = e.text, _ = e.showIcon, p = _ === void 0 ? !0 : _, g = e.customIcon, h = g === void 0 ? "" : g, y = e.customClass, E = y === void 0 ? "" : y, x = e.speed, b = x === void 0 ? 500 : x, v = e.showCloseButton, T = v === void 0 ? !0 : v, I = e.autoclose, S = I === void 0 ? !0 : I, C = e.autotimeout, k = C === void 0 ? 3e3 : C, R = e.position, N = R === void 0 ? "right top" : R, L = e.customWrapper, V = L === void 0 ? "" : L;
    if (this.customWrapper = V, this.status = l, this.title = m, this.text = w, this.showIcon = p, this.customIcon = h, this.customClass = E, this.speed = b, this.effect = u, this.showCloseButton = T, this.autoclose = S, this.autotimeout = k, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = N, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return ol(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat($.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add($.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"]($.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"]($.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"]($.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"]($.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"]($.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"]($.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"]($.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add($.NOTIFY_CLOSE), i.innerHTML = Vt.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = hl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add($.NOTIFY), this.type) {
      case hi.OUTLINE:
        this.wrapper.classList.add($.NOTIFY_OUTLINE);
        break;
      case hi.FILLED:
        this.wrapper.classList.add($.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add($.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case nt.SUCCESS:
        this.wrapper.classList.add($.NOTIFY_SUCCESS);
        break;
      case nt.ERROR:
        this.wrapper.classList.add($.NOTIFY_ERROR);
        break;
      case nt.WARNING:
        this.wrapper.classList.add($.NOTIFY_WARNING);
        break;
      case nt.INFO:
        this.wrapper.classList.add($.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add($.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add($.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add($.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add($.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = Q(function(r) {
      switch (r) {
        case nt.SUCCESS:
          return Vt.SUCCESS;
        case nt.ERROR:
          return Vt.ERROR;
        case nt.WARNING:
          return Vt.WARNING;
        case nt.INFO:
          return Vt.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add($.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
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
      case Ve.FADE:
        this.selectedNotifyInEffect = pi, this.selectedNotifyOutEffect = mi;
        break;
      case Ve.SLIDE:
        this.selectedNotifyInEffect = pl, this.selectedNotifyOutEffect = ml;
        break;
      default:
        this.selectedNotifyInEffect = pi, this.selectedNotifyOutEffect = mi;
    }
  } }]), t;
}();
Q(qr, "Notify");
var Ur = qr;
globalThis.Notify = Ur;
const jr = ["success", "error", "warning", "info"], Yr = [
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
function Wt(t = {}) {
  const e = {
    ...Kr,
    ...t
  };
  jr.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), Yr.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new Ur(e);
}
const gl = {
  custom: Wt,
  success(t, e = "Success", n = {}) {
    Wt({
      status: "success",
      title: e,
      text: t,
      ...n
    });
  },
  error(t, e = "Error", n = {}) {
    Wt({
      status: "error",
      title: e,
      text: t,
      ...n
    });
  },
  warning(t, e = "Warning", n = {}) {
    Wt({
      status: "warning",
      title: e,
      text: t,
      ...n
    });
  },
  info(t, e = "Info", n = {}) {
    Wt({
      status: "info",
      title: e,
      text: t,
      ...n
    });
  },
  setDefaults(t = {}) {
    Object.assign(Kr, t);
  },
  get allowedStatuses() {
    return [...jr];
  },
  get allowedPositions() {
    return [...Yr];
  }
}, dn = function() {
}, Jt = {}, Ee = {}, Xt = {};
function bl(t, e) {
  t = Array.isArray(t) ? t : [t];
  const n = [];
  let i = t.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || e(n);
  }; i--; ) {
    if (o = t[i], a = Ee[o], a) {
      s(o, a);
      continue;
    }
    l = Xt[o] = Xt[o] || [], l.push(s);
  }
}
function Jr(t, e) {
  if (!t) return;
  const n = Xt[t];
  if (Ee[t] = e, !!n)
    for (; n.length; )
      n[0](t, e), n.splice(0, 1);
}
function fn(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || dn)(e) : (t.success || dn)(t);
}
function vl(t, e, n, i, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Xr(e, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(e, l, t.defaultPrevented);
}
function Xr(t, e, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || dn, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
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
  const m = function(w) {
    vl(w, t, f, e, n, i, o, u);
  };
  f.addEventListener("load", m, { once: !0 }), f.addEventListener("error", m, { once: !0 }), a(t, f) !== !1 && r.head.appendChild(f);
}
function yl(t, e, n) {
  t = Array.isArray(t) ? t : [t];
  let i = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || e(r);
  }
  for (let o = 0; o < t.length; o++)
    Xr(t[o], s, n);
}
function it(t, e, n) {
  let i, r;
  if (e && typeof e == "string" && e.trim && (i = e.trim()), r = (i ? n : e) || {}, i) {
    if (i in Jt)
      throw "LoadJS";
    Jt[i] = !0;
  }
  function s(o, a) {
    yl(t, function(l) {
      fn(r, l), o && fn({ success: o, error: a }, l), Jr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
it.ready = function(e, n) {
  return bl(e, function(i) {
    fn(n, i);
  }), it;
};
it.done = function(e) {
  Jr(e, []);
};
it.reset = function() {
  Object.keys(Jt).forEach((e) => delete Jt[e]), Object.keys(Ee).forEach((e) => delete Ee[e]), Object.keys(Xt).forEach((e) => delete Xt[e]);
};
it.isDefined = function(e) {
  return e in Jt;
};
function wl(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (t instanceof Element) {
    const e = _l(t) || t;
    let n = Alpine.$data(e);
    if (n === void 0) {
      const i = e.closest?.("[x-data]");
      i && (n = Alpine.$data(i));
    }
    return n === void 0 && gi("element", e), n;
  }
  if (typeof t == "string") {
    const e = t.trim();
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const n = `[data-alpine-root="${Zr(e)}"]`;
    let i = null;
    const r = document.getElementById(e);
    if (r && (i = r.matches(n) ? r : r.querySelector(n)), i || (i = Gr(e)), !i) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${n} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${e}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(i);
    return s === void 0 && gi(`data-alpine-root="${e}"`, i), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function _l(t) {
  if (!(t instanceof Element)) return null;
  const e = t.tagName?.toLowerCase?.() === "rz-proxy", n = t.getAttribute?.("data-for");
  if (e || n) {
    const i = n || "";
    if (!i) return t;
    const r = Gr(i);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${i}". Ensure the teleported root rendered with data-alpine-root="${i}".`
    ), null);
  }
  return t;
}
function Gr(t) {
  const e = `[data-alpine-root="${Zr(t)}"]`, n = document.querySelectorAll(e);
  for (const i of n)
    if (i.hasAttribute("x-data")) return i;
  return n.length > 0 ? n[0] : document.getElementById(t) || null;
}
function Zr(t) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(t);
  } catch {
  }
  return String(t).replace(/"/g, '\\"');
}
function gi(t, e) {
  const n = `${e.tagName?.toLowerCase?.() || "node"}${e.id ? "#" + e.id : ""}${e.classList?.length ? "." + Array.from(e.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${t} (${n}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function xl(t) {
  t.data("rzAccordion", () => ({
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
function El(t) {
  t.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const e = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== e.sectionId && !e.allowMultiple && (e.open = !1);
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
function Tl(t) {
  t.data("rzAlert", () => ({
    parentElement: null,
    showAlert: !0,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const e = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
      this.parentElement = document.getElementById(e);
    },
    /**
     * Executes the `dismiss` operation.
     * @returns {any} Returns the result of `dismiss` when applicable.
     */
    dismiss() {
      this.showAlert = !1;
      const e = this;
      setTimeout(() => {
        e.parentElement.style.display = "none";
      }, 205);
    }
  }));
}
function Il(t) {
  t.data("rzAspectRatio", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function Sl(t) {
  t.data("rzBrowser", () => ({
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
function Cl(t, e) {
  t.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const n = JSON.parse(this.$el.dataset.assets || "[]"), i = this.$el.dataset.configId, r = this.$el.dataset.nonce;
      if (n.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      e(n, {
        success: () => {
          this.initCalendar(i);
        },
        error: (s) => console.error("RzCalendar: Failed to load assets", s)
      }, r);
    },
    /**
     * Executes the `initCalendar` operation.
     * @param {any} configId Input value for this method.
     * @returns {any} Returns the result of `initCalendar` when applicable.
     */
    initCalendar(n) {
      const i = document.getElementById(n);
      if (!i) {
        console.error(`RzCalendar: Config element #${n} not found.`);
        return;
      }
      let r = {};
      try {
        r = JSON.parse(i.textContent);
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
    dispatchCalendarEvent(n, i) {
      this.$dispatch(`rz:calendar:${n}`, i);
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
function $l(t) {
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
      const n = () => {
        this.calendarApi = null, this._lastAppliedState = null;
      };
      this.$el.addEventListener("rz:calendar:destroy", n), this._handlers.push({ type: "rz:calendar:destroy", fn: n });
      const i = (r) => {
        this._isUpdatingFromCalendar = !0;
        const s = this.isRangeComplete;
        this.dates = this._normalize(r.detail.dates || []), !s && this.isRangeComplete && this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
          detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
          bubbles: !0,
          composed: !0
        })), this.$nextTick(() => this._isUpdatingFromCalendar = !1);
      };
      this.$el.addEventListener("rz:calendar:click-day", i), this._handlers.push({ type: "rz:calendar:click-day", fn: i }), this.$watch("dates", () => {
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
      this._handlers.forEach((e) => this.$el.removeEventListener(e.type, e.fn)), this._handlers = [];
    },
    /**
     * Executes the `syncToCalendar` operation.
     * @returns {any} Returns the result of `syncToCalendar` when applicable.
     */
    syncToCalendar() {
      if (!this.calendarApi) return;
      let e = [...this.dates];
      if (this.mode === "multiple-ranged" && this.dates.length >= 2) {
        const a = this.dates[0], l = this.dates[this.dates.length - 1];
        e = [`${a}:${l}`];
      }
      let n, i, r = !1;
      if (this.dates.length > 0) {
        const a = this.parseIsoLocal(this.dates[0]);
        isNaN(a.getTime()) || (n = a.getMonth(), i = a.getFullYear(), r = !0);
      }
      const s = JSON.stringify({ mode: this.mode, dates: e, m: n, y: i });
      if (this._lastAppliedState === s) return;
      this._lastAppliedState = s;
      const o = { selectedDates: e };
      r && (o.selectedMonth = n, o.selectedYear = i), this.calendarApi.set(
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
      const n = this.parseIsoLocal(e);
      return isNaN(n.getTime()) ? e : new Intl.DateTimeFormat(this.locale, this.formatOptions).format(n);
    },
    /**
     * Executes the `_extractIsoDates` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `_extractIsoDates` when applicable.
     */
    _extractIsoDates(e) {
      return typeof e != "string" ? [] : e.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
    },
    /**
     * Executes the `_isValidIsoDate` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `_isValidIsoDate` when applicable.
     */
    _isValidIsoDate(e) {
      if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return !1;
      const [n, i, r] = e.split("-").map(Number), s = new Date(Date.UTC(n, i - 1, r));
      return s.getUTCFullYear() === n && s.getUTCMonth() + 1 === i && s.getUTCDate() === r;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(e) {
      const i = (Array.isArray(e) ? e : []).flat(1 / 0).flatMap((r) => typeof r == "string" ? this._extractIsoDates(r) : []).filter((r) => this._isValidIsoDate(r));
      if (this.mode === "single")
        return [...new Set(i)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const r = i.sort();
        return r.length <= 1 ? r : [r[0], r[r.length - 1]];
      }
      return [...new Set(i)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(e) {
      const [n, i, r] = e.split("-").map(Number);
      return new Date(n, i - 1, r);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(e) {
      const n = e.getFullYear(), i = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
      return `${n}-${i}-${r}`;
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
    addDays(e) {
      if (this.dates.length === 0) return;
      const n = this.parseIsoLocal(this.dates[0]);
      isNaN(n.getTime()) || (n.setDate(n.getDate() + e), this.dates = this._normalize([this.toLocalISO(n)]));
    },
    /**
     * Executes the `setDate` operation.
     * @param {any} dateStr Input value for this method.
     * @returns {any} Returns the result of `setDate` when applicable.
     */
    setDate(e) {
      this.dates = this._normalize(e ? [e] : []);
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
    toggleDate(e) {
      let n;
      this.dates.includes(e) ? n = this.dates.filter((i) => i !== e) : n = [...this.dates, e], this.dates = this._normalize(n);
    }
  }));
}
function Al(t, e) {
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    initializeEmbla(i, r) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(r);
      this.emblaApi = window.EmblaCarousel(s, i, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
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
    scrollTo(i) {
      this.emblaApi?.scrollTo(i);
    }
  }));
}
function Ol(t, e) {
  t.data("rzCodeViewer", () => ({
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
function Dl(t) {
  t.data("rzCollapsible", () => ({
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
function kl(t, e) {
  t.data("rzCombobox", () => ({
    tomSelect: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const n = JSON.parse(this.$el.dataset.assets || "[]"), i = this.$el.dataset.nonce;
      n.length > 0 && typeof e == "function" ? e(n, {
        success: () => this.initTomSelect(),
        error: (r) => console.error("RzCombobox: Failed to load assets.", r)
      }, i) : window.TomSelect && this.initTomSelect();
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const n = this.$refs.selectInput;
      if (!n) return;
      const i = document.getElementById(this.$el.dataset.configId), r = i ? JSON.parse(i.textContent) : {}, s = {}, o = (a, l) => {
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
      this.$refs.optionTemplate && (s.option = (a, l) => o(this.$refs.optionTemplate, a)), this.$refs.itemTemplate && (s.item = (a, l) => o(this.$refs.itemTemplate, a)), r.dataAttr = "data-item", this.tomSelect = new TomSelect(n, {
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
function Nl(t, e) {
  t.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function Rl(t) {
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
const At = Math.min, mt = Math.max, Te = Math.round, de = Math.floor, J = (t) => ({
  x: t,
  y: t
}), Ll = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Pl = {
  start: "end",
  end: "start"
};
function hn(t, e, n) {
  return mt(t, At(e, n));
}
function ee(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function yt(t) {
  return t.split("-")[0];
}
function ne(t) {
  return t.split("-")[1];
}
function Qr(t) {
  return t === "x" ? "y" : "x";
}
function Mn(t) {
  return t === "y" ? "height" : "width";
}
function gt(t) {
  return ["top", "bottom"].includes(yt(t)) ? "y" : "x";
}
function zn(t) {
  return Qr(gt(t));
}
function Ml(t, e, n) {
  n === void 0 && (n = !1);
  const i = ne(t), r = zn(t), s = Mn(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = Ie(o)), [o, Ie(o)];
}
function zl(t) {
  const e = Ie(t);
  return [pn(t), e, pn(e)];
}
function pn(t) {
  return t.replace(/start|end/g, (e) => Pl[e]);
}
function Fl(t, e, n) {
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
function Bl(t, e, n, i) {
  const r = ne(t);
  let s = Fl(yt(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(pn)))), s;
}
function Ie(t) {
  return t.replace(/left|right|bottom|top/g, (e) => Ll[e]);
}
function Hl(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function ts(t) {
  return typeof t != "number" ? Hl(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function Se(t) {
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
function bi(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = gt(e), o = zn(e), a = Mn(o), l = yt(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
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
  switch (ne(e)) {
    case "start":
      m[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += f * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const Vl = async (t, e, n) => {
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
  } = bi(c, i, l), f = i, m = {}, w = 0;
  for (let _ = 0; _ < a.length; _++) {
    const {
      name: p,
      fn: g
    } = a[_], {
      x: h,
      y,
      data: E,
      reset: x
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
    u = h ?? u, d = y ?? d, m = {
      ...m,
      [p]: {
        ...m[p],
        ...E
      }
    }, x && w <= 50 && (w++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (c = x.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : x.rects), {
      x: u,
      y: d
    } = bi(c, f, l)), _ = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: m
  };
};
async function es(t, e) {
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
  } = ee(e, t), w = ts(m), p = a[f ? d === "floating" ? "reference" : "floating" : d], g = Se(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(p))) == null || n ? p : p.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), h = d === "floating" ? {
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
  }, x = Se(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: y,
    strategy: l
  }) : h);
  return {
    top: (g.top - x.top + w.top) / E.y,
    bottom: (x.bottom - g.bottom + w.bottom) / E.y,
    left: (g.left - x.left + w.left) / E.x,
    right: (x.right - g.right + w.right) / E.x
  };
}
const Wl = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: n,
      y: i,
      placement: r,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = ee(t, e) || {};
    if (c == null)
      return {};
    const d = ts(u), f = {
      x: n,
      y: i
    }, m = zn(r), w = Mn(m), _ = await o.getDimensions(c), p = m === "y", g = p ? "top" : "left", h = p ? "bottom" : "right", y = p ? "clientHeight" : "clientWidth", E = s.reference[w] + s.reference[m] - f[m] - s.floating[w], x = f[m] - s.reference[m], b = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let v = b ? b[y] : 0;
    (!v || !await (o.isElement == null ? void 0 : o.isElement(b))) && (v = a.floating[y] || s.floating[w]);
    const T = E / 2 - x / 2, I = v / 2 - _[w] / 2 - 1, S = At(d[g], I), C = At(d[h], I), k = S, R = v - _[w] - C, N = v / 2 - _[w] / 2 + T, L = hn(k, N, R), V = !l.arrow && ne(r) != null && N !== L && s.reference[w] / 2 - (N < k ? S : C) - _[w] / 2 < 0, P = V ? N < k ? N - k : N - R : 0;
    return {
      [m]: f[m] + P,
      data: {
        [m]: L,
        centerOffset: N - L - P,
        ...V && {
          alignmentOffset: P
        }
      },
      reset: V
    };
  }
}), ql = function(t) {
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
        fallbackAxisSideDirection: w = "none",
        flipAlignment: _ = !0,
        ...p
      } = ee(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const g = yt(r), h = gt(a), y = yt(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), x = f || (y || !_ ? [Ie(a)] : zl(a)), b = w !== "none";
      !f && b && x.push(...Bl(a, _, w, E));
      const v = [a, ...x], T = await es(e, p), I = [];
      let S = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && I.push(T[g]), d) {
        const L = Ml(r, o, E);
        I.push(T[L[0]], T[L[1]]);
      }
      if (S = [...S, {
        placement: r,
        overflows: I
      }], !I.every((L) => L <= 0)) {
        var C, k;
        const L = (((C = s.flip) == null ? void 0 : C.index) || 0) + 1, V = v[L];
        if (V) {
          var R;
          const B = d === "alignment" ? h !== gt(V) : !1, Y = ((R = S[0]) == null ? void 0 : R.overflows[0]) > 0;
          if (!B || Y)
            return {
              data: {
                index: L,
                overflows: S
              },
              reset: {
                placement: V
              }
            };
        }
        let P = (k = S.filter((B) => B.overflows[0] <= 0).sort((B, Y) => B.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!P)
          switch (m) {
            case "bestFit": {
              var N;
              const B = (N = S.filter((Y) => {
                if (b) {
                  const tt = gt(Y.placement);
                  return tt === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  tt === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((tt) => tt > 0).reduce((tt, us) => tt + us, 0)]).sort((Y, tt) => Y[1] - tt[1])[0]) == null ? void 0 : N[0];
              B && (P = B);
              break;
            }
            case "initialPlacement":
              P = a;
              break;
          }
        if (r !== P)
          return {
            reset: {
              placement: P
            }
          };
      }
      return {};
    }
  };
};
async function Ul(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = yt(n), a = ne(n), l = gt(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = ee(e, t);
  let {
    mainAxis: f,
    crossAxis: m,
    alignmentAxis: w
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof w == "number" && (m = a === "end" ? w * -1 : w), l ? {
    x: m * u,
    y: f * c
  } : {
    x: f * c,
    y: m * u
  };
}
const jl = function(t) {
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
      } = e, l = await Ul(e, t);
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
}, Yl = function(t) {
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
      } = ee(t, e), c = {
        x: n,
        y: i
      }, u = await es(e, l), d = gt(yt(r)), f = Qr(d);
      let m = c[f], w = c[d];
      if (s) {
        const p = f === "y" ? "top" : "left", g = f === "y" ? "bottom" : "right", h = m + u[p], y = m - u[g];
        m = hn(h, m, y);
      }
      if (o) {
        const p = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", h = w + u[p], y = w - u[g];
        w = hn(h, w, y);
      }
      const _ = a.fn({
        ...e,
        [f]: m,
        [d]: w
      });
      return {
        ..._,
        data: {
          x: _.x - n,
          y: _.y - i,
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
function Pt(t) {
  return ns(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function F(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function G(t) {
  var e;
  return (e = (ns(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function ns(t) {
  return Re() ? t instanceof Node || t instanceof F(t).Node : !1;
}
function q(t) {
  return Re() ? t instanceof Element || t instanceof F(t).Element : !1;
}
function X(t) {
  return Re() ? t instanceof HTMLElement || t instanceof F(t).HTMLElement : !1;
}
function vi(t) {
  return !Re() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof F(t).ShadowRoot;
}
function ie(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = U(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(r);
}
function Kl(t) {
  return ["table", "td", "th"].includes(Pt(t));
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
function Fn(t) {
  const e = Bn(), n = q(t) ? U(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Jl(t) {
  let e = ot(t);
  for (; X(e) && !Ot(e); ) {
    if (Fn(e))
      return e;
    if (Le(e))
      return null;
    e = ot(e);
  }
  return null;
}
function Bn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ot(t) {
  return ["html", "body", "#document"].includes(Pt(t));
}
function U(t) {
  return F(t).getComputedStyle(t);
}
function Pe(t) {
  return q(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function ot(t) {
  if (Pt(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    vi(t) && t.host || // Fallback.
    G(t)
  );
  return vi(e) ? e.host : e;
}
function is(t) {
  const e = ot(t);
  return Ot(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : X(e) && ie(e) ? e : is(e);
}
function Gt(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = is(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = F(r);
  if (s) {
    const a = mn(o);
    return e.concat(o, o.visualViewport || [], ie(r) ? r : [], a && n ? Gt(a) : []);
  }
  return e.concat(r, Gt(r, [], n));
}
function mn(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function rs(t) {
  const e = U(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = X(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = Te(n) !== s || Te(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Hn(t) {
  return q(t) ? t : t.contextElement;
}
function St(t) {
  const e = Hn(t);
  if (!X(e))
    return J(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = rs(e);
  let o = (s ? Te(n.width) : n.width) / i, a = (s ? Te(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Xl = /* @__PURE__ */ J(0);
function ss(t) {
  const e = F(t);
  return !Bn() || !e.visualViewport ? Xl : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Gl(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== F(t) ? !1 : e;
}
function wt(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = Hn(t);
  let o = J(1);
  e && (i ? q(i) && (o = St(i)) : o = St(t));
  const a = Gl(s, n, i) ? ss(s) : J(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = F(s), m = i && q(i) ? F(i) : i;
    let w = f, _ = mn(w);
    for (; _ && i && m !== w; ) {
      const p = St(_), g = _.getBoundingClientRect(), h = U(_), y = g.left + (_.clientLeft + parseFloat(h.paddingLeft)) * p.x, E = g.top + (_.clientTop + parseFloat(h.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += y, c += E, w = F(_), _ = mn(w);
    }
  }
  return Se({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Vn(t, e) {
  const n = Pe(t).scrollLeft;
  return e ? e.left + n : wt(G(t)).left + n;
}
function os(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), r = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Vn(t, i)
  )), s = i.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Zl(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = G(i), a = e ? Le(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = J(1);
  const u = J(0), d = X(i);
  if ((d || !d && !s) && ((Pt(i) !== "body" || ie(o)) && (l = Pe(i)), X(i))) {
    const m = wt(i);
    c = St(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const f = o && !d && !s ? os(o, l, !0) : J(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Ql(t) {
  return Array.from(t.getClientRects());
}
function tc(t) {
  const e = G(t), n = Pe(t), i = t.ownerDocument.body, r = mt(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = mt(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Vn(t);
  const a = -n.scrollTop;
  return U(i).direction === "rtl" && (o += mt(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function ec(t, e) {
  const n = F(t), i = G(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Bn();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function nc(t, e) {
  const n = wt(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = X(t) ? St(t) : J(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function yi(t, e, n) {
  let i;
  if (e === "viewport")
    i = ec(t, n);
  else if (e === "document")
    i = tc(G(t));
  else if (q(e))
    i = nc(e, n);
  else {
    const r = ss(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return Se(i);
}
function as(t, e) {
  const n = ot(t);
  return n === e || !q(n) || Ot(n) ? !1 : U(n).position === "fixed" || as(n, e);
}
function ic(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Gt(t, [], !1).filter((a) => q(a) && Pt(a) !== "body"), r = null;
  const s = U(t).position === "fixed";
  let o = s ? ot(t) : t;
  for (; q(o) && !Ot(o); ) {
    const a = U(o), l = Fn(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || ie(o) && !l && as(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = ot(o);
  }
  return e.set(t, i), i;
}
function rc(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? Le(e) ? [] : ic(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = yi(e, u, r);
    return c.top = mt(d.top, c.top), c.right = At(d.right, c.right), c.bottom = At(d.bottom, c.bottom), c.left = mt(d.left, c.left), c;
  }, yi(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function sc(t) {
  const {
    width: e,
    height: n
  } = rs(t);
  return {
    width: e,
    height: n
  };
}
function oc(t, e, n) {
  const i = X(e), r = G(e), s = n === "fixed", o = wt(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = J(0);
  function c() {
    l.x = Vn(r);
  }
  if (i || !i && !s)
    if ((Pt(e) !== "body" || ie(r)) && (a = Pe(e)), i) {
      const m = wt(e, !0, s, e);
      l.x = m.x + e.clientLeft, l.y = m.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? os(r, a) : J(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function We(t) {
  return U(t).position === "static";
}
function wi(t, e) {
  if (!X(t) || U(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return G(t) === n && (n = n.ownerDocument.body), n;
}
function ls(t, e) {
  const n = F(t);
  if (Le(t))
    return n;
  if (!X(t)) {
    let r = ot(t);
    for (; r && !Ot(r); ) {
      if (q(r) && !We(r))
        return r;
      r = ot(r);
    }
    return n;
  }
  let i = wi(t, e);
  for (; i && Kl(i) && We(i); )
    i = wi(i, e);
  return i && Ot(i) && We(i) && !Fn(i) ? n : i || Jl(t) || n;
}
const ac = async function(t) {
  const e = this.getOffsetParent || ls, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: oc(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function lc(t) {
  return U(t).direction === "rtl";
}
const cc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Zl,
  getDocumentElement: G,
  getClippingRect: rc,
  getOffsetParent: ls,
  getElementRects: ac,
  getClientRects: Ql,
  getDimensions: sc,
  getScale: St,
  isElement: q,
  isRTL: lc
};
function cs(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function uc(t, e) {
  let n = null, i;
  const r = G(t);
  function s() {
    var a;
    clearTimeout(i), (a = n) == null || a.disconnect(), n = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = t.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: m
    } = c;
    if (a || e(), !f || !m)
      return;
    const w = de(d), _ = de(r.clientWidth - (u + f)), p = de(r.clientHeight - (d + m)), g = de(u), y = {
      rootMargin: -w + "px " + -_ + "px " + -p + "px " + -g + "px",
      threshold: mt(0, At(1, l)) || 1
    };
    let E = !0;
    function x(b) {
      const v = b[0].intersectionRatio;
      if (v !== l) {
        if (!E)
          return o();
        v ? o(!1, v) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      v === 1 && !cs(c, t.getBoundingClientRect()) && o(), E = !1;
    }
    try {
      n = new IntersectionObserver(x, {
        ...y,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(x, y);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function dc(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, c = Hn(t), u = r || s ? [...c ? Gt(c) : [], ...Gt(e)] : [];
  u.forEach((g) => {
    r && g.addEventListener("scroll", n, {
      passive: !0
    }), s && g.addEventListener("resize", n);
  });
  const d = c && a ? uc(c, n) : null;
  let f = -1, m = null;
  o && (m = new ResizeObserver((g) => {
    let [h] = g;
    h && h.target === c && m && (m.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var y;
      (y = m) == null || y.observe(e);
    })), n();
  }), c && !l && m.observe(c), m.observe(e));
  let w, _ = l ? wt(t) : null;
  l && p();
  function p() {
    const g = wt(t);
    _ && !cs(_, g) && n(), _ = g, w = requestAnimationFrame(p);
  }
  return n(), () => {
    var g;
    u.forEach((h) => {
      r && h.removeEventListener("scroll", n), s && h.removeEventListener("resize", n);
    }), d?.(), (g = m) == null || g.disconnect(), m = null, l && cancelAnimationFrame(w);
  };
}
const _t = jl, xt = Yl, Et = ql, fc = Wl, Tt = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: cc,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Vl(t, e, {
    ...r,
    platform: s
  });
};
function hc(t) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), Tt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [_t(this.pixelOffset), Et(), xt({ padding: 8 })]
      }).then(({ x: e, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${e}px`, top: `${n}px` });
      }));
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      if (this.open) {
        this.open = !1;
        let e = this;
        this.$nextTick(() => e.triggerEl?.focus());
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
      let e = this;
      this.$nextTick(() => e.triggerEl?.focus());
    },
    /**
     * Executes the `handleTriggerKeydown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
     */
    handleTriggerKeydown(e) {
      ["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key) && (e.preventDefault(), this.open = !0, this.$nextTick(() => {
        e.key === "ArrowUp" ? this.focusLastItem() : this.focusFirstItem();
      }));
    },
    /**
     * Executes the `focusNextItem` operation.
     * @returns {any} Returns the result of `focusNextItem` when applicable.
     */
    focusNextItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    /**
     * Executes the `focusPreviousItem` operation.
     * @returns {any} Returns the result of `focusPreviousItem` when applicable.
     */
    focusPreviousItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
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
    focusSelectedItem(e) {
      if (!e || e.getAttribute("aria-disabled") === "true" || e.hasAttribute("disabled")) return;
      const n = this.menuItems.indexOf(e);
      n !== -1 && (this.focusedIndex = n, e.focus());
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
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
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      this.focusSelectedItem(n), n.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
    },
    /**
     * Executes the `handleWindowEscape` operation.
     * @returns {any} Returns the result of `handleWindowEscape` when applicable.
     */
    handleWindowEscape() {
      if (this.open) {
        this.open = !1;
        let e = this;
        this.$nextTick(() => e.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleContentTabKey` operation.
     * @returns {any} Returns the result of `handleContentTabKey` when applicable.
     */
    handleContentTabKey() {
      if (this.open) {
        this.open = !1;
        let e = this;
        this.$nextTick(() => e.triggerEl?.focus());
      }
    },
    /**
     * Executes the `handleTriggerMouseover` operation.
     * @returns {any} Returns the result of `handleTriggerMouseover` when applicable.
     */
    handleTriggerMouseover() {
      let e = this;
      this.$nextTick(() => e.$el.firstElementChild?.focus());
    },
    /**
     * Executes the `closeAllSubmenus` operation.
     * @returns {any} Returns the result of `closeAllSubmenus` when applicable.
     */
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
      !this.triggerEl || !e || Tt(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [_t(this.pixelOffset), Et(), xt({ padding: 8 })]
      }).then(({ x: n, y: i }) => {
        Object.assign(e.style, { left: `${n}px`, top: `${i}px` });
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
      const e = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      e && Array.from(e).some((i) => t.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    /**
     * Executes the `openSubmenu` operation.
     * @param {any} focusFirst Input value for this method.
     * @returns {any} Returns the result of `openSubmenu` when applicable.
     */
    openSubmenu(e = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, e && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    /**
     * Executes the `closeSubmenu` operation.
     * @returns {any} Returns the result of `closeSubmenu` when applicable.
     */
    closeSubmenu() {
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
        t.$data(n)?.closeSubmenu();
      }), this.open = !1;
    },
    /**
     * Executes the `closeSiblingSubmenus` operation.
     * @returns {any} Returns the result of `closeSiblingSubmenus` when applicable.
     */
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (n) => n.hasAttribute("x-data") && n.getAttribute("x-data").startsWith("rzDropdownSubmenu") && n.id !== this.selfId
      ).forEach((n) => {
        t.$data(n)?.closeSubmenu();
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
    handleTriggerKeydown(e) {
      ["ArrowRight", "Enter", " "].includes(e.key) && (e.preventDefault(), this.openSubmenuAndFocusFirst());
    },
    /**
     * Executes the `focusNextItem` operation.
     * @returns {any} Returns the result of `focusNextItem` when applicable.
     */
    focusNextItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1, this.focusCurrentItem()));
    },
    /**
     * Executes the `focusPreviousItem` operation.
     * @returns {any} Returns the result of `focusPreviousItem` when applicable.
     */
    focusPreviousItem() {
      const e = Date.now();
      e - this._lastNavAt < this.navThrottle || (this._lastNavAt = e, this.menuItems.length && (this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1, this.focusCurrentItem()));
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
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(n);
      i !== -1 && (this.focusedIndex = i, n.focus()), n.getAttribute("aria-haspopup") === "menu" ? t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
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
function pc(t) {
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
function mc(t) {
  t.data("rzEmbeddedPreview", () => ({
    iframe: null,
    onDarkModeToggle: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function gc(t) {
  t.data("rzEmpty", () => {
  });
}
function bc(t) {
  t.data("rzHeading", () => ({
    observer: null,
    headingId: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function vc(t) {
  t.data("rzIndicator", () => ({
    visible: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const e = this.$el.dataset.color;
      e ? this.$el.style.backgroundColor = e : this.$el.style.backgroundColor = "var(--color-success)", this.$el.dataset.visible === "true" && (this.visible = !0);
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
    setVisible(e) {
      this.visible = e;
    }
  }));
}
function yc(t) {
  t.data("rzInputGroupAddon", () => ({
    /**
     * Executes the `handleClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleClick` when applicable.
     */
    handleClick(e) {
      if (e.target.closest("button"))
        return;
      const n = this.$el.parentElement;
      n && n.querySelector("input, textarea")?.focus();
    }
  }));
}
function wc(t, e) {
  t.data("rzMarkdown", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function _c(t) {
  t.data("rzMenubar", () => ({
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
      const e = this.$el.dataset.menuContent;
      return this.currentMenuValue !== "" && e === this.currentMenuValue;
    },
    isSubmenuOpen() {
      const e = this.$el.dataset.submenuOwner;
      return !!e && this.openPath.includes(e);
    },
    setTriggerState(e, n) {
      e && (e.dataset.state = n ? "open" : "closed", e.setAttribute("aria-expanded", n ? "true" : "false"));
    },
    commonPrefixLen(e, n) {
      let i = 0;
      for (; i < e.length && i < n.length && e[i] === n[i]; ) i++;
      return i;
    },
    setOpenPath(e) {
      const n = Array.isArray(e) ? e.filter(Boolean) : [], i = this.commonPrefixLen(this.openPath, n);
      (i !== this.openPath.length || i !== n.length) && (this.openPath = n, this.$nextTick(() => this.syncSubmenus()));
    },
    openMenu(e, n) {
      e && (this.cancelCloseAll(), this.currentTrigger && this.currentTrigger !== n && this.setTriggerState(this.currentTrigger, !1), this.currentMenuValue = e, this.currentTrigger = n, this.setTriggerState(n, !0), this.setOpenPath([]), this.$nextTick(() => {
        const i = this.$el.querySelector(`[data-menu-content="${e}"]`) ?? document.querySelector(`[data-menu-content="${e}"]`);
        !i || !n || Tt(n, i, {
          placement: "bottom-start",
          middleware: [_t(4), Et(), xt({ padding: 8 })]
        }).then(({ x: r, y: s }) => {
          Object.assign(i.style, { left: `${r}px`, top: `${s}px` });
        });
      }));
    },
    closeMenus() {
      this.cancelCloseAll(), this.currentMenuValue = "", this.setTriggerState(this.currentTrigger, !1), this.currentTrigger = null, this.setOpenPath([]);
    },
    getMenuValueFromTrigger(e) {
      return e?.dataset?.menuValue ?? e?.closest("[data-menu-value]")?.dataset?.menuValue ?? "";
    },
    handleTriggerPointerDown(e) {
      if (e.button !== 0 || e.ctrlKey) return;
      const n = e.currentTarget, i = this.getMenuValueFromTrigger(n);
      this.currentMenuValue === i ? this.closeMenus() : this.openMenu(i, n), e.preventDefault();
    },
    handleTriggerPointerEnter(e) {
      if (!this.currentMenuValue) return;
      const n = e.currentTarget, i = this.getMenuValueFromTrigger(n);
      i && i !== this.currentMenuValue && this.openMenu(i, n);
    },
    handleTriggerKeydown(e) {
      const n = e.currentTarget, i = this.getMenuValueFromTrigger(n);
      if (["Enter", " ", "ArrowDown"].includes(e.key)) {
        this.openMenu(i, n), e.preventDefault();
        return;
      }
      if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
        const r = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), s = r.indexOf(n);
        if (s < 0) return;
        const o = e.key === "ArrowRight" ? (s + 1) % r.length : (s - 1 + r.length) % r.length, a = r[o];
        if (!a) return;
        a.focus(), this.currentMenuValue && this.openMenu(this.getMenuValueFromTrigger(a), a), e.preventDefault();
      }
    },
    handleContentKeydown(e) {
      e.key === "Escape" && (this.closeMenus(), this.currentTrigger?.focus()), e.key === "Tab" && this.closeMenus();
    },
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      if (!n || n.hasAttribute("disabled") || n.getAttribute("aria-disabled") === "true") return;
      n.dataset.highlighted = "", n.focus();
      const i = this.buildPathToSubTrigger(n);
      this.setOpenPath(i);
    },
    handleItemMouseLeave(e) {
      const n = e.currentTarget;
      n && (delete n.dataset.highlighted, document.activeElement === n && n.blur());
    },
    handleItemClick(e) {
      const n = e.currentTarget;
      n.hasAttribute("disabled") || n.getAttribute("aria-disabled") === "true" || n.getAttribute("aria-haspopup") !== "menu" && (this.closeMenus(), this.currentTrigger?.focus());
    },
    toggleCheckboxItem(e) {
      const n = e.currentTarget, i = n.getAttribute("data-state") === "checked";
      n.setAttribute("data-state", i ? "unchecked" : "checked"), n.setAttribute("aria-checked", i ? "false" : "true");
    },
    selectRadioItem(e) {
      const n = e.currentTarget, i = n.getAttribute("data-radio-group");
      if (!i) return;
      (this.$el.closest(`[role="group"][data-radio-group="${i}"]`)?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${i}"]`) ?? []).forEach((o) => {
        o.setAttribute("data-state", "unchecked"), o.setAttribute("aria-checked", "false");
      }), n.setAttribute("data-state", "checked"), n.setAttribute("aria-checked", "true");
    },
    buildPathToSubTrigger(e) {
      const n = [];
      let i = e.closest('[data-slot="menubar-sub"]');
      for (; i; ) {
        const r = i.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!r?.id) break;
        n.unshift(r.id), i = i.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
      }
      return n;
    },
    handleSubTriggerPointerEnter(e) {
      if (!this.currentMenuValue) return;
      this.cancelCloseAll();
      const n = e.currentTarget, i = this.buildPathToSubTrigger(n);
      this.setOpenPath(i);
    },
    handleSubTriggerClick(e) {
      const n = e.currentTarget, i = this.buildPathToSubTrigger(n), r = this.openPath.length === i.length && this.openPath.every((s, o) => s === i[o]);
      this.setOpenPath(r ? i.slice(0, -1) : i);
    },
    handleSubTriggerKeyRight(e) {
      this.handleSubTriggerPointerEnter(e), this.$nextTick(() => {
        e.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(e) {
      const n = Array.from(e.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!n.length) return;
      const i = n.indexOf(document.activeElement), r = i < 0 || i >= n.length - 1 ? 0 : i + 1;
      n[r]?.focus();
    },
    focusPreviousItem(e) {
      const n = Array.from(e.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!n.length) return;
      const i = n.indexOf(document.activeElement), r = i <= 0 ? n.length - 1 : i - 1;
      n[r]?.focus();
    },
    handleSubContentLeftKey(e) {
      const i = e.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!i) return;
      const r = this.buildPathToSubTrigger(i);
      this.setOpenPath(r.slice(0, -1)), i.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((i) => {
        const r = i.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), s = i.querySelector(':scope > [data-slot="menubar-sub-content"]'), o = r?.id, a = !!o && this.openPath.includes(o);
        this.setTriggerState(r, a), s && (s.style.display = a ? "" : "none", s.dataset.state = a ? "open" : "closed", a && r && Tt(r, s, {
          placement: "right-start",
          middleware: [_t(4), Et(), xt({ padding: 8 })]
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
    handleDocumentPointerDown(e) {
      const n = e.target;
      if (n instanceof Node && this.$el.contains(n)) return;
      const i = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      n instanceof Node && i?.contains(n) || this.closeMenus();
    },
    handleDocumentFocusIn(e) {
      const n = e.target;
      !(n instanceof Node) || this.$el.contains(n) || (this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.contains(n) || this.closeMenus();
    },
    handleWindowBlur() {
      this.closeMenus();
    }
  }));
}
function xc(t, e) {
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
    /**
     * Executes the `handleTriggerEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerEnter` when applicable.
     */
    handleTriggerEnter(n) {
      const i = n.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose(), this.activeItemId !== i && !this.isClosing && requestAnimationFrame(() => this.openMenu(i));
    },
    /**
     * Executes the `handleItemEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleItemEnter` when applicable.
     */
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
      !o || !a || (Tt(o, a, {
        placement: "bottom-start",
        middleware: [_t(6), Et(), xt({ padding: 8 })]
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
function Ec(t) {
  t.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (e) => {
        this.ariaExpanded = e.toString(), e && this.$nextTick(() => this.updatePosition());
      });
    },
    /**
     * Executes the `updatePosition` operation.
     * @returns {any} Returns the result of `updatePosition` when applicable.
     */
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const e = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(_t({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(Et()), a && c.push(xt({ padding: l })), Tt(this.triggerEl, this.contentEl, {
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
function Tc(t) {
  t.data("rzPrependInput", () => ({
    prependContainer: null,
    textInput: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.prependContainer = this.$refs.prependContainer, this.textInput = this.$refs.textInput;
      let e = this;
      setTimeout(() => {
        e.updatePadding();
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
function Ic(t) {
  t.data("rzProgress", () => ({
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
      const e = this.$el;
      this.currentVal = parseInt(e.getAttribute("data-current-val")) || 0, this.minVal = parseInt(e.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(e.getAttribute("data-max-val")) || 100, this.label = e.getAttribute("data-label"), this.calculatePercentage(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuemin", this.minVal), e.setAttribute("aria-valuemax", this.maxVal), e.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((i) => {
        this.updateProgressBar();
      }).observe(e), this.$watch("currentVal", () => {
        this.calculatePercentage(), this.updateProgressBar(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuetext", `${this.percentage}%`);
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
      var e = this.label || "{percent}%";
      return this.calculatePercentage(), e.replace("{percent}", this.percentage);
    },
    /**
     * Executes the `buildInsideLabelPosition` operation.
     * @returns {any} Returns the result of `buildInsideLabelPosition` when applicable.
     */
    buildInsideLabelPosition() {
      const e = this.$refs.progressBar, n = this.$refs.progressBarLabel, i = this.$refs.innerLabel;
      n && e && i && (i.innerText = this.buildLabel(), n.clientWidth > e.clientWidth ? n.style.left = e.clientWidth + 10 + "px" : n.style.left = e.clientWidth / 2 - n.clientWidth / 2 + "px");
    },
    /**
     * Executes the `getLabelCss` operation.
     * @returns {any} Returns the result of `getLabelCss` when applicable.
     */
    getLabelCss() {
      const e = this.$refs.progressBarLabel, n = this.$refs.progressBar;
      return e && n && e.clientWidth > n.clientWidth ? "text-foreground dark:text-foreground" : "";
    },
    /**
     * Executes the `updateProgressBar` operation.
     * @returns {any} Returns the result of `updateProgressBar` when applicable.
     */
    updateProgressBar() {
      const e = this.$refs.progressBar;
      e && (e.style.width = `${this.percentage}%`, this.buildInsideLabelPosition());
    },
    // Methods to set, increment, or decrement the progress value
    setProgress(e) {
      this.currentVal = e;
    },
    /**
     * Executes the `increment` operation.
     * @param {any} val Input value for this method.
     * @returns {any} Returns the result of `increment` when applicable.
     */
    increment(e = 1) {
      this.currentVal = Math.min(this.currentVal + e, this.maxVal);
    },
    /**
     * Executes the `decrement` operation.
     * @param {any} val Input value for this method.
     * @returns {any} Returns the result of `decrement` when applicable.
     */
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
function Cc(t) {
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.type = this.$el.dataset.type || "hover", this.orientation = this.$el.dataset.orientation || "vertical", this.scrollHideDelay = Number(this.$el.dataset.scrollHideDelay || 600);
      const e = this.$refs.viewport;
      if (!e) return;
      this._viewport = e, this.onScroll = this.onScroll.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), e.addEventListener("scroll", this.onScroll, { passive: !0 });
      const n = () => this.update();
      this._roViewport = new ResizeObserver(n), this._roContent = new ResizeObserver(n), this._roViewport.observe(e), this.$refs.content && this._roContent.observe(this.$refs.content), this.setState(this.type === "always" ? "visible" : "hidden"), this.update();
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
    setState(e) {
      this.$refs.scrollbarX && (this.$refs.scrollbarX.dataset.state = e), this.$refs.scrollbarY && (this.$refs.scrollbarY.dataset.state = e);
    },
    /**
     * Executes the `setBarMounted` operation.
     * @param {any} axis Input value for this method.
     * @param {any} mounted Input value for this method.
     * @returns {any} Returns the result of `setBarMounted` when applicable.
     */
    setBarMounted(e, n) {
      const i = this.$refs[`scrollbar${e === "vertical" ? "Y" : "X"}`];
      i && (i.hidden = !n);
    },
    /**
     * Executes the `update` operation.
     * @returns {any} Returns the result of `update` when applicable.
     */
    update() {
      const e = this.$refs.viewport;
      if (!e) return;
      this._viewport = e;
      const n = e.scrollWidth > e.clientWidth, i = e.scrollHeight > e.clientHeight;
      this.setBarMounted("horizontal", n), this.setBarMounted("vertical", i), this.updateThumbSizes(), this.updateThumbPositions(), this.updateCorner(), this.type === "always" && this.setState("visible"), this.type === "auto" && this.setState(n || i ? "visible" : "hidden");
    },
    /**
     * Executes the `updateThumbSizes` operation.
     * @returns {any} Returns the result of `updateThumbSizes` when applicable.
     */
    updateThumbSizes() {
      const e = this.$refs.viewport;
      if (e) {
        if (this._viewport = e, this.$refs.thumbY && this.$refs.scrollbarY && e.scrollHeight > 0) {
          const n = e.clientHeight / e.scrollHeight, i = Math.max(this.$refs.scrollbarY.clientHeight * n, 18);
          this.$refs.thumbY.style.height = `${i}px`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && e.scrollWidth > 0) {
          const n = e.clientWidth / e.scrollWidth, i = Math.max(this.$refs.scrollbarX.clientWidth * n, 18);
          this.$refs.thumbX.style.width = `${i}px`;
        }
      }
    },
    /**
     * Executes the `updateThumbPositions` operation.
     * @returns {any} Returns the result of `updateThumbPositions` when applicable.
     */
    updateThumbPositions() {
      const e = this.$refs.viewport;
      if (e) {
        if (this._viewport = e, this.$refs.thumbY && this.$refs.scrollbarY && e.scrollHeight > e.clientHeight) {
          const n = e.scrollHeight - e.clientHeight, i = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, r = e.scrollTop / n * Math.max(i, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${r}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && e.scrollWidth > e.clientWidth) {
          const n = e.scrollWidth - e.clientWidth, i = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, r = e.scrollLeft / n * Math.max(i, 0);
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
    onTrackPointerDown(e) {
      const n = e.currentTarget?.dataset.orientation || "vertical", i = this.$refs[`scrollbar${n === "vertical" ? "Y" : "X"}`];
      if (!i || i.hidden || e.target === this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`]) return;
      const r = this.$refs.viewport, s = this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`];
      if (!r || !s) return;
      const o = i.getBoundingClientRect();
      if (n === "vertical") {
        const a = e.clientY - o.top - s.offsetHeight / 2, l = i.clientHeight - s.offsetHeight, c = r.scrollHeight - r.clientHeight;
        r.scrollTop = a / Math.max(l, 1) * c;
      } else {
        const a = e.clientX - o.left - s.offsetWidth / 2, l = i.clientWidth - s.offsetWidth, c = r.scrollWidth - r.clientWidth;
        r.scrollLeft = a / Math.max(l, 1) * c;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(e) {
      const n = e.currentTarget?.dataset.orientation || "vertical", i = this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`], r = this.$refs[`scrollbar${n === "vertical" ? "Y" : "X"}`];
      if (!i || !r || r.hidden) return;
      const s = i.getBoundingClientRect();
      this._dragAxis = n, this._dragPointerOffset = n === "vertical" ? e.clientY - s.top : e.clientX - s.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(e) {
      const n = this._dragAxis, i = this.$refs.viewport, r = this.$refs[`scrollbar${n === "vertical" ? "Y" : "X"}`], s = this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`];
      if (!n || !i || !r || !s || r.hidden) return;
      const o = r.getBoundingClientRect();
      if (n === "vertical") {
        const a = e.clientY - o.top, l = r.clientHeight - s.offsetHeight, c = i.scrollHeight - i.clientHeight;
        i.scrollTop = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
      } else {
        const a = e.clientX - o.left, l = r.clientWidth - s.offsetWidth, c = i.scrollWidth - i.clientWidth;
        i.scrollLeft = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
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
function $c(t) {
  t.data("rzSheet", () => ({
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
function Ac(t) {
  t.data("rzTabs", () => ({
    selectedTab: "",
    _triggers: [],
    _observer: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const e = this.$el.dataset.defaultValue;
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), e && this._triggers.some((n) => n.dataset.value === e) ? this.selectedTab = e : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
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
    onTriggerClick(e) {
      const n = e.currentTarget?.dataset?.value;
      !n || e.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = n, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
    },
    /**
     * Executes the `isSelected` operation.
     * @param {any} value Input value for this method.
     * @returns {any} Returns the result of `isSelected` when applicable.
     */
    isSelected(e) {
      return this.selectedTab === e;
    },
    /**
     * Executes the `bindTrigger` operation.
     * @returns {any} Returns the result of `bindTrigger` when applicable.
     */
    bindTrigger() {
      this.selectedTab;
      const e = this.$el.dataset.value, n = this.isSelected(e), i = this.$el.getAttribute("aria-disabled") === "true";
      return {
        "aria-selected": String(n),
        tabindex: n ? "0" : "-1",
        "data-state": n ? "active" : "inactive",
        ...i && { disabled: !0 }
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
    onListKeydown(e) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        const n = this._triggers.filter((l) => l.getAttribute("aria-disabled") !== "true");
        if (n.length === 0) return;
        const i = n.findIndex((l) => l.dataset.value === this.selectedTab);
        if (i === -1) return;
        const r = e.currentTarget?.getAttribute("aria-orientation") === "vertical", s = r ? "ArrowUp" : "ArrowLeft", o = r ? "ArrowDown" : "ArrowRight";
        let a = i;
        switch (e.key) {
          case s:
            a = i - 1 < 0 ? n.length - 1 : i - 1;
            break;
          case o:
            a = (i + 1) % n.length;
            break;
          case "Home":
            a = 0;
            break;
          case "End":
            a = n.length - 1;
            break;
        }
        if (a >= 0 && a < n.length) {
          const l = n[a];
          this.selectedTab = l.dataset.value, this.$nextTick(() => l.focus());
        }
      }
    }
  }));
}
function Oc(t) {
  t.data("rzToggle", () => ({
    pressed: !1,
    disabled: !1,
    controlled: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.disabled = this.$el.dataset.disabled === "true";
      const e = this.$el.dataset.pressed;
      if (this.controlled = e === "true" || e === "false", this.controlled) {
        this.pressed = e === "true";
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
function Dc(t) {
  t.data("rzTooltip", () => ({
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
      this.readDatasetOptions(), this.open = this.getBooleanDataset("open", this.getBooleanDataset("defaultOpen", !1)), this.ariaExpanded = this.open.toString(), this.state = this.open ? "open" : "closed", this.triggerEl = this.$refs.trigger || this.$el.querySelector('[data-slot="tooltip-trigger"]'), this.contentEl = this.$refs.content || this.$el.querySelector('[data-slot="tooltip-content"]'), this.arrowEl = this.$el.querySelector('[data-slot="tooltip-arrow"]'), this.bindInteractionEvents(), this.$watch("open", (e) => {
        const n = this.getBooleanDataset("open", e), i = this.isControlledOpenState ? n : e;
        if (this.open = i, this.ariaExpanded = i.toString(), this.state = i ? "open" : "closed", this.triggerEl && (this.triggerEl.dataset.state = this.state), this.contentEl && (this.contentEl.dataset.state = this.state), i) {
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
    getBooleanDataset(e, n) {
      const i = this.$el.dataset[e];
      return typeof i > "u" ? n : i === "true";
    },
    /**
     * Executes the `getNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNumberDataset` when applicable.
     */
    getNumberDataset(e, n) {
      const i = Number(this.$el.dataset[e]);
      return Number.isFinite(i) ? i : n;
    },
    /**
     * Executes the `getNullableNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
     */
    getNullableNumberDataset(e, n) {
      const i = this.$el.dataset[e];
      if (typeof i > "u" || i === null || i === "") return n;
      const r = Number(i);
      return Number.isFinite(r) ? r : n;
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
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = dc(this.triggerEl, this.contentEl, () => {
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
      const e = this.skipDelayActive ? 0 : this.openDelayDuration;
      if (e <= 0) {
        this.open = !0;
        return;
      }
      this.openDelayTimer && window.clearTimeout(this.openDelayTimer), this.openDelayTimer = window.setTimeout(() => {
        this.open = !0, this.openDelayTimer = null;
      }, e);
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
    handleTriggerKeydown(e) {
      e.key === "Escape" && this.handleWindowEscape();
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
      const e = [
        _t({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && e.push(Et()), this.enableShift && e.push(xt({ padding: this.shiftPadding })), this.arrowEl && e.push(fc({ element: this.arrowEl })), Tt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: e
      }).then(({ x: n, y: i, placement: r, middlewareData: s }) => {
        if (this.side = r.split("-")[0], this.contentEl.dataset.side = this.side, this.contentEl.style.position = this.strategy, this.contentEl.style.left = `${n}px`, this.contentEl.style.top = `${i}px`, !this.arrowEl || !s.arrow) return;
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
function kc(t) {
  t.data("rzSidebar", () => ({
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
      const e = this.cookieName ? document.cookie.split("; ").find((i) => i.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, n = this.$el.dataset.defaultOpen === "true";
      this.open = e !== null ? e === "true" : n, this.checkIfMobile(), window.addEventListener("keydown", (i) => {
        (i.ctrlKey || i.metaKey) && i.key.toLowerCase() === this.shortcut.toLowerCase() && (i.preventDefault(), this.toggle());
      }), this.$watch("open", (i) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${i}; path=/; max-age=31536000`);
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
function Nc(t) {
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
      let n = [];
      if (e) {
        const i = document.getElementById(e);
        if (i)
          try {
            n = JSON.parse(i.textContent || "[]");
          } catch (r) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${e}`, r);
          }
      }
      n.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them."), n.forEach((i) => {
        i.id = i.id || `static-item-${crypto.randomUUID()}`, i.isDataItem = !0, this.registerItem(i);
      }), this.itemsUrl && this.fetchTrigger === "immediate" && this.fetchItems(), this.$watch("search", (i) => {
        this.firstRender = !1, this.serverFiltering ? (clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => {
          this.fetchItems(i);
        }, 300)) : this.filterAndSortItems();
      }), this.$watch("selectedIndex", (i, r) => {
        if (r > -1) {
          const s = this.filteredItems[r];
          if (s) {
            const o = this.$el.querySelector(`[data-command-item-id="${s.id}"]`);
            o && (o.removeAttribute("data-selected"), o.setAttribute("aria-selected", "false"));
          }
        }
        if (i > -1 && this.filteredItems[i]) {
          const s = this.filteredItems[i];
          this.activeDescendantId = s.id;
          const o = this.$el.querySelector(`[data-command-item-id="${s.id}"]`);
          o && (o.setAttribute("data-selected", "true"), o.setAttribute("aria-selected", "true"), o.scrollIntoView({ block: "nearest" }));
          const a = s.value;
          this.selectedValue !== a && (this.selectedValue = a, this.$dispatch("rz:command:select", { value: a }));
        } else
          this.activeDescendantId = null, this.selectedValue = null;
      }), this.$watch("selectedValue", (i) => {
        const r = this.filteredItems.findIndex((s) => s.value === i);
        this.selectedIndex !== r && (this.selectedIndex = r);
      }), this.$watch("filteredItems", (i) => {
        this.isOpen = i.length > 0 || this.isLoading, this.isEmpty = i.length === 0, this.firstRender || window.dispatchEvent(new CustomEvent("rz:command:list-changed", {
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
          const n = new URL(this.itemsUrl, window.location.origin);
          this.serverFiltering && e && n.searchParams.append("q", e);
          const i = await fetch(n);
          if (!i.ok)
            throw new Error(`Network response was not ok: ${i.statusText}`);
          const r = await i.json();
          this.serverFiltering && (this.items = this.items.filter((s) => !s.isDataItem)), r.forEach((s) => {
            s.id = s.id || `data-item-${crypto.randomUUID()}`, s.isDataItem = !0, this.registerItem(s);
          }), this._dataFetched = !0;
        } catch (n) {
          this.error = n.message || "Failed to fetch command items.", console.error("RzCommand:", this.error);
        } finally {
          this.isLoading = !1, this.filterAndSortItems();
        }
      }
    },
    /**
     * Executes the `handleInteraction` operation.
     * @returns {any} Returns the result of `handleInteraction` when applicable.
     */
    handleInteraction() {
      this.itemsUrl && this.fetchTrigger === "on-open" && !this._dataFetched && this.fetchItems();
    },
    /**
     * Executes the `registerItem` operation.
     * @param {any} item Input value for this method.
     * @returns {any} Returns the result of `registerItem` when applicable.
     */
    registerItem(e) {
      this.items.some((n) => n.id === e.id) || (e._order = this.items.length, this.items.push(e), this.selectedIndex === -1 && (this.selectedIndex = 0), this.serverFiltering || this.filterAndSortItems());
    },
    /**
     * Executes the `unregisterItem` operation.
     * @param {any} itemId Input value for this method.
     * @returns {any} Returns the result of `unregisterItem` when applicable.
     */
    unregisterItem(e) {
      this.items = this.items.filter((n) => n.id !== e), this.filterAndSortItems();
    },
    /**
     * Executes the `registerGroupTemplate` operation.
     * @param {any} name Input value for this method.
     * @param {any} templateId Input value for this method.
     * @returns {any} Returns the result of `registerGroupTemplate` when applicable.
     */
    registerGroupTemplate(e, n) {
      this.groupTemplates.has(e) || this.groupTemplates.set(e, n);
    },
    /**
     * Executes the `filterAndSortItems` operation.
     * @returns {any} Returns the result of `filterAndSortItems` when applicable.
     */
    filterAndSortItems() {
      if (this.serverFiltering && this._dataFetched) {
        this.filteredItems = this.items, this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
        return;
      }
      let e;
      if (!this.shouldFilter || !this.search ? e = this.items.map((n) => ({ ...n, score: 1 })) : e = this.items.map((n) => ({
        ...n,
        score: n.forceMount ? 0 : this.commandScore(n.name, this.search, n.keywords)
      })).filter((n) => n.score > 0 || n.forceMount).sort((n, i) => n.forceMount && !i.forceMount ? 1 : !n.forceMount && i.forceMount ? -1 : i.score !== n.score ? i.score - n.score : (n._order || 0) - (i._order || 0)), this.filteredItems = e, this.selectedValue) {
        const n = this.filteredItems.findIndex((i) => i.value === this.selectedValue);
        this.selectedIndex = n > -1 ? n : this.filteredItems.length > 0 ? 0 : -1;
      } else
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
    },
    // --- EVENT HANDLERS ---
    handleItemClick(e) {
      const n = e.target.closest("[data-command-item-id]");
      if (!n) return;
      const i = n.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === i);
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && (this.selectedIndex = r, this.$dispatch("rz:command:execute", { value: s.value }));
      }
    },
    /**
     * Executes the `handleItemHover` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemHover` when applicable.
     */
    handleItemHover(e) {
      const n = e.target.closest("[data-command-item-id]");
      if (!n) return;
      const i = n.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === i);
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
          const n = this.filteredItems[this.selectedIndex];
          n && !n.disabled && this.$dispatch("rz:command:execute", { value: n.value });
          break;
      }
    },
    /**
     * Executes the `selectNext` operation.
     * @returns {any} Returns the result of `selectNext` when applicable.
     */
    selectNext() {
      if (this.filteredItems.length === 0) return;
      let e = this.selectedIndex, n = 0;
      do {
        if (e = e + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : e + 1, n++, !this.filteredItems[e]?.disabled) {
          this.selectedIndex = e;
          return;
        }
        if (!this.loop && e === this.filteredItems.length - 1) return;
      } while (n <= this.filteredItems.length);
    },
    /**
     * Executes the `selectPrev` operation.
     * @returns {any} Returns the result of `selectPrev` when applicable.
     */
    selectPrev() {
      if (this.filteredItems.length === 0) return;
      let e = this.selectedIndex, n = 0;
      do {
        if (e = e - 1 < 0 ? this.loop ? this.filteredItems.length - 1 : 0 : e - 1, n++, !this.filteredItems[e]?.disabled) {
          this.selectedIndex = e;
          return;
        }
        if (!this.loop && e === 0) return;
      } while (n <= this.filteredItems.length);
    },
    /**
     * Executes the `selectFirst` operation.
     * @returns {any} Returns the result of `selectFirst` when applicable.
     */
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const e = this.filteredItems.findIndex((n) => !n.disabled);
        e > -1 && (this.selectedIndex = e);
      }
    },
    /**
     * Executes the `selectLast` operation.
     * @returns {any} Returns the result of `selectLast` when applicable.
     */
    selectLast() {
      if (this.filteredItems.length > 0) {
        const e = this.filteredItems.map((n) => n.disabled).lastIndexOf(!1);
        e > -1 && (this.selectedIndex = e);
      }
    },
    // --- SCORING ALGORITHM (Adapted from cmdk) ---
    commandScore(e, n, i = []) {
      const d = /[\\/_+.#"@[\(\{&]/, f = /[\s-]/, m = `${e} ${i ? i.join(" ") : ""}`;
      function w(p) {
        return p.toLowerCase().replace(/[\s-]/g, " ");
      }
      function _(p, g, h, y, E, x, b) {
        if (x === g.length)
          return E === p.length ? 1 : 0.99;
        const v = `${E},${x}`;
        if (b[v] !== void 0) return b[v];
        const T = y.charAt(x);
        let I = h.indexOf(T, E), S = 0;
        for (; I >= 0; ) {
          let C = _(p, g, h, y, I + 1, x + 1, b);
          C > S && (I === E ? C *= 1 : d.test(p.charAt(I - 1)) ? C *= 0.8 : f.test(p.charAt(I - 1)) ? C *= 0.9 : (C *= 0.17, E > 0 && (C *= Math.pow(0.999, I - E))), p.charAt(I) !== g.charAt(x) && (C *= 0.9999)), C > S && (S = C), I = h.indexOf(T, I + 1);
        }
        return b[v] = S, S;
      }
      return _(m, n, w(m), w(n), 0, 0, {});
    }
  }));
}
function Rc(t) {
  t.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      this.parent && this.parent.unregisterItem(this.itemData.id);
    }
  }));
}
function Lc(t) {
  t.data("rzCommandList", () => ({
    parent: null,
    dataItemTemplate: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandList must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e), this.parent.dataItemTemplateId && (this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId));
    },
    /**
     * Executes the `renderList` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `renderList` when applicable.
     */
    renderList(e) {
      if (e.detail.commandId !== this.parent.$el.id) return;
      const n = e.detail.items || [], i = e.detail.groups || /* @__PURE__ */ new Map(), r = this.$el;
      r.querySelectorAll("[data-dynamic-item]").forEach((o) => o.remove());
      const s = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      n.forEach((o) => {
        const a = o.group || "__ungrouped__";
        s.has(a) || s.set(a, []), s.get(a).push(o);
      }), s.forEach((o, a) => {
        if (o.length === 0) return;
        const l = document.createElement("div");
        if (l.setAttribute("role", "group"), l.setAttribute("data-dynamic-item", "true"), l.setAttribute("data-slot", "command-group"), a !== "__ungrouped__") {
          const c = i.get(a);
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
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
async function Mc(t) {
  t = [...t].sort();
  const e = t.join("|"), i = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ct(t, e, n) {
  let i, r;
  typeof e == "function" ? i = { success: e } : e && typeof e == "object" ? i = e : typeof e == "string" && (r = e), !r && typeof n == "string" && (r = n);
  const s = Array.isArray(t) ? t : [t];
  return Mc(s).then((o) => (it.isDefined(o) || it(s, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: r,
    inlineStyleNonce: r
  }), new Promise((a, l) => {
    it.ready(o, {
      success: () => {
        try {
          i && typeof i.success == "function" && i.success();
        } catch (c) {
          console.error("[rizzyRequire] success callback threw:", c);
        }
        a({ bundleId: o });
      },
      error: (c) => {
        try {
          i && typeof i.error == "function" && i.error(c);
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
function zc(t) {
  xl(t), El(t), Tl(t), Il(t), Sl(t), Cl(t, ct), $l(t), Al(t, ct), Ol(t, ct), Dl(t), kl(t, ct), Nl(t, ct), Rl(t), hc(t), pc(t), mc(t), gc(t), bc(t), vc(t), yc(t), wc(t, ct), _c(t), xc(t), Ec(t), Tc(t), Ic(t), Sc(t), Cc(t), $c(t), Ac(t), Oc(t), Dc(t), kc(t), Nc(t), Rc(t), Lc(t), Pc(t);
}
function Fc(t) {
  if (!(t instanceof Element))
    return console.warn("[Rizzy.props] Invalid input. Expected an Alpine.js root element (this.$el)."), {};
  const e = t.dataset.propsId;
  if (!e)
    return {};
  const n = document.getElementById(e);
  if (!n)
    return console.warn(`[Rizzy.props] Could not find the props script tag with ID '${e}'.`), {};
  try {
    return JSON.parse(n.textContent || "{}");
  } catch (i) {
    return console.error(`[Rizzy.props] Failed to parse JSON from script tag #${e}.`, i), {};
  }
}
const fe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map();
let _i = !1;
function Bc(t) {
  return he.has(t) || he.set(
    t,
    import(t).catch((e) => {
      throw he.delete(t), e;
    })
  ), he.get(t);
}
function xi(t, e) {
  const n = globalThis.Alpine;
  return n && typeof n.asyncData == "function" ? (n.asyncData(
    t,
    () => Bc(e).catch((i) => (console.error(
      `[RizzyUI] Failed to load Alpine module '${t}' from '${e}'.`,
      i
    ), () => ({
      _error: !0,
      _errorMessage: `Module '${t}' failed to load.`
    })))
  ), !0) : (console.error(
    `[RizzyUI] Could not register async component '${t}'. AsyncAlpine not available.`
  ), !1);
}
function Hc(t, e) {
  if (!t || !e) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const n = fe.get(t);
  n && n.path !== e && console.warn(
    `[RizzyUI] Re-registering '${t}' with a different path.
  Previous: ${n.path}
  New:      ${e}`
  );
  const i = globalThis.Alpine;
  if (i && i.version) {
    const r = !n || n.path !== e;
    if (!(n && n.loaderSet && !r)) {
      const o = xi(t, e);
      fe.set(t, { path: e, loaderSet: o });
    }
    return;
  }
  fe.set(t, { path: e, loaderSet: !1 }), _i || (_i = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of fe)
        if (!s.loaderSet) {
          const o = xi(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Vc(t) {
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
      const h = u();
      h && (h[i] = g);
    }, f = (g) => {
      e.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: g, width: window.innerWidth, breakpoint: o }
        })
      );
    }, m = window.matchMedia(`(max-width: ${o - 1}px)`), w = () => {
      const g = l();
      c(g), d(g), f(g);
    };
    w();
    const _ = () => w(), p = () => w();
    m.addEventListener("change", _), window.addEventListener("resize", p, { passive: !0 }), r(() => {
      m.removeEventListener("change", _), window.removeEventListener("resize", p);
    });
  });
}
function Wc(t) {
  const e = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (_, p, g) => {
      const y = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = y.pop();
      let x = _;
      for (const b of y)
        (x[b] == null || typeof x[b] != "object") && (x[b] = isFinite(+b) ? [] : {}), x = x[b];
      x[E] = g;
    }, l = t.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = i.split(",").map((_) => _.trim()).filter(Boolean).map((_) => {
      const p = _.split("->").map((g) => g.trim());
      return p.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', _), null) : { parentPath: p[0], childPath: p[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), m = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), w = [];
    d.forEach((_, p) => {
      const g = m[p];
      if (f) {
        const E = t.evaluate(n, _.childPath, { scope: c });
        g.fromChild = !0, a(u, _.parentPath, E), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const E = t.evaluate(n, _.parentPath, { scope: u });
        g.fromParent = !0, a(c, _.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = t.evaluate(n, _.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, _.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), y = o(() => {
        const E = t.evaluate(n, _.childPath, { scope: c });
        if (!g.fromParent) {
          if (g.skipChildOnce) {
            g.skipChildOnce = !1;
            return;
          }
          g.fromChild = !0, a(u, _.parentPath, E), queueMicrotask(() => {
            g.fromChild = !1;
          });
        }
      });
      w.push(h, y);
    }), s(() => {
      for (const _ of w)
        try {
          _ && _();
        } catch {
        }
    });
  };
  t.directive("syncprop", e);
}
class qc {
  constructor() {
    this.storageKey = "darkMode", this.eventName = "rz:theme-change", this.darkClass = "dark", this._mode = "auto", this._mq = null, this._initialized = !1, this._onMqChange = null, this._onStorage = null, this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
  }
  init() {
    if (this._initialized || typeof window > "u") return;
    this._initialized = !0, this._mq = typeof window.matchMedia == "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const e = this._safeReadStorage(this.storageKey);
    this._mode = this._normalizeMode(e ?? "auto"), this._sync(), this._onMqChange = () => {
      this._sync();
    }, this._mq && (typeof this._mq.addEventListener == "function" ? this._mq.addEventListener("change", this._onMqChange) : typeof this._mq.addListener == "function" && this._mq.addListener(this._onMqChange)), this._onStorage = (n) => {
      if (n.key !== this.storageKey) return;
      const i = this._normalizeMode(n.newValue ?? "auto");
      i !== this._mode && (this._mode = i, this._sync());
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
    const e = this.effectiveDark, n = this._mode, i = this.prefersDark, r = typeof document < "u" ? document.documentElement : null, s = r ? r.classList.contains(this.darkClass) === e && r.style.colorScheme === (e ? "dark" : "light") : !0;
    this._lastSnapshot.mode === n && this._lastSnapshot.effectiveDark === e && this._lastSnapshot.prefersDark === i && s || (this._lastSnapshot = { mode: n, effectiveDark: e, prefersDark: i }, r && (r.classList.toggle(this.darkClass, e), r.style.colorScheme = e ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(this.eventName, {
        detail: {
          mode: n,
          darkMode: e,
          // External API uses 'darkMode' convention
          prefersDark: i,
          source: "RizzyUI"
        }
      })
    ));
  }
}
const z = new qc();
function Uc(t) {
  z.init(), t.store("theme", {
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
let qt = null;
function jc(t) {
  return qt || (t.plugin(xa), t.plugin(Ca), t.plugin(Ka), t.plugin(il), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Uc(t);
  }), zc(t), Vc(t), Wc(t), qt = {
    Alpine: t,
    require: ct,
    toast: gl,
    $data: wl,
    props: Fc,
    registerAsyncComponent: Hc,
    theme: z
  }, typeof window < "u" && (z.init(), window.Alpine = t, window.Rizzy = { ...window.Rizzy || {}, ...qt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), qt);
}
const Jc = jc(Rr);
Rr.start();
export {
  Jc as default
};
