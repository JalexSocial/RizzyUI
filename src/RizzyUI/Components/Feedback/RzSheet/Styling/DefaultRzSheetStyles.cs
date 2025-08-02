// src/RizzyUI/Components/Feedback/RzSheet/Styling/DefaultRzSheetStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzSheet component family.
/// </summary>
public class DefaultRzSheetStyles : RzStylesBase.RzSheetStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzSheetStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzSheetStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Overlay => "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";

    /// <inheritdoc />
    public override string Content => "fixed z-50 flex flex-col gap-4 bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out ";

    /// <inheritdoc />
    public override string CloseButton => "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none";

    /// <inheritdoc />
    public override string CloseButtonIcon => "size-4";

    /// <inheritdoc />
    public override string Header => "flex flex-col gap-1.5 p-6 text-center sm:text-left";

    /// <inheritdoc />
    public override string Footer => "mt-auto flex flex-col gap-2 p-6";

    /// <inheritdoc />
    public override string Title => "text-lg font-semibold text-foreground";

    /// <inheritdoc />
    public override string Description => "text-sm text-muted-foreground";

    /// <inheritdoc />
    public override string GetSideCss(SheetSide side)
    {
        return side switch
        {
            SheetSide.Top => "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            SheetSide.Bottom => "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            SheetSide.Left => "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
            SheetSide.Right => "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            _ => GetSideCss(SheetSide.Right)
        };
    }
}