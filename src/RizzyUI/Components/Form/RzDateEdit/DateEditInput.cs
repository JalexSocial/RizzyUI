using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Rizzy;

namespace RizzyUI;

/// <summary>
/// The text input rendered by <see cref="RzDateEdit"/>. It derives from Rizzy's date input so the
/// <c>name</c> attribute is the one Blazor form binding expects (including nested paths and form
/// prefixes), the field is registered for labels and validation messages, and validation
/// attributes are added. Unlike <c>InputDate</c> it renders <c>type="text"</c> with the value in
/// the Flatpickr display format, because Flatpickr owns the date picking.
/// </summary>
internal sealed class DateEditInput : RzInputDateBase<DateTime?>
{
    /// <summary>
    /// The .NET format of the displayed value (converted from the Flatpickr <c>dateFormat</c>), or
    /// <c>null</c> for ISO <c>yyyy-MM-dd</c>.
    /// </summary>
    [Parameter]
    public string? DotNetFormat { get; set; }

    /// <inheritdoc />
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        builder.OpenElement(0, "input");
        builder.AddMultipleAttributes(1, AdditionalAttributes);
        builder.AddAttribute(2, "type", "text");
        if (!string.IsNullOrEmpty(NameAttributeValue))
            builder.AddAttribute(3, "name", NameAttributeValue);
        builder.AddAttribute(4, "class", CssClass);
        builder.AddAttribute(5, "value", CurrentValueAsString);
        builder.CloseElement();
    }

    /// <inheritdoc />
    protected override string FormatValueAsString(DateTime? value) =>
        value?.ToString(DotNetFormat ?? "yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty;

    /// <inheritdoc />
    protected override bool TryParseValueFromString(string? value, out DateTime? result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        if (string.IsNullOrEmpty(value))
        {
            result = null;
            validationErrorMessage = null;
            return true;
        }

        if (DateTime.TryParseExact(value, DotNetFormat ?? "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
        {
            result = parsed;
            validationErrorMessage = null;
            return true;
        }

        result = null;
        validationErrorMessage = string.Format(CultureInfo.CurrentCulture, ParsingErrorMessage, DisplayName ?? FieldIdentifier.FieldName);
        return false;
    }
}
