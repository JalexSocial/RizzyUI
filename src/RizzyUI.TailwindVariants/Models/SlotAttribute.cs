using System;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Associates a custom name with a slot property. When applied, this name is used
/// for the final slot identifier instead of the property's name.
/// </summary>
/// <remarks>
/// This is particularly useful for generating kebab-case names (e.g., "item-title")
/// from PascalCase C# properties (e.g., "ItemTitle").
/// </remarks>
[AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
public sealed class SlotAttribute : Attribute
{
    /// <summary>
    /// Gets the custom name for the slot.
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="SlotAttribute"/> class with a specified slot name.
    /// </summary>
    /// <param name="name">The custom name for the slot (e.g., "item-title").</param>
    public SlotAttribute(string name)
    {
        Name = name;
    }
}