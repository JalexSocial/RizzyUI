var Ue = !1, Ye = !1, dt = [], Ke = -1, mi = !1;
function br(e) {
  wr(e);
}
function yr() {
  mi = !0;
}
function vr() {
  mi = !1, $n();
}
function wr(e) {
  dt.includes(e) || dt.push(e), $n();
}
function xr(e) {
  let t = dt.indexOf(e);
  t !== -1 && t > Ke && dt.splice(t, 1);
}
function $n() {
  if (!Ye && !Ue) {
    if (mi)
      return;
    Ue = !0, queueMicrotask(_r);
  }
}
function _r() {
  Ue = !1, Ye = !0;
  for (let e = 0; e < dt.length; e++)
    dt[e](), Ke = e;
  dt.length = 0, Ke = -1, Ye = !1;
}
var Lt, Ct, Mt, An, Je = !0;
function Ir(e) {
  Je = !1, e(), Je = !0;
}
function Sr(e) {
  Lt = e.reactive, Mt = e.release, Ct = (t) => e.effect(t, { scheduler: (i) => {
    Je ? br(i) : i();
  } }), An = e.raw;
}
function Wi(e) {
  Ct = e;
}
function Er(e) {
  let t = () => {
  };
  return [(n) => {
    let s = Ct(n);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((r) => r());
    }), e._x_effects.add(s), t = () => {
      s !== void 0 && (e._x_effects.delete(s), Mt(s));
    }, s;
  }, () => {
    t();
  }];
}
function On(e, t) {
  let i = !0, n, s = Ct(() => {
    let r = e();
    if (JSON.stringify(r), !i && (typeof r == "object" || r !== n)) {
      let o = n;
      queueMicrotask(() => {
        t(r, o);
      });
    }
    n = r, i = !1;
  });
  return () => Mt(s);
}
async function Tr(e) {
  yr();
  try {
    await e(), await Promise.resolve();
  } finally {
    vr();
  }
}
var kn = [], Dn = [], Nn = [];
function Cr(e) {
  Nn.push(e);
}
function gi(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Dn.push(t));
}
function Ln(e) {
  kn.push(e);
}
function Mn(e, t, i) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(i);
}
function Rn(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([i, n]) => {
    (t === void 0 || t.includes(i)) && (n.forEach((s) => s()), delete e._x_attributeCleanups[i]);
  });
}
function $r(e) {
  for (e._x_effects?.forEach(xr); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var bi = new MutationObserver(xi), yi = !1;
function vi() {
  bi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), yi = !0;
}
function Pn() {
  Ar(), bi.disconnect(), yi = !1;
}
var Bt = [];
function Ar() {
  let e = bi.takeRecords();
  Bt.push(() => e.length > 0 && xi(e));
  let t = Bt.length;
  queueMicrotask(() => {
    if (Bt.length === t)
      for (; Bt.length > 0; )
        Bt.shift()();
  });
}
function k(e) {
  if (!yi)
    return e();
  Pn();
  let t = e();
  return vi(), t;
}
var wi = !1, we = [];
function Or() {
  wi = !0;
}
function kr() {
  wi = !1, xi(we), we = [];
}
function xi(e) {
  if (wi) {
    we = we.concat(e);
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
    Rn(o, r);
  }), n.forEach((r, o) => {
    kn.forEach((a) => a(o, r));
  });
  for (let r of i)
    t.some((o) => o.contains(r)) || Dn.forEach((o) => o(r));
  for (let r of t)
    r.isConnected && Nn.forEach((o) => o(r));
  t = null, i = null, n = null, s = null;
}
function Fn(e) {
  return bt(gt(e));
}
function ne(e, t, i) {
  return e._x_dataStack = [t, ...gt(i || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
  };
}
function gt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? gt(e.host) : e.parentNode ? gt(e.parentNode) : [];
}
function bt(e) {
  return new Proxy({ objects: e }, Dr);
}
var Dr = {
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
    return t == "toJSON" ? Nr : Reflect.get(
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
function Nr() {
  return Reflect.ownKeys(this).reduce((t, i) => (t[i] = Reflect.get(this, i), t), {});
}
function _i(e) {
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
function zn(e, t = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, s, r) {
      return e(this.initialValue, () => Lr(n, s), (o) => Xe(n, s, o), s, r);
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
function Lr(e, t) {
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
var Bn = {};
function U(e, t) {
  Bn[e] = t;
}
function Gt(e, t) {
  let i = Mr(t);
  return Object.entries(Bn).forEach(([n, s]) => {
    Object.defineProperty(e, `$${n}`, {
      get() {
        return s(t, i);
      },
      enumerable: !1
    });
  }), e;
}
function Mr(e) {
  let [t, i] = Kn(e), n = { interceptor: zn, ...t };
  return gi(e, i), n;
}
function Rr(e, t, i, ...n) {
  try {
    return i(...n);
  } catch (s) {
    Zt(s, e, t);
  }
}
function Zt(...e) {
  return Vn(...e);
}
var Vn = Fr;
function Pr(e) {
  Vn = e;
}
function Fr(e, t, i = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: i }
  ), console.warn(`Alpine Expression Error: ${e.message}

${i ? 'Expression: "' + i + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var At = !0;
function Hn(e) {
  let t = At;
  At = !1;
  let i = e();
  return At = t, i;
}
function ht(e, t, i = {}) {
  let n;
  return P(e, t)((s) => n = s, i), n;
}
function P(...e) {
  return Wn(...e);
}
var Wn = qn;
function zr(e) {
  Wn = e;
}
var jn;
function Br(e) {
  jn = e;
}
function qn(e, t) {
  let i = {};
  Gt(i, e);
  let n = [i, ...gt(e)], s = typeof t == "function" ? Vr(n, t) : Wr(n, t, e);
  return Rr.bind(null, e, t, s);
}
function Vr(e, t) {
  return (i = () => {
  }, { scope: n = {}, params: s = [], context: r } = {}) => {
    if (!At) {
      Qt(i, t, bt([n, ...e]), s);
      return;
    }
    let o = t.apply(bt([n, ...e]), s);
    Qt(i, o);
  };
}
var Be = {};
function Hr(e, t) {
  if (Be[e])
    return Be[e];
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
  return Be[e] = r, r;
}
function Wr(e, t, i) {
  let n = Hr(t, i);
  return (s = () => {
  }, { scope: r = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = bt([r, ...e]);
    if (typeof n == "function") {
      let c = n.call(a, n, l).catch((u) => Zt(u, i, t));
      n.finished ? (Qt(s, n.result, l, o, i), n.result = void 0) : c.then((u) => {
        Qt(s, u, l, o, i);
      }).catch((u) => Zt(u, i, t)).finally(() => n.result = void 0);
    }
  };
}
function Qt(e, t, i, n, s) {
  if (At && typeof t == "function") {
    let r = t.apply(i, n);
    r instanceof Promise ? r.then((o) => Qt(e, o, i, n)).catch((o) => Zt(o, s, t)) : e(r);
  } else typeof t == "object" && t instanceof Promise ? t.then((r) => e(r)) : e(t);
}
function jr(...e) {
  return jn(...e);
}
function qr(e, t, i = {}) {
  let n = {};
  Gt(n, e);
  let s = [n, ...gt(e)], r = bt([i.scope ?? {}, ...s]), o = i.params ?? [];
  if (t.includes("await")) {
    let a = Object.getPrototypeOf(async function() {
    }).constructor, l = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t;
    return new a(
      ["scope"],
      `with (scope) { let __result = ${l}; return __result }`
    ).call(i.context, r);
  } else {
    let a = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(()=>{ ${t} })()` : t, c = new Function(
      ["scope"],
      `with (scope) { let __result = ${a}; return __result }`
    ).call(i.context, r);
    return typeof c == "function" && At ? c.apply(r, o) : c;
  }
}
var Ii = "x-";
function Rt(e = "") {
  return Ii + e;
}
function Ur(e) {
  Ii = e;
}
var xe = {};
function D(e, t) {
  return xe[e] = t, {
    before(i) {
      if (!xe[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const n = ut.indexOf(i);
      ut.splice(n >= 0 ? n : ut.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Yr(e) {
  return Object.keys(xe).includes(e);
}
function Si(e, t, i) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let r = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Un(r);
    r = r.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(r);
  }
  let n = {};
  return t.map(Gn((r, o) => n[r] = o)).filter(Qn).map(Xr(n, i)).sort(Gr).map((r) => Jr(e, r));
}
function Un(e) {
  return Array.from(e).map(Gn()).filter((t) => !Qn(t));
}
var Ge = !1, Kt = /* @__PURE__ */ new Map(), Yn = Symbol();
function Kr(e) {
  Ge = !0;
  let t = Symbol();
  Yn = t, Kt.set(t, []);
  let i = () => {
    for (; Kt.get(t).length; )
      Kt.get(t).shift()();
    Kt.delete(t);
  }, n = () => {
    Ge = !1, i();
  };
  e(i), n();
}
function Kn(e) {
  let t = [], i = (a) => t.push(a), [n, s] = Er(e);
  return t.push(s), [{
    Alpine: Ft,
    effect: n,
    cleanup: i,
    evaluateLater: P.bind(P, e),
    evaluate: ht.bind(ht, e)
  }, () => t.forEach((a) => a())];
}
function Jr(e, t) {
  let i = () => {
  }, n = xe[t.type] || i, [s, r] = Kn(e);
  Mn(e, t.original, r);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, s), n = n.bind(n, e, t, s), Ge ? Kt.get(Yn).push(n) : n());
  };
  return o.runCleanups = r, o;
}
var Jn = (e, t) => ({ name: i, value: n }) => (i.startsWith(e) && (i = i.replace(e, t)), { name: i, value: n }), Xn = (e) => e;
function Gn(e = () => {
}) {
  return ({ name: t, value: i }) => {
    let { name: n, value: s } = Zn.reduce((r, o) => o(r), { name: t, value: i });
    return n !== t && e(n, t), { name: n, value: s };
  };
}
var Zn = [];
function Ei(e) {
  Zn.push(e);
}
function Qn({ name: e }) {
  return ts().test(e);
}
var ts = () => new RegExp(`^${Ii}([^:^.]+)\\b`);
function Xr(e, t) {
  return ({ name: i, value: n }) => {
    i === n && (n = "");
    let s = i.match(ts()), r = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[i] || i;
    return {
      type: s ? s[1] : null,
      value: r ? r[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: n,
      original: a
    };
  };
}
var Ze = "DEFAULT", ut = [
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
  Ze,
  "teleport"
];
function Gr(e, t) {
  let i = ut.indexOf(e.type) === -1 ? Ze : e.type, n = ut.indexOf(t.type) === -1 ? Ze : t.type;
  return ut.indexOf(i) - ut.indexOf(n);
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
function yt(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => yt(s, t));
    return;
  }
  let i = !1;
  if (t(e, () => i = !0), i)
    return;
  let n = e.firstElementChild;
  for (; n; )
    yt(n, t), n = n.nextElementSibling;
}
function H(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var ji = !1;
function Zr() {
  ji && H("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), ji = !0, document.body || H("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Jt(document, "alpine:init"), Jt(document, "alpine:initializing"), vi(), Cr((t) => Z(t, yt)), gi((t) => Pt(t)), Ln((t, i) => {
    Si(t, i).forEach((n) => n());
  });
  let e = (t) => !Ae(t.parentElement, !0);
  Array.from(document.querySelectorAll(ns().join(","))).filter(e).forEach((t) => {
    Z(t);
  }), Jt(document, "alpine:initialized"), setTimeout(() => {
    io();
  });
}
var Ti = [], es = [];
function is() {
  return Ti.map((e) => e());
}
function ns() {
  return Ti.concat(es).map((e) => e());
}
function ss(e) {
  Ti.push(e);
}
function rs(e) {
  es.push(e);
}
function Ae(e, t = !1) {
  return vt(e, (i) => {
    if ((t ? ns() : is()).some((s) => i.matches(s)))
      return !0;
  });
}
function vt(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), e.parentNode instanceof ShadowRoot)
      return vt(e.parentNode.host, t);
    if (e.parentElement)
      return vt(e.parentElement, t);
  }
}
function Qr(e) {
  return is().some((t) => e.matches(t));
}
var os = [];
function to(e) {
  os.push(e);
}
var eo = 1;
function Z(e, t = yt, i = () => {
}) {
  vt(e, (n) => n._x_ignore) || Kr(() => {
    t(e, (n, s) => {
      n._x_marker || (i(n, s), os.forEach((r) => r(n, s)), Si(n, n.attributes).forEach((r) => r()), n._x_ignore || (n._x_marker = eo++), n._x_ignore && s());
    });
  });
}
function Pt(e, t = yt) {
  t(e, (i) => {
    $r(i), Rn(i), delete i._x_marker;
  });
}
function io() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, i, n]) => {
    Yr(i) || n.some((s) => {
      if (document.querySelector(s))
        return H(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var Qe = [], Ci = !1;
function $i(e = () => {
}) {
  return queueMicrotask(() => {
    Ci || setTimeout(() => {
      ti();
    });
  }), new Promise((t) => {
    Qe.push(() => {
      e(), t();
    });
  });
}
function ti() {
  for (Ci = !1; Qe.length; )
    Qe.shift()();
}
function no() {
  Ci = !0;
}
function Ai(e, t) {
  return Array.isArray(t) ? qi(e, t.join(" ")) : typeof t == "object" && t !== null ? so(e, t) : typeof t == "function" ? Ai(e, t()) : qi(e, t);
}
function qi(e, t) {
  let i = (s) => s.split(" ").filter((r) => !e.classList.contains(r)).filter(Boolean), n = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", n(i(t));
}
function so(e, t) {
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
  return typeof t == "object" && t !== null ? ro(e, t) : oo(e, t);
}
function ro(e, t) {
  let i = {};
  return Object.entries(t).forEach(([n, s]) => {
    i[n] = e.style[n], n.startsWith("--") || (n = ao(n)), e.style.setProperty(n, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    Oe(e, i);
  };
}
function oo(e, t) {
  let i = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", i || "");
  };
}
function ao(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ei(e, t = () => {
}) {
  let i = !1;
  return function() {
    i ? t.apply(this, arguments) : (i = !0, e.apply(this, arguments));
  };
}
D("transition", (e, { value: t, modifiers: i, expression: n }, { evaluate: s }) => {
  typeof n == "function" && (n = s(n)), n !== !1 && (!n || typeof n == "boolean" ? co(e, i, t) : lo(e, n, t));
});
function lo(e, t, i) {
  as(e, Ai, ""), {
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
function co(e, t, i) {
  as(e, Oe);
  let n = !t.includes("in") && !t.includes("out") && !i, s = n || t.includes("in") || ["enter"].includes(i), r = n || t.includes("out") || ["leave"].includes(i);
  t.includes("in") && !n && (t = t.filter((m, f) => f < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((m, f) => f > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), c = a ? 0 : 1, u = l ? Vt(t, "scale", 95) / 100 : 1, d = Vt(t, "delay", 0) / 1e3, p = Vt(t, "origin", "center"), g = "opacity, transform", w = Vt(t, "duration", 150) / 1e3, y = Vt(t, "duration", 75) / 1e3, h = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: p,
    transitionDelay: `${d}s`,
    transitionProperty: g,
    transitionDuration: `${w}s`,
    transitionTimingFunction: h
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), r && (e._x_transition.leave.during = {
    transformOrigin: p,
    transitionDelay: `${d}s`,
    transitionProperty: g,
    transitionDuration: `${y}s`,
    transitionTimingFunction: h
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function as(e, t, i = {}) {
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
    let o = ls(e);
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
function ls(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : ls(t);
}
function ii(e, t, { during: i, start: n, end: s } = {}, r = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(s).length === 0) {
    r(), o();
    return;
  }
  let a, l, c;
  uo(e, {
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
function uo(e, t) {
  let i, n, s, r = ei(() => {
    k(() => {
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
  }, k(() => {
    t.start(), t.during();
  }), no(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), k(() => {
      t.before();
    }), n = !0, requestAnimationFrame(() => {
      i || (k(() => {
        t.end();
      }), ti(), setTimeout(e._x_transitioning.finish, o + a), s = !0);
    });
  });
}
function Vt(e, t, i) {
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
var rt = !1;
function lt(e, t = () => {
}) {
  return (...i) => rt ? t(...i) : e(...i);
}
function ho(e) {
  return (...t) => rt && e(...t);
}
var cs = [];
function ke(e) {
  cs.push(e);
}
function fo(e, t) {
  cs.forEach((i) => i(e, t)), rt = !0, us(() => {
    Z(t, (i, n) => {
      n(i, () => {
      });
    });
  }), rt = !1;
}
var ni = !1;
function po(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), rt = !0, ni = !0, us(() => {
    mo(t);
  }), rt = !1, ni = !1;
}
function mo(e) {
  let t = !1;
  Z(e, (n, s) => {
    yt(n, (r, o) => {
      if (t && Qr(r))
        return o();
      t = !0, s(r, o);
    });
  });
}
function us(e) {
  let t = Ct;
  Wi((i, n) => {
    let s = t(i);
    return Mt(s), () => {
    };
  }), e(), Wi(t);
}
function ds(e, t, i, n = []) {
  switch (e._x_bindings || (e._x_bindings = Lt({})), e._x_bindings[t] = i, t = n.includes("camel") ? Io(t) : t, t) {
    case "value":
      go(e, i);
      break;
    case "style":
      yo(e, i);
      break;
    case "class":
      bo(e, i);
      break;
    case "selected":
    case "checked":
      vo(e, t, i);
      break;
    default:
      hs(e, t, i);
      break;
  }
}
function go(e, t) {
  if (ms(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = ye(e.value) === t : e.checked = Ui(e.value, t));
  else if (Oi(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((i) => Ui(i, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    _o(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function bo(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Ai(e, t);
}
function yo(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Oe(e, t);
}
function vo(e, t, i) {
  hs(e, t, i), xo(e, t, i);
}
function hs(e, t, i) {
  [null, void 0, !1].includes(i) && Eo(t) ? e.removeAttribute(t) : (fs(t) && (i = t), wo(e, t, i));
}
function wo(e, t, i) {
  e.getAttribute(t) != i && e.setAttribute(t, i);
}
function xo(e, t, i) {
  e[t] !== i && (e[t] = i);
}
function _o(e, t) {
  const i = [].concat(t).map((n) => n + "");
  Array.from(e.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function Io(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Ui(e, t) {
  return e == t;
}
function ye(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var So = /* @__PURE__ */ new Set([
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
function fs(e) {
  return So.has(e);
}
function Eo(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function To(e, t, i) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ps(e, t, i);
}
function Co(e, t, i, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = n, Hn(() => ht(e, s.expression));
  }
  return ps(e, t, i);
}
function ps(e, t, i) {
  let n = e.getAttribute(t);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : fs(t) ? !![t, "true"].includes(n) : n;
}
function Oi(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function ms(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function gs(e, t) {
  let i;
  return function() {
    const n = this, s = arguments, r = function() {
      i = null, e.apply(n, s);
    };
    clearTimeout(i), i = setTimeout(r, t);
  };
}
function bs(e, t) {
  let i;
  return function() {
    let n = this, s = arguments;
    i || (e.apply(n, s), i = !0, setTimeout(() => i = !1, t));
  };
}
function ys({ get: e, set: t }, { get: i, set: n }) {
  let s = !0, r, o = Ct(() => {
    let a = e(), l = i();
    if (s)
      n(Ve(a)), s = !1;
    else {
      let c = JSON.stringify(a), u = JSON.stringify(l);
      c !== r ? n(Ve(a)) : c !== u && t(Ve(l));
    }
    r = JSON.stringify(e()), JSON.stringify(i());
  });
  return () => {
    Mt(o);
  };
}
function Ve(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function $o(e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => i(Ft));
}
var ct = {}, Yi = !1;
function Ao(e, t) {
  if (Yi || (ct = Lt(ct), Yi = !0), t === void 0)
    return ct[e];
  ct[e] = t, _i(ct[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ct[e].init();
}
function Oo() {
  return ct;
}
var vs = {};
function ko(e, t) {
  let i = typeof t != "function" ? () => t : t;
  return e instanceof Element ? ws(e, i()) : (vs[e] = i, () => {
  });
}
function Do(e) {
  return Object.entries(vs).forEach(([t, i]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), e;
}
function ws(e, t, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let s = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), r = Un(s);
  return s = s.map((o) => r.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), Si(e, s, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var xs = {};
function No(e, t) {
  xs[e] = t;
}
function Lo(e, t) {
  return Object.entries(xs).forEach(([i, n]) => {
    Object.defineProperty(e, i, {
      get() {
        return (...s) => n.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var Mo = {
  get reactive() {
    return Lt;
  },
  get release() {
    return Mt;
  },
  get effect() {
    return Ct;
  },
  get raw() {
    return An;
  },
  get transaction() {
    return Tr;
  },
  version: "3.15.8",
  flushAndStopDeferringMutations: kr,
  dontAutoEvaluateFunctions: Hn,
  disableEffectScheduling: Ir,
  startObservingMutations: vi,
  stopObservingMutations: Pn,
  setReactivityEngine: Sr,
  onAttributeRemoved: Mn,
  onAttributesAdded: Ln,
  closestDataStack: gt,
  skipDuringClone: lt,
  onlyDuringClone: ho,
  addRootSelector: ss,
  addInitSelector: rs,
  setErrorHandler: Pr,
  interceptClone: ke,
  addScopeToNode: ne,
  deferMutations: Or,
  mapAttributes: Ei,
  evaluateLater: P,
  interceptInit: to,
  initInterceptors: _i,
  injectMagics: Gt,
  setEvaluator: zr,
  setRawEvaluator: Br,
  mergeProxies: bt,
  extractProp: Co,
  findClosest: vt,
  onElRemoved: gi,
  closestRoot: Ae,
  destroyTree: Pt,
  interceptor: zn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ii,
  // INTERNAL
  setStyles: Oe,
  // INTERNAL
  mutateDom: k,
  directive: D,
  entangle: ys,
  throttle: bs,
  debounce: gs,
  evaluate: ht,
  evaluateRaw: jr,
  initTree: Z,
  nextTick: $i,
  prefixed: Rt,
  prefix: Ur,
  plugin: $o,
  magic: U,
  store: Ao,
  start: Zr,
  clone: po,
  // INTERNAL
  cloneNode: fo,
  // INTERNAL
  bound: To,
  $data: Fn,
  watch: On,
  walk: yt,
  data: No,
  bind: ko
}, Ft = Mo;
function Ro(e, t) {
  const i = /* @__PURE__ */ Object.create(null), n = e.split(",");
  for (let s = 0; s < n.length; s++)
    i[n[s]] = !0;
  return (s) => !!i[s];
}
var Po = Object.freeze({}), Fo = Object.prototype.hasOwnProperty, De = (e, t) => Fo.call(e, t), ft = Array.isArray, Xt = (e) => _s(e) === "[object Map]", zo = (e) => typeof e == "string", ki = (e) => typeof e == "symbol", Ne = (e) => e !== null && typeof e == "object", Bo = Object.prototype.toString, _s = (e) => Bo.call(e), Is = (e) => _s(e).slice(8, -1), Di = (e) => zo(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Vo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (i) => t[i] || (t[i] = e(i));
}, Ho = Vo((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ss = (e, t) => e !== t && (e === e || t === t), si = /* @__PURE__ */ new WeakMap(), Ht = [], Y, pt = Symbol("iterate"), ri = Symbol("Map key iterate");
function Wo(e) {
  return e && e._isEffect === !0;
}
function jo(e, t = Po) {
  Wo(e) && (e = e.raw);
  const i = Yo(e, t);
  return t.lazy || i(), i;
}
function qo(e) {
  e.active && (Es(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var Uo = 0;
function Yo(e, t) {
  const i = function() {
    if (!i.active)
      return e();
    if (!Ht.includes(i)) {
      Es(i);
      try {
        return Jo(), Ht.push(i), Y = i, e();
      } finally {
        Ht.pop(), Ts(), Y = Ht[Ht.length - 1];
      }
    }
  };
  return i.id = Uo++, i.allowRecurse = !!t.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = e, i.deps = [], i.options = t, i;
}
function Es(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let i = 0; i < t.length; i++)
      t[i].delete(e);
    t.length = 0;
  }
}
var kt = !0, Ni = [];
function Ko() {
  Ni.push(kt), kt = !1;
}
function Jo() {
  Ni.push(kt), kt = !0;
}
function Ts() {
  const e = Ni.pop();
  kt = e === void 0 ? !0 : e;
}
function W(e, t, i) {
  if (!kt || Y === void 0)
    return;
  let n = si.get(e);
  n || si.set(e, n = /* @__PURE__ */ new Map());
  let s = n.get(i);
  s || n.set(i, s = /* @__PURE__ */ new Set()), s.has(Y) || (s.add(Y), Y.deps.push(s), Y.options.onTrack && Y.options.onTrack({
    effect: Y,
    target: e,
    type: t,
    key: i
  }));
}
function ot(e, t, i, n, s, r) {
  const o = si.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (u) => {
    u && u.forEach((d) => {
      (d !== Y || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (i === "length" && ft(e))
    o.forEach((u, d) => {
      (d === "length" || d >= n) && l(u);
    });
  else
    switch (i !== void 0 && l(o.get(i)), t) {
      case "add":
        ft(e) ? Di(i) && l(o.get("length")) : (l(o.get(pt)), Xt(e) && l(o.get(ri)));
        break;
      case "delete":
        ft(e) || (l(o.get(pt)), Xt(e) && l(o.get(ri)));
        break;
      case "set":
        Xt(e) && l(o.get(pt));
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
var Xo = /* @__PURE__ */ Ro("__proto__,__v_isRef,__isVue"), Cs = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(ki)), Go = /* @__PURE__ */ $s(), Zo = /* @__PURE__ */ $s(!0), Ki = /* @__PURE__ */ Qo();
function Qo() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...i) {
      const n = $(this);
      for (let r = 0, o = this.length; r < o; r++)
        W(n, "get", r + "");
      const s = n[t](...i);
      return s === -1 || s === !1 ? n[t](...i.map($)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...i) {
      Ko();
      const n = $(this)[t].apply(this, i);
      return Ts(), n;
    };
  }), e;
}
function $s(e = !1, t = !1) {
  return function(n, s, r) {
    if (s === "__v_isReactive")
      return !e;
    if (s === "__v_isReadonly")
      return e;
    if (s === "__v_raw" && r === (e ? t ? fa : Ds : t ? ha : ks).get(n))
      return n;
    const o = ft(n);
    if (!e && o && De(Ki, s))
      return Reflect.get(Ki, s, r);
    const a = Reflect.get(n, s, r);
    return (ki(s) ? Cs.has(s) : Xo(s)) || (e || W(n, "get", s), t) ? a : oi(a) ? !o || !Di(s) ? a.value : a : Ne(a) ? e ? Ns(a) : Pi(a) : a;
  };
}
var ta = /* @__PURE__ */ ea();
function ea(e = !1) {
  return function(i, n, s, r) {
    let o = i[n];
    if (!e && (s = $(s), o = $(o), !ft(i) && oi(o) && !oi(s)))
      return o.value = s, !0;
    const a = ft(i) && Di(n) ? Number(n) < i.length : De(i, n), l = Reflect.set(i, n, s, r);
    return i === $(r) && (a ? Ss(s, o) && ot(i, "set", n, s, o) : ot(i, "add", n, s)), l;
  };
}
function ia(e, t) {
  const i = De(e, t), n = e[t], s = Reflect.deleteProperty(e, t);
  return s && i && ot(e, "delete", t, void 0, n), s;
}
function na(e, t) {
  const i = Reflect.has(e, t);
  return (!ki(t) || !Cs.has(t)) && W(e, "has", t), i;
}
function sa(e) {
  return W(e, "iterate", ft(e) ? "length" : pt), Reflect.ownKeys(e);
}
var ra = {
  get: Go,
  set: ta,
  deleteProperty: ia,
  has: na,
  ownKeys: sa
}, oa = {
  get: Zo,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Li = (e) => Ne(e) ? Pi(e) : e, Mi = (e) => Ne(e) ? Ns(e) : e, Ri = (e) => e, Le = (e) => Reflect.getPrototypeOf(e);
function ae(e, t, i = !1, n = !1) {
  e = e.__v_raw;
  const s = $(e), r = $(t);
  t !== r && !i && W(s, "get", t), !i && W(s, "get", r);
  const { has: o } = Le(s), a = n ? Ri : i ? Mi : Li;
  if (o.call(s, t))
    return a(e.get(t));
  if (o.call(s, r))
    return a(e.get(r));
  e !== s && e.get(t);
}
function le(e, t = !1) {
  const i = this.__v_raw, n = $(i), s = $(e);
  return e !== s && !t && W(n, "has", e), !t && W(n, "has", s), e === s ? i.has(e) : i.has(e) || i.has(s);
}
function ce(e, t = !1) {
  return e = e.__v_raw, !t && W($(e), "iterate", pt), Reflect.get(e, "size", e);
}
function Ji(e) {
  e = $(e);
  const t = $(this);
  return Le(t).has.call(t, e) || (t.add(e), ot(t, "add", e, e)), this;
}
function Xi(e, t) {
  t = $(t);
  const i = $(this), { has: n, get: s } = Le(i);
  let r = n.call(i, e);
  r ? Os(i, n, e) : (e = $(e), r = n.call(i, e));
  const o = s.call(i, e);
  return i.set(e, t), r ? Ss(t, o) && ot(i, "set", e, t, o) : ot(i, "add", e, t), this;
}
function Gi(e) {
  const t = $(this), { has: i, get: n } = Le(t);
  let s = i.call(t, e);
  s ? Os(t, i, e) : (e = $(e), s = i.call(t, e));
  const r = n ? n.call(t, e) : void 0, o = t.delete(e);
  return s && ot(t, "delete", e, void 0, r), o;
}
function Zi() {
  const e = $(this), t = e.size !== 0, i = Xt(e) ? new Map(e) : new Set(e), n = e.clear();
  return t && ot(e, "clear", void 0, void 0, i), n;
}
function ue(e, t) {
  return function(n, s) {
    const r = this, o = r.__v_raw, a = $(o), l = t ? Ri : e ? Mi : Li;
    return !e && W(a, "iterate", pt), o.forEach((c, u) => n.call(s, l(c), l(u), r));
  };
}
function de(e, t, i) {
  return function(...n) {
    const s = this.__v_raw, r = $(s), o = Xt(r), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, c = s[e](...n), u = i ? Ri : t ? Mi : Li;
    return !t && W(r, "iterate", l ? ri : pt), {
      // iterator protocol
      next() {
        const { value: d, done: p } = c.next();
        return p ? { value: d, done: p } : {
          value: a ? [u(d[0]), u(d[1])] : u(d),
          done: p
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
      console.warn(`${Ho(e)} operation ${i}failed: target is readonly.`, $(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function aa() {
  const e = {
    get(r) {
      return ae(this, r);
    },
    get size() {
      return ce(this);
    },
    has: le,
    add: Ji,
    set: Xi,
    delete: Gi,
    clear: Zi,
    forEach: ue(!1, !1)
  }, t = {
    get(r) {
      return ae(this, r, !1, !0);
    },
    get size() {
      return ce(this);
    },
    has: le,
    add: Ji,
    set: Xi,
    delete: Gi,
    clear: Zi,
    forEach: ue(!1, !0)
  }, i = {
    get(r) {
      return ae(this, r, !0);
    },
    get size() {
      return ce(this, !0);
    },
    has(r) {
      return le.call(this, r, !0);
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
    forEach: ue(!0, !1)
  }, n = {
    get(r) {
      return ae(this, r, !0, !0);
    },
    get size() {
      return ce(this, !0);
    },
    has(r) {
      return le.call(this, r, !0);
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
    forEach: ue(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((r) => {
    e[r] = de(r, !1, !1), i[r] = de(r, !0, !1), t[r] = de(r, !1, !0), n[r] = de(r, !0, !0);
  }), [
    e,
    i,
    t,
    n
  ];
}
var [la, ca] = /* @__PURE__ */ aa();
function As(e, t) {
  const i = e ? ca : la;
  return (n, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? n : Reflect.get(De(i, s) && s in n ? i : n, s, r);
}
var ua = {
  get: /* @__PURE__ */ As(!1)
}, da = {
  get: /* @__PURE__ */ As(!0)
};
function Os(e, t, i) {
  const n = $(i);
  if (n !== i && t.call(e, n)) {
    const s = Is(e);
    console.warn(`Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var ks = /* @__PURE__ */ new WeakMap(), ha = /* @__PURE__ */ new WeakMap(), Ds = /* @__PURE__ */ new WeakMap(), fa = /* @__PURE__ */ new WeakMap();
function pa(e) {
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
function ma(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : pa(Is(e));
}
function Pi(e) {
  return e && e.__v_isReadonly ? e : Ls(e, !1, ra, ua, ks);
}
function Ns(e) {
  return Ls(e, !0, oa, da, Ds);
}
function Ls(e, t, i, n, s) {
  if (!Ne(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = s.get(e);
  if (r)
    return r;
  const o = ma(e);
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
U("nextTick", () => $i);
U("dispatch", (e) => Jt.bind(Jt, e));
U("watch", (e, { evaluateLater: t, cleanup: i }) => (n, s) => {
  let r = t(n), a = On(() => {
    let l;
    return r((c) => l = c), l;
  }, s);
  i(a);
});
U("store", Oo);
U("data", (e) => Fn(e));
U("root", (e) => Ae(e));
U("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = bt(ga(e))), e._x_refs_proxy));
function ga(e) {
  let t = [];
  return vt(e, (i) => {
    i._x_refs && t.push(i._x_refs);
  }), t;
}
var He = {};
function Ms(e) {
  return He[e] || (He[e] = 0), ++He[e];
}
function ba(e, t) {
  return vt(e, (i) => {
    if (i._x_ids && i._x_ids[t])
      return !0;
  });
}
function ya(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Ms(t));
}
U("id", (e, { cleanup: t }) => (i, n = null) => {
  let s = `${i}${n ? `-${n}` : ""}`;
  return va(e, s, t, () => {
    let r = ba(e, i), o = r ? r._x_ids[i] : Ms(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
ke((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function va(e, t, i, n) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = n();
  return e._x_id[t] = s, i(() => {
    delete e._x_id[t];
  }), s;
}
U("el", (e) => e);
Rs("Focus", "focus", "focus");
Rs("Persist", "persist", "persist");
function Rs(e, t, i) {
  U(t, (n) => H(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
D("modelable", (e, { expression: t }, { effect: i, evaluateLater: n, cleanup: s }) => {
  let r = n(t), o = () => {
    let u;
    return r((d) => u = d), u;
  }, a = n(`${t} = __placeholder`), l = (u) => a(() => {
  }, { scope: { __placeholder: u } }), c = o();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, p = ys(
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
    s(p);
  });
});
D("teleport", (e, { modifiers: t, expression: i }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && H("x-teleport can only be used on a <template> tag", e);
  let s = Qi(i), r = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = r, r._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), r.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    r.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), ne(r, {}, e);
  let o = (a, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(a, l) : c.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  k(() => {
    o(r, s, t), lt(() => {
      Z(r);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Qi(i);
    k(() => {
      o(e._x_teleport, a, t);
    });
  }, n(
    () => k(() => {
      r.remove(), Pt(r);
    })
  );
});
var wa = document.createElement("div");
function Qi(e) {
  let t = lt(() => document.querySelector(e), () => wa)();
  return t || H(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Ps = () => {
};
Ps.inline = (e, { modifiers: t }, { cleanup: i }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, i(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
D("ignore", Ps);
D("effect", lt((e, { expression: t }, { effect: i }) => {
  i(P(e, t));
}));
function $t(e, t, i, n) {
  let s = e, r = (l) => n(l), o = {}, a = (l, c) => (u) => c(l, u);
  if (i.includes("dot") && (t = xa(t)), i.includes("camel") && (t = _a(t)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (s = window), i.includes("document") && (s = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", c = _e(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    r = gs(r, c);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", c = _e(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    r = bs(r, c);
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
  })), t === "submit" && (r = a(r, (l, c) => {
    c.target._x_pendingModelUpdates && c.target._x_pendingModelUpdates.forEach((u) => u()), l(c);
  })), (Sa(t) || Fs(t)) && (r = a(r, (l, c) => {
    Ea(c, i) || l(c);
  })), s.addEventListener(t, r, o), () => {
    s.removeEventListener(t, r, o);
  };
}
function xa(e) {
  return e.replace(/-/g, ".");
}
function _a(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function _e(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ia(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Sa(e) {
  return ["keydown", "keyup"].includes(e);
}
function Fs(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Ea(e, t) {
  let i = t.filter((r) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(r));
  if (i.includes("debounce")) {
    let r = i.indexOf("debounce");
    i.splice(r, _e((i[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let r = i.indexOf("throttle");
    i.splice(r, _e((i[r + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && tn(e.key).includes(i[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((r) => i.includes(r));
  return i = i.filter((r) => !s.includes(r)), !(s.length > 0 && s.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === s.length && (Fs(e.type) || tn(e.key).includes(i[0])));
}
function tn(e) {
  if (!e)
    return [];
  e = Ia(e);
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
D("model", (e, { modifiers: t, expression: i }, { effect: n, cleanup: s }) => {
  let r = e;
  t.includes("parent") && (r = e.parentNode);
  let o = P(r, i), a;
  typeof i == "string" ? a = P(r, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = P(r, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let y;
    return o((h) => y = h), en(y) ? y.get() : y;
  }, c = (y) => {
    let h;
    o((m) => h = m), en(h) ? h.set(y) : a(() => {
    }, {
      scope: { __placeholder: y }
    });
  };
  typeof i == "string" && e.type === "radio" && k(() => {
    e.hasAttribute("name") || e.setAttribute("name", i);
  });
  let u = t.includes("change") || t.includes("lazy"), d = t.includes("blur"), p = t.includes("enter"), g = u || d || p, w;
  if (rt)
    w = () => {
    };
  else if (g) {
    let y = [], h = (m) => c(he(e, t, m, l()));
    if (u && y.push($t(e, "change", t, h)), d && (y.push($t(e, "blur", t, h)), e.form)) {
      let m = () => h({ target: e });
      e.form._x_pendingModelUpdates || (e.form._x_pendingModelUpdates = []), e.form._x_pendingModelUpdates.push(m), s(() => e.form._x_pendingModelUpdates.splice(e.form._x_pendingModelUpdates.indexOf(m), 1));
    }
    p && y.push($t(e, "keydown", t, (m) => {
      m.key === "Enter" && h(m);
    })), w = () => y.forEach((m) => m());
  } else {
    let y = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    w = $t(e, y, t, (h) => {
      c(he(e, t, h, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Oi(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    he(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = w, s(() => e._x_removeModelListeners.default()), e.form) {
    let y = $t(e.form, "reset", [], (h) => {
      $i(() => e._x_model && e._x_model.set(he(e, t, { target: e }, l())));
    });
    s(() => y());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(y) {
      c(y);
    }
  }, e._x_forceModelUpdate = (y) => {
    y === void 0 && typeof i == "string" && i.match(/\./) && (y = ""), window.fromModel = !0, k(() => ds(e, "value", y)), delete window.fromModel;
  }, n(() => {
    let y = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(y);
  });
});
function he(e, t, i, n) {
  return k(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Oi(e))
      if (Array.isArray(n)) {
        let s = null;
        return t.includes("number") ? s = We(i.target.value) : t.includes("boolean") ? s = ye(i.target.value) : s = i.target.value, i.target.checked ? n.includes(s) ? n : n.concat([s]) : n.filter((r) => !Ta(r, s));
      } else
        return i.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(i.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return We(r);
        }) : t.includes("boolean") ? Array.from(i.target.selectedOptions).map((s) => {
          let r = s.value || s.text;
          return ye(r);
        }) : Array.from(i.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return ms(e) ? i.target.checked ? s = i.target.value : s = n : s = i.target.value, t.includes("number") ? We(s) : t.includes("boolean") ? ye(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function We(e) {
  let t = e ? parseFloat(e) : null;
  return Ca(t) ? t : e;
}
function Ta(e, t) {
  return e == t;
}
function Ca(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function en(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
D("cloak", (e) => queueMicrotask(() => k(() => e.removeAttribute(Rt("cloak")))));
rs(() => `[${Rt("init")}]`);
D("init", lt((e, { expression: t }, { evaluate: i }) => typeof t == "string" ? !!t.trim() && i(t, {}, !1) : i(t, {}, !1)));
D("text", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let s = n(t);
  i(() => {
    s((r) => {
      k(() => {
        e.textContent = r;
      });
    });
  });
});
D("html", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let s = n(t);
  i(() => {
    s((r) => {
      k(() => {
        e.innerHTML = r, e._x_ignoreSelf = !0, Z(e), delete e._x_ignoreSelf;
      });
    });
  });
});
Ei(Jn(":", Xn(Rt("bind:"))));
var zs = (e, { value: t, modifiers: i, expression: n, original: s }, { effect: r, cleanup: o }) => {
  if (!t) {
    let l = {};
    Do(l), P(e, n)((u) => {
      ws(e, u, s);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return $a(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = P(e, n);
  r(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), k(() => ds(e, t, l, i));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
zs.inline = (e, { value: t, modifiers: i, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: !1 });
};
D("bind", zs);
function $a(e, t) {
  e._x_keyExpression = t;
}
ss(() => `[${Rt("data")}]`);
D("data", (e, { expression: t }, { cleanup: i }) => {
  if (Aa(e))
    return;
  t = t === "" ? "{}" : t;
  let n = {};
  Gt(n, e);
  let s = {};
  Lo(s, n);
  let r = ht(e, t, { scope: s });
  (r === void 0 || r === !0) && (r = {}), Gt(r, e);
  let o = Lt(r);
  _i(o);
  let a = ne(e, o);
  o.init && ht(e, o.init), i(() => {
    o.destroy && ht(e, o.destroy), a();
  });
});
ke((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Aa(e) {
  return rt ? ni ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
D("show", (e, { modifiers: t, expression: i }, { effect: n }) => {
  let s = P(e, i);
  e._x_doHide || (e._x_doHide = () => {
    k(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    k(() => {
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
D("for", (e, { expression: t }, { effect: i, cleanup: n }) => {
  let s = ka(t), r = P(e, s.items), o = P(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, i(() => Oa(e, s, r, o)), n(() => {
    Object.values(e._x_lookup).forEach((a) => k(
      () => {
        Pt(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function Oa(e, t, i, n) {
  let s = (o) => typeof o == "object" && !Array.isArray(o), r = e;
  i((o) => {
    Da(o) && o >= 0 && (o = Array.from(Array(o).keys(), (h) => h + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, c = [], u = [];
    if (s(o))
      o = Object.entries(o).map(([h, m]) => {
        let f = nn(t, m, h, o);
        n((x) => {
          u.includes(x) && H("Duplicate key on x-for", e), u.push(x);
        }, { scope: { index: h, ...f } }), c.push(f);
      });
    else
      for (let h = 0; h < o.length; h++) {
        let m = nn(t, o[h], h, o);
        n((f) => {
          u.includes(f) && H("Duplicate key on x-for", e), u.push(f);
        }, { scope: { index: h, ...m } }), c.push(m);
      }
    let d = [], p = [], g = [], w = [];
    for (let h = 0; h < l.length; h++) {
      let m = l[h];
      u.indexOf(m) === -1 && g.push(m);
    }
    l = l.filter((h) => !g.includes(h));
    let y = "template";
    for (let h = 0; h < u.length; h++) {
      let m = u[h], f = l.indexOf(m);
      if (f === -1)
        l.splice(h, 0, m), d.push([y, h]);
      else if (f !== h) {
        let x = l.splice(h, 1)[0], _ = l.splice(f - 1, 1)[0];
        l.splice(h, 0, _), l.splice(f, 0, x), p.push([x, _]);
      } else
        w.push(m);
      y = m;
    }
    for (let h = 0; h < g.length; h++) {
      let m = g[h];
      m in a && (k(() => {
        Pt(a[m]), a[m].remove();
      }), delete a[m]);
    }
    for (let h = 0; h < p.length; h++) {
      let [m, f] = p[h], x = a[m], _ = a[f], I = document.createElement("div");
      k(() => {
        _ || H('x-for ":key" is undefined or invalid', r, f, a), _.after(I), x.after(_), _._x_currentIfEl && _.after(_._x_currentIfEl), I.before(x), x._x_currentIfEl && x.after(x._x_currentIfEl), I.remove();
      }), _._x_refreshXForScope(c[u.indexOf(f)]);
    }
    for (let h = 0; h < d.length; h++) {
      let [m, f] = d[h], x = m === "template" ? r : a[m];
      x._x_currentIfEl && (x = x._x_currentIfEl);
      let _ = c[f], I = u[f], b = document.importNode(r.content, !0).firstElementChild, v = Lt(_);
      ne(b, v, r), b._x_refreshXForScope = (S) => {
        Object.entries(S).forEach(([T, E]) => {
          v[T] = E;
        });
      }, k(() => {
        x.after(b), lt(() => Z(b))();
      }), typeof I == "object" && H("x-for key cannot be an object, it must be a string or an integer", r), a[I] = b;
    }
    for (let h = 0; h < w.length; h++)
      a[w[h]]._x_refreshXForScope(c[u.indexOf(w[h])]);
    r._x_prevKeys = u;
  });
}
function ka(e) {
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
function Da(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Bs() {
}
Bs.inline = (e, { expression: t }, { cleanup: i }) => {
  let n = Ae(e);
  n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, i(() => delete n._x_refs[t]);
};
D("ref", Bs);
D("if", (e, { expression: t }, { effect: i, cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && H("x-if can only be used on a <template> tag", e);
  let s = P(e, t), r = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return ne(a, {}, e), k(() => {
      e.after(a), lt(() => Z(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      k(() => {
        Pt(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  i(() => s((a) => {
    a ? r() : o();
  })), n(() => e._x_undoIf && e._x_undoIf());
});
D("id", (e, { expression: t }, { evaluate: i }) => {
  i(t).forEach((s) => ya(e, s));
});
ke((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ei(Jn("@", Xn(Rt("on:"))));
D("on", lt((e, { value: t, modifiers: i, expression: n }, { cleanup: s }) => {
  let r = n ? P(e, n) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = $t(e, t, i, (a) => {
    r(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  s(() => o());
}));
Me("Collapse", "collapse", "collapse");
Me("Intersect", "intersect", "intersect");
Me("Focus", "trap", "focus");
Me("Mask", "mask", "mask");
function Me(e, t, i) {
  D(t, (n) => H(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
Ft.setEvaluator(qn);
Ft.setRawEvaluator(qr);
Ft.setReactivityEngine({ reactive: Pi, effect: jo, release: qo, raw: $ });
var Na = Ft, Vs = Na;
function La(e) {
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
        let p = i.getBoundingClientRect().height;
        d === p && (d = r), e.transition(i, e.setStyles, {
          during: l,
          start: { height: d + "px" },
          end: { height: p + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - p) < 1 && (i.style.overflow = null);
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
var Ma = La;
function Ra(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: s }, { evaluateLater: r, cleanup: o }) => {
    let a = r(n), l = {
      rootMargin: za(s),
      threshold: Pa(s)
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
function Pa(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Fa(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function za(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let s = [];
  for (let r = 1; r < 5; r++)
    s.push(Fa(e[n + r] || ""));
  return s = s.filter((r) => r !== void 0), s.length ? s.join(" ").trim() : i;
}
var Ba = Ra, Hs = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Ie = /* @__PURE__ */ Hs.join(","), Ws = typeof Element > "u", wt = Ws ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, ai = !Ws && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, js = function(t, i, n) {
  var s = Array.prototype.slice.apply(t.querySelectorAll(Ie));
  return i && wt.call(t, Ie) && s.unshift(t), s = s.filter(n), s;
}, qs = function e(t, i, n) {
  for (var s = [], r = Array.from(t); r.length; ) {
    var o = r.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, c = e(l, !0, n);
      n.flatten ? s.push.apply(s, c) : s.push({
        scope: o,
        candidates: c
      });
    } else {
      var u = wt.call(o, Ie);
      u && n.filter(o) && (i || !t.includes(o)) && s.push(o);
      var d = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), p = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (d && p) {
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
}, Us = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, Va = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, Ys = function(t) {
  return t.tagName === "INPUT";
}, Ha = function(t) {
  return Ys(t) && t.type === "hidden";
}, Wa = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, ja = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, qa = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || ai(t), n = function(a) {
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
  var r = ja(s, t.form);
  return !r || r === t;
}, Ua = function(t) {
  return Ys(t) && t.type === "radio";
}, Ya = function(t) {
  return Ua(t) && !qa(t);
}, rn = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, s = i.height;
  return n === 0 && s === 0;
}, Ka = function(t, i) {
  var n = i.displayCheck, s = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var r = wt.call(t, "details>summary:first-of-type"), o = r ? t.parentElement : t;
  if (wt.call(o, "details:not([open]) *"))
    return !0;
  var a = ai(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof s == "function") {
      for (var c = t; t; ) {
        var u = t.parentElement, d = ai(t);
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
}, Ja = function(t) {
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
}, Se = function(t, i) {
  return !(i.disabled || Ha(i) || Ka(i, t) || // For a details element with a summary, the summary element gets the focus
  Wa(i) || Ja(i));
}, li = function(t, i) {
  return !(Ya(i) || Us(i) < 0 || !Se(t, i));
}, Xa = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, Ga = function e(t) {
  var i = [], n = [];
  return t.forEach(function(s, r) {
    var o = !!s.scope, a = o ? s.scope : s, l = Us(a, o), c = o ? e(s.candidates) : a;
    l === 0 ? o ? i.push.apply(i, c) : i.push(a) : n.push({
      documentOrder: r,
      tabIndex: l,
      item: s,
      isScope: o,
      content: c
    });
  }), n.sort(Va).reduce(function(s, r) {
    return r.isScope ? s.push.apply(s, r.content) : s.push(r.content), s;
  }, []).concat(i);
}, Za = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = qs([t], i.includeContainer, {
    filter: li.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: Xa
  }) : n = js(t, i.includeContainer, li.bind(null, i)), Ga(n);
}, Ks = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = qs([t], i.includeContainer, {
    filter: Se.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = js(t, i.includeContainer, Se.bind(null, i)), n;
}, fe = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return wt.call(t, Ie) === !1 ? !1 : li(i, t);
}, Qa = /* @__PURE__ */ Hs.concat("iframe").join(","), ve = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return wt.call(t, Qa) === !1 ? !1 : Se(i, t);
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
      tl(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : on(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function tl(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var ln = /* @__PURE__ */ (function() {
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
})(), el = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, il = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, nl = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, cn = function(t) {
  return setTimeout(t, 0);
}, un = function(t, i) {
  var n = -1;
  return t.every(function(s, r) {
    return i(s) ? (n = r, !1) : !0;
  }), n;
}, Wt = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++)
    n[s - 1] = arguments[s];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, pe = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, sl = function(t, i) {
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
  }, o, a = function(b, v, S) {
    return b && b[v] !== void 0 ? b[v] : s[S || v];
  }, l = function(b) {
    return r.containerGroups.findIndex(function(v) {
      var S = v.container, T = v.tabbableNodes;
      return S.contains(b) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(E) {
        return E === b;
      });
    });
  }, c = function(b) {
    var v = s[b];
    if (typeof v == "function") {
      for (var S = arguments.length, T = new Array(S > 1 ? S - 1 : 0), E = 1; E < S; E++)
        T[E - 1] = arguments[E];
      v = v.apply(void 0, T);
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
        var v = r.tabbableGroups[0], S = v && v.firstTabbableNode;
        b = S || c("fallbackFocus");
      }
    if (!b)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return b;
  }, d = function() {
    if (r.containerGroups = r.containers.map(function(b) {
      var v = Za(b, s.tabbableOptions), S = Ks(b, s.tabbableOptions);
      return {
        container: b,
        tabbableNodes: v,
        focusableNodes: S,
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
        nextTabbableNode: function(E) {
          var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = S.findIndex(function(L) {
            return L === E;
          });
          if (!(N < 0))
            return A ? S.slice(N + 1).find(function(L) {
              return fe(L, s.tabbableOptions);
            }) : S.slice(0, N).reverse().find(function(L) {
              return fe(L, s.tabbableOptions);
            });
        }
      };
    }), r.tabbableGroups = r.containerGroups.filter(function(b) {
      return b.tabbableNodes.length > 0;
    }), r.tabbableGroups.length <= 0 && !c("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, p = function I(b) {
    if (b !== !1 && b !== n.activeElement) {
      if (!b || !b.focus) {
        I(u());
        return;
      }
      b.focus({
        preventScroll: !!s.preventScroll
      }), r.mostRecentlyFocusedNode = b, el(b) && b.select();
    }
  }, g = function(b) {
    var v = c("setReturnFocus", b);
    return v || (v === !1 ? !1 : b);
  }, w = function(b) {
    var v = pe(b);
    if (!(l(v) >= 0)) {
      if (Wt(s.clickOutsideDeactivates, b)) {
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
          returnFocus: s.returnFocusOnDeactivate && !ve(v, s.tabbableOptions)
        });
        return;
      }
      Wt(s.allowOutsideClick, b) || b.preventDefault();
    }
  }, y = function(b) {
    var v = pe(b), S = l(v) >= 0;
    S || v instanceof Document ? S && (r.mostRecentlyFocusedNode = v) : (b.stopImmediatePropagation(), p(r.mostRecentlyFocusedNode || u()));
  }, h = function(b) {
    var v = pe(b);
    d();
    var S = null;
    if (r.tabbableGroups.length > 0) {
      var T = l(v), E = T >= 0 ? r.containerGroups[T] : void 0;
      if (T < 0)
        b.shiftKey ? S = r.tabbableGroups[r.tabbableGroups.length - 1].lastTabbableNode : S = r.tabbableGroups[0].firstTabbableNode;
      else if (b.shiftKey) {
        var A = un(r.tabbableGroups, function(M) {
          var R = M.firstTabbableNode;
          return v === R;
        });
        if (A < 0 && (E.container === v || ve(v, s.tabbableOptions) && !fe(v, s.tabbableOptions) && !E.nextTabbableNode(v, !1)) && (A = T), A >= 0) {
          var N = A === 0 ? r.tabbableGroups.length - 1 : A - 1, L = r.tabbableGroups[N];
          S = L.lastTabbableNode;
        }
      } else {
        var O = un(r.tabbableGroups, function(M) {
          var R = M.lastTabbableNode;
          return v === R;
        });
        if (O < 0 && (E.container === v || ve(v, s.tabbableOptions) && !fe(v, s.tabbableOptions) && !E.nextTabbableNode(v)) && (O = T), O >= 0) {
          var V = O === r.tabbableGroups.length - 1 ? 0 : O + 1, z = r.tabbableGroups[V];
          S = z.firstTabbableNode;
        }
      }
    } else
      S = c("fallbackFocus");
    S && (b.preventDefault(), p(S));
  }, m = function(b) {
    if (il(b) && Wt(s.escapeDeactivates, b) !== !1) {
      b.preventDefault(), o.deactivate();
      return;
    }
    if (nl(b)) {
      h(b);
      return;
    }
  }, f = function(b) {
    var v = pe(b);
    l(v) >= 0 || Wt(s.clickOutsideDeactivates, b) || Wt(s.allowOutsideClick, b) || (b.preventDefault(), b.stopImmediatePropagation());
  }, x = function() {
    if (r.active)
      return ln.activateTrap(o), r.delayInitialFocusTimer = s.delayInitialFocus ? cn(function() {
        p(u());
      }) : p(u()), n.addEventListener("focusin", y, !0), n.addEventListener("mousedown", w, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", w, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", f, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", m, {
        capture: !0,
        passive: !1
      }), o;
  }, _ = function() {
    if (r.active)
      return n.removeEventListener("focusin", y, !0), n.removeEventListener("mousedown", w, !0), n.removeEventListener("touchstart", w, !0), n.removeEventListener("click", f, !0), n.removeEventListener("keydown", m, !0), o;
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
      var v = a(b, "onActivate"), S = a(b, "onPostActivate"), T = a(b, "checkCanFocusTrap");
      T || d(), r.active = !0, r.paused = !1, r.nodeFocusedBeforeActivation = n.activeElement, v && v();
      var E = function() {
        T && d(), x(), S && S();
      };
      return T ? (T(r.containers.concat()).then(E, E), this) : (E(), this);
    },
    deactivate: function(b) {
      if (!r.active)
        return this;
      var v = an({
        onDeactivate: s.onDeactivate,
        onPostDeactivate: s.onPostDeactivate,
        checkCanReturnFocus: s.checkCanReturnFocus
      }, b);
      clearTimeout(r.delayInitialFocusTimer), r.delayInitialFocusTimer = void 0, _(), r.active = !1, r.paused = !1, ln.deactivateTrap(o);
      var S = a(v, "onDeactivate"), T = a(v, "onPostDeactivate"), E = a(v, "checkCanReturnFocus"), A = a(v, "returnFocus", "returnFocusOnDeactivate");
      S && S();
      var N = function() {
        cn(function() {
          A && p(g(r.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return A && E ? (E(g(r.nodeFocusedBeforeActivation)).then(N, N), this) : (N(), this);
    },
    pause: function() {
      return r.paused || !r.active ? this : (r.paused = !0, _(), this);
    },
    unpause: function() {
      return !r.paused || !r.active ? this : (r.paused = !1, d(), x(), this);
    },
    updateContainerElements: function(b) {
      var v = [].concat(b).filter(Boolean);
      return r.containers = v.map(function(S) {
        return typeof S == "string" ? n.querySelector(S) : S;
      }), r.active && d(), this;
    }
  }, o.updateContainerElements(t), o;
};
function rl(e) {
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
        return ve(r);
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
        return Array.isArray(s) ? s : Ks(s, { displayCheck: "none" });
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
      }, p = () => {
      };
      if (r.includes("noautofocus"))
        d.initialFocus = !1;
      else {
        let h = n.querySelector("[autofocus]");
        h && (d.initialFocus = h);
      }
      r.includes("inert") && (d.onPostActivate = () => {
        e.nextTick(() => {
          p = dn(n);
        });
      });
      let g = sl(n, d), w = () => {
      };
      const y = () => {
        p(), p = () => {
        }, w(), w = () => {
        }, g.deactivate({
          returnFocus: !r.includes("noreturn")
        });
      };
      o(() => c((h) => {
        u !== h && (h && !u && (r.includes("noscroll") && (w = ol()), setTimeout(() => {
          g.activate();
        }, 15)), !h && u && y(), u = !!h);
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
  return Js(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Js(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? Js(e.parentNode, t) : t(i);
  });
}
function ol() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var al = rl;
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
function ll() {
  return !0;
}
function cl({ component: e, argument: t }) {
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
function ul() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function dl({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const i = window.matchMedia(`(${e})`);
    i.matches ? t() : i.addEventListener("change", t, { once: !0 });
  });
}
function hl({ component: e, argument: t }) {
  return new Promise((i) => {
    const n = t || "0px 0px 0px 0px", s = new IntersectionObserver((r) => {
      r[0].isIntersecting && (s.disconnect(), i());
    }, { rootMargin: n });
    s.observe(e.el);
  });
}
var hn = {
  eager: ll,
  event: cl,
  idle: ul,
  media: dl,
  visible: hl
};
async function fl(e) {
  const t = pl(e.strategy);
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
  return hn[t.method] ? hn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function pl(e) {
  const t = ml(e);
  let i = Xs(t);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function ml(e) {
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
function Xs(e) {
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
    const t = Xs(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function gl(e) {
  const t = "load", i = e.prefixed("load-src"), n = e.prefixed("ignore");
  let s = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, r = !1, o = {}, a = 0;
  function l() {
    return a++;
  }
  e.asyncOptions = (f) => {
    s = {
      ...s,
      ...f
    };
  }, e.asyncData = (f, x = !1) => {
    o[f] = {
      loaded: !1,
      download: x
    };
  }, e.asyncUrl = (f, x) => {
    !f || !x || o[f] || (o[f] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        m(x)
      )
    });
  }, e.asyncAlias = (f) => {
    r = f;
  };
  const c = (f) => {
    e.skipDuringClone(() => {
      f._x_async || (f._x_async = "init", f._x_ignore = !0, f.setAttribute(n, ""));
    })();
  }, u = async (f) => {
    e.skipDuringClone(async () => {
      if (f._x_async !== "init") return;
      f._x_async = "await";
      const { name: x, strategy: _ } = d(f);
      await fl({
        name: x,
        strategy: _,
        el: f,
        id: f.id || l()
      }), f.isConnected && (await p(x), f.isConnected && (w(f), f._x_async = "loaded"));
    })();
  };
  u.inline = c, e.directive(t, u).before("ignore");
  function d(f) {
    const x = h(f.getAttribute(e.prefixed("data"))), _ = f.getAttribute(e.prefixed(t)) || s.defaultStrategy, I = f.getAttribute(i);
    return I && e.asyncUrl(x, I), {
      name: x,
      strategy: _
    };
  }
  async function p(f) {
    if (f.startsWith("_x_async_") || (y(f), !o[f] || o[f].loaded)) return;
    const x = await g(f);
    e.data(f, x), o[f].loaded = !0;
  }
  async function g(f) {
    if (!o[f]) return;
    const x = await o[f].download(f);
    return typeof x == "function" ? x : x[f] || x.default || Object.values(x)[0] || !1;
  }
  function w(f) {
    e.destroyTree(f), f._x_ignore = !1, f.removeAttribute(n), !f.closest(`[${n}]`) && e.initTree(f);
  }
  function y(f) {
    if (!(!r || o[f])) {
      if (typeof r == "function") {
        e.asyncData(f, r);
        return;
      }
      e.asyncUrl(f, r.replaceAll("[name]", f));
    }
  }
  function h(f) {
    return (f || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function m(f) {
    return s.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(f) ? f : new URL(f, document.baseURI).href;
  }
}
function bl(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function yl(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function vl(e, t, i) {
  return t && yl(e.prototype, t), e;
}
var wl = Object.defineProperty, Q = function(e, t) {
  return wl(e, "name", { value: t, configurable: !0 });
}, xl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, _l = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, Il = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Sl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, El = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Tl = Q(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), jt = Q(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), C = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, it = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, pn = { OUTLINE: "outline", FILLED: "filled" }, je = { FADE: "fade", SLIDE: "slide" }, qt = { CLOSE: jt(xl), SUCCESS: jt(Sl), ERROR: jt(_l), WARNING: jt(El), INFO: jt(Il) }, mn = Q(function(e) {
  e.wrapper.classList.add(C.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), gn = Q(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), Cl = Q(function(e) {
  e.wrapper.classList.add(C.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(C.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), $l = Q(function(e) {
  e.wrapper.classList.remove(C.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Gs = (function() {
  function e(t) {
    var i = this;
    bl(this, e), this.notifyOut = Q(function(M) {
      M(i);
    }, "notifyOut");
    var n = t.notificationsGap, s = n === void 0 ? 20 : n, r = t.notificationsPadding, o = r === void 0 ? 20 : r, a = t.status, l = a === void 0 ? "success" : a, c = t.effect, u = c === void 0 ? je.FADE : c, d = t.type, p = d === void 0 ? "outline" : d, g = t.title, w = t.text, y = t.showIcon, h = y === void 0 ? !0 : y, m = t.customIcon, f = m === void 0 ? "" : m, x = t.customClass, _ = x === void 0 ? "" : x, I = t.speed, b = I === void 0 ? 500 : I, v = t.showCloseButton, S = v === void 0 ? !0 : v, T = t.autoclose, E = T === void 0 ? !0 : T, A = t.autotimeout, N = A === void 0 ? 3e3 : A, L = t.position, O = L === void 0 ? "right top" : L, V = t.customWrapper, z = V === void 0 ? "" : V;
    if (this.customWrapper = z, this.status = l, this.title = g, this.text = w, this.showIcon = h, this.customIcon = f, this.customClass = _, this.speed = b, this.effect = u, this.showCloseButton = S, this.autoclose = E, this.autotimeout = N, this.notificationsGap = s, this.notificationsPadding = o, this.type = p, this.position = O, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return vl(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(C.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(C.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](C.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](C.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](C.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](C.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](C.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](C.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](C.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(C.NOTIFY_CLOSE), n.innerHTML = qt.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = Tl(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(C.NOTIFY), this.type) {
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
    var n, s;
    this.title && (n = document.createElement("div"), n.classList.add(C.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (s = document.createElement("div"), s.classList.add(C.NOTIFY_TEXT), s.innerHTML = this.text.trim(), this.title || (s.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(s);
  } }, { key: "setIcon", value: function() {
    var i = Q(function(s) {
      switch (s) {
        case it.SUCCESS:
          return qt.SUCCESS;
        case it.ERROR:
          return qt.ERROR;
        case it.WARNING:
          return qt.WARNING;
        case it.INFO:
          return qt.INFO;
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
      case je.FADE:
        this.selectedNotifyInEffect = mn, this.selectedNotifyOutEffect = gn;
        break;
      case je.SLIDE:
        this.selectedNotifyInEffect = Cl, this.selectedNotifyOutEffect = $l;
        break;
      default:
        this.selectedNotifyInEffect = mn, this.selectedNotifyOutEffect = gn;
    }
  } }]), e;
})();
Q(Gs, "Notify");
var Zs = Gs;
globalThis.Notify = Zs;
const Qs = ["success", "error", "warning", "info"], tr = [
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
], er = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function Ut(e = {}) {
  const t = {
    ...er,
    ...e
  };
  Qs.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), tr.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new Zs(t);
}
const Al = {
  custom: Ut,
  success(e, t = "Success", i = {}) {
    Ut({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    Ut({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    Ut({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    Ut({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(er, e);
  },
  get allowedStatuses() {
    return [...Qs];
  },
  get allowedPositions() {
    return [...tr];
  }
}, ui = function() {
}, te = {}, Ee = {}, ee = {};
function Ol(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, s = n, r, o, a, l;
  for (r = function(c, u) {
    u.length && i.push(c), s--, s || t(i);
  }; n--; ) {
    if (o = e[n], a = Ee[o], a) {
      r(o, a);
      continue;
    }
    l = ee[o] = ee[o] || [], l.push(r);
  }
}
function ir(e, t) {
  if (!e) return;
  const i = ee[e];
  if (Ee[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function di(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || ui)(t) : (e.success || ui)(e);
}
function kl(e, t, i, n, s, r, o, a) {
  let l = e.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (c) {
      c.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (r += 1, r < o)
      return nr(t, n, s, r);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function nr(e, t, i, n) {
  const s = document, r = i.async, o = (i.numRetries || 0) + 1, a = i.before || ui, l = e.replace(/[\?|#].*$/, ""), c = e.replace(/^(css|img|module|nomodule)!/, "");
  let u, d, p;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    p = s.createElement("link"), p.rel = "stylesheet", p.href = c, u = "hideFocus" in p, u && p.relList && (u = 0, p.rel = "preload", p.as = "style"), i.inlineStyleNonce && p.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    p = s.createElement("img"), p.src = c;
  else if (p = s.createElement("script"), p.src = c, p.async = r === void 0 ? !0 : r, i.inlineScriptNonce && p.setAttribute("nonce", i.inlineScriptNonce), d = "noModule" in p, /^module!/.test(l)) {
    if (!d) return t(e, "l");
    p.type = "module";
  } else if (/^nomodule!/.test(l) && d)
    return t(e, "l");
  const g = function(w) {
    kl(w, e, p, t, i, n, o, u);
  };
  p.addEventListener("load", g, { once: !0 }), p.addEventListener("error", g, { once: !0 }), a(e, p) !== !1 && s.head.appendChild(p);
}
function Dl(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, s = [];
  function r(o, a, l) {
    if (a === "e" && s.push(o), a === "b")
      if (l) s.push(o);
      else return;
    n--, n || t(s);
  }
  for (let o = 0; o < e.length; o++)
    nr(e[o], r, i);
}
function st(e, t, i) {
  let n, s;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), s = (n ? i : t) || {}, n) {
    if (n in te)
      throw "LoadJS";
    te[n] = !0;
  }
  function r(o, a) {
    Dl(e, function(l) {
      di(s, l), o && di({ success: o, error: a }, l), ir(n, l);
    }, s);
  }
  if (s.returnPromise)
    return new Promise(r);
  r();
}
st.ready = function(t, i) {
  return Ol(t, function(n) {
    di(i, n);
  }), st;
};
st.done = function(t) {
  ir(t, []);
};
st.reset = function() {
  Object.keys(te).forEach((t) => delete te[t]), Object.keys(Ee).forEach((t) => delete Ee[t]), Object.keys(ee).forEach((t) => delete ee[t]);
};
st.isDefined = function(t) {
  return t in te;
};
function Nl(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = Ll(e) || e;
    let i = Alpine.$data(t);
    if (i === void 0) {
      const n = t.closest?.("[x-data]");
      n && (i = Alpine.$data(n));
    }
    return i === void 0 && bn("element", t), i;
  }
  if (typeof e == "string") {
    const t = e.trim();
    if (!t) {
      console.warn("Rizzy.$data: Invalid componentId provided (empty string).");
      return;
    }
    const i = `[data-alpine-root="${rr(t)}"]`;
    let n = null;
    const s = document.getElementById(t);
    if (s && (n = s.matches(i) ? s : s.querySelector(i)), n || (n = sr(t)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const r = Alpine.$data(n);
    return r === void 0 && bn(`data-alpine-root="${t}"`, n), r;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function Ll(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", i = e.getAttribute?.("data-for");
  if (t || i) {
    const n = i || "";
    if (!n) return e;
    const s = sr(n);
    return s || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return e;
}
function sr(e) {
  const t = `[data-alpine-root="${rr(e)}"]`, i = document.querySelectorAll(t);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(e) || null;
}
function rr(e) {
  try {
    if (window.CSS && typeof window.CSS.escape == "function")
      return window.CSS.escape(e);
  } catch {
  }
  return String(e).replace(/"/g, '\\"');
}
function bn(e, t) {
  const i = `${t.tagName?.toLowerCase?.() || "node"}${t.id ? "#" + t.id : ""}${t.classList?.length ? "." + Array.from(t.classList).join(".") : ""}`;
  console.warn(
    `Rizzy.$data: Located target via ${e} (${i}), but Alpine.$data returned undefined. Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
  );
}
function Ml(e) {
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
function Rl(e) {
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
function Pl(e) {
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
function Fl(e) {
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
function zl(e) {
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
function Bl(e, t) {
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
function Vl(e) {
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
function Hl(e, t) {
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
function Wl(e, t) {
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
function jl(e) {
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
function ql(e, t) {
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
function Ul(e, t) {
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
function Yl(e) {
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
function Kl(e, t) {
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
function Jl(e) {
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
const Dt = Math.min, mt = Math.max, Te = Math.round, me = Math.floor, K = (e) => ({
  x: e,
  y: e
}), Xl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Gl = {
  start: "end",
  end: "start"
};
function hi(e, t, i) {
  return mt(e, Dt(t, i));
}
function se(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function xt(e) {
  return e.split("-")[0];
}
function re(e) {
  return e.split("-")[1];
}
function or(e) {
  return e === "x" ? "y" : "x";
}
function Fi(e) {
  return e === "y" ? "height" : "width";
}
const Zl = /* @__PURE__ */ new Set(["top", "bottom"]);
function nt(e) {
  return Zl.has(xt(e)) ? "y" : "x";
}
function zi(e) {
  return or(nt(e));
}
function Ql(e, t, i) {
  i === void 0 && (i = !1);
  const n = re(e), s = zi(e), r = Fi(s);
  let o = s === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[r] > t.floating[r] && (o = Ce(o)), [o, Ce(o)];
}
function tc(e) {
  const t = Ce(e);
  return [fi(e), t, fi(t)];
}
function fi(e) {
  return e.replace(/start|end/g, (t) => Gl[t]);
}
const yn = ["left", "right"], vn = ["right", "left"], ec = ["top", "bottom"], ic = ["bottom", "top"];
function nc(e, t, i) {
  switch (e) {
    case "top":
    case "bottom":
      return i ? t ? vn : yn : t ? yn : vn;
    case "left":
    case "right":
      return t ? ec : ic;
    default:
      return [];
  }
}
function sc(e, t, i, n) {
  const s = re(e);
  let r = nc(xt(e), i === "start", n);
  return s && (r = r.map((o) => o + "-" + s), t && (r = r.concat(r.map(fi)))), r;
}
function Ce(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Xl[t]);
}
function rc(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function ar(e) {
  return typeof e != "number" ? rc(e) : {
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
function wn(e, t, i) {
  let {
    reference: n,
    floating: s
  } = e;
  const r = nt(t), o = zi(t), a = Fi(o), l = xt(t), c = r === "y", u = n.x + n.width / 2 - s.width / 2, d = n.y + n.height / 2 - s.height / 2, p = n[a] / 2 - s[a] / 2;
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
  switch (re(t)) {
    case "start":
      g[o] -= p * (i && c ? -1 : 1);
      break;
    case "end":
      g[o] += p * (i && c ? -1 : 1);
      break;
  }
  return g;
}
async function oc(e, t) {
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
    altBoundary: p = !1,
    padding: g = 0
  } = se(t, e), w = ar(g), h = a[p ? d === "floating" ? "reference" : "floating" : d], m = $e(await r.getClippingRect({
    element: (i = await (r.isElement == null ? void 0 : r.isElement(h))) == null || i ? h : h.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), f = d === "floating" ? {
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
    rect: f,
    offsetParent: x,
    strategy: l
  }) : f);
  return {
    top: (m.top - I.top + w.top) / _.y,
    bottom: (I.bottom - m.bottom + w.bottom) / _.y,
    left: (m.left - I.left + w.left) / _.x,
    right: (I.right - m.right + w.right) / _.x
  };
}
const ac = async (e, t, i) => {
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
  } = wn(c, n, l), p = n, g = {}, w = 0;
  for (let h = 0; h < a.length; h++) {
    var y;
    const {
      name: m,
      fn: f
    } = a[h], {
      x,
      y: _,
      data: I,
      reset: b
    } = await f({
      x: u,
      y: d,
      initialPlacement: n,
      placement: p,
      strategy: s,
      middlewareData: g,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (y = o.detectOverflow) != null ? y : oc
      },
      elements: {
        reference: e,
        floating: t
      }
    });
    u = x ?? u, d = _ ?? d, g = {
      ...g,
      [m]: {
        ...g[m],
        ...I
      }
    }, b && w <= 50 && (w++, typeof b == "object" && (b.placement && (p = b.placement), b.rects && (c = b.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: s
    }) : b.rects), {
      x: u,
      y: d
    } = wn(c, p, l)), h = -1);
  }
  return {
    x: u,
    y: d,
    placement: p,
    strategy: s,
    middlewareData: g
  };
}, lc = (e) => ({
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
    } = se(e, t) || {};
    if (c == null)
      return {};
    const d = ar(u), p = {
      x: i,
      y: n
    }, g = zi(s), w = Fi(g), y = await o.getDimensions(c), h = g === "y", m = h ? "top" : "left", f = h ? "bottom" : "right", x = h ? "clientHeight" : "clientWidth", _ = r.reference[w] + r.reference[g] - p[g] - r.floating[w], I = p[g] - r.reference[g], b = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let v = b ? b[x] : 0;
    (!v || !await (o.isElement == null ? void 0 : o.isElement(b))) && (v = a.floating[x] || r.floating[w]);
    const S = _ / 2 - I / 2, T = v / 2 - y[w] / 2 - 1, E = Dt(d[m], T), A = Dt(d[f], T), N = E, L = v - y[w] - A, O = v / 2 - y[w] / 2 + S, V = hi(N, O, L), z = !l.arrow && re(s) != null && O !== V && r.reference[w] / 2 - (O < N ? E : A) - y[w] / 2 < 0, M = z ? O < N ? O - N : O - L : 0;
    return {
      [g]: p[g] + M,
      data: {
        [g]: V,
        centerOffset: O - V - M,
        ...z && {
          alignmentOffset: M
        }
      },
      reset: z
    };
  }
}), cc = function(e) {
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
        fallbackPlacements: p,
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: w = "none",
        flipAlignment: y = !0,
        ...h
      } = se(e, t);
      if ((i = r.arrow) != null && i.alignmentOffset)
        return {};
      const m = xt(s), f = nt(a), x = xt(a) === a, _ = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), I = p || (x || !y ? [Ce(a)] : tc(a)), b = w !== "none";
      !p && b && I.push(...sc(a, y, w, _));
      const v = [a, ...I], S = await l.detectOverflow(t, h), T = [];
      let E = ((n = r.flip) == null ? void 0 : n.overflows) || [];
      if (u && T.push(S[m]), d) {
        const O = Ql(s, o, _);
        T.push(S[O[0]], S[O[1]]);
      }
      if (E = [...E, {
        placement: s,
        overflows: T
      }], !T.every((O) => O <= 0)) {
        var A, N;
        const O = (((A = r.flip) == null ? void 0 : A.index) || 0) + 1, V = v[O];
        if (V && (!(d === "alignment" ? f !== nt(V) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        E.every((R) => nt(R.placement) === f ? R.overflows[0] > 0 : !0)))
          return {
            data: {
              index: O,
              overflows: E
            },
            reset: {
              placement: V
            }
          };
        let z = (N = E.filter((M) => M.overflows[0] <= 0).sort((M, R) => M.overflows[1] - R.overflows[1])[0]) == null ? void 0 : N.placement;
        if (!z)
          switch (g) {
            case "bestFit": {
              var L;
              const M = (L = E.filter((R) => {
                if (b) {
                  const tt = nt(R.placement);
                  return tt === f || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  tt === "y";
                }
                return !0;
              }).map((R) => [R.placement, R.overflows.filter((tt) => tt > 0).reduce((tt, gr) => tt + gr, 0)]).sort((R, tt) => R[1] - tt[1])[0]) == null ? void 0 : L[0];
              M && (z = M);
              break;
            }
            case "initialPlacement":
              z = a;
              break;
          }
        if (s !== z)
          return {
            reset: {
              placement: z
            }
          };
      }
      return {};
    }
  };
}, uc = /* @__PURE__ */ new Set(["left", "top"]);
async function dc(e, t) {
  const {
    placement: i,
    platform: n,
    elements: s
  } = e, r = await (n.isRTL == null ? void 0 : n.isRTL(s.floating)), o = xt(i), a = re(i), l = nt(i) === "y", c = uc.has(o) ? -1 : 1, u = r && l ? -1 : 1, d = se(t, e);
  let {
    mainAxis: p,
    crossAxis: g,
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
  return a && typeof w == "number" && (g = a === "end" ? w * -1 : w), l ? {
    x: g * u,
    y: p * c
  } : {
    x: p * c,
    y: g * u
  };
}
const hc = function(e) {
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
      } = t, l = await dc(t, e);
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
}, fc = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: i,
        y: n,
        placement: s,
        platform: r
      } = t, {
        mainAxis: o = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (m) => {
            let {
              x: f,
              y: x
            } = m;
            return {
              x: f,
              y: x
            };
          }
        },
        ...c
      } = se(e, t), u = {
        x: i,
        y: n
      }, d = await r.detectOverflow(t, c), p = nt(xt(s)), g = or(p);
      let w = u[g], y = u[p];
      if (o) {
        const m = g === "y" ? "top" : "left", f = g === "y" ? "bottom" : "right", x = w + d[m], _ = w - d[f];
        w = hi(x, w, _);
      }
      if (a) {
        const m = p === "y" ? "top" : "left", f = p === "y" ? "bottom" : "right", x = y + d[m], _ = y - d[f];
        y = hi(x, y, _);
      }
      const h = l.fn({
        ...t,
        [g]: w,
        [p]: y
      });
      return {
        ...h,
        data: {
          x: h.x - i,
          y: h.y - n,
          enabled: {
            [g]: o,
            [p]: a
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
  return lr(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function B(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function X(e) {
  var t;
  return (t = (lr(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function lr(e) {
  return Re() ? e instanceof Node || e instanceof B(e).Node : !1;
}
function j(e) {
  return Re() ? e instanceof Element || e instanceof B(e).Element : !1;
}
function J(e) {
  return Re() ? e instanceof HTMLElement || e instanceof B(e).HTMLElement : !1;
}
function xn(e) {
  return !Re() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof B(e).ShadowRoot;
}
const pc = /* @__PURE__ */ new Set(["inline", "contents"]);
function oe(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: s
  } = q(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !pc.has(s);
}
const mc = /* @__PURE__ */ new Set(["table", "td", "th"]);
function gc(e) {
  return mc.has(zt(e));
}
const bc = [":popover-open", ":modal"];
function Pe(e) {
  return bc.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const yc = ["transform", "translate", "scale", "rotate", "perspective"], vc = ["transform", "translate", "scale", "rotate", "perspective", "filter"], wc = ["paint", "layout", "strict", "content"];
function Bi(e) {
  const t = Vi(), i = j(e) ? q(e) : e;
  return yc.some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || vc.some((n) => (i.willChange || "").includes(n)) || wc.some((n) => (i.contain || "").includes(n));
}
function xc(e) {
  let t = at(e);
  for (; J(t) && !Nt(t); ) {
    if (Bi(t))
      return t;
    if (Pe(t))
      return null;
    t = at(t);
  }
  return null;
}
function Vi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const _c = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Nt(e) {
  return _c.has(zt(e));
}
function q(e) {
  return B(e).getComputedStyle(e);
}
function Fe(e) {
  return j(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function at(e) {
  if (zt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    xn(e) && e.host || // Fallback.
    X(e)
  );
  return xn(t) ? t.host : t;
}
function cr(e) {
  const t = at(e);
  return Nt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : J(t) && oe(t) ? t : cr(t);
}
function ie(e, t, i) {
  var n;
  t === void 0 && (t = []), i === void 0 && (i = !0);
  const s = cr(e), r = s === ((n = e.ownerDocument) == null ? void 0 : n.body), o = B(s);
  if (r) {
    const a = pi(o);
    return t.concat(o, o.visualViewport || [], oe(s) ? s : [], a && i ? ie(a) : []);
  }
  return t.concat(s, ie(s, [], i));
}
function pi(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function ur(e) {
  const t = q(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const s = J(e), r = s ? e.offsetWidth : i, o = s ? e.offsetHeight : n, a = Te(i) !== r || Te(n) !== o;
  return a && (i = r, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Hi(e) {
  return j(e) ? e : e.contextElement;
}
function Ot(e) {
  const t = Hi(e);
  if (!J(t))
    return K(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: s,
    $: r
  } = ur(t);
  let o = (r ? Te(i.width) : i.width) / n, a = (r ? Te(i.height) : i.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Ic = /* @__PURE__ */ K(0);
function dr(e) {
  const t = B(e);
  return !Vi() || !t.visualViewport ? Ic : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Sc(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== B(e) ? !1 : t;
}
function _t(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const s = e.getBoundingClientRect(), r = Hi(e);
  let o = K(1);
  t && (n ? j(n) && (o = Ot(n)) : o = Ot(e));
  const a = Sc(r, i, n) ? dr(r) : K(0);
  let l = (s.left + a.x) / o.x, c = (s.top + a.y) / o.y, u = s.width / o.x, d = s.height / o.y;
  if (r) {
    const p = B(r), g = n && j(n) ? B(n) : n;
    let w = p, y = pi(w);
    for (; y && n && g !== w; ) {
      const h = Ot(y), m = y.getBoundingClientRect(), f = q(y), x = m.left + (y.clientLeft + parseFloat(f.paddingLeft)) * h.x, _ = m.top + (y.clientTop + parseFloat(f.paddingTop)) * h.y;
      l *= h.x, c *= h.y, u *= h.x, d *= h.y, l += x, c += _, w = B(y), y = pi(w);
    }
  }
  return $e({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function ze(e, t) {
  const i = Fe(e).scrollLeft;
  return t ? t.left + i : _t(X(e)).left + i;
}
function hr(e, t) {
  const i = e.getBoundingClientRect(), n = i.left + t.scrollLeft - ze(e, i), s = i.top + t.scrollTop;
  return {
    x: n,
    y: s
  };
}
function Ec(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: s
  } = e;
  const r = s === "fixed", o = X(n), a = t ? Pe(t.floating) : !1;
  if (n === o || a && r)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = K(1);
  const u = K(0), d = J(n);
  if ((d || !d && !r) && ((zt(n) !== "body" || oe(o)) && (l = Fe(n)), J(n))) {
    const g = _t(n);
    c = Ot(n), u.x = g.x + n.clientLeft, u.y = g.y + n.clientTop;
  }
  const p = o && !d && !r ? hr(o, l) : K(0);
  return {
    width: i.width * c.x,
    height: i.height * c.y,
    x: i.x * c.x - l.scrollLeft * c.x + u.x + p.x,
    y: i.y * c.y - l.scrollTop * c.y + u.y + p.y
  };
}
function Tc(e) {
  return Array.from(e.getClientRects());
}
function Cc(e) {
  const t = X(e), i = Fe(e), n = e.ownerDocument.body, s = mt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), r = mt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + ze(e);
  const a = -i.scrollTop;
  return q(n).direction === "rtl" && (o += mt(t.clientWidth, n.clientWidth) - s), {
    width: s,
    height: r,
    x: o,
    y: a
  };
}
const _n = 25;
function $c(e, t) {
  const i = B(e), n = X(e), s = i.visualViewport;
  let r = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, o = s.height;
    const u = Vi();
    (!u || u && t === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  const c = ze(n);
  if (c <= 0) {
    const u = n.ownerDocument, d = u.body, p = getComputedStyle(d), g = u.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, w = Math.abs(n.clientWidth - d.clientWidth - g);
    w <= _n && (r -= w);
  } else c <= _n && (r += c);
  return {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
const Ac = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Oc(e, t) {
  const i = _t(e, !0, t === "fixed"), n = i.top + e.clientTop, s = i.left + e.clientLeft, r = J(e) ? Ot(e) : K(1), o = e.clientWidth * r.x, a = e.clientHeight * r.y, l = s * r.x, c = n * r.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function In(e, t, i) {
  let n;
  if (t === "viewport")
    n = $c(e, i);
  else if (t === "document")
    n = Cc(X(e));
  else if (j(t))
    n = Oc(t, i);
  else {
    const s = dr(e);
    n = {
      x: t.x - s.x,
      y: t.y - s.y,
      width: t.width,
      height: t.height
    };
  }
  return $e(n);
}
function fr(e, t) {
  const i = at(e);
  return i === t || !j(i) || Nt(i) ? !1 : q(i).position === "fixed" || fr(i, t);
}
function kc(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = ie(e, [], !1).filter((a) => j(a) && zt(a) !== "body"), s = null;
  const r = q(e).position === "fixed";
  let o = r ? at(e) : e;
  for (; j(o) && !Nt(o); ) {
    const a = q(o), l = Bi(o);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && Ac.has(s.position) || oe(o) && !l && fr(e, o)) ? n = n.filter((u) => u !== o) : s = a, o = at(o);
  }
  return t.set(e, n), n;
}
function Dc(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: s
  } = e;
  const o = [...i === "clippingAncestors" ? Pe(t) ? [] : kc(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((c, u) => {
    const d = In(t, u, s);
    return c.top = mt(d.top, c.top), c.right = Dt(d.right, c.right), c.bottom = Dt(d.bottom, c.bottom), c.left = mt(d.left, c.left), c;
  }, In(t, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Nc(e) {
  const {
    width: t,
    height: i
  } = ur(e);
  return {
    width: t,
    height: i
  };
}
function Lc(e, t, i) {
  const n = J(t), s = X(t), r = i === "fixed", o = _t(e, !0, r, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = K(0);
  function c() {
    l.x = ze(s);
  }
  if (n || !n && !r)
    if ((zt(t) !== "body" || oe(s)) && (a = Fe(t)), n) {
      const g = _t(t, !0, r, t);
      l.x = g.x + t.clientLeft, l.y = g.y + t.clientTop;
    } else s && c();
  r && !n && s && c();
  const u = s && !n && !r ? hr(s, a) : K(0), d = o.left + a.scrollLeft - l.x - u.x, p = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: p,
    width: o.width,
    height: o.height
  };
}
function qe(e) {
  return q(e).position === "static";
}
function Sn(e, t) {
  if (!J(e) || q(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return X(e) === i && (i = i.ownerDocument.body), i;
}
function pr(e, t) {
  const i = B(e);
  if (Pe(e))
    return i;
  if (!J(e)) {
    let s = at(e);
    for (; s && !Nt(s); ) {
      if (j(s) && !qe(s))
        return s;
      s = at(s);
    }
    return i;
  }
  let n = Sn(e, t);
  for (; n && gc(n) && qe(n); )
    n = Sn(n, t);
  return n && Nt(n) && qe(n) && !Bi(n) ? i : n || xc(e) || i;
}
const Mc = async function(e) {
  const t = this.getOffsetParent || pr, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: Lc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function Rc(e) {
  return q(e).direction === "rtl";
}
const Pc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ec,
  getDocumentElement: X,
  getClippingRect: Dc,
  getOffsetParent: pr,
  getElementRects: Mc,
  getClientRects: Tc,
  getDimensions: Nc,
  getScale: Ot,
  isElement: j,
  isRTL: Rc
};
function mr(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Fc(e, t) {
  let i = null, n;
  const s = X(e);
  function r() {
    var a;
    clearTimeout(n), (a = i) == null || a.disconnect(), i = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), r();
    const c = e.getBoundingClientRect(), {
      left: u,
      top: d,
      width: p,
      height: g
    } = c;
    if (a || t(), !p || !g)
      return;
    const w = me(d), y = me(s.clientWidth - (u + p)), h = me(s.clientHeight - (d + g)), m = me(u), x = {
      rootMargin: -w + "px " + -y + "px " + -h + "px " + -m + "px",
      threshold: mt(0, Dt(1, l)) || 1
    };
    let _ = !0;
    function I(b) {
      const v = b[0].intersectionRatio;
      if (v !== l) {
        if (!_)
          return o();
        v ? o(!1, v) : n = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      v === 1 && !mr(c, e.getBoundingClientRect()) && o(), _ = !1;
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
function zc(e, t, i, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: r = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Hi(e), u = s || r ? [...c ? ie(c) : [], ...ie(t)] : [];
  u.forEach((m) => {
    s && m.addEventListener("scroll", i, {
      passive: !0
    }), r && m.addEventListener("resize", i);
  });
  const d = c && a ? Fc(c, i) : null;
  let p = -1, g = null;
  o && (g = new ResizeObserver((m) => {
    let [f] = m;
    f && f.target === c && g && (g.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var x;
      (x = g) == null || x.observe(t);
    })), i();
  }), c && !l && g.observe(c), g.observe(t));
  let w, y = l ? _t(e) : null;
  l && h();
  function h() {
    const m = _t(e);
    y && !mr(y, m) && i(), y = m, w = requestAnimationFrame(h);
  }
  return i(), () => {
    var m;
    u.forEach((f) => {
      s && f.removeEventListener("scroll", i), r && f.removeEventListener("resize", i);
    }), d?.(), (m = g) == null || m.disconnect(), g = null, l && cancelAnimationFrame(w);
  };
}
const It = hc, St = fc, Et = cc, Bc = lc, Tt = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), s = {
    platform: Pc,
    ...i
  }, r = {
    ...s.platform,
    _c: n
  };
  return ac(e, t, {
    ...s,
    platform: r
  });
};
function Vc(e) {
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
      !this.triggerEl || !this.contentEl || (this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`), Tt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [It(this.pixelOffset), Et(), St({ padding: 8 })]
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
      !this.triggerEl || !t || Tt(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [It(this.pixelOffset), Et(), St({ padding: 8 })]
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
function Hc(e) {
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
function Wc(e) {
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
const En = 160;
function jc(e) {
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
      return t.length <= En ? t : `${t.slice(0, En - 1)}…`;
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
function qc(e) {
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
function Uc(e) {
  e.data("rzEmpty", () => {
  });
}
function Yc(e) {
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
function Kc(e) {
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
function Jc(e) {
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
function Xc(e) {
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
function Gc(e, t) {
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
function Zc(e) {
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
        !n || !i || Tt(i, n, {
          placement: "bottom-start",
          middleware: [It(4), Et(), St({ padding: 8 })]
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
        this.setTriggerState(s, a), r && (r.hidden = !a, r.style.display = a ? "" : "none", r.dataset.state = a ? "open" : "closed", a && s && Tt(s, r, {
          placement: "right-start",
          middleware: [It(4), Et(), St({ padding: 8 })]
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
function Qc(e, t) {
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
      !o || !a || (Tt(o, a, {
        placement: "bottom-start",
        middleware: [It(6), Et(), St({ padding: 8 })]
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
function tu(e) {
  e.data("rzPopover", () => ({
    open: !1,
    ariaExpanded: "false",
    triggerEl: null,
    contentEl: null,
    _documentClickHandler: null,
    _windowKeydownHandler: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.triggerEl = this.$refs.trigger, this.contentEl = this.$refs.content, this._documentClickHandler = (t) => this.handleDocumentClick(t), this._windowKeydownHandler = (t) => this.handleWindowKeydown(t), document.addEventListener("click", this._documentClickHandler), window.addEventListener("keydown", this._windowKeydownHandler), this.$watch("open", (t) => {
        this.ariaExpanded = t.toString(), t && this.$nextTick(() => this.updatePosition());
      });
    },
    destroy() {
      this._documentClickHandler && (document.removeEventListener("click", this._documentClickHandler), this._documentClickHandler = null), this._windowKeydownHandler && (window.removeEventListener("keydown", this._windowKeydownHandler), this._windowKeydownHandler = null);
    },
    /**
     * Executes the `updatePosition` operation.
     * @returns {any} Returns the result of `updatePosition` when applicable.
     */
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      const t = this.$el.dataset.anchor || "bottom", i = parseInt(this.$el.dataset.offset) || 0, n = parseInt(this.$el.dataset.crossAxisOffset) || 0, s = parseInt(this.$el.dataset.alignmentAxisOffset) || null, r = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = parseInt(this.$el.dataset.shiftPadding) || 8;
      let c = [];
      c.push(It({
        mainAxis: i,
        crossAxis: n,
        alignmentAxis: s
      })), o && c.push(Et()), a && c.push(St({ padding: l })), Tt(this.triggerEl, this.contentEl, {
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
    handleDocumentClick(t) {
      if (!this.open) return;
      const i = t.target, n = this.$el.contains(i), s = this.contentEl?.contains?.(i) ?? !1;
      n || s || (this.open = !1);
    },
    handleWindowKeydown(t) {
      t.key !== "Escape" || !this.open || (this.open = !1, this.$nextTick(() => this.triggerEl?.focus()));
    }
  }));
}
function eu(e) {
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
function iu(e) {
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
function nu(e) {
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
function su(e) {
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
function ru(e) {
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
function ou(e) {
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
function au(e) {
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
function lu(e) {
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
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = zc(this.triggerEl, this.contentEl, () => {
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
        It({
          mainAxis: this.mainOffset,
          crossAxis: this.crossAxisOffset,
          alignmentAxis: this.alignmentAxisOffset
        })
      ];
      this.enableFlip && t.push(Et()), this.enableShift && t.push(St({ padding: this.shiftPadding })), this.arrowEl && t.push(Bc({ element: this.arrowEl })), Tt(this.triggerEl, this.contentEl, {
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
function cu(e) {
  e.data("rzSidebar", () => ({
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
      const t = this.$el.dataset.defaultOpen === "true", i = this.cookieName ? document.cookie.split("; ").find((n) => n.startsWith(`${this.cookieName}=`))?.split("=")[1] : null;
      this.open = i != null ? i === "true" : t, this.checkIfMobile(), window.addEventListener("keydown", (n) => {
        (n.ctrlKey || n.metaKey) && n.key.toLowerCase() === this.shortcut.toLowerCase() && (n.preventDefault(), this.toggle());
      }), this.$watch("open", (n) => {
        this.cookieName && (document.cookie = `${this.cookieName}=${n}; path=/; max-age=604800`);
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
    setOpen(t) {
      this.open = t;
    },
    /**
     * Explicitly sets the open state for the mobile sidebar.
     * @param {boolean} value 
     */
    setOpenMobile(t) {
      this.openMobile = t;
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
function uu(e) {
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
function du(e) {
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
function hu(e) {
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
        const p = document.createElement("div");
        if (p.setAttribute("role", "group"), p.setAttribute("data-dynamic-item", "true"), p.setAttribute("data-slot", "command-group"), d) {
          const g = i.get(c);
          if (g?.templateContent) {
            const w = g.templateContent.cloneNode(!0);
            g.headingId && p.setAttribute("aria-labelledby", g.headingId), p.appendChild(w);
          }
        }
        u.forEach((g, w) => {
          const y = this.parent.filteredIndexById.get(g.id) ?? w, h = this.ensureRow(g);
          h && (this.applyItemAttributes(h, g, y), p.appendChild(h));
        }), s.appendChild(p), d && (l += 1);
      }), n.querySelectorAll("[data-dynamic-item]").forEach((c) => c.remove()), n.appendChild(s), window.htmx && window.htmx.process(n);
    }
  }));
}
function fu(e) {
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
function pu(e, t) {
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
async function mu(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function G(e, t, i) {
  let n, s;
  typeof t == "function" ? n = { success: t } : t && typeof t == "object" ? n = t : typeof t == "string" && (s = t), !s && typeof i == "string" && (s = i);
  const r = Array.isArray(e) ? e : [e];
  return mu(r).then((o) => (st.isDefined(o) || st(r, o, {
    // keep scripts ordered unless you explicitly change this later
    async: !1,
    // pass CSP nonce to both script and style tags as your loader expects
    inlineScriptNonce: s,
    inlineStyleNonce: s
  }), new Promise((a, l) => {
    st.ready(o, {
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
function gu(e) {
  Ml(e), Rl(e), Pl(e), Fl(e), zl(e), Bl(e, G), Vl(e), Hl(e, G), Wl(e, G), jl(e), ql(e, G), Ul(e, G), Yl(e), Kl(e, G), Jl(e), Vc(e), Hc(e), Wc(e), jc(e), qc(e), Uc(e), Yc(e), Kc(e), Jc(e), Xc(e), Gc(e, G), Zc(e), Qc(e), tu(e), eu(e), iu(e), nu(e), su(e), ru(e), ou(e), au(e), lu(e), cu(e), uu(e), du(e), hu(e), fu(e), pu(e, G);
}
function bu(e) {
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
const ge = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map();
let Tn = !1;
function yu(e) {
  return be.has(e) || be.set(
    e,
    import(e).catch((t) => {
      throw be.delete(e), t;
    })
  ), be.get(e);
}
function Cn(e, t) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    e,
    () => yu(t).catch((n) => (console.error(
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
function vu(e, t) {
  if (!e || !t) {
    console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
    return;
  }
  const i = ge.get(e);
  i && i.path !== t && console.warn(
    `[RizzyUI] Re-registering '${e}' with a different path.
  Previous: ${i.path}
  New:      ${t}`
  );
  const n = globalThis.Alpine;
  if (n && n.version) {
    const s = !i || i.path !== t;
    if (!(i && i.loaderSet && !s)) {
      const o = Cn(e, t);
      ge.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  ge.set(e, { path: t, loaderSet: !1 }), Tn || (Tn = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [s, r] of ge)
        if (!r.loaderSet) {
          const o = Cn(s, r.path);
          r.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function wu(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: s }) => {
    const r = i.find((m) => m.startsWith("bp-")), o = r ? parseInt(r.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, c = (m) => {
      t.dataset.mobile = m ? "true" : "false", t.dataset.screen = m ? "mobile" : "desktop";
    }, u = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, d = (m) => {
      if (!a) return;
      const f = u();
      f && (f[n] = m);
    }, p = (m) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: m, width: window.innerWidth, breakpoint: o }
        })
      );
    }, g = window.matchMedia(`(max-width: ${o - 1}px)`), w = () => {
      const m = l();
      c(m), d(m), p(m);
    };
    w();
    const y = () => w(), h = () => w();
    g.addEventListener("change", y), window.addEventListener("resize", h, { passive: !0 }), s(() => {
      g.removeEventListener("change", y), window.removeEventListener("resize", h);
    });
  });
}
function xu(e) {
  const t = (i, { expression: n, modifiers: s }, { cleanup: r, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (y, h, m) => {
      const x = h.replace(/\[(\d+)\]/g, ".$1").split("."), _ = x.pop();
      let I = y;
      for (const b of x)
        (I[b] == null || typeof I[b] != "object") && (I[b] = isFinite(+b) ? [] : {}), I = I[b];
      I[_] = m;
    }, l = e.closestDataStack(i) || [], c = l[0] || null, u = l[1] || null;
    if (!c || !u) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const d = n.split(",").map((y) => y.trim()).filter(Boolean).map((y) => {
      const h = y.split("->").map((m) => m.trim());
      return h.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', y), null) : { parentPath: h[0], childPath: h[1] };
    }).filter(Boolean), p = s.includes("init-child") || s.includes("child") || s.includes("childWins"), g = d.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: p
      // avoid redundant first child->parent write
    })), w = [];
    d.forEach((y, h) => {
      const m = g[h];
      if (p) {
        const _ = e.evaluate(i, y.childPath, { scope: c });
        m.fromChild = !0, a(u, y.parentPath, _), queueMicrotask(() => {
          m.fromChild = !1;
        });
      } else {
        const _ = e.evaluate(i, y.parentPath, { scope: u });
        m.fromParent = !0, a(c, y.childPath, _), queueMicrotask(() => {
          m.fromParent = !1;
        });
      }
      const f = o(() => {
        const _ = e.evaluate(i, y.parentPath, { scope: u });
        m.fromChild || (m.fromParent = !0, a(c, y.childPath, _), queueMicrotask(() => {
          m.fromParent = !1;
        }));
      }), x = o(() => {
        const _ = e.evaluate(i, y.childPath, { scope: c });
        if (!m.fromParent) {
          if (m.skipChildOnce) {
            m.skipChildOnce = !1;
            return;
          }
          m.fromChild = !0, a(u, y.parentPath, _), queueMicrotask(() => {
            m.fromChild = !1;
          });
        }
      });
      w.push(f, x);
    }), r(() => {
      for (const y of w)
        try {
          y && y();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class _u {
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
const F = new _u();
function Iu(e) {
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
let Yt = null;
function Su(e) {
  return Yt || (e.plugin(Ma), e.plugin(Ba), e.plugin(al), e.plugin(gl), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Iu(e);
  }), gu(e), wu(e), xu(e), Yt = {
    Alpine: e,
    require: G,
    toast: Al,
    $data: Nl,
    props: bu,
    registerAsyncComponent: vu,
    theme: F
  }, typeof window < "u" && (F.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...Yt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Yt);
}
const Eu = Su(Vs);
Vs.start();
export {
  Eu as default
};
