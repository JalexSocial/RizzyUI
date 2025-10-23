
namespace RizzyUI;

/// <summary>
///     Variants for alert components, defining their visual appearance.
/// </summary>
public enum AlertVariant
{
    /// <summary>
    ///     Alert using the alternate background color
    /// </summary>
    Alternate,

    /// <summary>Informational alert, typically blue or neutral.</summary>
    Information,

    /// <summary>Success alert, often green to indicate positive feedback.</summary>
    Success,

    /// <summary>Warning alert, often yellow to indicate caution.</summary>
    Warning,

    /// <summary>Destructive alert, often red to indicate errors or critical issues.</summary>
    Destructive
}

/// <summary>
///     Variants for badge components, defining their style and context.
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
    Destructive
}

/// <summary>
///     Variants for button components, defining their appearance and purpose.
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
    Accent,

    /// <summary>Inverse button styling for dark backgrounds.</summary>
    Inverse,

    /// <summary>Information button, typically blue for neutral actions.</summary>
    Information,

    /// <summary>Destructive button, often red for critical actions.</summary>
    Destructive,

    /// <summary>Warning button, often yellow for cautionary actions.</summary>
    Warning,

    /// <summary>Success button, often green for positive actions.</summary>
    Success,

    /// <summary>Ghost button for minimal and subtle interactions.</summary>
    Ghost
}

/// <summary>
///     Appearance option for divider
/// </summary>
public enum SeparatorStyle
{
    /// <summary>
    ///     Solid line
    /// </summary>
    Solid,

    /// <summary>
    ///     Dashed line
    /// </summary>
    Dashed,

    /// <summary>
    ///     Dotted line
    /// </summary>
    Dotted
}

/// <summary>
///     Size options for various components to define their dimensions.
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
///     Defines available width options for prose content, measured in approximate characters per line (CPL).
/// </summary>
public enum ProseWidth
{
    /// <summary>
    ///     A compact width, approximately 56 characters per line.
    ///     Best for sidebars, footnotes, or narrow content blocks.
    /// </summary>
    Compact,

    /// <summary>
    ///     A comfortable width, approximately 64 characters per line.
    ///     Ideal for general prose readability in documentation and articles.
    /// </summary>
    Comfortable,

    /// <summary>
    ///     A relaxed width, approximately 72 characters per line.
    ///     Provides more space while maintaining good readability.
    /// </summary>
    Relaxed,

    /// <summary>
    ///     A wide width, approximately 80 characters per line.
    ///     Suitable for blog posts, long-form content, and expanded reading areas.
    /// </summary>
    Wide,

    /// <summary>
    ///     An ultrawide width, approximately 100 characters per line.
    ///     Best for technical documentation, research papers, or code-heavy content.
    /// </summary>
    UltraWide,

    /// <summary>
    ///     No maximum width constraint.
    ///     Useful for tables, charts, or content requiring full-width display.
    /// </summary>
    Full
}

/// <summary>
///     Justification options for layout alignment.
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
///     Alignment options.
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
///     Anchor point options
/// </summary>
public enum AnchorPoint
{
    /// <summary>
    ///     Anchor to top start
    /// </summary>
    TopStart,

    /// <summary>
    ///     Anchor to top with center-alignment
    /// </summary>
    Top,

    /// <summary>
    ///     Anchor to top end
    /// </summary>
    TopEnd,

    /// <summary>
    ///     Anchor to left start
    /// </summary>
    LeftStart,

    /// <summary>
    /// Anchor to left middle
    /// </summary>
    Left,

    /// <summary>
    /// Anchor to left end
    /// </summary>
    LeftEnd,

    /// <summary>
    ///     Anchor to right start
    /// </summary>
    RightStart,

    /// <summary>
    /// Anchor to right middle
    /// </summary>
    Right,

    /// <summary>
    /// Anchor to right end
    /// </summary>
    RightEnd,

    /// <summary>
    ///     Anchor to bottom start
    /// </summary>
    BottomStart,

    /// <summary>
    ///     Anchor to bottom
    /// </summary>
    Bottom,

    /// <summary>
    ///     Anchor to bottom end
    /// </summary>
    BottomEnd
}

/// <summary>
///     Specifies the origin point for transformations.
/// </summary>
public enum OriginPoint
{
    /// <summary>
    ///     Origin at the center.
    /// </summary>
    OriginCenter,

    /// <summary>
    ///     Origin at the top.
    /// </summary>
    OriginTop,

    /// <summary>
    ///     Origin at the top-right.
    /// </summary>
    OriginTopRight,

    /// <summary>
    ///     Origin at the right.
    /// </summary>
    OriginRight,

    /// <summary>
    ///     Origin at the bottom-right.
    /// </summary>
    OriginBottomRight,

    /// <summary>
    ///     Origin at the bottom.
    /// </summary>
    OriginBottom,

    /// <summary>
    ///     Origin at the bottom-left.
    /// </summary>
    OriginBottomLeft,

    /// <summary>
    ///     Origin at the left.
    /// </summary>
    OriginLeft,

    /// <summary>
    ///     Origin at the top-left.
    /// </summary>
    OriginTopLeft
}

/// <summary>
///     Shape options for avatar components.
/// </summary>
public enum AvatarShape
{
    /// <summary>Circle-shaped avatar.</summary>
    Circle,

    /// <summary>Square-shaped avatar.</summary>
    Square
}

/// <summary>
///     Size options for modal components based on Tailwind's max-width utilities.
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
///     SemanticColor options for components, including surface and status colors.
/// </summary>
public enum SemanticColor
{
    /// <summary>No specific semantic color is applied; typically inherits or uses a component default.</summary>
    None,

    /// <summary>General page background color (maps to --background in kitchen sink).</summary>
    Background,

    /// <summary>General page foreground/text color (maps to --foreground).</summary>
    Foreground,

    /// <summary>Background color for card components (maps to --card).</summary>
    Card,

    /// <summary>Foreground/text color for content on card components (maps to --card-foreground).</summary>
    CardForeground,

    /// <summary>Background color for popover components (maps to --popover).</summary>
    Popover,

    /// <summary>Foreground/text color for content on popover components (maps to --popover-foreground).</summary>
    PopoverForeground,

    /// <summary>Primary accent color, typically for interactive elements (maps to --primary).</summary>
    Primary,

    /// <summary>Foreground/text color for content on primary-colored elements (maps to --primary-foreground).</summary>
    PrimaryForeground,

    /// <summary>Secondary accent color (maps to --secondary).</summary>
    Secondary,

    /// <summary>Foreground/text color for content on secondary-colored elements (maps to --secondary-foreground).</summary>
    SecondaryForeground,

    /// <summary>Color for muted surfaces or backgrounds (maps to --muted).</summary>
    Muted,

    /// <summary>Foreground/text color for content on muted surfaces (maps to --muted-foreground).</summary>
    MutedForeground,

    /// <summary>Color for accented surfaces or backgrounds (maps to --accent).</summary>
    Accent,

    /// <summary>Foreground/text color for content on accented surfaces (maps to --accent-foreground).</summary>
    AccentForeground,

    /// <summary>Color for destructive actions or elements, indicating errors or critical operations (maps to --destructive).</summary>
    Destructive,

    /// <summary>Foreground/text color for content on destructive-colored elements (maps to an implied --destructive-foreground).</summary>
    DestructiveForeground,

    /// <summary>Color for borders (maps to --border).</summary>
    Border,

    /// <summary>Color for input backgrounds or borders (maps to --input).</summary>
    Input,

    /// <summary>Color for focus rings (maps to --ring).</summary>
    Ring,

    /// <summary>Informational color, often blue or neutral.</summary>
    Info,

    /// <summary>Foreground color on info background.</summary>
    InfoForeground,

    /// <summary>Warning color, often yellow for caution.</summary>
    Warning,

    /// <summary>Foreground color on warning background.</summary>
    WarningForeground,

    /// <summary>Success color, often green for positive feedback.</summary>
    Success,

    /// <summary>Foreground color on success background.</summary>
    SuccessForeground
}

/// <summary>
///     Accent color options for highlighting elements.
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
///     Defines the status color variants
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

    /// <summary>Destructive status color.</summary>
    Destructive
}

/// <summary>
///     Defines the label position options for the Progress component.
/// </summary>
public enum ProgressLabelPosition
{
    /// <summary>Label is positioned inside the progress bar.</summary>
    Inside,

    /// <summary>Label is positioned outside the progress bar.</summary>
    Outside
}

/// <summary>
/// Specifies the type of behavior for accordion components, determining whether single or multiple sections can be expanded simultaneously.
/// </summary>
public enum AccordionType
{
    /// <summary>
    /// An accordion type where only a single section can be expanded at a time.
    /// </summary>
    Single,

    /// <summary>
    /// Allows multiple sections of the accordion to be expanded at the same time.
    /// </summary>
    Multiple
}

/// <summary>
/// Specifies the visual variant of the sidebar.
/// </summary>
public enum SidebarVariant
{
    /// <summary>
    /// Default docked sidebar.
    /// </summary>
    Sidebar,
    /// <summary>
    /// Floating sidebar with a margin from the viewport edges.
    /// </summary>
    Floating,
    /// <summary>
    /// Inset sidebar where the main content flows around it.
    /// </summary>
    Inset
}

/// <summary>
/// Specifies the collapsible behavior of the sidebar.
/// </summary>
public enum SidebarCollapsible
{
    /// <summary>
    /// The sidebar slides off-canvas on mobile and can be collapsed on desktop.
    /// </summary>
    OffCanvas,
    /// <summary>
    /// The sidebar collapses to show only icons.
    /// </summary>
    Icon,
    /// <summary>
    /// The sidebar is not collapsible.
    /// </summary>
    None
}

/// <summary>
/// Specifies the side of the screen where the sidebar appears.
/// </summary>
public enum SidebarSide
{
    /// <summary>
    /// The sidebar appears on the left.
    /// </summary>
    Left,
    /// <summary>
    /// The sidebar appears on the right.
    /// </summary>
    Right
}

/// <summary>
/// Specifies the visual variant for a sidebar menu button.
/// </summary>
public enum SidebarMenuButtonVariant
{
    /// <summary>
    /// Default styling.
    /// </summary>
    Default,
    /// <summary>
    /// Outline styling.
    /// </summary>
    Outline
}