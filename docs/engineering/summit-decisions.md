# Decisions R-1 to R-7: analysis

The remediation plan ([summit-remediation-plan.md](summit-remediation-plan.md), section 3) needs seven
decisions before some workstreams can start. This document analyses each: what the code does today,
the options, what each option implies for the libraries and for applications, the benefits, the risks
and how to contain them, and a recommendation. Everything stated about current behavior was checked in
the source on 2026-11-21.

## Context that applies to all seven

- **Pre-1.0 previews.** RizzyUI is at `1.0.0-preview.4-dev` (Rizzy at `6.0.0-preview.4-dev`), with
  previews released on 17, 18 and 20 November. Breaking changes are acceptable now and expensive after
  1.0, so decisions that break should land before 1.0, not after.
- **Package validation is on.** `RizzyUI.csproj` sets `PackageValidationBaselineVersion` to
  `1.0.0-preview.3`. Removing or changing the signature of a public member fails the pack until the
  baseline moves or the change is suppressed. Behavior changes (a default value, an attribute's
  output) pass validation silently, so they need CHANGELOG entries and tests, not just a green build.
- **Two test nets exist now.** Summit (175 browser tests, gating releases) and the docs scan (every
  docs page on both builds). Both catch regressions that unit tests miss, which lowers the risk of the
  behavior changes below.
- **Decision D-20** (2026-11-15 audit, `docs/audits/.../DECISIONS.md`) set today's attribute policy:
  `role`, `data-slot` and `type` are caller-overridable; everything else a component computes wins.
  R-1 revisits part of it.

## Summary

| Id | Decision | Recommendation | Breaking? | Effort | Unblocks |
|---|---|---|---|---|---|
| R-1 | Attribute precedence for events and ids | **Decided (D-24, D-25, D-26):** `x-data` reserved and enforced; handlers in code so caller `x-on:*` works; semantic events; `x-syncprop` for parent state; `AsChild` rules; consumer ids adopted | Yes (`x-data` throws; ids change) | L | W5, part of W4; removes 5 workarounds |
| R-2 | Input `name` attributes | Every input posts the full model path, as Blazor's own inputs do | Yes, for 5 components | S–M | W4; removes explicit `Name=` everywhere |
| R-3 | Default dialog close event | Scope it per instance; keep the global event as an explicit "close all" | Yes, for apps relying on the global default | S | W1 |
| R-4 | `HtmxResponse` outside htmx requests | No-op with a Debug log | Behavior only, relaxes a throw | S | W10; removes `HtmxResponses.cs` |
| R-5 | DataTable state transport | One JSON input plus a model binder | Additive | M | W7 |
| R-6 | Calendar provider form names | `StartName` and `EndName` | Additive | S | W3 |
| R-7 | Release vehicle for the High findings | preview.4 carries M0 and M1; later work ships as it finishes | n/a | n/a | Scheduling |

Suggested order of deciding: R-7 first (it sets the schedule), then R-2 and R-1 (the two that change
behavior applications see), then R-3 and R-4, then R-5 and R-6 (additive, low risk).

---

## R-1. Attribute precedence: replace, merge, or merge with a warning

**Today.** Under D-20 a component's computed attributes win. Of 265 component templates that splat
`AdditionalAttributes`, 42 also bind Alpine events (`x-on:...`) themselves; when a caller passes the
same attribute, Blazor keeps the last one written, so the component's wins and the caller's is dropped
without a trace. Summit hit this five times: `RzToggle` (SF-030), `MenubarItem` (SF-069), consumer ids on
inputs (SF-033), `RzCommand`'s template id (SF-040) and, in spirit, `AsChild` (SF-018). The workaround
for the menubar, `x-on:click.capture`, works only because Alpine treats a modifier as a different
attribute, which nobody would guess.

**Options.**

1. *Keep D-20 as is* and document, per component, which attributes are reserved.
2. *Merge event handlers and keep consumer ids:* when a caller passes `x-on:click`, the component runs
   its handler and then the caller's (one combined expression, or the component's handler moved to a
   different attribute such as `x-on:click.self` or a programmatic listener); a caller's `id` replaces
   the generated one and derived ids follow it.
3. *Option 2 plus a Development-time warning* when a caller attribute is dropped anyway (for
   attributes that cannot merge, such as configuration `data-*`).

**Implications.**

- Option 2 touches the 42 templates with events and every input that generates its own id. A shared
  helper (the "attribute-merge utility" RZUI-053 already called for) keeps it to one implementation plus
  per-component calls; each component gets a characterization test first.
- Merging changes what runs on click for any application that passes `x-on:click` today. Today that
  handler is silently dropped, so no working application depends on it being dropped; applications
  that "fixed" it with `.capture` or a wrapper would run their handler twice if they keep both.
- Event order must be defined (component first, then caller, so the caller sees the new state, which
  is what Summit needed for the toggle and the menubar).
- Kept consumer ids must stay unique; components that derive ids (`{id}-content`, `{id}-input`) derive
  from the consumer's id instead.
- The warning (option 3) needs the attribute list per component at render time; a Development-only
  check in the base class that compares `AdditionalAttributes` keys against the keys the component
  wrote is cheap and has no cost in Production.

**Benefits.** Removes the single most surprising behavior in the library (pattern 1 in the findings);
deletes Summit's delegated-click code in two modules and the capture trick; makes `<label for>` work
with consumer ids; turns silent failures into visible ones.

**Risks.** Double execution where an application already compensates (mitigated by the CHANGELOG entry
naming the affected components and the `.capture`/wrapper patterns to remove); ordering bugs in merged
expressions under the CSP build, whose expression parser is limited (mitigated by moving component
handlers to programmatic listeners rather than concatenating expression strings, and by running
Summit and the docs scan on the CSP build); scope creep across 42 components (mitigated by doing the
helper once and converting components in batches, each batch green on both test nets).

**Recommendation: option 3**, with the scope limited to `x-on:*` events and `id`. Everything else D-20
decided stays (configuration `data-*`, ARIA state and `class` merging still go through parameters). It
reverses D-20 only where D-20 produced silent failures. Record it as D-20a.

### Decision (owner, 2026-11-21): recorded as D-24

> RizzyUI reserves the `x-data` directive across all public RizzyUI components. Supplying `x-data`
> through unmatched component attributes is an invalid configuration and results in a descriptive
> exception. Consumers define application-specific Alpine state on an ancestor element. RizzyUI
> attaches internal event handlers programmatically wherever practical, allowing consumers to use
> `x-on:*` without collisions. Components expose documented semantic events for meaningful state
> changes and enforce clear rules for other protected directives. Developers who want to sync a
> component's internal state to a parent `x-data` object use RizzyUI's `x-syncprop` extension. The docs
> get a page on parent property synchronization inside a RizzyUI component.

What the code looked like when the decision was taken, and what implementing it involves:

1. **`x-data` is reserved and enforced.** One check in the component base (`RzComponent`) throws when
   `AdditionalAttributes` contains `x-data` (any casing), naming the component and pointing to the
   ancestor pattern and the synchronization page. It applies to every public component, including the
   ones without Alpine state, so the rule needs no per-component knowledge. Breaking (an attribute that
   was silently overridden now throws), listed under CHANGELOG "Breaking".
2. **Handlers move to code.** 50 components declare `x-data` in their own markup; the `x-on:*` bindings
   they put on the element that also receives the caller's attributes move into each module's `init()`
   as listeners (removed in `destroy()`). Caller `x-on:*` then simply works, under both builds (the CSP
   build never has to evaluate a merged expression). Components that keep a markup handler on an
   inner element are unaffected, because callers cannot reach that element.
3. **Semantic events.** Each component that holds state dispatches `rz:<component>:<event>` (for example
   `rz:toggle:change`, `rz:menubar:checked-change`, `rz:sheet:open` and `rz:sheet:close`) with a typed
   `detail`, documented on its page and declared in `rizzyui.d.ts`. This also closes SF-015 and SF-067.
4. **`x-syncprop` must reach the component's state.** In 27 of the 50 components the caller's attributes
   land on a different element from the one carrying `x-data` (for example RzChart, RzCombobox,
   RzInputOTP, RzSlider, RzTabs, RzCalendar, RzDataTable, RzDateEdit). A caller's `x-syncprop` would
   then sit on an element without the component's state. Either those components move `x-data` to the
   root element, or the base forwards `x-syncprop` (and only it) to the element that carries `x-data`.
   Forwarding is the smaller change. **Accepted by the owner (2026-11-21).**
5. **"Parent" must mean the consumer's state.** `x-syncprop` binds to the nearest ancestor `x-data`.
   A RizzyUI component placed inside another one (an input in a dialog, a sheet or a sidebar) would bind
   to the outer component's internal state, not the application's. The directive should skip ancestors
   that are RizzyUI components (they carry `data-alpine-root`) or accept an explicit target (a
   `.parent-{ref}` modifier or an id), and the new docs page should show the nested case. **Accepted by
   the owner (2026-11-21).**
6. **Other protected directives**, proposed rules for the owner to confirm (the decision asks for clear
   ones):

   | Directive on a component's attributes | Rule |
   |---|---|
   | `x-data` | Reserved; throws |
   | `x-init`, `x-load` | Reserved; throw (they run in, or control, the component's own scope) |
   | `x-on:*` | Allowed; runs alongside the component's handlers |
   | `x-syncprop` | Allowed; forwarded to the element that carries the component's `x-data` |
   | `x-bind:*` / `:attr` | Allowed for attributes the component does not compute; for computed ones the component wins (D-20) and a Development warning names the dropped binding |
   | `x-show`, `x-cloak`, `x-transition` | Allowed on components that do not manage their own visibility; reserved (throw) on overlays and other components that do |
   | `x-ref` | Allowed; the component's own ref names are reserved and documented |
   | `x-model` | Allowed only on components that declare a model value (documented per component); otherwise throws |

7. **Docs:** a new Interactivity page, "Parent property synchronization", covering the ancestor pattern,
   `x-syncprop` on a component (including the nested case from point 5), and the semantic events as the
   alternative when only notifications are needed; each component page lists its events and protected
   directives.
8. **Tests:** a bUnit test per rule (throws for `x-data`, `x-init`, `x-load`); browser tests that a caller
   `x-on:click` runs on `RzToggle` and `MenubarItem` on both builds, and that `x-syncprop` syncs a value
   through a component inside a dialog. Summit drops its `x-on:click.capture` trick and delegated click
   handling when W5 lands.
9. **`AsChild` needs its own rules** (analysis requested by the owner, 2026-11-21). `CloneFragment`
   (`RzAsChildComponent.CloneFragment.cs`) merges the component's attributes into the consumer's child
   with the **child's attributes winning** (`KeepExisting`, class merged), the opposite of the normal
   case. 27 components support `AsChild`; 19 of them put Alpine directives on the child (16 triggers and
   closers with `x-on:*`/`x-bind:*`/`x-ref`, and RzClipboard, RzBackToTop and RzAlpineComponent, which
   put their own `x-data` and `x-load` on it). Consequences for D-24:

   | Case | Today | Under D-24 as stated | Needed |
   |---|---|---|---|
   | `<RzClipboard AsChild><RzButton>` (child is a component) | The clipboard's `x-data` reaches RzButton's `AdditionalAttributes` and works | The base-class check in RzButton sees `x-data` in unmatched attributes and **throws on a valid composition** | Attributes forwarded by `CloneFragment` carry their provenance (an internal marker the check honors), or the check runs only on attributes the caller wrote |
   | Child declares its own `x-data` (`<RzClipboard AsChild><div x-data="...">`, or any trigger's child) | The child's `x-data` wins: the component's state is dropped, or the trigger's `x-on:click="toggle"` evaluates in the child's scope; the component stops working, silently | Not covered (the child is not the component's attributes) | `CloneFragment` throws when the child declares `x-data`, on element, component and markup children: the same rule, "state on an ancestor" |
   | Child declares `x-on:click` (`<PopoverTrigger AsChild><button x-on:click="track()">`) | The child's handler wins and the trigger's is dropped: the popover never opens | D-24 promises collision-free `x-on:*`; this would still collide | The triggers' handlers move to the parent component's module, which already finds its trigger through a marker (`rzPopover` looks for `[data-trigger]`); triggers emit markers, not `x-on:*` |
   | Child declares a binding the component computes (`x-bind:aria-expanded`, `data-state`, `tabindex`, `disabled`) | The child's wins and the state attributes stop following the component | Not covered | Component-computed bindings win on `AsChild` children (D-20's rule), with the Development warning |
   | Child has its own `id` (`<PopoverTrigger AsChild><button id="share">`) | The child's id wins; `PopoverContent`'s `aria-labelledby="{popover}-trigger"` then points at nothing | Not covered (consumer ids are open, point 10) | Decide with SF-033: either the component adopts the child's id and derives its references from it, or the component's id wins on `AsChild` children |
   | Child component that binds its own handlers in markup (a trigger wrapping RzToggle) | One of the two `x-on:click`s is dropped | Fixed: D-24 moves component handlers to code | Nothing more |
   | `x-syncprop` on an `AsChild` component | Lands on the child | Correct for RzClipboard, RzBackToTop and RzAlpineComponent (the child carries their state); on a trigger it would bind the parent component's internal state | Allowed on the three state-carrying components; reserved (throws) on triggers and closers |

   None of this blocks D-24; it adds four requirements to W5: provenance for forwarded attributes,
   `CloneFragment` enforcing the child rules, trigger handlers in the parent modules, and component-wins
   for computed bindings on `AsChild` children.

   **Decided by the owner (2026-11-21), each with the recommended option, recorded as D-25 and D-26:**

   | Case | Decision | Rejected alternatives |
   |---|---|---|
   | Library `x-data` forwarded to a component child | Provenance marker: `CloneFragment` passes library-owned attributes through a channel the check skips | A Roslyn analyzer (misses attributes built in C#), an allow-list of `rz*` values (fuzzy), deferring |
   | Child declares `x-data` | `CloneFragment` throws a descriptive exception (element, component and markup children) | A Development warning only, wrapping the child (adds a DOM node), deferring |
   | Child declares `x-on:*` | Triggers render a marker; the parent module attaches their listeners | Merging expressions (fragile under the CSP build), trigger wins with a warning (contradicts D-24), deferring |
   | Child declares a computed binding | Component wins, Development warning | Throwing, keeping child-wins, deferring |
   | Child has its own `id` | Adopt the child's id and derive references from it (D-26, which also settles SF-033) | Component id wins, throwing on a child id, deferring with SF-033 | Tests: each row above as a bUnit or browser test, on
   element, component and markup children. The docs scan (dangling `aria-labelledby`) guards the id row.
10. **Consumer `id`s (SF-033): decided as D-26.** A consumer-supplied id is adopted, on components and on
   `AsChild` children, and every internal reference derives from it.

---

## R-2. Input `name` attributes: always the model path?

**Today.** Two naming schemes coexist. Inputs built on Blazor's `InputBase` (`RzInputText`,
`RzInputNumber`, `RzInputTextArea`, `RzNativeSelect`, `RzSwitch`, `RzDateEdit` and others) post the model
path, for example `Model.Country`. Five components post the bare property name when `Name` is not set:
`RzCheckboxGroup` and `RzRadioGroup` (`Name = fieldIdentifier.FieldName`), `RzCombobox`
(`NameAttributeValue => Name ?? FieldIdentifier.Create(For).FieldName`), `RzFileInput` (`Name ??
FieldName ?? Id`) and `RzInputOTP` (`_fieldIdentifier.FieldName`). In one form, half the fields post
`Model.X` and half post `X` (SF-009, High).

**What binds today, and what would bind after the change.**

| Receiver | Bare names (today, 5 components) | Model path (after) |
|---|---|---|
| Blazor SSR `EditForm` with `[SupplyParameterFromForm(FormName = "Model")]` | Do not bind | Bind |
| MVC action with a complex parameter named like the form model (`Model model`) | Bind (fallback to the empty prefix) | Bind |
| MVC action with `[FromForm(Name = "Model")]` | Do not bind | Bind |
| MVC action with differently named parameter (`ContactModel input`) | Bind (empty-prefix fallback) | Do not bind |
| MVC action with simple parameters (`string country`) | Bind | Do not bind |
| Minimal API `[FromForm] ContactModel model` | Bind (property names) | Do not bind unless prefixed |

**Options.**

1. *Keep both schemes* and document them.
2. *Model path everywhere*, matching Blazor's inputs, with `Name` still available to override.
3. *Bare names everywhere*, changing the `InputBase` inputs instead.

**Implications.**

- Option 2 changes five components' default output; the code change is small (use the same
  `NameAttributeValue` the Blazor inputs use). Applications in the last three rows of the table break
  for those five components only, and they break loudly in testing (a field stays empty), not subtly.
- Option 3 would break every other input and fight Blazor's form model, which RizzyUI is built on; it
  also breaks `[SupplyParameterFromForm]`, the pattern the docs teach.
- Validation messages and `RzModelStateProvider` keys follow the model path already (SF-044 aside), so
  option 2 also makes server-side errors line up with the fields that caused them.

**Benefits.** One rule to learn; forms built from mixed components bind without explicit `Name`
parameters (Summit set them on every group input); the 422 round trip shows errors on the right
fields.

**Risks.** Applications whose actions bind those five components by bare name stop receiving the
value (an empty field, which form tests catch, but production code without tests would not). The
component cannot detect this at render time, because it does not know how the receiving action binds.
Mitigations: a CHANGELOG "Breaking" entry with the table above; `Name="Country"` as the documented
opt-out that keeps today's output; Summit and the docs scan exercise the forms. Package validation does
not catch it, because no signature changes.

**Recommendation: option 2, before 1.0**, with `Name` as the documented escape hatch for applications
that bind by bare name.

---

## R-3. Default dialog close event: global or per instance?

**Today.** `RzDialog.CloseEventName` and `RzAlertDialog.CloseEventName` default to
`Constants.Events.DialogClose` (`"rz:dialog-close"`). `rzModal.js` registers that name on `window` for
every dialog on the page, and the listener closes whichever dialog is open, without checking any
detail. One `HX-Trigger: rz:dialog-close` from the server closes every open dialog (SF-003); the docs
also name a non-existent `rz:modal-close`/`ModalClose` (SF-004), and the JS fallback default is still
`rz:modal-close`.

**Options.**

1. *Keep the global default* and document it.
2. *Scope the default per instance:* the default becomes `rz:dialog-close:{id}` (or the listener
   honors `event.detail.id`), and `rz:dialog-close` with no detail keeps closing all dialogs as an
   explicit choice.
3. *Make `CloseEventName` required* whenever server-driven closing is used.

**Implications.**

- Option 2 changes the effective default. Applications that send `HX-Trigger: rz:dialog-close` today
  either keep working (if the global event is kept as "close all") or must switch to the instance name.
  Keeping the global listener in addition to the scoped one makes option 2 non-breaking for that
  pattern; what changes is that the default name an application sees in the docs is the scoped one.
- The instance id must be known to the server to target one dialog; dialogs have stable ids when the
  caller passes `Id`, otherwise generated ids are not predictable from the server, so the docs pattern
  becomes "give a server-closed dialog an `Id`", or keep setting `CloseEventName` explicitly (Summit's
  approach).
- The same model should apply to `RzSheet` when it gains events (W1), so overlays are consistent.

**Benefits.** Closing a dialog from the server targets that dialog; a page with a confirmation inside
an edit dialog no longer loses both; one pattern for dialogs and sheets.

**Risks.** Little, if the global event keeps working. The real risk is confusion between two names;
mitigated by one docs section on server-driven overlays (and by fixing SF-004 in the same pull
request).

**Recommendation: option 2, non-breaking form:** add `event.detail.id` scoping and a per-instance
default, keep `rz:dialog-close` with no detail as "close all", fix the JS fallback and the docs. Apply
the same to `RzSheet` when its events land.

---

## R-4. `HtmxResponse` outside htmx requests: throw or no-op?

**Today.** Every setter on Rizzy's `HtmxResponse` (21 call sites of `AssertIsHtmxRequest()`) throws
`InvalidOperationException` ("The active request is not an htmx request. Setting response headers during
request has no effect.") when the request has no `HX-Request` header. An action that serves both a
direct page load and an htmx request needs a guard around every header (SF-043); Summit wrote
`HtmxIfRequested` and `ValidationFailedForAnyRequest` for that.

**Options.**

1. *Keep throwing.*
2. *No-op outside htmx requests*, logging at Debug level.
3. *Keep throwing by default, add a `TryHtmx` or `IfHtmx` API* that does nothing outside htmx.

**Implications.**

- Option 2 changes behavior from an exception to nothing, which no correct application depends on
  (nobody catches this exception on purpose). Code that relied on the throw to catch a programming
  mistake (setting `HX-Retarget` on a full page load) would now silently skip the header; the Debug log
  keeps it discoverable.
- `ValidationFailed()` is special: it sets the 422 status as well as headers. Outside htmx, a 422 is
  still the right status for a failed form post; option 2 should keep the status and skip only the
  htmx headers (Summit's `ValidationFailedForAnyRequest` does exactly that).
- Option 3 is additive and safe but leaves two ways to do the same thing, and the throwing one stays the
  default that every tutorial uses.

**Benefits.** Actions that serve boosted navigation, partial updates and direct loads read straight
through; the common MVC pattern stops needing a wrapper.

**Risks.** A mistaken header call on a non-htmx request goes unnoticed (Debug log mitigates); behavior
change in a Rizzy preview needs a Rizzy release and a RizzyUI package bump (W10 sequencing).

**Recommendation: option 2**, with `ValidationFailed()` keeping its status code outside htmx and a
Debug log for skipped headers.

---

## R-5. DataTable state transport: one JSON input or one input per field?

**Today.** `RzDataTable` keeps sort, page, filters, column visibility and selection in the browser
(TanStack); nothing reaches the server, and a server-rebuilt table starts from `InitialState` (SF-001,
High). `RzDataTableInitialState` is the server-side model (sorting, pagination, column visibility,
column filters). `TableRequestModel` (query, page, page size, sort by, sort direction) exists in the
library but nothing uses it. Summit's `AttendeeTableState` mirrors the state into seven hidden inputs
and binds them to its own class, and a field named `Filter` collided with an action parameter (SF-051).

**Options.**

1. *One input per field* (`{name}.Sort`, `{name}.Page`, ...) and a POCO the application binds.
2. *One JSON input* (`StateInputName="TableState"`) kept in sync, plus a model binder that turns it into
   `RzDataTableInitialState` (or a new `RzDataTableState`).
3. *No built-in transport;* document Summit's pattern.

**Implications.**

- Option 2 is additive (a new parameter, a binder, possibly a new state type). It round-trips exactly
  what the table holds (multi-column sort, column filters, visibility maps) without inventing a flat
  encoding for nested state, and it has one name to `hx-include`.
- Option 1 is readable in URLs and binds without a custom binder, but needs an encoding for multi-sort
  and visibility maps, multiplies names (the SF-051 collision class), and every new feature adds fields.
- Either option should decide `TableRequestModel`'s fate: map it from the new state for server-side
  paging, or deprecate it (removing it fails package validation until the baseline moves; deprecate in
  1.0, remove after).
- Selection should be included but opt-in, since row ids can be many.

**Benefits.** Server rebuilds keep the user's place with no application script (deletes about 85 lines
of Summit's glue); one shape for server-side paging later.

**Risks.** JSON in a form field is less readable in URLs (use POST or `hx-include` for state, and keep
URL query parameters for the few values worth sharing); a binder is one more thing to document; schema
evolution of the JSON (version it with a property).

**Recommendation: option 2**, versioned JSON, selection opt-in, `TableRequestModel` deprecated in favor
of the new state.

---

## R-6. Calendar provider form names: `Name` with a separator, or `StartName`/`EndName`?

**Today.** `RzCalendarProvider` holds its dates in Alpine state and posts nothing (SF-058). Summit added
two hidden inputs bound with `x-bind:value` and a script that writes them and submits the form.

**Options.**

1. *`Name` with a separator:* one input, `2027-06-01..2027-06-10`, for the application to split.
2. *`StartName` and `EndName`:* two inputs that bind to two typed `DateOnly?` properties.
3. *Both:* `Name` for single and multiple selection, `StartName`/`EndName` for ranges.

**Implications.**

- Option 2 binds with no custom parsing, in MVC, minimal APIs and Blazor forms, and validates per field.
- Option 1 needs a parser or a custom type in every application, and `DateOnly` model binding cannot
  read it.
- Single-date and multiple-date modes need a `Name` anyway, so option 3 is the complete API; ranges get
  the two names. The inputs should also dispatch a bubbling `change` when a range completes, so
  `hx-trigger="change"` on the form works without script.

**Benefits.** A date range becomes an ordinary form field pair; the dashboard's filter script shrinks to
nothing.

**Risks.** Minimal (additive). Keep the provider's existing events for applications that already
listen to them.

**Recommendation: option 3** (`Name` for single and multiple, `StartName`/`EndName` for ranges, plus the
`change` event).

---

## R-7. Release vehicle: preview.4, or a dedicated preview?

**Today.** RizzyUI is at `1.0.0-preview.4-dev`; Rizzy at `6.0.0-preview.4-dev`. Summit gates releases,
and the docs scan (M0) is ready to merge.

**Options.**

1. *preview.4 carries M0 and M1* (every High finding in RizzyUI and the template fixes); later
   milestones ship in the following previews as they finish.
2. *A dedicated "Summit fixes" preview* after preview.4, which ships first with whatever is ready.
3. *Everything in one release* before 1.0.

**Implications.**

- Option 1 delays preview.4 by the time M1 takes (roughly the W1, W2, W3 and W9 High items plus
  SF-040, SF-018, SF-052, SF-053, SF-065, SF-068), but the first published preview after Summit no longer
  ships the defects that break real applications (charts on a theme change, sheet focus, the range
  popover, German decimals).
- Rizzy's fixes (SF-044, SF-043, SF-047, SF-017) follow their own preview; RizzyUI picks them up in the
  next preview after that, which is why they are a separate milestone (M1-Rizzy).
- Option 3 bundles breaking changes (R-1, R-2) with fixes, which makes regressions harder to bisect and
  delays the fixes.

**Benefits of option 1.** The High findings reach users soonest; each later preview has one theme
(consistency, then the data table), which keeps CHANGELOGs and migration notes focused.

**Risks.** M1 is the largest batch; a slip delays preview.4. Mitigation: M1 items are independent pull
requests; if one slips, it moves to preview.5 rather than holding the release.

**Recommendation: option 1**, with a cut-off: whatever of M1 is merged when the rest is ready ships in
preview.4, and the remainder in preview.5.

---

## What the recommendations add up to

- **Breaking for applications:** R-2 (five components' default `name`) and, mildly, R-1 (handlers that
  were silently dropped now run). Both before 1.0, both with CHANGELOG migration notes, both covered
  by Summit and the docs scan.
- **Additive:** R-3 (non-breaking form), R-5, R-6.
- **Relaxing:** R-4 (a throw becomes a no-op).
- **Decisions to record:** D-20a (R-1), and an entry each for R-2 to R-6 in the audit's `DECISIONS.md`,
  so the next contributor finds the rule and the reason in one place.
