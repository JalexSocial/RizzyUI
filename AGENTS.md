### **The Definitive Guide to Authoring a RizzyUI Component (Version 3.5 - Documentation Standards)**

**Fully expanded specification for code-generation models — Feb 2026, rev 3.5**

---

---

## Up-Front Non-Negotiables (READ FIRST)

1. **RizzyUI is SSR (server-side rendered) ONLY.**

   * **Do not** write components that require Blazor interactivity.
   * **Do not** introduce Blazor event-based behaviors (`@onclick`, `@onchange`, `@onsubmit`, `@bind`, `EventCallback`, interactive input components that require a Blazor circuit, etc.).
   * All client-side interactivity must be implemented via **Alpine.js** and/or **HTMX** patterns already used in RizzyUI (see `docs/agents/alpine.md`).

2. **AGENTS ONLY — Node install rule**

   * Run `npm install` in **any directory that contains a `packages.json`**.
     *(If the repository uses `package.json` in practice, treat it as the same intent; do not skip installs.)*

3. **Documentation is Mandatory**

   * **Every** new component must have a corresponding documentation page in `src/RizzyUI.Docs/Components/Pages/Components/`.
   * **Every** modified component must have its documentation page updated to reflect API, parameter, or behavior changes.
   * **Every** new component must be added to the navigation menu in `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`.

4. **SSR interaction event policy (mandatory)**

   * For browser-observable interactions in SSR components, prefer Alpine `$dispatch(...)` or `CustomEvent` helpers that emit `rz:` namespaced events.
   * Do **not** use `EventCallback` for browser-only post-render interaction flows.
   * Event payloads must use serializable primitives and stable identifiers.
   * Never emit full `TItem` instances or server object graphs in browser event payloads.
   * For table-like stateful primitives, emit granular events and a table-level aggregate state event when useful (for example `rz:table:on-state-change`).

---

## Precedence (Mandatory)

- `AGENTS.md` is the canonical entry point.
- Delegated specification files extend this guide.
- If a conflict exists, `AGENTS.md` takes precedence unless explicitly delegated.

---

## How to Use This File (Execution Flow) (Mandatory)

1. Read all **Non-Negotiables**
2. Identify the task type
3. Load the **Minimum Required Read Set**
4. Perform implementation using delegated specifications
5. Apply the appropriate **Validation Checklists**
6. Produce output following the **Output Contract**

---

## Node Manifest Clarification (Mandatory)

The original repository guidance refers to `packages.json`. In practice, agents should also check for `package.json` and treat it as the same intent.

---

## Delegated Specifications (Routing)

The following files contain expanded rules. Each file focuses on a specific domain. Agents must consult these when working in that area.

- `docs/agents/repository-structure.md`  
  → Repository layout, directory responsibilities, and file placement rules

- `docs/agents/component-authoring.md`  
  → Razor component structure, slots, inheritance, naming, and markup rules

- `docs/agents/styling.md`  
  → TailwindVariants usage, slot styling patterns, descriptor rules, and variant handling

- `docs/agents/accessibility.md`  
  → Accessibility requirements, ARIA usage, semantic HTML guidance, and localization rules

- `docs/agents/alpine.md`  
  → Alpine.js integration rules, CSP-safe patterns, asset loading, and client-side interaction constraints

- `docs/agents/testing.md`  
  → bUnit test structure, required test categories, and SSR testing constraints

- `docs/agents/documentation.md`  
  → Documentation page structure, required sections, demo patterns, and navigation integration

- `docs/agents/output.md`  
  → Output block syntax, cross-file edit rules, and agent reporting expectations

- `docs/agents/checklists.md`  
  → Validation checklists used to verify correctness of generated components, documentation, and integration

---

## Minimum Required Read Set (Task Matrix) (Routing)

### Component Creation or Modification
- `AGENTS.md`
- `docs/agents/component-authoring.md`
- `docs/agents/styling.md`
- `docs/agents/accessibility.md`
- `docs/agents/alpine.md`
- `docs/agents/documentation.md`
- `docs/agents/testing.md`
- `docs/agents/checklists.md`

### Component with Alpine Behavior
- `AGENTS.md`
- `docs/agents/component-authoring.md`
- `docs/agents/styling.md`
- `docs/agents/accessibility.md`
- `docs/agents/alpine.md`
- `docs/agents/documentation.md`
- `docs/agents/testing.md`
- `docs/agents/checklists.md`

### Documentation Only
- `AGENTS.md`
- `docs/agents/documentation.md`
- `docs/agents/checklists.md`

### Testing Only
- `AGENTS.md`
- `docs/agents/testing.md`
- `docs/agents/checklists.md`

### JavaScript / Alpine Runtime Work
- `AGENTS.md`
- `docs/agents/alpine.md`
- `docs/agents/repository-structure.md`
- `docs/agents/checklists.md`

### Styling / Theming Work
- `AGENTS.md`
- `docs/agents/styling.md`
- `docs/agents/component-authoring.md`
- `docs/agents/checklists.md`

### Localization Work
- `AGENTS.md`
- `docs/agents/accessibility.md`
- `docs/agents/output.md`
- `docs/agents/checklists.md`

### Cross-File Integration Work
- `AGENTS.md`
- `docs/agents/repository-structure.md`
- `docs/agents/output.md`
- `docs/agents/checklists.md`

---

## Repository Directory Structure

The repository is organized as a .NET solution containing the core Razor Class Library, a documentation site, and a companion NPM package for client-side asset generation.

### `src/RizzyUI` (Core Library)

The main Razor Class Library (RCL) containing all UI components and logic.

* **`Components/`**: The UI components, organized by category (e.g., `Display`, `Form`, `Layout`, `Navigation`).

  * *Structure*: Most components use a split-file pattern: `RzComponent.razor` (markup) and `RzComponent.razor.cs` (logic/styling). Generic components may also have a separate `Styling/` folder.
* **`RzTheme.cs` & `RzTheme.StyleProviders.cs`**: The central registry for component styling definitions (`TvDescriptor`) and theme configuration.
* **`Resources/`**: Contains `.resx` files for localization (e.g., `RizzyLocalization.en.resx`).
* **`Extensions/`**: Service collection extensions and helper methods.
* **`Attributes/`**: Custom attributes used for Alpine code-behind discovery.

### `packages/rizzyui` (Client Assets)

The NPM package responsible for building the CSS (Tailwind) and JavaScript (Alpine.js) bundles distributed with the library.

* **`src/js/lib/components/`**: Individual Alpine.js component definitions (e.g., `rzAccordion.js`, `rzTabs.js`). These map to the `x-data` attributes used in Razor components.
* **`src/js/rizzyui.js`**: The main entry point that bootstraps Alpine.js and registers components.
* **`src/css/`**: Tailwind CSS source files.

** DO NOT ** directly alter files in `packages/rizzyui/dist` and `src/RizzyUI/wwwroot` as files from those directory are build assets from running `npm run build` in `packages/rizzyui`

### `src/RizzyUI.Docs` (Documentation)

A Blazor Web App that acts as the documentation site and component playground.

* **`Components/Pages/Components/`**: Contains the documentation pages for specific components (e.g., `ButtonInfo.razor`). These pages serve as the primary source of usage examples.
* **`Components/Layout/ComponentList.razor`**: The side navigation menu listing all available components.

### `src/RizzyUI.Tests` (Unit Tests)

Contains bUnit tests to verify component rendering and logic.

* **`Components/`**: Mirrors the folder structure of `src/RizzyUI/Components` for component-specific tests.

### `src/RizzyUI.Tasks` (Build Tools)

Contains MSBuild tasks used for build-time operations, such as computing source paths for co-located JavaScript modules.

---

## 0. Why this file exists

This guide is a **contract for any large-language model**—ChatGPT, Claude, Gemini, Azure OpenAI, etc.—that emits source code destined for the **RizzyUI** repository.

If the model follows every rule, a maintainer (or an automated agent) can:

### If working via copy/paste (chat-style generation)

1. Paste the generated files into `src/RizzyUI/…` and `src/RizzyUI.Docs/…`.
2. Apply the indicated cross-file edits (see `docs/agents/output.md` and `docs/agents/checklists.md`).
3. Run `dotnet build`.

### If working as an agent with direct repository access (agent-based edits)

1. Apply the file additions/edits directly in the working tree (including any cross-file edits described in `docs/agents/output.md`).
2. Ensure any required Node dependencies are installed where applicable (**AGENTS ONLY — see “Up-Front Non-Negotiables”**).
3. Run `dotnet build` (and any requested tests), and ensure repository conventions remain intact.

In both modes, the solution should compile, pass unit tests (when applicable/requested), and conform to RizzyUI’s conventions **without manual tweaks**.

SPECIAL NOTE: @* *@ comments in this document are used to provide LLM guidance only. They are **not** to be included in the generated code.

---

## Output Contract (Summary — Mandatory)

- Use a single `output` block when generating files
- Use one `<files>` root element
- Each file must use `<file path="...">`
- Do not nest `<files>`
- Always close tags
- If no files are created, omit the output block

Cross-file edits must be reported **outside** the output block.

For the full syntax, examples, and cross-file edit rules, read `docs/agents/output.md`.

---

## Validation Checklist Usage (Mandatory)

- Apply **Part A: LLM Automated Verification Checklist** after any component change.
- Apply **Part B: Documentation Verification Checklist** after any component or documentation update.
- Apply **Part C: Human Developer Validation Checklist** when modifying theme, localization, asset management, JavaScript registration, or documentation navigation.
- Apply the full checklist set at the end of any substantial repository change unless the task explicitly limits the scope.

---

## 16. Final checklist for the LLM

* CRITICAL - Only generate or modify code directly related to the task requested. You are not permitted to modify code outside the scope of the request.
* **Component Naming:** Ensure only root-level components are prefixed with `Rz`.
* Prepend the cross-file edit instructions for theme, localization, asset management, and **documentation navigation** if needed (`docs/agents/output.md`).
* Provide an `output` block for new or replaced component-specific files **and documentation pages** only (`docs/agents/output.md` and `docs/agents/documentation.md`).
* Use the root element pattern (`docs/agents/component-authoring.md`) and Alpine child-container convention if Alpine is used (`docs/agents/alpine.md`).
* `.razor` files: Use `@inherits RzComponent<...>` and `SlotClasses.Get...()` for all classes (`docs/agents/component-authoring.md`).
* `.razor.cs` files:

  * Start with `/// <summary>...</summary>` for the class and public members.
  * Inherit from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`.
  * **For non-generic components:** Define `Slots` and `DefaultDescriptor` inside the class.
  * **For generic components:** Implement the `IHas...StylingProperties` interface.
  * Implement `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
  * **Ensure `RootClass()` method is NOT present.**
  * Handle default localized strings for parameters like `AriaLabel` (`docs/agents/accessibility.md`).
* Styling files (`Styling/ComponentNameStyles.cs` for generics):

  * Define the non-generic `Slots` class.
  * Define the `static class` containing the `DefaultDescriptor`.
  * Variant expressions in the descriptor **MUST** cast to the `IHas...StylingProperties` interface.
* Alpine.js: Strictly adhere to API restrictions by always using `Alpine.data` and referencing properties/methods by key only.
* Documentation: Ensure the generated documentation page (`Info.razor`) strictly follows the layout, structure, and content rules in `docs/agents/documentation.md`.
* Include unit tests *only* when specifically requested (`docs/agents/testing.md`).
* Adhere to all specified conventions and avoid manual concatenation of class strings.
* Do not include comments in Razor markup or using statements. Any comments in code blocks should be production-ready.

**SSR-only enforcement (CRITICAL):**

* Do not implement Blazor interactive patterns in components. All interactivity is Alpine/HTMX (see `docs/agents/alpine.md`).

**Agent-only enforcement (CRITICAL):**

* AGENTS ONLY — run `npm install` in any directory containing `packages.json` (and do not skip equivalent Node manifest directories) except if it has a path prefixed with `src/RizzyUI/wwwroot/vendor/`.  

---

### **Final Sign-Off Checklist (Version 3.5)**

#### **Part A: LLM Automated Verification Checklist**

* **[ ] 1. `Slots` Class Definition:**

  * For **non-generic** components: The `.razor.cs` file contains a `public sealed partial class Slots : ISlots`.
  * For **generic** components: The `Styling/{ComponentName}Styles.cs` file contains a `public sealed partial class {ComponentName}Slots : ISlots`.
* **[ ] 2. `Slots` Properties:** The `Slots` class has a `string?` property for *every* slot consumed by a `SlotClasses.Get...()` call in the `.razor` file.
* **[ ] 3. `[Slot]` Attribute:** Every property in every `Slots` class is decorated with `[Slot("kebab-case-name")]`.
* **[ ] 4. `DefaultDescriptor` Location:**

  * For **non-generic** components: The `.razor.cs` file contains a `public static readonly TvDescriptor`.
  * For **generic** components: The `Styling/{ComponentName}Styles.cs` file contains a `public static class {ComponentName}Styles` holding the `public static readonly TvDescriptor`.
* **[ ] 5. Descriptor Completeness:** The `DefaultDescriptor` provides a default class string for *every* slot defined in the `Slots` class.
* **[ ] 6. Interface Implementation (Generic Components Only):** For generic components, the component's `.razor.cs` file **implements** the `IHas...StylingProperties` interface.
* **[ ] 7. Styling File Structure (Generic Components Only):** The `Styling/{ComponentName}Styles.cs` file exists and contains the styling interface, the slots class, and the static styles class.
* **[ ] 8. Correct Variant Syntax:** All `variants` and `compoundVariants` that target a slot other than `Base` **MUST** use the `new() { [s => s.SlotName] = "..." }` syntax. For generic components, variant expressions **MUST** cast the component instance to the styling interface (e.g., `c => ((IHas...StylingProperties)c).PropertyName`).
* **[ ] 9. Nullable Enum Variant Type:** For nullable enum `[Parameter]`s used in variants, the `Variant<T, TSlots>` definition uses the **non-nullable** enum type for `T`.
* **[ ] 10. Inheritance:** The component's `.razor.cs` file inherits from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`, where `TSlots` is the correct (and possibly non-generic) slots type.
* **[ ] 11. Correct `GetDescriptor` Implementation:** The component's `.razor.cs` file **MUST** contain the method `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
* **[ ] 12. `RootClass()` Method Removed:** The `RootClass()` method has been completely removed from the component's `.razor.cs` file.
* **[ ] 13. Markup Inheritance:** The component's `.razor` file has the correct `@inherits` directive.
* **[ ] 14. Markup Class Attributes:** All `class` attributes in the `.razor` file have been updated to use the `SlotClasses.Get...()` accessors.
* **[ ] 15. `data-slot` on Root Element:** The root `HtmlElement` has a `data-slot="component-name"` attribute with a hardcoded, kebab-case name.
* **[ ] 16. `data-slot` on Internal Elements:** Every internal element with a `class="@SlotClasses.Get...()"` attribute also has a corresponding `data-slot="@...SlotNames.NameOf(...)"` attribute.
* **[ ] 17. Alpine Directives Preserved:** All non-class Alpine directives are present in the `.razor` file on their original elements.

#### **Part B: Documentation Verification Checklist**

* **[ ] 18. Documentation Page Exists:** A file in `src/RizzyUI.Docs/Components/Pages/Components/` exists and matches the component name.
* **[ ] 19. Structure Compliance:** The documentation page uses `RzQuickReferenceContainer`, `RzBreadcrumb`, and `RzCodeViewer` correctly.
* **[ ] 20. Content Compliance:** The documentation includes a Parameters table and (if applicable) Alpine API/Event details.
* **[ ] 21. Navigation Updated:** The new component is listed in `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`.

#### **Part C: Human Developer Validation Checklist**

* **[ ] 22. Theme Integration:** Have the manual edits to `RzTheme.StyleProviders.cs` and `RzTheme.cs` been applied correctly?
* **[ ] 23. Obsolete Files Deleted:** Have the old `Default...Styles.cs` and `RzStylesBase...cs` files for the component been deleted?
* **[ ] 24. Build Success:** Does the entire `RizzyUI` solution build without errors?
* **[ ] 25. Unit Tests:** Do all existing unit tests for the component pass?
* **[ ] 26. Demo Application:** Visually confirm that the component renders and behaves exactly as it did before the refactor in the `RizzyUI.Docs` application.