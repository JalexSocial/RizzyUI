
    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// Represents a class of slots (the minimal contract).
    /// </summary>
    /// <remarks>
    /// This interface uses a static abstract member, which requires C# 11 / .NET 7 or higher.
    /// The default implementation of <see cref="EnumerateOverrides"/> is a no-op and is intended
    /// to be replaced by the source generator.
    /// </remarks>
    public interface ISlots
    {
        /// <summary>
        /// Gets the primary or base slot, which is commonly the root element.
        /// </summary>
        string? Base { get; }

        /// <summary>
        /// A default interface member that can be implemented by a derived class or by the source generator.
        /// When implemented, it enumerates all slot overrides as a collection of slot names and their corresponding values.
        /// </summary>
        /// <returns>
        /// An <see cref="global::System.Collections.Generic.IEnumerable{T}"/> of tuples containing the slot name and its value.
        /// </returns>
        public global::System.Collections.Generic.IEnumerable<(string Slot, string Value)> EnumerateOverrides()
        {
            return global::System.Linq.Enumerable.Empty<(string, string)>();
        }

        /// <summary>
        /// Returns the slot name associated with a property. This method is implemented by the source generator.
        /// </summary>
        /// <param name="propertyName">The name of the property to map.</param>
        public abstract static string GetName(string propertyName);
    }