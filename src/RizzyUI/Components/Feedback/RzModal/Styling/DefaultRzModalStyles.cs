namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzModal component.
/// </summary>
public class DefaultRzModalStyles : RzStylesBase.RzModalStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzModalStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzModalStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Backdrop =>
        "z-[10004] fixed inset-0 overflow-y-auto overflow-x-hidden bg-background/75 backdrop-brightness-75 backdrop-blur-xs p-4 lg:p-8";

    /// <inheritdoc />
    public override string Dialog =>
        "mx-auto flex w-full flex-col rounded-md bg-background shadow-lg border-outline dark:text-foreground";

    /// <inheritdoc />
    public override string Header =>
        "flex items-center justify-between bg-secondary px-5 py-4 dark:bg-secondary rounded-t-theme";

    /// <inheritdoc />
    public override string TitleContainer => "flex flex-grow flex-row items-center";

    /// <inheritdoc />
    public override string Title => "font-medium text-foreground";

    /// <inheritdoc />
    public override string CloseButtonContainer => "-my-4";

    /// <inheritdoc />
    public override string CloseButton =>
         "leading-5 inline-flex items-center justify-center space-x-2 rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-foreground hover:border-outline hover:text-foreground hover:shadow-sm focus:ring focus:ring-primary/25 active:border-outline active:shadow-none dark:border-transparent dark:text-foreground dark:hover:border-outline dark:hover:text-foreground dark:focus:ring-primary/40 dark:active:border-outline";

    /// <inheritdoc />
    public override string CloseButtonIcon => "size-4 -mx-1 inline-block";

    /// <inheritdoc />
    public override string Body => "p-5";

    /// <inheritdoc />
    public override string Footer => "px-5 py-4 bg-secondary dark:bg-secondary rounded-b-theme border-t border-outline";

    /// <inheritdoc />
    public override string GetSizeCss(ModalSize size)
    {
        return size switch
        {
            ModalSize.ExtraSmall => "max-w-xs",
            ModalSize.Small => "max-w-sm",
            ModalSize.Medium => "max-w-md",
            ModalSize.Large => "max-w-lg",
            ModalSize.ExtraLarge => "max-w-xl",
            ModalSize.TwoXL => "max-w-2xl",
            ModalSize.ThreeXL => "max-w-3xl",
            ModalSize.FourXL => "max-w-4xl",
            ModalSize.FiveXL => "max-w-5xl",
            ModalSize.SixXL => "max-w-6xl",
            ModalSize.SevenXL => "max-w-7xl",
            _ => "max-w-md"
        };
    }
}