using static RizzyUI.TailwindVariants.TvHelpers;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Represents the configuration options for TailwindVariants, including base classes, slots, variants, and compound variants.
/// </summary>
/// <typeparam name="TOwner">The type that owns the slots and variants.</typeparam>
/// <typeparam name="TSlots">The type representing the slots, which must implement <see cref="ISlots"/>.</typeparam>
public sealed class TvDescriptor<TOwner, TSlots>
    where TSlots : ISlots, new()
    where TOwner : ISlotted<TSlots>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="TvDescriptor{TOwner, TSlots}"/> class.
    /// </summary>
    /// <param name="base">The base CSS classes to apply to the base slot.</param>
    /// <param name="slots">A collection mapping slot accessors to their corresponding CSS class values.</param>
    /// <param name="variants">A collection of variant definitions, each keyed by an accessor expression.</param>
    /// <param name="compoundVariants">A collection of compound variants, which apply additional classes based on specific predicates.</param>
    public TvDescriptor(
        ClassValue? @base = null,
        SlotCollection<TSlots>? slots = null,
        VariantCollection<TOwner, TSlots>? variants = null,
        CompoundVariantCollection<TOwner, TSlots>? compoundVariants = null)
    {
        Base = @base;
        Slots = slots;
        Variants = variants;
        CompoundVariants = compoundVariants;

        Precompute();
    }

    /// <summary>
    /// The base CSS classes to apply to the base slot.
    /// </summary>
    public ClassValue? Base { get; }

    /// <summary>
    /// A collection of compound variants, which apply additional classes based on specific predicates.
    /// </summary>
    public CompoundVariantCollection<TOwner, TSlots>? CompoundVariants { get; }

    /// <summary>
    /// A collection mapping slot accessors to their corresponding CSS class values.
    /// </summary>
    public SlotCollection<TSlots>? Slots { get; }

    /// <summary>
    /// A collection of variant definitions, each keyed by an accessor expression.
    /// </summary>
    public VariantCollection<TOwner, TSlots>? Variants { get; }

    internal IReadOnlyDictionary<string, string?> BaseSlots { get; private set; } = default!;

    internal IReadOnlyDictionary<string, CompiledVariant<TOwner, TSlots>> BaseVariants { get; private set; } = default!;

    private void Precompute()
    {
        BaseSlots = PrecomputeBaseAndTopLevelSlots();
        BaseVariants = PrecomputeVariantDefinitions();
    }

    private Dictionary<string, string?> PrecomputeBaseAndTopLevelSlots()
    {
        var map = new Dictionary<string, string?>(StringComparer.Ordinal);

        if (Base is not null)
        {
            map[GetSlot<TSlots>(s => s.Base)] = Base.ToString();
        }

        if (Slots is not null)
        {
            foreach (var (key, value) in Slots)
            {
                map[GetSlot(key)] = value.ToString();
            }
        }

        return map;
    }

    private Dictionary<string, CompiledVariant<TOwner, TSlots>> PrecomputeVariantDefinitions()
    {
        var variants = new Dictionary<string, CompiledVariant<TOwner, TSlots>>(StringComparer.Ordinal);

        if (Variants is not null)
        {
            foreach (var (key, value) in Variants)
            {
                var id = GetVariant(key);
                var accessor = key.Compile();
                variants[id] = new CompiledVariant<TOwner, TSlots>(key, value, accessor);
            }
        }

        return variants;
    }
}