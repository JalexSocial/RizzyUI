
using Microsoft.AspNetCore.Components;
using System.Diagnostics.CodeAnalysis;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A form component that renders a native &lt;select&gt; element with custom styling matching the design system.
/// Supports generic value binding.
/// </summary>
/// <typeparam name="TValue">The type of the value being bound (e.g., string, int, enum).</typeparam>
public partial class RzNativeSelect<TValue> : InputBase<TValue, RzNativeSelectSlots>, IHasRzNativeSelectStylingProperties
{
    /// <summary>
    /// Gets or sets the child content, typically <see cref="RzNativeSelectOption"/> or <see cref="RzNativeSelectOptGroup"/> components,
    /// or standard HTML &lt;option&gt; elements.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets an event callback that is invoked when the value changes.
    /// </summary>
    [Parameter] public EventCallback<TValue> ValueChanged { get; set; }


    /// <summary>
    /// Gets or sets an additional aria-describedby value to append to descriptions already present in attributes.
    /// </summary>
    [Parameter]
    public string? AriaDescribedBy { get; set; }

    /// <summary>
    /// Gets the input attributes with 'class' and 'style' removed to prevent duplication on the inner select element,
    /// as these are applied to the wrapper via AdditionalAttributes.
    /// </summary>
    protected Dictionary<string, object?> SanitizedInputAttributes
    {
        get
        {
            var attrs = new Dictionary<string, object?>(InputAttributes);
            attrs.Remove("class");
            attrs.Remove("style");

            if (TryGetAttributeString(attrs, "aria-describedby", out var existingDescribedBy))
            {
                attrs["aria-describedby"] = JoinSpaceSeparatedTokens(existingDescribedBy, AriaDescribedBy);
            }
            else if (!string.IsNullOrWhiteSpace(AriaDescribedBy))
            {
                attrs["aria-describedby"] = AriaDescribedBy;
            }

            return attrs;
        }
    }


    private static string JoinSpaceSeparatedTokens(string? first, string? second)
    {
        var firstTokens = (first ?? string.Empty).Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var secondTokens = (second ?? string.Empty).Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return string.Join(' ', firstTokens.Concat(secondTokens).Distinct(StringComparer.Ordinal));
    }

    private static bool TryGetAttributeString(Dictionary<string, object?> attributes, string name, [NotNullWhen(true)] out string? value)
    {
        if (attributes.TryGetValue(name, out var rawValue) && rawValue is not null)
        {
            value = rawValue.ToString();
            return !string.IsNullOrWhiteSpace(value);
        }

        value = null;
        return false;
    }
    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzNativeSelectSlots>, RzNativeSelectSlots> GetDescriptor() => Theme.RzNativeSelect;
}