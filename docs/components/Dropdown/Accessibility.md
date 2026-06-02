# Dropdown Accessibility

## Pattern
`RzDropdownMenu` uses the **menu widget** pattern for command/action lists.

## Semantics
- Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
- Menu surface: `role="menu"` and `aria-labelledby` to the trigger.
- Items: `role="menuitem"` (and submenu triggers with `aria-haspopup="menu"`).
- Disabled items: `aria-disabled="true"` and excluded from roving focus navigation.

## Keyboard Interaction
- Trigger: `Enter`, `Space`, `ArrowDown`, `ArrowUp` open the menu.
- Menu: `ArrowDown`/`ArrowUp` rove item focus; `Home`/`End` jump to first/last enabled item.
- Submenu trigger: `ArrowRight` opens submenu.
- Submenu: `ArrowLeft` returns focus to submenu trigger.
- `Escape`: closes the topmost open menu layer first, then parent menu.

## Focus Management
- On open, focus moves to the first enabled menu item.
- Roving focus keeps one enabled menu item tabbable at a time.
- On close, focus restores to the trigger.

## Screen-Reader Behaviour
- Trigger expanded/collapsed state is exposed through `aria-expanded`.
- Menu and submenu ownership is exposed through `aria-controls`/`aria-labelledby`.
- Menu item names are read from visible text content.

## Live Announcements
No live region announcements are emitted by default for menu open/close.

## SSR / Enhanced Navigation Behaviour
- SSR markup defines stable IDs and ARIA relationships.
- Alpine runtime primitives initialize/re-initialize behavior after DOM updates.
- Dismissal is coordinated with `dismissableLayer`; keyboard roving with `rovingFocusGroup`.

## Known Limitations
- Typeahead is not implemented yet.
- Nested submenus are supported for menu behavior, but advanced multi-level APG nuances are still evolving.

## Tests
- Playwright accessibility coverage for menu semantics, roving keyboard behavior, disabled-item skipping, dismissal ordering for nested menus, focus restoration, and axe scans.
- Coverage runs for both fixture variants:
  - `/accessibility-dropdown-menu.html`
  - `/accessibility-dropdown-menu-csp.html`

## Example
```razor
<RzDropdownMenu Anchor="AnchorPoint.Bottom">
    <DropdownMenuTrigger AsChild>
        <RzButton>Open menu</RzButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem Disabled="true">Disabled item</DropdownMenuItem>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    </DropdownMenuContent>
</RzDropdownMenu>
```
