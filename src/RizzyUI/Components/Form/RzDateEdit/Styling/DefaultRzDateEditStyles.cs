
namespace RizzyUI;

/// <summary> Provides default styles for RzDateEdit. </summary>
public class DefaultRzDateEditStyles : RzStylesBase.RzDateEditStylesBase
{
    /// <inheritdoc />
    public DefaultRzDateEditStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "w-full";

    /// <inheritdoc />
    public override string InputWrapper => "relative";

    /// <inheritdoc />
    public override string PrependElement =>
        "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground"; // Adjusted for kitchen sink input style

    /// <inheritdoc />
    public override string PrependIconContainer => "size-4"; // Match kitchen sink icon size

    /// <inheritdoc />
    public override string Input =>
        "appearance-none file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flatpickr-input"; // Matches kitchen sink input[type='date'] and general input
}