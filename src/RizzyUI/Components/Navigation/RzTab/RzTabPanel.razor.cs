
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the content panel associated with a specific <see cref="RzTab" />.
///     It becomes visible when its corresponding tab is selected. Controlled via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabPanel : RzComponent<RzTabPanel.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex-1 outline-none"
    );

    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    [Parameter, EditorRequired]
    public string Name { get; set; } = default!;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected string NameLower => Name?.ToLowerInvariant() ?? string.Empty;
    protected string TabId => $"{NameLower}-tab";
    protected string PanelId => $"{NameLower}-panel";

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTabPanel;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? InnerContainer { get; set; }
    }
}