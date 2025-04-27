
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
///     A component that simulates a browser window, useful for previewing components or content.
/// </summary>
public partial class RzBrowser : RzComponent
{
    /// <summary>
    ///     The content to be displayed within the browser preview area.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Optional layout for rendering <see cref="ChildContent" /> inside an iframe via <see cref="RzEmbeddedPreview"/>.
    /// </summary>
    [Parameter] public Type? Layout { get; set; }

    /// <summary>
    /// Gets or sets the title attribute for the iframe when a layout is used.
    /// Defaults to "Component Preview". Provides context for screen reader users.
    /// </summary>
    [Parameter] public string PreviewIFrameTitle { get; set; } = "Component Preview";

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBrowser.Container);
    }
}