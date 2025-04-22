namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzStep Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzSteps" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzSteps" /> component.
        /// </summary>
        public abstract class RzStepsStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzStepsStylesBase" /> class. </summary>
            protected RzStepsStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzSteps ordered list (ol) element (layout, gap). </summary>
            public abstract string Container { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the list item (li) element representing a step (layout, positioning,
            ///     typography).
            /// </summary>
            public abstract string StepItem { get; }
    
            /// <summary> Gets the base CSS classes for the connector span element between steps. </summary>
            public abstract string ConnectorBase { get; }
    
            /// <summary> Gets the CSS classes for the div wrapping the step circle and label (layout, gap). </summary>
            public abstract string StepContentContainer { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the span representing the step circle when completed (layout, size, rounding,
            ///     border).
            /// </summary>
            public abstract string CircleCompletedBase { get; }
    
            /// <summary> Gets the CSS classes for the SVG icon within the completed circle (size). </summary>
            public abstract string CircleCompletedIcon { get; }
    
            /// <summary> Gets the CSS classes for the screen reader text within the completed circle. </summary>
            public abstract string CircleCompletedSrText { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the span representing the step circle for current or upcoming steps (layout,
            ///     size, rounding, border).
            /// </summary>
            public abstract string CircleDefaultBase { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the step label span (visibility, width). Status-specific styles are applied
            ///     separately.
            /// </summary>
            public abstract string LabelBase { get; }
    
            /// <summary> Gets the CSS classes for the optional caption span (typography). </summary>
            public abstract string Caption { get; }
    
            /// <summary> Gets the layout-specific CSS classes for the main container based on Orientation. </summary>
            /// <param name="orientation">The layout orientation.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetOrientationCss(Orientation orientation);
    
            /// <summary>
            ///     Gets the width CSS class for a step list item based on whether it's the first item (relevant for horizontal
            ///     layout).
            /// </summary>
            /// <param name="isFirst">True if this is the first step item.</param>
            /// <returns>A string like "w-full" or "".</returns>
            public abstract string GetStepItemWidthCss(bool isFirst);
    
            /// <summary>
            ///     Gets the CSS classes for the connector line between steps, considering orientation, previous step status, and
            ///     the active color.
            /// </summary>
            /// <param name="orientation">The layout orientation.</param>
            /// <param name="previousStatus">The status of the preceding step.</param>
            /// <param name="activeColor">The theme's active status color.</param>
            /// <returns>A string of CSS classes for positioning, size, and color.</returns>
            public abstract string GetConnectorCss(Orientation orientation, StepStatus previousStatus,
                StatusColor activeColor);
    
            /// <summary> Gets the variant-specific CSS classes for the completed step circle (border, background, text color). </summary>
            /// <param name="activeColor">The theme's active status color.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetCircleCompletedCss(StatusColor activeColor);
    
            /// <summary>
            ///     Gets the variant-specific CSS classes for the step circle based on its status (Current or Upcoming) and the
            ///     active color.
            /// </summary>
            /// <param name="status">The current status of the step.</param>
            /// <param name="activeColor">The theme's active status color.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetCircleDefaultCss(StepStatus status, StatusColor activeColor);
    
            /// <summary> Gets the variant-specific CSS classes for the step label based on its status and the active color. </summary>
            /// <param name="status">The current status of the step.</param>
            /// <param name="activeColor">The theme's active status color.</param>
            /// <returns>A string representing text color and font weight classes.</returns>
            public abstract string GetLabelStatusCss(StepStatus status, StatusColor activeColor);
        }
    
        // RzStep component itself doesn't render HTML, so no RzStepStylesBase needed.
    
        #endregion
}
