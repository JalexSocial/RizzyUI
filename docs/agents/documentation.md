## 12. Documentation Guidelines (RizzyUI.Docs)

**Any component that is created or modified MUST have a corresponding documentation page in `src/RizzyUI.Docs`.** This ensures the documentation site remains the source of truth for all API surfaces.

### 12.1 Page Contract and Layout (Mandatory Skeleton)

Every documentation page **MUST** use the following Razor skeleton exactly. You must preserve the `SideContent`/`MainContent` nesting, the `RzQuickReference` component, and the specific HTMX attributes on the breadcrumb links.

```razor
@page "/components/your-component-kebab-name"
@namespace RizzyUI.Pages
@using RizzyUI
@using Rizzy.Htmx
@inherits RzComponent

<PageTitle>Your Component Name</PageTitle>

<RzQuickReferenceContainer>
    <RzArticle ProseWidth="ProseWidth.UltraWide">
        <SideContent>
            <RzQuickReference />
        </SideContent>
        <MainContent>
            <RzBreadcrumb class="mb-4 not-prose">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink Href="/" hx-boost="true" hx-select="#content" hx-target="#content" hx-swap="outerHTML">Docs</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink Href="/components" hx-boost="true" hx-select="#content" hx-target="#content" hx-swap="outerHTML">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Your Component Name</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </RzBreadcrumb>

            <RzHeading Level="HeadingLevel.H1" QuickReferenceTitle="Your Component Name" class="scroll-mt-20">Your Component Name</RzHeading>
            
            <RzParagraph>
                <!-- 1. What the component is for. 2. Subcomponents involved. 3. Interactivity details (Alpine/HTMX). -->
            </RzParagraph>

            <!-- Optional: "Under the Hood" Alert for implementation details -->
            <!-- <RzAlert ...><AlertTitle>Under the Hood</AlertTitle>...</RzAlert> -->

            <!-- REPEATABLE PATTERN: Usage Examples (Must include RzBrowser AND RzCodeViewer) -->
            <section class="my-8 py-2">
                <RzHeading Level="HeadingLevel.H2" QuickReferenceTitle="Basic Usage" class="scroll-mt-20">
                    Basic Usage
                </RzHeading>
                <RzParagraph>
                    <!-- Description of the specific example -->
                </RzParagraph>

                <RzBrowser Layout="typeof(PreviewLayout)">
                    <div class="mx-auto p-8 mb-5 flex justify-center items-center min-h-40">
                        <!-- LIVE DEMO MARKUP HERE -->
                    </div>
                </RzBrowser>

                <RzCodeViewer Language="@CodeLanguage.Razor" class="mb-10">
                    <!-- ESCAPED SOURCE CODE OF THE DEMO ABOVE HERE -->
                </RzCodeViewer>
            </section>

            <!-- REPEATABLE PATTERN: Component Parameters (Must use specific table styling) -->
            <section class="my-8 py-2">
                <RzHeading Level="HeadingLevel.H2" QuickReferenceTitle="Component Parameters" class="scroll-mt-20">
                    Component Parameters
                </RzHeading>
                <div class="not-prose mt-6 mb-10 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                    <table class="w-full text-sm">
                        <thead class="text-left bg-zinc-100/75 font-semibold text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
                            <tr>
                                <th scope="col" class="w-1/5 px-4 py-3">Property</th>
                                <th scope="col" class="w-2/5 px-4 py-3">Description</th>
                                <th scope="col" class="w-1/5 px-4 py-3">Type</th>
                                <th scope="col" class="px-4 py-3">Default</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                            <tr class="align-top">
                                <td class="px-4 py-4"><code class="font-mono font-medium text-sky-600 dark:text-sky-400">PropertyName</code></td>
                                <td class="px-4 py-4 text-zinc-600 dark:text-zinc-400">Description of property.</td>
                                <td class="px-4 py-4"><code class="font-mono text-violet-600 dark:text-violet-400">string</code></td>
                                <td class="px-4 py-4 text-zinc-500"><code class="font-mono">null</code></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

        </MainContent>
    </RzArticle>
</RzQuickReferenceContainer>

```

### 12.2 Top-of-page Content

*   **H1 then “One-Paragraph Contract”:**
    *   Immediately after the H1, include a short paragraph covering:
        *   What the component is for (use-cases).
        *   What the “suite” is composed of (subcomponents).
        *   What provides interactivity (Alpine, not Blazor runtime interactivity).
        *   Any notable integration hooks (stable IDs, HTMX targeting, events).
*   **“Under the Hood” Alert:**
    *   Add an info alert near the top explaining implementation details:
        *   Alpine `x-data="<name>"`.
        *   Teleport strategy (e.g., `x-teleport="body"`).
        *   Focus trapping / escape / backdrop click behaviors.
    *   Keep it practical: mention the consequence (e.g., avoids z-index issues, enables predictable DOM placement).

### 12.3 Section Structure (Repeatable Pattern)

Every H2 section should follow this mini-template:

1.  **H2 + Explanation:**
    *   `<RzHeading Level="HeadingLevel.H2" QuickReferenceTitle="…" class="scroll-mt-20">`
    *   **Note:** Always include `class="scroll-mt-20"` on headings for scroll positioning.
    *   Short paragraph naming the scenario, stating what the example demonstrates, and mentioning relevant parameters.
2.  **Live Demo Region:**
    *   Provide a centered demo container (e.g., `mx-auto p-8 mb-5 flex justify-center items-center min-h-40`).
    *   Demos should be minimal but real.
3.  **Matching Code Block:**
    *   Immediately follow each demo with an `RzCodeViewer` containing the exact markup used.
    *   If multiple snippets exist, add `ViewerTitle` (e.g., “Blazor Component”, “Controller Action”).
    *   **Copy/Paste Safe:** Show all required attributes (`AsChild`, `hx-*`, ids/targets).
4.  **Progressive Complexity:**
    *   Order sections from simplest to most integrated: Basic Usage → Appearance Customization → Integration (HTMX) → Advanced Flows.

### 12.4 Environment Limitations

*   **Explicit Limitation Alerts:** If an example cannot work in the docs environment (e.g., requires a real backend endpoint not present in the static docs site), add a warning alert immediately before the demo.
*   The alert must state what will *not* happen, what *would* happen in a real app, and what the developer should copy.

### 12.5 Parameter and API Reference

*   **Parameters Section (Mandatory):**
    *   Include a “Component Parameters” H2 near the bottom.
    *   Break down by component type (e.g., `RzDialog`, `DialogContent`).
    *   Tables must include: **Property, Description, Type, Default**.
    *   Clearly mark required values (“Required” pill).
*   **Alpine API Section:**
    *   If the component exposes/relies on an Alpine API, include a table with: **Method, Parameters, Description**.
*   **Event Names & Interoperability:**
    *   Document event names, default values, and how HTMX/server code triggers them.

### 12.6 Example Quality Standards

*   **Happy Path:** Basic examples must show the trigger, content surface, close mechanism, and exit strategies (Escape, backdrop).
*   **Customization:** Show at least one example changing a meaningful parameter (size, visibility).
*   **Integration:** When showing HTMX patterns, include both client markup (`hx-get`, `hx-target`) and server endpoint/controller samples.

### 12.7 Consistency

*   **Terminology:** Pick one term (Dialog vs Modal) and explain the relationship.
*   **Naming:** Component/parameter names in inline `<code>` must match API casing exactly.
*   **Quick Reference:** Set `QuickReferenceTitle` on headers. Keep titles short and task-oriented.

### 12.8 Updating ComponentList.razor

*   Any new component must be added to the side navigation in `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`.
*   This ensures the new documentation page is discoverable.

