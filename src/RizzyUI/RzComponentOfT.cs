
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A generic base class for RizzyUI components that utilize the TailwindVariants.NET system.
/// It handles the boilerplate of injecting services, managing slot maps, and invoking the Tv function.
/// </summary>
/// <typeparam name="TSlots">The component-specific class that implements ISlots.</typeparam>
public abstract class RzComponent<TSlots> : RzComponent, ISlotted<TSlots>
    where TSlots : ISlots, new()
{
    [Inject]
    private TwVariants Tv { get; set; } = default!;

    /// <summary>
    /// Holds the computed class strings for all slots of the component.
    /// This is populated by Tv.Invoke in OnParametersSet.
    /// </summary>
    protected SlotsMap<TSlots> _slots = new();

    /// <summary>
    /// Publicly exposes the computed slot classes for use by child components.
    /// </summary>
    public SlotsMap<TSlots> SlotClasses => _slots;
    
    /// <summary>
    /// Allows for per-instance overrides of slot classes.
    /// </summary>
    [Parameter]
    public TSlots? Classes { get; set; }

    /// <summary>
    /// Implements the ISlotted interface property.
    /// This property extracts the 'class' attribute from AdditionalAttributes,
    /// allowing Tv.Invoke to merge it into the base slot.
    /// </summary>
    public string? Class => AdditionalAttributes?.TryGetValue("class", out var classes) == true ? classes?.ToString() : null;

    /// <summary>
    /// When implemented in a derived class, this method must return the TvDescriptor
    /// for the component, which is typically retrieved from the active theme.
    /// </summary>
    /// <returns>The component's TvDescriptor.</returns>
    protected abstract TvDescriptor<RzComponent<TSlots>, TSlots> GetDescriptor();

    /// <summary>
    /// Invokes the TailwindVariants function to compute the final slot classes
    /// based on the component's current parameters and the theme's descriptor.
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _slots = Tv.Invoke(this, GetDescriptor());
    }
}