
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An ordered list (`&lt;ol&gt;`) that contains the breadcrumb items. This component should be
/// a direct child of <see cref="RzBreadcrumb"/>.
/// </summary>
public partial class BreadcrumbList : RzComponent<BreadcrumbList.Slots>
{
    /// <summary>
    /// Defines the default styling for the BreadcrumbList component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5 text-muted-foreground"
    );

    /// <summary>
    /// Gets or sets the content of the list, which should be a sequence of
    /// <see cref="BreadcrumbItem"/> and <see cref="BreadcrumbSeparator"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "ol";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.BreadcrumbList;

    /// <summary>
    /// Defines the slots available for styling in the BreadcrumbList component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `ol` element.
        /// </summary>
        public string? Base { get; set; }
    }
}