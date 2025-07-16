
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A container specifically for placing buttons within an <see cref="CardHeader" /> or <see cref="CardFooter" />.
///     Provides appropriate layout styling based on the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardAction : RzComponent
{
    /// <summary> The buttons or other action elements to be rendered within this container. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.CardAction.ActionsContainer);
    }
}