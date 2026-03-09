var yi = !1, bi = !1, De = [], wi = -1, Ui = !1;
function ua(t) {
  fa(t);
}
function ha() {
  Ui = !0;
}
function da() {
  Ui = !1, cn();
}
function fa(t) {
  De.includes(t) || De.push(t), cn();
}
function pa(t) {
  let e = De.indexOf(t);
  e !== -1 && e > wi && De.splice(e, 1);
}
function cn() {
  if (!bi && !yi) {
    if (Ui)
      return;
    yi = !0, queueMicrotask(ma);
  }
}
function ma() {
  yi = !1, bi = !0;
  for (let t = 0; t < De.length; t++)
    De[t](), wi = t;
  De.length = 0, wi = -1, bi = !1;
}
var nt, Ge, st, un, xi = !0;
function ga(t) {
  xi = !1, t(), xi = !0;
}
function va(t) {
  nt = t.reactive, st = t.release, Ge = (e) => t.effect(e, { scheduler: (i) => {
    xi ? ua(i) : i();
  } }), un = t.raw;
}
function wr(t) {
  Ge = t;
}
function ya(t) {
  let e = () => {
  };
  return [(r) => {
    let n = Ge(r);
    return t._x_effects || (t._x_effects = /* @__PURE__ */ new Set(), t._x_runEffects = () => {
      t._x_effects.forEach((s) => s());
    }), t._x_effects.add(n), e = () => {
      n !== void 0 && (t._x_effects.delete(n), st(n));
    }, n;
  }, () => {
    e();
  }];
}
function hn(t, e) {
  let i = !0, r, n = Ge(() => {
    let s = t();
    if (JSON.stringify(s), !i && (typeof s == "object" || s !== r)) {
      let a = r;
      queueMicrotask(() => {
        e(s, a);
      });
    }
    r = s, i = !1;
  });
  return () => st(n);
}
async function ba(t) {
  ha();
  try {
    await t(), await Promise.resolve();
  } finally {
    da();
  }
}
var dn = [], fn = [], pn = [];
function wa(t) {
  pn.push(t);
}
function Bi(t, e) {
  typeof e == "function" ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, fn.push(e));
}
function mn(t) {
  dn.push(t);
}
function gn(t, e, i) {
  t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(i);
}
function vn(t, e) {
  t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach(([i, r]) => {
    (e === void 0 || e.includes(i)) && (r.forEach((n) => n()), delete t._x_attributeCleanups[i]);
  });
}
function xa(t) {
  for (t._x_effects?.forEach(pa); t._x_cleanups?.length; )
    t._x_cleanups.pop()();
}
var Hi = new MutationObserver(Yi), Wi = !1;
function qi() {
  Hi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Wi = !0;
}
function yn() {
  Ia(), Hi.disconnect(), Wi = !1;
}
var ut = [];
function Ia() {
  let t = Hi.takeRecords();
  ut.push(() => t.length > 0 && Yi(t));
  let e = ut.length;
  queueMicrotask(() => {
    if (ut.length === e)
      for (; ut.length > 0; )
        ut.shift()();
  });
}
function j(t) {
  if (!Wi)
    return t();
  yn();
  let e = t();
  return qi(), e;
}
var ji = !1, Wt = [];
function Ea() {
  ji = !0;
}
function Ta() {
  ji = !1, Yi(Wt), Wt = [];
}
function Yi(t) {
  if (ji) {
    Wt = Wt.concat(t);
    return;
  }
  let e = [], i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (let s = 0; s < t.length; s++)
    if (!t[s].target._x_ignoreMutationObserver && (t[s].type === "childList" && (t[s].removedNodes.forEach((a) => {
      a.nodeType === 1 && a._x_marker && i.add(a);
    }), t[s].addedNodes.forEach((a) => {
      if (a.nodeType === 1) {
        if (i.has(a)) {
          i.delete(a);
          return;
        }
        a._x_marker || e.push(a);
      }
    })), t[s].type === "attributes")) {
      let a = t[s].target, o = t[s].attributeName, l = t[s].oldValue, f = () => {
        r.has(a) || r.set(a, []), r.get(a).push({ name: o, value: a.getAttribute(o) });
      }, m = () => {
        n.has(a) || n.set(a, []), n.get(a).push(o);
      };
      a.hasAttribute(o) && l === null ? f() : a.hasAttribute(o) ? (m(), f()) : m();
    }
  n.forEach((s, a) => {
    vn(a, s);
  }), r.forEach((s, a) => {
    dn.forEach((o) => o(a, s));
  });
  for (let s of i)
    e.some((a) => a.contains(s)) || fn.forEach((a) => a(s));
  for (let s of e)
    s.isConnected && pn.forEach((a) => a(s));
  e = null, i = null, r = null, n = null;
}
function bn(t) {
  return Se(Ve(t));
}
function St(t, e, i) {
  return t._x_dataStack = [e, ...Ve(i || t)], () => {
    t._x_dataStack = t._x_dataStack.filter((r) => r !== e);
  };
}
function Ve(t) {
  return t._x_dataStack ? t._x_dataStack : typeof ShadowRoot == "function" && t instanceof ShadowRoot ? Ve(t.host) : t.parentNode ? Ve(t.parentNode) : [];
}
function Se(t) {
  return new Proxy({ objects: t }, _a);
}
var _a = {
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
    return e == "toJSON" ? Sa : Reflect.get(
      t.find(
        (r) => Reflect.has(r, e)
      ) || {},
      e,
      i
    );
  },
  set({ objects: t }, e, i, r) {
    const n = t.find(
      (a) => Object.prototype.hasOwnProperty.call(a, e)
    ) || t[t.length - 1], s = Object.getOwnPropertyDescriptor(n, e);
    return s?.set && s?.get ? s.set.call(r, i) || !0 : Reflect.set(n, e, i);
  }
};
function Sa() {
  return Reflect.ownKeys(this).reduce((e, i) => (e[i] = Reflect.get(this, i), e), {});
}
function Ki(t) {
  let e = (r) => typeof r == "object" && !Array.isArray(r) && r !== null, i = (r, n = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(r)).forEach(([s, { value: a, enumerable: o }]) => {
      if (o === !1 || a === void 0 || typeof a == "object" && a !== null && a.__v_skip)
        return;
      let l = n === "" ? s : `${n}.${s}`;
      typeof a == "object" && a !== null && a._x_interceptor ? r[s] = a.initialize(t, l, s) : e(a) && a !== r && !(a instanceof Element) && i(a, l);
    });
  };
  return i(t);
}
function wn(t, e = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, n, s) {
      return t(this.initialValue, () => Ca(r, n), (a) => Ii(r, n, a), n, s);
    }
  };
  return e(i), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let n = i.initialize.bind(i);
      i.initialize = (s, a, o) => {
        let l = r.initialize(s, a, o);
        return i.initialValue = l, n(s, a, o);
      };
    } else
      i.initialValue = r;
    return i;
  };
}
function Ca(t, e) {
  return e.split(".").reduce((i, r) => i[r], t);
}
function Ii(t, e, i) {
  if (typeof e == "string" && (e = e.split(".")), e.length === 1)
    t[e[0]] = i;
  else {
    if (e.length === 0)
      throw error;
    return t[e[0]] || (t[e[0]] = {}), Ii(t[e[0]], e.slice(1), i);
  }
}
var xn = {};
function fe(t, e) {
  xn[t] = e;
}
function xt(t, e) {
  let i = Aa(e);
  return Object.entries(xn).forEach(([r, n]) => {
    Object.defineProperty(t, `$${r}`, {
      get() {
        return n(e, i);
      },
      enumerable: !1
    });
  }), t;
}
function Aa(t) {
  let [e, i] = On(t), r = { interceptor: wn, ...e };
  return Bi(t, i), r;
}
function In(t, e, i, ...r) {
  try {
    return i(...r);
  } catch (n) {
    et(n, t, e);
  }
}
function et(...t) {
  return En(...t);
}
var En = Oa;
function $a(t) {
  En = t;
}
function Oa(t, e, i = void 0) {
  t = Object.assign(
    t ?? { message: "No error message given." },
    { el: e, expression: i }
  ), console.warn(`Alpine Expression Error: ${t.message}

${i ? 'Expression: "' + i + `"

` : ""}`, e), setTimeout(() => {
    throw t;
  }, 0);
}
var Pe = !0;
function Tn(t) {
  let e = Pe;
  Pe = !1;
  let i = t();
  return Pe = e, i;
}
function Le(t, e, i = {}) {
  let r;
  return te(t, e)((n) => r = n, i), r;
}
function te(...t) {
  return _n(...t);
}
var _n = Na;
function ka(t) {
  _n = t;
}
var Sn;
function Ma(t) {
  Sn = t;
}
function Na(t, e) {
  let i = {};
  xt(i, t);
  let r = [i, ...Ve(t)], n = typeof e == "function" ? Cn(r, e) : Pa(r, e, t);
  return In.bind(null, t, e, n);
}
function Cn(t, e) {
  return (i = () => {
  }, { scope: r = {}, params: n = [], context: s } = {}) => {
    if (!Pe) {
      It(i, e, Se([r, ...t]), n);
      return;
    }
    let a = e.apply(Se([r, ...t]), n);
    It(i, a);
  };
}
var hi = {};
function Da(t, e) {
  if (hi[t])
    return hi[t];
  let i = Object.getPrototypeOf(async function() {
  }).constructor, r = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t, s = (() => {
    try {
      let a = new i(
        ["__self", "scope"],
        `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(a, "name", {
        value: `[Alpine] ${t}`
      }), a;
    } catch (a) {
      return et(a, e, t), Promise.resolve();
    }
  })();
  return hi[t] = s, s;
}
function Pa(t, e, i) {
  let r = Da(e, i);
  return (n = () => {
  }, { scope: s = {}, params: a = [], context: o } = {}) => {
    r.result = void 0, r.finished = !1;
    let l = Se([s, ...t]);
    if (typeof r == "function") {
      let f = r.call(o, r, l).catch((m) => et(m, i, e));
      r.finished ? (It(n, r.result, l, a, i), r.result = void 0) : f.then((m) => {
        It(n, m, l, a, i);
      }).catch((m) => et(m, i, e)).finally(() => r.result = void 0);
    }
  };
}
function It(t, e, i, r, n) {
  if (Pe && typeof e == "function") {
    let s = e.apply(i, r);
    s instanceof Promise ? s.then((a) => It(t, a, i, r)).catch((a) => et(a, n, e)) : t(s);
  } else typeof e == "object" && e instanceof Promise ? e.then((s) => t(s)) : t(e);
}
function La(...t) {
  return Sn(...t);
}
var Ji = "x-";
function at(t = "") {
  return Ji + t;
}
function Fa(t) {
  Ji = t;
}
var qt = {};
function G(t, e) {
  return qt[t] = e, {
    before(i) {
      if (!qt[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${t}\` will use the default order of execution`);
        return;
      }
      const r = Ne.indexOf(i);
      Ne.splice(r >= 0 ? r : Ne.indexOf("DEFAULT"), 0, t);
    }
  };
}
function Ra(t) {
  return Object.keys(qt).includes(t);
}
function Gi(t, e, i) {
  if (e = Array.from(e), t._x_virtualDirectives) {
    let s = Object.entries(t._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), a = An(s);
    s = s.map((o) => a.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), e = e.concat(s);
  }
  let r = {};
  return e.map(Nn((s, a) => r[s] = a)).filter(Pn).map(Ua(r, i)).sort(Ba).map((s) => Va(t, s));
}
function An(t) {
  return Array.from(t).map(Nn()).filter((e) => !Pn(e));
}
var Ei = !1, yt = /* @__PURE__ */ new Map(), $n = Symbol();
function za(t) {
  Ei = !0;
  let e = Symbol();
  $n = e, yt.set(e, []);
  let i = () => {
    for (; yt.get(e).length; )
      yt.get(e).shift()();
    yt.delete(e);
  }, r = () => {
    Ei = !1, i();
  };
  t(i), r();
}
function On(t) {
  let e = [], i = (o) => e.push(o), [r, n] = ya(t);
  return e.push(n), [{
    Alpine: lt,
    effect: r,
    cleanup: i,
    evaluateLater: te.bind(te, t),
    evaluate: Le.bind(Le, t)
  }, () => e.forEach((o) => o())];
}
function Va(t, e) {
  let i = () => {
  }, r = qt[e.type] || i, [n, s] = On(t);
  gn(t, e.original, s);
  let a = () => {
    t._x_ignore || t._x_ignoreSelf || (r.inline && r.inline(t, e, n), r = r.bind(r, t, e, n), Ei ? yt.get($n).push(r) : r());
  };
  return a.runCleanups = s, a;
}
var kn = (t, e) => ({ name: i, value: r }) => (i.startsWith(t) && (i = i.replace(t, e)), { name: i, value: r }), Mn = (t) => t;
function Nn(t = () => {
}) {
  return ({ name: e, value: i }) => {
    let { name: r, value: n } = Dn.reduce((s, a) => a(s), { name: e, value: i });
    return r !== e && t(r, e), { name: r, value: n };
  };
}
var Dn = [];
function Xi(t) {
  Dn.push(t);
}
function Pn({ name: t }) {
  return Ln().test(t);
}
var Ln = () => new RegExp(`^${Ji}([^:^.]+)\\b`);
function Ua(t, e) {
  return ({ name: i, value: r }) => {
    i === r && (r = "");
    let n = i.match(Ln()), s = i.match(/:([a-zA-Z0-9\-_:]+)/), a = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = e || t[i] || i;
    return {
      type: n ? n[1] : null,
      value: s ? s[1] : null,
      modifiers: a.map((l) => l.replace(".", "")),
      expression: r,
      original: o
    };
  };
}
var Ti = "DEFAULT", Ne = [
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
  Ti,
  "teleport"
];
function Ba(t, e) {
  let i = Ne.indexOf(t.type) === -1 ? Ti : t.type, r = Ne.indexOf(e.type) === -1 ? Ti : e.type;
  return Ne.indexOf(i) - Ne.indexOf(r);
}
function bt(t, e, i = {}) {
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
function Ue(t, e) {
  if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
    Array.from(t.children).forEach((n) => Ue(n, e));
    return;
  }
  let i = !1;
  if (e(t, () => i = !0), i)
    return;
  let r = t.firstElementChild;
  for (; r; )
    Ue(r, e), r = r.nextElementSibling;
}
function oe(t, ...e) {
  console.warn(`Alpine Warning: ${t}`, ...e);
}
var xr = !1;
function Ha() {
  xr && oe("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), xr = !0, document.body || oe("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), bt(document, "alpine:init"), bt(document, "alpine:initializing"), qi(), wa((e) => we(e, Ue)), Bi((e) => ot(e)), mn((e, i) => {
    Gi(e, i).forEach((r) => r());
  });
  let t = (e) => !Qt(e.parentElement, !0);
  Array.from(document.querySelectorAll(zn().join(","))).filter(t).forEach((e) => {
    we(e);
  }), bt(document, "alpine:initialized"), setTimeout(() => {
    Ya();
  });
}
var Zi = [], Fn = [];
function Rn() {
  return Zi.map((t) => t());
}
function zn() {
  return Zi.concat(Fn).map((t) => t());
}
function Vn(t) {
  Zi.push(t);
}
function Un(t) {
  Fn.push(t);
}
function Qt(t, e = !1) {
  return Be(t, (i) => {
    if ((e ? zn() : Rn()).some((n) => i.matches(n)))
      return !0;
  });
}
function Be(t, e) {
  if (t) {
    if (e(t))
      return t;
    if (t._x_teleportBack && (t = t._x_teleportBack), t.parentNode instanceof ShadowRoot)
      return Be(t.parentNode.host, e);
    if (t.parentElement)
      return Be(t.parentElement, e);
  }
}
function Wa(t) {
  return Rn().some((e) => t.matches(e));
}
var Bn = [];
function qa(t) {
  Bn.push(t);
}
var ja = 1;
function we(t, e = Ue, i = () => {
}) {
  Be(t, (r) => r._x_ignore) || za(() => {
    e(t, (r, n) => {
      r._x_marker || (i(r, n), Bn.forEach((s) => s(r, n)), Gi(r, r.attributes).forEach((s) => s()), r._x_ignore || (r._x_marker = ja++), r._x_ignore && n());
    });
  });
}
function ot(t, e = Ue) {
  e(t, (i) => {
    xa(i), vn(i), delete i._x_marker;
  });
}
function Ya() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([e, i, r]) => {
    Ra(i) || r.some((n) => {
      if (document.querySelector(n))
        return oe(`found "${n}", but missing ${e} plugin`), !0;
    });
  });
}
var _i = [], Qi = !1;
function er(t = () => {
}) {
  return queueMicrotask(() => {
    Qi || setTimeout(() => {
      Si();
    });
  }), new Promise((e) => {
    _i.push(() => {
      t(), e();
    });
  });
}
function Si() {
  for (Qi = !1; _i.length; )
    _i.shift()();
}
function Ka() {
  Qi = !0;
}
function tr(t, e) {
  return Array.isArray(e) ? Ir(t, e.join(" ")) : typeof e == "object" && e !== null ? Ja(t, e) : typeof e == "function" ? tr(t, e()) : Ir(t, e);
}
function Ir(t, e) {
  let i = (n) => n.split(" ").filter((s) => !t.classList.contains(s)).filter(Boolean), r = (n) => (t.classList.add(...n), () => {
    t.classList.remove(...n);
  });
  return e = e === !0 ? e = "" : e || "", r(i(e));
}
function Ja(t, e) {
  let i = (o) => o.split(" ").filter(Boolean), r = Object.entries(e).flatMap(([o, l]) => l ? i(o) : !1).filter(Boolean), n = Object.entries(e).flatMap(([o, l]) => l ? !1 : i(o)).filter(Boolean), s = [], a = [];
  return n.forEach((o) => {
    t.classList.contains(o) && (t.classList.remove(o), a.push(o));
  }), r.forEach((o) => {
    t.classList.contains(o) || (t.classList.add(o), s.push(o));
  }), () => {
    a.forEach((o) => t.classList.add(o)), s.forEach((o) => t.classList.remove(o));
  };
}
function ei(t, e) {
  return typeof e == "object" && e !== null ? Ga(t, e) : Xa(t, e);
}
function Ga(t, e) {
  let i = {};
  return Object.entries(e).forEach(([r, n]) => {
    i[r] = t.style[r], r.startsWith("--") || (r = Za(r)), t.style.setProperty(r, n);
  }), setTimeout(() => {
    t.style.length === 0 && t.removeAttribute("style");
  }), () => {
    ei(t, i);
  };
}
function Xa(t, e) {
  let i = t.getAttribute("style", e);
  return t.setAttribute("style", e), () => {
    t.setAttribute("style", i || "");
  };
}
function Za(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Ci(t, e = () => {
}) {
  let i = !1;
  return function() {
    i ? e.apply(this, arguments) : (i = !0, t.apply(this, arguments));
  };
}
G("transition", (t, { value: e, modifiers: i, expression: r }, { evaluate: n }) => {
  typeof r == "function" && (r = n(r)), r !== !1 && (!r || typeof r == "boolean" ? eo(t, i, e) : Qa(t, r, e));
});
function Qa(t, e, i) {
  Hn(t, tr, ""), {
    enter: (n) => {
      t._x_transition.enter.during = n;
    },
    "enter-start": (n) => {
      t._x_transition.enter.start = n;
    },
    "enter-end": (n) => {
      t._x_transition.enter.end = n;
    },
    leave: (n) => {
      t._x_transition.leave.during = n;
    },
    "leave-start": (n) => {
      t._x_transition.leave.start = n;
    },
    "leave-end": (n) => {
      t._x_transition.leave.end = n;
    }
  }[i](e);
}
function eo(t, e, i) {
  Hn(t, ei);
  let r = !e.includes("in") && !e.includes("out") && !i, n = r || e.includes("in") || ["enter"].includes(i), s = r || e.includes("out") || ["leave"].includes(i);
  e.includes("in") && !r && (e = e.filter((d, p) => p < e.indexOf("out"))), e.includes("out") && !r && (e = e.filter((d, p) => p > e.indexOf("out")));
  let a = !e.includes("opacity") && !e.includes("scale"), o = a || e.includes("opacity"), l = a || e.includes("scale"), f = o ? 0 : 1, m = l ? ht(e, "scale", 95) / 100 : 1, w = ht(e, "delay", 0) / 1e3, T = ht(e, "origin", "center"), b = "opacity, transform", u = ht(e, "duration", 150) / 1e3, h = ht(e, "duration", 75) / 1e3, c = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  n && (t._x_transition.enter.during = {
    transformOrigin: T,
    transitionDelay: `${w}s`,
    transitionProperty: b,
    transitionDuration: `${u}s`,
    transitionTimingFunction: c
  }, t._x_transition.enter.start = {
    opacity: f,
    transform: `scale(${m})`
  }, t._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (t._x_transition.leave.during = {
    transformOrigin: T,
    transitionDelay: `${w}s`,
    transitionProperty: b,
    transitionDuration: `${h}s`,
    transitionTimingFunction: c
  }, t._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, t._x_transition.leave.end = {
    opacity: f,
    transform: `scale(${m})`
  });
}
function Hn(t, e, i = {}) {
  t._x_transition || (t._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(r = () => {
    }, n = () => {
    }) {
      Ai(t, e, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, n);
    },
    out(r = () => {
    }, n = () => {
    }) {
      Ai(t, e, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, r, n);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, i, r) {
  const n = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => n(i);
  if (e) {
    t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(i) : s() : t._x_transition ? t._x_transition.in(i) : s();
    return;
  }
  t._x_hidePromise = t._x_transition ? new Promise((a, o) => {
    t._x_transition.out(() => {
    }, () => a(r)), t._x_transitioning && t._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(r), queueMicrotask(() => {
    let a = Wn(t);
    a ? (a._x_hideChildren || (a._x_hideChildren = []), a._x_hideChildren.push(t)) : n(() => {
      let o = (l) => {
        let f = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(o)
        ]).then(([m]) => m?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, f;
      };
      o(t).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function Wn(t) {
  let e = t.parentNode;
  if (e)
    return e._x_hidePromise ? e : Wn(e);
}
function Ai(t, e, { during: i, start: r, end: n } = {}, s = () => {
}, a = () => {
}) {
  if (t._x_transitioning && t._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(r).length === 0 && Object.keys(n).length === 0) {
    s(), a();
    return;
  }
  let o, l, f;
  to(t, {
    start() {
      o = e(t, r);
    },
    during() {
      l = e(t, i);
    },
    before: s,
    end() {
      o(), f = e(t, n);
    },
    after: a,
    cleanup() {
      l(), f();
    }
  });
}
function to(t, e) {
  let i, r, n, s = Ci(() => {
    j(() => {
      i = !0, r || e.before(), n || (e.end(), Si()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning;
    });
  });
  t._x_transitioning = {
    beforeCancels: [],
    beforeCancel(a) {
      this.beforeCancels.push(a);
    },
    cancel: Ci(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, j(() => {
    e.start(), e.during();
  }), Ka(), requestAnimationFrame(() => {
    if (i)
      return;
    let a = Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    a === 0 && (a = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3), j(() => {
      e.before();
    }), r = !0, requestAnimationFrame(() => {
      i || (j(() => {
        e.end();
      }), Si(), setTimeout(t._x_transitioning.finish, a + o), n = !0);
    });
  });
}
function ht(t, e, i) {
  if (t.indexOf(e) === -1)
    return i;
  const r = t[t.indexOf(e) + 1];
  if (!r || e === "scale" && isNaN(r))
    return i;
  if (e === "duration" || e === "delay") {
    let n = r.match(/([0-9]+)ms/);
    if (n)
      return n[1];
  }
  return e === "origin" && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [r, t[t.indexOf(e) + 2]].join(" ") : r;
}
var Ce = !1;
function Oe(t, e = () => {
}) {
  return (...i) => Ce ? e(...i) : t(...i);
}
function io(t) {
  return (...e) => Ce && t(...e);
}
var qn = [];
function ti(t) {
  qn.push(t);
}
function ro(t, e) {
  qn.forEach((i) => i(t, e)), Ce = !0, jn(() => {
    we(e, (i, r) => {
      r(i, () => {
      });
    });
  }), Ce = !1;
}
var $i = !1;
function no(t, e) {
  e._x_dataStack || (e._x_dataStack = t._x_dataStack), Ce = !0, $i = !0, jn(() => {
    so(e);
  }), Ce = !1, $i = !1;
}
function so(t) {
  let e = !1;
  we(t, (r, n) => {
    Ue(r, (s, a) => {
      if (e && Wa(s))
        return a();
      e = !0, n(s, a);
    });
  });
}
function jn(t) {
  let e = Ge;
  wr((i, r) => {
    let n = e(i);
    return st(n), () => {
    };
  }), t(), wr(e);
}
function Yn(t, e, i, r = []) {
  switch (t._x_bindings || (t._x_bindings = nt({})), t._x_bindings[e] = i, e = r.includes("camel") ? po(e) : e, e) {
    case "value":
      ao(t, i);
      break;
    case "style":
      lo(t, i);
      break;
    case "class":
      oo(t, i);
      break;
    case "selected":
    case "checked":
      co(t, e, i);
      break;
    default:
      Kn(t, e, i);
      break;
  }
}
function ao(t, e) {
  if (Xn(t))
    t.attributes.value === void 0 && (t.value = e), window.fromModel && (typeof e == "boolean" ? t.checked = Bt(t.value) === e : t.checked = Er(t.value, e));
  else if (ir(t))
    Number.isInteger(e) ? t.value = e : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e) ? t.value = String(e) : Array.isArray(e) ? t.checked = e.some((i) => Er(i, t.value)) : t.checked = !!e;
  else if (t.tagName === "SELECT")
    fo(t, e);
  else {
    if (t.value === e)
      return;
    t.value = e === void 0 ? "" : e;
  }
}
function oo(t, e) {
  t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = tr(t, e);
}
function lo(t, e) {
  t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = ei(t, e);
}
function co(t, e, i) {
  Kn(t, e, i), ho(t, e, i);
}
function Kn(t, e, i) {
  [null, void 0, !1].includes(i) && go(e) ? t.removeAttribute(e) : (Jn(e) && (i = e), uo(t, e, i));
}
function uo(t, e, i) {
  t.getAttribute(e) != i && t.setAttribute(e, i);
}
function ho(t, e, i) {
  t[e] !== i && (t[e] = i);
}
function fo(t, e) {
  const i = [].concat(e).map((r) => r + "");
  Array.from(t.options).forEach((r) => {
    r.selected = i.includes(r.value);
  });
}
function po(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function Er(t, e) {
  return t == e;
}
function Bt(t) {
  return [1, "1", "true", "on", "yes", !0].includes(t) ? !0 : [0, "0", "false", "off", "no", !1].includes(t) ? !1 : t ? !!t : null;
}
var mo = /* @__PURE__ */ new Set([
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
function Jn(t) {
  return mo.has(t);
}
function go(t) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
}
function vo(t, e, i) {
  return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Gn(t, e, i);
}
function yo(t, e, i, r = !0) {
  if (t._x_bindings && t._x_bindings[e] !== void 0)
    return t._x_bindings[e];
  if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
    let n = t._x_inlineBindings[e];
    return n.extract = r, Tn(() => Le(t, n.expression));
  }
  return Gn(t, e, i);
}
function Gn(t, e, i) {
  let r = t.getAttribute(e);
  return r === null ? typeof i == "function" ? i() : i : r === "" ? !0 : Jn(e) ? !![e, "true"].includes(r) : r;
}
function ir(t) {
  return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
}
function Xn(t) {
  return t.type === "radio" || t.localName === "ui-radio";
}
function Zn(t, e) {
  let i;
  return function() {
    const r = this, n = arguments, s = function() {
      i = null, t.apply(r, n);
    };
    clearTimeout(i), i = setTimeout(s, e);
  };
}
function Qn(t, e) {
  let i;
  return function() {
    let r = this, n = arguments;
    i || (t.apply(r, n), i = !0, setTimeout(() => i = !1, e));
  };
}
function es({ get: t, set: e }, { get: i, set: r }) {
  let n = !0, s, a = Ge(() => {
    let o = t(), l = i();
    if (n)
      r(di(o)), n = !1;
    else {
      let f = JSON.stringify(o), m = JSON.stringify(l);
      f !== s ? r(di(o)) : f !== m && e(di(l));
    }
    s = JSON.stringify(t()), JSON.stringify(i());
  });
  return () => {
    st(a);
  };
}
function di(t) {
  return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function bo(t) {
  (Array.isArray(t) ? t : [t]).forEach((i) => i(lt));
}
var Me = {}, Tr = !1;
function wo(t, e) {
  if (Tr || (Me = nt(Me), Tr = !0), e === void 0)
    return Me[t];
  Me[t] = e, Ki(Me[t]), typeof e == "object" && e !== null && e.hasOwnProperty("init") && typeof e.init == "function" && Me[t].init();
}
function xo() {
  return Me;
}
var ts = {};
function Io(t, e) {
  let i = typeof e != "function" ? () => e : e;
  return t instanceof Element ? is(t, i()) : (ts[t] = i, () => {
  });
}
function Eo(t) {
  return Object.entries(ts).forEach(([e, i]) => {
    Object.defineProperty(t, e, {
      get() {
        return (...r) => i(...r);
      }
    });
  }), t;
}
function is(t, e, i) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let n = Object.entries(e).map(([a, o]) => ({ name: a, value: o })), s = An(n);
  return n = n.map((a) => s.find((o) => o.name === a.name) ? {
    name: `x-bind:${a.name}`,
    value: `"${a.value}"`
  } : a), Gi(t, n, i).map((a) => {
    r.push(a.runCleanups), a();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var rs = {};
function To(t, e) {
  rs[t] = e;
}
function _o(t, e) {
  return Object.entries(rs).forEach(([i, r]) => {
    Object.defineProperty(t, i, {
      get() {
        return (...n) => r.bind(e)(...n);
      },
      enumerable: !1
    });
  }), t;
}
var So = {
  get reactive() {
    return nt;
  },
  get release() {
    return st;
  },
  get effect() {
    return Ge;
  },
  get raw() {
    return un;
  },
  get transaction() {
    return ba;
  },
  version: "3.15.8",
  flushAndStopDeferringMutations: Ta,
  dontAutoEvaluateFunctions: Tn,
  disableEffectScheduling: ga,
  startObservingMutations: qi,
  stopObservingMutations: yn,
  setReactivityEngine: va,
  onAttributeRemoved: gn,
  onAttributesAdded: mn,
  closestDataStack: Ve,
  skipDuringClone: Oe,
  onlyDuringClone: io,
  addRootSelector: Vn,
  addInitSelector: Un,
  setErrorHandler: $a,
  interceptClone: ti,
  addScopeToNode: St,
  deferMutations: Ea,
  mapAttributes: Xi,
  evaluateLater: te,
  interceptInit: qa,
  initInterceptors: Ki,
  injectMagics: xt,
  setEvaluator: ka,
  setRawEvaluator: Ma,
  mergeProxies: Se,
  extractProp: yo,
  findClosest: Be,
  onElRemoved: Bi,
  closestRoot: Qt,
  destroyTree: ot,
  interceptor: wn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Ai,
  // INTERNAL
  setStyles: ei,
  // INTERNAL
  mutateDom: j,
  directive: G,
  entangle: es,
  throttle: Qn,
  debounce: Zn,
  evaluate: Le,
  evaluateRaw: La,
  initTree: we,
  nextTick: er,
  prefixed: at,
  prefix: Fa,
  plugin: bo,
  magic: fe,
  store: wo,
  start: Ha,
  clone: no,
  // INTERNAL
  cloneNode: ro,
  // INTERNAL
  bound: vo,
  $data: bn,
  watch: hn,
  walk: Ue,
  data: To,
  bind: Io
}, lt = So, _r = /* @__PURE__ */ new WeakMap(), ns = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((t) => {
  t !== "styleMedia" && ns.add(globalThis[t]);
});
var Z = class {
  constructor(t, e, i, r) {
    this.type = t, this.value = e, this.start = i, this.end = r;
  }
}, Co = class {
  constructor(t) {
    this.input = t, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const t = this.input[this.position];
      this.isDigit(t) ? this.readNumber() : this.isAlpha(t) || t === "_" || t === "$" ? this.readIdentifierOrKeyword() : t === '"' || t === "'" ? this.readString() : t === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new Z("EOF", null, this.position, this.position)), this.tokens;
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
      const r = this.input[this.position];
      if (this.isDigit(r))
        this.position++;
      else if (r === "." && !e)
        e = !0, this.position++;
      else
        break;
    }
    const i = this.input.slice(t, this.position);
    this.tokens.push(new Z("NUMBER", parseFloat(i), t, this.position));
  }
  readIdentifierOrKeyword() {
    const t = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const e = this.input.slice(t, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(e) ? e === "true" || e === "false" ? this.tokens.push(new Z("BOOLEAN", e === "true", t, this.position)) : e === "null" ? this.tokens.push(new Z("NULL", null, t, this.position)) : e === "undefined" ? this.tokens.push(new Z("UNDEFINED", void 0, t, this.position)) : this.tokens.push(new Z("KEYWORD", e, t, this.position)) : this.tokens.push(new Z("IDENTIFIER", e, t, this.position));
  }
  readString() {
    const t = this.position, e = this.input[this.position];
    this.position++;
    let i = "", r = !1;
    for (; this.position < this.input.length; ) {
      const n = this.input[this.position];
      if (r) {
        switch (n) {
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
            i += n;
        }
        r = !1;
      } else if (n === "\\")
        r = !0;
      else if (n === e) {
        this.position++, this.tokens.push(new Z("STRING", i, t, this.position));
        return;
      } else
        i += n;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${t}`);
  }
  readOperatorOrPunctuation() {
    const t = this.position, e = this.input[this.position], i = this.peek(), r = this.peek(2);
    if (e === "=" && i === "=" && r === "=")
      this.position += 3, this.tokens.push(new Z("OPERATOR", "===", t, this.position));
    else if (e === "!" && i === "=" && r === "=")
      this.position += 3, this.tokens.push(new Z("OPERATOR", "!==", t, this.position));
    else if (e === "=" && i === "=")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "==", t, this.position));
    else if (e === "!" && i === "=")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "!=", t, this.position));
    else if (e === "<" && i === "=")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "<=", t, this.position));
    else if (e === ">" && i === "=")
      this.position += 2, this.tokens.push(new Z("OPERATOR", ">=", t, this.position));
    else if (e === "&" && i === "&")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "&&", t, this.position));
    else if (e === "|" && i === "|")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "||", t, this.position));
    else if (e === "+" && i === "+")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "++", t, this.position));
    else if (e === "-" && i === "-")
      this.position += 2, this.tokens.push(new Z("OPERATOR", "--", t, this.position));
    else {
      this.position++;
      const n = "()[]{},.;:?".includes(e) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new Z(n, e, t, this.position));
    }
  }
}, Ao = class {
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
      const r = this.parseExpression();
      if (t.push({
        type: "Property",
        key: e,
        value: r,
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
        const r = i;
        for (let n = 1; n < t.length; n++)
          if (this.check(r, t[n]))
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
}, $o = class {
  evaluate({ node: t, scope: e = {}, context: i = null, forceBindingRootScopeToFunctions: r = !0 }) {
    switch (t.type) {
      case "Literal":
        return t.value;
      case "Identifier":
        if (t.name in e) {
          const h = e[t.name];
          return this.checkForDangerousValues(h), typeof h == "function" ? h.bind(e) : h;
        }
        throw new Error(`Undefined variable: ${t.name}`);
      case "MemberExpression":
        const n = this.evaluate({ node: t.object, scope: e, context: i, forceBindingRootScopeToFunctions: r });
        if (n == null)
          throw new Error("Cannot read property of null or undefined");
        let s;
        t.computed ? s = this.evaluate({ node: t.property, scope: e, context: i, forceBindingRootScopeToFunctions: r }) : s = t.property.name, this.checkForDangerousKeywords(s);
        let a = n[s];
        return this.checkForDangerousValues(a), typeof a == "function" ? r ? a.bind(e) : a.bind(n) : a;
      case "CallExpression":
        const o = t.arguments.map((h) => this.evaluate({ node: h, scope: e, context: i, forceBindingRootScopeToFunctions: r }));
        let l;
        if (t.callee.type === "MemberExpression") {
          const h = this.evaluate({ node: t.callee.object, scope: e, context: i, forceBindingRootScopeToFunctions: r });
          let c;
          t.callee.computed ? c = this.evaluate({ node: t.callee.property, scope: e, context: i, forceBindingRootScopeToFunctions: r }) : c = t.callee.property.name, this.checkForDangerousKeywords(c);
          let d = h[c];
          if (typeof d != "function")
            throw new Error("Value is not a function");
          l = d.apply(h, o);
        } else if (t.callee.type === "Identifier") {
          const h = t.callee.name;
          let c;
          if (h in e)
            c = e[h];
          else
            throw new Error(`Undefined variable: ${h}`);
          if (typeof c != "function")
            throw new Error("Value is not a function");
          const d = i !== null ? i : e;
          l = c.apply(d, o);
        } else {
          const h = this.evaluate({ node: t.callee, scope: e, context: i, forceBindingRootScopeToFunctions: r });
          if (typeof h != "function")
            throw new Error("Value is not a function");
          l = h.apply(i, o);
        }
        return this.checkForDangerousValues(l), l;
      case "UnaryExpression":
        const f = this.evaluate({ node: t.argument, scope: e, context: i, forceBindingRootScopeToFunctions: r });
        switch (t.operator) {
          case "!":
            return !f;
          case "-":
            return -f;
          case "+":
            return +f;
          default:
            throw new Error(`Unknown unary operator: ${t.operator}`);
        }
      case "UpdateExpression":
        if (t.argument.type === "Identifier") {
          const h = t.argument.name;
          if (!(h in e))
            throw new Error(`Undefined variable: ${h}`);
          const c = e[h];
          return t.operator === "++" ? e[h] = c + 1 : t.operator === "--" && (e[h] = c - 1), t.prefix ? e[h] : c;
        } else if (t.argument.type === "MemberExpression") {
          const h = this.evaluate({ node: t.argument.object, scope: e, context: i, forceBindingRootScopeToFunctions: r }), c = t.argument.computed ? this.evaluate({ node: t.argument.property, scope: e, context: i, forceBindingRootScopeToFunctions: r }) : t.argument.property.name, d = h[c];
          return t.operator === "++" ? h[c] = d + 1 : t.operator === "--" && (h[c] = d - 1), t.prefix ? h[c] : d;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const m = this.evaluate({ node: t.left, scope: e, context: i, forceBindingRootScopeToFunctions: r }), w = this.evaluate({ node: t.right, scope: e, context: i, forceBindingRootScopeToFunctions: r });
        switch (t.operator) {
          case "+":
            return m + w;
          case "-":
            return m - w;
          case "*":
            return m * w;
          case "/":
            return m / w;
          case "%":
            return m % w;
          case "==":
            return m == w;
          case "!=":
            return m != w;
          case "===":
            return m === w;
          case "!==":
            return m !== w;
          case "<":
            return m < w;
          case ">":
            return m > w;
          case "<=":
            return m <= w;
          case ">=":
            return m >= w;
          case "&&":
            return m && w;
          case "||":
            return m || w;
          default:
            throw new Error(`Unknown binary operator: ${t.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: t.test, scope: e, context: i, forceBindingRootScopeToFunctions: r }) ? this.evaluate({ node: t.consequent, scope: e, context: i, forceBindingRootScopeToFunctions: r }) : this.evaluate({ node: t.alternate, scope: e, context: i, forceBindingRootScopeToFunctions: r });
      case "AssignmentExpression":
        const b = this.evaluate({ node: t.right, scope: e, context: i, forceBindingRootScopeToFunctions: r });
        if (t.left.type === "Identifier")
          return e[t.left.name] = b, b;
        throw t.left.type === "MemberExpression" ? new Error("Property assignments are prohibited in the CSP build") : new Error("Invalid assignment target");
      case "ArrayExpression":
        return t.elements.map((h) => this.evaluate({ node: h, scope: e, context: i, forceBindingRootScopeToFunctions: r }));
      case "ObjectExpression":
        const u = {};
        for (const h of t.properties) {
          const c = h.computed ? this.evaluate({ node: h.key, scope: e, context: i, forceBindingRootScopeToFunctions: r }) : h.key.type === "Identifier" ? h.key.name : this.evaluate({ node: h.key, scope: e, context: i, forceBindingRootScopeToFunctions: r }), d = this.evaluate({ node: h.value, scope: e, context: i, forceBindingRootScopeToFunctions: r });
          u[c] = d;
        }
        return u;
      default:
        throw new Error(`Unknown node type: ${t.type}`);
    }
  }
  checkForDangerousKeywords(t) {
    if ([
      "constructor",
      "prototype",
      "__proto__",
      "__defineGetter__",
      "__defineSetter__",
      "insertAdjacentHTML"
    ].includes(t))
      throw new Error(`Accessing "${t}" is prohibited in the CSP build`);
  }
  checkForDangerousValues(t) {
    if (t !== null && !(typeof t != "object" && typeof t != "function") && !_r.has(t)) {
      if (t instanceof HTMLIFrameElement || t instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (ns.has(t))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return _r.set(t, !0), !0;
    }
  }
};
function ss(t) {
  try {
    const i = new Co(t).tokenize(), n = new Ao(i).parse(), s = new $o();
    return function(a = {}) {
      const { scope: o = {}, context: l = null, forceBindingRootScopeToFunctions: f = !1 } = a;
      return s.evaluate({ node: n, scope: o, context: l, forceBindingRootScopeToFunctions: f });
    };
  } catch (e) {
    throw new Error(`CSP Parser Error: ${e.message}`);
  }
}
function Oo(t, e, i = {}) {
  let r = as(t), n = Se([i.scope ?? {}, ...r]), s = i.params ?? [], o = ss(e)({
    scope: n,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && Pe ? o.apply(n, s) : o;
}
function ko(t, e) {
  let i = as(t);
  if (typeof e == "function")
    return Cn(i, e);
  let r = Mo(t, e, i);
  return In.bind(null, t, e, r);
}
function as(t) {
  let e = {};
  return xt(e, t), [e, ...Ve(t)];
}
function Mo(t, e, i) {
  if (t instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (t instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (r = () => {
  }, { scope: n = {}, params: s = [] } = {}) => {
    let a = Se([n, ...i]), l = ss(e)({
      scope: a,
      forceBindingRootScopeToFunctions: !0
    });
    if (Pe && typeof l == "function") {
      let f = l.apply(l, s);
      f instanceof Promise ? f.then((m) => r(m)) : r(f);
    } else typeof l == "object" && l instanceof Promise ? l.then((f) => r(f)) : r(l);
  };
}
function No(t, e) {
  const i = /* @__PURE__ */ Object.create(null), r = t.split(",");
  for (let n = 0; n < r.length; n++)
    i[r[n]] = !0;
  return (n) => !!i[n];
}
var Do = Object.freeze({}), Po = Object.prototype.hasOwnProperty, ii = (t, e) => Po.call(t, e), Fe = Array.isArray, wt = (t) => os(t) === "[object Map]", Lo = (t) => typeof t == "string", rr = (t) => typeof t == "symbol", ri = (t) => t !== null && typeof t == "object", Fo = Object.prototype.toString, os = (t) => Fo.call(t), ls = (t) => os(t).slice(8, -1), nr = (t) => Lo(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Ro = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (i) => e[i] || (e[i] = t(i));
}, zo = Ro((t) => t.charAt(0).toUpperCase() + t.slice(1)), cs = (t, e) => t !== e && (t === t || e === e), Oi = /* @__PURE__ */ new WeakMap(), dt = [], me, Re = Symbol("iterate"), ki = Symbol("Map key iterate");
function Vo(t) {
  return t && t._isEffect === !0;
}
function Uo(t, e = Do) {
  Vo(t) && (t = t.raw);
  const i = Wo(t, e);
  return e.lazy || i(), i;
}
function Bo(t) {
  t.active && (us(t), t.options.onStop && t.options.onStop(), t.active = !1);
}
var Ho = 0;
function Wo(t, e) {
  const i = function() {
    if (!i.active)
      return t();
    if (!dt.includes(i)) {
      us(i);
      try {
        return jo(), dt.push(i), me = i, t();
      } finally {
        dt.pop(), hs(), me = dt[dt.length - 1];
      }
    }
  };
  return i.id = Ho++, i.allowRecurse = !!e.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = t, i.deps = [], i.options = e, i;
}
function us(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let i = 0; i < e.length; i++)
      e[i].delete(t);
    e.length = 0;
  }
}
var tt = !0, sr = [];
function qo() {
  sr.push(tt), tt = !1;
}
function jo() {
  sr.push(tt), tt = !0;
}
function hs() {
  const t = sr.pop();
  tt = t === void 0 ? !0 : t;
}
function ue(t, e, i) {
  if (!tt || me === void 0)
    return;
  let r = Oi.get(t);
  r || Oi.set(t, r = /* @__PURE__ */ new Map());
  let n = r.get(i);
  n || r.set(i, n = /* @__PURE__ */ new Set()), n.has(me) || (n.add(me), me.deps.push(n), me.options.onTrack && me.options.onTrack({
    effect: me,
    target: t,
    type: e,
    key: i
  }));
}
function Ae(t, e, i, r, n, s) {
  const a = Oi.get(t);
  if (!a)
    return;
  const o = /* @__PURE__ */ new Set(), l = (m) => {
    m && m.forEach((w) => {
      (w !== me || w.allowRecurse) && o.add(w);
    });
  };
  if (e === "clear")
    a.forEach(l);
  else if (i === "length" && Fe(t))
    a.forEach((m, w) => {
      (w === "length" || w >= r) && l(m);
    });
  else
    switch (i !== void 0 && l(a.get(i)), e) {
      case "add":
        Fe(t) ? nr(i) && l(a.get("length")) : (l(a.get(Re)), wt(t) && l(a.get(ki)));
        break;
      case "delete":
        Fe(t) || (l(a.get(Re)), wt(t) && l(a.get(ki)));
        break;
      case "set":
        wt(t) && l(a.get(Re));
        break;
    }
  const f = (m) => {
    m.options.onTrigger && m.options.onTrigger({
      effect: m,
      target: t,
      key: i,
      type: e,
      newValue: r,
      oldValue: n,
      oldTarget: s
    }), m.options.scheduler ? m.options.scheduler(m) : m();
  };
  o.forEach(f);
}
var Yo = /* @__PURE__ */ No("__proto__,__v_isRef,__isVue"), ds = new Set(Object.getOwnPropertyNames(Symbol).map((t) => Symbol[t]).filter(rr)), Ko = /* @__PURE__ */ fs(), Jo = /* @__PURE__ */ fs(!0), Sr = /* @__PURE__ */ Go();
function Go() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...i) {
      const r = q(this);
      for (let s = 0, a = this.length; s < a; s++)
        ue(r, "get", s + "");
      const n = r[e](...i);
      return n === -1 || n === !1 ? r[e](...i.map(q)) : n;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...i) {
      qo();
      const r = q(this)[e].apply(this, i);
      return hs(), r;
    };
  }), t;
}
function fs(t = !1, e = !1) {
  return function(r, n, s) {
    if (n === "__v_isReactive")
      return !t;
    if (n === "__v_isReadonly")
      return t;
    if (n === "__v_raw" && s === (t ? e ? ul : vs : e ? cl : gs).get(r))
      return r;
    const a = Fe(r);
    if (!t && a && ii(Sr, n))
      return Reflect.get(Sr, n, s);
    const o = Reflect.get(r, n, s);
    return (rr(n) ? ds.has(n) : Yo(n)) || (t || ue(r, "get", n), e) ? o : Mi(o) ? !a || !nr(n) ? o.value : o : ri(o) ? t ? ys(o) : cr(o) : o;
  };
}
var Xo = /* @__PURE__ */ Zo();
function Zo(t = !1) {
  return function(i, r, n, s) {
    let a = i[r];
    if (!t && (n = q(n), a = q(a), !Fe(i) && Mi(a) && !Mi(n)))
      return a.value = n, !0;
    const o = Fe(i) && nr(r) ? Number(r) < i.length : ii(i, r), l = Reflect.set(i, r, n, s);
    return i === q(s) && (o ? cs(n, a) && Ae(i, "set", r, n, a) : Ae(i, "add", r, n)), l;
  };
}
function Qo(t, e) {
  const i = ii(t, e), r = t[e], n = Reflect.deleteProperty(t, e);
  return n && i && Ae(t, "delete", e, void 0, r), n;
}
function el(t, e) {
  const i = Reflect.has(t, e);
  return (!rr(e) || !ds.has(e)) && ue(t, "has", e), i;
}
function tl(t) {
  return ue(t, "iterate", Fe(t) ? "length" : Re), Reflect.ownKeys(t);
}
var il = {
  get: Ko,
  set: Xo,
  deleteProperty: Qo,
  has: el,
  ownKeys: tl
}, rl = {
  get: Jo,
  set(t, e) {
    return console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  },
  deleteProperty(t, e) {
    return console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0;
  }
}, ar = (t) => ri(t) ? cr(t) : t, or = (t) => ri(t) ? ys(t) : t, lr = (t) => t, ni = (t) => Reflect.getPrototypeOf(t);
function Ot(t, e, i = !1, r = !1) {
  t = t.__v_raw;
  const n = q(t), s = q(e);
  e !== s && !i && ue(n, "get", e), !i && ue(n, "get", s);
  const { has: a } = ni(n), o = r ? lr : i ? or : ar;
  if (a.call(n, e))
    return o(t.get(e));
  if (a.call(n, s))
    return o(t.get(s));
  t !== n && t.get(e);
}
function kt(t, e = !1) {
  const i = this.__v_raw, r = q(i), n = q(t);
  return t !== n && !e && ue(r, "has", t), !e && ue(r, "has", n), t === n ? i.has(t) : i.has(t) || i.has(n);
}
function Mt(t, e = !1) {
  return t = t.__v_raw, !e && ue(q(t), "iterate", Re), Reflect.get(t, "size", t);
}
function Cr(t) {
  t = q(t);
  const e = q(this);
  return ni(e).has.call(e, t) || (e.add(t), Ae(e, "add", t, t)), this;
}
function Ar(t, e) {
  e = q(e);
  const i = q(this), { has: r, get: n } = ni(i);
  let s = r.call(i, t);
  s ? ms(i, r, t) : (t = q(t), s = r.call(i, t));
  const a = n.call(i, t);
  return i.set(t, e), s ? cs(e, a) && Ae(i, "set", t, e, a) : Ae(i, "add", t, e), this;
}
function $r(t) {
  const e = q(this), { has: i, get: r } = ni(e);
  let n = i.call(e, t);
  n ? ms(e, i, t) : (t = q(t), n = i.call(e, t));
  const s = r ? r.call(e, t) : void 0, a = e.delete(t);
  return n && Ae(e, "delete", t, void 0, s), a;
}
function Or() {
  const t = q(this), e = t.size !== 0, i = wt(t) ? new Map(t) : new Set(t), r = t.clear();
  return e && Ae(t, "clear", void 0, void 0, i), r;
}
function Nt(t, e) {
  return function(r, n) {
    const s = this, a = s.__v_raw, o = q(a), l = e ? lr : t ? or : ar;
    return !t && ue(o, "iterate", Re), a.forEach((f, m) => r.call(n, l(f), l(m), s));
  };
}
function Dt(t, e, i) {
  return function(...r) {
    const n = this.__v_raw, s = q(n), a = wt(s), o = t === "entries" || t === Symbol.iterator && a, l = t === "keys" && a, f = n[t](...r), m = i ? lr : e ? or : ar;
    return !e && ue(s, "iterate", l ? ki : Re), {
      // iterator protocol
      next() {
        const { value: w, done: T } = f.next();
        return T ? { value: w, done: T } : {
          value: o ? [m(w[0]), m(w[1])] : m(w),
          done: T
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Ie(t) {
  return function(...e) {
    {
      const i = e[0] ? `on key "${e[0]}" ` : "";
      console.warn(`${zo(t)} operation ${i}failed: target is readonly.`, q(this));
    }
    return t === "delete" ? !1 : this;
  };
}
function nl() {
  const t = {
    get(s) {
      return Ot(this, s);
    },
    get size() {
      return Mt(this);
    },
    has: kt,
    add: Cr,
    set: Ar,
    delete: $r,
    clear: Or,
    forEach: Nt(!1, !1)
  }, e = {
    get(s) {
      return Ot(this, s, !1, !0);
    },
    get size() {
      return Mt(this);
    },
    has: kt,
    add: Cr,
    set: Ar,
    delete: $r,
    clear: Or,
    forEach: Nt(!1, !0)
  }, i = {
    get(s) {
      return Ot(this, s, !0);
    },
    get size() {
      return Mt(this, !0);
    },
    has(s) {
      return kt.call(this, s, !0);
    },
    add: Ie(
      "add"
      /* ADD */
    ),
    set: Ie(
      "set"
      /* SET */
    ),
    delete: Ie(
      "delete"
      /* DELETE */
    ),
    clear: Ie(
      "clear"
      /* CLEAR */
    ),
    forEach: Nt(!0, !1)
  }, r = {
    get(s) {
      return Ot(this, s, !0, !0);
    },
    get size() {
      return Mt(this, !0);
    },
    has(s) {
      return kt.call(this, s, !0);
    },
    add: Ie(
      "add"
      /* ADD */
    ),
    set: Ie(
      "set"
      /* SET */
    ),
    delete: Ie(
      "delete"
      /* DELETE */
    ),
    clear: Ie(
      "clear"
      /* CLEAR */
    ),
    forEach: Nt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = Dt(s, !1, !1), i[s] = Dt(s, !0, !1), e[s] = Dt(s, !1, !0), r[s] = Dt(s, !0, !0);
  }), [
    t,
    i,
    e,
    r
  ];
}
var [sl, al] = /* @__PURE__ */ nl();
function ps(t, e) {
  const i = t ? al : sl;
  return (r, n, s) => n === "__v_isReactive" ? !t : n === "__v_isReadonly" ? t : n === "__v_raw" ? r : Reflect.get(ii(i, n) && n in r ? i : r, n, s);
}
var ol = {
  get: /* @__PURE__ */ ps(!1)
}, ll = {
  get: /* @__PURE__ */ ps(!0)
};
function ms(t, e, i) {
  const r = q(i);
  if (r !== i && e.call(t, r)) {
    const n = ls(t);
    console.warn(`Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var gs = /* @__PURE__ */ new WeakMap(), cl = /* @__PURE__ */ new WeakMap(), vs = /* @__PURE__ */ new WeakMap(), ul = /* @__PURE__ */ new WeakMap();
function hl(t) {
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
function dl(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : hl(ls(t));
}
function cr(t) {
  return t && t.__v_isReadonly ? t : bs(t, !1, il, ol, gs);
}
function ys(t) {
  return bs(t, !0, rl, ll, vs);
}
function bs(t, e, i, r, n) {
  if (!ri(t))
    return console.warn(`value cannot be made reactive: ${String(t)}`), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = n.get(t);
  if (s)
    return s;
  const a = dl(t);
  if (a === 0)
    return t;
  const o = new Proxy(t, a === 2 ? r : i);
  return n.set(t, o), o;
}
function q(t) {
  return t && q(t.__v_raw) || t;
}
function Mi(t) {
  return !!(t && t.__v_isRef === !0);
}
fe("nextTick", () => er);
fe("dispatch", (t) => bt.bind(bt, t));
fe("watch", (t, { evaluateLater: e, cleanup: i }) => (r, n) => {
  let s = e(r), o = hn(() => {
    let l;
    return s((f) => l = f), l;
  }, n);
  i(o);
});
fe("store", xo);
fe("data", (t) => bn(t));
fe("root", (t) => Qt(t));
fe("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = Se(fl(t))), t._x_refs_proxy));
function fl(t) {
  let e = [];
  return Be(t, (i) => {
    i._x_refs && e.push(i._x_refs);
  }), e;
}
var fi = {};
function ws(t) {
  return fi[t] || (fi[t] = 0), ++fi[t];
}
function pl(t, e) {
  return Be(t, (i) => {
    if (i._x_ids && i._x_ids[e])
      return !0;
  });
}
function ml(t, e) {
  t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = ws(e));
}
fe("id", (t, { cleanup: e }) => (i, r = null) => {
  let n = `${i}${r ? `-${r}` : ""}`;
  return gl(t, n, e, () => {
    let s = pl(t, i), a = s ? s._x_ids[i] : ws(i);
    return r ? `${i}-${a}-${r}` : `${i}-${a}`;
  });
});
ti((t, e) => {
  t._x_id && (e._x_id = t._x_id);
});
function gl(t, e, i, r) {
  if (t._x_id || (t._x_id = {}), t._x_id[e])
    return t._x_id[e];
  let n = r();
  return t._x_id[e] = n, i(() => {
    delete t._x_id[e];
  }), n;
}
fe("el", (t) => t);
xs("Focus", "focus", "focus");
xs("Persist", "persist", "persist");
function xs(t, e, i) {
  fe(e, (r) => oe(`You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, r));
}
G("modelable", (t, { expression: e }, { effect: i, evaluateLater: r, cleanup: n }) => {
  let s = r(e), a = () => {
    let m;
    return s((w) => m = w), m;
  }, o = r(`${e} = __placeholder`), l = (m) => o(() => {
  }, { scope: { __placeholder: m } }), f = a();
  l(f), queueMicrotask(() => {
    if (!t._x_model)
      return;
    t._x_removeModelListeners.default();
    let m = t._x_model.get, w = t._x_model.set, T = es(
      {
        get() {
          return m();
        },
        set(b) {
          w(b);
        }
      },
      {
        get() {
          return a();
        },
        set(b) {
          l(b);
        }
      }
    );
    n(T);
  });
});
G("teleport", (t, { modifiers: e, expression: i }, { cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && oe("x-teleport can only be used on a <template> tag", t);
  let n = kr(i), s = t.content.cloneNode(!0).firstElementChild;
  t._x_teleport = s, s._x_teleportBack = t, t.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), t._x_forwardEvents && t._x_forwardEvents.forEach((o) => {
    s.addEventListener(o, (l) => {
      l.stopPropagation(), t.dispatchEvent(new l.constructor(l.type, l));
    });
  }), St(s, {}, t);
  let a = (o, l, f) => {
    f.includes("prepend") ? l.parentNode.insertBefore(o, l) : f.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  j(() => {
    a(s, n, e), Oe(() => {
      we(s);
    })();
  }), t._x_teleportPutBack = () => {
    let o = kr(i);
    j(() => {
      a(t._x_teleport, o, e);
    });
  }, r(
    () => j(() => {
      s.remove(), ot(s);
    })
  );
});
var vl = document.createElement("div");
function kr(t) {
  let e = Oe(() => document.querySelector(t), () => vl)();
  return e || oe(`Cannot find x-teleport element for selector: "${t}"`), e;
}
var Is = () => {
};
Is.inline = (t, { modifiers: e }, { cleanup: i }) => {
  e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, i(() => {
    e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
  });
};
G("ignore", Is);
G("effect", Oe((t, { expression: e }, { effect: i }) => {
  i(te(t, e));
}));
function Ze(t, e, i, r) {
  let n = t, s = (l) => r(l), a = {}, o = (l, f) => (m) => f(l, m);
  if (i.includes("dot") && (e = yl(e)), i.includes("camel") && (e = bl(e)), i.includes("passive") && (a.passive = !0), i.includes("capture") && (a.capture = !0), i.includes("window") && (n = window), i.includes("document") && (n = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", f = jt(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Zn(s, f);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", f = jt(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = Qn(s, f);
  }
  return i.includes("prevent") && (s = o(s, (l, f) => {
    f.preventDefault(), l(f);
  })), i.includes("stop") && (s = o(s, (l, f) => {
    f.stopPropagation(), l(f);
  })), i.includes("once") && (s = o(s, (l, f) => {
    l(f), n.removeEventListener(e, s, a);
  })), (i.includes("away") || i.includes("outside")) && (n = document, s = o(s, (l, f) => {
    t.contains(f.target) || f.target.isConnected !== !1 && (t.offsetWidth < 1 && t.offsetHeight < 1 || t._x_isShown !== !1 && l(f));
  })), i.includes("self") && (s = o(s, (l, f) => {
    f.target === t && l(f);
  })), e === "submit" && (s = o(s, (l, f) => {
    f.target._x_pendingModelUpdates && f.target._x_pendingModelUpdates.forEach((m) => m()), l(f);
  })), (xl(e) || Es(e)) && (s = o(s, (l, f) => {
    Il(f, i) || l(f);
  })), n.addEventListener(e, s, a), () => {
    n.removeEventListener(e, s, a);
  };
}
function yl(t) {
  return t.replace(/-/g, ".");
}
function bl(t) {
  return t.toLowerCase().replace(/-(\w)/g, (e, i) => i.toUpperCase());
}
function jt(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function wl(t) {
  return [" ", "_"].includes(
    t
  ) ? t : t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function xl(t) {
  return ["keydown", "keyup"].includes(t);
}
function Es(t) {
  return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
}
function Il(t, e) {
  let i = e.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, jt((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, jt((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && Mr(t.key).includes(i[0]))
    return !1;
  const n = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !n.includes(s)), !(n.length > 0 && n.filter((a) => ((a === "cmd" || a === "super") && (a = "meta"), t[`${a}Key`])).length === n.length && (Es(t.type) || Mr(t.key).includes(i[0])));
}
function Mr(t) {
  if (!t)
    return [];
  t = wl(t);
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
G("model", (t, { modifiers: e, expression: i }, { effect: r, cleanup: n }) => {
  let s = t;
  e.includes("parent") && (s = t.parentNode);
  let a = te(s, i), o;
  typeof i == "string" ? o = te(s, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? o = te(s, `${i()} = __placeholder`) : o = () => {
  };
  let l = () => {
    let h;
    return a((c) => h = c), Nr(h) ? h.get() : h;
  }, f = (h) => {
    let c;
    a((d) => c = d), Nr(c) ? c.set(h) : o(() => {
    }, {
      scope: { __placeholder: h }
    });
  };
  typeof i == "string" && t.type === "radio" && j(() => {
    t.hasAttribute("name") || t.setAttribute("name", i);
  });
  let m = e.includes("change") || e.includes("lazy"), w = e.includes("blur"), T = e.includes("enter"), b = m || w || T, u;
  if (Ce)
    u = () => {
    };
  else if (b) {
    let h = [], c = (d) => f(Pt(t, e, d, l()));
    if (m && h.push(Ze(t, "change", e, c)), w && (h.push(Ze(t, "blur", e, c)), t.form)) {
      let d = () => c({ target: t });
      t.form._x_pendingModelUpdates || (t.form._x_pendingModelUpdates = []), t.form._x_pendingModelUpdates.push(d), n(() => t.form._x_pendingModelUpdates.splice(t.form._x_pendingModelUpdates.indexOf(d), 1));
    }
    T && h.push(Ze(t, "keydown", e, (d) => {
      d.key === "Enter" && c(d);
    })), u = () => h.forEach((d) => d());
  } else {
    let h = t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type) ? "change" : "input";
    u = Ze(t, h, e, (c) => {
      f(Pt(t, e, c, l()));
    });
  }
  if (e.includes("fill") && ([void 0, null, ""].includes(l()) || ir(t) && Array.isArray(l()) || t.tagName.toLowerCase() === "select" && t.multiple) && f(
    Pt(t, e, { target: t }, l())
  ), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = u, n(() => t._x_removeModelListeners.default()), t.form) {
    let h = Ze(t.form, "reset", [], (c) => {
      er(() => t._x_model && t._x_model.set(Pt(t, e, { target: t }, l())));
    });
    n(() => h());
  }
  t._x_model = {
    get() {
      return l();
    },
    set(h) {
      f(h);
    }
  }, t._x_forceModelUpdate = (h) => {
    h === void 0 && typeof i == "string" && i.match(/\./) && (h = ""), window.fromModel = !0, j(() => Yn(t, "value", h)), delete window.fromModel;
  }, r(() => {
    let h = l();
    e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(h);
  });
});
function Pt(t, e, i, r) {
  return j(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (ir(t))
      if (Array.isArray(r)) {
        let n = null;
        return e.includes("number") ? n = pi(i.target.value) : e.includes("boolean") ? n = Bt(i.target.value) : n = i.target.value, i.target.checked ? r.includes(n) ? r : r.concat([n]) : r.filter((s) => !El(s, n));
      } else
        return i.target.checked;
    else {
      if (t.tagName.toLowerCase() === "select" && t.multiple)
        return e.includes("number") ? Array.from(i.target.selectedOptions).map((n) => {
          let s = n.value || n.text;
          return pi(s);
        }) : e.includes("boolean") ? Array.from(i.target.selectedOptions).map((n) => {
          let s = n.value || n.text;
          return Bt(s);
        }) : Array.from(i.target.selectedOptions).map((n) => n.value || n.text);
      {
        let n;
        return Xn(t) ? i.target.checked ? n = i.target.value : n = r : n = i.target.value, e.includes("number") ? pi(n) : e.includes("boolean") ? Bt(n) : e.includes("trim") ? n.trim() : n;
      }
    }
  });
}
function pi(t) {
  let e = t ? parseFloat(t) : null;
  return Tl(e) ? e : t;
}
function El(t, e) {
  return t == e;
}
function Tl(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function Nr(t) {
  return t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function";
}
G("cloak", (t) => queueMicrotask(() => j(() => t.removeAttribute(at("cloak")))));
Un(() => `[${at("init")}]`);
G("init", Oe((t, { expression: e }, { evaluate: i }) => typeof e == "string" ? !!e.trim() && i(e, {}, !1) : i(e, {}, !1)));
G("text", (t, { expression: e }, { effect: i, evaluateLater: r }) => {
  let n = r(e);
  i(() => {
    n((s) => {
      j(() => {
        t.textContent = s;
      });
    });
  });
});
G("html", (t, { expression: e }, { effect: i, evaluateLater: r }) => {
  let n = r(e);
  i(() => {
    n((s) => {
      j(() => {
        t.innerHTML = s, t._x_ignoreSelf = !0, we(t), delete t._x_ignoreSelf;
      });
    });
  });
});
Xi(kn(":", Mn(at("bind:"))));
var Ts = (t, { value: e, modifiers: i, expression: r, original: n }, { effect: s, cleanup: a }) => {
  if (!e) {
    let l = {};
    Eo(l), te(t, r)((m) => {
      is(t, m, n);
    }, { scope: l });
    return;
  }
  if (e === "key")
    return _l(t, r);
  if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract)
    return;
  let o = te(t, r);
  s(() => o((l) => {
    l === void 0 && typeof r == "string" && r.match(/\./) && (l = ""), j(() => Yn(t, e, l, i));
  })), a(() => {
    t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedStyles && t._x_undoAddedStyles();
  });
};
Ts.inline = (t, { value: e, modifiers: i, expression: r }) => {
  e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = { expression: r, extract: !1 });
};
G("bind", Ts);
function _l(t, e) {
  t._x_keyExpression = e;
}
Vn(() => `[${at("data")}]`);
G("data", (t, { expression: e }, { cleanup: i }) => {
  if (Sl(t))
    return;
  e = e === "" ? "{}" : e;
  let r = {};
  xt(r, t);
  let n = {};
  _o(n, r);
  let s = Le(t, e, { scope: n });
  (s === void 0 || s === !0) && (s = {}), xt(s, t);
  let a = nt(s);
  Ki(a);
  let o = St(t, a);
  a.init && Le(t, a.init), i(() => {
    a.destroy && Le(t, a.destroy), o();
  });
});
ti((t, e) => {
  t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0));
});
function Sl(t) {
  return Ce ? $i ? !0 : t.hasAttribute("data-has-alpine-state") : !1;
}
G("show", (t, { modifiers: e, expression: i }, { effect: r }) => {
  let n = te(t, i);
  t._x_doHide || (t._x_doHide = () => {
    j(() => {
      t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
    });
  }), t._x_doShow || (t._x_doShow = () => {
    j(() => {
      t.style.length === 1 && t.style.display === "none" ? t.removeAttribute("style") : t.style.removeProperty("display");
    });
  });
  let s = () => {
    t._x_doHide(), t._x_isShown = !1;
  }, a = () => {
    t._x_doShow(), t._x_isShown = !0;
  }, o = () => setTimeout(a), l = Ci(
    (w) => w ? a() : s(),
    (w) => {
      typeof t._x_toggleAndCascadeWithTransitions == "function" ? t._x_toggleAndCascadeWithTransitions(t, w, a, s) : w ? o() : s();
    }
  ), f, m = !0;
  r(() => n((w) => {
    !m && w === f || (e.includes("immediate") && (w ? o() : s()), l(w), f = w, m = !1);
  }));
});
G("for", (t, { expression: e }, { effect: i, cleanup: r }) => {
  let n = Al(e), s = te(t, n.items), a = te(
    t,
    // the x-bind:key expression is stored for our use instead of evaluated.
    t._x_keyExpression || "index"
  );
  t._x_prevKeys = [], t._x_lookup = {}, i(() => Cl(t, n, s, a)), r(() => {
    Object.values(t._x_lookup).forEach((o) => j(
      () => {
        ot(o), o.remove();
      }
    )), delete t._x_prevKeys, delete t._x_lookup;
  });
});
function Cl(t, e, i, r) {
  let n = (a) => typeof a == "object" && !Array.isArray(a), s = t;
  i((a) => {
    $l(a) && a >= 0 && (a = Array.from(Array(a).keys(), (c) => c + 1)), a === void 0 && (a = []);
    let o = t._x_lookup, l = t._x_prevKeys, f = [], m = [];
    if (n(a))
      a = Object.entries(a).map(([c, d]) => {
        let p = Dr(e, d, c, a);
        r((y) => {
          m.includes(y) && oe("Duplicate key on x-for", t), m.push(y);
        }, { scope: { index: c, ...p } }), f.push(p);
      });
    else
      for (let c = 0; c < a.length; c++) {
        let d = Dr(e, a[c], c, a);
        r((p) => {
          m.includes(p) && oe("Duplicate key on x-for", t), m.push(p);
        }, { scope: { index: c, ...d } }), f.push(d);
      }
    let w = [], T = [], b = [], u = [];
    for (let c = 0; c < l.length; c++) {
      let d = l[c];
      m.indexOf(d) === -1 && b.push(d);
    }
    l = l.filter((c) => !b.includes(c));
    let h = "template";
    for (let c = 0; c < m.length; c++) {
      let d = m[c], p = l.indexOf(d);
      if (p === -1)
        l.splice(c, 0, d), w.push([h, c]);
      else if (p !== c) {
        let y = l.splice(c, 1)[0], x = l.splice(p - 1, 1)[0];
        l.splice(c, 0, x), l.splice(p, 0, y), T.push([y, x]);
      } else
        u.push(d);
      h = d;
    }
    for (let c = 0; c < b.length; c++) {
      let d = b[c];
      d in o && (j(() => {
        ot(o[d]), o[d].remove();
      }), delete o[d]);
    }
    for (let c = 0; c < T.length; c++) {
      let [d, p] = T[c], y = o[d], x = o[p], _ = document.createElement("div");
      j(() => {
        x || oe('x-for ":key" is undefined or invalid', s, p, o), x.after(_), y.after(x), x._x_currentIfEl && x.after(x._x_currentIfEl), _.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), _.remove();
      }), x._x_refreshXForScope(f[m.indexOf(p)]);
    }
    for (let c = 0; c < w.length; c++) {
      let [d, p] = w[c], y = d === "template" ? s : o[d];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let x = f[p], _ = m[p], g = document.importNode(s.content, !0).firstElementChild, E = nt(x);
      St(g, E, s), g._x_refreshXForScope = (S) => {
        Object.entries(S).forEach(([A, C]) => {
          E[A] = C;
        });
      }, j(() => {
        y.after(g), Oe(() => we(g))();
      }), typeof _ == "object" && oe("x-for key cannot be an object, it must be a string or an integer", s), o[_] = g;
    }
    for (let c = 0; c < u.length; c++)
      o[u[c]]._x_refreshXForScope(f[m.indexOf(u[c])]);
    s._x_prevKeys = m;
  });
}
function Al(t) {
  let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, n = t.match(r);
  if (!n)
    return;
  let s = {};
  s.items = n[2].trim();
  let a = n[1].replace(i, "").trim(), o = a.match(e);
  return o ? (s.item = a.replace(e, "").trim(), s.index = o[1].trim(), o[2] && (s.collection = o[2].trim())) : s.item = a, s;
}
function Dr(t, e, i, r) {
  let n = {};
  return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((a) => a.trim()).forEach((a, o) => {
    n[a] = e[o];
  }) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object" ? t.item.replace("{", "").replace("}", "").split(",").map((a) => a.trim()).forEach((a) => {
    n[a] = e[a];
  }) : n[t.item] = e, t.index && (n[t.index] = i), t.collection && (n[t.collection] = r), n;
}
function $l(t) {
  return !Array.isArray(t) && !isNaN(t);
}
function _s() {
}
_s.inline = (t, { expression: e }, { cleanup: i }) => {
  let r = Qt(t);
  r._x_refs || (r._x_refs = {}), r._x_refs[e] = t, i(() => delete r._x_refs[e]);
};
G("ref", _s);
G("if", (t, { expression: e }, { effect: i, cleanup: r }) => {
  t.tagName.toLowerCase() !== "template" && oe("x-if can only be used on a <template> tag", t);
  let n = te(t, e), s = () => {
    if (t._x_currentIfEl)
      return t._x_currentIfEl;
    let o = t.content.cloneNode(!0).firstElementChild;
    return St(o, {}, t), j(() => {
      t.after(o), Oe(() => we(o))();
    }), t._x_currentIfEl = o, t._x_undoIf = () => {
      j(() => {
        ot(o), o.remove();
      }), delete t._x_currentIfEl;
    }, o;
  }, a = () => {
    t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
  };
  i(() => n((o) => {
    o ? s() : a();
  })), r(() => t._x_undoIf && t._x_undoIf());
});
G("id", (t, { expression: e }, { evaluate: i }) => {
  i(e).forEach((n) => ml(t, n));
});
ti((t, e) => {
  t._x_ids && (e._x_ids = t._x_ids);
});
Xi(kn("@", Mn(at("on:"))));
G("on", Oe((t, { value: e, modifiers: i, expression: r }, { cleanup: n }) => {
  let s = r ? te(t, r) : () => {
  };
  t.tagName.toLowerCase() === "template" && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
  let a = Ze(t, e, i, (o) => {
    s(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  n(() => a());
}));
si("Collapse", "collapse", "collapse");
si("Intersect", "intersect", "intersect");
si("Focus", "trap", "focus");
si("Mask", "mask", "mask");
function si(t, e, i) {
  G(e, (r) => oe(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${i}`, r));
}
G("html", (t, { expression: e }) => {
  et(new Error("Using the x-html directive is prohibited in the CSP build"), t);
});
lt.setEvaluator(ko);
lt.setRawEvaluator(Oo);
lt.setReactivityEngine({ reactive: cr, effect: Uo, release: Bo, raw: q });
var Ol = lt, Ss = Ol;
function kl(t) {
  t.directive("collapse", e), e.inline = (i, { modifiers: r }) => {
    r.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function e(i, { modifiers: r }) {
    let n = Pr(r, "duration", 250) / 1e3, s = Pr(r, "min", 0), a = !r.includes("min");
    i._x_isShown || (i.style.height = `${s}px`), !i._x_isShown && a && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let o = (f, m) => {
      let w = t.setStyles(f, m);
      return m.height ? () => {
      } : w;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${n}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    i._x_transition = {
      in(f = () => {
      }, m = () => {
      }) {
        a && (i.hidden = !1), a && (i.style.display = null);
        let w = i.getBoundingClientRect().height;
        i.style.height = "auto";
        let T = i.getBoundingClientRect().height;
        w === T && (w = s), t.transition(i, t.setStyles, {
          during: l,
          start: { height: w + "px" },
          end: { height: T + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - T) < 1 && (i.style.overflow = null);
        });
      },
      out(f = () => {
      }, m = () => {
      }) {
        let w = i.getBoundingClientRect().height;
        t.transition(i, o, {
          during: l,
          start: { height: w + "px" },
          end: { height: s + "px" }
        }, () => i.style.overflow = "hidden", () => {
          i._x_isShown = !1, i.style.height == `${s}px` && a && (i.style.display = "none", i.hidden = !0);
        });
      }
    };
  }
}
function Pr(t, e, i) {
  if (t.indexOf(e) === -1)
    return i;
  const r = t[t.indexOf(e) + 1];
  if (!r)
    return i;
  if (e === "duration") {
    let n = r.match(/([0-9]+)ms/);
    if (n)
      return n[1];
  }
  if (e === "min") {
    let n = r.match(/([0-9]+)px/);
    if (n)
      return n[1];
  }
  return r;
}
var Ml = kl;
function Nl(t) {
  t.directive("intersect", t.skipDuringClone((e, { value: i, expression: r, modifiers: n }, { evaluateLater: s, cleanup: a }) => {
    let o = s(r), l = {
      rootMargin: Ll(n),
      threshold: Dl(n)
    }, f = new IntersectionObserver((m) => {
      m.forEach((w) => {
        w.isIntersecting !== (i === "leave") && (o(), n.includes("once") && f.disconnect());
      });
    }, l);
    f.observe(e), a(() => {
      f.disconnect();
    });
  }));
}
function Dl(t) {
  if (t.includes("full"))
    return 0.99;
  if (t.includes("half"))
    return 0.5;
  if (!t.includes("threshold"))
    return 0;
  let e = t[t.indexOf("threshold") + 1];
  return e === "100" ? 1 : e === "0" ? 0 : +`.${e}`;
}
function Pl(t) {
  let e = t.match(/^(-?[0-9]+)(px|%)?$/);
  return e ? e[1] + (e[2] || "px") : void 0;
}
function Ll(t) {
  const e = "margin", i = "0px 0px 0px 0px", r = t.indexOf(e);
  if (r === -1)
    return i;
  let n = [];
  for (let s = 1; s < 5; s++)
    n.push(Pl(t[r + s] || ""));
  return n = n.filter((s) => s !== void 0), n.length ? n.join(" ").trim() : i;
}
var Fl = Nl, Cs = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Yt = /* @__PURE__ */ Cs.join(","), As = typeof Element > "u", He = As ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Ni = !As && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, $s = function(e, i, r) {
  var n = Array.prototype.slice.apply(e.querySelectorAll(Yt));
  return i && He.call(e, Yt) && n.unshift(e), n = n.filter(r), n;
}, Os = function t(e, i, r) {
  for (var n = [], s = Array.from(e); s.length; ) {
    var a = s.shift();
    if (a.tagName === "SLOT") {
      var o = a.assignedElements(), l = o.length ? o : a.children, f = t(l, !0, r);
      r.flatten ? n.push.apply(n, f) : n.push({
        scope: a,
        candidates: f
      });
    } else {
      var m = He.call(a, Yt);
      m && r.filter(a) && (i || !e.includes(a)) && n.push(a);
      var w = a.shadowRoot || // check for an undisclosed shadow
      typeof r.getShadowRoot == "function" && r.getShadowRoot(a), T = !r.shadowRootFilter || r.shadowRootFilter(a);
      if (w && T) {
        var b = t(w === !0 ? a.children : w.children, !0, r);
        r.flatten ? n.push.apply(n, b) : n.push({
          scope: a,
          candidates: b
        });
      } else
        s.unshift.apply(s, a.children);
    }
  }
  return n;
}, ks = function(e, i) {
  return e.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Rl = function(e, i) {
  return e.tabIndex === i.tabIndex ? e.documentOrder - i.documentOrder : e.tabIndex - i.tabIndex;
}, Ms = function(e) {
  return e.tagName === "INPUT";
}, zl = function(e) {
  return Ms(e) && e.type === "hidden";
}, Vl = function(e) {
  var i = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(r) {
    return r.tagName === "SUMMARY";
  });
  return i;
}, Ul = function(e, i) {
  for (var r = 0; r < e.length; r++)
    if (e[r].checked && e[r].form === i)
      return e[r];
}, Bl = function(e) {
  if (!e.name)
    return !0;
  var i = e.form || Ni(e), r = function(o) {
    return i.querySelectorAll('input[type="radio"][name="' + o + '"]');
  }, n;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    n = r(window.CSS.escape(e.name));
  else
    try {
      n = r(e.name);
    } catch (a) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", a.message), !1;
    }
  var s = Ul(n, e.form);
  return !s || s === e;
}, Hl = function(e) {
  return Ms(e) && e.type === "radio";
}, Wl = function(e) {
  return Hl(e) && !Bl(e);
}, Lr = function(e) {
  var i = e.getBoundingClientRect(), r = i.width, n = i.height;
  return r === 0 && n === 0;
}, ql = function(e, i) {
  var r = i.displayCheck, n = i.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var s = He.call(e, "details>summary:first-of-type"), a = s ? e.parentElement : e;
  if (He.call(a, "details:not([open]) *"))
    return !0;
  var o = Ni(e).host, l = o?.ownerDocument.contains(o) || e.ownerDocument.contains(e);
  if (!r || r === "full") {
    if (typeof n == "function") {
      for (var f = e; e; ) {
        var m = e.parentElement, w = Ni(e);
        if (m && !m.shadowRoot && n(m) === !0)
          return Lr(e);
        e.assignedSlot ? e = e.assignedSlot : !m && w !== e.ownerDocument ? e = w.host : e = m;
      }
      e = f;
    }
    if (l)
      return !e.getClientRects().length;
  } else if (r === "non-zero-area")
    return Lr(e);
  return !1;
}, jl = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var i = e.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var r = 0; r < i.children.length; r++) {
          var n = i.children.item(r);
          if (n.tagName === "LEGEND")
            return He.call(i, "fieldset[disabled] *") ? !0 : !n.contains(e);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, Kt = function(e, i) {
  return !(i.disabled || zl(i) || ql(i, e) || // For a details element with a summary, the summary element gets the focus
  Vl(i) || jl(i));
}, Di = function(e, i) {
  return !(Wl(i) || ks(i) < 0 || !Kt(e, i));
}, Yl = function(e) {
  var i = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Kl = function t(e) {
  var i = [], r = [];
  return e.forEach(function(n, s) {
    var a = !!n.scope, o = a ? n.scope : n, l = ks(o, a), f = a ? t(n.candidates) : o;
    l === 0 ? a ? i.push.apply(i, f) : i.push(o) : r.push({
      documentOrder: s,
      tabIndex: l,
      item: n,
      isScope: a,
      content: f
    });
  }), r.sort(Rl).reduce(function(n, s) {
    return s.isScope ? n.push.apply(n, s.content) : n.push(s.content), n;
  }, []).concat(i);
}, Jl = function(e, i) {
  i = i || {};
  var r;
  return i.getShadowRoot ? r = Os([e], i.includeContainer, {
    filter: Di.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: Yl
  }) : r = $s(e, i.includeContainer, Di.bind(null, i)), Kl(r);
}, Ns = function(e, i) {
  i = i || {};
  var r;
  return i.getShadowRoot ? r = Os([e], i.includeContainer, {
    filter: Kt.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : r = $s(e, i.includeContainer, Kt.bind(null, i)), r;
}, Lt = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return He.call(e, Yt) === !1 ? !1 : Di(i, e);
}, Gl = /* @__PURE__ */ Cs.concat("iframe").join(","), Ht = function(e, i) {
  if (i = i || {}, !e)
    throw new Error("No node provided");
  return He.call(e, Gl) === !1 ? !1 : Kt(i, e);
};
function Fr(t, e) {
  var i = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(n) {
      return Object.getOwnPropertyDescriptor(t, n).enumerable;
    })), i.push.apply(i, r);
  }
  return i;
}
function Rr(t) {
  for (var e = 1; e < arguments.length; e++) {
    var i = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Fr(Object(i), !0).forEach(function(r) {
      Xl(t, r, i[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : Fr(Object(i)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(i, r));
    });
  }
  return t;
}
function Xl(t, e, i) {
  return e in t ? Object.defineProperty(t, e, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = i, t;
}
var zr = /* @__PURE__ */ (function() {
  var t = [];
  return {
    activateTrap: function(i) {
      if (t.length > 0) {
        var r = t[t.length - 1];
        r !== i && r.pause();
      }
      var n = t.indexOf(i);
      n === -1 || t.splice(n, 1), t.push(i);
    },
    deactivateTrap: function(i) {
      var r = t.indexOf(i);
      r !== -1 && t.splice(r, 1), t.length > 0 && t[t.length - 1].unpause();
    }
  };
})(), Zl = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Ql = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, ec = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, Vr = function(e) {
  return setTimeout(e, 0);
}, Ur = function(e, i) {
  var r = -1;
  return e.every(function(n, s) {
    return i(n) ? (r = s, !1) : !0;
  }), r;
}, ft = function(e) {
  for (var i = arguments.length, r = new Array(i > 1 ? i - 1 : 0), n = 1; n < i; n++)
    r[n - 1] = arguments[n];
  return typeof e == "function" ? e.apply(void 0, r) : e;
}, Ft = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, tc = function(e, i) {
  var r = i?.document || document, n = Rr({
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
  }, a, o = function(g, E, S) {
    return g && g[E] !== void 0 ? g[E] : n[S || E];
  }, l = function(g) {
    return s.containerGroups.findIndex(function(E) {
      var S = E.container, A = E.tabbableNodes;
      return S.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      A.find(function(C) {
        return C === g;
      });
    });
  }, f = function(g) {
    var E = n[g];
    if (typeof E == "function") {
      for (var S = arguments.length, A = new Array(S > 1 ? S - 1 : 0), C = 1; C < S; C++)
        A[C - 1] = arguments[C];
      E = E.apply(void 0, A);
    }
    if (E === !0 && (E = void 0), !E) {
      if (E === void 0 || E === !1)
        return E;
      throw new Error("`".concat(g, "` was specified but was not a node, or did not return a node"));
    }
    var $ = E;
    if (typeof E == "string" && ($ = r.querySelector(E), !$))
      throw new Error("`".concat(g, "` as selector refers to no known node"));
    return $;
  }, m = function() {
    var g = f("initialFocus");
    if (g === !1)
      return !1;
    if (g === void 0)
      if (l(r.activeElement) >= 0)
        g = r.activeElement;
      else {
        var E = s.tabbableGroups[0], S = E && E.firstTabbableNode;
        g = S || f("fallbackFocus");
      }
    if (!g)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return g;
  }, w = function() {
    if (s.containerGroups = s.containers.map(function(g) {
      var E = Jl(g, n.tabbableOptions), S = Ns(g, n.tabbableOptions);
      return {
        container: g,
        tabbableNodes: E,
        focusableNodes: S,
        firstTabbableNode: E.length > 0 ? E[0] : null,
        lastTabbableNode: E.length > 0 ? E[E.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(C) {
          var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = S.findIndex(function(R) {
            return R === C;
          });
          if (!(N < 0))
            return $ ? S.slice(N + 1).find(function(R) {
              return Lt(R, n.tabbableOptions);
            }) : S.slice(0, N).reverse().find(function(R) {
              return Lt(R, n.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(g) {
      return g.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !f("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, T = function _(g) {
    if (g !== !1 && g !== r.activeElement) {
      if (!g || !g.focus) {
        _(m());
        return;
      }
      g.focus({
        preventScroll: !!n.preventScroll
      }), s.mostRecentlyFocusedNode = g, Zl(g) && g.select();
    }
  }, b = function(g) {
    var E = f("setReturnFocus", g);
    return E || (E === !1 ? !1 : g);
  }, u = function(g) {
    var E = Ft(g);
    if (!(l(E) >= 0)) {
      if (ft(n.clickOutsideDeactivates, g)) {
        a.deactivate({
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
          returnFocus: n.returnFocusOnDeactivate && !Ht(E, n.tabbableOptions)
        });
        return;
      }
      ft(n.allowOutsideClick, g) || g.preventDefault();
    }
  }, h = function(g) {
    var E = Ft(g), S = l(E) >= 0;
    S || E instanceof Document ? S && (s.mostRecentlyFocusedNode = E) : (g.stopImmediatePropagation(), T(s.mostRecentlyFocusedNode || m()));
  }, c = function(g) {
    var E = Ft(g);
    w();
    var S = null;
    if (s.tabbableGroups.length > 0) {
      var A = l(E), C = A >= 0 ? s.containerGroups[A] : void 0;
      if (A < 0)
        g.shiftKey ? S = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : S = s.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var $ = Ur(s.tabbableGroups, function(Y) {
          var X = Y.firstTabbableNode;
          return E === X;
        });
        if ($ < 0 && (C.container === E || Ht(E, n.tabbableOptions) && !Lt(E, n.tabbableOptions) && !C.nextTabbableNode(E, !1)) && ($ = A), $ >= 0) {
          var N = $ === 0 ? s.tabbableGroups.length - 1 : $ - 1, R = s.tabbableGroups[N];
          S = R.lastTabbableNode;
        }
      } else {
        var U = Ur(s.tabbableGroups, function(Y) {
          var X = Y.lastTabbableNode;
          return E === X;
        });
        if (U < 0 && (C.container === E || Ht(E, n.tabbableOptions) && !Lt(E, n.tabbableOptions) && !C.nextTabbableNode(E)) && (U = A), U >= 0) {
          var z = U === s.tabbableGroups.length - 1 ? 0 : U + 1, Q = s.tabbableGroups[z];
          S = Q.firstTabbableNode;
        }
      }
    } else
      S = f("fallbackFocus");
    S && (g.preventDefault(), T(S));
  }, d = function(g) {
    if (Ql(g) && ft(n.escapeDeactivates, g) !== !1) {
      g.preventDefault(), a.deactivate();
      return;
    }
    if (ec(g)) {
      c(g);
      return;
    }
  }, p = function(g) {
    var E = Ft(g);
    l(E) >= 0 || ft(n.clickOutsideDeactivates, g) || ft(n.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, y = function() {
    if (s.active)
      return zr.activateTrap(a), s.delayInitialFocusTimer = n.delayInitialFocus ? Vr(function() {
        T(m());
      }) : T(m()), r.addEventListener("focusin", h, !0), r.addEventListener("mousedown", u, {
        capture: !0,
        passive: !1
      }), r.addEventListener("touchstart", u, {
        capture: !0,
        passive: !1
      }), r.addEventListener("click", p, {
        capture: !0,
        passive: !1
      }), r.addEventListener("keydown", d, {
        capture: !0,
        passive: !1
      }), a;
  }, x = function() {
    if (s.active)
      return r.removeEventListener("focusin", h, !0), r.removeEventListener("mousedown", u, !0), r.removeEventListener("touchstart", u, !0), r.removeEventListener("click", p, !0), r.removeEventListener("keydown", d, !0), a;
  };
  return a = {
    get active() {
      return s.active;
    },
    get paused() {
      return s.paused;
    },
    activate: function(g) {
      if (s.active)
        return this;
      var E = o(g, "onActivate"), S = o(g, "onPostActivate"), A = o(g, "checkCanFocusTrap");
      A || w(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = r.activeElement, E && E();
      var C = function() {
        A && w(), y(), S && S();
      };
      return A ? (A(s.containers.concat()).then(C, C), this) : (C(), this);
    },
    deactivate: function(g) {
      if (!s.active)
        return this;
      var E = Rr({
        onDeactivate: n.onDeactivate,
        onPostDeactivate: n.onPostDeactivate,
        checkCanReturnFocus: n.checkCanReturnFocus
      }, g);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, x(), s.active = !1, s.paused = !1, zr.deactivateTrap(a);
      var S = o(E, "onDeactivate"), A = o(E, "onPostDeactivate"), C = o(E, "checkCanReturnFocus"), $ = o(E, "returnFocus", "returnFocusOnDeactivate");
      S && S();
      var N = function() {
        Vr(function() {
          $ && T(b(s.nodeFocusedBeforeActivation)), A && A();
        });
      };
      return $ && C ? (C(b(s.nodeFocusedBeforeActivation)).then(N, N), this) : (N(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, x(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, w(), y(), this);
    },
    updateContainerElements: function(g) {
      var E = [].concat(g).filter(Boolean);
      return s.containers = E.map(function(S) {
        return typeof S == "string" ? r.querySelector(S) : S;
      }), s.active && w(), this;
    }
  }, a.updateContainerElements(e), a;
};
function ic(t) {
  let e, i;
  window.addEventListener("focusin", () => {
    e = i, i = document.activeElement;
  }), t.magic("focus", (r) => {
    let n = r;
    return {
      __noscroll: !1,
      __wrapAround: !1,
      within(s) {
        return n = s, this;
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
        return Ht(s);
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
        return Array.isArray(n) ? n : Ns(n, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(s) {
        let a = this.all();
        return a[0] && a[0].isSameNode(s);
      },
      isLast(s) {
        let a = this.all();
        return a.length && a.slice(-1)[0].isSameNode(s);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let s = this.all(), a = document.activeElement;
        if (s.indexOf(a) !== -1)
          return this.__wrapAround && s.indexOf(a) === s.length - 1 ? s[0] : s[s.indexOf(a) + 1];
      },
      getPrevious() {
        let s = this.all(), a = document.activeElement;
        if (s.indexOf(a) !== -1)
          return this.__wrapAround && s.indexOf(a) === 0 ? s.slice(-1)[0] : s[s.indexOf(a) - 1];
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
    (r, { expression: n, modifiers: s }, { effect: a, evaluateLater: o, cleanup: l }) => {
      let f = o(n), m = !1, w = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => r
      }, T = () => {
      };
      if (s.includes("noautofocus"))
        w.initialFocus = !1;
      else {
        let c = r.querySelector("[autofocus]");
        c && (w.initialFocus = c);
      }
      s.includes("inert") && (w.onPostActivate = () => {
        t.nextTick(() => {
          T = Br(r);
        });
      });
      let b = tc(r, w), u = () => {
      };
      const h = () => {
        T(), T = () => {
        }, u(), u = () => {
        }, b.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      a(() => f((c) => {
        m !== c && (c && !m && (s.includes("noscroll") && (u = rc()), setTimeout(() => {
          b.activate();
        }, 15)), !c && m && h(), m = !!c);
      })), l(h);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (r, { expression: n, modifiers: s }, { evaluate: a }) => {
      s.includes("inert") && a(n) && Br(r);
    }
  ));
}
function Br(t) {
  let e = [];
  return Ds(t, (i) => {
    let r = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), e.push(() => r || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; e.length; )
      e.pop()();
  };
}
function Ds(t, e) {
  t.isSameNode(document.body) || !t.parentNode || Array.from(t.parentNode.children).forEach((i) => {
    i.isSameNode(t) ? Ds(t.parentNode, e) : e(i);
  });
}
function rc() {
  let t = document.documentElement.style.overflow, e = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = t, document.documentElement.style.paddingRight = e;
  };
}
var nc = ic;
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
function sc() {
  return !0;
}
function ac({ component: t, argument: e }) {
  return new Promise((i) => {
    if (e)
      window.addEventListener(
        e,
        () => i(),
        { once: !0 }
      );
    else {
      const r = (n) => {
        n.detail.id === t.id && (window.removeEventListener("async-alpine:load", r), i());
      };
      window.addEventListener("async-alpine:load", r);
    }
  });
}
function oc() {
  return new Promise((t) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(t) : setTimeout(t, 200);
  });
}
function lc({ argument: t }) {
  return new Promise((e) => {
    if (!t)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), e();
    const i = window.matchMedia(`(${t})`);
    i.matches ? e() : i.addEventListener("change", e, { once: !0 });
  });
}
function cc({ component: t, argument: e }) {
  return new Promise((i) => {
    const r = e || "0px 0px 0px 0px", n = new IntersectionObserver((s) => {
      s[0].isIntersecting && (n.disconnect(), i());
    }, { rootMargin: r });
    n.observe(t.el);
  });
}
var Hr = {
  eager: sc,
  event: ac,
  idle: oc,
  media: lc,
  visible: cc
};
async function uc(t) {
  const e = hc(t.strategy);
  await Pi(t, e);
}
async function Pi(t, e) {
  if (e.type === "expression") {
    if (e.operator === "&&")
      return Promise.all(
        e.parameters.map((i) => Pi(t, i))
      );
    if (e.operator === "||")
      return Promise.any(
        e.parameters.map((i) => Pi(t, i))
      );
  }
  return Hr[e.method] ? Hr[e.method]({
    component: t,
    argument: e.argument
  }) : !1;
}
function hc(t) {
  const e = dc(t);
  let i = Ps(e);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function dc(t) {
  const e = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, i = [];
  let r;
  for (; (r = e.exec(t)) !== null; ) {
    const [n, s, a, o] = r;
    if (s !== void 0)
      i.push({ type: "parenthesis", value: s });
    else if (a !== void 0)
      i.push({
        type: "operator",
        // we do the below to make operators backwards-compatible with previous
        // versions of Async Alpine, where '|' is equivalent to &&
        value: a === "|" ? "&&" : a
      });
    else {
      const l = {
        type: "method",
        method: o.trim()
      };
      o.includes("(") && (l.method = o.substring(0, o.indexOf("(")).trim(), l.argument = o.substring(
        o.indexOf("(") + 1,
        o.indexOf(")")
      )), o.method === "immediate" && (o.method = "eager"), i.push(l);
    }
  }
  return i;
}
function Ps(t) {
  let e = Wr(t);
  for (; t.length > 0 && (t[0].value === "&&" || t[0].value === "|" || t[0].value === "||"); ) {
    const i = t.shift().value, r = Wr(t);
    e.type === "expression" && e.operator === i ? e.parameters.push(r) : e = {
      type: "expression",
      operator: i,
      parameters: [e, r]
    };
  }
  return e;
}
function Wr(t) {
  if (t[0].value === "(") {
    t.shift();
    const e = Ps(t);
    return t[0].value === ")" && t.shift(), e;
  } else
    return t.shift();
}
function fc(t) {
  const e = "load", i = t.prefixed("load-src"), r = t.prefixed("ignore");
  let n = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, s = !1, a = {}, o = 0;
  function l() {
    return o++;
  }
  t.asyncOptions = (p) => {
    n = {
      ...n,
      ...p
    };
  }, t.asyncData = (p, y = !1) => {
    a[p] = {
      loaded: !1,
      download: y
    };
  }, t.asyncUrl = (p, y) => {
    !p || !y || a[p] || (a[p] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        d(y)
      )
    });
  }, t.asyncAlias = (p) => {
    s = p;
  };
  const f = (p) => {
    t.skipDuringClone(() => {
      p._x_async || (p._x_async = "init", p._x_ignore = !0, p.setAttribute(r, ""));
    })();
  }, m = async (p) => {
    t.skipDuringClone(async () => {
      if (p._x_async !== "init") return;
      p._x_async = "await";
      const { name: y, strategy: x } = w(p);
      await uc({
        name: y,
        strategy: x,
        el: p,
        id: p.id || l()
      }), p.isConnected && (await T(y), p.isConnected && (u(p), p._x_async = "loaded"));
    })();
  };
  m.inline = f, t.directive(e, m).before("ignore");
  function w(p) {
    const y = c(p.getAttribute(t.prefixed("data"))), x = p.getAttribute(t.prefixed(e)) || n.defaultStrategy, _ = p.getAttribute(i);
    return _ && t.asyncUrl(y, _), {
      name: y,
      strategy: x
    };
  }
  async function T(p) {
    if (p.startsWith("_x_async_") || (h(p), !a[p] || a[p].loaded)) return;
    const y = await b(p);
    t.data(p, y), a[p].loaded = !0;
  }
  async function b(p) {
    if (!a[p]) return;
    const y = await a[p].download(p);
    return typeof y == "function" ? y : y[p] || y.default || Object.values(y)[0] || !1;
  }
  function u(p) {
    t.destroyTree(p), p._x_ignore = !1, p.removeAttribute(r), !p.closest(`[${r}]`) && t.initTree(p);
  }
  function h(p) {
    if (!(!s || a[p])) {
      if (typeof s == "function") {
        t.asyncData(p, s);
        return;
      }
      t.asyncUrl(p, s.replaceAll("[name]", p));
    }
  }
  function c(p) {
    return (p || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function d(p) {
    return n.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(p) ? p : new URL(p, document.baseURI).href;
  }
}
var mi = { exports: {} }, qr;
function pc() {
  return qr || (qr = 1, (function(t, e) {
    (function(r, n) {
      t.exports = n();
    })(self, () => (
      /******/
      (() => {
        var i = {};
        i.d = (b, u) => {
          for (var h in u)
            i.o(u, h) && !i.o(b, h) && Object.defineProperty(b, h, { enumerable: !0, get: u[h] });
        }, i.o = (b, u) => Object.prototype.hasOwnProperty.call(b, u), i.r = (b) => {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(b, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(b, "__esModule", { value: !0 });
        };
        var r = {};
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        i.r(r), i.d(r, {
          /* harmony export */
          MvcValidationProviders: () => (
            /* binding */
            w
          ),
          /* harmony export */
          ValidationService: () => (
            /* binding */
            T
          ),
          /* harmony export */
          isValidatable: () => (
            /* binding */
            o
          )
          /* harmony export */
        });
        var n = function(b, u, h, c) {
          function d(p) {
            return p instanceof h ? p : new h(function(y) {
              y(p);
            });
          }
          return new (h || (h = Promise))(function(p, y) {
            function x(E) {
              try {
                g(c.next(E));
              } catch (S) {
                y(S);
              }
            }
            function _(E) {
              try {
                g(c.throw(E));
              } catch (S) {
                y(S);
              }
            }
            function g(E) {
              E.done ? p(E.value) : d(E.value).then(x, _);
            }
            g((c = c.apply(b, u || [])).next());
          });
        }, s = function(b, u) {
          var h = { label: 0, sent: function() {
            if (p[0] & 1) throw p[1];
            return p[1];
          }, trys: [], ops: [] }, c, d, p, y;
          return y = { next: x(0), throw: x(1), return: x(2) }, typeof Symbol == "function" && (y[Symbol.iterator] = function() {
            return this;
          }), y;
          function x(g) {
            return function(E) {
              return _([g, E]);
            };
          }
          function _(g) {
            if (c) throw new TypeError("Generator is already executing.");
            for (; y && (y = 0, g[0] && (h = 0)), h; ) try {
              if (c = 1, d && (p = g[0] & 2 ? d.return : g[0] ? d.throw || ((p = d.return) && p.call(d), 0) : d.next) && !(p = p.call(d, g[1])).done) return p;
              switch (d = 0, p && (g = [g[0] & 2, p.value]), g[0]) {
                case 0:
                case 1:
                  p = g;
                  break;
                case 4:
                  return h.label++, { value: g[1], done: !1 };
                case 5:
                  h.label++, d = g[1], g = [0];
                  continue;
                case 7:
                  g = h.ops.pop(), h.trys.pop();
                  continue;
                default:
                  if (p = h.trys, !(p = p.length > 0 && p[p.length - 1]) && (g[0] === 6 || g[0] === 2)) {
                    h = 0;
                    continue;
                  }
                  if (g[0] === 3 && (!p || g[1] > p[0] && g[1] < p[3])) {
                    h.label = g[1];
                    break;
                  }
                  if (g[0] === 6 && h.label < p[1]) {
                    h.label = p[1], p = g;
                    break;
                  }
                  if (p && h.label < p[2]) {
                    h.label = p[2], h.ops.push(g);
                    break;
                  }
                  p[2] && h.ops.pop(), h.trys.pop();
                  continue;
              }
              g = u.call(b, h);
            } catch (E) {
              g = [6, E], d = 0;
            } finally {
              c = p = 0;
            }
            if (g[0] & 5) throw g[1];
            return { value: g[0] ? g[1] : void 0, done: !0 };
          }
        }, a = new /** @class */
        ((function() {
          function b() {
            this.warn = globalThis.console.warn;
          }
          return b.prototype.log = function(u) {
          }, b;
        })())(), o = function(b) {
          return b instanceof HTMLInputElement || b instanceof HTMLSelectElement || b instanceof HTMLTextAreaElement;
        }, l = ["input", "select", "textarea"], f = function(b) {
          return l.map(function(u) {
            return "".concat(u).concat(b || "");
          }).join(",");
        };
        function m(b, u) {
          var h = b.name, c = u.substring(2), d = "", p = h.lastIndexOf(".");
          if (p > -1) {
            d = h.substring(0, p);
            var y = d + "." + c, x = document.getElementsByName(y)[0];
            if (o(x))
              return x;
          }
          return b.form.querySelector(f("[name=".concat(c, "]")));
        }
        var w = (
          /** @class */
          /* @__PURE__ */ (function() {
            function b() {
              this.required = function(u, h, c) {
                var d = h.type.toLowerCase();
                if (d === "checkbox" || d === "radio") {
                  for (var p = Array.from(h.form.querySelectorAll(f("[name='".concat(h.name, "'][type='").concat(d, "']")))), y = 0, x = p; y < x.length; y++) {
                    var _ = x[y];
                    if (_ instanceof HTMLInputElement && _.checked === !0)
                      return !0;
                  }
                  if (d === "checkbox") {
                    var g = h.form.querySelector("input[name='".concat(h.name, "'][type='hidden']"));
                    if (g instanceof HTMLInputElement && g.value === "false")
                      return !0;
                  }
                  return !1;
                }
                return !!u?.trim();
              }, this.stringLength = function(u, h, c) {
                if (!u)
                  return !0;
                if (c.min) {
                  var d = parseInt(c.min);
                  if (u.length < d)
                    return !1;
                }
                if (c.max) {
                  var p = parseInt(c.max);
                  if (u.length > p)
                    return !1;
                }
                return !0;
              }, this.compare = function(u, h, c) {
                if (!c.other)
                  return !0;
                var d = m(h, c.other);
                return d ? d.value === u : !0;
              }, this.range = function(u, h, c) {
                if (!u)
                  return !0;
                var d = parseFloat(u);
                if (isNaN(d))
                  return !1;
                if (c.min) {
                  var p = parseFloat(c.min);
                  if (d < p)
                    return !1;
                }
                if (c.max) {
                  var y = parseFloat(c.max);
                  if (d > y)
                    return !1;
                }
                return !0;
              }, this.regex = function(u, h, c) {
                if (!u || !c.pattern)
                  return !0;
                var d = new RegExp(c.pattern);
                return d.test(u);
              }, this.email = function(u, h, c) {
                if (!u)
                  return !0;
                var d = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/;
                return d.test(u);
              }, this.creditcard = function(u, h, c) {
                if (!u)
                  return !0;
                if (/[^0-9 \-]+/.test(u))
                  return !1;
                var d = 0, p = 0, y = !1, x, _;
                if (u = u.replace(/\D/g, ""), u.length < 13 || u.length > 19)
                  return !1;
                for (x = u.length - 1; x >= 0; x--)
                  _ = u.charAt(x), p = parseInt(_, 10), y && (p *= 2) > 9 && (p -= 9), d += p, y = !y;
                return d % 10 === 0;
              }, this.url = function(u, h, c) {
                if (!u)
                  return !0;
                var d = u.toLowerCase();
                return d.indexOf("http://") > -1 || d.indexOf("https://") > -1 || d.indexOf("ftp://") > -1;
              }, this.phone = function(u, h, c) {
                if (!u)
                  return !0;
                var d = /[\+\-\s][\-\s]/g;
                if (d.test(u))
                  return !1;
                var p = /^\+?[0-9\-\s]+$/;
                return p.test(u);
              }, this.remote = function(u, h, c) {
                if (!u)
                  return !0;
                for (var d = c.additionalfields.split(","), p = {}, y = 0, x = d; y < x.length; y++) {
                  var _ = x[y], g = _.substr(2), E = m(h, _), S = !!(E && E.value);
                  S && (E instanceof HTMLInputElement && (E.type === "checkbox" || E.type === "radio") ? p[g] = E.checked ? E.value : "" : p[g] = E.value);
                }
                var A = c.url, C = [];
                for (var g in p) {
                  var $ = encodeURIComponent(g) + "=" + encodeURIComponent(p[g]);
                  C.push($);
                }
                var N = C.join("&");
                return new Promise(function(R, U) {
                  var z = new XMLHttpRequest();
                  if (c.type && c.type.toLowerCase() === "post") {
                    var Q = new FormData();
                    for (var Y in p)
                      Q.append(Y, p[Y]);
                    z.open("post", A), z.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), z.send(N);
                  } else
                    z.open("get", A + "?" + N), z.send();
                  z.onload = function(X) {
                    if (z.status >= 200 && z.status < 300) {
                      var se = JSON.parse(z.responseText);
                      R(se);
                    } else
                      U({
                        status: z.status,
                        statusText: z.statusText,
                        data: z.responseText
                      });
                  }, z.onerror = function(X) {
                    U({
                      status: z.status,
                      statusText: z.statusText,
                      data: z.responseText
                    });
                  };
                });
              };
            }
            return b;
          })()
        ), T = (
          /** @class */
          (function() {
            function b(u) {
              var h = this;
              this.providers = {}, this.messageFor = {}, this.elementUIDs = [], this.elementByUID = {}, this.formInputs = {}, this.validators = {}, this.formEvents = {}, this.inputEvents = {}, this.summary = {}, this.debounce = 300, this.allowHiddenFields = !1, this.validateForm = function(c, d) {
                return n(h, void 0, void 0, function() {
                  var p, y, x;
                  return s(this, function(_) {
                    switch (_.label) {
                      case 0:
                        if (!(c instanceof HTMLFormElement))
                          throw new Error("validateForm() can only be called on <form> elements");
                        return p = this.getElementUID(c), y = this.formEvents[p], x = !y, x ? [3, 2] : [4, y(void 0, d)];
                      case 1:
                        x = _.sent(), _.label = 2;
                      case 2:
                        return [2, x];
                    }
                  });
                });
              }, this.validateField = function(c, d) {
                return n(h, void 0, void 0, function() {
                  var p, y, x;
                  return s(this, function(_) {
                    switch (_.label) {
                      case 0:
                        return p = this.getElementUID(c), y = this.inputEvents[p], x = !y, x ? [3, 2] : [4, y(void 0, d)];
                      case 1:
                        x = _.sent(), _.label = 2;
                      case 2:
                        return [2, x];
                    }
                  });
                });
              }, this.preValidate = function(c) {
                c.preventDefault(), c.stopImmediatePropagation();
              }, this.handleValidated = function(c, d, p) {
                if (!(c instanceof HTMLFormElement))
                  throw new Error("handleValidated() can only be called on <form> elements");
                d ? p && h.submitValidForm(c, p) : h.focusFirstInvalid(c);
              }, this.submitValidForm = function(c, d) {
                if (!(c instanceof HTMLFormElement))
                  throw new Error("submitValidForm() can only be called on <form> elements");
                var p = new SubmitEvent("submit", d);
                if (c.dispatchEvent(p)) {
                  var y = d.submitter, x = null, _ = c.action;
                  if (y) {
                    var g = y.getAttribute("name");
                    g && (x = document.createElement("input"), x.type = "hidden", x.name = g, x.value = y.getAttribute("value"), c.appendChild(x));
                    var E = y.getAttribute("formaction");
                    E && (c.action = E);
                  }
                  try {
                    c.submit();
                  } finally {
                    x && c.removeChild(x), c.action = _;
                  }
                }
              }, this.focusFirstInvalid = function(c) {
                if (!(c instanceof HTMLFormElement))
                  throw new Error("focusFirstInvalid() can only be called on <form> elements");
                var d = h.getElementUID(c), p = h.formInputs[d], y = p?.find(function(_) {
                  return h.summary[_];
                });
                if (y) {
                  var x = h.elementByUID[y];
                  x instanceof HTMLElement && x.focus();
                }
              }, this.isValid = function(c, d, p) {
                if (d === void 0 && (d = !0), !(c instanceof HTMLFormElement))
                  throw new Error("isValid() can only be called on <form> elements");
                d && h.validateForm(c, p);
                var y = h.getElementUID(c), x = h.formInputs[y], _ = x?.some(function(g) {
                  return h.summary[g];
                }) === !0;
                return !_;
              }, this.isFieldValid = function(c, d, p) {
                d === void 0 && (d = !0), d && h.validateField(c, p);
                var y = h.getElementUID(c);
                return h.summary[y] === void 0;
              }, this.options = {
                root: document.body,
                watch: !1,
                addNoValidate: !0
              }, this.ValidationInputCssClassName = "input-validation-error", this.ValidationInputValidCssClassName = "input-validation-valid", this.ValidationMessageCssClassName = "field-validation-error", this.ValidationMessageValidCssClassName = "field-validation-valid", this.ValidationSummaryCssClassName = "validation-summary-errors", this.ValidationSummaryValidCssClassName = "validation-summary-valid", this.logger = u || a;
            }
            return b.prototype.addProvider = function(u, h) {
              this.providers[u] || (this.logger.log("Registered provider: %s", u), this.providers[u] = h);
            }, b.prototype.addMvcProviders = function() {
              var u = new w();
              this.addProvider("required", u.required), this.addProvider("length", u.stringLength), this.addProvider("maxlength", u.stringLength), this.addProvider("minlength", u.stringLength), this.addProvider("equalto", u.compare), this.addProvider("range", u.range), this.addProvider("regex", u.regex), this.addProvider("creditcard", u.creditcard), this.addProvider("email", u.email), this.addProvider("url", u.url), this.addProvider("phone", u.phone), this.addProvider("remote", u.remote);
            }, b.prototype.scanMessages = function(u, h) {
              for (var c = Array.from(u.querySelectorAll("span[form]")), d = 0, p = c; d < p.length; d++) {
                var y = p[d], x = document.getElementById(y.getAttribute("form"));
                x instanceof HTMLFormElement && h.call(this, x, y);
              }
              var _ = Array.from(u.querySelectorAll("form"));
              u instanceof HTMLFormElement && _.push(u);
              var g = u instanceof Element ? u.closest("form") : null;
              g && _.push(g);
              for (var E = 0, S = _; E < S.length; E++)
                for (var x = S[E], A = Array.from(x.querySelectorAll("[data-valmsg-for]")), C = 0, $ = A; C < $.length; C++) {
                  var y = $[C];
                  h.call(this, x, y);
                }
            }, b.prototype.pushValidationMessageSpan = function(u, h) {
              var c, d, p, y = this.getElementUID(u), x = (c = (p = this.messageFor)[y]) !== null && c !== void 0 ? c : p[y] = {}, _ = h.getAttribute("data-valmsg-for");
              if (_) {
                var g = (d = x[_]) !== null && d !== void 0 ? d : x[_] = [];
                g.indexOf(h) < 0 ? g.push(h) : this.logger.log("Validation element for '%s' is already tracked", name, h);
              }
            }, b.prototype.removeValidationMessageSpan = function(u, h) {
              var c = this.getElementUID(u), d = this.messageFor[c];
              if (d) {
                var p = h.getAttribute("data-valmsg-for");
                if (p) {
                  var y = d[p];
                  if (y) {
                    var x = y.indexOf(h);
                    x >= 0 ? y.splice(x, 1) : this.logger.log("Validation element for '%s' was already removed", name, h);
                  }
                }
              }
            }, b.prototype.parseDirectives = function(u) {
              for (var h = {}, c = {}, d = 9, p = 0; p < u.length; p++) {
                var y = u[p];
                if (y.name.indexOf("data-val-") === 0) {
                  var x = y.name.substr(d);
                  c[x] = y.value;
                }
              }
              var _ = function(g) {
                if (g.indexOf("-") === -1) {
                  for (var E = Object.keys(c).filter(function(R) {
                    return R !== g && R.indexOf(g) === 0;
                  }), S = {
                    error: c[g],
                    params: {}
                  }, A = (g + "-").length, C = 0; C < E.length; C++) {
                    var $ = c[E[C]], N = E[C].substr(A);
                    S.params[N] = $;
                  }
                  h[g] = S;
                }
              };
              for (var x in c)
                _(x);
              return h;
            }, b.prototype.guid4 = function() {
              return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(u) {
                var h = Math.random() * 16 | 0, c = u == "x" ? h : h & 3 | 8;
                return c.toString(16);
              });
            }, b.prototype.getElementUID = function(u) {
              var h = this.elementUIDs.filter(function(d) {
                return d.node === u;
              })[0];
              if (h)
                return h.uid;
              var c = this.guid4();
              return this.elementUIDs.push({
                node: u,
                uid: c
              }), this.elementByUID[c] = u, c;
            }, b.prototype.getFormValidationTask = function(u) {
              var h = this.formInputs[u];
              if (!h || h.length === 0)
                return Promise.resolve(!0);
              for (var c = [], d = 0, p = h; d < p.length; d++) {
                var y = p[d], x = this.validators[y];
                x && c.push(x);
              }
              var _ = c.map(function(g) {
                return g();
              });
              return Promise.all(_).then(function(g) {
                return g.every(function(E) {
                  return E;
                });
              });
            }, b.prototype.getMessageFor = function(u) {
              var h;
              if (u.form) {
                var c = this.getElementUID(u.form);
                return (h = this.messageFor[c]) === null || h === void 0 ? void 0 : h[u.name];
              }
            }, b.prototype.shouldValidate = function(u) {
              return !(u && u.submitter && u.submitter.formNoValidate);
            }, b.prototype.trackFormInput = function(u, h) {
              var c = this, d, p, y = this.getElementUID(u), x = (d = (p = this.formInputs)[y]) !== null && d !== void 0 ? d : p[y] = [], _ = x.indexOf(h) === -1;
              if (_ ? (x.push(h), this.options.addNoValidate ? (this.logger.log("Setting novalidate on form", u), u.setAttribute("novalidate", "novalidate")) : this.logger.log("Not setting novalidate on form", u)) : this.logger.log("Form input for UID '%s' is already tracked", h), !this.formEvents[y]) {
                var g = null, E = function(A, C) {
                  return g || (c.shouldValidate(A) ? (g = c.getFormValidationTask(y), A && c.preValidate(A), c.logger.log("Validating", u), g.then(function($) {
                    return n(c, void 0, void 0, function() {
                      var N;
                      return s(this, function(R) {
                        switch (R.label) {
                          case 0:
                            return this.logger.log("Validated (success = %s)", $, u), C ? (C($), [2, $]) : (N = new CustomEvent("validation", {
                              detail: { valid: $ }
                            }), u.dispatchEvent(N), [4, new Promise(function(U) {
                              return setTimeout(U, 0);
                            })]);
                          case 1:
                            return R.sent(), this.handleValidated(u, $, A), [2, $];
                        }
                      });
                    });
                  }).catch(function($) {
                    return c.logger.log("Validation error", $), !1;
                  }).finally(function() {
                    g = null;
                  })) : Promise.resolve(!0));
                };
                u.addEventListener("submit", E);
                var S = function(A) {
                  for (var C = c.formInputs[y], $ = 0, N = C; $ < N.length; $++) {
                    var R = N[$];
                    c.resetField(R);
                  }
                  c.renderSummary();
                };
                u.addEventListener("reset", S), E.remove = function() {
                  u.removeEventListener("submit", E), u.removeEventListener("reset", S);
                }, this.formEvents[y] = E;
              }
            }, b.prototype.reset = function(u) {
              this.isDisabled(u) ? this.resetField(this.getElementUID(u)) : this.scan(u);
            }, b.prototype.resetField = function(u) {
              var h = this.elementByUID[u];
              this.swapClasses(h, "", this.ValidationInputCssClassName), this.swapClasses(h, "", this.ValidationInputValidCssClassName);
              var c = o(h) && this.getMessageFor(h);
              if (c)
                for (var d = 0; d < c.length; d++)
                  c[d].innerHTML = "", this.swapClasses(c[d], "", this.ValidationMessageCssClassName), this.swapClasses(c[d], "", this.ValidationMessageValidCssClassName);
              delete this.summary[u];
            }, b.prototype.untrackFormInput = function(u, h) {
              var c, d = this.getElementUID(u), p = this.formInputs[d];
              if (p) {
                var y = p.indexOf(h);
                y >= 0 ? (p.splice(y, 1), p.length || ((c = this.formEvents[d]) === null || c === void 0 || c.remove(), delete this.formEvents[d], delete this.formInputs[d], delete this.messageFor[d])) : this.logger.log("Form input for UID '%s' was already removed", h);
              }
            }, b.prototype.addInput = function(u) {
              var h = this, c, d = this.getElementUID(u), p = this.parseDirectives(u.attributes);
              if (this.validators[d] = this.createValidator(u, p), u.form && this.trackFormInput(u.form, d), !this.inputEvents[d]) {
                var y = function(S, A) {
                  return n(h, void 0, void 0, function() {
                    var C, $, N;
                    return s(this, function(R) {
                      switch (R.label) {
                        case 0:
                          if (C = this.validators[d], !C)
                            return [2, !0];
                          if (!u.dataset.valEvent && S && S.type === "input" && !u.classList.contains(this.ValidationInputCssClassName))
                            return [2, !0];
                          this.logger.log("Validating", { event: S }), R.label = 1;
                        case 1:
                          return R.trys.push([1, 3, , 4]), [4, C()];
                        case 2:
                          return $ = R.sent(), A($), [2, $];
                        case 3:
                          return N = R.sent(), this.logger.log("Validation error", N), [2, !1];
                        case 4:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }, x = null;
                y.debounced = function(S, A) {
                  x !== null && clearTimeout(x), x = setTimeout(function() {
                    y(S, A);
                  }, h.debounce);
                };
                var _ = u instanceof HTMLSelectElement ? "change" : "input change", g = (c = u.dataset.valEvent) !== null && c !== void 0 ? c : _, E = g.split(" ");
                E.forEach(function(S) {
                  u.addEventListener(S, y.debounced);
                }), y.remove = function() {
                  E.forEach(function(S) {
                    u.removeEventListener(S, y.debounced);
                  });
                }, this.inputEvents[d] = y;
              }
            }, b.prototype.removeInput = function(u) {
              var h = this.getElementUID(u), c = this.inputEvents[h];
              c?.remove && (c.remove(), delete c.remove), delete this.summary[h], delete this.inputEvents[h], delete this.validators[h], u.form && this.untrackFormInput(u.form, h);
            }, b.prototype.scanInputs = function(u, h) {
              var c = Array.from(u.querySelectorAll(f('[data-val="true"]')));
              o(u) && u.getAttribute("data-val") === "true" && c.push(u);
              for (var d = 0; d < c.length; d++) {
                var p = c[d];
                h.call(this, p);
              }
            }, b.prototype.createSummaryDOM = function() {
              if (!Object.keys(this.summary).length)
                return null;
              var u = [], h = document.createElement("ul");
              for (var c in this.summary) {
                var d = this.elementByUID[c];
                if (!(d instanceof HTMLInputElement && (d.type === "checkbox" || d.type === "radio") && d.className === this.ValidationInputValidCssClassName) && !(u.indexOf(this.summary[c]) > -1)) {
                  var p = document.createElement("li");
                  p.innerHTML = this.summary[c], h.appendChild(p), u.push(this.summary[c]);
                }
              }
              return h;
            }, b.prototype.renderSummary = function() {
              var u = document.querySelectorAll('[data-valmsg-summary="true"]');
              if (u.length) {
                var h = JSON.stringify(this.summary, Object.keys(this.summary).sort());
                if (h !== this.renderedSummaryJSON) {
                  this.renderedSummaryJSON = h;
                  for (var c = this.createSummaryDOM(), d = 0; d < u.length; d++) {
                    for (var p = u[d], y = p.querySelectorAll("ul"), x = 0; x < y.length; x++)
                      y[x].remove();
                    c && c.hasChildNodes() ? (this.swapClasses(p, this.ValidationSummaryCssClassName, this.ValidationSummaryValidCssClassName), p.appendChild(c.cloneNode(!0))) : this.swapClasses(p, this.ValidationSummaryValidCssClassName, this.ValidationSummaryCssClassName);
                  }
                }
              }
            }, b.prototype.addError = function(u, h) {
              var c = this.getMessageFor(u);
              if (c)
                for (var d = 0; d < c.length; d++)
                  c[d], c[d].innerHTML = h, this.swapClasses(c[d], this.ValidationMessageCssClassName, this.ValidationMessageValidCssClassName);
              if (this.highlight(u, this.ValidationInputCssClassName, this.ValidationInputValidCssClassName), u.form)
                for (var p = u.form.querySelectorAll(f('[name="'.concat(u.name, '"]'))), d = 0; d < p.length; d++) {
                  this.swapClasses(p[d], this.ValidationInputCssClassName, this.ValidationInputValidCssClassName);
                  var y = this.getElementUID(p[d]);
                  this.summary[y] = h;
                }
              this.renderSummary();
            }, b.prototype.removeError = function(u) {
              var h = this.getMessageFor(u);
              if (h)
                for (var c = 0; c < h.length; c++)
                  h[c].innerHTML = "", this.swapClasses(h[c], this.ValidationMessageValidCssClassName, this.ValidationMessageCssClassName);
              if (this.unhighlight(u, this.ValidationInputCssClassName, this.ValidationInputValidCssClassName), u.form)
                for (var d = u.form.querySelectorAll(f('[name="'.concat(u.name, '"]'))), c = 0; c < d.length; c++) {
                  this.swapClasses(d[c], this.ValidationInputValidCssClassName, this.ValidationInputCssClassName);
                  var p = this.getElementUID(d[c]);
                  delete this.summary[p];
                }
              this.renderSummary();
            }, b.prototype.createValidator = function(u, h) {
              var c = this;
              return function() {
                return n(c, void 0, void 0, function() {
                  var d, p, y, x, _, g, E, S, A, C, $;
                  return s(this, function(N) {
                    switch (N.label) {
                      case 0:
                        if (!(!this.isHidden(u) && !this.isDisabled(u))) return [3, 7];
                        d = h, p = [];
                        for (y in d)
                          p.push(y);
                        x = 0, N.label = 1;
                      case 1:
                        return x < p.length ? (y = p[x], y in d ? (_ = y, g = h[_], E = this.providers[_], E ? (this.logger.log("Running %s validator on element", _, u), S = E(u.value, u, g.params), A = !1, C = g.error, typeof S != "boolean" ? [3, 2] : (A = S, [3, 5])) : (this.logger.log("aspnet-validation provider not implemented: %s", _), [3, 6])) : [3, 6]) : [3, 7];
                      case 2:
                        return typeof S != "string" ? [3, 3] : (A = !1, C = S, [3, 5]);
                      case 3:
                        return [4, S];
                      case 4:
                        $ = N.sent(), typeof $ == "boolean" ? A = $ : (A = !1, C = $), N.label = 5;
                      case 5:
                        if (!A)
                          return this.addError(u, C), [2, !1];
                        N.label = 6;
                      case 6:
                        return x++, [3, 1];
                      case 7:
                        return this.removeError(u), [2, !0];
                    }
                  });
                });
              };
            }, b.prototype.isHidden = function(u) {
              return !(this.allowHiddenFields || u.offsetWidth || u.offsetHeight || u.getClientRects().length);
            }, b.prototype.isDisabled = function(u) {
              return u.disabled;
            }, b.prototype.swapClasses = function(u, h, c) {
              h && !this.isDisabled(u) && !u.classList.contains(h) && u.classList.add(h), u.classList.contains(c) && u.classList.remove(c);
            }, b.prototype.bootstrap = function(u) {
              var h = this;
              Object.assign(this.options, u), this.addMvcProviders();
              var c = window.document, d = this.options.root, p = function() {
                h.scan(d), h.options.watch && h.watch(d);
              };
              c.readyState === "complete" || c.readyState === "interactive" ? p() : c.addEventListener("DOMContentLoaded", p);
            }, b.prototype.scan = function(u) {
              u ?? (u = this.options.root), this.logger.log("Scanning", u), this.scanMessages(u, this.pushValidationMessageSpan), this.scanInputs(u, this.addInput);
            }, b.prototype.remove = function(u) {
              u ?? (u = this.options.root), this.logger.log("Removing", u), this.scanMessages(u, this.removeValidationMessageSpan), this.scanInputs(u, this.removeInput);
            }, b.prototype.watch = function(u) {
              var h = this;
              u ?? (u = this.options.root), this.observer = new MutationObserver(function(c) {
                c.forEach(function(d) {
                  h.observed(d);
                });
              }), this.observer.observe(u, {
                attributes: !0,
                childList: !0,
                subtree: !0
              }), this.logger.log("Watching for mutations");
            }, b.prototype.observed = function(u) {
              var h, c, d;
              if (u.type === "childList") {
                for (var p = 0; p < u.addedNodes.length; p++) {
                  var y = u.addedNodes[p];
                  this.logger.log("Added node", y), y instanceof HTMLElement && this.scan(y);
                }
                for (var p = 0; p < u.removedNodes.length; p++) {
                  var y = u.removedNodes[p];
                  this.logger.log("Removed node", y), y instanceof HTMLElement && this.remove(y);
                }
              } else if (u.type === "attributes" && u.target instanceof HTMLElement) {
                var x = u.attributeName;
                if (x === "disabled") {
                  var _ = u.target;
                  this.reset(_);
                } else {
                  var g = (h = u.oldValue) !== null && h !== void 0 ? h : "", E = (d = (c = u.target.attributes[u.attributeName]) === null || c === void 0 ? void 0 : c.value) !== null && d !== void 0 ? d : "";
                  this.logger.log("Attribute '%s' changed from '%s' to '%s'", u.attributeName, g, E, u.target), g !== E && this.scan(u.target);
                }
              }
            }, b.prototype.highlight = function(u, h, c) {
              this.swapClasses(u, h, c);
            }, b.prototype.unhighlight = function(u, h, c) {
              this.swapClasses(u, c, h);
            }, b;
          })()
        );
        return r;
      })()
    ));
  })(mi)), mi.exports;
}
var mc = pc();
function gc(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function vc(t, e) {
  for (var i = 0; i < e.length; i++) {
    var r = e[i];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
  }
}
function yc(t, e, i) {
  return e && vc(t.prototype, e), t;
}
var bc = Object.defineProperty, xe = function(t, e) {
  return bc(t, "name", { value: e, configurable: !0 });
}, wc = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, xc = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Ic = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ec = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Tc = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, _c = xe(function(t) {
  return new DOMParser().parseFromString(t, "text/html").body.childNodes[0];
}, "stringToHTML"), pt = xe(function(t) {
  var e = new DOMParser().parseFromString(t, "application/xml");
  return document.importNode(e.documentElement, !0).outerHTML;
}, "getSvgNode"), B = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, Ee = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, jr = { OUTLINE: "outline", FILLED: "filled" }, gi = { FADE: "fade", SLIDE: "slide" }, mt = { CLOSE: pt(wc), SUCCESS: pt(Ec), ERROR: pt(xc), WARNING: pt(Tc), INFO: pt(Ic) }, Yr = xe(function(t) {
  t.wrapper.classList.add(B.NOTIFY_FADE), setTimeout(function() {
    t.wrapper.classList.add(B.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), Kr = xe(function(t) {
  t.wrapper.classList.remove(B.NOTIFY_FADE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "fadeOut"), Sc = xe(function(t) {
  t.wrapper.classList.add(B.NOTIFY_SLIDE), setTimeout(function() {
    t.wrapper.classList.add(B.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Cc = xe(function(t) {
  t.wrapper.classList.remove(B.NOTIFY_SLIDE_IN), setTimeout(function() {
    t.wrapper.remove();
  }, t.speed);
}, "slideOut"), Ls = (function() {
  function t(e) {
    var i = this;
    gc(this, t), this.notifyOut = xe(function(Y) {
      Y(i);
    }, "notifyOut");
    var r = e.notificationsGap, n = r === void 0 ? 20 : r, s = e.notificationsPadding, a = s === void 0 ? 20 : s, o = e.status, l = o === void 0 ? "success" : o, f = e.effect, m = f === void 0 ? gi.FADE : f, w = e.type, T = w === void 0 ? "outline" : w, b = e.title, u = e.text, h = e.showIcon, c = h === void 0 ? !0 : h, d = e.customIcon, p = d === void 0 ? "" : d, y = e.customClass, x = y === void 0 ? "" : y, _ = e.speed, g = _ === void 0 ? 500 : _, E = e.showCloseButton, S = E === void 0 ? !0 : E, A = e.autoclose, C = A === void 0 ? !0 : A, $ = e.autotimeout, N = $ === void 0 ? 3e3 : $, R = e.position, U = R === void 0 ? "right top" : R, z = e.customWrapper, Q = z === void 0 ? "" : z;
    if (this.customWrapper = Q, this.status = l, this.title = b, this.text = u, this.showIcon = c, this.customIcon = p, this.customClass = x, this.speed = g, this.effect = m, this.showCloseButton = S, this.autoclose = C, this.autotimeout = N, this.notificationsGap = n, this.notificationsPadding = a, this.type = T, this.position = U, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return yc(t, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(B.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(B.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](B.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](B.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](B.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](B.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](B.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](B.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](B.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, r = document.createElement("div");
    r.classList.add(B.NOTIFY_CLOSE), r.innerHTML = mt.CLOSE, this.wrapper.appendChild(r), r.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = _c(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(B.NOTIFY), this.type) {
      case jr.OUTLINE:
        this.wrapper.classList.add(B.NOTIFY_OUTLINE);
        break;
      case jr.FILLED:
        this.wrapper.classList.add(B.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(B.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case Ee.SUCCESS:
        this.wrapper.classList.add(B.NOTIFY_SUCCESS);
        break;
      case Ee.ERROR:
        this.wrapper.classList.add(B.NOTIFY_ERROR);
        break;
      case Ee.WARNING:
        this.wrapper.classList.add(B.NOTIFY_WARNING);
        break;
      case Ee.INFO:
        this.wrapper.classList.add(B.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(B.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(r) {
      i.wrapper.classList.add(r);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(B.NOTIFY_CONTENT);
    var r, n;
    this.title && (r = document.createElement("div"), r.classList.add(B.NOTIFY_TITLE), r.textContent = this.title.trim(), this.showCloseButton || (r.style.paddingRight = "0")), this.text && (n = document.createElement("div"), n.classList.add(B.NOTIFY_TEXT), n.innerHTML = this.text.trim(), this.title || (n.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(r), this.text && i.appendChild(n);
  } }, { key: "setIcon", value: function() {
    var i = xe(function(n) {
      switch (n) {
        case Ee.SUCCESS:
          return mt.SUCCESS;
        case Ee.ERROR:
          return mt.ERROR;
        case Ee.WARNING:
          return mt.WARNING;
        case Ee.INFO:
          return mt.INFO;
      }
    }, "computedIcon"), r = document.createElement("div");
    r.classList.add(B.NOTIFY_ICON), r.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(r);
  } }, { key: "setObserver", value: function() {
    var i = this, r = new IntersectionObserver(function(n) {
      if (n[0].intersectionRatio <= 0) i.close();
      else return;
    }, { threshold: 0 });
    setTimeout(function() {
      r.observe(i.wrapper);
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
      case gi.FADE:
        this.selectedNotifyInEffect = Yr, this.selectedNotifyOutEffect = Kr;
        break;
      case gi.SLIDE:
        this.selectedNotifyInEffect = Sc, this.selectedNotifyOutEffect = Cc;
        break;
      default:
        this.selectedNotifyInEffect = Yr, this.selectedNotifyOutEffect = Kr;
    }
  } }]), t;
})();
xe(Ls, "Notify");
var Fs = Ls;
globalThis.Notify = Fs;
const Rs = ["success", "error", "warning", "info"], zs = [
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
], Vs = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function gt(t = {}) {
  const e = {
    ...Vs,
    ...t
  };
  Rs.includes(e.status) || (console.warn(`Invalid status '${e.status}' passed to Toast. Defaulting to 'info'.`), e.status = "info"), zs.includes(e.position) || (console.warn(`Invalid position '${e.position}' passed to Toast. Defaulting to 'right top'.`), e.position = "right top"), new Fs(e);
}
const Ac = {
  custom: gt,
  success(t, e = "Success", i = {}) {
    gt({
      status: "success",
      title: e,
      text: t,
      ...i
    });
  },
  error(t, e = "Error", i = {}) {
    gt({
      status: "error",
      title: e,
      text: t,
      ...i
    });
  },
  warning(t, e = "Warning", i = {}) {
    gt({
      status: "warning",
      title: e,
      text: t,
      ...i
    });
  },
  info(t, e = "Info", i = {}) {
    gt({
      status: "info",
      title: e,
      text: t,
      ...i
    });
  },
  setDefaults(t = {}) {
    Object.assign(Vs, t);
  },
  get allowedStatuses() {
    return [...Rs];
  },
  get allowedPositions() {
    return [...zs];
  }
}, Li = function() {
}, Et = {}, Jt = {}, Tt = {};
function $c(t, e) {
  t = Array.isArray(t) ? t : [t];
  const i = [];
  let r = t.length, n = r, s, a, o, l;
  for (s = function(f, m) {
    m.length && i.push(f), n--, n || e(i);
  }; r--; ) {
    if (a = t[r], o = Jt[a], o) {
      s(a, o);
      continue;
    }
    l = Tt[a] = Tt[a] || [], l.push(s);
  }
}
function Us(t, e) {
  if (!t) return;
  const i = Tt[t];
  if (Jt[t] = e, !!i)
    for (; i.length; )
      i[0](t, e), i.splice(0, 1);
}
function Fi(t, e) {
  typeof t == "function" && (t = { success: t }), e.length ? (t.error || Li)(e) : (t.success || Li)(t);
}
function Oc(t, e, i, r, n, s, a, o) {
  let l = t.type[0];
  if (o)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (f) {
      f.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < a)
      return Bs(e, r, n, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  r(e, l, t.defaultPrevented);
}
function Bs(t, e, i, r) {
  const n = document, s = i.async, a = (i.numRetries || 0) + 1, o = i.before || Li, l = t.replace(/[\?|#].*$/, ""), f = t.replace(/^(css|img|module|nomodule)!/, "");
  let m, w, T;
  if (r = r || 0, /(^css!|\.css$)/.test(l))
    T = n.createElement("link"), T.rel = "stylesheet", T.href = f, m = "hideFocus" in T, m && T.relList && (m = 0, T.rel = "preload", T.as = "style"), i.inlineStyleNonce && T.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    T = n.createElement("img"), T.src = f;
  else if (T = n.createElement("script"), T.src = f, T.async = s === void 0 ? !0 : s, i.inlineScriptNonce && T.setAttribute("nonce", i.inlineScriptNonce), w = "noModule" in T, /^module!/.test(l)) {
    if (!w) return e(t, "l");
    T.type = "module";
  } else if (/^nomodule!/.test(l) && w)
    return e(t, "l");
  const b = function(u) {
    Oc(u, t, T, e, i, r, a, m);
  };
  T.addEventListener("load", b, { once: !0 }), T.addEventListener("error", b, { once: !0 }), o(t, T) !== !1 && n.head.appendChild(T);
}
function kc(t, e, i) {
  t = Array.isArray(t) ? t : [t];
  let r = t.length, n = [];
  function s(a, o, l) {
    if (o === "e" && n.push(a), o === "b")
      if (l) n.push(a);
      else return;
    r--, r || e(n);
  }
  for (let a = 0; a < t.length; a++)
    Bs(t[a], s, i);
}
function _e(t, e, i) {
  let r, n;
  if (e && typeof e == "string" && e.trim && (r = e.trim()), n = (r ? i : e) || {}, r) {
    if (r in Et)
      throw "LoadJS";
    Et[r] = !0;
  }
  function s(a, o) {
    kc(t, function(l) {
      Fi(n, l), a && Fi({ success: a, error: o }, l), Us(r, l);
    }, n);
  }
  if (n.returnPromise)
    return new Promise(s);
  s();
}
_e.ready = function(e, i) {
  return $c(e, function(r) {
    Fi(i, r);
  }), _e;
};
_e.done = function(e) {
  Us(e, []);
};
_e.reset = function() {
  Object.keys(Et).forEach((e) => delete Et[e]), Object.keys(Jt).forEach((e) => delete Jt[e]), Object.keys(Tt).forEach((e) => delete Tt[e]);
};
_e.isDefined = function(e) {
  return e in Et;
};
function Mc(t) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (t instanceof Element) {
    const e = Nc(t) || t;
    let i = Alpine.$data(e);
    if (i === void 0) {
      const r = e.closest?.("[x-data]");
      r && (i = Alpine.$data(r));
    }
    return i === void 0 && Jr("element", e), i;
  }
  if (typeof t == "string") {
    const e = t.trim();
    if (!e) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${Ws(e)}"]`;
    let r = null;
    const n = document.getElementById(e);
    if (n && (r = n.matches(i) ? n : n.querySelector(i)), r || (r = Hs(e)), !r) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${e}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(r);
    return s === void 0 && Jr(`data-alpine-root="${e}"`, r), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Nc(t) {
  if (!(t instanceof Element)) return null;
  const e = t.tagName?.toLowerCase?.() === "rz-proxy", i = t.getAttribute?.("data-for");
  if (e || i) {
    const r = i || "";
    if (!r) return t;
    const n = Hs(r);
    return n || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${r}". Ensure the teleported root rendered with data-alpine-root="${r}".`
    ), null);
  }
  return t;
}
function Hs(t) {
  const e = `[data-alpine-root="${Ws(t)}"]`, i = document.querySelectorAll(e);
  for (const r of i)
    if (r.hasAttribute("x-data")) return r;
  return i.length > 0 ? i[0] : document.getElementById(t) || null;
}
function Ws(t) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(t);
  } catch {
  }
  return String(t).replace(/"/g, '\\"');
}
function Jr(t, e) {
  const i = `${e.tagName?.toLowerCase?.() || "node"}${e.id ? "#" + e.id : ""}${e.classList?.length ? "." + Array.from(e.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${t} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function Dc(t) {
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
function Pc(t) {
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
      typeof this.selected < "u" && typeof this.allowMultiple < "u" ? this.$watch("selected", (i, r) => {
        i !== e.sectionId && !e.allowMultiple && (e.open = !1);
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
function Lc(t) {
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
function Fc(t) {
  t.data("rzAspectRatio", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
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
function Rc(t) {
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
function zc(t, e) {
  t.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), r = this.$el.dataset.configId, n = this.$el.dataset.nonce;
      if (i.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      e(i, {
        success: () => {
          this.initCalendar(r);
        },
        error: (s) => console.error("RzCalendar: Failed to load assets", s)
      }, n);
    },
    /**
     * Executes the `initCalendar` operation.
     * @param {any} configId Input value for this method.
     * @returns {any} Returns the result of `initCalendar` when applicable.
     */
    initCalendar(i) {
      const r = document.getElementById(i);
      if (!r) {
        console.error(`RzCalendar: Config element #${i} not found.`);
        return;
      }
      let n = {};
      try {
        n = JSON.parse(r.textContent);
      } catch (o) {
        console.error("RzCalendar: Failed to parse config JSON", o);
        return;
      }
      const s = {
        onClickDate: (o, l) => {
          this.dispatchCalendarEvent("click-day", {
            event: l,
            dates: o.context.selectedDates
          });
        },
        onClickWeekNumber: (o, l, f, m, w) => {
          this.dispatchCalendarEvent("click-week-number", {
            event: w,
            number: l,
            year: f,
            days: m
          });
        },
        onClickMonth: (o, l) => {
          this.dispatchCalendarEvent("click-month", {
            event: l,
            month: o.context.selectedMonth
          });
        },
        onClickYear: (o, l) => {
          this.dispatchCalendarEvent("click-year", {
            event: l,
            year: o.context.selectedYear
          });
        },
        onClickArrow: (o, l) => {
          this.dispatchCalendarEvent("click-arrow", {
            event: l,
            year: o.context.selectedYear,
            month: o.context.selectedMonth
          });
        },
        onChangeTime: (o, l, f) => {
          this.dispatchCalendarEvent("change-time", {
            event: l,
            time: o.context.selectedTime,
            hours: o.context.selectedHours,
            minutes: o.context.selectedMinutes,
            keeping: o.context.selectedKeeping,
            isError: f
          });
        }
      }, a = {
        ...n.options,
        styles: n.styles,
        ...s
      };
      window.VanillaCalendarPro ? (this.calendar = new VanillaCalendarPro.Calendar(this.$refs.calendarEl, a), this.calendar.init(), this.initialized = !0, this.dispatchCalendarEvent("init", { instance: this.calendar })) : console.error("RzCalendar: VanillaCalendar global not found.");
    },
    /**
     * Executes the `dispatchCalendarEvent` operation.
     * @param {any} eventName Input value for this method.
     * @param {any} detail Input value for this method.
     * @returns {any} Returns the result of `dispatchCalendarEvent` when applicable.
     */
    dispatchCalendarEvent(i, r) {
      this.$dispatch(`rz:calendar:${i}`, r);
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
function Vc(t) {
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
        const n = JSON.parse(this.$el.dataset.initialDates || "[]");
        this.dates = this._normalize(n);
      } catch {
        this.dates = [];
      }
      const e = (n) => {
        this.calendarApi = n.detail.instance, this.syncToCalendar();
      };
      this.$el.addEventListener("rz:calendar:init", e), this._handlers.push({ type: "rz:calendar:init", fn: e });
      const i = () => {
        this.calendarApi = null, this._lastAppliedState = null;
      };
      this.$el.addEventListener("rz:calendar:destroy", i), this._handlers.push({ type: "rz:calendar:destroy", fn: i });
      const r = (n) => {
        this._isUpdatingFromCalendar = !0;
        const s = this.isRangeComplete;
        this.dates = this._normalize(n.detail.dates || []), !s && this.isRangeComplete && this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
          detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
          bubbles: !0,
          composed: !0
        })), this.$nextTick(() => this._isUpdatingFromCalendar = !1);
      };
      this.$el.addEventListener("rz:calendar:click-day", r), this._handlers.push({ type: "rz:calendar:click-day", fn: r }), this.$watch("dates", () => {
        if (this._isUpdatingFromCalendar) return;
        const n = Array.isArray(this.dates) ? this.dates : [], s = this._normalize(n);
        if (!Array.isArray(this.dates) || s.length !== this.dates.length || s.some((o, l) => o !== this.dates[l])) {
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
        const o = this.dates[0], l = this.dates[this.dates.length - 1];
        e = [`${o}:${l}`];
      }
      let i, r, n = !1;
      if (this.dates.length > 0) {
        const o = this.parseIsoLocal(this.dates[0]);
        isNaN(o.getTime()) || (i = o.getMonth(), r = o.getFullYear(), n = !0);
      }
      const s = JSON.stringify({ mode: this.mode, dates: e, m: i, y: r });
      if (this._lastAppliedState === s) return;
      this._lastAppliedState = s;
      const a = { selectedDates: e };
      n && (a.selectedMonth = i, a.selectedYear = r), this.calendarApi.set(
        a,
        {
          dates: !0,
          month: n,
          year: n,
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
      const [i, r, n] = e.split("-").map(Number), s = new Date(Date.UTC(i, r - 1, n));
      return s.getUTCFullYear() === i && s.getUTCMonth() + 1 === r && s.getUTCDate() === n;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(e) {
      const r = (Array.isArray(e) ? e : []).flat(1 / 0).flatMap((n) => typeof n == "string" ? this._extractIsoDates(n) : []).filter((n) => this._isValidIsoDate(n));
      if (this.mode === "single")
        return [...new Set(r)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const n = r.sort();
        return n.length <= 1 ? n : [n[0], n[n.length - 1]];
      }
      return [...new Set(r)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(e) {
      const [i, r, n] = e.split("-").map(Number);
      return new Date(i, r - 1, n);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(e) {
      const i = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
      return `${i}-${r}-${n}`;
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
      const i = this.parseIsoLocal(this.dates[0]);
      isNaN(i.getTime()) || (i.setDate(i.getDate() + e), this.dates = this._normalize([this.toLocalISO(i)]));
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
      let i;
      this.dates.includes(e) ? i = this.dates.filter((r) => r !== e) : i = [...this.dates, e], this.dates = this._normalize(i);
    }
  }));
}
function Uc(t, e) {
  function i(r) {
    if (!r) return {};
    const n = document.getElementById(r);
    if (!n)
      return console.warn(`[rzCarousel] JSON script element #${r} not found.`), {};
    try {
      return JSON.parse(n.textContent || "{}");
    } catch (s) {
      return console.error(`[rzCarousel] Failed to parse JSON from #${r}:`, s), {};
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
      const r = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (f) {
          return console.error("[rzCarousel] Bad assets JSON:", f), [];
        }
      })(), n = this.$el.dataset.nonce || "", s = i(this.$el.dataset.config), a = s.Options || {}, o = s.Plugins || [], l = this;
      r.length > 0 && typeof e == "function" ? e(
        r,
        {
          /**
           * Executes the `success` operation.
           * @returns {any} Returns the result of `success` when applicable.
           */
          success() {
            window.EmblaCarousel ? l.initializeEmbla(a, o) : console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
          },
          /**
           * Executes the `error` operation.
           * @param {any} err Input value for this method.
           * @returns {any} Returns the result of `error` when applicable.
           */
          error(f) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", f);
          }
        },
        n
      ) : window.EmblaCarousel ? this.initializeEmbla(a, o) : console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
    },
    /**
     * Executes the `initializeEmbla` operation.
     * @param {any} options Input value for this method.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `initializeEmbla` when applicable.
     */
    initializeEmbla(r, n) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const a = this.instantiatePlugins(n);
      this.emblaApi = window.EmblaCarousel(s, r, a), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
    instantiatePlugins(r) {
      return !Array.isArray(r) || r.length === 0 ? [] : r.map((n) => {
        const s = window[n.Name];
        if (typeof s != "function")
          return console.error(`[rzCarousel] Plugin constructor '${n.Name}' not found on window object.`), null;
        try {
          return s(n.Options || {});
        } catch (a) {
          return console.error(`[rzCarousel] Error instantiating plugin '${n.Name}':`, a), null;
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
    scrollTo(r) {
      this.emblaApi?.scrollTo(r);
    }
  }));
}
function Bc(t, e) {
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
      const i = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.codeid, n = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, e(i, {
        success: function() {
          const s = document.getElementById(r);
          window.hljs && s && window.hljs.highlightElement(s);
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, n);
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
function Hc(t) {
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
function Wc(t) {
  t.data("rzClipboard", () => ({
    value: null,
    targetSelector: null,
    preferValue: !1,
    feedbackDuration: 1200,
    useFallback: !0,
    disabled: !1,
    copied: !1,
    timeoutHandle: null,
    get notCopied() {
      return !this.copied;
    },
    init() {
      this.value = this.$el.dataset.copyValue || null, this.targetSelector = this.$el.dataset.targetSelector || null, this.preferValue = this.$el.dataset.preferValue === "true", this.feedbackDuration = parseInt(this.$el.dataset.feedbackDuration, 10) || 1200, this.useFallback = this.$el.dataset.useFallback === "true", this.disabled = this.$el.dataset.disabled === "true";
    },
    getTextToCopy() {
      if (this.preferValue && this.value) return this.value;
      if (this.targetSelector) {
        const e = document.querySelector(this.targetSelector);
        if (e)
          return e.value !== void 0 ? e.value : e.textContent;
      }
      return this.value;
    },
    async copy() {
      if (this.disabled) return;
      const e = this.getTextToCopy(), i = e ? e.trim() : "";
      if (!i) {
        this.dispatchFailed("empty-text");
        return;
      }
      try {
        navigator.clipboard && window.isSecureContext ? (await navigator.clipboard.writeText(i), this.onSuccess(i)) : this.useFallback ? this.fallbackCopy(i) ? this.onSuccess(i) : this.dispatchFailed("clipboard-unavailable") : this.dispatchFailed("clipboard-unavailable");
      } catch (r) {
        this.dispatchFailed("permission-denied", r);
      }
    },
    onSuccess(e) {
      this.copied = !0, this.$dispatch("rz:copy", { id: this.$el.dataset.alpineRoot, text: e }), this.timeoutHandle && clearTimeout(this.timeoutHandle), this.timeoutHandle = setTimeout(() => {
        this.copied = !1;
      }, this.feedbackDuration);
    },
    fallbackCopy(e) {
      const i = document.createElement("textarea");
      i.value = e, i.style.position = "fixed", i.style.left = "-999999px", i.style.top = "-999999px", document.body.appendChild(i), i.focus(), i.select();
      try {
        return document.execCommand("copy"), i.remove(), !0;
      } catch {
        return i.remove(), !1;
      }
    },
    dispatchFailed(e, i = null) {
      this.$dispatch("rz:copy-failed", {
        id: this.$el.dataset.alpineRoot,
        reason: e,
        error: i
      });
    }
  }));
}
function qc(t) {
  t.data("rzBackToTop", () => ({
    visible: !1,
    threshold: 300,
    _rafPending: !1,
    _onScroll: null,
    init() {
      const e = Number(this.$el.dataset.threshold);
      this.threshold = Number.isFinite(e) ? e : 300, this._onScroll = () => {
        this._rafPending || (this._rafPending = !0, window.requestAnimationFrame(() => {
          this.visible = window.scrollY > this.threshold, this._rafPending = !1;
        }));
      }, window.addEventListener("scroll", this._onScroll, { passive: !0 }), this._onScroll();
    },
    scrollToTop() {
      const i = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.scrollTo({ top: 0, behavior: i });
    },
    destroy() {
      this._onScroll && window.removeEventListener("scroll", this._onScroll);
    }
  }));
}
function jc(t, e) {
  t.data("rzCombobox", () => ({
    tomSelect: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), r = this.$el.dataset.nonce;
      i.length > 0 && typeof e == "function" ? e(i, {
        success: () => this.initTomSelect(),
        error: (n) => console.error("RzCombobox: Failed to load assets.", n)
      }, r) : window.TomSelect && this.initTomSelect();
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const i = this.$refs.selectInput;
      if (!i) return;
      const r = document.getElementById(this.$el.dataset.configId), n = r ? JSON.parse(r.textContent) : {}, s = {}, a = (o, l) => {
        if (!o) return null;
        const f = document.createElement("div");
        let m = l.item;
        if (typeof m == "string")
          try {
            m = JSON.parse(m);
          } catch {
          }
        const w = {
          ...l,
          item: m
        };
        return t && typeof t.addScopeToNode == "function" ? t.addScopeToNode(f, w) : f._x_dataStack = [w], f.innerHTML = o.innerHTML, f;
      };
      this.$refs.optionTemplate && (s.option = (o, l) => a(this.$refs.optionTemplate, o)), this.$refs.itemTemplate && (s.item = (o, l) => a(this.$refs.itemTemplate, o)), n.dataAttr = "data-item", this.tomSelect = new TomSelect(i, {
        ...n,
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
var ur = {};
(function t(e, i, r, n) {
  var s = !!(e.Worker && e.Blob && e.Promise && e.OffscreenCanvas && e.OffscreenCanvasRenderingContext2D && e.HTMLCanvasElement && e.HTMLCanvasElement.prototype.transferControlToOffscreen && e.URL && e.URL.createObjectURL), a = typeof Path2D == "function" && typeof DOMMatrix == "function", o = (function() {
    if (!e.OffscreenCanvas)
      return !1;
    try {
      var I = new OffscreenCanvas(1, 1), v = I.getContext("2d");
      v.fillRect(0, 0, 1, 1);
      var O = I.transferToImageBitmap();
      v.createPattern(O, "no-repeat");
    } catch {
      return !1;
    }
    return !0;
  })();
  function l() {
  }
  function f(I) {
    var v = i.exports.Promise, O = v !== void 0 ? v : e.Promise;
    return typeof O == "function" ? new O(I) : (I(l, l), null);
  }
  var m = /* @__PURE__ */ (function(I, v) {
    return {
      transform: function(O) {
        if (I)
          return O;
        if (v.has(O))
          return v.get(O);
        var M = new OffscreenCanvas(O.width, O.height), D = M.getContext("2d");
        return D.drawImage(O, 0, 0), v.set(O, M), M;
      },
      clear: function() {
        v.clear();
      }
    };
  })(o, /* @__PURE__ */ new Map()), w = (function() {
    var I = Math.floor(16.666666666666668), v, O, M = {}, D = 0;
    return typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function" ? (v = function(P) {
      var L = Math.random();
      return M[L] = requestAnimationFrame(function k(F) {
        D === F || D + I - 1 < F ? (D = F, delete M[L], P()) : M[L] = requestAnimationFrame(k);
      }), L;
    }, O = function(P) {
      M[P] && cancelAnimationFrame(M[P]);
    }) : (v = function(P) {
      return setTimeout(P, I);
    }, O = function(P) {
      return clearTimeout(P);
    }), { frame: v, cancel: O };
  })(), T = /* @__PURE__ */ (function() {
    var I, v, O = {};
    function M(D) {
      function P(L, k) {
        D.postMessage({ options: L || {}, callback: k });
      }
      D.init = function(k) {
        var F = k.transferControlToOffscreen();
        D.postMessage({ canvas: F }, [F]);
      }, D.fire = function(k, F, H) {
        if (v)
          return P(k, null), v;
        var K = Math.random().toString(36).slice(2);
        return v = f(function(W) {
          function J(ee) {
            ee.data.callback === K && (delete O[K], D.removeEventListener("message", J), v = null, m.clear(), H(), W());
          }
          D.addEventListener("message", J), P(k, K), O[K] = J.bind(null, { data: { callback: K } });
        }), v;
      }, D.reset = function() {
        D.postMessage({ reset: !0 });
        for (var k in O)
          O[k](), delete O[k];
      };
    }
    return function() {
      if (I)
        return I;
      if (!r && s) {
        var D = [
          "var CONFETTI, SIZE = {}, module = {};",
          "(" + t.toString() + ")(this, module, true, SIZE);",
          "onmessage = function(msg) {",
          "  if (msg.data.options) {",
          "    CONFETTI(msg.data.options).then(function () {",
          "      if (msg.data.callback) {",
          "        postMessage({ callback: msg.data.callback });",
          "      }",
          "    });",
          "  } else if (msg.data.reset) {",
          "    CONFETTI && CONFETTI.reset();",
          "  } else if (msg.data.resize) {",
          "    SIZE.width = msg.data.resize.width;",
          "    SIZE.height = msg.data.resize.height;",
          "  } else if (msg.data.canvas) {",
          "    SIZE.width = msg.data.canvas.width;",
          "    SIZE.height = msg.data.canvas.height;",
          "    CONFETTI = module.exports.create(msg.data.canvas);",
          "  }",
          "}"
        ].join(`
`);
        try {
          I = new Worker(URL.createObjectURL(new Blob([D])));
        } catch (P) {
          return typeof console < "u" && typeof console.warn == "function" && console.warn("🎊 Could not load worker", P), null;
        }
        M(I);
      }
      return I;
    };
  })(), b = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ["square", "circle"],
    zIndex: 100,
    colors: [
      "#26ccff",
      "#a25afd",
      "#ff5e7e",
      "#88ff5a",
      "#fcff42",
      "#ffa62d",
      "#ff36ff"
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: !1,
    scalar: 1
  };
  function u(I, v) {
    return v ? v(I) : I;
  }
  function h(I) {
    return I != null;
  }
  function c(I, v, O) {
    return u(
      I && h(I[v]) ? I[v] : b[v],
      O
    );
  }
  function d(I) {
    return I < 0 ? 0 : Math.floor(I);
  }
  function p(I, v) {
    return Math.floor(Math.random() * (v - I)) + I;
  }
  function y(I) {
    return parseInt(I, 16);
  }
  function x(I) {
    return I.map(_);
  }
  function _(I) {
    var v = String(I).replace(/[^0-9a-f]/gi, "");
    return v.length < 6 && (v = v[0] + v[0] + v[1] + v[1] + v[2] + v[2]), {
      r: y(v.substring(0, 2)),
      g: y(v.substring(2, 4)),
      b: y(v.substring(4, 6))
    };
  }
  function g(I) {
    var v = c(I, "origin", Object);
    return v.x = c(v, "x", Number), v.y = c(v, "y", Number), v;
  }
  function E(I) {
    I.width = document.documentElement.clientWidth, I.height = document.documentElement.clientHeight;
  }
  function S(I) {
    var v = I.getBoundingClientRect();
    I.width = v.width, I.height = v.height;
  }
  function A(I) {
    var v = document.createElement("canvas");
    return v.style.position = "fixed", v.style.top = "0px", v.style.left = "0px", v.style.pointerEvents = "none", v.style.zIndex = I, v;
  }
  function C(I, v, O, M, D, P, L, k, F) {
    I.save(), I.translate(v, O), I.rotate(P), I.scale(M, D), I.arc(0, 0, 1, L, k, F), I.restore();
  }
  function $(I) {
    var v = I.angle * (Math.PI / 180), O = I.spread * (Math.PI / 180);
    return {
      x: I.x,
      y: I.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: I.startVelocity * 0.5 + Math.random() * I.startVelocity,
      angle2D: -v + (0.5 * O - Math.random() * O),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: I.color,
      shape: I.shape,
      tick: 0,
      totalTicks: I.ticks,
      decay: I.decay,
      drift: I.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: I.gravity * 3,
      ovalScalar: 0.6,
      scalar: I.scalar,
      flat: I.flat
    };
  }
  function N(I, v) {
    v.x += Math.cos(v.angle2D) * v.velocity + v.drift, v.y += Math.sin(v.angle2D) * v.velocity + v.gravity, v.velocity *= v.decay, v.flat ? (v.wobble = 0, v.wobbleX = v.x + 10 * v.scalar, v.wobbleY = v.y + 10 * v.scalar, v.tiltSin = 0, v.tiltCos = 0, v.random = 1) : (v.wobble += v.wobbleSpeed, v.wobbleX = v.x + 10 * v.scalar * Math.cos(v.wobble), v.wobbleY = v.y + 10 * v.scalar * Math.sin(v.wobble), v.tiltAngle += 0.1, v.tiltSin = Math.sin(v.tiltAngle), v.tiltCos = Math.cos(v.tiltAngle), v.random = Math.random() + 2);
    var O = v.tick++ / v.totalTicks, M = v.x + v.random * v.tiltCos, D = v.y + v.random * v.tiltSin, P = v.wobbleX + v.random * v.tiltCos, L = v.wobbleY + v.random * v.tiltSin;
    if (I.fillStyle = "rgba(" + v.color.r + ", " + v.color.g + ", " + v.color.b + ", " + (1 - O) + ")", I.beginPath(), a && v.shape.type === "path" && typeof v.shape.path == "string" && Array.isArray(v.shape.matrix))
      I.fill(Y(
        v.shape.path,
        v.shape.matrix,
        v.x,
        v.y,
        Math.abs(P - M) * 0.1,
        Math.abs(L - D) * 0.1,
        Math.PI / 10 * v.wobble
      ));
    else if (v.shape.type === "bitmap") {
      var k = Math.PI / 10 * v.wobble, F = Math.abs(P - M) * 0.1, H = Math.abs(L - D) * 0.1, K = v.shape.bitmap.width * v.scalar, W = v.shape.bitmap.height * v.scalar, J = new DOMMatrix([
        Math.cos(k) * F,
        Math.sin(k) * F,
        -Math.sin(k) * H,
        Math.cos(k) * H,
        v.x,
        v.y
      ]);
      J.multiplySelf(new DOMMatrix(v.shape.matrix));
      var ee = I.createPattern(m.transform(v.shape.bitmap), "no-repeat");
      ee.setTransform(J), I.globalAlpha = 1 - O, I.fillStyle = ee, I.fillRect(
        v.x - K / 2,
        v.y - W / 2,
        K,
        W
      ), I.globalAlpha = 1;
    } else if (v.shape === "circle")
      I.ellipse ? I.ellipse(v.x, v.y, Math.abs(P - M) * v.ovalScalar, Math.abs(L - D) * v.ovalScalar, Math.PI / 10 * v.wobble, 0, 2 * Math.PI) : C(I, v.x, v.y, Math.abs(P - M) * v.ovalScalar, Math.abs(L - D) * v.ovalScalar, Math.PI / 10 * v.wobble, 0, 2 * Math.PI);
    else if (v.shape === "star")
      for (var V = Math.PI / 2 * 3, ie = 4 * v.scalar, le = 8 * v.scalar, ce = v.x, be = v.y, ke = 5, pe = Math.PI / ke; ke--; )
        ce = v.x + Math.cos(V) * le, be = v.y + Math.sin(V) * le, I.lineTo(ce, be), V += pe, ce = v.x + Math.cos(V) * ie, be = v.y + Math.sin(V) * ie, I.lineTo(ce, be), V += pe;
    else
      I.moveTo(Math.floor(v.x), Math.floor(v.y)), I.lineTo(Math.floor(v.wobbleX), Math.floor(D)), I.lineTo(Math.floor(P), Math.floor(L)), I.lineTo(Math.floor(M), Math.floor(v.wobbleY));
    return I.closePath(), I.fill(), v.tick < v.totalTicks;
  }
  function R(I, v, O, M, D) {
    var P = v.slice(), L = I.getContext("2d"), k, F, H = f(function(K) {
      function W() {
        k = F = null, L.clearRect(0, 0, M.width, M.height), m.clear(), D(), K();
      }
      function J() {
        r && !(M.width === n.width && M.height === n.height) && (M.width = I.width = n.width, M.height = I.height = n.height), !M.width && !M.height && (O(I), M.width = I.width, M.height = I.height), L.clearRect(0, 0, M.width, M.height), P = P.filter(function(ee) {
          return N(L, ee);
        }), P.length ? k = w.frame(J) : W();
      }
      k = w.frame(J), F = W;
    });
    return {
      addFettis: function(K) {
        return P = P.concat(K), H;
      },
      canvas: I,
      promise: H,
      reset: function() {
        k && w.cancel(k), F && F();
      }
    };
  }
  function U(I, v) {
    var O = !I, M = !!c(v || {}, "resize"), D = !1, P = c(v, "disableForReducedMotion", Boolean), L = s && !!c(v || {}, "useWorker"), k = L ? T() : null, F = O ? E : S, H = I && k ? !!I.__confetti_initialized : !1, K = typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion)").matches, W;
    function J(V, ie, le) {
      for (var ce = c(V, "particleCount", d), be = c(V, "angle", Number), ke = c(V, "spread", Number), pe = c(V, "startVelocity", Number), ia = c(V, "decay", Number), ra = c(V, "gravity", Number), na = c(V, "drift", Number), gr = c(V, "colors", x), sa = c(V, "ticks", Number), vr = c(V, "shapes"), aa = c(V, "scalar"), oa = !!c(V, "flat"), yr = g(V), br = ce, ui = [], la = I.width * yr.x, ca = I.height * yr.y; br--; )
        ui.push(
          $({
            x: la,
            y: ca,
            angle: be,
            spread: ke,
            startVelocity: pe,
            color: gr[br % gr.length],
            shape: vr[p(0, vr.length)],
            ticks: sa,
            decay: ia,
            gravity: ra,
            drift: na,
            scalar: aa,
            flat: oa
          })
        );
      return W ? W.addFettis(ui) : (W = R(I, ui, F, ie, le), W.promise);
    }
    function ee(V) {
      var ie = P || c(V, "disableForReducedMotion", Boolean), le = c(V, "zIndex", Number);
      if (ie && K)
        return f(function(pe) {
          pe();
        });
      O && W ? I = W.canvas : O && !I && (I = A(le), document.body.appendChild(I)), M && !H && F(I);
      var ce = {
        width: I.width,
        height: I.height
      };
      k && !H && k.init(I), H = !0, k && (I.__confetti_initialized = !0);
      function be() {
        if (k) {
          var pe = {
            getBoundingClientRect: function() {
              if (!O)
                return I.getBoundingClientRect();
            }
          };
          F(pe), k.postMessage({
            resize: {
              width: pe.width,
              height: pe.height
            }
          });
          return;
        }
        ce.width = ce.height = null;
      }
      function ke() {
        W = null, M && (D = !1, e.removeEventListener("resize", be)), O && I && (document.body.contains(I) && document.body.removeChild(I), I = null, H = !1);
      }
      return M && !D && (D = !0, e.addEventListener("resize", be, !1)), k ? k.fire(V, ce, ke) : J(V, ce, ke);
    }
    return ee.reset = function() {
      k && k.reset(), W && W.reset();
    }, ee;
  }
  var z;
  function Q() {
    return z || (z = U(null, { useWorker: !0, resize: !0 })), z;
  }
  function Y(I, v, O, M, D, P, L) {
    var k = new Path2D(I), F = new Path2D();
    F.addPath(k, new DOMMatrix(v));
    var H = new Path2D();
    return H.addPath(F, new DOMMatrix([
      Math.cos(L) * D,
      Math.sin(L) * D,
      -Math.sin(L) * P,
      Math.cos(L) * P,
      O,
      M
    ])), H;
  }
  function X(I) {
    if (!a)
      throw new Error("path confetti are not supported in this browser");
    var v, O;
    typeof I == "string" ? v = I : (v = I.path, O = I.matrix);
    var M = new Path2D(v), D = document.createElement("canvas"), P = D.getContext("2d");
    if (!O) {
      for (var L = 1e3, k = L, F = L, H = 0, K = 0, W, J, ee = 0; ee < L; ee += 2)
        for (var V = 0; V < L; V += 2)
          P.isPointInPath(M, ee, V, "nonzero") && (k = Math.min(k, ee), F = Math.min(F, V), H = Math.max(H, ee), K = Math.max(K, V));
      W = H - k, J = K - F;
      var ie = 10, le = Math.min(ie / W, ie / J);
      O = [
        le,
        0,
        0,
        le,
        -Math.round(W / 2 + k) * le,
        -Math.round(J / 2 + F) * le
      ];
    }
    return {
      type: "path",
      path: v,
      matrix: O
    };
  }
  function se(I) {
    var v, O = 1, M = "#000000", D = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
    typeof I == "string" ? v = I : (v = I.text, O = "scalar" in I ? I.scalar : O, D = "fontFamily" in I ? I.fontFamily : D, M = "color" in I ? I.color : M);
    var P = 10 * O, L = "" + P + "px " + D, k = new OffscreenCanvas(P, P), F = k.getContext("2d");
    F.font = L;
    var H = F.measureText(v), K = Math.ceil(H.actualBoundingBoxRight + H.actualBoundingBoxLeft), W = Math.ceil(H.actualBoundingBoxAscent + H.actualBoundingBoxDescent), J = 2, ee = H.actualBoundingBoxLeft + J, V = H.actualBoundingBoxAscent + J;
    K += J + J, W += J + J, k = new OffscreenCanvas(K, W), F = k.getContext("2d"), F.font = L, F.fillStyle = M, F.fillText(v, ee, V);
    var ie = 1 / O;
    return {
      type: "bitmap",
      // TODO these probably need to be transfered for workers
      bitmap: k.transferToImageBitmap(),
      matrix: [ie, 0, 0, ie, -K * ie / 2, -W * ie / 2]
    };
  }
  i.exports = function() {
    return Q().apply(this, arguments);
  }, i.exports.reset = function() {
    Q().reset();
  }, i.exports.create = U, i.exports.shapeFromPath = X, i.exports.shapeFromText = se;
})(/* @__PURE__ */ (function() {
  return typeof window < "u" ? window : typeof self < "u" ? self : this || {};
})(), ur, !1);
const Gr = ur.exports;
ur.exports.create;
const Xr = "rz:confetti";
function Xe(t, e = !1) {
  if (typeof t != "string") return e;
  const i = t.trim().toLowerCase();
  return i === "true" ? !0 : i === "false" ? !1 : e;
}
function Rt(t, e = 0) {
  const i = Number.parseInt(t ?? "", 10);
  return Number.isFinite(i) ? i : e;
}
function Yc(t) {
  return (t || "").replace(/-([a-z])/g, (e, i) => i.toUpperCase());
}
function Kc(t) {
  return new Promise((e) => window.setTimeout(e, t));
}
function Jc(t, e) {
  t.data("rzConfetti", () => ({
    confettiFactory: null,
    trigger: "click",
    mode: "element-origin",
    preset: "default-burst",
    disabled: !1,
    once: !1,
    cooldownMs: 0,
    burstCount: 1,
    burstIntervalMs: 150,
    eventName: Xr,
    launchFromElementCenter: !0,
    launchFromPointer: !1,
    resizeCanvas: !0,
    useWorker: !1,
    zIndex: 100,
    options: {},
    hasFired: !1,
    lastFiredAt: 0,
    customEventHandler: null,
    intersectionObserver: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), r = this.$el.dataset.nonce || "";
      if (this.readConfig(), i.length > 0 && typeof e == "function") {
        e(i, {
          success: () => this.setup(),
          error: (n) => {
            console.error("[rzConfetti] Failed to load confetti assets.", n), this.setup();
          }
        }, r);
        return;
      }
      this.setup();
    },
    readConfig() {
      this.trigger = this.$el.dataset.trigger || "click", this.mode = this.$el.dataset.mode || "element-origin", this.preset = this.$el.dataset.preset || "default-burst", this.disabled = Xe(this.$el.dataset.disabled, !1), this.once = Xe(this.$el.dataset.once, !1), this.cooldownMs = Rt(this.$el.dataset.cooldownMs, 0), this.burstCount = Math.max(1, Rt(this.$el.dataset.burstCount, 1)), this.burstIntervalMs = Math.max(0, Rt(this.$el.dataset.burstIntervalMs, 150)), this.eventName = this.$el.dataset.eventName || Xr, this.launchFromElementCenter = Xe(this.$el.dataset.launchFromElementCenter, !0), this.launchFromPointer = Xe(this.$el.dataset.launchFromPointer, !1), this.resizeCanvas = Xe(this.$el.dataset.resizeCanvas, !0), this.useWorker = Xe(this.$el.dataset.useWorker, !1), this.zIndex = Rt(this.$el.dataset.zIndex, 100);
      try {
        this.options = JSON.parse(this.$el.dataset.options || "{}");
      } catch {
        this.options = {};
      }
    },
    setup() {
      this.bindTriggers(), this.exposeManualApi(), this.trigger === "load" && this.fire();
    },
    bindTriggers() {
      this.trigger === "custom-event" && (this.customEventHandler = (i) => this.handleCustomEvent(i), window.addEventListener(this.eventName, this.customEventHandler)), this.trigger === "visible" && (this.intersectionObserver = new IntersectionObserver((i) => this.handleVisibility(i), {
        threshold: 0.25
      }), this.intersectionObserver.observe(this.$el));
    },
    exposeManualApi() {
      this.$el.rzConfetti = {
        fire: (i) => this.fireSequence(i),
        fireOnce: () => this.fire()
      };
    },
    fireFromClick() {
      this.trigger === "click" && this.fire();
    },
    fireFromHover() {
      this.trigger === "hover" && this.fire();
    },
    fire(i) {
      const r = this.resolveOrigin(i);
      this.fireSequence(r);
    },
    async fireSequence(i) {
      if (!this.canFire()) return;
      const r = this.preset === "victory" ? Math.max(this.burstCount, 3) : this.burstCount;
      for (let n = 0; n < r; n += 1) {
        const s = this.buildOptions(i, n, r), a = this.ensureInstance();
        if (!a) return;
        a(s), n < r - 1 && this.burstIntervalMs > 0 && await Kc(this.burstIntervalMs);
      }
      this.hasFired = !0, this.lastFiredAt = Date.now(), this.once && this.intersectionObserver && (this.intersectionObserver.disconnect(), this.intersectionObserver = null);
    },
    buildOptions(i, r = 0, n = 1) {
      const a = { ...this.getPresetOptions(r, n), ...this.options };
      return i && (a.origin = i), (typeof this.options.originX == "number" || typeof this.options.originY == "number") && (a.origin = {
        x: typeof this.options.originX == "number" ? this.options.originX : a.origin?.x ?? 0.5,
        y: typeof this.options.originY == "number" ? this.options.originY : a.origin?.y ?? 0.5
      }), a.disableForReducedMotion = this.options.disableForReducedMotion ?? !0, a;
    },
    getPresetOptions(i = 0, r = 1) {
      const n = {
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        zIndex: this.zIndex,
        scalar: 1,
        origin: { x: 0.5, y: 0.55 }
      }, s = {
        defaultBurst: n,
        cannonLeft: { ...n, angle: 60, origin: { x: 0.1, y: 0.9 } },
        cannonRight: { ...n, angle: 120, origin: { x: 0.9, y: 0.9 } },
        dualCannons: i % 2 === 0 ? { ...n, angle: 60, origin: { x: 0.1, y: 0.9 } } : { ...n, angle: 120, origin: { x: 0.9, y: 0.9 } },
        victory: {
          ...n,
          particleCount: 120,
          spread: 100,
          startVelocity: 55,
          origin: { x: 0.5, y: Math.max(0.1, 0.65 - i / Math.max(1, r - 1) * 0.3) }
        },
        subtle: { ...n, particleCount: 30, spread: 45, startVelocity: 28, scalar: 0.85 },
        stars: { ...n, shapes: ["star"], particleCount: 60, spread: 80 }
      }, a = Yc(this.preset);
      return s[a] || n;
    },
    resolveOrigin(i) {
      if (this.mode === "overlay")
        return null;
      if (this.mode === "scoped")
        return { x: 0.5, y: 0.5 };
      if (this.launchFromPointer && i && typeof i.clientX == "number" && typeof i.clientY == "number")
        return {
          x: i.clientX / window.innerWidth,
          y: i.clientY / window.innerHeight
        };
      if (this.launchFromElementCenter) {
        const r = this.$el.getBoundingClientRect();
        return {
          x: (r.left + r.width / 2) / window.innerWidth,
          y: (r.top + r.height / 2) / window.innerHeight
        };
      }
      return null;
    },
    ensureInstance() {
      if (this.confettiFactory) return this.confettiFactory;
      const i = window.confetti || Gr;
      if (typeof i != "function" && typeof i?.create != "function")
        return console.error("[rzConfetti] canvas-confetti was not found."), null;
      const r = typeof i == "function" ? i : Gr;
      if (this.mode === "scoped") {
        const n = this.$refs.canvas || this.$el.querySelector("canvas");
        return n ? (this.confettiFactory = r.create(n, {
          resize: this.resizeCanvas,
          useWorker: this.useWorker
        }), this.confettiFactory) : (console.error("[rzConfetti] Scoped mode requires a canvas element."), null);
      }
      return typeof i == "function" ? this.confettiFactory = i : this.confettiFactory = r, this.confettiFactory;
    },
    handleCustomEvent(i) {
      this.trigger === "custom-event" && this.fireSequence(this.resolveOrigin(i?.detail?.event));
    },
    handleVisibility(i) {
      !i.some((n) => n.isIntersecting) || this.trigger !== "visible" || this.fire();
    },
    canFire() {
      return this.disabled || this.once && this.hasFired ? !1 : this.cooldownMs <= 0 ? !0 : Date.now() - this.lastFiredAt >= this.cooldownMs;
    },
    destroy() {
      this.customEventHandler && (window.removeEventListener(this.eventName, this.customEventHandler), this.customEventHandler = null), this.intersectionObserver && (this.intersectionObserver.disconnect(), this.intersectionObserver = null), this.$el && this.$el.rzConfetti && delete this.$el.rzConfetti;
    }
  }));
}
function Gc(t, e) {
  t.data("rzColorPickerProvider", () => ({
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
      this.colorPicker.open = this.openPicker.bind(this), this.colorPicker.setValue = this.setValue.bind(this), this.colorPicker.getValue = () => this.colorPicker.value, this.colorPicker.updateConfiguration = this.updateConfiguration.bind(this), this.colorPicker.value = this.readValue(this.$el.dataset.initialValue || ""), this.config = this.readConfig(), this.$watch("colorPicker.value", (n) => {
        const s = this.readValue(n);
        if (s !== n) {
          this.colorPicker.value = s;
          return;
        }
        this.syncInputFromState();
      });
      const i = JSON.parse(this.$el.dataset.assets || "[]"), r = this.$el.dataset.nonce;
      e(i, r).then(() => this.initializeColoris()).catch((n) => this.handleAssetError(n));
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
        onChange: (r, n) => {
          n === this.$refs.input && (this.syncStateFromInput(n), n.dispatchEvent(new CustomEvent("rz:colorpicker:onchange", {
            bubbles: !0,
            composed: !0,
            detail: {
              colorPicker: this.colorPicker,
              updateConfiguration: this.updateConfiguration.bind(this),
              el: n,
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
      const r = this.$refs.input;
      r && (this.positionAnchorInput(r, i), this.syncInputFromState(), r.focus(), r.dispatchEvent(new MouseEvent("click", { bubbles: !0 })));
    },
    positionAnchorInput(i, r) {
      const n = r?.currentTarget;
      if (!n || typeof n.getBoundingClientRect != "function")
        return;
      const s = n.getBoundingClientRect();
      i.style.left = `${Math.round(s.left)}px`, i.style.top = `${Math.round(s.bottom)}px`;
    },
    setValue(i) {
      this.colorPicker.value = i;
    },
    updateConfiguration(i) {
      this.config = {
        ...this.config,
        ...i
      };
      const r = this.$refs.input;
      !window.Coloris || !r || window.Coloris.setInstance(r, this.config);
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
      const r = this.readValue(this.colorPicker.value);
      i.value !== r && (this._isSyncingToInput = !0, i.value = r, i.dispatchEvent(new Event("input", { bubbles: !0 })), queueMicrotask(() => {
        this._isSyncingToInput = !1;
      }));
    },
    handleAssetError(i) {
      console.error("Failed to load Coloris assets.", i);
    }
  }));
}
function Xc(t) {
  t.data("rzColorSwatch", () => ({
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
      this.value = this.readValue(this.$el.dataset.value), this.withoutTransparency = this.readBool(this.$el.dataset.withoutTransparency), this.isDisabled = this.readBool(this.$el.dataset.disabled), this.$watch("value", (e) => {
        const i = this.readValue(e);
        if (i !== e) {
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
    setValue(e) {
      this.value = e;
    },
    // Optional helper if parent code needs to toggle checkerboard behavior.
    setWithoutTransparency(e) {
      this.withoutTransparency = !!e;
    },
    // ──────────────────────────────────────────────────────────────────────
    // NORMALIZATION / PARSING
    // ──────────────────────────────────────────────────────────────────────
    readBool(e) {
      return e === "true";
    },
    readValue(e) {
      return typeof e != "string" ? "" : e.trim();
    },
    // ──────────────────────────────────────────────────────────────────────
    // COLOR INSPECTION
    // ──────────────────────────────────────────────────────────────────────
    isCssColor(e) {
      try {
        return typeof CSS < "u" && typeof CSS.supports == "function" ? CSS.supports("color", e) : !0;
      } catch {
        return !1;
      }
    },
    hasAlpha(e) {
      const i = e.trim().toLowerCase();
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
    getSolidColorStyle(e) {
      return `background-color: ${e};`;
    },
    getAlphaPreviewStyle(e) {
      return [
        `background: linear-gradient(${e}, ${e}),`,
        "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)",
        "0% 50% / 10px 10px;"
      ].join(" ");
    },
    refreshSwatch() {
      const e = this.value;
      if (!e) {
        this.swatchStyle = this.getEmptyStyle();
        return;
      }
      if (!this.isCssColor(e)) {
        this.swatchStyle = this.getInvalidStyle();
        return;
      }
      if (!this.withoutTransparency && this.hasAlpha(e)) {
        this.swatchStyle = this.getAlphaPreviewStyle(e);
        return;
      }
      this.swatchStyle = this.getSolidColorStyle(e);
    }
  }));
}
function Zc(t, e) {
  t.data("rzDateEdit", () => ({
    options: {},
    placeholder: "",
    prependText: "",
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = this.$el.dataset.config, r = document.getElementById(this.$el.dataset.uid + "-input");
      if (i) {
        const a = JSON.parse(i);
        a && (this.options = a.options || {}, this.placeholder = a.placeholder || "", this.prependText = a.prependText || "");
      }
      const n = JSON.parse(this.$el.dataset.assets), s = this.$el.dataset.nonce;
      e(n, {
        success: function() {
          window.flatpickr && r && window.flatpickr(r, this.options);
        },
        error: function() {
          console.error("Failed to load Flatpickr assets.");
        }
      }, s);
    }
  }));
}
function Qc(t) {
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
        const i = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", e);
        const r = document.body.offsetWidth - i;
        document.body.style.setProperty("--page-scrollbar-width", `${r}px`), e ? this.$nextTick(() => {
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
const it = Math.min, ze = Math.max, Gt = Math.round, zt = Math.floor, ge = (t) => ({
  x: t,
  y: t
}), eu = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, tu = {
  start: "end",
  end: "start"
};
function Ri(t, e, i) {
  return ze(t, it(e, i));
}
function Ct(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function We(t) {
  return t.split("-")[0];
}
function At(t) {
  return t.split("-")[1];
}
function qs(t) {
  return t === "x" ? "y" : "x";
}
function hr(t) {
  return t === "y" ? "height" : "width";
}
const iu = /* @__PURE__ */ new Set(["top", "bottom"]);
function Te(t) {
  return iu.has(We(t)) ? "y" : "x";
}
function dr(t) {
  return qs(Te(t));
}
function ru(t, e, i) {
  i === void 0 && (i = !1);
  const r = At(t), n = dr(t), s = hr(n);
  let a = n === "x" ? r === (i ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (a = Xt(a)), [a, Xt(a)];
}
function nu(t) {
  const e = Xt(t);
  return [zi(t), e, zi(e)];
}
function zi(t) {
  return t.replace(/start|end/g, (e) => tu[e]);
}
const Zr = ["left", "right"], Qr = ["right", "left"], su = ["top", "bottom"], au = ["bottom", "top"];
function ou(t, e, i) {
  switch (t) {
    case "top":
    case "bottom":
      return i ? e ? Qr : Zr : e ? Zr : Qr;
    case "left":
    case "right":
      return e ? su : au;
    default:
      return [];
  }
}
function lu(t, e, i, r) {
  const n = At(t);
  let s = ou(We(t), i === "start", r);
  return n && (s = s.map((a) => a + "-" + n), e && (s = s.concat(s.map(zi)))), s;
}
function Xt(t) {
  return t.replace(/left|right|bottom|top/g, (e) => eu[e]);
}
function cu(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function js(t) {
  return typeof t != "number" ? cu(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function Zt(t) {
  const {
    x: e,
    y: i,
    width: r,
    height: n
  } = t;
  return {
    width: r,
    height: n,
    top: i,
    left: e,
    right: e + r,
    bottom: i + n,
    x: e,
    y: i
  };
}
function en(t, e, i) {
  let {
    reference: r,
    floating: n
  } = t;
  const s = Te(e), a = dr(e), o = hr(a), l = We(e), f = s === "y", m = r.x + r.width / 2 - n.width / 2, w = r.y + r.height / 2 - n.height / 2, T = r[o] / 2 - n[o] / 2;
  let b;
  switch (l) {
    case "top":
      b = {
        x: m,
        y: r.y - n.height
      };
      break;
    case "bottom":
      b = {
        x: m,
        y: r.y + r.height
      };
      break;
    case "right":
      b = {
        x: r.x + r.width,
        y: w
      };
      break;
    case "left":
      b = {
        x: r.x - n.width,
        y: w
      };
      break;
    default:
      b = {
        x: r.x,
        y: r.y
      };
  }
  switch (At(e)) {
    case "start":
      b[a] -= T * (i && f ? -1 : 1);
      break;
    case "end":
      b[a] += T * (i && f ? -1 : 1);
      break;
  }
  return b;
}
async function uu(t, e) {
  var i;
  e === void 0 && (e = {});
  const {
    x: r,
    y: n,
    platform: s,
    rects: a,
    elements: o,
    strategy: l
  } = t, {
    boundary: f = "clippingAncestors",
    rootBoundary: m = "viewport",
    elementContext: w = "floating",
    altBoundary: T = !1,
    padding: b = 0
  } = Ct(e, t), u = js(b), c = o[T ? w === "floating" ? "reference" : "floating" : w], d = Zt(await s.getClippingRect({
    element: (i = await (s.isElement == null ? void 0 : s.isElement(c))) == null || i ? c : c.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
    boundary: f,
    rootBoundary: m,
    strategy: l
  })), p = w === "floating" ? {
    x: r,
    y: n,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(o.floating)), x = await (s.isElement == null ? void 0 : s.isElement(y)) ? await (s.getScale == null ? void 0 : s.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = Zt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: o,
    rect: p,
    offsetParent: y,
    strategy: l
  }) : p);
  return {
    top: (d.top - _.top + u.top) / x.y,
    bottom: (_.bottom - d.bottom + u.bottom) / x.y,
    left: (d.left - _.left + u.left) / x.x,
    right: (_.right - d.right + u.right) / x.x
  };
}
const hu = async (t, e, i) => {
  const {
    placement: r = "bottom",
    strategy: n = "absolute",
    middleware: s = [],
    platform: a
  } = i, o = s.filter(Boolean), l = await (a.isRTL == null ? void 0 : a.isRTL(e));
  let f = await a.getElementRects({
    reference: t,
    floating: e,
    strategy: n
  }), {
    x: m,
    y: w
  } = en(f, r, l), T = r, b = {}, u = 0;
  for (let c = 0; c < o.length; c++) {
    var h;
    const {
      name: d,
      fn: p
    } = o[c], {
      x: y,
      y: x,
      data: _,
      reset: g
    } = await p({
      x: m,
      y: w,
      initialPlacement: r,
      placement: T,
      strategy: n,
      middlewareData: b,
      rects: f,
      platform: {
        ...a,
        detectOverflow: (h = a.detectOverflow) != null ? h : uu
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    m = y ?? m, w = x ?? w, b = {
      ...b,
      [d]: {
        ...b[d],
        ..._
      }
    }, g && u <= 50 && (u++, typeof g == "object" && (g.placement && (T = g.placement), g.rects && (f = g.rects === !0 ? await a.getElementRects({
      reference: t,
      floating: e,
      strategy: n
    }) : g.rects), {
      x: m,
      y: w
    } = en(f, T, l)), c = -1);
  }
  return {
    x: m,
    y: w,
    placement: T,
    strategy: n,
    middlewareData: b
  };
}, du = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: i,
      y: r,
      placement: n,
      rects: s,
      platform: a,
      elements: o,
      middlewareData: l
    } = e, {
      element: f,
      padding: m = 0
    } = Ct(t, e) || {};
    if (f == null)
      return {};
    const w = js(m), T = {
      x: i,
      y: r
    }, b = dr(n), u = hr(b), h = await a.getDimensions(f), c = b === "y", d = c ? "top" : "left", p = c ? "bottom" : "right", y = c ? "clientHeight" : "clientWidth", x = s.reference[u] + s.reference[b] - T[b] - s.floating[u], _ = T[b] - s.reference[b], g = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(f));
    let E = g ? g[y] : 0;
    (!E || !await (a.isElement == null ? void 0 : a.isElement(g))) && (E = o.floating[y] || s.floating[u]);
    const S = x / 2 - _ / 2, A = E / 2 - h[u] / 2 - 1, C = it(w[d], A), $ = it(w[p], A), N = C, R = E - h[u] - $, U = E / 2 - h[u] / 2 + S, z = Ri(N, U, R), Q = !l.arrow && At(n) != null && U !== z && s.reference[u] / 2 - (U < N ? C : $) - h[u] / 2 < 0, Y = Q ? U < N ? U - N : U - R : 0;
    return {
      [b]: T[b] + Y,
      data: {
        [b]: z,
        centerOffset: U - z - Y,
        ...Q && {
          alignmentOffset: Y
        }
      },
      reset: Q
    };
  }
}), fu = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var i, r;
      const {
        placement: n,
        middlewareData: s,
        rects: a,
        initialPlacement: o,
        platform: l,
        elements: f
      } = e, {
        mainAxis: m = !0,
        crossAxis: w = !0,
        fallbackPlacements: T,
        fallbackStrategy: b = "bestFit",
        fallbackAxisSideDirection: u = "none",
        flipAlignment: h = !0,
        ...c
      } = Ct(t, e);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const d = We(n), p = Te(o), y = We(o) === o, x = await (l.isRTL == null ? void 0 : l.isRTL(f.floating)), _ = T || (y || !h ? [Xt(o)] : nu(o)), g = u !== "none";
      !T && g && _.push(...lu(o, h, u, x));
      const E = [o, ..._], S = await l.detectOverflow(e, c), A = [];
      let C = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (m && A.push(S[d]), w) {
        const U = ru(n, a, x);
        A.push(S[U[0]], S[U[1]]);
      }
      if (C = [...C, {
        placement: n,
        overflows: A
      }], !A.every((U) => U <= 0)) {
        var $, N;
        const U = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1, z = E[U];
        if (z && (!(w === "alignment" ? p !== Te(z) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        C.every((X) => Te(X.placement) === p ? X.overflows[0] > 0 : !0)))
          return {
            data: {
              index: U,
              overflows: C
            },
            reset: {
              placement: z
            }
          };
        let Q = (N = C.filter((Y) => Y.overflows[0] <= 0).sort((Y, X) => Y.overflows[1] - X.overflows[1])[0]) == null ? void 0 : N.placement;
        if (!Q)
          switch (b) {
            case "bestFit": {
              var R;
              const Y = (R = C.filter((X) => {
                if (g) {
                  const se = Te(X.placement);
                  return se === p || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  se === "y";
                }
                return !0;
              }).map((X) => [X.placement, X.overflows.filter((se) => se > 0).reduce((se, I) => se + I, 0)]).sort((X, se) => X[1] - se[1])[0]) == null ? void 0 : R[0];
              Y && (Q = Y);
              break;
            }
            case "initialPlacement":
              Q = o;
              break;
          }
        if (n !== Q)
          return {
            reset: {
              placement: Q
            }
          };
      }
      return {};
    }
  };
}, pu = /* @__PURE__ */ new Set(["left", "top"]);
async function mu(t, e) {
  const {
    placement: i,
    platform: r,
    elements: n
  } = t, s = await (r.isRTL == null ? void 0 : r.isRTL(n.floating)), a = We(i), o = At(i), l = Te(i) === "y", f = pu.has(a) ? -1 : 1, m = s && l ? -1 : 1, w = Ct(e, t);
  let {
    mainAxis: T,
    crossAxis: b,
    alignmentAxis: u
  } = typeof w == "number" ? {
    mainAxis: w,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: w.mainAxis || 0,
    crossAxis: w.crossAxis || 0,
    alignmentAxis: w.alignmentAxis
  };
  return o && typeof u == "number" && (b = o === "end" ? u * -1 : u), l ? {
    x: b * m,
    y: T * f
  } : {
    x: T * f,
    y: b * m
  };
}
const gu = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var i, r;
      const {
        x: n,
        y: s,
        placement: a,
        middlewareData: o
      } = e, l = await mu(e, t);
      return a === ((i = o.offset) == null ? void 0 : i.placement) && (r = o.arrow) != null && r.alignmentOffset ? {} : {
        x: n + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: a
        }
      };
    }
  };
}, vu = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: i,
        y: r,
        placement: n,
        platform: s
      } = e, {
        mainAxis: a = !0,
        crossAxis: o = !1,
        limiter: l = {
          fn: (d) => {
            let {
              x: p,
              y
            } = d;
            return {
              x: p,
              y
            };
          }
        },
        ...f
      } = Ct(t, e), m = {
        x: i,
        y: r
      }, w = await s.detectOverflow(e, f), T = Te(We(n)), b = qs(T);
      let u = m[b], h = m[T];
      if (a) {
        const d = b === "y" ? "top" : "left", p = b === "y" ? "bottom" : "right", y = u + w[d], x = u - w[p];
        u = Ri(y, u, x);
      }
      if (o) {
        const d = T === "y" ? "top" : "left", p = T === "y" ? "bottom" : "right", y = h + w[d], x = h - w[p];
        h = Ri(y, h, x);
      }
      const c = l.fn({
        ...e,
        [b]: u,
        [T]: h
      });
      return {
        ...c,
        data: {
          x: c.x - i,
          y: c.y - r,
          enabled: {
            [b]: a,
            [T]: o
          }
        }
      };
    }
  };
};
function ai() {
  return typeof window < "u";
}
function ct(t) {
  return Ys(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function ne(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function ye(t) {
  var e;
  return (e = (Ys(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Ys(t) {
  return ai() ? t instanceof Node || t instanceof ne(t).Node : !1;
}
function he(t) {
  return ai() ? t instanceof Element || t instanceof ne(t).Element : !1;
}
function ve(t) {
  return ai() ? t instanceof HTMLElement || t instanceof ne(t).HTMLElement : !1;
}
function tn(t) {
  return !ai() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof ne(t).ShadowRoot;
}
const yu = /* @__PURE__ */ new Set(["inline", "contents"]);
function $t(t) {
  const {
    overflow: e,
    overflowX: i,
    overflowY: r,
    display: n
  } = de(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + i) && !yu.has(n);
}
const bu = /* @__PURE__ */ new Set(["table", "td", "th"]);
function wu(t) {
  return bu.has(ct(t));
}
const xu = [":popover-open", ":modal"];
function oi(t) {
  return xu.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const Iu = ["transform", "translate", "scale", "rotate", "perspective"], Eu = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Tu = ["paint", "layout", "strict", "content"];
function fr(t) {
  const e = pr(), i = he(t) ? de(t) : t;
  return Iu.some((r) => i[r] ? i[r] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !e && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !e && (i.filter ? i.filter !== "none" : !1) || Eu.some((r) => (i.willChange || "").includes(r)) || Tu.some((r) => (i.contain || "").includes(r));
}
function _u(t) {
  let e = $e(t);
  for (; ve(e) && !rt(e); ) {
    if (fr(e))
      return e;
    if (oi(e))
      return null;
    e = $e(e);
  }
  return null;
}
function pr() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Su = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function rt(t) {
  return Su.has(ct(t));
}
function de(t) {
  return ne(t).getComputedStyle(t);
}
function li(t) {
  return he(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function $e(t) {
  if (ct(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    tn(t) && t.host || // Fallback.
    ye(t)
  );
  return tn(e) ? e.host : e;
}
function Ks(t) {
  const e = $e(t);
  return rt(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : ve(e) && $t(e) ? e : Ks(e);
}
function _t(t, e, i) {
  var r;
  e === void 0 && (e = []), i === void 0 && (i = !0);
  const n = Ks(t), s = n === ((r = t.ownerDocument) == null ? void 0 : r.body), a = ne(n);
  if (s) {
    const o = Vi(a);
    return e.concat(a, a.visualViewport || [], $t(n) ? n : [], o && i ? _t(o) : []);
  }
  return e.concat(n, _t(n, [], i));
}
function Vi(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Js(t) {
  const e = de(t);
  let i = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const n = ve(t), s = n ? t.offsetWidth : i, a = n ? t.offsetHeight : r, o = Gt(i) !== s || Gt(r) !== a;
  return o && (i = s, r = a), {
    width: i,
    height: r,
    $: o
  };
}
function mr(t) {
  return he(t) ? t : t.contextElement;
}
function Qe(t) {
  const e = mr(t);
  if (!ve(e))
    return ge(1);
  const i = e.getBoundingClientRect(), {
    width: r,
    height: n,
    $: s
  } = Js(e);
  let a = (s ? Gt(i.width) : i.width) / r, o = (s ? Gt(i.height) : i.height) / n;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const Cu = /* @__PURE__ */ ge(0);
function Gs(t) {
  const e = ne(t);
  return !pr() || !e.visualViewport ? Cu : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Au(t, e, i) {
  return e === void 0 && (e = !1), !i || e && i !== ne(t) ? !1 : e;
}
function qe(t, e, i, r) {
  e === void 0 && (e = !1), i === void 0 && (i = !1);
  const n = t.getBoundingClientRect(), s = mr(t);
  let a = ge(1);
  e && (r ? he(r) && (a = Qe(r)) : a = Qe(t));
  const o = Au(s, i, r) ? Gs(s) : ge(0);
  let l = (n.left + o.x) / a.x, f = (n.top + o.y) / a.y, m = n.width / a.x, w = n.height / a.y;
  if (s) {
    const T = ne(s), b = r && he(r) ? ne(r) : r;
    let u = T, h = Vi(u);
    for (; h && r && b !== u; ) {
      const c = Qe(h), d = h.getBoundingClientRect(), p = de(h), y = d.left + (h.clientLeft + parseFloat(p.paddingLeft)) * c.x, x = d.top + (h.clientTop + parseFloat(p.paddingTop)) * c.y;
      l *= c.x, f *= c.y, m *= c.x, w *= c.y, l += y, f += x, u = ne(h), h = Vi(u);
    }
  }
  return Zt({
    width: m,
    height: w,
    x: l,
    y: f
  });
}
function ci(t, e) {
  const i = li(t).scrollLeft;
  return e ? e.left + i : qe(ye(t)).left + i;
}
function Xs(t, e) {
  const i = t.getBoundingClientRect(), r = i.left + e.scrollLeft - ci(t, i), n = i.top + e.scrollTop;
  return {
    x: r,
    y: n
  };
}
function $u(t) {
  let {
    elements: e,
    rect: i,
    offsetParent: r,
    strategy: n
  } = t;
  const s = n === "fixed", a = ye(r), o = e ? oi(e.floating) : !1;
  if (r === a || o && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, f = ge(1);
  const m = ge(0), w = ve(r);
  if ((w || !w && !s) && ((ct(r) !== "body" || $t(a)) && (l = li(r)), ve(r))) {
    const b = qe(r);
    f = Qe(r), m.x = b.x + r.clientLeft, m.y = b.y + r.clientTop;
  }
  const T = a && !w && !s ? Xs(a, l) : ge(0);
  return {
    width: i.width * f.x,
    height: i.height * f.y,
    x: i.x * f.x - l.scrollLeft * f.x + m.x + T.x,
    y: i.y * f.y - l.scrollTop * f.y + m.y + T.y
  };
}
function Ou(t) {
  return Array.from(t.getClientRects());
}
function ku(t) {
  const e = ye(t), i = li(t), r = t.ownerDocument.body, n = ze(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = ze(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let a = -i.scrollLeft + ci(t);
  const o = -i.scrollTop;
  return de(r).direction === "rtl" && (a += ze(e.clientWidth, r.clientWidth) - n), {
    width: n,
    height: s,
    x: a,
    y: o
  };
}
const rn = 25;
function Mu(t, e) {
  const i = ne(t), r = ye(t), n = i.visualViewport;
  let s = r.clientWidth, a = r.clientHeight, o = 0, l = 0;
  if (n) {
    s = n.width, a = n.height;
    const m = pr();
    (!m || m && e === "fixed") && (o = n.offsetLeft, l = n.offsetTop);
  }
  const f = ci(r);
  if (f <= 0) {
    const m = r.ownerDocument, w = m.body, T = getComputedStyle(w), b = m.compatMode === "CSS1Compat" && parseFloat(T.marginLeft) + parseFloat(T.marginRight) || 0, u = Math.abs(r.clientWidth - w.clientWidth - b);
    u <= rn && (s -= u);
  } else f <= rn && (s += f);
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
const Nu = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Du(t, e) {
  const i = qe(t, !0, e === "fixed"), r = i.top + t.clientTop, n = i.left + t.clientLeft, s = ve(t) ? Qe(t) : ge(1), a = t.clientWidth * s.x, o = t.clientHeight * s.y, l = n * s.x, f = r * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: f
  };
}
function nn(t, e, i) {
  let r;
  if (e === "viewport")
    r = Mu(t, i);
  else if (e === "document")
    r = ku(ye(t));
  else if (he(e))
    r = Du(e, i);
  else {
    const n = Gs(t);
    r = {
      x: e.x - n.x,
      y: e.y - n.y,
      width: e.width,
      height: e.height
    };
  }
  return Zt(r);
}
function Zs(t, e) {
  const i = $e(t);
  return i === e || !he(i) || rt(i) ? !1 : de(i).position === "fixed" || Zs(i, e);
}
function Pu(t, e) {
  const i = e.get(t);
  if (i)
    return i;
  let r = _t(t, [], !1).filter((o) => he(o) && ct(o) !== "body"), n = null;
  const s = de(t).position === "fixed";
  let a = s ? $e(t) : t;
  for (; he(a) && !rt(a); ) {
    const o = de(a), l = fr(a);
    !l && o.position === "fixed" && (n = null), (s ? !l && !n : !l && o.position === "static" && !!n && Nu.has(n.position) || $t(a) && !l && Zs(t, a)) ? r = r.filter((m) => m !== a) : n = o, a = $e(a);
  }
  return e.set(t, r), r;
}
function Lu(t) {
  let {
    element: e,
    boundary: i,
    rootBoundary: r,
    strategy: n
  } = t;
  const a = [...i === "clippingAncestors" ? oi(e) ? [] : Pu(e, this._c) : [].concat(i), r], o = a[0], l = a.reduce((f, m) => {
    const w = nn(e, m, n);
    return f.top = ze(w.top, f.top), f.right = it(w.right, f.right), f.bottom = it(w.bottom, f.bottom), f.left = ze(w.left, f.left), f;
  }, nn(e, o, n));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Fu(t) {
  const {
    width: e,
    height: i
  } = Js(t);
  return {
    width: e,
    height: i
  };
}
function Ru(t, e, i) {
  const r = ve(e), n = ye(e), s = i === "fixed", a = qe(t, !0, s, e);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = ge(0);
  function f() {
    l.x = ci(n);
  }
  if (r || !r && !s)
    if ((ct(e) !== "body" || $t(n)) && (o = li(e)), r) {
      const b = qe(e, !0, s, e);
      l.x = b.x + e.clientLeft, l.y = b.y + e.clientTop;
    } else n && f();
  s && !r && n && f();
  const m = n && !r && !s ? Xs(n, o) : ge(0), w = a.left + o.scrollLeft - l.x - m.x, T = a.top + o.scrollTop - l.y - m.y;
  return {
    x: w,
    y: T,
    width: a.width,
    height: a.height
  };
}
function vi(t) {
  return de(t).position === "static";
}
function sn(t, e) {
  if (!ve(t) || de(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let i = t.offsetParent;
  return ye(t) === i && (i = i.ownerDocument.body), i;
}
function Qs(t, e) {
  const i = ne(t);
  if (oi(t))
    return i;
  if (!ve(t)) {
    let n = $e(t);
    for (; n && !rt(n); ) {
      if (he(n) && !vi(n))
        return n;
      n = $e(n);
    }
    return i;
  }
  let r = sn(t, e);
  for (; r && wu(r) && vi(r); )
    r = sn(r, e);
  return r && rt(r) && vi(r) && !fr(r) ? i : r || _u(t) || i;
}
const zu = async function(t) {
  const e = this.getOffsetParent || Qs, i = this.getDimensions, r = await i(t.floating);
  return {
    reference: Ru(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Vu(t) {
  return de(t).direction === "rtl";
}
const Uu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: $u,
  getDocumentElement: ye,
  getClippingRect: Lu,
  getOffsetParent: Qs,
  getElementRects: zu,
  getClientRects: Ou,
  getDimensions: Fu,
  getScale: Qe,
  isElement: he,
  isRTL: Vu
};
function ea(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function Bu(t, e) {
  let i = null, r;
  const n = ye(t);
  function s() {
    var o;
    clearTimeout(r), (o = i) == null || o.disconnect(), i = null;
  }
  function a(o, l) {
    o === void 0 && (o = !1), l === void 0 && (l = 1), s();
    const f = t.getBoundingClientRect(), {
      left: m,
      top: w,
      width: T,
      height: b
    } = f;
    if (o || e(), !T || !b)
      return;
    const u = zt(w), h = zt(n.clientWidth - (m + T)), c = zt(n.clientHeight - (w + b)), d = zt(m), y = {
      rootMargin: -u + "px " + -h + "px " + -c + "px " + -d + "px",
      threshold: ze(0, it(1, l)) || 1
    };
    let x = !0;
    function _(g) {
      const E = g[0].intersectionRatio;
      if (E !== l) {
        if (!x)
          return a();
        E ? a(!1, E) : r = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      E === 1 && !ea(f, t.getBoundingClientRect()) && a(), x = !1;
    }
    try {
      i = new IntersectionObserver(_, {
        ...y,
        // Handle <iframe>s
        root: n.ownerDocument
      });
    } catch {
      i = new IntersectionObserver(_, y);
    }
    i.observe(t);
  }
  return a(!0), s;
}
function ta(t, e, i, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: n = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, f = mr(t), m = n || s ? [...f ? _t(f) : [], ..._t(e)] : [];
  m.forEach((d) => {
    n && d.addEventListener("scroll", i, {
      passive: !0
    }), s && d.addEventListener("resize", i);
  });
  const w = f && o ? Bu(f, i) : null;
  let T = -1, b = null;
  a && (b = new ResizeObserver((d) => {
    let [p] = d;
    p && p.target === f && b && (b.unobserve(e), cancelAnimationFrame(T), T = requestAnimationFrame(() => {
      var y;
      (y = b) == null || y.observe(e);
    })), i();
  }), f && !l && b.observe(f), b.observe(e));
  let u, h = l ? qe(t) : null;
  l && c();
  function c() {
    const d = qe(t);
    h && !ea(h, d) && i(), h = d, u = requestAnimationFrame(c);
  }
  return i(), () => {
    var d;
    m.forEach((p) => {
      n && p.removeEventListener("scroll", i), s && p.removeEventListener("resize", i);
    }), w?.(), (d = b) == null || d.disconnect(), b = null, l && cancelAnimationFrame(u);
  };
}
const je = gu, Ye = vu, Ke = fu, Hu = du, Je = (t, e, i) => {
  const r = /* @__PURE__ */ new Map(), n = {
    platform: Uu,
    ...i
  }, s = {
    ...n.platform,
    _c: r
  };
  return hu(t, e, {
    ...n,
    platform: s
  });
};
function Wu(t) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), Je(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [je(this.pixelOffset), Ke(), Ye({ padding: 8 })]
      }).then(({ x: e, y: i }) => {
        Object.assign(this.contentEl.style, { left: `${e}px`, top: `${i}px` });
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
      const i = this.menuItems.indexOf(e);
      i !== -1 && (this.focusedIndex = i, e.focus());
    },
    /**
     * Executes the `handleItemClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemClick` when applicable.
     */
    handleItemClick(e) {
      const i = e.currentTarget;
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      if (i.getAttribute("aria-haspopup") === "menu") {
        t.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      this.open = !1;
      let r = this;
      this.$nextTick(() => r.triggerEl?.focus());
    },
    /**
     * Executes the `handleItemMouseEnter` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
     */
    handleItemMouseEnter(e) {
      const i = e.currentTarget;
      this.focusSelectedItem(i), i.getAttribute("aria-haspopup") !== "menu" && this.closeAllSubmenus();
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
      document.querySelectorAll(
        `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.selfId}"]`
      ).forEach((i) => t.$data(i)?.closeSubmenu?.()), this.isSubmenuActive = !1;
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
          const r = document.querySelectorAll(
            `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.parentDropdown.selfId}"]`
          );
          Array.from(r).some((s) => t.$data(s)?.open) || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(e) {
      !this.triggerEl || !e || Je(this.triggerEl, e, {
        placement: this.anchor,
        middleware: [je(this.pixelOffset), Ke(), Ye({ padding: 8 })]
      }).then(({ x: i, y: r }) => {
        Object.assign(e.style, { left: `${i}px`, top: `${r}px` });
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
      e && Array.from(e).some((r) => t.$data(r)?.open) || (this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay));
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
      this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]')?.forEach((i) => {
        t.$data(i)?.closeSubmenu();
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
        t.$data(i)?.closeSubmenu();
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
      const i = e.currentTarget;
      if (!(i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled"))) {
        if (i.getAttribute("aria-haspopup") === "menu") {
          t.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
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
    handleItemMouseEnter(e) {
      const i = e.currentTarget;
      if (i.getAttribute("aria-disabled") === "true" || i.hasAttribute("disabled")) return;
      const r = this.menuItems.indexOf(i);
      r !== -1 && (this.focusedIndex = r, i.focus()), i.getAttribute("aria-haspopup") === "menu" ? t.$data(i.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu() : this.closeSiblingSubmenus();
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
function qu(t) {
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
function ju(t) {
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
        this.resizeIframe(this.iframe), new ResizeObserver((n) => {
          for (let s of n)
            e();
        }).observe(this.iframe);
        const r = this.iframe;
        this.onDarkModeToggle = (n) => {
          r.contentWindow.postMessage(n.detail, "*");
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
            const r = i.body;
            if (!r)
              setInterval(() => {
                this.resizeIframe(e);
              }, 150);
            else {
              const n = r.scrollHeight + 15;
              e.style.height = n + "px";
            }
          }
        } catch (i) {
          console.error("Error resizing iframe:", i);
        }
    },
    // Debounce helper to limit function calls
    debounce(e, i = 300) {
      let r;
      return (...n) => {
        clearTimeout(r), r = setTimeout(() => {
          e.apply(this, n);
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
const an = 160;
function Yu(t) {
  t.data("rzEventViewer", () => ({
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
      for (const e of this.eventNames) {
        const i = this.createHandler(e);
        this._handlers.set(e, i), this.targetEl.addEventListener(e, i), this._boundEvents.add(e);
      }
      this.appendSystemEntry(`Listening for: ${this.eventNames.join(", ")}`);
    },
    destroy() {
      if (this.targetEl)
        for (const [e, i] of this._handlers.entries())
          this.targetEl.removeEventListener(e, i);
      this._handlers.clear(), this._boundEvents.clear();
    },
    parseBoolean(e, i) {
      return typeof e != "string" || e.length === 0 ? i : e === "true";
    },
    resolveEventNames() {
      const e = [], i = this.$el.dataset.eventName || "", r = this.$el.dataset.eventNames || "";
      if (i.trim().length > 0 && e.push(i.trim()), r.trim().length > 0) {
        const a = r.trim();
        if (a.startsWith("["))
          try {
            const o = JSON.parse(a);
            if (Array.isArray(o))
              for (const l of o)
                typeof l == "string" ? e.push(l.trim()) : this.appendSystemEntry("Ignored non-string event name in JSON array.");
          } catch {
            this.appendSystemEntry("Failed to parse JSON event names; treating as CSV."), e.push(...a.split(",").map((o) => o.trim()));
          }
        else
          e.push(...a.split(",").map((o) => o.trim()));
      }
      const n = [], s = /* @__PURE__ */ new Set();
      for (const a of e)
        !a || s.has(a) || (s.add(a), n.push(a));
      return n;
    },
    resolveTargetElement(e) {
      return e === "window" ? window : e === "document" ? document : document.querySelector(e);
    },
    createHandler(e) {
      return (i) => {
        if (this.paused)
          return;
        const r = i?.type || e, n = i instanceof CustomEvent ? i.detail : i?.detail, s = this.applyFilter(n, this.filterPath);
        this.entries.push(this.buildEntry(r, s)), this.enforceMaxEntries(), this.scrollToBottom();
      };
    },
    buildEntry(e, i) {
      const r = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "", n = this.stringifyDetail(i, this.pretty), s = this.buildBodyPreview(i), a = this.appendMetaSuffix(n), o = this.appendMetaSuffix(s);
      return {
        id: `${e}-${this._entryId++}`,
        type: e,
        level: this.level,
        hasTimestamp: this.showTimestamp,
        timestamp: r,
        bodyRaw: a,
        bodyPreview: o,
        body: a,
        expanded: !1,
        toggleLabel: this.expandText,
        toggleClass: ""
      };
    },
    buildBodyPreview(e) {
      if (e === void 0)
        return "undefined";
      if (e === null)
        return "null";
      if (typeof e == "string")
        return this.truncatePreview(this.toSingleLine(e.trim()));
      const i = this.stringifyDetail(e, !1);
      return this.truncatePreview(this.toSingleLine(i));
    },
    appendMetaSuffix(e) {
      return this.showEventMeta ? `${e} [level:${this.level}]` : e;
    },
    toSingleLine(e) {
      return e.replace(/\s+/g, " ").trim();
    },
    truncatePreview(e) {
      return e.length <= an ? e : `${e.slice(0, an - 1)}…`;
    },
    enforceMaxEntries() {
      this.entries.length > this.maxEntries && this.entries.splice(0, this.entries.length - this.maxEntries), this.expandedEntryId && !this.entries.some((e) => e.id === this.expandedEntryId) && (this.expandedEntryId = null);
    },
    handleConsoleScroll() {
      if (!this.$refs.console)
        return;
      const e = this.$refs.console.scrollHeight - (this.$refs.console.scrollTop + this.$refs.console.clientHeight);
      this.stickToBottom = e < 12;
    },
    scrollToBottom() {
      !this.autoScroll || !this.stickToBottom || this.$nextTick(() => {
        this.$refs.console && (this.$refs.console.scrollTop = this.$refs.console.scrollHeight);
      });
    },
    toggleEntryExpansion(e) {
      const i = e?.currentTarget?.dataset?.entryId || e?.target?.dataset?.entryId;
      if (!i)
        return;
      const r = this.expandedEntryId === i ? null : i;
      this.expandedEntryId = r;
      for (const n of this.entries) {
        const s = n.id === this.expandedEntryId;
        n.expanded = s, n.toggleClass = s ? "rotate-90" : "", n.toggleLabel = s ? this.collapseText : this.expandText;
      }
    },
    stringifyDetail(e, i) {
      if (e === void 0) return "undefined";
      if (e === null) return "null";
      if (typeof e == "string") return e;
      if (typeof e == "number" || typeof e == "boolean") return String(e);
      const r = /* @__PURE__ */ new WeakSet(), n = (a) => !a || typeof a != "object" ? !1 : typeof Node < "u" && a instanceof Node || typeof Window < "u" && a instanceof Window ? !0 : typeof a.nodeType == "number" && typeof a.nodeName == "string", s = (a, o) => {
        if (o === void 0) return "undefined";
        if (typeof o == "function") return "function (hidden)";
        if (typeof o == "bigint") return `${o}n`;
        if (typeof o == "symbol") return "symbol (hidden)";
        if (n(o)) return "element (hidden)";
        if (o && typeof o == "object") {
          if (r.has(o))
            return "[circular]";
          r.add(o);
        }
        return o;
      };
      try {
        return i ? JSON.stringify(e, s, 2) : JSON.stringify(e, s);
      } catch {
        return "[unserializable detail]";
      }
    },
    applyFilter(e, i) {
      if (!i || i.trim().length === 0)
        return e;
      const r = i.split(".").map((s) => s.trim()).filter(Boolean);
      let n = e;
      for (const s of r) {
        if (n == null || typeof n != "object" || !(s in n))
          return;
        n = n[s];
      }
      return n;
    },
    appendSystemEntry(e) {
      const i = this.truncatePreview(this.toSingleLine(e));
      this.entries.push({
        id: `system-${this._entryId++}`,
        type: "system",
        level: "info",
        hasTimestamp: !1,
        timestamp: "",
        bodyRaw: e,
        bodyPreview: i,
        body: e,
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
      const e = this.entries.map((i) => `${i.hasTimestamp ? `${i.timestamp} ` : ""}${i.type} ${i.bodyRaw}`).join(`
`);
      if (navigator.clipboard && typeof navigator.clipboard.writeText == "function")
        try {
          await navigator.clipboard.writeText(e), this.copied = !0;
        } catch {
          this.copied = !1;
        }
    }
  }));
}
function Ku(t) {
  t.data("rzFileInput", () => ({
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
    handleDrop(e) {
      this.handleDragLeave();
      const i = this.$refs.input, r = e?.dataTransfer?.files;
      !i || !r || r.length === 0 || (this.applyDroppedFiles(i, r), this.syncFromInput());
    },
    removeFileByIndex(e) {
      const i = this.$refs.input;
      if (!i?.files)
        return;
      const r = e?.currentTarget?.dataset?.index, n = Number.parseInt(r ?? "-1", 10);
      if (Number.isNaN(n) || n < 0)
        return;
      const s = new DataTransfer();
      Array.from(i.files).forEach((a, o) => {
        o !== n && s.items.add(a);
      }), i.files = s.files, this.syncFromInput();
    },
    applyDroppedFiles(e, i) {
      const r = new DataTransfer();
      e.multiple && e.files ? (Array.from(e.files).forEach((s) => r.items.add(s)), Array.from(i).forEach((s) => r.items.add(s))) : i.length > 0 && r.items.add(i[0]), e.files = r.files;
    },
    syncFromInput() {
      const e = this.$refs.input;
      if (this.revokePreviews(), !e?.files) {
        this.files = [], this.hasFiles = !1;
        return;
      }
      this.files = Array.from(e.files).map((i) => {
        const r = i.type.startsWith("image/"), n = r ? URL.createObjectURL(i) : null;
        return {
          name: i.name,
          size: i.size,
          formattedSize: this.formatFileSize(i.size),
          isImage: r,
          previewUrl: n
        };
      }), this.hasFiles = this.files.length > 0;
    },
    formatFileSize(e) {
      if (!Number.isFinite(e) || e <= 0)
        return "0 B";
      const i = ["B", "KB", "MB", "GB", "TB"], r = Math.min(Math.floor(Math.log(e) / Math.log(1024)), i.length - 1), n = e / 1024 ** r;
      return `${n >= 10 || r === 0 ? Math.round(n) : n.toFixed(1)} ${i[r]}`;
    },
    revokePreviews() {
      this.files.forEach((e) => {
        e.previewUrl && URL.revokeObjectURL(e.previewUrl);
      });
    },
    destroy() {
      this.revokePreviews();
    }
  }));
}
function Ju(t) {
  t.data("rzEmpty", () => {
  });
}
function Gu(t) {
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
        const i = (n, s) => {
          n.forEach((a) => {
            a.isIntersecting && e.setCurrentHeading(e.headingId);
          });
        }, r = { threshold: 0.5 };
        this.observer = new IntersectionObserver(i, r), this.observer.observe(this.$el);
      }
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
function Xu(t, e) {
  t.data("rzHighlighter", () => ({
    annotation: null,
    resizeObserver: null,
    intersectionObserver: null,
    rafId: 0,
    hasShown: !1,
    config: null,
    init() {
      this.config = this.readConfig();
      const i = this.parseAssets(this.$el.dataset.assets), r = this.$el.dataset.nonce;
      e(i, {
        success: () => {
          this.start();
        },
        error: () => {
          console.error("Failed to load assets for rzHighlighter.");
        }
      }, r);
    },
    destroy() {
      this.cleanup();
    },
    readConfig() {
      const i = this.$el.dataset ?? {};
      return {
        action: i.action || "highlight",
        color: i.color || "#ffd1dc",
        strokeWidth: this.toNumber(i.strokeWidth, 1.5),
        animationDuration: this.toInteger(i.animationDuration, 600),
        iterations: this.toInteger(i.iterations, 2),
        padding: this.toInteger(i.padding, 2),
        multiline: this.toBool(i.multiline, !0),
        startOnView: this.toBool(i.startOnView, !1),
        viewMargin: i.viewMargin || "-10%"
      };
    },
    parseAssets(i) {
      if (!i)
        return [];
      try {
        const r = JSON.parse(i);
        return Array.isArray(r) ? r : [];
      } catch {
        return [];
      }
    },
    start() {
      if (this.config.startOnView) {
        this.observeViewport();
        return;
      }
      this.showAnnotation();
    },
    observeViewport() {
      const i = this.$refs.target;
      if (!i || typeof IntersectionObserver > "u") {
        this.showAnnotation();
        return;
      }
      this.intersectionObserver = new IntersectionObserver((r) => {
        !r.some((s) => s.isIntersecting) || this.hasShown || (this.showAnnotation(), this.intersectionObserver?.disconnect(), this.intersectionObserver = null);
      }, { rootMargin: this.config.viewMargin }), this.intersectionObserver.observe(i);
    },
    showAnnotation() {
      const i = this.$refs.target, r = window.RoughNotation?.annotate;
      !i || typeof r != "function" || (this.annotation || (this.annotation = r(i, {
        type: this.config.action,
        color: this.config.color,
        strokeWidth: this.config.strokeWidth,
        animationDuration: this.config.animationDuration,
        iterations: this.config.iterations,
        padding: this.config.padding,
        multiline: this.config.multiline
      })), this.annotation.show(), this.hasShown = !0, this.observeResize());
    },
    observeResize() {
      const i = this.$refs.target;
      !i || typeof ResizeObserver > "u" || this.resizeObserver || (this.resizeObserver = new ResizeObserver(() => {
        this.scheduleRefresh();
      }), this.resizeObserver.observe(i), this.resizeObserver.observe(document.body));
    },
    scheduleRefresh() {
      this.rafId && cancelAnimationFrame(this.rafId), this.rafId = requestAnimationFrame(() => {
        this.refreshAnnotation();
      });
    },
    refreshAnnotation() {
      !this.hasShown || !this.annotation || (this.annotation.hide(), this.annotation.show());
    },
    removeAnnotation() {
      this.annotation && (this.annotation.remove(), this.annotation = null);
    },
    cleanup() {
      this.rafId && (cancelAnimationFrame(this.rafId), this.rafId = 0), this.resizeObserver?.disconnect(), this.intersectionObserver?.disconnect(), this.resizeObserver = null, this.intersectionObserver = null, this.removeAnnotation();
    },
    toBool(i, r) {
      return i === "true" ? !0 : i === "false" ? !1 : r;
    },
    toInteger(i, r) {
      const n = Number.parseInt(i, 10);
      return Number.isNaN(n) ? r : n;
    },
    toNumber(i, r) {
      const n = Number.parseFloat(i);
      return Number.isNaN(n) ? r : n;
    }
  }));
}
function Zu(t) {
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
function Qu(t) {
  t.data("rzInputGroupAddon", () => ({
    /**
     * Executes the `handleClick` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `handleClick` when applicable.
     */
    handleClick(e) {
      if (e.target.closest("button"))
        return;
      const i = this.$el.parentElement;
      i && i.querySelector("input, textarea")?.focus();
    }
  }));
}
function eh(t) {
  t.data("rzInputOTP", () => ({
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
    setValue(e) {
      const i = this.sanitizeValue(e || ""), r = this.value;
      this.clearSelection(), this.value = i, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(r), this.dispatchChangeEvent(r);
    },
    /**
     * Handles input typing updates.
     * @param {InputEvent} event
     */
    onInput(e) {
      this.clearSelection(), this.syncFromInput(e?.target);
    },
    /**
     * Handles paste behavior for OTP values.
     * @param {ClipboardEvent} event
     */
    onPaste(e) {
      e.preventDefault();
      const i = e.clipboardData ? e.clipboardData.getData("text") : "", r = this.sanitizeValue(i), n = this.value;
      this.clearSelection(), this.value = r, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(n), this.dispatchChangeEvent(n);
    },
    /**
     * Handles keyboard navigation and deletion.
     * @param {KeyboardEvent} event
     */
    onKeyDown(e) {
      if (this.hasSelection() && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault(), this.clearAllSlots();
        return;
      }
      if (this.hasSelection() && this.selectedIndexes.length > 1 && this.isAcceptableInputChar(e.key)) {
        e.preventDefault(), this.replaceSelectionWithKey(e.key);
        return;
      }
      if (this.isAcceptableInputChar(e.key)) {
        e.preventDefault(), this.replaceActiveSlotWithKey(e.key);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault(), this.clearSelection(), this.moveLeft();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault(), this.clearSelection(), this.moveRight();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault(), this.clearSelection(), this.moveHome();
        return;
      }
      if (e.key === "End") {
        e.preventDefault(), this.clearSelection(), this.moveEnd();
        return;
      }
      e.key === "Backspace" && this.handleBackspace();
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
    preventMouseDown(e) {
      e.preventDefault();
    },
    /**
     * Focuses the native input and updates active slot from clicked index.
     * @param {MouseEvent} event
     */
    focusSlot(e) {
      const i = e.currentTarget, r = Number(i.dataset.index || "0");
      this.canFocusIndex(r) && (this.clearSelection(), this.activeIndex = this.normalizeIndex(r), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots());
    },
    /**
     * Selects all currently filled slots from a double click gesture.
     */
    selectFilledSlots() {
      const e = this.slots.map((r, n) => ({ slot: r, index: n })).filter(({ slot: r }) => r.char !== "").map(({ index: r }) => r);
      if (e.length === 0) {
        this.clearSelection(), this.refreshSlots();
        return;
      }
      this.selectedIndexes = e, this.isFocused = !0, this.focusInput();
      const i = this.$refs.input;
      i && i.setSelectionRange(0, this.value.length), this.refreshSlots();
    },
    registerSlot() {
      !this.$el || this.$el.dataset.inputOtpSlot !== "true" || (this.slotElements.includes(this.$el) || (this.slotElements.push(this.$el), this.slotElements.sort((e, i) => Number(e.dataset.index || "0") - Number(i.dataset.index || "0"))), this.refreshSlots());
    },
    moveLeft() {
      this.activeIndex = this.normalizeIndex(this.activeIndex - 1), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    moveRight() {
      const e = this.normalizeIndex(this.activeIndex + 1);
      this.canFocusIndex(e) && (this.activeIndex = e, this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots());
    },
    moveHome() {
      this.activeIndex = 0, this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    moveEnd() {
      this.activeIndex = this.getMaxFocusableIndex(), this.focusInput(), this.setCaretToActiveIndex(), this.refreshSlots();
    },
    handleBackspace() {
      const e = this.$refs.input;
      if (!e) return;
      const i = e.selectionStart || 0, r = e.selectionEnd || 0;
      i === r && (i <= 0 || (this.activeIndex = this.normalizeIndex(i - 1), this.refreshSlots()));
    },
    syncFromInput(e) {
      const i = e || this.$refs.input;
      if (!i) return;
      const r = this.value;
      this.value = this.sanitizeValue(i.value || ""), this.value !== i.value && (i.value = this.value), this.setActiveFromCaret(this.value.length), this.refreshSlots(), this.dispatchInputEvent(r), this.dispatchChangeEvent(r);
    },
    sanitizeValue(e) {
      if (!e) return "";
      const i = this.otpType === "alphanumeric" ? /[^a-zA-Z0-9]/g : /[^0-9]/g, r = e.replace(i, "").slice(0, this.length);
      return this.applyTextTransform(r);
    },
    applyTextTransform(e) {
      return e ? this.textTransform === "to-lower" ? e.toLowerCase() : this.textTransform === "to-upper" ? e.toUpperCase() : e : "";
    },
    applyValueToInput() {
      const e = this.$refs.input;
      e && (e.value = this.value, this.setCaretToActiveIndex());
    },
    setActiveFromCaret(e) {
      const i = this.$refs.input;
      if (!i) {
        this.activeIndex = this.getMaxFocusableIndex(e ?? 0);
        return;
      }
      const r = i.selectionStart, n = r == null ? Number.isFinite(e) ? Number(e) : 0 : Number(r), s = this.normalizeIndex(n);
      if (this.canFocusIndex(s)) {
        this.activeIndex = s;
        return;
      }
      this.activeIndex = this.getMaxFocusableIndex();
    },
    setCaretToActiveIndex() {
      const e = this.$refs.input;
      if (!e) return;
      const i = this.normalizeIndex(this.activeIndex);
      e.setSelectionRange(i, i);
    },
    focusInput() {
      const e = this.$refs.input;
      e && e.focus();
    },
    hasSelection() {
      return this.selectedIndexes.length > 0;
    },
    clearSelection() {
      this.selectedIndexes = [];
    },
    clearAllSlots() {
      const e = this.value;
      this.clearSelection(), this.value = "", this.activeIndex = 0, this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(e);
    },
    replaceSelectionWithKey(e) {
      const i = this.sanitizeValue(e).charAt(0);
      if (!i) return;
      const r = this.value;
      this.value = i, this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(r);
    },
    replaceActiveSlotWithKey(e) {
      const i = this.sanitizeValue(e).charAt(0);
      if (!i) return;
      const r = this.canFocusIndex(this.activeIndex) ? this.normalizeIndex(this.activeIndex) : this.getMaxFocusableIndex(), n = this.value.split("");
      for (; n.length < r; )
        n.push("");
      n[r] = i;
      const s = this.value;
      this.value = this.applyTextTransform(n.join("").slice(0, this.length)), this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(r + 1), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(s), this.dispatchChangeEvent(s);
    },
    isAcceptableInputChar(e) {
      return !e || e.length !== 1 ? !1 : this.otpType === "alphanumeric" ? /^[a-zA-Z0-9]$/.test(e) : /^[0-9]$/.test(e);
    },
    getNextFillIndex() {
      return this.length <= 0 ? 0 : Math.min(this.value.length, this.length - 1);
    },
    getMaxFocusableIndex(e) {
      const i = Number.isFinite(e) ? this.normalizeIndex(Number(e)) : this.getNextFillIndex();
      return this.canFocusIndex(i) ? i : this.getNextFillIndex();
    },
    canFocusIndex(e) {
      const i = this.normalizeIndex(e);
      return this.value.charAt(i) !== "" ? !0 : i === this.getNextFillIndex();
    },
    dispatchInputEvent(e) {
      this.value !== e && this.$dispatch("rz:inputotp:oninput", {
        value: this.value,
        previousValue: e,
        activeIndex: this.activeIndex,
        isComplete: this.value.length === this.length,
        length: this.length,
        otpType: this.otpType,
        textTransform: this.textTransform
      });
    },
    dispatchChangeEvent(e) {
      this.value !== e && this.value.length === this.length && this.$dispatch("rz:inputotp:onchange", {
        value: this.value,
        previousValue: e,
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
      const e = [];
      let i = 0;
      for (; i < this.length; ) {
        const r = this.value.charAt(i) || "", n = this.selectedIndexes.includes(i), s = this.isFocused && !this.hasSelection() && i === this.activeIndex, a = this.isFocused && !this.hasSelection() && s && r === "";
        e.push({ char: r, isActive: s, hasFakeCaret: a, isSelected: n }), i += 1;
      }
      this.slots = e;
    },
    updateSlotDom() {
      const e = this.$el?.closest("[data-alpine-root]") || this.$el;
      (this.slotElements.length > 0 ? this.slotElements : e.querySelectorAll('[data-input-otp-slot="true"]')).forEach((r) => {
        const n = Number(r.dataset.index || "0"), s = this.slots[n] || { char: "", isActive: !1, hasFakeCaret: !1, isSelected: !1 };
        r.dataset.active = s.isActive ? "true" : "false", r.dataset.focused = this.isFocused ? "true" : "false", r.dataset.selected = s.isSelected ? "true" : "false", r.dataset.focusable = this.canFocusIndex(n) ? "true" : "false", this.isInvalid ? r.setAttribute("aria-invalid", "true") : r.removeAttribute("aria-invalid");
        const a = r.querySelector('[data-input-otp-char="true"]');
        a && (a.textContent = s.char);
        const o = r.querySelector('[data-input-otp-caret="true"]');
        o && (s.hasFakeCaret ? o.classList.remove("hidden") : o.classList.add("hidden"));
      });
    },
    normalizeIndex(e) {
      return this.length <= 0 || e < 0 ? 0 : e > this.length - 1 ? this.length - 1 : e;
    }
  }));
}
function th(t, e) {
  t.data("rzMarkdown", () => ({
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets), r = this.$el.dataset.nonce;
      e(i, {
        success: function() {
          window.hljs.highlightAll();
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, r);
    }
  }));
}
function ih(t) {
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
    setTriggerState(e, i) {
      e && (e.dataset.state = i ? "open" : "closed", e.setAttribute("aria-expanded", i ? "true" : "false"));
    },
    commonPrefixLen(e, i) {
      let r = 0;
      for (; r < e.length && r < i.length && e[r] === i[r]; ) r++;
      return r;
    },
    setOpenPath(e) {
      const i = Array.isArray(e) ? e.filter(Boolean) : [], r = this.commonPrefixLen(this.openPath, i);
      (r !== this.openPath.length || r !== i.length) && (this.openPath = i, this.$nextTick(() => this.syncSubmenus()));
    },
    openMenu(e, i) {
      e && (this.cancelCloseAll(), this.currentTrigger && this.currentTrigger !== i && this.setTriggerState(this.currentTrigger, !1), this.currentMenuValue = e, this.currentTrigger = i, this.setTriggerState(i, !0), this.setOpenPath([]), this.$nextTick(() => {
        const r = this.$el.querySelector(`[data-menu-content="${e}"]`) ?? document.querySelector(`[data-menu-content="${e}"]`);
        !r || !i || Je(i, r, {
          placement: "bottom-start",
          middleware: [je(4), Ke(), Ye({ padding: 8 })]
        }).then(({ x: n, y: s }) => {
          Object.assign(r.style, { left: `${n}px`, top: `${s}px` });
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
      const i = e.currentTarget, r = this.getMenuValueFromTrigger(i);
      this.currentMenuValue === r ? this.closeMenus() : this.openMenu(r, i), e.preventDefault();
    },
    handleTriggerPointerEnter(e) {
      if (!this.currentMenuValue) return;
      const i = e.currentTarget, r = this.getMenuValueFromTrigger(i);
      r && r !== this.currentMenuValue && this.openMenu(r, i);
    },
    handleTriggerKeydown(e) {
      const i = e.currentTarget, r = this.getMenuValueFromTrigger(i);
      if (["Enter", " ", "ArrowDown"].includes(e.key)) {
        this.openMenu(r, i), e.preventDefault();
        return;
      }
      if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
        const n = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), s = n.indexOf(i);
        if (s < 0) return;
        const a = e.key === "ArrowRight" ? (s + 1) % n.length : (s - 1 + n.length) % n.length, o = n[a];
        if (!o) return;
        o.focus(), this.currentMenuValue && this.openMenu(this.getMenuValueFromTrigger(o), o), e.preventDefault();
      }
    },
    handleContentKeydown(e) {
      e.key === "Escape" && (this.closeMenus(), this.currentTrigger?.focus()), e.key === "Tab" && this.closeMenus();
    },
    handleItemMouseEnter(e) {
      const i = e.currentTarget;
      if (!i || i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true") return;
      i.dataset.highlighted = "", i.focus();
      const r = this.buildPathToSubTrigger(i);
      this.setOpenPath(r);
    },
    handleItemMouseLeave(e) {
      const i = e.currentTarget;
      i && (delete i.dataset.highlighted, document.activeElement === i && i.blur());
    },
    handleItemClick(e) {
      const i = e.currentTarget;
      i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true" || i.getAttribute("aria-haspopup") !== "menu" && (this.closeMenus(), this.currentTrigger?.focus());
    },
    toggleCheckboxItem(e) {
      const i = e.currentTarget, r = i.getAttribute("data-state") === "checked";
      i.setAttribute("data-state", r ? "unchecked" : "checked"), i.setAttribute("aria-checked", r ? "false" : "true");
    },
    selectRadioItem(e) {
      const i = e.currentTarget, r = i.getAttribute("data-radio-group");
      if (!r) return;
      (this.$el.closest(`[role="group"][data-radio-group="${r}"]`)?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${r}"]`) ?? []).forEach((a) => {
        a.setAttribute("data-state", "unchecked"), a.setAttribute("aria-checked", "false");
      }), i.setAttribute("data-state", "checked"), i.setAttribute("aria-checked", "true");
    },
    buildPathToSubTrigger(e) {
      const i = [];
      let r = e.closest('[data-slot="menubar-sub"]');
      for (; r; ) {
        const n = r.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!n?.id) break;
        i.unshift(n.id), r = r.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
      }
      return i;
    },
    handleSubTriggerPointerEnter(e) {
      if (!this.currentMenuValue) return;
      this.cancelCloseAll();
      const i = e.currentTarget, r = this.buildPathToSubTrigger(i);
      this.setOpenPath(r);
    },
    handleSubTriggerClick(e) {
      const i = e.currentTarget, r = this.buildPathToSubTrigger(i), n = this.openPath.length === r.length && this.openPath.every((s, a) => s === r[a]);
      this.setOpenPath(n ? r.slice(0, -1) : r);
    },
    handleSubTriggerKeyRight(e) {
      this.handleSubTriggerPointerEnter(e), this.$nextTick(() => {
        e.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(e) {
      const i = Array.from(e.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const r = i.indexOf(document.activeElement), n = r < 0 || r >= i.length - 1 ? 0 : r + 1;
      i[n]?.focus();
    },
    focusPreviousItem(e) {
      const i = Array.from(e.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const r = i.indexOf(document.activeElement), n = r <= 0 ? i.length - 1 : r - 1;
      i[n]?.focus();
    },
    handleSubContentLeftKey(e) {
      const r = e.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!r) return;
      const n = this.buildPathToSubTrigger(r);
      this.setOpenPath(n.slice(0, -1)), r.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((r) => {
        const n = r.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), s = r.querySelector(':scope > [data-slot="menubar-sub-content"]'), a = n?.id, o = !!a && this.openPath.includes(a);
        this.setTriggerState(n, o), s && (s.hidden = !o, s.style.display = o ? "" : "none", s.dataset.state = o ? "open" : "closed", o && n && Je(n, s, {
          placement: "right-start",
          middleware: [je(4), Ke(), Ye({ padding: 8 })]
        }).then(({ x: l, y: f }) => {
          Object.assign(s.style, { left: `${l}px`, top: `${f}px` });
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
      const i = e.target;
      if (i instanceof Node && this.$el.contains(i)) return;
      const r = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      i instanceof Node && r?.contains(i) || this.closeMenus();
    },
    handleDocumentFocusIn(e) {
      const i = e.target;
      !(i instanceof Node) || this.$el.contains(i) || (this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.contains(i) || this.closeMenus();
    },
    handleWindowBlur() {
      this.closeMenus();
    }
  }));
}
function rh(t, e) {
  t.data("rzNavigationMenu", () => ({
    activeItemId: null,
    open: !1,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: !1,
    /* ---------- helpers ---------- */
    _triggerIndex(i) {
      return this.list ? Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]')).findIndex((n) => n.getAttribute("x-ref") === `trigger_${i}`) : -1;
    },
    _contentEl(i) {
      return document.getElementById(`${i}-content`);
    },
    /* ---------- lifecycle ---------- */
    init() {
      this.$el.querySelectorAll("[data-popover]").forEach((r) => {
        r.style.display = "none";
      }), this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },
    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(i) {
      const r = i.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.activeItemId === r && this.open ? this.closeMenu() : this.openMenu(r);
    },
    /**
     * Executes the `handleTriggerEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerEnter` when applicable.
     */
    handleTriggerEnter(i) {
      const r = i.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose(), this.activeItemId !== r && !this.isClosing && requestAnimationFrame(() => this.openMenu(r));
    },
    /**
     * Executes the `handleItemEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleItemEnter` when applicable.
     */
    handleItemEnter(i) {
      const r = i.currentTarget;
      if (!r) return;
      this.cancelClose();
      const n = r.querySelector('[x-ref^="trigger_"]');
      if (n) {
        const s = n.getAttribute("x-ref").replace("trigger_", "");
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
      const r = this._triggerIndex(i), n = r > (this.prevIndex ?? r) ? "end" : "start", s = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== i) {
        const l = this.$refs[`trigger_${this.activeItemId}`];
        l && delete l.dataset.state;
        const f = this._contentEl(this.activeItemId);
        if (f) {
          const m = n === "end" ? "start" : "end";
          f.setAttribute("data-motion", `to-${m}`), setTimeout(() => {
            f.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = i, this.open = !0, this.prevIndex = r;
      const a = this.$refs[`trigger_${i}`], o = this._contentEl(i);
      !a || !o || (Je(a, o, {
        placement: "bottom-start",
        middleware: [je(6), Ke(), Ye({ padding: 8 })]
      }).then(({ x: l, y: f }) => {
        Object.assign(o.style, { left: `${l}px`, top: `${f}px` });
      }), o.style.display = "block", s ? o.setAttribute("data-motion", "fade-in") : o.setAttribute("data-motion", `from-${n}`), this.$nextTick(() => {
        a.setAttribute("aria-expanded", "true"), a.dataset.state = "open";
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
      const r = this.$refs[`trigger_${i}`];
      r && (r.setAttribute("aria-expanded", "false"), delete r.dataset.state);
      const n = this._contentEl(i);
      n && (n.setAttribute("data-motion", "fade-out"), setTimeout(() => {
        n.style.display = "none";
      }, 150)), this.open = !1, this.activeItemId = null, this.prevIndex = null, setTimeout(() => {
        this.isClosing = !1;
      }, 150);
    }
  }));
}
function nh(t) {
  t.data("rzNumberTicker", () => ({
    targetValue: 0,
    startValue: 0,
    currentValue: 0,
    destinationValue: 0,
    direction: "up",
    delayMs: 0,
    decimalPlaces: 0,
    culture: "",
    useGrouping: !0,
    triggerOnView: !0,
    animateOnce: !0,
    disableAnimation: !1,
    hasAnimated: !1,
    observer: null,
    rafId: null,
    delayTimer: null,
    animationStartTimestamp: 0,
    animationStartValue: 0,
    animationDurationMs: 1200,
    init() {
      if (this.configure(), this.disableAnimation || this.targetValue === this.startValue || !this.canSafelyAnimate()) {
        this.setDisplay(this.destinationValue);
        return;
      }
      if (this.triggerOnView) {
        this.observe();
        return;
      }
      this.startAnimation();
    },
    configure() {
      const e = this.$el.dataset;
      this.targetValue = this.parseNumber(e.value, 0), this.startValue = this.parseNumber(e.startValue, 0), this.direction = (e.direction || "up").toLowerCase() === "down" ? "down" : "up", this.delayMs = Math.max(0, this.parseNumber(e.delay, 0) * 1e3), this.decimalPlaces = Math.max(0, this.parseInteger(e.decimalPlaces, 0)), this.culture = (e.culture || "").trim(), this.useGrouping = this.parseBoolean(e.useGrouping, !0), this.triggerOnView = this.parseBoolean(e.triggerOnView, !0), this.animateOnce = this.parseBoolean(e.animateOnce, !0), this.disableAnimation = this.parseBoolean(e.disableAnimation, !1), this.currentValue = this.direction === "down" ? this.targetValue : this.startValue, this.destinationValue = this.direction === "down" ? this.startValue : this.targetValue;
      const i = Math.abs(this.destinationValue - this.currentValue);
      this.animationDurationMs = this.resolveDuration(i);
    },
    observe() {
      if (typeof IntersectionObserver != "function") {
        this.startAnimation();
        return;
      }
      this.observer = new IntersectionObserver((e) => {
        this.handleIntersect(e);
      }, { threshold: 0.1 }), this.observer.observe(this.$el);
    },
    handleIntersect(e) {
      for (const i of e)
        if (i.isIntersecting) {
          if (this.animateOnce && this.hasAnimated)
            return;
          this.startAnimation(), this.animateOnce && this.observer && (this.observer.disconnect(), this.observer = null);
          return;
        }
    },
    startAnimation() {
      this.cleanupAnimation(), this.currentValue = this.direction === "down" ? this.targetValue : this.startValue, this.animationStartValue = this.currentValue, this.animationStartTimestamp = 0, this.setDisplay(this.currentValue), this.delayTimer = window.setTimeout(() => {
        this.delayTimer = null, this.rafId = window.requestAnimationFrame((e) => this.tick(e));
      }, this.delayMs);
    },
    tick(e) {
      this.animationStartTimestamp === 0 && (this.animationStartTimestamp = e);
      const i = Math.max(0, e - this.animationStartTimestamp), r = Math.min(1, i / this.animationDurationMs), n = this.easeOutCubic(r), s = this.interpolate(this.animationStartValue, this.destinationValue, n);
      if (this.currentValue = this.clampToDirection(s), this.setDisplay(this.currentValue), r >= 1) {
        this.complete();
        return;
      }
      this.rafId = window.requestAnimationFrame((a) => this.tick(a));
    },
    formatNumber(e) {
      const i = Number(e.toFixed(this.decimalPlaces)), r = (n) => new Intl.NumberFormat(n, {
        minimumFractionDigits: this.decimalPlaces,
        maximumFractionDigits: this.decimalPlaces,
        useGrouping: this.useGrouping
      }).format(i);
      try {
        if (this.culture)
          return r(this.culture);
      } catch {
      }
      try {
        if (navigator.language)
          return r(navigator.language);
      } catch {
      }
      return r("en-US");
    },
    setDisplay(e) {
      this.$refs.value && (this.$refs.value.textContent = this.formatNumber(e));
    },
    complete() {
      this.currentValue = this.destinationValue, this.hasAnimated = !0, this.setDisplay(this.destinationValue), this.cleanupAnimation();
    },
    cleanupAnimation() {
      this.delayTimer !== null && (window.clearTimeout(this.delayTimer), this.delayTimer = null), this.rafId !== null && (window.cancelAnimationFrame(this.rafId), this.rafId = null);
    },
    cleanup() {
      this.cleanupAnimation(), this.observer && (this.observer.disconnect(), this.observer = null);
    },
    canSafelyAnimate() {
      const e = (i) => Number.isFinite(i) && Math.abs(i) <= Number.MAX_SAFE_INTEGER;
      return e(this.startValue) && e(this.targetValue);
    },
    resolveDuration(e) {
      return e < 10 ? 700 : e < 100 ? 900 : e < 1e3 ? 1200 : 1500;
    },
    interpolate(e, i, r) {
      return e + (i - e) * r;
    },
    clampToDirection(e) {
      return this.direction === "down" ? Math.max(this.destinationValue, e) : Math.min(this.destinationValue, e);
    },
    easeOutCubic(e) {
      return 1 - Math.pow(1 - e, 3);
    },
    parseNumber(e, i) {
      const r = Number(e);
      return Number.isFinite(r) ? r : i;
    },
    parseInteger(e, i) {
      const r = Number.parseInt(e, 10);
      return Number.isFinite(r) ? r : i;
    },
    parseBoolean(e, i) {
      return typeof e != "string" ? i : e.toLowerCase() === "true" ? !0 : e.toLowerCase() === "false" ? !1 : i;
    }
  }));
}
function sh(t) {
  t.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    dataState: "closed",
    contentStyle: "",
    triggerEl: null,
    contentEl: null,
    _documentClickHandler: null,
    _windowKeydownHandler: null,
    _cleanupAutoUpdate: null,
    init() {
      this.triggerEl = this.resolveTriggerElement(), this.$watch("open", (e) => {
        if (this.ariaExpanded = e.toString(), this.dataState = e ? "open" : "closed", e) {
          this.openPopover();
          return;
        }
        this.closePopover();
      });
    },
    destroy() {
      this.teardownAutoUpdate(), this.detachGlobalListeners();
    },
    toggle() {
      this.open = !this.open;
    },
    async openPopover() {
      this.triggerEl = this.resolveTriggerElement(), this.attachGlobalListeners(), this.contentStyle = this.getInitialContentStyle(), await this.$nextTick(), this.contentEl = this.resolveContentElement(), !(!this.triggerEl || !this.contentEl) && (await this.updatePosition(), this.startAutoUpdate());
    },
    closePopover() {
      this.teardownAutoUpdate(), this.detachGlobalListeners(), this.contentEl = null;
    },
    resolveTriggerElement() {
      const e = Array.from(this.$el.children).find((i) => i?.hasAttribute?.("data-trigger"));
      return e || this.$el.querySelector("[data-trigger]");
    },
    resolveContentElement() {
      const e = this.$el.dataset.contentId;
      return e ? document.getElementById(e) : null;
    },
    attachGlobalListeners() {
      this._documentClickHandler || (this._documentClickHandler = (e) => this.handleDocumentClick(e), document.addEventListener("pointerdown", this._documentClickHandler)), this._windowKeydownHandler || (this._windowKeydownHandler = (e) => this.handleWindowKeydown(e), window.addEventListener("keydown", this._windowKeydownHandler));
    },
    detachGlobalListeners() {
      this._documentClickHandler && (document.removeEventListener("pointerdown", this._documentClickHandler), this._documentClickHandler = null), this._windowKeydownHandler && (window.removeEventListener("keydown", this._windowKeydownHandler), this._windowKeydownHandler = null);
    },
    startAutoUpdate() {
      this.teardownAutoUpdate(), !(!this.triggerEl || !this.contentEl) && (this._cleanupAutoUpdate = ta(this.triggerEl, this.contentEl, () => {
        this.updatePosition();
      }));
    },
    teardownAutoUpdate() {
      this._cleanupAutoUpdate && (this._cleanupAutoUpdate(), this._cleanupAutoUpdate = null);
    },
    parseNumber(e, i = null) {
      if (e == null || e === "")
        return i;
      const r = Number(e);
      return Number.isNaN(r) ? i : r;
    },
    getInitialContentStyle() {
      return `position: ${this.$el.dataset.strategy || "absolute"}; left: 0px; top: 0px; visibility: hidden;`;
    },
    async updatePosition() {
      if (!this.triggerEl || !this.contentEl || !this.open)
        return;
      const e = this.$el.dataset.anchor || "bottom", i = this.parseNumber(this.$el.dataset.offset, 0), r = this.parseNumber(this.$el.dataset.crossAxisOffset, 0), n = this.parseNumber(this.$el.dataset.alignmentAxisOffset, null), s = this.$el.dataset.strategy || "absolute", a = this.$el.dataset.enableFlip !== "false", o = this.$el.dataset.enableShift !== "false", l = this.parseNumber(this.$el.dataset.shiftPadding, 8), f = [
        je({
          mainAxis: i,
          crossAxis: r,
          alignmentAxis: n
        })
      ];
      a && f.push(Ke()), o && f.push(Ye({ padding: l }));
      const { x: m, y: w } = await Je(this.triggerEl, this.contentEl, {
        placement: e,
        strategy: s,
        middleware: f
      });
      this.contentStyle = `position: ${s}; left: ${m}px; top: ${w}px; visibility: visible;`;
    },
    handleDocumentClick(e) {
      if (!this.open)
        return;
      const i = e.target, r = this.triggerEl?.contains?.(i) ?? !1, n = this.contentEl?.contains?.(i) ?? !1;
      r || n || (this.open = !1, this.$nextTick(() => this.restoreTriggerFocus()));
    },
    handleWindowKeydown(e) {
      e.key !== "Escape" || !this.open || (this.open = !1, this.$nextTick(() => this.restoreTriggerFocus()));
    },
    restoreTriggerFocus() {
      this.triggerEl?.isConnected && this.triggerEl.focus();
    }
  }));
}
function ah(t) {
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
      const e = this.prependContainer, i = this.textInput;
      if (!e || !i) {
        i && i.classList.remove("text-transparent");
        return;
      }
      const n = e.offsetWidth + 10;
      i.style.paddingLeft = n + "px", i.classList.remove("text-transparent");
    }
  }));
}
function oh(t) {
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
      this.currentVal = parseInt(e.getAttribute("data-current-val")) || 0, this.minVal = parseInt(e.getAttribute("data-min-val")) || 0, this.maxVal = parseInt(e.getAttribute("data-max-val")) || 100, this.label = e.getAttribute("data-label"), this.calculatePercentage(), e.setAttribute("aria-valuenow", this.currentVal), e.setAttribute("aria-valuemin", this.minVal), e.setAttribute("aria-valuemax", this.maxVal), e.setAttribute("aria-valuetext", `${this.percentage}%`), this.updateProgressBar(), new ResizeObserver((r) => {
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
      const e = this.$refs.progressBar, i = this.$refs.progressBarLabel, r = this.$refs.innerLabel;
      i && e && r && (r.innerText = this.buildLabel(), i.clientWidth > e.clientWidth ? i.style.left = e.clientWidth + 10 + "px" : i.style.left = e.clientWidth / 2 - i.clientWidth / 2 + "px");
    },
    /**
     * Executes the `getLabelCss` operation.
     * @returns {any} Returns the result of `getLabelCss` when applicable.
     */
    getLabelCss() {
      const e = this.$refs.progressBarLabel, i = this.$refs.progressBar;
      return e && i && e.clientWidth > i.clientWidth ? "text-foreground dark:text-foreground" : "";
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
function lh(t) {
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
function ch(t) {
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
      const i = () => this.update();
      this._roViewport = new ResizeObserver(i), this._roContent = new ResizeObserver(i), this._roViewport.observe(e), this.$refs.content && this._roContent.observe(this.$refs.content), this.setState(this.type === "always" ? "visible" : "hidden"), this.update();
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
    setBarMounted(e, i) {
      const r = this.$refs[`scrollbar${e === "vertical" ? "Y" : "X"}`];
      r && (r.hidden = !i);
    },
    /**
     * Executes the `update` operation.
     * @returns {any} Returns the result of `update` when applicable.
     */
    update() {
      const e = this.$refs.viewport;
      if (!e) return;
      this._viewport = e;
      const i = e.scrollWidth > e.clientWidth, r = e.scrollHeight > e.clientHeight;
      this.setBarMounted("horizontal", i), this.setBarMounted("vertical", r), this.updateThumbSizes(), this.updateThumbPositions(), this.updateCorner(), this.type === "always" && this.setState("visible"), this.type === "auto" && this.setState(i || r ? "visible" : "hidden");
    },
    /**
     * Executes the `updateThumbSizes` operation.
     * @returns {any} Returns the result of `updateThumbSizes` when applicable.
     */
    updateThumbSizes() {
      const e = this.$refs.viewport;
      if (e) {
        if (this._viewport = e, this.$refs.thumbY && this.$refs.scrollbarY && e.scrollHeight > 0) {
          const i = e.clientHeight / e.scrollHeight, r = Math.max(this.$refs.scrollbarY.clientHeight * i, 18);
          this.$refs.thumbY.style.height = `${r}px`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && e.scrollWidth > 0) {
          const i = e.clientWidth / e.scrollWidth, r = Math.max(this.$refs.scrollbarX.clientWidth * i, 18);
          this.$refs.thumbX.style.width = `${r}px`;
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
          const i = e.scrollHeight - e.clientHeight, r = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, n = e.scrollTop / i * Math.max(r, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${n}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && e.scrollWidth > e.clientWidth) {
          const i = e.scrollWidth - e.clientWidth, r = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, n = e.scrollLeft / i * Math.max(r, 0);
          this.$refs.thumbX.style.transform = `translate3d(${n}px, 0, 0)`;
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
      const i = e.currentTarget?.dataset.orientation || "vertical", r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!r || r.hidden || e.target === this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`]) return;
      const n = this.$refs.viewport, s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!n || !s) return;
      const a = r.getBoundingClientRect();
      if (i === "vertical") {
        const o = e.clientY - a.top - s.offsetHeight / 2, l = r.clientHeight - s.offsetHeight, f = n.scrollHeight - n.clientHeight;
        n.scrollTop = o / Math.max(l, 1) * f;
      } else {
        const o = e.clientX - a.left - s.offsetWidth / 2, l = r.clientWidth - s.offsetWidth, f = n.scrollWidth - n.clientWidth;
        n.scrollLeft = o / Math.max(l, 1) * f;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(e) {
      const i = e.currentTarget?.dataset.orientation || "vertical", r = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`], n = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!r || !n || n.hidden) return;
      const s = r.getBoundingClientRect();
      this._dragAxis = i, this._dragPointerOffset = i === "vertical" ? e.clientY - s.top : e.clientX - s.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(e) {
      const i = this._dragAxis, r = this.$refs.viewport, n = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`], s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!i || !r || !n || !s || n.hidden) return;
      const a = n.getBoundingClientRect();
      if (i === "vertical") {
        const o = e.clientY - a.top, l = n.clientHeight - s.offsetHeight, f = r.scrollHeight - r.clientHeight;
        r.scrollTop = (o - this._dragPointerOffset) / Math.max(l, 1) * f;
      } else {
        const o = e.clientX - a.left, l = n.clientWidth - s.offsetWidth, f = r.scrollWidth - r.clientWidth;
        r.scrollLeft = (o - this._dragPointerOffset) / Math.max(l, 1) * f;
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
function uh(t) {
  t.data("rzSlider", () => ({
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    disabled: !1,
    inverted: !1,
    minStepsBetweenThumbs: 0,
    values: [],
    activeThumbIndex: null,
    dragging: !1,
    trackEl: null,
    thumbEls: [],
    inputEls: [],
    init() {
      const e = this.$el.dataset, i = this.parseJson(e.assets, []), r = e.nonce;
      this.min = this.parseNumber(e.min, 0), this.max = this.parseNumber(e.max, 100), this.step = Math.max(this.parseNumber(e.step, 1), Number.EPSILON), this.orientation = e.orientation || "horizontal", this.disabled = this.parseBoolean(e.disabled, !1), this.inverted = this.parseBoolean(e.inverted, !1), this.minStepsBetweenThumbs = Math.max(this.parseNumber(e.minStepsBetweenThumbs, 0), 0), this.values = this.parseJson(e.values, []).map((n) => this.parseNumber(n, this.min)), this.trackEl = this.$refs.track, this.thumbEls = this.$el.querySelectorAll("[data-thumb-index]"), this.inputEls = this.$el.querySelectorAll("[data-slider-input]"), this.values = this.applyConstraints(this.values, -1, null), this.syncDom(), this.syncHiddenInputs(), i.length > 0 && ae(i, r);
    },
    handlePointerDown(e) {
      if (this.disabled)
        return;
      const i = this.parseThumbIndex(e.currentTarget);
      i < 0 || (this.activeThumbIndex = i, this.dragging = !0, e.currentTarget.focus(), e.preventDefault());
    },
    handlePointerMove(e) {
      if (this.disabled || !this.dragging || this.activeThumbIndex === null)
        return;
      const i = this.getPointerValue(e);
      this.values[this.activeThumbIndex] = i, this.values = this.applyConstraints(this.values, this.activeThumbIndex, i), this.syncDom(), this.syncHiddenInputs();
    },
    handlePointerUp() {
      this.dragging = !1, this.activeThumbIndex = null;
    },
    handleTrackPointerDown(e) {
      if (this.disabled)
        return;
      const i = this.getPointerValue(e), r = this.getNearestThumbIndex(i);
      r < 0 || (this.activeThumbIndex = r, this.values[r] = i, this.values = this.applyConstraints(this.values, r, i), this.syncDom(), this.syncHiddenInputs(), this.focusThumb(r), e.preventDefault());
    },
    handleThumbKeyDown(e) {
      if (this.disabled)
        return;
      const i = this.parseThumbIndex(e.currentTarget);
      if (i < 0)
        return;
      const r = this.step * 10, n = this.values[i] ?? this.min;
      let s = n;
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        s = n + this.step;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        s = n - this.step;
      else if (e.key === "PageUp")
        s = n + r;
      else if (e.key === "PageDown")
        s = n - r;
      else if (e.key === "Home")
        s = this.min;
      else if (e.key === "End")
        s = this.max;
      else
        return;
      this.values[i] = s, this.values = this.applyConstraints(this.values, i, s), this.syncDom(), this.syncHiddenInputs(), e.preventDefault();
    },
    syncDom() {
      const e = this.values.map((s) => this.valueToPercent(s)), i = Math.min(...e), r = Math.max(...e);
      this.trackEl && (this.trackEl.dataset.orientation = this.orientation);
      const n = this.$refs.range;
      n && (n.dataset.orientation = this.orientation, this.orientation === "vertical" ? (n.style.bottom = `${i}%`, n.style.height = `${Math.max(r - i, 0)}%`, n.style.left = "0", n.style.right = "0", n.style.width = "100%") : (n.style.left = `${i}%`, n.style.width = `${Math.max(r - i, 0)}%`, n.style.top = "0", n.style.bottom = "0", n.style.height = "100%")), this.thumbEls.forEach((s) => {
        const a = this.parseThumbIndex(s), o = this.values[a] ?? this.min, l = this.valueToPercent(o);
        s.dataset.orientation = this.orientation, s.setAttribute("aria-valuenow", `${o}`), s.style.position = "absolute", this.orientation === "vertical" ? (s.style.left = "50%", s.style.bottom = `${l}%`, s.style.transform = "translate(-50%, 50%)") : (s.style.top = "50%", s.style.left = `${l}%`, s.style.transform = "translate(-50%, -50%)");
      });
    },
    syncHiddenInputs() {
      this.inputEls.forEach((e) => {
        const i = this.parseNumber(e.dataset.inputIndex, 0), r = this.values[i] ?? this.min;
        e.value = `${r}`;
      });
    },
    applyConstraints(e, i, r) {
      const n = e.length;
      if (n === 0)
        return [this.min];
      let s = e.map((o) => this.snapValue(o));
      s = s.map((o) => this.clampValue(o)), i >= 0 && i < n ? (s[i] = this.snapValue(r ?? s[i]), s[i] = this.clampValue(s[i])) : s = [...s].sort((o, l) => o - l);
      const a = this.minStepsBetweenThumbs;
      for (let o = 1; o < n; o += 1) {
        const l = s[o - 1] + a;
        s[o] < l && (s[o] = this.clampValue(this.snapValue(l)));
      }
      for (let o = n - 2; o >= 0; o -= 1) {
        const l = s[o + 1] - a;
        s[o] > l && (s[o] = this.clampValue(this.snapValue(l)));
      }
      return s;
    },
    snapValue(e) {
      const i = this.min + Math.round((e - this.min) / this.step) * this.step;
      return Number(i.toFixed(6));
    },
    getNearestThumbIndex(e) {
      if (this.values.length === 0)
        return -1;
      let i = 0, r = Number.MAX_VALUE;
      return this.values.forEach((n, s) => {
        const a = Math.abs(n - e);
        a < r && (r = a, i = s);
      }), i;
    },
    getPointerValue(e) {
      if (!this.trackEl)
        return this.min;
      const i = this.trackEl.getBoundingClientRect(), r = this.orientation === "vertical" ? i.height : i.width;
      if (r <= 0)
        return this.min;
      let n;
      this.orientation === "vertical" ? n = (i.bottom - e.clientY) / r : n = (e.clientX - i.left) / r, n = Math.min(Math.max(n, 0), 1), this.inverted && (n = 1 - n);
      const s = this.min + n * (this.max - this.min);
      return this.snapValue(this.clampValue(s));
    },
    valueToPercent(e) {
      const i = this.max - this.min;
      if (i <= 0)
        return 0;
      const r = (e - this.min) / i, n = this.inverted ? 1 - r : r;
      return Math.min(Math.max(n * 100, 0), 100);
    },
    clampValue(e) {
      return Math.min(Math.max(e, this.min), this.max);
    },
    focusThumb(e) {
      const i = this.$el.querySelector(`[data-thumb-index="${e}"]`);
      i && i.focus();
    },
    parseThumbIndex(e) {
      return e ? this.parseNumber(e.dataset.thumbIndex, -1) : -1;
    },
    parseBoolean(e, i) {
      return e === "true" ? !0 : e === "false" ? !1 : i;
    },
    parseNumber(e, i) {
      const r = Number(e);
      return Number.isFinite(r) ? r : i;
    },
    parseJson(e, i) {
      try {
        return JSON.parse(e || "null") ?? i;
      } catch {
        return i;
      }
    }
  }));
}
function hh(t) {
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
function dh(t) {
  t.data("rzShineBorder", () => ({
    computedStyle: "",
    init() {
      const e = this.$el.dataset, i = Math.max(this.parseNumber(e.borderWidth, 1), 0), r = this.parseNumber(e.duration, 14) > 0 ? this.parseNumber(e.duration, 14) : 14, n = typeof e.shineColor == "string" ? e.shineColor.trim() : "", s = this.parseJson(e.shineColors, []).filter((l) => typeof l == "string").map((l) => l.trim()).filter((l) => l.length > 0), a = [
        "var(--color-border)",
        "color-mix(in oklab, var(--color-border) 75%, transparent)"
      ], o = s.length > 0 ? s.join(",") : n.length > 0 ? n : a.join(",");
      this.computedStyle = [
        `--border-width:${i}px`,
        `--duration:${r}s`,
        `background-image:radial-gradient(transparent,transparent,${o},transparent,transparent)`,
        "background-size:300% 300%",
        "mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
        "-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
        "-webkit-mask-composite:xor",
        "mask-composite:exclude",
        "padding:var(--border-width)"
      ].join(";");
    },
    parseNumber(e, i) {
      const r = Number(e);
      return Number.isFinite(r) ? r : i;
    },
    parseJson(e, i) {
      if (typeof e != "string" || e.length === 0)
        return i;
      try {
        const r = JSON.parse(e);
        return Array.isArray(r) ? r : i;
      } catch {
        return i;
      }
    }
  }));
}
function fh(t) {
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
      this._observer = new MutationObserver(() => this.refreshTriggers()), this._observer.observe(this.$el, { childList: !0, subtree: !0 }), this.refreshTriggers(), e && this._triggers.some((i) => i.dataset.value === e) ? this.selectedTab = e : this._triggers.length > 0 && (this.selectedTab = this._triggers[0].dataset.value);
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
      const i = e.currentTarget?.dataset?.value;
      !i || e.currentTarget.getAttribute("aria-disabled") === "true" || (this.selectedTab = i, this.$dispatch("rz:tabs-change", { value: this.selectedTab }));
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
      const e = this.$el.dataset.value, i = this.isSelected(e), r = this.$el.getAttribute("aria-disabled") === "true";
      return {
        "aria-selected": String(i),
        tabindex: i ? "0" : "-1",
        "data-state": i ? "active" : "inactive",
        ...r && { disabled: !0 }
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
        const i = this._triggers.filter((l) => l.getAttribute("aria-disabled") !== "true");
        if (i.length === 0) return;
        const r = i.findIndex((l) => l.dataset.value === this.selectedTab);
        if (r === -1) return;
        const n = e.currentTarget?.getAttribute("aria-orientation") === "vertical", s = n ? "ArrowUp" : "ArrowLeft", a = n ? "ArrowDown" : "ArrowRight";
        let o = r;
        switch (e.key) {
          case s:
            o = r - 1 < 0 ? i.length - 1 : r - 1;
            break;
          case a:
            o = (r + 1) % i.length;
            break;
          case "Home":
            o = 0;
            break;
          case "End":
            o = i.length - 1;
            break;
        }
        if (o >= 0 && o < i.length) {
          const l = i[o];
          this.selectedTab = l.dataset.value, this.$nextTick(() => l.focus());
        }
      }
    }
  }));
}
function ph(t) {
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
function mh(t) {
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
        const i = this.getBooleanDataset("open", e), r = this.isControlledOpenState ? i : e;
        if (this.open = r, this.ariaExpanded = r.toString(), this.state = r ? "open" : "closed", this.triggerEl && (this.triggerEl.dataset.state = this.state), this.contentEl && (this.contentEl.dataset.state = this.state), r) {
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
    getBooleanDataset(e, i) {
      const r = this.$el.dataset[e];
      return typeof r > "u" ? i : r === "true";
    },
    /**
     * Executes the `getNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNumberDataset` when applicable.
     */
    getNumberDataset(e, i) {
      const r = Number(this.$el.dataset[e]);
      return Number.isFinite(r) ? r : i;
    },
    /**
     * Executes the `getNullableNumberDataset` operation.
     * @param {any} name Input value for this method.
     * @param {any} fallbackValue Input value for this method.
     * @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
     */
    getNullableNumberDataset(e, i) {
      const r = this.$el.dataset[e];
      if (typeof r > "u" || r === null || r === "") return i;
      const n = Number(r);
      return Number.isFinite(n) ? n : i;
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
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = ta(this.triggerEl, this.contentEl, () => {
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
        je({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && e.push(Ke()), this.enableShift && e.push(Ye({ padding: this.shiftPadding })), this.arrowEl && e.push(Hu({ element: this.arrowEl })), Je(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: e
      }).then(({ x: i, y: r, placement: n, middlewareData: s }) => {
        if (this.side = n.split("-")[0], this.contentEl.dataset.side = this.side, this.contentEl.style.position = this.strategy, this.contentEl.style.left = `${i}px`, this.contentEl.style.top = `${r}px`, !this.arrowEl || !s.arrow) return;
        const a = s.arrow.x, o = s.arrow.y, f = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        }[this.side] || "bottom";
        this.arrowEl.style.left = a != null ? `${a}px` : "", this.arrowEl.style.top = o != null ? `${o}px` : "", this.arrowEl.style.right = "", this.arrowEl.style.bottom = "", this.arrowEl.style[f] = "-5px";
      });
    }
  }));
}
function gh(t) {
  t.data("rzSidebar", () => ({
    open: !0,
    openMobile: !1,
    isMobile: !1,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    /**
     * Initializes the component, loading configuration from data attributes,
     * restoring persisted state from cookies, and setting up event listeners.
     */
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas", this.shortcut = this.$el.dataset.shortcut || "b", this.cookieName = this.$el.dataset.cookieName || "sidebar_state", this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const e = this.$el.dataset.defaultOpen === "true", i = this.cookieName ? document.cookie.split("; ").find((r) => r.startsWith(`${this.cookieName}=`))?.split("=")[1] : null;
      this.open = i != null ? i === "true" : e, this.checkIfMobile(), window.addEventListener("keydown", (r) => {
        (r.ctrlKey || r.metaKey) && r.key.toLowerCase() === this.shortcut.toLowerCase() && (r.preventDefault(), this.toggle());
      }), this.$watch("open", (r) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${r}; path=/; max-age=604800`);
      }), this.$watch("isMobile", () => {
        this.openMobile = !1;
      });
    },
    /**
     * Checks if the current viewport width is below the configured mobile breakpoint.
     */
    checkIfMobile() {
      this.isMobile = window.innerWidth < this.mobileBreakpoint;
    },
    /**
     * Toggles the sidebar's visibility depending on the current viewport mode.
     */
    toggle() {
      this.isMobile ? this.openMobile = !this.openMobile : this.open = !this.open;
    },
    /**
     * Explicitly sets the open state for the desktop sidebar.
     * @param {boolean} value 
     */
    setOpen(e) {
      this.open = e;
    },
    /**
     * Explicitly sets the open state for the mobile sidebar.
     * @param {boolean} value 
     */
    setOpenMobile(e) {
      this.openMobile = e;
    },
    /**
     * Closes the sidebar for both mobile and desktop states.
     */
    close() {
      this.isMobile && (this.openMobile = !1);
    },
    /**
     * Returns whether the mobile sidebar is currently open.
     * @returns {boolean}
     */
    isMobileOpen() {
      return this.openMobile;
    },
    /**
     * Gets the desktop state string representation for Tailwind data attributes.
     * @returns {string} "expanded" or "collapsed"
     */
    get desktopState() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Gets the current overall state string representation.
     * @returns {string} "expanded" or "collapsed"
     */
    get state() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Gets the mobile state string representation for Tailwind data attributes.
     * @returns {string} "open" or "closed"
     */
    get mobileState() {
      return this.openMobile ? "open" : "closed";
    },
    /**
     * Retrieves the collapsible attribute value when the sidebar is collapsed.
     * Used to toggle the CSS width configurations dynamically.
     * @returns {string}
     */
    getCollapsibleAttribute() {
      return this.state === "collapsed" ? this.collapsible : "";
    }
  }));
}
function vh(t) {
  t.data("rzCommand", () => ({
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
    hashString(e) {
      let i = 0;
      for (let r = 0; r < e.length; r++)
        i = (i << 5) - i + e.charCodeAt(r), i |= 0;
      return String(i >>> 0);
    },
    /**
     * Resolves a stable item identifier when an item is missing an id.
     * @param {object} item The command item.
     * @returns {string} A stable identifier for the item.
     */
    resolveStableItemId(e) {
      if (e?.id)
        return String(e.id);
      if (e?.value)
        return String(e.value);
      const i = e?.name || e?.label || JSON.stringify(e ?? {});
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
      const e = this.$el.dataset.itemsId;
      let i = [];
      if (e) {
        const n = document.getElementById(e);
        if (n)
          try {
            i = JSON.parse(n.textContent || "[]");
          } catch (s) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${e}`, s);
          }
      }
      i.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      const r = i.map((n) => ({
        ...n,
        id: this.resolveStableItemId(n),
        isDataItem: !0
      }));
      this.registerItems(r, { suppressFilter: !0 }), this.itemsUrl && this.fetchTrigger === "immediate" ? this.fetchItems() : this.filterAndSortItems(), this.$watch("search", (n) => {
        if (this.serverFiltering) {
          clearTimeout(this._debounceTimer), this._debounceTimer = setTimeout(() => {
            this.fetchItems(n);
          }, 300);
          return;
        }
        this.filterAndSortItems();
      }), this.$watch("selectedIndex", (n, s) => {
        if (s > -1) {
          const a = this.filteredItems[s];
          if (a) {
            const o = this.$el.querySelector(`[data-command-item-id="${a.id}"]`);
            o && (o.removeAttribute("data-selected"), o.setAttribute("aria-selected", "false"));
          }
        }
        if (n > -1 && this.filteredItems[n]) {
          const a = this.filteredItems[n];
          this.activeDescendantId = a.id;
          const o = this.$el.querySelector(`[data-command-item-id="${a.id}"]`);
          o && (o.setAttribute("data-selected", "true"), o.setAttribute("aria-selected", "true"), o.scrollIntoView({ block: "nearest" }));
          const l = a.value;
          this.selectedValue !== l && (this.selectedValue = l, this.$dispatch("rz:command:select", { value: l }));
        } else
          this.activeDescendantId = null, this.selectedValue = null;
      }), this.$watch("selectedValue", (n) => {
        const s = this.filteredItems.findIndex((a) => a.value === n);
        this.selectedIndex !== s && (this.selectedIndex = s);
      }), this.$watch("filteredItems", (n) => {
        this.isOpen = n.length > 0 || this.isLoading, this.isEmpty = n.length === 0, this._listInstance && this._listInstance.renderList();
      });
    },
    // --- METHODS ---
    /**
     * Stores the list renderer instance for cache-aware rendering.
     * @param {object} listInstance The command list Alpine instance.
     * @returns {void}
     */
    setListInstance(e) {
      this._listInstance = e, this._listInstance.renderList();
    },
    /**
     * Normalizes an item and enriches search metadata.
     * @param {object} item The command item to normalize.
     * @returns {object} The normalized item.
     */
    normalizeItem(e) {
      const i = e.name || "", r = Array.isArray(e.keywords) ? e.keywords : [];
      return {
        ...e,
        id: this.resolveStableItemId(e),
        keywords: r,
        _searchText: `${i} ${r.join(" ")}`.trim().toLowerCase(),
        _order: e._order ?? this.items.length
      };
    },
    /**
     * Registers multiple items while avoiding duplicates.
     * @param {Array<object>} items Items to register.
     * @param {{ suppressFilter?: boolean }} options Registration options.
     * @returns {void}
     */
    registerItems(e, i = {}) {
      const r = i.suppressFilter === !0;
      let n = 0;
      for (const s of e) {
        if (!s)
          continue;
        const a = this.resolveStableItemId(s);
        if (this.itemsById.has(a))
          continue;
        const o = this.normalizeItem(s);
        o._order = this.items.length, this.items.push(o), this.itemsById.set(o.id, o), n++;
      }
      n > 0 && this.selectedIndex === -1 && (this.selectedIndex = 0), !r && !this.serverFiltering && this.filterAndSortItems();
    },
    registerItem(e) {
      this.registerItems([e]);
    },
    /**
     * Unregisters an item by id.
     * @param {string} itemId The item identifier.
     * @returns {void}
     */
    unregisterItem(e) {
      this.itemsById.has(e) && (this.itemsById.delete(e), this.items = this.items.filter((i) => i.id !== e), this.filterAndSortItems());
    },
    /**
     * Registers a group heading template.
     * @param {string} name The group name.
     * @param {DocumentFragment} templateContent The template content.
     * @param {string} headingId The heading identifier.
     * @returns {void}
     */
    registerGroupTemplate(e, i, r) {
      !e || !i || this.groupTemplates.has(e) || this.groupTemplates.set(e, {
        headingId: r,
        templateContent: i
      });
    },
    /**
     * Rebuilds the map of filtered indexes by item id.
     * @returns {void}
     */
    updateFilteredIndexes() {
      const e = /* @__PURE__ */ new Map();
      for (let i = 0; i < this.filteredItems.length; i++)
        e.set(this.filteredItems[i].id, i);
      this.filteredIndexById = e;
    },
    /**
     * Computes a simple ranking score for fast filtering.
     * @param {string} searchText Normalized searchable text.
     * @param {string} searchTerm Normalized search term.
     * @returns {number} Ranking score.
     */
    fastScore(e, i) {
      if (!i)
        return 1;
      const r = e.indexOf(i);
      return r === -1 ? 0 : r === 0 ? 4 : e.includes(` ${i}`) ? 3 : 2;
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
      const e = (this.search || "").trim().toLowerCase(), r = e && this._lastSearch && e.startsWith(this._lastSearch) ? this._lastMatchedItems : this.items;
      let n = [];
      if (!this.shouldFilter || !e)
        n = this.items.slice();
      else {
        const o = [];
        for (const l of r) {
          if (l.forceMount)
            continue;
          const f = this.fastScore(l._searchText, e);
          f > 0 && o.push([l, f]);
        }
        o.sort((l, f) => f[1] !== l[1] ? f[1] - l[1] : (l[0]._order || 0) - (f[0]._order || 0)), n = o.map(([l]) => l);
      }
      const s = this.items.filter((o) => o.forceMount), a = [...n, ...s];
      if (this._lastSearch = e, this._lastMatchedItems = a, this.filteredItems = a.slice(0, this.maxRender), this.updateFilteredIndexes(), this.selectedValue) {
        const o = this.filteredItems.findIndex((l) => l.value === this.selectedValue);
        this.selectedIndex = o > -1 ? o : this.filteredItems.length > 0 ? 0 : -1;
      } else
        this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
    },
    /**
     * Fetches remote items and registers them.
     * @param {string} [query=''] Query string used for server filtering.
     * @returns {Promise<void>}
     */
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
          const r = await fetch(i);
          if (!r.ok)
            throw new Error(`Network response was not ok: ${r.statusText}`);
          const n = await r.json();
          this.serverFiltering && (this.items = this.items.filter((a) => !a.isDataItem), this.itemsById = new Map(this.items.map((a) => [a.id, a])));
          const s = n.map((a) => ({
            ...a,
            id: this.resolveStableItemId(a),
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
    handleItemClick(e) {
      const i = e.target.closest("[data-command-item-id]");
      if (!i) return;
      const r = i.dataset.commandItemId, n = this.filteredIndexById.get(r) ?? -1;
      if (n > -1) {
        const s = this.filteredItems[n];
        s && !s.disabled && (this.selectedIndex = n, this.$dispatch("rz:command:execute", { value: s.value }));
      }
    },
    /**
     * Handles hover-based selection changes.
     * @param {MouseEvent} event The mouse event.
     * @returns {void}
     */
    handleItemHover(e) {
      const i = e.target.closest("[data-command-item-id]");
      if (!i) return;
      const r = i.dataset.commandItemId, n = this.filteredIndexById.get(r) ?? -1;
      if (n > -1) {
        const s = this.filteredItems[n];
        s && !s.disabled && this.selectedIndex !== n && (this.selectedIndex = n);
      }
    },
    // --- KEYBOARD NAVIGATION ---
    /**
     * Handles keyboard navigation and execute behavior.
     * @param {KeyboardEvent} e The keyboard event.
     * @returns {void}
     */
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
        case "Enter": {
          e.preventDefault();
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
      let e = this.selectedIndex, i = 0;
      do {
        if (e = e + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : e + 1, i++, !this.filteredItems[e]?.disabled) {
          this.selectedIndex = e;
          return;
        }
        if (!this.loop && e === this.filteredItems.length - 1) return;
      } while (i <= this.filteredItems.length);
    },
    /**
     * Selects the previous enabled item.
     * @returns {void}
     */
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
    /**
     * Selects the first enabled item.
     * @returns {void}
     */
    selectFirst() {
      if (this.filteredItems.length > 0) {
        const e = this.filteredItems.findIndex((i) => !i.disabled);
        e > -1 && (this.selectedIndex = e);
      }
    },
    /**
     * Selects the last enabled item.
     * @returns {void}
     */
    selectLast() {
      if (this.filteredItems.length > 0) {
        const e = this.filteredItems.map((i) => i.disabled).lastIndexOf(!1);
        e > -1 && (this.selectedIndex = e);
      }
    }
  }));
}
function yh(t) {
  t.data("rzCommandItem", () => ({
    parent: null,
    itemData: {},
    /**
     * Computes a deterministic hash for fallback item ids.
     * @param {string} value The value to hash.
     * @returns {string} A hash string.
     */
    hashString(e) {
      let i = 0;
      for (let r = 0; r < e.length; r++)
        i = (i << 5) - i + e.charCodeAt(r), i |= 0;
      return String(i >>> 0);
    },
    /**
     * Resolves a stable identifier for the item.
     * @param {string} value The item value.
     * @param {string} name The item display name.
     * @returns {string} The stable identifier.
     */
    resolveItemId(e, i) {
      return this.$el.id ? this.$el.id : e || `item-${this.hashString(i || this.$el.textContent.trim())}`;
    },
    /**
     * Initializes the item and registers it with the parent command instance.
     * @returns {void}
     */
    init() {
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandItem must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e);
      const i = this.$el.querySelector("template"), r = i?.content ? i.content.cloneNode(!0) : null, n = this.$el.dataset.value || this.$el.textContent.trim(), s = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
      this.itemData = {
        id: this.resolveItemId(n, s),
        value: n,
        name: s,
        keywords: JSON.parse(this.$el.dataset.keywords || "[]"),
        group: this.$el.dataset.group || null,
        templateContent: r,
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
function bh(t) {
  t.data("rzCommandList", () => ({
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
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandList must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e), this.parent.dataItemTemplateId && (this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId));
      const i = this.$el.querySelector('[data-slot="command-separator"]');
      i && (this.separatorTemplate = i.cloneNode(!0), this.separatorTemplate.removeAttribute("id"), this.separatorTemplate.removeAttribute("x-data"), this.separatorTemplate.removeAttribute("data-alpine-root")), this.$el.querySelectorAll('[data-slot="command-separator"]').forEach((r) => {
        r.remove();
      }), this.showLoading = this.parent?.isLoading === !0, this.$watch("parent.isLoading", (r) => {
        this.showLoading = r === !0;
      }), this.parent.setListInstance(this);
    },
    /**
     * Returns a cached row for an item, creating one from a template when needed.
     * @param {object} item The command item.
     * @returns {Element|null} The row element or null when unavailable.
     */
    ensureRow(e) {
      if (this.rowCache.has(e.id))
        return this.rowCache.get(e.id);
      let i = null;
      if (e.isDataItem) {
        if (!this.dataItemTemplate || !this.dataItemTemplate.content)
          return null;
        i = this.dataItemTemplate.content.cloneNode(!0).firstElementChild, i && (t.addScopeToNode(i, { item: e }), t.initTree(i));
      } else e.templateContent && (i = e.templateContent.cloneNode(!0).firstElementChild);
      return i ? (this.rowCache.set(e.id, i), i) : null;
    },
    /**
     * Applies ARIA/data attributes to a rendered row.
     * @param {Element} itemEl The row element.
     * @param {object} item The command item.
     * @param {number} itemIndex The filtered index of the item.
     * @returns {void}
     */
    applyItemAttributes(e, i, r) {
      e.setAttribute("data-command-item-id", i.id), e.setAttribute("data-value", i.value || ""), i.keywords && e.setAttribute("data-keywords", JSON.stringify(i.keywords)), i.group && e.setAttribute("data-group", i.group), i.disabled ? (e.setAttribute("data-disabled", "true"), e.setAttribute("aria-disabled", "true")) : (e.removeAttribute("data-disabled"), e.removeAttribute("aria-disabled")), i.forceMount && e.setAttribute("data-force-mount", "true"), e.setAttribute("role", "option"), e.setAttribute("aria-selected", this.parent.selectedIndex === r ? "true" : "false"), this.parent.selectedIndex === r ? e.setAttribute("data-selected", "true") : e.removeAttribute("data-selected");
    },
    /**
     * Renders grouped command rows using cached row elements.
     * @returns {void}
     */
    renderList() {
      const e = this.parent.filteredItems || [], i = this.parent.groupTemplates || /* @__PURE__ */ new Map(), r = this.$el, n = document.createDocumentFragment(), s = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      for (const f of e) {
        const m = f.group || "__ungrouped__";
        s.has(m) || s.set(m, []), s.get(m).push(f);
      }
      const a = Array.from(s.entries()).filter(([, f]) => f.length > 0), o = a.filter(([f]) => f !== "__ungrouped__").length;
      let l = 0;
      a.forEach(([f, m]) => {
        const w = f !== "__ungrouped__";
        if (w && this.separatorTemplate && o > 1 && l > 0) {
          const b = this.separatorTemplate.cloneNode(!0);
          b.setAttribute("data-dynamic-item", "true"), n.appendChild(b);
        }
        const T = document.createElement("div");
        if (T.setAttribute("role", "group"), T.setAttribute("data-dynamic-item", "true"), T.setAttribute("data-slot", "command-group"), w) {
          const b = i.get(f);
          if (b?.templateContent) {
            const u = b.templateContent.cloneNode(!0);
            b.headingId && T.setAttribute("aria-labelledby", b.headingId), T.appendChild(u);
          }
        }
        m.forEach((b, u) => {
          const h = this.parent.filteredIndexById.get(b.id) ?? u, c = this.ensureRow(b);
          c && (this.applyItemAttributes(c, b, h), T.appendChild(c));
        }), n.appendChild(T), w && (l += 1);
      }), r.querySelectorAll("[data-dynamic-item]").forEach((f) => f.remove()), r.appendChild(n), window.htmx && window.htmx.process(r);
    }
  }));
}
function wh(t) {
  t.data("rzCommandGroup", () => ({
    parent: null,
    heading: "",
    headingId: "",
    /**
     * Initializes the group and registers its heading template with the parent command.
     * @returns {void}
     */
    init() {
      const e = this.$el.closest('[x-data="rzCommand"]');
      if (!e) {
        console.error("CommandGroup must be a child of RzCommand.");
        return;
      }
      this.parent = t.$data(e), this.heading = this.$el.dataset.heading;
      const i = this.$el.querySelector("template"), r = i?.dataset.headingId || "", n = i?.content ? i.content.cloneNode(!0) : null;
      this.heading && n && this.parent.registerGroupTemplate(this.heading, n, r);
    }
  }));
}
function xh(t, e) {
  t.data("rzChart", () => ({
    chartInstance: null,
    themeChangeHandler: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), r = this.$el.dataset.nonce || "", n = this.$el.dataset.configId;
      if (i.length > 0 && typeof e == "function") {
        e(i, {
          success: () => this.tryInitializeChart(n),
          error: (s) => console.error("[rzChart] Failed to load Chart.js assets.", s)
        }, r);
        return;
      }
      this.tryInitializeChart(n);
    },
    tryInitializeChart(i) {
      if (!window.Chart) {
        console.error("[rzChart] Chart.js was not found on window.");
        return;
      }
      const r = document.getElementById(i);
      if (!r) {
        console.error(`[rzChart] Could not find configuration script with ID: ${i}`);
        return;
      }
      let n = {};
      try {
        n = JSON.parse(r.textContent || "{}");
      } catch (a) {
        console.error("[rzChart] Failed to parse JSON configuration.", a);
        return;
      }
      this.resolveColorValues(n), this.resolveCallbacks(n), n.options && (n.options.responsive = n.options.responsive ?? !0, n.options.maintainAspectRatio = n.options.maintainAspectRatio ?? !1);
      const s = this.$refs.canvas;
      if (!s) {
        console.error("[rzChart] Canvas reference was not found.");
        return;
      }
      this.chartInstance = new window.Chart(s, n), this.themeChangeHandler = () => {
        this.chartInstance && this.chartInstance.update();
      }, window.addEventListener("rz:theme-change", this.themeChangeHandler);
    },
    resolveColorValues(i) {
      const r = (n) => {
        if (Array.isArray(n))
          return n.map((s) => r(s));
        if (!n || typeof n != "object")
          return n;
        for (const s of Object.keys(n)) {
          const a = n[s];
          if (typeof s == "string" && s.toLowerCase().includes("color")) {
            if (Array.isArray(a)) {
              n[s] = a.map((o) => this._resolveColor(o));
              continue;
            }
            if (a && typeof a == "object") {
              r(a);
              continue;
            }
            n[s] = this._resolveColor(a);
            continue;
          }
          a && typeof a == "object" && r(a);
        }
        return n;
      };
      r(i);
    },
    _resolveColor(i, r = document.documentElement) {
      if (typeof i != "string")
        return i;
      const n = i.trim();
      if (!n.startsWith("var("))
        return n;
      const s = n.slice(4, -1).trim(), [a, o] = s.split(",").map((f) => f.trim());
      return a && (getComputedStyle(r).getPropertyValue(a).trim() || o) || n;
    },
    resolveCallbacks(i) {
      if (!i || !i.options)
        return;
      const r = (n) => {
        if (typeof n != "string")
          return n;
        const s = n.replace("window.", "").split(".");
        let a = window;
        for (const o of s) {
          if (a[o] === void 0)
            return n;
          a = a[o];
        }
        return typeof a == "function" ? a : n;
      };
      if (i.options.plugins?.tooltip?.callbacks) {
        const n = i.options.plugins.tooltip.callbacks;
        for (const s of Object.keys(n))
          n[s] = r(n[s]);
      }
      if (i.options.scales)
        for (const n of Object.keys(i.options.scales)) {
          const s = i.options.scales[n];
          s.ticks && s.ticks.callback && (s.ticks.callback = r(s.ticks.callback));
        }
    },
    destroy() {
      this.themeChangeHandler && (window.removeEventListener("rz:theme-change", this.themeChangeHandler), this.themeChangeHandler = null), this.chartInstance && (this.chartInstance.destroy(), this.chartInstance = null);
    }
  }));
}
function Ih(t) {
  t.data("rzTypingAnimation", () => ({
    config: null,
    words: [],
    segmentedWords: [],
    displayText: "",
    currentWordIndex: 0,
    currentCharIndex: 0,
    phase: "typing",
    started: !1,
    completed: !1,
    cursorVisible: !1,
    cursorChar: "|",
    cursorBlinkClass: "",
    timerId: null,
    observer: null,
    supportsIntersectionObserver: typeof window < "u" && typeof window.IntersectionObserver < "u",
    init() {
      if (this.readConfig(), this.resolveWords(), this.updateCursorState(), this.words.length === 0) {
        this.complete();
        return;
      }
      this.observeIfNeeded();
    },
    readConfig() {
      try {
        const e = this.$el.dataset.config || "{}", i = JSON.parse(e), r = this.clampPositive(i.typeSpeed ?? i.duration ?? 100), n = this.clampPositive(i.deleteSpeed ?? Math.max(Math.floor(r / 2), 1));
        this.config = {
          words: Array.isArray(i.words) ? i.words : null,
          duration: this.clampPositive(i.duration ?? 100),
          typeSpeed: r,
          deleteSpeed: n,
          delay: this.clampZeroOrGreater(i.delay ?? 0),
          pauseDelay: this.clampZeroOrGreater(i.pauseDelay ?? 1e3),
          loop: !!i.loop,
          startOnView: i.startOnView !== !1,
          showCursor: i.showCursor !== !1,
          blinkCursor: i.blinkCursor !== !1,
          cursorStyle: i.cursorStyle || "line"
        };
      } catch {
        this.config = {
          words: null,
          duration: 100,
          typeSpeed: 100,
          deleteSpeed: 50,
          delay: 0,
          pauseDelay: 1e3,
          loop: !1,
          startOnView: !0,
          showCursor: !0,
          blinkCursor: !0,
          cursorStyle: "line"
        };
      }
      this.cursorChar = this.getCursorChar(this.config.cursorStyle), this.cursorBlinkClass = this.config.blinkCursor ? "animate-blink-cursor" : "";
    },
    resolveWords() {
      const e = Array.isArray(this.config.words) ? this.config.words.filter((i) => typeof i == "string") : [];
      if (e.length > 0)
        this.words = e;
      else if (this.$refs.source) {
        const i = (this.$refs.source.textContent || "").trim();
        this.words = i ? [i] : [];
      } else
        this.words = [];
      this.segmentedWords = this.words.map((i) => this.segmentText(i));
    },
    observeIfNeeded() {
      if (!this.config.startOnView || !this.supportsIntersectionObserver) {
        this.start();
        return;
      }
      this.observer = new IntersectionObserver((e) => {
        const i = e[0];
        !i || !i.isIntersecting || (this.start(), this.observer && (this.observer.disconnect(), this.observer = null));
      }, { threshold: 0.3 }), this.observer.observe(this.$el);
    },
    start() {
      this.started || (this.started = !0, this.updateCursorState(), this.scheduleTick(this.config.delay));
    },
    scheduleTick(e) {
      this.clearTimer(), this.timerId = window.setTimeout(() => {
        this.tick();
      }, e);
    },
    tick() {
      if (this.completed || this.words.length === 0) {
        this.complete();
        return;
      }
      if (this.phase === "typing") {
        this.typeNextCharacter();
        return;
      }
      if (this.phase === "pause") {
        this.pauseBeforeDelete();
        return;
      }
      this.deletePreviousCharacter();
    },
    typeNextCharacter() {
      const e = this.segmentedWords[this.currentWordIndex] || [], i = this.words.length > 1;
      if (this.currentCharIndex < e.length) {
        this.currentCharIndex += 1, this.displayText = e.slice(0, this.currentCharIndex).join(""), this.updateCursorState(), this.scheduleTick(this.config.typeSpeed);
        return;
      }
      const r = this.currentWordIndex === this.words.length - 1;
      if (!this.config.loop && r) {
        this.complete();
        return;
      }
      (i || this.config.loop) && (this.phase = "pause", this.scheduleTick(this.config.pauseDelay));
    },
    pauseBeforeDelete() {
      this.phase = "deleting", this.scheduleTick(this.config.deleteSpeed);
    },
    deletePreviousCharacter() {
      const e = this.segmentedWords[this.currentWordIndex] || [];
      if (this.currentCharIndex > 0) {
        this.currentCharIndex -= 1, this.displayText = e.slice(0, this.currentCharIndex).join(""), this.updateCursorState(), this.scheduleTick(this.config.deleteSpeed);
        return;
      }
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length, this.phase = "typing", this.scheduleTick(this.config.typeSpeed);
    },
    complete() {
      this.completed = !0, this.clearTimer(), this.updateCursorState();
    },
    updateCursorState() {
      this.cursorVisible = !!this.config?.showCursor && !this.completed && this.words.length > 0;
    },
    segmentText(e) {
      if (typeof Intl < "u" && Intl.Segmenter) {
        const i = new Intl.Segmenter(void 0, { granularity: "grapheme" });
        return Array.from(i.segment(e), (r) => r.segment);
      }
      return Array.from(e);
    },
    clampPositive(e) {
      const i = Number(e);
      return Number.isFinite(i) ? Math.max(Math.round(i), 1) : 1;
    },
    clampZeroOrGreater(e) {
      const i = Number(e);
      return Number.isFinite(i) ? Math.max(Math.round(i), 0) : 0;
    },
    getCursorChar(e) {
      return e === "block" ? "▌" : e === "underscore" ? "_" : "|";
    },
    clearTimer() {
      this.timerId !== null && (window.clearTimeout(this.timerId), this.timerId = null);
    },
    destroy() {
      this.clearTimer(), this.observer && (this.observer.disconnect(), this.observer = null);
    }
  }));
}
async function Eh(t) {
  t = [...t].sort();
  const e = t.join("|"), r = new TextEncoder().encode(e), n = await crypto.subtle.digest("SHA-256", r);
  return Array.from(new Uint8Array(n)).map((a) => a.toString(16).padStart(2, "0")).join("");
}
function ae(t, e, i) {
  let r, n;
  typeof e == "function" ? r = { success: e } : e && typeof e == "object" ? r = e : typeof e == "string" && (n = e), !n && typeof i == "string" && (n = i);
  const s = Array.isArray(t) ? t : [t];
  return Eh(s).then((a) => (_e.isDefined(a) || _e(s, a, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: n,
    inlineStyleNonce: n
  }), new Promise((o, l) => {
    _e.ready(a, {
      success: () => {
        try {
          r && typeof r.success == "function" && r.success();
        } catch (f) {
          console.error("[rizzyRequire] success callback threw:", f);
        }
        o({ bundleId: a });
      },
      error: (f) => {
        try {
          r && typeof r.error == "function" && r.error(f);
        } catch (m) {
          console.error("[rizzyRequire] error callback threw:", m);
        }
        l(
          new Error(
            `[rizzyRequire] Failed to load bundle ${a} (missing: ${Array.isArray(f) ? f.join(", ") : String(f)})`
          )
        );
      }
    });
  })));
}
function Th(t) {
  Dc(t), Pc(t), Lc(t), Fc(t), Rc(t), zc(t, ae), Vc(t), Uc(t, ae), Bc(t, ae), Hc(t), Wc(t), qc(t), jc(t, ae), Jc(t, ae), Gc(t, ae), Xc(t), Zc(t, ae), Qc(t), Wu(t), qu(t), ju(t), Yu(t), Ku(t), Ju(t), Gu(t), Xu(t, ae), Zu(t), Qu(t), eh(t), th(t, ae), ih(t), rh(t), nh(t), sh(t), ah(t), oh(t), lh(t), ch(t), uh(t), hh(t), dh(t), fh(t), ph(t), mh(t), gh(t), vh(t), yh(t), bh(t), wh(t), xh(t, ae), Ih(t);
}
function _h(t) {
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
  } catch (r) {
    return console.error(`[Rizzy.props] Failed to parse JSON from script tag #${e}.`, r), {};
  }
}
const Vt = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map();
let on = !1;
function Sh(t) {
  return Ut.has(t) || Ut.set(
    t,
    import(t).catch((e) => {
      throw Ut.delete(t), e;
    })
  ), Ut.get(t);
}
function ln(t, e) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    t,
    () => Sh(e).catch((r) => (console.error(
      `[RizzyUI] Failed to load Alpine module '${t}' from '${e}'.`,
      r
    ), () => ({
      _error: !0,
      _errorMessage: `Module '${t}' failed to load.`
    })))
  ), !0) : (console.error(
    `[RizzyUI] Could not register async component '${t}'. AsyncAlpine not available.`
  ), !1);
}
function Ch(t, e) {
  if (!t || !e) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = Vt.get(t);
  i && i.path !== e && console.warn(
    `[RizzyUI] Re-registering '${t}' with a different path.
  Previous: ${i.path}
  New:      ${e}`
  );
  const r = globalThis.Alpine;
  if (r && r.version) {
    const n = !i || i.path !== e;
    if (!(i && i.loaderSet && !n)) {
      const a = ln(t, e);
      Vt.set(t, { path: e, loaderSet: a });
    }
    return;
  }
  Vt.set(t, { path: e, loaderSet: !1 }), on || (on = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [n, s] of Vt)
        if (!s.loaderSet) {
          const a = ln(n, s.path);
          s.loaderSet = a;
        }
    },
    { once: !0 }
  ));
}
function Ah(t) {
  t.directive("mobile", (e, { modifiers: i, expression: r }, { cleanup: n }) => {
    const s = i.find((d) => d.startsWith("bp-")), a = s ? parseInt(s.slice(3), 10) : 768, o = !!(r && r.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      e.dataset.mobile = "false", e.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < a, f = (d) => {
      e.dataset.mobile = d ? "true" : "false", e.dataset.screen = d ? "mobile" : "desktop";
    }, m = () => typeof t.$data == "function" ? t.$data(e) : e.__x ? e.__x.$data : null, w = (d) => {
      if (!o) return;
      const p = m();
      p && (p[r] = d);
    }, T = (d) => {
      e.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: d, width: window.innerWidth, breakpoint: a }
        })
      );
    }, b = window.matchMedia(`(max-width: ${a - 1}px)`), u = () => {
      const d = l();
      f(d), w(d), T(d);
    };
    u();
    const h = () => u(), c = () => u();
    b.addEventListener("change", h), window.addEventListener("resize", c, { passive: !0 }), n(() => {
      b.removeEventListener("change", h), window.removeEventListener("resize", c);
    });
  });
}
function $h(t) {
  const e = (i, { expression: r, modifiers: n }, { cleanup: s, effect: a }) => {
    if (!r || typeof r != "string") return;
    const o = (h, c, d) => {
      const y = c.replace(/\[(\d+)\]/g, ".$1").split("."), x = y.pop();
      let _ = h;
      for (const g of y)
        (_[g] == null || typeof _[g] != "object") && (_[g] = isFinite(+g) ? [] : {}), _ = _[g];
      _[x] = d;
    }, l = t.closestDataStack(i) || [], f = l[0] || null, m = l[1] || null;
    if (!f || !m) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const w = r.split(",").map((h) => h.trim()).filter(Boolean).map((h) => {
      const c = h.split("->").map((d) => d.trim());
      return c.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', h), null) : { parentPath: c[0], childPath: c[1] };
    }).filter(Boolean), T = n.includes("init-child") || n.includes("child") || n.includes("childWins"), b = w.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: T
      // avoid redundant first child->parent write
    })), u = [];
    w.forEach((h, c) => {
      const d = b[c];
      if (T) {
        const x = t.evaluate(i, h.childPath, { scope: f });
        d.fromChild = !0, o(m, h.parentPath, x), queueMicrotask(() => {
          d.fromChild = !1;
        });
      } else {
        const x = t.evaluate(i, h.parentPath, { scope: m });
        d.fromParent = !0, o(f, h.childPath, x), queueMicrotask(() => {
          d.fromParent = !1;
        });
      }
      const p = a(() => {
        const x = t.evaluate(i, h.parentPath, { scope: m });
        d.fromChild || (d.fromParent = !0, o(f, h.childPath, x), queueMicrotask(() => {
          d.fromParent = !1;
        }));
      }), y = a(() => {
        const x = t.evaluate(i, h.childPath, { scope: f });
        if (!d.fromParent) {
          if (d.skipChildOnce) {
            d.skipChildOnce = !1;
            return;
          }
          d.fromChild = !0, o(m, h.parentPath, x), queueMicrotask(() => {
            d.fromChild = !1;
          });
        }
      });
      u.push(p, y);
    }), s(() => {
      for (const h of u)
        try {
          h && h();
        } catch {
        }
    });
  };
  t.directive("syncprop", e);
}
class Oh {
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
      const r = this._normalizeMode(i.newValue ?? "auto");
      r !== this._mode && (this._mode = r, this._sync());
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
    const e = this.effectiveDark, i = this._mode, r = this.prefersDark, n = typeof document < "u" ? document.documentElement : null, s = n ? n.classList.contains(this.darkClass) === e && n.style.colorScheme === (e ? "dark" : "light") : !0;
    this._lastSnapshot.mode === i && this._lastSnapshot.effectiveDark === e && this._lastSnapshot.prefersDark === r && s || (this._lastSnapshot = { mode: i, effectiveDark: e, prefersDark: r }, n && (n.classList.toggle(this.darkClass, e), n.style.colorScheme = e ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(this.eventName, {
        detail: {
          mode: i,
          darkMode: e,
          // External API uses 'darkMode' convention
          prefersDark: r,
          source: "RizzyUI"
        }
      })
    ));
  }
}
const re = new Oh();
function kh(t) {
  re.init(), t.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: re.mode,
    _prefersDark: re.prefersDark,
    _effectiveDark: re.effectiveDark,
    // Listener reference to prevent duplicate registration
    _onThemeChange: null,
    init() {
      this._onThemeChange || (this._onThemeChange = () => this._refresh(), window.addEventListener(re.eventName, this._onThemeChange)), this._refresh();
    },
    _refresh() {
      this._mode = re.mode, this._prefersDark = re.prefersDark, this._effectiveDark = re.effectiveDark;
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
      re.setLight();
    },
    setDark() {
      re.setDark();
    },
    setAuto() {
      re.setAuto();
    },
    toggle() {
      re.toggle();
    }
  });
}
let vt = null;
function Mh(t) {
  if (vt) return vt;
  t.plugin(Ml), t.plugin(Fl), t.plugin(nc), t.plugin(fc), typeof document < "u" && document.addEventListener("alpine:init", () => {
    kh(t);
  }), Th(t), Ah(t), $h(t);
  const e = new mc.ValidationService();
  return e.bootstrap({ watch: !0 }), vt = {
    Alpine: t,
    require: ae,
    toast: Ac,
    validation: e,
    $data: Mc,
    props: _h,
    registerAsyncComponent: Ch,
    theme: re
  }, typeof window < "u" && (re.init(), window.Alpine = t, window.Rizzy = { ...window.Rizzy || {}, ...vt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), vt;
}
const Nh = Mh(Ss);
Ss.start();
export {
  Nh as default
};
