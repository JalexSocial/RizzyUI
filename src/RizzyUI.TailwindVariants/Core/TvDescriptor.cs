
using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Text;
    using static RizzyUI.TailwindVariants.TvHelpers;

    namespace RizzyUI.TailwindVariants;

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
        private readonly VariantCollection<TOwner, TSlots>? _variants;
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
            _variants = variants;

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
            CompiledVariants = PreComputeVariants(descriptorChain, typeof(TOwner));
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

        private static IReadOnlyList<CompiledVariant> PreComputeVariants(List<ITvDescriptor> descriptorChain, Type finalOwnerType)
        {
            var finalVariants = new Dictionary<string, CompiledVariant>();

            foreach (var descriptor in descriptorChain)
            {
                var variantCollection = descriptor.GetVariantCollection();
                if (variantCollection is null) continue;

                foreach (var (accessorExpression, variant) in variantCollection.GetVariants())
                {
                    var memberBody = accessorExpression.Body as MemberExpression;
                    if (memberBody is null && accessorExpression.Body is UnaryExpression unary && unary.Operand is MemberExpression member)
                    {
                        memberBody = member;
                    }

                    if (memberBody is null)
                    {
                        // This should not be possible given the constraints on variant accessors,
                        // but we'll skip it to be safe.
                        continue;
                    }

                    var propertyName = memberBody.Member.Name;
                    var variantKey = propertyName;

                    var finalOwnerProperty = finalOwnerType.GetProperty(propertyName, System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

                    if (finalOwnerProperty is null)
                    {
                        // The property for this variant does not exist on the final component type.
                        // This means the variant cannot be applied. If a variant with the same key
                        // was defined by a previous descriptor, we remove it.
                        finalVariants.Remove(variantKey);
                        continue;
                    }

                    // Build and compile a new accessor expression that is strongly typed to the final owner type.
                    var ownerParam = Expression.Parameter(typeof(object), "owner");
                    var body = Expression.Property(
                        Expression.Convert(ownerParam, finalOwnerType),
                        finalOwnerProperty
                    );

                    var convertedBody = Expression.Convert(body, typeof(object));
                    var lambda = Expression.Lambda<Func<object, object?>>(convertedBody, ownerParam);
                    var compiledAccessor = lambda.Compile();

                    finalVariants[variantKey] = new CompiledVariant(variantKey, compiledAccessor, variant);
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
        public IVariantCollection? GetVariantCollection() => _variants;
        /// <inheritdoc />
        public IReadOnlyList<CompiledCompoundVariant> GetLocalCompiledCompoundVariants() => _localCompiledCompoundVariants;
    }