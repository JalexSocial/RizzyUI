using System.Diagnostics.CodeAnalysis;

namespace RizzyUI;

/// <summary>
/// Variants for alert components, defining their visual appearance.
/// </summary>
public enum AlertVariant
{
    /// <summary>
    /// Alert using the alternate background color
    /// </summary>
    Alternate,
    /// <summary>Informational alert, typically blue or neutral.</summary>
    Information,
    /// <summary>Success alert, often green to indicate positive feedback.</summary>
    Success,
    /// <summary>Warning alert, often yellow to indicate caution.</summary>
    Warning,
    /// <summary>Danger alert, often red to indicate errors or critical issues.</summary>
    Danger,
}

/// <summary>
/// Variants for badge components, defining their style and context.
/// </summary>
public enum BadgeVariant
{
    /// <summary>Default badge styling.</summary>
    Default,
    /// <summary>Secondary badge, typically for less emphasized content.</summary>
    Secondary,
    /// <summary>Outlined badge for a minimal look.</summary>
    Outline,
    /// <summary>Success badge, often green for positive actions or states.</summary>
    Success,
    /// <summary>Informational badge, often blue or neutral.</summary>
    Info,
    /// <summary>Warning badge, often yellow for caution.</summary>
    Warning,
    /// <summary>Destructive badge, often red to indicate critical actions.</summary>
    Destructive,
}

/// <summary>
/// Variants for button components, defining their appearance and purpose.
/// </summary>
public enum ButtonVariant
{
    /// <summary>Default button styling.</summary>
    Default,
    /// <summary>Primary button for main actions, often bold and attention-grabbing.</summary>
    Primary,
    /// <summary>Secondary button for supporting actions.</summary>
    Secondary,
    /// <summary>Alternate button styling for varied contexts.</summary>
    Alternate,
    /// <summary>Inverse button styling for dark backgrounds.</summary>
    Inverse,
    /// <summary>Information button, typically blue for neutral actions.</summary>
    Information,
    /// <summary>Danger button, often red for critical actions.</summary>
    Danger,
    /// <summary>Warning button, often yellow for cautionary actions.</summary>
    Warning,
    /// <summary>Success button, often green for positive actions.</summary>
    Success,
    /// <summary>Ghost button for minimal and subtle interactions.</summary>
    Ghost
}

/// <summary>
/// Appearance option for divider
/// </summary>
public enum DividerStyle
{
    /// <summary>
    /// Solid line
    /// </summary>
    Solid,
    /// <summary>
    /// Dashed line
    /// </summary>
    Dashed,
    /// <summary>
    /// Dotted line
    /// </summary>
    Dotted
}

/// <summary>
/// Size options for various components to define their dimensions.
/// </summary>
public enum Size
{
    /// <summary>Extra small size, for compact components.</summary>
    ExtraSmall,
    /// <summary>Small size, smaller than the default.</summary>
    Small,
    /// <summary>Medium size, the default size.</summary>
    Medium,
    /// <summary>Large size, for bigger components.</summary>
    Large,
    /// <summary>Extra large size, for oversized components.</summary>
    ExtraLarge
}

/// <summary>
/// Defines available width options for prose content, measured in approximate characters per line (CPL).
/// </summary>
public enum ProseWidth
{
    /// <summary>
    /// A compact width, approximately 56 characters per line. 
    /// Best for sidebars, footnotes, or narrow content blocks.
    /// </summary>
    Compact,

    /// <summary>
    /// A comfortable width, approximately 64 characters per line.
    /// Ideal for general prose readability in documentation and articles.
    /// </summary>
    Comfortable,

    /// <summary>
    /// A relaxed width, approximately 72 characters per line.
    /// Provides more space while maintaining good readability.
    /// </summary>
    Relaxed,

    /// <summary>
    /// A wide width, approximately 80 characters per line.
    /// Suitable for blog posts, long-form content, and expanded reading areas.
    /// </summary>
    Wide,

    /// <summary>
    /// An ultrawide width, approximately 100 characters per line.
    /// Best for technical documentation, research papers, or code-heavy content.
    /// </summary>
    UltraWide,

    /// <summary>
    /// No maximum width constraint. 
    /// Useful for tables, charts, or content requiring full-width display.
    /// </summary>
    Full
}

/// <summary>
/// Justification options for layout alignment.
/// </summary>
public enum Justify
{
    /// <summary>Align items to the start.</summary>
    Start,
    /// <summary>Center align items.</summary>
    Center,
    /// <summary>Align items to the end.</summary>
    End
}

/// <summary>
/// Alignment options.
/// </summary>
public enum Align
{
    /// <summary>Align items to the start.</summary>
    Start,
    /// <summary>Center align items.</summary>
    Center,
    /// <summary>Align items to the end.</summary>
    End
}

/// <summary>
/// Anchor point options
/// </summary>
public enum AnchorPoint
{
    /// <summary>
    /// Anchor to top start 
    /// </summary>
    TopStart,

    /// <summary>
    /// Anchor to top with center-alignment
    /// </summary>
    TopCenter,

    /// <summary>
    /// Anchor to top end
    /// </summary>
    TopEnd,

    /// <summary>
    /// Anchor to Start middle
    /// </summary>
    Start,

    /// <summary>
    /// Anchor to end middle
    /// </summary>
    End,

    /// <summary>
    /// Anchor to bottom end
    /// </summary>
    BottomEnd,

    /// <summary>
    /// Anchor to bottom start
    /// </summary>
    BottomStart,

    /// <summary>
    /// Anchor to bottom center
    /// </summary>
    BottomCenter
}

/// <summary>
/// Specifies the origin point for transformations.
/// </summary>
public enum OriginPoint
{
	/// <summary>
	/// Origin at the center.
	/// </summary>
	OriginCenter,

	/// <summary>
	/// Origin at the top.
	/// </summary>
	OriginTop,

	/// <summary>
	/// Origin at the top-right.
	/// </summary>
	OriginTopRight,

	/// <summary>
	/// Origin at the right.
	/// </summary>
	OriginRight,

	/// <summary>
	/// Origin at the bottom-right.
	/// </summary>
	OriginBottomRight,

	/// <summary>
	/// Origin at the bottom.
	/// </summary>
	OriginBottom,

	/// <summary>
	/// Origin at the bottom-left.
	/// </summary>
	OriginBottomLeft,

	/// <summary>
	/// Origin at the left.
	/// </summary>
	OriginLeft,

	/// <summary>
	/// Origin at the top-left.
	/// </summary>
	OriginTopLeft
}


/// <summary>
/// Shape options for avatar components.
/// </summary>
public enum AvatarShape
{
    /// <summary>Circle-shaped avatar.</summary>
    Circle,
    /// <summary>Square-shaped avatar.</summary>
    Square
}

/// <summary>
/// Size options for modal components based on Tailwind's max-width utilities.
/// </summary>
[SuppressMessage("ReSharper", "InconsistentNaming")]
public enum ModalSize
{
    /// <summary>Extra small modal, max-width: 320px.</summary>
    ExtraSmall,
    /// <summary>Small modal, max-width: 384px.</summary>
    Small,
    /// <summary>Medium modal, max-width: 448px.</summary>
    Medium,
    /// <summary>Large modal, max-width: 512px.</summary>
    Large,
    /// <summary>Extra large modal, max-width: 576px.</summary>
    ExtraLarge,
    /// <summary>2XL modal, max-width: 672px.</summary>
    TwoXL,
    /// <summary>3XL modal, max-width: 768px.</summary>
    ThreeXL,
    /// <summary>4XL modal, max-width: 896px.</summary>
    FourXL,
    /// <summary>5XL modal, max-width: 1024px.</summary>
    FiveXL,
    /// <summary>6XL modal, max-width: 1152px.</summary>
    SixXL,
    /// <summary>7XL modal, max-width: 1280px.</summary>
    SevenXL
}

/// <summary>
/// SemanticColor options for components, including surface and status colors.
/// </summary>
public enum SemanticColor
{
    /// <summary>No color specified.</summary>
    None,
    /// <summary>Surface color, typically for backgrounds.</summary>
    Surface,
    /// <summary>Foreground color on surface.</summary>
    OnSurface,
    /// <summary>Strong foreground color on surface.</summary>
    OnSurfaceStrong,
    /// <summary>Alternate surface color for secondary areas.</summary>
    SurfaceAlt,
    /// <summary>Primary color for highlights or accents.</summary>
    Primary,
    /// <summary>Foreground color on primary background.</summary>
    OnPrimary,
    /// <summary>Secondary color for less emphasized elements.</summary>
    Secondary,
    /// <summary>Foreground color on secondary background.</summary>
    OnSecondary,
    /// <summary>Outline color for borders or separators.</summary>
    Outline,
    /// <summary>Strong outline color for emphasis.</summary>
    OutlineStrong,
    /// <summary>Danger color, often red for errors.</summary>
    Danger,
    /// <summary>Foreground color on danger background.</summary>
    OnDanger,
    /// <summary>Informational color, often blue or neutral.</summary>
    Info,
    /// <summary>Foreground color on info background.</summary>
    OnInfo,
    /// <summary>Warning color, often yellow for caution.</summary>
    Warning,
    /// <summary>Foreground color on warning background.</summary>
    OnWarning,
    /// <summary>Success color, often green for positive feedback.</summary>
    Success,
    /// <summary>Foreground color on success background.</summary>
    OnSuccess
}

/// <summary>
/// Accent color options for highlighting elements.
/// </summary>
public enum AccentColor
{
    /// <summary>Inherit accent color from parent context.</summary>
    Inherit,
    /// <summary>Gray accent color.</summary>
    Gray,
    /// <summary>Emerald green accent color.</summary>
    Emerald,
    /// <summary>Teal accent color.</summary>
    Teal,
    /// <summary>Blue accent color.</summary>
    Blue,
    /// <summary>Indigo accent color.</summary>
    Indigo,
    /// <summary>Purple accent color.</summary>
    Purple,
    /// <summary>Pink accent color.</summary>
    Pink,
    /// <summary>Red accent color.</summary>
    Red,
    /// <summary>Orange accent color.</summary>
    Orange,
    /// <summary>Yellow accent color.</summary>
    Yellow
}

/// <summary>
/// Defines the status color variants
/// </summary>
public enum StatusColor
{
    /// <summary>Primary status color.</summary>
    Primary,

    /// <summary>Secondary status color.</summary>
    Secondary,

    /// <summary>Success status color.</summary>
    Success,

    /// <summary>Info status color.</summary>
    Info,

    /// <summary>Warning status color.</summary>
    Warning,

    /// <summary>Danger status color.</summary>
    Danger
}

/// <summary>
/// Defines the label position options for the Progress component.
/// </summary>
public enum ProgressLabelPosition
{
    /// <summary>Label is positioned inside the progress bar.</summary>
    Inside,

    /// <summary>Label is positioned outside the progress bar.</summary>
    Outside
}

