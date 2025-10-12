using System.Collections;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Represents a small wrapper over one or more CSS class fragments.
/// Allows implicit conversion from/to string.
/// </summary>
public class ClassValue : IEnumerable<string>
{
    private readonly string? _value;
    private List<string>? _values;

    /// <summary>
    /// Create an empty ClassValue.
    /// </summary>
    public ClassValue()
    { }

    /// <summary>
    /// Create a ClassValue from a single string.
    /// </summary>
    /// <param name="value">The class string.</param>
    public ClassValue(string? value) => _value = value;

    /// <summary>
    /// Implicit conversion from string to ClassValue.
    /// </summary>
    public static implicit operator ClassValue(string? value) => new(value);

    /// <summary>
    /// Add a single class fragment to the collection.
    /// </summary>
    /// <param name="value">A single class fragment.</param>
    public void Add(string value) => (_values ??= []).Add(value);

    /// <inheritdoc/>
    public IEnumerator<string> GetEnumerator()
    {
        if (_values is not null)
        {
            return _values.GetEnumerator();
        }

        if (!string.IsNullOrEmpty(_value))
        {
            return new List<string> { _value }.GetEnumerator();
        }

        return Enumerable.Empty<string>().GetEnumerator();
    }

    /// <summary>
    /// Conversion from ClassValue to string.
    /// Will return the underlying string or the joined values.
    /// </summary>
    public override string ToString()
    {
        if (!string.IsNullOrEmpty(_value))
        {
            return _value!;
        }

        if (_values is not null && _values.Count > 0)
        {
            return string.Join(" ", _values);
        }

        return string.Empty;
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}