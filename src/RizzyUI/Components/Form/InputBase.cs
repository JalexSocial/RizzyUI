
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Rizzy;
using Rizzy.Htmx;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides common form-field behavior for RizzyUI input components.
/// </summary>
/// <typeparam name="TValue">The bound value type.</typeparam>
/// <typeparam name="TSlots">The slots type used for Tailwind variant styling.</typeparam>
public abstract partial class InputBase<TValue, TSlots> : RzComponent<TSlots>
    where TSlots : class, ISlots, new()
{
    /// <summary>
    /// Gets or sets the bound model expression used for validation metadata.
    /// </summary>
    [Parameter, EditorRequired]
    public required Expression<Func<TValue>> For { get; set; }

    /// <summary>
    /// Gets or sets the current value for the input.
    /// </summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets a display-friendly field name.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    private FieldIdentifier _fieldIdentifier;

    /// <summary>
    /// Gets a value indicating whether the current field has validation errors.
    /// </summary>
    protected bool IsInvalid => EditContext?.GetValidationMessages(_fieldIdentifier).Any() ?? false;

    /// <summary>
    /// Gets the input attributes merged with validation accessibility attributes.
    /// </summary>
    protected Dictionary<string, object?> InputAttributes
    {
        get
        {
            var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase);
            if (IsInvalid)
            {
                attributes["aria-invalid"] = "true";
            }
            return attributes;
        }
    }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
    }

    /// <summary>
    /// Initializes the component and records the generated default <see cref="RzComponent{TSlots}.Id"/>,
    /// so an <c>Id</c> set by the caller can be told apart from it.
    /// </summary>
    protected InputBase()
    {
        _generatedId = Id;
    }

    private readonly string _generatedId;

    [CascadingParameter]
    private HttpContext? HttpContext { get; set; }

    /// <summary>
    /// Gets a value indicating whether <see cref="RzComponent{TSlots}.Id"/> is rendered on the
    /// labelable form control, so the field's label can point at it. Components that render
    /// <c>Id</c> on a wrapper element return <c>false</c>.
    /// </summary>
    protected virtual bool IdIsLabelTarget => true;

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (For != null)
        {
            _fieldIdentifier = FieldIdentifier.Create(For);
        }

        if (IdIsLabelTarget && HttpContext != null && EditContext != null && For != null)
            ResolveFieldId(HttpContext, EditContext);
    }

    /// <summary>
    /// Aligns <see cref="RzComponent{TSlots}.Id"/> with the field mapping that
    /// <see cref="FieldLabel{TValue}"/> reads. Without an explicit <c>Id</c>, the component uses the id
    /// already registered or reserved for the field (a label rendered earlier reserves one). An
    /// explicit <c>Id</c> is written into a reservation, so the Rizzy input registers the id that is
    /// rendered.
    /// </summary>
    private void ResolveFieldId(HttpContext httpContext, EditContext editContext)
    {
        if (Id == _generatedId)
        {
            Id = httpContext.GetOrReserveFieldId(editContext, _fieldIdentifier);
            return;
        }

        var mapping = httpContext.GetOrAddFieldMapping(editContext);
        if (!mapping.TryGetValue(_fieldIdentifier, out var existing))
            mapping[_fieldIdentifier] = new RzFormFieldMap { Id = Id };
        else if (string.IsNullOrEmpty(existing.FieldName))
            existing.Id = Id;
    }
}
