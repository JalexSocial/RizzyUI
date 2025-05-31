
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
///     Defines a color theme variant (e.g., light or dark) with properties mapping to CSS custom properties.
/// </summary>
public class RzThemeVariant
{
    /// <summary>General page background color (maps to --background).</summary>
    public Color Background { get; init; }
    /// <summary>General page foreground/text color (maps to --foreground).</summary>
    public Color Foreground { get; init; }

    /// <summary>Background color for card components (maps to --card).</summary>
    public Color Card { get; init; } // Renamed from CardBackground for brevity
    /// <summary>Foreground/text color for content on card components (maps to --card-foreground).</summary>
    public Color CardForeground { get; init; }

    /// <summary>Background color for popover components (maps to --popover).</summary>
    public Color Popover { get; init; } // Renamed from PopoverBackground
    /// <summary>Foreground/text color for content on popover components (maps to --popover-foreground).</summary>
    public Color PopoverForeground { get; init; }

    /// <summary>Primary accent color (maps to --primary).</summary>
    public Color Primary { get; init; }
    /// <summary>Foreground/text color for content on primary-colored elements (maps to --primary-foreground).</summary>
    public Color PrimaryForeground { get; init; }

    /// <summary>Secondary accent color (maps to --secondary).</summary>
    public Color Secondary { get; init; }
    /// <summary>Foreground/text color for content on secondary-colored elements (maps to --secondary-foreground).</summary>
    public Color SecondaryForeground { get; init; }

    /// <summary>Color for muted surfaces or backgrounds (maps to --muted).</summary>
    public Color Muted { get; init; } // Renamed from MutedBackground
    /// <summary>Foreground/text color for content on muted surfaces (maps to --muted-foreground).</summary>
    public Color MutedForeground { get; init; }

    /// <summary>Color for accented surfaces or backgrounds (maps to --accent).</summary>
    public Color Accent { get; init; } // Renamed from AccentBackground
    /// <summary>Foreground/text color for content on accented surfaces (maps to --accent-foreground).</summary>
    public Color AccentForeground { get; init; }

    /// <summary>Color for destructive actions or elements (maps to --destructive).</summary>
    public Color Destructive { get; init; }
    /// <summary>Foreground/text color for content on destructive-colored elements (maps to an implied --destructive-foreground, often white or a light color).</summary>
    public Color DestructiveForeground { get; init; }

    /// <summary>Color for borders (maps to --border).</summary>
    public Color Border { get; init; }
    /// <summary>Color for input backgrounds or borders (maps to --input).</summary>
    public Color Input { get; init; } // Renamed from InputBackground
    /// <summary>Color for focus rings (maps to --ring).</summary>
    public Color Ring { get; init; }
    
    // Status colors are now part of RzThemeVariant to align with kitchen sink's light/dark definitions for --destructive
    // Other status colors (Info, Warning, Success) might still be defined globally if they don't have distinct light/dark CSS vars in kitchen sink
    // For now, assuming they are part of RzThemeVariant for consistency, but their actual values might be the same for light/dark if not specified otherwise by kitchen sink.

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


    /// <summary>The code highlighting theme for this variant.</summary>
    public RizzyCodeTheme Code { get; init; }
}