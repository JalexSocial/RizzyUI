using System.Diagnostics.CodeAnalysis;

namespace RizzyUI;

public enum AlertVariant
{
    Default,
    Success,
    Info,
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

public enum ButtonSize
{
    ExtraSmall,
    Small,
    Medium,
    Large,
    ExtraLarge
}

public enum AvatarVariant
{
    Default,
    Rounded
}

public enum AvatarSize
{
    ExtraSmall,
    Small,
    Medium,
    Large,
    ExtraLarge
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

public enum PillColor
{
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

public class IndicatorColor
{
    private readonly string _classes;

    private IndicatorColor(string classes)
    {
        _classes = classes;
    }

    public static IndicatorColor Gray => new("bg-gray-500");
    public static IndicatorColor Yellow => new("bg-yellow-500");
    public static IndicatorColor Red => new("bg-red-500");
    public static IndicatorColor Blue => new("bg-blue-500");
    public static IndicatorColor Green => new("bg-emerald-500");

    public string Value => _classes;

    public override string ToString()
    {
        return _classes;
    }
}