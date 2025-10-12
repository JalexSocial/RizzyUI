using System.Collections;
using System.Linq.Expressions;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// A collection mapping Slot accessors to ClassValue objects.
/// </summary>
public class SlotCollection<TSlots>()
    : IEnumerable<KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>>, IEnumerable<string>
        where TSlots : ISlots, new()
{
    private readonly Dictionary<Expression<SlotAccessor<TSlots>>, ClassValue> _slots = [];

    /// <summary>
    /// Create a slot collection whose base slot contains the provided classes.
    /// </summary>
    internal SlotCollection(string? classes) : this() => _slots[s => s.Base] = classes;

    /// <summary>
    /// Indexer (slot accessor) => class value.
    /// </summary>
    public ClassValue? this[Expression<SlotAccessor<TSlots>> key]
    {
        get => _slots[key];
        set => _slots[key] = value ?? "";
    }

    /// <summary>
    /// Implicit conversion from string to SlotCollection (the string becomes the base slot).
    /// </summary>
    public static implicit operator SlotCollection<TSlots>(string classes) => new(classes);

    /// <summary>
    /// Converts an array of strings to a new instance of <see cref="SlotCollection{TSlots}"/> containing the specified
    /// values.
    /// </summary>
    /// <remarks>This operator enables implicit conversion from a string array to a <see
    /// cref="SlotCollection{TSlots}"/>. Each element in the array is added to the collection in order. If the array is
    /// empty, the resulting collection will also be empty.</remarks>
    /// <param name="values">An array of strings representing the slot values to include in the collection. Cannot be null.</param>
    public static implicit operator SlotCollection<TSlots>(string[] values)
    {
        var slots = new SlotCollection<TSlots>();
        foreach (var value in values)
        {
            slots.Add(value);
        }
        return slots;
    }

    /// <summary>
    /// Associates the specified slot accessor expression with the given class value in the slot collection.
    /// </summary>
    /// <param name="key">An expression that identifies the slot accessor to be used as the key. Cannot be null.</param>
    /// <param name="value">The class value to associate with the specified slot accessor. Cannot be null.</param>
    public void Add(Expression<SlotAccessor<TSlots>> key, ClassValue value) => _slots.Add(key, value);

    /// <summary>
    /// Adds the specified value to the collection associated with the base slot.
    /// </summary>
    /// <param name="value">The value to add to the collection. Cannot be null.</param>
    public void Add(string value)
    {
        if (!_slots.TryGetValue(s => s.Base, out var @base))
        {
            @base = [];
            _slots[s => s.Base] = @base;
        }

        @base.Add(value);
    }

    /// <inheritdoc/>
    public IEnumerator<KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>> GetEnumerator() => _slots.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

    IEnumerator<string> IEnumerable<string>.GetEnumerator() => _slots[s => s.Base].GetEnumerator();
}