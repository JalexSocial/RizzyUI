namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzDividerStyles
    
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzDivider"/> component,
    /// including variants for thickness and inset positioning.
    /// </summary>
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzDivider" /> component.
        /// </summary>
        public abstract class RzDividerStylesBase
    {
        /// <summary>The theme instance providing color and sizing tokens.</summary>
        protected readonly RzTheme Theme;
    
        /// <summary>Initializes a new instance of the <see cref="RzDividerStylesBase"/> class.</summary>
        protected RzDividerStylesBase(RzTheme theme) => Theme = theme;
    
        // ──────────────────────────────────────────────────────────────
        // Base / variant properties
        // ──────────────────────────────────────────────────────────────
    
        /// <summary>Standard horizontal rule (margin + solid border).</summary>
        public abstract string Container      { get; }
    
        /// <summary>Thick variant rendered with <c>h‑px</c> + background.</summary>
        public abstract string Thick          { get; }
    
        /// <summary>Dotted border style.</summary>
        public abstract string Dotted         { get; }
    
        /// <summary>Dashed border style.</summary>
        public abstract string Dashed         { get; }
    
        /// <summary>Inset (indented) solid rule.</summary>
        public abstract string Inset          { get; }
    
        /// <summary>Inset thick rule.</summary>
        public abstract string InsetThick     { get; }
    
        /// <summary>Inset dotted rule.</summary>
        public abstract string InsetDotted    { get; }
    
        /// <summary>Inset dashed rule.</summary>
        public abstract string InsetDashed    { get; }
    
        /// <summary>
        /// Base classes applied to the <c>&lt;div></c> wrapper when the divider
        /// contains <see cref="Microsoft.AspNetCore.Components.RenderFragment"/> content
        /// (label, child markup, etc.).
        /// </summary>
        public abstract string Divider        { get; }
    
        // ──────────────────────────────────────────────────────────────
        // Helper methods used by <see cref="RzDivider"/> runtime logic
        // ──────────────────────────────────────────────────────────────
    
        /// <summary>Returns the CSS for a plain <c>&lt;hr></c> in the requested style.</summary>
        public abstract string GetStyleCss(DividerStyle style);
    
        /// <summary>
        /// Returns the CSS (incl. <c>::before</c>/<c>::after</c> pseudo‑elements) for
        /// a labelled divider, taking alignment and desired line style into account.
        /// </summary>
        public abstract string GetAlignmentCss(Align alignment, DividerStyle style);
    }
    
    #endregion
}
