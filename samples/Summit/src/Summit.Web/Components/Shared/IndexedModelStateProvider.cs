using System.Collections;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Summit.Web.Components.Shared;

/// <summary>
/// Shows MVC model state errors for collection items (<c>Model.Attendees[0].Name</c>) next to their
/// fields. Rizzy's RzModelStateProvider maps any key containing "[" to a field named after the whole key,
/// which no input matches, so errors for list items are never displayed (summit-findings.md SF-044).
/// Place it next to RzModelStateProvider; delete it when Rizzy resolves indexed keys.
/// </summary>
public sealed partial class IndexedModelStateProvider : ComponentBase
{
    [CascadingParameter] public EditContext? EditContext { get; set; }

    [CascadingParameter] public ModelStateDictionary? ModelState { get; set; }

    protected override void OnParametersSet()
    {
        if (EditContext is null || ModelState is null || ModelState.IsValid)
            return;

        var messages = new ValidationMessageStore(EditContext);
        foreach (var (key, entry) in ModelState)
        {
            if (!key.Contains('[') || entry.Errors.Count == 0)
                continue;
            if (Resolve(EditContext.Model, key) is { } field)
                foreach (var error in entry.Errors)
                    messages.Add(field, error.ErrorMessage);
        }
        EditContext.NotifyValidationStateChanged();
    }

    /// <summary>Walks "Prefix.List[2].Property" from the form model to the item that owns the property.</summary>
    private static FieldIdentifier? Resolve(object model, string key)
    {
        var segments = key.Split('.');
        // Skip the binding prefix ("Model") when the model has no property of that name.
        var start = model.GetType().GetProperty(IndexPattern().Replace(segments[0], "")) is null ? 1 : 0;
        object? current = model;
        for (var i = start; i < segments.Length - 1 && current is not null; i++)
        {
            var match = IndexPattern().Match(segments[i]);
            var name = match.Success ? segments[i][..match.Index] : segments[i];
            current = current.GetType().GetProperty(name)?.GetValue(current);
            if (match.Success && current is IList list)
            {
                var index = int.Parse(match.Groups[1].Value);
                current = index < list.Count ? list[index] : null;
            }
        }
        return current is null ? null : new FieldIdentifier(current, segments[^1]);
    }

    [GeneratedRegex(@"\[(\d+)\]$")]
    private static partial Regex IndexPattern();
}
