namespace RizzyUI;

/// <summary> Provides default styles for RzCodeViewer. </summary>
public class DefaultRzCodeViewerStyles : RzStylesBase.RzCodeViewerStylesBase
{
    /// <inheritdoc />
    public DefaultRzCodeViewerStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "mt-2 overflow-auto card p-0 rounded-lg";

    /// <inheritdoc />
    public override string Header =>
        "border-b-0 border-outline bg-secondary flex flex-col items-start justify-between gap-4 rounded-md rounded-b-none border px-4 py-1 text-sm text-secondary-foreground md:flex-row md:items-center md:gap-2"; 

    /// <inheritdoc />
    public override string HeaderTitle => "text-foreground";

    /// <inheritdoc />
    public override string CodeContainer =>
        "border-outline w-full overflow-y-auto transition-all !rounded-b-none rounded-b-xl border"; 

    /// <inheritdoc />
    public override string CopyButtonContainer => "flex justify-between";

    /// <inheritdoc />
    public override string CopyButton =>
        "my-auto ml-auto mr-2 overflow-hidden rounded-full p-1 hover:bg-background/10 focus:outline-none focus:outline-offset-0 focus-visible:outline-2 active:-outline-offset-2"; // Use semantic names

    /// <inheritdoc />
    public override string CopyIconDefault =>
        "text-foreground font-bold size-6 cursor-pointer"; // Use semantic names (adjusted for likely contrast)

    /// <inheritdoc />
    public override string CopyIconCopied => "size-6 text-success";

    /// <inheritdoc />
    public override string PreWrapper => "relative overflow-y-auto";

    /// <inheritdoc />
    public override string PreElement =>
        "not-prose text-sm overflow-x-auto p-8 m-0 border-none"; // Use semantic names

    /// <inheritdoc />
    public override string ExpandButton =>
        "border-t-0 border-outline bg-secondary text-foreground flex w-full items-center justify-center gap-2 rounded-md rounded-t-none border p-2 focus:outline-none focus-visible:rounded-t-none focus-visible:border-2 focus-visible:border-primary dark:focus-visible:border-primary"; // Use semantic names

    /// <inheritdoc />
    public override string ExpandIcon => "rotate-0 h-5 w-5 transition";

    /// <inheritdoc />
    public override string GetExpandContentCss(bool isExpanded)
    {
        return isExpanded ? "" : "max-h-60";
    }

    /// <inheritdoc />
    public override string GetExpandButtonIconCss(bool isExpanded)
    {
        return isExpanded ? "rotate-180" : "rotate-0";
    }

    /// <inheritdoc />
    public override string GetCopyButtonStateCss(bool isCopied)
    {
        return isCopied ? "focus-visible:outline-success" : "focus-visible:outline-foreground";
        // Use semantic names
    }
}