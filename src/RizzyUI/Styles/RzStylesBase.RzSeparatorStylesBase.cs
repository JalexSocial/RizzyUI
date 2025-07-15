namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzSeparatorStyles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSeparator" /> component,
    ///     including variants for thickness and inset positioning.
    /// </summary>
    public abstract class RzSeparatorStylesBase
    {
        /// <summary>The theme instance providing color and sizing tokens.</summary>
        protected readonly RzTheme Theme;

        /// <summary>Initializes a new instance of the <see cref="RzSeparatorStylesBase" /> class.</summary>
        protected RzSeparatorStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        // ──────────────────────────────────────────────────────────────
        // Base / variant properties
        // ──────────────────────────────────────────────────────────────

        /// <summary>Standard horizontal rule (margin + solid border).</summary>
        public abstract string Container { get; }

        /// <summary>Thick variant rendered with <c>h‑px</c> + background.</summary>
        public abstract string Thick { get; }

        /// <summary>Dotted border style.</summary>
        public abstract string Dotted { get; }

        /// <summary>Dashed border style.</summary>
        public abstract string Dashed { get; }

        /// <summary>
        ///     Base classes applied to the <c><div></c> wrapper when the divider
        ///     contains <see cref="Microsoft.AspNetCore.Components.RenderFragment" /> content
        ///     (label, child markup, etc.).
        /// </summary>
        public abstract string Divider { get; }

        // ──────────────────────────────────────────────────────────────
        // Helper methods used by <see cref="RzSeparator"/> runtime logic
        // ──────────────────────────────────────────────────────────────

        /// <summary>Returns the CSS for a plain divider line in the requested style and orientation.</summary>
        public abstract string GetStyleCss(SeparatorStyle style, Orientation orientation);

        /// <summary>
        ///     Returns the CSS (incl. <c>::before</c>/<c>::after</c> pseudo‑elements) for
        ///     a labelled divider, taking alignment, style, and orientation into account.
        /// </summary>
        public abstract string GetAlignmentCss(Align alignment, SeparatorStyle style, Orientation orientation);

        /// <summary>
        /// Returns the base layout CSS for a divider with content based on its orientation.
        /// </summary>
        /// <param name="orientation">The orientation of the divider.</param>
        /// <returns>A Tailwind class string for flex layout.</returns>
        public abstract string GetDividerLayoutCss(Orientation orientation);
    }

    #endregion
}