namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzEmbeddedPreview Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzEmbeddedPreview" /> component.
        /// </summary>
        public abstract class RzEmbeddedPreviewStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzEmbeddedPreviewStylesBase" /> class. </summary>
            protected RzEmbeddedPreviewStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzEmbeddedPreview container div (typically just width). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the iframe element (width, height, transitions). </summary>
            public abstract string IFrame { get; }
        }
    
        #endregion
}
