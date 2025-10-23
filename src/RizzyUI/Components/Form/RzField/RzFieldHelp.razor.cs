
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders a paragraph (<c>p</c>) element typically used to provide help text or descriptions
///     for a form field within an <see cref="RzField" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzFieldHelp : RzComponent<RzFieldHelp.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzFieldHelp component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sm text-muted-foreground"
    );

    /// <summary> The help text or other content to be rendered. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzFieldHelp;

    /// <summary>
    /// Defines the slots available for styling in the RzFieldHelp component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}