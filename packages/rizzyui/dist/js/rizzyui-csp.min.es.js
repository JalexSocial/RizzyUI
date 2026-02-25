var qe = !1, Ye = !1, ht = [], Ke = -1;
function pr(e) {
  mr(e);
}
function mr(e) {
  ht.includes(e) || ht.push(e), yr();
}
function gr(e) {
  let t = ht.indexOf(e);
  t !== -1 && t > Ke && ht.splice(t, 1);
}
function yr() {
  !Ye && !qe && (qe = !0, queueMicrotask(vr));
}
function vr() {
  qe = !1, Ye = !0;
  for (let e = 0; e < ht.length; e++)
    ht[e](), Ke = e;
  ht.length = 0, Ke = -1, Ye = !1;
}
var Dt, Ct, Nt, Tn, Je = !0;
function br(e) {
  Je = !1, e(), Je = !0;
}
function wr(e) {
  Dt = e.reactive, Nt = e.release, Ct = (t) => e.effect(t, { scheduler: (i) => {
    Je ? pr(i) : i();
  } }), Tn = e.raw;
}
function ji(e) {
  Ct = e;
}
function xr(e) {
  let t = () => {
  };
  return [(n) => {
    let s = Ct(n);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((r) => r());
    }), e._x_effects.add(s), t = () => {
      s !== void 0 && (e._x_effects.delete(s), Nt(s));
    }, s;
  }, () => {
    t();
  }];
}
function Sn(e, t) {
  let i = !0, n, s = Ct(() => {
    let r = e();
    JSON.stringify(r), i ? n = r : queueMicrotask(() => {
      t(r, n), n = r;
    }), i = !1;
  });
  return () => Nt(s);
}
var Cn = [], $n = [], An = [];
function Ir(e) {
  An.push(e);
}
function gi(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, $n.push(t));
}
function On(e) {
  Cn.push(e);
}
function kn(e, t, i) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(i);
}
function Dn(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([i, n]) => {
    (t === void 0 || t.includes(i)) && (n.forEach((s) => s()), delete e._x_attributeCleanups[i]);
  });
}
function _r(e) {
  for (e._x_effects?.forEach(gr); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var yi = new MutationObserver(xi), vi = !1;
function bi() {
  yi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), vi = !0;
}
function Nn() {
  Er(), yi.disconnect(), vi = !1;
}
var Ft = [];
function Er() {
  let e = yi.takeRecords();
  Ft.push(() => e.length > 0 && xi(e));
  let t = Ft.length;
  queueMicrotask(() => {
    if (Ft.length === t)
      for (; Ft.length > 0; )
        Ft.shift()();
  });
}
function O(e) {
  if (!vi)
    return e();
  Nn();
  let t = e();
  return bi(), t;
}
var wi = !1, ve = [];
function Tr() {
  wi = !0;
}
function Sr() {
  wi = !1, xi(ve), ve = [];
}
function xi(e) {
  if (wi) {
    ve = ve.concat(e);
    return;
  }
  let t = [], i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let r = 0; r < e.length; r++)
    if (!e[r].target._x_ignoreMutationObserver && (e[r].type === "childList" && (e[r].removedNodes.forEach((o) => {
      o.nodeType === 1 && o._x_marker && i.add(o);
    }), e[r].addedNodes.forEach((o) => {
      if (o.nodeType === 1) {
        if (i.has(o)) {
          i.delete(o);
          return;
        }
        o._x_marker || t.push(o);
      }
    })), e[r].type === "attributes")) {
      let o = e[r].target, a = e[r].attributeName, l = e[r].oldValue, c = () => {
        n.has(o) || n.set(o, []), n.get(o).push({ name: a, value: o.getAttribute(a) });
      }, u = () => {
        s.has(o) || s.set(o, []), s.get(o).push(a);
      };
      o.hasAttribute(a) && l === null ? c() : o.hasAttribute(a) ? (u(), c()) : u();
    }
  s.forEach((r, o) => {
    Dn(o, r);
  }), n.forEach((r, o) => {
    Cn.forEach((a) => a(o, r));
  });
  for (let r of i)
    t.some((o) => o.contains(r)) || $n.forEach((o) => o(r));
  for (let r of t)
    r.isConnected && An.forEach((o) => o(r));
  t = null, i = null, n = null, s = null;
}
function Pn(e) {
  return Pt(vt(e));
}
function ee(e, t, i) {
  return e._x_dataStack = [t, ...vt(i || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
  };
}
function vt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? vt(e.host) : e.parentNode ? vt(e.parentNode) : [];
}
function Pt(e) {
  return new Proxy({ objects: e }, Cr);
}
var Cr = {
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
    return t == "toJSON" ? $r : Reflect.get(
      e.find(
        (n) => Reflect.has(n, t)
      ) || {},
      t,
      i
    );
  },
  set({ objects: e }, t, i, n) {
    const s = e.find(
      (o) => Object.prototype.hasOwnProperty.call(o, t)
    ) || e[e.length - 1], r = Object.getOwnPropertyDescriptor(s, t);
    return r?.set && r?.get ? r.set.call(n, i) || !0 : Reflect.set(s, t, i);
  }
};
function $r() {
  return Reflect.ownKeys(this).reduce((t, i) => (t[i] = Reflect.get(this, i), t), {});
}
function Ln(e) {
  let t = (n) => typeof n == "object" && !Array.isArray(n) && n !== null, i = (n, s = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([r, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = s === "" ? r : `${s}.${r}`;
      typeof o == "object" && o !== null && o._x_interceptor ? n[r] = o.initialize(e, l, r) : t(o) && o !== n && !(o instanceof Element) && i(o, l);
    });
  };
  return i(e);
}
function Rn(e, t = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, s, r) {
      return e(this.initialValue, () => Ar(n, s), (o) => Xe(n, s, o), s, r);
    }
  };
  return t(i), (n) => {
    if (typeof n == "object" && n !== null && n._x_interceptor) {
      let s = i.initialize.bind(i);
      i.initialize = (r, o, a) => {
        let l = n.initialize(r, o, a);
        return i.initialValue = l, s(r, o, a);
      };
    } else
      i.initialValue = n;
    return i;
  };
}
function Ar(e, t) {
  return t.split(".").reduce((i, n) => i[n], e);
}
function Xe(e, t, i) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = i;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Xe(e[t[0]], t.slice(1), i);
  }
}
var Mn = {};
function Y(e, t) {
  Mn[e] = t;
}
function be(e, t) {
  let i = Or(t);
  return Object.entries(Mn).forEach(([n, s]) => {
    Object.defineProperty(e, `$${n}`, {
      get() {
        return s(t, i);
      },
      enumerable: !1
    });
  }), e;
}
function Or(e) {
  let [t, i] = Hn(e), n = { interceptor: Rn, ...t };
  return gi(e, i), n;
}
function zn(e, t, i, ...n) {
  try {
    return i(...n);
  } catch (s) {
    Zt(s, e, t);
  }
}
function Zt(e, t, i = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: i }
  ), console.warn(`Alpine Expression Error: ${e.message}

${i ? 'Expression: "' + i + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Kt = !0;
function Fn(e) {
  let t = Kt;
  Kt = !1;
  let i = e();
  return Kt = t, i;
}
function ft(e, t, i = {}) {
  let n;
  return z(e, t)((s) => n = s, i), n;
}
function z(...e) {
  return Bn(...e);
}
var Bn = Dr;
function kr(e) {
  Bn = e;
}
function Dr(e, t) {
  let i = {};
  be(i, e);
  let n = [i, ...vt(e)], s = typeof t == "function" ? Un(n, t) : Pr(n, t, e);
  return zn.bind(null, e, t, s);
}
function Un(e, t) {
  return (i = () => {
  }, { scope: n = {}, params: s = [], context: r } = {}) => {
    let o = t.apply(Pt([n, ...e]), s);
    we(i, o);
  };
}
var Fe = {};
function Nr(e, t) {
  if (Fe[e])
    return Fe[e];
  let i = Object.getPrototypeOf(async function() {
  }).constructor, n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, r = (() => {
    try {
      let o = new i(
        ["__self", "scope"],
        `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(o, "name", {
        value: `[Alpine] ${e}`
      }), o;
    } catch (o) {
      return Zt(o, t, e), Promise.resolve();
    }
  })();
  return Fe[e] = r, r;
}
function Pr(e, t, i) {
  let n = Nr(t, i);
  return (s = () => {
  }, { scope: r = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = Pt([r, ...e]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => Zt(u, i, t));
      n.finished ? (we(s, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        we(s, u, l, o, i);
      }).catch((u) => Zt(u, i, t)).finally(() => n.result = void 0);
    }
  };
}
function we(e, t, i, n, s) {
  if (Kt && typeof t == "function") {
    let r = t.apply(i, n);
    r instanceof Promise ? r.then((o) => we(e, o, i, n)).catch((o) => Zt(o, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
var Ii = "x-";
function Lt(e = "") {
  return Ii + e;
}
function Lr(e) {
  Ii = e;
}
var xe = {};
function k(e, t) {
  return xe[e] = t, {
    before(i) {
      if (!xe[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const n = dt.indexOf(i);
      dt.splice(n >= 0 ? n : dt.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Rr(e) {
  return Object.keys(xe).includes(e);
}
function _i(e, t, i) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Vn(r);
    r = r.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(r);
  }
  let n = {};
  return t.map(Yn((r, o) => n[r] = o)).filter(Jn).map(Fr(n, i)).sort(Br).map((r) => zr(e, r));
}
function Vn(e) {
  return Array.from(e).map(Yn()).filter((t) => !Jn(t));
}
var Ze = !1, Yt = /* @__PURE__ */ new Map(), jn = Symbol();
function Mr(e) {
  Ze = !0;
  let t = Symbol();
  jn = t, Yt.set(t, []);
  let i = () => {
    for (; Yt.get(t).length; )
      Yt.get(t).shift()();
    Yt.delete(t);
  }, n = () => {
    Ze = !1, i();
  };
  e(i), n();
}
function Hn(e) {
  let t = [], i = (a) => t.push(a), [n, s] = xr(e);
  return t.push(s), [{
    Alpine: ie,
    effect: n,
    cleanup: i,
    evaluateLater: z.bind(z, e),
    evaluate: ft.bind(ft, e)
  }, () => t.forEach((a) => a())];
}
function zr(e, t) {
  let i = () => {
  }, n = xe[t.type] || i, [s, r] = Hn(e);
  kn(e, t.original, r);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, s), n = n.bind(n, e, t, s), Ze ? Yt.get(jn).push(n) : n());
  };
  return o.runCleanups = r, o;
}
var Wn = (e, t) => ({ name: i, value: n }) => (i.startsWith(e) && (i = i.replace(e, t)), { name: i, value: n }), qn = (e) => e;
function Yn(e = () => {
}) {
  return ({ name: t, value: i }) => {
    let { name: n, value: s } = Kn.reduce((r, o) => o(r), { name: t, value: i });
    return n !== t && e(n, t), { name: n, value: s };
  };
}
var Kn = [];
function Ei(e) {
  Kn.push(e);
}
function Jn({ name: e }) {
  return Xn().test(e);
}
var Xn = () => new RegExp(`^${Ii}([^:^.]+)\\b`);
function Fr(e, t) {
  return ({ name: i, value: n }) => {
    let s = i.match(Xn()), r = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[i] || i;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
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
function Br(e, t) {
  let i = dt.indexOf(e.type) === -1 ? Ge : e.type, n = dt.indexOf(t.type) === -1 ? Ge : t.type;
  return dt.indexOf(i) - dt.indexOf(n);
}
function Jt(e, t, i = {}) {
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
    Array.from(e.children).forEach((s) => bt(s, t));
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
var Hi = !1;
function Ur() {
  Hi && V("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Hi = !0, document.body || V("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Jt(document, "alpine:init"), Jt(document, "alpine:initializing"), bi(), Ir((t) => tt(t, bt)), gi((t) => Mt(t)), On((t, i) => {
    _i(t, i).forEach((n) => n());
  });
  let e = (t) => !Ae(t.parentElement, !0);
  Array.from(document.querySelectorAll(Qn().join(","))).filter(e).forEach((t) => {
    tt(t);
  }), Jt(document, "alpine:initialized"), setTimeout(() => {
    Wr();
  });
}
var Ti = [], Zn = [];
function Gn() {
  return Ti.map((e) => e());
}
function Qn() {
  return Ti.concat(Zn).map((e) => e());
}
function ts(e) {
  Ti.push(e);
}
function es(e) {
  Zn.push(e);
}
function Ae(e, t = !1) {
  return Rt(e, (i) => {
    if ((t ? Qn() : Gn()).some((s) => i.matches(s)))
      return !0;
  });
}
function Rt(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return Rt(e.parentElement, t);
  }
}
function Vr(e) {
  return Gn().some((t) => e.matches(t));
}
var is = [];
function jr(e) {
  is.push(e);
}
var Hr = 1;
function tt(e, t = bt, i = () => {
}) {
  Rt(e, (n) => n._x_ignore) || Mr(() => {
    t(e, (n, s) => {
      n._x_marker || (i(n, s), is.forEach((r) => r(n, s)), _i(n, n.attributes).forEach((r) => r()), n._x_ignore || (n._x_marker = Hr++), n._x_ignore && s());
    });
  });
}
function Mt(e, t = bt) {
  t(e, (i) => {
    _r(i), Dn(i), delete i._x_marker;
  });
}
function Wr() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, i, n]) => {
    Rr(i) || n.some((s) => {
      if (document.querySelector(s))
        return V(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var Qe = [], Si = !1;
function Ci(e = () => {
}) {
  return queueMicrotask(() => {
    Si || setTimeout(() => {
      ti();
    });
  }), new Promise((t) => {
    Qe.push(() => {
      e(), t();
    });
  });
}
function ti() {
  for (Si = !1; Qe.length; )
    Qe.shift()();
}
function qr() {
  Si = !0;
}
function $i(e, t) {
  return Array.isArray(t) ? Wi(e, t.join(" ")) : typeof t == "object" && t !== null ? Yr(e, t) : typeof t == "function" ? $i(e, t()) : Wi(e, t);
}
function Wi(e, t) {
  let i = (s) => s.split(" ").filter((r) => !e.classList.contains(r)).filter(Boolean), n = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", n(i(t));
}
function Yr(e, t) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(t).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), s = Object.entries(t).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), r = [], o = [];
  return s.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), r.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), r.forEach((a) => e.classList.remove(a));
  };
}
function Oe(e, t) {
  return typeof t == "object" && t !== null ? Kr(e, t) : Jr(e, t);
}
function Kr(e, t) {
  let i = {};
  return Object.entries(t).forEach(([n, s]) => {
    i[n] = e.style[n], n.startsWith("--") || (n = Xr(n)), e.style.setProperty(n, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Oe(e, i);
  };
}
function Jr(e, t) {
  let i = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", i || "");
  };
}
function Xr(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ei(e, t = () => {
}) {
  let i = !1;
  return function() {
    i ? t.apply(this, arguments) : (i = !0, e.apply(this, arguments));
  };
}
k("transition", (e, { value: t, modifiers: i, expression: n }, { evaluate: s }) => {
  typeof n == "function" && (n = s(n)), n !== !1 && (!n || typeof n == "boolean" ? Gr(e, i, t) : Zr(e, n, t));
});
function Zr(e, t, i) {
  ns(e, $i, ""), {
    enter: (s) => {
      e._x_transition.enter.during = s;
    },
    "enter-start": (s) => {
      e._x_transition.enter.start = s;
    },
    "enter-end": (s) => {
      e._x_transition.enter.end = s;
    },
    leave: (s) => {
      e._x_transition.leave.during = s;
    },
    "leave-start": (s) => {
      e._x_transition.leave.start = s;
    },
    "leave-end": (s) => {
      e._x_transition.leave.end = s;
    }
  }[i](t);
}
function Gr(e, t, i) {
  ns(e, Oe);
  let n = !t.includes("in") && !t.includes("out") && !i, s = n || t.includes("in") || ["enter"].includes(i), r = n || t.includes("out") || ["leave"].includes(i);
  t.includes("in") && !n && (t = t.filter((v, p) => p < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((v, p) => p > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? Bt(t, "scale", 95) / 100 : 1, d = Bt(t, "delay", 0) / 1e3, h = Bt(t, "origin", "center"), g = "opacity, transform", f = Bt(t, "duration", 150) / 1e3, y = Bt(t, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: h,
    transitionDelay: `${d}s`,
    transitionProperty: g,
    transitionDuration: `${f}s`,
    transitionTimingFunction: m
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: h,
    transitionDelay: `${d}s`,
    transitionProperty: g,
    transitionDuration: `${y}s`,
    transitionTimingFunction: m
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function ns(e, t, i = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, s = () => {
    }) {
      ii(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, s);
    },
    out(n = () => {
    }, s = () => {
    }) {
      ii(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, n, s);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, i, n) {
  const s = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let r = () => s(i);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(i) : r() : e._x_transition ? e._x_transition.in(i) : r();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((o, a) => {
    e._x_transition.out(() => {
    }, () => o(n)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(n), queueMicrotask(() => {
    let o = ss(e);
    o ? (o._x_hideChildren || (o._x_hideChildren = []), o._x_hideChildren.push(e)) : s(() => {
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
function ss(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : ss(t);
}
function ii(e, t, { during: i, start: n, end: s } = {}, r = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(s).length === 0) {
    r(), o();
    return;
  }
  let a, l, c;
  Qr(e, {
    start() {
      a = t(e, n);
    },
    during() {
      l = t(e, i);
    },
    before: r,
    end() {
      a(), c = t(e, s);
    },
    after: o,
    cleanup() {
      l(), c();
    }
  });
}
function Qr(e, t) {
  let i, n, s, r = ei(() => {
    O(() => {
      i = !0, n || t.before(), s || (t.end(), ti()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: ei(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      r();
    }),
    finish: r
  }, O(() => {
    t.start(), t.during();
  }), qr(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), O(() => {
      t.before();
    }), n = !0, requestAnimationFrame(() => {
      i || (O(() => {
        t.end();
      }), ti(), setTimeout(e._x_transitioning.finish, o + a), s = !0);
    });
  });
}
function Bt(e, t, i) {
  if (e.indexOf(t) === -1)
    return i;
  const n = e[e.indexOf(t) + 1];
  if (!n || t === "scale" && isNaN(n))
    return i;
  if (t === "duration" || t === "delay") {
    let s = n.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [n, e[e.indexOf(t) + 2]].join(" ") : n;
}
var ot = !1;
function ct(e, t = () => {
}) {
  return (...i) => ot ? t(...i) : e(...i);
}
function to(e) {
  return (...t) => ot && e(...t);
}
var rs = [];
function ke(e) {
  rs.push(e);
}
function eo(e, t) {
  rs.forEach((i) => i(e, t)), ot = !0, os(() => {
    tt(t, (i, n) => {
      n(i, () => {
      });
    });
  }), ot = !1;
}
var ni = !1;
function io(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ot = !0, ni = !0, os(() => {
    no(t);
  }), ot = !1, ni = !1;
}
function no(e) {
  let t = !1;
  tt(e, (n, s) => {
    bt(n, (r, o) => {
      if (t && Vr(r))
        return o();
      t = !0, s(r, o);
    });
  });
}
function os(e) {
  let t = Ct;
  ji((i, n) => {
    let s = t(i);
    return Nt(s), () => {
    };
  }), e(), ji(t);
}
function as(e, t, i, n = []) {
  switch (e._x_bindings || (e._x_bindings = Dt({})), e._x_bindings[t] = i, t = n.includes("camel") ? ho(t) : t, t) {
    case "value":
      so(e, i);
      break;
    case "style":
      oo(e, i);
      break;
    case "class":
      ro(e, i);
      break;
    case "selected":
    case "checked":
      ao(e, t, i);
      break;
    default:
      ls(e, t, i);
      break;
  }
}
function so(e, t) {
  if (ds(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = ge(e.value) === t : e.checked = qi(e.value, t));
  else if (Ai(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((i) => qi(i, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    uo(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function ro(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = $i(e, t);
}
function oo(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Oe(e, t);
}
function ao(e, t, i) {
  ls(e, t, i), co(e, t, i);
}
function ls(e, t, i) {
  [null, void 0, !1].includes(i) && po(t) ? e.removeAttribute(t) : (cs(t) && (i = t), lo(e, t, i));
}
function lo(e, t, i) {
  e.getAttribute(t) != i && e.setAttribute(t, i);
}
function co(e, t, i) {
  e[t] !== i && (e[t] = i);
}
function uo(e, t) {
  const i = [].concat(t).map((n) => n + "");
  Array.from(e.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function ho(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function qi(e, t) {
  return e == t;
}
function ge(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
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
function cs(e) {
  return fo.has(e);
}
function po(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function mo(e, t, i) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : us(e, t, i);
}
function go(e, t, i, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = n, Fn(() => ft(e, s.expression));
  }
  return us(e, t, i);
}
function us(e, t, i) {
  let n = e.getAttribute(t);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : cs(t) ? !![t, "true"].includes(n) : n;
}
function Ai(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function ds(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function hs(e, t) {
  let i;
  return function() {
    const n = this, s = arguments, r = function() {
      i = null, e.apply(n, s);
    };
    clearTimeout(i), i = setTimeout(r, t);
  };
}
function fs(e, t) {
  let i;
  return function() {
    let n = this, s = arguments;
    i || (e.apply(n, s), i = !0, setTimeout(() => i = !1, t));
  };
}
function ps({ get: e, set: t }, { get: i, set: n }) {
  let s = !0, r, o = Ct(() => {
    let a = e(), l = i();
    if (s)
      n(Be(a)), s = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== r ? n(Be(a)) : c !== u && t(Be(l));
    }
    r = JSON.stringify(e()), JSON.stringify(i());
  });
  return () => {
    Nt(o);
  };
}
function Be(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function yo(e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => i(ie));
}
var ut = {}, Yi = !1;
function vo(e, t) {
  if (Yi || (ut = Dt(ut), Yi = !0), t === void 0)
    return ut[e];
  ut[e] = t, Ln(ut[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ut[e].init();
}
function bo() {
  return ut;
}
var ms = {};
function wo(e, t) {
  let i = typeof t != "function" ? () => t : t;
  return e instanceof Element ? gs(e, i()) : (ms[e] = i, () => {
  });
}
function xo(e) {
  return Object.entries(ms).forEach(([t, i]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), e;
}
function gs(e, t, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let s = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), r = Vn(s);
  return s = s.map((o) => r.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), _i(e, s, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var ys = {};
function Io(e, t) {
  ys[e] = t;
}
function _o(e, t) {
  return Object.entries(ys).forEach(([i, n]) => {
    Object.defineProperty(e, i, {
      get() {
        return (...s) => n.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var Eo = {
  get reactive() {
    return Dt;
  },
  get release() {
    return Nt;
  },
  get effect() {
    return Ct;
  },
  get raw() {
    return Tn;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: Sr,
  dontAutoEvaluateFunctions: Fn,
  disableEffectScheduling: br,
  startObservingMutations: bi,
  stopObservingMutations: Nn,
  setReactivityEngine: wr,
  onAttributeRemoved: kn,
  onAttributesAdded: On,
  closestDataStack: vt,
  skipDuringClone: ct,
  onlyDuringClone: to,
  addRootSelector: ts,
  addInitSelector: es,
  interceptClone: ke,
  addScopeToNode: ee,
  deferMutations: Tr,
  mapAttributes: Ei,
  evaluateLater: z,
  interceptInit: jr,
  setEvaluator: kr,
  mergeProxies: Pt,
  extractProp: go,
  findClosest: Rt,
  onElRemoved: gi,
  closestRoot: Ae,
  destroyTree: Mt,
  interceptor: Rn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ii,
  // INTERNAL
  setStyles: Oe,
  // INTERNAL
  mutateDom: O,
  directive: k,
  entangle: ps,
  throttle: fs,
  debounce: hs,
  evaluate: ft,
  initTree: tt,
  nextTick: Ci,
  prefixed: Lt,
  prefix: Lr,
  plugin: yo,
  magic: Y,
  store: vo,
  start: Ur,
  clone: io,
  // INTERNAL
  cloneNode: eo,
  // INTERNAL
  bound: mo,
  $data: Pn,
  watch: Sn,
  walk: bt,
  data: Io,
  bind: wo
}, ie = Eo, N = class {
  constructor(e, t, i, n) {
    this.type = e, this.value = t, this.start = i, this.end = n;
  }
}, To = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new N("EOF", null, this.position, this.position)), this.tokens;
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
    this.tokens.push(new N("NUMBER", parseFloat(i), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new N("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new N("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new N("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new N("KEYWORD", t, e, this.position)) : this.tokens.push(new N("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let i = "", n = !1;
    for (; this.position < this.input.length; ) {
      const s = this.input[this.position];
      if (n) {
        switch (s) {
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
            i += s;
        }
        n = !1;
      } else if (s === "\\")
        n = !0;
      else if (s === t) {
        this.position++, this.tokens.push(new N("STRING", i, e, this.position));
        return;
      } else
        i += s;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], i = this.peek(), n = this.peek(2);
    if (t === "=" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new N("OPERATOR", "===", e, this.position));
    else if (t === "!" && i === "=" && n === "=")
      this.position += 3, this.tokens.push(new N("OPERATOR", "!==", e, this.position));
    else if (t === "=" && i === "=")
      this.position += 2, this.tokens.push(new N("OPERATOR", "==", e, this.position));
    else if (t === "!" && i === "=")
      this.position += 2, this.tokens.push(new N("OPERATOR", "!=", e, this.position));
    else if (t === "<" && i === "=")
      this.position += 2, this.tokens.push(new N("OPERATOR", "<=", e, this.position));
    else if (t === ">" && i === "=")
      this.position += 2, this.tokens.push(new N("OPERATOR", ">=", e, this.position));
    else if (t === "&" && i === "&")
      this.position += 2, this.tokens.push(new N("OPERATOR", "&&", e, this.position));
    else if (t === "|" && i === "|")
      this.position += 2, this.tokens.push(new N("OPERATOR", "||", e, this.position));
    else if (t === "+" && i === "+")
      this.position += 2, this.tokens.push(new N("OPERATOR", "++", e, this.position));
    else if (t === "-" && i === "-")
      this.position += 2, this.tokens.push(new N("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const s = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new N(s, t, e, this.position));
    }
  }
}, So = class {
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
        for (let s = 1; s < e.length; s++)
          if (this.check(n, e[s]))
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
}, Co = class {
  evaluate({ node: e, scope: t = {}, context: i = null, allowGlobal: n = !1, forceBindingRootScopeToFunctions: s = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const f = t[e.name];
          return typeof f == "function" ? f.bind(t) : f;
        }
        if (n && typeof globalThis[e.name] < "u") {
          const f = globalThis[e.name];
          return typeof f == "function" ? f.bind(globalThis) : f;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const r = this.evaluate({ node: e.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
        if (r == null)
          throw new Error("Cannot read property of null or undefined");
        let o;
        if (e.computed) {
          const f = this.evaluate({ node: e.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
          o = r[f];
        } else
          o = r[e.property.name];
        return typeof o == "function" ? s ? o.bind(t) : o.bind(r) : o;
      case "CallExpression":
        const a = e.arguments.map((f) => this.evaluate({ node: f, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }));
        if (e.callee.type === "MemberExpression") {
          const f = this.evaluate({ node: e.callee.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
          let y;
          if (e.callee.computed) {
            const m = this.evaluate({ node: e.callee.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
            y = f[m];
          } else
            y = f[e.callee.property.name];
          if (typeof y != "function")
            throw new Error("Value is not a function");
          return y.apply(f, a);
        } else if (e.callee.type === "Identifier") {
          const f = e.callee.name;
          let y;
          if (f in t)
            y = t[f];
          else if (n && typeof globalThis[f] < "u")
            y = globalThis[f];
          else
            throw new Error(`Undefined variable: ${f}`);
          if (typeof y != "function")
            throw new Error("Value is not a function");
          const m = i !== null ? i : t;
          return y.apply(m, a);
        } else {
          const f = this.evaluate({ node: e.callee, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
          if (typeof f != "function")
            throw new Error("Value is not a function");
          return f.apply(i, a);
        }
      case "UnaryExpression":
        const l = this.evaluate({ node: e.argument, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
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
          const f = e.argument.name;
          if (!(f in t))
            throw new Error(`Undefined variable: ${f}`);
          const y = t[f];
          return e.operator === "++" ? t[f] = y + 1 : e.operator === "--" && (t[f] = y - 1), e.prefix ? t[f] : y;
        } else if (e.argument.type === "MemberExpression") {
          const f = this.evaluate({ node: e.argument.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }), y = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }) : e.argument.property.name, m = f[y];
          return e.operator === "++" ? f[y] = m + 1 : e.operator === "--" && (f[y] = m - 1), e.prefix ? f[y] : m;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const c = this.evaluate({ node: e.left, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }), u = this.evaluate({ node: e.right, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
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
        return this.evaluate({ node: e.test, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }) ? this.evaluate({ node: e.consequent, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }) : this.evaluate({ node: e.alternate, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
      case "AssignmentExpression":
        const h = this.evaluate({ node: e.right, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
        if (e.left.type === "Identifier")
          return t[e.left.name] = h, h;
        if (e.left.type === "MemberExpression") {
          const f = this.evaluate({ node: e.left.object, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
          if (e.left.computed) {
            const y = this.evaluate({ node: e.left.property, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
            f[y] = h;
          } else
            f[e.left.property.name] = h;
          return h;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((f) => this.evaluate({ node: f, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }));
      case "ObjectExpression":
        const g = {};
        for (const f of e.properties) {
          const y = f.computed ? this.evaluate({ node: f.key, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }) : f.key.type === "Identifier" ? f.key.name : this.evaluate({ node: f.key, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s }), m = this.evaluate({ node: f.value, scope: t, context: i, allowGlobal: n, forceBindingRootScopeToFunctions: s });
          g[y] = m;
        }
        return g;
      default:
        throw new Error(`Unknown node type: ${e.type}`);
    }
  }
};
function $o(e) {
  try {
    const i = new To(e).tokenize(), s = new So(i).parse(), r = new Co();
    return function(o = {}) {
      const { scope: a = {}, context: l = null, allowGlobal: c = !1, forceBindingRootScopeToFunctions: u = !1 } = o;
      return r.evaluate({ node: s, scope: a, context: l, allowGlobal: c, forceBindingRootScopeToFunctions: u });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Ao(e, t) {
  let i = Oo(e);
  if (typeof t == "function")
    return Un(i, t);
  let n = ko(e, t, i);
  return zn.bind(null, e, t, n);
}
function Oo(e) {
  let t = {};
  return be(t, e), [t, ...vt(e)];
}
function ko(e, t, i) {
  return (n = () => {
  }, { scope: s = {}, params: r = [] } = {}) => {
    let o = Pt([s, ...i]), l = $o(t)({
      scope: o,
      allowGlobal: !0,
      forceBindingRootScopeToFunctions: !0
    });
    if (Kt && typeof l == "function") {
      let c = l.apply(l, r);
      c instanceof Promise ? c.then((u) => n(u)) : n(c);
    } else typeof l == "object" && l instanceof Promise ? l.then((c) => n(c)) : n(l);
  };
}
function Do(e, t) {
  const i = /* @__PURE__ */ Object.create(null), n = e.split(",");
  for (let s = 0; s < n.length; s++)
    i[n[s]] = !0;
  return (s) => !!i[s];
}
var No = Object.freeze({}), Po = Object.prototype.hasOwnProperty, De = (e, t) => Po.call(e, t), pt = Array.isArray, Xt = (e) => vs(e) === "[object Map]", Lo = (e) => typeof e == "string", Oi = (e) => typeof e == "symbol", Ne = (e) => e !== null && typeof e == "object", Ro = Object.prototype.toString, vs = (e) => Ro.call(e), bs = (e) => vs(e).slice(8, -1), ki = (e) => Lo(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Mo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (i) => t[i] || (t[i] = e(i));
}, zo = Mo((e) => e.charAt(0).toUpperCase() + e.slice(1)), ws = (e, t) => e !== t && (e === e || t === t), si = /* @__PURE__ */ new WeakMap(), Ut = [], J, mt = Symbol("iterate"), ri = Symbol("Map key iterate");
function Fo(e) {
  return e && e._isEffect === !0;
}
function Bo(e, t = No) {
  Fo(e) && (e = e.raw);
  const i = jo(e, t);
  return t.lazy || i(), i;
}
function Uo(e) {
  e.active && (xs(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var Vo = 0;
function jo(e, t) {
  const i = function() {
    if (!i.active)
      return e();
    if (!Ut.includes(i)) {
      xs(i);
      try {
        return Wo(), Ut.push(i), J = i, e();
      } finally {
        Ut.pop(), Is(), J = Ut[Ut.length - 1];
      }
    }
  };
  return i.id = Vo++, i.allowRecurse = !!t.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = e, i.deps = [], i.options = t, i;
}
function xs(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let i = 0; i < t.length; i++)
      t[i].delete(e);
    t.length = 0;
  }
}
var At = !0, Di = [];
function Ho() {
  Di.push(At), At = !1;
}
function Wo() {
  Di.push(At), At = !0;
}
function Is() {
  const e = Di.pop();
  At = e === void 0 ? !0 : e;
}
function H(e, t, i) {
  if (!At || J === void 0)
    return;
  let n = si.get(e);
  n || si.set(e, n = /* @__PURE__ */ new Map());
  let s = n.get(i);
  s || n.set(i, s = /* @__PURE__ */ new Set()), s.has(J) || (s.add(J), J.deps.push(s), J.options.onTrack && J.options.onTrack({
    effect: J,
    target: e,
    type: t,
    key: i
  }));
}
function at(e, t, i, n, s, r) {
  const o = si.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== J || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (i === "length" && pt(e))
    o.forEach((u, d) => {
      (d === "length" || d >= n) && l(u);
    });
  else
    switch (i !== void 0 && l(o.get(i)), t) {
      case "add":
        pt(e) ? ki(i) && l(o.get("length")) : (l(o.get(mt)), Xt(e) && l(o.get(ri)));
        break;
      case "delete":
        pt(e) || (l(o.get(mt)), Xt(e) && l(o.get(ri)));
        break;
      case "set":
        Xt(e) && l(o.get(mt));
        break;
    }
  const c = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: e,
      key: i,
      type: t,
      newValue: n,
      oldValue: s,
      oldTarget: r
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(c);
}
var qo = /* @__PURE__ */ Do("__proto__,__v_isRef,__isVue"), _s = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Oi)), Yo = /* @__PURE__ */ Es(), Ko = /* @__PURE__ */ Es(!0), Ki = /* @__PURE__ */ Jo();
function Jo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...i) {
      const n = $(this);
      for (let r = 0, o = this.length; r < o; r++)
        H(n, "get", r + "");
      const s = n[t](...i);
      return s === -1 || s === !1 ? n[t](...i.map($)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...i) {
      Ho();
      const n = $(this)[t].apply(this, i);
      return Is(), n;
    };
  }), e;
}
function Es(e = !1, t = !1) {
  return function(n, s, r) {
    if (s === "__v_isReactive")
      return !e;
    if (s === "__v_isReadonly")
      return e;
    if (s === "__v_raw" && r === (e ? t ? ca : $s : t ? la : Cs).get(n))
      return n;
    const o = pt(n);
    if (!e && o && De(Ki, s))
      return Reflect.get(Ki, s, r);
    const a = Reflect.get(n, s, r);
    return (Oi(s) ? _s.has(s) : qo(s)) || (e || H(n, "get", s), t) ? a : oi(a) ? !o || !ki(s) ? a.value : a : Ne(a) ? e ? As(a) : Ri(a) : a;
  };
}
var Xo = /* @__PURE__ */ Zo();
function Zo(e = !1) {
  return function(i, n, s, r) {
    let o = i[n];
    if (!e && (s = $(s), o = $(o), !pt(i) && oi(o) && !oi(s)))
      return o.value = s, !0;
    const a = pt(i) && ki(n) ? Number(n) < i.length : De(i, n), l = Reflect.set(i, n, s, r);
    return i === $(r) && (a ? ws(s, o) && at(i, "set", n, s, o) : at(i, "add", n, s)), l;
  };
}
function Go(e, t) {
  const i = De(e, t), n = e[t], s = Reflect.deleteProperty(e, t);
  return s && i && at(e, "delete", t, void 0, n), s;
}
function Qo(e, t) {
  const i = Reflect.has(e, t);
  return (!Oi(t) || !_s.has(t)) && H(e, "has", t), i;
}
function ta(e) {
  return H(e, "iterate", pt(e) ? "length" : mt), Reflect.ownKeys(e);
}
var ea = {
  get: Yo,
  set: Xo,
  deleteProperty: Go,
  has: Qo,
  ownKeys: ta
}, ia = {
  get: Ko,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Ni = (e) => Ne(e) ? Ri(e) : e, Pi = (e) => Ne(e) ? As(e) : e, Li = (e) => e, Pe = (e) => Reflect.getPrototypeOf(e);
function oe(e, t, i = !1, n = !1) {
  e = e.__v_raw;
  const s = $(e), r = $(t);
  t !== r && !i && H(s, "get", t), !i && H(s, "get", r);
  const { has: o } = Pe(s), a = n ? Li : i ? Pi : Ni;
  if (o.call(s, t))
    return a(e.get(t));
  if (o.call(s, r))
    return a(e.get(r));
  e !== s && e.get(t);
}
function ae(e, t = !1) {
  const i = this.__v_raw, n = $(i), s = $(e);
  return e !== s && !t && H(n, "has", e), !t && H(n, "has", s), e === s ? i.has(e) : i.has(e) || i.has(s);
}
function le(e, t = !1) {
  return e = e.__v_raw, !t && H($(e), "iterate", mt), Reflect.get(e, "size", e);
}
function Ji(e) {
  e = $(e);
  const t = $(this);
  return Pe(t).has.call(t, e) || (t.add(e), at(t, "add", e, e)), this;
}
function Xi(e, t) {
  t = $(t);
  const i = $(this), { has: n, get: s } = Pe(i);
  let r = n.call(i, e);
  r ? Ss(i, n, e) : (e = $(e), r = n.call(i, e));
  const o = s.call(i, e);
  return i.set(e, t), r ? ws(t, o) && at(i, "set", e, t, o) : at(i, "add", e, t), this;
}
function Zi(e) {
  const t = $(this), { has: i, get: n } = Pe(t);
  let s = i.call(t, e);
  s ? Ss(t, i, e) : (e = $(e), s = i.call(t, e));
  const r = n ? n.call(t, e) : void 0, o = t.delete(e);
  return s && at(t, "delete", e, void 0, r), o;
}
function Gi() {
  const e = $(this), t = e.size !== 0, i = Xt(e) ? new Map(e) : new Set(e), n = e.clear();
  return t && at(e, "clear", void 0, void 0, i), n;
}
function ce(e, t) {
  return function(n, s) {
    const r = this, o = r.__v_raw, a = $(o), l = t ? Li : e ? Pi : Ni;
    return !e && H(a, "iterate", mt), o.forEach((c, u) => n.call(s, l(c), l(u), r));
  };
}
function ue(e, t, i) {
  return function(...n) {
    const s = this.__v_raw, r = $(s), o = Xt(r), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = s[e](...n), u = i ? Li : t ? Pi : Ni;
    return !t && H(r, "iterate", l ? ri : mt), {
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
function nt(e) {
  return function(...t) {
    {
      const i = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${zo(e)} operation ${i}failed: target is readonly.`, $(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function na() {
  const e = {
    get(r) {
      return oe(this, r);
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
  }, t = {
    get(r) {
      return oe(this, r, !1, !0);
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
    get(r) {
      return oe(this, r, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(r) {
      return ae.call(this, r, !0);
    },
    add: nt(
      "add"
      /* ADD */
    ),
    set: nt(
      "set"
      /* SET */
    ),
    delete: nt(
      "delete"
      /* DELETE */
    ),
    clear: nt(
      "clear"
      /* CLEAR */
    ),
    forEach: ce(!0, !1)
  }, n = {
    get(r) {
      return oe(this, r, !0, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(r) {
      return ae.call(this, r, !0);
    },
    add: nt(
      "add"
      /* ADD */
    ),
    set: nt(
      "set"
      /* SET */
    ),
    delete: nt(
      "delete"
      /* DELETE */
    ),
    clear: nt(
      "clear"
      /* CLEAR */
    ),
    forEach: ce(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((r) => {
    e[r] = ue(r, !1, !1), i[r] = ue(r, !0, !1), t[r] = ue(r, !1, !0), n[r] = ue(r, !0, !0);
  }), [
    e,
    i,
    t,
    n
  ];
}
var [sa, ra, lu, cu] = /* @__PURE__ */ na();
function Ts(e, t) {
  const i = e ? ra : sa;
  return (n, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? n : Reflect.get(De(i, s) && s in n ? i : n, s, r);
}
var oa = {
  get: /* @__PURE__ */ Ts(!1)
}, aa = {
  get: /* @__PURE__ */ Ts(!0)
};
function Ss(e, t, i) {
  const n = $(i);
  if (n !== i && t.call(e, n)) {
    const s = bs(e);
    console.warn(`Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Cs = /* @__PURE__ */ new WeakMap(), la = /* @__PURE__ */ new WeakMap(), $s = /* @__PURE__ */ new WeakMap(), ca = /* @__PURE__ */ new WeakMap();
function ua(e) {
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
function da(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ua(bs(e));
}
function Ri(e) {
  return e && e.__v_isReadonly ? e : Os(e, !1, ea, oa, Cs);
}
function As(e) {
  return Os(e, !0, ia, aa, $s);
}
function Os(e, t, i, n, s) {
  if (!Ne(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const o = da(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? n : i);
  return s.set(e, a), a;
}
function $(e) {
  return e && $(e.__v_raw) || e;
}
function oi(e) {
  return !!(e && e.__v_isRef === !0);
}
Y("nextTick", () => Ci);
Y("dispatch", (e) => Jt.bind(Jt, e));
Y("watch", (e, { evaluateLater: t, cleanup: i }) => (n, s) => {
  let r = t(n), a = Sn(() => {
    let l;
    return r((c) => l = c), l;
  }, s);
  i(a);
});
Y("store", bo);
Y("data", (e) => Pn(e));
Y("root", (e) => Ae(e));
Y("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Pt(ha(e))), e._x_refs_proxy));
function ha(e) {
  let t = [];
  return Rt(e, (i) => {
    i._x_refs && t.push(i._x_refs);
  }), t;
}
var Ue = {};
function ks(e) {
  return Ue[e] || (Ue[e] = 0), ++Ue[e];
}
function fa(e, t) {
  return Rt(e, (i) => {
    if (i._x_ids && i._x_ids[t])
      return !0;
  });
}
function pa(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = ks(t));
}
Y("id", (e, { cleanup: t }) => (i, n = null) => {
  let s = `${i}${n ? `-${n}` : ""}`;
  return ma(e, s, t, () => {
    let r = fa(e, i), o = r ? r._x_ids[i] : ks(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
ke((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function ma(e, t, i, n) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = n();
  return e._x_id[t] = s, i(() => {
    delete e._x_id[t];
  }), s;
}
Y("el", (e) => e);
Ds("Focus", "focus", "focus");
Ds("Persist", "persist", "persist");
function Ds(e, t, i) {
  Y(t, (n) => V(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
k("modelable", (e, { expression: t }, { effect: i, evaluateLater: n, cleanup: s }) => {
  let r = n(t), o = () => {
    let u;
    return r((d) => u = d), u;
  }, a = n(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, h = ps(
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
    s(h);
  });
});
k("teleport", (e, { modifiers: t, expression: i }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && V("x-teleport can only be used on a <template> tag", e);
  let s = Qi(i), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    r.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), ee(r, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  O(() => {
    o(r, s, t), ct(() => {
      tt(r);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Qi(i);
    O(() => {
      o(e._x_teleport, a, t);
    });
  }, n(
    () => O(() => {
      r.remove(), Mt(r);
    })
  );
});
var ga = document.createElement("div");
function Qi(e) {
  let t = ct(() => document.querySelector(e), () => ga)();
  return t || V(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Ns = () => {
};
Ns.inline = (e, { modifiers: t }, { cleanup: i }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, i(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
k("ignore", Ns);
k("effect", ct((e, { expression: t }, { effect: i }) => {
  i(z(e, t));
}));
function ai(e, t, i, n) {
  let s = e, r = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (t = ya(t)), i.includes("camel") && (t = va(t)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (s = window), i.includes("document") && (s = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = Ie(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    r = hs(r, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = Ie(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    r = fs(r, c);
  }
  return i.includes("prevent") && (r = a(r, (l, c) => {
    c.preventDefault(), l(c);
  })), i.includes("stop") && (r = a(r, (l, c) => {
    c.stopPropagation(), l(c);
  })), i.includes("once") && (r = a(r, (l, c) => {
    l(c), s.removeEventListener(t, r, o);
  })), (i.includes("away") || i.includes("outside")) && (s = document, r = a(r, (l, c) => {
    e.contains(c.target) || c.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(c));
  })), i.includes("self") && (r = a(r, (l, c) => {
    c.target === e && l(c);
  })), (wa(t) || Ps(t)) && (r = a(r, (l, c) => {
    xa(c, i) || l(c);
  })), s.addEventListener(t, r, o), () => {
    s.removeEventListener(t, r, o);
  };
}
function ya(e) {
  return e.replace(/-/g, ".");
}
function va(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Ie(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ba(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function wa(e) {
  return ["keydown", "keyup"].includes(e);
}
function Ps(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function xa(e, t) {
  let i = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(r));
  if (i.includes("debounce")) {
    let r = i.indexOf("debounce");
    i.splice(r, Ie((i[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let r = i.indexOf("throttle");
    i.splice(r, Ie((i[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && tn(e.key).includes(i[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => i.includes(r));
  return i = i.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === s.length && (Ps(e.type) || tn(e.key).includes(i[0])));
}
function tn(e) {
  if (!e)
    return [];
  e = ba(e);
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
k("model", (e, { modifiers: t, expression: i }, { effect: n, cleanup: s }) => {
  let r = e;
  t.includes("parent") && (r = e.parentNode);
  let o = z(r, i), a;
  typeof i == "string" ? a = z(r, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = z(r, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let h;
    return o((g) => h = g), en(h) ? h.get() : h;
  }, c = (h) => {
    let g;
    o((f) => g = f), en(g) ? g.set(h) : a(() => {
    }, {
      scope: { __placeholder: h }
    });
  };
  typeof i == "string" && e.type === "radio" && O(() => {
    e.hasAttribute("name") || e.setAttribute("name", i);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = ot ? () => {
  } : ai(e, u, t, (h) => {
    c(Ve(e, t, h, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Ai(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Ve(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, s(() => e._x_removeModelListeners.default()), e.form) {
    let h = ai(e.form, "reset", [], (g) => {
      Ci(() => e._x_model && e._x_model.set(Ve(e, t, { target: e }, l())));
    });
    s(() => h());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(h) {
      c(h);
    }
  }, e._x_forceModelUpdate = (h) => {
    h === void 0 && typeof i == "string" && i.match(/\./) && (h = ""), window.fromModel = !0, O(() => as(e, "value", h)), delete window.fromModel;
  }, n(() => {
    let h = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(h);
  });
});
function Ve(e, t, i, n) {
  return O(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Ai(e))
      if (Array.isArray(n)) {
        let s = null;
        return t.includes("number") ? s = je(i.target.value) : t.includes("boolean") ? s = ge(i.target.value) : s = i.target.value, i.target.checked ? n.includes(s) ? n : n.concat([s]) : n.filter((r) => !Ia(r, s));
      } else
        return i.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(i.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return je(r);
        }) : t.includes("boolean") ? Array.from(i.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return ge(r);
        }) : Array.from(i.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return ds(e) ? i.target.checked ? s = i.target.value : s = n : s = i.target.value, t.includes("number") ? je(s) : t.includes("boolean") ? ge(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function je(e) {
  let t = e ? parseFloat(e) : null;
  return _a(t) ? t : e;
}
function Ia(e, t) {
  return e == t;
}
function _a(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function en(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
k("cloak", (e) => queueMicrotask(() => O(() => e.removeAttribute(Lt("cloak")))));
es(() => `[${Lt("init")}]`);
k("init", ct((e, { expression: t }, { evaluate: i }) => typeof t == "string" ? !!t.trim() && i(t, {}, !1) : i(t, {}, !1)));
k("text", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let s = n(t);
  i(() => {
    s((r) => {
      O(() => {
        e.textContent = r;
      });
    });
  });
});
k("html", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let s = n(t);
  i(() => {
    s((r) => {
      O(() => {
        e.innerHTML = r, e._x_ignoreSelf = !0, tt(e), delete e._x_ignoreSelf;
      });
    });
  });
});
Ei(Wn(":", qn(Lt("bind:"))));
var Ls = (e, { value: t, modifiers: i, expression: n, original: s }, { effect: r, cleanup: o }) => {
  if (!t) {
    let l = {};
    xo(l), z(e, n)((u) => {
      gs(e, u, s);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Ea(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = z(e, n);
  r(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), O(() => as(e, t, l, i));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Ls.inline = (e, { value: t, modifiers: i, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: !1 });
};
k("bind", Ls);
function Ea(e, t) {
  e._x_keyExpression = t;
}
ts(() => `[${Lt("data")}]`);
k("data", (e, { expression: t }, { cleanup: i }) => {
  if (Ta(e))
    return;
  t = t === "" ? "{}" : t;
  let n = {};
  be(n, e);
  let s = {};
  _o(s, n);
  let r = ft(e, t, { scope: s });
  (r === void 0 || r === !0) && (r = {}), be(r, e);
  let o = Dt(r);
  Ln(o);
  let a = ee(e, o);
  o.init && ft(e, o.init), i(() => {
    o.destroy && ft(e, o.destroy), a();
  });
});
ke((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Ta(e) {
  return ot ? ni ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
k("show", (e, { modifiers: t, expression: i }, { effect: n }) => {
  let s = z(e, i);
  e._x_doHide || (e._x_doHide = () => {
    O(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    O(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let r = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, o = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(o), l = ei(
    (d) => d ? o() : r(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, o, r) : d ? a() : r();
    }
  ), c, u = !0;
  n(() => s((d) => {
    !u && d === c || (t.includes("immediate") && (d ? a() : r()), l(d), c = d, u = !1);
  }));
});
k("for", (e, { expression: t }, { effect: i, cleanup: n }) => {
  let s = Ca(t), r = z(e, s.items), o = z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, i(() => Sa(e, s, r, o)), n(() => {
    Object.values(e._x_lookup).forEach((a) => O(
      () => {
        Mt(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function Sa(e, t, i, n) {
  let s = (o) => typeof o == "object" && !Array.isArray(o), r = e;
  i((o) => {
    $a(o) && o >= 0 && (o = Array.from(Array(o).keys(), (m) => m + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (s(o))
      o = Object.entries(o).map(([m, v]) => {
        let p = nn(t, v, m, o);
        n((x) => {
          u.includes(x) && V("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: m, ...p } }), c.push(p);
      });
    else
      for (let m = 0; m < o.length; m++) {
        let v = nn(t, o[m], m, o);
        n((p) => {
          u.includes(p) && V("Duplicate key on x-for", e), u.push(p);
        }, { scope: { index: m, ...v } }), c.push(v);
      }
    let d = [], h = [], g = [], f = [];
    for (let m = 0; m < l.length; m++) {
      let v = l[m];
      u.indexOf(v) === -1 && g.push(v);
    }
    l = l.filter((m) => !g.includes(m));
    let y = "template";
    for (let m = 0; m < u.length; m++) {
      let v = u[m], p = l.indexOf(v);
      if (p === -1)
        l.splice(m, 0, v), d.push([y, m]);
      else if (p !== m) {
        let x = l.splice(m, 1)[0], _ = l.splice(p - 1, 1)[0];
        l.splice(m, 0, _), l.splice(p, 0, x), h.push([x, _]);
      } else
        f.push(v);
      y = v;
    }
    for (let m = 0; m < g.length; m++) {
      let v = g[m];
      v in a && (O(() => {
        Mt(a[v]), a[v].remove();
      }), delete a[v]);
    }
    for (let m = 0; m < h.length; m++) {
      let [v, p] = h[m], x = a[v], _ = a[p], I = document.createElement("div");
      O(() => {
        _ || V('x-for ":key" is undefined or invalid', r, p, a), _.after(I), x.after(_), _._x_currentIfEl && _.after(_._x_currentIfEl), I.before(x), x._x_currentIfEl && x.after(x._x_currentIfEl), I.remove();
      }), _._x_refreshXForScope(c[u.indexOf(p)]);
    }
    for (let m = 0; m < d.length; m++) {
      let [v, p] = d[m], x = v === "template" ? r : a[v];
      x._x_currentIfEl && (x = x._x_currentIfEl);
      let _ = c[p], I = u[p], b = document.importNode(r.content, !0).firstElementChild, w = Dt(_);
      ee(b, w, r), b._x_refreshXForScope = (E) => {
        Object.entries(E).forEach(([S, T]) => {
          w[S] = T;
        });
      }, O(() => {
        x.after(b), ct(() => tt(b))();
      }), typeof I == "object" && V("x-for key cannot be an object, it must be a string or an integer", r), a[I] = b;
    }
    for (let m = 0; m < f.length; m++)
      a[f[m]]._x_refreshXForScope(c[u.indexOf(f[m])]);
    r._x_prevKeys = u;
  });
}
function Ca(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(n);
  if (!s)
    return;
  let r = {};
  r.items = s[2].trim();
  let o = s[1].replace(i, "").trim(), a = o.match(t);
  return a ? (r.item = o.replace(t, "").trim(), r.index = a[1].trim(), a[2] && (r.collection = a[2].trim())) : r.item = o, r;
}
function nn(e, t, i, n) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    s[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    s[o] = t[o];
  }) : s[e.item] = t, e.index && (s[e.index] = i), e.collection && (s[e.collection] = n), s;
}
function $a(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Rs() {
}
Rs.inline = (e, { expression: t }, { cleanup: i }) => {
  let n = Ae(e);
  n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, i(() => delete n._x_refs[t]);
};
k("ref", Rs);
k("if", (e, { expression: t }, { effect: i, cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && V("x-if can only be used on a <template> tag", e);
  let s = z(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return ee(a, {}, e), O(() => {
      e.after(a), ct(() => tt(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      O(() => {
        Mt(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  i(() => s((a) => {
    a ? r() : o();
  })), n(() => e._x_undoIf && e._x_undoIf());
});
k("id", (e, { expression: t }, { evaluate: i }) => {
  i(t).forEach((s) => pa(e, s));
});
ke((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ei(Wn("@", qn(Lt("on:"))));
k("on", ct((e, { value: t, modifiers: i, expression: n }, { cleanup: s }) => {
  let r = n ? z(e, n) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = ai(e, t, i, (a) => {
    r(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  s(() => o());
}));
Le("Collapse", "collapse", "collapse");
Le("Intersect", "intersect", "intersect");
Le("Focus", "trap", "focus");
Le("Mask", "mask", "mask");
function Le(e, t, i) {
  k(t, (n) => V(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
ie.setEvaluator(Ao);
ie.setReactivityEngine({ reactive: Ri, effect: Bo, release: Uo, raw: $ });
var Aa = ie, Ms = Aa;
function Oa(e) {
  e.directive("collapse", t), t.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function t(i, { modifiers: n }) {
    let s = sn(n, "duration", 250) / 1e3, r = sn(n, "min", 0), o = !n.includes("min");
    i._x_isShown || (i.style.height = `${r}px`), !i._x_isShown && o && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let a = (c, u) => {
      let d = e.setStyles(c, u);
      return u.height ? () => {
      } : d;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${s}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    i._x_transition = {
      in(c = () => {
      }, u = () => {
      }) {
        o && (i.hidden = !1), o && (i.style.display = null);
        let d = i.getBoundingClientRect().height;
        i.style.height = "auto";
        let h = i.getBoundingClientRect().height;
        d === h && (d = r), e.transition(i, e.setStyles, {
          during: l,
          start: { height: d + "px" },
          end: { height: h + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - h) < 1 && (i.style.overflow = null);
        });
      },
      out(c = () => {
      }, u = () => {
      }) {
        let d = i.getBoundingClientRect().height;
        e.transition(i, a, {
          during: l,
          start: { height: d + "px" },
          end: { height: r + "px" }
        }, () => i.style.overflow = "hidden", () => {
          i._x_isShown = !1, i.style.height == `${r}px` && o && (i.style.display = "none", i.hidden = !0);
        });
      }
    };
  }
}
function sn(e, t, i) {
  if (e.indexOf(t) === -1)
    return i;
  const n = e[e.indexOf(t) + 1];
  if (!n)
    return i;
  if (t === "duration") {
    let s = n.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  if (t === "min") {
    let s = n.match(/([0-9]+)px/);
    if (s)
      return s[1];
  }
  return n;
}
var ka = Oa;
function Da(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: s }, { evaluateLater: r, cleanup: o }) => {
    let a = r(n), l = {
      rootMargin: La(s),
      threshold: Na(s)
    }, c = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting !== (i === "leave") && (a(), s.includes("once") && c.disconnect());
      });
    }, l);
    c.observe(t), o(() => {
      c.disconnect();
    });
  }));
}
function Na(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Pa(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function La(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let s = [];
  for (let r = 1; r < 5; r++)
    s.push(Pa(e[n + r] || ""));
  return s = s.filter((r) => r !== void 0), s.length ? s.join(" ").trim() : i;
}
var Ra = Da, zs = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], _e = /* @__PURE__ */ zs.join(","), Fs = typeof Element > "u", wt = Fs ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, li = !Fs && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, Bs = function(t, i, n) {
  var s = Array.prototype.slice.apply(t.querySelectorAll(_e));
  return i && wt.call(t, _e) && s.unshift(t), s = s.filter(n), s;
}, Us = function e(t, i, n) {
  for (var s = [], r = Array.from(t); r.length; ) {
    var o = r.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, n);
      n.flatten ? s.push.apply(s, c) : s.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = wt.call(o, _e);
      u && n.filter(o) && (i || !t.includes(o)) && s.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), h = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && h) {
        var g = e(d === !0 ? o.children : d.children, !0, n);
        n.flatten ? s.push.apply(s, g) : s.push({
          scope: o,
          candidates: g
        });
      } else
        r.unshift.apply(r, o.children);
    }
  }
  return s;
}, Vs = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Ma = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, js = function(t) {
  return t.tagName === "INPUT";
}, za = function(t) {
  return js(t) && t.type === "hidden";
}, Fa = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Ba = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, Ua = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || li(t), n = function(a) {
    return i.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, s;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    s = n(window.CSS.escape(t.name));
  else
    try {
      s = n(t.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var r = Ba(s, t.form);
  return !r || r === t;
}, Va = function(t) {
  return js(t) && t.type === "radio";
}, ja = function(t) {
  return Va(t) && !Ua(t);
}, rn = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, s = i.height;
  return n === 0 && s === 0;
}, Ha = function(t, i) {
  var n = i.displayCheck, s = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var r = wt.call(t, "details>summary:first-of-type"), o = r ? t.parentElement : t;
  if (wt.call(o, "details:not([open]) *"))
    return !0;
  var a = li(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof s == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = li(t);
        if (u && !u.shadowRoot && s(u) === !0)
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
}, Wa = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var s = i.children.item(n);
          if (s.tagName === "LEGEND")
            return wt.call(i, "fieldset[disabled] *") ? !0 : !s.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, Ee = function(t, i) {
  return !(i.disabled || za(i) || Ha(i, t) || // For a details element with a summary, the summary element gets the focus
  Fa(i) || Wa(i));
}, ci = function(t, i) {
  return !(ja(i) || Vs(i) < 0 || !Ee(t, i));
}, qa = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Ya = function e(t) {
  var i = [], n = [];
  return t.forEach(function(s, r) {
    var o = !!s.scope, a = o ? s.scope : s, l = Vs(a, o), c = o ? e(s.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: r,
      tabIndex: l,
      item: s,
      isScope: o,
      content: c
    });
  }), n.sort(Ma).reduce(function(s, r) {
    return r.isScope ? s.push.apply(s, r.content) : s.push(r.content), s;
  }, []).concat(i);
}, Ka = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Us([t], i.includeContainer, {
    filter: ci.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: qa
  }) : n = Bs(t, i.includeContainer, ci.bind(null, i)), Ya(n);
}, Hs = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Us([t], i.includeContainer, {
    filter: Ee.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = Bs(t, i.includeContainer, Ee.bind(null, i)), n;
}, de = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return wt.call(t, _e) === !1 ? !1 : ci(i, t);
}, Ja = /* @__PURE__ */ zs.concat("iframe").join(","), ye = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return wt.call(t, Ja) === !1 ? !1 : Ee(i, t);
};
function on(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(s) {
      return Object.getOwnPropertyDescriptor(e, s).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function an(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = arguments[t] != null ? arguments[t] : {};
    t % 2 ? on(Object(i), !0).forEach(function(n) {
      Xa(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : on(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function Xa(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var ln = /* @__PURE__ */ function() {
  var e = [];
  return {
    activateTrap: function(i) {
      if (e.length > 0) {
        var n = e[e.length - 1];
        n !== i && n.pause();
      }
      var s = e.indexOf(i);
      s === -1 || e.splice(s, 1), e.push(i);
    },
    deactivateTrap: function(i) {
      var n = e.indexOf(i);
      n !== -1 && e.splice(n, 1), e.length > 0 && e[e.length - 1].unpause();
    }
  };
}(), Za = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Ga = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, Qa = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, cn = function(t) {
  return setTimeout(t, 0);
}, un = function(t, i) {
  var n = -1;
  return t.every(function(s, r) {
    return i(s) ? (n = r, !1) : !0;
  }), n;
}, Vt = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++)
    n[s - 1] = arguments[s];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, he = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, tl = function(t, i) {
  var n = i?.document || document, s = an({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, i), r = {
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
  }, o, a = function(b, w, E) {
    return b && b[w] !== void 0 ? b[w] : s[E || w];
  }, l = function(b) {
    return r.containerGroups.findIndex(function(w) {
      var E = w.container, S = w.tabbableNodes;
      return E.contains(b) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      S.find(function(T) {
        return T === b;
      });
    });
  }, c = function(b) {
    var w = s[b];
    if (typeof w == "function") {
      for (var E = arguments.length, S = new Array(E > 1 ? E - 1 : 0), T = 1; T < E; T++)
        S[T - 1] = arguments[T];
      w = w.apply(void 0, S);
    }
    if (w === !0 && (w = void 0), !w) {
      if (w === void 0 || w === !1)
        return w;
      throw new Error("`".concat(b, "` was specified but was not a node, or did not return a node"));
    }
    var A = w;
    if (typeof w == "string" && (A = n.querySelector(w), !A))
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
        var w = r.tabbableGroups[0], E = w && w.firstTabbableNode;
        b = E || c("fallbackFocus");
      }
    if (!b)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return b;
  }, d = function() {
    if (r.containerGroups = r.containers.map(function(b) {
      var w = Ka(b, s.tabbableOptions), E = Hs(b, s.tabbableOptions);
      return {
        container: b,
        tabbableNodes: w,
        focusableNodes: E,
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
          var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, D = E.findIndex(function(L) {
            return L === T;
          });
          if (!(D < 0))
            return A ? E.slice(D + 1).find(function(L) {
              return de(L, s.tabbableOptions);
            }) : E.slice(0, D).reverse().find(function(L) {
              return de(L, s.tabbableOptions);
            });
        }
      };
    }), r.tabbableGroups = r.containerGroups.filter(function(b) {
      return b.tabbableNodes.length > 0;
    }), r.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, h = function I(b) {
    if (b !== !1 && b !== n.activeElement) {
      if (!b || !b.focus) {
        I(u());
        return;
      }
      b.focus({
        preventScroll: !!s.preventScroll
      }), r.mostRecentlyFocusedNode = b, Za(b) && b.select();
    }
  }, g = function(b) {
    var w = c("setReturnFocus", b);
    return w || (w === !1 ? !1 : b);
  }, f = function(b) {
    var w = he(b);
    if (!(l(w) >= 0)) {
      if (Vt(s.clickOutsideDeactivates, b)) {
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
          returnFocus: s.returnFocusOnDeactivate && !ye(w, s.tabbableOptions)
        });
        return;
      }
      Vt(s.allowOutsideClick, b) || b.preventDefault();
    }
  }, y = function(b) {
    var w = he(b), E = l(w) >= 0;
    E || w instanceof Document ? E && (r.mostRecentlyFocusedNode = w) : (b.stopImmediatePropagation(), h(r.mostRecentlyFocusedNode || u()));
  }, m = function(b) {
    var w = he(b);
    d();
    var E = null;
    if (r.tabbableGroups.length > 0) {
      var S = l(w), T = S >= 0 ? r.containerGroups[S] : void 0;
      if (S < 0)
        b.shiftKey ? E = r.tabbableGroups[r.tabbableGroups.length - 1].lastTabbableNode : E = r.tabbableGroups[0].firstTabbableNode;
      else if (b.shiftKey) {
        var A = un(r.tabbableGroups, function(M) {
          var U = M.firstTabbableNode;
          return w === U;
        });
        if (A < 0 && (T.container === w || ye(w, s.tabbableOptions) && !de(w, s.tabbableOptions) && !T.nextTabbableNode(w, !1)) && (A = S), A >= 0) {
          var D = A === 0 ? r.tabbableGroups.length - 1 : A - 1, L = r.tabbableGroups[D];
          E = L.lastTabbableNode;
        }
      } else {
        var P = un(r.tabbableGroups, function(M) {
          var U = M.lastTabbableNode;
          return w === U;
        });
        if (P < 0 && (T.container === w || ye(w, s.tabbableOptions) && !de(w, s.tabbableOptions) && !T.nextTabbableNode(w)) && (P = S), P >= 0) {
          var R = P === r.tabbableGroups.length - 1 ? 0 : P + 1, j = r.tabbableGroups[R];
          E = j.firstTabbableNode;
        }
      }
    } else
      E = c("fallbackFocus");
    E && (b.preventDefault(), h(E));
  }, v = function(b) {
    if (Ga(b) && Vt(s.escapeDeactivates, b) !== !1) {
      b.preventDefault(), o.deactivate();
      return;
    }
    if (Qa(b)) {
      m(b);
      return;
    }
  }, p = function(b) {
    var w = he(b);
    l(w) >= 0 || Vt(s.clickOutsideDeactivates, b) || Vt(s.allowOutsideClick, b) || (b.preventDefault(), b.stopImmediatePropagation());
  }, x = function() {
    if (r.active)
      return ln.activateTrap(o), r.delayInitialFocusTimer = s.delayInitialFocus ? cn(function() {
        h(u());
      }) : h(u()), n.addEventListener("focusin", y, !0), n.addEventListener("mousedown", f, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", f, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", p, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", v, {
        capture: !0,
        passive: !1
      }), o;
  }, _ = function() {
    if (r.active)
      return n.removeEventListener("focusin", y, !0), n.removeEventListener("mousedown", f, !0), n.removeEventListener("touchstart", f, !0), n.removeEventListener("click", p, !0), n.removeEventListener("keydown", v, !0), o;
  };
  return o = {
    get active() {
      return r.active;
    },
    get paused() {
      return r.paused;
    },
    activate: function(b) {
      if (r.active)
        return this;
      var w = a(b, "onActivate"), E = a(b, "onPostActivate"), S = a(b, "checkCanFocusTrap");
      S || d(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = n.activeElement, w && w();
      var T = function() {
        S && d(), x(), E && E();
      };
      return S ? (S(r.containers.concat()).then(T, T), this) : (T(), this);
    },
    deactivate: function(b) {
      if (!r.active)
        return this;
      var w = an({
        onDeactivate: s.onDeactivate,
        onPostDeactivate: s.onPostDeactivate,
        checkCanReturnFocus: s.checkCanReturnFocus
      }, b);
      clearTimeout(r.delayInitialFocusTimer), r.delayInitialFocusTimer = void 0, _(), r.active = !1, r.paused = !1, ln.deactivateTrap(o);
      var E = a(w, "onDeactivate"), S = a(w, "onPostDeactivate"), T = a(w, "checkCanReturnFocus"), A = a(w, "returnFocus", "returnFocusOnDeactivate");
      E && E();
      var D = function() {
        cn(function() {
          A && h(g(r.nodeFocusedBeforeActivation)), S && S();
        });
      };
      return A && T ? (T(g(r.nodeFocusedBeforeActivation)).then(D, D), this) : (D(), this);
    },
    pause: function() {
      return r.paused || !r.active ? this : (r.paused = !0, _(), this);
    },
    unpause: function() {
      return !r.paused || !r.active ? this : (r.paused = !1, d(), x(), this);
    },
    updateContainerElements: function(b) {
      var w = [].concat(b).filter(Boolean);
      return r.containers = w.map(function(E) {
        return typeof E == "string" ? n.querySelector(E) : E;
      }), r.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function el(e) {
  let t, i;
  window.addEventListener("focusin", () => {
    t = i, i = document.activeElement;
  }), e.magic("focus", (n) => {
    let s = n;
    return {
      __noscroll: !1,
      __wrapAround: !1,
      within(r) {
        return s = r, this;
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
      focusable(r) {
        return ye(r);
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
        return Array.isArray(s) ? s : Hs(s, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(r) {
        let o = this.all();
        return o[0] && o[0].isSameNode(r);
      },
      isLast(r) {
        let o = this.all();
        return o.length && o.slice(-1)[0].isSameNode(r);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let r = this.all(), o = document.activeElement;
        if (r.indexOf(o) !== -1)
          return this.__wrapAround && r.indexOf(o) === r.length - 1 ? r[0] : r[r.indexOf(o) + 1];
      },
      getPrevious() {
        let r = this.all(), o = document.activeElement;
        if (r.indexOf(o) !== -1)
          return this.__wrapAround && r.indexOf(o) === 0 ? r.slice(-1)[0] : r[r.indexOf(o) - 1];
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
      focus(r) {
        r && setTimeout(() => {
          r.hasAttribute("tabindex") || r.setAttribute("tabindex", "0"), r.focus({ preventScroll: this.__noscroll });
        });
      }
    };
  }), e.directive("trap", e.skipDuringClone(
    (n, { expression: s, modifiers: r }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let c = a(s), u = !1, d = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => n
      }, h = () => {
      };
      if (r.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let m = n.querySelector("[autofocus]");
        m && (d.initialFocus = m);
      }
      r.includes("inert") && (d.onPostActivate = () => {
        e.nextTick(() => {
          h = dn(n);
        });
      });
      let g = tl(n, d), f = () => {
      };
      const y = () => {
        h(), h = () => {
        }, f(), f = () => {
        }, g.deactivate({
          returnFocus: !r.includes("noreturn")
        });
      };
      o(() => c((m) => {
        u !== m && (m && !u && (r.includes("noscroll") && (f = il()), setTimeout(() => {
          g.activate();
        }, 15)), !m && u && y(), u = !!m);
      })), l(y);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: s, modifiers: r }, { evaluate: o }) => {
      r.includes("inert") && o(s) && dn(n);
    }
  ));
}
function dn(e) {
  let t = [];
  return Ws(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Ws(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? Ws(e.parentNode, t) : t(i);
  });
}
function il() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var nl = el;
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
function sl() {
  return !0;
}
function rl({ component: e, argument: t }) {
  return new Promise((i) => {
    if (t)
      window.addEventListener(
        t,
        () => i(),
        { once: !0 }
      );
    else {
      const n = (s) => {
        s.detail.id === e.id && (window.removeEventListener("async-alpine:load", n), i());
      };
      window.addEventListener("async-alpine:load", n);
    }
  });
}
function ol() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function al({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const i = window.matchMedia(`(${e})`);
    i.matches ? t() : i.addEventListener("change", t, { once: !0 });
  });
}
function ll({ component: e, argument: t }) {
  return new Promise((i) => {
    const n = t || "0px 0px 0px 0px", s = new IntersectionObserver((r) => {
      r[0].isIntersecting && (s.disconnect(), i());
    }, { rootMargin: n });
    s.observe(e.el);
  });
}
var hn = {
  eager: sl,
  event: rl,
  idle: ol,
  media: al,
  visible: ll
};
async function cl(e) {
  const t = ul(e.strategy);
  await ui(e, t);
}
async function ui(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((i) => ui(e, i))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((i) => ui(e, i))
      );
  }
  return hn[t.method] ? hn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function ul(e) {
  const t = dl(e);
  let i = qs(t);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function dl(e) {
  const t = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, i = [];
  let n;
  for (; (n = t.exec(e)) !== null; ) {
    const [s, r, o, a] = n;
    if (r !== void 0)
      i.push({ type: "parenthesis", value: r });
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
function qs(e) {
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
    const t = qs(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function hl(e) {
  const t = "load", i = e.prefixed("load-src"), n = e.prefixed("ignore");
  let s = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, r = !1, o = {}, a = 0;
  function l() {
    return a++;
  }
  e.asyncOptions = (p) => {
    s = {
      ...s,
      ...p
    };
  }, e.asyncData = (p, x = !1) => {
    o[p] = {
      loaded: !1,
      download: x
    };
  }, e.asyncUrl = (p, x) => {
    !p || !x || o[p] || (o[p] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        v(x)
      )
    });
  }, e.asyncAlias = (p) => {
    r = p;
  };
  const c = (p) => {
    e.skipDuringClone(() => {
      p._x_async || (p._x_async = "init", p._x_ignore = !0, p.setAttribute(n, ""));
    })();
  }, u = async (p) => {
    e.skipDuringClone(async () => {
      if (p._x_async !== "init") return;
      p._x_async = "await";
      const { name: x, strategy: _ } = d(p);
      await cl({
        name: x,
        strategy: _,
        el: p,
        id: p.id || l()
      }), p.isConnected && (await h(x), p.isConnected && (f(p), p._x_async = "loaded"));
    })();
  };
  u.inline = c, e.directive(t, u).before("ignore");
  function d(p) {
    const x = m(p.getAttribute(e.prefixed("data"))), _ = p.getAttribute(e.prefixed(t)) || s.defaultStrategy, I = p.getAttribute(i);
    return I && e.asyncUrl(x, I), {
      name: x,
      strategy: _
    };
  }
  async function h(p) {
    if (p.startsWith("_x_async_") || (y(p), !o[p] || o[p].loaded)) return;
    const x = await g(p);
    e.data(p, x), o[p].loaded = !0;
  }
  async function g(p) {
    if (!o[p]) return;
    const x = await o[p].download(p);
    return typeof x == "function" ? x : x[p] || x.default || Object.values(x)[0] || !1;
  }
  function f(p) {
    e.destroyTree(p), p._x_ignore = !1, p.removeAttribute(n), !p.closest(`[${n}]`) && e.initTree(p);
  }
  function y(p) {
    if (!(!r || o[p])) {
      if (typeof r == "function") {
        e.asyncData(p, r);
        return;
      }
      e.asyncUrl(p, r.replaceAll("[name]", p));
    }
  }
  function m(p) {
    return (p || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function v(p) {
    return s.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(p) ? p : new URL(p, document.baseURI).href;
  }
}
function fl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function pl(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function ml(e, t, i) {
  return t && pl(e.prototype, t), e;
}
var gl = Object.defineProperty, et = function(e, t) {
  return gl(e, "name", { value: t, configurable: !0 });
}, yl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, vl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, bl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, wl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, xl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Il = et(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), jt = et(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), C = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, st = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, pn = { OUTLINE: "outline", FILLED: "filled" }, He = { FADE: "fade", SLIDE: "slide" }, Ht = { CLOSE: jt(yl), SUCCESS: jt(wl), ERROR: jt(vl), WARNING: jt(xl), INFO: jt(bl) }, mn = et(function(e) {
  e.wrapper.classList.add(C.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), gn = et(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), _l = et(function(e) {
  e.wrapper.classList.add(C.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), El = et(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Ys = function() {
  function e(t) {
    var i = this;
    fl(this, e), this.notifyOut = et(function(M) {
      M(i);
    }, "notifyOut");
    var n = t.notificationsGap, s = n === void 0 ? 20 : n, r = t.notificationsPadding, o = r === void 0 ? 20 : r, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? He.FADE : c, d = t.type, h = d === void 0 ? "outline" : d, g = t.title, f = t.text, y = t.showIcon, m = y === void 0 ? !0 : y, v = t.customIcon, p = v === void 0 ? "" : v, x = t.customClass, _ = x === void 0 ? "" : x, I = t.speed, b = I === void 0 ? 500 : I, w = t.showCloseButton, E = w === void 0 ? !0 : w, S = t.autoclose, T = S === void 0 ? !0 : S, A = t.autotimeout, D = A === void 0 ? 3e3 : A, L = t.position, P = L === void 0 ? "right top" : L, R = t.customWrapper, j = R === void 0 ? "" : R;
    if (this.customWrapper = j, this.status = l, this.title = g, this.text = f, this.showIcon = m, this.customIcon = p, this.customClass = _, this.speed = b, this.effect = u, this.showCloseButton = E, this.autoclose = T, this.autotimeout = D, this.notificationsGap = s, this.notificationsPadding = o, this.type = h, this.position = P, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return ml(e, [{ key: "checkRequirements", value: function() {
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
    switch (this.customWrapper ? this.wrapper = Il(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(C.NOTIFY), this.type) {
      case pn.OUTLINE:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
        break;
      case pn.FILLED:
        this.wrapper.classList.add(C.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case st.SUCCESS:
        this.wrapper.classList.add(C.NOTIFY_SUCCESS);
        break;
      case st.ERROR:
        this.wrapper.classList.add(C.NOTIFY_ERROR);
        break;
      case st.WARNING:
        this.wrapper.classList.add(C.NOTIFY_WARNING);
        break;
      case st.INFO:
        this.wrapper.classList.add(C.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(C.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(C.NOTIFY_CONTENT);
    var n, s;
    this.title && (n = document.createElement("div"), n.classList.add(C.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(C.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(s);
  } }, { key: "setIcon", value: function() {
    var i = et(function(s) {
      switch (s) {
        case st.SUCCESS:
          return Ht.SUCCESS;
        case st.ERROR:
          return Ht.ERROR;
        case st.WARNING:
          return Ht.WARNING;
        case st.INFO:
          return Ht.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(C.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
  } }, { key: "setObserver", value: function() {
    var i = this, n = new IntersectionObserver(function(s) {
      if (s[0].intersectionRatio <= 0) i.close();
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
        this.selectedNotifyInEffect = mn, this.selectedNotifyOutEffect = gn;
        break;
      case He.SLIDE:
        this.selectedNotifyInEffect = _l, this.selectedNotifyOutEffect = El;
        break;
      default:
        this.selectedNotifyInEffect = mn, this.selectedNotifyOutEffect = gn;
    }
  } }]), e;
}();
et(Ys, "Notify");
var Ks = Ys;
globalThis.Notify = Ks;
const Js = ["success", "error", "warning", "info"], Xs = [
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
], Zs = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Wt(e = {}) {
  const t = {
    ...Zs,
    ...e
  };
  Js.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Xs.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Ks(t);
}
const Tl = {
  custom: Wt,
  success(e, t = "Success", i = {}) {
    Wt({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    Wt({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    Wt({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    Wt({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(Zs, e);
  },
  get allowedStatuses() {
    return [...Js];
  },
  get allowedPositions() {
    return [...Xs];
  }
}, di = function() {
}, Gt = {}, Te = {}, Qt = {};
function Sl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, s = n, r, o, a, l;
  for (r = function(c, u) {
    u.length && i.push(c), s--, s || t(i);
  }; n--; ) {
    if (o = e[n], a = Te[o], a) {
      r(o, a);
      continue;
    }
    l = Qt[o] = Qt[o] || [], l.push(r);
  }
}
function Gs(e, t) {
  if (!e) return;
  const i = Qt[e];
  if (Te[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function hi(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || di)(t) : (e.success || di)(e);
}
function Cl(e, t, i, n, s, r, o, a) {
  let l = e.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (r += 1, r < o)
      return Qs(t, n, s, r);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function Qs(e, t, i, n) {
  const s = document, r = i.async, o = (i.numRetries || 0) + 1, a = i.before || di, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, h;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    h = s.createElement("link"), h.rel = "stylesheet", h.href = c, u = "hideFocus" in h, u && h.relList && (u = 0, h.rel = "preload", h.as = "style"), i.inlineStyleNonce && h.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    h = s.createElement("img"), h.src = c;
  else if (h = s.createElement("script"), h.src = c, h.async = r === void 0 ? !0 : r, i.inlineScriptNonce && h.setAttribute("nonce", i.inlineScriptNonce), d = "noModule" in h, /^module!/.test(l)) {
    if (!d) return t(e, "l");
    h.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return t(e, "l");
  const g = function(f) {
    Cl(f, e, h, t, i, n, o, u);
  };
  h.addEventListener("load", g, { once: !0 }), h.addEventListener("error", g, { once: !0 }), a(e, h) !== !1 && s.head.appendChild(h);
}
function $l(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, s = [];
  function r(o, a, l) {
    if (a === "e" && s.push(o), a === "b")
      if (l) s.push(o);
      else return;
    n--, n || t(s);
  }
  for (let o = 0; o < e.length; o++)
    Qs(e[o], r, i);
}
function rt(e, t, i) {
  let n, s;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), s = (n ? i : t) || {}, n) {
    if (n in Gt)
      throw "LoadJS";
    Gt[n] = !0;
  }
  function r(o, a) {
    $l(e, function(l) {
      hi(s, l), o && hi({ success: o, error: a }, l), Gs(n, l);
    }, s);
  }
  if (s.returnPromise)
    return new Promise(r);
  r();
}
rt.ready = function(t, i) {
  return Sl(t, function(n) {
    hi(i, n);
  }), rt;
};
rt.done = function(t) {
  Gs(t, []);
};
rt.reset = function() {
  Object.keys(Gt).forEach((t) => delete Gt[t]), Object.keys(Te).forEach((t) => delete Te[t]), Object.keys(Qt).forEach((t) => delete Qt[t]);
};
rt.isDefined = function(t) {
  return t in Gt;
};
function Al(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = Ol(e) || e;
    let i = Alpine.$data(t);
    if (i === void 0) {
      const n = t.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && yn("element", t), i;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${er(t)}"]`;
    let n = null;
    const s = document.getElementById(t);
    if (s && (n = s.matches(i) ? s : s.querySelector(i)), n || (n = tr(t)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const r = Alpine.$data(n);
    return r === void 0 && yn(`data-alpine-root="${t}"`, n), r;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Ol(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", i = e.getAttribute?.("data-for");
  if (t || i) {
    const n = i || "";
    if (!n) return e;
    const s = tr(n);
    return s || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return e;
}
function tr(e) {
  const t = `[data-alpine-root="${er(e)}"]`, i = document.querySelectorAll(t);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(e) || null;
}
function er(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function yn(e, t) {
  const i = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function kl(e) {
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
function Dl(e) {
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
function Nl(e) {
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
function Pl(e) {
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
function Ll(e) {
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
function Rl(e, t) {
  e.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.configId, s = this.$el.dataset.nonce;
      if (i.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      t(i, {
        success: () => {
          this.initCalendar(n);
        },
        error: (r) => console.error("RzCalendar: Failed to load assets", r)
      }, s);
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
      let s = {};
      try {
        s = JSON.parse(n.textContent);
      } catch (a) {
        console.error("RzCalendar: Failed to parse config JSON", a);
        return;
      }
      const r = {
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
        ...s.options,
        styles: s.styles,
        ...r
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
function Ml(e) {
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
        const s = JSON.parse(this.$el.dataset.initialDates || "[]");
        this.dates = this._normalize(s);
      } catch {
        this.dates = [];
      }
      const t = (s) => {
        this.calendarApi = s.detail.instance, this.syncToCalendar();
      };
      this.$el.addEventListener("rz:calendar:init", t), this._handlers.push({ type: "rz:calendar:init", fn: t });
      const i = () => {
        this.calendarApi = null, this._lastAppliedState = null;
      };
      this.$el.addEventListener("rz:calendar:destroy", i), this._handlers.push({ type: "rz:calendar:destroy", fn: i });
      const n = (s) => {
        this._isUpdatingFromCalendar = !0;
        const r = this.isRangeComplete;
        this.dates = this._normalize(s.detail.dates || []), !r && this.isRangeComplete && this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
          detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
          bubbles: !0,
          composed: !0
        })), this.$nextTick(() => this._isUpdatingFromCalendar = !1);
      };
      this.$el.addEventListener("rz:calendar:click-day", n), this._handlers.push({ type: "rz:calendar:click-day", fn: n }), this.$watch("dates", () => {
        if (this._isUpdatingFromCalendar) return;
        const s = Array.isArray(this.dates) ? this.dates : [], r = this._normalize(s);
        if (!Array.isArray(this.dates) || r.length !== this.dates.length || r.some((a, l) => a !== this.dates[l])) {
          this.dates = r;
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
      let i, n, s = !1;
      if (this.dates.length > 0) {
        const a = this.parseIsoLocal(this.dates[0]);
        isNaN(a.getTime()) || (i = a.getMonth(), n = a.getFullYear(), s = !0);
      }
      const r = JSON.stringify({ mode: this.mode, dates: t, m: i, y: n });
      if (this._lastAppliedState === r) return;
      this._lastAppliedState = r;
      const o = { selectedDates: t };
      s && (o.selectedMonth = i, o.selectedYear = n), this.calendarApi.set(
        o,
        {
          dates: !0,
          month: s,
          year: s,
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
      const [i, n, s] = t.split("-").map(Number), r = new Date(Date.UTC(i, n - 1, s));
      return r.getUTCFullYear() === i && r.getUTCMonth() + 1 === n && r.getUTCDate() === s;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(t) {
      const n = (Array.isArray(t) ? t : []).flat(1 / 0).flatMap((s) => typeof s == "string" ? this._extractIsoDates(s) : []).filter((s) => this._isValidIsoDate(s));
      if (this.mode === "single")
        return [...new Set(n)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const s = n.sort();
        return s.length <= 1 ? s : [s[0], s[s.length - 1]];
      }
      return [...new Set(n)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(t) {
      const [i, n, s] = t.split("-").map(Number);
      return new Date(i, n - 1, s);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(t) {
      const i = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getDate()).padStart(2, "0");
      return `${i}-${n}-${s}`;
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
function zl(e, t) {
  function i(n) {
    if (!n) return {};
    const s = document.getElementById(n);
    if (!s)
      return console.warn(`[rzCarousel] JSON script element #${n} not found.`), {};
    try {
      return JSON.parse(s.textContent || "{}");
    } catch (r) {
      return console.error(`[rzCarousel] Failed to parse JSON from #${n}:`, r), {};
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
      })(), s = this.$el.dataset.nonce || "", r = i(this.$el.dataset.config), o = r.Options || {}, a = r.Plugins || [], l = this;
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
        s
      ) : window.EmblaCarousel ? this.initializeEmbla(o, a) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    /**
     * Executes the `initializeEmbla` operation.
     * @param {any} options Input value for this method.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `initializeEmbla` when applicable.
     */
    initializeEmbla(n, s) {
      const r = this.$el.querySelector('[x-ref="viewport"]');
      if (!r) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(s);
      this.emblaApi = window.EmblaCarousel(r, n, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
    instantiatePlugins(n) {
      return !Array.isArray(n) || n.length === 0 ? [] : n.map((s) => {
        const r = window[s.Name];
        if (typeof r != "function")
          return console.error(`[rzCarousel] Plugin constructor '${s.Name}' not found on window object.`), null;
        try {
          return r(s.Options || {});
        } catch (o) {
          return console.error(`[rzCarousel] Error instantiating plugin '${s.Name}':`, o), null;
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
function Fl(e, t) {
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
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.codeid, s = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, t(i, {
        success: function() {
          const r = document.getElementById(n);
          window.hljs && r && window.hljs.highlightElement(r);
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, s);
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
function Bl(e) {
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
function Ul(e, t) {
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
        error: (s) => console.error("RzCombobox: Failed to load assets.", s)
      }, n) : window.TomSelect && this.initTomSelect();
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const i = this.$refs.selectInput;
      if (!i) return;
      const n = document.getElementById(this.$el.dataset.configId), s = n ? JSON.parse(n.textContent) : {}, r = {}, o = (a, l) => {
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
      this.$refs.optionTemplate && (r.option = (a, l) => o(this.$refs.optionTemplate, a)), this.$refs.itemTemplate && (r.item = (a, l) => o(this.$refs.itemTemplate, a)), s.dataAttr = "data-item", this.tomSelect = new TomSelect(i, {
        ...s,
        render: r,
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
function Vl(e, t) {
  e.data("rzColorPickerProvider", () => ({
    colorPicker: {
      value: "",
      open: null,
      setValue: null,
      getValue: null,
      updateConfiguration: null
    },
    config: {},
    _isSyncingFromInput: !1,
    _isSyncingToInput: !1,
    _inputListenerAttached: !1,
    init() {
      this.colorPicker.open = this.openPicker.bind(this), this.colorPicker.setValue = this.setValue.bind(this), this.colorPicker.getValue = () => this.colorPicker.value, this.colorPicker.updateConfiguration = this.updateConfiguration.bind(this), this.colorPicker.value = this.readValue(this.$el.dataset.initialValue || ""), this.config = this.readConfig(), this.$watch("colorPicker.value", (s) => {
        const r = this.readValue(s);
        if (r !== s) {
          this.colorPicker.value = r;
          return;
        }
        this.syncInputFromState();
      });
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      t(i, n).then(() => this.initializeColoris()).catch((s) => this.handleAssetError(s));
    },
    readValue(i) {
      return typeof i == "string" ? i.trim() : "";
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
      !i || !window.Coloris || (this.config = {
        el: i,
        wrap: !1,
        themeMode: "auto",
        onChange: (n, s) => {
          s === this.$refs.input && (this.syncStateFromInput(s), s.dispatchEvent(new CustomEvent("rz:colorpicker:onchange", {
            bubbles: !0,
            composed: !0,
            detail: {
              colorPicker: this.colorPicker,
              updateConfiguration: this.updateConfiguration.bind(this),
              el: s,
              providerEl: this.$el
            }
          })));
        },
        ...this.config
      }, window.Coloris(this.config), this.syncStateFromInput(i), this._inputListenerAttached || (i.addEventListener("input", () => {
        this.syncStateFromInput(i);
      }), this._inputListenerAttached = !0), this.syncInputFromState());
    },
    openPicker(i) {
      const n = this.$refs.input;
      n && (this.positionAnchorInput(n, i), this.syncInputFromState(), n.focus(), n.dispatchEvent(new MouseEvent("click", { bubbles: !0 })));
    },
    positionAnchorInput(i, n) {
      const s = n?.currentTarget;
      if (!s || typeof s.getBoundingClientRect != "function")
        return;
      const r = s.getBoundingClientRect();
      i.style.left = `${Math.round(r.left)}px`, i.style.top = `${Math.round(r.bottom)}px`;
    },
    setValue(i) {
      this.colorPicker.value = i;
    },
    updateConfiguration(i) {
      this.config = {
        ...this.config,
        ...i
      };
      const n = this.$refs.input;
      !window.Coloris || !n || window.Coloris.setInstance(n, this.config);
    },
    syncStateFromInput(i) {
      !i || this._isSyncingToInput || (this._isSyncingFromInput = !0, this.colorPicker.value = this.readValue(i.value || ""), queueMicrotask(() => {
        this._isSyncingFromInput = !1;
      }));
    },
    syncInputFromState() {
      const i = this.$refs.input;
      if (!i || this._isSyncingFromInput)
        return;
      const n = this.readValue(this.colorPicker.value);
      i.value !== n && (this._isSyncingToInput = !0, i.value = n, i.dispatchEvent(new Event("input", { bubbles: !0 })), queueMicrotask(() => {
        this._isSyncingToInput = !1;
      }));
    },
    handleAssetError(i) {
      console.error("Failed to load Coloris assets.", i);
    }
  }));
}
function jl(e) {
  e.data("rzColorSwatch", () => ({
    // ──────────────────────────────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────────────────────────────
    value: "",
    withoutTransparency: !1,
    isDisabled: !1,
    // Derived inline style string used by the swatch element.
    swatchStyle: "",
    // ──────────────────────────────────────────────────────────────────────
    // LIFECYCLE
    // ──────────────────────────────────────────────────────────────────────
    init() {
      this.value = this.readValue(this.$el.dataset.value), this.withoutTransparency = this.readBool(this.$el.dataset.withoutTransparency), this.isDisabled = this.readBool(this.$el.dataset.disabled), this.$watch("value", (t) => {
        const i = this.readValue(t);
        if (i !== t) {
          this.value = i;
          return;
        }
        this.refreshSwatch();
      }), this.$watch("withoutTransparency", () => {
        this.refreshSwatch();
      }), this.refreshSwatch();
    },
    // ──────────────────────────────────────────────────────────────────────
    // PUBLIC API (imperative interop)
    // ──────────────────────────────────────────────────────────────────────
    getValue() {
      return this.value;
    },
    setValue(t) {
      this.value = t;
    },
    // Optional helper if parent code needs to toggle checkerboard behavior.
    setWithoutTransparency(t) {
      this.withoutTransparency = !!t;
    },
    // ──────────────────────────────────────────────────────────────────────
    // NORMALIZATION / PARSING
    // ──────────────────────────────────────────────────────────────────────
    readBool(t) {
      return t === "true";
    },
    readValue(t) {
      return typeof t != "string" ? "" : t.trim();
    },
    // ──────────────────────────────────────────────────────────────────────
    // COLOR INSPECTION
    // ──────────────────────────────────────────────────────────────────────
    isCssColor(t) {
      try {
        return typeof CSS < "u" && typeof CSS.supports == "function" ? CSS.supports("color", t) : !0;
      } catch {
        return !1;
      }
    },
    hasAlpha(t) {
      const i = t.trim().toLowerCase();
      return !!(i === "transparent" || /^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i.test(i) || /\b(?:rgba|hsla)\s*\(/i.test(i) || /\b(?:rgb|hsl|lab|lch|oklab|oklch|color)\s*\([^)]*\/\s*[\d.]+%?\s*\)/i.test(i));
    },
    // ──────────────────────────────────────────────────────────────────────
    // STYLE COMPUTATION
    // ──────────────────────────────────────────────────────────────────────
    getEmptyStyle() {
      return [
        "background:",
        "linear-gradient(",
        "to bottom right,",
        "transparent calc(50% - 1px),",
        "hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px),",
        "transparent calc(50% + 1px)",
        ") no-repeat;"
      ].join(" ");
    },
    getInvalidStyle() {
      return "background-color: transparent;";
    },
    getSolidColorStyle(t) {
      return `background-color: ${t};`;
    },
    getAlphaPreviewStyle(t) {
      return [
        `background: linear-gradient(${t}, ${t}),`,
        "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)",
        "0% 50% / 10px 10px;"
      ].join(" ");
    },
    refreshSwatch() {
      const t = this.value;
      if (!t) {
        this.swatchStyle = this.getEmptyStyle();
        return;
      }
      if (!this.isCssColor(t)) {
        this.swatchStyle = this.getInvalidStyle();
        return;
      }
      if (!this.withoutTransparency && this.hasAlpha(t)) {
        this.swatchStyle = this.getAlphaPreviewStyle(t);
        return;
      }
      this.swatchStyle = this.getSolidColorStyle(t);
    }
  }));
}
function Hl(e, t) {
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
      const s = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.nonce;
      t(s, {
        success: function() {
          window.flatpickr && n && window.flatpickr(n, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, r);
    }
  }));
}
function Wl(e) {
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
          this.$el.querySelector('[role="dialog"], [role="alertdialog"], [data-modal-panel="true"]')?.querySelector(`button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex="-1"])`)?.focus(), this.$el.dispatchEvent(new CustomEvent("rz:modal-after-open", {
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
const Ot = Math.min, gt = Math.max, Se = Math.round, fe = Math.floor, X = (e) => ({
  x: e,
  y: e
}), ql = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Yl = {
  start: "end",
  end: "start"
};
function fi(e, t, i) {
  return gt(e, Ot(t, i));
}
function ne(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function xt(e) {
  return e.split("-")[0];
}
function se(e) {
  return e.split("-")[1];
}
function ir(e) {
  return e === "x" ? "y" : "x";
}
function Mi(e) {
  return e === "y" ? "height" : "width";
}
function yt(e) {
  return ["top", "bottom"].includes(xt(e)) ? "y" : "x";
}
function zi(e) {
  return ir(yt(e));
}
function Kl(e, t, i) {
  i === void 0 && (i = !1);
  const n = se(e), s = zi(e), r = Mi(s);
  let o = s === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[r] > t.floating[r] && (o = Ce(o)), [o, Ce(o)];
}
function Jl(e) {
  const t = Ce(e);
  return [pi(e), t, pi(t)];
}
function pi(e) {
  return e.replace(/start|end/g, (t) => Yl[t]);
}
function Xl(e, t, i) {
  const n = ["left", "right"], s = ["right", "left"], r = ["top", "bottom"], o = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return i ? t ? s : n : t ? n : s;
    case "left":
    case "right":
      return t ? r : o;
    default:
      return [];
  }
}
function Zl(e, t, i, n) {
  const s = se(e);
  let r = Xl(xt(e), i === "start", n);
  return s && (r = r.map((o) => o + "-" + s), t && (r = r.concat(r.map(pi)))), r;
}
function Ce(e) {
  return e.replace(/left|right|bottom|top/g, (t) => ql[t]);
}
function Gl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function nr(e) {
  return typeof e != "number" ? Gl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function $e(e) {
  const {
    x: t,
    y: i,
    width: n,
    height: s
  } = e;
  return {
    width: n,
    height: s,
    top: i,
    left: t,
    right: t + n,
    bottom: i + s,
    x: t,
    y: i
  };
}
function vn(e, t, i) {
  let {
    reference: n,
    floating: s
  } = e;
  const r = yt(t), o = zi(t), a = Mi(o), l = xt(t), c = r === "y", u = n.x + n.width / 2 - s.width / 2, d = n.y + n.height / 2 - s.height / 2, h = n[a] / 2 - s[a] / 2;
  let g;
  switch (l) {
    case "top":
      g = {
        x: u,
        y: n.y - s.height
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
        x: n.x - s.width,
        y: d
      };
      break;
    default:
      g = {
        x: n.x,
        y: n.y
      };
  }
  switch (se(t)) {
    case "start":
      g[o] -= h * (i && c ? -1 : 1);
      break;
    case "end":
      g[o] += h * (i && c ? -1 : 1);
      break;
  }
  return g;
}
const Ql = async (e, t, i) => {
  const {
    placement: n = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: o
  } = i, a = r.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let c = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: s
  }), {
    x: u,
    y: d
  } = vn(c, n, l), h = n, g = {}, f = 0;
  for (let y = 0; y < a.length; y++) {
    const {
      name: m,
      fn: v
    } = a[y], {
      x: p,
      y: x,
      data: _,
      reset: I
    } = await v({
      x: u,
      y: d,
      initialPlacement: n,
      placement: h,
      strategy: s,
      middlewareData: g,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = p ?? u, d = x ?? d, g = {
      ...g,
      [m]: {
        ...g[m],
        ..._
      }
    }, I && f <= 50 && (f++, typeof I == "object" && (I.placement && (h = I.placement), I.rects && (c = I.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: s
    }) : I.rects), {
      x: u,
      y: d
    } = vn(c, h, l)), y = -1);
  }
  return {
    x: u,
    y: d,
    placement: h,
    strategy: s,
    middlewareData: g
  };
};
async function sr(e, t) {
  var i;
  t === void 0 && (t = {});
  const {
    x: n,
    y: s,
    platform: r,
    rects: o,
    elements: a,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: h = !1,
    padding: g = 0
  } = ne(t, e), f = nr(g), m = a[h ? d === "floating" ? "reference" : "floating" : d], v = $e(await r.getClippingRect({
    element: (i = await (r.isElement == null ? void 0 : r.isElement(m))) == null || i ? m : m.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), p = d === "floating" ? {
    x: n,
    y: s,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(a.floating)), _ = await (r.isElement == null ? void 0 : r.isElement(x)) ? await (r.getScale == null ? void 0 : r.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, I = $e(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: p,
    offsetParent: x,
    strategy: l
  }) : p);
  return {
    top: (v.top - I.top + f.top) / _.y,
    bottom: (I.bottom - v.bottom + f.bottom) / _.y,
    left: (v.left - I.left + f.left) / _.x,
    right: (I.right - v.right + f.right) / _.x
  };
}
const tc = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: i,
      y: n,
      placement: s,
      rects: r,
      platform: o,
      elements: a,
      middlewareData: l
    } = t, {
      element: c,
      padding: u = 0
    } = ne(e, t) || {};
    if (c == null)
      return {};
    const d = nr(u), h = {
      x: i,
      y: n
    }, g = zi(s), f = Mi(g), y = await o.getDimensions(c), m = g === "y", v = m ? "top" : "left", p = m ? "bottom" : "right", x = m ? "clientHeight" : "clientWidth", _ = r.reference[f] + r.reference[g] - h[g] - r.floating[f], I = h[g] - r.reference[g], b = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let w = b ? b[x] : 0;
    (!w || !await (o.isElement == null ? void 0 : o.isElement(b))) && (w = a.floating[x] || r.floating[f]);
    const E = _ / 2 - I / 2, S = w / 2 - y[f] / 2 - 1, T = Ot(d[v], S), A = Ot(d[p], S), D = T, L = w - y[f] - A, P = w / 2 - y[f] / 2 + E, R = fi(D, P, L), j = !l.arrow && se(s) != null && P !== R && r.reference[f] / 2 - (P < D ? T : A) - y[f] / 2 < 0, M = j ? P < D ? P - D : P - L : 0;
    return {
      [g]: h[g] + M,
      data: {
        [g]: R,
        centerOffset: P - R - M,
        ...j && {
          alignmentOffset: M
        }
      },
      reset: j
    };
  }
}), ec = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var i, n;
      const {
        placement: s,
        middlewareData: r,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = t, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: h,
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: f = "none",
        flipAlignment: y = !0,
        ...m
      } = ne(e, t);
      if ((i = r.arrow) != null && i.alignmentOffset)
        return {};
      const v = xt(s), p = yt(a), x = xt(a) === a, _ = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), I = h || (x || !y ? [Ce(a)] : Jl(a)), b = f !== "none";
      !h && b && I.push(...Zl(a, y, f, _));
      const w = [a, ...I], E = await sr(t, m), S = [];
      let T = ((n = r.flip) == null ? void 0 : n.overflows) || [];
      if (u && S.push(E[v]), d) {
        const R = Kl(s, o, _);
        S.push(E[R[0]], E[R[1]]);
      }
      if (T = [...T, {
        placement: s,
        overflows: S
      }], !S.every((R) => R <= 0)) {
        var A, D;
        const R = (((A = r.flip) == null ? void 0 : A.index) || 0) + 1, j = w[R];
        if (j) {
          var L;
          const U = d === "alignment" ? p !== yt(j) : !1, K = ((L = T[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!U || K)
            return {
              data: {
                index: R,
                overflows: T
              },
              reset: {
                placement: j
              }
            };
        }
        let M = (D = T.filter((U) => U.overflows[0] <= 0).sort((U, K) => U.overflows[1] - K.overflows[1])[0]) == null ? void 0 : D.placement;
        if (!M)
          switch (g) {
            case "bestFit": {
              var P;
              const U = (P = T.filter((K) => {
                if (b) {
                  const it = yt(K.placement);
                  return it === p || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  it === "y";
                }
                return !0;
              }).map((K) => [K.placement, K.overflows.filter((it) => it > 0).reduce((it, fr) => it + fr, 0)]).sort((K, it) => K[1] - it[1])[0]) == null ? void 0 : P[0];
              U && (M = U);
              break;
            }
            case "initialPlacement":
              M = a;
              break;
          }
        if (s !== M)
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
async function ic(e, t) {
  const {
    placement: i,
    platform: n,
    elements: s
  } = e, r = await (n.isRTL == null ? void 0 : n.isRTL(s.floating)), o = xt(i), a = se(i), l = yt(i) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = r && l ? -1 : 1, d = ne(t, e);
  let {
    mainAxis: h,
    crossAxis: g,
    alignmentAxis: f
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof f == "number" && (g = a === "end" ? f * -1 : f), l ? {
    x: g * u,
    y: h * c
  } : {
    x: h * c,
    y: g * u
  };
}
const nc = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var i, n;
      const {
        x: s,
        y: r,
        placement: o,
        middlewareData: a
      } = t, l = await ic(t, e);
      return o === ((i = a.offset) == null ? void 0 : i.placement) && (n = a.arrow) != null && n.alignmentOffset ? {} : {
        x: s + l.x,
        y: r + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, sc = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: i,
        y: n,
        placement: s
      } = t, {
        mainAxis: r = !0,
        crossAxis: o = !1,
        limiter: a = {
          fn: (m) => {
            let {
              x: v,
              y: p
            } = m;
            return {
              x: v,
              y: p
            };
          }
        },
        ...l
      } = ne(e, t), c = {
        x: i,
        y: n
      }, u = await sr(t, l), d = yt(xt(s)), h = ir(d);
      let g = c[h], f = c[d];
      if (r) {
        const m = h === "y" ? "top" : "left", v = h === "y" ? "bottom" : "right", p = g + u[m], x = g - u[v];
        g = fi(p, g, x);
      }
      if (o) {
        const m = d === "y" ? "top" : "left", v = d === "y" ? "bottom" : "right", p = f + u[m], x = f - u[v];
        f = fi(p, f, x);
      }
      const y = a.fn({
        ...t,
        [h]: g,
        [d]: f
      });
      return {
        ...y,
        data: {
          x: y.x - i,
          y: y.y - n,
          enabled: {
            [h]: r,
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
function zt(e) {
  return rr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function B(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function G(e) {
  var t;
  return (t = (rr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function rr(e) {
  return Re() ? e instanceof Node || e instanceof B(e).Node : !1;
}
function W(e) {
  return Re() ? e instanceof Element || e instanceof B(e).Element : !1;
}
function Z(e) {
  return Re() ? e instanceof HTMLElement || e instanceof B(e).HTMLElement : !1;
}
function bn(e) {
  return !Re() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof B(e).ShadowRoot;
}
function re(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: s
  } = q(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !["inline", "contents"].includes(s);
}
function rc(e) {
  return ["table", "td", "th"].includes(zt(e));
}
function Me(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Fi(e) {
  const t = Bi(), i = W(e) ? q(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) => (i.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (i.contain || "").includes(n));
}
function oc(e) {
  let t = lt(e);
  for (; Z(t) && !kt(t); ) {
    if (Fi(t))
      return t;
    if (Me(t))
      return null;
    t = lt(t);
  }
  return null;
}
function Bi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function kt(e) {
  return ["html", "body", "#document"].includes(zt(e));
}
function q(e) {
  return B(e).getComputedStyle(e);
}
function ze(e) {
  return W(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function lt(e) {
  if (zt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    bn(e) && e.host || // Fallback.
    G(e)
  );
  return bn(t) ? t.host : t;
}
function or(e) {
  const t = lt(e);
  return kt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Z(t) && re(t) ? t : or(t);
}
function te(e, t, i) {
  var n;
  t === void 0 && (t = []), i === void 0 && (i = !0);
  const s = or(e), r = s === ((n = e.ownerDocument) == null ? void 0 : n.body), o = B(s);
  if (r) {
    const a = mi(o);
    return t.concat(o, o.visualViewport || [], re(s) ? s : [], a && i ? te(a) : []);
  }
  return t.concat(s, te(s, [], i));
}
function mi(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function ar(e) {
  const t = q(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const s = Z(e), r = s ? e.offsetWidth : i, o = s ? e.offsetHeight : n, a = Se(i) !== r || Se(n) !== o;
  return a && (i = r, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Ui(e) {
  return W(e) ? e : e.contextElement;
}
function $t(e) {
  const t = Ui(e);
  if (!Z(t))
    return X(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: s,
    $: r
  } = ar(t);
  let o = (r ? Se(i.width) : i.width) / n, a = (r ? Se(i.height) : i.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const ac = /* @__PURE__ */ X(0);
function lr(e) {
  const t = B(e);
  return !Bi() || !t.visualViewport ? ac : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function lc(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== B(e) ? !1 : t;
}
function It(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const s = e.getBoundingClientRect(), r = Ui(e);
  let o = X(1);
  t && (n ? W(n) && (o = $t(n)) : o = $t(e));
  const a = lc(r, i, n) ? lr(r) : X(0);
  let l = (s.left + a.x) / o.x, c = (s.top + a.y) / o.y, u = s.width / o.x, d = s.height / o.y;
  if (r) {
    const h = B(r), g = n && W(n) ? B(n) : n;
    let f = h, y = mi(f);
    for (; y && n && g !== f; ) {
      const m = $t(y), v = y.getBoundingClientRect(), p = q(y), x = v.left + (y.clientLeft + parseFloat(p.paddingLeft)) * m.x, _ = v.top + (y.clientTop + parseFloat(p.paddingTop)) * m.y;
      l *= m.x, c *= m.y, u *= m.x, d *= m.y, l += x, c += _, f = B(y), y = mi(f);
    }
  }
  return $e({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Vi(e, t) {
  const i = ze(e).scrollLeft;
  return t ? t.left + i : It(G(e)).left + i;
}
function cr(e, t, i) {
  i === void 0 && (i = !1);
  const n = e.getBoundingClientRect(), s = n.left + t.scrollLeft - (i ? 0 : (
    // RTL <body> scrollbar.
    Vi(e, n)
  )), r = n.top + t.scrollTop;
  return {
    x: s,
    y: r
  };
}
function cc(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: s
  } = e;
  const r = s === "fixed", o = G(n), a = t ? Me(t.floating) : !1;
  if (n === o || a && r)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = X(1);
  const u = X(0), d = Z(n);
  if ((d || !d && !r) && ((zt(n) !== "body" || re(o)) && (l = ze(n)), Z(n))) {
    const g = It(n);
    c = $t(n), u.x = g.x + n.clientLeft, u.y = g.y + n.clientTop;
  }
  const h = o && !d && !r ? cr(o, l, !0) : X(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + h.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + h.y
  };
}
function uc(e) {
  return Array.from(e.getClientRects());
}
function dc(e) {
  const t = G(e), i = ze(e), n = e.ownerDocument.body, s = gt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), r = gt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + Vi(e);
  const a = -i.scrollTop;
  return q(n).direction === "rtl" && (o += gt(t.clientWidth, n.clientWidth) - s), {
    width: s,
    height: r,
    x: o,
    y: a
  };
}
function hc(e, t) {
  const i = B(e), n = G(e), s = i.visualViewport;
  let r = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, o = s.height;
    const c = Bi();
    (!c || c && t === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  return {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
function fc(e, t) {
  const i = It(e, !0, t === "fixed"), n = i.top + e.clientTop, s = i.left + e.clientLeft, r = Z(e) ? $t(e) : X(1), o = e.clientWidth * r.x, a = e.clientHeight * r.y, l = s * r.x, c = n * r.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function wn(e, t, i) {
  let n;
  if (t === "viewport")
    n = hc(e, i);
  else if (t === "document")
    n = dc(G(e));
  else if (W(t))
    n = fc(t, i);
  else {
    const s = lr(e);
    n = {
      x: t.x - s.x,
      y: t.y - s.y,
      width: t.width,
      height: t.height
    };
  }
  return $e(n);
}
function ur(e, t) {
  const i = lt(e);
  return i === t || !W(i) || kt(i) ? !1 : q(i).position === "fixed" || ur(i, t);
}
function pc(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = te(e, [], !1).filter((a) => W(a) && zt(a) !== "body"), s = null;
  const r = q(e).position === "fixed";
  let o = r ? lt(e) : e;
  for (; W(o) && !kt(o); ) {
    const a = q(o), l = Fi(o);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || re(o) && !l && ur(e, o)) ? n = n.filter((u) => u !== o) : s = a, o = lt(o);
  }
  return t.set(e, n), n;
}
function mc(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: s
  } = e;
  const o = [...i === "clippingAncestors" ? Me(t) ? [] : pc(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = wn(t, u, s);
    return c.top = gt(d.top, c.top), c.right = Ot(d.right, c.right), c.bottom = Ot(d.bottom, c.bottom), c.left = gt(d.left, c.left), c;
  }, wn(t, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function gc(e) {
  const {
    width: t,
    height: i
  } = ar(e);
  return {
    width: t,
    height: i
  };
}
function yc(e, t, i) {
  const n = Z(t), s = G(t), r = i === "fixed", o = It(e, !0, r, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = X(0);
  function c() {
    l.x = Vi(s);
  }
  if (n || !n && !r)
    if ((zt(t) !== "body" || re(s)) && (a = ze(t)), n) {
      const g = It(t, !0, r, t);
      l.x = g.x + t.clientLeft, l.y = g.y + t.clientTop;
    } else s && c();
  r && !n && s && c();
  const u = s && !n && !r ? cr(s, a) : X(0), d = o.left + a.scrollLeft - l.x - u.x, h = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: h,
    width: o.width,
    height: o.height
  };
}
function We(e) {
  return q(e).position === "static";
}
function xn(e, t) {
  if (!Z(e) || q(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return G(e) === i && (i = i.ownerDocument.body), i;
}
function dr(e, t) {
  const i = B(e);
  if (Me(e))
    return i;
  if (!Z(e)) {
    let s = lt(e);
    for (; s && !kt(s); ) {
      if (W(s) && !We(s))
        return s;
      s = lt(s);
    }
    return i;
  }
  let n = xn(e, t);
  for (; n && rc(n) && We(n); )
    n = xn(n, t);
  return n && kt(n) && We(n) && !Fi(n) ? i : n || oc(e) || i;
}
const vc = async function(e) {
  const t = this.getOffsetParent || dr, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: yc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function bc(e) {
  return q(e).direction === "rtl";
}
const wc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: cc,
  getDocumentElement: G,
  getClippingRect: mc,
  getOffsetParent: dr,
  getElementRects: vc,
  getClientRects: uc,
  getDimensions: gc,
  getScale: $t,
  isElement: W,
  isRTL: bc
};
function hr(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function xc(e, t) {
  let i = null, n;
  const s = G(e);
  function r() {
    var a;
    clearTimeout(n), (a = i) == null || a.disconnect(), i = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), r();
    const c = e.getBoundingClientRect(), {
      left: u,
      top: d,
      width: h,
      height: g
    } = c;
    if (a || t(), !h || !g)
      return;
    const f = fe(d), y = fe(s.clientWidth - (u + h)), m = fe(s.clientHeight - (d + g)), v = fe(u), x = {
      rootMargin: -f + "px " + -y + "px " + -m + "px " + -v + "px",
      threshold: gt(0, Ot(1, l)) || 1
    };
    let _ = !0;
    function I(b) {
      const w = b[0].intersectionRatio;
      if (w !== l) {
        if (!_)
          return o();
        w ? o(!1, w) : n = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      w === 1 && !hr(c, e.getBoundingClientRect()) && o(), _ = !1;
    }
    try {
      i = new IntersectionObserver(I, {
        ...x,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      i = new IntersectionObserver(I, x);
    }
    i.observe(e);
  }
  return o(!0), r;
}
function Ic(e, t, i, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: r = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Ui(e), u = s || r ? [...c ? te(c) : [], ...te(t)] : [];
  u.forEach((v) => {
    s && v.addEventListener("scroll", i, {
      passive: !0
    }), r && v.addEventListener("resize", i);
  });
  const d = c && a ? xc(c, i) : null;
  let h = -1, g = null;
  o && (g = new ResizeObserver((v) => {
    let [p] = v;
    p && p.target === c && g && (g.unobserve(t), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var x;
      (x = g) == null || x.observe(t);
    })), i();
  }), c && !l && g.observe(c), g.observe(t));
  let f, y = l ? It(e) : null;
  l && m();
  function m() {
    const v = It(e);
    y && !hr(y, v) && i(), y = v, f = requestAnimationFrame(m);
  }
  return i(), () => {
    var v;
    u.forEach((p) => {
      s && p.removeEventListener("scroll", i), r && p.removeEventListener("resize", i);
    }), d?.(), (v = g) == null || v.disconnect(), g = null, l && cancelAnimationFrame(f);
  };
}
const _t = nc, Et = sc, Tt = ec, _c = tc, St = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), s = {
    platform: wc,
    ...i
  }, r = {
    ...s.platform,
    _c: n
  };
  return Ql(e, t, {
    ...s,
    platform: r
  });
};
function Ec(e) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), St(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [_t(this.pixelOffset), Tt(), Et({ padding: 8 })]
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
          Array.from(n).some((r) => e.$data(r)?.open) || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || St(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [_t(this.pixelOffset), Tt(), Et({ padding: 8 })]
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
function Tc(e) {
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
function Sc(e) {
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
        this.resizeIframe(this.iframe), new ResizeObserver((s) => {
          for (let r of s)
            t();
        }).observe(this.iframe);
        const n = this.iframe;
        this.onDarkModeToggle = (s) => {
          n.contentWindow.postMessage(s.detail, "*");
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
              const s = n.scrollHeight + 15;
              t.style.height = s + "px";
            }
          }
        } catch (i) {
          console.error("Error resizing iframe:", i);
        }
    },
    // Debounce helper to limit function calls
    debounce(t, i = 300) {
      let n;
      return (...s) => {
        clearTimeout(n), n = setTimeout(() => {
          t.apply(this, s);
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
const In = 160;
function Cc(e) {
  e.data("rzEventViewer", () => ({
    eventNames: [],
    entries: [],
    error: null,
    paused: !1,
    copied: !1,
    copyTitle: "Copy",
    copiedTitle: "Copied!",
    listeningStatusText: "Listening",
    pausedStatusText: "Paused",
    expandText: "Expand event details",
    collapseText: "Collapse event details",
    target: "window",
    targetEl: null,
    maxEntries: 200,
    autoScroll: !0,
    pretty: !0,
    showTimestamp: !0,
    showEventMeta: !1,
    level: "info",
    filterPath: "",
    stickToBottom: !0,
    expandedEntryId: null,
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
    entryCount() {
      return this.entries.length;
    },
    getStatusText() {
      return this.paused ? this.pausedStatusText : this.listeningStatusText;
    },
    init() {
      if (this.target = this.$el.dataset.target || "window", this.maxEntries = Number.parseInt(this.$el.dataset.maxEntries || "200", 10), this.autoScroll = this.parseBoolean(this.$el.dataset.autoScroll, !0), this.pretty = this.parseBoolean(this.$el.dataset.pretty, !0), this.showTimestamp = this.parseBoolean(this.$el.dataset.showTimestamp, !0), this.showEventMeta = this.parseBoolean(this.$el.dataset.showEventMeta, !1), this.level = this.$el.dataset.level || "info", this.filterPath = this.$el.dataset.filter || "", this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, this.listeningStatusText = this.$el.dataset.listeningText || this.listeningStatusText, this.pausedStatusText = this.$el.dataset.pausedText || this.pausedStatusText, this.expandText = this.$el.dataset.expandText || this.expandText, this.collapseText = this.$el.dataset.collapseText || this.collapseText, this.eventNames = this.resolveEventNames(), this.eventNames.length === 0) {
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
      const s = [], r = /* @__PURE__ */ new Set();
      for (const o of t)
        !o || r.has(o) || (r.add(o), s.push(o));
      return s;
    },
    resolveTargetElement(t) {
      return t === "window" ? window : t === "document" ? document : document.querySelector(t);
    },
    createHandler(t) {
      return (i) => {
        if (this.paused)
          return;
        const n = i?.type || t, s = i instanceof CustomEvent ? i.detail : i?.detail, r = this.applyFilter(s, this.filterPath);
        this.entries.push(this.buildEntry(n, r)), this.enforceMaxEntries(), this.scrollToBottom();
      };
    },
    buildEntry(t, i) {
      const n = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "", s = this.stringifyDetail(i, this.pretty), r = this.buildBodyPreview(i), o = this.appendMetaSuffix(s), a = this.appendMetaSuffix(r);
      return {
        id: `${t}-${this._entryId++}`,
        type: t,
        level: this.level,
        hasTimestamp: this.showTimestamp,
        timestamp: n,
        bodyRaw: o,
        bodyPreview: a,
        body: o,
        expanded: !1,
        toggleLabel: this.expandText,
        toggleClass: ""
      };
    },
    buildBodyPreview(t) {
      if (t === void 0)
        return "undefined";
      if (t === null)
        return "null";
      if (typeof t == "string")
        return this.truncatePreview(this.toSingleLine(t.trim()));
      const i = this.stringifyDetail(t, !1);
      return this.truncatePreview(this.toSingleLine(i));
    },
    appendMetaSuffix(t) {
      return this.showEventMeta ? `${t} [level:${this.level}]` : t;
    },
    toSingleLine(t) {
      return t.replace(/\s+/g, " ").trim();
    },
    truncatePreview(t) {
      return t.length <= In ? t : `${t.slice(0, In - 1)}…`;
    },
    enforceMaxEntries() {
      this.entries.length > this.maxEntries && this.entries.splice(0, this.entries.length - this.maxEntries), this.expandedEntryId && !this.entries.some((t) => t.id === this.expandedEntryId) && (this.expandedEntryId = null);
    },
    handleConsoleScroll() {
      if (!this.$refs.console)
        return;
      const t = this.$refs.console.scrollHeight - (this.$refs.console.scrollTop + this.$refs.console.clientHeight);
      this.stickToBottom = t < 12;
    },
    scrollToBottom() {
      !this.autoScroll || !this.stickToBottom || this.$nextTick(() => {
        this.$refs.console && (this.$refs.console.scrollTop = this.$refs.console.scrollHeight);
      });
    },
    toggleEntryExpansion(t) {
      const i = t?.currentTarget?.dataset?.entryId || t?.target?.dataset?.entryId;
      if (!i)
        return;
      const n = this.expandedEntryId === i ? null : i;
      this.expandedEntryId = n;
      for (const s of this.entries) {
        const r = s.id === this.expandedEntryId;
        s.expanded = r, s.toggleClass = r ? "rotate-90" : "", s.toggleLabel = r ? this.collapseText : this.expandText;
      }
    },
    stringifyDetail(t, i) {
      if (t === void 0) return "undefined";
      if (t === null) return "null";
      if (typeof t == "string") return t;
      if (typeof t == "number" || typeof t == "boolean") return String(t);
      const n = /* @__PURE__ */ new WeakSet(), s = (o) => !o || typeof o != "object" ? !1 : typeof Node < "u" && o instanceof Node || typeof Window < "u" && o instanceof Window ? !0 : typeof o.nodeType == "number" && typeof o.nodeName == "string", r = (o, a) => {
        if (a === void 0) return "undefined";
        if (typeof a == "function") return "function (hidden)";
        if (typeof a == "bigint") return `${a}n`;
        if (typeof a == "symbol") return "symbol (hidden)";
        if (s(a)) return "element (hidden)";
        if (a && typeof a == "object") {
          if (n.has(a))
            return "[circular]";
          n.add(a);
        }
        return a;
      };
      try {
        return i ? JSON.stringify(t, r, 2) : JSON.stringify(t, r);
      } catch {
        return "[unserializable detail]";
      }
    },
    applyFilter(t, i) {
      if (!i || i.trim().length === 0)
        return t;
      const n = i.split(".").map((r) => r.trim()).filter(Boolean);
      let s = t;
      for (const r of n) {
        if (s == null || typeof s != "object" || !(r in s))
          return;
        s = s[r];
      }
      return s;
    },
    appendSystemEntry(t) {
      const i = this.truncatePreview(this.toSingleLine(t));
      this.entries.push({
        id: `system-${this._entryId++}`,
        type: "system",
        level: "info",
        hasTimestamp: !1,
        timestamp: "",
        bodyRaw: t,
        bodyPreview: i,
        body: t,
        expanded: !1,
        toggleLabel: this.expandText,
        toggleClass: ""
      }), this.enforceMaxEntries(), this.scrollToBottom();
    },
    clearEntries() {
      this.entries = [], this.expandedEntryId = null, this.stickToBottom = !0;
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
      const t = this.entries.map((i) => `${i.hasTimestamp ? `${i.timestamp} ` : ""}${i.type} ${i.bodyRaw}`).join(`
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
function $c(e) {
  e.data("rzFileInput", () => ({
    files: [],
    hasFiles: !1,
    isDragging: !1,
    draggingState: "false",
    init() {
      this.syncFromInput();
    },
    trigger() {
      this.$refs.input && this.$refs.input.click();
    },
    handleFileChange() {
      this.syncFromInput();
    },
    handleDragOver() {
      this.isDragging = !0, this.draggingState = "true";
    },
    handleDragLeave() {
      this.isDragging = !1, this.draggingState = "false";
    },
    handleDrop(t) {
      this.handleDragLeave();
      const i = this.$refs.input, n = t?.dataTransfer?.files;
      !i || !n || n.length === 0 || (this.applyDroppedFiles(i, n), this.syncFromInput());
    },
    removeFileByIndex(t) {
      const i = this.$refs.input;
      if (!i?.files)
        return;
      const n = t?.currentTarget?.dataset?.index, s = Number.parseInt(n ?? "-1", 10);
      if (Number.isNaN(s) || s < 0)
        return;
      const r = new DataTransfer();
      Array.from(i.files).forEach((o, a) => {
        a !== s && r.items.add(o);
      }), i.files = r.files, this.syncFromInput();
    },
    applyDroppedFiles(t, i) {
      const n = new DataTransfer();
      t.multiple && t.files ? (Array.from(t.files).forEach((r) => n.items.add(r)), Array.from(i).forEach((r) => n.items.add(r))) : i.length > 0 && n.items.add(i[0]), t.files = n.files;
    },
    syncFromInput() {
      const t = this.$refs.input;
      if (this.revokePreviews(), !t?.files) {
        this.files = [], this.hasFiles = !1;
        return;
      }
      this.files = Array.from(t.files).map((i) => {
        const n = i.type.startsWith("image/"), s = n ? URL.createObjectURL(i) : null;
        return {
          name: i.name,
          size: i.size,
          formattedSize: this.formatFileSize(i.size),
          isImage: n,
          previewUrl: s
        };
      }), this.hasFiles = this.files.length > 0;
    },
    formatFileSize(t) {
      if (!Number.isFinite(t) || t <= 0)
        return "0 B";
      const i = ["B", "KB", "MB", "GB", "TB"], n = Math.min(Math.floor(Math.log(t) / Math.log(1024)), i.length - 1), s = t / 1024 ** n;
      return `${s >= 10 || n === 0 ? Math.round(s) : s.toFixed(1)} ${i[n]}`;
    },
    revokePreviews() {
      this.files.forEach((t) => {
        t.previewUrl && URL.revokeObjectURL(t.previewUrl);
      });
    },
    destroy() {
      this.revokePreviews();
    }
  }));
}
function Ac(e) {
  e.data("rzEmpty", () => {
  });
}
function Oc(e) {
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
        const i = (s, r) => {
          s.forEach((o) => {
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
function kc(e) {
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
function Dc(e) {
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
function Nc(e) {
  e.data("rzInputOTP", () => ({
    value: "",
    length: 0,
    activeIndex: 0,
    isFocused: !1,
    isInvalid: !1,
    otpType: "numeric",
    textTransform: "none",
    slots: [],
    slotElements: [],
    selectedIndexes: [],
    /**
     * Initializes OTP behavior and hydrates visual slots.
     */
    init() {
      if (this.$el.dataset.rzOtpInitialized === "true") {
        this.syncFromInput();
        return;
      }
      this.$el.dataset.rzOtpInitialized = "true", this.slotElements = [], this.selectedIndexes = [], this.length = Number(this.$el.dataset.length || "0"), this.otpType = this.$el.dataset.otpType || "numeric", this.textTransform = this.$el.dataset.textTransform || "none", this.isInvalid = this.$el.dataset.invalid === "true", this.syncFromInput();
    },
    /**
     * Returns the current OTP value.
     * @returns {string}
     */
    getValue() {
      return this.value;
    },
    /**
     * Sets the current OTP value.
     * @param {string} newValue
     */
    setValue(t) {
      const i = this.sanitizeValue(t || ""), n = this.value;
      this.clearSelection(), this.value = i, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(n), this.dispatchChangeEvent(n);
    },
    /**
     * Handles input typing updates.
     * @param {InputEvent} event
     */
    onInput(t) {
      this.clearSelection(), this.syncFromInput(t?.target);
    },
    /**
     * Handles paste behavior for OTP values.
     * @param {ClipboardEvent} event
     */
    onPaste(t) {
      t.preventDefault();
      const i = t.clipboardData ? t.clipboardData.getData("text") : "", n = this.sanitizeValue(i), s = this.value;
      this.clearSelection(), this.value = n, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(s), this.dispatchChangeEvent(s);
    },
    /**
     * Handles keyboard navigation and deletion.
     * @param {KeyboardEvent} event
     */
    onKeyDown(t) {
      if (this.hasSelection() && (t.key === "Backspace" || t.key === "Delete")) {
        t.preventDefault(), this.clearAllSlots();
        return;
      }
      if (this.hasSelection() && this.selectedIndexes.length > 1 && this.isAcceptableInputChar(t.key)) {
        t.preventDefault(), this.replaceSelectionWithKey(t.key);
        return;
      }
      if (this.isAcceptableInputChar(t.key)) {
        t.preventDefault(), this.replaceActiveSlotWithKey(t.key);
        return;
      }
      if (t.key === "ArrowLeft") {
        t.preventDefault(), this.clearSelection(), this.moveLeft();
        return;
      }
      if (t.key === "ArrowRight") {
        t.preventDefault(), this.clearSelection(), this.moveRight();
        return;
      }
      if (t.key === "Home") {
        t.preventDefault(), this.clearSelection(), this.moveHome();
        return;
      }
      if (t.key === "End") {
        t.preventDefault(), this.clearSelection(), this.moveEnd();
        return;
      }
      t.key === "Backspace" && this.handleBackspace();
    },
    /**
     * Sets focus state to true.
     */
    onFocus() {
      this.isFocused = !0, this.setActiveFromCaret(), this.refreshSlots();
    },
    /**
     * Sets focus state to false.
     */
    onBlur() {
      this.isFocused = !1, this.clearSelection(), this.refreshSlots();
    },
    /**
     * Prevents slot mousedown default so input keeps control.
     * @param {MouseEvent} event
     */
    preventMouseDown(t) {
      t.preventDefault();
    },
    /**
     * Focuses the native input and updates active slot from clicked index.
     * @param {MouseEvent} event
     */
    focusSlot(t) {
      const i = t.currentTarget, n = Number(i.dataset.index || "0");
      this.canFocusIndex(n) && (this.clearSelection(), this.activeIndex = this.normalizeIndex(n), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots());
    },
    /**
     * Selects all currently filled slots from a double click gesture.
     */
    selectFilledSlots() {
      const t = this.slots.map((n, s) => ({ slot: n, index: s })).filter(({ slot: n }) => n.char !== "").map(({ index: n }) => n);
      if (t.length === 0) {
        this.clearSelection(), this.refreshSlots();
        return;
      }
      this.selectedIndexes = t, this.isFocused = !0, this.focusInput();
      const i = this.$refs.input;
      i && i.setSelectionRange(0, this.value.length), this.refreshSlots();
    },
    registerSlot() {
      !this.$el || this.$el.dataset.inputOtpSlot !== "true" || (this.slotElements.includes(this.$el) || (this.slotElements.push(this.$el), this.slotElements.sort((t, i) => Number(t.dataset.index || "0") - Number(i.dataset.index || "0"))), this.refreshSlots());
    },
    moveLeft() {
      this.activeIndex = this.normalizeIndex(this.activeIndex - 1), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    moveRight() {
      const t = this.normalizeIndex(this.activeIndex + 1);
      this.canFocusIndex(t) && (this.activeIndex = t, this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots());
    },
    moveHome() {
      this.activeIndex = 0, this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    moveEnd() {
      this.activeIndex = this.getMaxFocusableIndex(), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    handleBackspace() {
      const t = this.$refs.input;
      if (!t) return;
      const i = t.selectionStart || 0, n = t.selectionEnd || 0;
      i === n && (i <= 0 || (this.activeIndex = this.normalizeIndex(i - 1), this.refreshSlots()));
    },
    syncFromInput(t) {
      const i = t || this.$refs.input;
      if (!i) return;
      const n = this.value;
      this.value = this.sanitizeValue(i.value || ""), this.value !== i.value && (i.value = this.value), this.setActiveFromCaret(this.value.length), this.refreshSlots(), this.dispatchInputEvent(n), this.dispatchChangeEvent(n);
    },
    sanitizeValue(t) {
      if (!t) return "";
      const i = this.otpType === "alphanumeric" ? /[^a-zA-Z0-9]/g : /[^0-9]/g, n = t.replace(i, "").slice(0, this.length);
      return this.applyTextTransform(n);
    },
    applyTextTransform(t) {
      return t ? this.textTransform === "to-lower" ? t.toLowerCase() : this.textTransform === "to-upper" ? t.toUpperCase() : t : "";
    },
    applyValueToInput() {
      const t = this.$refs.input;
      t && (t.value = this.value, this.setCaretToActiveIndex());
    },
    setActiveFromCaret(t) {
      const i = this.$refs.input;
      if (!i) {
        this.activeIndex = this.getMaxFocusableIndex(t ?? 0);
        return;
      }
      const n = i.selectionStart, s = n == null ? Number.isFinite(t) ? Number(t) : 0 : Number(n), r = this.normalizeIndex(s);
      if (this.canFocusIndex(r)) {
        this.activeIndex = r;
        return;
      }
      this.activeIndex = this.getMaxFocusableIndex();
    },
    setCaretToActiveIndex() {
      const t = this.$refs.input;
      if (!t) return;
      const i = this.normalizeIndex(this.activeIndex);
      t.setSelectionRange(i, i);
    },
    focusInput() {
      const t = this.$refs.input;
      t && t.focus();
    },
    hasSelection() {
      return this.selectedIndexes.length > 0;
    },
    clearSelection() {
      this.selectedIndexes = [];
    },
    clearAllSlots() {
      const t = this.value;
      this.clearSelection(), this.value = "", this.activeIndex = 0, this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(t);
    },
    replaceSelectionWithKey(t) {
      const i = this.sanitizeValue(t).charAt(0);
      if (!i) return;
      const n = this.value;
      this.value = i, this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(n);
    },
    replaceActiveSlotWithKey(t) {
      const i = this.sanitizeValue(t).charAt(0);
      if (!i) return;
      const n = this.canFocusIndex(this.activeIndex) ? this.normalizeIndex(this.activeIndex) : this.getMaxFocusableIndex(), s = this.value.split("");
      for (; s.length < n; )
        s.push("");
      s[n] = i;
      const r = this.value;
      this.value = this.applyTextTransform(s.join("").slice(0, this.length)), this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(n + 1), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(r), this.dispatchChangeEvent(r);
    },
    isAcceptableInputChar(t) {
      return !t || t.length !== 1 ? !1 : this.otpType === "alphanumeric" ? /^[a-zA-Z0-9]$/.test(t) : /^[0-9]$/.test(t);
    },
    getNextFillIndex() {
      return this.length <= 0 ? 0 : Math.min(this.value.length, this.length - 1);
    },
    getMaxFocusableIndex(t) {
      const i = Number.isFinite(t) ? this.normalizeIndex(Number(t)) : this.getNextFillIndex();
      return this.canFocusIndex(i) ? i : this.getNextFillIndex();
    },
    canFocusIndex(t) {
      const i = this.normalizeIndex(t);
      return this.value.charAt(i) !== "" ? !0 : i === this.getNextFillIndex();
    },
    dispatchInputEvent(t) {
      this.value !== t && this.$dispatch("rz:inputotp:oninput", {
        value: this.value,
        previousValue: t,
        activeIndex: this.activeIndex,
        isComplete: this.value.length === this.length,
        length: this.length,
        otpType: this.otpType,
        textTransform: this.textTransform
      });
    },
    dispatchChangeEvent(t) {
      this.value !== t && this.value.length === this.length && this.$dispatch("rz:inputotp:onchange", {
        value: this.value,
        previousValue: t,
        activeIndex: this.activeIndex,
        length: this.length,
        otpType: this.otpType,
        textTransform: this.textTransform
      });
    },
    refreshSlots() {
      this.buildSlotsState(), this.updateSlotDom();
    },
    buildSlotsState() {
      const t = [];
      let i = 0;
      for (; i < this.length; ) {
        const n = this.value.charAt(i) || "", s = this.selectedIndexes.includes(i), r = this.isFocused && !this.hasSelection() && i === this.activeIndex, o = this.isFocused && !this.hasSelection() && r && n === "";
        t.push({ char: n, isActive: r, hasFakeCaret: o, isSelected: s }), i += 1;
      }
      this.slots = t;
    },
    updateSlotDom() {
      const t = this.$el?.closest("[data-alpine-root]") || this.$el;
      (this.slotElements.length > 0 ? this.slotElements : t.querySelectorAll('[data-input-otp-slot="true"]')).forEach((n) => {
        const s = Number(n.dataset.index || "0"), r = this.slots[s] || { char: "", isActive: !1, hasFakeCaret: !1, isSelected: !1 };
        n.dataset.active = r.isActive ? "true" : "false", n.dataset.focused = this.isFocused ? "true" : "false", n.dataset.selected = r.isSelected ? "true" : "false", n.dataset.focusable = this.canFocusIndex(s) ? "true" : "false", this.isInvalid ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid");
        const o = n.querySelector('[data-input-otp-char="true"]');
        o && (o.textContent = r.char);
        const a = n.querySelector('[data-input-otp-caret="true"]');
        a && (r.hasFakeCaret ? a.classList.remove("hidden") : a.classList.add("hidden"));
      });
    },
    normalizeIndex(t) {
      return this.length <= 0 || t < 0 ? 0 : t > this.length - 1 ? this.length - 1 : t;
    }
  }));
}
function Pc(e, t) {
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
function Lc(e) {
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
        !n || !i || St(i, n, {
          placement: "bottom-start",
          middleware: [_t(4), Tt(), Et({ padding: 8 })]
        }).then(({ x: s, y: r }) => {
          Object.assign(n.style, { left: `${s}px`, top: `${r}px` });
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
        const s = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), r = s.indexOf(i);
        if (r < 0) return;
        const o = t.key === "ArrowRight" ? (r + 1) % s.length : (r - 1 + s.length) % s.length, a = s[o];
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
        const s = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!s?.id) break;
        i.unshift(s.id), n = n.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
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
      const i = t.currentTarget, n = this.buildPathToSubTrigger(i), s = this.openPath.length === n.length && this.openPath.every((r, o) => r === n[o]);
      this.setOpenPath(s ? n.slice(0, -1) : n);
    },
    handleSubTriggerKeyRight(t) {
      this.handleSubTriggerPointerEnter(t), this.$nextTick(() => {
        t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), s = n < 0 || n >= i.length - 1 ? 0 : n + 1;
      i[s]?.focus();
    },
    focusPreviousItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), s = n <= 0 ? i.length - 1 : n - 1;
      i[s]?.focus();
    },
    handleSubContentLeftKey(t) {
      const n = t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!n) return;
      const s = this.buildPathToSubTrigger(n);
      this.setOpenPath(s.slice(0, -1)), n.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((n) => {
        const s = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), r = n.querySelector(':scope > [data-slot="menubar-sub-content"]'), o = s?.id, a = !!o && this.openPath.includes(o);
        this.setTriggerState(s, a), r && (r.hidden = !a, r.style.display = a ? "" : "none", r.dataset.state = a ? "open" : "closed", a && s && St(s, r, {
          placement: "right-start",
          middleware: [_t(4), Tt(), Et({ padding: 8 })]
        }).then(({ x: l, y: c }) => {
          Object.assign(r.style, { left: `${l}px`, top: `${c}px` });
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
function Rc(e, t) {
  e.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: !1,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: !1,
    /* ---------- helpers ---------- */
    _triggerIndex(i) {
      return this.list ? Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]')).findIndex((s) => s.getAttribute("x-ref") === `trigger_${i}`) : -1;
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
      const s = n.querySelector('[x-ref^="trigger_"]');
      if (s) {
        const r = s.getAttribute("x-ref").replace("trigger_", "");
        this.activeItemId !== r && !this.isClosing && requestAnimationFrame(() => this.openMenu(r));
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
      const n = this._triggerIndex(i), s = n > (this.prevIndex ?? n) ? "end" : "start", r = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== i) {
        const l = this.$refs[`trigger_${this.activeItemId}`];
        l && delete l.dataset.state;
        const c = this._contentEl(this.activeItemId);
        if (c) {
          const u = s === "end" ? "start" : "end";
          c.setAttribute("data-motion", `to-${u}`), setTimeout(() => {
            c.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = i, this.open = !0, this.prevIndex = n;
      const o = this.$refs[`trigger_${i}`], a = this._contentEl(i);
      !o || !a || (St(o, a, {
        placement: "bottom-start",
        middleware: [_t(6), Tt(), Et({ padding: 8 })]
      }).then(({ x: l, y: c }) => {
        Object.assign(a.style, { left: `${l}px`, top: `${c}px` });
      }), a.style.display = "block", r ? a.setAttribute("data-motion", "fade-in") : a.setAttribute("data-motion", `from-${s}`), this.$nextTick(() => {
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
      const s = this._contentEl(i);
      s && (s.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        s.style.display = "none";
      }, 150)), this.open = !1, this.activeItemId = null, this.prevIndex = null, setTimeout(() => {
        this.isClosing = !1;
      }, 150);
    }
  }));
}
function Mc(e) {
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
      const t = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, s = parseInt(this.$el.dataset.alignmentAxisOffset) || null, r = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(_t({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: s
      })), o && c.push(Tt()), a && c.push(Et({ padding: l })), St(this.triggerEl, this.contentEl, {
        placement: t,
        strategy: r,
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
function zc(e) {
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
      const s = t.offsetWidth + 10;
      i.style.paddingLeft = s + "px", i.classList.remove("text-transparent");
    }
  }));
}
function Fc(e) {
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
function Bc(e) {
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
function Uc(e) {
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
          const i = t.scrollHeight - t.clientHeight, n = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, s = t.scrollTop / i * Math.max(n, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${s}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > t.clientWidth) {
          const i = t.scrollWidth - t.clientWidth, n = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, s = t.scrollLeft / i * Math.max(n, 0);
          this.$refs.thumbX.style.transform = `translate3d(${s}px, 0, 0)`;
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
      const s = this.$refs.viewport, r = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!s || !r) return;
      const o = n.getBoundingClientRect();
      if (i === "vertical") {
        const a = t.clientY - o.top - r.offsetHeight / 2, l = n.clientHeight - r.offsetHeight, c = s.scrollHeight - s.clientHeight;
        s.scrollTop = a / Math.max(l, 1) * c;
      } else {
        const a = t.clientX - o.left - r.offsetWidth / 2, l = n.clientWidth - r.offsetWidth, c = s.scrollWidth - s.clientWidth;
        s.scrollLeft = a / Math.max(l, 1) * c;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(t) {
      const i = t.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`], s = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || !s || s.hidden) return;
      const r = n.getBoundingClientRect();
      this._dragAxis = i, this._dragPointerOffset = i === "vertical" ? t.clientY - r.top : t.clientX - r.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(t) {
      const i = this._dragAxis, n = this.$refs.viewport, s = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`], r = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!i || !n || !s || !r || s.hidden) return;
      const o = s.getBoundingClientRect();
      if (i === "vertical") {
        const a = t.clientY - o.top, l = s.clientHeight - r.offsetHeight, c = n.scrollHeight - n.clientHeight;
        n.scrollTop = (a - this._dragPointerOffset) / Math.max(l, 1) * c;
      } else {
        const a = t.clientX - o.left, l = s.clientWidth - r.offsetWidth, c = n.scrollWidth - n.clientWidth;
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
function Vc(e) {
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
function jc(e) {
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
        const s = t.currentTarget?.getAttribute("aria-orientation") === "vertical", r = s ? "ArrowUp" : "ArrowLeft", o = s ? "ArrowDown" : "ArrowRight";
        let a = n;
        switch (t.key) {
          case r:
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
function Hc(e) {
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
function Wc(e) {
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
      const s = Number(n);
      return Number.isFinite(s) ? s : i;
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
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = Ic(this.triggerEl, this.contentEl, () => {
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
        _t({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && t.push(Tt()), this.enableShift && t.push(Et({ padding: this.shiftPadding })), this.arrowEl && t.push(_c({ element: this.arrowEl })), St(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: t
      }).then(({ x: i, y: n, placement: s, middlewareData: r }) => {
        if (this.side = s.split("-")[0], this.contentEl.dataset.side = this.side, this.contentEl.style.position = this.strategy, this.contentEl.style.left = `${i}px`, this.contentEl.style.top = `${n}px`, !this.arrowEl || !r.arrow) return;
        const o = r.arrow.x, a = r.arrow.y, c = {
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
function qc(e) {
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
function Yc(e) {
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
        const s = document.getElementById(t);
        if (s)
          try {
            i = JSON.parse(s.textContent || "[]");
          } catch (r) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, r);
          }
      }
      i.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      const n = i.map((s) => ({
        ...s,
        id: this.resolveStableItemId(s),
        isDataItem: !0
      }));
      this.registerItems(n, { suppressFilter: !0 }), this.itemsUrl && this.fetchTrigger === "immediate" ? this.fetchItems() : this.filterAndSortItems(), this.$watch("search", (s) => {
        if (this.serverFiltering) {
          clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => {
            this.fetchItems(s);
          }, 300);
          return;
        }
        this.filterAndSortItems();
      }), this.$watch("selectedIndex", (s, r) => {
        if (r > -1) {
          const o = this.filteredItems[r];
          if (o) {
            const a = this.$el.querySelector(`[data-command-item-id="${o.id}"]`);
            a && (a.removeAttribute("data-selected"), a.setAttribute("aria-selected", "false"));
          }
        }
        if (s > -1 && this.filteredItems[s]) {
          const o = this.filteredItems[s];
          this.activeDescendantId = o.id;
          const a = this.$el.querySelector(`[data-command-item-id="${o.id}"]`);
          a && (a.setAttribute("data-selected", "true"), a.setAttribute("aria-selected", "true"), a.scrollIntoView({ block: "nearest" }));
          const l = o.value;
          this.selectedValue !== l && (this.selectedValue = l, this.$dispatch("rz:command:select", { value: l }));
        } else
          this.activeDescendantId = null, this.selectedValue = null;
      }), this.$watch("selectedValue", (s) => {
        const r = this.filteredItems.findIndex((o) => o.value === s);
        this.selectedIndex !== r && (this.selectedIndex = r);
      }), this.$watch("filteredItems", (s) => {
        this.isOpen = s.length > 0 || this.isLoading, this.isEmpty = s.length === 0, this._listInstance && this._listInstance.renderList();
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
      let s = 0;
      for (const r of t) {
        if (!r)
          continue;
        const o = this.resolveStableItemId(r);
        if (this.itemsById.has(o))
          continue;
        const a = this.normalizeItem(r);
        a._order = this.items.length, this.items.push(a), this.itemsById.set(a.id, a), s++;
      }
      s > 0 && this.selectedIndex === -1 && (this.selectedIndex = 0), !n && !this.serverFiltering && this.filterAndSortItems();
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
      let s = [];
      if (!this.shouldFilter || !t)
        s = this.items.slice();
      else {
        const a = [];
        for (const l of n) {
          if (l.forceMount)
            continue;
          const c = this.fastScore(l._searchText, t);
          c > 0 && a.push([l, c]);
        }
        a.sort((l, c) => c[1] !== l[1] ? c[1] - l[1] : (l[0]._order || 0) - (c[0]._order || 0)), s = a.map(([l]) => l);
      }
      const r = this.items.filter((a) => a.forceMount), o = [...s, ...r];
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
          const s = await n.json();
          this.serverFiltering && (this.items = this.items.filter((o) => !o.isDataItem), this.itemsById = new Map(this.items.map((o) => [o.id, o])));
          const r = s.map((o) => ({
            ...o,
            id: this.resolveStableItemId(o),
            isDataItem: !0
          }));
          this.registerItems(r, { suppressFilter: !0 }), this._dataFetched = !0;
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
      const n = i.dataset.commandItemId, s = this.filteredIndexById.get(n) ?? -1;
      if (s > -1) {
        const r = this.filteredItems[s];
        r && !r.disabled && (this.selectedIndex = s, this.$dispatch("rz:command:execute", { value: r.value }));
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
      const n = i.dataset.commandItemId, s = this.filteredIndexById.get(n) ?? -1;
      if (s > -1) {
        const r = this.filteredItems[s];
        r && !r.disabled && this.selectedIndex !== s && (this.selectedIndex = s);
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
function Kc(e) {
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
      const i = this.$el.querySelector("template"), n = i?.content ? i.content.cloneNode(!0) : null, s = this.$el.dataset.value || this.$el.textContent.trim(), r = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
      this.itemData = {
        id: this.resolveItemId(s, r),
        value: s,
        name: r,
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
function Jc(e) {
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
      const t = this.parent.filteredItems || [], i = this.parent.groupTemplates || /* @__PURE__ */ new Map(), n = this.$el, s = document.createDocumentFragment(), r = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      for (const c of t) {
        const u = c.group || "__ungrouped__";
        r.has(u) || r.set(u, []), r.get(u).push(c);
      }
      const o = Array.from(r.entries()).filter(([, c]) => c.length > 0), a = o.filter(([c]) => c !== "__ungrouped__").length;
      let l = 0;
      o.forEach(([c, u]) => {
        const d = c !== "__ungrouped__";
        if (d && this.separatorTemplate && a > 1 && l > 0) {
          const g = this.separatorTemplate.cloneNode(!0);
          g.setAttribute("data-dynamic-item", "true"), s.appendChild(g);
        }
        const h = document.createElement("div");
        if (h.setAttribute("role", "group"), h.setAttribute("data-dynamic-item", "true"), h.setAttribute("data-slot", "command-group"), d) {
          const g = i.get(c);
          if (g?.templateContent) {
            const f = g.templateContent.cloneNode(!0);
            g.headingId && h.setAttribute("aria-labelledby", g.headingId), h.appendChild(f);
          }
        }
        u.forEach((g, f) => {
          const y = this.parent.filteredIndexById.get(g.id) ?? f, m = this.ensureRow(g);
          m && (this.applyItemAttributes(m, g, y), h.appendChild(m));
        }), s.appendChild(h), d && (l += 1);
      }), n.querySelectorAll("[data-dynamic-item]").forEach((c) => c.remove()), n.appendChild(s), window.htmx && window.htmx.process(n);
    }
  }));
}
function Xc(e) {
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
      const i = this.$el.querySelector("template"), n = i?.dataset.headingId || "", s = i?.content ? i.content.cloneNode(!0) : null;
      this.heading && s && this.parent.registerGroupTemplate(this.heading, s, n);
    }
  }));
}
function Zc(e, t) {
  e.data("rzChart", () => ({
    chartInstance: null,
    themeChangeHandler: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce || "", s = this.$el.dataset.configId;
      if (i.length > 0 && typeof t == "function") {
        t(i, {
          success: () => this.tryInitializeChart(s),
          error: (r) => console.error("[rzChart] Failed to load Chart.js assets.", r)
        }, n);
        return;
      }
      this.tryInitializeChart(s);
    },
    tryInitializeChart(i) {
      if (!window.Chart) {
        console.error("[rzChart] Chart.js was not found on window.");
        return;
      }
      const n = document.getElementById(i);
      if (!n) {
        console.error(`[rzChart] Could not find configuration script with ID: ${i}`);
        return;
      }
      let s = {};
      try {
        s = JSON.parse(n.textContent || "{}");
      } catch (o) {
        console.error("[rzChart] Failed to parse JSON configuration.", o);
        return;
      }
      this.resolveColorValues(s), this.resolveCallbacks(s), s.options && (s.options.responsive = s.options.responsive ?? !0, s.options.maintainAspectRatio = s.options.maintainAspectRatio ?? !1);
      const r = this.$refs.canvas;
      if (!r) {
        console.error("[rzChart] Canvas reference was not found.");
        return;
      }
      this.chartInstance = new window.Chart(r, s), this.themeChangeHandler = () => {
        this.chartInstance && this.chartInstance.update();
      }, window.addEventListener("rz:theme-change", this.themeChangeHandler);
    },
    resolveColorValues(i) {
      const n = (s) => {
        if (Array.isArray(s))
          return s.map((r) => n(r));
        if (!s || typeof s != "object")
          return s;
        for (const r of Object.keys(s)) {
          const o = s[r];
          if (typeof r == "string" && r.toLowerCase().includes("color")) {
            if (Array.isArray(o)) {
              s[r] = o.map((a) => this._resolveColor(a));
              continue;
            }
            if (o && typeof o == "object") {
              n(o);
              continue;
            }
            s[r] = this._resolveColor(o);
            continue;
          }
          o && typeof o == "object" && n(o);
        }
        return s;
      };
      n(i);
    },
    _resolveColor(i, n = document.documentElement) {
      if (typeof i != "string")
        return i;
      const s = i.trim();
      if (!s.startsWith("var("))
        return s;
      const r = s.slice(4, -1).trim(), [o, a] = r.split(",").map((c) => c.trim());
      return o && (getComputedStyle(n).getPropertyValue(o).trim() || a) || s;
    },
    resolveCallbacks(i) {
      if (!i || !i.options)
        return;
      const n = (s) => {
        if (typeof s != "string")
          return s;
        const r = s.replace("window.", "").split(".");
        let o = window;
        for (const a of r) {
          if (o[a] === void 0)
            return s;
          o = o[a];
        }
        return typeof o == "function" ? o : s;
      };
      if (i.options.plugins?.tooltip?.callbacks) {
        const s = i.options.plugins.tooltip.callbacks;
        for (const r of Object.keys(s))
          s[r] = n(s[r]);
      }
      if (i.options.scales)
        for (const s of Object.keys(i.options.scales)) {
          const r = i.options.scales[s];
          r.ticks && r.ticks.callback && (r.ticks.callback = n(r.ticks.callback));
        }
    },
    destroy() {
      this.themeChangeHandler && (window.removeEventListener("rz:theme-change", this.themeChangeHandler), this.themeChangeHandler = null), this.chartInstance && (this.chartInstance.destroy(), this.chartInstance = null);
    }
  }));
}
async function Gc(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function Q(e, t, i) {
  let n, s;
  typeof t == "function" ? n = { success: t } : t && typeof t == "object" ? n = t : typeof t == "string" && (s = t), !s && typeof i == "string" && (s = i);
  const r = Array.isArray(e) ? e : [e];
  return Gc(r).then((o) => (rt.isDefined(o) || rt(r, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: s,
    inlineStyleNonce: s
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
function Qc(e) {
  kl(e), Dl(e), Nl(e), Pl(e), Ll(e), Rl(e, Q), Ml(e), zl(e, Q), Fl(e, Q), Bl(e), Ul(e, Q), Vl(e, Q), jl(e), Hl(e, Q), Wl(e), Ec(e), Tc(e), Sc(e), Cc(e), $c(e), Ac(e), Oc(e), kc(e), Dc(e), Nc(e), Pc(e, Q), Lc(e), Rc(e), Mc(e), zc(e), Fc(e), Bc(e), Uc(e), Vc(e), jc(e), Hc(e), Wc(e), qc(e), Yc(e), Kc(e), Jc(e), Xc(e), Zc(e, Q);
}
function tu(e) {
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
const pe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
let _n = !1;
function eu(e) {
  return me.has(e) || me.set(
    e,
    import(e).catch((t) => {
      throw me.delete(e), t;
    })
  ), me.get(e);
}
function En(e, t) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    e,
    () => eu(t).catch((n) => (console.error(
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
function iu(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = pe.get(e);
  i && i.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${i.path}
  New:      ${t}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const s = !i || i.path !== t;
    if (!(i && i.loaderSet && !s)) {
      const o = En(e, t);
      pe.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  pe.set(e, { path: t, loaderSet: !1 }), _n || (_n = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [s, r] of pe)
        if (!r.loaderSet) {
          const o = En(s, r.path);
          r.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function nu(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: s }) => {
    const r = i.find((v) => v.startsWith("bp-")), o = r ? parseInt(r.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (v) => {
      t.dataset.mobile = v ? "true" : "false", t.dataset.screen = v ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (v) => {
      if (!a) return;
      const p = u();
      p && (p[n] = v);
    }, h = (v) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: v, width: window.innerWidth, breakpoint: o }
        })
      );
    }, g = window.matchMedia(`(max-width: ${o - 1}px)`), f = () => {
      const v = l();
      c(v), d(v), h(v);
    };
    f();
    const y = () => f(), m = () => f();
    g.addEventListener("change", y), window.addEventListener("resize", m, { passive: !0 }), s(() => {
      g.removeEventListener("change", y), window.removeEventListener("resize", m);
    });
  });
}
function su(e) {
  const t = (i, { expression: n, modifiers: s }, { cleanup: r, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (y, m, v) => {
      const x = m.replace(/\[(\d+)\]/g, ".$1").split("."), _ = x.pop();
      let I = y;
      for (const b of x)
        (I[b] == null || typeof I[b] != "object") && (I[b] = isFinite(+b) ? [] : {}), I = I[b];
      I[_] = v;
    }, l = e.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = n.split(",").map((y) => y.trim()).filter(Boolean).map((y) => {
      const m = y.split("->").map((v) => v.trim());
      return m.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', y), null) : { parentPath: m[0], childPath: m[1] };
    }).filter(Boolean), h = s.includes("init-child") || s.includes("child") || s.includes("childWins"), g = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: h
      // avoid redundant first child->parent write
    })), f = [];
    d.forEach((y, m) => {
      const v = g[m];
      if (h) {
        const _ = e.evaluate(i, y.childPath, { scope: c });
        v.fromChild = !0, a(u, y.parentPath, _), queueMicrotask(() => {
          v.fromChild = !1;
        });
      } else {
        const _ = e.evaluate(i, y.parentPath, { scope: u });
        v.fromParent = !0, a(c, y.childPath, _), queueMicrotask(() => {
          v.fromParent = !1;
        });
      }
      const p = o(() => {
        const _ = e.evaluate(i, y.parentPath, { scope: u });
        v.fromChild || (v.fromParent = !0, a(c, y.childPath, _), queueMicrotask(() => {
          v.fromParent = !1;
        }));
      }), x = o(() => {
        const _ = e.evaluate(i, y.childPath, { scope: c });
        if (!v.fromParent) {
          if (v.skipChildOnce) {
            v.skipChildOnce = !1;
            return;
          }
          v.fromChild = !0, a(u, y.parentPath, _), queueMicrotask(() => {
            v.fromChild = !1;
          });
        }
      });
      f.push(p, x);
    }), r(() => {
      for (const y of f)
        try {
          y && y();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class ru {
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
    const t = this.effectiveDark, i = this._mode, n = this.prefersDark, s = typeof document < "u" ? document.documentElement : null, r = s ? s.classList.contains(this.darkClass) === t && s.style.colorScheme === (t ? "dark" : "light") : !0;
    this._lastSnapshot.mode === i && this._lastSnapshot.effectiveDark === t && this._lastSnapshot.prefersDark === n && r || (this._lastSnapshot = { mode: i, effectiveDark: t, prefersDark: n }, s && (s.classList.toggle(this.darkClass, t), s.style.colorScheme = t ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
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
const F = new ru();
function ou(e) {
  F.init(), e.store("theme", {
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
let qt = null;
function au(e) {
  return qt || (e.plugin(ka), e.plugin(Ra), e.plugin(nl), e.plugin(hl), typeof document < "u" && document.addEventListener("alpine:init", () => {
    ou(e);
  }), Qc(e), nu(e), su(e), qt = {
    Alpine: e,
    require: Q,
    toast: Tl,
    $data: Al,
    props: tu,
    registerAsyncComponent: iu,
    theme: F
  }, typeof window < "u" && (F.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...qt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), qt);
}
const uu = au(Ms);
Ms.start();
export {
  uu as default
};
