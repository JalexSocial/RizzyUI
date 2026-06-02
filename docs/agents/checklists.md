## 16. Final checklist for the LLM

* CRITICAL - Only generate or modify code directly related to the task requested. You are not permitted to modify code outside the scope of the request.
* **Existing-component accessibility refactors:** Before editing, inspect existing Razor/C#, JavaScript/Alpine, tests, and docs. Preserve compliant keyboard handling, focus handling, ARIA relationships, live-region behavior, id generation, `rz:` events, public parameters, data attributes, CSS hooks, slot names, localization keys, docs examples, and generated ids unless replacement is necessary and covered by tests.
* **No accidental replacement components:** Do not create new components during accessibility hardening unless the prompt explicitly requests new component creation. Update existing components in place, for example `RzNativeSelect`, `RzCombobox`, `RzNavigationMenu`, `RzAlert`, `RzTooltip`, or `RzDataTable`.
* **Component Naming:** Ensure only root-level components are prefixed with `Rz`.
* Prepend the cross-file edit instructions for theme, localization, asset management, and **documentation navigation** if needed (see `docs/agents/output.md`).
* Provide an `output` block for new or replaced component-specific files **and documentation pages** only (see `docs/agents/output.md` and `docs/agents/documentation.md`).
* Use the root element pattern (see `docs/agents/component-authoring.md`) and Alpine child-container convention if Alpine is used (see `docs/agents/alpine.md`).
* `.razor` files: Use `@inherits RzComponent<...>` and `SlotClasses.Get...()` for all classes (see `docs/agents/component-authoring.md`).
* `.razor.cs` files:

  * Start with `/// <summary>...</summary>` for the class and public members.
  * Inherit from `RzComponent<TSlots>` or `RzAsChildComponent<TSlots>`.
  * **For non-generic components:** Define `Slots` and `DefaultDescriptor` inside the class.
  * **For generic components:** Implement the `IHas...StylingProperties` interface.
  * Implement `protected override TvDescriptor<...> GetDescriptor() => Theme.ComponentName;`.
  * **Ensure `RootClass()` method is NOT present.**
  * Handle default localized strings for parameters like `AriaLabel` (see `docs/agents/accessibility.md`).
* Styling files (`Styling/ComponentNameStyles.cs` for generics):

  * Define the non-generic `Slots` class.
  * Define the `static class` containing the `DefaultDescriptor`.
  * Variant expressions in the descriptor **MUST** cast to the `IHas...StylingProperties` interface.
* Alpine.js: Strictly adhere to API restrictions by always using `Alpine.data` and referencing properties/methods by key only.
* Documentation: Ensure the generated documentation page (`Info.razor`) strictly follows the layout, structure, and content rules in `docs/agents/documentation.md`.
* Include unit tests *only* when specifically requested (see `docs/agents/testing.md`).
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
* **[ ] 17a. Existing Accessibility Behavior Preserved:** For existing-component refactors, compliant keyboard handling, focus handling, ARIA relationships, live-region behavior, generated IDs, `rz:` events, and public hooks were preserved or deliberately migrated with characterization tests.

#### **Part B: Documentation Verification Checklist**

* **[ ] 18. Documentation Page Exists:** A file in `src/RizzyUI.Docs/Components/Pages/Components/` exists and matches the component name.
* **[ ] 19. Structure Compliance:** The documentation page uses `RzQuickReferenceContainer`, `RzBreadcrumb`, and `RzCodeViewer` correctly.
* **[ ] 20. Content Compliance:** The documentation includes a Parameters table and (if applicable) Alpine API/Event details.
* **[ ] 21. Navigation Updated:** The new component is listed in `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`.
* **[ ] 21a. Refactor Documentation Accuracy:** Existing component docs were updated in place and still describe the implemented keyboard, focus, ARIA, announcement, event, and SSR/CSP behavior accurately.

#### **Part C: Human Developer Validation Checklist**

* **[ ] 22. Theme Integration:** Have the manual edits to `RzTheme.StyleProviders.cs` and `RzTheme.cs` been applied correctly?
* **[ ] 23. Obsolete Files Deleted:** Have the old `Default...Styles.cs` and `RzStylesBase...cs` files for the component been deleted?
* **[ ] 24. Build Success:** Does the entire `RizzyUI` solution build without errors?
* **[ ] 25. Unit Tests:** Do all existing unit tests for the component pass?
* **[ ] 26. Demo Application:** Visually confirm that the component renders and behaves exactly as it did before the refactor in the `RizzyUI.Docs` application.
* **[ ] 27. Final Response Preservation Summary:** For accessibility refactors, did the final response state what existing behavior was preserved, what behavior was replaced, and why?
