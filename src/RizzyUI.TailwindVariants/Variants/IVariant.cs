using System.Diagnostics.CodeAnalysis;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Generic variant storage interface used by VariantCollection.
/// </summary>
public interface IVariant<TSlots>
    where TSlots : ISlots, new()
{
    /// <summary>
    /// Try to get the SlotCollection for the given key.
    /// </summary>
    bool TryGetSlots<TKey>(TKey key, [MaybeNullWhen(false)] out SlotCollection<TSlots> slots);
}