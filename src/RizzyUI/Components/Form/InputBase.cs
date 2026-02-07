
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
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
            var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase);
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

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (For != null)
        {
            _fieldIdentifier = FieldIdentifier.Create(For);
        }
    }
}
