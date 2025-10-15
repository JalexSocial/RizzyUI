
    using System;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// Represents a pre-compiled, non-generic variant definition, optimized for runtime execution.
    /// </summary>
    /// <param name="VariantKey">A string identifier for the variant group (e.g., "Size", "Color").</param>
    /// <param name="Accessor">A compiled delegate that retrieves the variant value from an owner object.</param>
    /// <param name="Variant">The underlying variant definition containing the class mappings.</param>
    public record CompiledVariant(string VariantKey, Func<object, object?> Accessor, IVariant Variant);

    /// <summary>
    /// Represents a pre-compiled, non-generic compound variant definition, optimized for runtime execution.
    /// </summary>
    /// <param name="Predicate">A compiled delegate that evaluates whether the compound variant should be applied.</param>
    /// <param name="Slots">The collection of slots and classes to apply if the predicate is true.</param>
    public record CompiledCompoundVariant(Predicate<object> Predicate, ISlotCollection Slots);