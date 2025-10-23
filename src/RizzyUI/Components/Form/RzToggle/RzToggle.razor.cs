
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders a toggle switch (styled checkbox) component.
///     Styling is determined by the active <see cref="RzTheme" />. It should be used within an EditForm context.
/// </xmldoc>
public partial class RzToggle : RzComponent<RzToggle.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzToggle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "appearance-none focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 bg-input dark:bg-input/80 checked:bg-primary dark:checked:bg-primary before:content-[''] before:pointer-events-none before:block before:size-4 before:rounded-full before:ring-0 before:transition-all before:bg-background dark:before:bg-foreground dark:checked:before:bg-primary-foreground checked:before:ms-3.5"
    );

    private bool _currentValue;
    private FieldIdentifier _fieldIdentifier;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the current value of the toggle.
    /// </summary>
    [Parameter]
    public bool? Value { get; set; }

    /// <summary>
    /// Gets or sets an event callback that is invoked when the value changes.
    /// </summary>
    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<bool>>? For { get; set; }

    /// <summary>
    /// Gets or sets the current value of the toggle, managing state and notifying changes.
    /// </summary>
    protected bool CurrentValue
    {
        get => _currentValue;
        set
        {
            if (_currentValue != value)
            {
                _currentValue = value;
                InvokeAsync(async () =>
                {
                    Value = _currentValue;
                    await ValueChanged.InvokeAsync(_currentValue);
                    EditContext?.NotifyFieldChanged(_fieldIdentifier);
                });
            }
        }
    }

    /// <summary>
    /// Gets the string representation of the `aria-checked` attribute value.
    /// </summary>
    protected string AriaCheckedValue => CurrentValue ? "true" : "false";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        _currentValue = Value ?? For.Compile().Invoke();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For?.Compile().Invoke() ?? false;
        if (_currentValue != newValue) _currentValue = newValue;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzToggle;

    /// <summary>
    /// Defines the slots available for styling in the RzToggle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}