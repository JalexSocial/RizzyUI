#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
///     Defines a base shared color theme
/// </summary>
public class RzThemeVariant
{
    /// <summary>
    ///     Gets the surface background color
    /// </summary>
    public Color Background { get; init; }

    /// <summary>
    ///     Gets the color used for content displayed on the surface.
    /// </summary>
    public Color Foreground { get; init; }

    /// <summary>
    ///     Gets the card background color.
    /// </summary>
    public Color Card { get; init; }

    /// <summary>
    ///     Gets the card foreground color.
    /// </summary>
    public Color CardForeground { get; init; }
    
    /// <summary>
    ///     Gets the popover background color.
    /// </summary>
    public Color Popover { get; init; }

    /// <summary>
    ///     Gets the popover foreground color.
    /// </summary>
    public Color PopoverForeground { get; init; }
    
    /// <summary>
    ///     Gets the color used for muted background elements.
    /// </summary>
    public Color Muted { get; init; }
    
    /// <summary>
    ///     Gets the color used for disabled or inactive text elements.
    /// </summary>
    public Color MutedForeground { get; init; }

   
    /// <summary>
    ///     Gets the accent surface background color.
    /// </summary>
    public Color Accent { get; init; }

    /// <summary>
    ///     Gets the color used for content displayed on the accent surface.
    /// </summary>
    public Color AccentForeground { get; init; }

    /// <summary>
    ///     Gets the primary brand color.
    /// </summary>
    public Color Primary { get; init; }

    /// <summary>
    ///     Gets the color used for content displayed on the primary color.
    /// </summary>
    public Color PrimaryForeground { get; init; }

    /// <summary>
    ///     Gets the secondary brand color.
    /// </summary>
    public Color Secondary { get; init; }

    /// <summary>
    ///     Gets the color used for content displayed on the secondary color.
    /// </summary>
    public Color SecondaryForeground { get; init; }

    /// <summary>
    ///     Gets the outline color used for borders and dividers.
    /// </summary>
    public Color Border { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate dangerous states or error conditions.
    /// </summary>
    public Color Danger { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Danger" /> background.
    /// </summary>
    public Color DangerForeground { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for informational messages or states.
    /// </summary>
    public Color Info { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on an <see cref="Info" /> background.
    /// </summary>
    public Color InfoForeground { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate warning or cautionary states.
    /// </summary>
    public Color Warning { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Warning" /> background.
    /// </summary>
    public Color WarningForeground { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate success or positive states.
    /// </summary>
    public Color Success { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Success" /> background.
    /// </summary>
    public Color SuccessForeground { get; init; }

    /// <summary>
    ///     Gets the code theme for this variant
    /// </summary>
    public RizzyCodeTheme Code { get; init; }
}