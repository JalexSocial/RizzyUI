
    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// Represents a class of slots, defining the contract for slot-based styling.
    /// </summary>
    /// <remarks>
    /// This interface uses static abstract members, requiring C# 11 / .NET 7 or higher.
    /// The source generator provides concrete implementations for <see cref="EnumerateOverrides"/> and <see cref="GetName"/>.
    /// </remarks>
    public interface ISlots
    {
        /// <summary>
        /// Gets the primary or base slot, typically representing the root element of a component.
        /// </summary>
        string? Base { get; }

        /// <summary>
        /// When implemented by the source generator, this method enumerates all per-instance class overrides
        /// defined on a `Slots` object.
        /// </summary>
        /// <returns>
        /// An <see cref="global::System.Collections.Generic.IEnumerable{T}"/> of (SlotName, ClassValue) tuples.
        /// The default implementation returns an empty collection.
        /// </returns>
        public global::System.Collections.Generic.IEnumerable<(string Slot, string Value)> EnumerateOverrides()
        {
            return global::System.Linq.Enumerable.Empty<(string, string)>();
        }

        /// <summary>
        /// When implemented by the source generator, this static method maps a C# property name
        /// to its final slot name, accounting for the `[Slot]` attribute.
        /// </summary>
        /// <param name="propertyName">The C# name of the property to map (e.g., `nameof(Base)`).</param>
        /// <returns>The final slot name as a string.</returns>
        public abstract static string GetName(string propertyName);
    }