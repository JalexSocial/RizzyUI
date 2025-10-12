
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Globalization;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A container that maintains a specific aspect ratio for its content.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'.
/// </remarks>
public partial class RzAspectRatio : RzComponent<RzAspectRatio.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzAspectRatio component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative w-full",
        slots: new()
        {
            [s => s.Inner] = "absolute inset-0"
        }
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the aspect ratio container.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the desired aspect ratio, calculated as width / height.
    /// Defaults to 1 (a square).
    /// </summary>
    [Parameter] public double Ratio { get; set; } = 1;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAspectRatio;

    /// <summary>
    /// Defines the slots available for styling in the RzAspectRatio component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Inner { get; set; }
    }
}