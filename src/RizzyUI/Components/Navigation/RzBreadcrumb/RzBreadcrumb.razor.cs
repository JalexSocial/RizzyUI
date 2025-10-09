
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A root container for a breadcrumb navigation trail. It renders as a <c><nav></c> element
/// and should contain a <see cref="BreadcrumbList"/> component.
/// </summary>
public partial class RzBreadcrumb : RzComponent<RzBreadcrumb.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzBreadcrumb component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sm"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the breadcrumb container,
    /// which should be a <see cref="BreadcrumbList"/> component.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the breadcrumb navigation container, providing context for screen readers.
    /// If not set, it defaults to a localized "Breadcrumb".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "nav";

        AriaLabel ??= Localizer["RzBreadcrumb.AriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzBreadcrumb.AriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzBreadcrumb;

    /// <summary>
    /// Defines the slots available for styling in the RzBreadcrumb component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `nav` element.
        /// </summary>
        public string? Base { get; set; }
    }
}