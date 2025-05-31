
namespace RizzyUI;

/// <summary> Provides default styles for RzCard. </summary>
public class DefaultRzCardStyles : RzStylesBase.RzCardStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container =>
        "flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-card text-card-foreground"; // Matches kitchen sink .card
}

/// <summary> Provides default styles for RzCardHeader. </summary>
public class DefaultRzCardHeaderStyles : RzStylesBase.RzCardHeaderStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardHeaderStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardHeaderStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Header =>
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"; // Matches kitchen sink > header
}

/// <summary> Provides default styles for RzCardBody. </summary>
public class DefaultRzCardBodyStyles : RzStylesBase.RzCardBodyStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardBodyStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardBodyStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Body => "px-6"; // Matches kitchen sink > section (for body content)
}

/// <summary> Provides default styles for RzCardFooter. </summary>
public class DefaultRzCardFooterStyles : RzStylesBase.RzCardFooterStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardFooterStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardFooterStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Footer => "flex items-center px-6 [.border-t]:pt-6"; // Matches kitchen sink > footer
}

/// <summary> Provides default styles for RzCardTitle. </summary>
public class DefaultRzCardTitleStyles : RzStylesBase.RzCardTitleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardTitleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardTitleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Title =>
        "leading-none font-semibold"; // Matches kitchen sink > header h2
}

/// <summary> Provides default styles for RzCardSubtitle. </summary>
public class DefaultRzCardSubtitleStyles : RzStylesBase.RzCardSubtitleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardSubtitleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardSubtitleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Subtitle => "text-muted-foreground text-sm"; // Matches kitchen sink > header p
}

/// <summary> Provides default styles for RzCardButtons. </summary>
public class DefaultRzCardButtonsStyles : RzStylesBase.RzCardButtonsStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCardButtonsStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCardButtonsStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string ButtonsContainer => "flex flex-col items-center gap-2 sm:flex-row"; // Adapted from kitchen sink card footer button layout
}