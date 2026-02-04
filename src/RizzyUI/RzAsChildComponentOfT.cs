using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A generic base class for RizzyUI components that implement the "asChild" pattern and utilize the TailwindVariants.NET system.
/// </summary>
/// <typeparam name="TSlots">The component-specific class that implements ISlots.</typeparam>
public abstract class RzAsChildComponent<TSlots> : RzAsChildComponent, ISlottable<TSlots>
    where TSlots : class, ISlots, new()
{
    [Inject]
    private TwVariants Tv { get; set; } = default!;

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
    /// </summary>
    public string? Class => AdditionalAttributes?.TryGetValue("class", out var classes) == true ? classes?.ToString() : null;

    /// <summary>
    /// Explicit implementation of ISlottable.Classes.
    /// </summary>
    TSlots? ISlottable<TSlots>.Classes => _effectiveClasses;

    /// <summary>
    /// When implemented in a derived class, this method must return the TvDescriptor.
    /// </summary>
    protected abstract TvDescriptor<RzAsChildComponent<TSlots>, TSlots> GetDescriptor();

    /// <summary>
    /// Invokes the TailwindVariants function to compute the final slot classes.
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (Classes == null && ConfigureClasses == null)
        {
            _effectiveClasses = null;
        }
        else
        {
            _effectiveClasses = Classes ?? new TSlots();
            ConfigureClasses?.Invoke(_effectiveClasses);
        }

        _slots = Tv.Invoke(this, GetDescriptor());
    }
}