# Summit component coverage

How thoroughly Summit exercises each RizzyUI component, updated as Summit grows. The plan's intended
use of each component is in [summit-demo-plan.md, section 5](summit-demo-plan.md#5-component-coverage-matrix);
this file records what is actually built and tested.

## Levels

| Level | Meaning |
|---|---|
| 0 Not yet exercised | Not in Summit yet. |
| 1 Rendered only | On a page and scanned by axe, but its behavior is not used or not checked. |
| 2 Functionally exercised | Its behavior is used in a real workflow, checked by hand. |
| 3 In combination | Its behavior is used together with other components or htmx in one workflow. |
| 4 Integration-tested | An automated browser test (standard and CSP builds) fails if its behavior breaks in that workflow. |

A higher level is only claimed when it is earned: rendering a component is level 1 even if the page has
a browser test.

## Matrix

Status after phase 3 (public site and checkout). "Test" names the spec in `samples/Summit/tests/e2e/specs`.

| Component | Level | Where | Test | Combined with / notes |
|---|---|---|---|---|
| RzDataTable | 0 | (attendees, phase 4) | | |
| RzTable | 0 | (dashboard, check-in, settings) | | |
| RzAvatar | 1 | speaker cards, session page, sidebar | axe | labels set by hand (SF-031) |
| RzBadge | 1 | everywhere | axe (contrast) | |
| RzChart | 0 | (dashboard) | | |
| RzConfetti | 2 | checkout confirmation (`Trigger=Load`) | | not visible under reduced motion; an HX-Trigger event would be missed (SF-039) |
| RzIndicator | 0 | (check-in) | | |
| RzMarquee | 1 | home sponsors | axe | decorative; names in an sr-only list |
| RzProgress | 2 | contact form (indeterminate, `hx-indicator`), tickets (low stock) | | visibility during upload not asserted |
| RzSeparator | 1 | layouts | axe | |
| RzArticle | 1 | session, help | axe | side column hidden on phones |
| RzBrowser | 4 | session page slides | public: slide preview | iframe content asserted |
| RzCodeViewer | 1 | session page | axe | copy button not exercised |
| RzEmbeddedPreview | 4 | via RzBrowser | public: slide preview | direct use planned (settings email preview) |
| RzEventViewer | 0 | (settings) | | |
| RzMarkdown | 4 | session abstracts, bios, FAQ | public: untrusted Markdown | safe default verified |
| RzQuickReference | 3 | session, help | public: quick reference link | with RzHeading and RzArticle |
| RzAlert | 4 | sign-in error, contact success, tickets | shell: sign-in 422; public: contact | live-region defaults (SF-022) |
| RzAlertDialog | 0 | (attendees, schedule builder, settings) | | |
| RzDialog | 4 | search palette, quick actions | public: search palette; shell: quick actions | with RzCommand, opened by window events |
| RzEmpty | 4 | speakers, schedule, errors | public: no speakers match | |
| RzPopover | 1 | room details on session cards | axe | not opened by a test |
| RzSheet | 4 | session details, mobile navigation | public: details sheet | swapped in open (SF-002); mobile nav not asserted |
| RzSkeleton | 4 | home stats | public: lazy numbers | replaced by an `intersect once` swap |
| RzSpinner | 1 | schedule filters, speaker search (`hx-indicator`) | axe | |
| RzToast | 4 | agenda, contact form, server errors | public: agenda toast, message sent | server toasts via `HX-Trigger` |
| RzTooltip | 1 | organizer sidebar (collapsed) | axe | |
| Field family | 4 | sign-in, contact, checkout (list-bound fields) | shell, public, checkout | 422 round trips; list items need SF-044 |
| InputGroup | 4 | speaker search | public: speakers | |
| RzButton | 4 | everywhere | many | as links via `Element="a"` (SF-018) |
| RzButtonGroup | 0 | (dashboard, schedule builder) | | |
| RzCalendar | 0 | (dashboard) | | |
| RzCheckboxGroup | 4 | schedule track filter, checkout add-ons | public: track filter; checkout | GET form with a cascaded `EditContext` (SF-028) |
| RzInputCheckbox | 4 | checkout code of conduct | checkout: 422 then checked | focus moves to it after the 422 |
| RzColorPickerProvider | 0 | (schedule builder) | | |
| RzColorSwatch | 1 | navigation menu tracks | axe | |
| RzCombobox | 4 | checkout company (create) and country, per attendee in a list | checkout | values survive a 422 swap; fast Enter picks the wrong item (SF-046) |
| RzDateEdit | 0 | (schedule builder) | | |
| RzFileInput | 4 | contact form | public: wrong file type, then valid | multipart 422 round trip |
| RzFormSection | 3 | checkout attendee sections | checkout (rendered in the flow) | `Description` is a RenderFragment |
| RzInputColor | 0 | (schedule builder) | | |
| RzInputNumber | 4 | checkout quantity | checkout | feeds the live estimate |
| RzInputOTP | 4 | checkout discount code | checkout: expired, then valid | alphanumeric, upper-cased; check-in desk planned |
| RzInputText | 4 | sign-in, contact, speaker search | shell, public | |
| RzInputTextArea | 4 | contact | public: contact | |
| RzNativeSelect | 4 | contact topic | public: contact | |
| RzRadioGroup | 4 | checkout ticket cards, payment method | checkout | disabled items; `id=""` on inputs (SF-047) |
| RzSlider | 1 | schedule length filter | axe | range posts `Filter.Length[0/1]`; not changed by a test yet |
| RzSwitch | 4 | agenda toggle (95 forms on a page), "only my agenda" | public: agenda | out-of-band header count |
| RzToggle | 4 | schedule level filter | public: level toggles | delegated listener (SF-030) |
| RzAlpineComponent | 4 | 6 code-behind components | public, shell | one TypeScript module planned (attendees) |
| RzAccordion | 1 | FAQ on help and tickets, ticket perks in checkout | axe | expand/collapse not asserted |
| RzAspectRatio | 1 | home, session | axe | |
| RzCard | 1 | everywhere | axe | |
| RzCarousel | 4 | home featured speakers | public: carousel buttons | autoplay off under reduced motion |
| RzCollapsible | 1 | help | axe | |
| RzItem | 1 | session speakers, details sheet | axe | `role="listitem"` added by hand (SF-038) |
| RzSearchButton | 2 | header | | opens the palette; the test uses Ctrl+K instead |
| RzSteps | 4 | checkout step indicator | checkout: `aria-current="step"` | re-rendered out of band each step |
| RzBreadcrumb | 1 | session page, organizer header | axe | |
| RzCommand | 4 | search palette (remote, server filtering) | public: search palette | needed SF-040 workaround |
| RzCommandDialog | 4 | organizer quick actions (static items) | shell: quick actions | |
| RzDropdownMenu | 4 | language menu, organizer user menu | shell: language switch | items as links |
| RzLink | 1 | footer, help | axe | |
| RzMenubar | 0 | (schedule builder) | | |
| RzNavigationMenu | 1 | public header mega menu | axe | not opened by a test |
| RzPagination | 4 | speakers | public: pages with htmx | `hx-get` + pushed URL |
| RzScrollArea | 1 | schedule day tabs | axe | |
| RzSidebar | 1 | organizer layout | axe | collapse, mobile sheet and cookie not tested |
| RzTabs | 4 | schedule days | public: filter keeps the day | `rz:tabs-change` feeds the filter form |
| RzShineBorder | 1 | home ticket, tickets page | axe | inline style (CSP report-only) |
| RzAnimatedGradientText | 1 | home hero | axe | |
| RzAuroraText | 1 | home hero | axe | SF-035 |
| RzHighlighter | 1 | home, speaker matches | axe | |
| RzNumberTicker | 4 | home stats | public: lazy numbers | final value under reduced motion |
| RzTypingAnimation | 1 | home hero | axe | |
| RzDarkModeToggle | 4 | all layouts | shell: dark mode | |
| RzThemeProvider | 4 | app shell (custom theme from JSON) | axe contrast (detects SF-034) | |
| RzHeading / RzParagraph | 1 | session, help | axe | |
| RzKbd | 1 | header, quick actions | axe | |
| RzBackToTop | 1 | public layout | axe | |
| RzClipboard | 1 | session copy link, confirmation badge codes | public: button present | copy not exercised |
| RzIdScope | 0 | (self-re-rendering fragments) | | |

## Gaps to close in later phases

- Overlays not yet driven by tests: popover, navigation menu, mobile navigation sheet, sidebar
  collapse and mobile sheet.
- Copy actions (`RzClipboard`, `RzCodeViewer`) need a clipboard permission in Playwright.
- The schedule length slider and the accordion are rendered but not operated by a test.
