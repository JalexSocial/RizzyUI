
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Rizzy.Htmx;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying the label for a form field, with support for automatically inferring the text and `for` attribute from a model expression.
/// </summary>
public partial class FieldLabel<TValue> : RzComponent<FieldLabelSlots>, IHasFieldLabelStylingProperties
{
    private string? _effectiveDisplayName;
    private string? _effectiveForId;

    [CascadingParameter] private HttpContext? HttpContext { get; set; }
    [CascadingParameter] private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the label. If set, this will be rendered instead of any text inferred from `DisplayName` or `For`.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value, used to determine the `for` attribute and infer the display name.
    /// </summary>
    [Parameter]
    public Expression<Func<TValue>>? For { get; set; }

    /// <summary>
    /// Gets or sets the ID of the form control associated with this label. When specified, this value takes precedence over automatic ID resolution from <see cref="For"/>.
    /// </summary>
    [Parameter]
    public string? ForId { get; set; }

    /// <summary>
    /// Gets or sets the display name for the label. If not set, it's inferred from the `For` expression's `DisplayAttribute` or property name.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "label";

        if (EditContext == null && For != null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm when using the 'For' parameter.");
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        SetEffectiveDisplayName();
        SetEffectiveForId();
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
            _effectiveDisplayName = displayAttribute?.GetName() ?? memberExpression.Member.Name;
        }
        else
        {
            _effectiveDisplayName = For.ToString();
        }
    }

    private void SetEffectiveForId()
    {
        if (!string.IsNullOrWhiteSpace(ForId))
        {
            _effectiveForId = ForId;
            return;
        }

        _effectiveForId = null;

        if (For == null || HttpContext == null || EditContext == null)
        {
            return;
        }

        try
        {
            var field = FieldIdentifier.Create(For);
            var fieldMap = HttpContext.GetOrAddFieldMapping(EditContext);

            if (fieldMap != null &&
                fieldMap.TryGetValue(field, out var map) &&
                map != null &&
                !string.IsNullOrWhiteSpace(map.Id))
            {
                _effectiveForId = map.Id;
            }
        }
        catch (ArgumentException)
        {
            // Handle cases where For expression is not suitable for FieldIdentifier
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<FieldLabelSlots>, FieldLabelSlots> GetDescriptor() => Theme.FieldLabel;
}