using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Services.RzToast.Internal;

namespace RizzyUI.Services.RzToast;

/// <summary>
/// Request-scoped implementation of <see cref="IRzToastService"/> that queues ordered RizzyUI toast commands for HTMX transport.
/// </summary>
public sealed class RzToastService : IRzToastService
{
    private readonly RzToastCommandQueue _queue;

    /// <summary>
    /// Initializes a new instance of the <see cref="RzToastService"/> class.
    /// </summary>
    /// <param name="serviceProvider">The request service provider containing the scoped internal command queue.</param>
    public RzToastService(IServiceProvider serviceProvider)
    {
        ArgumentNullException.ThrowIfNull(serviceProvider);
        _queue = serviceProvider.GetRequiredService<RzToastCommandQueue>();
    }

    /// <inheritdoc />
    public RzToastHandle Show(RzToastMessage message)
    {
        ArgumentNullException.ThrowIfNull(message);

        if (string.IsNullOrWhiteSpace(message.Title) && string.IsNullOrWhiteSpace(message.Text))
        {
            throw new ArgumentException("A toast requires a non-blank title or text.", nameof(message));
        }

        var id = string.IsNullOrWhiteSpace(message.Id) ? CreateId() : message.Id!;
        var options = RzToastTransportMapper.MapShow(message, id);
        _queue.Enqueue(new RzToastTransportCommand
        {
            Type = RzToastTransportMapper.ShowCommand,
            Options = options,
        });

        return new RzToastHandle(id, this);
    }

    /// <inheritdoc />
    public RzToastHandle Custom(RzToastMessage message) => Show(message);

    /// <inheritdoc />
    public RzToastHandle Success(string text, string title = "Success", RzToastOptions? options = null) =>
        Show(CreateMessage(ToastStatus.Success, text, title, options));

    /// <inheritdoc />
    public RzToastHandle Error(string text, string title = "Error", RzToastOptions? options = null) =>
        Show(CreateMessage(ToastStatus.Error, text, title, options));

    /// <inheritdoc />
    public RzToastHandle Warning(string text, string title = "Warning", RzToastOptions? options = null) =>
        Show(CreateMessage(ToastStatus.Warning, text, title, options));

    /// <inheritdoc />
    public RzToastHandle Info(string text, string title = "Info", RzToastOptions? options = null) =>
        Show(CreateMessage(ToastStatus.Info, text, title, options));

    /// <inheritdoc />
    public RzToastHandle Loading(string text, string title = "Loading", RzToastOptions? options = null)
    {
        var loadingOptions = CopyOptions(options) with
        {
            AutoClose = options?.AutoClose ?? false,
            Progress = options?.Progress ?? false,
        };

        return Show(CreateMessage(ToastStatus.Loading, text, title, loadingOptions));
    }

    /// <inheritdoc />
    public void Update(string id, RzToastUpdate update)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("A toast id is required to update a toast.", nameof(id));
        }

        ArgumentNullException.ThrowIfNull(update);

        var options = RzToastTransportMapper.MapUpdate(update);
        _queue.Enqueue(new RzToastTransportCommand
        {
            Type = RzToastTransportMapper.UpdateCommand,
            Id = id,
            Options = options,
        });
    }

    /// <inheritdoc />
    public void Dismiss(string? id = null)
    {
        _queue.Enqueue(new RzToastTransportCommand
        {
            Type = RzToastTransportMapper.DismissCommand,
            Id = string.IsNullOrWhiteSpace(id) ? null : id,
        });
    }

    /// <inheritdoc />
    public void Clear()
    {
        _queue.Enqueue(new RzToastTransportCommand
        {
            Type = RzToastTransportMapper.ClearCommand,
        });
    }

    private static RzToastMessage CreateMessage(ToastStatus status, string text, string title, RzToastOptions? options)
    {
        var copied = CopyOptions(options);
        return new RzToastMessage
        {
            Id = copied.Id,
            Position = copied.Position,
            Tone = copied.Tone,
            Animation = copied.Animation,
            Duration = copied.Duration,
            Speed = copied.Speed,
            AutoClose = copied.AutoClose,
            Dismissible = copied.Dismissible,
            ShowIcon = copied.ShowIcon,
            Progress = copied.Progress,
            PauseOnHover = copied.PauseOnHover,
            PauseOnFocus = copied.PauseOnFocus,
            PauseOnWindowBlur = copied.PauseOnWindowBlur,
            CloseOnEscape = copied.CloseOnEscape,
            PreventDuplicates = copied.PreventDuplicates,
            DedupeKey = copied.DedupeKey,
            IncrementCount = copied.IncrementCount,
            MaxVisible = copied.MaxVisible,
            NewestOnTop = copied.NewestOnTop,
            OverflowStrategy = copied.OverflowStrategy,
            CustomClass = copied.CustomClass,
            ClassNames = copied.ClassNames,
            Role = copied.Role,
            AriaLive = copied.AriaLive,
            Data = copied.Data,
            Action = copied.Action,
            Status = status,
            Title = title,
            Text = text,
        };
    }

    private static RzToastOptions CopyOptions(RzToastOptions? options) => options is null
        ? new RzToastOptions()
        : new RzToastOptions
        {
            Id = options.Id,
            Position = options.Position,
            Tone = options.Tone,
            Animation = options.Animation,
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
            OverflowStrategy = options.OverflowStrategy,
            CustomClass = options.CustomClass,
            ClassNames = options.ClassNames,
            Role = options.Role,
            AriaLive = options.AriaLive,
            Data = options.Data,
            Action = options.Action,
        };

    private static string CreateId() => $"rz-toast-{Guid.NewGuid():N}";
}
