namespace RizzyUI;

/// <summary>
///     Default implementation of <see cref="RzStylesBase.RzDividerStylesBase" /> that maps each
///     <see cref="RzDivider" /> visual variant to a Tailwind‑CSS utility string.
///     The class supplies:
///     <list type="bullet">
///         <item>
///             <description>Standard, thick, dotted, and dashed rules.</description>
///         </item>
///         <item>
///             <description>Inset variants (indented 2rem) of the above rules.</description>
///         </item>
///         <item>
///             <description>Base flex layout styles used when the divider carries a label or icon.</description>
///         </item>
///     </list>
/// </summary>
/// <remarks>
///     No string merging is performed here; component‑level merges occur inside
///     <see cref="RzDivider.RootClass" />.
/// </remarks>
public sealed class DefaultRzDividerStyles : RzStylesBase.RzDividerStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzDividerStyles" /> class.
    /// </summary>
    /// <param name="theme">
    ///     The active <see cref="RzTheme" />.  Present for future expansion—no theme tokens are
    ///     currently referenced by this class.
    /// </param>
    public DefaultRzDividerStyles(RzTheme theme) : base(theme)
    {
    }

    // ──────────────────────────────────────────────────────────────
    // Variant properties
    // ──────────────────────────────────────────────────────────────

    /// <inheritdoc />
    public override string Container => "my-4 border-t border-outline";

    /// <inheritdoc />
    public override string Thick => "my-4 h-px border-0 bg-outline";

    /// <inheritdoc />
    public override string Dotted => "my-4 border-t border-dotted border-outline";

    /// <inheritdoc />
    public override string Dashed => "my-4 border-t border-dashed  border-outline";

    /// <inheritdoc />
    public override string Inset => "ml-8 my-4 border-t border-outline";

    /// <inheritdoc />
    public override string InsetThick => "ml-8 my-4 h-px border-0 bg-outline";

    /// <inheritdoc />
    public override string InsetDotted => "ml-8 my-4 border-t border-dotted border-outline";

    /// <inheritdoc />
    public override string InsetDashed => "ml-8 my-4 border-t border-dashed  border-outline";

    /// <summary>
    ///     Base classes applied to the wrapper element when <see cref="RzDivider" /> contains
    ///     <c>ChildContent</c> (label, icon, etc.).
    /// </summary>
    public override string Divider => "flex items-center text-sm text-outline";

    // ──────────────────────────────────────────────────────────────
    // Helper methods
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    ///     Returns the Tailwind class list for a plain <c>&lt;hr&gt;</c> rendered
    ///     in the requested <paramref name="style" />.
    /// </summary>
    /// <param name="style">The desired divider line style.</param>
    /// <returns>A class string defining border width, style, and color.</returns>
    public override string GetStyleCss(DividerStyle style)
    {
        return style switch
        {
            DividerStyle.Solid => $"{Container} border-solid",
            DividerStyle.Dashed => Dashed,
            DividerStyle.Dotted => Dotted,
            _ => $"{Container} border-solid"
        };
    }

    /// <summary>
    ///     Returns the class list for a divider rendered as a <c>&lt;div&gt;</c>
    ///     with <c>ChildContent</c>, including pseudo‑element definitions that draw
    ///     the left / right lines around the content.
    /// </summary>
    /// <param name="alignment">
    ///     The alignment of the label relative to the rule:
    ///     <see cref="Align.Start" />, <see cref="Align.Center" />, or <see cref="Align.End" />.
    /// </param>
    /// <param name="style">The visual style of the rule (solid, dashed, dotted).</param>
    /// <returns>A Tailwind class string describing flex layout and pseudo‑elements.</returns>
    public override string GetAlignmentCss(Align alignment, DividerStyle style)
    {
        // Determine the border-style part once.
        var lineStyle = style switch
        {
            DividerStyle.Solid => "border-solid",
            DividerStyle.Dashed => "border-dashed",
            DividerStyle.Dotted => "border-dotted",
            _ => "border-solid"
        };

        const string color = "border-outline dark:border-outline";

        return alignment switch
        {
            Align.Start => $"after:flex-1 after:border-t after:{lineStyle} after:{color} after:ms-6",
            Align.Center => $"before:flex-1 before:border-t before:{lineStyle} before:{color} before:me-6 " +
                            $"after:flex-1 after:border-t after:{lineStyle} after:{color} after:ms-6",
            Align.End => $"before:flex-1 before:border-t before:{lineStyle} before:{color} before:me-6",
            _ => string.Empty
        };
    }
}