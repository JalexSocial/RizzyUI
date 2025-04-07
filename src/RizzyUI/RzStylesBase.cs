// src/RizzyUI/Styling/RzStylesBase.cs

// Required for RenderFragment type hint if needed later

namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract class RzStylesBase
{
    #region RzAvatar Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzAvatar" /> component.
    /// </summary>
    public abstract class RzAvatarStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzAvatarStylesBase" /> class. </summary>
        protected RzAvatarStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the main RzAvatar container element (positioning and object-fit). Size is
        ///     applied separately.
        /// </summary>
        public abstract string Container { get; }

        /// <summary>
        ///     Gets the CSS classes for the status indicator div (base style, border). Size and color are applied
        ///     separately.
        /// </summary>
        public abstract string Indicator { get; }

        /// <summary> Gets the base CSS classes for the img element. Size and shape are applied separately. </summary>
        public abstract string Image { get; }

        /// <summary>
        ///     Gets the base CSS classes for the initials container div (flex, alignment, base colors). Size, shape, and
        ///     text size are applied separately.
        /// </summary>
        public abstract string InitialsContainer { get; }

        /// <summary>
        ///     Gets the base CSS classes for the placeholder container div (flex, alignment, base colors). Size and shape
        ///     are applied separately.
        /// </summary>
        public abstract string PlaceholderContainer { get; }

        /// <summary> Gets the base CSS classes for the placeholder SVG icon. Size is applied separately. </summary>
        public abstract string PlaceholderIcon { get; }

        /// <summary> Gets the CSS classes for the avatar's shape (e.g., rounded-full, rounded-lg). </summary>
        /// <param name="shape">The desired avatar shape.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetShapeCss(AvatarShape shape);

        /// <summary> Gets the CSS classes for the avatar's overall size (width and height). </summary>
        /// <param name="size">The desired avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "size-10").</returns>
        public abstract string GetSizeCss(Size size);

        /// <summary> Gets the CSS classes for the text size of the initials. </summary>
        /// <param name="size">The corresponding avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "text-base").</returns>
        public abstract string GetInitialsSizeCss(Size size);

        /// <summary> Gets the CSS classes for the size of the placeholder icon. </summary>
        /// <param name="size">The corresponding avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "size-6").</returns>
        public abstract string GetPlaceholderSizeCss(Size size);

        /// <summary> Gets the CSS classes for the size of the status indicator. </summary>
        /// <param name="size">The corresponding avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "size-3").</returns>
        public abstract string GetIndicatorSizeCss(Size size);

        /// <summary> Gets the CSS background color classes (light and dark) for the status indicator. </summary>
        /// <param name="color">The desired accent color.</param>
        /// <returns>A string of CSS classes (e.g., "bg-emerald-200 dark:bg-emerald-800").</returns>
        public abstract string GetIndicatorColorCss(AccentColor color);
    }

    #endregion

    #region RzBadge Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzBadge" /> component.
    /// </summary>
    public abstract class RzBadgeStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzBadgeStylesBase" /> class. </summary>
        protected RzBadgeStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzBadge span element (layout, border, font). </summary>
        public abstract string Badge { get; }

        /// <summary> Gets the CSS classes for the inner span containing the icon and text content (padding, alignment). </summary>
        public abstract string InnerSpan { get; }

        /// <summary> Gets the variant-specific CSS classes (border, background, text color) for a standard badge. </summary>
        /// <param name="color">The semantic color for the badge.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetVariantCss(SemanticColor color);

        /// <summary> Gets the variant-specific CSS classes (border, background, text color) for a "soft" badge. </summary>
        /// <param name="color">The semantic color for the badge.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetVariantSoftCss(SemanticColor color);
    }

    #endregion

    #region RzCodeViewer Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCodeViewer" /> component.
    /// </summary>
    public abstract class RzCodeViewerStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCodeViewerStylesBase" /> class. </summary>
        protected RzCodeViewerStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzCodeViewer container div (margin, overflow). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the configuration header div (layout, padding, border, background, typography). </summary>
        public abstract string Header { get; }

        /// <summary> Gets the CSS classes for the title span within the header. </summary>
        public abstract string HeaderTitle { get; }

        /// <summary> Gets the CSS classes for the main code display container div (border, rounding, overflow). </summary>
        public abstract string CodeContainer { get; }

        /// <summary> Gets the CSS classes for the div containing the copy button (layout, border, background). </summary>
        public abstract string CopyButtonContainer { get; }

        /// <summary> Gets the CSS classes for the copy button (layout, padding, rounding, focus styles). </summary>
        public abstract string CopyButton { get; }

        /// <summary> Gets the CSS classes for the SVG icon when the content is not yet copied. </summary>
        public abstract string CopyIconDefault { get; }

        /// <summary> Gets the CSS classes for the SVG icon when the content has been copied. </summary>
        public abstract string CopyIconCopied { get; }

        /// <summary> Gets the CSS classes for the div wrapping the pre/code block (positioning, overflow). </summary>
        public abstract string PreWrapper { get; }

        /// <summary> Gets the CSS classes for the pre element (typography, padding, overflow, border). </summary>
        public abstract string PreElement { get; }

        // Note: Code element classes are added by Highlight.js and theme variables
        /// <summary> Gets the CSS classes for the expand/collapse button (layout, padding, border, background, focus styles). </summary>
        public abstract string ExpandButton { get; }

        /// <summary> Gets the CSS classes for the expand/collapse SVG icon (size, transition). </summary>
        public abstract string ExpandIcon { get; }

        /// <summary> Gets the CSS classes for the PreWrapper div based on the expand state (e.g., max-height). </summary>
        /// <param name="isExpanded">Whether the code view is expanded.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetExpandContentCss(bool isExpanded);

        /// <summary> Gets the CSS classes for the expand icon based on the expand state (e.g., rotate-180). </summary>
        /// <param name="isExpanded">Whether the code view is expanded.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetExpandButtonIconCss(bool isExpanded);

        /// <summary> Gets the CSS classes for the copy button based on the copied state (e.g., focus outline color). </summary>
        /// <param name="isCopied">Whether the code has just been copied.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetCopyButtonStateCss(bool isCopied);
    }

    #endregion

    #region RzDateEdit Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzDateEdit" /> component.
    /// </summary>
    public abstract class RzDateEditStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDateEditStylesBase" /> class. </summary>
        protected RzDateEditStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzDateEdit container div (width). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the relative div wrapping the input and prepend element. </summary>
        public abstract string InputWrapper { get; }

        /// <summary>
        ///     Gets the CSS classes for the prepend element div (positioning, layout, padding, border, background,
        ///     typography).
        /// </summary>
        public abstract string PrependElement { get; }

        /// <summary> Gets the CSS classes for the Blazicon component if PrependIcon is used (text size). </summary>
        public abstract string PrependIconContainer { get; }

        /// <summary>
        ///     Gets the base CSS classes for the input element (layout, rounding, border, padding, typography, focus
        ///     styles).
        /// </summary>
        public abstract string Input { get; }
        // Note: Flatpickr calendar styles are handled separately by its CSS file.
    }

    #endregion

    #region RzDivider Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzDivider" /> component.
    /// </summary>
    public abstract class RzDividerStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDividerStylesBase" /> class. </summary>
        protected RzDividerStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzDivider hr or div element (margin, layout, typography). </summary>
        public abstract string Divider { get; }

        /// <summary>
        ///     Gets the CSS classes for the divider style (solid, dashed, dotted) when rendered as an <c>hr</c> (no
        ///     ChildContent).
        /// </summary>
        /// <param name="style">The desired divider style.</param>
        /// <returns>A string of CSS classes (e.g., "border-solid border-t border-outline").</returns>
        public abstract string GetStyleCss(DividerStyle style);

        /// <summary>
        ///     Gets the CSS classes for the divider when rendered as a <c>div</c> with ChildContent, including alignment and
        ///     style for pseudo-elements.
        /// </summary>
        /// <param name="alignment">The alignment of the content (Start, Center, End).</param>
        /// <param name="style">The desired divider line style.</param>
        /// <returns>A string of CSS classes utilizing ::before and ::after pseudo-elements.</returns>
        public abstract string GetAlignmentCss(Align alignment, DividerStyle style);
    }

    #endregion

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

    #region RzFormSection Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzFormSection" /> component.
    /// </summary>
    public abstract class RzFormSectionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzFormSectionStylesBase" /> class. </summary>
        protected RzFormSectionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzFormSection container div (layout determined by method). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the description container div (layout determined by method). </summary>
        public abstract string DescriptionContainer { get; }

        /// <summary> Gets the CSS classes for the title h2 element (typography). </summary>
        public abstract string Title { get; }

        /// <summary> Gets the CSS classes for the description p element (typography). </summary>
        public abstract string Description { get; }

        /// <summary> Gets the CSS classes for the content container div (layout determined by method). </summary>
        public abstract string ContentContainer { get; }

        /// <summary> Gets the layout-specific CSS classes for the main container div. </summary>
        /// <param name="layout">The section layout type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetLayoutCss(SectionLayout layout);

        /// <summary> Gets the layout-specific CSS classes for the description container div. </summary>
        /// <param name="layout">The section layout type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetDescriptionLayoutCss(SectionLayout layout);

        /// <summary> Gets the layout-specific CSS classes for the content container div. </summary>
        /// <param name="layout">The section layout type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetContentLayoutCss(SectionLayout layout);
    }

    #endregion

    #region RzHeading Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzHeading" /> component.
    /// </summary>
    public abstract class RzHeadingStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzHeadingStylesBase" /> class. </summary>
        protected RzHeadingStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the level-specific CSS classes for the heading element (margins, responsive text sizes, font weight). </summary>
        /// <param name="level">The heading level (H1-H4).</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetLevelCss(HeadingLevel level);
    }

    #endregion

    #region RzLink Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzLink" /> component.
    /// </summary>
    public abstract class RzLinkStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzLinkStylesBase" /> class. </summary>
        protected RzLinkStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzLink anchor (a) element (typography, color, focus styles). </summary>
        public abstract string Link { get; }

        /// <summary> Gets the CSS classes applied when underlining is enabled (hover/focus states). </summary>
        public abstract string UnderlineEnabled { get; }
    }

    #endregion

    #region RzMarkdown Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzMarkdown" /> component container.
    /// </summary>
    public abstract class RzMarkdownStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzMarkdownStylesBase" /> class. </summary>
        protected RzMarkdownStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzMarkdown container div (prose base, dark mode, text color, max-width
        ///     reset).
        /// </summary>
        public abstract string Container { get; }

        /// <summary> Gets the prose width utility class based on the specified width. </summary>
        /// <param name="width">The desired prose width.</param>
        /// <returns>A string representing a Tailwind prose width class (e.g., "prose-wide").</returns>
        public abstract string GetProseWidthCss(ProseWidth width);
    }

    #endregion

    #region RzNavbar Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzNavbar" /> component.
    /// </summary>
    public abstract class RzNavbarStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzNavbarStylesBase" /> class. </summary>
        protected RzNavbarStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzNavbar nav element (positioning, size, layout, border, background, blur). </summary>
        public abstract string Navbar { get; }

        /// <summary> Gets the CSS classes for the mobile toggle button (visibility, layout, text color). </summary>
        public abstract string ToggleButton { get; }

        /// <summary> Gets the CSS classes for the icon container inside the toggle button (text size). </summary>
        public abstract string ToggleButtonIconContainer { get; }

        /// <summary> Gets the CSS classes for the screen-reader-only span inside the toggle button. </summary>
        public abstract string ToggleButtonSrText { get; }

        /// <summary> Gets the CSS classes for the main content container div within the navbar (size, layout). </summary>
        public abstract string ContentContainer { get; }
    }

    #endregion

    #region RzParagraph Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzParagraph" /> component.
    /// </summary>
    public abstract class RzParagraphStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzParagraphStylesBase" /> class. </summary>
        protected RzParagraphStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzParagraph p element (margin, leading). </summary>
        public abstract string Paragraph { get; }

        /// <summary> Gets the prose width utility class based on the specified width. </summary>
        /// <param name="width">The desired prose width.</param>
        /// <returns>A string representing a Tailwind prose width class.</returns>
        public abstract string GetProseWidthCss(ProseWidth width);
    }

    #endregion

    #region RzProgress Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzProgress" /> component.
    /// </summary>
    public abstract class RzProgressStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzProgressStylesBase" /> class. </summary>
        protected RzProgressStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzProgress container div (width). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the optional outside label container div (layout, margin). </summary>
        public abstract string OutsideLabelContainer { get; }

        /// <summary> Gets the CSS classes for the outside label text span (text color). </summary>
        public abstract string OutsideLabelText { get; }

        /// <summary>
        ///     Gets the CSS classes for the outer progress bar container div (track styling: layout, overflow, rounding,
        ///     background).
        /// </summary>
        public abstract string OuterBar { get; }

        /// <summary>
        ///     Gets the base CSS classes for the inner progress bar div (value indicator: layout, typography, transitions).
        ///     Variant styles are applied separately.
        /// </summary>
        public abstract string InnerBarBase { get; }

        /// <summary> Gets the CSS classes for the inside label container div (positioning). </summary>
        public abstract string InsideLabelContainer { get; }

        /// <summary> Gets the base CSS classes for the inside label text span (usually empty, styled by container). </summary>
        public abstract string InsideLabelText { get; }

        /// <summary> Gets the height CSS class for the OuterBar based on the label's position. </summary>
        /// <param name="position">The position of the label.</param>
        /// <returns>A string representing a height class (e.g., "h-4").</returns>
        public abstract string GetOuterBarHeightCss(ProgressLabelPosition position);

        /// <summary> Gets the variant-specific CSS classes for the InnerBar (height, rounding, background, text color). </summary>
        /// <param name="variant">The status color variant.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetInnerBarVariantCss(StatusColor variant);

        /// <summary> Gets the text color CSS class for the InsideLabel when it overflows the InnerBar. </summary>
        /// <param name="overflows">Whether the label overflows the bar.</param>
        /// <returns>A string representing a text color class or an empty string.</returns>
        public abstract string GetInsideLabelColorCss(bool overflows);
    }

    #endregion

    #region RzStep Styles

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

    #region Typography Styles (Shared by RzHeading, RzParagraph)

    /// <summary>
    ///     Defines the abstract structure for base typography styling utilities used by components like
    ///     <see cref="RzHeading" /> and <see cref="RzParagraph" />.
    /// </summary>
    public abstract class RzTypographyStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTypographyStylesBase" /> class. </summary>
        protected RzTypographyStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS class corresponding to the specified text weight. </summary>
        /// <param name="weight">The desired text weight.</param>
        /// <returns>A string like "font-bold" or "".</returns>
        public abstract string GetTextWeightCss(TextWeight? weight);

        /// <summary> Gets the CSS class corresponding to the specified text size. </summary>
        /// <param name="size">The desired text size.</param>
        /// <returns>A string like "text-lg" or "".</returns>
        public abstract string GetTextSizeCss(TextSize? size);

        /// <summary> Gets the CSS class corresponding to the specified text transformation. </summary>
        /// <param name="transform">The desired text transformation.</param>
        /// <returns>A string like "uppercase" or "".</returns>
        public abstract string GetTextTransformCss(TextTransform? transform);

        /// <summary> Gets the CSS class corresponding to the specified text decoration. </summary>
        /// <param name="decoration">The desired text decoration.</param>
        /// <returns>A string like "underline" or "".</returns>
        public abstract string GetTextDecorationCss(TextDecoration? decoration);

        /// <summary> Gets the CSS class corresponding to the specified line height (leading). </summary>
        /// <param name="leading">The desired line height.</param>
        /// <returns>A string like "leading-relaxed" or "".</returns>
        public abstract string GetLineHeightCss(Leading? leading);

        /// <summary> Combines all individual typography style classes (color, weight, size, etc.) into a single string. </summary>
        /// <param name="textColor">Optional text color.</param>
        /// <param name="weight">Optional text weight.</param>
        /// <param name="size">Optional text size.</param>
        /// <param name="lineHeight">Optional line height.</param>
        /// <param name="decoration">Optional text decoration.</param>
        /// <param name="transform">Optional text transformation.</param>
        /// <returns>A consolidated string of CSS classes.</returns>
        public abstract string GetBaseCss(SemanticColor? textColor, TextWeight? weight, TextSize? size,
            Leading? lineHeight, TextDecoration? decoration, TextTransform? transform);
    }

    #endregion

    #region RzHtmlElement Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzHtmlElement" /> component.
    /// </summary>
    public abstract class RzHtmlElementStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzHtmlElementStylesBase" /> class. </summary>
        protected RzHtmlElementStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzHtmlElement (usually none, styling comes from attributes). </summary>
        public abstract string Element { get; }
    }

    #endregion

    #region RzFragmentComponent Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzFragmentComponent" />.
    /// </summary>
    public abstract class RzFragmentComponentStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzFragmentComponentStylesBase" /> class. </summary>
        protected RzFragmentComponentStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzFragmentComponent (usually none). </summary>
        public abstract string Container { get; }
    }

    #endregion

    #region RzArticle Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzArticle" /> layout component.
    /// </summary>
    public abstract class RzArticleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzArticleStylesBase" /> class. </summary>
        protected RzArticleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzArticle container div (layout, text color). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the inner div wrapping the article and aside (layout, max-width, overflow). </summary>
        public abstract string InnerContainer { get; }

        /// <summary> Gets the base CSS classes for the article element. Prose width is applied separately. </summary>
        public abstract string Article { get; }

        /// <summary>
        ///     Gets the base CSS classes for the aside element (side content: layout, overflow, padding, typography). Width
        ///     and positioning are applied separately.
        /// </summary>
        public abstract string Aside { get; }

        /// <summary> Gets the prose width utility class based on the specified width. </summary>
        /// <param name="width">The desired prose width.</param>
        /// <returns>A string representing a Tailwind prose width class.</returns>
        public abstract string GetArticleProseCss(ProseWidth width);

        /// <summary> Gets the CSS classes for the aside element based on column width and fixed state. </summary>
        /// <param name="columnWidth">The desired width of the aside column.</param>
        /// <param name="isFixed">Whether the aside should be fixed-positioned.</param>
        /// <returns>A string of CSS classes including width and positioning.</returns>
        public abstract string GetAsideCss(Size columnWidth, bool isFixed);

        /// <summary>
        ///     Gets the CSS class for the main container's right padding, used to prevent content overlap with a fixed
        ///     aside.
        /// </summary>
        /// <param name="columnWidth">The width of the aside column.</param>
        /// <returns>A string representing a right padding class (e.g., "xl:pr-72").</returns>
        public abstract string GetContainerPaddingCss(Size columnWidth);
    }

    #endregion

    #region RzAccordion Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzAccordion" /> component.
    /// </summary>
    public abstract class RzAccordionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzAccordionStylesBase" /> class. </summary>
        protected RzAccordionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzAccordion container div. </summary>
        public abstract string Container { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzAccordionSection" /> component.
    /// </summary>
    public abstract class RzAccordionSectionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzAccordionSectionStylesBase" /> class. </summary>
        protected RzAccordionSectionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the section's clickable button element. </summary>
        public abstract string Button { get; }

        /// <summary> Gets the base CSS classes for the section's collapsible content container div. </summary>
        public abstract string ContentContainer { get; }

        /// <summary> Gets the CSS classes for the chevron indicator icon. </summary>
        public abstract string ChevronIcon { get; }

        /// <summary> Gets the CSS classes applied to the chevron icon when the section is expanded. </summary>
        public abstract string ChevronIconExpanded { get; }
    }

    #endregion

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

    #region RzBreadcrumb Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzBreadcrumb" /> component container.
    /// </summary>
    public abstract class RzBreadcrumbStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzBreadcrumbStylesBase" /> class. </summary>
        protected RzBreadcrumbStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzBreadcrumb nav element (typography, margin). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the ordered list (ol) element wrapping the items (layout, gap). </summary>
        public abstract string List { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual items within the <see cref="RzBreadcrumb" /> component.
    /// </summary>
    public abstract class RzBreadcrumbItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzBreadcrumbItemStylesBase" /> class. </summary>
        protected RzBreadcrumbItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the list item (li) element (layout, gap, base text color). </summary>
        public abstract string ListItem { get; }

        /// <summary> Gets the CSS classes for the anchor (a) element used for non-active items (hover states). </summary>
        public abstract string Link { get; }

        /// <summary> Gets the CSS classes for the span element used for the active item (font weight). </summary>
        public abstract string ActiveSpan { get; }

        /// <summary> Gets the CSS classes for the span wrapping an icon, if used. </summary>
        public abstract string IconSpan { get; }
    }

    #endregion

    #region RzButton Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzButton" /> component.
    /// </summary>
    public abstract class RzButtonStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzButtonStylesBase" /> class. </summary>
        protected RzButtonStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the button element (layout, cursor, base typography, transitions). </summary>
        public abstract string Button { get; }

        /// <summary> Gets the CSS classes applied when the button has animation enabled (transforms, transitions). </summary>
        public abstract string Animated { get; }

        /// <summary> Gets the variant-specific CSS classes (background, text, focus styles) for a standard (solid) button. </summary>
        /// <param name="variant">The button variant type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetVariantCss(ButtonVariant variant);

        /// <summary> Gets the variant-specific CSS classes (background, border, text, focus styles) for an outlined button. </summary>
        /// <param name="variant">The button variant type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetVariantOutlineCss(ButtonVariant variant);

        /// <summary> Gets the size-specific CSS classes (padding, text size) for the button. </summary>
        /// <param name="size">The desired button size.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetSizeCss(Size size);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzButtonGroup" /> component and its interaction with
    ///     child buttons.
    /// </summary>
    public abstract class RzButtonGroupStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzButtonGroupStylesBase" /> class. </summary>
        protected RzButtonGroupStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the ButtonGroup container div (layout). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes applied to the first button in a group (corner rounding). </summary>
        public abstract string GroupFirst { get; }

        /// <summary> Gets the CSS classes applied to the last button in a group (corner rounding, border adjustment). </summary>
        public abstract string GroupLast { get; }

        /// <summary>
        ///     Gets the CSS classes applied to buttons that are neither first nor last in a group (corner rounding, border
        ///     adjustment).
        /// </summary>
        public abstract string GroupMiddle { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzDarkmodeToggle" /> button.
    /// </summary>
    public abstract class RzDarkmodeToggleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDarkmodeToggleStylesBase" /> class. </summary>
        protected RzDarkmodeToggleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the DarkmodeToggle button element (layout, padding, base colors, transitions). </summary>
        public abstract string Button { get; }

        /// <summary> Gets the CSS classes for the icons (SVG/Blazicon) within the button (transitions). </summary>
        public abstract string Icon { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSearchButton" /> component.
    /// </summary>
    public abstract class RzSearchButtonStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSearchButtonStylesBase" /> class. </summary>
        protected RzSearchButtonStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the SearchButton button element (layout, border, background, typography,
        ///     transitions).
        /// </summary>
        public abstract string Button { get; }

        /// <summary> Gets the CSS classes for the inner div containing the icon and label (layout, gap). </summary>
        public abstract string InnerContainer { get; }

        /// <summary> Gets the CSS classes for the span wrapping the search icon (text size). </summary>
        public abstract string IconSpan { get; }
    }

    #endregion

    #region RzCard Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCard" /> component container.
    /// </summary>
    public abstract class RzCardStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardStylesBase" /> class. </summary>
        protected RzCardStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCard container div (layout, rounding, overflow, shadow, border). </summary>
        public abstract string Container { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCardHeader" /> section.
    /// </summary>
    public abstract class RzCardHeaderStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardHeaderStylesBase" /> class. </summary>
        protected RzCardHeaderStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCardHeader div (layout, padding, alignment). </summary>
        public abstract string Header { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCardBody" /> section.
    /// </summary>
    public abstract class RzCardBodyStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardBodyStylesBase" /> class. </summary>
        protected RzCardBodyStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCardBody div (flex grow, padding). </summary>
        public abstract string Body { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCardFooter" /> section.
    /// </summary>
    public abstract class RzCardFooterStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardFooterStylesBase" /> class. </summary>
        protected RzCardFooterStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCardFooter div (padding, typography, bottom rounding). </summary>
        public abstract string Footer { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCardTitle" />.
    /// </summary>
    public abstract class RzCardTitleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardTitleStylesBase" /> class. </summary>
        protected RzCardTitleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCardTitle h3 element (layout, margin, typography). </summary>
        public abstract string Title { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCardSubtitle" />.
    /// </summary>
    public abstract class RzCardSubtitleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardSubtitleStylesBase" /> class. </summary>
        protected RzCardSubtitleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCardSubtitle h4 element (typography). </summary>
        public abstract string Subtitle { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCardButtons" /> container in a card header.
    /// </summary>
    public abstract class RzCardButtonsStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCardButtonsStylesBase" /> class. </summary>
        protected RzCardButtonsStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCardButtons div (layout, gap, negative margin for alignment). </summary>
        public abstract string ButtonsContainer { get; }
    }

    #endregion

    #region RzCheckbox Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroup{TValue}" /> container.
    /// </summary>
    public abstract class RzCheckboxGroupStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCheckboxGroupStylesBase" /> class. </summary>
        protected RzCheckboxGroupStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCheckboxGroup container div (layout, gap). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the layout-specific CSS classes based on the Orientation (flex direction). </summary>
        /// <param name="orientation">The layout orientation.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetOrientationCss(Orientation orientation);
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual <see cref="RzCheckboxGroupItem{TValue}" /> components.
    /// </summary>
    public abstract class RzCheckboxGroupItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCheckboxGroupItemStylesBase" /> class. </summary>
        protected RzCheckboxGroupItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzCheckboxGroupItem label element (layout, cursor). </summary>
        public abstract string Label { get; }

        /// <summary> Gets the CSS classes for the relative div wrapping the checkbox input and icon. </summary>
        public abstract string CheckboxWrapper { get; }

        /// <summary> Gets the CSS classes for the checkbox input element itself (size, border, rounding, focus styles). </summary>
        public abstract string CheckboxInput { get; }

        /// <summary> Gets the CSS classes for the div containing the check icon (positioning, text color). </summary>
        public abstract string IconContainer { get; }

        /// <summary> Gets the CSS classes for the span containing the title text (margin). </summary>
        public abstract string TitleSpan { get; }

        /// <summary>
        ///     Returns the CSS class ("hidden" or "") to control the visibility of the check icon based on the checked
        ///     state.
        /// </summary>
        /// <param name="isChecked">Whether the checkbox is checked.</param>
        /// <returns>A string ("hidden" or "").</returns>
        public abstract string GetIconVisibilityCss(bool isChecked);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroupField{TValue}" /> component.
    /// </summary>
    public abstract class RzCheckboxGroupFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCheckboxGroupFieldStylesBase" /> class. </summary>
        protected RzCheckboxGroupFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzCheckboxGroupField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }

        /// <summary>
        ///     Gets the CSS classes applied specifically to the <see cref="RzCheckboxGroup{TValue}" /> when it's rendered
        ///     inside this field container (e.g., margins).
        /// </summary>
        public abstract string GroupWithinField { get; }
    }

    #endregion

    #region RzDropdown Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzDropdown" /> component.
    /// </summary>
    public abstract class RzDropdownStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDropdownStylesBase" /> class. </summary>
        protected RzDropdownStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzDropdown container div (usually empty or just display property). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the relative div that wraps both the trigger and the floating menu. </summary>
        public abstract string RelativeWrapper { get; }

        /// <summary> Gets the CSS classes for the div that wraps the trigger content (layout properties). </summary>
        public abstract string TriggerWrapper { get; }

        /// <summary>
        ///     Gets the CSS classes for the dropdown menu container div (positioning, width, rounding, shadow). Anchor
        ///     positioning classes are added dynamically.
        /// </summary>
        public abstract string MenuContainer { get; }

        /// <summary>
        ///     Gets the CSS classes for the inner div inside the menu container, which typically holds sections and provides
        ///     background/border styling.
        /// </summary>
        public abstract string MenuInnerContainer { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling sections within an <see cref="RzDropdown" />.
    /// </summary>
    public abstract class RzDropdownSectionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDropdownSectionStylesBase" /> class. </summary>
        protected RzDropdownSectionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzDropdownSection div (layout, padding). </summary>
        public abstract string Section { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual items within an <see cref="RzDropdownSection" />.
    /// </summary>
    public abstract class RzDropdownMenuItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDropdownMenuItemStylesBase" /> class. </summary>
        protected RzDropdownMenuItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzDropdownMenuItem anchor (a) element (layout, rounding, cursor, border,
        ///     padding, typography, transitions, focus styles).
        /// </summary>
        public abstract string MenuItem { get; }

        /// <summary> Gets the CSS classes for the span wrapping the icon (typography size). </summary>
        public abstract string IconSpan { get; }

        /// <summary> Gets the CSS classes for the Blazicon component within the icon span (size, layout, opacity). </summary>
        public abstract string Icon { get; }

        /// <summary> Gets the CSS classes for the span containing the title text (flex grow). </summary>
        public abstract string TitleSpan { get; }

        /// <summary>
        ///     Gets the CSS classes for the div displaying the optional count badge (layout, rounding, border, padding,
        ///     typography).
        /// </summary>
        public abstract string CountDiv { get; }
    }

    #endregion

    #region RzField Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzField" /> container component.
    /// </summary>
    public abstract class RzFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzFieldStylesBase" /> class. </summary>
        protected RzFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzField container div (layout, spacing). </summary>
        public abstract string Field { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzFieldLabel{TValue}" /> component.
    /// </summary>
    public abstract class RzFieldLabelStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzFieldLabelStylesBase" /> class. </summary>
        protected RzFieldLabelStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzFieldLabel label element (typography). </summary>
        public abstract string Label { get; }

        /// <summary> Gets the CSS classes for the required indicator span (color, typography). </summary>
        public abstract string RequiredIndicator { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzFieldHelp" /> component.
    /// </summary>
    public abstract class RzFieldHelpStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzFieldHelpStylesBase" /> class. </summary>
        protected RzFieldHelpStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzFieldHelp p element (typography, color). </summary>
        public abstract string HelpText { get; }
    }

    #endregion

    #region RzNumber Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzNumberEdit{TValue}" /> component.
    /// </summary>
    public abstract class RzNumberEditStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzNumberEditStylesBase" /> class. </summary>
        protected RzNumberEditStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the relative div wrapping the input and prepend element. </summary>
        public abstract string InputWrapper { get; }

        /// <summary>
        ///     Gets the CSS classes for the prepend element div (positioning, layout, padding, border, background,
        ///     typography).
        /// </summary>
        public abstract string PrependElement { get; }

        /// <summary> Gets the CSS classes for the Blazicon component if PrependIcon is used (text size). </summary>
        public abstract string PrependIconContainer { get; }

        /// <summary>
        ///     Gets the base CSS classes for the input element (layout, rounding, border, padding, typography, focus
        ///     styles).
        /// </summary>
        public abstract string Input { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzNumberField{TValue}" /> component.
    /// </summary>
    public abstract class RzNumberFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzNumberFieldStylesBase" /> class. </summary>
        protected RzNumberFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzNumberField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }
    }

    #endregion

    #region RzQuickReference Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzQuickReference" /> component.
    /// </summary>
    public abstract class RzQuickReferenceStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzQuickReferenceStylesBase" /> class. </summary>
        protected RzQuickReferenceStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzQuickReference container div (base text color). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the title paragraph (margin, font weight). </summary>
        public abstract string Title { get; }

        /// <summary> Gets the CSS classes for the list (ul) element containing heading links (layout, gap). </summary>
        public abstract string List { get; }

        /// <summary> Gets the base CSS classes for individual list items (li). Indentation is applied separately. </summary>
        public abstract string ListItem { get; }

        /// <summary> Gets the base CSS classes for the anchor (a) tag linking to headings. </summary>
        public abstract string Link { get; }

        /// <summary> Gets the CSS class applied to the link when it corresponds to the currently highlighted heading. </summary>
        public abstract string LinkSelected { get; }

        /// <summary>
        ///     Gets the indentation CSS class (e.g., "ml-4") for a list item based on its heading level relative to the
        ///     minimum level shown.
        /// </summary>
        /// <param name="level">The heading level of the item.</param>
        /// <param name="minLevel">The minimum heading level being displayed in the quick reference.</param>
        /// <returns>A string representing a margin-left class.</returns>
        public abstract string GetIndentationCss(HeadingLevel level, HeadingLevel minLevel);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzQuickReferenceContainer" /> component.
    /// </summary>
    public abstract class RzQuickReferenceContainerStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzQuickReferenceContainerStylesBase" /> class. </summary>
        protected RzQuickReferenceContainerStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzQuickReferenceContainer div (usually none). </summary>
        public abstract string Container { get; }
    }

    #endregion

    #region RzRadio Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzRadioGroup{TValue}" /> container.
    /// </summary>
    public abstract class RzRadioGroupStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzRadioGroupStylesBase" /> class. </summary>
        protected RzRadioGroupStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzRadioGroup container div (layout, gap, padding). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the grid column CSS class based on the orientation and item count. </summary>
        /// <param name="orientation">The layout orientation.</param>
        /// <param name="itemCount">The number of radio items.</param>
        /// <returns>A string representing a grid columns class (e.g., "grid-cols-1").</returns>
        public abstract string GetGridColumnsCss(Orientation orientation, int itemCount);
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual <see cref="RzRadioGroupItem{TValue}" /> components.
    /// </summary>
    public abstract class RzRadioGroupItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzRadioGroupItemStylesBase" /> class. </summary>
        protected RzRadioGroupItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzRadioGroupItem label element (layout). </summary>
        public abstract string LabelWrapper { get; }

        /// <summary> Gets the CSS classes for the visually hidden radio input element. </summary>
        public abstract string RadioInput { get; }

        /// <summary> Gets the CSS classes for the check icon container span (positioning, appearance, transitions). </summary>
        public abstract string IconContainer { get; }

        /// <summary>
        ///     Gets the CSS classes for the main clickable container span (layout, cursor, rounding, border, padding, peer
        ///     states).
        /// </summary>
        public abstract string ClickableContainer { get; }

        /// <summary> Gets the CSS classes for the div containing the optional icon and text content (layout). </summary>
        public abstract string ContentWrapper { get; }

        /// <summary> Gets the CSS classes for the optional leading icon div (margin, typography). </summary>
        public abstract string LeadingIconContainer { get; }

        /// <summary> Gets the CSS classes for the span holding the label and description (layout, padding). </summary>
        public abstract string TextContainer { get; }

        /// <summary> Gets the CSS classes for the label text span (margin, typography). </summary>
        public abstract string LabelText { get; }

        /// <summary> Gets the CSS classes for the description text span (layout, typography). </summary>
        public abstract string DescriptionText { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzRadioGroupField{TValue}" /> component.
    /// </summary>
    public abstract class RzRadioGroupFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzRadioGroupFieldStylesBase" /> class. </summary>
        protected RzRadioGroupFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzRadioGroupField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }

        /// <summary>
        ///     Gets the CSS classes applied specifically to the <see cref="RzRadioGroup{TValue}" /> when it's rendered
        ///     inside this field container.
        /// </summary>
        public abstract string GroupWithinField { get; }
    }

    #endregion

    #region RzSidebar Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSidebar" /> component and layout.
    /// </summary>
    public abstract class RzSidebarStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSidebarStylesBase" /> class. </summary>
        protected RzSidebarStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the main RzSidebar container div (which holds the Alpine.js x-data). Usually
        ///     empty.
        /// </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the primary div containing both the sidebar (aside) and main content area (section). </summary>
        public abstract string LayoutContainer { get; }

        /// <summary> Gets the CSS classes for the screen reader skip link. </summary>
        public abstract string SkipLink { get; }

        /// <summary> Gets the CSS classes for the dark overlay div shown on mobile when the sidebar is open. </summary>
        public abstract string Overlay { get; }

        /// <summary>
        ///     Gets the base CSS classes for the aside element (sidebar container: positioning, width, overflow, background,
        ///     border, z-index, padding, transitions).
        /// </summary>
        public abstract string Sidebar { get; }

        /// <summary> Gets the CSS classes for the main content section element (padding-left offset, width, background). </summary>
        public abstract string MainContentContainer { get; }

        /// <summary> Gets the CSS classes for the inner div providing padding within the main content area. </summary>
        public abstract string MainContentPadding { get; }

        /// <summary> Gets the CSS classes for the floating toggle button used when no <see cref="RzNavbar" /> is provided. </summary>
        public abstract string FloatingToggleButton { get; }

        /// <summary> Gets the CSS 'top' positioning class for the sidebar based on whether a navbar is present. </summary>
        /// <param name="hasNavbar">True if a navbar is rendered within the sidebar.</param>
        /// <returns>A string like "top-16" or "top-0".</returns>
        public abstract string GetSidebarTopCss(bool hasNavbar);

        /// <summary> Gets the CSS top margin class for the main layout container based on whether a navbar is present. </summary>
        /// <param name="hasNavbar">True if a navbar is rendered within the sidebar.</param>
        /// <returns>A string like "mt-16" or "".</returns>
        public abstract string GetLayoutContainerTopCss(bool hasNavbar);

        /// <summary> Gets the CSS transform class for the sidebar's visibility state (used by Alpine.js binding). </summary>
        /// <param name="isVisible">True if the sidebar should be visible.</param>
        /// <returns>A string like "translate-x-0" or "-translate-x-60".</returns>
        public abstract string GetSidebarTranslationCss(bool isVisible);
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual items (<see cref="RzSidebarLinkItem" />) within the sidebar.
    /// </summary>
    public abstract class RzSidebarLinkItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSidebarLinkItemStylesBase" /> class. </summary>
        protected RzSidebarLinkItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the list item (li) when it represents a collapsible section. </summary>
        public abstract string CollapsibleListItem { get; }

        /// <summary> Gets the CSS classes for the inner div used within a collapsible list item. </summary>
        public abstract string CollapsibleInnerDiv { get; }

        /// <summary> Gets the base CSS classes for the button element used as the header for a collapsible section. </summary>
        public abstract string CollapsibleButton { get; }

        /// <summary> Gets the CSS classes for the icon container div within the collapsible button. </summary>
        public abstract string CollapsibleButtonIconContainer { get; }

        /// <summary> Gets the CSS classes for the title span within the collapsible button. </summary>
        public abstract string CollapsibleButtonTitle { get; }

        /// <summary> Gets the CSS classes for the trailer content div (e.g., badge) within the collapsible button. </summary>
        public abstract string CollapsibleButtonTrailer { get; }

        /// <summary> Gets the base CSS classes for the expand/collapse chevron icon. </summary>
        public abstract string CollapsibleButtonChevron { get; }

        /// <summary> Gets the CSS classes for the nested list (ul) containing child items within a collapsible section. </summary>
        public abstract string CollapsibleNestedList { get; }

        /// <summary> Gets the CSS classes for the list item (li) when it's a non-collapsible sub-item (indented style). </summary>
        public abstract string SubListItem { get; }

        /// <summary> Gets the CSS classes for the anchor (a) or div element used for a non-collapsible sub-item. </summary>
        public abstract string SubLinkOrDiv { get; }

        /// <summary> Gets the CSS classes for the list item (li) when it's a non-collapsible top-level item. </summary>
        public abstract string TopLevelListItem { get; }

        /// <summary> Gets the CSS classes for the div element used when a top-level item has children but is not collapsible. </summary>
        public abstract string TopLevelNonCollapsibleDiv { get; }

        /// <summary> Gets the CSS classes for the anchor (a) element used for a non-collapsible top-level item. </summary>
        public abstract string TopLevelLink { get; }

        /// <summary> Gets the CSS classes for the icon container div used within non-collapsible items. </summary>
        public abstract string ItemIconContainer { get; }

        /// <summary> Gets the CSS classes for the title span used within non-collapsible items. </summary>
        public abstract string ItemTitle { get; }

        /// <summary> Gets the CSS classes for the trailer content div used within non-collapsible items. </summary>
        public abstract string ItemTrailer { get; }

        /// <summary> Gets the CSS classes for the nested list (ul) used within non-collapsible items that have children. </summary>
        public abstract string NonCollapsibleNestedList { get; }

        /// <summary> Gets the CSS transform class (e.g., "rotate-180") for the chevron icon based on the expanded state. </summary>
        /// <param name="isExpanded">True if the collapsible section is expanded.</param>
        /// <returns>A string representing a rotation class.</returns>
        public abstract string GetChevronRotationCss(bool isExpanded);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSidebarLinks" /> container list.
    /// </summary>
    public abstract class RzSidebarLinksStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSidebarLinksStylesBase" /> class. </summary>
        protected RzSidebarLinksStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzSidebarLinks ul element (layout, spacing). </summary>
        public abstract string List { get; }
    }

    #endregion

    #region RzTab Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzTabs" /> container.
    /// </summary>
    public abstract class RzTabsStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTabsStylesBase" /> class. </summary>
        protected RzTabsStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzTabs container div (which holds Alpine.js x-data). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the div containing the TabPanels. </summary>
        public abstract string PanelsContainer { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzTabStrip" /> component.
    /// </summary>
    public abstract class RzTabStripStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTabStripStylesBase" /> class. </summary>
        protected RzTabStripStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzTabStrip container div (positioning, layout). </summary>
        public abstract string Strip { get; }

        /// <summary>
        ///     Gets the CSS classes for the tab marker div used for selection indication (positioning, size, transitions,
        ///     pseudo-element setup).
        /// </summary>
        public abstract string Marker { get; }

        /// <summary> Gets the CSS classes for the inner div within the marker. </summary>
        public abstract string MarkerInner { get; }

        /// <summary> Gets the grid columns CSS class based on the number of tabs. </summary>
        /// <param name="tabCount">The number of tabs.</param>
        /// <returns>A string representing a grid columns class (e.g., "grid-cols-3").</returns>
        public abstract string GetColumnsCss(int tabCount);

        /// <summary> Gets the gap CSS class based on the specified spacing size. </summary>
        /// <param name="spaceBetween">The desired gap size.</param>
        /// <returns>A string representing a gap class (e.g., "gap-2").</returns>
        public abstract string GetGapCss(Size spaceBetween);

        /// <summary> Gets the background color class for the marker's ::after pseudo-element based on the specified SemanticColor. </summary>
        /// <param name="color">The semantic color for the marker underline.</param>
        /// <returns>A string representing a background color class prefixed with 'after:' (e.g., "after:bg-primary").</returns>
        public abstract string GetMarkerAfterBackgroundCss(SemanticColor color);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzTab" /> button component.
    /// </summary>
    public abstract class RzTabStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTabStylesBase" /> class. </summary>
        protected RzTabStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzTab button element (positioning, layout, size, cursor, whitespace,
        ///     rounding, typography, transitions).
        /// </summary>
        public abstract string Button { get; }

        /// <summary> Gets the justification CSS class based on the Justify enum. </summary>
        /// <param name="justify">The desired justification.</param>
        /// <returns>A string representing a justify-content class (e.g., "justify-center").</returns>
        public abstract string GetJustifyCss(Justify justify);

        /// <summary> Gets the text color CSS class for the tab in its non-selected state. </summary>
        /// <param name="color">The semantic color specified by the parent RzTabs.</param>
        /// <returns>A string representing a text color class.</returns>
        public abstract string GetTextColorCss(SemanticColor color);

        /// <summary> Gets the background color CSS class for the tab in its non-selected state. </summary>
        /// <param name="color">The semantic color specified by the parent RzTabs.</param>
        /// <returns>A string representing a background color class.</returns>
        public abstract string GetBackgroundColorCss(SemanticColor color);
        // Note: Selected text color is handled dynamically via Alpine :class binding based on RzTabs parameter
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzTabPanel" /> component.
    /// </summary>
    public abstract class RzTabPanelStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTabPanelStylesBase" /> class. </summary>
        protected RzTabPanelStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the outer container div of the RzTabPanel (positioning). </summary>
        public abstract string OuterContainer { get; }

        /// <summary>
        ///     Gets the base CSS classes for the inner content div of the RzTabPanel (padding/background are often applied
        ///     via attributes).
        /// </summary>
        public abstract string InnerContainer { get; }

        /// <summary> Gets the text color CSS class, typically inherited from the parent RzTabs component. </summary>
        /// <param name="color">The semantic text color specified by the parent RzTabs.</param>
        /// <returns>A string representing a text color class.</returns>
        public abstract string GetTextColorCss(SemanticColor color);
    }

    #endregion

    #region RzText Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzTextEdit" /> component.
    /// </summary>
    public abstract class RzTextEditStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTextEditStylesBase" /> class. </summary>
        protected RzTextEditStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the relative div wrapping the input and optional prepend element. </summary>
        public abstract string InputWrapper { get; }

        /// <summary>
        ///     Gets the CSS classes for the prepend element div (positioning, layout, padding, border, background,
        ///     typography).
        /// </summary>
        public abstract string PrependElement { get; }

        /// <summary> Gets the CSS classes for the Blazicon component if PrependIcon is used (text size). </summary>
        public abstract string PrependIconContainer { get; }

        /// <summary>
        ///     Gets the base CSS classes for the input element (layout, rounding, border, padding, typography, focus styles,
        ///     initial transition state).
        /// </summary>
        public abstract string Input { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzTextField" /> component.
    /// </summary>
    public abstract class RzTextFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTextFieldStylesBase" /> class. </summary>
        protected RzTextFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzTextField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }
    }

    #endregion

    #region RzToggle Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzToggle" /> switch component.
    /// </summary>
    public abstract class RzToggleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzToggleStylesBase" /> class. </summary>
        protected RzToggleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzToggle input (checkbox) element, including base appearance, ::before
        ///     pseudo-element styles, and checked state styles.
        /// </summary>
        public abstract string Toggle { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzToggleField" /> component.
    /// </summary>
    public abstract class RzToggleFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzToggleFieldStylesBase" /> class. </summary>
        protected RzToggleFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzToggleField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }

        /// <summary> Gets the CSS classes for the div containing the label and toggle switch (layout). </summary>
        public abstract string ContentWrapper { get; }

        /// <summary> Gets the CSS classes for the inner div structuring the label and toggle (layout, alignment). </summary>
        public abstract string InnerWrapper { get; }

        /// <summary> Gets the CSS classes for the <see cref="RzFieldLabel{TValue}" /> component when used within this field. </summary>
        public abstract string LabelInField { get; }

        /// <summary> Gets the CSS classes for the <see cref="RzToggle" /> component when used within this field (usually empty). </summary>
        public abstract string ToggleInField { get; }

        /// <summary> Gets the CSS classes for the Description span within the label. </summary>
        public abstract string DescriptionInLabel { get; }
    }

    #endregion
}