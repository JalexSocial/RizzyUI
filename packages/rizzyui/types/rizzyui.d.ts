/**
 * Type declarations for RizzyUI's browser runtime and for Alpine code-behind modules
 * (`Component.razor.js`, or `.razor.ts` with the optional build pipeline).
 *
 * In a plain `.razor.js` file, enable checking with `// @ts-check` and annotate the default export:
 *
 * ```js
 * // @ts-check
 * /** @type {import('rizzyui').AlpineCodeBehind<{ InitialCount: number }>} *\/
 * export default () => ({
 *   count: 0,
 *   init() { this.count = this.$props.InitialCount; },
 *   increment() { this.count++; },
 * });
 * ```
 *
 * The NuGet package copies this file to `obj/rizzyui/rizzyui.d.ts` on build; map the `rizzyui`
 * module name to it in `jsconfig.json` (the RizzyUI templates do). With the npm package, map it to
 * `node_modules/@jalexsocial/rizzyui/types/rizzyui.d.ts` or import `@jalexsocial/rizzyui`.
 */

/** Alpine's magic properties available on `this` in a component's methods. */
export interface AlpineMagics<TProps = Record<string, any>> {
    /**
     * The props passed with `RzAlpineComponent`'s `Props` parameter, with the property names written
     * in C# (unless the app configures `CodeBehindPropsSerializerOptions`). Read-only.
     */
    readonly $props: Readonly<TProps>;
    /** The component's root element in methods; the current element in markup expressions. */
    readonly $el: HTMLElement;
    /** The component's root element. */
    readonly $root: HTMLElement;
    /** Elements marked with `x-ref` in the component. */
    readonly $refs: Record<string, HTMLElement>;
    /** Global Alpine stores. */
    readonly $store: Record<string, any>;
    /** The data stack available to the element. */
    readonly $data: Record<string, any>;
    /** Dispatches a browser `CustomEvent` that bubbles from the element. */
    $dispatch(event: string, detail?: unknown): void;
    /** Runs `callback` after Alpine has applied pending reactive updates to the DOM. */
    $nextTick(callback?: () => void): Promise<void>;
    /** Runs `callback` whenever the value of `property` changes. */
    $watch<T = unknown>(property: string, callback: (value: T, oldValue: T) => void): void;
    /** A unique id for `name`, scoped with `x-id`. */
    $id(name: string, key?: string | number): string;
}

/** Lifecycle methods a code-behind module's data object can define. */
export interface CodeBehindLifecycle {
    /** Runs when the component starts, before its children. Set initial state here. */
    init?(): void | Promise<void>;
    /**
     * Runs after `init()` and after the child components that load immediately have started, so
     * child components (a dialog, a dropdown) can be read with `Rizzy.$data(this.$refs.name)`.
     */
    ready?(): void | Promise<void>;
    /** Runs when the component is removed from the page. */
    destroy?(): void;
}

/**
 * The data object a code-behind module returns. Inside its methods, `this` is the data object
 * plus Alpine's magics, with `this.$props` typed as `TProps`.
 */
export type AlpineComponentData<TProps = Record<string, any>> =
    Record<string, any> & CodeBehindLifecycle & ThisType<Record<string, any> & AlpineMagics<TProps>>;

/**
 * The default export of a code-behind module: a function that returns a new data object for each
 * component instance.
 */
export type AlpineCodeBehind<TProps = Record<string, any>> = () => AlpineComponentData<TProps>;

/** Detail of the `rz:module-error` event dispatched on `document` when a module cannot load. */
export interface RzModuleErrorDetail {
    /** The Alpine data name. */
    name: string;
    /** The module URL that failed. */
    url: string;
    /** The plain URL tried after a fingerprinted URL failed, if any. */
    fallbackUrl: string | null;
    error: unknown;
}

/** An asset for `Rizzy.require`: a URL, or a URL with its Subresource Integrity hash. */
export type RizzyAsset = string | { src: string; integrity?: string };

/** The `window.Rizzy` global: Rizzy's client plus RizzyUI's runtime. */
export interface RizzyGlobal {
    /** The Alpine instance RizzyUI bundles and starts. */
    Alpine: any;
    /** Resolves when RizzyUI's runtime has started. */
    ready: Promise<RizzyGlobal>;
    /** The props of the code-behind component that contains `element` (usually `this.$el`). */
    props<TProps = Record<string, any>>(element: Element): Readonly<TProps>;
    /** The Alpine data of the component whose root has the given id, or that contains the element. */
    $data(idOrElement: string | Element): any;
    /** Loads scripts and stylesheets once, in order. */
    require(assets: RizzyAsset | RizzyAsset[], callbackOrNonce?: (() => void) | { success?: () => void; error?: (missing: string[]) => void } | string, nonce?: string): Promise<{ bundleId: string }>;
    /** Registers an Alpine data name that loads from a module URL on first use (elements need `x-load`). */
    registerAsyncComponent(name: string, path: string): void;
    /** Shows toasts; see the RzToast documentation. */
    toast: any;
    /** Light/dark theme controller. */
    theme: any;
    [key: string]: any;
}

declare global {
    const Rizzy: RizzyGlobal;
    interface Window {
        Rizzy: RizzyGlobal;
    }
    interface DocumentEventMap {
        'rz:module-error': CustomEvent<RzModuleErrorDetail>;
    }
}
