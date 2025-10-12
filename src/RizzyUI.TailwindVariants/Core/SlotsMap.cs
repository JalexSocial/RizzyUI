using System.Linq.Expressions;
using static RizzyUI.TailwindVariants.TvHelpers;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// SlotsMap is a simple mapping of slot names to final computed class strings (null allowed).
/// </summary>
public class SlotsMap<TSlots>
    where TSlots : ISlots, new()
{
    private readonly Dictionary<string, string?> _map = new(StringComparer.Ordinal);

    /// <summary>
    /// Indexer that accepts a slot accessor expression and returns the computed class string or null.
    /// </summary>
    public string? this[Expression<SlotAccessor<TSlots>> key] => this[GetSlot(key)];

    /// <summary>
    /// Indexer that accepts a slot name and returns the computed class string or null.
    /// </summary>
    public string? this[string key] => _map.TryGetValue(key, out string? value) ? value : null;

    /// <summary>
    /// Create a SlotsMap from a prefilled dictionary.
    /// </summary>
    public static implicit operator SlotsMap<TSlots>(Dictionary<string, string?> map)
    {
        var slots = new SlotsMap<TSlots>();
        foreach (var (key, value) in map)
        {
            slots.Add(key, value);
        }

        return slots;
    }

    /// <summary>
    /// Add a named slot mapping.
    /// </summary>
    internal void Add(string key, string? value) => _map.Add(key, value);
}