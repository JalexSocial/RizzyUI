
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
        /// Gets the local, non-compiled variant collection for this specific descriptor.
        /// </summary>
        IVariantCollection? GetVariantCollection();

        /// <summary>
        /// Gets the local, pre-compiled compound variants for this specific descriptor.
        /// </summary>
        IReadOnlyList<CompiledCompoundVariant> GetLocalCompiledCompoundVariants();
    }