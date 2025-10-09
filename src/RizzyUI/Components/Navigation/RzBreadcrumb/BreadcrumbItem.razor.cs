
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list item (`<li>`) that wraps a breadcrumb link, page, or separator.
/// This component should be a child of <see cref="BreadcrumbList"/>.
/// </summary>
public partial class BreadcrumbItem : RzComponent<BreadcrumbItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the BreadcrumbItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center gap-1.5"
    );

    /// <summary>
    /// Gets or sets the content of the breadcrumb item, such as a <see cref="BreadcrumbLink"/>
    /// or <see cref="BreadcrumbPage"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "li";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.BreadcrumbItem;

    /// <summary>
    /// Defines the slots available for styling in the BreadcrumbItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `li` element.
        /// </summary>
        public string? Base { get; set; }
    }
}