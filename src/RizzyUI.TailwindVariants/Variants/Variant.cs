using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// A general-purpose variant keyed by a variant value type.
/// </summary>
/// <typeparam name="TVariant">The type of the key used for variants (e.g., an enum, bool, or string).</typeparam>
/// <typeparam name="TSlots">The type representing the component's slots.</typeparam>
public class Variant<TVariant, TSlots> : IVariant<TSlots>,
    IEnumerable<KeyValuePair<TVariant, SlotCollection<TSlots>>>
    where TSlots : ISlots, new()
{
    // Using a List of KeyValuePairs instead of a Dictionary to support nullable TVariant types,
    // as Dictionary<TKey, TValue> has a 'notnull' constraint on TKey.
    private readonly List<KeyValuePair<TVariant, SlotCollection<TSlots>>> _variants = [];

    /// <summary>
    /// Gets or sets the <see cref="SlotCollection{TSlots}"/> associated with the specified variant key.
    /// </summary>
    /// <param name="key">The variant key.</param>
    /// <returns>The slot collection for the given key.</returns>
    public SlotCollection<TSlots>? this[TVariant key]
    {
        get
        {
            // Find the first entry matching the key.
            foreach (var kvp in _variants)
            {
                if (EqualityComparer<TVariant>.Default.Equals(kvp.Key, key))
                {
                    return kvp.Value;
                }
            }
            return null;
        }
        set
        {
            // Find and update an existing entry, or add a new one.
            for (int i = 0; i < _variants.Count; i++)
            {
                if (EqualityComparer<TVariant>.Default.Equals(_variants[i].Key, key))
                {
                    _variants[i] = new KeyValuePair<TVariant, SlotCollection<TSlots>>(key, value ?? []);
                    return;
                }
            }
            _variants.Add(new KeyValuePair<TVariant, SlotCollection<TSlots>>(key, value ?? []));
        }
    }

    /// <summary>
    /// Adds a new variant and its associated slot collection.
    /// </summary>
    /// <param name="key">The variant key.</param>
    /// <param name="value">The slot collection to associate with the key.</param>
    public void Add(TVariant key, SlotCollection<TSlots> value) =>
        _variants.Add(new KeyValuePair<TVariant, SlotCollection<TSlots>>(key, value));

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
    public bool TryGetSlots<TKey>([AllowNull] TKey key, [MaybeNullWhen(false)] out SlotCollection<TSlots> slots)
    {
        if (key is TVariant v)
        {
            foreach (var kvp in _variants)
            {
                if (EqualityComparer<TVariant>.Default.Equals(kvp.Key, v))
                {
                    slots = kvp.Value;
                    return true;
                }
            }
        }

        slots = null;
        return false;
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}