using System.Collections;
using System.Diagnostics.CodeAnalysis;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// A general-purpose variant keyed by a variant value type.
/// </summary>
public class Variant<TVariant, TSlots> : IVariant<TSlots>,
    IEnumerable<KeyValuePair<TVariant, SlotCollection<TSlots>>>
    where TVariant : notnull
    where TSlots : ISlots, new()
{
    private readonly Dictionary<TVariant, SlotCollection<TSlots>> _variants = [];

    /// <summary>
    /// Gets or sets the <see cref="SlotCollection{TSlots}"/> associated with the specified variant key.
    /// </summary>
    /// <param name="key">The variant key.</param>
    /// <returns>The slot collection for the given key.</returns>
    public SlotCollection<TSlots>? this[TVariant key]
    {
        get => _variants[key];
        set => _variants[key] = value ?? [];
    }

    /// <summary>
    /// Adds a new variant and its associated slot collection.
    /// </summary>
    /// <param name="key">The variant key.</param>
    /// <param name="value">The slot collection to associate with the key.</param>
    public void Add(TVariant key, SlotCollection<TSlots> value) => _variants.Add(key, value);

    /// <summary>
    /// Returns an enumerator that iterates through the variant-slot pairs.
    /// </summary>
    /// <returns>An enumerator for the variant-slot pairs.</returns>
    public IEnumerator<KeyValuePair<TVariant, SlotCollection<TSlots>>> GetEnumerator() => _variants.GetEnumerator();

    /// <summary>
    /// Attempts to get the slot collection for the specified key.
    /// </summary>
    /// <typeparam name="TKey">The type of the key.</typeparam>
    /// <param name="key">The key to look up.</param>
    /// <param name="slots">When this method returns, contains the slot collection associated with the key, if found; otherwise, <c>null</c>.</param>
    /// <returns><c>true</c> if the slot collection was found; otherwise, <c>false</c>.</returns>
    public bool TryGetSlots<TKey>(TKey key, [MaybeNullWhen(false)] out SlotCollection<TSlots> slots)
    {
        if (key is TVariant v && _variants.TryGetValue(v, out slots))
        {
            return true;
        }

        slots = null;
        return false;
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}