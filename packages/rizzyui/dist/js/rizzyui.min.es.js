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
var Dt, St, kt, Ei, Ye = !0;
function gs(e) {
  Ye = !1, e(), Ye = !0;
}
function bs(e) {
  Dt = e.reactive, kt = e.release, St = (t) => e.effect(t, { scheduler: (n) => {
    Ye ? ds(n) : n();
  } }), Ei = e.raw;
}
function qn(e) {
  St = e;
}
function vs(e) {
  let t = () => {
  };
  return [(i) => {
    let r = St(i);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), kt(r));
    }, r;
  }, () => {
    t();
  }];
}
function Ii(e, t) {
  let n = !0, i, r = St(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => kt(r);
}
var Si = [], Ti = [], Ci = [];
function ys(e) {
  Ci.push(e);
}
function gn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Ti.push(t));
}
function $i(e) {
  Si.push(e);
}
function Ai(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Oi(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((r) => r()), delete e._x_attributeCleanups[n]);
  });
}
function ws(e) {
  for (e._x_effects?.forEach(hs); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var bn = new MutationObserver(xn), vn = !1;
function yn() {
  bn.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), vn = !0;
}
function Di() {
  xs(), bn.disconnect(), vn = !1;
}
var Pt = [];
function xs() {
  let e = bn.takeRecords();
  Pt.push(() => e.length > 0 && xn(e));
  let t = Pt.length;
  queueMicrotask(() => {
    if (Pt.length === t)
      for (; Pt.length > 0; )
        Pt.shift()();
  });
}
function O(e) {
  if (!vn)
    return e();
  Di();
  let t = e();
  return yn(), t;
}
var wn = !1, be = [];
function _s() {
  wn = !0;
}
function Es() {
  wn = !1, xn(be), be = [];
}
function xn(e) {
  if (wn) {
    be = be.concat(e);
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
    Oi(o, s);
  }), i.forEach((s, o) => {
    Si.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || Ti.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && Ci.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function ki(e) {
  return Qt(Ct(e));
}
function Zt(e, t, n) {
  return e._x_dataStack = [t, ...Ct(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
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
      (n) => Object.prototype.hasOwnProperty.call(n, t) || Reflect.has(n, t)
    );
  },
  get({ objects: e }, t, n) {
    return t == "toJSON" ? Ss : Reflect.get(
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
function Ss() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function Ni(e) {
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
function Li(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return e(this.initialValue, () => Ts(i, r), (o) => Ke(i, r, o), r, s);
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
function Ts(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Ke(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Ke(e[t[0]], t.slice(1), n);
  }
}
var Ri = {};
function U(e, t) {
  Ri[e] = t;
}
function Je(e, t) {
  let n = Cs(t);
  return Object.entries(Ri).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Cs(e) {
  let [t, n] = Vi(e), i = { interceptor: Li, ...t };
  return gn(e, n), i;
}
function $s(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    Kt(r, e, t);
  }
}
function Kt(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var pe = !0;
function Mi(e) {
  let t = pe;
  pe = !1;
  let n = e();
  return pe = t, n;
}
function ft(e, t, n = {}) {
  let i;
  return P(e, t)((r) => i = r, n), i;
}
function P(...e) {
  return Pi(...e);
}
var Pi = zi;
function As(e) {
  Pi = e;
}
function zi(e, t) {
  let n = {};
  Je(n, e);
  let i = [n, ...Ct(e)], r = typeof t == "function" ? Os(i, t) : ks(i, t, e);
  return $s.bind(null, e, t, r);
}
function Os(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [], context: s } = {}) => {
    let o = t.apply(Qt([i, ...e]), r);
    ve(n, o);
  };
}
var Pe = {};
function Ds(e, t) {
  if (Pe[e])
    return Pe[e];
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
      return Kt(o, t, e), Promise.resolve();
    }
  })();
  return Pe[e] = s, s;
}
function ks(e, t, n) {
  let i = Ds(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    i.result = void 0, i.finished = !1;
    let l = Qt([s, ...e]);
    if (typeof i == "function") {
      let c = i.call(a, i, l).catch((u) => Kt(u, n, t));
      i.finished ? (ve(r, i.result, l, o, n), i.result = void 0) : c.then((u) => {
        ve(r, u, l, o, n);
      }).catch((u) => Kt(u, n, t)).finally(() => i.result = void 0);
    }
  };
}
function ve(e, t, n, i, r) {
  if (pe && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => ve(e, o, n, i)).catch((o) => Kt(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var _n = "x-";
function Nt(e = "") {
  return _n + e;
}
function Ns(e) {
  _n = e;
}
var ye = {};
function D(e, t) {
  return ye[e] = t, {
    before(n) {
      if (!ye[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = ut.indexOf(n);
      ut.splice(i >= 0 ? i : ut.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Ls(e) {
  return Object.keys(ye).includes(e);
}
function En(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Fi(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Wi((s, o) => i[s] = o)).filter(Ui).map(Ps(i, n)).sort(zs).map((s) => Ms(e, s));
}
function Fi(e) {
  return Array.from(e).map(Wi()).filter((t) => !Ui(t));
}
var Xe = !1, jt = /* @__PURE__ */ new Map(), Bi = Symbol();
function Rs(e) {
  Xe = !0;
  let t = Symbol();
  Bi = t, jt.set(t, []);
  let n = () => {
    for (; jt.get(t).length; )
      jt.get(t).shift()();
    jt.delete(t);
  }, i = () => {
    Xe = !1, n();
  };
  e(n), i();
}
function Vi(e) {
  let t = [], n = (a) => t.push(a), [i, r] = vs(e);
  return t.push(r), [{
    Alpine: te,
    effect: i,
    cleanup: n,
    evaluateLater: P.bind(P, e),
    evaluate: ft.bind(ft, e)
  }, () => t.forEach((a) => a())];
}
function Ms(e, t) {
  let n = () => {
  }, i = ye[t.type] || n, [r, s] = Vi(e);
  Ai(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Xe ? jt.get(Bi).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Hi = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), qi = (e) => e;
function Wi(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: r } = ji.reduce((s, o) => o(s), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: r };
  };
}
var ji = [];
function In(e) {
  ji.push(e);
}
function Ui({ name: e }) {
  return Yi().test(e);
}
var Yi = () => new RegExp(`^${_n}([^:^.]+)\\b`);
function Ps(e, t) {
  return ({ name: n, value: i }) => {
    let r = n.match(Yi()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
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
function zs(e, t) {
  let n = ut.indexOf(e.type) === -1 ? Ge : e.type, i = ut.indexOf(t.type) === -1 ? Ge : t.type;
  return ut.indexOf(n) - ut.indexOf(i);
}
function Ut(e, t, n = {}) {
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
function bt(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((r) => bt(r, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    bt(i, t), i = i.nextElementSibling;
}
function V(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Wn = !1;
function Fs() {
  Wn && V("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Wn = !0, document.body || V("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Ut(document, "alpine:init"), Ut(document, "alpine:initializing"), yn(), ys((t) => Z(t, bt)), gn((t) => Rt(t)), $i((t, n) => {
    En(t, n).forEach((i) => i());
  });
  let e = (t) => !Ce(t.parentElement, !0);
  Array.from(document.querySelectorAll(Xi().join(","))).filter(e).forEach((t) => {
    Z(t);
  }), Ut(document, "alpine:initialized"), setTimeout(() => {
    qs();
  });
}
var Sn = [], Ki = [];
function Ji() {
  return Sn.map((e) => e());
}
function Xi() {
  return Sn.concat(Ki).map((e) => e());
}
function Gi(e) {
  Sn.push(e);
}
function Zi(e) {
  Ki.push(e);
}
function Ce(e, t = !1) {
  return Lt(e, (n) => {
    if ((t ? Xi() : Ji()).some((r) => n.matches(r)))
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
  return Ji().some((t) => e.matches(t));
}
var Qi = [];
function Vs(e) {
  Qi.push(e);
}
var Hs = 1;
function Z(e, t = bt, n = () => {
}) {
  Lt(e, (i) => i._x_ignore) || Rs(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Qi.forEach((s) => s(i, r)), En(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Hs++), i._x_ignore && r());
    });
  });
}
function Rt(e, t = bt) {
  t(e, (n) => {
    ws(n), Oi(n), delete n._x_marker;
  });
}
function qs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    Ls(n) || i.some((r) => {
      if (document.querySelector(r))
        return V(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Ze = [], Tn = !1;
function Cn(e = () => {
}) {
  return queueMicrotask(() => {
    Tn || setTimeout(() => {
      Qe();
    });
  }), new Promise((t) => {
    Ze.push(() => {
      e(), t();
    });
  });
}
function Qe() {
  for (Tn = !1; Ze.length; )
    Ze.shift()();
}
function Ws() {
  Tn = !0;
}
function $n(e, t) {
  return Array.isArray(t) ? jn(e, t.join(" ")) : typeof t == "object" && t !== null ? js(e, t) : typeof t == "function" ? $n(e, t()) : jn(e, t);
}
function jn(e, t) {
  let n = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function js(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(t).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function $e(e, t) {
  return typeof t == "object" && t !== null ? Us(e, t) : Ys(e, t);
}
function Us(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = Ks(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    $e(e, n);
  };
}
function Ys(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Ks(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function tn(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
D("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Xs(e, n, t) : Js(e, i, t));
});
function Js(e, t, n) {
  tr(e, $n, ""), {
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
function Xs(e, t, n) {
  tr(e, $e);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((g, h) => h < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((g, h) => h > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? zt(t, "scale", 95) / 100 : 1, d = zt(t, "delay", 0) / 1e3, f = zt(t, "origin", "center"), m = "opacity, transform", w = zt(t, "duration", 150) / 1e3, x = zt(t, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${w}s`,
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
    transitionProperty: m,
    transitionDuration: `${x}s`,
    transitionTimingFunction: p
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function tr(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      en(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      en(e, t, {
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
function en(e, t, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Gs(e, {
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
function Gs(e, t) {
  let n, i, r, s = tn(() => {
    O(() => {
      n = !0, i || t.before(), r || (t.end(), Qe()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
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
    t.start(), t.during();
  }), Ws(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), O(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (O(() => {
        t.end();
      }), Qe(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function zt(e, t, n) {
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
var rt = !1;
function at(e, t = () => {
}) {
  return (...n) => rt ? t(...n) : e(...n);
}
function Zs(e) {
  return (...t) => rt && e(...t);
}
var nr = [];
function Ae(e) {
  nr.push(e);
}
function Qs(e, t) {
  nr.forEach((n) => n(e, t)), rt = !0, ir(() => {
    Z(t, (n, i) => {
      i(n, () => {
      });
    });
  }), rt = !1;
}
var nn = !1;
function to(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), rt = !0, nn = !0, ir(() => {
    eo(t);
  }), rt = !1, nn = !1;
}
function eo(e) {
  let t = !1;
  Z(e, (i, r) => {
    bt(i, (s, o) => {
      if (t && Bs(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function ir(e) {
  let t = St;
  qn((n, i) => {
    let r = t(n);
    return kt(r), () => {
    };
  }), e(), qn(t);
}
function rr(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Dt({})), e._x_bindings[t] = n, t = i.includes("camel") ? co(t) : t, t) {
    case "value":
      no(e, n);
      break;
    case "style":
      ro(e, n);
      break;
    case "class":
      io(e, n);
      break;
    case "selected":
    case "checked":
      so(e, t, n);
      break;
    default:
      sr(e, t, n);
      break;
  }
}
function no(e, t) {
  if (lr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = me(e.value) === t : e.checked = Un(e.value, t));
  else if (An(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Un(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    lo(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function io(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = $n(e, t);
}
function ro(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = $e(e, t);
}
function so(e, t, n) {
  sr(e, t, n), ao(e, t, n);
}
function sr(e, t, n) {
  [null, void 0, !1].includes(n) && fo(t) ? e.removeAttribute(t) : (or(t) && (n = t), oo(e, t, n));
}
function oo(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function ao(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function lo(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function co(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Un(e, t) {
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
function ho(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ar(e, t, n);
}
function po(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, Mi(() => ft(e, r.expression));
  }
  return ar(e, t, n);
}
function ar(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : or(t) ? !![t, "true"].includes(i) : i;
}
function An(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function lr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function cr(e, t) {
  let n;
  return function() {
    const i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function ur(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function dr({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = St(() => {
    let a = e(), l = n();
    if (r)
      i(ze(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(ze(a)) : c !== u && t(ze(l));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    kt(o);
  };
}
function ze(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function mo(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(te));
}
var lt = {}, Yn = !1;
function go(e, t) {
  if (Yn || (lt = Dt(lt), Yn = !0), t === void 0)
    return lt[e];
  lt[e] = t, Ni(lt[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && lt[e].init();
}
function bo() {
  return lt;
}
var fr = {};
function vo(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? hr(e, n()) : (fr[e] = n, () => {
  });
}
function yo(e) {
  return Object.entries(fr).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function hr(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Fi(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), En(e, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var pr = {};
function wo(e, t) {
  pr[e] = t;
}
function xo(e, t) {
  return Object.entries(pr).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...r) => i.bind(t)(...r);
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
    return St;
  },
  get raw() {
    return Ei;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: Es,
  dontAutoEvaluateFunctions: Mi,
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
  deferMutations: _s,
  mapAttributes: In,
  evaluateLater: P,
  interceptInit: Vs,
  setEvaluator: As,
  mergeProxies: Qt,
  extractProp: po,
  findClosest: Lt,
  onElRemoved: gn,
  closestRoot: Ce,
  destroyTree: Rt,
  interceptor: Li,
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
  magic: U,
  store: go,
  start: Fs,
  clone: to,
  // INTERNAL
  cloneNode: Qs,
  // INTERNAL
  bound: ho,
  $data: ki,
  watch: Ii,
  walk: bt,
  data: wo,
  bind: vo
}, te = _o;
function Eo(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = e.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var Io = Object.freeze({}), So = Object.prototype.hasOwnProperty, Oe = (e, t) => So.call(e, t), ht = Array.isArray, Yt = (e) => mr(e) === "[object Map]", To = (e) => typeof e == "string", On = (e) => typeof e == "symbol", De = (e) => e !== null && typeof e == "object", Co = Object.prototype.toString, mr = (e) => Co.call(e), gr = (e) => mr(e).slice(8, -1), Dn = (e) => To(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, $o = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Ao = $o((e) => e.charAt(0).toUpperCase() + e.slice(1)), br = (e, t) => e !== t && (e === e || t === t), rn = /* @__PURE__ */ new WeakMap(), Ft = [], K, pt = Symbol("iterate"), sn = Symbol("Map key iterate");
function Oo(e) {
  return e && e._isEffect === !0;
}
function Do(e, t = Io) {
  Oo(e) && (e = e.raw);
  const n = Lo(e, t);
  return t.lazy || n(), n;
}
function ko(e) {
  e.active && (vr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var No = 0;
function Lo(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Ft.includes(n)) {
      vr(n);
      try {
        return Mo(), Ft.push(n), K = n, e();
      } finally {
        Ft.pop(), yr(), K = Ft[Ft.length - 1];
      }
    }
  };
  return n.id = No++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function vr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var $t = !0, kn = [];
function Ro() {
  kn.push($t), $t = !1;
}
function Mo() {
  kn.push($t), $t = !0;
}
function yr() {
  const e = kn.pop();
  $t = e === void 0 ? !0 : e;
}
function q(e, t, n) {
  if (!$t || K === void 0)
    return;
  let i = rn.get(e);
  i || rn.set(e, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(K) || (r.add(K), K.deps.push(r), K.options.onTrack && K.options.onTrack({
    effect: K,
    target: e,
    type: t,
    key: n
  }));
}
function st(e, t, n, i, r, s) {
  const o = rn.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== K || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (n === "length" && ht(e))
    o.forEach((u, d) => {
      (d === "length" || d >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), t) {
      case "add":
        ht(e) ? Dn(n) && l(o.get("length")) : (l(o.get(pt)), Yt(e) && l(o.get(sn)));
        break;
      case "delete":
        ht(e) || (l(o.get(pt)), Yt(e) && l(o.get(sn)));
        break;
      case "set":
        Yt(e) && l(o.get(pt));
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
var Po = /* @__PURE__ */ Eo("__proto__,__v_isRef,__isVue"), wr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(On)), zo = /* @__PURE__ */ xr(), Fo = /* @__PURE__ */ xr(!0), Kn = /* @__PURE__ */ Bo();
function Bo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const i = $(this);
      for (let s = 0, o = this.length; s < o; s++)
        q(i, "get", s + "");
      const r = i[t](...n);
      return r === -1 || r === !1 ? i[t](...n.map($)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Ro();
      const i = $(this)[t].apply(this, n);
      return yr(), i;
    };
  }), e;
}
function xr(e = !1, t = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? ta : Sr : t ? Qo : Ir).get(i))
      return i;
    const o = ht(i);
    if (!e && o && Oe(Kn, r))
      return Reflect.get(Kn, r, s);
    const a = Reflect.get(i, r, s);
    return (On(r) ? wr.has(r) : Po(r)) || (e || q(i, "get", r), t) ? a : on(a) ? !o || !Dn(r) ? a.value : a : De(a) ? e ? Tr(a) : Mn(a) : a;
  };
}
var Vo = /* @__PURE__ */ Ho();
function Ho(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = $(r), o = $(o), !ht(n) && on(o) && !on(r)))
      return o.value = r, !0;
    const a = ht(n) && Dn(i) ? Number(i) < n.length : Oe(n, i), l = Reflect.set(n, i, r, s);
    return n === $(s) && (a ? br(r, o) && st(n, "set", i, r, o) : st(n, "add", i, r)), l;
  };
}
function qo(e, t) {
  const n = Oe(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && st(e, "delete", t, void 0, i), r;
}
function Wo(e, t) {
  const n = Reflect.has(e, t);
  return (!On(t) || !wr.has(t)) && q(e, "has", t), n;
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
}, Nn = (e) => De(e) ? Mn(e) : e, Ln = (e) => De(e) ? Tr(e) : e, Rn = (e) => e, ke = (e) => Reflect.getPrototypeOf(e);
function re(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = $(e), s = $(t);
  t !== s && !n && q(r, "get", t), !n && q(r, "get", s);
  const { has: o } = ke(r), a = i ? Rn : n ? Ln : Nn;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function se(e, t = !1) {
  const n = this.__v_raw, i = $(n), r = $(e);
  return e !== r && !t && q(i, "has", e), !t && q(i, "has", r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function oe(e, t = !1) {
  return e = e.__v_raw, !t && q($(e), "iterate", pt), Reflect.get(e, "size", e);
}
function Jn(e) {
  e = $(e);
  const t = $(this);
  return ke(t).has.call(t, e) || (t.add(e), st(t, "add", e, e)), this;
}
function Xn(e, t) {
  t = $(t);
  const n = $(this), { has: i, get: r } = ke(n);
  let s = i.call(n, e);
  s ? Er(n, i, e) : (e = $(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? br(t, o) && st(n, "set", e, t, o) : st(n, "add", e, t), this;
}
function Gn(e) {
  const t = $(this), { has: n, get: i } = ke(t);
  let r = n.call(t, e);
  r ? Er(t, n, e) : (e = $(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && st(t, "delete", e, void 0, s), o;
}
function Zn() {
  const e = $(this), t = e.size !== 0, n = Yt(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && st(e, "clear", void 0, void 0, n), i;
}
function ae(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = $(o), l = t ? Rn : e ? Ln : Nn;
    return !e && q(a, "iterate", pt), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function le(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = $(r), o = Yt(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...i), u = n ? Rn : t ? Ln : Nn;
    return !t && q(s, "iterate", l ? sn : pt), {
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
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${Ao(e)} operation ${n}failed: target is readonly.`, $(this));
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
    add: Jn,
    set: Xn,
    delete: Gn,
    clear: Zn,
    forEach: ae(!1, !1)
  }, t = {
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
    e[s] = le(s, !1, !1), n[s] = le(s, !0, !1), t[s] = le(s, !1, !0), i[s] = le(s, !0, !0);
  }), [
    e,
    n,
    t,
    i
  ];
}
var [Jo, Xo, Kc, Jc] = /* @__PURE__ */ Ko();
function _r(e, t) {
  const n = e ? Xo : Jo;
  return (i, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(Oe(n, r) && r in i ? n : i, r, s);
}
var Go = {
  get: /* @__PURE__ */ _r(!1)
}, Zo = {
  get: /* @__PURE__ */ _r(!0)
};
function Er(e, t, n) {
  const i = $(n);
  if (i !== n && t.call(e, i)) {
    const r = gr(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Ir = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new WeakMap(), ta = /* @__PURE__ */ new WeakMap();
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
function na(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ea(gr(e));
}
function Mn(e) {
  return e && e.__v_isReadonly ? e : Cr(e, !1, Uo, Go, Ir);
}
function Tr(e) {
  return Cr(e, !0, Yo, Zo, Sr);
}
function Cr(e, t, n, i, r) {
  if (!De(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = na(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? i : n);
  return r.set(e, a), a;
}
function $(e) {
  return e && $(e.__v_raw) || e;
}
function on(e) {
  return !!(e && e.__v_isRef === !0);
}
U("nextTick", () => Cn);
U("dispatch", (e) => Ut.bind(Ut, e));
U("watch", (e, { evaluateLater: t, cleanup: n }) => (i, r) => {
  let s = t(i), a = Ii(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
U("store", bo);
U("data", (e) => ki(e));
U("root", (e) => Ce(e));
U("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Qt(ia(e))), e._x_refs_proxy));
function ia(e) {
  let t = [];
  return Lt(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Fe = {};
function $r(e) {
  return Fe[e] || (Fe[e] = 0), ++Fe[e];
}
function ra(e, t) {
  return Lt(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function sa(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = $r(t));
}
U("id", (e, { cleanup: t }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return oa(e, r, t, () => {
    let s = ra(e, n), o = s ? s._x_ids[n] : $r(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
Ae((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function oa(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = i();
  return e._x_id[t] = r, n(() => {
    delete e._x_id[t];
  }), r;
}
U("el", (e) => e);
Ar("Focus", "focus", "focus");
Ar("Persist", "persist", "persist");
function Ar(e, t, n) {
  U(t, (i) => V(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
D("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(t), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = i(`${t} = __placeholder`), l = (u) => a(() => {
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
D("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && V("x-teleport can only be used on a <template> tag", e);
  let r = Qn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Zt(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  O(() => {
    o(s, r, t), at(() => {
      Z(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Qn(n);
    O(() => {
      o(e._x_teleport, a, t);
    });
  }, i(
    () => O(() => {
      s.remove(), Rt(s);
    })
  );
});
var aa = document.createElement("div");
function Qn(e) {
  let t = at(() => document.querySelector(e), () => aa)();
  return t || V(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Or = () => {
};
Or.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
D("ignore", Or);
D("effect", at((e, { expression: t }, { effect: n }) => {
  n(P(e, t));
}));
function an(e, t, n, i) {
  let r = e, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (t = la(t)), n.includes("camel") && (t = ca(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
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
    l(c), r.removeEventListener(t, s, o);
  })), (n.includes("away") || n.includes("outside")) && (r = document, s = a(s, (l, c) => {
    e.contains(c.target) || c.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(c));
  })), n.includes("self") && (s = a(s, (l, c) => {
    c.target === e && l(c);
  })), (da(t) || Dr(t)) && (s = a(s, (l, c) => {
    fa(c, n) || l(c);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function la(e) {
  return e.replace(/-/g, ".");
}
function ca(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
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
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, we((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, we((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ti(e.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (Dr(e.type) || ti(e.key).includes(n[0])));
}
function ti(e) {
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
  return t[e] = e, Object.keys(t).map((n) => {
    if (t[n] === e)
      return n;
  }).filter((n) => n);
}
D("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = P(s, n), a;
  typeof n == "string" ? a = P(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = P(s, `${n()} = __placeholder`) : a = () => {
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
  typeof n == "string" && e.type === "radio" && O(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = rt ? () => {
  } : an(e, u, t, (f) => {
    c(Be(e, t, f, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || An(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Be(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let f = an(e.form, "reset", [], (m) => {
      Cn(() => e._x_model && e._x_model.set(Be(e, t, { target: e }, l())));
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
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, O(() => rr(e, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Be(e, t, n, i) {
  return O(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (An(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = Ve(n.target.value) : t.includes("boolean") ? r = me(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ha(s, r));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ve(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return me(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return lr(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? Ve(r) : t.includes("boolean") ? me(r) : t.includes("trim") ? r.trim() : r;
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
function ei(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
D("cloak", (e) => queueMicrotask(() => O(() => e.removeAttribute(Nt("cloak")))));
Zi(() => `[${Nt("init")}]`);
D("init", at((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
D("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      O(() => {
        e.textContent = s;
      });
    });
  });
});
D("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      O(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, Z(e), delete e._x_ignoreSelf;
      });
    });
  });
});
In(Hi(":", qi(Nt("bind:"))));
var kr = (e, { value: t, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    yo(l), P(e, i)((u) => {
      hr(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return ma(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = P(e, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), O(() => rr(e, t, l, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
kr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
D("bind", kr);
function ma(e, t) {
  e._x_keyExpression = t;
}
Gi(() => `[${Nt("data")}]`);
D("data", (e, { expression: t }, { cleanup: n }) => {
  if (ga(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  Je(i, e);
  let r = {};
  xo(r, i);
  let s = ft(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Je(s, e);
  let o = Dt(s);
  Ni(o);
  let a = Zt(e, o);
  o.init && ft(e, o.init), n(() => {
    o.destroy && ft(e, o.destroy), a();
  });
});
Ae((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ga(e) {
  return rt ? nn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
D("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let r = P(e, n);
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
  }, a = () => setTimeout(o), l = tn(
    (d) => d ? o() : s(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  i(() => r((d) => {
    !u && d === c || (t.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
D("for", (e, { expression: t }, { effect: n, cleanup: i }) => {
  let r = va(t), s = P(e, r.items), o = P(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => ba(e, r, s, o)), i(() => {
    Object.values(e._x_lookup).forEach((a) => O(
      () => {
        Rt(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function ba(e, t, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    ya(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, g]) => {
        let h = ni(t, g, p, o);
        i((y) => {
          u.includes(y) && V("Duplicate key on x-for", e), u.push(y);
        }, { scope: { index: p, ...h } }), c.push(h);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let g = ni(t, o[p], p, o);
        i((h) => {
          u.includes(h) && V("Duplicate key on x-for", e), u.push(h);
        }, { scope: { index: p, ...g } }), c.push(g);
      }
    let d = [], f = [], m = [], w = [];
    for (let p = 0; p < l.length; p++) {
      let g = l[p];
      u.indexOf(g) === -1 && m.push(g);
    }
    l = l.filter((p) => !m.includes(p));
    let x = "template";
    for (let p = 0; p < u.length; p++) {
      let g = u[p], h = l.indexOf(g);
      if (h === -1)
        l.splice(p, 0, g), d.push([x, p]);
      else if (h !== p) {
        let y = l.splice(p, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(p, 0, E), l.splice(h, 0, y), f.push([y, E]);
      } else
        w.push(g);
      x = g;
    }
    for (let p = 0; p < m.length; p++) {
      let g = m[p];
      g in a && (O(() => {
        Rt(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let p = 0; p < f.length; p++) {
      let [g, h] = f[p], y = a[g], E = a[h], _ = document.createElement("div");
      O(() => {
        E || V('x-for ":key" is undefined or invalid', s, h, a), E.after(_), y.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), _.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), _.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let p = 0; p < d.length; p++) {
      let [g, h] = d[p], y = g === "template" ? s : a[g];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let E = c[h], _ = u[h], b = document.importNode(s.content, !0).firstElementChild, v = Dt(E);
      Zt(b, v, s), b._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([T, S]) => {
          v[T] = S;
        });
      }, O(() => {
        y.after(b), at(() => Z(b))();
      }), typeof _ == "object" && V("x-for key cannot be an object, it must be a string or an integer", s), a[_] = b;
    }
    for (let p = 0; p < w.length; p++)
      a[w[p]]._x_refreshXForScope(c[u.indexOf(w[p])]);
    s._x_prevKeys = u;
  });
}
function va(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function ni(e, t, n, i) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = n), e.collection && (r[e.collection] = i), r;
}
function ya(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Nr() {
}
Nr.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = Ce(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
D("ref", Nr);
D("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && V("x-if can only be used on a <template> tag", e);
  let r = P(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Zt(a, {}, e), O(() => {
      e.after(a), at(() => Z(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      O(() => {
        Rt(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => e._x_undoIf && e._x_undoIf());
});
D("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((r) => sa(e, r));
});
Ae((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
In(Hi("@", qi(Nt("on:"))));
D("on", at((e, { value: t, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? P(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = an(e, t, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Ne("Collapse", "collapse", "collapse");
Ne("Intersect", "intersect", "intersect");
Ne("Focus", "trap", "focus");
Ne("Mask", "mask", "mask");
function Ne(e, t, n) {
  D(t, (i) => V(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
te.setEvaluator(zi);
te.setReactivityEngine({ reactive: Mn, effect: Do, release: ko, raw: $ });
var wa = te, Lr = wa;
function xa(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: i }) {
    let r = ii(i, "duration", 250) / 1e3, s = ii(i, "min", 0), o = !i.includes("min");
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
        let f = n.getBoundingClientRect().height;
        d === f && (d = s), e.transition(n, e.setStyles, {
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
function ii(e, t, n) {
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
var _a = xa;
function Ea(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: Ta(r),
      threshold: Ia(r)
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
function Sa(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Ta(e) {
  const t = "margin", n = "0px 0px 0px 0px", i = e.indexOf(t);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Sa(e[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var Ca = Ea, Rr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], xe = /* @__PURE__ */ Rr.join(","), Mr = typeof Element > "u", vt = Mr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ln = !Mr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Pr = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(xe));
  return n && vt.call(t, xe) && r.unshift(t), r = r.filter(i), r;
}, zr = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = vt.call(o, xe);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), f = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && f) {
        var m = e(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, m) : r.push({
          scope: o,
          candidates: m
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Fr = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, $a = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, Br = function(t) {
  return t.tagName === "INPUT";
}, Aa = function(t) {
  return Br(t) && t.type === "hidden";
}, Oa = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, Da = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, ka = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || ln(t), i = function(a) {
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
  var s = Da(r, t.form);
  return !s || s === t;
}, Na = function(t) {
  return Br(t) && t.type === "radio";
}, La = function(t) {
  return Na(t) && !ka(t);
}, ri = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Ra = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = vt.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (vt.call(o, "details:not([open]) *"))
    return !0;
  var a = ln(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = ln(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return ri(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return ri(t);
  return !1;
}, Ma = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return vt.call(n, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, _e = function(t, n) {
  return !(n.disabled || Aa(n) || Ra(n, t) || // For a details element with a summary, the summary element gets the focus
  Oa(n) || Ma(n));
}, cn = function(t, n) {
  return !(La(n) || Fr(n) < 0 || !_e(t, n));
}, Pa = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, za = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Fr(a, o), c = o ? e(r.candidates) : a;
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
}, Fa = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = zr([t], n.includeContainer, {
    filter: cn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Pa
  }) : i = Pr(t, n.includeContainer, cn.bind(null, n)), za(i);
}, Vr = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = zr([t], n.includeContainer, {
    filter: _e.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Pr(t, n.includeContainer, _e.bind(null, n)), i;
}, ce = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return vt.call(t, xe) === !1 ? !1 : cn(n, t);
}, Ba = /* @__PURE__ */ Rr.concat("iframe").join(","), ge = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return vt.call(t, Ba) === !1 ? !1 : _e(n, t);
};
function si(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function oi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? si(Object(n), !0).forEach(function(i) {
      Va(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : si(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Va(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var ai = /* @__PURE__ */ function() {
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
}(), Ha = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, qa = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, Wa = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, li = function(t) {
  return setTimeout(t, 0);
}, ci = function(t, n) {
  var i = -1;
  return t.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Bt = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, i) : t;
}, ue = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, ja = function(t, n) {
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
  }, o, a = function(b, v, I) {
    return b && b[v] !== void 0 ? b[v] : r[I || v];
  }, l = function(b) {
    return s.containerGroups.findIndex(function(v) {
      var I = v.container, T = v.tabbableNodes;
      return I.contains(b) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(S) {
        return S === b;
      });
    });
  }, c = function(b) {
    var v = r[b];
    if (typeof v == "function") {
      for (var I = arguments.length, T = new Array(I > 1 ? I - 1 : 0), S = 1; S < I; S++)
        T[S - 1] = arguments[S];
      v = v.apply(void 0, T);
    }
    if (v === !0 && (v = void 0), !v) {
      if (v === void 0 || v === !1)
        return v;
      throw new Error("`".concat(b, "` was specified but was not a node, or did not return a node"));
    }
    var A = v;
    if (typeof v == "string" && (A = i.querySelector(v), !A))
      throw new Error("`".concat(b, "` as selector refers to no known node"));
    return A;
  }, u = function() {
    var b = c("initialFocus");
    if (b === !1)
      return !1;
    if (b === void 0)
      if (l(i.activeElement) >= 0)
        b = i.activeElement;
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
        nextTabbableNode: function(S) {
          var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = I.findIndex(function(L) {
            return L === S;
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
    if (b !== !1 && b !== i.activeElement) {
      if (!b || !b.focus) {
        _(u());
        return;
      }
      b.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = b, Ha(b) && b.select();
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
  }, x = function(b) {
    var v = ue(b), I = l(v) >= 0;
    I || v instanceof Document ? I && (s.mostRecentlyFocusedNode = v) : (b.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, p = function(b) {
    var v = ue(b);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(v), S = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        b.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (b.shiftKey) {
        var A = ci(s.tabbableGroups, function(M) {
          var B = M.firstTabbableNode;
          return v === B;
        });
        if (A < 0 && (S.container === v || ge(v, r.tabbableOptions) && !ce(v, r.tabbableOptions) && !S.nextTabbableNode(v, !1)) && (A = T), A >= 0) {
          var k = A === 0 ? s.tabbableGroups.length - 1 : A - 1, L = s.tabbableGroups[k];
          I = L.lastTabbableNode;
        }
      } else {
        var N = ci(s.tabbableGroups, function(M) {
          var B = M.lastTabbableNode;
          return v === B;
        });
        if (N < 0 && (S.container === v || ge(v, r.tabbableOptions) && !ce(v, r.tabbableOptions) && !S.nextTabbableNode(v)) && (N = T), N >= 0) {
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
      }) : f(u()), i.addEventListener("focusin", x, !0), i.addEventListener("mousedown", w, {
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
      return i.removeEventListener("focusin", x, !0), i.removeEventListener("mousedown", w, !0), i.removeEventListener("touchstart", w, !0), i.removeEventListener("click", h, !0), i.removeEventListener("keydown", g, !0), o;
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
      var v = a(b, "onActivate"), I = a(b, "onPostActivate"), T = a(b, "checkCanFocusTrap");
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, v && v();
      var S = function() {
        T && d(), y(), I && I();
      };
      return T ? (T(s.containers.concat()).then(S, S), this) : (S(), this);
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
      var I = a(v, "onDeactivate"), T = a(v, "onPostDeactivate"), S = a(v, "checkCanReturnFocus"), A = a(v, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var k = function() {
        li(function() {
          A && f(m(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return A && S ? (S(m(s.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), y(), this);
    },
    updateContainerElements: function(b) {
      var v = [].concat(b).filter(Boolean);
      return s.containers = v.map(function(I) {
        return typeof I == "string" ? i.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function Ua(e) {
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
        return ge(s);
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
        e.nextTick(() => {
          f = ui(i);
        });
      });
      let m = ja(i, d), w = () => {
      };
      const x = () => {
        f(), f = () => {
        }, w(), w = () => {
        }, m.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (w = Ya()), setTimeout(() => {
          m.activate();
        }, 15)), !p && u && x(), u = !!p);
      })), l(x);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ui(i);
    }
  ));
}
function ui(e) {
  let t = [];
  return Hr(e, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Hr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? Hr(e.parentNode, t) : t(n);
  });
}
function Ya() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
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
function Ga() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function Za({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const n = window.matchMedia(`(${e})`);
    n.matches ? t() : n.addEventListener("change", t, { once: !0 });
  });
}
function Qa({ component: e, argument: t }) {
  return new Promise((n) => {
    const i = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), n());
    }, { rootMargin: i });
    r.observe(e.el);
  });
}
var di = {
  eager: Ja,
  event: Xa,
  idle: Ga,
  media: Za,
  visible: Qa
};
async function tl(e) {
  const t = el(e.strategy);
  await un(e, t);
}
async function un(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((n) => un(e, n))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((n) => un(e, n))
      );
  }
  return di[t.method] ? di[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function el(e) {
  const t = nl(e);
  let n = qr(t);
  return n.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [n]
  } : n;
}
function nl(e) {
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
function qr(e) {
  let t = fi(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const n = e.shift().value, i = fi(e);
    t.type === "expression" && t.operator === n ? t.parameters.push(i) : t = {
      type: "expression",
      operator: n,
      parameters: [t, i]
    };
  }
  return t;
}
function fi(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = qr(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function il(e) {
  const t = "load", n = e.prefixed("load-src"), i = e.prefixed("ignore");
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
  }, e.asyncData = (h, y = !1) => {
    o[h] = {
      loaded: !1,
      download: y
    };
  }, e.asyncUrl = (h, y) => {
    !h || !y || o[h] || (o[h] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        g(y)
      )
    });
  }, e.asyncAlias = (h) => {
    s = h;
  };
  const c = (h) => {
    e.skipDuringClone(() => {
      h._x_async || (h._x_async = "init", h._x_ignore = !0, h.setAttribute(i, ""));
    })();
  }, u = async (h) => {
    e.skipDuringClone(async () => {
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
  u.inline = c, e.directive(t, u).before("ignore");
  function d(h) {
    const y = p(h.getAttribute(e.prefixed("data"))), E = h.getAttribute(e.prefixed(t)) || r.defaultStrategy, _ = h.getAttribute(n);
    return _ && e.asyncUrl(y, _), {
      name: y,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (x(h), !o[h] || o[h].loaded)) return;
    const y = await m(h);
    e.data(h, y), o[h].loaded = !0;
  }
  async function m(h) {
    if (!o[h]) return;
    const y = await o[h].download(h);
    return typeof y == "function" ? y : y[h] || y.default || Object.values(y)[0] || !1;
  }
  function w(h) {
    e.destroyTree(h), h._x_ignore = !1, h.removeAttribute(i), !h.closest(`[${i}]`) && e.initTree(h);
  }
  function x(h) {
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
  function g(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function rl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function sl(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function ol(e, t, n) {
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
}, "getSvgNode"), C = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, nt = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, hi = { OUTLINE: "outline", FILLED: "filled" }, He = { FADE: "fade", SLIDE: "slide" }, Ht = { CLOSE: Vt(ll), SUCCESS: Vt(dl), ERROR: Vt(cl), WARNING: Vt(fl), INFO: Vt(ul) }, pi = Q(function(e) {
  e.wrapper.classList.add(C.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), mi = Q(function(e) {
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
    var n = this;
    rl(this, e), this.notifyOut = Q(function(M) {
      M(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? He.FADE : c, d = t.type, f = d === void 0 ? "outline" : d, m = t.title, w = t.text, x = t.showIcon, p = x === void 0 ? !0 : x, g = t.customIcon, h = g === void 0 ? "" : g, y = t.customClass, E = y === void 0 ? "" : y, _ = t.speed, b = _ === void 0 ? 500 : _, v = t.showCloseButton, I = v === void 0 ? !0 : v, T = t.autoclose, S = T === void 0 ? !0 : T, A = t.autotimeout, k = A === void 0 ? 3e3 : A, L = t.position, N = L === void 0 ? "right top" : L, R = t.customWrapper, H = R === void 0 ? "" : R;
    if (this.customWrapper = H, this.status = l, this.title = m, this.text = w, this.showIcon = p, this.customIcon = h, this.customClass = E, this.speed = b, this.effect = u, this.showCloseButton = I, this.autoclose = S, this.autotimeout = k, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = N, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return ol(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(C.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(C.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](C.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](C.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](C.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](C.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](C.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](C.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](C.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(C.NOTIFY_CLOSE), i.innerHTML = Ht.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = hl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(C.NOTIFY), this.type) {
      case hi.OUTLINE:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
        break;
      case hi.FILLED:
        this.wrapper.classList.add(C.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case nt.SUCCESS:
        this.wrapper.classList.add(C.NOTIFY_SUCCESS);
        break;
      case nt.ERROR:
        this.wrapper.classList.add(C.NOTIFY_ERROR);
        break;
      case nt.WARNING:
        this.wrapper.classList.add(C.NOTIFY_WARNING);
        break;
      case nt.INFO:
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
    var n = Q(function(r) {
      switch (r) {
        case nt.SUCCESS:
          return Ht.SUCCESS;
        case nt.ERROR:
          return Ht.ERROR;
        case nt.WARNING:
          return Ht.WARNING;
        case nt.INFO:
          return Ht.INFO;
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
      case He.FADE:
        this.selectedNotifyInEffect = pi, this.selectedNotifyOutEffect = mi;
        break;
      case He.SLIDE:
        this.selectedNotifyInEffect = pl, this.selectedNotifyOutEffect = ml;
        break;
      default:
        this.selectedNotifyInEffect = pi, this.selectedNotifyOutEffect = mi;
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
  success(e, t = "Success", n = {}) {
    qt({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    qt({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    qt({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    qt({
      status: "info",
      title: t,
      text: e,
      ...n
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
}, dn = function() {
}, Jt = {}, Ee = {}, Xt = {};
function bl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let i = e.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || t(n);
  }; i--; ) {
    if (o = e[i], a = Ee[o], a) {
      s(o, a);
      continue;
    }
    l = Xt[o] = Xt[o] || [], l.push(s);
  }
}
function Jr(e, t) {
  if (!e) return;
  const n = Xt[e];
  if (Ee[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function fn(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || dn)(t) : (e.success || dn)(e);
}
function vl(e, t, n, i, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Xr(t, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(t, l, e.defaultPrevented);
}
function Xr(e, t, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || dn, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, f;
  if (i = i || 0, /(^css!|\.css$)/.test(l))
    f = r.createElement("link"), f.rel = "stylesheet", f.href = c, u = "hideFocus" in f, u && f.relList && (u = 0, f.rel = "preload", f.as = "style"), n.inlineStyleNonce && f.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    f = r.createElement("img"), f.src = c;
  else if (f = r.createElement("script"), f.src = c, f.async = s === void 0 ? !0 : s, n.inlineScriptNonce && f.setAttribute("nonce", n.inlineScriptNonce), d = "noModule" in f, /^module!/.test(l)) {
    if (!d) return t(e, "l");
    f.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return t(e, "l");
  const m = function(w) {
    vl(w, e, f, t, n, i, o, u);
  };
  f.addEventListener("load", m, { once: !0 }), f.addEventListener("error", m, { once: !0 }), a(e, f) !== !1 && r.head.appendChild(f);
}
function yl(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let i = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Xr(e[o], s, n);
}
function it(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in Jt)
      throw "LoadJS";
    Jt[i] = !0;
  }
  function s(o, a) {
    yl(e, function(l) {
      fn(r, l), o && fn({ success: o, error: a }, l), Jr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
it.ready = function(t, n) {
  return bl(t, function(i) {
    fn(n, i);
  }), it;
};
it.done = function(t) {
  Jr(t, []);
};
it.reset = function() {
  Object.keys(Jt).forEach((t) => delete Jt[t]), Object.keys(Ee).forEach((t) => delete Ee[t]), Object.keys(Xt).forEach((t) => delete Xt[t]);
};
it.isDefined = function(t) {
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
    let n = Alpine.$data(t);
    if (n === void 0) {
      const i = t.closest?.("[x-data]");
      i && (n = Alpine.$data(i));
    }
    return n === void 0 && gi("element", t), n;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const n = `[data-alpine-root="${Zr(t)}"]`;
    let i = null;
    const r = document.getElementById(t);
    if (r && (i = r.matches(n) ? r : r.querySelector(n)), i || (i = Gr(t)), !i) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${n} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(i);
    return s === void 0 && gi(`data-alpine-root="${t}"`, i), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function xl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", n = e.getAttribute?.("data-for");
  if (t || n) {
    const i = n || "";
    if (!i) return e;
    const r = Gr(i);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${i}". Ensure the teleported root rendered with data-alpine-root="${i}".`
    ), null);
  }
  return e;
}
function Gr(e) {
  const t = `[data-alpine-root="${Zr(e)}"]`, n = document.querySelectorAll(t);
  for (const i of n)
    if (i.hasAttribute("x-data")) return i;
  return n.length > 0 ? n[0] : document.getElementById(e) || null;
}
function Zr(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function gi(e, t) {
  const n = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${n}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
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
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== t.sectionId && !t.allowMultiple && (t.open = !1);
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
function Sl(e) {
  e.data("rzAspectRatio", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function Tl(e) {
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
      const n = JSON.parse(this.$el.dataset.assets || "[]"), i = this.$el.dataset.configId, r = this.$el.dataset.nonce;
      if (n.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      t(n, {
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
      let n, i, r = !1;
      if (this.dates.length > 0) {
        const a = this.parseIsoLocal(this.dates[0]);
        isNaN(a.getTime()) || (n = a.getMonth(), i = a.getFullYear(), r = !0);
      }
      const s = JSON.stringify({ mode: this.mode, dates: t, m: n, y: i });
      if (this._lastAppliedState === s) return;
      this._lastAppliedState = s;
      const o = { selectedDates: t };
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
    _format(t) {
      const n = this.parseIsoLocal(t);
      return isNaN(n.getTime()) ? t : new Intl.DateTimeFormat(this.locale, this.formatOptions).format(n);
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
      const [n, i, r] = t.split("-").map(Number), s = new Date(Date.UTC(n, i - 1, r));
      return s.getUTCFullYear() === n && s.getUTCMonth() + 1 === i && s.getUTCDate() === r;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(t) {
      const i = (Array.isArray(t) ? t : []).flat(1 / 0).flatMap((r) => typeof r == "string" ? this._extractIsoDates(r) : []).filter((r) => this._isValidIsoDate(r));
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
    parseIsoLocal(t) {
      const [n, i, r] = t.split("-").map(Number);
      return new Date(n, i - 1, r);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(t) {
      const n = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
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
    addDays(t) {
      if (this.dates.length === 0) return;
      const n = this.parseIsoLocal(this.dates[0]);
      isNaN(n.getTime()) || (n.setDate(n.getDate() + t), this.dates = this._normalize([this.toLocalISO(n)]));
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
      let n;
      this.dates.includes(t) ? n = this.dates.filter((i) => i !== t) : n = [...this.dates, t], this.dates = this._normalize(n);
    }
  }));
}
function Al(e, t) {
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
      i.length > 0 && typeof t == "function" ? t(
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
      const n = JSON.parse(this.$el.dataset.assets || "[]"), i = this.$el.dataset.nonce;
      n.length > 0 && typeof t == "function" ? t(n, {
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
        return e && typeof e.addScopeToNode == "function" ? e.addScopeToNode(c, d) : c._x_dataStack = [d], c.innerHTML = a.innerHTML, c;
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
function Nl(e, t) {
  e.data("rzDateEdit", () => ({
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
function Ll(e) {
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
const At = Math.min, mt = Math.max, Ie = Math.round, de = Math.floor, J = (e) => ({
  x: e,
  y: e
}), Rl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Ml = {
  start: "end",
  end: "start"
};
function hn(e, t, n) {
  return mt(e, At(t, n));
}
function ee(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function yt(e) {
  return e.split("-")[0];
}
function ne(e) {
  return e.split("-")[1];
}
function Qr(e) {
  return e === "x" ? "y" : "x";
}
function Pn(e) {
  return e === "y" ? "height" : "width";
}
function gt(e) {
  return ["top", "bottom"].includes(yt(e)) ? "y" : "x";
}
function zn(e) {
  return Qr(gt(e));
}
function Pl(e, t, n) {
  n === void 0 && (n = !1);
  const i = ne(e), r = zn(e), s = Pn(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = Se(o)), [o, Se(o)];
}
function zl(e) {
  const t = Se(e);
  return [pn(e), t, pn(t)];
}
function pn(e) {
  return e.replace(/start|end/g, (t) => Ml[t]);
}
function Fl(e, t, n) {
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
function Bl(e, t, n, i) {
  const r = ne(e);
  let s = Fl(yt(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(pn)))), s;
}
function Se(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Rl[t]);
}
function Vl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function ts(e) {
  return typeof e != "number" ? Vl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Te(e) {
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
function bi(e, t, n) {
  let {
    reference: i,
    floating: r
  } = e;
  const s = gt(t), o = zn(t), a = Pn(o), l = yt(t), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
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
  switch (ne(t)) {
    case "start":
      m[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += f * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const Hl = async (e, t, n) => {
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
  } = bi(c, i, l), f = i, m = {}, w = 0;
  for (let x = 0; x < a.length; x++) {
    const {
      name: p,
      fn: g
    } = a[x], {
      x: h,
      y,
      data: E,
      reset: _
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
        reference: e,
        floating: t
      }
    });
    u = h ?? u, d = y ?? d, m = {
      ...m,
      [p]: {
        ...m[p],
        ...E
      }
    }, _ && w <= 50 && (w++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (c = _.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : _.rects), {
      x: u,
      y: d
    } = bi(c, f, l)), x = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: m
  };
};
async function es(e, t) {
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
    altBoundary: f = !1,
    padding: m = 0
  } = ee(t, e), w = ts(m), p = a[f ? d === "floating" ? "reference" : "floating" : d], g = Te(await s.getClippingRect({
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
  }, _ = Te(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: y,
    strategy: l
  }) : h);
  return {
    top: (g.top - _.top + w.top) / E.y,
    bottom: (_.bottom - g.bottom + w.bottom) / E.y,
    left: (g.left - _.left + w.left) / E.x,
    right: (_.right - g.right + w.right) / E.x
  };
}
const ql = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: i,
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
      x: n,
      y: i
    }, m = zn(r), w = Pn(m), x = await o.getDimensions(c), p = m === "y", g = p ? "top" : "left", h = p ? "bottom" : "right", y = p ? "clientHeight" : "clientWidth", E = s.reference[w] + s.reference[m] - f[m] - s.floating[w], _ = f[m] - s.reference[m], b = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let v = b ? b[y] : 0;
    (!v || !await (o.isElement == null ? void 0 : o.isElement(b))) && (v = a.floating[y] || s.floating[w]);
    const I = E / 2 - _ / 2, T = v / 2 - x[w] / 2 - 1, S = At(d[g], T), A = At(d[h], T), k = S, L = v - x[w] - A, N = v / 2 - x[w] / 2 + I, R = hn(k, N, L), H = !l.arrow && ne(r) != null && N !== R && s.reference[w] / 2 - (N < k ? S : A) - x[w] / 2 < 0, M = H ? N < k ? N - k : N - L : 0;
    return {
      [m]: f[m] + M,
      data: {
        [m]: R,
        centerOffset: N - R - M,
        ...H && {
          alignmentOffset: M
        }
      },
      reset: H
    };
  }
}), Wl = function(e) {
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
        fallbackPlacements: f,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: w = "none",
        flipAlignment: x = !0,
        ...p
      } = ee(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const g = yt(r), h = gt(a), y = yt(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = f || (y || !x ? [Se(a)] : zl(a)), b = w !== "none";
      !f && b && _.push(...Bl(a, x, w, E));
      const v = [a, ..._], I = await es(t, p), T = [];
      let S = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && T.push(I[g]), d) {
        const R = Pl(r, o, E);
        T.push(I[R[0]], I[R[1]]);
      }
      if (S = [...S, {
        placement: r,
        overflows: T
      }], !T.every((R) => R <= 0)) {
        var A, k;
        const R = (((A = s.flip) == null ? void 0 : A.index) || 0) + 1, H = v[R];
        if (H) {
          var L;
          const B = d === "alignment" ? h !== gt(H) : !1, Y = ((L = S[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!B || Y)
            return {
              data: {
                index: R,
                overflows: S
              },
              reset: {
                placement: H
              }
            };
        }
        let M = (k = S.filter((B) => B.overflows[0] <= 0).sort((B, Y) => B.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!M)
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
async function jl(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = yt(n), a = ne(n), l = gt(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = ee(t, e);
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
const Ul = function(e) {
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
      } = t, l = await jl(t, e);
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
}, Yl = function(e) {
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
      } = ee(e, t), c = {
        x: n,
        y: i
      }, u = await es(t, l), d = gt(yt(r)), f = Qr(d);
      let m = c[f], w = c[d];
      if (s) {
        const p = f === "y" ? "top" : "left", g = f === "y" ? "bottom" : "right", h = m + u[p], y = m - u[g];
        m = hn(h, m, y);
      }
      if (o) {
        const p = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", h = w + u[p], y = w - u[g];
        w = hn(h, w, y);
      }
      const x = a.fn({
        ...t,
        [f]: m,
        [d]: w
      });
      return {
        ...x,
        data: {
          x: x.x - n,
          y: x.y - i,
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
  return ns(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function F(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function G(e) {
  var t;
  return (t = (ns(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function ns(e) {
  return Le() ? e instanceof Node || e instanceof F(e).Node : !1;
}
function W(e) {
  return Le() ? e instanceof Element || e instanceof F(e).Element : !1;
}
function X(e) {
  return Le() ? e instanceof HTMLElement || e instanceof F(e).HTMLElement : !1;
}
function vi(e) {
  return !Le() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof F(e).ShadowRoot;
}
function ie(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = j(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function Kl(e) {
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
function Fn(e) {
  const t = Bn(), n = W(e) ? j(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Jl(e) {
  let t = ot(e);
  for (; X(t) && !Ot(t); ) {
    if (Fn(t))
      return t;
    if (Re(t))
      return null;
    t = ot(t);
  }
  return null;
}
function Bn() {
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
function ot(e) {
  if (Mt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    vi(e) && e.host || // Fallback.
    G(e)
  );
  return vi(t) ? t.host : t;
}
function is(e) {
  const t = ot(e);
  return Ot(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : X(t) && ie(t) ? t : is(t);
}
function Gt(e, t, n) {
  var i;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const r = is(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = F(r);
  if (s) {
    const a = mn(o);
    return t.concat(o, o.visualViewport || [], ie(r) ? r : [], a && n ? Gt(a) : []);
  }
  return t.concat(r, Gt(r, [], n));
}
function mn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function rs(e) {
  const t = j(e);
  let n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const r = X(e), s = r ? e.offsetWidth : n, o = r ? e.offsetHeight : i, a = Ie(n) !== s || Ie(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Vn(e) {
  return W(e) ? e : e.contextElement;
}
function Tt(e) {
  const t = Vn(e);
  if (!X(t))
    return J(1);
  const n = t.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = rs(t);
  let o = (s ? Ie(n.width) : n.width) / i, a = (s ? Ie(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Xl = /* @__PURE__ */ J(0);
function ss(e) {
  const t = F(e);
  return !Bn() || !t.visualViewport ? Xl : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Gl(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== F(e) ? !1 : t;
}
function wt(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = Vn(e);
  let o = J(1);
  t && (i ? W(i) && (o = Tt(i)) : o = Tt(e));
  const a = Gl(s, n, i) ? ss(s) : J(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = F(s), m = i && W(i) ? F(i) : i;
    let w = f, x = mn(w);
    for (; x && i && m !== w; ) {
      const p = Tt(x), g = x.getBoundingClientRect(), h = j(x), y = g.left + (x.clientLeft + parseFloat(h.paddingLeft)) * p.x, E = g.top + (x.clientTop + parseFloat(h.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += y, c += E, w = F(x), x = mn(w);
    }
  }
  return Te({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Hn(e, t) {
  const n = Me(e).scrollLeft;
  return t ? t.left + n : wt(G(e)).left + n;
}
function os(e, t, n) {
  n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), r = i.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Hn(e, i)
  )), s = i.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Zl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = G(i), a = t ? Re(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = J(1);
  const u = J(0), d = X(i);
  if ((d || !d && !s) && ((Mt(i) !== "body" || ie(o)) && (l = Me(i)), X(i))) {
    const m = wt(i);
    c = Tt(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const f = o && !d && !s ? os(o, l, !0) : J(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Ql(e) {
  return Array.from(e.getClientRects());
}
function tc(e) {
  const t = G(e), n = Me(e), i = e.ownerDocument.body, r = mt(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = mt(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Hn(e);
  const a = -n.scrollTop;
  return j(i).direction === "rtl" && (o += mt(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function ec(e, t) {
  const n = F(e), i = G(e), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Bn();
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
  const n = wt(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = X(e) ? Tt(e) : J(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function yi(e, t, n) {
  let i;
  if (t === "viewport")
    i = ec(e, n);
  else if (t === "document")
    i = tc(G(e));
  else if (W(t))
    i = nc(t, n);
  else {
    const r = ss(e);
    i = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return Te(i);
}
function as(e, t) {
  const n = ot(e);
  return n === t || !W(n) || Ot(n) ? !1 : j(n).position === "fixed" || as(n, t);
}
function ic(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = Gt(e, [], !1).filter((a) => W(a) && Mt(a) !== "body"), r = null;
  const s = j(e).position === "fixed";
  let o = s ? ot(e) : e;
  for (; W(o) && !Ot(o); ) {
    const a = j(o), l = Fn(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || ie(o) && !l && as(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = ot(o);
  }
  return t.set(e, i), i;
}
function rc(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? Re(t) ? [] : ic(t, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = yi(t, u, r);
    return c.top = mt(d.top, c.top), c.right = At(d.right, c.right), c.bottom = At(d.bottom, c.bottom), c.left = mt(d.left, c.left), c;
  }, yi(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function sc(e) {
  const {
    width: t,
    height: n
  } = rs(e);
  return {
    width: t,
    height: n
  };
}
function oc(e, t, n) {
  const i = X(t), r = G(t), s = n === "fixed", o = wt(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = J(0);
  function c() {
    l.x = Hn(r);
  }
  if (i || !i && !s)
    if ((Mt(t) !== "body" || ie(r)) && (a = Me(t)), i) {
      const m = wt(t, !0, s, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
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
function qe(e) {
  return j(e).position === "static";
}
function wi(e, t) {
  if (!X(e) || j(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return G(e) === n && (n = n.ownerDocument.body), n;
}
function ls(e, t) {
  const n = F(e);
  if (Re(e))
    return n;
  if (!X(e)) {
    let r = ot(e);
    for (; r && !Ot(r); ) {
      if (W(r) && !qe(r))
        return r;
      r = ot(r);
    }
    return n;
  }
  let i = wi(e, t);
  for (; i && Kl(i) && qe(i); )
    i = wi(i, t);
  return i && Ot(i) && qe(i) && !Fn(i) ? n : i || Jl(e) || n;
}
const ac = async function(e) {
  const t = this.getOffsetParent || ls, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: oc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function lc(e) {
  return j(e).direction === "rtl";
}
const cc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Zl,
  getDocumentElement: G,
  getClippingRect: rc,
  getOffsetParent: ls,
  getElementRects: ac,
  getClientRects: Ql,
  getDimensions: sc,
  getScale: Tt,
  isElement: W,
  isRTL: lc
};
function cs(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function uc(e, t) {
  let n = null, i;
  const r = G(e);
  function s() {
    var a;
    clearTimeout(i), (a = n) == null || a.disconnect(), n = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = e.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: m
    } = c;
    if (a || t(), !f || !m)
      return;
    const w = de(d), x = de(r.clientWidth - (u + f)), p = de(r.clientHeight - (d + m)), g = de(u), y = {
      rootMargin: -w + "px " + -x + "px " + -p + "px " + -g + "px",
      threshold: mt(0, At(1, l)) || 1
    };
    let E = !0;
    function _(b) {
      const v = b[0].intersectionRatio;
      if (v !== l) {
        if (!E)
          return o();
        v ? o(!1, v) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      v === 1 && !cs(c, e.getBoundingClientRect()) && o(), E = !1;
    }
    try {
      n = new IntersectionObserver(_, {
        ...y,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(_, y);
    }
    n.observe(e);
  }
  return o(!0), s;
}
function dc(e, t, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, c = Vn(e), u = r || s ? [...c ? Gt(c) : [], ...Gt(t)] : [];
  u.forEach((g) => {
    r && g.addEventListener("scroll", n, {
      passive: !0
    }), s && g.addEventListener("resize", n);
  });
  const d = c && a ? uc(c, n) : null;
  let f = -1, m = null;
  o && (m = new ResizeObserver((g) => {
    let [h] = g;
    h && h.target === c && m && (m.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var y;
      (y = m) == null || y.observe(t);
    })), n();
  }), c && !l && m.observe(c), m.observe(t));
  let w, x = l ? wt(e) : null;
  l && p();
  function p() {
    const g = wt(e);
    x && !cs(x, g) && n(), x = g, w = requestAnimationFrame(p);
  }
  return n(), () => {
    var g;
    u.forEach((h) => {
      r && h.removeEventListener("scroll", n), s && h.removeEventListener("resize", n);
    }), d?.(), (g = m) == null || g.disconnect(), m = null, l && cancelAnimationFrame(w);
  };
}
const xt = Ul, _t = Yl, Et = Wl, fc = ql, It = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: cc,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Hl(e, t, {
    ...r,
    platform: s
  });
};
function hc(e) {
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
      }).then(({ x: t, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${t}px`, top: `${n}px` });
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
      const n = this.menuItems.indexOf(t);
      n !== -1 && (this.focusedIndex = n, t.focus());
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
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
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(t) {
      const n = t.currentTarget;
      this.focusSelectedItem(n), n.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
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
      ).forEach((n) => e.$data(n)?.closeSubmenu?.()), this.isSubmenuActive = !1;
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
          const i = document.querySelectorAll(
            `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.parentDropdown.selfId}"]`
          );
          Array.from(i).some((s) => e.$data(s)?.open) || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || It(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [xt(this.pixelOffset), Et(), _t({ padding: 8 })]
      }).then(({ x: n, y: i }) => {
        Object.assign(t.style, { left: `${n}px`, top: `${i}px` });
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
      t && Array.from(t).some((i) => e.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
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
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
        e.$data(n)?.closeSubmenu();
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
        e.$data(n)?.closeSubmenu();
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
      const n = t.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          e.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
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
      const n = t.currentTarget;
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(n);
      i !== -1 && (this.focusedIndex = i, n.focus()), n.getAttribute("aria-haspopup") === "menu" ? e.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
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
function pc(e) {
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
function mc(e) {
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
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function gc(e) {
  e.data("rzEventViewer", () => ({
    eventNames: [],
    entries: [],
    error: null,
    paused: !1,
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
    init() {
      if (this.target = this.$el.dataset.target || "window", this.maxEntries = Number.parseInt(this.$el.dataset.maxEntries || "200", 10), this.autoScroll = this.parseBoolean(this.$el.dataset.autoScroll, !0), this.pretty = this.parseBoolean(this.$el.dataset.pretty, !0), this.showTimestamp = this.parseBoolean(this.$el.dataset.showTimestamp, !0), this.showEventMeta = this.parseBoolean(this.$el.dataset.showEventMeta, !1), this.level = this.$el.dataset.level || "info", this.filterPath = this.$el.dataset.filter || "", this.eventNames = this.resolveEventNames(), this.eventNames.length === 0) {
        this.error = "At least one event name is required.";
        return;
      }
      if (this.targetEl = this.resolveTargetElement(this.target), !this.targetEl) {
        this.error = `Unable to resolve target: ${this.target}`;
        return;
      }
      for (const t of this.eventNames) {
        const n = this.createHandler(t);
        this._handlers.set(t, n), this.targetEl.addEventListener(t, n), this._boundEvents.add(t);
      }
      this.appendSystemEntry(`Listening for: ${this.eventNames.join(", ")}`);
    },
    destroy() {
      if (this.targetEl)
        for (const [t, n] of this._handlers.entries())
          this.targetEl.removeEventListener(t, n);
      this._handlers.clear(), this._boundEvents.clear();
    },
    parseBoolean(t, n) {
      return typeof t != "string" || t.length === 0 ? n : t === "true";
    },
    resolveEventNames() {
      const t = [], n = this.$el.dataset.eventName || "", i = this.$el.dataset.eventNames || "";
      if (n.trim().length > 0 && t.push(n.trim()), i.trim().length > 0) {
        const o = i.trim();
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
      return (n) => {
        if (this.paused)
          return;
        const i = n?.type || t, r = n instanceof CustomEvent ? n.detail : n?.detail, s = this.applyFilter(r, this.filterPath);
        this.entries.push(this.buildEntry(i, s)), this.enforceMaxEntries(), this.scrollToBottom();
      };
    },
    buildEntry(t, n) {
      const i = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "", r = this.stringifyDetail(n), s = this.showEventMeta ? ` [level:${this.level}]` : "";
      return {
        id: `${t}-${this._entryId++}`,
        type: t,
        level: this.level,
        hasTimestamp: this.showTimestamp,
        timestamp: i,
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
    applyFilter(t, n) {
      if (!n || n.trim().length === 0)
        return t;
      const i = n.split(".").map((s) => s.trim()).filter(Boolean);
      let r = t;
      for (const s of i) {
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
    copyEntries() {
      const t = this.entries.map((n) => `${n.hasTimestamp ? `${n.timestamp} ` : ""}${n.type} ${n.body}`).join(`
`);
      navigator.clipboard && typeof navigator.clipboard.writeText == "function" && navigator.clipboard.writeText(t);
    }
  }));
}
function bc(e) {
  e.data("rzEmpty", () => {
  });
}
function vc(e) {
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
        const n = (r, s) => {
          r.forEach((o) => {
            o.isIntersecting && t.setCurrentHeading(t.headingId);
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
function yc(e) {
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
function wc(e) {
  e.data("rzInputGroupAddon", () => ({
    /**
     * Executes the `handleClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleClick` when applicable.
     */
    handleClick(t) {
      if (t.target.closest("button"))
        return;
      const n = this.$el.parentElement;
      n && n.querySelector("input, textarea")?.focus();
    }
  }));
}
function xc(e, t) {
  e.data("rzMarkdown", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function _c(e) {
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
    setTriggerState(t, n) {
      t && (t.dataset.state = n ? "open" : "closed", t.setAttribute("aria-expanded", n ? "true" : "false"));
    },
    commonPrefixLen(t, n) {
      let i = 0;
      for (; i < t.length && i < n.length && t[i] === n[i]; ) i++;
      return i;
    },
    setOpenPath(t) {
      const n = Array.isArray(t) ? t.filter(Boolean) : [], i = this.commonPrefixLen(this.openPath, n);
      (i !== this.openPath.length || i !== n.length) && (this.openPath = n, this.$nextTick(() => this.syncSubmenus()));
    },
    openMenu(t, n) {
      t && (this.cancelCloseAll(), this.currentTrigger && this.currentTrigger !== n && this.setTriggerState(this.currentTrigger, !1), this.currentMenuValue = t, this.currentTrigger = n, this.setTriggerState(n, !0), this.setOpenPath([]), this.$nextTick(() => {
        const i = this.$el.querySelector(`[data-menu-content="${t}"]`) ?? document.querySelector(`[data-menu-content="${t}"]`);
        !i || !n || It(n, i, {
          placement: "bottom-start",
          middleware: [xt(4), Et(), _t({ padding: 8 })]
        }).then(({ x: r, y: s }) => {
          Object.assign(i.style, { left: `${r}px`, top: `${s}px` });
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
      const n = t.currentTarget, i = this.getMenuValueFromTrigger(n);
      this.currentMenuValue === i ? this.closeMenus() : this.openMenu(i, n), t.preventDefault();
    },
    handleTriggerPointerEnter(t) {
      if (!this.currentMenuValue) return;
      const n = t.currentTarget, i = this.getMenuValueFromTrigger(n);
      i && i !== this.currentMenuValue && this.openMenu(i, n);
    },
    handleTriggerKeydown(t) {
      const n = t.currentTarget, i = this.getMenuValueFromTrigger(n);
      if (["Enter", " ", "ArrowDown"].includes(t.key)) {
        this.openMenu(i, n), t.preventDefault();
        return;
      }
      if (["ArrowRight", "ArrowLeft"].includes(t.key)) {
        const r = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), s = r.indexOf(n);
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
      const n = t.currentTarget;
      if (!n || n.hasAttribute("disabled") || n.getAttribute("aria-disabled") === "true") return;
      n.dataset.highlighted = "", n.focus();
      const i = this.buildPathToSubTrigger(n);
      this.setOpenPath(i);
    },
    handleItemMouseLeave(t) {
      const n = t.currentTarget;
      n && (delete n.dataset.highlighted, document.activeElement === n && n.blur());
    },
    handleItemClick(t) {
      const n = t.currentTarget;
      n.hasAttribute("disabled") || n.getAttribute("aria-disabled") === "true" || n.getAttribute("aria-haspopup") !== "menu" && (this.closeMenus(), this.currentTrigger?.focus());
    },
    toggleCheckboxItem(t) {
      const n = t.currentTarget, i = n.getAttribute("data-state") === "checked";
      n.setAttribute("data-state", i ? "unchecked" : "checked"), n.setAttribute("aria-checked", i ? "false" : "true");
    },
    selectRadioItem(t) {
      const n = t.currentTarget, i = n.getAttribute("data-radio-group");
      if (!i) return;
      (this.$el.closest(`[role="group"][data-radio-group="${i}"]`)?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${i}"]`) ?? []).forEach((o) => {
        o.setAttribute("data-state", "unchecked"), o.setAttribute("aria-checked", "false");
      }), n.setAttribute("data-state", "checked"), n.setAttribute("aria-checked", "true");
    },
    buildPathToSubTrigger(t) {
      const n = [];
      let i = t.closest('[data-slot="menubar-sub"]');
      for (; i; ) {
        const r = i.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!r?.id) break;
        n.unshift(r.id), i = i.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
      }
      return n;
    },
    handleSubTriggerPointerEnter(t) {
      if (!this.currentMenuValue) return;
      this.cancelCloseAll();
      const n = t.currentTarget, i = this.buildPathToSubTrigger(n);
      this.setOpenPath(i);
    },
    handleSubTriggerClick(t) {
      const n = t.currentTarget, i = this.buildPathToSubTrigger(n), r = this.openPath.length === i.length && this.openPath.every((s, o) => s === i[o]);
      this.setOpenPath(r ? i.slice(0, -1) : i);
    },
    handleSubTriggerKeyRight(t) {
      this.handleSubTriggerPointerEnter(t), this.$nextTick(() => {
        t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(t) {
      const n = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!n.length) return;
      const i = n.indexOf(document.activeElement), r = i < 0 || i >= n.length - 1 ? 0 : i + 1;
      n[r]?.focus();
    },
    focusPreviousItem(t) {
      const n = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!n.length) return;
      const i = n.indexOf(document.activeElement), r = i <= 0 ? n.length - 1 : i - 1;
      n[r]?.focus();
    },
    handleSubContentLeftKey(t) {
      const i = t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!i) return;
      const r = this.buildPathToSubTrigger(i);
      this.setOpenPath(r.slice(0, -1)), i.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((i) => {
        const r = i.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), s = i.querySelector(':scope > [data-slot="menubar-sub-content"]'), o = r?.id, a = !!o && this.openPath.includes(o);
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
      const n = t.target;
      if (n instanceof Node && this.$el.contains(n)) return;
      const i = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      n instanceof Node && i?.contains(n) || this.closeMenus();
    },
    handleDocumentFocusIn(t) {
      const n = t.target;
      !(n instanceof Node) || this.$el.contains(n) || (this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.contains(n) || this.closeMenus();
    },
    handleWindowBlur() {
      this.closeMenus();
    }
  }));
}
function Ec(e, t) {
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
function Ic(e) {
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
      const t = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || null, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(xt({
        mainAxis: n,
        crossAxis: i,
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
function Tc(e) {
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
      this.currentVal = parseInt(t.getAttribute("data-current-val")) || 0, this.minVal = parseInt(t.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(t.getAttribute("data-max-val")) || 100, this.label = t.getAttribute("data-label"), this.calculatePercentage(), t.setAttribute("aria-valuenow", this.currentVal), t.setAttribute("aria-valuemin", this.minVal), t.setAttribute("aria-valuemax", this.maxVal), t.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((i) => {
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
      const t = this.$refs.progressBar, n = this.$refs.progressBarLabel, i = this.$refs.innerLabel;
      n && t && i && (i.innerText = this.buildLabel(), n.clientWidth > t.clientWidth ? n.style.left = t.clientWidth + 10 + "px" : n.style.left = t.clientWidth / 2 - n.clientWidth / 2 + "px");
    },
    /**
     * Executes the `getLabelCss` operation.
     * @returns {any} Returns the result of `getLabelCss` when applicable.
     */
    getLabelCss() {
      const t = this.$refs.progressBarLabel, n = this.$refs.progressBar;
      return t && n && t.clientWidth > n.clientWidth ? "text-foreground dark:text-foreground" : "";
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
function Cc(e) {
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
function $c(e) {
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
      const n = () => this.update();
      this._roViewport = new ResizeObserver(n), this._roContent = new ResizeObserver(n), this._roViewport.observe(t), this.$refs.content && this._roContent.observe(this.$refs.content), this.setState(this.type === "always" ? "visible" : "hidden"), this.update();
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
    setBarMounted(t, n) {
      const i = this.$refs[`scrollbar${t === "vertical" ? "Y" : "X"}`];
      i && (i.hidden = !n);
    },
    /**
     * Executes the `update` operation.
     * @returns {any} Returns the result of `update` when applicable.
     */
    update() {
      const t = this.$refs.viewport;
      if (!t) return;
      this._viewport = t;
      const n = t.scrollWidth > t.clientWidth, i = t.scrollHeight > t.clientHeight;
      this.setBarMounted("horizontal", n), this.setBarMounted("vertical", i), this.updateThumbSizes(), this.updateThumbPositions(), this.updateCorner(), this.type === "always" && this.setState("visible"), this.type === "auto" && this.setState(n || i ? "visible" : "hidden");
    },
    /**
     * Executes the `updateThumbSizes` operation.
     * @returns {any} Returns the result of `updateThumbSizes` when applicable.
     */
    updateThumbSizes() {
      const t = this.$refs.viewport;
      if (t) {
        if (this._viewport = t, this.$refs.thumbY && this.$refs.scrollbarY && t.scrollHeight > 0) {
          const n = t.clientHeight / t.scrollHeight, i = Math.max(this.$refs.scrollbarY.clientHeight * n, 18);
          this.$refs.thumbY.style.height = `${i}px`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > 0) {
          const n = t.clientWidth / t.scrollWidth, i = Math.max(this.$refs.scrollbarX.clientWidth * n, 18);
          this.$refs.thumbX.style.width = `${i}px`;
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
          const n = t.scrollHeight - t.clientHeight, i = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, r = t.scrollTop / n * Math.max(i, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${r}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > t.clientWidth) {
          const n = t.scrollWidth - t.clientWidth, i = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, r = t.scrollLeft / n * Math.max(i, 0);
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
      const n = t.currentTarget?.dataset.orientation || "vertical", i = this.$refs[`scrollbar${n === "vertical" ? "Y" : "X"}`];
      if (!i || i.hidden || t.target === this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`]) return;
      const r = this.$refs.viewport, s = this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`];
      if (!r || !s) return;
      const o = i.getBoundingClientRect();
      if (n === "vertical") {
        const a = t.clientY - o.top - s.offsetHeight / 2, l = i.clientHeight - s.offsetHeight, c = r.scrollHeight - r.clientHeight;
        r.scrollTop = a / Math.max(l, 1) * c;
      } else {
        const a = t.clientX - o.left - s.offsetWidth / 2, l = i.clientWidth - s.offsetWidth, c = r.scrollWidth - r.clientWidth;
        r.scrollLeft = a / Math.max(l, 1) * c;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(t) {
      const n = t.currentTarget?.dataset.orientation || "vertical", i = this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`], r = this.$refs[`scrollbar${n === "vertical" ? "Y" : "X"}`];
      if (!i || !r || r.hidden) return;
      const s = i.getBoundingClientRect();
      this._dragAxis = n, this._dragPointerOffset = n === "vertical" ? t.clientY - s.top : t.clientX - s.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(t) {
      const n = this._dragAxis, i = this.$refs.viewport, r = this.$refs[`scrollbar${n === "vertical" ? "Y" : "X"}`], s = this.$refs[`thumb${n === "vertical" ? "Y" : "X"}`];
      if (!n || !i || !r || !s || r.hidden) return;
      const o = r.getBoundingClientRect();
      if (n === "vertical") {
        const a = t.clientY - o.top, l = r.clientHeight - s.offsetHeight, c = i.scrollHeight - i.clientHeight;
        i.scrollTop = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
      } else {
        const a = t.clientX - o.left, l = r.clientWidth - s.offsetWidth, c = i.scrollWidth - i.clientWidth;
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
function Ac(e) {
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
function Oc(e) {
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
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), t && this._triggers.some((n) => n.dataset.value === t) ? this.selectedTab = t : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
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
      const n = t.currentTarget?.dataset?.value;
      !n || t.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = n, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
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
      const t = this.$el.dataset.value, n = this.isSelected(t), i = this.$el.getAttribute("aria-disabled") === "true";
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
    onListKeydown(t) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(t.key)) {
        t.preventDefault();
        const n = this._triggers.filter((l) => l.getAttribute("aria-disabled") !== "true");
        if (n.length === 0) return;
        const i = n.findIndex((l) => l.dataset.value === this.selectedTab);
        if (i === -1) return;
        const r = t.currentTarget?.getAttribute("aria-orientation") === "vertical", s = r ? "ArrowUp" : "ArrowLeft", o = r ? "ArrowDown" : "ArrowRight";
        let a = i;
        switch (t.key) {
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
function Dc(e) {
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
function kc(e) {
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
        const n = this.getBooleanDataset("open", t), i = this.isControlledOpenState ? n : t;
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
    getBooleanDataset(t, n) {
      const i = this.$el.dataset[t];
      return typeof i > "u" ? n : i === "true";
    },
    /**
     * Executes the `getNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNumberDataset` when applicable.
     */
    getNumberDataset(t, n) {
      const i = Number(this.$el.dataset[t]);
      return Number.isFinite(i) ? i : n;
    },
    /**
     * Executes the `getNullableNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
     */
    getNullableNumberDataset(t, n) {
      const i = this.$el.dataset[t];
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
      this.enableFlip && t.push(Et()), this.enableShift && t.push(_t({ padding: this.shiftPadding })), this.arrowEl && t.push(fc({ element: this.arrowEl })), It(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: t
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
function Nc(e) {
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
      const t = this.cookieName ? document.cookie.split("; ").find((i) => i.startsWith(`${this.cookieName}=`))?.split("=")[1] : null, n = this.$el.dataset.defaultOpen === "true";
      this.open = t != null ? t === "true" : n, this.checkIfMobile(), window.addEventListener("keydown", (i) => {
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
function Lc(e) {
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
      let n = 0;
      for (let i = 0; i < t.length; i++)
        n = (n << 5) - n + t.charCodeAt(i), n |= 0;
      return String(n >>> 0);
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
      const n = t?.name || t?.label || JSON.stringify(t ?? {});
      return `item-${this.hashString(String(n))}`;
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
      let n = [];
      if (t) {
        const r = document.getElementById(t);
        if (r)
          try {
            n = JSON.parse(r.textContent || "[]");
          } catch (s) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, s);
          }
      }
      n.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      const i = n.map((r) => ({
        ...r,
        id: this.resolveStableItemId(r),
        isDataItem: !0
      }));
      this.registerItems(i, { suppressFilter: !0 }), this.itemsUrl && this.fetchTrigger === "immediate" ? this.fetchItems() : this.filterAndSortItems(), this.$watch("search", (r) => {
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
      const n = t.name || "", i = Array.isArray(t.keywords) ? t.keywords : [];
      return {
        ...t,
        id: this.resolveStableItemId(t),
        keywords: i,
        _searchText: `${n} ${i.join(" ")}`.trim().toLowerCase(),
        _order: t._order ?? this.items.length
      };
    },
    /**
     * Registers multiple items while avoiding duplicates.
     * @param {Array<object>} items Items to register.
     * @param {{ suppressFilter?: boolean }} options Registration options.
     * @returns {void}
     */
    registerItems(t, n = {}) {
      const i = n.suppressFilter === !0;
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
      r > 0 && this.selectedIndex === -1 && (this.selectedIndex = 0), !i && !this.serverFiltering && this.filterAndSortItems();
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
      this.itemsById.has(t) && (this.itemsById.delete(t), this.items = this.items.filter((n) => n.id !== t), this.filterAndSortItems());
    },
    /**
     * Registers a group heading template.
     * @param {string} name The group name.
     * @param {DocumentFragment} templateContent The template content.
     * @param {string} headingId The heading identifier.
     * @returns {void}
     */
    registerGroupTemplate(t, n, i) {
      !t || !n || this.groupTemplates.has(t) || this.groupTemplates.set(t, {
        headingId: i,
        templateContent: n
      });
    },
    /**
     * Rebuilds the map of filtered indexes by item id.
     * @returns {void}
     */
    updateFilteredIndexes() {
      const t = /* @__PURE__ */ new Map();
      for (let n = 0; n < this.filteredItems.length; n++)
        t.set(this.filteredItems[n].id, n);
      this.filteredIndexById = t;
    },
    /**
     * Computes a simple ranking score for fast filtering.
     * @param {string} searchText Normalized searchable text.
     * @param {string} searchTerm Normalized search term.
     * @returns {number} Ranking score.
     */
    fastScore(t, n) {
      if (!n)
        return 1;
      const i = t.indexOf(n);
      return i === -1 ? 0 : i === 0 ? 4 : t.includes(` ${n}`) ? 3 : 2;
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
      const t = (this.search || "").trim().toLowerCase(), i = t && this._lastSearch && t.startsWith(this._lastSearch) ? this._lastMatchedItems : this.items;
      let r = [];
      if (!this.shouldFilter || !t)
        r = this.items.slice();
      else {
        const a = [];
        for (const l of i) {
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
          const n = new URL(this.itemsUrl, window.location.origin);
          this.serverFiltering && t && n.searchParams.append("q", t);
          const i = await fetch(n);
          if (!i.ok)
            throw new Error(`Network response was not ok: ${i.statusText}`);
          const r = await i.json();
          this.serverFiltering && (this.items = this.items.filter((o) => !o.isDataItem), this.itemsById = new Map(this.items.map((o) => [o.id, o])));
          const s = r.map((o) => ({
            ...o,
            id: this.resolveStableItemId(o),
            isDataItem: !0
          }));
          this.registerItems(s, { suppressFilter: !0 }), this._dataFetched = !0;
        } catch (n) {
          this.error = n.message || "Failed to fetch command items.", console.error("RzCommand:", this.error);
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
      const n = t.target.closest("[data-command-item-id]");
      if (!n) return;
      const i = n.dataset.commandItemId, r = this.filteredIndexById.get(i) ?? -1;
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
      const n = t.target.closest("[data-command-item-id]");
      if (!n) return;
      const i = n.dataset.commandItemId, r = this.filteredIndexById.get(i) ?? -1;
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
          const n = this.filteredItems[this.selectedIndex];
          n && !n.disabled && this.$dispatch("rz:command:execute", { value: n.value });
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
      let t = this.selectedIndex, n = 0;
      do {
        if (t = t + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : t + 1, n++, !this.filteredItems[t]?.disabled) {
          this.selectedIndex = t;
          return;
        }
        if (!this.loop && t === this.filteredItems.length - 1) return;
      } while (n <= this.filteredItems.length);
    },
    /**
     * Selects the previous enabled item.
     * @returns {void}
     */
    selectPrev() {
      if (this.filteredItems.length === 0) return;
      let t = this.selectedIndex, n = 0;
      do {
        if (t = t - 1 < 0 ? this.loop ? this.filteredItems.length - 1 : 0 : t - 1, n++, !this.filteredItems[t]?.disabled) {
          this.selectedIndex = t;
          return;
        }
        if (!this.loop && t === 0) return;
      } while (n <= this.filteredItems.length);
    },
    /**
     * Selects the first enabled item.
     * @returns {void}
     */
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.findIndex((n) => !n.disabled);
        t > -1 && (this.selectedIndex = t);
      }
    },
    /**
     * Selects the last enabled item.
     * @returns {void}
     */
    selectLast() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.map((n) => n.disabled).lastIndexOf(!1);
        t > -1 && (this.selectedIndex = t);
      }
    }
  }));
}
function Rc(e) {
  e.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    /**
     * Computes a deterministic hash for fallback item ids.
     * @param {string} value The value to hash.
     * @returns {string} A hash string.
     */
    hashString(t) {
      let n = 0;
      for (let i = 0; i < t.length; i++)
        n = (n << 5) - n + t.charCodeAt(i), n |= 0;
      return String(n >>> 0);
    },
    /**
     * Resolves a stable identifier for the item.
     * @param {string} value The item value.
     * @param {string} name The item display name.
     * @returns {string} The stable identifier.
     */
    resolveItemId(t, n) {
      return this.$el.id ? this.$el.id : t || `item-${this.hashString(n || this.$el.textContent.trim())}`;
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
      const n = this.$el.querySelector("template"), i = n?.content ? n.content.cloneNode(!0) : null, r = this.$el.dataset.value || this.$el.textContent.trim(), s = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
      this.itemData = {
        id: this.resolveItemId(r, s),
        value: r,
        name: s,
        keywords: JSON.parse(this.$el.dataset.keywords || "[]"),
        group: this.$el.dataset.group || null,
        templateContent: i,
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
function Mc(e) {
  e.data("rzCommandList", () => ({
    parent: null,
    dataItemTemplate: null,
    rowCache: /* @__PURE__ */ new Map(),
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
      this.parent = e.$data(t), this.parent.dataItemTemplateId && (this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId)), this.parent.setListInstance(this);
    },
    /**
     * Returns a cached row for an item, creating one from a template when needed.
     * @param {object} item The command item.
     * @returns {Element|null} The row element or null when unavailable.
     */
    ensureRow(t) {
      if (this.rowCache.has(t.id))
        return this.rowCache.get(t.id);
      let n = null;
      if (t.isDataItem) {
        if (!this.dataItemTemplate || !this.dataItemTemplate.content)
          return null;
        n = this.dataItemTemplate.content.cloneNode(!0).firstElementChild, n && (e.addScopeToNode(n, { item: t }), e.initTree(n));
      } else t.templateContent && (n = t.templateContent.cloneNode(!0).firstElementChild);
      return n ? (this.rowCache.set(t.id, n), n) : null;
    },
    /**
     * Applies ARIA/data attributes to a rendered row.
     * @param {Element} itemEl The row element.
     * @param {object} item The command item.
     * @param {number} itemIndex The filtered index of the item.
     * @returns {void}
     */
    applyItemAttributes(t, n, i) {
      t.setAttribute("data-command-item-id", n.id), t.setAttribute("data-value", n.value || ""), n.keywords && t.setAttribute("data-keywords", JSON.stringify(n.keywords)), n.group && t.setAttribute("data-group", n.group), n.disabled ? (t.setAttribute("data-disabled", "true"), t.setAttribute("aria-disabled", "true")) : (t.removeAttribute("data-disabled"), t.removeAttribute("aria-disabled")), n.forceMount && t.setAttribute("data-force-mount", "true"), t.setAttribute("role", "option"), t.setAttribute("aria-selected", this.parent.selectedIndex === i ? "true" : "false"), this.parent.selectedIndex === i ? t.setAttribute("data-selected", "true") : t.removeAttribute("data-selected");
    },
    /**
     * Renders grouped command rows using cached row elements.
     * @returns {void}
     */
    renderList() {
      const t = this.parent.filteredItems || [], n = this.parent.groupTemplates || /* @__PURE__ */ new Map(), i = this.$el, r = document.createDocumentFragment(), s = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      for (const o of t) {
        const a = o.group || "__ungrouped__";
        s.has(a) || s.set(a, []), s.get(a).push(o);
      }
      s.forEach((o, a) => {
        if (o.length === 0)
          return;
        const l = document.createElement("div");
        if (l.setAttribute("role", "group"), l.setAttribute("data-dynamic-item", "true"), l.setAttribute("data-slot", "command-group"), a !== "__ungrouped__") {
          const c = n.get(a);
          if (c?.templateContent) {
            const u = c.templateContent.cloneNode(!0);
            c.headingId && l.setAttribute("aria-labelledby", c.headingId), l.appendChild(u);
          }
        }
        o.forEach((c, u) => {
          const d = this.parent.filteredIndexById.get(c.id) ?? u, f = this.ensureRow(c);
          f && (this.applyItemAttributes(f, c, d), l.appendChild(f));
        }), r.appendChild(l);
      }), i.querySelectorAll("[data-dynamic-item]").forEach((o) => o.remove()), i.appendChild(r), window.htmx && window.htmx.process(i);
    }
  }));
}
function Pc(e) {
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
      const n = this.$el.querySelector("template"), i = n?.dataset.headingId || "", r = n?.content ? n.content.cloneNode(!0) : null;
      this.heading && r && this.parent.registerGroupTemplate(this.heading, r, i);
    }
  }));
}
async function zc(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ct(e, t, n) {
  let i, r;
  typeof t == "function" ? i = { success: t } : t && typeof t == "object" ? i = t : typeof t == "string" && (r = t), !r && typeof n == "string" && (r = n);
  const s = Array.isArray(e) ? e : [e];
  return zc(s).then((o) => (it.isDefined(o) || it(s, o, {
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
function Fc(e) {
  _l(e), El(e), Il(e), Sl(e), Tl(e), Cl(e, ct), $l(e), Al(e, ct), Ol(e, ct), Dl(e), kl(e, ct), Nl(e, ct), Ll(e), hc(e), pc(e), mc(e), gc(e), bc(e), vc(e), yc(e), wc(e), xc(e, ct), _c(e), Ec(e), Ic(e), Sc(e), Tc(e), Cc(e), $c(e), Ac(e), Oc(e), Dc(e), kc(e), Nc(e), Lc(e), Rc(e), Mc(e), Pc(e);
}
function Bc(e) {
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
const fe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map();
let xi = !1;
function Vc(e) {
  return he.has(e) || he.set(
    e,
    import(e).catch((t) => {
      throw he.delete(e), t;
    })
  ), he.get(e);
}
function _i(e, t) {
  const n = globalThis.Alpine;
  return n && typeof n.asyncData == "function" ? (n.asyncData(
    e,
    () => Vc(t).catch((i) => (console.error(
      `[RizzyUI] Failed to load Alpine module '${e}' from '${t}'.`,
      i
    ), () => ({
      _error: !0,
      _errorMessage: `Module '${e}' failed to load.`
    })))
  ), !0) : (console.error(
    `[RizzyUI] Could not register async component '${e}'. AsyncAlpine not available.`
  ), !1);
}
function Hc(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const n = fe.get(e);
  n && n.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${n.path}
  New:      ${t}`
  );
  const i = globalThis.Alpine;
  if (i && i.version) {
    const r = !n || n.path !== t;
    if (!(n && n.loaderSet && !r)) {
      const o = _i(e, t);
      fe.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  fe.set(e, { path: t, loaderSet: !1 }), xi || (xi = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of fe)
        if (!s.loaderSet) {
          const o = _i(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function qc(e) {
  e.directive("mobile", (t, { modifiers: n, expression: i }, { cleanup: r }) => {
    const s = n.find((g) => g.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(i && i.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (g) => {
      t.dataset.mobile = g ? "true" : "false", t.dataset.screen = g ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (g) => {
      if (!a) return;
      const h = u();
      h && (h[i] = g);
    }, f = (g) => {
      t.dispatchEvent(
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
    const x = () => w(), p = () => w();
    m.addEventListener("change", x), window.addEventListener("resize", p, { passive: !0 }), r(() => {
      m.removeEventListener("change", x), window.removeEventListener("resize", p);
    });
  });
}
function Wc(e) {
  const t = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (x, p, g) => {
      const y = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = y.pop();
      let _ = x;
      for (const b of y)
        (_[b] == null || typeof _[b] != "object") && (_[b] = isFinite(+b) ? [] : {}), _ = _[b];
      _[E] = g;
    }, l = e.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = i.split(",").map((x) => x.trim()).filter(Boolean).map((x) => {
      const p = x.split("->").map((g) => g.trim());
      return p.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', x), null) : { parentPath: p[0], childPath: p[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), m = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), w = [];
    d.forEach((x, p) => {
      const g = m[p];
      if (f) {
        const E = e.evaluate(n, x.childPath, { scope: c });
        g.fromChild = !0, a(u, x.parentPath, E), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const E = e.evaluate(n, x.parentPath, { scope: u });
        g.fromParent = !0, a(c, x.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = e.evaluate(n, x.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, x.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), y = o(() => {
        const E = e.evaluate(n, x.childPath, { scope: c });
        if (!g.fromParent) {
          if (g.skipChildOnce) {
            g.skipChildOnce = !1;
            return;
          }
          g.fromChild = !0, a(u, x.parentPath, E), queueMicrotask(() => {
            g.fromChild = !1;
          });
        }
      });
      w.push(h, y);
    }), s(() => {
      for (const x of w)
        try {
          x && x();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class jc {
  constructor() {
    this.storageKey = "darkMode", this.eventName = "rz:theme-change", this.darkClass = "dark", this._mode = "auto", this._mq = null, this._initialized = !1, this._onMqChange = null, this._onStorage = null, this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
  }
  init() {
    if (this._initialized || typeof window > "u") return;
    this._initialized = !0, this._mq = typeof window.matchMedia == "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const t = this._safeReadStorage(this.storageKey);
    this._mode = this._normalizeMode(t ?? "auto"), this._sync(), this._onMqChange = () => {
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
    const t = this.effectiveDark, n = this._mode, i = this.prefersDark, r = typeof document < "u" ? document.documentElement : null, s = r ? r.classList.contains(this.darkClass) === t && r.style.colorScheme === (t ? "dark" : "light") : !0;
    this._lastSnapshot.mode === n && this._lastSnapshot.effectiveDark === t && this._lastSnapshot.prefersDark === i && s || (this._lastSnapshot = { mode: n, effectiveDark: t, prefersDark: i }, r && (r.classList.toggle(this.darkClass, t), r.style.colorScheme = t ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(this.eventName, {
        detail: {
          mode: n,
          darkMode: t,
          // External API uses 'darkMode' convention
          prefersDark: i,
          source: "RizzyUI"
        }
      })
    ));
  }
}
const z = new jc();
function Uc(e) {
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
function Yc(e) {
  return Wt || (e.plugin(_a), e.plugin(Ca), e.plugin(Ka), e.plugin(il), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Uc(e);
  }), Fc(e), qc(e), Wc(e), Wt = {
    Alpine: e,
    require: ct,
    toast: gl,
    $data: wl,
    props: Bc,
    registerAsyncComponent: Hc,
    theme: z
  }, typeof window < "u" && (z.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...Wt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Wt);
}
const Xc = Yc(Lr);
Lr.start();
export {
  Xc as default
};
