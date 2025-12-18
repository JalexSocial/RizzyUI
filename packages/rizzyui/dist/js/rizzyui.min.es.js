var jt = !1, Vt = !1, de = [], Ht = -1;
function ls(e) {
  cs(e);
}
function cs(e) {
  de.includes(e) || de.push(e), ds();
}
function us(e) {
  let t = de.indexOf(e);
  t !== -1 && t > Ht && de.splice(t, 1);
}
function ds() {
  !Vt && !jt && (jt = !0, queueMicrotask(fs));
}
function fs() {
  jt = !1, Vt = !0;
  for (let e = 0; e < de.length; e++)
    de[e](), Ht = e;
  de.length = 0, Ht = -1, Vt = !1;
}
var Se, ye, Ce, bi, Wt = !0;
function hs(e) {
  Wt = !1, e(), Wt = !0;
}
function ps(e) {
  Se = e.reactive, Ce = e.release, ye = (t) => e.effect(t, { scheduler: (n) => {
    Wt ? ls(n) : n();
  } }), bi = e.raw;
}
function Pn(e) {
  ye = e;
}
function ms(e) {
  let t = () => {
  };
  return [(i) => {
    let r = ye(i);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Ce(r));
    }, r;
  }, () => {
    t();
  }];
}
function yi(e, t) {
  let n = !0, i, r = ye(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => Ce(r);
}
var wi = [], _i = [], xi = [];
function gs(e) {
  xi.push(e);
}
function hn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, _i.push(t));
}
function Ei(e) {
  wi.push(e);
}
function Ii(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Si(e, t) {
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
function Ci() {
  bs(), pn.disconnect(), mn = !1;
}
var Ne = [];
function bs() {
  let e = pn.takeRecords();
  Ne.push(() => e.length > 0 && bn(e));
  let t = Ne.length;
  queueMicrotask(() => {
    if (Ne.length === t)
      for (; Ne.length > 0; )
        Ne.shift()();
  });
}
function $(e) {
  if (!mn)
    return e();
  Ci();
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
    Si(o, s);
  }), i.forEach((s, o) => {
    wi.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || _i.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && xi.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function Ti(e) {
  return Ye(xe(e));
}
function Ue(e, t, n) {
  return e._x_dataStack = [t, ...xe(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function xe(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? xe(e.host) : e.parentNode ? xe(e.parentNode) : [];
}
function Ye(e) {
  return new Proxy({ objects: e }, _s);
}
var _s = {
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
    return t == "toJSON" ? xs : Reflect.get(
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
function xs() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function Ai(e) {
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
function Oi(e, t = () => {
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
var $i = {};
function W(e, t) {
  $i[e] = t;
}
function Ut(e, t) {
  let n = Is(t);
  return Object.entries($i).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Is(e) {
  let [t, n] = Mi(e), i = { interceptor: Oi, ...t };
  return hn(e, n), i;
}
function Ss(e, t, n, ...i) {
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
var st = !0;
function Ni(e) {
  let t = st;
  st = !1;
  let n = e();
  return st = t, n;
}
function fe(e, t, n = {}) {
  let i;
  return k(e, t)((r) => i = r, n), i;
}
function k(...e) {
  return ki(...e);
}
var ki = Ri;
function Cs(e) {
  ki = e;
}
function Ri(e, t) {
  let n = {};
  Ut(n, e);
  let i = [n, ...xe(e)], r = typeof t == "function" ? Ts(i, t) : Os(i, t, e);
  return Ss.bind(null, e, t, r);
}
function Ts(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [], context: s } = {}) => {
    let o = t.apply(Ye([i, ...e]), r);
    ct(n, o);
  };
}
var Lt = {};
function As(e, t) {
  if (Lt[e])
    return Lt[e];
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
  return Lt[e] = s, s;
}
function Os(e, t, n) {
  let i = As(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    i.result = void 0, i.finished = !1;
    let l = Ye([s, ...e]);
    if (typeof i == "function") {
      let c = i.call(a, i, l).catch((u) => Ve(u, n, t));
      i.finished ? (ct(r, i.result, l, o, n), i.result = void 0) : c.then((u) => {
        ct(r, u, l, o, n);
      }).catch((u) => Ve(u, n, t)).finally(() => i.result = void 0);
    }
  };
}
function ct(e, t, n, i, r) {
  if (st && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => ct(e, o, n, i)).catch((o) => Ve(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var yn = "x-";
function Te(e = "") {
  return yn + e;
}
function $s(e) {
  yn = e;
}
var ut = {};
function N(e, t) {
  return ut[e] = t, {
    before(n) {
      if (!ut[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = ue.indexOf(n);
      ue.splice(i >= 0 ? i : ue.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Ns(e) {
  return Object.keys(ut).includes(e);
}
function wn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Li(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Fi((s, o) => i[s] = o)).filter(ji).map(Ls(i, n)).sort(Ds).map((s) => Rs(e, s));
}
function Li(e) {
  return Array.from(e).map(Fi()).filter((t) => !ji(t));
}
var Yt = !1, Fe = /* @__PURE__ */ new Map(), Di = Symbol();
function ks(e) {
  Yt = !0;
  let t = Symbol();
  Di = t, Fe.set(t, []);
  let n = () => {
    for (; Fe.get(t).length; )
      Fe.get(t).shift()();
    Fe.delete(t);
  }, i = () => {
    Yt = !1, n();
  };
  e(n), i();
}
function Mi(e) {
  let t = [], n = (a) => t.push(a), [i, r] = ms(e);
  return t.push(r), [{
    Alpine: Ke,
    effect: i,
    cleanup: n,
    evaluateLater: k.bind(k, e),
    evaluate: fe.bind(fe, e)
  }, () => t.forEach((a) => a())];
}
function Rs(e, t) {
  let n = () => {
  }, i = ut[t.type] || n, [r, s] = Mi(e);
  Ii(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Yt ? Fe.get(Di).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Pi = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), zi = (e) => e;
function Fi(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: r } = Bi.reduce((s, o) => o(s), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: r };
  };
}
var Bi = [];
function _n(e) {
  Bi.push(e);
}
function ji({ name: e }) {
  return Vi().test(e);
}
var Vi = () => new RegExp(`^${yn}([^:^.]+)\\b`);
function Ls(e, t) {
  return ({ name: n, value: i }) => {
    let r = n.match(Vi()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
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
function Ds(e, t) {
  let n = ue.indexOf(e.type) === -1 ? Kt : e.type, i = ue.indexOf(t.type) === -1 ? Kt : t.type;
  return ue.indexOf(n) - ue.indexOf(i);
}
function Be(e, t, n = {}) {
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
var zn = !1;
function Ms() {
  zn && F("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), zn = !0, document.body || F("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Be(document, "alpine:init"), Be(document, "alpine:initializing"), gn(), gs((t) => G(t, ge)), hn((t) => Oe(t)), Ei((t, n) => {
    wn(t, n).forEach((i) => i());
  });
  let e = (t) => !xt(t.parentElement, !0);
  Array.from(document.querySelectorAll(qi().join(","))).filter(e).forEach((t) => {
    G(t);
  }), Be(document, "alpine:initialized"), setTimeout(() => {
    Bs();
  });
}
var xn = [], Hi = [];
function Wi() {
  return xn.map((e) => e());
}
function qi() {
  return xn.concat(Hi).map((e) => e());
}
function Ui(e) {
  xn.push(e);
}
function Yi(e) {
  Hi.push(e);
}
function xt(e, t = !1) {
  return Ae(e, (n) => {
    if ((t ? qi() : Wi()).some((r) => n.matches(r)))
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
function Ps(e) {
  return Wi().some((t) => e.matches(t));
}
var Ki = [];
function zs(e) {
  Ki.push(e);
}
var Fs = 1;
function G(e, t = ge, n = () => {
}) {
  Ae(e, (i) => i._x_ignore) || ks(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Ki.forEach((s) => s(i, r)), wn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Fs++), i._x_ignore && r());
    });
  });
}
function Oe(e, t = ge) {
  t(e, (n) => {
    vs(n), Si(n), delete n._x_marker;
  });
}
function Bs() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    Ns(n) || i.some((r) => {
      if (document.querySelector(r))
        return F(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Jt = [], En = !1;
function In(e = () => {
}) {
  return queueMicrotask(() => {
    En || setTimeout(() => {
      Gt();
    });
  }), new Promise((t) => {
    Jt.push(() => {
      e(), t();
    });
  });
}
function Gt() {
  for (En = !1; Jt.length; )
    Jt.shift()();
}
function js() {
  En = !0;
}
function Sn(e, t) {
  return Array.isArray(t) ? Fn(e, t.join(" ")) : typeof t == "object" && t !== null ? Vs(e, t) : typeof t == "function" ? Sn(e, t()) : Fn(e, t);
}
function Fn(e, t) {
  let n = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function Vs(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(t).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function Et(e, t) {
  return typeof t == "object" && t !== null ? Hs(e, t) : Ws(e, t);
}
function Hs(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = qs(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Et(e, n);
  };
}
function Ws(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function qs(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Zt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
N("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Ys(e, n, t) : Us(e, i, t));
});
function Us(e, t, n) {
  Ji(e, Sn, ""), {
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
function Ys(e, t, n) {
  Ji(e, Et);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((g, h) => h < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((g, h) => h > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? ke(t, "scale", 95) / 100 : 1, d = ke(t, "delay", 0) / 1e3, f = ke(t, "origin", "center"), v = "opacity, transform", x = ke(t, "duration", 150) / 1e3, w = ke(t, "duration", 75) / 1e3, p = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: v,
    transitionDuration: `${x}s`,
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
    transitionProperty: v,
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
function Ji(e, t, n = {}) {
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
  Ks(e, {
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
function Ks(e, t) {
  let n, i, r, s = Zt(() => {
    $(() => {
      n = !0, i || t.before(), r || (t.end(), Gt()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Zt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, $(() => {
    t.start(), t.during();
  }), js(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), $(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || ($(() => {
        t.end();
      }), Gt(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function ke(e, t, n) {
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
function Js(e) {
  return (...t) => ie && e(...t);
}
var Zi = [];
function It(e) {
  Zi.push(e);
}
function Gs(e, t) {
  Zi.forEach((n) => n(e, t)), ie = !0, Xi(() => {
    G(t, (n, i) => {
      i(n, () => {
      });
    });
  }), ie = !1;
}
var Qt = !1;
function Zs(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ie = !0, Qt = !0, Xi(() => {
    Xs(t);
  }), ie = !1, Qt = !1;
}
function Xs(e) {
  let t = !1;
  G(e, (i, r) => {
    ge(i, (s, o) => {
      if (t && Ps(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function Xi(e) {
  let t = ye;
  Pn((n, i) => {
    let r = t(n);
    return Ce(r), () => {
    };
  }), e(), Pn(t);
}
function Qi(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Se({})), e._x_bindings[t] = n, t = i.includes("camel") ? oo(t) : t, t) {
    case "value":
      Qs(e, n);
      break;
    case "style":
      to(e, n);
      break;
    case "class":
      eo(e, n);
      break;
    case "selected":
    case "checked":
      no(e, t, n);
      break;
    default:
      er(e, t, n);
      break;
  }
}
function Qs(e, t) {
  if (ir(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = ot(e.value) === t : e.checked = Bn(e.value, t));
  else if (Cn(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Bn(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    so(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function eo(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Sn(e, t);
}
function to(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Et(e, t);
}
function no(e, t, n) {
  er(e, t, n), ro(e, t, n);
}
function er(e, t, n) {
  [null, void 0, !1].includes(n) && lo(t) ? e.removeAttribute(t) : (tr(t) && (n = t), io(e, t, n));
}
function io(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function ro(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function so(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function oo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Bn(e, t) {
  return e == t;
}
function ot(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
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
function tr(e) {
  return ao.has(e);
}
function lo(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function co(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : nr(e, t, n);
}
function uo(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, Ni(() => fe(e, r.expression));
  }
  return nr(e, t, n);
}
function nr(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : tr(t) ? !![t, "true"].includes(i) : i;
}
function Cn(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function ir(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function rr(e, t) {
  let n;
  return function() {
    const i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function sr(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function or({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = ye(() => {
    let a = e(), l = n();
    if (r)
      i(Dt(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(Dt(a)) : c !== u && t(Dt(l));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Ce(o);
  };
}
function Dt(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function fo(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(Ke));
}
var le = {}, jn = !1;
function ho(e, t) {
  if (jn || (le = Se(le), jn = !0), t === void 0)
    return le[e];
  le[e] = t, Ai(le[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && le[e].init();
}
function po() {
  return le;
}
var ar = {};
function mo(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? lr(e, n()) : (ar[e] = n, () => {
  });
}
function go(e) {
  return Object.entries(ar).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function lr(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Li(r);
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
var cr = {};
function vo(e, t) {
  cr[e] = t;
}
function bo(e, t) {
  return Object.entries(cr).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...r) => i.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var yo = {
  get reactive() {
    return Se;
  },
  get release() {
    return Ce;
  },
  get effect() {
    return ye;
  },
  get raw() {
    return bi;
  },
  version: "3.15.0",
  flushAndStopDeferringMutations: ws,
  dontAutoEvaluateFunctions: Ni,
  disableEffectScheduling: hs,
  startObservingMutations: gn,
  stopObservingMutations: Ci,
  setReactivityEngine: ps,
  onAttributeRemoved: Ii,
  onAttributesAdded: Ei,
  closestDataStack: xe,
  skipDuringClone: oe,
  onlyDuringClone: Js,
  addRootSelector: Ui,
  addInitSelector: Yi,
  interceptClone: It,
  addScopeToNode: Ue,
  deferMutations: ys,
  mapAttributes: _n,
  evaluateLater: k,
  interceptInit: zs,
  setEvaluator: Cs,
  mergeProxies: Ye,
  extractProp: uo,
  findClosest: Ae,
  onElRemoved: hn,
  closestRoot: xt,
  destroyTree: Oe,
  interceptor: Oi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Xt,
  // INTERNAL
  setStyles: Et,
  // INTERNAL
  mutateDom: $,
  directive: N,
  entangle: or,
  throttle: sr,
  debounce: rr,
  evaluate: fe,
  initTree: G,
  nextTick: In,
  prefixed: Te,
  prefix: $s,
  plugin: fo,
  magic: W,
  store: ho,
  start: Ms,
  clone: Zs,
  // INTERNAL
  cloneNode: Gs,
  // INTERNAL
  bound: co,
  $data: Ti,
  watch: yi,
  walk: ge,
  data: vo,
  bind: mo
}, Ke = yo;
function wo(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = e.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var _o = Object.freeze({}), xo = Object.prototype.hasOwnProperty, St = (e, t) => xo.call(e, t), he = Array.isArray, je = (e) => ur(e) === "[object Map]", Eo = (e) => typeof e == "string", Tn = (e) => typeof e == "symbol", Ct = (e) => e !== null && typeof e == "object", Io = Object.prototype.toString, ur = (e) => Io.call(e), dr = (e) => ur(e).slice(8, -1), An = (e) => Eo(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, So = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Co = So((e) => e.charAt(0).toUpperCase() + e.slice(1)), fr = (e, t) => e !== t && (e === e || t === t), en = /* @__PURE__ */ new WeakMap(), Re = [], Y, pe = Symbol("iterate"), tn = Symbol("Map key iterate");
function To(e) {
  return e && e._isEffect === !0;
}
function Ao(e, t = _o) {
  To(e) && (e = e.raw);
  const n = No(e, t);
  return t.lazy || n(), n;
}
function Oo(e) {
  e.active && (hr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var $o = 0;
function No(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Re.includes(n)) {
      hr(n);
      try {
        return Ro(), Re.push(n), Y = n, e();
      } finally {
        Re.pop(), pr(), Y = Re[Re.length - 1];
      }
    }
  };
  return n.id = $o++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function hr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var Ee = !0, On = [];
function ko() {
  On.push(Ee), Ee = !1;
}
function Ro() {
  On.push(Ee), Ee = !0;
}
function pr() {
  const e = On.pop();
  Ee = e === void 0 ? !0 : e;
}
function j(e, t, n) {
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
function re(e, t, n, i, r, s) {
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
        he(e) ? An(n) && l(o.get("length")) : (l(o.get(pe)), je(e) && l(o.get(tn)));
        break;
      case "delete":
        he(e) || (l(o.get(pe)), je(e) && l(o.get(tn)));
        break;
      case "set":
        je(e) && l(o.get(pe));
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
var Lo = /* @__PURE__ */ wo("__proto__,__v_isRef,__isVue"), mr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(Tn)), Do = /* @__PURE__ */ gr(), Mo = /* @__PURE__ */ gr(!0), Vn = /* @__PURE__ */ Po();
function Po() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const i = O(this);
      for (let s = 0, o = this.length; s < o; s++)
        j(i, "get", s + "");
      const r = i[t](...n);
      return r === -1 || r === !1 ? i[t](...n.map(O)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      ko();
      const i = O(this)[t].apply(this, n);
      return pr(), i;
    };
  }), e;
}
function gr(e = !1, t = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? Zo : wr : t ? Go : yr).get(i))
      return i;
    const o = he(i);
    if (!e && o && St(Vn, r))
      return Reflect.get(Vn, r, s);
    const a = Reflect.get(i, r, s);
    return (Tn(r) ? mr.has(r) : Lo(r)) || (e || j(i, "get", r), t) ? a : nn(a) ? !o || !An(r) ? a.value : a : Ct(a) ? e ? _r(a) : Rn(a) : a;
  };
}
var zo = /* @__PURE__ */ Fo();
function Fo(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = O(r), o = O(o), !he(n) && nn(o) && !nn(r)))
      return o.value = r, !0;
    const a = he(n) && An(i) ? Number(i) < n.length : St(n, i), l = Reflect.set(n, i, r, s);
    return n === O(s) && (a ? fr(r, o) && re(n, "set", i, r, o) : re(n, "add", i, r)), l;
  };
}
function Bo(e, t) {
  const n = St(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && re(e, "delete", t, void 0, i), r;
}
function jo(e, t) {
  const n = Reflect.has(e, t);
  return (!Tn(t) || !mr.has(t)) && j(e, "has", t), n;
}
function Vo(e) {
  return j(e, "iterate", he(e) ? "length" : pe), Reflect.ownKeys(e);
}
var Ho = {
  get: Do,
  set: zo,
  deleteProperty: Bo,
  has: jo,
  ownKeys: Vo
}, Wo = {
  get: Mo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, $n = (e) => Ct(e) ? Rn(e) : e, Nn = (e) => Ct(e) ? _r(e) : e, kn = (e) => e, Tt = (e) => Reflect.getPrototypeOf(e);
function Ge(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = O(e), s = O(t);
  t !== s && !n && j(r, "get", t), !n && j(r, "get", s);
  const { has: o } = Tt(r), a = i ? kn : n ? Nn : $n;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function Ze(e, t = !1) {
  const n = this.__v_raw, i = O(n), r = O(e);
  return e !== r && !t && j(i, "has", e), !t && j(i, "has", r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Xe(e, t = !1) {
  return e = e.__v_raw, !t && j(O(e), "iterate", pe), Reflect.get(e, "size", e);
}
function Hn(e) {
  e = O(e);
  const t = O(this);
  return Tt(t).has.call(t, e) || (t.add(e), re(t, "add", e, e)), this;
}
function Wn(e, t) {
  t = O(t);
  const n = O(this), { has: i, get: r } = Tt(n);
  let s = i.call(n, e);
  s ? br(n, i, e) : (e = O(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? fr(t, o) && re(n, "set", e, t, o) : re(n, "add", e, t), this;
}
function qn(e) {
  const t = O(this), { has: n, get: i } = Tt(t);
  let r = n.call(t, e);
  r ? br(t, n, e) : (e = O(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && re(t, "delete", e, void 0, s), o;
}
function Un() {
  const e = O(this), t = e.size !== 0, n = je(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && re(e, "clear", void 0, void 0, n), i;
}
function Qe(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = O(o), l = t ? kn : e ? Nn : $n;
    return !e && j(a, "iterate", pe), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function et(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = O(r), o = je(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = r[e](...i), u = n ? kn : t ? Nn : $n;
    return !t && j(s, "iterate", l ? tn : pe), {
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
function ee(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${Co(e)} operation ${n}failed: target is readonly.`, O(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function qo() {
  const e = {
    get(s) {
      return Ge(this, s);
    },
    get size() {
      return Xe(this);
    },
    has: Ze,
    add: Hn,
    set: Wn,
    delete: qn,
    clear: Un,
    forEach: Qe(!1, !1)
  }, t = {
    get(s) {
      return Ge(this, s, !1, !0);
    },
    get size() {
      return Xe(this);
    },
    has: Ze,
    add: Hn,
    set: Wn,
    delete: qn,
    clear: Un,
    forEach: Qe(!1, !0)
  }, n = {
    get(s) {
      return Ge(this, s, !0);
    },
    get size() {
      return Xe(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
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
    forEach: Qe(!0, !1)
  }, i = {
    get(s) {
      return Ge(this, s, !0, !0);
    },
    get size() {
      return Xe(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
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
    forEach: Qe(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = et(s, !1, !1), n[s] = et(s, !0, !1), t[s] = et(s, !1, !0), i[s] = et(s, !0, !0);
  }), [
    e,
    n,
    t,
    i
  ];
}
var [Uo, Yo, Mc, Pc] = /* @__PURE__ */ qo();
function vr(e, t) {
  const n = e ? Yo : Uo;
  return (i, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(St(n, r) && r in i ? n : i, r, s);
}
var Ko = {
  get: /* @__PURE__ */ vr(!1)
}, Jo = {
  get: /* @__PURE__ */ vr(!0)
};
function br(e, t, n) {
  const i = O(n);
  if (i !== n && t.call(e, i)) {
    const r = dr(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var yr = /* @__PURE__ */ new WeakMap(), Go = /* @__PURE__ */ new WeakMap(), wr = /* @__PURE__ */ new WeakMap(), Zo = /* @__PURE__ */ new WeakMap();
function Xo(e) {
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
function Qo(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Xo(dr(e));
}
function Rn(e) {
  return e && e.__v_isReadonly ? e : xr(e, !1, Ho, Ko, yr);
}
function _r(e) {
  return xr(e, !0, Wo, Jo, wr);
}
function xr(e, t, n, i, r) {
  if (!Ct(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = Qo(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? i : n);
  return r.set(e, a), a;
}
function O(e) {
  return e && O(e.__v_raw) || e;
}
function nn(e) {
  return !!(e && e.__v_isRef === !0);
}
W("nextTick", () => In);
W("dispatch", (e) => Be.bind(Be, e));
W("watch", (e, { evaluateLater: t, cleanup: n }) => (i, r) => {
  let s = t(i), a = yi(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
W("store", po);
W("data", (e) => Ti(e));
W("root", (e) => xt(e));
W("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ye(ea(e))), e._x_refs_proxy));
function ea(e) {
  let t = [];
  return Ae(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Mt = {};
function Er(e) {
  return Mt[e] || (Mt[e] = 0), ++Mt[e];
}
function ta(e, t) {
  return Ae(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function na(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Er(t));
}
W("id", (e, { cleanup: t }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return ia(e, r, t, () => {
    let s = ta(e, n), o = s ? s._x_ids[n] : Er(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
It((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function ia(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = i();
  return e._x_id[t] = r, n(() => {
    delete e._x_id[t];
  }), r;
}
W("el", (e) => e);
Ir("Focus", "focus", "focus");
Ir("Persist", "persist", "persist");
function Ir(e, t, n) {
  W(t, (i) => F(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
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
    let u = e._x_model.get, d = e._x_model.set, f = or(
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
N("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && F("x-teleport can only be used on a <template> tag", e);
  let r = Yn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Ue(s, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  $(() => {
    o(s, r, t), oe(() => {
      G(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Yn(n);
    $(() => {
      o(e._x_teleport, a, t);
    });
  }, i(
    () => $(() => {
      s.remove(), Oe(s);
    })
  );
});
var ra = document.createElement("div");
function Yn(e) {
  let t = oe(() => document.querySelector(e), () => ra)();
  return t || F(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Sr = () => {
};
Sr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
N("ignore", Sr);
N("effect", oe((e, { expression: t }, { effect: n }) => {
  n(k(e, t));
}));
function rn(e, t, n, i) {
  let r = e, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (t = sa(t)), n.includes("camel") && (t = oa(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = dt(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = rr(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = dt(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = sr(s, c);
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
  })), (la(t) || Cr(t)) && (s = a(s, (l, c) => {
    ca(c, n) || l(c);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function sa(e) {
  return e.replace(/-/g, ".");
}
function oa(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function dt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function aa(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function la(e) {
  return ["keydown", "keyup"].includes(e);
}
function Cr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function ca(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, dt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, dt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Kn(e.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (Cr(e.type) || Kn(e.key).includes(n[0])));
}
function Kn(e) {
  if (!e)
    return [];
  e = aa(e);
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
    let f;
    return o((v) => f = v), Jn(f) ? f.get() : f;
  }, c = (f) => {
    let v;
    o((x) => v = x), Jn(v) ? v.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && e.type === "radio" && $(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = ie ? () => {
  } : rn(e, u, t, (f) => {
    c(Pt(e, t, f, l()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Cn(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Pt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, r(() => e._x_removeModelListeners.default()), e.form) {
    let f = rn(e.form, "reset", [], (v) => {
      In(() => e._x_model && e._x_model.set(Pt(e, t, { target: e }, l())));
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
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, $(() => Qi(e, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(f);
  });
});
function Pt(e, t, n, i) {
  return $(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Cn(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = zt(n.target.value) : t.includes("boolean") ? r = ot(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !ua(s, r));
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
        return ir(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? zt(r) : t.includes("boolean") ? ot(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function zt(e) {
  let t = e ? parseFloat(e) : null;
  return da(t) ? t : e;
}
function ua(e, t) {
  return e == t;
}
function da(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Jn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
N("cloak", (e) => queueMicrotask(() => $(() => e.removeAttribute(Te("cloak")))));
Yi(() => `[${Te("init")}]`);
N("init", oe((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
N("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      $(() => {
        e.textContent = s;
      });
    });
  });
});
N("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      $(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, G(e), delete e._x_ignoreSelf;
      });
    });
  });
});
_n(Pi(":", zi(Te("bind:"))));
var Tr = (e, { value: t, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    go(l), k(e, i)((u) => {
      lr(e, u, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return fa(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = k(e, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), $(() => Qi(e, t, l, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Tr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
N("bind", Tr);
function fa(e, t) {
  e._x_keyExpression = t;
}
Ui(() => `[${Te("data")}]`);
N("data", (e, { expression: t }, { cleanup: n }) => {
  if (ha(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  Ut(i, e);
  let r = {};
  bo(r, i);
  let s = fe(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Ut(s, e);
  let o = Se(s);
  Ai(o);
  let a = Ue(e, o);
  o.init && fe(e, o.init), n(() => {
    o.destroy && fe(e, o.destroy), a();
  });
});
It((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ha(e) {
  return ie ? Qt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let r = k(e, n);
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
  }, a = () => setTimeout(o), l = Zt(
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
  let r = ma(t), s = k(e, r.items), o = k(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => pa(e, r, s, o)), i(() => {
    Object.values(e._x_lookup).forEach((a) => $(
      () => {
        Oe(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function pa(e, t, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    ga(o) && o >= 0 && (o = Array.from(Array(o).keys(), (p) => p + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([p, g]) => {
        let h = Gn(t, g, p, o);
        i((y) => {
          u.includes(y) && F("Duplicate key on x-for", e), u.push(y);
        }, { scope: { index: p, ...h } }), c.push(h);
      });
    else
      for (let p = 0; p < o.length; p++) {
        let g = Gn(t, o[p], p, o);
        i((h) => {
          u.includes(h) && F("Duplicate key on x-for", e), u.push(h);
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
      g in a && ($(() => {
        Oe(a[g]), a[g].remove();
      }), delete a[g]);
    }
    for (let p = 0; p < f.length; p++) {
      let [g, h] = f[p], y = a[g], E = a[h], _ = document.createElement("div");
      $(() => {
        E || F('x-for ":key" is undefined or invalid', s, h, a), E.after(_), y.after(E), E._x_currentIfEl && E.after(E._x_currentIfEl), _.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), _.remove();
      }), E._x_refreshXForScope(c[u.indexOf(h)]);
    }
    for (let p = 0; p < d.length; p++) {
      let [g, h] = d[p], y = g === "template" ? s : a[g];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let E = c[h], _ = u[h], m = document.importNode(s.content, !0).firstElementChild, b = Se(E);
      Ue(m, b, s), m._x_refreshXForScope = (I) => {
        Object.entries(I).forEach(([S, C]) => {
          b[S] = C;
        });
      }, $(() => {
        y.after(m), oe(() => G(m))();
      }), typeof _ == "object" && F("x-for key cannot be an object, it must be a string or an integer", s), a[_] = m;
    }
    for (let p = 0; p < x.length; p++)
      a[x[p]]._x_refreshXForScope(c[u.indexOf(x[p])]);
    s._x_prevKeys = u;
  });
}
function ma(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Gn(e, t, n, i) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = n), e.collection && (r[e.collection] = i), r;
}
function ga(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ar() {
}
Ar.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = xt(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
N("ref", Ar);
N("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && F("x-if can only be used on a <template> tag", e);
  let r = k(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Ue(a, {}, e), $(() => {
      e.after(a), oe(() => G(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      $(() => {
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
  n(t).forEach((r) => na(e, r));
});
It((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
_n(Pi("@", zi(Te("on:"))));
N("on", oe((e, { value: t, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? k(e, i) : () => {
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
  N(t, (i) => F(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Ke.setEvaluator(Ri);
Ke.setReactivityEngine({ reactive: Rn, effect: Ao, release: Oo, raw: O });
var va = Ke, Or = va;
function ba(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: i }) {
    let r = Zn(i, "duration", 250) / 1e3, s = Zn(i, "min", 0), o = !i.includes("min");
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
function Zn(e, t, n) {
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
var ya = ba;
function wa(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: Ea(r),
      threshold: _a(r)
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
function _a(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function xa(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Ea(e) {
  const t = "margin", n = "0px 0px 0px 0px", i = e.indexOf(t);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(xa(e[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var Ia = wa, $r = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ft = /* @__PURE__ */ $r.join(","), Nr = typeof Element > "u", ve = Nr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, sn = !Nr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, kr = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(ft));
  return n && ve.call(t, ft) && r.unshift(t), r = r.filter(i), r;
}, Rr = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = ve.call(o, ft);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), f = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (d && f) {
        var v = e(d === !0 ? o.children : d.children, !0, i);
        i.flatten ? r.push.apply(r, v) : r.push({
          scope: o,
          candidates: v
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Lr = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Sa = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, Dr = function(t) {
  return t.tagName === "INPUT";
}, Ca = function(t) {
  return Dr(t) && t.type === "hidden";
}, Ta = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, Aa = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, Oa = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || sn(t), i = function(a) {
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
  var s = Aa(r, t.form);
  return !s || s === t;
}, $a = function(t) {
  return Dr(t) && t.type === "radio";
}, Na = function(t) {
  return $a(t) && !Oa(t);
}, Xn = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, ka = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = ve.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (ve.call(o, "details:not([open]) *"))
    return !0;
  var a = sn(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = sn(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return Xn(t);
        t.assignedSlot ? t = t.assignedSlot : !u && d !== t.ownerDocument ? t = d.host : t = u;
      }
      t = c;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return Xn(t);
  return !1;
}, Ra = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return ve.call(n, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, ht = function(t, n) {
  return !(n.disabled || Ca(n) || ka(n, t) || // For a details element with a summary, the summary element gets the focus
  Ta(n) || Ra(n));
}, on = function(t, n) {
  return !(Na(n) || Lr(n) < 0 || !ht(t, n));
}, La = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Da = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Lr(a, o), c = o ? e(r.candidates) : a;
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
}, Ma = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Rr([t], n.includeContainer, {
    filter: on.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: La
  }) : i = kr(t, n.includeContainer, on.bind(null, n)), Da(i);
}, Mr = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Rr([t], n.includeContainer, {
    filter: ht.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = kr(t, n.includeContainer, ht.bind(null, n)), i;
}, tt = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return ve.call(t, ft) === !1 ? !1 : on(n, t);
}, Pa = /* @__PURE__ */ $r.concat("iframe").join(","), at = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return ve.call(t, Pa) === !1 ? !1 : ht(n, t);
};
function Qn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function ei(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qn(Object(n), !0).forEach(function(i) {
      za(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qn(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function za(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var ti = /* @__PURE__ */ function() {
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
}(), Fa = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Ba = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, ja = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, ni = function(t) {
  return setTimeout(t, 0);
}, ii = function(t, n) {
  var i = -1;
  return t.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Le = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, i) : t;
}, nt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Va = function(t, n) {
  var i = n?.document || document, r = ei({
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
    if (typeof b == "string" && (T = i.querySelector(b), !T))
      throw new Error("`".concat(m, "` as selector refers to no known node"));
    return T;
  }, u = function() {
    var m = c("initialFocus");
    if (m === !1)
      return !1;
    if (m === void 0)
      if (l(i.activeElement) >= 0)
        m = i.activeElement;
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
              return tt(L, r.tabbableOptions);
            }) : I.slice(0, R).reverse().find(function(L) {
              return tt(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(m) {
      return m.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function _(m) {
    if (m !== !1 && m !== i.activeElement) {
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
    var b = nt(m);
    if (!(l(b) >= 0)) {
      if (Le(r.clickOutsideDeactivates, m)) {
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
          returnFocus: r.returnFocusOnDeactivate && !at(b, r.tabbableOptions)
        });
        return;
      }
      Le(r.allowOutsideClick, m) || m.preventDefault();
    }
  }, w = function(m) {
    var b = nt(m), I = l(b) >= 0;
    I || b instanceof Document ? I && (s.mostRecentlyFocusedNode = b) : (m.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, p = function(m) {
    var b = nt(m);
    d();
    var I = null;
    if (s.tabbableGroups.length > 0) {
      var S = l(b), C = S >= 0 ? s.containerGroups[S] : void 0;
      if (S < 0)
        m.shiftKey ? I = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : I = s.tabbableGroups[0].firstTabbableNode;
      else if (m.shiftKey) {
        var T = ii(s.tabbableGroups, function(B) {
          var z = B.firstTabbableNode;
          return b === z;
        });
        if (T < 0 && (C.container === b || at(b, r.tabbableOptions) && !tt(b, r.tabbableOptions) && !C.nextTabbableNode(b, !1)) && (T = S), T >= 0) {
          var R = T === 0 ? s.tabbableGroups.length - 1 : T - 1, L = s.tabbableGroups[R];
          I = L.lastTabbableNode;
        }
      } else {
        var q = ii(s.tabbableGroups, function(B) {
          var z = B.lastTabbableNode;
          return b === z;
        });
        if (q < 0 && (C.container === b || at(b, r.tabbableOptions) && !tt(b, r.tabbableOptions) && !C.nextTabbableNode(b)) && (q = S), q >= 0) {
          var P = q === s.tabbableGroups.length - 1 ? 0 : q + 1, ae = s.tabbableGroups[P];
          I = ae.firstTabbableNode;
        }
      }
    } else
      I = c("fallbackFocus");
    I && (m.preventDefault(), f(I));
  }, g = function(m) {
    if (Ba(m) && Le(r.escapeDeactivates, m) !== !1) {
      m.preventDefault(), o.deactivate();
      return;
    }
    if (ja(m)) {
      p(m);
      return;
    }
  }, h = function(m) {
    var b = nt(m);
    l(b) >= 0 || Le(r.clickOutsideDeactivates, m) || Le(r.allowOutsideClick, m) || (m.preventDefault(), m.stopImmediatePropagation());
  }, y = function() {
    if (s.active)
      return ti.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? ni(function() {
        f(u());
      }) : f(u()), i.addEventListener("focusin", w, !0), i.addEventListener("mousedown", x, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", x, {
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
      return i.removeEventListener("focusin", w, !0), i.removeEventListener("mousedown", x, !0), i.removeEventListener("touchstart", x, !0), i.removeEventListener("click", h, !0), i.removeEventListener("keydown", g, !0), o;
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
      S || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, b && b();
      var C = function() {
        S && d(), y(), I && I();
      };
      return S ? (S(s.containers.concat()).then(C, C), this) : (C(), this);
    },
    deactivate: function(m) {
      if (!s.active)
        return this;
      var b = ei({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, m);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, E(), s.active = !1, s.paused = !1, ti.deactivateTrap(o);
      var I = a(b, "onDeactivate"), S = a(b, "onPostDeactivate"), C = a(b, "checkCanReturnFocus"), T = a(b, "returnFocus", "returnFocusOnDeactivate");
      I && I();
      var R = function() {
        ni(function() {
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
          f = ri(i);
        });
      });
      let v = Va(i, d), x = () => {
      };
      const w = () => {
        f(), f = () => {
        }, x(), x = () => {
        }, v.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((p) => {
        u !== p && (p && !u && (s.includes("noscroll") && (x = Wa()), setTimeout(() => {
          v.activate();
        }, 15)), !p && u && w(), u = !!p);
      })), l(w);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ri(i);
    }
  ));
}
function ri(e) {
  let t = [];
  return Pr(e, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Pr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? Pr(e.parentNode, t) : t(n);
  });
}
function Wa() {
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
function Ua() {
  return !0;
}
function Ya({ component: e, argument: t }) {
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
function Ka() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function Ja({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const n = window.matchMedia(`(${e})`);
    n.matches ? t() : n.addEventListener("change", t, { once: !0 });
  });
}
function Ga({ component: e, argument: t }) {
  return new Promise((n) => {
    const i = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), n());
    }, { rootMargin: i });
    r.observe(e.el);
  });
}
var si = {
  eager: Ua,
  event: Ya,
  idle: Ka,
  media: Ja,
  visible: Ga
};
async function Za(e) {
  const t = Xa(e.strategy);
  await an(e, t);
}
async function an(e, t) {
  if (t.type === "expression") {
    if (t.operator === "&&")
      return Promise.all(
        t.parameters.map((n) => an(e, n))
      );
    if (t.operator === "||")
      return Promise.any(
        t.parameters.map((n) => an(e, n))
      );
  }
  return si[t.method] ? si[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function Xa(e) {
  const t = Qa(e);
  let n = zr(t);
  return n.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [n]
  } : n;
}
function Qa(e) {
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
function zr(e) {
  let t = oi(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const n = e.shift().value, i = oi(e);
    t.type === "expression" && t.operator === n ? t.parameters.push(i) : t = {
      type: "expression",
      operator: n,
      parameters: [t, i]
    };
  }
  return t;
}
function oi(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = zr(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function el(e) {
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
      await Za({
        name: y,
        strategy: E,
        el: h,
        id: h.id || l()
      }), h.isConnected && (await f(y), h.isConnected && (x(h), h._x_async = "loaded"));
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
    if (h.startsWith("_x_async_") || (w(h), !o[h] || o[h].loaded)) return;
    const y = await v(h);
    e.data(h, y), o[h].loaded = !0;
  }
  async function v(h) {
    if (!o[h]) return;
    const y = await o[h].download(h);
    return typeof y == "function" ? y : y[h] || y.default || Object.values(y)[0] || !1;
  }
  function x(h) {
    e.destroyTree(h), h._x_ignore = !1, h.removeAttribute(i), !h.closest(`[${i}]`) && e.initTree(h);
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
  function p(h) {
    return (h || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function g(h) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(h) ? h : new URL(h, document.baseURI).href;
  }
}
function tl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function nl(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function il(e, t, n) {
  return t && nl(e.prototype, t), e;
}
var rl = Object.defineProperty, Z = function(e, t) {
  return rl(e, "name", { value: t, configurable: !0 });
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
`, ul = Z(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), De = Z(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), A = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, te = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ai = { OUTLINE: "outline", FILLED: "filled" }, Ft = { FADE: "fade", SLIDE: "slide" }, Me = { CLOSE: De(sl), SUCCESS: De(ll), ERROR: De(ol), WARNING: De(cl), INFO: De(al) }, li = Z(function(e) {
  e.wrapper.classList.add(A.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(A.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ci = Z(function(e) {
  e.wrapper.classList.remove(A.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), dl = Z(function(e) {
  e.wrapper.classList.add(A.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(A.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), fl = Z(function(e) {
  e.wrapper.classList.remove(A.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Fr = function() {
  function e(t) {
    var n = this;
    tl(this, e), this.notifyOut = Z(function(B) {
      B(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? Ft.FADE : c, d = t.type, f = d === void 0 ? "outline" : d, v = t.title, x = t.text, w = t.showIcon, p = w === void 0 ? !0 : w, g = t.customIcon, h = g === void 0 ? "" : g, y = t.customClass, E = y === void 0 ? "" : y, _ = t.speed, m = _ === void 0 ? 500 : _, b = t.showCloseButton, I = b === void 0 ? !0 : b, S = t.autoclose, C = S === void 0 ? !0 : S, T = t.autotimeout, R = T === void 0 ? 3e3 : T, L = t.position, q = L === void 0 ? "right top" : L, P = t.customWrapper, ae = P === void 0 ? "" : P;
    if (this.customWrapper = ae, this.status = l, this.title = v, this.text = x, this.showIcon = p, this.customIcon = h, this.customClass = E, this.speed = m, this.effect = u, this.showCloseButton = I, this.autoclose = C, this.autotimeout = R, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = q, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return il(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(A.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(A.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](A.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](A.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](A.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](A.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](A.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](A.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](A.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(A.NOTIFY_CLOSE), i.innerHTML = Me.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = ul(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(A.NOTIFY), this.type) {
      case ai.OUTLINE:
        this.wrapper.classList.add(A.NOTIFY_OUTLINE);
        break;
      case ai.FILLED:
        this.wrapper.classList.add(A.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(A.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case te.SUCCESS:
        this.wrapper.classList.add(A.NOTIFY_SUCCESS);
        break;
      case te.ERROR:
        this.wrapper.classList.add(A.NOTIFY_ERROR);
        break;
      case te.WARNING:
        this.wrapper.classList.add(A.NOTIFY_WARNING);
        break;
      case te.INFO:
        this.wrapper.classList.add(A.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(A.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(A.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(A.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(A.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
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
    i.classList.add(A.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
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
      case Ft.FADE:
        this.selectedNotifyInEffect = li, this.selectedNotifyOutEffect = ci;
        break;
      case Ft.SLIDE:
        this.selectedNotifyInEffect = dl, this.selectedNotifyOutEffect = fl;
        break;
      default:
        this.selectedNotifyInEffect = li, this.selectedNotifyOutEffect = ci;
    }
  } }]), e;
}();
Z(Fr, "Notify");
var Br = Fr;
globalThis.Notify = Br;
const jr = ["success", "error", "warning", "info"], Vr = [
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
], Hr = {
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
    ...Hr,
    ...e
  };
  jr.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Vr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Br(t);
}
const hl = {
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
    Object.assign(Hr, e);
  },
  get allowedStatuses() {
    return [...jr];
  },
  get allowedPositions() {
    return [...Vr];
  }
}, ln = function() {
}, He = {}, pt = {}, We = {};
function pl(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let i = e.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || t(n);
  }; i--; ) {
    if (o = e[i], a = pt[o], a) {
      s(o, a);
      continue;
    }
    l = We[o] = We[o] || [], l.push(s);
  }
}
function Wr(e, t) {
  if (!e) return;
  const n = We[e];
  if (pt[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function cn(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || ln)(t) : (e.success || ln)(e);
}
function ml(e, t, n, i, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return qr(t, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(t, l, e.defaultPrevented);
}
function qr(e, t, n, i) {
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
  const v = function(x) {
    ml(x, e, f, t, n, i, o, u);
  };
  f.addEventListener("load", v, { once: !0 }), f.addEventListener("error", v, { once: !0 }), a(e, f) !== !1 && r.head.appendChild(f);
}
function gl(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let i = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || t(r);
  }
  for (let o = 0; o < e.length; o++)
    qr(e[o], s, n);
}
function ne(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in He)
      throw "LoadJS";
    He[i] = !0;
  }
  function s(o, a) {
    gl(e, function(l) {
      cn(r, l), o && cn({ success: o, error: a }, l), Wr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
ne.ready = function(t, n) {
  return pl(t, function(i) {
    cn(n, i);
  }), ne;
};
ne.done = function(t) {
  Wr(t, []);
};
ne.reset = function() {
  Object.keys(He).forEach((t) => delete He[t]), Object.keys(pt).forEach((t) => delete pt[t]), Object.keys(We).forEach((t) => delete We[t]);
};
ne.isDefined = function(t) {
  return t in He;
};
function vl(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = bl(e) || e;
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
    if (r && (i = r.matches(n) ? r : r.querySelector(n)), i || (i = Ur(t)), !i) {
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
function bl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", n = e.getAttribute?.("data-for");
  if (t || n) {
    const i = n || "";
    if (!i) return e;
    const r = Ur(i);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${i}". Ensure the teleported root rendered with data-alpine-root="${i}".`
    ), null);
  }
  return e;
}
function Ur(e) {
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
function yl(e) {
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
function wl(e) {
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
function _l(e) {
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
function xl(e) {
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
function El(e) {
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
function Il(e, t) {
  e.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
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
    dispatchCalendarEvent(n, i) {
      this.$dispatch(`rz:calendar:${n}`, i);
    },
    destroy() {
      this.calendar && (this.calendar.destroy(), this.dispatchCalendarEvent("destroy", {}));
    }
  }));
}
function Sl(e, t) {
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
function Cl(e, t) {
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
function Tl(e) {
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
function Al(e, t) {
  e.data("rzCombobox", () => ({
    tomSelect: null,
    init() {
      const n = JSON.parse(this.$el.dataset.assets || "[]"), i = this.$el.dataset.nonce;
      n.length > 0 && typeof t == "function" ? t(n, {
        success: () => this.initTomSelect(),
        error: (r) => console.error("RzCombobox: Failed to load assets.", r)
      }, i) : window.TomSelect && this.initTomSelect();
    },
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
    destroy() {
      this.tomSelect && (this.tomSelect.destroy(), this.tomSelect = null);
    }
  }));
}
function Ol(e, t) {
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
function $l(e) {
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
const un = Math.min, we = Math.max, mt = Math.round, K = (e) => ({
  x: e,
  y: e
}), Nl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, kl = {
  start: "end",
  end: "start"
};
function di(e, t, n) {
  return we(e, un(t, n));
}
function Ot(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function be(e) {
  return e.split("-")[0];
}
function $t(e) {
  return e.split("-")[1];
}
function Kr(e) {
  return e === "x" ? "y" : "x";
}
function Jr(e) {
  return e === "y" ? "height" : "width";
}
function me(e) {
  return ["top", "bottom"].includes(be(e)) ? "y" : "x";
}
function Gr(e) {
  return Kr(me(e));
}
function Rl(e, t, n) {
  n === void 0 && (n = !1);
  const i = $t(e), r = Gr(e), s = Jr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = gt(o)), [o, gt(o)];
}
function Ll(e) {
  const t = gt(e);
  return [dn(e), t, dn(t)];
}
function dn(e) {
  return e.replace(/start|end/g, (t) => kl[t]);
}
function Dl(e, t, n) {
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
function Ml(e, t, n, i) {
  const r = $t(e);
  let s = Dl(be(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(dn)))), s;
}
function gt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Nl[t]);
}
function Pl(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function zl(e) {
  return typeof e != "number" ? Pl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function vt(e) {
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
  const s = me(t), o = Gr(t), a = Jr(o), l = be(t), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
  let v;
  switch (l) {
    case "top":
      v = {
        x: u,
        y: i.y - r.height
      };
      break;
    case "bottom":
      v = {
        x: u,
        y: i.y + i.height
      };
      break;
    case "right":
      v = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      v = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      v = {
        x: i.x,
        y: i.y
      };
  }
  switch ($t(t)) {
    case "start":
      v[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      v[o] += f * (n && c ? -1 : 1);
      break;
  }
  return v;
}
const Fl = async (e, t, n) => {
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
  } = fi(c, i, l), f = i, v = {}, x = 0;
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
      initialPlacement: i,
      placement: f,
      strategy: r,
      middlewareData: v,
      rects: c,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = h ?? u, d = y ?? d, v = {
      ...v,
      [p]: {
        ...v[p],
        ...E
      }
    }, _ && x <= 50 && (x++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (c = _.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : _.rects), {
      x: u,
      y: d
    } = fi(c, f, l)), w = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: v
  };
};
async function Zr(e, t) {
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
    padding: v = 0
  } = Ot(t, e), x = zl(v), p = a[f ? d === "floating" ? "reference" : "floating" : d], g = vt(await s.getClippingRect({
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
  }, _ = vt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
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
const Bl = function(e) {
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
        fallbackStrategy: v = "bestFit",
        fallbackAxisSideDirection: x = "none",
        flipAlignment: w = !0,
        ...p
      } = Ot(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const g = be(r), h = me(a), y = be(a) === a, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), _ = f || (y || !w ? [gt(a)] : Ll(a)), m = x !== "none";
      !f && m && _.push(...Ml(a, w, x, E));
      const b = [a, ..._], I = await Zr(t, p), S = [];
      let C = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && S.push(I[g]), d) {
        const P = Rl(r, o, E);
        S.push(I[P[0]], I[P[1]]);
      }
      if (C = [...C, {
        placement: r,
        overflows: S
      }], !S.every((P) => P <= 0)) {
        var T, R;
        const P = (((T = s.flip) == null ? void 0 : T.index) || 0) + 1, ae = b[P];
        if (ae) {
          var L;
          const z = d === "alignment" ? h !== me(ae) : !1, U = ((L = C[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!z || U)
            return {
              data: {
                index: P,
                overflows: C
              },
              reset: {
                placement: ae
              }
            };
        }
        let B = (R = C.filter((z) => z.overflows[0] <= 0).sort((z, U) => z.overflows[1] - U.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!B)
          switch (v) {
            case "bestFit": {
              var q;
              const z = (q = C.filter((U) => {
                if (m) {
                  const Q = me(U.placement);
                  return Q === h || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Q === "y";
                }
                return !0;
              }).map((U) => [U.placement, U.overflows.filter((Q) => Q > 0).reduce((Q, as) => Q + as, 0)]).sort((U, Q) => U[1] - Q[1])[0]) == null ? void 0 : q[0];
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
async function jl(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = be(n), a = $t(n), l = me(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Ot(t, e);
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
const Vl = function(e) {
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
}, Hl = function(e) {
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
      } = Ot(e, t), c = {
        x: n,
        y: i
      }, u = await Zr(t, l), d = me(be(r)), f = Kr(d);
      let v = c[f], x = c[d];
      if (s) {
        const p = f === "y" ? "top" : "left", g = f === "y" ? "bottom" : "right", h = v + u[p], y = v - u[g];
        v = di(h, v, y);
      }
      if (o) {
        const p = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", h = x + u[p], y = x - u[g];
        x = di(h, x, y);
      }
      const w = a.fn({
        ...t,
        [f]: v,
        [d]: x
      });
      return {
        ...w,
        data: {
          x: w.x - n,
          y: w.y - i,
          enabled: {
            [f]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Nt() {
  return typeof window < "u";
}
function $e(e) {
  return Xr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function M(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function X(e) {
  var t;
  return (t = (Xr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Xr(e) {
  return Nt() ? e instanceof Node || e instanceof M(e).Node : !1;
}
function V(e) {
  return Nt() ? e instanceof Element || e instanceof M(e).Element : !1;
}
function J(e) {
  return Nt() ? e instanceof HTMLElement || e instanceof M(e).HTMLElement : !1;
}
function hi(e) {
  return !Nt() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof M(e).ShadowRoot;
}
function Je(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = H(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function Wl(e) {
  return ["table", "td", "th"].includes($e(e));
}
function kt(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Ln(e) {
  const t = Dn(), n = V(e) ? H(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function ql(e) {
  let t = se(e);
  for (; J(t) && !Ie(t); ) {
    if (Ln(t))
      return t;
    if (kt(t))
      return null;
    t = se(t);
  }
  return null;
}
function Dn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ie(e) {
  return ["html", "body", "#document"].includes($e(e));
}
function H(e) {
  return M(e).getComputedStyle(e);
}
function Rt(e) {
  return V(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function se(e) {
  if ($e(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    hi(e) && e.host || // Fallback.
    X(e)
  );
  return hi(t) ? t.host : t;
}
function Qr(e) {
  const t = se(e);
  return Ie(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : J(t) && Je(t) ? t : Qr(t);
}
function es(e, t, n) {
  var i;
  t === void 0 && (t = []);
  const r = Qr(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = M(r);
  return s ? (fn(o), t.concat(o, o.visualViewport || [], Je(r) ? r : [], [])) : t.concat(r, es(r, []));
}
function fn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function ts(e) {
  const t = H(e);
  let n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const r = J(e), s = r ? e.offsetWidth : n, o = r ? e.offsetHeight : i, a = mt(n) !== s || mt(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function ns(e) {
  return V(e) ? e : e.contextElement;
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
  let o = (s ? mt(n.width) : n.width) / i, a = (s ? mt(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Ul = /* @__PURE__ */ K(0);
function is(e) {
  const t = M(e);
  return !Dn() || !t.visualViewport ? Ul : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Yl(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== M(e) ? !1 : t;
}
function qe(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = ns(e);
  let o = K(1);
  t && (i ? V(i) && (o = _e(i)) : o = _e(e));
  const a = Yl(s, n, i) ? is(s) : K(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = M(s), v = i && V(i) ? M(i) : i;
    let x = f, w = fn(x);
    for (; w && i && v !== x; ) {
      const p = _e(w), g = w.getBoundingClientRect(), h = H(w), y = g.left + (w.clientLeft + parseFloat(h.paddingLeft)) * p.x, E = g.top + (w.clientTop + parseFloat(h.paddingTop)) * p.y;
      l *= p.x, c *= p.y, u *= p.x, d *= p.y, l += y, c += E, x = M(w), w = fn(x);
    }
  }
  return vt({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Mn(e, t) {
  const n = Rt(e).scrollLeft;
  return t ? t.left + n : qe(X(e)).left + n;
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
function Kl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = X(i), a = t ? kt(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), d = J(i);
  if ((d || !d && !s) && (($e(i) !== "body" || Je(o)) && (l = Rt(i)), J(i))) {
    const v = qe(i);
    c = _e(i), u.x = v.x + i.clientLeft, u.y = v.y + i.clientTop;
  }
  const f = o && !d && !s ? rs(o, l, !0) : K(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Jl(e) {
  return Array.from(e.getClientRects());
}
function Gl(e) {
  const t = X(e), n = Rt(e), i = e.ownerDocument.body, r = we(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = we(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Mn(e);
  const a = -n.scrollTop;
  return H(i).direction === "rtl" && (o += we(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function Zl(e, t) {
  const n = M(e), i = X(e), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Dn();
    (!c || c && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Xl(e, t) {
  const n = qe(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = J(e) ? _e(e) : K(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, c = i * s.y;
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
    i = Zl(e, n);
  else if (t === "document")
    i = Gl(X(e));
  else if (V(t))
    i = Xl(t, n);
  else {
    const r = is(e);
    i = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return vt(i);
}
function ss(e, t) {
  const n = se(e);
  return n === t || !V(n) || Ie(n) ? !1 : H(n).position === "fixed" || ss(n, t);
}
function Ql(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = es(e, []).filter((a) => V(a) && $e(a) !== "body"), r = null;
  const s = H(e).position === "fixed";
  let o = s ? se(e) : e;
  for (; V(o) && !Ie(o); ) {
    const a = H(o), l = Ln(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Je(o) && !l && ss(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = se(o);
  }
  return t.set(e, i), i;
}
function ec(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? kt(t) ? [] : Ql(t, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = pi(t, u, r);
    return c.top = we(d.top, c.top), c.right = un(d.right, c.right), c.bottom = un(d.bottom, c.bottom), c.left = we(d.left, c.left), c;
  }, pi(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function tc(e) {
  const {
    width: t,
    height: n
  } = ts(e);
  return {
    width: t,
    height: n
  };
}
function nc(e, t, n) {
  const i = J(t), r = X(t), s = n === "fixed", o = qe(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = Mn(r);
  }
  if (i || !i && !s)
    if (($e(t) !== "body" || Je(r)) && (a = Rt(t)), i) {
      const v = qe(t, !0, s, t);
      l.x = v.x + t.clientLeft, l.y = v.y + t.clientTop;
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
  return H(e).position === "static";
}
function mi(e, t) {
  if (!J(e) || H(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return X(e) === n && (n = n.ownerDocument.body), n;
}
function os(e, t) {
  const n = M(e);
  if (kt(e))
    return n;
  if (!J(e)) {
    let r = se(e);
    for (; r && !Ie(r); ) {
      if (V(r) && !Bt(r))
        return r;
      r = se(r);
    }
    return n;
  }
  let i = mi(e, t);
  for (; i && Wl(i) && Bt(i); )
    i = mi(i, t);
  return i && Ie(i) && Bt(i) && !Ln(i) ? n : i || ql(e) || n;
}
const ic = async function(e) {
  const t = this.getOffsetParent || os, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: nc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function rc(e) {
  return H(e).direction === "rtl";
}
const sc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Kl,
  getDocumentElement: X,
  getClippingRect: ec,
  getOffsetParent: os,
  getElementRects: ic,
  getClientRects: Jl,
  getDimensions: tc,
  getScale: _e,
  isElement: V,
  isRTL: rc
}, bt = Vl, yt = Hl, wt = Bl, _t = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: sc,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Fl(e, t, {
    ...r,
    platform: s
  });
};
function oc(e) {
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
        middleware: [bt(this.pixelOffset), wt(), yt({ padding: 8 })]
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
        middleware: [bt(this.pixelOffset), wt(), yt({ padding: 8 })]
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
function ac(e) {
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
function lc(e) {
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
function cc(e) {
  e.data("rzEmpty", () => {
  });
}
function uc(e) {
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
function dc(e) {
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
function fc(e) {
  e.data("rzInputGroupAddon", () => ({
    handleClick(t) {
      if (t.target.closest("button"))
        return;
      const n = this.$el.parentElement;
      n && n.querySelector("input, textarea")?.focus();
    }
  }));
}
function hc(e, t) {
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
function pc(e, t) {
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
        middleware: [bt(6), wt(), yt({ padding: 8 })]
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
function mc(e) {
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
      c.push(bt({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(wt()), a && c.push(yt({ padding: l })), _t(this.triggerEl, this.contentEl, {
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
function gc(e) {
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
function vc(e) {
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
function bc(e) {
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
function yc(e) {
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
function wc(e) {
  e.data("rzTabs", () => ({
    selectedTab: "",
    _triggers: [],
    _observer: null,
    init() {
      const t = this.$el.dataset.defaultValue;
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), t && this._triggers.some((n) => n.dataset.value === t) ? this.selectedTab = t : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
    },
    destroy() {
      this._observer && this._observer.disconnect();
    },
    refreshTriggers() {
      this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
    },
    onTriggerClick(t) {
      const n = t.currentTarget?.dataset?.value;
      !n || t.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = n, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
    },
    isSelected(t) {
      return this.selectedTab === t;
    },
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
function _c(e) {
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
function xc(e) {
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
      let n = [];
      if (t) {
        const i = document.getElementById(t);
        if (i)
          try {
            n = JSON.parse(i.textContent || "[]");
          } catch (r) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, r);
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
    handleInteraction() {
      this.itemsUrl && this.fetchTrigger === "on-open" && !this._dataFetched && this.fetchItems();
    },
    registerItem(t) {
      this.items.some((n) => n.id === t.id) || (t._order = this.items.length, this.items.push(t), this.selectedIndex === -1 && (this.selectedIndex = 0), this.serverFiltering || this.filterAndSortItems());
    },
    unregisterItem(t) {
      this.items = this.items.filter((n) => n.id !== t), this.filterAndSortItems();
    },
    registerGroupTemplate(t, n) {
      this.groupTemplates.has(t) || this.groupTemplates.set(t, n);
    },
    filterAndSortItems() {
      if (this.serverFiltering && this._dataFetched) {
        this.filteredItems = this.items, this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
        return;
      }
      let t;
      if (!this.shouldFilter || !this.search ? t = this.items.map((n) => ({ ...n, score: 1 })) : t = this.items.map((n) => ({
        ...n,
        score: n.forceMount ? 0 : this.commandScore(n.name, this.search, n.keywords)
      })).filter((n) => n.score > 0 || n.forceMount).sort((n, i) => n.forceMount && !i.forceMount ? 1 : !n.forceMount && i.forceMount ? -1 : i.score !== n.score ? i.score - n.score : (n._order || 0) - (i._order || 0)), this.filteredItems = t, this.selectedValue) {
        const n = this.filteredItems.findIndex((i) => i.value === this.selectedValue);
        this.selectedIndex = n > -1 ? n : this.filteredItems.length > 0 ? 0 : -1;
      } else
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
    },
    // --- EVENT HANDLERS ---
    handleItemClick(t) {
      const n = t.target.closest("[data-command-item-id]");
      if (!n) return;
      const i = n.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === i);
      if (r > -1) {
        const s = this.filteredItems[r];
        s && !s.disabled && (this.selectedIndex = r, this.$dispatch("rz:command:execute", { value: s.value }));
      }
    },
    handleItemHover(t) {
      const n = t.target.closest("[data-command-item-id]");
      if (!n) return;
      const i = n.dataset.commandItemId, r = this.filteredItems.findIndex((s) => s.id === i);
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
          const n = this.filteredItems[this.selectedIndex];
          n && !n.disabled && this.$dispatch("rz:command:execute", { value: n.value });
          break;
      }
    },
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
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.findIndex((n) => !n.disabled);
        t > -1 && (this.selectedIndex = t);
      }
    },
    selectLast() {
      if (this.filteredItems.length > 0) {
        const t = this.filteredItems.map((n) => n.disabled).lastIndexOf(!1);
        t > -1 && (this.selectedIndex = t);
      }
    },
    // --- SCORING ALGORITHM (Adapted from cmdk) ---
    commandScore(t, n, i = []) {
      const d = /[\\/_+.#"@[\(\{&]/, f = /[\s-]/, v = `${t} ${i ? i.join(" ") : ""}`;
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
      return w(v, n, x(v), x(n), 0, 0, {});
    }
  }));
}
function Ec(e) {
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
function Ic(e) {
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
      const n = t.detail.items || [], i = t.detail.groups || /* @__PURE__ */ new Map(), r = this.$el;
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
function Sc(e) {
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
async function Cc(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function ce(e, t, n) {
  let i, r;
  typeof t == "function" ? i = { success: t } : t && typeof t == "object" ? i = t : typeof t == "string" && (r = t), !r && typeof n == "string" && (r = n);
  const s = Array.isArray(e) ? e : [e];
  return Cc(s).then((o) => (ne.isDefined(o) || ne(s, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: r,
    inlineStyleNonce: r
  }), new Promise((a, l) => {
    ne.ready(o, {
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
function Tc(e) {
  yl(e), wl(e), _l(e), xl(e), El(e), Il(e, ce), Sl(e, ce), Cl(e, ce), Tl(e), Al(e, ce), Ol(e, ce), $l(e), oc(e), ac(e), lc(e), cc(e), uc(e), dc(e), fc(e), hc(e, ce), pc(e), mc(e), gc(e), vc(e), bc(e), yc(e), wc(e), _c(e), xc(e), Ec(e), Ic(e), Sc(e);
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
const it = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map();
let gi = !1;
function Oc(e) {
  return rt.has(e) || rt.set(
    e,
    import(e).catch((t) => {
      throw rt.delete(e), t;
    })
  ), rt.get(e);
}
function vi(e, t) {
  const n = globalThis.Alpine;
  return n && typeof n.asyncData == "function" ? (n.asyncData(
    e,
    () => Oc(t).catch((i) => (console.error(
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
function $c(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const n = it.get(e);
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
      it.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  it.set(e, { path: t, loaderSet: !1 }), gi || (gi = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of it)
        if (!s.loaderSet) {
          const o = vi(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Nc(e) {
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
function kc(e) {
  const t = (n, { expression: i, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!i || typeof i != "string") return;
    const a = (w, p, g) => {
      const y = p.replace(/\[(\d+)\]/g, ".$1").split("."), E = y.pop();
      let _ = w;
      for (const m of y)
        (_[m] == null || typeof _[m] != "object") && (_[m] = isFinite(+m) ? [] : {}), _ = _[m];
      _[E] = g;
    }, l = e.closestDataStack(n) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = i.split(",").map((w) => w.trim()).filter(Boolean).map((w) => {
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
        const E = e.evaluate(n, w.childPath, { scope: c });
        g.fromChild = !0, a(u, w.parentPath, E), queueMicrotask(() => {
          g.fromChild = !1;
        });
      } else {
        const E = e.evaluate(n, w.parentPath, { scope: u });
        g.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        });
      }
      const h = o(() => {
        const E = e.evaluate(n, w.parentPath, { scope: u });
        g.fromChild || (g.fromParent = !0, a(c, w.childPath, E), queueMicrotask(() => {
          g.fromParent = !1;
        }));
      }), y = o(() => {
        const E = e.evaluate(n, w.childPath, { scope: c });
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
  e.directive("syncprop", t);
}
class Rc {
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
const D = new Rc();
function Lc(e) {
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
let ze = null;
function Dc(e) {
  return ze || (e.plugin(ya), e.plugin(Ia), e.plugin(qa), e.plugin(el), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Lc(e);
  }), Tc(e), Nc(e), kc(e), ze = {
    Alpine: e,
    require: ce,
    toast: hl,
    $data: vl,
    props: Ac,
    registerAsyncComponent: $c,
    theme: D
  }, typeof window < "u" && (D.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...ze }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), ze);
}
const zc = Dc(Or);
Or.start();
export {
  zc as default
};
