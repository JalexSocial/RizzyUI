
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
public partial class RzTextEdit : RzComponent<RzTextEdit.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzTextEdit component.
    /// </summary>
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

    /// <summary>
    /// Gets or sets the cascading EditContext.
    /// </summary>
    [CascadingParameter]
    public EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public required Expression<Func<string>> For { get; set; }

    /// <summary>
    /// Gets or sets the semantic role of the text input (e.g., Text, Password, Email).
    /// </summary>
    [Parameter]
    public TextRole Role { get; set; } = TextRole.Text;

    /// <summary>
    /// Gets or sets the placeholder text for the input field.
    /// </summary>
    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets optional text to prepend inside the input field's visual container.
    /// </summary>
    [Parameter]
    public string? PrependText { get; set; }

    /// <summary>
    /// Gets or sets an optional Blazicon SVG icon to prepend inside the input field's visual container.
    /// </summary>
    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    /// <summary>
    /// Gets a reference to the underlying RzInputText component.
    /// </summary>
    public RzInputText InputTextRef => _elem ?? throw new InvalidOperationException("RzInputText reference is not set.");

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        _role = AdditionalAttributes?.GetValueOrDefault("type", Role.ToString().ToLowerInvariant())?.ToString() ?? Role.ToString().ToLowerInvariant();
        _placeholder = AdditionalAttributes?.GetValueOrDefault("placeholder", Placeholder)?.ToString() ?? Placeholder;
        _value = For!.Compile().Invoke();

        if (!string.IsNullOrEmpty(PrependText) && PrependIcon != null)
            throw new InvalidOperationException(
                $"{nameof(PrependText)} and {nameof(PrependIcon)} cannot both be set at the same time.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTextEdit;

    /// <summary>
    /// Defines the slots available for styling in the RzTextEdit component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the wrapper around the input and prepend element.
        /// </summary>
        public string? InputWrapper { get; set; }
        /// <summary>
        /// The slot for the prepend element container.
        /// </summary>
        public string? PrependElement { get; set; }
        /// <summary>
        /// The slot for the icon within the prepend element.
        /// </summary>
        public string? PrependIconContainer { get; set; }
        /// <summary>
        /// The slot for the `<input>` element.
        /// </summary>
        public string? Input { get; set; }
    }
}