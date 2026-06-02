## 11. Unit tests (bUnit) (IMPORTANT: ONLY ON REQUEST)

When unit tests are specifically requested for a new or modified component, they should be generated using bUnit and adhere to the following guidelines. Tests ensure component correctness, accessibility, and integration with the RizzyUI theme system and Alpine.js patterns.

**SSR-only reminder (CRITICAL):**

* Do not write tests that depend on Blazor interactivity or client-side event dispatch into .NET (e.g., asserting an `EventCallback` was invoked by a simulated click). RizzyUI is SSR-only, so tests should primarily verify **rendered markup**, **attributes**, **classes**, **data-slot correctness**, and **Alpine integration elements**.

**Existing accessibility behavior refactors (CRITICAL):**

* Before refactoring existing accessibility behavior, inspect current bUnit tests, Playwright accessibility tests, JavaScript tests, and component docs.
* Add characterization tests before changing behavior that is not already covered. Characterization tests should capture the currently compliant contract: keyboard handling, focus management, ARIA roles/states/properties, ID relationships, live-region behavior, `rz:` events, generated IDs, public data attributes, slot names, and docs examples that represent supported usage.
* Do not duplicate key handling in tests or implementation. If a component already handles a key correctly, preserve that path or migrate it deliberately with tests.
* When migrating behavior into a shared primitive from `packages/rizzyui/src/js/runtime/a11y/`, keep tests at the component boundary to prove the component still exposes the same public behavior.
* Accessibility hardening tests should target existing components and paths such as `RzNativeSelect`, `RzCombobox`, `RzNavigationMenu`, `RzAlert`, `RzTooltip`, and `RzDataTable`; do not add tests for replacement components unless new component creation was explicitly requested.

* **File Location and Naming:**

  * Test files should reside in the `src/RizzyUI.Tests/Components/` directory, mirroring the component's path under `src/RizzyUI/Components/`.
  * Example: For `src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor`, the test file would be `src/RizzyUI.Tests/Components/Fancy/RzFancyThingTests.cs`.
  * Use file-scoped namespaces matching the directory structure within the test project (e.g., `namespace RizzyUI.Tests.Components.Fancy;`).

* **Test Class Structure:**

  * Test classes MUST inherit from `BunitAlbaContext`.
  * Test classes MUST implement `IClassFixture<WebAppFixture>`.
  * The constructor MUST accept a `WebAppFixture` parameter and pass it to the `base(fixture)` constructor.
  * The `WebAppFixture` (via `BunitAlbaContext`) handles the setup of essential services like `IHttpContextAccessor`, `IRizzyNonceProvider`, and automatically calls `AddRizzyUI()`, which registers `TwMerge` and the default `RzTheme`.

  ```csharp
  // Example: src/RizzyUI.Tests/Components/Fancy/RzFancyThingTests.cs
  using Bunit;
  using Microsoft.AspNetCore.Components; // For RenderFragment, etc.
  using RizzyUI.Components.Fancy.RzFancyThing; // Import the component being tested
  // Add other necessary using statements (e.g., Blazicons, System.Linq.Expressions)

  namespace RizzyUI.Tests.Components.Fancy; // File-scoped namespace

  public class RzFancyThingTests : BunitAlbaContext, IClassFixture<WebAppFixture>
  {
      // private readonly IAlbaHost _host; // Only needed if testing HTTP interactions via Alba

      public RzFancyThingTests(WebAppFixture fixture) : base(fixture)
      {
          // _host = fixture.Host; // Store if needed for Alba HTTP tests
          // Services.AddRizzyUI(); // This is ALREADY CALLED by WebAppFixture, no need to call again.
      }

      // ... Test methods ...
  }
  ```

* **Test Method Guidelines (`[Fact]` or `[Theory]`):**

  1. **Default Render Test:**

     * Render the component with minimal or no parameters (or only required ones like `Id`).
     * Assert the root element exists and has the correct default tag (e.g., `div` unless overridden).
     * Verify the `Id` is correctly applied.
     * Assert that `cut.Find("selector").ClassList` contains the expected base classes from the `DefaultDescriptor`.
     * Assert default ARIA attributes (e.g., `role`, default `aria-label` if applicable from localization).
     * If the component uses Alpine.js:

       * Assert the presence of the Alpine child-container (`div[data-alpine-root='@Id']`).
       * Assert `x-data` attribute matches the component's Alpine module name.
       * Assert `data-assets` attribute is present and contains the JSON serialized URLs resolved from the default `ComponentAssetKeys`.
       * Assert `data-nonce` attribute is present.

  2. **Parameter Variation Tests:**

     * For each significant parameter, create tests to verify its effect on rendering.
     * **CSS Classes:** Use `cut.Find("selector").ClassList.Contains("expected-class")`. Verify that dynamic style provider methods (e.g., `GetSizeCss`, `GetVariantCss`) are correctly applying classes.
     * **ARIA Attributes:** Assert that ARIA attributes change correctly based on parameters (e.g., `aria-expanded`, `aria-pressed`, `aria-current`).
     * **Conditional Rendering:** Assert elements are rendered or hidden based on boolean parameters (e.g., `ShowIcon`, `Dismissable`).
     * **Content Parameters:**

       * Test `Label` parameter vs. `ChildContent` precedence if applicable.
       * Verify `RenderFragment` parameters like `ChildContent`, `LeadingIcon`, `TrailingIcon`, `HeaderContent`, `FooterContent` are rendered correctly.
       * For icons (`SvgIcon?`), assert that `<Blazicon Svg="@IconParameter" ... />` is rendered with appropriate classes and `aria-hidden="true"` if decorative.

  3. **Accessibility Tests:**

     * Explicitly verify that `AriaLabel` parameter, when set, overrides any default.
     * Verify that if `AriaLabel` is *not* set, the component applies a default localized ARIA label (retrieved via `Localizer["ComponentName.DefaultAriaLabel"]`).
     * Check for other critical ARIA attributes relevant to the component's role.

  4. **Interaction Tests (if applicable):**

     * For interactive components (e.g., buttons, toggles), simulate user actions:

       * `cut.Find("button").Click()`
       * `cut.Find("input").Change("new value")`
     * Assert that `EventCallback` parameters are invoked.
     * Assert that component state (if exposed or reflected in markup/ARIA) changes as expected.

     **SSR-only clarification for the Interaction Tests subsection (CRITICAL):**

     * The above interaction patterns must **not** be used to validate Blazor client interactivity in RizzyUI.
     * If included at all, interaction simulations must be limited to verifying **static markup** outcomes or server-side-rendered differences driven by parameters, not client-side state changes in .NET.

  5. **Styling and `AdditionalAttributes`:**

     * Verify that classes passed via `AdditionalAttributes` (e.g., `<RzFancyThing class="my-custom-style">`) are correctly merged into the root element's class list.
     * Verify other `AdditionalAttributes` are passed through to the root element.

  6. **Localization of Defaults:**

     * Test that default text values (e.g., for `AriaLabel`, `Placeholder`, `Title` if not provided by user) are correctly sourced from `Localizer["ComponentName.ResourceKey"]`.

* **bUnit Assertions:**

  * Use `cut.Find("css-selector")` to locate elements.
  * Use `element.MarkupMatches("expected html")` for precise structural and attribute checks. Use `diff.MissingAttributes` or `diff.MissingChildren` from the diff result for debugging.
  * Use `element.ClassList` for asserting CSS classes.
  * Use `element.GetAttribute("attribute-name")` for asserting attribute values.
  * Use `cut.Instance` to access the component instance's properties and methods if needed (e.g., to check the `_assets` field).

* **Output Format:**

  * When tests are requested, the generated `.cs` test file(s) should be included within the `<files>` block of the `output ... ` section, just like component files.

