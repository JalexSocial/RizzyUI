## 10. Alpine.js Integration & Asset Bundling

RizzyUI components that require client-side interactivity leverage Alpine.js. The integration follows a specific pattern for defining components, managing their assets, and ensuring CSP compliance.

### 10.1 Alpine.js API Restrictions (CSP Build)

**It is CRITICAL to understand and adhere to these API restrictions when writing Alpine.js code for RizzyUI components.** Since Alpine.js, when built for Content Security Policy (CSP) compliance, can no longer interpret strings as plain JavaScript, it has to parse and construct JavaScript functions from them manually.

Due to this limitation, component state and logic live in the component factory (10.4), and markup refers to them by name. The CSP build (`@alpinejs/csp` 3.15) parses a safe subset of expressions: property reads (`colorPicker.value`), method calls with arguments (`setValue(colorPicker.value)`), comparisons and literals. It **rejects property assignment** (`colorPicker.value = x`), which is what `x-model="a.b"` and handlers such as `x-on:click="state.open = true"` compile to; use a method (`x-on:input="setValueFromInput"`) or a one-way binding instead. Bind `x-bind:style` to an object, not a CSS string: a string is applied with `setAttribute('style')`, which a policy without `'unsafe-inline'` styles blocks.

For example, an inline component like this **will not work** with the CSP build:

```html
<!-- Bad -->
<div x-data="{ count: 1 }">
    <button @click="count++">Increment</button>
    <span x-text="count"></span>
</div>
```

However, breaking out the expressions into external APIs, the following is **valid** with the CSP build:

```html
<!-- Good -->
<div x-data="counter">
    <button @click="increment">Increment</button>
    <span x-text="count"></span>
</div>
```

```javascript
Alpine.data('counter', () => ({
    count: 1,
    increment() {
        this.count++
    },
}))
```

The CSP build supports accessing nested properties (property accessors) using the dot notation:

```html
<!-- This works too -->
<div x-data="counter">
    <button @click="foo.increment">Increment</button>
    <span x-text="foo.count"></span>
</div>
```

```javascript
Alpine.data('counter', () => ({
    foo: {
        count: 1,
        increment() {
            this.count++
        },
    },
}))
```

**Key Takeaways for LLMs:**

* **Define `x-data` in a component factory** (10.4). Never inline `x-data` objects.
* **Keep expressions to reads and calls**: property reads (`count`, `foo.bar`), method calls, also with
  arguments (`select(item.id)`), comparisons and literals work in the CSP build.
* **Never assign in an expression**: `count++`, `isActive = !isActive` and `foo.bar = x` (including
  `x-model="foo.bar"`) fail in the CSP build. Put the change in a method.
* Bind `x-bind:style` to an object, not a CSS string.

### 10.2 Alpine Child-Container Convention (in `.razor` file)

If a RizzyUI component uses Alpine.js, its root `<HtmlElement>` in the `.razor` file MUST contain a direct child `<div>` with the following attributes. This `div` serves as the root for the Alpine component.

```razor
<HtmlElement Element="@EffectiveElement" id="@Id" @attributes="@AdditionalAttributes" class="@SlotClasses.GetBase()">
    <div data-alpine-root="@Id" @* Crucial: Must match the Blazor component's @Id *@
         x-data="rzFancyThing"   @* Alpine component name, e.g., 'rzComponentName' *@
         x-load="@LoadStrategyOrNull" @* Required next to x-data; rendered only when LoadStrategy is set *@
         data-assets="@_assets"   @* Serialized JSON string of asset URLs for this component *@
         data-nonce="@Nonce">     @* CSP nonce for inline scripts/styles loaded by this component *@
        @* Alpine-interactive content, x-ref, x-on:, :class, etc. goes here *@
    </div>
</HtmlElement>
```

* `data-alpine-root="@Id"`: This attribute is **essential**. It MUST exactly match the Blazor component's `@Id`. It's used by the `Rizzy.$data()` helper to locate the Alpine component's scope.
* `x-data="rzComponentName"`: Specifies the name of the Alpine.js component to initialize on this `div`. The name should follow the `rzComponentName` convention, where `rz` corresponds to `Rz` prefixed Blazor components.
* `data-assets="@_assets"`: A JSON stringified array of asset URLs (JavaScript/CSS) that this specific Alpine component instance needs. This is populated from the C# code-behind.
* `data-nonce="@Nonce"`: The CSP nonce value, passed from the C# `RzComponent` base. This is used by the `require` utility to load assets in a CSP-compliant manner.

### 10.3 Asset Declaration and Loading (Centralized)

Components **do not** hardcode asset URLs. Instead, they declare their dependencies using logical keys, which are resolved to URLs from a central configuration.

1. **Define Asset Keys (`.razor.cs`):**

   * The component defines a `ComponentAssetKeys` parameter, which is a `string[]`. This parameter should have a default value containing the logical keys for its required assets.
   * Example:

     ```csharp
     // In RzFancyThing.razor.cs
     [Parameter]
     public string[] ComponentAssetKeys { get; set; } = ["FancyThingCoreScript", "SomeOtherDependency"];
     ```

2. **Inject Configuration (`.razor.cs`):**

   * The component injects `IOptions<RizzyUIConfig>` to access the central asset URL mapping.

     ```csharp
     // In RzFancyThing.razor.cs
     [Inject]
     private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;
     ```

3. **Resolve and Serialize URLs (`.razor.cs`):**

   * A private method (e.g., `UpdateAssets`) is called in `OnInitialized` and `OnParametersSet`.
   * This method looks up the URLs for each key in `ComponentAssetKeys` from `RizzyUIConfig.Value.AssetUrls`.
   * The resolved URLs are serialized into a JSON string and stored in a private field (e.g., `_assets`), which is then bound to the `data-assets` attribute in the Razor markup.

     ```csharp
     // In RzFancyThing.razor.cs
     private string _assets = "[]";

     private void UpdateAssets()
     {
         var assetUrls = ComponentAssetKeys
             .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
             .Where(url => !string.IsNullOrEmpty(url))
             .ToList();
         _assets = System.Text.Json.JsonSerializer.Serialize(assetUrls);
     }
     ```

### 10.4 Alpine Component Definition (Individual JavaScript File)

* Each Alpine component (e.g., `rzFancyThing`) has its own file:
  `packages/rizzyui/src/js/lib/components/rzFancyThing.js`.
* The file default-exports a **factory function** that returns the component object. It does not call
  `Alpine.data` itself; the runtime registers every component lazily (see 10.5).
* To load third-party assets listed in `data-assets`, import the loader:
  `import { require } from '../../runtime/rizzyRequire.js';`. It returns a promise and accepts URL
  strings or `{ src, integrity }` objects (Subresource Integrity).
* Implement `destroy()` for anything that outlives the element (observers, timers, window or
  document listeners, third-party instances). Alpine calls it when htmx or Alpine removes the
  element; a method with another name (for example `cleanup()`) is never called.

**Example: `packages/rizzyui/src/js/lib/components/rzFancyThing.js`**

```javascript
import { require } from '../../runtime/rizzyRequire.js';

export default function rzFancyThing() {
    return {
        someProperty: '',
        observer: null,

        init() {
            this.someProperty = this.$el.dataset.initialFancyValue || 'default';
            const assets = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce;

            if (assets.length === 0) {
                this.setup();
                return;
            }

            require(assets, nonce)
                .then(() => this.setup())
                .catch(error => console.error('[rzFancyThing] Failed to load assets.', error));
        },

        setup() {
            this.observer = new ResizeObserver(() => this.layout());
            this.observer.observe(this.$el);
        },

        layout() { /* ... */ },

        destroy() {
            this.observer?.disconnect();
            this.observer = null;
        },
    };
}
```

### 10.5 Alpine Component Registration (bundle and manifest)

Components are registered lazily: the runtime loads the bundle that owns a component the first
time an element with that `x-data` name appears. There is no eager registration.

1. Export the factory from exactly one bundle in `packages/rizzyui/src/js/bundles/` (choose the
   feature cluster it belongs to):
   ```javascript
   // packages/rizzyui/src/js/bundles/menu-runtime.js
   export { default as rzFancyThing } from '../lib/components/rzFancyThing.js';
   ```
2. Map the component name to that bundle in
   `packages/rizzyui/src/js/runtime/componentBundleManifest.js`:
   ```javascript
   rzFancyThing: 'menu-runtime',
   ```
3. Put `x-data="rzFancyThing"` and `x-load="@LoadStrategyOrNull"` on the same element in the
   `.razor` file (10.2).
4. Run `npm run build` in `packages/rizzyui` and commit the regenerated `dist/` and
   `src/RizzyUI/wwwroot` files; CI checks that they match a fresh build.

