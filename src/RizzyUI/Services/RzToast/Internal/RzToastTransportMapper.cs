namespace RizzyUI.Services.RzToast.Internal;

internal static class RzToastTransportMapper
{
    public const string ShowCommand = "show";
    public const string UpdateCommand = "update";
    public const string DismissCommand = "dismiss";
    public const string ClearCommand = "clear";

    public static RzToastTransportOptions MapShow(RzToastMessage message, string id)
    {
        ArgumentNullException.ThrowIfNull(message);
        ValidateOptions(message);
        ValidateAction(message.Action);

        return MapOptions(message) with
        {
            Id = id,
            Status = MapStatus(message.Status),
            Title = message.Title,
            Text = message.Text,
        };
    }

    public static RzToastTransportOptions MapUpdate(RzToastUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update);
        ValidateOptions(update);
        ValidateAction(update.Action);

        return MapOptions(update) with
        {
            Id = null,
            Status = update.Status is { } status ? MapStatus(status) : null,
            Title = update.Title,
            Text = update.Text,
        };
    }

    public static string MapStatus(ToastStatus status) => status switch
    {
        ToastStatus.Default => "default",
        ToastStatus.Info => "info",
        ToastStatus.Success => "success",
        ToastStatus.Warning => "warning",
        ToastStatus.Error => "error",
        ToastStatus.Loading => "loading",
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, "Unsupported toast status."),
    };

    private static RzToastTransportOptions MapOptions(RzToastOptions options) => new()
    {
        Id = options.Id,
        Position = options.Position is { } position ? MapPosition(position) : null,
        Tone = options.Tone is { } tone ? MapTone(tone) : null,
        Animation = options.Animation is { } animation ? MapAnimation(animation) : null,
        Duration = options.Duration,
        Speed = options.Speed,
        AutoClose = options.AutoClose,
        Dismissible = options.Dismissible,
        ShowIcon = options.ShowIcon,
        Progress = options.Progress,
        PauseOnHover = options.PauseOnHover,
        PauseOnFocus = options.PauseOnFocus,
        PauseOnWindowBlur = options.PauseOnWindowBlur,
        CloseOnEscape = options.CloseOnEscape,
        PreventDuplicates = options.PreventDuplicates,
        DedupeKey = options.DedupeKey,
        IncrementCount = options.IncrementCount,
        MaxVisible = options.MaxVisible,
        NewestOnTop = options.NewestOnTop,
        OverflowStrategy = options.OverflowStrategy is { } overflow ? MapOverflowStrategy(overflow) : null,
        CustomClass = options.CustomClass,
        ClassNames = options.ClassNames,
        Role = options.Role,
        AriaLive = options.AriaLive,
        Data = options.Data,
        Action = options.Action is { } action ? MapAction(action) : null,
    };

    private static RzToastTransportAction MapAction(RzToastAction action) => new()
    {
        Label = action.Label,
        EventName = action.EventName,
        Detail = action.Detail,
        DismissOnClick = action.DismissOnClick,
    };

    private static void ValidateOptions(RzToastOptions options)
    {
        if (options.Duration is < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(options), options.Duration, "Toast duration must be greater than or equal to zero.");
        }

        if (options.Speed is < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(options), options.Speed, "Toast speed must be greater than or equal to zero.");
        }

        if (options.MaxVisible is < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(options), options.MaxVisible, "Toast maxVisible must be greater than or equal to zero.");
        }
    }

    private static void ValidateAction(RzToastAction? action)
    {
        if (action is null)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(action.Label))
        {
            throw new ArgumentException("Toast action label must not be blank.", nameof(action));
        }

        if (string.IsNullOrWhiteSpace(action.EventName))
        {
            throw new ArgumentException("Toast action event name must not be blank.", nameof(action));
        }
    }

    private static string MapPosition(ToastPosition position) => position switch
    {
        ToastPosition.TopLeft => "top-left",
        ToastPosition.TopCenter => "top-center",
        ToastPosition.TopRight => "top-right",
        ToastPosition.BottomLeft => "bottom-left",
        ToastPosition.BottomCenter => "bottom-center",
        ToastPosition.BottomRight => "bottom-right",
        ToastPosition.Center => "center",
        ToastPosition.LeftCenter => "left-center",
        ToastPosition.RightCenter => "right-center",
        _ => throw new ArgumentOutOfRangeException(nameof(position), position, "Unsupported toast position."),
    };

    private static string MapTone(ToastTone tone) => tone switch
    {
        ToastTone.Subtle => "subtle",
        ToastTone.Solid => "solid",
        ToastTone.Outline => "outline",
        ToastTone.Ghost => "ghost",
        _ => throw new ArgumentOutOfRangeException(nameof(tone), tone, "Unsupported toast tone."),
    };

    private static string MapAnimation(ToastAnimation animation) => animation switch
    {
        ToastAnimation.Fade => "fade",
        ToastAnimation.Slide => "slide",
        ToastAnimation.None => "none",
        _ => throw new ArgumentOutOfRangeException(nameof(animation), animation, "Unsupported toast animation."),
    };

    private static string MapOverflowStrategy(ToastOverflowStrategy overflowStrategy) => overflowStrategy switch
    {
        ToastOverflowStrategy.DismissOldest => "dismiss-oldest",
        ToastOverflowStrategy.IgnoreNewest => "ignore-newest",
        _ => throw new ArgumentOutOfRangeException(nameof(overflowStrategy), overflowStrategy, "Unsupported toast overflow strategy."),
    };
}
