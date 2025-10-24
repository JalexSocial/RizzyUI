
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a customizable text input component, potentially used within an <see cref="RzTextField" />.
///     Supports prepended text or icons. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTextEdit : InputBase<string, RzTextEdit.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.InputWrapper] = "relative",
            [s => s.PrependElement] = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground",
            [s => s.PrependIconContainer] = "size-4",
            [s => s.Input] = "appearance-none file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        }
    );

    private RzInputText? _elem;
    private string _placeholder = string.Empty;
    private string _role = "text";
    private string _value = string.Empty;

    [CascadingParameter]
    public EditContext? EditContext { get; set; }

    [Parameter]
    public TextRole Role { get; set; } = TextRole.Text;

    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    [Parameter]
    public string? PrependText { get; set; }

    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    public RzInputText InputTextRef => _elem ?? throw new InvalidOperationException("RzInputText reference is not set.");

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        _role = GetParameterValue("type", Role.ToString().ToLowerInvariant());
        _placeholder = GetParameterValue("placeholder", Placeholder);
        _value = For!.Compile().Invoke();

        if (!string.IsNullOrEmpty(PrependText) && PrependIcon != null)
            throw new InvalidOperationException(
                $"{nameof(PrependText)} and {nameof(PrependIcon)} cannot both be set at the same time.");
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTextEdit;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? InputWrapper { get; set; }
        public string? PrependElement { get; set; }
        public string? PrependIconContainer { get; set; }
        public string? Input { get; set; }
    }
}