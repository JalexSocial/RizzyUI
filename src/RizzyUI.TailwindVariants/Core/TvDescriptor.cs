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

        /// <summary>
        /// Gets the local, non-compiled base class value for this specific descriptor.
        /// </summary>
        ClassValue? GetBaseClassValue();

        /// <summary>
        /// Gets the local, non-compiled slot collection for this specific descriptor.
        /// </summary>
        ISlotCollection? GetSlotCollection();

        /// <summary>
        /// Gets the local, pre-compiled variants for this specific descriptor.
        /// </summary>
        IReadOnlyList<CompiledVariant> GetLocalCompiledVariants();

        /// <summary>
        /// Gets the local, pre-compiled compound variants for this specific descriptor.
        /// </summary>
        IReadOnlyList<CompiledCompoundVariant> GetLocalCompiledCompoundVariants();
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
        private readonly ClassValue? _base;
        private readonly SlotCollection<TSlots>? _slots;
        private readonly IReadOnlyList<CompiledVariant> _localCompiledVariants;
        private readonly IReadOnlyList<CompiledCompoundVariant> _localCompiledCompoundVariants;

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
            _base = @base;
            _slots = slots;

            _localCompiledVariants = PreComputeLocalVariants(variants);
            _localCompiledCompoundVariants = compoundVariants?.Select(cv => cv.Compile()).ToList() ?? (IReadOnlyList<CompiledCompoundVariant>)Array.Empty<CompiledCompoundVariant>();

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
            var baseSlotName = GetSlot<TSlots>(s => s.Base);

            foreach (var descriptor in descriptorChain)
            {
                var baseValue = descriptor.GetBaseClassValue();
                if (baseValue is not null)
                {
                    var classValue = baseValue.ToString().Trim();
                    if (!string.IsNullOrEmpty(classValue))
                    {
                        if (!finalSlots.TryGetValue(baseSlotName, out var builder))
                        {
                            builder = new StringBuilder();
                            finalSlots[baseSlotName] = builder;
                        }
                        if (builder.Length > 0) builder.Append(' ');
                        builder.Append(classValue);
                    }
                }

                var slotCollection = descriptor.GetSlotCollection();
                if (slotCollection is not null)
                {
                    foreach (var (slotName, classValueContainer) in slotCollection.AsPairs())
                    {
                        var classValue = classValueContainer.ToString().Trim();
                        if (string.IsNullOrEmpty(classValue)) continue;

                        if (!finalSlots.TryGetValue(slotName, out var builder))
                        {
                            builder = new StringBuilder();
                            finalSlots[slotName] = builder;
                        }
                        if (builder.Length > 0) builder.Append(' ');
                        builder.Append(classValue);
                    }
                }
            }
            return finalSlots.ToDictionary(kv => kv.Key, kv => kv.Value.ToString());
        }

        private static IReadOnlyList<CompiledVariant> PreComputeLocalVariants(VariantCollection<TOwner, TSlots>? variants)
        {
            if (variants is null) return Array.Empty<CompiledVariant>();

            return variants.Select(kv =>
            {
                var (accessor, variant) = (kv.Key, kv.Value);
                var variantKey = GetVariant(accessor);
                var compiled = accessor.Compile();
                Func<object, object?> compiledAccessor = owner => owner is TOwner typedOwner ? compiled(typedOwner) : null;
                return new CompiledVariant(variantKey, compiledAccessor, variant);
            }).ToList();
        }

        private static IReadOnlyList<CompiledVariant> PreComputeVariants(List<ITvDescriptor> descriptorChain)
        {
            var finalVariants = new Dictionary<string, CompiledVariant>();
            foreach (var descriptor in descriptorChain)
            {
                foreach (var localVariant in descriptor.GetLocalCompiledVariants())
                {
                    finalVariants[localVariant.VariantKey] = localVariant;
                }
            }
            return finalVariants.Values.ToList();
        }

        private static IReadOnlyList<CompiledCompoundVariant> PreComputeCompoundVariants(List<ITvDescriptor> descriptorChain)
        {
            var finalCompoundVariants = new List<CompiledCompoundVariant>();
            foreach (var descriptor in descriptorChain)
            {
                finalCompoundVariants.AddRange(descriptor.GetLocalCompiledCompoundVariants());
            }
            return finalCompoundVariants;
        }

        /// <inheritdoc />
        public ITvDescriptor? Extends { get; }

        /// <inheritdoc />
        public IReadOnlyDictionary<string, string> CompiledSlots { get; }
        /// <inheritdoc />
        public IReadOnlyList<CompiledVariant> CompiledVariants { get; }
        /// <inheritdoc />
        public IReadOnlyList<CompiledCompoundVariant> CompiledCompoundVariants { get; }

        /// <inheritdoc />
        public ClassValue? GetBaseClassValue() => _base;
        /// <inheritdoc />
        public ISlotCollection? GetSlotCollection() => _slots;
        /// <inheritdoc />
        public IReadOnlyList<CompiledVariant> GetLocalCompiledVariants() => _localCompiledVariants;
        /// <inheritdoc />
        public IReadOnlyList<CompiledCompoundVariant> GetLocalCompiledCompoundVariants() => _localCompiledCompoundVariants;
    }