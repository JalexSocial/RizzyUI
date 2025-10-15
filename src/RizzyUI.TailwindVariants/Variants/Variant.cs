
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;

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
        private readonly List<KeyValuePair<TVariant, SlotCollection<TSlots>>> _variants = [];

        /// <summary>
        /// Gets or sets the <see cref="SlotCollection{TSlots}"/> associated with the specified variant key.
        /// </summary>
        public SlotCollection<TSlots>? this[TVariant key]
        {
            get
            {
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
        public void Add(TVariant key, SlotCollection<TSlots> value) =>
            _variants.Add(new KeyValuePair<TVariant, SlotCollection<TSlots>>(key, value));

        /// <inheritdoc/>
        public IEnumerator<KeyValuePair<TVariant, SlotCollection<TSlots>>> GetEnumerator() => _variants.GetEnumerator();

        /// <inheritdoc/>
        public bool TryGetSlots(object? key, [MaybeNullWhen(false)] out ISlotCollection slots)
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