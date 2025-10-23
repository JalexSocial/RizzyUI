
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders a button that toggles between light and dark color themes for the application.
///     Interactivity (state management and class toggling on `&lt;html>`) is handled via the `rzDarkModeToggle` Alpine.js
///     component.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzDarkModeToggle : RzComponent<RzDarkModeToggle.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzDarkModeToggle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center p-2 rounded-md transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground bg-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus-visible:ring-offset-background",
        slots: new()
        {
            [s => s.Icon] = "transition-transform duration-300 ease-out size-5"
        }
    );

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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzDarkModeToggle;

    /// <summary>
    /// Defines the slots available for styling in the RzDarkModeToggle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the icon element.
        /// </summary>
        public string? Icon { get; set; }
    }
}