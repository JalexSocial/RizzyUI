//#region src/js/lib/directives/flexrender.js
function isObject(value) {
	return typeof value === "object" && value !== null;
}
function isNodeLike(value) {
	return typeof Node !== "undefined" && value instanceof Node;
}
function isFlexPayload(value) {
	return isObject(value) && Object.prototype.hasOwnProperty.call(value, "def");
}
function isFlexEnvelope(value) {
	return isObject(value) && typeof value.kind === "string";
}
function toText(value) {
	if (value === null || value === void 0) return "";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	return String(value);
}
async function resolveRenderable(payloadOrValue) {
	if (!isFlexPayload(payloadOrValue)) return {
		payload: null,
		renderable: payloadOrValue
	};
	const payload = payloadOrValue;
	const value = typeof payload.def === "function" ? await payload.def(payload.ctx) : payload.def;
	return {
		payload,
		renderable: value === null || value === void 0 ? payload.fallback : value
	};
}
function clearElement(el) {
	el.replaceChildren();
	el.textContent = "";
}
function applyText(el, value) {
	el.replaceChildren();
	el.textContent = toText(value);
}
function applyHtml(el, html, payload, options) {
	el.replaceChildren();
	el.innerHTML = typeof options.sanitizeHtml === "function" && payload ? options.sanitizeHtml(html, payload) : html;
}
function applyNode(el, node, options) {
	el.replaceChildren();
	const finalNode = options.cloneNodeResults === false ? node : node.cloneNode(true);
	el.appendChild(finalNode);
}
function applyRenderable(el, renderable, payload, mode, options) {
	if (renderable === null || renderable === void 0) {
		clearElement(el);
		return;
	}
	if (isNodeLike(renderable)) {
		if (mode === "text") {
			applyText(el, "");
			return;
		}
		applyNode(el, renderable, options);
		return;
	}
	if (isFlexEnvelope(renderable)) switch (renderable.kind) {
		case "empty":
			clearElement(el);
			return;
		case "text":
			applyText(el, renderable.value);
			return;
		case "html":
			if (mode === "text") {
				applyText(el, renderable.value);
				return;
			}
			applyHtml(el, renderable.value, payload, options);
			return;
		case "node":
			if (mode === "text") {
				applyText(el, "");
				return;
			}
			applyNode(el, renderable.value, options);
			return;
		default:
			clearElement(el);
			return;
	}
	if (mode === "html") {
		applyHtml(el, toText(renderable), payload, options);
		return;
	}
	applyText(el, renderable);
}
function parseMode(value) {
	if (value === "text" || value === "html" || value === "node") return value;
	return "auto";
}
function createFlexRenderPlugin(options = {}) {
	const mergedOptions = {
		cloneNodeResults: true,
		...options
	};
	return function flexRenderPlugin(Alpine) {
		Alpine.directive("flexrender", (el, { value, expression }, { evaluateLater, effect }) => {
			const evaluate = evaluateLater(expression);
			const mode = parseMode(value);
			let runId = 0;
			effect(() => {
				const currentRunId = ++runId;
				evaluate(async (payloadOrValue) => {
					try {
						const resolved = await resolveRenderable(payloadOrValue);
						if (currentRunId !== runId) return;
						applyRenderable(el, resolved.renderable, resolved.payload, mode, mergedOptions);
					} catch (error) {
						if (typeof mergedOptions.onError === "function") mergedOptions.onError(error, {
							element: el,
							payload: payloadOrValue
						});
						else {
							console.error("x-flexrender failed:", error);
							clearElement(el);
						}
					}
				});
			});
		});
	};
}
var flex = {
	payload(def, ctx, fallback) {
		return {
			def,
			ctx,
			fallback
		};
	},
	header(header) {
		return {
			def: header?.column?.columnDef?.header ?? null,
			ctx: header.getContext()
		};
	},
	cell(cell) {
		return {
			def: cell?.column?.columnDef?.cell ?? null,
			ctx: cell.getContext()
		};
	},
	footer(header) {
		return {
			def: header?.column?.columnDef?.footer ?? null,
			ctx: header.getContext()
		};
	},
	text(value) {
		return {
			kind: "text",
			value
		};
	},
	html(value) {
		return {
			kind: "html",
			value
		};
	},
	node(value) {
		return {
			kind: "node",
			value
		};
	},
	empty() {
		return { kind: "empty" };
	}
};
//#endregion
export { flex as n, createFlexRenderPlugin as t };

//# sourceMappingURL=flexrender-mXr0cMGi.js.map