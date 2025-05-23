
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders a button that toggles between light and dark color themes for the application.
///     Interactivity (state management and class toggling on `&lt;html>`) is handled via the `rzDarkModeToggle` Alpine.js
///     component.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzDarkModeToggle : RzComponent
{
    /// <summary> Icon shown when light mode is active (clicking enables dark mode). Defaults to MoonOutline. </summary>
    [Parameter] public SvgIcon DarkIcon { get; set; } = Ionicon.MoonOutline;

    /// <summary> Icon shown when dark mode is active (clicking enables light mode). Defaults to SunnyOutline. </summary>
    [Parameter] public SvgIcon LightIcon { get; set; } = Ionicon.SunnyOutline;

    /// <summary> Defaults Element to "button" </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "button"; // Set the root element tag
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDarkmodeToggle.Button);
    }
}