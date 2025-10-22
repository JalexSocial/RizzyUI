
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Rizzy.Htmx;
using RizzyUI.Extensions;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders a <c>label</c> element typically associated with a form input within an <see cref="RzField" />.
///     Automatically determines the 'for' attribute and infers the display name from the bound field if not explicitly
///     set.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
[CascadingTypeParameter(nameof(TValue))]
public partial class RzFieldLabel<TValue> : RzComponent<RzFieldLabelSlots>
{
    private string? _effectiveDisplayName;
    private string _for = string.Empty;

    [CascadingParameter] private HttpContext? HttpContext { get; set; }
    [CascadingParameter] private EditContext? EditContext { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public Expression<Func<TValue>>? For { get; set; }

    [Parameter]
    public string? DisplayName { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    protected override void OnParametersSet()
    {
        if (EditContext is null) return;

        SetEffectiveDisplayName();
        SetForAttribute();

        base.OnParametersSet();
    }

    private void SetEffectiveDisplayName()
    {
        if (!string.IsNullOrEmpty(DisplayName))
        {
            _effectiveDisplayName = DisplayName;
            return;
        }

        if (For == null)
        {
            _effectiveDisplayName = null;
            return;
        }

        if (For.Body is MemberExpression memberExpression)
        {
            var displayAttribute = memberExpression.Member.GetCustomAttribute<DisplayAttribute>(true);
            _effectiveDisplayName =
                displayAttribute?.GetName() ?? memberExpression.Member.Name;
        }
        else
        {
            _effectiveDisplayName = For.ToString();
        }
    }

    private void SetForAttribute()
    {
        _for = string.Empty;
        if (For != null && HttpContext != null && EditContext != null)
            try
            {
                var field = FieldIdentifier.Create(For);
                var fieldMap = HttpContext.GetOrAddFieldMapping(EditContext);

                if (fieldMap != null && fieldMap.TryGetValue(field, out var map) && map != null)
                    _for = map.Id;
            }
            catch (ArgumentException)
            {
                // Handle cases where For expression is not suitable for FieldIdentifier
            }
    }

    protected override TvDescriptor<RzComponent<RzFieldLabelSlots>, RzFieldLabelSlots> GetDescriptor() => Theme.RzFieldLabel;
}