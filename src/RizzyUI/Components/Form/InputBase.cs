
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public abstract partial class InputBase<TValue, TSlots> : RzComponent<TSlots>
    where TSlots : class, ISlots, new()
{
    [Parameter, EditorRequired]
    public required Expression<Func<TValue>> For { get; set; }

    [Parameter]
    public TValue? Value { get; set; }

    [Parameter]
    public string? DisplayName { get; set; }

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    private FieldIdentifier _fieldIdentifier;

    protected bool IsInvalid => EditContext?.GetValidationMessages(_fieldIdentifier).Any() ?? false;

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

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (For != null)
        {
            _fieldIdentifier = FieldIdentifier.Create(For);
        }
    }
}