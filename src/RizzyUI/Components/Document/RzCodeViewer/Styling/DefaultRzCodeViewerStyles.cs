namespace RizzyUI.Components.Document.RzCodeViewer.Styling;

/// <summary> Provides default styles for RzCodeViewer. </summary>
public class DefaultRzCodeViewerStyles : RzStylesBase.RzCodeViewerStylesBase
{
    public DefaultRzCodeViewerStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container => "mt-2 overflow-auto";
    /// <inheritdoc/>
    public override string Header => $"border-b-0 border-outline bg-surface-alt flex flex-col items-start justify-between gap-4 rounded-theme rounded-b-none border p-4 text-sm text-slate-400 md:flex-row md:items-center md:gap-2"; // Use semantic names
    /// <inheritdoc/>
    public override string HeaderTitle => $"text-on-surface"; // Use semantic names
    /// <inheritdoc/>
    public override string CodeContainer => $"border-outline w-full overflow-y-auto transition-all !rounded-b-none rounded-b-xl border"; // Use semantic names
    /// <inheritdoc/>
    public override string CopyButtonContainer => $"border-surface-tertiary/70 bg-surface-tertiary text-on-surface-tertiary flex h-11 items-center justify-between border-b"; // Use semantic names
    /// <inheritdoc/>
    public override string CopyButton => $"my-auto ml-auto mr-2 overflow-hidden rounded-full p-1 hover:bg-surface/10 focus:outline-none focus:outline-offset-0 focus-visible:outline-2 active:-outline-offset-2"; // Use semantic names
    /// <inheritdoc/>
    public override string CopyIconDefault => $"text-on-surface-strong size-6 cursor-pointer"; // Use semantic names (adjusted for likely contrast)
    /// <inheritdoc/>
    public override string CopyIconCopied => "size-6 text-emerald-500"; // Keep specific color for success state
    /// <inheritdoc/>
    public override string PreWrapper => "relative overflow-y-auto";
    /// <inheritdoc/>
    public override string PreElement => $"text-on-surface/60 overflow-x-auto text-sm p-8 border-none"; // Use semantic names
    /// <inheritdoc/>
    public override string ExpandButton => $"border-t-0 border-outline bg-surface-alt text-on-surface flex w-full items-center justify-center gap-2 rounded-theme rounded-t-none border p-2 focus:outline-none focus-visible:rounded-t-none focus-visible:border-2 focus-visible:border-primary dark:focus-visible:border-primary"; // Use semantic names
    /// <inheritdoc/>
    public override string ExpandIcon => "rotate-0 h-5 w-5 transition";

    /// <inheritdoc/>
    public override string GetExpandContentCss(bool isExpanded) => isExpanded ? "" : "max-h-60";
    /// <inheritdoc/>
    public override string GetExpandButtonIconCss(bool isExpanded) => isExpanded ? "rotate-180" : "rotate-0";
    /// <inheritdoc/>
    public override string GetCopyButtonStateCss(bool isCopied) => isCopied ? $"focus-visible:outline-success" : $"focus-visible:outline-on-surface-strong"; // Use semantic names
}