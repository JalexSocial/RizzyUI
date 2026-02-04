using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders an ellipsis icon, typically used within a <see cref="BreadcrumbItem"/> to indicate
/// a collapsed menu of breadcrumb links.
/// </summary>
public partial class BreadcrumbEllipsis : RzComponent<BreadcrumbEllipsis.Slots>
{
    /// <summary>
    /// Defines the default styling for the BreadcrumbEllipsis component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-9 w-9 items-center justify-center",
        slots: new()
        {
            [s => s.Icon] = "size-4"
        }
    );

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.BreadcrumbEllipsis;

    /// <summary>
    /// Defines the slots available for styling in the BreadcrumbEllipsis component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root `span` element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The icon slot for the ellipsis icon.
        /// </summary>
        public string? Icon { get; set; }
    }
}