namespace RizzyUI;

/// <summary>
///     Default implementation of <see cref="RzStylesBase.RzSeparatorStylesBase" /> that maps each
///     <see cref="RzSeparator" /> visual variant to a Tailwind‑CSS utility string.
///     The class supplies:
///     <list type="bullet">
///         <item>
///             <description>Standard, thick, dotted, and dashed rules.</description>
///         </item>
///         <item>
///             <description>Base flex layout styles used when the divider carries a label or icon.</description>
///         </item>
///     </list>
/// </summary>
/// <remarks>
///     No string merging is performed here; component‑level merges occur inside
///     <see cref="RzSeparator.RootClass" />.
/// </remarks>
public sealed class DefaultRzSeparatorStyles : RzStylesBase.RzSeparatorStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzSeparatorStyles" /> class.
    /// </summary>
    /// <param name="theme">
    ///     The active <see cref="RzTheme" />.  Present for future expansion—no theme tokens are
    ///     currently referenced by this class.
    /// </param>
    public DefaultRzSeparatorStyles(RzTheme theme) : base(theme)
    {
    }

    // ──────────────────────────────────────────────────────────────
    // Variant properties
    // ──────────────────────────────────────────────────────────────

    /// <inheritdoc />
    public override string Container => "my-4 border-t border-border";

    /// <inheritdoc />
    public override string Thick => "my-4 h-px border-0 bg-border";

    /// <inheritdoc />
    public override string Dotted => "my-4 border-t border-dotted border-border";

    /// <inheritdoc />
    public override string Dashed => "my-4 border-t border-dashed border-border";

    /// <summary>
    ///     Base classes applied to the wrapper element when <see cref="RzSeparator" /> contains
    ///     <c>ChildContent</c> (label, icon, etc.).
    /// </summary>
    public override string Divider => "flex items-center text-sm text-outline";

    // ──────────────────────────────────────────────────────────────
    // Helper methods
    // ──────────────────────────────────────────────────────────────

    /// <inheritdoc />
    public override string GetDividerLayoutCss(Orientation orientation)
    {
        return orientation == Orientation.Horizontal
            ? "flex items-center text-sm text-outline w-full"
            : "inline-flex flex-col items-center text-sm text-outline h-full";
    }

    /// <inheritdoc />
    public override string GetStyleCss(SeparatorStyle style, Orientation orientation)
    {
        if (orientation == Orientation.Vertical)
        {
            var baseVertical = "mx-4 border-r border-border h-full";
            return style switch
            {
                SeparatorStyle.Solid => $"{baseVertical} border-solid",
                SeparatorStyle.Dashed => $"{baseVertical} border-dashed",
                SeparatorStyle.Dotted => $"{baseVertical} border-dotted",
                _ => $"{baseVertical} border-solid"
            };
        }
        
        // Horizontal
        var baseHorizontal = "my-4 border-t border-border w-full";
        return style switch
        {
            SeparatorStyle.Solid => $"{baseHorizontal} border-solid",
            SeparatorStyle.Dashed => $"{baseHorizontal} border-dashed",
            SeparatorStyle.Dotted => $"{baseHorizontal} border-dotted",
            _ => $"{baseHorizontal} border-solid"
        };
    }

    /// <inheritdoc />
    public override string GetAlignmentCss(Align alignment, SeparatorStyle style, Orientation orientation)
    {
        // Used for Tailwind class discovery
        const string twDiscovery = "after:border-solid after:border-dashed after:border-dotted before:border-solid before:border-dashed before:border-dotted";
        
        var lineStyle = style switch
        {
            SeparatorStyle.Solid => "border-solid",
            SeparatorStyle.Dashed => "border-dashed",
            SeparatorStyle.Dotted => "border-dotted",
            _ => "border-solid"
        };

        if (orientation == Orientation.Vertical)
        {
            return alignment switch
            {
                Align.Start => $"after:flex-1 after:w-px after:border-r after:{lineStyle} after:border-border after:mt-2",
                Align.Center => $"before:flex-1 before:w-px before:border-r before:{lineStyle} before:border-border before:mb-2 " +
                                $"after:flex-1 after:w-px after:border-r after:{lineStyle} after:border-border after:mt-2",
                Align.End => $"before:flex-1 before:w-px before:border-r before:{lineStyle} before:border-border before:mb-2",
                _ => string.Empty
            };
        }
        
        // Horizontal
        return alignment switch
        {
            Align.Start => $"after:flex-1 after:border-t after:{lineStyle} after:border-border after:ms-6",
            Align.Center => $"before:flex-1 before:border-t before:{lineStyle} before:border-border before:me-6 " +
                            $"after:flex-1 after:border-t after:{lineStyle} after:border-border after:ms-6",
            Align.End => $"before:flex-1 before:border-t before:{lineStyle} before:border-border before:me-6",
            _ => string.Empty
        };
    }
}