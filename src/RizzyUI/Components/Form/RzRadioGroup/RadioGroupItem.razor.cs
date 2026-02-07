#pragma warning disable CS1591

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

public partial class RadioGroupItem<TValue> : RzComponent<RadioGroupItemSlots>, IHasRadioGroupItemStylingProperties, IRadioGroupItem
{
    private RzInputRadioBase<TValue>? _elem;
    private bool _hasExplicitIndicator = false;

    [Parameter] public TValue? Value { get; set; }
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

    protected override TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> GetDescriptor() => Theme.RadioGroupItem;
}