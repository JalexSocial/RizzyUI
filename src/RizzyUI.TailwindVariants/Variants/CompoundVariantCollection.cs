using System.Collections;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Collection of compound variants.
/// </summary>
public class CompoundVariantCollection<TOwner, TSlots> : IEnumerable<CompoundVariant<TOwner, TSlots>>
    where TSlots : ISlots, new()
    where TOwner : ISlotted<TSlots>
{
    private readonly List<CompoundVariant<TOwner, TSlots>> _variants = [];

    /// <summary>
    /// Add a new compound variant.
    /// </summary>
    public void Add(CompoundVariant<TOwner, TSlots> entry) => _variants.Add(entry);

    /// <inheritdoc/>
    public IEnumerator<CompoundVariant<TOwner, TSlots>> GetEnumerator() => _variants.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}