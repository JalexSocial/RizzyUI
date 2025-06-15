var ze = !1, Be = !1, ct = [], je = -1;
function Jr(t) {
  Xr(t);
}
function Xr(t) {
  ct.includes(t) || ct.push(t), ts();
}
function Qr(t) {
  let e = ct.indexOf(t);
  e !== -1 && e > je && ct.splice(e, 1);
}
function ts() {
  !Be && !ze && (ze = !0, queueMicrotask(es));
}
function es() {
  ze = !1, Be = !0;
  for (let t = 0; t < ct.length; t++)
    ct[t](), je = t;
  ct.length = 0, je = -1, Be = !1;
}
var It, vt, St, ci, We = !0;
function ns(t) {
  We = !1, t(), We = !0;
}
function is(t) {
  It = t.reactive, St = t.release, vt = (e) => t.effect(e, { scheduler: (n) => {
    We ? Jr(n) : n();
  } }), ci = t.raw;
}
function kn(t) {
  vt = t;
}
function rs(t) {
  let e = () => {
  };
  return [(i) => {
    let r = vt(i);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(r), e = () => {
      r !== void 0 && (t._x_effects.delete(r), St(r));
    }, r;
  }, () => {
    e();
  }];
}
function ui(t, e) {
  let n = !0, i, r = vt(() => {
    let s = t();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      e(s, i), i = s;
    }), n = !1;
  });
  return () => St(r);
}
var di = [], fi = [], hi = [];
function ss(t) {
  hi.push(t);
}
function cn(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, fi.push(e));
}
function pi(t) {
  di.push(t);
}
function gi(t, e, n) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n);
}
function mi(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([n, i]) => {
    (e === void 0 || e.includes(n)) && (i.forEach((r) => r()), delete t._x_attributeCleanups[n]);
  });
}
function os(t) {
  for (t._x_effects?.forEach(Qr); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var un = new MutationObserver(pn), dn = !1;
function fn() {
  un.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), dn = !0;
}
function bi() {
  as(), un.disconnect(), dn = !1;
}
var Nt = [];
function as() {
  let t = un.takeRecords();
  Nt.push(() => t.length > 0 && pn(t));
  let e = Nt.length;
  queueMicrotask(() => {
    if (Nt.length === e)
      for (; Nt.length > 0; )
        Nt.shift()();
  });
}
function O(t) {
  if (!dn)
    return t();
  bi();
  let e = t();
  return fn(), e;
}
var hn = !1, oe = [];
function ls() {
  hn = !0;
}
function cs() {
  hn = !1, pn(oe), oe = [];
}
function pn(t) {
  if (hn) {
    oe = oe.concat(t);
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
    mi(o, s);
  }), i.forEach((s, o) => {
    di.forEach((a) => a(o, s));
  });
  for (let s of n)
    e.some((o) => o.contains(s)) || fi.forEach((o) => o(s));
  for (let s of e)
    s.isConnected && hi.forEach((o) => o(s));
  e = null, n = null, i = null, r = null;
}
function vi(t) {
  return Tt(pt(t));
}
function qt(t, e, n) {
  return t._x_dataStack = [e, ...pt(n || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((i) => i !== e);
  };
}
function pt(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? pt(t.host) : t.parentNode ? pt(t.parentNode) : [];
}
function Tt(t) {
  return new Proxy({ objects: t }, us);
}
var us = {
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
    return e == "toJSON" ? ds : Reflect.get(
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
function ds() {
  return Reflect.ownKeys(this).reduce((e, n) => (e[n] = Reflect.get(this, n), e), {});
}
function yi(t) {
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
function wi(t, e = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return t(this.initialValue, () => fs(i, r), (o) => He(i, r, o), r, s);
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
function fs(t, e) {
  return e.split(".").reduce((n, i) => n[i], t);
}
function He(t, e, n) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = n;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), He(t[e[0]], e.slice(1), n);
  }
}
var xi = {};
function H(t, e) {
  xi[t] = e;
}
function ae(t, e) {
  let n = hs(e);
  return Object.entries(xi).forEach(([i, r]) => {
    Object.defineProperty(t, `$${i}`, {
      get() {
        return r(e, n);
      },
      enumerable: !1
    });
  }), t;
}
function hs(t) {
  let [e, n] = Ai(t), i = { interceptor: wi, ...e };
  return cn(t, n), i;
}
function _i(t, e, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    jt(r, t, e);
  }
}
function jt(t, e, n = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: n }
  ), console.warn(`Alpine Expression Error: ${t.message}

${n ? 'Expression: "' + n + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var ne = !0;
function Ei(t) {
  let e = ne;
  ne = !1;
  let n = t();
  return ne = e, n;
}
function ut(t, e, n = {}) {
  let i;
  return R(t, e)((r) => i = r, n), i;
}
function R(...t) {
  return Ii(...t);
}
var Ii = gs;
function ps(t) {
  Ii = t;
}
function gs(t, e) {
  let n = {};
  ae(n, t);
  let i = [n, ...pt(t)], r = typeof e == "function" ? Si(i, e) : bs(i, e, t);
  return _i.bind(null, t, e, r);
}
function Si(t, e) {
  return (n = () => {
  }, { scope: i = {}, params: r = [] } = {}) => {
    let s = e.apply(Tt([i, ...t]), r);
    Wt(n, s);
  };
}
var Re = {};
function ms(t, e) {
  if (Re[t])
    return Re[t];
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
      return jt(o, e, t), Promise.resolve();
    }
  })();
  return Re[t] = s, s;
}
function bs(t, e, n) {
  let i = ms(e, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [] } = {}) => {
    i.result = void 0, i.finished = !1;
    let a = Tt([s, ...t]);
    if (typeof i == "function") {
      let l = i(i, a).catch((c) => jt(c, n, e));
      i.finished ? (Wt(r, i.result, a, o, n), i.result = void 0) : l.then((c) => {
        Wt(r, c, a, o, n);
      }).catch((c) => jt(c, n, e)).finally(() => i.result = void 0);
    }
  };
}
function Wt(t, e, n, i, r) {
  if (ne && typeof e == "function") {
    let s = e.apply(n, i);
    s instanceof Promise ? s.then((o) => Wt(t, o, n, i)).catch((o) => jt(o, r, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
var gn = "x-";
function Ct(t = "") {
  return gn + t;
}
function vs(t) {
  gn = t;
}
var le = {};
function N(t, e) {
  return le[t] = e, {
    before(n) {
      if (!le[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const i = lt.indexOf(n);
      lt.splice(i >= 0 ? i : lt.indexOf("DEFAULT"), 0, t);
    }
  };
}
function ys(t) {
  return Object.keys(le).includes(t);
}
function mn(t, e, n) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Ti(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), e = e.concat(s);
  }
  let i = {};
  return e.map(Ni((s, o) => i[s] = o)).filter(ki).map(_s(i, n)).sort(Es).map((s) => xs(t, s));
}
function Ti(t) {
  return Array.from(t).map(Ni()).filter((e) => !ki(e));
}
var Ve = !1, Pt = /* @__PURE__ */ new Map(), Ci = Symbol();
function ws(t) {
  Ve = !0;
  let e = Symbol();
  Ci = e, Pt.set(e, []);
  let n = () => {
    for (; Pt.get(e).length; )
      Pt.get(e).shift()();
    Pt.delete(e);
  }, i = () => {
    Ve = !1, n();
  };
  t(n), i();
}
function Ai(t) {
  let e = [], n = (a) => e.push(a), [i, r] = rs(t);
  return e.push(r), [{
    Alpine: Kt,
    effect: i,
    cleanup: n,
    evaluateLater: R.bind(R, t),
    evaluate: ut.bind(ut, t)
  }, () => e.forEach((a) => a())];
}
function xs(t, e) {
  let n = () => {
  }, i = le[e.type] || n, [r, s] = Ai(t);
  gi(t, e.original, s);
  let o = () => {
    t._x_ignore || t._x_ignoreSelf || (i.inline && i.inline(t, e, r), i = i.bind(i, t, e, r), Ve ? Pt.get(Ci).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Oi = (t, e) => ({ name: n, value: i }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: i }), $i = (t) => t;
function Ni(t = () => {
}) {
  return ({ name: e, value: n }) => {
    let { name: i, value: r } = Ri.reduce((s, o) => o(s), { name: e, value: n });
    return i !== e && t(i, e), { name: i, value: r };
  };
}
var Ri = [];
function bn(t) {
  Ri.push(t);
}
function ki({ name: t }) {
  return Li().test(t);
}
var Li = () => new RegExp(`^${gn}([^:^.]+)\\b`);
function _s(t, e) {
  return ({ name: n, value: i }) => {
    let r = n.match(Li()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = e || t[n] || n;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: i,
      original: a
    };
  };
}
var Ye = "DEFAULT", lt = [
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
  Ye,
  "teleport"
];
function Es(t, e) {
  let n = lt.indexOf(t.type) === -1 ? Ye : t.type, i = lt.indexOf(e.type) === -1 ? Ye : e.type;
  return lt.indexOf(n) - lt.indexOf(i);
}
function zt(t, e, n = {}) {
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
function gt(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((r) => gt(r, e));
    return;
  }
  let n = !1;
  if (e(t, () => n = !0), n)
    return;
  let i = t.firstElementChild;
  for (; i; )
    gt(i, e), i = i.nextElementSibling;
}
function P(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var Ln = !1;
function Is() {
  Ln && P("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Ln = !0, document.body || P("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), zt(document, "alpine:init"), zt(document, "alpine:initializing"), fn(), ss((e) => G(e, gt)), cn((e) => Ot(e)), pi((e, n) => {
    mn(e, n).forEach((i) => i());
  });
  let t = (e) => !we(e.parentElement, !0);
  Array.from(document.querySelectorAll(Mi().join(","))).filter(t).forEach((e) => {
    G(e);
  }), zt(document, "alpine:initialized"), setTimeout(() => {
    As();
  });
}
var vn = [], Fi = [];
function Di() {
  return vn.map((t) => t());
}
function Mi() {
  return vn.concat(Fi).map((t) => t());
}
function Pi(t) {
  vn.push(t);
}
function zi(t) {
  Fi.push(t);
}
function we(t, e = !1) {
  return At(t, (n) => {
    if ((e ? Mi() : Di()).some((r) => n.matches(r)))
      return !0;
  });
}
function At(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack && (t = t._x_teleportBack), !!t.parentElement)
      return At(t.parentElement, e);
  }
}
function Ss(t) {
  return Di().some((e) => t.matches(e));
}
var Bi = [];
function Ts(t) {
  Bi.push(t);
}
var Cs = 1;
function G(t, e = gt, n = () => {
}) {
  At(t, (i) => i._x_ignore) || ws(() => {
    e(t, (i, r) => {
      i._x_marker || (n(i, r), Bi.forEach((s) => s(i, r)), mn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = Cs++), i._x_ignore && r());
    });
  });
}
function Ot(t, e = gt) {
  e(t, (n) => {
    os(n), mi(n), delete n._x_marker;
  });
}
function As() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, n, i]) => {
    ys(n) || i.some((r) => {
      if (document.querySelector(r))
        return P(`found "${r}", but missing ${e} plugin`), !0;
    });
  });
}
var qe = [], yn = !1;
function wn(t = () => {
}) {
  return queueMicrotask(() => {
    yn || setTimeout(() => {
      Ke();
    });
  }), new Promise((e) => {
    qe.push(() => {
      t(), e();
    });
  });
}
function Ke() {
  for (yn = !1; qe.length; )
    qe.shift()();
}
function Os() {
  yn = !0;
}
function xn(t, e) {
  return Array.isArray(e) ? Fn(t, e.join(" ")) : typeof e == "object" && e !== null ? $s(t, e) : typeof e == "function" ? xn(t, e()) : Fn(t, e);
}
function Fn(t, e) {
  let n = (r) => r.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), i = (r) => (t.classList.add(...r), () => {
    t.classList.remove(...r);
  });
  return e = e === !0 ? e = "" : e || "", i(n(e));
}
function $s(t, e) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(e).flatMap(([a, l]) => l ? n(a) : !1).filter(Boolean), r = Object.entries(e).flatMap(([a, l]) => l ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    t.classList.contains(a) && (t.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    t.classList.contains(a) || (t.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => t.classList.add(a)), s.forEach((a) => t.classList.remove(a));
  };
}
function xe(t, e) {
  return typeof e == "object" && e !== null ? Ns(t, e) : Rs(t, e);
}
function Ns(t, e) {
  let n = {};
  return Object.entries(e).forEach(([i, r]) => {
    n[i] = t.style[i], i.startsWith("--") || (i = ks(i)), t.style.setProperty(i, r);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    xe(t, n);
  };
}
function Rs(t, e) {
  let n = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", n || "");
  };
}
function ks(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ue(t, e = () => {
}) {
  let n = !1;
  return function() {
    n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments));
  };
}
N("transition", (t, { value: e, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Fs(t, n, e) : Ls(t, i, e));
});
function Ls(t, e, n) {
  ji(t, xn, ""), {
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
function Fs(t, e, n) {
  ji(t, xe);
  let i = !e.includes("in") && !e.includes("out") && !n, r = i || e.includes("in") || ["enter"].includes(n), s = i || e.includes("out") || ["leave"].includes(n);
  e.includes("in") && !i && (e = e.filter((b, w) => w < e.indexOf("out"))), e.includes("out") && !i && (e = e.filter((b, w) => w > e.indexOf("out")));
  let o = !e.includes("opacity") && !e.includes("scale"), a = o || e.includes("opacity"), l = o || e.includes("scale"), c = a ? 0 : 1, u = l ? Rt(e, "scale", 95) / 100 : 1, d = Rt(e, "delay", 0) / 1e3, f = Rt(e, "origin", "center"), m = "opacity, transform", v = Rt(e, "duration", 150) / 1e3, E = Rt(e, "duration", 75) / 1e3, h = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (t._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${d}s`,
    transitionProperty: m,
    transitionDuration: `${v}s`,
    transitionTimingFunction: h
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
    transitionDuration: `${E}s`,
    transitionTimingFunction: h
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function ji(t, e, n = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      Ge(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      Ge(t, e, {
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
    let o = Wi(t);
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
function Wi(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Wi(e);
}
function Ge(t, e, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, c;
  Ds(t, {
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
function Ds(t, e) {
  let n, i, r, s = Ue(() => {
    O(() => {
      n = !0, i || e.before(), r || (e.end(), Ke()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Ue(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, O(() => {
    e.start(), e.during();
  }), Os(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), O(() => {
      e.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (O(() => {
        e.end();
      }), Ke(), setTimeout(t._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Rt(t, e, n) {
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
var nt = !1;
function st(t, e = () => {
}) {
  return (...n) => nt ? e(...n) : t(...n);
}
function Ms(t) {
  return (...e) => nt && t(...e);
}
var Hi = [];
function _e(t) {
  Hi.push(t);
}
function Ps(t, e) {
  Hi.forEach((n) => n(t, e)), nt = !0, Vi(() => {
    G(e, (n, i) => {
      i(n, () => {
      });
    });
  }), nt = !1;
}
var Ze = !1;
function zs(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), nt = !0, Ze = !0, Vi(() => {
    Bs(e);
  }), nt = !1, Ze = !1;
}
function Bs(t) {
  let e = !1;
  G(t, (i, r) => {
    gt(i, (s, o) => {
      if (e && Ss(s))
        return o();
      e = !0, r(s, o);
    });
  });
}
function Vi(t) {
  let e = vt;
  kn((n, i) => {
    let r = e(n);
    return St(r), () => {
    };
  }), t(), kn(e);
}
function Yi(t, e, n, i = []) {
  switch (t._x_bindings || (t._x_bindings = It({})), t._x_bindings[e] = n, e = i.includes("camel") ? Us(e) : e, e) {
    case "value":
      js(t, n);
      break;
    case "style":
      Hs(t, n);
      break;
    case "class":
      Ws(t, n);
      break;
    case "selected":
    case "checked":
      Vs(t, e, n);
      break;
    default:
      qi(t, e, n);
      break;
  }
}
function js(t, e) {
  if (Gi(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = ie(t.value) === e : t.checked = Dn(t.value, e));
  else if (_n(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((n) => Dn(n, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    Ks(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function Ws(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = xn(t, e);
}
function Hs(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = xe(t, e);
}
function Vs(t, e, n) {
  qi(t, e, n), qs(t, e, n);
}
function qi(t, e, n) {
  [null, void 0, !1].includes(n) && Zs(e) ? t.removeAttribute(e) : (Ki(e) && (n = e), Ys(t, e, n));
}
function Ys(t, e, n) {
  t.getAttribute(e) != n && t.setAttribute(e, n);
}
function qs(t, e, n) {
  t[e] !== n && (t[e] = n);
}
function Ks(t, e) {
  const n = [].concat(e).map((i) => i + "");
  Array.from(t.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Us(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function Dn(t, e) {
  return t == e;
}
function ie(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var Gs = /* @__PURE__ */ new Set([
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
function Ki(t) {
  return Gs.has(t);
}
function Zs(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function Js(t, e, n) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Ui(t, e, n);
}
function Xs(t, e, n, i = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let r = t._x_inlineBindings[e];
    return r.extract = i, Ei(() => ut(t, r.expression));
  }
  return Ui(t, e, n);
}
function Ui(t, e, n) {
  let i = t.getAttribute(e);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Ki(e) ? !![e, "true"].includes(i) : i;
}
function _n(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function Gi(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function Zi(t, e) {
  var n;
  return function() {
    var i = this, r = arguments, s = function() {
      n = null, t.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, e);
  };
}
function Ji(t, e) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (t.apply(i, r), n = !0, setTimeout(() => n = !1, e));
  };
}
function Xi({ get: t, set: e }, { get: n, set: i }) {
  let r = !0, s, o = vt(() => {
    let a = t(), l = n();
    if (r)
      i(ke(a)), r = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== s ? i(ke(a)) : c !== u && e(ke(l));
    }
    s = JSON.stringify(t()), JSON.stringify(n());
  });
  return () => {
    St(o);
  };
}
function ke(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function Qs(t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => n(Kt));
}
var at = {}, Mn = !1;
function to(t, e) {
  if (Mn || (at = It(at), Mn = !0), e === void 0)
    return at[t];
  at[t] = e, yi(at[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && at[t].init();
}
function eo() {
  return at;
}
var Qi = {};
function no(t, e) {
  let n = typeof e != "function" ? () => e : e;
  return t instanceof Element ? tr(t, n()) : (Qi[t] = n, () => {
  });
}
function io(t) {
  return Object.entries(Qi).forEach(([e, n]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), t;
}
function tr(t, e, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(e).map(([o, a]) => ({ name: o, value: a })), s = Ti(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), mn(t, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var er = {};
function ro(t, e) {
  er[t] = e;
}
function so(t, e) {
  return Object.entries(er).forEach(([n, i]) => {
    Object.defineProperty(t, n, {
      get() {
        return (...r) => i.bind(e)(...r);
      },
      enumerable: !1
    });
  }), t;
}
var oo = {
  get reactive() {
    return It;
  },
  get release() {
    return St;
  },
  get effect() {
    return vt;
  },
  get raw() {
    return ci;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: cs,
  dontAutoEvaluateFunctions: Ei,
  disableEffectScheduling: ns,
  startObservingMutations: fn,
  stopObservingMutations: bi,
  setReactivityEngine: is,
  onAttributeRemoved: gi,
  onAttributesAdded: pi,
  closestDataStack: pt,
  skipDuringClone: st,
  onlyDuringClone: Ms,
  addRootSelector: Pi,
  addInitSelector: zi,
  interceptClone: _e,
  addScopeToNode: qt,
  deferMutations: ls,
  mapAttributes: bn,
  evaluateLater: R,
  interceptInit: Ts,
  setEvaluator: ps,
  mergeProxies: Tt,
  extractProp: Xs,
  findClosest: At,
  onElRemoved: cn,
  closestRoot: we,
  destroyTree: Ot,
  interceptor: wi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Ge,
  // INTERNAL
  setStyles: xe,
  // INTERNAL
  mutateDom: O,
  directive: N,
  entangle: Xi,
  throttle: Ji,
  debounce: Zi,
  evaluate: ut,
  initTree: G,
  nextTick: wn,
  prefixed: Ct,
  prefix: vs,
  plugin: Qs,
  magic: H,
  store: to,
  start: Is,
  clone: zs,
  // INTERNAL
  cloneNode: Ps,
  // INTERNAL
  bound: Js,
  $data: vi,
  watch: ui,
  walk: gt,
  data: ro,
  bind: no
}, Kt = oo;
function ao(t, e) {
  let n = lo(t);
  if (typeof e == "function")
    return Si(n, e);
  let i = co(t, e, n);
  return _i.bind(null, t, e, i);
}
function lo(t) {
  let e = {};
  return ae(e, t), [e, ...pt(t)];
}
function co(t, e, n) {
  return (i = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Tt([r, ...n]), a = e.split(".").reduce(
      (l, c) => (l[c] === void 0 && uo(t, e), l[c]),
      o
    );
    Wt(i, a, o, s);
  };
}
function uo(t, e) {
  console.warn(
    `Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${e}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
    t
  );
}
function fo(t, e) {
  const n = /* @__PURE__ */ Object.create(null), i = t.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var ho = Object.freeze({}), po = Object.prototype.hasOwnProperty, Ee = (t, e) => po.call(t, e), dt = Array.isArray, Bt = (t) => nr(t) === "[object Map]", go = (t) => typeof t == "string", En = (t) => typeof t == "symbol", Ie = (t) => t !== null && typeof t == "object", mo = Object.prototype.toString, nr = (t) => mo.call(t), ir = (t) => nr(t).slice(8, -1), In = (t) => go(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, bo = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, vo = bo((t) => t.charAt(0).toUpperCase() + t.slice(1)), rr = (t, e) => t !== e && (t === t || e === e), Je = /* @__PURE__ */ new WeakMap(), kt = [], q, ft = Symbol("iterate"), Xe = Symbol("Map key iterate");
function yo(t) {
  return t && t._isEffect === !0;
}
function wo(t, e = ho) {
  yo(t) && (t = t.raw);
  const n = Eo(t, e);
  return e.lazy || n(), n;
}
function xo(t) {
  t.active && (sr(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var _o = 0;
function Eo(t, e) {
  const n = function() {
    if (!n.active)
      return t();
    if (!kt.includes(n)) {
      sr(n);
      try {
        return So(), kt.push(n), q = n, t();
      } finally {
        kt.pop(), or(), q = kt[kt.length - 1];
      }
    }
  };
  return n.id = _o++, n.allowRecurse = !!e.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = t, n.deps = [], n.options = e, n;
}
function sr(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let n = 0; n < e.length; n++)
      e[n].delete(t);
    e.length = 0;
  }
}
var _t = !0, Sn = [];
function Io() {
  Sn.push(_t), _t = !1;
}
function So() {
  Sn.push(_t), _t = !0;
}
function or() {
  const t = Sn.pop();
  _t = t === void 0 ? !0 : t;
}
function B(t, e, n) {
  if (!_t || q === void 0)
    return;
  let i = Je.get(t);
  i || Je.set(t, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(q) || (r.add(q), q.deps.push(r), q.options.onTrack && q.options.onTrack({
    effect: q,
    target: t,
    type: e,
    key: n
  }));
}
function it(t, e, n, i, r, s) {
  const o = Je.get(t);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== q || d.allowRecurse) && a.add(d);
    });
  };
  if (e === "clear")
    o.forEach(l);
  else if (n === "length" && dt(t))
    o.forEach((u, d) => {
      (d === "length" || d >= i) && l(u);
    });
  else
    switch (n !== void 0 && l(o.get(n)), e) {
      case "add":
        dt(t) ? In(n) && l(o.get("length")) : (l(o.get(ft)), Bt(t) && l(o.get(Xe)));
        break;
      case "delete":
        dt(t) || (l(o.get(ft)), Bt(t) && l(o.get(Xe)));
        break;
      case "set":
        Bt(t) && l(o.get(ft));
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
var To = /* @__PURE__ */ fo("__proto__,__v_isRef,__isVue"), ar = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter(En)), Co = /* @__PURE__ */ lr(), Ao = /* @__PURE__ */ lr(!0), Pn = /* @__PURE__ */ Oo();
function Oo() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const i = A(this);
      for (let s = 0, o = this.length; s < o; s++)
        B(i, "get", s + "");
      const r = i[e](...n);
      return r === -1 || r === !1 ? i[e](...n.map(A)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Io();
      const i = A(this)[e].apply(this, n);
      return or(), i;
    };
  }), t;
}
function lr(t = !1, e = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !t;
    if (r === "__v_isReadonly")
      return t;
    if (r === "__v_raw" && s === (t ? e ? Ho : fr : e ? Wo : dr).get(i))
      return i;
    const o = dt(i);
    if (!t && o && Ee(Pn, r))
      return Reflect.get(Pn, r, s);
    const a = Reflect.get(i, r, s);
    return (En(r) ? ar.has(r) : To(r)) || (t || B(i, "get", r), e) ? a : Qe(a) ? !o || !In(r) ? a.value : a : Ie(a) ? t ? hr(a) : On(a) : a;
  };
}
var $o = /* @__PURE__ */ No();
function No(t = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!t && (r = A(r), o = A(o), !dt(n) && Qe(o) && !Qe(r)))
      return o.value = r, !0;
    const a = dt(n) && In(i) ? Number(i) < n.length : Ee(n, i), l = Reflect.set(n, i, r, s);
    return n === A(s) && (a ? rr(r, o) && it(n, "set", i, r, o) : it(n, "add", i, r)), l;
  };
}
function Ro(t, e) {
  const n = Ee(t, e), i = t[e], r = Reflect.deleteProperty(t, e);
  return r && n && it(t, "delete", e, void 0, i), r;
}
function ko(t, e) {
  const n = Reflect.has(t, e);
  return (!En(e) || !ar.has(e)) && B(t, "has", e), n;
}
function Lo(t) {
  return B(t, "iterate", dt(t) ? "length" : ft), Reflect.ownKeys(t);
}
var Fo = {
  get: Co,
  set: $o,
  deleteProperty: Ro,
  has: ko,
  ownKeys: Lo
}, Do = {
  get: Ao,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, Tn = (t) => Ie(t) ? On(t) : t, Cn = (t) => Ie(t) ? hr(t) : t, An = (t) => t, Se = (t) => Reflect.getPrototypeOf(t);
function Gt(t, e, n = !1, i = !1) {
  t = t.__v_raw;
  const r = A(t), s = A(e);
  e !== s && !n && B(r, "get", e), !n && B(r, "get", s);
  const { has: o } = Se(r), a = i ? An : n ? Cn : Tn;
  if (o.call(r, e))
    return a(t.get(e));
  if (o.call(r, s))
    return a(t.get(s));
  t !== r && t.get(e);
}
function Zt(t, e = !1) {
  const n = this.__v_raw, i = A(n), r = A(t);
  return t !== r && !e && B(i, "has", t), !e && B(i, "has", r), t === r ? n.has(t) : n.has(t) || n.has(r);
}
function Jt(t, e = !1) {
  return t = t.__v_raw, !e && B(A(t), "iterate", ft), Reflect.get(t, "size", t);
}
function zn(t) {
  t = A(t);
  const e = A(this);
  return Se(e).has.call(e, t) || (e.add(t), it(e, "add", t, t)), this;
}
function Bn(t, e) {
  e = A(e);
  const n = A(this), { has: i, get: r } = Se(n);
  let s = i.call(n, t);
  s ? ur(n, i, t) : (t = A(t), s = i.call(n, t));
  const o = r.call(n, t);
  return n.set(t, e), s ? rr(e, o) && it(n, "set", t, e, o) : it(n, "add", t, e), this;
}
function jn(t) {
  const e = A(this), { has: n, get: i } = Se(e);
  let r = n.call(e, t);
  r ? ur(e, n, t) : (t = A(t), r = n.call(e, t));
  const s = i ? i.call(e, t) : void 0, o = e.delete(t);
  return r && it(e, "delete", t, void 0, s), o;
}
function Wn() {
  const t = A(this), e = t.size !== 0, n = Bt(t) ? new Map(t) : new Set(t), i = t.clear();
  return e && it(t, "clear", void 0, void 0, n), i;
}
function Xt(t, e) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = A(o), l = e ? An : t ? Cn : Tn;
    return !t && B(a, "iterate", ft), o.forEach((c, u) => i.call(r, l(c), l(u), s));
  };
}
function Qt(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = A(r), o = Bt(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? An : e ? Cn : Tn;
    return !e && B(s, "iterate", l ? Xe : ft), {
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
function Q(t) {
  return function(...e) {
    {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${vo(t)} operation ${n}failed: target is readonly.`, A(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function Mo() {
  const t = {
    get(s) {
      return Gt(this, s);
    },
    get size() {
      return Jt(this);
    },
    has: Zt,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Xt(!1, !1)
  }, e = {
    get(s) {
      return Gt(this, s, !1, !0);
    },
    get size() {
      return Jt(this);
    },
    has: Zt,
    add: zn,
    set: Bn,
    delete: jn,
    clear: Wn,
    forEach: Xt(!1, !0)
  }, n = {
    get(s) {
      return Gt(this, s, !0);
    },
    get size() {
      return Jt(this, !0);
    },
    has(s) {
      return Zt.call(this, s, !0);
    },
    add: Q(
      "add"
      /* ADD */
    ),
    set: Q(
      "set"
      /* SET */
    ),
    delete: Q(
      "delete"
      /* DELETE */
    ),
    clear: Q(
      "clear"
      /* CLEAR */
    ),
    forEach: Xt(!0, !1)
  }, i = {
    get(s) {
      return Gt(this, s, !0, !0);
    },
    get size() {
      return Jt(this, !0);
    },
    has(s) {
      return Zt.call(this, s, !0);
    },
    add: Q(
      "add"
      /* ADD */
    ),
    set: Q(
      "set"
      /* SET */
    ),
    delete: Q(
      "delete"
      /* DELETE */
    ),
    clear: Q(
      "clear"
      /* CLEAR */
    ),
    forEach: Xt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = Qt(s, !1, !1), n[s] = Qt(s, !0, !1), e[s] = Qt(s, !1, !0), i[s] = Qt(s, !0, !0);
  }), [
    t,
    n,
    e,
    i
  ];
}
var [Po, zo, ec, nc] = /* @__PURE__ */ Mo();
function cr(t, e) {
  const n = t ? zo : Po;
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(Ee(n, r) && r in i ? n : i, r, s);
}
var Bo = {
  get: /* @__PURE__ */ cr(!1)
}, jo = {
  get: /* @__PURE__ */ cr(!0)
};
function ur(t, e, n) {
  const i = A(n);
  if (i !== n && e.call(t, i)) {
    const r = ir(t);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var dr = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap(), fr = /* @__PURE__ */ new WeakMap(), Ho = /* @__PURE__ */ new WeakMap();
function Vo(t) {
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
function Yo(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Vo(ir(t));
}
function On(t) {
  return t && t.__v_isReadonly ? t : pr(t, !1, Fo, Bo, dr);
}
function hr(t) {
  return pr(t, !0, Do, jo, fr);
}
function pr(t, e, n, i, r) {
  if (!Ie(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = r.get(t);
  if (s)
    return s;
  const o = Yo(t);
  if (o === 0)
    return t;
  const a = new Proxy(t, o === 2 ? i : n);
  return r.set(t, a), a;
}
function A(t) {
  return t && A(t.__v_raw) || t;
}
function Qe(t) {
  return !!(t && t.__v_isRef === !0);
}
H("nextTick", () => wn);
H("dispatch", (t) => zt.bind(zt, t));
H("watch", (t, { evaluateLater: e, cleanup: n }) => (i, r) => {
  let s = e(i), a = ui(() => {
    let l;
    return s((c) => l = c), l;
  }, r);
  n(a);
});
H("store", eo);
H("data", (t) => vi(t));
H("root", (t) => we(t));
H("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = Tt(qo(t))), t._x_refs_proxy));
function qo(t) {
  let e = [];
  return At(t, (n) => {
    n._x_refs && e.push(n._x_refs);
  }), e;
}
var Le = {};
function gr(t) {
  return Le[t] || (Le[t] = 0), ++Le[t];
}
function Ko(t, e) {
  return At(t, (n) => {
    if (n._x_ids && n._x_ids[e])
      return !0;
  });
}
function Uo(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = gr(e));
}
H("id", (t, { cleanup: e }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return Go(t, r, e, () => {
    let s = Ko(t, n), o = s ? s._x_ids[n] : gr(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
_e((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function Go(t, e, n, i) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let r = i();
  return t._x_id[e] = r, n(() => {
    delete t._x_id[e];
  }), r;
}
H("el", (t) => t);
mr("Focus", "focus", "focus");
mr("Persist", "persist", "persist");
function mr(t, e, n) {
  H(e, (i) => P(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
N("modelable", (t, { expression: e }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(e), o = () => {
    let u;
    return s((d) => u = d), u;
  }, a = i(`${e} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let u = t._x_model.get, d = t._x_model.set, f = Xi(
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
N("teleport", (t, { modifiers: e, expression: n }, { cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && P("x-teleport can only be used on a <template> tag", t);
  let r = Hn(n), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), qt(s, {}, t);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  O(() => {
    o(s, r, e), st(() => {
      G(s);
    })();
  }), t._x_teleportPutBack = () => {
    let a = Hn(n);
    O(() => {
      o(t._x_teleport, a, e);
    });
  }, i(
    () => O(() => {
      s.remove(), Ot(s);
    })
  );
});
var Zo = document.createElement("div");
function Hn(t) {
  let e = st(() => document.querySelector(t), () => Zo)();
  return e || P(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var br = () => {
};
br.inline = (t, { modifiers: e }, { cleanup: n }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
N("ignore", br);
N("effect", st((t, { expression: e }, { effect: n }) => {
  n(R(t, e));
}));
function tn(t, e, n, i) {
  let r = t, s = (l) => i(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (n.includes("dot") && (e = Jo(e)), n.includes("camel") && (e = Xo(e)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let l = n[n.indexOf("debounce") + 1] || "invalid-wait", c = ce(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Zi(s, c);
  }
  if (n.includes("throttle")) {
    let l = n[n.indexOf("throttle") + 1] || "invalid-wait", c = ce(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Ji(s, c);
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
  })), (ta(e) || vr(e)) && (s = a(s, (l, c) => {
    ea(c, n) || l(c);
  })), r.addEventListener(e, s, o), () => {
    r.removeEventListener(e, s, o);
  };
}
function Jo(t) {
  return t.replace(/-/g, ".");
}
function Xo(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
}
function ce(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Qo(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function ta(t) {
  return ["keydown", "keyup"].includes(t);
}
function vr(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function ea(t, e) {
  let n = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, ce((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, ce((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Vn(t.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), t[`${o}Key`])).length === r.length && (vr(t.type) || Vn(t.key).includes(n[0])));
}
function Vn(t) {
  if (!t)
    return [];
  t = Qo(t);
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
N("model", (t, { modifiers: e, expression: n }, { effect: i, cleanup: r }) => {
  let s = t;
  e.includes("parent") && (s = t.parentNode);
  let o = R(s, n), a;
  typeof n == "string" ? a = R(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = R(s, `${n()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let f;
    return o((m) => f = m), Yn(f) ? f.get() : f;
  }, c = (f) => {
    let m;
    o((v) => m = v), Yn(m) ? m.set(f) : a(() => {
    }, {
      scope: { __placeholder: f }
    });
  };
  typeof n == "string" && t.type === "radio" && O(() => {
    t.hasAttribute("name") || t.setAttribute("name", n);
  });
  var u = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input";
  let d = nt ? () => {
  } : tn(t, u, e, (f) => {
    c(Fe(t, e, f, l()));
  });
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || _n(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && c(
    Fe(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = d, r(() => t._x_removeModelListeners.default()), t.form) {
    let f = tn(t.form, "reset", [], (m) => {
      wn(() => t._x_model && t._x_model.set(Fe(t, e, { target: t }, l())));
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
    f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""), window.fromModel = !0, O(() => Yi(t, "value", f)), delete window.fromModel;
  }, i(() => {
    let f = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(f);
  });
});
function Fe(t, e, n, i) {
  return O(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (_n(t))
      if (Array.isArray(i)) {
        let r = null;
        return e.includes("number") ? r = De(n.target.value) : e.includes("boolean") ? r = ie(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !na(s, r));
      } else
        return n.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return De(s);
        }) : e.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return ie(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return Gi(t) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, e.includes("number") ? De(r) : e.includes("boolean") ? ie(r) : e.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function De(t) {
  let e = t ? parseFloat(t) : null;
  return ia(e) ? e : t;
}
function na(t, e) {
  return t == e;
}
function ia(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Yn(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
N("cloak", (t) => queueMicrotask(() => O(() => t.removeAttribute(Ct("cloak")))));
zi(() => `[${Ct("init")}]`);
N("init", st((t, { expression: e }, { evaluate: n }) => typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)));
N("text", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let r = i(e);
  n(() => {
    r((s) => {
      O(() => {
        t.textContent = s;
      });
    });
  });
});
N("html", (t, { expression: e }, { effect: n, evaluateLater: i }) => {
  let r = i(e);
  n(() => {
    r((s) => {
      O(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, G(t), delete t._x_ignoreSelf;
      });
    });
  });
});
bn(Oi(":", $i(Ct("bind:"))));
var yr = (t, { value: e, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!e) {
    let l = {};
    io(l), R(t, i)((u) => {
      tr(t, u, r);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return ra(t, i);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let a = R(t, i);
  s(() => a((l) => {
    l === void 0 && typeof i == "string" && i.match(/\./) && (l = ""), O(() => Yi(t, e, l, n));
  })), o(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
yr.inline = (t, { value: e, modifiers: n, expression: i }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: i, extract: !1 });
};
N("bind", yr);
function ra(t, e) {
  t._x_keyExpression = e;
}
Pi(() => `[${Ct("data")}]`);
N("data", (t, { expression: e }, { cleanup: n }) => {
  if (sa(t))
    return;
  e = e === "" ? "{}" : e;
  let i = {};
  ae(i, t);
  let r = {};
  so(r, i);
  let s = ut(t, e, { scope: r });
  (s === void 0 || s === !0) && (s = {}), ae(s, t);
  let o = It(s);
  yi(o);
  let a = qt(t, o);
  o.init && ut(t, o.init), n(() => {
    o.destroy && ut(t, o.destroy), a();
  });
});
_e((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function sa(t) {
  return nt ? Ze ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
N("show", (t, { modifiers: e, expression: n }, { effect: i }) => {
  let r = R(t, n);
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
  }, a = () => setTimeout(o), l = Ue(
    (d) => d ? o() : s(),
    (d) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, d, o, s) : d ? a() : s();
    }
  ), c, u = !0;
  i(() => r((d) => {
    !u && d === c || (e.includes("immediate") && (d ? a() : s()), l(d), c = d, u = !1);
  }));
});
N("for", (t, { expression: e }, { effect: n, cleanup: i }) => {
  let r = aa(e), s = R(t, r.items), o = R(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, n(() => oa(t, r, s, o)), i(() => {
    Object.values(t._x_lookup).forEach((a) => O(
      () => {
        Ot(a), a.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function oa(t, e, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = t;
  n((o) => {
    la(o) && o >= 0 && (o = Array.from(Array(o).keys(), (h) => h + 1)), o === void 0 && (o = []);
    let a = t._x_lookup, l = t._x_prevKeys, c = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([h, b]) => {
        let w = qn(e, b, h, o);
        i((_) => {
          u.includes(_) && P("Duplicate key on x-for", t), u.push(_);
        }, { scope: { index: h, ...w } }), c.push(w);
      });
    else
      for (let h = 0; h < o.length; h++) {
        let b = qn(e, o[h], h, o);
        i((w) => {
          u.includes(w) && P("Duplicate key on x-for", t), u.push(w);
        }, { scope: { index: h, ...b } }), c.push(b);
      }
    let d = [], f = [], m = [], v = [];
    for (let h = 0; h < l.length; h++) {
      let b = l[h];
      u.indexOf(b) === -1 && m.push(b);
    }
    l = l.filter((h) => !m.includes(h));
    let E = "template";
    for (let h = 0; h < u.length; h++) {
      let b = u[h], w = l.indexOf(b);
      if (w === -1)
        l.splice(h, 0, b), d.push([E, h]);
      else if (w !== h) {
        let _ = l.splice(h, 1)[0], S = l.splice(w - 1, 1)[0];
        l.splice(h, 0, S), l.splice(w, 0, _), f.push([_, S]);
      } else
        v.push(b);
      E = b;
    }
    for (let h = 0; h < m.length; h++) {
      let b = m[h];
      b in a && (O(() => {
        Ot(a[b]), a[b].remove();
      }), delete a[b]);
    }
    for (let h = 0; h < f.length; h++) {
      let [b, w] = f[h], _ = a[b], S = a[w], y = document.createElement("div");
      O(() => {
        S || P('x-for ":key" is undefined or invalid', s, w, a), S.after(y), _.after(S), S._x_currentIfEl && S.after(S._x_currentIfEl), y.before(_), _._x_currentIfEl && _.after(_._x_currentIfEl), y.remove();
      }), S._x_refreshXForScope(c[u.indexOf(w)]);
    }
    for (let h = 0; h < d.length; h++) {
      let [b, w] = d[h], _ = b === "template" ? s : a[b];
      _._x_currentIfEl && (_ = _._x_currentIfEl);
      let S = c[w], y = u[w], p = document.importNode(s.content, !0).firstElementChild, g = It(S);
      qt(p, g, s), p._x_refreshXForScope = (x) => {
        Object.entries(x).forEach(([T, I]) => {
          g[T] = I;
        });
      }, O(() => {
        _.after(p), st(() => G(p))();
      }), typeof y == "object" && P("x-for key cannot be an object, it must be a string or an integer", s), a[y] = p;
    }
    for (let h = 0; h < v.length; h++)
      a[v[h]]._x_refreshXForScope(c[u.indexOf(v[h])]);
    s._x_prevKeys = u;
  });
}
function aa(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = t.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(e);
  return a ? (s.item = o.replace(e, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function qn(t, e, n, i) {
  let r = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = e[a];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = e[o];
  }) : r[t.item] = e, t.index && (r[t.index] = n), t.collection && (r[t.collection] = i), r;
}
function la(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function wr() {
}
wr.inline = (t, { expression: e }, { cleanup: n }) => {
  let i = we(t);
  i._x_refs || (i._x_refs = {}), i._x_refs[e] = t, n(() => delete i._x_refs[e]);
};
N("ref", wr);
N("if", (t, { expression: e }, { effect: n, cleanup: i }) => {
  t.tagName.toLowerCase() !== "template" && P("x-if can only be used on a <template> tag", t);
  let r = R(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let a = t.content.cloneNode(!0).firstElementChild;
    return qt(a, {}, t), O(() => {
      t.after(a), st(() => G(a))();
    }), t._x_currentIfEl = a, t._x_undoIf = () => {
      O(() => {
        Ot(a), a.remove();
      }), delete t._x_currentIfEl;
    }, a;
  }, o = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => t._x_undoIf && t._x_undoIf());
});
N("id", (t, { expression: e }, { evaluate: n }) => {
  n(e).forEach((r) => Uo(t, r));
});
_e((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
bn(Oi("@", $i(Ct("on:"))));
N("on", st((t, { value: e, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? R(t, i) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let o = tn(t, e, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Te("Collapse", "collapse", "collapse");
Te("Intersect", "intersect", "intersect");
Te("Focus", "trap", "focus");
Te("Mask", "mask", "mask");
function Te(t, e, n) {
  N(e, (i) => P(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
Kt.setEvaluator(ao);
Kt.setReactivityEngine({ reactive: On, effect: wo, release: xo, raw: A });
var ca = Kt, yt = ca;
function ua(t) {
  t.directive("collapse", e), e.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function e(n, { modifiers: i }) {
    let r = Kn(i, "duration", 250) / 1e3, s = Kn(i, "min", 0), o = !i.includes("min");
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
function Kn(t, e, n) {
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
var da = ua;
function fa(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), l = {
      rootMargin: ga(r),
      threshold: ha(r)
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
function ha(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function pa(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function ga(t) {
  const e = "margin", n = "0px 0px 0px 0px", i = t.indexOf(e);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(pa(t[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var ma = fa, xr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ue = /* @__PURE__ */ xr.join(","), _r = typeof Element > "u", mt = _r ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, en = !_r && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, Er = function(e, n, i) {
  var r = Array.prototype.slice.apply(e.querySelectorAll(ue));
  return n && mt.call(e, ue) && r.unshift(e), r = r.filter(i), r;
}, Ir = function t(e, n, i) {
  for (var r = [], s = Array.from(e); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = t(l, !0, i);
      i.flatten ? r.push.apply(r, c) : r.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = mt.call(o, ue);
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
}, Sr = function(e, n) {
  return e.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, ba = function(e, n) {
  return e.tabIndex === n.tabIndex ? e.documentOrder - n.documentOrder : e.tabIndex - n.tabIndex;
}, Tr = function(e) {
  return e.tagName === "INPUT";
}, va = function(e) {
  return Tr(e) && e.type === "hidden";
}, ya = function(e) {
  var n = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, wa = function(e, n) {
  for (var i = 0; i < e.length; i++)
    if (e[i].checked && e[i].form === n)
      return e[i];
}, xa = function(e) {
  if (!e.name)
    return !0;
  var n = e.form || en(e), i = function(a) {
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
  var s = wa(r, e.form);
  return !s || s === e;
}, _a = function(e) {
  return Tr(e) && e.type === "radio";
}, Ea = function(e) {
  return _a(e) && !xa(e);
}, Un = function(e) {
  var n = e.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, Ia = function(e, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = mt.call(e, "details>summary:first-of-type"), o = s ? e.parentElement : e;
  if (mt.call(o, "details:not([open]) *"))
    return !0;
  var a = en(e).host, l = a?.ownerDocument.contains(a) || e.ownerDocument.contains(e);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var c = e; e; ) {
        var u = e.parentElement, d = en(e);
        if (u && !u.shadowRoot && r(u) === !0)
          return Un(e);
        e.assignedSlot ? e = e.assignedSlot : !u && d !== e.ownerDocument ? e = d.host : e = u;
      }
      e = c;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (i === "non-zero-area")
    return Un(e);
  return !1;
}, Sa = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var n = e.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return mt.call(n, "fieldset[disabled] *") ? !0 : !r.contains(e);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, de = function(e, n) {
  return !(n.disabled || va(n) || Ia(n, e) || // For a details element with a summary, the summary element gets the focus
  ya(n) || Sa(n));
}, nn = function(e, n) {
  return !(Ea(n) || Sr(n) < 0 || !de(e, n));
}, Ta = function(e) {
  var n = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, Ca = function t(e) {
  var n = [], i = [];
  return e.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Sr(a, o), c = o ? t(r.candidates) : a;
    l === 0 ? o ? n.push.apply(n, c) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: c
    });
  }), i.sort(ba).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, Aa = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Ir([e], n.includeContainer, {
    filter: nn.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: Ta
  }) : i = Er(e, n.includeContainer, nn.bind(null, n)), Ca(i);
}, Cr = function(e, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = Ir([e], n.includeContainer, {
    filter: de.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = Er(e, n.includeContainer, de.bind(null, n)), i;
}, te = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return mt.call(e, ue) === !1 ? !1 : nn(n, e);
}, Oa = /* @__PURE__ */ xr.concat("iframe").join(","), re = function(e, n) {
  if (n = n || {}, !e)
    throw new Error("No node provided");
  return mt.call(e, Oa) === !1 ? !1 : de(n, e);
};
function Gn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Zn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Gn(Object(n), !0).forEach(function(i) {
      $a(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Gn(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function $a(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t;
}
var Jn = /* @__PURE__ */ function() {
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
}(), Na = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Ra = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, ka = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, Xn = function(e) {
  return setTimeout(e, 0);
}, Qn = function(e, n) {
  var i = -1;
  return e.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, Lt = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof e == "function" ? e.apply(void 0, i) : e;
}, ee = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, La = function(e, n) {
  var i = n?.document || document, r = Zn({
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
  }, o, a = function(p, g, x) {
    return p && p[g] !== void 0 ? p[g] : r[x || g];
  }, l = function(p) {
    return s.containerGroups.findIndex(function(g) {
      var x = g.container, T = g.tabbableNodes;
      return x.contains(p) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(I) {
        return I === p;
      });
    });
  }, c = function(p) {
    var g = r[p];
    if (typeof g == "function") {
      for (var x = arguments.length, T = new Array(x > 1 ? x - 1 : 0), I = 1; I < x; I++)
        T[I - 1] = arguments[I];
      g = g.apply(void 0, T);
    }
    if (g === !0 && (g = void 0), !g) {
      if (g === void 0 || g === !1)
        return g;
      throw new Error("`".concat(p, "` was specified but was not a node, or did not return a node"));
    }
    var $ = g;
    if (typeof g == "string" && ($ = i.querySelector(g), !$))
      throw new Error("`".concat(p, "` as selector refers to no known node"));
    return $;
  }, u = function() {
    var p = c("initialFocus");
    if (p === !1)
      return !1;
    if (p === void 0)
      if (l(i.activeElement) >= 0)
        p = i.activeElement;
      else {
        var g = s.tabbableGroups[0], x = g && g.firstTabbableNode;
        p = x || c("fallbackFocus");
      }
    if (!p)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return p;
  }, d = function() {
    if (s.containerGroups = s.containers.map(function(p) {
      var g = Aa(p, r.tabbableOptions), x = Cr(p, r.tabbableOptions);
      return {
        container: p,
        tabbableNodes: g,
        focusableNodes: x,
        firstTabbableNode: g.length > 0 ? g[0] : null,
        lastTabbableNode: g.length > 0 ? g[g.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(I) {
          var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = x.findIndex(function(L) {
            return L === I;
          });
          if (!(k < 0))
            return $ ? x.slice(k + 1).find(function(L) {
              return te(L, r.tabbableOptions);
            }) : x.slice(0, k).reverse().find(function(L) {
              return te(L, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(p) {
      return p.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, f = function y(p) {
    if (p !== !1 && p !== i.activeElement) {
      if (!p || !p.focus) {
        y(u());
        return;
      }
      p.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = p, Na(p) && p.select();
    }
  }, m = function(p) {
    var g = c("setReturnFocus", p);
    return g || (g === !1 ? !1 : p);
  }, v = function(p) {
    var g = ee(p);
    if (!(l(g) >= 0)) {
      if (Lt(r.clickOutsideDeactivates, p)) {
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
          returnFocus: r.returnFocusOnDeactivate && !re(g, r.tabbableOptions)
        });
        return;
      }
      Lt(r.allowOutsideClick, p) || p.preventDefault();
    }
  }, E = function(p) {
    var g = ee(p), x = l(g) >= 0;
    x || g instanceof Document ? x && (s.mostRecentlyFocusedNode = g) : (p.stopImmediatePropagation(), f(s.mostRecentlyFocusedNode || u()));
  }, h = function(p) {
    var g = ee(p);
    d();
    var x = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(g), I = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        p.shiftKey ? x = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : x = s.tabbableGroups[0].firstTabbableNode;
      else if (p.shiftKey) {
        var $ = Qn(s.tabbableGroups, function(z) {
          var M = z.firstTabbableNode;
          return g === M;
        });
        if ($ < 0 && (I.container === g || re(g, r.tabbableOptions) && !te(g, r.tabbableOptions) && !I.nextTabbableNode(g, !1)) && ($ = T), $ >= 0) {
          var k = $ === 0 ? s.tabbableGroups.length - 1 : $ - 1, L = s.tabbableGroups[k];
          x = L.lastTabbableNode;
        }
      } else {
        var V = Qn(s.tabbableGroups, function(z) {
          var M = z.lastTabbableNode;
          return g === M;
        });
        if (V < 0 && (I.container === g || re(g, r.tabbableOptions) && !te(g, r.tabbableOptions) && !I.nextTabbableNode(g)) && (V = T), V >= 0) {
          var D = V === s.tabbableGroups.length - 1 ? 0 : V + 1, ot = s.tabbableGroups[D];
          x = ot.firstTabbableNode;
        }
      }
    } else
      x = c("fallbackFocus");
    x && (p.preventDefault(), f(x));
  }, b = function(p) {
    if (Ra(p) && Lt(r.escapeDeactivates, p) !== !1) {
      p.preventDefault(), o.deactivate();
      return;
    }
    if (ka(p)) {
      h(p);
      return;
    }
  }, w = function(p) {
    var g = ee(p);
    l(g) >= 0 || Lt(r.clickOutsideDeactivates, p) || Lt(r.allowOutsideClick, p) || (p.preventDefault(), p.stopImmediatePropagation());
  }, _ = function() {
    if (s.active)
      return Jn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? Xn(function() {
        f(u());
      }) : f(u()), i.addEventListener("focusin", E, !0), i.addEventListener("mousedown", v, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", v, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", w, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", b, {
        capture: !0,
        passive: !1
      }), o;
  }, S = function() {
    if (s.active)
      return i.removeEventListener("focusin", E, !0), i.removeEventListener("mousedown", v, !0), i.removeEventListener("touchstart", v, !0), i.removeEventListener("click", w, !0), i.removeEventListener("keydown", b, !0), o;
  };
  return o = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(p) {
      if (s.active)
        return this;
      var g = a(p, "onActivate"), x = a(p, "onPostActivate"), T = a(p, "checkCanFocusTrap");
      T || d(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, g && g();
      var I = function() {
        T && d(), _(), x && x();
      };
      return T ? (T(s.containers.concat()).then(I, I), this) : (I(), this);
    },
    deactivate: function(p) {
      if (!s.active)
        return this;
      var g = Zn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, p);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, S(), s.active = !1, s.paused = !1, Jn.deactivateTrap(o);
      var x = a(g, "onDeactivate"), T = a(g, "onPostDeactivate"), I = a(g, "checkCanReturnFocus"), $ = a(g, "returnFocus", "returnFocusOnDeactivate");
      x && x();
      var k = function() {
        Xn(function() {
          $ && f(m(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return $ && I ? (I(m(s.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, S(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, d(), _(), this);
    },
    updateContainerElements: function(p) {
      var g = [].concat(p).filter(Boolean);
      return s.containers = g.map(function(x) {
        return typeof x == "string" ? i.querySelector(x) : x;
      }), s.active && d(), this;
    }
  }, o.updateContainerElements(e), o;
};
function Fa(t) {
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
        return re(s);
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
        return Array.isArray(r) ? r : Cr(r, { displayCheck: "none" });
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
      };
      if (s.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let h = i.querySelector("[autofocus]");
        h && (d.initialFocus = h);
      }
      let f = La(i, d), m = () => {
      }, v = () => {
      };
      const E = () => {
        m(), m = () => {
        }, v(), v = () => {
        }, f.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => c((h) => {
        u !== h && (h && !u && (s.includes("noscroll") && (v = Da()), s.includes("inert") && (m = ti(i)), setTimeout(() => {
          f.activate();
        }, 15)), !h && u && E(), u = !!h);
      })), l(E);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && ti(i);
    }
  ));
}
function ti(t) {
  let e = [];
  return Ar(t, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), e.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Ar(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((n) => {
    n.isSameNode(t) ? Ar(t.parentNode, e) : e(n);
  });
}
function Da() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var Ma = Fa;
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
function Pa(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function za(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
  }
}
function Ba(t, e, n) {
  return e && za(t.prototype, e), t;
}
var ja = Object.defineProperty, Z = function(t, e) {
  return ja(t, "name", { value: e, configurable: !0 });
}, Wa = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Ha = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Va = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ya = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, qa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ka = Z(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), Ft = Z(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), C = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, tt = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, ei = { OUTLINE: "outline", FILLED: "filled" }, Me = { FADE: "fade", SLIDE: "slide" }, Dt = { CLOSE: Ft(Wa), SUCCESS: Ft(Ya), ERROR: Ft(Ha), WARNING: Ft(qa), INFO: Ft(Va) }, ni = Z(function(t) {
  t.wrapper.classList.add(C.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(C.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), ii = Z(function(t) {
  t.wrapper.classList.remove(C.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), Ua = Z(function(t) {
  t.wrapper.classList.add(C.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(C.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Ga = Z(function(t) {
  t.wrapper.classList.remove(C.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Or = function() {
  function t(e) {
    var n = this;
    Pa(this, t), this.notifyOut = Z(function(z) {
      z(n);
    }, "notifyOut");
    var i = e.notificationsGap, r = i === void 0 ? 20 : i, s = e.notificationsPadding, o = s === void 0 ? 20 : s, a = e.status, l = a === void 0 ? "success" : a, c = e.effect, u = c === void 0 ? Me.FADE : c, d = e.type, f = d === void 0 ? "outline" : d, m = e.title, v = e.text, E = e.showIcon, h = E === void 0 ? !0 : E, b = e.customIcon, w = b === void 0 ? "" : b, _ = e.customClass, S = _ === void 0 ? "" : _, y = e.speed, p = y === void 0 ? 500 : y, g = e.showCloseButton, x = g === void 0 ? !0 : g, T = e.autoclose, I = T === void 0 ? !0 : T, $ = e.autotimeout, k = $ === void 0 ? 3e3 : $, L = e.position, V = L === void 0 ? "right top" : L, D = e.customWrapper, ot = D === void 0 ? "" : D;
    if (this.customWrapper = ot, this.status = l, this.title = m, this.text = v, this.showIcon = h, this.customIcon = w, this.customClass = S, this.speed = p, this.effect = u, this.showCloseButton = x, this.autoclose = I, this.autotimeout = k, this.notificationsGap = r, this.notificationsPadding = o, this.type = f, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Ba(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(C.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(C.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](C.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](C.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](C.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](C.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](C.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](C.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](C.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(C.NOTIFY_CLOSE), i.innerHTML = Dt.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Ka(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(C.NOTIFY), this.type) {
      case ei.OUTLINE:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
        break;
      case ei.FILLED:
        this.wrapper.classList.add(C.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(C.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case tt.SUCCESS:
        this.wrapper.classList.add(C.NOTIFY_SUCCESS);
        break;
      case tt.ERROR:
        this.wrapper.classList.add(C.NOTIFY_ERROR);
        break;
      case tt.WARNING:
        this.wrapper.classList.add(C.NOTIFY_WARNING);
        break;
      case tt.INFO:
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
    var n = Z(function(r) {
      switch (r) {
        case tt.SUCCESS:
          return Dt.SUCCESS;
        case tt.ERROR:
          return Dt.ERROR;
        case tt.WARNING:
          return Dt.WARNING;
        case tt.INFO:
          return Dt.INFO;
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
      case Me.FADE:
        this.selectedNotifyInEffect = ni, this.selectedNotifyOutEffect = ii;
        break;
      case Me.SLIDE:
        this.selectedNotifyInEffect = Ua, this.selectedNotifyOutEffect = Ga;
        break;
      default:
        this.selectedNotifyInEffect = ni, this.selectedNotifyOutEffect = ii;
    }
  } }]), t;
}();
Z(Or, "Notify");
var $r = Or;
globalThis.Notify = $r;
const Nr = ["success", "error", "warning", "info"], Rr = [
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
], kr = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Mt(t = {}) {
  const e = {
    ...kr,
    ...t
  };
  Nr.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), Rr.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new $r(e);
}
const Za = {
  custom: Mt,
  success(t, e = "Success", n = {}) {
    Mt({
      status: "success",
      title: e,
      text: t,
      ...n
    });
  },
  error(t, e = "Error", n = {}) {
    Mt({
      status: "error",
      title: e,
      text: t,
      ...n
    });
  },
  warning(t, e = "Warning", n = {}) {
    Mt({
      status: "warning",
      title: e,
      text: t,
      ...n
    });
  },
  info(t, e = "Info", n = {}) {
    Mt({
      status: "info",
      title: e,
      text: t,
      ...n
    });
  },
  setDefaults(t = {}) {
    Object.assign(kr, t);
  },
  get allowedStatuses() {
    return [...Nr];
  },
  get allowedPositions() {
    return [...Rr];
  }
}, rn = function() {
}, Ht = {}, fe = {}, Vt = {};
function Ja(t, e) {
  t = Array.isArray(t) ? t : [t];
  const n = [];
  let i = t.length, r = i, s, o, a, l;
  for (s = function(c, u) {
    u.length && n.push(c), r--, r || e(n);
  }; i--; ) {
    if (o = t[i], a = fe[o], a) {
      s(o, a);
      continue;
    }
    l = Vt[o] = Vt[o] || [], l.push(s);
  }
}
function Lr(t, e) {
  if (!t) return;
  const n = Vt[t];
  if (fe[t] = e, !!n)
    for (; n.length; )
      n[0](t, e), n.splice(0, 1);
}
function sn(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || rn)(e) : (t.success || rn)(t);
}
function Xa(t, e, n, i, r, s, o, a) {
  let l = t.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return Fr(e, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(e, l, t.defaultPrevented);
}
function Fr(t, e, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || rn, l = t.replace(/[\?|#].*$/, ""), c = t.replace(/^(css|img|module|nomodule)!/, "");
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
  const m = function(v) {
    Xa(v, t, f, e, n, i, o, u);
  };
  f.addEventListener("load", m, { once: !0 }), f.addEventListener("error", m, { once: !0 }), a(t, f) !== !1 && r.head.appendChild(f);
}
function Qa(t, e, n) {
  t = Array.isArray(t) ? t : [t];
  let i = t.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    i--, i || e(r);
  }
  for (let o = 0; o < t.length; o++)
    Fr(t[o], s, n);
}
function et(t, e, n) {
  let i, r;
  if (e && typeof e == "string" && e.trim && (i = e.trim()), r = (i ? n : e) || {}, i) {
    if (i in Ht)
      throw "LoadJS";
    Ht[i] = !0;
  }
  function s(o, a) {
    Qa(t, function(l) {
      sn(r, l), o && sn({ success: o, error: a }, l), Lr(i, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
et.ready = function(e, n) {
  return Ja(e, function(i) {
    sn(n, i);
  }), et;
};
et.done = function(e) {
  Lr(e, []);
};
et.reset = function() {
  Object.keys(Ht).forEach((e) => delete Ht[e]), Object.keys(fe).forEach((e) => delete fe[e]), Object.keys(Vt).forEach((e) => delete Vt[e]);
};
et.isDefined = function(e) {
  return e in Ht;
};
function Dr(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return;
  }
  let e = null, n = null;
  if (typeof t == "string") {
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    if (n = t, e = document.getElementById(n), !e) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${n}" not found in the DOM.`);
      return;
    }
  } else if (t instanceof Element) {
    if (e = t, !e.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return;
    }
    n = e.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return;
  }
  const i = `[data-alpine-root="${n}"]`;
  let r = null;
  if (e.matches(i) ? r = e : r = e.querySelector(i), !r) {
    console.warn(
      `Rizzy.$data: Could not locate the designated Alpine root element using selector "${i}" on or inside the wrapper element (ID: #${n}). Verify the 'data-alpine-root' attribute placement.`
    );
    return;
  }
  const s = Alpine.$data(r);
  if (s === void 0) {
    const o = `${r.tagName.toLowerCase()}${r.id ? "#" + r.id : ""}${r.classList.length ? "." + Array.from(r.classList).join(".") : ""}`;
    console.warn(
      `Rizzy.$data: Located designated Alpine root (${o}) via 'data-alpine-root="${n}"', but Alpine.$data returned undefined. Ensure 'x-data' is correctly defined and initialized on this element.`
    );
  }
  return s;
}
function tl(t) {
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
function el(t) {
  t.data("accordionItem", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const e = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== e.sectionId && !e.allowMultiple && (e.open = !1);
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
function nl(t) {
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
function il(t) {
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
function rl(t) {
  t.data("rzCheckboxGroupItem", () => ({
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
function sl(t, e) {
  t.data("rzCodeViewer", () => ({
    expand: !1,
    border: !0,
    copied: !1,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
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
function ol(t, e) {
  t.data("rzDateEdit", () => ({
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
const on = Math.min, wt = Math.max, he = Math.round, K = (t) => ({
  x: t,
  y: t
}), al = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, ll = {
  start: "end",
  end: "start"
};
function ri(t, e, n) {
  return wt(t, on(e, n));
}
function Ce(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function bt(t) {
  return t.split("-")[0];
}
function Ae(t) {
  return t.split("-")[1];
}
function Mr(t) {
  return t === "x" ? "y" : "x";
}
function Pr(t) {
  return t === "y" ? "height" : "width";
}
function ht(t) {
  return ["top", "bottom"].includes(bt(t)) ? "y" : "x";
}
function zr(t) {
  return Mr(ht(t));
}
function cl(t, e, n) {
  n === void 0 && (n = !1);
  const i = Ae(t), r = zr(t), s = Pr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = pe(o)), [o, pe(o)];
}
function ul(t) {
  const e = pe(t);
  return [an(t), e, an(e)];
}
function an(t) {
  return t.replace(/start|end/g, (e) => ll[e]);
}
function dl(t, e, n) {
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
function fl(t, e, n, i) {
  const r = Ae(t);
  let s = dl(bt(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(an)))), s;
}
function pe(t) {
  return t.replace(/left|right|bottom|top/g, (e) => al[e]);
}
function hl(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function pl(t) {
  return typeof t != "number" ? hl(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function ge(t) {
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
function si(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = ht(e), o = zr(e), a = Pr(o), l = bt(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
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
  switch (Ae(e)) {
    case "start":
      m[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      m[o] += f * (n && c ? -1 : 1);
      break;
  }
  return m;
}
const gl = async (t, e, n) => {
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
  } = si(c, i, l), f = i, m = {}, v = 0;
  for (let E = 0; E < a.length; E++) {
    const {
      name: h,
      fn: b
    } = a[E], {
      x: w,
      y: _,
      data: S,
      reset: y
    } = await b({
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
    u = w ?? u, d = _ ?? d, m = {
      ...m,
      [h]: {
        ...m[h],
        ...S
      }
    }, y && v <= 50 && (v++, typeof y == "object" && (y.placement && (f = y.placement), y.rects && (c = y.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : y.rects), {
      x: u,
      y: d
    } = si(c, f, l)), E = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: m
  };
};
async function Br(t, e) {
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
  } = Ce(e, t), v = pl(m), h = a[f ? d === "floating" ? "reference" : "floating" : d], b = ge(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(h))) == null || n ? h : h.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), w = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, _ = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), S = await (s.isElement == null ? void 0 : s.isElement(_)) ? await (s.getScale == null ? void 0 : s.getScale(_)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, y = ge(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: _,
    strategy: l
  }) : w);
  return {
    top: (b.top - y.top + v.top) / S.y,
    bottom: (y.bottom - b.bottom + v.bottom) / S.y,
    left: (b.left - y.left + v.left) / S.x,
    right: (y.right - b.right + v.right) / S.x
  };
}
const ml = function(t) {
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
        fallbackAxisSideDirection: v = "none",
        flipAlignment: E = !0,
        ...h
      } = Ce(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const b = bt(r), w = ht(a), _ = bt(a) === a, S = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), y = f || (_ || !E ? [pe(a)] : ul(a)), p = v !== "none";
      !f && p && y.push(...fl(a, E, v, S));
      const g = [a, ...y], x = await Br(e, h), T = [];
      let I = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && T.push(x[b]), d) {
        const D = cl(r, o, S);
        T.push(x[D[0]], x[D[1]]);
      }
      if (I = [...I, {
        placement: r,
        overflows: T
      }], !T.every((D) => D <= 0)) {
        var $, k;
        const D = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, ot = g[D];
        if (ot) {
          var L;
          const M = d === "alignment" ? w !== ht(ot) : !1, Y = ((L = I[0]) == null ? void 0 : L.overflows[0]) > 0;
          if (!M || Y)
            return {
              data: {
                index: D,
                overflows: I
              },
              reset: {
                placement: ot
              }
            };
        }
        let z = (k = I.filter((M) => M.overflows[0] <= 0).sort((M, Y) => M.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!z)
          switch (m) {
            case "bestFit": {
              var V;
              const M = (V = I.filter((Y) => {
                if (p) {
                  const X = ht(Y.placement);
                  return X === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  X === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((X) => X > 0).reduce((X, Zr) => X + Zr, 0)]).sort((Y, X) => Y[1] - X[1])[0]) == null ? void 0 : V[0];
              M && (z = M);
              break;
            }
            case "initialPlacement":
              z = a;
              break;
          }
        if (r !== z)
          return {
            reset: {
              placement: z
            }
          };
      }
      return {};
    }
  };
};
async function bl(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = bt(n), a = Ae(n), l = ht(n) === "y", c = ["left", "top"].includes(o) ? -1 : 1, u = s && l ? -1 : 1, d = Ce(e, t);
  let {
    mainAxis: f,
    crossAxis: m,
    alignmentAxis: v
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof v == "number" && (m = a === "end" ? v * -1 : v), l ? {
    x: m * u,
    y: f * c
  } : {
    x: f * c,
    y: m * u
  };
}
const vl = function(t) {
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
      } = e, l = await bl(e, t);
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
}, yl = function(t) {
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
          fn: (h) => {
            let {
              x: b,
              y: w
            } = h;
            return {
              x: b,
              y: w
            };
          }
        },
        ...l
      } = Ce(t, e), c = {
        x: n,
        y: i
      }, u = await Br(e, l), d = ht(bt(r)), f = Mr(d);
      let m = c[f], v = c[d];
      if (s) {
        const h = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", w = m + u[h], _ = m - u[b];
        m = ri(w, m, _);
      }
      if (o) {
        const h = d === "y" ? "top" : "left", b = d === "y" ? "bottom" : "right", w = v + u[h], _ = v - u[b];
        v = ri(w, v, _);
      }
      const E = a.fn({
        ...e,
        [f]: m,
        [d]: v
      });
      return {
        ...E,
        data: {
          x: E.x - n,
          y: E.y - i,
          enabled: {
            [f]: s,
            [d]: o
          }
        }
      };
    }
  };
};
function Oe() {
  return typeof window < "u";
}
function $t(t) {
  return jr(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function F(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function J(t) {
  var e;
  return (e = (jr(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function jr(t) {
  return Oe() ? t instanceof Node || t instanceof F(t).Node : !1;
}
function j(t) {
  return Oe() ? t instanceof Element || t instanceof F(t).Element : !1;
}
function U(t) {
  return Oe() ? t instanceof HTMLElement || t instanceof F(t).HTMLElement : !1;
}
function oi(t) {
  return !Oe() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof F(t).ShadowRoot;
}
function Ut(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(r);
}
function wl(t) {
  return ["table", "td", "th"].includes($t(t));
}
function $e(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function $n(t) {
  const e = Nn(), n = j(t) ? W(t) : t;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function xl(t) {
  let e = rt(t);
  for (; U(e) && !Et(e); ) {
    if ($n(e))
      return e;
    if ($e(e))
      return null;
    e = rt(e);
  }
  return null;
}
function Nn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Et(t) {
  return ["html", "body", "#document"].includes($t(t));
}
function W(t) {
  return F(t).getComputedStyle(t);
}
function Ne(t) {
  return j(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function rt(t) {
  if ($t(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    oi(t) && t.host || // Fallback.
    J(t)
  );
  return oi(e) ? e.host : e;
}
function Wr(t) {
  const e = rt(t);
  return Et(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : U(e) && Ut(e) ? e : Wr(e);
}
function Hr(t, e, n) {
  var i;
  e === void 0 && (e = []);
  const r = Wr(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = F(r);
  return s ? (ln(o), e.concat(o, o.visualViewport || [], Ut(r) ? r : [], [])) : e.concat(r, Hr(r, []));
}
function ln(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Vr(t) {
  const e = W(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = U(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = he(n) !== s || he(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Yr(t) {
  return j(t) ? t : t.contextElement;
}
function xt(t) {
  const e = Yr(t);
  if (!U(e))
    return K(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Vr(e);
  let o = (s ? he(n.width) : n.width) / i, a = (s ? he(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const _l = /* @__PURE__ */ K(0);
function qr(t) {
  const e = F(t);
  return !Nn() || !e.visualViewport ? _l : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function El(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== F(t) ? !1 : e;
}
function Yt(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = Yr(t);
  let o = K(1);
  e && (i ? j(i) && (o = xt(i)) : o = xt(t));
  const a = El(s, n, i) ? qr(s) : K(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = F(s), m = i && j(i) ? F(i) : i;
    let v = f, E = ln(v);
    for (; E && i && m !== v; ) {
      const h = xt(E), b = E.getBoundingClientRect(), w = W(E), _ = b.left + (E.clientLeft + parseFloat(w.paddingLeft)) * h.x, S = b.top + (E.clientTop + parseFloat(w.paddingTop)) * h.y;
      l *= h.x, c *= h.y, u *= h.x, d *= h.y, l += _, c += S, v = F(E), E = ln(v);
    }
  }
  return ge({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Rn(t, e) {
  const n = Ne(t).scrollLeft;
  return e ? e.left + n : Yt(J(t)).left + n;
}
function Kr(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), r = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    Rn(t, i)
  )), s = i.top + e.scrollTop;
  return {
    x: r,
    y: s
  };
}
function Il(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = J(i), a = e ? $e(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), d = U(i);
  if ((d || !d && !s) && (($t(i) !== "body" || Ut(o)) && (l = Ne(i)), U(i))) {
    const m = Yt(i);
    c = xt(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const f = o && !d && !s ? Kr(o, l, !0) : K(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Sl(t) {
  return Array.from(t.getClientRects());
}
function Tl(t) {
  const e = J(t), n = Ne(t), i = t.ownerDocument.body, r = wt(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = wt(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Rn(t);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += wt(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function Cl(t, e) {
  const n = F(t), i = J(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = Nn();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
function Al(t, e) {
  const n = Yt(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = U(t) ? xt(t) : K(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function ai(t, e, n) {
  let i;
  if (e === "viewport")
    i = Cl(t, n);
  else if (e === "document")
    i = Tl(J(t));
  else if (j(e))
    i = Al(e, n);
  else {
    const r = qr(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return ge(i);
}
function Ur(t, e) {
  const n = rt(t);
  return n === e || !j(n) || Et(n) ? !1 : W(n).position === "fixed" || Ur(n, e);
}
function Ol(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Hr(t, []).filter((a) => j(a) && $t(a) !== "body"), r = null;
  const s = W(t).position === "fixed";
  let o = s ? rt(t) : t;
  for (; j(o) && !Et(o); ) {
    const a = W(o), l = $n(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ut(o) && !l && Ur(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = rt(o);
  }
  return e.set(t, i), i;
}
function $l(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? $e(e) ? [] : Ol(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = ai(e, u, r);
    return c.top = wt(d.top, c.top), c.right = on(d.right, c.right), c.bottom = on(d.bottom, c.bottom), c.left = wt(d.left, c.left), c;
  }, ai(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Nl(t) {
  const {
    width: e,
    height: n
  } = Vr(t);
  return {
    width: e,
    height: n
  };
}
function Rl(t, e, n) {
  const i = U(e), r = J(e), s = n === "fixed", o = Yt(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = Rn(r);
  }
  if (i || !i && !s)
    if (($t(e) !== "body" || Ut(r)) && (a = Ne(e)), i) {
      const m = Yt(e, !0, s, e);
      l.x = m.x + e.clientLeft, l.y = m.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Kr(r, a) : K(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Pe(t) {
  return W(t).position === "static";
}
function li(t, e) {
  if (!U(t) || W(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return J(t) === n && (n = n.ownerDocument.body), n;
}
function Gr(t, e) {
  const n = F(t);
  if ($e(t))
    return n;
  if (!U(t)) {
    let r = rt(t);
    for (; r && !Et(r); ) {
      if (j(r) && !Pe(r))
        return r;
      r = rt(r);
    }
    return n;
  }
  let i = li(t, e);
  for (; i && wl(i) && Pe(i); )
    i = li(i, e);
  return i && Et(i) && Pe(i) && !$n(i) ? n : i || xl(t) || n;
}
const kl = async function(t) {
  const e = this.getOffsetParent || Gr, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Rl(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Ll(t) {
  return W(t).direction === "rtl";
}
const Fl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Il,
  getDocumentElement: J,
  getClippingRect: $l,
  getOffsetParent: Gr,
  getElementRects: kl,
  getClientRects: Sl,
  getDimensions: Nl,
  getScale: xt,
  isElement: j,
  isRTL: Ll
}, me = vl, be = yl, ve = ml, ye = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Fl,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return gl(t, e, {
    ...r,
    platform: s
  });
};
function Dl(t) {
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
    anchor: "bottom",
    pixelOffset: 3,
    isSubmenuActive: !1,
    navThrottle: 100,
    _lastNavAt: 0,
    selfId: null,
    // --- INIT ---
    init() {
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentEl = this.$el, this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this.anchor = this.$el.dataset.anchor || "bottom", this.pixelOffset = parseInt(this.$el.dataset.offset) || 6, this.isModal = this.$el.dataset.modal !== "false", this.$watch("open", (e) => {
        e ? (this._lastNavAt = 0, this.$nextTick(() => {
          this.updatePosition(), this.menuItems = Array.from(
            this.contentEl.querySelectorAll(
              '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
            )
          );
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open", this.trapActive = this.isModal) : (this.focusedIndex = null, this.closeAllSubmenus(), this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.trapActive = !1);
      });
    },
    // --- METHODS ---
    updatePosition() {
      !this.triggerEl || !this.contentEl || ye(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [me(this.pixelOffset), ve(), be({ padding: 8 })]
      }).then(({ x: e, y: n }) => {
        Object.assign(this.contentEl.style, { left: `${e}px`, top: `${n}px` });
      });
    },
    toggle() {
      this.open ? (this.open = !1, this.$nextTick(() => this.triggerEl?.focus())) : (this.open = !0, this.focusedIndex = -1);
    },
    handleOutsideClick() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
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
      const n = this.menuItems.indexOf(e);
      n !== -1 && (this.focusedIndex = n, e.focus());
    },
    handleItemClick(e) {
      const n = e.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.open = !1, this.$nextTick(() => this.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      this.focusSelectedItem(n), n.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
    },
    handleWindowEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleContentTabKey() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleTriggerMouseover() {
      this.$nextTick(() => this.$el.firstChild?.focus());
    },
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
      this.$el.id || (this.$el.id = crypto.randomUUID()), this.selfId = this.$el.id, this.parentDropdown = t.$data(this.$el.closest('[x-data^="rzDropdownMenu"]')), this.triggerEl = this.$refs.subTrigger, this.siblingContainer = this.$el.parentElement, this.anchor = this.$el.dataset.subAnchor || this.anchor, this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset, this.$watch("open", (e) => {
        e ? (this._lastNavAt = 0, this.parentDropdown.isSubmenuActive = !0, this.$nextTick(() => {
          const n = this.$refs.subContent;
          this.updatePosition(n), this.menuItems = Array.from(n.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
        }), this.ariaExpanded = "true", this.triggerEl.dataset.state = "open") : (this.focusedIndex = null, this.ariaExpanded = "false", delete this.triggerEl.dataset.state, this.$nextTick(() => {
          this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]') || (this.parentDropdown.isSubmenuActive = !1);
        }));
      });
    },
    // --- METHODS ---
    updatePosition(e) {
      !this.triggerEl || !e || ye(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [me(this.pixelOffset), ve(), be({ padding: 8 })]
      }).then(({ x: n, y: i }) => {
        Object.assign(e.style, { left: `${n}px`, top: `${i}px` });
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
      const e = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
      e && Array.from(e).some((i) => t.$data(i)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
    },
    openSubmenu(e = !1) {
      this.open || (this.closeSiblingSubmenus(), this.open = !0, e && this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem())));
    },
    closeSubmenu() {
      this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((n) => {
        t.$data(n)?.closeSubmenu();
      }), this.open = !1;
    },
    closeSiblingSubmenus() {
      if (!this.siblingContainer) return;
      Array.from(this.siblingContainer.children).filter(
        (n) => n.hasAttribute("x-data") && n.getAttribute("x-data").startsWith("rzDropdownSubmenu") && n.id !== this.selfId
      ).forEach((n) => {
        t.$data(n)?.closeSubmenu();
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
      const n = e.currentTarget;
      if (!(n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled"))) {
        if (n.getAttribute("aria-haspopup") === "menu") {
          t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
          return;
        }
        this.parentDropdown.open = !1, this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
      }
    },
    handleItemMouseEnter(e) {
      const n = e.currentTarget;
      if (n.getAttribute("aria-disabled") === "true" || n.hasAttribute("disabled")) return;
      const i = this.menuItems.indexOf(n);
      i !== -1 && (this.focusedIndex = i, n.focus()), n.getAttribute("aria-haspopup") === "menu" ? t.$data(n.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
    },
    handleSubmenuEscape() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    },
    handleSubmenuArrowLeft() {
      this.open && (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function Ml(t) {
  t.data("rzDarkModeToggle", () => ({
    mode: "light",
    applyTheme: null,
    init() {
      const e = typeof window < "u" && "localStorage" in window, n = ["light", "dark", "auto"], i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let r = "auto";
      e && (r = localStorage.getItem("darkMode") ?? "auto", n.includes(r) || (r = "light")), e && localStorage.setItem("darkMode", r), this.applyTheme = () => {
        document.documentElement.classList.toggle(
          "dark",
          r === "dark" || r === "auto" && i
        );
      }, this.applyTheme(), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.applyTheme);
    },
    // Returns true if dark mode should be active
    isDark() {
      const e = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return localStorage.getItem("darkMode"), this.mode === "dark" || this.mode === "auto" && e;
    },
    // Returns true if light mode should be active
    isLight() {
      return !this.isDark();
    },
    // Toggle the dark mode setting and dispatch a custom event
    toggle() {
      let e = localStorage.getItem("darkMode");
      const n = window.matchMedia("(prefers-color-scheme: dark)").matches;
      e === "light" ? e = "dark" : e === "dark" ? e = "light" : e === "auto" && (e = n ? "light" : "dark"), this.mode = e, localStorage.setItem("darkMode", e);
      const i = e === "dark" || e === "auto" && n;
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
function Pl(t) {
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
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  }));
}
function zl(t) {
  t.data("rzEmpty", () => {
  });
}
function Bl(t) {
  t.data("rzHeading", () => ({
    observer: null,
    headingId: "",
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
    destroy() {
      this.observer != null && this.observer.disconnect();
    }
  }));
}
function jl(t) {
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
function Wl(t, e) {
  t.data("rzMarkdown", () => ({
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
function Hl(t) {
  t.data("rzModal", () => ({
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
    notModalOpen() {
      return !this.modalOpen;
    },
    destroy() {
      this._openListener && this.eventTriggerName && window.removeEventListener(this.eventTriggerName, this._openListener), this._closeEventListener && window.removeEventListener(this.closeEventName, this._closeEventListener), this._escapeListener && window.removeEventListener("keydown", this._escapeListener), document.body.classList.remove("overflow-hidden"), document.body.style.setProperty("--page-scrollbar-width", "0px");
    },
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
function Vl(t, e) {
  t.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: !1,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    viewport: null,
    indicator: null,
    /* ---------- helpers ---------- */
    _triggerIndex(n) {
      return this.list ? Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]')).findIndex((r) => r.id.replace("-trigger", "") === n) : -1;
    },
    _contentData(n) {
      return e(`${n}-content`);
    },
    _contentEl(n) {
      return document.getElementById(`${n}-content`);
    },
    _positionViewport() {
      !this.list || !this.viewport || ye(this.list, this.viewport, {
        placement: "bottom-start",
        middleware: [
          me(parseInt(this.$el.dataset.viewportOffset) || 0),
          ve(),
          be({ padding: 8 })
        ]
      }).then(({ x: n, y: i }) => {
        Object.assign(this.viewport.style, {
          left: `${n}px`,
          top: `${i}px`,
          transform: ""
          // remove translate(-50%)
        });
      });
    },
    /* ---------- lifecycle ---------- */
    init() {
      this.$nextTick(() => {
        this.list = this.$refs.list, this.viewport = this.$refs.viewport, this.indicator = this.$refs.indicator;
      });
    },
    /* ---------- trigger handlers ---------- */
    toggleActive(n) {
      const i = n.currentTarget.id.replace("-trigger", "");
      this.activeItemId === i && this.open ? this.closeMenu() : this.openMenu(i);
    },
    handleTriggerEnter(n) {
      const i = n.currentTarget.id.replace("-trigger", "");
      this.cancelClose(), this.activeItemId !== i && requestAnimationFrame(() => this.openMenu(i));
    },
    /* ---------- timers ---------- */
    scheduleClose() {
      this.closeTimeout = setTimeout(() => this.closeMenu(), 150);
    },
    cancelClose() {
      this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null);
    },
    /* ---------- open / close ---------- */
    openMenu(n) {
      this.cancelClose();
      const i = this._triggerIndex(n), r = i > (this.prevIndex ?? i) ? "end" : "start", s = this.prevIndex === null;
      if (this.open && this.activeItemId) {
        const a = this.$refs[`trigger_${this.activeItemId}`];
        a && delete a.dataset.state;
        const l = this._contentEl(this.activeItemId);
        l && l.setAttribute("data-motion", `to-${r}`);
        const c = this._contentData(this.activeItemId);
        c && (c.visible = !1);
      }
      this.activeItemId = n, this.open = !0, this.prevIndex = i;
      const o = this._contentData(n);
      o && (o.visible = !0), this.$nextTick(() => {
        const a = this.$refs[`trigger_${n}`];
        if (!a || !this.viewport) return;
        this.indicator && (this.indicator.style.width = `${a.offsetWidth}px`, this.indicator.style.left = `${a.offsetLeft}px`, this.indicator.setAttribute("data-state", "visible")), this.viewport.setAttribute("data-state", "open"), this.viewport.setAttribute("data-motion", s ? "zoom-in" : "none");
        const l = this._contentEl(n);
        l && l.setAttribute(
          "data-motion",
          s ? "fade-in" : `from-${r}`
        ), requestAnimationFrame(() => this._positionViewport()), a.setAttribute("aria-expanded", "true"), a.dataset.state = "open";
      });
    },
    closeMenu() {
      if (!this.open) return;
      this.viewport && (this.viewport.setAttribute("data-motion", "zoom-out"), this.viewport.setAttribute("data-state", "closed"));
      const n = this.activeItemId && this.$refs[`trigger_${this.activeItemId}`];
      n && (n.setAttribute("aria-expanded", "false"), delete n.dataset.state), this.indicator?.setAttribute("data-state", "hidden");
      const i = this.activeItemId && this._contentEl(this.activeItemId);
      i && i.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        if (this.activeItemId) {
          const r = this._contentData(this.activeItemId);
          r && (r.visible = !1);
        }
        this.open = !1, this.activeItemId = null, this.prevIndex = null;
      }, 200);
    }
  })), t.data("rzNavigationMenuContent", () => ({ visible: !1 }));
}
function Yl(t) {
  t.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    init() {
      this.triggerEl = this.$refs.trigger.children[0] || this.$refs.trigger, this.contentEl = this.$refs.content, this.$watch("open", (e) => {
        this.ariaExpanded = e.toString(), e && this.$nextTick(() => this.updatePosition());
      });
    },
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const e = this.$el.dataset.anchor || "bottom", n = parseInt(this.$el.dataset.offset) || 0, i = parseInt(this.$el.dataset.crossAxisOffset) || 0, r = parseInt(this.$el.dataset.alignmentAxisOffset) || 0, s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(me({
        mainAxis: n,
        crossAxis: i,
        alignmentAxis: r
      })), o && c.push(ve()), a && c.push(be({ padding: l })), ye(this.triggerEl, this.contentEl, {
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
function ql(t) {
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
function Kl(t) {
  t.data("rzProgress", () => ({
    currentVal: 0,
    minVal: 0,
    maxVal: 100,
    percentage: 0,
    label: "",
    init() {
      const e = this.$el;
      this.currentVal = parseInt(e.getAttribute("data-current-val")) || 0, this.minVal = parseInt(e.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(e.getAttribute("data-max-val")) || 100, this.label = e.getAttribute("data-label"), this.calculatePercentage(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuemin", this.minVal), e.setAttribute("aria-valuemax", this.maxVal), e.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((i) => {
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
      const e = this.$refs.progressBar, n = this.$refs.progressBarLabel, i = this.$refs.innerLabel;
      n && e && i && (i.innerText = this.buildLabel(), n.clientWidth > e.clientWidth ? n.style.left = e.clientWidth + 10 + "px" : n.style.left = e.clientWidth / 2 - n.clientWidth / 2 + "px");
    },
    getLabelCss() {
      const e = this.$refs.progressBarLabel, n = this.$refs.progressBar;
      return e && n && e.clientWidth > n.clientWidth ? "text-foreground dark:text-foreground" : "";
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
function Ul(t) {
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
function Gl(t) {
  t.data("rzTabs", () => ({
    buttonRef: null,
    tabSelected: "",
    tabButton: null,
    init() {
      this.buttonRef = document.getElementById(this.$el.dataset.buttonref), this.tabSelected = this.$el.dataset.tabselected, this.tabButton = this.buttonRef.querySelector("[data-name='" + this.tabSelected + "']"), this.tabRepositionMarker(this.tabButton);
    },
    tabButtonClicked(e) {
      e instanceof Event && (e = e.target), this.tabSelected = e.dataset.name, this.tabRepositionMarker(e), e.focus();
    },
    tabRepositionMarker(e) {
      this.tabButton = e, this.$refs.tabMarker.style.width = e.offsetWidth + "px", this.$refs.tabMarker.style.height = e.offsetHeight + "px", this.$refs.tabMarker.style.left = e.offsetLeft + "px", setTimeout(() => {
        this.$refs.tabMarker.style.opacity = 1;
      }, 150);
    },
    // Get the CSS classes for the tab content panel based on selection
    getTabContentCss() {
      return this.tabSelected === this.$el.dataset.name ? "" : "hidden";
    },
    tabContentActive(e) {
      return e = e ?? this.$el, this.tabSelected === e.dataset.name;
    },
    tabButtonActive(e) {
      return e = e ?? this.$el, this.tabSelected === e.dataset.name;
    },
    // Get the value for the aria-selected attribute
    getTabButtonAriaSelected() {
      return this.tabSelected === this.$el.dataset.name ? "true" : "false";
    },
    // Get the CSS classes for the tab button text color based on selection
    getSelectedTabTextColorCss() {
      const e = this.$el.dataset.selectedtextcolor ?? "";
      return this.tabSelected === this.$el.dataset.name ? e : "";
    },
    handleResize() {
      this.tabRepositionMarker(this.tabButton);
    },
    handleKeyDown(e) {
      const n = e.key, i = Array.from(this.buttonRef.querySelectorAll("[role='tab']")), r = i.findIndex((o) => this.tabSelected === o.dataset.name);
      let s = r;
      n === "ArrowRight" ? (s = (r + 1) % i.length, e.preventDefault()) : n === "ArrowLeft" ? (s = (r - 1 + i.length) % i.length, e.preventDefault()) : n === "Home" ? (s = 0, e.preventDefault()) : n === "End" && (s = i.length - 1, e.preventDefault()), s !== r && this.tabButtonClicked(i[s]);
    }
  }));
}
function Zl(t) {
  t.data("rzSidebar", () => ({
    showSidebar: !1,
    isSidebarHidden() {
      return !this.showSidebar;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    hideSidebar() {
      this.showSidebar = !1;
    },
    // Return translation classes based on sidebar state for smooth slide-in/out
    getSidebarTranslation() {
      return this.showSidebar ? "translate-x-0" : "-translate-x-60";
    }
  }));
}
function Jl(t) {
  t.data("rzSidebarLinkItem", () => ({
    isExpanded: !1,
    chevronExpandedClass: "",
    chevronCollapsedClass: "",
    init() {
      this.isExpanded = this.$el.dataset.expanded === "true", this.chevronExpandedClass = this.$el.dataset.chevronExpandedClass, this.chevronCollapsedClass = this.$el.dataset.chevronCollapsedClass;
    },
    isCollapsed() {
      return !this.isExpanded;
    },
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
    hideSidebar() {
      const e = this.$el.closest('[x-data^="rzSidebar"]');
      if (e) {
        let n = t.$data(e);
        n.showSidebar = !1;
      } else
        console.warn("Parent sidebar context not found or 'showSidebar' is not defined.");
    },
    getExpandedClass() {
      return this.isExpanded ? this.chevronExpandedClass : this.chevronCollapsedClass;
    },
    // Get the value for the aria-expanded attribute
    getAriaExpanded() {
      return this.isExpanded ? "true" : "false";
    }
  }));
}
async function Xl(t) {
  t = [...t].sort();
  const e = t.join("|"), i = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function se(t, e, n) {
  Xl(t).then((i) => {
    et.isDefined(i) || et(
      t,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), et.ready([i], e);
  });
}
function Ql(t) {
  tl(t), el(t), nl(t), il(t), rl(t), sl(t, se), ol(t, se), Dl(t), Ml(t), Pl(t), zl(t), Bl(t), jl(t), Wl(t, se), Vl(t, Dr), Hl(t), Yl(t), ql(t), Kl(t), Ul(t), Gl(t), Zl(t), Jl(t);
}
yt.plugin(da);
yt.plugin(ma);
yt.plugin(Ma);
Ql(yt);
const tc = {
  Alpine: yt,
  require: se,
  toast: Za,
  $data: Dr
};
window.Alpine = yt;
window.Rizzy = { ...window.Rizzy || {}, ...tc };
yt.start();
export {
  tc as default
};
