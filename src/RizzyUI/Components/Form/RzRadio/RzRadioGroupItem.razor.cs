
using Blazicons;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a RadioGroupItem component.
/// </summary>
public interface IHasRadioGroupItemStylingProperties { }

/// <xmldoc>
///     Represents a single radio button item within an <see cref="RzRadioGroup{TValue}" />.
///     Includes support for labels, descriptions, and icons.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroupItem<TValue> : RzComponent<RzRadioGroupItemSlots>, IHasRadioGroupItemStylingProperties
{
    private RzInputRadio<TValue>? _radioRef;

    /// <summary>
    /// Gets or sets the parent <see cref="RzRadioGroup{TValue}"/> component.
    /// </summary>
    [CascadingParameter]
    public RzRadioGroup<TValue>? ParentRadioGroup { get; set; }

    /// <summary>
    /// Gets or sets an optional icon displayed next to the label.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets or sets the text label displayed next to the radio button. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the specific value this radio button represents.
    /// </summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets optional additional content displayed below the label for more context.
    /// </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary>
    /// Gets or sets the unique ID for the radio input element. Auto-generated if not provided.
    /// </summary>
    [Parameter]
    public string RadioInputId { get; set; } = IdGenerator.UniqueId("rzrd");

    /// <summary>
    /// Gets or sets optional content rendered within the item's structure, often alongside the Description.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets a reference to the underlying RzInputRadio component.
    /// </summary>
    public RzInputRadio<TValue> InputRadioRef => _radioRef ?? throw new InvalidOperationException("RzInputRadio reference is not set.");

    /// <summary>
    /// Gets the effective icon to be displayed when the radio button is selected.
    /// </summary>
    protected SvgIcon EffectiveCheckboxIcon { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentRadioGroup == null)
            throw new InvalidOperationException($"{GetType()} must be used within an RzRadioGroup.");

        EffectiveCheckboxIcon = ParentRadioGroup.CheckboxIcon;
        ParentRadioGroup.AddRadioItem(this);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzRadioGroupItemSlots>, RzRadioGroupItemSlots> GetDescriptor() => Theme.RzRadioGroupItem;
}