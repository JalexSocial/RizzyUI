
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
    ///     Optional layout for rendering <see cref="ChildContent" /> inside an iframe.
    /// </summary>
    [Parameter] public Type? Layout { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBrowser.Container);
    }
}