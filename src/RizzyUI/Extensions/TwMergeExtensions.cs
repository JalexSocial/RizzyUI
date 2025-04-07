using System.Globalization;
using TailwindMerge;

namespace RizzyUI.Extensions;

internal static class TwMergeExtensions
{
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