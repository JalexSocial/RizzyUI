
using System.Globalization;
using TailwindMerge;

namespace RizzyUI.Extensions;

/// <summary>
/// Provides extension methods for the <see cref="TwMerge"/> service.
/// </summary>
internal static class TwMergeExtensions
{
    /// <summary>
    /// Merges CSS class strings, including a class from additional attributes.
    /// </summary>
    /// <param name="twMerge">The TwMerge instance.</param>
    /// <param name="additionalAttributes">A dictionary of additional attributes, which may contain a 'class' key.</param>
    /// <param name="classNames">An array of class strings to merge.</param>
    /// <returns>A merged string of Tailwind CSS classes.</returns>
    public static string? Merge(this TwMerge twMerge, IReadOnlyDictionary<string, object>? additionalAttributes,
        params string[] classNames)
    {
        if (additionalAttributes is null || !additionalAttributes.TryGetValue("class", out var @class))
            return classNames.Length == 1 ? classNames[0] : twMerge.Merge(classNames);

        var classAttributeValue = Convert.ToString(@class, CultureInfo.InvariantCulture);

        if (string.IsNullOrEmpty(classAttributeValue))
            return classNames.Length == 1 ? classNames[0] : twMerge.Merge(classNames);

        if (classNames.Length == 0) return classAttributeValue;

        return twMerge.Merge([.. classNames, classAttributeValue]) ?? string.Empty;
    }
}