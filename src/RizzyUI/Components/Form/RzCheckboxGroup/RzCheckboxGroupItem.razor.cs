#pragma warning disable CS1591

// src/RizzyUI/Components/Form/RzCheckboxGroup/RzCheckboxGroupItem.razor.cs
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

internal interface ICheckboxGroupItem
{
    void RegisterIndicator();
}

/// <summary>
/// Represents a single checkbox item within an <see cref="RzCheckboxGroup{TValue}"/>.
/// </summary>
public partial class RzCheckboxGroupItem<TValue> : RzComponent<RzCheckboxGroupItemSlots>, IHasCheckboxGroupItemStylingProperties, ICheckboxGroupItem
{
    private bool _hasExplicitIndicator = false;

    [CascadingParameter] protected RzCheckboxGroup<TValue>? ParentGroup { get; set; }

    /// <summary> Gets or sets the value associated with this checkbox item. </summary>
    [Parameter] public TValue? Value { get; set; }

    /// <summary> Gets or sets the content to be rendered inside the item's label. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets a value indicating whether this item is disabled. </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary> Gets or sets a custom icon to display when checked, overriding the parent group's icon. </summary>
    [Parameter] public SvgIcon? CheckedIcon { get; set; }

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

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentGroup is null)
            throw new InvalidOperationException($"{GetType()} must be used within an RzCheckboxGroup.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> GetDescriptor() => Theme.RzCheckboxGroupItem;
}