using System.Diagnostics.CodeAnalysis;

namespace RizzyUI;

public enum AlertVariant
{
    Information,
    Success,
    Warning,
    Danger,
}

public enum BadgeVariant
{
    Default,
    Secondary,
    Outline,
    Success,
    Info,
    Warning,
    Destructive,
}

public enum ButtonVariant
{
    Default,
    Primary,
    Secondary,
    Alternate,
    Inverse,
    Information,
    Danger,
    Warning,
    Success,
    Ghost
}

public enum Size
{
    ExtraSmall,
    Small,
    Medium,
    Large,
    ExtraLarge
}

public enum Justify
{
    Start,
    Center,
    End
}

public enum AvatarShape
{
    Circle,
    Square
}

[SuppressMessage("ReSharper", "InconsistentNaming")]
public enum ModalSize
{
	ExtraSmall,  // max-w-xs (320px)
	Small,       // max-w-sm (384px)
	Medium,      // max-w-md (448px)
	Large,       // max-w-lg (512px)
	ExtraLarge,  // max-w-xl (576px)
	TwoXL,       // max-w-2xl (672px)
	ThreeXL,     // max-w-3xl (768px)
	FourXL,      // max-w-4xl (896px)
	FiveXL,      // max-w-5xl (1024px)
	SixXL,       // max-w-6xl (1152px)
	SevenXL      // max-w-7xl (1280px)
}

public enum Color
{
    // Surface Colors
    Surface,
    OnSurface,
    OnSurfaceStrong,
    SurfaceAlt,
    Primary,
    OnPrimary,
    Secondary,
    OnSecondary,
    Outline,
    OutlineStrong,

    // Status Colors
    Danger,
    OnDanger,
    Info,
    OnInfo,
    Warning,
    OnWarning,
    Success,
    OnSuccess
}

public enum AccentColor
{
    Inherit, // no accent color
    Gray,
    Emerald,
    Teal,
    Blue,
    Indigo,
    Purple,
    Pink,
    Red,
    Orange,
    Yellow
}

public enum ProgressBarSize
{
    Tiny,
    Small,
    Normal,
    Large
}

public enum ProgressBarColor
{
    Primary,
    Red,
    Orange,
    Emerald,
}
