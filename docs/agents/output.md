## 1. Output-file syntax (mandatory for new or replacement files)

When the user requests code, wrap each file in a single **`output` block** so automation scripts know where to save it.

````markdown
```output
<files>
  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor">
  <!-- Razor markup -->
  </file>

  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor.cs">
  <!-- C# code-behind -->
  </file>

  <file path="src/RizzyUI.Docs/Components/Pages/Components/FancyThingInfo.razor">
  <!-- Documentation Page -->
  </file>
</files>
```
````

* Never nest `<files>` elements.
* Always close every `<file>` tag.
* If no new files are needed, **omit** the `output` block entirely.
* Wrap the entire files response in a single markdown `output` block when generating multiple files.

**Agent-mode note (direct repo edits):**

* If you are applying changes directly (not generating copy/paste blocks), you must still adhere to **all** file paths, patterns, conventions, and cross-file edit rules in this document.
* When reporting results back, enumerate which files were changed/added and summarize the edits precisely (a diff-style explanation is acceptable).


---

## 13. The output block example (canonical)

When asked to generate `RzFancyThing` (a non-generic component):

```output
<files>
  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor">…</file>
  <file path="src/RizzyUI/Components/Fancy/RzFancyThing/RzFancyThing.razor.cs">…</file>
  <file path="src/RizzyUI.Docs/Components/Pages/Components/FancyThingInfo.razor">…</file>
</files>
```

When asked to generate `RzGenericThing<TItem>`:

```output
<files>
  <file path="src/RizzyUI/Components/Generic/RzGenericThing/RzGenericThing.razor">…</file>
  <file path="src/RizzyUI/Components/Generic/RzGenericThing/RzGenericThing.razor.cs">…</file>
  <file path="src/RizzyUI/Components/Generic/RzGenericThing/Styling/RzGenericThingStyles.cs">…</file>
  <file path="src/RizzyUI.Docs/Components/Pages/Components/GenericThingInfo.razor">…</file>
</files>
```

---

## 14. What **not** to place in the `output` block

Changes to **global theme scaffolding** (`RzTheme.cs`, `RzTheme.StyleProviders.cs`), **configuration** (`RizzyUIConfig.cs`, `ServiceCollectionExtensions.cs`), **localization resource files** (`RizzyLocalization.resx`), and **navigation menus** (`ComponentList.razor`) go in a **separate, preface section** that appears *before* the `output` block.
That section must identify each existing file and show the lines/entries to insert, either as a diff or as verbatim code snippets/tables.
Never embed these edits in `<file>` tags because CI merges them manually.

**Agent-mode note (direct repo edits):**

* If you are acting as an agent and can modify files directly, you may apply these edits in-place, but you must still present them as **clearly delineated cross-file edits** (diff-style or explicit snippets) in your report so maintainers can review them quickly.

---

## 15. Theme, Localization, Asset, and Documentation Integration (cross-file edits)

Whenever a new component is introduced, instruct the user accordingly:

**Manual Edits Required for Integration:**

**Theme Integration:**

1. **Add to `src/RizzyUI/RzTheme.StyleProviders.cs`**:

   ```csharp
   // For a non-generic component
   public virtual TvDescriptor<RzComponent<RzFancyThing.Slots>, RzFancyThing.Slots> RzFancyThing { get; set; }

   // For a generic component
   public virtual TvDescriptor<RzComponent<RzGenericThingSlots>, RzGenericThingSlots> RzGenericThing { get; set; }
   ```

2. **Add to `src/RizzyUI/RzTheme.cs` constructor**:

   ```csharp
   // For a non-generic component
   RzFancyThing = RizzyUI.RzFancyThing.DefaultDescriptor;

   // For a generic component
   RzGenericThing = RizzyUI.RzGenericThingStyles.DefaultDescriptor;
   ```

**Localization:**

Please add the following English (default culture) entries to `src/RizzyUI/Resources/RizzyLocalization.resx`:

| Name                            | Value                       | Comment (Optional)                    |
| ------------------------------- | --------------------------- | ------------------------------------- |
| `RzFancyThing.DefaultAriaLabel` | `Fancy interactive element` | `Default ARIA label for RzFancyThing` |

**Asset Management Integration:**

Please add the following default asset URLs to the `PostConfigure` action in `src/RizzyUI/Extensions/ServiceCollectionExtensions.cs`:

| Key (`string`)           | URL (`string`)                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| `"FancyThingCoreScript"` | `"https://cdn.jsdelivr.net/npm/fancylib@1.2.3/dist/fancy.min.js"` |

**JavaScript Integration (if new Alpine component `rzFancyThing` was created):**

1. **Modify `packages/rizzyui/src/js/lib/components.js`**:

   * Add an import statement for your new component module at the top of the file:

     ```javascript
     import registerRzFancyThing from './components/rzFancyThing.js'; 
     ```
   * Call the imported registration function within the `registerComponents(Alpine)` function:

     ```javascript
     function registerComponents(Alpine) {
         // ...
         registerRzFancyThing(Alpine, rizzyRequire); 
     }
     ```

**Documentation Navigation (if new component):**

1. **Add to `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`**:

   ```razor
   <RzSideNavLink Href="components/fancy-thing">Fancy Thing</RzSideNavLink>
   ```

