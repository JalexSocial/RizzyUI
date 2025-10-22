
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a single clickable tab button within an <see cref="RzTabStrip" />.
///     Interacts with the parent <see cref="RzTabs" /> component and Alpine.js to manage selection state.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTab : RzComponent<RzTab.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    );

    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    [CascadingParameter]
    private RzTabStrip? TabStrip { get; set; }

    [Parameter, EditorRequired]
    public required string Name { get; set; } = default!;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected string NameLower => Name?.ToLowerInvariant() ?? string.Empty;
    protected string TabId => $"{NameLower}-tab";
    protected string PanelId => $"{NameLower}-panel";
    protected string SelectedTextColorClass =>
        Parent?.SelectedTabTextColor.ToTextClass() ?? Theme.Light.Primary.ToCssClassString("text");

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");

        if (TabStrip == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabStrip component.");

        Parent.AddTab(this);
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTab;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}