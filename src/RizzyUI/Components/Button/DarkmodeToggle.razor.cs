using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class DarkmodeToggle : RizzyComponent
{
    /// <summary>
    /// Icon shown when dark mode is OFF (clicking will turn it ON).
    /// </summary>
    [Parameter]
    public SvgIcon DarkIcon { get; set; } = Ionicon.MoonOutline;

    /// <summary>
    /// Icon shown when dark mode is ON (clicking will turn it OFF).
    /// </summary>
    [Parameter]
    public SvgIcon LightIcon { get; set; } = Ionicon.SunnyOutline;

    /// <summary>
    /// Base CSS for the toggle button.
    /// </summary>
    private static readonly string BaseStyle =
        "inline-flex text-xl items-center justify-center p-2 mr-2 rounded-theme transition-colors ease-in-out duration-300 focus:outline-none";

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        // Merge any user-defined classes with the base style, plus additional Tailwind classes
        // for the background in both light and dark modes.
        return TwMerge.Merge(
            AdditionalAttributes,
            BaseStyle,
            "text-on-surface dark:text-on-surface-dark bg-surface dark:bg-surface-dark hover:bg-surface-dark/5 dark:text-on-surface-dark dark:hover:bg-surface/5"
        );
    }
}