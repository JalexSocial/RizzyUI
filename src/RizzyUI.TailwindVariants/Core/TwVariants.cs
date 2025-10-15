using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using static RizzyUI.TailwindVariants.TvHelpers;
    using Tw = TailwindMerge.TwMerge;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// Core function factory that builds a Tailwind-variants-like function.
    /// </summary>
    public class TwVariants
    {
        private readonly Tw _merge;

        /// <summary>
        /// Initializes a new instance of the <see cref="TwVariants"/> class.
        /// </summary>
        /// <param name="merge">The <see cref="TailwindMerge.TwMerge"/> instance to use for merging CSS classes.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="merge"/> is null.</exception>
        public TwVariants(Tw merge)
        {
            _merge = merge ?? throw new ArgumentNullException(nameof(merge));
        }

        /// <summary>
        /// Creates a slot map containing the final computed CSS class strings for each slot, based on the provided owner and descriptor.
        /// </summary>
        /// <typeparam name="TOwner">The type that owns the slots and variants.</typeparam>
        /// <typeparam name="TSlots">The type representing the slots, which must implement <see cref="ISlots"/>.</typeparam>
        /// <param name="owner">The instance providing slot and variant values.</param>
        /// <param name="descriptor">The pre-computed, strongly-typed configuration descriptor.</param>
        /// <returns>A <see cref="SlotsMap{TSlots}"/> mapping slot names to their final computed CSS class strings.</returns>
        public SlotsMap<TSlots> Invoke<TOwner, TSlots>(TOwner owner, TvDescriptor<TOwner, TSlots> descriptor)
            where TSlots : ISlots, new()
            where TOwner : ISlotted<TSlots>
        {
            var builders = descriptor.CompiledSlots.ToDictionary(
                kv => kv.Key,
                kv => new StringBuilder(kv.Value, kv.Value.Length + 64));

            foreach (var compiledVariant in descriptor.CompiledVariants)
            {
                var selectedValue = compiledVariant.Accessor(owner);
                if (selectedValue is null) continue;

                if (compiledVariant.Variant.TryGetSlots(selectedValue, out var slots) && slots is not null)
                {
                    foreach (var (slotName, classValue) in slots.AsPairs())
                    {
                        AddClass(builders, slotName, classValue?.ToString());
                    }
                }
            }

            foreach (var compiledCv in descriptor.CompiledCompoundVariants)
            {
                if (compiledCv.Predicate(owner))
                {
                    foreach (var (slotName, classValue) in compiledCv.Slots.AsPairs())
                    {
                        AddClass(builders, slotName, classValue?.ToString());
                    }
                }
            }

            if (owner.Classes is not null)
            {
                foreach (var (slot, value) in owner.Classes.EnumerateOverrides())
                {
                    AddClass(builders, slot, value);
                }
            }
            
            if (!string.IsNullOrEmpty(owner.Class))
            {
                AddClass(builders, GetSlot<TSlots>(s => s.Base), owner.Class);
            }

            return builders.ToDictionary(
                kv => kv.Key,
                kv => _merge.Merge(kv.Value.ToString()));
        }

        private static void AddClass(Dictionary<string, StringBuilder> builders, string slotName, string? classes)
        {
            classes = classes?.Trim();
            if (string.IsNullOrEmpty(classes)) return;

            if (!builders.TryGetValue(slotName, out var builder))
            {
                builder = new StringBuilder();
                builders[slotName] = builder;
            }

            if (builder.Length > 0) builder.Append(' ');
            builder.Append(classes);
        }
    }