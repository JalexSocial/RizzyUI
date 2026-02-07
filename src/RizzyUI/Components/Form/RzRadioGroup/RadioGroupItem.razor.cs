using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the contract for a RadioGroupItem that an indicator can register with.
/// </summary>
internal interface IRadioGroupItem
{
    /// <summary>
    /// Allows a child indicator to notify the parent item of its existence.
    /// </summary>
    void RegisterIndicator();
}

/// <summary>
/// Represents a selectable item within <see cref="RzRadioGroup{TValue}"/>.
/// </summary>
/// <typeparam name="TValue">The value type associated with each radio item.</typeparam>
public partial class RadioGroupItem<TValue> : RzComponent<RadioGroupItemSlots>, IHasRadioGroupItemStylingProperties, IRadioGroupItem
{
    private RzInputRadioBase<TValue>? _elem;
    private bool _hasExplicitIndicator = false;

    /// <summary>
    /// Gets or sets the value represented by this radio item.
    /// </summary>
    [Parameter] public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets the content rendered as the radio item label.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this item is disabled.
    /// </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// Internal method for child indicators to register their presence.
    /// </summary>
    public void RegisterIndicator()
    {
        if (!_hasExplicitIndicator)
        {
            _hasExplicitIndicator = true;
            StateHasChanged();
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> GetDescriptor() => Theme.RadioGroupItem;
}