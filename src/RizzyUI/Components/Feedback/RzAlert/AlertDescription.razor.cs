
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the descriptive content (&lt;c&gt;p&lt;/c&gt; tag by default) within an <see cref="RzAlert" /> component.
///     Provides supplementary information to the <see cref="AlertTitle" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class AlertDescription : RzComponent<AlertDescription.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDescription component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sm text-foreground [&_p]:leading-relaxed [&_ul]:list-inside [&_ul]:list-disc"
    );

    /// <summary> The descriptive content to be rendered. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "p";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDescription;

    /// <summary>
    /// Defines the slots available for styling in the AlertDescription component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}