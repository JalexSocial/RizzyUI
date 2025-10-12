namespace RizzyUI.TailwindVariants.SourceGenerators.Helpers;

internal static class SourceGenerationHelper
{
    public const string Attribute = """
        using System;

        namespace RizzyUI.TailwindVariants;

        /// <summary>
        /// Associates a custom name with a slot property, typically for use in data attributes like `data-slot`.
        /// </summary>
        [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
        public sealed class SlotAttribute : Attribute
        {
            /// <summary>
            /// The custom name for the slot.
            /// </summary>
            public string Name { get; }

            /// <summary>
            /// Initializes a new instance of the <see cref="SlotAttribute"/> class.
            /// </summary>
            /// <param name="name">The custom name for the slot (e.g., "item-title").</param>
            public SlotAttribute(string name)
            {
                Name = name;
            }
        }
        """;
}