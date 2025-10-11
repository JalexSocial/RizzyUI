
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Container for the content displayed when a <see cref="NavigationMenuTrigger"/> is activated. This is a nested component.
/// </summary>
public partial class NavigationMenuContent : RzComponent<NavigationMenuContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the NavigationMenuContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute left-0 top-full z-50 mt-1.5 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg will-change-[opacity,transform] data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion=fade-in]:animate-in data-[motion=fade-in]:fade-in-0 data-[motion=fade-out]:animate-out data-[motion=fade-out]:fade-out-0 duration-200"
    );

    /// <summary>
    /// Cascading parent NavigationMenuItem.
    /// </summary>
    [CascadingParameter]
    protected NavigationMenuItem? ParentItem { get; set; }

    /// <summary>
    /// The content to be rendered inside the panel.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// The unique ID of the content panel.
    /// </summary>
    protected string ContentId => $"{ParentItem?.Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentItem is null)
        {
            throw new InvalidOperationException($"{nameof(NavigationMenuContent)} must be used within a {nameof(NavigationMenuItem)}.");
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.NavigationMenuContent;

    /// <summary>
    /// Defines the slots available for styling in the NavigationMenuContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}