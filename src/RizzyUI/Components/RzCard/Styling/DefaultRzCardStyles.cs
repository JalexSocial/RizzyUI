using RizzyUI.Styling;

namespace RizzyUI.Components.RzCard.Styling;

/// <summary> Provides default styles for RzCard. </summary>
public  class DefaultRzCardStyles : RzStylesBase.RzCardStylesBase
{
    public DefaultRzCardStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Container => $"flex flex-col rounded-borderRadius overflow-hidden shadow-sm border border-outline";
}

/// <summary> Provides default styles for RzCardHeader. </summary>
public  class DefaultRzCardHeaderStyles : RzStylesBase.RzCardHeaderStylesBase
{
    public DefaultRzCardHeaderStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Header => "flex flex-col gap-3 px-5 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left";
}

/// <summary> Provides default styles for RzCardBody. </summary>
public  class DefaultRzCardBodyStyles : RzStylesBase.RzCardBodyStylesBase
{
    public DefaultRzCardBodyStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Body => "grow p-5";
}

/// <summary> Provides default styles for RzCardFooter. </summary>
public  class DefaultRzCardFooterStyles : RzStylesBase.RzCardFooterStylesBase
{
    public DefaultRzCardFooterStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Footer => $"px-5 py-4 text-sm last:rounded-b-borderRadius";
}

/// <summary> Provides default styles for RzCardTitle. </summary>
public  class DefaultRzCardTitleStyles : RzStylesBase.RzCardTitleStylesBase
{
    public DefaultRzCardTitleStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Title => $"flex items-center mb-1 text-lg font-semibold text-{Theme.Light.OnSurfaceStrong.TailwindClassName}";
}

/// <summary> Provides default styles for RzCardSubtitle. </summary>
public  class DefaultRzCardSubtitleStyles : RzStylesBase.RzCardSubtitleStylesBase
{
    public DefaultRzCardSubtitleStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Subtitle => $"text-sm font-medium text-on-surface";
}

/// <summary> Provides default styles for RzCardButtons. </summary>
public  class DefaultRzCardButtonsStyles : RzStylesBase.RzCardButtonsStylesBase
{
     public DefaultRzCardButtonsStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string ButtonsContainer => "md:flex items-center gap-2 md:-my-4";
}

