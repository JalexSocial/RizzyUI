
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Globalization;

namespace RizzyUI;

/// <summary>
/// A container that maintains a specific aspect ratio for its content.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'.
/// </remarks>
public partial class RzAspectRatio : RzComponent
{
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
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAspectRatio.Wrapper);
    }
}