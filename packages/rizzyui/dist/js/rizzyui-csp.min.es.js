var Ft = !1, Mt = !1, le = [], Dt = -1;
function Kr(e) {
  qr(e);
}
function qr(e) {
  le.includes(e) || le.push(e), Gr();
}
function Ur(e) {
  let t = le.indexOf(e);
  t !== -1 && t > Dt && le.splice(t, 1);
}
function Gr() {
  !Mt && !Ft && (Ft = !0, queueMicrotask(Zr));
}
function Zr() {
  Ft = !1, Mt = !0;
  for (let e = 0; e < le.length; e++)
    le[e](), Dt = e;
  le.length = 0, Dt = -1, Mt = !1;
}
var Se, be, Ce, si, Pt = !0;
function Jr(e) {
  Pt = !1, e(), Pt = !0;
}
function Xr(e) {
  Se = e.reactive, Ce = e.release, be = (t) => e.effect(t, { scheduler: (n) => {
    Pt ? Kr(n) : n();
  } }), si = e.raw;
}
function An(e) {
  be = e;
}
function Qr(e) {
  let t = () => {
  };
  return [(i) => {
    let r = be(i);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Ce(r));
    }, r;
  }, () => {
    t();
  }];
}
function oi(e, t) {
  let n = !0, i, r = be(() => {
    let s = e();
    JSON.stringify(s), n ? i = s : queueMicrotask(() => {
      t(s, i), i = s;
    }), n = !1;
  });
  return () => Ce(r);
}
var ai = [], ci = [], li = [];
function es(e) {
  li.push(e);
}
function sn(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, ci.push(t));
}
function ui(e) {
  ai.push(e);
}
function fi(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function di(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((r) => r()), delete e._x_attributeCleanups[n]);
  });
}
function ts(e) {
  for (e._x_effects?.forEach(Ur); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var on = new MutationObserver(un), an = !1;
function cn() {
  on.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), an = !0;
}
function hi() {
  ns(), on.disconnect(), an = !1;
}
var Re = [];
function ns() {
  let e = on.takeRecords();
  Re.push(() => e.length > 0 && un(e));
  let t = Re.length;
  queueMicrotask(() => {
    if (Re.length === t)
      for (; Re.length > 0; )
        Re.shift()();
  });
}
function A(e) {
  if (!an)
    return e();
  hi();
  let t = e();
  return cn(), t;
}
var ln = !1, ot = [];
function is() {
  ln = !0;
}
function rs() {
  ln = !1, un(ot), ot = [];
}
function un(e) {
  if (ln) {
    ot = ot.concat(e);
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
      let o = e[s].target, a = e[s].attributeName, c = e[s].oldValue, l = () => {
        i.has(o) || i.set(o, []), i.get(o).push({ name: a, value: o.getAttribute(a) });
      }, u = () => {
        r.has(o) || r.set(o, []), r.get(o).push(a);
      };
      o.hasAttribute(a) && c === null ? l() : o.hasAttribute(a) ? (u(), l()) : u();
    }
  r.forEach((s, o) => {
    di(o, s);
  }), i.forEach((s, o) => {
    ai.forEach((a) => a(o, s));
  });
  for (let s of n)
    t.some((o) => o.contains(s)) || ci.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && li.forEach((o) => o(s));
  t = null, n = null, i = null, r = null;
}
function pi(e) {
  return Oe(pe(e));
}
function Ke(e, t, n) {
  return e._x_dataStack = [t, ...pe(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function pe(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? pe(e.host) : e.parentNode ? pe(e.parentNode) : [];
}
function Oe(e) {
  return new Proxy({ objects: e }, ss);
}
var ss = {
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
    return t == "toJSON" ? os : Reflect.get(
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
function os() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function gi(e) {
  let t = (i) => typeof i == "object" && !Array.isArray(i) && i !== null, n = (i, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let c = r === "" ? s : `${r}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? i[s] = o.initialize(e, c, s) : t(o) && o !== i && !(o instanceof Element) && n(o, c);
    });
  };
  return n(e);
}
function mi(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, r, s) {
      return e(this.initialValue, () => as(i, r), (o) => zt(i, r, o), r, s);
    }
  };
  return t(n), (i) => {
    if (typeof i == "object" && i !== null && i._x_interceptor) {
      let r = n.initialize.bind(n);
      n.initialize = (s, o, a) => {
        let c = i.initialize(s, o, a);
        return n.initialValue = c, r(s, o, a);
      };
    } else
      n.initialValue = i;
    return n;
  };
}
function as(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function zt(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), zt(e[t[0]], t.slice(1), n);
  }
}
var vi = {};
function H(e, t) {
  vi[e] = t;
}
function at(e, t) {
  let n = cs(t);
  return Object.entries(vi).forEach(([i, r]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return r(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function cs(e) {
  let [t, n] = Si(e), i = { interceptor: mi, ...t };
  return sn(e, n), i;
}
function bi(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (r) {
    je(r, e, t);
  }
}
function je(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var nt = !0;
function yi(e) {
  let t = nt;
  nt = !1;
  let n = e();
  return nt = t, n;
}
function ue(e, t, n = {}) {
  let i;
  return L(e, t)((r) => i = r, n), i;
}
function L(...e) {
  return wi(...e);
}
var wi = us;
function ls(e) {
  wi = e;
}
function us(e, t) {
  let n = {};
  at(n, e);
  let i = [n, ...pe(e)], r = typeof t == "function" ? _i(i, t) : ds(i, t, e);
  return bi.bind(null, e, t, r);
}
function _i(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: r = [] } = {}) => {
    let s = t.apply(Oe([i, ...e]), r);
    We(n, s);
  };
}
var It = {};
function fs(e, t) {
  if (It[e])
    return It[e];
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
      return je(o, t, e), Promise.resolve();
    }
  })();
  return It[e] = s, s;
}
function ds(e, t, n) {
  let i = fs(t, n);
  return (r = () => {
  }, { scope: s = {}, params: o = [] } = {}) => {
    i.result = void 0, i.finished = !1;
    let a = Oe([s, ...e]);
    if (typeof i == "function") {
      let c = i(i, a).catch((l) => je(l, n, t));
      i.finished ? (We(r, i.result, a, o, n), i.result = void 0) : c.then((l) => {
        We(r, l, a, o, n);
      }).catch((l) => je(l, n, t)).finally(() => i.result = void 0);
    }
  };
}
function We(e, t, n, i, r) {
  if (nt && typeof t == "function") {
    let s = t.apply(n, i);
    s instanceof Promise ? s.then((o) => We(e, o, n, i)).catch((o) => je(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
var fn = "x-";
function Te(e = "") {
  return fn + e;
}
function hs(e) {
  fn = e;
}
var ct = {};
function R(e, t) {
  return ct[e] = t, {
    before(n) {
      if (!ct[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = ce.indexOf(n);
      ce.splice(i >= 0 ? i : ce.indexOf("DEFAULT"), 0, e);
    }
  };
}
function ps(e) {
  return Object.keys(ct).includes(e);
}
function dn(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({ name: a, value: c })), o = xi(s);
    s = s.map((a) => o.find((c) => c.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let i = {};
  return t.map(Ti((s, o) => i[s] = o)).filter(Ai).map(vs(i, n)).sort(bs).map((s) => ms(e, s));
}
function xi(e) {
  return Array.from(e).map(Ti()).filter((t) => !Ai(t));
}
var Bt = !1, Pe = /* @__PURE__ */ new Map(), Ei = Symbol();
function gs(e) {
  Bt = !0;
  let t = Symbol();
  Ei = t, Pe.set(t, []);
  let n = () => {
    for (; Pe.get(t).length; )
      Pe.get(t).shift()();
    Pe.delete(t);
  }, i = () => {
    Bt = !1, n();
  };
  e(n), i();
}
function Si(e) {
  let t = [], n = (a) => t.push(a), [i, r] = Qr(e);
  return t.push(r), [{
    Alpine: qe,
    effect: i,
    cleanup: n,
    evaluateLater: L.bind(L, e),
    evaluate: ue.bind(ue, e)
  }, () => t.forEach((a) => a())];
}
function ms(e, t) {
  let n = () => {
  }, i = ct[t.type] || n, [r, s] = Si(e);
  fi(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, r), i = i.bind(i, e, t, r), Bt ? Pe.get(Ei).push(i) : i());
  };
  return o.runCleanups = s, o;
}
var Ci = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), Oi = (e) => e;
function Ti(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: r } = Ii.reduce((s, o) => o(s), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: r };
  };
}
var Ii = [];
function hn(e) {
  Ii.push(e);
}
function Ai({ name: e }) {
  return Ni().test(e);
}
var Ni = () => new RegExp(`^${fn}([^:^.]+)\\b`);
function vs(e, t) {
  return ({ name: n, value: i }) => {
    let r = n.match(Ni()), s = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((c) => c.replace(".", "")),
      expression: i,
      original: a
    };
  };
}
var jt = "DEFAULT", ce = [
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
  jt,
  "teleport"
];
function bs(e, t) {
  let n = ce.indexOf(e.type) === -1 ? jt : e.type, i = ce.indexOf(t.type) === -1 ? jt : t.type;
  return ce.indexOf(n) - ce.indexOf(i);
}
function ze(e, t, n = {}) {
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
function P(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Nn = !1;
function ys() {
  Nn && P("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Nn = !0, document.body || P("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ze(document, "alpine:init"), ze(document, "alpine:initializing"), cn(), es((t) => G(t, ge)), sn((t) => Ae(t)), ui((t, n) => {
    dn(t, n).forEach((i) => i());
  });
  let e = (t) => !mt(t.parentElement, !0);
  Array.from(document.querySelectorAll(ki().join(","))).filter(e).forEach((t) => {
    G(t);
  }), ze(document, "alpine:initialized"), setTimeout(() => {
    Es();
  });
}
var pn = [], Ri = [];
function Li() {
  return pn.map((e) => e());
}
function ki() {
  return pn.concat(Ri).map((e) => e());
}
function $i(e) {
  pn.push(e);
}
function Fi(e) {
  Ri.push(e);
}
function mt(e, t = !1) {
  return Ie(e, (n) => {
    if ((t ? ki() : Li()).some((r) => n.matches(r)))
      return !0;
  });
}
function Ie(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return Ie(e.parentElement, t);
  }
}
function ws(e) {
  return Li().some((t) => e.matches(t));
}
var Mi = [];
function _s(e) {
  Mi.push(e);
}
var xs = 1;
function G(e, t = ge, n = () => {
}) {
  Ie(e, (i) => i._x_ignore) || gs(() => {
    t(e, (i, r) => {
      i._x_marker || (n(i, r), Mi.forEach((s) => s(i, r)), dn(i, i.attributes).forEach((s) => s()), i._x_ignore || (i._x_marker = xs++), i._x_ignore && r());
    });
  });
}
function Ae(e, t = ge) {
  t(e, (n) => {
    ts(n), di(n), delete n._x_marker;
  });
}
function Es() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    ps(n) || i.some((r) => {
      if (document.querySelector(r))
        return P(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var Wt = [], gn = !1;
function mn(e = () => {
}) {
  return queueMicrotask(() => {
    gn || setTimeout(() => {
      Ht();
    });
  }), new Promise((t) => {
    Wt.push(() => {
      e(), t();
    });
  });
}
function Ht() {
  for (gn = !1; Wt.length; )
    Wt.shift()();
}
function Ss() {
  gn = !0;
}
function vn(e, t) {
  return Array.isArray(t) ? Rn(e, t.join(" ")) : typeof t == "object" && t !== null ? Cs(e, t) : typeof t == "function" ? vn(e, t()) : Rn(e, t);
}
function Rn(e, t) {
  let n = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function Cs(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), i = Object.entries(t).flatMap(([a, c]) => c ? n(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, c]) => c ? !1 : n(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), i.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function vt(e, t) {
  return typeof t == "object" && t !== null ? Os(e, t) : Ts(e, t);
}
function Os(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, r]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = Is(i)), e.style.setProperty(i, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    vt(e, n);
  };
}
function Ts(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Is(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Vt(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
R("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: r }) => {
  typeof i == "function" && (i = r(i)), i !== !1 && (!i || typeof i == "boolean" ? Ns(e, n, t) : As(e, i, t));
});
function As(e, t, n) {
  Di(e, vn, ""), {
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
function Ns(e, t, n) {
  Di(e, vt);
  let i = !t.includes("in") && !t.includes("out") && !n, r = i || t.includes("in") || ["enter"].includes(n), s = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((v, w) => w < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((v, w) => w > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), c = o || t.includes("scale"), l = a ? 0 : 1, u = c ? Le(t, "scale", 95) / 100 : 1, f = Le(t, "delay", 0) / 1e3, d = Le(t, "origin", "center"), m = "opacity, transform", b = Le(t, "duration", 150) / 1e3, E = Le(t, "duration", 75) / 1e3, h = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: d,
    transitionDelay: `${f}s`,
    transitionProperty: m,
    transitionDuration: `${b}s`,
    transitionTimingFunction: h
  }, e._x_transition.enter.start = {
    opacity: l,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: d,
    transitionDelay: `${f}s`,
    transitionProperty: m,
    transitionDuration: `${E}s`,
    transitionTimingFunction: h
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: l,
    transform: `scale(${u})`
  });
}
function Di(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, r = () => {
    }) {
      Yt(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, r);
    },
    out(i = () => {
    }, r = () => {
    }) {
      Yt(e, t, {
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
    let o = Pi(e);
    o ? (o._x_hideChildren || (o._x_hideChildren = []), o._x_hideChildren.push(e)) : r(() => {
      let a = (c) => {
        let l = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(a)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, l;
      };
      a(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function Pi(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Pi(t);
}
function Yt(e, t, { during: n, start: i, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, c, l;
  Rs(e, {
    start() {
      a = t(e, i);
    },
    during() {
      c = t(e, n);
    },
    before: s,
    end() {
      a(), l = t(e, r);
    },
    after: o,
    cleanup() {
      c(), l();
    }
  });
}
function Rs(e, t) {
  let n, i, r, s = Vt(() => {
    A(() => {
      n = !0, i || t.before(), r || (t.end(), Ht()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: Vt(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, A(() => {
    t.start(), t.during();
  }), Ss(), requestAnimationFrame(() => {
    if (n)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), A(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (A(() => {
        t.end();
      }), Ht(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
    });
  });
}
function Le(e, t, n) {
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
var ne = !1;
function se(e, t = () => {
}) {
  return (...n) => ne ? t(...n) : e(...n);
}
function Ls(e) {
  return (...t) => ne && e(...t);
}
var zi = [];
function bt(e) {
  zi.push(e);
}
function ks(e, t) {
  zi.forEach((n) => n(e, t)), ne = !0, Bi(() => {
    G(t, (n, i) => {
      i(n, () => {
      });
    });
  }), ne = !1;
}
var Kt = !1;
function $s(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), ne = !0, Kt = !0, Bi(() => {
    Fs(t);
  }), ne = !1, Kt = !1;
}
function Fs(e) {
  let t = !1;
  G(e, (i, r) => {
    ge(i, (s, o) => {
      if (t && ws(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function Bi(e) {
  let t = be;
  An((n, i) => {
    let r = t(n);
    return Ce(r), () => {
    };
  }), e(), An(t);
}
function ji(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = Se({})), e._x_bindings[t] = n, t = i.includes("camel") ? Hs(t) : t, t) {
    case "value":
      Ms(e, n);
      break;
    case "style":
      Ps(e, n);
      break;
    case "class":
      Ds(e, n);
      break;
    case "selected":
    case "checked":
      zs(e, t, n);
      break;
    default:
      Wi(e, t, n);
      break;
  }
}
function Ms(e, t) {
  if (Yi(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = it(e.value) === t : e.checked = Ln(e.value, t));
  else if (bn(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Ln(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Ws(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Ds(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = vn(e, t);
}
function Ps(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = vt(e, t);
}
function zs(e, t, n) {
  Wi(e, t, n), js(e, t, n);
}
function Wi(e, t, n) {
  [null, void 0, !1].includes(n) && Ys(t) ? e.removeAttribute(t) : (Hi(t) && (n = t), Bs(e, t, n));
}
function Bs(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function js(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Ws(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Hs(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Ln(e, t) {
  return e == t;
}
function it(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Vs = /* @__PURE__ */ new Set([
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
function Hi(e) {
  return Vs.has(e);
}
function Ys(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Ks(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Vi(e, t, n);
}
function qs(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = i, yi(() => ue(e, r.expression));
  }
  return Vi(e, t, n);
}
function Vi(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : Hi(t) ? !![t, "true"].includes(i) : i;
}
function bn(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Yi(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Ki(e, t) {
  var n;
  return function() {
    var i = this, r = arguments, s = function() {
      n = null, e.apply(i, r);
    };
    clearTimeout(n), n = setTimeout(s, t);
  };
}
function qi(e, t) {
  let n;
  return function() {
    let i = this, r = arguments;
    n || (e.apply(i, r), n = !0, setTimeout(() => n = !1, t));
  };
}
function Ui({ get: e, set: t }, { get: n, set: i }) {
  let r = !0, s, o = be(() => {
    let a = e(), c = n();
    if (r)
      i(At(a)), r = !1;
    else {
      let l = JSON.stringify(a), u = JSON.stringify(c);
      l !== s ? i(At(a)) : l !== u && t(At(c));
    }
    s = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    Ce(o);
  };
}
function At(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Us(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(qe));
}
var ae = {}, kn = !1;
function Gs(e, t) {
  if (kn || (ae = Se(ae), kn = !0), t === void 0)
    return ae[e];
  ae[e] = t, gi(ae[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ae[e].init();
}
function Zs() {
  return ae;
}
var Gi = {};
function Js(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Zi(e, n()) : (Gi[e] = n, () => {
  });
}
function Xs(e) {
  return Object.entries(Gi).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function Zi(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = xi(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), dn(e, r, n).map((o) => {
    i.push(o.runCleanups), o();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var Ji = {};
function Qs(e, t) {
  Ji[e] = t;
}
function eo(e, t) {
  return Object.entries(Ji).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...r) => i.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var to = {
  get reactive() {
    return Se;
  },
  get release() {
    return Ce;
  },
  get effect() {
    return be;
  },
  get raw() {
    return si;
  },
  version: "3.14.9",
  flushAndStopDeferringMutations: rs,
  dontAutoEvaluateFunctions: yi,
  disableEffectScheduling: Jr,
  startObservingMutations: cn,
  stopObservingMutations: hi,
  setReactivityEngine: Xr,
  onAttributeRemoved: fi,
  onAttributesAdded: ui,
  closestDataStack: pe,
  skipDuringClone: se,
  onlyDuringClone: Ls,
  addRootSelector: $i,
  addInitSelector: Fi,
  interceptClone: bt,
  addScopeToNode: Ke,
  deferMutations: is,
  mapAttributes: hn,
  evaluateLater: L,
  interceptInit: _s,
  setEvaluator: ls,
  mergeProxies: Oe,
  extractProp: qs,
  findClosest: Ie,
  onElRemoved: sn,
  closestRoot: mt,
  destroyTree: Ae,
  interceptor: mi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Yt,
  // INTERNAL
  setStyles: vt,
  // INTERNAL
  mutateDom: A,
  directive: R,
  entangle: Ui,
  throttle: qi,
  debounce: Ki,
  evaluate: ue,
  initTree: G,
  nextTick: mn,
  prefixed: Te,
  prefix: hs,
  plugin: Us,
  magic: H,
  store: Gs,
  start: ys,
  clone: $s,
  // INTERNAL
  cloneNode: ks,
  // INTERNAL
  bound: Ks,
  $data: pi,
  watch: oi,
  walk: ge,
  data: Qs,
  bind: Js
}, qe = to;
function no(e, t) {
  let n = io(e);
  if (typeof t == "function")
    return _i(n, t);
  let i = ro(e, t, n);
  return bi.bind(null, e, t, i);
}
function io(e) {
  let t = {};
  return at(t, e), [t, ...pe(e)];
}
function ro(e, t, n) {
  return (i = () => {
  }, { scope: r = {}, params: s = [] } = {}) => {
    let o = Oe([r, ...n]), a = t.split(".").reduce(
      (c, l) => (c[l] === void 0 && so(e, t), c[l]),
      o
    );
    We(i, a, o, s);
  };
}
function so(e, t) {
  console.warn(
    `Alpine Error: Alpine is unable to interpret the following expression using the CSP-friendly build:

"${t}"

Read more about the Alpine's CSP-friendly build restrictions here: https://alpinejs.dev/advanced/csp

`,
    e
  );
}
function oo(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = e.split(",");
  for (let r = 0; r < i.length; r++)
    n[i[r]] = !0;
  return (r) => !!n[r];
}
var ao = Object.freeze({}), co = Object.prototype.hasOwnProperty, yt = (e, t) => co.call(e, t), fe = Array.isArray, Be = (e) => Xi(e) === "[object Map]", lo = (e) => typeof e == "string", yn = (e) => typeof e == "symbol", wt = (e) => e !== null && typeof e == "object", uo = Object.prototype.toString, Xi = (e) => uo.call(e), Qi = (e) => Xi(e).slice(8, -1), wn = (e) => lo(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, fo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, ho = fo((e) => e.charAt(0).toUpperCase() + e.slice(1)), er = (e, t) => e !== t && (e === e || t === t), qt = /* @__PURE__ */ new WeakMap(), ke = [], K, de = Symbol("iterate"), Ut = Symbol("Map key iterate");
function po(e) {
  return e && e._isEffect === !0;
}
function go(e, t = ao) {
  po(e) && (e = e.raw);
  const n = bo(e, t);
  return t.lazy || n(), n;
}
function mo(e) {
  e.active && (tr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var vo = 0;
function bo(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!ke.includes(n)) {
      tr(n);
      try {
        return wo(), ke.push(n), K = n, e();
      } finally {
        ke.pop(), nr(), K = ke[ke.length - 1];
      }
    }
  };
  return n.id = vo++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function tr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var xe = !0, _n = [];
function yo() {
  _n.push(xe), xe = !1;
}
function wo() {
  _n.push(xe), xe = !0;
}
function nr() {
  const e = _n.pop();
  xe = e === void 0 ? !0 : e;
}
function B(e, t, n) {
  if (!xe || K === void 0)
    return;
  let i = qt.get(e);
  i || qt.set(e, i = /* @__PURE__ */ new Map());
  let r = i.get(n);
  r || i.set(n, r = /* @__PURE__ */ new Set()), r.has(K) || (r.add(K), K.deps.push(r), K.options.onTrack && K.options.onTrack({
    effect: K,
    target: e,
    type: t,
    key: n
  }));
}
function ie(e, t, n, i, r, s) {
  const o = qt.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), c = (u) => {
    u && u.forEach((f) => {
      (f !== K || f.allowRecurse) && a.add(f);
    });
  };
  if (t === "clear")
    o.forEach(c);
  else if (n === "length" && fe(e))
    o.forEach((u, f) => {
      (f === "length" || f >= i) && c(u);
    });
  else
    switch (n !== void 0 && c(o.get(n)), t) {
      case "add":
        fe(e) ? wn(n) && c(o.get("length")) : (c(o.get(de)), Be(e) && c(o.get(Ut)));
        break;
      case "delete":
        fe(e) || (c(o.get(de)), Be(e) && c(o.get(Ut)));
        break;
      case "set":
        Be(e) && c(o.get(de));
        break;
    }
  const l = (u) => {
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
  a.forEach(l);
}
var _o = /* @__PURE__ */ oo("__proto__,__v_isRef,__isVue"), ir = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(yn)), xo = /* @__PURE__ */ rr(), Eo = /* @__PURE__ */ rr(!0), $n = /* @__PURE__ */ So();
function So() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const i = I(this);
      for (let s = 0, o = this.length; s < o; s++)
        B(i, "get", s + "");
      const r = i[t](...n);
      return r === -1 || r === !1 ? i[t](...n.map(I)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      yo();
      const i = I(this)[t].apply(this, n);
      return nr(), i;
    };
  }), e;
}
function rr(e = !1, t = !1) {
  return function(i, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? Po : cr : t ? Do : ar).get(i))
      return i;
    const o = fe(i);
    if (!e && o && yt($n, r))
      return Reflect.get($n, r, s);
    const a = Reflect.get(i, r, s);
    return (yn(r) ? ir.has(r) : _o(r)) || (e || B(i, "get", r), t) ? a : Gt(a) ? !o || !wn(r) ? a.value : a : wt(a) ? e ? lr(a) : Cn(a) : a;
  };
}
var Co = /* @__PURE__ */ Oo();
function Oo(e = !1) {
  return function(n, i, r, s) {
    let o = n[i];
    if (!e && (r = I(r), o = I(o), !fe(n) && Gt(o) && !Gt(r)))
      return o.value = r, !0;
    const a = fe(n) && wn(i) ? Number(i) < n.length : yt(n, i), c = Reflect.set(n, i, r, s);
    return n === I(s) && (a ? er(r, o) && ie(n, "set", i, r, o) : ie(n, "add", i, r)), c;
  };
}
function To(e, t) {
  const n = yt(e, t), i = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && ie(e, "delete", t, void 0, i), r;
}
function Io(e, t) {
  const n = Reflect.has(e, t);
  return (!yn(t) || !ir.has(t)) && B(e, "has", t), n;
}
function Ao(e) {
  return B(e, "iterate", fe(e) ? "length" : de), Reflect.ownKeys(e);
}
var No = {
  get: xo,
  set: Co,
  deleteProperty: To,
  has: Io,
  ownKeys: Ao
}, Ro = {
  get: Eo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, xn = (e) => wt(e) ? Cn(e) : e, En = (e) => wt(e) ? lr(e) : e, Sn = (e) => e, _t = (e) => Reflect.getPrototypeOf(e);
function Ge(e, t, n = !1, i = !1) {
  e = e.__v_raw;
  const r = I(e), s = I(t);
  t !== s && !n && B(r, "get", t), !n && B(r, "get", s);
  const { has: o } = _t(r), a = i ? Sn : n ? En : xn;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function Ze(e, t = !1) {
  const n = this.__v_raw, i = I(n), r = I(e);
  return e !== r && !t && B(i, "has", e), !t && B(i, "has", r), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Je(e, t = !1) {
  return e = e.__v_raw, !t && B(I(e), "iterate", de), Reflect.get(e, "size", e);
}
function Fn(e) {
  e = I(e);
  const t = I(this);
  return _t(t).has.call(t, e) || (t.add(e), ie(t, "add", e, e)), this;
}
function Mn(e, t) {
  t = I(t);
  const n = I(this), { has: i, get: r } = _t(n);
  let s = i.call(n, e);
  s ? or(n, i, e) : (e = I(e), s = i.call(n, e));
  const o = r.call(n, e);
  return n.set(e, t), s ? er(t, o) && ie(n, "set", e, t, o) : ie(n, "add", e, t), this;
}
function Dn(e) {
  const t = I(this), { has: n, get: i } = _t(t);
  let r = n.call(t, e);
  r ? or(t, n, e) : (e = I(e), r = n.call(t, e));
  const s = i ? i.call(t, e) : void 0, o = t.delete(e);
  return r && ie(t, "delete", e, void 0, s), o;
}
function Pn() {
  const e = I(this), t = e.size !== 0, n = Be(e) ? new Map(e) : new Set(e), i = e.clear();
  return t && ie(e, "clear", void 0, void 0, n), i;
}
function Xe(e, t) {
  return function(i, r) {
    const s = this, o = s.__v_raw, a = I(o), c = t ? Sn : e ? En : xn;
    return !e && B(a, "iterate", de), o.forEach((l, u) => i.call(r, c(l), c(u), s));
  };
}
function Qe(e, t, n) {
  return function(...i) {
    const r = this.__v_raw, s = I(r), o = Be(s), a = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = r[e](...i), u = n ? Sn : t ? En : xn;
    return !t && B(s, "iterate", c ? Ut : de), {
      // iterator protocol
      next() {
        const { value: f, done: d } = l.next();
        return d ? { value: f, done: d } : {
          value: a ? [u(f[0]), u(f[1])] : u(f),
          done: d
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Q(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${ho(e)} operation ${n}failed: target is readonly.`, I(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Lo() {
  const e = {
    get(s) {
      return Ge(this, s);
    },
    get size() {
      return Je(this);
    },
    has: Ze,
    add: Fn,
    set: Mn,
    delete: Dn,
    clear: Pn,
    forEach: Xe(!1, !1)
  }, t = {
    get(s) {
      return Ge(this, s, !1, !0);
    },
    get size() {
      return Je(this);
    },
    has: Ze,
    add: Fn,
    set: Mn,
    delete: Dn,
    clear: Pn,
    forEach: Xe(!1, !0)
  }, n = {
    get(s) {
      return Ge(this, s, !0);
    },
    get size() {
      return Je(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
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
    forEach: Xe(!0, !1)
  }, i = {
    get(s) {
      return Ge(this, s, !0, !0);
    },
    get size() {
      return Je(this, !0);
    },
    has(s) {
      return Ze.call(this, s, !0);
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
    forEach: Xe(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = Qe(s, !1, !1), n[s] = Qe(s, !0, !1), t[s] = Qe(s, !1, !0), i[s] = Qe(s, !0, !0);
  }), [
    e,
    n,
    t,
    i
  ];
}
var [ko, $o, Xc, Qc] = /* @__PURE__ */ Lo();
function sr(e, t) {
  const n = e ? $o : ko;
  return (i, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? i : Reflect.get(yt(n, r) && r in i ? n : i, r, s);
}
var Fo = {
  get: /* @__PURE__ */ sr(!1)
}, Mo = {
  get: /* @__PURE__ */ sr(!0)
};
function or(e, t, n) {
  const i = I(n);
  if (i !== n && t.call(e, i)) {
    const r = Qi(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var ar = /* @__PURE__ */ new WeakMap(), Do = /* @__PURE__ */ new WeakMap(), cr = /* @__PURE__ */ new WeakMap(), Po = /* @__PURE__ */ new WeakMap();
function zo(e) {
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
function Bo(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : zo(Qi(e));
}
function Cn(e) {
  return e && e.__v_isReadonly ? e : ur(e, !1, No, Fo, ar);
}
function lr(e) {
  return ur(e, !0, Ro, Mo, cr);
}
function ur(e, t, n, i, r) {
  if (!wt(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = Bo(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? i : n);
  return r.set(e, a), a;
}
function I(e) {
  return e && I(e.__v_raw) || e;
}
function Gt(e) {
  return !!(e && e.__v_isRef === !0);
}
H("nextTick", () => mn);
H("dispatch", (e) => ze.bind(ze, e));
H("watch", (e, { evaluateLater: t, cleanup: n }) => (i, r) => {
  let s = t(i), a = oi(() => {
    let c;
    return s((l) => c = l), c;
  }, r);
  n(a);
});
H("store", Zs);
H("data", (e) => pi(e));
H("root", (e) => mt(e));
H("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Oe(jo(e))), e._x_refs_proxy));
function jo(e) {
  let t = [];
  return Ie(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Nt = {};
function fr(e) {
  return Nt[e] || (Nt[e] = 0), ++Nt[e];
}
function Wo(e, t) {
  return Ie(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Ho(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = fr(t));
}
H("id", (e, { cleanup: t }) => (n, i = null) => {
  let r = `${n}${i ? `-${i}` : ""}`;
  return Vo(e, r, t, () => {
    let s = Wo(e, n), o = s ? s._x_ids[n] : fr(n);
    return i ? `${n}-${o}-${i}` : `${n}-${o}`;
  });
});
bt((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Vo(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = i();
  return e._x_id[t] = r, n(() => {
    delete e._x_id[t];
  }), r;
}
H("el", (e) => e);
dr("Focus", "focus", "focus");
dr("Persist", "persist", "persist");
function dr(e, t, n) {
  H(t, (i) => P(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
R("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: r }) => {
  let s = i(t), o = () => {
    let u;
    return s((f) => u = f), u;
  }, a = i(`${t} = __placeholder`), c = (u) => a(() => {
  }, { scope: { __placeholder: u } }), l = o();
  c(l), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, f = e._x_model.set, d = Ui(
      {
        get() {
          return u();
        },
        set(m) {
          f(m);
        }
      },
      {
        get() {
          return o();
        },
        set(m) {
          c(m);
        }
      }
    );
    r(d);
  });
});
R("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && P("x-teleport can only be used on a <template> tag", e);
  let r = zn(n), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), Ke(s, {}, e);
  let o = (a, c, l) => {
    l.includes("prepend") ? c.parentNode.insertBefore(a, c) : l.includes("append") ? c.parentNode.insertBefore(a, c.nextSibling) : c.appendChild(a);
  };
  A(() => {
    o(s, r, t), se(() => {
      G(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = zn(n);
    A(() => {
      o(e._x_teleport, a, t);
    });
  }, i(
    () => A(() => {
      s.remove(), Ae(s);
    })
  );
});
var Yo = document.createElement("div");
function zn(e) {
  let t = se(() => document.querySelector(e), () => Yo)();
  return t || P(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var hr = () => {
};
hr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
R("ignore", hr);
R("effect", se((e, { expression: t }, { effect: n }) => {
  n(L(e, t));
}));
function Zt(e, t, n, i) {
  let r = e, s = (c) => i(c), o = {}, a = (c, l) => (u) => l(c, u);
  if (n.includes("dot") && (t = Ko(t)), n.includes("camel") && (t = qo(t)), n.includes("passive") && (o.passive = !0), n.includes("capture") && (o.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
    let c = n[n.indexOf("debounce") + 1] || "invalid-wait", l = lt(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    s = Ki(s, l);
  }
  if (n.includes("throttle")) {
    let c = n[n.indexOf("throttle") + 1] || "invalid-wait", l = lt(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    s = qi(s, l);
  }
  return n.includes("prevent") && (s = a(s, (c, l) => {
    l.preventDefault(), c(l);
  })), n.includes("stop") && (s = a(s, (c, l) => {
    l.stopPropagation(), c(l);
  })), n.includes("once") && (s = a(s, (c, l) => {
    c(l), r.removeEventListener(t, s, o);
  })), (n.includes("away") || n.includes("outside")) && (r = document, s = a(s, (c, l) => {
    e.contains(l.target) || l.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(l));
  })), n.includes("self") && (s = a(s, (c, l) => {
    l.target === e && c(l);
  })), (Go(t) || pr(t)) && (s = a(s, (c, l) => {
    Zo(l, n) || c(l);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function Ko(e) {
  return e.replace(/-/g, ".");
}
function qo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function lt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Uo(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Go(e) {
  return ["keydown", "keyup"].includes(e);
}
function pr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Zo(e, t) {
  let n = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(s));
  if (n.includes("debounce")) {
    let s = n.indexOf("debounce");
    n.splice(s, lt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let s = n.indexOf("throttle");
    n.splice(s, lt((n[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Bn(e.key).includes(n[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => n.includes(s));
  return n = n.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (pr(e.type) || Bn(e.key).includes(n[0])));
}
function Bn(e) {
  if (!e)
    return [];
  e = Uo(e);
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
R("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = L(s, n), a;
  typeof n == "string" ? a = L(s, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = L(s, `${n()} = __placeholder`) : a = () => {
  };
  let c = () => {
    let d;
    return o((m) => d = m), jn(d) ? d.get() : d;
  }, l = (d) => {
    let m;
    o((b) => m = b), jn(m) ? m.set(d) : a(() => {
    }, {
      scope: { __placeholder: d }
    });
  };
  typeof n == "string" && e.type === "radio" && A(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  var u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input";
  let f = ne ? () => {
  } : Zt(e, u, t, (d) => {
    l(Rt(e, t, d, c()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || bn(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && l(
    Rt(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = f, r(() => e._x_removeModelListeners.default()), e.form) {
    let d = Zt(e.form, "reset", [], (m) => {
      mn(() => e._x_model && e._x_model.set(Rt(e, t, { target: e }, c())));
    });
    r(() => d());
  }
  e._x_model = {
    get() {
      return c();
    },
    set(d) {
      l(d);
    }
  }, e._x_forceModelUpdate = (d) => {
    d === void 0 && typeof n == "string" && n.match(/\./) && (d = ""), window.fromModel = !0, A(() => ji(e, "value", d)), delete window.fromModel;
  }, i(() => {
    let d = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(d);
  });
});
function Rt(e, t, n, i) {
  return A(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (bn(e))
      if (Array.isArray(i)) {
        let r = null;
        return t.includes("number") ? r = Lt(n.target.value) : t.includes("boolean") ? r = it(n.target.value) : r = n.target.value, n.target.checked ? i.includes(r) ? i : i.concat([r]) : i.filter((s) => !Jo(s, r));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Lt(s);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return it(s);
        }) : Array.from(n.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return Yi(e) ? n.target.checked ? r = n.target.value : r = i : r = n.target.value, t.includes("number") ? Lt(r) : t.includes("boolean") ? it(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Lt(e) {
  let t = e ? parseFloat(e) : null;
  return Xo(t) ? t : e;
}
function Jo(e, t) {
  return e == t;
}
function Xo(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function jn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
R("cloak", (e) => queueMicrotask(() => A(() => e.removeAttribute(Te("cloak")))));
Fi(() => `[${Te("init")}]`);
R("init", se((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
R("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      A(() => {
        e.textContent = s;
      });
    });
  });
});
R("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let r = i(t);
  n(() => {
    r((s) => {
      A(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, G(e), delete e._x_ignoreSelf;
      });
    });
  });
});
hn(Ci(":", Oi(Te("bind:"))));
var gr = (e, { value: t, modifiers: n, expression: i, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let c = {};
    Xs(c), L(e, i)((u) => {
      Zi(e, u, r);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return Qo(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = L(e, i);
  s(() => a((c) => {
    c === void 0 && typeof i == "string" && i.match(/\./) && (c = ""), A(() => ji(e, t, c, n));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
gr.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
R("bind", gr);
function Qo(e, t) {
  e._x_keyExpression = t;
}
$i(() => `[${Te("data")}]`);
R("data", (e, { expression: t }, { cleanup: n }) => {
  if (ea(e))
    return;
  t = t === "" ? "{}" : t;
  let i = {};
  at(i, e);
  let r = {};
  eo(r, i);
  let s = ue(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), at(s, e);
  let o = Se(s);
  gi(o);
  let a = Ke(e, o);
  o.init && ue(e, o.init), n(() => {
    o.destroy && ue(e, o.destroy), a();
  });
});
bt((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ea(e) {
  return ne ? Kt ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
R("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let r = L(e, n);
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
  }, a = () => setTimeout(o), c = Vt(
    (f) => f ? o() : s(),
    (f) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, f, o, s) : f ? a() : s();
    }
  ), l, u = !0;
  i(() => r((f) => {
    !u && f === l || (t.includes("immediate") && (f ? a() : s()), c(f), l = f, u = !1);
  }));
});
R("for", (e, { expression: t }, { effect: n, cleanup: i }) => {
  let r = na(t), s = L(e, r.items), o = L(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => ta(e, r, s, o)), i(() => {
    Object.values(e._x_lookup).forEach((a) => A(
      () => {
        Ae(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function ta(e, t, n, i) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  n((o) => {
    ia(o) && o >= 0 && (o = Array.from(Array(o).keys(), (h) => h + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, c = e._x_prevKeys, l = [], u = [];
    if (r(o))
      o = Object.entries(o).map(([h, v]) => {
        let w = Wn(t, v, h, o);
        i((x) => {
          u.includes(x) && P("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: h, ...w } }), l.push(w);
      });
    else
      for (let h = 0; h < o.length; h++) {
        let v = Wn(t, o[h], h, o);
        i((w) => {
          u.includes(w) && P("Duplicate key on x-for", e), u.push(w);
        }, { scope: { index: h, ...v } }), l.push(v);
      }
    let f = [], d = [], m = [], b = [];
    for (let h = 0; h < c.length; h++) {
      let v = c[h];
      u.indexOf(v) === -1 && m.push(v);
    }
    c = c.filter((h) => !m.includes(h));
    let E = "template";
    for (let h = 0; h < u.length; h++) {
      let v = u[h], w = c.indexOf(v);
      if (w === -1)
        c.splice(h, 0, v), f.push([E, h]);
      else if (w !== h) {
        let x = c.splice(h, 1)[0], C = c.splice(w - 1, 1)[0];
        c.splice(h, 0, C), c.splice(w, 0, x), d.push([x, C]);
      } else
        b.push(v);
      E = v;
    }
    for (let h = 0; h < m.length; h++) {
      let v = m[h];
      v in a && (A(() => {
        Ae(a[v]), a[v].remove();
      }), delete a[v]);
    }
    for (let h = 0; h < d.length; h++) {
      let [v, w] = d[h], x = a[v], C = a[w], y = document.createElement("div");
      A(() => {
        C || P('x-for ":key" is undefined or invalid', s, w, a), C.after(y), x.after(C), C._x_currentIfEl && C.after(C._x_currentIfEl), y.before(x), x._x_currentIfEl && x.after(x._x_currentIfEl), y.remove();
      }), C._x_refreshXForScope(l[u.indexOf(w)]);
    }
    for (let h = 0; h < f.length; h++) {
      let [v, w] = f[h], x = v === "template" ? s : a[v];
      x._x_currentIfEl && (x = x._x_currentIfEl);
      let C = l[w], y = u[w], p = document.importNode(s.content, !0).firstElementChild, g = Se(C);
      Ke(p, g, s), p._x_refreshXForScope = (_) => {
        Object.entries(_).forEach(([O, S]) => {
          g[O] = S;
        });
      }, A(() => {
        x.after(p), se(() => G(p))();
      }), typeof y == "object" && P("x-for key cannot be an object, it must be a string or an integer", s), a[y] = p;
    }
    for (let h = 0; h < b.length; h++)
      a[b[h]]._x_refreshXForScope(l[u.indexOf(b[h])]);
    s._x_prevKeys = u;
  });
}
function na(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(i);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(n, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function Wn(e, t, n, i) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = n), e.collection && (r[e.collection] = i), r;
}
function ia(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function mr() {
}
mr.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = mt(e);
  i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]);
};
R("ref", mr);
R("if", (e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && P("x-if can only be used on a <template> tag", e);
  let r = L(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return Ke(a, {}, e), A(() => {
      e.after(a), se(() => G(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      A(() => {
        Ae(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => r((a) => {
    a ? s() : o();
  })), i(() => e._x_undoIf && e._x_undoIf());
});
R("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((r) => Ho(e, r));
});
bt((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
hn(Ci("@", Oi(Te("on:"))));
R("on", se((e, { value: t, modifiers: n, expression: i }, { cleanup: r }) => {
  let s = i ? L(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = Zt(e, t, n, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
xt("Collapse", "collapse", "collapse");
xt("Intersect", "intersect", "intersect");
xt("Focus", "trap", "focus");
xt("Mask", "mask", "mask");
function xt(e, t, n) {
  R(t, (i) => P(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
qe.setEvaluator(no);
qe.setReactivityEngine({ reactive: Cn, effect: go, release: mo, raw: I });
var ra = qe, ye = ra;
function sa(e) {
  e.directive("collapse", t), t.inline = (n, { modifiers: i }) => {
    i.includes("min") && (n._x_doShow = () => {
    }, n._x_doHide = () => {
    });
  };
  function t(n, { modifiers: i }) {
    let r = Hn(i, "duration", 250) / 1e3, s = Hn(i, "min", 0), o = !i.includes("min");
    n._x_isShown || (n.style.height = `${s}px`), !n._x_isShown && o && (n.hidden = !0), n._x_isShown || (n.style.overflow = "hidden");
    let a = (l, u) => {
      let f = e.setStyles(l, u);
      return u.height ? () => {
      } : f;
    }, c = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    n._x_transition = {
      in(l = () => {
      }, u = () => {
      }) {
        o && (n.hidden = !1), o && (n.style.display = null);
        let f = n.getBoundingClientRect().height;
        n.style.height = "auto";
        let d = n.getBoundingClientRect().height;
        f === d && (f = s), e.transition(n, e.setStyles, {
          during: c,
          start: { height: f + "px" },
          end: { height: d + "px" }
        }, () => n._x_isShown = !0, () => {
          Math.abs(n.getBoundingClientRect().height - d) < 1 && (n.style.overflow = null);
        });
      },
      out(l = () => {
      }, u = () => {
      }) {
        let f = n.getBoundingClientRect().height;
        e.transition(n, a, {
          during: c,
          start: { height: f + "px" },
          end: { height: s + "px" }
        }, () => n.style.overflow = "hidden", () => {
          n._x_isShown = !1, n.style.height == `${s}px` && o && (n.style.display = "none", n.hidden = !0);
        });
      }
    };
  }
}
function Hn(e, t, n) {
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
var oa = sa;
function aa(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: n, expression: i, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(i), c = {
      rootMargin: ua(r),
      threshold: ca(r)
    }, l = new IntersectionObserver((u) => {
      u.forEach((f) => {
        f.isIntersecting !== (n === "leave") && (a(), r.includes("once") && l.disconnect());
      });
    }, c);
    l.observe(t), o(() => {
      l.disconnect();
    });
  }));
}
function ca(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function la(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function ua(e) {
  const t = "margin", n = "0px 0px 0px 0px", i = e.indexOf(t);
  if (i === -1)
    return n;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(la(e[i + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : n;
}
var fa = aa, vr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], ut = /* @__PURE__ */ vr.join(","), br = typeof Element > "u", me = br ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Jt = !br && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, yr = function(t, n, i) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(ut));
  return n && me.call(t, ut) && r.unshift(t), r = r.filter(i), r;
}, wr = function e(t, n, i) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), c = a.length ? a : o.children, l = e(c, !0, i);
      i.flatten ? r.push.apply(r, l) : r.push({
        scope: o,
        candidates: l
      });
    } else {
      var u = me.call(o, ut);
      u && i.filter(o) && (n || !t.includes(o)) && r.push(o);
      var f = o.shadowRoot || // check for an undisclosed shadow
      typeof i.getShadowRoot == "function" && i.getShadowRoot(o), d = !i.shadowRootFilter || i.shadowRootFilter(o);
      if (f && d) {
        var m = e(f === !0 ? o.children : f.children, !0, i);
        i.flatten ? r.push.apply(r, m) : r.push({
          scope: o,
          candidates: m
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, _r = function(t, n) {
  return t.tabIndex < 0 && (n || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, da = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, xr = function(t) {
  return t.tagName === "INPUT";
}, ha = function(t) {
  return xr(t) && t.type === "hidden";
}, pa = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(i) {
    return i.tagName === "SUMMARY";
  });
  return n;
}, ga = function(t, n) {
  for (var i = 0; i < t.length; i++)
    if (t[i].checked && t[i].form === n)
      return t[i];
}, ma = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || Jt(t), i = function(a) {
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
  var s = ga(r, t.form);
  return !s || s === t;
}, va = function(t) {
  return xr(t) && t.type === "radio";
}, ba = function(t) {
  return va(t) && !ma(t);
}, Vn = function(t) {
  var n = t.getBoundingClientRect(), i = n.width, r = n.height;
  return i === 0 && r === 0;
}, ya = function(t, n) {
  var i = n.displayCheck, r = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = me.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (me.call(o, "details:not([open]) *"))
    return !0;
  var a = Jt(t).host, c = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!i || i === "full") {
    if (typeof r == "function") {
      for (var l = t; t; ) {
        var u = t.parentElement, f = Jt(t);
        if (u && !u.shadowRoot && r(u) === !0)
          return Vn(t);
        t.assignedSlot ? t = t.assignedSlot : !u && f !== t.ownerDocument ? t = f.host : t = u;
      }
      t = l;
    }
    if (c)
      return !t.getClientRects().length;
  } else if (i === "non-zero-area")
    return Vn(t);
  return !1;
}, wa = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var i = 0; i < n.children.length; i++) {
          var r = n.children.item(i);
          if (r.tagName === "LEGEND")
            return me.call(n, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, ft = function(t, n) {
  return !(n.disabled || ha(n) || ya(n, t) || // For a details element with a summary, the summary element gets the focus
  pa(n) || wa(n));
}, Xt = function(t, n) {
  return !(ba(n) || _r(n) < 0 || !ft(t, n));
}, _a = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, xa = function e(t) {
  var n = [], i = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, c = _r(a, o), l = o ? e(r.candidates) : a;
    c === 0 ? o ? n.push.apply(n, l) : n.push(a) : i.push({
      documentOrder: s,
      tabIndex: c,
      item: r,
      isScope: o,
      content: l
    });
  }), i.sort(da).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(n);
}, Ea = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = wr([t], n.includeContainer, {
    filter: Xt.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: _a
  }) : i = yr(t, n.includeContainer, Xt.bind(null, n)), xa(i);
}, Er = function(t, n) {
  n = n || {};
  var i;
  return n.getShadowRoot ? i = wr([t], n.includeContainer, {
    filter: ft.bind(null, n),
    flatten: !0,
    getShadowRoot: n.getShadowRoot
  }) : i = yr(t, n.includeContainer, ft.bind(null, n)), i;
}, et = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return me.call(t, ut) === !1 ? !1 : Xt(n, t);
}, Sa = /* @__PURE__ */ vr.concat("iframe").join(","), rt = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return me.call(t, Sa) === !1 ? !1 : ft(n, t);
};
function Yn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Kn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yn(Object(n), !0).forEach(function(i) {
      Ca(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Yn(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Ca(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var qn = /* @__PURE__ */ function() {
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
}(), Oa = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, Ta = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, Ia = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, Un = function(t) {
  return setTimeout(t, 0);
}, Gn = function(t, n) {
  var i = -1;
  return t.every(function(r, s) {
    return n(r) ? (i = s, !1) : !0;
  }), i;
}, $e = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, i) : t;
}, tt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, Aa = function(t, n) {
  var i = n?.document || document, r = Kn({
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
  }, o, a = function(p, g, _) {
    return p && p[g] !== void 0 ? p[g] : r[_ || g];
  }, c = function(p) {
    return s.containerGroups.findIndex(function(g) {
      var _ = g.container, O = g.tabbableNodes;
      return _.contains(p) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      O.find(function(S) {
        return S === p;
      });
    });
  }, l = function(p) {
    var g = r[p];
    if (typeof g == "function") {
      for (var _ = arguments.length, O = new Array(_ > 1 ? _ - 1 : 0), S = 1; S < _; S++)
        O[S - 1] = arguments[S];
      g = g.apply(void 0, O);
    }
    if (g === !0 && (g = void 0), !g) {
      if (g === void 0 || g === !1)
        return g;
      throw new Error("`".concat(p, "` was specified but was not a node, or did not return a node"));
    }
    var N = g;
    if (typeof g == "string" && (N = i.querySelector(g), !N))
      throw new Error("`".concat(p, "` as selector refers to no known node"));
    return N;
  }, u = function() {
    var p = l("initialFocus");
    if (p === !1)
      return !1;
    if (p === void 0)
      if (c(i.activeElement) >= 0)
        p = i.activeElement;
      else {
        var g = s.tabbableGroups[0], _ = g && g.firstTabbableNode;
        p = _ || l("fallbackFocus");
      }
    if (!p)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return p;
  }, f = function() {
    if (s.containerGroups = s.containers.map(function(p) {
      var g = Ea(p, r.tabbableOptions), _ = Er(p, r.tabbableOptions);
      return {
        container: p,
        tabbableNodes: g,
        focusableNodes: _,
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
        nextTabbableNode: function(S) {
          var N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, k = _.findIndex(function($) {
            return $ === S;
          });
          if (!(k < 0))
            return N ? _.slice(k + 1).find(function($) {
              return et($, r.tabbableOptions);
            }) : _.slice(0, k).reverse().find(function($) {
              return et($, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(p) {
      return p.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !l("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, d = function y(p) {
    if (p !== !1 && p !== i.activeElement) {
      if (!p || !p.focus) {
        y(u());
        return;
      }
      p.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = p, Oa(p) && p.select();
    }
  }, m = function(p) {
    var g = l("setReturnFocus", p);
    return g || (g === !1 ? !1 : p);
  }, b = function(p) {
    var g = tt(p);
    if (!(c(g) >= 0)) {
      if ($e(r.clickOutsideDeactivates, p)) {
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
          returnFocus: r.returnFocusOnDeactivate && !rt(g, r.tabbableOptions)
        });
        return;
      }
      $e(r.allowOutsideClick, p) || p.preventDefault();
    }
  }, E = function(p) {
    var g = tt(p), _ = c(g) >= 0;
    _ || g instanceof Document ? _ && (s.mostRecentlyFocusedNode = g) : (p.stopImmediatePropagation(), d(s.mostRecentlyFocusedNode || u()));
  }, h = function(p) {
    var g = tt(p);
    f();
    var _ = null;
    if (s.tabbableGroups.length > 0) {
      var O = c(g), S = O >= 0 ? s.containerGroups[O] : void 0;
      if (O < 0)
        p.shiftKey ? _ = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : _ = s.tabbableGroups[0].firstTabbableNode;
      else if (p.shiftKey) {
        var N = Gn(s.tabbableGroups, function(z) {
          var D = z.firstTabbableNode;
          return g === D;
        });
        if (N < 0 && (S.container === g || rt(g, r.tabbableOptions) && !et(g, r.tabbableOptions) && !S.nextTabbableNode(g, !1)) && (N = O), N >= 0) {
          var k = N === 0 ? s.tabbableGroups.length - 1 : N - 1, $ = s.tabbableGroups[k];
          _ = $.lastTabbableNode;
        }
      } else {
        var V = Gn(s.tabbableGroups, function(z) {
          var D = z.lastTabbableNode;
          return g === D;
        });
        if (V < 0 && (S.container === g || rt(g, r.tabbableOptions) && !et(g, r.tabbableOptions) && !S.nextTabbableNode(g)) && (V = O), V >= 0) {
          var M = V === s.tabbableGroups.length - 1 ? 0 : V + 1, oe = s.tabbableGroups[M];
          _ = oe.firstTabbableNode;
        }
      }
    } else
      _ = l("fallbackFocus");
    _ && (p.preventDefault(), d(_));
  }, v = function(p) {
    if (Ta(p) && $e(r.escapeDeactivates, p) !== !1) {
      p.preventDefault(), o.deactivate();
      return;
    }
    if (Ia(p)) {
      h(p);
      return;
    }
  }, w = function(p) {
    var g = tt(p);
    c(g) >= 0 || $e(r.clickOutsideDeactivates, p) || $e(r.allowOutsideClick, p) || (p.preventDefault(), p.stopImmediatePropagation());
  }, x = function() {
    if (s.active)
      return qn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? Un(function() {
        d(u());
      }) : d(u()), i.addEventListener("focusin", E, !0), i.addEventListener("mousedown", b, {
        capture: !0,
        passive: !1
      }), i.addEventListener("touchstart", b, {
        capture: !0,
        passive: !1
      }), i.addEventListener("click", w, {
        capture: !0,
        passive: !1
      }), i.addEventListener("keydown", v, {
        capture: !0,
        passive: !1
      }), o;
  }, C = function() {
    if (s.active)
      return i.removeEventListener("focusin", E, !0), i.removeEventListener("mousedown", b, !0), i.removeEventListener("touchstart", b, !0), i.removeEventListener("click", w, !0), i.removeEventListener("keydown", v, !0), o;
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
      var g = a(p, "onActivate"), _ = a(p, "onPostActivate"), O = a(p, "checkCanFocusTrap");
      O || f(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = i.activeElement, g && g();
      var S = function() {
        O && f(), x(), _ && _();
      };
      return O ? (O(s.containers.concat()).then(S, S), this) : (S(), this);
    },
    deactivate: function(p) {
      if (!s.active)
        return this;
      var g = Kn({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, p);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, C(), s.active = !1, s.paused = !1, qn.deactivateTrap(o);
      var _ = a(g, "onDeactivate"), O = a(g, "onPostDeactivate"), S = a(g, "checkCanReturnFocus"), N = a(g, "returnFocus", "returnFocusOnDeactivate");
      _ && _();
      var k = function() {
        Un(function() {
          N && d(m(s.nodeFocusedBeforeActivation)), O && O();
        });
      };
      return N && S ? (S(m(s.nodeFocusedBeforeActivation)).then(k, k), this) : (k(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, C(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, f(), x(), this);
    },
    updateContainerElements: function(p) {
      var g = [].concat(p).filter(Boolean);
      return s.containers = g.map(function(_) {
        return typeof _ == "string" ? i.querySelector(_) : _;
      }), s.active && f(), this;
    }
  }, o.updateContainerElements(t), o;
};
function Na(e) {
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
        return rt(s);
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
        return Array.isArray(r) ? r : Er(r, { displayCheck: "none" });
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
    (i, { expression: r, modifiers: s }, { effect: o, evaluateLater: a, cleanup: c }) => {
      let l = a(r), u = !1, f = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => i
      };
      if (s.includes("noautofocus"))
        f.initialFocus = !1;
      else {
        let h = i.querySelector("[autofocus]");
        h && (f.initialFocus = h);
      }
      let d = Aa(i, f), m = () => {
      }, b = () => {
      };
      const E = () => {
        m(), m = () => {
        }, b(), b = () => {
        }, d.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => l((h) => {
        u !== h && (h && !u && (s.includes("noscroll") && (b = Ra()), s.includes("inert") && (m = Zn(i)), setTimeout(() => {
          d.activate();
        }, 15)), !h && u && E(), u = !!h);
      })), c(E);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (i, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && Zn(i);
    }
  ));
}
function Zn(e) {
  let t = [];
  return Sr(e, (n) => {
    let i = n.hasAttribute("aria-hidden");
    n.setAttribute("aria-hidden", "true"), t.push(() => i || n.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Sr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((n) => {
    n.isSameNode(e) ? Sr(e.parentNode, t) : t(n);
  });
}
function Ra() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, n = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${n}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var La = Na;
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
function ka(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function $a(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
  }
}
function Fa(e, t, n) {
  return t && $a(e.prototype, t), e;
}
var Ma = Object.defineProperty, Z = function(e, t) {
  return Ma(e, "name", { value: t, configurable: !0 });
}, Da = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Pa = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, za = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ba = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, ja = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Wa = Z(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), Fe = Z(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), T = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, ee = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, Jn = { OUTLINE: "outline", FILLED: "filled" }, kt = { FADE: "fade", SLIDE: "slide" }, Me = { CLOSE: Fe(Da), SUCCESS: Fe(Ba), ERROR: Fe(Pa), WARNING: Fe(ja), INFO: Fe(za) }, Xn = Z(function(e) {
  e.wrapper.classList.add(T.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(T.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Qn = Z(function(e) {
  e.wrapper.classList.remove(T.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Ha = Z(function(e) {
  e.wrapper.classList.add(T.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(T.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Va = Z(function(e) {
  e.wrapper.classList.remove(T.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Cr = function() {
  function e(t) {
    var n = this;
    ka(this, e), this.notifyOut = Z(function(z) {
      z(n);
    }, "notifyOut");
    var i = t.notificationsGap, r = i === void 0 ? 20 : i, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, c = a === void 0 ? "success" : a, l = t.effect, u = l === void 0 ? kt.FADE : l, f = t.type, d = f === void 0 ? "outline" : f, m = t.title, b = t.text, E = t.showIcon, h = E === void 0 ? !0 : E, v = t.customIcon, w = v === void 0 ? "" : v, x = t.customClass, C = x === void 0 ? "" : x, y = t.speed, p = y === void 0 ? 500 : y, g = t.showCloseButton, _ = g === void 0 ? !0 : g, O = t.autoclose, S = O === void 0 ? !0 : O, N = t.autotimeout, k = N === void 0 ? 3e3 : N, $ = t.position, V = $ === void 0 ? "right top" : $, M = t.customWrapper, oe = M === void 0 ? "" : M;
    if (this.customWrapper = oe, this.status = c, this.title = m, this.text = b, this.showIcon = h, this.customIcon = w, this.customClass = C, this.speed = p, this.effect = u, this.showCloseButton = _, this.autoclose = S, this.autotimeout = k, this.notificationsGap = r, this.notificationsPadding = o, this.type = d, this.position = V, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Fa(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var n = document.querySelector(".".concat(T.CONTAINER));
    n ? this.container = n : (this.container = document.createElement("div"), this.container.classList.add(T.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](T.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](T.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](T.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](T.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](T.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](T.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](T.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var n = this, i = document.createElement("div");
    i.classList.add(T.NOTIFY_CLOSE), i.innerHTML = Me.CLOSE, this.wrapper.appendChild(i), i.addEventListener("click", function() {
      n.close();
    });
  } }, { key: "setWrapper", value: function() {
    var n = this;
    switch (this.customWrapper ? this.wrapper = Wa(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(T.NOTIFY), this.type) {
      case Jn.OUTLINE:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
        break;
      case Jn.FILLED:
        this.wrapper.classList.add(T.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(T.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case ee.SUCCESS:
        this.wrapper.classList.add(T.NOTIFY_SUCCESS);
        break;
      case ee.ERROR:
        this.wrapper.classList.add(T.NOTIFY_ERROR);
        break;
      case ee.WARNING:
        this.wrapper.classList.add(T.NOTIFY_WARNING);
        break;
      case ee.INFO:
        this.wrapper.classList.add(T.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(T.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(i) {
      n.wrapper.classList.add(i);
    });
  } }, { key: "setContent", value: function() {
    var n = document.createElement("div");
    n.classList.add(T.NOTIFY_CONTENT);
    var i, r;
    this.title && (i = document.createElement("div"), i.classList.add(T.NOTIFY_TITLE), i.textContent = this.title.trim(), this.showCloseButton || (i.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(T.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(n), this.title && n.appendChild(i), this.text && n.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var n = Z(function(r) {
      switch (r) {
        case ee.SUCCESS:
          return Me.SUCCESS;
        case ee.ERROR:
          return Me.ERROR;
        case ee.WARNING:
          return Me.WARNING;
        case ee.INFO:
          return Me.INFO;
      }
    }, "computedIcon"), i = document.createElement("div");
    i.classList.add(T.NOTIFY_ICON), i.innerHTML = this.customIcon || n(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(i);
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
      case kt.FADE:
        this.selectedNotifyInEffect = Xn, this.selectedNotifyOutEffect = Qn;
        break;
      case kt.SLIDE:
        this.selectedNotifyInEffect = Ha, this.selectedNotifyOutEffect = Va;
        break;
      default:
        this.selectedNotifyInEffect = Xn, this.selectedNotifyOutEffect = Qn;
    }
  } }]), e;
}();
Z(Cr, "Notify");
var Or = Cr;
globalThis.Notify = Or;
const Tr = ["success", "error", "warning", "info"], Ir = [
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
], Ar = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function De(e = {}) {
  const t = {
    ...Ar,
    ...e
  };
  Tr.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), Ir.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Or(t);
}
const Ya = {
  custom: De,
  success(e, t = "Success", n = {}) {
    De({
      status: "success",
      title: t,
      text: e,
      ...n
    });
  },
  error(e, t = "Error", n = {}) {
    De({
      status: "error",
      title: t,
      text: e,
      ...n
    });
  },
  warning(e, t = "Warning", n = {}) {
    De({
      status: "warning",
      title: t,
      text: e,
      ...n
    });
  },
  info(e, t = "Info", n = {}) {
    De({
      status: "info",
      title: t,
      text: e,
      ...n
    });
  },
  setDefaults(e = {}) {
    Object.assign(Ar, e);
  },
  get allowedStatuses() {
    return [...Tr];
  },
  get allowedPositions() {
    return [...Ir];
  }
}, Qt = function() {
}, He = {}, dt = {}, Ve = {};
function Ka(e, t) {
  e = Array.isArray(e) ? e : [e];
  const n = [];
  let i = e.length, r = i, s, o, a, c;
  for (s = function(l, u) {
    u.length && n.push(l), r--, r || t(n);
  }; i--; ) {
    if (o = e[i], a = dt[o], a) {
      s(o, a);
      continue;
    }
    c = Ve[o] = Ve[o] || [], c.push(s);
  }
}
function Nr(e, t) {
  if (!e) return;
  const n = Ve[e];
  if (dt[e] = t, !!n)
    for (; n.length; )
      n[0](e, t), n.splice(0, 1);
}
function en(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || Qt)(t) : (e.success || Qt)(e);
}
function qa(e, t, n, i, r, s, o, a) {
  let c = e.type[0];
  if (a)
    try {
      n.sheet.cssText.length || (c = "e");
    } catch (l) {
      l.code !== 18 && (c = "e");
    }
  if (c === "e") {
    if (s += 1, s < o)
      return Rr(t, i, r, s);
  } else if (n.rel === "preload" && n.as === "style") {
    n.rel = "stylesheet";
    return;
  }
  i(t, c, e.defaultPrevented);
}
function Rr(e, t, n, i) {
  const r = document, s = n.async, o = (n.numRetries || 0) + 1, a = n.before || Qt, c = e.replace(/[\?|#].*$/, ""), l = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, f, d;
  if (i = i || 0, /(^css!|\.css$)/.test(c))
    d = r.createElement("link"), d.rel = "stylesheet", d.href = l, u = "hideFocus" in d, u && d.relList && (u = 0, d.rel = "preload", d.as = "style"), n.inlineStyleNonce && d.setAttribute("nonce", n.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(c))
    d = r.createElement("img"), d.src = l;
  else if (d = r.createElement("script"), d.src = l, d.async = s === void 0 ? !0 : s, n.inlineScriptNonce && d.setAttribute("nonce", n.inlineScriptNonce), f = "noModule" in d, /^module!/.test(c)) {
    if (!f) return t(e, "l");
    d.type = "module";
  } else if (/^nomodule!/.test(c) && f)
    return t(e, "l");
  const m = function(b) {
    qa(b, e, d, t, n, i, o, u);
  };
  d.addEventListener("load", m, { once: !0 }), d.addEventListener("error", m, { once: !0 }), a(e, d) !== !1 && r.head.appendChild(d);
}
function Ua(e, t, n) {
  e = Array.isArray(e) ? e : [e];
  let i = e.length, r = [];
  function s(o, a, c) {
    if (a === "e" && r.push(o), a === "b")
      if (c) r.push(o);
      else return;
    i--, i || t(r);
  }
  for (let o = 0; o < e.length; o++)
    Rr(e[o], s, n);
}
function te(e, t, n) {
  let i, r;
  if (t && typeof t == "string" && t.trim && (i = t.trim()), r = (i ? n : t) || {}, i) {
    if (i in He)
      throw "LoadJS";
    He[i] = !0;
  }
  function s(o, a) {
    Ua(e, function(c) {
      en(r, c), o && en({ success: o, error: a }, c), Nr(i, c);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
te.ready = function(t, n) {
  return Ka(t, function(i) {
    en(n, i);
  }), te;
};
te.done = function(t) {
  Nr(t, []);
};
te.reset = function() {
  Object.keys(He).forEach((t) => delete He[t]), Object.keys(dt).forEach((t) => delete dt[t]), Object.keys(Ve).forEach((t) => delete Ve[t]);
};
te.isDefined = function(t) {
  return t in He;
};
function Ga(e) {
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
function Za(e) {
  e.data("rzAccordionSection", () => ({
    open: !1,
    sectionId: "",
    expandedClass: "",
    init() {
      this.open = this.$el.dataset.isOpen === "true", this.sectionId = this.$el.dataset.sectionId, this.expandedClass = this.$el.dataset.expandedClass;
      const t = this;
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (n, i) => {
        n !== t.sectionId && !t.allowMultiple && (t.open = !1);
      }) : console.warn("rzAccordionSection: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
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
function Ja(e) {
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
function Xa(e) {
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
      return [this.screenSize === "" ? "text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong" : "opacity-60"];
    },
    // Get CSS classes for tablet screen button styling
    getTabletScreenCss() {
      return [this.screenSize === "max-w-2xl" ? "text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong" : "opacity-60"];
    },
    // Get CSS classes for phone screen button styling
    getPhoneScreenCss() {
      return [this.screenSize === "max-w-sm" ? "text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong" : "opacity-60"];
    }
  }));
}
function Qa(e) {
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
function ec(e, t) {
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
      return [this.copied ? "focus-visible:outline-success" : "focus-visible:outline-on-surface-dark"];
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
function tc(e, t) {
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
const tn = Math.min, we = Math.max, ht = Math.round, q = (e) => ({
  x: e,
  y: e
}), nc = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, ic = {
  start: "end",
  end: "start"
};
function ei(e, t, n) {
  return we(e, tn(t, n));
}
function Et(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ve(e) {
  return e.split("-")[0];
}
function St(e) {
  return e.split("-")[1];
}
function Lr(e) {
  return e === "x" ? "y" : "x";
}
function kr(e) {
  return e === "y" ? "height" : "width";
}
function he(e) {
  return ["top", "bottom"].includes(ve(e)) ? "y" : "x";
}
function $r(e) {
  return Lr(he(e));
}
function rc(e, t, n) {
  n === void 0 && (n = !1);
  const i = St(e), r = $r(e), s = kr(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = pt(o)), [o, pt(o)];
}
function sc(e) {
  const t = pt(e);
  return [nn(e), t, nn(t)];
}
function nn(e) {
  return e.replace(/start|end/g, (t) => ic[t]);
}
function oc(e, t, n) {
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
function ac(e, t, n, i) {
  const r = St(e);
  let s = oc(ve(e), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(nn)))), s;
}
function pt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => nc[t]);
}
function cc(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function lc(e) {
  return typeof e != "number" ? cc(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function gt(e) {
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
function ti(e, t, n) {
  let {
    reference: i,
    floating: r
  } = e;
  const s = he(t), o = $r(t), a = kr(o), c = ve(t), l = s === "y", u = i.x + i.width / 2 - r.width / 2, f = i.y + i.height / 2 - r.height / 2, d = i[a] / 2 - r[a] / 2;
  let m;
  switch (c) {
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
        y: f
      };
      break;
    case "left":
      m = {
        x: i.x - r.width,
        y: f
      };
      break;
    default:
      m = {
        x: i.x,
        y: i.y
      };
  }
  switch (St(t)) {
    case "start":
      m[o] -= d * (n && l ? -1 : 1);
      break;
    case "end":
      m[o] += d * (n && l ? -1 : 1);
      break;
  }
  return m;
}
const uc = async (e, t, n) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), c = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let l = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: u,
    y: f
  } = ti(l, i, c), d = i, m = {}, b = 0;
  for (let E = 0; E < a.length; E++) {
    const {
      name: h,
      fn: v
    } = a[E], {
      x: w,
      y: x,
      data: C,
      reset: y
    } = await v({
      x: u,
      y: f,
      initialPlacement: i,
      placement: d,
      strategy: r,
      middlewareData: m,
      rects: l,
      platform: o,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = w ?? u, f = x ?? f, m = {
      ...m,
      [h]: {
        ...m[h],
        ...C
      }
    }, y && b <= 50 && (b++, typeof y == "object" && (y.placement && (d = y.placement), y.rects && (l = y.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : y.rects), {
      x: u,
      y: f
    } = ti(l, d, c)), E = -1);
  }
  return {
    x: u,
    y: f,
    placement: d,
    strategy: r,
    middlewareData: m
  };
};
async function Fr(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: i,
    y: r,
    platform: s,
    rects: o,
    elements: a,
    strategy: c
  } = e, {
    boundary: l = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: f = "floating",
    altBoundary: d = !1,
    padding: m = 0
  } = Et(t, e), b = lc(m), h = a[d ? f === "floating" ? "reference" : "floating" : f], v = gt(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(h))) == null || n ? h : h.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: l,
    rootBoundary: u,
    strategy: c
  })), w = f === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), C = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, y = gt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: x,
    strategy: c
  }) : w);
  return {
    top: (v.top - y.top + b.top) / C.y,
    bottom: (y.bottom - v.bottom + b.bottom) / C.y,
    left: (v.left - y.left + b.left) / C.x,
    right: (y.right - v.right + b.right) / C.x
  };
}
const fc = function(e) {
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
        platform: c,
        elements: l
      } = t, {
        mainAxis: u = !0,
        crossAxis: f = !0,
        fallbackPlacements: d,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: b = "none",
        flipAlignment: E = !0,
        ...h
      } = Et(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const v = ve(r), w = he(a), x = ve(a) === a, C = await (c.isRTL == null ? void 0 : c.isRTL(l.floating)), y = d || (x || !E ? [pt(a)] : sc(a)), p = b !== "none";
      !d && p && y.push(...ac(a, E, b, C));
      const g = [a, ...y], _ = await Fr(t, h), O = [];
      let S = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && O.push(_[v]), f) {
        const M = rc(r, o, C);
        O.push(_[M[0]], _[M[1]]);
      }
      if (S = [...S, {
        placement: r,
        overflows: O
      }], !O.every((M) => M <= 0)) {
        var N, k;
        const M = (((N = s.flip) == null ? void 0 : N.index) || 0) + 1, oe = g[M];
        if (oe) {
          var $;
          const D = f === "alignment" ? w !== he(oe) : !1, Y = (($ = S[0]) == null ? void 0 : $.overflows[0]) > 0;
          if (!D || Y)
            return {
              data: {
                index: M,
                overflows: S
              },
              reset: {
                placement: oe
              }
            };
        }
        let z = (k = S.filter((D) => D.overflows[0] <= 0).sort((D, Y) => D.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : k.placement;
        if (!z)
          switch (m) {
            case "bestFit": {
              var V;
              const D = (V = S.filter((Y) => {
                if (p) {
                  const X = he(Y.placement);
                  return X === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  X === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((X) => X > 0).reduce((X, Yr) => X + Yr, 0)]).sort((Y, X) => Y[1] - X[1])[0]) == null ? void 0 : V[0];
              D && (z = D);
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
async function dc(e, t) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = e, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = ve(n), a = St(n), c = he(n) === "y", l = ["left", "top"].includes(o) ? -1 : 1, u = s && c ? -1 : 1, f = Et(t, e);
  let {
    mainAxis: d,
    crossAxis: m,
    alignmentAxis: b
  } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: f.mainAxis || 0,
    crossAxis: f.crossAxis || 0,
    alignmentAxis: f.alignmentAxis
  };
  return a && typeof b == "number" && (m = a === "end" ? b * -1 : b), c ? {
    x: m * u,
    y: d * l
  } : {
    x: d * l,
    y: m * u
  };
}
const hc = function(e) {
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
      } = t, c = await dc(t, e);
      return o === ((n = a.offset) == null ? void 0 : n.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: r + c.x,
        y: s + c.y,
        data: {
          ...c,
          placement: o
        }
      };
    }
  };
}, pc = function(e) {
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
          fn: (h) => {
            let {
              x: v,
              y: w
            } = h;
            return {
              x: v,
              y: w
            };
          }
        },
        ...c
      } = Et(e, t), l = {
        x: n,
        y: i
      }, u = await Fr(t, c), f = he(ve(r)), d = Lr(f);
      let m = l[d], b = l[f];
      if (s) {
        const h = d === "y" ? "top" : "left", v = d === "y" ? "bottom" : "right", w = m + u[h], x = m - u[v];
        m = ei(w, m, x);
      }
      if (o) {
        const h = f === "y" ? "top" : "left", v = f === "y" ? "bottom" : "right", w = b + u[h], x = b - u[v];
        b = ei(w, b, x);
      }
      const E = a.fn({
        ...t,
        [d]: m,
        [f]: b
      });
      return {
        ...E,
        data: {
          x: E.x - n,
          y: E.y - i,
          enabled: {
            [d]: s,
            [f]: o
          }
        }
      };
    }
  };
};
function Ct() {
  return typeof window < "u";
}
function Ne(e) {
  return Mr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function F(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function J(e) {
  var t;
  return (t = (Mr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Mr(e) {
  return Ct() ? e instanceof Node || e instanceof F(e).Node : !1;
}
function j(e) {
  return Ct() ? e instanceof Element || e instanceof F(e).Element : !1;
}
function U(e) {
  return Ct() ? e instanceof HTMLElement || e instanceof F(e).HTMLElement : !1;
}
function ni(e) {
  return !Ct() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof F(e).ShadowRoot;
}
function Ue(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: i,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) && !["inline", "contents"].includes(r);
}
function gc(e) {
  return ["table", "td", "th"].includes(Ne(e));
}
function Ot(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function On(e) {
  const t = Tn(), n = j(e) ? W(e) : e;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function mc(e) {
  let t = re(e);
  for (; U(t) && !Ee(t); ) {
    if (On(t))
      return t;
    if (Ot(t))
      return null;
    t = re(t);
  }
  return null;
}
function Tn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ee(e) {
  return ["html", "body", "#document"].includes(Ne(e));
}
function W(e) {
  return F(e).getComputedStyle(e);
}
function Tt(e) {
  return j(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function re(e) {
  if (Ne(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    ni(e) && e.host || // Fallback.
    J(e)
  );
  return ni(t) ? t.host : t;
}
function Dr(e) {
  const t = re(e);
  return Ee(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : U(t) && Ue(t) ? t : Dr(t);
}
function Pr(e, t, n) {
  var i;
  t === void 0 && (t = []);
  const r = Dr(e), s = r === ((i = e.ownerDocument) == null ? void 0 : i.body), o = F(r);
  return s ? (rn(o), t.concat(o, o.visualViewport || [], Ue(r) ? r : [], [])) : t.concat(r, Pr(r, []));
}
function rn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function zr(e) {
  const t = W(e);
  let n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const r = U(e), s = r ? e.offsetWidth : n, o = r ? e.offsetHeight : i, a = ht(n) !== s || ht(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function Br(e) {
  return j(e) ? e : e.contextElement;
}
function _e(e) {
  const t = Br(e);
  if (!U(t))
    return q(1);
  const n = t.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = zr(t);
  let o = (s ? ht(n.width) : n.width) / i, a = (s ? ht(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const vc = /* @__PURE__ */ q(0);
function jr(e) {
  const t = F(e);
  return !Tn() || !t.visualViewport ? vc : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function bc(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== F(e) ? !1 : t;
}
function Ye(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), s = Br(e);
  let o = q(1);
  t && (i ? j(i) && (o = _e(i)) : o = _e(e));
  const a = bc(s, n, i) ? jr(s) : q(0);
  let c = (r.left + a.x) / o.x, l = (r.top + a.y) / o.y, u = r.width / o.x, f = r.height / o.y;
  if (s) {
    const d = F(s), m = i && j(i) ? F(i) : i;
    let b = d, E = rn(b);
    for (; E && i && m !== b; ) {
      const h = _e(E), v = E.getBoundingClientRect(), w = W(E), x = v.left + (E.clientLeft + parseFloat(w.paddingLeft)) * h.x, C = v.top + (E.clientTop + parseFloat(w.paddingTop)) * h.y;
      c *= h.x, l *= h.y, u *= h.x, f *= h.y, c += x, l += C, b = F(E), E = rn(b);
    }
  }
  return gt({
    width: u,
    height: f,
    x: c,
    y: l
  });
}
function In(e, t) {
  const n = Tt(e).scrollLeft;
  return t ? t.left + n : Ye(J(e)).left + n;
}
function Wr(e, t, n) {
  n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), r = i.left + t.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    In(e, i)
  )), s = i.top + t.scrollTop;
  return {
    x: r,
    y: s
  };
}
function yc(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: i,
    strategy: r
  } = e;
  const s = r === "fixed", o = J(i), a = t ? Ot(t.floating) : !1;
  if (i === o || a && s)
    return n;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = q(1);
  const u = q(0), f = U(i);
  if ((f || !f && !s) && ((Ne(i) !== "body" || Ue(o)) && (c = Tt(i)), U(i))) {
    const m = Ye(i);
    l = _e(i), u.x = m.x + i.clientLeft, u.y = m.y + i.clientTop;
  }
  const d = o && !f && !s ? Wr(o, c, !0) : q(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - c.scrollLeft * l.x + u.x + d.x,
    y: n.y * l.y - c.scrollTop * l.y + u.y + d.y
  };
}
function wc(e) {
  return Array.from(e.getClientRects());
}
function _c(e) {
  const t = J(e), n = Tt(e), i = e.ownerDocument.body, r = we(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), s = we(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + In(e);
  const a = -n.scrollTop;
  return W(i).direction === "rtl" && (o += we(t.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
function xc(e, t) {
  const n = F(e), i = J(e), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, c = 0;
  if (r) {
    s = r.width, o = r.height;
    const l = Tn();
    (!l || l && t === "fixed") && (a = r.offsetLeft, c = r.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: a,
    y: c
  };
}
function Ec(e, t) {
  const n = Ye(e, !0, t === "fixed"), i = n.top + e.clientTop, r = n.left + e.clientLeft, s = U(e) ? _e(e) : q(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, c = r * s.x, l = i * s.y;
  return {
    width: o,
    height: a,
    x: c,
    y: l
  };
}
function ii(e, t, n) {
  let i;
  if (t === "viewport")
    i = xc(e, n);
  else if (t === "document")
    i = _c(J(e));
  else if (j(t))
    i = Ec(t, n);
  else {
    const r = jr(e);
    i = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return gt(i);
}
function Hr(e, t) {
  const n = re(e);
  return n === t || !j(n) || Ee(n) ? !1 : W(n).position === "fixed" || Hr(n, t);
}
function Sc(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let i = Pr(e, []).filter((a) => j(a) && Ne(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? re(e) : e;
  for (; j(o) && !Ee(o); ) {
    const a = W(o), c = On(o);
    !c && a.position === "fixed" && (r = null), (s ? !c && !r : !c && a.position === "static" && !!r && ["absolute", "fixed"].includes(r.position) || Ue(o) && !c && Hr(e, o)) ? i = i.filter((u) => u !== o) : r = a, o = re(o);
  }
  return t.set(e, i), i;
}
function Cc(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = e;
  const o = [...n === "clippingAncestors" ? Ot(t) ? [] : Sc(t, this._c) : [].concat(n), i], a = o[0], c = o.reduce((l, u) => {
    const f = ii(t, u, r);
    return l.top = we(f.top, l.top), l.right = tn(f.right, l.right), l.bottom = tn(f.bottom, l.bottom), l.left = we(f.left, l.left), l;
  }, ii(t, a, r));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function Oc(e) {
  const {
    width: t,
    height: n
  } = zr(e);
  return {
    width: t,
    height: n
  };
}
function Tc(e, t, n) {
  const i = U(t), r = J(t), s = n === "fixed", o = Ye(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = q(0);
  function l() {
    c.x = In(r);
  }
  if (i || !i && !s)
    if ((Ne(t) !== "body" || Ue(r)) && (a = Tt(t)), i) {
      const m = Ye(t, !0, s, t);
      c.x = m.x + t.clientLeft, c.y = m.y + t.clientTop;
    } else r && l();
  s && !i && r && l();
  const u = r && !i && !s ? Wr(r, a) : q(0), f = o.left + a.scrollLeft - c.x - u.x, d = o.top + a.scrollTop - c.y - u.y;
  return {
    x: f,
    y: d,
    width: o.width,
    height: o.height
  };
}
function $t(e) {
  return W(e).position === "static";
}
function ri(e, t) {
  if (!U(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return J(e) === n && (n = n.ownerDocument.body), n;
}
function Vr(e, t) {
  const n = F(e);
  if (Ot(e))
    return n;
  if (!U(e)) {
    let r = re(e);
    for (; r && !Ee(r); ) {
      if (j(r) && !$t(r))
        return r;
      r = re(r);
    }
    return n;
  }
  let i = ri(e, t);
  for (; i && gc(i) && $t(i); )
    i = ri(i, t);
  return i && Ee(i) && $t(i) && !On(i) ? n : i || mc(e) || n;
}
const Ic = async function(e) {
  const t = this.getOffsetParent || Vr, n = this.getDimensions, i = await n(e.floating);
  return {
    reference: Tc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Ac(e) {
  return W(e).direction === "rtl";
}
const Nc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: yc,
  getDocumentElement: J,
  getClippingRect: Cc,
  getOffsetParent: Vr,
  getElementRects: Ic,
  getClientRects: wc,
  getDimensions: Oc,
  getScale: _e,
  isElement: j,
  isRTL: Ac
}, Rc = hc, Lc = pc, kc = fc, $c = (e, t, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Nc,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return uc(e, t, {
    ...r,
    platform: s
  });
};
function Fc(e) {
  e.data("rzDropdown", () => ({
    dropdownEl: null,
    triggerEl: null,
    floatingEl: null,
    anchor: "",
    offset: 6,
    dropdownOpen: !1,
    openedWithKeyboard: !1,
    init() {
      this.dropdownEl = this.$el, this.offset = this.$el.dataset.offset || 6, this.anchor = (this.$el.dataset.anchor || "bottom").toLowerCase(), this.triggerEl = this.dropdownEl.querySelector("[data-trigger]"), this.floatingEl = this.dropdownEl.querySelector("[data-floating]"), this.anchorCss = this.getAnchorCss();
    },
    toggleDropdown() {
      this.anchorCss = this.getAnchorCss(), $c(this.triggerEl, this.floatingEl, {
        placement: this.anchor,
        middleware: [Rc(this.offset), kc(), Lc()]
      }).then(({ x: t, y: n }) => {
        Object.assign(this.floatingEl.style, {
          left: `${t}px`,
          top: `${n}px`
        }), this.dropdownOpen = !this.dropdownOpen;
      });
    },
    openDropdown() {
      this.anchorCss = this.getAnchorCss(), this.dropdownOpen = !0, this.openedWithKeyboard = !1;
    },
    openWithKeyboard() {
      this.anchorCss = this.getAnchorCss(), this.dropdownOpen = !0, this.openedWithKeyboard = !0, this.focusWrapNext();
    },
    closeDropdown() {
      this.dropdownOpen = !1, this.openedWithKeyboard = !1;
    },
    focusWrapNext() {
      this.$focus.wrap().next();
    },
    focusWrapPrevious() {
      this.$focus.wrap().previous();
    },
    // Computes the Tailwind CSS classes for the dropdown's anchor based on its data attribute
    getAnchorCss() {
      return "";
    }
  }));
}
function Mc(e) {
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
function Dc(e) {
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
function Pc(e) {
  e.data("rzEmpty", () => {
  });
}
function zc(e) {
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
function Bc(e, t) {
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
function jc(e) {
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
function Wc(e) {
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
function Hc(e) {
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
      return t && n && t.clientWidth > n.clientWidth ? "text-on-surface dark:text-on-surface-dark" : "";
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
function Vc(e) {
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
function Yc(e) {
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
function Kc(e) {
  e.data("rzSidebar", () => ({
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
function qc(e) {
  e.data("rzSidebarLinkItem", () => ({
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
      const t = this.$el.closest('[x-data^="rzSidebar"]');
      if (t) {
        let n = e.$data(t);
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
async function Uc(e) {
  e = [...e].sort();
  const t = e.join("|"), i = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function st(e, t, n) {
  Uc(e).then((i) => {
    te.isDefined(i) || te(
      e,
      i,
      {
        async: !1,
        inlineScriptNonce: n,
        inlineStyleNonce: n
      }
    ), te.ready([i], t);
  });
}
function Gc(e) {
  Ga(e), Za(e), Ja(e), Xa(e), Qa(e), ec(e, st), tc(e, st), Fc(e), Mc(e), Dc(e), Pc(e), zc(e), Bc(e, st), jc(e), Wc(e), Hc(e), Vc(e), Yc(e), Kc(e), qc(e);
}
function Zc(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "$data helper: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and initialized globally before use."
    );
    return;
  }
  let t = null, n = null;
  if (typeof e == "string") {
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    if (n = e, t = document.getElementById(n), !t) {
      console.warn(`Rizzy.$data: Rizzy component with ID "${n}" not found in the DOM.`);
      return;
    }
  } else if (e instanceof Element) {
    if (t = e, !t.id) {
      console.warn("Rizzy.$data: Provided element does not have an ID attribute, which is required for locating the data-alpine-root.");
      return;
    }
    n = t.id;
  } else {
    console.warn("Rizzy.$data: Invalid input provided. Expected a non-empty string ID or an Element object.");
    return;
  }
  const i = `[data-alpine-root="${n}"]`;
  let r = null;
  if (t.matches(i) ? r = t : r = t.querySelector(i), !r) {
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
ye.plugin(oa);
ye.plugin(fa);
ye.plugin(La);
Gc(ye);
const Jc = {
  Alpine: ye,
  require: st,
  toast: Ya,
  $data: Zc
};
window.Alpine = ye;
window.Rizzy = { ...window.Rizzy || {}, ...Jc };
ye.start();
export {
  Jc as default
};
