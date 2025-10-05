
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzDialog component family.
/// </summary>
public class DefaultRzDialogStyles : RzStylesBase.RzDialogStylesBase
{
    public DefaultRzDialogStyles(RzTheme theme) : base(theme) { }

    public override string Backdrop => "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50";
    
    public override string Dialog => "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg";

    public override string Header => "flex flex-col gap-2 text-center sm:text-left";

    public override string Footer => "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end";

    public override string Title => "text-lg leading-none font-semibold";

    public override string Description => "text-muted-foreground text-sm";

    public override string CloseButton => "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none";

    public override string CloseButtonIcon => "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

    public override string GetSizeCss(ModalSize size)
    {
        return size switch
        {
            ModalSize.ExtraSmall => "sm:max-w-xs",
            ModalSize.Small => "sm:max-w-sm",
            ModalSize.Medium => "sm:max-w-md",
            ModalSize.Large => "sm:max-w-lg",
            ModalSize.ExtraLarge => "sm:max-w-xl",
            ModalSize.TwoXL => "sm:max-w-2xl",
            ModalSize.ThreeXL => "sm:max-w-3xl",
            ModalSize.FourXL => "sm:max-w-4xl",
            ModalSize.FiveXL => "sm:max-w-5xl",
            ModalSize.SixXL => "sm:max-w-6xl",
            ModalSize.SevenXL => "sm:max-w-7xl",
            _ => "sm:max-w-lg"
        };
    }
}