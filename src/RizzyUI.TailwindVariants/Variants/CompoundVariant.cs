
    using System;
    using System.Collections;
    using System.Linq.Expressions;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// A compound variant that applies classes when a predicate on the owner component returns true.
    /// </summary>
    public class CompoundVariant<TOwner, TSlots> : IEnumerable<KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>>
        where TSlots : ISlots, new()
        where TOwner : ISlotted<TSlots>
    {
        private readonly Predicate<TOwner> _predicate;
        private readonly SlotCollection<TSlots> _slots = [];

        /// <summary>
        /// Initializes a new instance of the <see cref="CompoundVariant{TOwner, TSlots}"/> class.
        /// </summary>
        /// <param name="predicate">The predicate to evaluate against the owner component.</param>
        public CompoundVariant(Predicate<TOwner> predicate)
        {
            _predicate = predicate ?? throw new ArgumentNullException(nameof(predicate));
        }

        /// <summary>
        /// Gets or sets a global class string to apply to the `Base` slot when the predicate matches.
        /// </summary>
        public string? Class
        {
            get => _slots[s => s.Base]?.ToString();
            set => _slots[s => s.Base] = value;
        }

        /// <summary>
        /// Gets or sets the class value for a specific slot.
        /// </summary>
        public ClassValue this[Expression<SlotAccessor<TSlots>> key]
        {
            get => _slots[key] ?? throw new InvalidOperationException("Requested slot is not present in compound variant.");
            set => _slots[key] = value;
        }

        /// <summary>
        /// Adds a class value for a specific slot.
        /// </summary>
        public void Add(Expression<SlotAccessor<TSlots>> key, ClassValue value) => _slots.Add(key, value);

        /// <summary>
        /// Compiles this generic compound variant into a non-generic, optimized version for runtime execution.
        /// </summary>
        /// <returns>A compiled, non-generic compound variant record.</returns>
        public CompiledCompoundVariant Compile()
        {
            Predicate<object> predicate = owner => owner is TOwner typedOwner && _predicate(typedOwner);
            return new CompiledCompoundVariant(predicate, _slots);
        }

        /// <inheritdoc/>
        public IEnumerator<KeyValuePair<Expression<SlotAccessor<TSlots>>, ClassValue>> GetEnumerator() => _slots.GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }