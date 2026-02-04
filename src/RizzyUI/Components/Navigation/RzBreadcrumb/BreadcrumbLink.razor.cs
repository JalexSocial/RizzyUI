
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An anchor link (`&lt;a&gt;`) for a breadcrumb item that is not the current page.
/// It can contain simple text or more complex components like <see cref="RzLink"/>.
/// </summary>
public partial class BreadcrumbLink : RzComponent<BreadcrumbLink.Slots>
{
    /// <summary>
    /// Defines the default styling for the BreadcrumbLink component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "transition-colors hover:text-foreground"
    );

    /// <summary>
    /// Gets or sets the URL the link navigates to.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the link.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "a";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.BreadcrumbLink;

    /// <summary>
    /// Defines the slots available for styling in the BreadcrumbLink component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `a` element.
        /// </summary>
        public string? Base { get; set; }
    }
}