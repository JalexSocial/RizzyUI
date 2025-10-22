
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
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "appearance-none focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 bg-input dark:bg-input/80 checked:bg-primary dark:checked:bg-primary before:content-[''] before:pointer-events-none before:block before:size-4 before:rounded-full before:ring-0 before:transition-all before:bg-background dark:before:bg-foreground dark:checked:before:bg-primary-foreground checked:before:ms-3.5"
    );

    private bool _currentValue;
    private FieldIdentifier _fieldIdentifier;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    [Parameter]
    public bool? Value { get; set; }

    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    [Parameter, EditorRequired]
    public Expression<Func<bool>>? For { get; set; }

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

    protected string AriaCheckedValue => CurrentValue ? "true" : "false";

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

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For?.Compile().Invoke() ?? false;
        if (_currentValue != newValue) _currentValue = newValue;
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzToggle;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}