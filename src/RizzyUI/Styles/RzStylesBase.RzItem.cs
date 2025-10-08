
// src/RizzyUI/Styles/RzStylesBase.RzItem.cs
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    public abstract class RzItemGroupStylesBase
    {
        protected readonly RzTheme Theme;
        protected RzItemGroupStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Group { get; }
    }

    public abstract class RzItemSeparatorStylesBase
    {
        protected readonly RzTheme Theme;
        protected RzItemSeparatorStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Separator { get; }
    }

    public abstract class RzItemStylesBase
    {
        protected readonly RzTheme Theme;
        protected RzItemStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string ItemBase { get; }
        public abstract string GetVariantCss(ItemVariant variant);
        public abstract string GetSizeCss(Size size);
    }

    public abstract class ItemMediaStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemMediaStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string MediaBase { get; }
        public abstract string GetVariantCss(ItemMediaVariant variant);
    }

    public abstract class ItemContentStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemContentStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Content { get; }
    }

    public abstract class ItemTitleStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemTitleStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Title { get; }
    }

    public abstract class ItemDescriptionStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemDescriptionStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Description { get; }
    }

    public abstract class ItemActionsStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemActionsStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Actions { get; }
    }

    public abstract class ItemHeaderStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemHeaderStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Header { get; }
    }

    public abstract class ItemFooterStylesBase
    {
        protected readonly RzTheme Theme;
        protected ItemFooterStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Footer { get; }
    }
}