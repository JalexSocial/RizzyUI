
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A `<span>` element representing the current page in a breadcrumb trail. It is not interactive.
/// </summary>
public partial class BreadcrumbPage : RzComponent<BreadcrumbPage.Slots>
{
    /// <summary>
    /// Defines the default styling for the BreadcrumbPage component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "font-normal text-foreground"
    );

    /// <summary>
    /// Gets or sets the text content for the current page.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.BreadcrumbPage;

    /// <summary>
    /// Defines the slots available for styling in the BreadcrumbPage component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `span` element.
        /// </summary>
        public string? Base { get; set; }
    }
}