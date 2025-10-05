
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    public abstract class RzDialogStylesBase
    {
        protected readonly RzTheme Theme;
        protected RzDialogStylesBase(RzTheme theme) { Theme = theme; }

        public abstract string Backdrop { get; }
        public abstract string Dialog { get; }
        public abstract string Header { get; }
        public abstract string Footer { get; }
        public abstract string Title { get; }
        public abstract string Description { get; }
        public abstract string CloseButton { get; }
        public abstract string CloseButtonIcon { get; }
        public abstract string GetSizeCss(ModalSize size);
    }
}