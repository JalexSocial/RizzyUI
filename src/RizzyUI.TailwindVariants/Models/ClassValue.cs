
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    namespace RizzyUI.TailwindVariants;

    /// <summary>
    /// Represents a small wrapper over one or more CSS class fragments.
    /// Allows implicit conversion from/to string.
    /// </summary>
    public class ClassValue : IEnumerable<string>
    {
        private readonly List<string> _values = [];

        /// <summary>
        /// An empty, shared ClassValue instance.
        /// </summary>
        public static readonly ClassValue Empty = new();

        /// <summary>
        /// Create an empty ClassValue.
        /// </summary>
        public ClassValue() { }

        /// <summary>
        /// Create a ClassValue from a single string.
        /// </summary>
        /// <param name="value">The class string.</param>
        public ClassValue(string? value)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _values.Add(value);
            }
        }

        /// <summary>
        /// Implicit conversion from string to ClassValue.
        /// </summary>
        public static implicit operator ClassValue(string? value) => new(value);

        /// <summary>
        /// Add a single class fragment to the collection.
        /// </summary>
        /// <param name="value">A single class fragment.</param>
        public void Add(string value)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _values.Add(value);
            }
        }

        /// <inheritdoc/>
        public IEnumerator<string> GetEnumerator() => _values.GetEnumerator();

        /// <summary>
        /// Conversion from ClassValue to string.
        /// Will return the joined values.
        /// </summary>
        public override string ToString() => string.Join(" ", _values);

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }