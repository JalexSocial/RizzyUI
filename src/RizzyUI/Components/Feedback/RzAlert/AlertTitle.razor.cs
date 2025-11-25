
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the title section (defaults to &lt;c&gt;h3&lt;/c&gt;) for an <see cref="RzAlert" /> component.
///     Its text color is determined by the parent alert's variant and the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class AlertTitle : RzComponent<AlertTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "font-medium tracking-tight line-clamp-1",
        variants: new()
        {
            [c => ((AlertTitle)c).EffectiveVariant] = new Variant<ThemeVariant, Slots>
            {
                [ThemeVariant.Alternate] = null, // Inherits base color
                [ThemeVariant.Information] = "text-info",
                [ThemeVariant.Success] = "text-success",
                [ThemeVariant.Warning] = "text-warning",
                [ThemeVariant.Destructive] = "text-destructive"
            }
        }
    );

    /// <summary> Gets the parent <see cref="RzAlert" /> component to determine the variant. </summary>
    [CascadingParameter]
    public RzAlert? AlertParent { get; set; }

    /// <summary> 
    /// The variant of the alert title. If not set, it defaults to the variant of the parent RzAlert.
    /// This allows for overriding the parent's variant for specific styling needs.
    /// </summary>
    [Parameter]
    public ThemeVariant? Variant { get; set; }

    /// <summary> The content to be rendered inside the alert title (typically text). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the effective variant for styling, prioritizing the local `Variant` parameter
    /// and falling back to the parent `RzAlert`'s variant.
    /// </summary>
    protected ThemeVariant EffectiveVariant => Variant ?? AlertParent?.Variant ?? ThemeVariant.Alternate;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "h3";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertTitle;

    /// <summary>
    /// Defines the slots available for styling in the AlertTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("alert-title")]
        public string? Base { get; set; }
    }
}