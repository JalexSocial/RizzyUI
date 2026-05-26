## 8. Accessibility Best Practices

Ensuring components are accessible is paramount. LLMs must generate components that strive to adhere to WCAG standards where applicable.

* **Semantic HTML:**

  * Use the most appropriate HTML element for the component's role. The `Element` property in `RzComponent` (defaulting to "div") should be overridden in `OnInitialized()` if a more semantic tag like `<nav>`, `<button>`, `<aside>`, etc., is suitable.
  * Example: A navigation component should use `<nav>`, a button should use `<button>` or `<a>` with `role="button"`.

* **ARIA Attributes:**

  * **Roles:** Apply appropriate `role` attributes (e.g., `role="alert"`, `role="dialog"`, `role="menuitem"`, `role="tab"`, `role="switch"`). The root element pattern in `AGENTS.md` and `docs/agents/component-authoring.md` can have its `role` set via `AdditionalAttributes` or directly if static.
  * **Labels & Descriptions:**

    * Every interactive component MUST have an accessible name. This is typically provided via an `AriaLabel` parameter in the `.razor.cs` file. If the component has visible text that serves as its label, ensure it's associated (e.g., `<label for="...">` for form inputs, or `aria-labelledby` pointing to the ID of the visible text element).
    * Use `aria-label` for concise labels when visible text is insufficient or absent (e.g., icon-only buttons).
    * Use `aria-labelledby` to associate the component with existing visible text that acts as its label.
    * Use `aria-describedby` to associate the component with descriptive text that provides more context.
  * **States & Properties:** Use ARIA attributes to convey state:

    * `aria-expanded` (for accordions, dropdowns, collapsible sections)
    * `aria-selected` (for tabs, items in a listbox)
    * `aria-current` (for pagination, breadcrumbs, steps - e.g., `aria-current="page"` or `aria-current="step"`)
    * `aria-pressed` (for toggle buttons)
    * `aria-hidden` (use judiciously, e.g., for purely decorative icons or off-screen content)
    * `aria-modal="true"` (for modal dialogs)
    * `aria-live` (for dynamic content updates, e.g., alerts, status messages)
    * `aria-controls` (to link a control to the region it manages)
    * For inputs: `aria-required`, `aria-invalid`.

* **Keyboard Navigation & Focus Management:**

  * All interactive elements MUST be keyboard operable.
  * Use `tabindex="0"` for custom interactive elements that should be in the tab order.
  * Use `tabindex="-1"` for elements that should be programmatically focusable but not in the default tab order.
  * For composite widgets (like dropdowns, menus, tabs), implement appropriate keyboard navigation patterns (arrow keys, Home/End, Enter/Space). This is often handled by the Alpine.js logic.
  * Ensure a visible focus indicator. RizzyUI themes generally provide this, but be mindful if overriding default focus styles.
  * For modals and dropdowns that trap focus, use Alpine's `x-trap.inert="isOpen"` directive.

* **Screen Reader Text:**

  * Use the `sr-only` Tailwind class (or equivalent CSS) for text that should only be available to screen readers (e.g., providing context for an icon button).

    ```razor
    <button aria-label="@Localizer["RzComponentName.CloseButtonAriaLabel"]">
        <Blazicon Svg="@MdiIcon.Close" aria-hidden="true" />
        <span class="sr-only">@Localizer["RzComponentName.CloseButtonSrText"]</span> @* Alternative if aria-label isn't sufficient *@
    </button>
    ```

* **Images & Icons:**

  * Decorative icons should have `aria-hidden="true"`.
  * Informative icons (if not accompanied by text) need an accessible label (e.g., via `aria-label` on the button or a `sr-only` span).
  * Images (e.g., `RzAvatar`) must have meaningful `alt` text or `aria-label`.

* **Forms:**

  * Associate labels with form controls using `<label for="...">` and matching `id` on the input. `RzFieldLabel` handles this if `For` is provided.
  * Use `fieldset` and `legend` for groups of related controls (e.g., radio button groups).
  * Provide clear validation messages, associated with inputs using `aria-describedby`. `RzValidationMessage` typically handles this.

---

## 9. Localization

All user-facing strings within components (default labels, ARIA labels, titles, placeholders, etc.) MUST be localizable.

* **Accessing Localizer:**

  * The `RzComponent` base class injects `IStringLocalizer<RizzyLocalization> Localizer`. Use this to retrieve localized strings.

* **Resource Key Convention:**

  * Resource keys should follow the pattern: `ComponentName.ResourceKeyName`.
  * Example: For a default ARIA label in `RzFancyThing`, the key would be `RzFancyThing.DefaultAriaLabel`.
  * Example: For a "Close" button text, `RzModal.CloseButtonText`.

* **Parameter Defaults & Localization:**

  * Component parameters that accept user-facing strings (e.g., `AriaLabel`, `Title`, `Placeholder`) should allow users to provide their own values.
  * If the user does *not* provide a value for such a parameter (i.e., it remains `null` or its default), the component should attempt to load a localized default string.
  * This is typically done in `OnInitialized()` and/or `OnParametersSet()`:

    ```csharp
    // In RzFancyThing.razor.cs
    [Parameter] public string? AriaLabel { get; set; }
    [Parameter] public string? PlaceholderText { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzFancyThing.DefaultAriaLabel"];
        PlaceholderText ??= Localizer["RzFancyThing.DefaultPlaceholder"];
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // If parameters can be changed after init and might become null
        AriaLabel ??= Localizer["RzFancyThing.DefaultAriaLabel"];
        PlaceholderText ??= Localizer["RzFancyThing.DefaultPlaceholder"];
    }
    ```

* **Providing New Resource Strings (LLM Output):**

  * When generating a new component that introduces new localizable strings, the LLM MUST provide the English (default culture) versions of these strings.
  * These should be presented in a clear key-value format, suitable for a developer to copy into the `src/RizzyUI/Resources/RizzyLocalization.resx` file.
  * This information should be provided *outside* the main `output ... ` block, typically alongside the "Manual Edits Required for Theme Integration" section.

  **Example Presentation for New Resource Strings:**

  ````markdown
  **New English Localization Strings for `RizzyLocalization.resx`:**

  Please add the following entries to `src/RizzyUI/Resources/RizzyLocalization.resx`:

  | Name                               | Value                         | Comment (Optional)                  |
  |------------------------------------|-------------------------------|-------------------------------------|
  | `RzFancyThing.DefaultAriaLabel`    | `Fancy interactive element`   | `Default ARIA label for RzFancyThing` |
  | `RzFancyThing.DefaultPlaceholder`  | `Enter fancy text here...`    | `Placeholder for RzFancyThing input`  |
  | `RzAnotherComponent.SomeText`      | `Another default string`      |                                     |

  Alternatively, in raw .resx XML format:
  ```xml
  <data name="RzFancyThing.DefaultAriaLabel" xml:space="preserve">
    <value>Fancy interactive element</value>
    <comment>Default ARIA label for RzFancyThing</comment>
  </data>
  <data name="RzFancyThing.DefaultPlaceholder" xml:space="preserve">
    <value>Enter fancy text here...</value>
    <comment>Placeholder for RzFancyThing input</comment>
  </data>
  <data name="RzAnotherComponent.SomeText" xml:space="preserve">
    <value>Another default string</value>
  </data>
  ```
  ````

