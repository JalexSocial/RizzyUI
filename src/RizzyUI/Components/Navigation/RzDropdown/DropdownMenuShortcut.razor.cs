
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a styled text element typically used to display keyboard shortcuts
/// alongside a <see cref="DropdownMenuItem"/>.
/// </summary>
public partial class DropdownMenuShortcut : RzComponent<DropdownMenuShortcut.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuShortcut component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "ml-auto text-xs tracking-widest text-muted-foreground"
    );

    /// <summary>
    /// Gets or sets the content of the shortcut, e.g., "⌘S". Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "span";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuShortcut;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuShortcut component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}