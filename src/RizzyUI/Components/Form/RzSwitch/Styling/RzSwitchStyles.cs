
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a RzSwitch component.
/// </summary>
public interface IHasRzSwitchStylingProperties { }

/// <summary>
/// Defines the slots available for styling in the RzSwitch component.
/// </summary>
public sealed partial class RzSwitchSlots : ISlots
{
    /// <summary>
    /// The base slot for the main switch wrapper.
    /// </summary>
    [Slot("switch-wrapper")]
    public string? Base { get; set; }

    /// <summary>
    /// The slot for the hidden input element.
    /// </summary>
    [Slot("input")]
    public string? Input { get; set; }

    /// <summary>
    /// The slot for the visible track of the switch.
    /// </summary>
    [Slot("track")]
    public string? Track { get; set; }

    /// <summary>
    /// The slot for the thumb (the sliding part) of the switch.
    /// </summary>
    [Slot("thumb")]
    public string? Thumb { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzSwitch component.
/// </summary>
public static class RzSwitchStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzSwitch component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzSwitchSlots>, RzSwitchSlots> DefaultDescriptor = new(
        @base: "group relative inline-flex items-center",
        slots: new()
        {
            [s => s.Input] = "peer sr-only",
            [s => s.Track] = 
                "cursor-pointer " +
                "inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none " +
                "bg-input dark:bg-input/80 " + // Default unchecked background
                "peer-checked:bg-primary " + // Checked background
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " +
                // Thumb position logic applied to track to target child span
                "peer-checked:[&>span]:translate-x-[calc(100%-2px)] " +
                // Thumb dark mode color logic applied to track to target child span
                "dark:peer-checked:[&>span]:bg-primary-foreground",
            
            [s => s.Thumb] = 
                "pointer-events-none block size-4 rounded-full ring-0 shadow-sm transition-transform " +
                "bg-background dark:bg-foreground " + // Default thumb color
                "translate-x-0" // Default position
        }
    );
}