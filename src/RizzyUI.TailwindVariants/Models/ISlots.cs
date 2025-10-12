namespace RizzyUI.TailwindVariants;

/// <summary>
/// Represents a class of slots (the minimal contract).
/// </summary>
public interface ISlots
{
    /// <summary>
    /// Gets the primary or base slot, which is commonly the root element.
    /// </summary>
    string? Base { get; }

    /// <summary>
    /// Enumerates all slot overrides as a collection of slot names and their corresponding values.
    /// </summary>
    /// <returns>
    /// An <see cref="IEnumerable{T}"/> of tuples containing the slot name and its value.
    /// </returns>
    IEnumerable<(string Slot, string Value)> EnumerateOverrides();

    /// <summary>
    /// Returns the slot name associated with a property.
    /// </summary>
    public abstract static string GetName(string slot);
}