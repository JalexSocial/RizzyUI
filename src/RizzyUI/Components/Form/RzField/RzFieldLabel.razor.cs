using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Rizzy.Htmx;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders a <c>label</c> element typically associated with a form input within an <see cref="RzField" />.
///     Automatically determines the 'for' attribute and infers the display name from the bound field if not explicitly
///     set.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
[CascadingTypeParameter(nameof(TValue))] // Hint for type inference if used generically
public partial class RzFieldLabel<TValue> : RzComponent
{
    private string? _effectiveDisplayName; // Store the calculated display name

    private string _for = string.Empty;

    [CascadingParameter] private HttpContext? HttpContext { get; set; }
    [CascadingParameter] private EditContext? EditContext { get; set; }

    /// <summary> Optional child content, often used for required indicators or icons. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Specifies the field the label is associated with. Used to determine the 'for' attribute and infer
    ///     DisplayName.
    /// </summary>
    [Parameter]
    public Expression<Func<TValue>>? For { get; set; }

    /// <summary>
    ///     Explicitly sets the text content of the label. If not set, it's inferred from the 'For' expression's display
    ///     attributes or member name.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        if (EditContext is null) return; // Should have been caught in OnInitialized, but defensive check

        SetEffectiveDisplayName(); // Calculate display name
        SetForAttribute(); // Calculate 'for' attribute

        base.OnParametersSet();
    }

    private void SetEffectiveDisplayName()
    {
        // If DisplayName is explicitly set, use it.
        if (!string.IsNullOrEmpty(DisplayName))
        {
            _effectiveDisplayName = DisplayName;
            return;
        }

        // If For is not provided, we can't infer, leave it null/empty.
        if (For == null)
        {
            _effectiveDisplayName = null;
            return;
        }

        // Try to infer from DisplayAttribute or member name
        if (For.Body is MemberExpression memberExpression)
        {
            var displayAttribute = memberExpression.Member.GetCustomAttribute<DisplayAttribute>(true);
            _effectiveDisplayName =
                displayAttribute?.GetName() ?? memberExpression.Member.Name; // GetName handles resources
        }
        else
        {
            // Fallback if For is not a simple MemberExpression (less likely for labels)
            _effectiveDisplayName = For.ToString(); // Or some other default
        }
    }

    private void SetForAttribute()
    {
        _for = string.Empty; // Reset
        if (For != null && HttpContext != null && EditContext != null)
            try
            {
                var field = FieldIdentifier.Create(For);
                var fieldMap = HttpContext.GetOrAddFieldMapping(EditContext); // Use extension method

                if (fieldMap != null && fieldMap.TryGetValue(field, out var map) && map != null)
                    _for = map.Id;
            }
            catch (ArgumentException)
            {
                // Handle cases where For expression is not suitable for FieldIdentifier (e.g., complex expressions)
                // In this case, _for remains empty, and the label won't have a 'for' attribute.
            }
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzFieldLabel.Label);
    }
}