var jt = !1, Wt = !1, de = [], Vt = -1;
function ls(e) {
  cs(e);
}
function cs(e) {
  de.includes(e) || de.push(e), ds();
}
function us(e) {
  let t = de.indexOf(e);
  t !== -1 && t > Vt && de.splice(t, 1);
}
function ds() {
  !Wt && !jt && (jt = !0, queueMicrotask(fs));
}
function fs() {
  jt = !1, Wt = !0;
  for (let e = 0; e < de.length; e++)
    de[e](), Vt = e;
  de.length = 0, Vt = -1, Wt = !1;
}
var Oe, we, Te, bi, Ht = !0;
function hs(e) {
  Ht = !1, e(), Ht = !0;
}
function ps(e) {
  Oe = e.reactive, Te = e.release, we = (t) => e.effect(t, { scheduler: (n) => {
    Ht ? ls(n) : n();
  } }), bi = e.raw;
}
function Dn(e) {
  we = e;
}
function ms(e) {
  let t = () => {
  };
  return [(i) => {
    let r = we(i);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Te(r));
    }, r;
  }, () => {
    t();
  }];
}
function yi(e, t) {
  let n = !0, i, r = we(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => Te(r);
}
var wi = [], xi = [], _i = [];
function gs(e) {
  _i.push(e);
}
function hn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, xi.push(t));
}
function Ei(e) {
  wi.push(e);
}
function Ii(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Oi(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((r) => r()), delete e._x_attributeCleanups[n]);
  });
}
function vs(e) {
  for (e._x_effects?.forEach(us); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var pn = new MutationObserver(bn), mn = !1;
function gn() {
  pn.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), mn = !0;
}
function Ti() {
  bs(), pn.disconnect(), mn = !1;
}
var $e = [];
function bs() {
  let e = pn.takeRecords();
  $e.push(() => e.length > 0 && bn(e));
  let t = $e.length;
  queueMicrotask(() => {
    if ($e.length === t)
      for (; $e.length > 0; )
        $e.shift()();
  });
}
function A(e) {
  if (!mn)
    return e();
  Ti();
  let t = e();
  return gn(), t;
}
var vn = !1, lt = [];
function ys() {
  vn = !0;
}
function ws() {
  vn = !1, bn(lt), lt = [];
}
function bn(e) {
  if (vn) {
    lt = lt.concat(e);
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
    wi.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || xi.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && _i.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function Si(e) {
  return Se(ge(e));
}
function Ke(e, t, n) {
  return e._x_dataStack = [t, ...ge(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function ge(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? ge(e.host) : e.parentNode ? ge(e.parentNode) : [];
}
function Se(e) {
  return new Proxy({ objects: e }, xs);
}
var xs = {
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
    return t == "toJSON" ? _s : Reflect.get(
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
function _s() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function Ci(e) {
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
function Ai(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return e(this.initialValue, () => Es(i, r), (o) => qt(i, r, o), r, s);
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
function Es(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function qt(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), qt(e[t[0]], t.slice(1), n);
  }
}
var Ni = {};
function V(e, t) {
  Ni[e] = t;
}
function ct(e, t) {
  let n = Is(t);
  return Object.entries(Ni).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Is(e) {
  let [t, n] = Di(e), i = { interceptor: Ai, ...t };
  return hn(e, n), i;
}
function ki(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    Ve(r, e, t);
  }
}
function Ve(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Be = !0;
function $i(e) {
  let t = Be;
  Be = !1;
  let n = e();
  return Be = t, n;
}
function fe(e, t, n = {}) {
  let i;
  return R(e, t)((r) => i = r, n), i;
}
function R(...e) {
  return Ri(...e);
}
var Ri = Ts;
function Os(e) {
  Ri = e;
}
function Ts(e, t) {
  let n = {};
  ct(n, e);
  let i = [n, ...ge(e)], r = typeof t == "function" ? Li(i, t) : Cs(i, t, e);
  return ki.bind(null, e, t, r);
}
function Li(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [], context: s } = {}) => {
    let o = t.apply(Se([i, ...e]), r);
    ut(n, o);
  };
}
var Pt = {};
function Ss(e, t) {
  if (Pt[e])
    return Pt[e];
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
      return Ve(o, t, e), Promise.resolve();
    }
  })();
  return Pt[e] = s, s;
}
function Cs(e, t, n) {
  let i = Ss(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    i.result = void 0, i.finished = !1;
    let l = Se([s, ...e]);
    if (typeof i == "function") {
      let c = i.call(a, i, l).catch((u) => Ve(u, n, t));
      i.finished ? (ut(r, i.result, l, o, n), i.result = void 0) : c.then((u) => {
        ut(r, u, l, o, n);
      }).catch((u) => Ve(u, n, t)).finally(() => i.result = void 0);
    }
  };
}
function ut(e, t, n, i, r) {
  if (Be && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => ut(e, o, n, i)).catch((o) => Ve(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var yn = "x-";
function Ce(e = "") {
  return yn + e;
}
function As(e) {
  yn = e;
}
var dt = {};
function k(e, t) {
  return dt[e] = t, {
    before(n) {
      if (!dt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = ue.indexOf(n);
      ue.splice(i >= 0 ? i : ue.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Ns(e) {
  return Object.keys(dt).includes(e);
}
function wn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Pi(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Ui((s, o) => i[s] = o)).filter(ji).map(Rs(i, n)).sort(Ls).map((s) => $s(e, s));
}
function Pi(e) {
  return Array.from(e).map(Ui()).filter((t) => !ji(t));
}
var Yt = !1, ze = /* @__PURE__ */ new Map(), Mi = Symbol();
function ks(e) {
  Yt = !0;
  let t = Symbol();
  Mi = t, ze.set(t, []);
  let n = () => {
    for (; ze.get(t).length; )
      ze.get(t).shift()();
    ze.delete(t);
  }, i = () => {
    Yt = !1, n();
  };
  e(n), i();
}
function Di(e) {
  let t = [], n = (a) => t.push(a), [i, r] = ms(e);
  return t.push(r), [{
    Alpine: Je,
    effect: i,
    cleanup: n,
    evaluateLater: R.bind(R, e),
    evaluate: fe.bind(fe, e)
  }, () => t.forEach((a) => a())];
}
function $s(e, t) {
  let n = () => {
  }, i = dt[t.type] || n, [r, s] = Di(e);
  Ii(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Yt ? ze.get(Mi).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Fi = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), zi = (e) => e;
function Ui(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: r } = Bi.reduce((s, o) => o(s), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: r };
  };
}
var Bi = [];
function xn(e) {
  Bi.push(e);
}
function ji({ name: e }) {
  return Wi().test(e);
}
var Wi = () => new RegExp(`^${yn}([^:^.]+)\\b`);
function Rs(e, t) {
  return ({ name: n, value: i }) => {
    let r = n.match(Wi()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: i,
      original: a
    };
  };
}
var Kt = "DEFAULT", ue = [
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
  Kt,
  "teleport"
];
function Ls(e, t) {
  let n = ue.indexOf(e.type) === -1 ? Kt : e.type, i = ue.indexOf(t.type) === -1 ? Kt : t.type;
  return ue.indexOf(n) - ue.indexOf(i);
}
function je(e, t, n = {}) {
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
function ve(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((r) => ve(r, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    ve(i, t), i = i.nextElementSibling;
}
function z(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Fn = !1;
function Ps() {
  Fn && z("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Fn = !0, document.body || z("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), je(document, "alpine:init"), je(document, "alpine:initializing"), gn(), gs((t) => G(t, ve)), hn((t) => Ne(t)), Ei((t, n) => {
    wn(t, n).forEach((i) => i());
  });
  let e = (t) => !Et(t.parentElement, !0);
  Array.from(document.querySelectorAll(qi().join(","))).filter(e).forEach((t) => {
    G(t);
  }), je(document, "alpine:initialized"), setTimeout(() => {
    zs();
  });
}
var _n = [], Vi = [];
function Hi() {
  return _n.map((e) => e());
}
function qi() {
  return _n.concat(Vi).map((e) => e());
}
function Yi(e) {
  _n.push(e);
}
function Ki(e) {
  Vi.push(e);
}
function Et(e, t = !1) {
  return Ae(e, (n) => {
    if ((t ? qi() : Hi()).some((r) => n.matches(r)))
      return !0;
  });
}
function Ae(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return Ae(e.parentElement, t);
  }
}
function Ms(e) {
  return Hi().some((t) => e.matches(t));
}
var Ji = [];
function Ds(e) {
  Ji.push(e);
}
var Fs = 1;
function G(e, t = ve, n = () => {
}) {
  Ae(e, (i) => i._x_ignore) || ks(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Ji.forEach((s) => s(i, r)), wn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Fs++), i._x_ignore && r());
    });
  });
}
function Ne(e, t = ve) {
  t(e, (n) => {
    vs(n), Oi(n), delete n._x_marker;
  });
}
function zs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    Ns(n) || i.some((r) => {
      if (document.querySelector(r))
        return z(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Jt = [], En = !1;
function In(e = () => {
}) {
  return queueMicrotask(() => {
    En || setTimeout(() => {
      Zt();
    });
  }), new Promise((t) => {
    Jt.push(() => {
      e(), t();
    });
  });
}
function Zt() {
  for (En = !1; Jt.length; )
    Jt.shift()();
}
function Us() {
  En = !0;
}
function On(e, t) {
  return Array.isArray(t) ? zn(e, t.join(" ")) : typeof t == "object" && t !== null ? Bs(e, t) : typeof t == "function" ? On(e, t()) : zn(e, t);
}
function zn(e, t) {
  let n = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function Bs(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(t).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function It(e, t) {
  return typeof t == "object" && t !== null ? js(e, t) : Ws(e, t);
}
function js(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = Vs(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    It(e, n);
  };
}
function Ws(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Vs(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Gt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
k("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? qs(e, n, t) : Hs(e, i, t));
});
function Hs(e, t, n) {
  Zi(e, On, ""), {
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
function qs(e, t, n) {
  Zi(e, It);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((b, h) => h < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((b, h) => h > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? Re(t, "scale", 95) / 100 : 1, d = Re(t, "delay", 0) / 1e3, f = Re(t, "origin", "center"), y = "opacity, transform", p = Re(t, "duration", 150) / 1e3, v = Re(t, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: y,
    transitionDuration: `${p}s`,
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
    transitionProperty: y,
    transitionDuration: `${v}s`,
    transitionTimingFunction: m
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function Zi(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      Xt(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      Xt(e, t, {
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
    let o = Gi(e);
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
function Gi(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Gi(t);
}
function Xt(e, t, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Ys(e, {
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
function Ys(e, t) {
  let n, i, r, s = Gt(() => {
    A(() => {
      n = !0, i || t.before(), r || (t.end(), Zt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Gt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, A(() => {
    t.start(), t.during();
  }), Us(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), A(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (A(() => {
        t.end();
      }), Zt(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Re(e, t, n) {
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
var re = !1;
function ae(e, t = () => {
}) {
  return (...n) => re ? t(...n) : e(...n);
}
function Ks(e) {
  return (...t) => re && e(...t);
}
var Xi = [];
function Ot(e) {
  Xi.push(e);
}
function Js(e, t) {
  Xi.forEach((n) => n(e, t)), re = !0, Qi(() => {
    G(t, (n, i) => {
      i(n, () => {
      });
    });
  }), re = !1;
}
var Qt = !1;
function Zs(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), re = !0, Qt = !0, Qi(() => {
    Gs(t);
  }), re = !1, Qt = !1;
}
function Gs(e) {
  let t = !1;
  G(e, (i, r) => {
    ve(i, (s, o) => {
      if (t && Ms(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function Qi(e) {
  let t = we;
  Dn((n, i) => {
    let r = t(n);
    return Te(r), () => {
    };
  }), e(), Dn(t);
}
function er(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Oe({})), e._x_bindings[t] = n, t = i.includes("camel") ? so(t) : t, t) {
    case "value":
      Xs(e, n);
      break;
    case "style":
      eo(e, n);
      break;
    case "class":
      Qs(e, n);
      break;
    case "selected":
    case "checked":
      to(e, t, n);
      break;
    default:
      tr(e, t, n);
      break;
  }
}
function Xs(e, t) {
  if (rr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = ot(e.value) === t : e.checked = Un(e.value, t));
  else if (Tn(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Un(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    ro(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Qs(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = On(e, t);
}
function eo(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = It(e, t);
}
function to(e, t, n) {
  tr(e, t, n), io(e, t, n);
}
function tr(e, t, n) {
  [null, void 0, !1].includes(n) && ao(t) ? e.removeAttribute(t) : (nr(t) && (n = t), no(e, t, n));
}
function no(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function io(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function ro(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function so(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Un(e, t) {
  return e == t;
}
function ot(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var oo = /* @__PURE__ */ new Set([
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
  return oo.has(e);
}
function ao(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function lo(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ir(e, t, n);
}
function co(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, $i(() => fe(e, r.expression));
  }
  return ir(e, t, n);
}
function ir(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : nr(t) ? !![t, "true"].includes(i) : i;
}
function Tn(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function rr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function sr(e, t) {
  let n;
  return function() {
    const i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function or(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function ar({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = we(() => {
    let a = e(), l = n();
    if (r)
      i(Mt(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(Mt(a)) : c !== u && t(Mt(l));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Te(o);
  };
}
function Mt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function uo(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Je));
}
var ce = {}, Bn = !1;
function fo(e, t) {
  if (Bn || (ce = Oe(ce), Bn = !0), t === void 0)
    return ce[e];
  ce[e] = t, Ci(ce[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ce[e].init();
}
function ho() {
  return ce;
}
var lr = {};
function po(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? cr(e, n()) : (lr[e] = n, () => {
  });
}
function mo(e) {
  return Object.entries(lr).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function cr(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Pi(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), wn(e, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var ur = {};
function go(e, t) {
  ur[e] = t;
}
function vo(e, t) {
  return Object.entries(ur).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...r) => i.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var bo = {
  get reactive() {
    return Oe;
  },
  get release() {
    return Te;
  },
  get effect() {
    return we;
  },
  get raw() {
    return bi;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: ws,
  dontAutoEvaluateFunctions: $i,
  disableEffectScheduling: hs,
  startObservingMutations: gn,
  stopObservingMutations: Ti,
  setReactivityEngine: ps,
  onAttributeRemoved: Ii,
  onAttributesAdded: Ei,
  closestDataStack: ge,
  skipDuringClone: ae,
  onlyDuringClone: Ks,
  addRootSelector: Yi,
  addInitSelector: Ki,
  interceptClone: Ot,
  addScopeToNode: Ke,
  deferMutations: ys,
  mapAttributes: xn,
  evaluateLater: R,
  interceptInit: Ds,
  setEvaluator: Os,
  mergeProxies: Se,
  extractProp: co,
  findClosest: Ae,
  onElRemoved: hn,
  closestRoot: Et,
  destroyTree: Ne,
  interceptor: Ai,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Xt,
  // INTERNAL
  setStyles: It,
  // INTERNAL
  mutateDom: A,
  directive: k,
  entangle: ar,
  throttle: or,
  debounce: sr,
  evaluate: fe,
  initTree: G,
  nextTick: In,
  prefixed: Ce,
  prefix: As,
  plugin: uo,
  magic: V,
  store: fo,
  start: Ps,
  clone: Zs,
  // INTERNAL
  cloneNode: Js,
  // INTERNAL
  bound: lo,
  $data: Si,
  watch: yi,
  walk: ve,
  data: go,
  bind: po
}, Je = bo, $ = class {
  constructor(e, t, n, i) {
    this.type = e, this.value = t, this.start = n, this.end = i;
  }
}, yo = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new $("EOF", null, this.position, this.position)), this.tokens;
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
      const i = this.input[this.position];
      if (this.isDigit(i))
        this.position++;
      else if (i === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const n = this.input.slice(e, this.position);
    this.tokens.push(new $("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new $("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new $("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new $("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new $("KEYWORD", t, e, this.position)) : this.tokens.push(new $("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let n = "", i = !1;
    for (; this.position < this.input.length; ) {
      const r = this.input[this.position];
      if (i) {
        switch (r) {
          case "n":
            n += `
`;
            break;
          case "t":
            n += "	";
            break;
          case "r":
            n += "\r";
            break;
          case "\\":
            n += "\\";
            break;
          case t:
            n += t;
            break;
          default:
            n += r;
        }
        i = !1;
      } else if (r === "\\")
        i = !0;
      else if (r === t) {
        this.position++, this.tokens.push(new $("STRING", n, e, this.position));
        return;
      } else
        n += r;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], n = this.peek(), i = this.peek(2);
    if (t === "=" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new $("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new $("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new $("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new $("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new $("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new $("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new $("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new $("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new $("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new $("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const r = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new $(r, t, e, this.position));
    }
  }
}, wo = class {
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
      const n = this.parseExpression();
      return {
        type: "ConditionalExpression",
        test: e,
        consequent: t,
        alternate: n
      };
    }
    return e;
  }
  parseLogicalOr() {
    let e = this.parseLogicalAnd();
    for (; this.match("OPERATOR", "||"); ) {
      const t = this.previous().value, n = this.parseLogicalAnd();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseLogicalAnd() {
    let e = this.parseEquality();
    for (; this.match("OPERATOR", "&&"); ) {
      const t = this.previous().value, n = this.parseEquality();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseEquality() {
    let e = this.parseRelational();
    for (; this.match("OPERATOR", "==", "!=", "===", "!=="); ) {
      const t = this.previous().value, n = this.parseRelational();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseRelational() {
    let e = this.parseAdditive();
    for (; this.match("OPERATOR", "<", ">", "<=", ">="); ) {
      const t = this.previous().value, n = this.parseAdditive();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseAdditive() {
    let e = this.parseMultiplicative();
    for (; this.match("OPERATOR", "+", "-"); ) {
      const t = this.previous().value, n = this.parseMultiplicative();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseMultiplicative() {
    let e = this.parseUnary();
    for (; this.match("OPERATOR", "*", "/", "%"); ) {
      const t = this.previous().value, n = this.parseUnary();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
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
      let t, n = !1;
      if (this.match("STRING"))
        t = { type: "Literal", value: this.previous().value };
      else if (this.match("IDENTIFIER"))
        t = { type: "Identifier", name: this.previous().value };
      else if (this.match("PUNCTUATION", "["))
        t = this.parseExpression(), n = !0, this.consume("PUNCTUATION", "]");
      else
        throw new Error("Expected property key");
      this.consume("PUNCTUATION", ":");
      const i = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: i,
        computed: n,
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
      const n = e[t];
      if (t === 0 && e.length > 1) {
        const i = n;
        for (let r = 1; r < e.length; r++)
          if (this.check(i, e[r]))
            return this.advance(), !0;
        return !1;
      } else if (e.length === 1)
        return this.checkType(n) ? (this.advance(), !0) : !1;
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
}, xo = class {
  evaluate({ node: e, scope: t = {}, context: n = null, allowGlobal: i = !1, forceBindingRootScopeToFunctions: r = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const p = t[e.name];
          return typeof p == "function" ? p.bind(t) : p;
        }
        if (i && typeof globalThis[e.name] < "u") {
          const p = globalThis[e.name];
          return typeof p == "function" ? p.bind(globalThis) : p;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: e.object, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let o;
        if (e.computed) {
          const p = this.evaluate({ node: e.property, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
          o = s[p];
        } else
          o = s[e.property.name];
        return typeof o == "function" ? r ? o.bind(t) : o.bind(s) : o;
      case "CallExpression":
        const a = e.arguments.map((p) => this.evaluate({ node: p, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }));
        if (e.callee.type === "MemberExpression") {
          const p = this.evaluate({ node: e.callee.object, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
          let v;
          if (e.callee.computed) {
            const m = this.evaluate({ node: e.callee.property, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
            v = p[m];
          } else
            v = p[e.callee.property.name];
          if (typeof v != "function")
            throw new Error("Value is not a function");
          return v.apply(p, a);
        } else if (e.callee.type === "Identifier") {
          const p = e.callee.name;
          let v;
          if (p in t)
            v = t[p];
          else if (i && typeof globalThis[p] < "u")
            v = globalThis[p];
          else
            throw new Error(`Undefined variable: ${p}`);
          if (typeof v != "function")
            throw new Error("Value is not a function");
          const m = n !== null ? n : t;
          return v.apply(m, a);
        } else {
          const p = this.evaluate({ node: e.callee, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
          if (typeof p != "function")
            throw new Error("Value is not a function");
          return p.apply(n, a);
        }
      case "UnaryExpression":
        const l = this.evaluate({ node: e.argument, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
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
          const p = e.argument.name;
          if (!(p in t))
            throw new Error(`Undefined variable: ${p}`);
          const v = t[p];
          return e.operator === "++" ? t[p] = v + 1 : e.operator === "--" && (t[p] = v - 1), e.prefix ? t[p] : v;
        } else if (e.argument.type === "MemberExpression") {
          const p = this.evaluate({ node: e.argument.object, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }), v = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }) : e.argument.property.name, m = p[v];
          return e.operator === "++" ? p[v] = m + 1 : e.operator === "--" && (p[v] = m - 1), e.prefix ? p[v] : m;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const c = this.evaluate({ node: e.left, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }), u = this.evaluate({ node: e.right, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
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
        return this.evaluate({ node: e.test, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }) ? this.evaluate({ node: e.consequent, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }) : this.evaluate({ node: e.alternate, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
      case "AssignmentExpression":
        const f = this.evaluate({ node: e.right, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
        if (e.left.type === "Identifier")
          return t[e.left.name] = f, f;
        if (e.left.type === "MemberExpression") {
          const p = this.evaluate({ node: e.left.object, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
          if (e.left.computed) {
            const v = this.evaluate({ node: e.left.property, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
            p[v] = f;
          } else
            p[e.left.property.name] = f;
          return f;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((p) => this.evaluate({ node: p, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }));
      case "ObjectExpression":
        const y = {};
        for (const p of e.properties) {
          const v = p.computed ? this.evaluate({ node: p.key, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }) : p.key.type === "Identifier" ? p.key.name : this.evaluate({ node: p.key, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r }), m = this.evaluate({ node: p.value, scope: t, context: n, allowGlobal: i, forceBindingRootScopeToFunctions: r });
          y[v] = m;
        }
        return y;
      default:
        throw new Error(`Unknown node type: ${e.type}`);
    }
  }
};
function _o(e) {
  try {
    const n = new yo(e).tokenize(), r = new wo(n).parse(), s = new xo();
    return function(o = {}) {
      const { scope: a = {}, context: l = null, allowGlobal: c = !1, forceBindingRootScopeToFunctions: u = !1 } = o;
      return s.evaluate({ node: r, scope: a, context: l, allowGlobal: c, forceBindingRootScopeToFunctions: u });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Eo(e, t) {
  let n = Io(e);
  if (typeof t == "function")
    return Li(n, t);
  let i = Oo(e, t, n);
  return ki.bind(null, e, t, i);
}
function Io(e) {
  let t = {};
  return ct(t, e), [t, ...ge(e)];
}
function Oo(e, t, n) {
  return (i = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Se([r, ...n]), l = _o(t)({
      scope: o,
      allowGlobal: !0,
      forceBindingRootScopeToFunctions: !0
    });
    if (Be && typeof l == "function") {
      let c = l.apply(l, s);
      c instanceof Promise ? c.then((u) => i(u)) : i(c);
    } else typeof l == "object" && l instanceof Promise ? l.then((c) => i(c)) : i(l);
  };
}
function To(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = e.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var So = Object.freeze({}), Co = Object.prototype.hasOwnProperty, Tt = (e, t) => Co.call(e, t), he = Array.isArray, We = (e) => dr(e) === "[object Map]", Ao = (e) => typeof e == "string", Sn = (e) => typeof e == "symbol", St = (e) => e !== null && typeof e == "object", No = Object.prototype.toString, dr = (e) => No.call(e), fr = (e) => dr(e).slice(8, -1), Cn = (e) => Ao(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ko = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, $o = ko((e) => e.charAt(0).toUpperCase() + e.slice(1)), hr = (e, t) => e !== t && (e === e || t === t), en = /* @__PURE__ */ new WeakMap(), Le = [], Y, pe = Symbol("iterate"), tn = Symbol("Map key iterate");
function Ro(e) {
  return e && e._isEffect === !0;
}
function Lo(e, t = So) {
  Ro(e) && (e = e.raw);
  const n = Do(e, t);
  return t.lazy || n(), n;
}
function Po(e) {
  e.active && (pr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var Mo = 0;
function Do(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Le.includes(n)) {
      pr(n);
      try {
        return zo(), Le.push(n), Y = n, e();
      } finally {
        Le.pop(), mr(), Y = Le[Le.length - 1];
      }
    }
  };
  return n.id = Mo++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function pr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var Ee = !0, An = [];
function Fo() {
  An.push(Ee), Ee = !1;
}
function zo() {
  An.push(Ee), Ee = !0;
}
function mr() {
  const e = An.pop();
  Ee = e === void 0 ? !0 : e;
}
function B(e, t, n) {
  if (!Ee || Y === void 0)
    return;
  let i = en.get(e);
  i || en.set(e, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(Y) || (r.add(Y), Y.deps.push(r), Y.options.onTrack && Y.options.onTrack({
    effect: Y,
    target: e,
    type: t,
    key: n
  }));
}
function se(e, t, n, i, r, s) {
  const o = en.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== Y || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (n === "length" && he(e))
    o.forEach((u, d) => {
      (d === "length" || d >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), t) {
      case "add":
        he(e) ? Cn(n) && l(o.get("length")) : (l(o.get(pe)), We(e) && l(o.get(tn)));
        break;
      case "delete":
        he(e) || (l(o.get(pe)), We(e) && l(o.get(tn)));
        break;
      case "set":
        We(e) && l(o.get(pe));
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
var Uo = /* @__PURE__ */ To("__proto__,__v_isRef,__isVue"), gr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Sn)), Bo = /* @__PURE__ */ vr(), jo = /* @__PURE__ */ vr(!0), jn = /* @__PURE__ */ Wo();
function Wo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const i = C(this);
      for (let s = 0, o = this.length; s < o; s++)
        B(i, "get", s + "");
      const r = i[t](...n);
      return r === -1 || r === !1 ? i[t](...n.map(C)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Fo();
      const i = C(this)[t].apply(this, n);
      return mr(), i;
    };
  }), e;
}
function vr(e = !1, t = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? ia : xr : t ? na : wr).get(i))
      return i;
    const o = he(i);
    if (!e && o && Tt(jn, r))
      return Reflect.get(jn, r, s);
    const a = Reflect.get(i, r, s);
    return (Sn(r) ? gr.has(r) : Uo(r)) || (e || B(i, "get", r), t) ? a : nn(a) ? !o || !Cn(r) ? a.value : a : St(a) ? e ? _r(a) : Rn(a) : a;
  };
}
var Vo = /* @__PURE__ */ Ho();
function Ho(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = C(r), o = C(o), !he(n) && nn(o) && !nn(r)))
      return o.value = r, !0;
    const a = he(n) && Cn(i) ? Number(i) < n.length : Tt(n, i), l = Reflect.set(n, i, r, s);
    return n === C(s) && (a ? hr(r, o) && se(n, "set", i, r, o) : se(n, "add", i, r)), l;
  };
}
function qo(e, t) {
  const n = Tt(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && se(e, "delete", t, void 0, i), r;
}
function Yo(e, t) {
  const n = Reflect.has(e, t);
  return (!Sn(t) || !gr.has(t)) && B(e, "has", t), n;
}
function Ko(e) {
  return B(e, "iterate", he(e) ? "length" : pe), Reflect.ownKeys(e);
}
var Jo = {
  get: Bo,
  set: Vo,
  deleteProperty: qo,
  has: Yo,
  ownKeys: Ko
}, Zo = {
  get: jo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Nn = (e) => St(e) ? Rn(e) : e, kn = (e) => St(e) ? _r(e) : e, $n = (e) => e, Ct = (e) => Reflect.getPrototypeOf(e);
function Ge(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = C(e), s = C(t);
  t !== s && !n && B(r, "get", t), !n && B(r, "get", s);
  const { has: o } = Ct(r), a = i ? $n : n ? kn : Nn;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function Xe(e, t = !1) {
  const n = this.__v_raw, i = C(n), r = C(e);
  return e !== r && !t && B(i, "has", e), !t && B(i, "has", r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Qe(e, t = !1) {
  return e = e.__v_raw, !t && B(C(e), "iterate", pe), Reflect.get(e, "size", e);
}
function Wn(e) {
  e = C(e);
  const t = C(this);
  return Ct(t).has.call(t, e) || (t.add(e), se(t, "add", e, e)), this;
}
function Vn(e, t) {
  t = C(t);
  const n = C(this), { has: i, get: r } = Ct(n);
  let s = i.call(n, e);
  s ? yr(n, i, e) : (e = C(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? hr(t, o) && se(n, "set", e, t, o) : se(n, "add", e, t), this;
}
function Hn(e) {
  const t = C(this), { has: n, get: i } = Ct(t);
  let r = n.call(t, e);
  r ? yr(t, n, e) : (e = C(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && se(t, "delete", e, void 0, s), o;
}
function qn() {
  const e = C(this), t = e.size !== 0, n = We(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && se(e, "clear", void 0, void 0, n), i;
}
function et(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = C(o), l = t ? $n : e ? kn : Nn;
    return !e && B(a, "iterate", pe), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function tt(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = C(r), o = We(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...i), u = n ? $n : t ? kn : Nn;
    return !t && B(s, "iterate", l ? tn : pe), {
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
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${$o(e)} operation ${n}failed: target is readonly.`, C(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Go() {
  const e = {
    get(s) {
      return Ge(this, s);
    },
    get size() {
      return Qe(this);
    },
    has: Xe,
    add: Wn,
    set: Vn,
    delete: Hn,
    clear: qn,
    forEach: et(!1, !1)
  }, t = {
    get(s) {
      return Ge(this, s, !1, !0);
    },
    get size() {
      return Qe(this);
    },
    has: Xe,
    add: Wn,
    set: Vn,
    delete: Hn,
    clear: qn,
    forEach: et(!1, !0)
  }, n = {
    get(s) {
      return Ge(this, s, !0);
    },
    get size() {
      return Qe(this, !0);
    },
    has(s) {
      return Xe.call(this, s, !0);
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
    forEach: et(!0, !1)
  }, i = {
    get(s) {
      return Ge(this, s, !0, !0);
    },
    get size() {
      return Qe(this, !0);
    },
    has(s) {
      return Xe.call(this, s, !0);
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
    forEach: et(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = tt(s, !1, !1), n[s] = tt(s, !0, !1), t[s] = tt(s, !1, !0), i[s] = tt(s, !0, !0);
  }), [
    e,
    n,
    t,
    i
  ];
}
var [Xo, Qo, Pc, Mc] = /* @__PURE__ */ Go();
function br(e, t) {
  const n = e ? Qo : Xo;
  return (i, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(Tt(n, r) && r in i ? n : i, r, s);
}
var ea = {
  get: /* @__PURE__ */ br(!1)
}, ta = {
  get: /* @__PURE__ */ br(!0)
};
function yr(e, t, n) {
  const i = C(n);
  if (i !== n && t.call(e, i)) {
    const r = fr(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var wr = /* @__PURE__ */ new WeakMap(), na = /* @__PURE__ */ new WeakMap(), xr = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap();
function ra(e) {
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
function sa(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ra(fr(e));
}
function Rn(e) {
  return e && e.__v_isReadonly ? e : Er(e, !1, Jo, ea, wr);
}
function _r(e) {
  return Er(e, !0, Zo, ta, xr);
}
function Er(e, t, n, i, r) {
  if (!St(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = sa(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? i : n);
  return r.set(e, a), a;
}
function C(e) {
  return e && C(e.__v_raw) || e;
}
function nn(e) {
  return !!(e && e.__v_isRef === !0);
}
V("nextTick", () => In);
V("dispatch", (e) => je.bind(je, e));
V("watch", (e, { evaluateLater: t, cleanup: n }) => (i, r) => {
  let s = t(i), a = yi(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
V("store", ho);
V("data", (e) => Si(e));
V("root", (e) => Et(e));
V("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Se(oa(e))), e._x_refs_proxy));
function oa(e) {
  let t = [];
  return Ae(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Dt = {};
function Ir(e) {
  return Dt[e] || (Dt[e] = 0), ++Dt[e];
}
function aa(e, t) {
  return Ae(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function la(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Ir(t));
}
V("id", (e, { cleanup: t }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return ca(e, r, t, () => {
    let s = aa(e, n), o = s ? s._x_ids[n] : Ir(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
Ot((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function ca(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = i();
  return e._x_id[t] = r, n(() => {
    delete e._x_id[t];
  }), r;
}
V("el", (e) => e);
Or("Focus", "focus", "focus");
Or("Persist", "persist", "persist");
function Or(e, t, n) {
  V(t, (i) => z(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
k("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(t), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = i(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, f = ar(
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
k("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && z("x-teleport can only be used on a <template> tag", e);
  let r = Yn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Ke(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  A(() => {
    o(s, r, t), ae(() => {
      G(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Yn(n);
    A(() => {
      o(e._x_teleport, a, t);
    });
  }, i(
    () => A(() => {
      s.remove(), Ne(s);
    })
  );
});
var ua = document.createElement("div");
function Yn(e) {
  let t = ae(() => document.querySelector(e), () => ua)();
  return t || z(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Tr = () => {
};
Tr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
k("ignore", Tr);
k("effect", ae((e, { expression: t }, { effect: n }) => {
  n(R(e, t));
}));
function rn(e, t, n, i) {
  let r = e, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (t = da(t)), n.includes("camel") && (t = fa(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = ft(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = sr(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = ft(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = or(s, c);
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
  })), (pa(t) || Sr(t)) && (s = a(s, (l, c) => {
    ma(c, n) || l(c);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function da(e) {
  return e.replace(/-/g, ".");
}
function fa(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function ft(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ha(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function pa(e) {
  return ["keydown", "keyup"].includes(e);
}
function Sr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function ma(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, ft((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, ft((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Kn(e.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (Sr(e.type) || Kn(e.key).includes(n[0])));
}
function Kn(e) {
  if (!e)
    return [];
  e = ha(e);
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
k("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = R(s, n), a;
  typeof n == "string" ? a = R(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = R(s, `${n()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((y) => f = y), Jn(f) ? f.get() : f;
  }, c = (f) => {
    let y;
    o((p) => y = p), Jn(y) ? y.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && e.type === "radio" && A(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = re ? () => {
  } : rn(e, u, t, (f) => {
    c(Ft(e, t, f, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Tn(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Ft(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let f = rn(e.form, "reset", [], (y) => {
      In(() => e._x_model && e._x_model.set(Ft(e, t, { target: e }, l())));
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
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, A(() => er(e, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Ft(e, t, n, i) {
  return A(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Tn(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = zt(n.target.value) : t.includes("boolean") ? r = ot(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ga(s, r));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return zt(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return ot(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return rr(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? zt(r) : t.includes("boolean") ? ot(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function zt(e) {
  let t = e ? parseFloat(e) : null;
  return va(t) ? t : e;
}
function ga(e, t) {
  return e == t;
}
function va(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Jn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
k("cloak", (e) => queueMicrotask(() => A(() => e.removeAttribute(Ce("cloak")))));
Ki(() => `[${Ce("init")}]`);
k("init", ae((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
k("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      A(() => {
        e.textContent = s;
      });
    });
  });
});
k("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      A(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, G(e), delete e._x_ignoreSelf;
      });
    });
  });
});
xn(Fi(":", zi(Ce("bind:"))));
var Cr = (e, { value: t, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    mo(l), R(e, i)((u) => {
      cr(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return ba(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = R(e, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), A(() => er(e, t, l, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Cr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
k("bind", Cr);
function ba(e, t) {
  e._x_keyExpression = t;
}
Yi(() => `[${Ce("data")}]`);
k("data", (e, { expression: t }, { cleanup: n }) => {
  if (ya(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  ct(i, e);
  let r = {};
  vo(r, i);
  let s = fe(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), ct(s, e);
  let o = Oe(s);
  Ci(o);
  let a = Ke(e, o);
  o.init && fe(e, o.init), n(() => {
    o.destroy && fe(e, o.destroy), a();
  });
});
Ot((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ya(e) {
  return re ? Qt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
k("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let r = R(e, n);
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
  }, a = () => setTimeout(o), l = Gt(
    (d) => d ? o() : s(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  i(() => r((d) => {
    !u && d === c || (t.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
k("for", (e, { expression: t }, { effect: n, cleanup: i }) => {
  let r = xa(t), s = R(e, r.items), o = R(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => wa(e, r, s, o)), i(() => {
    Object.values(e._x_lookup).forEach((a) => A(
      () => {
        Ne(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function wa(e, t, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    _a(o) && o >= 0 && (o = Array.from(Array(o).keys(), (m) => m + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([m, b]) => {
        let h = Zn(t, b, m, o);
        i((x) => {
          u.includes(x) && z("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: m, ...h } }), c.push(h);
      });
    else
      for (let m = 0; m < o.length; m++) {
        let b = Zn(t, o[m], m, o);
        i((h) => {
          u.includes(h) && z("Duplicate key on x-for", e), u.push(h);
        }, { scope: { index: m, ...b } }), c.push(b);
      }
    let d = [], f = [], y = [], p = [];
    for (let m = 0; m < l.length; m++) {
      let b = l[m];
      u.indexOf(b) === -1 && y.push(b);
    }
    l = l.filter((m) => !y.includes(m));
    let v = "template";
    for (let m = 0; m < u.length; m++) {
      let b = u[m], h = l.indexOf(b);
      if (h === -1)
        l.splice(m, 0, b), d.push([v, m]);
      else if (h !== m) {
        let x = l.splice(m, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(m, 0, E), l.splice(h, 0, x), f.push([x, E]);
      } else
        p.push(b);
      v = b;
    }
    for (let m = 0; m < y.length; m++) {
      let b = y[m];
      b in a && (A(() => {
        Ne(a[b]), a[b].remove();
      }), delete a[b]);
    }
    for (let m = 0; m < f.length; m++) {
      let [b, h] = f[m], x = a[b], E = a[h], _ = document.createElement("div");
      A(() => {
        E || z('x-for ":key" is undefined or invalid', s, h, a), E.after(_), x.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), _.before(x), x._x_currentIfEl && x.after(x._x_currentIfEl), _.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let m = 0; m < d.length; m++) {
      let [b, h] = d[m], x = b === "template" ? s : a[b];
      x._x_currentIfEl && (x = x._x_currentIfEl);
      let E = c[h], _ = u[h], g = document.importNode(s.content, !0).firstElementChild, w = Oe(E);
      Ke(g, w, s), g._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([T, O]) => {
          w[T] = O;
        });
      }, A(() => {
        x.after(g), ae(() => G(g))();
      }), typeof _ == "object" && z("x-for key cannot be an object, it must be a string or an integer", s), a[_] = g;
    }
    for (let m = 0; m < p.length; m++)
      a[p[m]]._x_refreshXForScope(c[u.indexOf(p[m])]);
    s._x_prevKeys = u;
  });
}
function xa(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Zn(e, t, n, i) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = n), e.collection && (r[e.collection] = i), r;
}
function _a(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ar() {
}
Ar.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = Et(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
k("ref", Ar);
k("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && z("x-if can only be used on a <template> tag", e);
  let r = R(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Ke(a, {}, e), A(() => {
      e.after(a), ae(() => G(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      A(() => {
        Ne(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => e._x_undoIf && e._x_undoIf());
});
k("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((r) => la(e, r));
});
Ot((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
xn(Fi("@", zi(Ce("on:"))));
k("on", ae((e, { value: t, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? R(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = rn(e, t, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
At("Collapse", "collapse", "collapse");
At("Intersect", "intersect", "intersect");
At("Focus", "trap", "focus");
At("Mask", "mask", "mask");
function At(e, t, n) {
  k(t, (i) => z(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Je.setEvaluator(Eo);
Je.setReactivityEngine({ reactive: Rn, effect: Lo, release: Po, raw: C });
var Ea = Je, Z = Ea;
function Ia() {
  return !0;
}
function Oa({ component: e, argument: t }) {
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
function Ta() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function Sa({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const n = window.matchMedia(`(${e})`);
    n.matches ? t() : n.addEventListener("change", t, { once: !0 });
  });
}
function Ca({ component: e, argument: t }) {
  return new Promise((n) => {
    const i = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), n());
    }, { rootMargin: i });
    r.observe(e.el);
  });
}
var Gn = {
  eager: Ia,
  event: Oa,
  idle: Ta,
  media: Sa,
  visible: Ca
};
async function Aa(e) {
  const t = Na(e.strategy);
  await sn(e, t);
}
async function sn(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((n) => sn(e, n))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((n) => sn(e, n))
      );
  }
  return Gn[t.method] ? Gn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function Na(e) {
  const t = ka(e);
  let n = Nr(t);
  return n.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [n]
  } : n;
}
function ka(e) {
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
function Nr(e) {
  let t = Xn(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const n = e.shift().value, i = Xn(e);
    t.type === "expression" && t.operator === n ? t.parameters.push(i) : t = {
      type: "expression",
      operator: n,
      parameters: [t, i]
    };
  }
  return t;
}
function Xn(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = Nr(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function $a(e) {
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
        b(x)
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
      const { name: x, strategy: E } = d(h);
      await Aa({
        name: x,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(x), h.isConnected && (p(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, e.directive(t, u).before("ignore");
  function d(h) {
    const x = m(h.getAttribute(e.prefixed("data"))), E = h.getAttribute(e.prefixed(t)) || r.defaultStrategy, _ = h.getAttribute(n);
    return _ && e.asyncUrl(x, _), {
      name: x,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (v(h), !o[h] || o[h].loaded)) return;
    const x = await y(h);
    e.data(h, x), o[h].loaded = !0;
  }
  async function y(h) {
    if (!o[h]) return;
    const x = await o[h].download(h);
    return typeof x == "function" ? x : x[h] || x.default || Object.values(x)[0] || !1;
  }
  function p(h) {
    e.destroyTree(h), h._x_ignore = !1, h.removeAttribute(i), !h.closest(`[${i}]`) && e.initTree(h);
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
  function m(h) {
    return (h || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function b(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function Ra(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: i }) {
    let r = Qn(i, "duration", 250) / 1e3, s = Qn(i, "min", 0), o = !i.includes("min");
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
function Qn(e, t, n) {
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
var La = Ra;
function Pa(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: Fa(r),
      threshold: Ma(r)
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
function Ma(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Da(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Fa(e) {
  const t = "margin", n = "0px 0px 0px 0px", i = e.indexOf(t);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Da(e[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var za = Pa, kr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ht = /* @__PURE__ */ kr.join(","), $r = typeof Element > "u", be = $r ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, on = !$r && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Rr = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(ht));
  return n && be.call(t, ht) && r.unshift(t), r = r.filter(i), r;
}, Lr = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = be.call(o, ht);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), f = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && f) {
        var y = e(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, y) : r.push({
          scope: o,
          candidates: y
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Pr = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Ua = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, Mr = function(t) {
  return t.tagName === "INPUT";
}, Ba = function(t) {
  return Mr(t) && t.type === "hidden";
}, ja = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, Wa = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, Va = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || on(t), i = function(a) {
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
  var s = Wa(r, t.form);
  return !s || s === t;
}, Ha = function(t) {
  return Mr(t) && t.type === "radio";
}, qa = function(t) {
  return Ha(t) && !Va(t);
}, ei = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Ya = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = be.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (be.call(o, "details:not([open]) *"))
    return !0;
  var a = on(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = on(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return ei(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return ei(t);
  return !1;
}, Ka = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return be.call(n, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, pt = function(t, n) {
  return !(n.disabled || Ba(n) || Ya(n, t) || // For a details element with a summary, the summary element gets the focus
  ja(n) || Ka(n));
}, an = function(t, n) {
  return !(qa(n) || Pr(n) < 0 || !pt(t, n));
}, Ja = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Za = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Pr(a, o), c = o ? e(r.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), i.sort(Ua).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, Ga = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Lr([t], n.includeContainer, {
    filter: an.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Ja
  }) : i = Rr(t, n.includeContainer, an.bind(null, n)), Za(i);
}, Dr = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Lr([t], n.includeContainer, {
    filter: pt.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Rr(t, n.includeContainer, pt.bind(null, n)), i;
}, nt = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return be.call(t, ht) === !1 ? !1 : an(n, t);
}, Xa = /* @__PURE__ */ kr.concat("iframe").join(","), at = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return be.call(t, Xa) === !1 ? !1 : pt(n, t);
};
function ti(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function ni(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ti(Object(n), !0).forEach(function(i) {
      Qa(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ti(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Qa(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var ii = /* @__PURE__ */ function() {
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
}(), el = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, tl = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, nl = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, ri = function(t) {
  return setTimeout(t, 0);
}, si = function(t, n) {
  var i = -1;
  return t.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Pe = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, i) : t;
}, it = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, il = function(t, n) {
  var i = n?.document || document, r = ni({
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
  }, o, a = function(g, w, I) {
    return g && g[w] !== void 0 ? g[w] : r[I || w];
  }, l = function(g) {
    return s.containerGroups.findIndex(function(w) {
      var I = w.container, T = w.tabbableNodes;
      return I.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(O) {
        return O === g;
      });
    });
  }, c = function(g) {
    var w = r[g];
    if (typeof w == "function") {
      for (var I = arguments.length, T = new Array(I > 1 ? I - 1 : 0), O = 1; O < I; O++)
        T[O - 1] = arguments[O];
      w = w.apply(void 0, T);
    }
    if (w === !0 && (w = void 0), !w) {
      if (w === void 0 || w === !1)
        return w;
      throw new Error("`".concat(g, "` was specified but was not a node, or did not return a node"));
    }
    var N = w;
    if (typeof w == "string" && (N = i.querySelector(w), !N))
      throw new Error("`".concat(g, "` as selector refers to no known node"));
    return N;
  }, u = function() {
    var g = c("initialFocus");
    if (g === !1)
      return !1;
    if (g === void 0)
      if (l(i.activeElement) >= 0)
        g = i.activeElement;
      else {
        var w = s.tabbableGroups[0], I = w && w.firstTabbableNode;
        g = I || c("fallbackFocus");
      }
    if (!g)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return g;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(g) {
      var w = Ga(g, r.tabbableOptions), I = Dr(g, r.tabbableOptions);
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
        nextTabbableNode: function(O) {
          var N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, L = I.findIndex(function(P) {
            return P === O;
          });
          if (!(L < 0))
            return N ? I.slice(L + 1).find(function(P) {
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
  }, f = function _(g) {
    if (g !== !1 && g !== i.activeElement) {
      if (!g || !g.focus) {
        _(u());
        return;
      }
      g.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = g, el(g) && g.select();
    }
  }, y = function(g) {
    var w = c("setReturnFocus", g);
    return w || (w === !1 ? !1 : g);
  }, p = function(g) {
    var w = it(g);
    if (!(l(w) >= 0)) {
      if (Pe(r.clickOutsideDeactivates, g)) {
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
          returnFocus: r.returnFocusOnDeactivate && !at(w, r.tabbableOptions)
        });
        return;
      }
      Pe(r.allowOutsideClick, g) || g.preventDefault();
    }
  }, v = function(g) {
    var w = it(g), I = l(w) >= 0;
    I || w instanceof Document ? I && (s.mostRecentlyFocusedNode = w) : (g.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, m = function(g) {
    var w = it(g);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(w), O = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        g.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var N = si(s.tabbableGroups, function(U) {
          var F = U.firstTabbableNode;
          return w === F;
        });
        if (N < 0 && (O.container === w || at(w, r.tabbableOptions) && !nt(w, r.tabbableOptions) && !O.nextTabbableNode(w, !1)) && (N = T), N >= 0) {
          var L = N === 0 ? s.tabbableGroups.length - 1 : N - 1, P = s.tabbableGroups[L];
          I = P.lastTabbableNode;
        }
      } else {
        var H = si(s.tabbableGroups, function(U) {
          var F = U.lastTabbableNode;
          return w === F;
        });
        if (H < 0 && (O.container === w || at(w, r.tabbableOptions) && !nt(w, r.tabbableOptions) && !O.nextTabbableNode(w)) && (H = T), H >= 0) {
          var D = H === s.tabbableGroups.length - 1 ? 0 : H + 1, le = s.tabbableGroups[D];
          I = le.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (g.preventDefault(), f(I));
  }, b = function(g) {
    if (tl(g) && Pe(r.escapeDeactivates, g) !== !1) {
      g.preventDefault(), o.deactivate();
      return;
    }
    if (nl(g)) {
      m(g);
      return;
    }
  }, h = function(g) {
    var w = it(g);
    l(w) >= 0 || Pe(r.clickOutsideDeactivates, g) || Pe(r.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, x = function() {
    if (s.active)
      return ii.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? ri(function() {
        f(u());
      }) : f(u()), i.addEventListener("focusin", v, !0), i.addEventListener("mousedown", p, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", p, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", h, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", b, {
        capture: !0,
        passive: !1
      }), o;
  }, E = function() {
    if (s.active)
      return i.removeEventListener("focusin", v, !0), i.removeEventListener("mousedown", p, !0), i.removeEventListener("touchstart", p, !0), i.removeEventListener("click", h, !0), i.removeEventListener("keydown", b, !0), o;
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
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, w && w();
      var O = function() {
        T && d(), x(), I && I();
      };
      return T ? (T(s.containers.concat()).then(O, O), this) : (O(), this);
    },
    deactivate: function(g) {
      if (!s.active)
        return this;
      var w = ni({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, g);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, ii.deactivateTrap(o);
      var I = a(w, "onDeactivate"), T = a(w, "onPostDeactivate"), O = a(w, "checkCanReturnFocus"), N = a(w, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var L = function() {
        ri(function() {
          N && f(y(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return N && O ? (O(y(s.nodeFocusedBeforeActivation)).then(L, L), this) : (L(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), x(), this);
    },
    updateContainerElements: function(g) {
      var w = [].concat(g).filter(Boolean);
      return s.containers = w.map(function(I) {
        return typeof I == "string" ? i.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function rl(e) {
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
        return at(s);
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
        return Array.isArray(r) ? r : Dr(r, { displayCheck: "none" });
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
        let m = i.querySelector("[autofocus]");
        m && (d.initialFocus = m);
      }
      s.includes("inert") && (d.onPostActivate = () => {
        e.nextTick(() => {
          f = oi(i);
        });
      });
      let y = il(i, d), p = () => {
      };
      const v = () => {
        f(), f = () => {
        }, p(), p = () => {
        }, y.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((m) => {
        u !== m && (m && !u && (s.includes("noscroll") && (p = sl()), setTimeout(() => {
          y.activate();
        }, 15)), !m && u && v(), u = !!m);
      })), l(v);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && oi(i);
    }
  ));
}
function oi(e) {
  let t = [];
  return Fr(e, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Fr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? Fr(e.parentNode, t) : t(n);
  });
}
function sl() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var ol = rl;
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
function al(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ll(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function cl(e, t, n) {
  return t && ll(e.prototype, t), e;
}
var ul = Object.defineProperty, X = function(e, t) {
  return ul(e, "name", { value: t, configurable: !0 });
}, dl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, fl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, hl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, pl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, ml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, gl = X(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Me = X(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), S = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, ne = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ai = { OUTLINE: "outline", FILLED: "filled" }, Ut = { FADE: "fade", SLIDE: "slide" }, De = { CLOSE: Me(dl), SUCCESS: Me(pl), ERROR: Me(fl), WARNING: Me(ml), INFO: Me(hl) }, li = X(function(e) {
  e.wrapper.classList.add(S.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(S.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ci = X(function(e) {
  e.wrapper.classList.remove(S.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), vl = X(function(e) {
  e.wrapper.classList.add(S.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(S.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), bl = X(function(e) {
  e.wrapper.classList.remove(S.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), zr = function() {
  function e(t) {
    var n = this;
    al(this, e), this.notifyOut = X(function(U) {
      U(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? Ut.FADE : c, d = t.type, f = d === void 0 ? "outline" : d, y = t.title, p = t.text, v = t.showIcon, m = v === void 0 ? !0 : v, b = t.customIcon, h = b === void 0 ? "" : b, x = t.customClass, E = x === void 0 ? "" : x, _ = t.speed, g = _ === void 0 ? 500 : _, w = t.showCloseButton, I = w === void 0 ? !0 : w, T = t.autoclose, O = T === void 0 ? !0 : T, N = t.autotimeout, L = N === void 0 ? 3e3 : N, P = t.position, H = P === void 0 ? "right top" : P, D = t.customWrapper, le = D === void 0 ? "" : D;
    if (this.customWrapper = le, this.status = l, this.title = y, this.text = p, this.showIcon = m, this.customIcon = h, this.customClass = E, this.speed = g, this.effect = u, this.showCloseButton = I, this.autoclose = O, this.autotimeout = L, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = H, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return cl(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(S.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(S.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](S.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](S.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](S.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](S.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](S.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](S.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](S.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(S.NOTIFY_CLOSE), i.innerHTML = De.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = gl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(S.NOTIFY), this.type) {
      case ai.OUTLINE:
        this.wrapper.classList.add(S.NOTIFY_OUTLINE);
        break;
      case ai.FILLED:
        this.wrapper.classList.add(S.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(S.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case ne.SUCCESS:
        this.wrapper.classList.add(S.NOTIFY_SUCCESS);
        break;
      case ne.ERROR:
        this.wrapper.classList.add(S.NOTIFY_ERROR);
        break;
      case ne.WARNING:
        this.wrapper.classList.add(S.NOTIFY_WARNING);
        break;
      case ne.INFO:
        this.wrapper.classList.add(S.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(S.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(S.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(S.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(S.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = X(function(r) {
      switch (r) {
        case ne.SUCCESS:
          return De.SUCCESS;
        case ne.ERROR:
          return De.ERROR;
        case ne.WARNING:
          return De.WARNING;
        case ne.INFO:
          return De.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(S.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
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
      case Ut.FADE:
        this.selectedNotifyInEffect = li, this.selectedNotifyOutEffect = ci;
        break;
      case Ut.SLIDE:
        this.selectedNotifyInEffect = vl, this.selectedNotifyOutEffect = bl;
        break;
      default:
        this.selectedNotifyInEffect = li, this.selectedNotifyOutEffect = ci;
    }
  } }]), e;
}();
X(zr, "Notify");
var Ur = zr;
globalThis.Notify = Ur;
const Br = ["success", "error", "warning", "info"], jr = [
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
], Wr = {
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
    ...Wr,
    ...e
  };
  Br.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), jr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Ur(t);
}
const yl = {
  custom: Fe,
  success(e, t = "Success", n = {}) {
    Fe({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    Fe({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    Fe({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    Fe({
      status: "info",
      title: t,
      text: e,
      ...n
    });
  },
  setDefaults(e = {}) {
    Object.assign(Wr, e);
  },
  get allowedStatuses() {
    return [...Br];
  },
  get allowedPositions() {
    return [...jr];
  }
}, ln = function() {
}, He = {}, mt = {}, qe = {};
function wl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let i = e.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || t(n);
  }; i--; ) {
    if (o = e[i], a = mt[o], a) {
      s(o, a);
      continue;
    }
    l = qe[o] = qe[o] || [], l.push(s);
  }
}
function Vr(e, t) {
  if (!e) return;
  const n = qe[e];
  if (mt[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function cn(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || ln)(t) : (e.success || ln)(e);
}
function xl(e, t, n, i, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Hr(t, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(t, l, e.defaultPrevented);
}
function Hr(e, t, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || ln, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
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
  const y = function(p) {
    xl(p, e, f, t, n, i, o, u);
  };
  f.addEventListener("load", y, { once: !0 }), f.addEventListener("error", y, { once: !0 }), a(e, f) !== !1 && r.head.appendChild(f);
}
function _l(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let i = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Hr(e[o], s, n);
}
function ie(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in He)
      throw "LoadJS";
    He[i] = !0;
  }
  function s(o, a) {
    _l(e, function(l) {
      cn(r, l), o && cn({ success: o, error: a }, l), Vr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
ie.ready = function(t, n) {
  return wl(t, function(i) {
    cn(n, i);
  }), ie;
};
ie.done = function(t) {
  Vr(t, []);
};
ie.reset = function() {
  Object.keys(He).forEach((t) => delete He[t]), Object.keys(mt).forEach((t) => delete mt[t]), Object.keys(qe).forEach((t) => delete qe[t]);
};
ie.isDefined = function(t) {
  return t in He;
};
function El(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = Il(e) || e;
    let n = Alpine.$data(t);
    if (n === void 0) {
      const i = t.closest?.("[x-data]");
      i && (n = Alpine.$data(i));
    }
    return n === void 0 && ui("element", t), n;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const n = `[data-alpine-root="${Yr(t)}"]`;
    let i = null;
    const r = document.getElementById(t);
    if (r && (i = r.matches(n) ? r : r.querySelector(n)), i || (i = qr(t)), !i) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${n} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(i);
    return s === void 0 && ui(`data-alpine-root="${t}"`, i), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Il(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", n = e.getAttribute?.("data-for");
  if (t || n) {
    const i = n || "";
    if (!i) return e;
    const r = qr(i);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${i}". Ensure the teleported root rendered with data-alpine-root="${i}".`
    ), null);
  }
  return e;
}
function qr(e) {
  const t = `[data-alpine-root="${Yr(e)}"]`, n = document.querySelectorAll(t);
  for (const i of n)
    if (i.hasAttribute("x-data")) return i;
  return n.length > 0 ? n[0] : document.getElementById(e) || null;
}
function Yr(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function ui(e, t) {
  const n = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${n}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function Ol(e) {
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
function Tl(e) {
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
function Sl(e) {
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
function Cl(e) {
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
function Al(e) {
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
function Nl(e, t) {
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
function kl(e) {
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
function $l(e, t) {
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
function Rl(e) {
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
function Ll(e, t) {
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
function Pl(e) {
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
const un = Math.min, xe = Math.max, gt = Math.round, K = (e) => ({
  x: e,
  y: e
}), Ml = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Dl = {
  start: "end",
  end: "start"
};
function di(e, t, n) {
  return xe(e, un(t, n));
}
function Nt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ye(e) {
  return e.split("-")[0];
}
function kt(e) {
  return e.split("-")[1];
}
function Kr(e) {
  return e === "x" ? "y" : "x";
}
function Jr(e) {
  return e === "y" ? "height" : "width";
}
function me(e) {
  return ["top", "bottom"].includes(ye(e)) ? "y" : "x";
}
function Zr(e) {
  return Kr(me(e));
}
function Fl(e, t, n) {
  n === void 0 && (n = !1);
  const i = kt(e), r = Zr(e), s = Jr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = vt(o)), [o, vt(o)];
}
function zl(e) {
  const t = vt(e);
  return [dn(e), t, dn(t)];
}
function dn(e) {
  return e.replace(/start|end/g, (t) => Dl[t]);
}
function Ul(e, t, n) {
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
  const r = kt(e);
  let s = Ul(ye(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(dn)))), s;
}
function vt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Ml[t]);
}
function jl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Wl(e) {
  return typeof e != "number" ? jl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function bt(e) {
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
function fi(e, t, n) {
  let {
    reference: i,
    floating: r
  } = e;
  const s = me(t), o = Zr(t), a = Jr(o), l = ye(t), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
  let y;
  switch (l) {
    case "top":
      y = {
        x: u,
        y: i.y - r.height
      };
      break;
    case "bottom":
      y = {
        x: u,
        y: i.y + i.height
      };
      break;
    case "right":
      y = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      y = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      y = {
        x: i.x,
        y: i.y
      };
  }
  switch (kt(t)) {
    case "start":
      y[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      y[o] += f * (n && c ? -1 : 1);
      break;
  }
  return y;
}
const Vl = async (e, t, n) => {
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
  } = fi(c, i, l), f = i, y = {}, p = 0;
  for (let v = 0; v < a.length; v++) {
    const {
      name: m,
      fn: b
    } = a[v], {
      x: h,
      y: x,
      data: E,
      reset: _
    } = await b({
      x: u,
      y: d,
      initialPlacement: i,
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
    u = h ?? u, d = x ?? d, y = {
      ...y,
      [m]: {
        ...y[m],
        ...E
      }
    }, _ && p <= 50 && (p++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (c = _.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : _.rects), {
      x: u,
      y: d
    } = fi(c, f, l)), v = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: y
  };
};
async function Gr(e, t) {
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
    padding: y = 0
  } = Nt(t, e), p = Wl(y), m = a[f ? d === "floating" ? "reference" : "floating" : d], b = bt(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(m))) == null || n ? m : m.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), h = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), E = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = bt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: x,
    strategy: l
  }) : h);
  return {
    top: (b.top - _.top + p.top) / E.y,
    bottom: (_.bottom - b.bottom + p.bottom) / E.y,
    left: (b.left - _.left + p.left) / E.x,
    right: (_.right - b.right + p.right) / E.x
  };
}
const Hl = function(e) {
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
        fallbackStrategy: y = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: v = !0,
        ...m
      } = Nt(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const b = ye(r), h = me(a), x = ye(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = f || (x || !v ? [vt(a)] : zl(a)), g = p !== "none";
      !f && g && _.push(...Bl(a, v, p, E));
      const w = [a, ..._], I = await Gr(t, m), T = [];
      let O = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && T.push(I[b]), d) {
        const D = Fl(r, o, E);
        T.push(I[D[0]], I[D[1]]);
      }
      if (O = [...O, {
        placement: r,
        overflows: T
      }], !T.every((D) => D <= 0)) {
        var N, L;
        const D = (((N = s.flip) == null ? void 0 : N.index) || 0) + 1, le = w[D];
        if (le) {
          var P;
          const F = d === "alignment" ? h !== me(le) : !1, q = ((P = O[0]) == null ? void 0 : P.overflows[0]) > 0;
          if (!F || q)
            return {
              data: {
                index: D,
                overflows: O
              },
              reset: {
                placement: le
              }
            };
        }
        let U = (L = O.filter((F) => F.overflows[0] <= 0).sort((F, q) => F.overflows[1] - q.overflows[1])[0]) == null ? void 0 : L.placement;
        if (!U)
          switch (y) {
            case "bestFit": {
              var H;
              const F = (H = O.filter((q) => {
                if (g) {
                  const ee = me(q.placement);
                  return ee === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ee === "y";
                }
                return !0;
              }).map((q) => [q.placement, q.overflows.filter((ee) => ee > 0).reduce((ee, as) => ee + as, 0)]).sort((q, ee) => q[1] - ee[1])[0]) == null ? void 0 : H[0];
              F && (U = F);
              break;
            }
            case "initialPlacement":
              U = a;
              break;
          }
        if (r !== U)
          return {
            reset: {
              placement: U
            }
          };
      }
      return {};
    }
  };
};
async function ql(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = ye(n), a = kt(n), l = me(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Nt(t, e);
  let {
    mainAxis: f,
    crossAxis: y,
    alignmentAxis: p
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof p == "number" && (y = a === "end" ? p * -1 : p), l ? {
    x: y * u,
    y: f * c
  } : {
    x: f * c,
    y: y * u
  };
}
const Yl = function(e) {
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
      } = t, l = await ql(t, e);
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
}, Kl = function(e) {
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
          fn: (m) => {
            let {
              x: b,
              y: h
            } = m;
            return {
              x: b,
              y: h
            };
          }
        },
        ...l
      } = Nt(e, t), c = {
        x: n,
        y: i
      }, u = await Gr(t, l), d = me(ye(r)), f = Kr(d);
      let y = c[f], p = c[d];
      if (s) {
        const m = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", h = y + u[m], x = y - u[b];
        y = di(h, y, x);
      }
      if (o) {
        const m = d === "y" ? "top" : "left", b = d === "y" ? "bottom" : "right", h = p + u[m], x = p - u[b];
        p = di(h, p, x);
      }
      const v = a.fn({
        ...t,
        [f]: y,
        [d]: p
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
function $t() {
  return typeof window < "u";
}
function ke(e) {
  return Xr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function M(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Q(e) {
  var t;
  return (t = (Xr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Xr(e) {
  return $t() ? e instanceof Node || e instanceof M(e).Node : !1;
}
function j(e) {
  return $t() ? e instanceof Element || e instanceof M(e).Element : !1;
}
function J(e) {
  return $t() ? e instanceof HTMLElement || e instanceof M(e).HTMLElement : !1;
}
function hi(e) {
  return !$t() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof M(e).ShadowRoot;
}
function Ze(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function Jl(e) {
  return ["table", "td", "th"].includes(ke(e));
}
function Rt(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Ln(e) {
  const t = Pn(), n = j(e) ? W(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Zl(e) {
  let t = oe(e);
  for (; J(t) && !Ie(t); ) {
    if (Ln(t))
      return t;
    if (Rt(t))
      return null;
    t = oe(t);
  }
  return null;
}
function Pn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ie(e) {
  return ["html", "body", "#document"].includes(ke(e));
}
function W(e) {
  return M(e).getComputedStyle(e);
}
function Lt(e) {
  return j(e) ? {
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
    hi(e) && e.host || // Fallback.
    Q(e)
  );
  return hi(t) ? t.host : t;
}
function Qr(e) {
  const t = oe(e);
  return Ie(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : J(t) && Ze(t) ? t : Qr(t);
}
function es(e, t, n) {
  var i;
  t === void 0 && (t = []);
  const r = Qr(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = M(r);
  return s ? (fn(o), t.concat(o, o.visualViewport || [], Ze(r) ? r : [], [])) : t.concat(r, es(r, []));
}
function fn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function ts(e) {
  const t = W(e);
  let n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const r = J(e), s = r ? e.offsetWidth : n, o = r ? e.offsetHeight : i, a = gt(n) !== s || gt(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function ns(e) {
  return j(e) ? e : e.contextElement;
}
function _e(e) {
  const t = ns(e);
  if (!J(t))
    return K(1);
  const n = t.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = ts(t);
  let o = (s ? gt(n.width) : n.width) / i, a = (s ? gt(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Gl = /* @__PURE__ */ K(0);
function is(e) {
  const t = M(e);
  return !Pn() || !t.visualViewport ? Gl : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Xl(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== M(e) ? !1 : t;
}
function Ye(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = ns(e);
  let o = K(1);
  t && (i ? j(i) && (o = _e(i)) : o = _e(e));
  const a = Xl(s, n, i) ? is(s) : K(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), y = i && j(i) ? M(i) : i;
    let p = f, v = fn(p);
    for (; v && i && y !== p; ) {
      const m = _e(v), b = v.getBoundingClientRect(), h = W(v), x = b.left + (v.clientLeft + parseFloat(h.paddingLeft)) * m.x, E = b.top + (v.clientTop + parseFloat(h.paddingTop)) * m.y;
      l *= m.x, c *= m.y, u *= m.x, d *= m.y, l += x, c += E, p = M(v), v = fn(p);
    }
  }
  return bt({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Mn(e, t) {
  const n = Lt(e).scrollLeft;
  return t ? t.left + n : Ye(Q(e)).left + n;
}
function rs(e, t, n) {
  n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), r = i.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Mn(e, i)
  )), s = i.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Ql(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = Q(i), a = t ? Rt(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), d = J(i);
  if ((d || !d && !s) && ((ke(i) !== "body" || Ze(o)) && (l = Lt(i)), J(i))) {
    const y = Ye(i);
    c = _e(i), u.x = y.x + i.clientLeft, u.y = y.y + i.clientTop;
  }
  const f = o && !d && !s ? rs(o, l, !0) : K(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function ec(e) {
  return Array.from(e.getClientRects());
}
function tc(e) {
  const t = Q(e), n = Lt(e), i = e.ownerDocument.body, r = xe(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = xe(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Mn(e);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += xe(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function nc(e, t) {
  const n = M(e), i = Q(e), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Pn();
    (!c || c && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function ic(e, t) {
  const n = Ye(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = J(e) ? _e(e) : K(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function pi(e, t, n) {
  let i;
  if (t === "viewport")
    i = nc(e, n);
  else if (t === "document")
    i = tc(Q(e));
  else if (j(t))
    i = ic(t, n);
  else {
    const r = is(e);
    i = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return bt(i);
}
function ss(e, t) {
  const n = oe(e);
  return n === t || !j(n) || Ie(n) ? !1 : W(n).position === "fixed" || ss(n, t);
}
function rc(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = es(e, []).filter((a) => j(a) && ke(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? oe(e) : e;
  for (; j(o) && !Ie(o); ) {
    const a = W(o), l = Ln(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ze(o) && !l && ss(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = oe(o);
  }
  return t.set(e, i), i;
}
function sc(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? Rt(t) ? [] : rc(t, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = pi(t, u, r);
    return c.top = xe(d.top, c.top), c.right = un(d.right, c.right), c.bottom = un(d.bottom, c.bottom), c.left = xe(d.left, c.left), c;
  }, pi(t, a, r));
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
    height: n
  } = ts(e);
  return {
    width: t,
    height: n
  };
}
function ac(e, t, n) {
  const i = J(t), r = Q(t), s = n === "fixed", o = Ye(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = Mn(r);
  }
  if (i || !i && !s)
    if ((ke(t) !== "body" || Ze(r)) && (a = Lt(t)), i) {
      const y = Ye(t, !0, s, t);
      l.x = y.x + t.clientLeft, l.y = y.y + t.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? rs(r, a) : K(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Bt(e) {
  return W(e).position === "static";
}
function mi(e, t) {
  if (!J(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return Q(e) === n && (n = n.ownerDocument.body), n;
}
function os(e, t) {
  const n = M(e);
  if (Rt(e))
    return n;
  if (!J(e)) {
    let r = oe(e);
    for (; r && !Ie(r); ) {
      if (j(r) && !Bt(r))
        return r;
      r = oe(r);
    }
    return n;
  }
  let i = mi(e, t);
  for (; i && Jl(i) && Bt(i); )
    i = mi(i, t);
  return i && Ie(i) && Bt(i) && !Ln(i) ? n : i || Zl(e) || n;
}
const lc = async function(e) {
  const t = this.getOffsetParent || os, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: ac(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function cc(e) {
  return W(e).direction === "rtl";
}
const uc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ql,
  getDocumentElement: Q,
  getClippingRect: sc,
  getOffsetParent: os,
  getElementRects: lc,
  getClientRects: ec,
  getDimensions: oc,
  getScale: _e,
  isElement: j,
  isRTL: cc
}, yt = Yl, wt = Kl, xt = Hl, _t = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: uc,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Vl(e, t, {
    ...r,
    platform: s
  });
};
function dc(e) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), _t(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [yt(this.pixelOffset), xt(), wt({ padding: 8 })]
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
      !this.triggerEl || !t || _t(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [yt(this.pixelOffset), xt(), wt({ padding: 8 })]
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
function fc(e) {
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
function hc(e) {
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
function pc(e) {
  e.data("rzEmpty", () => {
  });
}
function mc(e) {
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
function gc(e) {
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
function vc(e, t) {
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
function bc(e) {
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
function yc(e, t) {
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
      !o || !a || (_t(o, a, {
        placement: "bottom-start",
        middleware: [yt(6), xt(), wt({ padding: 8 })]
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
function wc(e) {
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
      c.push(yt({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(xt()), a && c.push(wt({ padding: l })), _t(this.triggerEl, this.contentEl, {
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
function xc(e) {
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
function _c(e) {
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
function Ec(e) {
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
function Ic(e) {
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
function Oc(e) {
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
function Tc(e) {
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
async function Sc(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
async function Ue(e, t, n) {
  let i = typeof t == "function" ? t : void 0;
  const r = typeof t == "string" && !n ? t : n, s = await Sc(e);
  ie.isDefined(s) || ie(e, s, {
    async: !1,
    inlineScriptNonce: r,
    inlineStyleNonce: r
    // Note: We DO NOT rely on loadjs's returnPromise here because
    // the bundle may already be in-flight. We unify everything through ready().
  });
  const o = new Promise((a, l) => {
    ie.ready([s], {
      success: () => a({ bundleId: s }),
      error: (c) => l(new Error(`rizzyRequire: failed to load: ${c.join(", ")}`))
    });
  });
  return i && o.then(() => i()).catch((a) => {
    console.error(a);
  }), o;
}
function Cc(e) {
  Ol(e), Tl(e), Sl(e), Cl(e), Al(e), Nl(e, Ue), kl(e), $l(e, Ue), Rl(e), Ll(e, Ue), Pl(e), dc(e), fc(e), hc(e), pc(e), mc(e), gc(e), vc(e, Ue), yc(e), bc(e), wc(e), xc(e), _c(e), Ec(e), Ic(e), Oc(e), Tc(e);
}
function Ac(e) {
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
const rt = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map();
let gi = !1;
function Nc(e) {
  return st.has(e) || st.set(
    e,
    import(e).catch((t) => {
      throw st.delete(e), t;
    })
  ), st.get(e);
}
function vi(e, t) {
  const n = globalThis.Alpine;
  return n && typeof n.asyncData == "function" ? (n.asyncData(
    e,
    () => Nc(t).catch((i) => (console.error(
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
function kc(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const n = rt.get(e);
  n && n.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${n.path}
  New:      ${t}`
  );
  const i = globalThis.Alpine;
  if (i && i.version) {
    const r = !n || n.path !== t;
    if (!(n && n.loaderSet && !r)) {
      const o = vi(e, t);
      rt.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  rt.set(e, { path: t, loaderSet: !1 }), gi || (gi = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of rt)
        if (!s.loaderSet) {
          const o = vi(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function $c(e) {
  e.directive("mobile", (t, { modifiers: n, expression: i }, { cleanup: r }) => {
    const s = n.find((b) => b.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(i && i.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (b) => {
      t.dataset.mobile = b ? "true" : "false", t.dataset.screen = b ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (b) => {
      if (!a) return;
      const h = u();
      h && (h[i] = b);
    }, f = (b) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: b, width: window.innerWidth, breakpoint: o }
        })
      );
    }, y = window.matchMedia(`(max-width: ${o - 1}px)`), p = () => {
      const b = l();
      c(b), d(b), f(b);
    };
    p();
    const v = () => p(), m = () => p();
    y.addEventListener("change", v), window.addEventListener("resize", m, { passive: !0 }), r(() => {
      y.removeEventListener("change", v), window.removeEventListener("resize", m);
    });
  });
}
function Rc(e) {
  const t = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (v, m, b) => {
      const x = m.replace(/\[(\d+)\]/g, ".$1").split("."), E = x.pop();
      let _ = v;
      for (const g of x)
        (_[g] == null || typeof _[g] != "object") && (_[g] = isFinite(+g) ? [] : {}), _ = _[g];
      _[E] = b;
    }, l = e.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-sync] Could not find direct parent/child x-data. Ensure x-sync is used one level inside a parent component.");
      return;
    }
    const d = i.split(",").map((v) => v.trim()).filter(Boolean).map((v) => {
      const m = v.split("->").map((b) => b.trim());
      return m.length !== 2 ? (console.warn('[x-sync] Invalid mapping (expected "parent.path -> child.path"): ', v), null) : { parentPath: m[0], childPath: m[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), y = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), p = [];
    d.forEach((v, m) => {
      const b = y[m];
      if (f) {
        const E = e.evaluate(n, v.childPath, { scope: c });
        b.fromChild = !0, a(u, v.parentPath, E), queueMicrotask(() => {
          b.fromChild = !1;
        });
      } else {
        const E = e.evaluate(n, v.parentPath, { scope: u });
        b.fromParent = !0, a(c, v.childPath, E), queueMicrotask(() => {
          b.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = e.evaluate(n, v.parentPath, { scope: u });
        b.fromChild || (b.fromParent = !0, a(c, v.childPath, E), queueMicrotask(() => {
          b.fromParent = !1;
        }));
      }), x = o(() => {
        const E = e.evaluate(n, v.childPath, { scope: c });
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
      p.push(h, x);
    }), s(() => {
      for (const v of p)
        try {
          v && v();
        } catch {
        }
    });
  };
  e.directive("sync", t);
}
Z.plugin(La);
Z.plugin(za);
Z.plugin(ol);
Z.plugin($a);
Cc(Z);
$c(Z);
Rc(Z);
const Lc = {
  Alpine: Z,
  require: Ue,
  toast: yl,
  $data: El,
  props: Ac,
  registerAsyncComponent: kc
};
window.Alpine = Z;
window.Rizzy = { ...window.Rizzy || {}, ...Lc };
document.dispatchEvent(new CustomEvent("rz:init", {
  detail: { Rizzy: window.Rizzy }
}));
Z.start();
export {
  Lc as default
};
