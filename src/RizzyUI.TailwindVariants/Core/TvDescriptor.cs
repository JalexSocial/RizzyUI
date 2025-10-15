
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Text;
    using static RizzyUI.TailwindVariants.TvHelpers;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// A non-generic interface for a compiled TailwindVariants descriptor, allowing for descriptor inheritance.
    /// </summary>
    public interface ITvDescriptor
    {
        /// <summary>
        /// Gets the parent descriptor from which this descriptor inherits configuration.
        /// </summary>
        ITvDescriptor? Extends { get; }

        /// <summary>
        /// Gets the fully compiled, flattened dictionary of slot names to their base class strings.
        /// This represents the merged result of all `slots` and `base` properties in the inheritance chain.
        /// </summary>
        IReadOnlyDictionary<string, string> CompiledSlots { get; }

        /// <summary>
        /// Gets the fully compiled, flattened list of variants.
        /// Note: When a child overrides a variant key, the child’s value replaces the parent’s value.
        /// The enumeration order is stable by first insertion; overriding does not change a variant's position in the evaluation order.
        /// </summary>
        IReadOnlyList<CompiledVariant> CompiledVariants { get; }

        /// <summary>
        /// Gets the fully compiled, flattened list of compound variants.
        /// These are additive and are evaluated in order from ancestor to child.
        /// </summary>
        IReadOnlyList<CompiledCompoundVariant> CompiledCompoundVariants { get; }
    }

    /// <summary>
    /// Represents the configuration options for TailwindVariants, including base classes, slots, variants, and compound variants.
    /// This class performs a one-time, efficient pre-computation of the entire inheritance chain defined by the `Extends` property.
    /// </summary>
    /// <typeparam name="TOwner">The type that owns the slots and variants.</typeparam>
    /// <typeparam name="TSlots">The type representing the slots, which must implement <see cref="ISlots"/>.</typeparam>
    public sealed class TvDescriptor<TOwner, TSlots> : ITvDescriptor
        where TSlots : ISlots, new()
        where TOwner : ISlotted<TSlots>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TvDescriptor{TOwner, TSlots}"/> class, performing a one-time
        /// pre-computation of the entire inheritance chain.
        /// </summary>
        /// <param name="extends">An optional parent descriptor to inherit and merge styles from.</param>
        /// <param name="base">The base CSS classes to apply to the base slot for this specific descriptor.</param>
        /// <param name="slots">A collection mapping slot accessors to their corresponding CSS class values.</param>
        /// <param name="variants">A collection of variant definitions, each keyed by an accessor expression.</param>
        /// <param name="compoundVariants">A collection of compound variants for applying classes based on multiple conditions.</param>
        public TvDescriptor(
            ITvDescriptor? extends = null,
            ClassValue? @base = null,
            SlotCollection<TSlots>? slots = null,
            VariantCollection<TOwner, TSlots>? variants = null,
            CompoundVariantCollection<TOwner, TSlots>? compoundVariants = null)
        {
            Extends = extends;
            this.@base = @base;
            this.slots = slots;
            this.variants = variants;
            this.compoundVariants = compoundVariants;

            var descriptorChain = new List<ITvDescriptor>();
            var seen = new HashSet<ITvDescriptor>(ReferenceEqualityComparer.Instance);
            for (var current = this as ITvDescriptor; current != null; current = current.Extends)
            {
                if (!seen.Add(current))
                {
                    throw new InvalidOperationException("Cyclic dependency detected in TvDescriptor 'Extends' chain.");
                }
                descriptorChain.Insert(0, current);
            }

            CompiledSlots = PreComputeSlots(descriptorChain);
            CompiledVariants = PreComputeVariants(descriptorChain);
            CompiledCompoundVariants = PreComputeCompoundVariants(descriptorChain);
        }

        private static IReadOnlyDictionary<string, string> PreComputeSlots(List<ITvDescriptor> descriptorChain)
        {
            var finalSlots = new Dictionary<string, StringBuilder>();
            foreach (var descriptor in descriptorChain)
            {
                var localSlots = new Dictionary<string, string>();
                if (descriptor is TvDescriptor<TOwner, TSlots> genericDescriptor)
                {
                    if (genericDescriptor.@base is not null)
                    {
                        localSlots[GetSlot<TSlots>(s => s.Base)] = genericDescriptor.@base.ToString();
                    }
                    if (genericDescriptor.slots is not null)
                    {
                        foreach (var (key, value) in genericDescriptor.slots)
                        {
                            localSlots[GetSlot(key)] = value.ToString();
                        }
                    }
                }

                foreach (var (slotName, classValue) in localSlots)
                {
                    if (!finalSlots.TryGetValue(slotName, out var builder))
                    {
                        builder = new StringBuilder();
                        finalSlots[slotName] = builder;
                    }
                    if (builder.Length > 0) builder.Append(' ');
                    builder.Append(classValue.Trim());
                }
            }
            return finalSlots.ToDictionary(kv => kv.Key, kv => kv.Value.ToString());
        }

        private static IReadOnlyList<CompiledVariant> PreComputeVariants(List<ITvDescriptor> descriptorChain)
        {
            var finalVariants = new Dictionary<string, (Expression<VariantAccessor<TOwner>> Accessor, IVariant<TSlots> Variant)>();
            foreach (var descriptor in descriptorChain)
            {
                if (descriptor is not TvDescriptor<TOwner, TSlots> genericDescriptor || genericDescriptor.variants is null) continue;
                foreach (var (key, value) in genericDescriptor.variants)
                {
                    var variantKey = GetVariant(key);
                    finalVariants[variantKey] = (key, value);
                }
            }

            return finalVariants.Select(kv =>
            {
                var (accessor, variant) = kv.Value;
                var compiled = accessor.Compile();
                Func<object, object?> compiledAccessor = owner => owner is TOwner typedOwner ? compiled(typedOwner) : null;
                return new CompiledVariant(kv.Key, compiledAccessor, variant);
            }).ToList();
        }

        private static IReadOnlyList<CompiledCompoundVariant> PreComputeCompoundVariants(List<ITvDescriptor> descriptorChain)
        {
            var finalCompoundVariants = new List<CompiledCompoundVariant>();
            foreach (var descriptor in descriptorChain)
            {
                if (descriptor is not TvDescriptor<TOwner, TSlots> genericDescriptor || genericDescriptor.compoundVariants is null) continue;
                finalCompoundVariants.AddRange(genericDescriptor.compoundVariants.Select(cv => cv.Compile()));
            }
            return finalCompoundVariants;
        }

        /// <inheritdoc />
        public ITvDescriptor? Extends { get; }

        private readonly ClassValue? @base;
        private readonly SlotCollection<TSlots>? slots;
        private readonly VariantCollection<TOwner, TSlots>? variants;
        private readonly CompoundVariantCollection<TOwner, TSlots>? compoundVariants;

        /// <inheritdoc />
        public IReadOnlyDictionary<string, string> CompiledSlots { get; }
        /// <inheritdoc />
        public IReadOnlyList<CompiledVariant> CompiledVariants { get; }
        /// <inheritdoc />
        public IReadOnlyList<CompiledCompoundVariant> CompiledCompoundVariants { get; }
    }