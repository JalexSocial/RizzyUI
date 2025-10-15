
using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq.Expressions;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// A non-generic interface for a variant definition, used for type erasure in compiled collections.
    /// </summary>
    public interface IVariant
    {
        /// <summary>
        /// Attempts to get the slot collection for the specified variant key.
        /// </summary>
        /// <param name="key">The key to look up.</param>
        /// <param name="slots">When this method returns, contains the slot collection associated with the key, if found; otherwise, <c>null</c>.</param>
        /// <returns><c>true</c> if the slot collection was found; otherwise, <c>false</c>.</returns>
        bool TryGetSlots(object? key, [MaybeNullWhen(false)] out ISlotCollection slots);
    }

    /// <summary>
    /// A generic variant storage interface used by VariantCollection.
    /// </summary>
    public interface IVariant<TSlots> : IVariant
        where TSlots : ISlots, new()
    {
    }

    /// <summary>
    /// A non-generic interface for a variant collection, used for type erasure in compiled collections.
    /// </summary>
    public interface IVariantCollection
    {
        /// <summary>
        /// Gets the variants as a collection of non-generic lambda expressions and variant definitions.
        /// </summary>
        IEnumerable<KeyValuePair<LambdaExpression, IVariant>> GetVariants();
    }