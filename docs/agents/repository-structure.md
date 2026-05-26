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

