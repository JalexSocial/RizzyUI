
// src/RizzyUI/Components/Layout/RzItem/Styling/DefaultRzItemStyles.cs
namespace RizzyUI;

public class DefaultRzItemGroupStyles : RzStylesBase.RzItemGroupStylesBase
{
    public DefaultRzItemGroupStyles(RzTheme theme) : base(theme) { }
    public override string Group => "group/item-group flex flex-col";
}

public class DefaultRzItemSeparatorStyles : RzStylesBase.RzItemSeparatorStylesBase
{
    public DefaultRzItemSeparatorStyles(RzTheme theme) : base(theme) { }
    public override string Separator => "my-0";
}

public class DefaultRzItemStyles : RzStylesBase.RzItemStylesBase
{
    public DefaultRzItemStyles(RzTheme theme) : base(theme) { }
    public override string ItemBase => "group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
    public override string GetVariantCss(ItemVariant variant) => variant switch
    {
        ItemVariant.Outline => "border-border",
        ItemVariant.Muted => "bg-muted/50",
        _ => "bg-transparent"
    };
    public override string GetSizeCss(Size size) => size switch
    {
        Size.Small => "py-3 px-4 gap-2.5",
        _ => "p-4 gap-4"
    };
}

public class DefaultItemMediaStyles : RzStylesBase.ItemMediaStylesBase
{
    public DefaultItemMediaStyles(RzTheme theme) : base(theme) { }
    public override string MediaBase => "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5";
    public override string GetVariantCss(ItemMediaVariant variant) => variant switch
    {
        ItemMediaVariant.Icon => "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
        ItemMediaVariant.Image => "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
        _ => "bg-transparent"
    };
}

public class DefaultItemContentStyles : RzStylesBase.ItemContentStylesBase
{
    public DefaultItemContentStyles(RzTheme theme) : base(theme) { }
    public override string Content => "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none";
}

public class DefaultItemTitleStyles : RzStylesBase.ItemTitleStylesBase
{
    public DefaultItemTitleStyles(RzTheme theme) : base(theme) { }
    public override string Title => "flex w-fit items-center gap-2 text-sm leading-snug font-medium";
}

public class DefaultItemDescriptionStyles : RzStylesBase.ItemDescriptionStylesBase
{
    public DefaultItemDescriptionStyles(RzTheme theme) : base(theme) { }
    public override string Description => "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4";
}

public class DefaultItemActionsStyles : RzStylesBase.ItemActionsStylesBase
{
    public DefaultItemActionsStyles(RzTheme theme) : base(theme) { }
    public override string Actions => "flex items-center gap-2";
}

public class DefaultItemHeaderStyles : RzStylesBase.ItemHeaderStylesBase
{
    public DefaultItemHeaderStyles(RzTheme theme) : base(theme) { }
    public override string Header => "flex basis-full items-center justify-between gap-2";
}

public class DefaultItemFooterStyles : RzStylesBase.ItemFooterStylesBase
{
    public DefaultItemFooterStyles(RzTheme theme) : base(theme) { }
    public override string Footer => "flex basis-full items-center justify-between gap-2";
}