namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzAlert Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAlert" /> component.
        /// </summary>
        public abstract class RzAlertStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzAlertStylesBase" /> class. </summary>
            protected RzAlertStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the main RzAlert container element. </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the inner div containing icon, content, and close button. </summary>
            public abstract string InnerContainer { get; }
    
            /// <summary> Gets the CSS classes for the div wrapping the alert icon. </summary>
            public abstract string IconContainer { get; }
    
            /// <summary> Gets the CSS classes for the pulsing animation div behind the icon (when applicable). </summary>
            public abstract string IconPulse { get; }
    
            /// <summary> Gets the CSS classes for the div containing the alert title and description. </summary>
            public abstract string ContentContainer { get; }
    
            /// <summary> Gets the CSS classes for the alert's close button. </summary>
            public abstract string CloseButton { get; }
    
            /// <summary> Gets the CSS classes for the SVG icon within the close button. </summary>
            public abstract string CloseButtonIcon { get; }
    
            /// <summary> Gets the variant-specific CSS classes (border, background, text color) for the alert container. </summary>
            /// <param name="variant">The alert variant type.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetVariantCss(AlertVariant variant);
    
            /// <summary> Gets the variant-specific light background CSS class for the inner container or icon background. </summary>
            /// <param name="variant">The alert variant type.</param>
            /// <returns>A string representing a background CSS class (e.g., "bg-info/10").</returns>
            public abstract string GetVariantBackgroundLightCss(AlertVariant variant);
    
            /// <summary> Gets the variant-specific lighter background CSS class, often used for icon pulse or hover states. </summary>
            /// <param name="variant">The alert variant type.</param>
            /// <returns>A string representing a background CSS class (e.g., "bg-info/15").</returns>
            public abstract string GetVariantBackgroundLighterCss(AlertVariant variant);
    
            /// <summary> Gets the variant-specific text color CSS class, typically used for the icon. </summary>
            /// <param name="variant">The alert variant type.</param>
            /// <returns>A string representing a text color CSS class (e.g., "text-info").</returns>
            public abstract string GetVariantIconColorCss(AlertVariant variant);
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAlertTitle" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAlertTitle" /> component.
        /// </summary>
        public abstract class RzAlertTitleStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzAlertTitleStylesBase" /> class. </summary>
            protected RzAlertTitleStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzAlertTitle h3 element. </summary>
            public abstract string Title { get; }
    
            /// <summary> Gets the variant-specific text color CSS class for the alert title. </summary>
            /// <param name="variant">The alert variant type (can be null if context is unavailable).</param>
            /// <returns>A string representing a text color CSS class.</returns>
            public abstract string GetVariantTextColorCss(AlertVariant? variant);
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAlertDescription" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAlertDescription" /> component.
        /// </summary>
        public abstract class RzAlertDescriptionStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzAlertDescriptionStylesBase" /> class. </summary>
            protected RzAlertDescriptionStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzAlertDescription p element. </summary>
            public abstract string Description { get; }
        }
    
        #endregion
}
