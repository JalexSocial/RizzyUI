var Ve = !1, Ye = !1, ft = [], Ke = -1;
function hs(t) {
  ps(t);
}
function ps(t) {
  ft.includes(t) || ft.push(t), gs();
}
function ms(t) {
  let e = ft.indexOf(t);
  e !== -1 && e > Ke && ft.splice(e, 1);
}
function gs() {
  !Ye && !Ve && (Ve = !0, queueMicrotask(vs));
}
function vs() {
  Ve = !1, Ye = !0;
  for (let t = 0; t < ft.length; t++)
    ft[t](), Ke = t;
  ft.length = 0, Ke = -1, Ye = !1;
}
var At, Et, Ot, In, Je = !0;
function ys(t) {
  Je = !1, t(), Je = !0;
}
function bs(t) {
  At = t.reactive, Ot = t.release, Et = (e) => t.effect(e, { scheduler: (i) => {
    Je ? hs(i) : i();
  } }), In = t.raw;
}
function ji(t) {
  Et = t;
}
function ws(t) {
  let e = () => {
  };
  return [(n) => {
    let r = Et(n);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(r), e = () => {
      r !== void 0 && (t._x_effects.delete(r), Ot(r));
    }, r;
  }, () => {
    e();
  }];
}
function Tn(t, e) {
  let i = !0, n, r = Et(() => {
    let s = t();
    JSON.stringify(s), i ? n = s : queueMicrotask(() => {
      e(s, n), n = s;
    }), i = !1;
  });
  return () => Ot(r);
}
var Cn = [], Sn = [], An = [];
function _s(t) {
  An.push(t);
}
function gi(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, Sn.push(e));
}
function On(t) {
  Cn.push(t);
}
function $n(t, e, i) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(i);
}
function kn(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([i, n]) => {
    (e === void 0 || e.includes(i)) && (n.forEach((r) => r()), delete t._x_attributeCleanups[i]);
  });
}
function xs(t) {
  for (t._x_effects?.forEach(ms); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var vi = new MutationObserver(_i), yi = !1;
function bi() {
  vi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), yi = !0;
}
function Nn() {
  Es(), vi.disconnect(), yi = !1;
}
var Lt = [];
function Es() {
  let t = vi.takeRecords();
  Lt.push(() => t.length > 0 && _i(t));
  let e = Lt.length;
  queueMicrotask(() => {
    if (Lt.length === e)
      for (; Lt.length > 0; )
        Lt.shift()();
  });
}
function $(t) {
  if (!yi)
    return t();
  Nn();
  let e = t();
  return bi(), e;
}
var wi = !1, ye = [];
function Is() {
  wi = !0;
}
function Ts() {
  wi = !1, _i(ye), ye = [];
}
function _i(t) {
  if (wi) {
    ye = ye.concat(t);
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
    kn(o, s);
  }), n.forEach((s, o) => {
    Cn.forEach((a) => a(o, s));
  });
  for (let s of i)
    e.some((o) => o.contains(s)) || Sn.forEach((o) => o(s));
  for (let s of e)
    s.isConnected && An.forEach((o) => o(s));
  e = null, i = null, n = null, r = null;
}
function Dn(t) {
  return $t(yt(t));
}
function ee(t, e, i) {
  return t._x_dataStack = [e, ...yt(i || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((n) => n !== e);
  };
}
function yt(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? yt(t.host) : t.parentNode ? yt(t.parentNode) : [];
}
function $t(t) {
  return new Proxy({ objects: t }, Cs);
}
var Cs = {
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
    return e == "toJSON" ? Ss : Reflect.get(
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
function Ss() {
  return Reflect.ownKeys(this).reduce((e, i) => (e[i] = Reflect.get(this, i), e), {});
}
function Rn(t) {
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
function Ln(t, e = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, r, s) {
      return t(this.initialValue, () => As(n, r), (o) => Xe(n, r, o), r, s);
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
function As(t, e) {
  return e.split(".").reduce((i, n) => i[n], t);
}
function Xe(t, e, i) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = i;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Xe(t[e[0]], e.slice(1), i);
  }
}
var Pn = {};
function Y(t, e) {
  Pn[t] = e;
}
function be(t, e) {
  let i = Os(e);
  return Object.entries(Pn).forEach(([n, r]) => {
    Object.defineProperty(t, `$${n}`, {
      get() {
        return r(e, i);
      },
      enumerable: !1
    });
  }), t;
}
function Os(t) {
  let [e, i] = jn(t), n = { interceptor: Ln, ...e };
  return gi(t, i), n;
}
function Mn(t, e, i, ...n) {
  try {
    return i(...n);
  } catch (r) {
    Yt(r, t, e);
  }
}
function Yt(t, e, i = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: i }
  ), console.warn(`Alpine Expression Error: ${t.message}

${i ? 'Expression: "' + i + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var Wt = !0;
function zn(t) {
  let e = Wt;
  Wt = !1;
  let i = t();
  return Wt = e, i;
}
function ht(t, e, i = {}) {
  let n;
  return z(t, e)((r) => n = r, i), n;
}
function z(...t) {
  return Fn(...t);
}
var Fn = ks;
function $s(t) {
  Fn = t;
}
function ks(t, e) {
  let i = {};
  be(i, t);
  let n = [i, ...yt(t)], r = typeof e == "function" ? Un(n, e) : Ds(n, e, t);
  return Mn.bind(null, t, e, r);
}
function Un(t, e) {
  return (i = () => {
  }, { scope: n = {}, params: r = [], context: s } = {}) => {
    let o = e.apply($t([n, ...t]), r);
    we(i, o);
  };
}
var Fe = {};
function Ns(t, e) {
  if (Fe[t])
    return Fe[t];
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
      return Yt(o, e, t), Promise.resolve();
    }
  })();
  return Fe[t] = s, s;
}
function Ds(t, e, i) {
  let n = Ns(e, i);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = $t([s, ...t]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => Yt(u, i, e));
      n.finished ? (we(r, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        we(r, u, l, o, i);
      }).catch((u) => Yt(u, i, e)).finally(() => n.result = void 0);
    }
  };
}
function we(t, e, i, n, r) {
  if (Wt && typeof e == "function") {
    let s = e.apply(i, n);
    s instanceof Promise ? s.then((o) => we(t, o, i, n)).catch((o) => Yt(o, r, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
var xi = "x-";
function kt(t = "") {
  return xi + t;
}
function Rs(t) {
  xi = t;
}
var _e = {};
function k(t, e) {
  return _e[t] = e, {
    before(i) {
      if (!_e[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const n = dt.indexOf(i);
      dt.splice(n >= 0 ? n : dt.indexOf("DEFAULT"), 0, t);
    }
  };
}
function Ls(t) {
  return Object.keys(_e).includes(t);
}
function Ei(t, e, i) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Bn(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), e = e.concat(s);
  }
  let n = {};
  return e.map(Vn((s, o) => n[s] = o)).filter(Kn).map(zs(n, i)).sort(Fs).map((s) => Ms(t, s));
}
function Bn(t) {
  return Array.from(t).map(Vn()).filter((e) => !Kn(e));
}
var Ze = !1, jt = /* @__PURE__ */ new Map(), Hn = Symbol();
function Ps(t) {
  Ze = !0;
  let e = Symbol();
  Hn = e, jt.set(e, []);
  let i = () => {
    for (; jt.get(e).length; )
      jt.get(e).shift()();
    jt.delete(e);
  }, n = () => {
    Ze = !1, i();
  };
  t(i), n();
}
function jn(t) {
  let e = [], i = (a) => e.push(a), [n, r] = ws(t);
  return e.push(r), [{
    Alpine: ie,
    effect: n,
    cleanup: i,
    evaluateLater: z.bind(z, t),
    evaluate: ht.bind(ht, t)
  }, () => e.forEach((a) => a())];
}
function Ms(t, e) {
  let i = () => {
  }, n = _e[e.type] || i, [r, s] = jn(t);
  $n(t, e.original, s);
  let o = () => {
    t._x_ignore || t._x_ignoreSelf || (n.inline && n.inline(t, e, r), n = n.bind(n, t, e, r), Ze ? jt.get(Hn).push(n) : n());
  };
  return o.runCleanups = s, o;
}
var Wn = (t, e) => ({ name: i, value: n }) => (i.startsWith(t) && (i = i.replace(t, e)), { name: i, value: n }), qn = (t) => t;
function Vn(t = () => {
}) {
  return ({ name: e, value: i }) => {
    let { name: n, value: r } = Yn.reduce((s, o) => o(s), { name: e, value: i });
    return n !== e && t(n, e), { name: n, value: r };
  };
}
var Yn = [];
function Ii(t) {
  Yn.push(t);
}
function Kn({ name: t }) {
  return Jn().test(t);
}
var Jn = () => new RegExp(`^${xi}([^:^.]+)\\b`);
function zs(t, e) {
  return ({ name: i, value: n }) => {
    let r = i.match(Jn()), s = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = e || t[i] || i;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: n,
      original: a
    };
  };
}
var Ge = "DEFAULT", dt = [
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
function Fs(t, e) {
  let i = dt.indexOf(t.type) === -1 ? Ge : t.type, n = dt.indexOf(e.type) === -1 ? Ge : e.type;
  return dt.indexOf(i) - dt.indexOf(n);
}
function qt(t, e, i = {}) {
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
function H(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var Wi = !1;
function Us() {
  Wi && H("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Wi = !0, document.body || H("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), qt(document, "alpine:init"), qt(document, "alpine:initializing"), bi(), _s((e) => Q(e, bt)), gi((e) => Dt(e)), On((e, i) => {
    Ei(e, i).forEach((n) => n());
  });
  let t = (e) => !Oe(e.parentElement, !0);
  Array.from(document.querySelectorAll(Gn().join(","))).filter(t).forEach((e) => {
    Q(e);
  }), qt(document, "alpine:initialized"), setTimeout(() => {
    Ws();
  });
}
var Ti = [], Xn = [];
function Zn() {
  return Ti.map((t) => t());
}
function Gn() {
  return Ti.concat(Xn).map((t) => t());
}
function Qn(t) {
  Ti.push(t);
}
function tr(t) {
  Xn.push(t);
}
function Oe(t, e = !1) {
  return Nt(t, (i) => {
    if ((e ? Gn() : Zn()).some((r) => i.matches(r)))
      return !0;
  });
}
function Nt(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack && (t = t._x_teleportBack), !!t.parentElement)
      return Nt(t.parentElement, e);
  }
}
function Bs(t) {
  return Zn().some((e) => t.matches(e));
}
var er = [];
function Hs(t) {
  er.push(t);
}
var js = 1;
function Q(t, e = bt, i = () => {
}) {
  Nt(t, (n) => n._x_ignore) || Ps(() => {
    e(t, (n, r) => {
      n._x_marker || (i(n, r), er.forEach((s) => s(n, r)), Ei(n, n.attributes).forEach((s) => s()), n._x_ignore || (n._x_marker = js++), n._x_ignore && r());
    });
  });
}
function Dt(t, e = bt) {
  e(t, (i) => {
    xs(i), kn(i), delete i._x_marker;
  });
}
function Ws() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, i, n]) => {
    Ls(i) || n.some((r) => {
      if (document.querySelector(r))
        return H(`found "${r}", but missing ${e} plugin`), !0;
    });
  });
}
var Qe = [], Ci = !1;
function Si(t = () => {
}) {
  return queueMicrotask(() => {
    Ci || setTimeout(() => {
      ti();
    });
  }), new Promise((e) => {
    Qe.push(() => {
      t(), e();
    });
  });
}
function ti() {
  for (Ci = !1; Qe.length; )
    Qe.shift()();
}
function qs() {
  Ci = !0;
}
function Ai(t, e) {
  return Array.isArray(e) ? qi(t, e.join(" ")) : typeof e == "object" && e !== null ? Vs(t, e) : typeof e == "function" ? Ai(t, e()) : qi(t, e);
}
function qi(t, e) {
  let i = (r) => r.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), n = (r) => (t.classList.add(...r), () => {
    t.classList.remove(...r);
  });
  return e = e === !0 ? e = "" : e || "", n(i(e));
}
function Vs(t, e) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(e).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function $e(t, e) {
  return typeof e == "object" && e !== null ? Ys(t, e) : Ks(t, e);
}
function Ys(t, e) {
  let i = {};
  return Object.entries(e).forEach(([n, r]) => {
    i[n] = t.style[n], n.startsWith("--") || (n = Js(n)), t.style.setProperty(n, r);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    $e(t, i);
  };
}
function Ks(t, e) {
  let i = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", i || "");
  };
}
function Js(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ei(t, e = () => {
}) {
  let i = !1;
  return function() {
    i ? e.apply(this, arguments) : (i = !0, t.apply(this, arguments));
  };
}
k("transition", (t, { value: e, modifiers: i, expression: n }, { evaluate: r }) => {
  typeof n == "function" && (n = r(n)), n !== !1 && (!n || typeof n == "boolean" ? Zs(t, i, e) : Xs(t, n, e));
});
function Xs(t, e, i) {
  ir(t, Ai, ""), {
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
function Zs(t, e, i) {
  ir(t, $e);
  let n = !e.includes("in") && !e.includes("out") && !i, r = n || e.includes("in") || ["enter"].includes(i), s = n || e.includes("out") || ["leave"].includes(i);
  e.includes("in") && !n && (e = e.filter((v, h) => h < e.indexOf("out"))), e.includes("out") && !n && (e = e.filter((v, h) => h > e.indexOf("out")));
  let o = !e.includes("opacity") && !e.includes("scale"), a = o || e.includes("opacity"), l = o || e.includes("scale"), c = a ? 0 : 1, u = l ? Pt(e, "scale", 95) / 100 : 1, d = Pt(e, "delay", 0) / 1e3, f = Pt(e, "origin", "center"), g = "opacity, transform", p = Pt(e, "duration", 150) / 1e3, b = Pt(e, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (t._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: g,
    transitionDuration: `${p}s`,
    transitionTimingFunction: m
  }, t._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (t._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: g,
    transitionDuration: `${b}s`,
    transitionTimingFunction: m
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function ir(t, e, i = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, r = () => {
    }) {
      ii(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, r);
    },
    out(n = () => {
    }, r = () => {
    }) {
      ii(t, e, {
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
    let o = nr(t);
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
function nr(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : nr(e);
}
function ii(t, e, { during: i, start: n, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Gs(t, {
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
function Gs(t, e) {
  let i, n, r, s = ei(() => {
    $(() => {
      i = !0, n || e.before(), r || (e.end(), ti()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: ei(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, $(() => {
    e.start(), e.during();
  }), qs(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), $(() => {
      e.before();
    }), n = !0, requestAnimationFrame(() => {
      i || ($(() => {
        e.end();
      }), ti(), setTimeout(t._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Pt(t, e, i) {
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
var st = !1;
function lt(t, e = () => {
}) {
  return (...i) => st ? e(...i) : t(...i);
}
function Qs(t) {
  return (...e) => st && t(...e);
}
var rr = [];
function ke(t) {
  rr.push(t);
}
function to(t, e) {
  rr.forEach((i) => i(t, e)), st = !0, sr(() => {
    Q(e, (i, n) => {
      n(i, () => {
      });
    });
  }), st = !1;
}
var ni = !1;
function eo(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), st = !0, ni = !0, sr(() => {
    io(e);
  }), st = !1, ni = !1;
}
function io(t) {
  let e = !1;
  Q(t, (n, r) => {
    bt(n, (s, o) => {
      if (e && Bs(s))
        return o();
      e = !0, r(s, o);
    });
  });
}
function sr(t) {
  let e = Et;
  ji((i, n) => {
    let r = e(i);
    return Ot(r), () => {
    };
  }), t(), ji(e);
}
function or(t, e, i, n = []) {
  switch (t._x_bindings || (t._x_bindings = At({})), t._x_bindings[e] = i, e = n.includes("camel") ? uo(e) : e, e) {
    case "value":
      no(t, i);
      break;
    case "style":
      so(t, i);
      break;
    case "class":
      ro(t, i);
      break;
    case "selected":
    case "checked":
      oo(t, e, i);
      break;
    default:
      ar(t, e, i);
      break;
  }
}
function no(t, e) {
  if (ur(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = ge(t.value) === e : t.checked = Vi(t.value, e));
  else if (Oi(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((i) => Vi(i, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    co(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function ro(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Ai(t, e);
}
function so(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = $e(t, e);
}
function oo(t, e, i) {
  ar(t, e, i), lo(t, e, i);
}
function ar(t, e, i) {
  [null, void 0, !1].includes(i) && ho(e) ? t.removeAttribute(e) : (lr(e) && (i = e), ao(t, e, i));
}
function ao(t, e, i) {
  t.getAttribute(e) != i && t.setAttribute(e, i);
}
function lo(t, e, i) {
  t[e] !== i && (t[e] = i);
}
function co(t, e) {
  const i = [].concat(e).map((n) => n + "");
  Array.from(t.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function uo(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function Vi(t, e) {
  return t == e;
}
function ge(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var fo = /* @__PURE__ */ new Set([
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
function lr(t) {
  return fo.has(t);
}
function ho(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function po(t, e, i) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : cr(t, e, i);
}
function mo(t, e, i, n = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let r = t._x_inlineBindings[e];
    return r.extract = n, zn(() => ht(t, r.expression));
  }
  return cr(t, e, i);
}
function cr(t, e, i) {
  let n = t.getAttribute(e);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : lr(e) ? !![e, "true"].includes(n) : n;
}
function Oi(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function ur(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function dr(t, e) {
  let i;
  return function() {
    const n = this, r = arguments, s = function() {
      i = null, t.apply(n, r);
    };
    clearTimeout(i), i = setTimeout(s, e);
  };
}
function fr(t, e) {
  let i;
  return function() {
    let n = this, r = arguments;
    i || (t.apply(n, r), i = !0, setTimeout(() => i = !1, e));
  };
}
function hr({ get: t, set: e }, { get: i, set: n }) {
  let r = !0, s, o = Et(() => {
    let a = t(), l = i();
    if (r)
      n(Ue(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? n(Ue(a)) : c !== u && e(Ue(l));
    }
    s = JSON.stringify(t()), JSON.stringify(i());
  });
  return () => {
    Ot(o);
  };
}
function Ue(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function go(t) {
  (Array.isArray(t) ? t : [t]).forEach((i) => i(ie));
}
var ct = {}, Yi = !1;
function vo(t, e) {
  if (Yi || (ct = At(ct), Yi = !0), e === void 0)
    return ct[t];
  ct[t] = e, Rn(ct[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && ct[t].init();
}
function yo() {
  return ct;
}
var pr = {};
function bo(t, e) {
  let i = typeof e != "function" ? () => e : e;
  return t instanceof Element ? mr(t, i()) : (pr[t] = i, () => {
  });
}
function wo(t) {
  return Object.entries(pr).forEach(([e, i]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), t;
}
function mr(t, e, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let r = Object.entries(e).map(([o, a]) => ({ name: o, value: a })), s = Bn(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), Ei(t, r, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var gr = {};
function _o(t, e) {
  gr[t] = e;
}
function xo(t, e) {
  return Object.entries(gr).forEach(([i, n]) => {
    Object.defineProperty(t, i, {
      get() {
        return (...r) => n.bind(e)(...r);
      },
      enumerable: !1
    });
  }), t;
}
var Eo = {
  get reactive() {
    return At;
  },
  get release() {
    return Ot;
  },
  get effect() {
    return Et;
  },
  get raw() {
    return In;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: Ts,
  dontAutoEvaluateFunctions: zn,
  disableEffectScheduling: ys,
  startObservingMutations: bi,
  stopObservingMutations: Nn,
  setReactivityEngine: bs,
  onAttributeRemoved: $n,
  onAttributesAdded: On,
  closestDataStack: yt,
  skipDuringClone: lt,
  onlyDuringClone: Qs,
  addRootSelector: Qn,
  addInitSelector: tr,
  interceptClone: ke,
  addScopeToNode: ee,
  deferMutations: Is,
  mapAttributes: Ii,
  evaluateLater: z,
  interceptInit: Hs,
  setEvaluator: $s,
  mergeProxies: $t,
  extractProp: mo,
  findClosest: Nt,
  onElRemoved: gi,
  closestRoot: Oe,
  destroyTree: Dt,
  interceptor: Ln,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ii,
  // INTERNAL
  setStyles: $e,
  // INTERNAL
  mutateDom: $,
  directive: k,
  entangle: hr,
  throttle: fr,
  debounce: dr,
  evaluate: ht,
  initTree: Q,
  nextTick: Si,
  prefixed: kt,
  prefix: Rs,
  plugin: go,
  magic: Y,
  store: vo,
  start: Us,
  clone: eo,
  // INTERNAL
  cloneNode: to,
  // INTERNAL
  bound: po,
  $data: Dn,
  watch: Tn,
  walk: bt,
  data: _o,
  bind: bo
}, ie = Eo, D = class {
  constructor(t, e, i, n) {
    this.type = t, this.value = e, this.start = i, this.end = n;
  }
}, Io = class {
  constructor(t) {
    this.input = t, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const t = this.input[this.position];
      this.isDigit(t) ? this.readNumber() : this.isAlpha(t) || t === "_" || t === "$" ? this.readIdentifierOrKeyword() : t === '"' || t === "'" ? this.readString() : t === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new D("EOF", null, this.position, this.position)), this.tokens;
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
    this.tokens.push(new D("NUMBER", parseFloat(i), t, this.position));
  }
  readIdentifierOrKeyword() {
    const t = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const e = this.input.slice(t, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(e) ? e === "true" || e === "false" ? this.tokens.push(new D("BOOLEAN", e === "true", t, this.position)) : e === "null" ? this.tokens.push(new D("NULL", null, t, this.position)) : e === "undefined" ? this.tokens.push(new D("UNDEFINED", void 0, t, this.position)) : this.tokens.push(new D("KEYWORD", e, t, this.position)) : this.tokens.push(new D("IDENTIFIER", e, t, this.position));
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
        this.position++, this.tokens.push(new D("STRING", i, t, this.position));
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
      this.position += 3, this.tokens.push(new D("OPERATOR", "===", t, this.position));
    else if (e === "!" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new D("OPERATOR", "!==", t, this.position));
    else if (e === "=" && i === "=")
      this.position += 2, this.tokens.push(new D("OPERATOR", "==", t, this.position));
    else if (e === "!" && i === "=")
      this.position += 2, this.tokens.push(new D("OPERATOR", "!=", t, this.position));
    else if (e === "<" && i === "=")
      this.position += 2, this.tokens.push(new D("OPERATOR", "<=", t, this.position));
    else if (e === ">" && i === "=")
      this.position += 2, this.tokens.push(new D("OPERATOR", ">=", t, this.position));
    else if (e === "&" && i === "&")
      this.position += 2, this.tokens.push(new D("OPERATOR", "&&", t, this.position));
    else if (e === "|" && i === "|")
      this.position += 2, this.tokens.push(new D("OPERATOR", "||", t, this.position));
    else if (e === "+" && i === "+")
      this.position += 2, this.tokens.push(new D("OPERATOR", "++", t, this.position));
    else if (e === "-" && i === "-")
      this.position += 2, this.tokens.push(new D("OPERATOR", "--", t, this.position));
    else {
      this.position++;
      const r = "()[]{},.;:?".includes(e) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new D(r, e, t, this.position));
    }
  }
}, To = class {
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
}, Co = class {
  evaluate({ node: t, scope: e = {}, context: i = null, allowGlobal: n = !1, forceBindingRootScopeToFunctions: r = !0 }) {
    switch (t.type) {
      case "Literal":
        return t.value;
      case "Identifier":
        if (t.name in e) {
          const p = e[t.name];
          return typeof p == "function" ? p.bind(e) : p;
        }
        if (n && typeof globalThis[t.name] < "u") {
          const p = globalThis[t.name];
          return typeof p == "function" ? p.bind(globalThis) : p;
        }
        throw new Error(`Undefined variable: ${t.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: t.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let o;
        if (t.computed) {
          const p = this.evaluate({ node: t.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          o = s[p];
        } else
          o = s[t.property.name];
        return typeof o == "function" ? r ? o.bind(e) : o.bind(s) : o;
      case "CallExpression":
        const a = t.arguments.map((p) => this.evaluate({ node: p, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }));
        if (t.callee.type === "MemberExpression") {
          const p = this.evaluate({ node: t.callee.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          let b;
          if (t.callee.computed) {
            const m = this.evaluate({ node: t.callee.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
            b = p[m];
          } else
            b = p[t.callee.property.name];
          if (typeof b != "function")
            throw new Error("Value is not a function");
          return b.apply(p, a);
        } else if (t.callee.type === "Identifier") {
          const p = t.callee.name;
          let b;
          if (p in e)
            b = e[p];
          else if (n && typeof globalThis[p] < "u")
            b = globalThis[p];
          else
            throw new Error(`Undefined variable: ${p}`);
          if (typeof b != "function")
            throw new Error("Value is not a function");
          const m = i !== null ? i : e;
          return b.apply(m, a);
        } else {
          const p = this.evaluate({ node: t.callee, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          if (typeof p != "function")
            throw new Error("Value is not a function");
          return p.apply(i, a);
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
          const p = t.argument.name;
          if (!(p in e))
            throw new Error(`Undefined variable: ${p}`);
          const b = e[p];
          return t.operator === "++" ? e[p] = b + 1 : t.operator === "--" && (e[p] = b - 1), t.prefix ? e[p] : b;
        } else if (t.argument.type === "MemberExpression") {
          const p = this.evaluate({ node: t.argument.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), b = t.argument.computed ? this.evaluate({ node: t.argument.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : t.argument.property.name, m = p[b];
          return t.operator === "++" ? p[b] = m + 1 : t.operator === "--" && (p[b] = m - 1), t.prefix ? p[b] : m;
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
          const p = this.evaluate({ node: t.left.object, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          if (t.left.computed) {
            const b = this.evaluate({ node: t.left.property, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
            p[b] = f;
          } else
            p[t.left.property.name] = f;
          return f;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return t.elements.map((p) => this.evaluate({ node: p, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }));
      case "ObjectExpression":
        const g = {};
        for (const p of t.properties) {
          const b = p.computed ? this.evaluate({ node: p.key, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }) : p.key.type === "Identifier" ? p.key.name : this.evaluate({ node: p.key, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r }), m = this.evaluate({ node: p.value, scope: e, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: r });
          g[b] = m;
        }
        return g;
      default:
        throw new Error(`Unknown node type: ${t.type}`);
    }
  }
};
function So(t) {
  try {
    const i = new Io(t).tokenize(), r = new To(i).parse(), s = new Co();
    return function(o = {}) {
      const { scope: a = {}, context: l = null, allowGlobal: c = !1, forceBindingRootScopeToFunctions: u = !1 } = o;
      return s.evaluate({ node: r, scope: a, context: l, allowGlobal: c, forceBindingRootScopeToFunctions: u });
    };
  } catch (e) {
    throw new Error(`CSP Parser Error: ${e.message}`);
  }
}
function Ao(t, e) {
  let i = Oo(t);
  if (typeof e == "function")
    return Un(i, e);
  let n = $o(t, e, i);
  return Mn.bind(null, t, e, n);
}
function Oo(t) {
  let e = {};
  return be(e, t), [e, ...yt(t)];
}
function $o(t, e, i) {
  return (n = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = $t([r, ...i]), l = So(e)({
      scope: o,
      allowGlobal: !0,
      forceBindingRootScopeToFunctions: !0
    });
    if (Wt && typeof l == "function") {
      let c = l.apply(l, s);
      c instanceof Promise ? c.then((u) => n(u)) : n(c);
    } else typeof l == "object" && l instanceof Promise ? l.then((c) => n(c)) : n(l);
  };
}
function ko(t, e) {
  const i = /* @__PURE__ */ Object.create(null), n = t.split(",");
  for (let r = 0; r < n.length; r++)
    i[n[r]] = !0;
  return (r) => !!i[r];
}
var No = Object.freeze({}), Do = Object.prototype.hasOwnProperty, Ne = (t, e) => Do.call(t, e), pt = Array.isArray, Vt = (t) => vr(t) === "[object Map]", Ro = (t) => typeof t == "string", $i = (t) => typeof t == "symbol", De = (t) => t !== null && typeof t == "object", Lo = Object.prototype.toString, vr = (t) => Lo.call(t), yr = (t) => vr(t).slice(8, -1), ki = (t) => Ro(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Po = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (i) => e[i] || (e[i] = t(i));
}, Mo = Po((t) => t.charAt(0).toUpperCase() + t.slice(1)), br = (t, e) => t !== e && (t === t || e === e), ri = /* @__PURE__ */ new WeakMap(), Mt = [], J, mt = Symbol("iterate"), si = Symbol("Map key iterate");
function zo(t) {
  return t && t._isEffect === !0;
}
function Fo(t, e = No) {
  zo(t) && (t = t.raw);
  const i = Ho(t, e);
  return e.lazy || i(), i;
}
function Uo(t) {
  t.active && (wr(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var Bo = 0;
function Ho(t, e) {
  const i = function() {
    if (!i.active)
      return t();
    if (!Mt.includes(i)) {
      wr(i);
      try {
        return Wo(), Mt.push(i), J = i, t();
      } finally {
        Mt.pop(), _r(), J = Mt[Mt.length - 1];
      }
    }
  };
  return i.id = Bo++, i.allowRecurse = !!e.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = t, i.deps = [], i.options = e, i;
}
function wr(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let i = 0; i < e.length; i++)
      e[i].delete(t);
    e.length = 0;
  }
}
var Tt = !0, Ni = [];
function jo() {
  Ni.push(Tt), Tt = !1;
}
function Wo() {
  Ni.push(Tt), Tt = !0;
}
function _r() {
  const t = Ni.pop();
  Tt = t === void 0 ? !0 : t;
}
function W(t, e, i) {
  if (!Tt || J === void 0)
    return;
  let n = ri.get(t);
  n || ri.set(t, n = /* @__PURE__ */ new Map());
  let r = n.get(i);
  r || n.set(i, r = /* @__PURE__ */ new Set()), r.has(J) || (r.add(J), J.deps.push(r), J.options.onTrack && J.options.onTrack({
    effect: J,
    target: t,
    type: e,
    key: i
  }));
}
function ot(t, e, i, n, r, s) {
  const o = ri.get(t);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== J || d.allowRecurse) && a.add(d);
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
        pt(t) ? ki(i) && l(o.get("length")) : (l(o.get(mt)), Vt(t) && l(o.get(si)));
        break;
      case "delete":
        pt(t) || (l(o.get(mt)), Vt(t) && l(o.get(si)));
        break;
      case "set":
        Vt(t) && l(o.get(mt));
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
var qo = /* @__PURE__ */ ko("__proto__,__v_isRef,__isVue"), xr = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter($i)), Vo = /* @__PURE__ */ Er(), Yo = /* @__PURE__ */ Er(!0), Ki = /* @__PURE__ */ Ko();
function Ko() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...i) {
      const n = O(this);
      for (let s = 0, o = this.length; s < o; s++)
        W(n, "get", s + "");
      const r = n[e](...i);
      return r === -1 || r === !1 ? n[e](...i.map(O)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...i) {
      jo();
      const n = O(this)[e].apply(this, i);
      return _r(), n;
    };
  }), t;
}
function Er(t = !1, e = !1) {
  return function(n, r, s) {
    if (r === "__v_isReactive")
      return !t;
    if (r === "__v_isReadonly")
      return t;
    if (r === "__v_raw" && s === (t ? e ? la : Sr : e ? aa : Cr).get(n))
      return n;
    const o = pt(n);
    if (!t && o && Ne(Ki, r))
      return Reflect.get(Ki, r, s);
    const a = Reflect.get(n, r, s);
    return ($i(r) ? xr.has(r) : qo(r)) || (t || W(n, "get", r), e) ? a : oi(a) ? !o || !ki(r) ? a.value : a : De(a) ? t ? Ar(a) : Pi(a) : a;
  };
}
var Jo = /* @__PURE__ */ Xo();
function Xo(t = !1) {
  return function(i, n, r, s) {
    let o = i[n];
    if (!t && (r = O(r), o = O(o), !pt(i) && oi(o) && !oi(r)))
      return o.value = r, !0;
    const a = pt(i) && ki(n) ? Number(n) < i.length : Ne(i, n), l = Reflect.set(i, n, r, s);
    return i === O(s) && (a ? br(r, o) && ot(i, "set", n, r, o) : ot(i, "add", n, r)), l;
  };
}
function Zo(t, e) {
  const i = Ne(t, e), n = t[e], r = Reflect.deleteProperty(t, e);
  return r && i && ot(t, "delete", e, void 0, n), r;
}
function Go(t, e) {
  const i = Reflect.has(t, e);
  return (!$i(e) || !xr.has(e)) && W(t, "has", e), i;
}
function Qo(t) {
  return W(t, "iterate", pt(t) ? "length" : mt), Reflect.ownKeys(t);
}
var ta = {
  get: Vo,
  set: Jo,
  deleteProperty: Zo,
  has: Go,
  ownKeys: Qo
}, ea = {
  get: Yo,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, Di = (t) => De(t) ? Pi(t) : t, Ri = (t) => De(t) ? Ar(t) : t, Li = (t) => t, Re = (t) => Reflect.getPrototypeOf(t);
function oe(t, e, i = !1, n = !1) {
  t = t.__v_raw;
  const r = O(t), s = O(e);
  e !== s && !i && W(r, "get", e), !i && W(r, "get", s);
  const { has: o } = Re(r), a = n ? Li : i ? Ri : Di;
  if (o.call(r, e))
    return a(t.get(e));
  if (o.call(r, s))
    return a(t.get(s));
  t !== r && t.get(e);
}
function ae(t, e = !1) {
  const i = this.__v_raw, n = O(i), r = O(t);
  return t !== r && !e && W(n, "has", t), !e && W(n, "has", r), t === r ? i.has(t) : i.has(t) || i.has(r);
}
function le(t, e = !1) {
  return t = t.__v_raw, !e && W(O(t), "iterate", mt), Reflect.get(t, "size", t);
}
function Ji(t) {
  t = O(t);
  const e = O(this);
  return Re(e).has.call(e, t) || (e.add(t), ot(e, "add", t, t)), this;
}
function Xi(t, e) {
  e = O(e);
  const i = O(this), { has: n, get: r } = Re(i);
  let s = n.call(i, t);
  s ? Tr(i, n, t) : (t = O(t), s = n.call(i, t));
  const o = r.call(i, t);
  return i.set(t, e), s ? br(e, o) && ot(i, "set", t, e, o) : ot(i, "add", t, e), this;
}
function Zi(t) {
  const e = O(this), { has: i, get: n } = Re(e);
  let r = i.call(e, t);
  r ? Tr(e, i, t) : (t = O(t), r = i.call(e, t));
  const s = n ? n.call(e, t) : void 0, o = e.delete(t);
  return r && ot(e, "delete", t, void 0, s), o;
}
function Gi() {
  const t = O(this), e = t.size !== 0, i = Vt(t) ? new Map(t) : new Set(t), n = t.clear();
  return e && ot(t, "clear", void 0, void 0, i), n;
}
function ce(t, e) {
  return function(n, r) {
    const s = this, o = s.__v_raw, a = O(o), l = e ? Li : t ? Ri : Di;
    return !t && W(a, "iterate", mt), o.forEach((c, u) => n.call(r, l(c), l(u), s));
  };
}
function ue(t, e, i) {
  return function(...n) {
    const r = this.__v_raw, s = O(r), o = Vt(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...n), u = i ? Li : e ? Ri : Di;
    return !e && W(s, "iterate", l ? si : mt), {
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
function it(t) {
  return function(...e) {
    {
      const i = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${Mo(t)} operation ${i}failed: target is readonly.`, O(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function ia() {
  const t = {
    get(s) {
      return oe(this, s);
    },
    get size() {
      return le(this);
    },
    has: ae,
    add: Ji,
    set: Xi,
    delete: Zi,
    clear: Gi,
    forEach: ce(!1, !1)
  }, e = {
    get(s) {
      return oe(this, s, !1, !0);
    },
    get size() {
      return le(this);
    },
    has: ae,
    add: Ji,
    set: Xi,
    delete: Zi,
    clear: Gi,
    forEach: ce(!1, !0)
  }, i = {
    get(s) {
      return oe(this, s, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(s) {
      return ae.call(this, s, !0);
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
    forEach: ce(!0, !1)
  }, n = {
    get(s) {
      return oe(this, s, !0, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(s) {
      return ae.call(this, s, !0);
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
    forEach: ce(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = ue(s, !1, !1), i[s] = ue(s, !0, !1), e[s] = ue(s, !1, !0), n[s] = ue(s, !0, !0);
  }), [
    t,
    i,
    e,
    n
  ];
}
var [na, ra, tu, eu] = /* @__PURE__ */ ia();
function Ir(t, e) {
  const i = t ? ra : na;
  return (n, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? n : Reflect.get(Ne(i, r) && r in n ? i : n, r, s);
}
var sa = {
  get: /* @__PURE__ */ Ir(!1)
}, oa = {
  get: /* @__PURE__ */ Ir(!0)
};
function Tr(t, e, i) {
  const n = O(i);
  if (n !== i && e.call(t, n)) {
    const r = yr(t);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Cr = /* @__PURE__ */ new WeakMap(), aa = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new WeakMap(), la = /* @__PURE__ */ new WeakMap();
function ca(t) {
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
function ua(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : ca(yr(t));
}
function Pi(t) {
  return t && t.__v_isReadonly ? t : Or(t, !1, ta, sa, Cr);
}
function Ar(t) {
  return Or(t, !0, ea, oa, Sr);
}
function Or(t, e, i, n, r) {
  if (!De(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = r.get(t);
  if (s)
    return s;
  const o = ua(t);
  if (o === 0)
    return t;
  const a = new Proxy(t, o === 2 ? n : i);
  return r.set(t, a), a;
}
function O(t) {
  return t && O(t.__v_raw) || t;
}
function oi(t) {
  return !!(t && t.__v_isRef === !0);
}
Y("nextTick", () => Si);
Y("dispatch", (t) => qt.bind(qt, t));
Y("watch", (t, { evaluateLater: e, cleanup: i }) => (n, r) => {
  let s = e(n), a = Tn(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  i(a);
});
Y("store", yo);
Y("data", (t) => Dn(t));
Y("root", (t) => Oe(t));
Y("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = $t(da(t))), t._x_refs_proxy));
function da(t) {
  let e = [];
  return Nt(t, (i) => {
    i._x_refs && e.push(i._x_refs);
  }), e;
}
var Be = {};
function $r(t) {
  return Be[t] || (Be[t] = 0), ++Be[t];
}
function fa(t, e) {
  return Nt(t, (i) => {
    if (i._x_ids && i._x_ids[e])
      return !0;
  });
}
function ha(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = $r(e));
}
Y("id", (t, { cleanup: e }) => (i, n = null) => {
  let r = `${i}${n ? `-${n}` : ""}`;
  return pa(t, r, e, () => {
    let s = fa(t, i), o = s ? s._x_ids[i] : $r(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
ke((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function pa(t, e, i, n) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let r = n();
  return t._x_id[e] = r, i(() => {
    delete t._x_id[e];
  }), r;
}
Y("el", (t) => t);
kr("Focus", "focus", "focus");
kr("Persist", "persist", "persist");
function kr(t, e, i) {
  Y(e, (n) => H(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
k("modelable", (t, { expression: e }, { effect: i, evaluateLater: n, cleanup: r }) => {
  let s = n(e), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = n(`${e} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let u = t._x_model.get, d = t._x_model.set, f = hr(
      {
        get() {
          return u();
        },
        set(g) {
          d(g);
        }
      },
      {
        get() {
          return o();
        },
        set(g) {
          l(g);
        }
      }
    );
    r(f);
  });
});
k("teleport", (t, { modifiers: e, expression: i }, { cleanup: n }) => {
  t.tagName.toLowerCase() !== "template" && H("x-teleport can only be used on a <template> tag", t);
  let r = Qi(i), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), ee(s, {}, t);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  $(() => {
    o(s, r, e), lt(() => {
      Q(s);
    })();
  }), t._x_teleportPutBack = () => {
    let a = Qi(i);
    $(() => {
      o(t._x_teleport, a, e);
    });
  }, n(
    () => $(() => {
      s.remove(), Dt(s);
    })
  );
});
var ma = document.createElement("div");
function Qi(t) {
  let e = lt(() => document.querySelector(t), () => ma)();
  return e || H(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var Nr = () => {
};
Nr.inline = (t, { modifiers: e }, { cleanup: i }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, i(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
k("ignore", Nr);
k("effect", lt((t, { expression: e }, { effect: i }) => {
  i(z(t, e));
}));
function ai(t, e, i, n) {
  let r = t, s = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (e = ga(e)), i.includes("camel") && (e = va(e)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (r = window), i.includes("document") && (r = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = xe(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = dr(s, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = xe(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = fr(s, c);
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
  })), (ba(e) || Dr(e)) && (s = a(s, (l, c) => {
    wa(c, i) || l(c);
  })), r.addEventListener(e, s, o), () => {
    r.removeEventListener(e, s, o);
  };
}
function ga(t) {
  return t.replace(/-/g, ".");
}
function va(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function xe(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function ya(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function ba(t) {
  return ["keydown", "keyup"].includes(t);
}
function Dr(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function wa(t, e) {
  let i = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, xe((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, xe((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && tn(t.key).includes(i[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), t[`${o}Key`])).length === r.length && (Dr(t.type) || tn(t.key).includes(i[0])));
}
function tn(t) {
  if (!t)
    return [];
  t = ya(t);
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
k("model", (t, { modifiers: e, expression: i }, { effect: n, cleanup: r }) => {
  let s = t;
  e.includes("parent") && (s = t.parentNode);
  let o = z(s, i), a;
  typeof i == "string" ? a = z(s, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = z(s, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((g) => f = g), en(f) ? f.get() : f;
  }, c = (f) => {
    let g;
    o((p) => g = p), en(g) ? g.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof i == "string" && t.type === "radio" && $(() => {
    t.hasAttribute("name") || t.setAttribute("name", i);
  });
  let u = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input", d = st ? () => {
  } : ai(t, u, e, (f) => {
    c(He(t, e, f, l()));
  });
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || Oi(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    He(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = d, r(() => t._x_removeModelListeners.default()), t.form) {
    let f = ai(t.form, "reset", [], (g) => {
      Si(() => t._x_model && t._x_model.set(He(t, e, { target: t }, l())));
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
    f === void 0 && typeof i == "string" && i.match(/\./) && (f = ""), window.fromModel = !0, $(() => or(t, "value", f)), delete window.fromModel;
  }, n(() => {
    let f = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function He(t, e, i, n) {
  return $(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Oi(t))
      if (Array.isArray(n)) {
        let r = null;
        return e.includes("number") ? r = je(i.target.value) : e.includes("boolean") ? r = ge(i.target.value) : r = i.target.value, i.target.checked ? n.includes(r) ? n : n.concat([r]) : n.filter((s) => !_a(s, r));
      } else
        return i.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return je(s);
        }) : e.includes("boolean") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return ge(s);
        }) : Array.from(i.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return ur(t) ? i.target.checked ? r = i.target.value : r = n : r = i.target.value, e.includes("number") ? je(r) : e.includes("boolean") ? ge(r) : e.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function je(t) {
  let e = t ? parseFloat(t) : null;
  return xa(e) ? e : t;
}
function _a(t, e) {
  return t == e;
}
function xa(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function en(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
k("cloak", (t) => queueMicrotask(() => $(() => t.removeAttribute(kt("cloak")))));
tr(() => `[${kt("init")}]`);
k("init", lt((t, { expression: e }, { evaluate: i }) => typeof e == "string" ? !!e.trim() && i(e, {}, !1) : i(e, {}, !1)));
k("text", (t, { expression: e }, { effect: i, evaluateLater: n }) => {
  let r = n(e);
  i(() => {
    r((s) => {
      $(() => {
        t.textContent = s;
      });
    });
  });
});
k("html", (t, { expression: e }, { effect: i, evaluateLater: n }) => {
  let r = n(e);
  i(() => {
    r((s) => {
      $(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, Q(t), delete t._x_ignoreSelf;
      });
    });
  });
});
Ii(Wn(":", qn(kt("bind:"))));
var Rr = (t, { value: e, modifiers: i, expression: n, original: r }, { effect: s, cleanup: o }) => {
  if (!e) {
    let l = {};
    wo(l), z(t, n)((u) => {
      mr(t, u, r);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return Ea(t, n);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let a = z(t, n);
  s(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), $(() => or(t, e, l, i));
  })), o(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
Rr.inline = (t, { value: e, modifiers: i, expression: n }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: n, extract: !1 });
};
k("bind", Rr);
function Ea(t, e) {
  t._x_keyExpression = e;
}
Qn(() => `[${kt("data")}]`);
k("data", (t, { expression: e }, { cleanup: i }) => {
  if (Ia(t))
    return;
  e = e === "" ? "{}" : e;
  let n = {};
  be(n, t);
  let r = {};
  xo(r, n);
  let s = ht(t, e, { scope: r });
  (s === void 0 || s === !0) && (s = {}), be(s, t);
  let o = At(s);
  Rn(o);
  let a = ee(t, o);
  o.init && ht(t, o.init), i(() => {
    o.destroy && ht(t, o.destroy), a();
  });
});
ke((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Ia(t) {
  return st ? ni ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
k("show", (t, { modifiers: e, expression: i }, { effect: n }) => {
  let r = z(t, i);
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
  }, a = () => setTimeout(o), l = ei(
    (d) => d ? o() : s(),
    (d) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  n(() => r((d) => {
    !u && d === c || (e.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
k("for", (t, { expression: e }, { effect: i, cleanup: n }) => {
  let r = Ca(e), s = z(t, r.items), o = z(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, i(() => Ta(t, r, s, o)), n(() => {
    Object.values(t._x_lookup).forEach((a) => $(
      () => {
        Dt(a), a.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function Ta(t, e, i, n) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = t;
  i((o) => {
    Sa(o) && o >= 0 && (o = Array.from(Array(o).keys(), (m) => m + 1)), o === void 0 && (o = []);
    let a = t._x_lookup, l = t._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([m, v]) => {
        let h = nn(e, v, m, o);
        n((_) => {
          u.includes(_) && H("Duplicate key on x-for", t), u.push(_);
        }, { scope: { index: m, ...h } }), c.push(h);
      });
    else
      for (let m = 0; m < o.length; m++) {
        let v = nn(e, o[m], m, o);
        n((h) => {
          u.includes(h) && H("Duplicate key on x-for", t), u.push(h);
        }, { scope: { index: m, ...v } }), c.push(v);
      }
    let d = [], f = [], g = [], p = [];
    for (let m = 0; m < l.length; m++) {
      let v = l[m];
      u.indexOf(v) === -1 && g.push(v);
    }
    l = l.filter((m) => !g.includes(m));
    let b = "template";
    for (let m = 0; m < u.length; m++) {
      let v = u[m], h = l.indexOf(v);
      if (h === -1)
        l.splice(m, 0, v), d.push([b, m]);
      else if (h !== m) {
        let _ = l.splice(m, 1)[0], E = l.splice(h - 1, 1)[0];
        l.splice(m, 0, E), l.splice(h, 0, _), f.push([_, E]);
      } else
        p.push(v);
      b = v;
    }
    for (let m = 0; m < g.length; m++) {
      let v = g[m];
      v in a && ($(() => {
        Dt(a[v]), a[v].remove();
      }), delete a[v]);
    }
    for (let m = 0; m < f.length; m++) {
      let [v, h] = f[m], _ = a[v], E = a[h], x = document.createElement("div");
      $(() => {
        E || H('x-for ":key" is undefined or invalid', s, h, a), E.after(x), _.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), x.before(_), _._x_currentIfEl && _.after(_._x_currentIfEl), x.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let m = 0; m < d.length; m++) {
      let [v, h] = d[m], _ = v === "template" ? s : a[v];
      _._x_currentIfEl && (_ = _._x_currentIfEl);
      let E = c[h], x = u[h], y = document.importNode(s.content, !0).firstElementChild, w = At(E);
      ee(y, w, s), y._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([T, C]) => {
          w[T] = C;
        });
      }, $(() => {
        _.after(y), lt(() => Q(y))();
      }), typeof x == "object" && H("x-for key cannot be an object, it must be a string or an integer", s), a[x] = y;
    }
    for (let m = 0; m < p.length; m++)
      a[p[m]]._x_refreshXForScope(c[u.indexOf(p[m])]);
    s._x_prevKeys = u;
  });
}
function Ca(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = t.match(n);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(i, "").trim(), a = o.match(e);
  return a ? (s.item = o.replace(e, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function nn(t, e, i, n) {
  let r = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = e[a];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = e[o];
  }) : r[t.item] = e, t.index && (r[t.index] = i), t.collection && (r[t.collection] = n), r;
}
function Sa(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Lr() {
}
Lr.inline = (t, { expression: e }, { cleanup: i }) => {
  let n = Oe(t);
  n._x_refs || (n._x_refs = {}), n._x_refs[e] = t, i(() => delete n._x_refs[e]);
};
k("ref", Lr);
k("if", (t, { expression: e }, { effect: i, cleanup: n }) => {
  t.tagName.toLowerCase() !== "template" && H("x-if can only be used on a <template> tag", t);
  let r = z(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let a = t.content.cloneNode(!0).firstElementChild;
    return ee(a, {}, t), $(() => {
      t.after(a), lt(() => Q(a))();
    }), t._x_currentIfEl = a, t._x_undoIf = () => {
      $(() => {
        Dt(a), a.remove();
      }), delete t._x_currentIfEl;
    }, a;
  }, o = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  i(() => r((a) => {
    a ? s() : o();
  })), n(() => t._x_undoIf && t._x_undoIf());
});
k("id", (t, { expression: e }, { evaluate: i }) => {
  i(e).forEach((r) => ha(t, r));
});
ke((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Ii(Wn("@", qn(kt("on:"))));
k("on", lt((t, { value: e, modifiers: i, expression: n }, { cleanup: r }) => {
  let s = n ? z(t, n) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let o = ai(t, e, i, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Le("Collapse", "collapse", "collapse");
Le("Intersect", "intersect", "intersect");
Le("Focus", "trap", "focus");
Le("Mask", "mask", "mask");
function Le(t, e, i) {
  k(e, (n) => H(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
ie.setEvaluator(Ao);
ie.setReactivityEngine({ reactive: Pi, effect: Fo, release: Uo, raw: O });
var Aa = ie, Pr = Aa;
function Oa(t) {
  t.directive("collapse", e), e.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function e(i, { modifiers: n }) {
    let r = rn(n, "duration", 250) / 1e3, s = rn(n, "min", 0), o = !n.includes("min");
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
function rn(t, e, i) {
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
var $a = Oa;
function ka(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: i, expression: n, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(n), l = {
      rootMargin: Ra(r),
      threshold: Na(r)
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
function Na(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function Da(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Ra(t) {
  const e = "margin", i = "0px 0px 0px 0px", n = t.indexOf(e);
  if (n === -1)
    return i;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Da(t[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : i;
}
var La = ka, Mr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Ee = /* @__PURE__ */ Mr.join(","), zr = typeof Element > "u", wt = zr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, li = !zr && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, Fr = function(e, i, n) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(Ee));
  return i && wt.call(e, Ee) && r.unshift(e), r = r.filter(n), r;
}, Ur = function t(e, i, n) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, n);
      n.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = wt.call(o, Ee);
      u && n.filter(o) && (i || !e.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), f = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && f) {
        var g = t(d === !0 ? o.children : d.children, !0, n);
        n.flatten ? r.push.apply(r, g) : r.push({
          scope: o,
          candidates: g
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Br = function(e, i) {
  return e.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Pa = function(e, i) {
  return e.tabIndex === i.tabIndex ? e.documentOrder - i.documentOrder : e.tabIndex - i.tabIndex;
}, Hr = function(e) {
  return e.tagName === "INPUT";
}, Ma = function(e) {
  return Hr(e) && e.type === "hidden";
}, za = function(e) {
  var i = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Fa = function(e, i) {
  for (var n = 0; n < e.length; n++)
    if (e[n].checked && e[n].form === i)
      return e[n];
}, Ua = function(e) {
  if (!e.name)
    return !0;
  var i = e.form || li(e), n = function(a) {
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
  var s = Fa(r, e.form);
  return !s || s === e;
}, Ba = function(e) {
  return Hr(e) && e.type === "radio";
}, Ha = function(e) {
  return Ba(e) && !Ua(e);
}, sn = function(e) {
  var i = e.getBoundingClientRect(), n = i.width, r = i.height;
  return n === 0 && r === 0;
}, ja = function(e, i) {
  var n = i.displayCheck, r = i.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = wt.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (wt.call(o, "details:not([open]) *"))
    return !0;
  var a = li(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var u = e.parentElement, d = li(e);
        if (u && !u.shadowRoot && r(u) === !0)
          return sn(e);
        e.assignedSlot ? e = e.assignedSlot : !u && d !== e.ownerDocument ? e = d.host : e = u;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (n === "non-zero-area")
    return sn(e);
  return !1;
}, Wa = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var i = e.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var r = i.children.item(n);
          if (r.tagName === "LEGEND")
            return wt.call(i, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, Ie = function(e, i) {
  return !(i.disabled || Ma(i) || ja(i, e) || // For a details element with a summary, the summary element gets the focus
  za(i) || Wa(i));
}, ci = function(e, i) {
  return !(Ha(i) || Br(i) < 0 || !Ie(e, i));
}, qa = function(e) {
  var i = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Va = function t(e) {
  var i = [], n = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Br(a, o), c = o ? t(r.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), n.sort(Pa).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(i);
}, Ya = function(e, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Ur([e], i.includeContainer, {
    filter: ci.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: qa
  }) : n = Fr(e, i.includeContainer, ci.bind(null, i)), Va(n);
}, jr = function(e, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Ur([e], i.includeContainer, {
    filter: Ie.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = Fr(e, i.includeContainer, Ie.bind(null, i)), n;
}, de = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return wt.call(e, Ee) === !1 ? !1 : ci(i, e);
}, Ka = /* @__PURE__ */ Mr.concat("iframe").join(","), ve = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return wt.call(e, Ka) === !1 ? !1 : Ie(i, e);
};
function on(t, e) {
  var i = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function an(t) {
  for (var e = 1; e < arguments.length; e++) {
    var i = arguments[e] != null ? arguments[e] : {};
    e % 2 ? on(Object(i), !0).forEach(function(n) {
      Ja(t, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : on(Object(i)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return t;
}
function Ja(t, e, i) {
  return e in t ? Object.defineProperty(t, e, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = i, t;
}
var ln = /* @__PURE__ */ function() {
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
}(), Xa = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Za = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, Ga = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, cn = function(e) {
  return setTimeout(e, 0);
}, un = function(e, i) {
  var n = -1;
  return e.every(function(r, s) {
    return i(r) ? (n = s, !1) : !0;
  }), n;
}, zt = function(e) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, n) : e;
}, fe = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Qa = function(e, i) {
  var n = i?.document || document, r = an({
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
  }, o, a = function(y, w, I) {
    return y && y[w] !== void 0 ? y[w] : r[I || w];
  }, l = function(y) {
    return s.containerGroups.findIndex(function(w) {
      var I = w.container, T = w.tabbableNodes;
      return I.contains(y) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(C) {
        return C === y;
      });
    });
  }, c = function(y) {
    var w = r[y];
    if (typeof w == "function") {
      for (var I = arguments.length, T = new Array(I > 1 ? I - 1 : 0), C = 1; C < I; C++)
        T[C - 1] = arguments[C];
      w = w.apply(void 0, T);
    }
    if (w === !0 && (w = void 0), !w) {
      if (w === void 0 || w === !1)
        return w;
      throw new Error("`".concat(y, "` was specified but was not a node, or did not return a node"));
    }
    var S = w;
    if (typeof w == "string" && (S = n.querySelector(w), !S))
      throw new Error("`".concat(y, "` as selector refers to no known node"));
    return S;
  }, u = function() {
    var y = c("initialFocus");
    if (y === !1)
      return !1;
    if (y === void 0)
      if (l(n.activeElement) >= 0)
        y = n.activeElement;
      else {
        var w = s.tabbableGroups[0], I = w && w.firstTabbableNode;
        y = I || c("fallbackFocus");
      }
    if (!y)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return y;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(y) {
      var w = Ya(y, r.tabbableOptions), I = jr(y, r.tabbableOptions);
      return {
        container: y,
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
          var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = I.findIndex(function(L) {
            return L === C;
          });
          if (!(N < 0))
            return S ? I.slice(N + 1).find(function(L) {
              return de(L, r.tabbableOptions);
            }) : I.slice(0, N).reverse().find(function(L) {
              return de(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(y) {
      return y.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function x(y) {
    if (y !== !1 && y !== n.activeElement) {
      if (!y || !y.focus) {
        x(u());
        return;
      }
      y.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = y, Xa(y) && y.select();
    }
  }, g = function(y) {
    var w = c("setReturnFocus", y);
    return w || (w === !1 ? !1 : y);
  }, p = function(y) {
    var w = fe(y);
    if (!(l(w) >= 0)) {
      if (zt(r.clickOutsideDeactivates, y)) {
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
          returnFocus: r.returnFocusOnDeactivate && !ve(w, r.tabbableOptions)
        });
        return;
      }
      zt(r.allowOutsideClick, y) || y.preventDefault();
    }
  }, b = function(y) {
    var w = fe(y), I = l(w) >= 0;
    I || w instanceof Document ? I && (s.mostRecentlyFocusedNode = w) : (y.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, m = function(y) {
    var w = fe(y);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(w), C = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        y.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (y.shiftKey) {
        var S = un(s.tabbableGroups, function(M) {
          var B = M.firstTabbableNode;
          return w === B;
        });
        if (S < 0 && (C.container === w || ve(w, r.tabbableOptions) && !de(w, r.tabbableOptions) && !C.nextTabbableNode(w, !1)) && (S = T), S >= 0) {
          var N = S === 0 ? s.tabbableGroups.length - 1 : S - 1, L = s.tabbableGroups[N];
          I = L.lastTabbableNode;
        }
      } else {
        var R = un(s.tabbableGroups, function(M) {
          var B = M.lastTabbableNode;
          return w === B;
        });
        if (R < 0 && (C.container === w || ve(w, r.tabbableOptions) && !de(w, r.tabbableOptions) && !C.nextTabbableNode(w)) && (R = T), R >= 0) {
          var P = R === s.tabbableGroups.length - 1 ? 0 : R + 1, j = s.tabbableGroups[P];
          I = j.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (y.preventDefault(), f(I));
  }, v = function(y) {
    if (Za(y) && zt(r.escapeDeactivates, y) !== !1) {
      y.preventDefault(), o.deactivate();
      return;
    }
    if (Ga(y)) {
      m(y);
      return;
    }
  }, h = function(y) {
    var w = fe(y);
    l(w) >= 0 || zt(r.clickOutsideDeactivates, y) || zt(r.allowOutsideClick, y) || (y.preventDefault(), y.stopImmediatePropagation());
  }, _ = function() {
    if (s.active)
      return ln.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? cn(function() {
        f(u());
      }) : f(u()), n.addEventListener("focusin", b, !0), n.addEventListener("mousedown", p, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", p, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", h, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", v, {
        capture: !0,
        passive: !1
      }), o;
  }, E = function() {
    if (s.active)
      return n.removeEventListener("focusin", b, !0), n.removeEventListener("mousedown", p, !0), n.removeEventListener("touchstart", p, !0), n.removeEventListener("click", h, !0), n.removeEventListener("keydown", v, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(y) {
      if (s.active)
        return this;
      var w = a(y, "onActivate"), I = a(y, "onPostActivate"), T = a(y, "checkCanFocusTrap");
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, w && w();
      var C = function() {
        T && d(), _(), I && I();
      };
      return T ? (T(s.containers.concat()).then(C, C), this) : (C(), this);
    },
    deactivate: function(y) {
      if (!s.active)
        return this;
      var w = an({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, y);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, ln.deactivateTrap(o);
      var I = a(w, "onDeactivate"), T = a(w, "onPostDeactivate"), C = a(w, "checkCanReturnFocus"), S = a(w, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var N = function() {
        cn(function() {
          S && f(g(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return S && C ? (C(g(s.nodeFocusedBeforeActivation)).then(N, N), this) : (N(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, E(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), _(), this);
    },
    updateContainerElements: function(y) {
      var w = [].concat(y).filter(Boolean);
      return s.containers = w.map(function(I) {
        return typeof I == "string" ? n.querySelector(I) : I;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(e), o;
};
function tl(t) {
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
        return ve(s);
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
        return Array.isArray(r) ? r : jr(r, { displayCheck: "none" });
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
        let m = n.querySelector("[autofocus]");
        m && (d.initialFocus = m);
      }
      s.includes("inert") && (d.onPostActivate = () => {
        t.nextTick(() => {
          f = dn(n);
        });
      });
      let g = Qa(n, d), p = () => {
      };
      const b = () => {
        f(), f = () => {
        }, p(), p = () => {
        }, g.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((m) => {
        u !== m && (m && !u && (s.includes("noscroll") && (p = el()), setTimeout(() => {
          g.activate();
        }, 15)), !m && u && b(), u = !!m);
      })), l(b);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && dn(n);
    }
  ));
}
function dn(t) {
  let e = [];
  return Wr(t, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), e.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Wr(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((i) => {
    i.isSameNode(t) ? Wr(t.parentNode, e) : e(i);
  });
}
function el() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var il = tl;
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
function nl() {
  return !0;
}
function rl({ component: t, argument: e }) {
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
function sl() {
  return new Promise((t) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(t) : setTimeout(t, 200);
  });
}
function ol({ argument: t }) {
  return new Promise((e) => {
    if (!t)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), e();
    const i = window.matchMedia(`(${t})`);
    i.matches ? e() : i.addEventListener("change", e, { once: !0 });
  });
}
function al({ component: t, argument: e }) {
  return new Promise((i) => {
    const n = e || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), i());
    }, { rootMargin: n });
    r.observe(t.el);
  });
}
var fn = {
  eager: nl,
  event: rl,
  idle: sl,
  media: ol,
  visible: al
};
async function ll(t) {
  const e = cl(t.strategy);
  await ui(t, e);
}
async function ui(t, e) {
  if (e.type === "expression") {
    if (e.operator === "&&")
      return Promise.all(
        e.parameters.map((i) => ui(t, i))
      );
    if (e.operator === "||")
      return Promise.any(
        e.parameters.map((i) => ui(t, i))
      );
  }
  return fn[e.method] ? fn[e.method]({
    component: t,
    argument: e.argument
  }) : !1;
}
function cl(t) {
  const e = ul(t);
  let i = qr(e);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function ul(t) {
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
function qr(t) {
  let e = hn(t);
  for (; t.length > 0 && (t[0].value === "&&" || t[0].value === "|" || t[0].value === "||"); ) {
    const i = t.shift().value, n = hn(t);
    e.type === "expression" && e.operator === i ? e.parameters.push(n) : e = {
      type: "expression",
      operator: i,
      parameters: [e, n]
    };
  }
  return e;
}
function hn(t) {
  if (t[0].value === "(") {
    t.shift();
    const e = qr(t);
    return t[0].value === ")" && t.shift(), e;
  } else
    return t.shift();
}
function dl(t) {
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
        v(_)
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
      await ll({
        name: _,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(_), h.isConnected && (p(h), h._x_async = "loaded"));
    })();
  };
  u.inline = c, t.directive(e, u).before("ignore");
  function d(h) {
    const _ = m(h.getAttribute(t.prefixed("data"))), E = h.getAttribute(t.prefixed(e)) || r.defaultStrategy, x = h.getAttribute(i);
    return x && t.asyncUrl(_, x), {
      name: _,
      strategy: E
    };
  }
  async function f(h) {
    if (h.startsWith("_x_async_") || (b(h), !o[h] || o[h].loaded)) return;
    const _ = await g(h);
    t.data(h, _), o[h].loaded = !0;
  }
  async function g(h) {
    if (!o[h]) return;
    const _ = await o[h].download(h);
    return typeof _ == "function" ? _ : _[h] || _.default || Object.values(_)[0] || !1;
  }
  function p(h) {
    t.destroyTree(h), h._x_ignore = !1, h.removeAttribute(n), !h.closest(`[${n}]`) && t.initTree(h);
  }
  function b(h) {
    if (!(!s || o[h])) {
      if (typeof s == "function") {
        t.asyncData(h, s);
        return;
      }
      t.asyncUrl(h, s.replaceAll("[name]", h));
    }
  }
  function m(h) {
    return (h || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function v(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function fl(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function hl(t, e) {
  for (var i = 0; i < e.length; i++) {
    var n = e[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
  }
}
function pl(t, e, i) {
  return e && hl(t.prototype, e), t;
}
var ml = Object.defineProperty, tt = function(t, e) {
  return ml(t, "name", { value: e, configurable: !0 });
}, gl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, vl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, yl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, bl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, wl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, _l = tt(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Ft = tt(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), A = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, nt = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, pn = { OUTLINE: "outline", FILLED: "filled" }, We = { FADE: "fade", SLIDE: "slide" }, Ut = { CLOSE: Ft(gl), SUCCESS: Ft(bl), ERROR: Ft(vl), WARNING: Ft(wl), INFO: Ft(yl) }, mn = tt(function(t) {
  t.wrapper.classList.add(A.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(A.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), gn = tt(function(t) {
  t.wrapper.classList.remove(A.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), xl = tt(function(t) {
  t.wrapper.classList.add(A.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(A.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), El = tt(function(t) {
  t.wrapper.classList.remove(A.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Vr = function() {
  function t(e) {
    var i = this;
    fl(this, t), this.notifyOut = tt(function(M) {
      M(i);
    }, "notifyOut");
    var n = e.notificationsGap, r = n === void 0 ? 20 : n, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, u = c === void 0 ? We.FADE : c, d = e.type, f = d === void 0 ? "outline" : d, g = e.title, p = e.text, b = e.showIcon, m = b === void 0 ? !0 : b, v = e.customIcon, h = v === void 0 ? "" : v, _ = e.customClass, E = _ === void 0 ? "" : _, x = e.speed, y = x === void 0 ? 500 : x, w = e.showCloseButton, I = w === void 0 ? !0 : w, T = e.autoclose, C = T === void 0 ? !0 : T, S = e.autotimeout, N = S === void 0 ? 3e3 : S, L = e.position, R = L === void 0 ? "right top" : L, P = e.customWrapper, j = P === void 0 ? "" : P;
    if (this.customWrapper = j, this.status = l, this.title = g, this.text = p, this.showIcon = m, this.customIcon = h, this.customClass = E, this.speed = y, this.effect = u, this.showCloseButton = I, this.autoclose = C, this.autotimeout = N, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = R, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return pl(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(A.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(A.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](A.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](A.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](A.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](A.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](A.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](A.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](A.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(A.NOTIFY_CLOSE), n.innerHTML = Ut.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = _l(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(A.NOTIFY), this.type) {
      case pn.OUTLINE:
        this.wrapper.classList.add(A.NOTIFY_OUTLINE);
        break;
      case pn.FILLED:
        this.wrapper.classList.add(A.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(A.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case nt.SUCCESS:
        this.wrapper.classList.add(A.NOTIFY_SUCCESS);
        break;
      case nt.ERROR:
        this.wrapper.classList.add(A.NOTIFY_ERROR);
        break;
      case nt.WARNING:
        this.wrapper.classList.add(A.NOTIFY_WARNING);
        break;
      case nt.INFO:
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
    var i = tt(function(r) {
      switch (r) {
        case nt.SUCCESS:
          return Ut.SUCCESS;
        case nt.ERROR:
          return Ut.ERROR;
        case nt.WARNING:
          return Ut.WARNING;
        case nt.INFO:
          return Ut.INFO;
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
      case We.FADE:
        this.selectedNotifyInEffect = mn, this.selectedNotifyOutEffect = gn;
        break;
      case We.SLIDE:
        this.selectedNotifyInEffect = xl, this.selectedNotifyOutEffect = El;
        break;
      default:
        this.selectedNotifyInEffect = mn, this.selectedNotifyOutEffect = gn;
    }
  } }]), t;
}();
tt(Vr, "Notify");
var Yr = Vr;
globalThis.Notify = Yr;
const Kr = ["success", "error", "warning", "info"], Jr = [
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
], Xr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Bt(t = {}) {
  const e = {
    ...Xr,
    ...t
  };
  Kr.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), Jr.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new Yr(e);
}
const Il = {
  custom: Bt,
  success(t, e = "Success", i = {}) {
    Bt({
      status: "success",
      title: e,
      text: t,
      ...i
    });
  },
  error(t, e = "Error", i = {}) {
    Bt({
      status: "error",
      title: e,
      text: t,
      ...i
    });
  },
  warning(t, e = "Warning", i = {}) {
    Bt({
      status: "warning",
      title: e,
      text: t,
      ...i
    });
  },
  info(t, e = "Info", i = {}) {
    Bt({
      status: "info",
      title: e,
      text: t,
      ...i
    });
  },
  setDefaults(t = {}) {
    Object.assign(Xr, t);
  },
  get allowedStatuses() {
    return [...Kr];
  },
  get allowedPositions() {
    return [...Jr];
  }
}, di = function() {
}, Kt = {}, Te = {}, Jt = {};
function Tl(t, e) {
  t = Array.isArray(t) ? t : [t];
  const i = [];
  let n = t.length, r = n, s, o, a, l;
  for (s = function(c, u) {
    u.length && i.push(c), r--, r || e(i);
  }; n--; ) {
    if (o = t[n], a = Te[o], a) {
      s(o, a);
      continue;
    }
    l = Jt[o] = Jt[o] || [], l.push(s);
  }
}
function Zr(t, e) {
  if (!t) return;
  const i = Jt[t];
  if (Te[t] = e, !!i)
    for (; i.length; )
      i[0](t, e), i.splice(0, 1);
}
function fi(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || di)(e) : (t.success || di)(t);
}
function Cl(t, e, i, n, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Gr(e, n, r, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(e, l, t.defaultPrevented);
}
function Gr(t, e, i, n) {
  const r = document, s = i.async, o = (i.numRetries || 0) + 1, a = i.before || di, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
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
  const g = function(p) {
    Cl(p, t, f, e, i, n, o, u);
  };
  f.addEventListener("load", g, { once: !0 }), f.addEventListener("error", g, { once: !0 }), a(t, f) !== !1 && r.head.appendChild(f);
}
function Sl(t, e, i) {
  t = Array.isArray(t) ? t : [t];
  let n = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    n--, n || e(r);
  }
  for (let o = 0; o < t.length; o++)
    Gr(t[o], s, i);
}
function rt(t, e, i) {
  let n, r;
  if (e && typeof e == "string" && e.trim && (n = e.trim()), r = (n ? i : e) || {}, n) {
    if (n in Kt)
      throw "LoadJS";
    Kt[n] = !0;
  }
  function s(o, a) {
    Sl(t, function(l) {
      fi(r, l), o && fi({ success: o, error: a }, l), Zr(n, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
rt.ready = function(e, i) {
  return Tl(e, function(n) {
    fi(i, n);
  }), rt;
};
rt.done = function(e) {
  Zr(e, []);
};
rt.reset = function() {
  Object.keys(Kt).forEach((e) => delete Kt[e]), Object.keys(Te).forEach((e) => delete Te[e]), Object.keys(Jt).forEach((e) => delete Jt[e]);
};
rt.isDefined = function(e) {
  return e in Kt;
};
function Al(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (t instanceof Element) {
    const e = Ol(t) || t;
    let i = Alpine.$data(e);
    if (i === void 0) {
      const n = e.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && vn("element", e), i;
  }
  if (typeof t == "string") {
    const e = t.trim();
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${ts(e)}"]`;
    let n = null;
    const r = document.getElementById(e);
    if (r && (n = r.matches(i) ? r : r.querySelector(i)), n || (n = Qr(e)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${e}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(n);
    return s === void 0 && vn(`data-alpine-root="${e}"`, n), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Ol(t) {
  if (!(t instanceof Element)) return null;
  const e = t.tagName?.toLowerCase?.() === "rz-proxy", i = t.getAttribute?.("data-for");
  if (e || i) {
    const n = i || "";
    if (!n) return t;
    const r = Qr(n);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return t;
}
function Qr(t) {
  const e = `[data-alpine-root="${ts(t)}"]`, i = document.querySelectorAll(e);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(t) || null;
}
function ts(t) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(t);
  } catch {
  }
  return String(t).replace(/"/g, '\\"');
}
function vn(t, e) {
  const i = `${e.tagName?.toLowerCase?.() || "node"}${e.id ? "#" + e.id : ""}${e.classList?.length ? "." + Array.from(e.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${t} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function $l(t) {
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
function kl(t) {
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
function Nl(t) {
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
function Dl(t) {
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
function Rl(t) {
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
function Ll(t, e) {
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
function Pl(t) {
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
function Ml(t, e) {
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
function zl(t, e) {
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
function Fl(t) {
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
function Ul(t, e) {
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
function Bl(t, e) {
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
function Hl(t) {
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
const Ct = Math.min, gt = Math.max, Ce = Math.round, he = Math.floor, X = (t) => ({
  x: t,
  y: t
}), jl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Wl = {
  start: "end",
  end: "start"
};
function hi(t, e, i) {
  return gt(t, Ct(e, i));
}
function ne(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function _t(t) {
  return t.split("-")[0];
}
function re(t) {
  return t.split("-")[1];
}
function es(t) {
  return t === "x" ? "y" : "x";
}
function Mi(t) {
  return t === "y" ? "height" : "width";
}
function vt(t) {
  return ["top", "bottom"].includes(_t(t)) ? "y" : "x";
}
function zi(t) {
  return es(vt(t));
}
function ql(t, e, i) {
  i === void 0 && (i = !1);
  const n = re(t), r = zi(t), s = Mi(r);
  let o = r === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = Se(o)), [o, Se(o)];
}
function Vl(t) {
  const e = Se(t);
  return [pi(t), e, pi(e)];
}
function pi(t) {
  return t.replace(/start|end/g, (e) => Wl[e]);
}
function Yl(t, e, i) {
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
function Kl(t, e, i, n) {
  const r = re(t);
  let s = Yl(_t(t), i === "start", n);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(pi)))), s;
}
function Se(t) {
  return t.replace(/left|right|bottom|top/g, (e) => jl[e]);
}
function Jl(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function is(t) {
  return typeof t != "number" ? Jl(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function Ae(t) {
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
function yn(t, e, i) {
  let {
    reference: n,
    floating: r
  } = t;
  const s = vt(e), o = zi(e), a = Mi(o), l = _t(e), c = s === "y", u = n.x + n.width / 2 - r.width / 2, d = n.y + n.height / 2 - r.height / 2, f = n[a] / 2 - r[a] / 2;
  let g;
  switch (l) {
    case "top":
      g = {
        x: u,
        y: n.y - r.height
      };
      break;
    case "bottom":
      g = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      g = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      g = {
        x: n.x - r.width,
        y: d
      };
      break;
    default:
      g = {
        x: n.x,
        y: n.y
      };
  }
  switch (re(e)) {
    case "start":
      g[o] -= f * (i && c ? -1 : 1);
      break;
    case "end":
      g[o] += f * (i && c ? -1 : 1);
      break;
  }
  return g;
}
const Xl = async (t, e, i) => {
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
  } = yn(c, n, l), f = n, g = {}, p = 0;
  for (let b = 0; b < a.length; b++) {
    const {
      name: m,
      fn: v
    } = a[b], {
      x: h,
      y: _,
      data: E,
      reset: x
    } = await v({
      x: u,
      y: d,
      initialPlacement: n,
      placement: f,
      strategy: r,
      middlewareData: g,
      rects: c,
      platform: o,
      elements: {
        reference: t,
        floating: e
      }
    });
    u = h ?? u, d = _ ?? d, g = {
      ...g,
      [m]: {
        ...g[m],
        ...E
      }
    }, x && p <= 50 && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (c = x.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : x.rects), {
      x: u,
      y: d
    } = yn(c, f, l)), b = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: g
  };
};
async function ns(t, e) {
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
    padding: g = 0
  } = ne(e, t), p = is(g), m = a[f ? d === "floating" ? "reference" : "floating" : d], v = Ae(await s.getClippingRect({
    element: (i = await (s.isElement == null ? void 0 : s.isElement(m))) == null || i ? m : m.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
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
  }, x = Ae(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: h,
    offsetParent: _,
    strategy: l
  }) : h);
  return {
    top: (v.top - x.top + p.top) / E.y,
    bottom: (x.bottom - v.bottom + p.bottom) / E.y,
    left: (v.left - x.left + p.left) / E.x,
    right: (x.right - v.right + p.right) / E.x
  };
}
const Zl = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: i,
      y: n,
      placement: r,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = ne(t, e) || {};
    if (c == null)
      return {};
    const d = is(u), f = {
      x: i,
      y: n
    }, g = zi(r), p = Mi(g), b = await o.getDimensions(c), m = g === "y", v = m ? "top" : "left", h = m ? "bottom" : "right", _ = m ? "clientHeight" : "clientWidth", E = s.reference[p] + s.reference[g] - f[g] - s.floating[p], x = f[g] - s.reference[g], y = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let w = y ? y[_] : 0;
    (!w || !await (o.isElement == null ? void 0 : o.isElement(y))) && (w = a.floating[_] || s.floating[p]);
    const I = E / 2 - x / 2, T = w / 2 - b[p] / 2 - 1, C = Ct(d[v], T), S = Ct(d[h], T), N = C, L = w - b[p] - S, R = w / 2 - b[p] / 2 + I, P = hi(N, R, L), j = !l.arrow && re(r) != null && R !== P && s.reference[p] / 2 - (R < N ? C : S) - b[p] / 2 < 0, M = j ? R < N ? R - N : R - L : 0;
    return {
      [g]: f[g] + M,
      data: {
        [g]: P,
        centerOffset: R - P - M,
        ...j && {
          alignmentOffset: M
        }
      },
      reset: j
    };
  }
}), Gl = function(t) {
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
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: b = !0,
        ...m
      } = ne(t, e);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const v = _t(r), h = vt(a), _ = _t(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), x = f || (_ || !b ? [Se(a)] : Vl(a)), y = p !== "none";
      !f && y && x.push(...Kl(a, b, p, E));
      const w = [a, ...x], I = await ns(e, m), T = [];
      let C = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && T.push(I[v]), d) {
        const P = ql(r, o, E);
        T.push(I[P[0]], I[P[1]]);
      }
      if (C = [...C, {
        placement: r,
        overflows: T
      }], !T.every((P) => P <= 0)) {
        var S, N;
        const P = (((S = s.flip) == null ? void 0 : S.index) || 0) + 1, j = w[P];
        if (j) {
          var L;
          const B = d === "alignment" ? h !== vt(j) : !1, K = ((L = C[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!B || K)
            return {
              data: {
                index: P,
                overflows: C
              },
              reset: {
                placement: j
              }
            };
        }
        let M = (N = C.filter((B) => B.overflows[0] <= 0).sort((B, K) => B.overflows[1] - K.overflows[1])[0]) == null ? void 0 : N.placement;
        if (!M)
          switch (g) {
            case "bestFit": {
              var R;
              const B = (R = C.filter((K) => {
                if (y) {
                  const et = vt(K.placement);
                  return et === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  et === "y";
                }
                return !0;
              }).map((K) => [K.placement, K.overflows.filter((et) => et > 0).reduce((et, fs) => et + fs, 0)]).sort((K, et) => K[1] - et[1])[0]) == null ? void 0 : R[0];
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
async function Ql(t, e) {
  const {
    placement: i,
    platform: n,
    elements: r
  } = t, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), o = _t(i), a = re(i), l = vt(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = ne(e, t);
  let {
    mainAxis: f,
    crossAxis: g,
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
  return a && typeof p == "number" && (g = a === "end" ? p * -1 : p), l ? {
    x: g * u,
    y: f * c
  } : {
    x: f * c,
    y: g * u
  };
}
const tc = function(t) {
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
      } = e, l = await Ql(e, t);
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
}, ec = function(t) {
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
          fn: (m) => {
            let {
              x: v,
              y: h
            } = m;
            return {
              x: v,
              y: h
            };
          }
        },
        ...l
      } = ne(t, e), c = {
        x: i,
        y: n
      }, u = await ns(e, l), d = vt(_t(r)), f = es(d);
      let g = c[f], p = c[d];
      if (s) {
        const m = f === "y" ? "top" : "left", v = f === "y" ? "bottom" : "right", h = g + u[m], _ = g - u[v];
        g = hi(h, g, _);
      }
      if (o) {
        const m = d === "y" ? "top" : "left", v = d === "y" ? "bottom" : "right", h = p + u[m], _ = p - u[v];
        p = hi(h, p, _);
      }
      const b = a.fn({
        ...e,
        [f]: g,
        [d]: p
      });
      return {
        ...b,
        data: {
          x: b.x - i,
          y: b.y - n,
          enabled: {
            [f]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Pe() {
  return typeof window < "u";
}
function Rt(t) {
  return rs(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function U(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function G(t) {
  var e;
  return (e = (rs(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function rs(t) {
  return Pe() ? t instanceof Node || t instanceof U(t).Node : !1;
}
function q(t) {
  return Pe() ? t instanceof Element || t instanceof U(t).Element : !1;
}
function Z(t) {
  return Pe() ? t instanceof HTMLElement || t instanceof U(t).HTMLElement : !1;
}
function bn(t) {
  return !Pe() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof U(t).ShadowRoot;
}
function se(t) {
  const {
    overflow: e,
    overflowX: i,
    overflowY: n,
    display: r
  } = V(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + n + i) && !["inline", "contents"].includes(r);
}
function ic(t) {
  return ["table", "td", "th"].includes(Rt(t));
}
function Me(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function Fi(t) {
  const e = Ui(), i = q(t) ? V(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !e && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !e && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function nc(t) {
  let e = at(t);
  for (; Z(e) && !St(e); ) {
    if (Fi(e))
      return e;
    if (Me(e))
      return null;
    e = at(e);
  }
  return null;
}
function Ui() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function St(t) {
  return ["html", "body", "#document"].includes(Rt(t));
}
function V(t) {
  return U(t).getComputedStyle(t);
}
function ze(t) {
  return q(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function at(t) {
  if (Rt(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    bn(t) && t.host || // Fallback.
    G(t)
  );
  return bn(e) ? e.host : e;
}
function ss(t) {
  const e = at(t);
  return St(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Z(e) && se(e) ? e : ss(e);
}
function Xt(t, e, i) {
  var n;
  e === void 0 && (e = []), i === void 0 && (i = !0);
  const r = ss(t), s = r === ((n = t.ownerDocument) == null ? void 0 : n.body), o = U(r);
  if (s) {
    const a = mi(o);
    return e.concat(o, o.visualViewport || [], se(r) ? r : [], a && i ? Xt(a) : []);
  }
  return e.concat(r, Xt(r, [], i));
}
function mi(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function os(t) {
  const e = V(t);
  let i = parseFloat(e.width) || 0, n = parseFloat(e.height) || 0;
  const r = Z(t), s = r ? t.offsetWidth : i, o = r ? t.offsetHeight : n, a = Ce(i) !== s || Ce(n) !== o;
  return a && (i = s, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Bi(t) {
  return q(t) ? t : t.contextElement;
}
function It(t) {
  const e = Bi(t);
  if (!Z(e))
    return X(1);
  const i = e.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = os(e);
  let o = (s ? Ce(i.width) : i.width) / n, a = (s ? Ce(i.height) : i.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const rc = /* @__PURE__ */ X(0);
function as(t) {
  const e = U(t);
  return !Ui() || !e.visualViewport ? rc : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function sc(t, e, i) {
  return e === void 0 && (e = !1), !i || e && i !== U(t) ? !1 : e;
}
function xt(t, e, i, n) {
  e === void 0 && (e = !1), i === void 0 && (i = !1);
  const r = t.getBoundingClientRect(), s = Bi(t);
  let o = X(1);
  e && (n ? q(n) && (o = It(n)) : o = It(t));
  const a = sc(s, i, n) ? as(s) : X(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = U(s), g = n && q(n) ? U(n) : n;
    let p = f, b = mi(p);
    for (; b && n && g !== p; ) {
      const m = It(b), v = b.getBoundingClientRect(), h = V(b), _ = v.left + (b.clientLeft + parseFloat(h.paddingLeft)) * m.x, E = v.top + (b.clientTop + parseFloat(h.paddingTop)) * m.y;
      l *= m.x, c *= m.y, u *= m.x, d *= m.y, l += _, c += E, p = U(b), b = mi(p);
    }
  }
  return Ae({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Hi(t, e) {
  const i = ze(t).scrollLeft;
  return e ? e.left + i : xt(G(t)).left + i;
}
function ls(t, e, i) {
  i === void 0 && (i = !1);
  const n = t.getBoundingClientRect(), r = n.left + e.scrollLeft - (i ? 0 : (
    // RTL <body> scrollbar.
    Hi(t, n)
  )), s = n.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function oc(t) {
  let {
    elements: e,
    rect: i,
    offsetParent: n,
    strategy: r
  } = t;
  const s = r === "fixed", o = G(n), a = e ? Me(e.floating) : !1;
  if (n === o || a && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = X(1);
  const u = X(0), d = Z(n);
  if ((d || !d && !s) && ((Rt(n) !== "body" || se(o)) && (l = ze(n)), Z(n))) {
    const g = xt(n);
    c = It(n), u.x = g.x + n.clientLeft, u.y = g.y + n.clientTop;
  }
  const f = o && !d && !s ? ls(o, l, !0) : X(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function ac(t) {
  return Array.from(t.getClientRects());
}
function lc(t) {
  const e = G(t), i = ze(t), n = t.ownerDocument.body, r = gt(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), s = gt(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Hi(t);
  const a = -i.scrollTop;
  return V(n).direction === "rtl" && (o += gt(e.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function cc(t, e) {
  const i = U(t), n = G(t), r = i.visualViewport;
  let s = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Ui();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function uc(t, e) {
  const i = xt(t, !0, e === "fixed"), n = i.top + t.clientTop, r = i.left + t.clientLeft, s = Z(t) ? It(t) : X(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = n * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function wn(t, e, i) {
  let n;
  if (e === "viewport")
    n = cc(t, i);
  else if (e === "document")
    n = lc(G(t));
  else if (q(e))
    n = uc(e, i);
  else {
    const r = as(t);
    n = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return Ae(n);
}
function cs(t, e) {
  const i = at(t);
  return i === e || !q(i) || St(i) ? !1 : V(i).position === "fixed" || cs(i, e);
}
function dc(t, e) {
  const i = e.get(t);
  if (i)
    return i;
  let n = Xt(t, [], !1).filter((a) => q(a) && Rt(a) !== "body"), r = null;
  const s = V(t).position === "fixed";
  let o = s ? at(t) : t;
  for (; q(o) && !St(o); ) {
    const a = V(o), l = Fi(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || se(o) && !l && cs(t, o)) ? n = n.filter((u) => u !== o) : r = a, o = at(o);
  }
  return e.set(t, n), n;
}
function fc(t) {
  let {
    element: e,
    boundary: i,
    rootBoundary: n,
    strategy: r
  } = t;
  const o = [...i === "clippingAncestors" ? Me(e) ? [] : dc(e, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = wn(e, u, r);
    return c.top = gt(d.top, c.top), c.right = Ct(d.right, c.right), c.bottom = Ct(d.bottom, c.bottom), c.left = gt(d.left, c.left), c;
  }, wn(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function hc(t) {
  const {
    width: e,
    height: i
  } = os(t);
  return {
    width: e,
    height: i
  };
}
function pc(t, e, i) {
  const n = Z(e), r = G(e), s = i === "fixed", o = xt(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = X(0);
  function c() {
    l.x = Hi(r);
  }
  if (n || !n && !s)
    if ((Rt(e) !== "body" || se(r)) && (a = ze(e)), n) {
      const g = xt(e, !0, s, e);
      l.x = g.x + e.clientLeft, l.y = g.y + e.clientTop;
    } else r && c();
  s && !n && r && c();
  const u = r && !n && !s ? ls(r, a) : X(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function qe(t) {
  return V(t).position === "static";
}
function _n(t, e) {
  if (!Z(t) || V(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let i = t.offsetParent;
  return G(t) === i && (i = i.ownerDocument.body), i;
}
function us(t, e) {
  const i = U(t);
  if (Me(t))
    return i;
  if (!Z(t)) {
    let r = at(t);
    for (; r && !St(r); ) {
      if (q(r) && !qe(r))
        return r;
      r = at(r);
    }
    return i;
  }
  let n = _n(t, e);
  for (; n && ic(n) && qe(n); )
    n = _n(n, e);
  return n && St(n) && qe(n) && !Fi(n) ? i : n || nc(t) || i;
}
const mc = async function(t) {
  const e = this.getOffsetParent || us, i = this.getDimensions, n = await i(t.floating);
  return {
    reference: pc(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function gc(t) {
  return V(t).direction === "rtl";
}
const vc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: oc,
  getDocumentElement: G,
  getClippingRect: fc,
  getOffsetParent: us,
  getElementRects: mc,
  getClientRects: ac,
  getDimensions: hc,
  getScale: It,
  isElement: q,
  isRTL: gc
};
function ds(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function yc(t, e) {
  let i = null, n;
  const r = G(t);
  function s() {
    var a;
    clearTimeout(n), (a = i) == null || a.disconnect(), i = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = t.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: g
    } = c;
    if (a || e(), !f || !g)
      return;
    const p = he(d), b = he(r.clientWidth - (u + f)), m = he(r.clientHeight - (d + g)), v = he(u), _ = {
      rootMargin: -p + "px " + -b + "px " + -m + "px " + -v + "px",
      threshold: gt(0, Ct(1, l)) || 1
    };
    let E = !0;
    function x(y) {
      const w = y[0].intersectionRatio;
      if (w !== l) {
        if (!E)
          return o();
        w ? o(!1, w) : n = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      w === 1 && !ds(c, t.getBoundingClientRect()) && o(), E = !1;
    }
    try {
      i = new IntersectionObserver(x, {
        ..._,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      i = new IntersectionObserver(x, _);
    }
    i.observe(t);
  }
  return o(!0), s;
}
function bc(t, e, i, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Bi(t), u = r || s ? [...c ? Xt(c) : [], ...Xt(e)] : [];
  u.forEach((v) => {
    r && v.addEventListener("scroll", i, {
      passive: !0
    }), s && v.addEventListener("resize", i);
  });
  const d = c && a ? yc(c, i) : null;
  let f = -1, g = null;
  o && (g = new ResizeObserver((v) => {
    let [h] = v;
    h && h.target === c && g && (g.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var _;
      (_ = g) == null || _.observe(e);
    })), i();
  }), c && !l && g.observe(c), g.observe(e));
  let p, b = l ? xt(t) : null;
  l && m();
  function m() {
    const v = xt(t);
    b && !ds(b, v) && i(), b = v, p = requestAnimationFrame(m);
  }
  return i(), () => {
    var v;
    u.forEach((h) => {
      r && h.removeEventListener("scroll", i), s && h.removeEventListener("resize", i);
    }), d?.(), (v = g) == null || v.disconnect(), g = null, l && cancelAnimationFrame(p);
  };
}
const Zt = tc, Gt = ec, Qt = Gl, wc = Zl, te = (t, e, i) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: vc,
    ...i
  }, s = {
    ...r.platform,
    _c: n
  };
  return Xl(t, e, {
    ...r,
    platform: s
  });
};
function _c(t) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), te(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [Zt(this.pixelOffset), Qt(), Gt({ padding: 8 })]
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
      !this.triggerEl || !e || te(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [Zt(this.pixelOffset), Qt(), Gt({ padding: 8 })]
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
function xc(t) {
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
function Ec(t) {
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
function Ic(t) {
  t.data("rzEmpty", () => {
  });
}
function Tc(t) {
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
function Cc(t) {
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
function Sc(t) {
  t.data("rzInputGroupAddon", () => ({
    handleClick(e) {
      if (e.target.closest("button"))
        return;
      const i = this.$el.parentElement;
      i && i.querySelector("input, textarea")?.focus();
    }
  }));
}
function Ac(t, e) {
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
function Oc(t, e) {
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
      !o || !a || (te(o, a, {
        placement: "bottom-start",
        middleware: [Zt(6), Qt(), Gt({ padding: 8 })]
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
function $c(t) {
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
      c.push(Zt({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: r
      })), o && c.push(Qt()), a && c.push(Gt({ padding: l })), te(this.triggerEl, this.contentEl, {
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
function kc(t) {
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
function Nc(t) {
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
function Dc(t) {
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
function Rc(t) {
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
function Lc(t) {
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
function Pc(t) {
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
function Mc(t) {
  t.data("rzToggle", () => ({
    pressed: !1,
    disabled: !1,
    controlled: !1,
    init() {
      this.disabled = this.$el.dataset.disabled === "true";
      const e = this.$el.dataset.pressed;
      if (this.controlled = e === "true" || e === "false", this.controlled) {
        this.pressed = e === "true";
        return;
      }
      this.pressed = this.$el.dataset.defaultPressed === "true";
    },
    toggle() {
      this.disabled || this.controlled || (this.pressed = !this.pressed);
    },
    state() {
      return this.pressed ? "on" : "off";
    },
    ariaPressed() {
      return this.pressed.toString();
    },
    dataDisabled() {
      return this.disabled ? "" : null;
    }
  }));
}
function zc(t) {
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
    init() {
      this.readDatasetOptions(), this.open = this.getBooleanDataset("open", this.getBooleanDataset("defaultOpen", !1)), this.ariaExpanded = this.open.toString(), this.state = this.open ? "open" : "closed", this.triggerEl = this.$refs.trigger || this.$el.querySelector('[data-slot="tooltip-trigger"]'), this.contentEl = this.$refs.content || this.$el.querySelector('[data-slot="tooltip-content"]'), this.arrowEl = this.$el.querySelector('[data-slot="tooltip-arrow"]'), this.bindInteractionEvents(), this.$watch("open", (e) => {
        const i = this.getBooleanDataset("open", e), n = this.isControlledOpenState ? i : e;
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
    readDatasetOptions() {
      this.anchor = this.$el.dataset.anchor || this.anchor, this.strategy = this.$el.dataset.strategy || this.strategy, this.mainOffset = this.getNumberDataset("offset", this.mainOffset), this.crossAxisOffset = this.getNumberDataset("crossAxisOffset", this.crossAxisOffset), this.alignmentAxisOffset = this.getNullableNumberDataset("alignmentAxisOffset", this.alignmentAxisOffset), this.shiftPadding = this.getNumberDataset("shiftPadding", this.shiftPadding), this.openDelayDuration = this.getNumberDataset("delayDuration", this.openDelayDuration), this.skipDelayDuration = this.getNumberDataset("skipDelayDuration", this.skipDelayDuration), this.closeDelayDuration = this.getNumberDataset("closeDelayDuration", this.closeDelayDuration), this.disableHoverableContent = this.getBooleanDataset("disableHoverableContent", this.disableHoverableContent), this.enableFlip = this.getBooleanDataset("enableFlip", this.enableFlip), this.enableShift = this.getBooleanDataset("enableShift", this.enableShift), this.enableAutoUpdate = this.getBooleanDataset("autoUpdate", this.enableAutoUpdate), this.isControlledOpenState = this.getBooleanDataset("openControlled", this.isControlledOpenState);
    },
    getBooleanDataset(e, i) {
      const n = this.$el.dataset[e];
      return typeof n > "u" ? i : n === "true";
    },
    getNumberDataset(e, i) {
      const n = Number(this.$el.dataset[e]);
      return Number.isFinite(n) ? n : i;
    },
    getNullableNumberDataset(e, i) {
      const n = this.$el.dataset[e];
      if (typeof n > "u" || n === null || n === "") return i;
      const r = Number(n);
      return Number.isFinite(r) ? r : i;
    },
    bindInteractionEvents() {
      this.triggerEl && (this.triggerEl.addEventListener("pointerenter", this.handleTriggerPointerEnter.bind(this)), this.triggerEl.addEventListener("pointerleave", this.handleTriggerPointerLeave.bind(this)), this.triggerEl.addEventListener("focus", this.handleTriggerFocus.bind(this)), this.triggerEl.addEventListener("blur", this.handleTriggerBlur.bind(this)), this.triggerEl.addEventListener("keydown", this.handleTriggerKeydown.bind(this)), this.contentEl && (this.contentEl.addEventListener("pointerenter", this.handleContentPointerEnter.bind(this)), this.contentEl.addEventListener("pointerleave", this.handleContentPointerLeave.bind(this))));
    },
    startAutoUpdate() {
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = bc(this.triggerEl, this.contentEl, () => {
        this.updatePosition();
      }));
    },
    stopAutoUpdate() {
      typeof this.cleanupAutoUpdate == "function" && (this.cleanupAutoUpdate(), this.cleanupAutoUpdate = null);
    },
    clearTimers() {
      this.openDelayTimer && (window.clearTimeout(this.openDelayTimer), this.openDelayTimer = null), this.closeDelayTimer && (window.clearTimeout(this.closeDelayTimer), this.closeDelayTimer = null), this.skipDelayTimer && (window.clearTimeout(this.skipDelayTimer), this.skipDelayTimer = null);
    },
    startSkipDelayWindow() {
      if (this.skipDelayDuration <= 0) {
        this.skipDelayActive = !1;
        return;
      }
      this.skipDelayTimer && window.clearTimeout(this.skipDelayTimer), this.skipDelayActive = !0, this.skipDelayTimer = window.setTimeout(() => {
        this.skipDelayActive = !1, this.skipDelayTimer = null;
      }, this.skipDelayDuration);
    },
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
    handleTriggerPointerEnter() {
      this.queueOpen();
    },
    handleTriggerPointerLeave() {
      this.queueClose();
    },
    handleTriggerFocus() {
      this.queueOpen();
    },
    handleTriggerBlur() {
      this.queueClose();
    },
    handleContentPointerEnter() {
      this.disableHoverableContent || this.closeDelayTimer && (window.clearTimeout(this.closeDelayTimer), this.closeDelayTimer = null);
    },
    handleContentPointerLeave() {
      this.disableHoverableContent || this.queueClose();
    },
    handleTriggerKeydown(e) {
      e.key === "Escape" && this.handleWindowEscape();
    },
    handleWindowEscape() {
      this.clearTimers(), this.open = !1, this.$nextTick(() => this.triggerEl?.focus());
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const e = [
        Zt({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && e.push(Qt()), this.enableShift && e.push(Gt({ padding: this.shiftPadding })), this.arrowEl && e.push(wc({ element: this.arrowEl })), te(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: e
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
function Fc(t) {
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
function Uc(t) {
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
      const d = /[\\/_+.#"@[\(\{&]/, f = /[\s-]/, g = `${e} ${n ? n.join(" ") : ""}`;
      function p(m) {
        return m.toLowerCase().replace(/[\s-]/g, " ");
      }
      function b(m, v, h, _, E, x, y) {
        if (x === v.length)
          return E === m.length ? 1 : 0.99;
        const w = `${E},${x}`;
        if (y[w] !== void 0) return y[w];
        const I = _.charAt(x);
        let T = h.indexOf(I, E), C = 0;
        for (; T >= 0; ) {
          let S = b(m, v, h, _, T + 1, x + 1, y);
          S > C && (T === E ? S *= 1 : d.test(m.charAt(T - 1)) ? S *= 0.8 : f.test(m.charAt(T - 1)) ? S *= 0.9 : (S *= 0.17, E > 0 && (S *= Math.pow(0.999, T - E))), m.charAt(T) !== v.charAt(x) && (S *= 0.9999)), S > C && (C = S), T = h.indexOf(I, T + 1);
        }
        return y[w] = C, C;
      }
      return b(g, i, p(g), p(i), 0, 0, {});
    }
  }));
}
function Bc(t) {
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
function Hc(t) {
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
function jc(t) {
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
async function Wc(t) {
  t = [...t].sort();
  const e = t.join("|"), n = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ut(t, e, i) {
  let n, r;
  typeof e == "function" ? n = { success: e } : e && typeof e == "object" ? n = e : typeof e == "string" && (r = e), !r && typeof i == "string" && (r = i);
  const s = Array.isArray(t) ? t : [t];
  return Wc(s).then((o) => (rt.isDefined(o) || rt(s, o, {
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
function qc(t) {
  $l(t), kl(t), Nl(t), Dl(t), Rl(t), Ll(t, ut), Pl(t), Ml(t, ut), zl(t, ut), Fl(t), Ul(t, ut), Bl(t, ut), Hl(t), _c(t), xc(t), Ec(t), Ic(t), Tc(t), Cc(t), Sc(t), Ac(t, ut), Oc(t), $c(t), kc(t), Nc(t), Dc(t), Rc(t), Lc(t), Pc(t), Mc(t), zc(t), Fc(t), Uc(t), Bc(t), Hc(t), jc(t);
}
function Vc(t) {
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
const pe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
let xn = !1;
function Yc(t) {
  return me.has(t) || me.set(
    t,
    import(t).catch((e) => {
      throw me.delete(t), e;
    })
  ), me.get(t);
}
function En(t, e) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    t,
    () => Yc(e).catch((n) => (console.error(
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
function Kc(t, e) {
  if (!t || !e) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = pe.get(t);
  i && i.path !== e && console.warn(
    `[RizzyUI] Re-registering '${t}' with a different path.
  Previous: ${i.path}
  New:      ${e}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const r = !i || i.path !== e;
    if (!(i && i.loaderSet && !r)) {
      const o = En(t, e);
      pe.set(t, { path: e, loaderSet: o });
    }
    return;
  }
  pe.set(t, { path: e, loaderSet: !1 }), xn || (xn = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of pe)
        if (!s.loaderSet) {
          const o = En(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Jc(t) {
  t.directive("mobile", (e, { modifiers: i, expression: n }, { cleanup: r }) => {
    const s = i.find((v) => v.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      e.dataset.mobile = "false", e.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (v) => {
      e.dataset.mobile = v ? "true" : "false", e.dataset.screen = v ? "mobile" : "desktop";
    }, u = () => typeof t.$data == "function" ? t.$data(e) : e.__x ? e.__x.$data : null, d = (v) => {
      if (!a) return;
      const h = u();
      h && (h[n] = v);
    }, f = (v) => {
      e.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: v, width: window.innerWidth, breakpoint: o }
        })
      );
    }, g = window.matchMedia(`(max-width: ${o - 1}px)`), p = () => {
      const v = l();
      c(v), d(v), f(v);
    };
    p();
    const b = () => p(), m = () => p();
    g.addEventListener("change", b), window.addEventListener("resize", m, { passive: !0 }), r(() => {
      g.removeEventListener("change", b), window.removeEventListener("resize", m);
    });
  });
}
function Xc(t) {
  const e = (i, { expression: n, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (b, m, v) => {
      const _ = m.replace(/\[(\d+)\]/g, ".$1").split("."), E = _.pop();
      let x = b;
      for (const y of _)
        (x[y] == null || typeof x[y] != "object") && (x[y] = isFinite(+y) ? [] : {}), x = x[y];
      x[E] = v;
    }, l = t.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = n.split(",").map((b) => b.trim()).filter(Boolean).map((b) => {
      const m = b.split("->").map((v) => v.trim());
      return m.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', b), null) : { parentPath: m[0], childPath: m[1] };
    }).filter(Boolean), f = r.includes("init-child") || r.includes("child") || r.includes("childWins"), g = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: f
      // avoid redundant first child->parent write
    })), p = [];
    d.forEach((b, m) => {
      const v = g[m];
      if (f) {
        const E = t.evaluate(i, b.childPath, { scope: c });
        v.fromChild = !0, a(u, b.parentPath, E), queueMicrotask(() => {
          v.fromChild = !1;
        });
      } else {
        const E = t.evaluate(i, b.parentPath, { scope: u });
        v.fromParent = !0, a(c, b.childPath, E), queueMicrotask(() => {
          v.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = t.evaluate(i, b.parentPath, { scope: u });
        v.fromChild || (v.fromParent = !0, a(c, b.childPath, E), queueMicrotask(() => {
          v.fromParent = !1;
        }));
      }), _ = o(() => {
        const E = t.evaluate(i, b.childPath, { scope: c });
        if (!v.fromParent) {
          if (v.skipChildOnce) {
            v.skipChildOnce = !1;
            return;
          }
          v.fromChild = !0, a(u, b.parentPath, E), queueMicrotask(() => {
            v.fromChild = !1;
          });
        }
      });
      p.push(h, _);
    }), s(() => {
      for (const b of p)
        try {
          b && b();
        } catch {
        }
    });
  };
  t.directive("syncprop", e);
}
class Zc {
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
const F = new Zc();
function Gc(t) {
  F.init(), t.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: F.mode,
    _prefersDark: F.prefersDark,
    _effectiveDark: F.effectiveDark,
    // Listener reference to prevent duplicate registration
    _onThemeChange: null,
    init() {
      this._onThemeChange || (this._onThemeChange = () => this._refresh(), window.addEventListener(F.eventName, this._onThemeChange)), this._refresh();
    },
    _refresh() {
      this._mode = F.mode, this._prefersDark = F.prefersDark, this._effectiveDark = F.effectiveDark;
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
      F.setLight();
    },
    setDark() {
      F.setDark();
    },
    setAuto() {
      F.setAuto();
    },
    toggle() {
      F.toggle();
    }
  });
}
let Ht = null;
function Qc(t) {
  return Ht || (t.plugin($a), t.plugin(La), t.plugin(il), t.plugin(dl), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Gc(t);
  }), qc(t), Jc(t), Xc(t), Ht = {
    Alpine: t,
    require: ut,
    toast: Il,
    $data: Al,
    props: Vc,
    registerAsyncComponent: Kc,
    theme: F
  }, typeof window < "u" && (F.init(), window.Alpine = t, window.Rizzy = { ...window.Rizzy || {}, ...Ht }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Ht);
}
const iu = Qc(Pr);
Pr.start();
export {
  iu as default
};
