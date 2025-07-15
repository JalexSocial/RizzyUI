
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

/// <summary> Provides default styles for CardHeader. </summary>
public class DefaultCardHeaderStyles : RzStylesBase.CardHeaderStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultCardHeaderStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultCardHeaderStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Header =>
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"; // Matches kitchen sink > header
}

/// <summary> Provides default styles for CardContent. </summary>
public class DefaultCardContentStyles : RzStylesBase.CardContentStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultCardContentStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultCardContentStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Body => "px-6"; 
}

/// <summary> Provides default styles for CardFooter. </summary>
public class DefaultCardFooterStyles : RzStylesBase.CardFooterStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultCardFooterStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultCardFooterStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Footer => "flex items-center px-6 [.border-t]:pt-6"; // Matches kitchen sink > footer
}

/// <summary> Provides default styles for CardTitle. </summary>
public class DefaultCardTitleStyles : RzStylesBase.CardTitleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultCardTitleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultCardTitleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Title =>
        "leading-none font-semibold";
}

/// <summary> Provides default styles for CardDescription. </summary>
public class DefaultCardDescriptionStyles : RzStylesBase.CardDescriptionStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultCardDescriptionStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultCardDescriptionStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Subtitle => "text-muted-foreground text-sm";
}

/// <summary> Provides default styles for CardButtons. </summary>
public class DefaultCardButtonsStyles : RzStylesBase.CardButtonsStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultCardButtonsStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultCardButtonsStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string ButtonsContainer => "flex flex-col items-center gap-2 sm:flex-row"; 
}