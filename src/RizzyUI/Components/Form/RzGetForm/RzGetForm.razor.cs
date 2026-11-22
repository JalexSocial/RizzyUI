using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A <c>&lt;form method="get"&gt;</c> for searches and filters that RizzyUI's inputs work in (Summit
/// SF-028). The inputs need a cascading <see cref="EditContext"/>; <c>EditForm</c> provides one but
/// renders a POST form with an antiforgery token and a <c>_handler</c> field, which a GET form would put
/// in the query string and the pushed URL. RzGetForm provides the <see cref="EditContext"/> for
/// <see cref="Model"/> and renders a plain GET form.
/// </summary>
public partial class RzGetForm : RzComponent<RzGetForm.Slots>
{
    /// <summary>Defines the default styling for <see cref="RzGetForm"/> (none).</summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "");

    private EditContext? _editContext;
    private object? _model;

    /// <summary>The model the inputs bind to (with <c>For</c>).</summary>
    [Parameter, EditorRequired] public object Model { get; set; } = default!;

    /// <summary>The form's <c>action</c>; the current URL when not set.</summary>
    [Parameter] public string? Action { get; set; }

    /// <summary>The form content.</summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (Model is null)
            throw new InvalidOperationException($"{nameof(RzGetForm)} requires a {nameof(Model)}.");
        if (!ReferenceEquals(_model, Model))
        {
            _model = Model;
            _editContext = new EditContext(Model);
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzGetForm;

    /// <summary>Defines the slots available for styling in <see cref="RzGetForm"/>.</summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>The form element.</summary>
        [Slot("get-form")]
        public string? Base { get; set; }
    }
}
