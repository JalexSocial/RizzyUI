namespace Summit.Web.Components.Shared;

/// <summary>Class lists that work around RizzyUI styling gaps. Each names its finding.</summary>
public static class SummitClasses
{
    /// <summary>
    /// SF-052: RzInputTextArea renders without the shared input styles (border, background, padding,
    /// focus ring), so a textarea is unstyled. These are FormInputStyles' classes, minus the fixed height.
    /// Remove when RzInputTextArea inherits them again.
    /// </summary>
    public const string TextArea =
        "placeholder:text-muted-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs " +
        "transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm " +
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 " +
        "dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
}
