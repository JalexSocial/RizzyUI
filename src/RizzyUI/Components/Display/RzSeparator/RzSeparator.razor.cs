
// src/RizzyUI/Components/RzSeparator/RzSeparator.razor.cs

using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A component that renders a horizontal divider line, optionally with centered or aligned text/content.
///     Renders as an <c>&lt;hr></c> if no <see cref="ChildContent" /> is provided, otherwise renders as a <c>&lt;div></c>
///     using pseudo-elements for the lines. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSeparator : RzComponent
{
    // Used for Tailwind class discovery
#pragma warning disable CS0414 // Field is assigned but its value is never used
    private static readonly string TwDiscovery = "after:border-solid after:border-dashed after:border-dotted before:border-solid before:border-dashed before:border-dotted";
#pragma warning restore CS0414 // Field is assigned but its value is never used

    /// <summary> The style of the dividing line (Solid, Dashed, Dotted). Defaults to Solid. </summary>
    [Parameter] public SeparatorStyle Style { get; set; } = SeparatorStyle.Solid;

    /// <summary>
    ///     The alignment of the child content within the divider (Start, Center, End). Only used if
    ///     <see cref="ChildContent" /> is provided. Defaults to Center.
    /// </summary>
    [Parameter] public Align LabelAlignment { get; set; } = Align.Center;

    /// <summary>
    ///     Optional content to display within the divider (e.g., text or an icon). If null, a simple <c>&lt;hr></c> is
    ///     rendered.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "div";
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzSeparator;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Divider, // Base styles including text color, margins, base layout
            ChildContent is null
                ? styles.GetStyleCss(Style) // Style for <hr> (border-t, border-style)
                : styles.GetAlignmentCss(LabelAlignment,
                    Style) // Alignment/style for <div> with content (uses ::before/::after)
        );
    }
}