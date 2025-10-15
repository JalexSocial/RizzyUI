using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using static RizzyUI.TailwindVariants.TvHelpers;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// A non-generic interface for a collection of slots, used for type erasure.
    /// </summary>
    public interface ISlotCollection : IEnumerable
    {
        /// <summary>
        /// Gets an enumerator for the key-value pairs in the collection.
        /// </summary>
        IEnumerable<KeyValuePair<string, ClassValue>> AsPairs();
    }

    /// <summary>
    /// A collection mapping slot names to ClassValue objects.
    /// It provides a type-safe API using expressions, but uses strings internally for performance and simplicity.
    /// </summary>
    public class SlotCollection<TSlots> : ISlotCollection, IEnumerable<KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>>
        where TSlots : ISlots, new()
    {
        private readonly Dictionary<string, ClassValue> _slots = new(StringComparer.Ordinal);
        private static string BaseName => TSlots.GetName(nameof(ISlots.Base));

        /// <summary>
        /// Initializes a new, empty slot collection.
        /// </summary>
        public SlotCollection() { }

        /// <summary>
        /// Initializes a new slot collection with a class string for the base slot.
        /// </summary>
        private SlotCollection(string? classes) : this()
        {
            if (!string.IsNullOrEmpty(classes))
            {
                _slots[BaseName] = new ClassValue(classes);
            }
        }

        /// <summary>
        /// Gets or sets the class value for a slot using a type-safe accessor expression.
        /// </summary>
        public ClassValue? this[Expression<SlotAccessor<TSlots>> key]
        {
            get => _slots.TryGetValue(GetSlot(key), out var value) ? value : null;
            set => _slots[GetSlot(key)] = value ?? new ClassValue();
        }

        /// <summary>
        /// Implicit conversion from a string to a SlotCollection, where the string is applied to the base slot.
        /// </summary>
        public static implicit operator SlotCollection<TSlots>(string classes) => new(classes);

        /// <summary>
        /// Implicit conversion from a string array to a SlotCollection, where the strings are applied to the base slot.
        /// </summary>
        /// <remarks>
        /// This operator enables implicit conversion from a string array. Each element in the array is added to the base slot in order.
        /// </remarks>
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
        /// Associates a class value with a slot using a type-safe accessor expression.
        /// </summary>
        public void Add(Expression<SlotAccessor<TSlots>> key, ClassValue value) => _slots[GetSlot(key)] = value;

        /// <summary>
        /// Adds a class string to the base slot.
        /// </summary>
        public void Add(string value)
        {
            if (!_slots.TryGetValue(BaseName, out var @base))
            {
                @base = new ClassValue();
                _slots[BaseName] = @base;
            }
            @base.Add(value);
        }

        /// <inheritdoc/>
        public IEnumerable<KeyValuePair<string, ClassValue>> AsPairs() => _slots;

        /// <summary>
        /// This method is provided for LINQ compatibility and collection initializers.
        /// It is not recommended for direct enumeration as it reconstructs expressions on the fly.
        /// </summary>
        public IEnumerator<KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>> GetEnumerator()
        {
            // This is inefficient and should be avoided in performance-critical code.
            // It exists to satisfy the IEnumerable contract for collection initializers.
            foreach (var pair in _slots)
            {
                var parameter = Expression.Parameter(typeof(TSlots), "s");
                var member = Expression.Property(parameter, pair.Key);
                var lambda = Expression.Lambda<SlotAccessor<TSlots>>(member, parameter);
                yield return new KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>(lambda, pair.Value);
            }
        }

        IEnumerator IEnumerable.GetEnumerator() => this.GetEnumerator();
    }