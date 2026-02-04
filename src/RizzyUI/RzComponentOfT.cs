using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A generic base class for RizzyUI components that utilize the TailwindVariants.NET system.
/// It handles the boilerplate of injecting services, managing slot maps, and invoking the Tv function.
/// </summary>
/// <typeparam name="TSlots">The component-specific class that implements ISlots.</typeparam>
public abstract class RzComponent<TSlots> : RzComponent, ISlottable<TSlots>
    where TSlots : class, ISlots, new()
{
    [Inject]
    private TwVariants Tv { get; set; } = null!;

    private SlotsMap<TSlots> _slots = new();
    private TSlots? _effectiveClasses;

    /// <summary>
    /// Publicly exposes the computed slot classes for use by child components.
    /// </summary>
    public SlotsMap<TSlots> SlotClasses => _slots;

    /// <summary>
    /// Replaces the default slot classes with a new instance.
    /// </summary>
    [Parameter] public TSlots? Classes { get; set; }

    /// <summary>
    /// Provides a fluent way to modify individual slot classes after the 
    /// theme and variants have been processed. These values are appended to the theme styles.
    /// </summary>
    [Parameter] public Action<TSlots>? ConfigureClasses { get; set; }

    /// <summary>
    /// Implements the ISlotted interface property.
    /// This property extracts the 'class' attribute from AdditionalAttributes,
    /// allowing Tv.Invoke to merge it into the base slot.
    /// </summary>
    public string? Class => AdditionalAttributes?.TryGetValue("class", out var classes) == true ? classes?.ToString() : null;

    /// <summary>
    /// Explicit implementation of ISlottable.Classes to provide the merged 
    /// user-defined overrides to the TwVariants engine.
    /// </summary>
    TSlots? ISlottable<TSlots>.Classes => _effectiveClasses;

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

        // Prepare the user-defined overrides
        if (Classes == null && ConfigureClasses == null)
        {
            _effectiveClasses = default;
        }
        else
        {
            // Use the provided instance or create a new one to hold tweaks
            _effectiveClasses = Classes ?? new TSlots();
            ConfigureClasses?.Invoke(_effectiveClasses);
        }

        // Tv.Invoke will look at 'this.Classes' (via the interface) and 
        // append any non-null properties to the theme/variant results.
        _slots = Tv.Invoke(this, GetDescriptor());
    }
}