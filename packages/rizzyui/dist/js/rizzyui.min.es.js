var Ye = !1, Ke = !1, dt = [], Je = -1, gi = !1;
function xs(e) {
  _s(e);
}
function ws() {
  gi = !0;
}
function Is() {
  gi = !1, Dn();
}
function _s(e) {
  dt.includes(e) || dt.push(e), Dn();
}
function Ss(e) {
  let t = dt.indexOf(e);
  t !== -1 && t > Je && dt.splice(t, 1);
}
function Dn() {
  if (!Ke && !Ye) {
    if (gi)
      return;
    Ye = !0, queueMicrotask(Es);
  }
}
function Es() {
  Ye = !1, Ke = !0;
  for (let e = 0; e < dt.length; e++)
    dt[e](), Je = e;
  dt.length = 0, Je = -1, Ke = !1;
}
var Mt, Ct, Lt, On, Xe = !0;
function Ts(e) {
  Xe = !1, e(), Xe = !0;
}
function Cs(e) {
  Mt = e.reactive, Lt = e.release, Ct = (t) => e.effect(t, { scheduler: (i) => {
    Xe ? xs(i) : i();
  } }), On = e.raw;
}
function qi(e) {
  Ct = e;
}
function $s(e) {
  let t = () => {
  };
  return [(n) => {
    let r = Ct(n);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((s) => s());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), Lt(r));
    }, r;
  }, () => {
    t();
  }];
}
function kn(e, t) {
  let i = !0, n, r = Ct(() => {
    let s = e();
    if (JSON.stringify(s), !i && (typeof s == "object" || s !== n)) {
      let o = n;
      queueMicrotask(() => {
        t(s, o);
      });
    }
    n = s, i = !1;
  });
  return () => Lt(r);
}
async function As(e) {
  ws();
  try {
    await e(), await Promise.resolve();
  } finally {
    Is();
  }
}
var Nn = [], Mn = [], Ln = [];
function Ds(e) {
  Ln.push(e);
}
function vi(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Mn.push(t));
}
function Fn(e) {
  Nn.push(e);
}
function Pn(e, t, i) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(i);
}
function Rn(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([i, n]) => {
    (t === void 0 || t.includes(i)) && (n.forEach((r) => r()), delete e._x_attributeCleanups[i]);
  });
}
function Os(e) {
  for (e._x_effects?.forEach(Ss); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var yi = new MutationObserver(Ii), bi = !1;
function xi() {
  yi.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), bi = !0;
}
function zn() {
  ks(), yi.disconnect(), bi = !1;
}
var Vt = [];
function ks() {
  let e = yi.takeRecords();
  Vt.push(() => e.length > 0 && Ii(e));
  let t = Vt.length;
  queueMicrotask(() => {
    if (Vt.length === t)
      for (; Vt.length > 0; )
        Vt.shift()();
  });
}
function M(e) {
  if (!bi)
    return e();
  zn();
  let t = e();
  return xi(), t;
}
var wi = !1, xe = [];
function Ns() {
  wi = !0;
}
function Ms() {
  wi = !1, Ii(xe), xe = [];
}
function Ii(e) {
  if (wi) {
    xe = xe.concat(e);
    return;
  }
  let t = [], i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (let s = 0; s < e.length; s++)
    if (!e[s].target._x_ignoreMutationObserver && (e[s].type === "childList" && (e[s].removedNodes.forEach((o) => {
      o.nodeType === 1 && o._x_marker && i.add(o);
    }), e[s].addedNodes.forEach((o) => {
      if (o.nodeType === 1) {
        if (i.has(o)) {
          i.delete(o);
          return;
        }
        o._x_marker || t.push(o);
      }
    })), e[s].type === "attributes")) {
      let o = e[s].target, a = e[s].attributeName, l = e[s].oldValue, d = () => {
        n.has(o) || n.set(o, []), n.get(o).push({ name: a, value: o.getAttribute(a) });
      }, m = () => {
        r.has(o) || r.set(o, []), r.get(o).push(a);
      };
      o.hasAttribute(a) && l === null ? d() : o.hasAttribute(a) ? (m(), d()) : m();
    }
  r.forEach((s, o) => {
    Rn(o, s);
  }), n.forEach((s, o) => {
    Nn.forEach((a) => a(o, s));
  });
  for (let s of i)
    t.some((o) => o.contains(s)) || Mn.forEach((o) => o(s));
  for (let s of t)
    s.isConnected && Ln.forEach((o) => o(s));
  t = null, i = null, n = null, r = null;
}
function Vn(e) {
  return vt(gt(e));
}
function ne(e, t, i) {
  return e._x_dataStack = [t, ...gt(i || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
  };
}
function gt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? gt(e.host) : e.parentNode ? gt(e.parentNode) : [];
}
function vt(e) {
  return new Proxy({ objects: e }, Ls);
}
var Ls = {
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
    return t == "toJSON" ? Fs : Reflect.get(
      e.find(
        (n) => Reflect.has(n, t)
      ) || {},
      t,
      i
    );
  },
  set({ objects: e }, t, i, n) {
    const r = e.find(
      (o) => Object.prototype.hasOwnProperty.call(o, t)
    ) || e[e.length - 1], s = Object.getOwnPropertyDescriptor(r, t);
    return s?.set && s?.get ? s.set.call(n, i) || !0 : Reflect.set(r, t, i);
  }
};
function Fs() {
  return Reflect.ownKeys(this).reduce((t, i) => (t[i] = Reflect.get(this, i), t), {});
}
function _i(e) {
  let t = (n) => typeof n == "object" && !Array.isArray(n) && n !== null, i = (n, r = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([s, { value: o, enumerable: a }]) => {
      if (a === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let l = r === "" ? s : `${r}.${s}`;
      typeof o == "object" && o !== null && o._x_interceptor ? n[s] = o.initialize(e, l, s) : t(o) && o !== n && !(o instanceof Element) && i(o, l);
    });
  };
  return i(e);
}
function Bn(e, t = () => {
}) {
  let i = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(n, r, s) {
      return e(this.initialValue, () => Ps(n, r), (o) => Ge(n, r, o), r, s);
    }
  };
  return t(i), (n) => {
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
function Ps(e, t) {
  return t.split(".").reduce((i, n) => i[n], e);
}
function Ge(e, t, i) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = i;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Ge(e[t[0]], t.slice(1), i);
  }
}
var Hn = {};
function j(e, t) {
  Hn[e] = t;
}
function Gt(e, t) {
  let i = Rs(t);
  return Object.entries(Hn).forEach(([n, r]) => {
    Object.defineProperty(e, `$${n}`, {
      get() {
        return r(t, i);
      },
      enumerable: !1
    });
  }), e;
}
function Rs(e) {
  let [t, i] = Xn(e), n = { interceptor: Bn, ...t };
  return vi(e, i), n;
}
function zs(e, t, i, ...n) {
  try {
    return i(...n);
  } catch (r) {
    Zt(r, e, t);
  }
}
function Zt(...e) {
  return Un(...e);
}
var Un = Bs;
function Vs(e) {
  Un = e;
}
function Bs(e, t, i = void 0) {
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
function qn(e) {
  let t = At;
  At = !1;
  let i = e();
  return At = t, i;
}
function ht(e, t, i = {}) {
  let n;
  return z(e, t)((r) => n = r, i), n;
}
function z(...e) {
  return Wn(...e);
}
var Wn = Yn;
function Hs(e) {
  Wn = e;
}
var jn;
function Us(e) {
  jn = e;
}
function Yn(e, t) {
  let i = {};
  Gt(i, e);
  let n = [i, ...gt(e)], r = typeof t == "function" ? qs(n, t) : js(n, t, e);
  return zs.bind(null, e, t, r);
}
function qs(e, t) {
  return (i = () => {
  }, { scope: n = {}, params: r = [], context: s } = {}) => {
    if (!At) {
      Qt(i, t, vt([n, ...e]), r);
      return;
    }
    let o = t.apply(vt([n, ...e]), r);
    Qt(i, o);
  };
}
var Ve = {};
function Ws(e, t) {
  if (Ve[e])
    return Ve[e];
  let i = Object.getPrototypeOf(async function() {
  }).constructor, n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, s = (() => {
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
  return Ve[e] = s, s;
}
function js(e, t, i) {
  let n = Ws(t, i);
  return (r = () => {
  }, { scope: s = {}, params: o = [], context: a } = {}) => {
    n.result = void 0, n.finished = !1;
    let l = vt([s, ...e]);
    if (typeof n == "function") {
      let d = n.call(a, n, l).catch((m) => Zt(m, i, t));
      n.finished ? (Qt(r, n.result, l, o, i), n.result = void 0) : d.then((m) => {
        Qt(r, m, l, o, i);
      }).catch((m) => Zt(m, i, t)).finally(() => n.result = void 0);
    }
  };
}
function Qt(e, t, i, n, r) {
  if (At && typeof t == "function") {
    let s = t.apply(i, n);
    s instanceof Promise ? s.then((o) => Qt(e, o, i, n)).catch((o) => Zt(o, r, t)) : e(s);
  } else typeof t == "object" && t instanceof Promise ? t.then((s) => e(s)) : e(t);
}
function Ys(...e) {
  return jn(...e);
}
function Ks(e, t, i = {}) {
  let n = {};
  Gt(n, e);
  let r = [n, ...gt(e)], s = vt([i.scope ?? {}, ...r]), o = i.params ?? [];
  if (t.includes("await")) {
    let a = Object.getPrototypeOf(async function() {
    }).constructor, l = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t;
    return new a(
      ["scope"],
      `with (scope) { let __result = ${l}; return __result }`
    ).call(i.context, s);
  } else {
    let a = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(()=>{ ${t} })()` : t, d = new Function(
      ["scope"],
      `with (scope) { let __result = ${a}; return __result }`
    ).call(i.context, s);
    return typeof d == "function" && At ? d.apply(s, o) : d;
  }
}
var Si = "x-";
function Ft(e = "") {
  return Si + e;
}
function Js(e) {
  Si = e;
}
var we = {};
function F(e, t) {
  return we[e] = t, {
    before(i) {
      if (!we[i]) {
        console.warn(String.raw`Cannot find directive \`${i}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const n = ut.indexOf(i);
      ut.splice(n >= 0 ? n : ut.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Xs(e) {
  return Object.keys(we).includes(e);
}
function Ei(e, t, i) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let s = Object.entries(e._x_virtualDirectives).map(([a, l]) => ({ name: a, value: l })), o = Kn(s);
    s = s.map((a) => o.find((l) => l.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(s);
  }
  let n = {};
  return t.map(Qn((s, o) => n[s] = o)).filter(er).map(Qs(n, i)).sort(to).map((s) => Zs(e, s));
}
function Kn(e) {
  return Array.from(e).map(Qn()).filter((t) => !er(t));
}
var Ze = !1, Kt = /* @__PURE__ */ new Map(), Jn = Symbol();
function Gs(e) {
  Ze = !0;
  let t = Symbol();
  Jn = t, Kt.set(t, []);
  let i = () => {
    for (; Kt.get(t).length; )
      Kt.get(t).shift()();
    Kt.delete(t);
  }, n = () => {
    Ze = !1, i();
  };
  e(i), n();
}
function Xn(e) {
  let t = [], i = (a) => t.push(a), [n, r] = $s(e);
  return t.push(r), [{
    Alpine: Rt,
    effect: n,
    cleanup: i,
    evaluateLater: z.bind(z, e),
    evaluate: ht.bind(ht, e)
  }, () => t.forEach((a) => a())];
}
function Zs(e, t) {
  let i = () => {
  }, n = we[t.type] || i, [r, s] = Xn(e);
  Pn(e, t.original, s);
  let o = () => {
    e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, r), n = n.bind(n, e, t, r), Ze ? Kt.get(Jn).push(n) : n());
  };
  return o.runCleanups = s, o;
}
var Gn = (e, t) => ({ name: i, value: n }) => (i.startsWith(e) && (i = i.replace(e, t)), { name: i, value: n }), Zn = (e) => e;
function Qn(e = () => {
}) {
  return ({ name: t, value: i }) => {
    let { name: n, value: r } = tr.reduce((s, o) => o(s), { name: t, value: i });
    return n !== t && e(n, t), { name: n, value: r };
  };
}
var tr = [];
function Ti(e) {
  tr.push(e);
}
function er({ name: e }) {
  return ir().test(e);
}
var ir = () => new RegExp(`^${Si}([^:^.]+)\\b`);
function Qs(e, t) {
  return ({ name: i, value: n }) => {
    i === n && (n = "");
    let r = i.match(ir()), s = i.match(/:([a-zA-Z0-9\-_:]+)/), o = i.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[i] || i;
    return {
      type: r ? r[1] : null,
      value: s ? s[1] : null,
      modifiers: o.map((l) => l.replace(".", "")),
      expression: n,
      original: a
    };
  };
}
var Qe = "DEFAULT", ut = [
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
  Qe,
  "teleport"
];
function to(e, t) {
  let i = ut.indexOf(e.type) === -1 ? Qe : e.type, n = ut.indexOf(t.type) === -1 ? Qe : t.type;
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
    Array.from(e.children).forEach((r) => yt(r, t));
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
var Wi = !1;
function eo() {
  Wi && H("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Wi = !0, document.body || H("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), Jt(document, "alpine:init"), Jt(document, "alpine:initializing"), xi(), Ds((t) => Q(t, yt)), vi((t) => Pt(t)), Fn((t, i) => {
    Ei(t, i).forEach((n) => n());
  });
  let e = (t) => !Ae(t.parentElement, !0);
  Array.from(document.querySelectorAll(sr().join(","))).filter(e).forEach((t) => {
    Q(t);
  }), Jt(document, "alpine:initialized"), setTimeout(() => {
    so();
  });
}
var Ci = [], nr = [];
function rr() {
  return Ci.map((e) => e());
}
function sr() {
  return Ci.concat(nr).map((e) => e());
}
function or(e) {
  Ci.push(e);
}
function ar(e) {
  nr.push(e);
}
function Ae(e, t = !1) {
  return bt(e, (i) => {
    if ((t ? sr() : rr()).some((r) => i.matches(r)))
      return !0;
  });
}
function bt(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), e.parentNode instanceof ShadowRoot)
      return bt(e.parentNode.host, t);
    if (e.parentElement)
      return bt(e.parentElement, t);
  }
}
function io(e) {
  return rr().some((t) => e.matches(t));
}
var lr = [];
function no(e) {
  lr.push(e);
}
var ro = 1;
function Q(e, t = yt, i = () => {
}) {
  bt(e, (n) => n._x_ignore) || Gs(() => {
    t(e, (n, r) => {
      n._x_marker || (i(n, r), lr.forEach((s) => s(n, r)), Ei(n, n.attributes).forEach((s) => s()), n._x_ignore || (n._x_marker = ro++), n._x_ignore && r());
    });
  });
}
function Pt(e, t = yt) {
  t(e, (i) => {
    Os(i), Rn(i), delete i._x_marker;
  });
}
function so() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, i, n]) => {
    Xs(i) || n.some((r) => {
      if (document.querySelector(r))
        return H(`found "${r}", but missing ${t} plugin`), !0;
    });
  });
}
var ti = [], $i = !1;
function Ai(e = () => {
}) {
  return queueMicrotask(() => {
    $i || setTimeout(() => {
      ei();
    });
  }), new Promise((t) => {
    ti.push(() => {
      e(), t();
    });
  });
}
function ei() {
  for ($i = !1; ti.length; )
    ti.shift()();
}
function oo() {
  $i = !0;
}
function Di(e, t) {
  return Array.isArray(t) ? ji(e, t.join(" ")) : typeof t == "object" && t !== null ? ao(e, t) : typeof t == "function" ? Di(e, t()) : ji(e, t);
}
function ji(e, t) {
  let i = (r) => r.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), n = (r) => (e.classList.add(...r), () => {
    e.classList.remove(...r);
  });
  return t = t === !0 ? t = "" : t || "", n(i(t));
}
function ao(e, t) {
  let i = (a) => a.split(" ").filter(Boolean), n = Object.entries(t).flatMap(([a, l]) => l ? i(a) : !1).filter(Boolean), r = Object.entries(t).flatMap(([a, l]) => l ? !1 : i(a)).filter(Boolean), s = [], o = [];
  return r.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), o.push(a));
  }), n.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), s.push(a));
  }), () => {
    o.forEach((a) => e.classList.add(a)), s.forEach((a) => e.classList.remove(a));
  };
}
function De(e, t) {
  return typeof t == "object" && t !== null ? lo(e, t) : co(e, t);
}
function lo(e, t) {
  let i = {};
  return Object.entries(t).forEach(([n, r]) => {
    i[n] = e.style[n], n.startsWith("--") || (n = uo(n)), e.style.setProperty(n, r);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    De(e, i);
  };
}
function co(e, t) {
  let i = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", i || "");
  };
}
function uo(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function ii(e, t = () => {
}) {
  let i = !1;
  return function() {
    i ? t.apply(this, arguments) : (i = !0, e.apply(this, arguments));
  };
}
F("transition", (e, { value: t, modifiers: i, expression: n }, { evaluate: r }) => {
  typeof n == "function" && (n = r(n)), n !== !1 && (!n || typeof n == "boolean" ? fo(e, i, t) : ho(e, n, t));
});
function ho(e, t, i) {
  cr(e, Di, ""), {
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
  }[i](t);
}
function fo(e, t, i) {
  cr(e, De);
  let n = !t.includes("in") && !t.includes("out") && !i, r = n || t.includes("in") || ["enter"].includes(i), s = n || t.includes("out") || ["leave"].includes(i);
  t.includes("in") && !n && (t = t.filter((h, f) => f < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((h, f) => f > t.indexOf("out")));
  let o = !t.includes("opacity") && !t.includes("scale"), a = o || t.includes("opacity"), l = o || t.includes("scale"), d = a ? 0 : 1, m = l ? Bt(t, "scale", 95) / 100 : 1, b = Bt(t, "delay", 0) / 1e3, I = Bt(t, "origin", "center"), y = "opacity, transform", c = Bt(t, "duration", 150) / 1e3, p = Bt(t, "duration", 75) / 1e3, u = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  r && (e._x_transition.enter.during = {
    transformOrigin: I,
    transitionDelay: `${b}s`,
    transitionProperty: y,
    transitionDuration: `${c}s`,
    transitionTimingFunction: u
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${m})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), s && (e._x_transition.leave.during = {
    transformOrigin: I,
    transitionDelay: `${b}s`,
    transitionProperty: y,
    transitionDuration: `${p}s`,
    transitionTimingFunction: u
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${m})`
  });
}
function cr(e, t, i = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: i, start: i, end: i },
    leave: { during: i, start: i, end: i },
    in(n = () => {
    }, r = () => {
    }) {
      ni(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, n, r);
    },
    out(n = () => {
    }, r = () => {
    }) {
      ni(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, n, r);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, i, n) {
  const r = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let s = () => r(i);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(i) : s() : e._x_transition ? e._x_transition.in(i) : s();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((o, a) => {
    e._x_transition.out(() => {
    }, () => o(n)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(n), queueMicrotask(() => {
    let o = ur(e);
    o ? (o._x_hideChildren || (o._x_hideChildren = []), o._x_hideChildren.push(e)) : r(() => {
      let a = (l) => {
        let d = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(a)
        ]).then(([m]) => m?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, d;
      };
      a(e).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function ur(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : ur(t);
}
function ni(e, t, { during: i, start: n, end: r } = {}, s = () => {
}, o = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(i).length === 0 && Object.keys(n).length === 0 && Object.keys(r).length === 0) {
    s(), o();
    return;
  }
  let a, l, d;
  po(e, {
    start() {
      a = t(e, n);
    },
    during() {
      l = t(e, i);
    },
    before: s,
    end() {
      a(), d = t(e, r);
    },
    after: o,
    cleanup() {
      l(), d();
    }
  });
}
function po(e, t) {
  let i, n, r, s = ii(() => {
    M(() => {
      i = !0, n || t.before(), r || (t.end(), ei()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(o) {
      this.beforeCancels.push(o);
    },
    cancel: ii(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      s();
    }),
    finish: s
  }, M(() => {
    t.start(), t.during();
  }), oo(), requestAnimationFrame(() => {
    if (i)
      return;
    let o = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    o === 0 && (o = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), M(() => {
      t.before();
    }), n = !0, requestAnimationFrame(() => {
      i || (M(() => {
        t.end();
      }), ei(), setTimeout(e._x_transitioning.finish, o + a), r = !0);
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
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [n, e[e.indexOf(t) + 2]].join(" ") : n;
}
var st = !1;
function lt(e, t = () => {
}) {
  return (...i) => st ? t(...i) : e(...i);
}
function mo(e) {
  return (...t) => st && e(...t);
}
var dr = [];
function Oe(e) {
  dr.push(e);
}
function go(e, t) {
  dr.forEach((i) => i(e, t)), st = !0, hr(() => {
    Q(t, (i, n) => {
      n(i, () => {
      });
    });
  }), st = !1;
}
var ri = !1;
function vo(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), st = !0, ri = !0, hr(() => {
    yo(t);
  }), st = !1, ri = !1;
}
function yo(e) {
  let t = !1;
  Q(e, (n, r) => {
    yt(n, (s, o) => {
      if (t && io(s))
        return o();
      t = !0, r(s, o);
    });
  });
}
function hr(e) {
  let t = Ct;
  qi((i, n) => {
    let r = t(i);
    return Lt(r), () => {
    };
  }), e(), qi(t);
}
function fr(e, t, i, n = []) {
  switch (e._x_bindings || (e._x_bindings = Mt({})), e._x_bindings[t] = i, t = n.includes("camel") ? To(t) : t, t) {
    case "value":
      bo(e, i);
      break;
    case "style":
      wo(e, i);
      break;
    case "class":
      xo(e, i);
      break;
    case "selected":
    case "checked":
      Io(e, t, i);
      break;
    default:
      pr(e, t, i);
      break;
  }
}
function bo(e, t) {
  if (vr(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = ye(e.value) === t : e.checked = Yi(e.value, t));
  else if (Oi(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((i) => Yi(i, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Eo(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function xo(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Di(e, t);
}
function wo(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = De(e, t);
}
function Io(e, t, i) {
  pr(e, t, i), So(e, t, i);
}
function pr(e, t, i) {
  [null, void 0, !1].includes(i) && $o(t) ? e.removeAttribute(t) : (mr(t) && (i = t), _o(e, t, i));
}
function _o(e, t, i) {
  e.getAttribute(t) != i && e.setAttribute(t, i);
}
function So(e, t, i) {
  e[t] !== i && (e[t] = i);
}
function Eo(e, t) {
  const i = [].concat(t).map((n) => n + "");
  Array.from(e.options).forEach((n) => {
    n.selected = i.includes(n.value);
  });
}
function To(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Yi(e, t) {
  return e == t;
}
function ye(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Co = /* @__PURE__ */ new Set([
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
function mr(e) {
  return Co.has(e);
}
function $o(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Ao(e, t, i) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : gr(e, t, i);
}
function Do(e, t, i, n = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let r = e._x_inlineBindings[t];
    return r.extract = n, qn(() => ht(e, r.expression));
  }
  return gr(e, t, i);
}
function gr(e, t, i) {
  let n = e.getAttribute(t);
  return n === null ? typeof i == "function" ? i() : i : n === "" ? !0 : mr(t) ? !![t, "true"].includes(n) : n;
}
function Oi(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function vr(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function yr(e, t) {
  let i;
  return function() {
    const n = this, r = arguments, s = function() {
      i = null, e.apply(n, r);
    };
    clearTimeout(i), i = setTimeout(s, t);
  };
}
function br(e, t) {
  let i;
  return function() {
    let n = this, r = arguments;
    i || (e.apply(n, r), i = !0, setTimeout(() => i = !1, t));
  };
}
function xr({ get: e, set: t }, { get: i, set: n }) {
  let r = !0, s, o = Ct(() => {
    let a = e(), l = i();
    if (r)
      n(Be(a)), r = !1;
    else {
      let d = JSON.stringify(a), m = JSON.stringify(l);
      d !== s ? n(Be(a)) : d !== m && t(Be(l));
    }
    s = JSON.stringify(e()), JSON.stringify(i());
  });
  return () => {
    Lt(o);
  };
}
function Be(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Oo(e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => i(Rt));
}
var ct = {}, Ki = !1;
function ko(e, t) {
  if (Ki || (ct = Mt(ct), Ki = !0), t === void 0)
    return ct[e];
  ct[e] = t, _i(ct[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ct[e].init();
}
function No() {
  return ct;
}
var wr = {};
function Mo(e, t) {
  let i = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Ir(e, i()) : (wr[e] = i, () => {
  });
}
function Lo(e) {
  return Object.entries(wr).forEach(([t, i]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...n) => i(...n);
      }
    });
  }), e;
}
function Ir(e, t, i) {
  let n = [];
  for (; n.length; )
    n.pop()();
  let r = Object.entries(t).map(([o, a]) => ({ name: o, value: a })), s = Kn(r);
  return r = r.map((o) => s.find((a) => a.name === o.name) ? {
    name: `x-bind:${o.name}`,
    value: `"${o.value}"`
  } : o), Ei(e, r, i).map((o) => {
    n.push(o.runCleanups), o();
  }), () => {
    for (; n.length; )
      n.pop()();
  };
}
var _r = {};
function Fo(e, t) {
  _r[e] = t;
}
function Po(e, t) {
  return Object.entries(_r).forEach(([i, n]) => {
    Object.defineProperty(e, i, {
      get() {
        return (...r) => n.bind(t)(...r);
      },
      enumerable: !1
    });
  }), e;
}
var Ro = {
  get reactive() {
    return Mt;
  },
  get release() {
    return Lt;
  },
  get effect() {
    return Ct;
  },
  get raw() {
    return On;
  },
  get transaction() {
    return As;
  },
  version: "3.15.8",
  flushAndStopDeferringMutations: Ms,
  dontAutoEvaluateFunctions: qn,
  disableEffectScheduling: Ts,
  startObservingMutations: xi,
  stopObservingMutations: zn,
  setReactivityEngine: Cs,
  onAttributeRemoved: Pn,
  onAttributesAdded: Fn,
  closestDataStack: gt,
  skipDuringClone: lt,
  onlyDuringClone: mo,
  addRootSelector: or,
  addInitSelector: ar,
  setErrorHandler: Vs,
  interceptClone: Oe,
  addScopeToNode: ne,
  deferMutations: Ns,
  mapAttributes: Ti,
  evaluateLater: z,
  interceptInit: no,
  initInterceptors: _i,
  injectMagics: Gt,
  setEvaluator: Hs,
  setRawEvaluator: Us,
  mergeProxies: vt,
  extractProp: Do,
  findClosest: bt,
  onElRemoved: vi,
  closestRoot: Ae,
  destroyTree: Pt,
  interceptor: Bn,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ni,
  // INTERNAL
  setStyles: De,
  // INTERNAL
  mutateDom: M,
  directive: F,
  entangle: xr,
  throttle: br,
  debounce: yr,
  evaluate: ht,
  evaluateRaw: Ys,
  initTree: Q,
  nextTick: Ai,
  prefixed: Ft,
  prefix: Js,
  plugin: Oo,
  magic: j,
  store: ko,
  start: eo,
  clone: vo,
  // INTERNAL
  cloneNode: go,
  // INTERNAL
  bound: Ao,
  $data: Vn,
  watch: kn,
  walk: yt,
  data: Fo,
  bind: Mo
}, Rt = Ro;
function zo(e, t) {
  const i = /* @__PURE__ */ Object.create(null), n = e.split(",");
  for (let r = 0; r < n.length; r++)
    i[n[r]] = !0;
  return (r) => !!i[r];
}
var Vo = Object.freeze({}), Bo = Object.prototype.hasOwnProperty, ke = (e, t) => Bo.call(e, t), ft = Array.isArray, Xt = (e) => Sr(e) === "[object Map]", Ho = (e) => typeof e == "string", ki = (e) => typeof e == "symbol", Ne = (e) => e !== null && typeof e == "object", Uo = Object.prototype.toString, Sr = (e) => Uo.call(e), Er = (e) => Sr(e).slice(8, -1), Ni = (e) => Ho(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, qo = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (i) => t[i] || (t[i] = e(i));
}, Wo = qo((e) => e.charAt(0).toUpperCase() + e.slice(1)), Tr = (e, t) => e !== t && (e === e || t === t), si = /* @__PURE__ */ new WeakMap(), Ht = [], J, pt = Symbol("iterate"), oi = Symbol("Map key iterate");
function jo(e) {
  return e && e._isEffect === !0;
}
function Yo(e, t = Vo) {
  jo(e) && (e = e.raw);
  const i = Xo(e, t);
  return t.lazy || i(), i;
}
function Ko(e) {
  e.active && (Cr(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var Jo = 0;
function Xo(e, t) {
  const i = function() {
    if (!i.active)
      return e();
    if (!Ht.includes(i)) {
      Cr(i);
      try {
        return Zo(), Ht.push(i), J = i, e();
      } finally {
        Ht.pop(), $r(), J = Ht[Ht.length - 1];
      }
    }
  };
  return i.id = Jo++, i.allowRecurse = !!t.allowRecurse, i._isEffect = !0, i.active = !0, i.raw = e, i.deps = [], i.options = t, i;
}
function Cr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let i = 0; i < t.length; i++)
      t[i].delete(e);
    t.length = 0;
  }
}
var Ot = !0, Mi = [];
function Go() {
  Mi.push(Ot), Ot = !1;
}
function Zo() {
  Mi.push(Ot), Ot = !0;
}
function $r() {
  const e = Mi.pop();
  Ot = e === void 0 ? !0 : e;
}
function U(e, t, i) {
  if (!Ot || J === void 0)
    return;
  let n = si.get(e);
  n || si.set(e, n = /* @__PURE__ */ new Map());
  let r = n.get(i);
  r || n.set(i, r = /* @__PURE__ */ new Set()), r.has(J) || (r.add(J), J.deps.push(r), J.options.onTrack && J.options.onTrack({
    effect: J,
    target: e,
    type: t,
    key: i
  }));
}
function ot(e, t, i, n, r, s) {
  const o = si.get(e);
  if (!o)
    return;
  const a = /* @__PURE__ */ new Set(), l = (m) => {
    m && m.forEach((b) => {
      (b !== J || b.allowRecurse) && a.add(b);
    });
  };
  if (t === "clear")
    o.forEach(l);
  else if (i === "length" && ft(e))
    o.forEach((m, b) => {
      (b === "length" || b >= n) && l(m);
    });
  else
    switch (i !== void 0 && l(o.get(i)), t) {
      case "add":
        ft(e) ? Ni(i) && l(o.get("length")) : (l(o.get(pt)), Xt(e) && l(o.get(oi)));
        break;
      case "delete":
        ft(e) || (l(o.get(pt)), Xt(e) && l(o.get(oi)));
        break;
      case "set":
        Xt(e) && l(o.get(pt));
        break;
    }
  const d = (m) => {
    m.options.onTrigger && m.options.onTrigger({
      effect: m,
      target: e,
      key: i,
      type: t,
      newValue: n,
      oldValue: r,
      oldTarget: s
    }), m.options.scheduler ? m.options.scheduler(m) : m();
  };
  a.forEach(d);
}
var Qo = /* @__PURE__ */ zo("__proto__,__v_isRef,__isVue"), Ar = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(ki)), ta = /* @__PURE__ */ Dr(), ea = /* @__PURE__ */ Dr(!0), Ji = /* @__PURE__ */ ia();
function ia() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...i) {
      const n = N(this);
      for (let s = 0, o = this.length; s < o; s++)
        U(n, "get", s + "");
      const r = n[t](...i);
      return r === -1 || r === !1 ? n[t](...i.map(N)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...i) {
      Go();
      const n = N(this)[t].apply(this, i);
      return $r(), n;
    };
  }), e;
}
function Dr(e = !1, t = !1) {
  return function(n, r, s) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_raw" && s === (e ? t ? ga : Mr : t ? ma : Nr).get(n))
      return n;
    const o = ft(n);
    if (!e && o && ke(Ji, r))
      return Reflect.get(Ji, r, s);
    const a = Reflect.get(n, r, s);
    return (ki(r) ? Ar.has(r) : Qo(r)) || (e || U(n, "get", r), t) ? a : ai(a) ? !o || !Ni(r) ? a.value : a : Ne(a) ? e ? Lr(a) : Ri(a) : a;
  };
}
var na = /* @__PURE__ */ ra();
function ra(e = !1) {
  return function(i, n, r, s) {
    let o = i[n];
    if (!e && (r = N(r), o = N(o), !ft(i) && ai(o) && !ai(r)))
      return o.value = r, !0;
    const a = ft(i) && Ni(n) ? Number(n) < i.length : ke(i, n), l = Reflect.set(i, n, r, s);
    return i === N(s) && (a ? Tr(r, o) && ot(i, "set", n, r, o) : ot(i, "add", n, r)), l;
  };
}
function sa(e, t) {
  const i = ke(e, t), n = e[t], r = Reflect.deleteProperty(e, t);
  return r && i && ot(e, "delete", t, void 0, n), r;
}
function oa(e, t) {
  const i = Reflect.has(e, t);
  return (!ki(t) || !Ar.has(t)) && U(e, "has", t), i;
}
function aa(e) {
  return U(e, "iterate", ft(e) ? "length" : pt), Reflect.ownKeys(e);
}
var la = {
  get: ta,
  set: na,
  deleteProperty: sa,
  has: oa,
  ownKeys: aa
}, ca = {
  get: ea,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, Li = (e) => Ne(e) ? Ri(e) : e, Fi = (e) => Ne(e) ? Lr(e) : e, Pi = (e) => e, Me = (e) => Reflect.getPrototypeOf(e);
function ae(e, t, i = !1, n = !1) {
  e = e.__v_raw;
  const r = N(e), s = N(t);
  t !== s && !i && U(r, "get", t), !i && U(r, "get", s);
  const { has: o } = Me(r), a = n ? Pi : i ? Fi : Li;
  if (o.call(r, t))
    return a(e.get(t));
  if (o.call(r, s))
    return a(e.get(s));
  e !== r && e.get(t);
}
function le(e, t = !1) {
  const i = this.__v_raw, n = N(i), r = N(e);
  return e !== r && !t && U(n, "has", e), !t && U(n, "has", r), e === r ? i.has(e) : i.has(e) || i.has(r);
}
function ce(e, t = !1) {
  return e = e.__v_raw, !t && U(N(e), "iterate", pt), Reflect.get(e, "size", e);
}
function Xi(e) {
  e = N(e);
  const t = N(this);
  return Me(t).has.call(t, e) || (t.add(e), ot(t, "add", e, e)), this;
}
function Gi(e, t) {
  t = N(t);
  const i = N(this), { has: n, get: r } = Me(i);
  let s = n.call(i, e);
  s ? kr(i, n, e) : (e = N(e), s = n.call(i, e));
  const o = r.call(i, e);
  return i.set(e, t), s ? Tr(t, o) && ot(i, "set", e, t, o) : ot(i, "add", e, t), this;
}
function Zi(e) {
  const t = N(this), { has: i, get: n } = Me(t);
  let r = i.call(t, e);
  r ? kr(t, i, e) : (e = N(e), r = i.call(t, e));
  const s = n ? n.call(t, e) : void 0, o = t.delete(e);
  return r && ot(t, "delete", e, void 0, s), o;
}
function Qi() {
  const e = N(this), t = e.size !== 0, i = Xt(e) ? new Map(e) : new Set(e), n = e.clear();
  return t && ot(e, "clear", void 0, void 0, i), n;
}
function ue(e, t) {
  return function(n, r) {
    const s = this, o = s.__v_raw, a = N(o), l = t ? Pi : e ? Fi : Li;
    return !e && U(a, "iterate", pt), o.forEach((d, m) => n.call(r, l(d), l(m), s));
  };
}
function de(e, t, i) {
  return function(...n) {
    const r = this.__v_raw, s = N(r), o = Xt(s), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, d = r[e](...n), m = i ? Pi : t ? Fi : Li;
    return !t && U(s, "iterate", l ? oi : pt), {
      // iterator protocol
      next() {
        const { value: b, done: I } = d.next();
        return I ? { value: b, done: I } : {
          value: a ? [m(b[0]), m(b[1])] : m(b),
          done: I
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
      console.warn(`${Wo(e)} operation ${i}failed: target is readonly.`, N(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function ua() {
  const e = {
    get(s) {
      return ae(this, s);
    },
    get size() {
      return ce(this);
    },
    has: le,
    add: Xi,
    set: Gi,
    delete: Zi,
    clear: Qi,
    forEach: ue(!1, !1)
  }, t = {
    get(s) {
      return ae(this, s, !1, !0);
    },
    get size() {
      return ce(this);
    },
    has: le,
    add: Xi,
    set: Gi,
    delete: Zi,
    clear: Qi,
    forEach: ue(!1, !0)
  }, i = {
    get(s) {
      return ae(this, s, !0);
    },
    get size() {
      return ce(this, !0);
    },
    has(s) {
      return le.call(this, s, !0);
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
    get(s) {
      return ae(this, s, !0, !0);
    },
    get size() {
      return ce(this, !0);
    },
    has(s) {
      return le.call(this, s, !0);
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
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = de(s, !1, !1), i[s] = de(s, !0, !1), t[s] = de(s, !1, !0), n[s] = de(s, !0, !0);
  }), [
    e,
    i,
    t,
    n
  ];
}
var [da, ha] = /* @__PURE__ */ ua();
function Or(e, t) {
  const i = e ? ha : da;
  return (n, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? n : Reflect.get(ke(i, r) && r in n ? i : n, r, s);
}
var fa = {
  get: /* @__PURE__ */ Or(!1)
}, pa = {
  get: /* @__PURE__ */ Or(!0)
};
function kr(e, t, i) {
  const n = N(i);
  if (n !== i && t.call(e, n)) {
    const r = Er(e);
    console.warn(`Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Nr = /* @__PURE__ */ new WeakMap(), ma = /* @__PURE__ */ new WeakMap(), Mr = /* @__PURE__ */ new WeakMap(), ga = /* @__PURE__ */ new WeakMap();
function va(e) {
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
function ya(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : va(Er(e));
}
function Ri(e) {
  return e && e.__v_isReadonly ? e : Fr(e, !1, la, fa, Nr);
}
function Lr(e) {
  return Fr(e, !0, ca, pa, Mr);
}
function Fr(e, t, i, n, r) {
  if (!Ne(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = ya(e);
  if (o === 0)
    return e;
  const a = new Proxy(e, o === 2 ? n : i);
  return r.set(e, a), a;
}
function N(e) {
  return e && N(e.__v_raw) || e;
}
function ai(e) {
  return !!(e && e.__v_isRef === !0);
}
j("nextTick", () => Ai);
j("dispatch", (e) => Jt.bind(Jt, e));
j("watch", (e, { evaluateLater: t, cleanup: i }) => (n, r) => {
  let s = t(n), a = kn(() => {
    let l;
    return s((d) => l = d), l;
  }, r);
  i(a);
});
j("store", No);
j("data", (e) => Vn(e));
j("root", (e) => Ae(e));
j("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = vt(ba(e))), e._x_refs_proxy));
function ba(e) {
  let t = [];
  return bt(e, (i) => {
    i._x_refs && t.push(i._x_refs);
  }), t;
}
var He = {};
function Pr(e) {
  return He[e] || (He[e] = 0), ++He[e];
}
function xa(e, t) {
  return bt(e, (i) => {
    if (i._x_ids && i._x_ids[t])
      return !0;
  });
}
function wa(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Pr(t));
}
j("id", (e, { cleanup: t }) => (i, n = null) => {
  let r = `${i}${n ? `-${n}` : ""}`;
  return Ia(e, r, t, () => {
    let s = xa(e, i), o = s ? s._x_ids[i] : Pr(i);
    return n ? `${i}-${o}-${n}` : `${i}-${o}`;
  });
});
Oe((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Ia(e, t, i, n) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let r = n();
  return e._x_id[t] = r, i(() => {
    delete e._x_id[t];
  }), r;
}
j("el", (e) => e);
Rr("Focus", "focus", "focus");
Rr("Persist", "persist", "persist");
function Rr(e, t, i) {
  j(t, (n) => H(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
F("modelable", (e, { expression: t }, { effect: i, evaluateLater: n, cleanup: r }) => {
  let s = n(t), o = () => {
    let m;
    return s((b) => m = b), m;
  }, a = n(`${t} = __placeholder`), l = (m) => a(() => {
  }, { scope: { __placeholder: m } }), d = o();
  l(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let m = e._x_model.get, b = e._x_model.set, I = xr(
      {
        get() {
          return m();
        },
        set(y) {
          b(y);
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
    r(I);
  });
});
F("teleport", (e, { modifiers: t, expression: i }, { cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && H("x-teleport can only be used on a <template> tag", e);
  let r = tn(i), s = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = s, s._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), s.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    s.addEventListener(a, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), ne(s, {}, e);
  let o = (a, l, d) => {
    d.includes("prepend") ? l.parentNode.insertBefore(a, l) : d.includes("append") ? l.parentNode.insertBefore(a, l.nextSibling) : l.appendChild(a);
  };
  M(() => {
    o(s, r, t), lt(() => {
      Q(s);
    })();
  }), e._x_teleportPutBack = () => {
    let a = tn(i);
    M(() => {
      o(e._x_teleport, a, t);
    });
  }, n(
    () => M(() => {
      s.remove(), Pt(s);
    })
  );
});
var _a = document.createElement("div");
function tn(e) {
  let t = lt(() => document.querySelector(e), () => _a)();
  return t || H(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var zr = () => {
};
zr.inline = (e, { modifiers: t }, { cleanup: i }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, i(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
F("ignore", zr);
F("effect", lt((e, { expression: t }, { effect: i }) => {
  i(z(e, t));
}));
function $t(e, t, i, n) {
  let r = e, s = (l) => n(l), o = {}, a = (l, d) => (m) => d(l, m);
  if (i.includes("dot") && (t = Sa(t)), i.includes("camel") && (t = Ea(t)), i.includes("passive") && (o.passive = !0), i.includes("capture") && (o.capture = !0), i.includes("window") && (r = window), i.includes("document") && (r = document), i.includes("debounce")) {
    let l = i[i.indexOf("debounce") + 1] || "invalid-wait", d = Ie(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = yr(s, d);
  }
  if (i.includes("throttle")) {
    let l = i[i.indexOf("throttle") + 1] || "invalid-wait", d = Ie(l.split("ms")[0]) ? Number(l.split("ms")[0]) : 250;
    s = br(s, d);
  }
  return i.includes("prevent") && (s = a(s, (l, d) => {
    d.preventDefault(), l(d);
  })), i.includes("stop") && (s = a(s, (l, d) => {
    d.stopPropagation(), l(d);
  })), i.includes("once") && (s = a(s, (l, d) => {
    l(d), r.removeEventListener(t, s, o);
  })), (i.includes("away") || i.includes("outside")) && (r = document, s = a(s, (l, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(d));
  })), i.includes("self") && (s = a(s, (l, d) => {
    d.target === e && l(d);
  })), t === "submit" && (s = a(s, (l, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((m) => m()), l(d);
  })), (Ca(t) || Vr(t)) && (s = a(s, (l, d) => {
    $a(d, i) || l(d);
  })), r.addEventListener(t, s, o), () => {
    r.removeEventListener(t, s, o);
  };
}
function Sa(e) {
  return e.replace(/-/g, ".");
}
function Ea(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, i) => i.toUpperCase());
}
function Ie(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ta(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Ca(e) {
  return ["keydown", "keyup"].includes(e);
}
function Vr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function $a(e, t) {
  let i = t.filter((s) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(s));
  if (i.includes("debounce")) {
    let s = i.indexOf("debounce");
    i.splice(s, Ie((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.includes("throttle")) {
    let s = i.indexOf("throttle");
    i.splice(s, Ie((i[s + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (i.length === 0 || i.length === 1 && en(e.key).includes(i[0]))
    return !1;
  const r = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((s) => i.includes(s));
  return i = i.filter((s) => !r.includes(s)), !(r.length > 0 && r.filter((o) => ((o === "cmd" || o === "super") && (o = "meta"), e[`${o}Key`])).length === r.length && (Vr(e.type) || en(e.key).includes(i[0])));
}
function en(e) {
  if (!e)
    return [];
  e = Ta(e);
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
F("model", (e, { modifiers: t, expression: i }, { effect: n, cleanup: r }) => {
  let s = e;
  t.includes("parent") && (s = e.parentNode);
  let o = z(s, i), a;
  typeof i == "string" ? a = z(s, `${i} = __placeholder`) : typeof i == "function" && typeof i() == "string" ? a = z(s, `${i()} = __placeholder`) : a = () => {
  };
  let l = () => {
    let p;
    return o((u) => p = u), nn(p) ? p.get() : p;
  }, d = (p) => {
    let u;
    o((h) => u = h), nn(u) ? u.set(p) : a(() => {
    }, {
      scope: { __placeholder: p }
    });
  };
  typeof i == "string" && e.type === "radio" && M(() => {
    e.hasAttribute("name") || e.setAttribute("name", i);
  });
  let m = t.includes("change") || t.includes("lazy"), b = t.includes("blur"), I = t.includes("enter"), y = m || b || I, c;
  if (st)
    c = () => {
    };
  else if (y) {
    let p = [], u = (h) => d(he(e, t, h, l()));
    if (m && p.push($t(e, "change", t, u)), b && (p.push($t(e, "blur", t, u)), e.form)) {
      let h = () => u({ target: e });
      e.form._x_pendingModelUpdates || (e.form._x_pendingModelUpdates = []), e.form._x_pendingModelUpdates.push(h), r(() => e.form._x_pendingModelUpdates.splice(e.form._x_pendingModelUpdates.indexOf(h), 1));
    }
    I && p.push($t(e, "keydown", t, (h) => {
      h.key === "Enter" && u(h);
    })), c = () => p.forEach((h) => h());
  } else {
    let p = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    c = $t(e, p, t, (u) => {
      d(he(e, t, u, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || Oi(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    he(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = c, r(() => e._x_removeModelListeners.default()), e.form) {
    let p = $t(e.form, "reset", [], (u) => {
      Ai(() => e._x_model && e._x_model.set(he(e, t, { target: e }, l())));
    });
    r(() => p());
  }
  e._x_model = {
    get() {
      return l();
    },
    set(p) {
      d(p);
    }
  }, e._x_forceModelUpdate = (p) => {
    p === void 0 && typeof i == "string" && i.match(/\./) && (p = ""), window.fromModel = !0, M(() => fr(e, "value", p)), delete window.fromModel;
  }, n(() => {
    let p = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(p);
  });
});
function he(e, t, i, n) {
  return M(() => {
    if (i instanceof CustomEvent && i.detail !== void 0)
      return i.detail !== null && i.detail !== void 0 ? i.detail : i.target.value;
    if (Oi(e))
      if (Array.isArray(n)) {
        let r = null;
        return t.includes("number") ? r = Ue(i.target.value) : t.includes("boolean") ? r = ye(i.target.value) : r = i.target.value, i.target.checked ? n.includes(r) ? n : n.concat([r]) : n.filter((s) => !Aa(s, r));
      } else
        return i.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return Ue(s);
        }) : t.includes("boolean") ? Array.from(i.target.selectedOptions).map((r) => {
          let s = r.value || r.text;
          return ye(s);
        }) : Array.from(i.target.selectedOptions).map((r) => r.value || r.text);
      {
        let r;
        return vr(e) ? i.target.checked ? r = i.target.value : r = n : r = i.target.value, t.includes("number") ? Ue(r) : t.includes("boolean") ? ye(r) : t.includes("trim") ? r.trim() : r;
      }
    }
  });
}
function Ue(e) {
  let t = e ? parseFloat(e) : null;
  return Da(t) ? t : e;
}
function Aa(e, t) {
  return e == t;
}
function Da(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function nn(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
F("cloak", (e) => queueMicrotask(() => M(() => e.removeAttribute(Ft("cloak")))));
ar(() => `[${Ft("init")}]`);
F("init", lt((e, { expression: t }, { evaluate: i }) => typeof t == "string" ? !!t.trim() && i(t, {}, !1) : i(t, {}, !1)));
F("text", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let r = n(t);
  i(() => {
    r((s) => {
      M(() => {
        e.textContent = s;
      });
    });
  });
});
F("html", (e, { expression: t }, { effect: i, evaluateLater: n }) => {
  let r = n(t);
  i(() => {
    r((s) => {
      M(() => {
        e.innerHTML = s, e._x_ignoreSelf = !0, Q(e), delete e._x_ignoreSelf;
      });
    });
  });
});
Ti(Gn(":", Zn(Ft("bind:"))));
var Br = (e, { value: t, modifiers: i, expression: n, original: r }, { effect: s, cleanup: o }) => {
  if (!t) {
    let l = {};
    Lo(l), z(e, n)((m) => {
      Ir(e, m, r);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Oa(e, n);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = z(e, n);
  s(() => a((l) => {
    l === void 0 && typeof n == "string" && n.match(/\./) && (l = ""), M(() => fr(e, t, l, i));
  })), o(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Br.inline = (e, { value: t, modifiers: i, expression: n }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: !1 });
};
F("bind", Br);
function Oa(e, t) {
  e._x_keyExpression = t;
}
or(() => `[${Ft("data")}]`);
F("data", (e, { expression: t }, { cleanup: i }) => {
  if (ka(e))
    return;
  t = t === "" ? "{}" : t;
  let n = {};
  Gt(n, e);
  let r = {};
  Po(r, n);
  let s = ht(e, t, { scope: r });
  (s === void 0 || s === !0) && (s = {}), Gt(s, e);
  let o = Mt(s);
  _i(o);
  let a = ne(e, o);
  o.init && ht(e, o.init), i(() => {
    o.destroy && ht(e, o.destroy), a();
  });
});
Oe((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function ka(e) {
  return st ? ri ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
F("show", (e, { modifiers: t, expression: i }, { effect: n }) => {
  let r = z(e, i);
  e._x_doHide || (e._x_doHide = () => {
    M(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    M(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let s = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, o = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(o), l = ii(
    (b) => b ? o() : s(),
    (b) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, b, o, s) : b ? a() : s();
    }
  ), d, m = !0;
  n(() => r((b) => {
    !m && b === d || (t.includes("immediate") && (b ? a() : s()), l(b), d = b, m = !1);
  }));
});
F("for", (e, { expression: t }, { effect: i, cleanup: n }) => {
  let r = Ma(t), s = z(e, r.items), o = z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, i(() => Na(e, r, s, o)), n(() => {
    Object.values(e._x_lookup).forEach((a) => M(
      () => {
        Pt(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function Na(e, t, i, n) {
  let r = (o) => typeof o == "object" && !Array.isArray(o), s = e;
  i((o) => {
    La(o) && o >= 0 && (o = Array.from(Array(o).keys(), (u) => u + 1)), o === void 0 && (o = []);
    let a = e._x_lookup, l = e._x_prevKeys, d = [], m = [];
    if (r(o))
      o = Object.entries(o).map(([u, h]) => {
        let f = rn(t, h, u, o);
        n((v) => {
          m.includes(v) && H("Duplicate key on x-for", e), m.push(v);
        }, { scope: { index: u, ...f } }), d.push(f);
      });
    else
      for (let u = 0; u < o.length; u++) {
        let h = rn(t, o[u], u, o);
        n((f) => {
          m.includes(f) && H("Duplicate key on x-for", e), m.push(f);
        }, { scope: { index: u, ...h } }), d.push(h);
      }
    let b = [], I = [], y = [], c = [];
    for (let u = 0; u < l.length; u++) {
      let h = l[u];
      m.indexOf(h) === -1 && y.push(h);
    }
    l = l.filter((u) => !y.includes(u));
    let p = "template";
    for (let u = 0; u < m.length; u++) {
      let h = m[u], f = l.indexOf(h);
      if (f === -1)
        l.splice(u, 0, h), b.push([p, u]);
      else if (f !== u) {
        let v = l.splice(u, 1)[0], x = l.splice(f - 1, 1)[0];
        l.splice(u, 0, x), l.splice(f, 0, v), I.push([v, x]);
      } else
        c.push(h);
      p = h;
    }
    for (let u = 0; u < y.length; u++) {
      let h = y[u];
      h in a && (M(() => {
        Pt(a[h]), a[h].remove();
      }), delete a[h]);
    }
    for (let u = 0; u < I.length; u++) {
      let [h, f] = I[u], v = a[h], x = a[f], _ = document.createElement("div");
      M(() => {
        x || H('x-for ":key" is undefined or invalid', s, f, a), x.after(_), v.after(x), x._x_currentIfEl && x.after(x._x_currentIfEl), _.before(v), v._x_currentIfEl && v.after(v._x_currentIfEl), _.remove();
      }), x._x_refreshXForScope(d[m.indexOf(f)]);
    }
    for (let u = 0; u < b.length; u++) {
      let [h, f] = b[u], v = h === "template" ? s : a[h];
      v._x_currentIfEl && (v = v._x_currentIfEl);
      let x = d[f], _ = m[f], g = document.importNode(s.content, !0).firstElementChild, w = Mt(x);
      ne(g, w, s), g._x_refreshXForScope = (S) => {
        Object.entries(S).forEach(([T, E]) => {
          w[T] = E;
        });
      }, M(() => {
        v.after(g), lt(() => Q(g))();
      }), typeof _ == "object" && H("x-for key cannot be an object, it must be a string or an integer", s), a[_] = g;
    }
    for (let u = 0; u < c.length; u++)
      a[c[u]]._x_refreshXForScope(d[m.indexOf(c[u])]);
    s._x_prevKeys = m;
  });
}
function Ma(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, i = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, r = e.match(n);
  if (!r)
    return;
  let s = {};
  s.items = r[2].trim();
  let o = r[1].replace(i, "").trim(), a = o.match(t);
  return a ? (s.item = o.replace(t, "").trim(), s.index = a[1].trim(), a[2] && (s.collection = a[2].trim())) : s.item = o, s;
}
function rn(e, t, i, n) {
  let r = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((o) => o.trim()).forEach((o, a) => {
    r[o] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((o) => o.trim()).forEach((o) => {
    r[o] = t[o];
  }) : r[e.item] = t, e.index && (r[e.index] = i), e.collection && (r[e.collection] = n), r;
}
function La(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Hr() {
}
Hr.inline = (e, { expression: t }, { cleanup: i }) => {
  let n = Ae(e);
  n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, i(() => delete n._x_refs[t]);
};
F("ref", Hr);
F("if", (e, { expression: t }, { effect: i, cleanup: n }) => {
  e.tagName.toLowerCase() !== "template" && H("x-if can only be used on a <template> tag", e);
  let r = z(e, t), s = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return ne(a, {}, e), M(() => {
      e.after(a), lt(() => Q(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      M(() => {
        Pt(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, o = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  i(() => r((a) => {
    a ? s() : o();
  })), n(() => e._x_undoIf && e._x_undoIf());
});
F("id", (e, { expression: t }, { evaluate: i }) => {
  i(t).forEach((r) => wa(e, r));
});
Oe((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ti(Gn("@", Zn(Ft("on:"))));
F("on", lt((e, { value: t, modifiers: i, expression: n }, { cleanup: r }) => {
  let s = n ? z(e, n) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let o = $t(e, t, i, (a) => {
    s(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  r(() => o());
}));
Le("Collapse", "collapse", "collapse");
Le("Intersect", "intersect", "intersect");
Le("Focus", "trap", "focus");
Le("Mask", "mask", "mask");
function Le(e, t, i) {
  F(t, (n) => H(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${i}`, n));
}
Rt.setEvaluator(Yn);
Rt.setRawEvaluator(Ks);
Rt.setReactivityEngine({ reactive: Ri, effect: Yo, release: Ko, raw: N });
var Fa = Rt, Ur = Fa;
function Pa(e) {
  e.directive("collapse", t), t.inline = (i, { modifiers: n }) => {
    n.includes("min") && (i._x_doShow = () => {
    }, i._x_doHide = () => {
    });
  };
  function t(i, { modifiers: n }) {
    let r = sn(n, "duration", 250) / 1e3, s = sn(n, "min", 0), o = !n.includes("min");
    i._x_isShown || (i.style.height = `${s}px`), !i._x_isShown && o && (i.hidden = !0), i._x_isShown || (i.style.overflow = "hidden");
    let a = (d, m) => {
      let b = e.setStyles(d, m);
      return m.height ? () => {
      } : b;
    }, l = {
      transitionProperty: "height",
      transitionDuration: `${r}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    i._x_transition = {
      in(d = () => {
      }, m = () => {
      }) {
        o && (i.hidden = !1), o && (i.style.display = null);
        let b = i.getBoundingClientRect().height;
        i.style.height = "auto";
        let I = i.getBoundingClientRect().height;
        b === I && (b = s), e.transition(i, e.setStyles, {
          during: l,
          start: { height: b + "px" },
          end: { height: I + "px" }
        }, () => i._x_isShown = !0, () => {
          Math.abs(i.getBoundingClientRect().height - I) < 1 && (i.style.overflow = null);
        });
      },
      out(d = () => {
      }, m = () => {
      }) {
        let b = i.getBoundingClientRect().height;
        e.transition(i, a, {
          during: l,
          start: { height: b + "px" },
          end: { height: s + "px" }
        }, () => i.style.overflow = "hidden", () => {
          i._x_isShown = !1, i.style.height == `${s}px` && o && (i.style.display = "none", i.hidden = !0);
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
    let r = n.match(/([0-9]+)ms/);
    if (r)
      return r[1];
  }
  if (t === "min") {
    let r = n.match(/([0-9]+)px/);
    if (r)
      return r[1];
  }
  return n;
}
var Ra = Pa;
function za(e) {
  e.directive("intersect", e.skipDuringClone((t, { value: i, expression: n, modifiers: r }, { evaluateLater: s, cleanup: o }) => {
    let a = s(n), l = {
      rootMargin: Ha(r),
      threshold: Va(r)
    }, d = new IntersectionObserver((m) => {
      m.forEach((b) => {
        b.isIntersecting !== (i === "leave") && (a(), r.includes("once") && d.disconnect());
      });
    }, l);
    d.observe(t), o(() => {
      d.disconnect();
    });
  }));
}
function Va(e) {
  if (e.includes("full"))
    return 0.99;
  if (e.includes("half"))
    return 0.5;
  if (!e.includes("threshold"))
    return 0;
  let t = e[e.indexOf("threshold") + 1];
  return t === "100" ? 1 : t === "0" ? 0 : +`.${t}`;
}
function Ba(e) {
  let t = e.match(/^(-?[0-9]+)(px|%)?$/);
  return t ? t[1] + (t[2] || "px") : void 0;
}
function Ha(e) {
  const t = "margin", i = "0px 0px 0px 0px", n = e.indexOf(t);
  if (n === -1)
    return i;
  let r = [];
  for (let s = 1; s < 5; s++)
    r.push(Ba(e[n + s] || ""));
  return r = r.filter((s) => s !== void 0), r.length ? r.join(" ").trim() : i;
}
var Ua = za, qr = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], _e = /* @__PURE__ */ qr.join(","), Wr = typeof Element > "u", xt = Wr ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, li = !Wr && Element.prototype.getRootNode ? function(e) {
  return e.getRootNode();
} : function(e) {
  return e.ownerDocument;
}, jr = function(t, i, n) {
  var r = Array.prototype.slice.apply(t.querySelectorAll(_e));
  return i && xt.call(t, _e) && r.unshift(t), r = r.filter(n), r;
}, Yr = function e(t, i, n) {
  for (var r = [], s = Array.from(t); s.length; ) {
    var o = s.shift();
    if (o.tagName === "SLOT") {
      var a = o.assignedElements(), l = a.length ? a : o.children, d = e(l, !0, n);
      n.flatten ? r.push.apply(r, d) : r.push({
        scope: o,
        candidates: d
      });
    } else {
      var m = xt.call(o, _e);
      m && n.filter(o) && (i || !t.includes(o)) && r.push(o);
      var b = o.shadowRoot || // check for an undisclosed shadow
      typeof n.getShadowRoot == "function" && n.getShadowRoot(o), I = !n.shadowRootFilter || n.shadowRootFilter(o);
      if (b && I) {
        var y = e(b === !0 ? o.children : b.children, !0, n);
        n.flatten ? r.push.apply(r, y) : r.push({
          scope: o,
          candidates: y
        });
      } else
        s.unshift.apply(s, o.children);
    }
  }
  return r;
}, Kr = function(t, i) {
  return t.tabIndex < 0 && (i || /^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || t.isContentEditable) && isNaN(parseInt(t.getAttribute("tabindex"), 10)) ? 0 : t.tabIndex;
}, qa = function(t, i) {
  return t.tabIndex === i.tabIndex ? t.documentOrder - i.documentOrder : t.tabIndex - i.tabIndex;
}, Jr = function(t) {
  return t.tagName === "INPUT";
}, Wa = function(t) {
  return Jr(t) && t.type === "hidden";
}, ja = function(t) {
  var i = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(n) {
    return n.tagName === "SUMMARY";
  });
  return i;
}, Ya = function(t, i) {
  for (var n = 0; n < t.length; n++)
    if (t[n].checked && t[n].form === i)
      return t[n];
}, Ka = function(t) {
  if (!t.name)
    return !0;
  var i = t.form || li(t), n = function(a) {
    return i.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, r;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    r = n(window.CSS.escape(t.name));
  else
    try {
      r = n(t.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var s = Ya(r, t.form);
  return !s || s === t;
}, Ja = function(t) {
  return Jr(t) && t.type === "radio";
}, Xa = function(t) {
  return Ja(t) && !Ka(t);
}, on = function(t) {
  var i = t.getBoundingClientRect(), n = i.width, r = i.height;
  return n === 0 && r === 0;
}, Ga = function(t, i) {
  var n = i.displayCheck, r = i.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var s = xt.call(t, "details>summary:first-of-type"), o = s ? t.parentElement : t;
  if (xt.call(o, "details:not([open]) *"))
    return !0;
  var a = li(t).host, l = a?.ownerDocument.contains(a) || t.ownerDocument.contains(t);
  if (!n || n === "full") {
    if (typeof r == "function") {
      for (var d = t; t; ) {
        var m = t.parentElement, b = li(t);
        if (m && !m.shadowRoot && r(m) === !0)
          return on(t);
        t.assignedSlot ? t = t.assignedSlot : !m && b !== t.ownerDocument ? t = b.host : t = m;
      }
      t = d;
    }
    if (l)
      return !t.getClientRects().length;
  } else if (n === "non-zero-area")
    return on(t);
  return !1;
}, Za = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var i = t.parentElement; i; ) {
      if (i.tagName === "FIELDSET" && i.disabled) {
        for (var n = 0; n < i.children.length; n++) {
          var r = i.children.item(n);
          if (r.tagName === "LEGEND")
            return xt.call(i, "fieldset[disabled] *") ? !0 : !r.contains(t);
        }
        return !0;
      }
      i = i.parentElement;
    }
  return !1;
}, Se = function(t, i) {
  return !(i.disabled || Wa(i) || Ga(i, t) || // For a details element with a summary, the summary element gets the focus
  ja(i) || Za(i));
}, ci = function(t, i) {
  return !(Xa(i) || Kr(i) < 0 || !Se(t, i));
}, Qa = function(t) {
  var i = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(i) || i >= 0);
}, tl = function e(t) {
  var i = [], n = [];
  return t.forEach(function(r, s) {
    var o = !!r.scope, a = o ? r.scope : r, l = Kr(a, o), d = o ? e(r.candidates) : a;
    l === 0 ? o ? i.push.apply(i, d) : i.push(a) : n.push({
      documentOrder: s,
      tabIndex: l,
      item: r,
      isScope: o,
      content: d
    });
  }), n.sort(qa).reduce(function(r, s) {
    return s.isScope ? r.push.apply(r, s.content) : r.push(s.content), r;
  }, []).concat(i);
}, el = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Yr([t], i.includeContainer, {
    filter: ci.bind(null, i),
    flatten: !1,
    getShadowRoot: i.getShadowRoot,
    shadowRootFilter: Qa
  }) : n = jr(t, i.includeContainer, ci.bind(null, i)), tl(n);
}, Xr = function(t, i) {
  i = i || {};
  var n;
  return i.getShadowRoot ? n = Yr([t], i.includeContainer, {
    filter: Se.bind(null, i),
    flatten: !0,
    getShadowRoot: i.getShadowRoot
  }) : n = jr(t, i.includeContainer, Se.bind(null, i)), n;
}, fe = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return xt.call(t, _e) === !1 ? !1 : ci(i, t);
}, il = /* @__PURE__ */ qr.concat("iframe").join(","), be = function(t, i) {
  if (i = i || {}, !t)
    throw new Error("No node provided");
  return xt.call(t, il) === !1 ? !1 : Se(i, t);
};
function an(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function ln(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = arguments[t] != null ? arguments[t] : {};
    t % 2 ? an(Object(i), !0).forEach(function(n) {
      nl(e, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : an(Object(i)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return e;
}
function nl(e, t, i) {
  return t in e ? Object.defineProperty(e, t, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = i, e;
}
var cn = /* @__PURE__ */ (function() {
  var e = [];
  return {
    activateTrap: function(i) {
      if (e.length > 0) {
        var n = e[e.length - 1];
        n !== i && n.pause();
      }
      var r = e.indexOf(i);
      r === -1 || e.splice(r, 1), e.push(i);
    },
    deactivateTrap: function(i) {
      var n = e.indexOf(i);
      n !== -1 && e.splice(n, 1), e.length > 0 && e[e.length - 1].unpause();
    }
  };
})(), rl = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
}, sl = function(t) {
  return t.key === "Escape" || t.key === "Esc" || t.keyCode === 27;
}, ol = function(t) {
  return t.key === "Tab" || t.keyCode === 9;
}, un = function(t) {
  return setTimeout(t, 0);
}, dn = function(t, i) {
  var n = -1;
  return t.every(function(r, s) {
    return i(r) ? (n = s, !1) : !0;
  }), n;
}, Ut = function(t) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return typeof t == "function" ? t.apply(void 0, n) : t;
}, pe = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
}, al = function(t, i) {
  var n = i?.document || document, r = ln({
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
  }, o, a = function(g, w, S) {
    return g && g[w] !== void 0 ? g[w] : r[S || w];
  }, l = function(g) {
    return s.containerGroups.findIndex(function(w) {
      var S = w.container, T = w.tabbableNodes;
      return S.contains(g) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      T.find(function(E) {
        return E === g;
      });
    });
  }, d = function(g) {
    var w = r[g];
    if (typeof w == "function") {
      for (var S = arguments.length, T = new Array(S > 1 ? S - 1 : 0), E = 1; E < S; E++)
        T[E - 1] = arguments[E];
      w = w.apply(void 0, T);
    }
    if (w === !0 && (w = void 0), !w) {
      if (w === void 0 || w === !1)
        return w;
      throw new Error("`".concat(g, "` was specified but was not a node, or did not return a node"));
    }
    var C = w;
    if (typeof w == "string" && (C = n.querySelector(w), !C))
      throw new Error("`".concat(g, "` as selector refers to no known node"));
    return C;
  }, m = function() {
    var g = d("initialFocus");
    if (g === !1)
      return !1;
    if (g === void 0)
      if (l(n.activeElement) >= 0)
        g = n.activeElement;
      else {
        var w = s.tabbableGroups[0], S = w && w.firstTabbableNode;
        g = S || d("fallbackFocus");
      }
    if (!g)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return g;
  }, b = function() {
    if (s.containerGroups = s.containers.map(function(g) {
      var w = el(g, r.tabbableOptions), S = Xr(g, r.tabbableOptions);
      return {
        container: g,
        tabbableNodes: w,
        focusableNodes: S,
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
        nextTabbableNode: function(E) {
          var C = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, $ = S.findIndex(function(A) {
            return A === E;
          });
          if (!($ < 0))
            return C ? S.slice($ + 1).find(function(A) {
              return fe(A, r.tabbableOptions);
            }) : S.slice(0, $).reverse().find(function(A) {
              return fe(A, r.tabbableOptions);
            });
        }
      };
    }), s.tabbableGroups = s.containerGroups.filter(function(g) {
      return g.tabbableNodes.length > 0;
    }), s.tabbableGroups.length <= 0 && !d("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, I = function _(g) {
    if (g !== !1 && g !== n.activeElement) {
      if (!g || !g.focus) {
        _(m());
        return;
      }
      g.focus({
        preventScroll: !!r.preventScroll
      }), s.mostRecentlyFocusedNode = g, rl(g) && g.select();
    }
  }, y = function(g) {
    var w = d("setReturnFocus", g);
    return w || (w === !1 ? !1 : g);
  }, c = function(g) {
    var w = pe(g);
    if (!(l(w) >= 0)) {
      if (Ut(r.clickOutsideDeactivates, g)) {
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
          returnFocus: r.returnFocusOnDeactivate && !be(w, r.tabbableOptions)
        });
        return;
      }
      Ut(r.allowOutsideClick, g) || g.preventDefault();
    }
  }, p = function(g) {
    var w = pe(g), S = l(w) >= 0;
    S || w instanceof Document ? S && (s.mostRecentlyFocusedNode = w) : (g.stopImmediatePropagation(), I(s.mostRecentlyFocusedNode || m()));
  }, u = function(g) {
    var w = pe(g);
    b();
    var S = null;
    if (s.tabbableGroups.length > 0) {
      var T = l(w), E = T >= 0 ? s.containerGroups[T] : void 0;
      if (T < 0)
        g.shiftKey ? S = s.tabbableGroups[s.tabbableGroups.length - 1].lastTabbableNode : S = s.tabbableGroups[0].firstTabbableNode;
      else if (g.shiftKey) {
        var C = dn(s.tabbableGroups, function(L) {
          var P = L.firstTabbableNode;
          return w === P;
        });
        if (C < 0 && (E.container === w || be(w, r.tabbableOptions) && !fe(w, r.tabbableOptions) && !E.nextTabbableNode(w, !1)) && (C = T), C >= 0) {
          var $ = C === 0 ? s.tabbableGroups.length - 1 : C - 1, A = s.tabbableGroups[$];
          S = A.lastTabbableNode;
        }
      } else {
        var k = dn(s.tabbableGroups, function(L) {
          var P = L.lastTabbableNode;
          return w === P;
        });
        if (k < 0 && (E.container === w || be(w, r.tabbableOptions) && !fe(w, r.tabbableOptions) && !E.nextTabbableNode(w)) && (k = T), k >= 0) {
          var D = k === s.tabbableGroups.length - 1 ? 0 : k + 1, R = s.tabbableGroups[D];
          S = R.firstTabbableNode;
        }
      }
    } else
      S = d("fallbackFocus");
    S && (g.preventDefault(), I(S));
  }, h = function(g) {
    if (sl(g) && Ut(r.escapeDeactivates, g) !== !1) {
      g.preventDefault(), o.deactivate();
      return;
    }
    if (ol(g)) {
      u(g);
      return;
    }
  }, f = function(g) {
    var w = pe(g);
    l(w) >= 0 || Ut(r.clickOutsideDeactivates, g) || Ut(r.allowOutsideClick, g) || (g.preventDefault(), g.stopImmediatePropagation());
  }, v = function() {
    if (s.active)
      return cn.activateTrap(o), s.delayInitialFocusTimer = r.delayInitialFocus ? un(function() {
        I(m());
      }) : I(m()), n.addEventListener("focusin", p, !0), n.addEventListener("mousedown", c, {
        capture: !0,
        passive: !1
      }), n.addEventListener("touchstart", c, {
        capture: !0,
        passive: !1
      }), n.addEventListener("click", f, {
        capture: !0,
        passive: !1
      }), n.addEventListener("keydown", h, {
        capture: !0,
        passive: !1
      }), o;
  }, x = function() {
    if (s.active)
      return n.removeEventListener("focusin", p, !0), n.removeEventListener("mousedown", c, !0), n.removeEventListener("touchstart", c, !0), n.removeEventListener("click", f, !0), n.removeEventListener("keydown", h, !0), o;
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
      var w = a(g, "onActivate"), S = a(g, "onPostActivate"), T = a(g, "checkCanFocusTrap");
      T || b(), s.active = !0, s.paused = !1, s.nodeFocusedBeforeActivation = n.activeElement, w && w();
      var E = function() {
        T && b(), v(), S && S();
      };
      return T ? (T(s.containers.concat()).then(E, E), this) : (E(), this);
    },
    deactivate: function(g) {
      if (!s.active)
        return this;
      var w = ln({
        onDeactivate: r.onDeactivate,
        onPostDeactivate: r.onPostDeactivate,
        checkCanReturnFocus: r.checkCanReturnFocus
      }, g);
      clearTimeout(s.delayInitialFocusTimer), s.delayInitialFocusTimer = void 0, x(), s.active = !1, s.paused = !1, cn.deactivateTrap(o);
      var S = a(w, "onDeactivate"), T = a(w, "onPostDeactivate"), E = a(w, "checkCanReturnFocus"), C = a(w, "returnFocus", "returnFocusOnDeactivate");
      S && S();
      var $ = function() {
        un(function() {
          C && I(y(s.nodeFocusedBeforeActivation)), T && T();
        });
      };
      return C && E ? (E(y(s.nodeFocusedBeforeActivation)).then($, $), this) : ($(), this);
    },
    pause: function() {
      return s.paused || !s.active ? this : (s.paused = !0, x(), this);
    },
    unpause: function() {
      return !s.paused || !s.active ? this : (s.paused = !1, b(), v(), this);
    },
    updateContainerElements: function(g) {
      var w = [].concat(g).filter(Boolean);
      return s.containers = w.map(function(S) {
        return typeof S == "string" ? n.querySelector(S) : S;
      }), s.active && b(), this;
    }
  }, o.updateContainerElements(t), o;
};
function ll(e) {
  let t, i;
  window.addEventListener("focusin", () => {
    t = i, i = document.activeElement;
  }), e.magic("focus", (n) => {
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
        return be(s);
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
        return Array.isArray(r) ? r : Xr(r, { displayCheck: "none" });
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
    (n, { expression: r, modifiers: s }, { effect: o, evaluateLater: a, cleanup: l }) => {
      let d = a(r), m = !1, b = {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        fallbackFocus: () => n
      }, I = () => {
      };
      if (s.includes("noautofocus"))
        b.initialFocus = !1;
      else {
        let u = n.querySelector("[autofocus]");
        u && (b.initialFocus = u);
      }
      s.includes("inert") && (b.onPostActivate = () => {
        e.nextTick(() => {
          I = hn(n);
        });
      });
      let y = al(n, b), c = () => {
      };
      const p = () => {
        I(), I = () => {
        }, c(), c = () => {
        }, y.deactivate({
          returnFocus: !s.includes("noreturn")
        });
      };
      o(() => d((u) => {
        m !== u && (u && !m && (s.includes("noscroll") && (c = cl()), setTimeout(() => {
          y.activate();
        }, 15)), !u && m && p(), m = !!u);
      })), l(p);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (n, { expression: r, modifiers: s }, { evaluate: o }) => {
      s.includes("inert") && o(r) && hn(n);
    }
  ));
}
function hn(e) {
  let t = [];
  return Gr(e, (i) => {
    let n = i.hasAttribute("aria-hidden");
    i.setAttribute("aria-hidden", "true"), t.push(() => n || i.removeAttribute("aria-hidden"));
  }), () => {
    for (; t.length; )
      t.pop()();
  };
}
function Gr(e, t) {
  e.isSameNode(document.body) || !e.parentNode || Array.from(e.parentNode.children).forEach((i) => {
    i.isSameNode(e) ? Gr(e.parentNode, t) : t(i);
  });
}
function cl() {
  let e = document.documentElement.style.overflow, t = document.documentElement.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
  return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${i}px`, () => {
    document.documentElement.style.overflow = e, document.documentElement.style.paddingRight = t;
  };
}
var ul = ll;
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
function dl() {
  return !0;
}
function hl({ component: e, argument: t }) {
  return new Promise((i) => {
    if (t)
      window.addEventListener(
        t,
        () => i(),
        { once: !0 }
      );
    else {
      const n = (r) => {
        r.detail.id === e.id && (window.removeEventListener("async-alpine:load", n), i());
      };
      window.addEventListener("async-alpine:load", n);
    }
  });
}
function fl() {
  return new Promise((e) => {
    "requestIdleCallback" in window ? window.requestIdleCallback(e) : setTimeout(e, 200);
  });
}
function pl({ argument: e }) {
  return new Promise((t) => {
    if (!e)
      return console.log("Async Alpine: media strategy requires a media query. Treating as 'eager'"), t();
    const i = window.matchMedia(`(${e})`);
    i.matches ? t() : i.addEventListener("change", t, { once: !0 });
  });
}
function ml({ component: e, argument: t }) {
  return new Promise((i) => {
    const n = t || "0px 0px 0px 0px", r = new IntersectionObserver((s) => {
      s[0].isIntersecting && (r.disconnect(), i());
    }, { rootMargin: n });
    r.observe(e.el);
  });
}
var fn = {
  eager: dl,
  event: hl,
  idle: fl,
  media: pl,
  visible: ml
};
async function gl(e) {
  const t = vl(e.strategy);
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
  return fn[t.method] ? fn[t.method]({
    component: e,
    argument: t.argument
  }) : !1;
}
function vl(e) {
  const t = yl(e);
  let i = Zr(t);
  return i.type === "method" ? {
    type: "expression",
    operator: "&&",
    parameters: [i]
  } : i;
}
function yl(e) {
  const t = /\s*([()])\s*|\s*(\|\||&&|\|)\s*|\s*((?:[^()&|]+\([^()]+\))|[^()&|]+)\s*/g, i = [];
  let n;
  for (; (n = t.exec(e)) !== null; ) {
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
function Zr(e) {
  let t = pn(e);
  for (; e.length > 0 && (e[0].value === "&&" || e[0].value === "|" || e[0].value === "||"); ) {
    const i = e.shift().value, n = pn(e);
    t.type === "expression" && t.operator === i ? t.parameters.push(n) : t = {
      type: "expression",
      operator: i,
      parameters: [t, n]
    };
  }
  return t;
}
function pn(e) {
  if (e[0].value === "(") {
    e.shift();
    const t = Zr(e);
    return e[0].value === ")" && e.shift(), t;
  } else
    return e.shift();
}
function bl(e) {
  const t = "load", i = e.prefixed("load-src"), n = e.prefixed("ignore");
  let r = {
    defaultStrategy: "eager",
    keepRelativeURLs: !1
  }, s = !1, o = {}, a = 0;
  function l() {
    return a++;
  }
  e.asyncOptions = (f) => {
    r = {
      ...r,
      ...f
    };
  }, e.asyncData = (f, v = !1) => {
    o[f] = {
      loaded: !1,
      download: v
    };
  }, e.asyncUrl = (f, v) => {
    !f || !v || o[f] || (o[f] = {
      loaded: !1,
      download: () => import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        h(v)
      )
    });
  }, e.asyncAlias = (f) => {
    s = f;
  };
  const d = (f) => {
    e.skipDuringClone(() => {
      f._x_async || (f._x_async = "init", f._x_ignore = !0, f.setAttribute(n, ""));
    })();
  }, m = async (f) => {
    e.skipDuringClone(async () => {
      if (f._x_async !== "init") return;
      f._x_async = "await";
      const { name: v, strategy: x } = b(f);
      await gl({
        name: v,
        strategy: x,
        el: f,
        id: f.id || l()
      }), f.isConnected && (await I(v), f.isConnected && (c(f), f._x_async = "loaded"));
    })();
  };
  m.inline = d, e.directive(t, m).before("ignore");
  function b(f) {
    const v = u(f.getAttribute(e.prefixed("data"))), x = f.getAttribute(e.prefixed(t)) || r.defaultStrategy, _ = f.getAttribute(i);
    return _ && e.asyncUrl(v, _), {
      name: v,
      strategy: x
    };
  }
  async function I(f) {
    if (f.startsWith("_x_async_") || (p(f), !o[f] || o[f].loaded)) return;
    const v = await y(f);
    e.data(f, v), o[f].loaded = !0;
  }
  async function y(f) {
    if (!o[f]) return;
    const v = await o[f].download(f);
    return typeof v == "function" ? v : v[f] || v.default || Object.values(v)[0] || !1;
  }
  function c(f) {
    e.destroyTree(f), f._x_ignore = !1, f.removeAttribute(n), !f.closest(`[${n}]`) && e.initTree(f);
  }
  function p(f) {
    if (!(!s || o[f])) {
      if (typeof s == "function") {
        e.asyncData(f, s);
        return;
      }
      e.asyncUrl(f, s.replaceAll("[name]", f));
    }
  }
  function u(f) {
    return (f || "").trim().split(/[({]/g)[0] || `_x_async_${l()}`;
  }
  function h(f) {
    return r.keepRelativeURLs || new RegExp("^(?:[a-z+]+:)?//", "i").test(f) ? f : new URL(f, document.baseURI).href;
  }
}
var qe = { exports: {} }, mn;
function xl() {
  return mn || (mn = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })(self, () => (
      /******/
      (() => {
        var i = {};
        i.d = (y, c) => {
          for (var p in c)
            i.o(c, p) && !i.o(y, p) && Object.defineProperty(y, p, { enumerable: !0, get: c[p] });
        }, i.o = (y, c) => Object.prototype.hasOwnProperty.call(y, c), i.r = (y) => {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(y, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(y, "__esModule", { value: !0 });
        };
        var n = {};
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        i.r(n), i.d(n, {
          /* harmony export */
          MvcValidationProviders: () => (
            /* binding */
            b
          ),
          /* harmony export */
          ValidationService: () => (
            /* binding */
            I
          ),
          /* harmony export */
          isValidatable: () => (
            /* binding */
            a
          )
          /* harmony export */
        });
        var r = function(y, c, p, u) {
          function h(f) {
            return f instanceof p ? f : new p(function(v) {
              v(f);
            });
          }
          return new (p || (p = Promise))(function(f, v) {
            function x(w) {
              try {
                g(u.next(w));
              } catch (S) {
                v(S);
              }
            }
            function _(w) {
              try {
                g(u.throw(w));
              } catch (S) {
                v(S);
              }
            }
            function g(w) {
              w.done ? f(w.value) : h(w.value).then(x, _);
            }
            g((u = u.apply(y, c || [])).next());
          });
        }, s = function(y, c) {
          var p = { label: 0, sent: function() {
            if (f[0] & 1) throw f[1];
            return f[1];
          }, trys: [], ops: [] }, u, h, f, v;
          return v = { next: x(0), throw: x(1), return: x(2) }, typeof Symbol == "function" && (v[Symbol.iterator] = function() {
            return this;
          }), v;
          function x(g) {
            return function(w) {
              return _([g, w]);
            };
          }
          function _(g) {
            if (u) throw new TypeError("Generator is already executing.");
            for (; v && (v = 0, g[0] && (p = 0)), p; ) try {
              if (u = 1, h && (f = g[0] & 2 ? h.return : g[0] ? h.throw || ((f = h.return) && f.call(h), 0) : h.next) && !(f = f.call(h, g[1])).done) return f;
              switch (h = 0, f && (g = [g[0] & 2, f.value]), g[0]) {
                case 0:
                case 1:
                  f = g;
                  break;
                case 4:
                  return p.label++, { value: g[1], done: !1 };
                case 5:
                  p.label++, h = g[1], g = [0];
                  continue;
                case 7:
                  g = p.ops.pop(), p.trys.pop();
                  continue;
                default:
                  if (f = p.trys, !(f = f.length > 0 && f[f.length - 1]) && (g[0] === 6 || g[0] === 2)) {
                    p = 0;
                    continue;
                  }
                  if (g[0] === 3 && (!f || g[1] > f[0] && g[1] < f[3])) {
                    p.label = g[1];
                    break;
                  }
                  if (g[0] === 6 && p.label < f[1]) {
                    p.label = f[1], f = g;
                    break;
                  }
                  if (f && p.label < f[2]) {
                    p.label = f[2], p.ops.push(g);
                    break;
                  }
                  f[2] && p.ops.pop(), p.trys.pop();
                  continue;
              }
              g = c.call(y, p);
            } catch (w) {
              g = [6, w], h = 0;
            } finally {
              u = f = 0;
            }
            if (g[0] & 5) throw g[1];
            return { value: g[0] ? g[1] : void 0, done: !0 };
          }
        }, o = new /** @class */
        ((function() {
          function y() {
            this.warn = globalThis.console.warn;
          }
          return y.prototype.log = function(c) {
          }, y;
        })())(), a = function(y) {
          return y instanceof HTMLInputElement || y instanceof HTMLSelectElement || y instanceof HTMLTextAreaElement;
        }, l = ["input", "select", "textarea"], d = function(y) {
          return l.map(function(c) {
            return "".concat(c).concat(y || "");
          }).join(",");
        };
        function m(y, c) {
          var p = y.name, u = c.substring(2), h = "", f = p.lastIndexOf(".");
          if (f > -1) {
            h = p.substring(0, f);
            var v = h + "." + u, x = document.getElementsByName(v)[0];
            if (a(x))
              return x;
          }
          return y.form.querySelector(d("[name=".concat(u, "]")));
        }
        var b = (
          /** @class */
          /* @__PURE__ */ (function() {
            function y() {
              this.required = function(c, p, u) {
                var h = p.type.toLowerCase();
                if (h === "checkbox" || h === "radio") {
                  for (var f = Array.from(p.form.querySelectorAll(d("[name='".concat(p.name, "'][type='").concat(h, "']")))), v = 0, x = f; v < x.length; v++) {
                    var _ = x[v];
                    if (_ instanceof HTMLInputElement && _.checked === !0)
                      return !0;
                  }
                  if (h === "checkbox") {
                    var g = p.form.querySelector("input[name='".concat(p.name, "'][type='hidden']"));
                    if (g instanceof HTMLInputElement && g.value === "false")
                      return !0;
                  }
                  return !1;
                }
                return !!c?.trim();
              }, this.stringLength = function(c, p, u) {
                if (!c)
                  return !0;
                if (u.min) {
                  var h = parseInt(u.min);
                  if (c.length < h)
                    return !1;
                }
                if (u.max) {
                  var f = parseInt(u.max);
                  if (c.length > f)
                    return !1;
                }
                return !0;
              }, this.compare = function(c, p, u) {
                if (!u.other)
                  return !0;
                var h = m(p, u.other);
                return h ? h.value === c : !0;
              }, this.range = function(c, p, u) {
                if (!c)
                  return !0;
                var h = parseFloat(c);
                if (isNaN(h))
                  return !1;
                if (u.min) {
                  var f = parseFloat(u.min);
                  if (h < f)
                    return !1;
                }
                if (u.max) {
                  var v = parseFloat(u.max);
                  if (h > v)
                    return !1;
                }
                return !0;
              }, this.regex = function(c, p, u) {
                if (!c || !u.pattern)
                  return !0;
                var h = new RegExp(u.pattern);
                return h.test(c);
              }, this.email = function(c, p, u) {
                if (!c)
                  return !0;
                var h = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/;
                return h.test(c);
              }, this.creditcard = function(c, p, u) {
                if (!c)
                  return !0;
                if (/[^0-9 \-]+/.test(c))
                  return !1;
                var h = 0, f = 0, v = !1, x, _;
                if (c = c.replace(/\D/g, ""), c.length < 13 || c.length > 19)
                  return !1;
                for (x = c.length - 1; x >= 0; x--)
                  _ = c.charAt(x), f = parseInt(_, 10), v && (f *= 2) > 9 && (f -= 9), h += f, v = !v;
                return h % 10 === 0;
              }, this.url = function(c, p, u) {
                if (!c)
                  return !0;
                var h = c.toLowerCase();
                return h.indexOf("http://") > -1 || h.indexOf("https://") > -1 || h.indexOf("ftp://") > -1;
              }, this.phone = function(c, p, u) {
                if (!c)
                  return !0;
                var h = /[\+\-\s][\-\s]/g;
                if (h.test(c))
                  return !1;
                var f = /^\+?[0-9\-\s]+$/;
                return f.test(c);
              }, this.remote = function(c, p, u) {
                if (!c)
                  return !0;
                for (var h = u.additionalfields.split(","), f = {}, v = 0, x = h; v < x.length; v++) {
                  var _ = x[v], g = _.substr(2), w = m(p, _), S = !!(w && w.value);
                  S && (w instanceof HTMLInputElement && (w.type === "checkbox" || w.type === "radio") ? f[g] = w.checked ? w.value : "" : f[g] = w.value);
                }
                var T = u.url, E = [];
                for (var g in f) {
                  var C = encodeURIComponent(g) + "=" + encodeURIComponent(f[g]);
                  E.push(C);
                }
                var $ = E.join("&");
                return new Promise(function(A, k) {
                  var D = new XMLHttpRequest();
                  if (u.type && u.type.toLowerCase() === "post") {
                    var R = new FormData();
                    for (var L in f)
                      R.append(L, f[L]);
                    D.open("post", T), D.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), D.send($);
                  } else
                    D.open("get", T + "?" + $), D.send();
                  D.onload = function(P) {
                    if (D.status >= 200 && D.status < 300) {
                      var Y = JSON.parse(D.responseText);
                      A(Y);
                    } else
                      k({
                        status: D.status,
                        statusText: D.statusText,
                        data: D.responseText
                      });
                  }, D.onerror = function(P) {
                    k({
                      status: D.status,
                      statusText: D.statusText,
                      data: D.responseText
                    });
                  };
                });
              };
            }
            return y;
          })()
        ), I = (
          /** @class */
          (function() {
            function y(c) {
              var p = this;
              this.providers = {}, this.messageFor = {}, this.elementUIDs = [], this.elementByUID = {}, this.formInputs = {}, this.validators = {}, this.formEvents = {}, this.inputEvents = {}, this.summary = {}, this.debounce = 300, this.allowHiddenFields = !1, this.validateForm = function(u, h) {
                return r(p, void 0, void 0, function() {
                  var f, v, x;
                  return s(this, function(_) {
                    switch (_.label) {
                      case 0:
                        if (!(u instanceof HTMLFormElement))
                          throw new Error("validateForm() can only be called on <form> elements");
                        return f = this.getElementUID(u), v = this.formEvents[f], x = !v, x ? [3, 2] : [4, v(void 0, h)];
                      case 1:
                        x = _.sent(), _.label = 2;
                      case 2:
                        return [2, x];
                    }
                  });
                });
              }, this.validateField = function(u, h) {
                return r(p, void 0, void 0, function() {
                  var f, v, x;
                  return s(this, function(_) {
                    switch (_.label) {
                      case 0:
                        return f = this.getElementUID(u), v = this.inputEvents[f], x = !v, x ? [3, 2] : [4, v(void 0, h)];
                      case 1:
                        x = _.sent(), _.label = 2;
                      case 2:
                        return [2, x];
                    }
                  });
                });
              }, this.preValidate = function(u) {
                u.preventDefault(), u.stopImmediatePropagation();
              }, this.handleValidated = function(u, h, f) {
                if (!(u instanceof HTMLFormElement))
                  throw new Error("handleValidated() can only be called on <form> elements");
                h ? f && p.submitValidForm(u, f) : p.focusFirstInvalid(u);
              }, this.submitValidForm = function(u, h) {
                if (!(u instanceof HTMLFormElement))
                  throw new Error("submitValidForm() can only be called on <form> elements");
                var f = new SubmitEvent("submit", h);
                if (u.dispatchEvent(f)) {
                  var v = h.submitter, x = null, _ = u.action;
                  if (v) {
                    var g = v.getAttribute("name");
                    g && (x = document.createElement("input"), x.type = "hidden", x.name = g, x.value = v.getAttribute("value"), u.appendChild(x));
                    var w = v.getAttribute("formaction");
                    w && (u.action = w);
                  }
                  try {
                    u.submit();
                  } finally {
                    x && u.removeChild(x), u.action = _;
                  }
                }
              }, this.focusFirstInvalid = function(u) {
                if (!(u instanceof HTMLFormElement))
                  throw new Error("focusFirstInvalid() can only be called on <form> elements");
                var h = p.getElementUID(u), f = p.formInputs[h], v = f?.find(function(_) {
                  return p.summary[_];
                });
                if (v) {
                  var x = p.elementByUID[v];
                  x instanceof HTMLElement && x.focus();
                }
              }, this.isValid = function(u, h, f) {
                if (h === void 0 && (h = !0), !(u instanceof HTMLFormElement))
                  throw new Error("isValid() can only be called on <form> elements");
                h && p.validateForm(u, f);
                var v = p.getElementUID(u), x = p.formInputs[v], _ = x?.some(function(g) {
                  return p.summary[g];
                }) === !0;
                return !_;
              }, this.isFieldValid = function(u, h, f) {
                h === void 0 && (h = !0), h && p.validateField(u, f);
                var v = p.getElementUID(u);
                return p.summary[v] === void 0;
              }, this.options = {
                root: document.body,
                watch: !1,
                addNoValidate: !0
              }, this.ValidationInputCssClassName = "input-validation-error", this.ValidationInputValidCssClassName = "input-validation-valid", this.ValidationMessageCssClassName = "field-validation-error", this.ValidationMessageValidCssClassName = "field-validation-valid", this.ValidationSummaryCssClassName = "validation-summary-errors", this.ValidationSummaryValidCssClassName = "validation-summary-valid", this.logger = c || o;
            }
            return y.prototype.addProvider = function(c, p) {
              this.providers[c] || (this.logger.log("Registered provider: %s", c), this.providers[c] = p);
            }, y.prototype.addMvcProviders = function() {
              var c = new b();
              this.addProvider("required", c.required), this.addProvider("length", c.stringLength), this.addProvider("maxlength", c.stringLength), this.addProvider("minlength", c.stringLength), this.addProvider("equalto", c.compare), this.addProvider("range", c.range), this.addProvider("regex", c.regex), this.addProvider("creditcard", c.creditcard), this.addProvider("email", c.email), this.addProvider("url", c.url), this.addProvider("phone", c.phone), this.addProvider("remote", c.remote);
            }, y.prototype.scanMessages = function(c, p) {
              for (var u = Array.from(c.querySelectorAll("span[form]")), h = 0, f = u; h < f.length; h++) {
                var v = f[h], x = document.getElementById(v.getAttribute("form"));
                x instanceof HTMLFormElement && p.call(this, x, v);
              }
              var _ = Array.from(c.querySelectorAll("form"));
              c instanceof HTMLFormElement && _.push(c);
              var g = c instanceof Element ? c.closest("form") : null;
              g && _.push(g);
              for (var w = 0, S = _; w < S.length; w++)
                for (var x = S[w], T = Array.from(x.querySelectorAll("[data-valmsg-for]")), E = 0, C = T; E < C.length; E++) {
                  var v = C[E];
                  p.call(this, x, v);
                }
            }, y.prototype.pushValidationMessageSpan = function(c, p) {
              var u, h, f, v = this.getElementUID(c), x = (u = (f = this.messageFor)[v]) !== null && u !== void 0 ? u : f[v] = {}, _ = p.getAttribute("data-valmsg-for");
              if (_) {
                var g = (h = x[_]) !== null && h !== void 0 ? h : x[_] = [];
                g.indexOf(p) < 0 ? g.push(p) : this.logger.log("Validation element for '%s' is already tracked", name, p);
              }
            }, y.prototype.removeValidationMessageSpan = function(c, p) {
              var u = this.getElementUID(c), h = this.messageFor[u];
              if (h) {
                var f = p.getAttribute("data-valmsg-for");
                if (f) {
                  var v = h[f];
                  if (v) {
                    var x = v.indexOf(p);
                    x >= 0 ? v.splice(x, 1) : this.logger.log("Validation element for '%s' was already removed", name, p);
                  }
                }
              }
            }, y.prototype.parseDirectives = function(c) {
              for (var p = {}, u = {}, h = 9, f = 0; f < c.length; f++) {
                var v = c[f];
                if (v.name.indexOf("data-val-") === 0) {
                  var x = v.name.substr(h);
                  u[x] = v.value;
                }
              }
              var _ = function(g) {
                if (g.indexOf("-") === -1) {
                  for (var w = Object.keys(u).filter(function(A) {
                    return A !== g && A.indexOf(g) === 0;
                  }), S = {
                    error: u[g],
                    params: {}
                  }, T = (g + "-").length, E = 0; E < w.length; E++) {
                    var C = u[w[E]], $ = w[E].substr(T);
                    S.params[$] = C;
                  }
                  p[g] = S;
                }
              };
              for (var x in u)
                _(x);
              return p;
            }, y.prototype.guid4 = function() {
              return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var p = Math.random() * 16 | 0, u = c == "x" ? p : p & 3 | 8;
                return u.toString(16);
              });
            }, y.prototype.getElementUID = function(c) {
              var p = this.elementUIDs.filter(function(h) {
                return h.node === c;
              })[0];
              if (p)
                return p.uid;
              var u = this.guid4();
              return this.elementUIDs.push({
                node: c,
                uid: u
              }), this.elementByUID[u] = c, u;
            }, y.prototype.getFormValidationTask = function(c) {
              var p = this.formInputs[c];
              if (!p || p.length === 0)
                return Promise.resolve(!0);
              for (var u = [], h = 0, f = p; h < f.length; h++) {
                var v = f[h], x = this.validators[v];
                x && u.push(x);
              }
              var _ = u.map(function(g) {
                return g();
              });
              return Promise.all(_).then(function(g) {
                return g.every(function(w) {
                  return w;
                });
              });
            }, y.prototype.getMessageFor = function(c) {
              var p;
              if (c.form) {
                var u = this.getElementUID(c.form);
                return (p = this.messageFor[u]) === null || p === void 0 ? void 0 : p[c.name];
              }
            }, y.prototype.shouldValidate = function(c) {
              return !(c && c.submitter && c.submitter.formNoValidate);
            }, y.prototype.trackFormInput = function(c, p) {
              var u = this, h, f, v = this.getElementUID(c), x = (h = (f = this.formInputs)[v]) !== null && h !== void 0 ? h : f[v] = [], _ = x.indexOf(p) === -1;
              if (_ ? (x.push(p), this.options.addNoValidate ? (this.logger.log("Setting novalidate on form", c), c.setAttribute("novalidate", "novalidate")) : this.logger.log("Not setting novalidate on form", c)) : this.logger.log("Form input for UID '%s' is already tracked", p), !this.formEvents[v]) {
                var g = null, w = function(T, E) {
                  return g || (u.shouldValidate(T) ? (g = u.getFormValidationTask(v), T && u.preValidate(T), u.logger.log("Validating", c), g.then(function(C) {
                    return r(u, void 0, void 0, function() {
                      var $;
                      return s(this, function(A) {
                        switch (A.label) {
                          case 0:
                            return this.logger.log("Validated (success = %s)", C, c), E ? (E(C), [2, C]) : ($ = new CustomEvent("validation", {
                              detail: { valid: C }
                            }), c.dispatchEvent($), [4, new Promise(function(k) {
                              return setTimeout(k, 0);
                            })]);
                          case 1:
                            return A.sent(), this.handleValidated(c, C, T), [2, C];
                        }
                      });
                    });
                  }).catch(function(C) {
                    return u.logger.log("Validation error", C), !1;
                  }).finally(function() {
                    g = null;
                  })) : Promise.resolve(!0));
                };
                c.addEventListener("submit", w);
                var S = function(T) {
                  for (var E = u.formInputs[v], C = 0, $ = E; C < $.length; C++) {
                    var A = $[C];
                    u.resetField(A);
                  }
                  u.renderSummary();
                };
                c.addEventListener("reset", S), w.remove = function() {
                  c.removeEventListener("submit", w), c.removeEventListener("reset", S);
                }, this.formEvents[v] = w;
              }
            }, y.prototype.reset = function(c) {
              this.isDisabled(c) ? this.resetField(this.getElementUID(c)) : this.scan(c);
            }, y.prototype.resetField = function(c) {
              var p = this.elementByUID[c];
              this.swapClasses(p, "", this.ValidationInputCssClassName), this.swapClasses(p, "", this.ValidationInputValidCssClassName);
              var u = a(p) && this.getMessageFor(p);
              if (u)
                for (var h = 0; h < u.length; h++)
                  u[h].innerHTML = "", this.swapClasses(u[h], "", this.ValidationMessageCssClassName), this.swapClasses(u[h], "", this.ValidationMessageValidCssClassName);
              delete this.summary[c];
            }, y.prototype.untrackFormInput = function(c, p) {
              var u, h = this.getElementUID(c), f = this.formInputs[h];
              if (f) {
                var v = f.indexOf(p);
                v >= 0 ? (f.splice(v, 1), f.length || ((u = this.formEvents[h]) === null || u === void 0 || u.remove(), delete this.formEvents[h], delete this.formInputs[h], delete this.messageFor[h])) : this.logger.log("Form input for UID '%s' was already removed", p);
              }
            }, y.prototype.addInput = function(c) {
              var p = this, u, h = this.getElementUID(c), f = this.parseDirectives(c.attributes);
              if (this.validators[h] = this.createValidator(c, f), c.form && this.trackFormInput(c.form, h), !this.inputEvents[h]) {
                var v = function(S, T) {
                  return r(p, void 0, void 0, function() {
                    var E, C, $;
                    return s(this, function(A) {
                      switch (A.label) {
                        case 0:
                          if (E = this.validators[h], !E)
                            return [2, !0];
                          if (!c.dataset.valEvent && S && S.type === "input" && !c.classList.contains(this.ValidationInputCssClassName))
                            return [2, !0];
                          this.logger.log("Validating", { event: S }), A.label = 1;
                        case 1:
                          return A.trys.push([1, 3, , 4]), [4, E()];
                        case 2:
                          return C = A.sent(), T(C), [2, C];
                        case 3:
                          return $ = A.sent(), this.logger.log("Validation error", $), [2, !1];
                        case 4:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }, x = null;
                v.debounced = function(S, T) {
                  x !== null && clearTimeout(x), x = setTimeout(function() {
                    v(S, T);
                  }, p.debounce);
                };
                var _ = c instanceof HTMLSelectElement ? "change" : "input change", g = (u = c.dataset.valEvent) !== null && u !== void 0 ? u : _, w = g.split(" ");
                w.forEach(function(S) {
                  c.addEventListener(S, v.debounced);
                }), v.remove = function() {
                  w.forEach(function(S) {
                    c.removeEventListener(S, v.debounced);
                  });
                }, this.inputEvents[h] = v;
              }
            }, y.prototype.removeInput = function(c) {
              var p = this.getElementUID(c), u = this.inputEvents[p];
              u?.remove && (u.remove(), delete u.remove), delete this.summary[p], delete this.inputEvents[p], delete this.validators[p], c.form && this.untrackFormInput(c.form, p);
            }, y.prototype.scanInputs = function(c, p) {
              var u = Array.from(c.querySelectorAll(d('[data-val="true"]')));
              a(c) && c.getAttribute("data-val") === "true" && u.push(c);
              for (var h = 0; h < u.length; h++) {
                var f = u[h];
                p.call(this, f);
              }
            }, y.prototype.createSummaryDOM = function() {
              if (!Object.keys(this.summary).length)
                return null;
              var c = [], p = document.createElement("ul");
              for (var u in this.summary) {
                var h = this.elementByUID[u];
                if (!(h instanceof HTMLInputElement && (h.type === "checkbox" || h.type === "radio") && h.className === this.ValidationInputValidCssClassName) && !(c.indexOf(this.summary[u]) > -1)) {
                  var f = document.createElement("li");
                  f.innerHTML = this.summary[u], p.appendChild(f), c.push(this.summary[u]);
                }
              }
              return p;
            }, y.prototype.renderSummary = function() {
              var c = document.querySelectorAll('[data-valmsg-summary="true"]');
              if (c.length) {
                var p = JSON.stringify(this.summary, Object.keys(this.summary).sort());
                if (p !== this.renderedSummaryJSON) {
                  this.renderedSummaryJSON = p;
                  for (var u = this.createSummaryDOM(), h = 0; h < c.length; h++) {
                    for (var f = c[h], v = f.querySelectorAll("ul"), x = 0; x < v.length; x++)
                      v[x].remove();
                    u && u.hasChildNodes() ? (this.swapClasses(f, this.ValidationSummaryCssClassName, this.ValidationSummaryValidCssClassName), f.appendChild(u.cloneNode(!0))) : this.swapClasses(f, this.ValidationSummaryValidCssClassName, this.ValidationSummaryCssClassName);
                  }
                }
              }
            }, y.prototype.addError = function(c, p) {
              var u = this.getMessageFor(c);
              if (u)
                for (var h = 0; h < u.length; h++)
                  u[h], u[h].innerHTML = p, this.swapClasses(u[h], this.ValidationMessageCssClassName, this.ValidationMessageValidCssClassName);
              if (this.highlight(c, this.ValidationInputCssClassName, this.ValidationInputValidCssClassName), c.form)
                for (var f = c.form.querySelectorAll(d('[name="'.concat(c.name, '"]'))), h = 0; h < f.length; h++) {
                  this.swapClasses(f[h], this.ValidationInputCssClassName, this.ValidationInputValidCssClassName);
                  var v = this.getElementUID(f[h]);
                  this.summary[v] = p;
                }
              this.renderSummary();
            }, y.prototype.removeError = function(c) {
              var p = this.getMessageFor(c);
              if (p)
                for (var u = 0; u < p.length; u++)
                  p[u].innerHTML = "", this.swapClasses(p[u], this.ValidationMessageValidCssClassName, this.ValidationMessageCssClassName);
              if (this.unhighlight(c, this.ValidationInputCssClassName, this.ValidationInputValidCssClassName), c.form)
                for (var h = c.form.querySelectorAll(d('[name="'.concat(c.name, '"]'))), u = 0; u < h.length; u++) {
                  this.swapClasses(h[u], this.ValidationInputValidCssClassName, this.ValidationInputCssClassName);
                  var f = this.getElementUID(h[u]);
                  delete this.summary[f];
                }
              this.renderSummary();
            }, y.prototype.createValidator = function(c, p) {
              var u = this;
              return function() {
                return r(u, void 0, void 0, function() {
                  var h, f, v, x, _, g, w, S, T, E, C;
                  return s(this, function($) {
                    switch ($.label) {
                      case 0:
                        if (!(!this.isHidden(c) && !this.isDisabled(c))) return [3, 7];
                        h = p, f = [];
                        for (v in h)
                          f.push(v);
                        x = 0, $.label = 1;
                      case 1:
                        return x < f.length ? (v = f[x], v in h ? (_ = v, g = p[_], w = this.providers[_], w ? (this.logger.log("Running %s validator on element", _, c), S = w(c.value, c, g.params), T = !1, E = g.error, typeof S != "boolean" ? [3, 2] : (T = S, [3, 5])) : (this.logger.log("aspnet-validation provider not implemented: %s", _), [3, 6])) : [3, 6]) : [3, 7];
                      case 2:
                        return typeof S != "string" ? [3, 3] : (T = !1, E = S, [3, 5]);
                      case 3:
                        return [4, S];
                      case 4:
                        C = $.sent(), typeof C == "boolean" ? T = C : (T = !1, E = C), $.label = 5;
                      case 5:
                        if (!T)
                          return this.addError(c, E), [2, !1];
                        $.label = 6;
                      case 6:
                        return x++, [3, 1];
                      case 7:
                        return this.removeError(c), [2, !0];
                    }
                  });
                });
              };
            }, y.prototype.isHidden = function(c) {
              return !(this.allowHiddenFields || c.offsetWidth || c.offsetHeight || c.getClientRects().length);
            }, y.prototype.isDisabled = function(c) {
              return c.disabled;
            }, y.prototype.swapClasses = function(c, p, u) {
              p && !this.isDisabled(c) && !c.classList.contains(p) && c.classList.add(p), c.classList.contains(u) && c.classList.remove(u);
            }, y.prototype.bootstrap = function(c) {
              var p = this;
              Object.assign(this.options, c), this.addMvcProviders();
              var u = window.document, h = this.options.root, f = function() {
                p.scan(h), p.options.watch && p.watch(h);
              };
              u.readyState === "complete" || u.readyState === "interactive" ? f() : u.addEventListener("DOMContentLoaded", f);
            }, y.prototype.scan = function(c) {
              c ?? (c = this.options.root), this.logger.log("Scanning", c), this.scanMessages(c, this.pushValidationMessageSpan), this.scanInputs(c, this.addInput);
            }, y.prototype.remove = function(c) {
              c ?? (c = this.options.root), this.logger.log("Removing", c), this.scanMessages(c, this.removeValidationMessageSpan), this.scanInputs(c, this.removeInput);
            }, y.prototype.watch = function(c) {
              var p = this;
              c ?? (c = this.options.root), this.observer = new MutationObserver(function(u) {
                u.forEach(function(h) {
                  p.observed(h);
                });
              }), this.observer.observe(c, {
                attributes: !0,
                childList: !0,
                subtree: !0
              }), this.logger.log("Watching for mutations");
            }, y.prototype.observed = function(c) {
              var p, u, h;
              if (c.type === "childList") {
                for (var f = 0; f < c.addedNodes.length; f++) {
                  var v = c.addedNodes[f];
                  this.logger.log("Added node", v), v instanceof HTMLElement && this.scan(v);
                }
                for (var f = 0; f < c.removedNodes.length; f++) {
                  var v = c.removedNodes[f];
                  this.logger.log("Removed node", v), v instanceof HTMLElement && this.remove(v);
                }
              } else if (c.type === "attributes" && c.target instanceof HTMLElement) {
                var x = c.attributeName;
                if (x === "disabled") {
                  var _ = c.target;
                  this.reset(_);
                } else {
                  var g = (p = c.oldValue) !== null && p !== void 0 ? p : "", w = (h = (u = c.target.attributes[c.attributeName]) === null || u === void 0 ? void 0 : u.value) !== null && h !== void 0 ? h : "";
                  this.logger.log("Attribute '%s' changed from '%s' to '%s'", c.attributeName, g, w, c.target), g !== w && this.scan(c.target);
                }
              }
            }, y.prototype.highlight = function(c, p, u) {
              this.swapClasses(c, p, u);
            }, y.prototype.unhighlight = function(c, p, u) {
              this.swapClasses(c, u, p);
            }, y;
          })()
        );
        return n;
      })()
    ));
  })(qe)), qe.exports;
}
var wl = xl();
function Il(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _l(e, t) {
  for (var i = 0; i < t.length; i++) {
    var n = t[i];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function Sl(e, t, i) {
  return t && _l(e.prototype, t), e;
}
var El = Object.defineProperty, tt = function(e, t) {
  return El(e, "name", { value: t, configurable: !0 });
}, Tl = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.666.666 0 0 0 1.094-.217.665.665 0 0 0-.147-.73L8.94 8Z" fill="currentColor"/>\r
</svg>\r
`, Cl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24A10.667 10.667 0 0 1 5.333 16a10.56 10.56 0 0 1 2.254-6.533l14.946 14.946A10.56 10.56 0 0 1 16 26.667Zm8.413-4.134L9.467 7.587A10.56 10.56 0 0 1 16 5.333 10.667 10.667 0 0 1 26.667 16a10.56 10.56 0 0 1-2.254 6.533Z" fill="currentColor"/>\r
</svg>\r
`, $l = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16 14.667A1.333 1.333 0 0 0 14.667 16v5.333a1.333 1.333 0 0 0 2.666 0V16A1.333 1.333 0 0 0 16 14.667Zm.507-5.227a1.333 1.333 0 0 0-1.014 0 1.334 1.334 0 0 0-.44.28 1.56 1.56 0 0 0-.28.44c-.075.158-.11.332-.106.507a1.332 1.332 0 0 0 .386.946c.13.118.279.213.44.28a1.334 1.334 0 0 0 1.84-1.226 1.4 1.4 0 0 0-.386-.947 1.334 1.334 0 0 0-.44-.28ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Al = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="m19.627 11.72-5.72 5.733-2.2-2.2a1.334 1.334 0 1 0-1.88 1.881l3.133 3.146a1.333 1.333 0 0 0 1.88 0l6.667-6.667a1.333 1.333 0 1 0-1.88-1.893ZM16 2.667a13.333 13.333 0 1 0 0 26.666 13.333 13.333 0 0 0 0-26.666Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.333Z" fill="currentColor"/>\r
</svg>\r
`, Dl = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M16.334 17.667a1.334 1.334 0 0 0 1.334-1.333v-5.333a1.333 1.333 0 0 0-2.665 0v5.333a1.333 1.333 0 0 0 1.33 1.333Zm-.508 5.227c.325.134.69.134 1.014 0 .165-.064.314-.159.44-.28a1.56 1.56 0 0 0 .28-.44c.076-.158.112-.332.107-.507a1.332 1.332 0 0 0-.387-.946 1.532 1.532 0 0 0-.44-.28 1.334 1.334 0 0 0-1.838 1.226 1.4 1.4 0 0 0 .385.947c.127.121.277.216.44.28Zm.508 6.773a13.333 13.333 0 1 0 0-26.667 13.333 13.333 0 0 0 0 26.667Zm0-24A10.667 10.667 0 1 1 16.54 27a10.667 10.667 0 0 1-.206-21.333Z" fill="currentColor"/>\r
</svg>\r
`, Ol = tt(function(e) {
  return new DOMParser().parseFromString(e, "text/html").body.childNodes[0];
}, "stringToHTML"), qt = tt(function(e) {
  var t = new DOMParser().parseFromString(e, "application/xml");
  return document.importNode(t.documentElement, !0).outerHTML;
}, "getSvgNode"), O = { CONTAINER: "sn-notifications-container", NOTIFY: "sn-notify", NOTIFY_CONTENT: "sn-notify-content", NOTIFY_ICON: "sn-notify-icon", NOTIFY_CLOSE: "sn-notify-close", NOTIFY_TITLE: "sn-notify-title", NOTIFY_TEXT: "sn-notify-text", IS_X_CENTER: "sn-is-x-center", IS_Y_CENTER: "sn-is-y-center", IS_CENTER: "sn-is-center", IS_LEFT: "sn-is-left", IS_RIGHT: "sn-is-right", IS_TOP: "sn-is-top", IS_BOTTOM: "sn-is-bottom", NOTIFY_OUTLINE: "sn-notify-outline", NOTIFY_FILLED: "sn-notify-filled", NOTIFY_ERROR: "sn-notify-error", NOTIFY_WARNING: "sn-notify-warning", NOTIFY_SUCCESS: "sn-notify-success", NOTIFY_INFO: "sn-notify-info", NOTIFY_FADE: "sn-notify-fade", NOTIFY_FADE_IN: "sn-notify-fade-in", NOTIFY_SLIDE: "sn-notify-slide", NOTIFY_SLIDE_IN: "sn-notify-slide-in", NOTIFY_AUTOCLOSE: "sn-notify-autoclose" }, it = { ERROR: "error", WARNING: "warning", SUCCESS: "success", INFO: "info" }, gn = { OUTLINE: "outline", FILLED: "filled" }, We = { FADE: "fade", SLIDE: "slide" }, Wt = { CLOSE: qt(Tl), SUCCESS: qt(Al), ERROR: qt(Cl), WARNING: qt(Dl), INFO: qt($l) }, vn = tt(function(e) {
  e.wrapper.classList.add(O.NOTIFY_FADE), setTimeout(function() {
    e.wrapper.classList.add(O.NOTIFY_FADE_IN);
  }, 100);
}, "fadeIn"), yn = tt(function(e) {
  e.wrapper.classList.remove(O.NOTIFY_FADE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "fadeOut"), kl = tt(function(e) {
  e.wrapper.classList.add(O.NOTIFY_SLIDE), setTimeout(function() {
    e.wrapper.classList.add(O.NOTIFY_SLIDE_IN);
  }, 100);
}, "slideIn"), Nl = tt(function(e) {
  e.wrapper.classList.remove(O.NOTIFY_SLIDE_IN), setTimeout(function() {
    e.wrapper.remove();
  }, e.speed);
}, "slideOut"), Qr = (function() {
  function e(t) {
    var i = this;
    Il(this, e), this.notifyOut = tt(function(L) {
      L(i);
    }, "notifyOut");
    var n = t.notificationsGap, r = n === void 0 ? 20 : n, s = t.notificationsPadding, o = s === void 0 ? 20 : s, a = t.status, l = a === void 0 ? "success" : a, d = t.effect, m = d === void 0 ? We.FADE : d, b = t.type, I = b === void 0 ? "outline" : b, y = t.title, c = t.text, p = t.showIcon, u = p === void 0 ? !0 : p, h = t.customIcon, f = h === void 0 ? "" : h, v = t.customClass, x = v === void 0 ? "" : v, _ = t.speed, g = _ === void 0 ? 500 : _, w = t.showCloseButton, S = w === void 0 ? !0 : w, T = t.autoclose, E = T === void 0 ? !0 : T, C = t.autotimeout, $ = C === void 0 ? 3e3 : C, A = t.position, k = A === void 0 ? "right top" : A, D = t.customWrapper, R = D === void 0 ? "" : D;
    if (this.customWrapper = R, this.status = l, this.title = y, this.text = c, this.showIcon = u, this.customIcon = f, this.customClass = x, this.speed = g, this.effect = m, this.showCloseButton = S, this.autoclose = E, this.autotimeout = $, this.notificationsGap = r, this.notificationsPadding = o, this.type = I, this.position = k, !this.checkRequirements()) {
      console.error("You must specify 'title' or 'text' at least.");
      return;
    }
    this.setContainer(), this.setWrapper(), this.setPosition(), this.showIcon && this.setIcon(), this.showCloseButton && this.setCloseButton(), this.setContent(), this.container.prepend(this.wrapper), this.setEffect(), this.notifyIn(this.selectedNotifyInEffect), this.autoclose && this.autoClose(), this.setObserver();
  }
  return Sl(e, [{ key: "checkRequirements", value: function() {
    return !!(this.title || this.text);
  } }, { key: "setContainer", value: function() {
    var i = document.querySelector(".".concat(O.CONTAINER));
    i ? this.container = i : (this.container = document.createElement("div"), this.container.classList.add(O.CONTAINER), document.body.appendChild(this.container)), this.notificationsPadding && this.container.style.setProperty("--sn-notifications-padding", "".concat(this.notificationsPadding, "px")), this.notificationsGap && this.container.style.setProperty("--sn-notifications-gap", "".concat(this.notificationsGap, "px"));
  } }, { key: "setPosition", value: function() {
    this.container.classList[this.position === "center" ? "add" : "remove"](O.IS_CENTER), this.container.classList[this.position.includes("left") ? "add" : "remove"](O.IS_LEFT), this.container.classList[this.position.includes("right") ? "add" : "remove"](O.IS_RIGHT), this.container.classList[this.position.includes("top") ? "add" : "remove"](O.IS_TOP), this.container.classList[this.position.includes("bottom") ? "add" : "remove"](O.IS_BOTTOM), this.container.classList[this.position.includes("x-center") ? "add" : "remove"](O.IS_X_CENTER), this.container.classList[this.position.includes("y-center") ? "add" : "remove"](O.IS_Y_CENTER);
  } }, { key: "setCloseButton", value: function() {
    var i = this, n = document.createElement("div");
    n.classList.add(O.NOTIFY_CLOSE), n.innerHTML = Wt.CLOSE, this.wrapper.appendChild(n), n.addEventListener("click", function() {
      i.close();
    });
  } }, { key: "setWrapper", value: function() {
    var i = this;
    switch (this.customWrapper ? this.wrapper = Ol(this.customWrapper) : this.wrapper = document.createElement("div"), this.wrapper.style.setProperty("--sn-notify-transition-duration", "".concat(this.speed, "ms")), this.wrapper.classList.add(O.NOTIFY), this.type) {
      case gn.OUTLINE:
        this.wrapper.classList.add(O.NOTIFY_OUTLINE);
        break;
      case gn.FILLED:
        this.wrapper.classList.add(O.NOTIFY_FILLED);
        break;
      default:
        this.wrapper.classList.add(O.NOTIFY_OUTLINE);
    }
    switch (this.status) {
      case it.SUCCESS:
        this.wrapper.classList.add(O.NOTIFY_SUCCESS);
        break;
      case it.ERROR:
        this.wrapper.classList.add(O.NOTIFY_ERROR);
        break;
      case it.WARNING:
        this.wrapper.classList.add(O.NOTIFY_WARNING);
        break;
      case it.INFO:
        this.wrapper.classList.add(O.NOTIFY_INFO);
        break;
    }
    this.autoclose && (this.wrapper.classList.add(O.NOTIFY_AUTOCLOSE), this.wrapper.style.setProperty("--sn-notify-autoclose-timeout", "".concat(this.autotimeout + this.speed, "ms"))), this.customClass && this.customClass.split(" ").forEach(function(n) {
      i.wrapper.classList.add(n);
    });
  } }, { key: "setContent", value: function() {
    var i = document.createElement("div");
    i.classList.add(O.NOTIFY_CONTENT);
    var n, r;
    this.title && (n = document.createElement("div"), n.classList.add(O.NOTIFY_TITLE), n.textContent = this.title.trim(), this.showCloseButton || (n.style.paddingRight = "0")), this.text && (r = document.createElement("div"), r.classList.add(O.NOTIFY_TEXT), r.innerHTML = this.text.trim(), this.title || (r.style.marginTop = "0")), this.wrapper.appendChild(i), this.title && i.appendChild(n), this.text && i.appendChild(r);
  } }, { key: "setIcon", value: function() {
    var i = tt(function(r) {
      switch (r) {
        case it.SUCCESS:
          return Wt.SUCCESS;
        case it.ERROR:
          return Wt.ERROR;
        case it.WARNING:
          return Wt.WARNING;
        case it.INFO:
          return Wt.INFO;
      }
    }, "computedIcon"), n = document.createElement("div");
    n.classList.add(O.NOTIFY_ICON), n.innerHTML = this.customIcon || i(this.status), (this.status || this.customIcon) && this.wrapper.appendChild(n);
  } }, { key: "setObserver", value: function() {
    var i = this, n = new IntersectionObserver(function(r) {
      if (r[0].intersectionRatio <= 0) i.close();
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
      case We.FADE:
        this.selectedNotifyInEffect = vn, this.selectedNotifyOutEffect = yn;
        break;
      case We.SLIDE:
        this.selectedNotifyInEffect = kl, this.selectedNotifyOutEffect = Nl;
        break;
      default:
        this.selectedNotifyInEffect = vn, this.selectedNotifyOutEffect = yn;
    }
  } }]), e;
})();
tt(Qr, "Notify");
var ts = Qr;
globalThis.Notify = ts;
const es = ["success", "error", "warning", "info"], is = [
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
], ns = {
  status: "info",
  title: "Notification",
  text: "",
  effect: "fade",
  speed: 300,
  autoclose: !0,
  autotimeout: 4e3,
  position: "right top"
};
function jt(e = {}) {
  const t = {
    ...ns,
    ...e
  };
  es.includes(t.status) || (console.warn(`Invalid status '${t.status}' passed to Toast. Defaulting to 'info'.`), t.status = "info"), is.includes(t.position) || (console.warn(`Invalid position '${t.position}' passed to Toast. Defaulting to 'right top'.`), t.position = "right top"), new ts(t);
}
const Ml = {
  custom: jt,
  success(e, t = "Success", i = {}) {
    jt({
      status: "success",
      title: t,
      text: e,
      ...i
    });
  },
  error(e, t = "Error", i = {}) {
    jt({
      status: "error",
      title: t,
      text: e,
      ...i
    });
  },
  warning(e, t = "Warning", i = {}) {
    jt({
      status: "warning",
      title: t,
      text: e,
      ...i
    });
  },
  info(e, t = "Info", i = {}) {
    jt({
      status: "info",
      title: t,
      text: e,
      ...i
    });
  },
  setDefaults(e = {}) {
    Object.assign(ns, e);
  },
  get allowedStatuses() {
    return [...es];
  },
  get allowedPositions() {
    return [...is];
  }
}, di = function() {
}, te = {}, Ee = {}, ee = {};
function Ll(e, t) {
  e = Array.isArray(e) ? e : [e];
  const i = [];
  let n = e.length, r = n, s, o, a, l;
  for (s = function(d, m) {
    m.length && i.push(d), r--, r || t(i);
  }; n--; ) {
    if (o = e[n], a = Ee[o], a) {
      s(o, a);
      continue;
    }
    l = ee[o] = ee[o] || [], l.push(s);
  }
}
function rs(e, t) {
  if (!e) return;
  const i = ee[e];
  if (Ee[e] = t, !!i)
    for (; i.length; )
      i[0](e, t), i.splice(0, 1);
}
function hi(e, t) {
  typeof e == "function" && (e = { success: e }), t.length ? (e.error || di)(t) : (e.success || di)(e);
}
function Fl(e, t, i, n, r, s, o, a) {
  let l = e.type[0];
  if (a)
    try {
      i.sheet.cssText.length || (l = "e");
    } catch (d) {
      d.code !== 18 && (l = "e");
    }
  if (l === "e") {
    if (s += 1, s < o)
      return ss(t, n, r, s);
  } else if (i.rel === "preload" && i.as === "style") {
    i.rel = "stylesheet";
    return;
  }
  n(t, l, e.defaultPrevented);
}
function ss(e, t, i, n) {
  const r = document, s = i.async, o = (i.numRetries || 0) + 1, a = i.before || di, l = e.replace(/[\?|#].*$/, ""), d = e.replace(/^(css|img|module|nomodule)!/, "");
  let m, b, I;
  if (n = n || 0, /(^css!|\.css$)/.test(l))
    I = r.createElement("link"), I.rel = "stylesheet", I.href = d, m = "hideFocus" in I, m && I.relList && (m = 0, I.rel = "preload", I.as = "style"), i.inlineStyleNonce && I.setAttribute("nonce", i.inlineStyleNonce);
  else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l))
    I = r.createElement("img"), I.src = d;
  else if (I = r.createElement("script"), I.src = d, I.async = s === void 0 ? !0 : s, i.inlineScriptNonce && I.setAttribute("nonce", i.inlineScriptNonce), b = "noModule" in I, /^module!/.test(l)) {
    if (!b) return t(e, "l");
    I.type = "module";
  } else if (/^nomodule!/.test(l) && b)
    return t(e, "l");
  const y = function(c) {
    Fl(c, e, I, t, i, n, o, m);
  };
  I.addEventListener("load", y, { once: !0 }), I.addEventListener("error", y, { once: !0 }), a(e, I) !== !1 && r.head.appendChild(I);
}
function Pl(e, t, i) {
  e = Array.isArray(e) ? e : [e];
  let n = e.length, r = [];
  function s(o, a, l) {
    if (a === "e" && r.push(o), a === "b")
      if (l) r.push(o);
      else return;
    n--, n || t(r);
  }
  for (let o = 0; o < e.length; o++)
    ss(e[o], s, i);
}
function rt(e, t, i) {
  let n, r;
  if (t && typeof t == "string" && t.trim && (n = t.trim()), r = (n ? i : t) || {}, n) {
    if (n in te)
      throw "LoadJS";
    te[n] = !0;
  }
  function s(o, a) {
    Pl(e, function(l) {
      hi(r, l), o && hi({ success: o, error: a }, l), rs(n, l);
    }, r);
  }
  if (r.returnPromise)
    return new Promise(s);
  s();
}
rt.ready = function(t, i) {
  return Ll(t, function(n) {
    hi(i, n);
  }), rt;
};
rt.done = function(t) {
  rs(t, []);
};
rt.reset = function() {
  Object.keys(te).forEach((t) => delete te[t]), Object.keys(Ee).forEach((t) => delete Ee[t]), Object.keys(ee).forEach((t) => delete ee[t]);
};
rt.isDefined = function(t) {
  return t in te;
};
function Rl(e) {
  if (typeof Alpine > "u" || typeof Alpine.$data != "function") {
    console.error(
      "Rizzy.$data: Alpine.js context (Alpine.$data) is not available. Ensure Alpine is loaded and started before calling $data."
    );
    return;
  }
  if (e instanceof Element) {
    const t = zl(e) || e;
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
    const i = `[data-alpine-root="${as(t)}"]`;
    let n = null;
    const r = document.getElementById(t);
    if (r && (n = r.matches(i) ? r : r.querySelector(i)), n || (n = os(t)), !n) {
      console.warn(
        `Rizzy.$data: Could not locate an Alpine root using ${i} locally or globally. Verify that the teleported root rendered and that 'data-alpine-root="${t}"' is present.`
      );
      return;
    }
    const s = Alpine.$data(n);
    return s === void 0 && bn(`data-alpine-root="${t}"`, n), s;
  }
  console.warn("Rizzy.$data: Expected a non-empty string id or an Element.");
}
function zl(e) {
  if (!(e instanceof Element)) return null;
  const t = e.tagName?.toLowerCase?.() === "rz-proxy", i = e.getAttribute?.("data-for");
  if (t || i) {
    const n = i || "";
    if (!n) return e;
    const r = os(n);
    return r || (console.warn(
      `Rizzy.$data: Proxy element could not resolve Alpine root for id "${n}". Ensure the teleported root rendered with data-alpine-root="${n}".`
    ), null);
  }
  return e;
}
function os(e) {
  const t = `[data-alpine-root="${as(e)}"]`, i = document.querySelectorAll(t);
  for (const n of i)
    if (n.hasAttribute("x-data")) return n;
  return i.length > 0 ? i[0] : document.getElementById(e) || null;
}
function as(e) {
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
function Vl(e) {
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
function Bl(e) {
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
function Hl(e) {
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
function Ul(e) {
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
function ql(e) {
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
function Wl(e, t) {
  e.data("rzCalendar", () => ({
    calendar: null,
    initialized: !1,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.configId, r = this.$el.dataset.nonce;
      if (i.length === 0) {
        console.warn("RzCalendar: No assets configured.");
        return;
      }
      t(i, {
        success: () => {
          this.initCalendar(n);
        },
        error: (s) => console.error("RzCalendar: Failed to load assets", s)
      }, r);
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
        onClickWeekNumber: (a, l, d, m, b) => {
          this.dispatchCalendarEvent("click-week-number", {
            event: b,
            number: l,
            year: d,
            days: m
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
        onChangeTime: (a, l, d) => {
          this.dispatchCalendarEvent("change-time", {
            event: l,
            time: a.context.selectedTime,
            hours: a.context.selectedHours,
            minutes: a.context.selectedMinutes,
            keeping: a.context.selectedKeeping,
            isError: d
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
function jl(e) {
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
      let i, n, r = !1;
      if (this.dates.length > 0) {
        const a = this.parseIsoLocal(this.dates[0]);
        isNaN(a.getTime()) || (i = a.getMonth(), n = a.getFullYear(), r = !0);
      }
      const s = JSON.stringify({ mode: this.mode, dates: t, m: i, y: n });
      if (this._lastAppliedState === s) return;
      this._lastAppliedState = s;
      const o = { selectedDates: t };
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
      const [i, n, r] = t.split("-").map(Number), s = new Date(Date.UTC(i, n - 1, r));
      return s.getUTCFullYear() === i && s.getUTCMonth() + 1 === n && s.getUTCDate() === r;
    },
    /**
     * Executes the `_normalize` operation.
     * @param {any} input Input value for this method.
     * @returns {any} Returns the result of `_normalize` when applicable.
     */
    _normalize(t) {
      const n = (Array.isArray(t) ? t : []).flat(1 / 0).flatMap((r) => typeof r == "string" ? this._extractIsoDates(r) : []).filter((r) => this._isValidIsoDate(r));
      if (this.mode === "single")
        return [...new Set(n)].sort().slice(0, 1);
      if (this.mode === "multiple-ranged") {
        const r = n.sort();
        return r.length <= 1 ? r : [r[0], r[r.length - 1]];
      }
      return [...new Set(n)].sort();
    },
    /**
     * Executes the `parseIsoLocal` operation.
     * @param {any} s Input value for this method.
     * @returns {any} Returns the result of `parseIsoLocal` when applicable.
     */
    parseIsoLocal(t) {
      const [i, n, r] = t.split("-").map(Number);
      return new Date(i, n - 1, r);
    },
    /**
     * Executes the `toLocalISO` operation.
     * @param {any} dateObj Input value for this method.
     * @returns {any} Returns the result of `toLocalISO` when applicable.
     */
    toLocalISO(t) {
      const i = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0");
      return `${i}-${n}-${r}`;
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
function Yl(e, t) {
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
        } catch (d) {
          return console.error("[rzCarousel] Bad assets JSON:", d), [];
        }
      })(), r = this.$el.dataset.nonce || "", s = i(this.$el.dataset.config), o = s.Options || {}, a = s.Plugins || [], l = this;
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
          error(d) {
            console.error("[rzCarousel] Failed to load EmblaCarousel assets.", d);
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
    initializeEmbla(n, r) {
      const s = this.$el.querySelector('[x-ref="viewport"]');
      if (!s) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const o = this.instantiatePlugins(r);
      this.emblaApi = window.EmblaCarousel(s, n, o), this.emblaApi.on("select", this.onSelect.bind(this)), this.emblaApi.on("reInit", this.onSelect.bind(this)), this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
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
function Kl(e, t) {
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
      const i = JSON.parse(this.$el.dataset.assets), n = this.$el.dataset.codeid, r = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle, this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle, t(i, {
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
function Jl(e) {
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
function Xl(e) {
  e.data("rzClipboard", () => ({
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
        const t = document.querySelector(this.targetSelector);
        if (t)
          return t.value !== void 0 ? t.value : t.textContent;
      }
      return this.value;
    },
    async copy() {
      if (this.disabled) return;
      const t = this.getTextToCopy(), i = t ? t.trim() : "";
      if (!i) {
        this.dispatchFailed("empty-text");
        return;
      }
      try {
        navigator.clipboard && window.isSecureContext ? (await navigator.clipboard.writeText(i), this.onSuccess(i)) : this.useFallback ? this.fallbackCopy(i) ? this.onSuccess(i) : this.dispatchFailed("clipboard-unavailable") : this.dispatchFailed("clipboard-unavailable");
      } catch (n) {
        this.dispatchFailed("permission-denied", n);
      }
    },
    onSuccess(t) {
      this.copied = !0, this.$dispatch("rz:copy", { id: this.$el.dataset.alpineRoot, text: t }), this.timeoutHandle && clearTimeout(this.timeoutHandle), this.timeoutHandle = setTimeout(() => {
        this.copied = !1;
      }, this.feedbackDuration);
    },
    fallbackCopy(t) {
      const i = document.createElement("textarea");
      i.value = t, i.style.position = "fixed", i.style.left = "-999999px", i.style.top = "-999999px", document.body.appendChild(i), i.focus(), i.select();
      try {
        return document.execCommand("copy"), i.remove(), !0;
      } catch {
        return i.remove(), !1;
      }
    },
    dispatchFailed(t, i = null) {
      this.$dispatch("rz:copy-failed", {
        id: this.$el.dataset.alpineRoot,
        reason: t,
        error: i
      });
    }
  }));
}
function Gl(e, t) {
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
        error: (r) => console.error("RzCombobox: Failed to load assets.", r)
      }, n) : window.TomSelect && this.initTomSelect();
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const i = this.$refs.selectInput;
      if (!i) return;
      const n = document.getElementById(this.$el.dataset.configId), r = n ? JSON.parse(n.textContent) : {}, s = {}, o = (a, l) => {
        if (!a) return null;
        const d = document.createElement("div");
        let m = l.item;
        if (typeof m == "string")
          try {
            m = JSON.parse(m);
          } catch {
          }
        const b = {
          ...l,
          item: m
        };
        return e && typeof e.addScopeToNode == "function" ? e.addScopeToNode(d, b) : d._x_dataStack = [b], d.innerHTML = a.innerHTML, d;
      };
      this.$refs.optionTemplate && (s.option = (a, l) => o(this.$refs.optionTemplate, a)), this.$refs.itemTemplate && (s.item = (a, l) => o(this.$refs.itemTemplate, a)), r.dataAttr = "data-item", this.tomSelect = new TomSelect(i, {
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
function Zl(e, t) {
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
      this.colorPicker.open = this.openPicker.bind(this), this.colorPicker.setValue = this.setValue.bind(this), this.colorPicker.getValue = () => this.colorPicker.value, this.colorPicker.updateConfiguration = this.updateConfiguration.bind(this), this.colorPicker.value = this.readValue(this.$el.dataset.initialValue || ""), this.config = this.readConfig(), this.$watch("colorPicker.value", (r) => {
        const s = this.readValue(r);
        if (s !== r) {
          this.colorPicker.value = s;
          return;
        }
        this.syncInputFromState();
      });
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce;
      t(i, n).then(() => this.initializeColoris()).catch((r) => this.handleAssetError(r));
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
        onChange: (n, r) => {
          r === this.$refs.input && (this.syncStateFromInput(r), r.dispatchEvent(new CustomEvent("rz:colorpicker:onchange", {
            bubbles: !0,
            composed: !0,
            detail: {
              colorPicker: this.colorPicker,
              updateConfiguration: this.updateConfiguration.bind(this),
              el: r,
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
      const r = n?.currentTarget;
      if (!r || typeof r.getBoundingClientRect != "function")
        return;
      const s = r.getBoundingClientRect();
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
function Ql(e) {
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
function tc(e, t) {
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
      const r = JSON.parse(this.$el.dataset.assets), s = this.$el.dataset.nonce;
      t(r, {
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
function ec(e) {
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
const kt = Math.min, mt = Math.max, Te = Math.round, me = Math.floor, X = (e) => ({
  x: e,
  y: e
}), ic = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, nc = {
  start: "end",
  end: "start"
};
function fi(e, t, i) {
  return mt(e, kt(t, i));
}
function re(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function wt(e) {
  return e.split("-")[0];
}
function se(e) {
  return e.split("-")[1];
}
function ls(e) {
  return e === "x" ? "y" : "x";
}
function zi(e) {
  return e === "y" ? "height" : "width";
}
const rc = /* @__PURE__ */ new Set(["top", "bottom"]);
function nt(e) {
  return rc.has(wt(e)) ? "y" : "x";
}
function Vi(e) {
  return ls(nt(e));
}
function sc(e, t, i) {
  i === void 0 && (i = !1);
  const n = se(e), r = Vi(e), s = zi(r);
  let o = r === "x" ? n === (i ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (o = Ce(o)), [o, Ce(o)];
}
function oc(e) {
  const t = Ce(e);
  return [pi(e), t, pi(t)];
}
function pi(e) {
  return e.replace(/start|end/g, (t) => nc[t]);
}
const xn = ["left", "right"], wn = ["right", "left"], ac = ["top", "bottom"], lc = ["bottom", "top"];
function cc(e, t, i) {
  switch (e) {
    case "top":
    case "bottom":
      return i ? t ? wn : xn : t ? xn : wn;
    case "left":
    case "right":
      return t ? ac : lc;
    default:
      return [];
  }
}
function uc(e, t, i, n) {
  const r = se(e);
  let s = cc(wt(e), i === "start", n);
  return r && (s = s.map((o) => o + "-" + r), t && (s = s.concat(s.map(pi)))), s;
}
function Ce(e) {
  return e.replace(/left|right|bottom|top/g, (t) => ic[t]);
}
function dc(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function cs(e) {
  return typeof e != "number" ? dc(e) : {
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
    height: r
  } = e;
  return {
    width: n,
    height: r,
    top: i,
    left: t,
    right: t + n,
    bottom: i + r,
    x: t,
    y: i
  };
}
function In(e, t, i) {
  let {
    reference: n,
    floating: r
  } = e;
  const s = nt(t), o = Vi(t), a = zi(o), l = wt(t), d = s === "y", m = n.x + n.width / 2 - r.width / 2, b = n.y + n.height / 2 - r.height / 2, I = n[a] / 2 - r[a] / 2;
  let y;
  switch (l) {
    case "top":
      y = {
        x: m,
        y: n.y - r.height
      };
      break;
    case "bottom":
      y = {
        x: m,
        y: n.y + n.height
      };
      break;
    case "right":
      y = {
        x: n.x + n.width,
        y: b
      };
      break;
    case "left":
      y = {
        x: n.x - r.width,
        y: b
      };
      break;
    default:
      y = {
        x: n.x,
        y: n.y
      };
  }
  switch (se(t)) {
    case "start":
      y[o] -= I * (i && d ? -1 : 1);
      break;
    case "end":
      y[o] += I * (i && d ? -1 : 1);
      break;
  }
  return y;
}
async function hc(e, t) {
  var i;
  t === void 0 && (t = {});
  const {
    x: n,
    y: r,
    platform: s,
    rects: o,
    elements: a,
    strategy: l
  } = e, {
    boundary: d = "clippingAncestors",
    rootBoundary: m = "viewport",
    elementContext: b = "floating",
    altBoundary: I = !1,
    padding: y = 0
  } = re(t, e), c = cs(y), u = a[I ? b === "floating" ? "reference" : "floating" : b], h = $e(await s.getClippingRect({
    element: (i = await (s.isElement == null ? void 0 : s.isElement(u))) == null || i ? u : u.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: d,
    rootBoundary: m,
    strategy: l
  })), f = b === "floating" ? {
    x: n,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, v = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), x = await (s.isElement == null ? void 0 : s.isElement(v)) ? await (s.getScale == null ? void 0 : s.getScale(v)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = $e(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: f,
    offsetParent: v,
    strategy: l
  }) : f);
  return {
    top: (h.top - _.top + c.top) / x.y,
    bottom: (_.bottom - h.bottom + c.bottom) / x.y,
    left: (h.left - _.left + c.left) / x.x,
    right: (_.right - h.right + c.right) / x.x
  };
}
const fc = async (e, t, i) => {
  const {
    placement: n = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = i, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(t));
  let d = await o.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: m,
    y: b
  } = In(d, n, l), I = n, y = {}, c = 0;
  for (let u = 0; u < a.length; u++) {
    var p;
    const {
      name: h,
      fn: f
    } = a[u], {
      x: v,
      y: x,
      data: _,
      reset: g
    } = await f({
      x: m,
      y: b,
      initialPlacement: n,
      placement: I,
      strategy: r,
      middlewareData: y,
      rects: d,
      platform: {
        ...o,
        detectOverflow: (p = o.detectOverflow) != null ? p : hc
      },
      elements: {
        reference: e,
        floating: t
      }
    });
    m = v ?? m, b = x ?? b, y = {
      ...y,
      [h]: {
        ...y[h],
        ..._
      }
    }, g && c <= 50 && (c++, typeof g == "object" && (g.placement && (I = g.placement), g.rects && (d = g.rects === !0 ? await o.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : g.rects), {
      x: m,
      y: b
    } = In(d, I, l)), u = -1);
  }
  return {
    x: m,
    y: b,
    placement: I,
    strategy: r,
    middlewareData: y
  };
}, pc = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: i,
      y: n,
      placement: r,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = t, {
      element: d,
      padding: m = 0
    } = re(e, t) || {};
    if (d == null)
      return {};
    const b = cs(m), I = {
      x: i,
      y: n
    }, y = Vi(r), c = zi(y), p = await o.getDimensions(d), u = y === "y", h = u ? "top" : "left", f = u ? "bottom" : "right", v = u ? "clientHeight" : "clientWidth", x = s.reference[c] + s.reference[y] - I[y] - s.floating[c], _ = I[y] - s.reference[y], g = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(d));
    let w = g ? g[v] : 0;
    (!w || !await (o.isElement == null ? void 0 : o.isElement(g))) && (w = a.floating[v] || s.floating[c]);
    const S = x / 2 - _ / 2, T = w / 2 - p[c] / 2 - 1, E = kt(b[h], T), C = kt(b[f], T), $ = E, A = w - p[c] - C, k = w / 2 - p[c] / 2 + S, D = fi($, k, A), R = !l.arrow && se(r) != null && k !== D && s.reference[c] / 2 - (k < $ ? E : C) - p[c] / 2 < 0, L = R ? k < $ ? k - $ : k - A : 0;
    return {
      [y]: I[y] + L,
      data: {
        [y]: D,
        centerOffset: k - D - L,
        ...R && {
          alignmentOffset: L
        }
      },
      reset: R
    };
  }
}), mc = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var i, n;
      const {
        placement: r,
        middlewareData: s,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: d
      } = t, {
        mainAxis: m = !0,
        crossAxis: b = !0,
        fallbackPlacements: I,
        fallbackStrategy: y = "bestFit",
        fallbackAxisSideDirection: c = "none",
        flipAlignment: p = !0,
        ...u
      } = re(e, t);
      if ((i = s.arrow) != null && i.alignmentOffset)
        return {};
      const h = wt(r), f = nt(a), v = wt(a) === a, x = await (l.isRTL == null ? void 0 : l.isRTL(d.floating)), _ = I || (v || !p ? [Ce(a)] : oc(a)), g = c !== "none";
      !I && g && _.push(...uc(a, p, c, x));
      const w = [a, ..._], S = await l.detectOverflow(t, u), T = [];
      let E = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (m && T.push(S[h]), b) {
        const k = sc(r, o, x);
        T.push(S[k[0]], S[k[1]]);
      }
      if (E = [...E, {
        placement: r,
        overflows: T
      }], !T.every((k) => k <= 0)) {
        var C, $;
        const k = (((C = s.flip) == null ? void 0 : C.index) || 0) + 1, D = w[k];
        if (D && (!(b === "alignment" ? f !== nt(D) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        E.every((P) => nt(P.placement) === f ? P.overflows[0] > 0 : !0)))
          return {
            data: {
              index: k,
              overflows: E
            },
            reset: {
              placement: D
            }
          };
        let R = ($ = E.filter((L) => L.overflows[0] <= 0).sort((L, P) => L.overflows[1] - P.overflows[1])[0]) == null ? void 0 : $.placement;
        if (!R)
          switch (y) {
            case "bestFit": {
              var A;
              const L = (A = E.filter((P) => {
                if (g) {
                  const Y = nt(P.placement);
                  return Y === f || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Y === "y";
                }
                return !0;
              }).map((P) => [P.placement, P.overflows.filter((Y) => Y > 0).reduce((Y, bs) => Y + bs, 0)]).sort((P, Y) => P[1] - Y[1])[0]) == null ? void 0 : A[0];
              L && (R = L);
              break;
            }
            case "initialPlacement":
              R = a;
              break;
          }
        if (r !== R)
          return {
            reset: {
              placement: R
            }
          };
      }
      return {};
    }
  };
}, gc = /* @__PURE__ */ new Set(["left", "top"]);
async function vc(e, t) {
  const {
    placement: i,
    platform: n,
    elements: r
  } = e, s = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), o = wt(i), a = se(i), l = nt(i) === "y", d = gc.has(o) ? -1 : 1, m = s && l ? -1 : 1, b = re(t, e);
  let {
    mainAxis: I,
    crossAxis: y,
    alignmentAxis: c
  } = typeof b == "number" ? {
    mainAxis: b,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: b.mainAxis || 0,
    crossAxis: b.crossAxis || 0,
    alignmentAxis: b.alignmentAxis
  };
  return a && typeof c == "number" && (y = a === "end" ? c * -1 : c), l ? {
    x: y * m,
    y: I * d
  } : {
    x: I * d,
    y: y * m
  };
}
const yc = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var i, n;
      const {
        x: r,
        y: s,
        placement: o,
        middlewareData: a
      } = t, l = await vc(t, e);
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
}, bc = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: i,
        y: n,
        placement: r,
        platform: s
      } = t, {
        mainAxis: o = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (h) => {
            let {
              x: f,
              y: v
            } = h;
            return {
              x: f,
              y: v
            };
          }
        },
        ...d
      } = re(e, t), m = {
        x: i,
        y: n
      }, b = await s.detectOverflow(t, d), I = nt(wt(r)), y = ls(I);
      let c = m[y], p = m[I];
      if (o) {
        const h = y === "y" ? "top" : "left", f = y === "y" ? "bottom" : "right", v = c + b[h], x = c - b[f];
        c = fi(v, c, x);
      }
      if (a) {
        const h = I === "y" ? "top" : "left", f = I === "y" ? "bottom" : "right", v = p + b[h], x = p - b[f];
        p = fi(v, p, x);
      }
      const u = l.fn({
        ...t,
        [y]: c,
        [I]: p
      });
      return {
        ...u,
        data: {
          x: u.x - i,
          y: u.y - n,
          enabled: {
            [y]: o,
            [I]: a
          }
        }
      };
    }
  };
};
function Fe() {
  return typeof window < "u";
}
function zt(e) {
  return us(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function B(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Z(e) {
  var t;
  return (t = (us(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function us(e) {
  return Fe() ? e instanceof Node || e instanceof B(e).Node : !1;
}
function q(e) {
  return Fe() ? e instanceof Element || e instanceof B(e).Element : !1;
}
function G(e) {
  return Fe() ? e instanceof HTMLElement || e instanceof B(e).HTMLElement : !1;
}
function _n(e) {
  return !Fe() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof B(e).ShadowRoot;
}
const xc = /* @__PURE__ */ new Set(["inline", "contents"]);
function oe(e) {
  const {
    overflow: t,
    overflowX: i,
    overflowY: n,
    display: r
  } = W(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + i) && !xc.has(r);
}
const wc = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Ic(e) {
  return wc.has(zt(e));
}
const _c = [":popover-open", ":modal"];
function Pe(e) {
  return _c.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const Sc = ["transform", "translate", "scale", "rotate", "perspective"], Ec = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Tc = ["paint", "layout", "strict", "content"];
function Bi(e) {
  const t = Hi(), i = q(e) ? W(e) : e;
  return Sc.some((n) => i[n] ? i[n] !== "none" : !1) || (i.containerType ? i.containerType !== "normal" : !1) || !t && (i.backdropFilter ? i.backdropFilter !== "none" : !1) || !t && (i.filter ? i.filter !== "none" : !1) || Ec.some((n) => (i.willChange || "").includes(n)) || Tc.some((n) => (i.contain || "").includes(n));
}
function Cc(e) {
  let t = at(e);
  for (; G(t) && !Nt(t); ) {
    if (Bi(t))
      return t;
    if (Pe(t))
      return null;
    t = at(t);
  }
  return null;
}
function Hi() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const $c = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Nt(e) {
  return $c.has(zt(e));
}
function W(e) {
  return B(e).getComputedStyle(e);
}
function Re(e) {
  return q(e) ? {
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
    _n(e) && e.host || // Fallback.
    Z(e)
  );
  return _n(t) ? t.host : t;
}
function ds(e) {
  const t = at(e);
  return Nt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : G(t) && oe(t) ? t : ds(t);
}
function ie(e, t, i) {
  var n;
  t === void 0 && (t = []), i === void 0 && (i = !0);
  const r = ds(e), s = r === ((n = e.ownerDocument) == null ? void 0 : n.body), o = B(r);
  if (s) {
    const a = mi(o);
    return t.concat(o, o.visualViewport || [], oe(r) ? r : [], a && i ? ie(a) : []);
  }
  return t.concat(r, ie(r, [], i));
}
function mi(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function hs(e) {
  const t = W(e);
  let i = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const r = G(e), s = r ? e.offsetWidth : i, o = r ? e.offsetHeight : n, a = Te(i) !== s || Te(n) !== o;
  return a && (i = s, n = o), {
    width: i,
    height: n,
    $: a
  };
}
function Ui(e) {
  return q(e) ? e : e.contextElement;
}
function Dt(e) {
  const t = Ui(e);
  if (!G(t))
    return X(1);
  const i = t.getBoundingClientRect(), {
    width: n,
    height: r,
    $: s
  } = hs(t);
  let o = (s ? Te(i.width) : i.width) / n, a = (s ? Te(i.height) : i.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Ac = /* @__PURE__ */ X(0);
function fs(e) {
  const t = B(e);
  return !Hi() || !t.visualViewport ? Ac : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Dc(e, t, i) {
  return t === void 0 && (t = !1), !i || t && i !== B(e) ? !1 : t;
}
function It(e, t, i, n) {
  t === void 0 && (t = !1), i === void 0 && (i = !1);
  const r = e.getBoundingClientRect(), s = Ui(e);
  let o = X(1);
  t && (n ? q(n) && (o = Dt(n)) : o = Dt(e));
  const a = Dc(s, i, n) ? fs(s) : X(0);
  let l = (r.left + a.x) / o.x, d = (r.top + a.y) / o.y, m = r.width / o.x, b = r.height / o.y;
  if (s) {
    const I = B(s), y = n && q(n) ? B(n) : n;
    let c = I, p = mi(c);
    for (; p && n && y !== c; ) {
      const u = Dt(p), h = p.getBoundingClientRect(), f = W(p), v = h.left + (p.clientLeft + parseFloat(f.paddingLeft)) * u.x, x = h.top + (p.clientTop + parseFloat(f.paddingTop)) * u.y;
      l *= u.x, d *= u.y, m *= u.x, b *= u.y, l += v, d += x, c = B(p), p = mi(c);
    }
  }
  return $e({
    width: m,
    height: b,
    x: l,
    y: d
  });
}
function ze(e, t) {
  const i = Re(e).scrollLeft;
  return t ? t.left + i : It(Z(e)).left + i;
}
function ps(e, t) {
  const i = e.getBoundingClientRect(), n = i.left + t.scrollLeft - ze(e, i), r = i.top + t.scrollTop;
  return {
    x: n,
    y: r
  };
}
function Oc(e) {
  let {
    elements: t,
    rect: i,
    offsetParent: n,
    strategy: r
  } = e;
  const s = r === "fixed", o = Z(n), a = t ? Pe(t.floating) : !1;
  if (n === o || a && s)
    return i;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, d = X(1);
  const m = X(0), b = G(n);
  if ((b || !b && !s) && ((zt(n) !== "body" || oe(o)) && (l = Re(n)), G(n))) {
    const y = It(n);
    d = Dt(n), m.x = y.x + n.clientLeft, m.y = y.y + n.clientTop;
  }
  const I = o && !b && !s ? ps(o, l) : X(0);
  return {
    width: i.width * d.x,
    height: i.height * d.y,
    x: i.x * d.x - l.scrollLeft * d.x + m.x + I.x,
    y: i.y * d.y - l.scrollTop * d.y + m.y + I.y
  };
}
function kc(e) {
  return Array.from(e.getClientRects());
}
function Nc(e) {
  const t = Z(e), i = Re(e), n = e.ownerDocument.body, r = mt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = mt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let o = -i.scrollLeft + ze(e);
  const a = -i.scrollTop;
  return W(n).direction === "rtl" && (o += mt(t.clientWidth, n.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
const Sn = 25;
function Mc(e, t) {
  const i = B(e), n = Z(e), r = i.visualViewport;
  let s = n.clientWidth, o = n.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const m = Hi();
    (!m || m && t === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const d = ze(n);
  if (d <= 0) {
    const m = n.ownerDocument, b = m.body, I = getComputedStyle(b), y = m.compatMode === "CSS1Compat" && parseFloat(I.marginLeft) + parseFloat(I.marginRight) || 0, c = Math.abs(n.clientWidth - b.clientWidth - y);
    c <= Sn && (s -= c);
  } else d <= Sn && (s += d);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const Lc = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Fc(e, t) {
  const i = It(e, !0, t === "fixed"), n = i.top + e.clientTop, r = i.left + e.clientLeft, s = G(e) ? Dt(e) : X(1), o = e.clientWidth * s.x, a = e.clientHeight * s.y, l = r * s.x, d = n * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: d
  };
}
function En(e, t, i) {
  let n;
  if (t === "viewport")
    n = Mc(e, i);
  else if (t === "document")
    n = Nc(Z(e));
  else if (q(t))
    n = Fc(t, i);
  else {
    const r = fs(e);
    n = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return $e(n);
}
function ms(e, t) {
  const i = at(e);
  return i === t || !q(i) || Nt(i) ? !1 : W(i).position === "fixed" || ms(i, t);
}
function Pc(e, t) {
  const i = t.get(e);
  if (i)
    return i;
  let n = ie(e, [], !1).filter((a) => q(a) && zt(a) !== "body"), r = null;
  const s = W(e).position === "fixed";
  let o = s ? at(e) : e;
  for (; q(o) && !Nt(o); ) {
    const a = W(o), l = Bi(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && Lc.has(r.position) || oe(o) && !l && ms(e, o)) ? n = n.filter((m) => m !== o) : r = a, o = at(o);
  }
  return t.set(e, n), n;
}
function Rc(e) {
  let {
    element: t,
    boundary: i,
    rootBoundary: n,
    strategy: r
  } = e;
  const o = [...i === "clippingAncestors" ? Pe(t) ? [] : Pc(t, this._c) : [].concat(i), n], a = o[0], l = o.reduce((d, m) => {
    const b = En(t, m, r);
    return d.top = mt(b.top, d.top), d.right = kt(b.right, d.right), d.bottom = kt(b.bottom, d.bottom), d.left = mt(b.left, d.left), d;
  }, En(t, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function zc(e) {
  const {
    width: t,
    height: i
  } = hs(e);
  return {
    width: t,
    height: i
  };
}
function Vc(e, t, i) {
  const n = G(t), r = Z(t), s = i === "fixed", o = It(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = X(0);
  function d() {
    l.x = ze(r);
  }
  if (n || !n && !s)
    if ((zt(t) !== "body" || oe(r)) && (a = Re(t)), n) {
      const y = It(t, !0, s, t);
      l.x = y.x + t.clientLeft, l.y = y.y + t.clientTop;
    } else r && d();
  s && !n && r && d();
  const m = r && !n && !s ? ps(r, a) : X(0), b = o.left + a.scrollLeft - l.x - m.x, I = o.top + a.scrollTop - l.y - m.y;
  return {
    x: b,
    y: I,
    width: o.width,
    height: o.height
  };
}
function je(e) {
  return W(e).position === "static";
}
function Tn(e, t) {
  if (!G(e) || W(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let i = e.offsetParent;
  return Z(e) === i && (i = i.ownerDocument.body), i;
}
function gs(e, t) {
  const i = B(e);
  if (Pe(e))
    return i;
  if (!G(e)) {
    let r = at(e);
    for (; r && !Nt(r); ) {
      if (q(r) && !je(r))
        return r;
      r = at(r);
    }
    return i;
  }
  let n = Tn(e, t);
  for (; n && Ic(n) && je(n); )
    n = Tn(n, t);
  return n && Nt(n) && je(n) && !Bi(n) ? i : n || Cc(e) || i;
}
const Bc = async function(e) {
  const t = this.getOffsetParent || gs, i = this.getDimensions, n = await i(e.floating);
  return {
    reference: Vc(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function Hc(e) {
  return W(e).direction === "rtl";
}
const Uc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Oc,
  getDocumentElement: Z,
  getClippingRect: Rc,
  getOffsetParent: gs,
  getElementRects: Bc,
  getClientRects: kc,
  getDimensions: zc,
  getScale: Dt,
  isElement: q,
  isRTL: Hc
};
function vs(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function qc(e, t) {
  let i = null, n;
  const r = Z(e);
  function s() {
    var a;
    clearTimeout(n), (a = i) == null || a.disconnect(), i = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const d = e.getBoundingClientRect(), {
      left: m,
      top: b,
      width: I,
      height: y
    } = d;
    if (a || t(), !I || !y)
      return;
    const c = me(b), p = me(r.clientWidth - (m + I)), u = me(r.clientHeight - (b + y)), h = me(m), v = {
      rootMargin: -c + "px " + -p + "px " + -u + "px " + -h + "px",
      threshold: mt(0, kt(1, l)) || 1
    };
    let x = !0;
    function _(g) {
      const w = g[0].intersectionRatio;
      if (w !== l) {
        if (!x)
          return o();
        w ? o(!1, w) : n = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      w === 1 && !vs(d, e.getBoundingClientRect()) && o(), x = !1;
    }
    try {
      i = new IntersectionObserver(_, {
        ...v,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      i = new IntersectionObserver(_, v);
    }
    i.observe(e);
  }
  return o(!0), s;
}
function ys(e, t, i, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, d = Ui(e), m = r || s ? [...d ? ie(d) : [], ...ie(t)] : [];
  m.forEach((h) => {
    r && h.addEventListener("scroll", i, {
      passive: !0
    }), s && h.addEventListener("resize", i);
  });
  const b = d && a ? qc(d, i) : null;
  let I = -1, y = null;
  o && (y = new ResizeObserver((h) => {
    let [f] = h;
    f && f.target === d && y && (y.unobserve(t), cancelAnimationFrame(I), I = requestAnimationFrame(() => {
      var v;
      (v = y) == null || v.observe(t);
    })), i();
  }), d && !l && y.observe(d), y.observe(t));
  let c, p = l ? It(e) : null;
  l && u();
  function u() {
    const h = It(e);
    p && !vs(p, h) && i(), p = h, c = requestAnimationFrame(u);
  }
  return i(), () => {
    var h;
    m.forEach((f) => {
      r && f.removeEventListener("scroll", i), s && f.removeEventListener("resize", i);
    }), b?.(), (h = y) == null || h.disconnect(), y = null, l && cancelAnimationFrame(c);
  };
}
const _t = yc, St = bc, Et = mc, Wc = pc, Tt = (e, t, i) => {
  const n = /* @__PURE__ */ new Map(), r = {
    platform: Uc,
    ...i
  }, s = {
    ...r.platform,
    _c: n
  };
  return fc(e, t, {
    ...r,
    platform: s
  });
};
function jc(e) {
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
        middleware: [_t(this.pixelOffset), Et(), St({ padding: 8 })]
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
          Array.from(n).some((s) => e.$data(s)?.open) || (this.parentDropdown.isSubmenuActive = !1);
        }), this.contentEl = null);
      });
    },
    // --- METHODS ---
    updatePosition(t) {
      !this.triggerEl || !t || Tt(this.triggerEl, t, {
        placement: this.anchor,
        middleware: [_t(this.pixelOffset), Et(), St({ padding: 8 })]
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
function Yc(e) {
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
function Kc(e) {
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
        const n = this.iframe;
        this.onDarkModeToggle = (r) => {
          n.contentWindow.postMessage(r.detail, "*");
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
              const r = n.scrollHeight + 15;
              t.style.height = r + "px";
            }
          }
        } catch (i) {
          console.error("Error resizing iframe:", i);
        }
    },
    // Debounce helper to limit function calls
    debounce(t, i = 300) {
      let n;
      return (...r) => {
        clearTimeout(n), n = setTimeout(() => {
          t.apply(this, r);
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
const Cn = 160;
function Jc(e) {
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
      const r = [], s = /* @__PURE__ */ new Set();
      for (const o of t)
        !o || s.has(o) || (s.add(o), r.push(o));
      return r;
    },
    resolveTargetElement(t) {
      return t === "window" ? window : t === "document" ? document : document.querySelector(t);
    },
    createHandler(t) {
      return (i) => {
        if (this.paused)
          return;
        const n = i?.type || t, r = i instanceof CustomEvent ? i.detail : i?.detail, s = this.applyFilter(r, this.filterPath);
        this.entries.push(this.buildEntry(n, s)), this.enforceMaxEntries(), this.scrollToBottom();
      };
    },
    buildEntry(t, i) {
      const n = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "", r = this.stringifyDetail(i, this.pretty), s = this.buildBodyPreview(i), o = this.appendMetaSuffix(r), a = this.appendMetaSuffix(s);
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
      return t.length <= Cn ? t : `${t.slice(0, Cn - 1)}…`;
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
      for (const r of this.entries) {
        const s = r.id === this.expandedEntryId;
        r.expanded = s, r.toggleClass = s ? "rotate-90" : "", r.toggleLabel = s ? this.collapseText : this.expandText;
      }
    },
    stringifyDetail(t, i) {
      if (t === void 0) return "undefined";
      if (t === null) return "null";
      if (typeof t == "string") return t;
      if (typeof t == "number" || typeof t == "boolean") return String(t);
      const n = /* @__PURE__ */ new WeakSet(), r = (o) => !o || typeof o != "object" ? !1 : typeof Node < "u" && o instanceof Node || typeof Window < "u" && o instanceof Window ? !0 : typeof o.nodeType == "number" && typeof o.nodeName == "string", s = (o, a) => {
        if (a === void 0) return "undefined";
        if (typeof a == "function") return "function (hidden)";
        if (typeof a == "bigint") return `${a}n`;
        if (typeof a == "symbol") return "symbol (hidden)";
        if (r(a)) return "element (hidden)";
        if (a && typeof a == "object") {
          if (n.has(a))
            return "[circular]";
          n.add(a);
        }
        return a;
      };
      try {
        return i ? JSON.stringify(t, s, 2) : JSON.stringify(t, s);
      } catch {
        return "[unserializable detail]";
      }
    },
    applyFilter(t, i) {
      if (!i || i.trim().length === 0)
        return t;
      const n = i.split(".").map((s) => s.trim()).filter(Boolean);
      let r = t;
      for (const s of n) {
        if (r == null || typeof r != "object" || !(s in r))
          return;
        r = r[s];
      }
      return r;
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
function Xc(e) {
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
      const n = t?.currentTarget?.dataset?.index, r = Number.parseInt(n ?? "-1", 10);
      if (Number.isNaN(r) || r < 0)
        return;
      const s = new DataTransfer();
      Array.from(i.files).forEach((o, a) => {
        a !== r && s.items.add(o);
      }), i.files = s.files, this.syncFromInput();
    },
    applyDroppedFiles(t, i) {
      const n = new DataTransfer();
      t.multiple && t.files ? (Array.from(t.files).forEach((s) => n.items.add(s)), Array.from(i).forEach((s) => n.items.add(s))) : i.length > 0 && n.items.add(i[0]), t.files = n.files;
    },
    syncFromInput() {
      const t = this.$refs.input;
      if (this.revokePreviews(), !t?.files) {
        this.files = [], this.hasFiles = !1;
        return;
      }
      this.files = Array.from(t.files).map((i) => {
        const n = i.type.startsWith("image/"), r = n ? URL.createObjectURL(i) : null;
        return {
          name: i.name,
          size: i.size,
          formattedSize: this.formatFileSize(i.size),
          isImage: n,
          previewUrl: r
        };
      }), this.hasFiles = this.files.length > 0;
    },
    formatFileSize(t) {
      if (!Number.isFinite(t) || t <= 0)
        return "0 B";
      const i = ["B", "KB", "MB", "GB", "TB"], n = Math.min(Math.floor(Math.log(t) / Math.log(1024)), i.length - 1), r = t / 1024 ** n;
      return `${r >= 10 || n === 0 ? Math.round(r) : r.toFixed(1)} ${i[n]}`;
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
function Gc(e) {
  e.data("rzEmpty", () => {
  });
}
function Zc(e) {
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
        const i = (r, s) => {
          r.forEach((o) => {
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
function Qc(e) {
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
function tu(e) {
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
function eu(e) {
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
      const i = t.clipboardData ? t.clipboardData.getData("text") : "", n = this.sanitizeValue(i), r = this.value;
      this.clearSelection(), this.value = n, this.activeIndex = this.getMaxFocusableIndex(), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(r), this.dispatchChangeEvent(r);
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
      const t = this.slots.map((n, r) => ({ slot: n, index: r })).filter(({ slot: n }) => n.char !== "").map(({ index: n }) => n);
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
      const n = i.selectionStart, r = n == null ? Number.isFinite(t) ? Number(t) : 0 : Number(n), s = this.normalizeIndex(r);
      if (this.canFocusIndex(s)) {
        this.activeIndex = s;
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
      const n = this.canFocusIndex(this.activeIndex) ? this.normalizeIndex(this.activeIndex) : this.getMaxFocusableIndex(), r = this.value.split("");
      for (; r.length < n; )
        r.push("");
      r[n] = i;
      const s = this.value;
      this.value = this.applyTextTransform(r.join("").slice(0, this.length)), this.clearSelection(), this.activeIndex = this.getMaxFocusableIndex(n + 1), this.applyValueToInput(), this.refreshSlots(), this.dispatchInputEvent(s), this.dispatchChangeEvent(s);
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
        const n = this.value.charAt(i) || "", r = this.selectedIndexes.includes(i), s = this.isFocused && !this.hasSelection() && i === this.activeIndex, o = this.isFocused && !this.hasSelection() && s && n === "";
        t.push({ char: n, isActive: s, hasFakeCaret: o, isSelected: r }), i += 1;
      }
      this.slots = t;
    },
    updateSlotDom() {
      const t = this.$el?.closest("[data-alpine-root]") || this.$el;
      (this.slotElements.length > 0 ? this.slotElements : t.querySelectorAll('[data-input-otp-slot="true"]')).forEach((n) => {
        const r = Number(n.dataset.index || "0"), s = this.slots[r] || { char: "", isActive: !1, hasFakeCaret: !1, isSelected: !1 };
        n.dataset.active = s.isActive ? "true" : "false", n.dataset.focused = this.isFocused ? "true" : "false", n.dataset.selected = s.isSelected ? "true" : "false", n.dataset.focusable = this.canFocusIndex(r) ? "true" : "false", this.isInvalid ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid");
        const o = n.querySelector('[data-input-otp-char="true"]');
        o && (o.textContent = s.char);
        const a = n.querySelector('[data-input-otp-caret="true"]');
        a && (s.hasFakeCaret ? a.classList.remove("hidden") : a.classList.add("hidden"));
      });
    },
    normalizeIndex(t) {
      return this.length <= 0 || t < 0 ? 0 : t > this.length - 1 ? this.length - 1 : t;
    }
  }));
}
function iu(e, t) {
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
function nu(e) {
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
          middleware: [_t(4), Et(), St({ padding: 8 })]
        }).then(({ x: r, y: s }) => {
          Object.assign(n.style, { left: `${r}px`, top: `${s}px` });
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
        const r = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]')), s = r.indexOf(i);
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
        const r = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        if (!r?.id) break;
        i.unshift(r.id), n = n.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
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
      const i = t.currentTarget, n = this.buildPathToSubTrigger(i), r = this.openPath.length === n.length && this.openPath.every((s, o) => s === n[o]);
      this.setOpenPath(r ? n.slice(0, -1) : n);
    },
    handleSubTriggerKeyRight(t) {
      this.handleSubTriggerPointerEnter(t), this.$nextTick(() => {
        t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]')?.focus();
      });
    },
    focusNextItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), r = n < 0 || n >= i.length - 1 ? 0 : n + 1;
      i[r]?.focus();
    },
    focusPreviousItem(t) {
      const i = Array.from(t.currentTarget.querySelectorAll('[role^="menuitem"]'));
      if (!i.length) return;
      const n = i.indexOf(document.activeElement), r = n <= 0 ? i.length - 1 : n - 1;
      i[r]?.focus();
    },
    handleSubContentLeftKey(t) {
      const n = t.currentTarget.closest('[data-slot="menubar-sub"]')?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
      if (!n) return;
      const r = this.buildPathToSubTrigger(n);
      this.setOpenPath(r.slice(0, -1)), n.focus();
    },
    syncSubmenus() {
      ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll('[data-slot="menubar-sub"]') ?? []).forEach((n) => {
        const r = n.querySelector(':scope > [data-slot="menubar-sub-trigger"]'), s = n.querySelector(':scope > [data-slot="menubar-sub-content"]'), o = r?.id, a = !!o && this.openPath.includes(o);
        this.setTriggerState(r, a), s && (s.hidden = !a, s.style.display = a ? "" : "none", s.dataset.state = a ? "open" : "closed", a && r && Tt(r, s, {
          placement: "right-start",
          middleware: [_t(4), Et(), St({ padding: 8 })]
        }).then(({ x: l, y: d }) => {
          Object.assign(s.style, { left: `${l}px`, top: `${d}px` });
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
function ru(e, t) {
  e.data("rzNavigationMenu", () => ({
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
      const r = n.querySelector('[x-ref^="trigger_"]');
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
    openMenu(i) {
      this.cancelClose(), this.isClosing = !1;
      const n = this._triggerIndex(i), r = n > (this.prevIndex ?? n) ? "end" : "start", s = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== i) {
        const l = this.$refs[`trigger_${this.activeItemId}`];
        l && delete l.dataset.state;
        const d = this._contentEl(this.activeItemId);
        if (d) {
          const m = r === "end" ? "start" : "end";
          d.setAttribute("data-motion", `to-${m}`), setTimeout(() => {
            d.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = i, this.open = !0, this.prevIndex = n;
      const o = this.$refs[`trigger_${i}`], a = this._contentEl(i);
      !o || !a || (Tt(o, a, {
        placement: "bottom-start",
        middleware: [_t(6), Et(), St({ padding: 8 })]
      }).then(({ x: l, y: d }) => {
        Object.assign(a.style, { left: `${l}px`, top: `${d}px` });
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
function su(e) {
  e.data("rzPopover", () => ({
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
      this.triggerEl = this.resolveTriggerElement(), this.$watch("open", (t) => {
        if (this.ariaExpanded = t.toString(), this.dataState = t ? "open" : "closed", t) {
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
      this.teardownAutoUpdate(), this.detachGlobalListeners(), this.contentStyle = "", this.contentEl = null;
    },
    resolveTriggerElement() {
      const t = Array.from(this.$el.children).find((i) => i?.hasAttribute?.("data-trigger"));
      return t || this.$el.querySelector("[data-trigger]");
    },
    resolveContentElement() {
      const t = this.$el.dataset.contentId;
      return t ? document.getElementById(t) : null;
    },
    attachGlobalListeners() {
      this._documentClickHandler || (this._documentClickHandler = (t) => this.handleDocumentClick(t), document.addEventListener("pointerdown", this._documentClickHandler)), this._windowKeydownHandler || (this._windowKeydownHandler = (t) => this.handleWindowKeydown(t), window.addEventListener("keydown", this._windowKeydownHandler));
    },
    detachGlobalListeners() {
      this._documentClickHandler && (document.removeEventListener("pointerdown", this._documentClickHandler), this._documentClickHandler = null), this._windowKeydownHandler && (window.removeEventListener("keydown", this._windowKeydownHandler), this._windowKeydownHandler = null);
    },
    startAutoUpdate() {
      this.teardownAutoUpdate(), !(!this.triggerEl || !this.contentEl) && (this._cleanupAutoUpdate = ys(this.triggerEl, this.contentEl, () => {
        this.updatePosition();
      }));
    },
    teardownAutoUpdate() {
      this._cleanupAutoUpdate && (this._cleanupAutoUpdate(), this._cleanupAutoUpdate = null);
    },
    parseNumber(t, i = null) {
      if (t == null || t === "")
        return i;
      const n = Number(t);
      return Number.isNaN(n) ? i : n;
    },
    getInitialContentStyle() {
      return `position: ${this.$el.dataset.strategy || "absolute"}; left: 0px; top: 0px; visibility: hidden;`;
    },
    async updatePosition() {
      if (!this.triggerEl || !this.contentEl || !this.open)
        return;
      const t = this.$el.dataset.anchor || "bottom", i = this.parseNumber(this.$el.dataset.offset, 0), n = this.parseNumber(this.$el.dataset.crossAxisOffset, 0), r = this.parseNumber(this.$el.dataset.alignmentAxisOffset, null), s = this.$el.dataset.strategy || "absolute", o = this.$el.dataset.enableFlip !== "false", a = this.$el.dataset.enableShift !== "false", l = this.parseNumber(this.$el.dataset.shiftPadding, 8), d = [
        _t({
          mainAxis: i,
          crossAxis: n,
          alignmentAxis: r
        })
      ];
      o && d.push(Et()), a && d.push(St({ padding: l }));
      const { x: m, y: b } = await Tt(this.triggerEl, this.contentEl, {
        placement: t,
        strategy: s,
        middleware: d
      });
      this.contentStyle = `position: ${s}; left: ${m}px; top: ${b}px; visibility: visible;`;
    },
    handleDocumentClick(t) {
      if (!this.open)
        return;
      const i = t.target, n = this.triggerEl?.contains?.(i) ?? !1, r = this.contentEl?.contains?.(i) ?? !1;
      n || r || (this.open = !1, this.$nextTick(() => this.restoreTriggerFocus()));
    },
    handleWindowKeydown(t) {
      t.key !== "Escape" || !this.open || (this.open = !1, this.$nextTick(() => this.restoreTriggerFocus()));
    },
    restoreTriggerFocus() {
      this.triggerEl?.isConnected && this.triggerEl.focus();
    }
  }));
}
function ou(e) {
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
      const r = t.offsetWidth + 10;
      i.style.paddingLeft = r + "px", i.classList.remove("text-transparent");
    }
  }));
}
function au(e) {
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
function lu(e) {
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
function cu(e) {
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
          const i = t.scrollHeight - t.clientHeight, n = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight, r = t.scrollTop / i * Math.max(n, 0);
          this.$refs.thumbY.style.transform = `translate3d(0, ${r}px, 0)`;
        }
        if (this.$refs.thumbX && this.$refs.scrollbarX && t.scrollWidth > t.clientWidth) {
          const i = t.scrollWidth - t.clientWidth, n = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth, r = t.scrollLeft / i * Math.max(n, 0);
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
      const i = t.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || n.hidden || t.target === this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`]) return;
      const r = this.$refs.viewport, s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!r || !s) return;
      const o = n.getBoundingClientRect();
      if (i === "vertical") {
        const a = t.clientY - o.top - s.offsetHeight / 2, l = n.clientHeight - s.offsetHeight, d = r.scrollHeight - r.clientHeight;
        r.scrollTop = a / Math.max(l, 1) * d;
      } else {
        const a = t.clientX - o.left - s.offsetWidth / 2, l = n.clientWidth - s.offsetWidth, d = r.scrollWidth - r.clientWidth;
        r.scrollLeft = a / Math.max(l, 1) * d;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(t) {
      const i = t.currentTarget?.dataset.orientation || "vertical", n = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`], r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`];
      if (!n || !r || r.hidden) return;
      const s = n.getBoundingClientRect();
      this._dragAxis = i, this._dragPointerOffset = i === "vertical" ? t.clientY - s.top : t.clientX - s.left, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp, { once: !0 });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(t) {
      const i = this._dragAxis, n = this.$refs.viewport, r = this.$refs[`scrollbar${i === "vertical" ? "Y" : "X"}`], s = this.$refs[`thumb${i === "vertical" ? "Y" : "X"}`];
      if (!i || !n || !r || !s || r.hidden) return;
      const o = r.getBoundingClientRect();
      if (i === "vertical") {
        const a = t.clientY - o.top, l = r.clientHeight - s.offsetHeight, d = n.scrollHeight - n.clientHeight;
        n.scrollTop = (a - this._dragPointerOffset) / Math.max(l, 1) * d;
      } else {
        const a = t.clientX - o.left, l = r.clientWidth - s.offsetWidth, d = n.scrollWidth - n.clientWidth;
        n.scrollLeft = (a - this._dragPointerOffset) / Math.max(l, 1) * d;
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
function uu(e) {
  e.data("rzSlider", () => ({
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
      const t = this.$el.dataset, i = this.parseJson(t.assets, []), n = t.nonce;
      this.min = this.parseNumber(t.min, 0), this.max = this.parseNumber(t.max, 100), this.step = Math.max(this.parseNumber(t.step, 1), Number.EPSILON), this.orientation = t.orientation || "horizontal", this.disabled = this.parseBoolean(t.disabled, !1), this.inverted = this.parseBoolean(t.inverted, !1), this.minStepsBetweenThumbs = Math.max(this.parseNumber(t.minStepsBetweenThumbs, 0), 0), this.values = this.parseJson(t.values, []).map((r) => this.parseNumber(r, this.min)), this.trackEl = this.$refs.track, this.thumbEls = this.$el.querySelectorAll("[data-thumb-index]"), this.inputEls = this.$el.querySelectorAll("[data-slider-input]"), this.values = this.applyConstraints(this.values, -1, null), this.syncDom(), this.syncHiddenInputs(), i.length > 0 && K(i, n);
    },
    handlePointerDown(t) {
      if (this.disabled)
        return;
      const i = this.parseThumbIndex(t.currentTarget);
      i < 0 || (this.activeThumbIndex = i, this.dragging = !0, t.currentTarget.focus(), t.preventDefault());
    },
    handlePointerMove(t) {
      if (this.disabled || !this.dragging || this.activeThumbIndex === null)
        return;
      const i = this.getPointerValue(t);
      this.values[this.activeThumbIndex] = i, this.values = this.applyConstraints(this.values, this.activeThumbIndex, i), this.syncDom(), this.syncHiddenInputs();
    },
    handlePointerUp() {
      this.dragging = !1, this.activeThumbIndex = null;
    },
    handleTrackPointerDown(t) {
      if (this.disabled)
        return;
      const i = this.getPointerValue(t), n = this.getNearestThumbIndex(i);
      n < 0 || (this.activeThumbIndex = n, this.values[n] = i, this.values = this.applyConstraints(this.values, n, i), this.syncDom(), this.syncHiddenInputs(), this.focusThumb(n), t.preventDefault());
    },
    handleThumbKeyDown(t) {
      if (this.disabled)
        return;
      const i = this.parseThumbIndex(t.currentTarget);
      if (i < 0)
        return;
      const n = this.step * 10, r = this.values[i] ?? this.min;
      let s = r;
      if (t.key === "ArrowRight" || t.key === "ArrowUp")
        s = r + this.step;
      else if (t.key === "ArrowLeft" || t.key === "ArrowDown")
        s = r - this.step;
      else if (t.key === "PageUp")
        s = r + n;
      else if (t.key === "PageDown")
        s = r - n;
      else if (t.key === "Home")
        s = this.min;
      else if (t.key === "End")
        s = this.max;
      else
        return;
      this.values[i] = s, this.values = this.applyConstraints(this.values, i, s), this.syncDom(), this.syncHiddenInputs(), t.preventDefault();
    },
    syncDom() {
      const t = this.values.map((s) => this.valueToPercent(s)), i = Math.min(...t), n = Math.max(...t);
      this.trackEl && (this.trackEl.dataset.orientation = this.orientation);
      const r = this.$refs.range;
      r && (r.dataset.orientation = this.orientation, this.orientation === "vertical" ? (r.style.bottom = `${i}%`, r.style.height = `${Math.max(n - i, 0)}%`, r.style.left = "0", r.style.right = "0", r.style.width = "100%") : (r.style.left = `${i}%`, r.style.width = `${Math.max(n - i, 0)}%`, r.style.top = "0", r.style.bottom = "0", r.style.height = "100%")), this.thumbEls.forEach((s) => {
        const o = this.parseThumbIndex(s), a = this.values[o] ?? this.min, l = this.valueToPercent(a);
        s.dataset.orientation = this.orientation, s.setAttribute("aria-valuenow", `${a}`), s.style.position = "absolute", this.orientation === "vertical" ? (s.style.left = "50%", s.style.bottom = `${l}%`, s.style.transform = "translate(-50%, 50%)") : (s.style.top = "50%", s.style.left = `${l}%`, s.style.transform = "translate(-50%, -50%)");
      });
    },
    syncHiddenInputs() {
      this.inputEls.forEach((t) => {
        const i = this.parseNumber(t.dataset.inputIndex, 0), n = this.values[i] ?? this.min;
        t.value = `${n}`;
      });
    },
    applyConstraints(t, i, n) {
      const r = t.length;
      if (r === 0)
        return [this.min];
      let s = t.map((a) => this.snapValue(a));
      s = s.map((a) => this.clampValue(a)), i >= 0 && i < r ? (s[i] = this.snapValue(n ?? s[i]), s[i] = this.clampValue(s[i])) : s = [...s].sort((a, l) => a - l);
      const o = this.minStepsBetweenThumbs;
      for (let a = 1; a < r; a += 1) {
        const l = s[a - 1] + o;
        s[a] < l && (s[a] = this.clampValue(this.snapValue(l)));
      }
      for (let a = r - 2; a >= 0; a -= 1) {
        const l = s[a + 1] - o;
        s[a] > l && (s[a] = this.clampValue(this.snapValue(l)));
      }
      return s;
    },
    snapValue(t) {
      const i = this.min + Math.round((t - this.min) / this.step) * this.step;
      return Number(i.toFixed(6));
    },
    getNearestThumbIndex(t) {
      if (this.values.length === 0)
        return -1;
      let i = 0, n = Number.MAX_VALUE;
      return this.values.forEach((r, s) => {
        const o = Math.abs(r - t);
        o < n && (n = o, i = s);
      }), i;
    },
    getPointerValue(t) {
      if (!this.trackEl)
        return this.min;
      const i = this.trackEl.getBoundingClientRect(), n = this.orientation === "vertical" ? i.height : i.width;
      if (n <= 0)
        return this.min;
      let r;
      this.orientation === "vertical" ? r = (i.bottom - t.clientY) / n : r = (t.clientX - i.left) / n, r = Math.min(Math.max(r, 0), 1), this.inverted && (r = 1 - r);
      const s = this.min + r * (this.max - this.min);
      return this.snapValue(this.clampValue(s));
    },
    valueToPercent(t) {
      const i = this.max - this.min;
      if (i <= 0)
        return 0;
      const n = (t - this.min) / i, r = this.inverted ? 1 - n : n;
      return Math.min(Math.max(r * 100, 0), 100);
    },
    clampValue(t) {
      return Math.min(Math.max(t, this.min), this.max);
    },
    focusThumb(t) {
      const i = this.$el.querySelector(`[data-thumb-index="${t}"]`);
      i && i.focus();
    },
    parseThumbIndex(t) {
      return t ? this.parseNumber(t.dataset.thumbIndex, -1) : -1;
    },
    parseBoolean(t, i) {
      return t === "true" ? !0 : t === "false" ? !1 : i;
    },
    parseNumber(t, i) {
      const n = Number(t);
      return Number.isFinite(n) ? n : i;
    },
    parseJson(t, i) {
      try {
        return JSON.parse(t || "null") ?? i;
      } catch {
        return i;
      }
    }
  }));
}
function du(e) {
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
function hu(e) {
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
        const r = t.currentTarget?.getAttribute("aria-orientation") === "vertical", s = r ? "ArrowUp" : "ArrowLeft", o = r ? "ArrowDown" : "ArrowRight";
        let a = n;
        switch (t.key) {
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
function fu(e) {
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
function pu(e) {
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
      const r = Number(n);
      return Number.isFinite(r) ? r : i;
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
      !this.enableAutoUpdate || !this.triggerEl || !this.contentEl || (this.stopAutoUpdate(), this.cleanupAutoUpdate = ys(this.triggerEl, this.contentEl, () => {
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
      this.enableFlip && t.push(Et()), this.enableShift && t.push(St({ padding: this.shiftPadding })), this.arrowEl && t.push(Wc({ element: this.arrowEl })), Tt(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        strategy: this.strategy,
        middleware: t
      }).then(({ x: i, y: n, placement: r, middlewareData: s }) => {
        if (this.side = r.split("-")[0], this.contentEl.dataset.side = this.side, this.contentEl.style.position = this.strategy, this.contentEl.style.left = `${i}px`, this.contentEl.style.top = `${n}px`, !this.arrowEl || !s.arrow) return;
        const o = s.arrow.x, a = s.arrow.y, d = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        }[this.side] || "bottom";
        this.arrowEl.style.left = o != null ? `${o}px` : "", this.arrowEl.style.top = a != null ? `${a}px` : "", this.arrowEl.style.right = "", this.arrowEl.style.bottom = "", this.arrowEl.style[d] = "-5px";
      });
    }
  }));
}
function mu(e) {
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
function gu(e) {
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
        const r = document.getElementById(t);
        if (r)
          try {
            i = JSON.parse(r.textContent || "[]");
          } catch (s) {
            console.error(`RzCommand: Failed to parse JSON from script tag #${t}`, s);
          }
      }
      i.length > 0 && !this.dataItemTemplateId && console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
      const n = i.map((r) => ({
        ...r,
        id: this.resolveStableItemId(r),
        isDataItem: !0
      }));
      this.registerItems(n, { suppressFilter: !0 }), this.itemsUrl && this.fetchTrigger === "immediate" ? this.fetchItems() : this.filterAndSortItems(), this.$watch("search", (r) => {
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
      r > 0 && this.selectedIndex === -1 && (this.selectedIndex = 0), !n && !this.serverFiltering && this.filterAndSortItems();
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
      let r = [];
      if (!this.shouldFilter || !t)
        r = this.items.slice();
      else {
        const a = [];
        for (const l of n) {
          if (l.forceMount)
            continue;
          const d = this.fastScore(l._searchText, t);
          d > 0 && a.push([l, d]);
        }
        a.sort((l, d) => d[1] !== l[1] ? d[1] - l[1] : (l[0]._order || 0) - (d[0]._order || 0)), r = a.map(([l]) => l);
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
          const i = new URL(this.itemsUrl, window.location.origin);
          this.serverFiltering && t && i.searchParams.append("q", t);
          const n = await fetch(i);
          if (!n.ok)
            throw new Error(`Network response was not ok: ${n.statusText}`);
          const r = await n.json();
          this.serverFiltering && (this.items = this.items.filter((o) => !o.isDataItem), this.itemsById = new Map(this.items.map((o) => [o.id, o])));
          const s = r.map((o) => ({
            ...o,
            id: this.resolveStableItemId(o),
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
    handleItemClick(t) {
      const i = t.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, r = this.filteredIndexById.get(n) ?? -1;
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
      const i = t.target.closest("[data-command-item-id]");
      if (!i) return;
      const n = i.dataset.commandItemId, r = this.filteredIndexById.get(n) ?? -1;
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
function vu(e) {
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
      const i = this.$el.querySelector("template"), n = i?.content ? i.content.cloneNode(!0) : null, r = this.$el.dataset.value || this.$el.textContent.trim(), s = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
      this.itemData = {
        id: this.resolveItemId(r, s),
        value: r,
        name: s,
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
function yu(e) {
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
      const t = this.parent.filteredItems || [], i = this.parent.groupTemplates || /* @__PURE__ */ new Map(), n = this.$el, r = document.createDocumentFragment(), s = /* @__PURE__ */ new Map([["__ungrouped__", []]]);
      for (const d of t) {
        const m = d.group || "__ungrouped__";
        s.has(m) || s.set(m, []), s.get(m).push(d);
      }
      const o = Array.from(s.entries()).filter(([, d]) => d.length > 0), a = o.filter(([d]) => d !== "__ungrouped__").length;
      let l = 0;
      o.forEach(([d, m]) => {
        const b = d !== "__ungrouped__";
        if (b && this.separatorTemplate && a > 1 && l > 0) {
          const y = this.separatorTemplate.cloneNode(!0);
          y.setAttribute("data-dynamic-item", "true"), r.appendChild(y);
        }
        const I = document.createElement("div");
        if (I.setAttribute("role", "group"), I.setAttribute("data-dynamic-item", "true"), I.setAttribute("data-slot", "command-group"), b) {
          const y = i.get(d);
          if (y?.templateContent) {
            const c = y.templateContent.cloneNode(!0);
            y.headingId && I.setAttribute("aria-labelledby", y.headingId), I.appendChild(c);
          }
        }
        m.forEach((y, c) => {
          const p = this.parent.filteredIndexById.get(y.id) ?? c, u = this.ensureRow(y);
          u && (this.applyItemAttributes(u, y, p), I.appendChild(u));
        }), r.appendChild(I), b && (l += 1);
      }), n.querySelectorAll("[data-dynamic-item]").forEach((d) => d.remove()), n.appendChild(r), window.htmx && window.htmx.process(n);
    }
  }));
}
function bu(e) {
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
      const i = this.$el.querySelector("template"), n = i?.dataset.headingId || "", r = i?.content ? i.content.cloneNode(!0) : null;
      this.heading && r && this.parent.registerGroupTemplate(this.heading, r, n);
    }
  }));
}
function xu(e, t) {
  e.data("rzChart", () => ({
    chartInstance: null,
    themeChangeHandler: null,
    init() {
      const i = JSON.parse(this.$el.dataset.assets || "[]"), n = this.$el.dataset.nonce || "", r = this.$el.dataset.configId;
      if (i.length > 0 && typeof t == "function") {
        t(i, {
          success: () => this.tryInitializeChart(r),
          error: (s) => console.error("[rzChart] Failed to load Chart.js assets.", s)
        }, n);
        return;
      }
      this.tryInitializeChart(r);
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
      let r = {};
      try {
        r = JSON.parse(n.textContent || "{}");
      } catch (o) {
        console.error("[rzChart] Failed to parse JSON configuration.", o);
        return;
      }
      this.resolveColorValues(r), this.resolveCallbacks(r), r.options && (r.options.responsive = r.options.responsive ?? !0, r.options.maintainAspectRatio = r.options.maintainAspectRatio ?? !1);
      const s = this.$refs.canvas;
      if (!s) {
        console.error("[rzChart] Canvas reference was not found.");
        return;
      }
      this.chartInstance = new window.Chart(s, r), this.themeChangeHandler = () => {
        this.chartInstance && this.chartInstance.update();
      }, window.addEventListener("rz:theme-change", this.themeChangeHandler);
    },
    resolveColorValues(i) {
      const n = (r) => {
        if (Array.isArray(r))
          return r.map((s) => n(s));
        if (!r || typeof r != "object")
          return r;
        for (const s of Object.keys(r)) {
          const o = r[s];
          if (typeof s == "string" && s.toLowerCase().includes("color")) {
            if (Array.isArray(o)) {
              r[s] = o.map((a) => this._resolveColor(a));
              continue;
            }
            if (o && typeof o == "object") {
              n(o);
              continue;
            }
            r[s] = this._resolveColor(o);
            continue;
          }
          o && typeof o == "object" && n(o);
        }
        return r;
      };
      n(i);
    },
    _resolveColor(i, n = document.documentElement) {
      if (typeof i != "string")
        return i;
      const r = i.trim();
      if (!r.startsWith("var("))
        return r;
      const s = r.slice(4, -1).trim(), [o, a] = s.split(",").map((d) => d.trim());
      return o && (getComputedStyle(n).getPropertyValue(o).trim() || a) || r;
    },
    resolveCallbacks(i) {
      if (!i || !i.options)
        return;
      const n = (r) => {
        if (typeof r != "string")
          return r;
        const s = r.replace("window.", "").split(".");
        let o = window;
        for (const a of s) {
          if (o[a] === void 0)
            return r;
          o = o[a];
        }
        return typeof o == "function" ? o : r;
      };
      if (i.options.plugins?.tooltip?.callbacks) {
        const r = i.options.plugins.tooltip.callbacks;
        for (const s of Object.keys(r))
          r[s] = n(r[s]);
      }
      if (i.options.scales)
        for (const r of Object.keys(i.options.scales)) {
          const s = i.options.scales[r];
          s.ticks && s.ticks.callback && (s.ticks.callback = n(s.ticks.callback));
        }
    },
    destroy() {
      this.themeChangeHandler && (window.removeEventListener("rz:theme-change", this.themeChangeHandler), this.themeChangeHandler = null), this.chartInstance && (this.chartInstance.destroy(), this.chartInstance = null);
    }
  }));
}
async function wu(e) {
  e = [...e].sort();
  const t = e.join("|"), n = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function K(e, t, i) {
  let n, r;
  typeof t == "function" ? n = { success: t } : t && typeof t == "object" ? n = t : typeof t == "string" && (r = t), !r && typeof i == "string" && (r = i);
  const s = Array.isArray(e) ? e : [e];
  return wu(s).then((o) => (rt.isDefined(o) || rt(s, o, {
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
        } catch (d) {
          console.error("[rizzyRequire] success callback threw:", d);
        }
        a({ bundleId: o });
      },
      error: (d) => {
        try {
          n && typeof n.error == "function" && n.error(d);
        } catch (m) {
          console.error("[rizzyRequire] error callback threw:", m);
        }
        l(
          new Error(
            `[rizzyRequire] Failed to load bundle ${o} (missing: ${Array.isArray(d) ? d.join(", ") : String(d)})`
          )
        );
      }
    });
  })));
}
function Iu(e) {
  Vl(e), Bl(e), Hl(e), Ul(e), ql(e), Wl(e, K), jl(e), Yl(e, K), Kl(e, K), Jl(e), Xl(e), Gl(e, K), Zl(e, K), Ql(e), tc(e, K), ec(e), jc(e), Yc(e), Kc(e), Jc(e), Xc(e), Gc(e), Zc(e), Qc(e), tu(e), eu(e), iu(e, K), nu(e), ru(e), su(e), ou(e), au(e), lu(e), cu(e), uu(e), du(e), hu(e), fu(e), pu(e), mu(e), gu(e), vu(e), yu(e), bu(e), xu(e, K);
}
function _u(e) {
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
const ge = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map();
let $n = !1;
function Su(e) {
  return ve.has(e) || ve.set(
    e,
    import(e).catch((t) => {
      throw ve.delete(e), t;
    })
  ), ve.get(e);
}
function An(e, t) {
  const i = globalThis.Alpine;
  return i && typeof i.asyncData == "function" ? (i.asyncData(
    e,
    () => Su(t).catch((n) => (console.error(
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
function Eu(e, t) {
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
    const r = !i || i.path !== t;
    if (!(i && i.loaderSet && !r)) {
      const o = An(e, t);
      ge.set(e, { path: t, loaderSet: o });
    }
    return;
  }
  ge.set(e, { path: t, loaderSet: !1 }), $n || ($n = !0, document.addEventListener(
    "alpine:init",
    () => {
      for (const [r, s] of ge)
        if (!s.loaderSet) {
          const o = An(r, s.path);
          s.loaderSet = o;
        }
    },
    { once: !0 }
  ));
}
function Tu(e) {
  e.directive("mobile", (t, { modifiers: i, expression: n }, { cleanup: r }) => {
    const s = i.find((h) => h.startsWith("bp-")), o = s ? parseInt(s.slice(3), 10) : 768, a = !!(n && n.length > 0);
    if (typeof window > "u" || !window.matchMedia) {
      t.dataset.mobile = "false", t.dataset.screen = "desktop";
      return;
    }
    const l = () => window.innerWidth < o, d = (h) => {
      t.dataset.mobile = h ? "true" : "false", t.dataset.screen = h ? "mobile" : "desktop";
    }, m = () => typeof e.$data == "function" ? e.$data(t) : t.__x ? t.__x.$data : null, b = (h) => {
      if (!a) return;
      const f = m();
      f && (f[n] = h);
    }, I = (h) => {
      t.dispatchEvent(
        new CustomEvent("screen:change", {
          bubbles: !0,
          detail: { isMobile: h, width: window.innerWidth, breakpoint: o }
        })
      );
    }, y = window.matchMedia(`(max-width: ${o - 1}px)`), c = () => {
      const h = l();
      d(h), b(h), I(h);
    };
    c();
    const p = () => c(), u = () => c();
    y.addEventListener("change", p), window.addEventListener("resize", u, { passive: !0 }), r(() => {
      y.removeEventListener("change", p), window.removeEventListener("resize", u);
    });
  });
}
function Cu(e) {
  const t = (i, { expression: n, modifiers: r }, { cleanup: s, effect: o }) => {
    if (!n || typeof n != "string") return;
    const a = (p, u, h) => {
      const v = u.replace(/\[(\d+)\]/g, ".$1").split("."), x = v.pop();
      let _ = p;
      for (const g of v)
        (_[g] == null || typeof _[g] != "object") && (_[g] = isFinite(+g) ? [] : {}), _ = _[g];
      _[x] = h;
    }, l = e.closestDataStack(i) || [], d = l[0] || null, m = l[1] || null;
    if (!d || !m) {
      import.meta?.env?.DEV && console.warn("[x-syncprop] Could not find direct parent/child x-data. Ensure x-syncprop is used one level inside a parent component.");
      return;
    }
    const b = n.split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
      const u = p.split("->").map((h) => h.trim());
      return u.length !== 2 ? (console.warn('[x-syncprop] Invalid mapping (expected "parent.path -> child.path"): ', p), null) : { parentPath: u[0], childPath: u[1] };
    }).filter(Boolean), I = r.includes("init-child") || r.includes("child") || r.includes("childWins"), y = b.map(() => ({
      fromParent: !1,
      fromChild: !1,
      skipChildOnce: I
      // avoid redundant first child->parent write
    })), c = [];
    b.forEach((p, u) => {
      const h = y[u];
      if (I) {
        const x = e.evaluate(i, p.childPath, { scope: d });
        h.fromChild = !0, a(m, p.parentPath, x), queueMicrotask(() => {
          h.fromChild = !1;
        });
      } else {
        const x = e.evaluate(i, p.parentPath, { scope: m });
        h.fromParent = !0, a(d, p.childPath, x), queueMicrotask(() => {
          h.fromParent = !1;
        });
      }
      const f = o(() => {
        const x = e.evaluate(i, p.parentPath, { scope: m });
        h.fromChild || (h.fromParent = !0, a(d, p.childPath, x), queueMicrotask(() => {
          h.fromParent = !1;
        }));
      }), v = o(() => {
        const x = e.evaluate(i, p.childPath, { scope: d });
        if (!h.fromParent) {
          if (h.skipChildOnce) {
            h.skipChildOnce = !1;
            return;
          }
          h.fromChild = !0, a(m, p.parentPath, x), queueMicrotask(() => {
            h.fromChild = !1;
          });
        }
      });
      c.push(f, v);
    }), s(() => {
      for (const p of c)
        try {
          p && p();
        } catch {
        }
    });
  };
  e.directive("syncprop", t);
}
class $u {
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
    const t = this.effectiveDark, i = this._mode, n = this.prefersDark, r = typeof document < "u" ? document.documentElement : null, s = r ? r.classList.contains(this.darkClass) === t && r.style.colorScheme === (t ? "dark" : "light") : !0;
    this._lastSnapshot.mode === i && this._lastSnapshot.effectiveDark === t && this._lastSnapshot.prefersDark === n && s || (this._lastSnapshot = { mode: i, effectiveDark: t, prefersDark: n }, r && (r.classList.toggle(this.darkClass, t), r.style.colorScheme = t ? "dark" : "light"), typeof window < "u" && window.dispatchEvent(
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
const V = new $u();
function Au(e) {
  V.init(), e.store("theme", {
    // Reactive state mirrors
    // We mirror ALL derived properties to ensure Alpine reactivity works 
    // for bindings like x-show="prefersDark" or x-text="mode".
    _mode: V.mode,
    _prefersDark: V.prefersDark,
    _effectiveDark: V.effectiveDark,
    // Listener reference to prevent duplicate registration
    _onThemeChange: null,
    init() {
      this._onThemeChange || (this._onThemeChange = () => this._refresh(), window.addEventListener(V.eventName, this._onThemeChange)), this._refresh();
    },
    _refresh() {
      this._mode = V.mode, this._prefersDark = V.prefersDark, this._effectiveDark = V.effectiveDark;
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
      V.setLight();
    },
    setDark() {
      V.setDark();
    },
    setAuto() {
      V.setAuto();
    },
    toggle() {
      V.toggle();
    }
  });
}
let Yt = null;
function Du(e) {
  if (Yt) return Yt;
  e.plugin(Ra), e.plugin(Ua), e.plugin(ul), e.plugin(bl), typeof document < "u" && document.addEventListener("alpine:init", () => {
    Au(e);
  }), Iu(e), Tu(e), Cu(e);
  const t = new wl.ValidationService();
  return t.bootstrap({ watch: !0 }), Yt = {
    Alpine: e,
    require: K,
    toast: Ml,
    validation: t,
    $data: Rl,
    props: _u,
    registerAsyncComponent: Eu,
    theme: V
  }, typeof window < "u" && (V.init(), window.Alpine = e, window.Rizzy = { ...window.Rizzy || {}, ...Yt }, document.dispatchEvent(new CustomEvent("rz:init", {
    detail: { Rizzy: window.Rizzy }
  }))), Yt;
}
const Ou = Du(Ur);
Ur.start();
export {
  Ou as default
};
