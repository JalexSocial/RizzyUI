## 10. Alpine.js Integration & Asset Bundling

RizzyUI components that require client-side interactivity leverage Alpine.js. The integration follows a specific pattern for defining components, managing their assets, and ensuring CSP compliance.

### 10.1 Alpine.js API Restrictions (CSP Build)

**It is CRITICAL to understand and adhere to these API restrictions when writing Alpine.js code for RizzyUI components.** Since Alpine.js, when built for Content Security Policy (CSP) compliance, can no longer interpret strings as plain JavaScript, it has to parse and construct JavaScript functions from them manually.

Due to this limitation, you **MUST** use `Alpine.data` to register your `x-data` objects, and **MUST** reference properties and methods from it by key only.

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

* **Always use `Alpine.data`** for `x-data` definitions. Never inline `x-data` objects.
* **Reference properties and methods by key only** (e.g., `increment`, `count`, `foo.increment`). Avoid complex inline expressions like `count++`, `isActive = !isActive`, or `myFunction(param1, param2)`. Instead, encapsulate such logic within methods defined in your `Alpine.data` object.
* Dot notation for nested properties is allowed.

### 10.2 Alpine Child-Container Convention (in `.razor` file)

If a RizzyUI component uses Alpine.js, its root `<HtmlElement>` in the `.razor` file MUST contain a direct child `<div>` with the following attributes. This `div` serves as the root for the Alpine component.

```razor
<HtmlElement Element="@EffectiveElement" id="@Id" @attributes="@AdditionalAttributes" class="@SlotClasses.GetBase()">
    <div data-alpine-root="@Id" @* Crucial: Must match the Blazor component's @Id *@
         x-data="rzFancyThing"   @* Alpine component name, e.g., 'rzComponentName' *@
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

* Each new Alpine component (e.g., `rzFancyThing`) MUST have its logic defined in a **new, separate JavaScript file**.
* Location: `packages/rizzyui/src/js/lib/components/rzFancyThing.js` (replace `rzFancyThing` with the actual component name).
* This file MUST export a default function.

  * The first argument to this function will always be the `Alpine` instance.
  * If the component needs to dynamically load assets (using the `data-assets` attribute), the function should accept `require` as a second argument. This `require` is the `rizzyRequire` utility provided by `components.js`.
* Inside this exported function, the Alpine component is defined using `Alpine.data('rzFancyThing', () => ({ /* component logic */ }));`. The name used here (e.g., `'rzFancyThing'`) MUST match the `x-data` attribute in the Razor markup.
* The `init()` method within the Alpine data object is typically responsible for:

  1. Retrieving `assetsToLoad` by parsing `this.$el.dataset.assets`.
  2. Retrieving `nonce` from `this.$el.dataset.nonce`.
  3. If `assetsToLoad` is not empty and the `require` function was passed in, call `require(assetsToLoad, { success: callback, error: errCallback }, nonce)`.
  4. Place any Alpine initialization logic that *depends* on these external assets (e.g., initializing a third-party library like Flatpickr or Highlight.js) inside the `success` callback of `require`.
  5. Other initialization logic (e.g., setting up internal state, watchers) can be placed directly in `init()` or in a separate method called from `init()` (either before or after `require`, or within its callbacks, as appropriate).

**Example: `packages/rizzyui/src/js/lib/components/rzFancyThing.js`**

```javascript
// This component demonstrates conditional asset loading.
// If data-assets is empty or 'require' is not provided, it proceeds without loading.
export default function(Alpine, require) { // 'require' is optional here
    Alpine.data('rzFancyThing', () => ({
        someProperty: 'initialValue',
        assetsLoaded: false,

        init() {
            const assetsToLoad = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce || '';
            const self = this; // Retain 'this' context for callbacks

            // Example: Read an initial value from a data attribute
            this.someProperty = this.$el.dataset.initialFancyValue || 'default fancy value';

            if (assetsToLoad.length > 0 && typeof require === 'function') {
                console.log(`rzFancyThing (${this.$el.id}): Attempting to load assets:`, assetsToLoad);
                require(assetsToLoad, {
                    success: function() {
                        console.log(`rzFancyThing (${self.$el.id}): Assets loaded successfully.`);
                        self.assetsLoaded = true;
                        // Example: Initialize a library if 'some-library.js' was loaded
                        // if (window.SomeLibrary) {
                        //     self.libraryInstance = new window.SomeLibrary(self.$el.querySelector('.target-for-lib'));
                        // }
                        self.setupInteractivity(); // Call main logic after assets
                    },
                    error: function(err) {
                        console.error(`rzFancyThing (${self.$el.id}): Failed to load assets.`, err);
                        // Decide if setupInteractivity should still run or if it's critical
                        self.setupInteractivity(); // Or handle error state
                    }
                }, nonce);
            } else {
                // No assets to load, or 'require' function not available/needed by this component.
                // Proceed with non-asset-dependent setup.
                console.log(`rzFancyThing (${this.$el.id}): No assets to load or require not provided.`);
                self.setupInteractivity();
            }
        },

        setupInteractivity() {
            // Main Alpine logic that runs (potentially after assets are loaded)
            console.log(`rzFancyThing (${this.$el.id}): Setting up interactivity. Current someProperty:`, this.someProperty);
            
            // Example: Watch for changes to 'someProperty'
            // this.$watch('someProperty', (value) => {
            //    console.log(`rzFancyThing (${this.$el.id}): someProperty changed to:`, value);
            // });
        },

        updateFancyProperty(newValue) {
            this.someProperty = newValue;
        }
        // ... other methods and properties for rzFancyThing
    }));
}
```

### 10.5 Alpine Component Registration (in `packages/rizzyui/src/js/lib/components.js`)

* The newly created component registration function (e.g., `registerRzFancyThing` which is the default export from `rzFancyThing.js`) MUST be imported into `packages/rizzyui/src/js/lib/components.js`.
* It must then be called within the `registerComponents(Alpine)` function in `components.js`. Pass the `Alpine` instance. If the component's registration function (e.g., `export default function(Alpine, require)`) expects the `require` utility, pass `rizzyRequire` (which is `loadjs` aliased as `require` in this file) as the second argument.

**Example: Modifying `packages/rizzyui/src/js/lib/components.js`**

```javascript
// packages/rizzyui/src/js/lib/components.js
import loadjs from "./loadjs/loadjs.js"; // Underlying asset loader

// ... other existing component imports ...
import registerRzAccordion from './components/rzAccordion.js';
import registerRzFancyThing from './components/rzFancyThing.js'; // <-- NEW IMPORT

// ... (rizzyRequire function definition using loadjs) ...
// async function generateBundleId(paths) { ... }
// function rizzyRequire(paths, callbackFn, nonce) { ... }


function registerComponents(Alpine) {
    // ... other existing component registrations ...
    registerRzAccordion(Alpine); // Example of a component not needing 'require'
    
    // Register the new component.
    // Pass 'rizzyRequire' if its definition function expects it.
    registerRzFancyThing(Alpine, rizzyRequire); // <-- NEW REGISTRATION
}

export { registerComponents, rizzyRequire as require };
```

